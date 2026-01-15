---
id: >-
  evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
title: >-
  MinIO deja de aceptar cambios de la comunidad: Evaluación de RustFS como
  backend de almacenamiento de objetos compatible con S3 para Milvus
author: Min Yin
date: 2026-01-14T00:00:00.000Z
cover: assets.zilliz.com/Min_IO_cover_4102d4ef61.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'object storage, S3 compatible storage, MinIO, RustFS, Milvus'
meta_title: |
  Evaluating RustFS for Milvus S3-Compatible Object Storage
desc: >-
  Aprenda cómo Milvus se basa en el almacenamiento de objetos compatible con S3
  y cómo implementar RustFS como reemplazo de MinIO en Milvus a través de un
  recorrido práctico.
origin: >-
  https://milvus.io/blog/evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
---
<p><em>Este post está escrito por Min Yin, uno de los colaboradores más activos de la comunidad de Milvus, y se publica aquí con permiso.</em></p>
<p><a href="https://github.com/minio/minio">MinIO</a> es un sistema de almacenamiento de objetos de código abierto, de alto rendimiento y compatible con S3, ampliamente utilizado en IA/ML, análisis y otras cargas de trabajo intensivas en datos. Para muchos despliegues de <a href="https://milvus.io/">Milvus</a>, también ha sido la opción por defecto para el almacenamiento de objetos. Recientemente, sin embargo, el equipo MinIO actualizó su <a href="https://github.com/minio/minio?tab=readme-ov-file">GitHub README</a> para indicar que <strong><em>este proyecto ya no acepta nuevos cambios</em></strong><em>.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_7b7df16860.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En realidad, en los últimos años, MinIO ha cambiado gradualmente su atención hacia ofertas comerciales, ha endurecido su modelo de licencia y distribución y ha reducido el desarrollo activo en el repositorio de la comunidad. El paso del proyecto de código abierto al modo de mantenimiento es el resultado natural de esa transición más amplia.</p>
<p>Para los usuarios de Milvus que dependen de MinIO por defecto, este cambio es difícil de ignorar. El almacenamiento de objetos se encuentra en el corazón de la capa de persistencia de Milvus, y su fiabilidad a lo largo del tiempo depende no sólo de lo que funciona hoy, sino de si el sistema sigue evolucionando junto con las cargas de trabajo que soporta.</p>
<p>Con este telón de fondo, este artículo explora <a href="https://github.com/rustfs/rustfs">RustFS</a> como una alternativa potencial. RustFS es un sistema de almacenamiento de objetos basado en Rust y compatible con S3 que hace hincapié en la seguridad de la memoria y en el diseño de sistemas modernos. Todavía está en fase experimental, y esta discusión no es una recomendación de producción.</p>
<h2 id="The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="common-anchor-header">La arquitectura de Milvus y dónde se sitúa el componente de almacenamiento de objetos<button data-href="#The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 adopta una arquitectura almacenamiento-computación totalmente desacoplada. En este modelo, la capa de almacenamiento se compone de tres componentes independientes, cada uno de los cuales desempeña una función distinta.</p>
<p>Etcd almacena metadatos, Pulsar o Kafka gestiona los registros de streaming, y el almacenamiento de objetos (normalmente MinIO o un servicio compatible con S3) proporciona una persistencia duradera para los datos vectoriales y los archivos de índice. Debido a que el almacenamiento y la computación están separados, Milvus puede escalar los nodos de computación de forma independiente mientras confía en un backend de almacenamiento compartido y fiable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_fe897f1098.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Role-of-Object-Storage-in-Milvus" class="common-anchor-header">El papel del almacenamiento de objetos en Milvus</h3><p>El almacenamiento de objetos es la capa de almacenamiento duradero en Milvus. Los datos vectoriales en bruto se conservan como binlogs, y las estructuras de índice como HNSW e IVF_FLAT también se almacenan allí.</p>
<p>Este diseño hace que los nodos de cálculo sean apátridas. Los nodos de consulta no almacenan datos localmente, sino que cargan segmentos e índices del almacenamiento de objetos bajo demanda. Como resultado, los nodos pueden escalar libremente hacia arriba o hacia abajo, recuperarse rápidamente de los fallos y soportar el equilibrio de carga dinámica en todo el clúster sin reequilibrio de datos en la capa de almacenamiento.</p>
<pre><code translate="no">my-milvus-bucket/
├── files/                          <span class="hljs-comment"># rootPath (default)</span>
│   ├── insert_log/                 <span class="hljs-comment"># insert binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}     <span class="hljs-comment"># Per-field binlog files</span>
│   │
│   ├── delta_log/                  <span class="hljs-comment"># Delete binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Log_ID}        
│   │
│   ├── stats_log/                  <span class="hljs-comment"># Statistical data (e.g., Bloom filters)</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}
│   │
│   └── index_files/                <span class="hljs-comment"># Index files</span>
│       └── {Build_ID}_{Index_Version}_{Segment_ID}_{Field_ID}/
│           ├── index_file_0
│           ├── index_file_1
│           └── ...
<button class="copy-code-btn"></button></code></pre>
<h3 id="Why-Milvus-Uses-the-S3-API" class="common-anchor-header">Por qué Milvus utiliza la API de S3</h3><p>En lugar de definir un protocolo de almacenamiento personalizado, Milvus utiliza la API S3 como su interfaz de almacenamiento de objetos. S3 se ha convertido en el estándar de facto para el almacenamiento de objetos: los principales proveedores de nube como AWS S3, Alibaba Cloud OSS y Tencent Cloud COS lo soportan de forma nativa, mientras que los sistemas de código abierto como MinIO, Ceph RGW, SeaweedFS y RustFS son totalmente compatibles.</p>
<p>Al estandarizar en la API de S3, Milvus puede confiar en SDKs Go maduros y bien probados en lugar de mantener integraciones separadas para cada backend de almacenamiento. Esta abstracción también ofrece a los usuarios flexibilidad de despliegue: MinIO para desarrollo local, almacenamiento de objetos en la nube en producción, o Ceph y RustFS para entornos privados. Mientras esté disponible un punto final compatible con S3, Milvus no necesita saber -o no le importa- qué sistema de almacenamiento se utiliza por debajo.</p>
<pre><code translate="no"><span class="hljs-comment"># Milvus configuration file milvus.yaml</span>
minio:
 address: localhost
 port: <span class="hljs-number">9000</span>
 accessKeyID: minioadmin
 secretAccessKey: minioadmin
 useSSL: false
 bucketName: milvus-bucket
