---
id: >-
  tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
title: 更智能地标记，更好地检索：深入了解 Milvus 全文搜索分析器
author: Jack Li
date: 2025-10-16T00:00:00.000Z
desc: 探索 Milvus Analyzer 如何通过高效的标记化和过滤功能为混合人工智能检索提供动力，从而实现更快、更智能的全文检索。
cover: assets.zilliz.com/Milvus_Analyzer_2_ccde10876e.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_title: |
  A Deep Dive into Milvus Analyzer for Full-Text Search
meta_keywords: 'Milvus Analyzer, RAG, full-text search, vector database, tokenization'
origin: >-
  https://milvus.io/blog/tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
---
<p>现代人工智能应用非常复杂，很少是一维的。在很多情况下，单一的搜索方法无法单独解决现实世界中的问题。以推荐系统为例。它需要<strong>向量搜索</strong>来理解文本或图像背后的含义，需要<strong>元数据过滤</strong>来根据价格、类别或地点对结果进行细化，还需要<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md"> <strong>全文搜索</strong></a>来处理 "Nike Air Max "这样的直接查询。每种方法都能解决难题的不同部分，而实用的系统则依赖于所有这些方法的无缝协作。</p>
<p>Milvus 擅长向量搜索和元数据过滤，从 2.5 版开始，它引入了基于优化 BM25 算法的全文搜索。这一升级使人工智能搜索更智能、更准确，将语义理解与精确的关键词意图相结合。在<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> Milvus 2.6</a> 中，全文搜索的速度变得更快--是<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> Elasticsearch 性能的 4 倍</a>。</p>
<p>这项功能的核心是<strong>Milvus 分析器</strong>，它是将原始文本转换为可搜索标记的组件。正是它使 Milvus 能够高效地解释语言，并大规模地执行关键字匹配。在本篇文章的其余部分，我们将深入探讨 Milvus 分析器是如何工作的--以及为什么它是释放 Milvus 混合搜索全部潜力的关键。</p>
<h2 id="What-is-Milvus-Analyzer" class="common-anchor-header">什么是 Milvus 分析器？<button data-href="#What-is-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>要实现高效的全文搜索（无论是关键词匹配还是语义检索），第一步始终是相同的：将原始文本转化为系统可以理解、索引和比较的标记。</p>
<p><strong>Milvus 分析器</strong>负责处理这一步。它是一个内置的文本预处理和标记化组件，可将输入文本分解为离散的标记，然后对其进行规范化、清理和标准化，以确保在查询和文档之间进行一致的匹配。这一过程为准确、高性能的全文搜索和混合检索奠定了基础。</p>
<p>下面是 Milvus Analyzer 架构概览：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_5_8e0ec1dbdf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如图所示，Analyzer 有两个核心组件：<strong>Tokenizer</strong>和<strong>Filter</strong>。它们共同将输入文本转换为标记，并对其进行优化，以实现高效索引和检索。</p>
<ul>
<li><p><strong>标记符转换器</strong>：使用空白分割（Whitespace）、中文分词（Jieba）或多语言分词（ICU）等方法将文本分割成基本标记。</p></li>
<li><p><strong>过滤</strong>：通过特定转换处理词块。Milvus 包含一套丰富的内置过滤器，用于大小写规范化（Lowercase）、标点符号移除（Removepunct）、停止词过滤（Stop）、词干处理（Stemmer）和模式匹配（Regex）等操作。您可以连锁多个过滤器，以处理复杂的处理需求。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tokenizer_70a57e893c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 提供多种类型的分析器：三种内置选项（标准、英文和中文）、自定义分析器（您可以定义自己的分词器和过滤器组合）以及用于处理多语言文档的多语言分析器。处理流程简单明了：原始文本 → Tokenizer → 筛选器 → 标记。</p>
<h3 id="Tokenizer" class="common-anchor-header">标记符</h3><p>标记符是第一个处理步骤。它将原始文本分割成更小的标记（单词或子单词），正确的选择取决于您的语言和使用情况。</p>
<p>Milvus 目前支持以下类型的标记符：</p>
<table>
<thead>
<tr><th><strong>标记符</strong></th><th><strong>使用案例</strong></th><th><strong>描述</strong></th></tr>
</thead>
<tbody>
<tr><td>标准</td><td>英语和空格分隔语言</td><td>最常用的通用标记符；检测单词边界并进行相应分割。</td></tr>
<tr><td>空白</td><td>预处理最少的简单文本</td><td>只按空格分割；不处理标点或大小写。</td></tr>
<tr><td>Jieba（中文）</td><td>中文文本</td><td>基于字典和概率的标记器，可将连续的汉字拆分成有意义的词。</td></tr>
<tr><td>Lindera（JP/KR）</td><td>日语和韩语文本</td><td>使用 Lindera 形态分析进行有效分割。</td></tr>
<tr><td>ICU（多语言）</td><td>阿拉伯语等复杂语言和多语言场景</td><td>基于 ICU 库，支持跨 Unicode 的多语言标记化。</td></tr>
</tbody>
</table>
<p>创建 Collections Schema 时，特别是通过<code translate="no">analyzer_params</code> 参数定义<code translate="no">VARCHAR</code> 字段时，可以配置标记化器。换句话说，标记化器不是一个独立的对象，而是一个字段级配置。Milvus 会在插入数据时自动执行标记化和预处理。</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
       <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>   <span class="hljs-comment"># Configure Tokenizer here</span>
    }
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Filter" class="common-anchor-header">过滤</h3><p>如果标记器将文本分割开来，那么过滤器就会对剩下的文本进行细化。过滤器对标记符进行标准化、清理或转换，使其适合搜索。</p>
<p>常见的过滤器操作符包括规范大小写、删除停顿词（如 "the "和 "and"）、去除标点符号和应用词干（将 "running "还原为 "run"）。</p>
<p>Milvus 包含许多内置过滤器，可满足大多数语言处理需求：</p>
<table>
<thead>
<tr><th><strong>过滤器名称</strong></th><th><strong>功能</strong></th><th><strong>用例</strong></th></tr>
</thead>
<tbody>
<tr><td>小写</td><td>将所有标记转换为小写</td><td>对于英文搜索至关重要，可避免大小写不匹配</td></tr>
<tr><td>重音</td><td>将重音字符转换为 ASCII 字符</td><td>多语言场景（例如，"café" → "cafe")</td></tr>
<tr><td>只保留字母</td><td>只保留字母和数字</td><td>删除文本中的混合符号，如日志</td></tr>
<tr><td>Cncharonly</td><td>只保留汉字</td><td>清理中文语料库</td></tr>
<tr><td>Cnalphanumonly</td><td>只保留中文、英文和数字</td><td>中英文混合文本</td></tr>
<tr><td>长度</td><td>按长度过滤词块</td><td>删除过短或过长的标记词</td></tr>
<tr><td>停止</td><td>停顿词过滤</td><td>删除 "is "和 "the "等高频无意义词</td></tr>
<tr><td>分解词</td><td>拆分复合词</td><td>德语和荷兰语等经常出现复合词的语言</td></tr>
<tr><td>词干处理</td><td>词干处理</td><td>英语场景（如 &quot;studies &quot;和 &quot;studying&quot;→&quot;study</td></tr>
<tr><td>去除标点</td><td>删除标点符号</td><td>一般文本清理</td></tr>
<tr><td>重新输入</td><td>使用 regex 模式进行过滤或替换</td><td>自定义需求，如仅提取电子邮件地址</td></tr>
</tbody>
</table>
<p>过滤器的强大之处在于其灵活性--您可以根据自己的需要混合和匹配清理规则。对于英文搜索，典型的组合是小写 + 句号 +词干，以确保大小写一致、删除填充词并将词形规范化为词干。</p>
<p>对于中文搜索，您通常会将 Cncharonly + Stop 组合在一起，以获得更简洁、更精确的结果。配置过滤器的方法与配置标记符的方法相同，即通过字段模式中的<code translate="no">analyzer_params</code> 进行配置：</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
        <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
               <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
               <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
    }
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Analyzer-Types" class="common-anchor-header">分析器类型<button data-href="#Analyzer-Types" class="anchor-icon" translate="no">
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
    </button></h2><p>合适的分析器能使搜索更快、更经济。为满足不同需求，Milvus 提供三种类型：内置分析器、多语言分析器和自定义分析器。</p>
