---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: Scalable and Blazing Fast Similarity Search with Milvus Vector Database
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: 'Store, index, manage and search trillions of document vectors in milliseconds!'
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
    <span>cover image</span>
  </span>
</p>
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>In this article, we will cover some interesting aspects relevant to vector databases and similarity search at scale. In today’s rapidly evolving world, we see new technology, new businesses, new data sources and consequently we will need to keep using new ways to store, manage and leverage this data for insights. Structured, tabular data has been stored in relational databases for decades, and Business Intelligence thrives on analyzing and extracting insights from such data. However, considering the current data landscape, “over 80–90% of data is unstructured information like text, video, audio, web server logs, social media, and more”. Organizations have been leveraging the power of machine learning and deep learning to try and extract insights from such data as traditional query-based methods may not be enough or even possible. There is a huge, untapped potential to extract valuable insights from such data and we are only getting started!</p>
<blockquote>
<p>“Since most of the world’s data is unstructured, an ability to analyze and act on it presents a big opportunity.” — Mikey Shulman, Head of ML, Kensho</p>
</blockquote>
<p>Unstructured data, as the name suggests, does not have an implicit structure, like a table of rows and columns (hence called tabular or structured data). Unlike structured data, there is no easy way to store the contents of unstructured data within a relational database. There are three main challenges with leveraging unstructured data for insights:</p>
<ul>
<li><strong>Storage:</strong> Regular relational databases are good for holding structured data. While you can use NoSQL databases to store such data, it becomes an additional overhead to process such data to extract the right representations to power AI applications at scale</li>
<li><strong>Representation:</strong> Computers don’t understand text or images like we do. They only understand numbers and we need to covert unstructed data into some useful numeric representation, typically vectors or embeddings.</li>
<li><strong>Querying:</strong> You can’t query unstructured data directly based on definite conditional statements like SQL for structured data. Imagine, a simple example of you trying to search for similar shoes given a photo of your favorite pair of shoes! You can’t use raw pixel values for search, neither can you represent structured features like shoe shape, size, style, color and more. Now imagine having to do this for millions of shoes!</li>
</ul>
<p>Hence, in order for computers to understand, process and represent unstructured data, we typically convert them into dense vectors, often called embeddings.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
    <span>figure 1</span>
  </span>
</p>
<p>There exist a variety of methodologies especially leveraging deep learning, including convolutional neural networks (CNNs) for visual data like images and Transformers for text data which can be used to transform such unstructured data into embeddings. <a href="https://zilliz.com/">Zilliz</a> has <a href="https://zilliz.com/learn/embedding-generation">an excellent article covering different embedding techiques</a>!</p>
<p>Now storing these embedding vectors is not enough. One also needs to be able to query and find out similar vectors. Why do you ask? A majority of real-world applications are powered by vector similarity search for AI based solutions. This includes visual (image) search in Google, recommendations systems in Netflix or Amazon, text search engines in Google, multi-modal search, data de-duplication and many more!</p>
<p>Storing, managing and querying vectors at scale is not a simple task. You need specialized tools for this and vector databases are the most effective tool for the job! In this article we will cover the following aspects:</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">Vectors and Vector Similarity Search</a></li>
<li><a href="#What-is-a-Vector-Database">What is a Vector Database?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus — The World’s Most Advanced Vector Database</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Performing visual image search with Milvus — A use-case blueprint</a></li>
</ul>
<p>Let’s get started!</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">Vectors and Vector Similarity Search<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Earlier, we established the necessity of representing unstructured data like images and text as vectors, since computers can only understand numbers. We typically leverage AI models, to be more specific deep learning models to convert unstructured data into numeric vectors which can be read in by machines. Typically these vectors are basically a list of floating point numbers which collectively represents the underlying item (image, text etc.).</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">Understanding Vectors</h3><p>Considering the field of natural language processing (NLP) we have many word embedding models like <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, GloVe and FastText</a> which can help represent words as numeric vectors. With advancements over time, we have seen the rise of <a href="https://arxiv.org/abs/1706.03762">Transformer</a> models like <a href="https://jalammar.github.io/illustrated-bert/">BERT</a> which can be leveraged to learn contextual embedding vectors and better representations for entire sentences and paragraphs.</p>
<p>Similarly for the field of computer vision we have models like <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">Convolutional Neural Networks (CNNs)</a> which can help in learning representations from visual data such as images and videos. With the rise of Transformers, we also have <a href="https://arxiv.org/abs/2010.11929">Vision Transformers</a> which can perform better than regular CNNs.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
    <span>figure 2</span>
  </span>
