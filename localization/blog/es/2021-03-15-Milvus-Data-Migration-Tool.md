---
id: Milvus-Data-Migration-Tool.md
title: Presentación de la herramienta de migración de datos Milvus
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  Aprenda a utilizar la herramienta de migración de datos Milvus para mejorar en
  gran medida la eficiencia de la gestión de datos y reducir los costes de
  DevOps.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Presentación de la Herramienta de migración de datos de Milvus</custom-h1><p><em><strong>Nota importante</strong>: La Herramienta de Migración de Datos de Milvus ha quedado obsoleta. Para la migración de datos de otras bases de datos a Milvus, le recomendamos que utilice la herramienta más avanzada Milvus-migration Tool.</em></p>
<p>La herramienta Milvus-migration actualmente soporta:</p>
<ul>
<li>Elasticsearch a Milvus 2.x</li>
<li>Faiss a Milvus 2.x</li>
<li>Milvus 1.x a Milvus 2.x</li>
<li>Milvus 2.3.x a Milvus 2.3.x o superior</li>
</ul>
<p>Apoyaremos la migración desde más fuentes de datos vectoriales como Pinecone, Chroma y Qdrant. Permanezca atento.</p>
<p><strong>Para más información, consulte la <a href="https://milvus.io/docs/migrate_overview.md">documentación de Milvus-migration</a> o su <a href="https://github.com/zilliztech/milvus-migration">repositorio GitHub</a>.</strong></p>
<p>--------------------------------- <strong>La Herramienta de Migración de Datos Mivus ha sido obsoleta</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">Visión general</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus Data Migration) es una herramienta de código abierto diseñada específicamente para importar y exportar archivos de datos con Milvus. MilvusDM puede mejorar en gran medida la eficiencia de la gestión de datos y reducir los costes de DevOps de las siguientes maneras:</p>
<ul>
<li><p><a href="#faiss-to-milvus">De Faiss</a> a Milvus: Importe datos descomprimidos de Faiss a Milvus.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5</a> a Milvus: Importación de archivos HDF5 a Milvus.</p></li>
<li><p><a href="#milvus-to-milvus">Milvus a Milvus</a>: Migrar datos de un Milvus de origen a otro Milvus de destino.</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus a HDF5</a>: Guardar datos en Milvus como archivos HDF5.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 1.png</span> </span></p>
<p>MilvusDM está alojado en <a href="https://github.com/milvus-io/milvus-tools">Github</a> y puede instalarse fácilmente ejecutando la línea de comandos <code translate="no">pip3 install pymilvusdm</code>. MilvusDM le permite migrar datos en una colección o partición específica. En las siguientes secciones, explicaremos cómo utilizar cada tipo de migración de datos.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss a Milvus</h3><h4 id="Steps" class="common-anchor-header">Pasos</h4><p>1.Descargue <strong>F2M.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Configure los siguientes parámetros:</p>
<ul>
<li><p><code translate="no">data_path</code>: Ruta de datos (vectores y sus ID correspondientes) en Faiss.</p></li>
<li><p><code translate="no">dest_host</code>: Dirección del servidor Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Puerto del servidor Milvus.</p></li>
<li><p><code translate="no">mode</code>: Los datos pueden importarse a Milvus utilizando los siguientes modos:</p>
<ul>
<li><p>Omitir: Ignora los datos si la colección o partición ya existe.</p></li>
<li><p>Añadir: Añadir datos si la colección o partición ya existe.</p></li>
<li><p>Sobrescribir: Borrar datos antes de insertarlos si la colección o partición ya existe.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nombre de la colección receptora para la importación de datos.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nombre de la partición receptora para la importación de datos.</p></li>
<li><p><code translate="no">collection_parameter</code>: Información específica de la colección, como la dimensión del vector, el tamaño del archivo de índice y la métrica de distancia.</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Ejecute <strong>F2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Código de ejemplo</h4><p>1.Lea los archivos Faiss para recuperar los vectores y sus ID correspondientes.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.Inserte los datos recuperados en Milvus:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5 to Milvus</h3><h4 id="Steps" class="common-anchor-header">Pasos</h4><p>1.Descargue <strong>H2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Configure los siguientes parámetros:</p>
<ul>
<li><p><code translate="no">data_path</code>: Ruta a los archivos HDF5.</p></li>
<li><p><code translate="no">data_dir</code>: Directorio que contiene los archivos HDF5.</p></li>
<li><p><code translate="no">dest_host</code>: Dirección del servidor Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Puerto del servidor Milvus.</p></li>
<li><p><code translate="no">mode</code>: Los datos pueden importarse a Milvus utilizando los siguientes modos:</p>
<ul>
<li><p>Omitir: Ignora los datos si la colección o partición ya existe.</p></li>
<li><p>Añadir: Añadir datos si la colección o partición ya existe.</p></li>
<li><p>Sobrescribir: Borrar datos antes de insertarlos si la colección o partición ya existe.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nombre de la colección receptora para la importación de datos.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nombre de la partición receptora para la importación de datos.</p></li>
<li><p><code translate="no">collection_parameter</code>: Información específica de la colección, como la dimensión del vector, el tamaño del archivo de índice y la métrica de distancia.</p></li>
</ul>
<blockquote>
<p>Seleccione <code translate="no">data_path</code> o <code translate="no">data_dir</code>. <strong>No</strong> configure ambos. Utilice <code translate="no">data_path</code> para especificar varias rutas de archivos o <code translate="no">data_dir</code> para especificar el directorio que contiene el archivo de datos.</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Ejecute <strong>H2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Código de ejemplo</h4><p>1.Lea los archivos HDF5 para recuperar los vectores y sus IDs correspondientes:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.Inserte los datos recuperados en Milvus:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus a Milvus</h3><h4 id="Steps" class="common-anchor-header">Pasos</h4><p>1.Descargue <strong>M2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Configure los siguientes parámetros:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Source Milvus work path.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Configuración MySQL de Milvus. Si no se utiliza MySQL, establezca mysql_parameter como ''.</p></li>
<li><p><code translate="no">source_collection</code>: Nombres de la colección y sus particiones en el Milvus fuente.</p></li>
<li><p><code translate="no">dest_host</code>: Dirección del servidor Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Puerto del servidor Milvus.</p></li>
<li><p><code translate="no">mode</code>: Los datos pueden importarse a Milvus utilizando los siguientes modos:</p>
<ul>
<li><p>Omitir: Ignora los datos si la colección o partición ya existe.</p></li>
<li><p>Añadir: Añadir datos si la colección o partición ya existe.</p></li>
<li><p>Sobrescribir: Si la colección o partición ya existe, borre los datos antes de insertarlos.Borre los datos antes de insertarlos si la colección o partición ya existe.</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Ejecute <strong>M2M.yaml.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Código de ejemplo</h4><p>1.De acuerdo con los metadatos de una colección o partición especificada, lea los archivos bajo <strong>milvus/db</strong> en su unidad local para recuperar vectores y sus IDs correspondientes desde el Milvus fuente.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.Inserte los datos recuperados en el Milvus de destino.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">Milvus a HDF5</h3><h4 id="Steps" class="common-anchor-header">Pasos</h4><p>1.Descargue <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Configure los siguientes parámetros:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Source Milvus work path.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Source Milvus MySQL settings. Si no se utiliza MySQL, establezca mysql_parameter como ''.</p></li>
<li><p><code translate="no">source_collection</code>: Nombres de la colección y sus particiones en el Milvus fuente.</p></li>
<li><p><code translate="no">data_dir</code>: Directorio para guardar los archivos HDF5.</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Ejecute <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Código de ejemplo</h4><p>1.De acuerdo con los metadatos de una colección o partición especificada, lea los archivos bajo <strong>milvus/db</strong> en su unidad local para recuperar los vectores y sus IDs correspondientes.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.Guarde los datos recuperados como archivos HDF5.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">Estructura de archivos MilvusDM</h3><p>El siguiente diagrama de flujo muestra cómo MilvusDM realiza diferentes tareas según el archivo YAML que recibe:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>Estructura de archivos de MilvusDM:</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>núcleo</p>
<ul>
<li><p><strong>milvus_client.py</strong>: Realiza operaciones de cliente en Milvus.</p></li>
<li><p><strong>read_data.py</strong>: Lee los archivos de datos HDF5 en su unidad local. (Añada su código aquí para soportar la lectura de ficheros de datos en otros formatos).</p></li>
<li><p><strong>read_faiss_data.py</strong>: Lee los ficheros de datos en Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: Lee los ficheros de datos en Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: Lee los metadatos en Milvus.</p></li>
<li><p><strong>datos_a_milvus.py</strong>: Crea colecciones o particiones basadas en parámetros en archivos YAML e importa los vectores y los IDs de vectores correspondientes a Milvus.</p></li>
<li><p><strong>save_data.py</strong>: Guarda los datos como archivos HDF5.</p></li>
<li><p><strong>write_logs.py</strong>: Escribe los registros durante el tiempo de ejecución.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Importa datos de Faiss a Milvus.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: Importa datos en archivos HDF5 a Milvus.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: Migra datos de un Milvus fuente al Milvus destino.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: Exporta datos en Milvus y los guarda como archivos HDF5.</p></li>
<li><p><strong>main.py</strong>: Realiza las tareas correspondientes según el fichero YAML recibido.</p></li>
<li><p><strong>setting.py</strong>: Configuraciones relativas a la ejecución del código MilvusDM.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: Crea paquetes de archivos <strong>pymilvusdm</strong> y los sube a PyPI (Python Package Index).</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">Recapitulación</h3><p>MilvusDM se ocupa principalmente de la migración de datos dentro y fuera de Milvus, que incluye Faiss a Milvus, HDF5 a Milvus, Milvus a Milvus y Milvus a HDF5.</p>
<p>Las siguientes funciones están previstas para las próximas versiones:</p>
<ul>
<li><p>Importar datos binarios de Faiss a Milvus.</p></li>
<li><p>Blocklist y allowlist para la migración de datos entre Milvus de origen y Milvus de destino.</p></li>
<li><p>Fusionar e importar datos de múltiples colecciones o particiones en Milvus de origen a una nueva colección en Milvus de destino.</p></li>
<li><p>Copia de seguridad y recuperación de los datos de Milvus.</p></li>
</ul>
<p>El proyecto MilvusDM es de código abierto en <a href="https://github.com/milvus-io/milvus-tools">Github</a>. Todas y cada una de las contribuciones al proyecto son bienvenidas. ¡Dale una estrella 🌟, y siéntete libre de presentar un <a href="https://github.com/milvus-io/milvus-tools/issues">problema</a> o enviar tu propio código!</p>
