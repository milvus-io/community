---
id: dynamic-data-update-and-query-milvus.md
title: Preparation
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: Vector search is now more intuitive and convenient
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>How Milvus Implements Dynamic Data Update And Query</custom-h1><p>In this article, we will mainly describe how vector data are recorded in the memory of Milvus, and how these records are maintained.</p>
<p>Below are our main design goals:</p>
<ol>
<li>Efficiency of data import should be high.</li>
<li>Data can be seen as soon as possible after data import.</li>
<li>Avoid fragmentation of data files.</li>
</ol>
<p>Therefore, we have established a memory buffer (insert buffer) to insert data to reduce the number of context switches of random IO on the disk and operating system to improve the performance of data insertion. The memory storage architecture based on MemTable and MemTableFile enables us to manage and serialize data more conveniently. The state of the buffer is divided into Mutable and Immutable, which allows the data to be persisted to disk while keeping external services available.</p>
<h2 id="Preparation" class="common-anchor-header">Preparation<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>When the user is ready to insert a vector into Milvus, he first needs to create a Collection (* Milvus renames Table to Collection in 0.7.0 version). Collection is the most basic unit for recording and searching vectors in Milvus.</p>
<p>Each Collection has a unique name and some properties that can be set, and vectors are inserted or searched based on the Collection name. When creating a new Collection, Milvus will record the information of this Collection in the metadata.</p>
<h2 id="Data-Insertion" class="common-anchor-header">Data Insertion<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>When the user sends a request to insert data, the data are serialized and deserialized to reach the Milvus server. Data are now written into memory. Memory writing is roughly divided into the following steps:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
    <span>2-data-insertion-milvus.png</span>
  </span>
</p>
<ol>
<li>In MemManager, find or create a new MemTable corresponding to the name of the Collection. Each MemTable corresponds to a Collection buffer in memory.</li>
<li>A MemTable will contain one or more MemTableFile. Whenever we create a new MemTableFile, we will record this information in the Meta at the same time. We divide MemTableFile into two states: Mutable and Immutable. When the size of MemTableFile reaches the threshold, it will become Immutable. Each MemTable can only have one Mutable MemTableFile to be written at any time.</li>
<li>The data of each MemTableFile will be finally recorded in the memory in the format of the set index type. MemTableFile is the most basic unit for managing data in memory.</li>
<li>At any time, the memory usage of the inserted data will not exceed the preset value (insert_buffer_size). This is because every request to insert data comes in, MemManager can easily calculate the memory occupied by the MemTableFile contained in each MemTable, and then coordinate the insertion request according to the current memory.</li>
</ol>
<p>Through MemManager, MemTable and MemTableFile multi-level architecture, data insertion can be better managed and maintained. Of course, they can do much more than that.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">Near Real-time Query<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus, you only need to wait for one second at the longest for the inserted data to move from memory to disk. This entire process can be roughly summarized by the following picture:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
    <span>2-near-real-time-query-milvus.png</span>
  </span>
</p>
<p>First, the inserted data will enter an insert buffer in memory. The buffer will periodically change from the initial Mutable state to the Immutable state in preparation for serialization. Then, these Immutable buffers will be serialized to disk periodically by the background serialization thread. After the data are placed, the order information will be recorded in the metadata. At this point, the data can be searched!</p>
<p>Now, we will describe the steps in the picture in detail.</p>
<p>We already know the process of inserting data into the mutable buffer. The next step is to switch from the mutable buffer to the immutable buffer:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
    <span>3-mutable-buffer-immutable-buffer-milvus.png</span>
  </span>
</p>
<p>Immutable queue will provide the background serialization thread with the immutable state and the MemTableFile that is ready to be serialized. Each MemTable manages its own immutable queue, and when the size of the MemTable’s only mutable MemTableFile reaches the threshold, it will enter the immutable queue. A background thread responsible for ToImmutable will periodically pull all the MemTableFiles in the immutable queue managed by MemTable and send them to the total Immutable queue. It should be noted that the two operations of writing data into the memory and changing the data in the memory into a state that cannot be written cannot occur at the same time, and a common lock is required. However, the operation of ToImmutable is very simple and almost does not cause any delay, so the performance impact on inserted data is minimal.</p>
<p>The next step is to serialize the MemTableFile in the serialization queue to disk. This is mainly divided into three steps:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
    <span>4-serialize-memtablefile-milvus.png</span>
  </span>
</p>
<p>First, the background serialization thread will periodically pull MemTableFile from the immutable queue. Then, they are serialized into fixed-size raw files (Raw TableFiles). Finally, we will record this information in the metadata. When we conduct a vector search, we will query the corresponding TableFile in the metadata. From here, these data can be searched!</p>
<p>In addition, according to the set index_file_size, after the serialization thread completes a serialization cycle, it will merge some fixed-size TableFiles into a TableFile, and also record these information in the metadata. At this time, the TableFile can be indexed. Index building is also asynchronous. Another background thread responsible for index building will periodically read the TableFile in the ToIndex state of the metadata to perform the corresponding index building.</p>
<h2 id="Vector-search" class="common-anchor-header">Vector search<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>In fact, you will find that with the help of TableFile and metadata, vector search becomes more intuitive and convenient. In general, we need to get the TableFiles corresponding to the queried Collection from the metadata, search in each TableFile, and finally merge. In this article, we do not delve into the specific implementation of search.</p>
<p>If you want to know more, welcome to read our source code, or read our other technical articles about Milvus!</p>
