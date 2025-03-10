---
id: get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
title: 使用 Milvus 2.5 開始混合語意/全文本搜尋
author: Stefan Webb
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Full_Text_Search_with_Milvus_2_5_7ba74461be.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
---
<p>在這篇文章中，我們將教您如何快速使用新的全文檢索功能，並將其與傳統的以向量嵌入為基礎的語意檢索結合。</p>
<iframe width="100%" height="480" src="https://www.youtube.com/embed/3bftbAjQF7Q" title="Beyond Keywords: Hybrid Search with Milvus 2.5" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Requirement" class="common-anchor-header">需求<button data-href="#Requirement" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，確保您已經安裝 Milvus 2.5：</p>
<pre><code translate="no">pip install -U pymilvus[model]
<button class="copy-code-btn"></button></code></pre>
<p>並使用<a href="https://milvus.io/docs/prerequisite-docker.md">Milvus 文檔中的安裝指示，</a>擁有一個運行中的 Milvus Standalone (例如：在您的本機上)。</p>
<h2 id="Building-the-Data-Schema-and-Search-Indices" class="common-anchor-header">建立資料模式和搜尋索引<button data-href="#Building-the-Data-Schema-and-Search-Indices" class="anchor-icon" translate="no">
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
    </button></h2><p>我們匯入所需的類別和函式：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">Function</span>, <span class="hljs-title class_">FunctionType</span>, model
<button class="copy-code-btn"></button></code></pre>
<p>您可能已經注意到 Milvus 2.5 的兩個新項目，<code translate="no">Function</code> 和<code translate="no">FunctionType</code> ，我們稍後會解釋。</p>
<p>接下來，我們使用 Milvus Standalone 開啟資料庫，也就是在本機建立資料模式。請注意，Milvus Lite 目前不支援全文檢索，只支援 Milvus Standalone 和 Milvus Distributed。</p>
<pre><code translate="no">client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema()

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;dense&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.VARCHAR: <span class="hljs-number">21</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;max_length&#x27;</span>: <span class="hljs-number">1000</span>, <span class="hljs-string">&#x27;enable_analyzer&#x27;</span>: <span class="hljs-literal">True</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;dense&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">768</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;sparse&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.SPARSE_FLOAT_VECTOR: <span class="hljs-number">104</span>&gt;}], <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">False</span>}
<button class="copy-code-btn"></button></code></pre>
<p>您可能已經注意到<code translate="no">enable_analyzer=True</code> 參數。這會告訴 Milvus 2.5 在這個欄位上啟用詞彙分析器，並建立一個詞彙和詞彙頻率的列表，這是全文檢索所需要的。<code translate="no">sparse</code> 欄位將保存文件的向量表示，作為從解析<code translate="no">text</code> 產生的字元袋。</p>
<p>但我們如何連接<code translate="no">text</code> 和<code translate="no">sparse</code> 欄位，並告訴 Milvus<code translate="no">sparse</code> 應如何從<code translate="no">text</code> 計算出來？這就是我們需要調用<code translate="no">Function</code> 物件並將其加入模式的地方：</p>
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
<p><code translate="no">Function</code> 物件的抽象比應用全文檢索的抽象更廣泛。將來，它可能會用於一個欄位需要成為另一個欄位的函數的其他情況。在我們的案例中，我們透過函數<code translate="no">FunctionType.BM25</code> 來指定<code translate="no">sparse</code> 是<code translate="no">text</code> 的函數。<code translate="no">BM25</code> 是指資訊檢索中常用的度量，用於計算查詢與文件的相似度（相對於文件集合）。</p>
<p>我們使用 Milvus 的預設嵌入模型，即<a href="https://huggingface.co/GPTCache/paraphrase-albert-small-v2">paraphrase-albert-small-v2</a>：</p>
<pre><code translate="no">embedding_fn = model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>下一步是加入我們的搜尋索引。我們有一個用於密集向量，另一個用於稀疏向量。索引類型是<code translate="no">SPARSE_INVERTED_INDEX</code> 與<code translate="no">BM25</code> ，因為全文搜尋所需的搜尋方法與標準密集向量的不同。</p>
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
<p>最後，我們建立集合：</p>
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
<p>如此一來，我們就有了一個空的資料庫，可以接受文字文件並執行語意和全文檢索！</p>
<h2 id="Inserting-Data-and-Performing-Full-Text-Search" class="common-anchor-header">插入資料和執行全文檢索<button data-href="#Inserting-Data-and-Performing-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>插入資料與 Milvus 以前的版本沒有什麼不同：</p>
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
<p>在進行混合搜尋之前，讓我們先說明一次全文搜尋：</p>
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
<p>搜索參數<code translate="no">drop_ratio_search</code> 指的是在搜索算法過程中要丟掉得分較低的文件的比例。</p>
<p>讓我們來查看結果：</p>
<pre><code translate="no"><span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(hit)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630485</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">1.3352930545806885</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630486</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.29726022481918335</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630487</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.2715056240558624</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Performing-Hybrid-Semantic-and-Full-Text-Search" class="common-anchor-header">執行混合語意與全文檢索<button data-href="#Performing-Hybrid-Semantic-and-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>現在讓我們結合我們所學到的知識來執行混合搜尋，將獨立的語意搜尋和全文搜尋結合起來，再加上一個reeranker：</p>
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
<p>您可能已經注意到了，這與具有兩個獨立語意欄位的混合搜尋（自 Milvus 2.4 起可用）沒有什麼不同。在這個簡單的範例中，結果與全文檢索相同，但對於較大的資料庫和特定關鍵字檢索，混合檢索的召回率通常較高。</p>
<h2 id="Summary" class="common-anchor-header">總結<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>您現在已經具備了使用 Milvus 2.5 執行全文和混合語意/全文搜尋所需的所有知識。請參閱下列文章，以瞭解更多關於全文搜尋如何運作，以及為什麼它是語意搜尋的補充：</p>
<ul>
<li><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">介紹 Milvus 2.5：全文搜尋、更強大的元資料篩選功能以及可用性改進！</a></li>
<li><a href="https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md">語義搜尋v.s. 全文搜索：我在 Milvus 2.5 中選擇哪一個？</a></li>
</ul>
