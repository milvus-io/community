---
id: how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
title: 'Cómo construir RAG multimodal con ColQwen2, Milvus y Qwen3.5'
author: Lumina Wang
date: 2026-3-6
cover: assets.zilliz.com/download_11zon_1862455eb4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_keywords: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_title: |
  How to Build Multimodal RAG with ColQwen2, Milvus, Qwen3.5
desc: >-
  Construya una canalización RAG multimodal que recupere imágenes de páginas PDF
  en lugar de texto extraído, utilizando ColQwen2, Milvus y Qwen3.5. Tutorial
  paso a paso.
origin: >-
  https://milvus.io/blog/how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
---
<p>Hoy en día, puedes subir un PDF a cualquier LLM moderno y hacer preguntas sobre él. Para un puñado de documentos, eso funciona bien. Pero la mayoría de los LLM tienen un límite máximo de unos cientos de páginas de contexto, por lo que un corpus grande simplemente no cabe. Incluso si cabe, hay que pagar para procesar cada página en cada consulta. Si se hacen cien preguntas sobre el mismo conjunto de documentos de 500 páginas, se paga cien veces por 500 páginas. Eso sale caro enseguida.</p>
<p>La generación aumentada por recuperación (RAG) resuelve este problema separando la indexación de la respuesta. Los documentos se codifican una vez, las representaciones se almacenan en una base de datos vectorial y, en el momento de la consulta, sólo se recuperan las páginas más relevantes para enviarlas al LLM. El modelo lee tres páginas por consulta, no todo el corpus. Esto hace que sea práctico construir Q&amp;A de documentos sobre colecciones que siguen creciendo.</p>
<p>Este tutorial le guiará a través de la construcción de una canalización RAG multimodal con tres componentes de licencia abierta:</p>
<ul>
<li><strong><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">ColQwen2</a></strong> <a href="https://huggingface.co/vidore/colqwen2-v1.0-merged"></a>codifica cada página PDF como una imagen en incrustaciones multivectoriales, reemplazando el paso tradicional de OCR y fragmentación de texto.</li>
<li><strong><a href="http://milvus.io">Milvus</a></strong> almacena esos vectores y gestiona la búsqueda de similitudes en el momento de la consulta, recuperando sólo las páginas más relevantes.</li>
<li><strong><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></strong> lee las imágenes de las páginas recuperadas y genera una respuesta basada en lo que ve.</li>
</ul>
<p>Al final, tendrás un sistema operativo que toma un PDF y una pregunta, encuentra las páginas más relevantes y devuelve una respuesta basada en lo que ve el modelo.</p>
<h2 id="What-is-Multimodal-RAG" class="common-anchor-header">¿Qué es RAG multimodal?<button data-href="#What-is-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>En la introducción hemos explicado por qué la GAR es importante a gran escala. La siguiente pregunta es qué tipo de GAR se necesita, porque el enfoque tradicional tiene un punto ciego.</p>
<p>La GAR tradicional extrae texto de los documentos, lo incorpora como vectores, recupera las coincidencias más cercanas en el momento de la consulta y pasa esos trozos de texto a un LLM. Esto funciona bien para contenidos con mucho texto y un formato limpio. Se rompe cuando sus documentos contienen</p>
<ul>
<li>Tablas, cuyo significado depende de la relación entre filas, columnas y encabezados.</li>
<li>Gráficos y diagramas, donde la información es totalmente visual y no tiene equivalente en texto.</li>
<li>Documentos escaneados o notas manuscritas, en los que el resultado del OCR es poco fiable o incompleto.</li>
</ul>
<p>El GAR multimodal sustituye la extracción de texto por la codificación de imágenes. Se representa cada página como una imagen, se codifica con un modelo de lenguaje visual y se recuperan las imágenes de las páginas en el momento de la consulta. El LLM ve la página original (tablas, figuras, formato y todo lo demás) y responde basándose en lo que ve.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_5_2f55d33896.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="common-anchor-header">Estructura del proceso RAG multimodal: ColQwen2 para la codificación, Milvus para la búsqueda, Qwen3.5 para la generación.<button data-href="#Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-the-Pipeline-Works-httpsassetszillizcomblogColQwen2MilvusQwen35397BA17B284c822b9efpng" class="common-anchor-header">Funcionamiento del proceso  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_2_84c822b9ef.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</h3><h3 id="Tech-Stack" class="common-anchor-header">Pila tecnológica</h3><table>
<thead>
<tr><th><strong>Componente</strong></th><th><strong>Elección</strong></th><th><strong>Función</strong></th></tr>
</thead>
<tbody>
<tr><td>Procesamiento de PDF</td><td>pdf2image + poppler</td><td>Renderiza páginas PDF como imágenes de alta resolución</td></tr>
<tr><td>Modelo de incrustación</td><td><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">colqwen2-v1.0</a></td><td>Modelo de lenguaje visual; codifica cada página en ~755 vectores de parches de 128 dim.</td></tr>
<tr><td>Base de datos de vectores</td><td><a href="https://milvus.io/">Milvus Lite</a></td><td>Almacena vectores de parches y gestiona la búsqueda de similitudes; se ejecuta localmente sin configuración de servidor</td></tr>
<tr><td>Modelo de generación</td><td><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></td><td>LLM multimodal invocado a través de la API OpenRouter; lee imágenes de páginas recuperadas para generar respuestas</td></tr>
</tbody>
</table>
<h2 id="Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="common-anchor-header">Implementación paso a paso de RAG multimodal con ColQwen2+ Milvus+ Qwen3.5-397B-A17B<button data-href="#Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Environment-Setup" class="common-anchor-header">Configuración del entorno</h3><ol>
<li>Instalar las dependencias de Python</li>
</ol>
<pre><code translate="no">pip install colpali-engine pymilvus openai pdf2image torch pillow tqdm
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Instalar Poppler, el motor de renderizado PDF</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># macOS</span>
brew install poppler

