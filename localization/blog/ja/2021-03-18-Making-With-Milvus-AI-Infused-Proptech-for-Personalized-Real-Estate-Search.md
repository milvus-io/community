---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: MilvusのAIを活用したプロプテックによるパーソナライズされた不動産検索の実現
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: AIは不動産業界を変革しています。インテリジェントなプロップテックがどのように住宅検索と購入プロセスを加速させるかをご覧ください。
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>Milvusで作る：パーソナライズされた不動産検索のためのAIを組み込んだプロテック</custom-h1><p>人工知能(AI)は不動産業界において<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">強力なアプリケーションを</a>持ち、家探しのプロセスを一変させつつある。技術に精通した不動産の専門家は、顧客がより早く適切な住宅を見つけ、不動産購入のプロセスを簡素化するのに役立つ能力を認識し、何年も前からAIを活用してきた。コロナウイルスの大流行は、不動産テクノロジー（またはプロテック）への関心、採用、投資を世界中で<a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">加速させて</a>おり、不動産業界において今後ますます大きな役割を果たすことを示唆している。</p>
<p>この記事では、<a href="https://bj.ke.com/">Beikeが</a>ベクトル類似性検索を利用して、パーソナライズされた結果を提供し、ほぼリアルタイムで物件を推薦する家探しプラットフォームを構築した方法を探る。</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">ベクトル類似検索とは？</h3><p><a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">ベクトル類似性検索は</a>、人工知能、ディープラーニング、伝統的なベクトル計算のシナリオなど、多岐に渡る応用が可能だ。AI技術の普及は、ベクトル検索と、画像、動画、音声、行動データ、文書、その他多くのものを含む非構造化データを理解する能力に起因している。</p>
<p>非構造化データは全データの80～90％を占めると推定され、そこから洞察を引き出すことは、変化し続ける世界で競争力を維持したい企業にとって、急速に必要条件となりつつある。非構造化データ分析に対する需要の高まり、コンピュートパワーの上昇、コンピュートコストの低下により、AIを活用したベクトル検索がこれまで以上に身近なものとなっている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>従来、非構造化データは、事前に定義されたモデルや組織構造に従っていないため、大規模な処理や分析が困難でした。ニューラルネットワーク（CNN、RNN、BERTなど）は、非構造化データを特徴ベクトル（コンピュータが容易に解釈できる数値データ形式）に変換することを可能にする。そして、コサイン類似度やユークリッド距離のようなメトリクスを使用して、ベクトル間の類似性を計算するアルゴリズムが使用される。</p>
<p>結局のところ、ベクトル類似性検索とは、膨大なデータセットから類似したものを特定するための技術を表す広い用語なのだ。Beikeはこの技術を使って、個々のユーザーの好み、検索履歴、物件条件に基づいて自動的に物件を推薦するインテリジェントな住宅検索エンジンを提供し、不動産検索と購入プロセスを加速させている。Milvusは、情報とアルゴリズムを結びつけるオープンソースのベクトルデータベースであり、BeikeがAI不動産プラットフォームを開発・管理することを可能にしている。</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Milvusはどのようにベクトルデータを管理するのか？</h3><p>Milvusは大規模なベクトルデータ管理のために特別に構築され、画像や動画の検索、化学物質の類似性分析、パーソナライズされた推薦システム、会話AIなど、さまざまな用途に応用されている。Milvusに格納されたベクトルデータセットは、ほとんどの実装がこの一般的なプロセスに従い、効率的にクエリすることができます：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">BeikeはどのようにMilvusを使って家探しをスマートにしているのか？</h3><p>中国のZillowへの回答としてよく言われるBeikeは、不動産業者が賃貸・売買物件を掲載できるオンラインプラットフォームである。家探しの体験を向上させ、エージェントがより早く取引を成立させるために、同社は物件データベースにAIを搭載した検索エンジンを構築した。Beikeの不動産物件データベースは、特徴ベクトルに変換された後、Milvusに供給され、インデックス作成と保存が行われた。Milvusは、入力された物件、検索条件、ユーザープロファイル、その他の条件に基づいて類似検索を行うために使用される。</p>
<p>例えば、ある物件に類似する住宅を検索する場合、間取り、広さ、向き、内装仕上げ、塗装色などの特徴が抽出される。物件リストの元データベースは<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">インデックス化されている</a>ため、検索はわずか数ミリ秒で実行できる。Beike社の最終製品では、300万以上のベクトルを含むデータセットで平均クエリー時間は113ミリ秒だった。しかし、Milvusは1兆スケールのデータセットでも効率的な速度を維持することができ、この比較的小さな不動産データベースを軽々と扱うことができる。一般的に、このシステムは次のようなプロセスを踏む：</p>
<ol>
<li><p>ディープラーニングモデル（CNN、RNN、BERTなど）が非構造化データを特徴ベクトルに変換し、Milvusにインポートする。</p></li>
<li><p>Milvusは特徴ベクトルを保存し、インデックスを作成する。</p></li>
<li><p>Milvusはユーザーのクエリに基づいて類似検索結果を返す。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>milvus-overview-diagram.png</span> </span></p>
<p><br/></p>
<p>Beikeのインテリジェントな不動産検索プラットフォームは、コサイン距離を使ってベクトルの類似性を計算する推薦アルゴリズムによって支えられている。このシステムは、お気に入りの物件と検索条件に基づいて、類似した住宅を見つける。簡単に説明すると、以下のような仕組みだ：</p>
<ol>
<li><p>入力された物件をもとに、間取り、広さ、向きなどの特徴を4つの特徴ベクトル集に抽出する。</p></li>
<li><p>抽出された特徴コレクションは、Milvusで類似検索を行うために使用される。各ベクトルのコレクションに対するクエリの結果は、入力リストと他の類似リストとの類似性の指標となる。</p></li>
<li><p>4つのベクトルコレクションそれぞれからの検索結果は比較された後、類似した住宅を推薦するために使用されます。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-インテリジェント・ハウス・プラットフォーム-ダイアグラム.jpg</span> </span></p>
<p><br/></p>
<p>上の図が示すように、このシステムでは、データを更新するためにA/Bテーブル切り替えの仕組みが実装されている。milvusは、最初のT日間のデータをテーブルAに保存し、T+1日目にテーブルBにデータを保存し始め、2T+1日目にテーブルAの書き換えを開始する、という具合である。</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">Milvusを使ったものづくりについてもっと知りたい方は、以下のリソースをご覧ください：</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">WPS Office用AIライティング・アシスタントの構築</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Milvusで作る: XiaomiのモバイルブラウザにAIを搭載したニュース推薦機能を組み込む</a></p></li>
</ul>
