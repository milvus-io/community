---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: Why and When Do You Need a Purpose-Built Vector Database?
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  This post provides an overview of vector search and its functioning, compare
  different vector search technologies, and explain why opting for a
  purpose-built vector database is crucial.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>This article was originally published on <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a> and is reposted here with permission.</em></p>
<p>The increasing popularity of <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> and other large language models (LLMs) has fueled the rise of vector search technologies, including purpose-built vector databases such as <a href="https://milvus.io/docs/overview.md">Milvus</a> and <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, vector search libraries such as <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, and vector search plugins integrated with traditional databases. However, choosing the best solution for your needs can be challenging. Like choosing between a high-end restaurant and a fast-food chain, selecting the right vector search technology depends on your needs and expectations.</p>
<p>In this post, I will provide an overview of vector search and its functioning, compare different vector search technologies, and explain why opting for a purpose-built vector database is crucial.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">What is vector search, and how does it work?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/vector-similarity-search">Vector search</a>, also known as vector similarity search, is a technique for retrieving the top-k results that are most similar or semantically related to a given query vector among an extensive collection of dense vector data.</p>
<p>Before conducting similarity searches, we leverage neural networks to transform <a href="https://zilliz.com/blog/introduction-to-unstructured-data">unstructured data</a>, such as text, images, videos, and audio, into high-dimensional numerical vectors called embedding vectors. For example, we can use the pre-trained ResNet-50 convolutional neural network to transform a bird image into a collection of embeddings with 2,048 dimensions. Here, we list the first three and last three vector elements: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
    <span>A bird image by Patrice Bouchard</span>
  </span>
</p>
<p>After generating embedding vectors, vector search engines compare the spatial distance between the input query vector and the vectors in the vector stores. The closer they are in space, the more similar they are.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
    <span>Embedding arithmetic</span>
  </span>
