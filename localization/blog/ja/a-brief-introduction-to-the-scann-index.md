---
id: a-brief-introduction-to-the-scann-index.md
title: ScaNN指数の簡単な紹介
author: Jack Li
date: 2026-01-21T00:00:00.000Z
cover: assets.zilliz.com/scann_cover_9a9787ee8a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ScaNN index, IVFPQ, vector similarity search, ANN, Milvus'
meta_title: |
  A Brief Introduction to the ScaNN Index and How It Improves IVFPQ
desc: >-
  ScaNNインデックスを深く掘り下げる：スコアを考慮した量子化と4ビットFastScanでIVFPQをどのように改善するか、さらにMilvusによるCohere1Mデータセットでのベンチマーク結果。
origin: 'https://milvus.io/blog/a-brief-introduction-to-the-scann-index.md'
---
<p><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNNは</a>、大規模ベクトル検索におけるお馴染みの課題に対するGoogleの回答である。それは、<strong>結果の品質に許容できないほどの打撃を与えることなく、いかにクエリのスループットを向上させ、メモリ使用量を削減するかというものである。</strong>概念的には、ScaNNは古典的なIVF+PQのレシピ-粗いクラスタリングと積極的な積の量子化-から始まるが、性能のフロンティアを有意義にシフトする2つの重要な革新が重ねられている：</p>
<ul>
<li><p><strong>スコアを考慮した量子化目的により</strong>、真の近傍の相対的な順序をより良く保持し、高圧縮下でもランキングの質を向上させる。</p></li>
<li><p><strong>FastScanは</strong>、SIMDに最適化された4ビットPQルックアップ・パスであり、CPUレジスタ内でより多くの作業を維持することで、従来のメモリ負荷のボトルネックを軽減します。</p></li>
</ul>
<p>実際には、高いQPSとはるかに小さいメモリフットプリント（多くの場合、ベクタを元のサイズの1/16に圧縮する）のために、多少のリコールと引き換えにしても構わない場合に、FastScanは強力な選択肢となります。</p>
<p>この記事では、IVFPQ をベースラインとして再検討し、その上に ScaNN が導入する主要な最適化について検討し、最後に実測性能に基づいた実験結果で議論を締めくくります。</p>
<h2 id="IVFPQ-Recap" class="common-anchor-header">IVFPQ のまとめ<button data-href="#IVFPQ-Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>ScaNNは2020年にGoogleによって提案され、論文ではGloVeデータセットでHNSWに対して3倍の性能向上が報告されている。詳細は<a href="https://arxiv.org/pdf/1908.10396.pdf">元の論文と</a> <a href="https://github.com/google-research/google-research/tree/master/scann">オープンソースの実装を</a>参照されたい。</p>
<p>ScaNNを紹介する前に、ScaNNは同じ全体的なフレームワークの上に構築されているため、IVFPQについて簡単に復習しておこう。</p>
<p><strong>IVFPQ は Inverted File with Product Quantization の略で</strong>、高次元ベクトルデータベースにおける効率的かつ大規模な近似最近傍（ANN）探索に使用されるアルゴリズムである。<strong>IVFPQは</strong>、<strong>反転ファイルインデックス(IVF)</strong>と<strong>積量子化(PQ)</strong>という2つの手法を組み合わせたハイブリッドアプローチで、検索速度、メモリ使用量、精度のバランスをとることができます。</p>
<h3 id="How-IVFPQ-Works" class="common-anchor-header">IVFPQの仕組み</h3><p>IVFPQは、インデックス作成と検索において主に2つのステップを経る：</p>
<ul>
<li>IVF層：ベクトルは<code translate="no">nlist</code> の転置リスト（クラスタ）にクラスタ化される。クエリー時には、リコールとレイテンシー/スループットをトレードオフするために、クラスタのサブセット（<code translate="no">nprobe</code> ）のみを訪問します。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf1_5e3d29c392.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>PQ層：訪問した各クラスタ内で、各D次元ベクトルはm個のサブベクトルに分割される。各サブベクトルは、そのサブコードブック内の最も近いセントロイドに割り当てることで量子化される。サブ・コードブックが256個のセントロイドを持つ場合，各サブ・ベクトルは<code translate="no">uint8</code> コード（[0, 255]のID）で表現できる．</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pq2_6695c9cc6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>距離計算は，サブベクトル上の和として書き直すことができる．</p>
<p><strong>D(q, X) = D(q, u0) + D(q, u1) + D(q, u2) + ... + D(q, un)</strong></p>
<p><strong>= L(q, id1) + L(q, id2) + L(q, id3) + ... + L(q, idn)</strong></p>
<p>ここで、Lはルックアップテーブルを表す。クエリ時にルックアップテーブルが構築され、クエリと量子化された各サブベクトルとの間の距離が記録される。それ以降の距離計算はすべてテーブルのルックアップに変換され、その後に合計が行われる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_vector3_75d47bdd53.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>例えば、128次元のベクトルをそれぞれ4次元の32個のサブベクトルに分割した場合、各サブベクトルを<code translate="no">uint8</code> IDでエンコードすると、ベクトルあたりのストレージコストは(128 x 4)バイトから(32 x 1)バイトになり、これは1/16の削減となる。</p>
<h2 id="ScaNN-Optimizations-Based-on-IVFPQ" class="common-anchor-header">IVFPQに基づくScaNNの最適化<button data-href="#ScaNN-Optimizations-Based-on-IVFPQ" class="anchor-icon" translate="no">
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
    </button></h2><p>要約すると、ScaNN は IVFPQ を以下の 2 点で改善する：</p>
