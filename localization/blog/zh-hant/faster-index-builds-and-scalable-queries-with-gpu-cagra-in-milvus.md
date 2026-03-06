---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: >
  Optimizing NVIDIA CAGRA in Milvus: A Hybrid GPU–CPU Approach to Faster
  Indexing and Cheaper Queries
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: >-
  Learn how GPU_CAGRA in Milvus 2.6 uses GPUs for fast graph construction and
  CPUs for scalable query serving.
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>As AI systems move from experiments to production infrastructure, vector databases are no longer dealing with millions of embeddings. <strong>Billions are now routine, and tens of billions are increasingly common.</strong> At this scale, algorithmic choices affect not only performance and recall, but also translate directly into infrastructure cost.</p>
<p>This leads to a core question for large-scale deployments: <strong>how do you choose the right index to deliver acceptable recall and latency without letting compute resource usage spiral out of control?</strong></p>
<p>Graph-based indexes such as <strong>NSW, HNSW, CAGRA, and Vamana</strong> have become the most widely adopted answer. By navigating pre-built neighborhood graphs, these indexes enable fast nearest-neighbor search at billion scale, avoiding brute-force scanning and comparison of every vector against the query.</p>
<p>However, the cost profile of this approach is uneven. <strong>Querying a graph is relatively cheap; constructing it is not.</strong> Building a high-quality graph requires large-scale distance computations and iterative refinement across the entire dataset—workloads that traditional CPU resources struggle to handle efficiently as data grows.</p>
<p>NVIDIA’s CAGRA addresses this bottleneck by using GPUs to accelerate graph construction through massive parallelism. While this significantly reduces build time, relying on GPUs for both index construction and query serving introduces higher cost and scalability constraints in production environments.</p>
<p>To balance these tradeoffs, <a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1</a> <strong>adopts a hybrid design for</strong> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a> <strong>indexes</strong>: <strong>GPUs are used only for graph construction, while query execution runs on CPUs.</strong> This preserves the quality advantages of GPU-built graphs while keeping query serving scalable and cost-efficient—making it especially well suited for workloads with infrequent data updates, large query volumes, and strict cost sensitivity.</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">What Is CAGRA and How Does It Work?<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Graph-based vector indexes generally fall into two major categories:</p>
<ul>
<li><p><strong>Iterative graph construction</strong>, represented by <strong>CAGRA</strong> (already supported in Milvus).</p></li>
<li><p><strong>Insert-based graph construction</strong>, represented by <strong>Vamana</strong> (currently under development in Milvus).</p></li>
</ul>
<p>These two approaches differ significantly in their design goals and technical foundations, making each suitable for different data scales and workload patterns.</p>
<p><strong>NVIDIA CAGRA (CUDA ANN Graph-based)</strong> is a GPU-native algorithm for approximate nearest neighbor (ANN) search, designed for building and querying large-scale proximity graphs efficiently. By leveraging GPU parallelism, CAGRA significantly accelerates graph construction and delivers high-throughput query performance compared with CPU-based approaches such as HNSW.</p>
<p>CAGRA is built on the <strong>NN-Descent (Nearest Neighbor Descent)</strong> algorithm, which constructs a k-nearest-neighbor (kNN) graph through iterative refinement. In each iteration, candidate neighbors are evaluated and updated, gradually converging toward higher-quality neighborhood relationships across the dataset.</p>
<p>After each refinement round, CAGRA applies additional graph pruning techniques—such as <strong>2-hop detour pruning</strong>—to remove redundant edges while preserving search quality. This combination of iterative refinement and pruning results in a <strong>compact yet well-connected graph</strong> that is efficient to traverse at query time.</p>
<p>Through repeated refinement and pruning, CAGRA produces a graph structure that supports <strong>high recall and low-latency nearest-neighbor search at large scale</strong>, making it particularly well suited for static or infrequently updated datasets.</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">Step 1: Building the Initial Graph with NN-Descent</h3><p>NN-Descent is based on a simple but powerful observation: if node <em>u</em> is a neighbor of <em>v</em>, and node <em>w</em> is a neighbor of <em>u</em>, then <em>w</em> is very likely a neighbor of <em>v</em> as well. This transitive property allows the algorithm to discover true nearest neighbors efficiently, without exhaustively comparing every pair of vectors.</p>
<p>CAGRA uses NN-Descent as its core graph construction algorithm. The process works as follows:</p>
<p><strong>1. Random initialization:</strong> Each node starts with a small set of randomly selected neighbors, forming a rough initial graph.</p>
<p><strong>2. Neighbor expansion:</strong> In each iteration, a node gathers its current neighbors and their neighbors to form a candidate list. The algorithm computes similarities between the node and all candidates. Because each node’s candidate list is independent, these computations can be assigned to separate GPU thread blocks and executed in parallel at a massive scale.</p>
<p><strong>3. Candidate list update:</strong> If the algorithm finds candidates that are closer than the node’s current neighbors, it swaps out the more distant neighbors and updates the node’s kNN list. Over multiple iterations, this process produces a much higher-quality approximate kNN graph.</p>
<p><strong>4. Convergence check:</strong> As iterations progress, fewer neighbor updates occur. Once the number of updated connections drops below a set threshold, the algorithm stops, indicating the graph has effectively stabilized.</p>
<p>Because neighbor expansion and similarity computation for different nodes are fully independent, CAGRA maps each node’s NN-Descent workload to a dedicated GPU thread block. This design enables massive parallelism and makes graph construction orders of magnitude faster than traditional CPU-based methods.</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">Step 2: Pruning the Graph with 2-Hop Detours</h3><p>After NN-Descent completes, the resulting graph is accurate but overly dense. NN-Descent intentionally keeps extra candidate neighbors, and the random initialization phase introduces many weak or irrelevant edges. As a result, each node often ends up with a degree two times—or even several times—higher than the target degree.</p>
<p>To produce a compact and efficient graph, CAGRA applies 2-hop detour pruning.</p>
<p>The idea is straightforward: if node <em>A</em> can reach node <em>B</em> indirectly through a shared neighbor <em>C</em> (forming a path A → C → B), and the distance of this indirect path is comparable to the direct distance between <em>A</em> and <em>B</em>, then the direct edge A → B is considered redundant and can be removed.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A key advantage of this pruning strategy is that each edge’s redundancy check depends only on local information—the distances between the two endpoints and their shared neighbors. Because every edge can be evaluated independently, the pruning step is highly parallelizable and fits naturally onto GPU batch execution.</p>
<p>As a result, CAGRA can prune the graph efficiently on GPUs, reducing storage overhead by <strong>40–50%</strong> while preserving search accuracy and improving traversal speed during query execution.</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">GPU_CAGRA in Milvus: What’s Different?<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>While GPUs offer major performance advantages for graph construction, production environments face a practical challenge: GPU resources are far more expensive and limited than CPUs. If both index building and query execution depend solely on GPUs, several operational issues quickly emerge:</p>
<ul>
<li><p><strong>Low resource utilization:</strong> Query traffic is often irregular and bursty, leaving GPUs idle for long periods and wasting expensive compute capacity.</p></li>
<li><p><strong>High deployment cost:</strong> Assigning a GPU to every query-serving instance drives up hardware costs, even though most queries do not fully utilize GPU performance.</p></li>
<li><p><strong>Limited scalability:</strong> The number of GPUs available directly caps how many service replicas you can run, restricting your ability to scale with demand.</p></li>
<li><p><strong>Reduced flexibility:</strong> When both index building and querying depend on GPUs, the system becomes tied to GPU availability and cannot easily shift workloads to CPUs.</p></li>
</ul>
<p>To address these constraints, Milvus 2.6.1 introduces a flexible deployment mode for the GPU_CAGRA index through the <code translate="no">adapt_for_cpu</code> parameter. This mode enables a hybrid workflow: CAGRA uses the GPU to build a high-quality graph index, while query execution runs on the CPU—typically using HNSW as the search algorithm.</p>
<p>In this setup, GPUs are used where they deliver the most value—fast, high-accuracy index construction—while CPUs handle large-scale query workloads in a far more cost-effective and scalable manner.</p>
<p>As a result, this hybrid approach is particularly well suited for workloads where:</p>
<ul>
<li><p><strong>Data updates are infrequent</strong>, so index rebuilds are rare</p></li>
<li><p><strong>Query volume is high</strong>, requiring many inexpensive replicas</p></li>
<li><p><strong>Cost sensitivity is high</strong>, and GPU usage must be tightly controlled</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">Understanding <code translate="no">adapt_for_cpu</code></h3><p>In Milvus, the <code translate="no">adapt_for_cpu</code> parameter controls how a CAGRA index is serialized to disk during index building and how it is deserialized into memory at load time. By changing this setting at build time and load time, Milvus can flexibly switch between GPU-based index construction and CPU-based query execution.</p>
<p>Different combinations of <code translate="no">adapt_for_cpu</code> at build time and load time result in four execution modes, each designed for a specific operational scenario.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Build Time (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Load Time (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Execution Logic</strong></th><th style="text-align:center"><strong>Recommended Scenario</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>true</strong></td><td style="text-align:center"><strong>true</strong></td><td style="text-align:center">Build with GPU_CAGRA → serialize as HNSW → deserialize as HNSW → <strong>CPU querying</strong></td><td style="text-align:center">Cost-sensitive workloads; large-scale query serving</td></tr>
<tr><td style="text-align:center"><strong>true</strong></td><td style="text-align:center"><strong>false</strong></td><td style="text-align:center">Build with GPU_CAGRA → serialize as HNSW → deserialize as HNSW → <strong>CPU querying</strong></td><td style="text-align:center">Ensuing queries fall back to the CPU when parameter mismatches occur</td></tr>
<tr><td style="text-align:center"><strong>false</strong></td><td style="text-align:center"><strong>true</strong></td><td style="text-align:center">Build with GPU_CAGRA → serialize as CAGRA → deserialize as HNSW → <strong>CPU querying</strong></td><td style="text-align:center">Keeping the original CAGRA index for storage while enabling a temporary CPU search</td></tr>
<tr><td style="text-align:center"><strong>false</strong></td><td style="text-align:center"><strong>false</strong></td><td style="text-align:center">Build with GPU_CAGRA → serialize as CAGRA → deserialize as CAGRA → <strong>GPU querying</strong></td><td style="text-align:center">Performance-critical workloads where cost is secondary</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> The <code translate="no">adapt_for_cpu</code> mechanism supports only one-way conversion. A CAGRA index can be converted into HNSW because the CAGRA graph structure preserves all neighbor relationships that HNSW needs. However, an HNSW index cannot be converted back to CAGRA, as it lacks the additional structural information needed for GPU-based querying. As a result, the build-time settings should be selected carefully, with consideration for long-term deployment and querying requirements.</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">Putting GPU_CAGRA to the Test<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>To evaluate the effectiveness of the hybrid execution model—using GPUs for index construction and CPUs for query execution—we conducted a series of controlled experiments in a standardized environment. The evaluation focuses on three dimensions: <strong>index build performance</strong>, <strong>query performance</strong>, and <strong>recall accuracy</strong>.</p>
<p><strong>Experimental Setup</strong></p>
<p>The experiments were performed on widely adopted, industry-standard hardware to ensure the results remain reliable and broadly applicable.</p>
<ul>
<li><p>CPU: MD EPYC 7R13 Processor(16 cpus)</p></li>
<li><p>GPU: NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1. Index Build Performance</h3><p>We compare CAGRA built on the GPU with HNSW built on the CPU, under the same target graph degree of 64.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Key Findings</strong></p>
<ul>
<li><p><strong>GPU CAGRA builds indexes 12–15× faster than CPU HNSW.</strong> On both Cohere1M and Gist1M, GPU-based CAGRA significantly outperforms CPU-based HNSW, highlighting the efficiency of GPU parallelism during graph construction.</p></li>
<li><p><strong>Build time increases linearly with NN-Descent iterations.</strong> As iteration counts rise, build time grows in a near-linear manner, reflecting the iterative refinement nature of NN-Descent and providing a predictable trade-off between build cost and graph quality.</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2. Query performance</h3><p>In this experiment, the CAGRA graph is built once on the GPU and then queried using two different execution paths:</p>
<ul>
<li><p><strong>CPU querying</strong>: the index is deserialized into HNSW format and searched on the CPU</p></li>
<li><p><strong>GPU querying</strong>: search runs directly on the CAGRA graph using GPU-based traversal</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Key Findings</strong></p>
<ul>
<li><p><strong>GPU search throughput is 5–6× higher than CPU search.</strong> Across both Cohere1M and Gist1M, GPU-based traversal delivers substantially higher QPS, highlighting the efficiency of parallel graph navigation on GPUs.</p></li>
<li><p><strong>Recall increases with NN-Descent iterations, then plateaus.</strong> As the number of build iterations grows, recall improves for both CPU and GPU querying. However, beyond a certain point, additional iterations yield diminishing gains, indicating that graph quality has largely converged.</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3. Recall accuracy</h3><p>In this experiment, both CAGRA and HNSW are queried on the CPU to compare recall under identical query conditions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Key Findings</strong></p>
<p><strong>CAGRA achieves higher recall than HNSW on both datasets</strong>, showing that even when a CAGRA index is built on the GPU and deserialized for CPU search, the graph quality is well preserved.</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">What’s Next: Scaling Index Construction with Vamana<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus’s hybrid GPU–CPU approach offers a practical and cost-efficient solution for today’s large-scale vector search workloads. By building high-quality CAGRA graphs on GPUs and serving queries on CPUs, it combines fast index construction with scalable, affordable query execution—<strong>particularly well suited for workloads with infrequent updates, high query volumes, and strict cost constraints.</strong></p>
<p>At even larger scales—<strong>tens or hundreds of billions of vectors</strong>—index construction itself becomes the bottleneck. When the full dataset no longer fits into GPU memory, the industry typically turns to <strong>insert-based graph construction</strong> methods such as <strong>Vamana</strong>. Instead of building the graph all at once, Vamana processes data in batches, incrementally inserting new vectors while maintaining global connectivity.</p>
<p>Its construction pipeline follows three key stages:</p>
<p><strong>1. Geometric batch growth</strong> — beginning with small batches to form a skeleton graph, then increasing batch size to maximize parallelism, and finally using large batches to refine details.</p>
<p><strong>2. Greedy insertion</strong> — each new node is inserted by navigating from a central entry point, iteratively refining its neighbor set.</p>
<p><strong>3. Backward edge updates</strong> — adding reverse connections to preserve symmetry and ensure efficient graph navigation.</p>
<p>Pruning is integrated directly into the construction process using the α-RNG criterion: if a candidate neighbor <em>v</em> is already covered by an existing neighbor <em>p′</em> (i.e., <em>d(p′, v) &lt; α × d(p, v)</em>), then <em>v</em> is pruned. The parameter α allows precise control over sparsity and accuracy. GPU acceleration is achieved through in-batch parallelism and geometric batch scaling, striking a balance between index quality and throughput.</p>
<p>Together, these techniques enable teams to handle rapid data growth and large-scale index updates without running into GPU memory limitations.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The Milvus team is actively building Vamana support, with a targeted release in the first half of 2026. Stay tuned.</p>
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
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus</a></p></li>
</ul>
