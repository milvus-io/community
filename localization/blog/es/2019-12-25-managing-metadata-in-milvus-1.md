---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: Learnn about how to view metadata in the Milvus vector database.
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Milvus Metadata Management (1)</custom-h1><p>We introduced some information about metadata in <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive-Scale Vector Search Engine</a>. This article mainly shows how to view the metadata of Milvus.</p>
<p>Milvus supports metadata storage in SQLite or MySQL. There’s a parameter <code translate="no">backend_url</code> (in the configuration file <code translate="no">server_config.yaml</code>) by which you can specify if to use SQLite or MySQL to manage your metadata.</p>
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
    </button></h2><p>If SQLite is used, a <code translate="no">meta.sqlite</code> file will be generated in the data directory (defined in the <code translate="no">primary_path</code> of the configuration file <code translate="no">server_config.yaml</code>) after Milvus is started. To view the file, you only need to install a SQLite client.</p>
<p>Install SQLite3 from the command line:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>Then enter the Milvus data directory, and open the meta file using SQLite3:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>Now, you’ve already entered the SQLite client command line. Just use a few commands to see what is in the metadata.</p>
<p>To make the printed results typeset easier for humans to read:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>To query Tables and TableFiles using SQL statements (case-insensitive):</p>
<pre><code translate="no">SELECT * FROM Tables
SELECT * FROM TableFiles
</code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_use_sql_lite_2418fc1787.png" alt="1-use-sql-lite.png" class="doc-image" id="1-use-sql-lite.png" />
    <span>1-use-sql-lite.png</span>
  </span>
</p>
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
    </button></h2><p>If you are using MySQL, you need to specify the address of the MySQL service in the <code translate="no">backend_url</code> of the configuration file <code translate="no">server_config.yaml</code>.</p>
<p>For example, the following settings indicate that the MySQL service is deployed locally, with port ‘3306’, user name ‘root’, password ‘123456’, and database name ‘milvus’:</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>First of all, install MySQL client:</p>
<p>sudo apt-get install default-mysql-client</p>
<p>After Milvus is started, two tables (Tables and TableFiles) will be created in the MySQL service specified by <code translate="no">backend_url</code>.</p>
<p>Use the following command to connect to MySQL service:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>Now, you can use SQL statements to query metadata information:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
    <span>2-my-sql-view-meta-data.png</span>
  </span>
</p>
<h2 id="What’s-coming-next" class="common-anchor-header">What’s coming next<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Next articles will introduce in details the schema of metadata tables. Stay tuned!</p>
<p>Any questions, welcome to join our <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack channel</a> or file an issue in the repo.</p>
<p>GitHub repo: https://github.com/milvus-io/milvus</p>
<p>If you like this article or find it useful, don’t forget to clap!</p>
