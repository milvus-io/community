---
id: 2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md
title: Guía rápida para la evaluación comparativa de Milvus 2.1
author: Yanliang Qiao
date: 2022-08-16T00:00:00.000Z
desc: >-
  Sigue nuestra guía paso a paso para realizar un benchmark Milvus 2.1 por ti
  mismo.
cover: assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Portada</span> </span></p>
<p>Recientemente, hemos actualizado el <a href="https://milvus.io/docs/v2.1.x/benchmark.md">informe de referencia de Milvus 2.1</a>. Las pruebas con un conjunto de datos de 1 millón de vectores han demostrado que el QPS puede incrementarse drásticamente fusionando consultas de <a href="https://milvus.io/docs/v2.1.x/benchmark.md#Terminology">nq</a> pequeño.</p>
<p>A continuación le ofrecemos algunos scripts sencillos para que pueda reproducir fácilmente las pruebas.</p>
<h2 id="Procedures" class="common-anchor-header">Procedimientos<button data-href="#Procedures" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p>Despliegue un Milvus independiente o en clúster. En este caso, la dirección IP del servidor Milvus es 10.100.31.105.</p></li>
<li><p>Despliegue un cliente. En este caso, utilizamos Ubuntu 18.04 y Python 3.8.13 para el despliegue. Ejecuta el siguiente código para instalar PyMilvus 2.1.1.</p></li>
</ol>
<pre><code translate="no">pip install pymilvus==2.1.1
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Descarga y copia los siguientes archivos en el mismo directorio de trabajo que el cliente. En este caso, el directorio de trabajo es <code translate="no">/go_ben</code>.</p>
<ul>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py"><code translate="no">collection_prepare.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py"><code translate="no">go_benchmark.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark"><code translate="no">benchmark</code></a> (para Ubuntu) o <a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac"><code translate="no">benchmark-mac</code></a> (para macOS)</p></li>
</ul>
<p><strong>Nota:</strong></p>
<ul>
<li><p><code translate="no">benchmark</code> y <code translate="no">benchmark-mac</code> son archivos ejecutables desarrollados y compilados utilizando Go SDK 2.1.1. Sólo se utilizan para realizar una búsqueda concurrente.</p></li>
<li><p>Para los usuarios de Ubuntu, descargue <code translate="no">benchmark</code>; para los usuarios de macOS, descargue <code translate="no">benchmark-mac</code>.</p></li>
<li><p>Se requieren permisos de ejecutable para acceder a <code translate="no">benchmark</code> o <code translate="no">benchmark-mac</code>.</p></li>
<li><p>Los usuarios de Mac deben confiar en el archivo <code translate="no">benchmark-mac</code> configurando Seguridad y Privacidad en Preferencias del Sistema.</p></li>
<li><p>La configuración de la búsqueda concurrente puede encontrarse y modificarse en el código fuente de <code translate="no">go_benchmark.py</code>.</p></li>
</ul></li>
</ol>
<ol start="4">
<li>Cree una colección e inserte datos vectoriales.</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-comment"># python collection_prepare.py 10.100.31.105 </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Abra <code translate="no">/tmp/collection_prepare.log</code> para comprobar el resultado en ejecución.</li>
</ol>
<pre><code translate="no">...
08/11/2022 17:33:34 PM - INFO - Build index costs 263.626
08/11/2022 17:33:54 PM - INFO - Collection prepared completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li>Llame a <code translate="no">benchmark</code> (o <code translate="no">benchmark-mac</code> en macOS) para realizar una búsqueda concurrente.</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-meta"># python go_benchmark.py 10.100.31.105 ./benchmark</span>
[<span class="hljs-meta">write_json_file</span>] <span class="hljs-function">Remove <span class="hljs-title">file</span>(<span class="hljs-params">search_vector_file.json</span>).
[write_json_file] Write json <span class="hljs-keyword">file</span>:search_vector_file.json done.
Params of go_benchmark: [&#x27;./benchmark&#x27;, &#x27;locust&#x27;, &#x27;-u&#x27;, &#x27;10.100.31.105:19530&#x27;, &#x27;-q&#x27;, &#x27;search_vector_file.json&#x27;, &#x27;-s&#x27;, &#x27;</span>{\n  <span class="hljs-string">&quot;collection_name&quot;</span>: <span class="hljs-string">&quot;random_1m&quot;</span>,\n  <span class="hljs-string">&quot;partition_names&quot;</span>: [],\n  <span class="hljs-string">&quot;fieldName&quot;</span>: <span class="hljs-string">&quot;embedding&quot;</span>,\n  <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,\n  <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>,\n  <span class="hljs-string">&quot;params&quot;</span>: {\n    <span class="hljs-string">&quot;sp_value&quot;</span>: <span class="hljs-number">64</span>,\n    <span class="hljs-string">&quot;dim&quot;</span>: <span class="hljs-number">128</span>\n  },\n  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">1</span>,\n  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-literal">null</span>,\n  <span class="hljs-string">&quot;output_fields&quot;</span>: [],\n  <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">600</span>\n}<span class="hljs-string">&#x27;, &#x27;</span>-p<span class="hljs-string">&#x27;, &#x27;</span><span class="hljs-number">10&#x27;</span>, <span class="hljs-string">&#x27;-f&#x27;</span>, <span class="hljs-string">&#x27;json&#x27;</span>, <span class="hljs-string">&#x27;-t&#x27;</span>, <span class="hljs-string">&#x27;60&#x27;</span>, <span class="hljs-string">&#x27;-i&#x27;</span>, <span class="hljs-string">&#x27;20&#x27;</span>, <span class="hljs-string">&#x27;-l&#x27;</span>, <span class="hljs-string">&#x27;go_log_file.log&#x27;</span>]
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - go search     <span class="hljs-number">9665</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.679</span>     <span class="hljs-number">6.499</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">12.810</span>  |    <span class="hljs-number">483.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - go search    <span class="hljs-number">19448</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.443</span>     <span class="hljs-number">6.549</span>    <span class="hljs-number">78.121</span>    <span class="hljs-number">13.401</span>  |    <span class="hljs-number">489.22</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29170</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.568</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">76.887</span>    <span class="hljs-number">12.828</span>  |    <span class="hljs-number">486.15</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][   DEBUG] - go search run finished, parallel: <span class="hljs-number">10</span>(benchmark_run.go:<span class="hljs-number">95</span>:benchmark)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:159:samplingLoop)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29180</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.560</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">13.014</span>  |    <span class="hljs-number">486.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">160</span>:samplingLoop)
Result of go_benchmark: {<span class="hljs-string">&#x27;response&#x27;</span>: True, <span class="hljs-string">&#x27;err_code&#x27;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&#x27;err_message&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>} 
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>Abra el archivo <code translate="no">go_log_file.log</code> en el directorio actual para comprobar el registro detallado de la búsqueda. La siguiente es la información de búsqueda que puede encontrar en el registro de búsqueda.<ul>
<li><p>reqs: número de peticiones de búsqueda desde el momento en que se produce la concurrencia hasta el momento actual (periodo de tiempo actual)</p></li>
<li><p>Fallos: número de peticiones fallidas como porcentaje de las peticiones en el periodo de tiempo actual.</p></li>
<li><p>Avg: tiempo medio de respuesta de las peticiones en el periodo de tiempo actual (unidad: milisegundos)</p></li>
<li><p>Mín: tiempo mínimo de respuesta de la solicitud en el intervalo de tiempo actual (unidad: milisegundos)</p></li>
<li><p>Max: tiempo máximo de respuesta de la solicitud en el intervalo de tiempo actual (unidad: milisegundos)</p></li>
<li><p>Mediana: tiempo medio de respuesta de la solicitud en el periodo de tiempo actual (unidad: milisegundos)</p></li>
<li><p>req/s: número de peticiones por segundo, es decir, QPS</p></li>
<li><p>failures/s: número medio de peticiones fallidas por segundo en el periodo de tiempo actual.</p></li>
</ul></li>
</ol>
<h2 id="Downloading-Scripts-and-Executable-Files" class="common-anchor-header">Descarga de scripts y archivos ejecutables<button data-href="#Downloading-Scripts-and-Executable-Files" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py">colección_prepare.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py">go_benchmark.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark">benchmark</a> para Ubuntu</p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac">benchmark-mac</a> para macOS</p></li>
</ul>
<h2 id="Whats-next" class="common-anchor-header">Lo que viene a continuación<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el lanzamiento oficial de Milvus 2.1, hemos preparado una serie de blogs presentando las nuevas características. Lea más en esta serie de blogs:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cómo utilizar datos de cadenas para potenciar sus aplicaciones de búsqueda por similitud</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Uso de Milvus integrado para instalar y ejecutar Milvus con Python de forma instantánea</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente el rendimiento de lectura de su base de datos vectorial con réplicas en memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprender el nivel de consistencia en la base de datos vectorial Milvus</a></li>
<li><a href="https://milvus.io/blog/data-security.md">¿Cómo garantiza la base de datos vectorial de Milvus la seguridad de los datos?</a></li>
</ul>
