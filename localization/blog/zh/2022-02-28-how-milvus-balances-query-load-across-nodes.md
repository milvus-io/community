---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Milvus 如何平衡各节点的查询负载？
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: Milvus 2.0 支持查询节点间的自动负载平衡。
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Binlog 封面图片</span> </span></p>
<p>作者：<a href="https://github.com/xige-16">Xi Ge</a></p>
<p>在之前的博客文章中，我们陆续介绍了 Milvus 2.0 中的 Deletion、Bitset 和 Compaction 功能。在本系列文章的最后，我们想和大家分享负载均衡（Load Balance）背后的设计，它是 Milvus 分布式集群的一个重要功能。</p>
<h2 id="Implementation" class="common-anchor-header">实现<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>查询节点中缓冲的片段数量和大小不同，各查询节点的搜索性能也可能不同。最糟糕的情况可能是，几个查询节点在搜索大量数据时已经筋疲力尽，而新创建的查询节点却因为没有分段而处于闲置状态，从而造成 CPU 资源的大量浪费和搜索性能的大幅下降。</p>
<p>为避免出现这种情况，查询协调器（query coordinator）被编程为根据节点的内存使用情况向每个查询节点平均分配数据段。因此，CPU 资源在各节点上的消耗是均等的，从而大大提高了搜索性能。</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">触发自动负载平衡</h3><p>根据配置<code translate="no">queryCoord.balanceIntervalSeconds</code> 的默认值，查询协调器每 60 秒检查一次所有查询节点的 RAM 使用情况（百分比）。如果满足以下任一条件，查询协调器就会开始平衡各查询节点的查询负载：</p>
<ol>
<li>群集中任何查询节点的内存使用率大于<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> （默认值：90）；</li>
<li>或任意两个查询节点的内存使用量差值的绝对值大于<code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> （默认值：30）。</li>
</ol>
<p>数据段从源查询节点传输到目标查询节点后，还应同时满足以下两个条件：</p>
<ol>
<li>目标查询节点的内存使用量不大于<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> （默认值：90）；</li>
<li>负载平衡后，源查询节点和目标查询节点的内存使用量差值的绝对值小于负载平衡前的差值。</li>
</ol>
<p>满足上述条件后，查询协调器将继续平衡各节点的查询负载。</p>
<h2 id="Load-balance" class="common-anchor-header">负载平衡<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>当负载平衡被触发时，查询协调器首先将目标数据段加载到目标查询节点。此时，两个查询节点都会根据任何搜索请求返回目标数据段的搜索结果，以保证结果的完整性。</p>
<p>目的地查询节点成功加载目标网段后，查询协调器会向查询频道发布<code translate="no">sealedSegmentChangeInfo</code> 。如下图所示，<code translate="no">onlineNodeID</code> 和<code translate="no">onlineSegmentIDs</code> 分别表示加载段的查询节点和加载的段，<code translate="no">offlineNodeID</code> 和<code translate="no">offlineSegmentIDs</code> 分别表示需要释放段的查询节点和要释放的段。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>密封的分段更改信息</span> </span></p>
<p>收到<code translate="no">sealedSegmentChangeInfo</code> 后，源查询节点将释放目标网段。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>负载平衡工作流程</span> </span></p>
<p>源查询节点释放目标网段后，整个流程就成功了。这样，各查询节点的查询负载就达到了平衡，即所有查询节点的 RAM 使用量都不大于<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> ，并且负载平衡后源查询节点和目标查询节点的 RAM 使用量差值的绝对值小于负载平衡前的差值。</p>
<h2 id="Whats-next" class="common-anchor-header">下一步是什么？<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>在 2.0 新功能系列博客中，我们将介绍新功能的设计。阅读本系列博客的更多内容！</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Milvus 如何删除分布式集群中的流数据</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Milvus 如何压缩数据？</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Milvus 如何平衡各节点的查询负载？</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bitset 如何实现向量相似性搜索的多功能性？</a></li>
</ul>
<p>这是 Milvus 2.0 新功能系列博客的压轴文章。继本系列之后，我们计划推出一个新的 Milvus<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">深度</a>系列，介绍 Milvus 2.0 的基本架构。敬请期待。</p>
