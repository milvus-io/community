---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: 'Milvus로 멀티테넌시 RAG 설계하기: 확장 가능한 엔터프라이즈 지식창고를 위한 모범 사례'
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>지난 몇 년 동안 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">검색 증강 세대(RAG)</a> 는 대규모 조직, 특히 다양한 사용자를 보유한 조직에서 <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM 기반</a> 애플리케이션을 개선하기 위한 신뢰할 수 있는 솔루션으로 부상했습니다. 이러한 애플리케이션이 성장함에 따라 멀티테넌시 프레임워크 구현은 필수적인 요소가 되었습니다. <strong>멀티테넌시는</strong> 다양한 사용자 그룹에 데이터에 대한 안전하고 격리된 액세스를 제공하여 사용자 신뢰를 보장하고 규제 표준을 충족하며 운영 효율성을 개선합니다.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus는</a> 고차원 <a href="https://zilliz.com/glossary/vector-embeddings">벡터 데이터를</a> 처리하기 위해 구축된 오픈 소스 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스입니다</a>. 이는 RAG의 필수 인프라 구성 요소로, 외부 소스에서 LLM에 대한 컨텍스트 정보를 저장하고 검색합니다. Milvus는 <strong>데이터베이스 수준, 컬렉션 수준, 파티션 수준 멀티테넌시</strong> 등 다양한 요구사항에 맞는 <a href="https://milvus.io/docs/multi_tenancy.md">유연한 멀티테넌시 전략을</a> 제공합니다.</p>
<p>이 글에서는 이에 대해 다뤄보겠습니다:</p>
<ul>
<li><p>멀티 테넌시란 무엇이며 중요한 이유</p></li>
<li><p>Milvus의 멀티 테넌시 전략</p></li>
<li><p>예시: RAG 기반 엔터프라이즈 지식창고를 위한 멀티테넌시 전략</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">멀티 테넌트란 무엇이며 중요한 이유<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>멀티테넌트란</strong></a> 여러 고객 또는 팀(<strong>테넌트</strong>)이 애플리케이션 또는 시스템의 단일 인스턴스를 공유하는 아키텍처를 말합니다. 각 테넌트의 데이터와 구성은 논리적으로 격리되어 개인정보 보호와 보안이 보장되며, 모든 테넌트는 동일한 기본 인프라를 공유합니다.</p>
<p>여러 회사에 지식 기반 솔루션을 제공하는 SaaS 플랫폼을 상상해 보세요. 각 회사는 테넌트입니다.</p>
<ul>
<li><p>테넌트 A는 환자를 대상으로 하는 FAQ 및 규정 준수 문서를 저장하는 의료 기관입니다.</p></li>
<li><p>테넌트 B는 내부 IT 문제 해결 워크플로를 관리하는 기술 회사입니다.</p></li>
<li><p>테넌트 C는 제품 반품에 대한 고객 서비스 FAQ를 보관하는 소매업 회사입니다.</p></li>
</ul>
<p>각 테넌트는 완전히 격리된 환경에서 운영되므로 테넌트 A의 데이터가 테넌트 B의 시스템으로 유출되거나 그 반대의 경우도 발생하지 않습니다. 또한 리소스 할당, 쿼리 성능, 확장 결정이 테넌트별로 이루어지므로 한 테넌트의 워크로드 급증과 관계없이 높은 성능을 보장합니다.</p>
<p>멀티 테넌시는 같은 조직 내에서 여러 팀을 지원하는 시스템에도 적합합니다. 한 대기업이 HR, 법무, 마케팅과 같은 내부 부서에 서비스를 제공하기 위해 RAG 기반 지식 베이스를 사용한다고 상상해 보세요. 각 <strong>부서는</strong> 이 설정에서 격리된 데이터와 리소스를 가진 <strong>테넌트입니다</strong>.</p>
<p>멀티테넌시는 <strong>비용 효율성, 확장성, 강력한 데이터 보안</strong> 등 상당한 이점을 제공합니다. 서비스 제공업체는 단일 인프라를 공유함으로써 간접비를 절감하고 리소스를 보다 효과적으로 사용할 수 있습니다. 이 접근 방식은 또한 손쉽게 확장할 수 있습니다. 새로운 테넌트를 보딩할 때 단일 테넌시 모델에서처럼 각 테넌트에 대해 별도의 인스턴스를 만드는 것보다 훨씬 적은 리소스가 필요합니다. 중요한 점은 멀티테넌시는 각 테넌트에 대해 엄격한 데이터 격리를 보장하고 액세스 제어 및 암호화를 통해 중요한 정보를 무단 액세스로부터 보호함으로써 강력한 데이터 보안을 유지한다는 점입니다. 또한 업데이트, 패치, 새로운 기능을 모든 테넌트에 동시에 배포할 수 있어 시스템 유지관리를 간소화하고 관리자의 부담을 줄이면서 보안 및 규정 준수 표준을 일관되게 유지할 수 있습니다.</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Milvus의 멀티 테넌시 전략<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus가 멀티 테넌시를 지원하는 방식을 이해하려면 먼저 사용자 데이터를 어떻게 구성하는지 살펴보는 것이 중요합니다.</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Milvus가 사용자 데이터를 구성하는 방법</h3><p>Milvus는 데이터를 세 가지 계층으로 구성하여 광범위에서 세분화합니다: <a href="https://milvus.io/docs/manage_databases.md"><strong>데이터베이스</strong></a>, <a href="https://milvus.io/docs/manage-collections.md"><strong>컬렉션</strong></a>, <a href="https://milvus.io/docs/manage-partitions.md"><strong>파티션/파티션 키입니다</strong></a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>그림 - Milvus가 사용자 데이터를 구성하는 방법 .png</span> </span></p>
<p><em>그림: Milvus가 사용자 데이터를 구성하는 방식</em></p>
<ul>
<li><p><strong>데이터베이스</strong>: 기존 관계형 시스템의 데이터베이스와 유사한 논리적 컨테이너 역할을 합니다.</p></li>
<li><p><strong>컬렉션</strong>: 데이터베이스 내의 테이블에 비유할 수 있는 컬렉션은 데이터를 관리 가능한 그룹으로 구성합니다.</p></li>
<li><p><strong>파티션/파티션 키</strong>: 컬렉션 내에서 데이터를 <strong>파티션으로</strong> 더 세분화할 수 있습니다. <strong>파티션 키를</strong> 사용하면 같은 키를 가진 데이터가 함께 그룹화됩니다. 예를 들어, <strong>사용자 ID를</strong> <strong>파티션 키로</strong> 사용하면 특정 사용자의 모든 데이터가 동일한 논리 세그먼트에 저장됩니다. 따라서 개별 사용자와 관련된 데이터를 쉽게 검색할 수 있습니다.</p></li>
</ul>
<p><strong>데이터베이스에서</strong> <strong>컬렉션</strong>, <strong>파티션 키로</strong> 이동함에 따라 데이터 구성의 세분성은 점점 더 세분화됩니다.</p>
<p>데이터 보안을 강화하고 적절한 액세스 제어를 보장하기 위해 Milvus는 관리자가 각 사용자에 대한 특정 권한을 정의할 수 있는 강력한 <a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>역할 기반 액세스 제어(RBAC)</strong></a> 기능도 제공합니다. 권한이 부여된 사용자만 특정 데이터에 액세스할 수 있습니다.</p>
<p>Milvus는 <strong>데이터베이스 수준, 컬렉션 수준, 파티션 수준 멀티테넌시</strong> 등 애플리케이션의 필요에 따라 유연하게 멀티테넌시를 구현할 수 있는 <a href="https://milvus.io/docs/multi_tenancy.md">다양한 전략을</a> 지원합니다.</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">데이터베이스 수준 멀티 테넌시</h3><p>데이터베이스 수준 멀티 테넌시 접근 방식을 사용하면 각 테넌트는 동일한 Milvus 클러스터 내에서 자체 데이터베이스를 할당받습니다. 이 전략은 강력한 데이터 격리를 제공하며 최적의 검색 성능을 보장합니다. 그러나 특정 테넌트가 비활성 상태로 유지되면 리소스 활용이 비효율적으로 될 수 있습니다.</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">컬렉션 수준 멀티 테넌시</h3><p>컬렉션 수준의 멀티테넌시에서는 테넌트에 대한 데이터를 두 가지 방식으로 구성할 수 있습니다.</p>
<ul>
<li><p><strong>모든 테넌트를 위한 하나의 컬렉션</strong>: 모든 테넌트가 하나의 컬렉션을 공유하며, 테넌트별 필드가 필터링에 사용됩니다. 이 방식은 구현하기는 간단하지만 테넌트 수가 증가함에 따라 성능 병목 현상이 발생할 수 있습니다.</p></li>
<li><p><strong>테넌트당 하나의 컬렉션</strong>: 각 테넌트가 전용 컬렉션을 가질 수 있어 격리 및 성능이 향상되지만 더 많은 리소스가 필요합니다. 이 설정은 테넌트 수가 Milvus의 컬렉션 용량을 초과하는 경우 확장성 제한에 직면할 수 있습니다.</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">파티션 수준 다중 테넌트</h3><p>파티션 수준 멀티테넌시는 단일 컬렉션 내에서 테넌트를 구성하는 데 중점을 둡니다. 여기에는 테넌트 데이터를 구성하는 두 가지 방법이 있습니다.</p>
<ul>
<li><p><strong>테넌트당 하나의 파티션</strong>: 테넌트가 하나의 컬렉션을 공유하지만 데이터는 별도의 파티션에 저장됩니다. 각 테넌트에 전용 파티션을 할당하여 데이터를 분리함으로써 분리와 검색 성능의 균형을 맞출 수 있습니다. 그러나 이 접근 방식은 Milvus의 최대 파티션 제한에 의해 제약을 받습니다.</p></li>
<li><p><strong>파티션 키 기반 멀티 테넌시</strong>: 이 옵션은 단일 컬렉션에서 파티션 키를 사용하여 테넌트를 구분하는 보다 확장성이 뛰어난 옵션입니다. 이 방법은 리소스 관리를 간소화하고 더 높은 확장성을 지원하지만 대량 데이터 삽입은 지원하지 않습니다.</p></li>
</ul>
<p>아래 표에는 주요 멀티테넌시 접근 방식 간의 주요 차이점이 요약되어 있습니다.</p>
<table>
<thead>
<tr><th><strong>세분성</strong></th><th><strong>데이터베이스 수준</strong></th><th><strong>컬렉션 수준</strong></th><th><strong>파티션 키 수준</strong></th></tr>
</thead>
<tbody>
<tr><td>지원되는 최대 테넌트 수</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>데이터 구성 유연성</td><td>높음: 사용자가 사용자 정의 스키마로 여러 컬렉션을 정의할 수 있습니다.</td><td>보통: 사용자는 사용자 지정 스키마가 있는 하나의 컬렉션으로 제한됩니다.</td><td>낮음: 모든 사용자가 컬렉션을 공유하므로 일관된 스키마가 필요합니다.</td></tr>
<tr><td>사용자당 비용</td><td>높음</td><td>보통</td><td>낮음</td></tr>
<tr><td>물리적 리소스 격리</td><td>예</td><td>예</td><td>아니요</td></tr>
<tr><td>RBAC</td><td>예</td><td>예</td><td>아니요</td></tr>
<tr><td>검색 성능</td><td>강함</td><td>보통</td><td>강함</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">예시: RAG 기반 엔터프라이즈 지식창고를 위한 멀티테넌시 전략<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 시스템에 대한 멀티 테넌시 전략을 설계할 때는 비즈니스 및 테넌트의 특정 요구 사항에 맞게 접근 방식을 조정하는 것이 중요합니다. Milvus는 다양한 멀티 테넌시 전략을 제공하며, 테넌트 수, 요구 사항, 필요한 데이터 격리 수준에 따라 적합한 전략을 선택해야 합니다. 다음은 RAG 기반 엔터프라이즈 지식창고를 예로 들어 이러한 결정을 내리는 데 도움이 되는 실용적인 가이드입니다.</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">멀티테넌시 전략을 선택하기 전에 테넌트 구조 이해하기</h3><p>RAG 기반 엔터프라이즈 지식창고는 소수의 테넌트에게 서비스를 제공하는 경우가 많습니다. 이러한 테넌트는 보통 IT, 영업, 법무, 마케팅과 같은 독립적인 비즈니스 부서로, 각각 고유한 지식창고 서비스를 필요로 합니다. 예를 들어 HR 부서에서는 온보딩 가이드 및 복리후생 정책과 같은 민감한 직원 정보를 관리하며, 이러한 정보는 기밀로 유지되어야 하고 HR 담당자만 액세스할 수 있어야 합니다.</p>
<p>이 경우 각 사업부를 별도의 테넌트로 취급해야 하며 <strong>데이터베이스 수준의 멀티테넌트 전략이</strong> 가장 적합한 경우가 많습니다. 각 테넌트에 전용 데이터베이스를 할당함으로써 조직은 강력한 논리적 격리를 달성하고 관리를 간소화하며 보안을 강화할 수 있습니다. 이 설정은 테넌트에게 상당한 유연성을 제공합니다. 테넌트는 컬렉션 내에서 사용자 정의 데이터 모델을 정의하고, 필요한 만큼의 컬렉션을 만들고, 컬렉션에 대한 액세스 제어를 독립적으로 관리할 수 있습니다.</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">물리적 리소스 격리를 통한 보안 강화</h3><p>데이터 보안의 우선순위가 높은 상황에서는 데이터베이스 수준에서의 논리적 격리만으로는 충분하지 않을 수 있습니다. 예를 들어, 일부 사업부에서는 중요하거나 매우 민감한 데이터를 처리하기 때문에 다른 테넌트의 간섭에 대해 보다 강력한 보안이 필요할 수 있습니다. 이러한 경우 데이터베이스 수준의 멀티 테넌시 구조 위에 <a href="https://milvus.io/docs/resource_group.md">물리적 격리 접근 방식을</a> 구현할 수 있습니다.</p>
<p>Milvus를 사용하면 데이터베이스 및 컬렉션과 같은 논리적 구성 요소를 물리적 리소스에 매핑할 수 있습니다. 이 방법은 다른 테넌트의 활동이 중요한 작업에 영향을 미치지 않도록 보장합니다. 이 접근 방식이 실제로 어떻게 작동하는지 살펴보겠습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>그림 - Milvus의 물리적 리소스 관리 방법.png</span> </span></p>
<p>그림: Milvus가 물리적 리소스를 관리하는 방법</p>
<p>위의 다이어그램에서 볼 수 있듯이 Milvus에는 세 가지 리소스 관리 계층이 있습니다: <strong>쿼리 노드</strong>, <strong>리소스 그룹</strong>, <strong>데이터베이스입니다</strong>.</p>
<ul>
<li><p><strong>쿼리 노드</strong>: 쿼리 작업을 처리하는 구성 요소입니다. 쿼리 노드는 물리적 머신 또는 컨테이너(예: Kubernetes의 포드)에서 실행됩니다.</p></li>
<li><p><strong>리소스 그룹</strong>: 논리적 구성 요소(데이터베이스 및 컬렉션)와 물리적 리소스 사이의 다리 역할을 하는 쿼리 노드의 모음입니다. 하나 이상의 데이터베이스 또는 컬렉션을 단일 리소스 그룹에 할당할 수 있습니다.</p></li>
</ul>
<p>위 다이어그램에 표시된 예에는 세 개의 논리적 <strong>데이터베이스가</strong> 있습니다: X, Y, Z입니다.</p>
<ul>
<li><p><strong>데이터베이스 X</strong>: <strong>컬렉션 A를</strong> 포함합니다.</p></li>
<li><p><strong>데이터베이스 Y</strong>: <strong>컬렉션 B</strong> 및 <strong>C를</strong> 포함합니다.</p></li>
<li><p><strong>데이터베이스 Z</strong>: <strong>컬렉션 D</strong> 및 <strong>E를</strong> 포함합니다.</p></li>
</ul>
<p>데이터 격리를 보장하기 위해 <strong>데이터베이스 X에</strong> <strong>데이터베이스 Y</strong> 또는 <strong>데이터베이스 Z의</strong> 로드의 영향을 받지 않으려는 중요한 지식창고가 있다고 가정해 봅시다:</p>
<ul>
<li><p><strong>데이터베이스 X에는</strong> 자체 <strong>리소스 그룹이</strong> 할당되어 중요한 지식창고가 다른 데이터베이스의 워크로드에 영향을 받지 않도록 보장합니다.</p></li>
<li><p><strong>컬렉션 E도</strong> 상위 데이터베이스<strong>(Z)</strong> 내의 별도의 <strong>리소스 그룹에</strong> 할당됩니다. 이렇게 하면 공유 데이터베이스 내의 특정 중요 데이터에 대해 컬렉션 수준에서 격리가 이루어집니다.</p></li>
</ul>
<p>한편, <strong>데이터베이스 Y와</strong> <strong>Z의</strong> 나머지 컬렉션은 <strong>리소스 그룹 2의</strong> 물리적 리소스를 공유합니다.</p>
<p>논리적 구성 요소를 물리적 리소스에 신중하게 매핑함으로써 조직은 특정 비즈니스 요구 사항에 맞는 유연하고 확장 가능하며 안전한 멀티테넌시 아키텍처를 달성할 수 있습니다.</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">최종 사용자 수준 액세스 설계</h3><p>이제 엔터프라이즈 RAG를 위한 멀티 테넌시 전략을 선택하는 모범 사례를 알아보았으니 이러한 시스템에서 사용자 수준 액세스를 설계하는 방법을 살펴보겠습니다.</p>
<p>이러한 시스템에서 최종 사용자는 보통 LLM을 통해 읽기 전용 모드로 지식창고와 상호작용합니다. 하지만 조직은 사용자가 생성한 Q&amp;A 데이터를 추적하여 지식창고의 정확도를 높이거나 개인화된 서비스를 제공하는 등 다양한 목적을 위해 특정 사용자와 연결해야 합니다.</p>
<p>병원의 스마트 상담 서비스 데스크를 예로 들어 보겠습니다. 환자는 "오늘 전문의와 예약 가능한 시간이 있나요?" 또는 "예정된 수술을 위해 특별히 준비해야 할 것이 있나요?"와 같은 질문을 할 수 있습니다. 이러한 질문이 지식창고에 직접적인 영향을 미치지는 않지만 병원에서는 서비스 개선을 위해 이러한 상호작용을 추적하는 것이 중요합니다. 이러한 Q&amp;A 쌍은 일반적으로 상호작용을 기록하기 위한 별도의 데이터베이스(반드시 벡터 데이터베이스일 필요는 없음)에 저장됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>그림- 엔터프라이즈 RAG 지식창고를 위한 멀티테넌시 아키텍처 .png</span> </span></p>
<p><em>그림 엔터프라이즈 RAG 지식창고를 위한 멀티테넌시 아키텍처</em></p>
<p>위의 다이어그램은 엔터프라이즈 RAG 시스템의 멀티테넌시 아키텍처를 보여줍니다.</p>
<ul>
<li><p><strong>시스템 관리자는</strong> RAG 시스템을 감독하고, 리소스 할당을 관리하며, 데이터베이스를 할당하고, 리소스 그룹에 매핑하고, 확장성을 보장합니다. 이들은 다이어그램에 표시된 것처럼 각 리소스 그룹(예: 리소스 그룹 1, 2, 3)이 물리적 서버(쿼리 노드)에 매핑되어 있는 물리적 인프라를 처리합니다.</p></li>
<li><p><strong>테넌트(데이터베이스 소유자 및 개발자)는</strong> 다이어그램에 표시된 대로 사용자가 생성한 Q&amp;A 데이터를 기반으로 지식창고를 반복하여 관리합니다. 서로 다른 데이터베이스(데이터베이스 X, Y, Z)에는 서로 다른 지식창고 콘텐츠(컬렉션 A, B 등)가 있는 컬렉션이 포함되어 있습니다.</p></li>
<li><p><strong>최종 사용자는</strong> LLM을 통해 읽기 전용 방식으로 시스템과 상호작용합니다. 시스템에 쿼리하면 질문이 별도의 Q&amp;A 레코드 테이블(별도의 데이터베이스)에 기록되어 중요한 데이터를 지속적으로 시스템에 다시 공급합니다.</p></li>
</ul>
<p>이러한 설계는 사용자 상호작용부터 시스템 관리에 이르기까지 각 프로세스 계층이 원활하게 작동하도록 보장하여 조직이 견고하고 지속적으로 개선되는 지식창고를 구축할 수 있도록 도와줍니다.</p>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>이 블로그에서는 <a href="https://milvus.io/docs/multi_tenancy.md"><strong>멀티테넌시</strong></a> 프레임워크가 RAG 기반 지식창고의 확장성, 보안 및 성능에 어떤 중요한 역할을 하는지 살펴보았습니다. 서로 다른 테넌트에 대한 데이터와 리소스를 분리함으로써 기업은 공유 인프라 전반에서 개인정보 보호, 규정 준수 및 최적화된 리소스 할당을 보장할 수 있습니다. 유연한 멀티 테넌시 전략을 갖춘 <a href="https://milvus.io/docs/overview.md">Milvus를</a> 통해 기업은 데이터베이스 수준부터 파티션 수준까지 특정 요구 사항에 따라 적절한 수준의 데이터 격리를 선택할 수 있습니다. 올바른 멀티 테넌시 접근 방식을 선택하면 기업은 다양한 데이터와 워크로드를 처리할 때에도 테넌트에게 맞춤형 서비스를 제공할 수 있습니다.</p>
<p>여기에 설명된 모범 사례를 따르면 조직은 우수한 사용자 경험을 제공할 뿐만 아니라 비즈니스 요구가 증가함에 따라 손쉽게 확장할 수 있는 멀티 테넌시 RAG 시스템을 효과적으로 설계하고 관리할 수 있습니다. Milvus의 아키텍처는 기업이 높은 수준의 격리, 보안 및 성능을 유지할 수 있도록 보장하므로 엔터프라이즈급 RAG 기반 지식 베이스를 구축하는 데 있어 중요한 구성 요소입니다.</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">멀티테넌시 RAG에 대한 더 많은 인사이트를 계속 지켜봐 주세요.<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>이 블로그에서는 Milvus의 멀티테넌시 전략이 테넌트는 관리하지만 테넌트 내의 최종 사용자는 관리하지 않도록 설계된 방법에 대해 설명했습니다. 최종 사용자 상호 작용은 일반적으로 애플리케이션 계층에서 이루어지며, 벡터 데이터베이스 자체는 이러한 사용자를 인식하지 못합니다.</p>
<p>궁금하실 수도 있습니다: <em>각 최종 사용자의 쿼리 기록을 기반으로 보다 정확한 답변을 제공하려면 Milvus가 각 사용자에 대한 개인화된 Q&amp;A 컨텍스트를 유지해야 하지 않나요?</em></p>
<p>좋은 질문이며, 그 답은 사용 사례에 따라 달라집니다. 예를 들어 온디맨드 상담 서비스에서는 쿼리가 무작위로 발생하며, 사용자의 과거 맥락을 추적하기보다는 지식창고의 품질에 중점을 둡니다.</p>
<p>그러나 다른 경우에는 RAG 시스템이 문맥을 인식해야 합니다. 이러한 경우 Milvus는 애플리케이션 계층과 협력하여 각 사용자의 컨텍스트에 대한 개인화된 메모리를 유지해야 합니다. 이 설계는 대규모 최종 사용자가 있는 애플리케이션에 특히 중요하며, 다음 포스트에서 더 자세히 살펴보겠습니다. 더 많은 인사이트를 기대해주세요!</p>
