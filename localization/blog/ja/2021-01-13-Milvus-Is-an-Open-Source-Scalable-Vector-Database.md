---
id: Milvus-Is-an-Open-Source-Scalable-Vector-Database.md
title: Milvusはオープンソースのスケーラブルなベクターデータベースです。
author: milvus
date: 2021-01-13T07:46:40.506Z
desc: Milvusで強力な機械学習アプリケーションを構築し、大規模なベクトルデータを管理しましょう。
cover: assets.zilliz.com/milvus_5b2cdec665.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Milvus-Is-an-Open-Source-Scalable-Vector-Database'
---
<custom-h1>Milvusはオープンソースのスケーラブルなベクターデータベースです。</custom-h1><p>例えば、俳優、監督、ジャンル、公開日などで映画データベースを検索するような、簡単に定義できる条件を使ってデータを検索することは簡単です。リレーショナルデータベースは、SQLのようなクエリ言語を使って、このような基本的な検索を行うのに適しています。しかし、自然言語やビデオクリップを使ったビデオストリーミングライブラリの検索など、検索に複雑なオブジェクトやより抽象的なクエリが含まれる場合、タイトルや説明文の単語をマッチさせるような単純な類似性指標ではもはや十分ではありません。</p>
<p><a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">人工知能（AI）により</a>、コンピュータは言語のセマンティクスを理解する能力を大幅に向上させただけでなく、膨大で分析が困難な非構造化データセット（オーディオ、ビデオ、ドキュメント、ソーシャルメディアデータなど）の意味を理解する手助けもできるようになった。AIは、ネットフリックスが洗練されたコンテンツ・レコメンデーション・エンジンを作成したり、グーグルのユーザーが画像からウェブを検索したり、製薬会社が新薬を発見したりすることを可能にしている。</p>
<h3 id="The-challenge-of-searching-large-unstructured-datasets" class="common-anchor-header">大規模な非構造化データセットの検索という課題</h3><p>このような技術の偉業は、AIアルゴリズムを使って高密度の非構造化データをベクトル（機械が読み取りやすい数値データ形式）に変換することで達成される。次に、追加のアルゴリズムを使って、与えられた検索に対するベクトル間の類似度を計算する。非構造化データセットのサイズが大きいため、その全体を検索するのは、ほとんどの機械学習アプリケーションにとって時間がかかりすぎる。これを克服するために、近似最近傍（ANN）アルゴリズムが使用され、類似したベクトルをクラスタリングし、その後、ターゲット検索ベクトルと類似したベクトルを含む可能性が最も高いデータセットの部分のみを検索する。</p>
<p>この結果、（精度は若干落ちるものの）類似性検索が<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">劇的に高速化さ</a>れ、有用なAIツールを構築する鍵となる。膨大な公的リソースのおかげで、機械学習アプリケーションの構築はかつてないほど簡単で安価になっている。しかし、AIを利用したベクトル類似性検索では、特定のプロジェクトの要件に応じて数や複雑さが異なるさまざまなツールを組み合わせる必要があることが多い。MilvusはオープンソースのAI検索エンジンで、統一されたプラットフォームの下で堅牢な機能を提供することにより、機械学習アプリケーションの構築プロセスを簡素化することを目的としています。</p>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvusとは？</h3><p><a href="https://milvus.io/">Milvusは</a>、大規模なベクトルデータと機械学習オペレーション（MLOps）の合理化のために特別に構築されたオープンソースのデータ管理プラットフォームです。Facebook AI Similarity Search (Faiss)、Non-Metric Space Library (NMSLIB)、Annoyを搭載したMilvusは、様々な強力なツールを一箇所に集め、スタンドアロンの機能を拡張します。このシステムは、大規模なベクトルデータセットの保存、処理、分析のために構築され、コンピュータビジョン、レコメンデーションエンジンなど、AIアプリケーションの構築に使用できる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Is_an_Open_Source_Scalable_AI_Search_Engine_1_997255eb27.jpg" alt="Blog_Milvus Is an Open-Source Scalable AI Search Engine_1.jpg" class="doc-image" id="blog_milvus-is-an-open-source-scalable-ai-search-engine_1.jpg" />
   </span> <span class="img-wrapper"> <span>ブログ_MilvusはオープンソースのスケーラブルなAI検索エンジンです_1.jpg</span> </span></p>
<h3 id="Milvus-was-made-to-power-vector-similarity-search" class="common-anchor-header">Milvusはベクトル類似検索のために作られた。</h3><p>Milvusは柔軟性を重視して設計されており、開発者は特定のユースケースに合わせてプラットフォームを最適化することができる。CPU/GPUのみとヘテロジニアスコンピューティングのサポートにより、データ処理を高速化し、あらゆるシナリオに必要なリソースを最適化することができる。データはMilvusに分散アーキテクチャで保存されるため、データ量の拡張が容易である。様々なAIモデル、プログラミング言語（C++、Java、Pythonなど）、プロセッサタイプ（x86、ARM、GPU、TPU、FPGAなど）をサポートするMilvusは、様々なハードウェアやソフトウェアとの高い互換性を提供します。</p>
<p>Milvusの詳細については、以下のリソースをご覧ください：</p>
<ul>
<li>Milvusの<a href="https://milvus.io/">技術資料を</a>ご覧いただき、プラットフォームの内部構造についてご確認ください。</li>
<li>Milvus<a href="https://tutorials.milvus.io/">チュートリアルで</a>Milvusの起動方法やアプリケーションの構築方法などを学ぶ。</li>
<li><a href="https://github.com/milvus-io">GitHubで</a>Milvusのオープンソースコミュニティに参加する。</li>
</ul>
