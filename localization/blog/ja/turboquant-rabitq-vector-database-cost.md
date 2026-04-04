---
id: turboquant-rabitq-vector-database-cost.md
title: TurboQuant-RaBitQ論争を超えて：AIインフラコストにとってベクトル量子化が重要な理由
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  TurboQuant-RaBitQ論争はベクトル量子化のヘッドラインニュースとなった。RaBitQによる1ビット圧縮の仕組みと、milvusがIVF_RABITQで97%のメモリ節約を実現した方法。
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>グーグルのTurboQuant論文（ICLR 2026）は、ほぼゼロ精度で6倍のKVキャッシュ圧縮を報告した。SKハイニックスは12%下落。サムスンは7％下落した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この論文はすぐに批判を浴びた。<a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>（SIGMOD2024）の筆頭著者である<a href="https://gaoj0017.github.io/">Jianyang Gao</a>氏は、TurboQuantの方法論とベクトル量子化に関する彼の先行研究との関係について<a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">疑問を呈した</a>。(Gao博士との対談を近日公開する予定です。興味のある方はフォローしてください)。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この記事は、その議論においてどちらかの味方をするというものではない。<a href="https://milvus.io/docs/index-explained.md">ベクトル量子化の</a>論文1本で900億ドルもの市場価値を動かせるという事実は、この技術がAIインフラにとっていかに重要なものになっているかを物語っている。推論エンジンにおけるKVキャッシュの圧縮であれ、<a href="https://zilliz.com/learn/what-is-vector-database">ベクトル・データベースにおける</a>インデックスの圧縮であれ、品質を保ちながら高次元データを縮小する能力は莫大なコストに影響します。</p>
<p>ここでは、なぜ今ベクトル量子化が非常に重要なのか、TurboQuantとRaBitQの比較、RaBitQとは何か、どのように機能するのか、Milvusの中にRaBitQを組み込むエンジニアリング作業、そしてAIインフラストラクチャのためのより広いメモリ最適化の状況について説明します。</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">なぜベクトル量子化がインフラコストに関係するのか？<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル量子化は新しいものではない。新しいのは、業界がそれをどれほど緊急に必要としているかということだ。過去2年間で、LLMパラメータは膨れ上がり、コンテキスト・ウィンドウは4Kから128K以上のトークンに拡張され、非構造化データ（テキスト、画像、音声、ビデオ）はAIシステムへの第一級の入力となった。こうしたトレンドの一つひとつが、保存、インデックス付け、検索が必要な高次元のベクトルを生み出す。より多くのベクトル、より多くのメモリ、より多くのコスト。</p>
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAGパイプライン</a>、レコメンデーション・エンジン、マルチモーダル検索など、大規模なベクトル検索を実行している場合、メモリ・コストはインフラにとって最大の頭痛の種の一つだろう。</p>
<p>モデルのデプロイメント中、主要なLLM推論スタックはすべて<a href="https://zilliz.com/glossary/kv-cache">KVキャッシュに</a>依存している。KVキャッシュは、アテンション・メカニズムが新しいトークンごとに再計算しないように、以前に計算されたキーと値のペアを保存する。これがO(n²)ではなくO(n)推論を可能にしている。<a href="https://github.com/vllm-project/vllm">vLLMから</a> <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLMに</a>至るまで、すべてのフレームワークはこれに依存している。しかしKVキャッシュは、モデルの重みそのものよりも多くのGPUメモリを消費します。コンテキストが長くなり、同時ユーザーが増えれば、スパイラルが加速する。</p>
<p>同じプレッシャーがベクトル・データベースを襲います。何十億もの高次元ベクトルがメモリ上にあり、それぞれが1次元あたり32ビットの浮動小数点数です。ベクトル量子化は、これらのベクトルを32ビット浮動小数点数から4ビット、2ビット、あるいは1ビット表現に圧縮し、メモリを90％以上縮小する。推論エンジンのKVキャッシュであろうと、ベクトルデータベースのインデックスであろうと、基礎となる数学は同じであり、コスト削減は現実のものとなる。この分野におけるブレークスルーを報告した1本の論文が、900億ドルの株式市場価値を動かしたのはそのためだ。</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuantとRaBitQの違いは？<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>TurboQuantもRaBitQも、量子化の前にランダムな回転<a href="https://arxiv.org/abs/2406.03482">（ジョンソン・リンデンストラウス変換</a>）を入力ベクトルに適用するという、同じ基礎技術に基づいている。この回転は、不規則に分布するデータを予測可能な一様分布に変換し、誤差の少ない量子化を容易にする。</p>
<p>このような共通の基盤の上に、両者は異なる問題を対象とし、異なるアプローチをとっている：</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>ターゲット</strong></td><td>LLM推論におけるKVキャッシュ（リクエストごとのエフェメラルデータ）</td><td>データベースにおける永続的なベクトル・インデックス（保存データ）</td></tr>
<tr><td><strong>アプローチ</strong></td><td>2段階PolarQuant (座標ごとのLloyd-Maxスカラー量子化器) +<a href="https://arxiv.org/abs/2406.03482">QJL</a>(1ビット残差補正)</td><td>シングルステージ：超立方体射影＋不偏距離推定器</td></tr>
<tr><td><strong>ビット幅</strong></td><td>3ビットキー、2ビット値（混合精度）</td><td>次元あたり1ビット（多ビットのバリエーションあり）</td></tr>
<tr><td><strong>理論的主張</strong></td><td>ほぼ最適なMSE歪み率</td><td>漸近的に最適な内積推定誤差（Alon-Klartagの下界に一致）</td></tr>
<tr><td><strong>製作状況</strong></td><td>コミュニティによる実装。</td><td><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6で</a>リリースされ、Faiss, VSAG, Elasticsearchで採用されている。</td></tr>
</tbody>
</table>
<p>実務家にとって重要な違いTurboQuantは推論エンジン内の一時的なKVキャッシュを最適化するのに対し、RaBitQはベクトルデータベースが数十億のベクトルに対して構築、シャード、クエリを行う永続的なインデックスをターゲットにしている。本稿では、RaBitQに焦点を当てる。RaBitQは、我々がMilvusに統合し、実稼働させているアルゴリズムである。</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">RaBitQとは何か？<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>768次元の1,000万ベクトルデータセットにおいて、RaBitQは各ベクトルを元のサイズの1/32に圧縮し、同時に94%以上の想起率を維持します。Milvusでは、これは全精度インデックスよりも3.6倍高いクエリスループットに相当する。これは理論上の予測ではなく、Milvus 2.6のベンチマーク結果である。</p>
<p>では、どのようにして実現したのか。</p>
<p>従来のバイナリ量子化はFP32ベクトルを1次元あたり1ビットに圧縮する。そのトレードオフとして、情報を捨てすぎているためリコールが低下する。<a href="https://arxiv.org/abs/2405.12497">RaBitQ</a>(Gao &amp; Long, SIGMOD 2024)は、同じ32倍圧縮を維持しながら、検索に実際に重要な情報を保持する。<a href="https://arxiv.org/abs/2409.09913">拡張版</a>（Gao &amp; Long, SIGMOD 2025）は、これが漸近的に最適であることを証明し、Alon &amp; Klartag（FOCS 2017）によって確立された理論的下界と一致する。</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">なぜ高次元では座標よりも角度が重要なのか？</h3><p>重要な洞察：<strong>高次元では、ベクトル間の角度は個々の座標値よりも安定で情報が多い。</strong>これは測度の集中の結果であり、ジョンソン・リンデンストラウスのランダム投影が機能するのと同じ現象です。</p>
<p>これが実際に何を意味するかというと、高次元ベクトルの正確な座標値を捨て、データセットに対する相対的な方向だけを残すことができる。角度関係（<a href="https://zilliz.com/glossary/anns">最近傍探索が</a>実際に依存するもの）は圧縮に耐える。</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">RaBitQの仕組み</h3><p>RaBitQはこの幾何学的洞察を3つのステップに変えます：</p>
<p><strong>ステップ1：正規化。</strong>データセットの重心を基準に各ベクトルをセンタリングし、単位長さにスケーリングする。これにより問題は単位ベクトル間の内積推定に変換される。</p>
<p><strong>ステップ2：ランダム回転＋超立方体射影。</strong>ランダムな直交行列（Johnson-Lindenstraussタイプの回転）を適用して、任意の軸への偏りを取り除きます。回転した各ベクトルを{±1/√D}^Dの超立方体の最も近い頂点に投影します。各次元は1ビットに縮退する。結果：ベクトルごとにDビットのバイナリコード。</p>
<p><strong>ステップ3：不偏距離推定。</strong>クエリと元の（量子化されていない）ベクトルとの内積の推定量を構築する。この推定器は、O(1/√D)で境界付けられた誤差を持つ不偏推定であることが証明できる。768次元のベクトルに対して、これは94%以上の再現率を維持する。</p>
<p>2値ベクトル間の距離計算は、ビット単位のAND＋ポップカウント-現代のCPUが1サイクルで実行する演算-に削減される。これがRaBitQを単に小さいだけでなく高速にしている。</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">なぜRaBitQは理論だけでなく実用的なのか？</h3><ul>
<li><strong>トレーニング不要。</strong>回転を適用し、符号をチェックする。反復最適化もコードブック学習も不要。インデックス作成時間は<a href="https://milvus.io/docs/ivf-pq.md">積量子</a>化に匹敵。</li>
<li><strong>ハードウェアに優しい。</strong>距離計算はビット単位のAND + popcount。最新のCPU（Intel IceLake+, AMD Zen 4+）はAVX512VPOPCNTDQ専用命令を持っている。シングルベクトル推定はPQルックアップテーブルより3倍速く実行されます。</li>
<li><strong>マルチビットの柔軟性。</strong> <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">RaBitQライブラリは</a>1ビットを超えるバリエーションをサポートしています：4ビットは～90%の再現率、5ビットは～95%、7ビットは～99%を達成します。</li>
<li><strong>コンポーザブル。</strong> <a href="https://milvus.io/docs/ivf-flat.md">IVFインデックスや</a> <a href="https://milvus.io/docs/hnsw.md">HNSWグラフの</a>ような既存のインデックス構造にプラグインでき、バッチ距離計算のためにFastScanと連動します。</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">紙から製品へ：MilvusでRaBitQを出荷するために構築したもの<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>オリジナルのRaBitQコードはシングルマシンの研究用プロトタイプです。これをシャーディング、フェイルオーバー、リアルタイムインジェストを備えた<a href="https://milvus.io/docs/architecture_overview.md">分散クラスタで</a>動作させるには、4つのエンジニアリング上の問題を解決する必要がありました。<a href="https://zilliz.com/">Milvusの</a>中でRaBitQを産業グレードの機能にするために、エンジンの統合、ハードウェアの高速化、インデックスの最適化、実行時のチューニングなど多岐に渡りました。詳細はこちらのブログでもご覧いただけます：<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで: MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">RaBitQの分散対応</h3><p>私たちはRaBitQをMilvusのコア検索エンジンである<a href="https://github.com/milvus-io/knowhere">Knowhereに</a>プラグインとしてではなく、統一されたインターフェイスを持つネイティブなインデックスタイプとして直接統合しました。Milvusの完全な分散アーキテクチャ（シャーディング、パーティショニング、ダイナミックスケーリング、<a href="https://milvus.io/docs/manage-collections.md">コレクション管理</a>）で動作します。</p>
<p>重要な課題は、量子化コードブック（回転行列、重心ベクトル、スケーリングパラメータ）をセグメント認識できるようにすることで、各シャードが独自の量子化ステートを構築し、保存できるようにすることです。インデックスの構築、コンパクション、ロードバランシングはすべて、新しいインデックスタイプをネイティブに理解する。</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">Popcountからあらゆるサイクルを絞り出す</h3><p>RaBitQのスピードは、バイナリ・ベクトルのセット・ビットをカウントするポップカウントに由来する。このアルゴリズムは本質的に高速ですが、どの程度のスループットが得られるかは、ハードウェアをいかにうまく使うかにかかっています。私たちは、主要なサーバー・アーキテクチャの両方に対応する専用のSIMDコード・パスを構築した：</p>
<ul>
<li><strong>x86（Intel IceLake+ / AMD Zen 4+）です：</strong>AVX-512のVPOPCNTDQ命令は、複数の512ビットレジスタのpopcountを並列に計算します。Knowhereの内部ループは、バイナリ距離計算をSIMD幅のチャンクにバッチ化するように再構築され、スループットを最大化します。</li>
<li><strong>ARM（Graviton、Ampere）：</strong>同じ並列ポップカウント・パターン用のSVE（Scalable Vector Extension）命令 - ARMインスタンスは、コスト最適化されたクラウド展開でますます一般的になっているため、非常に重要です。</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">ランタイム・オーバーヘッドの排除</h3><p>RaBitQは、クエリ時に補助的な浮動小数点パラメータを必要とします。データセットの重心、ベクトルごとのノルム、および量子化された各ベクトルと元のベクトルとの内積（距離推定器で使用）です。これらをクエリごとに計算すると、待ち時間が発生します。完全な元のベクトルを保存することは、圧縮の目的を果たさない。</p>
<p>我々の解決策：インデックス構築時にこれらのパラメータを事前に計算して永続化し、バイナリコードと一緒にキャッシュする。メモリオーバーヘッドは小さいが（ベクトルあたり数フロート）、クエリごとの計算をなくし、高い同時実行性下でもレイテンシを安定させることができる。</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: 実際に配置するインデックス</h3><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus2.6から</a> <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a>（<a href="https://milvus.io/docs/ivf-flat.md">Inverted File Index</a>+ RaBitQ量子化）が導入されました。検索は2段階で行われます：</p>
<ol>
<li><strong>粗い探索(IVF)。</strong>K-meansはベクトル空間をクラスタに分割する。クエリー時には、nprobeに最も近いクラスタのみがスキャンされる。</li>
<li><strong>細かいスコアリング（RaBitQ）。</strong>各クラスタ内で、1ビットコードと不偏推定量を用いて距離を推定する。Popcountが重い仕事をする。</li>
</ol>
<p>768次元、1000万ベクトルデータセットでの結果：</p>
<table>
<thead>
<tr><th>メトリック</th><th>IVF_FLAT (ベースライン)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 refine</th></tr>
</thead>
<tbody>
<tr><td>再現率</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>メモリフットプリント</td><td>32ビット/ディム</td><td>1ビット/ディム (元の3%)</td><td>~元の25</td></tr>
</tbody>
</table>
<p>0.5%のリコールギャップさえ許容できないワークロードの場合、refine_typeパラメータは2つ目のスコアリングパスを追加する：SQ6、SQ8、FP16、BF16、またはFP32である。SQ8は一般的な選択であり、元のメモリのおよそ1/4でIVF_FLATレベルまでリコールを回復する。また、クエリ側（SQ1-SQ8）に対して個別に<a href="https://milvus.io/docs/ivf-sq8.md">スカラー量子化を</a>適用することもでき、ワークロードごとにレイテンシとリコールコストのトレードオフを調整するための2つのノブを提供します。</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Milvusが量子化を超えてメモリを最適化する方法<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQは最も劇的な圧縮手段ですが、より広範な<a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">メモリ最適化</a>スタックの1つのレイヤーに過ぎません：</p>
<table>
<thead>
<tr><th>戦略</th><th>戦略</th><th>インパクト</th></tr>
</thead>
<tbody>
<tr><td><strong>フルスタック量子化</strong></td><td>SQ8、PQ、RaBitQは精度とコストのトレードオフが異なる</td><td>4倍から32倍のメモリ削減</td></tr>
<tr><td><strong>インデックス構造の最適化</strong></td><td>HNSWグラフ圧縮、DiskANN SSDオフロード、OOMセーフインデックス構築</td><td>インデックスあたりのDRAMを削減し、ノードあたりのデータセットを拡大</td></tr>
<tr><td><strong>メモリ マップ I/O (mmap)</strong></td><td>ベクトルファイルをディスクにマップし、OSのページキャッシュを介してオンデマンドでページをロード</td><td>すべてをRAMにロードすることなく、TB規模のデータセットを処理</td></tr>
<tr><td><strong>階層型ストレージ</strong></td><td>自動スケジューリングによるホット/ウォーム/コールドのデータ分離</td><td>頻繁にアクセスされるデータに対してのみメモリ料金を支払う</td></tr>
<tr><td><strong>クラウドネイティブ・スケーリング</strong><a href="https://zilliz.com/cloud">（Zilliz Cloud</a>、マネージドMilvus）</td><td>弾力的なメモリ割り当て、アイドル状態のリソースの自動解放</td><td>使用した分だけの支払い</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">フルスタック量子化</h3><p>RaBitQの1ビットの極端な圧縮は、すべてのワークロードに適しているわけではありません。Milvusは完全な量子化マトリックスを提供します：<a href="https://milvus.io/docs/ivf-sq8.md">SQ8と</a> <a href="https://milvus.io/docs/ivf-pq.md">積量子化(PQ)</a>は精度とコストのバランスの取れたトレードオフを必要とするワークロードに、RaBitQは超大規模データセットでの最大圧縮に、ハイブリッド構成はきめ細かな制御のために複数の方法を組み合わせています。</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">インデックス構造の最適化</h3><p>Milvusは量子化以外にも、コアとなるインデックス構造のメモリオーバーヘッドを継続的に最適化しています。<a href="https://milvus.io/docs/hnsw.md">HNSWでは</a>、隣接リストの冗長性を減らし、グラフあたりのメモリ使用量を削減した。<a href="https://milvus.io/docs/diskann.md">DiskANNは</a>ベクトルデータとインデックス構造の両方をSSDにプッシュし、大規模データセットのDRAM依存性を劇的に削減した。また、インデックス構築時の中間メモリ割り当てを最適化し、ノードのメモリ限界に近づくデータセットに対してインデックスを構築する際のOOM障害を防止しました。</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">スマートなメモリロード</h3><p>Milvusの<a href="https://milvus.io/docs/mmap.md">mmap</a>(メモリマップI/O)サポートは、ベクターデータをディスクファイルにマッピングし、OSのページキャッシュに依存してオンデマンドでロードします。起動時にすべてのデータをメモリにロードする必要はありません。突然のメモリスパイクを防ぐ遅延ロードやセグメント化されたロード戦略と組み合わせることで、TBスケールのベクトルデータセットをわずかなメモリコストでスムーズに操作することができます。</p>
<h3 id="Tiered-Storage" class="common-anchor-header">階層型ストレージ</h3><p>Milvusの<a href="https://milvus.io/docs/tiered-storage-overview.md">3階層ストレージアーキテクチャは</a>、メモリ、SSD、オブジェクトストレージにまたがっています。ホットデータは低レイテンシのためにメモリに留まり、ウォームデータはパフォーマンスとコストのバランスのためにSSDにキャッシュされ、コールドデータはオーバーヘッドを最小化するためにオブジェクトストレージにシンクされます。システムはデータ・スケジューリングを自動的に処理するため、アプリケーション層の変更は不要です。</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">クラウドネイティブ・スケーリング</h3><p>Milvusの<a href="https://milvus.io/docs/architecture_overview.md">分散アーキテクチャでは</a>、データのシャーディングとロードバランシングにより、シングルノードのメモリ過負荷を防ぎます。メモリプールは断片化を減らし、利用率を向上させます。<a href="https://zilliz.com/cloud">サーバレスモードでは</a>、アイドル状態のリソースは自動的に解放され、総所有コストをさらに削減します。</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">これらのレイヤーの組み合わせ</h3><p>これらの最適化は代替ではなく、積み重なるものです。RaBitQはベクトルを縮小する。DiskANNはSSD上にインデックスを保持する。Mmapはコールドデータのメモリへのロードを回避する。<a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">階層化ストレージは</a>アーカイブデータをオブジェクトストレージにプッシュする。その結果、数十億のベクターに対応するデプロイメントに数十億ベクター分のRAMは必要ありません。</p>
<h2 id="Get-Started" class="common-anchor-header">始める<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>AIデータ量が増加し続ける中、ベクター・データベースの効率とコストは、AIアプリケーションがどこまで拡張できるかを直接決定することになります。私たちは、より多くのAIアプリケーションがプロトタイプから本番へと移行できるよう、高性能で低コストのベクター・インフラストラクチャへの投資を続けていきます。</p>
<p><a href="https://github.com/milvus-io/milvus">Milvusは</a>オープンソースです。IVF_RABITQを試すには：</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQの</a>設定とチューニングのガイダンスについては、<a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQのドキュメントを</a>ご覧ください。</li>
<li>ベンチマークと実装の詳細については、<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ統合ブログポストを</a>お読みください。</li>
<li><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加して、他の開発者に質問したり学んだりしましょう。</li>
<li><a href="https://milvus.io/office-hours">Milvusオフィスアワー（無料）を予約して</a>、あなたのユースケースについて説明しましょう。</li>
</ul>
<p>インフラストラクチャのセットアップを省きたい場合は、Milvusのフルマネージドサービスである<a href="https://cloud.zilliz.com/signup">Zilliz Cloudが</a>IVF_RABITQをサポートする無料ティアを提供しています。</p>
<p>RaBitQの第一作者である<a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a>教授（NTU, VectorDB@NTU）と<a href="https://gaoj0017.github.io/">Jianyang Gao博士</a>（チューリッヒ工科大学）へのインタビューを予定しています。ご質問はコメント欄にお寄せください。</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">よくある質問<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">TurboQuantとRaBitQとは何ですか？</h3><p>TurboQuant (Google, ICLR 2026)とRaBitQ (Gao &amp; Long, SIGMOD 2024)は、どちらもランダム回転を使って高次元ベクトルを圧縮するベクトル量子化手法です。TurboQuantはLLM推論におけるKVキャッシュ圧縮を対象としており、RaBitQはデータベースにおける永続ベクトルインデックスを対象としている。どちらもベクトル量子化に対する現在の関心の波に貢献しているが、解決するシステムは異なる。</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">RaBitQはどのようにして想起を破壊することなく1ビット量子化を実現しているのだろうか？</h3><p>RaBitQは、高次元空間における測度の集中を利用している：ベクトル間の角度は、次元が増加するにつれて個々の座標値よりも安定する。データセットの重心を基準としてベクトルを正規化し、各ベクトルを超立方体の最も近い頂点に投影する（各次元を1ビットに削減）。証明可能なエラー境界を持つ不偏距離推定器により、圧縮にもかかわらず正確な探索が維持されます。</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">IVF_RABITQとは何ですか？</h3><p>IVF_RABITQはMilvusのベクトルインデックスタイプ（バージョン2.6から使用可能）で、ファイルクラスタリングとRaBitQ 1ビット量子化を組み合わせたものです。IVF_FLATの3.6倍のスループットで94.7%の再現率を達成し、メモリ使用量は元のベクトルのおよそ1/32です。大規模なベクトル検索（数百万から数十億のベクトル）を行う必要があり、メモリコストが主な懸念事項である場合（RAG、レコメンデーション、マルチモーダル検索ワークロードで一般的）に使用します。</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">ベクトル量子化は、LLMのKVキャッシュ圧縮とどのような関係がありますか？</h3><p>どちらの問題も、高次元の浮動小数点ベクトルを圧縮することに関係しています。KVキャッシュは、Transformerアテンションメカニズムからのキーと値のペアを格納します。長いコンテキスト長では、メモリ使用量においてモデルの重みを超える可能性があります。RaBitQのようなベクトル量子化技術は、これらのベクトルを低ビット表現に削減します。同じ数学的原理、つまり、メジャーの集中、ランダムな回転、不偏距離推定は、データベースのインデックスにあるベクトルを圧縮する場合でも、推論エンジンのKVキャッシュにあるベクトルを圧縮する場合でも適用されます。</p>
