---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: >-
  De los PDF a las respuestas: Creación de una base de conocimientos RAG con
  PaddleOCR, Milvus y ERNIE
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: >-
  Aprenda a construir una base de conocimientos RAG de alta precisión utilizando
  Milvus, búsqueda híbrida, reordenación y preguntas y respuestas multimodales
  para la inteligencia documental.
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>Los grandes modelos lingüísticos son mucho más capaces que en 2023, pero siguen alucinando con la confianza y a menudo recurren a información obsoleta. RAG (Retrieval-Augmented Generation) aborda ambos problemas recuperando el contexto relevante de una base de datos vectorial como <a href="https://milvus.io/">Milvus</a> antes de que el modelo genere una respuesta. Ese contexto adicional fundamenta la respuesta en fuentes reales y la hace más actual.</p>
<p>Uno de los casos de uso más comunes de RAG es la base de conocimientos de una empresa. Un usuario carga archivos PDF, Word u otros documentos internos, formula una pregunta en lenguaje natural y recibe una respuesta basada en esos materiales y no únicamente en el preentrenamiento del modelo.</p>
<p>Pero utilizar el mismo LLM y la misma base de datos vectorial no garantiza el mismo resultado. Dos equipos pueden construir sobre los mismos cimientos y aun así acabar con una calidad de sistema muy diferente. La diferencia suele venir de todo lo anterior: <strong>cómo se analizan, agrupan e incrustan los documentos; cómo se indexan los datos; cómo se clasifican los resultados de la recuperación; y cómo se ensambla la respuesta final.</strong></p>
<p>En este artículo, utilizaremos <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> como ejemplo y explicaremos cómo construir una base de conocimiento basada en RAG con <a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>, <a href="https://milvus.io/">Milvus</a> y ERNIE-4.5-Turbo.</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Arquitectura del sistema Paddle-ERNIE-RAG<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>La arquitectura Paddle-ERNIE-RAG consta de cuatro capas principales:</p>
<ul>
<li><strong>Capa de extracción de datos.</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3</a>, el proceso de análisis de documentos en PaddleOCR, lee PDF e imágenes con OCR compatible con el diseño. Conserva la estructura del documento (encabezados, tablas, orden de lectura) y genera un Markdown limpio, dividido en trozos superpuestos.</li>
<li><strong>Capa de almacenamiento vectorial.</strong> Cada trozo se integra en un vector de 384 dimensiones y se almacena en <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> junto con los metadatos (nombre del archivo, número de página, ID del trozo). Un índice invertido paralelo permite la búsqueda por palabras clave.</li>
<li><strong>Capa de recuperación y respuesta.</strong> Cada consulta se ejecuta tanto en el índice vectorial como en el índice de palabras clave. Los resultados se fusionan mediante RRF (Reciprocal Rank Fusion), se renumeran y se pasan al modelo <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a> para generar la respuesta.</li>
<li><strong>Capa de aplicación.</strong> La interfaz de<a href="https://www.gradio.app/">Gradio</a> <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/"></a> permite cargar documentos, formular preguntas y ver las respuestas con citas de fuentes y puntuaciones de confianza.  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>Las secciones siguientes recorren cada etapa en orden, empezando por cómo los documentos sin procesar se convierten en texto susceptible de búsqueda.</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">Cómo crear una canalización RAG paso a paso<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">Paso 1: Analizar documentos con PP-StructureV3</h3><p>Los documentos sin procesar son el punto de partida de la mayoría de los problemas de precisión. Los artículos de investigación y los informes técnicos mezclan diseños a dos columnas, fórmulas, tablas e imágenes. Extraer el texto con una biblioteca básica como PyPDF2 suele distorsionar el resultado: los párrafos aparecen desordenados, las tablas se colapsan y las fórmulas desaparecen.</p>
<p>Para evitar estos problemas, el proyecto crea una clase OnlinePDFParser en backend.py. Esta clase llama a la API en línea de PP-StructureV3 para analizar el diseño. En lugar de extraer el texto en bruto, identifica la estructura del documento y luego lo convierte en formato Markdown.</p>
<p>Este método tiene tres claras ventajas:</p>
<ul>
<li><strong>Salida Markdown limpia</strong></li>
</ul>
<p>La salida se formatea como Markdown con encabezados y párrafos adecuados. Esto facilita la comprensión del contenido por parte del modelo.</p>
<ul>
<li><strong>Extracción de imágenes por separado</strong></li>
</ul>
<p>El sistema extrae y guarda las imágenes durante el análisis sintáctico. Esto evita que se pierda información visual importante.</p>
<ul>
<li><strong>Mejor gestión del contexto</strong></li>
</ul>
<p>El texto se divide mediante una ventana deslizante con solapamiento. Esto evita cortar frases o fórmulas por la mitad, lo que ayuda a mantener claro el significado y mejora la precisión de la búsqueda.</p>
<p><strong>Flujo básico de análisis sintáctico</strong></p>
<p>En backend.py, el análisis sintáctico sigue tres sencillos pasos:</p>
<ol>
<li>Enviar el archivo PDF a la API PP-StructureV3.</li>
<li>Leer el layoutParsingResults devuelto.</li>
<li>Extraer el texto Markdown limpio y las imágenes.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">Paso 2: Trocear el texto con la superposición de ventanas deslizantes</h3><p>Tras el análisis sintáctico, el texto Markdown debe dividirse en trozos más pequeños (chunks) para la búsqueda. Si el texto se corta en trozos de longitud fija, las frases o fórmulas pueden partirse por la mitad.</p>
<p>Para evitarlo, el sistema utiliza la fragmentación por ventanas deslizantes con solapamiento. Cada trozo comparte una parte de la cola con el siguiente, de modo que el contenido del límite aparece en ambas ventanas. Esto mantiene intacto el significado en los bordes de los trozos y mejora la recuperación.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">Paso 3: Almacenar vectores y metadatos en Milvus</h3><p>Con los trozos limpios listos, el siguiente paso es almacenarlos de forma que permitan una recuperación rápida y precisa.</p>
<p><strong>Almacenamiento de vectores y metadatos</strong></p>
<p>Milvus aplica reglas estrictas para los nombres de las colecciones: sólo letras ASCII, números y guiones bajos. Si un nombre de base de conocimientos contiene caracteres no ASCII, el backend lo codifica hexadecimalmente con un prefijo kb_ antes de crear la colección y lo descodifica para su visualización. Un pequeño detalle, pero que evita errores crípticos.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>Además de la asignación de nombres, cada fragmento pasa por dos etapas antes de su inserción: la generación de una incrustación y la inclusión de metadatos.</p>
<ul>
<li><strong>Lo que se almacena:</strong></li>
</ul>
<p>Cada trozo se convierte en un vector denso de 384 dimensiones. Al mismo tiempo, el esquema de Milvus almacena campos adicionales como el nombre del archivo, el número de página y el ID del trozo.</p>
<ul>
<li><strong>Por qué es importante:</strong></li>
</ul>
<p>Permite rastrear una respuesta hasta la página exacta de la que procede. También prepara el sistema para futuros casos de uso de preguntas y respuestas multimodales.</p>
<ul>
<li><strong>Optimización del rendimiento:</strong></li>
</ul>
<p>En vector_store.py, el método insert_documents utiliza la incrustación por lotes. Esto reduce el número de peticiones de red y hace que el proceso sea más eficiente.</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">Paso 4: Recuperar con búsqueda híbrida y fusión RRF</h3><p>Un único método de búsqueda rara vez es suficiente. La búsqueda vectorial encuentra contenidos semánticamente similares pero puede pasar por alto términos exactos; la búsqueda por palabras clave encuentra términos específicos pero pasa por alto paráfrasis. Ejecutar ambos métodos en paralelo y fusionarlos produce mejores resultados que cualquiera de ellos por separado.</p>
<p>Cuando el idioma de la consulta difiere del idioma del documento, el sistema traduce primero la consulta mediante un LLM para que ambas vías de búsqueda puedan operar en el idioma del documento. A continuación, se ejecutan dos búsquedas en paralelo:</p>
<ul>
<li><strong>Búsqueda vectorial (densa):</strong> Encuentra contenidos con significados similares, incluso en distintos idiomas, pero puede mostrar pasajes relacionados que no respondan directamente a la pregunta.</li>
<li><strong>Búsqueda por palabras clave (dispersa):</strong> Encuentra coincidencias exactas de términos técnicos, números o variables de fórmulas, el tipo de tokens que las incrustaciones vectoriales suelen suavizar.</li>
</ul>
<p>El sistema fusiona ambas listas de resultados mediante RRF (Reciprocal Rank Fusion). Cada candidato recibe una puntuación basada en su rango en cada lista, de modo que un fragmento que aparece cerca de la parte superior de <em>ambas</em> listas obtiene la puntuación más alta. La búsqueda vectorial contribuye a la cobertura semántica; la búsqueda por palabras clave contribuye a la precisión de los términos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">Paso 5: Volver a clasificar los resultados antes de generar las respuestas</h3><p>Los trozos devueltos por el paso de búsqueda no son igual de relevantes. Por eso, antes de generar la respuesta final, un paso de reordenación los vuelve a clasificar.</p>
<p>En reranker_v2.py, un método de puntuación combinado evalúa cada trozo, que se puntúa desde cinco aspectos:</p>
<ul>
<li><strong>Emparejamiento difuso</strong></li>
</ul>
<p>Con fuzzywuzzy, comprobamos la similitud entre el texto del chunk y el de la consulta. Esto mide el solapamiento directo del texto.</p>
<ul>
<li><strong>Cobertura de palabras clave</strong></li>
</ul>
<p>Se comprueba cuántas palabras importantes de la consulta aparecen en el fragmento. Cuantas más palabras clave coincidan, mayor será la puntuación.</p>
<ul>
<li><strong>Similitud semántica</strong></li>
</ul>
<p>Reutilizamos la puntuación de similitud vectorial devuelta por Milvus. Refleja la proximidad de los significados.</p>
<ul>
<li><strong>Longitud y rango original</strong></li>
</ul>
<p>Los trozos muy cortos se penalizan porque a menudo carecen de contexto. Los fragmentos mejor clasificados en los resultados originales de Milvus reciben una pequeña bonificación.</p>
<ul>
<li><strong>Detección de entidades con nombre</strong></li>
</ul>
<p>El sistema detecta términos en mayúsculas como "Milvus" o "RAG" como posibles nombres propios, e identifica términos técnicos de varias palabras como posibles frases clave.</p>
<p>Cada factor tiene un peso en la puntuación final (que se muestra en la siguiente figura).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No requiere datos de entrenamiento y la contribución de cada factor es visible. Si un fragmento se clasifica inesperadamente alto o bajo, las puntuaciones explican por qué. Un reranker de caja negra no ofrece esta posibilidad.</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">Paso 6: Añadir preguntas y respuestas multimodales para gráficos y diagramas</h3><p>Los trabajos de investigación suelen contener gráficos y diagramas importantes que aportan información que el texto no proporciona. Si sólo se utilizara texto, esas señales se perderían por completo.  Para ello, hemos añadido una sencilla función de preguntas y respuestas basada en imágenes que consta de tres partes:</p>
<p><strong>1. 1. Añadir más contexto a la pregunta</strong></p>
<p>Al enviar una imagen al modelo, el sistema también obtiene el texto OCR de la misma página.<br>
La pregunta incluye: la imagen, el texto de la página y la pregunta del usuario.<br>
Esto ayuda al modelo a comprender el contexto completo y reduce los errores al leer la imagen.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Soporte de Vision API</strong></p>
<p>El cliente (ernie_client.py) soporta el formato de visión OpenAI. Las imágenes se convierten a Base64 y se envían en el formato image_url, que permite al modelo procesar tanto la imagen como el texto juntos.</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Plan de emergencia</strong></p>
<p>Si la API de imagen falla (por ejemplo, por problemas de red o límites del modelo), el sistema vuelve al GAR normal basado en texto.<br>
Utiliza el texto OCR para responder a la pregunta, de modo que el sistema sigue funcionando sin interrupción.</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">Funciones clave de la interfaz de usuario e implementación de Pipeline<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">Cómo gestionar la limitación de velocidad y la protección de la API</h3><p>Al llamar a LLM o incrustar APIs, el sistema puede recibir a veces un error <strong>429 Too Many Requests</strong>. Esto suele ocurrir cuando se envían demasiadas solicitudes en poco tiempo.</p>
<p>Para gestionar esto, el proyecto añade un mecanismo de ralentización adaptativo en ernie_client.py. Si se produce un error de límite de velocidad, el sistema reduce automáticamente la velocidad de petición y reintenta en lugar de detenerse.</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Esto ayuda a mantener la estabilidad del sistema, especialmente cuando se procesan e incrustan grandes cantidades de documentos.</p>
<h3 id="Custom-Styling" class="common-anchor-header">Estilo personalizado</h3><p>El frontend utiliza Gradio (main.py). Hemos añadido CSS personalizado (modern_css) para hacer la interfaz más limpia y fácil de usar.</p>
<ul>
<li><strong>Caja de entrada</strong></li>
</ul>
<p>Cambiado del estilo gris por defecto a un diseño blanco y redondeado. Parece más sencillo y moderno.</p>
<ul>
<li><strong>Botón de envío</strong></li>
</ul>
<p>Se ha añadido un color degradado y un efecto hover para que destaque más.</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">Representación de fórmulas LaTeX</h3><p>Muchos documentos de investigación contienen fórmulas matemáticas, por lo que una representación correcta es importante. Hemos añadido soporte LaTeX completo para fórmulas en línea y en bloque.</p>
<ul>
<li><strong>Dónde se aplica</strong>La configuración funciona tanto en la ventana de chat (Chatbot) como en el área de resumen (Markdown).</li>
<li><strong>Resultado práctico</strong>Tanto si las fórmulas aparecen en la respuesta del modelo como en los resúmenes del documento, se renderizan correctamente en la página.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">Explicabilidad: Puntuaciones de relevancia y confianza</h3><p>Para evitar una experiencia de "caja negra", el sistema muestra dos indicadores sencillos:</p>
<ul>
<li><p><strong>Relevancia</strong></p></li>
<li><p>Se muestra debajo de cada respuesta en la sección "Referencias".</p></li>
<li><p>Muestra la puntuación reranker de cada fragmento citado.</p></li>
<li><p>Ayuda a los usuarios a ver por qué se ha utilizado una página o un pasaje concretos.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>Confianza</strong></p></li>
<li><p>Se muestra en el panel "Detalles del análisis".</p></li>
<li><p>Se basa en la puntuación del fragmento superior (escalada al 100%).</p></li>
<li><p>Muestra el grado de confianza del sistema en la respuesta.</p></li>
<li><p>Si está por debajo del 60%, la respuesta puede ser menos fiable.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>La interfaz de usuario se muestra a continuación. En la interfaz, cada respuesta muestra el número de página de la fuente y su puntuación de relevancia.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>La precisión de RAG depende de la ingeniería entre un LLM y una base de datos vectorial. Este artículo recorrió una construcción <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> con <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> que cubre cada etapa de esa ingeniería:</p>
<ul>
<li><strong>Análisis sintáctico de documentos.</strong> PP-StructureV3 (vía <a href="https://github.com/PaddlePaddle/PaddleOCR"></a><a href="https://github.com/PaddlePaddle/PaddleOCR">PaddleOCR</a>) convierte PDFs en Markdown limpio con OCR consciente del diseño, preservando encabezados, tablas e imágenes que los extractores básicos pierden.</li>
<li><strong>Agrupación.</strong> Las divisiones de ventana deslizante con solapamiento mantienen el contexto intacto en los límites de los trozos, evitando los fragmentos rotos que perjudican la recuperación.</li>
<li><strong>Almacenamiento de vectores en Milvus.</strong> Almacene los vectores de forma que permitan una recuperación rápida y precisa.</li>
<li><strong>Búsqueda híbrida.</strong> Ejecutando la búsqueda vectorial y la búsqueda por palabras clave en paralelo, y fusionando los resultados con RRF (Reciprocal Rank Fusion), se obtienen coincidencias semánticas y de términos exactos que cualquiera de los dos métodos por separado pasaría por alto.</li>
<li><strong>Reordenación.</strong> Un reordenador transparente basado en reglas puntúa cada fragmento en función de la coincidencia difusa, la cobertura de palabras clave, la similitud semántica, la longitud y la detección de nombres propios.</li>
<li><strong>Preguntas y respuestas multimodales.</strong> El emparejamiento de imágenes con texto de página OCR en la consulta proporciona al modelo de visión el contexto suficiente para responder a preguntas sobre gráficos y diagramas, con una alternativa de sólo texto si falla la API de imágenes.</li>
</ul>
<p>Si está creando un sistema RAG para preguntas y respuestas sobre documentos y desea mejorar la precisión, nos encantaría saber cómo lo está enfocando.</p>
<p>¿Tiene preguntas sobre <a href="https://milvus.io/">Milvus</a>, la búsqueda híbrida o el diseño de bases de conocimiento? Únase a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> o reserve una sesión de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de Milvus Office Hours</a> para discutir su caso de uso.</p>
