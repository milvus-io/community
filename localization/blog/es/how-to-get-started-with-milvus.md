---
id: how-to-get-started-with-milvus.md
title: Cómo empezar con Milvus
author: Eric Goebelbecker
date: 2023-05-18T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Cómo empezar con Milvus</span> </span></p>
<p>A medida que crecen el volumen y la complejidad de la información, también lo hace la necesidad de herramientas para almacenar y buscar conjuntos de datos no estructurados a gran escala. <a href="https://github.com/milvus-io/milvus">Milvus</a> es una base de datos vectorial de código abierto que gestiona eficazmente datos complejos no estructurados como imágenes, audio y texto. Es una opción popular para aplicaciones que necesitan acceso escalable y de alta velocidad a grandes colecciones de datos.</p>
<p>En este artículo, aprenderá a instalar y ejecutar Milvus. Comprenderá cómo ejecutar esta robusta <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a>, lo que le permitirá aprovechar todo su potencial para sus proyectos. Si usted es un desarrollador, un científico de datos o simplemente siente curiosidad por el poder de los motores de búsqueda de similitudes vectoriales, esta entrada de blog es el punto de partida perfecto para su viaje con <a href="https://milvus.io/">Milvus</a>.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">¿Qué es Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/what-is-milvus">Milvus</a> es una base de datos vectorial de código abierto diseñada para manejar datos no estructurados a gran escala. Está impulsada por un sistema de indexación avanzado y proporciona varios algoritmos de búsqueda para manejar eficazmente datos de alta dimensión como imágenes, audio y texto.</p>
<p>Algunas de las ventajas que puede esperar de Milvus son las siguientes:</p>
<ol>
<li>Eficiencia de búsqueda mejorada para datos de alta dimensión</li>
<li>Escalabilidad para manejar conjuntos de datos a gran escala</li>
<li>Amplia compatibilidad con diversos algoritmos de búsqueda y técnicas de indexación</li>
<li>Una amplia gama de aplicaciones, entre las que se incluyen la búsqueda de imágenes, el procesamiento del lenguaje natural, los sistemas de recomendación, la detección de anomalías, la bioinformática y el análisis de audio.</li>
</ol>
<h2 id="Prerequisites" class="common-anchor-header">Requisitos previos<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Para seguir este tutorial, necesitarás un sistema instalado con la última versión de Docker. Este tutorial se basa en <a href="https://docs.docker.com/compose/">Docker Compose</a>, que ya está incluido en la versión más reciente del tiempo de ejecución de Docker.</p>
<p>Para utilizar Milvus, necesita descargar tanto las bibliotecas Python de Milvus como la interfaz de línea de comandos (CLI). Asegúrese de que tiene Python versión 3.9 o posterior, y tenga en cuenta que la CLI es compatible con Windows, macOS y Linux. Los comandos de shell de ejemplo que se proporcionan a continuación son para un sistema Linux, pero también se pueden utilizar con macOS o el subsistema de Windows para Linux.</p>
<p>El tutorial utiliza <strong>wget</strong> para descargar archivos de GitHub. Para macOS, puedes instalar <strong>wget</strong> con <a href="https://brew.sh/">Homebrew</a>, o descargar los archivos con tu navegador. Para Windows, encontrará <strong>wget</strong> en el Subsistema de Windows para Linux (WSL).</p>
<h2 id="Running-Milvus-Standalone" class="common-anchor-header">Ejecutar Milvus Standalone<button data-href="#Running-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Allocate-Additional-Memory-to-Docker" class="common-anchor-header">Asigne memoria adicional a Docker</h3><p>Para un rendimiento óptimo, Milvus requiere un mínimo de 8GB de memoria disponible. Sin embargo, Docker normalmente sólo asigna 2GB por defecto. Para solucionar esto, vaya a Configuración y haga clic en Recursos para <a href="https://docs.docker.com/config/containers/resource_constraints/#memory">aumentar la memoria de Docker</a> en el escritorio de Docker antes de ejecutar el servidor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_Docker_desktop_a18626750c.png" alt="The Docker desktop" class="doc-image" id="the-docker-desktop" />
   </span> <span class="img-wrapper"> <span>El escritorio Docker</span> </span></p>
