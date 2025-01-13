---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: Milvusベクターデータベースのメタデータの見方について学ぶ。
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Milvusのメタデータ管理 (1)</custom-h1><p><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">大規模ベクトル検索エンジンのデータ管理で</a>メタデータについて紹介しました。今回は主にMilvusのメタデータの見方について説明します。</p>
<p>MilvusはSQLiteまたはMySQLでのメタデータの保存をサポートしています。メタデータの管理にSQLiteを使うかMySQLを使うかは、<code translate="no">backend_url</code> （設定ファイル<code translate="no">server_config.yaml</code> ）というパラメータで指定できます。</p>
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
    </button></h2><p>SQLiteを使用する場合、Milvusの起動後、データディレクトリ(設定ファイル<code translate="no">server_config.yaml</code> の<code translate="no">primary_path</code> で定義)に<code translate="no">meta.sqlite</code> ファイルが生成されます。このファイルを表示するには、SQLiteクライアントをインストールするだけです。</p>
<p>コマンドラインからSQLite3をインストールしてください：</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>次にMilvusのデータディレクトリに入り、SQLite3を使ってmetaファイルを開く：</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>これでSQLiteクライアントのコマンドラインは入力済みである。いくつかのコマンドを使ってメタデータの中身を見るだけである。</p>
<p>印刷された結果を人間が読みやすいようにタイプセットする：</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>SQLステートメント（大文字と小文字を区別しない）を使ってテーブルとTableFilesに問い合わせる：</p>
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
    </button></h2><p>MySQL を使用している場合は、設定ファイル<code translate="no">server_config.yaml</code> の<code translate="no">backend_url</code> に MySQL サービスのアドレスを指定する必要があります。</p>
<p>たとえば、以下の設定は、MySQLサービスがローカルに配置され、ポートが「3306」、ユーザー名が「root」、パスワードが「123456」、データベース名が「milvus」であることを示している：</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>まず、MySQLクライアントをインストールする：</p>
<p>sudo apt-get install default-mysql-client</p>
<p>milvusが起動すると、<code translate="no">backend_url</code> で指定したMySQLサービスに2つのテーブル（TablesとTableFiles）が作成される。</p>
<p>以下のコマンドでMySQLサービスに接続する：</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>これで、SQL文を使ってメタデータ情報を問い合わせることができる：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">次の記事<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>次回は、メタデータ・テーブルのスキーマについて詳しく紹介する。ご期待ください！</p>
<p>何か質問があれば、<a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack チャンネルに</a>参加するか、レポに issue を送ってください。</p>
<p>GitHub リポジトリ: https://github.com/milvus-io/milvus</p>
<p>この記事が気に入ったり、役に立ったりしたら、拍手を忘れずに！</p>
