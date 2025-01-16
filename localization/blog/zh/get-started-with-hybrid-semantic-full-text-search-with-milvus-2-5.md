---
id: get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
title: 使用 Milvus 2.5 开始混合语义/全文搜索
author: Stefan Webb
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Full_Text_Search_with_Milvus_2_5_7ba74461be.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
---
<p>在本文中，我们将向您展示如何快速使用新的全文搜索功能，并将其与基于向量嵌入的传统语义搜索相结合。</p>
<h2 id="Requirement" class="common-anchor-header">要求<button data-href="#Requirement" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，确保已安装 Milvus 2.5：</p>
<pre><code translate="no">pip install -U pymilvus[model]
<button class="copy-code-btn"></button></code></pre>
<p>并使用<a href="https://milvus.io/docs/prerequisite-docker.md">Milvus 文档中的安装说明</a>运行 Milvus Standalone 实例（例如在本地计算机上）。</p>
<h2 id="Building-the-Data-Schema-and-Search-Indices" class="common-anchor-header">构建数据 Schema 和搜索索引<button data-href="#Building-the-Data-Schema-and-Search-Indices" class="anchor-icon" translate="no">
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
    </button></h2><p>我们导入所需的类和函数：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">Function</span>, <span class="hljs-title class_">FunctionType</span>, model
<button class="copy-code-btn"></button></code></pre>
<p>你可能已经注意到 Milvus 2.5 的两个新条目：<code translate="no">Function</code> 和<code translate="no">FunctionType</code> ，我们稍后将对此进行解释。</p>
<p>接下来，我们用 Milvus Standalone（即本地）打开数据库，并创建数据模式。该模式包括一个整数主键、一个文本字符串、一个维数为 384 的稠密向量和一个稀疏向量（维数不受限制）。 请注意，Milvus Lite 目前不支持全文检索，只支持 Milvus Standalone 和 Milvus Distributed。</p>
<pre><code translate="no">client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema()

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;dense&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.VARCHAR: <span class="hljs-number">21</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;max_length&#x27;</span>: <span class="hljs-number">1000</span>, <span class="hljs-string">&#x27;enable_analyzer&#x27;</span>: <span class="hljs-literal">True</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;dense&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">768</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;sparse&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.SPARSE_FLOAT_VECTOR: <span class="hljs-number">104</span>&gt;}], <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">False</span>}
<button class="copy-code-btn"></button></code></pre>
<p>你可能已经注意到<code translate="no">enable_analyzer=True</code> 参数。这将告诉 Milvus 2.5 在这个字段上启用词法分析器，并建立一个词组和词组频率列表，这是全文搜索所必需的。<code translate="no">sparse</code> 字段将保存文档的向量表示，即由解析产生的词包<code translate="no">text</code> 。</p>
<p>但我们如何连接<code translate="no">text</code> 和<code translate="no">sparse</code> 字段，并告诉 Milvus<code translate="no">sparse</code> 应如何从<code translate="no">text</code> 计算出来？这就需要调用<code translate="no">Function</code> 对象并将其添加到 Schema 中：</p>
<pre><code translate="no">bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>, <span class="hljs-comment"># Function name</span>
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Name of the VARCHAR field containing raw text data</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Name of the SPARSE_FLOAT_VECTOR field reserved to store generated embeddings</span>
    function_type=FunctionType.BM25,
)

schema.add_function(bm25_function)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.VARCHAR: <span class="hljs-number">21</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;max_length&#x27;</span>: <span class="hljs-number">1000</span>, <span class="hljs-string">&#x27;enable_analyzer&#x27;</span>: <span class="hljs-literal">True</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;dense&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">768</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;sparse&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.SPARSE_FLOAT_VECTOR: <span class="hljs-number">104</span>&gt;, <span class="hljs-string">&#x27;is_function_output&#x27;</span>: <span class="hljs-literal">True</span>}], <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;functions&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text_bm25_emb&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;FunctionType.BM25: <span class="hljs-number">1</span>&gt;, <span class="hljs-string">&#x27;input_field_names&#x27;</span>: [<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;output_field_names&#x27;</span>: [<span class="hljs-string">&#x27;sparse&#x27;</span>], <span class="hljs-string">&#x27;params&#x27;</span>: {}}]}
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">Function</code> 对象的抽象比应用全文检索更通用。将来，它可能会用于一个字段需要成为另一个字段的函数的其他情况。在我们的案例中，我们通过函数<code translate="no">FunctionType.BM25</code> 指定<code translate="no">sparse</code> 是<code translate="no">text</code> 的函数。<code translate="no">BM25</code> 指的是信息检索中的一个常用度量，用于计算查询与文档（相对于文档 Collections）的相似度。</p>
<p>我们使用 Milvus 中的默认嵌入模型，即<a href="https://huggingface.co/GPTCache/paraphrase-albert-small-v2">paraphrase-albert-small-v2</a>：</p>
<pre><code translate="no">embedding_fn = model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>下一步是添加搜索索引。我们有一个用于密集向量，另一个用于稀疏向量。索引类型为<code translate="no">SPARSE_INVERTED_INDEX</code> ，<code translate="no">BM25</code> ，因为全文搜索所需的搜索方法与标准密集向量的搜索方法不同。</p>
<pre><code translate="no">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()

