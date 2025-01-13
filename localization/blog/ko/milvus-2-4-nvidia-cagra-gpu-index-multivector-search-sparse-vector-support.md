---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: 'Milvus 2.4 공개: 다중 벡터 검색, 스파스 벡터, CAGRA 인덱스 등!'
author: Fendy Feng
date: 2024-3-20
desc: 대규모 데이터 세트에 대한 검색 기능을 크게 향상시킨 Milvus 2.4의 출시를 발표하게 되어 기쁘게 생각합니다.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>대규모 데이터 세트에 대한 검색 기능을 크게 향상시킨 Milvus 2.4의 출시를 발표하게 되어 기쁘게 생각합니다. 이번 최신 버전에는 GPU 기반 CAGRA 인덱스 지원, <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">스파스 임베딩</a> 베타 지원, 그룹 검색, 기타 다양한 검색 기능 개선 등 새로운 기능이 추가되었습니다. 이러한 개발은 여러분과 같은 개발자에게 벡터 데이터를 처리하고 쿼리할 수 있는 강력하고 효율적인 도구를 제공함으로써 커뮤니티에 대한 저희의 약속을 더욱 강화합니다. Milvus 2.4의 주요 이점을 함께 살펴보겠습니다.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">간소화된 멀티모달 검색을 위한 멀티벡터 검색 활성화<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4는 멀티 벡터 검색 기능을 제공하여 동일한 Milvus 시스템 내에서 서로 다른 벡터 유형을 동시에 검색하고 순위를 재조정할 수 있습니다. 이 기능은 멀티모달 검색을 간소화하여 리콜률을 크게 향상시키고 개발자가 다양한 데이터 유형을 가진 복잡한 AI 애플리케이션을 손쉽게 관리할 수 있도록 지원합니다. 또한 이 기능은 맞춤형 재랭크 모델의 통합과 미세 조정을 간소화하여 다차원 데이터의 인사이트를 활용하는 정밀한 <a href="https://zilliz.com/vector-database-use-cases/recommender-system">추천 시스템과</a> 같은 고급 검색 기능을 생성하는 데 도움을 줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>밀티-벡터 검색 기능의 작동 방식</span> </span></p>
<p>Milvus의 멀티벡터 지원은 두 가지 구성 요소로 이루어져 있습니다:</p>
<ol>
<li><p>컬렉션 내의 단일 엔티티에 대해 여러 개의 벡터를 저장/조회하는 기능으로, 데이터를 보다 자연스럽게 구성할 수 있습니다.</p></li>
<li><p>Milvus에 미리 구축된 리랭크 알고리즘을 활용하여 리랭크 알고리즘을 구축/최적화할 수 있는 기능.</p></li>
</ol>
<p>이 기능은 <a href="https://github.com/milvus-io/milvus/issues/25639">요청이</a> 많았던 기능일 뿐만 아니라, 업계가 GPT-4 및 Claude 3의 출시와 함께 멀티모달 모델로 이동하고 있기 때문에 구축하게 되었습니다. 재랭크는 검색에서 쿼리 성능을 더욱 향상시키기 위해 일반적으로 사용되는 기술입니다. 저희는 개발자들이 Milvus 에코시스템 내에서 리랭커를 쉽게 구축하고 최적화할 수 있도록 하는 것을 목표로 했습니다.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">컴퓨팅 효율성 향상을 위한 그룹화 검색 지원<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>그룹 검색은 Milvus 2.4에 추가한 또 다른 <a href="https://github.com/milvus-io/milvus/issues/25343">요청이</a> 많았던 기능입니다. 이 기능은 BOOL, INT 또는 VARCHAR 유형의 필드용으로 설계된 그룹별 연산을 통합하여 대규모 그룹화 쿼리를 실행할 때 중요한 효율성 격차를 메웁니다.</p>
<p>기존에는 개발자들이 그룹별 결과를 추출하기 위해 광범위한 Top-K 검색과 수동 후처리에 의존했는데, 이는 컴퓨팅 집약적이고 코드가 많은 방식이었습니다. 그룹화 검색은 쿼리 결과를 문서나 동영상 이름과 같은 집계 그룹 식별자에 효율적으로 연결함으로써 이 프로세스를 개선하여 대규모 데이터 세트 내에서 세그먼트화된 엔티티를 처리하는 작업을 간소화합니다.</p>
<p>Milvus는 반복자 기반 구현으로 그룹화 검색을 차별화하여 유사한 기술보다 계산 효율성이 현저히 향상되었습니다. 이러한 선택은 특히 컴퓨팅 리소스 최적화가 가장 중요한 프로덕션 환경에서 뛰어난 성능 확장성을 보장합니다. 데이터 탐색과 계산 오버헤드를 줄임으로써 Milvus는 보다 효율적인 쿼리 처리를 지원하여 다른 벡터 데이터베이스에 비해 응답 시간과 운영 비용을 크게 줄여줍니다.</p>
<p>그룹화 검색은 대량의 복잡한 쿼리를 관리하는 Milvus의 역량을 강화하며, 강력한 데이터 관리 솔루션을 위한 고성능 컴퓨팅 관행에 부합합니다.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">스파스 벡터 임베딩 베타 지원<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">스파스 임베딩은</a> 단순한 키워드 빈도보다는 의미적 유사성의 뉘앙스를 고려하는 기존의 고밀도 벡터 접근 방식에서 패러다임의 전환을 의미합니다. 이러한 차이는 쿼리 및 문서의 의미론적 콘텐츠와 밀접하게 연계되어 보다 미묘한 검색 기능을 가능하게 합니다. 정보 검색과 자연어 처리에 특히 유용한 스파스 벡터 모델은 밀도가 높은 모델에 비해 강력한 도메인 외 검색 기능과 해석 가능성을 제공합니다.</p>
<p>Milvus 2.4에서는 하이브리드 검색을 확장하여 SPLADEv2와 같은 고급 신경 모델이나 BM25와 같은 통계 모델에서 생성된 희소 임베딩을 포함하도록 했습니다. 밀버스에서는 희소 벡터를 고밀도 벡터와 동등하게 취급하여 희소 벡터 필드를 사용한 컬렉션 생성, 데이터 삽입, 인덱스 구축, 유사도 검색을 수행할 수 있게 되었습니다. 특히, Milvus의 희소 임베딩은 고차원적 특성을 고려할 때 다른 메트릭의 효율을 떨어뜨리는 <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">내적</a> 곱(IP) 거리 메트릭을 지원한다는 점에서 유리합니다. 이 기능은 또한 차원이 부호 없는 32비트 정수와 값에 대한 32비트 부동 소수점인 데이터 유형을 지원하므로 미묘한 텍스트 검색부터 정교한 <a href="https://zilliz.com/learn/information-retrieval-metrics">정보 검색</a> 시스템에 이르기까지 광범위한 애플리케이션을 용이하게 해줍니다.</p>
<p>이 새로운 기능을 통해 Milvus는 키워드와 임베딩 기반 기술을 혼합한 하이브리드 검색 방법론을 지원하여 키워드 중심의 검색 프레임워크에서 유지보수가 적은 종합적인 솔루션을 찾는 사용자들에게 원활한 전환을 제공합니다.</p>
<p>이 기능의 성능 테스트를 계속하고 커뮤니티의 피드백을 수집하기 위해 이 기능을 '베타'로 분류하고 있습니다. 희소 벡터 지원의 일반 공개(GA)는 Milvus 3.0의 출시와 함께 이루어질 예정입니다.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">고급 GPU 가속 그래프 인덱싱을 위한 CAGRA 인덱스 지원<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>NVIDIA에서 개발한 <a href="https://arxiv.org/abs/2308.15136">CAGRA</a> (쿠다 앤스 그래프 기반)는 GPU 기반 그래프 인덱싱 기술로, 특히 처리량이 많은 환경에서 효율성과 성능 면에서 HNSW 인덱스와 같은 기존 CPU 기반 방식을 크게 뛰어넘는 기술입니다.</p>
<p>CAGRA 인덱스의 도입으로 Milvus 2.4는 향상된 GPU 가속 그래프 인덱싱 기능을 제공합니다. 이 향상된 기능은 지연 시간을 최소화해야 하는 유사도 검색 애플리케이션을 구축하는 데 이상적입니다. 또한, Milvus 2.4는 무차별 대입 검색과 CAGRA 인덱스를 통합하여 애플리케이션에서 최대 리콜률을 달성합니다. 자세한 내용은 <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">CAGRA 소개 블로그를</a> 참조하세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>밀버스 래프트 CAGRA와 밀버스 HNSW 비교</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">추가 개선 사항 및 기능<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4에는 <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">메타데이터 필터링에서</a> 향상된 부분 문자열 매칭을 위한 정규식 지원, 효율적인 스칼라 데이터 유형 필터링을 위한 새로운 스칼라 반전 인덱스, Milvus 컬렉션의 변경 사항을 모니터링하고 복제하는 변경 데이터 캡처 도구와 같은 다른 주요 개선 사항도 포함되어 있습니다. 이러한 업데이트는 Milvus의 성능과 다용도성을 종합적으로 향상시켜 복잡한 데이터 작업을 위한 종합 솔루션으로 거듭나게 해줍니다.</p>
<p>자세한 내용은 <a href="https://milvus.io/docs/release_notes.md">Milvus 2.4 설명서를</a> 참조하세요.</p>
<h2 id="Stay-Connected" class="common-anchor-header">계속 연결하세요!<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4에 대해 더 자세히 알고 싶으신가요? Zilliz의 엔지니어링 부사장 제임스 루안과 함께하는 <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">웨비나에 참여하여</a> 최신 릴리스의 기능에 대해 심도 있게 논의해 보세요. 질문이나 피드백이 있으시면 <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에</a> 참여하여 엔지니어 및 커뮤니티 회원들과 소통하세요. <a href="https://twitter.com/milvusio">트위터나</a> <a href="https://www.linkedin.com/company/the-milvus-project">링크드인을</a> 팔로우하여 Milvus에 대한 최신 뉴스와 업데이트를 놓치지 마세요.</p>