</p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">Popular vector search technologies<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Multiple vector search technologies are available in the market, including machine learning libraries like Python’s NumPy, vector search libraries like FAISS, vector search plugins built on traditional databases, and specialized vector databases like Milvus and Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">Machine learning libraries</h3><p>Using machine learning libraries is the easiest way to implement vector searches. For instance, we can use Python’s NumPy to implement a nearest neighbor algorithm in less than 20 lines of code.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>We can generate 100 two-dimensional vectors and find the nearest neighbor to the vector [0.5, 0.5].</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>Machine learning libraries, such as Python’s NumPy, offer great flexibility at a low cost. However, they do have some limitations. For instance, they can only handle a small amount of data and do not ensure data persistence.</p>
<p>I only recommend using NumPy or other machine learning libraries for vector search when:</p>
<ul>
<li>You need quick prototyping.</li>
<li>You don’t care about data persistence.</li>
<li>Your data size is under one million, and you do not require scalar filtering.</li>
<li>You do not need high performance.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">Vector search libraries</h3><p>Vector search libraries can help you quickly build a high-performance prototype vector search system. FAISS is a typical example. It is open-source and developed by Meta for efficient similarity search and dense vector clustering. FAISS can handle vector collections of any size, even those that cannot be fully loaded into memory. Additionally, FAISS offers tools for evaluation and parameter tuning. Even though written in C++, FAISS provides a Python/NumPy interface.</p>
<p>Below is the code for an example vector search based on FAISS:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>Vector search libraries such as FAISS are easy to use and fast enough to handle small-scale production environments with millions of vectors. You can enhance their query performance by utilizing quantization and GPUs and reducing data dimensions.</p>
<p>However, these libraries have some limitations when used in production. For example, FAISS does not support real-time data addition and deletion, remote calls, multiple languages, scalar filtering, scalability, or disaster recovery.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">Different types of vector databases</h3><p>Vector databases have emerged to address the limitations of the libraries above, providing a more comprehensive and practical solution for production applications.</p>
<p>Four types of vector databases are available on the battlefield:</p>
<ul>
<li>Existing relational or columnar databases that incorporate a vector search plugin. PG Vector is an example.</li>
<li>Traditional inverted index search engines with support for dense vector indexing. <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a> is an example.</li>
<li>Lightweight vector databases built on vector search libraries. Chroma is an example.</li>
<li><strong>Purpose-built vector databases</strong>. This type of database is specifically designed and optimized for vector searching from the bottom up. Purpose-built vector databases typically offer more advanced features, including distributed computing, disaster recovery, and data persistence. <a href="https://zilliz.com/what-is-milvus">Milvus</a> is a primary example.</li>
</ul>
<p>Not all vector databases are created equal. Each stack has unique advantages and limitations, making them more or less suitable for different applications.</p>
<p>I prefer specialized vector databases over other solutions because they are the most efficient and convenient option, offering numerous unique benefits. In the following sections, I will use Milvus as an example to explain the reasons for my preference.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">Key benefits of purpose-built vector databases<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> is an open-source, distributed, purpose-built vector database that can store, index, manage, and retrieve billions of embedding vectors. It is also one of the most popular vector databases for <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM retrieval augmented generation</a>. As an exemplary instance of purpose-built vector databases, Milvus shares many unique advantages with its counterparts.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">Data Persistence and Cost-Effective Storage</h3><p>While preventing data loss is the minimum requirement for a database, many single-machine and lightweight vector databases do not prioritize data reliability. By contrast, purpose-built distributed vector databases like <a href="https://zilliz.com/what-is-milvus">Milvus</a> prioritize system resilience, scalability, and data persistence by separating storage and computation.</p>
<p>Moreover, most vector databases that utilize approximate nearest neighbor (ANN) indexes need a lot of memory to perform vector searching, as they load ANN indexes purely into memory. However, Milvus supports disk indexes, making storage over ten times more cost-effective than in-memory indexes.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">Optimal Query Performance</h3><p>A specialized vector database provides optimal query performance compared to other vector search options. For example, Milvus is ten times faster at handling queries than vector search plugins. Milvus uses the <a href="https://zilliz.com/glossary/anns">ANN algorithm</a> instead of the KNN brutal search algorithm for faster vector searching. Additionally, it shards its indexes, reducing the time it takes to construct an index as the data volume increases. This approach enables Milvus to easily handle billions of vectors with real-time data additions and deletions. In contrast, other vector search add-ons are only suitable for scenarios with fewer than tens of millions of data and infrequent additions and deletions.</p>
<p>Milvus also supports GPU acceleration. Internal testing shows that GPU-accelerated vector indexing can achieve 10,000+ QPS when searching tens of millions of data, which is at least ten times faster than traditional CPU indexing for single-machine query performance.</p>
<h3 id="System-Reliability" class="common-anchor-header">System Reliability</h3><p>Many applications use vector databases for online queries that require low query latency and high throughput. These applications demand single-machine failover at the minute level, and some even require cross-region disaster recovery for critical scenarios. Traditional replication strategies based on Raft/Paxos suffer from serious resource waste and need help to pre-shard the data, leading to poor reliability. In contrast, Milvus has a distributed architecture that leverages K8s message queues for high availability, reducing recovery time and saving resources.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">Operability and Observability</h3><p>To better serve enterprise users, vector databases must offer a range of enterprise-level features for better operability and observability. Milvus supports multiple deployment methods, including K8s Operator and Helm chart, docker-compose, and pip install, making it accessible to users with different needs. Milvus also provides a monitoring and alarm system based on Grafana, Prometheus, and Loki, improving its observability. With a distributed cloud-native architecture, Milvus is the industry’s first vector database to support multi-tenant isolation, RBAC, quota limiting, and rolling upgrades. All of these approaches make managing and monitoring Milvus much simpler.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Getting started with Milvus in 3 simple steps within 10 minutes<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Building a vector database is a complex task, but using one is as simple as using Numpy and FAISS. Even students unfamiliar with AI can implement vector search based on Milvus in just ten minutes. To experience highly scalable and high-performance vector search services, follow these three steps:</p>
<ul>
<li>Deploy Milvus on your server with the help of the <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus deployment document</a>.</li>
<li>Implement vector search with just 50 lines of code by referring to the <a href="https://milvus.io/docs/example_code.md">Hello Milvus document</a>.</li>
<li>Explore the <a href="https://github.com/towhee-io/examples/">example documents of Towhee</a> to gain insight into popular <a href="https://zilliz.com/use-cases">use cases of vector databases</a>.</li>
</ul>