index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, 
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, 
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>最后，我们创建我们的 Collections：</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_collection</span>(<span class="hljs-string">&#x27;demo&#x27;</span>)
client.<span class="hljs-title function_">list_collections</span>()
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)

client.<span class="hljs-title function_">list_collections</span>()
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-string">&#x27;demo&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>这样，我们就有了一个空数据库，可以接受文本文档并执行语义和全文检索！</p>
<h2 id="Inserting-Data-and-Performing-Full-Text-Search" class="common-anchor-header">插入数据和执行全文搜索<button data-href="#Inserting-Data-and-Performing-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>插入数据与 Milvus 以前的版本没有什么不同：</p>
<pre><code translate="no">docs = [
    <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>,
    <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>,
    <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>
]

embeddings = embedding_fn(docs)

client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: doc, <span class="hljs-string">&#x27;dense&#x27;</span>: vec} <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(docs, embeddings)
])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">454387371651630485</span>, <span class="hljs-number">454387371651630486</span>, <span class="hljs-number">454387371651630487</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>在进行混合搜索之前，让我们先演示一下全文搜索：</p>
<pre><code translate="no">search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: 0.2},
}

results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;whats the focus of information retrieval?&#x27;</span>],
    output_fields=[<span class="hljs-string">&#x27;text&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    <span class="hljs-built_in">limit</span>=3,
    search_params=search_params
)
<button class="copy-code-btn"></button></code></pre>
<p>搜索参数<code translate="no">drop_ratio_search</code> 指的是在搜索算法中放弃得分较低文档的比例。</p>
<p>让我们来看看结果：</p>
<pre><code translate="no"><span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(hit)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630485</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">1.3352930545806885</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630486</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.29726022481918335</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630487</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.2715056240558624</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Performing-Hybrid-Semantic-and-Full-Text-Search" class="common-anchor-header">执行语义和全文混合搜索<button data-href="#Performing-Hybrid-Semantic-and-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>现在，让我们结合所学知识来执行混合搜索，将单独的语义搜索和全文搜索与 Reranker 结合起来：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
query = <span class="hljs-string">&#x27;whats the focus of information retrieval?&#x27;</span>
query_dense_vector = <span class="hljs-title function_">embedding_fn</span>([query])

search_param_1 = {
    <span class="hljs-string">&quot;data&quot;</span>: query_dense_vector,
    <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;dense&quot;</span>,
    <span class="hljs-string">&quot;param&quot;</span>: {
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    },
    <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">3</span>
}
request_1 = <span class="hljs-title class_">AnnSearchRequest</span>(**search_param_1)

search_param_2 = {
    <span class="hljs-string">&quot;data&quot;</span>: [query],
    <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;sparse&quot;</span>,
    <span class="hljs-string">&quot;param&quot;</span>: {
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;drop_ratio_build&quot;</span>: <span class="hljs-number">0.0</span>}
    },
    <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">3</span>
}
request_2 = <span class="hljs-title class_">AnnSearchRequest</span>(**search_param_2)

reqs = [request_1, request_2]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">ranker = RRFRanker()

res = client.hybrid_search(
    collection_name=<span class="hljs-string">&quot;demo&quot;</span>,
    output_fields=[<span class="hljs-string">&#x27;text&#x27;</span>],
    reqs=reqs,
    ranker=ranker,
    <span class="hljs-built_in">limit</span>=3
)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> res[0]:
    <span class="hljs-built_in">print</span>(hit)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630485</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.032786883413791656</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630486</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.032258063554763794</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630487</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.0317460335791111</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>正如你可能已经注意到的，这与带有两个独立语义字段的混合搜索（自 Milvus 2.4 起可用）没有什么不同。在这个简单的例子中，结果与全文搜索相同，但对于大型数据库和特定关键词搜索，混合搜索的召回率通常更高。</p>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>您现在已经掌握了使用 Milvus 2.5 进行全文和混合语义/全文搜索所需的全部知识。请参阅以下文章，了解有关全文搜索如何工作以及为什么它是语义搜索的补充的更多讨论：</p>
<ul>
<li><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">介绍 Milvus 2.5：全文搜索、更强大的元数据过滤和可用性改进！</a></li>
<li><a href="https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md">语义搜索与全文搜索：我在 Milvus 2.5 中选择哪一个？</a></li>
</ul>
