---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: >-
  DeepSeek V3-0324: La "actualización menor" que está aplastando a los mejores
  modelos de IA
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  DeepSeek v3-0324 se entrena con parámetros más amplios, tiene una ventana de
  contexto más larga y funciones mejoradas de razonamiento, codificación y
  matemáticas.
cover: assets.zilliz.com/Deep_Seek_V3_0324_033f6ff001.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>DeepSeek dejó caer una bomba anoche. Su última versión,<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324</a>, fue presentada en el anuncio oficial como una <strong>"actualización menor"</strong> sin cambios en la API. Pero nuestras exhaustivas pruebas en <a href="https://zilliz.com/">Zilliz</a> han revelado algo más significativo: esta actualización representa un salto cuántico en el rendimiento, especialmente en el razonamiento lógico, la programación y la resolución de problemas matemáticos.</p>
<p>Lo que estamos viendo no es sólo una mejora incremental, sino un cambio fundamental que sitúa a DeepSeek v3-0324 en la élite de los modelos lingüísticos. Y es de código abierto.</p>
<p><strong>Esta versión merece la atención inmediata de los desarrolladores y las empresas que crean aplicaciones basadas en IA.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">¿Qué hay de nuevo en DeepSeek v3-0324 y en qué medida es realmente bueno?<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324 introduce tres importantes mejoras con respecto a su predecesor, <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v3</a>:</p>
<ul>
<li><p><strong>Modelo más grande, más potencia:</strong> el número de parámetros ha aumentado de 671.000 millones a 685.000 millones, lo que permite al modelo manejar razonamientos más complejos y generar respuestas más matizadas.</p></li>
<li><p><strong>Una ventana de contexto masiva:</strong> Con una longitud de contexto mejorada de 128.000 tokens, DeepSeek v3-0324 puede retener y procesar mucha más información en una sola consulta, lo que lo hace ideal para conversaciones largas, análisis de documentos y aplicaciones de inteligencia artificial basadas en la recuperación.</p></li>
<li><p><strong>Razonamiento, codificación y matemáticas mejorados:</strong> Esta actualización supone un notable aumento de las capacidades lógicas, de programación y matemáticas, lo que lo convierte en un fuerte competidor para la codificación asistida por IA, la investigación científica y la resolución de problemas a nivel empresarial.</p></li>
</ul>
<p>Pero las cifras en bruto no lo dicen todo. Lo realmente impresionante es cómo DeepSeek ha logrado mejorar simultáneamente la capacidad de razonamiento y la eficiencia de generación, algo que normalmente implica concesiones en ingeniería.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">La salsa secreta: Innovación arquitectónica</h3><p>DeepSeek v3-0324 mantiene su arquitectura <a href="https://arxiv.org/abs/2502.07864">de atención latente multicabezal (MLA </a>), un mecanismo eficaz que comprime cachés de valores clave (KV) mediante vectores latentes para reducir el uso de memoria y la carga computacional durante la inferencia. Además, sustituye las tradicionales <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">redes de alimentación directa (FFN</a> ) por capas de mezcla de expertos<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE</a>), lo que optimiza la eficiencia computacional activando dinámicamente a los expertos con mejor rendimiento para cada token.</p>
<p>Sin embargo, la mejora más interesante es la <strong>predicción multi-token (MTP),</strong> que permite a cada token predecir simultáneamente varios tokens futuros. De este modo se supera un importante cuello de botella de los modelos autorregresivos tradicionales, mejorando tanto la precisión como la velocidad de inferencia.</p>
<p>Juntas, estas innovaciones crean un modelo que no sólo se escala bien, sino que se escala de forma inteligente, poniendo las capacidades de IA de nivel profesional al alcance de más equipos de desarrollo.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">Cree un sistema RAG con Milvus y DeepSeek v3-0324 en 5 minutos<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Las potentes capacidades de razonamiento de DeepSeek v3-0324 lo convierten en un candidato ideal para los sistemas de generación mejorada de recuperación (RAG). En este tutorial, le mostraremos cómo construir una tubería RAG completa utilizando DeepSeek v3-0324 y la base de datos vectorial <a href="https://zilliz.com/what-is-milvus">Milvus</a> en sólo cinco minutos. Aprenderá a recuperar y sintetizar conocimientos de forma eficiente con una configuración mínima.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Configuración del entorno</h3><p>En primer lugar, vamos a instalar las dependencias necesarias:</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong> Si estás utilizando Google Colab, tendrás que reiniciar el tiempo de ejecución después de instalar estos paquetes. Haga clic en el menú "Runtime" en la parte superior de la pantalla y seleccione "Reiniciar sesión" en el menú desplegable.</p>
<p>Como DeepSeek proporciona una API compatible con OpenAI, necesitarás una clave API. Puede obtenerla registrándose en la<a href="https://platform.deepseek.com/api_keys"> plataforma DeepSeek</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">Preparación de los datos</h3><p>Para este tutorial, utilizaremos las páginas de preguntas frecuentes de la <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Documentación de Milvus 2.4.x</a> como nuestra fuente de conocimiento:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Ahora, carguemos y preparemos el contenido de las FAQ a partir de los archivos markdown:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">Configuración del lenguaje e incrustación de modelos</h3><p>Utilizaremos <a href="https://openrouter.ai/">OpenRouter</a> para acceder a DeepSeek v3-0324. OpenRouter proporciona una API unificada para múltiples modelos de IA, como DeepSeek y Claude. Creando una clave API gratuita de DeepSeek V3 en OpenRouter, podrás probar fácilmente DeepSeek V3 0324.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Para la incrustación de texto, utilizaremos el <a href="https://milvus.io/docs/embeddings.md">modelo de incrustación integrado</a> de Milvus, que es ligero y eficaz:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Creación de una colección Milvus</h3><p>Ahora vamos a configurar nuestra base de datos vectorial utilizando Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using Milvus Lite for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># See https://milvus.io/docs/consistency.md for details</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Consejo profesional</strong>: Para diferentes escenarios de despliegue, puede ajustar la configuración de Milvus:</p>
<ul>
<li><p>Para el desarrollo local: Utilice <code translate="no">uri=&quot;./milvus.db&quot;</code> con <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a></p></li>
<li><p>Para conjuntos de datos más grandes: Configure un servidor Milvus a través de <a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a> y utilice <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>Para producción: Utilice<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> con su punto final de nube y clave API.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Carga de datos en Milvus</h3><p>Convirtamos nuestros datos de texto en incrustaciones y almacenémoslos en Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

