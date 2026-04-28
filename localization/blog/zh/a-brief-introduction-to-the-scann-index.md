---
id: a-brief-introduction-to-the-scann-index.md
title: |
  A Brief Introduction to the ScaNN Index 
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
desc: >
  A deep dive into the ScaNN index: how it improves IVFPQ with score-aware
  quantization and 4-bit FastScan, plus benchmark results from Milvus on the
  Cohere1M dataset.
origin: 'https://milvus.io/blog/a-brief-introduction-to-the-scann-index.md'
---
<p><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN</a> is Google’s answer to a familiar challenge in large-scale vector search: <strong>how to increase query throughput and reduce memory usage without taking an unacceptable hit to result quality.</strong> Conceptually, ScaNN starts from the classic IVF+PQ recipe—coarse clustering plus aggressive product quantization—but layers on two important innovations that meaningfully shift the performance frontier:</p>
<ul>
<li><p><strong>A score-aware quantization objective</strong> that better preserves the relative ordering of true neighbors, improving ranking quality even under heavy compression.</p></li>
<li><p><strong>FastScan</strong> is a SIMD-optimized 4-bit PQ lookup path that reduces the traditional memory-load bottleneck by keeping more work inside CPU registers.</p></li>
</ul>
<p>In practice, it is a strong choice when you are okay with trading some recall for high QPS and a much smaller memory footprint (often compressing vectors to ~1/16 of the original size), such as in recall-insensitive recommendation workloads.</p>
<p>In this post, we’ll revisit IVFPQ as the baseline, explore the key optimizations ScaNN introduces on top of it, and wrap up with experimental results that ground the discussion in measured performance.</p>
<h2 id="IVFPQ-Recap" class="common-anchor-header">IVFPQ Recap<button data-href="#IVFPQ-Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>ScaNN was proposed by Google in 2020, and the paper reports a 3× performance improvement over HNSW on the GloVe dataset. You can refer to the <a href="https://arxiv.org/pdf/1908.10396.pdf">original paper</a> and the <a href="https://github.com/google-research/google-research/tree/master/scann">open-source implementation</a> for details.</p>
<p>Before introducing ScaNN, we’ll briefly recap IVFPQ, since ScaNN is built on top of the same overall framework.</p>
<p><strong>IVFPQ stands for Inverted File with Product Quantization</strong>, an algorithm used for efficient and large-scale Approximate Nearest Neighbor (ANN) search in high-dimensional vector databases. It is a hybrid approach that combines two techniques, the <strong>inverted file index (IVF)</strong> and <strong>product quantization (PQ)</strong>, to balance search speed, memory usage, and accuracy.</p>
<h3 id="How-IVFPQ-Works" class="common-anchor-header">How IVFPQ Works</h3><p>The process involves two main steps during indexing and searching:</p>
<ul>
<li>IVF layer: vectors are clustered into <code translate="no">nlist</code> inverted lists (clusters). At query time, you visit only a subset of clusters (<code translate="no">nprobe</code>) to trade off recall and latency/throughput.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf1_5e3d29c392.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>PQ layer: within each visited cluster, each D-dimensional vector is split into m subvectors, each of dimension (D/m). Each subvector is quantized by assigning it to the nearest centroid in its sub-codebook. If a sub-codebook has 256 centroids, each subvector can be represented by a <code translate="no">uint8</code> code (an ID in [0, 255]).</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pq2_6695c9cc6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Distance computation can then be rewritten as the sum over subvectors:</p>
<p><strong>D(q, X) = D(q, u0) + D(q, u1) + D(q, u2) + … + D(q, un)</strong></p>
<p><strong>= L(q, id1) + L(q, id2) + L(q, id3) + … + L(q, idn)</strong></p>
<p>Here, L represents a lookup table. At query time, the lookup table is constructed, recording the distance between the query and each quantized subvector. All subsequent distance computations are converted into table lookups followed by summation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_vector3_75d47bdd53.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>For example, for 128-dimensional vectors split into 32 subvectors of 4 dimensions each, if each subvector is encoded by a <code translate="no">uint8</code> ID, the storage cost per vector drops from (128 x 4) bytes to (32 x 1) bytes—a 1/16 reduction.</p>
<h2 id="ScaNN-Optimizations-Based-on-IVFPQ" class="common-anchor-header">ScaNN Optimizations Based on IVFPQ<button data-href="#ScaNN-Optimizations-Based-on-IVFPQ" class="anchor-icon" translate="no">
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
    </button></h2><p>In summary, ScaNN improves IVFPQ in two aspects:</p>
