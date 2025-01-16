---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: 'Узнайте о том, как просматривать метаданные в базе данных векторов Milvus.'
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Управление метаданными в Milvus (1)</custom-h1><p>Мы представили некоторую информацию о метаданных в статье <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Управление данными в векторной поисковой системе Massive-Scale</a>. Эта статья в основном показывает, как просматривать метаданные Milvus.</p>
<p>Milvus поддерживает хранение метаданных в SQLite или MySQL. Существует параметр <code translate="no">backend_url</code> (в конфигурационном файле <code translate="no">server_config.yaml</code>), с помощью которого вы можете указать, использовать ли SQLite или MySQL для управления метаданными.</p>
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
    </button></h2><p>Если используется SQLite, то после запуска Milvus в каталоге данных (определенном в <code translate="no">primary_path</code> конфигурационного файла <code translate="no">server_config.yaml</code>) будет создан файл <code translate="no">meta.sqlite</code>. Чтобы просмотреть этот файл, достаточно установить клиент SQLite.</p>
<p>Установите SQLite3 из командной строки:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>Затем войдите в каталог данных Milvus и откройте метафайл с помощью SQLite3:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>Теперь вы уже вошли в командную строку клиента SQLite. Просто выполните несколько команд, чтобы посмотреть, что находится в метаданных.</p>
<p>Чтобы сделать печатные результаты более удобными для восприятия человеком:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>Для запроса таблиц и файлов TableFiles с помощью операторов SQL (без учета регистра):</p>
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
    </button></h2><p>Если вы используете MySQL, вам необходимо указать адрес службы MySQL в <code translate="no">backend_url</code> конфигурационного файла <code translate="no">server_config.yaml</code>.</p>
<p>Например, следующие настройки указывают на то, что служба MySQL развернута локально, с портом '3306', именем пользователя 'root', паролем '123456' и именем базы данных 'milvus':</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>Прежде всего, установите клиент MySQL:</p>
<p>sudo apt-get install default-mysql-client</p>
<p>После запуска Milvus в службе MySQL, указанной по адресу <code translate="no">backend_url</code>, будут созданы две таблицы (Tables и TableFiles).</p>
<p>Используйте следующую команду для подключения к сервису MySQL:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>Теперь вы можете использовать операторы SQL для запроса информации о метаданных:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Что будет дальше<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>В следующих статьях мы подробно рассмотрим схему таблиц метаданных. Оставайтесь с нами!</p>
<p>Если у вас есть вопросы, присоединяйтесь к нашему <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack-каналу</a> или напишите проблему в репо.</p>
<p>Репо на GitHub: https://github.com/milvus-io/milvus</p>
<p>Если вам понравилась эта статья или вы нашли ее полезной, не забудьте похлопать!</p>
