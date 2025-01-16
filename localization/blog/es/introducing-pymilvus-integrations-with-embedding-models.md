---
id: introducing-pymilvus-integrations-with-embedding-models.md
title: Presentación de la integración de PyMilvus con los modelos de incrustación
author: Stephen Batifol
date: 2024-06-05T00:00:00.000Z
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-pymilvus-integrations-with-embedding-models.md
---
<p><a href="https://milvus.io/intro">Milvus</a> es una base de datos vectorial de código abierto diseñada específicamente para aplicaciones de IA. Ya sea que esté trabajando en aprendizaje automático, aprendizaje profundo o cualquier otro proyecto relacionado con la IA, Milvus ofrece una manera robusta y eficiente de manejar datos vectoriales a gran escala.</p>
<p>Ahora, con la <a href="https://milvus.io/docs/embeddings.md">integración del módulo de modelos</a> en PyMilvus, el SDK de Python para Milvus, es aún más fácil añadir modelos de Embedding y Reranking. Esta integración simplifica la transformación de sus datos en vectores de búsqueda o la reordenación de los resultados para obtener resultados más precisos, como en la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Generación Aumentada de Recuperación (RAG)</a>.</p>
<p>En este blog, revisaremos los modelos de incrustación densa, los modelos de incrustación dispersa y los reordenadores y demostraremos cómo utilizarlos en la práctica utilizando <a href="https://milvus.io/blog/introducing-milvus-lite.md">Milvus Lite</a>, una versión ligera de Milvus que puede ejecutarse localmente en sus aplicaciones Python.</p>
<h2 id="Dense-vs-Sparse-Embeddings" class="common-anchor-header">Incrustaciones densas frente a dispersas<button data-href="#Dense-vs-Sparse-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de explicarle cómo utilizar nuestras integraciones, veamos dos categorías principales de incrustaciones vectoriales.</p>
<p><a href="https://zilliz.com/glossary/vector-embeddings">Las incrustaciones vectoriales</a> generalmente se dividen en dos categorías principales: <a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Incrustaciones densas</strong> e <strong>incrustaciones dispersas</strong></a>.</p>
<ul>
<li><p>Las incrustaciones densas son vectores de alta dimensión en los que la mayoría o todos los elementos son distintos de cero, lo que los hace ideales para codificar la semántica del texto o el significado difuso.</p></li>
<li><p>Las incrustaciones dispersas son vectores de alta dimensión con muchos elementos nulos, más adecuados para codificar conceptos exactos o adyacentes.</p></li>
</ul>
<p>Milvus admite ambos tipos de incrustaciones y ofrece búsqueda híbrida. La <a href="https://zilliz.com/blog/hybrid-search-with-milvus">búsqueda híbrida</a> le permite realizar búsquedas en varios campos vectoriales dentro de la misma colección. Estos vectores pueden representar diferentes facetas de los datos, utilizar diversos modelos de incrustación o emplear distintos métodos de procesamiento de datos, combinando los resultados mediante reordenadores.</p>
<h2 id="How-to-Use-Our-Embedding-and-Reranking-Integrations" class="common-anchor-header">Cómo utilizar nuestras integraciones de incrustación y reclasificación<button data-href="#How-to-Use-Our-Embedding-and-Reranking-Integrations" class="anchor-icon" translate="no">
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
    </button></h2><p>En las siguientes secciones, mostraremos tres ejemplos prácticos de uso de nuestras integraciones para generar incrustaciones y realizar búsquedas vectoriales.</p>
<h3 id="Example-1-Use-the-Default-Embedding-Function-to-Generate-Dense-Vectors" class="common-anchor-header">Ejemplo 1: Utilizar la función de incrustación predeterminada para generar vectores densos</h3><p>Debe instalar el cliente <code translate="no">pymilvus</code> con el paquete <code translate="no">model</code> para utilizar las funciones de incrustación y reordenación con Milvus.</p>
<pre><code translate="no">pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Este paso instalará <a href="https://milvus.io/docs/quickstart.md">Milvus Lite</a>, permitiéndole ejecutar Milvus localmente dentro de su aplicación Python. También incluye el subpaquete model, que incluye todas las utilidades para Embedding y reranking.</p>
<p>El subpaquete de modelos admite varios modelos de incrustación, incluidos los de OpenAI, <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence Transformers</a>, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>, BM25, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">SPLADE</a> y los modelos preentrenados de Jina AI.</p>
<p>Este ejemplo utiliza el modelo <code translate="no">DefaultEmbeddingFunction</code>, basado en el modelo <code translate="no">all-MiniLM-L6-v2</code> Sentence Transformer para simplificar. El modelo ocupa unos 70 MB y se descargará durante el primer uso:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

