---
id: what-is-vector-database-and-how-it-works.md
title: '벡터 데이터베이스란 정확히 무엇이며, 어떻게 작동하나요?'
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: '벡터 데이터베이스는 머신러닝 모델이 생성한 벡터 임베딩을 저장, 인덱싱, 검색하여 빠른 정보 검색과 유사성 검색을 지원합니다.'
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>벡터 데이터베이스는 빠른 검색과 유사도 검색을 위해 벡터 임베딩을 인덱싱하고 저장하며, AI 애플리케이션을 위해 특별히 설계된 CRUD 연산, 메타데이터 필터링, 수평적 확장과 같은 기능을 제공합니다.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">서론: AI 시대의 벡터 데이터베이스 부상<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>ImageNet 초창기에는 25,000명의 인간 큐레이터가 데이터셋을 수동으로 라벨링해야 했습니다. 이 놀라운 숫자는 AI의 근본적인 과제를 보여줍니다. 비정형 데이터를 수동으로 분류하는 것은 확장이 불가능하다는 것입니다. 매일 수십억 개의 이미지, 비디오, 문서, 오디오 파일이 생성되면서 컴퓨터가 콘텐츠를 이해하고 상호작용하는 방식에 패러다임 전환이 필요해졌습니다.</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">기존 관계형 데이터베이스</a> 시스템은 사전 정의된 형식의 정형 데이터를 관리하고 정밀한 검색 연산을 수행하는 데 탁월합니다. 반면, 벡터 데이터베이스는 벡터 임베딩으로 알려진 고차원 수치 표현을 통해 이미지, 오디오, 비디오, 텍스트 콘텐츠와 같은 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터</a> 유형을 저장하고 검색하는 데 특화되어 있습니다. 벡터 데이터베이스는 효율적인 데이터 검색과 관리를 제공하여 <a href="https://zilliz.com/glossary/large-language-models-(llms)">대규모 언어 모델</a>을 지원합니다. 최신 벡터 데이터베이스는 하드웨어 인지 최적화(AVX512, SIMD, GPU, NVMe SSD), 고도로 최적화된 검색 알고리즘(HNSW, IVF, DiskANN), 그리고 컬럼 지향 스토리지 설계를 통해 기존 시스템보다 2-10배 뛰어난 성능을 제공합니다. 클라우드 네이티브 분리 아키텍처를 통해 검색, 데이터 삽입, 인덱싱 구성 요소를 독립적으로 확장할 수 있어 Salesforce, PayPal, eBay, NVIDIA와 같은 기업의 AI 애플리케이션에서 수십억 개의 벡터를 효율적으로 처리하면서 성능을 유지할 수 있습니다.</p>
<p>이것은 전문가들이 "시맨틱 갭(semantic gap)"이라고 부르는 것을 나타냅니다. 기존 데이터베이스는 정확한 일치와 사전 정의된 관계로 작동하는 반면, 인간의 콘텐츠 이해는 미묘하고, 맥락적이며, 다차원적입니다. AI 애플리케이션이 다음을 요구함에 따라 이 격차는 점점 더 문제가 되고 있습니다:</p>
<ul>
<li><p>정확한 일치보다 개념적 유사성 찾기</p></li>
<li><p>서로 다른 콘텐츠 조각 간의 맥락적 관계 이해</p></li>
<li><p>키워드를 넘어선 정보의 의미적 본질 포착</p></li>
<li><p>통합된 프레임워크 내에서 멀티모달 데이터 처리</p></li>
</ul>
<p>벡터 데이터베이스는 이 격차를 해소하는 핵심 기술로 부상하여 현대 AI 인프라의 필수 구성 요소가 되었습니다. 클러스터링 및 분류와 같은 작업을 용이하게 함으로써 머신러닝 모델의 성능을 향상시킵니다.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">벡터 임베딩 이해: 기초<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩</a>은 시맨틱 갭을 가로지르는 중요한 다리 역할을 합니다. 이러한 고차원 수치 표현은 컴퓨터가 효율적으로 처리할 수 있는 형태로 비정형 데이터의 의미적 본질을 포착합니다. 최신 임베딩 모델은 텍스트, 이미지, 오디오 등 원시 콘텐츠를 표면적 차이와 무관하게 벡터 공간에서 유사한 개념이 서로 가깝게 모이는 밀집 벡터로 변환합니다.</p>
<p>예를 들어, 제대로 구축된 임베딩은 "automobile", "car", "vehicle"과 같은 개념을 서로 다른 어휘 형태를 가짐에도 불구하고 벡터 공간 내에서 근접하게 배치합니다. 이러한 속성은 <a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색</a>, <a href="https://zilliz.com/vector-database-use-cases/recommender-system">추천 시스템</a>, 그리고 AI 애플리케이션이 단순한 패턴 매칭을 넘어 콘텐츠를 이해할 수 있게 해줍니다.</p>
<p>임베딩의 힘은 다양한 양식(modality)에 걸쳐 확장됩니다. 고급 벡터 데이터베이스는 통합 시스템에서 텍스트, 이미지, 오디오 등 다양한 비정형 데이터 유형을 지원하여 이전에는 효율적으로 모델링할 수 없었던 교차 양식 검색과 관계를 가능하게 합니다. 이러한 벡터 데이터베이스 기능은 챗봇 및 이미지 인식 시스템과 같은 AI 기반 기술에 중요하며, 시맨틱 검색 및 추천 시스템과 같은 고급 애플리케이션을 지원합니다.</p>
<p>그러나 대규모로 임베딩을 저장, 인덱싱 및 검색하는 것은 기존 데이터베이스가 해결하도록 설계되지 않은 고유한 계산 문제를 제시합니다.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">벡터 데이터베이스: 핵심 개념<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 비정형 데이터를 저장하고 쿼리하는 방식에 있어 패러다임 전환을 나타냅니다. 사전 정의된 형식의 정형 데이터를 관리하는 데 탁월한 기존 관계형 데이터베이스 시스템과 달리, 벡터 데이터베이스는 수치 벡터 표현을 통해 비정형 데이터를 처리하는 데 특화되어 있습니다.</p>
<p>핵심적으로, 벡터 데이터베이스는 근본적인 문제를 해결하도록 설계되었습니다: 대규모 비정형 데이터 세트에서 효율적인 유사도 검색을 가능하게 하는 것입니다. 이들은 세 가지 핵심 구성 요소를 통해 이를 달성합니다:</p>
<p><strong>벡터 임베딩</strong>: 비정형 데이터(텍스트, 이미지, 오디오 등)의 의미적 의미를 포착하는 고차원 수치 표현</p>
<p><strong>전문화된 인덱싱</strong>: 고차원 벡터 공간에 최적화된 알고리즘으로 빠른 근사 검색을 가능하게 합니다. 벡터 데이터베이스는 유사도 검색의 속도와 효율성을 향상시키기 위해 벡터를 인덱싱하며, 다양한 ML 알고리즘을 활용하여 벡터 임베딩에 대한 인덱스를 생성합니다.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>거리 측정법</strong></a>: 벡터 간의 유사성을 정량화하는 수학적 함수</p>
<p>벡터 데이터베이스의 기본 연산은 주어진 쿼리 벡터와 가장 유사한 k개의 벡터를 찾는 <a href="https://illiz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-최근접 이웃</a>(KNN) 쿼리입니다. 대규모 애플리케이션의 경우, 이러한 데이터베이스는 일반적으로 <a href="https://zilliz.com/glossary/anns">근사 최근접 이웃</a>(ANN) 알고리즘을 구현하여 약간의 정확도를 희생하는 대신 검색 속도를 크게 향상시킵니다.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">벡터 유사성의 수학적 기초</h3><p>벡터 데이터베이스를 이해하려면 벡터 유사성 뒤에 있는 수학적 원리를 파악해야 합니다. 기본 개념은 다음과 같습니다:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">벡터 공간과 임베딩</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">벡터 임베딩</a>은 비정형 데이터를 수치 형식으로 나타내는 고정 길이의 부동 소수점 배열입니다(100~32,768 차원까지 가능!). 이러한 임베딩은 고차원 벡터 공간에서 유사한 항목을 더 가깝게 배치합니다.</p>
<p>예를 들어, "king"과 "queen"이라는 단어는 잘 훈련된 단어 임베딩 공간에서 "automobile"보다 서로 더 가까운 벡터 표현을 가집니다.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">거리 측정법</h3><p>거리 측정법의 선택은 유사성이 계산되는 방식에 근본적으로 영향을 미칩니다. 일반적인 거리 측정법은 다음과 같습니다:</p>
<ol>
<li><p><strong>유클리드 거리</strong>: 유클리드 공간에서 두 점 사이의 직선 거리입니다.</p></li>
<li><p><strong>코사인 유사도</strong>: 두 벡터 사이의 각도의 코사인을 측정하며, 크기보다는 방향에 초점을 맞춥니다.</p></li>
<li><p><strong>내적(Dot Product)</strong>: 정규화된 벡터의 경우, 두 벡터가 얼마나 정렬되어 있는지를 나타냅니다.</p></li>
<li><p><strong>맨해튼 거리(L1 노름)</strong>: 좌표 간 절대 차이의 합입니다.</p></li>
</ol>
<p>사용 사례에 따라 다른 거리 측정법이 필요할 수 있습니다. 예를 들어, 코사인 유사도는 텍스트 임베딩에 종종 잘 작동하는 반면, 유클리드 거리는 특정 유형의 <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">이미지 임베딩</a>에 더 적합할 수 있습니다.</p>
<p>벡터 공간에서 벡터 간의 <a href="https://zilliz.com/glossary/semantic-similarity">시맨틱 유사성</a></p>
<p>
  <span class="img-wrapper">
    <img translate
