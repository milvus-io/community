---
id: choose-embedding-model-rag-2026.md
title: '2026년 RAG에 가장 적합한 임베딩 모델을 선택하는 방법: 벤치마킹한 10가지 모델'
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  교차 모달, 교차 언어, 긴 문서 및 차원 압축 작업에 대해 10가지 임베딩 모델을 벤치마킹했습니다. 귀사의 RAG 파이프라인에 어떤 것이
  적합한지 알아보세요.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>요약:</strong> 공개 벤치마크가 놓치고 있는 네 가지 프로덕션 시나리오(교차 모드 검색, 언어 간 검색, 주요 정보 검색, 차원 압축)에 대해 10가지 <a href="https://zilliz.com/ai-models">임베딩 모델을</a> 테스트했습니다. 모든 것을 충족하는 단일 모델은 없습니다. Gemini Embedding 2는 최고의 다재다능한 제품입니다. 크로스 모달 작업에서 오픈 소스 Qwen3-VL-2B가 클로즈 소스 API를 능가합니다. 저장 공간을 절약하기 위해 크기를 압축해야 하는 경우 Voyage Multimodal 3.5 또는 Jina Embedding v4를 사용하세요.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">임베딩 모델을 선택할 때 MTEB만으로는 충분하지 않은 이유<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>대부분의 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> 프로토타입은 OpenAI의 텍스트 임베딩 3-small로 시작합니다. 저렴하고 통합하기 쉬우며 영어 텍스트 검색의 경우 충분히 잘 작동합니다. 하지만 프로덕션 RAG는 빠르게 성장합니다. 파이프라인에 이미지, PDF, 다국어 문서가 추가되면서 텍스트 전용 <a href="https://zilliz.com/ai-models">임베딩 모델만으로는</a> 더 이상 충분하지 않습니다.</p>
