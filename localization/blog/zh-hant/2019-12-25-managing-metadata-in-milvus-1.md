---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: 瞭解如何檢視 Milvus 向量資料庫中的元資料。
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Milvus 元資料管理 (1)</custom-h1><p>我們在《<a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive-Scale Vector Search Engine</a>》中介紹了一些關於元<a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">資料</a>的資訊。本文主要介紹如何檢視 Milvus 的 metadata。</p>
<p>Milvus 支援在 SQLite 或 MySQL 儲存 metadata。有一個參數<code translate="no">backend_url</code> (在設定檔<code translate="no">server_config.yaml</code>)，你可以指定使用 SQLite 或 MySQL 來管理你的 metadata。</p>
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
    </button></h2><p>如果使用 SQLite，在 Milvus 啟動之後會在資料目錄（在配置檔<code translate="no">server_config.yaml</code> 的<code translate="no">primary_path</code> 中定義）中產生一個<code translate="no">meta.sqlite</code> 檔案。要檢視該檔案，您只需安裝 SQLite 用戶端。</p>
<p>從命令列安裝 SQLite3：</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>然後進入 Milvus 資料目錄，使用 SQLite3 開啟 meta 檔案：</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>現在，您已經進入 SQLite 客戶端命令列。只要使用幾個指令，就可以看到元資料中的內容。</p>
<p>為了讓列印出來的結果排版更方便人類閱讀：</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>要使用 SQL 語句查詢表和 TableFile (不區分大小寫)：</p>
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
    </button></h2><p>如果使用 MySQL，需要在配置文件<code translate="no">server_config.yaml</code> 的<code translate="no">backend_url</code> 中指定 MySQL 服務的位址。</p>
<p>例如，以下設定表示 MySQL 服務部署在本機，連接埠為 '3306「，使用者名稱為 」root「，密碼為 」123456「，資料庫名稱為 」milvus'：</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>首先，安裝 MySQL 用戶端：</p>
<p>sudo apt-get install default-mysql-client</p>
<p>在 Milvus 啟動後，會在<code translate="no">backend_url</code> 指定的 MySQL 服務中建立兩個資料表 (Tables 和 TableFiles) 。</p>
<p>使用下列指令連線到 MySQL 服務：</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>現在，您可以使用 SQL 語句來查詢 metadata 資訊：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">下一篇文章<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>下一篇文章將詳細介紹元資料表的結構。敬請期待！</p>
<p>如有任何問題，歡迎加入我們的<a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack 頻道</a>或在 repo 中提交問題。</p>
<p>GitHub repo: https://github.com/milvus-io/milvus</p>
<p>如果您喜歡這篇文章或覺得有用，別忘了拍手！</p>
