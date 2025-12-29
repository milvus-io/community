---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: 解锁真正的实体级检索：Milvus 中新的结构阵列和 MAX_SIM 功能
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/Array_of_Structs_new_cover_1_d742c413ab.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: 了解 Milvus 中的结构数组和 MAX_SIM 如何实现多向量数据的真正实体级搜索，消除重复计算并提高检索准确性。
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>如果您在向量数据库之上构建了人工智能应用程序，您可能会遇到同样的痛点：数据库检索的是单个块的 Embeddings，但您的应用程序关心的是<strong><em>实体</em>。</strong>这种不匹配使整个检索工作流程变得复杂。</p>
<p>您可能已经看到这种情况一再发生：</p>
<ul>
<li><p><strong>RAG 知识库：</strong>文章被分块成段落嵌入，因此搜索引擎返回的是零散的片段而不是完整的文档。</p></li>
<li><p><strong>电子商务推荐：</strong>一个产品有多个图片嵌入，而您的系统返回的是同一商品的五个角度，而不是五个独特的产品。</p></li>
<li><p><strong>视频平台：</strong>视频被分割成片段嵌入，但搜索结果显示的是同一视频的片段，而不是单一的合并条目。</p></li>
<li><p><strong>ColBERT / ColPali 风格检索：</strong>文档扩展为数以百计的标记或片段级嵌入，而搜索结果却显示为仍需合并的小片段。</p></li>
</ul>
<p>所有这些问题都源于<em>相同的架构缺陷</em>：大多数向量数据库都将每个嵌入作为一个独立的行来处理，而实际应用操作的是更高层次的实体--文档、产品、视频、项目和场景。因此，工程团队不得不使用重复数据删除、分组、分块和 Rerankers 逻辑手动重构实体。这种方法虽然有效，但却脆弱、缓慢，而且会让应用层臃肿不堪，其中的逻辑本来就不应该存在。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a>通过一项新功能弥补了这一缺陷：具有<strong>MAX_SIM</strong>度量类型的<a href="https://milvus.io/docs/array-of-structs.md"><strong>结构数组</strong></a>。这两项功能结合在一起，可将单个实体的所有 Embdings 保存在一条记录中，并使 Milvus 能够对实体进行整体评分和返回。不再有重复填充的结果集。不再需要重排和合并等复杂的后处理工作</p>
<p>在本文中，我们将介绍结构数组（Array of Structs）和 MAX_SIM 的工作原理，并通过两个实际案例进行演示：维基百科文档检索和 ColPali 基于图像的文档搜索。</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">什么是结构数组？<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中，<strong>结构数组</strong>字段允许单条记录包含一个<em>有序的</em>Struct 元素<em>列表</em>，每个元素都遵循相同的预定义 Schema。一个 Struct 可以包含多个向量、标量字段、字符串或其他任何支持的类型。换句话说，它可以让你把属于一个实体的所有部分--段落嵌入、图像视图、标记向量、元数据--直接捆绑在一行中。</p>
<p>下面是一个集合实体的示例，其中包含一个 Array of Structs 字段。</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>在上面的示例中，<code translate="no">chunks</code> 字段是一个结构数组字段，每个结构元素都包含自己的字段，即<code translate="no">text</code> 、<code translate="no">text_vector</code> 和<code translate="no">chapter</code> 。</p>
<p>这种方法解决了向量数据库中一个长期存在的模型问题。传统上，每个 Embeddings 或属性都必须成为自己的一行，这就迫使<strong>多向量实体（文档、产品、视频）</strong>被分割成几十、几百甚至几千条记录。有了结构数组，Milvus 可让你在单个字段中存储整个多向量实体，使其自然适用于段落列表、标记嵌入、剪辑序列、多视图图像或一个逻辑项由多个向量组成的任何情况。</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">结构数组如何与 MAX_SIM 配合使用？<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>MAX_SIM</strong>是一种新的评分策略，它使语义检索具有实体感知能力。当收到查询时，Milvus 会将其与每个结构数组中的<em>每个</em>向量进行比较，并将<strong>最大相似度</strong>作为实体的最终得分。然后，实体将根据这个单一得分进行排序并返回。这就避免了向量数据库检索分散片段的典型问题，并将分组、去重和重新排序的工作推给了应用层。有了 MAX_SIM，实体级检索变得内置、一致和高效。</p>
<p>为了了解 MAX_SIM 在实践中是如何工作的，让我们举一个具体的例子。</p>
<p><strong>注：</strong>本例中的所有向量均由相同的 Embeddings 模型生成，相似度以 [0,1] 范围内的余弦相似度衡量。</p>
<p>假设用户搜索<strong>"机器学习初级课程"。</strong></p>
<p>查询被标记为三个<strong>标记</strong>：</p>
<ul>
<li><p><em>机器学习</em></p></li>
<li><p><em>初级</em></p></li>
<li><p><em>课程</em></p></li>
</ul>
<p>然后，每个 token 都会被用于文档的相同嵌入模型<strong>转换成一个</strong>嵌入<strong>向量</strong>。</p>
<p>现在，想象一下向量数据库包含两个文档：</p>
<ul>
<li><p><strong>doc_1:</strong> <em>Python 深度神经网络入门指南</em></p></li>
<li><p><strong>doc_2:</strong> <em>高级法学硕士论文阅读指南</em></p></li>
</ul>
<p>这两个文档都已被嵌入向量，并存储在一个结构数组（Array of Structs）内。</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>步骤 1：计算 doc_1 的 MAX_SIM</strong></h3><p>对于每个查询向量，Milvus 根据 doc_1 中的每个向量计算其余弦相似度：</p>
<table>
<thead>
<tr><th></th><th>简介</th><th>指南</th><th>深度神经网络</th><th>机器学习</th></tr>
</thead>
<tbody>
<tr><td>机器学习</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>初学者</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>课程</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>对于每个查询向量，MAX_SIM 会从其行中选择相似度<strong>最高的</strong>一个：</p>
<ul>
<li><p>机器学习 → 深度神经网络 (0.9)</p></li>
<li><p>初学者 → 入门 (0.8)</p></li>
<li><p>课程 → 指南 (0.7)</p></li>
</ul>
<p>将最佳匹配值相加，得出 doc_1 的<strong>MAX_SIM 分数为 2.4</strong>。</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">第 2 步：计算 doc_2 的 MAX_SIM 分数</h3><p>现在我们对 doc_2 重复上述过程：</p>
<table>
<thead>
<tr><th></th><th>高级</th><th>指导</th><th>LLM</th><th>论文</th><th>阅读</th></tr>
</thead>
<tbody>
<tr><td>机器学习</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>初学者</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>课程</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>doc_2 的最佳匹配是</p>
<ul>
<li><p>"machine learning" → "LLM" (0.9)</p></li>
<li><p>"beginner" → "guide" (0.6)</p></li>
<li><p>"course" → "guide" (0.8)</p></li>
</ul>
<p>将它们相加，doc_2 的<strong>MAX_SIM 得分为 2.3</strong>。</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">步骤 3：比较得分</h3><p>因为<strong>2.4 &gt; 2.3</strong>，所以<strong>doc_1 的排名高于 doc_2</strong>，这是很直观的，因为 doc_1 更接近机器学习入门指南。</p>
<p>从这个例子中，我们可以突出 MAX_SIM 的三个核心特征：</p>
<ul>
<li><p><strong>语义优先，而非基于关键词：</strong>MAX_SIM 比较的是 Embeddings，而不是文本字面。尽管<em>"机器学习 "</em>和<em>"深度神经网络 "</em>的重叠词为零，但它们的语义相似度为 0.9。这使得 MAX_SIM 对同义词、意译、概念重叠和现代嵌入式丰富的工作负载具有很强的鲁棒性。</p></li>
<li><p><strong>对长度和顺序不敏感：</strong>MAX_SIM 不要求查询和文档具有相同数量的向量（例如，doc_1 有 4 个向量，而 doc_2 有 5 个，两者都能正常工作）。它也不考虑向量的顺序--"初学者 "出现在查询的前面，而 "介绍 "出现在文档的后面对得分没有影响。</p></li>
<li><p><strong>每个查询向量都很重要：</strong>MAX_SIM 取每个查询向量的最佳匹配值，并将这些最佳得分相加。这样可以防止不匹配的向量影响结果，并确保每个重要的查询标记都对最终得分有贡献。例如，doc_2 中 "beginner "的低质量匹配会直接降低其总得分。</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">为什么 MAX_SIM + 结构数组在向量数据库中很重要<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>是一个开源的高性能向量数据库，它现在完全支持 MAX_SIM 和结构数组，从而实现了向量原生的实体级多向量检索：</p>
<ul>
<li><p><strong>原生存储多向量实体：</strong>Array of Structs 可以将相关向量组存储在单个字段中，而无需将它们分割到单独的行或辅助表中。</p></li>
<li><p><strong>高效的最佳匹配计算：</strong>结合 IVF 和 HNSW 等向量索引，MAX_SIM 可以计算最佳匹配，而无需扫描每个向量，即使是大型文档也能保持较高的性能。</p></li>
<li><p><strong>专为语义繁重的工作负载而设计：</strong>这种方法在长文本检索、多方面语义匹配、文档摘要对齐、多关键词查询以及其他需要灵活、细粒度语义推理的人工智能场景中表现出色。</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">何时使用结构数组<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>了解了<strong>结构数组</strong>的功能后，它的价值就一目了然了。该功能的核心是提供三种基本功能：</p>
<ul>
<li><p><strong>它将向量</strong>、标量、字符串、元数据等<strong>异构数据捆绑</strong>到一个结构化对象中。</p></li>
<li><p><strong>它使存储与现实世界的实体保持一致</strong>，因此数据库中的每一行都能清晰地映射到文章、产品或视频等实际项目。</p></li>
<li><p><strong>当与 MAX_SIM 等聚合函数相结合时</strong>，它可以直接从数据库中实现真正的实体级多向量检索，从而消除了应用层中的重复数据删除、分组或重排。</p></li>
</ul>
<p>由于具有这些特性，当一个<em>逻辑实体由多个向量表示</em>时，结构数组就自然而然地适用了。常见的例子包括分割成段落的文章、分解成标记嵌入的文档或由多个图像表示的产品。如果您的搜索结果存在重复命中、分散片段或同一实体多次出现在顶部结果中的问题，那么结构体数组就能在存储和检索层解决这些问题，而不是在应用程序代码中进行事后修补。</p>
<p>对于依赖于<strong>多向量检索的</strong>现代人工智能系统来说，这种模式尤其强大。 例如，ColBERT 将单个文档表示为一个<strong>数组</strong>：</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a>将单个文档表示为 100-500 个标记嵌入，用于法律文本和学术研究等跨领域的细粒度语义匹配。</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong>将 </a>每个 PDF 页面<a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy">转换成 </a>256-1024 个图像补丁，用于财务报表、合同、发票和其他扫描文档的跨模态检索。</p></li>
</ul>
<p>通过 Structs 数组，Milvus 可以将所有这些向量存储在一个实体下，并高效、原生地计算集合相似度（例如 MAX_SIM）。为了更清楚地说明这一点，下面是两个具体示例。</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">示例 1：电子商务产品搜索</h3><p>以前，具有多张图片的产品存储在一个平面 Schema 中，每行一张图片。一个产品的正面、侧面和斜面照片会产生三行。搜索结果往往会返回同一产品的多张图片，这就需要手动重复删除和重新排序。</p>
<p>使用结构数组后，每个产品都变成了<strong>一行</strong>。所有图片嵌入和元数据（角度、is_primary 等）都作为结构数组存在于<code translate="no">images</code> 字段中。Milvus 会理解它们属于同一个产品，并将产品作为一个整体返回，而不是单个图像。</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">示例 2：知识库或维基百科搜索</h3><p>以前，维基百科的一篇文章被分成<em>N 个</em>段落行。搜索结果会返回分散的段落，迫使系统将它们分组并猜测它们属于哪篇文章。</p>
<p>有了结构数组，整篇文章就变成了<strong>一行</strong>。所有段落及其 Embeddings 都被归类到一个段落字段下，数据库会返回整篇文章，而不是零散的片段。</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">实践教程：使用结构数组进行文档级检索<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1.维基百科文档检索</h3><p>在本教程中，我们将介绍如何使用<strong>结构数组（Array of Structs</strong>）将段落级数据转换为完整的文档记录，从而使 Milvus 能够执行<strong>真正的文档级检索</strong>，而不是返回孤立的片段。</p>
<p>许多知识库管道都将维基百科文章存储为段落块。这对于嵌入和索引来说效果很好，但却破坏了检索：用户查询通常会返回分散的段落，迫使你手动分组并重建文章。有了结构数组和 MAX_SIM，我们就可以重新设计存储模式，使<strong>每篇文章都成为一行</strong>，这样 Milvus 就能原生排序并返回整个文档。</p>
<p>在接下来的步骤中，我们将展示如何</p>
<ol>
<li><p>加载和预处理维基百科段落数据</p></li>
<li><p>将属于同一篇文章的所有段落打包成结构数组</p></li>
<li><p>将这些结构化文档插入 Milvus</p></li>
<li><p>运行 MAX_SIM 查询来检索完整的文章--干净利落，无需进行去重或 Rerankers。</p></li>
</ol>
<p>本教程结束时，你将拥有一个工作管道，Milvus 可以直接处理实体级检索，完全符合用户的期望。</p>
<p><strong>数据模型：</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 1 步：分组和转换数据</strong></p>
<p>在本演示中，我们使用<a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">简单维基百科 Embeddings</a>数据集。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 2 步：创建 Milvus Collections</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 3 步：插入数据并建立索引</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 4 步：搜索文档</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>比较输出结果：传统检索与结构数组对比</strong></p>
<p>当我们查看数据库实际返回的内容时，结构数组的影响就会很明显：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>维度</strong></th><th style="text-align:center"><strong>传统方法</strong></th><th style="text-align:center"><strong>结构数组</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>数据库输出</strong></td><td style="text-align:center">返回<strong>前 100 个段落</strong>（冗余度高）</td><td style="text-align:center">返回<em>前 10 个完整文档</em>- 干净准确</td></tr>
<tr><td style="text-align:center"><strong>应用逻辑</strong></td><td style="text-align:center">需要<strong>分组、重复数据删除和重排</strong>（复杂）</td><td style="text-align:center">无需后处理--实体级结果直接来自 Milvus</td></tr>
</tbody>
</table>
<p>在维基百科的例子中，我们只演示了最简单的情况：将段落向量组合成统一的文档表示。但 Array of Structs 的真正优势在于，它可以推广到<strong>任何</strong>多向量数据模型--包括经典检索管道和现代人工智能架构。</p>
<p><strong>传统的多向量检索场景</strong></p>
<p>许多成熟的搜索和推荐系统自然会对具有多个相关向量的实体进行操作符。Array of Structs 可以很方便地映射到这些用例中：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>场景</strong></th><th style="text-align:center"><strong>数据模型</strong></th><th style="text-align:center"><strong>每个实体的向量</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️<strong>电子商务产品</strong></td><td style="text-align:center">一个产品 → 多张图片</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center"><strong>视频搜索</strong></td><td style="text-align:center">一个视频 → 多个片段</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖<strong>纸张检索</strong></td><td style="text-align:center">一份论文 → 多个部分</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>人工智能模型工作量（关键多向量用例）</strong></p>
<p>在现代人工智能模型中，结构体阵列变得更加关键，这些模型有意为每个实体生成大量向量集，以进行细粒度语义推理。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>模型</strong></th><th style="text-align:center"><strong>数据模型</strong></th><th style="text-align:center"><strong>每个实体的向量</strong></th><th style="text-align:center"><strong>应用</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">一个文档 → 多个标记嵌入</td><td style="text-align:center">100-500</td><td style="text-align:center">法律文本、学术论文、细粒度文档检索</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">一个 PDF 页面 → 许多补丁嵌入</td><td style="text-align:center">256-1024</td><td style="text-align:center">财务报告、合同、发票、多模式文档搜索</td></tr>
</tbody>
</table>
<p>这些模型<em>需要</em>多向量存储模式。在使用结构数组（Array of Structs）之前，开发人员不得不跨行拆分向量，并手动将结果拼接在一起。有了 Milvus，现在可以原生存储和检索这些实体，并由 MAX_SIM 自动处理文档级评分。</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2.ColPali 基于图像的文档搜索</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a>是一个强大的跨模式 PDF 检索模型。它不依赖文本，而是将每个 PDF 页面作为图像处理，并将其切成多达 1024 个可视补丁，每个补丁生成一个嵌入。在传统的 Schema 数据库模式下，这需要将一个页面存储为数百或数千个独立的行，使数据库无法理解这些行属于同一个页面。因此，实体级搜索变得支离破碎且不切实际。</p>
<p>Array of Structs 将所有的 Embeddings 都存储<em>在一个字段中</em>，使 Milvus 能够将页面作为一个内聚的多向量实体来处理，从而干净利落地解决了这个问题。</p>
<p>传统的 PDF 搜索通常依赖于<strong>OCR</strong>，即把页面图像转换成文本。这种方法适用于纯文本，但会丢失图表、表格、布局和其他视觉线索。ColPali 通过直接处理页面图像，保留了所有视觉和文本信息，从而避免了这一限制。这样做的代价是规模问题：现在每个页面都包含数百个向量，这就需要一个能将众多 Embeddings 聚合为一个实体的数据库，而这正是 Array of Structs + MAX_SIM 所能提供的。</p>
<p>最常见的使用案例是<strong>Vision RAG</strong>，其中每个 PDF 页面都成为一个多向量实体。典型的应用场景包括</p>
<ul>
<li><p><strong>财务报告：</strong>在成千上万的 PDF 中搜索包含特定图表或表格的页面。</p></li>
<li><p><strong>合同：</strong>从扫描或拍照的法律文件中检索条款。</p></li>
<li><p><strong>发票：</strong>按供应商、金额或布局查找发票。</p></li>
<li><p><strong>演示文稿：</strong>查找包含特定数字或图表的幻灯片。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>数据模型：</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>第1步：准备数据</strong>关于ColPali如何将图像或文本转换成多向量表示法，你可以参考文档的详细介绍。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 2 步：创建 Milvus Collectionions</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>第3步：插入数据并建立索引</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 4 步：跨模态搜索：文本查询 → 图像结果</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>输出样本：</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>在这里，结果直接返回完整的 PDF 页面。我们不需要担心底层的 1024 补丁嵌入--Milvus 会自动处理所有的聚合。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>大多数向量数据库将每个片段存储为独立的记录，这意味着应用程序在需要完整的文档、产品或页面时必须重新组合这些片段。结构体数组改变了这种情况。通过将标量、向量、文本和其他字段组合到一个结构化对象中，它允许一条数据库记录端到端代表一个完整的实体。</p>
<p>其结果是简单而强大的：过去需要在应用层中进行复杂的分组、删除和重排的工作，现在变成了一种本地数据库功能。这正是向量数据库未来的发展方向--更丰富的结构、更智能的检索和更简单的管道。</p>
<p>有关结构数组和 MAX_SIM 的更多信息，请查看下面的文档：</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">结构数组 | Milvus 文档</a></li>
</ul>
<p>对最新 Milvus 的任何功能有疑问或想深入了解？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
