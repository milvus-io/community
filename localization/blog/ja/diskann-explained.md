---
id: diskann-explained.md
title: DiskANNの説明
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  DiskANN がどのように SSD
  を使用して億単位のベクトル検索を実現し、低いメモリ使用量、高い精度、スケーラブルなパフォーマンスを両立させているかをご覧ください。
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">DiskANN とは？<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a>は<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル類似性</a>検索のパラダイムシフトとなるアプローチです。それ以前は、HNSW のようなほとんどのベクトル インデックスは、低レイテンシと高リコールを達成するために RAM に大きく依存していました。中程度のサイズのデータセットには効果的ですが、このアプローチはデータ量が大きくなるにつれて、法外に高価になり、拡張性が低下します。DiskANN は、SSD を活用してインデックスを保存し、メモリ要件を大幅に削減することで、費用対効果の高い代替手段を提供します。</p>
<p>DiskANN はディスク アクセスに最適化されたフラット グラフ構造を採用しているため、インメモリ方式で必要とされるメモリ フットプリントのほんの一部で、億単位のデータセットを処理することができます。例えば、DiskANN は最大 10 億ベクトルまでインデックスを作成することができ、5ms のレイテンシで 95% の検索精度を達成します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図 1: DiskANN によるベクトルのインデックス作成と検索のワークフロー</em></p>
<p>DiskANN は、RAM ベースのアプローチと比較すると若干レイテンシが高くなりますが、大幅なコスト削減とスケーラビリティの利点を考えると、トレードオフは許容範囲内です。DiskANN は、コモディティ ハードウェア上で大規模なベクトル検索を必要とするアプリケーションに特に適しています。</p>
<p>この記事では、RAM に加えて SSD を活用し、コストのかかる SSD 読み込みを削減する DiskANN の巧妙な手法について説明します。</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">DiskANN の仕組み<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN は HNSW と同じ系統のグラフベースのベクトル検索手法です。まず、ノードがベクトル（またはベクトル群）に対応し、エッジがベクトルのペアがある意味で「相対的に近い」ことを示す検索グラフを構築します。典型的な検索では、ランダムに "エントリノード "を選択し、クエリに最も近いその近傍にナビゲートし、ローカルミニマムに達するまで貪欲に繰り返す。</p>
<p>グラフベースのインデックス作成フレームワークは、主に検索グラフの構築方法と検索の実行方法が異なる。そしてこのセクションでは、これらのステップにおけるDiskANNの革新と、それらがどのように低レイテンシー、低メモリのパフォーマンスを可能にしているかについて、技術的に深く掘り下げていく。(概要は上図をご覧ください）。</p>
<h3 id="An-Overview" class="common-anchor-header">概要</h3><p>ユーザーが文書ベクトル埋め込み集合を生成したと仮定します。最初のステップは、埋め込みをクラスタリングすることである。各クラスタの探索グラフは、Vamanaアルゴリズム（次節で説明）を用いて個別に構築され、その結果は単一のグラフにマージされる。<em>最終的な検索グラフを作成するための分割統治戦略は、検索レイテンシや想起に大きな影響を与えることなく、メモリ使用量を大幅に削減します。</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図 2: DiskANN が RAM と SSD にまたがってベクトル インデックスを保存する方法</em></p>
<p>グローバル検索グラフを作成した後、完全精度のベクトル埋め込みとともにSSDに保存します。SSDへのアクセスはRAMへのアクセスに比べて高価であるため、SSDの読み込み回数を制限して検索を終了させることが大きな課題です。そこで、読み取り回数を制限するために、いくつかの巧妙なトリックが用いられている：</p>
<p>第一に、Vamanaアルゴリズムは、ノードの最大隣接数に上限を設ける一方で、近いノード間の短いパスを奨励する。第二に、各ノードの埋め込みとその近傍を保存するために、固定サイズのデータ構造が使用される（上図参照）。これが意味するのは、データ構造のサイズにノードのインデックスを掛け合わせ、これをオフセットとして使用すると同時に、ノードの埋め込みをフェッチすることで、ノードのメタデータをアドレス指定できるということです。第三に、SSDの仕組みにより、1回の読み込み要求で複数のノード（今回の場合は隣接ノード）をフェッチできるため、読み込み要求の回数をさらに減らすことができます。</p>
<p>これとは別に、積量子化を用いて埋め込みを圧縮し、RAMに保存します。そうすることで、数十億スケールのベクトルデータセットを、ディスク読み込みなしで<em>近似ベクトルの類似度を</em>素早く計算するために、1台のマシンで実現可能なメモリに収めることができる。これにより、SSD上で次にアクセスする近隣ノードの数を減らすための指針が得られる。しかし、重要なことは、SSDから検索された完全なエンベッディングを用いて、<em>正確なベクトル類似</em>度を用いて検索決定が行われることである。強調したいのは、メモリ上の量子化された埋め込みを使った探索の初期段階と、SSDから読み出したより小さなサブセットを使ったその後の探索があるということである。</p>
<p>この説明では、グラフをどのように構築するか、グラフをどのように検索するかという、重要ではあるが複雑な2つのステップを説明してきた。それぞれを順番に見ていこう。</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">「ヴァマナ」グラフの構築</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：「Vamana "グラフの構築</em></p>
<p>DiskANNの著者たちは、探索グラフを構築する新しい方法を開発した。彼らはこれを「Vamana」アルゴリズムと呼んでいる。これはO(N)個の辺をランダムに追加することで探索グラフを初期化する。これにより、貪欲な探索の収束は保証されないが、「うまく接続された」グラフが得られる。その後、十分な長距離接続があることを保証するために、インテリジェントな方法で辺の刈り込みと再接続を行う（上図参照）。詳しく説明しよう：</p>
<h4 id="Initialization" class="common-anchor-header">初期化</h4><p>探索グラフは、各ノードがR個の外隣接を持つランダムな有向グラフに初期化される。また、グラフのメドイド、つまり他のすべての点との平均距離が最小となる点を計算する。これはノードの集合のメンバーであるセントロイドに類似していると考えることができる。</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">候補の探索</h4><p>初期化後、各ステップでエッジの追加と削除の両方を実行しながら、ノード上を反復します。まず、選択されたノードpに対して探索アルゴリズムを実行し、候補のリストを生成する。探索アルゴリズムはメドイドから始まり、貪欲に選択されたノードに近づいていき、各ステップでこれまでに見つかった最も近いノードの外隣接を追加する。pに最も近いL個のノードのリストが返される。(この概念に馴染みがない方のために説明しておくと、グラフのメドイドとは、他のすべての点との平均距離が最小となる点のことで、グラフのセントロイドのアナログとして機能する)。</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">枝刈りと辺の追加</h4><p>ノードの近傍候補は距離でソートされ、それぞれの候補について、すでに選ばれた近傍と方向が「近すぎる」かをアルゴリズムがチェックする。近すぎる場合は削除されます。これは経験的に、より良いナビゲーション特性につながる隣人間の角度の多様性を促進します。実際には、これはランダムなノードから出発した探索が、長距離リンクとローカルリンクの疎なセットを探索することで、より速く任意のターゲットノードに到達できることを意味する。</p>
<p>エッジの刈り込み後、pへの貪欲な探索パスに沿ったエッジが追加される。プルーニングのパスは2回行われ、プルーニングのための距離の閾値を変化させ、2回目のパスで長期のエッジが追加されるようにする。</p>
<h2 id="What’s-Next" class="common-anchor-header">次の研究は？<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>その後の研究は、DiskANNをベースにさらなる改良が加えられている。<a href="https://arxiv.org/abs/2105.09613">FreshDiskANNとして</a>知られる注目すべき例の1つは、構築後にインデックスを簡単に更新できるように手法を変更したものである。性能基準間の優れたトレードオフを提供するこの検索インデックスは、<a href="https://milvus.io/docs/overview.md">Milvus</a>ベクトルデータベースで<code translate="no">DISKANN</code> インデックスタイプとして利用できます。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">MaxDegree</code> や<code translate="no">BeamWidthRatio</code> のようなDiskANNパラメータを調整することもできます。</p>
<h2 id="Resources" class="common-anchor-header">リソース<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">DiskANNの使用に関するMilvusドキュメント</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN：単一ノードでの高速高精度10億点最近傍検索"</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN: ストリーミング類似検索のための高速かつ正確なグラフベース ANN インデックス"</a></p></li>
</ul>
