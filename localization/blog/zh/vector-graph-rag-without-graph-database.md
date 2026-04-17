---
id: vector-graph-rag-without-graph-database.md
title: 我们在没有图形数据库的情况下构建了图形 RAG
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: 开源向量图 RAG 仅使用 Milvus 就为 RAG 增加了多跳推理功能。87.8% Recall@5，每次查询调用 2 次 LLM，无需图形数据库。
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>简而言之：</em></strong> <em>Graph RAG 需要图形数据库吗？不需要。把实体、关系和通道放到 Milvus 中。用子图展开代替图遍历，用一个 LLM Rerankers 代替多轮 Agents 循环。这就是</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>向量图 RAG</em></strong></a><strong><em>，</em></strong> <em>也是我们所构建的。这种方法在三个多跳 QA 基准上达到了 87.8% 的平均 Recall@5，并在单个 Milvus 实例上击败了 HippoRAG 2。</em></p>
</blockquote>
<p>多跳问题是大多数 RAG 管道最终会遇到的难题。答案就在您的语料库中，但它跨越了由问题从未提及的实体连接的多个段落。常见的解决方法是添加图数据库，这意味着需要运行两个系统，而不是一个。</p>
<p>我们自己也经常遇到这种情况，不想为了处理这个问题而运行两个数据库。因此，我们创建并开源了<a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a>，这是一个 Python 库，只使用<a href="https://milvus.io/docs">Milvus</a>（最广泛采用的开源向量数据库）就能为<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>带来多跳推理功能。它用一个数据库而不是两个数据库提供了相同的多跳功能。</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">为什么多跳问题会破坏标准 RAG<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>多跳问题会破坏标准 RAG，因为答案取决于向量搜索无法看到的实体关系。连接问题和答案的桥梁实体往往不在问题本身中。</p>
<p>简单的问题可以正常运行。您可以对文档进行分块、嵌入、检索最匹配的文档，然后将它们输入 LLM。"Milvus 支持哪些索引？"就在一段话中，向量搜索就能找到它。</p>
<p>多跳问题不符合这种模式。在医学知识库中，有这样一个问题<em>："使用一线糖尿病药物应注意哪些副作用？</em></p>
<p>回答这个问题需要两个推理步骤。首先，系统必须知道二甲双胍是治疗糖尿病的一线药物。只有这样，系统才能查询二甲双胍的副作用：肾功能监测、消化道不适、维生素 B12 缺乏。</p>
<p>"二甲双胍 "是桥梁实体。它将问题与答案连接起来，但问题从未提到过它。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这就是<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性搜索的</a>终点。它能检索到与问题相似的段落、糖尿病治疗指南和药物副作用列表，但却无法跟踪将这些段落联系在一起的实体关系。像 "二甲双胍是治疗糖尿病的一线药物 "这样的事实存在于这些关系中，而不是任何单一段落的文本中。</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">为什么图数据库和 Agents RAG 不能解决问题？<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>解决多跳 RAG 的标准方法是图数据库和迭代 Agents 循环。这两种方法都有效。这两种方法的成本都比大多数团队希望为单一功能支付的费用要高。</p>
<p>首先走图形数据库路线。您可以从文档中提取三元组，将其存储到图数据库中，然后遍历边来查找多跳连接。这意味着要在<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>旁运行第二个系统，学习 Cypher 或 Gremlin，并保持图和向量存储同步。</p>
<p>迭代 Agents 循环是其他方法。LLM 会检索一个批次，对其进行推理，决定是否有足够的上下文，如果没有，则再次检索。<a href="https://arxiv.org/abs/2212.10509">IRCoT</a>（Trivedi 等人，2023 年）每次查询会调用 3-5 次 LLM。Agents 的 RAG 可能超过 10，因为由 Agents 决定何时停止。每次查询的成本变得不可预测，而且每当 Agents 运行额外的轮次时，P99 延迟就会激增。</p>
<p>这两种方法都不适合希望在不重建堆栈的情况下进行多跳推理的团队。因此，我们尝试了其他方法。</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">什么是向量图 RAG，向量数据库中的图结构<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>向量图 RAG</strong></a>是一个开源 Python 库，只需使用<a href="https://milvus.io/docs">Milvus</a> 就能为<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>带来多跳推理功能。它将图结构作为 ID 引用存储在三个 Milvus Collections 中。在 Milvus 中，遍历变成了一连串的主键查找，而不是针对图数据库的 Cypher 查询。一个 Milvus 可以完成这两项工作。</p>
<p>它之所以有效，是因为知识图谱中的关系只是文本。三重<em>（即二甲双胍，是治疗 2 型糖尿病的一线药物）</em>是图数据库中的有向边。它也是一个句子："二甲双胍是治疗 2 型糖尿病的一线药物"。您可以将这句话嵌入一个向量，并将其存储到<a href="https://milvus.io/docs">Milvus</a> 中，就像存储其他文本一样。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>回答多跳查询意味着要从查询提到的内容（如 "糖尿病"）到查询没有提到的内容（如 "二甲双胍"）之间建立联系。这只有在存储过程中保留了这些联系：哪个实体通过哪种关系连接到哪个实体时才能起作用。纯文本可搜索，但不可跟踪。</p>
<p>为了在 Milvus 中保持连接的可跟踪性，我们给每个实体和每个关系赋予一个唯一的 ID，然后把它们分别存储在不同的 Collections 中，这些 Collections 通过 ID 互相引用。总共有三个 Collections：<strong>实体</strong>（节点）、<strong>关系</strong>（边）和<strong>段落</strong>（源文本，LLM 生成答案时需要用到）。每一行都有一个向量嵌入，因此我们可以对三者中的任何一个进行语义搜索。</p>
<p><strong>实体</strong>存储重复的实体。每个实体都有一个唯一的 ID、一个用于<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>的<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>和一个它参与的关系 ID 列表。</p>
<table>
<thead>
<tr><th>ID</th><th>名称</th><th>Embeddings</th><th>关系 ID</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>二甲双胍</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>2 型糖尿病</td><td>[0.34, ...]</td><td>[0.34, ...] [R01, R04</td></tr>
<tr><td>e03</td><td>肾功能</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>关系</strong>存储知识三元组。每个关系都记录了它的主体和客体实体 ID、它来自的段落 ID 以及关系全文的 Embeddings。</p>
<table>
<thead>
<tr><th>ID</th><th>主题_id</th><th>对象 ID</th><th>文本</th><th>Embeddings</th><th>段落编号</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>二甲双胍是治疗 2 型糖尿病的一线药物</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>服用二甲双胍的患者应监测肾功能</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>段落</strong>存储原始文档块，并附有对从中提取的实体和关系的引用。</p>
<p>这三个 Collections 通过 ID 字段相互指向：实体携带其关系的 ID，关系携带其主体和客体实体及源段落的 ID，段落携带从中提取的所有内容的 ID。这个 ID 引用网络就是图。</p>
<p>遍历就是一连串的 ID 查找。你获取实体 e01，得到它的<code translate="no">relation_ids</code> ，通过这些 ID 获取关系 r01 和 r02，读取 r01 的<code translate="no">object_id</code> ，发现实体 e02，然后继续。每一步都是标准的 Milvus<a href="https://milvus.io/docs/get-and-scalar-query.md">主键查询</a>。不需要 Cypher。</p>
<p>你可能会问，到 Milvus 的额外往返次数是否会增加。其实不然。子图扩展需要花费 2-3 次基于 ID 的查询，总计 20-30 毫秒。而 LLM 调用只需 1-3 秒，这使得 ID 查询变得无足轻重。</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">向量图 RAG 如何回答多跳查询<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>检索流程分为四个步骤：<strong>种子检索 → 子图扩展 → LLM Rerankers → 生成</strong>答案。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们将讨论糖尿病问题：<em>"使用一线糖尿病药物应注意哪些副作用？</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">步骤 1：种子检索</h3><p>LLM 从问题中提取关键实体："糖尿病"、"副作用"、"一线药物"。Milvus 中的向量搜索可以直接找到最相关的实体和关系。</p>
<p>但二甲双胍并不在其中。问题中没有提到它，所以向量搜索找不到它。</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">第二步：子图展开</h3><p>这就是向量图 RAG 与标准 RAG 的不同之处。</p>
<p>系统从种子实体开始，一跳一跳地进行 ID 引用。它获取种子实体 ID，找到包含这些 ID 的所有关系，并将新实体 ID 拉入子图。默认：一跳。</p>
<p><strong>桥实体二甲双胍进入子图。</strong></p>
<p>"糖尿病 "有一个关系：<em>"二甲双胍是治疗 2 型糖尿病的一线药物。</em>沿着这条边，二甲双胍就进入了子图。一旦二甲双胍进入子图，它自己的关系也会随之而来：<em>"服用二甲双胍的患者应监测肾功能"、"二甲双胍可能导致胃肠道不适"、"长期服用二甲双胍可能导致维生素 B12 缺乏"。</em></p>
<p>两个原本在不同段落中存在的事实，现在通过图形扩展的一跳连接在了一起。问题从未提及的桥梁实体现在可以被发现了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">第 3 步：LLM Rerankers</h3><p>扩展后，你会发现几十个候选关系。大部分都是噪音。</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>系统将这些候选关系和原始问题发送给 LLM："哪些关系与糖尿病一线药物的副作用有关？这是一次没有迭代的调用。</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>所选关系涵盖整个链条：糖尿病 → 二甲双胍 → 肾脏监测/消化道不适/B12 缺乏症。</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">步骤 4：生成答案</h3><p>系统检索所选关系的原始段落并将其发送给 LLM。</p>
<p>LLM 从完整的段落文本中生成答案，而不是经过修剪的三元组。三元组是压缩摘要。它们缺乏 LLM 生成基础答案所需的上下文、注意事项和细节。</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">查看向量图 RAG 的运行情况</h3><p>我们还构建了一个交互式前端，可视化每个步骤。点击左侧的步骤面板，矢量图就会实时更新：橙色代表种子节点，蓝色代表扩展节点，绿色代表选定关系。这让检索流程变得具体而非抽象。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">为什么一次 Rerankers 胜过多次迭代<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>我们的管道对每个查询进行两次 LLM 调用：一次用于 Rerankers，一次用于生成。像 IRCoT 和 Agentsic RAG 这样的迭代系统会进行 3 到 10 次以上的调用，因为它们会循环：检索、推理、再检索。我们跳过了这个循环，因为向量搜索和子图扩展一次就能覆盖语义相似性和结构连接，从而使 Rerankers 有足够的候选对象来完成一次重排。</p>
<table>
<thead>
<tr><th>方法</th><th>每次查询的 LLM 调用</th><th>延迟情况</th><th>相对 API 成本</th></tr>
</thead>
<tbody>
<tr><td>向量图 RAG</td><td>2（Rerankers + 生成）</td><td>固定、可预测</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>可变</td><td>~2-3x</td></tr>
<tr><td>Agents RAG</td><td>5-10+</td><td>不可预测</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>在生产中，API 成本大约降低 60%，响应速度提高 2-3 倍，延迟可预测。当 Agents 决定运行额外回合时，不会出现意外峰值。</p>
<h2 id="Benchmark-Results" class="common-anchor-header">基准测试结果<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>向量图 RAG 在三个标准多跳 QA 基准中的平均 Recall@5 率为 87.8%，与我们测试的每种方法（包括只调用 Milvus 和 2 个 LLM 的 HippoRAG 2）相当或超过。</p>
<p>我们对 MuSiQue（2-4 跳，最难）、HotpotQA（2 跳，使用最广泛）和 2WikiMultiHopQA（2 跳，跨文档推理）进行了评估。衡量标准是 Recall@5：正确的支持段落是否出现在检索结果的前 5 位。</p>
<p>为了进行公平比较，我们使用了从<a href="https://github.com/OSU-NLP-Group/HippoRAG">HippoRAG 库中</a>预先提取的完全相同的三元组。没有重新提取，没有自定义预处理。这种比较只针对检索算法本身。</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">向量图 RAG</a>与标准（原始）RAG 的比较</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>向量图 RAG 将平均 Recall@5 从 73.4% 提高到 87.8%，提高了 19.6 个百分点。</p>
<ul>
<li>MuSiQue：提升幅度最大（+31.4 个百分点）。3-4 跳基准，最难的多跳问题，也正是子图扩展影响最大的问题。</li>
<li>2WikiMultiHopQA：大幅提升（+27.7 个百分点）。跨文档推理是子图扩展的另一个优势领域。</li>
<li>HotpotQA：提升幅度较小（+6.1pp），但标准 RAG 在此数据集上的得分率已达 90.8%。上限很低。</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">向量图 RAG</a>与最新方法 (SOTA) 的比较</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>向量图 RAG 与 HippoRAG 2、IRCoT 和 NV-Embed-v2 相比，平均得分最高，为 87.8%。</p>
<p>基准逐一对比</p>
<ul>
<li>HotpotQA: 平 HippoRAG 2 (均为 96.3%)</li>
<li>2WikiMultiHopQA：领先 3.7 个百分点（94.1% 对 90.4）</li>
<li>MuSiQue（最难）：落后 1.7 个百分点（73.0% 对 74.7）</li>
</ul>
<p>向量图 RAG 每次查询只需调用 2 次 LLM，不需要图形数据库，也不需要 ColBERTv2，就能获得这些数据。它运行在比较中最简单的基础架构上，但平均值仍然最高。</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">向量图 RAG</a>与其他图 RAG 方法的比较<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>不同的图形 RAG 方法针对不同的问题进行优化。Vector Graph RAG 专为生产型多跳 QA 而建，具有可预测的成本和简单的基础设施。</p>
<table>
<thead>
<tr><th></th><th>微软图形 RAG</th><th>HippoRAG 2</th><th>IRCoT / Agentsic RAG</th><th><strong>向量图 RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>基础架构</strong></td><td>图形 DB + 向量 DB</td><td>ColBERTv2 + 内存图</td><td>向量 DB + 多轮 Agents</td><td><strong>仅 Milvus</strong></td></tr>
<tr><td><strong>每次查询的 LLM 调用</strong></td><td>变化</td><td>中等</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>最适合</strong></td><td>全球语料库摘要</td><td>细粒度学术检索</td><td>复杂的开放式探索</td><td><strong>多跳生产质量保证</strong></td></tr>
<tr><td><strong>扩展问题</strong></td><td>昂贵的 LLM 索引</td><td>内存中的全图</td><td>不可预测的延迟和成本</td><td><strong>随 Milvus 扩展</strong></td></tr>
<tr><td><strong>设置复杂性</strong></td><td>高</td><td>中高</td><td>中</td><td><strong>低（pip 安装）</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a>使用分层社区聚类来回答全局摘要问题，例如'该语料库的主要主题是什么？这是与多跳 QA 不同的问题&quot;。</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a>（Gutierrez 等人，2025 年）使用认知启发检索与 ColBERTv2 标记级匹配。将整个图加载到内存中限制了可扩展性。</p>
<p><a href="https://arxiv.org/abs/2212.10509">IRCoT</a>等迭代方法以基础设施的简易性换取 LLM 成本和不可预测的延迟。</p>
<p>Vector Graph RAG 针对的是生产型多跳 QA：希望在不添加图数据库的情况下获得可预测成本和延迟的团队。</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">何时使用 Vector Graph RAG 和关键用例<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG 适用于四种工作负载：</p>
<table>
<thead>
<tr><th>场景</th><th>为何适合</th></tr>
</thead>
<tbody>
<tr><td><strong>知识密集型文档</strong></td><td>带有交叉引用的法律代码、带有药物-基因-疾病链的生物医学文献、带有公司-个人-事件链接的财务文件、带有API依赖图的技术文档</td></tr>
<tr><td><strong>2-4 跳问题</strong></td><td>单跳问题可与标准 RAG 配合使用。五跳或更多跳可能需要迭代方法。2-4 跳的范围是子图扩展的最佳点。</td></tr>
<tr><td><strong>简单部署</strong></td><td>一个数据库，一个<code translate="no">pip install</code> ，无需学习图基础架构</td></tr>
<tr><td><strong>成本和延迟敏感性</strong></td><td>每次查询调用两次 LLM，固定且可预测。在每天数千次查询的情况下，差额会逐渐增加。</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">开始使用向量图 RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> 默认使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>。它会创建一个本地<code translate="no">.db</code> 文件，就像 SQLite 一样。无需启动服务器，也无需配置。</p>
<p><code translate="no">add_texts()</code> RAG 调用 Rerankers 从文本中提取三元组，并将其向量化，然后将所有内容存储在 Milvus 中。<code translate="no">query()</code> 运行完整的四步检索流程：播种、扩展、重排、生成。</p>
<p>生产时，只需交换一个 URI 参数。其余代码保持不变：</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>导入 PDF、网页或 Word 文件：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>图形 RAG 不需要图形数据库。向量图 RAG 将图结构作为 ID 引用存储在三个 Milvus Collections 中，从而将图遍历转化为主键查找，并将每次多跳查询保持在固定的两次 LLM 调用。</p>
<p>一目了然：</p>
<ul>
<li>开源 Python 库。仅在 Milvus 上进行多跳推理。</li>
<li>通过 ID 链接的三个 Collections。实体（节点）、关系（边）、段落（源文本）。子图扩展根据 ID 发现查询未提及的桥实体。</li>
<li>每个查询调用两次 LLM。一次 Rerankers，一次生成。无迭代。</li>
<li>在 MuSiQue、HotpotQA 和 2WikiMultiHopQA 中的平均 Recall@5 率为 87.8%，在三项中的两项上与 HippoRAG 2 相匹敌或更胜一筹。</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">试试吧</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a>获取代码</li>
<li>完整 API 和示例的<a href="https://zilliztech.github.io/vector-graph-rag">文档</a></li>
<li><a href="https://slack.milvus.io/">在 Discord 上</a>加入<a href="https://slack.milvus.io/">Milvus</a> <a href="https://discord.com/invite/8uyFbECzPX">社区</a>，提出问题并分享反馈意见</li>
<li><a href="https://milvus.io/office-hours">预约 Milvus 办公时间</a>，了解您的使用案例</li>
<li>如果您想跳过基础架构设置，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>可提供托管 Milvus 的免费层级。</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">常见问题<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">我可以只用向量数据库做 Graph RAG 吗？</h3><p>可以。向量图 RAG 将知识图结构（实体、关系和它们之间的连接）存储在通过 ID 相互参照链接的三个 Milvus Collections 中。它不是遍历图数据库中的边，而是在 Milvus 中进行主键查询，以扩展种子实体周围的子图。这在三个标准多跳基准上实现了 87.8% 的平均 Recall@5，而无需任何图数据库基础架构。</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">向量图 RAG 与 Microsoft GraphRAG 相比有何不同？</h3><p>它们解决的问题不同。Microsoft GraphRAG 使用分层社区聚类来进行全局语料汇总（"这些文档的主要主题是什么？）向量图 RAG 侧重于多跳问题解答，其目标是在各段落中连锁特定事实。向量图 RAG 每个查询只需要 Milvus 和两次 LLM 调用。Microsoft GraphRAG 需要图形数据库，索引成本较高。</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">哪些类型的问题可以从多跳 RAG 中受益？</h3><p>多跳 RAG 有助于解决答案取决于连接分散在多个段落中的信息的问题，尤其是当关键实体从未在问题中出现时。例如，"一线糖尿病药物有哪些副作用？(需要发现二甲双胍作为桥梁）、法律或法规文本中的交叉引用查找，以及技术文档中的依赖链跟踪。标准 RAG 可以很好地处理单事实查询。当推理路径长达两到四步时，多跳 RAG 就会增加价值。</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">我需要手动提取知识图谱三元组吗？</h3><p>不需要。<code translate="no">add_texts()</code> 和<code translate="no">add_documents()</code> 会自动调用 LLM 提取实体和关系，将其向量化，并存储到 Milvus 中。你可以使用内置的<code translate="no">DocumentImporter</code> 从 URL、PDF 和 DOCX 文件导入文档。为了进行基准测试或迁移，该库支持从 HippoRAG 等其他框架导入预先提取的三元组。</p>
