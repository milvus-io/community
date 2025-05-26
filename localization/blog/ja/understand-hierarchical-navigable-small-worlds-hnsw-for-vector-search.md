---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: ベクトル探索のための階層的航行可能小世界（HNSW）の理解
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: >-
  HNSW (Hierarchical Navigable Small World)
  は、階層化されたグラフ構造を用いた近似最近傍探索のための効率的なアルゴリズムである。
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p><a href="https://milvus.io/blog/what-is-a-vector-database.md">ベクトルデータベースの</a>重要な操作は<em>類似性検索</em>であり、例えばユークリッド距離によってクエリベクトルに最も近いデータベース内の近傍ベクトルを見つけることである。素朴な方法であれば、クエリーベクトルからデータベースに格納されているすべてのベクトルまでの距離を計算し、上位K個の最も近いものを選ぶ。しかし、これはデータベースのサイズが大きくなるにつれてスケールしなくなる。実際には、素朴な類似性検索が実用的なのは、約100万個以下のベクトルしかないデータベースだけです。数千万、数億、さらには数十億のベクトルに対して、どのように検索をスケールさせればよいのでしょうか？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：ベクトル検索インデックスの階層構造の下降</em></p>
<p>高次元ベクトル空間における類似性検索を、線形以下の時間複雑度にスケールするために、多くのアルゴリズムとデータ構造が開発されてきた。この記事では、中規模のベクトル・データセットではデフォルトの選択肢となることが多い、HNSW（Hierarchical Navigable Small Worlds）と呼ばれる一般的で効果的な手法の説明と実装を行います。HNSWは、ベクトル上にグラフを構築する検索手法の一群に属し、頂点はベクトル、辺はベクトル間の類似度を表す。最も単純なケースでは、クエリに最も近い現在のノードの近傍を貪欲に探索し、局所最小値に達するまでそれを繰り返す。</p>
<p>探索グラフがどのように構築されるのか、グラフがどのように探索を可能にするのか、さらに詳しく説明し、最後に簡単なPythonによるHNSWの実装を紹介する。</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">航行可能な小さな世界<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：ランダムに配置された100個の2次元点から作成されたNSWグラフ。</em></p>
<p>前述のように、HNSWはクエリを実行する前にオフラインで検索グラフを構築する。このアルゴリズムは、先行研究であるNavigable Small Worlds（NSW）と呼ばれる手法の上に構築されている。まずNSWについて説明し、そこから<em>階層的</em>NSWに進むのは簡単である。上の図は、2次元ベクトル上のNSWの探索グラフを構築したものである。以下の全ての例では、視覚化できるように2次元ベクトルに限定する。</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">グラフの構築<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>NSWは、頂点がベクトルを表し、辺がベクトル間の類似性から発見的に構成されたグラフである。これはいわゆる「スモールワールド」と呼ばれる性質で、迅速なナビゲーションを可能にする。上の図を見てほしい。</p>
<p>グラフは空で初期化される。各ベクトルを順番にグラフに追加していく。各ベクトルについて、ランダムなエントリー・ノードから始めて、<em>これまでに構築されたグラフの中で、</em>エントリー・ポイントから到達可能な最も近いR個のノードを貪欲に見つける。これらのR個のノードは、挿入されるベクトルを表す新しいノードに接続され、オプションでR個以上の隣接ノードを持つ隣接ノードを刈り込みます。すべてのベクトルについてこの処理を繰り返すと、NSWグラフになる。アルゴリズムを視覚化した上の図を参照し、このように構築されたグラフの特性の理論的分析については、記事末尾のリソースを参照。</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">グラフの探索<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>我々はすでに、グラフ構築における使用から検索アルゴリズムを見てきた。しかしこの場合、クエリ・ノードはグラフに挿入されるものではなく、ユーザーによって提供される。ランダムなエントリーノートから出発し、貪欲にクエリに最も近い近傍にナビゲートし、これまでに遭遇した最も近いベクトルのダイナミックセットを維持する。上の図を参照。複数のランダムなエントリーポイントから検索を開始し、その結果を集約することで、また各ステップで複数の近傍を考慮することで、検索精度を向上させることができることに注意してください。しかし、これらの改善には待ち時間の増加という代償が伴います。</p>
<custom-h1>階層の追加</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ここまで、高次元空間における探索のスケールアップに役立つNSWアルゴリズムとデータ構造について説明してきた。それにもかかわらず、この方法は、低次元での失敗、探索の収束の遅さ、局所極小にとらわれる傾向など、重大な欠点を抱えている。</p>
<p>HNSWの著者らは、NSWに3つの改良を加えることで、これらの欠点を修正した：</p>
<ul>
<li><p>作図と探索の際の入口ノードの明示的選択；</p></li>
<li><p>異なるスケールによるエッジの分離、</p></li>
<li><p>近傍ノードの選択に高度なヒューリスティックを用いる。</p></li>
</ul>
<p>最初の2つは、<em>探索グラフの階層を</em>構築するという単純なアイデアで実現されている。NSWのように単一のグラフではなく、HNSWはグラフの階層を構築する。各グラフ（階層）はNSWと同じ方法で個別に検索される。最初に検索される最上位層にはほとんどノードが含まれず、より深い層ほど徐々に多くのノードが含まれるようになり、最下位層にはすべてのノードが含まれる。これは、最上層がベクトル空間を横切るホップを長く含み、一種のコースから細部への探索を可能にすることを意味する。上の図を参照。</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">グラフの構築<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>構築アルゴリズムは次のように動作する：我々は事前に層の数<em>Lを</em>固定する。l=1は最も粗い層に対応し、ここで探索が始まり、l=Lは最も密な層に対応し、ここで探索が終わる。挿入される各ベクトルを繰り返し、切り捨てられた<a href="https://en.wikipedia.org/wiki/Geometric_distribution">幾何分布に従って</a>挿入層をサンプリングする（<em>l＞Lを</em>拒否するか、<em>l'＝</em>min_(l, L)_とする）。現在のベクトルについて、<em>1 &lt; l &lt; Lを</em>サンプリングするとする。一番上の層Lの局所最小値に達するまで貪欲に探索する。次に、_L_番目の層のローカル・ミニマムから_(L-1)_番目の層の対応するベクトルへのエッジをたどり、それをエントリ・ポイントとして_(L-1)_番目の層を貪欲に探索する。</p>
<p>このプロセスを_l_番目の層に達するまで繰り返す。次に、挿入するベクトルのノードを作り始め、これまでに作られた_l_番目のレイヤーの貪欲な探索によって見つかった最も近い近傍に接続し、_(l-1)_番目のレイヤーに移動し、_1_番目のレイヤーにベクトルを挿入するまで繰り返します。上のアニメーションを見れば一目瞭然である。</p>
<p>この階層グラフ構築法は、各ベクトルの挿入ノードを巧妙に明示的に選択していることがわかる。これまでに構築された挿入層より上の層を、コースから細かい距離まで効率的に検索する。最上層は探索空間を横切る長いスケールのホップを提供し、最下層に行くにつれてスケールが小さくなる。これらの改良はいずれも、最適でない極小値に捕らわれることを避け、追加のメモリを犠牲にして探索の収束を早めるのに役立つ。</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">グラフの探索<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>探索手順は内部グラフの構築ステップとよく似ている。最上位レイヤから始めて、クエリに最も近いノードに貪欲にナビゲートする。次に、そのノードをたどって次のレイヤーに移動し、このプロセスを繰り返す。我々の答えは、この上のアニメーションで示されているように、一番下のレイヤーの<em>R個の</em>最も近い隣接ノードのリストによって得られる。</p>
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
    </button></h2><p>MilvusのようなベクトルデータベースはHNSWの高度に最適化され、調整された実装を提供し、メモリに収まるデータセットにはしばしば最適なデフォルト検索インデックスとなる。</p>
