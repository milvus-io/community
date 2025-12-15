---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: 'MilvusにAISAQを導入：10億スケールのベクトル検索がメモリ上で3,200倍安くなった'
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: MilvusがAISAQによってメモリコストを3200倍削減し、DRAMオーバーヘッドなしでスケーラブルな10億ベクトル検索を可能にした方法をご覧ください。
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>ベクターデータベースは、ミッションクリティカルなAIシステムの中核インフラとなり、そのデータ量は指数関数的に増大し、しばしば数十億ベクターに達します。このような規模になると、低レイテンシーの維持、精度の維持、信頼性の確保、レプリカやリージョン間での運用など、あらゆることが難しくなります。しかし、1つの課題が早い段階で表面化し、アーキテクチャの決定を支配する傾向があります<strong>。</strong></p>
<p>高速検索を実現するために、ほとんどのベクターデータベースは、DRAM（ダイナミック・ランダム・アクセス・メモリー）に主要なインデックス構造を保持します。この設計は性能面では効果的ですが、拡張性には劣ります。DRAMの使用量はクエリ・トラフィックではなくデータ・サイズに比例するため、圧縮や部分的なSSDオフロードを行ったとしても、インデックスの大部分はメモリ上に残らなければなりません。データセットが大きくなると、メモリコストはすぐに制限要因になります。</p>
<p>Milvusは既に<strong>DISKANNを</strong>サポートしており、これはディスクベースのANNアプローチで、インデックスの大部分をSSDに移行することでメモリへの負荷を軽減している。しかし、DISKANNは、検索中に使用される圧縮表現のために、依然としてDRAMに依存している。<a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6では</a>、<a href="https://milvus.io/docs/diskann.md">DISKANNに</a>インスパイアされたディスクベースのベクトルインデックスである<a href="https://milvus.io/docs/aisaq.md">AISAQにより</a>、検索に重要なデータをすべてディスクに格納することで、これをさらに推し進める。これにより、10億ベクトルの作業負荷において、実用的な性能を維持<strong>しながら、</strong>メモリ使用量を<strong>32GBから約10MBへと</strong> <strong>3,200分の</strong>1に削減することができる。</p>
<p>以下のセクションでは、グラフベースのベクトル検索がどのように機能するのか、メモリコストはどこから来るのか、そしてAISAQがどのように億規模のベクトル検索のコストカーブを再構築するのかを説明します。</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">従来のグラフベースのベクトル検索の仕組み<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>ベクトル検索とは</strong>、高次元空間において、クエリに最も近い数値表現を持つデータ点を見つけるプロセスである。「最も近い」とは、単に余弦距離やL2距離などの距離関数に従った最小距離を意味する。小さなスケールでは、これは簡単です：クエリとすべてのベクトル間の距離を計算し、最も近いものを返します。しかし、10億スケールのような大規模になると、この方法はすぐに遅すぎて実用的ではなくなります。</p>
<p>網羅的な比較を避けるために、最新の近似最近傍探索（ANNS）システムは<strong>グラフベースのインデックスに</strong>依存している。すべてのベクトルに対してクエリを比較するのではなく、インデックスはベクトルを<strong>グラフに</strong>整理する。各ノードはベクトルを表し、エッジは数値的に近いベクトル同士を結ぶ。この構造により、システムは検索空間を劇的に狭めることができる。</p>
<p>グラフはあらかじめ、ベクトル間の関係のみに基づいて構築される。クエリには依存しない。クエリが到着すると、システムのタスクは<strong>グラフを効率的にナビゲート</strong>し、データセット全体をスキャンすることなく、クエリとの距離が最小のベクトルを特定することである。</p>
<p>探索はグラフ内のあらかじめ定義された<strong>開始点から</strong>始まる。この開始点はクエリから遠いかもしれないが、アルゴリズムはクエリに近いと思われるベクトルに向かって移動することで、その位置を段階的に改善する。このプロセスの間、検索は、<strong>候補リストと</strong> <strong>結果リストという</strong>2つの内部データ構造を維持する。</p>
<p>そして、この過程で最も重要な2つのステップは、候補リストの拡張と結果リストの更新である。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">候補リストの拡張</h3><p><strong>候補</strong>リストは、検索が次に進む可能性のある場所を表す。これは、クエリとの距離に基づいて有望と思われるグラフ・ノードの優先順位付けされた集合である。</p>
<p>各反復で、アルゴリズムは</p>
<ul>
<li><p><strong>これまでに発見された最も近い候補を選択する。</strong>候補リストから、クエリとの距離が最小のベクトルを選択する。</p></li>
<li><p><strong>そのベクトルの近傍をグラフから取得する。</strong>これらの近傍ベクトルは、インデックス構築時に現在のベクトルに近いと特定されたベクトルである。</p></li>
<li><p><strong>未訪問の近傍を評価し、候補リストに追加する。</strong>まだ探索されていない各近傍について、アルゴリズムはクエリとの距離を計算する。以前に訪問した近傍はスキップされ、新しい近傍が有望であれば候補リストに挿入される。</p></li>
</ul>
<p>候補リストを繰り返し拡張することで、探索はグラフのますます関連性の高い領域を探索する。これによってアルゴリズムは、全ベクトルのごく一部を調べるだけで、より良い答えに向かって着実に進むことができる。</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">結果リストの更新</h3><p>同時に、アルゴリズムは<strong>結果リストを</strong>保持し、最終出力に対してこれまでに見つかった最良の候補を記録する。探索が進むにつれて</p>
<ul>
<li><p><strong>探索中に遭遇した最も近いベクトルを追跡します。</strong>これらには、拡張のために選択されたベクトルや、途中で評価された他のベクトルが含まれる。</p></li>
<li><p><strong>クエリとの距離を保存します。</strong>これにより、候補をランク付けし、現在の上位K個の最近傍を維持することができます。</p></li>
</ul>
<p>時間が経つにつれて、より多くの候補が評価され、より少ない改善が見つかると、結果リストは安定する。さらにグラフを探索しても近いベクトルが見つかりそうになくなると、探索は終了し、結果リストを最終的な答えとして返す。</p>
<p>簡単に言えば、<strong>候補リストは探索を制御し</strong>、<strong>結果</strong>リストは<strong>これまでに発見された最良の答えをキャプチャする</strong>。</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">グラフベースのベクトル探索におけるトレードオフ<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>このグラフベースのアプローチが、そもそも大規模なベクトル検索を実用的なものにしている。すべてのベクトルをスキャンする代わりにグラフをナビゲートすることで、システムはデータセットのごく一部にしか触れずに高品質の結果を見つけることができる。</p>
<p>しかし、この効率はタダではない。グラフベースの検索は、<strong>精度とコストの</strong>間の基本的なトレードオフを露呈する。</p>
<ul>
<li><p>より多くの近傍を探索することで、グラフの大部分をカバーし、真の最近傍を見逃す可能性を減らすことで精度が向上する。</p></li>
<li><p>同時に、探索範囲を広げるごとに、距離計算、グラフ構造へのアクセス、ベクトルデータの読み込みといった作業が増える。探索がより深く、より広くなるにつれて、これらのコストは蓄積されていく。インデックスがどのように設計されているかによって、これらのコストはCPU使用率の増加、メモリへの負荷の増加、ディスクI/Oの増加として現れます。</p></li>
</ul>
<p>これらの相反する力のバランスをとることが、高いリコールと効率的なリソースの使用、グラフベースの検索設計の中心である。</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANNと</strong></a> <strong>AISAQは</strong>どちらもこの同じ緊張のもとに構築されていますが、これらのコストをどこでどのように支払うかについて、異なるアーキテクチャの選択をしています。</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">DISKANNがディスクベースのベクトル検索を最適化する方法<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANNは、これまでで最も影響力のあるディスクベースのANNソリューションであり、10億スケールのベクトル探索の世界的ベンチマークであるNeurIPS Big ANNコンペティションの公式ベースラインとして使用されています。その重要性は、性能だけでなく、<strong>グラフベースのANN検索が高速であるために完全にメモリ上に存在する必要は</strong>ないということを証明したことにあります。</p>
<p>DISKANN は、SSD ベースのストレージと慎重に選択されたインメモリ構造を組み合わせることで、大規模なベクトル検索が、大規模な DRAM フットプリントを必要とすることなく、コモディティハードウェア上で強力な精度と低レイテンシを達成できることを実証しました。DISKANNは、<em>検索のどの部分が高速でなければならず</em>、<em>どの部分が遅いアクセスでも許容できるかを</em>再考することによって、これを実現した。</p>
<p><strong>高いレベルでは、DISKANNは最も頻繁にアクセスされるデータをメモリに保持し、より大きく、より頻繁にアクセスされない構造をディスクに移動します。</strong>このバランスは、いくつかの重要な設計上の選択によって実現されている。</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1.PQ距離を使って候補リストを拡張する</h3><p>候補リストの拡張は、グラフベース検索で最も頻繁に行われる操作である。各拡張では、クエリーベクターと候補ノードの近傍との距離を推定する必要がある。完全な高次元ベクトルを用いてこれらの計算を行うには、ディスクからのランダムリードを頻繁に行う必要があり、計算上もI/O上も高価な操作となります。</p>
<p>DISKANNは、ベクトルを<strong>積量子化（PQ）コードに</strong>圧縮してメモリに保持することで、このコストを回避しています。PQコードは完全なベクトルよりもはるかに小さいが、それでもおおよその距離を推定するのに十分な情報を保持している。</p>
<p>候補の展開中、DISKANNはSSDから完全なベクトルを読み込む代わりに、これらのメモリ内のPQコードを使用して距離を計算します。これにより、グラフ探索中のディスクI/Oを劇的に削減し、SSDトラフィックの大部分をクリティカルパスから除外しながら、迅速かつ効率的に候補を探索することができます。</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2.ディスク上のフルベクターとネイバーリストの協調配置</h3><p>すべてのデータを圧縮したり、近似的にアクセスできるわけではありません。有望な候補が特定された後も、正確な結果を得るためには2種類のデータにアクセスする必要がある：</p>
<ul>
<li><p>グラフ探索を続けるための<strong>隣接リスト</strong></p></li>
<li><p>最終的な再ランク付けのための<strong>完全な（圧縮されていない）ベクトル</strong></p></li>
</ul>
<p>これらの構造体はPQコードよりもアクセス頻度が低いため、DISKANNはSSDに格納します。ディスクのオーバーヘッドを最小化するために、DISKANNは各ノードの隣接リストとその完全なベクトルをディスク上の同じ物理領域に配置します。これにより、1回のSSD読み取りで両方を確実に取得できます。</p>
<p>関連するデータを同位置に配置することで、DISKANNは検索時に必要なランダムディスクアクセスの回数を減らします。この最適化により、特に大規模において、拡張と再ランク付けの両方の効率が向上する。</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3.並列ノード拡張によるSSDの有効利用</h3><p>グラフベースのANN検索は反復プロセスである。各反復が1つの候補ノードのみを拡張する場合、システムは一度に1つのディスク読み取りを発行するだけで、SSDの並列帯域幅のほとんどが未使用のままになる。この非効率を避けるため、DISKANNは各反復で複数の候補を展開し、SSDに並列読み取り要求を送信します。このアプローチでは、利用可能な帯域幅をより有効に活用し、必要な反復回数の合計を減らすことができます。</p>
<p><strong>beam_width_ratio</strong>パラメータは、いくつの候補を並列に展開するかを制御します：<strong>ビーム幅＝CPUコア数×beam_width_ratio。</strong>比率を高くすると、探索の幅が広がり、精度が向上する可能性がありますが、計算量とディスクI/Oが増加します。</p>
<p>これを相殺するために、DISKANNは<code translate="no">search_cache_budget_gb_ratio</code> 、頻繁にアクセスされるデータをキャッシュするためにメモリを確保し、SSDの繰り返し読み込みを減らします。これらのメカニズムにより、DISKANNは精度、レイテンシ、I/O効率のバランスをとることができます。</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">なぜこれが重要なのか - そして限界はどこにあるのか</h3><p>DISKANNの設計は、ディスクベースのベクトル検索にとって大きな前進です。PQコードをメモリ内に保持し、より大きな構造をSSDにプッシュすることで、完全にインメモリのグラフインデックスと比較して、メモリフットプリントを大幅に削減します。</p>
<p>同時に、このアーキテクチャは、検索に不可欠なデータを<strong>常時DRAMに</strong>依存している。PQコード、キャッシュ、制御構造は、トラバーサルの効率を維持するためにメモリに常駐していなければならない。データセットが何十億ベクトルにもなり、デプロイメントにレプリカやリージョンが追加されても、このメモリ要件が制限要因になる可能性がある。</p>
<p><strong>AISAQは</strong>このギャップを解決するために設計されています。</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">AISAQの仕組みと重要性<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQは、DISKANNのコアとなるアイデアに直接基づいていますが、<strong>PQデータをDRAMに保持する必要性を</strong>なくすという重要な転換点を導入しています。AISAQは、圧縮ベクトルを検索に不可欠な、常にメモリ内にある構造として扱う代わりに、それらをSSDに移動し、効率的なトラバーサルを維持するために、グラフデータをディスク上に配置する方法を再設計します。</p>
<p>これを実現するために、AISAQはノードのストレージを再編成し、グラフ検索に必要なデータ（フルベクトル、近傍リスト、PQ情報）を、アクセスの局所性に最適化されたパターンでディスク上に配置する。その目的は、より多くのデータをより経済的なディスクにプッシュするだけでなく、<strong>先に述べた探索プロセスを壊すことなく</strong>そうすることである。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>さまざまな作業負荷の下で性能とストレージ効率のバランスをとるために、AISAQは2つのディスクベースのストレージモードを提供している。これらのモードは、主にPQ圧縮されたデータの保存方法と検索中のアクセス方法が異なる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQのパフォーマンススピードの最適化</h3><p>AISAQ-performanceは、データのコロケーションによりI/Oオーバーヘッドを低く抑えながら、すべてのデータをディスク上に保持します。</p>
<p>このモードでは</p>
<ul>
<li><p>各ノードの完全なベクトル、エッジリスト、および隣接ノードのPQコードがディスクに一緒に保存されます。</p></li>
<li><p>候補の展開と評価に必要なデータはすべてコロケーションされているため、ノードを訪問しても<strong>SSDの読み込みは1回で</strong>済みます。</p></li>
</ul>
<p>探索アルゴリズムから見ると、これはDISKANNのアクセスパターンを忠実に反映している。検索に不可欠なデータがすべてディスク上に存在するようになっても、候補の拡張は依然として効率的であり、実行時のパフォーマンスも同等です。</p>
<p>トレードオフはストレージのオーバーヘッドである。近傍のPQデータは複数のノードのディスクページに現れる可能性があるため、このレイアウトは冗長性をもたらし、全体のインデックスサイズを大幅に増加させる。</p>
<p><strong>したがって、AISAQ-Performanceモードでは、ディスク効率よりも低I/Oレイテンシを優先する。</strong></p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQスケール：ストレージ効率の最適化</h3><p>AISAQ-Scaleは逆のアプローチを取ります。すべてのデータをSSD上に保持しながら、<strong>ディスク使用量を最小限に</strong>抑えるように設計されています。</p>
<p>このモードでは</p>
<ul>
<li><p>PQデータは、冗長性を排除して個別にディスクに保存されます。</p></li>
<li><p>これにより冗長性がなくなり、インデックス・サイズが劇的に小さくなる。</p></li>
</ul>
<p>トレードオフとして、ノードとその近隣のPQコードにアクセスする場合、<strong>複数のSSD読み込みが</strong>必要となり、候補拡張時のI/O操作が増加する可能性がある。最適化されていないままだと、これは検索を大幅に遅らせることになる。</p>
<p>このオーバーヘッドを抑制するために、AISAQ-Scaleモードでは2つの追加最適化を導入しています：</p>
<ul>
<li><p><strong>PQデータの並べ替え</strong>。PQベクトルをアクセス優先度順に並べることで、局所性を向上させ、ランダムリードを減らす。</p></li>
<li><p><strong>DRAM 内の PQ キャッシュ</strong>（<code translate="no">pq_cache_size</code> ）は、頻繁にアクセスされる PQ データを保存し、ホット・エントリに対するディスク読み出しの繰り返しを回避します。</p></li>
</ul>
<p>これらの最適化により、AISAQ-Scaleモードは、実用的な検索性能を維持しながら、AISAQ-Performanceモードよりもはるかに優れたストレージ効率を達成している。この性能はDISKANNやAISAQ-Performanceよりも低いままですが、メモリフットプリントは劇的に小さくなっています。</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">AISAQの主な利点</h3><p>すべての検索クリティカルデータをディスクに移し、そのデータへのアクセス方法を再設計することで、AISAQはグラフベースのベクトル検索のコストとスケーラビリティのプロファイルを根本的に変えます。その設計は3つの重要な利点をもたらします。</p>
<p><strong>1.最大3,200倍のDRAM使用量削減</strong></p>
<p>積量子化は、高次元ベクトルのサイズを大幅に縮小しますが、10億の規模になると、メモリ・フットプリントは依然として相当なものになります。圧縮後でさえ、従来の設計では検索中にPQコードをメモリに保持しなければならない。</p>
<p>例えば、10億個の128次元ベクトルを持つベンチマークである<strong>SIFT1Bでは</strong>、構成にもよりますが、PQコードだけで<strong>およそ30～120GBのDRAMを</strong>必要とします。完全な非圧縮ベクトルを保存するには、さらに<strong>480GBが</strong>必要になります。PQはメモリ使用量を4-16倍削減するが、それでも残りのフットプリントはインフラコストを支配するほど大きい。</p>
<p>AISAQはこの要件を完全に取り除きます。DRAMの代わりにSSDにPQコードを格納することで、永続的なインデックスデータによってメモリが消費されることがなくなる。DRAMは、候補リストや制御メタデータのような軽量で一時的な構造にのみ使用される。実際には、これによりメモリ使用量は数十ギガバイトから<strong>10MB程度に</strong>削減される。代表的な10億スケールの構成では、DRAMは<strong>32GBから10MBに</strong>減少し、<strong>3,200分の1になる</strong>。</p>
<p>SSDストレージの<strong>容量単価が</strong>DRAMの<strong>約30分の1である</strong>ことを考えると、このシフトは総システム・コストに直接的かつ劇的な影響を与える。</p>
<p><strong>2.追加のI/Oオーバーヘッドなし</strong></p>
<p>PQコードをメモリからディスクに移動すると、通常、検索中のI/Oオペレーション数が増加する。AISAQは、<strong>データレイアウトとアクセスパターンを</strong>注意深く制御することで、これを回避している。AISAQでは、関連するデータをディスク上に散在させるのではなく、PQコード、フルベクター、近傍リストを同位置に配置し、一緒に検索できるようにしています。これにより、候補の拡張によってランダムリードが追加されることがない。</p>
<p>インデックスサイズとI/O効率のトレードオフを制御するために、AISAQは<code translate="no">inline_pq</code> パラメータを導入しています。このパラメータは、各ノードにインラインで格納されるPQデータの量を決定します：</p>
<ul>
<li><p><strong>低いinline_pq：</strong>インデックスサイズは小さくなるが、余分なI/Oが必要になる可能性がある。</p></li>
<li><p><strong>inline_pqを高くする：</strong>インデックスサイズは大きくなるが、シングル・リード・アクセスは維持される。</p></li>
</ul>
<p><strong>inline_pq = max_degreeに</strong>設定すると、AISAQはノードの完全なベクトル、近傍リスト、およびすべてのPQコードを1回のディスク操作で読み込み、すべてのデータをSSDに保持しながらDISKANNのI/Oパターンに一致させます。</p>
<p><strong>3.シーケンシャルPQアクセスによる計算効率の向上</strong></p>
<p>DISKANNでは、候補ノードを拡張するには、R個の隣接ノードのPQコードを取得するためにR回のランダムなメモリアクセスが必要です。AISAQでは、1回のI/OですべてのPQコードを取得し、ディスクに順次格納することで、このランダム性を排除している。</p>
<p>シーケンシャル・レイアウトには2つの重要な利点がある：</p>
<ul>
<li><p><strong>シーケンシャルSSDリードは</strong>、散在するランダムリードよりも<strong>はるかに高速である</strong>。</p></li>
<li><p><strong>連続したデータはキャッシュしやすく</strong>、CPUはPQ距離をより効率的に計算できる。</p></li>
</ul>
<p>これにより、PQ距離計算の速度と予測可能性の両方が向上し、PQコードをDRAMではなくSSDに保存することによる性能コストを相殺することができます。</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQとDISKANNの比較：性能評価<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQがDISKANNとアーキテクチャ的にどのように異なるかを理解した後、次の質問は簡単です：<strong>これらの設計上の選択が実際のパフォーマンスとリソース使用にどのように影響するか？</strong>この評価では、AISAQとDISKANNを、<strong>検索性能、メモリ消費量、ディスク使用量という</strong>10億規模において最も重要な3つの次元で比較する。</p>
<p>特に、インラインPQデータ量(<code translate="no">INLINE_PQ</code>)の変化に対するAISAQの挙動を検証する。このパラメータはインデックスサイズ、ディスクI/O、実行効率のトレードオフを直接制御する。また、<strong>次元数は距離計算のコストと</strong>ストレージ<strong>要件に強く影響するため、低次元と高次元のベクトル作業負荷で</strong>両アプローチを評価する。</p>
<h3 id="Setup" class="common-anchor-header">セットアップ</h3><p>全ての実験は、インデックスの挙動を分離し、ネットワークや分散システムの影響による干渉を避けるため、シングルノードシステム上で実施した。</p>
<p><strong>ハードウェア構成</strong></p>
<ul>
<li><p>CPU：インテル® Xeon® Platinum 8375C CPU @ 2.90GHz</p></li>
<li><p>メモリースピード：3200MT/s、タイプ：DDR4DDR4、サイズ：32 GB</p></li>
<li><p>ディスク: 500 GB NVMe SSD</p></li>
</ul>
<p><strong>インデックス構築パラメータ</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>クエリーパラメーター</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">ベンチマーク方法</h3><p>DISKANNとAISAQの両方が、Milvusで使用されているオープンソースのベクトル検索エンジンである<a href="https://milvus.io/docs/knowhere.md">Knowhereを</a>使用してテストされました。この評価には2つのデータセットが使用された：</p>
<ul>
<li><p><strong>SIFT128D（1Mベクトル）：</strong>画像記述子検索によく使われる128次元のベンチマーク。<em>(生データセットサイズ≈488 MB)</em></p></li>
<li><p><strong>Cohere768D (1Mベクトル)：</strong>変換器ベースの意味探索に典型的な768次元の埋め込みセット。<em>(生データセットサイズ≈2930 MB)</em></p></li>
</ul>
<p>これらのデータセットは2つの異なる実世界のシナリオを反映している：コンパクトな視覚特徴量と大きな意味埋め込み。</p>
<h3 id="Results" class="common-anchor-header">結果</h3><p><strong>Sift128D1M (フルベクトル ~488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sift128_D1_M_706a5b4e23.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (フルベクトル ~2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">解析結果</h3><p><strong>SIFT128Dデータセット</strong></p>
<p>SIFT128Dデータセットにおいて、AISAQは、すべてのPQデータがインライン化され、各ノードの必要なデータが1つの4KB SSDページ（INLINE_PQ = 48）に完全に収まる場合、DISKANNの性能に匹敵します。この構成では、検索に必要なすべての情報がコロケートされます：</p>
<ul>
<li><p>フル・ベクター512B</p></li>
<li><p>ネイバーリスト：48 × 4 + 4 = 196B</p></li>
<li><p>近隣のPQコード： 48 × (512B × 0.125) ≒ 3072B</p></li>
<li><p>合計：3780B</p></li>
</ul>
<p>ノード全体が1ページ内に収まるため、1回のアクセスに必要なI/Oは1回のみであり、AISAQは外部PQデータのランダムリードを避けることができる。</p>
<p>しかし、PQデータの一部だけがインライン化されている場合、残りのPQコードはディスク上の別の場所からフェッチしなければならない。このため、追加のランダムI/O操作が発生し、IOPS要求が急増し、大幅な性能低下につながります。</p>
<p><strong>Cohere768D データセット</strong></p>
<p>Cohere768Dデータセットでは、AISAQはDISKANNよりも性能が悪い。その理由は、768次元ベクトルが単純に1つの4KB SSDページに収まらないからです：</p>
<ul>
<li><p>フルベクター：3072B</p></li>
<li><p>近傍リスト：48 × 4 + 4 = 196B</p></li>
<li><p>近傍のPQコード：48×（3072B×0.125）≒18432B</p></li>
<li><p>合計：21700B（≒6ページ）</p></li>
</ul>
<p>この場合、すべてのPQコードがインライン化されていても、各ノードは複数ページにまたがる。I/O操作の数は一定ですが、各I/Oははるかに多くのデータを転送する必要があり、SSD帯域幅をはるかに高速に消費します。帯域幅が制限要因になると、AISAQはDISKANNに追いつけなくなります。特に、ノードごとのデータフットプリントが急速に増大する高次元のワークロードでは顕著です。</p>
<p><strong>注意</strong></p>
<p>AISAQのストレージレイアウトは通常、ディスク上のインデックスサイズを<strong>4倍から6倍</strong>増加させます。これは意図的なトレードオフであり、検索時に効率的なシングルページアクセスを可能にするため、フルベクター、近傍リスト、PQコードがディスク上に配置されています。これによりSSDの使用量は増加するが、ディスク容量はDRAMよりも大幅に安く、大容量のデータでも容易に拡張できる。</p>
<p>実際には、<code translate="no">INLINE_PQ</code> と PQ の圧縮率を調整することで、このトレードオフを調整することができる。これらのパラメータにより、固定されたメモリ制限に制約されることなく、ワークロードの要件に基づいて、検索パフォーマンス、ディスクフットプリント、およびシステム全体のコストのバランスをとることが可能になる。</p>
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
    </button></h2><p>最新のハードウェアの経済性は変化している。DRAMの価格は依然として高いままですが、SSDの性能は急速に進歩しており、PCIe 5.0ドライブは現在、<strong>14 GB/秒を</strong>超える帯域幅を実現しています。その結果、検索に不可欠なデータを高価なDRAMからはるかに手頃なSSDストレージに移行するアーキテクチャは、ますます説得力を増しています。SSDの容量は<strong>DRAMのギガバイトあたり30倍以下</strong>であるため、これらの差はもはやわずかなものではなく、システム設計に重要な影響を与えます。</p>
<p>AISAQはこの変化を反映しています。大容量の常時オンメモリ割り当ての必要性を排除することで、ベクトル検索システムは、DRAMの制限ではなく、データサイズと作業負荷の要件に基づいて拡張することができます。このアプローチは、高速SSDが永続性だけでなく、アクティブな計算や検索においても中心的な役割を果たす<strong>「オールインストレージ」アーキテクチャに</strong>向けた幅広いトレンドと一致している。</p>
<p>このシフトはベクターデータベースに限ったことではなさそうだ。同様の設計パターンは、グラフ処理、時系列分析、そして従来のリレーショナル・システムの一部でさえもすでに出現しており、開発者は、許容可能なパフォーマンスを達成するためにデータをどこに置くべきかについての長年の前提を再考しています。ハードウェアの経済性が進化し続ければ、システム・アーキテクチャもそれに追随することになるだろう。</p>
<p>ここで取り上げた設計の詳細については、ドキュメントをご覧ください：</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ｜Milvusドキュメント</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN｜Milvusドキュメント</a></p></li>
</ul>
<p>Milvusの最新機能に関するご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6の機能についてもっと知る<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6のご紹介: 10億スケールの手頃な価格のベクトル検索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">エンベッディング機能のご紹介Milvus 2.6によるベクトル化とセマンティック検索の効率化</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">MilvusのJSONシュレッダー: 88.9倍高速なJSONフィルタリングと柔軟性</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">真のエンティティレベルの検索：Milvusの新しいArray-of-StructsとMAX_SIM機能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusのMinHash LSH: LLMトレーニングデータの重複と戦う秘密兵器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで高める：MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく - ベクトルDBは真のテストに値する </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusはKafka/PulsarをWoodpeckerに置き換えた </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">実世界でのベクトル検索：リコール率を下げずに効率的にフィルタリングする方法</a></p></li>
</ul>
