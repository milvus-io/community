---
id: building-a-milvus-cluster-based-on-juicefs.md
title: ¿Qué es JuiceFS?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  Aprenda a crear un clúster Milvus basado en JuiceFS, un sistema de archivos
  compartido diseñado para entornos nativos de la nube.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>Creación de un clúster Milvus basado en JuiceFS</custom-h1><p>Las colaboraciones entre comunidades de código abierto son algo mágico. Los voluntarios apasionados, inteligentes y creativos no sólo mantienen innovadoras las soluciones de código abierto, sino que también trabajan para unir diferentes herramientas de formas interesantes y útiles. <a href="https://milvus.io/">Milvus</a>, la base de datos vectorial más popular del mundo, y <a href="https://github.com/juicedata/juicefs">JuiceFS</a>, un sistema de archivos compartido diseñado para entornos nativos en la nube, fueron unidos con este espíritu por sus respectivas comunidades de código abierto. Este artículo explica qué es JuiceFS, cómo construir un clúster Milvus basado en el almacenamiento de archivos compartidos JuiceFS y el rendimiento que los usuarios pueden esperar utilizando esta solución.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>¿Qué es JuiceFS?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS es un sistema de archivos POSIX distribuido de código abierto y alto rendimiento, que puede construirse sobre Redis y S3. Fue diseñado para entornos nativos de la nube y admite la gestión, el análisis, el archivo y la copia de seguridad de datos de cualquier tipo. JuiceFS se utiliza habitualmente para resolver retos de big data, crear aplicaciones de inteligencia artificial (IA) y recopilar registros. El sistema también permite compartir datos entre varios clientes y puede utilizarse directamente como almacenamiento compartido en Milvus.</p>
