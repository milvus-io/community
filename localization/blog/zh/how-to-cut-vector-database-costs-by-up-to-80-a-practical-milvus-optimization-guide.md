---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: 如何削减高达 80% 的向量数据库成本：Milvus 实用优化指南
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: Milvus 是免费的，但基础架构并非如此。了解如何利用更好的索引、MMap 和分层存储将向量数据库内存成本降低 60-80%。
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>您的 RAG 原型运行良好。然后它投入生产，流量增长，现在你的向量数据库账单从每月 500 美元涨到了 5000 美元。听起来很熟悉吧？</p>
<p>这是目前人工智能应用中最常见的扩展问题之一。你构建的东西创造了真正的价值，但基础设施成本的增长速度却超过了用户群的增长速度。而当你查看账单时，向量数据库往往是最大的惊喜--在我们所见过的部署中，它可以占到应用程序总成本的大约 40-50%，仅次于 LLM API 调用。</p>
<p>在本指南中，我将介绍这些费用的实际去向，以及可以降低这些费用的具体做法--在许多情况下可以降低 60-80%。我将以最流行的开源向量数据库<a href="https://milvus.io/">Milvus</a> 为主要例子，因为这是我最熟悉的数据库，但这些原则适用于大多数向量数据库。</p>
<p><em>需要说明的是：</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>本身是免费开源的，你无需为软件付费。成本完全来自于运行它的基础设施：云实例、内存、存储和网络。好消息是，大部分基础设施成本是可以降低的。</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">使用 VectorDB 时，钱到底花到哪里去了？<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们从一个具体的例子开始。假设你有 1 亿个向量，768 个维度，以 float32 格式存储--这是一个非常典型的 RAG 设置。下面是在 AWS 上每月的大致费用：</p>
<table>
<thead>
<tr><th><strong>成本构成</strong></th><th><strong>份额</strong></th><th><strong>~每月成本</strong></th><th><strong>备注</strong></th></tr>
</thead>
<tbody>
<tr><td>计算（CPU + 内存）</td><td>85-90%</td><td>$2,800</td><td>主要由内存驱动</td></tr>
<tr><td>网络</td><td>5-10%</td><td>$250</td><td>跨 AZ 流量、大型结果有效载荷</td></tr>
<tr><td>存储</td><td>2-5%</td><td>$100</td><td>便宜 - 对象存储（S3/MinIO）约为 0.03 美元/GB</td></tr>
</tbody>
</table>
<p>结论很简单：内存是 85-90% 的资金去向。网络和存储在边际上很重要，但如果你想有意义地削减成本，内存就是杠杆。本指南的所有内容都将围绕这一点展开。</p>
<p><strong>关于网络和存储的快速说明：</strong>只返回需要的字段（ID、分数、关键元数据），避免跨区域查询，可以降低网络成本。在存储方面，Milvus 已经将存储与计算分离开来--你的向量放在像 S3 这样的廉价对象存储中，因此即使是 100M 的向量，存储费用通常也低于 50 美元/月。这两项都不会像内存优化那样起到推动作用。</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">为什么向量搜索的内存如此昂贵？<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>如果你来自传统数据库，向量搜索对内存的要求可能会令人吃惊。关系数据库可以利用基于磁盘的 B 树索引和操作系统页面缓存。向量搜索则不同，它涉及大量浮点运算，HNSW 或 IVF 等索引需要在内存中保持加载状态，以提供毫秒级的延迟。</p>
<p>下面是一个估算内存需求的快速公式：</p>
<p><strong>所需内存 = （向量 × 维度 × 4 字节） × 索引乘数</strong></p>
<p>对于我们使用 HNSW 的 100M × 768 × float32 示例（乘数 ~1.8x）：</p>
<ul>
<li>原始数据：1 亿 × 768 × 4 字节 ≈ 307 GB</li>
<li>使用 HNSW 索引：307 GB × 1.8 ≈ 553 GB</li>
<li>加上操作系统开销、缓存和净空：总计 ~768 GB</li>
<li>在 AWS 上：3× r6i.8xlarge（每个 256 GB）≈ 2,800 美元/月</li>
</ul>
<p><strong>这就是基线。现在让我们来看看如何降低成本。</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1.选择正确的索引，减少 4 倍内存使用量<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>这是影响最大的一项改变。对于同样的 1 亿向量数据集，内存使用量可能会有 4-6 倍的变化，这取决于你对索引的选择。</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>：几乎不压缩，因此内存使用量接近原始数据大小，约为<strong>300 GB</strong></li>
<li><strong>HNSW</strong>：存储额外的图形结构，因此内存使用量通常是原始数据大小的<strong>1.5 至 2.0 倍</strong>，或约<strong>450 至 600 GB</strong></li>
<li><strong>IVF_SQ8</strong>：将 float32 值压缩为 uint8，<strong>压缩率</strong>约为<strong>4 倍</strong>，因此内存使用量可降至约<strong>75 至 100 GB</strong></li>
<li><strong>IVF_PQ / DiskANN</strong>：使用更强的压缩或基于磁盘的索引，因此内存可进一步降至约<strong>30 至 60 GB</strong></li>
</ul>
<p>许多团队一开始使用 HNSW，因为它的查询速度最快，但最终却要多支付 3-5 倍的费用。</p>
<p>以下是主要索引类型的比较：</p>
<table>
<thead>
<tr><th><strong>索引</strong></th><th><strong>内存倍增器</strong></th><th><strong>查询速度</strong></th><th><strong>召回率</strong></th><th><strong>最适合</strong></th></tr>
</thead>
<tbody>
<tr><td>扁平</td><td>~1.0x</td><td>慢</td><td>100%</td><td>小数据集（&lt;1M），测试</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>中</td><td>95-99%</td><td>一般使用</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>中型</td><td>93-97%</td><td>成本敏感型生产（推荐）</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>快速</td><td>70-80%</td><td>超大数据集，粗检索</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>非常快</td><td>98-99%</td><td>仅当延迟比成本更重要时</td></tr>
<tr><td>磁盘ANN</td><td>~0.08x</td><td>中速</td><td>95-98%</td><td>使用 NVMe SSD 进行超大规模运行</td></tr>
</tbody>
</table>
<p><strong>底线</strong>从 HNSW 或 IVF_FLAT 切换到 IVF_SQ8，召回率通常只下降 2-3%（例如，从 97% 降至 94-95%），而内存成本却降低了约 70%。对于大多数 RAG 工作负载来说，这种折衷是绝对值得的。如果您正在进行粗略检索，或者您的准确率标准较低，IVF_PQ 或 IVF_RABITQ 可以进一步节省成本。</p>
<p><strong>我的建议</strong>如果要在生产中运行 HNSW，而且成本是个问题，请先在测试 Collections 上试用 IVF_SQ8。测量实际查询的召回率。大多数团队都会惊讶于准确率的下降幅度如此之小。</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2.停止将所有内容载入内存，降低 60%-80% 的成本<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>即使选择了更高效的索引，内存中的数据仍可能多于需要。Milvus 提供了两种方法来解决这个问题：<strong>MMap（自 2.3 版起可用）和分层存储（自 2.6 版起可用）。这两种方法都能减少 60-80% 的内存使用量。</strong></p>
<p>这两种方法的核心理念是一样的：并非所有数据都需要始终保存在内存中。两者的区别在于如何处理不在内存中的数据。</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap（内存映射文件）</h3><p>MMap 将数据文件从本地磁盘映射到进程地址空间。完整的数据集仍保留在节点的本地磁盘上，操作系统只在需要访问时才将页面加载到内存中。在使用 MMap 之前，所有数据都会从对象存储（S3/MinIO）下载到查询节点的本地磁盘。</p>
<ul>
<li>内存使用率降至满载模式的约 10-30</li>
<li>延迟保持稳定且可预测（数据在本地磁盘上，无需网络获取）</li>
<li>权衡：本地磁盘必须足够大，以容纳整个数据集</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">分层存储</h3><p>分层存储更进一步。它不是将所有数据下载到本地磁盘，而是将本地磁盘用作热门数据的缓存，并将对象存储作为主层。只有在需要时，才会从对象存储中获取数据。</p>
<ul>
<li>内存使用率降至满载模式的 10% 以下</li>
<li>本地磁盘使用率也会下降--只缓存热数据（通常占总数的 10-30）</li>
<li>权衡：缓存丢失会增加 50-200 毫秒的延迟（从对象存储中获取数据）</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">数据流和资源使用</h3><table>
<thead>
<tr><th><strong>模式</strong></th><th><strong>数据流</strong></th><th><strong>内存使用量</strong></th><th><strong>本地磁盘使用</strong></th><th><strong>延迟</strong></th></tr>
</thead>
<tbody>
<tr><td>传统满负荷</td><td>对象存储 → 内存 (100%)</td><td>非常高（100）</td><td>低（仅临时）</td><td>非常低且稳定</td></tr>
<tr><td>MMap</td><td>对象存储 → 本地磁盘（100%） → 内存（按需）</td><td>低 (10-30%)</td><td>高（100）</td><td>低且稳定</td></tr>
<tr><td>分层存储</td><td>对象存储 ↔ 本地缓存（热数据） → 内存（按需）</td><td>非常低（&lt;10）</td><td>低（仅热数据）</td><td>高速缓存命中率低，高速缓存未命中率高</td></tr>
</tbody>
</table>
<p><strong>硬件建议：</strong>这两种方法都严重依赖本地磁盘 I/O，因此强烈建议使用<strong>NVMe SSD</strong>，<strong>IOPS</strong> 最好在<strong>10,000 以上</strong>。</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap 与分层存储：您应该使用哪一种？</h3><table>
<thead>
<tr><th><strong>您的情况</strong></th><th><strong>使用此方法</strong></th><th><strong>为什么</strong></th></tr>
</thead>
<tbody>
<tr><td>对延迟敏感（P99 &lt; 20ms）</td><td>MMap</td><td>数据已在本地磁盘上 - 无需网络获取，延迟稳定</td></tr>
<tr><td>统一访问（无明显的冷热分区）</td><td>MMap</td><td>分层存储需要冷热倾斜才能有效；没有冷热倾斜，缓存命中率就会很低</td></tr>
<tr><td>成本优先（偶尔出现延迟峰值也没关系）</td><td>分层存储</td><td>节省内存和本地磁盘（减少 70-90% 的磁盘空间）</td></tr>
<tr><td>明确冷热模式（80/20 规则）</td><td>分层存储</td><td>热数据保持缓存，冷数据在对象存储中保持廉价</td></tr>
<tr><td>超大规模（&gt;500M 向量）</td><td>分层存储</td><td>在这种规模下，一个节点的本地磁盘往往无法容纳整个数据集</td></tr>
</tbody>
</table>
<p><strong>注：</strong>MMap 需要 Milvus 2.3 以上版本。分层存储要求 Milvus 2.6 以上。两者都需要使用 NVMe SSD（建议使用 10,000+ IOPS）。</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">如何配置 MMap</h3><p><strong>选项 1：YAML 配置（建议用于新部署）</strong></p>
<p>编辑 Milvus 配置文件 milvus.yaml，在 queryNode 部分添加以下设置：</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>选项 2：Python SDK 配置（适用于现有收集）</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">如何配置分层存储（Milvus 2.6+)</h3><p>编辑 Milvus 配置文件 milvus.yaml，在 queryNode 部分添加以下设置：</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">使用低维 Embeddings<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>这一点很容易被忽视，但维度直接影响成本。内存、存储和计算量都会随着维数的增加而线性增长。对于相同数据，1536 维模型的基础设施成本大约是 384 维模型的 4 倍。</p>
<p>查询成本也是如此--余弦相似度为 O(D)，因此 768 维向量每次查询所需的计算量大约是 384 维向量的两倍。在高 QPS 工作负载中，这一差异直接转化为所需节点的减少。</p>
<p>以下是常见嵌入模型的比较（以 384 维作为 1.0x 基准）：</p>
<table>
<thead>
<tr><th><strong>模型</strong></th><th><strong>维数</strong></th><th><strong>相对成本</strong></th><th><strong>恢复</strong></th><th><strong>最佳</strong></th></tr>
</thead>
<tbody>
<tr><td>text-embedding-3-large</td><td>3072</td><td>8.0x</td><td>98%+</td><td>精度要求极高时（研究、医疗保健）</td></tr>
<tr><td>文本嵌入-3-小</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>一般 RAG 工作负载</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>良好的性价比平衡</td></tr>
<tr><td>all-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>成本敏感型工作负载</td></tr>
</tbody>
</table>
<p><strong>实用建议</strong>不要认为你需要最大的模型。在实际查询的代表性样本上进行测试（通常 100 万向量就足够了），然后找到符合准确性标准的最低维度模型。许多团队发现，768 维与 1536 维一样适合他们的使用情况。</p>
<p><strong>已经采用了高维模型？</strong>您可以在事后减少维度。PCA（主成分分析）可以去除冗余特征，而<a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">Matryoshka 嵌入</a>则可以让您截断到前 N 个维度，同时保留大部分质量。在重新嵌入整个数据集之前，这两种方法都值得一试。</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">利用压缩和 TTL 管理数据生命周期<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>这一点不那么重要，但仍然很重要，尤其是对于长期运行的生产系统。Milvus 使用只附加的存储模型：删除数据时，数据会被标记为已删除，但不会立即删除。随着时间的推移，这些死数据会不断累积，浪费存储空间，并导致查询扫描的行数超出需要。</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">压缩从删除数据中回收存储空间</h3><p>压缩是 Milvus 的后台清理流程。它能合并小片段，物理删除已删除数据，并重写压缩文件。如果出现以下情况，你会需要它</p>
<ul>
<li>频繁写入和删除（产品目录、内容更新、实时日志）</li>
<li>数据段数量不断增加（这会增加每次查询的开销）</li>
<li>存储使用量的增长速度远远超过实际有效数据的增长速度</li>
</ul>
<p><strong>注意：</strong>压缩是 I/O 密集型工作。将其安排在低流量时段（如每晚），或仔细调整触发器，以免与生产查询竞争。</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL（生存时间）：自动过期旧向量数据</h3><p>对于自然过期的数据，TTL 比手动删除更有效。为数据设置一个有效期，Milvus 就会在过期时自动将其标记为删除。压缩处理实际的清理工作。</p>
<p>这对以下方面很有用</p>
<ul>
<li>日志和会话数据--只保留最近 7 天或 30 天的数据</li>
<li>对时间敏感的 RAG--偏好最新知识，让旧文件过期</li>
<li>实时推荐--只检索最近的用户行为</li>
</ul>
<p>压缩和 TTL 可共同防止系统悄无声息地累积浪费。这并不是最大的成本杠杆，但它能防止存储缓慢增长，让团队措手不及。</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">多一个选择：Zilliz Cloud（全面托管 Milvus）<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>完全披露：<a href="https://zilliz.com/">Zilliz Cloud</a>是由 Milvus 背后的同一个团队打造的，因此请谨慎对待。</p>
<p>话虽如此，这里有一个与直觉相反的部分：尽管 Milvus 是免费开源的，但托管服务的成本实际上可能比自助托管更低。原因很简单--软件是免费的，但运行它的云基础设施却不是免费的，你需要工程师来操作和维护它。如果托管服务可以用更少的机器和更少的工程师工时完成同样的工作，那么即使支付了服务本身的费用，您的总费用也会下降。</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a>是建立在 Milvus 基础上的完全托管服务，并与 Milvus 的 API 兼容。与成本相关的有两点：</p>
<ul>
<li><strong>更好的单位节点性能。</strong>Zilliz Cloud 在 Cardinal（我们的优化搜索引擎）上运行。根据<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">VectorDBBench 的结果</a>，它的吞吐量比开源 Milvus 高 3-5 倍，速度快 10 倍。在实践中，这意味着同样的工作负载，您需要的计算节点数量大约是其三分之一到五分之一。</li>
<li><strong>内置优化。</strong>本指南中涉及的功能--MMap、分层存储和索引量化--均已内置并自动调整。自动缩放可根据实际负载调整容量，因此您无需为不需要的余量付费。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>由于 API 和数据格式兼容，因此<a href="https://zilliz.com/zilliz-migration-service">迁移</a>非常简单。Zilliz 还提供迁移工具来提供帮助。有关详细比较，请参阅<a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud 对比 Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">总结：削减向量数据库成本的分步计划<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>如果你只做一件事，那就是：检查你的索引类型。</strong></p>
<p>如果你正在对成本敏感的工作负载上运行 HNSW，请改用 IVF_SQ8。仅此一项，就能将内存成本降低约 70%，而召回损失却微乎其微。</p>
<p>如果你想更进一步，以下是优先顺序：</p>
<ul>
<li>对于大多数工作负载，<strong>切换索引</strong>- HNSW → IVF_SQ8。零架构变化带来最大收益。</li>
<li><strong>启用 MMap 或分层存储</strong>- 停止将所有内容保存在内存中。这是配置变更，而不是重新设计。</li>
<li><strong>评估嵌入尺寸</strong>- 测试更小的模型是否能满足你的精度需求。这需要重新 Embeddings，但可以节省更多成本。</li>
<li><strong>设置压缩和 TTL</strong>- 防止无声数据膨胀，尤其是在频繁写入/删除的情况下。</li>
</ul>
<p>这些策略结合起来，可以将向量数据库的费用降低 60-80%。并不是每个团队都需要所有这四种策略--从索引更改开始，衡量影响，然后逐级往下。</p>
<p>对于希望减少操作工作、提高成本效率的团队来说，<a href="https://zilliz.com/">Zilliz Cloud</a>（托管 Milvus Operator）是另一种选择。</p>
<p>如果您正在进行上述任何一项优化，并希望比较一下，<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus 社区 Slack</a>是一个很好的提问场所。您还可以加入<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>，与工程团队就您的具体设置进行快速交流。</p>
