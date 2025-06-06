---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: >-
  Cómo configurar OpenTelemetry con Milvus para el seguimiento de solicitudes de
  extremo a extremo
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  Supervise el rendimiento de la base de datos vectorial Milvus con el rastreo
  OpenTelemetry. Tutorial completo con configuración Docker, cliente Python,
  visualización Jaeger y consejos de depuración.
cover: >-
  assets.zilliz.com/How_to_Set_Up_Open_Telemetry_with_Milvus_for_End_to_End_Request_Tracing_f1842af82a.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Milvus tracing, OpenTelemetry, Jaeger observability, gRPC monitoring, vector
  database
meta_title: How to Set Up OpenTelemetry with Milvus for End-to-End Request Tracing
origin: >-
  https://milvus.io/blog/how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
---
<h2 id="Introduction" class="common-anchor-header">Introducción<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando se crean aplicaciones basadas en IA con <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de datos vectoriales</a>, comprender el rendimiento del sistema resulta fundamental a medida que se amplía la aplicación. Una única solicitud de búsqueda puede desencadenar múltiples operaciones internas (indexación de vectores, cálculos de similitud y recuperación de datos) en distintos componentes. Sin una capacidad de observación adecuada, diagnosticar ralentizaciones o fallos es como encontrar una aguja en un pajar.</p>
<p><strong>La trazabilidad distribuida</strong> resuelve este problema mediante el seguimiento de las peticiones a medida que fluyen por el sistema, lo que ofrece una imagen completa de lo que ocurre bajo el capó.</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry (OTEL)</strong></a> es un marco de observabilidad de código abierto respaldado por la <a href="https://www.cncf.io/">Cloud Native Computing Foundation (CNCF)</a> que le ayuda a recopilar trazas, métricas y registros de sus aplicaciones. Es independiente del proveedor, está ampliamente adoptado y funciona a la perfección con las herramientas de supervisión más populares.</p>
<p>En esta guía, le mostraremos cómo añadir rastreo de extremo a extremo a <a href="https://milvus.io/"><strong>Milvus</strong></a>, una base de datos vectorial de alto rendimiento creada para aplicaciones de IA. Aprenderá a realizar un seguimiento de todo, desde las solicitudes de los clientes hasta las operaciones internas de la base de datos, lo que facilitará enormemente la optimización del rendimiento y la depuración.</p>
<p>También utilizaremos <a href="https://github.com/jaegertracing/jaeger-ui"><strong>Jaeger</strong></a> para visualizar los datos de rastreo, lo que le proporcionará una poderosa visión de las operaciones de su base de datos vectorial.</p>
<h2 id="What-Well-Build" class="common-anchor-header">Qué construiremos<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Al final de este tutorial, usted tendrá una tubería de rastreo completa que consiste en:</p>
<ol>
<li><p><strong>Base de datos vectorial Milvus</strong> con rastreo OpenTelemetry habilitado</p></li>
<li><p><strong>Jaeger</strong> para visualización y análisis de trazas</p></li>
<li><p><strong>Un cliente Python</strong> que rastrea automáticamente todas las operaciones Milvus</p></li>
<li><p><strong>Visibilidad de extremo a extremo</strong> de las solicitudes de los clientes a las operaciones de base de datos</p></li>
</ol>
<p>Tiempo estimado de instalación: 15-20 minutos</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">Inicio rápido (5 minutos)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>¿Quiere ver cómo funciona primero? Este es el camino más rápido:</p>
<ol>
<li>Clone el repositorio de demostración:</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Inicie los servicios:</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Espere 30 segundos, luego compruebe Jaeger UI en: <code translate="no">http://localhost:16686</code></p></li>
<li><p>Ejecuta el ejemplo Python:</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Actualice Jaeger y busque rastros de ambos servicios <code translate="no">standalone</code> (Milvus) y <code translate="no">milvus-client</code>.</li>
</ol>
<p>Si ves que aparecen trazas, ¡todo funciona! Ahora vamos a entender cómo encaja todo.</p>
<h2 id="Environment-Setup" class="common-anchor-header">Configuración del entorno<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Esto es lo que necesitará</p>
<ul>
<li><p><strong>Milvus 2.5.11</strong> (base de datos vectorial)</p></li>
<li><p><strong>Jaeger 1.46.0</strong> (visualización de trazas)</p></li>
<li><p><strong>Python 3.7+</strong> (desarrollo cliente)</p></li>
<li><p><strong>Docker y Docker Compose</strong> (orquestación de contenedores)</p></li>
</ul>
<p>Estas versiones se han probado juntas; sin embargo, las versiones más recientes también deberían funcionar bien.</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">Configuración de Milvus y Jaeger<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>Utilizaremos Docker Compose para ejecutar ambos servicios con la red y la configuración adecuadas.</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">Configuración de Docker Compose</h3><p>Cree un archivo <code translate="no">docker-compose.yaml</code>:</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.7&#x27;</span>
Services:
<span class="hljs-comment"># Milvus - configured to send traces to Jaeger</span>
  milvus:
    image: milvusdb/milvus:v2.5.11
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      - ETCD_USE_EMBED=<span class="hljs-literal">true</span>
      - ETCD_DATA_DIR=/var/lib/milvus/etcd
      - ETCD_CONFIG_PATH=/milvus/configs/embedEtcd.yaml
      - COMMON_STORAGETYPE=<span class="hljs-built_in">local</span>
    volumes:
      - ./embedEtcd.yaml:/milvus/configs/embedEtcd.yaml
      - ./milvus.yaml:/milvus/configs/milvus.yaml
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    security_opt:
      - seccomp:unconfined
    depends_on:
      - jaeger

