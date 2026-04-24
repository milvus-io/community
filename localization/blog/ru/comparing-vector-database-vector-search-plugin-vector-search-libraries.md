---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: |
  Comparing Vector Databases, Vector Search Libraries, and Vector Search Plugins
author: Frank Liu
date: 2023-11-9
desc: >-
  In this post, we’ll continue to explore the intricate realm of vector search,
  comparing vector databases, vector search plugins, and vector search
  libraries.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hey there - welcome back to Vector Database 101!</p>
<p>The surge in <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> and other large language models (LLMs) has driven the growth of vector search technologies, featuring specialized vector databases like <a href="https://zilliz.com/what-is-milvus">Milvus</a> and <a href="https://zilliz.com/cloud">Zilliz Cloud</a> alongside libraries such as <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> and integrated vector search plugins within conventional databases.</p>
<p>In our <a href="https://zilliz.com/learn/what-is-vector-database">previous series post</a>, we delved into the fundamentals of vector databases. In this post, we’ll continue to explore the intricate realm of vector search, comparing vector databases, vector search plugins, and vector search libraries.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">What is vector search?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/vector-similarity-search">Vector search</a>, also known as vector similarity search, is a technique for retrieving the top-k results that are most similar or semantically related to a given query vector among an extensive collection of dense vector data. Before conducting similarity searches, we leverage neural networks to transform <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstructured data</a>, such as text, images, videos, and audio, into high-dimensional numerical vectors called embedding vectors. After generating embedding vectors, vector search engines compare the spatial distance between the input query vector and the vectors in the vector stores. The closer they are in space, the more similar they are.</p>
<p>Multiple vector search technologies are available in the market, including machine learning libraries like Python’s NumPy, vector search libraries like FAISS, vector search plugins built on traditional databases, and specialized vector databases like Milvus and Zilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">Vector databases vs. vector search libraries<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">Specialized vector databases</a> are not the only stack for similarity searches. Before the advent of vector databases, many vector searching libraries, such as FAISS, ScaNN, and HNSW, were used for vector retrieval.</p>
<p>Vector search libraries can help you quickly build a high-performance prototype vector search system. Taking FAISS as an example, it is open-source and developed by Meta for efficient similarity search and dense vector clustering. FAISS can handle vector collections of any size, even those that cannot be fully loaded into memory. Additionally, FAISS offers tools for evaluation and parameter tuning. Even though written in C++, FAISS provides a Python/NumPy interface.</p>
<p>However, vector search libraries are merely lightweight ANN libraries rather than managed solutions, and they have limited functionality. If your dataset is small and limited, these libraries can be sufficient for unstructured data processing, even for systems running in production. However, as dataset sizes increase and more users are onboarded, the scale problem becomes increasingly difficult to solve. Moreover, they don’t allow any modifications to their index data and cannot be queried during data import.</p>
<p>By contrast, vector databases are a more optimal solution for unstructured data storage and retrieval. They can store and query millions or even billions of vectors while providing real-time responses simultaneously; they’re highly scalable to meet users’ growing business needs.</p>
<p>In addition, vector databases like Milvus have much more user-friendly features for structured/semi-structured data:  cloud-nativity, multi-tenancy, scalability, etc. These features will become clear as we dive deeper into this tutorial.</p>
<p>They also operate in a totally different layer of abstraction from vector search libraries - vector databases are full-fledged services, while ANN libraries are meant to be integrated into the application that you’re developing. In this sense, ANN libraries are one of the many components that vector databases are built on top of, similar to how Elasticsearch is built on top of Apache Lucene.</p>
<p>To give an example of why this abstraction is so important, let’s look at inserting a new unstructured data element into a vector database. This is super easy in Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>It’s really as easy as that - 3 lines of code. With a library such as FAISS or ScaNN, there is, unfortunately, no easy way of doing this without manually re-creating the entire index at certain checkpoints. Even if you could, vector search libraries still lack scalability and multi-tenancy, two of the most important vector database features.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">Vector databases vs. vector search plugins for traditional databases<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Great, now that we’ve established the difference between vector search libraries and vector databases, let’s take a look at how vector databases differ from <strong>vector search plugins</strong>.</p>
<p>An increasing number of traditional relational databases, and search systems such as Clickhouse and <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> are including built-in vector search plugins. Elasticsearch 8.0, for example, includes vector insertion and ANN search functionality that can be called via restful API endpoints. The problem with vector search plugins should be clear as night and day - <strong>these solutions do not take a full-stack approach to embedding management and vector search</strong>. Instead, these plugins are meant to be enhancements on top of existing architectures, thereby making them limited and unoptimized. Developing an unstructured data application atop a traditional database would be like trying to fit lithium batteries and electric motors inside the frame of a gas-powered car - not a great idea!</p>
<p>To illustrate why this is, let’s go back to the list of features that a vector database should implement (from the first section). Vector search plugins are missing two of these features - tunability and user-friendly APIs/SDKs. I’ll continue to use Elasticsearch’s ANN engine as an example; other vector search plugins operate very similarly so I won’t go too much further into detail. Elasticsearch supports vector storage via the <code translate="no">dense_vector</code> data field type and allows for querying via the <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Elasticsearch’s ANN plugin supports only one indexing algorithm: Hierarchical Navigable Small Worlds, also known as HNSW (I like to think that the creator was ahead of Marvel when it came to popularizing the multiverse). On top of that, only L2/Euclidean distance is supported as a distance metric. This is an okay start, but let’s compare it to Milvus, a full-fledged vector database. Using <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>While both <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch and Milvus</a> have methods for creating indexes, inserting embedding vectors, and performing nearest neighbor search, it’s clear from these examples that Milvus has a more intuitive vector search API (better user-facing API) and broader vector index + distance metric support (better tunability). Milvus also plans to support more vector indices and allow for querying via SQL-like statements in the future, further improving both tunability and usability.</p>
<p>We just blew through quite a bit of content. This section was admittedly fairly long, so for those of you who skimmed it, here’s a quick tl;dr: Milvus is better than vector search plugins because Milvus was built from the ground-up as a vector database, allowing for a richer set of features and an architecture more suited towards unstructured data.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">How to choose from different vector search technologies?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Not all vector databases are created equal; each possesses unique traits that cater to specific applications. Vector search libraries and plugins are user-friendly and ideal for handling small-scale production environments with millions of vectors. If your data size is small and you just require basic vector search functionality, these technologies are sufficient for your business.</p>
<p>However, a specialized vector database should be your top choice for data-intensive businesses dealing with hundreds of millions of vectors and demanding real-time responses. Milvus, for instance, effortlessly manages billions of vectors, offering lightning-fast query speeds and rich functionality. Moreover, fully managed solutions like Zilliz prove even more advantageous, liberating you from operational challenges and enabling an exclusive focus on your core business activities.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">Take another look at the Vector Database 101 courses<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">Introduction to Unstructured Data</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">What is a Vector Database?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Comparing Vector Databases, Vector Search Libraries, and Vector Search Plugins</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Introduction to Milvus</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Milvus Quickstart</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">Introduction to Vector Similarity Search</a></li>
<li><a href="https://zilliz.com/blog/vector-index">Vector Index Basics and the Inverted File Index</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">Scalar Quantization and Product Quantization</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">Hierarchical Navigable Small Worlds (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">Approximate Nearest Neighbors Oh Yeah (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">Choosing the Right Vector Index for Your Project</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN and the Vamana Algorithm</a></li>
</ol>
