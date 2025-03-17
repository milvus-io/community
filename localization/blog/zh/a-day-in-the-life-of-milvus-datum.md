---
id: a-day-in-the-life-of-milvus-datum.md
title: Milvus Datum 的一天
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: 那么，让我们一起去看看 Milvus 资料员 Dave 一天的生活吧。
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>建立像 Milvus 这样可扩展到数十亿向量并能处理网络规模流量的高性能向量<a href="https://zilliz.com/learn/what-is-vector-database">数据库</a>并非易事。这需要对分布式系统进行精心、智能的设计。在这样一个系统的内部结构中，必须在性能与简洁性之间做出权衡。</p>
<p>虽然我们努力在这两者之间取得平衡，但内部结构的某些方面仍然是不透明的。本文旨在揭开 Milvus 如何分解数据插入、索引和跨节点服务的神秘面纱。要有效优化查询性能、系统稳定性和调试相关问题，从高层次了解这些流程至关重要。</p>
<p>那么，让我们来看看 Milvus 数据 Dave 一天的生活。想象一下，你在<a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">Milvus Distributed 部署</a>中将 Dave 插入到你的 Collections 中（见下图）。就您而言，他直接进入了 Collections。然而，在幕后，许多步骤都是跨独立子系统进行的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">代理节点和消息队列<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最初，您会调用 MilvusClient 对象，例如通过 PyMilvus 库，并向<em>代理节点</em>发送<code translate="no">_insert()</code>_ 请求。代理节点是用户和数据库系统之间的网关，可对传入流量执行负载均衡等操作，并在将多个输出返回给用户之前对其进行整理。</p>
<p>哈希函数应用于项目的主键，以确定将其发送到哪个<em>通道</em>。使用 Pulsar 或 Kafka 主题实现的通道是流式数据的容纳地，然后可将数据发送给通道的订阅者。</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">数据节点、段和块<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>数据发送到相应的通道后，通道会将其发送到<em>数据节点</em>中相应的段。数据节点负责存储和管理称为<em>增长段的</em>数据缓冲区。每个分片有一个增长段。</p>
<p>随着数据被插入段中，该段会逐渐增大到最大大小，默认值为 122MB。在此期间，段中较小的部分（默认为 16MB，称为<em>块</em>）会被推送到持久化存储，例如，使用 AWS 的 S3 或 MinIO 等其他兼容存储。每个块都是对象存储上的一个物理文件，每个字段都有一个单独的文件。请参阅上图，了解对象存储上的文件层次结构。</p>
<p>因此，概括地说，Collection 的数据被分割到各个数据节点，在这些节点中，数据被分割成用于缓冲的段，这些段又被进一步分割成用于持久化存储的每个字段的块。上面两张图更清楚地说明了这一点。通过这种方式对输入数据进行分割，我们可以充分利用集群在网络带宽、计算和存储方面的并行性。</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">密封、合并和压缩分段<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>到目前为止，我们已经讲述了我们友好的数据 Dave 如何从<code translate="no">_insert()</code>_ 查询进入持久化存储的故事。当然，他的故事还没有结束。还有更多步骤可以提高搜索和索引过程的效率。通过管理数据段的大小和数量，系统可以充分利用集群的并行性。</p>
<p>一旦某个数据段达到数据节点上的最大容量（默认为 122MB），就表示该数据段已被<em>封存</em>。这意味着数据节点上的缓冲区会被清空，为新的数据段让路，而持久存储中的相应块会被标记为属于封闭数据段。</p>
<p>数据节点会定期寻找较小的已封段落，并将它们合并到较大的段落中，直到每个段落的最大容量达到 1GB（默认值）为止。回想一下，当一个项目在 Milvus 中被删除时，它只是被标记上一个删除标志--可以把它想象成戴夫的死囚牢。当段中删除的条目数超过给定的阈值（默认为 20%）时，段的大小就会缩小，我们称这种操作为<em>压缩</em>。</p>
<p>段索引和搜索</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>还有一种额外的节点类型，即<em>索引节点</em>，负责为密封的数据段建立索引。段被密封后，数据节点会向索引节点发送构建索引的请求。然后，索引节点将完成的索引发送到对象存储区。每个密封段都有自己的索引，存储在一个单独的文件中。您可以通过访问存储桶手动检查该文件，文件层次结构见上图。</p>
<p>查询节点（不仅是数据节点）会订阅相应分片的消息队列主题。不断增长的分片被复制到查询节点上，节点会根据需要将属于 Collections 的封存分片加载到内存中。当数据进来时，它会为每个增长段建立索引，并从数据存储中加载密封段的最终索引。</p>
<p>试想一下，你用一个包含 Dave 的<em>search()</em>请求调用 MilvusClient 对象。通过代理节点路由到所有查询节点后，每个查询节点都会执行向量相似性搜索（或其他搜索方法，如查询、范围搜索或分组搜索），逐个迭代段落。搜索结果以类似 MapReduce 的方式在各节点间进行整理，然后发送给用户，戴夫很高兴地发现自己终于和你团聚了。</p>
<h2 id="Discussion" class="common-anchor-header">讨论<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>我们已经介绍了<code translate="no">_insert()</code>_ 和<code translate="no">_search()</code>_ 操作符 Dave 的一天生活。其他操作，如<code translate="no">_delete()</code>_ 和<code translate="no">_upsert()</code>_，也有类似的操作符。不可避免地，我们不得不简化讨论，省略更多细节。不过，总的来说，你现在应该对 Milvus 如何在分布式系统中实现跨节点并行设计以达到稳健和高效，以及如何利用这一点进行优化和调试有了充分的了解。</p>
<p><em>本文的一个重要启示：Milvus 在设计时对各节点类型进行了关注点分离。每种节点类型都有特定的、相互排斥的功能，并且存储和计算分离。</em>因此，每个组件都可以独立扩展，参数可根据用例和流量模式进行调整。例如，您可以在不扩展数据和索引节点的情况下，扩展查询节点的数量，为增加的流量提供服务。有了这种灵活性，Milvus 用户可以处理数十亿向量，为网络规模的流量提供服务，查询延迟低于 100 毫秒。</p>
<p>您还可以通过 Milvus 的全面托管服务<a href="https://zilliz.com/cloud">Zilliz Cloud</a>，享受 Milvus 分布式设计的优势，甚至无需部署分布式集群。<a href="https://cloud.zilliz.com/signup">立即注册 Zilliz Cloud 免费层，将 Dave 付诸行动！</a></p>
