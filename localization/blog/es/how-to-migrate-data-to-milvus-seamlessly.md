---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'Cómo migrar sus datos a Milvus sin problemas: Guía completa'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  Una guía completa sobre la migración de sus datos desde Elasticsearch, FAISS y
  versiones anteriores de Milvus 1.x a Milvus 2.x.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a> es una robusta base de datos vectorial de código abierto para la <a href="https://zilliz.com/learn/vector-similarity-search">búsqueda de similitudes</a> que puede almacenar, procesar y recuperar miles de millones e incluso billones de datos vectoriales con una latencia mínima. También es altamente escalable, fiable, nativa de la nube y rica en funciones. <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">La última versión de Milvus</a> introduce características y mejoras aún más interesantes, incluyendo <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">soporte de GPU</a> para un rendimiento más de 10 veces más rápido y MMap para una mayor capacidad de almacenamiento en una sola máquina.</p>
<p>Desde septiembre de 2023, Milvus ha ganado casi 23.000 estrellas en GitHub y tiene decenas de miles de usuarios de diversas industrias con necesidades variadas. Se está volviendo aún más popular a medida que la tecnología de IA generativa como <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> se vuelve más prevalente. Es un componente esencial de varias pilas de IA, especialmente el marco de <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">generación aumentada de recuperación</a>, que aborda el problema de la alucinación de los grandes modelos lingüísticos.</p>
<p>Para satisfacer la creciente demanda de nuevos usuarios que desean migrar a Milvus y de usuarios existentes que desean actualizarse a las últimas versiones de Milvus, hemos desarrollado <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>. En este blog, exploraremos las características de Milvus Migration y le guiaremos en la rápida transición de sus datos a Milvus desde Milvus 1.x, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> y <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> y posteriores.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration, una potente herramienta de migración de datos<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> es una herramienta de migración de datos escrita en Go. Permite a los usuarios mover sus datos sin problemas desde versiones anteriores de Milvus (1.x), FAISS y Elasticsearch 7.0 y posteriores a versiones Milvus 2.x.</p>
<p>El siguiente diagrama muestra cómo hemos creado Milvus Migration y cómo funciona.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Cómo migra Milvus los datos</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">De Milvus 1.x y FAISS a Milvus 2.x</h4><p>La migración de datos desde Milvus 1.x y FAISS implica analizar el contenido de los archivos de datos originales, transformarlos en el formato de almacenamiento de datos de Milvus 2.x y escribir los datos utilizando el SDK de Milvus <code translate="no">bulkInsert</code>. Todo este proceso está basado en flujos, teóricamente limitado solo por el espacio en disco, y almacena los archivos de datos en su disco local, S3, OSS, GCP o Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">De Elasticsearch a Milvus 2.x</h4><p>En la migración de datos de Elasticsearch, la recuperación de datos es diferente. Los datos no se obtienen de archivos, sino que se obtienen secuencialmente utilizando la API de desplazamiento de Elasticsearch. A continuación, los datos se analizan y transforman en formato de almacenamiento Milvus 2.x, y luego se escriben utilizando <code translate="no">bulkInsert</code>. Además de migrar vectores de tipo <code translate="no">dense_vector</code> almacenados en Elasticsearch, Milvus Migration también admite la migración de otros tipos de campo, incluidos long, integer, short, boolean, keyword, text y double.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Conjunto de características de Milvus Migration</h3><p>Milvus Migration simplifica el proceso de migración gracias a su sólido conjunto de características:</p>
<ul>
<li><p><strong>Fuentes de datos compatibles:</strong></p>
<ul>
<li><p>Milvus 1.x a Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 y posteriores a Milvus 2.x</p></li>
<li><p>FAISS a Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Múltiples modos de interacción:</strong></p>
<ul>
<li><p>Interfaz de línea de comandos (CLI) utilizando el marco Cobra</p></li>
<li><p>API Restful con una interfaz de usuario Swagger integrada</p></li>
<li><p>Integración como módulo Go en otras herramientas</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Soporte versátil de formatos de archivo:</strong></p>
<ul>
<li><p>Archivos locales</p></li>
<li><p>Amazon S3</p></li>
<li><p>Servicio de almacenamiento de objetos (OSS)</p></li>
<li><p>Plataforma en la nube de Google (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Integración flexible con Elasticsearch:</strong></p>
<ul>
<li><p>Migración de vectores de tipo <code translate="no">dense_vector</code> desde Elasticsearch</p></li>
<li><p>Soporte para migrar otros tipos de campo como long, integer, short, boolean, keyword, text y double</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">Definiciones de interfaz</h3><p>Milvus Migration proporciona las siguientes interfaces clave:</p>
<ul>
<li><p><code translate="no">/start</code>: Inicia un trabajo de migración (equivalente a una combinación de volcado y carga, actualmente sólo soporta migración ES).</p></li>
<li><p><code translate="no">/dump</code>: Inicia un trabajo de volcado (escribe los datos de origen en el medio de almacenamiento de destino).</p></li>
<li><p><code translate="no">/load</code>: Inicia un trabajo de carga (escribe datos del medio de almacenamiento de destino en Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: Permite a los usuarios ver los resultados de la ejecución del trabajo. (Para más detalles, consulte <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">server.go del proyecto</a>)</p></li>
</ul>
<p>A continuación, vamos a utilizar algunos datos de ejemplo para explorar cómo utilizar Milvus Migration en esta sección. Puede encontrar estos ejemplos <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">aquí</a> en GitHub.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Migración de Elasticsearch a Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Prepare los datos de Elasticsearch</li>
</ol>
<p>Para <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">migrar datos de Elasticsearch</a>, ya debería haber configurado su propio servidor Elasticsearch. Debe almacenar los datos vectoriales en el campo <code translate="no">dense_vector</code> e indexarlos con otros campos. Las asignaciones de índices son las que se muestran a continuación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>Compilar y construir</li>
</ol>
<p>En primer lugar, descargue el <a href="https://github.com/zilliztech/milvus-migration">código fuente</a> de Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">de GitHub</a>. A continuación, ejecute los siguientes comandos para compilarlo.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Este paso generará un archivo ejecutable llamado <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configure <code translate="no">migration.yaml</code></li>
</ol>
<p>Antes de iniciar la migración, debe preparar un archivo de configuración llamado <code translate="no">migration.yaml</code> que incluya información sobre el origen de datos, el destino y otros ajustes relevantes. A continuación se muestra un ejemplo de configuración:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>Para obtener una explicación más detallada del archivo de configuración, consulte <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">esta página</a> en GitHub.</p>
<ol start="4">
<li>Ejecute el trabajo de migración</li>
</ol>
<p>Ahora que ha configurado su archivo <code translate="no">migration.yaml</code>, puede iniciar la tarea de migración ejecutando el siguiente comando:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Observe la salida del registro. Cuando veas registros similares a los siguientes, significa que la migración se ha realizado correctamente.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Además del enfoque de línea de comandos, Milvus Migration también admite la migración mediante Restful API.</p>
<p>Para utilizar Restful API, inicie el servidor API utilizando el siguiente comando:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>Una vez ejecutado el servicio, puede iniciar la migración llamando a la API.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>Una vez finalizada la migración, puede utilizar <a href="https://zilliz.com/attu">Attu</a>, una herramienta de administración de bases de datos vectoriales todo en uno, para ver el número total de filas migradas correctamente y realizar otras operaciones relacionadas con la recopilación.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>La interfaz de Attu</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Migración de Milvus 1.x a Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Preparar los datos de Milvus 1.x</li>
</ol>
<p>Para ayudarle a experimentar rápidamente el proceso de migración, hemos puesto 10.000 registros de <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">datos de prueba</a> de Milvus 1.x en el código fuente de Milvus Migration. Sin embargo, en casos reales, debe exportar su propio archivo <code translate="no">meta.json</code> desde su instancia de Milvus 1.x antes de iniciar el proceso de migración.</p>
<ul>
<li>Puede exportar los datos con el siguiente comando.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>Asegúrese de:</p>
<ul>
<li><p>Sustituir los marcadores de posición por sus credenciales MySQL reales.</p></li>
<li><p>Detener el servidor Milvus 1.x o detener la escritura de datos antes de realizar esta exportación.</p></li>
<li><p>Copie la carpeta Milvus <code translate="no">tables</code> y el archivo <code translate="no">meta.json</code> en el mismo directorio.</p></li>
</ul>
<p><strong>Nota:</strong> Si utiliza Milvus 2.x en <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (el servicio totalmente gestionado de Milvus), puede iniciar la migración utilizando Cloud Console.</p>
<ol start="2">
<li>Compilar y construir</li>
</ol>
<p>En primer lugar, descargue el <a href="https://github.com/zilliztech/milvus-migration">código fuente</a> de Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">de GitHub</a>. A continuación, ejecute los siguientes comandos para compilarlo.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Este paso generará un archivo ejecutable llamado <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configure <code translate="no">migration.yaml</code></li>
</ol>
<p>Prepare un archivo de configuración <code translate="no">migration.yaml</code>, especificando detalles sobre el origen, el destino y otros ajustes relevantes. He aquí un ejemplo de configuración:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Para una explicación más detallada del archivo de configuración, consulte <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">esta página</a> en GitHub.</p>
<ol start="4">
<li>Ejecutar el trabajo de migración</li>
</ol>
<p>Debe ejecutar los comandos <code translate="no">dump</code> y <code translate="no">load</code> por separado para finalizar la migración. Estos comandos convierten los datos y los importan a Milvus 2.x.</p>
<p><strong>Nota:</strong> En breve simplificaremos este paso y permitiremos a los usuarios finalizar la migración utilizando un solo comando. Permanezca atento.</p>
<p><strong>Comando Dump:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comando Cargar:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Tras la migración, la colección generada en Milvus 2.x contendrá dos campos: <code translate="no">id</code> y <code translate="no">data</code>. Puede ver más detalles utilizando <a href="https://zilliz.com/attu">Attu</a>, una herramienta de administración de bases de datos vectoriales todo en uno.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">Migración de FAISS a Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Preparar los datos FAISS</li>
</ol>
<p>Para migrar los datos de Elasticsearch, debe tener listos sus propios datos FAISS. Para ayudarle a experimentar rápidamente el proceso de migración, hemos puesto algunos <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">datos de prueba FAISS</a> en el código fuente de Milvus Migration.</p>
<ol start="2">
<li>Compilar y construir</li>
</ol>
<p>En primer lugar, descargue el <a href="https://github.com/zilliztech/milvus-migration">código fuente</a> de Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">de GitHub</a>. A continuación, ejecute los siguientes comandos para compilarlo.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Este paso generará un archivo ejecutable llamado <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configure <code translate="no">migration.yaml</code></li>
</ol>
<p>Prepare un archivo de configuración <code translate="no">migration.yaml</code> para la migración FAISS, especificando detalles sobre el origen, el destino y otros ajustes relevantes. He aquí un ejemplo de configuración:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Para una explicación más detallada del archivo de configuración, consulte <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">esta página</a> en GitHub.</p>
<ol start="4">
<li>Ejecutar el trabajo de migración</li>
</ol>
<p>Al igual que la migración de Milvus 1.x a Milvus 2.x, la migración FAISS requiere la ejecución de los comandos <code translate="no">dump</code> y <code translate="no">load</code>. Estos comandos convierten los datos y los importan a Milvus 2.x.</p>
<p><strong>Nota:</strong> En breve simplificaremos este paso y permitiremos a los usuarios finalizar la migración utilizando un solo comando. Permanezca atento.</p>
<p><strong>Comando Dump:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comando de carga:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Puede ver más detalles utilizando <a href="https://zilliz.com/attu">Attu</a>, una herramienta de administración de bases de datos vectoriales todo en uno.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">Permanezca atento a los futuros planes de migración<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>En el futuro, vamos a apoyar la migración de más fuentes de datos y añadir más características de migración, incluyendo:</p>
<ul>
<li><p>Migración de Redis a Milvus.</p></li>
<li><p>Migración de MongoDB a Milvus.</p></li>
<li><p>Migración reanudable.</p></li>
<li><p>Simplificar los comandos de migración fusionando los procesos de volcado y carga en uno solo.</p></li>
<li><p>Soportar la migración desde otras fuentes de datos principales a Milvus.</p></li>
</ul>
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
    </button></h2><p>Milvus 2.3, la última versión de Milvus, aporta nuevas e interesantes funciones y mejoras de rendimiento que satisfacen las crecientes necesidades de la gestión de datos. La migración de sus datos a Milvus 2.x puede desbloquear estos beneficios, y el proyecto Milvus Migration hace que el proceso de migración sea ágil y sencillo. Pruébelo y no le decepcionará.</p>
<p><em><strong>Nota:</strong> La información de este blog se basa en el estado de los proyectos Milvus y <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> en septiembre de 2023. Consulte la <a href="https://milvus.io/docs">documentación</a> oficial de Milvus para obtener la información y las instrucciones más actualizadas.</em></p>