<span class="hljs-comment"># This will download &quot;all-MiniLM-L6-v2&quot;, a lightweight model.</span>
ef = model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Data from which embeddings are to be generated</span>
docs = [
   <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
   <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
   <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

embeddings = ef.encode_documents(docs)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Embeddings:&quot;</span>, embeddings)
<span class="hljs-comment"># Print dimension and shape of embeddings</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Dim:&quot;</span>, ef.dim, embeddings[<span class="hljs-number">0</span>].shape)
<button class="copy-code-btn"></button></code></pre>
<p>El resultado esperado debería ser algo parecido a lo siguiente:</p>
<pre><code translate="no">Embeddings: [array([<span class="hljs-number">-3.09392996e-02</span>, <span class="hljs-number">-1.80662833e-02</span>,  <span class="hljs-number">1.34775648e-02</span>,  <span class="hljs-number">2.77156215e-02</span>,
      <span class="hljs-number">-4.86349640e-03</span>, <span class="hljs-number">-3.12581174e-02</span>, <span class="hljs-number">-3.55921760e-02</span>,  <span class="hljs-number">5.76934684e-03</span>,
       <span class="hljs-number">2.80773244e-03</span>,  <span class="hljs-number">1.35783911e-01</span>,  <span class="hljs-number">3.59678417e-02</span>,  <span class="hljs-number">6.17732145e-02</span>,
...
      <span class="hljs-number">-4.61330153e-02</span>, <span class="hljs-number">-4.85207550e-02</span>,  <span class="hljs-number">3.13997865e-02</span>,  <span class="hljs-number">7.82178566e-02</span>,
      <span class="hljs-number">-4.75336798e-02</span>,  <span class="hljs-number">5.21207601e-02</span>,  <span class="hljs-number">9.04406682e-02</span>, <span class="hljs-number">-5.36676683e-02</span>],
     dtype=<span class="hljs-type">float32</span>)]
Dim: <span class="hljs-number">384</span> (<span class="hljs-number">384</span>,)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-2-Generate-Sparse-Vectors-Using-The-BM25-Model" class="common-anchor-header">Ejemplo 2: Generar vectores dispersos utilizando el modelo BM25</h3><p>BM25 es un método bien conocido que utiliza frecuencias de aparición de palabras para determinar la relevancia entre consultas y documentos. En este ejemplo, mostraremos cómo utilizar <code translate="no">BM25EmbeddingFunction</code> para generar incrustaciones dispersas para consultas y documentos.</p>
<p>En BM25, es importante calcular las estadísticas de los documentos para obtener la IDF (Inverse Document Frequency), que puede representar los patrones de los documentos. El IDF mide cuánta información proporciona una palabra, si es común o rara en todos los documentos.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus.model.sparse <span class="hljs-keyword">import</span> BM25EmbeddingFunction

<span class="hljs-comment"># 1. Prepare a small corpus to search</span>
docs = [
   <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
   <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
   <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]
query = <span class="hljs-string">&quot;Where was Turing born?&quot;</span>
bm25_ef = BM25EmbeddingFunction()

<span class="hljs-comment"># 2. Fit the corpus to get BM25 model parameters on your documents.</span>
bm25_ef.fit(docs)

<span class="hljs-comment"># 3. Store the fitted parameters to expedite future processing.</span>
bm25_ef.save(<span class="hljs-string">&quot;bm25_params.json&quot;</span>)

<span class="hljs-comment"># 4. Load the saved params</span>
new_bm25_ef = BM25EmbeddingFunction()
new_bm25_ef.load(<span class="hljs-string">&quot;bm25_params.json&quot;</span>)

docs_embeddings = new_bm25_ef.encode_documents(docs)
query_embeddings = new_bm25_ef.encode_queries([query])
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Dim:&quot;</span>, new_bm25_ef.dim, <span class="hljs-built_in">list</span>(docs_embeddings)[<span class="hljs-number">0</span>].shape)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-3-Using-a-ReRanker" class="common-anchor-header">Ejemplo 3: Utilización de un ReRanker</h3><p>El objetivo de un sistema de búsqueda es encontrar los resultados más relevantes de forma rápida y eficaz. Tradicionalmente, se han utilizado métodos como BM25 o TF-IDF para clasificar los resultados de la búsqueda basándose en la coincidencia de palabras clave. Los métodos más recientes, como la similitud coseno-incrustada, son sencillos, pero a veces no tienen en cuenta las sutilezas del lenguaje y, sobre todo, la interacción entre los documentos y la intención de la consulta.</p>
<p>Aquí es donde ayuda el uso de un <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">re-ranker</a>. Un re-ranker es un modelo avanzado de IA que toma el conjunto inicial de resultados de una búsqueda -a menudo proporcionado por una búsqueda basada en incrustaciones/tokens- y los reevalúa para asegurarse de que se ajustan mejor a la intención del usuario. Va más allá de la coincidencia superficial de términos para considerar la interacción más profunda entre la consulta de búsqueda y el contenido de los documentos.</p>
<p>Para este ejemplo, utilizaremos <a href="https://milvus.io/docs/integrate_with_jina.md">el Jina AI Reranker</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus.model.reranker <span class="hljs-keyword">import</span> JinaRerankFunction

