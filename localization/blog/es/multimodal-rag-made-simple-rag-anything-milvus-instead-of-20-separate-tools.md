---
id: multimodal-rag-made-simple-rag-anything-milvus-instead-of-20-separate-tools.md
title: >-
  RAG multimodal simplificado: RAG-Anything + Milvus en lugar de 20 herramientas
  distintas
author: Min Yin
date: 2025-11-25T00:00:00.000Z
cover: assets.zilliz.com/rag_anything_cover_6b4e9bc6c0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RAG-Anything, Multimodal RAG, Vector Database'
meta_title: RAG-Anything and Milvus for Multimodal RAG Systems
desc: >-
  Vea cómo RAG-Anything y Milvus hacen posible la RAG multimodal a través de
  texto, imágenes y datos estructurados, y lo que está por venir para la IA
  aumentada por recuperación.
origin: >-
  https://milvus.io/blog/multimodal-rag-made-simple-rag-anything-milvus-instead-of-20-separate-tools.md
---
<p>Construir un sistema de GAR multimodal solía significar unir una docena de herramientas especializadas: una para OCR, otra para tablas, otra para fórmulas matemáticas, otra para incrustaciones, otra para búsquedas, etcétera. Los canales tradicionales de RAG se diseñaban para texto y, cuando los documentos empezaban a incluir imágenes, tablas, ecuaciones, gráficos y otros contenidos estructurados, la cadena de herramientas se volvía rápidamente desordenada e inmanejable.</p>
<p><a href="https://github.com/HKUDS/RAG-Anything"><strong>RAG-Anything</strong></a>, desarrollado por HKU, cambia esta situación. Basada en LightRAG, ofrece una plataforma "todo en uno" capaz de analizar diversos tipos de contenido en paralelo y mapearlos en un grafo de conocimiento unificado. Pero unificar el proceso es sólo la mitad de la historia. Para recuperar pruebas en estas diversas modalidades, se necesita una búsqueda vectorial rápida y escalable que pueda manejar muchos tipos de incrustación a la vez. Ahí es donde entra <a href="https://milvus.io/"><strong>Milvus</strong></a>. Como base de datos vectorial de código abierto y alto rendimiento, Milvus elimina la necesidad de múltiples soluciones de almacenamiento y búsqueda. Admite la búsqueda RNA a gran escala, la recuperación híbrida de vectores y palabras clave, el filtrado de metadatos y la gestión flexible de incrustaciones, todo en un solo lugar.</p>
<p>En este artículo, desglosaremos cómo RAG-Anything y Milvus trabajan juntos para reemplazar una cadena de herramientas multimodal fragmentada por una pila limpia y unificada, y le mostraremos cómo puede construir un práctico sistema RAG multimodal de preguntas y respuestas con sólo unos pocos pasos.</p>
<h2 id="What-Is-RAG-Anything-and-How-It-Works" class="common-anchor-header">Qué es RAG-Anything y cómo funciona<button data-href="#What-Is-RAG-Anything-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/HKUDS/RAG-Anything">RAG-Anything</a> es un marco RAG diseñado para romper la barrera de los sistemas tradicionales basados únicamente en texto. En lugar de depender de múltiples herramientas especializadas, ofrece un único entorno unificado que puede analizar, procesar y recuperar información a través de distintos tipos de contenido.</p>
<p>El marco admite documentos que contengan texto, diagramas, tablas y expresiones matemáticas, lo que permite a los usuarios realizar consultas en todas las modalidades a través de una única interfaz cohesionada. Esto lo hace especialmente útil en campos como la investigación académica, los informes financieros y la gestión del conocimiento empresarial, donde los materiales multimodales son habituales.</p>
<p>En esencia, RAG-Anything se basa en un proceso multimodal de varias etapas: análisis sintáctico de documentos→análisis de contenidos→grafos de conocimiento→recuperación inteligente. Esta arquitectura permite la orquestación inteligente y la comprensión multimodal, lo que permite al sistema manejar sin problemas diversas modalidades de contenido dentro de un único flujo de trabajo integrado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_anything_framework_d3513593a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-1-+-3-+-N-Architecture" class="common-anchor-header">La arquitectura "1 + 3 + N</h3><p>A nivel de ingeniería, las capacidades de RAG-Anything se materializan a través de su arquitectura "1 + 3 + N":</p>
<p><strong>El motor central</strong></p>
<p>En el centro de RAG-Anything se encuentra un motor de grafos de conocimiento inspirado en <a href="https://github.com/HKUDS/LightRAG">LightRAG</a>. Esta unidad central es responsable de la extracción de entidades multimodales, el mapeo de relaciones intermodales y el almacenamiento semántico vectorizado. A diferencia de los sistemas RAG tradicionales basados únicamente en texto, el motor comprende entidades de texto, objetos visuales dentro de imágenes y estructuras relacionales incrustadas en tablas.</p>
<p><strong>3 Procesadores modales</strong></p>
<p>RAG-Anything integra tres procesadores de modalidad especializados diseñados para una comprensión profunda y específica de la modalidad. Juntos forman la capa de análisis multimodal del sistema.</p>
<ul>
<li><p><strong>ImageModalProcessor</strong> interpreta el contenido visual y su significado contextual.</p></li>
<li><p><strong>TableModalProcessor</strong> analiza las estructuras de las tablas y descodifica las relaciones lógicas y numéricas de los datos.</p></li>
<li><p><strong>EquationModalProcessor</strong> comprende la semántica de los símbolos y fórmulas matemáticas.</p></li>
</ul>
<p><strong>N analizadores sintácticos</strong></p>
<p>Para soportar la diversa estructura de los documentos del mundo real, RAG-Anything proporciona una capa de análisis extensible construida sobre múltiples motores de extracción. Actualmente, integra tanto MinerU como Docling, seleccionando automáticamente el analizador sintáctico óptimo en función del tipo de documento y la complejidad estructural.</p>
<p>Basándose en la arquitectura "1 + 3 + N", RAG-Anything mejora el proceso tradicional de RAG modificando el tratamiento de los distintos tipos de contenido. En lugar de procesar texto, imágenes y tablas de uno en uno, el sistema los procesa todos a la vez.</p>
<pre><code translate="no"><span class="hljs-comment"># The core configuration demonstrates the parallel processing design</span>
config = RAGAnythingConfig(
    working_dir=<span class="hljs-string">&quot;./rag_storage&quot;</span>,
    parser=<span class="hljs-string">&quot;mineru&quot;</span>,
    parse_method=<span class="hljs-string">&quot;auto&quot;</span>,  <span class="hljs-comment"># Automatically selects the optimal parsing strategy</span>
    enable_image_processing=<span class="hljs-literal">True</span>,
    enable_table_processing=<span class="hljs-literal">True</span>, 
    enable_equation_processing=<span class="hljs-literal">True</span>,
    max_workers=<span class="hljs-number">8</span>  <span class="hljs-comment"># Supports multi-threaded parallel processing</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Este diseño acelera enormemente el tratamiento de documentos técnicos de gran tamaño. Las pruebas comparativas demuestran que cuando el sistema utiliza más núcleos de CPU, se vuelve notablemente más rápido, lo que reduce drásticamente el tiempo necesario para procesar cada documento.</p>
<h3 id="Layered-Storage-and-Retrieval-Optimization" class="common-anchor-header">Almacenamiento por capas y optimización de la recuperación</h3><p>Además de su diseño multimodal, RAG-Anything también utiliza un enfoque de almacenamiento y recuperación por capas para que los resultados sean más precisos y eficientes.</p>
<ul>
<li><p><strong>El texto</strong> se almacena en una base de datos vectorial tradicional.</p></li>
<li><p><strong>Las imágenes</strong> se gestionan en un almacén de características visuales independiente.</p></li>
<li><p>Las<strong>tablas</strong> se guardan en un almacén de datos estructurados.</p></li>
<li><p><strong>Las fórmulas</strong> matemáticas se convierten en vectores semánticos.</p></li>
</ul>
<p>Al almacenar cada tipo de contenido en su propio formato adecuado, el sistema puede elegir el mejor método de recuperación para cada modalidad en lugar de basarse en una única búsqueda genérica por similitud. Así se obtienen resultados más rápidos y fiables en distintos tipos de contenidos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/layered_storage_c9441feff1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Milvus-Fits-into-RAG-Anything" class="common-anchor-header">Cómo encaja Milvus en RAG-Anything<button data-href="#How-Milvus-Fits-into-RAG-Anything" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG-Anything proporciona una fuerte recuperación multimodal, pero hacerlo bien requiere una búsqueda vectorial rápida y escalable a través de todo tipo de incrustaciones. <a href="https://milvus.io/">Milvus</a> cumple esta función a la perfección.</p>
<p>Gracias a su arquitectura nativa en la nube y a la separación entre computación y almacenamiento, Milvus ofrece una gran escalabilidad y rentabilidad. Admite la separación de lectura-escritura y la unificación de flujo por lotes, lo que permite al sistema gestionar cargas de trabajo de alta concurrencia al tiempo que mantiene el rendimiento de las consultas en tiempo real: los nuevos datos se pueden buscar inmediatamente después de su inserción.</p>
<p>Milvus también garantiza una fiabilidad de nivel empresarial gracias a su diseño distribuido y tolerante a fallos, que mantiene el sistema estable incluso si fallan nodos individuales. Esto lo convierte en un sistema idóneo para las implantaciones RAG multimodales a nivel de producción.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_ab54d5e798.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Build-a-Multimodal-QA-System-with-RAG-Anything-and-Milvus" class="common-anchor-header">Cómo construir un sistema multimodal de preguntas y respuestas con RAG-Anything y Milvus<button data-href="#How-to-Build-a-Multimodal-QA-System-with-RAG-Anything-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta demostración muestra cómo construir un sistema multimodal de preguntas y respuestas utilizando el marco RAG-Anything, la base de datos vectorial Milvus y el modelo de incrustación TongYi. (Este ejemplo se centra en el código de implementación central y no es una configuración de producción completa).</p>
<h3 id="Hands-on-Demo" class="common-anchor-header">Demostración práctica</h3><p><strong>Requisitos previos：</strong></p>
<ul>
<li><p><strong>Python</strong> 3.10 o superior</p></li>
<li><p><strong>Base de datos de vectores:</strong> Servicio Milvus (Milvus Lite)</p></li>
<li><p><strong>Servicio en la nube:</strong> Clave API de Alibaba Cloud (para servicios LLM e incrustación)</p></li>
<li><p>Modelo<strong>LLM:</strong> <code translate="no">qwen-vl-max</code> (modelo habilitado para visión)</p></li>
</ul>
<p><strong>Modelo</strong> de<strong>incrustación</strong>: <code translate="no">tongyi-embedding-vision-plus</code></p>
<pre><code translate="no">- python -m venv .venv &amp;&amp; <span class="hljs-built_in">source</span> .venv/bin/activate  <span class="hljs-comment"># For Windows users:  .venvScriptsactivate</span>
- pip install -r requirements-min.txt
- <span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment">#add DASHSCOPE_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ejecutar el ejemplo de trabajo mínimo:</strong></p>
<pre><code translate="no">python minimal_[main.py](&lt;http:<span class="hljs-comment">//main.py&gt;)</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Resultados esperados:</strong></p>
<p>Una vez que la secuencia de comandos se ejecuta correctamente, el terminal debe mostrar:</p>
<ul>
<li><p>El resultado de la pregunta y respuesta basada en texto generada por el LLM.</p></li>
<li><p>La descripción de la imagen recuperada correspondiente a la consulta.</p></li>
</ul>
<h3 id="Project-Structure" class="common-anchor-header">Estructura del proyecto</h3><pre><code translate="no">.
├─ requirements-min.txt
├─ .env.example
├─ [config.py](&lt;http:<span class="hljs-comment">//config.py&gt;)</span>
├─ milvus_[store.py](&lt;http:<span class="hljs-comment">//store.py&gt;)</span>
├─ [adapters.py](&lt;http:<span class="hljs-comment">//adapters.py&gt;)</span>
├─ minimal_[main.py](&lt;http:<span class="hljs-comment">//main.py&gt;)</span>
└─ sample
   ├─ docs
   │  └─ faq_milvus.txt
   └─ images
      └─ milvus_arch.png
<button class="copy-code-btn"></button></code></pre>
<p><strong>Dependencias del proyecto</strong></p>
<pre><code translate="no">raganything
lightrag
pymilvus[lite]&gt;=2.3.0
aiohttp&gt;=3.8.0
orjson&gt;=3.8.0
python-dotenv&gt;=1.0.0
Pillow&gt;=9.0.0
numpy&gt;=1.21.0,&lt;2.0.0
rich&gt;=12.0.0
<button class="copy-code-btn"></button></code></pre>
<p><strong>Variables de entorno</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Alibaba Cloud DashScope</span>
DASHSCOPE_API_KEY=your_api_key_here
<span class="hljs-comment"># If the endpoint changes in future releases, please update it accordingly.</span>
ALIYUN_LLM_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
ALIYUN_VLM_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
ALIYUN_EMBED_URL=https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding
<span class="hljs-comment"># Model names (configure all models here for consistency)</span>
LLM_TEXT_MODEL=qwen-max
LLM_VLM_MODEL=qwen-vl-max
EMBED_MODEL=tongyi-embedding-vision-plus
<span class="hljs-comment"># Milvus Lite</span>
MILVUS_URI=milvus_lite.db
MILVUS_COLLECTION=rag_multimodal_collection
EMBED_DIM=1152
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configuración</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
load_dotenv()
DASHSCOPE_API_KEY = os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
LLM_TEXT_MODEL = os.getenv(<span class="hljs-string">&quot;LLM_TEXT_MODEL&quot;</span>, <span class="hljs-string">&quot;qwen-max&quot;</span>)
LLM_VLM_MODEL = os.getenv(<span class="hljs-string">&quot;LLM_VLM_MODEL&quot;</span>, <span class="hljs-string">&quot;qwen-vl-max&quot;</span>)
EMBED_MODEL = os.getenv(<span class="hljs-string">&quot;EMBED_MODEL&quot;</span>, <span class="hljs-string">&quot;tongyi-embedding-vision-plus&quot;</span>)
ALIYUN_LLM_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_LLM_URL&quot;</span>)
ALIYUN_VLM_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_VLM_URL&quot;</span>)
ALIYUN_EMBED_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_EMBED_URL&quot;</span>)
MILVUS_URI = os.getenv(<span class="hljs-string">&quot;MILVUS_URI&quot;</span>, <span class="hljs-string">&quot;milvus_lite.db&quot;</span>)
MILVUS_COLLECTION = os.getenv(<span class="hljs-string">&quot;MILVUS_COLLECTION&quot;</span>, <span class="hljs-string">&quot;rag_multimodal_collection&quot;</span>)
EMBED_DIM = <span class="hljs-built_in">int</span>(os.getenv(<span class="hljs-string">&quot;EMBED_DIM&quot;</span>, <span class="hljs-string">&quot;1152&quot;</span>))
<span class="hljs-comment"># Basic runtime parameters</span>
TIMEOUT = <span class="hljs-number">60</span>
MAX_RETRIES = <span class="hljs-number">2</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Invocación del modelo</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> base64
<span class="hljs-keyword">import</span> aiohttp
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> (
    DASHSCOPE_API_KEY, LLM_TEXT_MODEL, LLM_VLM_MODEL, EMBED_MODEL,
    ALIYUN_LLM_URL, ALIYUN_VLM_URL, ALIYUN_EMBED_URL, EMBED_DIM, TIMEOUT
)
HEADERS = {
    <span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{DASHSCOPE_API_KEY}</span>&quot;</span>,
    <span class="hljs-string">&quot;Content-Type&quot;</span>: <span class="hljs-string">&quot;application/json&quot;</span>,
}
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AliyunLLMAdapter</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-variable language_">self</span>.text_url = ALIYUN_LLM_URL
        <span class="hljs-variable language_">self</span>.vlm_url = ALIYUN_VLM_URL
        <span class="hljs-variable language_">self</span>.text_model = LLM_TEXT_MODEL
        <span class="hljs-variable language_">self</span>.vlm_model = LLM_VLM_MODEL
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">self, prompt: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.text_model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: prompt}]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;max_tokens&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-string">&quot;temperature&quot;</span>: <span class="hljs-number">0.5</span>},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.text_url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>]
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_vlm_with_image</span>(<span class="hljs-params">self, prompt: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
            image_b64 = base64.b64encode([f.read](&lt;http://f.read&gt;)()).decode(<span class="hljs-string">&quot;utf-8&quot;</span>)
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.vlm_model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: [
                {<span class="hljs-string">&quot;text&quot;</span>: prompt},
                {<span class="hljs-string">&quot;image&quot;</span>: <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{image_b64}</span>&quot;</span>}
            ]}]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;max_tokens&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-string">&quot;temperature&quot;</span>: <span class="hljs-number">0.2</span>},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.vlm_url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>]
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AliyunEmbeddingAdapter</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-variable language_">self</span>.url = ALIYUN_EMBED_URL
        <span class="hljs-variable language_">self</span>.model = EMBED_MODEL
        <span class="hljs-variable language_">self</span>.dim = EMBED_DIM
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_text</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]:
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;texts&quot;</span>: [text]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;text_type&quot;</span>: <span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;dimensions&quot;</span>: <span class="hljs-variable language_">self</span>.dim},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;embeddings&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Integración de Milvus Lite</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, CollectionSchema, FieldSchema, DataType, utility
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> MILVUS_URI, MILVUS_COLLECTION, EMBED_DIM
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MilvusVectorStore</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, uri: <span class="hljs-built_in">str</span> = MILVUS_URI, collection_name: <span class="hljs-built_in">str</span> = MILVUS_COLLECTION, dim: <span class="hljs-built_in">int</span> = EMBED_DIM</span>):
        <span class="hljs-variable language_">self</span>.uri = uri
        <span class="hljs-variable language_">self</span>.collection_name = collection_name
        <span class="hljs-variable language_">self</span>.dim = dim
        <span class="hljs-variable language_">self</span>.collection: <span class="hljs-type">Optional</span>[Collection] = <span class="hljs-literal">None</span>
        <span class="hljs-variable language_">self</span>._connect_and_prepare()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_connect_and_prepare</span>(<span class="hljs-params">self</span>):
        connections.connect(<span class="hljs-string">&quot;default&quot;</span>, uri=<span class="hljs-variable language_">self</span>.uri)
        <span class="hljs-keyword">if</span> utility.has_collection(<span class="hljs-variable language_">self</span>.collection_name):
            <span class="hljs-variable language_">self</span>.collection = Collection(<span class="hljs-variable language_">self</span>.collection_name)
        <span class="hljs-keyword">else</span>:
            fields = [
                FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>, is_primary=<span class="hljs-literal">True</span>),
                FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-variable language_">self</span>.dim),
                FieldSchema(name=<span class="hljs-string">&quot;content&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>),
                FieldSchema(name=<span class="hljs-string">&quot;content_type&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">32</span>),
                FieldSchema(name=<span class="hljs-string">&quot;source&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>),
                FieldSchema(name=<span class="hljs-string">&quot;ts&quot;</span>, dtype=[DataType.INT](&lt;http://DataType.INT&gt;)<span class="hljs-number">64</span>),
            ]
            schema = CollectionSchema(fields, <span class="hljs-string">&quot;Minimal multimodal collection&quot;</span>)
            <span class="hljs-variable language_">self</span>.collection = Collection(<span class="hljs-variable language_">self</span>.collection_name, schema)
            <span class="hljs-variable language_">self</span>.collection.create_index(<span class="hljs-string">&quot;vector&quot;</span>, {
                <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
                <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
                <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>}
            })
        <span class="hljs-variable language_">self</span>.collection.load()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upsert</span>(<span class="hljs-params">self, ids: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], vectors: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]], contents: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
               content_types: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], sources: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>) -&gt; <span class="hljs-literal">None</span>:
        data = [
            ids,
            vectors,
            contents,
            content_types,
            sources,
            [<span class="hljs-built_in">int</span>(time.time() * <span class="hljs-number">1000</span>)] * <span class="hljs-built_in">len</span>(ids)
        ]
        <span class="hljs-variable language_">self</span>.collection.upsert(data)
        <span class="hljs-variable language_">self</span>.collection.flush()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query_vectors: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]], top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, content_type: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span></span>):
        expr = <span class="hljs-string">f&#x27;content_type == &quot;<span class="hljs-subst">{content_type}</span>&quot;&#x27;</span> <span class="hljs-keyword">if</span> content_type <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>
        params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span>}}
        results = [<span class="hljs-variable language_">self</span>.collection.search](&lt;http://<span class="hljs-variable language_">self</span>.collection.search&gt;)(
            data=query_vectors,
            anns_field=<span class="hljs-string">&quot;vector&quot;</span>,
            param=params,
            limit=top_k,
            expr=expr,
            output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;content_type&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;ts&quot;</span>]
        )
        out = []
        <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
            out.append([{
                <span class="hljs-string">&quot;id&quot;</span>: h.entity.get(<span class="hljs-string">&quot;id&quot;</span>),
                <span class="hljs-string">&quot;content&quot;</span>: h.entity.get(<span class="hljs-string">&quot;content&quot;</span>),
                <span class="hljs-string">&quot;content_type&quot;</span>: h.entity.get(<span class="hljs-string">&quot;content_type&quot;</span>),
                <span class="hljs-string">&quot;source&quot;</span>: h.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
                <span class="hljs-string">&quot;score&quot;</span>: h.score
            } <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits])
        <span class="hljs-keyword">return</span> out