<span class="hljs-comment"># Create embeddings for all text chunks</span>
data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-comment"># Create records with IDs, vectors, and text</span>
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

<span class="hljs-comment"># Insert data into Milvus</span>
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Creating embeddings:   0%|          | 0/72 [00:00&lt;?, ?it/s]huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To <span class="hljs-built_in">disable</span> this warning, you can either:
    - Avoid using `tokenizers` before the fork <span class="hljs-keyword">if</span> possible
    - Explicitly <span class="hljs-built_in">set</span> the environment variable TOKENIZERS_PARALLELISM=(<span class="hljs-literal">true</span> | <span class="hljs-literal">false</span>)
Creating embeddings: 100%|██████████| 72/72 [00:00&lt;00:00, 246522.36it/s]





{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">Construir la canalización RAG</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">Paso 1: Recuperar información relevante</h4><p>Probemos nuestro sistema RAG con una pregunta común:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Search for relevant information</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]),  <span class="hljs-comment"># Convert question to embedding</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)

<span class="hljs-comment"># Examine search results</span>
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">Paso 2: Generar una respuesta con DeepSeek</h4><p>Ahora vamos a utilizar DeepSeek para generar una respuesta basada en la información recuperada:</p>
<pre><code translate="no"><span class="hljs-comment"># Combine retrieved text chunks</span>
context = <span class="hljs-string">&quot;\n&quot;</span>.join(
    [line_with_distance[<span class="hljs-number">0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)

<span class="hljs-comment"># Define prompts for the language model</span>
SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>

<span class="hljs-comment"># Generate response with DeepSeek</span>
response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-chat&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)

<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: inserted data <span class="hljs-keyword">and</span> metadata.

<span class="hljs-number">1.</span> **Inserted Data**: This includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema. The inserted data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, such <span class="hljs-keyword">as</span> MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).

2. **Metadata**: Metadata <span class="hljs-keyword">is</span> generated within Milvus <span class="hljs-keyword">and</span> <span class="hljs-keyword">is</span> specific to each Milvus module. This metadata <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> etcd, a distributed key-<span class="hljs-keyword">value</span> store.

