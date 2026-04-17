---
id: milvus-supports-apache-parquet-file-supports.md
title: >-
  Milvus admite la importación de archivos Apache Parquet para mejorar la
  eficacia del procesamiento de datos
author: 'Cai Zhang, Fendy Feng'
date: 2024-3-8
desc: >-
  Al adoptar Apache Parquet, los usuarios pueden agilizar sus procesos de
  importación de datos y disfrutar de importantes ahorros en costes de
  almacenamiento y computación.
metaTitle: Milvus Supports Imports of Apache Parquet Files
cover: assets.zilliz.com/Milvus_Supports_the_Imports_of_Parquet_Files_3288e755b8.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-supports-apache-parquet-file-supports.md'
---
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>, la base de datos vectorial altamente escalable y famosa por su capacidad para manejar grandes conjuntos de datos, da un importante paso adelante al introducir la compatibilidad con archivos Parquet en <a href="https://zilliz.com/blog/what-is-new-in-milvus-2-3-4">la versión 2.3.4</a>. Al adoptar Apache Parquet, los usuarios pueden agilizar sus procesos de importación de datos y disfrutar de un ahorro sustancial en costes de almacenamiento y computación.</p>
<p>En nuestro último post, exploramos las ventajas de Parquet y los beneficios que aporta a los usuarios de Milvus. Discutimos la motivación que hay detrás de la integración de esta función y proporcionamos una guía paso a paso para importar sin problemas archivos Parquet en Milvus, desbloqueando nuevas posibilidades para una gestión y análisis eficientes de los datos.</p>
<h2 id="What-Is-Apache-Parquet" class="common-anchor-header">¿Qué es Apache Parquet?<button data-href="#What-Is-Apache-Parquet" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://parquet.apache.org/">Apache Parquet</a> es un popular formato de archivo de datos orientado a columnas de código abierto diseñado para mejorar la eficiencia del almacenamiento y procesamiento de conjuntos de datos a gran escala. A diferencia de los formatos de datos tradicionales orientados a filas, como CSV o JSON, Parquet almacena los datos por columnas, ofreciendo esquemas de compresión y codificación de datos más eficientes. Este enfoque se traduce en un mejor rendimiento, menores requisitos de almacenamiento y una mayor capacidad de procesamiento, lo que lo hace ideal para manejar datos complejos en masa.</p>
<h2 id="How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="common-anchor-header">Cómo se benefician los usuarios de Milvus de la compatibilidad con la importación de archivos Parquet<button data-href="#How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus amplía la compatibilidad con las importaciones de archivos Parquet, proporcionando a los usuarios experiencias optimizadas y diversas ventajas, entre las que se incluyen la reducción de los gastos de almacenamiento y computación, la racionalización de la gestión de datos y la simplificación del proceso de importación.</p>
<h3 id="Optimized-Storage-Efficiency-and-Streamlined-Data-Management" class="common-anchor-header">Eficiencia de almacenamiento optimizada y gestión de datos racionalizada</h3><p>Parquet ofrece opciones de compresión flexibles y esquemas de codificación eficientes que se adaptan a diferentes tipos de datos, garantizando una eficiencia de almacenamiento óptima. Esta flexibilidad es especialmente valiosa en entornos de nube, donde cada gramo de ahorro de almacenamiento se correlaciona directamente con una reducción tangible de los costes. Con esta nueva función de Milvus, los usuarios pueden consolidar sin esfuerzo todos sus datos diversos en un único archivo, agilizando la gestión de datos y mejorando la experiencia general del usuario. Esta función es especialmente beneficiosa para los usuarios que trabajan con tipos de datos Array de longitud variable, que ahora pueden disfrutar de un proceso de importación de datos simplificado.</p>
<h3 id="Improved-Query-Performance" class="common-anchor-header">Mejora del rendimiento de las consultas</h3><p>El diseño de almacenamiento en columnas de Parquet y los métodos de compresión avanzados mejoran significativamente el rendimiento de las consultas. A la hora de realizar consultas, los usuarios pueden centrarse únicamente en los datos pertinentes sin tener que escanear los datos irrelevantes. Esta lectura selectiva de columnas minimiza el uso de la CPU, lo que se traduce en tiempos de consulta más rápidos.</p>
<h3 id="Broad-Language-Compatibility" class="common-anchor-header">Amplia compatibilidad lingüística</h3><p>Parquet está disponible en varios lenguajes, como Java, C++ y Python, y es compatible con un gran número de herramientas de procesamiento de datos. Con el soporte de archivos Parquet, los usuarios de Milvus que utilizan diferentes SDKs pueden generar sin problemas archivos Parquet para analizarlos dentro de la base de datos.</p>
<h2 id="How-to-Import-Parquet-Files-into-Milvus" class="common-anchor-header">Cómo importar archivos Parquet a Milvus<button data-href="#How-to-Import-Parquet-Files-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Si sus datos ya están en formato de archivo Parquet, la importación es fácil. Suba el archivo Parquet a un sistema de almacenamiento de objetos como MinIO, y ya está listo para importar.</p>
<p>El siguiente fragmento de código es un ejemplo de importación de ficheros Parquet a Milvus.</p>
<pre><code translate="no">remote_files = []
<span class="hljs-keyword">try</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Prepare upload files&quot;</span>)
    minio_client = Minio(endpoint=MINIO_ADDRESS, access_key=MINIO_ACCESS_KEY, secret_key=MINIO_SECRET_KEY,
                         secure=<span class="hljs-literal">False</span>)
    found = minio_client.bucket_exists(bucket_name)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> found:
        minio_client.make_bucket(bucket_name)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;MinIO bucket &#x27;{}&#x27; doesn&#x27;t exist&quot;</span>.<span class="hljs-built_in">format</span>(bucket_name))
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

    <span class="hljs-comment"># set your remote data path</span>
    remote_data_path = <span class="hljs-string">&quot;milvus_bulkinsert&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file</span>(<span class="hljs-params">f: <span class="hljs-built_in">str</span></span>):
        file_name = os.path.basename(f)
        minio_file_path = os.path.join(remote_data_path, <span class="hljs-string">&quot;parquet&quot;</span>, file_name)
        minio_client.fput_object(bucket_name, minio_file_path, f)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Upload file &#x27;{}&#x27; to &#x27;{}&#x27;&quot;</span>.<span class="hljs-built_in">format</span>(f, minio_file_path))
        remote_files.append(minio_file_path)

    upload_file(data_file)