<h3 id="Download-Docker-Compose-Configuration" class="common-anchor-header">Descargar la configuración de Docker Compose</h3><p>Necesita tres contenedores para ejecutar un servidor independiente Milvus:</p>
<ul>
<li><strong><a href="https://etcd.io/">etcd</a></strong> - un almacén distribuido de valores clave para el almacenamiento y acceso a metadatos</li>
<li><strong><a href="https://min.io/">minio</a></strong> - almacenamiento persistente compatible con AWS S3 para registros y archivos de índice</li>
<li><strong>milvus</strong> - el servidor de base de datos</li>
</ul>
<p>En lugar de configurar y ejecutar cada contenedor individualmente, utilizarás Docker Compose para conectarlos y orquestarlos.</p>
<ol>
<li>Cree un directorio para ejecutar el servicio.</li>
<li>Descarga el <a href="https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml">archivo Docker Comp</a> ose de ejemplo de Github y guárdalo como <strong>docker-compose.yml</strong>. También puedes descargar el archivo con <strong>wget</strong>.</li>
</ol>
<pre><code translate="no">$ <span class="hljs-built_in">mkdir</span> milvus_compose
$ <span class="hljs-built_in">cd</span> milvus_compose
$ wget https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
--2023-04-10 16:44:13-- https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml
Resolving github.com (github.com)... 140.82.113.3
Connecting to github.com (github.com)|140.82.113.3|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/208728772/c319ebef-7bcb-4cbf-82d8-dcd3c54cb3af?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230410%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230410T204413Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=b26b9b461fd3a92ab17e42e5a68b268b12a56cb07db57cf4db04e38a8e74525a&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=208728772&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus-standalone-docker-compose.yml&amp;response-content-type=application%2Foctet-stream [following]
--2023-04-10 16:44:13-- https://objects.githubusercontent.com/github-production-release-asset-2e65be/208728772/c319ebef-7bcb-4cbf-82d8-dcd3c54cb3af?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230410%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230410T204413Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=b26b9b461fd3a92ab17e42e5a68b268b12a56cb07db57cf4db04e38a8e74525a&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=208728772&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus-standalone-docker-compose.yml&amp;response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.110.133, 185.199.111.133, 185.199.109.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1356 (1.3K) [application/octet-stream]
Saving to: ‘docker-compose.yml’

docker-compose.yml 100%[==========================================================&gt;] 1.32K --.-KB/s <span class="hljs-keyword">in</span> 0s

2023-04-10 16:44:13 (94.2 MB/s) - ‘docker-compose.yml’ saved [1356/1356]
<button class="copy-code-btn"></button></code></pre>
<p>Veamos esta configuración antes de ejecutarla.</p>
<h2 id="Standalone-Configuration" class="common-anchor-header">Configuración autónoma<button data-href="#Standalone-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Este archivo compose define los tres servicios necesarios para Milvus: <strong>etcd, minio</strong> y <strong>milvus-standalone</strong>.</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.5&#x27;</span>

services:
  etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.0
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
    <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd

  minio:
    container_name: milvus-minio
    image: minio/minio:RELEASE.2023-03-20T20-16-18Z
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/minio:/minio_data
    <span class="hljs-built_in">command</span>: minio server /minio_data
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9000/minio/health/live&quot;</span>]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3

  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.2.8
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    depends_on:
      - <span class="hljs-string">&quot;etcd&quot;</span>
      - <span class="hljs-string">&quot;minio&quot;</span>

networks:
  default:
    name: milvus