<ol>
<li><p>Quantization: ScaNN proposes an objective beyond simply replacing each subvector with its nearest k-means centroid (i.e., minimizing reconstruction error).</p></li>
<li><p>Lookup efficiency: ScaNN accelerates LUT-based search, which is often memory-bound, via a SIMD-friendly FastScan path.</p></li>
</ol>
<h3 id="Score-aware-Quantization-Loss" class="common-anchor-header">Score-aware Quantization Loss</h3><p>
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
<p>Since the analysis is based on the IP metric, after ScaNN decomposes the quantization error into parallel and perpendicular components, only the parallel component affects the result, so a larger penalty term should be applied. Consequently, the loss function can be rewritten as follows:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">ℓ</mi><mrow><mo fence="true">(</mo><msub><mi>x</mi><mi>i</mi></msub><mo separator="true">,</mo><msub><mover accent="true"><mi>x</mi><mo>~</mo></mover><mi>i</mi></msub><mo separator="true">,</mo><mi>w</mi><mo fence="true">)</mo></mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><msub><mi>h</mi><mi mathvariant="normal">∥</mi></msub><mrow><mo fence="true">(</mo><mi>w</mi><mo separator="true">,</mo><mrow><mo fence="true">∥</mo><msub><mi>x</mi><mi>i</mi></msub><mo fence="true">∥</mo></mrow><mo fence="true">)</mo></mrow><msup><mrow><mo fence="true">∥</mo><msub><mi>r</mi><mi mathvariant="normal">∥</mi></msub><mrow><mo fence="true">(</mo><msub><mi>x</mi><mi>i</mi></msub><mo separator="true">,</mo><msub><mover accent="true"><mi>x</mi><mo>~</mo></mover><mi>i</mi></msub><mo fence="true">)</mo></mrow><mo fence="true">∥</mo></mrow><mn>2</mn></msup><mo>+</mo><msub><mi>h</mi><mo lspace="0em" rspace="0em">⊥</mo></msub><mrow><mo fence="true">(</mo><mi>w</mi><mo separator="true">,</mo><mrow><mo fence="true">∥</mo><msub><mi>x</mi><mi>i</mi></msub><mo fence="true">∥</mo></mrow><mo fence="true">)</mo></mrow><msup><mrow><mo fence="true">∥</mo><msub><mi>r</mi><mo lspace="0em" rspace="0em">⊥</mo></msub><mrow><mo fence="true">(</mo><msub><mi>x</mi><mi>i</mi></msub><mo separator="true">,</mo><msub><mover accent="true"><mi>x</mi><mo>~</mo></mover><mi>i</mi></msub><mo fence="true">)</mo></mrow><mo fence="true">∥</mo></mrow><mn>2</mn></msup></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned} \ell\left(x_i, \tilde{x}_i, w\right) &amp;=h_{\|}\left(w,\left\|x_i\right\|\right)\left\|r_{\|}\left(x_i, \tilde{x}_i\right)\right\|^2 +h_{\perp}\left(w,\left\|x_i\right\|\right)\left\|r_{\perp}\left(x_i, \tilde{x}_i\right)\right\|^2 \end{aligned}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.714em;vertical-align:-0.607em;"></span><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="pstrut" style="height:3.054em;"></span><span class="mord"><span class="mord">ℓ</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6679em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal">x</span></span><span style="top:-3.35em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.2222em;"><span class="mord">~</span></span></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="mclose delimcenter" style="top:0em;">)</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.607em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="pstrut" style="height:3.054em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3448em;"><span style="top:-2.5198em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">∥</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.3552em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">∥</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose delimcenter" style="top:0em;">∥</span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="minner"><span class="mopen"><span class="delimsizing mult"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.85em;"><span style="top:-2.85em;"><span class="pstrut" style="height:3.2em;"></span><span style="width:0.556em;height:1.200em;"><svg translate="no" xmlns="http://www.w3.org/2000/svg" width="0.556em" height="1.200em" viewBox="0 0 556 1200"><path d="M145 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v0 v585 h43z
M367 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v0 v585 h43z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3448em;"><span style="top:-2.5198em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">∥</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.3552em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6679em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal">x</span></span><span style="top:-3.35em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.2222em;"><span class="mord">~</span></span></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mclose"><span class="delimsizing mult"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.85em;"><span style="top:-2.85em;"><span class="pstrut" style="height:3.2em;"></span><span style="width:0.556em;height:1.200em;"><svg translate="no" xmlns="http://www.w3.org/2000/svg" width="0.556em" height="1.200em" viewBox="0 0 556 1200"><path d="M145 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v0 v585 h43z
M367 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v0 v585 h43z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span></span></span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:1.054em;"><span style="top:-3.3029em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mrel mtight">⊥</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">∥</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose delimcenter" style="top:0em;">∥</span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="minner"><span class="mopen delimcenter" style="top:0em;">∥</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mrel mtight">⊥</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6679em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal">x</span></span><span style="top:-3.35em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.2222em;"><span class="mord">~</span></span></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mclose delimcenter" style="top:0em;">∥</span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.954em;"><span style="top:-3.2029em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.607em;"><span></span></span></span></span></span></span></span></span></span></span></span></p>
<p>The figure below shows a two-dimensional example illustrating that the error caused by the parallel component is larger and can lead to incorrect nearest neighbor results, thus warranting a more severe penalty.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quantization_cp_81e23dd1df.png" alt="The left figure shows poor quantization because the parallel offset affects the final result, while the right figure shows better quantization." class="doc-image" id="the-left-figure-shows-poor-quantization-because-the-parallel-offset-affects-the-final-result,-while-the-right-figure-shows-better-quantization." />
    <span>The left figure shows poor quantization because the parallel offset affects the final result, while the right figure shows better quantization.</span>
  </span>
