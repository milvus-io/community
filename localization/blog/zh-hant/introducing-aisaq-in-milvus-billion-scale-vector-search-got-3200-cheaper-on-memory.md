---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >
  Introducing AISAQ in Milvus: Billion-Scale Vector Search Just Got 3,200×
  Cheaper on Memory
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: >-
  Discover how Milvus reduces memory costs by 3200× with AISAQ, enabling
  scalable billion-vector search without DRAM overhead.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Vector databases have become core infrastructure for mission-critical AI systems, and their data volumes are growing exponentially—often reaching billions of vectors. At that scale, everything becomes harder: maintaining low latency, preserving accuracy, ensuring reliability, and operating across replicas and regions. But one challenge tends to surface early and dominate architectural decisions—<strong>COST.</strong></p>
<p>To deliver fast search, most vector databases keep key indexing structures in DRAM (Dynamic Random Access Memory), the fastest and most expensive tier of memory. This design is effective for performance, but it scales poorly. DRAM usage scales with data size rather than query traffic, and even with compression or partial SSD offloading, large portions of the index must remain in memory. As datasets grow, memory costs quickly become a limiting factor.</p>
<p>Milvus already supports <strong>DISKANN</strong>, a disk-based ANN approach that reduces memory pressure by moving much of the index onto SSD. However, DISKANN still relies on DRAM for compressed representations used during search. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> takes this further with <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, a disk-based vector index inspired by <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Developed by KIOXIA, AiSAQ’s architecture was designed with a “Zero-DRAM-Footprint Architecture”, which stores all search-critical data on disk and optimizes data placement to minimize I/O operations. In a billion-vector workload, this reduces memory usage from <strong>32 GB to about 10 MB</strong>—a <strong>3,200× reduction</strong>—while maintaining practical performance.</p>
<p>In the sections that follow, we explain how graph-based vector search works, where memory costs come from, and how AISAQ reshapes the cost curve for billion-scale vector search.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">How Conventional Graph-Based Vector Search Works<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><strong>Vector search</strong> is the process of finding data points whose numerical representations are closest to a query in a high-dimensional space. “Closest” simply means the smallest distance according to a distance function, such as cosine distance or L2 distance. At a small scale, this is straightforward: compute the distance between the query and every vector, then return the nearest ones. At a large scale, say billion-scale, however, this approach quickly becomes too slow to be practical.</p>
<p>To avoid exhaustive comparisons, modern approximate nearest neighbor search (ANNS) systems rely on <strong>graph-based indices</strong>. Instead of comparing a query against every vector, the index organizes vectors into a <strong>graph</strong>. Each node represents a vector, and edges connect vectors that are numerically close. This structure allows the system to narrow the search space dramatically.</p>
<p>The graph is built in advance, based solely on relationships between vectors. It does not depend on queries. When a query arrives, the system’s task is to <strong>navigate the graph efficiently</strong> and identify the vectors with the smallest distance to the query—without scanning the entire dataset.</p>
<p>The search begins from a predefined <strong>entry point</strong> in the graph. This starting point may be far from the query, but the algorithm improves its position step by step by moving toward vectors that appear closer to the query. During this process, the search maintains two internal data structures that work together: a <strong>candidate list</strong> and a <strong>result list</strong>.</p>
<p>And the two most important steps during this process are expanding the candidate list and updating the result list.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Expanding the Candidate List</h3><p>The <strong>candidate list</strong> represents where the search can go next. It is a prioritized set of graph nodes that appear promising based on their distance to the query.</p>
<p>At each iteration, the algorithm:</p>
<ul>
<li><p><strong>Selects the closest candidate discovered so far.</strong> From the candidate list, it chooses the vector with the smallest distance to the query.</p></li>
<li><p><strong>Retrieves that vector’s neighbors from the graph.</strong> These neighbors are vectors that were identified during index construction as being close to the current vector.</p></li>
<li><p><strong>Evaluates unvisited neighbors and adds them to the candidate list.</strong> For each neighbor that has not already been explored, the algorithm computes its distance to the query. Previously visited neighbors are skipped, while new neighbors are inserted into the candidate list if they appear promising.</p></li>
</ul>
<p>By repeatedly expanding the candidate list, the search explores increasingly relevant regions of the graph. This allows the algorithm to move steadily toward better answers while examining only a small fraction of all vectors.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Updating the Result List</h3><p>At the same time, the algorithm maintains a <strong>result list</strong>, which records the best candidates found so far for the final output. As the search progresses, it:</p>
<ul>
<li><p><strong>Tracks the closest vectors encountered during traversal.</strong> These include vectors selected for expansion as well as others evaluated along the way.</p></li>
<li><p><strong>Stores their distances to the query.</strong> This makes it possible to rank candidates and maintain the current top-K nearest neighbors.</p></li>
</ul>
<p>Over time, as more candidates are evaluated and fewer improvements are found, the result list stabilizes. Once further graph exploration is unlikely to produce closer vectors, the search terminates and returns the result list as the final answer.</p>
<p>In simple terms, the <strong>candidate list controls exploration</strong>, while the <strong>result list captures the best answers discovered so far</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">The Trade-Off in Graph-Based Vector Search<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>This graph-based approach is what makes large-scale vector search practical in the first place. By navigating the graph instead of scanning every vector, the system can find high-quality results while touching only a small fraction of the dataset.</p>
<p>However, this efficiency does not come for free. Graph-based search exposes a fundamental trade-off between <strong>accuracy and cost.</strong></p>
<ul>
<li><p>Exploring more neighbors improves accuracy by covering a larger portion of the graph and reducing the chance of missing true nearest neighbors.</p></li>
<li><p>At the same time, every additional expansion adds work: more distance calculations, more accesses to the graph structure, and more reads of vector data. As the search explores deeper or wider, these costs accumulate. Depending on how the index is designed, they show up as higher CPU usage, increased memory pressure, or additional disk I/O.</p></li>
</ul>
<p>Balancing these opposing forces—high recall versus efficient resource usage—is central to graph-based search design.</p>
<p>Both <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> and <strong>AISAQ</strong> are built around this same tension, but they make different architectural choices about how and where these costs are paid.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">How DISKANN Optimizes Disk-Based Vector Search<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN is the most influential disk-based ANN solution to date and serves as the official baseline for the NeurIPS Big ANN competition, a global benchmark for billion-scale vector search. Its significance lies not just in performance, but in what it proved: <strong>graph-based ANN search does not have to live entirely in memory to be fast</strong>.</p>
<p>By combining SSD-based storage with carefully chosen in-memory structures, DISKANN demonstrated that large-scale vector search could achieve strong accuracy and low latency on commodity hardware—without requiring massive DRAM footprints. It does this by rethinking <em>which parts of the search must be fast</em> and <em>which parts can tolerate slower access</em>.</p>
<p><strong>At a high level, DISKANN keeps the most frequently accessed data in memory, while moving larger, less frequently accessed structures to disk.</strong> This balance is achieved through several key design choices.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Using PQ Distances to Expand the Candidate List</h3><p>Expanding the candidate list is the most frequent operation in graph-based search. Each expansion requires estimating the distance between the query vector and the neighbors of a candidate node. Performing these calculations using full, high-dimensional vectors would require frequent random reads from disk—an expensive operation both computationally and in terms of I/O.</p>
<p>DISKANN avoids this cost by compressing vectors into <strong>Product Quantization (PQ) codes</strong> and keeping them in memory. PQ codes are much smaller than full vectors, but still preserve enough information to estimate distance approximately.</p>
<p>During candidate expansion, DISKANN computes distances using these in-memory PQ codes instead of reading full vectors from SSD. This dramatically reduces disk I/O during graph traversal, allowing the search to quickly and efficiently expand candidates while keeping most SSD traffic out of the critical path.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Co-Locating Full Vectors and Neighbor Lists on Disk</h3><p>Not all data can be compressed or accessed approximately. Once promising candidates have been identified, the search still needs access to two types of data for accurate results:</p>
<ul>
<li><p><strong>Neighbor lists</strong>, to continue graph traversal</p></li>
<li><p><strong>Full (uncompressed) vectors</strong>, for final reranking</p></li>
</ul>
<p>These structures are accessed less frequently than PQ codes, so DISKANN stores them on SSD. To minimize disk overhead, DISKANN places each node’s neighbor list and its full vector in the same physical region on disk. This ensures that a single SSD read can retrieve both.</p>
<p>By co-locating related data, DISKANN reduces the number of random disk accesses required during search. This optimization improves both expansion and reranking efficiency, especially at a large scale.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Parallel Node Expansion for Better SSD Utilization</h3><p>Graph-based ANN search is an iterative process. If each iteration expands only one candidate node, the system issues just a single disk read at a time, leaving most of the SSD’s parallel bandwidth unused. To avoid this inefficiency, DISKANN expands multiple candidates in each iteration and sends parallel read requests to the SSD. This approach makes much better use of available bandwidth and reduces the total number of iterations required.</p>
<p>The <strong>beam_width_ratio</strong> parameter controls how many candidates are expanded in parallel: <strong>Beam width = number of CPU cores × beam_width_ratio.</strong> A higher ratio widens the search—potentially improving accuracy—but also increases computation and disk I/O.</p>
<p>To offset this, DISKANN introduces a <code translate="no">search_cache_budget_gb_ratio</code> that reserves memory to cache frequently accessed data, reducing repeated SSD reads. Together, these mechanisms help DISKANN balance accuracy, latency, and I/O efficiency.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Why This Matters — and Where the Limits Appear</h3><p>DISKANN’s design is a major step forward for disk-based vector search. By keeping PQ codes in memory and pushing larger structures to SSD, it significantly reduces the memory footprint compared to fully in-memory graph indexes.</p>
<p>At the same time, this architecture still depends on <strong>always-on DRAM</strong> for search-critical data. PQ codes, caches, and control structures must remain resident in memory to keep traversal efficient. As datasets grow to billions of vectors and deployments add replicas or regions, that memory requirement can still become a limiting factor.</p>
<p>This is the gap that <strong>AISAQ</strong> is designed to address.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">How AISAQ Works and Why It Matters<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>AISAQ builds directly on the core ideas behind DISKANN but introduces a critical shift: it eliminates <strong>the need to keep PQ data in DRAM</strong>. Instead of treating compressed vectors as search-critical, always-in-memory structures, AISAQ moves them to SSD and redesigns how graph data is laid out on disk to preserve efficient traversal.</p>
<p>To make this work, AISAQ reorganizes node storage so that data needed during graph search—full vectors, neighbor lists, and PQ information—is arranged on disk in patterns optimized for access locality. The goal is not just to push more data to the more economical disk, but to do so <strong>without breaking the search process described earlier</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>To address different application requirements, AISAQ provides two disk-based storage modes: Performance and Scale. From a technical perspective, these modes differ primarily in how PQ-compressed data is stored and accessed during search. From an application perspective, these modes address two distinct types of requirements: low-latency requirements, typical of online semantic search and recommendation systems, and ultra-high-scale requirements, typical of RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance: Optimized for Speed</h3><p>AISAQ-performance keeps all data on disk while maintaining low I/O overhead through data colocation.</p>
<p>In this mode:</p>
<ul>
<li><p>Each node’s full vector, edge list, and its neighbors’ PQ codes are stored together on disk.</p></li>
<li><p>Visiting a node still requires only a <strong>single SSD read</strong>, because all data needed for candidate expansion and evaluation is colocated.</p></li>
</ul>
<p>From the perspective of the search algorithm, this closely mirrors DISKANN’s access pattern. Candidate expansion remains efficient, and runtime performance is comparable, even though all search-critical data now lives on disk.</p>
<p>The trade-off is storage overhead. Because a neighbor’s PQ data may appear in multiple nodes’ disk pages, this layout introduces redundancy and significantly increases the overall index size.</p>
<p>Therefore, the AISAQ-Performance mode prioritizes low I/O latency over disk efficiency. From an application perspective, AiSAQ-Performance mode can deliver latency in the 10 mSec range, as required for online semantic search.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-scale: Optimized for Storage Efficiency</h3><p>AISAQ-Scale takes the opposite approach. It is designed to <strong>minimize disk usage</strong> while still keeping all data on SSD.</p>
<p>In this mode:</p>
<ul>
<li><p>PQ data is stored on disk separately, without redundancy.</p></li>
<li><p>This eliminates redundancy and dramatically reduces index size.</p></li>
</ul>
<p>The trade-off is that accessing a node and its neighbors’ PQ codes may require <strong>multiple SSD reads</strong>, increasing I/O operations during candidate expansion. Left unoptimized, this would significantly slow down search.</p>
<p>To control this overhead, the AISAQ-Scale mode introduces two additional optimizations:</p>
<ul>
<li><p><strong>PQ data rearrangement</strong>, which orders PQ vectors by access priority to improve locality and reduce random reads.</p></li>
<li><p>A <strong>PQ cache in DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), which stores frequently accessed PQ data and avoids repeated disk reads for hot entries.</p></li>
</ul>
<p>With these optimizations, the AISAQ-Scale mode achieves much better storage efficiency than AISAQ-Performance, while maintaining practical search performance. That performance remains lower than DISKANN, but there is no storage overhead (index size is similar to DISKANN) and the memory footprint is dramatically smaller. From an application perspective, AiSAQ provides the means to meet RAG requirements at ultra-high scale.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Key Advantages of AISAQ</h3><p>By moving all search-critical data to disk and redesigning how that data is accessed, AISAQ fundamentally changes the cost and scalability profile of graph-based vector search. Its design delivers three significant advantages.</p>
<p><strong>1. Up to 3,200× Lower DRAM Usage</strong></p>
<p>Product Quantization significantly reduces the size of high-dimensional vectors, but at billion scale, the memory footprint is still substantial. Even after compression, PQ codes must be kept in memory during search in conventional designs.</p>
<p>For example, on <strong>SIFT1B</strong>, a benchmark with one billion 128-dimensional vectors, PQ codes alone require roughly <strong>30–120 GB of DRAM</strong>, depending on configuration. Storing the full, uncompressed vectors would require an additional <strong>~480 GB</strong>. While PQ reduces memory usage by 4–16×, the remaining footprint is still large enough to dominate infrastructure cost.</p>
<p>AISAQ removes this requirement entirely. By storing PQ codes on SSD instead of DRAM, memory is no longer consumed by persistent index data. DRAM is used only for lightweight, transient structures such as candidate lists and control metadata. In practice, this reduces memory usage from tens of gigabytes to <strong>around 10 MB</strong>. In a representative billion-scale configuration, DRAM drops from <strong>32 GB to 10 MB</strong>, a <strong>3,200× reduction</strong>.</p>
<p>Given that SSD storage costs roughly <strong>1/30 the price per unit of capacity</strong> compared to DRAM, this shift has a direct and dramatic impact on total system cost.</p>
<p><strong>2. No Additional I/O Overhead</strong></p>
<p>Moving PQ codes from memory to disk would normally increase the number of I/O operations during search. AISAQ avoids this by carefully controlling <strong>data layout and access patterns</strong>. Rather than scattering related data across the disk, AISAQ co-locates PQ codes, full vectors, and neighbor lists so they can be retrieved together. This ensures that candidate expansion does not introduce additional random reads.</p>
<p>To give users control over the trade-off between index size and I/O efficiency, AISAQ introduces the <code translate="no">inline_pq</code> parameter, which determines how much PQ data is stored inline with each node:</p>
<ul>
<li><p><strong>Lower inline_pq:</strong> smaller index size, but may require extra I/O</p></li>
<li><p><strong>Higher inline_pq:</strong> larger index size, but preserves single-read access</p></li>
</ul>
<p>When configured with <strong>inline_pq = max_degree</strong>, AISAQ reads a node’s full vector, neighbor list, and all PQ codes in one disk operation, matching DISKANN’s I/O pattern while keeping all data on SSD.</p>
<p><strong>3. Sequential PQ Access Improves Computation Efficiency</strong></p>
<p>In DISKANN, expanding a candidate node requires R random memory accesses to fetch the PQ codes of its R neighbors. AISAQ eliminates this randomness by retrieving all PQ codes in a single I/O and storing them sequentially on disk.</p>
<p>Sequential layout provides two important benefits:</p>
<ul>
<li><p><strong>Sequential SSD reads are much faster</strong> than scattered random reads.</p></li>
<li><p><strong>Contiguous data is more cache-friendly</strong>, enabling CPUs to compute PQ distances more efficiently.</p></li>
</ul>
<p>This improves both speed and predictability of PQ distance calculations and helps offset the performance cost of storing PQ codes on SSD rather than DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs. DISKANN: Performance Evaluation<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>After understanding how AISAQ differs architecturally from DISKANN, the next question is straightforward: <strong>how do these design choices affect performance and resource usage in practice?</strong> This evaluation compares AISAQ and DISKANN across three dimensions that matter most at a billion scale: <strong>search performance, memory consumption, and disk usage</strong>.</p>
<p>In particular, we examine how AISAQ behaves as the amount of inlined PQ data (<code translate="no">INLINE_PQ</code>) changes. This parameter directly controls the trade-off between index size, disk I/O, and runtime efficiency. We also evaluate both approaches on <strong>low- and high-dimensional vector workloads, since dimensionality strongly influences the cost of distance computation and</strong> storage requirements.</p>
<h3 id="Setup" class="common-anchor-header">Setup</h3><p>All experiments were conducted on a single-node system to isolate index behavior and avoid interference from network or distributed-system effects.</p>
<p><strong>Hardware configuration:</strong></p>
<ul>
<li><p>CPU: Intel® Xeon® Platinum 8375C CPU @ 2.90GHz</p></li>
<li><p>Memory: Speed: 3200 MT/s, Type: DDR4, Size: 32 GB</p></li>
<li><p>Disk: 500 GB NVMe SSD</p></li>
</ul>
<p><strong>Index Build Parameters</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Query Parameters</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Benchmark Method</h3><p>Both DISKANN and AISAQ were tested using <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, the open-source vector search engine used in Milvus. Two datasets were used in this evaluation:</p>
<ul>
<li><p><strong>SIFT128D (1M vectors):</strong> a well-known 128-dimensional benchmark commonly used for image descriptor search. <em>(Raw dataset size ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1M vectors):</strong> a 768-dimensional embedding set typical of transformer-based semantic search. <em>(Raw dataset size ≈ 2930 MB)</em></p></li>
</ul>
<p>These datasets reflect two distinct real-world scenarios: compact vision features and large semantic embeddings.</p>
<h3 id="Results" class="common-anchor-header">Results</h3><p><strong>Sift128D1M (Full Vector ~488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_53da7b566a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (Full Vector ~2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">Analysis</h3><p><strong>SIFT128D Dataset</strong></p>
<p>On the SIFT128D dataset, AISAQ can match DISKANN’s performance when all PQ data is inlined so that each node’s required data fits entirely into a single 4 KB SSD page (INLINE_PQ = 48). Under this configuration, every piece of information needed during search is colocated:</p>
<ul>
<li><p>Full vector: 512B</p></li>
<li><p>Neighbor list: 48 × 4 + 4 = 196B</p></li>
<li><p>PQ codes of neighbors: 48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>Total: 3780B</p></li>
</ul>
<p>Because the entire node fits within one page, only one I/O is needed per access, and AISAQ avoids random reads of external PQ data.</p>
<p>However, when only part of the PQ data is inlined, the remaining PQ codes must be fetched from elsewhere on disk. This introduces additional random I/O operations, which sharply increase IOPS demand and lead to significant performance drops.</p>
<p><strong>Cohere768D Dataset</strong></p>
<p>ON the Cohere768D dataset, AISAQ performs worse than DISKANN. The reason is that a 768-dimensional vector simply does not fit into one 4 KB SSD page:</p>
<ul>
<li><p>Full vector: 3072B</p></li>
<li><p>Neighbor list: 48 × 4 + 4 = 196B</p></li>
<li><p>PQ codes of neighbors: 48 × (3072B × 0.125) ≈ 18432B</p></li>
<li><p>Total: 21,700 B (≈ 6 pages)</p></li>
</ul>
<p>In this case, even if all PQ codes are inlined, each node spans multiple pages. While the number of I/O operations stays consistent, each I/O must transfer far more data, consuming SSD bandwidth much faster. Once bandwidth becomes the limiting factor, AISAQ cannot keep pace with DISKANN—especially on high-dimensional workloads where per-node data footprints grow quickly.</p>
<p><strong>Note:</strong></p>
<p>AISAQ’s storage layout typically increases the on-disk index size by <strong>4× to 6×</strong>. This is a deliberate trade-off: full vectors, neighbor lists, and PQ codes are colocated on disk to enable efficient single-page access during search. While this increases SSD usage, disk capacity is significantly cheaper than DRAM and scales more easily at large data volumes.</p>
<p>In practice, users can tune this trade-off by adjusting <code translate="no">INLINE_PQ</code> and PQ compression ratios. These parameters make it possible to balance search performance, disk footprint, and overall system cost based on workload requirements, rather than being constrained by fixed memory limits.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>The economics of modern hardware are changing. DRAM prices remain high, while SSD performance has advanced rapidly—PCIe 5.0 drives now deliver bandwidth exceeding <strong>14 GB/s</strong>. As a result, architectures that shift search-critical data from expensive DRAM to far more affordable SSD storage are becoming increasingly compelling. With SSD capacity costing <strong>less than 30 times as much per gigabyte as</strong> DRAM, these differences are no longer marginal—they meaningfully influence system design.</p>
<p>AISAQ reflects this shift. By eliminating the need for large, always-on memory allocations, it enables vector search systems to scale based on data size and workload requirements rather than DRAM limits. This approach aligns with a broader trend toward “all-in-storage” architectures, where fast SSDs play a central role not just in persistence, but in active computation and search. By offering two operating modes – Performance and Scale – AiSAQ meets the requirements of both semantic search (which requires the lowest latency) and RAG (which requires very high scale, but moderate latency).</p>
<p>This shift is unlikely to be confined to vector databases. Similar design patterns are already emerging in graph processing, time-series analytics, and even parts of traditional relational systems, as developers rethink long-standing assumptions about where data must reside to achieve acceptable performance. As hardware economics continue to evolve, system architectures will follow.</p>
<p>For more details on the designs discussed here, see the documentation:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus Documentation</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus Documentation</a></p></li>
</ul>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Learn More about Milvus 2.6 Features<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Introducing Milvus 2.6: Affordable Vector Search at Billion Scale</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization and Semantic Search</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88.9x Faster JSON Filtering with Flexibility</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Unlocking True Entity-Level Retrieval: New Array-of-Structs and MAX_SIM Capabilities in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie — Vector DBs Deserve a Real Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vector Search in the Real World: How to Filter Efficiently Without Killing Recall</a></p></li>
</ul>