<h3 id="Built-in-Analyzer" class="common-anchor-header">内置分析器</h3><p>内置分析器是开箱即用的标准配置，适用于大多数常见情况。它们带有预定义的标记符和过滤器组合：</p>
<table>
<thead>
<tr><th><strong>名称</strong></th><th><strong>组件（令牌器+过滤器）</strong></th><th><strong>使用案例</strong></th></tr>
</thead>
<tbody>
<tr><td>标准</td><td>标准标记符 + 小写</td><td>一般用于英语或有空格限制的语言</td></tr>
<tr><td>英语</td><td>标准分词器 + 小写 + 停止 +词缀器</td><td>更高精度的英文搜索</td></tr>
<tr><td>中文</td><td>Jieba Tokenizer + Cnalphanumonly</td><td>自然分词的中文文本搜索</td></tr>
</tbody>
</table>
<p>对于直接的英文或中文搜索，这些内置分析器无需任何额外设置即可工作。</p>
<p>需要注意的是：标准分析器默认为英文设计。如果应用于中文文本，全文搜索可能不会返回任何结果。</p>
<h3 id="Multi-language-Analyzer" class="common-anchor-header">多语言分析器</h3><p>当您处理多种语言时，单个标记器往往无法处理所有问题。这就是多语言分析器的作用所在--它会根据每个文本的语言自动选择合适的标记符。以下是语言与标记符的映射关系：</p>
<table>
<thead>
<tr><th><strong>语言代码</strong></th><th><strong>使用的标记符号</strong></th></tr>
</thead>
<tbody>
<tr><td>英语</td><td>英语分析器</td></tr>
<tr><td>zh</td><td>杰巴</td></tr>
<tr><td>ja / ko</td><td>Lindera</td></tr>
<tr><td>ar</td><td>ICU</td></tr>
</tbody>
</table>
<p>如果您的数据集混合了英语、中文、日语、韩语甚至阿拉伯语，Milvus 可以在同一字段中进行处理。这大大减少了人工预处理的工作量。</p>
<h3 id="Custom-Analyzer" class="common-anchor-header">自定义分析器</h3><p>当内置分析器或多语言分析器不太适用时，Milvus 可让您构建自定义分析器。混合和匹配标记符号和过滤器，创建符合您需求的分析器。下面是一个例子：</p>
<pre><code translate="no">FieldSchema(
        name=<span class="hljs-string">&quot;text&quot;</span>,
        dtype=DataType.VARCHAR,
        max_length=<span class="hljs-number">512</span>,
        analyzer_params={
           <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;jieba&quot;</span>,  
            <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;cncharonly&quot;</span>, <span class="hljs-string">&quot;stop&quot;</span>]  <span class="hljs-comment"># Custom combination for mixed Chinese-English text</span>
        }
    )
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hands-on-Coding-with-Milvus-Analyzer" class="common-anchor-header">使用 Milvus 分析器实践编码<button data-href="#Hands-on-Coding-with-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>理论是有帮助的，但没有什么比完整的代码示例更有说服力。让我们通过 Python SDK 来了解如何在 Milvus 中使用分析器，包括内置分析器和多语言分析器。这些示例使用的是 Milvus v2.6.1 和 Pymilvus v2.6.1。</p>
<h3 id="How-to-Use-Built-in-Analyzer" class="common-anchor-header">如何使用内置分析器</h3><p>假设您想为英文文本搜索构建一个 Collection，在数据插入过程中自动处理标记化和预处理。我们将使用内置的英文分析器（相当于<code translate="no">standard + lowercase + stop + stemmer</code> ）。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

