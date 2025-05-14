---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: 基准会说谎--向量数据库需要接受真正的考验
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: 利用 VDBBench 发现向量数据库的性能差距。我们的工具可在真实生产场景下进行测试，确保您的人工智能应用顺利运行，不会出现意外停机。
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">根据基准选择的向量数据库可能在生产中失效<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>在为人工智能应用选择<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量数据库</a>时，传统的基准就像在空旷的赛道上试驾跑车，结果发现它在交通高峰期熄火了。令人不安的事实是什么？大多数基准只能评估人工条件下的性能，而生产环境中根本不存在人工条件。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>大多数基准测试都是在所有数据摄取完毕、索引完全建立<strong>之后才</strong>对向量数据库进行测试。但在生产环境中，数据永远不会停止流动。你不可能暂停系统数小时来重建索引。</p>
<p>我们亲眼目睹了这种脱节。例如，Elasticsearch 可能标榜毫秒级的查询速度，但在幕后，我们看到它仅优化索引就花费了<strong>20 多个小时</strong>。这是任何生产系统都无法承受的停机时间，尤其是在需要持续更新和即时响应的人工智能工作负载中。</p>
<p>通过 Milvus，在与企业客户进行了无数次概念验证（PoC）评估后，我们发现了一个令人担忧的模式：<strong>在受控实验室环境中表现出色的向量数据库，在实际生产负载下却常常举步维艰。</strong>这一关键差距不仅让基础架构工程师感到沮丧，还可能破坏建立在这些误导性性能承诺基础上的整个人工智能计划。</p>
<p>这就是我们建立<a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a> 的原因：这是一个从头开始设计的开源基准，用于模拟生产实际情况。与挑选场景的合成测试不同，VDBBench 通过持续摄取、严格的过滤条件和各种场景来推动数据库，就像您的实际生产工作负载一样。我们的使命很简单：为工程师提供一种工具，显示向量数据库在实际条件下的实际性能，这样您就可以根据可信的数据做出基础架构决策。</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">基准与现实之间的差距<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>传统的基准测试方法存在三个关键缺陷，导致其结果对生产决策几乎毫无意义：</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1.过时的数据</h3><p>许多基准仍依赖于 SIFT 或<a href="https://zilliz.com/glossary/glove"> GloVe</a> 等过时的数据集，这些数据集与当今人工智能模型生成的复杂、高维向量 Embeddings 几乎没有任何相似之处。考虑一下这个问题：SIFT 包含 128 维向量，而 OpenAI 的嵌入模型中流行的嵌入从 768 维到 3072 维不等。</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2.虚荣指标</h3><p>许多基准仅关注平均延迟或峰值 QPS，这会造成图像失真。这些理想化的指标无法捕捉实际用户在生产环境中遇到的异常值和不一致性。例如，如果一个令人印象深刻的 QPS 数值需要无限制的计算资源，会让企业破产，那么这个数字又有什么用呢？</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3.过于简化的场景</h3><p>大多数基准测试只测试基本的静态工作负载--基本上就是向量搜索的 "Hello World"。例如，它们仅在整个数据集被摄取和编入索引后才发出搜索请求，而忽略了用户在新数据流中进行搜索的动态现实。这种简单化的设计忽略了定义实际生产系统的复杂模式，如并发查询、过滤搜索和连续数据摄取。</p>
<p>认识到这些缺陷后，我们意识到业界需要<strong>彻底改变基准测试理念--</strong>以人工智能系统在实际应用中的行为方式为基础。这就是我们建立<a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a> 的原因。</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">从实验室到生产：VDBBench 如何弥合差距<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench 不仅对过时的基准测试理念进行了创新，还从最初的原则出发重建了这一概念，并坚持一个指导思想：<strong>基准测试只有在预测实际生产行为时才有价值</strong>。</p>
<p>我们对 VDBBench 进行了精心设计，以便在数据真实性、工作负载模式和性能测量这三个关键维度上忠实地复制现实世界的条件。</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">数据集现代化</h3><p>我们对用于vectorDB基准测试的数据集进行了彻底改造。VDBBench 不再使用 SIFT 和 GloVe 等传统测试集，而是使用由最先进的嵌入模型生成的向量，这些模型为当今的人工智能应用提供了动力。</p>
<p>为了确保相关性，特别是对于像检索增强生成（RAG）这样的用例，我们选择了能反映真实世界的企业和特定领域场景的语料库。这些语料库既包括通用知识库，也包括生物医学问题解答和大规模网络搜索等垂直应用。</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>语料库</strong></td><td><strong>Embeddings 模型</strong></td><td><strong>尺寸</strong></td><td><strong>大小</strong></td></tr>
<tr><td>维基百科</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1m / 10m / 138m</td></tr>
</tbody>
</table>
<p>表：VDBBench 中使用的数据集</p>
<p>VDBBench 还支持自定义数据集，让您可以使用从特定嵌入模型生成的数据为特定工作负载进行基准测试。毕竟，没有数据集比您自己的生产数据更能说明问题。</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">以生产为重点的指标设计</h3><p><strong>VDBBench 优先考虑反映实际性能的指标，而不仅仅是实验室结果。</strong>我们围绕生产环境中的实际问题重新设计了基准：负载下的可靠性、尾部延迟、持续吞吐量和准确性。</p>
<ul>
<li><p><strong>P95/P99 延迟可衡量真实的用户体验</strong>：平均/中位延迟掩盖了令真实用户沮丧的异常值。这就是 VDBBench 专注于 P95/P99 等尾部延迟的原因，它揭示了 95% 或 99% 的查询实际达到的性能。</p></li>
<li><p><strong>负载下的可持续吞吐量：</strong>在生产中，5 秒钟内性能良好的系统并不适用。VDBBench 会逐渐增加并发量，以找出数据库每秒的最大可持续查询次数 (<code translate="no">max_qps</code>)，而不是在短时间理想条件下的峰值。这显示了您的系统随着时间的推移所保持的性能。</p></li>
<li><p><strong>调用与性能平衡：</strong>没有准确性的速度是毫无意义的。VDBBench 中的每一个性能数字都与召回率成正比，因此您可以清楚地知道，您需要用多少相关性来换取吞吐量。这样就能在内部权衡大相径庭的系统之间进行公平、公正的比较。</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">反映现实的测试方法</h3><p>VDBBench 设计中的一项关键创新是<strong>将串行和并行测试分离开来</strong>，这有助于捕捉系统在不同类型负载下的表现。例如，延迟指标划分如下：</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> 衡量最小负载下的系统性能，即一次只处理一个请求。这代表了延迟的<em>最佳情况</em>。</p></li>
<li><p><code translate="no">conc_latency_p99</code> 捕捉<em>现实高并发条件</em>下的系统行为，即多个请求同时到达。</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">两个基准测试阶段</h3><p>VDBBench 将测试分为两个关键阶段：</p>
<ol>
<li><strong>串行测试</strong></li>
</ol>
<p>这是一个包含 1,000 次查询的单进程运行。该阶段为理想性能和准确性建立基线，报告<code translate="no">serial_latency_p99</code> 和召回率。</p>
<ol start="2">
<li><strong>并发测试</strong></li>
</ol>
<p>该阶段模拟持续负载下的生产环境。</p>
<ul>
<li><p><strong>真实的客户端模拟</strong>：每个测试进程都使用自己的连接和查询集独立操作。这样可避免共享状态（如缓存）干扰，以免结果失真。</p></li>
<li><p><strong>同步启动</strong>：所有进程同时启动，确保测得的 QPS 准确反映声称的并发水平。</p></li>
</ul>
<p>这些精心设计的方法可确保 VDBBench 报告的<code translate="no">max_qps</code> 和<code translate="no">conc_latency_p99</code> 值既<strong>准确又与生产相关</strong>，从而为生产容量规划和系统设计提供有意义的见解。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图Milvus-16c64g-standalone 在不同并发级别下的 QPS 和延迟（Cohere 1M 测试）。在该测试中，Milvus 最初的利用率较低，直到</em> <strong><em>并发级别 20</em></strong><em>，并发级别的增加会提高系统利用率，并带来更高的 QPS。</em> <strong><em>并发</em></strong><em>量</em><em>超过</em> <strong><em>20</em></strong><em> 后</em><em>，系统达到满负荷：并发量的进一步增加不再能提高吞吐量，而且由于队列延迟，延迟也会增加。</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">超越静态数据搜索：实际生产场景<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>据我们所知，VDBBench 是唯一一款能在完整的生产关键场景（包括静态收集、过滤和流情况）中测试向量数据库的基准工具。</p>
<h3 id="Static-Collection" class="common-anchor-header">静态收集</h3><p>与其他匆忙进行测试的基准不同，VDBBench 会首先确保每个数据库已完全优化其索引--这是许多基准经常忽略的关键生产前提条件。这将为您提供完整的信息：</p>
<ul>
<li><p>数据摄取时间</p></li>
<li><p>索引时间（用于建立优化索引的时间，这会极大地影响搜索性能）</p></li>
<li><p>完全优化的索引在串行和并行条件下的搜索性能</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">过滤</h3><p>生产中的向量搜索很少单独进行。实际应用会将向量相似性与元数据过滤结合起来（"查找与这张照片相似但价格低于 100 美元的鞋子"）。这种过滤向量搜索带来了独特的挑战：</p>
<ul>
<li><p><strong>过滤复杂性</strong>：更多的标量列和逻辑条件增加了计算需求</p></li>
<li><p><strong>过滤器的选择性</strong>：<a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">我们的生产经验</a>表明，这是隐藏的性能杀手--查询速度会因过滤器的选择性不同而出现数量级的波动。</p></li>
</ul>
<p>VDBBench 系统地评估了不同选择性级别（从 50% 到 99.9%）的过滤器性能，提供了数据库如何处理这一关键生产模式的全面概况。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图Milvus 和 OpenSearch 在不同过滤选择性级别下的 QPS 和召回率（Cohere 1M 测试）。X 轴表示过滤数据的百分比。如图所示，Milvus 在所有过滤选择性级别中都保持了持续的高召回率，而 OpenSearch 则表现出不稳定的性能，在不同的过滤条件下召回率波动很大。</em></p>
<h3 id="Streaming" class="common-anchor-header">流式处理</h3><p>生产系统很少有静态数据。在执行搜索时，新信息会不断涌入--在这种情况下，许多令人印象深刻的数据库都会崩溃。</p>
<p>VDBBench 的独特流测试案例检验了边插入边搜索的性能，并测量了..：</p>
<ol>
<li><p><strong>数据量增长的影响</strong>：搜索性能如何随着数据量的增加而扩展。</p></li>
<li><p><strong>写入负载的影响</strong>：并发写入如何影响搜索延迟和吞吐量，因为写入也会消耗系统中的 CPU 或内存资源。</p></li>
</ol>
<p>流场景是对任何向量数据库的全面压力测试。但为此建立一个<em>公平的</em>基准并非易事。仅仅描述一个系统的表现是不够的，我们需要一个一致的评估模型，以便在不同数据库之间进行<strong>苹果对苹果的比较</strong>。</p>
<p>根据我们帮助企业进行实际部署的经验，我们建立了一种结构化、可重复的方法。使用 VDBBench：</p>
<ul>
<li><p>您可以<strong>定义一个固定的插入率</strong>，以反映您的目标生产工作负载。</p></li>
<li><p>然后，VDBBench 对所有系统施加<strong>相同的负载压力</strong>，确保性能结果具有直接可比性。</p></li>
</ul>
<p>例如，使用 Cohere 10M 数据集和 500 行/秒的摄取目标：</p>
<ul>
<li><p>VDBBench 启动 5 个并行生产进程，每个进程每秒插入 100 行。</p></li>
<li><p>每摄取 10%的数据后，VDBBench 就会触发一轮串行和并行条件下的搜索测试。</p></li>
<li><p>每个阶段结束后都会记录延迟、QPS 和召回率等指标。</p></li>
</ul>
<p>这种受控方法揭示了每个系统的性能如何随着时间的推移和在实际操作压力下发生变化--为您提供所需的洞察力，帮助您做出可扩展的基础架构决策。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图Pinecone 与 Elasticsearch 在 Cohere 10M 流测试中的 QPS 和召回率对比（500 行/秒摄取率）。Pinecone 保持了更高的 QPS 和召回率，在插入 100% 的数据后，QPS 有了显著提高。</em></p>
<p>但这并不是故事的结束。VDBBench 更进一步，支持可选的优化步骤，允许用户比较索引优化前后的流式搜索性能。它还能跟踪并报告每个阶段所花费的实际时间，从而更深入地了解生产条件下的系统效率和行为。</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图优化后 Pinecone 与 Elasticsearch 在 Cohere 10M 流测试中的 QPS 和召回率对比（500 行/秒摄取率）</em></p>
<p>如图所示，在索引优化后，ElasticSearch 的 QPS 超过了 Pinecone。奇迹？不完全是。右图说明了一切：一旦 x 轴反映了实际耗费的时间，很明显，ElasticSearch 需要更长的时间才能达到这一性能。而在生产中，这种延迟非常重要。这种比较揭示了一个关键的权衡：峰值吞吐量与服务时间。</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">自信地选择你的向量数据库<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>基准结果与实际性能之间的差距不应该是猜测游戏。VDBBench 提供了一种在实际生产条件下评估向量数据库的方法，包括连续数据摄取、元数据过滤和流式工作负载。</p>
<p>如果您计划在生产中部署向量数据库，那么除了理想化的实验室测试外，还值得了解它的性能如何。VDBBench 是开源的、透明的，旨在支持有意义的、苹果对苹果的比较。</p>
<p>现在就用自己的工作负载试试 VDBBench，看看不同系统在实践中的表现如何<a href="https://github.com/zilliztech/VectorDBBench">：https://github.com/zilliztech/VectorDBBench。</a></p>
<p>有问题或想分享您的结果？加入<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>上的对话或在<a href="https://discord.com/invite/FG6hMJStWu">Discord</a> 上与我们的社区联系。我们很乐意听取您的意见。</p>
