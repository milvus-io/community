---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: Milvus 2.6 简介：十亿规模的经济型向量搜索
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: 我们非常高兴地宣布 Milvus 2.6 正式发布。该版本引入了数十项功能，直接解决了当今向量搜索领域最紧迫的挑战--在有效扩展的同时控制成本。
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>随着人工智能驱动的搜索从实验项目发展成为关键任务基础设施，对<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量数据库</a>的要求也随之提高。企业需要处理数十亿个向量，同时管理基础设施成本，支持实时数据摄取，并提供超越基本<a href="https://zilliz.com/learn/vector-similarity-search">相似性搜索</a>的复杂检索。为了应对这些不断变化的挑战，我们一直在努力开发和完善 Milvus。社区的反响令人鼓舞，宝贵的反馈意见帮助我们确定了发展方向。</p>
<p>经过几个月的紧张开发，我们很高兴地宣布<strong>Milvus 2.6 正式</strong>发布。该版本直接解决了当今向量搜索领域最紧迫的挑战：<strong><em>在有效扩展的同时控制成本。</em></strong></p>
<p>Milvus 2.6 在三个关键领域实现了突破性创新：<strong>降低成本、先进的搜索功能和面向大规模的架构改进</strong>。结果不言自明：</p>
<ul>
<li><p>采用 RaBitQ 1 位量化技术，<strong>内存减少 72%</strong>，同时查询速度提高 4 倍</p></li>
<li><p>通过智能分层存储<strong>节省 50% 的成本</strong></p></li>
<li><p>通过我们增强的 BM25 实现，<strong>全文搜索速度</strong>比 Elasticsearch<strong>快 4 倍</strong></p></li>
<li><p>通过新引入的路径索引，JSON 过滤<strong>速度提高 100 倍</strong></p></li>
<li><p>通过新的零磁盘架构<strong>，经济地实现了搜索的新鲜度</strong></p></li>
<li><p>通过全新的 "数据输入和数据输出 "体验<strong>简化嵌入工作流程</strong></p></li>
<li><p><strong>单个集群中最多可容纳 100K Collections</strong>，实现面向未来的多租户功能</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">降低成本的创新：让向量搜索变得经济实惠<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>将向量搜索扩展到数十亿条记录时，内存消耗是最大的挑战之一。Milvus 2.6 引入了几项关键优化，在提高性能的同时显著降低了基础架构成本。</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">RaBitQ 1 位量化：内存减少 72%，性能提高 4 倍</h3><p>传统的量化方法迫使您以牺牲搜索质量为代价来节省内存。Milvus 2.6 通过<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1 位量化</a>与智能细化机制相结合，改变了这一状况。</p>
<p>新的 IVF_RABITQ 索引通过 1 位量化将主索引压缩到原来的 1/32。当与可选的 SQ8 精炼机制一起使用时，这种方法只占用了原始内存的 1/4，就能保持较高的搜索质量（95% 的召回率）。</p>
<p>我们的初步基准测试结果很有希望：</p>
<table>
<thead>
<tr><th><strong>性能指标</strong></th><th><strong>传统 IVF_FLAT</strong></th><th><strong>仅 RaBitQ（1 位</strong></th><th><strong>RaBitQ (1 位) + SQ8 精炼</strong></th></tr>
</thead>
<tbody>
<tr><td>内存占用</td><td>100%（基线）</td><td>3%（减少 97）</td><td>28%（减少 72）</td></tr>
<tr><td>调用</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>搜索吞吐量（QPS）</td><td>236</td><td>648 （快 2.7 倍）</td><td>946（快 4 倍）</td></tr>
</tbody>
</table>
<p><em>表：VectorDBBench 评估，使用 768 维的 1M 向量，在 AWS m6id.2xlarge 上测试</em></p>
<p>这里真正的突破不仅仅是内存减少了 72%，而是在实现内存减少的同时，吞吐量提高了 4 倍。这意味着您可以减少 75% 的服务器来处理相同的工作负载，或者在现有基础架构上处理多 4 倍的流量，而无需牺牲内存。</p>
<p>对于利用<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> 上完全托管的 Milvus 的企业用户，我们正在开发一种自动策略，可根据您的特定工作负载特征和精度要求动态调整 RaBitQ 参数。您只需在所有 Zilliz Cloud CU 类型中享受更高的成本效益。</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">冷热分层存储：通过智能数据放置降低 50% 的成本</h3><p>现实世界中的向量搜索工作负载包含访问模式大不相同的数据。频繁访问的数据需要即时可用性，而归档数据可以容忍稍高的延迟，以换取显著降低的存储成本。</p>
<p>Milvus 2.6 引入了分层存储架构，可根据访问模式自动对数据进行分类，并将其放置在适当的存储层中：</p>
<ul>
<li><p><strong>智能数据分类</strong>：Milvus 可根据访问模式自动识别热数据段（频繁访问）和冷数据段（很少访问）。</p></li>
<li><p><strong>优化存储放置</strong>：热数据保留在高性能内存/SSD 中，冷数据转移到更经济的对象存储中</p></li>
<li><p><strong>动态数据移动</strong>：随着使用模式的变化，数据自动在层级之间迁移</p></li>
<li><p><strong>透明检索</strong>：当查询触及冷数据时，冷数据会按需自动加载</p></li>
</ul>
<p>在保持活动数据查询性能的同时，存储成本最多可降低 50%。</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">其他成本优化</h3><p>Milvus 2.6 还引入了对 HNSW 索引的 Int8 向量支持、可降低 IOPS 和内存需求的优化结构 Storage v2 格式，以及更简便的直接通过 APT/YUM 包管理器进行安装。</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">高级搜索功能：超越基本向量相似性<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>对于现代人工智能应用来说，仅靠向量搜索是不够的。用户需要传统信息检索的精确性与向量嵌入的语义理解相结合。Milvus 2.6 引入了一套高级搜索功能，弥补了这一差距。</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">涡轮增压 BM25：全文搜索比 Elasticsearch 快 400</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">全文搜索</a>已成为在向量数据库中构建混合检索系统的关键。在 Milvus 2.6 中，以 2.5 版以来推出的 BM25 实现为基础，对全文搜索进行了显著的性能改进。例如，该版本引入了<code translate="no">drop_ratio_search</code> 和<code translate="no">dim_max_score_ratio</code> 等新参数，提高了搜索精度和速度，并提供了更精细的搜索控制。</p>
<p>我们针对行业标准 BEIR 数据集进行的基准测试表明，Milvus 2.6 的吞吐量比 Elasticsearch 高出 3-4倍，召回率相当。对于特定的工作负载，其 QPS 提高了 7 倍。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">JSON 路径索引：过滤速度提高 100 倍</h3><p>Milvus 很早就支持 JSON 数据类型，但由于缺乏索引支持，对 JSON 字段的过滤速度很慢。Milvus 2.6 增加了对 JSON 路径索引的支持，大大提高了性能。</p>
<p>考虑一个用户配置文件数据库，其中每条记录都包含嵌套元数据，如</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>对于 "对人工智能感兴趣的用户 "这一语义搜索，Milvus 曾经要解析和评估每条记录的整个 JSON 对象，查询成本很高，速度也很慢。</p>
<p>现在，Milvus 允许您在 JSON 字段内的特定路径上创建索引，以加快搜索速度：</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>在我们对 1 亿多条记录进行的性能测试中，JSON 路径索引将过滤延迟从<strong>140 毫秒</strong>（P99：480 毫秒）减少到仅<strong>1.5</strong>毫秒（P99：10 毫秒）--延迟减少了 99%，使此类搜索在生产中变得实用。</p>
<p>这一功能对于以下方面尤为重要</p>
<ul>
<li><p>具有复杂用户属性过滤功能的推荐系统</p></li>
<li><p>通过元数据过滤文档的 RAG 应用程序</p></li>
<li><p>数据分割至关重要的多租户系统</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">增强型文本处理和时间感知搜索</h3><p>Milvus 2.6 引入了经过全面改造的文本分析管道，具有复杂的语言处理功能，包括日语和韩语的 Lindera 标记符号化器、全面支持多语言的 ICU 标记符号化器，以及集成自定义词典的增强型 Jieba。</p>
<p><strong>词组匹配智能</strong>捕捉词序中的语义细微差别，区分 &quot;机器学习技术 &quot;和 &quot;学习机技术&quot;：</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>时间感知衰减函数（Time-Aware Decay Functions</strong>）可配置衰减率和函数类型（指数、高斯或线性），根据文档年龄调整相关性得分，从而自动优先处理新鲜内容。</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">简化搜索：数据输入，数据输出体验</h3><p>原始数据与向量嵌入之间的脱节是使用向量数据库的开发人员的另一个痛点。在数据到达 Milvus 进行索引和向量搜索之前，通常要使用外部模型进行预处理，将原始文本、图像或音频转换为向量表示。检索后，还需要进行额外的下游处理，例如将结果 ID 映射回原始内容。</p>
<p>Milvus 2.6 通过新的<strong>功能</strong>界面简化了这些嵌入工作流程，将第三方嵌入模型直接集成到搜索管道中。现在，您不再需要预先计算嵌入模型，而是可以</p>
<ol>
<li><p><strong>直接插入原始数据</strong>：向 Milvus 提交文本、图片或其他内容</p></li>
<li><p><strong>配置嵌入式提供商</strong>：连接到 OpenAI、AWS Bedrock、Google Vertex AI、Hugging Face 等嵌入式 API 服务。</p></li>
<li><p><strong>使用自然语言查询</strong>：直接使用原始文本查询进行搜索</p></li>
</ol>
<p>这就创造了一种 "数据输入，数据输出 "的体验，Milvus 为您简化了所有幕后的向量转换。</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">架构演变：扩展到数百亿向量<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 引入了基本的架构创新，能够经济高效地扩展到数百亿向量。</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">用新的啄木鸟 WAL 替代 Kafka 和 Pulsar</h3><p>Milvus 以前的部署依赖 Kafka 或 Pulsar 等外部消息队列作为前向写日志（WAL）系统。虽然这些系统最初运行良好，但它们带来了显著的操作复杂性和资源开销。</p>
<p>Milvus 2.6 引入了<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>啄木鸟</strong></a>系统（<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker</strong></a>），这是一个专门构建的云原生 WAL 系统，通过革命性的零磁盘设计消除了这些外部依赖性：</p>
<ul>
<li><p><strong>一切都在对象存储上进行</strong>：所有日志数据都持久保存在 S3、谷歌云存储或 MinIO 等对象存储中</p></li>
<li><p><strong>分布式元数据</strong>：元数据仍由 etcd 键值存储管理</p></li>
<li><p><strong>不依赖本地磁盘</strong>：选择消除分布式本地永久状态所涉及的复杂架构和操作符开销。</p></li>
</ul>
<p>我们对 Woodpecker 的性能进行了全面的基准测试比较：</p>
<table>
<thead>
<tr><th><strong>系统</strong></th><th><strong>卡夫卡</strong></th><th><strong>脉冲星</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP 本地</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>吞吐量</td><td>129.96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>延迟</td><td>58 毫秒</td><td>35 毫秒</td><td>184 毫秒</td><td>1.8 毫秒</td><td>166 毫秒</td></tr>
</tbody>
</table>
<p>Woodpecker 始终达到每个存储后端理论最大吞吐量的 60-80%，本地文件系统模式达到 450 MB/s，比 Kafka 快 5.5 倍；S3 模式达到 750 MB/s，比 Kafka 高 5.8 倍。</p>
<p>有关 Woodpecker 的更多详情，请查看本博客：<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们用 Milvus 的啄木鸟取代了 Kafka/Pulsar</a>。</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">经济地实现搜索新鲜度</h3><p>关键任务搜索通常要求新获取的数据可立即搜索。Milvus 2.6 取代了消息队列依赖性，从根本上改进了对新鲜更新的处理，以更低的资源开销提供搜索新鲜度。新架构增加了新的<strong>流节点（Streaming Node</strong>），它是一个专用组件，能与查询节点和数据节点等 Milvus 其他组件密切协作。流节点建立在啄木鸟（Woodpecker）之上，啄木鸟是我们的轻量级云原生前向写日志（WAL）系统。</p>
<p>这一新组件可实现</p>
<ul>
<li><p><strong>兼容性强</strong>：既能与新的 Woodpecker WAL 协同工作，又能向后兼容 Kafka、Pulsar 和其他流平台</p></li>
<li><p><strong>增量索引</strong>：新数据可立即搜索，无批处理延迟</p></li>
<li><p><strong>连续查询服务</strong>：同时进行高吞吐量摄取和低延迟查询</p></li>
</ul>
<p>通过将流式处理与批处理隔离开来，流式节点帮助 Milvus 保持稳定的性能和搜索新鲜度，即使在大量数据摄取期间也是如此。它的设计考虑到了横向扩展性，可根据数据吞吐量动态扩展节点容量。</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">增强的多租户能力：每个集群可扩展至 10 万个 Collections</h3><p>企业部署通常需要租户级隔离。Milvus 2.6 大幅增强了多租户支持，每个集群最多可支持<strong>100,000 个 Collections</strong>。这对于运行大型单体集群为许多租户提供服务的企业来说，是一项至关重要的改进。</p>
<p>这一改进得益于元数据管理、资源分配和查询规划方面的大量工程优化。现在，Milvus 用户即使拥有数以万计的 Collections，也能享受稳定的性能。</p>
<h3 id="Other-Improvements" class="common-anchor-header">其他改进</h3><p>Milvus 2.6 提供了更多的架构增强功能，例如 CDC + BulkInsert 用于简化跨地理区域的数据复制，Coord Merge 用于在大规模部署中更好地协调集群。</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">开始使用 Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 代表着一项巨大的工程努力，由 Zilliz 工程师和我们出色的社区贡献者合作开发，具有数十项新功能和性能优化。虽然我们在这里介绍了主要功能，但还有更多值得探索的地方。我们强烈建议您深入了解我们全面的<a href="https://milvus.io/docs/release_notes.md">发布说明</a>，探索该版本所提供的一切！</p>
<p><a href="https://milvus.io/"> Milvus 网站</a>上有完整的文档、迁移指南和教程。如有问题和社区支持，请加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。</p>