<ol>
<li><p>量子化：量子化：ScaNN は、単に各サブベクトルを最も近い k-means のセントロイドに置き換える（すなわち、再構成誤差を最小化する）以上の目的を提案する。</p></li>
<li><p>ルックアップ効率：ScaNNは、SIMDフレンドリーのFastScanパスにより、しばしばメモリに縛られるLUTベースの探索を高速化する。</p></li>
</ol>
<h3 id="Score-aware-Quantization-Loss" class="common-anchor-header">スコアを考慮した量子化ロス</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/text_765e538864.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/score_aware_quantization_loss_d9d36223c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/text2_dd95418ba9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quantizer_f0e39762a4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>分析はIPメトリックに基づいているため、ScaNNが量子化誤差を平行成分と垂直成分に分解した後、平行成分のみが結果に影響するため、より大きなペナルティ項を適用する必要があります。その結果、損失関数は以下のように書き換えられる：</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">ℓ</mi><mrow><mo fence="true">(</mo><msub><mi>xi</mi></msub><mo separator="true">,</mo><msub><mi>x~i</mi></msub><mo separator="true">,</mo><mi>w</mi><mo fence="true">)</mo></mrow></mrow></mstyle></mtd></mtr></mtable></semantics></math></span></span></span><mrow></mrow><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><msub><mi mathvariant="normal">=h∥</mi></msub><mrow><mo fence="true">(</mo><mi>w</mi><mo separator="true">,</mo><mrow><mo fence="true">∥xi∥</mo></mrow><mo fence="true">)</mo></mrow><msup><mrow><msub><mi mathvariant="normal">∥r∥</mi></msub><mrow><mo fence="true">(</mo><msub><mi>xi</mi></msub><mo separator="true">,</mo><msub><mi>x~i</mi></msub><mo fence="true">)</mo></mrow></mrow></msup><msub><mo lspace="0em" rspace="0em">∥2+h⊥</mo></msub><mrow><mo fence="true">(</mo><mi>w</mi><mo separator="true">,</mo><mrow><mo fence="true">∥xi∥</mo></mrow><mo fence="true">)</mo></mrow><msup><mrow><msub><mo lspace="0em" rspace="0em">∥r⊥</mo></msub><mrow><mo fence="true">(</mo><msub><mi>xi</mi></msub><mo separator="true">,</mo><msub><mi>x~i</mi></msub><mo fence="true">)</mo></mrow></mrow></msup></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">∥2begin{aligned}\ullellleft(x_i, ∥tilde{x}_i, w=h_{\|}\left(w,\left\|x_i\right\|\right)\left\|r_{\|}\left(x_i, \tilde{x}_i\right)\right\|^2 +h_{\perp}\left(w,\left\|x_i\right\|\right)\left\|r_{\perp}\left(x_i,</annotation></semantics></math></span>\<span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><annotation encoding="application/x-tex">tilde{x}_i\right)￤right￤|^2 ￤end{aligned}</annotation></semantics></math></span></span></span><span class="strut" style="height:1.714em;vertical-align:-0.607em;"></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3.054em;"></span> <span class="katex-display"><span class="katex">ℓ</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord"><span class="mord mathnormal">(x</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex">,</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex">x</span></span><span class="pstrut" style="height:3em;"></span><span class="katex-display"><span class="katex">~</span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex">,</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex">w<span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">)</span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.607em;"><span></span></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3.054em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span> <span class="katex-display"><span class="katex">=</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex">h</span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">∥</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.3552em;"><span></span></span></span><span class="katex-display"><span class="katex"></span></span><span class="mspace" style="margin-right:0.1667em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord mathnormal" style="margin-right:0.02691em;">(w</span><span class="mpunct">、</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="mord mathnormal"><span class="pstrut" style="height:3em;"></span><span class="pstrut" style="height:2.7em;"></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="pstrut" style="height:2.7em;"></span>∥x</span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal"></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mclose delimcenter" style="top:0em;"> ∥）</span></span><span class="mspace" style="margin-right:0.1667em;"></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist" style="height:0.85em;"><span style="top:-2.85em;"><span class="pstrut" style="height:3.2em;"></span><span style="width:0.556em;height:1.200em;"><svg translate="no" xmlns="http://www.w3.org/2000/svg" width="0.556em" height="1.200em" viewBox="0 0 556 1200"><path d="M145 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v0 v585 h43z
M367 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v0 v585 h43z"/></svg></span></span></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;"> </span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">r</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">∥</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.3552em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal">（x</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">,</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">x</span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:3em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">~</span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">)</span></span></span></span></span></span></span></span></span><span class="vlist" style="height:0.85em;"><span style="top:-2.85em;"><span class="pstrut" style="height:3.2em;"></span><span style="width:0.556em;height:1.200em;"><svg translate="no" xmlns="http://www.w3.org/2000/svg" width="0.556em" height="1.200em" viewBox="0 0 556 1200"><path d="M145 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v0 v585 h43z
M367 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v0 v585 h43z"/></svg></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:1.054em;"><span style="top:-3.3029em;margin-right:0.05em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"> </span></span></span></span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:1.054em;"><span style="top:-3.3029em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"> </span></span></span></span></span></span></span></span></span></span></span>2</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">+</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">h</span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">⊥</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord mathnormal" style="margin-right:0.02691em;">（w</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mord"><span class="mord mathnormal">∥x</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mclose delimcenter" style="top:0em;"> ∥）</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">∥r</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">⊥</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal">（x</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">,</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:3em;"></span><span class="vlist-s"> </span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span><span class="vlist-r"><span class="vlist" style="height:0.607em;"><span></span></span></span></span></span></span></span></span></span></span></span></p>
<p>下図は2次元の例で、並列成分による誤差がより大きく、不正確な最近傍結果につながる可能性があるため、より厳しいペナルティが必要であることを示しています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/quantization_cp_81e23dd1df.png" alt="The left figure shows poor quantization because the parallel offset affects the final result, while the right figure shows better quantization." class="doc-image" id="the-left-figure-shows-poor-quantization-because-the-parallel-offset-affects-the-final-result,-while-the-right-figure-shows-better-quantization." />
   </span> <span class="img-wrapper"> <span>左の図はパラレルオフセットが最終結果に影響するため、量子化が不十分であることを示しており、右の図は量子化が良好であることを示しています。</span> </span></p>
<h3 id="4-bit-PQ-FastScan" class="common-anchor-header">4ビットPQ FastScan</h3><p>まずPQ計算プロセスについて説明します。クエリ実行中に、クエリとサブベクタークラスター中心間の距離が事前に計算され、ルックアップテーブルが構築されます。その後、テーブルのルックアップを通じて距離計算が実行され、セグメント距離を取得し、それらを合計する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/PQ_Fast_Scan1_248c53bc93.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>しかし、頻繁なメモリ読み出しがパフォーマンスのボトルネックとなる。ルックアップテーブルをレジスタに収まるほど小さくすることができれば、メモリ読み出し操作を効率的なCPUのSIMD命令に変換することができる。</p>
<p>まず、各サブベクターは16のクラスにクラスタ化されるため、4ビットの値でクラスタの中心を表すことができる。"4ビットPQ "という名前の由来はここにある。次に、通常は浮動小数点数で表現される距離を、スカラー量子化（SQ）を使ってさらにuint8に変換する。こうすることで、1つのサブベクトルのルックアップテーブルを16×8＝128ビットのレジスタに格納することができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/PQ_Fast_Scan2_07b9589195.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最後に、レジスタの格納レイアウト（AVX2命令セットを例にして）を見てみましょう。32個のベクタのサブベクタは、ルックアップテーブルと組み合わされて128ビットのレジスタに格納されます。ルックアップ」操作は、1つのSIMDシャッフルCPU命令で効率的に完了します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/register_layout_b2bf8c2b2b.png" alt="register layout" class="doc-image" id="register-layout" />
   </span> <span class="img-wrapper"> <span>レジスタレイアウト</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SIMD_Shuffle_for_Lookup_c86e6d9657.png" alt="SIMD Shuffle for Lookup" class="doc-image" id="simd-shuffle-for-lookup" />
   </span> <span class="img-wrapper"> <span>ルックアップのためのSIMDシャッフル</span> </span></p>
<p>ScaNNの論文は、最初の最適化に完全に焦点を当てており、数学的な導出を強調したアルゴリズム論文と考えられるので、これは妥当である。しかし、この論文で示された実験結果は驚くほど印象的である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/experimental_results_a46ec830a7.png" alt="The experimental results presented in the ScaNN paper." class="doc-image" id="the-experimental-results-presented-in-the-scann-paper." />
   </span> <span class="img-wrapper"> <span>ScaNN論文で示された実験結果</span>。 </span></p>
<p>直感的には、損失を最適化するだけではこれほど劇的な効果は得られないはずだ。別の<a href="https://medium.com/@kumon/similarity-search-scann-and-4-bit-pq-fastscan-ab98766b32bd">ブログでも</a>指摘されているが、本当に違いを生むのは4ビットPQ FastScanの部分である。</p>
<h2 id="Experimental-Results" class="common-anchor-header">実験結果<button data-href="#Experimental-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトルデータベースベンチマークツール<a href="https://github.com/zilliztech/VectorDBBench">VectorDBBenchを</a>使い、簡単なテストを行った。従来のIVFFLATやIVF_PQに対するScaNNの性能優位性は極めて明白である。Milvusに統合した後、同じ想起率でCohere1Mデータセットにおいて、QPSはIVFFLATの5倍、IVF_PQの6倍に達する。</p>
<p>しかしながら、QPSはHNSWのようなグラフベースのインデックスよりも若干低いため、QPSの高いユースケースにおいては最初の選択肢とはならない。しかし、想起が低いシナリオでは許容範囲内であり（推薦システムなど）、生データをロードせずにScaNNを使用することで、非常に低いメモリフットプリント（元データの1/16）で印象的なQPSを達成することができ、優れたインデックスの選択肢となる。</p>
<table>
<thead>
<tr><th>インデックスタイプ</th><th>ケース</th><th>QPS</th><th>レイテンシー(p99)</th><th>リコール</th><th>メモリ</th></tr>
</thead>
<tbody>
<tr><td>IVFFLAT</td><td>パフォーマンス1M</td><td>266</td><td>0.0173s</td><td>0.9544</td><td>3G</td></tr>
<tr><td>HNSW</td><td>パフォーマンス1M</td><td>1885</td><td>0.0054s</td><td>0.9438</td><td>3.24G</td></tr>
<tr><td>IVF_PQ</td><td>パフォーマンス1M</td><td>208</td><td>0.0292s</td><td>0.928</td><td>0.375G</td></tr>
<tr><td>ScaNN（with_raw_data：真）</td><td>パフォーマンス1M</td><td>1215</td><td>0.0069s</td><td>0.9389</td><td>3.186G</td></tr>
<tr><td>ScaNN（生データあり：false）</td><td>パフォーマンス1M</td><td>1265</td><td>0.0071s</td><td>0.7066</td><td>0.186G</td></tr>
</tbody>
</table>
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
    </button></h2><p>ScaNN は、お馴染みの IVFPQ フレームワークをベースに、量子化と低レベルのルックア ップ・アクセラレーションの両面で深いエンジニアリングを施すことで、それを大幅に推し進め たものである。量子化の目的をランキングの質と一致させ、内部ループのメモリボトルネックを排除することで、ScaNN はスコアを考慮した量子化と 4 ビット PQ FastScan パスを組み合わせ、従来メモリに縛られていたプロセスを効率的で SIMD フレンドリーな計算に変えている。</p>
<p>これにより、ScaNN は明確なニッチを持つことになる。ScaNNは、高リコール設定においてHNSWのようなグラフベースのインデックスを置き換えることを意図していない。その代わり、メモリ予算が厳しくリコールに敏感でないワークロードに対して、ScaNNは非常に小さなフットプリントで高いスループットを提供する。Milvus VectorDB に統合した後の実験では、ScaNN は Cohere1M データセットで IVFFLAT の約 5 倍の QPS を達成し、完全な想起よりも圧縮と効率が重要な高スループット、低レイテンシーの ANN 検索に最適な選択肢となりました。</p>
<p>ScaNNのさらなる探求や、実世界のシステムにおけるインデックス選択についての議論に興味がある方は、<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>参加して、当社のエンジニアやコミュニティの他のAIエンジニアとチャットしてください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
