---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 利用 CRAG、LangGraph 和 Milvus 修复 RAG 检索错误
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: 相似度高但答案错误？了解 CRAG 如何为 RAG 管道添加评估和修正功能。使用 LangGraph + Milvus 构建可投入生产的系统。
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>随着 LLM 应用程序投入生产，团队越来越需要他们的模型来回答基于私人数据或实时信息的问题。<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">检索增强生成</a>（RAG）--即模型在查询时从外部知识库中提取--是标准的方法。这种方法可以减少幻觉，保持答案的时效性。</p>
<p>但在实践中很快就会出现这样一个问题：<strong>文档的相似度可能很高，但对于问题来说却完全是错误的。</strong>传统的 RAG 管道将相似性等同于相关性。在生产中，这一假设被打破了。排名靠前的结果可能已经过时、只与问题密切相关，或者缺少用户所需的确切细节。</p>
<p>CRAG（修正检索-增强生成）通过在检索和生成之间增加评估和修正功能来解决这个问题。系统不会盲目相信相似度得分，而是会检查检索到的内容是否真正回答了问题--如果没有回答问题，就会进行修正。</p>
<p>本文将介绍如何使用 LangChain、LangGraph 和<a href="https://milvus.io/intro">Milvus</a> 构建一个可投入生产的 CRAG 系统。</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">传统 RAG 无法解决的三个检索问题<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>生产中的大多数 RAG 故障都可追溯到以下三个问题之一：</p>
<p><strong>检索不匹配。</strong>该文档在主题上相似，但实际上没有回答问题。如果询问如何在 Nginx 中配置 HTTPS 证书，系统可能会返回 Apache 设置指南、2019 指南或有关 TLS 工作原理的一般说明。语义上接近，实际上无用。</p>
<p><strong>陈旧内容。</strong> <a href="https://zilliz.com/learn/vector-similarity-search">向量搜索</a>没有重复性的概念。查询 "Python async 最佳实践"，你会得到 2018 年模式和 2024 年模式的混合内容，纯粹按照嵌入距离排序。系统无法区分用户真正需要的是哪一个。</p>
<p><strong>内存污染。</strong>这个问题会随着时间的推移而加剧，通常也是最难解决的问题。假设系统检索到一个过时的 API 引用，并生成了不正确的代码。错误的输出会被存储到内存中。在下一次类似的查询中，系统又会检索到它，从而强化了错误。陈旧的信息和新鲜的信息逐渐混合在一起，系统的可靠性随着每一次循环而降低。</p>
<p>这些并不是偶然现象。一旦 RAG 系统处理实际流量，它们就会经常出现。这就是为什么检索质量检查是一项要求，而不是一个可有可无的东西。</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">什么是 CRAG？先评估，后生成<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>校正检索-增强生成（CRAG）</strong>是一种在 RAG 管道中的检索和生成之间增加一个评估和校正步骤的方法。它是在论文<a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a>（Yan 等人，2024 年）中提出的。传统的 RAG 会做出二选一的决定--使用文档或丢弃文档--与之不同的是，CRAG 会对每个检索结果进行相关性评分，并在其到达语言模型之前通过三种校正路径之一进行校正。</p>
<p>当检索结果处于灰色地带时，传统的 RAG 就会陷入困境：部分相关、有些过时或缺少关键信息。简单的 "是"/"否 "门要么丢弃有用的部分信息，要么让嘈杂的内容通过。CRAG 将<strong>检索 → 生成的</strong>流程重构为<strong>检索 → 评估 → 正确 → 生成</strong>，让系统有机会在开始生成之前解决检索质量问题。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>CRAG 四步工作流程：检索 → 评估 → 更正 → 生成，显示文档是如何评分和路由的</span> </span></p>
<p>检索结果分为三类：</p>
<ul>
<li><strong>正确：</strong>直接回答查询；经过轻微改进后可用</li>
<li><strong>模糊：</strong>部分相关；需要补充信息</li>
<li><strong>不正确：不</strong>相关；丢弃并回到其他来源</li>
</ul>
<table>
<thead>
<tr><th>决定</th><th>信心</th><th>行动</th></tr>
</thead>
<tbody>
<tr><td>正确</td><td>&gt; 0.9</td><td>完善文件内容</td></tr>
<tr><td>不明确</td><td>0.5-0.9</td><td>完善文件内容 + 网络搜索补充</td></tr>
<tr><td>不正确</td><td>&lt; 0.5</td><td>放弃检索结果；完全转回网络搜索</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">内容细化</h3><p>CRAG 还解决了标准 RAG 的一个更微妙的问题：大多数系统都会将检索到的完整文档提供给模型。这既浪费了词块，又稀释了信号--模型不得不在无关的段落中寻找真正重要的一句话。CRAG 首先对检索到的内容进行提炼，提取相关部分，去掉其余部分。</p>
<p>原始论文为此使用了知识条和启发式规则。在实践中，关键词匹配适用于许多使用案例，而生产系统可以在基于 LLM 的摘要或结构化提取上进行分层，以获得更高的质量。</p>
<p>提炼过程包括三个部分：</p>
<ul>
<li><strong>文档分解：</strong>从较长文档中提取关键段落</li>
<li><strong>查询重写：</strong>将模糊或模棱两可的查询转化为更有针对性的查询</li>
<li><strong>知识选择：</strong>重复、排序并只保留最有用的内容</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>三步文档提炼流程：文档分解（2000 → 500 个词组）、查询重写（提高搜索精度）和知识选择（过滤、排序和裁剪）</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">评估器</h3><p>评估器是 CRAG 的核心。它不是用来进行深度推理的，而是一个快速分流门。给定一个查询和一组检索到的文档，它就能决定这些内容是否足够好用。</p>
<p>原论文选择了经过微调的 T5-Large 模型，而不是通用的 LLM。理由是：对于这项特殊任务来说，速度和精度比灵活性更重要。</p>
<table>
<thead>
<tr><th>属性</th><th>微调 T5-Large</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>延迟</td><td>10-20 毫秒</td><td>200 毫秒以上</td></tr>
<tr><td>精确度</td><td>92% （论文实验）</td><td>待定</td></tr>
<tr><td>任务契合度</td><td>高 - 单任务微调，精度更高</td><td>中--通用、更灵活但不太专业</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">网络搜索回退</h3><p>当内部检索被标记为不正确或模棱两可时，CRAG 可触发网络搜索，以获取最新信息或补充信息。这对于时间敏感的查询和内部知识库存在缺口的主题而言，起到了安全网的作用。</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">为什么 Milvus 非常适合在生产中使用 CRAG？<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG 的有效性取决于它下面的内容。<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>需要做的不仅仅是基本的相似性搜索，它还需要支持多租户隔离、混合检索和 Schema 灵活性，这些都是生产型 CRAG 系统的要求。</p>
<p>在对几种方案进行评估后，我们选择了<a href="https://zilliz.com/what-is-milvus">Milvus</a>，原因有三。</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">多租户隔离</h3><p>在基于 Agents 的系统中，每个用户或会话都需要自己的内存空间。传统的方法--每个租户一个 Collections--很快就会成为一个令人头疼的操作符，尤其是在大规模系统中。</p>
<p>Milvus 使用<a href="https://milvus.io/docs/use-partition-key.md">Partition Key</a> 处理这个问题。在<code translate="no">agent_id</code> 字段上设置<code translate="no">is_partition_key=True</code> ，Milvus 就会自动将查询路由到正确的分区。没有 Collections 扩展，没有手动路由代码。</p>
<p>在我们对 100 个租户的 1000 万向量进行的基准测试中，与未优化的基准相比，采用聚类压缩技术的 Milvus 的<strong>QPS 提高了 3-5 倍</strong>。</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">混合检索</h3><p>纯向量搜索无法精确匹配内容-产品 SKU，如<code translate="no">SKU-2024-X5</code> 、版本字符串或特定术语。</p>
<p>Milvus 2.5 原生支持<a href="https://milvus.io/docs/multi-vector-search.md">混合检索</a>：稠密向量用于语义相似性，稀疏向量用于 BM25 类型的关键字匹配，标量元数据过滤--所有这些都在一次查询中完成。查询结果使用互易等级融合（RRF）进行融合，因此您无需构建和合并单独的检索管道。</p>
<p>在 100 万向量数据集上，Milvus Sparse-BM25 检索延迟为<strong>6 毫秒</strong>，对端到端 CRAG 性能的影响可以忽略不计。</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">灵活的 Schema 适用于不断发展的内存</h3><p>随着 CRAG 管道的成熟，数据模型也会随之发展。我们需要添加<code translate="no">confidence</code> 、<code translate="no">verified</code> 和<code translate="no">source</code> 等字段，同时迭代评估逻辑。在大多数数据库中，这意味着迁移脚本和停机时间。</p>
<p>Milvus 支持动态 JSON 字段，因此可以在不中断服务的情况下动态配置元数据。</p>
<p>下面是一个典型的 Schema：</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 还简化了部署扩展。它提供<a href="https://milvus.io/docs/install-overview.md">精简版、独立版和分布式模式</a>，这些模式与代码兼容--从本地开发集群切换到生产集群只需更改连接字符串。</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">上手操作：使用 LangGraph 中间件和 Milvus 构建 CRAG 系统<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">为什么采用中间件方法？</h3><p>使用 LangGraph 构建 CRAG 的常见方法是用节点和边连接状态图，控制每个步骤。这种方法可行，但随着复杂度的增加，状态图会变得纠缠不清，调试也会变得令人头疼。</p>
<p>我们最终选择了 LangGraph 1.0 中的<strong>中间件模式</strong>。它在模型调用之前拦截请求，因此检索、评估和修正都在一个统一的地方处理。与状态图方法相比</p>
<ul>
<li><strong>代码更少：</strong>逻辑集中，而不是分散在图节点上</li>
<li><strong>更容易跟踪：</strong>控制流线性读取</li>
<li><strong>更易于调试：</strong>故障指向单一位置，而不是图遍历</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">核心工作流程</h3><p>管道运行分为四个步骤</p>
<ol>
<li><strong>检索：</strong>从 Milvus 抓取前 3 个相关文档，并将其范围扩展到当前租户</li>
<li><strong>评估：</strong>使用轻量级模型评估文档质量</li>
<li><strong>修正：</strong>根据评估结果进行完善、补充网络搜索或完全回退</li>
<li><strong>注入：</strong>通过动态系统提示将最终确定的上下文传递给模型</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">环境设置和数据准备</h3><p><strong>环境变量</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>创建 Milvus Collections</strong></p>
<p>在运行代码之前，请在 Milvus 中创建一个具有与检索逻辑相匹配的 Schema 的 Collections。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>版本说明：</strong>本代码使用了 LangGraph 和 LangChain 中最新的中间件功能。这些 API 可能会随着框架的发展而改变--请查看<a href="https://langchain-ai.github.io/langgraph/">LangGraph 文档</a>了解最新用法。</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">关键模块</h3><p><strong>1.生产级评估器设计</strong></p>
<p>上面代码中的<code translate="no">_evaluate_relevance()</code> 方法是为了快速测试而特意简化的。对于生产，您需要具有置信度评分和可解释性的结构化输出：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.知识完善和回退</strong></p>
<p>三种机制共同作用以保持模型上下文的高质量：</p>
<ul>
<li><strong>知识提炼</strong>可以提取与查询最相关的句子，并去除噪音。</li>
<li>当本地检索不足时，会触发<strong>回退搜索</strong>，通过 Tavily 吸收外部知识。</li>
<li>在到达模型之前，<strong>上下文合并</strong>将内部记忆与外部结果合并为一个单一的重复上下文块。</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">在生产中运行 CRAG 的技巧<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦超越原型设计，有三个方面最为重要。</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1.成本：选择正确的评估器</h3><p>评估器在每个查询中都要运行，因此是影响延迟和成本的最大因素。</p>
<ul>
<li><strong>高并发工作负载：</strong>微调的轻量级模型（如 T5-Large）可将延迟保持在 10-20 毫秒，且成本可预测。</li>
<li><strong>低流量或原型设计：</strong> <code translate="no">gpt-4o-mini</code> 等托管模型的设置速度更快，需要的操作符更少，但延迟和每次呼叫成本较高。</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2.可观察性：从第一天起就使用仪器</h3><p>最难解决的生产问题是那些在答案质量已经下降时才会出现的问题。</p>
<ul>
<li><strong>基础设施监控：</strong>Milvus 与<a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a> 集成。从三个指标开始：<code translate="no">milvus_query_latency_seconds</code>、<code translate="no">milvus_search_qps</code> 和<code translate="no">milvus_insert_throughput</code> 。</li>
<li><strong>应用程序监控：</strong>跟踪 CRAG 判决分布、网络搜索触发率和置信度得分分布。如果没有这些信号，你就无法判断质量下降是由糟糕的检索还是评估者的误判造成的。</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3.长期维护：防止内存污染</h3><p>Agents 运行时间越长，内存中积累的陈旧和低质量数据就越多。及早设置防护栏：</p>
<ul>
<li><strong>预过滤：</strong>只让<code translate="no">confidence &gt; 0.7</code> 的内存浮出水面，这样低质量的内容在到达评估器之前就会被拦截。</li>
<li><strong>时间衰减：</strong>逐步降低旧内存的权重。30 天是一个合理的起始默认值，可根据用例进行调整。</li>
<li><strong>定时清理：</strong>每周执行一次任务，清除可信度低、未经验证的旧记忆。这样可以防止陈旧数据被检索、使用和重新存储的反馈循环。</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">总结--以及一些常见问题<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG 解决了生产 RAG 中最顽固的问题之一：检索结果看似相关，实则不相关。通过在检索和生成之间插入一个评估和修正步骤，它可以过滤掉不良结果，填补外部搜索的空白，并为模型提供更清晰的工作环境。</p>
<p>不过，要让 CRAG 在生产中可靠地工作，需要的不仅仅是良好的检索逻辑。它需要一个能处理多租户隔离、混合搜索和不断发展的 Schema 的向量数据库，而这正是<a href="https://milvus.io/intro">Milvus</a>的优势所在。在应用方面，选择正确的评估器、尽早检测可观察性并积极管理内存质量，是将演示与值得信赖的系统区分开来的关键。</p>
<p>如果您正在构建 RAG 或 Agents 系统，并遇到检索质量问题，我们很乐意为您提供帮助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，提出问题，分享您的架构，并向解决类似问题的其他开发人员学习。</li>
<li><a href="https://milvus.io/office-hours">预约 20 分钟的免费 Milvus Office Hours 会议</a>，与团队一起讨论您的使用案例--无论是 CRAG 设计、混合检索还是多租户扩展。</li>
<li>如果您想跳过基础架构设置，直接开始构建，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（Milvus 托管）提供免费层级供您开始使用。</li>
</ul>
<hr>
<p>团队开始实施 CRAG 时经常会遇到的几个问题：</p>
<p><strong>CRAG 与在 RAG 中添加 Reranker 有什么不同？</strong></p>
<p>Reranker 会根据相关性对结果重新排序，但仍然假定检索到的文档是可用的。CRAG 则更进一步--它会评估检索到的内容是否真正回答了查询，如果没有回答，就会采取纠正措施：完善部分匹配、使用网络搜索进行补充，或者完全丢弃结果。这是一个质量控制循环，而不仅仅是更好的排序。</p>
<p><strong>为什么高相似度得分有时会返回错误的文档？</strong></p>
<p>Embeddings 相似性衡量的是向量空间中的语义接近度，但这并不等于回答了问题。关于在 Apache 上配置 HTTPS 的文档与关于在 Nginx 上配置 HTTPS 的问题在语义上很接近，但却无济于事。CRAG 通过评估与实际查询的相关性，而不仅仅是向量距离，来解决这个问题。</p>
<p><strong>CRAG 的向量数据库应具备哪些条件？</strong></p>
<p>最重要的有三点：混合检索（因此您可以将语义搜索与精确术语的关键字匹配结合起来）、多租户隔离（因此每个用户或代理会话都有自己的内存空间）和灵活的 Schema（因此您可以添加<code translate="no">confidence</code> 或<code translate="no">verified</code> 等字段，而不会随着管道的发展而停机）。</p>
<p><strong>当检索到的文档都不相关时该怎么办？</strong></p>
<p>CRAG 不会就此放弃。当置信度低于 0.5 时，它会返回网络搜索。当结果模棱两可（0.5-0.9）时，它会将精炼的内部文档与外部搜索结果合并。即使在知识库存在空白的情况下，模型也总能获得一些背景信息。</p>