<p>我々は、HNSWがどのように機能し、なぜ機能するのかについて、理論や数学よりも視覚化と直感を優先して、ハイレベルな概要をスケッチした。その結果、構築と探索アルゴリズムの正確な説明<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 1-3]、探索と構築の複雑さの分析<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; §4.2]、構築中に近傍ノードをより効果的に選択するためのヒューリスティック<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 5]のようなあまり本質的でない詳細は省略した。さらに、アルゴリズムのハイパーパラメータ、その意味、そしてそれらがレイテンシ/スピード/メモリのトレードオフにどのように影響するか<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; §4.1]の議論は省略している。これを理解することは、HNSWを実際に使用する上で重要である。</p>
<p>以下のリソースには、これらのトピックに関するさらなる読み物と、NSWとHNSWのための完全なPython教育的実装（私自身が書いた）が含まれています。</p>
<custom-h1>リソース</custom-h1><ul>
<li><p>GitHub："<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Illustrated：学習目的のためのベクトル探索アルゴリズムであるHNSW（Hierarchical Navigable Small Worlds）の小さな実装</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW｜milvusドキュメント</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">階層的ナビゲーシブルスモールワールド(HNSW)を理解する - Zilliz Learn</a></p></li>
<li><p>HNSWの論文：<a href="https://arxiv.org/abs/1603.09320">HNSW</a>論文："<a href="https://arxiv.org/abs/1603.09320">Hierarchical Navigable Small Worldグラフを用いた効率的でロバストな近似最近傍探索</a>"</p></li>
<li><p>NSWの論文<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">「ナビゲーション可能なスモールワールドグラフに基づく近似最近傍探索アルゴリズム</a></p></li>
</ul>
