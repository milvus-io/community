---
id: the-developers-guide-to-milvus-configuration.md
title: Milvusコンフィギュレーション開発者ガイド
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Milvusの設定を簡素化するためのガイドです。ベクトルデータベースアプリケーションのパフォーマンスを向上させるために調整すべき主要なパラメータをご覧ください。
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">はじめに<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusを使用している開発者であれば、500以上のパラメータを持つ<code translate="no">milvus.yaml</code> 。ベクターデータベースのパフォーマンスを最適化したいだけなのに、このような複雑さを扱うのは難しいことです。</p>
<p>朗報です：全てのパラメータを理解する必要はありません。このガイドでは、ノイズを排除し、実際にパフォーマンスに影響を与える重要な設定に焦点を当て、特定のユースケースに合わせてどの値を微調整すべきかを正確に強調します。</p>
<p>高速なクエリーを必要とするレコメンデーション・システムを構築する場合にも、コスト制約のあるベクトル検索アプリケーションを最適化する場合にも、どのパラメーターを変更すべきかを、実用的でテスト済みの値を用いて正確に説明します。このガイドが終わる頃には、実際の導入シナリオに基づき、Milvusのコンフィギュレーションをチューニングし、最高のパフォーマンスを実現する方法を知ることができるでしょう。</p>
<h2 id="Configuration-Categories" class="common-anchor-header">設定カテゴリ<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>具体的なパラメータに入る前に、設定ファイルの構造を分解してみましょう。<code translate="no">milvus.yaml</code> で作業する場合、3つのパラメータカテゴリを扱うことになります：</p>
<ul>
<li><p><strong>依存コンポーネント設定</strong>：Milvusが接続する外部サービス (<code translate="no">etcd</code>,<code translate="no">minio</code>,<code translate="no">mq</code>) - クラスタのセットアップとデータ永続化のために重要です。</p></li>
<li><p><strong>内部コンポーネント構成</strong>：Milvusの内部アーキテクチャ(<code translate="no">proxy</code>,<code translate="no">queryNode</code> など) - パフォーマンスチューニングのキーとなる。</p></li>
<li><p><strong>機能構成</strong>：セキュリティ、ロギング、リソース制限 - 本番環境での展開に重要</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Milvus依存コンポーネント設定<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusが依存する外部サービスから始めましょう。これらの設定は、開発から本番環境に移行する際に特に重要です。</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>:メタデータストア</h3><p>Milvusはメタデータの永続化とサービス調整のために<code translate="no">etcd</code> 。以下のパラメータが重要です：</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>:etcd クラスタのアドレスを指定します。デフォルトでは、Milvusはバンドルされたインスタンスを起動しますが、エンタープライズ環境では、より良い可用性と運用管理のためにマネージド<code translate="no">etcd</code> サービスに接続するのがベストプラクティスです。</p></li>
<li><p><code translate="no">etcd.rootPath</code>:Milvus関連データをetcdに格納するためのキープレフィックスを定義します。同じetcdバックエンドで複数のMilvusクラスタを運用している場合、異なるルートパスを使用することでメタデータをきれいに分離することができます。</p></li>
<li><p><code translate="no">etcd.auth</code>:認証クレデンシャルを制御します。Milvusはデフォルトではetcd認証を有効にしませんが、管理するetcdインスタンスで認証が必要な場合はここで指定する必要があります。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>:オブジェクトストレージ</h3><p>名前とは裏腹に、このセクションはすべてのS3互換オブジェクトストレージサービスクライアントを管理します。AWS S3、GCS、Aliyun OSSなどのプロバイダを<code translate="no">cloudProvider</code> 。</p>
<p>以下の4つの主要な設定に注意してください：</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>:オブジェクトストレージサービスのエンドポイントを指定する。</p></li>
<li><p><code translate="no">minio.bucketName</code>:複数のMilvusクラスタを運用する場合、データの衝突を避けるために別々のバケット（または論理接頭辞）を割り当てること。</p></li>
<li><p><code translate="no">minio.rootPath</code>:データの分離のためにバケット内の名前空間を有効にします。</p></li>
<li><p><code translate="no">minio.cloudProvider</code>:OSS バックエンドを識別する。完全な互換性リストについては、<a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">Milvusのドキュメントを</a>参照してください。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>:メッセージキュー</h3><p>Milvusは、Pulsar(デフォルト)またはKafkaのいずれかのメッセージキューを内部イベント伝播に使用します。以下の3つのパラメータに注意してください。</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>:外部Pulsarクラスターを使用するには、これらの値を設定します。</p></li>
<li><p><code translate="no">pulsar.tenant</code>:テナント名を定義します。複数のMilvusクラスタが1つのPulsarインスタンスを共有する場合、これによりチャンネルがきれいに分離されます。</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>:Pulsarのテナント・モデルをバイパスしたい場合は、チャネル・プレフィックスを調整し、衝突を防ぎます。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusはメッセージ・キューとしてKafkaもサポートしています。代わりにKafkaを使用するには、Pulsar固有の設定をコメントアウトし、Kafka設定ブロックのコメントを外します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Milvus内部コンポーネント・コンフィギュレーション<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>:メタデータ+タイムスタンプ</h3><p><code translate="no">rootCoord</code> ノードは、メタデータの変更（DDL/DCL）とタイムスタンプの管理を行います。</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>コレクションあたりのパーティション数の上限を設定します。ハードリミットは1024ですが、このパラメータは主にセーフガードとして機能します。マルチテナント・システムの場合、パーティションを分離境界として使用することは避けてください。その代わりに、数百万の論理テナントに対応するテナント・キー戦略を実装してください。</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>スタンバイノードをアクティブにすることで高可用性を実現します。Milvusコーディネータノードはデフォルトでは水平方向にスケールしないため、これは非常に重要です。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>:APIゲートウェイ＋リクエストルーター</h3><p><code translate="no">proxy</code> 、クライアントからのリクエスト、リクエストの検証、結果の集約を行う。</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>:コレクションごとのフィールド数（スカラー＋ベクトル）を制限する。スキーマの複雑さを最小にし、I/Oオーバーヘッドを減らすために、64以下に保つ。</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>:コレクション内のベクトルフィールド数を制御します。Milvusはマルチモーダル検索をサポートしていますが、実際には10個のベクターフィールドが安全な上限です。</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:ingestion shardの数を定義します。目安として</p>
<ul>
<li><p>&lt; 200Mレコード → 1シャード</p></li>
<li><p>200-400Mレコード → 2シャード</p></li>
<li><p>それ以上は線形にスケールする。</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>:有効にすると、詳細なリクエスト情報（ユーザー、IP、エンドポイント、SDK）がログに記録される。監査やデバッグに便利。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>:クエリー実行</h3><p>ベクトル検索の実行とセグメントのロードを処理します。以下のパラメータに注意してください。</p>
<ul>
<li><code translate="no">queryNode.mmap</code>:スカラーフィールドとセグメントのロードで、メモリマップド I/O を切り替えます。<code translate="no">mmap</code> を有効にするとメモリフットプリントを削減できますが、ディスクI/Oがボトルネックになるとレイテンシが悪化する可能性があります。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>:セグメントとインデックスの管理</h3><p>このパラメータは、データのセグメンテーション、インデックス作成、コンパクション、ガベージコレクション（GC）を制御します。主な設定パラメータは以下のとおり：</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>:メモリ内データセグメントの最大サイズを指定します。一般に、セグメントを大きくすると、システム内の総セグメント数が少なくなり、インデックス作成と検索のオーバーヘッドを減らすことでクエリ・パフォーマンスを向上させることができます。例えば、<code translate="no">queryNode</code> インスタンスを 128GB の RAM で実行しているユーザーの中には、この設定を 1GB から 8GB に増やすことで、クエリ・パフォーマンスが約 4 倍速くなったという報告もあります。</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>:上記と同様に、このパラメータは特に<a href="https://milvus.io/docs/disk_index.md#On-disk-Index">ディスク・インデックス</a>（diskann index）の最大サイズを制御します。</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>:成長中のセグメントがいつ封印されるかを決定します。セグメントが<code translate="no">maxSize * sealProportion</code> に達した時点で、そのセグメントは封印される。デフォルトでは、<code translate="no">maxSize = 1024MB</code> と<code translate="no">sealProportion = 0.12</code> 、セグメントは約123MBで封印される。</p></li>
</ol>
<ul>
<li><p>低い値(例えば0.12)を設定すると、より早く封印が開始され、インデックスの作成が高速になる。</p></li>
<li><p>高い値(例えば0.3から0.5)は、封印を遅らせ、インデックス作成のオーバーヘッドを減らす。</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  コンパクション時に許容される拡張係数を設定します。Milvusはコンパクション中の最大許容セグメントサイズを<code translate="no">maxSize * expansionRate</code> として計算します。</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>:セグメントがコンパクションされた後、またはコレクションが削除された後、Milvusは直ちに基礎となるデータを削除しません。その代わりに、削除するセグメントをマークし、ガベージコレクション（GC）サイクルが完了するのを待ちます。このパラメータはその遅延時間を制御する。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">その他の機能構成<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>:観測可能性と診断</h3><p>堅牢なロギングはあらゆる分散システムの基礎であり、milvusも例外ではありません。適切に設定されたロギング設定は、問題が発生した際のデバッグに役立つだけでなく、時間の経過とともにシステムの健全性と動作をより確実に可視化します。</p>
<p>本番環境では、Milvusのログを<a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Lokiの</a>ような集中ログ・監視ツールと統合し、分析とアラートを効率化することをお勧めします。主な設定は以下の通りです：</p>
<ol>
<li><p><code translate="no">log.level</code>:ログ出力の冗長性を制御します。本番環境では、<code translate="no">info</code> レベルを維持し、システムに負担をかけることなく必要な実行時の詳細を取得します。開発中やトラブルシューティング中は、<code translate="no">debug</code> に切り替えることで、内部運用についてより詳細な洞察を得ることができる。<code translate="no">debug</code> 大量のログが生成されるため、そのままにしておくとディスク容量をすぐに消費し、I/Oパフォーマンスを低下させる可能性があります。</p></li>
<li><p><code translate="no">log.file</code>:デフォルトでは、Milvusは標準出力(stdout)にログを書き込みます。これは、サイドカーやノードエージェント経由でログを収集するコンテナ環境に適しています。ファイルベースのログを有効にするには、次のように設定します：</p></li>
</ol>
<ul>
<li><p>ローテーション前の最大ファイルサイズ</p></li>
<li><p>ファイル保持期間</p></li>
<li><p>保持するバックアップ・ログ・ファイルの数</p></li>
</ul>
<p>これは、ベアメタル環境またはオンプレム環境で、標準出力ログのシッピングが利用できない場合に便利です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>:認証とアクセス制御</h3><p>Milvusは<a href="https://milvus.io/docs/authenticate.md?tab=docker">ユーザ認証と</a> <a href="https://milvus.io/docs/rbac.md">ロールベースアクセスコントロール(RBAC)</a>をサポートしており、どちらも<code translate="no">common</code> 。これらの設定は、マルチテナント環境または外部クライアントに公開されるデプロイメントを保護するために不可欠です。</p>
<p>主なパラメータは以下の通りです：</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>:このトグルは認証とRBACを有効または無効にします。デフォルトではオフになっており、ID チェックなしですべての操作が許可されます。安全なアクセス制御を行うには、このパラメータを<code translate="no">true</code> に設定します。</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>:認証が有効な場合、この設定は組み込みの<code translate="no">root</code> ユーザーの初期パスワードを定義します。</p></li>
</ol>
<p>本番環境でのセキュリティの脆弱性を回避するため、認証を有効にした直後には必ずデフォルトのパスワードを変更してください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>:レート制限と書き込み制御</h3><p><code translate="no">milvus.yaml</code> の<code translate="no">quotaAndLimits</code> セクションは、システム内のデータの流れを制御する上で重要な役割を果たす。これは、挿入、削除、フラッシュ、およびクエリなどの操作のレート制限を管理し、高負荷時のクラスタの安定性を確保し、書き込みの増幅や過剰なコンパクションによるパフォーマンスの低下を防止します。</p>
<p>主なパラメータは以下のとおりです：</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>:Milvusがコレクションからデータをフラッシュする頻度を制御します。</p>
<ul>
<li><p><strong>デフォルト値</strong>：<code translate="no">0.1</code>つまり、システムは10秒に1回のフラッシュを許可します。</p></li>
<li><p>フラッシュ操作は、成長しているセグメントを密封し、メッセージキューからオブジェクトストレージに永続化します。</p></li>
<li><p>フラッシュを頻繁に行うと、密封された小さなセグメントが多数生成され、コンパクションのオーバーヘッドが増加し、クエリのパフォーマンスが低下します。</p></li>
</ul>
<p>💡 ベストプラクティスです：ほとんどの場合、Milvusが自動的に処理します。成長中のセグメントは<code translate="no">maxSize * sealProportion</code> に達すると封印され、封印されたセグメントは10分ごとにフラッシュされます。手動でフラッシュすることを推奨するのは、これ以上データが来ないことが分かっているバルクインサートの後だけです。</p>
<p>また、<strong>データの可視性は</strong>、フラッシュのタイミングではなく、クエリの<em>一貫性</em>レベルによって決定されることに留意してください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code> ：これらのパラメータは、upsertおよびdelete操作の最大許容レートを定義します。</p>
<ul>
<li><p>MilvusはLSM-Treeストレージアーキテクチャを採用しており、頻繁な更新や削除はコンパクションのトリガーとなります。これは慎重に管理しないとリソースを消費し、全体的なスループットを低下させる可能性があります。</p></li>
<li><p>コンパクションパイプラインに負担をかけないように、<code translate="no">upsertRate</code> と<code translate="no">deleteRate</code> の両方を<strong>0.5 MB/s</strong>に制限することを推奨します。</p></li>
</ul>
<p>🚀 大きなデータセットを素早く更新する必要がありますか？コレクションエイリアス戦略を使用する：</p>
<ul>
<li><p>新しいデータを新しいコレクションに挿入します。</p></li>
<li><p>更新が完了したら、エイリアスを新しいコレクションにリポイン トします。これにより、インプレース更新のコンパクション・ペナルティを回避し、即座に切り替えることができます。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">実際の構成例<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusの設定がどのように異なる運用目標に合わせて調整できるかを説明するために、2つの一般的な展開シナリオを説明しましょう。</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">例 1: 高パフォーマンス構成</h3><p>クエリのレイテンシがミッションクリティカルな場合（レコメンデーションエンジン、セマンティック検索プラットフォーム、リアルタイムのリスクスコアリングなど）、ミリ秒単位が重要になります。このようなユースケースでは、通常<strong>HNSWや</strong> <strong>DISKANNの</strong>ようなグラフベースのインデックスを使用し、メモリ使用量とセグメントのライフサイクル動作の両方を最適化します。</p>
<p>主なチューニング戦略</p>
<ul>
<li><p><code translate="no">dataCoord.segment.maxSize</code> と<code translate="no">dataCoord.segment.diskSegmentMaxSize</code> を増やす：利用可能なRAMに応じて、これらの値を4GB、あるいは8GBに上げる。セグメントを大きくすることで、インデックスの構築回数を減らし、セグメントのファンアウトを最小化することで、クエリのスループットを向上させます。ただし、セグメントを大きくすると、クエリ時に多くのメモリを消費するので、<code translate="no">indexNode</code> と<code translate="no">queryNode</code> インスタンスに十分なヘッドルームがあることを確認してください。</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code> と<code translate="no">dataCoord.segment.expansionRate</code> を下げる：シーリング前のセグメントサイズを200MB前後にする。これにより、セグメントのメモリ使用量を予測しやすくし、Delegator（分散検索を調整するqueryNodeのリーダー）の負担を減らすことができます。</p></li>
</ul>
<p>経験則：メモリが豊富でレイテンシを優先する場合は、より少ない、より大きなセグメントを優先する。インデックスの鮮度が重要な場合は、シールのしきい値を控えめにする。</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">例2：コスト最適化構成</h3><p>モデルトレーニングパイプライン、低QPSの社内ツール、ロングテールの画像検索などでよく見られるように、生のパフォーマンスよりもコスト効率を優先する場合、リコールやレイテンシをトレードオフすることで、インフラ需要を大幅に削減することができます。</p>
<p>推奨される戦略</p>
<ul>
<li><p><strong>インデックスの量子化を使う：</strong> <code translate="no">SCANN</code> 、<code translate="no">IVF_SQ8</code> 、<code translate="no">HNSW_PQ/PRQ/SQ</code> のようなインデックスタイプ（Milvus 2.5で導入）は、インデックスサイズとメモリフットプリントを劇的に削減します。これらは、規模や予算よりも精度が重要でないワークロードに最適です。</p></li>
<li><p><strong>ディスクバックアップインデックス戦略を採用する：</strong>インデックスタイプを<code translate="no">DISKANN</code> に設定し、純粋なディスクベース検索を有効にする。<code translate="no">mmap</code> を<strong>有効にして</strong>選択的なメモリ・オフロードを行う。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>メ モ リ を極端に節約す る には、<code translate="no">mmap</code> を有効にする：<code translate="no">vectorField</code> <code translate="no">vectorIndex</code> 、<code translate="no">scalarField</code> 、<code translate="no">scalarIndex</code> 。これにより、大きなデータ・チャンクが仮想メモリにオフロードされ、常駐RAMの使用量が大幅に削減されます。</p>
<p>⚠️ 警告：スカラー・フィルタリングがクエリ作業負荷の大部分を占める場合は、<code translate="no">vectorIndex</code> と<code translate="no">scalarIndex</code> に対して<code translate="no">mmap</code> を無効にすることを検討してください。メモリマッピングは、I/Oに制約のある環境ではスカラークエリのパフォーマンスを低下させる可能性があります。</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">ディスク使用のヒント</h4><ul>
<li><p><code translate="no">mmap</code> で構築されたHNSWインデックスは、総データサイズを最大<strong>1.8倍まで</strong>拡張することができます。</p></li>
<li><p>100GBの物理ディスクは、インデックスのオーバーヘッドとキャッシュを考慮すると、現実的には~50GBの有効データしか収容できないかもしれない。</p></li>
<li><p><code translate="no">mmap</code> を使用する場合、特にオリジナルのベクトルをローカルにキャッシュする場合は、常に余分なストレージを用意してください。</p></li>
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
    </button></h2><p>Milvusをチューニングすることは、完璧な数値を追い求めることではありません。MilvusがどのようにI/O、セグメントライフサイクル、インデックスを処理するかを理解することで、最もインパクトのある最適化が得られます。これらは、設定ミスが最も問題となるパスであり、熟考されたチューニングが最大の利益をもたらすパスでもあります。</p>
<p>Milvusを初めてお使いになる場合、今回取り上げた設定パラメータで、パフォーマンスと安定性に関するニーズの80-90%をカバーすることができます。まずはそこから始めてください。ある程度直感的に理解できるようになったら、<code translate="no">milvus.yaml</code> の仕様と公式ドキュメントをさらに深く読んでみてください。</p>
<p>適切な設定を行うことで、低レイテンシのサービング、コスト効率に優れたストレージ、または高い精度の分析ワークロードなど、運用上の優先事項に沿ったスケーラブルで高性能なベクトル検索システムを構築する準備が整います。</p>