<span class="hljs-comment"># Ubuntu/Debian</span>
sudo apt-get install poppler-utils

<span class="hljs-comment"># Windows: download from https://github.com/oschwartz10612/poppler-windows</span>

<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Descargar el modelo de incrustación, ColQwen2</li>
</ol>
<p>Descargue vidore/colqwen2-v1.0-merged de HuggingFace (~4.4 GB) y guárdelo localmente:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/models/colqwen2-v1.0-merged
<span class="hljs-comment"># Download all model files to this directory</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Obtener una clave API OpenRouter</li>
</ol>
<p>Regístrate y genera una clave en <a href="https://openrouter.ai/settings/keys"></a><a href="https://openrouter.ai/settings/keys">https://openrouter.ai/settings/keys.</a></p>
<h3 id="Step-1-Import-Dependencies-and-Configure" class="common-anchor-header">Paso 1: Importar dependencias y configurar</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> pdf2image <span class="hljs-keyword">import</span> convert_from_path

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColQwen2, ColQwen2Processor

<span class="hljs-comment"># --- Configuration ---</span>
EMBED_MODEL = os.path.expanduser(<span class="hljs-string">&quot;~/models/colqwen2-v1.0-merged&quot;</span>)
EMBED_DIM = <span class="hljs-number">128</span>              <span class="hljs-comment"># ColQwen2 output vector dimension</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>  <span class="hljs-comment"># Milvus Lite local file</span>
COLLECTION = <span class="hljs-string">&quot;doc_patches&quot;</span>
TOP_K = <span class="hljs-number">3</span>                    <span class="hljs-comment"># Number of pages to retrieve</span>
CANDIDATE_PATCHES = <span class="hljs-number">300</span>      <span class="hljs-comment"># Candidate patches per query token</span>

<span class="hljs-comment"># OpenRouter LLM config</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;your-api-key-here&gt;&quot;</span>,
)
GENERATION_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>

