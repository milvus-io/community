---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: Milvus 벡터 데이터베이스의 일관성 수준 이해 - 2부
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: Milvus 벡터 데이터베이스에서 일관성 수준을 조정할 수 있는 메커니즘에 대한 해부도입니다.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Cover_image</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/longjiquan">Jiquan Long이</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni가</a> 번역했습니다.</p>
</blockquote>
<p>일관성에 대한 <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">이전 블로그에서는</a> 분산형 벡터 데이터베이스에서 일관성이 갖는 의미에 대해 설명하고, Milvus 벡터 데이터베이스에서 지원되는 네 가지 일관성 수준인 강력, 경계형, 세션, 이벤트에 대해 다루었으며, 각 일관성 수준에 가장 적합한 적용 시나리오에 대해 설명했습니다.</p>
<p>이 게시물에서는 Milvus 벡터 데이터베이스 사용자가 다양한 애플리케이션 시나리오에 적합한 일관성 수준을 유연하게 선택할 수 있는 메커니즘에 대해 계속해서 살펴보겠습니다. 또한 Milvus 벡터 데이터베이스에서 일관성 수준을 조정하는 방법에 대한 기본 튜토리얼도 제공할 예정입니다.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">기본 시간 틱 메커니즘</a></li>
<li><a href="#Guarantee-timestamp">타임스탬프 보장</a></li>
<li><a href="#Consistency-levels">일관성 수준</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">Milvus에서 일관성 수준을 조정하는 방법은 무엇인가요?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">기본 시간 틱 메커니즘<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 시간 틱 메커니즘을 사용하여 벡터 검색이나 쿼리가 수행될 때 다양한 수준의 일관성을 보장합니다. 타임 틱은 Milvus에서 시계처럼 작동하는 Milvus의 워터마크로, Milvus 시스템이 어느 시점에 있는지를 나타냅니다. Milvus 벡터 데이터베이스에 데이터 조작 언어(DML) 요청이 전송될 때마다 해당 요청에 타임스탬프를 할당합니다. 아래 그림과 같이 예를 들어 메시지 대기열에 새 데이터가 삽입되면 Milvus는 삽입된 데이터에 타임스탬프를 표시할 뿐만 아니라 일정한 간격으로 시간 틱도 삽입합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>timetick</span> </span></p>
<p>위 그림의 <code translate="no">syncTs1</code> 을 예로 들어 보겠습니다. 쿼리 노드와 같은 다운스트림 소비자가 <code translate="no">syncTs1</code> 을 볼 때, 소비자 구성 요소는 <code translate="no">syncTs1</code> 보다 이전에 삽입된 모든 데이터가 소비된 것으로 이해합니다. 즉, 타임스탬프 값이 <code translate="no">syncTs1</code> 보다 작은 데이터 삽입 요청은 더 이상 메시지 대기열에 표시되지 않습니다.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">타임스탬프 보장<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>이전 섹션에서 언급했듯이 쿼리 노드와 같은 다운스트림 소비자 구성 요소는 메시지 대기열에서 데이터 삽입 요청 메시지와 타임 틱을 지속적으로 가져옵니다. 타임 틱이 소비될 때마다 쿼리 노드는 이 소비된 타임 틱을 서비스 가능한 시간( <code translate="no">ServiceTime</code> )으로 표시하고 <code translate="no">ServiceTime</code> 이전에 삽입된 모든 데이터를 쿼리 노드에 표시합니다.</p>
<p>Milvus는 <code translate="no">ServiceTime</code> 외에도 다양한 사용자들의 다양한 수준의 일관성과 가용성에 대한 요구를 충족시키기 위해 타임스탬프의 한 유형인 보증 타임스탬프(<code translate="no">GuaranteeTS</code>)도 채택하고 있습니다. 즉, Milvus 벡터 데이터베이스 사용자는 검색이나 쿼리가 수행될 때 <code translate="no">GuaranteeTs</code> 이전의 모든 데이터가 표시되고 관련되어야 한다는 것을 쿼리 노드에 알리기 위해 <code translate="no">GuaranteeTs</code> 을 지정할 수 있습니다.</p>
<p>일반적으로 쿼리 노드가 Milvus 벡터 데이터베이스에서 검색 요청을 실행할 때는 두 가지 시나리오가 있습니다.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">시나리오 1: 검색 요청을 즉시 실행하는 경우</h3><p>아래 그림과 같이 <code translate="no">GuaranteeTs</code> 가 <code translate="no">ServiceTime</code> 보다 작으면 쿼리 노드는 검색 요청을 즉시 실행할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>execute_immediately</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">시나리오 2: "서비스 시간 &gt; 보장 시간"까지 기다림</h3><p><code translate="no">GuaranteeTs</code> 이 <code translate="no">ServiceTime</code> 보다 큰 경우 쿼리 노드는 메시지 큐에서 시간 틱을 계속 소비해야 합니다. <code translate="no">ServiceTime</code> 이 <code translate="no">GuaranteeTs</code> 보다 클 때까지 검색 요청을 실행할 수 없습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>wait_search</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">일관성 수준<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>따라서 검색 요청에서 <code translate="no">GuaranteeTs</code> 을 구성하여 사용자가 지정한 일관성 수준을 달성할 수 있습니다. 값이 큰 <code translate="no">GuaranteeTs</code> 은 검색 지연 시간이 길어지지만 <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">강력한 일관성을</a> 보장합니다. 그리고 <code translate="no">GuaranteeTs</code> 값이 작으면 검색 지연 시간은 줄어들지만 데이터 가시성이 저하됩니다.</p>
<p><code translate="no">GuaranteeTs</code> 는 하이브리드 타임스탬프 형식입니다. 그리고 사용자는 Milvus 내부의 <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO를</a> 알 수 없습니다. 따라서<code translate="no">GuaranteeTs</code> 값을 지정하는 것은 사용자에게 너무 복잡한 작업입니다. 사용자의 수고를 덜어주고 최적의 사용자 경험을 제공하기 위해 Milvus는 사용자가 특정 일관성 수준만 선택하면 Milvus 벡터 데이터베이스가 자동으로 <code translate="no">GuaranteeTs</code> 값을 처리합니다. 즉, Milvus 사용자는 네 가지 일관성 수준 중에서 선택하기만 하면 됩니다: <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, <code translate="no">Eventually</code>. 그리고 각 일관성 수준은 특정 <code translate="no">GuaranteeTs</code> 값에 해당합니다.</p>
<p>아래 그림은 Milvus 벡터 데이터베이스의 네 가지 일관성 수준 각각에 대한 <code translate="no">GuaranteeTs</code> 을 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>guarantee_ts</span> </span></p>
<p>Milvus 벡터 데이터베이스는 네 가지 일관성 수준을 지원합니다:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code> <code translate="no">GuaranteeTs</code> 은 최신 시스템 타임스탬프와 동일한 값으로 설정되며, 쿼리 노드는 서비스 시간이 최신 시스템 타임스탬프로 진행될 때까지 기다렸다가 검색 또는 쿼리 요청을 처리합니다.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code> <code translate="no">GuaranteeTs</code> 은 일관성 검사를 건너뛰기 위해 최신 시스템 타임스탬프보다 약간 작은 값으로 설정됩니다. 쿼리 노드는 기존 데이터 보기에서 즉시 검색합니다.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code> <code translate="no">GuaranteeTs</code> 은 최신 시스템 타임스탬프보다 상대적으로 작은 값으로 설정되며, 쿼리 노드는 허용 가능한 수준으로 업데이트되지 않은 데이터 보기에서 검색합니다.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: 클라이언트는 마지막 쓰기 작업의 타임스탬프를 <code translate="no">GuaranteeTs</code> 로 사용하여 각 클라이언트가 최소한 자체적으로 삽입한 데이터를 검색할 수 있도록 합니다.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">Milvus에서 일관성 수준을 조정하는 방법은 무엇인가요?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 <a href="https://milvus.io/docs/v2.1.x/create_collection.md">컬렉션을 만들거나</a> <a href="https://milvus.io/docs/v2.1.x/search.md">검색</a> 또는 <a href="https://milvus.io/docs/v2.1.x/query.md">쿼리를</a> 수행할 때 일관성 수준을 조정할 수 있도록 지원합니다.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">벡터 유사도 검색 수행</h3><p>원하는 일관성 수준으로 벡터 유사도 검색을 수행하려면 <code translate="no">consistency_level</code> 파라미터 값을 <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code> 또는 <code translate="no">Eventually</code> 로 설정하면 됩니다. <code translate="no">consistency_level</code> 파라미터 값을 설정하지 않으면 기본적으로 일관성 수준은 <code translate="no">Bounded</code> 이 됩니다. 이 예에서는 <code translate="no">Strong</code> 일관성을 사용하여 벡터 유사성 검색을 수행합니다.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">벡터 쿼리 수행하기</h3><p>벡터 유사도 검색을 수행할 때와 마찬가지로 벡터 쿼리를 수행할 때 <code translate="no">consistency_level</code> 매개변수 값을 지정할 수 있습니다. 이 예에서는 <code translate="no">Strong</code> 일관성을 사용하여 벡터 쿼리를 수행합니다.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
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
