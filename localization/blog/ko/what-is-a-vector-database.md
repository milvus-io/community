---
id: what-is-vector-database-and-how-it-works.md
title: 벡터 데이터베이스란 정확히 무엇이며 어떻게 작동하나요?
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: '벡터 데이터베이스는 빠른 정보 검색과 유사도 검색을 위해 머신러닝 모델에 의해 생성된 벡터 임베딩을 저장, 색인, 검색합니다.'
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>벡터 데이터베이스는 빠른 검색과 유사도 검색을 위해 벡터 임베딩을 색인하고 저장하며, AI 애플리케이션을 위해 특별히 설계된 CRUD 작업, 메타데이터 필터링, 수평적 확장 등의 기능을 갖추고 있습니다.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">소개 소개: AI 시대의 벡터 데이터베이스의 부상<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>ImageNet 초창기에는 데이터 세트에 수동으로 라벨을 붙이는 데 25,000명의 인간 큐레이터가 필요했습니다. 이 엄청난 숫자는 비정형 데이터를 수동으로 분류하는 것은 확장할 수 없다는 AI의 근본적인 과제를 잘 보여줍니다. 매일 수십억 개의 이미지, 동영상, 문서, 오디오 파일이 생성되면서 컴퓨터가 콘텐츠를 이해하고 상호 작용하는 방식에 대한 패러다임의 전환이 필요했습니다.</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">기존의 관계형 데이터베이스</a> 시스템은 미리 정의된 형식의 정형 데이터를 관리하고 정밀한 검색 작업을 실행하는 데 탁월합니다. 반면, 벡터 데이터베이스는 벡터 임베딩이라는 고차원적인 숫자 표현을 통해 이미지, 오디오, 비디오, 텍스트 콘텐츠와 같은 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터 </a>유형을 저장하고 검색하는 데 특화되어 있습니다. 벡터 데이터베이스는 효율적인 데이터 검색 및 관리를 제공하여 <a href="https://zilliz.com/glossary/large-language-models-(llms)">대규모 언어 모델을</a> 지원합니다. 최신 벡터 데이터베이스는 하드웨어 인식 최적화(AVX512, SIMD, GPU, NVMe SSD), 고도로 최적화된 검색 알고리즘(HNSW, IVF, DiskANN), 열 중심의 스토리지 설계를 통해 기존 시스템보다 2~10배 뛰어난 성능을 발휘합니다. 클라우드 네이티브의 분리형 아키텍처를 통해 검색, 데이터 삽입, 인덱싱 구성 요소를 독립적으로 확장할 수 있어 Salesforce, PayPal, eBay, NVIDIA와 같은 기업의 엔터프라이즈 AI 애플리케이션의 성능을 유지하면서 수십억 개의 벡터를 효율적으로 처리할 수 있는 시스템입니다.</p>
<p>기존 데이터베이스는 정확한 일치와 사전 정의된 관계를 기반으로 작동하는 반면, 콘텐츠에 대한 인간의 이해는 미묘하고 맥락적이며 다차원적이기 때문에 전문가들은 이를 '시맨틱 갭'이라고 부릅니다. 이러한 격차는 AI 애플리케이션의 수요에 따라 점점 더 문제가 되고 있습니다:</p>
<ul>
<li><p>정확한 일치보다는 개념적 유사성 찾기</p></li>
<li><p>서로 다른 콘텐츠 간의 문맥적 관계 이해</p></li>
<li><p>키워드를 넘어 정보의 의미론적 본질 파악하기</p></li>
<li><p>통합된 프레임워크 내에서 멀티모달 데이터 처리</p></li>
</ul>
<p>벡터 데이터베이스는 이러한 격차를 해소하는 핵심 기술로 부상하여 최신 AI 인프라의 필수 구성 요소로 자리 잡았습니다. 클러스터링 및 분류와 같은 작업을 용이하게 함으로써 머신 러닝 모델의 성능을 향상시킵니다.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">벡터 임베딩 이해하기: 기초<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩은</a> 시맨틱 갭을 가로지르는 중요한 다리 역할을 합니다. 이러한 고차원적인 수치 표현은 컴퓨터가 효율적으로 처리할 수 있는 형태로 비정형 데이터의 의미적 본질을 포착합니다. 최신 임베딩 모델은 텍스트, 이미지, 오디오 등 원시 콘텐츠를 표면 수준의 차이에 관계없이 유사한 개념이 벡터 공간에서 함께 클러스터링되는 고밀도 벡터로 변환합니다.</p>
<p>예를 들어, 적절하게 구성된 임베딩은 어휘 형태가 다르더라도 '자동차', '자동차', '차량'과 같은 개념을 벡터 공간 내에서 근접하게 배치합니다. 이 속성을 통해 <a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색</a>, <a href="https://zilliz.com/vector-database-use-cases/recommender-system">추천 시스템</a>, AI 애플리케이션은 단순한 패턴 매칭을 넘어 콘텐츠를 이해할 수 있습니다.</p>
<p>임베딩의 힘은 여러 모달리티에 걸쳐 확장됩니다. 고급 벡터 데이터베이스는 통합 시스템에서 텍스트, 이미지, 오디오 등 다양한 비정형 데이터 유형을 지원하여 이전에는 효율적으로 모델링할 수 없었던 크로스 모달 검색과 관계를 가능하게 합니다. 이러한 벡터 데이터베이스 기능은 챗봇이나 이미지 인식 시스템과 같은 AI 기반 기술에 매우 중요하며, 시맨틱 검색 및 추천 시스템과 같은 고급 애플리케이션을 지원합니다.</p>
<p>하지만 임베딩을 대규모로 저장, 색인화, 검색하는 데는 기존 데이터베이스가 해결하지 못했던 고유한 계산 문제가 발생합니다.</p>
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
    </button></h2><p>벡터 데이터베이스는 비정형 데이터를 저장하고 쿼리하는 방식에 있어 패러다임의 전환을 의미합니다. 미리 정의된 형식의 정형 데이터를 관리하는 데 탁월한 기존의 관계형 데이터베이스 시스템과 달리, 벡터 데이터베이스는 숫자 벡터 표현을 통해 비정형 데이터를 처리하는 데 특화되어 있습니다.</p>