<button class="copy-code-btn"></button></code></pre>
<p>Esta configuración asigna un volumen a <strong>etcd</strong> para datos persistentes. Define cuatro variables de entorno y ejecuta el servicio con una línea de comandos que le indica que escuche peticiones en el puerto 2379.</p>
<p>La configuración también proporciona a <strong>minio</strong> un volumen y utiliza claves de acceso por defecto. Sin embargo, deberías crear una nueva imagen de <strong>minio</strong> con claves únicas para su uso en producción. Además, la configuración incluye una comprobación de estado para <strong>minio</strong>, que reinicia el servicio si falla. Tenga en cuenta que minio utiliza por defecto el puerto 9000 para las peticiones de los clientes.</p>
<p>Por último, está el servicio <strong>independiente</strong> que ejecuta Milvus. También tiene un volumen más variables de entorno que lo dirigen a los puertos de servicio para <strong>etcd</strong> y <strong>minio</strong>. La última sección proporciona un nombre para la red que comparten los servicios. Esto hace que sea más fácil de identificar con herramientas de monitorización.</p>
<h2 id="Running-Milvus" class="common-anchor-header">Ejecutar Milvus<button data-href="#Running-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Inicie el servicio con <strong>docker compose up -d</strong>.</p>
<pre><code translate="no">$ docker compose up -d
[*] Running 4/4
✔ Network milvus               Created          .0s
✔ Container milvus-minio       Started          .2s
✔ Container milvus-etcd        Started          .3s
✔ Container milvus-standalone  Started
<button class="copy-code-btn"></button></code></pre>
<p>Docker <strong>ps</strong> mostrará tres contenedores en ejecución:</p>
<pre><code translate="no">$ docker ps -a
CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS                             PORTS                                              NAMES
eb1caca5d6a5   milvusdb/milvus:v2.2.8                     <span class="hljs-string">&quot;/tini -- milvus run…&quot;</span>   21 seconds ago   Up 19 seconds                      0.0.0.0:9091-&gt;9091/tcp, 0.0.0.0:19530-&gt;19530/tcp   milvus-standalone
ce19d90d89d0   quay.io/coreos/etcd:v3.5.0                 <span class="hljs-string">&quot;etcd -advertise-cli…&quot;</span>   22 seconds ago   Up 20 seconds                      2379-2380/tcp                                      milvus-etcd
e93e33a882d5   minio/minio:RELEASE.2023-03-20T20-16-18Z   <span class="hljs-string">&quot;/usr/bin/docker-ent…&quot;</span>   22 seconds ago   Up 20 seconds (health: starting)   9000/tcp                                           milvus-minio
<button class="copy-code-btn"></button></code></pre>
<p>Y, usted puede comprobar en el servidor Milvus con <strong>docker logs</strong>:</p>
<pre><code translate="no">$ docker logs milvus-standalone
<span class="hljs-number">2023</span>/<span class="hljs-number">04</span>/<span class="hljs-number">13</span> <span class="hljs-number">13</span>:<span class="hljs-number">40</span>:<span class="hljs-number">04</span> <span class="hljs-attr">maxprocs</span>: <span class="hljs-title class_">Leaving</span> <span class="hljs-variable constant_">GOMAXPROCS</span>=<span class="hljs-number">4</span>: <span class="hljs-variable constant_">CPU</span> quota <span class="hljs-literal">undefined</span>
    __  _________ _   ____  ______    
   /  |<span class="hljs-regexp">/  /</span>  _/ <span class="hljs-regexp">/| | /</span> <span class="hljs-regexp">/ /</span> <span class="hljs-regexp">/ /</span> __/    
  <span class="hljs-regexp">/ /</span>|_/ <span class="hljs-comment">// // /_| |/ / /_/ /\ \    </span>
 <span class="hljs-regexp">/_/</span>  <span class="hljs-regexp">/_/</span>___/____/___/\____/___/     

<span class="hljs-title class_">Welcome</span> to use <span class="hljs-title class_">Milvus</span>!
<span class="hljs-title class_">Version</span>:   v2<span class="hljs-number">.2</span><span class="hljs-number">.8</span>
<span class="hljs-title class_">Built</span>:     <span class="hljs-title class_">Wed</span> <span class="hljs-title class_">Mar</span> <span class="hljs-number">29</span> <span class="hljs-number">11</span>:<span class="hljs-number">32</span>:<span class="hljs-number">15</span> <span class="hljs-variable constant_">UTC</span> <span class="hljs-number">2023</span>
<span class="hljs-title class_">GitCommit</span>: 47e28fbe
<span class="hljs-title class_">GoVersion</span>: go version go1<span class="hljs-number">.18</span><span class="hljs-number">.3</span> linux/amd64

