---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: 发布 VDBBench 1.0：开源向量数据库基准测试与您的实际生产工作负载
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: 了解 VDBBench 1.0，这是一款开源工具，用于利用真实数据、流式摄取和并发工作负载对向量数据库进行基准测试。
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>大多数向量数据库基准测试都使用静态数据和预建索引。但生产系统并非如此--当用户运行查询时，数据会不断流动，过滤器会分割索引，性能特征会在并发读/写负载下发生显著变化。</p>
<p>今天，我们发布了<a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>，这是一款开源基准测试工具，其设计初衷是在实际生产条件下测试向量数据库：流式数据摄取、具有不同选择性的元数据过滤以及揭示实际系统瓶颈的并发工作负载。</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>下载 VDBBench 1.0 →</strong></a>|<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>查看排行榜 →</strong></a><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">目前的基准测试为何具有误导性<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>老实说，在我们的行业中有一个奇怪的现象。每个人都在谈论 "不要玩基准"，但许多人却恰恰参与了这种行为。自 2023 年向量数据库市场爆发以来，我们已经看到了无数系统 "基准性能出色"，但在生产中却 "惨遭失败 "的例子，浪费了工程时间，损害了项目信誉。</p>
<p>我们亲眼目睹了这种脱节现象。例如，Elasticsearch 标榜毫秒级的查询速度，但在幕后，仅优化索引就需要 20 多个小时。哪个生产系统能忍受这样的停机时间？</p>
<p>问题源于三个基本缺陷：</p>
<ul>
<li><p><strong>过时的数据集：</strong>许多基准测试仍依赖于 SIFT（128 维）等传统数据集，而现代嵌入数据集的维度范围为 768-3,072 维。在 128 维与 1024 维以上向量上操作的系统，其性能特征有着本质区别--内存访问模式、索引效率和计算复杂度都发生了巨大变化。</p></li>
<li><p><strong>虚荣指标：</strong>基准测试关注的是平均延迟或峰值 QPS，这会造成图像失真。平均延迟为 10 毫秒但 P99 延迟为 2 秒的系统会带来糟糕的用户体验。30 秒内测出的峰值吞吐量对持续性能毫无帮助。</p></li>
<li><p><strong>过于简化的应用场景：</strong>大多数基准测试都是测试基本的 "写入数据、建立索引、查询 "工作流程--基本上是 "Hello World "级别的测试。真正的生产涉及在提供查询的同时持续摄取数据、碎片化索引的复杂元数据过滤以及争夺资源的并发读/写操作。</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">VDBBench 1.0 有哪些新功能？<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench 不仅对过时的基准测试理念进行了更新，还从最初的原则出发重建了这一概念，并坚持一个指导思想：基准测试只有在预测实际生产行为时才有价值。</p>
<p>我们对 VDBBench 进行了精心设计，以在<strong>数据真实性、工作负载模式和性能测量方法这</strong>三个关键方面忠实再现真实世界的条件<strong>。</strong></p>
<p>让我们来详细了解一下 VDBBench 带来了哪些新功能。</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 重新设计的仪表板，具有与生产相关的可视化功能</strong></h3><p>大多数基准仅关注原始数据输出，但重要的是工程师如何解释这些结果并采取行动。我们重新设计了用户界面，将清晰度和交互性放在首位，使您能够发现系统间的性能差距，并快速做出基础架构决策。</p>
<p>新的仪表板不仅可视化性能数字，还可视化它们之间的关系：QPS 在不同的过滤选择性水平下如何降低，召回率在流媒体摄取过程中如何波动，以及延迟分布如何揭示系统稳定性特征。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们使用最新配置和推荐设置重新测试了主要的向量数据库平台，包括<strong>Milvus、Zilliz Cloud、Elastic Cloud、Qdrant Cloud、Pinecone 和 OpenSearch</strong>，确保所有基准数据都能反映当前的能力。所有测试结果均可在<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a> 上查看。</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ 标签过滤：隐藏的性能杀手</h3><p>现实世界中的查询很少是孤立进行的。应用程序将向量相似性与元数据过滤相结合（"查找与这张照片相似但价格低于 100 美元的鞋子"）。这种过滤向量搜索带来了独特的挑战，而大多数基准却完全忽略了这一点。</p>
<p>过滤搜索在两个关键领域引入了复杂性：</p>
<ul>
<li><p><strong>过滤复杂性</strong>：更多的标量字段和复杂的逻辑条件增加了计算需求，并可能导致召回率不足和图索引碎片化。</p></li>
<li><p><strong>过滤选择性</strong>：这是我们在生产中反复验证的 "隐藏性能杀手"。当过滤条件具有高度选择性（过滤掉 99% 以上的数据）时，查询速度可能会出现数量级的波动，并且由于索引结构在稀疏结果集上的挣扎，召回率可能会变得不稳定。</p></li>
</ul>
<p>VDBBench 系统地测试了各种过滤选择性水平（从 50% 到 99.9%），提供了这种关键生产模式下的综合性能概况。测试结果往往会揭示出传统基准测试中从未出现过的性能悬崖。</p>
<p><strong>例如</strong>在 Cohere 1M 测试中，Milvus 在所有过滤选择性级别中都保持了持续的高召回率，而 OpenSearch 则表现出不稳定的性能，召回率在不同的过滤条件下大幅波动--在许多情况下召回率低于 0.8，这对于大多数生产环境来说是不可接受的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图Milvus 和 OpenSearch 在不同过滤选择性水平下的 QPS 和召回率（Cohere 1M 测试）。</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">流读写：超越静态索引测试</h3><p>生产系统很少有静态数据。在执行搜索时，新信息会不断涌入--在这种情况下，许多原本令人印象深刻的数据库会在保持搜索性能和处理连续写入的双重压力下崩溃。</p>
<p>VDBBench 的流场景模拟了真实的并行操作，帮助开发人员了解高并发环境下的系统稳定性，特别是数据写入对查询性能的影响，以及随着数据量的增加性能是如何变化的。</p>
<p>为确保在不同系统间进行公平比较，VDBBench 采用了结构化方法：</p>
<ul>
<li><p>配置受控写入率，以反映目标生产工作负载（例如，500 行/秒分布在 5 个并行进程中）</p></li>
<li><p>每摄取 10%的数据后触发搜索操作，在串行和并行模式之间交替进行</p></li>
<li><p>记录综合指标：延迟分布（包括 P99）、持续 QPS 和调用准确性</p></li>
<li><p>随着数据量和系统压力的增加，跟踪性能随时间的变化情况</p></li>
</ul>
<p>这种受控的增量负载测试可揭示系统在不断摄取数据的情况下如何保持稳定性和准确性，而传统的基准很少能捕捉到这一点。</p>
<p><strong>举例说明</strong>：在 Cohere 10M 流测试中，与 Elasticsearch 相比，Pinecone 在整个写入周期中保持了更高的 QPS 和召回率。值得注意的是，Pinecone 的性能在摄取完成后显著提高，显示出在持续负载下的强大稳定性，而 Elasticsearch 在主动摄取阶段则表现得更加不稳定。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图：Pinecone 的 QPS 和 RecallPinecone 与 Elasticsearch 在 Cohere 10M 流测试中的 QPS 和召回率对比（500 行/秒摄取率）。</p>
<p>VDBBench 更进一步，支持可选的优化步骤，允许用户比较索引优化前后的流搜索性能。它还能跟踪并报告每个阶段所花费的实际时间，从而更深入地了解系统在类似生产条件下的效率和行为。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图优化后 Pinecone 与 Elasticsearch 在 Cohere 10M 流测试中的 QPS 和召回率对比（500 行/秒摄取率）</em></p>
<p>如我们的测试所示，Elasticsearch 在索引优化后的 QPS 方面超过了 Pinecone。但是，当 x 轴反映实际耗时时，Elasticsearch 显然需要更长的时间才能达到这一性能。在生产中，这种延迟非常重要。这种比较揭示了一个关键的权衡：峰值吞吐量与服务时间。</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">反映当前人工智能工作负载的现代数据集</h3><p>我们彻底改造了用于向量数据库基准测试的数据集。VDBBench 不再使用 SIFT 和 GloVe 等传统测试集，而是使用 OpenAI 和 Cohere 等最先进的嵌入模型生成的向量，这些模型为当今的人工智能应用提供了动力。</p>
<p>为了确保相关性，特别是对于检索增强生成（RAG）等用例，我们选择了反映真实世界企业和特定领域场景的语料库：</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>语料库</strong></td><td><strong>嵌入模型</strong></td><td><strong>尺寸</strong></td><td><strong>大小</strong></td><td><strong>使用案例</strong></td></tr>
<tr><td>维基百科</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>通用知识库</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>特定领域（生物医学）</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>网络规模文本处理</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1m / 10m / 138m</td><td>大规模搜索</td></tr>
</tbody>
</table>
<p>这些数据集更好地模拟了当今的大容量、高维向量数据，可在与现代人工智能工作负载相匹配的条件下，对存储效率、查询性能和检索准确性进行实际测试。</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ 针对特定行业测试的自定义数据集支持</h3><p>每个企业都是独一无二的。金融行业可能需要侧重于交易嵌入的测试，而社交平台则更关心用户行为向量。VDBBench 可让您使用自己的数据进行基准测试，这些数据由您的特定嵌入模型生成，适用于您的特定工作负载。</p>
<p>您可以自定义</p>
<ul>
<li><p>向量维度和数据类型</p></li>
<li><p>元数据 Schema 和过滤模式</p></li>
<li><p>数据量和摄取模式</p></li>
<li><p>与生产流量相匹配的查询分布</p></li>
</ul>
<p>毕竟，没有数据集比您自己的生产数据更能说明问题。</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">VDBBench 如何衡量生产中的实际重要因素<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">以生产为重点的指标设计</h3><p>VDBBench 优先考虑反映实际性能的指标，而不仅仅是实验室结果。我们围绕生产环境中的实际问题重新设计了基准：<strong>负载下的可靠性、尾部延迟特性、持续吞吐量和精度保持。</strong></p>
<ul>
<li><p><strong>针对真实用户体验的 P95/P99 延迟</strong>：平均/中位延迟掩盖了令真实用户沮丧的异常值，并可能表明潜在的系统不稳定性。VDBBench 专注于 P95/P99 等尾部延迟，揭示 95% 或 99% 的查询实际将达到的性能。这对于 SLA 规划和了解最坏情况下的用户体验至关重要。</p></li>
<li><p><strong>负载下的可持续吞吐量</strong>：在生产中，5 秒钟内性能良好的系统并不能满足要求。VDBBench 会逐渐增加并发量，以找出数据库每秒的最大可持续查询次数 (<code translate="no">max_qps</code>)，而不是短时间理想条件下的峰值。这种方法揭示了系统在一段时间内的支持能力，有助于进行切合实际的容量规划。</p></li>
<li><p><strong>调用与性能的平衡</strong>：没有准确性的速度是毫无意义的。VDBBench 中的每一个性能数字都与召回率测量值配对，因此您可以清楚地知道，为了获得吞吐量，您需要牺牲多少相关性。这样就能在内部权衡大相径庭的系统之间进行公平、公正的比较。</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">反映现实的测试方法</h3><p>VDBBench 设计中的一项关键创新是将串行测试和并发测试分离开来，这有助于捕捉系统在不同类型负载下的表现，并揭示不同用例的重要性能特征。</p>
<p><strong>延迟测量分离：</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> 测量最小负载下的系统性能，即一次只处理一个请求。这代表了延迟的最佳情况，有助于确定基线系统能力。</p></li>
<li><p><code translate="no">conc_latency_p99</code> 高并发：捕捉现实高并发条件下的系统行为，即多个请求同时到达并争夺系统资源。</p></li>
</ul>
<p><strong>两阶段基准结构</strong>：</p>
<ol>
<li><p><strong>串行测试</strong>：单进程运行 1,000 次查询，确定基准性能和准确性，报告<code translate="no">serial_latency_p99</code> 和召回率。该阶段有助于确定理论性能上限。</p></li>
<li><p><strong>并发测试</strong>：模拟在持续负载下的生产环境，其中包含几项关键创新：</p>
<ul>
<li><p><strong>真实的客户端模拟</strong>：每个测试进程都使用自己的连接和查询集独立操作，避免了共享状态干扰而导致结果失真</p></li>
<li><p><strong>同步启动</strong>：所有进程同时启动，确保测得的 QPS 准确反映声称的并发水平</p></li>
<li><p><strong>独立查询集</strong>：防止出现无法反映生产查询多样性的不切实际的缓存命中率</p></li>
</ul></li>
</ol>
<p>这些精心设计的方法可确保 VDBBench 报告的<code translate="no">max_qps</code> 和<code translate="no">conc_latency_p99</code> 值既准确又与生产相关，从而为生产容量规划和系统设计提供有意义的见解。</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">VDBBench 1.0 入门<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0</strong>代表着向生产相关基准测试的根本转变。通过涵盖连续数据写入、具有不同选择性的元数据过滤以及并发访问模式下的流式负载，它提供了当今最接近实际生产环境的基准。</p>
<p>基准测试结果与实际性能之间的差距不应该是猜测游戏。如果您计划在生产环境中部署向量数据库，那么除了理想化的实验室测试外，还应该了解它的性能如何。VDBBench 是开源的、透明的，旨在支持有意义的、苹果对苹果的比较。</p>
<p>不要被无法转化为生产价值的惊人数字所左右。<strong>使用 VDBBench 1.0 在反映实际工作负载的条件下，使用您的数据测试与您的业务相关的场景。</strong>向量数据库评估中误导性基准的时代即将结束--是时候根据与生产相关的数据做出决策了。</p>
<p><strong>使用自己的工作负载试用 VDBBench</strong><a href="https://github.com/zilliztech/VectorDBBench"> ：https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>查看主要向量数据库的测试结果：</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench 排行榜</a></p>
<p>有问题或想分享您的结果？加入<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>上的对话或在<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a> 上与我们的社区联系。</p>
