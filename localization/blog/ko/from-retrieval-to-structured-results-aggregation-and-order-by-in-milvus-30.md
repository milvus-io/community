---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: '검색에서 구조화된 결과까지: Milvus 3.0의 집계 및 ORDER BY'
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Milvus 3.0이 구조적이고 효율적인 벡터 검색 결과를 위해 쿼리 집계, 검색 집계, 서버 측 ORDER BY를 어떻게 추가하는지
  알아보세요.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>익숙한 제품 검색 흐름을 생각해 보겠습니다. 쇼핑객이 드레스 사진을 업로드하면, 벡터 검색은 수천만 개의 제품이 포함된 카탈로그에서 관련 후보 집합을 검색합니다.</p>
<p>하지만 페이지에는 순위가 매겨진 목록 이상의 것이 필요합니다. 브랜드 패싯이 필요하고, 가격 정렬이 필요합니다. 머천다이징 팀은 이 결과 집합에서 어떤 브랜드가 우세한지, 각 브랜드 안의 가격 범위가 어떻게 되는지, 그리고 각 그룹을 대표하는 제품 몇 가지를 알고 싶어 합니다.</p>
<p>Milvus 3.0 이전에는 애플리케이션이 일반적으로 이 두 번째 단계를 직접 처리했습니다. Milvus에서 행을 가져오고, pandas나 서비스 계층에서 그룹화 및 정렬한 다음, 응답을 조립했습니다. 일부 팀은 이미 벡터 데이터베이스에 있는 데이터에 대해 개수와 분포를 계산하기 위해 별도의 분석 파이프라인을 유지하기도 했습니다.</p>
<p>벡터 데이터베이스는 후보를 찾았지만, 애플리케이션이 이를 구조화된 결과로 바꿔야 했습니다.</p>
<p>Milvus 3.0은 이러한 작업의 더 많은 부분을 검색 엔진 안으로 이동합니다. 다음 세 가지 관련 있지만 서로 다른 기능을 추가합니다.</p>
<ul>
<li><strong>쿼리 집계</strong>는 선택적 <code translate="no">GROUP BY</code> 필드와 함께, 필터링되고 표시 가능한 행에 대해 <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, <code translate="no">max</code>를 계산합니다.</li>
<li><strong>검색 집계</strong>는 유지된 근사 최근접 이웃(ANN) 후보를 버킷으로 구성하고, 버킷별 메트릭을 계산하며, 중첩 버킷을 만들고, 대표 히트를 반환합니다.</li>
<li><strong>서버 측</strong> <code translate="no">**ORDER BY**</code>는 애플리케이션이 결과를 받기 전에 하나 이상의 스칼라 필드로 쿼리 결과나 ANN 후보를 정렬합니다.</li>
</ul>
<p>쿼리와 검색의 차이는 중요합니다.</p>
<table>
<thead>
<tr><th>기능</th><th>요약 또는 정렬되는 데이터</th><th>주요 결과 형태</th><th>정확성의 경계</th></tr>
</thead>
<tbody>
<tr><td>쿼리 집계</td><td>필터와 일치하는 모든 표시 가능한 행</td><td>그룹당 한 행, 집계 값 포함</td><td>쿼리의 표시 가능한 행 집합에 대해 정확함</td></tr>
<tr><td>검색 집계</td><td>ANN 검색과 그룹화 단계에서 유지된 후보</td><td>버킷, 메트릭, 대표 히트, 선택적 하위 버킷</td><td>설계상 근사</td></tr>
<tr><td>쿼리 <code translate="no">ORDER BY</code></td><td>필터와 일치하는 표시 가능한 행</td><td>정렬된 행</td><td>필터링된 쿼리 결과에 대해 정확함</td></tr>
<tr><td>검색 <code translate="no">ORDER BY</code></td><td>ANN 후보</td><td>정렬된 검색 히트 또는 그룹</td><td>ANN 리콜 경계를 확장하지 않음</td></tr>
</tbody>
</table>
<p>이 글에서는 이러한 연산이 왜 데이터베이스 내부에 있어야 하는지, 분산 집계가 어떻게 동작하는지, 검색 집계가 그룹화 검색과 어떻게 다른지, 그리고 새로운 의미 체계가 어디에서 멈추는지 설명합니다.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">애플리케이션 측 후처리가 한계에 부딪히는 이유<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>집계와 정렬을 애플리케이션으로 옮기는 것은 작은 구현 선택처럼 보일 수 있습니다. 그러나 규모가 커지면 세 가지 더 큰 문제가 생깁니다.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">애플리케이션은 답에 포함된 것보다 훨씬 더 많은 데이터를 이동합니다</h3><p>운영 대시보드가 재고가 있는 200만 개 행의 모든 카테고리에 대해 제품 수와 평균 가격을 필요로 한다고 가정해 보겠습니다. 카테고리, 가격, 기본 키, 직렬화 오버헤드에 대해 행당 100바이트에 불과한 대략적인 페이로드만 잡아도, 애플리케이션은 결과를 계산하기 전에 약 200 MB의 데이터를 받아야 합니다.</p>
<p>카탈로그에 200개의 카테고리가 있다면, 답은 몇백 개의 키와 숫자뿐이며 킬로바이트 수준입니다. 애플리케이션은 반환하는 데이터보다 몇 자릿수 더 많은 데이터를 이동하고, 새로고침할 때마다 같은 비용을 지불하며, 중간 행을 보관하거나 스트리밍할 수 있을 만큼 충분한 클라이언트 메모리가 필요합니다.</p>
<p>엔진 내부 집계는 데이터 이동의 단위를 바꿉니다. 원시 행은 제자리에 남아 있습니다. 노드 간에 이동하고 최종적으로 Milvus를 떠나는 것은 훨씬 더 작은 부분 및 최종 그룹 상태 집합입니다.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">페이지 로컬 정렬은 전역 정렬이 아닙니다</h3><p>페이지네이션 이후의 정렬은 단순히 비효율적인 구현이 아니라 정확성 버그입니다.</p>
<p>애플리케이션이 11번부터 20번 행을 가져와 그 행만 가격순으로 정렬했다면, 이는 해당 페이지 안에서의 가격 순서를 만든 것입니다. 전역 가격 정렬 결과의 11번부터 20번 행이 아닙니다. 이후 페이지에는 첫 페이지의 모든 제품보다 더 저렴한 제품이 포함될 수 있습니다.</p>
<p>벡터 검색에서도 같은 경계가 중요합니다. 작은 Top-K 집합을 가져와 애플리케이션에서 정렬하면 해당 후보만 재정렬할 수 있습니다. ANN 단계가 반환하지 않은 관련 후보를 복구할 수 없으며, 클라이언트 측 정렬을 유용하게 만들기 위해 애플리케이션이 과도하게 가져오도록 만드는 경우가 많습니다.</p>
<p>서버 측 정렬은 Milvus가 정렬 및 페이지네이션 순서를 제어할 수 있게 합니다. 쿼리 워크로드의 경우 엔진은 페이지 윈도우를 적용하기 전에 필터링된 행 집합을 정렬합니다. 검색 워크로드의 경우 ANN 후보 경계 안에서 정렬하고, 그 제한을 명시적으로 유지합니다.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">클라이언트는 데이터베이스 가시성을 재현할 수 없습니다</h3><p>집계는 또한 쿼리 타임스탬프에서 어떤 행이 표시 가능한지에 따라 달라집니다. 삭제, 만료된 엔터티, 동시 쓰기는 Milvus의 다중 버전 동시성 제어(MVCC)와 일관성 의미 체계에 의해 관리됩니다.</p>
<p>원시 행이 데이터베이스를 떠나면, 애플리케이션은 일반적으로 수신한 배치가 올바른 스냅샷을 나타낸다고 가정합니다. 특히 컬렉션이 쓰기와 삭제를 받고 있는 동안 클라이언트에서 동일한 가시성 규칙을 재구성하는 것은 비현실적입니다.</p>
<p>일반적인 우회책인 내보내기와 ETL로 채워지는 두 번째 분석 엔진은 데이터의 또 다른 복사본, 또 다른 일관성 경계, 그리고 운영해야 할 또 다른 파이프라인을 추가합니다. 개수, 메트릭, 정렬은 데이터와 그 가시성 규칙이 이미 존재하는 곳에서 실행되어야 합니다.</p>
<p>이제 Milvus 3.0이 제공하는 것을 살펴보겠습니다.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">쿼리 집계: 표시 가능한 행에 대한 정확한 통계<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>쿼리 집계는 다음과 같은 질문에 답합니다.</p>
<ul>
<li>각 카테고리에 재고가 있는 제품은 몇 개인가?</li>
<li>브랜드별 평균 가격은 얼마인가?</li>
<li>각 호스트의 최소 및 최대 이벤트 타임스탬프는 무엇인가?</li>
<li>필터와 TTL 가시성이 적용된 후 몇 개의 레코드가 남는가?</li>
</ul>
<p>API는 SQL을 사용해 본 사람에게 익숙해 보입니다. <code translate="no">group_by_fields</code>에 하나 이상의 필드를 전달한 다음, <code translate="no">output_fields</code>에 집계 표현식을 넣습니다.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>문법은 간단한 부분입니다. 결과를 분산 벡터 데이터베이스에서 유용하게 만드는 것은 실행 모델입니다.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">세그먼트 로컬 상태가 원시 행 이동을 대체합니다</h3><p>Milvus 컬렉션은 여러 쿼리 노드에 분산된 수백 또는 수천 개의 세그먼트에 걸쳐 있을 수 있으며, 최근에 작성된 데이터는 여전히 스트리밍 경로에 있을 수 있습니다. 어떤 단일 실행 노드도 모든 표시 가능한 행을 처음부터 가지고 있지 않습니다.</p>
<p>따라서 Milvus는 집계를 세그먼트로 푸시다운합니다.</p>
<ol>
<li>각 세그먼트는 필터와 MVCC 가시성 규칙을 로컬에서 적용합니다.</li>
<li>세그먼트는 일치하는 행 대신 그룹당 하나의 부분 상태를 내보냅니다.</li>
<li>부분 상태는 쿼리 노드 내에서 병합됩니다.</li>
<li>프록시는 최종 교차 노드 병합을 수행하고 완성된 그룹을 반환합니다.</li>
</ol>
<p>이제 중간 데이터의 양은 일치하는 행 수에 직접 비례하는 대신, 그룹 수와 집계 상태 수에 따라 확장됩니다.</p>
<p>병합 연산은 집계에 따라 달라집니다.</p>
<table>
<thead>
<tr><th>집계</th><th>부분 상태</th><th>병합 규칙</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>부분 개수</td><td>개수를 더함</td></tr>
<tr><td><code translate="no">sum</code></td><td>부분 합계</td><td>합계를 더함</td></tr>
<tr><td><code translate="no">min</code></td><td>부분 최솟값</td><td>최솟값을 취함</td></tr>
<tr><td><code translate="no">max</code></td><td>부분 최댓값</td><td>최댓값을 취함</td></tr>
<tr><td><code translate="no">avg</code></td><td>부분 합계와 개수</td><td>두 상태를 모두 더한 다음 최종 단계에서 한 번 나눔</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code>는 시사점이 큰 사례입니다. 파티션에 서로 다른 수의 행이 포함되어 있을 때 두 부분 평균을 평균내는 것은 올바르지 않습니다. Milvus는 <code translate="no">sum</code>과 <code translate="no">count</code>를 독립적으로 유지하고, 둘 다 전역으로 병합된 후에만 최종 평균을 계산합니다.</p>
<p>이것이 집계가 데이터베이스에 속하는 이유 중 하나입니다. 이 연산은 단순히 “여러 배치에서 같은 함수를 실행”하는 것이 아닙니다. 엔진은 각 집계의 대수적 성질을 세그먼트와 노드 경계 전반에 걸쳐 보존해야 합니다.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">가시성은 집계 전에 적용됩니다</h3><p>삭제되거나 만료된 행은 쿼리의 가시성 경계에 따라 세그먼트 수준에서 부분 상태에서 제거됩니다. 이들은 위로 이동한 뒤 애플리케이션에서 수정되지 않습니다.</p>
<p>따라서 결과는 약간 다른 시점에 가져온 임의의 배치 모음이 아니라, Milvus가 해당 요청에 대해 표시 가능하다고 간주하는 행을 설명합니다.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code>는 이제 그룹을 셉니다</h3><p>일반 쿼리에서 <code translate="no">limit</code>는 반환되는 엔터티 행 수를 제어합니다. 그룹화된 쿼리에서는 반환되는 그룹 수를 제어합니다. 결과 카디널리티가 일치하는 행이 아니라 그룹에 의해 결정되므로, 쿼리 집계는 모든 그룹이 필요할 때 <code translate="no">limit</code>를 생략할 수도 있습니다.</p>
<p>이는 작은 API 세부 사항처럼 들리지만, 다른 결과 모델을 반영합니다. 출력은 더 이상 엔터티 페이지가 아닙니다. 행이 그룹을 나타내는 릴레이션입니다.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">검색 집계: ANN 후보의 버킷화된 뷰<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>쿼리 집계는 “이 필터와 일치하는 표시 가능한 행은 어떤 모습인가?”에 답합니다. 검색 집계는 다른 질문을 던집니다. “이 벡터에 대해 검색된 후보 집합은 어떤 모습인가?”</p>
<p>이 연산에는 정확히 대응되는 SQL 개념이 없습니다. ANN 검색은 먼저 유사도 기반 후보 경계를 설정합니다. 그런 다음 Milvus는 유지된 후보를 스칼라 키로 구성하고, 일반적인 평면 히트 목록 대신 버킷 트리를 반환합니다.</p>
<p>버킷에는 다음이 포함될 수 있습니다.</p>
<ul>
<li><code translate="no">brand</code>와 같은 키 또는 <code translate="no">(brand, color)</code>와 같은 복합 키;</li>
<li>유지된 후보 개수;</li>
<li><code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, <code translate="no">max</code>를 포함한 메트릭;</li>
<li><code translate="no">top_hits</code>로 선택된 대표 엔터티; 및</li>
<li>하위 버킷을 생성하는 중첩 <code translate="no">sub_aggregation</code>.</li>
</ul>
<p>제품 검색 페이지의 경우, 한 요청으로 브랜드 버킷, 각 버킷 내부의 평균 가격, 브랜드별 대표 제품 세 개를 반환할 수 있습니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">search_aggregation</code>가 설정되면 일반 히트 목록은 비어 있습니다. 애플리케이션은 <code translate="no">result.agg_buckets</code>에서 버킷 응답을 읽습니다.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">집계 사양은 서로 다른 두 가지 경계를 설정합니다</h3><p>검색 집계는 컬렉션의 모든 엔터티에 대해 <code translate="no">GROUP BY</code>를 실행하지 않으며, 일반 Top-K 응답을 가져와 그 평면 목록을 집계하는 것도 아닙니다.</p>
<p>실행은 세 단계로 이루어집니다.</p>
<ol>
<li>Milvus는 쿼리 벡터에 가까운 후보를 검색하기 위해 ANN 검색을 실행합니다.</li>
<li>그룹화 단계는 전체 버킷 키마다 제한된 수의 후보를 유지합니다.</li>
<li>Milvus는 버킷을 만들고, 유지된 후보에 대해 메트릭을 계산하며, 버킷을 정렬하고, 대표 히트 또는 하위 버킷을 첨부합니다.</li>
</ol>
<p>두 매개변수는 결과의 서로 다른 부분을 제어합니다.</p>
<ul>
<li><code translate="no">SearchAggregation.size</code>는 해당 집계 수준에서 반환되는 버킷 수를 제한합니다.</li>
<li>집계 트리 어디에 있든 가장 큰 <code translate="no">TopHits.size</code>가 각 전체 복합 키에 대한 유지 후보 예산을 설정합니다. 요청에 <code translate="no">top_hits</code>가 없으면 키별 예산은 기본적으로 1입니다.</li>
</ul>
<p>최상위 검색 <code translate="no">limit</code>는 이 모드를 제어하지 않으며, <code translate="no">search_aggregation</code>가 있을 때는 무시됩니다.</p>
<p>이 차이는 버킷의 <code translate="no">count</code>나 메트릭을 읽을 때 필수적입니다. <code translate="no">TopHits(size=3)</code>를 사용하면, 컬렉션에 해당 브랜드의 관련 제품이 수천 개 있더라도 브랜드 버킷은 전체 키에 대해 최대 세 개의 유지 후보만 요약할 수 있습니다. <code translate="no">TopHits.size</code>를 늘리면 키별 메트릭 윈도우가 넓어지지만, ANN 검색이 정확한 스캔으로 바뀌지는 않습니다.</p>
<p>애플리케이션이 필터와 일치하는 모든 표시 가능한 행에 대한 정확한 통계가 필요하다면, 쿼리 집계를 사용해야 합니다. 검색 집계는 유사도 검색으로 생성된 후보를 설명하고 비교하기 위한 것입니다.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">검색 집계와 그룹화 검색은 서로 다른 문제를 해결합니다<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 Milvus 2.4부터 그룹화 검색(<code translate="no">group_by</code>)을 지원해 왔습니다. 두 기능 모두에서 “grouping”이라는 단어를 보고 같은 연산을 위한 두 인터페이스라고 생각하기 쉽습니다. 하지만 출력 계약은 다릅니다.</p>
<p><strong>그룹화 검색</strong>은 순위가 매겨진 결과 목록에 어떤 엔터티가 나타나는지를 바꿉니다. 일반적인 RAG 패턴은 청크를 개별 엔터티로 저장하고, <code translate="no">doc_id</code>로 그룹화한 뒤, 각 문서에서 하나 또는 몇 개의 청크를 반환합니다. 기본 출력은 여전히 일반 검색 히트이지만, 그룹화 필드에서 반복되는 값이 줄어듭니다.</p>
<p><strong>검색 집계</strong>는 통계적 뷰를 반환합니다. 기본 출력은 키, 개수, 메트릭, 대표 히트, 선택적 하위 버킷을 포함하는 버킷 트리입니다.</p>
<table>
<thead>
<tr><th>애플리케이션 요구 사항</th><th>선호 기능</th><th>소비 대상</th></tr>
</thead>
<tbody>
<tr><td>필드 전반의 다양성이 더 큰 순위 엔터티 목록</td><td>그룹화 검색</td><td>일반 검색 히트</td></tr>
<tr><td>패싯 개수, 그룹별 메트릭, 대표 히트 또는 중첩 분포</td><td>검색 집계</td><td><code translate="no">result.agg_buckets</code>의 <code translate="no">AggregationBucket</code> 객체</td></tr>
</tbody>
</table>
<p>실용적인 규칙은 UI 또는 API 응답 형태에서 시작하는 것입니다. 애플리케이션이 목록을 렌더링한다면 일반적으로 그룹화 검색이 올바른 프리미티브입니다. 패싯, 분포 카드 또는 그룹 계층 구조를 렌더링한다면 검색 집계를 사용하세요.</p>
<p>두 모드는 서로 다른 기본 결과 형태를 정의하므로 한 요청에서 함께 사용할 수 없습니다.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: 애플리케이션 경계 앞에서 정렬 수행<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>정렬은 이번 릴리스에서 가장 낯설지 않은 기능이지만, 엔진 밖에서 잘못 구현하기 가장 쉬운 기능 중 하나입니다.</p>
<p>Milvus 3.0은 쿼리와 검색 모두에서 정렬을 제공하지만, 두 경로는 서로 다른 SDK 매개변수를 사용하고 서로 다른 입력 집합에 대해 동작합니다.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">쿼리 정렬은 필터링된 행 집합을 정렬합니다</h3><p>PyMilvus 쿼리는 <code translate="no">order_by</code>를 사용하며, 이는 <code translate="no">&quot;field:direction&quot;</code> 문자열 목록으로 표현됩니다. 엔진은 필터를 적용하고, 표시 가능한 행을 정렬한 다음, <code translate="no">limit</code>와 <code translate="no">offset</code>을 적용합니다.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>이를 통해 쿼리는 비즈니스 순서가 있는 탐색에 유용해집니다. 예를 들어 가장 최근에 수집된 레코드, 필터 내 최고가 제품, 최저 재고, 데이터 검사를 위한 극값 등을 다룰 수 있습니다. 서버 측 정렬이 없으면 애플리케이션은 먼저 행을 검색해야 했고, 페이지 전반에 걸쳐 신뢰할 수 있는 비즈니스 순서를 정의할 수 없었습니다.</p>
<p>nullable 쿼리 필드의 경우 오름차순은 null을 마지막에 배치하고, 내림차순은 null을 먼저 배치합니다. 정렬 필드는 <code translate="no">output_fields</code>에 나타날 필요가 없습니다. 애플리케이션이 응답에서 해당 값을 필요로 할 때만 포함하세요.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">검색 정렬은 ANN 후보 집합을 재정렬합니다</h3><p>PyMilvus 검색은 <code translate="no">order_by_fields</code>를 사용하며, 각 항목은 스칼라 필드와 방향을 지정합니다.</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>어떤 엔터티가 후보가 되는지는 여전히 ANN이 결정합니다. <code translate="no">order_by_fields</code>는 해당 후보가 반환되는 방식을 바꿀 뿐이며, 가장 저렴한 제품을 찾기 위해 검색이 컬렉션 전체를 전역 스캔하게 만들지는 않습니다.</p>
<p>이 경계는 두 API에 서로 다른 역할을 부여합니다.</p>
<ul>
<li>재고가 있는 가장 저렴한 제품 10개처럼 스칼라 순서 자체가 결과를 정의할 때는 쿼리와 <code translate="no">order_by</code>를 사용하세요.</li>
<li>의미적 또는 벡터 관련성이 후보 집합을 정의하고, 스칼라 필드가 해당 후보를 어떻게 표시할지 결정할 때는 검색과 <code translate="no">order_by_fields</code>를 사용하세요.</li>
</ul>
<p>다중 필드 정렬은 목록 순서대로 키를 적용합니다. 검색 후보가 지정된 모든 스칼라 키에 대해 같은 값을 가질 때, Milvus는 원래의 유사도 점수 순서를 유지합니다.</p>
<p>정렬은 그룹화 검색과도 결합됩니다. Milvus는 그룹화된 결과 형태를 유지하면서, 각 그룹의 상위 엔터티에서 구성된 스칼라 값으로 그룹을 정렬합니다. 이는 애플리케이션이 필드 전반의 다양성과 비즈니스 관련 그룹 순서를 모두 원할 때 유용합니다.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">이러한 기능이 가능하게 하는 것<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>API는 범용 데이터베이스 프리미티브이지만, 여러 검색 워크로드가 즉시 이점을 얻습니다.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG와 에이전트: 검색 집중도 검사</h3><p>RAG 또는 에이전트 시스템은 검색된 청크를 원본 문서, 제품 라인, 테넌트 또는 콘텐츠 유형별로 버킷화할 수 있습니다. 두 문서에 집중된 결과는 수십 개의 소스에 걸쳐 분산된 결과와 다른 커버리지 신호를 가집니다.</p>
<p>그 분포가 답변 품질을 보장하지는 않습니다. 하지만 애플리케이션이나 에이전트가 쿼리를 확장할지, 다시 검색할지, 또는 명확화를 요청할지를 결정할 때 점수, 인용, 기타 검사와 결합할 수 있는 유용한 검색 진단 정보입니다.</p>
<p>목표가 단순히 반환되는 청크를 다양화하는 것이라면 그룹화 검색이 여전히 올바른 선택입니다. 시스템이 분포 자체를 필요로 할 때 검색 집계가 유용합니다.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">이커머스와 콘텐츠 추천: 검색과 함께 패싯 반환</h3><p>도입부의 제품 검색 페이지는 Milvus에서 브랜드 버킷, 가격 메트릭, 대표 아이템, 스칼라 정렬된 후보 목록을 받을 수 있습니다. 애플리케이션은 여전히 프레젠테이션과 비즈니스 로직을 제어하지만, 더 이상 내보낸 히트에서 기본 버킷 의미 체계를 재구성할 필요가 없습니다.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">로그와 보안: 유사도와 인시던트 분포 결합</h3><p>유사도 검색은 의심스러운 로그 라인과 관련된 이벤트를 찾을 수 있습니다. 그런 다음 검색 집계는 어떤 호스트가 해당 후보를 지배하는지, 각 호스트 버킷의 최소 및 최대 타임스탬프가 무엇인지, 또는 후보가 심각도와 서비스 전반에 어떻게 나뉘는지를 보여줄 수 있습니다.</p>
<p>결과는 정확한 전역 인시던트 개수가 아니라 검색된 후보의 뷰로 남습니다. 조사에서 필터와 일치하는 모든 이벤트에 대한 정확한 개수가 필요할 때, 쿼리 집계가 그 두 번째 경로를 제공합니다.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">운영과 데이터 탐색: 내보내기 대신 계산</h3><p>대시보드와 관리 도구는 필터링된 행에 대해 정확한 개수와 평균을 실행한 다음, 정의된 스칼라 순서로 기본 엔터티를 탐색할 수 있습니다. 이는 Milvus가 완전한 분석 데이터베이스가 된 것처럼 가장하지 않으면서도, 많은 일회성 “내보내기, 계산, 정렬” 유틸리티를 제거합니다.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">경계: 집계와 <code translate="no">ORDER BY</code>가 대체하지 않는 것<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>이 기능들은 검색 엔진을 확장하지만, Milvus를 온라인 분석 처리(OLAP) 시스템으로 바꾸지는 않습니다.</p>
<ul>
<li>쿼리 집계는 그룹화와 <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, <code translate="no">max</code>를 지원합니다. 조인, 윈도우 함수 또는 복잡한 하위 쿼리를 추가하지는 않습니다. 대규모 오프라인 분석 작업은 여전히 Spark와 같은 시스템에 속하며, 이러한 시스템은 Milvus 3.0 스냅샷과 공유 스토리지 경로를 사용할 수 있습니다.</li>
<li>쿼리 그룹 키는 정수, <code translate="no">VARCHAR</code>, <code translate="no">TIMESTAMPTZ</code> 필드를 지원합니다. 검색 집계 버킷 키는 추가로 Boolean 필드를 지원합니다. 부동소수점, 벡터, JSON, 배열 값은 버킷 키가 아닙니다.</li>
<li>검색 집계의 경우 <code translate="no">count</code>는 <code translate="no">&quot;*&quot;</code> 또는 JSON이 아닌 비동적 소스를 허용합니다. <code translate="no">sum</code>과 <code translate="no">avg</code>는 숫자 소스를 필요로 하며, <code translate="no">min</code>과 <code translate="no">max</code>는 문자열과 <code translate="no">TIMESTAMPTZ</code> 소스도 지원합니다. 쿼리 집계도 동일한 산술 타입 경계를 따릅니다. 복합 필드 타입에 집계를 적용하기 전에 API 가이드를 확인하세요.</li>
<li>쿼리 집계는 그룹화된 출력을 그룹 키로 정렬할 수 있지만, <code translate="no">count(*)</code>와 같은 계산된 집계로 정렬하는 것은 현재 경계로 남아 있습니다. 명시적 순서가 없으면 그룹 순서는 보장되지 않습니다.</li>
<li>검색 집계는 현재 같은 요청에서 하이브리드 검색, 그룹화 검색, 검색 반복자, 0이 아닌 offset 또는 하이라이팅과 결합할 수 없습니다.</li>
<li>검색 집계 개수와 메트릭은 유지된 ANN 후보를 설명하며, 전체 컬렉션이나 의미적으로 관련 있을 수 있는 모든 엔터티를 설명하지 않습니다.</li>
<li>검색 <code translate="no">ORDER BY</code>는 후보 표시 방식을 바꿉니다. 누락된 ANN 후보를 복구하거나 유사도 검색을 정확한 스칼라 Top-N 쿼리로 변환하지 않습니다.</li>
</ul>
<p>새로운 프리미티브 중 무엇을 선택할지 결정하는 가장 깔끔한 방법은 질문에서 시작하는 것입니다.</p>
<ul>
<li>필터링된 표시 가능한 행에 대한 정확한 통계에는 쿼리 집계를 사용하세요.</li>
<li>유사도 검색 후보에 대한 분포에는 검색 집계를 사용하세요.</li>
<li>다양한 순위 목록에는 그룹화 검색을 사용하세요.</li>
<li>정의된 스칼라 순서에는 어떤 경로가 결과 집합을 설정했는지에 따라 쿼리 또는 검색 <code translate="no">ORDER BY</code>를 사용하세요.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">후보 목록에서 구조화된 결과로<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>벡터 데이터베이스는 전통적으로 한 가지 질문에 최적화되어 왔습니다. 이 벡터에 가장 가까운 K개의 엔터티는 무엇인가?</strong></p>
<p>프로덕션 검색 시스템은 즉시 후속 질문을 던집니다. 어떤 그룹이 결과를 지배하는가? 그 개수와 범위는 무엇인가? 어떤 예제가 각 그룹을 대표하는가? 애플리케이션은 어떤 비즈니스 순서로 행이나 후보를 표시해야 하는가?</p>
<p>Milvus 3.0은 이러한 연산을 데이터, ANN 후보 경계, 가시성 의미 체계를 소유한 동일한 엔진으로 가져옵니다. 쿼리 집계는 표시 가능한 행에 대해 정확한 분산 축약을 수행합니다. 검색 집계는 유지된 ANN 후보에 대한 버킷화된 뷰를 만듭니다. <code translate="no">ORDER BY</code>는 애플리케이션이 페이지마다 이를 재구성하도록 요구하지 않고, 쿼리와 검색 경로에 서버 측 스칼라 순서를 제공합니다.</p>
<p>그 결과는 벡터 데이터베이스 안에 숨겨진 OLAP 엔진이 아닙니다. 애플리케이션이 실제로 필요로 하는 구조를 더 많이 반환할 수 있는 검색 엔진입니다.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Milvus 3.0에서 집계와 <code translate="no">ORDER BY</code> 사용해 보기<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0은 지금 사용할 수 있습니다. 정확한 집계와 쿼리 정렬에는 <a href="https://milvus.io/docs/get-and-scalar-query.md">Query guide</a>를, 버킷 의미 체계와 제한에는 <a href="https://milvus.io/docs/search-aggregation.md">Search Aggregation guide</a>를, 검색 정렬에는 <a href="https://milvus.io/docs/single-vector-search.md">Basic Vector Search guide</a>를, 그리고 주요 목표가 결과 다양성일 때는 <a href="https://milvus.io/docs/grouping-search.md">Grouping Search guide</a>를 사용하세요.</p>
<p>더 넓은 릴리스에 대해서는 <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 launch blog</a>, <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 release notes</a>, <a href="https://github.com/milvus-io/milvus">milvus-io/milvus repository</a>를 참조하세요.</p>
<p>클러스터를 직접 운영하지 않고 동일한 API를 평가해 보고 싶다면 <a href="https://cloud.zilliz.com">Zilliz Cloud</a>에서 사용해 보세요. 현재 <a href="https://docs.zilliz.com/reference/python/python/Vector-query">Zilliz Cloud query reference</a>와 <a href="https://docs.zilliz.com/reference/python/python/Vector-search">search reference</a>는 관리형 클러스터 유형에 대한 사용 가능 여부와 매개변수를 설명합니다.</p>
<p>워크로드나 엣지 케이스를 팀과 논의하려면 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a>에 참여하거나 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours session</a>을 예약하세요.</p>