open pid <span class="hljs-attr">file</span>: <span class="hljs-regexp">/run/mi</span>lvus/standalone.<span class="hljs-property">pid</span>
lock pid <span class="hljs-attr">file</span>: <span class="hljs-regexp">/run/mi</span>lvus/standalone.<span class="hljs-property">pid</span>
[<span class="hljs-number">2023</span>/<span class="hljs-number">04</span>/<span class="hljs-number">13</span> <span class="hljs-number">13</span>:<span class="hljs-number">40</span>:<span class="hljs-number">04</span><span class="hljs-number">.976</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [<span class="hljs-variable constant_">INFO</span>] [roles/roles.<span class="hljs-property">go</span>:<span class="hljs-number">192</span>] [<span class="hljs-string">&quot;starting running Milvus components&quot;</span>]
(snipped)
<button class="copy-code-btn"></button></code></pre>
<p>Su servidor está en funcionamiento. Ahora, vamos a usar Python para conectarnos a él.</p>
<h2 id="How-to-Use-Milvus" class="common-anchor-header">Cómo usar Milvus<button data-href="#How-to-Use-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Using-Milvus-with-Python" class="common-anchor-header">Uso de Milvus con Python</h3><p>Vamos a probar su base de datos con un programa de ejemplo de Python. Comience instalando <strong>PyMilvus</strong> con <strong>pip3</strong>:</p>
<pre><code translate="no">$ pip3 install pymilvus
Defaulting to user installation because normal site-packages is not writeable
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Collecting pymilvus
  Using cached pymilvus-2.2.6-py3-none-any.whl (133 kB)
Collecting grpcio&lt;=1.53.0,&gt;=1.49.1
  Using cached grpcio-1.53.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (4.9 MB)
Requirement already satisfied: mmh3&gt;=2.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (3.0.0)
Requirement already satisfied: ujson&gt;=2.0.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (5.4.0)
Requirement already satisfied: pandas&gt;=1.2.4 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (2.0.0)
Requirement already satisfied: python-dateutil&gt;=2.8.2 <span class="hljs-keyword">in</span> /usr/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2.8.2)
Requirement already satisfied: pytz&gt;=2020.1 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2023.3)
Requirement already satisfied: tzdata&gt;=2022.1 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2023.3)
Requirement already satisfied: numpy&gt;=1.21.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (1.24.2)
Requirement already satisfied: six&gt;=1.5 <span class="hljs-keyword">in</span> /usr/lib/python3.11/site-packages (from python-dateutil&gt;=2.8.2-&gt;pandas&gt;=1.2.4-&gt;pymilvus) (1.16.0)
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Installing collected packages: grpcio, pymilvus
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Successfully installed grpcio pymilvus-2.2.6
<button class="copy-code-btn"></button></code></pre>
<p>Luego, descargue el programa de ejemplo <a href="https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.6/examples/hello_milvus.py">hello_milvus</a>:</p>
<pre><code translate="no">$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.6/examples/hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Este script creará una colección, añadirá un índice y ejecutará algunos cálculos. Ejecútalo. Dependiendo de su procesador y de la memoria disponible, tardará unos minutos en completarse.</p>
<pre><code translate="no">$ python3 ./hello_milvus.py 

=== start connecting to Milvus     ===

Does collection hello_milvus exist <span class="hljs-keyword">in</span> Milvus: False

=== Create collection `hello_milvus` ===


=== Start inserting entities       ===

Number of entities <span class="hljs-keyword">in</span> Milvus: 3000

=== Start Creating index IVF_FLAT  ===


=== Start loading                  ===


=== Start searching based on vector similarity ===

hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2998), random field: 0.9728033590489911
hit: (distance: 0.08883658051490784, <span class="hljs-built_in">id</span>: 1262), random field: 0.2978858685751561
hit: (distance: 0.09590047597885132, <span class="hljs-built_in">id</span>: 1265), random field: 0.3042039939240304
hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2999), random field: 0.02316334456872482
hit: (distance: 0.05628091096878052, <span class="hljs-built_in">id</span>: 1580), random field: 0.3855988746044062
hit: (distance: 0.08096685260534286, <span class="hljs-built_in">id</span>: 2377), random field: 0.8745922204004368
search latency = 0.3663s

=== Start querying with `random &gt; 0.5` ===

query result:
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>}
search latency = 0.4352s
query pagination(<span class="hljs-built_in">limit</span>=4):
    [{<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;100&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.5763523024650556}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1000&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.9425935891639464}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1001&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.7893211256191387}]
