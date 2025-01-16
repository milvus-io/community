---
id: getting-started-with-hnswlib.md
title: HNSWlibを始める
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSWを実装したライブラリであるHNSWlibは、非常に効率的でスケーラブルであり、数百万点でも十分なパフォーマンスを発揮します。数分で実装する方法をご覧ください。
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">セマンティック検索は</a>、機械が言語を理解し、AIやデータ分析に不可欠な、より良い検索結果をもたらすことを可能にする。言語が<a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">埋め込みとして</a>表現されると、検索は厳密な方法と近似的な方法を用いて実行することができる。近似最近傍<a href="https://zilliz.com/glossary/anns">(ANN</a>)検索は、高次元データに対して計算コストのかかる<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">厳密最近傍検索とは</a>異なり、与えられたクエリ点に最も近いデータセット内の点を素早く見つけるために使用される手法である。ANNは近似最近傍探索の結果を提供することで、より高速な検索を可能にする。</p>
<p>近似最近傍(ANN)検索のアルゴリズムの1つに<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>(Hierarchical Navigable Small Worlds)があり、<a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlibで</a>実装されています。このブログでは</p>
<ul>
<li><p>HNSW アルゴリズムを理解する。</p></li>
<li><p>HNSWlib とその主な機能について説明する。</p></li>
<li><p>HNSWlibをセットアップし、インデックス構築と検索の実装をカバーする。</p></li>
<li><p>Milvusと比較する。</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">HNSWを理解する<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong>は、グラフベースのデータ構造で、特に高次元空間において、「スモールワールド」ネットワークの多層グラフを構築することで、効率的な類似検索を可能にする。<a href="https://arxiv.org/abs/1603.09320">2016</a>年に発表されたHNSWは、ブルートフォース検索やツリーベース検索のような従来の検索手法に関連するスケーラビリティの問題に対処している。推薦システム、画像認識、<a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">検索拡張世代（RAG</a>）など、大規模なデータセットを含むアプリケーションに最適です。</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">HNSWが重要な理由</h3><p>HNSWは、高次元空間における最近傍探索の性能を大幅に向上させる。階層構造とスモールワールド・ナビゲータビリティを組み合わせることで、旧来の手法に見られる計算効率の悪さを回避し、巨大で複雑なデータセットでも高い性能を発揮することができる。これをよりよく理解するために、HNSWの仕組みを見てみよう。</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">HNSWの仕組み</h3><ol>
<li><p><strong>階層的レイヤー：</strong>HNSWはデータをレイヤーの階層に整理し、各レイヤーはエッジで接続されたノードを含む。上位のレイヤーは疎であり、地図をズームアウトして都市間の主要な高速道路だけを見るように、グラフを広範囲に「スキップ」することができる。下位のレイヤーは密度が高くなり、より詳細で、より近い隣人同士のつながりを提供する。</p></li>
<li><p><strong>ナビゲーバブル・スモール・ワールドのコンセプト</strong>HNSWの各レイヤーは、ノード（データポイント）が互いに数ホップしか離れていない「スモールワールド」ネットワークのコンセプトに基づいています。探索アルゴリズムは、最も高密度で疎なレイヤーから開始し、徐々に高密度のレイヤーに移動しながら下へ下へと探索を絞り込んでいく。このアプローチは、グローバルな視野から近隣レベルの詳細へと移動し、検索範囲を徐々に狭めていくようなものだ。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">図1</a>：ナビゲート可能なスモールワールドグラフの例</p>
<ol start="3">
<li><strong>スキップリストのような構造：</strong>HNSWの階層的な側面は、スキップリストに似ている。スキップリストは確率的なデータ構造であり、上位の階層ほどノード数が少なくなるため、最初の検索を高速に行うことができる。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">図2</a>：スキップリスト構造の例</p>
<p>与えられたスキップリストで96を検索するには、左端のヘッダー・ノードで最上位レベルから始める。右側に移動すると、96より小さい31に遭遇するので、次のノードに進みます。ここで、もう一度31を見つけるために、もう1つ下のレベルに移動します。もう一度31を見つけたら、右に移動し、目標値である96に到達する。こうして、スキップリストの最下層に降りることなく、96を見つけることができる。</p>
<ol start="4">
<li><p><strong>探索効率：</strong>HNSWアルゴリズムは、最上位レイヤーのエントリー・ノードから開始し、各ステップでより近傍に進む。最も類似したノードが見つかる可能性の高い最下層に到達するまで、各レイヤーを粗視化から細視化探索に使用しながら、レイヤーを下降する。このレイヤー・ナビゲーションは、探索する必要があるノードとエッジの数を減らし、探索を高速かつ正確にします。</p></li>
<li><p><strong>挿入とメンテナンス</strong>：新しいノードを追加するとき、アルゴリズムは確率に基づいてそのエントリーレイヤーを決定し、近傍選択ヒューリスティックを使用して近くのノードに接続します。このヒューリスティックは接続性を最適化することを目的とし、グラフ密度のバランスをとりながらナビゲーションを向上させるリンクを作成する。このアプローチにより、構造はロバストに保たれ、新しいデータポイントに適応できる。</p></li>
</ol>
<p>我々はHNSWアルゴリズムについて基礎的な理解を持っているが、それをゼロから実装することは圧倒的である。幸いなことに、コミュニティは<a href="https://github.com/nmslib/hnswlib">HNSWlibの</a>ようなライブラリを開発し、使い方を単純化することで、頭を悩ませることなくアクセスできるようにしている。それでは、HNSWlibを詳しく見ていきましょう。</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">HNSWlibの概要<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWを実装した一般的なライブラリであるHNSWlibは、非常に効率的でスケーラブルであり、数百万点でも十分な性能を発揮します。グラフ層間の素早いジャンプを可能にし、高密度で高次元のデータに対する探索を最適化することで、線形以下の時間複雑性を実現しています。HNSWlib の主な特徴は以下の通り：</p>
<ul>
<li><p><strong>グラフベースの構造：</strong>多層グラフでデータ点を表現し、高速な最近傍探索を可能にします。</p></li>
<li><p><strong>高次元の効率性：</strong>高次元データに最適化され、迅速かつ正確な近似検索を実現します。</p></li>
<li><p><strong>サブリニア検索時間:</strong>階層をスキップすることでサブリニアの複雑さを実現し、速度を大幅に向上。</p></li>
<li><p><strong>動的更新：</strong>グラフを完全に再構築することなく、ノードの挿入と削除をリアルタイムでサポートします。</p></li>
<li><p><strong>メモリ効率：</strong>大規模データセットに適した効率的なメモリ使用。</p></li>
<li><p><strong>スケーラビリティ</strong>数百万データポイントまで拡張可能で、レコメンデーションシステムのような中規模アプリケーションに最適。</p></li>
</ul>
<p><strong>注：</strong>HNSWlib はベクトル検索アプリケーションの簡単なプロトタイプを作成するのに優れています。しかし、スケーラビリティに限界があるため、数億から数十億のデータポイントを含む複雑なシナリオには、<a href="https://zilliz.com/blog/what-is-a-real-vector-database">専用のベクトルデータベースなど</a>、より良い選択肢があるかもしれません。それでは実際に見てみよう。</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">HNSWlib を始める：ステップ・バイ・ステップ・ガイド<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>このセクションでは、HNSW インデックスを作成し、データを挿入し、検索を実行することで、HNSWlib を<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">ベクトル検索ライブラリとして</a>使用する方法を説明します。まずはインストールから始めましょう：</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">セットアップとインポート</h3><p>Python で HNSWlib を使い始めるには、まず pip を使ってインストールします：</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>次に、必要なライブラリをインポートします：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">データの準備</h3><p>この例では、<code translate="no">NumPy</code>、10,000個の要素を持つランダムなデータセットを生成する。</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>データを作成しよう：</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>データの準備ができたので、インデックスを作成しよう。</p>
<h3 id="Building-an-Index" class="common-anchor-header">インデックスの構築</h3><p>インデックスを作成するには、ベクトルの次元数と空間タイプを定義する必要があります。インデックスを作成しよう：</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>:このパラメータは類似度に使用する距離メトリックを定義します。これを<code translate="no">'l2'</code> に設定すると、ユークリッド距離（L2ノルム）を使用することになります。代わりに<code translate="no">'ip'</code> に設定すると、内積を使用することになり、余弦類似度のようなタスクに役立ちます。</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>:このパラメータは、扱うデータ点の次元を指定します。インデックスに追加するデータの次元と一致していなければなりません。</li>
</ul>
<p>以下はインデックスを初期化する方法です：</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>:インデックスに追加できる要素の最大数を設定します。<code translate="no">Num_elements</code> が最大容量なので、10,000個のデータポイントを扱うため、これを10,000に設定します。</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>:このパラメータは、インデックス作成時の精度対作成速度のトレードオフを制御します。高い値を設定するとリコール（精度）が向上しますが、メモリ使用量と構築時間が増加します。一般的な値は100から200です。</li>
</ul>
<ul>
<li><code translate="no">M=16</code>:このパラメータは、各データポイントに対して作成される双方向リンクの数を決定し、精度と検索速度に影響を与える。一般的な値は12から48の間で、16が中程度の精度とスピードのバランスになることが多い。</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>:<code translate="no">ef</code> パラメーターは "exploration factor"（探索係数）の略で、探索中にどれだけの近傍探索を行うかを決定する。<code translate="no">ef</code> の値が高いほど、より多くの近傍探索が行われることになり、一般的に探索の精度（リコール）が上がりますが、探索速度も遅くなります。逆に、<code translate="no">ef</code> の値が低いと、検索は速くなりますが、精度が落ちる可能性があります。</li>
</ul>
<p>この場合、<code translate="no">ef</code> を50に設定すると、検索アルゴリズムは最も類似したデータポイントを見つける際に50近傍まで評価します。</p>
<p>注意:<code translate="no">ef_construction</code> はインデックス作成時に近傍探索の労力を設定し、精度を向上させますが、作成は遅くなります。<code translate="no">ef</code> はクエリ実行時に探索の労力を制御し、各クエリに対して動的に速度と想起のバランスを取ります。</p>
<h3 id="Performing-Searches" class="common-anchor-header">検索の実行</h3><p>HNSWlibを使って最近傍検索を実行するには、まずランダムなクエリベクトルを作成します。この例では、ベクトルの次元数はインデックスされたデータと一致します。</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>:この行は、インデックス付けされたデータと同じ次元数のランダムなベクトルを生成し、最近傍検索の互換性を確保します。</li>
<li><code translate="no">knn_query</code>:このメソッドは，インデックス<code translate="no">p</code> 内で<code translate="no">query_vector</code> の<code translate="no">k</code> 最近傍を探索します．このメソッドは，2つの配列を返します．<code translate="no">labels</code>この配列は，最近傍のインデックスを含み，<code translate="no">distances</code> は，クエリベクトルから各近傍への距離を表します．ここで、<code translate="no">k=5</code> は、最も近い5つの近傍を見つけることを指定します。</li>
</ul>
<p>ラベルと距離を表示した結果がこれです：</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>HNSWlib を使い始めるための簡単なガイドです。</p>
<p>前述したように、HNSWlib はプロトタイピングや中規模データセットの実験に最適なベクトル検索エンジンです。より高いスケーラビリティが必要な場合や、エンタープライズレベルの機能が必要な場合は、オープンソースの<a href="https://zilliz.com/what-is-milvus">Milvusや</a>、<a href="https://zilliz.com/cloud">Zilliz Cloudの</a>フルマネージドサービスのような、専用のベクターデータベースを選択する必要があるかもしれません。そこで、次のセクションでは、HNSWlib と Milvus を比較します。</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib と Milvus のような汎用ベクターデータベースの比較<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/what-is-vector-database">ベクトル・データベースは</a>、データを数学的表現として保存し、<a href="https://zilliz.com/ai-models">機械学習モデルによる</a>検索、レコメンデーション、テキスト生成を可能にします<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">。</a></p>
<p>HNSWlibのようなベクトル指標ライブラリは、<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索と</a>取得を向上させますが、完全なデータベースの管理機能はありません。一方、<a href="https://milvus.io/">milvusの</a>ようなベクトルデータベースは、大規模なベクトル埋め込みを扱うように設計されており、データ管理、インデックス作成、クエリ機能において、スタンドアロンライブラリには通常ない利点を提供します。Milvusを使用するその他の利点は以下の通りです：</p>
<ul>
<li><p><strong>高速ベクトル類似検索</strong>：Milvusは、画像検索、推薦システム、自然言語処理<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP</a>)、検索拡張世代<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(</a>RAG)などのアプリケーションに理想的な、10億スケールのベクトルデータセットに対してミリ秒レベルの検索性能を提供します。</p></li>
<li><p><strong>スケーラビリティと高可用性：</strong>大量のデータを処理するために構築されたMilvusは、水平方向に拡張可能で、信頼性のためのレプリケーションとフェイルオーバーメカニズムを備えています。</p></li>
<li><p><strong>分散アーキテクチャ</strong>Milvusは、ストレージとコンピューティングを複数のノードに分離した分散型のスケーラブルなアーキテクチャを採用しており、柔軟性と堅牢性を実現しています。</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>ハイブリッド検索</strong></a><strong>：</strong>Milvusは、マルチモーダル検索、<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">ハイブリッドスパース検索、</a>ハイブリッドデンス検索、<a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">ハイブリッドフルテキスト検索を</a>サポートし、多様で柔軟な検索機能を提供します。</p></li>
<li><p><strong>柔軟なデータサポート</strong>Milvusはベクトル、スカラー、構造化データなど様々なデータタイプをサポートし、単一のシステム内でシームレスな管理と分析を可能にします。</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>活発な</strong></a> <strong>コミュニティとサポート</strong>活発なコミュニティが定期的なアップデート、チュートリアル、サポートを提供し、Milvusがユーザーのニーズとこの分野の進歩に常に合致していることを保証します。</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">AIとの統合</a>：Milvusは、様々な一般的なAIフレームワークやテクノロジーと統合されており、開発者は使い慣れた技術スタックでアプリケーションを簡単に構築することができます。</p></li>
</ul>
<p>また、Milvusは<a href="https://zilliz.com/cloud">Ziliz Cloud</a>上でフルマネージドサービスを提供しており、手間がかからず、Milvusの10倍の速さで利用できる。</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">比較MilvusとHNSWlibの比較</h3><table>
<thead>
<tr><th style="text-align:center"><strong>特徴</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">スケーラビリティ</td><td style="text-align:center">数十億のベクトルを簡単に処理</td><td style="text-align:center">RAM 使用量のため、より小さなデータセットに最適</td></tr>
<tr><td style="text-align:center">理想的な用途</td><td style="text-align:center">プロトタイピング，実験，企業レベルのアプリケーション</td><td style="text-align:center">プロトタイプと軽量のANNタスクに特化</td></tr>
<tr><td style="text-align:center">インデックス作成</td><td style="text-align:center">HNSW、DiskANN、量子化、バイナリなど10以上のインデックス作成アルゴリズムをサポート</td><td style="text-align:center">グラフベースのHNSWのみを使用</td></tr>
<tr><td style="text-align:center">統合</td><td style="text-align:center">APIとクラウドネイティブサービスを提供</td><td style="text-align:center">軽量なスタンドアロンライブラリとして機能</td></tr>
<tr><td style="text-align:center">パフォーマンス</td><td style="text-align:center">大規模データ、分散クエリに最適化</td><td style="text-align:center">高速だがスケーラビリティは限定的</td></tr>
</tbody>
</table>
<p>全体として、Milvusは複雑なインデックス作成が必要な大規模なプロダクショングレードのアプリケーションに適しており、HNSWlibはプロトタイピングやより単純なユースケースに適している。</p>
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
    </button></h2><p>セマンティック検索はリソースを大量に消費するため、HNSW が行うような内部データ構造化は、データ検索を高速化するために不可欠である。HNSWlibのようなライブラリは実装に気を配っているので、開発者はベクター機能をプロトタイプするためのレシピを用意している。わずか数行のコードで、独自のインデックスを構築し、検索を実行できる。</p>
<p>HNSWlibは手始めとして最適です。しかし、複雑で量産可能なAIアプリケーションを構築したいのであれば、専用のベクターデータベースが最適だ。例えば、<a href="https://milvus.io/">Milvusは</a>オープンソースのベクターデータベースで、高速なベクター検索、スケーラビリティ、可用性、データ型やプログラミング言語の柔軟性など、多くのエンタープライズ対応機能を備えている。</p>
<h2 id="Further-Reading" class="common-anchor-header">さらに読む<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">Faiss（フェイスブックAI類似検索）とは？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlibとは？高速ANN検索のためのグラフベースライブラリ </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN (Scalable Nearest Neighbors)とは？ </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench：オープンソースのVectorDBベンチマークツール</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">ジェネレーティブAIリソースハブ｜Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースとは？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAGとは？ </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">あなたのGenAIアプリのためのトップパフォーマンスAIモデル｜Zilliz</a></p></li>
</ul>