<span class="hljs-comment"># Device selection</span>
DEVICE = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
DTYPE = torch.bfloat16 <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> torch.float32
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Device: <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Salida: Dispositivo: cpu</p>
<h3 id="Step-2-Load-the-Embedding-Model" class="common-anchor-header">Paso 2: Cargar el modelo de incrustación</h3><p><strong>ColQwen2</strong> es un modelo de lenguaje de visión que codifica imágenes de documentos en representaciones multivectoriales al estilo ColBERT. Cada página produce varios cientos de vectores de parche de 128 dimensiones.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loading embedding model: <span class="hljs-subst">{EMBED_MODEL}</span>&quot;</span>)
emb_model = ColQwen2.from_pretrained(
    EMBED_MODEL,
    torch_dtype=DTYPE,
    attn_implementation=<span class="hljs-string">&quot;flash_attention_2&quot;</span> <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>,
    device_map=DEVICE,
).<span class="hljs-built_in">eval</span>()
emb_processor = ColQwen2Processor.from_pretrained(EMBED_MODEL)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding model ready on <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Salida:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_1_1fbbeba04e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Initialize-Milvus" class="common-anchor-header">Paso 3: Inicializar Milvus</h3><p>Este tutorial utiliza Milvus Lite, que se ejecuta como un archivo local con cero configuración - no se necesita un proceso de servidor separado.</p>
<p><strong>Esquema de la base de datos:</strong></p>
<p><strong>id</strong>: INT64, clave primaria autoincrementada</p>
<p><strong>doc_id</strong>: INT64, número de página (qué página del PDF)</p>
<p><strong>patch_idx</strong>: INT64, índice de parche dentro de esa página</p>
<p><strong>vector</strong>: FLOAT_VECTOR(128), la incrustación de 128 dimensiones del parche</p>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;doc_id&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;patch_idx&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)

index = milvus_client.prepare_index_params()
index.add_index(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)
milvus_client.create_collection(COLLECTION, schema=schema, index_params=index)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus collection created.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Salida: Colección Milvus creada.</p>
<h3 id="Step-4-Convert-PDF-Pages-to-Images" class="common-anchor-header">Paso 4: Convertir páginas PDF en imágenes</h3><p>Renderiza cada página a 150 DPI. Aquí no se realiza ninguna extracción de texto - la tubería trata cada página puramente como una imagen.</p>
<pre><code translate="no">PDF_PATH = <span class="hljs-string">&quot;Milvus vs Zilliz.pdf&quot;</span>  <span class="hljs-comment"># Replace with your own PDF</span>
images = [p.convert(<span class="hljs-string">&quot;RGB&quot;</span>) <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> convert_from_path(PDF_PATH, dpi=<span class="hljs-number">150</span>)]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">len</span>(images)}</span> pages loaded.&quot;</span>)

<span class="hljs-comment"># Preview the first page</span>
images[<span class="hljs-number">0</span>].resize((<span class="hljs-number">400</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">400</span> * images[<span class="hljs-number">0</span>].height / images[<span class="hljs-number">0</span>].width)))
<button class="copy-code-btn"></button></code></pre>
<p>Salida:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_4_8720da8494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Encode-Images-and-Insert-into-Milvus" class="common-anchor-header">Paso 5: Codificar las imágenes e insertarlas en Milvus</h3><p>ColQwen2 codifica cada página en incrustaciones de parches multivectoriales. A continuación, inserta cada parche como una fila separada en Milvus.</p>
<pre><code translate="no"><span class="hljs-comment"># Encode all pages</span>
all_page_embs = []
<span class="hljs-keyword">with</span> torch.no_grad():
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), <span class="hljs-number">2</span>), desc=<span class="hljs-string">&quot;Encoding pages&quot;</span>):
        batch = images[i : i + <span class="hljs-number">2</span>]
        inputs = emb_processor.process_images(batch).to(emb_model.device)
        embs = emb_model(**inputs)
        <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> embs:
            all_page_embs.append(e.cpu().<span class="hljs-built_in">float</span>().numpy())

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Encoded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, ~<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">0</span>]}</span> patches per page, dim=<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">1</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Resultado: 17 páginas codificadas, ~755 parches por página, dim=128</p>
<pre><code translate="no"><span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-keyword">for</span> doc_id, patch_vecs <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(all_page_embs):
    rows = [
        {<span class="hljs-string">&quot;doc_id&quot;</span>: doc_id, <span class="hljs-string">&quot;patch_idx&quot;</span>: j, <span class="hljs-string">&quot;vector&quot;</span>: v.tolist()}
        <span class="hljs-keyword">for</span> j, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(patch_vecs)
    ]
    milvus_client.insert(COLLECTION, rows)