<button class="copy-code-btn"></button></code></pre>
<h2 id="Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="common-anchor-header">Evaluación de RustFS como backend de almacenamiento de objetos compatible con S3 para Milvus<button data-href="#Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Project-Overview" class="common-anchor-header">Visión general del proyecto</h3><p>RustFS es un sistema distribuido de almacenamiento de objetos escrito en Rust. Actualmente se encuentra en fase alfa (versión 1.0.0-alpha.68) y pretende combinar la simplicidad operativa de MinIO con los puntos fuertes de Rust en seguridad de memoria y rendimiento. Más detalles en <a href="https://github.com/rustfs/rustfs">GitHub</a>.</p>
<p>RustFS todavía está en desarrollo activo, y su modo distribuido aún no se ha publicado oficialmente. Como resultado, RustFS no se recomienda para la producción o cargas de trabajo de misión crítica en esta etapa.</p>
<h3 id="Architecture-Design" class="common-anchor-header">Diseño de la arquitectura</h3><p>RustFS sigue un diseño conceptualmente similar a MinIO. Un servidor HTTP expone una API compatible con S3, mientras que un Gestor de Objetos gestiona los metadatos de los objetos y un Motor de Almacenamiento es responsable de la gestión de los bloques de datos. En la capa de almacenamiento, RustFS se basa en sistemas de archivos estándar como XFS o ext4.</p>
<p>Para su modo distribuido previsto, RustFS pretende utilizar etcd para la coordinación de metadatos, con múltiples nodos RustFS formando un clúster. Este diseño se alinea estrechamente con las arquitecturas comunes de almacenamiento de objetos, haciendo que RustFS resulte familiar a los usuarios con experiencia en MinIO.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/architecture_design_852f73b2c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Compatibility-with-Milvus" class="common-anchor-header">Compatibilidad con Milvus</h3><p>Antes de considerar RustFS como un backend alternativo de almacenamiento de objetos, es necesario evaluar si cumple con los requisitos centrales de almacenamiento de Milvus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Requisitos de Milvus</strong></th><th style="text-align:center"><strong>API S3</strong></th><th style="text-align:center"><strong>Compatibilidad con RustFS</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Persistencia de datos vectoriales</td><td style="text-align:center"><code translate="no">PutObject</code>, <code translate="no">GetObject</code></td><td style="text-align:center">✅ Totalmente compatible</td></tr>
<tr><td style="text-align:center">Gestión de archivos de índice</td><td style="text-align:center"><code translate="no">ListObjects</code>, <code translate="no">DeleteObject</code></td><td style="text-align:center">✅ Totalmente compatible</td></tr>
<tr><td style="text-align:center">Operaciones de fusión de segmentos</td><td style="text-align:center">Carga multiparte</td><td style="text-align:center">✅ Totalmente compatible</td></tr>
<tr><td style="text-align:center">Garantías de coherencia</td><td style="text-align:center">Lectura y escritura sólidas</td><td style="text-align:center">Consistencia fuerte (nodo único)</td></tr>
</tbody>
</table>
<p>Sobre la base de esta evaluación, la implementación actual de la API S3 de RustFS satisface los requisitos funcionales básicos de Milvus. Esto la hace adecuada para pruebas prácticas en entornos que no sean de producción.</p>
<h2 id="Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="common-anchor-header">Práctica: Sustitución de MinIO por RustFS en Milvus<button data-href="#Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>El objetivo de este ejercicio es reemplazar el servicio predeterminado de almacenamiento de objetos MinIO e implementar Milvus 2.6.7 utilizando RustFS como backend de almacenamiento de objetos.</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><ol>
<li><p>Docker y Docker Compose están instalados (versión ≥ 20.10), y el sistema puede extraer imágenes y ejecutar contenedores normalmente.</p></li>
<li><p>Hay un directorio local disponible para el almacenamiento de datos de objetos, como <code translate="no">/volume/data/</code> (o una ruta personalizada).</p></li>
<li><p>El puerto 9000 del host está abierto para el acceso externo, o un puerto alternativo está configurado en consecuencia.</p></li>
<li><p>El contenedor RustFS se ejecuta como usuario no root (<code translate="no">rustfs</code>). Asegúrese de que el directorio de datos del host pertenece al UID 10001.</p></li>
</ol>
<h3 id="Step-1-Create-the-Data-Directory-and-Set-Permissions" class="common-anchor-header">Paso 1: Crear el directorio de datos y establecer los permisos</h3><pre><code translate="no"><span class="hljs-comment"># Create the project directory</span>
<span class="hljs-built_in">mkdir</span> -p milvus-rustfs &amp;&amp; <span class="hljs-built_in">cd</span> milvus-rustfs
<span class="hljs-comment"># Create the data directory</span>
<span class="hljs-built_in">mkdir</span> -p volumes/{rustfs, etcd, milvus}
<span class="hljs-comment"># Update permissions for the RustFS directory</span>
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chown</span> -R 10001:10001 volumes/rustfs
<button class="copy-code-btn"></button></code></pre>
<p><strong>Descargar el archivo oficial Docker Compose</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.6.7/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Modify-the-Object-Storage-Service" class="common-anchor-header">Paso 2: Modificar el Servicio de Almacenamiento de Objetos</h3><p><strong>Definir el Servicio RustFS</strong></p>
<p>Nota: Asegúrese de que la clave de acceso y la clave secreta coinciden con las credenciales configuradas en el servicio Milvus.</p>
<pre><code translate="no">rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Complete la configuración</strong></p>
<p>Nota: La configuración de almacenamiento de Milvus actualmente asume valores predeterminados estilo MinIO y aún no permite valores personalizados de clave de acceso o clave secreta. Cuando utilice RustFS como reemplazo, debe utilizar las mismas credenciales por defecto esperadas por Milvus.</p>
<pre><code translate="no">version: ‘3.5’
services:
 etcd:
 container_name: milvus-etcd
 image: registry.cn-hangzhou.aliyuncs.com/etcd/etcd: v3.5.25
 environment:
 - ETCD_AUTO_COMPACTION_MODE=revision
 - ETCD_AUTO_COMPACTION_RETENTION=1000
 - ETCD_QUOTA_BACKEND_BYTES=4294967296
 - ETCD_SNAPSHOT_COUNT=50000
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
 <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “etcdctl”, “endpoint”, “health”]
 interval: 30s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
 standalone:
 container_name: milvus-standalone
 image: registry.cn-hangzhou.aliyuncs.com/milvus/milvus: v2.6.7
 command: [”milvus“, ”run“, ”standalone“]
 security_opt:
 - seccomp: unconfined
 environment:
 MINIO_REGION: us-east-1
 ETCD_ENDPOINTS: etcd:2379
 MINIO_ADDRESS: rustfs:9000
 MINIO_ACCESS_KEY: minioadmin
 MINIO_SECRET_KEY: minioadmin
 MINIO_USE_SSL: ”false“
 MQ_TYPE: rocksmq
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
 healthcheck:
 test: [”CMD“, ”curl“, ”-f“, ”http://localhost:9091/healthz&quot;</span>]
 interval: 30s
 start_period: 90s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 ports:
 - “19530:19530”
 - “9091:9091”
 depends_on:
 - “etcd”
 - “rustfs”
networks:
 default:
 name: milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inicie los Servicios</strong></p>
<pre><code translate="no">docker-compose -f docker-compose.yaml up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>Compruebe el estado del servicio</strong></p>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_d64dc88a96.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Acceda a la interfaz web de RustFS</strong></p>
<p>Abra la interfaz web de RustFS en su navegador: <a href="http://localhost:9001">http://localhost:9001</a></p>
<p>Inicie sesión utilizando las credenciales por defecto: el nombre de usuario y la contraseña son minioadmin.</p>
<p><strong>Pruebe el servicio Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-comment"># connect to Milvus</span>
connections.connect(
 alias=<span class="hljs-string">&quot;default&quot;</span>,
 host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
 port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Successfully connected to Milvus!&quot;</span>)
<span class="hljs-comment"># create test collection</span>
fields = [
 FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
 FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;test collection&quot;</span>)
collection = Collection(name=<span class="hljs-string">&quot;test_collection&quot;</span>, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Test collection created!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ RustFS verified as the S3 storage backend!&quot;</span>)

<span class="hljs-comment">### Step 3: Storage Performance Testing (Experimental)</span>

**Test Design**

Two Milvus deployments were <span class="hljs-built_in">set</span> up on identical hardware (<span class="hljs-number">16</span> cores / <span class="hljs-number">32</span> GB memory / NVMe SSD), using RustFS <span class="hljs-keyword">and</span> MinIO respectively <span class="hljs-keyword">as</span> the <span class="hljs-built_in">object</span> storage backend. The test dataset consisted of <span class="hljs-number">1</span>,<span class="hljs-number">000</span>,<span class="hljs-number">000</span> vectors <span class="hljs-keyword">with</span> <span class="hljs-number">768</span> dimensions, using an HNSW index <span class="hljs-keyword">with</span> parameters _M = 16_ <span class="hljs-keyword">and</span> _efConstruction = 200_. Data was inserted <span class="hljs-keyword">in</span> batches of <span class="hljs-number">5</span>,<span class="hljs-number">000.</span>

The following metrics were evaluated: Insert throughput, Index build time, Cold <span class="hljs-keyword">and</span> warm load time, Search latency, Storage footprint.

**Test Code**

Note: Only the core parts of the test code are shown below.

<button class="copy-code-btn"></button></code></pre>
<p>def milvus_load_bench(dim=768, rows=1_000_000, batch=5000): collection = Collection(...) # Insert test t0 = time.perf_counter() for i in range(0, rows, batch): collection.insert([rng.random((batch, dim), dtype=np.float32).tolist()]) insert_time = time.perf_counter() - t0 # Index build collection.flush() collection.create_index(field_name=&quot;embedding&quot;, index_params={&quot;index_type&quot;: &quot;HNSW&quot;, ...}) # Prueba de carga (arranque en frío + dos arranques en caliente) collection.release() load_times = [] for i in range(3): if i &gt; 0: collection.release(); time.sleep(2) collection.load() load_times.append(...) # Prueba de consulta search_times = [] for _ in range(3): collection.search(queries, limit=10, ...)</p>
<pre><code translate="no">
**Test Command**

<button class="copy-code-btn"></button></code></pre>
<custom-h1>RustFS: --port 19530 --s3-endpoint http://localhost:9000 --s3-bucket bench</custom-h1><custom-h1>MinIO: --port 19531 --s3-endpoint http://localhost:9001 --s3-bucket a-bucket</custom-h1><p>python bench.py milvus-load-bench --dim 768 --rows 1000000 --batch 5000 <br>
-index-type HNSW --repeat-load 3 --release-before-load --do-search --drop-after</p>
<pre><code translate="no">
**Performance Results**

- **RustFS**

<span class="hljs-function">Faster <span class="hljs-title">writes</span> (<span class="hljs-params">+<span class="hljs-number">57</span>%</span>), lower storage <span class="hljs-title">usage</span> (<span class="hljs-params">–<span class="hljs-number">57</span>%</span>), <span class="hljs-keyword">and</span> faster warm <span class="hljs-title">loads</span> (<span class="hljs-params">+<span class="hljs-number">67</span>%</span>), making it suitable <span class="hljs-keyword">for</span> write-heavy, cost-sensitive workloads. 

Much slower <span class="hljs-title">queries</span> (<span class="hljs-params"><span class="hljs-number">7.96</span> ms vs. <span class="hljs-number">1.85</span> ms, ~+<span class="hljs-number">330</span>% latency</span>) <span class="hljs-keyword">with</span> noticeable <span class="hljs-title">variance</span> (<span class="hljs-params">up to <span class="hljs-number">17.14</span> ms</span>), <span class="hljs-keyword">and</span> 43% slower index builds. Not suitable <span class="hljs-keyword">for</span> query-intensive applications.

- **MinIO**

Excellent query <span class="hljs-title">performance</span> (<span class="hljs-params">**<span class="hljs-number">1.85</span> ms** average latency</span>), mature small-<span class="hljs-keyword">file</span> <span class="hljs-keyword">and</span> random I/O optimizations, <span class="hljs-keyword">and</span> a well-established ecosystem.


|     **Metric**    |  **RustFS**  |   **MinIO**  | **Difference** |
| :---------------: | :----------: | :----------: | :------------: |
| Insert Throughput | 4,472 rows/s | 2,845 rows/s |      0.57      |
|  Index Build Time |     803 s    |     562 s    |      -43%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Cold Start</span>) |    22.7 s    |    18.3 s    |      -24%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Warm Start</span>) |    0.009 s   |    0.027 s   |      0.67      |
|   Search Latency  |    7.96 ms   |    1.85 ms   |    **-330%**   |
|   Storage Usage   |    7.8 GB    |    18.0 GB   |      0.57      |

