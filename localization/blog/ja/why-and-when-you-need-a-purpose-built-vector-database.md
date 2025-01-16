---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: 目的別ベクターデータベースが必要な理由と時期
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  この記事では、ベクター検索とその機能の概要を説明し、さまざまなベクター検索技術を比較し、専用に構築されたベクターデータベースを選択することが重要である理由を説明する。
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>この記事は<a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAIに</a>掲載されたものを許可を得て再掲載しています。</em></p>
<p><a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPTや</a>その他の大規模言語モデル（LLM）の人気の高まりは、<a href="https://milvus.io/docs/overview.md">Milvusや</a> <a href="https://zilliz.com/cloud">Zilliz Cloudの</a>ような専用のベクトルデータベース、<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISSの</a>ようなベクトル検索ライブラリ、従来のデータベースと統合されたベクトル検索プラグインなど、ベクトル検索テクノロジーの台頭に拍車をかけている。しかし、ニーズに合った最適なソリューションを選ぶのは難しいものです。高級レストランとファーストフードチェーンのどちらを選ぶかのように、適切なベクター検索テクノロジーを選択するかは、ニーズと期待次第である。</p>
<p>この記事では、ベクター検索とその機能の概要を説明し、さまざまなベクター検索テクノロジーを比較し、専用に構築されたベクターデータベースを選ぶことが重要である理由を説明します。</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">ベクトル検索とは何か？<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/vector-similarity-search">ベクトル検索は</a>、ベクトル類似性検索とも呼ばれ、高密度なベクトルデータの膨大なコレクションの中から、与えられたクエリベクトルと最も類似している、または意味的に関連している上位k個の結果を検索する技術である。</p>
<p>類似検索を行う前に、ニューラルネットワークを活用して、テキスト、画像、動画、音声などの<a href="https://zilliz.com/blog/introduction-to-unstructured-data">非構造化データを</a>埋め込みベクトルと呼ばれる高次元数値ベクトルに変換する。例えば、事前に訓練されたResNet-50畳み込みニューラルネットワークを使って、鳥の画像を2,048次元のエンベッディングのコレクションに変換することができます。ここでは、最初の3つと最後の3つのベクトル要素を列挙する：<code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Patrice Bouchardによる鳥の画像</span> </span></p>
<p>埋め込みベクトルを生成した後、ベクトル検索エンジンは、入力クエリーベクトルとベクトルストアのベクトル間の空間距離を比較します。空間的に近ければ近いほど、似ていることになります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>埋め込み演算</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">一般的なベクトル検索技術<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>PythonのNumPyのような機械学習ライブラリ、FAISSのようなベクトル検索ライブラリ、従来のデータベース上に構築されたベクトル検索プラグイン、MilvusやZilliz Cloudのような特殊なベクトルデータベースなど、複数のベクトル検索技術が市場に出回っている。</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">機械学習ライブラリ</h3><p>機械学習ライブラリを使うのが、ベクトル検索を実装する最も簡単な方法だ。例えば、PythonのNumPyを使えば、20行以下のコードで最近傍アルゴリズムを実装できる。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>100個の2次元ベクトルを生成し、ベクトル[0.5, 0.5]の最近傍を見つけることができる。</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>PythonのNumPyのような機械学習ライブラリは、低コストで大きな柔軟性を提供します。しかし、いくつかの制限がある。例えば、少量のデータしか扱えず、データの永続性が保証されていない。</p>
<p>NumPyや他の機械学習ライブラリをベクトル検索に使うことをお勧めするのは、以下のような場合だけだ：</p>
<ul>
<li>素早くプロトタイプを作成する必要がある。</li>
<li>データの永続性を気にしない。</li>
<li>データサイズが100万以下で、スカラーフィルタリングを必要としない。</li>
<li>高いパフォーマンスを必要としない。</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">ベクトル検索ライブラリ</h3><p>ベクトル検索ライブラリは、高性能なベクトル検索システムのプロトタイプを素早く構築するのに役立ちます。FAISSはその典型的な例です。これはオープンソースで、効率的な類似性検索と高密度ベクトルクラスタリングのためにMeta社によって開発されました。FAISSはどのようなサイズのベクトルコレクションでも扱うことができ、メモリに完全にロードできないようなサイズでも扱うことができます。さらに、FAISSは評価とパラメータチューニングのためのツールを提供します。C++で書かれていますが、FAISSはPython/NumPyインターフェースを提供します。</p>
<p>以下は、FAISSに基づくベクトル探索の例のコードです：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>FAISSのようなベクトル検索ライブラリは使いやすく、数百万のベクトルを扱う小規模な本番環境でも十分に高速です。量子化やGPUを利用し、データの次元を小さくすることで、クエリのパフォーマンスを向上させることができます。</p>
<p>しかし、これらのライブラリは本番環境で使用する場合、いくつかの制限があります。例えば、FAISSはリアルタイムのデータ追加・削除、リモートコール、多言語、スカラーフィルタリング、スケーラビリティ、ディザスタリカバリをサポートしていません。</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">さまざまなタイプのベクトルデータベース</h3><p>ベクターデータベースは、上記のライブラリーの制限に対処するために登場し、プロダクションアプリケーションにより包括的で実用的なソリューションを提供している。</p>
<p>戦場では4種類のベクトルデータベースが利用可能である：</p>
<ul>
<li>ベクトル検索プラグインを組み込んだ既存のリレーショナル・データベースまたはカラム型データベース。PG Vectorはその一例である。</li>
<li>従来の転置インデックス型検索エンジンで、高密度のベクトルインデックスをサポートしているもの。<a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearchは</a>その一例である。</li>
<li>ベクトル検索ライブラリ上に構築された軽量ベクトルデータベース。Chromaがその例。</li>
<li><strong>目的に特化したベクターデータベース</strong>。このタイプのデータベースは、ボトムアップのベクトル検索用に特別に設計され、最適化されている。分散コンピューティング、ディザスタリカバリ、データ永続化など、より高度な機能を提供する。<a href="https://zilliz.com/what-is-milvus">Milvusが</a>その主な例である。</li>
</ul>
<p>すべてのベクターデータベースが同じように作られているわけではありません。それぞれのスタックには独自の利点と制限があり、用途によって向き不向きがある。</p>
<p>私が他のソリューションよりも特化したベクターデータベースを好むのは、ベクターデータベースが最も効率的で便利なオプションであり、多くのユニークな利点を提供するからである。以下のセクションでは、Milvusを例にして、私が好む理由を説明します。</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">専用ベクターデータベースの主な利点<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvusは</a>オープンソースの分散型専用ベクターデータベースで、何十億もの埋め込みベクターの保存、インデックス作成、管理、検索が可能です。また、<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM検索拡張生成の</a>ための最も一般的なベクトルデータベースの一つでもあります。Milvusは、他のベクターデータベースと異なる多くのユニークな利点を持っています。</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">データの永続性と費用対効果の高いストレージ</h3><p>データ損失を防ぐことはデータベースの最低条件であるが、多くのシングルマシンや軽量ベクトルデータベースはデータの信頼性を優先していない。対照的に、<a href="https://zilliz.com/what-is-milvus">Milvusの</a>ような目的に特化した分散ベクターデータベースは、ストレージと計算を分離することで、システムの耐障害性、スケーラビリティ、データの永続性を優先しています。</p>
<p>さらに、近似最近傍(ANN)インデックスを利用するほとんどのベクトルデータベースは、ANNインデックスを純粋にメモリにロードするため、ベクトル検索を実行するために多くのメモリを必要とする。しかし、Milvusはディスクインデックスをサポートしており、インメモリインデックスの10倍以上のコスト効率でストレージを利用することができる。</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">最適なクエリパフォーマンス</h3><p>特化したベクトルデータベースは、他のベクトル検索オプションと比較して最適なクエリ性能を提供します。例えば、Milvusはベクトル検索プラグインよりもクエリ処理が10倍高速です。Milvusは、より高速なベクトル検索のために、KNNブルータル検索アルゴリズムの代わりに<a href="https://zilliz.com/glossary/anns">ANNアルゴリズムを</a>使用しています。さらに、インデックスをシャード化することで、データ量の増加に伴うインデックス構築にかかる時間を短縮している。このアプローチにより、Milvusは数十億のベクトルをリアルタイムでデータ追加・削除しながら容易に扱うことができる。対照的に、他のベクトル検索アドオンは、データ量が数千万以下で、追加や削除の頻度が低いシナリオにしか適していません。</p>
<p>MilvusはGPUアクセラレーションにも対応している。社内テストによると、GPUアクセラレーションによるベクトルインデックス作成は、数千万件のデータを検索する際に10,000 QPS以上を達成することができ、これはシングルマシンのクエリパフォーマンスにおいて、従来のCPUインデックス作成よりも少なくとも10倍高速です。</p>
<h3 id="System-Reliability" class="common-anchor-header">システムの信頼性</h3><p>多くのアプリケーションは、低クエリレイテンシと高スループットを必要とするオンラインクエリにベクトルデータベースを使用しています。このようなアプリケーションでは、分単位でのシングルマシンフェイルオーバーが要求され、クリティカルなシナリオではリージョンをまたいだディザスタリカバリが必要な場合もあります。Raft/Paxosをベースとした従来のレプリケーション戦略では、リソースの浪費が深刻で、データの事前シャーディングを支援する必要があり、信頼性が低い。これに対してMilvusは、K8sメッセージキューを活用した分散アーキテクチャにより高可用性を実現し、リカバリ時間の短縮とリソースの節約を実現している。</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">運用性と監視性</h3><p>エンタープライズユーザにより良いサービスを提供するためには、ベクターデータベースは操作性と観測性を向上させるためにエンタープライズレベルの様々な機能を提供する必要があります。Milvusは、K8s OperatorやHelm chart、docker-compose、pip installなど複数のデプロイ方法をサポートしており、さまざまなニーズを持つユーザーが利用できるようになっています。また、MilvusはGrafana、Prometheus、Lokiをベースとしたモニタリングとアラームシステムを提供し、観測性を向上させている。分散型クラウドネイティブアーキテクチャを採用したMilvusは、マルチテナント分離、RBAC、クォータ制限、ローリングアップグレードをサポートする業界初のベクターデータベースです。これらのアプローチにより、Milvusの管理と監視がよりシンプルになります。</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Milvusを10分で始める3つのステップ<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトルデータベースの構築は複雑な作業ですが、それを使うのはNumpyとFAISSを使うのと同じくらい簡単です。AIに不慣れな学生でも、Milvusをベースとしたベクトル検索をわずか10分で実装することができます。スケーラブルで高性能なベクトル検索サービスを体験するには、以下の3つのステップに従ってください：</p>
<ul>
<li>Milvus<a href="https://milvus.io/docs/install_standalone-docker.md">導入ドキュメントを</a>参考に、Milvusをサーバに導入する。</li>
<li><a href="https://milvus.io/docs/example_code.md">Hello Milvusドキュメントを</a>参照し、わずか50行のコードでベクトル検索を実装する。</li>
<li><a href="https://github.com/towhee-io/examples/">Towheeのサンプルドキュメントを</a>参照し、<a href="https://zilliz.com/use-cases">ベクターデータベースの</a>一般的な<a href="https://zilliz.com/use-cases">使用</a>例を理解する。</li>
</ul>
