---
id: milvus-3-0-external-collection.md
title: Milvus 外部コレクション：データを移動せずにデータレイク内のデータをインデックス化して検索する
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0 では External Collection が導入され、Milvus
  がインデックスを構築し、レイク内に残るデータに対して検索を提供できるようになりました。
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>多くのAIパイプラインでは、エンベディングとメタデータはすでに生成され、データレイクに保存されています。プロダクトパイプラインは、製品属性とマルチモーダルエンベディングをS3のParquetファイルに書き込むことがあります。検索用コーパスやトレーニング用コーパスは、IcebergテーブルやLanceテーブルに存在することがあります。レイクは、これらのデータセットが生成・更新・バージョン管理され、他のデータスタックによって使用される場所です。</p>
<p>しかし、ベクターデータベースは伝統的に、データベースが所有するサービングコピーを中心に構築されてきました。チームがすでにレイクにあるデータに対して低遅延のベクター検索を行いたい場合、一般的に2つの選択肢がありました：</p>
<ul>
<li><strong>データをベクターデータベースにコピーする。</strong>これによりANNインデックスと本番サービングパスが提供されますが、データセットの2番目のコピーと、ソースと同期を保つ必要があるETLパイプラインが作成されます。</li>
<li><strong>レイクを直接クエリする。</strong>これにより重複は回避されますが、ANNインデックスとサービングレイヤーがないため、ベクター検索は本番レイテンシー向けに設計されていないスキャンにフォールバックします。</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>外部コレクション</strong></a> <strong>は3つ目の道を導入します。</strong>ソースデータはParquet、Iceberg、Lance、Vortex、その他のサポートされている外部形式に残り、Milvusはその上にインデックスを構築して提供します。外部フィールドをMilvusスキーマにマッピングし、必要なインデックスを定義し、コレクションをリフレッシュして、通常のMilvus検索・クエリAPIを使用します—ソース行を先にMilvus管理コレクションにコピーする必要はありません。</p>
<p>アーキテクチャの変更はシンプルです：データはレイクに残り、Milvusがインデックスと検索レイヤーを追加します。</p>
<p>これにより、外部コレクションは、<a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>ベクターレイクベース</strong></a><strong>（Vector Lakebase）</strong>への重要な一歩となります。これは、オープンレイクストレージ、再利用可能なレイクレベルのインデックス、共有セマンティックレイヤーとベクターデータベースレベルのサービングを組み合わせた、AIのための統合的でレイクネイティブなデータアーキテクチャです。オンライン検索は、Spark、トレーニングパイプライン、評価ジョブ、ガバナンスツールが別のバージョンのデータで動作している間、別のサービングコピーから始める必要がなくなります。それらは同じレイク常駐データ基盤から作業できます。</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">外部コレクションとは何か、そしてそれが何を変えるのか<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>外部コレクション</strong>は、ソースデータがMilvus管理ストレージの外部に存在するMilvusコレクションの一種です。</p>
<p>外部コレクションがない場合、そのカタログを本番ベクター検索の背後に置くことは、通常Milvusに別のコピーを作成することを意味します：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>カタログが変更されるたび、エンベディングモデルが変更されるたび、またはフィールドがバックフィルされるたびに、別のパイプラインが更新されたデータをその境界を越えて移動させる必要があります。</p>
<p>外部コレクションを使用すると、アーキテクチャは次のようになります：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusは外部ファイルを独自のソースデータコピーにしません。代わりに、外部コレクションにはMilvusがそれらを解釈して検索するために必要な情報が含まれています：</p>
<ol>
<li>外部ファイルまたはテーブルを識別する<code translate="no">external_source</code>。</li>
<li>ソース形式とストレージアクセスを記述する<code translate="no">external_spec</code>。</li>
<li>Milvusスキーマのフィールドを外部データセットの列に接続する<code translate="no">external_field</code>マッピング。</li>
<li>Milvusが検索用に作成するインデックス、マニフェスト、サービング状態。</li>
</ol>
<p><strong>ゼロコピーのソースデータは、Milvus内部の状態がゼロであることを意味しません。</strong>Milvusは依然としてインデックスを構築します。依然としてコンピュートを使用します。依然としてデータをキャッシュします。変更点は、Milvusで検索する必要があるからといって、信頼できるソースの行をMilvusにコピーする必要がなくなったことです。</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">通常のMilvusコレクションと外部コレクション</h3><table>
<thead>
<tr><th><strong>関心事</strong></th><th><strong>Milvus管理コレクション</strong></th><th><strong>外部コレクション</strong></th></tr>
</thead>
<tbody>
<tr><td>ソースレコード</td><td>Milvusによって保存・管理される</td><td>外部ファイルまたはテーブルに残る</td></tr>
<tr><td>Milvusへのデータの入り方</td><td>挿入、アップサート、インポート、またはストリーミング書き込み</td><td>外部ソースマッピング + リフレッシュ</td></tr>
<tr><td>オンライン変更</td><td>サポートあり</td><td>Milvusからは読み取り専用</td></tr>
<tr><td>鮮度</td><td>Milvusの書き込みパスと整合性モデルに従う</td><td>最後に正常に公開されたリフレッシュに従う</td></tr>
<tr><td>Milvus管理状態</td><td>ソースデータ、メタデータ、インデックス、キャッシュ</td><td>マッピング、マニフェスト、インデックス、キャッシュ</td></tr>
<tr><td>クエリパス</td><td>Milvusの検索およびクエリAPI</td><td>Milvusの検索およびクエリAPI</td></tr>
<tr><td>最適な用途</td><td>継続的に変化するオンラインデータ</td><td>大規模でバッチ生成され、読み取りが多いレイクデータ</td></tr>
</tbody>
</table>
<p>したがって、外部コレクションは通常のMilvusコレクションを置き換えるのではなく、補完します。</p>
<p>システムは、通常のMilvusコレクションで急速に変化するオンライン状態を保持しながら、大規模なコーパス、カタログ、履歴データセット、モデル特徴量、またはレイク内で既に生成・管理されているその他のデータに外部コレクションを使用できます。</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">2番目のコピーを削除することが重要な理由<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>外部コレクションをストレージ最適化として説明したくなります：数テラバイトのデータを別のデータベースにコピーしないことで、ストレージを節約できます。これは有用ですが、主要なアーキテクチャ上の問題ではありません。</p>
<p><strong>より高いコストは、2つのデータシステムを整合させ続けることから生じます。</strong></p>
<p>もう一度製品カタログを考えてみましょう。データプラットフォームが信頼できるParquetデータセットを生成します。検索機能がそれをベクターデータベースにインポートします。レコメンデーションチームはSparkを通じて同じレイクデータをオフライン分析用に読み取るかもしれません。その後、新しいエンベディングモデルが置換用のベクター列を生成します。在庫とメタデータは同時に変化し続けます。</p>
<p>オンラインサービングコピーがレイクから独立すると、すべての変更がその境界を越える必要があります：</p>
<ul>
<li>データをコピーする必要があります；</li>
<li>転送をスケジュールして監視する必要があります；</li>
<li>失敗したジョブには再試行が必要です；</li>
<li>スキーマと権限を複数のシステムで表現する必要があるかもしれません；</li>
<li>鮮度は同期パイプラインが追いつく速さに依存します；</li>
<li>チームはどのコピーが実際に必要なバージョンを表しているかを把握する必要があります。</li>
</ul>
<p>ストレージは単なる1つの項目にすぎません。</p>
<table>
<thead>
<tr><th><strong>コスト</strong></th><th><strong>分離されたレイク + サービングコピー</strong></th><th><strong>外部コレクション</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>ソースデータのコピー</strong></td><td>レイクコピーに加えて別のサービングコピー</td><td>ソース行はレイクに残る</td></tr>
<tr><td><strong>データ移動</strong></td><td>持続的なETL/インポートパイプライン</td><td>外部ソースに対するリフレッシュ</td></tr>
<tr><td><strong>鮮度</strong></td><td>エクスポート/インポートの頻度に依存</td><td>新しいリフレッシュが公開されるタイミングで制御</td></tr>
<tr><td><strong>ガバナンス</strong></td><td>ソースコピーとサービングコピーを整合させ続ける必要がある</td><td>ソースの所有権、系統、バージョン管理はレイクプラットフォームに残る</td></tr>
<tr><td><strong>オフライン再利用</strong></td><td>他のコンシューマーが独自のコピーを準備する可能性がある</td><td>既存のレイクツールが同じソースを読み続けることができる</td></tr>
<tr><td><strong>サービングリソース</strong></td><td>データベースコピーとクエリワークロードに基づいてサイズ設定</td><td>インデックス作成、クエリコンピュート、キャッシュをソース行の所有権から分離して管理できる</td></tr>
</tbody>
</table>
<p>この違いは、AIデータの変更がより頻繁になるにつれて特に重要になります。</p>
<p>チームはコーパスの重複を排除します。分析のためにデータをクラスタリングします。モデルが変更されると新しいエンベディングを生成します。ラベル、要約、抽出されたエンティティ、品質スコア、フィードバックシグナルを追加します。本番アプリケーションが検索するのと同じコーパスに対して評価ジョブとデータクリーニングパイプラインを実行します。</p>
<p>すべてのシステムが独自のコピーを所有している場合、すべての改善が別の同期ジョブになります。</p>
<p>外部コレクションはその境界を変えます：<strong>オフラインシステムはレイクデータセットで作業を続けられ、Milvusは同じ基盤上で検索を提供します。</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">外部コレクションがサポートするデータソース<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>外部コレクションは、Milvus固有のソースレイアウトではなく、オープンで外部管理されたデータを中心に設計されています。<a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>を通じて複数の外部ソース形式をサポートしています：</p>
<table>
<thead>
<tr><th><strong>外部形式</strong></th><th><strong>format値</strong></th><th><strong>Milvusが読み取るもの</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Parquetファイルと行グループを含むディレクトリまたはオブジェクトストレージプレフィックス</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Vortexファイルとそのレイアウトメタデータ</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Lanceデータセットとそのフラグメントメタデータ</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Icebergメタデータと選択されたスナップショット</td></tr>
<tr><td>Milvusスナップショット</td><td>milvus-table</td><td>外部ソースとして公開されたサポートされているMilvusスナップショット</td></tr>
</tbody>
</table>
<p>ソースとMilvusの間のマッピングは明示的です。</p>
<p><code translate="no">product_id</code>という名前のソース列はMilvusフィールド<code translate="no">id</code>になります；<code translate="no">image_vec</code>は<code translate="no">embedding</code>になります；そして幅広いソーステーブルはすべての列をコレクションに公開する必要はありません。つまり、データプラットフォームはサービングデータベースを満たすためだけにソースをリネームしたり書き換えたりする必要はありません。</p>
<p>バージョン管理された形式はもう1つの有用な特性を追加します。Icebergなどのソースを使用すると、コレクションはクエリ実行時に現在のものではなく、特定のスナップショットを指すことができます。固定されたソースバージョンは、再現可能な評価、回帰テスト、履歴分析、監査ワークロードに役立ちます。</p>
<p>基盤となるファイルは、他のデータスタックでも引き続き使用できます。Spark、トレーニングフレームワーク、ガバナンスシステム、その他のレイク互換ツールは、同じオープンデータを読み続けることができます。</p>
<p>外部コレクションはそのデータの別のコンシューマーを追加します；Milvusを唯一の所有者にするわけではありません。</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">外部ストレージへの安全なアクセス</h3><p>Milvusは外部ストレージを読み取るための権限も必要とします。</p>
<p>ストレージプロバイダーに応じて、デプロイメントではアプリケーション設定に長期有効な認証情報を埋め込む代わりに、ワークロードIDやインスタンスID、AWS STSロール引き受け、サービスアカウントのインパーソネーション、SASベースのアクセス、プロバイダー固有のロールシステムなどのメカニズムを使用できます。</p>
<p>このストレージIDはMilvusがソースに到達する方法を制御します。Milvus内部の認可は別のセキュリティ境界として残ります。</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">外部コレクションの作成、インデックス作成、リフレッシュ、クエリ方法<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>外部コレクションのライフサイクルには4つの主要なステップがあります：</p>
<ol>
<li>外部ソースを定義し、その列をMilvusスキーマにマッピングします。</li>
<li>ワークロードに必要なインデックスを定義します。</li>
<li>Milvusがソースデータを発見してクエリ可能なバージョンを準備できるようにリフレッシュを実行します。</li>
<li>コレクションをロードして通常のMilvus検索およびクエリAPIを使用します。</li>
</ol>
<p>同じ製品カタログを外部コレクションとして表現した例です：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>インデックスは通常のMilvusインターフェースを使用します：</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>次に外部ソースをリフレッシュします：</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>リフレッシュされたバージョンが準備できたら、通常のMilvusコレクションと同様にロードして検索します：</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>重要な違いは検索呼び出しではありません。ライフサイクルがどこから始まるかです。Milvus管理コレクションは、データがMilvusに書き込まれるかインポートされるところから始まります。外部コレクションは、すでに他の場所に存在するデータへの参照から始まります。</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">リフレッシュが外部データの変更をどのように取得するか<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>外部コレクションはMilvus側からは読み取り専用ですが、基盤となるレイクデータセットは永遠に凍結されている必要はありません。</p>
<p>製品パイプラインが別のバッチを追加したり、メタデータを更新したり、新しいモデルからエンベディングを書き込んだりするとします。Milvusはソースパスに現れるすべてのオブジェクトを継続的に追跡するわけではありません。これらの変更は<strong>リフレッシュ</strong>を通じて可視化されます。</p>
<p>リフレッシュは外部メタデータを読み取り、ソースフラグメントを解決し、それらをMilvusコレクションに接続するマニフェストを更新し、対応するインデックス状態を準備します。</p>
<p>重要なのは、この作業が増分で実行できることです。</p>
<p>Milvusは変更されていないソースフラグメントを識別し、既存のセグメントとインデックスの作業を再利用できます。新規または変更されたフラグメントは、新しい処理を必要とする部分です。</p>
<p>したがって、複数テラバイトのデータセットへの小さな変更でも、別の完全インポートと完全なインデックス再構築をトリガーする必要はありません。</p>
<p>リフレッシュはサービングシステムに明確なバージョン境界も提供します。新しいバージョンが準備されている間、クエリは以前に公開された状態を引き続き使用します。リフレッシュが完了すると、新しい状態は古いデータと部分的に準備されたデータの混合を公開するのではなく、完全なバージョンとして利用可能になります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>このモデルは、時間ごとのカタログ構築、夜間のナレッジベース更新、定期的なエンベディングリフレッシュ、モデル生成の特徴量パイプライン、および同様のバッチ指向ワークロードに自然に適合します。</p>
<p>これはストリーミング書き込みパスを置き換えるものでは<strong>ありません</strong>。すべての挿入や削除がMilvusを通じて即座に検索可能になる必要がある場合、管理コレクションの方が優れたモデルです。</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">遅延ロードが幅広いデータセットのメモリ使用量をどのように削減するか<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>ソース行をオブジェクトストレージに保持しておくことは、サービングレイヤーがクエリに応答する前にすべてのバイトをローカルにロードする必要がない場合にのみ役立ちます。Milvus階層型ストレージを有効にすると、その必要はありません。</p>
<p>コレクションのロード時に、クエリノードは最初はスキーマ情報、インデックス定義、チャンクマップ、リモートオブジェクトへの参照などの軽量なメタデータのみを保持できます。フィールドデータはクエリが必要としたときにチャンクレベルでフェッチされます；インデックスは最初の使用までリモートに保持され、その後ローカルにキャッシュされます。頻繁に使用されるデータはホットな状態を維持し、アクセス頻度の低いデータは退避できます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これは特に幅広いAIデータセットに役立ちます。</p>
<p>製品行には、複数のエンベディング、長い説明、生のJSON、画像メタデータ、生成された要約、在庫、価格、評価、その他多くの属性が含まれる可能性があります。典型的な類似性検索では、1つのベクターに加えて在庫、価格、評価のみにアクセスする場合があります。同じレコードに属しているというだけの理由で、他のすべてのフィールドが永続的にサービングメモリを占有する必要はありません。</p>
<p>外部コレクションは、サービングフットプリントを2つのレベルで狭めることができます：</p>
<ul>
<li><strong>まず、スキーマレベルの射影。</strong><code translate="no">external_field</code>を通じて、外部コレクションはアプリケーションが必要とするソース列のみを公開できます。他の列はレイクデータセットに残り、このサービングスキーマには含まれません。</li>
<li><strong>次に、ランタイム射影。</strong>階層型サービングモデルでは、クエリノードはマッピングされたデータセット全体を事前にロードするのではなく、ワークロードに実際に必要なフィールドとインデックスをフェッチしてキャッシュします。</li>
</ul>
<p>言い換えると、<strong>データセットはレイク内で幅広いままでありながら、サービングフットプリントを同じように幅広くする必要はありません。</strong></p>
<p>明らかなトレードオフがあります。コールドフィールドやインデックスにヒットするクエリは、最初のアクセス時にリモート読み取りコストを支払う可能性があります。ウォームアップポリシーはレイテンシーに重要なフィールドやインデックスを事前ロードでき、キャッシュと退避ポリシーはアクセス頻度の低い状態がローカルリソースを無期限に占有しないようにします。</p>
<p>ポイントは、オブジェクトストレージがRAMのように動作するということではありません。メモリとローカルディスクが、ソースデータセットの総サイズと幅ではなく、検索ワークロードのワーキングセットに追従できるということです。</p>
<p>ソース形式もここでは重要です。広範な分析スキャン用に設計された形式と、より狭いまたはランダムな読み取り用に最適化された形式では、オンデマンドアクセス時に異なるI/O動作が発生する可能性があります。外部コレクションはこれらのストレージレベルのトレードオフを消し去るわけではありません；その上にMilvusが検索レイヤーを構築できるようにします。</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">外部コレクションがサポートする検索およびインデックス機能<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>外部コレクションは、単にMilvusをエンベディングのディレクトリに向けてファイルをスキャンするものではありません。Milvusは外部データ上に検索構造を構築し、標準の検索エンジンを通じてクエリを実行します。</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">外部データ上に構築されるMilvusインデックス</h3><p>フィールドとワークロードに応じて、Milvusは以下を構築できます：</p>
<ul>
<li>ANN検索用のベクターインデックス；</li>
<li>メタデータフィルタリング用のスカラーインデックス；</li>
<li>半構造化属性用のJSONインデックス；</li>
<li>語彙検索用のBM25および全文インデックス。</li>
<li>Milvusデータモデルでサポートされている関数生成フィールド。</li>
</ul>
<p>ANN検索はこれらのインデックスを使用して、すべてのソースベクターを読み取る代わりに候補セットを絞り込みます。</p>
<p>この違いは重要です。なぜなら、レイクにエンベディングを保存することは、その上でベクターデータベースを運用することとは異なるからです。永続化はバイトを提供します。本番検索には、インデックス、クエリプランニング、フィルタリング、ランキング、キャッシュ、低遅延のサービングパスも必要です。</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">ベクターtop-Kを超えて</h3><p>もう1つの一般的な誤解は、「外部コレクション」を「Parquet上のベクター検索」と読むことです。それは本番検索が実際に必要とするものを過小評価しています。</p>
<p>本番の検索結果がベクター類似度だけに依存することはほとんどありません。正確な用語、アクセスポリシー、在庫、タイムスタンプ、カテゴリ、価格、ソース品質、ビジネスランキングシグナルにも依存する場合があります。</p>
<p>次のようなクエリを考えてみましょう：</p>
<table>
<thead>
<tr><th>夏用の赤い花柄ドレス、在庫あり、評価の高い順</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>本番の検索パスには複数のシグナルが必要になる場合があります：</p>
<ul>
<li><strong>ベクター類似度</strong>：「夏用の花柄ドレス」の意味的類似性を捉えます。</li>
<li><strong>語彙検索または全文検索</strong>：「赤」などの正確な用語を検索します。</li>
<li><strong>スカラーフィルター</strong>：在庫切れまたは評価しきい値以下の製品を除外します。</li>
<li><strong>ハイブリッド検索とランキング</strong>：複数の検索シグナルを組み合わせます。</li>
</ul>
<p>Milvus 3.0はまた、<strong>サーバーサイドの順序付け、集約、ファセット</strong>などの機能により、クエリエンジンを初期の最近傍検索を超えて拡張します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>より広いポイントは、外部コレクションがレイク常駐データにデータベースの検索パスを提供するということです—単にファイルからベクターを読み取る方法ではありません。</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">同じレイクデータがオンラインサービングとオフライン処理をどのようにサポートするか<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>ソースをオープンレイク形式で維持する最も強いアーキテクチャ上の理由は、単に2番目のコピーにコストがかかるからではありません。それは、同じデータセットが継続的に改善するシステムに対して利用可能なままであることができるからです。</p>
<p>製品カタログに戻りましょう。</p>
<p>日中、Milvusは製品検索、レコメンデーション、またはエージェント検索のために外部コレクションを提供できます。</p>
<p>同時に、他のシステムはレイクデータセット上で直接作業できます：</p>
<ul>
<li>Sparkは重複する製品を識別できます。</li>
<li>トレーニングパイプラインは新しいモデルからエンベディングを生成できます。</li>
<li>データ品質ジョブは不正な形式や異常なレコードを検出できます。</li>
<li>評価パイプラインはモデルバージョン間の検索品質を比較できます。</li>
<li>バッチプロセスは要約、ラベル、追加のメタデータを生成できます。</li>
</ul>
<p>外部コレクションはこれらのジョブを自分で実行するわけでは<strong>ありません</strong>。SparkはSparkのままです；トレーニングはトレーニングのままです。その役割は、それらの間の余分なサービングデータ境界を削除することです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>オフライン作業は改善されたデータや新しいフィールドをレイクに書き戻すことができます。後続のリフレッシュにより、更新されたソースがMilvus検索パスで利用可能になります。</p>
<p>サービング用に別の信頼できるコピーを再構築することだけを目的とした、別のエクスポートとインポートのループはありません。</p>
<p>ガバナンスも明確に分割されたままです。ソースバージョン、系統、ソースの所有権はレイクプラットフォームに残ります。Milvusは独自のコレクションレベルの認可と、ソースを読み取るために必要な認証情報を維持します。単一のデータ基盤を共有することは、すべてのセキュリティドメインを単一のシステムに統合することを意味しません。</p>
<p>これが<a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>ベクターレイクベース</strong></a>との関連です：レイクは共有データ基盤のままであり、Milvusはその上に低遅延の検索レイヤーを提供します。外部コレクションは、Storage V3、スナップショット、Spark統合、スキーマ進化、バックフィルと並んで、そのアーキテクチャの一部です。</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">外部コレクションが適している場所—そして適していない場所<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>外部コレクションは以下の場合に最適です：</strong></p>
<ul>
<li>信頼できるデータがすでにParquet、Vortex、Lance、Iceberg、その他のサポートされている外部ソースに存在する場合。</li>
<li>データセットが主にバッチで生成され、高頻度のトランザクション書き込みではない場合。</li>
<li>2番目のサービングコピーの維持に大きなETL、鮮度、またはガバナンスのオーバーヘッドが発生する場合。</li>
<li>複数のシステムが同じオープンデータセットで作業する必要がある場合。</li>
<li>サービングの鮮度に対して明示的なリフレッシュ境界が許容できる場合。</li>
<li>Milvusをソース行の所有者にせずに本番のMilvus検索を実現したい場合。</li>
</ul>
<p><strong>通常のMilvusコレクションが依然としてより良い選択となるのは以下の場合です：</strong></p>
<ul>
<li>アプリケーションがレコードを継続的に挿入またはアップサートする場合；</li>
<li>削除がオンライン書き込みパスを通じて可視化される必要がある場合；</li>
<li>ワークロードが外部スキーマでは利用できないコレクション機能に依存する場合；</li>
<li>サービング設計が意図的に必要なデータをすべてメモリに保持し、リモートキャッシュミスを回避する場合。</li>
</ul>
<p><strong>いくつかの境界を覚えておく価値があります。</strong></p>
<ul>
<li><strong>外部コレクションは読み取り専用です。</strong>ソースの変更はMilvusの外部で行われます。</li>
<li><strong>ゼロコピーはソース行に適用されます。</strong>インデックス、マニフェスト、キャッシュ、コンピュートは依然としてリソースを消費します。</li>
<li><strong>リフレッシュは明示的です。</strong>ストリーミング同期メカニズムではありません。</li>
<li><strong>ソースは到達可能な状態を維持する必要があります。</strong>検索、インデックス、リフレッシュの動作はストレージアクセスと認証情報に依存します。</li>
<li><strong>Storage V3が必要です。</strong>オープンソースのMilvus 3.0では、外部コレクションを使用する前に有効化する必要があります。</li>
<li><strong>外部コレクションは上流の処理を置き換えません。</strong>エンベディング生成、クラスタリング、重複排除、データクリーニングは適切な上流システムで引き続き行われます。</li>
</ul>
<p>したがって、この選択は二元的ではなく補完的です。システムは、急速に変化するオンライン状態には通常のMilvusコレクションを、自然な居場所がレイクである大規模なバッチ生成データセットには外部コレクションを使用できます。</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Milvus 3.0で外部コレクションを試す<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>外部コレクションはMilvus 3.0で利用できます。代表的なレイクデータセットから始めて、ワークロードにとって重要な側面を評価してください：初期および増分リフレッシュ、インデックス構築コスト、ウォームおよびコールドクエリの動作、アプリケーションが必要とする鮮度間隔。</p>
<p>実装の詳細については、以下を参照してください：</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">外部コレクションの作成</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 3.0リリースノート</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0ローンチブログ</a></li>
</ul>
<p>マネージドパスを希望する場合、外部コレクションはZilliz Cloudの<strong>Zilliz Vector Lakebase</strong>の一部としても利用できます。以下を参照してください：</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">Zilliz Cloudでの外部コレクション</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">ベクターデータベースからベクターレイクベースへ</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">ベクターレイクベースを構築した理由：AIのための非構造化データアーキテクチャを再考する</a></li>
</ul>
<p>実装に関する質問やフィードバックは、<a href="https://github.com/milvus-io/milvus">Milvus GitHubリポジトリ</a>または<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discordコミュニティ</a>にお寄せいただくこともできます。</p>
