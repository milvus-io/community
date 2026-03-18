---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: '시맨틱 검색의 프로덕션화: 에어테이블에서 벡터 인프라를 구축하고 확장한 방법'
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >-
  Airtable이 시맨틱 검색, 멀티테넌트 검색, 저지연 AI 환경을 위해 확장 가능한 Milvus 기반 벡터 인프라를 구축한 방법을
  알아보세요.
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>이 게시물은 원래</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Airtable Medium</a></em> <em>채널에 게시되었으며 허가를 받아 여기에 다시 게시되었습니다.</em></p>
<p>Airtable의 시맨틱 검색이 개념에서 핵심 제품 기능으로 발전함에 따라 데이터 인프라 팀은 이를 확장해야 하는 과제에 직면했습니다. 임베딩 <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">시스템 구축에 대한 이전 게시물에서</a> 자세히 설명했듯이, 우리는 이미 임베딩 수명 주기를 처리하기 위해 강력하고 궁극적으로 일관된 애플리케이션 계층을 설계했습니다. 하지만 아키텍처 다이어그램에서 한 가지 중요한 부분이 여전히 빠져 있었는데, 바로 벡터 데이터베이스 자체였습니다.</p>
<p>수십억 개의 임베딩을 색인 및 서비스하고, 대규모 멀티테넌시를 지원하며, 분산 클라우드 환경에서 성능 및 가용성 목표를 유지할 수 있는 스토리지 엔진이 필요했습니다. 이 글은 벡터 검색 플랫폼을 어떻게 설계하고, 강화하고, 발전시켜 Airtable 인프라 스택의 핵심 기둥이 되게 했는지에 대한 이야기입니다.</p>
<h2 id="Background" class="common-anchor-header">설립 배경<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Airtable의 목표는 고객이 강력하고 직관적인 방식으로 데이터를 활용할 수 있도록 돕는 것입니다. 점점 더 강력하고 정확한 LLM이 등장함에 따라 데이터의 시맨틱 의미를 활용하는 기능이 제품의 핵심이 되었습니다.</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">시맨틱 검색을 사용하는 방법<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">대규모 데이터 세트에서 실제 질문에 답하는 Omni(Airtable의 AI 채팅)</h3><p>50만 개의 행이 있는 데이터베이스에 자연어로 질문하고 문맥이 풍부한 정확한 답변을 얻는다고 상상해 보세요. 예를 들어</p>
<p>"최근 고객들이 배터리 수명에 대해 뭐라고 말하나요?"</p>
<p>소규모 데이터 세트에서는 모든 행을 LLM으로 직접 전송할 수 있습니다. 하지만 규모가 커지면 이는 금방 불가능해집니다. 대신 이를 수행할 수 있는 시스템이 필요했습니다:</p>
<ul>
<li>쿼리의 의미론적 의도 이해</li>
<li>벡터 유사도 검색을 통해 가장 관련성이 높은 행 검색</li>
<li>이러한 행을 LLM에 컨텍스트로 제공</li>
</ul>
<p>이 요구 사항은 이후 거의 모든 설계 결정에 영향을 미쳤습니다: Omni는 매우 큰 기반에서도 즉각적이고 지능적인 느낌을 주어야 했습니다.</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">연결된 레코드 추천: 정확한 일치 이상의 의미</h3><p>시맨틱 검색은 또한 Airtable의 핵심 기능인 연결된 레코드를 향상시킵니다. 사용자는 정확한 텍스트 일치보다는 문맥에 기반한 관계 제안이 필요합니다. 예를 들어, 프로젝트 설명은 특정 문구를 사용하지 않고도 '팀 인프라'와의 관계를 암시할 수 있습니다.</p>
<p>이러한 온디맨드 제안을 제공하려면 일관되고 예측 가능한 지연 시간으로 고품질의 시맨틱 검색이 필요합니다.</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">설계 우선 순위<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>이러한 기능 등을 지원하기 위해 저희는 4가지 목표를 중심으로 시스템을 설계했습니다:</p>
<ul>
<li><strong>짧은 지연 시간 쿼리(500ms p99):</strong> 예측 가능한 성능은 사용자 신뢰에 매우 중요합니다.</li>
<li><strong>높은 처리량 쓰기:</strong> 베이스는 지속적으로 변경되며, 임베딩은 동기화 상태를 유지해야 합니다.</li>
<li><strong>수평적 확장성:</strong> 시스템은 수백만 개의 독립적인 기반을 지원해야 합니다.</li>
<li><strong>자체 호스팅:</strong> 모든 고객 데이터는 Airtable이 제어하는 인프라 내에 유지되어야 합니다.</li>
</ul>
<p>이러한 목표는 이후 모든 아키텍처 결정에 영향을 미쳤습니다.</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">벡터 데이터베이스 공급업체 평가<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>2024년 말, 여러 벡터 데이터베이스 옵션을 평가한 결과 세 가지 주요 요구 사항에 따라 <a href="https://milvus.io/">Milvus를</a> 최종적으로 선택했습니다.</p>
<ul>
<li>첫째, 데이터 프라이버시를 보장하고 인프라를 세밀하게 제어할 수 있는 자체 호스팅 솔루션을 우선적으로 고려했습니다.</li>
<li>둘째, 쓰기 작업이 많은 워크로드와 버스트 쿼리 패턴으로 인해 탄력적으로 확장하면서 예측 가능한 낮은 지연 시간을 유지할 수 있는 시스템이 필요했습니다.</li>
<li>마지막으로, 우리 아키텍처는 수백만 개의 고객 테넌트에 걸쳐 강력한 격리가 필요했습니다.</li>
</ul>
<p>분산된 특성으로 대규모 멀티테넌시를 지원하고 수집, 인덱싱, 쿼리 실행을 독립적으로 확장할 수 있어 비용을 예측 가능하게 유지하면서 성능을 제공하는<strong>Milvus가</strong> 가장 적합한 솔루션으로 떠올랐죠.</p>
<h2 id="Architecture-Design" class="common-anchor-header">아키텍처 설계<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>기술을 선택한 후에는 서로 다른 고객들이 소유한 수백만 개의 서로 다른 '베이스'라는 Airtable의 고유한 데이터 형태를 표현하기 위한 아키텍처를 결정해야 했습니다.</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">파티셔닝 과제<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>두 가지 주요 데이터 파티셔닝 전략을 평가했습니다:</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">옵션 1: 공유 파티션</h3><p>여러 개의 베이스가 하나의 파티션을 공유하며, 쿼리는 베이스 ID를 기준으로 필터링하여 범위를 지정합니다. 이렇게 하면 리소스 사용률이 향상되지만 필터링 오버헤드가 추가로 발생하고 베이스 삭제가 더 복잡해집니다.</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">옵션 2: 파티션당 하나의 베이스</h3><p>각 Airtable 베이스는 Milvus에서 자체 물리적 파티션에 매핑됩니다. 이렇게 하면 강력한 격리 기능을 제공하고, 빠르고 간편하게 베이스를 삭제할 수 있으며, 쿼리 후 필터링으로 인한 성능 영향을 피할 수 있습니다.</p>
<h3 id="Final-Strategy" class="common-anchor-header">최종 전략</h3><p>저희는 단순하고 강력한 격리를 위해 옵션 2를 선택했습니다. 그러나 초기 테스트 결과, 단일 Milvus 컬렉션에 10만 개의 파티션을 생성하면 성능이 크게 저하되는 것으로 나타났습니다:</p>
<ul>
<li>파티션 생성 지연 시간이 ~20밀리초에서 ~250밀리초로 증가했습니다.</li>
<li>파티션 로드 시간이 30초를 초과했습니다.</li>
</ul>
<p>이 문제를 해결하기 위해 컬렉션당 파티션 수를 제한했습니다. 각 Milvus 클러스터에 대해 최대 1,000개의 파티션으로 구성된 400개의 컬렉션을 생성합니다. 이렇게 하면 클러스터당 총 베이스 수가 40만 개로 제한되며, 추가 고객이 온보딩되면 새 클러스터가 프로비저닝됩니다.</p>
<h2 id="Indexing--Recall" class="common-anchor-header">인덱싱 및 리콜<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>인덱스 선택은 우리 시스템에서 가장 중요한 트레이드오프 중 하나였습니다. 파티션이 로드되면 해당 인덱스는 메모리 또는 디스크에 캐시됩니다. 리콜률, 인덱스 크기, 성능 간의 균형을 맞추기 위해 몇 가지 인덱스 유형을 벤치마킹했습니다.</p>
<ul>
<li><strong>IVF-SQ8:</strong> 작은 메모리 공간을 제공하지만 리콜률이 낮습니다.</li>
<li><strong>HNSW:</strong> 최고의 리콜률(99%-100%)을 제공하지만 메모리를 많이 사용합니다.</li>
<li><strong>DiskANN:</strong> HNSW와 유사한 리콜을 제공하지만 쿼리 지연 시간이 더 길다.</li>
</ul>
<p>궁극적으로 우수한 리콜 및 성능 특성으로 인해 HNSW를 선택했습니다.</p>
<h2 id="The-Application-layer" class="common-anchor-header">애플리케이션 계층<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>높은 수준에서 Airtable의 시맨틱 검색 파이프라인은 두 가지 핵심 흐름으로 구성됩니다:</p>
<ol>
<li><strong>수집 흐름:</strong> Airtable 행을 임베딩으로 변환하여 Milvus에 저장합니다.</li>
<li><strong>쿼리 흐름:</strong> 사용자 쿼리를 임베드하고, 관련 행 ID를 검색하고, LLM에 컨텍스트를 제공합니다.</li>
</ol>
<p>두 흐름 모두 규모에 맞게 지속적이고 안정적으로 작동해야 하며, 아래에서 각각에 대해 설명합니다. 아래에서 각각을 살펴보겠습니다.</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">수집 흐름: Milvus와 Airtable의 동기화 유지<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>사용자가 Omni를 열면 Airtable이 Milvus와 동기화를 시작합니다. 파티션을 생성한 다음, 행을 청크 단위로 처리하여 임베딩을 생성하고 Milvus에 업서트합니다. 그 다음부터는 베이스에 대한 변경 사항을 캡처하고 해당 행을 다시 임베드하고 업서트하여 데이터의 일관성을 유지합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">쿼리 흐름: 데이터 사용 방법<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>쿼리 측면에서는 사용자의 요청을 임베드하고 이를 Milvus로 전송하여 가장 관련성이 높은 행 ID를 검색합니다. 그런 다음 해당 행의 최신 버전을 가져와 LLM에 대한 요청에 컨텍스트로 포함합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">운영상의 어려움과 해결 방법<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>시맨틱 검색 아키텍처를 구축하는 것도 하나의 과제이지만, 수십만 개의 베이스에 대해 이를 안정적으로 실행하는 것은 또 다른 과제입니다. 다음은 그 과정에서 얻은 몇 가지 주요 운영상의 교훈입니다.</p>
<h3 id="Deployment" class="common-anchor-header">배포</h3><p>우리는 <a href="https://github.com/zilliztech/milvus-operator">Milvus 운영자와</a> 함께 Kubernetes CRD를 통해 Milvus를 배포하여 선언적으로 클러스터를 정의하고 관리할 수 있습니다. 구성 업데이트, 클라이언트 개선, Milvus 업그레이드 등 모든 변경 사항은 사용자에게 배포하기 전에 단위 테스트와 프로덕션 트래픽을 시뮬레이션하는 온디맨드 로드 테스트를 통해 실행됩니다.</p>
<p>버전 2.5에서 Milvus 클러스터는 이러한 핵심 구성 요소로 구성됩니다:</p>
<ul>
<li>쿼리 노드는 벡터 인덱스를 메모리에 보관하고 벡터 검색을 실행합니다.</li>
<li>데이터 노드는 수집과 압축을 처리하고 새로운 데이터를 저장소에 유지합니다.</li>
<li>인덱스 노드는 데이터가 증가함에 따라 빠른 검색을 유지하기 위해 벡터 인덱스를 구축하고 유지합니다.</li>
<li>코디네이터 노드는 모든 클러스터 활동과 샤드 할당을 오케스트레이션합니다.</li>
<li>프록시 노드는 API 트래픽을 라우팅하고 노드 간 부하를 분산시킵니다.</li>
<li>내부 메시징 및 데이터 흐름을 위한 로그/스트리밍 백본을 제공하는 Kafka</li>
<li>Etcd는 클러스터 메타데이터와 조정 상태를 저장합니다.</li>
</ul>
<p>CRD 기반 자동화와 엄격한 테스트 파이프라인을 통해 업데이트를 빠르고 안전하게 배포할 수 있습니다.</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">관찰 가능성: 시스템 상태 엔드투엔드 이해<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>시맨틱 검색이 빠르고 예측 가능한 상태를 유지할 수 있도록 두 가지 수준에서 시스템을 모니터링합니다.</p>
<p>인프라 수준에서는 모든 Milvus 구성 요소에서 CPU, 메모리 사용량, 포드 상태를 추적합니다. 이러한 신호는 클러스터가 안전한 한도 내에서 작동하고 있는지 여부를 알려주며 리소스 포화나 건강하지 않은 노드와 같은 문제가 사용자에게 영향을 미치기 전에 포착하는 데 도움이 됩니다.</p>
<p>서비스 계층에서는 각 기반이 수집 및 쿼리 워크로드를 얼마나 잘 처리하고 있는지에 중점을 둡니다. 압축 및 인덱싱 처리량과 같은 메트릭을 통해 데이터가 얼마나 효율적으로 수집되고 있는지에 대한 가시성을 확보할 수 있습니다. 쿼리 성공률과 지연 시간을 통해 데이터를 쿼리하는 사용자 환경을 파악할 수 있으며, 파티션 증가를 통해 데이터가 어떻게 증가하고 있는지 알 수 있으므로 확장해야 할 경우 알림을 받을 수 있습니다.</p>
<h2 id="Node-Rotation" class="common-anchor-header">노드 로테이션<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>보안과 규정 준수를 위해 정기적으로 Kubernetes 노드를 교체합니다. 벡터 검색 클러스터에서 이것은 사소한 일이 아닙니다:</p>
<ul>
<li>쿼리 노드가 순환되면 코디네이터가 쿼리 노드 간에 인메모리 데이터의 균형을 재조정합니다.</li>
<li>Kafka와 Etcd는 상태 저장 정보를 저장하며 쿼럼과 지속적인 가용성을 필요로 합니다.</li>
</ul>
<p>엄격한 중단 예산과 한 번에 한 노드씩 로테이션 정책으로 이 문제를 해결합니다. Milvus 코디네이터는 다음 노드가 순환되기 전에 리밸런싱할 시간이 주어집니다. 이러한 신중한 오케스트레이션은 속도를 늦추지 않으면서도 안정성을 유지합니다.</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">콜드 파티션 오프로딩<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>운영상 가장 큰 성과 중 하나는 데이터에 명확한 핫/콜드 액세스 패턴이 있다는 것을 인식한 것입니다. 사용량을 분석한 결과, Milvus에서 일주일에 단 25%의 데이터만 쓰거나 읽는다는 사실을 발견했습니다. Milvus를 사용하면 전체 파티션을 오프로드하여 쿼리 노드의 메모리를 확보할 수 있습니다. 나중에 해당 데이터가 필요한 경우 몇 초 내에 다시 로드할 수 있습니다. 이를 통해 핫 데이터는 메모리에 보관하고 나머지는 오프로드하여 비용을 절감하고 시간이 지남에 따라 보다 효율적으로 확장할 수 있습니다.</p>
<h2 id="Data-Recovery" class="common-anchor-header">데이터 복구<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 광범위하게 배포하기 전에 어떤 장애 시나리오에서도 신속하게 복구할 수 있다는 확신이 필요했습니다. 대부분의 문제는 클러스터의 기본 제공 내결함성으로 해결되지만, 드물게 데이터가 손상되거나 시스템이 복구 불가능한 상태가 될 수 있는 경우를 대비해 계획했습니다.</p>
<p>이러한 상황에서는 복구 경로가 간단합니다. 먼저 새로운 Milvus 클러스터를 가동하여 거의 즉시 트래픽 서비스를 재개할 수 있습니다. 새 클러스터가 가동되면 가장 일반적으로 사용되는 기지를 선제적으로 다시 임베드한 다음 나머지 기지는 액세스되는 대로 느리게 처리합니다. 이렇게 하면 가장 많이 액세스되는 데이터의 다운타임을 최소화하는 동시에 시스템이 일관된 시맨틱 인덱스를 점진적으로 재구축할 수 있습니다.</p>
<h2 id="What’s-Next" class="common-anchor-header">다음 단계<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus와의</a> 협력을 통해 Airtable의 시맨틱 검색은 빠르고 의미 있는 AI 경험을 대규모로 제공할 수 있는 강력한 기반을 마련했습니다. 이 시스템이 구축됨에 따라 이제 더 풍부한 검색 파이프라인과 제품 전반에 걸친 심층적인 AI 통합을 모색하고 있습니다. 앞으로 흥미로운 작업이 많이 남아있으며 이제 시작에 불과합니다.</p>
<p><em>이 프로젝트에 기여해 주신 데이터 인프라스트럭처의 모든 과거 및 현재 에어테이블과 조직 전체에 감사드립니다: 알렉스 소로킨, 앤드류 왕, 아리아 말카니, 콜 디어몬-무어, 나빌 파루키, 윌 파월슨, 샤오빙 시아.</em></p>
<h2 id="About-Airtable" class="common-anchor-header">에어테이블 소개<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">에어테이블은</a> 조직이 맞춤형 앱을 구축하고, 워크플로우를 자동화하고, 공유 데이터를 엔터프라이즈 규모로 관리할 수 있도록 지원하는 선도적인 디지털 운영 플랫폼입니다. 복잡한 교차 기능 프로세스를 지원하도록 설계된 Airtable은 팀이 공유 소스를 기반으로 계획, 조정 및 실행을 위한 유연한 시스템을 구축할 수 있도록 지원합니다. Airtable이 AI 기반 플랫폼을 확장함에 따라 Milvus와 같은 기술은 더 빠르고 스마트한 제품 경험을 제공하는 데 필요한 검색 인프라를 강화하는 데 중요한 역할을 합니다.</p>
