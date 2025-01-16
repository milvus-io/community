---
id: Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md
title: Milvusのおかげで、誰でも10億枚以上の画像のベクターデータベースを構築できるようになった
author: milvus
date: 2020-11-11T07:13:02.135Z
desc: >-
  AIとオープンソースソフトウェアにより、たった1台のサーバーと10行のコードで逆画像検索エンジンを構築することが可能です。オープンソースのベクターデータ管理プラットフォームMilvusで、10億枚以上の画像をリアルタイムで検索。
cover: assets.zilliz.com/build_search_9299109ca7.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images
---
<custom-h1>Milvusのおかげで、誰でも10億枚以上の画像のベクターデータベースを構築可能に</custom-h1><p>コンピュートパワーの向上とコンピュートコストの低下により、マシンスケールのアナリティクスと人工知能（AI）がかつてないほど身近になった。これは、たった1台のサーバーと10行のコードで、10億枚以上の画像をリアルタイムで検索できる逆引き画像検索エンジンを構築できることを意味する。この記事では、オープンソースのベクトルデータ管理プラットフォームである<a href="https://milvus.io/">Milvusを</a>使用して、非構造化データの処理と分析のための強力なシステムを構築する方法と、これを可能にする基盤技術について説明する。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#thanks-to-milvus-anyone-can-build-a-vector-database-for-1-billion-images">Milvusのおかげで、誰でも10億枚以上の画像のベクターデータベースを構築することができる。</a><ul>
<li><a href="#how-does-ai-enable-unstructured-data-analytics">AIはどのようにして非構造化データ分析を可能にするのか？</a></li>
<li><a href="#neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors">ニューラルネットワークが非構造化データをコンピュータに使いやすい特徴ベクトルに変換</a>-<a href="#ai-algorithms-convert-unstructured-data-to-vectors"><em>AIアルゴリズムが非構造化データをベクトルに変換</em></a></li>
<li><a href="#what-are-vector-data-management-platforms">ベクトルデータ管理プラットフォームとは？</a></li>
<li><a href="#what-are-limitations-of-existing-approaches-to-vector-data-management">既存のベクトルデータ管理アプローチの限界とは？</a> <a href="#an-overview-of-milvus-architecture"><em>- Milvusのアーキテクチャの概要。</em></a></li>
<li><a href="#what-are-applications-for-vector-data-management-platforms-and-vector-similarity-search">ベクトルデータ管理プラットフォームとベクトル類似検索の用途とは？</a></li>
<li><a href="#reverse-image-search">逆画像検索</a>-<a href="#googles-search-by-image-feature"><em>Googleの「画像で検索」機能。</em></a><ul>
<li><a href="#video-recommendation-systems">ビデオ推薦システム</a></li>
<li><a href="#natural-language-processing-nlp">自然言語処理（NLP）</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus">Milvusについてもっと知る</a></li>
</ul></li>
</ul>
<h3 id="How-does-AI-enable-unstructured-data-analytics" class="common-anchor-header">AIはどのように非構造化データ分析を可能にするのか？</h3><p>よく言われる統計によると、世界のデータの80%は非構造化データですが、分析されたことがあるのはわずか1%です。画像、動画、音声、自然言語などの非構造化データは、あらかじめ定義されたモデルや整理方法に従わない。そのため、大規模な非構造化データセットの処理と分析は困難である。スマートフォンやその他の接続デバイスの普及が非構造化データの生産を新たな高みへと押し上げる中、企業はこの漠然とした情報から得られる洞察がいかに重要であるかをますます認識するようになっている。</p>
<p>何十年もの間、コンピューター科学者たちは、特定のデータタイプの整理、検索、分析に合わせたインデックス作成アルゴリズムを開発してきた。構造化データには、ビットマップ、ハッシュテーブル、B-treeがあり、これらはオラクルやIBMのような巨大企業が開発したリレーショナル・データベースでよく使われている。半構造化データに対しては、転置インデックスアルゴリズムが標準的で、<a href="http://www.solrtutorial.com/basic-solr-concepts.html">Solrや</a> <a href="https://www.elastic.co/blog/found-elasticsearch-from-the-bottom-up#inverted-indexes-and-index-terms">ElasticSearchの</a>ような一般的な検索エンジンで見ることができる。しかし、非構造化データのインデックス作成アルゴリズムは、ここ10年でようやく広く利用できるようになった、計算集約的な人工知能に依存している。</p>
<h3 id="Neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors" class="common-anchor-header">ニューラルネットワークは、非構造化データをコンピュータフレンドリーな特徴ベクトルに変換する。</h3><p>ニューラルネットワーク（<a href="https://en.wikipedia.org/wiki/Convolutional_neural_network">CNN</a>、<a href="https://en.wikipedia.org/wiki/Recurrent_neural_network">RNN</a>、<a href="https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270">BERTなど</a>）を使用すると、非構造化データを、整数または浮動小数点数の文字列である特徴ベクトル（別名エンベッディング）に変換することができる。この数値データ形式は、機械による処理と分析がはるかに容易である。非構造化データを特徴ベクトルに埋め込み、ユークリッド距離や余弦類似度などの尺度を使ってベクトル間の類似性を計算することで、逆画像検索、動画検索、自然言語処理（NLP）などにまたがるアプリケーションを構築することができる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_2_db8c16aea4.jpeg" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_2.jpeg" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_2.jpeg" />
   </span> <span class="img-wrapper"> <span>ブログ_AIのおかげで、誰でも10億枚以上の画像の検索エンジンを構築できる_2.jpeg</span> </span></p>
