---
id: milvus-performance-AVX-512-vs-AVX2.md
title: アドバンスト・ベクトル・エクステンションとは？
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: MilvusがAVX-512とAVX2において、さまざまな異なるベクトルインデックスを使用してどのような性能を発揮するかをご覧ください。
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>AVX-512とAVX2のMilvus性能比較</custom-h1><p>世界を征服しようとする意識的なインテリジェント・マシンは、サイエンス・フィクションの中では着実に定着しているが、現実には現代のコンピューターは非常に従順である。言われなくても、自分で何をすればいいのかほとんどわからない。コンピューターは、プログラムからプロセッサーに送られる命令（インストラクション）に基づいてタスクを実行する。一般に、コンピュータのアセンブリ言語では、機械語の各ステートメントがプロセッサの命令に対応する。中央演算処理装置（CPU）は、命令を頼りに計算を行い、システムを制御する。また、CPUの性能は命令実行能力（実行時間など）で測られることが多い。</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">アドバンスト・ベクトル・エクステンションとは？<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>アドバンスト・ベクトル拡張命令（AVX）は、x86ファミリーの命令セット・アーキテクチャを採用したマイクロプロセッサ向けの命令セットです。インテルが2008年3月に初めて提案したAVXは、3年後のSandy Bridge（第2世代インテルCoreプロセッサー（Core i7、i5、i3など）に採用されたマイクロアーキテクチャ）の発表と、同じく2011年に発表されたAMDの競合マイクロアーキテクチャBulldozerによって、幅広い支持を得るようになりました。</p>
<p>AVXは新しいコーディング方式、新機能、新命令を導入した。AVX2では、ほとんどの整数演算が256ビットに拡張され、FMA（fused multiply-accumulate）演算が導入された。AVX-512は、新しい拡張ベクトル拡張（EVEX）プリフィックス符号化を使用して、AVXを512ビット演算に拡張します。</p>
<p><a href="https://milvus.io/docs">Milvusは</a>、類似検索や人工知能（AI）アプリケーション向けに設計されたオープンソースのベクトルデータベースです。このプラットフォームはAVX-512命令セットをサポートしており、AVX-512命令を含むすべてのCPUで使用できる。Milvusは、レコメンダー・システム、コンピューター・ビジョン、自然言語処理（NLP）など、幅広い応用が可能です。この記事では、AVX-512とAVX2におけるMilvusベクトルデータベースの性能結果と解析を紹介します。</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">AVX-512とAVX2のMilvus性能比較<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">システム構成</h3><ul>
<li>CPUIntel® Platinum 8163 CPU @ 2.50GHz 24コア 48スレッド</li>
<li>CPU数2</li>
<li>グラフィックカード、GeForce RTX 2080Ti 11GB 4枚</li>
<li>メモリ：768GB</li>
<li>ディスク: 2TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">milvusパラメータ</h3><ul>
<li>cahce.cahe_size: 25, 高速クエリのためのデータキャッシュに使用するCPUメモリのサイズ。</li>
<li>nlist：4096</li>
<li>nprobe：128</li>
</ul>
<p>注：<code translate="no">nlist</code> はクライアントから作成するインデックス作成パラメータです。<code translate="no">nprobe</code> は検索パラメータです。IVF_FLATとIVF_SQ8はどちらもクラスタリングアルゴリズムを使用して、多数のベクトルをバケットに分割します。<code translate="no">nlist</code> はクラスタリング中に分割するバケットの総数です。クエリの最初のステップは、ターゲットベクトルに最も近いバケットの数を見つけることであり、2番目のステップは、ベクトルの距離を比較することによって、これらのバケット内の上位k個のベクトルを見つけることです。<code translate="no">nprobe</code> は、最初のステップのバケットの数を意味します。</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">データセットSIFT10Mデータセット</h3><p>この<a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">データセットは</a>128次元のベクトルを100万個含み、対応する最近傍探索手法の性能分析によく使われる。nq = [1, 10, 100, 500, 1000]のトップ1探索時間を2つの命令セット間で比較する。</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">ベクトルインデックスの種類による結果</h3><p><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">ベクトルインデックスは</a>、様々な数学的モデルを用いてコレクションのベクトルフィールド上に構築される、時間と空間効率の良いデータ構造である。ベクトルインデックスを使用することで、入力ベクトルに類似したベクトルを特定しようとするときに、大規模なデータセットを効率的に検索することができる。正確な検索には時間がかかるため、<a href="https://milvus.io/docs/v2.0.x/index.md#CPU">Milvusがサポートする</a>インデックスタイプのほとんどは近似最近傍（ANN）検索を使用している。</p>
<p>これらのテストではAVX-512とAVX2でIVF_FLAT、IVF_SQ8、HNSWの3つのインデックスが使用された。</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>反転ファイル(IVF_FLAT)は量子化に基づくインデックスタイプである。最も基本的なIVFインデックスであり、各ユニットに格納される符号化データは元のデータと一致します。 このインデックスは、ベクトルデータをいくつかのクラスタ単位（nlist）に分割し、対象となる入力ベクトルと各クラスタの中心との距離を比較します。システムがクエリに設定するクラスタ数（nprobe）に応じて、ターゲット入力と最も類似したクラスタ（複数可）内のベクトルとの比較に基づく類似性検索結果が返され、クエリ時間が大幅に短縮される。nprobeを調整することで、シナリオに応じた精度と速度の理想的なバランスを見つけることができます。</p>
<p><strong>パフォーマンス結果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLATは圧縮を行わないため、生成されるインデックスファイルのサイズは、インデックスを持たない元の生のベクトルデータとほぼ同じです。ディスク、CPU、GPU のメモリリソースが限られている場合は、IVF_FLAT よりも IVF_SQ8 の方が適しています。 このインデックスタイプは、スカラー量子化を行うことで、元のベクトルの各次元を 4 バイトの浮動小数点数から 1 バイトの符号なし整数に変換できます。これにより、ディスク、CPU、GPUのメモリ消費量を70～75%削減することができます。</p>
<p><strong>性能結果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>HNSW（Hierarchical Small World Graph）は、グラフベースのインデックス作成アルゴリズムです。クエリは最上層でターゲットに最も近いノードを見つけることから始まり、次の層に降りて検索を繰り返します。何度も繰り返された後、ターゲットの位置に素早く近づくことができる。</p>
<p><strong>パフォーマンス結果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">ベクトルインデックスの比較<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル検索はAVX2よりもAVX-512命令セットの方が一貫して高速です。これはAVX-512が512ビット計算をサポートするのに対し、AVX2では256ビット計算しかサポートしないからです。理論的にはAVX-512はAVX2の2倍速くなるはずですが、Milvusはベクトルの類似度計算に加えて他の時間のかかるタスクも行っています。AVX-512の全体的な検索時間は、実世界のシナリオではAVX2の2倍短くなるとは考えにくい。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>HNSWインデックスの検索は他の2つのインデックスよりかなり高速ですが、IVF_SQ8の検索はどちらの命令セットでもIVF_FLATよりわずかに高速です。これは、IVF_SQ8はIVF_FLATが必要とするメモリの25%しか必要としないためと思われる。IVF_SQ8 は各ベクトル次元に 1 バイトをロードしますが、IVF_FLAT は各ベクトル次元に 4 バイトをロードします。計算に必要な時間は、メモリ帯域幅に制約される可能性が高いです。その結果、IVF_SQ8 は、占有スペースが少ないだけでなく、ベクトル検索に要する時間も短くて済みます。</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvusは汎用性の高い高性能ベクトルデータベースである。<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事で紹介したテストは、MilvusがAVX-512とAVX2の両方の命令セットで異なるインデックスを使用して優れた性能を発揮することを示しています。インデックスの種類に関係なく、MilvusはAVX-512で優れた性能を発揮します。</p>
<p>Milvusはさまざまなディープラーニングプラットフォームと互換性があり、雑多なAIアプリケーションで使用されている。<a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0は</a>、世界で最も人気のあるベクトルデータベースを再構築したもので、2021年7月にオープンソースライセンスでリリースされた。プロジェクトの詳細については、以下のリソースをご覧ください：</p>
<ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>Milvusを見つける、またはMilvusに貢献する。</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>コミュニティと交流する。</li>
<li><a href="https://twitter.com/milvusio">Twitterで</a>つながる。</li>
</ul>
