---
id: 2019-12-24-view-metadata.md
title: Управление метаданными Milvus (1) Как просматривать метаданные
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  Milvus поддерживает хранение метаданных в SQLite или MySQL. В этом посте
  рассказывается о том, как просматривать метаданные с помощью SQLite и MySQL.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Управление метаданными Milvus (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">Как просматривать метаданные<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>Автор: Yihua Mo</p>
<p>Дата: 2019-12-24</p>
</blockquote>
<p>Мы представили некоторую информацию о метаданных в разделе <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Управление данными в векторной поисковой системе Massive-Scale</a>. Эта статья в основном показывает, как просматривать метаданные Milvus.</p>
<p>Milvus поддерживает хранение метаданных в SQLite или MySQL. Существует параметр <code translate="no">backend_url</code> (в конфигурационном файле <code translate="no">server_config.yaml</code>), с помощью которого вы можете указать, использовать ли SQLite или MySQL для управления метаданными.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>Если используется SQLite, то после запуска Milvus в каталоге данных (определенном в <code translate="no">primary_path</code> конфигурационного файла <code translate="no">server_config.yaml</code>) будет создан файл <code translate="no">meta.sqlite</code>. Чтобы просмотреть этот файл, достаточно установить клиент SQLite.</p>
<p>Установите SQLite3 из командной строки:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>Затем войдите в каталог данных Milvus и откройте метафайл с помощью SQLite3:</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>Теперь вы уже вошли в командную строку клиента SQLite. Просто выполните несколько команд, чтобы посмотреть, что находится в метаданных.</p>
<p>Чтобы сделать печатные результаты более удобными для восприятия человеком:</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>Для запроса таблиц и файлов TableFiles с помощью операторов SQL (без учета регистра):</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>Если вы используете MySQL, вам необходимо указать адрес службы MySQL в <code translate="no">backend_url</code> конфигурационного файла <code translate="no">server_config.yaml</code>.</p>
<p>Например, следующие настройки указывают на то, что служба MySQL развернута локально, с портом '3306', именем пользователя 'root', паролем '123456' и именем базы данных 'milvus':</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Прежде всего, установите клиент MySQL:</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>После запуска Milvus в службе MySQL, указанной по адресу <code translate="no">backend_url</code>, будут созданы две таблицы (Tables и TableFiles).</p>
<p>Используйте следующую команду для подключения к сервису MySQL:</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>Теперь вы можете использовать операторы SQL для запроса информации о метаданных:</p>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Управление данными в векторной поисковой системе огромного масштаба</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Управление метаданными в Milvus (2): Поля в таблице метаданных</a></li>
</ul>