</p>
<p>The advantage with such vectors is that we can leverage them for solving real-world problems such as visual search, where you typically upload a photo and get search results including visually similar images. Google has this as a very popular feature in their search engine as depicted in the following example.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
    <span>figure 3</span>
  </span>
</p>
<p>Such applications are powered with data vectors and vector similarity search. If you consider two points in an X-Y cartesian coordinate space. The distance between two points can be computed as a simple euclidean distance depicted by the following equation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
    <span>figure 4</span>
  </span>
</p>
<p>Now imagine each data point is a vector having D-dimensions, you could still use euclidean distance or even other distance metrics like hamming or cosine distance to find out how close the two data points are to each other. This can help build a notion of closeness or similarity which could be used as a quantifiable metric to find similar items given a reference item using their vectors.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">Understanding Vector Similarity Search</h3><p>Vector similarity search, often known as nearest neighbor (NN) search, is basically the process of computing pairwise similarity (or distances) between a reference item (for which we want to find similar items) and a collection of existing items (typically in a database) and returning the top ‘k’ nearest neighbors which are the top ‘k’ most similar items. The key component to compute this similarity is the similarity metric which can be euclidean distance, inner product, cosine distance, hamming distance, etc. The smaller the distance, the more similar are the vectors.</p>
<p>The challenge with exact nearest neighbor (NN) search is scalability. You need to compute N-distances (assuming N existing items) everytime to get similar items. This can be super slow especially if you don’t store and index the data somewhere (like a vector database!). To speed up computation, we typically leverage approximate nearest neighbor search which is often called ANN search which ends up storing the vectors into an index. The index helps in storing these vectors in an intelligent way to enable quick retrieval of ‘approximately’ similar neighbors for a reference query item. Typical ANN indexing methodologies include:</p>
<ul>
<li><strong>Vector Transformations:</strong> This includes adding additional transformations to the vectors like dimension reduction (e.g PCA \ t-SNE), rotation and so on</li>
<li><strong>Vector Encoding:</strong> This includes applying techniques based on data structures like Locality Sensitive Hashing (LSH), Quantization, Trees etc. which can help in faster retrieval of similar items</li>
<li><strong>Non-Exhaustive Search Methods:</strong> This is mostly used to prevent exhaustive search and includes methods like neighborhood graphs, inverted indices etc.</li>
</ul>
<p>This establishes the case that to build any vector similarity search application, you need a database which can help you with efficient storing, indexing and querying (search) at scale. Enter vector databases!</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">What is a Vector Database?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Given that we now understand how vectors can be used to represent unstructured data and how vector search works, we can combine the two concepts together to build a vector database.</p>
<p>Vector databases are scalable data platforms to store, index and query across embedding vectors which are generated from unstructured data (images, text etc.) using deep learning models.</p>
<p>Handling a massive numbers of vectors for similarity search (even with indices) can be super expensive. Despite this, the best and most advanced vector databases should allow you to insert, index and search across millions or billions of target vectors, in addition to specifying an indexing algorithm and similarity metric of your choice.</p>
<p>Vector databases mainly should satisfy the following key requirements considering a robust database management system to be used in the enterprise:</p>
<ol>
<li><strong>Scalable:</strong> Vector databases should be able to index and run approximate nearest neighbor search for billions of embedding vectors</li>
<li><strong>Reliable:</strong> Vector databases should be able to handle internal faults without data loss and with minimal operational impact, i.e be fault-tolerant</li>
<li><strong>Fast:</strong> Query and write speeds are important for vector databases. For platforms such as Snapchat and Instagram, which can have hundreds or thousands of new images uploaded per second, speed becomes an incredibly important factor.</li>
</ol>
<p>Vector databases don’t just store data vectors. They are also responsible for using efficient data structures to index these vectors for fast retrieval and supporting CRUD (create, read, update and delete) operations. Vector databases should also ideally support attribute filtering which is filtering based on metadata fields which are usually scalar fields. A simple example would be retrieving similar shoes based on the image vectors for a specific brand. Here brand would be the attribute based on which filtering would be done.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
    <span>figure 5</span>
  </span>
</p>
<p>The figure above showcases how <a href="https://milvus.io/">Milvus</a>, the vector database we will talk about shortly, uses attribute filtering. <a href="https://milvus.io/">Milvus</a> introduces the concept of a bitmask to the filtering mechanism to keep similar vectors with a bitmask of 1 based on satisfying specific attribute filters. More details on this <a href="https://zilliz.com/learn/attribute-filtering">here</a>.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus — The World’s Most Advanced Vector Database<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> is an open-source vector database management platform built specifically for massive-scale vector data and streamlining machine learning operations (MLOps).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
    <span>figure 6</span>
  </span>
