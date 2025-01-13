---
id: 2019-12-24-view-metadata.md
title: Milvusのメタデータ管理 (1) メタデータの見方
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  MilvusはSQLiteまたはMySQLでのメタデータ保存をサポートしています。この記事ではSQLiteとMySQLを使ったメタデータの表示方法を紹介します。
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Milvusメタデータ管理 (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">メタデータの見方<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>著者イーファ・モ</p>
<p>日付: 2019-12-24</p>
</blockquote>
<p><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">大規模ベクトル検索エンジンのデータ管理で</a>メタデータに関する情報を紹介した。今回は主にMilvusのメタデータの見方について紹介します。</p>
<p>MilvusはSQLiteまたはMySQLでのメタデータ保存をサポートしています。メタデータの管理にSQLiteを使うかMySQLを使うかは、<code translate="no">backend_url</code> （設定ファイル<code translate="no">server_config.yaml</code> ）というパラメータで指定できます。</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>SQLiteを使用する場合、Milvusの起動後、データディレクトリ(設定ファイル<code translate="no">server_config.yaml</code> の<code translate="no">primary_path</code> で定義)に<code translate="no">meta.sqlite</code> ファイルが生成されます。このファイルを表示するには、SQLiteクライアントをインストールするだけです。</p>
<p>コマンドラインからSQLite3をインストールしてください：</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>次にMilvusのデータディレクトリに入り、SQLite3を使ってmetaファイルを開く：</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>これでSQLiteクライアントのコマンドラインは入力済みである。いくつかのコマンドを使ってメタデータの中身を見るだけである。</p>
<p>印刷された結果を人間が読みやすいようにタイプセットする：</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>SQLステートメント（大文字と小文字を区別しない）を使ってテーブルとTableFilesに問い合わせる：</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>MySQL を使用している場合は、設定ファイル<code translate="no">server_config.yaml</code> の<code translate="no">backend_url</code> に MySQL サービスのアドレスを指定する必要があります。</p>
<p>たとえば、以下の設定は、MySQLサービスがローカルに配置され、ポートが「3306」、ユーザー名が「root」、パスワードが「123456」、データベース名が「milvus」であることを示している：</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>まず、MySQLクライアントをインストールする：</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>Milvusが起動すると、<code translate="no">backend_url</code> で指定されたMySQLサービスに2つのテーブル（TablesとTableFiles）が作成される。</p>
<p>以下のコマンドでMySQLサービスに接続する：</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>これでSQL文を使ってメタデータ情報を問い合わせることができる：</p>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">大規模ベクトル検索エンジンのデータ管理</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvusのメタデータ管理(2)：メタデータテーブルのフィールド</a></li>
</ul>