<p><a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB 리더보드를</a> 보면 더 나은 옵션이 있다는 것을 알 수 있습니다. 무엇이 문제일까요? MTEB는 단일 언어 텍스트 검색만 테스트합니다. 교차 모달 검색(이미지 컬렉션에 대한 텍스트 쿼리), 교차 언어 검색(중국어 쿼리가 영어 문서를 찾는 경우), 긴 문서 정확도 또는 <a href="https://zilliz.com/learn/what-is-a-vector-database">벡터 데이터베이스의</a> 저장 공간을 절약하기 위해 <a href="https://zilliz.com/glossary/dimension">임베딩 차원을</a> 잘라낼 때 품질이 얼마나 떨어지는지는 다루지 않습니다.</p>
<p>그렇다면 어떤 임베딩 모델을 사용해야 할까요? 데이터 유형, 언어, 문서 길이, 그리고 차원 압축이 필요한지 여부에 따라 달라집니다. 저희는 <strong>CCKM이라는</strong> 벤치마크를 구축하여 2025년부터 2026년 사이에 출시된 10개 모델을 정확히 이러한 차원에 걸쳐 테스트했습니다.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">CCKM 벤치마크란 무엇인가요?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong> (교차 모달, 교차 언어, 주요 정보, MRL)은 표준 벤치마크가 놓치고 있는 네 가지 기능을 테스트합니다:</p>
<table>
<thead>
<tr><th>차원</th><th>테스트 대상</th><th>중요한 이유</th></tr>
</thead>
<tbody>
<tr><td><strong>교차 모달 검색</strong></td><td>거의 동일한 방해 요소가 있을 때 텍스트 설명을 올바른 이미지와 일치시킵니다.</td><td><a href="https://zilliz.com/learn/multimodal-rag">멀티모달 RAG</a> 파이프라인은 동일한 벡터 공간에 텍스트와 이미지 임베딩이 필요합니다.</td></tr>
<tr><td><strong>교차 언어 검색</strong></td><td>중국어 쿼리에서 올바른 영어 문서를 찾거나 그 반대의 경우도 마찬가지입니다.</td><td>생산 지식 기반은 다국어인 경우가 많습니다.</td></tr>
<tr><td><strong>핵심 정보 검색</strong></td><td>4K-32K 문자 문서에 묻혀 있는 특정 사실 찾기(건초더미에서 바늘 찾기)</td><td>RAG 시스템은 계약서 및 연구 논문과 같은 긴 문서를 자주 처리합니다.</td></tr>
<tr><td><strong>MRL 차원 압축</strong></td><td>임베딩을 256개 차원으로 잘라낼 때 모델의 품질이 얼마나 손실되는지 측정하세요.</td><td>더 적은 차원 = 벡터 데이터베이스의 저장 비용 절감, 하지만 품질 비용은 어느 정도일까요?</td></tr>
</tbody>
</table>
<p>MTEB는 이 중 어느 것도 포함하지 않습니다. MMEB는 멀티모달을 추가하지만 하드 네거티브는 생략하므로 모델이 미묘한 차이를 처리한다는 것을 증명하지 않아도 높은 점수를 받을 수 있습니다. CCKM은 이러한 모델들이 놓치는 부분을 커버하도록 설계되었습니다.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">어떤 임베딩 모델을 테스트했나요? Gemini 임베딩 2, Jina 임베딩 v4 등<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>API 서비스와 오픈 소스 옵션을 모두 포함하는 10개의 모델과 2021년 기준인 CLIP ViT-L-14를 테스트했습니다.</p>
<table>
<thead>
<tr><th>모델</th><th>소스</th><th>파라미터</th><th>치수</th><th>모달리티</th><th>주요 특성</th></tr>
</thead>
<tbody>
<tr><td>제미니 임베딩 2</td><td>Google</td><td>비공개</td><td>3072</td><td>텍스트/이미지/비디오/오디오/PDF</td><td>모든 모달리티, 가장 넓은 커버리지</td></tr>
<tr><td>지나 임베딩 v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>텍스트 / 이미지 / PDF</td><td>MRL + LoRA 어댑터</td></tr>
<tr><td>Voyage 멀티모달 3.5</td><td>Voyage AI(몽고DB)</td><td>미공개</td><td>1024</td><td>텍스트/이미지/비디오</td><td>작업 전반에서 균형 잡힌 성능</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>알리바바 Qwen</td><td>2B</td><td>2048</td><td>텍스트/이미지/비디오</td><td>오픈 소스, 경량 멀티모달</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>텍스트/이미지</td><td>현대화된 CLIP 아키텍처</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>비공개</td><td>수정됨</td><td>텍스트</td><td>엔터프라이즈 검색</td></tr>
<tr><td>OpenAI 텍스트 임베딩-3-large</td><td>OpenAI</td><td>비공개</td><td>3072</td><td>텍스트</td><td>가장 널리 사용되는</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>텍스트</td><td>오픈 소스, 100개 이상의 언어</td></tr>
<tr><td>mxbai-embed-large</td><td>믹스드브레드 AI</td><td>335M</td><td>1024</td><td>텍스트</td><td>경량, 영어 중심</td></tr>
<tr><td>nomic-embed-text</td><td>노믹 AI</td><td>137M</td><td>768</td><td>텍스트</td><td>초경량</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>텍스트 / 이미지</td><td>기준선</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">교차 모드 검색: 어떤 모델이 텍스트-이미지 검색을 처리하나요?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 파이프라인이 텍스트와 함께 이미지를 처리하는 경우, 임베딩 모델은 두 모달리티를 동일한 <a href="https://zilliz.com/glossary/vector-embeddings">벡터 공간에</a> 배치해야 합니다. 이커머스 이미지 검색, 이미지와 텍스트가 혼합된 지식 베이스 또는 텍스트 쿼리가 올바른 이미지를 찾아야 하는 모든 시스템을 생각해 보세요.</p>
<h3 id="Method" class="common-anchor-header">방법</h3><p>COCO val2017에서 200개의 이미지-텍스트 쌍을 가져왔습니다. 각 이미지에 대해 GPT-4o-mini가 상세한 설명을 생성했습니다. 그런 다음 이미지당 3개의 하드 네거티브(정확한 설명과 한두 가지 세부 사항만 다른 설명)를 작성했습니다. 모델은 200개의 이미지와 600개의 방해 요소로 구성된 풀에서 올바른 일치 항목을 찾아야 합니다.</p>
<p>데이터 세트의 예시입니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>캘리포니아, 쿠바 등 여행 스티커가 붙은 빈티지 갈색 가죽 여행 가방이 푸른 하늘을 배경으로 금속 수하물 선반에 놓여 있는 이미지 - 교차 모드 검색 벤치마크의 테스트 이미지로 사용됨.</span> </span></p>
<blockquote>
<p><strong>올바른 설명:</strong> "이 이미지는 '캘리포니아', '쿠바', '뉴욕' 등 다양한 여행 스티커가 부착된 빈티지 갈색 가죽 여행 가방이 파란 하늘을 배경으로 금속 수하물 선반에 놓여 있는 모습을 보여줍니다."</p>
<p><strong>하드 네거티브:</strong> 같은 문장이지만 "캘리포니아"는 "플로리다"가 되고 "푸른 하늘"은 "흐린 하늘"이 됩니다. 모델은 이미지의 세부 사항을 실제로 이해해야 이를 구분할 수 있습니다.</p>
</blockquote>
<p><strong>점수 매기기:</strong></p>
<ul>
<li>모든 이미지와 모든 텍스트에 대한 <a href="https://zilliz.com/glossary/vector-embeddings">임베딩을</a> 생성합니다(정확한 설명 200개 + 하드 네거티브 600개).</li>
<li><strong>텍스트-이미지 변환(T2I):</strong> 각 설명이 200개의 이미지를 검색하여 가장 가까운 일치 항목을 찾습니다. 최상위 결과가 맞으면 점수를 얻습니다.</li>
<li><strong>이미지 대 텍스트(i2t):</strong> 각 이미지가 800개의 모든 텍스트를 검색하여 가장 가까운 일치 항목을 찾습니다. 최상위 결과가 오답이 아닌 정확한 설명인 경우에만 점수를 얻습니다.</li>
<li><strong>최종 점수:</strong> hard_avg_R@1 = (t2i 정확도 + i2t 정확도) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">결과</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>교차 모달 검색 순위를 보여주는 가로 막대 차트: Qwen3-VL-2B가 0.945로 선두, Gemini Embed 2가 0.928, Voyage MM-3.5가 0.900, Jina CLIP v2가 0.873, CLIP ViT-L-14가 0.768로 그 뒤를 잇고</span> </span>있습니다.</p>
<p>알리바바의 Qwen 팀의 오픈 소스 2B 파라미터 모델인 Qwen3-VL-2B가 모든 비공개 소스 API를 제치고 1위에 올랐습니다.</p>
<p><strong>모달리티 격차는</strong> 대부분의 차이를 설명합니다. 임베딩 모델은 텍스트와 이미지를 동일한 벡터 공간에 매핑하지만 실제로는 두 가지 양식은 서로 다른 영역에서 클러스터링되는 경향이 있습니다. 모달리티 갭은 이 두 클러스터 사이의 L2 거리를 측정합니다. 간격이 작을수록 교차 모달 검색이 쉬워집니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>큰 모달리티 갭(0.73, 텍스트 및 이미지 임베딩 클러스터가 멀리 떨어져 있음)과 작은 모달리티 갭(0.25, 클러스터가 겹침)을 비교한 시각화 - 갭이 작을수록 교차 모달 매칭이 더 쉬워집니다.</span> </span></p>
<table>
<thead>
<tr><th>모델</th><th>점수(R@1)</th><th>모달리티 갭</th><th>Params</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B(오픈 소스)</td></tr>
<tr><td>제미니 임베딩 2</td><td>0.928</td><td>0.73</td><td>알 수 없음(비공개)</td></tr>
<tr><td>보야지 멀티모달 3.5</td><td>0.900</td><td>0.59</td><td>알 수 없음 (비공개)</td></tr>
<tr><td>지나 클립 v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Qwen의 모달리티 갭은 0.25로 Gemini의 0.73의 약 1/3 수준입니다. <a href="https://milvus.io/">Milvus와</a> 같은 <a href="https://zilliz.com/learn/what-is-a-vector-database">벡터 데이터베이스에서</a> 모달리티 갭이 작다는 것은 텍스트와 이미지 임베딩을 동일한 <a href="https://milvus.io/docs/manage-collections.md">컬렉션에</a> 저장하고 두 <a href="https://milvus.io/docs/manage-collections.md">컬렉션에서</a> 바로 <a href="https://milvus.io/docs/single-vector-search.md">검색할</a> 수 있다는 의미입니다. 간격이 크면 교차 모달 <a href="https://zilliz.com/glossary/similarity-search">유사성 검색의</a> 신뢰성이 떨어질 수 있으며, 이를 보완하기 위해 순위 재지정 단계가 필요할 수 있습니다.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">교차 언어 검색: 언어 간 의미를 정렬하는 모델은 무엇인가요?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>다국어 지식창고는 프로덕션 환경에서 흔히 볼 수 있습니다. 사용자가 중국어로 질문했는데 답변이 영어 문서에 있거나 그 반대의 경우도 마찬가지입니다. 임베딩 모델은 한 언어 내에서뿐만 아니라 여러 언어 간에 의미를 일치시켜야 합니다.</p>
<h3 id="Method" class="common-anchor-header">방법</h3><p>세 가지 난이도에 걸쳐 중국어와 영어로 된 166개의 병렬 문장 쌍을 구축했습니다:</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>언어 간 난이도 단계: 쉬운 단계는 我爱你와 같은 문자 그대로의 번역을 사랑합니다로, 중간 단계는 这道菜太咸了와 같은 의역된 문장을 이 요리는 너무 짜다로, 어려운 단계는 画蛇添足과 같은 중국어 관용구를 의미적으로 다른 하드 네거티브와 함께 백합에 금을 입힌다로 매핑했습니다.</span> </span></p>
<p>각 언어에는 152개의 경부정 부정어가 있습니다.</p>
<p><strong>채점:</strong></p>
<ul>
<li>모든 중국어 텍스트(정답 166개 + 방해 요소 152개)와 모든 영어 텍스트(정답 166개 + 방해 요소 152개)에 대한 임베딩을 생성합니다.</li>
<li><strong>중국어 → 영어:</strong> 각 중국어 문장이 올바른 번역을 위해 318개의 영어 텍스트를 검색합니다.</li>
<li><strong>영어 → 중국어:</strong> 그 반대도 마찬가지입니다.</li>
<li><strong>최종 점수:</strong> hard_avg_R@1 = (zh→en 정확도 + en→zh 정확도) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">결과</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>교차 언어 검색 순위를 보여주는 가로 막대 차트: Gemini Embed 2가 0.997로 선두를 달리고 있으며, 0.988의 Qwen3-VL-2B, 0.985의 Jina v4, 0.982의 Voyage MM-3.5, 0.120의 mxbai가 그 뒤를 잇고</span> </span>있습니다.</p>
<p>Gemini Embedding 2는 0.997점으로 테스트 모델 중 가장 높은 점수를 받았습니다. '画蛇添足' → '백합에 금을 입히다'와 같이 패턴 매칭이 아닌 언어 간 진정한 <a href="https://zilliz.com/glossary/semantic-search">의미</a> 이해가 필요한 하드 티어에서 유일하게 1.000점 만점을 받은 모델이기도 합니다.</p>
<table>
<thead>
<tr><th>모델</th><th>점수(R@1)</th><th>Easy</th><th>중간</th><th>어려움(관용구)</th></tr>
</thead>
<tbody>
<tr><td>제미니 임베딩 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>지나 임베딩 v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>보야지 멀티모달 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-large</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>코히어 임베드 v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>상위 7개 모델은 모두 전체 점수가 0.93점이며, 실제 차별화는 하드 티어(중국어 관용구)에서 발생합니다. 영어 중심의 경량 모델인 nomic-embed-text와 mxbai-embed-large는 다국어 작업에서 거의 0점에 가까운 점수를 받았습니다.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">핵심 정보 검색: 모델이 32K 토큰 문서에서 바늘을 찾을 수 있을까요?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 시스템은 법률 계약서, 연구 논문, <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터가</a> 포함된 내부 보고서 등 긴 문서를 처리하는 경우가 많습니다. 문제는 임베딩 모델이 수천 자의 주변 텍스트에 묻혀 있는 특정 사실 하나를 찾아낼 수 있는지 여부입니다.</p>
<h3 id="Method" class="common-anchor-header">방법</h3><p>다양한 길이(4K~32K자)의 Wikipedia 기사를 건초 더미로 삼아 시작, 25%, 50%, 75%, 끝 등 다양한 위치에 하나의 조작된 사실, 즉 바늘을 삽입했습니다. 모델은 쿼리 임베딩을 기반으로 문서의 어느 버전에 바늘이 포함되어 있는지 결정해야 합니다.</p>
<p><strong>예시:</strong></p>
<ul>
<li><strong>Needle:</strong> "메리디안 코퍼레이션은 2025년 3분기 분기 매출이 8억 4,730만 달러라고 보고했습니다."</li>
<li><strong>쿼리:</strong> "메리디안 코퍼레이션의 분기별 매출은 얼마입니까?"</li>
<li><strong>헤이스택:</strong> 광합성에 관한 32,000자의 위키백과 문서로, 바늘이 내부 어딘가에 숨겨져 있습니다.</li>
</ul>
<p><strong>점수 매기기:</strong></p>
<ul>
<li>쿼리, 바늘이 있는 문서, 바늘이 없는 문서에 대한 임베딩을 생성합니다.</li>
<li>쿼리가 바늘이 포함된 문서와 더 유사한 경우 적중으로 계산합니다.</li>
<li>모든 문서 길이와 바늘 위치에 대한 평균 정확도입니다.</li>
<li><strong>최종 메트릭:</strong> 전체 정확도 및 성능 저하율(가장 짧은 문서에서 가장 긴 문서로 갈수록 정확도가 얼마나 떨어지는지).</li>
</ul>
<h3 id="Results" class="common-anchor-header">결과</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>문서 길이별 건초더미 정확도를 보여주는 히트맵: Gemini Embed 2는 최대 32K까지 모든 길이에서 1.000점, 상위 7개 모델은 컨텍스트 창 내에서 완벽한 점수를 기록, mxbai와 nomic은 4K 이상에서 급격히 저하됨</span> </span></p>
<p>Gemini Embedding 2는 전체 4K-32K 범위에서 테스트한 유일한 모델이며, 모든 길이에서 완벽한 점수를 기록했습니다. 이 테스트의 다른 어떤 모델도 컨텍스트 윈도우가 32K에 도달하지 않았습니다.</p>
<table>
<thead>
<tr><th>모델</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>전체</th><th>화질 저하</th></tr>
</thead>
<tbody>
<tr><td>제미니 임베딩 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-large</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>지나 임베딩 v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>보야지 멀티모달 3.5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>지나 클립 v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>MXBAI-임베드-라지 (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-"는 문서 길이가 모델의 컨텍스트 창을 초과함을 의미합니다.</p>
<p>상위 7개 모델은 컨텍스트 창 내에서 완벽한 점수를 받았습니다. BGE-M3는 8K(0.920)에서 미끄러지기 시작합니다. 경량 모델(mxbai 및 nomic)은 4K 문자(약 1,000토큰)에서 0.4~0.6으로 떨어집니다. mxbai의 경우, 이 감소는 문서의 대부분을 잘라내는 512토큰 컨텍스트 창을 부분적으로 반영합니다.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">MRL 차원 압축: 256개 차원에서는 품질이 얼마나 떨어질까요?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>마트료시카 표현 학습(MRL)</strong> 은 벡터의 처음 N 차원을 그 자체로 의미 있게 만드는 학습 기법입니다. 3072차원의 벡터를 256차원으로 잘라내도 대부분의 의미 품질을 그대로 유지합니다. 차원이 적을수록 <a href="https://zilliz.com/learn/what-is-a-vector-database">벡터 데이터베이스의</a> 저장 공간과 메모리 비용이 줄어드는데, 3072차원에서 256차원으로 축소하면 저장 공간이 12배 줄어듭니다.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>MRL 차원 축소를 보여주는 그림: 3072 차원은 최고 품질, 1024는 95%, 512는 90%, 256은 85% - 256 차원에서는 12배의 저장 공간이 절약됩니다.</span> </span></p>
<h3 id="Method" class="common-anchor-header">방법</h3><p>STS-B 벤치마크의 150개 문장 쌍을 사용했으며, 각 문장 쌍에는 사람이 주석한 유사성 점수(0-5)가 부여되었습니다. 각 모델에 대해 전체 차원으로 임베딩을 생성한 다음 1024, 512, 256으로 잘라냈습니다.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>인간 유사도 점수가 있는 문장 쌍을 보여주는 STS-B 데이터 예시: 한 소녀가 머리를 스타일링하는 것과 한 소녀가 머리를 빗는 것은 2.5점, 한 무리의 남자들이 해변에서 축구를 하는 것과 한 무리의 남자들이 해변에서 축구를 하는 것은 3.6점입니다.</span> </span></p>
<p><strong>채점하기:</strong></p>
<ul>
<li>각 차원 수준에서 각 문장 쌍의 임베딩 사이의 <a href="https://zilliz.com/glossary/cosine-similarity">코사인 유사도를</a> 계산합니다.</li>
<li><strong>스피어먼의 ρ</strong> (순위 상관관계)를 사용하여 모델의 유사도 순위와 사람의 순위를 비교합니다.</li>
</ul>
<blockquote>
<p><strong>스피어먼의 ρ란 무엇인가요?</strong> 두 순위가 얼마나 잘 일치하는지를 측정합니다. 사람이 쌍 A를 가장 유사하다고 평가하고 B를 두 번째, C를 가장 유사하지 않다고 평가하며 모델의 코사인 유사도가 A &gt; B &gt; C 순이라면 ρ는 1.0에 가까워집니다. ρ가 1.0이면 완벽한 일치도를 의미합니다. ρ가 0이면 상관관계가 없음을 의미합니다.</p>
</blockquote>
<p><strong>최종 지표:</strong> spearman_rho(높을수록 좋음) 및 min_viable_dim(품질이 전체 차원 성능의 5% 이내로 유지되는 가장 작은 차원).</p>
<h3 id="Results" class="common-anchor-header">결과</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>MRL 전체 차원 대 256 차원 품질을 보여주는 도트 플롯: Voyage MM-3.5가 +0.6% 변화로 선두, Jina v4가 +0.5%, Gemini Embed 2가 -0.6%로 최하위를 기록했습니다</span> </span>.</p>
<p>차원을 잘라내어 <a href="https://milvus.io/">Milvus</a> 또는 다른 벡터 데이터베이스의 스토리지 비용을 줄이려는 경우 이 결과가 중요합니다.</p>
<table>
<thead>
<tr><th>모델</th><th>ρ(전체 차원)</th><th>ρ(256 차원)</th><th>Decay</th></tr>
</thead>
<tbody>
<tr><td>Voyage 멀티모달 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>지나 임베딩 v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-large</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>제미니 임베딩 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage와 Jina v4가 선두를 달리는 이유는 두 제품 모두 MRL을 목표로 명시적으로 훈련되었기 때문입니다. 차원 압축은 모델 크기와는 거의 관련이 없으며, 모델이 이를 위해 훈련되었는지 여부가 중요합니다.</p>
<p>Gemini의 점수에 대한 참고 사항: MRL 순위는 모델이 잘린 후 품질을 얼마나 잘 보존하는지를 반영하는 것이지, 전체 차원 검색을 얼마나 잘하는지를 반영하는 것이 아닙니다. Gemini의 전체 차원 검색은 강력합니다. 다국어 및 주요 정보 결과는 이미 이를 입증했습니다. 다만 축소에는 최적화되지 않았을 뿐입니다. 차원 압축이 필요하지 않은 경우에는 이 메트릭이 적용되지 않습니다.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">어떤 임베딩 모델을 사용해야 하나요?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>모든 것을 만족시키는 모델은 없습니다. 전체 스코어카드는 다음과 같습니다:</p>
<table>
<thead>
<tr><th>모델</th><th>Params</th><th>교차 모달</th><th>교차 언어</th><th>주요 정보</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>제미니 임베딩 2</td><td>비공개</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>보야지 멀티모달 3.5</td><td>미공개</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>지나 임베딩 v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-large</td><td>미공개</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>비공개</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>MXBAI-EMBED-LARGE</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>nomic-embed-text</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-"는 모델이 해당 양식 또는 기능을 지원하지 않음을 의미합니다. CLIP은 2021년 기준입니다.</p>
<p>눈에 띄는 사항은 다음과 같습니다:</p>
<ul>
<li><strong>크로스 모달:</strong> Qwen3-VL-2B(0.945)가 1위, Gemini(0.928)가 2위, Voyage(0.900)가 3위를 차지했습니다. 오픈 소스 2B 모델이 모든 비공개 소스 API를 제쳤습니다. 결정적인 요인은 매개변수 수가 아니라 양식 격차였습니다.</li>
<li><strong>다국어:</strong> Gemini(0.997)가 선두를 차지했으며, 이 모델은 관용구 수준 정렬에서 유일하게 완벽한 점수를 받았습니다. 상위 8개 모델은 모두 0.93점을 기록했습니다. 영어 전용 경량 모델은 거의 0점에 가까운 점수를 받았습니다.</li>
<li><strong>주요 정보</strong> API 및 대규모 오픈 소스 모델은 최대 8K까지 완벽한 점수를 받았습니다. 335M 미만의 모델은 4K에서 성능이 저하되기 시작합니다. Gemini는 32K를 만점으로 처리하는 유일한 모델입니다.</li>
<li><strong>MRL 차원 압축:</strong> Voyage(0.880)와 Jina v4(0.833)가 256차원에서 1% 미만의 손실로 선두를 차지했습니다. 제미니(0.668)는 전체 차원에서는 강하지만 잘림에 최적화되어 있지 않아 최하위를 차지했습니다.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">선택 방법: 의사 결정 순서도</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>모델 선택 순서도 임베딩하기: 시작 → 이미지 또는 동영상이 필요하십니까? → 예: 자체 호스팅이 필요하십니까? → 예: Qwen3-VL-2B, 아니요: Gemini 임베딩 2. 이미지 없음 → 저장 공간이 필요하십니까? → 예: Jina v4 또는 Voyage, 아니요: 다국어가 필요하십니까? → 예: Gemini Embedding 2, 아니요: OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">최고의 올라운더: 제미니 임베딩 2</h3><p>이 벤치마크에서 전체적으로 가장 강력한 모델은 Gemini Embedding 2입니다.</p>
<p><strong>강점:</strong> 교차 언어(0.997) 및 주요 정보 검색(최대 32K까지 모든 길이에서 1.000) 부문에서 1위를 차지했습니다. 크로스 모달 부문 2위(0.928). 가장 넓은 모달리티 범위 - 대부분의 모델이 3개 모달리티를 지원하는 데 비해 5개 모달리티(텍스트, 이미지, 비디오, 오디오, PDF)를 지원합니다.</p>
<p><strong>약점:</strong> MRL 압축에서 최하위(ρ = 0.668). 크로스 모달에서는 오픈 소스인 Qwen3-VL-2B에 밀립니다.</p>
<p>차원 압축이 필요하지 않은 경우, 다국어 + 긴 문서 검색의 조합에서 Gemini는 진정한 경쟁자가 없습니다. 하지만 모달 간 정밀도나 스토리지 최적화를 위해서는 전문화된 모델이 더 좋습니다.</p>
<h2 id="Limitations" class="common-anchor-header">제한 사항<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>고려할 만한 가치가 있는 모든 모델을 포함하지는 않았습니다. NVIDIA의 NV-Embed-v2와 Jina의 v5-text가 목록에 있었지만 이번 테스트에는 포함되지 않았습니다.</li>
<li>텍스트 및 이미지 양식에 중점을 두었으며 비디오, 오디오 및 PDF 임베딩(일부 모델은 지원한다고 주장하지만)은 포함되지 않았습니다.</li>
<li>코드 검색 및 기타 도메인별 시나리오는 테스트 대상에서 제외되었습니다.</li>
<li>표본 크기가 상대적으로 작았기 때문에 모델 간의 순위 차이가 통계적 노이즈에 포함될 수 있습니다.</li>
</ul>
<p>이 기사의 결과는 1년 이내에 구식이 될 것입니다. 새로운 모델이 지속적으로 출시되며, 새로운 모델이 출시될 때마다 순위표가 개편됩니다. 데이터 유형, 쿼리 패턴, 문서 길이를 정의하고 새로운 모델이 출시되면 자체 테스트를 통해 실행하는 등 자체 평가 파이프라인을 구축하는 것이 더 오래 지속되는 투자입니다. MTEB, MMTEB, MMEB와 같은 공개 벤치마크는 모니터링할 가치가 있지만, 최종 결정은 항상 자체 데이터에서 내려야 합니다.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">벤치마크 코드는 GitHub에서 오픈 소스로</a> 제공되므로 이를 포크하여 사용 사례에 맞게 조정할 수 있습니다.</p>
<hr>
<p>임베딩 모델을 선택했다면, 해당 벡터를 대규모로 저장하고 검색할 수 있는 공간이 필요합니다. <a href="https://milvus.io/">Milvus는</a> 세계에서 가장 널리 채택된 오픈 소스 벡터 데이터베이스로, <a href="https://github.com/milvus-io/milvus">43,000개 이상의 GitHub 스타가</a> 바로 이러한 용도로 구축되었으며, MRL 잘린 차원, 혼합 멀티모달 컬렉션, 고밀도 및 희소 벡터를 결합한 하이브리드 검색을 지원하고 <a href="https://milvus.io/docs/architecture_overview.md">노트북에서 수십억 개의 벡터까지 확장할</a> 수 있습니다.</p>
<ul>
<li><a href="https://milvus.io/docs/quickstart.md">Milvus 빠른 시작 가이드를</a> 참조하거나 <code translate="no">pip install pymilvus</code> 에서 설치하세요.</li>
<li><a href="https://milvusio.slack.com/">Milvus Slack</a> 또는 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord에</a> 참여하여 임베딩 모델 통합, 벡터 인덱싱 전략 또는 프로덕션 확장에 대해 질문하세요.</li>
<li>모델 선택, 컬렉션 스키마 설계, 성능 튜닝에 대한 도움을 받을 수 있는<a href="https://milvus.io/office-hours">무료 Milvus 오피스 아워 세션을 예약하여</a> RAG 아키텍처를 살펴보세요.</li>
<li>인프라 작업을 건너뛰고 싶다면 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)에서 무료 티어를 통해 시작할 수 있습니다.</li>
</ul>
<hr>
<p>엔지니어가 프로덕션 RAG를 위한 임베딩 모델을 선택할 때 자주 묻는 질문 몇 가지를 소개합니다:</p>
<p><strong>Q: 지금 당장 텍스트 데이터만 있는 경우에도 멀티모달 임베딩 모델을 사용해야 하나요?</strong></p>
<p>로드맵에 따라 다릅니다. 향후 6~12개월 이내에 이미지, PDF 또는 기타 모달리티를 추가할 가능성이 있는 파이프라인이라면 Gemini 임베딩 2 또는 Voyage Multimodal 3.5와 같은 멀티모달 모델로 시작하면 나중에 전체 데이터 세트를 다시 임베드할 필요가 없으므로 마이그레이션의 번거로움을 피할 수 있습니다. 당분간 텍스트만 사용할 예정이라면 OpenAI 3-large 또는 Cohere Embed v4와 같은 텍스트 중심 모델이 가격 대비 성능이 더 좋습니다.</p>
<p><strong>질문: MRL 차원 압축은 벡터 데이터베이스에서 실제로 얼마나 많은 저장 공간을 절약하나요?</strong></p>
<p>3072개 차원을 256개 차원으로 압축하면 벡터당 저장 공간이 12배 감소합니다. float32에서 1억 개의 벡터가 있는 <a href="https://milvus.io/">Milvus</a> 컬렉션의 경우, 대략 1.14TB → 95GB입니다. 핵심은 모든 모델이 잘림을 잘 처리하는 것은 아니라는 점입니다. Voyage Multimodal 3.5와 Jina Embeddings v4는 256차원에서 1% 미만의 품질 저하를 보이는 반면, 다른 모델은 품질이 크게 저하됩니다.</p>
<p><strong>Q: 크로스 모달 검색에 있어 Qwen3-VL-2B가 Gemini Embedding 2보다 정말 더 나은가요?</strong></p>
<p>벤치마크 결과, 거의 동일한 방해 요소가 있는 하드 크로스 모달 검색에서 Qwen3-VL-2B는 0.945점을 기록한 반면 Gemini는 0.928점을 기록했습니다. 주된 이유는 Qwen의 훨씬 작은 모달리티 갭(0.25 대 0.73)으로, 텍스트와 이미지 <a href="https://zilliz.com/glossary/vector-embeddings">임베딩이</a> 벡터 공간에서 서로 더 가깝게 클러스터링된다는 것을 의미합니다. 즉, Gemini는 5가지 모달리티를 지원하는 반면 Qwen은 3가지 모달리티를 지원하므로 오디오 또는 PDF 임베딩이 필요한 경우 Gemini가 유일한 옵션입니다.</p>
<p><strong>질문: 이러한 임베딩 모델을 Milvus에서 바로 사용할 수 있나요?</strong></p>
<p>예. 이러한 모든 모델은 표준 플로트 벡터를 출력하며, 이를 <a href="https://milvus.io/docs/insert-update-delete.md">Milvus에 삽입하고</a> <a href="https://zilliz.com/glossary/cosine-similarity">코사인 유사도</a>, L2 거리 또는 내적 곱으로 검색할 수 있습니다. <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus는</a> 모든 임베딩 모델과 함께 작동합니다. 모델의 SDK로 벡터를 생성한 다음 Milvus에 저장하고 검색하면 됩니다. MRL로 잘린 벡터의 경우 <a href="https://milvus.io/docs/manage-collections.md">컬렉션을 만들</a> 때 컬렉션의 차원을 대상(예: 256)으로 설정하기만 하면 됩니다.</p>
