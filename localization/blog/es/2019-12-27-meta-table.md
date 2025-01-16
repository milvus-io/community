---
id: 2019-12-27-meta-table.md
title: Gestión de metadatos de Milvus (2) Campos de la tabla de metadatos
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: Conozca el detalle de los campos de las tablas de metadatos en Milvus.
cover: null
tag: Engineering
---
<custom-h1>Gestión de metadatos de Milvus (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">Campos de la tabla de metadatos<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
    </button></h2><blockquote>
<p>Autor: Yihua Mo</p>
<p>Fecha: 2019-12-27</p>
</blockquote>
<p>En el último blog, mencionamos cómo ver sus metadatos utilizando MySQL o SQLite. Este artículo pretende principalmente introducir en detalle los campos en las tablas de metadatos.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">Campos en la tabla &quot;<code translate="no">Tables</code></h3><p>Tomemos como ejemplo SQLite. El siguiente resultado procede de la versión 0.5.0. En la versión 0.6.0 se han añadido algunos campos, que se presentarán más adelante. Hay una fila en <code translate="no">Tables</code> que especifica una tabla vectorial de 512 dimensiones con el nombre <code translate="no">table_1</code>. Cuando se crea la tabla, <code translate="no">index_file_size</code> es 1024 MB, <code translate="no">engine_type</code> es 1 (FLAT), <code translate="no">nlist</code> es 16384, <code translate="no">metric_type</code> es 1 (distancia euclidiana L2). <code translate="no">id</code> es el identificador único de la tabla. <code translate="no">state</code> es el estado de la tabla con 0 indicando un estado normal. <code translate="no">created_on</code> es el tiempo de creación. <code translate="no">flag</code> es la bandera reservada para uso interno.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>tablas</span> </span></p>
<p>La siguiente tabla muestra los tipos de campo y las descripciones de los campos de <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">Campo Nombre</th><th style="text-align:left">Tipo de datos</th><th style="text-align:left">Descripción</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Identificador único de la tabla de vectores. <code translate="no">id</code> se incrementa automáticamente.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">cadena</td><td style="text-align:left">Nombre de la tabla de vectores. <code translate="no">table_id</code> debe ser definido por el usuario y seguir las directrices de Linux sobre nombres de archivo.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">Estado de la tabla de vectores. 0 significa normal y 1 significa borrado (soft delete).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">Dimensión vectorial de la tabla de vectores. Debe ser definida por el usuario.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Número de milisegundos transcurridos desde el 1 de enero de 1970 hasta el momento en que se crea la tabla.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">Bandera para uso interno, como por ejemplo si el id del vector está definido por el usuario. Por defecto es 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Si el tamaño de un archivo de datos alcanza <code translate="no">index_file_size</code>, el archivo no se combina y se utiliza para construir índices. El valor por defecto es 1024 (MB).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Tipo de índice a construir para una tabla vectorial. El valor por defecto es 0, que especifica índice inválido. 1 especifica FLAT. 2 especifica IVFLAT. 3 especifica IVFSQ8. 4 especifica NSG. 5 especifica IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">Número de clusters en que se dividen los vectores de cada fichero de datos cuando se construye el índice. El valor por defecto es 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Método para calcular la distancia entre vectores. 1 especifica la distancia euclidiana (L1) y 2 el producto interno.</td></tr>
</tbody>
</table>
<p>La partición de tablas está habilitada en 0.6.0 con algunos campos nuevos, incluyendo <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> y <code translate="no">version</code>. Una tabla vectorial, <code translate="no">table_1</code>, tiene una partición llamada <code translate="no">table_1_p1</code>, que también es una tabla vectorial. <code translate="no">partition_name</code> corresponde a <code translate="no">table_id</code>. Los campos de una tabla de partición se heredan de la tabla propietaria, con el campo <code translate="no">owner table</code> especificando el nombre de la tabla propietaria y el campo <code translate="no">partition_tag</code> especificando la etiqueta de la partición.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>tablas_nuevas</span> </span></p>
<p>La siguiente tabla muestra los nuevos campos en 0.6.0:</p>
<table>
<thead>
<tr><th style="text-align:left">Nombre del campo</th><th style="text-align:left">Tipo de datos</th><th style="text-align:left">Descripción</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">cadena</td><td style="text-align:left">Tabla padre de la partición.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">cadena</td><td style="text-align:left">Etiqueta de la partición. No debe ser una cadena vacía.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">cadena</td><td style="text-align:left">Versión de Milvus.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Campos de la tabla "<code translate="no">TableFiles&quot;</code> </h3><p>El siguiente ejemplo contiene dos ficheros, ambos pertenecientes a la tabla de vectores <code translate="no">table_1</code>. El tipo de índice (<code translate="no">engine_type</code>) del primer fichero es 1 (FLAT); el estado del fichero (<code translate="no">file_type</code>) es 7 (copia de seguridad del fichero original); <code translate="no">file_size</code> es 411200113 bytes; el número de filas de vectores es 200.000. El tipo de índice del segundo archivo es 2 (IVFLAT); el estado del archivo es 3 (archivo de índice). El segundo fichero es en realidad el índice del primer fichero. Introduciremos más información en próximos artículos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>archivos de tabla</span> </span></p>
<p>La siguiente tabla muestra los campos y las descripciones de <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">Nombre del campo</th><th style="text-align:left">Tipo de datos</th><th style="text-align:left">Descripción</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Identificador único de una tabla vectorial. <code translate="no">id</code> se incrementa automáticamente.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">cadena</td><td style="text-align:left">Nombre de la tabla vectorial.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Tipo de índice a construir para una tabla vectorial. El valor predeterminado es 0, que especifica un índice no válido. 1 especifica FLAT. 2 especifica IVFLAT. 3 especifica IVFSQ8. 4 especifica NSG. 5 especifica IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">cadena</td><td style="text-align:left">Nombre de archivo generado a partir de la hora de creación del archivo. Equivale a 1000 multiplicado por el número de milisegundos transcurridos desde el 1 de enero de 1970 hasta el momento de creación de la tabla.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Estado del archivo. 0 especifica un archivo de datos vectoriales sin procesar recién generado. 1 especifica un archivo de datos vectoriales sin procesar. 2 especifica que se creará un índice para el archivo. 3 especifica que el archivo es un archivo de índice. 4 especifica que el archivo se borrará (borrado suave). 5 indica que se trata de un nuevo archivo que se utilizará para almacenar datos combinados. 6 indica que el fichero es de nueva creación y se utiliza para almacenar datos de índice. 7 especifica el estado de copia de seguridad del archivo de datos vectoriales sin procesar.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Tamaño del archivo en bytes.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">Número de vectores en un archivo.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">Marca de tiempo de la última actualización, que especifica el número de milisegundos transcurridos desde el 1 de enero de 1970 hasta el momento en que se crea la tabla.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Número de milisegundos transcurridos desde el 1 de enero de 1970 hasta la creación de la tabla.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">Fecha de creación de la tabla. Sigue aquí por razones históricas y se eliminará en futuras versiones.</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">Blogs relacionados<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestión de datos en un motor de búsqueda vectorial a escala masiva</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Gestión de metadatos de Milvus (1): Cómo visualizar metadatos</a></li>
</ul>
