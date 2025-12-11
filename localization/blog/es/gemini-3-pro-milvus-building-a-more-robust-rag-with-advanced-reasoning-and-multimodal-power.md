---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: >-
  Gemini 3 Pro + Milvus: creación de un GAR más robusto con razonamiento
  avanzado y potencia multimodal
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Conozca las actualizaciones básicas de Gemini 3 Pro, vea cómo se comporta en
  pruebas de referencia clave y siga una guía para crear una canalización RAG de
  alto rendimiento con Milvus.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>Gemini 3 Pro de Google aterrizó con el raro tipo de lanzamiento que realmente cambia las expectativas de los desarrolladores: no sólo bombo y platillo, sino capacidades que amplían materialmente lo que las interfaces de lenguaje natural pueden hacer. Convierte "describe la aplicación que quieres" en un flujo de trabajo ejecutable: enrutamiento dinámico de herramientas, planificación en varios pasos, orquestación de API y generación interactiva de UX, todo ello cosido a la perfección. Este es el modelo que más se ha acercado a hacer que la codificación vibe parezca viable en producción.</p>
<p>Y las cifras respaldan esta afirmación. Gemini 3 Pro obtiene resultados sobresalientes en casi todas las pruebas principales:</p>
<ul>
<li><p><strong>Humanity's Last Exam:</strong> 37,5% sin herramientas, 45,8% con herramientas; el competidor más cercano se sitúa en el 26,5%.</p></li>
<li><p><strong>MathArena Apex:</strong> 23,4%, mientras que la mayoría de los modelos no superan el 2%.</p></li>
<li><p><strong>ScreenSpot-Pro:</strong> 72,7% de precisión, casi el doble que el siguiente, con un 36,2%.</p></li>
<li><p><strong>Vending-Bench 2:</strong> valor neto medio de <strong> 5.478,16 dólares</strong>, aproximadamente <strong>1,4 veces</strong> por encima del segundo puesto.</p></li>
</ul>
<p>Consulte la tabla siguiente para ver más resultados de pruebas comparativas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta combinación de razonamiento profundo, uso intensivo de herramientas y fluidez multimodal convierte a Gemini 3 Pro en una solución natural para la generación aumentada por recuperación (RAG). Combínelo con <a href="https://milvus.io/"><strong>Milvus</strong></a>, la base de datos vectorial de código abierto de alto rendimiento creada para la búsqueda semántica a escala de miles de millones, y obtendrá una capa de recuperación que fundamenta las respuestas, se escala limpiamente y se mantiene fiable en producción incluso con cargas de trabajo pesadas.</p>
<p>En este artículo, desglosaremos las novedades de Gemini 3 Pro, por qué eleva los flujos de trabajo RAG y cómo crear una canalización RAG limpia y eficiente utilizando Milvus como columna vertebral de recuperación.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Principales actualizaciones de Gemini 3 Pro<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro introduce un conjunto de mejoras sustanciales que reconfiguran la forma en que el modelo razona, crea, ejecuta tareas e interactúa con los usuarios. Estas mejoras se dividen en cuatro áreas principales:</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">Comprensión y razonamiento multimodal</h3><p>Gemini 3 Pro establece nuevos récords en importantes pruebas multimodales, como ARC-AGI-2 para razonamiento visual, MMMU-Pro para comprensión multimodal y Video-MMMU para comprensión de vídeo y adquisición de conocimientos. El modelo también introduce Deep Think, un modo de razonamiento ampliado que permite el procesamiento lógico estructurado en varios pasos. El resultado es una precisión significativamente mayor en problemas complejos en los que los modelos tradicionales de cadena de pensamiento tienden a fallar.</p>
<h3 id="Code-Generation" class="common-anchor-header">Generación de código</h3><p>El modelo lleva la codificación generativa a un nuevo nivel. Gemini 3 Pro puede producir SVG interactivos, aplicaciones web completas, escenas en 3D e incluso juegos funcionales -incluidos entornos tipo Minecraft y billares basados en navegador-, todo ello a partir de una única instrucción en lenguaje natural. El desarrollo front-end se beneficia especialmente: el modelo puede recrear diseños de interfaz de usuario existentes con alta fidelidad o traducir una captura de pantalla directamente en código listo para producción, lo que agiliza enormemente el trabajo iterativo de interfaz de usuario.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">Agentes de IA y uso de herramientas</h3><p>Con el permiso del usuario, Gemini 3 Pro puede acceder a los datos del dispositivo Google del usuario para realizar tareas de larga duración y de varios pasos, como planificar viajes o reservar coches de alquiler. Esta capacidad de agente se refleja en su excelente rendimiento en <strong>Vending-Bench 2</strong>, una prueba de rendimiento diseñada específicamente para probar el uso de herramientas en horizontes largos. El modelo también admite flujos de trabajo de agente de nivel profesional, incluida la ejecución de comandos de terminal y la interacción con herramientas externas a través de API bien definidas.</p>
<h3 id="Generative-UI" class="common-anchor-header">Interfaz de usuario generativa</h3><p>Gemini 3 Pro va más allá del modelo convencional de una pregunta, una respuesta e introduce <strong>la interfaz de usuario generativa</strong>, en la que el modelo puede crear experiencias interactivas completas de forma dinámica. En lugar de devolver texto estático, puede generar interfaces totalmente personalizadas -por ejemplo, un planificador de viajes rico y ajustable- directamente en respuesta a las instrucciones del usuario. De este modo, los LLM pasan de ser respondedores pasivos a generadores activos de interfaces.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Puesta a prueba de Gemini 3 Pro<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de los resultados de las pruebas comparativas, realizamos una serie de pruebas prácticas para comprender cómo se comporta Gemini 3 Pro en flujos de trabajo reales. Los resultados ponen de relieve cómo su razonamiento multimodal, sus capacidades generativas y su planificación a largo plazo se traducen en un valor práctico para los desarrolladores.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">Comprensión multimodal</h3><p>Gemini 3 Pro muestra una versatilidad impresionante en texto, imágenes, vídeo y código. En nuestra prueba, cargamos un vídeo de Zilliz directamente desde YouTube. El modelo procesó el clip completo -incluida la narración, las transiciones y el texto en pantalla- en unos <strong>40 segundos</strong>, un tiempo inusualmente rápido para un contenido multimodal de formato largo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Las evaluaciones internas de Google muestran un comportamiento similar: Gemini 3 Pro procesó recetas escritas a mano en varios idiomas, transcribió y tradujo cada una de ellas y las compiló en un recetario familiar que se puede compartir.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">Tareas de disparo cero</h3><p>Gemini 3 Pro puede generar interfaces de usuario web totalmente interactivas sin ejemplos ni andamiaje previos. Cuando se le pidió que creara un pulido <strong>juego web</strong> retrofuturista <strong>de naves espaciales en 3D</strong>, el modelo produjo una escena interactiva completa: una cuadrícula púrpura neón, naves de estilo cyberpunk, efectos de partículas brillantes y controles de cámara suaves, todo ello en una única respuesta de cero disparos.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">Planificación de tareas complejas</h3><p>El modelo también demuestra una mayor capacidad de planificación de tareas a largo plazo que muchos de sus competidores. En nuestra prueba de organización de la bandeja de entrada, Gemini 3 Pro se comportó como un asistente administrativo de inteligencia artificial: clasificando los correos electrónicos desordenados en cubos de proyectos, redactando sugerencias procesables (respuesta, seguimiento, archivo) y presentando un resumen limpio y estructurado. Una vez trazado el plan del modelo, toda la bandeja de entrada podía borrarse con un solo clic de confirmación.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Cómo construir un sistema RAG con Gemini 3 Pro y Milvus<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>El razonamiento mejorado de Gemini 3 Pro, la comprensión multimodal y las sólidas capacidades de uso de herramientas lo convierten en una base excelente para los sistemas GAR de alto rendimiento.</p>
<p>Cuando se combina con <a href="https://milvus.io/"><strong>Milvus</strong></a>, la base de datos vectorial de código abierto de alto rendimiento creada para la búsqueda semántica a gran escala, se obtiene una clara división de responsabilidades: Gemini 3 Pro se encarga de la <strong>interpretación, el razonamiento y la generación</strong>, mientras que Milvus proporciona una <strong>capa de recuperación rápida y escalable</strong> que mantiene las respuestas basadas en los datos de su empresa. Esta combinación es idónea para aplicaciones de producción como bases de conocimiento internas, asistentes de documentos, copilotos de atención al cliente y sistemas expertos en dominios específicos.</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><p>Antes de construir su canalización RAG, asegúrese de que estas bibliotecas básicas de Python están instaladas o actualizadas a sus últimas versiones:</p>
<ul>
<li><p><strong>pymilvus</strong> - el SDK Python oficial de Milvus</p></li>
<li><p><strong>google-generativeai</strong> - la biblioteca cliente Gemini 3 Pro</p></li>
<li><p><strong>requests</strong> - para gestionar llamadas HTTP cuando sea necesario</p></li>
<li><p><strong>tqdm</strong> - para las barras de progreso durante la ingestión del conjunto de datos</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, inicia sesión en <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a> para obtener tu clave API.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">Preparación del conjunto de datos</h3><p>Para este tutorial, utilizaremos la sección de preguntas frecuentes de la documentación de Milvus 2.4.x como base de conocimiento privada para nuestro sistema RAG.</p>
<p>Descargue el archivo de documentación y extráigalo en una carpeta llamada <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Cargue todos los archivos Markdown de la ruta <code translate="no">milvus_docs/en/faq</code>. Para cada documento, aplicamos una división simple basada en los encabezados de <code translate="no">#</code> para separar aproximadamente las secciones principales dentro de cada archivo Markdown.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">Configuración del LLM y del modelo de incrustación</h3><p>Para este tutorial, utilizaremos <code translate="no">gemini-3-pro-preview</code> como LLM y <code translate="no">text-embedding-004</code> como modelo de incrustación.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Respuesta del modelo: Soy Gemini, un gran modelo lingüístico creado por Google.</p>
<p>Puede realizar una comprobación rápida generando una incrustación de prueba e imprimiendo su dimensionalidad junto con los primeros valores:</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Salida del vector de prueba:</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Cargar datos en Milvus</h3><p><strong>Crear una colección</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Al crear una <code translate="no">MilvusClient</code>, puede elegir entre tres opciones de configuración, dependiendo de su escala y entorno:</p>
<ul>
<li><p><strong>Modo local (Milvus Lite):</strong> Establezca el URI en una ruta de archivo local (por ejemplo, <code translate="no">./milvus.db</code>). Esta es la forma más fácil de empezar - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> almacenará automáticamente todos los datos en ese archivo.</p></li>
<li><p><strong>Milvus autoalojado (Docker o Kubernetes):</strong> Para conjuntos de datos más grandes o cargas de trabajo de producción, ejecute Milvus en Docker o Kubernetes. Establezca el URI a su punto final del servidor Milvus, como <code translate="no">http://localhost:19530</code>.</p></li>
<li><p><strong>Zilliz Cloud (el servicio Milvus totalmente gestionado):</strong> Si prefiere una solución gestionada, utilice Zilliz Cloud. Establezca el URI en su punto final público y proporcione su clave API como token de autenticación.</p></li>
</ul>
<p>Antes de crear una nueva colección, compruebe si ya existe. Si es así, elimínela y vuelva a crearla para garantizar una configuración limpia.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Cree una nueva colección con los parámetros especificados.</p>
<p>Si no se proporciona ningún esquema, Milvus genera automáticamente un campo ID por defecto como clave primaria y un campo vectorial para almacenar incrustaciones. También proporciona un campo dinámico JSON reservado, que captura cualquier campo adicional que no esté definido en el esquema.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Insertar datos</strong></p>
<p>Recorra cada entrada de texto, genere su vector de incrustación e inserte los datos en Milvus. En este ejemplo, incluimos un campo adicional llamado <code translate="no">text</code>. Como no está predefinido en el esquema, Milvus lo almacena automáticamente utilizando el campo JSON dinámico - no requiere configuración adicional.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Ejemplo de salida:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">Creación del flujo de trabajo RAG</h3><p><strong>Recuperar datos relevantes</strong></p>
<p>Para probar la recuperación, hacemos una pregunta común sobre Milvus.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Busca la consulta en la colección y devuelve los 3 resultados más relevantes.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Los resultados se devuelven por orden de similitud, del más parecido al menos parecido.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Generar una respuesta RAG con el LLM</strong></p>
<p>Tras recuperar los documentos, conviértalos a un formato de cadena</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Proporcionar al LLM un prompt de sistema y un prompt de usuario, ambos construidos a partir de los documentos recuperados de Milvus.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<button class="copy-code-btn"></button></code></pre>
<p>Utilice el modelo <code translate="no">gemini-3-pro-preview</code> junto con estas instrucciones para generar la respuesta final.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>A partir de la salida, puede ver que Gemini 3 Pro produce una respuesta clara y bien estructurada basada en la información recuperada.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Nota</strong>: Gemini 3 Pro no está disponible actualmente para los usuarios de la versión gratuita. Haga clic <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">aquí</a> para obtener más información.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Puede acceder a él a través de <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">Una cosa más: Vibe Coding con Google Antigravity<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Junto con Gemini 3 Pro, Google presentó <a href="https://antigravity.google/"><strong>Google Antigravity</strong></a>, una plataforma de codificación en vídeo que interactúa de forma autónoma con tu editor, terminal y navegador. A diferencia de las anteriores herramientas asistidas por IA que gestionaban instrucciones puntuales, Antigravity opera a un nivel orientado a tareas, permitiendo a los desarrolladores especificar <em>lo que</em> quieren construir mientras que el sistema gestiona el <em>cómo</em>, orquestando el flujo de trabajo completo de extremo a extremo.</p>
<p>Los flujos de trabajo de codificación de IA tradicionales solían generar fragmentos aislados que los desarrolladores tenían que revisar, integrar, depurar y ejecutar manualmente. Antigravity cambia esta dinámica. Basta con describir una tarea -por ejemplo, <em>"Crear un juego sencillo de interacción con mascotas</em> "- y el sistema descompondrá la petición, generará el código, ejecutará comandos de terminal, abrirá un navegador para probar el resultado e iterará hasta que funcione. De este modo, la IA pasa de ser un motor pasivo de autocompletado a convertirse en un socio activo de ingeniería que aprende tus preferencias y se adapta a tu estilo personal de desarrollo con el paso del tiempo.</p>
<p>De cara al futuro, la idea de que un agente se coordine directamente con una base de datos no es descabellada. Con la llamada a herramientas a través de MCP, una IA podría llegar a leer de una base de datos Milvus, reunir una base de conocimientos e incluso mantener su propia canalización de recuperación de forma autónoma. En muchos sentidos, este cambio es incluso más significativo que la propia actualización del modelo: una vez que una IA puede tomar una descripción a nivel de producto y convertirla en una secuencia de tareas ejecutables, el esfuerzo humano se desplaza naturalmente hacia la definición de objetivos, restricciones y lo que parece "correcto" - el pensamiento de alto nivel que realmente impulsa el desarrollo de productos.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">¿Listo para construir?<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Si está listo para probarlo, siga nuestro tutorial paso a paso y construya un sistema RAG con <strong>Gemini 3 Pro + Milvus</strong> hoy mismo.</p>
<p>¿Tiene preguntas o desea profundizar en alguna función? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