</p>
<h3 id="4-bit-PQ-FastScan" class="common-anchor-header">4-bit PQ FastScan</h3><p>Let’s first review the PQ computation process: during querying, the distances between the query and subvector cluster centers are pre-computed to construct a lookup table. Distance computation is then performed through table lookups to obtain segment distances and sum them.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/PQ_Fast_Scan1_248c53bc93.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>However, frequent memory reads still become a performance bottleneck. If the lookup table can be made small enough to fit in registers, memory read operations can be transformed into efficient CPU SIMD instructions.</p>
<p>First, each subvector is clustered into 16 classes, so a 4-bit value can represent a cluster center—this is the origin of the name “4-bit PQ.” Then, distances typically represented as floats are further converted to uint8 using Scalar Quantization (SQ). This way, the lookup table for one subvector can be stored in a register using 16 × 8 = 128 bits.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/PQ_Fast_Scan2_07b9589195.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Finally, let’s examine the register storage layout (using AVX2 instruction set as an example): the subvectors of 32 vectors are placed in a 128-bit register, combined with the lookup table. The “lookup” operation can then be efficiently completed using a single SIMD shuffle CPU instruction.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/register_layout_b2bf8c2b2b.png" alt="register layout" class="doc-image" id="register-layout" />
    <span>register layout</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/SIMD_Shuffle_for_Lookup_c86e6d9657.png" alt="SIMD Shuffle for Lookup" class="doc-image" id="simd-shuffle-for-lookup" />
    <span>SIMD Shuffle for Lookup</span>
  </span>