RustFS significantly outperforms MinIO <span class="hljs-keyword">in</span> write performance <span class="hljs-keyword">and</span> storage efficiency, <span class="hljs-keyword">with</span> both showing roughly 57% improvement. This demonstrates the system-level advantages of the Rust ecosystem. However, the 330% gap <span class="hljs-keyword">in</span> query latency limits RustFS’s suitability <span class="hljs-keyword">for</span> query-intensive workloads.

For **production environments**, cloud-managed <span class="hljs-built_in">object</span> storage services like **AWS S3** are recommended first, <span class="hljs-keyword">as</span> they are mature, stable, <span class="hljs-keyword">and</span> require no operational effort. Self-hosted solutions are better suited to specific scenarios: RustFS <span class="hljs-keyword">for</span> cost-sensitive <span class="hljs-keyword">or</span> write-intensive workloads, MinIO <span class="hljs-keyword">for</span> query-intensive use cases, <span class="hljs-keyword">and</span> Ceph <span class="hljs-keyword">for</span> data sovereignty. With further optimization <span class="hljs-keyword">in</span> random read performance, RustFS has the potential to become a strong self-hosted option.


## Conclusion

MinIO’s decision to stop accepting <span class="hljs-keyword">new</span> community contributions <span class="hljs-keyword">is</span> disappointing <span class="hljs-keyword">for</span> many developers, but it won’t disrupt Milvus users. Milvus depends <span class="hljs-keyword">on</span> the S3 API—<span class="hljs-keyword">not</span> any specific vendor implementation—so swapping storage backends <span class="hljs-keyword">is</span> straightforward. This S3-compatibility layer <span class="hljs-keyword">is</span> intentional: it ensures Milvus stays flexible, portable, <span class="hljs-keyword">and</span> decoupled <span class="hljs-keyword">from</span> vendor <span class="hljs-keyword">lock</span>-<span class="hljs-keyword">in</span>.

