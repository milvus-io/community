---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: |
  Understanding IVF Vector Index: How It Works and When to Choose It Over HNSW
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_1bbe0e9f85.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: >-
  Learn how the IVF vector index works, how it accelerates ANN search, and when
  it outperforms HNSW in speed, memory, and filtering efficiency.
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>In a vector database, we often need to quickly find the most similar results among vast collections of high-dimensional vectors—such as image features, text embeddings, or audio representations. Without an index, the only option is to compare the query vector against every single vector in the dataset. This <strong>brute-force search</strong> might work when you have a few thousand vectors, but once you’re dealing with tens or hundreds of millions, it becomes unbearably slow and computationally expensive.</p>
<p>That’s where <strong>Approximate Nearest Neighbor (ANN)</strong> search comes in. Think of it like looking for a specific book in a massive library. Instead of checking every book one by one, you start by browsing the sections most likely to contain it. You might not get the <em>exact</em> same results as a full search, but you’ll get very close—and in a fraction of the time. In short, ANN trades a slight loss in accuracy for a significant boost in speed and scalability.</p>
<p>Among the many ways to implement ANN search, <strong>IVF (Inverted File)</strong> and <strong>HNSW (Hierarchical Navigable Small World)</strong> are two of the most widely used. But IVF stands out for its efficiency and adaptability in large-scale vector search. In this article, we’ll walk you through how IVF works and how it compares with HNSW—so you can understand their trade-offs and choose the one that best fits your workload.</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">What is an IVF Vector Index?<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>IVF (Inverted File)</strong> is one of the most widely used algorithms for ANN. It borrows its core idea from the “inverted index” used in text retrieval systems—only this time, instead of words and documents, we’re dealing with vectors in a high-dimensional space.</p>
<p>Think of it like organizing a massive library. If you dumped every book (vector) into one giant pile, finding what you need would take forever. IVF solves this by first <strong>clustering</strong> all vectors into groups, or <em>buckets</em>. Each bucket represents a “category” of similar vectors, defined by a <strong>centroid</strong>—a kind of summary or “label” for everything inside that cluster.</p>
<p>When a query comes in, the search happens in two steps:</p>
<p><strong>1. Find the nearest clusters.</strong> The system looks for the few buckets whose centroids are closest to the query vector—just like heading straight to the two or three library sections most likely to have your book.</p>
<p><strong>2. Search within those clusters.</strong> Once you’re in the right sections, you only need to look through a small set of books instead of the entire library.</p>
<p>This approach cuts down the amount of computation by orders of magnitude. You still get highly accurate results—but much faster.</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">How to Build an IVF Vector Index<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>The process of building an IVF vector index involves three main steps: K-means Clustering, Vector Assignment, and Compression Encoding (Optional). The full process looks like this:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">Step 1: K-means Clustering</h3><p>First, run k-means clustering on the dataset X to divide the high-dimensional vector space into nlist clusters. Each cluster is represented by a centroid, which is stored in the centroid table C. The number of centroids, nlist, is a key hyperparameter that determines how fine-grained the clustering will be.</p>
<p>Here’s how k-means works under the hood:</p>
<ul>
<li><p><strong>Initialization:</strong> Randomly select <em>nlist</em> vectors as the initial centroids.</p></li>
<li><p><strong>Assignment:</strong> For each vector, compute its distance to all centroids and assign it to the nearest one.</p></li>
<li><p><strong>Update:</strong> For each cluster, calculate the average of its vectors and set that as the new centroid.</p></li>
<li><p><strong>Iteration and convergence:</strong> Repeat assignment and update until centroids stop changing significantly or a maximum number of iterations is reached.</p></li>
</ul>
<p>Once k-means converges, the resulting nlist centroids form the “index directory” of IVF. They define how the dataset is coarsely partitioned, allowing queries to quickly narrow down the search space later on.</p>
<p>Think back to the library analogy: training centroids is like deciding how to group books by topic:</p>
<ul>
<li><p>A larger nlist means more sections, each with fewer, more specific books.</p></li>
<li><p>A smaller nlist means fewer sections, each covering a broader, more mixed range of topics.</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">Step 2: Vector Assignment</h3><p>Next, each vector is assigned to the cluster whose centroid it’s closest to, forming inverted lists (List_i). Each inverted list stores the IDs and storage information of all vectors that belong to that cluster.</p>
<p>You can think of this step like shelving the books into their respective sections. When you’re looking for a title later, you only need to check the few sections that are most likely to have it, instead of wandering the whole library.</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">Step 3: Compression Encoding (Optional)</h3><p>To save memory and speed up computation, vectors within each cluster can go through compression encoding. There are two common approaches:</p>
<ul>
<li><p><strong>SQ8 (Scalar Quantization):</strong> This method quantizes each dimension of a vector into 8 bits. For a standard <code translate="no">float32</code> vector, each dimension typically takes up 4 bytes. With SQ8, it’s reduced to just 1 byte—achieving a 4:1 compression ratio while keeping the vector’s geometry largely intact.</p></li>
<li><p><strong>PQ (Product Quantization):</strong> It splits a high-dimensional vector into several subspaces. For example, a 128-dimensional vector can be divided into 8 sub-vectors of 16 dimensions each. In each subspace, a small codebook (typically with 256 entries) is pre-trained, and each sub-vector is represented by an 8-bit index pointing to its nearest codebook entry. This means the original 128-D <code translate="no">float32</code> vector (which requires 512 bytes) can be represented using only 8 bytes (8 subspaces × 1 byte each), achieving a 64:1 compression ratio.</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">How to Use the IVF Vector Index for Search<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Once the centroid table, inverted lists, and the compression encoder and codebooks (optional) are built, the IVF index can be used to accelerate similarity search. The process typically has three main steps, as shown below:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">Step 1: Calculate distances from the query vector to all centroids</h3><p>When a query vector q arrives, the system first determines which clusters it is most likely to belong to. Then, it computes the distance between q and every centroid in the centroid table C—usually using Euclidean distance or inner product as the similarity metric. The centroids are then sorted by their distance to the query vector, producing an ordered list from nearest to farthest.</p>
<p>For example, as shown in the illustration, the order is: C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5.</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">Step 2: Select the nearest nprobe clusters</h3><p>To avoid scanning the entire dataset, IVF only searches within the top <em>nprobe</em> clusters that are closest to the query vector.</p>
<p>The parameter nprobe defines the search scope and directly affects the balance between speed and recall:</p>
<ul>
<li><p>A smaller nprobe leads to faster queries but may reduce recall.</p></li>
<li><p>A larger nprobe improves recall but increases latency.</p></li>
</ul>
<p>In real-world systems, nprobe can be dynamically tuned based on the latency budget or accuracy requirements.
In the example above, if nprobe = 2, the system will only search within Cluster 2 and Cluster 4—the two nearest clusters.</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">Step 3: Search the nearest neighbor in the selected clusters</h3><p>Once the candidate clusters are selected, the system compares the query vector q with the vectors stored inside them.
 There are two main modes of comparison:</p>
