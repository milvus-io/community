---
id: dynamic-data-update-and-query-milvus.md
title: 准备工作
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: 向量搜索现在更加直观方便
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Milvus 如何实现动态数据更新和查询</custom-h1><p>在本文中，我们将主要介绍如何在 Milvus 内存中记录向量数据，以及如何维护这些记录。</p>
<p>以下是我们的主要设计目标：</p>
<ol>
<li>数据导入的效率要高。</li>
<li>数据导入后能尽快看到数据。</li>
<li>避免数据文件碎片化。</li>
</ol>
<p>因此，我们建立了一个内存缓冲区（插入缓冲区）来插入数据，以减少磁盘和操作系统随机 IO 的上下文切换次数，提高数据插入的性能。基于 MemTable 和 MemTableFile 的内存存储架构能让我们更方便地管理和序列化数据。缓冲区的状态分为可变和不可变两种，这样就可以将数据持久化到磁盘上，同时保持外部服务可用。</p>
<h2 id="Preparation" class="common-anchor-header">准备工作<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>当用户准备向 Milvus 插入向量时，首先需要创建一个 Collection（* Milvus 在 0.7.0 版本中将 Table 更名为 Collection）。Collection 是在 Milvus 中记录和搜索向量的最基本单位。</p>
<p>每个 Collection 都有一个唯一的名称和一些可以设置的属性，向量会根据 Collection 名称进行插入或搜索。创建新的 Collection 时，Milvus 会在元数据中记录此 Collection 的信息。</p>
<h2 id="Data-Insertion" class="common-anchor-header">数据插入<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>当用户发送插入数据的请求时，数据经过序列化和反序列化后到达 Milvus 服务器。现在，数据被写入内存。内存写入大致分为以下几个步骤：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-data-insertion-milvus.png</span> </span></p>
<ol>
<li>在 MemManager 中，找到或创建与 Collections 名称相对应的新 MemTable。每个 MemTable 对应内存中的一个 Collection 缓冲区。</li>
<li>一个 MemTable 将包含一个或多个 MemTableFile。每当我们创建一个新的 MemTableFile 时，都会同时在 Meta 中记录这些信息。我们将 MemTableFile 分成两种状态：可变和不可变。当 MemTableFile 的大小达到阈值时，它将变为不可变。每个 MemTable 在任何时候都只能写入一个 Mutable MemTableFile。</li>
<li>每个 MemTableFile 的数据最终都将以设定索引类型的格式记录在内存中。MemTableFile 是管理内存数据的最基本单位。</li>
<li>在任何时候，插入数据的内存使用量都不会超过预设值（insert_buffer_size）。这是因为每次插入数据的请求到来时，MemManager 都能轻松计算出每个 MemTable 所包含的 MemTableFile 占用的内存，然后根据当前内存协调插入请求。</li>
</ol>
<p>通过 MemManager、MemTable 和 MemTableFile 的多级架构，数据插入可以得到更好的管理和维护。当然，它们能做的远不止这些。</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">近乎实时的查询<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中，插入的数据从内存移动到磁盘最长只需等待一秒钟。整个过程大致可以用下图来概括：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-near-real-time-query-milvus.png</span> </span></p>
<p>首先，插入的数据将进入内存中的插入缓冲区。缓冲区会周期性地从初始可变状态变为不可变状态，为序列化做准备。然后，这些不可变缓冲区将由后台序列化线程定期序列化到磁盘。数据放置后，订单信息将记录在元数据中。此时，就可以搜索数据了！</p>
<p>现在，我们将详细描述图片中的步骤。</p>
<p>我们已经知道了将数据插入可变缓冲区的过程。下一步就是从可变缓冲区切换到不可变缓冲区：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-imutable-buffer-milvus.png</span> </span></p>
<p>不可变队列将为后台序列化线程提供不可变状态和准备序列化的 MemTableFile。每个 MemTable 都管理自己的不可变队列，当 MemTable 的唯一可变 MemTableFile 的大小达到阈值时，它将进入不可变队列。负责 ToImmutable 的后台线程会定期提取 MemTable 管理的不可变队列中的所有 MemTableFile，并将它们发送到总的不可变队列中。需要注意的是，向内存中写入数据和将内存中的数据变为不能写入的状态这两个操作不能同时进行，需要一个公共锁。不过，ToImmutable 的操作非常简单，几乎不会造成任何延迟，因此对插入数据的性能影响很小。</p>
<p>下一步是将序列化队列中的 MemTableFile 序列化到磁盘。这主要分为三个步骤：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialize-memtablefile-milvus.png</span> </span></p>
<p>首先，后台序列化线程会定期从不可变队列中提取 MemTableFile。然后，它们会被序列化为固定大小的原始文件（Raw TableFiles）。最后，我们将在元数据中记录这些信息。当我们进行向量搜索时，将在元数据中查询相应的 TableFile。从这里可以搜索这些数据！</p>
<p>此外，根据 index_file_size 设置，序列化线程在完成一个序列化周期后，会将一些固定大小的 TableFile 合并为一个 TableFile，并将这些信息记录在元数据中。此时，就可以为 TableFile 编制索引了。索引的建立也是异步的。另一个负责建立索引的后台线程会定期读取元数据 ToIndex 状态下的 TableFile，以执行相应的索引建立工作。</p>
<h2 id="Vector-search" class="common-anchor-header">向量搜索<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>事实上，你会发现在 TableFile 和元数据的帮助下，向量搜索变得更加直观和方便。一般来说，我们需要从元数据中获取与查询的 Collections 相对应的 TableFile，在每个 TableFile 中进行搜索，最后进行合并。本文不深入讨论搜索的具体实现。</p>
<p>如果你想了解更多，欢迎阅读我们的源代码，或阅读我们关于 Milvus 的其他技术文章！</p>
