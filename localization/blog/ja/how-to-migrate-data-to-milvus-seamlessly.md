---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: Milvusにデータをシームレスに移行する方法：包括的ガイド
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: Elasticsearch、FAISS、Milvus 1.xからMilvus 2.xへのデータ移行に関する包括的なガイドです。
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvusは</a>、<a href="https://zilliz.com/learn/vector-similarity-search">類似検索の</a>ための堅牢なオープンソースのベクトルデータベースであり、数十億から数兆のベクトルデータを最小のレイテンシーで保存、処理、検索することができます。また、高い拡張性、信頼性、クラウドネイティブ、豊富な機能を備えています。<a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvusの最新リリースでは</a>、パフォーマンスを10倍以上高速化する<a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPUサポートや</a>、1台のマシンでより大きなストレージ容量を実現するMMapなど、さらにエキサイティングな機能と改善が導入されています。</p>
<p>2023年9月現在、MilvusはGitHubで約23,000のスターを獲得しており、様々な業種から様々なニーズを持つ数万人のユーザーを抱えています。<a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPTの</a>ようなジェネレーティブAI技術が普及するにつれ、その人気はさらに高まっている。特に、大規模言語モデルの幻覚問題に対処する<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">検索拡張生成</a>フレームワークなど、様々なAIスタックに欠かせないコンポーネントとなっている。</p>
<p>Milvusへの移行を希望する新規ユーザーや、Milvusの最新バージョンへのアップグレードを希望する既存ユーザーからの高まる需要に応えるため、私たちは<a href="https://github.com/zilliztech/milvus-migration">Milvus Migrationを</a>開発しました。本ブログでは、Milvus Migrationの機能をご紹介し、Milvus 1.x、<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>、<a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a>以降からMilvusへの迅速なデータ移行についてご案内いたします。</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration、強力なデータ移行ツール<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migrationは</a>Goで書かれたデータ移行ツールです。Milvus 1.x、FAISS、Elasticsearch 7.0以降の旧バージョンからMilvus 2.xへのシームレスなデータ移行を可能にします。</p>
<p>以下の図は、Milvus Migrationの構築方法とその動作を示しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Milvusマイグレーションによるデータ移行方法</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">Milvus 1.x および FAISS から Milvus 2.x へのデータ移行</h4><p>Milvus 1.xおよびFAISSからのデータ移行では、元のデータファイルの内容を解析し、Milvus 2.xのデータ格納フォーマットに変換し、Milvus SDKの<code translate="no">bulkInsert</code> を使用してデータを書き込みます。このプロセス全体はストリームベースで、理論的にはディスク容量のみに制限され、データファイルはローカルディスク、S3、OSS、GCP、Minioに保存される。</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Elasticsearch から Milvus 2.x への移行</h4><p>Elasticsearch からのデータ移行では、データの取得方法が異なります。データはファイルから取得されるのではなく、Elasticsearch の scroll API を使って順次取得されます。その後、データはパースされ、Milvus 2.xストレージフォーマットに変換され、<code translate="no">bulkInsert</code> を使って書き込まれます。Elasticsearch に保存されている<code translate="no">dense_vector</code> 型のベクターの移行に加え、Milvus Migration は long、integer、short、boolean、keyword、text、double を含む他のフィールド型の移行もサポートしています。</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Milvusマイグレーションの機能セット</h3><p>Milvusマイグレーションは、堅牢な機能セットによりマイグレーションプロセスを簡素化します：</p>
<ul>
<li><p><strong>サポートされるデータソース</strong></p>
<ul>
<li><p>対応データソース： Milvus 1.x から Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0以降からMilvus 2.xへ</p></li>
<li><p>FAISSからMilvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>複数の対話モード</strong></p>
<ul>
<li><p>Cobraフレームワークを使用したコマンドラインインターフェース（CLI）</p></li>
<li><p>Swagger UIを組み込んだレストフルAPI</p></li>
<li><p>他のツールにGoモジュールとして統合</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>多彩なファイルフォーマットのサポート</strong></p>
<ul>
<li><p>ローカルファイル</p></li>
<li><p>Amazon S3</p></li>
<li><p>オブジェクトストレージサービス（OSS）</p></li>
<li><p>Google Cloud Platform (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>柔軟なElasticsearchとの統合：</strong></p>
<ul>
<li><p>Elasticsearch からの<code translate="no">dense_vector</code> 型ベクトルの移行</p></li>
<li><p>long、integer、short、boolean、keyword、text、doubleなど他のフィールド型の移行をサポート</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">インターフェース定義</h3><p>Milvusマイグレーションは以下の主要なインターフェースを提供します：</p>
<ul>
<li><p><code translate="no">/start</code>:マイグレーションジョブの開始（ダンプとロードの組み合わせに相当。）</p></li>
<li><p><code translate="no">/dump</code>:ダンプジョブの開始(移行元データを移行先のストレージメディアに書き込む)</p></li>
<li><p><code translate="no">/load</code>:ロードジョブの開始(移行先記憶媒体からMilvus 2.xへのデータ書き込み)</p></li>
<li><p><code translate="no">/get_job</code>:ジョブの実行結果を表示します。(詳細は<a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">プロジェクトのserver.goを</a>参照)</p></li>
</ul>
<p>次に、このセクションでMilvus Migrationの使い方を探るために、いくつかのサンプルデータを使ってみましょう。これらの例は GitHub<a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">に</a>あります。</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Elasticsearch から Milvus 2.x へのマイグレーション<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Elasticsearch データの準備</li>
</ol>
<p><a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch の</a>データを<a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">移行</a>するには、Elasticsearch サーバーをセットアップしておく必要があります。<code translate="no">dense_vector</code> フィールドにベクトルデータを格納し、他のフィールドでインデックスを作成する必要があります。インデックスのマッピングは以下の通りです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>コンパイルとビルド</li>
</ol>
<p>まず、Milvusマイグレーションの<a href="https://github.com/zilliztech/milvus-migration">ソースコードをGitHubから</a>ダウンロードします。次に、以下のコマンドを実行してコンパイルします。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>このステップにより、<code translate="no">milvus-migration</code> という名前の実行ファイルが生成されます。</p>
<ol start="3">
<li>設定<code translate="no">migration.yaml</code></li>
</ol>
<p>マイグレーションを開始する前に、データソース、ターゲット、およびその他の関連する設定に関する情報を含む<code translate="no">migration.yaml</code> という名前の設定ファイルを準備する必要があります。以下に構成例を示します：</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>設定ファイルの詳細については、GitHubの<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">このページを</a>参照してください。</p>
<ol start="4">
<li>移行ジョブの実行</li>
</ol>
<p><code translate="no">migration.yaml</code> ファイルの設定が完了したら、次のコマンドを実行して移行タスクを開始できます：</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>ログ出力を観察してください。以下のようなログが表示されたら、移行が成功したことを意味します。</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Milvusマイグレーションでは、コマンドラインアプローチに加えて、Restful APIを使用したマイグレーションもサポートしています。</p>
<p>Restful APIを使用するには、以下のコマンドを使用してAPIサーバを起動します：</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>サービスが実行されると、APIを呼び出してマイグレーションを開始することができます。</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>マイグレーションが完了すると、オールインワンのベクトルデータベース管理ツールである<a href="https://zilliz.com/attu">Attuを</a>使用して、マイグレーションに成功した行の総数を表示したり、その他のコレクション関連の操作を実行したりすることができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>Attuインターフェース</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Milvus 1.x から Milvus 2.x へのマイグレーション<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Milvus 1.x データの準備</li>
</ol>
<p>移行プロセスを素早く体験できるように、Milvus Migrationのソースコードに10,000件のMilvus 1.x<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">テストデータレコードを</a>用意しました。しかし、実際のケースでは、マイグレーションプロセスを開始する前に、Milvus 1.xインスタンスから独自の<code translate="no">meta.json</code> ファイルをエクスポートする必要があります。</p>
<ul>
<li>以下のコマンドでデータをエクスポートすることができます。</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>以下のことを確認してください：</p>
<ul>
<li><p>プレースホルダを実際のMySQL認証情報に置き換えてください。</p></li>
<li><p>このエクスポートを実行する前に、Milvus 1.xサーバを停止するか、データの書き込みを停止してください。</p></li>
<li><p>Milvus<code translate="no">tables</code> フォルダと<code translate="no">meta.json</code> ファイルを同じディレクトリにコピーします。</p></li>
</ul>
<p><strong>注意:</strong>Milvus 2.xを<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（Milvusのフルマネージドサービス）でご利用の場合、Cloud Consoleを使用して移行を開始することができます。</p>
<ol start="2">
<li>コンパイルとビルド</li>
</ol>
<p>まず、Milvusマイグレーションの<a href="https://github.com/zilliztech/milvus-migration">ソースコードをGitHubから</a>ダウンロードします。次に、以下のコマンドを実行してコンパイルします。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>このステップにより、<code translate="no">milvus-migration</code> という名前の実行ファイルが生成されます。</p>
<ol start="3">
<li>設定<code translate="no">migration.yaml</code></li>
</ol>
<p><code translate="no">migration.yaml</code> 、ソース、ターゲット、その他関連する設定の詳細を指定した設定ファイルを準備します。以下にコンフィギュレーションの例を示す：</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>設定ファイルの詳細については、GitHubの<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">このページを</a>参照してください。</p>
<ol start="4">
<li>移行ジョブの実行</li>
</ol>
<p>移行を完了するには、<code translate="no">dump</code> と<code translate="no">load</code> コマンドを個別に実行する必要があります。これらのコマンドはデータを変換し、Milvus 2.xにインポートします。</p>
<p><strong>注:</strong>近日中にこのステップを簡略化し、1つのコマンドだけで移行を完了できるようにする予定です。ご期待ください。</p>
<p><strong>ダンプ コマンド</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>ロードコマンド</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>移行後、Milvus 2.xで生成されるコレクションには2つのフィールドが含まれます:<code translate="no">id</code> と<code translate="no">data</code>. ベクターデータベースのオールインワン管理ツール<a href="https://zilliz.com/attu">Attuを</a>使用して詳細を見ることができます。</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">FAISS から Milvus 2.x への移行<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>FAISSデータの準備</li>
</ol>
<p>Elasticsearch のデータを移行するには、FAISS のデータを準備する必要があります。移行プロセスを素早く体験できるように、Milvus Migrationのソースコードに<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">FAISSのテストデータを入れて</a>います。</p>
<ol start="2">
<li>コンパイルとビルド</li>
</ol>
<p>まず、<a href="https://github.com/zilliztech/milvus-migration">GitHubから</a>Milvus Migrationの<a href="https://github.com/zilliztech/milvus-migration">ソースコードを</a>ダウンロードします。次に、以下のコマンドを実行してコンパイルします。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>このステップにより、<code translate="no">milvus-migration</code> という名前の実行ファイルが生成されます。</p>
<ol start="3">
<li>設定<code translate="no">migration.yaml</code></li>
</ol>
<p>FAISSマイグレーション用の設定ファイル（<code translate="no">migration.yaml</code> ）を用意し、マイグレーション元、マイグレーション先、その他関連する設定の詳細を指定します。以下に設定例を示す：</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>設定ファイルの詳細については、GitHubの<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">こちらのページを</a>参照してください。</p>
<ol start="4">
<li>マイグレーションジョブの実行</li>
</ol>
<p>Milvus1.xからMilvus2.xへのマイグレーションと同様に、FAISSマイグレーションでも<code translate="no">dump</code> と<code translate="no">load</code> のコマンドを実行する必要があります。これらのコマンドはデータを変換し、Milvus 2.xにインポートします。</p>
<p><strong>注：</strong>近日中にこのステップを簡略化し、1つのコマンドだけで移行を完了できるようにする予定です。ご期待ください。</p>
<p><strong>ダンプ コマンド</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>ロードコマンド</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://zilliz.com/attu">Attu</a>（オールインワンベクターデータベース管理ツール）を使用することで、より詳細な情報を見ることができます。</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">今後の移行計画にご期待ください<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>今後、より多くのデータソースからのマイグレーションをサポートし、以下のようなマイグレーション機能を追加していきます：</p>
<ul>
<li><p>Redisからmilvusへのマイグレーションをサポートします。</p></li>
<li><p>MongoDBからMilvusへのマイグレーションをサポートします。</p></li>
<li><p>再開可能なマイグレーションをサポート</p></li>
<li><p>ダンプとロードのプロセスを1つに統合することで、マイグレーションコマンドを簡素化。</p></li>
<li><p>他の主流データソースからMilvusへのマイグレーションをサポートする。</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusの最新リリースであるMilvus 2.3は、データ管理のニーズの高まりに応えるエキサイティングな新機能とパフォーマンスの改善をもたらします。Milvus 2.xにデータを移行することで、これらの利点を引き出すことができ、Milvus移行プロジェクトは移行プロセスを合理的かつ容易にします。Milvus移行プロジェクトは、移行プロセスを合理的かつ容易にします。</p>
<p><em><strong>注：</strong>このブログの情報は、2023年9月現在のMilvusおよび<a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>プロジェクトの状況に基づいています。最新の情報や手順については、<a href="https://milvus.io/docs">Milvusの</a>公式<a href="https://milvus.io/docs">ドキュメントを</a>ご確認ください。</em></p>
