---
id: inside-milvus-1.1.0.md
title: Nuevas funciones
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  ¡Milvus v1.1.0 ha llegado! Ya están disponibles las nuevas funciones, mejoras
  y correcciones de errores.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Dentro de Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a> es un proyecto de software de código abierto (OSS) centrado en la creación de la base de datos vectorial más rápida y fiable del mundo. Las nuevas características de Milvus v1.1.0 son las primeras de muchas actualizaciones que están por llegar, gracias al apoyo a largo plazo de la comunidad de código abierto y al patrocinio de Zilliz. Este artículo de blog cubre las nuevas características, mejoras y correcciones de errores incluidas en Milvus v1.1.0.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#new-features">Nuevas funciones</a></li>
<li><a href="#improvements">Mejoras</a></li>
<li><a href="#bug-fixes">Corrección de errores</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">Nuevas funciones<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>Como cualquier proyecto OSS, Milvus es un trabajo perpetuo en progreso. Nos esforzamos por escuchar a nuestros usuarios y a la comunidad de código abierto para priorizar las características que más importan. La última actualización, Milvus v1.1.0, ofrece las siguientes nuevas características:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">Especificar particiones con llamadas a métodos <code translate="no">get_entity_by_id()</code> </h3><p>Para acelerar aún más la búsqueda de similitud de vectores, Milvus 1.1.0 ahora permite recuperar vectores de una partición especificada. Generalmente, Milvus soporta la consulta de vectores a través de IDs de vectores especificados. En Milvus 1.0, llamar al método <code translate="no">get_entity_by_id()</code> busca en toda la colección, lo que puede llevar mucho tiempo para grandes conjuntos de datos. Como podemos ver en el código siguiente, <code translate="no">GetVectorsByIdHelper</code> utiliza una estructura <code translate="no">FileHolder</code> para recorrer y encontrar un vector específico.</p>
<pre><code translate="no">std::vector&lt;meta::CollectionSchema&gt; collection_array; 
 <span class="hljs-type">auto</span> <span class="hljs-variable">status</span> <span class="hljs-operator">=</span> meta_ptr_-&gt;ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_-&gt;FilesByTypeEx(collection_array, file_types, files_holder); 
 <span class="hljs-keyword">if</span> (!status.ok()) { 
     std::<span class="hljs-type">string</span> <span class="hljs-variable">err_msg</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;Failed to get files for GetVectorByID: &quot;</span> + status.message(); 
     LOG_ENGINE_ERROR_ &lt;&lt; err_msg; 
     <span class="hljs-keyword">return</span> status; 
 } 
  
 <span class="hljs-keyword">if</span> (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;No files to get vector by id from&quot;</span>; 
     <span class="hljs-keyword">return</span> Status(DB_NOT_FOUND, <span class="hljs-string">&quot;Collection is empty&quot;</span>); 
 } 
  
 cache::CpuCacheMgr::GetInstance()-&gt;PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers&amp; id_array, std::vector&lt;engine::VectorsData&gt;&amp; vectors, 
                              meta::FilesHolder&amp; files_holder) { 
     <span class="hljs-comment">// attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal </span>
     milvus::engine::meta::<span class="hljs-type">SegmentsSchema</span> <span class="hljs-variable">files</span> <span class="hljs-operator">=</span> files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;Getting vector by id in &quot;</span> &lt;&lt; files.size() &lt;&lt; <span class="hljs-string">&quot; files, id count = &quot;</span> &lt;&lt; id_array.size(); 
  
     <span class="hljs-comment">// sometimes not all of id_array can be found, we need to return empty vector for id not found </span>
     <span class="hljs-comment">// for example: </span>
     <span class="hljs-comment">// id_array = [1, -1, 2, -1, 3] </span>
     <span class="hljs-comment">// vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] </span>
     <span class="hljs-comment">// the ID2RAW is to ensure returned vector sequence is consist with id_array </span>
     <span class="hljs-type">using</span> <span class="hljs-variable">ID2VECTOR</span> <span class="hljs-operator">=</span> std::map&lt;int64_t, VectorsData&gt;; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     <span class="hljs-type">IDNumbers</span> <span class="hljs-variable">temp_ids</span> <span class="hljs-operator">=</span> id_array; 
     <span class="hljs-keyword">for</span> (auto&amp; file : files) { 
<button class="copy-code-btn"></button></code></pre>
<p>Sin embargo, esta estructura no está filtrada por ninguna partición en <code translate="no">FilesByTypeEx()</code>. En Milvus v1.1.0, es posible que el sistema pase nombres de particiones al bucle <code translate="no">GetVectorsIdHelper</code> para que <code translate="no">FileHolder</code> sólo contenga segmentos de las particiones especificadas. Dicho de otro modo, si sabe exactamente a qué partición pertenece el vector de una búsqueda, puede especificar el nombre de la partición en una llamada al método <code translate="no">get_entity_by_id()</code> para acelerar el proceso de búsqueda.</p>
<p>No sólo hemos realizado modificaciones en el código que controla las consultas del sistema a nivel del servidor Milvus, sino que también hemos actualizado todos nuestros SDK (Python, Go, C++, Java y RESTful) añadiendo un parámetro para especificar los nombres de las particiones. Por ejemplo, en pymilvus, la definición de <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> se cambia a <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code>.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">Especificación de particiones con llamadas al método <code translate="no">delete_entity_by_id()</code> </h3><p>Para que la gestión de vectores sea más eficiente, Milvus v1.1.0 admite ahora la especificación de nombres de partición al eliminar un vector de una colección. En Milvus 1.0, los vectores de una colección sólo pueden borrarse por ID. Al llamar al método de borrado, Milvus escaneará todos los vectores de la colección. Sin embargo, es mucho más eficiente escanear sólo las particiones relevantes cuando se trabaja con conjuntos de datos masivos de millones, billones o incluso trillones de vectores. De forma similar a la nueva función para especificar particiones con llamadas al método <code translate="no">get_entity_by_id()</code>, se han realizado modificaciones en el código de Milvus utilizando la misma lógica.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">Nuevo método <code translate="no">release_collection()</code></h3><p>Para liberar memoria que Milvus utilizaba para cargar colecciones en tiempo de ejecución, se ha añadido un nuevo método <code translate="no">release_collection()</code> en Milvus v1.1.0 para descargar manualmente colecciones específicas de la caché.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">Mejoras<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>Aunque las nuevas características suelen estar de moda, también es importante mejorar lo que ya tenemos. Lo que sigue son actualizaciones y otras mejoras generales sobre Milvus v1.0.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">Mejora del rendimiento de la llamada al método <code translate="no">get_entity_by_id()</code> </h3><p>El siguiente gráfico es una comparación del rendimiento de la búsqueda vectorial entre Milvus v1.0 y Milvus v1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Tamaño del archivo de segmento = 1024 MB <br/>Recuento de filas = 1.000.000 <br/>Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">ID de consulta Num</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 ms</td><td style="text-align:center">2 ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 ms</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib actualizada a v0.5.0</h3><p>Milvus adopta múltiples bibliotecas de índices ampliamente utilizadas, incluyendo Faiss, NMSLIB, Hnswlib y Annoy para simplificar el proceso de elección del tipo de índice adecuado para un escenario dado.</p>
<p>Hnswlib se ha actualizado de v0.3.0 a v0.5.0 en Milvus 1.1.0 debido a un error detectado en la versión anterior. Además, la actualización de Hnswlib mejora el rendimiento de <code translate="no">addPoint()</code> en la creación de índices.</p>
<p>Un desarrollador de Zilliz creó un pull request (PR) para mejorar el rendimiento de Hnswlib al construir índices en Milvus. Ver <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a> para más detalles.</p>
<p>El siguiente gráfico es una comparación del rendimiento de <code translate="no">addPoint()</code> entre Hnswlib 0.5.0 y el PR propuesto:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Dataset: sift_1M (row count = 1000000, dim = 128, space = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16, ef_construcción = 100</td><td style="text-align:center">274406 ms</td><td style="text-align:center">265631 ms</td></tr>
<tr><td style="text-align:center">M = 16, ef_construcción = 200</td><td style="text-align:center">522411 ms</td><td style="text-align:center">499639 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">Mejora del rendimiento de la formación de índices IVF</h3><p>La creación de un índice incluye la formación, la inserción y la escritura de datos en el disco. Milvus 1.1.0 mejora el componente de formación de la creación de índices. El siguiente gráfico es una comparación del rendimiento de la formación de índices IVF entre Milvus 1.0 y Milvus 1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Dataset: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">v1.0.0 (ms)</th><th style="text-align:center">v1.1.0 (ms)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ivf_flat (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">ivf_flat (nlist = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">Corrección de errores<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>También hemos corregido algunos errores para que Milvus sea más estable y eficiente a la hora de gestionar conjuntos de datos vectoriales. Vea <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">Problemas corregidos</a> para más detalles.</p>