query pagination(offset=1, <span class="hljs-built_in">limit</span>=3):
    [{<span class="hljs-string">&#x27;random&#x27;</span>: 0.5763523024650556, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;100&#x27;</span>}, {<span class="hljs-string">&#x27;random&#x27;</span>: 0.9425935891639464, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1000&#x27;</span>}, {<span class="hljs-string">&#x27;random&#x27;</span>: 0.7893211256191387, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1001&#x27;</span>}]

=== Start hybrid searching with `random &gt; 0.5` ===

hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2998), random field: 0.9728033590489911
hit: (distance: 0.14606499671936035, <span class="hljs-built_in">id</span>: 747), random field: 0.5648774800635661
hit: (distance: 0.1530652642250061, <span class="hljs-built_in">id</span>: 2527), random field: 0.8928974315571507
hit: (distance: 0.08096685260534286, <span class="hljs-built_in">id</span>: 2377), random field: 0.8745922204004368
hit: (distance: 0.20354536175727844, <span class="hljs-built_in">id</span>: 2034), random field: 0.5526117606328499
hit: (distance: 0.21908017992973328, <span class="hljs-built_in">id</span>: 958), random field: 0.6647383716417955
search latency = 0.3732s

=== Start deleting with <span class="hljs-built_in">expr</span> `pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` ===

query before delete by <span class="hljs-built_in">expr</span>=`pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` -&gt; result: 
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>}
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.43925103574669633, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.52323616, 0.8035404, 0.77824664, 0.80369574, 0.4914803, 0.8265614, 0.6145269, 0.80234545], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1&#x27;</span>}

query after delete by <span class="hljs-built_in">expr</span>=`pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` -&gt; result: []

=== Drop collection `hello_milvus` ===
<button class="copy-code-btn"></button></code></pre>
<h2 id="Milvus-CLI" class="common-anchor-header">Milvus CLI<button data-href="#Milvus-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>Terminemos recreando la colección del ejemplo <strong>hello_milvus</strong> y utilicemos la CLI para examinarla.</p>
<p>Comience editando <strong>hello_milvus.py</strong> y comente las dos últimas líneas:</p>
<pre><code translate="no"><span class="hljs-comment">###############################################################################</span>
<span class="hljs-comment"># 7. drop collection</span>
<span class="hljs-comment"># Finally, drop the hello_milvus collection</span>
<span class="hljs-comment">#print(fmt.format(&quot;Drop collection `hello_milvus`&quot;))</span>
<span class="hljs-comment">#utility.drop_collection(&quot;hello_milvus&quot;)</span>
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, instale la <a href="https://github.com/zilliztech/milvus_cli">interfaz de línea de comandos (CLI) de Milvus</a> para interactuar con la base de datos. Puede instalar con Python, o descargar un binario para su sistema desde la <a href="https://github.com/zilliztech/milvus_cli/releases">página de versiones</a>. Aquí tienes un ejemplo de descarga del binario para Linux:</p>
<pre><code translate="no">$ wget https://github.com/zilliztech/milvus_cli/releases/download/v0.3.2/milvus_cli-v0.3.2-Linux
--2023-04-13 09:58:15--  https://github.com/zilliztech/milvus_cli/releases/download/v0.3.2/milvus_cli-v0.3.2-Linux
Resolving github.com (github.com)... 140.82.113.3
Connecting to github.com (github.com)|140.82.113.3|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/436910525/25c43a55-dd72-41f8-acfa-05598267a2cb?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230413%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230413T135816Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=3697b3583bfa71a3e8b9773fa550f4d18e32110cfe6315035fd4fff01d694446&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=436910525&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus_cli-v0.3.2-Linux&amp;response-content-type=application%2Foctet-stream [following]
--2023-04-13 09:58:16--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/436910525/25c43a55-dd72-41f8-acfa-05598267a2cb?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230413%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230413T135816Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=3697b3583bfa71a3e8b9773fa550f4d18e32110cfe6315035fd4fff01d694446&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=436910525&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus_cli-v0.3.2-Linux&amp;response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.111.133, 185.199.110.133, 185.199.108.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 50254816 (48M) [application/octet-stream]
Saving to: ‘milvus_cli-v0.3.2-Linux’

milvus_cli-v0.3.2-L 100%[===================&gt;]  47.93M  62.7MB/s    <span class="hljs-keyword">in</span> 0.8s    

2023-04-13 09:58:16 (62.7 MB/s) - ‘milvus_cli-v0.3.2-Linux’ saved [50254816/50254816]

