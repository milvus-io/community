---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Milvus 벡터 데이터베이스의 일관성 수준 이해하기
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: 'Milvus 벡터 데이터베이스에서 지원되는 4가지 일관성 수준(강함, 경계가 있는 부실, 세션, 최종 지원)에 대해 알아보세요.'
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Cover_image</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/JackLCL">Chenglong Li가</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni가</a> 번역했습니다.</p>
</blockquote>
<p>Mlivus 벡터 데이터베이스에서 삭제한 데이터가 검색 결과에 계속 나타나는 이유가 궁금하신 적이 있으신가요?</p>
<p>가장 큰 이유는 애플리케이션에 적절한 일관성 수준을 설정하지 않았기 때문일 가능성이 높습니다. 분산형 벡터 데이터베이스의 일관성 수준은 시스템에서 특정 데이터 쓰기를 읽을 수 있는 시점을 결정하기 때문에 매우 중요합니다.</p>
<p>따라서 이 문서에서는 일관성의 개념을 명확히 이해하고 Milvus 벡터 데이터베이스에서 지원하는 일관성 수준을 자세히 살펴봅니다.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><a href="#What-is-consistency">일관성이란 무엇인가요?</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Milvus 벡터 데이터베이스의 4가지 일관성 수준</a><ul>
<li><a href="#Strong">강함</a></li>
<li><a href="#Bounded-staleness">경계가 있는 부실함</a></li>
<li><a href="#Session">세션</a></li>
<li><a href="#Eventual">최종</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">일관성이란 무엇인가요?<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>시작하기 전에 먼저 "일관성"이라는 단어는 컴퓨팅 업계에서 과부하가 걸린 용어이므로 이 글에서 일관성의 의미를 명확히 할 필요가 있습니다. 분산 데이터베이스에서 일관성이란 특정 시간에 데이터를 쓰거나 읽을 때 모든 노드 또는 복제본이 동일한 데이터 보기를 갖도록 보장하는 속성을 의미합니다. 따라서 여기서는 <a href="https://en.wikipedia.org/wiki/CAP_theorem">CAP 정리</a>에서와 같이 일관성에 대해 이야기하고 있습니다.</p>
<p>현대의 대규모 온라인 비즈니스에 서비스를 제공하기 위해 일반적으로 여러 복제본을 채택합니다. 예를 들어, 온라인 전자상거래 업체인 Amazon은 시스템 충돌이나 장애 발생 시 높은 시스템 가용성을 보장하기 위해 여러 데이터 센터, 지역, 심지어 국가에 걸쳐 주문 또는 SKU 데이터를 복제합니다. 이로 인해 여러 복제본에 걸친 데이터 일관성이라는 시스템 문제가 발생합니다. 일관성이 없으면 Amazon 카트에서 삭제된 품목이 다시 나타나 사용자 경험이 매우 나빠질 가능성이 매우 높습니다.</p>
<p>따라서 애플리케이션마다 서로 다른 데이터 일관성 수준이 필요합니다. 다행히도 AI용 데이터베이스인 Milvus는 일관성 수준의 유연성을 제공하며, 애플리케이션에 가장 적합한 일관성 수준을 설정할 수 있습니다.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 벡터 데이터베이스의 일관성 수준</h3><p>일관성 수준이라는 개념은 Milvus 2.0 출시와 함께 처음 도입되었습니다. Milvus 1.0 버전은 분산형 벡터 데이터베이스가 아니었기 때문에 당시에는 일관성 수준을 조정할 수 없었습니다. Milvus 1.0은 매초마다 데이터를 플러시하므로 새로운 데이터가 삽입되면 거의 즉시 볼 수 있으며, 벡터 유사성 검색이나 쿼리 요청이 들어오는 정확한 시점에 가장 업데이트된 데이터 뷰를 읽습니다.</p>
<p>그러나 Milvus는 2.0 버전에서 리팩터링되었으며, <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0은</a> 퍼브-서브 메커니즘에 기반한 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">분산형 벡터 데이터베이스입니다</a>. <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a> 정리에 따르면 분산 시스템은 일관성, 가용성, 지연 시간 사이에서 절충점을 찾아야 합니다. 또한 시나리오에 따라 서로 다른 수준의 일관성이 필요합니다. 따라서 <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0에는</a> 일관성 개념이 도입되어 일관성 수준 조정을 지원합니다.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 벡터 데이터베이스의 4가지 일관성 수준<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 네 가지 수준의 일관성을 지원합니다: 강함, 경계가 있는 부실함, 세션, 최종. 그리고 Milvus 사용자는 <a href="https://milvus.io/docs/v2.1.x/create_collection.md">컬렉션을 만들거나</a> <a href="https://milvus.io/docs/v2.1.x/search.md">벡터 유사성 검색</a> 또는 <a href="https://milvus.io/docs/v2.1.x/query.md">쿼리를</a> 수행할 때 일관성 수준을 지정할 수 있습니다. 이 섹션에서는 이 네 가지 일관성 수준이 어떻게 다른지, 그리고 어떤 시나리오에 가장 적합한지 계속 설명합니다.</p>
<h3 id="Strong" class="common-anchor-header">강함</h3><p>강함은 가장 높고 가장 엄격한 일관성 수준입니다. 사용자가 최신 버전의 데이터를 읽을 수 있도록 보장합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>강함</span> </span></p>
<p>PACELC 정리에 따르면 일관성 수준을 강함으로 설정하면 지연 시간이 증가합니다. 따라서 테스트 결과의 정확성을 보장하기 위해 기능 테스트 중에 강한 일관성을 선택하는 것이 좋습니다. 또한 강력한 일관성은 검색 속도를 희생하는 대신 데이터 일관성에 대한 엄격한 요구가 있는 애플리케이션에 가장 적합합니다. 주문 결제 및 청구를 처리하는 온라인 금융 시스템을 예로 들 수 있습니다.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">바운드 스탤런트</h3><p>이름에서 알 수 있듯이 경계부실성은 특정 기간 동안 데이터 불일치를 허용합니다. 그러나 일반적으로 데이터는 해당 기간 외에는 항상 전 세계적으로 일관성을 유지합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>Bounded_staleness</span> </span></p>
<p>바운드 스탤렌니스는 검색 지연 시간을 제어해야 하고 산발적인 데이터 보이지 않음을 허용할 수 있는 시나리오에 적합합니다. 예를 들어, 동영상 추천 엔진과 같은 추천 시스템에서 가끔씩 발생하는 데이터 숨김은 전체 회상률에 미치는 영향은 매우 작지만 추천 시스템의 성능을 크게 향상시킬 수 있습니다. 온라인 주문 상태를 추적하는 앱을 예로 들 수 있습니다.</p>
<h3 id="Session" class="common-anchor-header">세션</h3><p>세션은 모든 데이터 쓰기가 동일한 세션 동안 읽기에서 즉시 인식될 수 있도록 합니다. 즉, 하나의 클라이언트를 통해 데이터를 쓰면 새로 삽입된 데이터를 즉시 검색할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>세션</span> </span></p>
<p>동일한 세션에서 데이터 일관성에 대한 요구가 높은 시나리오에서는 일관성 수준으로 세션을 선택하는 것이 좋습니다. 예를 들어 라이브러리 시스템에서 도서 항목의 데이터를 삭제하고 삭제를 확인한 후 페이지를 새로고침(다른 세션)하면 해당 도서가 더 이상 검색 결과에 표시되지 않아야 합니다.</p>
<h3 id="Eventual" class="common-anchor-header">최종</h3><p>읽기 및 쓰기 순서는 보장되지 않으며, 더 이상의 쓰기 작업이 수행되지 않으면 복제본은 결국 동일한 상태로 수렴합니다. 최종 일관성에서는 복제본이 최신 업데이트된 값으로 읽기 요청에 대해 작업을 시작합니다. 최종 일관성은 네 가지 수준 중 가장 약한 수준입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>최종</span> </span></p>
<p>그러나 PACELC 정리에 따르면 일관성을 희생하면 검색 지연 시간을 엄청나게 단축할 수 있습니다. 따라서 최종 일관성은 데이터 일관성에 대한 요구는 높지 않지만 매우 빠른 검색 성능이 필요한 시나리오에 가장 적합합니다. 예를 들어 최종 일관성을 사용하여 Amazon 제품에 대한 리뷰 및 평점을 검색하는 경우를 들 수 있습니다.</p>
<h2 id="Endnote" class="common-anchor-header">Endnote<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>이 글의 서두에서 제기한 질문으로 돌아가서, 사용자가 적절한 일관성 수준을 선택하지 않았기 때문에 삭제된 데이터가 여전히 검색 결과로 반환됩니다. 일관성 수준의 기본값은 Milvus 벡터 데이터베이스에서 경계 부실(<code translate="no">Bounded</code>)입니다. 따라서 데이터 읽기가 지연될 수 있으며 유사성 검색 또는 쿼리 중에 사용자가 삭제 작업을 수행하기 전에 Milvus가 데이터 보기를 읽을 수 있습니다. 하지만 이 문제는 간단하게 해결할 수 있습니다. 컬렉션을 만들거나 벡터 유사도 검색 또는 쿼리를 수행할 때 <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">일관성 수준을 조정하기만</a> 하면 됩니다. 간단하죠!</p>
<p>다음 포스트에서는 Milvus 벡터 데이터베이스가 어떻게 다양한 수준의 일관성을 달성하는지에 대한 메커니즘을 공개하고 설명해 드리겠습니다. 기대해 주세요!</p>
<h2 id="Whats-next" class="common-anchor-header">다음 단계<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1의 공식 출시와 함께 새로운 기능을 소개하는 블로그 시리즈를 준비했습니다. 이 블로그 시리즈에서 자세히 읽어보세요:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">문자열 데이터를 사용해 유사도 검색 애플리케이션을 강화하는 방법</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">임베디드 Milvus를 사용하여 Python으로 Milvus 즉시 설치 및 실행하기</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">인메모리 복제본으로 벡터 데이터베이스 읽기 처리량 늘리기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기(2부)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 데이터베이스는 어떻게 데이터 보안을 보장하나요?</a></li>
</ul>
