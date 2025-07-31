---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: Milvus 2.6 如何大规模升级多语种全文搜索功能
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: Milvus 2.6 引入了全面革新的文本分析管道，为全文搜索提供全面的多语言支持。
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>现代人工智能应用越来越复杂。你不可能只用一种搜索方法就能解决问题。</p>
<p>以推荐系统为例--它们需要<strong>向量搜索</strong>来理解文本和图像的含义，需要<strong>元数据过滤</strong>来根据价格、类别或地点缩小搜索结果的范围，还需要<strong>关键词搜索</strong>来进行直接查询，如 "Nike Air Max"。每种方法都解决了问题的不同部分，而现实世界中的系统需要所有这些方法共同发挥作用。</p>
<p>搜索的未来不是在向量和关键词之间做出选择。而是将向量、关键词、过滤以及其他搜索类型结合在一起。这就是我们在一年前发布 Milvus 2.5 时开始在 Milvus 中构建<a href="https://milvus.io/docs/hybrid_search_with_milvus.md">混合搜索</a>的原因。</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">但全文搜索的工作方式不同<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>将全文搜索引入向量原生系统并非易事。全文搜索有其自身的挑战。</p>
<p>向量搜索可以捕捉文本的<em>语义</em>--将其转化为高维向量--而全文搜索则依赖于对<strong>语言结构的</strong>理解：单词是如何形成的，从哪里开始，在哪里结束，以及它们之间是如何关联的。例如，当用户用英语搜索 "跑鞋 "时，文本会经过几个处理步骤：</p>
<p><em>分割空白 → 小写 → 删除停止词 → 将 &quot;running &quot;改为 &quot;run&quot;。</em></p>
<p>为了正确处理这些问题，我们需要一个强大的<strong>语言分析器--</strong>它可以处理分词、词干、过滤等问题。</p>
<p>当我们在 Milvus 2.5 中引入<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">BM25 全文搜索</a>时，我们包含了一个可定制的分析器，它能很好地完成设计任务。您可以使用标记化器、标记过滤器和字符过滤器定义一个管道，为索引和搜索准备文本。</p>
<p>对于英语来说，这种设置相对简单。但如果要处理多种语言，情况就变得复杂了。</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">多语言全文搜索的挑战<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>多语言全文搜索带来了一系列挑战：</p>
<ul>
<li><p><strong>复杂语言需要特殊处理</strong>：中文、日文和韩文等语言的单词之间不使用空格。它们需要高级标记器将字符分割成有意义的单词。这些工具可能对单一语言很有效，但很少能同时支持多种复杂语言。</p></li>
<li><p><strong>即使是相似的语言也会发生冲突</strong>：英语和法语可能都使用空格来分隔单词，但一旦应用了特定语言的处理方法，如词干化或词素化，一种语言的规则就会干扰其他语言的规则。提高英语准确性的方法可能会扭曲法语查询，反之亦然。</p></li>
</ul>
<p>简而言之，<strong>不同的语言需要不同的分析器</strong>。尝试用英文分析器处理中文文本会导致失败--没有空格可以分割，而英文词干规则会破坏汉字。</p>
<p>底线是什么？在多语言数据集上使用单一的标记化器和分析器，几乎不可能确保在所有语言中实现一致、高质量的标记化。这直接导致搜索性能下降。</p>
<p>随着团队开始在 Milvus 2.5 中采用全文搜索，我们开始听到相同的反馈：</p>
<p><em>"这对我们的英文搜索来说非常完美，但我们的多语言客户支持单怎么办？"我们喜欢同时拥有向量和 BM25 搜索，但我们的数据集包括中文、日文和英文内容。""我们能否在所有语言中获得相同的搜索精度？</em></p>
<p>这些问题证实了我们在实践中已经看到的事实：全文搜索与向量搜索有着本质区别。语义相似性可以很好地跨语言进行搜索，但精确的文本搜索需要对每种语言的结构有深入的了解。</p>
<p>因此，<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>引入了全面改造的文本分析管道，并提供全面的多语言支持。这一新系统可自动为每种语言应用正确的分析器，从而在多语言数据集上实现准确、可扩展的全文检索，而无需手动配置或降低质量。</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Milvus 2.6 如何实现稳健的多语言全文搜索<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>经过广泛的研究和开发，我们建立了一整套功能来应对不同的多语言场景。每种方法都以自己的方式解决语言依赖问题。</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1.多语言分析器：通过控制实现精确</h3><p><a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>多语言分析器</strong></a>允许您为同一 Collections 中的不同语言定义不同的文本处理规则，而不是强制所有语言通过相同的分析管道。</p>
<p><strong>其工作原理如下：</strong>您可以配置特定语言的分析器，并在插入时用语言标记每个文档。在执行 BM25 搜索时，您可以指定使用哪种语言分析器进行查询处理。这可确保您的索引内容和搜索查询都能按照各自语言的最佳规则进行处理。</p>
<p><strong>非常适合</strong>您了解内容的语言并希望获得最高搜索精度的应用。例如跨国知识库、本地化产品目录或特定地区的内容管理系统。</p>
<p><strong>需求：</strong>您需要为每个文档提供语言元数据。目前仅适用于 BM25 搜索操作符。</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2.语言标识符标记器：自动语言检测</h3><p>我们知道，手动标记每篇内容并不总是切实可行的。<a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>语言识别标记器</strong></a>将自动语言检测直接引入文本分析管道。</p>
<p><strong>工作原理如下：</strong>这个智能标记器会分析输入的文本，使用复杂的检测算法检测其语言，并自动应用适当的特定语言处理规则。您可以使用多个分析器定义对其进行配置--每种语言一个，外加一个默认的备用分析器。</p>
<p>我们支持两种检测引擎：<code translate="no">whatlang</code> ，处理速度更快；<code translate="no">lingua</code> ，准确度更高。系统支持 71-75 种语言，具体取决于您选择的检测器。在索引和搜索过程中，标记符号生成器会根据检测到的语言自动选择正确的分析器，在检测不确定时会返回到默认配置。</p>
<p><strong>非常适合</strong>具有不可预测语言混合的动态环境、用户生成内容平台，或无法进行手动语言标记的应用。</p>
<p><strong>权衡：</strong>自动检测会增加处理延迟，在处理非常短的文本或混合语言内容时可能会遇到困难。但对于大多数实际应用而言，其便利性远远超过了这些限制。</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3.ICU 标记器通用基础</h3><p>如果觉得前两个选项过于繁琐，我们还有更简单的选择。我们在 Milvus 2.6 中新集成了<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> ICU（International Components for Unicode）令牌器</a>。ICU 已经存在了很长时间--它是一套成熟、广泛使用的库，可以处理大量语言和脚本的文本处理。最酷的是，它可以同时处理各种复杂和简单的语言。</p>
<p>老实说，ICU tokenizer 是一个不错的默认选择。它使用 Unicode 标准规则来分词，这使得它对数十种没有自己的专门标记符号器的语言都很可靠。如果你只需要一个功能强大、适用于多种语言的通用程序，ICU 就能满足你的需求。</p>
<p><strong>局限性：</strong>ICU 仍在单个分析器中工作，因此您的所有语言最终将共享相同的过滤器。想做特定语言的事情，比如词干化或词素化？你会遇到我们前面谈到的同样的冲突。</p>
<p><strong>它真正的亮点</strong>我们将 ICU 设置为多语言或语言标识符设置中的默认分析器。它基本上就是你处理未明确配置语言的智能安全网。</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">观看实际操作：上机演示<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>理论讲得够多了，让我们来学习一些代码！以下是如何使用<strong>pymilvus</strong>中的新多语言功能来构建多语言搜索 Collections。</p>
<p>我们将从定义一些可重复使用的分析器配置开始，然后通过<strong>两个完整的示例</strong>进行演示：</p>
<ul>
<li><p>使用<strong>多语言分析器</strong></p></li>
<li><p>使用<strong>语言标识符标记器</strong></p></li>
</ul>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">步骤 1：设置 Milvus 客户端</h3><p><em>首先，我们连接到 Milvus，设置一个 Collections 名称，并清理任何现有的 Collections 以重新开始。</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">第 2 步：为多种语言定义分析器</h3><p>接下来，我们定义一个带有特定语言配置的<code translate="no">analyzers</code> 字典。这些配置将用于稍后显示的两种多语言搜索方法。</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">方案 A：使用多语言分析器</h3><p>这种方法最适用于<strong>提前知道每个文档的语言的</strong>情况。在插入数据时，您可以通过专用的<code translate="no">language</code> 字段传递该信息。</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">使用多语言分析器创建 Collections</h4><p>我们将创建一个 Collection，其中<code translate="no">&quot;text&quot;</code> 字段根据<code translate="no">language</code> 字段值使用不同的分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">插入多语言数据并加载 Collections</h4><p>现在插入英语和日语文档。<code translate="no">language</code> 字段告诉 Milvus 使用哪个分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">运行全文搜索</h4><p>要进行搜索，请根据语言指定查询使用的分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">结果：</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">选项 B：使用语言标识符标记器</h3><p>这种方法无需手动处理语言。<strong>语言标识符标记器会</strong>自动检测每个文档的语言，并应用正确的分析器，无需指定<code translate="no">language</code> 字段。</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">使用语言标识符标记器创建 Collections</h4><p>在这里，我们创建一个 Collections，其中<code translate="no">&quot;text&quot;</code> 字段使用自动语言检测来选择正确的分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">插入数据并加载 Collections</h4><p>插入不同语言的文本，无需标注。Milvus 会自动检测并应用正确的分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">运行全文搜索</h4><p>最棒的是，搜索时<strong>无需指定分析器</strong>。标记器会自动检测查询语言，并应用正确的逻辑。</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">搜索结果</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Milvus 2.6 在使<strong>混合搜索</strong>更强大、更易用方面向前迈进了一大步，它将向量搜索与关键字搜索结合在一起，现在可以跨多种语言进行搜索。有了增强的多语言支持，无论<em>用户</em>使用哪种语言，您都可以开发出能理解<em>他们的</em> <em>意思</em>和<em>他们所说的话的</em>应用程序。</p>
<p>但这只是更新的一部分。Milvus 2.6 还带来了其他一些功能，使搜索更快、更智能、更易操作：</p>
<ul>
<li><p><strong>更好的查询匹配</strong>--使用<code translate="no">phrase_match</code> 和<code translate="no">multi_match</code> 进行更准确的搜索</p></li>
<li><p><strong>更快的 JSON 过滤</strong>--得益于新的 JSON 字段专用索引</p></li>
<li><p><strong>基于标量的排序</strong>--通过任何数值字段对结果进行排序</p></li>
<li><p><strong>高级 Rerankers</strong>- 使用模型或自定义评分逻辑对结果重新排序</p></li>
</ul>
<p>想了解 Milvus 2.6 的全部细节吗？请查看我们的最新文章：<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>介绍 Milvus 2.6：十亿规模的经济型向量搜索</strong></a><strong>。</strong></p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。</p>
