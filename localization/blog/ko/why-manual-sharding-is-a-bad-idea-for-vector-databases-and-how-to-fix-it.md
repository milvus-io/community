---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: 수동 샤딩이 벡터 데이터베이스에 나쁜 아이디어인 이유와 해결 방법
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  수동 벡터 데이터베이스 샤딩이 병목 현상을 일으키는 이유와 Milvus의 자동 확장이 어떻게 엔지니어링 오버헤드를 제거하여 원활한 성장을
  지원하는지 알아보세요.
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_300b84a4d9.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p><em>"처음에는 모든 관계형 데이터가 이미 PostgreSQL에 있었기 때문에 Milvus 대신 pgvector에 시맨틱 검색을 구축했습니다</em>."라고 한 엔터프라이즈 AI SaaS 스타트업의 CTO인 Alex는 회상합니다. <em>"하지만 제품 시장 적합성에 도달하자마자 엔지니어링 측면에서 심각한 장애물에 부딪혔습니다. pgvector가 확장성을 위해 설계되지 않았다는 사실이 금방 드러났습니다. 여러 샤드에 걸쳐 스키마 업데이트를 배포하는 것과 같은 간단한 작업은 지루하고 오류가 발생하기 쉬운 프로세스로 바뀌어 며칠의 엔지니어링 노력이 소모되었습니다. 1억 개의 벡터 임베딩에 도달했을 때는 쿼리 지연 시간이 1초 이상으로 급증하여 고객이 감내할 수 있는 수준을 훨씬 넘어섰습니다. Milvus로 이전한 후 수작업으로 샤딩을 하는 것은 마치 석기 시대로 돌아가는 것 같았습니다. 샤드 서버를 마치 깨지기 쉬운 유물처럼 다루는 것은 재미가 없습니다. 어떤 회사도 그런 고통을 감내해서는 안 됩니다."</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">AI 기업의 공통 과제<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>알렉스의 경험은 비단 pgvector 사용자에게만 국한된 것이 아닙니다. pgvector, Qdrant, Weaviate 또는 수동 샤딩에 의존하는 다른 벡터 데이터베이스를 사용하든, 확장 문제는 동일하게 남아 있습니다. 관리하기 쉬운 솔루션으로 시작한 것이 데이터 볼륨이 증가하면 금세 기술 부채로 변합니다.</p>
<p>오늘날 스타트업에게 <strong>확장성은 선택이 아니라</strong> 필수입니다. 특히 대규모 언어 모델(LLM)과 벡터 데이터베이스로 구동되는 AI 제품의 경우, 초기 도입에서 기하급수적인 성장으로 하룻밤 사이에 도약할 수 있습니다. 제품 시장 적합성을 달성하면 사용자 증가, 압도적인 데이터 유입, 쿼리 수요의 급증을 유발하는 경우가 많습니다. 그러나 데이터베이스 인프라가 이를 따라잡지 못하면 쿼리 속도가 느려지고 운영 비효율성으로 인해 추진력이 떨어지고 비즈니스 성공에 장애가 될 수 있습니다.</p>
<p>단기적인 기술적 결정이 장기적인 병목 현상으로 이어져 엔지니어링 팀이 혁신에 집중하는 대신 긴급한 성능 문제, 데이터베이스 충돌 및 시스템 장애를 지속적으로 해결해야 할 수도 있습니다. 최악의 시나리오는? 바로 기업이 확장해야 할 시기에 많은 비용과 시간이 소요되는 데이터베이스 재구축입니다.</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">샤딩은 확장성을 위한 자연스러운 해결책이 아닐까요?<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>확장성은 여러 가지 방법으로 해결할 수 있습니다. 가장 간단한 접근 방식인 <strong>스케일업은</strong> 증가하는 데이터 볼륨을 수용하기 위해 CPU, 메모리 또는 스토리지를 추가하여 단일 시스템의 리소스를 향상시키는 것입니다. 이 방법은 간단하지만 분명한 한계가 있습니다. 예를 들어, Kubernetes 환경에서는 대규모 파드는 비효율적이며 단일 노드에 의존하면 장애 위험이 높아져 심각한 다운타임으로 이어질 수 있습니다.</p>
<p>스케일 업이 더 이상 실행 가능하지 않은 경우, 기업은 자연스럽게 여러 서버에 데이터를 분산하는 <strong>스케일 아웃으로</strong> 전환합니다. 언뜻 보기에 <strong>샤딩은</strong> 데이터베이스를 더 작고 독립적인 데이터베이스로 분할하여 용량을 늘리고 쓰기 가능한 기본 노드를 여러 개 사용하는 간단한 솔루션처럼 보입니다.</p>
<p>그러나 개념적으로는 간단하지만 실제로 샤딩은 매우 복잡한 문제가 됩니다. 대부분의 애플리케이션은 처음에 하나의 통합된 데이터베이스로 작동하도록 설계되어 있습니다. 벡터 데이터베이스가 여러 개의 샤드로 분할되는 순간, 데이터와 상호 작용하는 애플리케이션의 모든 부분을 수정하거나 완전히 다시 작성해야 하므로 상당한 개발 오버헤드가 발생하게 됩니다. 데이터가 올바른 샤드로 전달되도록 라우팅 로직을 구현하는 것과 마찬가지로 효과적인 샤딩 전략을 설계하는 것도 매우 중요합니다. 여러 샤드에서 아토믹 트랜잭션을 관리하려면 샤드 간 작업을 피하기 위해 애플리케이션을 재구성해야 하는 경우가 많습니다. 또한, 특정 샤드를 사용할 수 없게 될 때 중단이 발생하지 않도록 장애 시나리오를 원활하게 처리해야 합니다.</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">수동 샤딩이 부담이 되는 이유<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p><em>&quot;저희</em> 는<em>원래 엔지니어 2명이 약 6개월 정도 소요될 것으로 예상했습니다</em>.&quot;라고 Alex는 회상합니다. <em>&quot;이러한 엔지니어가</em> <strong><em>항상</em></strong> <em>필요하다는</em> <em> 것을 깨닫지 못했습니다</em>. <em>모든 스키마 변경, 데이터 재조정 작업 또는 확장 결정에는 엔지니어의 전문 지식이 필요했습니다. 우리는 데이터베이스를 계속 운영하기 위해 영구적인 '샤딩 팀'을 구성하고 있었습니다.&quot;</em></p>
<p>샤딩된 벡터 데이터베이스의 실제 문제점은 다음과 같습니다:</p>
<ol>
<li><p><strong>데이터 분산 불균형(핫스팟</strong>): 멀티테넌트 사용 사례에서 데이터 배포는 테넌트당 수백에서 수십억 개의 벡터에 달할 수 있습니다. 이러한 불균형으로 인해 특정 샤드는 과부하가 걸리는 반면 다른 샤드는 유휴 상태가 되는 핫스팟이 발생합니다.</p></li>
<li><p><strong>리샤딩의 골칫거리</strong>: 적절한 샤드 수를 선택하는 것은 거의 불가능에 가깝습니다. 샤드 수가 너무 적으면 리샤딩 작업이 빈번하고 비용이 많이 듭니다. 너무 많으면 불필요한 메타데이터 오버헤드가 발생하여 복잡성이 증가하고 성능이 저하됩니다.</p></li>
<li><p><strong>스키마 변경 복잡성</strong>: 많은 벡터 데이터베이스는 여러 개의 기본 데이터베이스를 관리하여 샤딩을 구현합니다. 따라서 샤드 간에 스키마 변경 사항을 동기화하는 작업이 번거롭고 오류가 발생하기 쉬우며 개발 주기가 느려집니다.</p></li>
<li><p><strong>리소스 낭비</strong>: 스토리지-컴퓨팅 결합 데이터베이스에서는 향후 성장을 예측하면서 모든 노드에 리소스를 세심하게 할당해야 합니다. 일반적으로 리소스 사용률이 60~70%에 도달하면 리샤딩 계획을 세워야 합니다.</p></li>
</ol>
<p>간단히 말해, <strong>샤드를 수동으로 관리하는 것은 비즈니스에 좋지</strong> 않습니다. 엔지니어링 팀을 지속적인 샤드 관리에 묶어두는 대신, 운영 부담 없이 자동으로 확장되도록 설계된 벡터 데이터베이스에 투자하는 것을 고려해 보세요.</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Milvus가 확장성 문제를 해결하는 방법<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>스타트업부터 대기업에 이르기까지 많은 개발자들이 수동 데이터베이스 샤딩과 관련된 상당한 오버헤드를 인식하고 있습니다. Milvus는 근본적으로 다른 접근 방식을 채택하여 복잡성 없이 수백만에서 수십억 개의 벡터를 원활하게 확장할 수 있습니다.</p>
<h3 id="Automated-Scaling-Without-the-Engineering-Tax" class="common-anchor-header">엔지니어링 비용 없이 자동화된 확장</h3><p>Milvus는 Kubernetes와 분리된 스토리지-컴퓨팅 아키텍처를 활용하여 원활한 확장을 지원합니다. 이러한 설계는 다음을 가능하게 합니다:</p>
<ul>
<li><p>변화하는 수요에 대응하는 신속한 확장</p></li>
<li><p>사용 가능한 모든 노드에서 자동 로드 밸런싱</p></li>
<li><p>독립적인 리소스 할당으로 컴퓨팅, 메모리, 스토리지를 개별적으로 조정할 수 있습니다.</p></li>
<li><p>급격한 성장기에도 일관된 고성능 유지</p></li>
</ul>
<h3 id="How-Milvus-Scales-The-Technical-Foundation" class="common-anchor-header">Milvus의 확장 방식: 기술 기반</h3><p>Milvus는 두 가지 주요 혁신을 통해 확장 기능을 달성합니다:</p>
<p><strong>세그먼트 기반 아키텍처:</strong> Milvus의 핵심은 데이터를 가장 작은 데이터 관리 단위인 '세그먼트'로 구성하는 것입니다:</p>
<ul>
<li><p>성장하는 세그먼트는 스트림노드에 상주하며 실시간 쿼리를 위해 데이터 최신성을 최적화합니다.</p></li>
<li><p>봉인된 세그먼트는 강력한 인덱스를 활용하여 검색을 가속화하는 쿼리노드에서 관리합니다.</p></li>
<li><p>이러한 세그먼트는 병렬 처리를 최적화하기 위해 노드에 고르게 분산되어 있습니다.</p></li>
</ul>
<p><strong>2계층 라우팅</strong>: 각 샤드가 단일 머신에 존재하는 기존 데이터베이스와 달리, Milvus는 하나의 샤드에 있는 데이터를 여러 노드에 동적으로 분산합니다:</p>
<ul>
<li><p>각 샤드는 10억 개 이상의 데이터 포인트를 저장할 수 있습니다.</p></li>
<li><p>각 샤드 내의 세그먼트는 머신 간에 자동으로 균형을 맞춥니다.</p></li>
<li><p>컬렉션 확장은 샤드 수를 늘리는 것만큼이나 간단합니다.</p></li>
<li><p>곧 출시될 Milvus 3.0에서는 동적 샤드 분할을 도입하여 이러한 최소한의 수동 단계마저 제거할 예정입니다.</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">대규모 쿼리 처리</h3><p>쿼리를 실행할 때 Milvus는 효율적인 프로세스를 따릅니다:</p>
<ol>
<li><p>프록시가 요청된 수집과 관련된 샤드를 식별합니다.</p></li>
<li><p>프록시는 스트림노드와 쿼리노드 모두에서 데이터를 수집합니다.</p></li>
<li><p>스트림노드는 실시간 데이터를 처리하고 쿼리노드는 과거 데이터를 동시에 처리합니다.</p></li>
<li><p>결과가 집계되어 사용자에게 반환됩니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">차원이 다른 엔지니어링 경험<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><em>"확장성이 데이터베이스 자체에 내장되면 모든 골칫거리가 사라집니다</em>."라고 Alex는 Milvus로 전환한 자신의 팀을 회상하며 이렇게 말합니다. <em>"엔지니어들은 데이터베이스 샤드를 돌보는 대신 고객이 좋아하는 기능을 구축하는 데 집중할 수 있게 되었습니다."</em></p>
<p>수동 샤딩의 엔지니어링 부담, 대규모 성능 병목 현상, 데이터베이스 마이그레이션의 막막한 전망으로 고민하고 계신다면, 접근 방식을 재고해 보셔야 할 때입니다. <a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">문서 페이지를</a> 방문하여 Milvus 아키텍처에 대해 자세히 알아보거나 <a href="https://zilliz.com/cloud">zilliz.com/cloud에서</a> 완전 관리형 Milvus를 통해 간편한 확장성을 직접 경험해 보세요.</p>
<p>올바른 벡터 데이터베이스 기반과 함께라면 혁신의 한계는 없습니다.</p>
