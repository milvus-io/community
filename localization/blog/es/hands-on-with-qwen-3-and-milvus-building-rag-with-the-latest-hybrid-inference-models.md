---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: >-
  Prácticas con Qwen 3 y Milvus: Creación de RAG con los últimos modelos
  híbridos de inferencia
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Compartir las capacidades clave de los modelos Qwen 3 y guiarle a través de un
  proceso de emparejamiento de Qwen 3 con Milvus para construir un sistema local
  de generación aumentada de recuperación (RAG) consciente de los costes.
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Como desarrollador en constante búsqueda de herramientas prácticas de IA, no podía ignorar el revuelo en torno al último lanzamiento de Alibaba Cloud: la familia de modelos<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3</a>, una sólida línea de ocho modelos de inferencia híbridos diseñados para redefinir el equilibrio entre inteligencia y eficiencia. En sólo 12 horas, el proyecto obtuvo <strong>más de 17.000 estrellas de GitHub</strong> y alcanzó un pico de <strong>23.000 descargas</strong> por hora en Hugging Face.</p>
<p>¿Cuál es la diferencia esta vez? En resumen, los modelos Qwen 3 combinan el razonamiento (respuestas lentas y reflexivas) y el no razonamiento (respuestas rápidas y eficientes) en una única arquitectura, incluyen diversas opciones de modelos, formación y rendimiento mejorados, y ofrecen más funciones preparadas para la empresa.</p>
<p>En este artículo, resumiré las capacidades clave de los modelos Qwen 3 a las que debe prestar atención y le guiaré a través de un proceso de emparejamiento de Qwen 3 con Milvus para construir un sistema local de generación de recuperación aumentada (RAG) consciente de los costes, con código práctico y consejos para optimizar el rendimiento frente a la latencia.</p>
<p>Entremos en materia.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">¿Qué tiene de interesante Qwen 3?<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>Después de probar y profundizar en Qwen 3, está claro que no se trata sólo de números más grandes en una hoja de especificaciones. Se trata de cómo las opciones de diseño del modelo ayudan realmente a los desarrolladores a crear mejores aplicaciones GenAI: más rápidas, más inteligentes y con más control. Esto es lo que destaca.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. Modos de pensamiento híbridos: Inteligencia cuando se necesita, rapidez cuando no</h3><p>Una de las características más innovadoras de Qwen 3 es su <strong>arquitectura de inferencia híbrida</strong>. Le ofrece un control preciso sobre la cantidad de "pensamiento" que realiza el modelo tarea por tarea. Al fin y al cabo, no todas las tareas requieren un razonamiento complicado.</p>
<ul>
<li><p>Para problemas complejos que requieran un análisis profundo, puede aprovechar toda la capacidad de razonamiento, aunque sea más lenta.</p></li>
<li><p>Para las consultas sencillas del día a día, puedes cambiar a un modo más rápido y ligero.</p></li>
<li><p>Incluso puedes establecer un <strong>"presupuesto de pensamiento</strong> " para limitar la cantidad de cálculo o tokens que consume una sesión.</p></li>
</ul>
<p>Esto no es sólo una función de laboratorio. Aborda directamente el dilema diario al que se enfrentan los desarrolladores: ofrecer respuestas de alta calidad sin disparar los costes de infraestructura o la latencia del usuario.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. Una gama versátil: MoE y modelos densos para diferentes necesidades</h3><p>Qwen 3 ofrece una amplia gama de modelos diseñados para satisfacer diferentes necesidades operativas:</p>
<ul>
<li><p><strong>Dos modelos MoE (Mezcla de Expertos</strong>):</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 235.000 millones de parámetros totales, 22.000 millones activos por consulta</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 30.000 millones en total, 3.000 millones activos</p></li>
</ul></li>
<li><p><strong>Seis modelos densos</strong>: desde 0,6 mil millones hasta 32 mil millones de parámetros.</p></li>
</ul>
<p><em>Información técnica rápida: Los modelos densos (como GPT-3 o BERT) siempre activan todos los parámetros, lo que los hace más pesados pero a veces más predecibles.</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>Los modelos MoE</em></a> <em>activan sólo una fracción de la red a la vez, lo que los hace mucho más eficientes a escala.</em></p>
<p>En la práctica, esta versátil gama de modelos significa que puede:</p>
<ul>
<li><p>Utilizar modelos densos para cargas de trabajo estrechas y predecibles (como dispositivos integrados).</p></li>
<li><p>Utilizar modelos MoE cuando necesite capacidades de peso pesado sin fundir su factura de nube</p></li>
</ul>
<p>Con esta gama, puede adaptar su despliegue -desde configuraciones ligeras y preparadas para el borde hasta potentes despliegues a escala de nube- sin tener que limitarse a un único tipo de modelo.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. Centrado en la eficiencia y la implantación en el mundo real</h3><p>En lugar de centrarse únicamente en escalar el tamaño del modelo, Qwen 3 se centra en la eficiencia de la formación y la practicidad del despliegue:</p>
<ul>
<li><p><strong>Se ha entrenado con 36 billones de fichas</strong>, el doble que Qwen 2.5.</p></li>
<li><p><strong>Ampliado a 235B parámetros</strong> - pero gestionado inteligentemente mediante técnicas MoE, equilibrando la capacidad con las demandas de recursos.</p></li>
<li><p><strong>Optimizado para el despliegue</strong>: la cuantización dinámica (de FP4 a INT8) permite ejecutar incluso el modelo Qwen 3 más grande en una infraestructura modesta; por ejemplo, el despliegue en cuatro GPU H20.</p></li>
</ul>
<p>El objetivo aquí es claro: ofrecer un mayor rendimiento sin requerir una inversión desproporcionada en infraestructura.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. Creado para la integración real: Compatibilidad con MCP y funciones multilingües</h3><p>Qwen 3 se ha diseñado pensando en la integración, no sólo en el rendimiento aislado de los modelos:</p>
<ul>
<li><p><strong>La compatibilidad con MCP (Model Context Protocol)</strong> permite una integración perfecta con bases de datos externas, API y herramientas, reduciendo la sobrecarga de ingeniería para aplicaciones complejas.</p></li>
<li><p><strong>Qwen-Agent</strong> mejora la llamada a herramientas y la orquestación de flujos de trabajo, apoyando la construcción de sistemas de IA más dinámicos y procesables.</p></li>
<li><p><strong>La compatibilidad multilingüe con 119 idiomas y dialectos</strong> convierte a Qwen 3 en la mejor opción para aplicaciones dirigidas a mercados globales y multilingües.</p></li>
</ul>
<p>En conjunto, estas características facilitan a los desarrolladores la creación de sistemas de producción sin necesidad de una amplia ingeniería personalizada en torno al modelo.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 ya es compatible con DeepSearcher<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> es un proyecto de código abierto para la recuperación profunda y la generación de informes, diseñado como una alternativa local a Deep Research de OpenAI. Ayuda a los desarrolladores a crear sistemas que generan información de alta calidad y contextualizada a partir de fuentes de datos privadas o específicas de un dominio.</p>
<p>DeepSearcher es ahora compatible con la arquitectura de inferencia híbrida de Qwen 3, lo que permite a los desarrolladores alternar el razonamiento de forma dinámica, aplicando una inferencia más profunda sólo cuando añade valor y omitiéndola cuando la velocidad es más importante.</p>
<p>DeepSearcher se integra con<a href="https://milvus.io"> Milvus</a>, una base de datos vectorial de alto rendimiento desarrollada por los ingenieros de Zilliz, para proporcionar una búsqueda semántica rápida y precisa sobre datos locales. Combinado con la flexibilidad del modelo, ofrece a los desarrolladores un mayor control sobre el comportamiento del sistema, el coste y la experiencia del usuario.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">Tutorial práctico: Creación de un sistema RAG con Qwen 3 y Milvus<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Pongamos estos modelos Qwen 3 a trabajar construyendo un sistema RAG utilizando la base de datos vectorial Milvus.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">Configure el entorno.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>Nota: Necesitará obtener la Clave API de Alibaba Cloud.</p>
<h3 id="Data-Preparation" class="common-anchor-header">Preparación de datos</h3><p>Utilizaremos las páginas de documentación de Milvus como nuestra base de conocimiento principal.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">Configuración de modelos</h3><p>Utilizaremos la API compatible con OpenAI de DashScope para acceder a Qwen 3:</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>Vamos a generar una incrustación de prueba e imprimir sus dimensiones y primeros elementos:</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Salida:</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Creación de una colección Milvus</h3><p>Configuremos nuestra base de datos vectorial Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Acerca de la configuración de parámetros MilvusClient:</p>
<ul>
<li><p>Establecer el URI a un archivo local (por ejemplo, <code translate="no">./milvus.db</code>) es el método más conveniente, ya que utiliza automáticamente Milvus Lite para almacenar todos los datos en ese archivo.</p></li>
<li><p>Para datos a gran escala, puede configurar un servidor Milvus más potente en Docker o Kubernetes. En este caso, utilice el URI del servidor (por ejemplo, <code translate="no">http://localhost:19530</code>) como su URI.</p></li>
<li><p>Si desea utilizar <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(el servicio gestionado de Milvus), ajuste el URI y el token, que se corresponden con el Public Endpoint y la clave API en Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Añadir documentos a la colección</h3><p>Ahora crearemos incrustaciones para nuestros trozos de texto y los añadiremos a Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">Construcción del sistema de consulta RAG</h3><p>Ahora viene la parte emocionante - vamos a configurar nuestro sistema RAG para responder preguntas.</p>
<p>Especifiquemos una pregunta común sobre Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Busquemos esta pregunta en la colección y obtengamos los 3 primeros resultados que coincidan semánticamente:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Veamos los resultados de la búsqueda para esta consulta:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Resultado:</p>
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
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">Utilización del LLM para construir una respuesta RAG</h3><p>Convierta los documentos recuperados a formato de cadena:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Proporcionar un prompt de sistema y un prompt de usuario para el modelo de lenguaje grande:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
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
<button class="copy-code-btn"></button></code></pre>
<p>Utilizar el último modelo Qwen para generar una respuesta basada en el prompt:</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>Resultado:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">Comparación de los modos de razonamiento y no razonamiento: Una prueba práctica<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Hice una prueba comparando los dos modos de inferencia en un problema matemático:</p>
<p><strong>Problema:</strong> La persona A y la persona B empiezan a correr desde el mismo lugar. A sale primero y corre durante 2 horas a 5km/h. B le sigue a 15 km/h. ¿Cuánto tardará B en alcanzarle?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Con el modo de razonamiento activado:</strong></p>
<ul>
<li><p>Tiempo de procesamiento: ~74,83 segundos</p></li>
<li><p>Análisis profundo, análisis sintáctico del problema, múltiples vías de solución</p></li>
<li><p>Salida markdown de alta calidad con fórmulas</p></li>
</ul>
<p>(La imagen siguiente es una captura de pantalla de la visualización de la respuesta markdown del modelo, para comodidad del lector)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Modo sin razonamiento:</strong></p>
<p>En el código, sólo es necesario establecer <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>Resultados del modo sin razonamiento en este problema:</p>
<ul>
<li>Tiempo de procesamiento: ~74,83 segundos</li>
<li>Análisis profundo, análisis sintáctico del problema, múltiples vías de solución</li>
<li>Salida markdown de alta calidad con fórmulas</li>
</ul>
<p>(La imagen de abajo es una captura de pantalla de la visualización de la respuesta markdown del modelo, para comodidad del lector)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Qwen 3 introduce una arquitectura de modelo flexible que se alinea bien con las necesidades del mundo real del desarrollo GenAI. Con una gama de tamaños de modelo (incluyendo variantes densas y MoE), modos de inferencia híbridos, integración MCP y soporte multilingüe, ofrece a los desarrolladores más opciones para ajustar el rendimiento, la latencia y el coste, dependiendo del caso de uso.</p>
<p>En lugar de hacer hincapié únicamente en la escala, Qwen 3 se centra en la adaptabilidad. Esto lo convierte en una opción práctica para crear canalizaciones RAG, <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">agentes de IA</a> y aplicaciones de producción que requieren tanto capacidades de razonamiento como un funcionamiento rentable.</p>
<p>Cuando se combina con una infraestructura como<a href="https://milvus.io"> Milvus</a>, una base de datos vectorial de código abierto de alto rendimiento, las capacidades de Qwen 3 resultan aún más útiles, ya que permiten una búsqueda semántica rápida y una integración sin problemas con los sistemas de datos locales. Juntos, ofrecen una base sólida para aplicaciones GenAI inteligentes y con capacidad de respuesta a escala.</p>
