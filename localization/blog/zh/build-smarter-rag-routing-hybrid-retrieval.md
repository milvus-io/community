---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: 超越 Naive RAG：利用查询路由和混合检索构建更智能的系统
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_new_565494b6a6.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: 了解现代 RAG 系统如何使用查询路由、混合检索和逐级评估，以更低的成本提供更好的答案。
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>无论是否需要检索，您的<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>管道都会为每个查询检索文档。它在代码、自然语言和财务报告上运行相同的相似性搜索。当结果很糟糕时，你根本无法判断是哪个阶段出了问题。</p>
<p>这些都是天真 RAG 的症状--一种以相同方式处理每个查询的固定管道。现代 RAG 系统的工作方式有所不同。它们将查询路由到正确的处理程序，结合多种检索方法，并独立评估每个阶段。</p>
<p>本文将介绍构建更智能的 RAG 系统的四节点架构，解释如何在不维护单独索引的情况下实现<a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">混合检索</a>，并展示如何评估每个管道阶段，以便更快地调试问题。</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">为什么长上下文不能取代 RAG<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>既然模型支持 128K+ 标记窗口，"把所有东西都放在提示符里就行 "就是一个常见的建议。由于以下两个原因，这种做法在生产中站不住脚。</p>
<p><strong>成本会随着知识库而增加，而不是随着查询而增加。</strong>每个请求都会通过模型发送完整的知识库。对于 100K 标记的语料库来说，无论答案需要一个段落还是十个段落，每次请求都需要 100K 输入标记。每月推理成本随语料库大小呈线性增长。</p>
<p><strong>注意力随上下文长度而降低。</strong>模型很难将注意力集中在埋藏在冗长上下文中的相关信息上。关于 "迷失在中间 "效应的研究（Liu 等人，2023 年）表明，模型更容易错过长输入中间的信息。更大的上下文窗口并没有解决这个问题--注意力的质量并没有跟上窗口的大小。</p>
<p>RAG 在生成之前只检索相关段落，从而避免了这两个问题。问题不在于是否需要 RAG，而在于如何构建真正有效的 RAG。</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">传统 RAG 有什么问题？<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>传统的 RAG 遵循固定的流程：嵌入查询、运行<a href="https://zilliz.com/learn/what-is-vector-search">向量相似性搜索</a>、提取前 K 个结果、生成答案。每个查询都遵循相同的路径。</p>
<p>这就产生了两个问题：</p>
<ol>
<li><p><strong>在琐碎查询上浪费计算。</strong>"2+2是什么？"并不需要检索，但系统还是要运行它--增加了延迟和成本，却没有任何好处。</p></li>
<li><p><strong>对复杂查询的脆性检索。</strong>模棱两可的措辞、同义词或混合语言查询往往会使纯向量相似性失效。当检索遗漏了相关文档时，生成质量就会下降，而且没有退路。</p></li>
</ol>
<p>解决方法：在检索前增加决策功能。现代 RAG 系统会决定<em>是否</em>检索、检索<em>什么</em>以及<em>如何</em>检索，而不是每次都盲目运行相同的流程。</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">现代 RAG 系统的工作原理：四节点架构<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>现代 RAG 系统不采用固定的流程，而是通过四个决策节点来处理每个查询。每个节点回答一个关于如何处理当前查询的问题。</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">节点 1：查询路由 - 此查询是否需要检索？</h3><p>查询路由是流程中的第一个决策节点。它对传入的查询进行分类，并将其发送到适当的路径：</p>
<table>
<thead>
<tr><th>查询类型</th><th>示例</th><th>操作</th></tr>
</thead>
<tbody>
<tr><td>常识/常识</td><td>"什么是 2 + 2？</td><td>直接用 LLM 略读检索回答</td></tr>
<tr><td>知识库问题</td><td>"模型 X 的规格是什么？"</td><td>进入检索管道</td></tr>
<tr><td>实时信息</td><td>"本周末巴黎的天气"</td><td>调用外部 API</td></tr>
</tbody>
</table>
<p>预先路由可以避免对不需要的查询进行不必要的检索。在大部分查询都是简单或常识性查询的系统中，仅这一点就能大大降低计算成本。</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">节点 2：查询重写--系统应该搜索什么？</h3><p>用户查询通常比较模糊。像 "LightOn 第三季度报告中的主要数字 "这样的问题并不能很好地转化为搜索查询。</p>
<p>查询重写可以将原始问题转化为结构化的搜索条件：</p>
<ul>
<li><strong>时间范围：</strong>2025 年 7 月 1 日至 9 月 30 日（第三季度）</li>
<li><strong>文件类型</strong>财务报告</li>
<li><strong>实体：</strong>LightOn, 财务部</li>
</ul>
<p>这一步骤弥补了用户提问方式与检索系统索引文档方式之间的差距。更好的查询意味着更少的不相关结果。</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">节点 3：检索策略选择--系统应如何检索？</h3><p>不同的内容类型需要不同的检索策略。单一方法无法涵盖所有内容：</p>
<table>
<thead>
<tr><th>内容类型</th><th>最佳检索方法</th><th>为什么</th></tr>
</thead>
<tbody>
<tr><td>代码（变量名、函数签名）</td><td>词法检索<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">（BM25）</a></td><td>精确关键词匹配在结构化标记上效果很好</td></tr>
<tr><td>自然语言（文档、文章）</td><td>语义搜索（密集向量）</td><td>处理同义词、转述和意图</td></tr>
<tr><td>多模态（图表、示意图、图纸）</td><td>多模态检索</td><td>捕捉文本提取所忽略的视觉结构</td></tr>
</tbody>
</table>
<p>在编制索引时为文档添加元数据标签。在查询时，这些标签既能指导搜索哪些文档，也能指导使用哪种检索方法。</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">节点 4：最小语境生成--模型需要多少语境？</h3><p>在检索和<a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">Rerankers 排序</a>之后，系统只向模型发送最相关的段落，而不是整个文档。</p>
<p>这一点比听起来更重要。与加载整个文档相比，只传递相关段落可以减少 90% 以上的标记使用量。更少的标记数量意味着更快的响应速度和更低的成本，即使在使用缓存的情况下也是如此。</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">混合检索为何对企业 RAG 至关重要<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>在实践中，检索策略选择（节点 3）是大多数团队陷入困境的地方。没有一种检索方法能涵盖所有企业文档类型。</p>
<p>有些人认为关键词搜索就足够了，毕竟 Claude Code 基于 grep 的代码搜索效果很好。但代码是高度结构化的，具有一致的命名约定。企业文档则不同。</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">企业文档杂乱无章</h3><p><strong>同义词和不同的措辞。</strong>"优化内存使用 "和 "减少内存占用 "意思相同，但用词不同。关键字搜索匹配了其中一个，却忽略了另一个。在多语言环境中--有分词的中文、有混合脚本的日文、有复合词的德文--问题会成倍增加。</p>
<p><strong>视觉结构很重要。</strong>工程图纸依赖于布局。财务报告依赖表格。医学图像取决于空间关系。OCR 可以提取文本，但会丢失结构。纯文本检索无法可靠地处理这些文档。</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">如何实现混合检索</h3><p>混合检索结合了多种检索方法--通常是<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">用于关键词匹配的 BM25 和用于语义检索的密集向量--以</a>涵盖两种方法都无法单独处理的内容。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>传统方法运行两个独立的系统：一个用于 BM25，一个用于向量搜索。每个查询都会同时访问这两个系统，然后合并结果。这种方法行之有效，但也带来了实际开销：</p>
<table>
<thead>
<tr><th></th><th>传统（独立系统）</th><th>统一（单一 Collections）</th></tr>
</thead>
<tbody>
<tr><td>存储</td><td>两个独立索引</td><td>一个 Collections，两种向量类型</td></tr>
<tr><td>数据同步</td><td>必须保持两个系统同步</td><td>单一写入路径</td></tr>
<tr><td>查询路径</td><td>两个查询 + 结果合并</td><td>一次 API 调用，自动融合</td></tr>
<tr><td>调整</td><td>跨系统调整合并权重</td><td>在一次查询中更改密集/稀疏权重</td></tr>
<tr><td>操作符复杂性</td><td>高</td><td>低</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a>2.6 支持在同一 Collections 中同时使用密集向量（用于语义搜索）和稀疏向量（用于 BM25 类型的关键词搜索）。通过改变向量类型之间的权重，可调整检索行为。没有单独的索引，没有同步问题，没有合并延迟。</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">如何逐阶段评估 RAG 管道<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>仅检查最终答案是不够的。RAG 是一个多阶段管道，任何阶段的失败都会向下游传播。如果只衡量答案质量，就无法判断问题出在路由、重写、检索、重排序还是生成上。</p>
<p>当用户报告 "结果不准确 "时，根本原因可能在任何地方：路由可能在不应该的时候跳过检索；查询重写可能丢弃关键实体；检索可能遗漏相关文档；重排可能掩盖好的结果；或者模型可能完全忽略检索的上下文。</p>
<p>用自己的指标来评估每个阶段：</p>
<table>
<thead>
<tr><th>阶段</th><th>指标</th><th>抓取内容</th></tr>
</thead>
<tbody>
<tr><td>路由</td><td>F1 分数</td><td>假阴性率高 = 跳过需要检索的查询</td></tr>
<tr><td>查询重写</td><td>实体提取准确性、同义词覆盖率</td><td>改写后的查询丢弃了重要术语或改变了意图</td></tr>
<tr><td>检索</td><td>Recall@K, NDCG@10</td><td>未检索到相关文档，或排名过低</td></tr>
<tr><td>Rerankers</td><td>精确度@3</td><td>排名靠前的结果实际上并不相关</td></tr>
<tr><td>生成</td><td>忠实性、答案完整性</td><td>模型忽略检索上下文或给出部分答案</td></tr>
</tbody>
</table>
<p><strong>设置分层监控。</strong>使用离线测试集为每个阶段定义基准指标范围。在生产中，当任何阶段的指标低于基线时都会触发警报。这样，您就能及早发现问题，并将其追溯到特定阶段，而不是靠猜测。</p>
<h2 id="What-to-Build-First" class="common-anchor-header">首先构建什么<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>在实际的 RAG 部署中，有三个优先事项非常突出：</p>
<ol>
<li><p><strong>尽早添加路由。</strong>许多查询根本不需要检索。在前期对其进行过滤可减少负载，并以最小的工程投入提高响应时间。</p></li>
<li><p><strong>使用统一的混合检索。</strong>维护独立的 BM25 和向量检索系统会使存储成本翻倍，造成同步复杂性，并增加合并延迟。Milvus 2.6 这样的统一系统--密集矢量和稀疏矢量存放在同一个 Collections 中--可以解决这些问题。</p></li>
<li><p><strong>独立评估每个阶段。</strong>仅凭端到端答案质量并不是有用的信号。每个阶段的指标（路由的 F1、检索的 Recall@K 和 NDCG）能让您更快地进行调试，并避免在调整另一个阶段时破坏一个阶段。</p></li>
</ol>
<p>现代 RAG 系统的真正价值不仅在于检索，还在于知道<em>何时</em>检索和<em>如何</em>检索。从路由和统一混合搜索开始，你将拥有一个可扩展的基础。</p>
<hr>
<p>如果您正在构建或升级 RAG 系统，并遇到检索质量问题，我们很乐意为您提供帮助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，提出问题，分享您的架构，并向解决类似问题的其他开发人员学习。</li>
<li><a href="https://milvus.io/office-hours">预约 20 分钟的免费 Milvus Office Hours 会议</a>，了解您的使用案例--无论是路由设计、混合检索设置还是多阶段评估。</li>
<li>如果您想跳过基础架构设置，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（托管 Milvus）提供免费层级，让您轻松上手。</li>
</ul>
<hr>
<p>当团队开始构建更智能的 RAG 系统时，经常会遇到一些问题：</p>
<p><strong>问：现在模型支持 128K+ 上下文窗口，RAG 还有必要吗？</strong></p>
<p>有必要。当您需要处理单个大型文档时，长上下文窗口会有所帮助，但它们不能取代知识库查询检索。每次请求都发送整个语料库会使成本呈线性上升，而且模型在长上下文中会失去对相关信息的关注--这个问题已被充分证明，被称为 "迷失在中间 "效应（Liu et al.）RAG 只检索相关信息，从而保持成本和延迟的可预测性。</p>
<p><strong>问：如何在不运行两个独立系统的情况下将 BM25 和向量搜索结合起来？</strong></p>
<p>使用在同一个 Collections 中同时支持密集向量和稀疏向量的向量数据库。Milvus 2.6 可在每个文档中存储两种向量类型，并从单个查询中返回融合结果。你可以通过改变权重参数来调整关键词和语义匹配之间的平衡--无需单独的索引，无需合并结果，也无需头疼同步问题。</p>
<p><strong>问：要改进现有的 RAG 管道，首先应该添加什么？</strong></p>
<p>查询路由。这是影响最大、成本最低的改进措施。在大多数生产系统中，有相当一部分查询根本不需要检索--常识性问题、简单计算、常识。将这些查询直接路由到 LLM 可以减少不必要的检索调用，并立即缩短响应时间。</p>
<p><strong>问：如何找出 RAG 管道的哪个阶段造成了不良结果？</strong></p>
<p>独立评估每个阶段。使用 F1 分数评估路由准确性，使用 Recall@K 和 NDCG@10 评估检索质量，使用 Precision@3 评估重新排序，使用忠实度指标评估生成结果。从离线测试数据中设置基线，并在生产中监控每个阶段。当答案质量下降时，您可以追溯到出现退步的具体阶段，而不是猜测。</p>