schema = client.create_schema()

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,                  <span class="hljs-comment"># Field name</span>
    datatype=DataType.INT64,          <span class="hljs-comment"># Integer data type</span>
    is_primary=<span class="hljs-literal">True</span>,                  <span class="hljs-comment"># Designate as primary key</span>
    auto_id=<span class="hljs-literal">True</span>                      <span class="hljs-comment"># Auto-generate IDs (recommended)</span>
)

schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">1000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    analyzer_params={
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
            <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
            <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
        },
    enable_match=<span class="hljs-literal">True</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,                   <span class="hljs-comment"># Field name</span>
    datatype=DataType.SPARSE_FLOAT_VECTOR  <span class="hljs-comment"># Sparse vector data type</span>
)

bm25_function = Function(
    name=<span class="hljs-string">&quot;text_to_vector&quot;</span>,            <span class="hljs-comment"># Descriptive function name</span>
    function_type=FunctionType.BM25,  <span class="hljs-comment"># Use BM25 algorithm</span>
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],       <span class="hljs-comment"># Process text from this field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>]     <span class="hljs-comment"># Store vectors in this field</span>
)

schema.add_function(bm25_function)

index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,        <span class="hljs-comment"># Field to index (our vector field)</span>
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,     <span class="hljs-comment"># Let Milvus choose optimal index type</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>          <span class="hljs-comment"># Must be BM25 for this feature</span>
)

