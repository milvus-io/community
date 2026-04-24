---
id: Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md
title: Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search
author: milvus
date: 2021-01-13T08:56:00.480Z
desc: >-
  Explore the power of open-source in your next AI or machine learning project.
  Manage massive-scale vector data and power similarity search with Milvus.
cover: assets.zilliz.com/1_9a6be0b54f.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search
---
<custom-h1>Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search</custom-h1><p>Every day, an incalculable number of business-critical insights are squandered because companies can’t make sense of their own data. Unstructured data, such as text, image, video, and audio, is estimated to account for 80% of all data — but just 1% of it is ever analyzed. Fortunately, <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f">artificial intelligence (AI)</a>, open-source software, and Moore’s law are making machine-scale analytics more accessible than ever before. Using vector similarity search, it is possible to extract value from massive unstructured datasets. This technique involves converting unstructured data into feature vectors, a machine-friendly numerical data format that can be processed and analyzed in real time.</p>
<p>Vector similarity search has applications spanning e-commerce, security, new drug development, and more. These solutions rely on dynamic datasets containing millions, billions, or even trillions of vectors, and their usefulness often depends on returning near instantaneous results. <a href="https://milvus.io/">Milvus</a> is an open-source vector data management solution built from the ground up for efficiently managing and searching large vector datasets. This article covers Milvus’ approach to vector data management, as well as how the platform has been optimized for vector similarity search.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#milvus-was-built-for-massive-scale-think-trillion-vector-similarity-search">Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search</a>
<ul>
<li><a href="#lsm-trees-keep-dynamic-data-management-efficient-at-massive-scales">LSM trees keep dynamic data management efficient at massive scales</a>
- <a href="#a-segment-of-10-dimensional-vectors-in-milvus"><em>A segment of 10-dimensional vectors in Milvus.</em></a></li>
<li><a href="#data-management-is-optimized-for-rapid-access-and-limited-fragmentation">Data management is optimized for rapid access and limited fragmentation</a>
- <a href="#an-illustration-of-inserting-vectors-in-milvus"><em>An illustration of inserting vectors in Milvus.</em></a>
- <a href="#queried-data-files-before-the-merge"><em>Queried data files before the merge.</em></a>
- <a href="#queried-data-files-after-the-merge"><em>Queried data files after the merge.</em></a></li>
<li><a href="#similarity-searched-is-accelerated-by-indexing-vector-data">Similarity searched is accelerated by indexing vector data</a></li>
<li><a href="#learn-more-about-milvus">Learn more about Milvus</a></li>
</ul></li>
</ul>
<h3 id="LSM-trees-keep-dynamic-data-management-efficient-at-massive-scales" class="common-anchor-header">LSM trees keep dynamic data management efficient at massive scales</h3><p>To provide efficient dynamic data management, Milvus uses a log-structured merge-tree (LSM tree) data structure. LSM trees are well suited for accessing data that has a high number of inserts and deletes. For detailed information on specific attributes of LSM trees that help ensure high-performance dynamic data management, see the <a href="http://paperhub.s3.amazonaws.com/18e91eb4db2114a06ea614f0384f2784.pdf">original research</a> published by its inventors. LSM trees are the underlying data structure used by many popular databases, including <a href="https://cloud.google.com/bigtable">BigTable</a>, <a href="https://cassandra.apache.org/">Cassandra</a>, and <a href="https://rocksdb.org/">RocksDB</a>.</p>
<p>Vectors exist as entities in Milvus and are stored in segments. Each segment contains anywhere from one up to ~8 million entities. Each entity has fields for a unique ID and vector inputs, with the latter representing anywhere from 1 to 32768 dimensions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_2_492d31c7a0.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_2.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_2.png" />
    <span>Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_2.png</span>
  </span>
</p>
<h3 id="Data-management-is-optimized-for-rapid-access-and-limited-fragmentation" class="common-anchor-header">Data management is optimized for rapid access and limited fragmentation</h3><p>When receiving an insert request, Milvus writes new data to the <a href="https://milvus.io/docs/v0.11.0/write_ahead_log.md">write ahead log (WAL)</a>. After the request is successfully recorded to the log file, the data is written to a mutable buffer. Finally, one of three triggers results in the buffer becoming immutable and flushing to disk:</p>
<ol>
<li><strong>Timed intervals:</strong> Data is regularly flushed to disk at defined intervals (1 second by default).</li>
<li><strong>Buffer size:</strong> Accumulated data reaches the upper limit for the mutable buffer (128 MB).</li>
<li><strong>Manual trigger:</strong> Data is manually flushed to disk when the client calls the flush function.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_3_852dc2c9bb.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_3.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_3.png" />
    <span>Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_3.png</span>
  </span>
</p>
<p>Users can add tens or millions of vectors at a time, generating data files of different sizes as new vectors are inserted. This results in fragmentation that can complicate data management and slow down vector similarity search. To prevent excessive data fragmentation, Milvus constantly merges data segments until the combined file size reaches a user configurable limit (e.g., 1 GB). For example, given an upper limit of 1 GB, inserting 100 million 512-dimensional vectors will result in just ~200 data files.</p>
<p>In incremental computation scenarios where vectors are inserted and searched concurrently, Milvus makes newly inserted vector data immediately available for search before merging it with other data. After data merges, the original data files will be removed and the newly created merged file will be used for search instead.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_4_6bef3d914c.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_4.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_4.png" />
    <span>Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_4.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_5_3851c2d789.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_5.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_5.png" />
    <span>Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_5.png</span>
  </span>
</p>
<h3 id="Similarity-searched-is-accelerated-by-indexing-vector-data" class="common-anchor-header">Similarity searched is accelerated by indexing vector data</h3><p>By default, Milvus relies on brute-force search when querying vector data. Also known as exhaustive search, this approach checks all vector data each time a query is run. With datasets containing millions or billions of multi-dimensional vectors, this process is too slow to be useful in most similarity search scenarios. To help expedite query time, algorithms are used to build a vector index. The indexed data is clustered such that similar vectors are closer together, allowing the similarity search engine to query just a portion of the total data, drastically reducing query times while sacrificing accuracy.</p>
<p>Most of the vector index types supported by Milvus use approximate nearest neighbor (ANN) search algorithms. There are numerous ANN indexes, and each one comes with tradeoffs between performance, accuracy, and storage requirements. Milvus supports quantization-, graph, and tree-based indexes, all of which serve different application scenarios. See Milvus’ <a href="https://milvus.io/docs/v0.11.0/index.md#CPU">technical documentation</a> for more information about building indexes and the specific types of vector indexes it supports.</p>
<p>Index building generates a lot of metadata. For example, indexing 100 million 512-dimensional vectors saved in 200 data files will result in an additional 200 index files. In order to efficiently check file statuses and delete or insert new files, an efficient metadata management system is required. Milvus uses online transactional processing (OLTP), a data processing technique that is well-suited for updating and/or deleting small amounts of data in a database. Milvus uses SQLite or MySQL to manage metadata.</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">Learn more about Milvus</h3><p>Milvus is an open-source vector data management platform currently in incubation at <a href="https://lfaidata.foundation/">LF AI &amp; Data</a>, an umbrella organization of the Linux Foundation. Milvus was made open source in 2019 by <a href="https://zilliz.com">Zilliz</a>, the data science software company that initiated the project. More information about Milvus can be found on its <a href="https://milvus.io/">website</a>. If you’re interested in vector similarity search, or using AI to unlock the potential of unstructured data, please join our <a href="https://github.com/milvus-io">open-source community</a> on GitHub.</p>