<span class="hljs-keyword">except</span> S3Error <span class="hljs-keyword">as</span> e:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Failed to connect MinIO server {}, error: {}&quot;</span>.<span class="hljs-built_in">format</span>(MINIO_ADDRESS, e))
    <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Successfully upload files: {}&quot;</span>.<span class="hljs-built_in">format</span>(remote_files))
<span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>, remote_files
<button class="copy-code-btn"></button></code></pre>
<p>Si sus datos no son archivos Parquet o tienen campos dinámicos, puede aprovechar BulkWriter, nuestra herramienta de conversión de formatos de datos, para ayudarle a generar archivos Parquet. BulkWriter ha adoptado ahora Parquet como su formato de datos de salida por defecto, asegurando una experiencia más intuitiva para los desarrolladores.</p>
<p>El siguiente fragmento de código es un ejemplo del uso de BulkWriter para generar archivos Parquet.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> json

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    RemoteBulkWriter,
    BulkFileType,
)

remote_writer = RemoteBulkWriter(
        schema=your_collection_schema,
        remote_path=<span class="hljs-string">&quot;your_remote_data_path&quot;</span>,
        connect_param=RemoteBulkWriter.ConnectParam(
            endpoint=YOUR_MINIO_ADDRESS,
            access_key=YOUR_MINIO_ACCESS_KEY,
            secret_key=YOUR_MINIO_SECRET_KEY,
            bucket_name=<span class="hljs-string">&quot;a-bucket&quot;</span>,
        ),
        file_type=BulkFileType.PARQUET,
)

<span class="hljs-comment"># append your data</span>
batch_count = <span class="hljs-number">10000</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    row = {
        <span class="hljs-string">&quot;id&quot;</span>: i,
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">5</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: i % <span class="hljs-number">128</span>,
        <span class="hljs-string">&quot;int16&quot;</span>: i % <span class="hljs-number">1000</span>,
        <span class="hljs-string">&quot;int32&quot;</span>: i % <span class="hljs-number">100000</span>,
        <span class="hljs-string">&quot;int64&quot;</span>: i,
        <span class="hljs-string">&quot;float&quot;</span>: i / <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;double&quot;</span>: i / <span class="hljs-number">7</span>,
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: {<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>},
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    }
    remote_writer.append_row(row)

<span class="hljs-comment"># append rows by numpy type</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    remote_writer.append_row({
        <span class="hljs-string">&quot;id&quot;</span>: np.int64(i + batch_count),
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">3</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: np.int8(i % <span class="hljs-number">128</span>),
        <span class="hljs-string">&quot;int16&quot;</span>: np.int16(i % <span class="hljs-number">1000</span>),
        <span class="hljs-string">&quot;int32&quot;</span>: np.int32(i % <span class="hljs-number">100000</span>),
        <span class="hljs-string">&quot;int64&quot;</span>: np.int64(i),
        <span class="hljs-string">&quot;float&quot;</span>: np.float32(i / <span class="hljs-number">3</span>),
        <span class="hljs-string">&quot;double&quot;</span>: np.float64(i / <span class="hljs-number">7</span>),
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: json.dumps({<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>}),
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    })

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.total_row_count}</span> rows appends&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.buffer_row_count}</span> rows in buffer not flushed&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generate data files...&quot;</span>)
remote_writer.commit()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Data files have been uploaded: <span class="hljs-subst">{remote_writer.batch_files}</span>&quot;</span>)
remote_files = remote_writer.batch_files
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, puede empezar a importar sus archivos Parquet en Milvus.</p>
<pre><code translate="no">remote_files = [remote_file_path]
task_id = utility.do_bulk_insert(collection_name=collection_name,
                                 files=remote_files)

task_ids = [task_id]         
states = wait_tasks_to_state(task_ids, BulkInsertState.ImportCompleted)
complete_count = 0
for state in states:
    if state.state == BulkInsertState.ImportCompleted:
        complete_count = complete_count + 1
<button class="copy-code-btn"></button></code></pre>
<p>Ahora, sus datos están perfectamente integrados en Milvus.</p>
<h2 id="Whats-Next" class="common-anchor-header">¿Y ahora qué?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>A medida que Milvus continúa soportando volúmenes de datos cada vez mayores, surge el reto de gestionar importaciones de gran tamaño, especialmente cuando los archivos Parquet superan los 10 GB. Para hacer frente a este reto, tenemos previsto segregar los datos de importación en columnas escalares y vectoriales, creando dos archivos Parquet por importación para aliviar la presión de E/S. Para conjuntos de datos que superen varios cientos de gigabytes, recomendamos importar los datos varias veces.</p>
