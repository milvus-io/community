---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: 'Milvus 2.3.2 및 2.3.3을 공개합니다: 배열 데이터 유형, 복합 삭제, TiKV 통합 등 지원'
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  오늘, Milvus 2.3.2와 2.3.3의 출시를 발표하게 되어 매우 기쁩니다! 이번 업데이트는 시스템 성능, 유연성 및 전반적인 사용자
  경험을 향상시키는 여러 가지 흥미로운 기능, 최적화 및 개선 사항을 제공합니다.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>끊임없이 진화하는 벡터 검색 기술 환경에서 Milvus는 한계를 뛰어넘고 새로운 표준을 세우며 선두를 지키고 있습니다. 오늘, Milvus 2.3.2와 2.3.3의 출시를 발표하게 되어 매우 기쁩니다! 이번 업데이트는 시스템 성능, 유연성 및 전반적인 사용자 경험을 향상시키는 여러 가지 흥미로운 기능, 최적화 및 개선 사항을 제공합니다.</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">배열 데이터 유형 지원 - 검색 결과의 정확성과 연관성 향상<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>배열 데이터 유형 지원 추가는 특히 교차 및 유니온과 같은 쿼리 필터링 시나리오에서 Milvus의 핵심적인 개선 사항입니다. 이 기능을 추가하면 검색 결과가 더 정확해질 뿐만 아니라 관련성도 높아집니다. 예를 들어, 이커머스 부문에서는 문자열 배열로 저장된 제품 태그를 통해 소비자가 고급 검색을 수행하여 관련 없는 결과를 걸러낼 수 있습니다.</p>
<p>Milvus에서 배열 유형을 활용하는 방법에 대한 심층적인 가이드는 종합 <a href="https://milvus.io/docs/array_data_type.md">문서를</a> 참조하세요.</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">복잡한 삭제 표현식 지원 - 데이터 관리 개선<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>이전 버전에서 Milvus는 기본 키 삭제 표현식을 지원하여 안정적이고 간소화된 아키텍처를 제공했습니다. Milvus 2.3.2 또는 2.3.3에서는 복잡한 삭제 표현식을 사용할 수 있어 오래된 데이터의 롤링 정리 또는 사용자 ID를 기반으로 한 GDPR 준수 기반 데이터 삭제와 같은 정교한 데이터 관리 작업이 용이해집니다.</p>
<p>참고: 복잡한 표현식을 활용하기 전에 컬렉션을 로드했는지 확인하세요. 또한 삭제 프로세스가 원자성을 보장하지 않는다는 점에 유의하세요.</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">TiKV 통합 - 안정성을 갖춘 확장 가능한 메타데이터 스토리지<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>이전에 메타데이터 스토리지를 위해 Etcd에 의존했던 Milvus는 메타데이터 스토리지의 용량과 확장성 문제에 직면했습니다. 이러한 문제를 해결하기 위해 Milvus는 메타데이터 스토리지를 위한 또 하나의 옵션으로 오픈 소스 키-값 저장소인 TiKV를 추가했습니다. TiKV는 향상된 확장성, 안정성, 효율성을 제공하므로 Milvus의 진화하는 요구사항에 이상적인 솔루션입니다. Milvus 2.3.2부터 사용자는 구성을 수정하여 메타데이터 스토리지를 TiKV로 원활하게 전환할 수 있습니다.</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">FP16 벡터 유형 지원 - 머신 러닝 효율성 수용<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2 이상 버전은 이제 인터페이스 수준에서 FP16 벡터 유형을 지원합니다. 16비트 부동 소수점인 FP16은 딥 러닝과 머신 러닝에서 널리 사용되는 데이터 형식으로, 수치 값을 효율적으로 표현하고 계산할 수 있습니다. FP16에 대한 완전한 지원은 진행 중이지만, 인덱싱 계층의 다양한 인덱스는 구축 과정에서 FP16을 FP32로 변환해야 합니다.</p>
<p>Milvus의 이후 버전에서는 FP16, BF16 및 int8 데이터 유형을 완벽하게 지원할 예정입니다. 계속 지켜봐 주세요.</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">롤링 업그레이드 환경의 대폭적인 개선 - 사용자의 원활한 전환<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>롤링 업그레이드는 분산 시스템에 중요한 기능으로, 비즈니스 서비스를 중단하거나 다운타임 없이 시스템을 업그레이드할 수 있게 해줍니다. 최신 Milvus 릴리스에서는 Milvus의 롤링 업그레이드 기능을 강화하여 사용자가 버전 2.2.15에서 2.3.3 및 이후 모든 버전으로 업그레이드할 때 보다 간소하고 효율적으로 전환할 수 있도록 했습니다. 또한 커뮤니티는 광범위한 테스트와 최적화에 투자하여 업그레이드 중 쿼리 영향을 5분 이내로 줄여 사용자에게 번거로움 없는 환경을 제공합니다.</p>
<h2 id="Performance-optimization" class="common-anchor-header">성능 최적화<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>새로운 기능을 도입하는 것 외에도 최신 두 릴리스에서는 Milvus의 성능을 대폭 최적화했습니다.</p>
<ul>
<li><p>데이터 로딩 최적화를 위해 데이터 복사 작업 최소화</p></li>
<li><p>일괄 바차르 읽기를 사용하여 대용량 삽입 간소화</p></li>
<li><p>데이터 패딩 중 불필요한 오프셋 검사를 제거하여 리콜 단계 성능을 개선했습니다.</p></li>
<li><p>상당한 양의 데이터를 삽입하는 시나리오에서 높은 CPU 소비 문제 해결</p></li>
</ul>
<p>이러한 최적화를 통해 보다 빠르고 효율적인 Milvus 환경을 제공합니다. Milvus의 성능 개선 과정을 모니터링 대시보드에서 한눈에 확인할 수 있습니다.</p>
<h2 id="Incompatible-changes" class="common-anchor-header">호환되지 않는 변경 사항<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>시간 여행 관련 코드가 영구적으로 삭제되었습니다.</p></li>
<li><p>메타데이터 저장소로 MySQL에 대한 지원이 중단되었습니다.</p></li>
</ul>
<p>모든 새로운 기능 및 개선 사항에 대한 자세한 내용은 <a href="https://milvus.io/docs/release_notes.md">Milvus 릴리스 노트를</a> 참조하세요.</p>
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
    </button></h2><p>최신 Milvus 2.3.2 및 2.3.3 릴리스를 통해 저희는 강력하고 기능이 풍부한 고성능 데이터베이스 솔루션을 제공하기 위해 최선을 다하고 있습니다. 새로운 기능을 살펴보고, 최적화된 기능을 활용하고, 최신 데이터 관리의 요구 사항을 충족하기 위해 Milvus를 발전시키는 이 흥미로운 여정에 동참하세요. 지금 최신 버전을 다운로드하고 Milvus로 데이터 스토리지의 미래를 경험하세요!</p>
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
    </button></h2><p>Milvus에 대한 질문이나 피드백이 있으시면 <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에</a> 가입하여 엔지니어 및 커뮤니티와 직접 소통하거나 매주 화요일 오후 12시부터 12시 30분까지 진행되는 <a href="https://discord.com/invite/RjNbk8RR4f">Milvus 커뮤니티 런치 앤 러닝에</a> 참여하세요(PST). 또한 <a href="https://twitter.com/milvusio">트위터나</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn을</a> 팔로우하여 Milvus에 대한 최신 뉴스와 업데이트를 받아보세요.</p>
