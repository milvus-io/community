---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: 'Milvus 2.2.9: 최적의 사용자 경험을 제공하는 많은 기대를 받고 있는 릴리스'
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>팀과 커뮤니티에 중요한 이정표가 될 Milvus 2.2.9의 출시를 발표하게 되어 매우 기쁘게 생각합니다. 이번 릴리스에서는 오랫동안 기다려온 JSON 데이터 유형, 동적 스키마 및 파티션 키에 대한 지원을 비롯하여 여러 가지 흥미로운 기능을 제공하여 최적화된 사용자 경험과 간소화된 개발 워크플로우를 보장합니다. 또한 이번 릴리스에는 수많은 개선 사항과 버그 수정이 포함되어 있습니다. Milvus 2.2.9를 살펴보고 이번 릴리스가 기대되는 이유를 알아보세요.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">JSON 지원으로 최적화된 사용자 경험<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 많은 기대를 모았던 JSON 데이터 유형에 대한 지원을 도입하여 사용자 컬렉션 내 벡터의 메타데이터와 함께 JSON 데이터를 원활하게 저장할 수 있게 되었습니다. 이 향상된 기능을 통해 사용자는 JSON 데이터를 효율적으로 대량으로 삽입하고 JSON 필드의 내용을 기반으로 고급 쿼리 및 필터링을 수행할 수 있습니다. 또한, 사용자는 데이터 세트의 JSON 필드에 맞는 표현식을 활용하여 연산을 수행하고, 쿼리를 구성하고, JSON 필드의 콘텐츠와 구조를 기반으로 필터를 적용할 수 있어 관련 정보를 추출하고 데이터를 더 잘 조작할 수 있습니다.</p>
<p>앞으로 Milvus 팀은 JSON 유형 내의 필드에 대한 인덱스를 추가하여 혼합 스칼라 및 벡터 쿼리의 성능을 더욱 최적화할 예정입니다. 앞으로의 흥미로운 개발 소식을 기대해 주세요!</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">동적 스키마 지원으로 유연성 향상<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>밀버스 2.2.9는 이제 JSON 데이터 지원과 함께 간소화된 소프트웨어 개발 키트(SDK)를 통해 동적 스키마 기능을 제공합니다.</p>
<p>Milvus 2.2.9부터 Milvus SDK에는 컬렉션의 숨겨진 JSON 필드에 동적 필드를 자동으로 채우는 상위 레벨 API가 포함되어 있어 사용자는 비즈니스 필드에만 집중할 수 있습니다.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">파티션 키로 데이터 분리 및 검색 효율성 향상<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9는 파티션 키 기능을 도입하여 파티셔닝 기능을 강화했습니다. 사용자별 열을 파티셔닝의 기본 키로 사용할 수 있어 <code translate="no">loadPartition</code> 및 <code translate="no">releasePartition</code> 과 같은 추가 API가 필요하지 않습니다. 또한 이 새로운 기능은 파티션 수에 대한 제한을 없애 리소스를 더욱 효율적으로 활용할 수 있게 해줍니다.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">알리바바 클라우드 OSS 지원<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9는 이제 Alibaba Cloud OSS(객체 스토리지 서비스)를 지원합니다. 알리바바 클라우드 사용자는 <code translate="no">cloudProvider</code> 을 알리바바 클라우드에 쉽게 구성하고 클라우드에서 벡터 데이터를 효율적으로 저장하고 검색할 수 있는 원활한 통합을 활용할 수 있습니다.</p>
<p>앞서 언급한 기능 외에도 Milvus 2.2.9는 역할 기반 액세스 제어(RBAC)에서 데이터베이스 지원을 제공하고, 연결 관리를 도입하며, 여러 개선 사항과 버그 수정이 포함되어 있습니다. 자세한 내용은 <a href="https://milvus.io/docs/release_notes.md">Milvus 2.2.9 릴리즈 노트를</a> 참조하세요.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">계속 연락주세요!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에 대한 질문이나 피드백이 있으시면 언제든지 <a href="https://twitter.com/milvusio">트위터나</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn을</a> 통해 문의해 주세요. 또한 <a href="https://milvus.io/slack/">Slack 채널에</a> 가입하여 엔지니어 및 커뮤니티와 직접 채팅하거나 <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">화요일 근무 시간을</a> 확인하실 수도 있습니다!</p>
