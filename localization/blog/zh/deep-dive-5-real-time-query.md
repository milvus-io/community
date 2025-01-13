---
id: deep-dive-5-real-time-query.md
title: 使用 Milvus 向量数据库进行实时查询
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: 了解 Milvus 实时查询的底层机制。
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/xige-16">Xi Ge</a>撰写，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> 译。</p>
</blockquote>
<p>在上一篇文章中，我们已经谈到了 Milvus 中的<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">数据插入和数据持久性</a>。在本文中，我们将继续讲解 Milvus 中的<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">其他组件</a>是如何交互完成实时数据查询的。</p>
<p><em>下面列出了开始之前的一些有用资源。我们建议首先阅读这些资源，以便更好地理解本篇文章的主题。</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">深入了解 Milvus 架构</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus 数据模型</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Milvus 各组件的角色和功能</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Milvus 中的数据处理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Milvus 中的数据插入和数据持久化</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">向查询节点加载数据<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>在执行查询之前，必须先将数据加载到查询节点。</p>
<p>加载到查询节点的数据有两类：来自<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">日志代理</a>的流数据和来自<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">对象存储</a>（下文也称为持久存储）的历史数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>流程图</span> </span></p>
<p>数据协调器负责处理不断插入 Milvus 的流数据。当 Milvus 用户调用<code translate="no">collection.load()</code> 加载一个 Collections 时，查询协调器将查询数据协调器，以了解哪些片段已被持久化存储及其对应的检查点。检查点是一个标记，表示检查点之前的持久化片段会被消耗，而检查点之后的片段不会被消耗。</p>
<p>然后，查询协调器根据数据协调器提供的信息输出分配策略：按段或按通道分配。段分配器负责将持久存储（批量数据）中的段分配给不同的查询节点。例如，在上图中，段分配器将段 1 和段 3（S1、S3）分配给查询节点 1，将段 2 和段 4（S2、S4）分配给查询节点 2。通道分配器为不同的查询节点分配日志代理中的多个数据操作<a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">通道</a>（DMChannels）。例如，在上图中，信道分配器将查询节点 1 分配给信道 1 (Ch1)，将查询节点 2 分配给信道 2 (Ch2)。</p>
<p>在这种分配策略下，每个查询节点都会加载段数据并相应地监视信道。在图像中的查询节点 1 中，历史数据（批量数据）通过分配的 S1 和 S3 从持久存储中加载。同时，查询节点 1 通过订阅日志代理中的通道 1 来加载增量数据（流数据）。</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">查询节点的数据管理<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>查询节点需要管理历史数据和增量数据。历史数据存储在<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">密封段</a>中，而增量数据存储在<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">增长段</a>中。</p>
<h3 id="Historical-data-management" class="common-anchor-header">历史数据管理</h3><p>历史数据管理主要有两个考虑因素：负载平衡和查询节点故障切换。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>负载平衡</span> </span></p>
<p>例如，如图所示，查询节点 4 比其他查询节点分配了更多的密封分段。这很可能使查询节点 4 成为瓶颈，拖慢整个查询过程。为了解决这个问题，系统需要将查询节点 4 中的几个网段分配给其他查询节点。这就是所谓的负载平衡。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>查询节点故障转移</span> </span></p>
<p>另一种可能的情况如上图所示。其中一个节点（查询节点 4）突然宕机。在这种情况下，需要将负载（分配给查询节点 4 的数据段）转移到其他工作的查询节点，以确保查询结果的准确性。</p>
<h3 id="Incremental-data-management" class="common-anchor-header">增量数据管理</h3><p>查询节点监视 DMChannels 以接收增量数据。在此过程中引入了流程图。它首先过滤所有数据插入信息。这是为了确保只加载指定分区中的数据。Milvus 中的每个 Collections 都有一个相应的通道，该通道由该 Collections 中的所有分区共享。因此，如果 Milvus 用户只需要加载某个分区中的数据，就需要使用流程图来过滤插入的数据。否则，Collection 中所有分区的数据都将加载到查询节点。</p>
<p>经过过滤后，增量数据被插入到不断增长的分段中，并进一步传递到服务器时间节点。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>流程图</span> </span></p>
<p>在数据插入过程中，每个插入信息都会分配一个时间戳。在上图所示的 DMChannel 中，数据按从左到右的顺序插入。第一条插入信息的时间戳是 1，第二条是 2，第三条是 6。 第四条红色标记的信息不是插入信息，而是时间戳信息。这表示时间戳小于该时间戳的插入数据已经在日志代理中。换句话说，在该时间戳信息之后插入的数据，其时间戳值都应大于该时间戳。例如，在上图中，当查询节点感知到当前时间刻度为 5 时，这意味着所有时间戳值小于 5 的插入信息都被加载到了查询节点。</p>
<p>服务器时间节点每次从插入节点接收到一个时间戳后，都会提供一个更新的<code translate="no">tsafe</code> 值。<code translate="no">tsafe</code> 表示安全时间，在这个时间点之前插入的所有数据都可以被查询。举例来说，如果<code translate="no">tsafe</code> = 9，那么时间戳小于 9 的插入数据都可以被查询。</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Milvus 中的实时查询<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 中的实时查询是通过查询信息实现的。查询信息通过代理插入日志代理。然后，查询节点通过查看日志代理中的查询通道获取查询信息。</p>
<h3 id="Query-message" class="common-anchor-header">查询信息</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>查询信息</span> </span></p>
<p>查询信息包括以下有关查询的关键信息：</p>
<ul>
<li><code translate="no">msgID</code>:消息 ID，系统分配的查询消息 ID。</li>
<li><code translate="no">collectionID</code>:要查询的 Collections ID（如果用户指定）。</li>
<li><code translate="no">execPlan</code>:执行计划主要用于查询中的属性过滤。</li>
<li><code translate="no">service_ts</code>:服务时间戳将与上述<code translate="no">tsafe</code> 一起更新。服务时间戳表示服务的时间点。在<code translate="no">service_ts</code> 之前插入的所有数据都可供查询。</li>
<li><code translate="no">travel_ts</code>:旅行时间戳指定过去的时间范围。查询将在<code translate="no">travel_ts</code> 指定的时间段内进行。</li>
<li><code translate="no">guarantee_ts</code>:保证时间戳指定查询需要在其后进行的时间段。只有当<code translate="no">service_ts</code> &gt;<code translate="no">guarantee_ts</code> 时，才会进行查询。</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">实时查询</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>查询过程</span> </span></p>
<p>收到查询信息后，Milvus 首先判断当前服务时间<code translate="no">service_ts</code> 是否大于查询信息中的保证时间戳<code translate="no">guarantee_ts</code> 。如果是，则执行查询。查询将在历史数据和增量数据上并行执行。由于流数据和批处理数据之间可能会有数据重叠，因此需要执行一个名为 "局部缩减 "的操作来过滤掉多余的查询结果。</p>
<p>但是，如果当前服务时间小于新插入查询信息的保证时间戳，查询信息将成为未解决信息，等待处理，直到服务时间大于保证时间戳。</p>
<p>查询结果最终会推送到结果通道。代理从该通道获取查询结果。同样，代理也会进行 "全局还原"，因为它从多个查询节点接收结果，而且查询结果可能是重复的。</p>
<p>为确保代理在向 SDK 返回所有查询结果之前已收到所有查询结果，结果信息还将保留一份信息记录，包括已搜索的密封段、已搜索的 DMChannels 和全局密封段（所有查询节点上的所有段）。只有同时满足以下两个条件，系统才能断定代理已收到所有查询结果：</p>
<ul>
<li>所有结果信息中记录的所有搜索密封段的总和大于全局密封段、</li>
<li>Collections 中的所有 DMChannels 都被查询。</li>
</ul>
<p>最终，代理将 "全局还原 "后的最终结果返回给 Milvus SDK。</p>
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
