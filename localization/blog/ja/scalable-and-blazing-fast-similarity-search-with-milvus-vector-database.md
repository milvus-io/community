---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: Milvusベクトルデータベースによるスケーラブルで高速な類似性検索
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: 何兆もの文書ベクトルをミリ秒単位で保存、索引付け、管理、検索！
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>カバー画像</span> </span></p>
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
    </button></h2><p>この記事では、ベクターデータベースとスケールでの類似検索に関連するいくつかの興味深い側面を取り上げます。急速に進化する今日の世界では、新しいテクノロジー、新しいビジネス、新しいデータソースが登場し、その結果、これらのデータを保存、管理、活用して洞察を得るための新しい方法を使い続ける必要があります。構造化された表形式のデータは、何十年もの間、リレーショナル・データベースに保存され、ビジネス・インテリジェンスは、そのようなデータから洞察を分析し、抽出することで繁栄してきました。しかし、現在のデータ状況を考慮すると、「データの80～90％以上は、テキスト、ビデオ、オーディオ、ウェブ・サーバー・ログ、ソーシャルメディアなどの非構造化情報」である。組織は、従来のクエリベースの手法では不十分であったり、不可能であったりする可能性があるため、機械学習やディープラーニングの力を活用し、このようなデータから洞察を引き出そうとしている。このようなデータから価値ある洞察を引き出すには、未開拓の巨大な可能性があり、我々はまだ始まったばかりだ！</p>