<button class="copy-code-btn"></button></code></pre>
<p><strong>Punto de entrada principal</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Minimal Working Example:
- Insert a short text FAQ into LightRAG (text retrieval context)
- Insert an image description vector into Milvus (image retrieval context)
- Execute two example queries: one text QA and one image-based QA
&quot;&quot;&quot;</span>
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> uuid
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> rich <span class="hljs-keyword">import</span> <span class="hljs-built_in">print</span>
<span class="hljs-keyword">from</span> lightrag <span class="hljs-keyword">import</span> LightRAG, QueryParam
<span class="hljs-keyword">from</span> lightrag.utils <span class="hljs-keyword">import</span> EmbeddingFunc
<span class="hljs-keyword">from</span> adapters <span class="hljs-keyword">import</span> AliyunLLMAdapter, AliyunEmbeddingAdapter
<span class="hljs-keyword">from</span> milvus_store <span class="hljs-keyword">import</span> MilvusVectorStore
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> EMBED_DIM
SAMPLE_DOC = Path(<span class="hljs-string">&quot;sample/docs/faq_milvus.txt&quot;</span>)
SAMPLE_IMG = Path(<span class="hljs-string">&quot;sample/images/milvus_arch.png&quot;</span>)
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-comment"># 1) Initialize core components</span>
    llm = AliyunLLMAdapter()
    emb = AliyunEmbeddingAdapter()
    store = MilvusVectorStore()
    <span class="hljs-comment"># 2) Initialize LightRAG (for text-only retrieval)</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">llm_complete</span>(<span class="hljs-params">prompt: <span class="hljs-built_in">str</span>, max_tokens: <span class="hljs-built_in">int</span> = <span class="hljs-number">1024</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> [llm.chat](&lt;http://llm.chat&gt;)(prompt)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_func</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> emb.embed_text(text)
    rag = LightRAG(
        working_dir=<span class="hljs-string">&quot;rag_workdir_min&quot;</span>,
        llm_model_func=llm_complete,
        embedding_func=EmbeddingFunc(
            embedding_dim=EMBED_DIM,
            max_token_size=<span class="hljs-number">8192</span>,
            func=embed_func
        ),
    )
    <span class="hljs-comment"># 3) Insert text data</span>
    <span class="hljs-keyword">if</span> SAMPLE_DOC.exists():
        text = SAMPLE_[DOC.read](&lt;http://DOC.read&gt;)_text(encoding=<span class="hljs-string">&quot;utf-8&quot;</span>)
        <span class="hljs-keyword">await</span> rag.ainsert(text)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[green]Inserted FAQ text into LightRAG[/green]&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[yellow] sample/docs/faq_milvus.txt not found[/yellow]&quot;</span>)
    <span class="hljs-comment"># 4) Insert image data (store description in Milvus)</span>
    <span class="hljs-keyword">if</span> SAMPLE_IMG.exists():
        <span class="hljs-comment"># Use the VLM to generate a description as its semantic content</span>
        desc = <span class="hljs-keyword">await</span> [llm.chat](&lt;http://llm.chat&gt;)_vlm_with_image(<span class="hljs-string">&quot;Please briefly describe the key components of the Milvus architecture shown in the image.&quot;</span>, <span class="hljs-built_in">str</span>(SAMPLE_IMG))
        vec = <span class="hljs-keyword">await</span> emb.embed_text(desc)  <span class="hljs-comment"># Use text embeddings to maintain a consistent vector dimension, simplifying reuse</span>
        store.upsert(
            ids=[<span class="hljs-built_in">str</span>(uuid.uuid4())],
            vectors=[vec],
            contents=[desc],
            content_types=[<span class="hljs-string">&quot;image&quot;</span>],
            sources=[<span class="hljs-built_in">str</span>(SAMPLE_IMG)]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[green]Inserted image description into Milvus（content_type=image）[/green]&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[yellow] sample/images/milvus_arch.png not found[/yellow]&quot;</span>)
    <span class="hljs-comment"># 5) Query: Text-based QA (from LightRAG)</span>
    q1 = <span class="hljs-string">&quot;Does Milvus support simultaneous insertion and search? Give a short answer.&quot;</span>
    ans1 = <span class="hljs-keyword">await</span> rag.aquery(q1, param=QueryParam(mode=<span class="hljs-string">&quot;hybrid&quot;</span>))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[bold]Text QA[/bold]&quot;</span>)
    <span class="hljs-built_in">print</span>(ans1)
    <span class="hljs-comment"># 6) Query: Image-related QA (from Milvus)</span>
    q2 = <span class="hljs-string">&quot;What are the key components of the Milvus architecture?&quot;</span>
    q2_vec = <span class="hljs-keyword">await</span> emb.embed_text(q2)
    img_hits = [store.search](&lt;http://store.search&gt;)([q2_vec], top_k=<span class="hljs-number">3</span>, content_type=<span class="hljs-string">&quot;image&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[bold]Image Retrieval (returns semantic image descriptions)[/bold]&quot;</span>)
    <span class="hljs-built_in">print</span>(img_hits[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> img_hits <span class="hljs-keyword">else</span> [])
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    [asyncio.run](&lt;http://asyncio.run&gt;)(main())
<button class="copy-code-btn"></button></code></pre>
<p>Ahora, puede probar su sistema RAG multimodal con su propio conjunto de datos.</p>
<h2 id="The-Future-for-Multimodal-RAG" class="common-anchor-header">El futuro de la GAR multimodal<button data-href="#The-Future-for-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>A medida que más datos del mundo real van más allá del texto sin formato, los sistemas de generación mejorada de recuperación (RAG) empiezan a evolucionar hacia una verdadera multimodalidad. Soluciones como <strong>RAG-Anything</strong> ya demuestran cómo pueden procesarse de forma unificada texto, imágenes, tablas, fórmulas y otros contenidos estructurados. De cara al futuro, creo que tres tendencias principales darán forma a la próxima fase de la RAG multimodal:</p>
<h3 id="Expanding-to-More-Modalities" class="common-anchor-header">Ampliación a más modalidades</h3><p>Los marcos actuales, como RAG-Anything, ya permiten procesar texto, imágenes, tablas y expresiones matemáticas. La próxima frontera es la compatibilidad con tipos de contenido aún más ricos, como <strong>vídeo, audio, datos de sensores y modelos 3D</strong>, lo que permitirá a los sistemas RAG comprender y recuperar información de todo el espectro de datos modernos.</p>
<h3 id="Real-Time-Data-Updates" class="common-anchor-header">Actualización de datos en tiempo real</h3><p>En la actualidad, la mayoría de los procesos GAR se basan en fuentes de datos relativamente estáticas. A medida que la información cambie con mayor rapidez, los sistemas futuros requerirán <strong>actualizaciones de documentos en tiempo real, ingestión de flujos e indexación incremental</strong>. Este cambio hará que la RAG sea más sensible, oportuna y fiable en entornos dinámicos.</p>
<h3 id="Moving-RAG-to-Edge-Devices" class="common-anchor-header">Trasladar la RAG a los dispositivos periféricos</h3><p>Con herramientas vectoriales ligeras como <a href="https://github.com/milvus-io/milvus-lite">Milvus</a> Lite, la GAR multimodal ya no está confinada a la nube. La implementación de RAG en <strong>dispositivos periféricos y sistemas IoT</strong> permite que la recuperación inteligente se produzca más cerca de donde se generan los datos, lo que mejora la latencia, la privacidad y la eficiencia general.</p>
<p>¿Listo para explorar la GAR multimodal?</p>
<p>Pruebe a emparejar su canalización multimodal con <a href="https://milvus.io">Milvus</a> y experimente una recuperación rápida y escalable a través de texto, imágenes y más.</p>
<p>Tiene preguntas o desea una inmersión profunda en cualquier característica? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