COLLECTION_NAME = <span class="hljs-string">&quot;english_demo&quot;</span>

<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)  
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

client.create_collection(
    collection_name=COLLECTION_NAME,       <span class="hljs-comment"># Collection name</span>
    schema=schema,                         <span class="hljs-comment"># Our schema</span>
    index_params=index_params              <span class="hljs-comment"># Our search index configuration</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully created collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Prepare sample data</span>
sample_texts = [
    <span class="hljs-string">&quot;The quick brown fox jumps over the lazy dog&quot;</span>,
    <span class="hljs-string">&quot;Machine learning algorithms are revolutionizing artificial intelligence&quot;</span>,  
    <span class="hljs-string">&quot;Python programming language is widely used for data science projects&quot;</span>,
    <span class="hljs-string">&quot;Natural language processing helps computers understand human languages&quot;</span>,
    <span class="hljs-string">&quot;Deep learning models require large amounts of training data&quot;</span>,
    <span class="hljs-string">&quot;Search engines use complex algorithms to rank web pages&quot;</span>,
    <span class="hljs-string">&quot;Text analysis and information retrieval are important NLP tasks&quot;</span>,
    <span class="hljs-string">&quot;Vector databases enable efficient similarity searches&quot;</span>,
    <span class="hljs-string">&quot;Stemming reduces words to their root forms for better searching&quot;</span>,
    <span class="hljs-string">&quot;Stop words like &#x27;the&#x27;, &#x27;and&#x27;, &#x27;of&#x27; are often filtered out&quot;</span>
]

<span class="hljs-comment"># Insert data</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nInserting data...&quot;</span>)
data = [{<span class="hljs-string">&quot;text&quot;</span>: text} <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> sample_texts]

client.insert(
    collection_name=COLLECTION_NAME,
    data=data
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_texts)}</span> records&quot;</span>)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Tokenizer Analysis Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

test_text = <span class="hljs-string">&quot;The running dogs are jumping over the lazy cats&quot;</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nOriginal text: &#x27;<span class="hljs-subst">{test_text}</span>&#x27;&quot;</span>)

