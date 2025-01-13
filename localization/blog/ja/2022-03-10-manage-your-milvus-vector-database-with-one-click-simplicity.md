---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Milvusベクターデータベースをワンクリックで簡単に管理できます。
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - Milvus 2.0用のGUIツール。
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<p>原案：<a href="https://github.com/czhen-zilliz">Zhen Chen</a>、トランスクリエーション：<a href="https://github.com/LocoRichard">Lichen Wang</a>。</p>
<p style="font-size: 12px;color: #4c5a67">元の記事を確認するには<a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">ここを</a>クリックしてください。</p> 
<p>非構造化データ処理の需要が急速に高まる中、Milvus 2.0は際立っている。これはAI指向のベクトルデータベースシステムで、大量生産シナリオ向けに設計されている。これらのMilvus SDKやMilvusのコマンドラインインターフェイスであるMilvus CLIとは別に、Milvusをより直感的に操作できるツールはあるのだろうか？答えはYESである。Zilliz社はMilvus専用のグラフィカルユーザインタフェースAttuを発表しました。今回は、Attuを使ったベクトル類似検索の方法を順を追ってご紹介したいと思います。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>Attu島</span> </span></p>
<p>MilvusのCLIが非常にシンプルな操作性であるのに対して、Attuはそれ以上の特徴があります：</p>
<ul>
<li>Windows OS、macOS、Linux OS用のインストーラ；</li>
<li>Milvusをより使いやすくするための直感的なGUI；</li>
<li>Milvusの主要機能をカバー；</li>
<li>カスタマイズされた機能を拡張するプラグイン</li>
<li>Milvusインスタンスの理解と管理を容易にする完全なシステムトポロジー情報。</li>
</ul>
<h2 id="Installation" class="common-anchor-header">インストール<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Attuの最新リリースは<a href="https://github.com/zilliztech/attu/releases">GitHubに</a>あります。Attuは様々なオペレーティングシステム用の実行可能なインストーラを提供しています。Attuはオープンソースプロジェクトであり、皆様からの貢献を歓迎します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>インストール</span> </span></p>
<p>Docker経由でAttuをインストールすることもできます。</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> はAttuが動作する環境のIPアドレス、 はmilvusが動作する環境のIPアドレスです。<code translate="no">milvus server IP</code> </p>
<p>Attuのインストールが完了したら、MilvusのIPとPortを入力してAttuを起動します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>AttuでMilvusを接続する</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">機能概要<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>概要ページ</span> </span></p>
<p>Attuのインターフェースは、<strong>Overview</strong>ページ、<strong>Collection</strong>ページ、<strong>Vector Search</strong>ページ、<strong>System View</strong>ページから構成され、それぞれ左側のナビゲーションペインの4つのアイコンに対応しています。</p>
<p><strong>概要</strong>ページはロードされたコレクションを表示します。一方、<strong>Collection</strong>ページはすべてのコレクションをリストし、それらがロードされているかリリースされているかを示します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>コレクションページ</span> </span></p>
<p><strong>Vector Searchと</strong> <strong>System View</strong>ページはAttuのプラグインです。プラグインのコンセプトと使い方はブログの最終回で紹介します。</p>
<p>Vector<strong>Search</strong>ページでは、ベクトルの類似度検索を行うことができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>ベクトル検索ページ</span> </span></p>
<p><strong>System View</strong>ページでは、Milvusのトポロジー構造を確認することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>システムビューページ</span> </span></p>
<p>また、ノードをクリックすることで、各ノードの詳細情報を確認することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>ノードビュー</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">デモンストレーション<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>テストデータセットを使ってAttuを試してみましょう。</p>
<p>以下のテストで使用するデータセットは<a href="https://github.com/zilliztech/attu/tree/main/examples">GitHubのリポジトリを</a>確認してください。</p>
<p>まず、以下の4つのフィールドを持つ test という名前のコレクションを作成する：</p>
<ul>
<li>フィールド名: id, 主キーフィールド</li>
<li>フィールド名：vector、vectorフィールド、float vector、次元：128</li>
<li>フィールド名：brand、スカラーフィールド、Int64</li>
<li>フィールド名：color、スカラーフィールド、Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>コレクションの作成</span> </span></p>
<p>コレクションが正常に作成された後、検索のためにコレクションをロードする。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>コレクションのロード</span> </span></p>
<p><strong>概要</strong>ページで新しく作成されたコレクションをチェックできます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>コレクションの確認</span> </span></p>
<p>テストデータセットをMilvusにインポートします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>データのインポート</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>データのインポート</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>データのインポート</span> </span></p>
<p>Overview（概要）またはCollection（コレクション）ページでコレクション名をクリックし て、インポートされたデータをチェックするクエリインターフェイスに入る。</p>
<p>フィルタを追加し、式<code translate="no">id != 0</code> を指定し、<strong>Apply Filter を</strong>クリックし、<strong>Query</strong> をクリックします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>クエリデータ</span> </span></p>
<p>エンティティの全 50 エントリが正常にインポートされていることがわかります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>クエリ結果</span> </span></p>
<p>ベクトルの類似性検索を試してみましょう。</p>
<p><code translate="no">search_vectors.csv</code> からベクトルを 1 つコピーし、<strong>Vector Value</strong>フィールドに貼り付けます。コレクションとフィールドを選択します。<strong>Search を</strong>クリックします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>検索データ</span> </span></p>
<p>検索結果が表示されます。スクリプトをコンパイルすることなく、Milvusで簡単に検索することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>検索結果</span> </span></p>
<p>最後に<strong>システムビューの</strong>ページを確認してみましょう。</p>
<p>Milvus Node.js SDKに内包されているMetrics APIを利用することで、システムの状態、ノードの関係、ノードの状態を確認することができます。</p>
<p>Attu独自の機能として、システム概要ページには完全なシステムトポロジカルグラフが含まれています。各ノードをクリックすることで、そのステータスを確認することができます(10秒ごとに更新)。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Milvusノードトポロジカルグラフ</span> </span></p>
<p>各ノードをクリックすると、<strong>ノードリストビューが</strong>表示されます。コーディネートノードのすべての子ノードを確認できます。ソートすることで、CPUやメモリの使用率が高いノードを素早く特定し、システムの問題点を突き止めることができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Milvusノードリスト</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">その他<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>前述の通り、<strong>Vector Searchと</strong> <strong>System View</strong>ページはAttuのプラグインです。Attuでは、ユーザがアプリケーションのシナリオに合わせて独自のプラグインを開発することを推奨しています。ソースコードの中に、プラグインコード専用のフォルダがあります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>プラグイン</span> </span></p>
<p>プラグインの作り方は、どのプラグインを参照しても構いません。以下の設定ファイルを設定することで、Attuにプラグインを追加することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>プラグインをAttuに追加する</span> </span></p>
<p>詳しい手順は<a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repoや</a> <a href="https://milvus.io/docs/v2.0.x/attu.md">Milvus Technical Documentを</a>参照してください。</p>
<p>Attuはオープンソースプロジェクトです。すべての貢献を歓迎します。また、Attuに問題がある場合は、<a href="https://github.com/zilliztech/attu/issues">issueを提出して</a>ください。</p>
<p>AttuによってMilvusをより快適にお使いいただけることを心より願っております。また、Attuを気に入っていただけた場合、または使用方法についてご意見がある場合は、<a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">Attuユーザーアンケートに</a>ご回答いただき、Attuをより良いユーザーエクスペリエンスに最適化するためにお役立てください。</p>