<span class="hljs-comment"># Jaeger - starts first since Milvus depends on it</span>
  jaeger:
    image: jaegertracing/all-in-one:1.46.0
    ports:
      - <span class="hljs-string">&quot;16686:16686&quot;</span>  <span class="hljs-comment"># Jaeger UI</span>
      - <span class="hljs-string">&quot;4317:4317&quot;</span>    <span class="hljs-comment"># OTLP gRPC receiver</span>
      - <span class="hljs-string">&quot;4318:4318&quot;</span>    <span class="hljs-comment"># OTLP HTTP receiver</span>
      - <span class="hljs-string">&quot;5778:5778&quot;</span>    <span class="hljs-comment"># Jaeger agent configs</span>
      - <span class="hljs-string">&quot;9411:9411&quot;</span>    <span class="hljs-comment"># Zipkin compatible endpoint</span>
    environment:
      - COLLECTOR_OTLP_ENABLED=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong> Los archivos de configuración de ejemplo <code translate="no">embedEtcd.yaml</code> y <code translate="no">milvus.yaml</code> se pueden encontrar en: <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel.</a></p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">Configuración de seguimiento de Milvus</h3><p>Cree <code translate="no">configs/milvus.yaml</code> con la configuración de rastreo:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry tracing configuration</span>
trace:
  exporter: otlp           <span class="hljs-comment"># Use OpenTelemetry Protocol</span>
  sampleFraction: 1.0      <span class="hljs-comment"># Trace 100% of requests (reduce for production)</span>
  otlp:
    endpoint: jaeger:4317  <span class="hljs-comment"># Jaeger&#x27;s OTLP gRPC endpoint</span>
    method: grpc          <span class="hljs-comment"># Use gRPC protocol</span>
    secure: <span class="hljs-literal">false</span>         <span class="hljs-comment"># No TLS (use true in production)</span>
    initTimeoutSeconds: 10
