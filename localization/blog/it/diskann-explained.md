---
id: diskann-explained.md
title: DiskANN Explained
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  Learn how DiskANN delivers billion-scale vector searches using SSDs, balancing
  low memory usage, high accuracy, and scalable performance.
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">What is DiskANN?<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a> represents a paradigm-shifting approach to <a href="https://zilliz.com/learn/vector-similarity-search">vector similarity search</a>. Before that, most vector index types like HNSW rely heavily on RAM to achieve low latency and high recall. While effective for moderate-sized datasets, this approach becomes prohibitively expensive and less scalable as data volumes grow. DiskANN offers a cost-effective alternative by leveraging SSDs to store the index, significantly reducing memory requirements.</p>
<p>DiskANN employs a flat graph structure optimized for disk access, allowing it to handle billion-scale datasets with a fraction of the memory footprint required by in-memory methods. For instance, DiskANN can index up to a billion vectors while achieving 95% search accuracy with 5ms latencies, whereas RAM-based algorithms peak at 100–200 million points for similar performance.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1: Vector indexing and search workflow with DiskANN</em></p>
<p>Although DiskANN may introduce slightly higher latency compared to RAM-based approaches, the trade-off is often acceptable given the substantial cost savings and scalability benefits. DiskANN is particularly suitable for applications requiring large-scale vector search on commodity hardware.</p>
<p>This article will explain the clever methods DiskANN has to leverage SSD in addition to RAM and reduce costly SSD reads.</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">How Does DiskANN Work?<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN is a graph-based vector search method in the same family of methods as HNSW. We first construct a search graph where the nodes correspond to vectors (or groups of vectors), and edges denote that a pair of vectors is “relatively close” in some sense. A typical search randomly chooses an “entry node”, and navigates to its neighbor closest to the query, repeating in a greedy fashion until a local minimum is reached.</p>
<p>Graph-based indexing frameworks differ primarily in how they construct the search graph and perform search. And in this section, we will do a technical deep dive into the innovations of DiskANN for these steps and how they permit low-latency, low-memory performance. (See the above figure for a summary.)</p>
<h3 id="An-Overview" class="common-anchor-header">An Overview</h3><p>We assume that the user has generated a set of document vector embeddings. The first step is to cluster the embeddings. A search graph for each cluster is constructed separately using the Vamana algorithm (explained in the next section), and the results are merged into a single graph. <em>The divide-and-conquer strategy for creating the final search graph significantly reduces memory usage without too greatly affecting search latency or recall.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2: How DiskANN stores vector index across RAM and SSD</em></p>
<p>Having produced the global search graph, it’s stored on SSD together with the full-precision vector embeddings. A major challenge is to finish the search within a bounded number of SSD reads, since SSD access is expensive relative to RAM access. So, a few clever tricks are used to restrict the number of reads:</p>
<p>First, the Vamana algorithm incentivizes shorter paths between close nodes while capping the maximum number of neighbors of a node. Second, a fixed-size data structure is used to store each node’s embedding and its neighbors (see the above figure). What this means is that we can address a node’s metadata by simply multiplying the data structure size by the node’s index and using this as an offset while simultaneously fetching the node’s embedding. Third, due to how SSD works, we can fetch multiple nodes per read request - in our case, the neighbor nodes - reducing the number of read requests further.</p>
<p>Separately, we compress the embeddings using product quantization and store them in RAM. In doing so, we can fit billions-scale vector datasets into a memory that is feasible on a single machine for quickly calculating <em>approximate vector similarities</em> without disk reads. This provides guidance for reducing the number of neighbor nodes to access next on the SSD. Importantly, however, the search decisions are made using the <em>exact vector similarities</em>, with the full embeddings retrieved from SSD, which ensures higher recall. To emphasize, there is an initial phase of search using quantized embeddings in memory, and a subsequent search on a smaller subset reading from SSD.</p>
<p>In this description, we have glossed over two important albeit involved steps: how to construct the graph, and how to search the graph - the two steps indicated by the red boxes above. Let’s examine each of these in turn.</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">“Vamana” Graph Construction</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: “Vamana” Graph Construction</em></p>
<p>The DiskANN authors develop a novel method for constructing the search graph, which they call the Vamana algorithm. It initializes the search graph by randomly adding O(N) edges. This will result in a graph that is “well-connected”, although without any guarantees on greedy search convergence. It then prunes and reconnects the edges in an intelligent way to ensure there are sufficient long-range connections (see above figure). Allow us to elaborate:</p>
<h4 id="Initialization" class="common-anchor-header">Initialization</h4><p>The search graph is initialized to a random directed graph where each node has R out-neighbors. We also calculate the medoid of the graph, that is, the point that has the minimum average distance to all other points. You can think of this as analogous to a centroid that is a member of the set of nodes.</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">Search for Candidates</h4><p>After initialization, we iterate over the nodes, performing both adding and removing edges at each step. First, we run a search algorithm on the selected node, p, to generate a list of candidates. The search algorithm starts at the medoid and greedily navigates closer and closer to the selected node, adding the out-neighbors of the closest node found so far at each step. The list of L found nodes closest to p is returned. (If you’re not familiar with the concept, the medoid of a graph is the point that has the minimum average distance to all other points and acts as an analog of a centroid for graphs.)</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">Pruning and Adding Edges</h4><p>The node’s candidate neighbors are sorted by distance, and for each candidate, the algorithm checks whether it is “too close” in direction to an already chosen neighbor. If so, it’s pruned. This promotes angular diversity among neighbors, which empirically leads to better navigation properties. In practice, this means that a search starting from a random node can more quickly reach any target node by exploring a sparse set of long-range and local links.</p>
<p>After pruning edges, edges along the greedy search path to p are added. Two passes of pruning are performed, varying the distance threshold for pruning so that long-term edges are added in the second pass.</p>
<h2 id="What’s-Next" class="common-anchor-header">What’s Next?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Subsequent work has been built upon DiskANN for additional improvements. One noteworthy example, known as <a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>, modifies the method to allow for the easy updating of the index after construction. This search index, which provides an excellent tradeoff between performance criteria, is available in the <a href="https://milvus.io/docs/overview.md">Milvus</a> vector database as the <code translate="no">DISKANN</code> index type.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>You can even tune the DiskANN parameters, such as <code translate="no">MaxDegree</code> and  <code translate="no">BeamWidthRatio</code>: see <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">the documentation page</a> for more details.</p>
<h2 id="Resources" class="common-anchor-header">Resources<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Milvus Documentation on using DiskANN</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">“DiskANN: Fast Accurate Billion-point Nearest Neighbor Search on a Single Node”</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">“FreshDiskANN: A Fast and Accurate Graph-Based ANN Index for Streaming Similarity Search”</a></p></li>
</ul>