</p>
<p>Here’s an interesting observation: the ScaNN paper focuses entirely on the first optimization, which is reasonable since it can be considered an algorithm paper emphasizing mathematical derivations. However, the experimental results presented in the paper are remarkably impressive.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/experimental_results_a46ec830a7.png" alt="The experimental results presented in the ScaNN paper." class="doc-image" id="the-experimental-results-presented-in-the-scann-paper." />
    <span>The experimental results presented in the ScaNN paper.</span>
  </span>
</p>
<p>Intuitively, optimizing the loss alone should not produce such dramatic effects. Another <a href="https://medium.com/@kumon/similarity-search-scann-and-4-bit-pq-fastscan-ab98766b32bd">blog</a> has also pointed this out—what really makes the difference is the 4-bit PQ FastScan portion.</p>
<h2 id="Experimental-Results" class="common-anchor-header">Experimental Results<button data-href="#Experimental-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Using the vector database benchmark tool <a href="https://github.com/zilliztech/VectorDBBench">VectorDBBench</a>, we conducted a simple test. ScaNN’s performance advantage over traditional IVFFLAT and IVF_PQ is quite evident. After integration into Milvus, on the Cohere1M dataset at the same recall rate, QPS can reach 5x that of IVFFLAT and 6x that of IVF_PQ.</p>
<p>However, QPS is slightly lower than that of graph-based indexes like HNSW, so it is not the first choice for high-QPS use cases. But for scenarios with lower recall, it is acceptable (such as in some recommendation systems), using ScaNN without loading raw data can achieve impressive QPS with an extremely low memory footprint (1/16 of the original data), making it an excellent index choice.</p>
<table>
<thead>
<tr><th>Index_Type</th><th>Case</th><th>QPS</th><th>latency(p99)</th><th>recall</th><th>memory</th></tr>
</thead>
<tbody>
<tr><td>IVFFLAT</td><td>Performance1M</td><td>266</td><td>0.0173s</td><td>0.9544</td><td>3G</td></tr>
<tr><td>HNSW</td><td>Performance1M</td><td>1885</td><td>0.0054s</td><td>0.9438</td><td>3.24G</td></tr>
<tr><td>IVF_PQ</td><td>Performance1M</td><td>208</td><td>0.0292s</td><td>0.928</td><td>0.375G</td></tr>
<tr><td>ScaNN（with_raw_data: true）</td><td>Performance1M</td><td>1215</td><td>0.0069s</td><td>0.9389</td><td>3.186G</td></tr>
<tr><td>ScaNN（with_raw_data: false）</td><td>Performance1M</td><td>1265</td><td>0.0071s</td><td>0.7066</td><td>0.186G</td></tr>
</tbody>
</table>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>ScaNN builds on the familiar IVFPQ framework but pushes it significantly further through deep engineering work in both quantization and low-level lookup acceleration. By aligning the quantization objective with ranking quality and eliminating memory bottlenecks in the inner loop, ScaNN combines score-aware quantization with a 4-bit PQ FastScan path that turns a traditionally memory-bound process into an efficient, SIMD-friendly computation.</p>
<p>In practice, this gives ScaNN a clear and well-defined niche. It is not intended to replace graph-based indexes like HNSW in high-recall settings. Instead, for recall-insensitive workloads with tight memory budgets, ScaNN delivers high throughput with a very small footprint. In our experiments, after integration into Milvus VectorDB, ScaNN achieved roughly 5× the QPS of IVFFLAT on the Cohere1M dataset, making it a strong choice for high-throughput, low-latency ANN retrieval where compression and efficiency matter more than perfect recall.</p>
<p>If you’re interested in exploring ScaNN further or discussing index selection in real-world systems, join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channel</a> to chat with our engineers and other AI engineers in the community. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