<p>벡터 데이터베이스의 핵심은 방대한 비정형 데이터 데이터 세트에서 효율적인 유사성 검색을 가능하게 하는 근본적인 문제를 해결하도록 설계되었습니다. 벡터 데이터베이스는 세 가지 핵심 구성 요소를 통해 이를 달성합니다:</p>
<p><strong>벡터 임베딩</strong>: 비정형 데이터(텍스트, 이미지, 오디오 등)의 의미론적 의미를 포착하는 고차원 숫자 표현.</p>
<p><strong>전문화된 인덱싱</strong>: 고차원 벡터 공간에 최적화된 알고리즘으로 빠른 근사치 검색을 가능하게 합니다. 벡터 데이터베이스는 벡터를 색인화하여 유사도 검색의 속도와 효율성을 높이고, 다양한 머신 러닝 알고리즘을 활용해 벡터 임베딩에 대한 색인을 생성합니다.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>거리 메트릭</strong></a>: 벡터 간의 유사성을 정량화하는 수학적 함수</p>
<p>벡터 데이터베이스의 주요 작업은 주어진 쿼리 벡터와 가장 유사한 k개의 벡터를 찾는 <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-근접 이웃</a> (KNN) 쿼리입니다. 대규모 애플리케이션의 경우, 이러한 데이터베이스는 일반적으로 <a href="https://zilliz.com/glossary/anns">근사 최인접 이웃</a> (ANN) 알고리즘을 구현하여 검색 속도의 상당한 향상을 위해 약간의 정확도를 희생합니다.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">벡터 유사성의 수학적 기초</h3><p>벡터 데이터베이스를 이해하려면 벡터 유사성의 수학적 원리를 파악해야 합니다. 다음은 기본 개념입니다:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">벡터 공간과 임베딩</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">벡터 임베딩은</a> 비정형 데이터를 숫자 형식으로 나타내는 고정 길이의 부동 소수점 숫자 배열(100~32,768 차원까지 가능!)입니다. 이러한 임베딩은 고차원 벡터 공간에서 유사한 항목을 서로 가깝게 배치합니다.</p>
<p>예를 들어, '왕'과 '여왕'이라는 단어는 잘 훈련된 단어 임베딩 공간에서 '자동차'보다 서로에 더 가까운 벡터 표현을 갖게 됩니다.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">거리 메트릭</h3><p>거리 메트릭의 선택은 유사도 계산 방식에 근본적인 영향을 미칩니다. 일반적인 거리 메트릭은 다음과 같습니다:</p>
<ol>
<li><p><strong>유클리드 거리</strong>: 유클리드 거리: 유클리드 공간에서 두 점 사이의 직선 거리입니다.</p></li>
<li><p><strong>코사인 유사도</strong>: 크기보다는 방향에 중점을 두고 두 벡터 사이의 각도의 코사인을 측정합니다.</p></li>
<li><p><strong>도트 곱</strong>: 정규화된 벡터의 경우, 두 벡터가 얼마나 정렬되어 있는지 나타냅니다.</p></li>
<li><p><strong>맨해튼 거리(L1 노름)</strong>: 좌표 간의 절대적인 차이의 합입니다.</p></li>
</ol>
<p>사용 사례마다 다른 거리 메트릭이 필요할 수 있습니다. 예를 들어, 코사인 유사도는 텍스트 임베딩에 적합한 반면, 유클리드 거리는 특정 유형의 <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">이미지 임베딩에</a> 더 적합할 수 있습니다.</p>
<p>벡터 공간에서 벡터 간의<a href="https://zilliz.com/glossary/semantic-similarity">의미적 유사성</a> </p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
   </span> <span class="img-wrapper"> <span>벡터 공간에서 벡터 간의 의미적 유사성</span> </span></p>
<p>이러한 수학적 기초를 이해하면 구현에 대한 중요한 질문으로 이어집니다: 데이터베이스에 벡터 인덱스를 추가하기만 하면 되겠죠?</p>
<p>단순히 관계형 데이터베이스에 벡터 인덱스를 추가하는 것만으로는 충분하지 않으며, 독립형 <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">벡터 인덱스 라이브러리를</a> 사용하는 것만으로는 충분하지도 않습니다. 벡터 인덱스는 유사한 벡터를 효율적으로 찾을 수 있는 중요한 기능을 제공하지만, 프로덕션 애플리케이션에 필요한 인프라가 부족합니다:</p>
<ul>
<li><p>벡터 데이터 관리를 위한 CRUD 작업을 제공하지 않습니다.</p></li>
<li><p>메타데이터 저장 및 필터링 기능이 부족합니다.</p></li>
<li><p>내장된 확장, 복제 또는 내결함성 기능을 제공하지 않습니다.</p></li>
<li><p>데이터 지속성 및 관리를 위한 맞춤형 인프라가 필요합니다.</p></li>
</ul>
<p>이러한 한계를 해결하기 위해 등장한 벡터 데이터베이스는 벡터 임베딩을 위해 특별히 설계된 완벽한 데이터 관리 기능을 제공합니다. 벡터 데이터베이스는 벡터 검색의 시맨틱 파워와 데이터베이스 시스템의 운영 기능을 결합한 것입니다.</p>
<p>정확히 일치하는 것을 기준으로 작동하는 기존 데이터베이스와 달리, 벡터 데이터베이스는 특정 거리 메트릭에 따라 쿼리 벡터와 '가장 유사한' 벡터를 찾는 시맨틱 검색에 중점을 둡니다. 이러한 근본적인 차이점이 이러한 특수 시스템을 구동하는 고유한 아키텍처와 알고리즘의 원동력입니다.</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">벡터 데이터베이스 아키텍처: 기술 프레임워크<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>최신 벡터 데이터베이스는 문제를 분리하고 확장성을 지원하며 유지보수성을 보장하는 정교한 다계층 아키텍처를 구현합니다. 이 기술 프레임워크는 단순한 검색 인덱스를 훨씬 뛰어넘어 프로덕션 AI 워크로드를 처리할 수 있는 시스템을 구축합니다. 벡터 데이터베이스는 AI 및 ML 애플리케이션을 위한 정보 처리 및 검색, 근사 근사 이웃 검색을 위한 알고리즘 활용, 다양한 유형의 원시 데이터를 벡터로 변환, 시맨틱 검색을 통해 다양한 데이터 유형을 효율적으로 관리하는 방식으로 작동합니다.</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">4계층 아키텍처</h3><p>프로덕션 벡터 데이터베이스는 일반적으로 네 가지 기본 아키텍처 계층으로 구성됩니다:</p>
<ol>
<li><p><strong>스토리지 레이어</strong>: 벡터 데이터와 메타데이터의 영구 저장소를 관리하고, 특수 인코딩 및 압축 전략을 구현하며, 벡터별 액세스를 위해 I/O 패턴을 최적화합니다.</p></li>
<li><p><strong>인덱스 레이어</strong>: 여러 인덱싱 알고리즘을 유지 관리하고, 생성 및 업데이트를 관리하며, 성능을 위한 하드웨어별 최적화를 구현합니다.</p></li>
<li><p><strong>쿼리 레이어</strong>: 들어오는 쿼리를 처리하고, 실행 전략을 결정하고, 결과 처리를 처리하고, 반복되는 쿼리에 대한 캐싱을 구현합니다.</p></li>
<li><p><strong>서비스 계층</strong>: 클라이언트 연결을 관리하고, 요청 라우팅을 처리하며, 모니터링 및 로깅을 제공하고, 보안 및 멀티테넌시를 구현합니다.</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">벡터 검색 워크플로</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
   </span> <span class="img-wrapper"> <span>벡터 검색 작업의 전체 워크플로.png</span> </span></p>