<button class="copy-code-btn"></button></code></pre>
<p>Configuración explicada:</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> rastrea cada petición (útil para desarrollo, pero use 0.1 o inferior en producción)</p></li>
<li><p><code translate="no">secure: false</code> deshabilita TLS (habilitar en producción)</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> utiliza el nombre del servicio Docker para la comunicación interna</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">Inicio de los servicios</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">Verificación de la entrega de trazas de Milvus a Jaeger</h3><p>Una vez que los servicios se están ejecutando, puede verificar si los datos de rastreo se emiten desde el standalone Milvus y son recibidos por Jaeger.</p>
<ul>
<li><p>Abra su navegador y visite Jaeger UI en: <code translate="no">http://localhost:16686/search</code></p></li>
<li><p>En el panel de <strong>búsqueda</strong> (arriba a la izquierda), elija el menú desplegable <strong>Servicio</strong> y seleccione <code translate="no">standalone</code>. Si ve <code translate="no">standalone</code> en la lista de servicios, significa que la configuración OpenTelemetry incorporada de Milvus está funcionando y ha enviado con éxito datos de rastreo a Jaeger.</p></li>
<li><p>Haga clic en <strong>Buscar trazas</strong> para explorar las cadenas de trazas generadas por los componentes internos de Milvus (como las interacciones gRPC entre módulos).</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">Si no se muestran los datos de rastreo:</h3><ul>
<li><p>Vuelva a comprobar que el bloque <code translate="no">trace</code> en <code translate="no">milvus.yaml</code> está configurado correctamente y que Jaeger se está ejecutando sin problemas.</p></li>
<li><p>Inspeccione los registros del contenedor Milvus para ver si hay algún error relacionado con la inicialización de Trace.</p></li>
<li><p>Espere unos segundos y actualice la interfaz de usuario de Jaeger; los informes de rastreo pueden experimentar un breve retraso.</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">Configuración y dependencias del cliente Python<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora vamos a configurar el cliente Python para rastrear todas las operaciones de Milvus automáticamente.</p>
<p>En primer lugar, cree un archivo <code translate="no">requirements.txt</code>:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry core</span>
opentelemetry-api==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-sdk==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># OTLP exporters</span>
opentelemetry-exporter-otlp==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-exporter-otlp-proto-grpc==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Automatic gRPC instrumentation</span>
opentelemetry-instrumentation-grpc==<span class="hljs-number">0.54</span>b1
<span class="hljs-comment"># Milvus client</span>
pymilvus==<span class="hljs-number">2.5</span><span class="hljs-number">.9</span>
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, instale las dependencias a través de:</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>Esto asegura que su entorno Python está listo para rastrear las llamadas gRPC realizadas al backend Milvus.</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">Inicialización de OpenTelemetry en Python<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora, vamos a configurar el rastreo dentro de su aplicación Python. Este fragmento configura OTEL con instrumentación gRPC y prepara un rastreador.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace
<span class="hljs-keyword">from</span> opentelemetry.sdk.resources <span class="hljs-keyword">import</span> Resource
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace <span class="hljs-keyword">import</span> TracerProvider
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace.export <span class="hljs-keyword">import</span> BatchSpanProcessor
<span class="hljs-keyword">from</span> opentelemetry.exporter.otlp.proto.grpc.trace_exporter <span class="hljs-keyword">import</span> OTLPSpanExporter
<span class="hljs-keyword">from</span> opentelemetry.instrumentation.grpc <span class="hljs-keyword">import</span> GrpcInstrumentorClient