total = milvus_client.get_collection_stats(COLLECTION)[<span class="hljs-string">&quot;row_count&quot;</span>]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Indexed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, <span class="hljs-subst">{total}</span> patches total.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Resultado: 17 páginas indexadas, 12835 parches en total.</p>
<p>Un PDF de 17 páginas produce 12.835 registros de vectores de parches, aproximadamente 755 parches por página.</p>
<h3 id="Step-6-Retrieve--Query-Encoding-+-MaxSim-Reranking" class="common-anchor-header">Paso 6: Recuperación: codificación de la consulta + reordenación MaxSim</h3><p>Este es el núcleo de la lógica de recuperación. Funciona en tres etapas:</p>
<p><strong>Codificar la consulta</strong> en múltiples vectores de símbolos.</p>
<p><strong>Buscar en Milvus</strong> los parches más cercanos a cada vector de símbolos.</p>
<p><strong>Agregación por páginas</strong> mediante MaxSim: para cada token de la consulta, se toma el parche con la puntuación más alta de cada página y, a continuación, se suman las puntuaciones de todos los tokens. La página con la puntuación total más alta es la que mejor coincide.</p>
<p><strong>Cómo funciona MaxSim:</strong> Para cada vector de tokens de consulta, se busca el parche del documento con el producto interno más alto (el "max" en MaxSim). A continuación, se suman las puntuaciones máximas de todos los tokens de la consulta para obtener una puntuación de relevancia total por página. Mayor puntuación = mayor coincidencia semántica entre la consulta y el contenido visual de la página.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;What is the difference between Milvus and Zilliz Cloud?&quot;</span>

<span class="hljs-comment"># 1. Encode the query</span>
<span class="hljs-keyword">with</span> torch.no_grad():
    query_inputs = emb_processor.process_queries([question]).to(emb_model.device)
    query_vecs = emb_model(**query_inputs)[<span class="hljs-number">0</span>].cpu().<span class="hljs-built_in">float</span>().numpy()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query encoded: <span class="hljs-subst">{query_vecs.shape[<span class="hljs-number">0</span>]}</span> token vectors&quot;</span>)

<span class="hljs-comment"># 2. Search Milvus for each query token vector</span>
doc_patch_scores = {}
<span class="hljs-keyword">for</span> qv <span class="hljs-keyword">in</span> query_vecs:
    hits = milvus_client.search(
        COLLECTION, data=[qv.tolist()], limit=CANDIDATE_PATCHES,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;patch_idx&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    )[<span class="hljs-number">0</span>]
    <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits:
        did = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>]
        pid = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;patch_idx&quot;</span>]
        score = h[<span class="hljs-string">&quot;distance&quot;</span>]
        doc_patch_scores.setdefault(did, {})[pid] = <span class="hljs-built_in">max</span>(
            doc_patch_scores.get(did, {}).get(pid, <span class="hljs-number">0</span>), score
        )

