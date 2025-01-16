---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: 'Elasticsearch는 죽었다, 어휘 검색은 살아있다'
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>이제 하이브리드 검색이 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (검색 증강 세대) 검색 품질을 향상시켰다는 사실은 누구나 알고 계실 것입니다. <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">고밀도 임베딩</a> 검색은 쿼리와 문서 간의 깊은 의미론적 관계를 포착하는 데 있어 인상적인 기능을 보여주었지만, 여전히 주목할 만한 한계가 있습니다. 여기에는 설명 가능성 부족과 롱테일 쿼리 및 희귀 용어에 대한 최적화되지 않은 성능이 포함됩니다.</p>
<p>사전 학습된 모델에는 도메인 관련 지식이 부족한 경우가 많기 때문에 많은 RAG 애플리케이션이 어려움을 겪고 있습니다. 일부 시나리오에서는 단순한 BM25 키워드 매칭이 이러한 정교한 모델보다 성능이 더 뛰어난 경우도 있습니다. 바로 이 부분에서 하이브리드 검색은 고밀도 벡터 검색의 의미론적 이해와 키워드 매칭의 정확성을 결합하여 그 격차를 해소합니다.</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">하이브리드 검색이 프로덕션 환경에서 복잡한 이유<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/LangChain">LangChain이나</a> <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex와</a> 같은 프레임워크를 사용하면 개념 증명 하이브리드 리트리버를 쉽게 구축할 수 있지만, 대규모 데이터 세트로 프로덕션으로 확장하는 것은 어렵습니다. 기존 아키텍처에서는 별도의 벡터 데이터베이스와 검색 엔진이 필요하기 때문에 몇 가지 주요 문제가 발생합니다:</p>
<ul>
<li><p>높은 인프라 유지보수 비용과 운영 복잡성</p></li>
<li><p>여러 시스템에 걸친 데이터 중복성</p></li>
<li><p>데이터 일관성 관리의 어려움</p></li>
<li><p>시스템 전반의 복잡한 보안 및 액세스 제어</p></li>
</ul>
<p>시장에서는 시스템 복잡성과 비용을 줄이면서 어휘 및 시맨틱 검색을 지원하는 통합 솔루션이 필요합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Elasticsearch의 문제점<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch는 지난 10년간 가장 영향력 있는 오픈 소스 검색 프로젝트 중 하나였습니다. Apache Lucene을 기반으로 구축된 이 프로젝트는 고성능, 확장성, 분산 아키텍처를 통해 인기를 얻었습니다. 버전 8.0에서 벡터 ANN 검색이 추가되었지만, 프로덕션 배포는 몇 가지 중요한 문제에 직면해 있습니다:</p>
<p><strong>높은 업데이트 및 색인 비용:</strong> Elasticsearch의 아키텍처는 쓰기 작업, 색인 생성, 쿼리를 완전히 분리하지 않습니다. 이로 인해 쓰기 작업 중, 특히 대량 업데이트에서 상당한 CPU 및 I/O 오버헤드가 발생합니다. 인덱싱과 쿼리 간의 리소스 경합은 성능에 영향을 미치며, 빈도가 높은 업데이트 시나리오에서 주요 병목 현상을 일으킵니다.</p>
<p><strong>실시간 성능 저하:</strong> "거의 실시간에 가까운" 검색 엔진인 Elasticsearch는 데이터 가시성에서 눈에 띄는 지연 시간을 발생시킵니다. 이러한 지연 시간은 빈번한 상호 작용과 동적 의사 결정이 즉각적인 데이터 액세스를 필요로 하는 에이전트 시스템과 같은 AI 애플리케이션에서 특히 문제가 됩니다.</p>
<p><strong>어려운 샤드 관리:</strong> Elasticsearch는 분산 아키텍처를 위해 샤딩을 사용하지만 샤드 관리에는 상당한 어려움이 있습니다. 동적 샤딩 지원이 부족하기 때문에 작은 데이터 세트에 샤드가 너무 많으면 성능이 저하되고, 큰 데이터 세트에 샤드가 너무 적으면 확장성이 제한되고 데이터 분포가 고르지 않게 되는 딜레마가 생깁니다.</p>
<p><strong>비클라우드 네이티브 아키텍처:</strong> 클라우드 네이티브 아키텍처가 널리 보급되기 전에 개발된 Elasticsearch의 설계는 스토리지와 컴퓨팅을 긴밀하게 결합하여 퍼블릭 클라우드나 Kubernetes와 같은 최신 인프라와의 통합을 제한합니다. 리소스를 확장하려면 스토리지와 컴퓨팅을 동시에 늘려야 하므로 유연성이 떨어집니다. 다중 복제본 시나리오에서는 각 샤드가 독립적으로 인덱스를 구축해야 하므로 컴퓨팅 비용이 증가하고 리소스 효율성이 떨어집니다.</p>
<p><strong>열악한 벡터 검색 성능:</strong> Elasticsearch 8.0은 벡터 ANN 검색을 도입했지만, 그 성능은 Milvus와 같은 전용 벡터 엔진에 비해 상당히 뒤떨어집니다. Lucene 커널을 기반으로 하는 인덱스 구조는 고차원 데이터에 대해 비효율적이며 대규모 벡터 검색 요구 사항에 어려움을 겪고 있습니다. 특히 스칼라 필터링과 멀티테넌시가 포함된 복잡한 시나리오에서는 성능이 불안정해져 부하가 높거나 다양한 비즈니스 요구 사항을 지원하기 어렵습니다.</p>
<p><strong>과도한 리소스 소비:</strong> Elasticsearch는 특히 대규모 데이터를 처리할 때 메모리와 CPU에 대한 요구가 매우 높습니다. JVM 종속성으로 인해 힙 크기를 자주 조정하고 가비지 수집을 조정해야 하므로 메모리 효율성에 심각한 영향을 미칩니다. 벡터 검색 작업은 집중적인 SIMD 최적화 계산을 필요로 하는데, JVM 환경은 이에 적합하지 않습니다.</p>
<p>이러한 근본적인 한계는 조직이 AI 인프라를 확장함에 따라 점점 더 문제가 되고 있으며, 고성능과 안정성이 요구되는 최신 AI 애플리케이션에서 Elasticsearch는 특히 문제가 되고 있습니다.</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Sparse-BM25 소개: 어휘 검색의 재구상<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5는</a> 버전 2.4에 도입된 하이브리드 검색 기능을 기반으로 Sparse-BM25를 통해 기본 어휘 검색 지원을 도입합니다. 이 혁신적인 접근 방식에는 다음과 같은 주요 구성 요소가 포함됩니다:</p>
<ul>
<li><p>Tantivy를 통한 고급 토큰화 및 전처리</p></li>
<li><p>분산 어휘 및 용어 빈도 관리</p></li>
<li><p>코퍼스 TF와 쿼리 TF-IDF를 사용한 스파스 벡터 생성</p></li>
<li><p>WAND 알고리즘을 통한 역 인덱스 지원(블록-맥스 WAND 및 그래프 인덱스 지원은 개발 중)</p></li>
</ul>
<p>Elasticsearch에 비해 Milvus는 알고리즘 유연성에서 상당한 이점을 제공합니다. 벡터 거리 기반 유사도 계산을 통해 "엔드 투 엔드 쿼리 용어 가중치" 연구에 기반한 TW-BERT(용어 가중치 BERT)를 구현하는 등 보다 정교한 매칭을 가능하게 합니다. 이 접근 방식은 도메인 내 테스트와 도메인 외 테스트 모두에서 우수한 성능을 입증했습니다.</p>
<p>또 다른 중요한 장점은 비용 효율성입니다. 밀버스는 역 인덱스와 고밀도 임베딩 압축을 모두 활용함으로써 1% 미만의 리콜 성능 저하로 5배의 성능 향상을 달성했습니다. 테일텀 프루닝과 벡터 양자화를 통해 메모리 사용량을 50% 이상 줄였습니다.</p>
<p>특히 긴 쿼리 최적화가 두드러집니다. 기존의 WAND 알고리즘이 긴 쿼리에서 어려움을 겪었던 반면, Milvus는 희소 임베딩과 그래프 인덱스를 결합하여 고차원 희소 벡터 검색 시나리오에서 10배의 성능 향상을 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus: RAG를 위한 궁극의 벡터 데이터베이스<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 포괄적인 기능 세트를 통해 RAG 애플리케이션을 위한 최고의 선택입니다. 주요 장점은 다음과 같습니다:</p>
<ul>
<li><p>동적 스키마 기능 및 강력한 필터링 옵션으로 풍부한 메타데이터 지원</p></li>
<li><p>컬렉션, 파티션, 파티션 키를 통한 유연한 격리를 지원하는 엔터프라이즈급 멀티테넌시</p></li>
<li><p>메모리에서 S3에 이르는 멀티 티어 스토리지로 업계 최초의 디스크 벡터 인덱스 지원</p></li>
<li><p>10M에서 1B+ 벡터까지 원활한 확장을 지원하는 클라우드 네이티브 확장성</p></li>
<li><p>그룹화, 범위, 하이브리드 검색을 포함한 포괄적인 검색 기능</p></li>
<li><p>LangChain, LlamaIndex, Dify 및 기타 AI 도구와의 긴밀한 에코시스템 통합</p></li>
</ul>
<p>시스템의 다양한 검색 기능에는 그룹화, 범위, 하이브리드 검색 방법론이 포함됩니다. LangChain, LlamaIndex, Dify와 같은 도구와의 긴밀한 통합은 물론 수많은 AI 제품을 지원함으로써 Milvus는 최신 AI 인프라 생태계의 중심에 서게 되었습니다.</p>
<h2 id="Looking-Forward" class="common-anchor-header">앞으로의 전망<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>AI가 POC에서 생산 단계로 전환됨에 따라 Milvus는 계속 진화하고 있습니다. 검색 품질을 향상시키면서 벡터 검색의 접근성과 비용 효율성을 높이는 데 주력하고 있습니다. 스타트업이든 대기업이든 Milvus는 AI 애플리케이션 개발의 기술적 장벽을 낮춰줍니다.</p>
<p>접근성과 혁신에 대한 이러한 노력은 또 다른 중요한 진전으로 이어졌습니다. 당사의 오픈 소스 솔루션은 전 세계 수천 개의 애플리케이션의 기반이 되고 있지만, 많은 조직에서 운영 오버헤드를 없애는 완전 관리형 솔루션이 필요하다는 것을 잘 알고 있습니다.</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">바로 질리즈 클라우드입니다: 관리형 솔루션<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>저희는 지난 3년 동안 Milvus 기반의 완전 관리형 벡터 데이터베이스 서비스인 <a href="https://zilliz.com/cloud">Zilliz Cloud를</a> 구축했습니다. Milvus 프로토콜을 클라우드 네이티브로 재구현하여 사용성, 비용 효율성 및 보안을 강화했습니다.</p>
<p>세계 최대 규모의 벡터 검색 클러스터를 유지 관리하고 수천 명의 AI 애플리케이션 개발자를 지원한 경험을 바탕으로 Zilliz Cloud는 자체 호스팅 솔루션에 비해 운영 오버헤드와 비용을 크게 줄여줍니다.</p>
<p>벡터 검색의 미래를 경험할 준비가 되셨나요? 신용 카드 없이도 최대 200달러의 크레딧으로 지금 무료 체험을 시작하세요.</p>
