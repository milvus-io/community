---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: Milvus 2.6 中的词组匹配与泔水：如何提高词组级全文搜索的准确性
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: 了解 Milvus 2.6 中的短语匹配功能如何支持带斜率的短语级全文搜索，从而为实际生产实现更宽容的关键字过滤。
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>随着非结构化数据的持续爆炸式增长和人工智能模型的不断智能化，向量搜索已成为许多人工智能系统--RAG 管道、人工智能搜索、Agent、推荐引擎等的默认检索层。它之所以有效，是因为它能捕捉到意义：不仅仅是用户输入的字词，还有它们背后的意图。</p>
<p>然而，一旦这些应用投入生产，团队往往会发现语义理解只是检索问题的一个方面。许多工作负载还依赖于严格的文本规则，例如匹配准确的术语、保留词序或识别具有技术、法律或操作符意义的短语。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a>通过直接在向量数据库中引入本机全文搜索，消除了这种分裂。通过在核心引擎中内置标记和位置索引，Milvus 可以解释查询的语义意图，同时执行精确的关键字和短语级约束。这样就形成了一个统一的检索管道，在这个管道中，意义和结构相互促进，而不是各自为政。</p>
<p><a href="https://milvus.io/docs/phrase-match.md">短语匹配</a>是这种全文功能的关键部分。它可以识别按顺序一起出现的术语序列--这对于检测日志模式、错误签名、产品名称以及任何词序定义意义的文本至关重要。在这篇文章中，我们将解释<a href="https://milvus.io/docs/phrase-match.md">短语匹配</a>在<a href="https://milvus.io/">Milvus</a> 中的工作原理，<code translate="no">slop</code> 如何增加现实世界文本所需的灵活性，以及为什么这些功能使向量-全文混合搜索不仅成为可能，而且在单个数据库中非常实用。</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">什么是短语匹配？<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>短语匹配是 Milvus 中的一种全文查询类型，侧重于<em>结构--具体来说</em>，是指文档中的一连串单词是否以相同的顺序出现。当不允许有任何灵活性时，查询就会严格执行：词语必须相邻并按顺序出现。因此，像<strong>"机器人机器学习 "</strong>这样的查询只有在这三个词作为连续短语出现时才会匹配。</p>
<p>问题在于，真实文本很少有如此严谨的表现。自然语言会带来噪音：额外的形容词会溜进来，日志会对字段重新排序，产品名称会增加修饰词，而且人类作者在写作时并没有考虑到查询引擎。严格的短语匹配很容易被破坏--插入的一个词、一个重新措辞或一个交换的术语都可能导致匹配失败。而在许多人工智能系统中，尤其是面向生产的系统中，漏掉相关的日志行或规则触发短语是不可接受的。</p>
<p>Milvus 2.6 通过一个简单的机制解决了这一摩擦："<strong>泔水</strong>"。<em>回旋余地</em>定义了<em>查询</em>词<em>之间允许的回旋余地</em>。您可以决定是否允许多出一个词或两个词，甚至是否允许轻微的重新排序也算作匹配，而不是将短语视为脆弱而不灵活的。这就将短语搜索从二进制的 "通过-失败 "测试转变为一种可控、可调整的检索工具。</p>
<p>要理解这一点的重要性，可以想象一下搜索日志，查找我们熟悉的网络错误<strong>"连接被对等重置 "的</strong>所有变体<strong>。</strong>实际上，你的日志可能是这样的</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>一目了然，所有这些都代表着同一个基本事件。但常见的检索方法却很难做到这一点：</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 在结构上有困难。</h3><p>它将查询视为一袋关键字，忽略了关键字出现的顺序。只要 "连接 "和 "对等 "出现在某个地方，BM25 就会把文档排在前面--即使这个短语是颠倒的或与你实际搜索的概念无关。</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">向量搜索难以应对各种限制。</h3><p>Embeddings 擅长捕捉意义和语义关系，但它们无法强制执行 "这些词必须以这种顺序出现 "这样的规则。您可能会检索到语义相关的信息，但仍会错过调试或合规所需的确切结构模式。</p>
<p>短语匹配法填补了这两种方法之间的空白。通过使用<strong>"斜率"</strong>，你可以精确地指定可接受的变化程度：</p>
<ul>
<li><p><code translate="no">slop = 0</code> - 完全匹配（所有术语必须按顺序连续出现。）</p></li>
<li><p><code translate="no">slop = 1</code> - 允许多一个词（用一个插入词涵盖常见的自然语言变化。）</p></li>
<li><p><code translate="no">slop = 2</code> - 允许插入多个词（处理更多描述性或冗长的措辞。）</p></li>
<li><p><code translate="no">slop = 3</code> - 允许重新排序（支持顺序颠倒或松散的短语，这通常是现实世界文本中最难处理的情况。）</p></li>
</ul>
<p>与希望评分算法 "正确 "相比，您可以明确声明您的应用程序所需的结构容差。</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">短语匹配在 Milvus 中的工作原理<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 中的短语匹配由<a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>搜索引擎库提供支持，是在带有位置信息的倒排索引基础上实现的。它不只是检查术语是否出现在文档中，而是验证它们是否以正确的顺序出现，并且距离在可控范围内。</p>
<p>下图说明了这一过程：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1.文档标记化（带位置）</strong></p>
<p>当文档插入 Milvus 时，文本字段由<a href="https://milvus.io/docs/analyzer-overview.md">分析器</a>处理，<a href="https://milvus.io/docs/analyzer-overview.md">分析器</a>将文本分割成标记（单词或术语），并记录每个标记在文档中的位置。例如，<code translate="no">doc_1</code> 被标记为：<code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2.创建倒排索引</strong></p>
<p>接下来，Milvus 会建立一个倒排索引。倒排索引不是将文档映射到文档内容，而是将每个标记映射到出现该标记的文档，以及该标记在每个文档中的所有记录位置。</p>
<p><strong>3.短语匹配</strong></p>
<p>当执行短语查询时，Milvus 首先使用倒排索引来识别包含所有查询标记的文档。然后，它通过比较标记位置来验证每个候选词，以确保术语出现的顺序正确，且距离在允许的<code translate="no">slop</code> 范围内。只有满足这两个条件的文档才会作为匹配文档返回。</p>
<p>下图总结了短语匹配的端到端工作方式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">如何在 Milvus 启用词组匹配功能<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>短语匹配适用于以下类型的字段 <strong><code translate="no">VARCHAR</code></strong>，即 Milvus 中的字符串类型。要使用它，必须配置 Collections Schema，以便 Milvus 执行文本分析并存储字段的位置信息。这需要启用两个参数：<code translate="no">enable_analyzer</code> 和<code translate="no">enable_match</code> 。</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">设置 enable_analyzer 和 enable_match</h3><p>要打开特定 VARCHAR 字段的短语匹配，请在定义字段 Schema 时将这两个参数设置为<code translate="no">True</code> 。这两个参数会告诉 Milvus</p>
<ul>
<li><p><strong>标记</strong>文本（通过<code translate="no">enable_analyzer</code> ），并</p></li>
<li><p><strong>使用位置偏移建立反向索引</strong>（通过<code translate="no">enable_match</code> ）。</p></li>
</ul>
<p>短语匹配依赖于这两个步骤：分析器将文本分解为标记，匹配索引存储这些标记出现的位置，从而实现高效的短语和基于斜线的查询。</p>
<p>以下是在<code translate="no">text</code> 字段上启用短语匹配的 Schema 配置示例：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">使用短语匹配搜索：泔水如何影响候选集<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>为 Collections 模式中的 VARCHAR 字段启用匹配后，就可以使用<code translate="no">PHRASE_MATCH</code> 表达式执行短语匹配。</p>
<p>注意：<code translate="no">PHRASE_MATCH</code> 表达式不区分大小写。可以使用<code translate="no">PHRASE_MATCH</code> 或<code translate="no">phrase_match</code> 。</p>
<p>在搜索操作中，短语匹配通常在向量相似性排序之前应用。它首先根据明确的文本限制过滤文档，缩小候选集的范围。然后使用向量嵌入重新对剩余的文档进行排序。</p>
<p>下面的示例展示了不同的<code translate="no">slop</code> 值对这一过程的影响。通过调整<code translate="no">slop</code> 参数，您可以直接控制哪些文档通过了短语过滤器并进入向量排序阶段。</p>
<p>假设你有一个名为<code translate="no">tech_articles</code> 的 Collections，其中包含以下五个实体：</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>文本</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>机器学习提高了大规模数据分析的效率</td></tr>
<tr><td>2</td><td>学习基于机器的方法对现代人工智能的进步至关重要</td></tr>
<tr><td>3</td><td>深度学习机器架构优化计算负荷</td></tr>
<tr><td>4</td><td>机器迅速提高持续学习的模型性能</td></tr>
<tr><td>5</td><td>学习先进的机器算法，扩展人工智能能力</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>在此，我们允许 1 的斜率。该过滤器适用于包含 "学习机器 "短语的文档，并略有灵活性。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>匹配结果：</p>
<table>
<thead>
<tr><th>doc_id</th><th>文本</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>学习基于机器的方法对现代人工智能的进步至关重要</td></tr>
<tr><td>3</td><td>深度学习机器架构优化计算负荷</td></tr>
<tr><td>5</td><td>学习先进的机器算法可扩展人工智能能力</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>本示例允许 2 的斜率，即在 "机器 "和 "学习 "之间允许最多两个额外的词块（或反义词）。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>匹配结果：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>文本</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">机器学习提高了大规模数据分析的效率</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">深度学习机器架构优化计算负载</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>在本例中，3 的斜率提供了更大的灵活性。过滤器搜索 "机器学习"，单词之间最多允许有三个标记位置。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>匹配结果：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>文本</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">机器学习提高了大规模数据分析的效率</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">学习基于机器的方法对现代人工智能的进步至关重要</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">深度学习机器架构优化计算负荷</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">学习先进的机器算法可扩展人工智能能力</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">快速提示：在 Milvus 中启用短语匹配前需要了解的信息<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>短语匹配支持短语级过滤，但启用短语匹配涉及的不仅仅是查询时的配置。在生产环境中应用前，了解相关注意事项很有帮助。</p>
<ul>
<li><p>在字段上启用短语匹配会创建一个反向索引，从而增加存储空间的使用。具体成本取决于文本长度、唯一标记数和分析器配置等因素。在处理大型文本字段或高 Cardinal 性数据时，应预先考虑这一开销。</p></li>
<li><p>分析器配置是另一个关键的设计选择。一旦在 Collections Schema 中定义了分析器，就不能更改。以后要切换到不同的分析器，就必须放弃现有的 Collections，然后用新的 Schema 重新创建。因此，分析器的选择应被视为一项长期决策，而不是实验。</p></li>
<li><p>短语匹配行为与文本的标记化方式密切相关。在将分析器应用于整个 Collections 之前，建议使用<code translate="no">run_analyzer</code> 方法检查标记化输出，并确认其是否符合您的预期。这一步骤有助于避免细微的不匹配和意外的查询结果。有关详细信息，请参阅<a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">分析器概述</a>。</p></li>
</ul>
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
    </button></h2><p>短语匹配是一种核心全文搜索类型，可实现短语级和位置限制，而不是简单的关键字匹配。通过对标记顺序和邻近性进行操作，它提供了一种可预测的精确方法，可根据术语在文本中的实际出现方式过滤文档。</p>
<p>在现代检索系统中，短语匹配通常应用于基于向量的排序之前。它首先将候选集限制为明确满足所需短语或结构的文档。然后再使用向量搜索按语义相关性对这些结果进行排序。这种模式在日志分析、技术文档搜索和 RAG 管道等场景中尤为有效，因为在这些场景中，必须在考虑语义相似性之前执行文本限制。</p>
<p>Milvus 2.6 引入<code translate="no">slop</code> 参数后，短语匹配对自然语言变化的容忍度提高了，同时保留了其作为全文过滤机制的作用。这使得短语级约束更容易应用于生产检索工作流中。</p>
<p>请使用<a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">演示</a>脚本进行尝试，并探索<a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a>，了解短语感知检索如何与您的堆栈相匹配。</p>
<p>对最新版 Milvus 的任何功能有疑问或想深入了解？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
