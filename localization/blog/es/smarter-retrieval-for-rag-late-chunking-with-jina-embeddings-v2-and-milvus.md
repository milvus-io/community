---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: >-
  Recuperación más inteligente para GAR: fragmentación tardía con Jina
  Embeddings v2 y Milvus
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  Aumente la precisión de la RAG utilizando Late Chunking y Milvus para una
  incrustación de documentos eficiente y consciente del contexto y una búsqueda
  vectorial más rápida e inteligente.
cover: assets.zilliz.com/Milvus_Meets_Late_Chunking_eaff956df1.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>La creación de un sistema GAR sólido suele comenzar con la <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>fragmentación de</strong></a> <strong>documentos</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>, es decir, la división</strong></a>de textos extensos en fragmentos manejables para su incrustación y recuperación. Las estrategias más comunes son</p>
<ul>
<li><p>trozos<strong>de tamaño fijo</strong> (por ejemplo, cada 512 tokens)</p></li>
<li><p><strong>Trozos de tamaño variable</strong> (por ejemplo, en los límites de párrafos o frases).</p></li>
<li><p><strong>Ventanas deslizantes</strong> (espacios superpuestos).</p></li>
<li><p><strong>Chunking recursivo</strong> (división jerárquica)</p></li>
<li><p><strong>Chunking semántico</strong> (agrupación por temas)</p></li>
</ul>
<p>Aunque estos métodos tienen sus ventajas, a menudo no tienen en cuenta el contexto a largo plazo. Para hacer frente a este reto, Jina AI crea un método de chunking tardío: primero se incrusta todo el documento y luego se esculpen los trozos.</p>
<p>En este artículo, exploraremos cómo funciona Late Chunking y demostraremos cómo su combinación con <a href="https://milvus.io/">Milvus (una</a>base de datos vectorial de código abierto de alto rendimiento creada para la búsqueda de similitudes) puede mejorar drásticamente sus procesos RAG. Tanto si está creando bases de conocimientos empresariales, como si está creando un servicio de atención al cliente basado en IA o aplicaciones de búsqueda avanzada, este tutorial le mostrará cómo gestionar las incrustaciones de forma más eficaz a gran escala.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">¿Qué es la fragmentación tardía?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Los métodos tradicionales de fragmentación pueden romper conexiones importantes cuando la información clave abarca varios fragmentos, lo que da como resultado un rendimiento de recuperación deficiente.</p>
<p>Considere estas notas de la versión 2.4.13 de Milvus, divididas en dos trozos como se muestra a continuación:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1. Fragmentación de las notas de publicación de Milvus 2.4.13</em></p>
<p>Si pregunta: "¿Cuáles son las nuevas características de Milvus 2.4.13?", un modelo de incrustación estándar puede fallar a la hora de vincular "Milvus 2.4.13" (en el trozo 1) con sus características (en el trozo 2). ¿Cuál es el resultado? Vectores más débiles y menor precisión de recuperación.</p>
<p>Las soluciones heurísticas, como las ventanas deslizantes, los contextos superpuestos y las exploraciones repetidas, proporcionan un alivio parcial, pero no garantías.</p>
<p><strong>El chunking tradicional</strong> sigue este proceso:</p>
<ol>
<li><p><strong>Clasificación previa</strong> del texto (por frases, párrafos o longitud máxima de los tokens).</p></li>
<li><p><strong>Incrustar</strong> cada fragmento por separado.</p></li>
<li><p><strong>Se agregan</strong> las incrustaciones de tokens (por ejemplo, mediante la agrupación de promedios) en un único vector de trozos.</p></li>
</ol>
<p><strong>La fragmentación tardía</strong> invierte el proceso:</p>
<ol>
<li><p><strong>Incrustar primero</strong>: Ejecutar un transformador de contexto largo sobre el documento completo, generando incrustaciones ricas en tokens que capturan el contexto global.</p></li>
<li><p><strong>Trocear después</strong>: Combine tramos contiguos de esas incrustaciones de tokens para formar los vectores de trozos finales.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2. Chunking ingenuo frente a chunking tardío</em><em>Naive Chunking frente a Late Chunking (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>Fuente</em></a><em>)</em></p>
<p>Al preservar el contexto completo del documento en cada trozo, el Late Chunking ofrece:</p>
<ul>
<li><p><strong>Mayor precisión en la recuperación: cada</strong>trozo tiene en cuenta el contexto.</p></li>
<li><p><strong>Menos trozos:</strong>se envía un texto más específico al LLM, lo que reduce los costes y la latencia.</p></li>
</ul>
<p>Muchos modelos de contexto largo, como jina-embeddings-v2-base-es, pueden procesar hasta 8.192 tokens, lo que equivale a una lectura de 20 minutos (unas 5.000 palabras) y hace que Late Chunking resulte práctico para la mayoría de los documentos del mundo real.</p>
<p>Ahora que entendemos el "qué" y el "por qué" del Late Chunking, pasemos al "cómo". En la siguiente sección, le guiaremos a través de una implementación práctica del canal de Late Chunking, compararemos su rendimiento con el del chunking tradicional y validaremos su impacto en el mundo real utilizando Milvus. Este recorrido práctico tenderá un puente entre la teoría y la práctica, mostrando exactamente cómo integrar Late Chunking en sus flujos de trabajo RAG.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">Pruebas de Late Chunking<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">Implementación básica</h3><p>A continuación se presentan las funciones básicas de Late Chunking. Hemos añadido docstrings claros para guiarle a través de cada paso. La función <code translate="no">sentence_chunker</code> divide el documento original en trozos basados en párrafos, devolviendo tanto el contenido del trozo como la información de anotación del trozo <code translate="no">span_annotations</code> (es decir, los índices de inicio y fin de cada trozo).</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">sentence_chunker</span>(<span class="hljs-params">document, batch_size=<span class="hljs-number">10000</span></span>):
    nlp = spacy.blank(<span class="hljs-string">&quot;en&quot;</span>)
    nlp.add_pipe(<span class="hljs-string">&quot;sentencizer&quot;</span>, config={<span class="hljs-string">&quot;punct_chars&quot;</span>: <span class="hljs-literal">None</span>})
    doc = nlp(document)

    docs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(document), batch_size):
        batch = document[i : i + batch_size]
        docs.append(nlp(batch))

    doc = Doc.from_docs(docs)

    span_annotations = []
    chunks = []
    <span class="hljs-keyword">for</span> i, sent <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc.sents):
        span_annotations.append((sent.start, sent.end))
        chunks.append(sent.text)

    <span class="hljs-keyword">return</span> chunks, span_annotations
