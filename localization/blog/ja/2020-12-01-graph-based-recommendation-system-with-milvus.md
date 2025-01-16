---
id: graph-based-recommendation-system-with-milvus.md
title: 推薦システムはどのように機能するのか？
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  レコメンダーシステムは、収益を生み出し、コストを削減し、競争上の優位性を提供することができる。オープンソースのツールを使って無料で構築する方法を学びましょう。
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Milvus、PinSage、DGL、MovieLensデータセットによるグラフベースの推薦システムの構築</custom-h1><p>レコメンデーションシステムは、人間が不要な電子メールをふるいにかけるのに役立つ、<a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">質素な始まりの</a>アルゴリズムによって動いている。1990年、発明者のダグ・テリーは、協調フィルタリングアルゴリズムを使って、迷惑メールから望ましいメールを選別した。同じような内容のメールに対して同じことをする他の人たちと協力して、メールを「好き」または「嫌い」にするだけで、ユーザーは、何をユーザーの受信トレイに送り、何を迷惑メールフォルダに隔離すべきかを判断するよう、コンピュータを素早く訓練することができた。</p>
<p>一般的な意味で、レコメンデーション・システムとは、ユーザーに適切な提案をするアルゴリズムのことである。サジェスチョンとは、見るべき映画、読むべき本、買うべき商品など、シナリオや業界によって様々なものがある。このようなアルゴリズムは私たちの身の回りに存在し、Youtube、Amazon、Netflixなどの大手テクノロジー企業から、私たちが消費するコンテンツや購入する商品に影響を与えている。</p>
<p>うまく設計されたレコメンデーションシステムは、不可欠な収益源、コスト削減、競争上の差別化要因となり得る。オープンソースの技術と計算コストの低下のおかげで、カスタマイズされたレコメンデーションシステムはかつてないほど身近なものとなった。この記事では、オープンソースのベクトル・データベースであるMilvus、グラフ畳み込みニューラルネットワーク（GCN）であるPinSage、グラフ上でのディープラーニングのためのスケーラブルなPythonパッケージであるディープグラフ・ライブラリ（DGL）、そしてMovieLensデータセットを使用して、グラフベースのレコメンデーションシステムを構築する方法を説明する。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">推薦システムはどのように機能するのか？</a></li>
<li><a href="#tools-for-building-a-recommender-system">推薦システムを構築するためのツール</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Milvusを使ったグラフベースの推薦システムの構築</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">推薦システムはどのように機能するのか？<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>推薦システムの構築には、協調フィルタリングとコンテンツベースフィルタリングという2つの一般的なアプローチがあります。ほとんどの開発者は、どちらか、あるいは両方の方法を利用しており、推薦システムは複雑さと構築において様々ですが、一般的に3つの核となる要素を含んでいます：</p>
<ol>
<li><strong>ユーザーモデル：</strong>ユーザーモデル：推薦システムはユーザーの特性、好み、ニーズをモデル化する必要がある。多くの推薦システムは、ユーザーからの暗黙的または明示的なアイテムレベルの入力に基づいて提案を行います。</li>
<li><strong>オブジェクトモデル：</strong>レコメンダーシステムはまた、ユーザーのポートレートに基づいてアイテムの推薦を行うために、アイテムをモデル化する。</li>
<li><strong>推薦アルゴリズム：</strong>推薦システムの核となるのは、推薦を行うアルゴリズムである。よく使われるアルゴリズムには、協調フィルタリング、暗黙的セマンティックモデリング、グラフベースモデリング、複合レコメンデーションなどがある。</li>
</ol>
<p>高度なレベルでは、協調フィルタリングに依存する推薦システムは、ユーザーが興味を持ちそうなものを予測するために、過去のユーザー行動（類似ユーザーからの行動入力を含む）からモデルを構築します。コンテンツベースのフィルタリングに依存するシステムは、アイテムの特徴に基づいた個別の定義済みタグを使用して、類似のアイテムを推薦する。</p>
<p>協調フィルタリングの例は、Spotifyのパーソナライズされたラジオステーションで、ユーザーのリスニング履歴、興味、音楽ライブラリなどに基づいている。このステーションは、ユーザーが保存していない、あるいは興味を示していないが、同じような趣味を持つ他のユーザーがよく聴いている音楽を流す。コンテンツベースのフィルタリングの例としては、特定の曲やアーティストに基づいたラジオ局があり、入力の属性を利用して類似の音楽を推薦する。</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">推薦システムを構築するツール<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>この例では、グラフベースのレコメンデーションシステムをゼロから構築する場合、以下のツールに依存する：</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage：グラフ畳み込みネットワーク</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSageは</a>ランダムウォークのグラフ畳み込みネットワークで、何十億ものオブジェクトを含むウェブスケールのグラフのノードの埋め込みを学習することができる。このネットワークは、オンライン・ピンボードの会社である<a href="https://www.pinterest.com/">Pinterestによって</a>開発された。</p>
<p>Pinterestのユーザーは、興味のあるコンテンツを「ボード」に「ピン」することができる。<a href="https://business.pinterest.com/audience/">4億7,800万人</a>以上の月間アクティブユーザー（MAU）と<a href="https://newsroom.pinterest.com/en/company">2,400億</a>以上のオブジェクトが保存されているため、同社は膨大な量のユーザーデータを保有しており、それに対応するために新しいテクノロジーを構築しなければならない。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSageは、ピン-ボード二部グラフを使用して、ユーザーに視覚的に類似したコンテンツを推薦するために使用されるピンから高品質の埋め込みを生成する。特徴行列と完全なグラフに対して畳み込みを行う従来のGCNアルゴリズムとは異なり、PinSageは近傍のノード/ピンをサンプリングし、計算グラフを動的に構築することで、より効率的な局所畳み込みを行う。</p>
<p>ノードの近傍全体に対して畳み込みを実行すると、膨大な計算グラフになる。リソース要件を削減するために、従来のGCNアルゴリズムはkホップ近傍の情報を集約してノードの表現を更新する。PinSageはランダムウォークをシミュレートし、頻繁に訪問されるコンテンツをキーとなる近傍として設定し、それに基づいて畳み込みを構築する。</p>
<p>kホップ近傍は重複していることが多いため、ノードのローカル畳み込みは計算の繰り返しになる。これを回避するため、PinSageは各集計ステップにおいて、計算を繰り返すことなくすべてのノードをマップし、対応する上位ノードにリンクし、最後に上位ノードの埋め込みを取得する。</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">ディープグラフライブラリ：グラフ上のディープラーニングのためのスケーラブルなPythonパッケージ</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-graph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library（DGL</a>）は、既存のディープラーニングフレームワーク（PyTorch、MXNet、Gluonなど）の上にグラフベースのニューラルネットワークモデルを構築するために設計されたPythonパッケージです。DGLはユーザーフレンドリーなバックエンドインターフェースを備えており、テンソルに基づくフレームワークや自動生成をサポートするフレームワークへの組み込みが容易である。前述のPinSageアルゴリズムは、DGLとPyTorchでの使用に最適化されている。</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: AIと類似検索のために作られたオープンソースのベクトルデータベース</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>milvusの仕組み.png</span> </span></p>
<p>Milvusは、ベクトル類似性検索と人工知能（AI）アプリケーションのために構築されたオープンソースのベクトルデータベースです。Milvusを類似検索に使用すると、次のように動作します：</p>
<ol>
<li>ディープラーニングモデルを使って非構造化データを特徴ベクトルに変換し、Milvusにインポートする。</li>
<li>Milvusは特徴ベクトルを保存し、インデックスを作成する。</li>
<li>Milvusは、リクエストに応じて、入力ベクトルに最も類似したベクトルを検索して返す。</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Milvusによるグラフベースの推薦システムの構築<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-プラットフォーム-ダイアグラム.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-グラフベース推薦システムの構築.png</span> </span></p>
<p>Milvusを用いたグラフベース推薦システムの構築は以下のステップで行われる：</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">ステップ1：データの前処理</h3><p>データの前処理とは、生データをより理解しやすい形式に変えることである。この例では、6,000人のユーザーによって投稿された4,000本の映画に対する1,000,000の評価を含むオープンデータセットMovieLens[5] (m1-1m)を使用しています。このデータはGroupLensによって収集され、映画の説明、映画の評価、ユーザーの特徴が含まれています。</p>
<p>この例で使用したMovieLensデータセットは、データのクリーニングや整理を最小限に抑える必要があることに注意してください。しかし、異なるデータセットを使用する場合、あなたのマイレージは異なるかもしれません。</p>
<p>レコメンデーションシステムの構築を開始するには、MovieLensデータセットから過去のユーザー-映画データを使用して、分類目的のためのユーザー-映画二部グラフを構築します。</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">ステップ 2: PinSageでモデルをトレーニングする</h3><p>PinSageモデルを使用して生成されたピンの埋め込みベクトルは、取得した映画情報の特徴ベクトルです。二部グラフgとカスタマイズされた映画特徴ベクトルの次元（デフォルトでは256-d）に基づいてPinSageモデルを作成する。次に、PyTorchでモデルを学習し、4,000本の映画のh_item embeddingsを取得する。</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">ステップ3：データのロード</h3><p>MilvusにPinSageモデルによって生成されたムービー埋め込みh_itemを読み込み、対応するIDを返します。そのIDと対応する映画情報をMySQLにインポートする。</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">ステップ4：ベクトル類似度検索の実行</h3><p>映画IDからMilvusで対応する埋め込みベクトルを取得し、Milvusで類似度検索を行う。次に、MySQLデータベース内の対応する映画情報を特定する。</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">ステップ5：レコメンデーション</h3><p>システムはユーザーの検索クエリに最も類似した映画を推薦する。これが推薦システム構築の一般的なワークフローである。レコメンデーション・システムやその他のAIアプリケーションを素早くテストして導入するには、Milvus<a href="https://github.com/milvus-io/bootcamp">ブートキャンプを</a>お試しください。</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvusはレコメンダーシステム以外にも力を発揮します。<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、人工知能やベクトル類似性検索アプリケーションの膨大な数に力を与えることができる強力なツールです。プロジェクトの詳細については、以下のリソースをご覧ください：</p>
<ul>
<li><a href="https://zilliz.com/blog">ブログを</a>読む</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>オープンソースコミュニティと交流する。</li>
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>世界で最も人気のあるベクトル・データベースを使用または貢献する。</li>
</ul>
