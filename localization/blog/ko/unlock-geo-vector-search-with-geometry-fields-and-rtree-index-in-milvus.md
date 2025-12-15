---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: Milvus 2.6에서 지오메트리 필드 및 RTREE와 함께 지리공간 필터링 및 벡터 검색 제공
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_cover_53c424f967.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Geospatial Filtering + Vector Search in Milvus with Geometry Fields and RTREE
desc: >-
  Milvus 2.6이 어떻게 벡터 검색과 지오메트리 필드 및 RTREE 인덱스를 사용한 지리공간 인덱싱을 통합하여 정확한 위치 인식 AI
  검색을 가능하게 하는지 알아보세요.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>AI 시스템이 실시간 의사 결정에 점점 더 많이 적용됨에 따라, 지리공간 데이터는 점점 더 많은 애플리케이션, 특히 실제 세계에서 작동하거나 실제 위치에서 사용자에게 서비스를 제공하는 애플리케이션에서 점점 더 중요해지고 있습니다.</p>
<p>DoorDash나 Uber Eats와 같은 음식 배달 플랫폼을 생각해 보십시오. 사용자가 주문을 하면 시스템은 단순히 두 지점 사이의 최단 거리만 계산하는 것이 아닙니다. 레스토랑의 품질, 택배 이용 가능 여부, 실시간 교통 상황, 서비스 지역, 그리고 점점 더 개인 취향을 나타내는 사용자 및 품목을 평가합니다. 마찬가지로 자율 주행 차량은 엄격한 지연 시간 제약(대개 밀리초 이내)에서 경로 계획, 장애물 감지, 장면 수준의 의미 파악을 수행해야 합니다. 이러한 영역에서 효과적인 의사 결정은 공간적 제약과 의미적 유사성을 독립적인 단계로 취급하는 것이 아니라 결합하는 데 달려 있습니다.</p>
<p>그러나 데이터 계층에서 공간 데이터와 의미론적 데이터는 전통적으로 별도의 시스템에서 처리되어 왔습니다.</p>
<ul>
<li><p>지리공간 데이터베이스와 공간 확장은 좌표, 다각형, 포함 또는 거리와 같은 공간 관계를 저장하도록 설계되었습니다.</p></li>
<li><p>벡터 데이터베이스는 데이터의 의미적 의미를 나타내는 벡터 임베딩을 처리합니다.</p></li>
</ul>
<p>애플리케이션에 이 두 가지가 모두 필요한 경우, 한 시스템에서 위치별로 필터링한 다음 다른 시스템에서 벡터 검색을 수행하는 다단계 쿼리 파이프라인을 사용해야 하는 경우가 많습니다. 이러한 분리는 시스템 복잡성을 증가시키고 쿼리 대기 시간을 추가하며 공간 의미 추론을 대규모로 효율적으로 수행하기 어렵게 만듭니다.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6은</a> 벡터 유사도 검색을 공간 제약 조건과 직접 결합할 수 있는 <a href="https://milvus.io/docs/geometry-field.md">지오메트리 필드를</a> 도입하여 이 문제를 해결합니다. 이를 통해 다음과 같은 사용 사례가 가능해졌습니다:</p>
<ul>
<li><p>위치 기반 서비스(LBS): "이 도시 블록 내에서 유사한 POI 찾기"</p></li>
<li><p>다중 모드 검색: "이 지점에서 1km 이내에 있는 유사한 사진 검색"</p></li>
<li><p>지도 및 물류: "한 지역 내의 자산" 또는 "경로와 교차하는 경로"</p></li>
</ul>
<p>공간 필터링에 최적화된 트리 기반 <a href="https://milvus.io/docs/rtree.md">구조인</a>새로운 <a href="https://milvus.io/docs/rtree.md">RTREE 인덱스와</a>함께 Milvus는 이제 고차원 벡터 검색과 함께 <code translate="no">st_contains</code>, <code translate="no">st_within</code>, <code translate="no">st_dwithin</code> 와 같은 효율적인 지리공간 연산자를 지원합니다. 이 두 가지를 함께 사용하면 공간을 인식하는 지능형 검색이 가능할 뿐만 아니라 실용적입니다.</p>
<p>이 글에서는 지오메트리 필드와 RTREE 인덱스의 작동 방식과 이를 벡터 유사도 검색과 결합하여 실제 공간 의미론적 애플리케이션을 구현하는 방법을 살펴봅니다.</p>
<h2 id="What-Is-a-Geometry-Field-in-Milvus" class="common-anchor-header">Milvus에서 지오메트리 필드란 무엇인가요?<button data-href="#What-Is-a-Geometry-Field-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>기하학 <strong>필드는</strong> 기하학 데이터를 저장하는 데 사용되는 Milvus의 스키마 정의 데이터 유형(<code translate="no">DataType.GEOMETRY</code>)입니다. 원시 좌표만 처리하는 시스템과 달리 Milvus는 <strong>포인트</strong>, <strong>라인스트링</strong>, <strong>폴리곤을</strong> 포함한 다양한 공간 구조를 지원합니다.</p>
<p>따라서 시맨틱 벡터를 저장하는 동일한 데이터베이스 내에서 레스토랑 위치(Point), 배달 구역(Polygon), 자율 주행 차량 궤적(LineString) 등의 실제 개념을 모두 표현할 수 있습니다. 다시 말해, Milvus는 사물의 <em>위치와</em> <em>의미</em> 모두를 위한 통합 시스템이 됩니다.</p>
<p>기하학 값은 사람이 읽을 수 있는 기하학 데이터 삽입 및 쿼리 표준인 <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">잘 알려진 텍스트(WKT)</a> 형식을 사용하여 저장됩니다. WKT 문자열을 Milvus 레코드에 직접 삽입할 수 있으므로 데이터 수집과 쿼리가 간소화됩니다. 예를 들어</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">RTREE 인덱스란 무엇이며 어떻게 작동하나요?<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에 지오메트리 데이터 유형이 도입되면 공간 개체를 효율적으로 필터링할 수 있는 방법도 필요합니다. Milvus는 2단계 공간 필터링 파이프라인을 사용해 이를 처리합니다:</p>
<ul>
<li><p><strong>거친 필터링:</strong> RTREE와 같은 공간 인덱스를 사용하여 후보를 빠르게 좁힙니다.</p></li>
<li><p><strong>정밀 필터링:</strong> 남아있는 후보에 정확한 지오메트리 검사를 적용하여 경계에서 정확성을 보장합니다.</p></li>
</ul>
<p>이 설계는 성능과 정확성의 균형을 맞춥니다. 공간 인덱스는 관련 없는 데이터를 적극적으로 제거하며, 정밀한 기하학적 검사는 봉쇄, 교차, 거리 임계값과 같은 연산자에게 정확한 결과를 보장합니다.</p>
<p>이 파이프라인의 핵심은 기하학적 데이터에 대한 쿼리를 가속화하도록 설계된 공간 인덱싱 구조인 <strong>RTREE(Rectangle Tree)</strong>입니다. RTREE는 <strong>최소 바운딩 사각형(MBR)을</strong> 사용해 객체를 계층적으로 구성함으로써 쿼리 실행 중에 검색 공간의 많은 부분을 건너뛸 수 있게 해줍니다.</p>
<h3 id="Phase-1-Building-the-RTREE-Index" class="common-anchor-header">1단계: RTREE 색인 구축</h3><p>RTREE 구성은 근처의 공간 개체를 점점 더 큰 경계 영역으로 그룹화하는 상향식 프로세스를 따릅니다:</p>
<p><strong>1. 리프 노드를 생성합니다:</strong> 각 지오메트리 객체에 대해 해당 객체를 완전히 포함하는 가장 작은 사각형인 <strong>최소 경계 사각형(MBR)</strong>을 계산하고 이를 리프 노드로 저장합니다.</p>
<p><strong>2. 더 큰 상자로 그룹화합니다:</strong> 근처의 리프 노드를 클러스터링하고 각 그룹을 새 MBR로 감싸서 내부 노드를 생성합니다.</p>
<p><strong>3. 루트 노드를 추가합니다:</strong> 모든 내부 그룹을 포함하는 루트 노드를 생성하여 높이가 균형 잡힌 트리 구조를 형성합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2단계: 쿼리 가속화</strong></p>
<p><strong>1.</strong> 쿼리<strong>MBR 구성:</strong> 쿼리에 사용되는 지오메트리에 대한 MBR을 계산합니다.</p>
<p><strong>2. 가지를 잘라냅니다:</strong> 루트에서 시작하여 쿼리 MBR을 각 내부 노드와 비교합니다. MBR이 쿼리 MBR과 교차하지 않는 분기는 건너뜁니다.</p>
<p><strong>3. 후보를 수집합니다:</strong> 교차하는 분기로 내려가서 후보 리프 노드를 수집합니다.</p>
<p><strong>4. 정확한 매칭 수행:</strong> 각 후보에 대해 공간 술어를 실행하여 정확한 결과를 얻습니다.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">RTREE가 빠른 이유</h3><p>RTREE는 몇 가지 주요 설계 기능으로 인해 공간 필터링에서 강력한 성능을 제공합니다:</p>
<ul>
<li><p><strong>모든 노드가 MBR을 저장:</strong> 각 노드는 하위 트리에 있는 모든 지오메트리의 면적을 근사화합니다. 따라서 쿼리 중에 분기를 탐색할지 여부를 쉽게 결정할 수 있습니다.</p></li>
<li><p><strong>빠른 가지 치기:</strong> MBR이 쿼리 영역과 교차하는 하위 트리만 탐색합니다. 관련 없는 영역은 완전히 무시됩니다.</p></li>
<li><p><strong>데이터 크기에 따라 확장:</strong> RTREE는 <strong>O(log N)</strong> 시간 내에 공간 검색을 지원하므로 데이터 세트가 확장되어도 빠른 쿼리가 가능합니다.</p></li>
<li><p><strong>Boost.Geometry 구현:</strong> Milvus는 최적화된 지오메트리 알고리즘과 동시 워크로드에 적합한 스레드 안전 RTREE 구현을 제공하는 널리 사용되는 C++ 라이브러리인 <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry를</a> 사용해 RTREE 인덱스를 구축합니다.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">지원되는 지오메트리 연산자</h3><p>Milvus는 기하학적 관계를 기반으로 엔티티를 필터링하고 검색할 수 있는 공간 연산자 집합을 제공합니다. 이러한 연산자는 공간에서 개체가 서로 어떻게 연관되어 있는지 이해해야 하는 워크로드에 필수적입니다.</p>
<p>다음 표에는 현재 Milvus에서 사용할 수 있는 <a href="https://milvus.io/docs/geometry-operators.md">지오메트리 연산</a> 자가 나와 있습니다.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>연산자</strong></th><th style="text-align:center"><strong>설명</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">지오메트리 A와 B가 공통점을 하나 이상 공유하면 TRUE를 반환합니다.</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">도형 A가 도형 B를 완전히 포함(경계선 제외)하면 TRUE를 반환합니다.</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">도형 A가 도형 B 안에 완전히 포함될 경우 TRUE를 반환합니다. 이것은 st_contains(A, B)의 역입니다.</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">도형 A가 도형 B(경계 포함)를 포함하면 TRUE를 반환합니다.</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A, B)</strong></td><td style="text-align:center">도형 A와 B가 경계에서 접촉하지만 내부적으로 교차하지 않으면 TRUE를 반환합니다.</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">도형 A와 B가 공간적으로 동일하면 TRUE를 반환합니다.</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">도형 A와 B가 부분적으로 겹치지만 어느 쪽도 다른 쪽을 완전히 포함하지 않는 경우 TRUE를 반환합니다.</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">A와 B 사이의 거리가 <em>d보다</em> 작으면 TRUE를 반환합니다.</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">위치정보 인덱스와 벡터 인덱스를 결합하는 방법</h3><p>밀버스는 지오메트리 지원과 RTREE 인덱스를 통해 단일 워크플로우에서 지리적 공간 필터링과 벡터 유사성 검색을 결합할 수 있습니다. 이 프로세스는 두 단계로 진행됩니다:</p>
<p><strong>1. RTREE를 사용해 위치별로 필터링:</strong> Milvus는 먼저 RTREE 인덱스를 사용해 지정된 지리적 범위(예: "2km 이내") 내의 엔티티로 검색 범위를 좁힙니다.</p>
<p><strong>2. 벡터 검색을 사용하여 시맨틱별로 순위를 매깁니다:</strong> 벡터 인덱스는 나머지 후보 중에서 임베딩 유사도를 기준으로 가장 유사한 상위 N개의 결과를 선택합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="common-anchor-header">지리적 벡터 검색의 실제 사용 사례<button data-href="#Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. 배달 서비스: 더 스마트한 위치 인식 추천</h3><p>DoorDash나 Uber Eats와 같은 플랫폼은 매일 수억 건의 요청을 처리합니다. 사용자가 앱을 여는 순간, 시스템은 사용자의 위치, 시간대, 취향, 예상 배달 시간, 실시간 교통량, 택배 가능 여부 등을 바탕으로 <em>현재</em> 가장 적합한 레스토랑이나 택배를 결정해야 합니다.</p>
<p>기존에는 지리공간 데이터베이스와 별도의 추천 엔진을 쿼리한 후 여러 차례의 필터링과 순위 재지정을 거쳐야 했습니다. Milvus는 지리적 위치 인덱스를 통해 이러한 워크플로를 크게 간소화합니다:</p>
<ul>
<li><p><strong>통합 스토리지</strong> - 레스토랑 좌표, 택배 위치, 사용자 선호도 임베딩이 모두 하나의 시스템에 저장됩니다.</p></li>
<li><p><strong>공동 검색</strong> - 먼저 공간 필터(예: <em>3km 이내의 레스토랑</em>)를 적용한 다음 벡터 검색을 사용해 유사성, 취향 선호도 또는 품질에 따라 순위를 매깁니다.</p></li>
<li><p><strong>동적 의사 결정</strong> - 실시간 택배 분포와 교통 신호를 결합하여 가장 가까운, 가장 적합한 택배를 신속하게 배정합니다.</p></li>
</ul>
<p>이러한 통합 접근 방식을 통해 플랫폼은 단일 쿼리에서 공간 및 의미론적 추론을 수행할 수 있습니다. 예를 들어 사용자가 '카레라이스'를 검색하면 Milvus는 의미론적으로 연관성이 높은 레스토랑을 <em>검색하여</em> 근처에 있고, 빠르게 배달되며, 사용자의 과거 취향 프로필과 일치하는 레스토랑의 우선순위를 지정합니다.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. 자율 주행: 더욱 지능적인 의사 결정</h3><p>자율 주행에서 지리공간 인덱싱은 인식, 위치 파악, 의사 결정의 기본입니다. 차량은 단 몇 밀리초 내에 고화질 지도에 지속적으로 자신을 정렬하고 장애물을 감지하며 안전한 궤적을 계획해야 합니다.</p>
<p>Milvus를 사용하면 지오메트리 유형과 RTREE 인덱스를 통해 다음과 같은 풍부한 공간 구조를 저장하고 쿼리할 수 있습니다:</p>
<ul>
<li><p><strong>도로 경계</strong> (LineString)</p></li>
<li><p><strong>교통 규제 구역</strong> (폴리곤)</p></li>
<li><p><strong>감지된 장애물</strong> (점)</p></li>
</ul>
<p>이러한 구조를 효율적으로 색인화하여 지리공간 데이터가 AI 의사 결정 루프에 직접 참여할 수 있도록 할 수 있습니다. 예를 들어, 자율주행 차량은 RTREE 공간 술어를 통해 현재 좌표가 특정 차선 내에 있는지 또는 제한 구역과 교차하는지 여부를 빠르게 판단할 수 있습니다.</p>
<p>현재 주행 환경을 캡처하는 장면 임베딩과 같이 인식 시스템에서 생성된 벡터 임베딩과 결합하면 Milvus는 반경 50m 내에서 현재와 유사한 과거 주행 시나리오를 검색하는 등 보다 고급 쿼리를 지원할 수 있습니다. 이를 통해 모델은 환경을 더 빠르게 해석하고 더 나은 의사 결정을 내릴 수 있습니다.</p>
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
    </button></h2><p>지리적 위치는 위도와 경도 그 이상입니다. 위치에 민감한 애플리케이션에서는 <strong>이벤트가 발생하는 위치, 엔터티가 공간적으로 어떻게 연관되는지, 이러한 관계가 시스템 동작을 어떻게 형성하는지에</strong> 대한 필수적인 컨텍스트를 제공합니다. 지리공간 데이터를 머신 러닝 모델의 시맨틱 신호와 결합하면 공간 데이터와 벡터 데이터를 개별적으로 처리할 때는 표현하기 어렵거나 실행하기 비효율적인 더 풍부한 종류의 쿼리를 가능하게 합니다.</p>
