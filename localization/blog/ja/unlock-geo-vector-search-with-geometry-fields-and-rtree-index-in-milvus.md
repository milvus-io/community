---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: Milvus 2.6で地理空間フィルタリングとベクトル検索をジオメトリフィールドとRTREEに統合
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_new_cover_1_a0439d3adf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Geospatial Filtering + Vector Search in Milvus with Geometry Fields and RTREE
desc: >-
  Milvus2.6では、GeometryフィールドとRTREEインデックスを使用して、ベクトル検索と地理空間インデックスを統合し、正確で場所を認識したAI検索を可能にしています。
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>AIシステムがリアルタイムの意思決定にますます適用されるにつれて、地理空間データは、特に物理的な世界で動作するアプリケーションや、実際の場所にまたがってユーザーにサービスを提供するアプリケーションにおいて、ますます重要になってきている。</p>
<p>DoorDashやUber Eatsのようなフードデリバリープラットフォームを考えてみよう。ユーザーが注文をするとき、システムは単純に2地点間の最短距離を計算しているわけではない。レストランの品質、宅配便の空き状況、交通状況、サービスエリア、そして最近では個人の嗜好を表すユーザーとアイテムの埋め込みを評価する。同様に、自律走行車は、しばしばミリ秒以内という厳しいレイテンシ制約のもとで、パスプランニング、障害物検知、シーンレベルの意味理解を実行しなければならない。これらの領域では、効果的な意思決定は、空間的制約を独立したステップとして扱うのではなく、意味的類似性と組み合わせることに依存する。</p>
<p>しかしデータレイヤーでは、空間データと意味データは従来別々のシステムで扱われてきた。</p>
<ul>
<li><p>地理空間データベースと空間拡張は、座標、多角形、および包含や距離のような空間的関係を格納するように設計されている。</p></li>
<li><p>ベクトルデータベースは、データの意味的な意味を表すベクトル埋め込みを扱う。</p></li>
</ul>
<p>アプリケーションが両方を必要とする場合、多くの場合、多段階のクエリパイプラインを強いられる。このような分離はシステムの複雑性を増し、クエリの待ち時間を増やし、空間的意味的推論を効率的に実行することを困難にしています。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus2.6は</a>、ベクトル類似性検索を空間制約と直接組み合わせることができる<a href="https://milvus.io/docs/geometry-field.md">Geometry Fieldを</a>導入することで、この問題に対処している。これにより、以下のようなユースケースが可能になる：</p>
<ul>
<li><p>ロケーションベースサービス（LBS）："この街区内で類似のPOIを見つける"</p></li>
<li><p>マルチモーダル検索："この地点から1km以内の類似写真を検索"</p></li>
<li><p>地図と物流："地域内の資産 "や "経路と交差するルート"</p></li>
</ul>
<p>Milvusは、空間フィルタリングに最適化されたツリーベースの構造<a href="https://milvus.io/docs/rtree.md">である</a>新しい<a href="https://milvus.io/docs/rtree.md">RTREEインデックスと</a>組み合わせることで、高次元ベクトル検索とともに、<code translate="no">st_contains</code> 、<code translate="no">st_within</code> 、<code translate="no">st_dwithin</code> のような効率的な地理空間演算子をサポートします。これらを組み合わせることで、空間を意識したインテリジェントな検索が可能になるだけでなく、実用的になる。</p>
<p>この記事では、Geometry FieldとRTREEインデックスがどのように機能するのか、また、ベクトル類似性検索とどのように組み合わせることで、実世界の空間意味的なアプリケーションを実現できるのかについて説明する。</p>
<h2 id="What-Is-a-Geometry-Field-in-Milvus" class="common-anchor-header">Milvusにおけるジオメトリーフィールドとは？<button data-href="#What-Is-a-Geometry-Field-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>ジオメトリーフィールドとは</strong>、Milvusのスキーマ定義データタイプ(<code translate="no">DataType.GEOMETRY</code>)の一つで、ジオメトリーデータを格納するために使用されます。座標のみを扱うシステムとは異なり、Milvusは<strong>Point</strong>、<strong>LineString</strong>、<strong>Polygonなどの</strong>様々な空間構造をサポートしています。</p>
<p>これにより、レストランの場所（Point）、配達区域（Polygon）、自律走行車の軌跡（LineString）といった実世界の概念を、意味ベクトルを格納する同じデータベース内で表現することが可能になる。言い換えれば、Milvusは、何かが<em>どこにあるのか</em>、そして<em>それが何を意味する</em>のかを示す統一されたシステムとなる。</p>
<p>ジオメトリ値は、ジオメトリデータの挿入とクエリのための人間可読標準である<a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT)</a>フォーマットを使用して保存される。WKT形式の文字列はMilvusのレコードに直接挿入することができるため、データのインジェストやクエリを簡素化することができます。例えば</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">RTREEインデックスとは？<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusがGeometryデータタイプを導入すると、空間オブジェクトをフィルタリングする効率的な方法が必要になります。Milvusは、2段階の空間フィルタリングパイプラインを使用してこれを処理します：</p>
<ul>
<li><p><strong>粗いフィルタリング：</strong>粗いフィルタリング：RTREEなどの空間インデックスを使用して、候補をすばやく絞り込みます。</p></li>
<li><p><strong>細かいフィルタリング：</strong>残った候補に対して正確なジオメトリチェックを適用し、境界での正確性を確保します。</p></li>
</ul>
<p>この設計では、パフォーマンスと精度のバランスをとっています。空間インデックスは無関係なデータを積極的に除去し、正確なジオメトリチェックは、包含、交差、距離しきい値などの演算子の正しい結果を保証します。</p>
<p>このパイプラインの中核となるのが<strong>RTREE（Rectangle Tree</strong>）で、幾何学データに対するクエリを高速化するために設計された空間インデックス構造です。RTREEは、<strong>最小境界矩形（MBR）を</strong>使用してオブジェクトを階層的に整理することで、クエリ実行時に検索空間の大部分をスキップできるようにします。</p>
<h3 id="Phase-1-Building-the-RTREE-Index" class="common-anchor-header">フェーズ1：RTREEインデックスの構築</h3><p>RTREEの構築は、近傍の空間オブジェクトをより大きな境界領域にグループ化するボトムアッププロセスに従って行われます：</p>
<p><strong>1.リーフノードを作成します：</strong>リーフノードの作成：各ジオメトリオブジェクトについて、<strong>最小境界矩形（MBR</strong>：<strong>Minimum Bounding Rectangle）</strong>（オブジェクトを完全に含む最小の矩形）を計算し、リーフノードとして格納します。</p>
<p><strong>2.より大きなボックスにグループ化します：</strong>近くのリーフノードをクラスタ化し、各グループを新しい MBR 内にラップして内部ノードを生成します。</p>
<p><strong>3.ルート・ノードを追加する：</strong>MBRがすべての内部グループをカバーするルートノードを作成し、高さバランスの取れたツリー構造を形成する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>フェーズ2：クエリの高速化</strong></p>
<p><strong>1.クエリMBRの形成：</strong>クエリで使用するジオメトリのMBRを計算する。</p>
<p><strong>2.ブランチを刈り込む：</strong>ルートから始めて、クエリMBRと各内部ノードを比較します。MBR がクエリ MBR と交差しないブランチはスキップします。</p>
<p><strong>3.候補を集める：</strong>交差する枝に降り、候補となる葉ノードを集める。</p>
<p><strong>4.正確なマッチングの実行：</strong>各候補について、空間述語を実行して正確な結果を得ます。</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">RTREEが高速な理由</h3><p>RTREEが空間フィルタリングで高い性能を発揮できるのは、いくつかの重要な設計上の特徴があるからです：</p>
<ul>
<li><p><strong>各ノードがMBRを格納：</strong>各ノードは、そのサブツリー内のすべてのジオメトリの面積を近似します。これにより、クエリ中にブランチを探索すべきかどうかを簡単に判断できます。</p></li>
<li><p><strong>高速な枝刈り：</strong>MBRがクエリ領域と交差する部分木のみが探索されます。無関係な領域は完全に無視される。</p></li>
<li><p><strong>データサイズに合わせて拡張可能：</strong>RTREEは<strong>O(log N)</strong>時間で空間検索をサポートするため、データセットが拡張しても高速なクエリが可能です。</p></li>
<li><p><strong>Boost.Geometryの実装</strong>Milvusは、最適化されたジオメトリアルゴリズムと、並行処理に適したスレッドセーフなRTREE実装を提供する、広く使用されているC++ライブラリである<a href="https://www.boost.org/library/latest/geometry/">Boost.Geometryを</a>使用してRTREEインデックスを構築します。</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">サポートされるジオメトリ演算子</h3><p>Milvusは、幾何学的関係に基づいてエンティティのフィルタリングと取得を可能にする一連の空間演算子を提供します。これらの演算子は、オブジェクトが空間内で互いにどのように関連しているかを理解する必要があるワークロードに不可欠です。</p>
<p>以下の表は、Milvus で現在利用可能な<a href="https://milvus.io/docs/geometry-operators.md">ジオメトリ演算子の</a>一覧です。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>演算子</strong></th><th style="text-align:center"><strong>説明</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">ジオメトリ A と B が少なくとも 1 つの共通点を持つ場合に TRUE を返します。</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">ジオメトリ A がジオメトリ B を（境界を除いて）完全に含む場合に TRUE を返します。</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">これは st_contains(A, B) の逆です。</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">形状 A が（境界を含む）形状 B を覆っている場合に TRUE を返します。</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A, B)</strong></td><td style="text-align:center">形状 A と B が境界で接触しているが、内部では交差していない場合に TRUE を返す。</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">ジオメトリ A と B が空間的に同一である場合に TRUE を返す。</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">ジオメトリ A と B が部分的に重なり、どちらも他方を完全に含まない場合に TRUE を返す。</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">A と B の距離が<em>d</em> より小さい場合に TRUE を返す。</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">ジオロケーションインデックスとベクトルインデックスの組み合わせ方</h3><p>GeometryサポートとRTREEインデックスにより、Milvusは地理空間フィルタリングとベクトル類似性検索を単一のワークフローで組み合わせることができます。このプロセスは2つのステップで行われます：</p>
<p><strong>1.</strong>1.<strong>RTREEを使用した位置によるフィルタリング：</strong>Milvusはまず、RTREEインデックスを使用して、指定された地理的範囲内（例：「2km以内」）のエンティティに検索を絞り込みます。</p>
<p><strong>2.ベクトル検索を使用したセマンティクスによるランク付け：</strong>残りの候補から、埋め込み類似度に基づき、ベクトルインデックスが上位N位までの最も類似した結果を選択する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="common-anchor-header">地理ベクトル検索の実際の使用例<button data-href="#Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1.配送サービス：よりスマートな、位置を考慮したレコメンデーション</h3><p>DoorDashやUber Eatsのようなプラットフォームは、毎日何億ものリクエストを処理している。ユーザーがアプリを開いた瞬間に、システムはユーザーの位置情報、時間帯、味の好み、配達予定時間、リアルタイムの交通状況、宅配業者の空き状況に基づいて、<em>今</em>どのレストランや宅配業者がベストマッチかを判断しなければなりません。</p>
<p>従来は、地理空間データベースと別のレコメンデーション・エンジンを照会し、フィルタリングと再ランキングを何度も繰り返す必要があった。Milvus Geolocation Indexは、このワークフローを大幅に簡素化します：</p>
<ul>
<li><p><strong>統合ストレージ</strong>- レストランの座標、宅配便の場所、ユーザーの嗜好の埋め込みをすべて1つのシステムに保存。</p></li>
<li><p><strong>共同検索</strong>- 最初に空間フィルタ（例えば、<em>3キロメートル以内のレストラン</em>）を適用し、次にベクトル検索を使用して類似性、味の好み、または品質でランク付けします。</p></li>
<li><p><strong>ダイナミックな意思決定</strong>- リアルタイムの宅配便配車と交通信号を組み合わせ、最も近い最適な宅配便を迅速に割り当てます。</p></li>
</ul>
<p>この統一されたアプローチにより、プラットフォームは1つのクエリで空間的推論と意味的推論を行うことができる。例えば、ユーザーが「カレーライス」と検索すると、milvusは意味的に関連するレストランを検索<em>し、</em>近くにあり、配達が早く、ユーザーの過去の味覚プロファイルに一致するレストランを優先する。</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2.自律走行：よりインテリジェントな判断</h3><p>自律走行では、地理空間インデクシングが知覚、位置特定、意思決定の基本となる。車両は高精細地図に絶えず位置合わせし、障害物を検知し、安全な軌道を計画しなければなりません。</p>
<p>Milvusでは、GeometryタイプとRTREEインデックスにより、以下のようなリッチな空間構造を保存し、クエリすることができます：</p>
<ul>
<li><p><strong>道路境界</strong>(LineString)</p></li>
<li><p><strong>交通規制区域</strong>（ポリゴン）</p></li>
<li><p><strong>検出された障害物</strong>（Point）</p></li>
</ul>
<p>これらの構造を効率的にインデックス化することで、地理空間データをAIの意思決定ループに直接参加させることができます。例えば、自律走行車は、RTREEの空間述語を使用するだけで、現在の座標が特定の車線内にあるか、または制限区域と交差しているかを迅速に判断することができます。</p>
<p>Milvusは、知覚システムによって生成されたベクトル埋め込み（現在の運転環境をキャプチャするシーン埋め込みなど）と組み合わせることで、半径50メートル以内の現在の運転シナリオに類似した過去の運転シナリオを検索するなど、より高度なクエリをサポートすることができます。これにより、モデルはより速く環境を解釈し、より良い判断を下すことができます。</p>
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
    </button></h2><p>ジオロケーションは緯度と経度以上のものである。ロケーションセンシティブなアプリケーションでは、<strong>イベントが発生する場所、エンティティが空間的にどのように関係するか、そしてそれらの関係がどのようにシステムの動作を形成するかについての</strong>重要なコンテキストを提供する。地理空間データを機械学習モデルからのセマンティック・シグナルと組み合わせることで、空間データとベクトルデータを別々に扱う場合には表現が難しかったり、実行効率が悪かったりする、より豊富な種類のクエリが可能になる。</p>