<p>일반적인 벡터 데이터베이스 구현은 이 워크플로우를 따릅니다:</p>
<ol>
<li><p>머신 러닝 모델이 비정형 데이터(텍스트, 이미지, 오디오)를 벡터 임베딩으로 변환합니다.</p></li>
<li><p>이러한 벡터 임베딩은 관련 메타데이터와 함께 데이터베이스에 저장됩니다.</p></li>
<li><p>사용자가 쿼리를 수행하면 <em>동일한</em> 모델을 사용하여 벡터 임베딩으로 변환됩니다.</p></li>
<li><p>데이터베이스는 대략적인 근사 이웃 알고리즘을 사용하여 쿼리 벡터를 저장된 벡터와 비교합니다.</p></li>
<li><p>시스템은 벡터 유사성을 기반으로 가장 관련성이 높은 상위 K개의 결과를 반환합니다.</p></li>
<li><p>선택적 후처리를 통해 추가 필터를 적용하거나 순위를 재조정할 수 있습니다.</p></li>
</ol>
<p>이 파이프라인은 기존 데이터베이스 접근 방식으로는 불가능했던 방대한 비정형 데이터 컬렉션에 대한 효율적인 의미론적 검색을 가능하게 합니다.</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">벡터 데이터베이스의 일관성</h4><p>분산된 벡터 데이터베이스에서 일관성을 보장하는 것은 성능과 정확성 사이의 절충으로 인해 어려운 과제입니다. 대규모 시스템에서는 이벤트 일관성이 일반적이지만, 사기 탐지 및 실시간 추천과 같은 미션 크리티컬 애플리케이션에는 강력한 일관성 모델이 필요합니다. 쿼럼 기반 쓰기 및 분산 합의(예: <a href="https://zilliz.com/learn/raft-or-not">Raft</a>, Paxos)와 같은 기술은 과도한 성능 저하 없이 데이터 무결성을 보장합니다.</p>
<p>프로덕션 구현에서는 스토리지와 컴퓨팅 분리를 특징으로 하는 공유 스토리지 아키텍처를 채택합니다. 이러한 분리는 데이터 플레인과 제어 플레인 분리 원칙을 따르며, 각 계층은 최적의 리소스 활용을 위해 독립적으로 확장할 수 있습니다.</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">연결, 보안 및 멀티테넌시 관리</h3><p>이러한 데이터베이스는 다중 사용자 및 다중 테넌트 환경에서 사용되므로 데이터 보안과 액세스 제어 관리는 기밀성을 유지하는 데 매우 중요합니다.</p>
<p>암호화와 같은 보안 조치(미사용 및 전송 중 모두)는 임베딩 및 메타데이터와 같은 민감한 데이터를 보호합니다. 인증 및 권한 부여를 통해 권한이 부여된 사용자만 시스템에 액세스할 수 있으며, 특정 데이터에 대한 액세스를 관리하기 위해 세분화된 권한을 부여할 수 있습니다.</p>
<p>액세스 제어는 데이터 액세스를 제한하는 역할과 권한을 정의합니다. 이는 고객 데이터나 독점 AI 모델과 같은 민감한 정보를 저장하는 데이터베이스에 특히 중요합니다.</p>
<p>멀티테넌시는 각 테넌트의 데이터를 격리하여 무단 액세스를 방지하는 동시에 리소스를 공유할 수 있도록 합니다. 이는 샤딩, 파티셔닝 또는 행 수준 보안을 통해 여러 팀이나 고객에 대한 확장 가능하고 안전한 액세스를 보장합니다.</p>
<p>외부 ID 및 액세스 관리(IAM) 시스템은 벡터 데이터베이스와 통합되어 보안 정책을 시행하고 업계 표준 준수를 보장합니다.</p>
<h2 id="Advantages-of-Vector-Databases" class="common-anchor-header">벡터 데이터베이스의 장점<button data-href="#Advantages-of-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 기존 데이터베이스에 비해 여러 가지 장점을 제공하므로 벡터 데이터를 처리하는 데 이상적인 선택입니다. 다음은 몇 가지 주요 이점입니다:</p>
<ol>
<li><p><strong>효율적인 유사도 검색</strong>: 벡터 데이터베이스의 두드러진 특징 중 하나는 효율적인 시맨틱 검색을 수행할 수 있다는 점입니다. 정확한 일치에 의존하는 기존 데이터베이스와 달리, 벡터 데이터베이스는 주어진 쿼리 벡터와 유사한 데이터 포인트를 찾는 데 탁월합니다. 이 기능은 사용자의 과거 상호 작용과 유사한 항목을 찾으면 사용자 경험을 크게 향상시킬 수 있는 추천 시스템과 같은 애플리케이션에 매우 중요합니다.</p></li>
<li><p><strong>고차원 데이터 처리</strong>: 벡터 데이터베이스는 고차원 데이터를 효율적으로 관리하도록 특별히 설계되었습니다. 따라서 데이터가 고차원 공간에 존재하는 경우가 많은 자연어 처리, <a href="https://zilliz.com/learn/what-is-computer-vision">컴퓨터 비전</a>, 유전체학 분야의 애플리케이션에 특히 적합합니다. 벡터 데이터베이스는 고급 인덱싱 및 검색 알고리즘을 활용하여 복잡한 벡터 임베딩 데이터 세트에서도 관련 데이터 포인트를 빠르게 검색할 수 있습니다.</p></li>
<li><p><strong>확장성</strong>: 확장성은 최신 AI 애플리케이션의 핵심 요건이며, 벡터 데이터베이스는 효율적으로 확장할 수 있도록 구축되었습니다. 수백만 개 또는 수십억 개의 벡터를 처리하든, 벡터 데이터베이스는 수평적 확장을 통해 AI 애플리케이션의 증가하는 수요를 처리할 수 있습니다. 따라서 데이터 볼륨이 증가하더라도 성능이 일관되게 유지됩니다.</p></li>
<li><p><strong>유연성</strong>: 벡터 데이터베이스는 데이터 표현 측면에서 놀라운 유연성을 제공합니다. 숫자 특징, 텍스트나 이미지의 임베딩, 분자 구조와 같은 복잡한 데이터 등 다양한 유형의 데이터를 저장하고 관리할 수 있습니다. 이러한 다용도성 덕분에 벡터 데이터베이스는 텍스트 분석부터 과학 연구에 이르기까지 다양한 분야에서 강력한 도구로 활용되고 있습니다.</p></li>
<li><p><strong>실시간 애플리케이션</strong>: 많은 벡터 데이터베이스는 실시간 또는 실시간에 가까운 쿼리에 최적화되어 있습니다. 이는 사기 탐지, 실시간 추천, 대화형 AI 시스템과 같이 빠른 응답이 필요한 애플리케이션에 특히 중요합니다. 신속한 유사도 검색 기능을 통해 이러한 애플리케이션은 시의적절하고 관련성 높은 결과를 제공할 수 있습니다.</p></li>
</ol>
<h2 id="Use-Cases-for-Vector-Databases" class="common-anchor-header">벡터 데이터베이스의 사용 사례<button data-href="#Use-Cases-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 다양한 산업 분야에서 폭넓게 활용되고 있으며, 그 다양성과 강력한 성능을 입증하고 있습니다. 다음은 몇 가지 주목할 만한 사용 사례입니다:</p>
<ol>
<li><p><strong>자연어 처리</strong>: 자연어 처리(NLP) 영역에서 벡터 데이터베이스는 중요한 역할을 합니다. 벡터 데이터베이스는 텍스트 분류, 감정 분석, 언어 번역과 같은 작업에 사용됩니다. 벡터 데이터베이스는 텍스트를 고차원 벡터 임베딩으로 변환함으로써 효율적인 유사도 검색과 의미 이해를 가능하게 하여 <a href="https://zilliz.com/learn/7-nlp-models">NLP 모델의</a> 성능을 향상시킵니다.</p></li>
<li><p><strong>컴퓨터 비전</strong>: 벡터 데이터베이스는 컴퓨터 비전 애플리케이션에서도 널리 사용됩니다. 이미지 인식, <a href="https://zilliz.com/learn/what-is-object-detection">물체 감지</a>, 이미지 분할과 같은 작업은 고차원 이미지 임베딩을 처리하는 벡터 데이터베이스의 기능을 활용할 수 있습니다. 이를 통해 시각적으로 유사한 이미지를 빠르고 정확하게 검색할 수 있으므로 벡터 데이터베이스는 자율 주행, 의료 영상, 디지털 자산 관리와 같은 분야에서 없어서는 안 될 필수 요소입니다.</p></li>
<li><p><strong>유전체학</strong>: 유전체학에서 벡터 데이터베이스는 유전자 서열, 단백질 구조 및 기타 분자 데이터를 저장하고 분석하는 데 사용됩니다. 이 데이터의 고차원적 특성으로 인해 벡터 데이터베이스는 대규모 게놈 데이터 세트를 관리하고 쿼리하는 데 이상적인 선택입니다. 연구자들은 벡터 검색을 통해 유사한 패턴을 가진 유전자 서열을 찾아내어 유전자 마커를 발견하고 복잡한 생물학적 과정을 이해하는 데 도움을 받을 수 있습니다.</p></li>
<li><p><strong>추천 시스템</strong>: 벡터 데이터베이스는 최신 추천 시스템의 초석입니다. 이러한 데이터베이스는 사용자 상호 작용과 항목의 특징을 벡터 임베딩으로 저장함으로써 사용자가 이전에 상호 작용한 항목과 유사한 항목을 빠르게 식별할 수 있습니다. 이 기능은 추천의 정확성과 관련성을 높여 사용자 만족도와 참여도를 향상시킵니다.</p></li>
<li><p><strong>챗봇 및 가상 비서</strong>: 벡터 데이터베이스는 챗봇과 가상 어시스턴트에서 사용자 쿼리에 대한 실시간 컨텍스트 답변을 제공하는 데 사용됩니다. 이러한 시스템은 사용자 입력을 벡터 임베딩으로 변환하여 유사성 검색을 수행하여 가장 관련성이 높은 응답을 찾을 수 있습니다. 이를 통해 챗봇과 가상 비서가 보다 정확하고 상황에 적합한 답변을 제공함으로써 전반적인 사용자 경험을 향상시킬 수 있습니다.</p></li>
</ol>
<p>다양한 산업 분야의 조직은 벡터 데이터베이스의 고유한 기능을 활용하여 보다 지능적이고 반응성이 뛰어나며 확장 가능한 AI 애플리케이션을 구축할 수 있습니다.</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">벡터 검색 알고리즘: 이론에서 실제까지<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 고차원 공간에서 효율적인 유사도 검색을 가능하게 하기 위해 특화된 인덱싱 <a href="https://zilliz.com/learn/vector-index">알고리즘이</a> 필요합니다. 알고리즘 선택은 정확도, 속도, 메모리 사용량, 확장성에 직접적인 영향을 미칩니다.</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">그래프 기반 접근 방식</h3><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>계층적 탐색 가능한 작은 세계</strong></a><strong>(</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a>)<strong>는</strong> 유사한 벡터를 연결하여 탐색 가능한 구조를 만들어 검색 중에 효율적인 탐색을 가능하게 합니다. HNSW는 노드당 최대 연결 수와 검색 범위를 제한하여 성능과 정확도의 균형을 맞추기 때문에 벡터 유사성 검색에 가장 널리 사용되는 알고리즘 중 하나입니다.</p>
<p><strong>Cagra는</strong> GPU 가속에 특별히 최적화된 그래프 기반 인덱스입니다. GPU 처리 패턴에 맞춰 탐색 가능한 그래프 구조를 구성하여 대규모 병렬 벡터 비교를 가능하게 합니다. 그래프 정도와 검색 폭과 같은 구성 가능한 매개변수를 통해 리콜과 성능의 균형을 맞출 수 있다는 점이 Cagra를 특히 효과적으로 만드는 요소입니다. 특히 대규모 벡터 컬렉션의 경우, 고가의 트레이닝 등급 하드웨어보다 추론 등급 GPU를 사용하는 것이 비용 효율적이면서도 높은 처리량을 제공할 수 있습니다. 하지만, 쿼리량이 많지 않은 한, Cagra와 같은 GPU 인덱스가 CPU 인덱스에 비해 반드시 지연 시간을 단축하지는 않을 수도 있다는 점에 유의할 필요가 있습니다.</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">정량화 기법</h3><p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>제품 양자화(PQ)는</strong></a> 고차원 벡터를 더 작은 서브벡터로 분해하여 각각을 개별적으로 양자화합니다. 이렇게 하면 스토리지 요구량이 크게 줄어들지만(보통 90% 이상) 정확도 손실이 발생합니다.</p>
<p><strong>스칼라 양자화(SQ)는</strong> 32비트 부동 소수점을 8비트 정수로 변환하여 정확도에 미치는 영향은 최소화하면서 메모리 사용량을 75%까지 줄여줍니다.</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">온디스크 인덱싱: 비용 효율적인 확장</h3><p>대규모 벡터 컬렉션(1억 개 이상의 벡터)의 경우, 인메모리 인덱스는 엄청나게 비쌉니다. 예를 들어, 1024차원 벡터 1억 개에는 약 400GB의 RAM이 필요합니다. 바로 이 점에서 DiskANN과 같은 온디스크 인덱싱 알고리즘이 상당한 비용 이점을 제공합니다.</p>
<p>Vamana 그래프 알고리즘을 기반으로 하는<a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN은</a> 대부분의 인덱스를 RAM이 아닌 NVMe SSD에 저장하면서 효율적인 벡터 검색을 가능하게 합니다. 이 접근 방식은 몇 가지 비용 이점을 제공합니다:</p>
<ul>
<li><p><strong>하드웨어 비용 절감</strong>: 조직은 적당한 RAM 구성의 상용 하드웨어를 사용해 대규모로 벡터 검색을 배포할 수 있습니다.</p></li>
<li><p><strong>운영 비용 절감</strong>: RAM이 적을수록 데이터센터의 전력 소비와 냉각 비용이 줄어듭니다.</p></li>
<li><p><strong>선형적인 비용 확장</strong>: 메모리 비용은 데이터 볼륨에 따라 선형적으로 확장되는 반면, 성능은 상대적으로 안정적으로 유지됩니다.</p></li>
<li><p><strong>최적화된 I/O 패턴</strong>: DiskANN의 특화된 설계는 신중한 그래프 탐색 전략을 통해 디스크 읽기를 최소화합니다.</p></li>
</ul>
<p>일반적으로 순수 인메모리 접근 방식에 비해 쿼리 지연 시간이 약간 증가(보통 2~3ms)하는 것이 트레이드 오프이며, 이는 많은 프로덕션 사용 사례에서 허용되는 수준입니다.</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">특수 인덱스 유형</h3><p><strong>이진 임베딩 인덱스는</strong> 데이터를 이진 피처로 표현할 수 있는 컴퓨터 비전, 이미지 핑거프린팅, 추천 시스템에 특화되어 있습니다. 이러한 인덱스는 다양한 애플리케이션 요구 사항을 충족합니다. 정확한 매칭이 중요한 이미지 중복 제거, 디지털 워터마킹, 저작권 감지의 경우, 최적화된 바이너리 인덱스는 정확한 유사성 감지를 제공합니다. 처리량이 많은 추천 시스템, 콘텐츠 기반 이미지 검색, 완벽한 리콜보다 속도가 우선시되는 대규모 특징 매칭의 경우, 바이너리 인덱스는 탁월한 성능 이점을 제공합니다.</p>
<p><strong>스파스 벡터 인덱스는</strong> 대부분의 요소가 0이고 0이 아닌 값이 몇 개만 있는 벡터에 최적화되어 있습니다. 대부분의 또는 모든 차원이 의미 있는 값을 포함하는 고밀도 벡터와 달리, 스파스 벡터는 차원은 많지만 활성 기능이 거의 없는 데이터를 효율적으로 표현합니다. 이 표현은 문서가 어휘에서 가능한 모든 단어 중 일부만 사용할 수 있는 텍스트 처리에서 특히 일반적입니다. 스파스 벡터 인덱스는 시맨틱 문서 검색, 전체 텍스트 쿼리, 토픽 모델링과 같은 자연어 처리 작업에서 탁월한 성능을 발휘합니다. 이러한 인덱스는 특히 대규모 문서 컬렉션에 대한 엔터프라이즈 검색, 특정 용어와 개념을 효율적으로 찾아야 하는 법률 문서 검색, 전문 용어가 포함된 수백만 개의 논문을 색인하는 학술 연구 플랫폼에 유용합니다.</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">고급 쿼리 기능<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스의 핵심은 효율적인 의미론적 검색을 수행할 수 있는 능력에 있습니다. 벡터 검색 기능은 기본적인 유사도 매칭부터 관련성과 다양성을 개선하기 위한 고급 기법까지 다양합니다.</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">기본 ANN 검색</h3><p>근사 최인접 이웃(ANN) 검색은 벡터 데이터베이스의 기본 검색 방법입니다. 쿼리 벡터를 데이터베이스의 모든 벡터와 비교하는 정확한 kNN(k-Nearest Neighbors) 검색과 달리, ANN 검색은 색인 구조를 사용하여 가장 유사할 가능성이 높은 벡터의 하위 집합을 빠르게 식별하여 성능을 크게 향상시킵니다.</p>
<p>ANN 검색의 주요 구성 요소는 다음과 같습니다:</p>
<ul>
<li><p><strong>쿼리 벡터</strong>: 검색 중인 내용을 벡터로 표현한 것</p></li>
<li><p><strong>색인 구조</strong>: 효율적인 검색을 위해 벡터를 구성하는 사전 구축된 데이터 구조</p></li>
<li><p><strong>메트릭 유형</strong>: 벡터 간의 유사성을 측정하는 유클리드(L2), 코사인 또는 내적 곱과 같은 수학 함수</p></li>
<li><p><strong>Top-K 결과</strong>: 반환할 가장 유사한 벡터의 지정된 개수</p></li>
</ul>
<p>벡터 데이터베이스는 검색 효율성을 높이기 위한 최적화 기능을 제공합니다:</p>
<ul>
<li><p><strong>대량 벡터 검색</strong>: 여러 쿼리 벡터를 병렬로 사용하여 검색</p></li>
<li><p><strong>파티션 검색</strong>: 특정 데이터 파티션으로 검색 제한</p></li>
<li><p><strong>페이지 매김</strong>: 페이지 매김: 큰 결과 집합을 검색하기 위해 제한 및 오프셋 매개변수 사용</p></li>
<li><p><strong>출력 필드 선택</strong>: 결과와 함께 반환되는 엔티티 필드 제어하기</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">고급 검색 기법</h3><h4 id="Range-Search" class="common-anchor-header">범위 검색</h4><p>범위 검색은 유사도 점수가 특정 범위 내에 속하는 벡터로 결과를 제한하여 결과 관련성을 향상시킵니다. 가장 유사한 상위 K개의 벡터를 반환하는 표준 ANN 검색과 달리, 범위 검색은 '환형 영역'을 사용하여 정의합니다:</p>
<ul>
<li><p>최대 허용 거리를 설정하는 외부 경계(반경)</p></li>
<li><p>너무 유사한 벡터를 제외할 수 있는 내부 경계(범위_필터)</p></li>
</ul>
<p>이 접근 방식은 사용자가 이미 본 것과 정확히 중복되지는 않지만 관련성이 있는 제품 추천과 같이 '유사하지만 동일하지는 않은' 항목을 찾고자 할 때 특히 유용합니다.</p>
<h4 id="Filtered-Search" class="common-anchor-header">필터 검색</h4><p>필터링된 검색은 벡터 유사성과 메타데이터 제약 조건을 결합하여 특정 기준과 일치하는 벡터로 결과 범위를 좁힙니다. 예를 들어, 제품 카탈로그에서 시각적으로 유사한 항목을 찾되 결과를 특정 브랜드 또는 가격대로 제한할 수 있습니다.</p>
<p>확장성이 뛰어난 벡터 데이터베이스는 두 가지 필터링 방식을 지원합니다:</p>
<ul>
<li><p><strong>표준 필터링</strong>: 벡터 검색 전에 메타데이터 필터를 적용하여 후보 풀을 크게 줄입니다.</p></li>
<li><p><strong>반복 필터링</strong>: 벡터 검색을 먼저 수행한 다음, 원하는 수의 일치 항목에 도달할 때까지 각 결과에 필터를 적용합니다.</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">텍스트 일치</h4><p>텍스트 일치는 정확한 텍스트 일치 기능으로 벡터 유사도 검색을 보완하여 특정 용어를 기반으로 정확한 문서 검색을 가능하게 합니다. 개념적으로 유사한 콘텐츠를 찾는 시맨틱 검색과 달리, 텍스트 일치는 쿼리 용어의 정확한 표현을 찾는 데 중점을 둡니다.</p>
<p>예를 들어, 제품 검색에서 '방수'를 명시적으로 언급하는 제품을 찾기 위한 텍스트 검색과 시각적으로 유사한 제품을 찾기 위한 벡터 유사도를 결합하여 의미적 관련성과 특정 기능 요구 사항을 모두 충족할 수 있습니다.</p>
<h4 id="Grouping-Search" class="common-anchor-header">그룹 검색</h4><p>그룹 검색은 지정된 필드별로 결과를 집계하여 결과의 다양성을 향상시킵니다. 예를 들어, 각 단락이 별도의 벡터인 문서 컬렉션에서 그룹화를 사용하면 동일한 문서의 여러 단락이 아닌 서로 다른 문서에서 결과를 얻을 수 있습니다.</p>
<p>이 기술은 다음과 같은 경우에 유용합니다:</p>
<ul>
<li><p>다양한 소스의 표현을 원하는 문서 검색 시스템</p></li>
<li><p>다양한 옵션을 제시해야 하는 추천 시스템</p></li>
<li><p>유사성만큼이나 결과의 다양성이 중요한 검색 시스템</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">하이브리드 검색</h4><p>하이브리드 검색은 데이터의 서로 다른 측면을 나타내거나 서로 다른 임베딩 모델을 사용하는 여러 벡터 필드의 결과를 결합합니다. 이를 통해</p>
<ul>
<li><p><strong>희소 밀도 벡터 조합</strong>: 보다 포괄적인 텍스트 검색을 위해 의미 이해(고밀도 벡터)와 키워드 매칭(희소 벡터)을 결합합니다.</p></li>
<li><p><strong>멀티모달 검색</strong>: 이미지와 텍스트 입력을 모두 사용해 제품을 검색하는 등 다양한 데이터 유형에서 일치하는 항목 찾기</p></li>
</ul>
<p>하이브리드 검색 구현은 정교한 재랭크 전략을 사용해 결과를 결합합니다:</p>
<ul>
<li><p><strong>가중 순위</strong>: 특정 벡터 필드의 결과 우선 순위 지정</p></li>
<li><p><strong>상호 순위 융합</strong>: 특정 강조점 없이 모든 벡터 필드에 걸쳐 결과의 균형을 맞춥니다.</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">전체 텍스트 검색</h4><p>최신 벡터 데이터베이스의 전체 텍스트 검색 기능은 기존 텍스트 검색과 벡터 유사성 사이의 간극을 메워줍니다. 이러한 시스템</p>
<ul>
<li><p>원시 텍스트 쿼리를 스파스 임베딩으로 자동 변환</p></li>
<li><p>특정 용어 또는 구문이 포함된 문서 검색</p></li>
<li><p>용어 관련성과 의미적 유사성 모두를 기준으로 결과 순위 지정</p></li>
<li><p>시맨틱 검색이 놓칠 수 있는 정확한 일치를 포착하여 벡터 검색을 보완합니다.</p></li>
</ul>
<p>이 하이브리드 접근 방식은 정확한 용어 매칭과 의미론적 이해가 모두 필요한 종합적인 <a href="https://zilliz.com/learn/what-is-information-retrieval">정보 검색</a> 시스템에 특히 유용합니다.</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">성능 엔지니어링: 중요한 메트릭<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스의 성능 최적화를 위해서는 주요 메트릭과 그 장단점을 이해해야 합니다.</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">리콜-처리량 트레이드오프</h3><p>리콜은 반환된 결과 중에서 발견된 실제 가장 가까운 이웃의 비율을 측정합니다. 회상률이 높을수록 더 광범위한 검색이 필요하므로 처리량(초당 쿼리 수)이 감소합니다. 프로덕션 시스템은 애플리케이션 요구 사항에 따라 이러한 메트릭의 균형을 맞추며, 일반적으로 사용 사례에 따라 80~99%의 회수율을 목표로 합니다.</p>
<p>벡터 데이터베이스 성능을 평가할 때, ANN-Benchmarks와 같은 표준화된 벤치마킹 환경은 귀중한 비교 데이터를 제공합니다. 이러한 도구는 다음과 같은 중요한 메트릭을 측정합니다:</p>
<ul>
<li><p>검색 리콜: 반환된 결과 중 실제 가장 가까운 이웃을 찾은 쿼리의 비율</p></li>
<li><p>초당 쿼리 수(QPS): 데이터베이스가 표준화된 조건에서 쿼리를 처리하는 속도</p></li>
<li><p>다양한 데이터 세트 크기 및 차원에서의 성능</p></li>
</ul>
<p>대안으로 <a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench라는</a> 오픈 소스 벤치마크 시스템이 있습니다. VDB Bench는 자체 데이터 세트를 사용하여 Milvus 및 Zilliz Cloud와 같은 주요 벡터 데이터베이스의 성능을 평가하고 비교하도록 설계된 <a href="https://github.com/zilliztech/VectorDBBench">오픈 소스 벤치마킹 도구입니다</a>. 또한 개발자가 자신의 사용 사례에 가장 적합한 벡터 데이터베이스를 선택할 수 있도록 도와줍니다.</p>
<p>이러한 벤치마크를 통해 조직은 정확성, 속도, 확장성 간의 균형을 고려하여 특정 요구사항에 가장 적합한 벡터 데이터베이스 구현을 식별할 수 있습니다.</p>
<h3 id="Memory-Management" class="common-anchor-header">메모리 관리</h3><p>효율적인 메모리 관리를 통해 벡터 데이터베이스는 성능을 유지하면서 수십억 개의 벡터로 확장할 수 있습니다:</p>
<ul>
<li><p><strong>동적 할당은</strong> 워크로드 특성에 따라 메모리 사용량을 조정합니다.</p></li>
<li><p><strong>캐싱 정책은</strong> 자주 액세스하는 벡터를 메모리에 유지합니다.</p></li>
<li><p><strong>벡터 압축 기술로</strong> 메모리 요구량 대폭 감소</p></li>
</ul>
<p>메모리 용량을 초과하는 데이터 세트의 경우 디스크 기반 솔루션이 중요한 기능을 제공합니다. 이러한 알고리즘은 빔 검색 및 그래프 기반 탐색과 같은 기술을 통해 NVMe SSD의 I/O 패턴을 최적화합니다.</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">고급 필터링 및 하이브리드 검색</h3><p>벡터 데이터베이스는 시맨틱 유사성과 기존 필터링을 결합하여 강력한 쿼리 기능을 제공합니다:</p>
<ul>
<li><p><strong>사전 필터링은</strong> 벡터 검색 전에 메타데이터 제약 조건을 적용하여 유사도 비교를 위한 후보 집합을 줄입니다.</p></li>
<li><p><strong>사후 필터링은</strong> 벡터 검색을 먼저 실행한 다음 결과에 필터를 적용합니다.</p></li>
<li><p><strong>메타데이터 인덱싱은</strong> 다양한 데이터 유형에 대한 전문화된 인덱스를 통해 필터링 성능을 향상시킵니다.</p></li>
</ul>
<p>고성능 벡터 데이터베이스는 여러 벡터 필드와 스칼라 제약 조건을 결합한 복잡한 쿼리 패턴을 지원합니다. 다중 벡터 쿼리는 여러 기준점과 유사한 엔티티를 동시에 찾는 반면, 음수 벡터 쿼리는 지정된 예와 유사한 벡터를 제외합니다.</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">프로덕션 환경에서 벡터 데이터베이스 확장<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 다양한 규모에서 최적의 성능을 보장하기 위해 신중한 배포 전략이 필요합니다:</p>
<ul>
<li><p><strong>소규모 배포</strong> (수백만 개의 벡터)는 충분한 메모리가 있는 단일 시스템에서 효과적으로 작동할 수 있습니다.</p></li>
<li><p><strong>중간 규모 배포</strong> (수천만에서 수억 개)는 고용량 메모리 인스턴스 및 SSD 스토리지를 통한 수직 확장의 이점을 누릴 수 있습니다.</p></li>
<li><p><strong>수십억 규모의 배포에는</strong> 전문화된 역할을 가진 여러 노드에 걸친 수평적 확장이 필요합니다.</p></li>
</ul>
<p>샤딩과 복제는 확장 가능한 벡터 데이터베이스 아키텍처의 기초를 형성합니다:</p>
<ul>
<li><p><strong>수평적 샤딩은</strong> 여러 노드에 걸쳐 컬렉션을 분할합니다.</p></li>
<li><p><strong>복제는</strong> 데이터의 중복 복사본을 생성하여 내결함성과 쿼리 처리량을 모두 개선합니다.</p></li>
</ul>
<p>최신 시스템은 쿼리 패턴과 안정성 요건에 따라 복제 요소를 동적으로 조정합니다.</p>
<h2 id="Real-World-Impact" class="common-anchor-header">실제 환경에서의 영향<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>고성능 벡터 데이터베이스의 유연성은 배포 옵션에서 분명하게 드러납니다. 프로토타이핑을 위한 노트북에 가볍게 설치하는 것부터 수백억 개의 벡터를 관리하는 대규모 분산 클러스터에 이르기까지 다양한 환경에서 시스템을 실행할 수 있습니다. 이러한 확장성 덕분에 조직은 데이터베이스 기술을 변경하지 않고도 개념에서 프로덕션으로 전환할 수 있습니다.</p>
<p>Salesforce, PayPal, eBay, NVIDIA, IBM, Airbnb와 같은 기업들은 이제 오픈 소스 <a href="https://milvus.io/">Milvus와</a> 같은 벡터 데이터베이스를 사용해 대규모 AI 애플리케이션을 구동하고 있습니다. 이러한 구현은 정교한 상품 추천 시스템부터 콘텐츠 조정, 사기 탐지, 고객 지원 자동화에 이르기까지 다양한 사용 사례에 걸쳐 있으며, 모두 벡터 검색을 기반으로 구축되었습니다.</p>
<p>최근 몇 년 동안, 벡터 데이터베이스는 도메인별 최신 데이터 또는 기밀 데이터를 제공함으로써 LLM에서 흔히 발생하는 환각 문제를 해결하는 데 필수적인 역할을 하게 되었습니다. 예를 들어 <a href="https://zilliz.com/cloud">질리즈 클라우드는</a> 특수 데이터를 벡터 임베딩으로 저장합니다. 사용자가 질문을 하면 쿼리를 벡터로 변환하고 가장 관련성이 높은 결과를 찾기 위해 ANN 검색을 수행한 다음, 이를 원래 질문과 결합하여 대규모 언어 모델에 대한 포괄적인 컨텍스트를 생성합니다. 이 프레임워크는 보다 정확하고 맥락에 맞는 응답을 생성하는 신뢰할 수 있는 LLM 기반 애플리케이션을 개발하기 위한 기반이 됩니다.</p>
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
    </button></h2><p>벡터 데이터베이스의 등장은 단순한 신기술이 아니라 AI 애플리케이션의 데이터 관리 방식에 대한 근본적인 변화를 의미합니다. 벡터 데이터베이스는 비정형 데이터와 계산 시스템 간의 격차를 해소함으로써 최신 AI 인프라의 필수 구성 요소가 되었으며, 점점 더 인간과 유사한 방식으로 정보를 이해하고 처리하는 애플리케이션을 가능하게 합니다.</p>