<ul>
<li><p><strong>Exact Comparison (IVF_FLAT)</strong>: The system retrieves the original vectors from the selected clusters and computes their distances to q directly, returning the most accurate results.</p></li>
<li><p><strong>Approximate Comparison (IVF_PQ / IVF_SQ8)</strong>: When PQ or SQ8 compression is used, the system employs a <strong>lookup table method</strong> to accelerate distance computation. Before the search begins, it precomputes the distances between the query vector and each codebook entry. Then, for each vector, it can simply “look up and sum” these precomputed distances to estimate similarity.</p></li>
</ul>
<p>Finally, the candidate results from all searched clusters are merged and re-ranked, producing the Top-k most similar vectors as the final output.</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">IVF In-Practice<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Once you understand how IVF vector indexes are <strong>built</strong> and <strong>searched</strong>, the next step is to apply them for real-world workloads. In practice, you’ll often need to balance <strong>performance</strong>, <strong>accuracy</strong>, and <strong>memory usage</strong>. Below are some practical guidelines drawn from engineering experience.</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">How to Choose the Right nlist</h3><p>As mentioned earlier, the parameter nlist determines the number of clusters into which the dataset is divided when building an IVF index.</p>
<ul>
<li><p><strong>Larger nlist</strong>: Creates finer-grained clusters, meaning each cluster contains fewer vectors. This reduces the number of vectors scanned during search and generally results in faster queries. But building the index takes longer, and the centroid table consumes more memory.</p></li>
<li><p><strong>Smaller nlist</strong>: Speeds up index construction and reduces memory usage, but each cluster becomes more “crowded.” Each query must scan more vectors within a cluster, which can lead to performance bottlenecks.</p></li>
</ul>
<p>Based on these trade-offs, here’s a practical rule of thumb:</p>
<p>For datasets at the <strong>million scale</strong>, a good starting point is <strong>nlist ≈ √n</strong> (n is the number of vectors in the data shard being indexed).</p>
<p>For example, if you have 1 million vectors, try nlist = 1,000. For larger datasets—tens or hundreds of millions—most vector databases shard the data so that each shard contains around one million vectors, keeping this rule practical.</p>
<p>Because nlist is fixed at index creation, changing it later means rebuilding the entire index. So it’s best to experiment early. Test several values—ideally in powers of two (e.g., 1024, 2048)—to find the sweet spot that balances speed, accuracy, and memory for your workload.</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">How to Tune nprobe</h3><p>The parameter nprobe controls the number of clusters searched during query time. It directly affects the trade-off between recall and latency.</p>
<ul>
<li><p><strong>Larger nprobe</strong>: Covers more clusters, leading to higher recall but also higher latency. The delay generally increases linearly with the number of clusters searched.</p></li>
<li><p><strong>Smaller nprobe</strong>: Searches fewer clusters, resulting in lower latency and faster queries. However, it may miss some true nearest neighbors, slightly lowering recall and result accuracy.</p></li>
</ul>
<p>If your application is not extremely sensitive to latency, it’s a good idea to experiment with nprobe dynamically—for example, testing values from 1 to 16 to observe how recall and latency change. The goal is to find the sweet spot where recall is acceptable and latency remains within your target range.</p>
<p>Since nprobe is a runtime search parameter, it can be adjusted on the fly without requiring the index to be rebuilt. This enables fast, low-cost, and highly flexible tuning across different workloads or query scenarios.</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">Common Variants of the IVF Index</h3><p>When building an IVF index, you’ll need to decide whether to use compression encoding for the vectors in each cluster—and if so, which method to use.</p>
<p>This results in three common IVF index variants:</p>
<table>
<thead>
<tr><th><strong>IVF Variant</strong></th><th><strong>Key Features</strong></th><th><strong>Use Cases</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>IVF_FLAT</strong></td><td>Stores raw vectors within each cluster without compression. Offers the highest accuracy, but also consumes the most memory.</td><td>Ideal for medium-scale datasets (up to hundreds of millions of vectors) where high recall (95%+) is required.</td></tr>
<tr><td><strong>IVF_PQ</strong></td><td>Applies Product Quantization (PQ) to compress vectors within clusters. By adjusting the compression ratio, memory usage can be significantly reduced.</td><td>Suitable for large-scale vector search (hundreds of millions or more) where some accuracy loss is acceptable. With a 64:1 compression ratio, recall is typically around 70%, but can reach 90% or higher by lowering the compression ratio.</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>Uses Scalar Quantization (SQ8) to quantize vectors. Memory usage sits between IVF_FLAT and IVF_PQ.</td><td>Ideal for large-scale vector search where you need to maintain relatively high recall (90%+) while improving efficiency.</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF vs HNSW: Pick What Fits<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>Besides IVF, <strong>HNSW (Hierarchical Navigable Small World)</strong> is another widely used in-memory vector index. The table below highlights the key differences between the two.</p>
<table>
<thead>
<tr><th></th><th><strong>IVF</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Algorithm Concept</strong></td><td>Clustering and bucketing</td><td>Multi-layer graph navigation</td></tr>
<tr><td><strong>Memory Usage</strong></td><td>Relatively low</td><td>Relatively high</td></tr>
<tr><td><strong>Index Build Speed</strong></td><td>Fast (only requires clustering)</td><td>Slow (needs multi-layer graph construction)</td></tr>
<tr><td><strong>Query Speed (No Filtering)</strong></td><td>Fast, depends on <em>nprobe</em></td><td>Extremely fast, but with logarithmic complexity</td></tr>
<tr><td><strong>Query Speed (With Filtering)</strong></td><td>Stable — performs coarse filtering at the centroid level to narrow down candidates</td><td>Unstable — especially when the filtering ratio is high (90%+), the graph becomes fragmented and may degrade to near full-graph traversal, even slower than brute-force search</td></tr>
<tr><td><strong>Recall Rate</strong></td><td>Depends on whether compression is used; without quantization, recall can reach <strong>95%+</strong></td><td>Usually higher, around <strong>98%+</strong></td></tr>
<tr><td><strong>Key Parameters</strong></td><td><em>nlist</em>, <em>nprobe</em></td><td><em>m</em>, <em>ef_construction</em>, <em>ef_search</em></td></tr>
<tr><td><strong>Use Cases</strong></td><td>When memory is limited, but high query performance and recall are required; well-suited for searches with filtering conditions</td><td>When memory is sufficient and the goal is extremely high recall and query performance, but filtering is not needed, or the filtering ratio is low</td></tr>
</tbody>
</table>
<p>In real-world applications, it’s very common to include filtering conditions—for example, “only search vectors from a specific user” or “limit results to a certain time range.” Due to differences in their underlying algorithms, IVF generally handles filtered searches more efficiently than HNSW.</p>
<p>The strength of IVF lies in its two-level filtering process. It can first perform a coarse-grained filter at the centroid (cluster) level to quickly narrow down the candidate set, and then conduct fine-grained distance calculations within the selected clusters. This maintains stable and predictable performance, even when a large portion of the data is filtered out.</p>
<p>In contrast, HNSW is based on graph traversal. Because of its structure, it cannot directly leverage filtering conditions during traversal. When the filtering ratio is low, this doesn’t cause major issues. However, when the filtering ratio is high (e.g., more than 90% of data is filtered out), the remaining graph often becomes fragmented, forming many “isolated nodes.” In such cases, the search may degrade into a near full-graph traversal—sometimes even worse than a brute-force search.</p>
<p>In practice, IVF indexes are already powering many high-impact use cases across different domains:</p>
<ul>
<li><p><strong>E-commerce search:</strong> A user can upload a product image and instantly find visually similar items from millions of listings.</p></li>
<li><p><strong>Patent retrieval:</strong> Given a short description, the system can locate the most semantically related patents from a massive database—far more efficient than traditional keyword search.</p></li>
<li><p><strong>RAG knowledge bases:</strong> IVF helps retrieve the most relevant context from millions of tenant documents, ensuring AI models generate more accurate and grounded responses.</p></li>
</ul>
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
    </button></h2><p>To choose the right index, it all comes down to your specific use case. If you’re working with large-scale datasets or need to support filtered searches, IVF can be the better fit. Compared with graph-based indexes like HNSW, IVF delivers faster index builds, lower memory usage, and a strong balance between speed and accuracy.</p>
<p><a href="https://milvus.io/">Milvus</a>, the most popular open-source vector database, provides full support for the entire IVF family, including IVF_FLAT, IVF_PQ, and IVF_SQ8. You can easily experiment with these index types and find the setup that best fits your performance and memory needs. For a complete list of indexes Milvus supports, check out this <a href="https://milvus.io/docs/index-explained.md">Milvus Index doc page</a>.</p>
<p>If you’re building image search, recommendation systems, or RAG knowledge bases, give IVF indexing in Milvus a try—and see how efficient, large-scale vector search feels in action.</p>