For production deployments, cloud-managed services such <span class="hljs-keyword">as</span> AWS S3 <span class="hljs-keyword">and</span> Alibaba Cloud OSS remain the most reliable options. They’re mature, highly available, <span class="hljs-keyword">and</span> drastically reduce the operational load compared to running your own <span class="hljs-built_in">object</span> storage. Self-hosted systems like MinIO <span class="hljs-keyword">or</span> Ceph still make sense <span class="hljs-keyword">in</span> cost-sensitive environments <span class="hljs-keyword">or</span> <span class="hljs-keyword">where</span> data sovereignty <span class="hljs-keyword">is</span> non-negotiable, but they require significantly more engineering overhead to operate safely at scale.

RustFS <span class="hljs-keyword">is</span> interesting—Apache 2.0-licensed, Rust-based, <span class="hljs-keyword">and</span> community-driven—but it&#x27;s still early. The performance gap <span class="hljs-keyword">is</span> noticeable, <span class="hljs-keyword">and</span> the distributed mode hasn’t shipped yet. It’s <span class="hljs-keyword">not</span> production-ready today, but it’s a project worth watching <span class="hljs-keyword">as</span> it matures.

If you’re comparing <span class="hljs-built_in">object</span> storage options <span class="hljs-keyword">for</span> Milvus, evaluating MinIO replacements, <span class="hljs-keyword">or</span> weighing the operational trade-offs of different backends, we’d love to hear <span class="hljs-keyword">from</span> you.

Join our[ Discord channel](<span class="hljs-params">https://discord.com/invite/<span class="hljs-number">8u</span>yFbECzPX</span>) <span class="hljs-keyword">and</span> share your thoughts. You can also book a 20-minute one-<span class="hljs-keyword">on</span>-one session to <span class="hljs-keyword">get</span> insights, guidance, <span class="hljs-keyword">and</span> answers to your questions through[ Milvus Office Hours](<span class="hljs-params">https://milvus.io/blog/<span class="hljs-keyword">join</span>-milvus-office-hours-to-<span class="hljs-keyword">get</span>-support-<span class="hljs-keyword">from</span>-vectordb-experts.md</span>).
</span><button class="copy-code-btn"></button></code></pre>
