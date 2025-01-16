---
id: deep-dive-3-data-processing.md
title: 向量数据库如何处理数据？
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: Milvus 为生产型人工智能应用提供了必不可少的数据管理基础架构。本文将揭开数据处理的神秘面纱。
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/czs007">曹振山</a>撰写，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>翻译。</p>
</blockquote>
<p>在本系列博客的前两篇文章中，我们已经介绍了全球最先进的向量数据库 Milvus 的<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">系统架构</a>及其<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Python SDK 和 API</a>。</p>
<p>本篇博文主要通过深入 Milvus 系统，研究数据处理组件之间的交互，帮助大家了解 Milvus 是如何处理数据的。</p>
<p><em>下面列出了开始之前的一些有用资源。我们建议您先阅读这些资源，以便更好地理解本篇文章的主题。</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">深入了解 Milvus 架构</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus 数据模型</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Milvus 各组件的角色和功能</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Milvus 中的数据处理</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">MsgStream 接口<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">MsgStream 接口</a>对 Milvus 中的数据处理至关重要。调用<code translate="no">Start()</code> 时，后台的例行程序将数据写入<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">日志代理</a>或从<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">日志代理</a>读取数据。调用<code translate="no">Close()</code> 时，例行程序停止。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>MsgStream 接口</span> </span></p>
<p>MsgStream 既可以作为生产者，也可以作为消费者。<code translate="no">AsProducer(channels []string)</code> 接口将 MsgStream 定义为生产者，而<code translate="no">AsConsumer(channels []string, subNamestring)</code>则将其定义为消费者。<code translate="no">channels</code> 参数在两个接口中是共享的，用于定义向哪个（物理）通道写入数据或从哪个（物理）通道读取数据。</p>
<blockquote>
<p>创建 Collections 时，可以指定集合中分片的数量。每个分片对应一个<a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">虚拟通道（vchannel）</a>。因此，一个 Collection 可以有多个 vchannel。Milvus 会为日志代理中的每个 v 通道分配一个<a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">物理通道（pchannel）</a>。</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>每个虚拟通道/分区对应一个物理通道</span>。 </span></p>
<p><code translate="no">Produce()</code> 在 MsgStream 接口中，负责将数据写入日志代理中的 pchannel。数据写入有两种方式：</p>
<ul>
<li>单次写入：根据主键的哈希值将实体写入不同的分片（vchannel）。然后，这些实体流入日志代理中相应的 pchannel。</li>
<li>广播式写入：实体被写入由参数<code translate="no">channels</code> 指定的所有 pchannels。</li>
</ul>
<p><code translate="no">Consume()</code> 这是一种阻塞式 API。如果指定的 pchannel 中没有可用数据，那么在 MsgStream 接口中调用 时，coroutine 将被阻塞。另一方面， 是一种非阻塞式 API，这意味着只有在指定的 pchannel 中存在现有数据时，coroutine 才会读取和处理数据。否则，coroutine 可以处理其他任务，不会在没有可用数据时被阻塞。<code translate="no">Consume()</code> <code translate="no">Chan()</code> </p>
<p><code translate="no">Seek()</code> 是故障恢复方法。当启动一个新节点时，可以获取数据消耗记录，并通过调用 从中断的位置恢复数据消耗。<code translate="no">Seek()</code></p>
<h2 id="Write-data" class="common-anchor-header">写入数据<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>写入不同 v 通道（碎片）的数据可以是插入信息或删除信息。这些 vchannels 也可称为 DmChannels（数据操作通道）。</p>
<p>不同的 Collections 可以在日志代理中共享相同的 pchannels。一个 Collections 可以有多个分片，因此也可以有多个相应的 vchannels。因此，同一 Collections 中的实体会流入日志代理中多个相应的 pchannels。因此，共享 pchannels 的好处是通过日志代理的高并发性提高吞吐量。</p>
<p>创建 Collections 时，不仅要指定分片的数量，还要决定日志代理中 vchannels 和 pchannels 之间的映射。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中的写入路径</span> </span></p>
<p>如上图所示，在写入路径中，代理通过 MsgStream 的<code translate="no">AsProducer()</code> 接口将数据写入日志代理。然后，数据节点消耗数据，再将消耗的数据转换并存储到对象存储中。存储路径是一种元信息，将由数据协调器记录在 etcd 中。</p>
<h3 id="Flowgraph" class="common-anchor-header">流程图</h3><p>由于不同的 Collections 可能会在日志代理中共享相同的 pchannel，因此在消费数据时，数据节点或查询节点需要判断 pchannel 中的数据属于哪个 Collections。为了解决这个问题，我们在 Milvus 中引入了 flowgraph。它主要负责按照 Collection ID 过滤共享 pchannel 中的数据。因此，我们可以说，每个 flowgraph 处理的都是集合中相应分片（vchannel）中的数据流。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>写入路径中的流程图</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">创建 MsgStream</h3><p>写入数据时，会在以下两种情况下创建 MsgStream 对象：</p>
<ul>
<li>当代理收到数据插入请求时，它首先会尝试通过根协调器（root coordinator）获取 vchannel 和 pchannel 之间的映射。然后，代理创建一个 MsgStream 对象。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>场景 1</span> </span></p>
<ul>
<li>数据节点启动并在 etcd 中读取通道的元信息时，创建 MsgStream 对象。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>场景 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">读取数据<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中的读取路径</span> </span></p>
<p>读取数据的一般工作流程如上图所示。查询请求通过 DqRequestChannel 广播到查询节点。查询节点并行执行查询任务。来自查询节点的查询结果通过 gRPC 和代理汇总后返回给客户端。</p>
<p>仔细观察数据读取过程，我们可以看到代理将查询请求写入 DqRequestChannel。然后，查询节点通过订阅 DqRequestChannel 来消费消息。DqRequestChannel 中的每条信息都会被广播，以便所有订阅的查询节点都能接收到该信息。</p>
<p>当查询节点收到查询请求时，它们会对存储在密封段中的批量数据和动态插入 Milvus 并存储在增长段中的流数据进行本地查询。之后，查询节点需要汇总<a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">密封段和增长段</a>中的查询结果。这些汇总结果通过 gRPC 传递给代理。</p>
<p>代理收集来自多个查询节点的所有结果，然后对它们进行聚合，得到最终结果。然后，代理将最终查询结果返回给客户端。由于每个查询请求及其对应的查询结果都有相同的唯一请求 ID，因此代理可以找出哪个查询结果对应哪个查询请求。</p>
<h3 id="Flowgraph" class="common-anchor-header">流程图</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>读取路径中的流程图</span> </span></p>
<p>与写入路径类似，读取路径中也引入了流程图。Milvus 实现了统一的 Lambda 架构，集成了对增量数据和历史数据的处理。因此，查询节点也需要获取实时流数据。同样，读取路径中的 flowgraph 也会过滤和区分来自不同 Collections 的数据。</p>
<h3 id="MsgStream-creation" class="common-anchor-header">创建 MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>在读取路径中创建 MsgStream 对象</span> </span></p>
<p>读取数据时，MsgStream 对象是在以下情况下创建的：</p>
<ul>
<li>在 Milvus 中，除非加载数据，否则无法读取数据。当代理接收到数据加载请求时，它会将请求发送给查询协调器，由查询协调器决定将分片分配给不同查询节点的方式。分配信息（即 v 通道名称以及 v 通道与相应 p 通道之间的映射）通过方法调用或 RPC（远程过程调用）发送到查询节点。随后，查询节点会创建相应的 MsgStream 对象来消耗数据。</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">DDL 操作符<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL 是数据定义语言的缩写。对元数据的 DDL 操作可分为写入请求和读取请求。不过，在元数据处理过程中，这两类请求会被同等对待。</p>
<p>对元数据的读取请求包括</p>
<ul>
<li>查询 Collections Schema</li>
<li>查询索引信息</li>
</ul>
<p>写请求包括</p>
<ul>
<li>创建 Collections</li>
<li>删除 Collections</li>
<li>建立索引</li>
<li>删除索引 更多</li>
</ul>
<p>DDL 请求从客户端发送到代理，代理再按接收顺序将这些请求传递给根协调器，根协调器为每个 DDL 请求分配一个时间戳，并对请求进行动态检查。代理以串行方式处理每个请求，即一次处理一个 DDL 请求。代理在处理完前一个请求并从根协调器收到结果后，才会处理下一个请求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>DDL 操作符。</span> </span></p>
<p>如上图所示，根协调器任务队列中有<code translate="no">K</code> 个 DDL 请求。任务队列中的 DDL 请求按根协调器收到的顺序排列。因此，<code translate="no">ddl1</code> 是发送给根协调器的第一个请求，而<code translate="no">ddlK</code> 是这批请求中的最后一个。根协调器按照时间顺序逐一处理这些请求。</p>
<p>在分布式系统中，代理与根协调器之间的通信是通过 gRPC 实现的。根协调器会记录已执行任务的最大时间戳值，以确保所有 DDL 请求都按时间顺序处理。</p>
<p>假设有两个独立的代理，即代理 1 和代理 2。它们都向同一个根协调器发送 DDL 请求。然而，一个问题是，较早的请求并不一定会在另一个代理随后收到的请求之前发送到根坐标。例如，在上图中，当<code translate="no">DDL_K-1</code> 从代理 1 发送到根协调器时，来自代理 2 的<code translate="no">DDL_K</code> 已经被根协调器接受并执行。根据根协调器的记录，此时已执行任务的最大时间戳值为<code translate="no">K</code> 。因此，为了不打断时间顺序，根协调器的任务队列将拒绝<code translate="no">DDL_K-1</code> 请求。但是，如果代理 2 在此时向根协调器发送请求<code translate="no">DDL_K+5</code> ，则该请求将被任务队列接受，并在稍后根据其时间戳值执行。</p>
<h2 id="Indexing" class="common-anchor-header">建立索引<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">建立索引</h3><p>收到客户端的索引建立请求后，代理首先会对请求进行静态检查，并将其发送给根协调器。然后，根协调器将这些索引构建请求持久化到元存储（etcd）中，并将请求发送给索引协调器（索引协调器）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>建立索引</span>。 </span></p>
<p>如上图所示，当索引协调器从根协调器接收到建立索引的请求时，它首先会将任务持久化到元存储（etcd）中。索引构建任务的初始状态是<code translate="no">Unissued</code> 。索引协调器会记录每个索引节点的任务负载，并将入站任务发送到负载较低的索引节点。任务完成后，索引节点会将任务状态（<code translate="no">Finished</code> 或<code translate="no">Failed</code> ）写入元存储，即 Milvus 中的 etcd。然后，索引协调器将通过在 etcd 中查找来了解索引构建任务是成功还是失败。如果由于系统资源有限或索引节点掉线导致任务失败，索引协调员将重新触发整个流程，并将相同的任务分配给另一个索引节点。</p>
<h3 id="Dropping-an-index" class="common-anchor-header">放弃索引</h3><p>此外，索引协调员还负责删除索引的请求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>丢弃索引</span> </span></p>
<p>当根协调器收到来自客户端的丢弃索引请求时，它会首先将索引标记为 &quot;丢弃&quot;，并将结果返回给客户端，同时通知索引协调器。然后，索引协调程序会使用<code translate="no">IndexID</code> 过滤所有索引任务，符合条件的任务会被丢弃。</p>
<p>索引协调程序的后台程序将逐步从对象存储（MinIO 和 S3）中删除所有标记为 "已丢弃 "的索引任务。这一过程涉及 recycleIndexFiles 接口。当所有相应的索引文件被删除后，被删除索引任务的元信息也会从元存储（etcd）中删除。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">关于深入研究系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我们精心策划了本期 Milvus 深度剖析系列博客，对 Milvus 架构和源代码进行深入解读。本系列博客涉及的主题包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架构概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">应用程序接口和 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">数据处理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">数据管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">实时查询</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">标量执行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">质量保证系统</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量执行引擎</a></li>
</ul>
