---
id: milvus-3-0-external-collection.md
title: 'Milvus 외부 컬렉션: 데이터 이동 없이 레이크 상주 데이터 인덱싱 및 검색'
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0은 외부 컬렉션(External Collection)을 도입하여, Milvus가 데이터 레이크에 그대로 남아 있는 데이터에
  대해 인덱스를 구축하고 검색(retrieval)을 제공할 수 있게 되었습니다.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>많은 AI 파이프라인에서 임베딩과 메타데이터는 이미 데이터 레이크에서 생성되어 저장됩니다. 제품 파이프라인은 제품 속성과 멀티모달 임베딩을 S3의 Parquet 파일에 쓸 수 있습니다. 검색 또는 학습 코퍼스는 Iceberg 또는 Lance 테이블에 저장될 수 있습니다. 데이터 레이크는 이미 이러한 데이터셋이 생성, 업데이트, 버전 관리되고 나머지 데이터 스택에서 사용되는 곳입니다.</p>
<p>그러나 벡터 데이터베이스는 전통적으로 데이터베이스가 소유한 서빙 복사본을 중심으로 구축되어 왔습니다. 팀이 이미 레이크에 있는 데이터에 대해 저지연 벡터 검색을 원한다면 일반적으로 두 가지 옵션이 있었습니다:</p>
<ul>
<li><strong>데이터를 벡터 데이터베이스에 복사.</strong> 이는 ANN 인덱스와 프로덕션 서빙 경로를 제공하지만, 데이터셋의 두 번째 복사본과 소스와 동기화를 유지해야 하는 ETL 파이프라인을 생성합니다.</li>
<li><strong>레이크를 직접 쿼리.</strong> 이는 중복을 피하지만, ANN 인덱싱 및 서빙 레이어가 없으면 벡터 검색이 프로덕션 지연 시간에 맞게 설계되지 않은 스캔으로 대체됩니다.</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>External Collection</strong></a><strong>은 세 번째 경로를 도입합니다.</strong> 소스 데이터는 Parquet, Iceberg, Lance, Vortex 또는 기타 지원되는 외부 형식에 그대로 유지되며, Milvus는 그 위에 인덱스를 구축하고 서빙합니다. 외부 필드를 Milvus 스키마에 매핑하고, 필요한 인덱스를 정의하고, 컬렉션을 새로 고치고, 일반 Milvus 검색 및 쿼리 API를 사용합니다. 소스 행을 먼저 Milvus 관리 컬렉션에 복사할 필요가 없습니다.</p>
<p>아키텍처 변경은 간단합니다. 데이터는 레이크에 그대로 남아 있고, Milvus가 인덱싱 및 검색 레이어를 추가합니다.</p>
<p>이는 또한 External Collection을 <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>,</strong> 즉 오픈 레이크 스토리지, 재사용 가능한 레이크 수준 인덱스, 공유 의미론적 레이어와 벡터 데이터베이스급 서빙을 결합한 AI를 위한 통합 레이크 네이티브 데이터 아키텍처로 가는 중요한 단계로 만듭니다. 온라인 검색은 더 이상 별도의 서빙 복사본에서 시작할 필요가 없으며, Spark, 학습 파이프라인, 평가 작업, 거버넌스 도구가 데이터의 다른 버전에서 작동할 필요도 없습니다. 동일한 레이크 상주 데이터 기반 위에서 작업할 수 있습니다.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">External Collection이란 무엇이며, 무엇을 바꾸는가<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection</strong>은 소스 데이터가 Milvus 관리 스토리지 외부에 있는 Milvus 컬렉션 유형입니다.</p>
<p>External Collection이 없으면 해당 카탈로그를 프로덕션 벡터 검색 뒤에 배치하는 것은 일반적으로 Milvus에 또 다른 복사본을 만드는 것을 의미합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>카탈로그가 변경되거나, 임베딩 모델이 변경되거나, 필드가 백필될 때마다 다른 파이프라인이 업데이트된 데이터를 그 경계를 넘어 이동해야 합니다.</p>
<p>External Collection을 사용하면 아키텍처는 다음과 같습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus는 외부 파일을 자체 소스 데이터 복사본으로 만들지 <strong>않습니다</strong>. 대신 External Collection에는 Milvus가 해당 파일을 해석하고 검색하는 데 필요한 정보가 포함됩니다:</p>
<ol>
<li>외부 파일이나 테이블을 식별하는 <code translate="no">external_source</code>.</li>
<li>소스 형식과 스토리지 접근을 설명하는 <code translate="no">external_spec</code>.</li>
<li>Milvus 스키마의 필드를 외부 데이터셋의 열에 연결하는 <code translate="no">external_field</code> 매핑.</li>
<li>Milvus가 검색을 위해 생성하는 인덱스, 매니페스트 및 서빙 상태.</li>
</ol>
<p><strong>소스 데이터의 제로 카피가 Milvus 내부의 상태가 제로라는 의미는 아닙니다.</strong> Milvus는 여전히 인덱스를 구축합니다. 여전히 컴퓨팅을 사용합니다. 여전히 데이터를 캐시합니다. 달라진 점은 Milvus에서 검색해야 한다는 이유만으로 권위 있는 행을 Milvus에 복사할 필요가 없다는 것입니다.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">일반 Milvus 컬렉션과 External Collection 비교</h3><table>
<thead>
<tr><th><strong>관심사</strong></th><th><strong>Milvus 관리 컬렉션</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td>소스 레코드</td><td>Milvus에 저장 및 관리</td><td>외부 파일 또는 테이블에 유지</td></tr>
<tr><td>데이터가 Milvus에 들어오는 방식</td><td>Insert, upsert, import, 또는 스트리밍 쓰기</td><td>외부 소스 매핑 + Refresh</td></tr>
<tr><td>온라인 변경</td><td>지원됨</td><td>Milvus에서 읽기 전용</td></tr>
<tr><td>신선도</td><td>Milvus 쓰기 경로 및 일관성 모델을 따름</td><td>마지막으로 성공적으로 게시된 Refresh를 따름</td></tr>
<tr><td>Milvus 관리 상태</td><td>소스 데이터, 메타데이터, 인덱스, 캐시</td><td>매핑, 매니페스트, 인덱스, 캐시</td></tr>
<tr><td>쿼리 경로</td><td>Milvus 검색 및 쿼리 API</td><td>Milvus 검색 및 쿼리 API</td></tr>
<tr><td>최적 적합</td><td>지속적으로 변화하는 온라인 데이터</td><td>대규모, 배치 생성, 읽기 중심 레이크 데이터</td></tr>
</tbody>
</table>
<p>따라서 External Collection은 일반 Milvus 컬렉션을 대체하기보다 보완합니다.</p>
<p>시스템은 빠르게 변화하는 온라인 상태를 일반 Milvus 컬렉션에 유지하면서, 대규모 코퍼스, 카탈로그, 과거 데이터셋, 모델 피처 또는 레이크에서 이미 생성되고 관리되는 기타 데이터에는 External Collection을 사용할 수 있습니다.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">두 번째 복사본을 제거하는 것이 중요한 이유<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection을 스토리지 최적화로 설명하고 싶은 유혹이 있습니다. 수 테라바이트의 데이터를 다른 데이터베이스에 복사하지 않으면 스토리지를 절약할 수 있으니까요. 유용하지만 이것이 주요 아키텍처 문제는 아닙니다.</p>
<p><strong>더 큰 비용은 두 데이터 시스템을 정렬된 상태로 유지하는 데서 발생합니다.</strong></p>
<p>제품 카탈로그를 다시 생각해 보겠습니다. 데이터 플랫폼은 권위 있는 Parquet 데이터셋을 생성합니다. 검색은 이를 벡터 데이터베이스로 가져옵니다. 추천 팀은 오프라인 분석을 위해 Spark를 통해 동일한 레이크 데이터를 읽을 수 있습니다. 그런 다음 새로운 임베딩 모델이 대체 벡터 열을 생성합니다. 재고와 메타데이터는 동시에 계속 변경됩니다.</p>
<p>온라인 서빙 복사본이 레이크와 독립적으로 되면 모든 변경 사항은 그 경계를 넘어야 합니다:</p>
<ul>
<li>데이터를 복사해야 합니다;</li>
<li>전송을 예약하고 모니터링해야 합니다;</li>
<li>실패한 작업은 재시도가 필요합니다;</li>
<li>스키마와 권한은 여러 시스템에서 표현해야 할 수 있습니다;</li>
<li>신선도는 동기화 파이프라인이 따라잡는 속도에 따라 달라집니다;</li>
<li>팀은 어떤 복사본이 실제로 원하는 버전인지 알아야 합니다.</li>
</ul>
<p>스토리지는 하나의 비용 항목에 불과합니다.</p>
<table>
<thead>
<tr><th><strong>비용</strong></th><th><strong>별도 레이크 + 서빙 복사본</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>소스 데이터 복사본</strong></td><td>레이크 복사본 + 별도 서빙 복사본</td><td>소스 행은 레이크에 유지</td></tr>
<tr><td><strong>데이터 이동</strong></td><td>지속적인 ETL/import 파이프라인</td><td>외부 소스에 대한 Refresh</td></tr>
<tr><td><strong>신선도</strong></td><td>export/import 주기에 따라 달라짐</td><td>새 Refresh가 게시되는 시점에 의해 제어됨</td></tr>
<tr><td><strong>거버넌스</strong></td><td>소스와 서빙 복사본이 정렬된 상태를 유지해야 함</td><td>소스 소유권, 계보, 버전 관리는 레이크 플랫폼에 유지됨</td></tr>
<tr><td><strong>오프라인 재사용</strong></td><td>다른 소비자가 자체 복사본을 준비할 수 있음</td><td>기존 레이크 도구가 동일한 소스를 계속 읽을 수 있음</td></tr>
<tr><td><strong>서빙 리소스</strong></td><td>데이터베이스 복사본과 쿼리 워크로드에 맞게 크기 조정</td><td>인덱싱, 쿼리 컴퓨팅, 캐시를 소스 행의 소유권과 별도로 관리할 수 있음</td></tr>
</tbody>
</table>
<p>이 차이는 AI 데이터가 더 자주 변경될수록 특히 중요해집니다.</p>
<p>팀은 코퍼스를 중복 제거하고, 분석을 위해 데이터를 클러스터링하며, 모델이 변경되면 새 임베딩을 생성합니다. 레이블, 요약, 추출된 엔티티, 품질 점수 또는 피드백 신호를 추가합니다. 프로덕션 애플리케이션이 검색하는 동일한 코퍼스에 대해 평가 작업과 데이터 정리 파이프라인을 실행합니다.</p>
<p>모든 시스템이 자체 복사본을 소유한다면 모든 개선은 또 하나의 동기화 작업이 됩니다.</p>
<p>External Collection은 그 경계를 바꿉니다: <strong>오프라인 시스템은 레이크 데이터셋에서 계속 작업할 수 있고, Milvus는 동일한 기반 위에서 검색을 서빙합니다.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">External Collection이 지원하는 데이터 소스<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection은 Milvus 특정 소스 레이아웃이 아닌 개방형 외부 관리 데이터를 중심으로 설계되었습니다. <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>를 통해 여러 외부 소스 형식을 지원합니다:</p>
<table>
<thead>
<tr><th><strong>외부 형식</strong></th><th><strong>format 값</strong></th><th><strong>Milvus가 읽는 대상</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Parquet 파일과 행 그룹을 포함하는 디렉터리 또는 객체 스토리지 접두사</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Vortex 파일 및 레이아웃 메타데이터</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Lance 데이터셋 및 프래그먼트 메타데이터</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Iceberg 메타데이터와 선택된 스냅샷</td></tr>
<tr><td>Milvus snapshot</td><td>milvus-table</td><td>외부 소스로 노출된 지원되는 Milvus 스냅샷</td></tr>
</tbody>
</table>
<p>소스와 Milvus 간의 매핑은 명시적입니다.</p>
<p><code translate="no">product_id</code>라는 소스 열은 Milvus 필드 <code translate="no">id</code>가 될 수 있고, <code translate="no">image_vec</code>는 <code translate="no">embedding</code>이 될 수 있으며, 넓은 소스 테이블이 모든 열을 컬렉션에 노출할 필요는 없습니다. 즉, 데이터 플랫폼이 서빙 데이터베이스를 충족시키기 위해 소스를 이름 변경하거나 다시 쓸 필요가 없습니다.</p>
<p>버전 관리 형식은 또 다른 유용한 속성을 추가합니다. Iceberg와 같은 소스를 사용하면 컬렉션이 쿼리 실행 시 현재 상태가 아닌 특정 스냅샷을 가리킬 수 있습니다. 고정된 소스 버전은 반복 가능한 평가, 회귀 테스트, 과거 분석 및 감사 워크로드에 유용합니다.</p>
<p>기본 파일은 나머지 데이터 스택에서도 계속 사용할 수 있습니다. Spark, 학습 프레임워크, 거버넌스 시스템 및 기타 레이크 호환 도구는 동일한 개방형 데이터를 계속 읽을 수 있습니다.</p>
<p>External Collection은 해당 데이터의 또 다른 소비자를 추가할 뿐, Milvus를 유일한 소유자로 만들지는 않습니다.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">외부 스토리지에 안전하게 접근하기</h3><p>Milvus는 또한 외부 스토리지를 읽을 수 있는 권한이 필요합니다.</p>
<p>스토리지 제공자에 따라 배포 시 애플리케이션 구성에 장기 자격 증명을 포함하는 대신 워크로드 또는 인스턴스 ID, AWS STS 역할 가정, 서비스 계정 가장, SAS 기반 접근 또는 제공자별 역할 시스템과 같은 메커니즘을 사용할 수 있습니다.</p>
<p>이 스토리지 ID는 Milvus가 소스에 도달하는 방식을 제어합니다. Milvus 내부의 권한 부여는 별도의 보안 경계로 유지됩니다.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">외부 컬렉션을 생성, 인덱싱, 새로 고치고 쿼리하는 방법<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection 수명 주기에는 네 가지 주요 단계가 있습니다:</p>
<ol>
<li>외부 소스를 정의하고 해당 열을 Milvus 스키마에 매핑합니다.</li>
<li>워크로드에 필요한 인덱스를 정의합니다.</li>
<li>Refresh를 실행하여 Milvus가 소스 데이터를 발견하고 쿼리 가능한 버전을 준비하게 합니다.</li>
<li>컬렉션을 로드하고 일반 Milvus 검색 및 쿼리 API를 사용합니다.</li>
</ol>
<p>다음은 동일한 제품 카탈로그를 External Collection으로 표현한 예입니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>인덱스는 일반 Milvus 인터페이스를 사용합니다:</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 외부 소스를 새로 고칩니다:</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>새로 고쳐진 버전이 준비되면 일반 Milvus 컬렉션처럼 로드하고 검색합니다:</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>중요한 차이는 검색 호출이 아니라 수명 주기가 시작되는 지점입니다. Milvus 관리 컬렉션은 데이터가 Milvus에 쓰이거나 가져와지면서 시작됩니다. External Collection은 이미 다른 곳에 존재하는 데이터에 대한 참조로 시작됩니다.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Refresh가 외부 데이터의 변경 사항을 감지하는 방법<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection은 Milvus 쪽에서는 읽기 전용이지만 기본 레이크 데이터셋이 영원히 고정되어 있어야 하는 것은 아닙니다.</p>
<p>제품 파이프라인이 다른 배치를 추가하거나, 메타데이터를 업데이트하거나, 새 모델의 임베딩을 쓴다고 가정해 보겠습니다. Milvus는 소스 경로에 나타나는 모든 객체를 지속적으로 추적하지 않습니다. 이러한 변경 사항은 <strong>Refresh</strong>를 통해 표시됩니다.</p>
<p>Refresh는 외부 메타데이터를 읽고, 소스 프래그먼트를 확인하고, 이를 Milvus 컬렉션에 연결하는 매니페스트를 업데이트하고, 해당 인덱스 상태를 준비합니다.</p>
<p>핵심은 이 작업이 증분 방식으로 수행될 수 있다는 것입니다.</p>
<p>Milvus는 변경되지 않은 소스 프래그먼트를 식별하고 기존 세그먼트 및 인덱스 작업을 재사용할 수 있습니다. 새로 추가되거나 변경된 프래그먼트는 새 처리가 필요한 부분입니다.</p>
<p>따라서 수 테라바이트 규모의 데이터셋에 대한 작은 변경이 전체 import와 전체 인덱스 재구축을 다시 트리거할 필요는 없습니다.</p>
<p>Refresh는 또한 서빙 시스템에 명확한 버전 경계를 제공합니다. 새 버전이 준비되는 동안 쿼리는 이전에 게시된 상태를 계속 사용합니다. Refresh가 완료되면 새 상태는 이전 데이터와 부분적으로 준비된 데이터가 혼합된 상태가 아닌 완전한 버전으로 제공됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 모델은 시간별 카탈로그 빌드, 야간 지식 베이스 업데이트, 주기적인 임베딩 새로 고침, 모델 생성 피처 파이프라인 및 유사한 배치 중심 워크로드에 자연스럽게 적합합니다.</p>
<p>이는 스트리밍 쓰기 경로를 대체하지 <strong>않습니다</strong>. 모든 삽입 또는 삭제가 즉시 Milvus를 통해 검색 가능해야 한다면 관리형 컬렉션이 더 나은 모델입니다.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Lazy Loading이 넓은 데이터셋의 메모리 사용을 줄이는 방법<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>소스 행을 객체 스토리지에 유지하는 것은 서빙 레이어가 쿼리에 응답하기 전에 모든 바이트를 로컬에 로드할 필요가 없을 때만 도움이 됩니다. Milvus Tiered Storage가 활성화되면 그렇지 않습니다.</p>
<p>컬렉션 로드 시점에 QueryNode는 처음에 스키마 정보, 인덱스 정의, 청크 맵, 원격 객체 참조와 같은 가벼운 메타데이터만 보관할 수 있습니다. 필드 데이터는 쿼리가 필요로 할 때 청크 수준에서 가져오며, 인덱스는 첫 사용 전까지 원격으로 유지되다가 로컬에 캐시됩니다. 자주 사용되는 데이터는 핫 상태로 유지되고, 자주 액세스되지 않는 데이터는 축출될 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이는 특히 넓은 AI 데이터셋에 유용합니다.</p>
<p>제품 행에는 여러 임베딩, 긴 설명, 원시 JSON, 이미지 메타데이터, 생성된 요약, 재고, 가격, 평점 및 기타 많은 속성이 포함될 수 있습니다. 일반적인 유사도 검색은 하나의 벡터와 재고, 가격, 평점만 접촉할 수 있습니다. 다른 모든 필드가 동일한 레코드에 속한다는 이유만으로 영구적으로 서빙 메모리를 차지해야 할 이유는 없습니다.</p>
<p>External Collection은 서빙 공간을 두 수준에서 줄일 수 있습니다:</p>
<ul>
<li><strong>첫째, 스키마 수준 프로젝션입니다.</strong> <code translate="no">external_field</code>를 통해 External Collection은 애플리케이션에 필요한 소스 열만 노출할 수 있습니다. 다른 열은 레이크 데이터셋에 남아 있으며 이 서빙 스키마에 포함되지 않습니다.</li>
<li><strong>둘째, 런타임 프로젝션입니다.</strong> 계층형 서빙 모델에서 QueryNode는 매핑된 데이터셋 전체를 미리 로드하는 대신 워크로드에 실제로 필요한 필드와 인덱스를 가져와 캐시합니다.</li>
</ul>
<p>즉, <strong>데이터셋은 레이크에서 넓게 유지되면서 서빙 공간을 그만큼 넓게 만들 필요가 없습니다.</strong></p>
<p>명백한 트레이드오프가 있습니다. 콜드 필드나 인덱스를 검색하는 쿼리는 첫 액세스 시 원격 읽기 비용을 지불할 수 있습니다. 워밍업 정책은 지연 시간에 중요한 필드나 인덱스를 사전 로드할 수 있고, 캐시 및 축출 정책은 자주 액세스되지 않는 상태가 로컬 리소스를 무기한 점유하지 않도록 합니다.</p>
<p>핵심은 객체 스토리지가 RAM처럼 작동한다는 것이 아닙니다. 메모리와 로컬 디스크가 소스 데이터셋의 전체 크기와 너비가 아닌 검색 워크로드의 작업 세트를 따를 수 있다는 것입니다.</p>
<p>여기서 소스 형식도 중요합니다. 광범위한 분석 스캔용으로 설계된 형식과 더 좁은 범위 또는 무작위 읽기에 최적화된 형식은 온디맨드 액세스에서 서로 다른 I/O 동작을 생성할 수 있습니다. External Collection은 이러한 스토리지 수준의 트레이드오프를 지우지 않습니다. Milvus가 그 위에 검색 레이어를 구축할 수 있게 할 뿐입니다.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">External Collection이 지원하는 검색 및 인덱싱 기능<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection은 단순히 Milvus가 임베딩 디렉터리를 가리키고 파일을 스캔하도록 하는 것이 아닙니다. Milvus는 외부 데이터에 검색 구조를 구축하고 표준 검색 엔진을 통해 쿼리를 실행합니다.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">외부 데이터 위에 구축된 Milvus 인덱스</h3><p>필드와 워크로드에 따라 Milvus는 다음을 구축할 수 있습니다:</p>
<ul>
<li>ANN 검색용 벡터 인덱스;</li>
<li>메타데이터 필터링용 스칼라 인덱스;</li>
<li>반정형 속성용 JSON 인덱스;</li>
<li>어휘 검색용 BM25 및 전문(full-text) 인덱스.</li>
<li>Milvus 데이터 모델이 지원하는 함수 생성 필드.</li>
</ul>
<p>ANN 검색은 모든 소스 벡터를 읽는 대신 이러한 인덱스를 사용하여 후보 집합을 좁힙니다.</p>
<p>이 구분이 중요한 이유는 임베딩을 레이크에 저장하는 것이 그 위에서 벡터 데이터베이스를 운영하는 것과 같지 않기 때문입니다. 지속성은 바이트를 제공합니다. 프로덕션 검색에는 인덱스, 쿼리 계획, 필터링, 랭킹, 캐싱 및 저지연 서빙 경로도 필요합니다.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">벡터 top-K를 넘어서</h3><p>또 다른 일반적인 실수는 'External Collection'을 'Parquet에 대한 벡터 검색'으로 읽는 것입니다. 이는 프로덕션 검색이 실제로 요구하는 바를 과소평가합니다.</p>
<p>프로덕션 검색 결과는 드물게 벡터 유사도만으로 결정됩니다. 정확한 용어, 접근 정책, 재고, 타임스탬프, 카테고리, 가격, 소스 품질 또는 비즈니스 랭킹 신호에 따라 달라질 수도 있습니다.</p>
<p>다음과 같은 쿼리를 고려해 보겠습니다:</p>
<table>
<thead>
<tr><th>여름용 빨간 플로럴 드레스, 재고 있음, 평점 높은 순</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>프로덕션 검색 경로는 여러 신호가 필요할 수 있습니다:</p>
<ul>
<li>"여름 플로럴 드레스"의 의미적 유사성을 위한 <strong>벡터 유사도</strong>.</li>
<li>"빨간"과 같은 정확한 용어를 위한 <strong>어휘 또는 전문 검색</strong>.</li>
<li>재고가 없거나 평점 임계값 미만인 제품을 제거하기 위한 <strong>스칼라 필터</strong>.</li>
<li>여러 검색 신호를 결합하기 위한 <strong>하이브리드 검색 및 랭킹</strong>.</li>
</ul>
<p>Milvus 3.0은 또한 <strong>서버 측 정렬, 집계 및 패싯</strong>과 같은 기능을 통해 초기 최근접 이웃 검색을 넘어 쿼리 엔진을 확장합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>더 넓은 관점은 External Collection이 레이크에 있는 데이터에 데이터베이스 검색 경로를 제공한다는 것입니다. 단순히 파일에서 벡터를 읽는 방법이 아닙니다.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">동일한 레이크 데이터가 온라인 서빙과 오프라인 처리를 지원하는 방법<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>소스를 개방형 레이크 형식으로 유지해야 하는 가장 강력한 아키텍처 이유는 단순히 두 번째 복사본에 비용이 들기 때문이 아닙니다. 지속적으로 개선하는 시스템에 동일한 데이터셋을 계속 사용할 수 있게 하기 위해서입니다.</p>
<p>제품 카탈로그로 돌아가 보겠습니다.</p>
<p>낮에는 Milvus가 제품 검색, 추천 또는 에이전트 검색을 위해 External Collection을 서빙할 수 있습니다.</p>
<p>동시에 다른 시스템은 레이크 데이터셋에서 직접 작업할 수 있습니다:</p>
<ul>
<li>Spark는 중복 제품을 식별할 수 있습니다.</li>
<li>학습 파이프라인은 새 모델에서 임베딩을 생성할 수 있습니다.</li>
<li>데이터 품질 작업은 잘못된 형식 또는 이상 레코드를 감지할 수 있습니다.</li>
<li>평가 파이프라인은 모델 버전 간 검색 품질을 비교할 수 있습니다.</li>
<li>배치 프로세스는 요약, 레이블 또는 추가 메타데이터를 생성할 수 있습니다.</li>
</ul>
<p>External Collection은 그러한 작업을 자체적으로 실행하지 <strong>않습니다</strong>. Spark는 Spark로, 학습은 학습으로 남습니다. 그 역할은 이들 사이에 있는 추가 서빙-데이터 경계를 제거하는 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>오프라인 작업은 개선된 데이터나 새 필드를 레이크에 다시 쓸 수 있습니다. 이후의 Refresh는 업데이트된 소스를 Milvus 검색 경로에서 사용할 수 있게 합니다.</p>
<p>서빙을 위해 또 다른 권위 있는 복사본을 재구성하는 것만을 목적으로 하는 별도의 export-and-import 루프는 없습니다.</p>
<p>거버넌스도 명확하게 분리되어 유지됩니다. 소스 버전, 계보 및 소스 소유권은 레이크 플랫폼에 남아 있습니다. Milvus는 자체 컬렉션 수준 권한 부여와 소스를 읽는 데 필요한 자격 증명을 유지합니다. 단일 데이터 기반을 공유하는 것이 모든 보안 도메인을 단일 시스템으로 통합하는 것을 의미하지는 않습니다.</p>
<p>이것이 <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a>와의 연결점입니다. 레이크는 공유 데이터 기반으로 유지되고 Milvus는 그 위에 저지연 검색 레이어를 제공합니다. External Collection은 Storage V3, Snapshots, Spark 통합, 스키마 진화 및 백필과 함께 해당 아키텍처의 한 부분입니다.</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">External Collection이 적합한 곳—그리고 그렇지 않은 곳<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection은 다음과 같은 경우에 매우 적합합니다:</strong></p>
<ul>
<li>권위 있는 데이터가 이미 Parquet, Vortex, Lance, Iceberg 또는 기타 지원되는 외부 소스에 있는 경우.</li>
<li>데이터셋이 고빈도 트랜잭션 쓰기가 아닌 주로 배치로 생성되는 경우.</li>
<li>두 번째 서빙 복사본을 유지하는 것이 상당한 ETL, 신선도 또는 거버넌스 오버헤드를 만드는 경우.</li>
<li>여러 시스템이 동일한 개방형 데이터셋을 사용해야 하는 경우.</li>
<li>명시적 Refresh 경계가 서빙 신선도에 허용 가능한 경우.</li>
<li>Milvus를 소스 행의 소유자로 만들지 않고 프로덕션 Milvus 검색을 원하는 경우.</li>
</ul>
<p><strong>다음과 같은 경우에는 일반 Milvus 컬렉션이 여전히 더 나은 선택입니다:</strong></p>
<ul>
<li>애플리케이션이 레코드를 지속적으로 삽입하거나 upsert하는 경우;</li>
<li>삭제가 온라인 쓰기 경로를 통해 표시되어야 하는 경우;</li>
<li>워크로드가 외부 스키마에서 사용할 수 없는 컬렉션 기능에 의존하는 경우;</li>
<li>서빙 설계가 의도적으로 필요한 모든 데이터를 메모리에 유지하여 원격 캐시 미스를 피하는 경우.</li>
</ul>
<p><strong>몇 가지 경계를 염두에 둘 필요가 있습니다.</strong></p>
<ul>
<li><strong>External Collection은 읽기 전용입니다.</strong> 소스 변경은 Milvus 외부에서 발생합니다.</li>
<li><strong>제로 카피는 소스 행에 적용됩니다.</strong> 인덱스, 매니페스트, 캐시 및 컴퓨팅은 여전히 리소스를 소모합니다.</li>
<li><strong>Refresh는 명시적입니다.</strong> 스트리밍 동기화 메커니즘이 아닙니다.</li>
<li><strong>소스는 계속 접근 가능해야 합니다.</strong> 검색, 인덱스 및 새로 고침 동작은 여전히 스토리지 접근과 자격 증명에 따라 달라집니다.</li>
<li><strong>Storage V3가 필요합니다.</strong> 오픈소스 Milvus 3.0에서 External Collection을 사용하려면 먼저 활성화해야 합니다.</li>
<li><strong>External Collection은 업스트림 처리를 대체하지 않습니다.</strong> 임베딩 생성, 클러스터링, 중복 제거 및 데이터 정리는 여전히 적절한 업스트림 시스템에서 수행됩니다.</li>
</ul>
<p>따라서 선택은 이분법적이기보다 상호 보완적입니다. 시스템은 빠르게 변화하는 온라인 상태에 일반 Milvus 컬렉션을 사용하고, 자연스러운 홈이 레이크인 대규모 배치 생성 데이터셋에는 External Collection을 사용할 수 있습니다.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Milvus 3.0에서 External Collection 사용해 보기<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection은 Milvus 3.0에서 사용할 수 있습니다. 대표적인 레이크 데이터셋으로 시작하여 워크로드에 중요한 측면(초기 및 증분 Refresh, 인덱스 구축 비용, 웜/콜드 쿼리 동작, 애플리케이션에 필요한 신선도 간격)을 평가하세요.</p>
<p>구현 세부 사항은 다음을 참조하세요:</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">External Collection 만들기</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 릴리스 노트</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 출시 블로그</a></li>
</ul>
<p>관리형 경로를 선호한다면 External Collection은 Zilliz Cloud의 <strong>Zilliz Vector Lakebase</strong>의 일부로도 사용할 수 있습니다. 다음을 참조하세요:</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">Zilliz Cloud에서의 External Collection</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">벡터 데이터베이스에서 Vector Lakebase로</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">Vector Lakebase를 구축한 이유: AI를 위한 비정형 데이터 아키텍처 재고</a></li>
</ul>
<p>구현 관련 질문이나 피드백은 <a href="https://github.com/milvus-io/milvus">Milvus GitHub 저장소</a> 또는 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 커뮤니티</a>에 전달할 수도 있습니다.</p>
