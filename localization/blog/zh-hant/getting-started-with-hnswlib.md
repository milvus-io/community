---
id: getting-started-with-hnswlib.md
title: Getting Started with HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSWlib, a library implementing HNSW, is highly efficient and scalable,
  performing well even with millions of points. Learn how to implement it in
  minutes.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">Semantic search</a> allows machines to understand language and yield better search results, which is essential in AI and data analytics. Once the language is represented as <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">embeddings</a>, the search can be performed using exact or approximate methods. Approximate Nearest Neighbor (<a href="https://zilliz.com/glossary/anns">ANN</a>) search is a method used to quickly find points in a dataset that are closest to a given query point, unlike <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">exact nearest neighbor search</a>, which can be computationally expensive for high-dimensional data. ANN allows faster retrieval by providing results that are approximately close to the nearest neighbors.</p>
<p>One of the algorithms for Approximate Nearest Neighbor (ANN) search is <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (Hierarchical Navigable Small Worlds), implemented under <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a>, which will be the focus of today’s discussion. In this blog, we will:</p>
<ul>
<li><p>Understand the HNSW algorithm.</p></li>
<li><p>Explore HNSWlib and its key features.</p></li>
<li><p>Set up HNSWlib, covering index building and search implementation.</p></li>
<li><p>Compare it with Milvus.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">Understanding HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> is a graph-based data structure that allows efficient similarity searches, particularly in high-dimensional spaces, by building a multi-layered graph of “small world” networks. Introduced in <a href="https://arxiv.org/abs/1603.09320">2016</a>, HNSW addresses the scalability issues associated with traditional search methods like brute-force and tree-based searches. It is ideal for applications involving large datasets, such as recommendation systems, image recognition, and <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">retrieval-augmented generation (RAG)</a>.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">Why HNSW Matters</h3><p>HNSW significantly enhances the performance of nearest-neighbor search in high-dimensional spaces. Combining the hierarchical structure with small-world navigability avoids the computational inefficiency of older methods, enabling it to perform well even with massive, complex datasets. To understand this better, let’s look at how it works now.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">How HNSW Works</h3><ol>
<li><p><strong>Hierarchical Layers:</strong> HNSW organizes data into a hierarchy of layers, where each layer contains nodes connected by edges. The top layers are sparser, allowing for broad “skips” across the graph, much like zooming out on a map to see only major highways between cities. Lower layers increase in density, providing finer detail and more connections between closer neighbors.</p></li>
<li><p><strong>Navigable Small Worlds Concept:</strong> Each layer in HNSW builds on the concept of a “small world” network, where nodes (data points) are only a few “hops” away from each other. The search algorithm begins at the highest, sparsest layer and works downward, moving to progressively denser layers to refine the search. This approach is like moving from a global view down to neighborhood-level details, gradually narrowing the search area.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">Fig 1</a>: An Example of a Navigable Small World Graph</p>
<ol start="3">
<li><strong>Skip List-Like Structure:</strong> The hierarchical aspect of HNSW resembles a skip list, a probabilistic data structure where higher layers have fewer nodes, allowing for faster initial searches.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">Fig 2</a>: An Example of Skip List Structure</p>
<p>To search for 96 in the given skip list, we begin at the top level on the far left at the header node. Moving to the right, we encounter 31, less than 96, so we continue to the next node. Now, we need to move down a level where we see 31 again; since it’s still less than 96, we descend another level. Finding 31 once more, we then move right and reach 96, our target value. Thus, we locate 96 without needing to descend to the lowest levels of the skip list.</p>
<ol start="4">
<li><p><strong>Search Efficiency:</strong> The HNSW algorithm starts from an entry node at the highest layer, progressing to closer neighbors with each step. It descends through the layers, using each one for coarse-to-fine-grained exploration, until it reaches the lowest layer where the most similar nodes are likely found. This layered navigation reduces the number of nodes and edges that need to be explored, making the search fast and accurate.</p></li>
<li><p><strong>Insertion and Maintenance</strong>: When adding a new node, the algorithm determines its entry layer based on probability and connects it to nearby nodes using a neighbor selection heuristic. The heuristic aims to optimize connectivity, creating links that improve navigability while balancing graph density. This approach keeps the structure robust and adaptable to new data points.</p></li>
</ol>
<p>While we have a foundational understanding of the HNSW algorithm, implementing it from scratch can be overwhelming. Fortunately, the community has developed libraries like <a href="https://github.com/nmslib/hnswlib">HNSWlib</a> to simplify usage, making it accessible without scratching your head. So, let’s take a closer look at HNSWlib.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">Overview of HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib, a popular library implementing HNSW, is highly efficient and scalable, performing well even with millions of points. It achieves sublinear time complexity by allowing quick jumps between graph layers and optimizing the search for dense, high-dimensional data. Here are the key features of HNSWlib include:</p>
<ul>
<li><p><strong>Graph-Based Structure:</strong> A multi-layered graph represents data points, allowing fast, nearest-neighbor searches.</p></li>
<li><p><strong>High-Dimensional Efficiency:</strong> Optimized for high-dimensional data, providing quick and accurate approximate searches.</p></li>
<li><p><strong>Sublinear Search Time:</strong> Achieves sublinear complexity by skipping layers, improving speed significantly.</p></li>
<li><p><strong>Dynamic Updates:</strong> Supports real-time insertion and deletion of nodes without requiring a complete graph rebuild.</p></li>
<li><p><strong>Memory Efficiency:</strong> Efficient memory usage, suitable for large datasets.</p></li>
<li><p><strong>Scalability:</strong> Scales well to millions of data points, making it ideal for medium-scale applications like recommendation systems.</p></li>
</ul>
<p><strong>Note:</strong> HNSWlib is excellent for creating simple prototypes for vector search applications. However, due to scalability limitations, there may be better choices such as <a href="https://zilliz.com/blog/what-is-a-real-vector-database">purpose-built vector databases</a> for more complex scenarios involving hundreds of millions or even billions of data points. Let’s see that in action.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">Getting Started with HNSWlib: A Step-by-Step Guide<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>This section will demonstrate using HNSWlib as a <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">vector search library</a> by creating an HNSW index, inserting data, and performing searches. Let’s start with installation:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">Setup and Imports</h3><p>To get started with HNSWlib in Python, first install it using pip:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>Then, import the necessary libraries:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">Preparing Data</h3><p>In this example, we’ll use <code translate="no">NumPy</code>to generate a random dataset with 10,000 elements, each with a dimension size 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>Let’s create the data:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>Now our data is ready, let’s build an index.</p>
<h3 id="Building-an-Index" class="common-anchor-header">Building an Index</h3><p>In building an index, we need to define the dimensionality of the vectors and the space type. Let’s create an index:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: This parameter defines the distance metric used for similarity. Setting it to <code translate="no">'l2'</code> means using the Euclidean distance (L2 norm). If you instead set it to <code translate="no">'ip'</code>, it would use the inner product, which is helpful for tasks like cosine similarity.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: This parameter specifies the dimensionality of the data points you’ll be working with. It must match the dimension of the data you plan to add to the index.</li>
</ul>
<p>Here’s how to initialize an index:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: This sets the maximum number of elements that can be added to the index. <code translate="no">Num_elements</code> is the maximum capacity, so we set this to 10,000 as we are working with 10,000 data points.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: This parameter controls the accuracy vs. construction speed trade-off during index creation. A higher value improves recall (accuracy) but increases memory usage and build time. Common values range from 100 to 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: This parameter determines the number of bi-directional links created for each data point, influencing accuracy and search speed. Typical values are between 12 and 48; 16 is often a good balance for moderate accuracy and speed.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: The <code translate="no">ef</code> parameter, short for “exploration factor,” determines how many neighbors are examined during a search. A higher <code translate="no">ef</code> value results in more neighbors being explored, which generally increases the accuracy (recall) of the search but also makes it slower. Conversely, a lower <code translate="no">ef</code> value can search faster but might reduce accuracy.</li>
</ul>
<p>In this case, Setting <code translate="no">ef</code> to 50 means the search algorithm will evaluate up to 50 neighbors when finding the most similar data points.</p>
<p>Note: <code translate="no">ef_construction</code> sets neighbor search effort during index creation, enhancing accuracy but slowing construction. <code translate="no">ef</code> controls search effort during querying, balancing speed and recall dynamically for each query.</p>
<h3 id="Performing-Searches" class="common-anchor-header">Performing Searches</h3><p>To perform a nearest neighbor search using HNSWlib, we first create a random query vector. In this example, the vector’s dimensionality matches the indexed data.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: This line generates a random vector with the same dimensionality as the indexed data, ensuring compatibility for the nearest neighbor search.</li>
<li><code translate="no">knn_query</code>: The method searches for the <code translate="no">k</code> nearest neighbors of the <code translate="no">query_vector</code> within the index <code translate="no">p</code>. It returns two arrays: <code translate="no">labels</code>, which contain the indices of the nearest neighbors, and <code translate="no">distances</code>, which indicate the distances from the query vector to each of these neighbors. Here, <code translate="no">k=5</code> specifies that we want to find the five closest neighbors.</li>
</ul>
<p>Here are the results after printing the labels and distances:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>Here we have it, a simple guide to get your wheels started with HNSWlib.</p>
<p>As mentioned, HNSWlib is a great vector search engine for prototyping or experimenting with medium-sized datasets. If you have higher scalability requirements or need other enterprise-level features, you may need to choose a purpose-built vector database like the open-source <a href="https://zilliz.com/what-is-milvus">Milvus</a> or its fully managed service on <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. So, in the following section, we will compare HNSWlib with Milvus.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib vs. Purpose-Built Vector Databases Like Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>A <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> stores data as mathematical representations, enabling <a href="https://zilliz.com/ai-models">machine learning models</a> to power search, recommendations, and text generation by identifying data through <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">similarity metrics</a> for contextual understanding.</p>
<p>Vector indices libraries like HNSWlib improve v<a href="https://zilliz.com/learn/vector-similarity-search">ector search</a> and retrieval but lack the management features of a full database. On the other hand, vector databases, like <a href="https://milvus.io/">Milvus</a>, are designed to handle vector embeddings at scale, providing advantages in data management, indexing, and querying capabilities that standalone libraries typically lack. Here are some other benefits of using Milvus:</p>
<ul>
<li><p><strong>High-Speed Vector Similarity Search</strong>: Milvus provides millisecond-level search performance across billion-scale vector datasets, ideal for applications like image retrieval, recommendation systems, natural language processing (<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">NLP</a>), and retrieval augmented generation (<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>).</p></li>
<li><p><strong>Scalability and High Availability:</strong> Built to handle massive data volumes, Milvus scales horizontally and includes replication and failover mechanisms for reliability.</p></li>
<li><p><strong>Distributed Architecture:</strong> Milvus uses a distributed, scalable architecture that separates storage and computing across multiple nodes for flexibility and robustness.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>Hybrid search</strong></a><strong>:</strong> Milvus supports multimodal search, hybrid <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">sparse and dense search</a>, and hybrid dense and <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">full-text search</a>, offering versatile and flexible search functionality.</p></li>
<li><p><strong>Flexible Data Support</strong>: Milvus supports various data types—vectors, scalars, and structured data—allowing seamless management and analysis within a single system.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Active Community</strong></a> <strong>and Support</strong>: A thriving community provides regular updates, tutorials, and support, ensuring Milvus remains aligned with user needs and advances in the field.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">AI integration</a>: Milvus has integrated with various popular AI frameworks and technologies, making it easier for developers to build applications with their familiar tech stacks.</p></li>
</ul>
<p>Milvus also provides a fully managed service on <a href="https://zilliz.com/cloud">Ziliz Cloud</a>, which is hassle-free and 10x faster than Milvus.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">Comparison: Milvus vs. HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>Feature</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Scalability</td><td style="text-align:center">Handles billions of vectors with ease</td><td style="text-align:center">Fit for smaller datasets due to RAM usage</td></tr>
<tr><td style="text-align:center">Ideal for</td><td style="text-align:center">Prototyping, experimenting, and enterprise-level applications</td><td style="text-align:center">Focuses on prototypes and lightweight ANN tasks</td></tr>
<tr><td style="text-align:center">Indexing</td><td style="text-align:center">Supports 10+ indexing algorithms, including HNSW, DiskANN, Quantization, and Binary</td><td style="text-align:center">Uses a graph-based HNSW only</td></tr>
<tr><td style="text-align:center">Integration</td><td style="text-align:center">Offers APIs and cloud-native services</td><td style="text-align:center">Serves as a lightweight, standalone library</td></tr>
<tr><td style="text-align:center">Performance</td><td style="text-align:center">Optimizes for large data, distributed queries</td><td style="text-align:center">Offers high speed but limited scalability</td></tr>
</tbody>
</table>
<p>Overall, Milvus is generally preferable for large-scale, production-grade applications with complex indexing needs, while HNSWlib is ideal for prototyping and more straightforward use cases.</p>
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
    </button></h2><p>Semantic search can be resource-intensive, so internal data structuring, like that performed by HNSW, is essential for faster data retrieval. Libraries like HNSWlib care about the implementation, so the developers have the recipes ready to prototype vector capabilities. With just a few lines of code, we can build up our own index and perform searches.</p>
<p>HNSWlib is a great way to start. However, if you want to build complex and production-ready AI applications, purpose-built vector databases are the best option. For example, <a href="https://milvus.io/">Milvus</a> is an open-source vector database with many enterprise-ready features such as high-speed vector search, scalability, availability, and flexibility in terms of data types and programming language.</p>
<h2 id="Further-Reading" class="common-anchor-header">Further Reading<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">What is Faiss (Facebook AI Similarity Search)? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">What is HNSWlib? A Graph-based Library for Fast ANN Search </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">What is ScaNN (Scalable Nearest Neighbors)? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: An Open-Source VectorDB Benchmark Tool</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Generative AI Resource Hub | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">What are Vector Databases and How Do They Work? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">What is RAG? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Top Performing AI Models for Your GenAI Apps | Zilliz</a></p></li>
</ul>
