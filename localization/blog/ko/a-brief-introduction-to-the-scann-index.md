---
id: a-brief-introduction-to-the-scann-index.md
title: ScaNN 인덱스에 대한 간략한 소개
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
  점수 인식 정량화 및 4비트 FastScan을 통해 IVFPQ를 개선하는 방법과 Cohere1M 데이터 세트에 대한 Milvus의 벤치마크
  결과, ScaNN 인덱스에 대해 자세히 알아보세요.
origin: 'https://milvus.io/blog/a-brief-introduction-to-the-scann-index.md'
---
<p><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN은</a> 대규모 벡터 검색의 익숙한 과제인 <strong>쿼리 처리량을 늘리고 메모리 사용량을 줄이면서도 결과 품질에 큰 타격을 입히지 않는 방법에</strong> 대한 Google의 해답입니다 <strong>.</strong> 개념적으로 ScaNN은 고전적인 IVF+PQ 레시피(거친 클러스터링과 공격적인 제품 양자화)에서 시작하지만, 성능의 경계를 의미 있게 바꾸는 두 가지 중요한 혁신이 겹쳐져 있습니다:</p>
<ul>
<li><p><strong>점수 인식 정량화 목표는</strong> 실제 이웃의 상대적 순서를 더 잘 보존하여 압축이 심한 상황에서도 순위 품질을 개선합니다.</p></li>
<li><p><strong>FastScan은</strong> SIMD에 최적화된 4비트 PQ 룩업 경로로, CPU 레지스터 내에 더 많은 작업을 유지함으로써 기존의 메모리 부하 병목 현상을 줄여줍니다.</p></li>
</ul>
<p>실제로는 리콜에 민감하지 않은 추천 워크로드와 같이 일부 리콜을 높은 QPS와 훨씬 작은 메모리 사용 공간(종종 벡터를 원래 크기의 ~1/16로 압축)과 교환해도 괜찮을 때 강력한 선택입니다.</p>
<p>이 포스팅에서는 기준선으로서 IVFPQ를 다시 살펴보고, 이를 기반으로 ScaNN이 도입한 주요 최적화를 살펴본 다음, 측정된 성능에 대한 논의의 근거가 되는 실험 결과로 마무리하겠습니다.</p>
<h2 id="IVFPQ-Recap" class="common-anchor-header">IVFPQ 요약<button data-href="#IVFPQ-Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>ScaNN은 2020년에 Google에서 제안했으며, 이 논문에서는 GloVe 데이터 세트에서 HNSW보다 3배의 성능 향상을 보고하고 있습니다. 자세한 내용은 <a href="https://arxiv.org/pdf/1908.10396.pdf">원본 논문과</a> <a href="https://github.com/google-research/google-research/tree/master/scann">오픈 소스 구현을</a> 참조하세요.</p>
<p>ScaNN을 소개하기 전에, ScaNN이 동일한 전체 프레임워크 위에 구축되었으므로 IVFPQ에 대해 간략히 살펴보겠습니다.</p>
<p><strong>IVFPQ는</strong> 고차원 벡터 데이터베이스에서 효율적이고 대규모의 근사 근사 이웃(ANN) 검색에 사용되는 알고리즘인<strong>Inverted File with Product Quantization의 약</strong>자입니다. 이는 검색 속도, 메모리 사용량, 정확도의 균형을 맞추기 위해 반전 <strong>파일 인덱스(IVF)</strong> 와 <strong>제품 양자화(PQ)</strong>라는 두 가지 기술을 결합한 하이브리드 접근 방식입니다.</p>
<h3 id="How-IVFPQ-Works" class="common-anchor-header">IVFPQ의 작동 방식</h3><p>이 프로세스는 색인 및 검색 중에 두 가지 주요 단계로 이루어집니다:</p>
<ul>
<li>IVF 레이어: 벡터가 <code translate="no">nlist</code> 반전 목록(클러스터)으로 클러스터링됩니다. 쿼리 시에는 클러스터의 하위 집합(<code translate="no">nprobe</code>)만 방문하여 리콜과 지연 시간/처리량 간의 균형을 맞춥니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf1_5e3d29c392.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>PQ 계층: 방문한 각 클러스터 내에서 각 D 차원 벡터는 각각의 차원(D/m)인 m개의 서브벡터로 분할됩니다. 각 서브벡터는 해당 서브 코드북에서 가장 가까운 중심점에 할당하여 정량화됩니다. 하위 코드북에 256개의 중심이 있는 경우, 각 서브벡터는 <code translate="no">uint8</code> 코드([0, 255]의 ID)로 나타낼 수 있습니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pq2_6695c9cc6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그러면 거리 계산을 서브벡터에 대한 합으로 다시 작성할 수 있습니다:</p>
<p><strong>D(q, X) = D(q, u0) + D(q, u1) + D(q, u2) + ... + D(q, un)</strong></p>
<p><strong>= L(q, id1) + L(q, id2) + L(q, id3) + ... + L(q, idn)</strong></p>
<p>여기서 L은 조회 테이블을 나타냅니다. 쿼리 시점에 쿼리와 각 양자화된 서브벡터 사이의 거리를 기록하는 룩업 테이블이 구성됩니다. 이후의 모든 거리 계산은 테이블 조회로 변환된 후 합산됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_vector3_75d47bdd53.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>예를 들어 128차원 벡터가 각각 4차원의 32개 하위 벡터로 분할된 경우, 각 하위 벡터가 <code translate="no">uint8</code> ID로 인코딩되면 벡터당 스토리지 비용이 (128 x 4) 바이트에서 (32 x 1) 바이트로 1/16로 감소합니다.</p>
<h2 id="ScaNN-Optimizations-Based-on-IVFPQ" class="common-anchor-header">IVFPQ에 기반한 ScaNN 최적화<button data-href="#ScaNN-Optimizations-Based-on-IVFPQ" class="anchor-icon" translate="no">
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
    </button></h2><p>요약하면, ScaNN은 두 가지 측면에서 IVFPQ를 개선합니다:</p>