<p>기존 데이터베이스 시스템에 비해 벡터 데이터베이스의 주요 장점은 다음과 같습니다:</p>
<ul>
<li><p>고차원 검색: 머신 러닝 및 생성 AI 애플리케이션에 사용되는 고차원 벡터에서 효율적인 유사도 검색 가능</p></li>
<li><p>확장성: 대규모 벡터 컬렉션의 효율적인 저장과 검색을 위한 수평적 확장성</p></li>
<li><p>하이브리드 검색을 통한 유연성: 희소 및 고밀도 벡터를 포함한 다양한 벡터 데이터 유형 처리</p></li>
<li><p>성능: 기존 데이터베이스에 비해 훨씬 빠른 벡터 유사성 검색 속도</p></li>
<li><p>사용자 정의 가능한 인덱싱: 특정 사용 사례와 데이터 유형에 최적화된 사용자 정의 인덱싱 체계 지원</p></li>
</ul>
<p>AI 애플리케이션이 점점 더 정교해짐에 따라, 벡터 데이터베이스에 대한 요구도 계속 진화하고 있습니다. 최신 시스템은 성능, 정확성, 확장성, 비용 효율성 사이에서 균형을 유지하면서 더 광범위한 AI 에코시스템과 원활하게 통합되어야 합니다. 대규모로 AI를 구현하려는 조직에게 벡터 데이터베이스 기술을 이해하는 것은 단순한 기술적 고려 사항이 아니라 전략적 필수 요소입니다.</p>