<blockquote>
<p>「世界のデータのほとんどは非構造化データであるため、それを分析し行動する能力は大きなチャンスとなる。- マイキー・シュルマン、ML責任者、Kensho</p>
</blockquote>
<p>非構造化データは、その名の通り、行と列の表のような暗黙の構造を持っていない（そのため、表形式データまたは構造化データと呼ばれる）。構造化データとは異なり、非構造化データの内容をリレーショナル・データベースに格納する簡単な方法はありません。非構造化データを洞察に活用するには、主に3つの課題がある：</p>
<ul>
<li><strong>ストレージ：</strong>ストレージ：通常のリレーショナル・データベースは、構造化データを保持するのに適している。そのようなデータを保存するためにNoSQLデータベースを使用することは可能だが、AIアプリケーションをスケールアップするために適切な表現を抽出するためにそのようなデータを処理することは、さらなるオーバーヘッドとなる。</li>
<li><strong>表現：</strong>コンピュータは人間のようにテキストや画像を理解することはできない。コンピュータが理解できるのは数値だけであり、構造化されていないデータを何らかの有用な数値表現（通常はベクトルや埋め込み）に変換する必要がある。</li>
<li><strong>クエリ：</strong>構造化されていないデータは、構造化データのSQLのように、明確な条件文に基づいて直接クエリを実行することはできない。単純な例として、お気に入りの靴の写真から、似たような靴を検索しようとした場合を想像してみてほしい！生のピクセル値を検索に使うことはできないし、靴の形、サイズ、スタイル、色などの構造化された特徴を表現することもできない。これを何百万足もの靴に対して行わなければならないことを想像してみてほしい！</li>
</ul>
<p>したがって、コンピュータが非構造化データを理解し、処理し、表現するためには、通常、エンベッディングと呼ばれる密なベクトルに変換します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>図1</span> </span></p>
<p>画像のような視覚データには畳み込みニューラルネットワーク（CNN）、テキストデータにはTransformerなど、特にディープラーニングを活用した様々な方法論が存在する。<a href="https://zilliz.com/">Zillizには</a> <a href="https://zilliz.com/learn/embedding-generation">、様々な埋め込み技術を網羅した素晴らしい記事が</a>ある！</p>
<p>さて、これらの埋め込みベクトルを保存するだけでは十分ではありません。似たようなベクトルを検索できるようにする必要があります。なぜそう思うのか？実世界のアプリケーションの大半は、AIベースのソリューションのためのベクトル類似性検索によって動いている。これには、Googleのビジュアル（画像）検索、NetflixやAmazonのレコメンデーションシステム、Googleのテキスト検索エンジン、マルチモーダル検索、データ重複排除など、多くのものが含まれる！</p>
<p>大規模なベクターの保存、管理、クエリーは単純な作業ではない。そのためには専用のツールが必要であり、ベクターデータベースはそのための最も効果的なツールです！この記事では、以下の点について説明します：</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">ベクトルとベクトル類似検索</a></li>
<li><a href="#What-is-a-Vector-Database">ベクターデータベースとは？</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - 世界最先端のベクターデータベース</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Milvusでビジュアル画像検索を行う - ユースケースの青写真</a></li>
</ul>
<p>はじめよう</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">ベクトルとベクトル類似検索<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>先に、画像やテキストのような非構造化データをベクトルとして表現する必要性を説明しました。我々は通常、AIモデル、より具体的にはディープラーニング・モデルを活用して、非構造化データを機械が読み込める数値ベクトルに変換する。通常、これらのベクトルは基本的に浮動小数点数のリストであり、基礎となるアイテム（画像、テキストなど）を集合的に表します。</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">ベクトルを理解する</h3><p>自然言語処理（NLP）の分野を考慮すると、<a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec、GloVe、FastTextなど</a>、単語を数値ベクトルとして表現するのに役立つ多くの単語埋め込みモデルがあります。時間の経過とともに、<a href="https://jalammar.github.io/illustrated-bert/">BERTの</a>ような<a href="https://arxiv.org/abs/1706.03762">Transformer</a>モデルが台頭し、文脈に応じた埋め込みベクトルや、文全体や段落のより良い表現を学習できるようになりました。</p>
<p>同様にコンピュータビジョンの分野では、画像や動画などの視覚データから表現を学習するのに役立つ<a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">畳み込みニューラルネットワーク（CNN）の</a>ようなモデルがある。トランスフォーマーの台頭により、通常のCNNよりも優れた性能を発揮する<a href="https://arxiv.org/abs/2010.11929">ビジョン・トランスフォーマーも</a>あります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>図2</span> </span></p>
<p>このようなベクトルの利点は、写真をアップロードして視覚的に類似した画像を含む検索結果を得るような、視覚検索のような実世界の問題解決に活用できることだ。Googleの検索エンジンでは、次の例にあるように、この機能が非常によく使われている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>図3</span> </span></p>
<p>このようなアプリケーションは、データ・ベクトルとベクトル類似性検索によって実現される。X-Y直交座標空間上の2点を考える。2点間の距離は次の式で表される単純なユークリッド距離として計算できる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>図4</span> </span></p>
<p>ここで、各データ点がD次元を持つベクトルであるとすると、ユークリッド距離、あるいはハミング距離や余弦距離のような他の距離メトリックスを使用して、2つのデータ点が互いにどのくらい近いかを調べることができます。これは、近さまたは類似性の概念を構築するのに役立ちます。これは、それらのベクトルを使用して参照アイテムを与えられた類似アイテムを見つけるための定量化可能なメトリックとして使用することができます。</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">ベクトル類似検索の理解</h3><p>ベクトル類似性検索は、しばしば最近傍（NN）検索として知られ、基本的には、参照アイテム（類似アイテムを見つけたい）と既存アイテムのコレクション（通常はデータベース内）の間のペアワイズ類似性（または距離）を計算し、トップ「k」最も類似したアイテムであるトップ「k」最近傍を返すプロセスです。この類似度を計算する重要な要素は、ユークリッド距離、内積、余弦距離、ハミング距離などの類似度メトリックである。距離が小さいほど、ベクトルはより類似しています。</p>
<p>厳密最近傍（NN）探索の課題はスケーラビリティです。N個の距離（N個のアイテムが存在すると仮定）を毎回計算し、類似アイテムを取得する必要があります。これは、特にデータをどこかに保存してインデックスを作らないと（ベクトルデータベースのように！）、非常に時間がかかります。計算を高速化するために、私たちは通常、近似最近傍探索を利用します。これはしばしばANN探索と呼ばれ、最終的にベクトルをインデックスに格納します。このインデックスは、参照するクエリ項目に対して「近似的に」類似した近傍ベクトルを素早く検索できるように、これらのベクトルをインテリジェントな方法で格納するのに役立ちます。典型的なANNインデックス作成手法には以下のものがある：</p>
<ul>
<li><strong>ベクトルの変換：</strong>ベクトル変換：ベクトルに次元削減（例えばPCA、t-SNE）、回転などの変換を加える。</li>
<li><strong>ベクトル符号化：</strong>Locality Sensitive Hashing (LSH)、量子化、ツリーなどのデータ構造に基づくテクニックを適用することで、類似アイテムの高速検索に役立ちます。</li>
<li><strong>非網羅的検索法：</strong>これは主に網羅的検索を防ぐために使用され、近傍グラフや転置インデックスなどの手法が含まれる。</li>
</ul>
<p>このことから、ベクトル類似検索アプリケーションを構築するためには、効率的な保存、インデックス付け、クエリ（検索）を大規模に行うことができるデータベースが必要であることがわかります。ベクターデータベースの登場です！</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">ベクトルデータベースとは？<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトルがどのように非構造化データを表現し、ベクトル検索がどのように機能するかを理解した今、ベクトルデータベースを構築するために2つの概念を組み合わせることができます。</p>
<p>ベクトル・データベースは、ディープラーニング・モデルを使って非構造化データ（画像、テキストなど）から生成された埋め込みベクトルを横断的に保存、インデックス付け、クエリするためのスケーラブルなデータ・プラットフォームである。</p>
<p>類似性検索のために膨大な数のベクトルを扱うことは（インデックスを使ったとしても）、超高コストとなる可能性がある。にもかかわらず、最良かつ最先端のベクトル・データベースは、数百万から数十億のターゲット・ベクトルの挿入、インデックス付け、検索を可能にし、さらにインデクシング・アルゴリズムと類似性メトリックを任意に指定できるはずだ。</p>
<p>ベクターデータベースは、企業で使用される堅牢なデータベース管理システムとして、主に以下の主要要件を満たす必要があります：</p>
<ol>
<li><strong>スケーラブルであること：</strong>ベクトルデータベースは、何十億もの埋め込みベクトルに対してインデックスを作成し、近似最近傍探索を実行できる必要があります。</li>
<li><strong>信頼性：</strong>ベクターデータベースは、データを損失することなく、運用への影響を最小限に抑えて内部障害を処理できること、すなわちフォールトトレラントであること。</li>
<li><strong>高速性：</strong>クエリと書き込みの速度は、ベクターデータベースにとって重要である。SnapchatやInstagramのように、1秒間に何百、何千もの新しい画像がアップロードされるプラットフォームでは、スピードは非常に重要な要素になります。</li>
</ol>
<p>ベクターデータベースはデータのベクターを保存するだけではありません。効率的なデータ構造を使ってベクトルにインデックスを付け、高速な検索を可能にし、CRUD（作成、読み込み、更新、削除）操作をサポートする役割も担っている。ベクターデータベースは、通常スカラーフィールドであるメタデータフィールドに基づくフィルタリングである属性フィルタリングもサポートするのが理想的です。簡単な例としては、特定のブランドの画像ベクトルに基づいて、似たような靴を検索するようなものです。ここで、ブランドはフィルタリングを行う属性となります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>図5</span> </span></p>
<p>上の図は、これから説明するベクトルデータベース<a href="https://milvus.io/">Milvusが</a>どのように属性フィルタリングを使っているかを示している。<a href="https://milvus.io/">Milvusでは</a>、フィルタリングの仕組みにビットマスクの概念を導入し、特定の属性フィルタを満たすことに基づいて、ビットマスクが1の類似ベクトルを保持するようにしている。これについての詳細は<a href="https://zilliz.com/learn/attribute-filtering">こちら</a>。</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - 世界で最も先進的なベクトルデータベース<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvusは</a>、大規模ベクトルデータと機械学習オペレーション（MLOps）の合理化のために特別に構築されたオープンソースのベクトルデータベース管理プラットフォームです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>図6</span> </span></p>
<p><a href="https://zilliz.com/">Zillizは</a>、次世代データファブリックの開発を加速するために、世界で最も先進的なベクトルデータベース<a href="https://milvus.io/">Milvusを</a>構築している組織です。Milvusは現在、<a href="https://lfaidata.foundation/">LF AI &amp; Data</a>Foundationの卒業プロジェクトであり、膨大な非構造化データセットのストレージと検索の管理に焦点を当てている。このプラットフォームの効率性と信頼性により、AIモデルとMLOpsを大規模に展開するプロセスが簡素化される。Milvusは、創薬、コンピュータビジョン、レコメンデーションシステム、チャットボットなど、幅広い用途に利用されている。</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Milvusの主な特徴</h3><p>Milvusには、以下のような便利な機能が満載されています：</p>
<ul>
<li><strong>兆のベクトルデータセットにおける驚異的な検索速度：</strong>兆個のベクトルデータセットにおけるベクトル検索と検索の平均待ち時間はミリ秒単位で測定されています。</li>
<li><strong>簡素化された非構造化データ管理：</strong>Milvusは、データサイエンスワークフローのために設計された豊富なAPIを備えています。</li>
<li><strong>信頼性の高い常時稼働のベクトルデータベース：</strong>Milvusに組み込まれたレプリケーションとフェイルオーバー/フェイルバック機能により、データとアプリケーションは常にビジネスの継続性を維持することができます。</li>
<li><strong>高い拡張性と伸縮性：</strong>コンポーネントレベルのスケーラビリティにより、オンデマンドでのスケールアップとスケールダウンが可能です。</li>
<li><strong>ハイブリッド検索：</strong>Milvusはベクトル以外にも、ブール、文字列、整数、浮動小数点数などのデータ型をサポートしています。Milvusはスカラーフィルタリングと強力なベクトル類似性検索を組み合わせています（先ほどの靴の類似性の例に見られるように）。</li>
<li><strong>統一されたラムダ構造：</strong>Milvusはデータストレージのストリーム処理とバッチ処理を組み合わせることで、適時性と効率性のバランスを取っている。</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">タイムトラベル</a>：</strong>Milvusはすべてのデータの挿入と削除の操作に対してタイムラインを維持します。検索でタイムスタンプを指定し、指定した時点のデータビューを取得することができます。</li>
<li><strong>コミュニティでサポートされ、業界で認められています：</strong>1,000人以上の企業ユーザー、<a href="https://github.com/milvus-io/milvus">GitHub</a>上の10.5K以上のスター、そして活発なオープンソースコミュニティにより、Milvusを使用するのはあなただけではありません。Milvus は、<a href="https://lfaidata.foundation/">LF AI &amp; Data</a> Foundationの卒業プロジェクトとして、組織的なサポートを受けています。</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">ベクトルデータ管理と検索への既存のアプローチ</h3><p>ベクトル類似性検索によってAIシステムを構築する一般的な方法は、近似最近傍探索（ANNS）のようなアルゴリズムと、以下のようなオープンソースライブラリを組み合わせることである：</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI類似性検索（FAISS）</a>：</strong>このフレームワークは、密なベクトルの効率的な類似性検索とクラスタリングを可能にする。RAMに収まらないようなものまで、あらゆるサイズのベクトル集合を検索するアルゴリズムが含まれている。逆マルチインデックスや積量子化などのインデックス機能をサポートしている。</li>
<li><strong><a href="https://github.com/spotify/annoy">SpotifyのAnnoy (Approximate Nearest Neighbors Oh Yeah)：</a></strong>このフレームワークは、<a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">ランダムな投影を</a>使用し、密なベクトルに対してスケールでANNSを可能にするためにツリーを構築する。</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">GoogleのScaNN（Scalable Nearest Neighbors）</a>：</strong>このフレームワークは、効率的なベクトル類似探索を大規模に実行する。最大内積探索（MIPS）のための探索空間の刈り込みと量子化を含む実装で構成される。</li>
</ul>
<p>これらのライブラリはそれぞれそれなりに有用ですが、いくつかの制限があるため、これらのアルゴリズムとライブラリの組み合わせは、milvusのような本格的なベクトルデータ管理システムと同等ではありません。ここでは、これらの限界のいくつかを説明する。</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">既存のアプローチの限界</h3><p>前節で説明したように、ベクターデータを管理するために使用されている既存のアプローチには、以下のような限界があります：</p>
<ol>
<li><strong>柔軟性：</strong>柔軟性：既存のシステムは通常、すべてのデータをメインメモリに保存するため、複数のマシンで分散モードで実行することは容易ではなく、巨大なデータセットを扱うには適していません。</li>
<li><strong>動的なデータ処理：</strong>既存のシステムに入力されたデータは静的であると想定されることが多いため、動的データの処理が複雑になり、リアルタイムに近い検索が不可能になる。</li>
<li><strong>高度なクエリー処理：</strong>ほとんどのツールは、高度なクエリ処理（属性フィルタリング、ハイブリッド検索、マルチベクタークエリなど）をサポートしていない。これは、高度なフィルタリングをサポートする実世界の類似検索エンジンを構築するために不可欠である。</li>
<li><strong>ヘテロジニアス・コンピューティングの最適化：</strong>CPUとGPU（FAISSを除く）の両方における異種システムアーキテクチャの最適化を提供するプラットフォームはほとんどなく、効率の低下を招きます。</li>
</ol>
<p><a href="https://milvus.io/">Milvusは</a>これらの制限をすべて克服しようとしており、次のセクションで詳しく説明します。</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">Milvusの優位性 -Knowhereの理解</h3><p><a href="https://milvus.io/">Milvusは</a>、非効率的なベクトルデータ管理と類似検索アルゴリズムの上に構築された既存システムの限界に取り組み、以下の方法で見事に解決しようとしている：</p>
<ul>
<li>様々なアプリケーションインターフェース（Python、Java、Go、C++、RESTful APIのSDKを含む）をサポートすることで、柔軟性を高めています。</li>
<li>複数のベクトルインデックスタイプ（量子化ベースのインデックスやグラフベースのインデックスなど）と高度なクエリ処理をサポートします。</li>
<li>Milvusは、ログ構造化マージツリー（LSMツリー）を使用して動的なベクトルデータを処理し、データの挿入と削除を効率的に行い、検索をリアルタイムに実行します。</li>
<li>Milvusはまた、最新のCPUやGPUのヘテロジニアスなコンピューティングアーキテクチャのための最適化も提供しており、開発者は特定のシナリオ、データセット、アプリケーション環境に合わせてシステムを調整することができます。</li>
</ul>
<p>Milvusのベクトル実行エンジンであるKnowhereは、システムの上位層にあるサービスや、システムの下位層にあるFaiss、Hnswlib、Annoyなどのベクトル類似検索ライブラリにアクセスするための操作インターフェースである。さらに、Knowhereはヘテロジニアス・コンピューティングも担当している。Knowhereは、インデックス構築や検索要求をどのハードウェア（CPUやGPUなど）で実行するかを制御する。これがKnowhereの名前の由来である。将来のリリースでは、DPUやTPUを含むより多くの種類のハードウェアがサポートされる予定です。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>図7</span> </span></p>
<p>Milvusの計算には主にベクトル演算とスカラー演算が含まれる。KnowhereはMilvusのベクトル演算のみを扱います。上図はMilvusにおけるKnowhereアーキテクチャを示している。一番下の層はシステム・ハードウェアです。サードパーティのインデックス・ライブラリはハードウェアの上にあります。そして、KnowhereはCGOを介して最上部のインデックス・ノードやクエリ・ノードと相互作用します。KnowhereはFaissの機能をさらに拡張するだけでなく、性能を最適化し、BitsetViewのサポート、より多くの類似性メトリクスのサポート、AVX512命令セットのサポート、SIMD命令の自動選択、その他の性能最適化など、いくつかの利点があります。詳細は<a href="https://milvus.io/blog/deep-dive-8-knowhere.md">こちらを</a>ご覧ください。</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvusアーキテクチャ</h3><p>以下の図は、Milvusプラットフォームの全体的なアーキテクチャを示しています。Milvusはデータフローと制御フローを分離し、スケーラビリティとディザスタリカバリの点で独立した4つのレイヤーに分かれています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>図8</span> </span></p>
<ul>
<li><strong>アクセス層</strong>アクセスレイヤーはステートレスプロキシ群で構成され、システムのフロントレイヤーとして、またユーザーへのエンドポイントとして機能する。</li>
<li><strong>コーディネータ・サービス：</strong>コーディネータ・サービスは、クラスタ・トポロジーのノード管理、負荷分散、タイムスタンプ生成、データ宣言、データ管理を担当する。</li>
<li><strong>ワーカーノード：</strong>ワーカーノード（実行ノード）は、コーディネータサービスによって発行された命令とプロキシによって開始されたデータ操作言語（DML）コマンドを実行します。Milvusのワーカーノードは<a href="https://hadoop.apache.org/">Hadoopの</a>データノードやHBaseのリージョンサーバに似ている。</li>
<li><strong>ストレージ：</strong>Milvusの要であり、データの永続化を担う。ストレージレイヤーは、<strong>メタストア</strong>、<strong>ログブローカー</strong>、<strong>オブジェクトストレージで</strong>構成される。</li>
</ul>
<p>アーキテクチャの詳細は<a href="https://milvus.io/docs/v2.0.x/four_layers.md">こちらを</a>ご覧ください！</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Milvusでビジュアル画像検索を行う - ユースケースの青写真<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusのようなオープンソースのベクトルデータベースは、どのようなビジネスでも最小限のステップで独自のビジュアル画像検索システムを構築することを可能にします。開発者は、事前に訓練されたAIモデルを使用して、独自の画像データセットをベクトルに変換し、Milvusを活用して画像から類似商品を検索することができます。このようなシステムを設計・構築する方法の青写真を以下に見てみよう。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>図9</span> </span></p>
<p>このワークフローでは、<a href="https://github.com/towhee-io/towhee">towheeの</a>ようなオープンソースのフレームワークを使用して、ResNet-50のような事前に学習されたモデルを活用し、画像からベクトルを抽出し、これらのベクトルをMilvusに簡単に保存してインデックス化し、さらにMySQLデータベースに画像IDと実際の画像のマッピングを保存することができます。データがインデックス化されれば、Milvusを使用して、新しい画像を簡単にアップロードし、大規模な画像検索を実行することができます。次の図はビジュアル画像検索のサンプルである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>図10</span> </span></p>
<p>MilvusのおかげでGitHubにオープンソース化された詳細な<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">チュートリアルを</a>チェックしよう。</p>
<h2 id="Conclusion" class="common-anchor-header">まとめ<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事でかなりの範囲をカバーした。オープンソースのベクトル・データベースであるMilvusを使って、非構造化データの表現、ベクトルの活用、ベクトル類似性検索を大規模に行うという課題から始めた。Milvusがどのように構造化されているか、Milvusを動かしている主要なコンポーネントの詳細と、Milvusを使ったビジュアル画像検索という現実世界の問題を解決する方法の青写真について議論した。<a href="https://milvus.io/">Milvusを試してみて</a>、現実世界の問題を<a href="https://milvus.io/">Milvusで</a>解決してみよう！</p>
<p>この記事が気に入りましたか？この記事を気に入っていただけましたか？</p>
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
    </button></h2><p>Dipanjan (DJ) Sarkarは、データサイエンスリード、Google Developer Expert - Machine Learning、著者、コンサルタント、AIアドバイザー。コネクト: http://bit.ly/djs_linkedin</p>