<button class="copy-code-btn"></button></code></pre>
<p>La función <code translate="no">document_to_token_embeddings</code> utiliza el modelo jinaai/jina-embeddings-v2-base-es y su tokenizador para producir incrustaciones de todo el documento.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">document_to_token_embeddings</span>(<span class="hljs-params">model, tokenizer, document, batch_size=<span class="hljs-number">4096</span></span>):
    tokenized_document = tokenizer(document, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
    tokens = tokenized_document.tokens()

    outputs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(tokens), batch_size):
        
        start = i
        end   = <span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(tokens))

        batch_inputs = {k: v[:, start:end] <span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> tokenized_document.items()}

        <span class="hljs-keyword">with</span> torch.no_grad():
            model_output = model(**batch_inputs)

        outputs.append(model_output.last_hidden_state)

    model_output = torch.cat(outputs, dim=<span class="hljs-number">1</span>)
    <span class="hljs-keyword">return</span> model_output
<button class="copy-code-btn"></button></code></pre>
<p>La función <code translate="no">late_chunking</code> toma las incrustaciones de tokens del documento y la información de anotación del chunk original <code translate="no">span_annotations</code>, y luego produce las incrustaciones finales del chunk.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking</span>(<span class="hljs-params">token_embeddings, span_annotation, max_length=<span class="hljs-literal">None</span></span>):
    outputs = []
    <span class="hljs-keyword">for</span> embeddings, annotations <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(token_embeddings, span_annotation):
        <span class="hljs-keyword">if</span> (
            max_length <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>
        ):
            annotations = [
                (start, <span class="hljs-built_in">min</span>(end, max_length - <span class="hljs-number">1</span>))
                <span class="hljs-keyword">for</span> (start, end) <span class="hljs-keyword">in</span> annotations
                <span class="hljs-keyword">if</span> start &lt; (max_length - <span class="hljs-number">1</span>)
            ]
        pooled_embeddings = []
        <span class="hljs-keyword">for</span> start, end <span class="hljs-keyword">in</span> annotations:
            <span class="hljs-keyword">if</span> (end - start) &gt;= <span class="hljs-number">1</span>:
                pooled_embeddings.append(
                    embeddings[start:end].<span class="hljs-built_in">sum</span>(dim=<span class="hljs-number">0</span>) / (end - start)
                )
                    
        pooled_embeddings = [
            embedding.detach().cpu().numpy() <span class="hljs-keyword">for</span> embedding <span class="hljs-keyword">in</span> pooled_embeddings
        ]
        outputs.append(pooled_embeddings)

    <span class="hljs-keyword">return</span> outputs
