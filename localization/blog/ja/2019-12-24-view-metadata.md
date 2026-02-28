---
id: 2019-12-24-view-metadata.md
title: Milvus Metadata Management (1) How to View Metadata
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  Milvus supports metadata storage in SQLite or MySQL. This post introduces how
  to view metadata With SQLite and MySQL.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Milvus Metadata Management (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">How to View Metadata<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>Author: Yihua Mo</p>
<p>Date: 2019-12-24</p>
</blockquote>
<p>We introduced some information about metadata in <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive-Scale Vector Search Engine</a>. This article mainly shows how to view the metadata of Milvus.</p>
<p>Milvus supports metadata storage in SQLite or MySQL. There’s a parameter <code translate="no">backend_url</code> (in the configuration file <code translate="no">server_config.yaml</code>) by which you can specify if to use SQLite or MySQL to manage your metadata.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>If SQLite is used, a <code translate="no">meta.sqlite</code> file will be generated in the data directory (defined in the <code translate="no">primary_path</code> of the configuration file <code translate="no">server_config.yaml</code>) after Milvus is started. To view the file, you only need to install a SQLite client.</p>
<p>Install SQLite3 from the command line:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>Then enter the Milvus data directory, and open the meta file using SQLite3:</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>Now, you’ve already entered the SQLite client command line. Just use a few commands to see what is in the metadata.</p>
<p>To make the printed results typeset easier for humans to read:</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>To query Tables and TableFiles using SQL statements (case-insensitive):</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
    <span>sqlite3</span>
  </span>
</p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>If you are using MySQL, you need to specify the address of the MySQL service in the <code translate="no">backend_url</code> of the configuration file <code translate="no">server_config.yaml</code>.</p>
<p>For example, the following settings indicate that the MySQL service is deployed locally, with port ‘3306’, user name ‘root’, password ‘123456’, and database name ‘milvus’:</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>First of all, install MySQL client:</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>After Milvus is started, two tables (Tables and TableFiles) will be created in the MySQL service specified by <code translate="no">backend_url</code>.</p>
<p>Use the following command to connect to MySQL service:</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>Now, you can use SQL statements to query metadata information:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png" alt="mysql" class="doc-image" id="mysql" />
    <span>mysql</span>
  </span>
</p>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive Scale Vector Search Engine</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus Metadata Management (2): Fields in the Metadata Table</a></li>
</ul>