$ <span class="hljs-built_in">chmod</span> +x ./milvus_cli-v0.3.2-Linux 
<button class="copy-code-btn"></button></code></pre>
<p>Ejecuta el script modificado <strong>hello_milvus.py</strong> y saldrá sin soltar la colección. Ahora, ejecute la CLI y conéctese a su base de datos. <strong>La conexión</strong> predeterminada es una instancia de Milvus en localhost y el puerto predeterminado:</p>
<pre><code translate="no">$ ./milvus_cli-v0<span class="hljs-number">.3</span><span class="hljs-number">.2</span>-<span class="hljs-title class_">Linux</span>

  __  __ _ _                    ____ _     ___
 |  \/  (_) |_   ___   _ ___   / ___| |   |_ _|
 | |\/| | | \ \ / <span class="hljs-regexp">/ | | /</span> __| | |   | |    | |
 | |  | | | |\ V /| |_| \__ \ | |___| |___ | |
 |_|  |_|_|_| \_/  \__,_|___/  \____|_____|___|

<span class="hljs-title class_">Milvus</span> cli <span class="hljs-attr">version</span>: <span class="hljs-number">0.3</span><span class="hljs-number">.2</span>
<span class="hljs-title class_">Pymilvus</span> <span class="hljs-attr">version</span>: <span class="hljs-number">2.2</span><span class="hljs-number">.1</span>

<span class="hljs-title class_">Learn</span> <span class="hljs-attr">more</span>: <span class="hljs-attr">https</span>:<span class="hljs-comment">//github.com/zilliztech/milvus_cli.</span>


