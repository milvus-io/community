---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: Aprenda a ver los metadatos en la base de datos vectorial Milvus.
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Gestión de metadatos en Milvus (1)</custom-h1><p>Hemos introducido alguna información sobre metadatos en <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestión de datos en el motor de búsqueda vectorial a gran escala</a>. Este artículo muestra principalmente cómo ver los metadatos de Milvus.</p>
<p>Milvus soporta el almacenamiento de metadatos en SQLite o MySQL. Hay un parámetro <code translate="no">backend_url</code> (en el archivo de configuración <code translate="no">server_config.yaml</code>) mediante el cual puede especificar si desea utilizar SQLite o MySQL para gestionar sus metadatos.</p>
<h2 id="SQLite" class="common-anchor-header">SQLite<button data-href="#SQLite" class="anchor-icon" translate="no">
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
    </button></h2><p>Si se utiliza SQLite, se generará un fichero <code translate="no">meta.sqlite</code> en el directorio de datos (definido en <code translate="no">primary_path</code> del fichero de configuración <code translate="no">server_config.yaml</code>) después de iniciar Milvus. Para ver el archivo, sólo necesita instalar un cliente SQLite.</p>
<p>Instale SQLite3 desde la línea de comandos:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>A continuación, entre en el directorio de datos de Milvus y abra el fichero meta utilizando SQLite3:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>Ahora, ya ha entrado en la línea de comandos del cliente SQLite. Sólo tiene que utilizar algunos comandos para ver lo que hay en los metadatos.</p>
<p>Para que los resultados impresos sean más fáciles de leer para los humanos:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>Para consultar Tablas y ArchivosTabla utilizando sentencias SQL (sin distinguir mayúsculas de minúsculas):</p>
<pre><code translate="no">SELECT * FROM Tables
SELECT * FROM TableFiles
</code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_use_sql_lite_2418fc1787.png" alt="1-use-sql-lite.png" class="doc-image" id="1-use-sql-lite.png" />
   </span> <span class="img-wrapper"> <span>1-use-sql-lite.png</span> </span></p>
<h2 id="MySQL" class="common-anchor-header">MySQL<button data-href="#MySQL" class="anchor-icon" translate="no">
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
    </button></h2><p>Si utiliza MySQL, debe especificar la dirección del servicio MySQL en <code translate="no">backend_url</code> del archivo de configuración <code translate="no">server_config.yaml</code>.</p>
<p>Por ejemplo, la siguiente configuración indica que el servicio MySQL está desplegado localmente, con puerto '3306', nombre de usuario 'root', contraseña '123456' y nombre de base de datos 'milvus':</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>En primer lugar, instale el cliente MySQL:</p>
<p>sudo apt-get install default-mysql-client</p>
<p>Después de iniciar Milvus, se crearán dos tablas (Tables y TableFiles) en el servicio MySQL especificado por <code translate="no">backend_url</code>.</p>
<p>Utilice el siguiente comando para conectarse al servicio MySQL:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>Ahora, puede utilizar sentencias SQL para consultar la información de metadatos:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Próximos artículos<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Los próximos artículos presentarán en detalle el esquema de las tablas de metadatos. Permanece atento.</p>
<p>Cualquier pregunta, bienvenido a unirse a nuestro <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">canal de Slack</a> o presentar un problema en el repositorio.</p>
<p>Repo de GitHub: https://github.com/milvus-io/milvus</p>
<p>Si te ha gustado este artículo o te ha resultado útil, ¡no olvides aplaudir!</p>
