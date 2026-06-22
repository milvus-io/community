---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: |
  MilvusにおけるAISAQのご紹介：10億規模のベクトル検索のメモリコストが3,200分の1に削減
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
desc: >-
  MilvusがAISAQを活用してメモリコストを3200倍削減し、DRAMのオーバーヘッドなしに数十億ベクトル規模のスケーラブルな検索を実現する仕組みをご覧ください。
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>ベクトルデータベースは、ミッションクリティカルなAIシステムの基幹インフラとなっており、そのデータ量は指数関数的に増加し、しばしば数十億のベクトルに達しています。この規模になると、低遅延の維持、精度の確保、信頼性の保証、レプリカやリージョンにわたる運用など、あらゆる面で困難が増します。しかし、その中でも特に早い段階で浮上し、アーキテクチャの決定を左右しがちな課題が1つあります<strong>。</strong>それは「<strong>コスト</strong>」です<strong>。</strong></p>
<p>高速な検索を実現するため、ほとんどのベクトルデータベースは、主要なインデックス構造をDRAM（ダイナミック・ランダム・アクセス・メモリ）に保持しています。DRAMは最も高速ですが、最も高価なメモリ階層です。この設計はパフォーマンスの面では有効ですが、スケーラビリティに欠けます。 DRAMの使用量はクエリトラフィックではなくデータサイズに比例して増加し、圧縮やSSDへの部分的なオフロードを行っても、インデックスの大部分はメモリ内に保持されなければなりません。データセットが拡大するにつれ、メモリコストはすぐにボトルネックとなります。</p>
<p>Milvusはすでに、インデックスの大部分をSSDに移動させることでメモリ負荷を軽減するディスクベースのANNアプローチ<strong>「DISKANN」</strong>をサポートしています。しかし、DISKANNでは検索時に使用される圧縮表現のために依然としてDRAMに依存しています。<a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6では</a>、<a href="https://milvus.io/docs/diskann.md">DISKANN</a>に着想を得たディスクベースのベクトルインデックス「<a href="https://milvus.io/docs/aisaq.md">AISAQ」</a>を導入し、この点をさらに進化させました。 KIOXIAが開発したAiSAQのアーキテクチャは、「ゼロDRAMフットプリントアーキテクチャ」をコンセプトに設計されており、検索に不可欠なすべてのデータをディスク上に保存し、I/O操作を最小限に抑えるようデータ配置を最適化しています。 10億ベクトルのワークロードにおいて、これによりメモリ使用<strong>量は32 GBから約10 MBへと</strong>、<strong>3,200倍の削減</strong>を実現しつつ、実用的なパフォーマンスを維持しています。</p>
<p>以下のセクションでは、グラフベースのベクトル検索の仕組み、メモリコストの要因、そしてAiSAQが10億規模のベクトル検索におけるコスト曲線をどのように変革するかについて解説します。</p>
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
    </button></h2><p><strong>ベクトル検索とは</strong>、高次元空間において、数値表現がクエリに最も近いデータポイントを見つけるプロセスです。 「最も近い」とは、コサイン距離やL2距離といった距離関数に基づいて、距離が最小であることを単に意味します。小規模な場合は、クエリとすべてのベクトル間の距離を計算し、最も近いものを返すという単純な処理で済みます。しかし、数十億規模といった大規模な場合、このアプローチでは処理速度が急速に低下し、実用的なレベルを維持できなくなります。</p>
