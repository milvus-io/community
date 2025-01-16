---
id: get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
title: Introducción a la búsqueda híbrida semántica/de texto completo con Milvus 2.5
author: Stefan Webb
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Full_Text_Search_with_Milvus_2_5_7ba74461be.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
---
<p>En este artículo, le mostraremos cómo poner en marcha rápidamente la nueva función de búsqueda de texto completo y combinarla con la búsqueda semántica convencional basada en incrustaciones vectoriales.</p>
<h2 id="Requirement" class="common-anchor-header">Requisitos<button data-href="#Requirement" class="anchor-icon" translate="no">
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
    </button></h2><p>En primer lugar, asegúrese de haber instalado Milvus 2.5:</p>
<pre><code translate="no">pip install -U pymilvus[model]
<button class="copy-code-btn"></button></code></pre>
<p>y tener una instancia en ejecución de Milvus Standalone (por ejemplo, en su máquina local) siguiendo las <a href="https://milvus.io/docs/prerequisite-docker.md">instrucciones de instalación de la documentación de Milvus</a>.</p>
<h2 id="Building-the-Data-Schema-and-Search-Indices" class="common-anchor-header">Construir el esquema de datos y los índices de búsqueda<button data-href="#Building-the-Data-Schema-and-Search-Indices" class="anchor-icon" translate="no">
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
    </button></h2><p>Importamos las clases y funciones necesarias:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">Function</span>, <span class="hljs-title class_">FunctionType</span>, model
<button class="copy-code-btn"></button></code></pre>
<p>Puede que haya notado dos nuevas entradas para Milvus 2.5, <code translate="no">Function</code> y <code translate="no">FunctionType</code>, que explicaremos en breve.</p>
<p>A continuación abrimos la base de datos con Milvus Standalone, es decir, localmente, y creamos el esquema de datos. El esquema comprende una clave primaria entera, una cadena de texto, un vector denso de dimensión 384, y un vector disperso (de dimensionalidad ilimitada). Observe que Milvus Lite no soporta actualmente la búsqueda de texto completo, sólo Milvus Standalone y Milvus Distributed.</p>
<pre><code translate="no">client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema()

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;dense&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.VARCHAR: <span class="hljs-number">21</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;max_length&#x27;</span>: <span class="hljs-number">1000</span>, <span class="hljs-string">&#x27;enable_analyzer&#x27;</span>: <span class="hljs-literal">True</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;dense&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">768</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;sparse&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.SPARSE_FLOAT_VECTOR: <span class="hljs-number">104</span>&gt;}], <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">False</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Puede que haya notado el parámetro <code translate="no">enable_analyzer=True</code>. Esto indica a Milvus 2.5 que active el analizador léxico en este campo y construya una lista de tokens y frecuencias de tokens, que son necesarios para la búsqueda de texto completo. El campo <code translate="no">sparse</code> contendrá una representación vectorial de la documentación como una bolsa de palabras producida a partir del análisis <code translate="no">text</code>.</p>
<p>Pero, ¿cómo conectamos los campos <code translate="no">text</code> y <code translate="no">sparse</code> e indicamos a Milvus cómo debe calcularse <code translate="no">sparse</code> a partir de <code translate="no">text</code>? Aquí es donde tenemos que invocar el objeto <code translate="no">Function</code> y añadirlo al esquema:</p>
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
<p>La abstracción del objeto <code translate="no">Function</code> es más general que la de aplicar la búsqueda de texto completo. En el futuro, podrá utilizarse para otros casos en los que un campo deba ser función de otro. En nuestro caso, especificamos que <code translate="no">sparse</code> es una función de <code translate="no">text</code> a través de la función <code translate="no">FunctionType.BM25</code>. <code translate="no">BM25</code> se refiere a una métrica común en la recuperación de información utilizada para calcular la similitud de una consulta con un documento (en relación con una colección de documentos).</p>
<p>Utilizamos el modelo de incrustación predeterminado en Milvus, que es <a href="https://huggingface.co/GPTCache/paraphrase-albert-small-v2">paraphrase-albert-small-v2</a>:</p>
<pre><code translate="no">embedding_fn = model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>El siguiente paso es añadir nuestros índices de búsqueda. Tenemos uno para el vector denso y otro para el vector disperso. El tipo de índice es <code translate="no">SPARSE_INVERTED_INDEX</code> con <code translate="no">BM25</code> ya que la búsqueda de texto completo requiere un método de búsqueda diferente al de los vectores densos estándar.</p>
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
<p>Por último, creamos nuestra colección:</p>
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
<p>Y ya tenemos una base de datos vacía preparada para aceptar documentos de texto y realizar búsquedas semánticas y de texto completo.</p>
<h2 id="Inserting-Data-and-Performing-Full-Text-Search" class="common-anchor-header">Insertar datos y realizar búsquedas de texto completo<button data-href="#Inserting-Data-and-Performing-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>La inserción de datos no difiere de las versiones anteriores de Milvus:</p>
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
<p>Ilustremos primero una búsqueda de texto completo antes de pasar a la búsqueda híbrida:</p>
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
<p>El parámetro de búsqueda <code translate="no">drop_ratio_search</code> se refiere a la proporción de documentos con puntuación más baja que deben descartarse durante el algoritmo de búsqueda.</p>
<p>Veamos los resultados:</p>
<pre><code translate="no"><span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(hit)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630485</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">1.3352930545806885</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630486</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.29726022481918335</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630487</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.2715056240558624</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Performing-Hybrid-Semantic-and-Full-Text-Search" class="common-anchor-header">Búsqueda híbrida semántica y de texto completo<button data-href="#Performing-Hybrid-Semantic-and-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Combinemos ahora lo que hemos aprendido para realizar una búsqueda híbrida que combine búsquedas semánticas y de texto completo por separado con un reranker:</p>
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
<p>Como habrá notado, esto no difiere de una búsqueda híbrida con dos campos semánticos separados (disponible desde Milvus 2.4). Los resultados son idénticos a los de la búsqueda de texto completo en este sencillo ejemplo, pero para bases de datos más grandes y búsquedas específicas por palabra clave, la búsqueda híbrida suele tener una mayor recuperación.</p>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora ya dispone de todos los conocimientos necesarios para realizar búsquedas de texto completo e híbridas semánticas/de texto completo con Milvus 2.5. Consulte los siguientes artículos para obtener más información sobre cómo funciona la búsqueda de texto completo y por qué es complementaria a la búsqueda semántica:</p>
<ul>
<li><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Presentación de Milvus 2.5: ¡Búsqueda de texto completo, filtrado de metadatos más potente y mejoras en la usabilidad!</a></li>
<li><a href="https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md">Búsqueda semántica frente a búsqueda de texto completo: ¿Cuál elijo en Milvus 2.5?</a></li>
</ul>
