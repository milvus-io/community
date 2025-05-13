---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: 'ベクトル圧縮を極限まで: MilvusがRaBitQで3倍のクエリーに対応する方法'
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  MilvusがどのようにRaBitQを活用してベクトル検索の効率を高め、精度を維持しながらメモリコストを削減しているかをご覧ください。今すぐAIソリューションを最適化する方法をご覧ください！
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvusは</a>、10億ベクトル規模のセマンティック検索を可能にする、オープンソースで拡張性の高いベクトルデータベースです。ユーザーがRAGチャットボット、AIカスタマーサービス、ビジュアル検索をこの規模で展開するにつれ、<strong>インフラコストという</strong>共通の課題が浮かび上がってくる。対照的に、指数関数的なビジネスの成長はエキサイティングだが、高騰するクラウド料金はそうではない。高速ベクトル検索には通常、ベクトルをメモリに保存する必要があり、それにはコストがかかる。当然、あなたはこう尋ねるかもしれない：<em>検索の質を犠牲にすることなく、スペースを節約するためにベクトルを圧縮できないか？</em></p>
<p>このブログでは、Milvusが<a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQと</strong></a>呼ばれる新しいテクニックを実装することで、同等の精度を維持しながら、より低いメモリコストで3倍のトラフィックに対応できるようになった方法を紹介します。また、オープンソースのMilvusと<a href="https://zilliz.com/cloud">Zilliz Cloud</a>上のフルマネージドMilvusサービスにRaBitQを統合することで得られた実践的な教訓も共有します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">ベクトル検索と圧縮を理解する<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQを理解する前に、この課題を理解しよう。</p>
<p><a href="https://zilliz.com/glossary/anns"><strong>近似最近傍（ANN）</strong></a>検索アルゴリズムは、ベクトルデータベースの中核であり、与えられたクエリに最も近い上位k個のベクトルを見つける。ベクトルとは高次元空間における座標のことで、多くの場合、数百の浮動小数点数で構成されます。ベクトル・データがスケールアップするにつれて、ストレージと計算の需要も増加します。例えば、<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>（ANN検索アルゴリズム）をFP32で10億個の768次元ベクトルを使って実行するには、3TB以上のメモリが必要だ！</p>
<p>MP3が人間の耳に聞こえない周波数を取り除いて音声を圧縮するように、ベクトルデータも検索精度への影響を最小限に抑えて圧縮することができる。研究によれば、ANNでは全精度のFP32は不要なことが多い。一般的な圧縮手法である<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> スカラー量子化</a>（SQ）は、浮動小数点値を離散的なビンにマッピングし、低ビット整数を使用してビンのインデックスのみを格納します。量子化手法は、同じ情報をより少ないビット数で表現することで、メモリ使用量を大幅に削減する。この分野の研究では、精度の損失を最小限に抑えながら、最大の節約を達成しようと努めている。</p>
<p>最も極端な圧縮手法である1ビットスカラー量子化（<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">バイナリ量子化とも</a>呼ばれる）は、各浮動小数点を1ビットで<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">表現する</a>。FP32（32ビット・エンコーディング）と比較して、メモリ使用量を32倍削減できます。ベクトル探索ではメモリが主なボトルネックになることが多いため、このような圧縮はパフォーマンスを大幅に向上させる。<strong>しかし、課題は探索精度を維持することにある。</strong>一般的に、1ビットSQは再現率を70％以下にまで低下させ、事実上使い物にならなくなる。</p>
<p><strong>RaBitQは</strong>、高いリコールを維持しながら1ビット量子化を実現する優れた圧縮技術です。Milvusはバージョン2.6からRaBitQをサポートし、同等の精度を維持しながら3倍のQPSでベクトルデータベースを提供できるようになりました。</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">RaBitQの簡単な紹介<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQは</a>、高次元空間の幾何学的特性を活用し、効率的で高精度なベクトル圧縮を実現する、賢く設計されたバイナリ量子化手法です。</p>
<p>一見すると、ベクトルの各次元を1ビットに削減するのは強引すぎるように思えるかもしれないが、高次元空間では直感はしばしば裏切られる。RaBitQの著者であるJianyang Gaoが<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> 説明したように</a>、高次元ベクトルは、個々の座標がゼロの周辺に集中しやすいという性質を示す。これにより、正確な最近傍探索に必要な相対構造を維持したまま、元の精度の多くを捨てることが可能になる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図：高次元幾何学における反直観的な値分布。<em>単位球から一様にサンプリングされたランダムな単位ベクトルの最初の次元の値を考えてみよう。しかし、高次元空間（例えば1000次元）では、値はゼロ付近に集中する。これは高次元幾何学の直感的でない性質である。(画像出典：<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">直感に反する高次元空間における量子化）</a></em></p>
<p>この高次元空間の性質にヒントを得て、<strong>RaBitQは正確な空間座標よりも角度情報を符号化することに重点を置いて</strong>いる。RaBitQは、各データベクトルをデータセットの重心などの基準点に対して正規化することでこれを行う。その後、各ベクトルは超立方体上の最も近い頂点にマッピングされ、1次元あたりわずか1ビットで表現できるようになる。このアプローチは、<code translate="no">IVF_RABITQ</code> 、正規化が最も近いクラスタ重心に対して行われるため、ローカル・エンコーディングの精度が向上する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：図：超立方体上で最も近い近似を見つけることによってベクトルを圧縮し、各次元をわずか1ビットで表現できるようにする。(画像出典：</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>直感に反する高次元空間における量子化）</em></a></p>
<p>このように圧縮された表現であっても検索の信頼性を確保するため、RaBitQはクエリベクトルとバイナリ量子化された文書ベクトル間の距離について、<strong>理論的根拠のある不偏推定量を</strong>導入している。これにより再構成誤差を最小化し、高いリコールを維持することができる。</p>
<p>また、RaBitQは<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScanや</a><a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> ランダム回転前処理の</a>ような他の最適化技術と高い互換性を持つ。さらに、RaBitQは<strong>学習が軽く、実行が速い</strong>。学習は各ベクトル成分の符号を決定するだけでよく、検索は最新のCPUでサポートされている高速ビット演算によって高速化される。これらの最適化により、RaBitQは精度の低下を最小限に抑えながら高速な探索を実現している。</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">MilvusにおけるRaBitQのエンジニアリング：学術研究から生産へ<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQは概念的には単純であり、<a href="https://github.com/gaoj0017/RaBitQ"> リファレンス実装が</a>付属していますが、Milvusのような分散した実運用レベルのベクトルデータベースに適応させるには、いくつかのエンジニアリング上の課題がありました。我々はRaBitQをMilvusのコアとなるベクトル検索エンジンであるKnowhereに実装し、さらにオープンソースのANN検索ライブラリ<a href="https://github.com/facebookresearch/faiss"> FAISSに</a>最適化バージョンを提供しました。</p>
<p>このアルゴリズムをMilvusでどのように実現したかを見てみましょう。</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">実装のトレードオフ</h3><p>重要な設計上の決定事項の1つは、<strong>ベクトルごとの補助データの</strong>処理です。RaBitQでは、インデックス作成時に事前計算されたベクトルごとに2つの浮動小数点値と、その場で計算するか事前計算するかの3つ目の値が必要です。Knowhereでは、検索時の効率を向上させるために、この値をインデックス作成時に事前計算して保存することにしました。対照的に、FAISSの実装では、クエリ時に計算することでメモリを節約し、メモリ使用量とクエリ速度のトレードオフをとっています。</p>
<p>重要な設計上の決定事項として、<strong>ベクトル毎の補助データの</strong>取り扱いがある。RaBitQでは、インデックス作成時に事前計算されたベクトルごとに2つの浮動小数点値と、その場で計算するか事前計算するかの3つ目の値が必要です。Knowhereでは、検索時の効率を向上させるために、この値をインデックス作成時に事前計算し、格納しています。一方、FAISSの実装では、この値をクエリ時に計算することでメモリを節約し、メモリ使用量とクエリ速度のトレードオフを変えています。</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">ハードウェアアクセラレーション</h3><p>最近のCPUは、バイナリ演算を大幅に高速化できる特別な命令を提供している。我々は最新のCPU命令を利用するために距離計算カーネルをカスタマイズした。RaBitQはpopcount演算に依存しているため、AVX512用の<code translate="no">VPOPCNTDQ</code> 命令が利用可能な場合はそれを使用するようにKnowhereに特化したパスを作成しました。サポートされているハードウェア（Intel IceLakeやAMD Zen 4など）では、デフォルトの実装に比べてバイナリ距離計算を数倍高速化することができます。</p>
<h3 id="Query-Optimization" class="common-anchor-header">クエリの最適化</h3><p>Milvusの検索エンジンであるKnowhereとFAISSの最適化バージョンでは、クエリベクトルのスカラー量子化(SQ1-SQ8)をサポートしています。これは、4ビットの量子化であっても、高い再現性を維持しつつ、計算量を大幅に削減できるため、高いスループットでクエリを処理する必要がある場合に特に有効です。</p>
<p>私たちはさらに一歩進んで、フルマネージドMilvus on Zilliz Cloudの原動力となる独自のCardinalエンジンを最適化しています。オープンソースのMilvusの機能を超えて、グラフベースのベクトルインデックスとの統合、最適化のレイヤーの追加、Arm SVE命令のサポートなど、高度な機能拡張を導入しています。</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">性能向上：同等の精度で3倍のQPSを実現<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>バージョン2.6から、Milvusは新しい<code translate="no">IVF_RABITQ</code> インデックスタイプを導入しました。この新しいインデックスは、RaBitQとIVFクラスタリング、ランダム回転変換、およびオプションの精密化を組み合わせ、性能、メモリ効率、精度の最適なバランスを実現します。</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">アプリケーションでの IVF_RABITQ の使用</h3><p>Milvus アプリケーションに<code translate="no">IVF_RABITQ</code> を実装する方法を説明します：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">ベンチマーク数字が物語るもの</h3><p>ベクターデータベースを評価するためのオープンソースベンチマークツールである<a href="https://github.com/zilliztech/vectordbbench"> vdb-benchを</a>使用して、さまざまな構成をベンチマークしました。テスト環境とコントロール環境の両方で、AWS EC2<code translate="no">m6id.2xlarge</code> インスタンスにデプロイされた Milvus Standalone を使用しています。これらのマシンは、8つのvCPU、32GBのRAM、およびVPOPCNTDQ AVX-512命令セットをサポートするIce LakeアーキテクチャベースのIntel Xeon 8375C CPUを備えています。</p>
<p>vdb-benchのSearch Performance Testを使用し、それぞれ768次元の100万ベクトルのデータセットを使用した。Milvusのデフォルトのセグメントサイズは1GBであり、生のデータセット（768次元×1Mベクトル×4バイト/フロート）は合計約3GBであるため、ベンチマークではデータベースごとに複数のセグメントを使用した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図：vdb-bench のテスト構成例。</p>
<p>以下は、IVF、RaBitQ、精密化処理の設定ノブに関する低レベルの詳細です：</p>
<ul>
<li><p><code translate="no">nlist</code> と は全ての ベースの手法の標準パラメータである。<code translate="no">nprobe</code> <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> は非負の整数で、データセットのIVFバケットの総数を指定します。</p></li>
<li><p><code translate="no">nprobe</code> は非負の整数で、探索処理中に1つのデータベクトルに対して訪れる IVF バケットの数を指定する。これは検索関連のパラメータである。</p></li>
<li><p><code translate="no">rbq_bits_query</code> はクエリーベクトルの量子化レベルを指定する。 ... レベルの量子化には 1 ～ 8 の値を使用する。量子化を無効にするには 0 を使用する。これは検索関連のパラメータである。<code translate="no">SQ1</code><code translate="no">SQ8</code> </p></li>
<li><p><code translate="no">refine</code> <code translate="no">refine_type</code> および パラメータは、refine プロセスの標準パラメータです。<code translate="no">refine_k</code> </p></li>
<li><p><code translate="no">refine</code> はブール値で、refinement ストラテジーを有効にします。</p></li>
<li><p><code translate="no">refine_k</code> は非負の fp 値です。絞り込み処理では、より質の高い量子化法を用いて、 を用いて選択された 倍の候補プールから、必要な数の最近傍を選び出します。これは検索関連のパラメータである。<code translate="no">IVFRaBitQ</code> <code translate="no">refine_k</code> </p></li>
<li><p><code translate="no">refine_type</code> は、絞り込みインデックスの量子化タイプを指定する文字列です。利用可能なオプションは、 , , , および / です。<code translate="no">SQ6</code> <code translate="no">SQ8</code> <code translate="no">FP16</code> <code translate="no">BF16</code> <code translate="no">FP32</code> <code translate="no">FLAT</code></p></li>
</ul>
<p>結果は重要な洞察を明らかにしている：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図：ベースライン(IVF_FLAT)、IVF_SQ8、IVF_RABITQのコストと性能の比較。</p>
<p>ベースライン<code translate="no">IVF_FLAT</code> インデックスはリコール95.2%で236 QPSを達成しているのに対し、<code translate="no">IVF_RABITQ</code> はFP32クエリで648 QPS、SQ8クエリで898 QPSと大幅に高いスループットを達成している。これらの数値はRaBitQの性能の優位性を示しており、特にrefinementが適用された場合に顕著である。</p>
<p>しかしながら、この性能はリコールにおいて顕著なトレードオフを伴う。絞り込みなしで<code translate="no">IVF_RABITQ</code> 、再現率は約76%に留まり、高い精度を必要とするアプリケーションには不十分かもしれない。とはいえ、1ビットベクトル圧縮を使用してこのレベルの想起率を達成したことは、依然として印象的である。</p>
<p>精度を回復させるには絞り込みが不可欠です。SQ8クエリーとSQ8リファインメントで構成した場合、<code translate="no">IVF_RABITQ</code> 、優れたパフォーマンスと想起率の両方を実現する。IVF_FLATにほぼ匹敵する94.7%という高い再現率を維持しながら、IVF_FLATより3倍以上高い864 QPSを達成している。もうひとつの一般的な量子化インデックス<code translate="no">IVF_SQ8</code> と比較しても、SQ8洗練を施した<code translate="no">IVF_RABITQ</code> は、わずかなコスト増で、同様の想起率で半分以上のスループットを達成している。このため、速度と精度の両方が要求されるシナリオに最適な選択肢となる。</p>
<p>要するに、<code translate="no">IVF_RABITQ</code> は単独でも、許容できる想起でスループットを最大化するのに優れており、<code translate="no">IVF_FLAT</code> と比較してほんのわずかなメモリスペースしか使用せずに、品質ギャップを縮めるために洗練と組み合わせると、さらに強力になります。</p>
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
    </button></h2><p>RaBitQは、ベクトル量子化技術に大きな進歩をもたらした。バイナリ量子化とスマートなエンコーディング戦略を組み合わせることで、不可能と思われた、精度の低下を最小限に抑えた極端な圧縮を実現しています。</p>
<p>次期バージョン2.6から、MilvusはIVF_RABITQを導入し、この強力な圧縮技術をIVFクラスタリングおよび洗練戦略と統合することで、バイナリ量子化を実用化します。この組み合わせは、精度、速度、メモリ効率の実用的なバランスを生み出し、ベクトル検索のワークロードを変革します。</p>
<p>私たちは、オープンソースのMilvusとZilliz Cloud上のフルマネージドサービスの両方にこのようなイノベーションをもたらし、ベクトル検索をより効率的で誰にとっても利用しやすいものにすることをお約束します。</p>
<p>Milvus 2.6のリリースにご期待ください。また、<a href="https://milvus.io/discord"> milvus.io/discordの</a>コミュニティに参加して、より多くのことを学んだり、経験を共有したり、質問したりしてください。</p>
