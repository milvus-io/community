---
id: get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
title: Начало работы с гибридным семантическим / полнотекстовым поиском с Milvus 2.5
author: Stefan Webb
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Full_Text_Search_with_Milvus_2_5_7ba74461be.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
---
<p>В этой статье мы покажем вам, как быстро запустить новую функцию полнотекстового поиска и совместить ее с обычным семантическим поиском на основе векторных вкраплений.</p>
<h2 id="Requirement" class="common-anchor-header">Требования<button data-href="#Requirement" class="anchor-icon" translate="no">
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
    </button></h2><p>Во-первых, убедитесь, что вы установили Milvus 2.5:</p>
<pre><code translate="no">pip install -U pymilvus[model]
<button class="copy-code-btn"></button></code></pre>
<p>и наличие запущенного экземпляра Milvus Standalone (например, на локальной машине), используя <a href="https://milvus.io/docs/prerequisite-docker.md">инструкции по установке в документации Milvus</a>.</p>
<h2 id="Building-the-Data-Schema-and-Search-Indices" class="common-anchor-header">Создание схемы данных и поисковых индексов<button data-href="#Building-the-Data-Schema-and-Search-Indices" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы импортируем необходимые классы и функции:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">Function</span>, <span class="hljs-title class_">FunctionType</span>, model
<button class="copy-code-btn"></button></code></pre>
<p>Возможно, вы заметили две новые записи для Milvus 2.5, <code translate="no">Function</code> и <code translate="no">FunctionType</code>, о которых мы расскажем в ближайшее время.</p>
<p>Далее мы открываем базу данных с помощью Milvus Standalone, то есть локально, и создаем схему данных. Схема включает в себя целочисленный первичный ключ, текстовую строку, плотный вектор размерности 384 и разреженный вектор (неограниченной размерности). Обратите внимание, что Milvus Lite в настоящее время не поддерживает полнотекстовый поиск, только Milvus Standalone и Milvus Distributed.</p>
<pre><code translate="no">client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema()

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;dense&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.VARCHAR: <span class="hljs-number">21</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;max_length&#x27;</span>: <span class="hljs-number">1000</span>, <span class="hljs-string">&#x27;enable_analyzer&#x27;</span>: <span class="hljs-literal">True</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;dense&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">768</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;sparse&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.SPARSE_FLOAT_VECTOR: <span class="hljs-number">104</span>&gt;}], <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">False</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Возможно, вы заметили параметр <code translate="no">enable_analyzer=True</code>. Он указывает Milvus 2.5 включить лексический парсер для этого поля и построить список лексем и частот лексем, которые необходимы для полнотекстового поиска. Поле <code translate="no">sparse</code> будет содержать векторное представление документации в виде мешка слов, полученного в результате синтаксического анализа <code translate="no">text</code>.</p>
<p>Но как нам соединить поля <code translate="no">text</code> и <code translate="no">sparse</code> и указать Milvus, как <code translate="no">sparse</code> следует вычислять из <code translate="no">text</code>? Здесь нам нужно вызвать объект <code translate="no">Function</code> и добавить его в схему:</p>
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
<p>Абстракция объекта <code translate="no">Function</code> является более общей, чем применение полнотекстового поиска. В будущем он может быть использован и для других случаев, когда одно поле должно быть функцией другого поля. В нашем случае мы указываем, что <code translate="no">sparse</code> является функцией <code translate="no">text</code> через функцию <code translate="no">FunctionType.BM25</code>. <code translate="no">BM25</code> относится к общей метрике в информационном поиске, используемой для вычисления сходства запроса с документом (относительно коллекции документов).</p>
<p>Мы используем модель встраивания по умолчанию в Milvus, которая является <a href="https://huggingface.co/GPTCache/paraphrase-albert-small-v2">paraphrase-albert-small-v2</a>:</p>
<pre><code translate="no">embedding_fn = model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>Следующий шаг - добавление наших поисковых индексов. У нас есть один для плотного вектора и отдельный для разреженного вектора. Тип индекса - <code translate="no">SPARSE_INVERTED_INDEX</code> с <code translate="no">BM25</code>, поскольку полнотекстовый поиск требует другого метода поиска, чем для стандартных плотных векторов.</p>
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
<p>Наконец, мы создаем нашу коллекцию:</p>
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
<p>И вот у нас есть пустая база данных, настроенная на прием текстовых документов и выполнение семантического и полнотекстового поиска!</p>
<h2 id="Inserting-Data-and-Performing-Full-Text-Search" class="common-anchor-header">Вставка данных и выполнение полнотекстового поиска<button data-href="#Inserting-Data-and-Performing-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Вставка данных ничем не отличается от предыдущих версий Milvus:</p>
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
<p>Давайте сначала проиллюстрируем полнотекстовый поиск, а затем перейдем к гибридному поиску:</p>
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
<p>Параметр поиска <code translate="no">drop_ratio_search</code> обозначает долю документов с более низкой оценкой, которая должна быть отброшена в ходе алгоритма поиска.</p>
<p>Давайте посмотрим на результаты:</p>
<pre><code translate="no"><span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(hit)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630485</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">1.3352930545806885</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630486</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.29726022481918335</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630487</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.2715056240558624</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Performing-Hybrid-Semantic-and-Full-Text-Search" class="common-anchor-header">Выполнение гибридного семантического и полнотекстового поиска<button data-href="#Performing-Hybrid-Semantic-and-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь давайте объединим полученные знания и выполним гибридный поиск, который сочетает в себе раздельный семантический и полнотекстовый поиск с реранкером:</p>
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
<p>Как вы могли заметить, это ничем не отличается от гибридного поиска с двумя отдельными семантическими полями (доступного начиная с Milvus 2.4). В этом простом примере результаты идентичны полнотекстовому поиску, но для больших баз данных и поисков по ключевым словам гибридный поиск обычно имеет более высокий отзыв.</p>
<h2 id="Summary" class="common-anchor-header">Резюме<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь вы обладаете всеми необходимыми знаниями для выполнения полнотекстового и гибридного семантического/полнотекстового поиска с помощью Milvus 2.5. Подробнее о том, как работает полнотекстовый поиск и почему он дополняет семантический, читайте в следующих статьях:</p>
<ul>
<li><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Представляем Milvus 2.5: полнотекстовый поиск, более мощная фильтрация метаданных и улучшения в удобстве использования!</a></li>
<li><a href="https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md">Семантический поиск против полнотекстового поиска: Что выбрать в Milvus 2.5?</a></li>
</ul>
