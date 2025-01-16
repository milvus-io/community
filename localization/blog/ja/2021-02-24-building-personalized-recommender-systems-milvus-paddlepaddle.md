---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: 背景 はじめに
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: ディープラーニングを利用したレコメンダーシステムの構築方法
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>MilvusとPaddlePaddleによるパーソナライズド推薦システムの構築</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">背景 はじめに<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>ネットワーク技術の絶え間ない発展と電子商取引の規模が拡大し続ける中、商品の数と種類は急速に増加し、ユーザーは買いたい商品を見つけるために多くの時間を費やす必要がある。これは情報過多である。この問題を解決するために登場したのがレコメンデーションシステムである。</p>
<p>レコメンデーションシステムは、情報フィルタリングシステムのサブセットであり、映画、音楽、電子商取引、フィードストリーム・レコメンデーションなど、さまざまな分野で利用できる。レコメンデーションシステムは、ユーザーの行動を分析・マイニングすることで、ユーザーにパーソナライズされたニーズや興味を発見し、ユーザーが興味を持ちそうな情報や商品を推薦する。検索エンジンとは異なり、推薦システムはユーザーが自分のニーズを正確に記述することを必要とせず、ユーザーの過去の行動をモデル化することで、ユーザーの興味やニーズに合った情報を積極的に提供する。</p>
<p>本稿では、百度のディープラーニングプラットフォームであるPaddlePaddleを用いてモデルを構築し、ベクトル類似検索エンジンであるmilvusを組み合わせることで、ユーザーに興味ある情報を迅速かつ正確に提供できるパーソナライズド・レコメンデーションシステムを構築する。</p>
<h2 id="Data-Preparation" class="common-anchor-header">データの準備<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>MovieLens Million Dataset (ml-1m) [1]を例とする。ml-1mデータセットには、GroupLens Research labによって収集された、6,000人のユーザーによる4,000本の映画の1,000,000件のレビューが含まれている。元のデータには、映画の特徴データ、ユーザの特徴データ、ユーザの評価が含まれています。</p>
<p>ml-1mデータセットには3つの.datが含まれています: movies.dat、users.dat、rating.dat.movies.datには映画の特徴が含まれています：</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>これは、映画IDが1で、タイトルが《トイ・ストーリー》で、3つのカテゴリーに分かれていることを意味する。この3つのカテゴリーとは、アニメーション、子供向け、コメディです。</p>
<p>users.datには、ユーザーの特徴が含まれています：</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>ユーザーIDは1、女性、18歳未満。職業IDは10。</p>
<p>rating.datには、映画のレーティング機能が含まれています：</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>つまり、ユーザ1は映画1193を5点として評価している。</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">融合推薦モデル<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>映画パーソナライズド推薦システムでは、PaddlePaddleが実装しているフュージョン推薦モデル[3]を使用しました。このモデルは、PaddlePaddleの実業務から生まれたものである。</p>
<p>まず、ユーザー特徴と映画特徴をニューラルネットワークの入力とする：</p>
<ul>
<li>ユーザー特徴には、ユーザーID、性別、職業、年齢の4つの属性情報が含まれています。</li>
<li>映画特徴量には、映画ID、映画タイプID、映画名の3つの属性情報が含まれる。</li>
</ul>
<p>ユーザ特徴については、ユーザIDを256次元のベクトル表現に対応付け、全結合層に入り、他の3属性についても同様の処理を行う。そして、4つの属性の特徴表現を完全連結し、別々に追加する。</p>
<p>映画の特徴については、映画IDはユーザIDと同様の処理を行う。映画タイプIDはベクトルの形で直接完全接続層に入力され、映画名はテキスト畳み込みニューラルネットワークを用いた固定長ベクトルで表現される。その後、3つの属性の特徴表現が完全に接続され、別々に追加される。</p>
<p>ユーザと映画のベクトル表現を得た後、それらのコサイン類似度をパーソナライズド推薦システムのスコアとして計算する。最後に、類似度スコアとユーザの真のスコアの差の2乗が回帰モデルの損失関数として使用される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-user-film-personalized-recommender-milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">システム概要<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>PaddlePaddleの融合レコメンデーションモデルと組み合わせ、モデルによって生成された映画特徴ベクトルをmilvusベクトル類似検索エンジンに格納し、ユーザ特徴を検索対象ベクトルとする。Milvusで類似度検索を行うことで、クエリ結果をユーザへの推薦映画として取得します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-overview.jpg</span> </span></p>
<blockquote>
<p>Milvusでは、ベクトルの距離を計算するために、内積(IP)法が用意されている。データを正規化した後、内積類似度は融合推薦モデルにおけるコサイン類似度の結果と一致する。</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">パーソナル推薦システムの応用<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusを使った個人向け推薦システムの構築には3つのステップがあります。操作方法の詳細はMivus Bootcamp [4]を参照してください。</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">ステップ1：モデルトレーニング</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>このコマンドを実行することで、ディレクトリ内にモデルrecommender_system.inference.modelが生成され、映画データとユーザデータを特徴ベクトルに変換し、Milvusが保存・取得するためのアプリケーションデータを生成することができます。</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">ステップ2：データ前処理</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>このコマンドを実行すると、ディレクトリにテストデータ movies_data.txt が生成され、ムービーデータの前処理が行われます。</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">ステップ3：Milvusを使ったパーソナル推薦システムの実装</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>このコマンドを実行することで、指定したユーザーに対してパーソナライズされたレコメンデーションが実行されます。</p>
<p>主な処理は以下の通りです：</p>
<ul>
<li>load_inference_modelにより、映画データをモデル処理し、映画特徴ベクトルを生成する。</li>
<li>milvus.insertで映画の特徴ベクトルをmilvusにロードする。</li>
<li>milvus.search_vectorsで類似度検索を行い、ユーザと映画の類似度が最も高い結果を返す。</li>
</ul>
<p>ユーザーが興味のある映画の上位5作品を予測する：</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
<h2 id="Summary" class="common-anchor-header">まとめ<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>ユーザ情報と映画情報を融合推薦モデルに入力することで、マッチングスコアを取得し、全映画のスコアをユーザを基準にソートすることで、ユーザが興味を持ちそうな映画を推薦することができる。<strong>本稿では、MilvusとPaddlePaddleを組み合わせて、パーソナライズド推薦システムを構築する。Milvusはベクトル検索エンジンであり、すべての映画の特徴データを格納し、Milvus内のユーザ特徴に対して類似検索を行う。</strong>検索結果は、システムがユーザに推奨する映画ランキングである。</p>
<p>Milvus[5]のベクトル類似検索エンジンは、様々なディープラーニングプラットフォームと互換性があり、数十億のベクトルをわずかミリ秒のレスポンスで検索する。Milvusを使えば、AIアプリケーションの可能性をより簡単に追求することができる！</p>
<h2 id="Reference" class="common-anchor-header">参考<button data-href="#Reference" class="anchor-icon" translate="no">
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
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>PaddlePaddleによるフュージョン推薦モデル: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
