---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Milvus에서 하이브리드 공간 및 벡터 검색을 사용하는 방법
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: >-
  Milvus 2.6.4가 어떻게 지오메트리와 R-Tree를 사용하여 하이브리드 공간 및 벡터 검색을 지원하는지 성능 인사이트와 실제 사례를
  통해 알아보세요.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>"3km 이내의 로맨틱한 레스토랑 찾기"와 같은 쿼리는 간단하게 들립니다. 위치 필터링과 시맨틱 검색이 결합되어 있기 때문에 결코 간단하지 않습니다. 대부분의 시스템은 이 쿼리를 두 개의 데이터베이스로 분할해야 하므로 데이터 동기화, 코드 병합 결과, 추가 대기 시간이 발생합니다.</p>
<p><a href="https://milvus.io">Milvus</a> 2.6.4는 이러한 분할을 제거합니다. 기본 <strong>지리</strong> 데이터 유형과 <strong>R-Tree</strong> 인덱스를 통해 Milvus는 단일 쿼리에서 위치 및 의미론적 제약 조건을 함께 적용할 수 있습니다. 따라서 하이브리드 공간 및 의미론적 검색이 훨씬 더 쉽고 효율적입니다.</p>
<p>이 문서에서는 이러한 변경이 필요한 이유, Milvus 내에서 지오메트리와 R-Tree가 어떻게 작동하는지, 어떤 성능 향상을 기대할 수 있는지, 그리고 Python SDK로 어떻게 설정하는지에 대해 설명합니다.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">기존 지리적 및 시맨틱 검색의 한계<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>"3km 이내의 로맨틱한 레스토랑"과 같은 쿼리는 두 가지 이유로 처리하기 어렵습니다:</p>
<ul>
<li><strong>"로맨틱"은 시맨틱 검색이 필요합니다.</strong> 시스템은 레스토랑 리뷰와 태그를 벡터화한 다음 임베딩 공간에서 유사성을 기준으로 일치하는 항목을 찾아야 합니다. 이는 벡터 데이터베이스에서만 작동합니다.</li>
<li><strong>"3km 이내"는 공간 필터링이 필요합니다.</strong> 결과는 "사용자로부터 3km 이내" 또는 때로는 "특정 배달 폴리곤 또는 행정 경계 내부"로 제한되어야 합니다.</li>
</ul>
<p>기존 아키텍처에서는 두 가지 요구 사항을 모두 충족하려면 일반적으로 두 개의 시스템을 나란히 실행해야 했습니다:</p>
<ul>
<li>지오펜싱, 거리 계산, 공간 필터링을 위한<strong>PostGIS/Elasticsearch</strong>.</li>
<li>임베딩을 통한 근사 최인접 이웃(ANN) 검색을 위한 <strong>벡터 데이터베이스</strong>.</li>
</ul>
<p>이 "두 개의 데이터베이스" 설계는 세 가지 실질적인 문제를 야기합니다:</p>
<ul>
<li><strong>번거로운 데이터 동기화.</strong> 식당의 주소가 변경되면 지리적 시스템과 벡터 데이터베이스를 모두 업데이트해야 합니다. 한 가지 업데이트가 누락되면 일관성 없는 결과가 생성됩니다.</li>
<li><strong>지연 시간 증가.</strong> 애플리케이션이 두 시스템을 호출하고 출력을 병합해야 하므로 네트워크 왕복 및 처리 시간이 추가됩니다.</li>
<li><strong>비효율적인 필터링.</strong> 시스템이 벡터 검색을 먼저 실행하면 사용자와 멀리 떨어진 결과를 많이 반환하여 나중에 버려야 하는 경우가 많았습니다. 위치 필터링을 먼저 적용하면 남은 세트가 여전히 커서 벡터 검색 단계에 여전히 많은 비용이 들었습니다.</li>
</ul>
<p>Milvus 2.6.4는 벡터 데이터베이스에 공간 기하학 지원을 직접 추가하여 이 문제를 해결했습니다. 이제 시맨틱 검색과 위치 필터링이 동일한 쿼리에서 실행됩니다. 모든 것이 하나의 시스템에서 이루어지므로 하이브리드 검색이 더 빠르고 관리하기 쉬워집니다.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">Milvus에 추가된 지오메트리 기능<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6에는 DataType.GEOMETRY라는 스칼라 필드 유형이 도입되었습니다. 이제 Milvus는 위치를 별도의 경도와 위도 숫자로 저장하는 대신 점, 선, 다각형과 같은 기하학적 개체를 저장합니다. "이 지점이 한 지역 내에 있는가?" 또는 "이 지점이 X미터 내에 있는가?"와 같은 쿼리가 기본 연산이 됩니다. 원시 좌표에 대한 해결 방법을 구축할 필요가 없습니다.</p>
<p>이 구현은 <a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS 간단한 기능 액세스 표준을</strong> 따르므로 대부분의 기존 지리공간 도구와 함께 작동합니다. 도형 데이터는 사람이 읽을 수 있고 프로그램에서 구문 분석할 수 있는 표준 텍스트 형식인 <strong>WKT(잘 알려진 텍스트)</strong>를 사용하여 저장 및 쿼리됩니다.</p>
<p>지원되는 지오메트리 유형</p>
<ul>
<li><strong>포인트</strong>: 매장 주소나 차량의 실시간 위치와 같은 단일 위치</li>
<li><strong>선형</strong>: 도로 중앙선이나 이동 경로와 같은 선형</li>
<li><strong>다각형</strong>: 행정 경계 또는 지오펜스와 같은 영역</li>
<li><strong>수집 유형</strong> 멀티포인트, 멀티라인스트링, 멀티폴리곤 및 지오메트리 컬렉션</li>
</ul>
<p>또한 다음과 같은 표준 공간 연산자도 지원합니다:</p>
<ul>
<li><strong>공간 관계</strong>: 포함(ST_CONTAINS, ST_WITHIN), 교차(ST_INTERSECTS, ST_CROSSES) 및 접점(ST_TOUCHES)</li>
<li><strong>거리 연산</strong>: 지오메트리 간 거리 계산(ST_DISTANCE) 및 지정된 거리 내의 개체 필터링(ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">Milvus 내에서 R-Tree 인덱싱이 작동하는 방식<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>지오메트리 지원은 단순히 API 기능으로 노출되는 것이 아니라 Milvus 쿼리 엔진에 내장되어 있습니다. ISpatial 데이터는 R-Tree(직사각형 트리) 인덱스를 사용하여 엔진 내부에서 직접 색인되고 처리됩니다.</p>
<p><strong>R-Tree는</strong> <strong>최소 바운딩 사각형(MBR)</strong>을 사용하여 주변 객체를 그룹화합니다. 쿼리 중에 엔진은 쿼리 지오메트리와 겹치지 않는 넓은 영역을 건너뛰고 작은 후보 집합에 대해서만 세부 검사를 실행합니다. 이는 모든 물체를 스캔하는 것보다 훨씬 빠릅니다.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Milvus가 R-Tree를 구축하는 방법</h3><p>R-Tree 구축은 레이어로 이루어집니다:</p>
<table>
<thead>
<tr><th><strong>레벨</strong></th><th><strong>Milvus의 기능</strong></th><th><strong>직관적인 비유</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>리프 레벨</strong></td><td>각 지오메트리 개체(점, 선, 다각형)에 대해 Milvus는 최소 경계 사각형(MBR)을 계산하고 이를 리프 노드로 저장합니다.</td><td>각 항목을 정확히 맞는 투명 상자로 감쌉니다.</td></tr>
<tr><td><strong>중간 수준</strong></td><td>인근의 리프 노드가 함께 그룹화되고(일반적으로 한 번에 50~100개), 이 모든 노드를 포괄하는 더 큰 상위 MBR이 생성됩니다.</td><td>같은 동네의 패키지를 하나의 배송 상자에 넣습니다.</td></tr>
<tr><td><strong>루트 수준</strong></td><td>이 그룹화는 모든 데이터가 단일 루트 MBR에 포함될 때까지 위쪽으로 계속 진행됩니다.</td><td>모든 상자를 하나의 장거리 트럭에 적재.</td></tr>
</tbody>
</table>
<p>이 구조가 적용되면 공간 쿼리 복잡성이 전체 스캔 <strong>O(n)</strong> 에서 <strong>O(로그 n)</strong>로 떨어집니다. 실제로 수백만 개의 레코드에 대한 쿼리를 수백 밀리초에서 단 몇 밀리초로 단축할 수 있으며, 정확도는 그대로 유지됩니다.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">쿼리가 실행되는 방식: 2단계 필터링</h3><p>속도와 정확성의 균형을 맞추기 위해 Milvus는 <strong>2단계 필터링</strong> 전략을 사용합니다:</p>
<ul>
<li><strong>러프 필터:</strong> R-Tree 인덱스는 먼저 쿼리의 경계 사각형이 인덱스의 다른 경계 사각형과 겹치는지 여부를 확인합니다. 이렇게 하면 관련 없는 대부분의 데이터가 빠르게 제거되고 소수의 후보 세트만 남게 됩니다. 이러한 사각형은 단순한 도형이기 때문에 검사는 매우 빠르지만 실제로 일치하지 않는 결과가 일부 포함될 수 있습니다.</li>
<li><strong>미세 필터</strong>: 나머지 후보들은 PostGIS와 같은 시스템에서 사용하는 것과 동일한 도형 라이브러리인 <strong>GEOS를</strong> 사용하여 확인합니다. GEOS는 정확한 최종 결과를 생성하기 위해 도형이 교차하는지 또는 도형이 다른 도형을 포함하는지 등 정확한 도형 계산을 실행합니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus는 <strong>WKT(잘 알려진 텍스트)</strong> 형식의 지오메트리 데이터를 허용하지만 내부적으로는 <strong>WKB(잘 알려진 바이너리</strong> )로 저장합니다 <strong>.</strong> WKB는 더 컴팩트하여 저장 공간을 줄이고 I/O를 개선합니다. 기하학 필드는 메모리 매핑(mmap) 저장도 지원하므로 대규모 공간 데이터 집합을 RAM에 모두 넣을 필요가 없습니다.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">R-Tree를 통한 성능 향상<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">데이터가 증가해도 쿼리 지연 시간이 일정하게 유지됩니다.</h3><p>R-Tree 인덱스가 없으면 쿼리 시간은 데이터 크기에 따라 선형적으로 확장되며, 데이터가 10배 증가하면 쿼리 속도가 약 10배 느려집니다.</p>
<p>R-Tree를 사용하면 쿼리 시간이 대수적으로 증가합니다. 수백만 개의 레코드가 있는 데이터 세트에서 공간 필터링은 전체 스캔보다 수십에서 수백 배 더 빠를 수 있습니다.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">속도를 위해 정확성을 희생할 필요 없음</h3><p>R-Tree는 바운딩 박스로 후보를 좁힌 다음, GEOS가 정확한 기하학 수학으로 각 후보를 확인합니다. 일치하는 것처럼 보이지만 실제로는 쿼리 영역을 벗어나는 모든 것은 두 번째 통과에서 제거됩니다.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">하이브리드 검색 처리량 향상</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>R-Tree는 대상 영역을 벗어난 레코드를 먼저 제거합니다. 그런 다음 Milvus는 나머지 후보에 대해서만 벡터 유사도(L2, IP 또는 코사인)를 실행합니다. 후보 수가 적을수록 검색 비용은 낮아지고 초당 쿼리 수(QPS)는 높아집니다.</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">시작하기: Python SDK로 기하학 분석하기<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">컬렉션 정의 및 인덱스 생성</h3><p>먼저, 컬렉션 스키마에 DataType.GEOMETRY 필드를 정의합니다. 이를 통해 Milvus는 기하학적 데이터를 저장하고 쿼리할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">데이터 삽입</h3><p>데이터를 삽입할 때 지오메트리 값은 WKT(잘 알려진 텍스트) 형식이어야 합니다. 각 레코드에는 지오메트리, 벡터 및 기타 필드가 포함됩니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">하이브리드 공간-벡터 쿼리 실행(예제)</h3><p><strong>시나리오:</strong> 벡터 공간에서 가장 유사하고 사용자 위치와 같은 특정 지점에서 2km 이내에 위치한 상위 3개의 POI를 찾습니다.</p>
<p>거리 필터를 적용하려면 ST_DWITHIN 연산자를 사용합니다. 거리 값은 <strong>미터</strong> 단위로 지정됩니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">프로덕션 사용 팁<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>항상 기하 도형 필드에 R-Tree 인덱스를 생성합니다.</strong> 엔티티가 10,000개가 넘는 데이터 세트의 경우, R-TREE 인덱스가 없는 공간 필터는 전체 스캔으로 되돌아가 성능이 급격히 떨어집니다.</li>
<li><strong>일관된 좌표계를 사용합니다.</strong> 모든 위치 데이터는 동일한 좌표계를 사용해야 합니다(예: <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). 좌표계를 혼합하면 거리 및 봉쇄 계산이 중단됩니다.</li>
<li><strong>쿼리에 적합한 공간 연산자를 선택합니다.</strong> "X미터 이내" 검색의 경우 ST_DWITHIN. 지오펜싱 및 봉쇄 확인에는 ST_CONTAINS 또는 ST_WITHIN을 사용합니다.</li>
<li><strong>NULL 지오메트리 값은 자동으로 처리됩니다.</strong> 지오메트리 필드가 null 가능(nullable=True)인 경우, Milvus는 공간 쿼리 중에 NULL 값을 건너뜁니다. 별도의 필터링 로직이 필요하지 않습니다.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">배포 요구 사항<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>프로덕션 환경에서 이 기능을 사용하려면 사용 중인 환경이 다음 요구 사항을 충족하는지 확인하세요.</p>
<p><strong>1. Milvus 버전</strong></p>
<p><strong>Milvus 2.6.4 이상을</strong> 실행해야 합니다. 이전 버전은 DataType.GEOMETRY 또는 <strong>RTREE</strong> 인덱스 유형을 지원하지 않습니다.</p>
<p><strong>2. SDK 버전</strong></p>
<ul>
<li><strong>PyMilvus</strong>: 최신 버전으로 업그레이드하세요( <strong>2.6.x</strong> 시리즈 권장). 이는 올바른 WKT 직렬화와 RTREE 인덱스 매개변수 전달을 위해 필요합니다.</li>
<li><strong>Java/Go/Node SDK</strong>: 각 SDK의 릴리스 노트를 확인하고 <strong>2.6.4</strong> 프로토 정의와 일치하는지 확인하세요.</li>
</ul>
<p><strong>3. 빌트인 지오메트리 라이브러리</strong></p>
<p>Milvus 서버에는 이미 Boost.Geometry 및 GEOS가 포함되어 있으므로 이러한 라이브러리를 직접 설치할 필요가 없습니다.</p>
<p><strong>4. 메모리 사용량 및 용량 계획</strong></p>
<p>R-Tree 인덱스는 추가 메모리를 사용합니다. 용량을 계획할 때 지오메트리 인덱스뿐만 아니라 HNSW 또는 IVF와 같은 벡터 인덱스에 대한 예산도 고려해야 합니다. 기하 도형 필드는 메모리 매핑(mmap) 스토리지를 지원하므로 데이터의 일부를 디스크에 보관하여 메모리 사용량을 줄일 수 있습니다.</p>
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
    </button></h2><p>위치 기반 시맨틱 검색에는 벡터 쿼리에 지리적 필터를 붙이는 것 이상의 것이 필요합니다. 내장된 공간 데이터 유형, 적절한 인덱스, 위치 및 벡터를 함께 처리할 수 있는 쿼리 엔진이 필요합니다.</p>
<p><strong>Milvus 2.6.4는</strong> 기본 <strong>지리</strong> 필드와 <strong>R-Tree</strong> 인덱스로 이 문제를 해결합니다. 공간 필터링과 벡터 검색은 단일 쿼리에서 단일 데이터 저장소에 대해 실행됩니다. R-Tree는 빠른 공간 가지치기를 처리하는 반면, GEOS는 정확한 결과를 보장합니다.</p>
<p>위치 인식 검색이 필요한 애플리케이션의 경우, 두 개의 개별 시스템을 실행하고 동기화해야 하는 복잡성을 제거할 수 있습니다.</p>
<p>위치 인식 또는 하이브리드 공간 및 벡터 검색 작업을 하고 계신다면, 여러분의 경험을 듣고 싶습니다.</p>
<p><strong>Milvus에 대해 궁금한 점이 있으신가요?</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하거나 20분 동안 진행되는 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션을 예약하세요.</p>