<span class="hljs-comment"># 3. MaxSim aggregation: total score per page = sum of all matched patch scores</span>
doc_scores = {d: <span class="hljs-built_in">sum</span>(ps.values()) <span class="hljs-keyword">for</span> d, ps <span class="hljs-keyword">in</span> doc_patch_scores.items()}
ranked = <span class="hljs-built_in">sorted</span>(doc_scores.items(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-number">1</span>], reverse=<span class="hljs-literal">True</span>)[:TOP_K]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> retrieved pages: <span class="hljs-subst">{[(d, <span class="hljs-built_in">round</span>(s, <span class="hljs-number">2</span>)) <span class="hljs-keyword">for</span> d, s <span class="hljs-keyword">in</span> ranked]}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Resultado:</p>
<pre><code translate="no">Query encoded: 24 token vectors
Top-3 retrieved pages: [(16, 161.16), (12, 135.73), (7, 122.58)]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Display the retrieved pages</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
<span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context_images):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Retrieved page <span class="hljs-subst">{ranked[i][<span class="hljs-number">0</span>]}</span> (score: <span class="hljs-subst">{ranked[i][<span class="hljs-number">1</span>]:<span class="hljs-number">.2</span>f}</span>) ---&quot;</span>)
    display(img.resize((<span class="hljs-number">500</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">500</span> * img.height / img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_6_2842a54af8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Generate-an-Answer-with-the-Multimodal-LLM" class="common-anchor-header">Paso 7: Generar una respuesta con el LLM multimodal</h3><p>Se envían a Qwen3.5 las imágenes de las páginas recuperadas (no el texto extraído) junto con la pregunta del usuario. El LLM lee directamente las imágenes para generar una respuesta.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert an image to a base64 data URI for sending to the LLM.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; <span class="hljs-number">1600</span>:
        r = <span class="hljs-number">1600</span> / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;PNG&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-comment"># Build the multimodal prompt</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> context_images
]
content.append({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">f&quot;Above are <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context_images)}</span> retrieved document pages.\n&quot;</span>
        <span class="hljs-string">f&quot;Read them carefully and answer the following question:\n\n&quot;</span>
        <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n\n&quot;</span>
        <span class="hljs-string">f&quot;Be concise and accurate. If the documents don&#x27;t contain &quot;</span>
        <span class="hljs-string">f&quot;relevant information, say so.&quot;</span>
    ),
})

<span class="hljs-comment"># Call the LLM</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)
response = llm.chat.completions.create(
    model=GENERATION_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">1024</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
answer = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Answer: <span class="hljs-subst">{answer}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Resultado:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_3_33fa5d551d.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>En este tutorial, hemos creado un proceso RAG multimodal que toma un PDF, convierte cada página en una imagen, codifica esas imágenes en incrustaciones de parches multivectoriales con ColQwen2, las almacena en Milvus y recupera las páginas más relevantes en el momento de la consulta utilizando la puntuación MaxSim. En lugar de extraer el texto y esperar que el OCR conserve el diseño, el proceso envía las imágenes originales de las páginas a Qwen3.5, que las lee visualmente y genera una respuesta.</p>
<p>Este tutorial es un punto de partida, no un despliegue de producción. Hay que tener en cuenta algunas cosas a medida que se avanza.</p>
<p>Sobre las compensaciones:</p>
<ul>
<li><strong>El almacenamiento se escala con el número de páginas.</strong> Cada página produce ~755 vectores, por lo que un corpus de 1.000 páginas significa aproximadamente 755.000 filas en Milvus. El índice FLAT utilizado aquí funciona para las demostraciones, pero sería mejor utilizar IVF o HNSW para colecciones más grandes.</li>
<li><strong>La codificación es más lenta que la incrustación de texto.</strong> ColQwen2 es un modelo de visión de 4,4 GB. La codificación de imágenes lleva más tiempo por página que la incrustación de trozos de texto. Para un trabajo de indexación por lotes que se ejecuta una vez, esto suele estar bien. Para la ingestión en tiempo real, merece la pena realizar una evaluación comparativa.</li>
<li><strong>Este método funciona mejor con documentos visualmente ricos.</strong> Si sus PDF son en su mayoría texto limpio de una sola columna, sin tablas ni figuras, la indexación tradicional basada en texto puede ser más precisa y menos costosa.</li>
</ul>
<p>Qué probar a continuación:</p>
<ul>
<li><strong>Cambie a otro LLM multimodal.</strong> Este tutorial utiliza Qwen3.5 a través de OpenRouter, pero el proceso de recuperación es independiente del modelo. Podrías dirigir el paso de generación a GPT-4o, Gemini o cualquier modelo multimodal que acepte entradas de imagen.</li>
<li><strong>Ampliar <a href="http://milvus.io">Milvus</a>.</strong> Milvus Lite se ejecuta como un archivo local, lo que es ideal para la creación de prototipos. Para cargas de trabajo de producción, Milvus en Docker/Kubernetes o Zilliz Cloud (Milvus totalmente gestionado) maneja corpus más grandes sin que usted gestione la infraestructura.</li>
<li><strong>Experimente con diferentes tipos de documentos.</strong> La tubería aquí utiliza un PDF de comparación, pero funciona de la misma manera en contratos escaneados, dibujos de ingeniería, estados financieros o documentos de investigación con figuras densas.</li>
</ul>
<p>Para empezar, instale <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> con pip install pymilvus y obtenga los pesos ColQwen2 de HuggingFace.</p>
<p>¿Tienes preguntas o quieres mostrar lo que has construido? El <a href="https://milvus.io/slack">Slack de Milvus</a> es la forma más rápida de obtener ayuda de la comunidad y del equipo. Si prefieres una conversación cara a cara, puedes reservar hora en nuestro <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">horario de oficina</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Seguir leyendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md">¿Y si pudieras ver por qué falla RAG? Depuración de RAG en 3D con Project_Golem y Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">¿Se está quedando anticuada la RAG ahora que surgen agentes de larga duración como Claude Cowork?</a></p></li>
<li><p><a href="https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md">Cómo construimos un modelo de resaltado semántico para la poda contextual y el ahorro de tokens de RAG</a></p></li>
<li><p><a href="https://milvus.io/blog/ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md">La AI Code Review mejora cuando los modelos se debaten: Claude vs Gemini vs Codex vs Qwen vs MiniMax</a></p></li>
</ul>
