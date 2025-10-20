---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >-
  vLLM Semantic Router + Milvus: cómo el enrutamiento semántico y el
  almacenamiento en caché crean sistemas de inteligencia artificial escalables
  de forma inteligente
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  Descubra cómo vLLM, Milvus y el enrutamiento semántico optimizan la inferencia
  de grandes modelos, reducen los costes de computación e impulsan el
  rendimiento de la IA en despliegues escalables.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>La mayoría de las aplicaciones de IA se basan en un único modelo para cada solicitud. Pero este enfoque no tarda en toparse con límites. Los modelos grandes son potentes pero caros, incluso cuando se utilizan para consultas sencillas. Los modelos más pequeños son más baratos y rápidos, pero no pueden gestionar razonamientos complejos. Cuando el tráfico aumenta (por ejemplo, cuando su aplicación de IA se convierte en viral con diez millones de usuarios de la noche a la mañana), la ineficacia de esta configuración de un modelo para todos se hace dolorosamente evidente. La latencia se dispara, la factura de la GPU se dispara y el modelo que ayer funcionaba bien empieza a boquear.</p>
<p>Y amigo mío, <em>tú</em>, el ingeniero que está detrás de esta aplicación, tienes que arreglarlo, y rápido.</p>
<p>Imagina desplegar varios modelos de distintos tamaños y que tu sistema seleccione automáticamente el mejor para cada solicitud. Las peticiones sencillas van a los modelos más pequeños; las consultas complejas, a los más grandes. Ésa es la idea en la que se basa el <a href="https://github.com/vllm-project/semantic-router"><strong>enrutador semántico de vLLM, un</strong></a>mecanismo de enrutamiento que dirige las solicitudes en función del significado, no de los puntos finales. Analiza el contenido semántico, la complejidad y la intención de cada entrada para seleccionar el modelo lingüístico más adecuado, garantizando que cada consulta sea gestionada por el modelo mejor equipado para ello.</p>
<p>Para que esto sea aún más eficiente, el enrutador semántico se asocia con <a href="https://milvus.io/"><strong>Milvus</strong></a>, una base de datos vectorial de código abierto que sirve como <strong>capa de caché semántica</strong>. Antes de volver a calcular una respuesta, comprueba si ya se ha procesado una consulta semánticamente similar y, en caso afirmativo, recupera al instante el resultado almacenado en caché. El resultado: respuestas más rápidas, menores costes y un sistema de recuperación que se amplía de forma inteligente en lugar de derrochar.</p>
<p>En este artículo, profundizaremos en el funcionamiento del <strong>enrutador semántico vLLM</strong>, cómo <strong>Milvus</strong> potencia su capa de almacenamiento en caché y cómo puede aplicarse esta arquitectura en aplicaciones de IA del mundo real.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">¿Qué es un enrutador semántico?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>En esencia, un <strong>enrutador</strong> semántico es un sistema que decide <em>qué modelo</em> debe gestionar una solicitud determinada en función de su significado, complejidad e intención. En lugar de dirigir todo a un modelo, distribuye las solicitudes de forma inteligente entre varios modelos para equilibrar la precisión, la latencia y el coste.</p>
<p>Su arquitectura se basa en tres capas clave: <strong>Enrutamiento semántico</strong>, <strong>Mezcla de modelos (MoM)</strong> y <strong>Capa de caché</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">Capa de enrutamiento semántico</h3><p>La <strong>capa</strong> de <strong>enrutamiento</strong> semántico es el cerebro del sistema. Analiza cada entrada -lo que se pide, su complejidad y el tipo de razonamiento que requiere- para seleccionar el modelo más adecuado. Por ejemplo, una simple búsqueda de datos puede ir a un modelo ligero, mientras que una consulta de razonamiento de varios pasos se dirige a uno más grande. Este enrutamiento dinámico mantiene la capacidad de respuesta del sistema incluso cuando aumentan el tráfico y la diversidad de las consultas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">La capa de mezcla de modelos (MdM)</h3><p>La segunda capa, la <strong>Mezcla de Modelos (MdM)</strong>, integra múltiples modelos de diferentes tamaños y capacidades en un sistema unificado. Está inspirada en la arquitectura de <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mezcla de Expertos</strong></a> <strong>(MoE)</strong>, pero en lugar de elegir "expertos" dentro de un único modelo de gran tamaño, opera a través de múltiples modelos independientes. Este diseño reduce la latencia, disminuye los costes y evita quedar atrapado en un único proveedor de modelos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">La capa de caché: Donde Milvus marca la diferencia</h3><p>Por último, la <strong>capa de cach</strong>é <strong>-alimentada</strong>por <a href="https://milvus.io/">Milvus Vector Database- actúa</a>como la memoria del sistema. Antes de ejecutar una nueva consulta, comprueba si se ha procesado anteriormente una solicitud semánticamente similar. En caso afirmativo, recupera el resultado almacenado en caché al instante, lo que ahorra tiempo de cálculo y mejora el rendimiento.</p>
<p>Los sistemas tradicionales de almacenamiento en caché se basan en almacenes clave-valor en memoria, que hacen coincidir las peticiones por cadenas o plantillas exactas. Esto funciona bien cuando las consultas son repetitivas y predecibles. Pero los usuarios reales rara vez escriben lo mismo dos veces. Una vez que la frase cambia -incluso ligeramente- la caché no reconoce que se trata de la misma intención. Con el tiempo, la tasa de aciertos de la caché disminuye y las mejoras de rendimiento se desvanecen a medida que el lenguaje se desvía de forma natural.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para solucionarlo, necesitamos una caché que entienda <em>el significado</em>, no sólo las palabras coincidentes. Ahí es donde entra en juego <strong>la recuperación semántica</strong>. En lugar de comparar cadenas, compara incrustaciones: representaciones vectoriales de alta dimensión que captan la similitud semántica. El reto, sin embargo, es la escala. Ejecutar una búsqueda de fuerza bruta en millones o miles de millones de vectores en una sola máquina (con una complejidad temporal O(N-d)) es prohibitivo desde el punto de vista informático. Los costes de memoria se disparan, la escalabilidad horizontal se desploma y el sistema tiene dificultades para gestionar picos repentinos de tráfico o consultas de cola larga.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus</strong>, una base de datos vectorial distribuida creada específicamente para la búsqueda semántica a gran escala, aporta la escalabilidad horizontal y la tolerancia a fallos que necesita esta capa de caché. Almacena las incrustaciones de forma eficiente en todos los nodos y realiza búsquedas <a href="https://zilliz.com/blog/ANN-machine-learning">de Vecino más Cercano Aproximado</a>(RNA) con una latencia mínima, incluso a escala masiva. Con los umbrales de similitud y las estrategias de emergencia adecuadas, Milvus garantiza un rendimiento estable y predecible, convirtiendo la capa de caché en una memoria semántica resistente para todo su sistema de enrutamiento.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">Cómo utilizan los desarrolladores Semantic Router + Milvus en la producción<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>La combinación de <strong>vLLM Semantic Router</strong> y <strong>Milvus</strong> brilla en entornos de producción reales en los que la velocidad, el coste y la reutilización son importantes.</p>
<p>Destacan tres escenarios comunes:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. Preguntas y respuestas de atención al cliente</h3><p>Los robots de atención al cliente gestionan enormes volúmenes de consultas repetitivas cada día: restablecimiento de contraseñas, actualizaciones de cuentas, estados de entrega. Este ámbito es sensible tanto a los costes como a la latencia, por lo que resulta ideal para el enrutamiento semántico. El enrutador envía las preguntas rutinarias a modelos más pequeños y rápidos y eleva las complejas o ambiguas a modelos más grandes para un razonamiento más profundo. Mientras tanto, Milvus almacena en caché los pares de preguntas y respuestas anteriores, de modo que cuando aparecen consultas similares, el sistema puede reutilizar instantáneamente las respuestas anteriores en lugar de regenerarlas.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. Asistencia de código</h3><p>En las herramientas para desarrolladores o los asistentes IDE, muchas consultas se solapan: ayuda sintáctica, búsquedas de API, pequeñas pistas de depuración. Analizando la estructura semántica de cada consulta, el enrutador selecciona dinámicamente un tamaño de modelo apropiado: ligero para tareas sencillas, más capaz para razonamientos de varios pasos. Milvus aumenta aún más la capacidad de respuesta almacenando en caché problemas de codificación similares y sus soluciones, convirtiendo las interacciones previas del usuario en una base de conocimientos reutilizable.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. Base de conocimientos para empresas</h3><p>Las consultas empresariales tienden a repetirse con el tiempo: búsquedas de políticas, referencias de cumplimiento, preguntas frecuentes sobre productos. Con Milvus como capa de caché semántica, las preguntas más frecuentes y sus respuestas pueden almacenarse y recuperarse de forma eficiente. Esto minimiza los cálculos redundantes y mantiene la coherencia de las respuestas en todos los departamentos y regiones.</p>
<p>Bajo el capó, el <strong>Semantic Router + Milvus</strong> pipeline se implementa en <strong>Go</strong> y <strong>Rust</strong> para un alto rendimiento y baja latencia. Integrado en la capa de puerta de enlace, supervisa continuamente las métricas clave, como las tasas de aciertos, la latencia de enrutamiento y el rendimiento del modelo, para ajustar las estrategias de enrutamiento en tiempo real.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">Cómo probar rápidamente el almacenamiento en caché semántico en el enrutador semántico<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de desplegar el almacenamiento en caché semántico a escala, es útil validar cómo se comporta en una configuración controlada. En esta sección, realizaremos una prueba local rápida que muestra cómo el enrutador semántico utiliza <strong>Milvus</strong> como caché semántica. Verá cómo las consultas similares llegan a la caché de forma instantánea, mientras que las nuevas o distintas activan la generación de modelos, lo que demuestra la lógica de la caché en acción.</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><ul>
<li>Entorno de contenedor: Docker + Docker Compose</li>
<li>Base de datos vectorial: Milvus Service</li>
<li>LLM + Incrustación: Proyecto descargado localmente</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1.Despliegue de la base de datos vectorial Milvus</h3><p>Descargue los archivos de despliegue</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Inicie el servicio Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. Clone el proyecto</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. Descargar los modelos locales</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. Modificaciones en la configuración</h3><p>Nota: Modificar el tipo semantic_cache a milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modificar la configuración Mmilvus Nota: Rellenar el servicio Milvusmilvus que se acaba de desplegar</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. 5. Iniciar el proyecto</h3><p>Nota: Se recomienda modificar algunas dependencias de Dockerfile a fuentes domésticas</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. Pruebe las peticiones</h3><p>Nota: Dos peticiones en total (sin caché y con caché) Primera petición:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Salida:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Segunda petición:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Salida:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Esta prueba demuestra la caché semántica de Semantic Router en acción. Aprovechando Milvus como base de datos vectorial, empareja eficazmente consultas semánticamente similares, mejorando los tiempos de respuesta cuando los usuarios hacen las mismas preguntas o preguntas similares.</p>
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
    </button></h2><p>A medida que las cargas de trabajo de IA crecen y la optimización de costes se vuelve esencial, la combinación de vLLM Semantic Router y <a href="https://milvus.io/">Milvus</a> proporciona una forma práctica de escalar de forma inteligente. Al enrutar cada consulta al modelo adecuado y almacenar en caché resultados semánticamente similares con una base de datos vectorial distribuida, esta configuración reduce la sobrecarga informática al tiempo que mantiene las respuestas rápidas y coherentes en todos los casos de uso.</p>
<p>En resumen, se consigue un escalado más inteligente: menos fuerza bruta, más cerebro.</p>
<p>Si desea profundizar en este tema, únase a la conversación en nuestro <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> o abra una incidencia en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> sesión de</a> 20 minutos<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> de Milvus Office Hours</a> para obtener orientación personalizada, ideas y profundizaciones técnicas del equipo que está detrás de Milvus.</p>
