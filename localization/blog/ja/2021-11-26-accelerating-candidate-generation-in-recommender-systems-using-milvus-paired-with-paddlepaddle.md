---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: MilvusとPaddlePaddleの組み合わせによる推薦システムの候補生成の高速化
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: 推薦システムの最小ワークフロー
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>もしあなたがレコメンダー・システムを開発した経験があるなら、少なくとも以下のどれかの犠牲になっている可能性が高い：</p>
<ul>
<li>膨大なデータセットのため、システムが結果を返すのに非常に時間がかかる。</li>
<li>新しく挿入されたデータを検索や問い合わせのためにリアルタイムで処理できない。</li>
<li>レコメンダーシステムの導入は困難である。</li>
</ul>
<p>この記事では、オープンソースのベクトル・データベースであるmilvusと、ディープラーニング・プラットフォームであるPaddlePaddleを組み合わせた製品レコメンダー・システム・プロジェクトを紹介することで、上記の問題を解決し、何らかのヒントを提供することを目的とする。</p>
<p>この記事では、レコメンダー・システムの最小限のワークフローを簡単に説明する。そして、このプロジェクトの主なコンポーネントと実装の詳細を紹介する。</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">レコメンダーシステムの基本的なワークフロー<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>プロジェクト自体に深く入る前に、まずレコメンダーシステムの基本的なワークフローを見てみよう。レコメンダーシステムは、ユーザー独自の興味やニーズに応じてパーソナライズされた結果を返すことができる。このようなパーソナライズされた推薦を行うために、システムは候補の生成とランキングという2つの段階を経る。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>最初の段階は候補の生成で、ユーザーのプロフィールに合致する商品や動画など、最も関連性の高い、あるいは類似したデータを返す。候補生成の際、システムはユーザーの特徴をデータベースに保存されているデータと比較し、類似したものを検索する。そして、ランキングでは、検索されたデータに点数を付け、並び替える。最後に、リストの上位にある結果がユーザーに表示される。</p>
<p>商品推薦システムの場合、まずユーザーのプロファイルと在庫商品の特徴を比較し、ユーザーのニーズに合った商品リストをフィルタリングする。次に、システムはユーザープロファイルとの類似性に基づいて製品を採点し、ランク付けし、最後に上位10製品をユーザーに返す。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">システム・アーキテクチャ<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>このプロジェクトにおける商品推薦システムは、3つのコンポーネントを使用している：MIND、PaddleRec、milvusである。</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MINDは</a>「Multi-Interest Network with Dynamic Routing for Recommendation at Tmall」の略で、アリババグループが開発したアルゴリズムである。MINDが提案される以前、推薦のための一般的なAIモデルのほとんどは、ユーザーの多様な興味を表すために単一のベクトルを使用していた。しかし、単一のベクトルでは、ユーザーの興味を正確に表すには不十分である。そこで、ユーザーの複数の興味を複数のベクトルに変換するMINDアルゴリズムが提案された。</p>
<p>具体的には、MINDは候補生成の段階で、一人のユーザーの複数の興味を処理するために、動的ルーティングを持つ<a href="https://arxiv.org/pdf/2005.09347">多興味ネットワークを</a>採用する。多関心ネットワークは、カプセルルーティング機構上に構築された多関心抽出器のレイヤーである。ユーザーの過去の行動と複数の興味を組み合わせることで、正確なユーザープロファイルを提供することができる。</p>
<p>以下の図は、MINDのネットワーク構造を示している。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>ユーザーの特徴を表現するために、MINDはユーザー行動とユーザー興味を入力とし、それらを埋め込み層に送り込み、ユーザー興味ベクトルとユーザー行動ベクトルを含むユーザーベクトルを生成します。次に、ユーザー行動ベクトルを多関心抽出層に入力し、ユーザーの関心カプセルを生成する。ユーザー関心カプセルをユーザー行動埋め込みと連結し、複数のReLU層を使って変換した後、MINDは複数のユーザー表現ベクトルを出力する。本プロジェクトでは、MINDは最終的に4つのユーザー表現ベクトルを出力すると定義している。</p>
<p>一方、商品特性は埋め込み層を通り、スパースな項目ベクトルに変換される。次に、各項目ベクトルはプーリング層を通り、密なベクトルになる。</p>
<p>すべてのデータがベクトルに変換されると、学習プロセスを導くために、ラベルを意識したアテンション層が追加導入される。</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRecは</a>推薦のための大規模検索モデルライブラリである。Baiduの<a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>エコシステムの一部である。PaddleRecは、推薦システムを簡単かつ迅速に構築するための統合ソリューションを開発者に提供することを目的としている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>冒頭で述べたように、レコメンダーシステムを開発するエンジニアは、ユーザビリティの低さやシステムの複雑な展開といった課題に直面することが多い。しかし、PaddleRecは以下の点で開発者を支援することができる：</p>
<ul>
<li><p>使いやすさ：PaddleRecはオープンソースライブラリで、候補生成、ランキング、再ランキング、マルチタスクなど、業界で人気のある様々なモデルをカプセル化しています。PaddleRecを使えば、モデルの有効性を即座にテストし、反復によってその効率を向上させることができます。PaddleRecは分散システム用のモデルを優れたパフォーマンスで簡単にトレーニングする方法を提供します。疎なベクトルの大規模データ処理に最適化されています。PaddleRecは簡単に水平方向に拡張することができ、計算速度を高速化することができます。そのため、PaddleRecを使ってKubernetes上に学習環境を素早く構築することができます。</p></li>
<li><p>デプロイのサポートPaddleRecはモデルのオンラインデプロイメントソリューションを提供します。柔軟性と高可用性を特徴とし、トレーニング後すぐにモデルを使用することができます。</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvusは</a>クラウドネイティブなアーキテクチャを特徴とするベクトルデータベースである。<a href="https://github.com/milvus-io">GitHubで</a>オープンソース化されており、ディープニューラルネットワークやその他の機械学習（ML）モデルによって生成された膨大な埋め込みベクトルの保存、インデックス付け、管理に使用できる。Milvusは、Faiss、NMSLIB、Annoyなど、いくつかのファーストクラスの近似最近傍（ANN）検索ライブラリをカプセル化している。Milvusは必要に応じてスケールアウトすることもできます。Milvusサービスは可用性が高く、バッチ処理とストリーム処理を統合的にサポートします。Milvusは、非構造化データの管理プロセスを簡素化し、異なる導入環境においても一貫したユーザーエクスペリエンスを提供することをお約束します。以下のような特徴がある：</p>
<ul>
<li><p>膨大なデータセットに対してベクトル検索を行う際の高いパフォーマンス。</p></li>
<li><p>多言語サポートとツールチェーンを提供する開発者ファーストのコミュニティ。</p></li>
<li><p>クラウド・スケーラビリティと障害発生時の高い信頼性。</p></li>
<li><p>スカラーフィルタリングとベクトル類似検索の組み合わせによるハイブリッド検索。</p></li>
</ul>
<p>Milvusは、システムの安定性を維持しつつ、頻繁なデータ更新の問題を解決できるため、このプロジェクトではベクトル類似検索とベクトル管理に使用されている。</p>
<h2 id="System-implementation" class="common-anchor-header">システムの実装<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>本プロジェクトで商品推薦システムを構築するためには、以下のステップを踏む必要がある：</p>
<ol>
<li>データ処理</li>
<li>モデルトレーニング</li>
<li>モデルのテスト</li>
<li>商品アイテム候補の生成<ol>
<li>データ保存：学習されたモデルによりアイテムベクトルが得られ、Milvusに保存される。</li>
<li>データ検索：MINDによって生成された4つのユーザーベクトルがMilvusに入力され、ベクトル類似度検索が行われる。</li>
<li>データランキング：4つのベクトルにはそれぞれ、<code translate="no">top_k</code> 類似したアイテムベクトルがあり、<code translate="no">top_k</code> ベクトルの4つのセットがランク付けされ、<code translate="no">top_k</code> 最も類似したベクトルの最終リストが返される。</li>
</ol></li>
</ol>
<p>このプロジェクトのソースコードは<a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a>プラットフォームでホストされている。以下は、このプロジェクトのソースコードの詳細な説明である。</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">ステップ1.データ処理</h3><p>元のデータセットは、<a href="https://github.com/THUDM/ComiRec">ComiRecによって</a>提供されたアマゾンの書籍データセットから来ている。しかし、このプロジェクトではPaddleRecからダウンロードされ、処理されたデータを使用する。詳細はPaddleRecプロジェクトの<a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">AmazonBookデータセットを</a>参照。</p>
<p>学習用のデータセットは以下のような形式を想定しており、各列は以下のように表現される：</p>
<ul>
<li><code translate="no">Uid</code>:ユーザーID。</li>
<li><code translate="no">item_id</code>:ユーザーがクリックした商品のID。</li>
<li><code translate="no">Time</code>:クリックのタイムスタンプまたは順序。</li>
</ul>
<p>テスト用のデータセットは、各カラムが以下のようなフォーマットで表示されます：</p>
<ul>
<li><p><code translate="no">Uid</code>:ユーザーID。</p></li>
<li><p><code translate="no">hist_item</code>:過去のユーザーのクリック行動における商品アイテムのID。複数の<code translate="no">hist_item</code> 、タイムスタンプに従ってソートされます。</p></li>
<li><p><code translate="no">eval_item</code>:ユーザーが実際に商品をクリックした順序。</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">ステップ2.モデル学習</h3><p>モデル学習では、前ステップで処理されたデータを用い、PaddleRec上に構築された候補生成モデルMINDを採用する。</p>
<h4 id="1-Model-input" class="common-anchor-header">1.<strong>モデル</strong> <strong>入力</strong></h4><p><code translate="no">dygraph_model.py</code> で、以下のコードを実行し、データを処理してモデル入力にする。この処理では、元データの同一ユーザがクリックした項目をタイムスタンプに従ってソートし、それらを組み合わせてシーケンスを形成する。そして、シーケンスの中からランダムに<code translate="no">item``_``id</code> を<code translate="no">target_item</code> として選択し、<code translate="no">target_item</code> より前の 10 個のアイテムを<code translate="no">hist_item</code> として抽出し、モデル入力とする。シーケンスの長さが十分でない場合は、0とすることができる。<code translate="no">seq_len</code> は、<code translate="no">hist_item</code> シーケンスの実際の長さでなければならない。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>元のデータセットを読み込むコードについては、スクリプト<code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> を参照のこと。</p>
<h4 id="2-Model-networking" class="common-anchor-header">2.<strong>モデルのネットワーク化</strong></h4><p>以下のコードは、<code translate="no">net.py</code> の抜粋である。<code translate="no">class Mind_Capsual_Layer</code> は、インタレスト・カプセル・ルーティング・メカニズム上に構築されたマルチインタレスト・エクストラクタ・レイヤーを定義している。関数<code translate="no">label_aware_attention()</code> は、MINDアルゴリズムにおけるラベルを意識した注意技法を実装している。<code translate="no">class MindLayer</code> の<code translate="no">forward()</code> 関数は、ユーザー特性をモデル化し、対応する重みベクトルを生成する。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>MINDの具体的なネットワーク構造については、スクリプト<code translate="no">/home/aistudio/recommend/model/mind/net.py</code> を参照。</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3.<strong>モデルの最適化</strong></h4><p>このプロジェクトでは、モデル最適化として<a href="https://arxiv.org/pdf/1412.6980">Adamアルゴリズムを</a>使用している。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>加えて、PaddleRecはハイパーパラメータを<code translate="no">config.yaml</code> に書き込むので、このファイルを修正するだけで、2つのモデルの有効性を明確に比較することができ、モデルの効率を向上させることができます。モデルをトレーニングする際、モデルの効果が悪いのは、モデルのアンダーフィットやオーバーフィットが原因である可能性があります。したがって、トレーニングのラウンド数を変更することで改善することができます。このプロジェクトでは、<code translate="no">config.yaml</code> のパラメータ epochs を変更するだけで、最適な学習ラウンド数を見つけることができます。さらに、デバッグのために、モデル・オプティマイザ、<code translate="no">optimizer.class</code> 、<code translate="no">learning_rate</code> を変更することもできます。以下は、<code translate="no">config.yaml</code> のパラメータの一部を示しています。</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>詳細な実装については、スクリプト<code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> を参照してください。</p>
<h4 id="4-Model-training" class="common-anchor-header">4.<strong>モデル学習</strong></h4><p>以下のコマンドを実行し、モデル学習を開始する。</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>モデルトレーニングプロジェクトは<code translate="no">/home/aistudio/recommend/model/trainer.py</code> を参照。</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">ステップ3.モデルのテスト</h3><p>このステップでは、テストデータセットを用いて、学習済みモデルの想起率などの性能を検証する。</p>
<p>モデルのテストでは、全ての項目ベクトルがモデルから読み込まれ、オープンソースのベクトルデータベースであるMilvusにインポートされます。スクリプト<code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code> を使ってテストデータセットを読み込みます。前のステップでモデルをロードし、テストデータセットをモデルに投入して、ユーザーの4つの関心ベクトルを得る。Milvusで4つの関心ベクトルに最も類似した50のアイテムベクトルを検索する。返された結果をユーザに推薦することができる。</p>
<p>次のコマンドを実行してモデルをテストする。</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>モデルのテスト中、システムはRecall@50、NDCG@50、HitRate@50といったモデルの有効性を評価するためのいくつかの指標を提供します。この記事では、1つのパラメーターの変更のみを紹介します。しかし、あなた自身のアプリケーションシナリオでは、より良いモデル効果を得るために、より多くのエポックを訓練する必要があります。  また、異なるオプティマイザを使用したり、異なる学習レートを設定したり、テストのラウンド数を増やしたりすることで、モデルの効果を向上させることができます。異なる効果を持つ複数のモデルを保存し、最もパフォーマンスが良く、アプリケーションに最も適合するものを選択することをお勧めします。</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">ステップ4.商品アイテム候補の生成</h3><p>商品候補生成サービスを構築するために、このプロジェクトでは前のステップで学習したモデルをMilvusと組み合わせて使用します。候補生成の間、FASTAPIはインターフェースを提供するために使用されます。サービスが起動すると、<code translate="no">curl</code> を介してターミナルで直接コマンドを実行することができます。</p>
<p>以下のコマンドを実行して予備候補を生成する。</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>このサービスは4種類のインターフェースを提供する：</p>
<ul>
<li><strong>挿入</strong>：Insert : 以下のコマンドを実行することで、モデルからアイテムベクトルを読み込み、milvusのコレクションに挿入します。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>予備候補の生成</strong>ユーザーがクリックした商品の順番を入力し、次にクリックする可能性のある商品を探します。また、複数のユーザーの商品アイテム候補を一括で生成することもできます。以下のコマンドの<code translate="no">hist_item</code> は2次元ベクトルで、各行はユーザーが過去にクリックした商品のシーケンスを表します。シーケンスの長さを定義することができます。返される結果も 2 次元ベクトルのセットで、各行は返されたユーザーの<code translate="no">item id</code>s を表します。</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>商品アイテムの</strong><strong>総数を</strong>問い合わせる：以下のコマンドを実行すると、Milvusデータベースに保存されている商品ベクトルの総数が返されます。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>削除する</strong>：以下のコマンドを実行し、Milvusデータベースに保存されているすべてのデータを削除します。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>ローカルサーバで候補作成サービスを実行している場合、<code translate="no">127.0.0.1:8000/docs</code> から上記のインターフェースにアクセスすることもできます。つのインターフェイスをクリックし、パラメーターの値を入力することで操作することができます。その後、"Try it out "をクリックすると、推薦結果が表示されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">まとめ<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事では、主にレコメンダーシステム構築における候補生成の第一段階に焦点を当てている。また、MilvusとMINDアルゴリズム、PaddleRecを組み合わせることで、このプロセスを高速化するソリューションを提供し、冒頭で提案した問題に対処した。</p>
<p>膨大なデータセットのために、システムが結果を返すときに極端に遅いとしたら？オープンソースのベクトルデータベースであるMilvusは、数百万、数十億、あるいは数兆のベクトルを含む高密度ベクトルデータセットに対して、驚くほど高速な類似性検索ができるように設計されている。</p>
<p>新しく挿入されたデータが検索やクエリのためにリアルタイムで処理できない場合はどうすればよいでしょうか？Milvusはバッチ処理とストリーム処理を統合的にサポートしており、新しく挿入されたデータをリアルタイムで検索やクエリを行うことができます。また、MINDモデルは新しいユーザーの行動をリアルタイムに変換し、ユーザーベクトルを瞬時にMilvusに挿入することが可能です。</p>
<p>複雑なデプロイは敷居が高いと感じたら？PaddlePaddleエコシステムに属する強力なライブラリであるPaddleRecは、レコメンデーションシステムやその他のアプリケーションを簡単かつ迅速に展開するための統合ソリューションを提供します。</p>
<h2 id="About-the-author" class="common-anchor-header">著者について<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>ZillizのデータエンジニアであるYunmei Liは、華中科技大学でコンピュータサイエンスの学位を取得。Zillizに入社して以来、オープンソースプロジェクトMilvusのソリューションを模索し、ユーザーがMilvusを実世界のシナリオに適用できるよう支援している。主にNLPとレコメンデーションシステムを研究しており、この2つの分野をさらに深めたいと考えている。一人で過ごす時間と読書が好き。</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">より多くのリソースをお探しですか？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>レコメンダー・システム構築のユーザー事例をもっと見る：<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">milvusとVipshopでパーソナライズされた商品推薦システムを構築する</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Milvusでワードローブと衣装計画アプリを構築する</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Sohuニュースアプリ内でインテリジェントなニュース推薦システムを構築する</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">アイテムベースの協調フィルタリングによる音楽推薦システム</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Milvusと作る: XiaomiのモバイルブラウザにAIを搭載したニュース推薦システムを組み込む</a></li>
</ul></li>
<li>Milvusと他のコミュニティとの共同プロジェクト：<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">ONNXとmilvusを使った画像検索のためのAIモデルの組み合わせ</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Milvus、PinSage、DGL、Movielensデータセットによるグラフベースの推薦システムの構築</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">JuiceFSに基づくMilvusクラスタの構築</a></li>
</ul></li>
<li>オープンソースコミュニティ<ul>
<li><a href="https://bit.ly/307b7jC">GitHubで</a>Milvusを見つける、またはMilvusに貢献する。</li>
<li><a href="https://bit.ly/3qiyTEk">フォーラムで</a>コミュニティと交流する</li>
<li><a href="https://bit.ly/3ob7kd8">ツイッターで</a>つながる</li>
</ul></li>
</ul>