<button class="copy-code-btn"></button></code></pre>
<p>Por ejemplo, chunking con jinaai/jina-embeddings-v2-base-es:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>Sugerencia:</em> Envolver el proceso en funciones facilita el intercambio con otros modelos de contexto largo o estrategias de fragmentación.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">Comparación con los métodos de incrustación tradicionales</h3><p>Para seguir demostrando las ventajas de Late Chunking, también lo comparamos con los métodos de incrustación tradicionales, utilizando un conjunto de documentos y consultas de ejemplo.</p>
<p>Volvamos a nuestro ejemplo de Milvus 2.4.13 release note:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>Medimos <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">la similitud coseno</a> entre la incrustación de la consulta ("milvus 2.4.13") y cada trozo:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>El chunking tardío superó sistemáticamente al chunking tradicional, obteniendo mayores similitudes coseno en cada trozo. Esto confirma que incrustar primero el documento completo preserva el contexto global de forma más eficaz.</p>
<pre><code translate="no"><span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.8785206</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.8354263</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84828955</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.7222632</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84942204</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.6907381</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.85431844</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.71859795</span>
<button class="copy-code-btn"></button></code></pre>
<p>Podemos ver que incrustar primero el párrafo completo garantiza que cada trozo contenga el contexto "<code translate="no">Milvus 2.4.13</code>", lo que aumenta las puntuaciones de similitud y la calidad de la recuperación.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Prueba de la fragmentación tardía en Milvus</strong></h3><p>Una vez generados los chunk embeddings, podemos almacenarlos en Milvus y realizar consultas. El siguiente código inserta vectores de trozos en la colección.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Importación de incrustaciones en Milvus</strong></h4><pre><code translate="no">batch_data=[]
<span class="hljs-keyword">for</span> i in <span class="hljs-keyword">range</span>(<span class="hljs-built_in">len</span>(chunks)):
    data = {
            <span class="hljs-string">&quot;content&quot;</span>: chunks[i],
            <span class="hljs-string">&quot;embedding&quot;</span>: chunk_embeddings[i].tolist(),
        }

    batch_data.<span class="hljs-built_in">append</span>(data)

res = client.insert(
    collection_name=collection,
    data=batch_data,
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Querying-and-Validation" class="common-anchor-header">Consultas y validación</h4><p>Para validar la precisión de las consultas de Milvus, comparamos sus resultados de recuperación con las puntuaciones de similitud coseno de fuerza bruta calculadas manualmente. Si ambos métodos devuelven resultados top-k coherentes, podemos estar seguros de que la precisión de la búsqueda de Milvus es fiable.</p>
<p>Comparamos la búsqueda nativa de Milvus con un análisis de similitud coseno de fuerza bruta:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_milvus</span>(<span class="hljs-params">query, top_k = <span class="hljs-number">3</span></span>):
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    res = client.search(
                collection_name=collection,
                data=[query_vector.tolist()],
                limit=top_k,
                output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>],
            )

    <span class="hljs-keyword">return</span> [item.get(<span class="hljs-string">&quot;entity&quot;</span>).get(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">for</span> items <span class="hljs-keyword">in</span> res <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> items]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_cosine_sim</span>(<span class="hljs-params">query, k = <span class="hljs-number">3</span></span>):
    cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    results = np.empty(<span class="hljs-built_in">len</span>(chunk_embeddings))
    <span class="hljs-keyword">for</span> i, (chunk, embedding) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, chunk_embeddings)):
        results[i] = cos_sim(query_vector, embedding)

    results_order = results.argsort()[::-<span class="hljs-number">1</span>]
    <span class="hljs-keyword">return</span> np.array(chunks)[results_order].tolist()[:k]
<button class="copy-code-btn"></button></code></pre>
<p>Esto confirma que Milvus devuelve los mismos trozos top-k que un escaneo manual de similitud coseno.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>Así pues, ambos métodos devuelven los mismos trozos top-3, lo que confirma la precisión de Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>En este artículo hemos profundizado en la mecánica y las ventajas del Late Chunking. Empezamos identificando las deficiencias de los enfoques tradicionales del chunking, especialmente cuando se manejan documentos largos en los que es crucial preservar el contexto. Introdujimos el concepto de Late Chunking -integrar todo el documento antes de dividirlo en trozos significativos- y demostramos cómo esto preserva el contexto global, lo que mejora la similitud semántica y la precisión de la recuperación.</p>
<p>A continuación, realizamos una implementación práctica con el modelo jina-embeddings-v2-base-en de Jina AI y evaluamos su rendimiento en comparación con los métodos tradicionales. Por último, demostramos cómo integrar los chunk embeddings en Milvus para una búsqueda vectorial escalable y precisa.</p>
<p>Late Chunking ofrece un enfoque de incrustación <strong>que da prioridad al</strong> contexto, perfecto para documentos largos y complejos en los que el contexto es lo más importante. Al incrustar todo el texto por adelantado y trocearlo más tarde, usted gana:</p>
<ul>
<li><p><strong>🔍 Mayor precisión en la recuperación</strong></p></li>
<li><p>⚡ A <strong>visos LLM ágiles y centrados</strong></p></li>
<li><p>🛠️ <strong>Integración sencilla</strong> con cualquier modelo de contexto largo</p></li>
</ul>
