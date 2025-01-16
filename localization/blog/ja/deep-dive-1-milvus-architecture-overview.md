---
id: deep-dive-1-milvus-architecture-overview.md
title: スケーラブルな類似検索のためのベクターデータベースの構築
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: 最も人気のあるオープンソースのベクター・データベース構築の背後にある思考プロセスと設計原理を詳しく見ていくブログ・シリーズの第1弾。
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>カバー画像</span> </span></p>
<blockquote>
<p>この記事はXiaofan Luanによって書かれ、Angela NiとClaire Yuによって翻訳されました。</p>
</blockquote>
<p><a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">統計に</a>よると、世界のデータの約80％〜90％は非構造化データである。インターネットの急成長に後押しされ、今後数年間は非構造化データの爆発的増加が予想される。その結果、企業はこのようなデータをよりよく扱い、理解するための強力なデータベースを緊急に必要としている。しかし、データベースの開発は「言うは易く行うは難し」である。この記事では、スケーラブルな類似検索のためのオープンソースでクラウドネイティブなベクトルデータベースであるMilvusを構築するための思考プロセスと設計原則を共有することを目的としている。また、Milvusのアーキテクチャについても詳しく説明する。</p>
<p>ジャンプする</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">非構造化データは完全な基本ソフトウェア・スタックを必要とする</a><ul>
<li><a href="#Vectors-and-scalars">ベクトルとスカラー</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">ベクトル検索エンジンからベクトルデータベースへ</a></li>
<li><a href="#A-cloud-native-first-approach">クラウドネイティブファーストのアプローチ</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Milvus 2.0の設計原則</a><ul>
<li><a href="#Log-as-data">データとしてのログ</a></li>
<li><a href="#Duality-of-table-and-log">テーブルとログの二重性</a></li>
<li><a href="#Log-persistency">ログの永続性</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">スケーラブルな類似検索のためのベクトルデータベースの構築</a><ul>
<li><a href="#Standalone-and-cluster">スタンドアロンとクラスタ</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvusアーキテクチャの骨組み</a></li>
<li><a href="#Data-Model">データモデル</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">非構造化データには完全な基本ソフトウェアスタックが必要<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>インターネットの成長と進化に伴い、電子メール、論文、IoTセンサーデータ、フェイスブックの写真、タンパク質の構造など、非構造化データがますます一般的になってきた。コンピュータが非構造化データを理解し処理するために、これらは<a href="https://zilliz.com/learn/embedding-generation">埋め込み技術を使って</a>ベクトルに変換される。</p>
<p>milvusはこれらのベクトルを保存し、インデックス化し、類似距離を計算することで2つのベクトル間の相関を分析する。2つの埋め込みベクトルが非常に類似している場合、元のデータソースも類似していることを意味する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>非構造化データ処理のワークフロー</span>。 </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">ベクトルとスカラー</h3><p>スカラーは、1つの測定値（大きさ）のみで記述される量である。スカラーは数値で表すことができる。例えば、車が時速80kmで走っているとする。ここで、速度（80km/h）はスカラーである。一方、ベクトルは、大きさと方向という少なくとも2つの測定値で記述される量である。車が時速80kmで西に向かって走っている場合、ここで速度（時速80km西）はベクトルである。下の画像は、一般的なスカラーとベクトルの例である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>スカラーとベクトル</span> </span></p>
<p>ほとんどの重要なデータには複数の属性があるため、ベクトルに変換することでこれらのデータをよりよく理解することができる。ベクトル・データを操作する一般的な方法の1つは、ユークリッド距離、内積、谷本距離、ハミング距離などの<a href="https://milvus.io/docs/v2.0.x/metric.md">指標を使って</a>ベクトル間の距離を計算することです。距離が近いほど、ベクトルは類似していることになる。膨大なベクトルデータセットを効率的にクエリするには、ベクトルデータにインデックスを作成して整理する。データセットにインデックスを付けると、入力クエリに類似したベクトルを含む可能性の高いクラスタ、つまりデータの部分集合にクエリをルーティングすることができる。</p>
<p>インデックスの詳細については、「<a href="https://milvus.io/docs/v2.0.x/index.md">ベクトル・インデックス</a>」を参照してください。</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">ベクトル検索エンジンからベクトルデータベースへ</h3><p>Milvus2.0は当初から検索エンジンとしてだけでなく、強力なベクトルデータベースとしても機能するように設計されています。</p>
<p><a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDBと</a> <a href="https://www.mysql.com/">MySQL</a>、あるいは<a href="https://lucene.apache.org/">Luceneと</a> <a href="https://www.elastic.co/">Elasticsearchを</a>類推することで、この違いを理解することができます。</p>
<p>MySQLやElasticsearchのように、Milvusも<a href="https://github.com/facebookresearch/faiss">Faiss</a>、<a href="https://github.com/nmslib/hnswlib">HNSW</a>、<a href="https://github.com/spotify/annoy">Annoyといった</a>オープンソースのライブラリの上に構築されており、これらのライブラリは検索機能の提供や検索パフォーマンスの確保に重点を置いている。しかし、MilvusをFaissの単なるレイヤーに貶めるのは不当であろう。Milvusはベクトルを保存し、検索し、分析し、他のデータベースと同様にCRUD操作のための標準的なインターフェースも提供している。さらに、Milvusは以下のような機能も備えている：</p>
<ul>
<li>シャーディングとパーティショニング</li>
<li>レプリケーション</li>
<li>ディザスタリカバリ</li>
<li>ロードバランス</li>
<li>クエリパーサまたはオプティマイザ</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>ベクター・データベース</span> </span></p>
<p>ベクター・データベースとは何かについてのより包括的な理解については、<a href="https://zilliz.com/learn/what-is-vector-database">こちらの</a>ブログを参照されたい。</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">クラウド・ネイティブな最初のアプローチ</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>Could-nativeアプローチ</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">シェアード・ナッシングからシェアード・ストレージ、そしてシェアード・シングへ</h4><p>従来のデータベースは、分散システムのノードが独立しているがネットワークで接続されている「シェアード・ナッシング」アーキテクチャを採用していた。ノード間でメモリやストレージは共有されない。しかし、<a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflakeは</a>、コンピュート（クエリ処理）とストレージ（データベースストレージ）を分離した「共有ストレージ」アーキテクチャを導入し、業界に革命をもたらした。共有ストレージアーキテクチャにより、データベースはより高い可用性、スケーラビリティ、データの重複の削減を実現することができる。Snowflakeに触発され、多くの企業がデータの永続化のためにクラウドベースのインフラを活用する一方で、キャッシュのためにローカルストレージを使用し始めた。このタイプのデータベースアーキテクチャーは "シェアード・サムシング "と呼ばれ、今日ほとんどのアプリケーションで主流となっている。</p>
<p>Milvusは、"shared something "アーキテクチャとは別に、Kubernetesを使って実行エンジンを管理し、マイクロサービスで読み取り、書き込み、その他のサービスを分離することで、各コンポーネントの柔軟なスケーリングをサポートしている。</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">サービスとしてのデータベース（DBaaS）</h4><p>データベース・アズ・ア・サービスは、多くのユーザーが通常のデータベース機能に関心を持つだけでなく、より多様なサービスに憧れていることから、ホットなトレンドとなっている。これは、従来のCRUD操作とは別に、データベース管理、データ転送、チャージ、可視化など、データベースが提供できるサービスの種類を充実させなければならないことを意味します。</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">より広範なオープンソースのエコシステムとの相乗効果</h4><p>データベース開発におけるもうひとつのトレンドは、データベースと他のクラウドネイティブなインフラとのシナジーを活用することだ。Milvusの場合、いくつかのオープンソースシステムに依存している。例えば、Milvusはメタデータの保存に<a href="https://etcd.io/">etcdを</a>使用している。また、マイクロサービス・アーキテクチャで使用される非同期サービス間通信の一種であるメッセージキューも採用しており、インクリメンタルなデータのエクスポートに役立っている。</p>
<p>将来的には、<a href="https://spark.apache.org/">Sparkや</a> <a href="https://www.tensorflow.org/">Tensorflowの</a>ようなAIインフラストラクチャの上にMilvusを構築し、Milvusをストリーミングエンジンと統合することで、Milvusユーザーの様々なニーズを満たすために、ストリーム処理とバッチ処理を統合的にサポートできるようにしたいと考えています。</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Milvus2.0の設計方針<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0は、次世代のクラウドネイティブベクターデータベースとして、以下の3つの原則に基づいて構築されています。</p>
<h3 id="Log-as-data" class="common-anchor-header">データとしてのログ</h3><p>データベースのログは、データに加えられたすべての変更を連続的に記録します。下図のように、左から「古いデータ」、「新しいデータ」となる。そして、ログは時間順に並んでいる。Milvusにはグローバルタイマーという仕組みがあり、グローバルに一意なタイムスタンプが自動的に付与されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>ログ</span> </span></p>
<p>Milvus2.0では、ログブローカーがシステムのバックボーンとして機能します。すべてのデータの挿入および更新操作はログブローカーを経由しなければならず、ワーカーノードはログを購読および消費することでCRUD操作を実行します。</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">テーブルとログの二重性</h3><p>テーブルもログもデータであり、2つの異なる形態に過ぎない。テーブルは境界のあるデータであり、ログは境界のないデータである。ログはテーブルに変換できる。Milvusの場合、TimeTickの処理ウィンドウを使ってログを集約する。ログのシーケンスに基づいて、複数のログはログスナップショットと呼ばれる1つの小さなファイルに集約される。そして、これらのログスナップショットは、ロードバランスのために個別に使用することができるセグメントを形成するために結合される。</p>
<h3 id="Log-persistency" class="common-anchor-header">ログの永続性</h3><p>ログの永続性は、多くのデータベースが直面する厄介な問題の一つです。分散システムにおけるログの保存は、通常レプリケーションアルゴリズムに依存する。</p>
<p><a href="https://aws.amazon.com/rds/aurora/">Aurora</a>、<a href="https://hbase.apache.org/">HBase</a>、<a href="https://www.cockroachlabs.com/">Cockroach DB</a>、<a href="https://en.pingcap.com/">TiDBなどの</a>データベースとは異なり、milvusは画期的なアプローチをとり、ログの保存と永続化のためにパブリッシュサブスクライブ（pub/sub）システムを導入している。pub/subシステムは、<a href="https://kafka.apache.org/">Kafkaや</a> <a href="https://pulsar.apache.org/">Pulsarの</a>メッセージキューに似ている。システム内のすべてのノードがログを消費できる。Milvusでは、この種のシステムはログブローカーと呼ばれる。ログブローカーのおかげで、ログはサーバーから切り離され、Milvus自体がステートレスであることを保証し、システム障害から迅速に回復するためのより良い位置を確保します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>ログブローカー</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">スケーラブルな類似検索のためのベクトルデータベースの構築<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、Faiss、ANNOY、HNSWなどの一般的なベクトル検索ライブラリの上に構築されており、数百万、数十億、数兆のベクトルを含む高密度ベクトルデータセットの類似性検索用に設計されています。</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">スタンドアロンとクラスタ</h3><p>Milvusには、スタンドアロンとクラスタの2つの導入方法がある。Milvusスタンドアロンでは、すべてのノードが一緒に配置されているため、Milvusを1つのプロセスとして見ることができる。現在、Milvusスタンドアロンでは、データの永続化とメタデータの保存をMinIOとetcdに依存しています。将来のリリースでは、Milvusシステムのシンプルさを確保するために、これら2つのサードパーティ依存を排除したいと考えています。Milvusクラスタには8つのマイクロサービスコンポーネントと3つのサードパーティ依存関係があります：MinIO、etcd、Pulsarです。Pulsarはログ・ブローカーとして機能し、ログ・パブ／サブ・サービスを提供する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>スタンドアロンとクラスタ</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Milvusアーキテクチャの骨組み</h3><p>Milvusは、データ・フローと制御フローを分離し、スケーラビリティとディザスタ・リカバリの点で独立した4つのレイヤに分かれている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvusアーキテクチャ</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">アクセス層</h4><p>アクセスレイヤーはシステムの顔として、クライアント接続のエンドポイントを外部に公開します。クライアント接続の処理、静的検証、ユーザーリクエストの基本的な動的チェック、リクエストの転送、結果の収集とクライアントへの返送を担当する。プロキシ自体はステートレスで、ロードバランシングコンポーネント（Nginx、Kubernetess Ingress、NodePort、LVS）を通じて、統一されたアクセスアドレスとサービスを外部に提供する。Milvusは超並列処理（MPP）アーキテクチャを採用しており、プロキシはワーカーノードから収集した結果をグローバルアグリゲーションと後処理の後に返す。</p>
<h4 id="Coordinator-service" class="common-anchor-header">コーディネータサービス</h4><p>コーディネータサービスはシステムの頭脳であり、クラスタトポロジーのノード管理、負荷分散、タイムスタンプ生成、データ宣言、データ管理を担当する。各コーディネータサービスの機能の詳細については、<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">Milvus技術ドキュメントを</a>ご参照ください。</p>
<h4 id="Worker-nodes" class="common-anchor-header">ワーカーノード</h4><p>ワーカーノード（実行ノード）はシステムの手足となり、コーディネータサービスが発行する命令やプロキシが起動するデータ操作言語（DML）コマンドを実行します。Milvusのワーカーノードは<a href="https://hadoop.apache.org/">Hadoopの</a>データノードやHBaseのリージョンサーバに似ています。ワーカーノードの各タイプはコーディネートサービスに対応しています。各ワーカノードの機能の詳細については、<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">Milvus技術ドキュメントを</a>参照してください。</p>
<h4 id="Storage" class="common-anchor-header">ストレージ</h4><p>ストレージはMilvusの要であり、データの永続化を担う。ストレージレイヤーは3つのパートに分かれています：</p>
<ul>
<li><strong>メタストア</strong>メタストア: コレクションスキーマ、ノードステータス、メッセージ消費チェックポイントなどのメタデータのスナップショットを保存する。Milvusはこれらの機能をetcdに依存しており、Etcdはサービス登録とヘルスチェックの責任も負う。</li>
<li><strong>ログブローカー：</strong>プレイバックをサポートし、ストリーミングデータの永続化、信頼性の高い非同期クエリの実行、イベント通知、クエリ結果の返送を担当するパブ／サブシステム。ノードがダウンタイム復旧を行う際、ログ・ブローカはログ・ブローカ再生を通じて増分データの整合性を保証します。MilvusクラスタはPulsarをログ・ブローカーとして使い、スタンドアロン・モードはRocksDBを使う。KafkaやPravegaなどのストリーミング・ストレージ・サービスもログ・ブローカーとして使用することができる。</li>
<li><strong>オブジェクト・ストレージ：</strong>ログのスナップショットファイル、スカラー／ベクトルインデックスファイル、中間クエリ処理結果を格納する。Milvusは、<a href="https://aws.amazon.com/s3/">AWS S3や</a> <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blobの</a>ほか、軽量でオープンソースのオブジェクトストレージサービスである<a href="https://min.io/">MinIOを</a>サポートしている。オブジェクトストレージサービスはアクセスレイテンシーが高く、クエリごとの課金が発生するため、Milvusは近日中にメモリ/SSDベースのキャッシュプールとホット/コールドデータ分離をサポートし、パフォーマンス向上とコスト削減を実現する予定です。</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">データモデル</h3><p>データモデルはデータベース内のデータを整理するものです。Milvusでは、すべてのデータはコレクション、シャード、パーティション、セグメント、エンティティごとに整理されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>データモデル 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">コレクション</h4><p>Milvusのコレクションはリレーショナルストレージのテーブルに例えることができます。コレクションはMilvusにおける最大のデータ単位である。</p>
<h4 id="Shard" class="common-anchor-header">シャード</h4><p>データを書き込む際にクラスタの並列計算能力を最大限に活用するために、Milvusのコレクションはデータの書き込み操作を異なるノードに分散させる必要があります。デフォルトでは、1つのコレクションには2つのシャードが含まれます。データセットのボリュームによっては、コレクション内にもっと多くのシャードを持つことができます。Milvusはシャーディングにマスターキーハッシュ法を使用します。</p>
<h4 id="Partition" class="common-anchor-header">パーティション</h4><p>シャードには複数のパーティションもあります。Milvusにおけるパーティションとは、コレクション内で同じラベルが付けられたデータの集合を指します。一般的なパーティショニング方法には、日付、性別、ユーザー年齢などによるパーティショニングがあります。パーティションを作成することで、膨大なデータをパーティションタグでフィルタリングできるため、クエリプロセスにメリットがある。</p>
<p>比較すると、シャーディングはデータを書き込む際のスケーリング機能を重視し、パーティショニングはデータを読み込む際のシステムパフォーマンスを強化する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>データモデル2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">セグメント</h4><p>各パーティション内には、複数の小さなセグメントが存在する。セグメントはmilvusのシステムスケジューリングの最小単位である。セグメントには、成長するセグメントと密封されたセグメントの2種類がある。グローイングセグメントはクエリノードによって登録される。Milvusのユーザーは成長するセグメントにデータを書き込み続けます。成長セグメントのサイズが上限 (デフォルトでは 512 MB) に達すると、システムはこの成長セグメントへの余分なデータの書き込みを禁止し、このセグメントを封印します。インデックスは封印されたセグメント上に構築される。</p>
<p>データにリアルタイムでアクセスするために、システムは成長中のセグメントと封印されたセグメントの両方のデータを読み込む。</p>
<h4 id="Entity" class="common-anchor-header">エンティティ</h4><p>各セグメントには大量のエンティティが含まれる。Milvusにおけるエンティティは、従来のデータベースにおける行に相当する。各エンティティは一意な主キーフィールドを持ち、これは自動生成することもできる。エンティティにはタイムスタンプ（ts）とMilvusの中核であるベクトルフィールドも含まれなければならない。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">ディープダイブシリーズについて<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0の<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">一般提供の正式発表に</a>伴い、Milvusのアーキテクチャとソースコードの詳細な解釈を提供するために、このMilvus Deep Diveブログシリーズを企画しました。このブログシリーズで扱うトピックは以下の通りです：</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvusアーキテクチャの概要</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIとPython SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">データ処理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">データ管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">リアルタイムクエリ</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">スカラー実行エンジン</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QAシステム</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">ベクトル実行エンジン</a></li>
</ul>