<span class="hljs-comment"># Use run_analyzer to show tokenization results</span>
analyzer_result = client.run_analyzer(
    texts=test_text,
    collection_name=COLLECTION_NAME,
    field_name=<span class="hljs-string">&quot;text&quot;</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Tokenization result: <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nBreakdown:&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- lowercase: Converts all letters to lowercase&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stop words: Filtered out [&#x27;of&#x27;, &#x27;to&#x27;] and common English stop words&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)&quot;</span>)

<span class="hljs-comment"># Full-text search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Full-Text Search Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

<span class="hljs-comment"># Wait for indexing to complete</span>
<span class="hljs-keyword">import</span> time
time.sleep(<span class="hljs-number">2</span>)

<span class="hljs-comment"># Search query examples</span>
search_queries = [
    <span class="hljs-string">&quot;jump&quot;</span>,           <span class="hljs-comment"># Test stem matching (should match &quot;jumps&quot;)</span>
    <span class="hljs-string">&quot;algorithm&quot;</span>,      <span class="hljs-comment"># Test exact matching</span>
    <span class="hljs-string">&quot;python program&quot;</span>, <span class="hljs-comment"># Test multi-word query</span>
    <span class="hljs-string">&quot;learn&quot;</span>          <span class="hljs-comment"># Test stem matching (should match &quot;learning&quot;)</span>
]

<span class="hljs-keyword">for</span> i, query <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_queries, <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery <span class="hljs-subst">{i}</span>: &#x27;<span class="hljs-subst">{query}</span>&#x27;&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
    
    <span class="hljs-comment"># Execute full-text search</span>
    search_results = client.search(
        collection_name=COLLECTION_NAME,
        data=[query],                    <span class="hljs-comment"># Query text</span>
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>],         <span class="hljs-comment"># Return original text</span>
        limit=<span class="hljs-number">3</span>                         <span class="hljs-comment"># Return top 3 results</span>
    )
    
    <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
        <span class="hljs-keyword">for</span> j, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_results[<span class="hljs-number">0</span>], <span class="hljs-number">1</span>):
            score = result[<span class="hljs-string">&quot;distance&quot;</span>]
            text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Result <span class="hljs-subst">{j}</span> (relevance: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>): <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No relevant results found&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search complete！&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<button class="copy-code-btn"></button></code></pre>
<p>输出： 英语</p>
<pre><code translate="no">Dropped existing collection: english_demo
Successfully created collection: english_demo

Inserting data...
Successfully inserted <span class="hljs-number">10</span> records

============================================================
Tokenizer Analysis Demo
============================================================

Original text: <span class="hljs-string">&#x27;The running dogs are jumping over the lazy cats&#x27;</span>
Tokenization result: [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;dog&#x27;</span>, <span class="hljs-string">&#x27;jump&#x27;</span>, <span class="hljs-string">&#x27;over&#x27;</span>, <span class="hljs-string">&#x27;lazi&#x27;</span>, <span class="hljs-string">&#x27;cat&#x27;</span>]

Breakdown:
- lowercase: Converts <span class="hljs-built_in">all</span> letters to lowercase
- stop words: Filtered out [<span class="hljs-string">&#x27;of&#x27;</span>, <span class="hljs-string">&#x27;to&#x27;</span>] <span class="hljs-keyword">and</span> common English stop words
- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)

============================================================
Full-Text Search Demo
============================================================

Query <span class="hljs-number">1</span>: <span class="hljs-string">&#x27;jump&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">2.0040</span>): The quick brown fox jumps over the lazy dog

Query <span class="hljs-number">2</span>: <span class="hljs-string">&#x27;algorithm&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Search engines use <span class="hljs-built_in">complex</span> algorithms to rank web pages

Query <span class="hljs-number">3</span>: <span class="hljs-string">&#x27;python program&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">3.7884</span>): Python programming language <span class="hljs-keyword">is</span> widely used <span class="hljs-keyword">for</span> data science projects

Query <span class="hljs-number">4</span>: <span class="hljs-string">&#x27;learn&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Deep learning models require large amounts of training data

============================================================
Search complete！
============================================================
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Use-Multi-language-Analyzer" class="common-anchor-header">如何使用多语言分析器</h3><p>当您的数据集包含多种语言（例如英语、中文和日语）时，您可以启用多语言分析器。Milvus 会根据每个文本的语言自动选择合适的标记符。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-keyword">import</span> time

<span class="hljs-comment"># Configure connection</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_demo&quot;</span>

<span class="hljs-comment"># Drop existing collection if present</span>
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)

<span class="hljs-comment"># Create schema</span>
schema = client.create_schema()

<span class="hljs-comment"># Add primary key field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Add language identifier field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;language&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">50</span>
)

