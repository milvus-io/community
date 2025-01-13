---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: 'Milvus 2.2.12: 더 쉬운 액세스, 더 빠른 벡터 검색 속도, 더 나은 사용자 환경'
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 2.2.12의 최신 버전을 발표하게 되어 기쁘게 생각합니다. 이번 업데이트에는 사용자 피드백을 반영하여 RESTful API 지원, <code translate="no">json_contains</code> 기능, ANN 검색 중 벡터 검색 등 여러 가지 새로운 기능이 포함되어 있습니다. 또한 사용자 환경을 간소화하고, 벡터 검색 속도를 개선했으며, 여러 문제를 해결했습니다. Milvus 2.2.12에서 기대할 수 있는 기능에 대해 자세히 알아봅시다.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">RESTful API 지원<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12는 이제 RESTful API를 지원하여 사용자가 클라이언트를 설치하지 않고도 Milvus에 액세스할 수 있어 클라이언트-서버 운영이 쉬워집니다. 또한 Milvus SDK와 RESTful API가 동일한 포트 번호를 공유하기 때문에 Milvus 배포가 더욱 편리해졌습니다.</p>
<p><strong>참고</strong>: 고급 작업이나 지연 시간에 민감한 비즈니스의 경우 여전히 SDK를 사용하여 Milvus를 배포하는 것이 좋습니다.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">ANN 검색 중 벡터 검색<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>이전 버전에서는 성능과 메모리 사용의 우선 순위를 정하기 위해 Milvus에서 근사 근사 이웃(ANN) 검색 중 벡터 검색을 허용하지 않았습니다. 그 결과, 원시 벡터를 검색하려면 ANN 검색을 수행한 다음 ID를 기반으로 원시 벡터를 쿼리하는 두 단계로 나눠야 했습니다. 이러한 접근 방식은 개발 비용을 증가시키고 사용자가 Milvus를 배포하고 채택하기 어렵게 만들었습니다.</p>
<p>Milvus 2.2.12에서는 사용자가 벡터 필드를 출력 필드로 설정하고 HNSW-, DiskANN- 또는 IVF-FLAT 색인된 컬렉션에서 쿼리하여 ANN 검색 중에 원시 벡터를 검색할 수 있습니다. 또한 사용자는 훨씬 빠른 벡터 검색 속도를 기대할 수 있습니다.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">JSON 배열에 대한 작업 지원<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>최근 Milvus 2.2.8에서 JSON에 대한 지원이 추가되었습니다. 그 이후로 사용자들은 포함, 제외, 교차, 결합, 차이 등과 같은 추가적인 JSON 배열 연산을 지원해 달라는 수많은 요청을 보내왔습니다. Milvus 2.2.12에서는 포함 연산을 활성화하기 위해 <code translate="no">json_contains</code> 함수를 우선적으로 지원하게 되었습니다. 향후 버전에서 다른 연산자에 대한 지원을 계속 추가할 예정입니다.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">개선 사항 및 버그 수정<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>새로운 기능을 도입하는 것 외에도 Milvus 2.2.12는 벡터 검색 성능을 개선하고 오버헤드를 줄여 광범위한 토픽 검색을 더 쉽게 처리할 수 있도록 했습니다. 또한 파티션 키 사용 및 다중 파티션 상황에서 쓰기 성능을 향상시키고 대규모 시스템의 CPU 사용량을 최적화합니다. 이 업데이트는 과도한 디스크 사용, 압축 고착, 잦은 데이터 삭제, 대량 삽입 실패 등 다양한 문제를 해결합니다. 자세한 내용은 <a href="https://milvus.io/docs/release_notes.md#2212">Milvus 2.2.12 릴리즈 노트를</a> 참조하세요.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">계속 연락주세요!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에 대한 질문이나 피드백이 있으시면 언제든지 <a href="https://twitter.com/milvusio">트위터나</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn을</a> 통해 문의해 주세요. 또한 <a href="https://milvus.io/slack/">Slack 채널에</a> 가입하여 엔지니어 및 커뮤니티와 직접 채팅하거나 <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">화요일 업무 시간을</a> 확인하실 수도 있습니다!</p>