</p>
<p><a href="https://zilliz.com/">Zilliz</a>, is the organization behind building <a href="https://milvus.io/">Milvus</a>, the world’s most advanced vector database, to accelerate the development of next generation data fabric. Milvus is currently a graduation project at the <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> and focuses on managing massive unstructured datasets for storage and search. The platform’s efficiency and reliability simplifies the process of deploying AI models and MLOps at scale. Milvus has broad applications spanning drug discovery, computer vision, recommendation systems, chatbots, and much more.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Key Features of Milvus</h3><p>Milvus is packed with useful features and capabilities, such as:</p>
<ul>
<li><strong>Blazing search speeds on a trillion vector datasets:</strong> Average latency of vector search and retrieval has been measured in milliseconds on a trillion vector datasets.</li>
<li><strong>Simplified unstructured data management:</strong> Milvus has rich APIs designed for data science workflows.</li>
<li><strong>Reliable, always on vector database:</strong> Milvus’ built-in replication and failover/failback features ensure data and applications can maintain business continuity always.</li>
<li><strong>Highly scalable and elastic:</strong> Component-level scalability makes it possible to scale up and down on demand.</li>
<li><strong>Hybrid search:</strong> In addition to vectors, Milvus supports data types such as Boolean, String, integers, floating-point numbers, and more. Milvus pairs scalar filtering with powerful vector similarity search (as seen in the shoe similarity example earlier).</li>
<li><strong>Unified Lambda structure:</strong> Milvus combines stream and batch processing for data storage to balance timeliness and efficiency.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">Time Travel</a>:</strong> Milvus maintains a timeline for all data insert and delete operations. It allows users to specify timestamps in a search to retrieve a data view at a specified point in time.</li>
<li><strong>Community supported &amp; Industry recognized:</strong> With over 1,000 enterprise users, 10.5K+ stars on <a href="https://github.com/milvus-io/milvus">GitHub</a>, and an active open-source community, you’re not alone when you use Milvus. As a graduate project under the <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>, Milvus has institutional support.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">Existing Approaches to Vector Data Management and Search</h3><p>A common way to build an AI system powered by vector similarity search is to pair algorithms like Approximate Nearest Neighbor Search (ANNS) with open-source libraries such as:</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI Similarity Search (FAISS)</a>:</strong> This framework enables efficient similarity search and clustering of dense vectors. It contains algorithms that search in sets of vectors of any size, up to ones that possibly do not fit in RAM. It supports indexing capabilities like inverted multi-index and product quantization</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotify’s Annoy (Approximate Nearest Neighbors Oh Yeah)</a>:</strong> This framework uses <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">random projections</a> and builds up a tree to enable ANNS at scale for dense vectors</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">Google’s ScaNN (Scalable Nearest Neighbors)</a>:</strong> This framework performs efficient vector similarity search at scale. Consists of implementations, which includes search space pruning and quantization for Maximum Inner Product Search (MIPS)</li>
</ul>
<p>While each of these libraries are useful in their own way, due to several limitations, these algorithm-library combinations are not equivalent to a full-fledged vector data management system like Milvus. We will discuss some of these limitations now.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">Limitations of Existing Approaches</h3><p>Existing approaches used for managing vector data as discussed in the previous section has the following limitations:</p>
<ol>
<li><strong>Flexibility:</strong> Existing systems typically store all data in main memory, hence they cannot be run in distributed mode across multiple machines easily and are not well-suited for handling massive datasets</li>
<li><strong>Dynamic data handling:</strong> Data is often assumed to be static once fed into existing systems, complicating processing for dynamic data and making near real-time search impossible</li>
<li><strong>Advanced query processing:</strong> Most tools do not support advanced query processing (e.g., attribute filtering, hybrid search and multi-vector queries), which is essential for building real-world similarity search engines supporting advanced filtering.</li>
<li><strong>Heterogeneous computing optimizations:</strong> Few platforms offer optimizations for heterogenous system architectures on both CPUs and GPUs (excluding FAISS), leading to efficiency losses.</li>
</ol>
<p><a href="https://milvus.io/">Milvus</a> attempts to overcome all of these limitations and we will discuss this in detail in the next section.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">The Milvus Advantage —Understanding Knowhere</h3><p><a href="https://milvus.io/">Milvus</a> tries to tackle and successfully solve the limitations of existing systems build on top of inefficient vector data management and similarity search algorithms in the following ways:</p>
<ul>
<li>It enhances flexibility by offering support for a variety of application interfaces (including SDKs in Python, Java, Go, C++ and RESTful APIs)</li>
<li>It supports multiple vector index types (e.g., quantization-based indexes and graph-based indexes), and advanced query processing</li>
<li>Milvus handles dynamic vector data using a log-structured merge-tree (LSM tree), keeping data insertions and deletions efficient and searches humming along in real time</li>
<li>Milvus also provides optimizations for heterogeneous computing architectures on modern CPUs and GPUs, allowing developers to adjust systems for specific scenarios, datasets, and application environments</li>
</ul>
<p>Knowhere, the vector execution engine of Milvus, is an operation interface for accessing services in the upper layers of the system and vector similarity search libraries like Faiss, Hnswlib, Annoy in the lower layers of the system. In addition, Knowhere is also in charge of heterogeneous computing. Knowhere controls on which hardware (eg. CPU or GPU) to execute index building and search requests. This is how Knowhere gets its name — knowing where to execute the operations. More types of hardware including DPU and TPU will be supported in future releases.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
    <span>figure 7</span>
  </span>