<p>GeometryフィールドとRTREEインデックスの導入により、Milvusはベクトル類似検索と空間フィルタリングを単一のクエリーエンジンに統合しました。これにより、アプリケーションは<strong>ベクトル、地理空間データ、時間を</strong>横断した共同検索を実行できるようになり、空間を意識した推薦システム、マルチモーダルなロケーションベース検索、地域やパスに制約のある分析などのユースケースをサポートします。さらに重要なのは、専門システム間でデータを移動させる多段パイプラインを排除することで、アーキテクチャの複雑さを軽減することだ。</p>
<p>AIシステムが現実世界の意思決定に近づき続けるにつれ、<strong><em>どのような</em></strong>コンテンツが関連性があるのかを理解することは、それが適用される<strong><em>場所や</em></strong>重要な<strong><em>タイミングと</em></strong>組み合わされることがますます必要になる。Milvusは、このような空間的意味論的ワークロードのためのビルディングブロックを、表現力と実用性を兼ね備えた方法で提供します。</p>
<p>Geometry FieldとRTREEインデックスの詳細については、以下のドキュメントをご参照ください：</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Geometry Field｜Milvusドキュメント</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE｜Milvusドキュメント</a></p></li>
</ul>
<p>Milvusの最新機能に関するご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discord チャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHub</a> に課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6の機能についてもっと知る<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6のご紹介: 10億スケールの手頃な価格のベクトル検索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">エンベッディング機能のご紹介Milvus 2.6によるベクトル化とセマンティック検索の効率化</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">MilvusのJSONシュレッダー: 88.9倍高速なJSONフィルタリングと柔軟性</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">真のエンティティレベルの検索：Milvusの新しいArray-of-StructsとMAX_SIM機能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusのMinHash LSH: LLMトレーニングデータの重複と戦う秘密兵器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで高める：MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく - ベクトルDBは真のテストに値する </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusはKafka/PulsarをWoodpeckerに置き換えた </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">実世界でのベクトル検索：リコール率を下げずに効率的にフィルタリングする方法</a></p></li>
</ul>