<span class="hljs-comment"># Set OTEL environment variables (you can also load them from external configs)</span>
os.environ[<span class="hljs-string">&#x27;OTEL_EXPORTER_OTLP_ENDPOINT&#x27;</span>] = <span class="hljs-string">&#x27;http://localhost:4317&#x27;</span>
os.environ[<span class="hljs-string">&#x27;OTEL_SERVICE_NAME&#x27;</span>] = <span class="hljs-string">&#x27;milvus-client&#x27;</span>

<span class="hljs-comment"># Define service metadata</span>
resource = Resource.create({
    <span class="hljs-string">&quot;service.name&quot;</span>: <span class="hljs-string">&quot;milvus-client&quot;</span>,
    <span class="hljs-string">&quot;application&quot;</span>: <span class="hljs-string">&quot;milvus-otel-test&quot;</span>
})

<span class="hljs-comment"># Initialize tracer and export processor</span>
trace.set_tracer_provider(
    TracerProvider(resource=resource)
)
otlp_exporter = OTLPSpanExporter()
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

<span class="hljs-comment"># Enable automatic instrumentation for gRPC clients</span>
grpc_client_instrumentor = GrpcInstrumentorClient()
grpc_client_instrumentor.instrument()

<span class="hljs-comment"># Acquire tracer</span>
tracer = trace.get_tracer(__name__)
<button class="copy-code-btn"></button></code></pre>
<p>Aquí, <code translate="no">GrpcInstrumentorClient()</code> se engancha a la pila gRPC subyacente para que no necesites modificar manualmente el código cliente para la instrumentación. El <code translate="no">OTLPSpanExporter()</code> está configurado para enviar datos de rastreo a su instancia local de Jaeger.</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">Ejemplo completo de Milvus Python con rastreo<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora vamos a crear un ejemplo completo que demuestre el rastreo con operaciones Milvus realistas:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace

<span class="hljs-keyword">with</span> tracer.start_as_current_span(<span class="hljs-string">&quot;test_milvus_otel&quot;</span>):
    milvus_client = MilvusClient(
        uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    )
    collection_name = <span class="hljs-string">&quot;quick_setup&quot;</span>

    <span class="hljs-comment"># Drop collection if it exists</span>
    <span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
        milvus_client.drop_collection(collection_name)

    <span class="hljs-comment"># Create collection</span>
    milvus_client.create_collection(
        collection_name=collection_name,
        dimension=<span class="hljs-number">5</span>
    )

    <span class="hljs-comment"># Add additional operations here</span>
    
    milvus_client.close()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Viewing-Trace-Output" class="common-anchor-header">Visualización de la salida de rastreo<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que su cliente Python envíe datos de rastreo, regrese a Jaeger: <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p>Seleccione el servicio <code translate="no">milvus-client</code> para ver los intervalos de rastreo que corresponden a las operaciones Milvus de su cliente Python. Esto hace que sea mucho más fácil analizar el rendimiento y rastrear las interacciones a través de los límites del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">Ejemplos en otros lenguajes<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de Python, puede implementar el rastreo Milvus en otros lenguajes:</p>
<p><a href="https://github.com/topikachu/milvus-java-otel"><strong>👉Java</strong></a>: Utilice el Agente Java de OpenTelemetry para la instrumentación de código cero <a href="https://github.com/topikachu/milvus-go-otel"><strong>👉Go</strong></a>: Aproveche el OpenTelemetry Go SDK para la integración nativa 👉Node<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>.js</strong></a>: Auto-instrumentar llamadas gRPC con el SDK de JavaScript.</p>
<p>Cada ejemplo sigue patrones similares pero utiliza bibliotecas OpenTelemetry específicas del lenguaje.</p>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>¡Ha implementado con éxito el rastreo de extremo a extremo para las operaciones Milvus! Esto es lo que ha logrado:</p>
<ul>
<li><p>✅ <strong>Infraestructura</strong>: Configurar Milvus y Jaeger con una red adecuada.</p></li>
<li><p><strong>Rastreo del lado del servidor</strong>: Configurado Milvus para exportar trazas automáticamente.</p></li>
<li><p>✅ <strong>Rastreo del lado del cliente</strong>: Instrumentado el cliente Python con OpenTelemetry.</p></li>
<li><p>✅ <strong>Visualización</strong>: Utilizado Jaeger para analizar el rendimiento del sistema</p></li>
<li><p>✅ <strong>Preparación para la producción</strong>: Aprendidas las mejores prácticas de configuración</p></li>
</ul>
<p>Todo funciona sin ningún cambio en el código fuente Milvus SDK. Solo unos pocos ajustes de configuración y su tubería de rastreo está en vivo: simple, efectiva y lista para la producción.</p>
<p>Puede llevarlo más lejos integrando registros y métricas para construir una solución de supervisión completa para su despliegue de base de datos vectorial nativa de IA.</p>
<h2 id="Learn-More" class="common-anchor-header">Más información<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
<li><p>Documentación de Milvus: <a href="https://milvus.io/docs">https://milvus.io/docs</a></p></li>
<li><p>OpenTelemetry para Python: <a href="https://opentelemetry.io/docs/instrumentation/python/">https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>Documentación de Jaeger: <a href="https://www.jaegertracing.io/docs/">https://www.jaegertracing.io/docs/</a></p></li>
<li><p>Demostración de integración de Milvus OpenTelemetry (Python): <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a></p></li>
</ul>