<p>ベクトルの類似性を計算するのは、確立されたアルゴリズムに依存する比較的単純なプロセスである。しかし、非構造化データセットは、特徴ベクトルに変換された後であっても、従来の構造化データセットや半構造化データセットに比べ、一般的に数桁大きい。ベクトル類似性検索は、大規模な非構造化データを効率的かつ正確にクエリするために必要な膨大なストレージスペースと計算能力によって複雑なものとなっている。 しかし、ある程度の精度を犠牲にできるのであれば、高次元の大規模データセットに対するクエリ効率を劇的に改善できる様々な近似最近傍（ANN）検索アルゴリズムが存在する。これらのANNアルゴリズムは、類似したベクトルをクラスタリングすることでストレージ要件と計算負荷を減らし、ベクトル検索を高速化する。一般的に使用されるアルゴリズムには、ツリーベース、グラフベース、複合ANNなどがあります。</p>
<h3 id="What-are-vector-data-management-platforms" class="common-anchor-header">ベクトルデータ管理プラットフォームとは？</h3><p>ベクトルデータ管理プラットフォームは、膨大なベクトルデータセットを保存、処理、分析するための専用アプリケーションです。これらのツールは、大量のデータを簡単に扱えるように設計されており、ベクトルデータ管理を効率化する機能を備えています。残念ながら、現代のビッグデータの課題を解決するのに十分な柔軟性とパワーを兼ね備えたシステムはほとんど存在しない。Milvusは、2019年にオープンソースライセンスの下でリリースされた、<a href="https://zilliz.com/">Zillizによって</a>始められたベクターデータ管理プラットフォームであり、この空白を埋めようとしている。</p>
<h3 id="What-are-limitations-of-existing-approaches-to-vector-data-management" class="common-anchor-header">ベクターデータ管理に対する既存のアプローチの限界とは？</h3><p>非構造化データ分析システムを構築する一般的な方法は、ANNのようなアルゴリズムと、Facebook AI Similarity Search（Faiss）のようなオープンソースの実装ライブラリを組み合わせることだ。いくつかの制限があるため、これらのアルゴリズムとライブラリの組み合わせは、milvusのような本格的なベクトルデータ管理システムには相当しません。ベクトルデータを管理するために使用される既存の技術は、以下の問題に直面している：</p>
<ol>
<li><strong>柔軟性：</strong>柔軟性： 既存のシステムは通常、すべてのデータをメインメモリに保存するため、複数のマシンにまたがって実行することができず、巨大なデータセットの処理には適していない。</li>
<li><strong>動的なデータ処理：</strong>既存のシステムに入力されたデータは静的であると想定されることが多いため、動的データの処理が複雑になり、リアルタイムに近い検索が不可能になる。</li>
<li><strong>高度なクエリー処理：</strong>ほとんどのツールは、有用な類似検索エンジンを構築するために不可欠な高度なクエリ処理（属性フィルタリングやマルチベクタークエリなど）をサポートしていない。</li>
<li><strong>ヘテロジニアス・コンピューティングの最適化：</strong>CPUとGPU（Faissを除く）の両方における異種システムアーキテクチャの最適化を提供するプラットフォームはほとんどなく、効率の低下を招いている。</li>
</ol>
<p>Milvusはこれらの制限をすべて克服しようとしています。様々なアプリケーションインターフェース（Python、Java、Go、C++、RESTful APIのSDKを含む）、複数のベクトルインデックスタイプ（量子化ベースのインデックスやグラフベースのインデックスなど）、高度なクエリ処理をサポートすることで、柔軟性を高めています。Milvusは、ログ構造化マージツリー（LSMツリー）を使用して動的なベクトルデータを処理し、データの挿入と削除を効率的に行い、検索をリアルタイムに実行します。Milvusはまた、最新のCPUとGPUの異種混在コンピューティングアーキテクチャのための最適化も提供しており、開発者は特定のシナリオ、データセット、アプリケーション環境に合わせてシステムを調整することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_3_380e31d32c.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_3.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_3.png" />
   </span> <span class="img-wrapper"> <span>ブログ_AIのおかげで、誰でも10億枚以上の画像の検索エンジンを構築できる_3.png</span> </span></p>