<p>網羅的な比較を避けるため、現代の近似最近傍検索（ANNS）システムは<strong>グラフベースのインデックス</strong>に依存しています。クエリとすべてのベクトルを比較する代わりに、インデックスはベクトルを<strong>グラフ</strong>として整理します。各ノードはベクトルを表し、エッジは数値的に近いベクトル同士を結びつけます。この構造により、システムは検索空間を劇的に絞り込むことができます。</p>
<p>このグラフは、ベクトル間の関係のみに基づいて事前に構築されます。クエリには依存しません。クエリが到着すると、システムの役割は、データセット全体をスキャンすることなく、<strong>グラフ内を効率的に移動し</strong>、クエリとの距離が最も小さいベクトルを特定することです。</p>
<p>検索は、グラフ内のあらかじめ定義<strong>されたエントリポイント</strong>から開始されます。この開始点はクエリから遠く離れている場合もありますが、アルゴリズムはクエリにより近いと思われるベクトルに向かって移動することで、段階的にその位置を改善していきます。このプロセス中、検索は「<strong>候補リスト</strong>」と「<strong>結果リスト</strong>」という、連携して機能する2つの内部データ構造を維持します。</p>
<p>そして、このプロセスにおける最も重要な2つのステップは、候補リストの拡張と結果リストの更新です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">候補リストの拡張</h3><p><strong>候補リスト</strong>は、検索が次に進むべき場所を表します。これは、クエリからの距離に基づいて有望と思われるグラフノードを優先順位付けした集合です。</p>
<p>各反復において、アルゴリズムは以下の処理を行います：</p>
<ul>
<li><p><strong>これまでに発見された候補の中で最も近いものを選択します。</strong>候補リストから、クエリまでの距離が最も小さいベクトルを選び出します。</p></li>
<li><p><strong>グラフからそのベクトルの近傍を取得します。</strong>これらの近傍とは、インデックス構築時に現在のベクトルに近いと特定されたベクトルのことです。</p></li>
<li><p><strong>未探索の近傍を評価し、候補リストに追加します。</strong>まだ探索されていない各近傍について、アルゴリズムはクエリまでの距離を計算します。以前に探索済みの近傍はスキップされ、有望と思われる新しい近傍は候補リストに挿入されます。</p></li>
</ul>
<p>候補リストを繰り返し拡張することで、検索はグラフ内の関連性の高い領域を順次探索していきます。これにより、アルゴリズムは全ベクトルのごく一部のみを調査しながら、より良い解答へと着実に近づいていくことができます。</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">結果リストの更新</h3><p>同時に、アルゴリズムは<strong>結果リスト</strong>を維持し、これまでに発見された最終出力用の最良の候補を記録します。探索が進むにつれて、アルゴリズムは以下の処理を行います：</p>
<ul>
<li><p><strong>探索中に遭遇した最も近いベクトルを追跡します。</strong>これには、拡張対象として選択されたベクトルだけでなく、その過程で評価された他のベクトルも含まれます。</p></li>
<li><p><strong>クエリとの距離を保存します。</strong>これにより、候補をランク付けし、現在のトップKの最近傍を維持することが可能になります。</p></li>
</ul>
<p>時間の経過とともに、評価される候補が増え、改善が見られなくなると、結果リストは安定します。グラフの探索を続けても、より近いベクトルが見つかる可能性が低くなると、検索は終了し、結果リストが最終的な答えとして返されます。</p>
<p>簡単に言えば、<strong>候補リスト</strong>は<strong>探索を制御し</strong>、<strong>結果リスト</strong>は<strong>これまでに発見された最良の回答を記録するものです</strong>。</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">グラフベースのベクトル検索におけるトレードオフ<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>このグラフベースのアプローチこそが、そもそも大規模なベクトル検索を実用的なものにしている要因です。すべてのベクトルをスキャンする代わりにグラフを探索することで、システムはデータセットのごく一部しか参照せずに、高品質な結果を見つけることができます。</p>
<p>しかし、この効率性には代償が伴います。グラフベースの検索には、<strong>精度とコストの</strong>間の根本的なトレードオフが存在します<strong>。</strong></p>
<ul>
<li><p>より多くの近傍を探索することで、グラフのより広い範囲をカバーし、真の最近傍を見逃す可能性を低減できるため、精度が向上します。</p></li>
<li><p>同時に、探索範囲を拡大するたびに、距離計算の増加、グラフ構造へのアクセス増加、ベクトルデータの読み取り増加といった追加の処理負荷が発生します。探索がより深く、あるいはより広範囲に及ぶにつれて、これらのコストは累積していきます。インデックスの設計によっては、これらはCPU使用率の上昇、メモリ負荷の増加、あるいはディスクI/Oの増加として現れます。</p></li>
</ul>
<p>これらの相反する要素、すなわち高いリコール率と効率的なリソース使用のバランスを取ることは、グラフベースの検索設計において極めて重要です。</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANNと</strong></a> <strong>AISAQは</strong>どちらも、この相反する課題を軸に構築されていますが、これらのコストをどのように、どこで負担するかという点において、異なるアーキテクチャ上の選択を行っています。</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">DISKANNによるディスクベースのベクトル検索の最適化<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
<p>DISKANNは、現在までに最も影響力のあるディスクベースのANNソリューションであり、数十億規模のベクトル検索における世界的なベンチマークであるNeurIPS Big ANNコンペティションの公式ベースラインとして採用されています。その重要性は、単にパフォーマンスにあるだけでなく、それが証明した点にもあります。すなわち、<strong>グラフベースのANN検索は、高速であるために必ずしも完全にメモリ上で実行される必要はないということです</strong>。</p>
<p>SSDベースのストレージと慎重に選択されたインメモリ構造を組み合わせることで、DISKANNは、大規模なベクトル検索が、膨大なDRAM容量を必要とすることなく、汎用ハードウェア上で高い精度と低レイテンシを実現できることを実証しました。これは、<em>検索のどの部分を高速化する必要があるか</em>、<em>どの部分はアクセス速度の低下を許容できるかを</em>再考することで実現されています。</p>
<p><strong>大まかに言えば、DISKANNは最も頻繁にアクセスされるデータをメモリに保持し、より大規模でアクセス頻度の低い構造体をディスクに移動します。</strong>このバランスは<strong>、</strong>いくつかの重要な設計上の選択によって実現されています。</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. PQ距離を用いた候補リストの拡張</h3><p>候補リストの拡張は、グラフベースの検索において最も頻繁に行われる操作です。各拡張では、クエリベクトルと候補ノードの近傍との間の距離を推定する必要があります。高次元のベクトル全体を使用してこれらの計算を行うと、ディスクからのランダム読み取りが頻繁に発生することになり、計算上およびI/Oの両面でコストのかかる操作となります。</p>
<p>DISKANNは、<strong>ベクトルをプロダクト量子化（PQ）コードに</strong>圧縮してメモリ内に保持することで、このコストを回避しています。PQコードは完全なベクトルよりもはるかに小さいですが、距離を近似的に推定するのに十分な情報は保持しています。</p>
<p>候補の拡張中、DISKANNはSSDから完全なベクトルを読み込む代わりに、メモリ内のこれらのPQコードを使用して距離を計算します。これにより、グラフの探索中のディスクI/Oが劇的に削減され、検索が迅速かつ効率的に候補を拡張できると同時に、SSDトラフィックの大部分をクリティカルパスから排除することが可能になります。</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. 完全ベクトルと近傍リストのディスク上での共置</h3><p>すべてのデータを圧縮したり、近似的にアクセスしたりできるわけではありません。有望な候補が特定された後も、正確な結果を得るためには、検索処理が以下の2種類のデータにアクセスする必要があります：</p>
<ul>
<li><p>グラフ探索を継続するための<strong>近傍リスト</strong></p></li>
<li><p>最終的な再ランク付けのための<strong>完全（非圧縮）ベクトル</strong></p></li>
</ul>
<p>これらの構造体へのアクセス頻度はPQコードよりも低いため、DISKANNではこれらをSSDに格納します。ディスクのオーバーヘッドを最小限に抑えるため、DISKANNは各ノードの隣接リストとそのフルベクトルを、ディスク上の同じ物理領域に配置します。これにより、1回のSSD読み取りで両方を取得できるようになります。</p>
<p>関連するデータを同一場所に配置することで、DISKANNは検索中に必要なランダムディスクアクセスの回数を削減します。この最適化により、特に大規模なケースにおいて、ノードの展開と再ランク付けの両方の効率が向上します。</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. SSDの利用率向上に向けた並列ノード拡張</h3><p>グラフベースのANN検索は反復処理です。各反復で1つの候補ノードのみを拡張する場合、システムは一度に1回のディスク読み取りしか行わず、SSDの並列帯域幅の大部分が未使用のままとなります。 この非効率性を回避するため、DISKANNは各反復で複数の候補を展開し、SSDに対して並列読み取り要求を送信します。このアプローチにより、利用可能な帯域幅をより有効に活用でき、必要な反復の総数を削減できます。</p>
<p><strong>beam_width_ratio</strong>パラメータは、並列に展開される候補ノードの数を制御します：<strong>ビーム幅 = CPU コア数 × beam_width_ratio。</strong>この比率が大きいほど検索範囲が広がり（精度向上の可能性があります）、一方で計算量とディスク I/O も増加します。</p>
<p>これを相殺するため、DISKANNは<code translate="no">search_cache_budget_gb_ratio</code> を導入し、頻繁にアクセスされるデータをキャッシュするためにメモリを予約することで、SSDへの繰り返し読み取りを削減します。これらのメカニズムが相まって、DISKANNは精度、レイテンシ、およびI/O効率のバランスを保つことができます。</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">その重要性 — そして限界がどこにあるのか</h3><p>DISKANNの設計は、ディスクベースのベクトル検索にとって大きな前進です。PQコードをメモリに保持し、より大きな構造体をSSDにオフロードすることで、完全なインメモリグラフインデックスと比較してメモリ使用量を大幅に削減します。</p>
<p>一方で、このアーキテクチャは、検索に不可欠なデータについて、<strong>常時稼働状態のDRAMに</strong>依存しています。トラバーサルを効率的に維持するためには、PQコード、キャッシュ、および制御構造をメモリ内に常駐させ続ける必要があります。データセットが数十億のベクトル規模に拡大し、展開環境にレプリカやリージョンが追加されるにつれて、このメモリ要件が依然としてボトルネックとなる可能性があります。</p>
<p><strong>AISAQは</strong>、まさにこの課題を解決するために設計されたものです。</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">AISAQの仕組みとその重要性<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQはDISKANNの核心的なアイデアを直接踏襲していますが、決定的な変化を導入しています。それは、<strong>PQデータをDRAMに保持する必要性を</strong>排除した点です。AISAQは、圧縮されたベクトルを検索に不可欠な「常時メモリ内」構造として扱うのではなく、それらをSSDに移動させ、効率的なトラバーサルを維持するためにディスク上のグラフデータの配置方法を再設計します。</p>
<p>これを実現するため、AISAQはノードの保存方法を再編成し、グラフ検索中に必要なデータ（完全なベクトル、近傍リスト、PQ情報）が、アクセスの局所性に最適化されたパターンでディスク上に配置されるようにします。その目的は、単にコスト効率の高いディスクにより多くのデータを移行させることだけでなく、<strong>前述の検索プロセスを損なうことなく</strong>それを実現することにあります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>さまざまなアプリケーション要件に対応するため、AISAQは「パフォーマンス」と「スケール」という2つのディスクベースのストレージモードを提供します。技術的な観点から見ると、これらのモードの主な違いは、検索中にPQ圧縮データがどのように保存され、アクセスされるかという点にあります。 アプリケーションの観点から見ると、これらのモードは、オンラインのセマンティック検索やレコメンデーションシステムに典型的な低レイテンシ要件と、RAGに典型的な超大規模要件という、2つの異なるタイプの要件に対応しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance：速度に最適化</h3><p>AISAQ-performanceは、データのコロケーションにより低いI/Oオーバーヘッドを維持しつつ、すべてのデータをディスク上に保持します。</p>
<p>このモードでは：</p>
<ul>
<li><p>各ノードのフルベクトル、エッジリスト、およびその近傍ノードのPQコードが、ディスク上にまとめて格納されます。</p></li>
<li><p>候補の拡張と評価に必要なすべてのデータがコロケーションされているため、ノードへのアクセスには依然として<strong>単一のSSD読み取り</strong>のみで済みます。</p></li>
</ul>
<p>検索アルゴリズムの観点から見ると、これはDISKANNのアクセスパターンをほぼ再現しています。検索に不可欠なデータがすべてディスク上に存在するにもかかわらず、候補の拡張は効率的であり、実行時のパフォーマンスも同等です。</p>
<p>その代償として、ストレージのオーバーヘッドが生じます。近隣ノードのPQデータが複数のノードのディスクページに分散して格納される可能性があるため、このレイアウトは冗長性を生み出し、インデックス全体のサイズを大幅に増加させます。</p>
<p>したがって、AISAQ-Performanceモードでは、ディスク効率よりも低いI/Oレイテンシを優先します。アプリケーションの観点から見ると、AISAQ-Performanceモードは、オンラインセマンティック検索に求められる10ミリ秒台のレイテンシを実現できます。</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Scale：ストレージ効率に最適化</h3><p>AISAQ-Scaleは、これとは逆のアプローチを採用しています。すべてのデータをSSD上に保持しつつ、<strong>ディスク使用量を最小限に</strong>抑えるように設計されています。</p>
<p>このモードでは：</p>
<ul>
<li><p>PQデータは冗長性を持たずに、ディスク上に個別に保存されます。</p></li>
<li><p>これにより冗長性が排除され、インデックスのサイズが劇的に縮小されます。</p></li>
</ul>
<p>その代償として、ノードおよびその近傍ノードのPQコードにアクセスする際、<strong>複数のSSD読み取り</strong>が必要になる場合があり、候補展開時のI/O操作が増加します。これを最適化しないと、検索速度が大幅に低下してしまいます。</p>
<p>このオーバーヘッドを抑制するため、AISAQ-Scaleモードでは以下の2つの追加最適化を導入しています：</p>
<ul>
<li><p><strong>PQデータの再配置</strong>：PQベクトルをアクセス優先度順に並べ替え、局所性を向上させ、ランダム読み取りを削減します。</p></li>
<li><p><strong>DRAM内のPQキャッシュ</strong>（<code translate="no">pq_read_page_cache_size</code> ）。これは頻繁にアクセスされるPQデータを格納し、ホットエントリに対する繰り返しのディスク読み取りを回避します。</p></li>
</ul>
<p>これらの最適化により、AISAQ-Scaleモードは、実用的な検索パフォーマンスを維持しつつ、AISAQ-Performanceよりもはるかに優れたストレージ効率を実現します。そのパフォーマンスはDISKANNには及ばないものの、ストレージのオーバーヘッドはなく（インデックスサイズはDISKANNと同程度）、メモリ使用量は劇的に少なくなっています。 アプリケーションの観点から見ると、AiSAQは超大規模な環境でRAGの要件を満たす手段を提供します。</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">AISAQの主な利点</h3><p>検索に不可欠なすべてのデータをディスクに移し、そのデータへのアクセス方法を再設計することで、AISAQはグラフベースのベクトル検索のコストとスケーラビリティのプロファイルを根本的に変革します。その設計により、3つの大きな利点がもたらされます。</p>
<p><strong>1. DRAM 使用量を最大 3,200 分の 1 に削減</strong></p>
<p>プロダクト量子化（PQ）により高次元ベクトルのサイズは大幅に縮小されますが、10億規模になると、メモリ使用量は依然として膨大です。従来の設計では、圧縮後も検索中はPQコードをメモリに保持しておく必要があります。</p>
<p>例えば、10億個の128次元ベクトルからなるベンチマーク<strong>「SIFT1B</strong>」では、構成にもよりますが、PQコードだけで約<strong>30～120 GBのDRAMを</strong>必要とします。 非圧縮のベクトルをすべて保存するには、<strong>さらに約480 GB</strong>が必要となります。PQによってメモリ使用量は4～16倍削減されますが、残りの使用量は依然としてインフラコストの大部分を占めるほど大きいです。</p>
<p>AISAQ はこの要件を完全に排除します。PQ コードを DRAM ではなく SSD に保存することで、永続的なインデックスデータによるメモリ消費がなくなります。DRAM は、候補リストや制御メタデータなどの軽量で一時的な構造体のみに使用されます。実際、これによりメモリ使用量は数十ギガバイトから<strong>約 10 MB</strong> に削減されます。 代表的な10億規模の構成では、DRAMの使用量は<strong>32 GB</strong>から<strong>10 MBへと</strong>、<strong>3,200倍の削減</strong>となります。</p>
<p>SSDのストレージコストは、DRAMと比較して<strong>容量単位あたり</strong>約<strong>30分の1</strong>であるため、この移行はシステム総コストに直接的かつ劇的な影響を与えます。</p>
<p><strong>2. 追加の I/O オーバーヘッドなし</strong></p>
<p>PQコードをメモリからディスクに移動すると、通常、検索中のI/O操作回数が増加します。 AISAQ は、<strong>データレイアウトとアクセスパターンを</strong>慎重に制御することで、これを回避しています。AISAQ は、関連するデータをディスク上に分散させるのではなく、PQ コード、フルベクトル、および近隣リストを同じ場所に配置し、それらをまとめて取得できるようにします。これにより、候補の拡張によって追加のランダム読み取りが発生しないことが保証されます。</p>
<p>ユーザーがインデックスサイズとI/O効率のトレードオフを制御できるようにするため、AISAQでは<code translate="no">inline_pq</code> パラメータを導入しています。このパラメータは、各ノードにインラインで格納されるPQデータの量を決定します：</p>
<ul>
<li><p><strong>inline_pqの値が低い場合：</strong>インデックスサイズは小さくなりますが、追加のI/Oが必要になる可能性があります</p></li>
<li><p><strong>inline_pqを高く設定：</strong>インデックスサイズは大きくなりますが、1回の読み取りでアクセスできます</p></li>
</ul>
<p><strong>inline_pq = max_degree</strong> と設定した場合、AISAQ は 1 回のディスク操作でノードのベクトル全体、近傍リスト、およびすべての PQ コードを読み込み、すべてのデータを SSD 上に保持しつつ、DISKANN の I/O パターンに一致させます。</p>
<p><strong>3. 順次PQアクセスによる計算効率の向上</strong></p>
<p>DISKANNでは、候補ノードを展開するには、そのR個の近傍ノードのPQコードを取得するためにR回のランダムなメモリアクセスが必要です。AISAQは、すべてのPQコードを1回のI/Oで取得し、それらをディスク上に順次格納することで、このランダム性を排除します。</p>
<p>順次レイアウトには、2つの重要な利点があります。</p>
<ul>
<li><p><strong>SSDへの順次読み取りは</strong>、散在したランダム読み取りよりも<strong>はるかに高速です</strong>。</p></li>
<li><p><strong>連続したデータはキャッシュに最適であり</strong>、CPUがPQ距離をより効率的に計算できるようになります。</p></li>
</ul>
<p>これにより、PQ距離計算の速度と予測可能性が向上し、DRAMではなくSSDにPQコードを格納することによる性能上のコストを相殺するのに役立ちます。</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ 対 DISKANN：性能評価<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQがDISKANNとアーキテクチャ的にどのように異なるかを理解したところで、次の疑問は単純明快です。<strong>これらの設計上の選択は、実際にパフォーマンスやリソース使用量にどのような影響を与えるのでしょうか？</strong>本評価では、10億規模で最も重要な3つの側面、<strong>すなわち検索パフォーマンス、メモリ消費量、ディスク使用量について、</strong>AISAQとDISKANNを比較します。</p>
<p>特に、インライン化されたPQデータ（<code translate="no">INLINE_PQ</code> ）の量が変化するにつれて、AISAQがどのように振る舞うかを検証します。このパラメータは、インデックスサイズ、ディスクI/O、および実行時の効率性の間のトレードオフを直接制御します。 また<strong>、次元数は距離計算のコストや</strong>ストレージ要件<strong>に強く影響するため、低次元および高次元のベクトルワークロードの両方</strong>について<strong>、</strong>両アプローチを評価します。</p>
<h3 id="Setup" class="common-anchor-header">セットアップ</h3><p>インデックスの挙動を分離し、ネットワークや分散システムの影響による干渉を避けるため、すべての実験はシングルノードシステム上で実施されました。</p>
<p><strong>ハードウェア構成：</strong></p>
<ul>
<li><p>CPU: AMD EPYC 9454P CPU @ 2.70GHz</p></li>
<li><p>メモリ：速度：3200 MT/s、タイプ：DDR4、容量：384 GB</p></li>
<li><p>ディスク：KIOXIA CM7 7.68 TB<sup>NVMe™</sup>SSD</p></li>
</ul>
<p><h6><em>AMD EPYC は、Advanced Micro Devices, Inc. の商標です。</em></h6>
<h6><em>NVMeは、米国およびその他の国におけるNVM Express, Inc.の登録商標または未登録商標です。</em></h6></p>
<p><strong>インデックス構築パラメータ</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>クエリパラメータ</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">ベンチマーク手法</h3><p>DISKANN と AISAQ の両方は、Milvus で使用されているオープンソースのベクトル検索エンジン「<a href="https://milvus.io/docs/knowhere.md">Knowhere</a>」を用いてテストされました。この評価では、以下の 2 つのデータセットが使用されました。</p>
<ul>
<li><p><strong>SIFT128D (1Mベクトル)：</strong>画像記述子検索で一般的に使用される、よく知られた128次元のベンチマーク。<em>（生データセットサイズ ≈ 488 MB）</em></p></li>
<li><p><strong>Cohere768D (100万ベクトル)：</strong>トランスフォーマーベースのセマンティック検索に典型的な768次元の埋め込みセット。<em>（生データセットサイズ ≈ 2930 MB）</em></p></li>
</ul>
<p>これらのデータセットは、コンパクトな視覚特徴と大規模なセマンティック埋め込みという、2つの異なる実世界シナリオを反映している。</p>
<h3 id="Results" class="common-anchor-header">結果</h3><p><strong>Sift128D1M（フルベクトル 約488MB）</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>SIFTのリコール率対レイテンシのグラフ</span>
  
 </span></p>