Additionally, <span class="hljs-keyword">when</span> data <span class="hljs-keyword">is</span> inserted, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue, <span class="hljs-keyword">and</span> Milvus returns success at <span class="hljs-keyword">this</span> stage. The data <span class="hljs-keyword">is</span> then written to persistent storage <span class="hljs-keyword">as</span> incremental logs <span class="hljs-keyword">by</span> the data node. If the `<span class="hljs-title">flush</span>()` function <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<p>¡Y ya está! Ha construido con éxito una tubería RAG completa con DeepSeek v3-0324 y Milvus. Este sistema puede ahora responder a preguntas basadas en la documentación de Milvus con gran precisión y conocimiento contextual.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">Comparación de DeepSeek-V3-0324: Versión original frente a la mejorada con RAG<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>La teoría es una cosa, pero lo que importa es el rendimiento en el mundo real. Hemos probado tanto la versión estándar de DeepSeek v3-0324 (con la función "Deep Thinking" desactivada) como nuestra versión mejorada con RAG con la misma pregunta: <em>Escribir código HTML para crear un sitio web elegante sobre Milvus.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">Sitio web creado con el código de salida del modelo estándar</h3><p>Este es el aspecto del sitio web:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Aunque visualmente es atractivo, el contenido se basa en gran medida en descripciones genéricas y omite muchas de las principales características técnicas de Milvus.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">Sitio web creado con código generado por la versión mejorada de RAG</h3><p>Cuando integramos Milvus como base de conocimientos, los resultados fueron radicalmente diferentes:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El último sitio web no sólo tiene mejor aspecto, sino que demuestra una verdadera comprensión de la arquitectura, los casos de uso y las ventajas técnicas de Milvus.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">¿Puede DeepSeek v3-0324 sustituir a los modelos de razonamiento específicos?<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestro descubrimiento más sorprendente se produjo al comparar DeepSeek v3-0324 con modelos de razonamiento especializados como Claude 3.7 Sonnet y GPT-4 Turbo en tareas de razonamiento matemático, lógico y de código.</p>
<p>Aunque los modelos de razonamiento especializados destacan en la resolución de problemas en varios pasos, a menudo lo hacen a costa de la eficiencia. Nuestras pruebas han demostrado que los modelos de razonamiento intensivo a menudo sobreanalizan peticiones sencillas, generando entre 2 y 3 veces más tokens de los necesarios y aumentando significativamente la latencia y los costes de la API.</p>
<p>DeepSeek v3-0324 adopta un enfoque diferente. Demuestra una coherencia lógica comparable, pero con una concisión notablemente mayor, produciendo a menudo soluciones correctas con un 40-60% menos de tokens. Esta eficiencia no va en detrimento de la precisión; en nuestras pruebas de generación de código, las soluciones de DeepSeek igualaron o superaron la funcionalidad de las de los competidores centrados en el razonamiento.</p>
<p>Para los desarrolladores que equilibran el rendimiento con las limitaciones presupuestarias, esta ventaja de eficiencia se traduce directamente en menores costes de API y tiempos de respuesta más rápidos, factores cruciales para las aplicaciones de producción en las que la experiencia del usuario depende de la velocidad percibida.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">El futuro de los modelos de IA: Desdibujando la división del razonamiento<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>El rendimiento de DeepSeek v3-0324 pone en tela de juicio un supuesto básico en el sector de la IA: que el razonamiento y la eficiencia representan un compromiso inevitable. Esto sugiere que nos estamos acercando a un punto de inflexión en el que la distinción entre modelos razonadores y no razonadores empieza a difuminarse.</p>
<p>Los principales proveedores de IA podrían acabar eliminando por completo esta distinción, desarrollando modelos que ajusten dinámicamente la profundidad de su razonamiento en función de la complejidad de la tarea. Este razonamiento adaptativo optimizaría tanto la eficiencia computacional como la calidad de la respuesta, revolucionando potencialmente la forma en que construimos e implantamos las aplicaciones de IA.</p>
<p>Para los desarrolladores que construyen sistemas RAG, esta evolución promete soluciones más rentables que ofrecen la profundidad de razonamiento de los modelos premium sin su sobrecarga computacional, ampliando lo que es posible con la IA de código abierto.</p>
