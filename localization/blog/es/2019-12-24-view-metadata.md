---
id: 2019-12-24-view-metadata.md
title: Gestión de metadatos Milvus (1) Cómo ver los metadatos
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  Milvus soporta el almacenamiento de metadatos en SQLite o MySQL. Este artículo
  explica cómo ver metadatos con SQLite y MySQL.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Gestión de metadatos Milvus (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">Cómo ver metadatos<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>Fecha: 2019-12-24</p>
</blockquote>
<p>Introdujimos alguna información sobre metadatos en <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestión de datos en buscador vectorial masivo</a>. Este artículo muestra principalmente cómo ver los metadatos de Milvus.</p>
<p>Milvus admite el almacenamiento de metadatos en SQLite o MySQL. Hay un parámetro <code translate="no">backend_url</code> (en el archivo de configuración <code translate="no">server_config.yaml</code>) mediante el cual puede especificar si desea utilizar SQLite o MySQL para gestionar sus metadatos.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>Si se utiliza SQLite, se generará un fichero <code translate="no">meta.sqlite</code> en el directorio de datos (definido en <code translate="no">primary_path</code> del fichero de configuración <code translate="no">server_config.yaml</code>) después de iniciar Milvus. Para ver el archivo, sólo necesita instalar un cliente SQLite.</p>
<p>Instale SQLite3 desde la línea de comandos:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, entre en el directorio de datos de Milvus y abra el fichero meta utilizando SQLite3:</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>Ahora, ya ha entrado en la línea de comandos del cliente SQLite. Sólo tiene que utilizar algunos comandos para ver lo que hay en los metadatos.</p>
<p>Para que los resultados impresos sean más fáciles de leer para los humanos:</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para consultar Tablas y ArchivosTabla utilizando sentencias SQL (sin distinguir mayúsculas de minúsculas):</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>Si utiliza MySQL, debe especificar la dirección del servicio MySQL en <code translate="no">backend_url</code> del archivo de configuración <code translate="no">server_config.yaml</code>.</p>
<p>Por ejemplo, la siguiente configuración indica que el servicio MySQL está desplegado localmente, con el puerto "3306", el nombre de usuario "root", la contraseña "123456" y el nombre de la base de datos "milvus":</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>En primer lugar, instale el cliente MySQL:</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>Después de iniciar Milvus, se crearán dos tablas (Tables y TableFiles) en el servicio MySQL especificado por <code translate="no">backend_url</code>.</p>
<p>Utilice el siguiente comando para conectarse al servicio MySQL:</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>Ahora, puede utilizar sentencias SQL para consultar la información de metadatos:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png" alt="mysql" class="doc-image" id="mysql" />
   </span> <span class="img-wrapper"> <span>mysql</span> </span></p>
<h2 id="相关博客" class="common-anchor-header">相关博客<button data-href="#相关博客" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Gestión de metadatos de Milvus (2): Campos de la tabla de metadatos</a></li>
</ul>