<p><strong>Cohere768D1M（フルベクトル 約2930MB）</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Cohereのリコール率対レイテンシのグラフ</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">分析</h3><p><strong>SIFT128Dデータセット</strong></p>
<p>SIFT128Dデータセットにおいて、AISAQは、すべてのPQデータがインライン化され、各ノードに必要なデータが単一の4 KB SSDページに完全に収まるように設定された場合（INLINE_PQ = 48）、DISKANNと同等の性能を発揮します。この構成下では、検索中に必要なすべての情報が同一の場所に配置されます：</p>
<ul>
<li><p>フルベクトル：512B</p></li>
<li><p>近傍リスト：48 × 4 + 4 = 196B</p></li>
<li><p>近傍のPQコード：48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>合計：3780B</p></li>
</ul>
<p>ノード全体が1ページに収まるため、アクセスごとに必要なI/Oは1回のみで済み、AISAQは外部PQデータのランダム読み取りを回避します。</p>
<p>しかし、PQ データの一部のみがインライン化されている場合、残りの PQ コードはディスク上の別の場所からフェッチする必要があります（inline_pq パラメータは SSD ページの活用率を最適化するように設定されており、例えば inline_pq = 20 に設定すると、1 つの 4KB ページに 2 つのノードを収めることができます）。 これにより、追加のランダム I/O 操作が発生し、IOPS 需要が急増してパフォーマンスの低下につながります。</p>
<p><strong>Cohere768D データセット</strong></p>
<p>Cohere768D データセットにおいて、AISAQ のパフォーマンスは DISKANN よりも約 8% 低くなっています。その理由は、768 次元のベクトルが 1 つの 4 KB SSD ページに収まらないためです：</p>
<ul>
<li><p>ベクトル全体：3072B</p></li>
<li><p>近傍リスト：48 × 4 + 4 = 196B</p></li>
<li><p>近傍のPQコード：48 × (3072B × 0.04167) ≈ 6,144B</p></li>
<li><p>合計：9,412B（≈ 3ページ）</p></li>
</ul>
<p>この場合、たとえすべてのPQコードがインライン化されていても、各ノードは複数のページにまたがります。I/O操作の回数は変わらないものの、各I/Oで転送されるデータ量がはるかに多くなるため、SSDの帯域幅をはるかに早く消費してしまいます。 帯域幅がボトルネックとなると、AISAQはDISKANNに追いつくことができなくなります。特に、ノードごとのデータ量が急速に増加する高次元ワークロードでは顕著です。</p>
<p><strong>注：</strong></p>
<p>AISAQのストレージレイアウトでは、通常、ディスク上のインデックスサイズが<strong>3倍から5倍に</strong>増加します。これは意図的なトレードオフであり、検索時に効率的な単一ページアクセスを可能にするため、ベクトル全体、近傍リスト、およびPQコードがディスク上に同一領域に配置されます。 これによりSSDの使用量は増加しますが、ディスク容量はDRAMよりも大幅に安価であり、大規模なデータ量においても容易に拡張可能です。</p>
<p>実際には、ユーザーは<code translate="no">INLINE_PQ</code> やPQの圧縮率を調整することで、このトレードオフを微調整できます。これらのパラメータにより、固定されたメモリ制限に縛られることなく、ワークロードの要件に基づいて検索パフォーマンス、ディスク占有容量、およびシステム全体のコストのバランスを取ることが可能になります。</p>
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
    </button></h2><p>現代のハードウェアの経済性は変化しています。DRAMの価格は依然として高い一方で、SSDの性能は急速に進歩しており、PCIe 5.0ドライブは現在、<strong>14 GB/s</strong>を超える帯域幅を実現しています。その結果、検索に不可欠なデータを高価なDRAMから、はるかに手頃な価格のSSDストレージに移行させるアーキテクチャが、ますます魅力的になってきています。 SSDの容量単価は<strong>DRAMの1ギガバイトあたり30分の1以下であり</strong>、この価格差はもはや些細なものではなく、システム設計に大きな影響を及ぼしています。</p>
