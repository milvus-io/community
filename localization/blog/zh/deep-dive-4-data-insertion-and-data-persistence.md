---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: 向量数据库中的数据插入和数据持久性
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: 了解 Milvus 向量数据库中数据插入和数据持久化背后的机制。
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/sunby">孙冰怡</a>撰写，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>翻译。</p>
</blockquote>
<p>在 "深度挖掘 "系列的上一篇文章中，我们已经介绍了全球最先进的向量数据库<a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Milvus 是如何处理数据的</a>。在本文中，我们将继续研究数据插入所涉及的组件，详细说明数据模型，并解释 Milvus 中如何实现数据持久性。</p>
<p>跳转到</p>
<ul>
<li><a href="#Milvus-architecture-recap">Milvus 架构回顾</a></li>
<li><a href="#The-portal-of-data-insertion-requests">数据插入请求的入口</a></li>
<li><a href="#Data-coord-and-data-node">数据坐标和数据节点</a></li>
<li><a href="#Root-coord-and-Time-Tick">根坐标和时间刻度</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">数据组织：Collection、分区、分片（通道）、分段</a></li>
<li><a href="#Data-allocation-when-and-how">数据分配：何时分配、如何分配</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Binlog 文件结构和数据持久性</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Milvus 架构回顾<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Milvus 架构。</span> </span></p>
<p>SDK 通过负载平衡器将数据请求发送给代理，即门户。然后，代理与协调器服务交互，将 DDL（数据定义语言）和 DML（数据操作语言）请求写入消息存储。</p>
<p>包括查询节点、数据节点和索引节点在内的工作节点从消息存储中消费请求。具体来说，查询节点负责数据查询；数据节点负责数据插入和数据持久化；索引节点主要处理索引构建和查询加速。</p>
<p>底层是对象存储，主要利用 MinIO、S3 和 AzureBlob 来存储日志、delta binlog 和索引文件。</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">数据插入请求的入口<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus 中的代理。</span> </span></p>
<p>代理是数据插入请求的入口。</p>
<ol>
<li>最初，代理接受来自 SDK 的数据插入请求，并使用哈希算法将这些请求分配到多个桶中。</li>
<li>然后，代理请求数据协调器分配段（Milvus 数据存储的最小单位）。</li>
<li>然后，代理将请求分段的信息插入信息存储区，以确保这些信息不会丢失。</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">数据协调器和数据节点<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>数据协调器的主要功能是管理信道和段的分配，而数据节点的主要功能是消耗和持久化插入的数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus 中的数据协调器和数据节点。</span> </span></p>
<h3 id="Function" class="common-anchor-header">功能</h3><p>数据协调器在以下方面发挥作用：</p>
<ul>
<li><p><strong>分配网段空间</strong>数据协调器向代理分配不断增长的网段空间，以便代理使用网段中的空闲空间插入数据。</p></li>
<li><p><strong>记录段分配和段中已分配空间的到期时间</strong>数据协调器分配的每个段中的空间都不是永久性的，因此数据协调器还需要记录每个段分配的到期时间。</p></li>
<li><p><strong>自动刷新分段数据</strong>如果分段已满，数据协调器会自动触发数据刷新。</p></li>
<li><p><strong>为数据节点分配通道</strong>一个 Collections 可以有多个<a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">vchannels</a>。数据协调器决定哪些数据节点使用哪些 v 通道。</p></li>
</ul>
<p>数据节点在以下方面提供服务：</p>
<ul>
<li><p><strong>消耗数据</strong>数据节点从数据协调器分配的通道中消耗数据，并为数据创建序列。</p></li>
<li><p><strong>数据持久</strong>化 在内存中缓存插入的数据，并在数据量达到一定阈值时自动将插入的数据刷新到磁盘。</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">工作流程</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>一个 v 通道只能分配给一个数据节点</span>。 </span></p>
<p>如上图所示，Collection 有四个 v 通道（V1、V2、V3 和 V4），两个数据节点。数据协调器很有可能分配一个数据节点消耗来自 V1 和 V2 的数据，另一个数据节点消耗来自 V3 和 V4 的数据。单个 v 通道不能分配给多个数据节点，这是为了防止重复消耗数据，否则会导致同一批数据重复插入同一数据段。</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">根节点和时间标记<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>根节点管理 TSO（时间戳 Oracle），并在全球范围内发布时间刻度信息。每个数据插入请求都有一个由根协调器分配的时间戳。时间刻度是 Milvus 的基石，它就像 Milvus 中的时钟，表示 Milvus 系统处于哪个时间点。</p>
<p>在 Milvus 中写入数据时，每个数据插入请求都带有一个时间戳。在数据消耗过程中，每个时间数据节点消耗时间戳在一定范围内的数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>基于时间戳的数据插入和数据消耗示例</span>。 </span></p>
<p>上图是数据插入的过程。时间戳的值用数字 1、2、6、5、7、8 表示。数据通过两个代理写入系统：P1 和 P2。在数据消耗过程中，如果时间戳的当前时间为 5，数据节点只能读取数据 1 和 2。然后在第二次读取时，如果当前的时间刻度变为 9，数据节点就可以读取数据 6、7、8。</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">数据组织：Collection、分区、碎片（通道）、段<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus 中的数据组织。</span> </span></p>
<p>请先阅读<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">本文</a>，了解 Milvus 中的数据模型以及 Collections、shard、partition 和 segment 的概念。</p>
<p>总之，Milvus 中最大的数据单元是 Collections，它可以比作关系数据库中的表。一个 Collections 可以有多个分区（每个分区对应一个通道），每个分区内可以有多个分区。如上图所示，通道（分块）是垂直条形图，而分区是水平条形图。每个交叉点都有段的概念，即数据分配的最小单位。在 Milvus 中，索引建立在段上。在查询过程中，Milvus 系统还会平衡不同查询节点中的查询负载，而这一过程就是以分段为单位进行的。分段包含多个<a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlog</a>，当分段数据耗尽时，将生成一个 binlog 文件。</p>
<h3 id="Segment" class="common-anchor-header">分段</h3><p>在 Milvus 中，有三种状态不同的分段：生长分段、密封分段和冲洗分段。</p>
<h4 id="Growing-segment" class="common-anchor-header">成长段</h4><p>成长段是一个新创建的段，可分配给代理用于插入数据。段的内部空间可以使用、分配或释放。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>成长段的三种状态</span> </span></p>
<ul>
<li>已使用：增长段的这部分空间已被数据节点消耗。</li>
<li>已分配：增长区段的这部分空间已由代理申请并由数据协调员分配。分配的空间将在一段时间后过期。</li>
<li>空闲：增长区段的这部分空间未被使用。可用空间的值等于段的总空间减去已用空间和已分配空间的值。因此，段的可用空间会随着分配空间的到期而增加。</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">密封分段</h4><p>密封网段是一个封闭的网段，不能再分配给代理插入数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中的密封网段</span> </span></p>
<p>在以下情况下，增长中的数据段会被密封：</p>
<ul>
<li>如果增长段中已用空间达到总空间的 75%，该段将被封存。</li>
<li>Milvus 用户手动调用 Flush() 以持久化 Collections 中的所有数据。</li>
<li>由于过多的增长段会导致数据节点过度占用内存，因此长时间未封存的增长段将被封存。</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">刷新段</h4><p>已刷新段是指已写入磁盘的段。刷新是指为了数据持久性而将段数据存储到对象存储中。只有当密封段中分配的空间到期时，才能刷新段。刷新时，密封段会变成已刷新段。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中被刷新的</span> </span>数据<span class="img-wrapper"> <span>段</span> </span></p>
<h3 id="Channel" class="common-anchor-header">通道</h3><p>一个通道被分配给 ：</p>
<ul>
<li>数据节点启动或关闭时；或</li>
<li>代理请求分配段空间时。</li>
</ul>
<p>通道分配有几种策略。Milvus 支持其中两种策略：</p>
<ol>
<li>一致性散列</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中的一致性哈希算法</span> </span></p>
<p>Milvus 的默认策略。该策略利用散列技术为每个通道分配一个环上的位置，然后沿时钟方向搜索离通道最近的数据节点。因此，在上图中，通道 1 被分配给数据节点 2，而通道 2 被分配给数据节点 3。</p>
<p>然而，这种策略的一个问题是，数据节点数量的增减（如新数据节点启动或数据节点突然关闭）会影响信道分配过程。为了解决这个问题，数据协调器通过 etcd 监控数据节点的状态，以便在数据节点状态发生变化时立即通知数据协调器。然后，数据协调器会进一步确定向哪个数据节点正确分配通道。</p>
<ol start="2">
<li>负载平衡</li>
</ol>
<p>第二种策略是将相同 Collections 的通道分配给不同的数据节点，确保通道的平均分配。这种策略的目的是实现负载平衡。</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">数据分配：何时以及如何分配<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 的数据分配过程</span> </span></p>
<p>数据分配过程从客户端开始。它首先向代理发送带有时间戳<code translate="no">t1</code> 的数据插入请求。然后，代理向数据协调员发送段分配请求。</p>
<p>收到分段分配请求后，数据协调器会检查分段状态并分配分段。如果已创建分段的当前空间足以容纳新插入的数据行，数据协调器就会分配这些已创建的分段。但是，如果当前分段的可用空间不足，数据协调器将分配一个新的分段。每次请求时，数据协调器都会返回一个或多个数据段。与此同时，数据协调器还会将分配的数据段保存在元服务器中，以便数据持久化。</p>
<p>随后，数据协调器将已分配数据段的信息（包括数据段 ID、行数、过期时间<code translate="no">t2</code> 等）返回给代理。代理会将已分配区段的这些信息发送到消息存储区，以便正确记录这些信息。请注意，<code translate="no">t1</code> 的值必须小于<code translate="no">t2</code> 的值。<code translate="no">t2</code> 的默认值为 2,000 毫秒，可通过<code translate="no">data_coord.yaml</code> 文件中的参数<code translate="no">segment.assignmentExpiration</code> 进行更改。</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Binlog 文件结构和数据持久性<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>数据节点刷新</span> </span></p>
<p>数据节点订阅消息存储，因为数据插入请求保存在消息存储中，因此数据节点可以消费插入消息。数据节点首先将插入请求放入插入缓冲区，随着请求的累积，在达到阈值后会被刷新到对象存储区。</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Binlog 文件结构</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Binlog 文件结构</span>。 </span></p>
<p>Milvus 中的 binlog 文件结构与 MySQL 中的 binlog 文件结构类似。binlog 有两个功能：数据恢复和索引构建。</p>
<p>一个 binlog 包含许多<a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">事件</a>。每个事件都有一个事件头和事件数据。</p>
<p>包括 binlog 创建时间、写节点 ID、事件长度和 NextPosition（下一个事件的偏移量）等元数据都写在事件头中。</p>
<p>事件数据可分为两部分：固定数据和可变数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>插入事件的文件结构</span>。 </span></p>
<p><code translate="no">INSERT_EVENT</code> 的事件数据中的固定部分包含<code translate="no">StartTimestamp</code> 、<code translate="no">EndTimestamp</code> 和<code translate="no">reserved</code> 。</p>
<p>可变部分实际上存储的是插入数据。插入数据以 parquet 格式排序并存储在该文件中。</p>
<h3 id="Data-persistence" class="common-anchor-header">数据持久性</h3><p>如果 Schema 中有多个列，Milvus 将在列中存储 Binlog。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>Binlog 数据持久性</span>。 </span></p>
<p>如上图所示，第一列是主键 binlog。第二列是时间戳列。其余为 Schema 中定义的列。上图还显示了 MinIO 中 binlog 的文件路径。</p>
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
    </button></h2><p>随着 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我们精心策划了这个 Milvus 深度剖析系列博客，对 Milvus 架构和源代码进行深入解读。本系列博客涉及的主题包括</p>
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
