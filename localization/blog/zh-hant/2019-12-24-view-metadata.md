---
id: 2019-12-24-view-metadata.md
title: Milvus 元資料管理 (1) 如何檢視元資料
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: Milvus 支援以 SQLite 或 MySQL 儲存 metadata。本文章將介紹如何使用 SQLite 和 MySQL 檢視元資料。
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Milvus 元資料管理 (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">如何檢視元資料<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>作者：莫毅華</p>
<p>日期：2019-12-24</p>
</blockquote>
<p>在《<a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive-Scale Vector Search Engine</a>》中，我們介紹了一些關於元資料的資訊。本文主要介紹如何查看 Milvus 的元資料。</p>
<p>Milvus 支持将元数据存储在 SQLite 或 MySQL 中。有一個參數<code translate="no">backend_url</code> (在設定檔<code translate="no">server_config.yaml</code>)，你可以指定使用 SQLite 或 MySQL 來管理你的 metadata。</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>如果使用 SQLite，在 Milvus 啟動之後會在資料目錄（在配置檔<code translate="no">server_config.yaml</code> 的<code translate="no">primary_path</code> 中定義）中產生一個<code translate="no">meta.sqlite</code> 檔案。要檢視該檔案，您只需安裝 SQLite 用戶端。</p>
<p>從命令列安裝 SQLite3：</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>然後進入 Milvus 資料目錄，使用 SQLite3 開啟 meta 檔案：</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>現在，您已經進入 SQLite 客戶端命令列。只要使用幾個指令，就可以看到元資料中的內容。</p>
<p>為了讓列印出來的結果排版更方便人類閱讀：</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>要使用 SQL 語句 (不區分大小寫) 查詢表和 TableFile：</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>如果使用 MySQL，需要在配置文件<code translate="no">server_config.yaml</code> 的<code translate="no">backend_url</code> 中指定 MySQL 服務的位址。</p>
<p>例如，以下設定表示 MySQL 服務部署在本機，連接埠為 '3306「，使用者名稱為 」root「，密碼為 」123456「，資料庫名稱為 」milvus'：</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>首先安裝 MySQL 用戶端：</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>當 Milvus 啟動後，會在<code translate="no">backend_url</code> 指定的 MySQL 服務中建立兩個資料表（Tables 和 TableFiles）。</p>
<p>使用下列指令連線到 MySQL 服務：</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>現在，您可以使用 SQL 語句來查詢 metadata 資訊：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png" alt="mysql" class="doc-image" id="mysql" />
   </span> <span class="img-wrapper"> <span>mysql</span> </span></p>
<h2 id="相关博客" class="common-anchor-header">相關博客<button data-href="#相关博客" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">在大規模向量搜尋引擎中管理資料</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus Metadata Management (2)：元資料表中的欄位</a></li>
</ul>