<span class="hljs-comment"># Add text field with multi-language analyzer configuration</span>
multi_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,  <span class="hljs-comment"># Select analyzer based on language field</span>
    <span class="hljs-string">&quot;analyzers&quot;</span>: {
        <span class="hljs-string">&quot;en&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>  <span class="hljs-comment"># English analyzer</span>
        },
        <span class="hljs-string">&quot;zh&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;chinese&quot;</span>  <span class="hljs-comment"># Chinese analyzer</span>
        },
        <span class="hljs-string">&quot;jp&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,  <span class="hljs-comment"># Use ICU tokenizer for Japanese</span>
            <span class="hljs-string">&quot;filter&quot;</span>: [
                <span class="hljs-string">&quot;lowercase&quot;</span>,
                {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>,
                    <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;は&quot;</span>, <span class="hljs-string">&quot;が&quot;</span>, <span class="hljs-string">&quot;の&quot;</span>, <span class="hljs-string">&quot;に&quot;</span>, <span class="hljs-string">&quot;を&quot;</span>, <span class="hljs-string">&quot;で&quot;</span>, <span class="hljs-string">&quot;と&quot;</span>]
                }
            ]
        },
        <span class="hljs-string">&quot;default&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>  <span class="hljs-comment"># Default to ICU general tokenizer</span>
        }
    },
    <span class="hljs-string">&quot;alias&quot;</span>: {
        <span class="hljs-string">&quot;english&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;chinese&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, 
        <span class="hljs-string">&quot;japanese&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>,
        <span class="hljs-string">&quot;中文&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>,
        <span class="hljs-string">&quot;英文&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;日文&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>
    }
}

schema.add_field(
    field_name=<span class="hljs-string">&quot;text&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">2000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    multi_analyzer_params=multi_analyzer_params
)

<span class="hljs-comment"># Add sparse vector field for BM25</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    datatype=DataType.SPARSE_FLOAT_VECTOR
)

<span class="hljs-comment"># Define BM25 function</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>]
)

schema.add_function(bm25_function)

<span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Prepare multilingual test data</span>
multilingual_data = [
    <span class="hljs-comment"># English data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Artificial intelligence is revolutionizing technology industries worldwide&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Machine learning algorithms process large datasets efficiently&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Vector databases provide fast similarity search capabilities&quot;</span>},
    
    <span class="hljs-comment"># Chinese data  </span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工智能正在改变世界各行各业&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;机器学习算法能够高效处理大规模数据集&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;向量数据库提供快速的相似性搜索功能&quot;</span>},
    
    <span class="hljs-comment"># Japanese data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工知能は世界中の技術産業に革命をもたらしています&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;機械学習アルゴリズムは大量のデータセットを効率的に処理します&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;ベクトルデータベースは高速な類似性検索機能を提供します&quot;</span>},
]

client.insert(
    collection_name=COLLECTION_NAME,
    data=multilingual_data
)

<span class="hljs-comment"># Wait for BM25 function to generate vectors</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Waiting for BM25 vector generation...&quot;</span>)
client.flush(COLLECTION_NAME)
time.sleep(<span class="hljs-number">5</span>)
client.load_collection(COLLECTION_NAME)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nTokenizer Analysis:&quot;</span>)

test_texts = {
    <span class="hljs-string">&quot;en&quot;</span>: <span class="hljs-string">&quot;The running algorithms are processing data efficiently&quot;</span>,
    <span class="hljs-string">&quot;zh&quot;</span>: <span class="hljs-string">&quot;这些运行中的算法正在高效地处理数据&quot;</span>, 
    <span class="hljs-string">&quot;jp&quot;</span>: <span class="hljs-string">&quot;これらの実行中のアルゴリズムは効率的にデータを処理しています&quot;</span>
}