<ol>
<li><p>양자화: ScaNN은 단순히 각 서브벡터를 가장 가까운 k-평균 중심값으로 대체하는 것(즉, 재구성 오류 최소화) 이상의 목표를 제시합니다.</p></li>
<li><p>조회 효율성: ScaNN은 SIMD 친화적인 FastScan 경로를 통해 메모리 제약이 많은 LUT 기반 검색을 가속화합니다.</p></li>
</ol>
<h3 id="Score-aware-Quantization-Loss" class="common-anchor-header">점수 인식 양자화 손실</h3><p>
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
<p>분석은 IP 메트릭을 기반으로 하기 때문에 ScaNN이 양자화 오류를 병렬 및 수직 구성 요소로 분해한 후에는 병렬 구성 요소만 결과에 영향을 미치므로 더 큰 페널티 항을 적용해야 합니다. 따라서 손실 함수는 다음과 같이 다시 작성할 수 있습니다:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">ℓ</mi><mrow><mo fence="true">(</mo><msub><mi>xi</mi></msub><mo separator="true">,</mo><msub><mi>x~i</mi></msub><mo separator="true">,</mo><mi>w</mi><mo fence="true">)</mo></mrow></mrow></mstyle></mtd></mtr></mtable></semantics></math></span></span></span><mrow></mrow><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><msub><mi mathvariant="normal">=h∥</mi></msub><mrow><mo fence="true">(</mo><mi>w</mi><mo separator="true">,</mo><mrow><mo fence="true">∥xi∥</mo></mrow><mo fence="true">)</mo></mrow><msup><mrow><msub><mi mathvariant="normal">∥r∥</mi></msub><mrow><mo fence="true">(</mo><msub><mi>xi</mi></msub><mo separator="true">,</mo><msub><mi>x~i</mi></msub><mo fence="true">)</mo></mrow></mrow></msup><msub><mo lspace="0em" rspace="0em">∥2+h⊥</mo></msub><mrow><mo fence="true">(</mo><mi>w</mi><mo separator="true">,</mo><mrow><mo fence="true">∥xi∥</mo></mrow><mo fence="true">)</mo></mrow><msup><mrow><msub><mo lspace="0em" rspace="0em">∥r⊥</mo></msub><mrow><mo fence="true">(</mo><msub><mi>xi</mi></msub><mo separator="true">,</mo><msub><mi>x~i</mi></msub><mo fence="true">)</mo></mrow></mrow></msup></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">∥2\begin{aligned} \ell\left(x_i, \tilde{x}_i, w\right) &amp;=h_{\|}\left(w,\left\|x_i\right\|\right)\left\|r_{\|}\left(x_i, \tilde{x}_i\right)\right\|^2 +h_{\perp}\left(w,\left\|x_i\right\|\right)\left\|r_{\perp}\left(x_i,</annotation></semantics></math></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><annotation encoding="application/x-tex">\tilde{x}_i\right)\right\|^2 \end{aligned}</annotation></semantics></math></span></span></span><span class="strut" style="height:1.714em;vertical-align:-0.607em;"></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3.054em;"></span> <span class="katex-display"><span class="katex">ℓ</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord"><span class="mord mathnormal">(x</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex">,</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex">x</span></span><span class="pstrut" style="height:3em;"></span><span class="katex-display"><span class="katex">~</span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex">,</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex">w<span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">)</span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.607em;"><span></span></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3.054em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span> <span class="katex-display"><span class="katex">=</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex">h</span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">∥</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.3552em;"><span></span></span></span><span class="katex-display"><span class="katex"></span></span><span class="mspace" style="margin-right:0.1667em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord mathnormal" style="margin-right:0.02691em;">(w</span><span class="mpunct">.,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="mord mathnormal"><span class="pstrut" style="height:3em;"></span><span class="pstrut" style="height:2.7em;"></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="pstrut" style="height:2.7em;"></span>∥x</span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal"></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mclose delimcenter" style="top:0em;">∥</span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mspace" style="margin-right:0.1667em;"></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist" style="height:0.85em;"><span style="top:-2.85em;"><span class="pstrut" style="height:3.2em;"></span><span style="width:0.556em;height:1.200em;"><svg translate="no" xmlns="http://www.w3.org/2000/svg" width="0.556em" height="1.200em" viewBox="0 0 556 1200"><path d="M145 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v0 v585 h43z
M367 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v0 v585 h43z"/></svg></span></span></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;"> </span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">r</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">∥</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.3552em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal">(x</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">,</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">x</span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:3em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">~</span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">)</span></span></span></span></span></span></span></span></span><span class="vlist" style="height:0.85em;"><span style="top:-2.85em;"><span class="pstrut" style="height:3.2em;"></span><span style="width:0.556em;height:1.200em;"><svg translate="no" xmlns="http://www.w3.org/2000/svg" width="0.556em" height="1.200em" viewBox="0 0 556 1200"><path d="M145 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v0 v585 h43z
M367 15 v585 v0 v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v0 v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v0 v585 h43z"/></svg></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mclose"><span class="delimsizing mult"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s"></span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span> </span></span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:1.054em;"><span style="top:-3.3029em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"> </span></span></span></span></span></span></span></span></span></span></span> 2</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">+</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">h</span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">⊥</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="mord mathnormal" style="margin-right:0.02691em;">(w</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="mord"><span class="mord mathnormal">∥x</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mclose delimcenter" style="top:0em;">∥</span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">∥r</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">⊥</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="mord mathnormal">(x</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.107em;"><span style="top:-3.107em;"><span class="mord"><span class="minner"><span class="minner"><span class="minner"><span class="mord"><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist-s">i</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r">,</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:3em;"></span><span class="vlist-s"> </span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mtable"><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"></span><span class="vlist-r"><span class="vlist" style="height:0.607em;"><span></span></span></span></span></span></span></span></span></span></span></span></p>
<p>아래 그림은 병렬 구성 요소로 인한 오류가 더 크고 잘못된 최접 이웃 결과를 초래할 수 있으므로 더 심각한 페널티가 적용될 수 있음을 보여주는 2차원 예시입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/quantization_cp_81e23dd1df.png" alt="The left figure shows poor quantization because the parallel offset affects the final result, while the right figure shows better quantization." class="doc-image" id="the-left-figure-shows-poor-quantization-because-the-parallel-offset-affects-the-final-result,-while-the-right-figure-shows-better-quantization." />
   </span> <span class="img-wrapper"> <span>왼쪽 그림은 병렬 오프셋이 최종 결과에 영향을 미치기 때문에 양자화가 불량한 반면, 오른쪽 그림은 양자화가 개선된 것을 보여줍니다.</span> </span></p>
<h3 id="4-bit-PQ-FastScan" class="common-anchor-header">4비트 PQ 패스트스캔</h3><p>먼저 PQ 계산 과정을 살펴보겠습니다. 쿼리하는 동안 쿼리와 서브벡터 클러스터 중심 사이의 거리를 미리 계산하여 룩업 테이블을 구성합니다. 그런 다음 테이블 조회를 통해 거리 계산을 수행하여 세그먼트 거리를 구하고 이를 합산합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/PQ_Fast_Scan1_248c53bc93.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그러나 잦은 메모리 읽기는 여전히 성능 병목 현상이 발생합니다. 룩업 테이블을 레지스터에 맞을 만큼 작게 만들 수 있다면 메모리 읽기 연산을 효율적인 CPU SIMD 명령어로 변환할 수 있습니다.</p>
<p>먼저, 각 서브벡터는 16개의 클래스로 클러스터링되므로 4비트 값은 클러스터 중심을 나타낼 수 있으며, 이것이 "4비트 PQ"라는 이름의 기원입니다. 그런 다음 일반적으로 부동 소수점으로 표시되는 거리를 스칼라 양자화(SQ)를 사용하여 uint8로 변환합니다. 이렇게 하면 하나의 서브벡터에 대한 룩업 테이블을 16 × 8 = 128비트를 사용하여 레지스터에 저장할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/PQ_Fast_Scan2_07b9589195.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>마지막으로 레지스터 스토리지 레이아웃을 살펴봅시다(AVX2 명령어 세트를 예로 사용): 32개 벡터의 서브벡터가 128비트 레지스터에 배치되고 룩업 테이블과 결합됩니다. 그러면 단일 SIMD 셔플 CPU 명령어를 사용하여 "조회" 연산을 효율적으로 완료할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/register_layout_b2bf8c2b2b.png" alt="register layout" class="doc-image" id="register-layout" />
   </span> <span class="img-wrapper"> <span>레지스터 레이아웃</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SIMD_Shuffle_for_Lookup_c86e6d9657.png" alt="SIMD Shuffle for Lookup" class="doc-image" id="simd-shuffle-for-lookup" />
   </span> <span class="img-wrapper"> <span>룩업을 위한 SIMD 셔플</span> </span></p>
<p>여기서 흥미로운 점은 ScaNN 논문이 전적으로 첫 번째 최적화에 초점을 맞추고 있다는 점인데, 이는 수학적 추론을 강조하는 알고리즘 논문으로 볼 수 있기 때문에 당연한 결과입니다. 그러나 이 논문에서 제시된 실험 결과는 매우 인상적입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/experimental_results_a46ec830a7.png" alt="The experimental results presented in the ScaNN paper." class="doc-image" id="the-experimental-results-presented-in-the-scann-paper." />
   </span> <span class="img-wrapper"> <span>ScaNN 논문에 제시된 실험 결과</span>. </span></p>
<p>직관적으로 손실 최적화만으로는 이렇게 극적인 효과가 나타나지 않을 것입니다. 다른 <a href="https://medium.com/@kumon/similarity-search-scann-and-4-bit-pq-fastscan-ab98766b32bd">블로그에서도</a> 이 점을 지적했는데, 실제로 차이를 만드는 것은 4비트 PQ FastScan 부분입니다.</p>
<h2 id="Experimental-Results" class="common-anchor-header">실험 결과<button data-href="#Experimental-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스 벤치마크 도구인 <a href="https://github.com/zilliztech/VectorDBBench">VectorDBBench를</a> 사용하여 간단한 테스트를 수행했습니다. 기존 IVFFLAT 및 IVF_PQ에 비해 ScaNN의 성능 우위는 상당히 분명했습니다. Milvus에 통합된 후, 동일한 리콜률의 Cohere1M 데이터 세트에서 QPS는 IVFFLAT의 5배, IVF_PQ의 6배에 달할 수 있습니다.</p>
<p>그러나 QPS는 HNSW와 같은 그래프 기반 인덱스보다 약간 낮기 때문에 높은 QPS 사용 사례에 우선적으로 선택되지는 않습니다. 그러나 일부 추천 시스템과 같이 리콜이 낮은 시나리오에서는 원시 데이터를 로드하지 않고 ScaNN을 사용하면 매우 낮은 메모리 사용량(원본 데이터의 1/16)으로 인상적인 QPS를 달성할 수 있으므로 탁월한 인덱스 선택이 될 수 있습니다.</p>
<table>
<thead>
<tr><th>Index_Type</th><th>Case</th><th>QPS</th><th>지연 시간(p99)</th><th>recall</th><th>memory</th></tr>
</thead>
<tbody>
<tr><td>IVFFLAT</td><td>성능1M</td><td>266</td><td>0.0173s</td><td>0.9544</td><td>3G</td></tr>
<tr><td>HNSW</td><td>성능1M</td><td>1885</td><td>0.0054s</td><td>0.9438</td><td>3.24G</td></tr>
<tr><td>IVF_PQ</td><td>성능1M</td><td>208</td><td>0.0292s</td><td>0.928</td><td>0.375G</td></tr>
<tr><td>ScaNN(with_raw_data: true)</td><td>Performance1M</td><td>1215</td><td>0.0069s</td><td>0.9389</td><td>3.186G</td></tr>
<tr><td>ScaNN(with_raw_data: false)</td><td>Performance1M</td><td>1265</td><td>0.0071s</td><td>0.7066</td><td>0.186G</td></tr>
</tbody>
</table>
<h2 id="Conclusion" class="common-anchor-header">결론<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>ScaNN은 익숙한 IVFPQ 프레임워크를 기반으로 하지만 양자화 및 로우레벨 룩업 가속 모두에서 심층 엔지니어링 작업을 통해 훨씬 더 발전시켰습니다. 양자화 목표를 랭킹 품질에 맞추고 내부 루프에서 메모리 병목 현상을 제거함으로써 ScaNN은 점수 인식 양자화를 4비트 PQ FastScan 경로와 결합하여 기존의 메모리 바운드 프로세스를 효율적이고 SIMD 친화적인 계산으로 전환합니다.</p>
<p>실제로 ScaNN은 명확하고 잘 정의된 틈새 시장을 제공합니다. 리콜률이 높은 설정에서 HNSW와 같은 그래프 기반 인덱스를 대체하기 위한 것이 아닙니다. 대신, 메모리 예산이 빠듯한 리콜에 민감하지 않은 워크로드의 경우, ScaNN은 매우 작은 설치 공간으로 높은 처리량을 제공합니다. 실험 결과, Milvus VectorDB에 통합된 후 ScaNN은 Cohere1M 데이터 세트에서 IVFFLAT의 약 5배에 달하는 QPS를 달성하여 완벽한 리콜보다 압축과 효율성이 더 중요한 고처리량, 저지연 ANN 검색을 위한 강력한 선택이 될 수 있었습니다.</p>
<p>ScaNN에 대해 더 자세히 알아보거나 실제 시스템에서의 인덱스 선택에 대해 논의하고 싶으신 경우, <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 가입하여 커뮤니티의 엔지니어 및 다른 AI 엔지니어와 채팅하세요. 또한 20분 동안 진행되는 일대일 세션을 예약하여 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus</a> 업무 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">시간을</a> 통해 인사이트, 지침, 질문에 대한 답변을 얻을 수도 있습니다.</p>