<p>Después de que los datos, y sus metadatos correspondientes, persistan en el almacenamiento de objetos y <a href="https://redis.io/">Redis</a> respectivamente, JuiceFS sirve como un middleware sin estado. La compartición de datos se realiza permitiendo que diferentes aplicaciones se acoplen entre sí sin problemas a través de una interfaz de sistema de archivos estándar. JuiceFS se basa en Redis, un almacén de datos en memoria de código abierto, para el almacenamiento de metadatos. Se utiliza Redis porque garantiza la atomicidad y proporciona operaciones de metadatos de alto rendimiento. Todos los datos se almacenan en un almacén de objetos a través del cliente JuiceFS. El diagrama de arquitectura es el siguiente</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-arquitectura.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>Construir un cluster Milvus basado en JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>Un clúster Milvus construido con JuiceFS (véase el diagrama de arquitectura más abajo) funciona dividiendo las peticiones ascendentes utilizando Mishards, un middleware de fragmentación de clústeres, para enviar en cascada las peticiones a sus submódulos. Al insertar datos, Mishards asigna las solicitudes ascendentes al nodo de escritura Milvus, que almacena los datos recién insertados en JuiceFS. Al leer datos, Mishards carga los datos desde JuiceFS a través de un nodo de lectura Milvus a la memoria para su procesamiento y, a continuación, recoge y devuelve los resultados de los sub-servicios aguas arriba.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-construido-con-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>Paso 1: Iniciar el servicio MySQL</strong></h3><p>Inicie el servicio MySQL en <strong>cualquier</strong> nodo del cluster. Para obtener más información, consulte <a href="https://milvus.io/docs/v1.1.0/data_manage.md">Gestionar metadatos con MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>Paso 2: Crear un sistema de archivos JuiceFS</strong></h3><p>Para fines de demostración, se utiliza el programa binario precompilado JuiceFS. Descargue el <a href="https://github.com/juicedata/juicefs/releases">paquete de instalación</a> correcto para su sistema y siga la <a href="https://github.com/juicedata/juicefs-quickstart">Guía de inicio rápido de</a> JuiceFS para obtener instrucciones de instalación detalladas. Para crear un sistema de archivos JuiceFS, primero configure una base de datos Redis para el almacenamiento de metadatos. Se recomienda alojar el servicio Redis en la misma nube que la aplicación para las implantaciones en nubes públicas. Además, configure el almacenamiento de objetos para JuiceFS. En este ejemplo, se utiliza Azure Blob Storage; sin embargo, JuiceFS admite casi todos los servicios de objetos. Seleccione el servicio de almacenamiento de objetos que mejor se adapte a las exigencias de su escenario.</p>
<p>Después de configurar el servicio Redis y el almacenamiento de objetos, formatea un nuevo sistema de archivos y monta JuiceFS en el directorio local:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Si el servidor Redis no se ejecuta localmente, sustituya localhost por la siguiente dirección: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>Cuando la instalación tiene éxito, JuiceFS devuelve la página de almacenamiento compartido <strong>/root/jfs</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>installation-success.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>Paso 3: Iniciar Milvus</strong></h3><p>Todos los nodos del cluster deben tener Milvus instalado, y cada nodo Milvus debe estar configurado con permiso de lectura o escritura. Sólo un nodo Milvus puede configurarse como nodo de escritura, y el resto deben ser nodos de lectura. En primer lugar, configure los parámetros de las secciones <code translate="no">cluster</code> y <code translate="no">general</code> en el fichero de configuración del sistema Milvus <strong>server_config.yaml</strong>:</p>
<p><strong>Sección</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Parámetro</strong></th><th style="text-align:left"><strong>Descripción</strong></th><th style="text-align:left"><strong>Configuración</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">Si se habilita el modo cluster</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Función de despliegue de Milvus</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>Sección</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Durante la instalación, la ruta de almacenamiento compartido JuiceFS configurada se establece como <strong>/root/jfs/milvus/db</strong>.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>Una vez finalizada la instalación, inicie Milvus y confirme que se ha iniciado correctamente. Por último, inicie el servicio Mishards en <strong>cualquiera</strong> de los nodos del clúster. La siguiente imagen muestra el inicio correcto de Mishards. Para más información, consulte el <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">tutorial</a> de GitHub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-lanzamiento-éxito.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>Parámetros de rendimiento</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Las soluciones de almacenamiento compartido suelen implementarse mediante sistemas de almacenamiento conectados a la red (NAS). Entre los tipos de sistemas NAS más utilizados se encuentran Network File System (NFS) y Server Message Block (SMB). Las plataformas de nube pública suelen ofrecer servicios de almacenamiento gestionado compatibles con estos protocolos, como Amazon Elastic File System (EFS).</p>
<p>A diferencia de los sistemas NAS tradicionales, JuiceFS se implementa basándose en Filesystem in Userspace (FUSE), donde toda la lectura y escritura de datos tiene lugar directamente en el lado de la aplicación, lo que reduce aún más la latencia de acceso. JuiceFS también cuenta con funciones exclusivas que no se encuentran en otros sistemas NAS, como la compresión de datos y el almacenamiento en caché.</p>
<p>Las pruebas comparativas revelan que JuiceFS ofrece grandes ventajas sobre EFS. En la prueba de metadatos (Figura 1), JuiceFS registra operaciones de E/S por segundo (IOPS) hasta diez veces superiores a EFS. Además, la prueba de rendimiento de E/S (Figura 2) muestra que JuiceFS supera a EFS en escenarios de una y varias tareas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>rendimiento-benchmark-2.png</span> </span></p>
<p>Además, las pruebas comparativas muestran que el tiempo de recuperación de la primera consulta, o tiempo para cargar datos recién insertados del disco a la memoria, para el clúster Milvus basado en JuiceFS es de sólo 0,032 segundos de media, lo que indica que los datos se cargan del disco a la memoria casi instantáneamente. Para esta prueba, el tiempo de recuperación de la primera consulta se mide utilizando un millón de filas de datos vectoriales de 128 dimensiones insertados en lotes de 100k a intervalos de 1 a 8 segundos.</p>
<p>JuiceFS es un sistema de almacenamiento de archivos compartidos estable y fiable, y el clúster Milvus construido sobre JuiceFS ofrece tanto un alto rendimiento como una capacidad de almacenamiento flexible.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Más información sobre Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es una potente herramienta capaz de alimentar una amplia gama de aplicaciones de inteligencia artificial y búsqueda vectorial de similitudes. Para obtener más información sobre el proyecto, consulte los siguientes recursos:</p>
<ul>
<li>Lea nuestro <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interactúe con nuestra comunidad de código abierto en <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilice o contribuya a la base de datos vectorial más popular del mundo en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Pruebe y despliegue rápidamente aplicaciones de IA con nuestro nuevo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>writer bio-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>writer bio-jingjing jia.png</span> </span></p>
