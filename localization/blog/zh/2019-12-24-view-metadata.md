---
id: 2019-12-24-view-metadata.md
title: Milvus 元数据管理 (1) 如何查看元数据
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: Milvus 支持将元数据存储在 SQLite 或 MySQL 中。本文章将介绍如何使用 SQLite 和 MySQL 查看元数据。
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Milvus 元数据管理 (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">如何查看元数据<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>作者：莫益华莫一华</p>
<p>日期： 2019-12-24</p>
</blockquote>
<p>我们在《<a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">大规模向量搜索引擎中的数据管理</a>》中介绍了一些关于元数据的信息。本文主要介绍如何查看 Milvus 的元数据。</p>
<p>Milvus 支持将元数据存储在 SQLite 或 MySQL 中。有一个参数<code translate="no">backend_url</code> （在配置文件<code translate="no">server_config.yaml</code> 中）可以用来指定使用 SQLite 还是 MySQL 来管理元数据。</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>如果使用 SQLite，在启动 Milvus 后，数据目录（在配置文件<code translate="no">server_config.yaml</code> 的<code translate="no">primary_path</code> 中定义）中将生成一个<code translate="no">meta.sqlite</code> 文件。要查看该文件，只需安装 SQLite 客户端。</p>
<p>从命令行安装 SQLite3：</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>然后进入 Milvus 数据目录，用 SQLite3 打开元文件：</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>现在，你已经进入了 SQLite 客户端命令行。只需使用几个命令就能查看元数据中的内容。</p>
<p>使打印结果的排版更易于人类阅读：</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>使用 SQL 语句查询表和表文件（不区分大小写）：</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>如果使用 MySQL，则需要在配置文件<code translate="no">server_config.yaml</code> 的<code translate="no">backend_url</code> 中指定 MySQL 服务的地址。</p>
<p>例如，以下设置表明 MySQL 服务部署在本地，端口为 "3306"，用户名为 "root"，密码为 "123456"，数据库名称为 "milvus"：</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>首先，安装 MySQL 客户端：</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>启动 Milvus 后，将在<code translate="no">backend_url</code> 指定的 MySQL 服务中创建两个表（Tables 和 TableFiles）。</p>
<p>使用以下命令连接到 MySQL 服务：</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>现在，你可以使用 SQL 语句查询元数据信息：</p>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">在大规模向量搜索引擎中管理数据</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus 元数据管理 (2)：元数据表中的字段</a></li>
</ul>
