---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >-
  GPT-oss frente a o4-mini: rendimiento a la altura de las circunstancias,
  fiable pero no alucinante
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  OpenAI acapara la atención al abrir dos modelos de razonamiento: gpt-oss-120b
  y gpt-oss-20b, con licencia permisiva Apache 2.0.
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>El mundo de la IA está que arde. En pocas semanas, Anthropic presentó Claude 4.1 Opus, DeepMind sorprendió a todos con el simulador mundial Genie 3 y, ahora, OpenAI roba el centro de atención al abrir dos modelos de razonamiento: <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> y <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>, con licencia permisiva bajo Apache 2.0.</p>
<p>Tras su lanzamiento, estos modelos se dispararon instantáneamente al puesto número 1 de tendencias en Hugging Face, y por una buena razón. Esta es la primera vez desde 2019 que OpenAI ha lanzado modelos de peso abierto que están realmente listos para la producción. El movimiento no es accidental: después de años de impulsar el acceso exclusivo a la API, OpenAI está respondiendo claramente a la presión de los líderes de código abierto como DeepSeek, LLaMA de Meta y Qwen, que han estado dominando tanto los puntos de referencia como los flujos de trabajo de los desarrolladores.</p>
<p>En este artículo, analizaremos en qué se diferencia GPT-oss, cómo se compara con modelos abiertos líderes como DeepSeek R1 y Qwen 3, y por qué debería interesar a los desarrolladores. También explicaremos cómo construir un sistema RAG con capacidad de razonamiento utilizando GPT-oss y Milvus, la base de datos vectorial de código abierto más popular.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">¿Qué hace especial a GPT-oss y por qué debería importarte?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss no es sólo otro programa de reducción de peso. Ofrece prestaciones en cinco áreas clave que importan a los desarrolladores:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: Construido para el despliegue Edge</h3><p>GPT-oss se presenta en dos variantes de tamaño estratégico:</p>
<ul>
<li><p>gpt-oss-120b: 117B totales, 5,1B activos por token</p></li>
<li><p>gpt-oss-20b: 21B totales, 3,6B activos por token</p></li>
</ul>
<p>Gracias a la arquitectura Mixture-of-Experts (MoE), sólo un subconjunto de parámetros está activo durante la inferencia. Esto hace que ambos modelos sean ligeros en relación con su tamaño:</p>
<ul>
<li><p>gpt-oss-120b se ejecuta en una sola GPU de 80 GB (H100)</p></li>
<li><p>gpt-oss-20b ocupa sólo 16 GB de VRAM, lo que significa que puede ejecutarse en portátiles de gama alta o dispositivos de última generación.</p></li>
</ul>
<p>Según las pruebas de OpenAI, gpt-oss-20b es el modelo más rápido de OpenAI para inferencia, ideal para despliegues de baja latencia o agentes de razonamiento offline.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: Gran rendimiento en pruebas de referencia</h3><p>Según las evaluaciones de OpenAI</p>
<ul>
<li><p><strong>gpt-oss-120b</strong> rinde casi en paridad con o4-mini en razonamiento, uso de herramientas y codificación competitiva (Codeforces, MMLU, TauBench)</p></li>
<li><p><strong>gpt-oss-20b</strong> compite con o3-mini e incluso lo supera en razonamiento matemático y sanitario.</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: Formación rentable</h3><p>OpenAI afirma tener un rendimiento equivalente al de o3-mini y o4-mini, pero con unos costes de formación drásticamente inferiores:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>: 2,1 millones de horas H100 → ~10 millones de dólares</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210.000 horas H100 → ~1 millón de dólares</p></li>
</ul>
<p>Compárese con los presupuestos de varios cientos de millones de dólares de modelos como GPT-4. GPT-oss demuestra que las opciones eficientes de escalado y arquitectura pueden ofrecer un rendimiento competitivo sin una enorme huella de carbono.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: Verdadera libertad de código abierto</h3><p>GPT-oss utiliza la licencia Apache 2.0, lo que significa que</p>
<ul>
<li><p>Uso comercial permitido</p></li>
<li><p>plenos derechos de modificación y redistribución</p></li>
<li><p>Sin restricciones de uso ni cláusulas de copyleft</p></li>
</ul>
<p>Se trata realmente de código abierto, no de una versión exclusiva para investigación. Puede adaptarlo a su uso específico, implantarlo en producción con pleno control y crear productos comerciales a partir de él. Entre sus principales características se incluyen la profundidad de razonamiento configurable (baja/media/alta), la visibilidad completa de la cadena de pensamiento y la llamada a herramientas nativas con soporte de salida estructurada.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: Posible avance de GPT-5</h3><p>OpenAI no lo ha revelado todo, pero los detalles de la arquitectura sugieren que podría ser un avance de <strong>GPT-5</strong>:</p>
<ul>
<li><p>Utiliza MoE con 4 expertos por entrada</p></li>
<li><p>Alterna atención densa + atención dispersa local (patrón GPT-3).</p></li>
<li><p>Presenta más cabezas de atención.</p></li>
<li><p>Curiosamente, las unidades de sesgo de GPT-2 han regresado.</p></li>
</ul>
<p>Si estás atento a las señales sobre lo que viene, GPT-oss puede ser la pista pública más clara hasta el momento.</p>
<h3 id="Core-Specifications" class="common-anchor-header">Especificaciones del núcleo</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modelo</strong></td><td><strong>Parámetros totales</strong></td><td><strong>Parámetros activos</strong></td><td><strong>Expertos</strong></td><td><strong>Contexto Longitud</strong></td><td><strong>VRAM Req</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16 GB</td></tr>
</tbody>
</table>
<p>Ambos modelos utilizan el tokenizador o200k_harmony y admiten una longitud de contexto de 128.000 tokens (aproximadamente 96.000-100.000 palabras).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss frente a otros modelos de razonamiento<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>A continuación se muestra cómo GPT-oss se compara con los modelos internos de OpenAI y con los principales competidores de código abierto:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modelo</strong></td><td><strong>Parámetros (Activo)</strong></td><td><strong>Memoria</strong></td><td><strong>Puntos fuertes</strong></td></tr>
<tr><td><strong>gpt-oss-120b</strong></td><td>117B (5,1B activa)</td><td>80GB</td><td>GPU única, razonamiento abierto</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3,6B activos)</td><td>16 GB</td><td>Despliegue en el borde, inferencia rápida</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B activos)</td><td>Distribuido</td><td>Líder en pruebas comparativas, rendimiento demostrado</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>Propietario</td><td>Sólo API</td><td>Razonamiento sólido (cerrado)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>Propietario</td><td>Sólo API</td><td>Razonamiento ligero (cerrado)</td></tr>
</tbody>
</table>
<p>Basándonos en varios modelos de evaluación comparativa, esto es lo que hemos encontrado:</p>
<ul>
<li><p><strong>GPT-oss frente a los modelos propios de OpenAI:</strong> gpt-oss-120b iguala a o4-mini en competición matemática (AIME), codificación (Codeforces) y uso de herramientas (TauBench). El modelo 20b tiene un rendimiento similar a o3-mini a pesar de ser mucho más pequeño.</p></li>
<li><p><strong>GPT-oss frente a DeepSeek R1:</strong> DeepSeek R1 domina en rendimiento puro, pero requiere una infraestructura distribuida. GPT-oss ofrece un despliegue más sencillo, sin necesidad de una configuración distribuida para el modelo 120b.</p></li>
</ul>
<p>En resumen, GPT-oss ofrece la mejor combinación de rendimiento, acceso abierto e implantación. DeepSeek R1 gana en rendimiento puro, pero GPT-oss logra el equilibrio óptimo para la mayoría de los desarrolladores.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">Práctico: Construir con GPT-oss + Milvus<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que hemos visto lo que GPT-oss aporta, es hora de ponerlo en práctica.</p>
<p>En las siguientes secciones, recorreremos un tutorial práctico para construir un sistema RAG con capacidad de razonamiento utilizando gpt-oss-20b y Milvus, todo ejecutado localmente, sin necesidad de clave API.</p>
<h3 id="Environment-Setup" class="common-anchor-header">Configuración del entorno</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">Preparación del conjunto de datos</h3><p>Utilizaremos la documentación de Milvus como base de conocimiento:</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">Configuración del modelo</h3><p>Acceda a GPT-oss a través de <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> (o ejecútelo localmente). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a> es una plataforma que permite a los desarrolladores acceder y cambiar entre varios modelos de IA (como GPT-4, Claude, Mistral) a través de una única API unificada. Resulta útil para comparar modelos o crear aplicaciones que funcionen con distintos proveedores de IA. La serie GPT-oss ya está disponible en OpenRouter.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Configurar la base de datos vectorial Milvus</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
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
<p>Salida:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">Canal de consulta RAG</h3><p>Ahora viene la parte emocionante: vamos a configurar nuestro sistema RAG para responder preguntas.</p>
<p>Especifiquemos una pregunta común sobre Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Busquemos esta pregunta en la colección y obtengamos los 3 primeros resultados semánticamente coincidentes:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Veamos los resultados de la búsqueda para esta consulta:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">Utilizar la GPT-oss para construir una respuesta RAG</h3><p>Convierta los documentos recuperados a formato de cadena:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Proporcionar un prompt de sistema y un prompt de usuario para el modelo de lenguaje grande:</p>
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
<p>Utilizar el último modelo gpt-oss para generar una respuesta basada en el prompt:</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">Reflexiones finales sobre GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss es la admisión silenciosa de OpenAI de que el código abierto ya no puede ser ignorado. No supera a DeepSeek R1 ni a Qwen 3 ni a muchos otros modelos, pero aporta algo que ellos no tienen: El proceso de entrenamiento de OpenAI, aplicado a un modelo que se puede inspeccionar y ejecutar localmente.</p>
<p><strong>¿Rendimiento? Sólido. No es alucinante, pero es fiable.</strong> El modelo 20B que se ejecuta en hardware de consumo, o incluso móvil con LM Studio, es el tipo de ventaja práctica que realmente importa a los desarrolladores. Es más un "esto funciona" que un "vaya, esto lo cambia todo". Y, sinceramente, eso está bien.</p>
<p><strong>Donde se queda corto es en el soporte multilingüe.</strong> Si trabajas en otro idioma que no sea el inglés, encontrarás frases extrañas, problemas de ortografía y confusión general. Está claro que el modelo se ha entrenado pensando primero en el inglés. Si la cobertura global es importante, es probable que tengas que perfeccionarlo con un conjunto de datos multilingües.</p>
<p>Lo más interesante, sin embargo, es el momento. El teaser de OpenAI en X -con un "5" en la palabra "LIVESTREAM"- parece un montaje. Puede que GPT-oss no sea el acto principal, pero podría ser un anticipo de lo que está por llegar en GPT-5. Los mismos ingredientes, diferente escala. Mismos ingredientes, diferente escala. Esperemos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>La verdadera victoria es tener más opciones de alta calidad.</strong> La competencia impulsa la innovación, y la reincorporación de OpenAI al desarrollo de código abierto beneficia a todos. Pruebe GPT-oss en función de sus requisitos específicos, pero elija en función de lo que realmente funciona para su caso de uso, no del reconocimiento de la marca.</p>