jina_api_key = <span class="hljs-string">&quot;&lt;YOUR_JINA_API_KEY&gt;&quot;</span>

rf = JinaRerankFunction(<span class="hljs-string">&quot;jina-reranker-v1-base-en&quot;</span>, jina_api_key)

query = <span class="hljs-string">&quot;What event in 1956 marked the official birth of artificial intelligence as a discipline?&quot;</span>

documents = [
   <span class="hljs-string">&quot;In 1950, Alan Turing published his seminal paper, &#x27;Computing Machinery and Intelligence,&#x27; proposing the Turing Test as a criterion of intelligence, a foundational concept in the philosophy and development of artificial intelligence.&quot;</span>,
   <span class="hljs-string">&quot;The Dartmouth Conference in 1956 is considered the birthplace of artificial intelligence as a field; here, John McCarthy and others coined the term &#x27;artificial intelligence&#x27; and laid out its basic goals.&quot;</span>,
   <span class="hljs-string">&quot;In 1951, British mathematician and computer scientist Alan Turing also developed the first program designed to play chess, demonstrating an early example of AI in game strategy.&quot;</span>,
   <span class="hljs-string">&quot;The invention of the Logic Theorist by Allen Newell, Herbert A. Simon, and Cliff Shaw in 1955 marked the creation of the first true AI program, which was capable of solving logic problems, akin to proving mathematical theorems.&quot;</span>
]

results = rf(query, documents)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Index: <span class="hljs-subst">{result.index}</span>&quot;</span>)
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Score: <span class="hljs-subst">{result.score:<span class="hljs-number">.6</span>f}</span>&quot;</span>)
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Text: <span class="hljs-subst">{result.text}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>El resultado esperado es similar al siguiente:</p>
<pre><code translate="no">Index: <span class="hljs-number">1</span>
Score: <span class="hljs-number">0.937096</span>
Text: The Dartmouth Conference <span class="hljs-keyword">in</span> <span class="hljs-number">1956</span> <span class="hljs-keyword">is</span> considered the birthplace of artificial intelligence <span class="hljs-keyword">as</span> a field; here, John McCarthy <span class="hljs-keyword">and</span> others coined the term <span class="hljs-string">&#x27;artificial intelligence&#x27;</span> <span class="hljs-keyword">and</span> laid <span class="hljs-keyword">out</span> its basic goals.

Index: <span class="hljs-number">3</span>
Score: <span class="hljs-number">0.354210</span>
Text: The invention of the Logic Theorist <span class="hljs-keyword">by</span> Allen Newell, Herbert A. Simon, <span class="hljs-keyword">and</span> Cliff Shaw <span class="hljs-keyword">in</span> <span class="hljs-number">1955</span> marked the creation of the first <span class="hljs-literal">true</span> AI program, which was capable of solving logic problems, akin to proving mathematical theorems.

Index: <span class="hljs-number">0</span>
Score: <span class="hljs-number">0.349866</span>
Text: In <span class="hljs-number">1950</span>, Alan Turing published his seminal paper, <span class="hljs-string">&#x27;Computing Machinery and Intelligence,&#x27;</span> proposing the Turing Test <span class="hljs-keyword">as</span> a criterion of intelligence, a foundational concept <span class="hljs-keyword">in</span> the philosophy <span class="hljs-keyword">and</span> development of artificial intelligence.

Index: <span class="hljs-number">2</span>
Score: <span class="hljs-number">0.272896</span>
Text: In <span class="hljs-number">1951</span>, British mathematician <span class="hljs-keyword">and</span> computer scientist Alan Turing also developed the first program designed to play chess, demonstrating an early example of AI <span class="hljs-keyword">in</span> game strategy.
<button class="copy-code-btn"></button></code></pre>
<h2 id="Star-Us-On-GitHub-and-Join-Our-Discord" class="common-anchor-header">¡Síguenos en GitHub y únete a nuestro Discord!<button data-href="#Star-Us-On-GitHub-and-Join-Our-Discord" class="anchor-icon" translate="no">
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
    </button></h2><p>Si te ha gustado esta entrada de blog, ¡considera incluir a Milvus en <a href="https://github.com/milvus-io/milvus">GitHub</a>, y no dudes en unirte a nuestro <a href="https://discord.gg/FG6hMJStWu">Discord</a>! 💙</p>
