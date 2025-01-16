---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: 'Milvus 2.3.4: 더 빨라진 검색, 확장된 데이터 지원, 향상된 모니터링 등'
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: Milvus 2.3.4의 새로운 기능 및 개선 사항을 소개합니다.
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 2.3.4의 최신 버전을 공개하게 되어 기쁘게 생각합니다. 이번 업데이트에서는 성능을 최적화하고 효율성을 높이며 원활한 사용자 경험을 제공하기 위해 세심하게 설계된 다양한 기능과 개선 사항을 소개합니다. 이 블로그 게시물에서는 Milvus 2.3.4의 주요 기능을 자세히 살펴봅니다.</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">향상된 모니터링을 위한 액세스 로그<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 이제 외부 인터페이스와의 상호 작용에 대한 귀중한 인사이트를 제공하는 액세스 로그를 지원합니다. 이러한 로그는 메서드 이름, 사용자 요청, 응답 시간, 오류 코드 및 기타 상호 작용 정보를 기록하여 개발자와 시스템 관리자가 성능 분석, 보안 감사 및 효율적인 문제 해결을 수행할 수 있도록 지원합니다.</p>
<p><strong><em>참고:</em></strong> <em>현재 액세스 로그는 gRPC 상호 작용만 지원합니다. 그러나 개선을 위한 노력은 계속되고 있으며, 향후 버전에서는 이 기능을 확장하여 RESTful 요청 로그도 포함할 예정입니다.</em></p>
<p>자세한 내용은 <a href="https://milvus.io/docs/configure_access_logs.md">액세스 로그 구성을</a> 참조하세요.</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">데이터 처리 효율성 향상을 위한 Parquet 파일 가져오기<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4는 이제 대규모 데이터 세트의 저장 및 처리 효율성을 높이기 위해 널리 사용되는 컬럼형 저장 형식인 Parquet 파일 가져오기를 지원합니다. 이 기능의 추가를 통해 사용자는 데이터 처리 작업의 유연성과 효율성을 높일 수 있습니다. 번거로운 데이터 형식 변환이 필요 없어짐에 따라, Parquet 형식으로 대규모 데이터 세트를 관리하는 사용자는 데이터 가져오기 프로세스가 간소화되어 초기 데이터 준비부터 후속 벡터 검색까지 걸리는 시간이 크게 단축될 것입니다.</p>
<p>또한, 데이터 형식 변환 도구인 BulkWriter는 이제 Parquet을 기본 출력 데이터 형식으로 채택하여 개발자에게 더욱 직관적인 환경을 제공합니다.</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">더 빠른 검색을 위한 증가하는 세그먼트의 빈로그 인덱스<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 이제 증가하는 세그먼트에 대한 빈로그 인덱스를 활용하여 증가하는 세그먼트에서 최대 10배 더 빠른 검색을 제공합니다. 이 향상된 기능은 검색 효율성을 크게 향상시키고 IVF 또는 빠른 스캔과 같은 고급 인덱스를 지원하여 전반적인 사용자 경험을 개선합니다.</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">최대 10,000개의 컬렉션/파티 지원<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>관계형 데이터베이스의 테이블 및 파티션과 마찬가지로 컬렉션과 파티션은 Milvus에서 벡터 데이터를 저장하고 관리하는 핵심 단위입니다. 세밀한 데이터 구성에 대한 사용자의 진화하는 요구에 부응하기 위해 Milvus 2.3.4는 이제 클러스터에서 최대 10,000개의 컬렉션/파티션을 지원하며, 이는 이전 제한인 4,096개에서 크게 늘어난 수치입니다. 이러한 향상된 기능은 지식 베이스 관리 및 멀티테넌트 환경과 같은 다양한 사용 사례에 도움이 됩니다. 컬렉션/파티션에 대한 확장된 지원은 타임 틱 메커니즘, 고루틴 관리 및 메모리 사용량 개선에 따른 것입니다.</p>
<p><strong><em>참고:</em></strong> <em>컬렉션/파티 수에 대한 권장 제한은 10,000개이며, 이 제한을 초과하면 장애 복구 및 리소스 사용에 영향을 미칠 수 있습니다.</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">기타 개선 사항<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>위의 기능 외에도 Milvus 2.3.4에는 다양한 개선 사항과 버그 수정이 포함되어 있습니다. 여기에는 데이터 검색 및 가변 길이 데이터 처리 중 메모리 사용량 감소, 오류 메시징 개선, 로딩 속도 향상, 쿼리 샤드 밸런스 개선 등이 포함됩니다. 이러한 총체적인 개선 사항은 전반적인 사용자 경험을 더욱 원활하고 효율적으로 개선하는 데 기여합니다.</p>
<p>Milvus 2.3.4에 도입된 모든 변경사항에 대한 종합적인 개요는 <a href="https://milvus.io/docs/release_notes.md#v234">릴리즈 노트를</a> 참조하세요.</p>
<h2 id="Stay-connected" class="common-anchor-header">계속 연락주세요!<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에 대한 질문이나 피드백이 있으시면 <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에</a> 가입하여 엔지니어 및 커뮤니티와 직접 소통하거나 매주 화요일 오후 12시부터 12시 30분까지 진행되는 <a href="https://discord.com/invite/RjNbk8RR4f">Milvus 커뮤니티 런치 앤 런치에</a> 참여하세요. 또한 <a href="https://twitter.com/milvusio">트위터나</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn을</a> 팔로우하여 Milvus에 대한 최신 뉴스와 업데이트를 받아보세요.</p>