<span class="hljs-keyword">for</span> lang, text <span class="hljs-keyword">in</span> test_texts.items():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{lang}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">try</span>:
        analyzer_result = client.run_analyzer(
            texts=text,
            collection_name=COLLECTION_NAME,
            field_name=<span class="hljs-string">&quot;text&quot;</span>,
            analyzer_names=[lang]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → Analysis failed: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-comment"># Multi-language search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch Test:&quot;</span>)

search_cases = [
    (<span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;人工智能&quot;</span>),
    (<span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;機械学習&quot;</span>),
    (<span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;algorithm&quot;</span>),
]

<span class="hljs-keyword">for</span> lang, query <span class="hljs-keyword">in</span> search_cases:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n<span class="hljs-subst">{lang}</span> &#x27;<span class="hljs-subst">{query}</span>&#x27;:&quot;</span>)
    <span class="hljs-keyword">try</span>:
        search_results = client.search(
            collection_name=COLLECTION_NAME,
            data=[query],
            search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
            output_fields=[<span class="hljs-string">&quot;language&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>],
            limit=<span class="hljs-number">3</span>,
            <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;language == &quot;<span class="hljs-subst">{lang}</span>&quot;&#x27;</span>
        )
        
        <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
            <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> search_results[<span class="hljs-number">0</span>]:
                score = result[<span class="hljs-string">&quot;distance&quot;</span>]
                text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No results&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Error: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nComplete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>输出</p>
<pre><code translate="no"><span class="hljs-title class_">Waiting</span> <span class="hljs-keyword">for</span> <span class="hljs-title class_">BM25</span> vector generation...

<span class="hljs-title class_">Tokenizer</span> <span class="hljs-title class_">Analysis</span>:
<span class="hljs-attr">en</span>: <span class="hljs-title class_">The</span> running algorithms are processing data efficiently
  → [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;algorithm&#x27;</span>, <span class="hljs-string">&#x27;process&#x27;</span>, <span class="hljs-string">&#x27;data&#x27;</span>, <span class="hljs-string">&#x27;effici&#x27;</span>]
<span class="hljs-attr">zh</span>: 这些运行中的算法正在高效地处理数据
  → [<span class="hljs-string">&#x27;这些&#x27;</span>, <span class="hljs-string">&#x27;运行&#x27;</span>, <span class="hljs-string">&#x27;中&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;算法&#x27;</span>, <span class="hljs-string">&#x27;正在&#x27;</span>, <span class="hljs-string">&#x27;高效&#x27;</span>, <span class="hljs-string">&#x27;地&#x27;</span>, <span class="hljs-string">&#x27;处理&#x27;</span>, <span class="hljs-string">&#x27;数据&#x27;</span>]
<span class="hljs-attr">jp</span>: これらの実行中のアルゴリズムは効率的にデータを処理しています
  → [<span class="hljs-string">&#x27;これらの&#x27;</span>, <span class="hljs-string">&#x27;実行&#x27;</span>, <span class="hljs-string">&#x27;中の&#x27;</span>, <span class="hljs-string">&#x27;アルゴリズム&#x27;</span>, <span class="hljs-string">&#x27;効率&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;データ&#x27;</span>, <span class="hljs-string">&#x27;処理&#x27;</span>, <span class="hljs-string">&#x27;し&#x27;</span>, <span class="hljs-string">&#x27;てい&#x27;</span>, <span class="hljs-string">&#x27;ます&#x27;</span>]

<span class="hljs-title class_">Search</span> <span class="hljs-title class_">Test</span>:

zh <span class="hljs-string">&#x27;人工智能&#x27;</span>:
  <span class="hljs-number">3.300</span>: 人工智能正在改变世界各行各业

jp <span class="hljs-string">&#x27;機械学習&#x27;</span>:
  <span class="hljs-number">3.649</span>: 機械学習アルゴリズムは大量のデータセットを効率的に処理します

en <span class="hljs-string">&#x27;algorithm&#x27;</span>:
  <span class="hljs-number">2.096</span>: <span class="hljs-title class_">Machine</span> learning algorithms process large datasets efficiently

<span class="hljs-title class_">Complete</span>
<button class="copy-code-btn"></button></code></pre>
<p>此外，Milvus 还支持用于搜索的 language_identifier 标记符。它会自动检测给定文本的语言，这意味着语言字段是可选的。更多详情，请查看<a href="https://milvus.io/blog/how-milvus-26-powers-hybrid-multilingual-search-at-scale.md"> Milvus 2.6 如何大规模升级多语种全文搜索</a>。</p>
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
    </button></h2><p>Milvus 分析器将过去简单的预处理步骤变成了一个定义明确的模块化文本处理系统。它的设计以标记化和过滤为核心，让开发人员可以对语言的解释、清理和索引方式进行精细控制。无论您是在构建单一语言应用程序，还是在构建跨多种语言的全球 RAG 系统，分析器都能为全文搜索提供一致的基础。它是 Milvus 的一部分，悄无声息地使其他一切工作得更好。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
