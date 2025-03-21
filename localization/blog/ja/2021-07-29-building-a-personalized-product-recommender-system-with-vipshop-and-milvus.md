---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: 全体アーキテクチャ
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: Milvusは、ユーザーにパーソナライズされたレコメンデーションサービスを簡単に提供できる。
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>Vipshopとmilvusによるパーソナライズされた商品推薦システムの構築</custom-h1><p>インターネットのデータ規模が爆発的に成長するにつれ、現在主流のEコマースプラットフォームでは、商品量やカテゴリーが増加する一方で、ユーザーが必要な商品を見つけるのが難しくなっています。</p>
<p><a href="https://www.vip.com/">Vipshopは</a>、中国の大手ブランドオンラインディスカウント小売業者である。Vipshopは、中国全土の消費者に、高品質で人気のあるブランド商品を小売価格より大幅にディスカウントして提供している。顧客のショッピング体験を最適化するために、同社はユーザーのクエリーキーワードとユーザーのポートレートに基づいてパーソナライズされた検索レコメンデーションシステムを構築することを決定した。</p>
<p>電子商取引検索推薦システムの中核機能は、多数の商品から適切な商品を検索し、ユーザーの検索意図と好みに応じて表示することである。その際、商品とユーザーの検索意図・嗜好の類似度を計算し、類似度の高いTopK商品をユーザーに推薦する必要がある。</p>
<p>商品情報、ユーザーの検索意図、ユーザーの嗜好などのデータはすべて非構造化データである。このようなデータの類似度を検索エンジンElasticsearch(ES)のCosineSimilarity(7.x)を用いて計算しようとしたが、この方法には以下の欠点がある。</p>
<ul>
<li><p>計算応答時間が長い - 数百万のアイテムからTopKの結果を取得する平均待ち時間は約300ミリ秒である。</p></li>
<li><p>ESインデックスのメンテナンスコストが高い - 商品特徴ベクトルとその他の関連データの両方に同じインデックスセットが使用されるため、インデックス構築がほとんど容易にならないが、大量のデータが生成される。</p></li>
</ul>
<p>我々は、ESのCosineSimilarity計算を高速化するために、独自のローカルセンシティブハッシュプラグインの開発を試みた。その結果、性能とスループットは大幅に改善されましたが、100ミリ秒以上の待ち時間が発生し、実際のオンライン商品検索の要件を満たすことは困難でした。</p>
<p>徹底的な調査の結果、一般的に使用されているスタンドアロンのFaissと比較して、分散デプロイのサポート、多言語SDK、読み取り/書き込み分離などの利点があるオープンソースのベクトルデータベースであるMilvusを使用することにしました。</p>
<p>様々なディープラーニングモデルを用いて、膨大な非構造化データを特徴ベクトルに変換し、Milvusにインポートします。Milvusの優れた性能により、我々の電子商取引検索推薦システムは、ターゲットベクトルに類似するTopKベクトルを効率的に照会することができる。</p>
<h2 id="Overall-Architecture" class="common-anchor-header">全体アーキテクチャ<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>![アーキテクチャ](https://assets.zilliz.com/1_01551e7b2b.jpg &quot;Architecture.&quot;) 図に示すように、システム全体のアーキテクチャは主に2つの部分から構成されている。</p>
<ul>
<li><p>書き込み処理：ディープラーニングモデルが生成した項目特徴ベクトル（以下、項目ベクトル）を正規化し、MySQLに書き込む。その後、MySQLはデータ同期ツール（ETL）を用いて処理された項目特徴ベクトルを読み込み、ベクトルデータベースmilvusにインポートする。</p></li>
<li><p>読み込み処理：検索サービスは、ユーザークエリキーワードとユーザポートレイトに基づいて、ユーザ嗜好特徴ベクトル（以下、ユーザベクトル）を取得し、Milvusの類似ベクトルを照会し、TopKアイテムベクトルを呼び出す。</p></li>
</ul>
<p>Milvusはデータの増分更新と全体更新の両方に対応している。各インクリメンタルアップデートは既存のアイテムベクトルを削除し、新しいアイテムベクトルを挿入する必要がある。この方が、読み込みが多く書き込みが少ないシナリオに適している。したがって、データ全体の更新方法を選択する。さらに、複数のパーティションのバッチでデータ全体を書き込むのにかかる時間はわずか数分であり、これはほぼリアルタイムの更新に相当する。</p>
<p>Milvusの書き込みノードは、データコレクションの作成、インデックスの構築、ベクターの挿入など、すべての書き込み操作を実行し、書き込みドメイン名でサービスを提供する。Milvusの読み込みノードは、すべての読み込み操作を実行し、読み込み専用のドメイン名で一般にサービスを提供する。</p>
<p>Milvusの現在のバージョンはコレクションのエイリアスの切り替えをサポートしていませんが、Redisを導入することで、複数のデータコレクション全体のエイリアスをシームレスに切り替えることができます。</p>
<p>読み取りノードは、MySQL、Milvus、GlusterFS分散ファイルシステムから既存のメタデータ情報とベクトルデータまたはインデックスを読み取るだけでよいため、複数のインスタンスを配置することで読み取り機能を水平方向に拡張することができる。</p>
<h2 id="Implementation-Details" class="common-anchor-header">実装の詳細<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">データ更新</h3><p>データ更新サービスでは、ベクタデータの書き込みだけでなく、ベクタのデータ量検出、インデックス構築、インデックスプリロード、エイリアス制御などを行う。全体の流れは以下の通り。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>プロセス</span> </span></p>
<ol>
<li><p>データ全体を構築する前に、CollectionA がデータサービスを公開し、利用中のデータ全体が CollectionA(<code translate="no">redis key1 = CollectionA</code>)に向けられているとする。データ全体を構築する目的は、新しいコレクション CollectionB を作成することである。</p></li>
<li><p>商品データチェック - MySQLテーブルの商品データの品目番号をチェックし、CollectionAの既存データと比較する。アラートは数量またはパーセンテージで設定できます。設定数量(パーセント)に達しない場合、データ全体が構築されず、構築失敗とみなされアラートが発生します。設定数量(パーセント)に達すると、データ全体の構築が開始されます。</p></li>
<li><p>データ全体の構築を開始 - 構築中のデータ全体のエイリアスを初期化し、Redisを更新する。更新後、構築中のデータ全体のエイリアスをCollectionB (<code translate="no">redis key2 = CollectionB</code>) に向ける。</p></li>
<li><p>新しいコレクション全体を作成します。存在する場合は、新しいものを作成する前に削除する。</p></li>
<li><p>データ一括書き込み - modulo演算を使用して、各商品データのパーティションIDを独自のIDで計算し、複数のパーティションにデータを新規作成コレクションに一括で書き込みます。</p></li>
<li><p>インデックスの構築とプリロード - 新しいコレクションのインデックス（<code translate="no">createIndex()</code> ）を作成します。インデックスファイルは分散ストレージサーバGlusterFSに格納される。システムは自動的に新しいコレクションに対するクエリをシミュレートし、クエリのウォームアップのためにインデックスをプリロードします。</p></li>
<li><p>コレクション・データ・チェック - 新しいコレクションのデータのアイテム数をチェックし、既存のコレクションとデータを比較し、数量とパーセンテージに基づいてアラームを設定します。設定された数（パーセンテージ）に達していない場合、コレクションは切り替わらず、構築プロセスは失敗とみなされ、アラートがトリガされます。</p></li>
<li><p>コレクションの切り替え - エイリアス制御。Redisの更新後、使用中のデータエイリアス全体がCollectionB (<code translate="no">redis key1 = CollectionB</code>)に向けられ、元のRedisキー2が削除され、構築プロセスが完了します。</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">データの呼び出し</h3><p>Milvusのパーティションデータを数回呼び出し、ユーザークエリキーワードとユーザポートレイトから得られるユーザベクトルとアイテムベクトルの類似度を計算し、マージ後のTopKアイテムベクトルを返す。全体的なワークフローの概略は以下の通りである。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>ワークフロー</span> </span>以下の表は、このプロセスに関わる主なサービスの一覧である。TopKベクトルを呼び出す平均待ち時間は約30ミリ秒であることがわかる。</p>
<table>
<thead>
<tr><th><strong>サービス</strong></th><th><strong>役割</strong></th><th><strong>入力パラメータ</strong></th><th><strong>出力パラメータ</strong></th><th><strong>応答待ち時間</strong></th></tr>
</thead>
<tbody>
<tr><td>ユーザー・ベクトル取得</td><td>ユーザーベクトル取得</td><td>ユーザー情報＋クエリー</td><td>ユーザーベクトル</td><td>10ミリ秒</td></tr>
<tr><td>Milvus検索</td><td>ベクトルの類似度を計算し、TopKの結果を返す</td><td>ユーザベクトル</td><td>アイテムベクトル</td><td>10ミリ秒</td></tr>
<tr><td>スケジューリングロジック</td><td>結果の同時呼び出しとマージ</td><td>多チャンネルで呼び出されたアイテムベクトルと類似度スコア</td><td>TopKアイテム</td><td>10ミリ秒</td></tr>
</tbody>
</table>
<p><strong>実装プロセス</strong></p>
<ol>
<li>ユーザークエリキーワードとユーザポートレイトに基づき、ディープラーニングモデルによってユーザベクトルが計算される。</li>
<li>RedisのcurrentInUseKeyRefから利用中のデータ全体のコレクションエイリアスを取得し、Milvus CollectionNameを取得する。この処理はデータ同期サービスであり、データ全体の更新後にエイリアスをRedisに切り替える。</li>
<li>Milvusは同じコレクション内の異なるパーティションからデータを取得するために、ユーザベクトルと同時・非同期に呼び出され、Milvusはユーザベクトルとアイテムベクトルの類似度を計算し、各パーティションのTopK個の類似アイテムベクトルを返す。</li>
<li>各パーティションから返されたTopKアイテムベクトルをマージし、IP内積（ベクトル間の距離が大きいほど、より類似している）を使用して計算される類似性の距離の逆順に結果をランク付けします。最終的なTopKアイテム・ベクトルが返されます。</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">今後の展望<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>現時点では、Milvusベースのベクトル探索は、推薦シナリオの探索に安定して利用でき、その高い性能から、モデルの次元数やアルゴリズムの選択に遊びの余地がある。</p>
<p>Milvusは、メインサイト検索の想起やオールシナリオ推薦など、より多くのシナリオのミドルウェアとして重要な役割を果たすだろう。</p>
<p>今後Milvusに期待される機能は以下の3つである。</p>
<ul>
<li>コレクションエイリアス切り替えロジック - 外部コンポーネントなしでコレクション間の切り替えを調整する。</li>
<li>フィルタリングメカニズム - Milvus v0.11.0はスタンドアロンバージョンでES DSLフィルタリングメカニズムのみをサポートしています。新しくリリースされたMilvus 2.0はスカラーフィルタリングと読み書き分離をサポートしています。</li>
<li>Hadoop Distributed File System (HDFS)のストレージサポート - Milvus v0.10.6ではPOSIXファイルインターフェースしかサポートしておらず、ストレージバックエンドとしてFUSEをサポートしたGlusterFSを導入しています。しかし、パフォーマンスとスケーリングのしやすさという点ではHDFSの方が優れています。</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">教訓とベストプラクティス<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
<li>読み取り操作が主な焦点であるアプリケーションの場合、読み取りと書き込みを分離するデプロイメントにより、処理能力を大幅に向上させ、パフォーマンスを改善することができる。</li>
<li>Recallサービスで使用されるMilvusクライアントはメモリ上に常駐しているため、Milvus Javaクライアントには再接続メカニズムがありません。ハートビート・テストによりJavaクライアントとサーバー間の接続の可用性を確保するため、独自の接続プールを構築しなければならない。</li>
<li>Milvusでは遅いクエリが時々発生する。これは新しいコレクションのウォームアップが不十分なためです。新しいコレクションに対するクエリをシミュレートすることにより、インデックスファイルがメモリにロードされ、インデックスのウォームアップが達成されます。</li>
<li>nlistはインデックス構築パラメータで、nprobeはクエリパラメータです。検索性能と精度のバランスをとるために、圧力テスト実験を通してビジネスシナリオに応じた妥当な閾値を得る必要があります。</li>
<li>静的データシナリオの場合、最初にすべてのデータをコレクションにインポートし、後でインデックスを構築する方が効率的です。</li>
</ol>