milvus_cli &gt; connect
<span class="hljs-title class_">Connect</span> <span class="hljs-title class_">Milvus</span> successfully.
+---------+-----------------+
| <span class="hljs-title class_">Address</span> | <span class="hljs-number">127.0</span><span class="hljs-number">.0</span><span class="hljs-number">.1</span>:<span class="hljs-number">19530</span> |
|  <span class="hljs-title class_">User</span>   |                 |
|  <span class="hljs-title class_">Alias</span>  |     <span class="hljs-keyword">default</span>     |
+---------+-----------------+
<button class="copy-code-btn"></button></code></pre>
<p>Lista de las colecciones actuales, a continuación, utilice <strong>describir</strong> para ver <strong>hello_milvus</strong>.</p>
<pre><code translate="no">milvus_cli &gt; <span class="hljs-built_in">list</span> collections
+----+-------------------+
|    | Collection Name   |
+====+===================+
|  <span class="hljs-number">0</span> | hello_milvus      |
+----+-------------------+
milvus_cli &gt; describe collection -c hello_milvus
+---------------+----------------------------------------------------------------------+
| Name          | hello_milvus                                                         |
+---------------+----------------------------------------------------------------------+
| Description   | hello_milvus <span class="hljs-keyword">is</span> the simplest demo to introduce the APIs              |
+---------------+----------------------------------------------------------------------+
| Is Empty      | <span class="hljs-literal">False</span>                                                                |
+---------------+----------------------------------------------------------------------+
| Entities      | <span class="hljs-number">3000</span>                                                                 |
+---------------+----------------------------------------------------------------------+
| Primary Field | pk                                                                   |
+---------------+----------------------------------------------------------------------+
| Schema        | Description: hello_milvus <span class="hljs-keyword">is</span> the simplest demo to introduce the APIs |
|               |                                                                      |
|               | Auto ID: <span class="hljs-literal">False</span>                                                       |
|               |                                                                      |
|               | Fields(* <span class="hljs-keyword">is</span> the primary field):                                      |
|               |  - *pk VARCHAR                                                       |
|               |  - random DOUBLE                                                     |
|               |  - embeddings FLOAT_VECTOR dim: <span class="hljs-number">8</span>                                    |
+---------------+----------------------------------------------------------------------+
| Partitions    | - _default                                                           |
+---------------+----------------------------------------------------------------------+
| Indexes       | - embeddings                                                         |
+---------------+----------------------------------------------------------------------+
<button class="copy-code-btn"></button></code></pre>
<p>La colección tiene tres campos. Terminemos con una consulta para ver los tres dentro de una sola entrada. Buscaremos una entrada con el ID 100.</p>
<p>El comando de <strong>consulta</strong> le pedirá varias opciones. Para completarla, necesita</p>
<ul>
<li>Nombre de la colección: <strong>hello_milvus</strong></li>
<li>Expresión <strong>pk == "100"</strong></li>
<li>Campos: <strong>pk, random, embeddings</strong></li>
</ul>
<p>Acepte los valores predeterminados para las demás opciones.</p>
<pre><code translate="no">milvus_cli &gt; <span class="hljs-function">k
Collection <span class="hljs-title">name</span> (<span class="hljs-params">hello_milvus</span>): hello_milvus
The query expression: pk</span> == <span class="hljs-string">&quot;100&quot;</span>
<span class="hljs-function">The names of partitions to <span class="hljs-title">search</span> (<span class="hljs-params">split <span class="hljs-keyword">by</span> <span class="hljs-string">&quot;,&quot;</span> <span class="hljs-keyword">if</span> multiple</span>) [&#x27;_default&#x27;] []: 
Fields to <span class="hljs-title">return</span>(<span class="hljs-params">split <span class="hljs-keyword">by</span> <span class="hljs-string">&quot;,&quot;</span> <span class="hljs-keyword">if</span> multiple</span>) [&#x27;pk&#x27;, &#x27;random&#x27;, &#x27;embeddings&#x27;] []: pk, random, embeddings
timeout []: 
Guarantee timestamp. This instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp <span class="hljs-keyword">is</span> provided, then Milvus will search all operations performed to date. [0]: 
Graceful time. Only used <span class="hljs-keyword">in</span> bounded consistency level. If graceful_time <span class="hljs-keyword">is</span> <span class="hljs-keyword">set</span>, PyMilvus will use current timestamp minus the graceful_time <span class="hljs-keyword">as</span> the guarantee_timestamp. This option <span class="hljs-keyword">is</span> 5s <span class="hljs-keyword">by</span> <span class="hljs-literal">default</span> <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">set</span>. [5]: 
Travel timestamp. Users can specify a timestamp <span class="hljs-keyword">in</span> a search to <span class="hljs-keyword">get</span> results based <span class="hljs-keyword">on</span> a data view at a specified point <span class="hljs-keyword">in</span> time. [0]: 
+----+------+----------+------------------------------------------------------------------------------------------------+
|    |   pk |   random | embeddings                                                                                     |
+</span>====+======+==========+================================================================================================+
|  <span class="hljs-number">0</span> |  <span class="hljs-number">100</span> | <span class="hljs-number">0.576352</span> | [<span class="hljs-number">0.5860017</span>, <span class="hljs-number">0.24227226</span>, <span class="hljs-number">0.8318699</span>, <span class="hljs-number">0.0060517574</span>, <span class="hljs-number">0.27727962</span>, <span class="hljs-number">0.5513293</span>, <span class="hljs-number">0.47201252</span>, <span class="hljs-number">0.6331349</span>] |
+----+------+----------+------------------------------------------------------------------------------------------------+
<button class="copy-code-btn"></button></code></pre>
<p>Ahí está el campo y sus incrustaciones aleatorias. Sus valores serán diferentes.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Para terminar<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>En este tutorial, instalaste Milvus con <a href="https://docs.docker.com/compose/">Docker Compose</a> junto con su API Python y CLI. Después de iniciar el servidor, ejecutó un programa de ejemplo que lo sembró con datos aleatorios, a continuación, utilizó la CLI para consultar la base de datos.</p>
<p>Milvus es un potente motor de <a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">base de datos vectorial</a> de código abierto para almacenar y buscar grandes conjuntos de datos. Pruébelo hoy mismo y vea cómo puede ayudarle con sus proyectos multimedia y de IA.  Si no está preparado para enfrentarse a la versión completa de Milvus, pruebe <a href="https://github.com/milvus-io/bootcamp/tree/master/notebooks">Milvus lite</a>.</p>
<p><em>Este artículo ha sido escrito por Eric Goebelbecker. <a href="http://ericgoebelbecker.com/">Eric</a> ha trabajado en los mercados financieros de Nueva York durante 25 años, desarrollando infraestructura para datos de mercado y redes de protocolo de intercambio de información financiera (FIX). Le encanta hablar de lo que hace que los equipos sean eficaces (¡o no tanto!).</em></p>