</p>
<p>Computation in Milvus mainly involves vector and scalar operations. Knowhere only handles the operations on vectors in Milvus. The figure above illustrates the Knowhere architecture in Milvus. The bottom-most layer is the system hardware. The third-party index libraries are on top of the hardware. Then Knowhere interacts with the index node and query node on the top via CGO. Knowhere not only further extends the functions of Faiss but also optimizes the performance and has several advantages including support for BitsetView, support for more similarity metrics, support for AVX512 instruction set, automatic SIMD-instruction selection and other performance optimizations. Details can be found <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">here</a>.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus Architecture</h3><p>The following figure showcases the overall architecture of the Milvus platform. Milvus separates data flow from control flow, and is divided into four layers that are independent in terms of scalability and disaster recovery.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
    <span>figure 8</span>
  </span>
</p>
<ul>
<li><strong>Access layer:</strong> The access layer is composed of a group of stateless proxies and serves as the front layer of the system and endpoint to users.</li>
<li><strong>Coordinator service:</strong> The coordinator service is responsible for cluster topology node management, load balancing, timestamp generation, data declaration, and data management</li>
<li><strong>Worker nodes:</strong> The worker, or execution, node executes instructions issued by the coordinator service and the data manipulation language (DML) commands initiated by the proxy. A worker node in Milvus is similar to a data node in <a href="https://hadoop.apache.org/">Hadoop</a>, or a region server in HBase</li>
<li><strong>Storage:</strong> This is the cornerstone of Milvus, responsible for data persistence. The storage layer is comprised of <strong>meta store</strong>, <strong>log broker</strong> and <strong>object storage</strong></li>
</ul>
<p>Do check out more details about the architecture <a href="https://milvus.io/docs/v2.0.x/four_layers.md">here</a>!</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Performing visual image search with Milvus — A use-case blueprint<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Open-source vector databases like Milvus makes it possible for any business to create their own visual image search system with a minimum number of steps. Developers can use pre-trained AI models to convert their own image datasets into vectors, and then leverage Milvus to enable searching for similar products by image. Let’s look at the following blueprint of how to design and build such a system.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
    <span>figure 9</span>
  </span>
</p>
<p>In this workflow we can use an open-source framework like <a href="https://github.com/towhee-io/towhee">towhee</a> to leverage a pre-trained model like ResNet-50 and extract vectors from images, store and index these vectors with ease in Milvus and also store a mapping of image IDs to the actual pictures in a MySQL database. Once the data is indexed we can upload any new image with ease and perform image search at scale using Milvus. The following figure shows a sample visual image search.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
    <span>figure 10</span>
  </span>
</p>
<p>Do check out the detailed <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">tutorial</a> which has been open-sourced on GitHub thanks to Milvus.</p>
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
    </button></h2><p>We’ve covered a fair amount of ground in this article. We started with challenges in representing unstrucutured data, leveraging vectors and vector similarity search at scale with Milvus, an open-source vector database. We discussed about details on how Milvus is structured and the key components powering it and a blueprint of how to solve a real-world problem, visual image search with Milvus. Do give it a try and start solving your own real-world problems with <a href="https://milvus.io/">Milvus</a>!</p>
<p>Liked this article? Do <a href="https://www.linkedin.com/in/dipanzan/">reach out to me</a> to discuss more on it or give feedback!</p>
<h2 id="About-the-author" class="common-anchor-header">About the author<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar is a Data Science Lead, Google Developer Expert — Machine Learning, Author, Consultant and AI Advisor. Connect: http://bit.ly/djs_linkedin</p>