<p>지오메트리 필드와 RTREE 인덱스의 도입으로 Milvus는 벡터 유사성 검색과 공간 필터링을 단일 쿼리 엔진으로 통합했습니다. 이를 통해 애플리케이션은 <strong>벡터, 지리공간 데이터, 시간에</strong> 걸쳐 공동 검색을 수행하여 공간 인식 추천 시스템, 멀티모달 위치 기반 검색, 지역 또는 경로 제약 분석과 같은 사용 사례를 지원할 수 있습니다. 더 중요한 것은 특수 시스템 간에 데이터를 이동하는 다단계 파이프라인을 제거하여 아키텍처의 복잡성을 줄인다는 점입니다.</p>
<p>AI 시스템이 실제 의사 결정에 점점 더 가까워짐에 따라, <strong><em>어떤</em></strong> 콘텐츠가 관련성이 있는지를 파악하는 것은 점점 더 중요한 <strong><em>시기와</em></strong> 적용 <strong><em>대상과</em></strong> 결합되어야 할 것입니다. Milvus는 이러한 종류의 공간 의미론적 워크로드를 위한 빌딩 블록을 표현력이 뛰어나면서도 대규모 운영에 실용적인 방식으로 제공합니다.</p>
<p>지오메트리 필드와 RTREE 인덱스에 대한 자세한 내용은 아래 설명서를 참조하세요:</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">지오메트리 필드 | Milvus 문서</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Milvus 문서</a></p></li>
</ul>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6 기능에 대해 자세히 알아보기<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 소개: 10억 개 규모의 경제적인 벡터 검색</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">임베딩 기능을 소개합니다: Milvus 2.6이 벡터화 및 시맨틱 검색을 간소화하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus의 JSON 파쇄: 유연성을 갖춘 88.9배 더 빠른 JSON 필터링</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">진정한 엔티티 수준 검색을 실현합니다: Milvus의 새로운 구조 배열 및 MAX_SIM 기능</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus의 MinHash LSH: LLM 훈련 데이터의 중복을 방지하는 비밀 무기 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">벤치마크는 거짓말 - 벡터 DB는 실제 테스트가 필요합니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Milvus를 위해 카프카/펄서를 딱따구리로 대체했습니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">실제 환경에서의 벡터 검색: 리콜을 죽이지 않고 효율적으로 필터링하는 방법</a></p></li>
</ul>