<p>AISAQはこの変化を反映しています。 常に稼働している大容量メモリの割り当てを不要にすることで、ベクトル検索システムはDRAMの制限ではなく、データサイズやワークロードの要件に基づいてスケーリングできるようになります。このアプローチは、「オール・イン・ストレージ」アーキテクチャというより広範なトレンドと合致しており、そこでは高速なSSDが、データの永続化だけでなく、アクティブな計算や検索においても中心的な役割を果たします。 AiSAQは、「パフォーマンス」と「スケール」という2つの動作モードを提供することで、最低のレイテンシを必要とするセマンティック検索と、非常に高いスケーラビリティを必要とするがレイテンシは中程度であるRAGの両方の要件を満たします。</p>
<p>この変化は、ベクトルデータベースだけに留まるものではないでしょう。開発者たちが、許容可能なパフォーマンスを実現するためにデータがどこに存在すべきかという長年の前提を見直していることから、グラフ処理、時系列分析、さらには従来のリレーショナルシステムの一部においても、同様の設計パターンがすでに現れ始めています。ハードウェアの経済性が進化し続けるにつれて、システムアーキテクチャもそれに追随していくでしょう。</p>
<p>ここで説明した設計の詳細については、以下のドキュメントを参照してください：</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus ドキュメント</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus ドキュメント</a></p></li>
</ul>
<p>ご質問がある場合や、最新のMilvusの機能についてさらに詳しく知りたい場合は、<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネル</a>に参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubで</a>イシューを登録してください。また、「<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>」を通じて、20分間の1対1セッションを予約し、洞察やガイダンス、ご質問への回答を得ることができます。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6の機能について詳しく知る<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6のご紹介：10億規模でも手頃な価格のベクトル検索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">エンベディング機能のご紹介：Milvus 2.6 がベクトル化とセマンティック検索をどのように効率化するか</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">MilvusにおけるJSONシュレッディング：柔軟性を保ちながらJSONフィルタリングを88.9倍高速化</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">真のエンティティレベル検索を実現：Milvusの新しい「Array-of-Structs」と「MAX_SIM」機能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusのMinHash LSH：LLMトレーニングデータにおける重複対策の秘密兵器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで追求：MilvusがRaBitQでクエリ処理能力を3倍に高めた仕組み</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく――ベクトルDBには真のテストが必要 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusでKafka/PulsarをWoodpeckerに置き換えた </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">実世界におけるベクトル検索：リコールを損なうことなく効率的にフィルタリングする方法</a></p></li>
</ul>