<p>Milvusは、様々なANNインデックス作成技術を用いて、トップ5の想起率99%を達成している。また、1分間に100万件以上のデータを読み込むことができる。この結果、10億枚の画像に対して逆引き検索を実行した場合、クエリ時間は1秒未満となります。Milvusは、複数のノードに分散配置されたシステムとして動作するクラウドネイティブアプリケーションであるため、100億枚、あるいは1000億枚の画像を含むデータセットでも、同様のパフォーマンスを簡単かつ確実に達成することができる。さらに、このシステムは画像データに限らず、コンピュータ・ビジョン、会話AI、推薦システム、新薬発見などに応用できる。</p>
<h3 id="What-are-applications-for-vector-data-management-platforms-and-vector-similarity-search" class="common-anchor-header">ベクトルデータ管理プラットフォームとベクトル類似性検索の用途とは？</h3><p>上述したように、Milvusのような有能なベクトルデータ管理プラットフォームと近似最近傍アルゴリズムの組み合わせにより、膨大な量の非構造化データの類似性検索が可能になる。この技術は、多様な分野にまたがるアプリケーションの開発に利用することができます。以下では、ベクトルデータ管理ツールとベクトル類似検索の一般的な使用例を簡単に説明します。</p>
<h3 id="Reverse-image-search" class="common-anchor-header">逆画像検索</h3><p>Googleのような大手検索エンジンは、すでに画像による検索オプションをユーザーに提供している。さらに、eコマースプラットフォームは、この機能がオンライン買い物客にもたらす利点に気づいており、Amazonはスマートフォンアプリケーションに画像検索を組み込んでいます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_4_7884aabcd8.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_4.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_4.png" />
   </span> <span class="img-wrapper"> <span>ブログ_AIのおかげで、誰でも10億枚以上の画像の検索エンジンを構築できる_4.png</span> </span></p>
<p>Milvusのようなオープンソースソフトウェアを使えば、どんな企業でも独自の逆引き画像検索システムを構築することが可能になり、ますます需要が高まっているこの機能への参入障壁が低くなる。開発者は、事前に訓練されたAIモデルを使用して、独自の画像データセットをベクトルに変換し、Milvusを活用することで、画像から類似商品を検索することができる。</p>
<h4 id="Video-recommendation-systems" class="common-anchor-header">動画推薦システム</h4><p>YouTubeのような主要なオンライン・ビデオ・プラットフォームは、<a href="https://www.tubefilter.com/2019/05/07/number-hours-video-uploaded-to-youtube-per-minute/">毎分500時間のユーザー生成コンテンツを</a>受信しており、コンテンツ推薦に関してはユニークな要求がある。新しいアップロードを考慮した適切なリアルタイム推薦を行うために、動画推薦システムは、高速クエリ時間と効率的な動的データ処理を提供する必要があります。キーフレームをベクトルに変換し、その結果をMilvusに入力することで、何十億もの動画をほぼリアルタイムで検索し、推薦することができます。</p>
<h4 id="Natural-language-processing-NLP" class="common-anchor-header">自然言語処理（NLP）</h4><p>自然言語処理は、人間の言語を解釈できるシステムを構築することを目的とした人工知能の一分野である。Milvusは、テキストデータをベクトルに変換した後、重複テキストの迅速な識別と削除、セマンティック検索、または<a href="https://medium.com/unstructured-data-service/how-artificial-intelligence-empowered-professional-writing-f433c7e5b561%22%20/">インテリジェントなライティングアシスタントの</a>構築に使用することができます。効果的なベクトルデータ管理プラットフォームは、あらゆるNLPシステムの実用性を最大化するのに役立ちます。</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">Milvusについてもっと知る</h3><p>Milvusについてもっとお知りになりたい方は、当社の<a href="https://milvus.io/">ウェブサイトを</a>ご覧ください。また、<a href="https://github.com/milvus-io/bootcamp">ブートキャンプでは</a>、Milvusのセットアップ、ベンチマークテスト、様々なアプリケーションの構築などのチュートリアルをご用意しております。ベクターデータ管理、人工知能、ビッグデータの課題に興味がある方は、<a href="https://github.com/milvus-io">GitHubの</a>オープンソースコミュニティに参加し、<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>チャットしてください。</p>
<p>画像検索システムの構築についてもっと知りたいですか？こちらのケーススタディをご覧ください：</p>
<ul>
<li><a href="https://medium.com/vector-database/the-journey-to-optimize-billion-scale-image-search-part-1-a270c519246d">億規模の画像検索を最適化する旅 (1/2)</a></li>
<li><a href="https://medium.com/unstructured-data-service/the-journey-to-optimizing-billion-scale-image-search-2-2-572a36d5d0d">億規模の画像検索を最適化する旅 (2/2)</a></li>
</ul>
