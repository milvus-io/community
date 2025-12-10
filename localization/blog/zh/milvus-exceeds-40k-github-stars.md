---
id: milvus-exceeds-40k-github-stars.md
title: 7 年，2 次重大重建，40K+ GitHub Stars：Milvus 崛起为领先的开源向量数据库
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: 庆祝 Milvus 成为世界领先的开源向量数据库的 7 年历程
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>2025 年 6 月，Milvus 在 GitHub 上的星级数量达到 35000 个。短短几个月后，我们已经<a href="https://github.com/milvus-io/milvus">突破了 40,000 颗星--这不仅证明</a>了我们的发展势头，也证明了全球社区在不断推动向量和多模态搜索的未来发展。</p>
<p>我们深表感谢。<strong>感谢</strong>每一位在 Milvus 上加星、分叉、提交问题、争论 API、分享基准或创建不可思议的东西的人们：<strong>感谢你们，正是因为你们，这个项目才能如此快速地发展</strong>。每一颗星星代表的不仅仅是按下的一个按钮--它反映了有人选择了 Milvus 来支持他们的工作，有人相信我们正在建设的一切，有人与我们共享开放、可访问、高性能人工智能基础设施的愿景。</p>
<p>因此，在庆祝的同时，我们也在展望未来--展望您所要求的功能，展望人工智能现在所需要的架构，展望多模态、语义理解成为每个应用程序默认设置的世界。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">旅程：从零到 40,000+颗星<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>当我们在 2017 年开始构建 Milvus 时，<em>向量数据库</em>这个词甚至还不存在。我们当时只是一个工程师小团队，深信人工智能应用很快就会需要一种新型数据基础架构--不是为行和列而建，而是为高维、非结构化、多模态数据而建。传统数据库并不是为这个世界而构建的，我们知道必须有人重新想象存储和检索的样子。</p>
<p>最初的日子并不光彩。构建企业级基础架构是一项缓慢而艰苦的工作，我们需要花费数周的时间剖析代码路径、重写组件，并在凌晨两点对设计选择提出质疑。但我们坚持一个简单的使命：<strong>让构建人工智能应用的每一位开发人员都能使用向量搜索，并使其具有可扩展性和可靠性</strong>。这一使命让我们取得了最初的突破，也经历了不可避免的挫折。</p>
<p>一路走来，几个转折点改变了一切：</p>
<ul>
<li><p><strong>2019：</strong>我们开源了 Milvus 0.10。这意味着我们暴露了所有粗糙的边缘--黑客、TODO、我们还不引以为豪的部分。但社区出现了。开发人员提出了我们从未发现的问题，提出了我们从未想象过的功能，并对我们的假设提出了挑战，最终使 Milvus 变得更加强大。</p></li>
<li><p><strong>2020-2021:</strong>我们加入了<a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data 基金会</a>，发布了 Milvus 1.0，从 LF AI &amp; Data 毕业，并赢得了<a href="https://big-ann-benchmarks.com/neurips21.html">BigANN</a>十亿级向量搜索挑战赛--这是我们的架构能够应对真实世界规模的早期证明。</p></li>
<li><p><strong>2022年：</strong>企业用户需要Kubernetes原生扩展、弹性以及存储和计算的真正分离。我们面临着艰难的抉择：修补旧系统还是重建一切。我们选择了更艰难的道路。<strong>Milvus 2.0 是一次从头开始的重塑</strong>，引入了完全解耦的云原生架构，将 Milvus 转变为适用于关键任务 AI 工作负载的生产级平台。</p></li>
<li><p><strong>2024-2025:</strong> <a href="https://zilliz.com/">Zilliz</a>（Milvus 背后的团队）被<a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">Forrester</a> 评为<a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">领导者</a>，一举突破 3 万颗星，目前已突破 4 万颗。它成为多模态搜索、RAG 系统、Agentic 工作流以及跨行业--教育、金融、创意制作、科学研究等--十亿规模检索的中坚力量。</p></li>
</ul>
<p>这一里程碑不是靠炒作得来的，而是开发人员在实际生产工作负载中选择了 Milvus，并推动我们不断改进每一步。</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025:两次重大发布，性能大幅提升<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 年是 Milvus 进入新领域的一年。虽然向量搜索在语义理解方面表现出色，但生产中的现实情况很简单：<strong>开发人员仍然需要</strong>对产品 ID、序列号、精确短语、法律术语等进行<strong>精确的关键字匹配</strong>。如果没有原生的全文搜索功能，团队就不得不维护 Elasticsearch/OpenSearch 集群，或者将他们自己的定制解决方案粘合在一起--这就加倍增加了操作符和分散性。</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.5</strong></a> <strong>改变了这一状况</strong>。它引入了<strong>真正的原生混合搜索</strong>，将全文检索和向量搜索结合到一个引擎中。开发人员首次可以同时运行词法查询、语义查询和元数据过滤器，而无需使用额外的系统或同步管道。我们还升级了元数据过滤、表达式解析和执行效率，使混合查询在实际生产负载下感觉自然、快速。</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> <strong>进一步推动了这一势头</strong>，针对的是我们从大规模运行的用户那里听到最多的两个挑战：<strong><em>成本</em>和<em>性能</em>。</strong>该版本在架构上进行了深入改进--更可预测的查询路径、更快的索引、显著降低的内存使用率以及更高效的存储。许多团队报告说，在不更改一行应用代码的情况下，立即获得了收益。</p>
<p>以下是 Milvus 2.6 的几个亮点：</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>分层存储</strong></a>，让团队更智能地平衡成本和性能，将存储成本降低多达 50%。</p></li>
<li><p>通过<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1 位量化技术</a><strong>节省大量内存</strong>--在提供更快查询的同时，内存使用量最多可减少 72%。</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>重新设计的全文引擎</strong></a>，其 BM25 实现速度明显更快--在我们的基准测试中，比 Elasticsearch 快达 4 倍。</p></li>
<li><p>用于<a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON 结构元数据</a>的<strong>新路径索引</strong>，可将复杂文档的过滤速度提高 100 倍。</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>：</a>十亿级压缩，可减少 3200 倍的存储空间，并具有很高的召回率。</p></li>
<li><p><strong>利用 R-Tree 进行</strong><strong>语义 +</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>地理空间搜索</strong></a> <strong>：</strong>将<em>事物的位置</em>与<em>含义</em>相结合，提供更相关的结果</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>：</strong>采用混合 CAGRA 模式，在 GPU 上构建但在 CPU 上查询，从而降低部署成本</p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>数据入库、数据出库</strong></a><strong>"工作流程</strong>简化了嵌入式摄取和检索，特别是对于多模态管道。</p></li>
<li><p>在单个集群中<strong>支持多达 100K 个 Collections</strong>，这是向真正的大规模多租户迈出的重要一步。</p></li>
</ul>
<p>要深入了解 Milvus 2.6，请查看<a href="https://milvus.io/docs/release_notes.md">完整的发布说明</a>。</p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Milvus之外：面向人工智能开发人员的开源工具<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 年，我们不仅改进了 Milvus，还构建了能够加强整个人工智能开发者生态系统的工具。我们的目标不是追逐潮流，而是为开发者提供我们一直希望存在的开放、强大、透明的工具。</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher：没有云锁定的研究</h3><p>OpenAI 的 Deep Researcher 证明了深度推理 Agents 的能力。但它是封闭的、昂贵的，而且被锁定在云 API 后面。<a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher</strong></a> <strong>就是我们的答案。</strong>它是一个本地开源深度研究引擎，专为希望在不牺牲控制或隐私的情况下进行结构化调查的人设计。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher 完全在你的机器上运行，收集各种来源的信息，综合各种见解，并提供引文、推理步骤和可追溯性--这些功能对于真正的研究至关重要，而不仅仅是表面的摘要。没有黑盒。没有供应商锁定。只有开发人员和研究人员可以信任的透明、可重复的分析。</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">克劳德语境：真正理解你代码的编码助手</h3><p>大多数人工智能编码工具仍然表现得像花哨的 grep 管道--快速、肤浅、烧令牌，对真实的项目结构视而不见。<a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>改变了这一切。作为一个 MCP 插件，它终于为编码助手提供了他们一直缺少的东西：对代码库的真正语义理解。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context 在整个项目中构建了一个向量驱动的语义索引，让 Agents 可以找到正确的模块，跟踪文件间的关系，理解架构层面的意图，并通过相关性而不是猜测来回答问题。它能减少代币浪费，提高精确度，最重要的是，能让编码助手表现得真正理解你的软件，而不是假装理解。</p>
<p>这两种工具都是完全开源的。因为人工智能基础架构应该属于每一个人，因为人工智能的未来不应该被锁在专有的围墙后面。</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">受到 10,000 多个生产团队的信任<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>如今，超过 10,000 个企业团队在生产中使用 Milvus，其中既有快速发展的初创企业，也有世界上最成熟的科技公司和财富 500 强企业。英伟达（NVIDIA）、Salesforce、eBay、Airbnb、IBM、AT&amp;T、LINE、Shopee、Roblox、博世以及微软内部的团队都依靠Milvus为人工智能系统提供动力，这些系统每时每刻都在操作Milvus Operator。他们的工作负载涵盖搜索、推荐、代理管道、多模态检索以及将向量基础设施推向极限的其他应用。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/logos_eb0d3ad4af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>但最重要的不仅仅是<em>谁在</em>使用 Milvus，而是<em>他们在用</em> Milvus<em>构建什么</em>。在各行各业中，Milvus 的系统影响着企业的操作、创新和竞争方式：</p>
<ul>
<li><p><strong>人工智能辅助驾驶员和企业助理</strong>，通过即时访问数十亿个 Embeddings 来改善客户支持、销售工作流程和内部决策。</p></li>
<li><p><strong>电子商务、媒体和广告中的语义和可视化搜索</strong>，推动更高的转化率、更好的发现和更快的创意制作。</p></li>
<li><p><strong>法律、金融和科学情报平台</strong>，将精确性、可审计性和合规性转化为真正的操作符。</p></li>
<li><p>金融科技和银行业的<strong>欺诈检测和风险引擎</strong>，依靠快速语义匹配来实时防止损失。</p></li>
<li><p><strong>大规模 RAG 和 Agentic 系统</strong>，为团队提供深入语境、领域感知的 Agents 行为。</p></li>
<li><p>将文本、代码、图像和元数据统一为一个连贯语义结构的<strong>企业知识层</strong>。</p></li>
</ul>
<p>这些都不是实验室基准，而是世界上要求最严格的生产部署。Milvus 通常能实现以下目标：</p>
<ul>
<li><p>数十亿向量的检索时间低于 50 毫秒</p></li>
<li><p>在单一系统中管理数十亿份文件和事件</p></li>
<li><p>工作流程速度比其他解决方案快 5-10 倍</p></li>
<li><p>支持数十万个 Collections 的多租户架构</p></li>
</ul>
<p>团队选择Milvus的原因很简单：Milvus<strong>能在最关键的地方提供服务--速度、可靠性、成本效益，以及在不每隔几个月就拆毁架构的情况下扩展到数十亿的能力。</strong>这些团队对我们的信任是我们不断加强 Milvus 以应对未来十年人工智能发展的原因。</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">当您需要 Milvus 而不需要运营时：Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是免费的，功能强大，久经考验。但它同时也是一个分布式系统，而要运行好分布式系统是一项艰巨的工程。索引调整、内存管理、集群稳定性、扩展性、可观察性......这些任务都需要时间和专业知识，而许多团队根本没有空闲时间。开发人员需要的是 Milvus 的强大功能，而不是大规模管理时不可避免的操作符。</p>
<p>这一现实让我们得出了一个简单的结论：如果 Milvus 要成为人工智能应用的核心基础架构，我们就必须让它操作起来毫不费力。这就是我们建立<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> 的原因，它是由开源项目背后的同一团队创建和维护的完全托管 Milvus 服务。</p>
<p>Zilliz Cloud 为开发人员提供了他们已经了解并信任的 Milvus，但无需配置集群、解决性能问题、规划升级或担心存储和计算调整。而且，由于它包含了在自我管理环境中无法运行的优化功能，因此速度更快、更可靠。<a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a>是我们的商业级自优化向量引擎，其性能是<strong>开源Milvus</strong>的10倍。</p>
<p><strong>Zilliz Cloud 的独特之处</strong></p>
<ul>
<li><strong>自我优化性能：</strong>AutoIndex 可自动调整 HNSW、IVF 和 DiskANN，无需手动配置即可实现 96% 以上的召回率。</li>
</ul>
<ul>
<li><p><strong>具有弹性和成本效益：</strong>现收现付定价、无服务器自动扩展和智能资源管理与自我管理部署相比，通常可降低 50% 或更多成本。</p></li>
<li><p><strong>企业级可靠性：</strong>99.95% 的正常运行时间 SLA、多 AZ 冗余、SOC 2 Type II、ISO 27001 和 GDPR 合规性。全面支持 RBAC、BYOC、审计日志和加密。</p></li>
<li><p><strong>与云无关的部署：</strong>可在 AWS、Azure、GCP、阿里云或腾讯云上运行--无供应商锁定，各地性能一致。</p></li>
<li><p><strong>自然语言查询：</strong>内置的 MCP 服务器支持可让您以对话方式查询数据，而无需手动创建 API 调用。</p></li>
<li><p><strong>轻松迁移</strong>：使用内置迁移工具从 Milvus、Pinecone、Qdrant、Weaviate、Elasticsearch 或 PostgreSQL 迁移，无需重写 Schema 或停机。</p></li>
<li><p><strong>100% 兼容开源 Milvus。</strong>无专有分叉。无锁定。只需 Milvus，更简单。</p></li>
</ul>
<p><strong>Milvus 将始终保持开源和免费使用。</strong>但是，在企业规模上可靠地运行和操作它需要大量的专业知识和资源。<strong>Zilliz Cloud 就是我们对这一差距的回应</strong>。Zilliz Cloud 部署在 29 个地区和 5 个主要云中，可提供企业级性能、安全性和成本效益，同时让您与已经熟悉的 Milvus 保持完全一致。</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>开始免费试用 → 开始免费试用</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">下一步：Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>作为推出向量数据库的团队，我们对企业数据正在发生的变化了如指掌。曾经整齐排列在 TB 级结构化表格中的数据，正在迅速转变为 PB 级（很快将达到万亿级）的多模态对象。文本、图像、音频、视频、时间序列流、多传感器日志......这些都是现代人工智能系统所依赖的数据集。</p>
<p>向量数据库专为非结构化和多模态数据而设计，但它们并不总是最经济或架构最合理的选择--尤其是当绝大多数数据都是冷数据时。大型模型的训练语料库、自动驾驶感知日志和机器人数据集通常不需要毫秒级的延迟或高并发性。通过实时向量数据库运行如此大量的数据，对于不需要这种性能水平的管道来说，会变得昂贵、操作符繁重和过于复杂。</p>
<p>这一现实促使我们开始了下一个重大举措：<strong>Milvus Lake--</strong>语义驱动、索引优先的多模态湖泊，专为人工智能规模的数据而设计。Milvus Lake统一了每种模式的语义信号--向量、元数据、标签、LLM生成的描述和结构化字段，并将它们组织成围绕真实业务实体的语义<strong>宽表</strong>。以前以原始、分散文件形式存在于对象存储、湖库和模型管道中的数据，现在变成了统一、可查询的语义层。海量多模态语料库变成了可管理、可检索、可重复使用的资产，在整个企业中具有一致的意义。</p>
<p>在引擎盖下，Milvus Lake 建立在一个简洁的<strong>清单+数据+索引</strong>架构上，该架构将索引视为基础而非事后考虑。这就开启了一个 "先检索，后处理 "的工作流程，该流程针对万亿规模的冷数据进行了优化，可提供可预测的延迟、显著降低的存储成本和更高的操作符稳定性。分层存储方法--NVMe/SSD 用于热路径，对象存储用于深度存档--搭配高效压缩和懒加载索引，在保持语义保真度的同时，还能牢牢控制基础架构开销。</p>
<p>Milvus Lake 还能无缝接入现代数据生态系统，与 Paimon、Iceberg、Hudi、Spark、Ray 以及其他大数据引擎和格式集成。团队可以在一个地方运行批处理、近实时管道、语义检索、特征工程和训练数据准备，而无需重新平台现有的工作流程。无论您是要建立基础模型库、管理自动驾驶模拟库、训练机器人代理，还是要为大规模检索系统提供动力，Milvus Lake 都能为人工智能时代提供一个可扩展且经济高效的语义湖泊。</p>
<p><strong>Milvus Lake 正在积极开发中。</strong>对早期访问感兴趣或想了解更多信息？<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>联系我们 →</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">由社区打造，为社区服务<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 的与众不同之处不仅在于技术，还在于技术背后的员工。我们的贡献者遍布全球，汇集了高性能计算、分布式系统和人工智能基础设施方面的专家。来自 ARM、英伟达™（NVIDIA®）、AMD、英特尔、Meta、IBM、Salesforce、阿里巴巴、微软等公司的工程师和研究人员为 Milvus 的发展贡献了他们的专业知识。</p>
<p>每一个拉取请求、每一个错误报告、在我们论坛上回答的每一个问题、创建的每一个教程--这些贡献让 Milvus 对每个人来说都变得更好。</p>
<p>这个里程碑属于你们所有人：</p>
<ul>
<li><p><strong>献给我们的贡献者</strong>：感谢你们的代码、想法和时间。你们让 Milvus 每一天都变得更好。</p></li>
<li><p><strong>致我们的用户</strong>：感谢您信任 Milvus，将其作为您的生产工作负载，并与我们分享您的经验，无论是好的还是具有挑战性的。您的反馈推动着我们的路线图。</p></li>
<li><p><strong>致我们的社区支持者</strong>：感谢你们回答问题、编写教程、创建内容并帮助新人入门。是你们让我们的社区充满了欢迎和包容。</p></li>
<li><p><strong>致我们的合作伙伴和集成商</strong>：感谢你们与我们共同建设，使 Milvus 成为人工智能开发生态系统中的一流公民。</p></li>
<li><p><strong>致 Zilliz 团队</strong>：感谢你们对开源项目和用户成功的坚定承诺。</p></li>
</ul>
<p>Milvus 之所以能够发展壮大，是因为成千上万的人决定共同打造一些东西--开放、慷慨，并且坚信基础人工智能基础设施应该对每个人都开放。</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">加入我们的旅程<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>无论您是在构建第一个向量搜索应用程序，还是在扩展数十亿向量，我们都非常欢迎您成为 Milvus 社区的一员。</p>
<p><strong>开始吧</strong></p>
<ul>
<li><p>⭐<strong>在 GitHub 上加入我们</strong>：<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️<strong>免费试用 Zilliz Cloud</strong>：<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬<strong>加入我们的</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a>，与全球开发人员交流</p></li>
<li><p>📚<strong>探索我们的文档</strong>：<a href="https://milvus.io/docs">Milvus 文档</a></p></li>
<li><p>💬<strong>预订</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>20 分钟的一对一会话</strong></a>，获取见解、指导和问题解答。</p></li>
</ul>
<p>前方的道路令人兴奋。随着人工智能重塑各行各业并释放出新的可能性，向量数据库将成为这场变革的核心。我们正在共同构建现代人工智能应用所依赖的语义基础，而我们才刚刚起步。</p>
<p>为下一个 40,000 颗星干杯，为<strong>共同</strong>打造人工智能基础设施的未来干杯。🎉</p>
