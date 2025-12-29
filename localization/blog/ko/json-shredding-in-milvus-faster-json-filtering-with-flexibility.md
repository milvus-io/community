---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: 'Milvus의 JSON 파쇄: 유연성을 갖춘 88.9배 빠른 JSON 필터링'
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/JSON_Shredding_new_Cover_1_f9253063f5.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  밀버스 JSON 슈레딩이 어떻게 최적화된 컬럼형 스토리지를 사용해 전체 스키마 유연성을 유지하면서 JSON 쿼리 속도를 최대 89배까지
  높이는지 알아보세요.
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>최신 AI 시스템은 그 어느 때보다 더 많은 반정형 JSON 데이터를 생성하고 있습니다. 고객 및 제품 정보는 JSON 객체로 압축되고, 마이크로서비스는 모든 요청에 대해 JSON 로그를 전송하며, IoT 장치는 센서 판독값을 경량 JSON 페이로드로 스트리밍하고, 오늘날의 AI 애플리케이션은 구조화된 출력을 위해 점점 더 JSON으로 표준화되고 있습니다. 그 결과 벡터 데이터베이스로 유입되는 JSON과 유사한 데이터가 홍수를 이루고 있습니다.</p>
<p>전통적으로 JSON 문서를 처리하는 방법에는 두 가지가 있습니다:</p>
<ul>
<li><p><strong>JSON의 모든 필드를 고정 스키마로 사전 정의하고 인덱스를 구축하는 것입니다:</strong> 이 접근 방식은 견고한 쿼리 성능을 제공하지만 경직되어 있습니다. 데이터 형식이 변경되면 필드가 새로 추가되거나 수정될 때마다 또 다시 번거로운 데이터 정의 언어(DDL) 업데이트와 스키마 마이그레이션을 수행해야 합니다.</p></li>
<li><p><strong>전체 JSON 개체를 단일 열로 저장합니다(Milvus의 JSON 유형과 동적 스키마 모두 이 방식을 사용합니다):</strong> 이 옵션은 뛰어난 유연성을 제공하지만 쿼리 성능이 저하될 수 있습니다. 각 요청에는 런타임 JSON 구문 분석과 전체 테이블 스캔이 필요하므로 데이터 세트가 증가함에 따라 지연 시간이 급증합니다.</p></li>
</ul>
<p>이는 유연성과 성능의 딜레마였습니다.</p>
<p><a href="https://milvus.io/">Milvus에</a> 새로 도입된 JSON 파쇄 기능으로 더 이상 그렇지 않습니다.</p>
<p>이제 Milvus는 <a href="https://milvus.io/docs/json-shredding.md">JSON</a> 파쇄를 도입함으로써 스키마가 필요 없는 민첩성과 컬럼형 스토리지의 성능을 동시에 달성하여 마침내 대규모 반정형 데이터를 유연하고 쿼리 친화적으로 만들 수 있게 되었습니다.</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">JSON 파쇄의 작동 방식<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>JSON 파쇄는 행 기반 JSON 문서를 고도로 최적화된 컬럼형 스토리지로 변환하여 JSON 쿼리 속도를 높입니다. Milvus는 데이터 모델링을 위한 JSON의 유연성을 유지하면서 컬럼형 스토리지를 자동으로 최적화하여 데이터 액세스 및 쿼리 성능을 크게 향상시킵니다.</p>
<p>희소하거나 희귀한 JSON 필드를 효율적으로 처리하기 위해 Milvus는 공유 키에 대한 반전 인덱스도 제공합니다. 이 모든 과정은 사용자에게 투명하게 공개되므로 사용자는 평소처럼 JSON 문서를 삽입하고 내부적으로 최적의 저장 및 인덱싱 전략을 관리하도록 Milvus에 맡기면 됩니다.</p>
<p>Milvus는 다양한 형태와 구조를 가진 원시 JSON 레코드를 수신하면 각 JSON 키의 발생 비율과 유형 안정성(데이터 유형이 문서 간에 일관성이 있는지 여부)을 분석합니다. 이 분석에 따라 각 키는 세 가지 범주 중 하나로 분류됩니다:</p>
<ul>
<li><p><strong>입력된 키:</strong> 대부분의 문서에 나타나며 항상 동일한 데이터 유형(예: 모든 정수 또는 모든 문자열)을 갖는 키입니다.</p></li>
<li><p><strong>동적 키</strong>: 자주 나타나지만 데이터 유형이 혼합된 키(예: 때로는 문자열, 때로는 정수)입니다.</p></li>
<li><p><strong>공유 키:</strong> 빈도가 낮거나, 희박하거나, 중첩된 키로 구성 가능한 빈도 임계값 이하로 떨어지는 키입니다.</p></li>
</ul>
<p>Milvus는 효율성을 극대화하기 위해 각 카테고리를 다르게 처리합니다:</p>
<ul>
<li><p>입력된<strong>키는</strong> 강력하게 입력된 전용 열에 저장됩니다.</p></li>
<li><p><strong>동적 키는</strong> 런타임에 관찰되는 실제 값 유형에 따라 동적 열에 배치됩니다.</p></li>
<li><p>입력된 열과 동적 열은 모두 빠른 검색과 고도로 최적화된 쿼리 실행을 위해 Arrow/Parquet 열 형식으로 저장됩니다.</p></li>
<li><p><strong>공유 키</strong> 는 공유 키 반전 인덱스와 함께 컴팩트한 바이너리-JSON 열로 통합됩니다. 이 인덱스는 관련 없는 행을 조기에 정리하고 쿼리된 키가 포함된 문서로만 검색을 제한함으로써 빈도가 낮은 필드에 대한 쿼리를 가속화합니다.</p></li>
</ul>
<p>이러한 적응형 컬럼형 스토리지와 역 인덱싱의 조합은 Milvus의 JSON 파쇄 메커니즘의 핵심을 형성하며, 유연성과 고성능을 모두 지원합니다.</p>
<p>전체 워크플로는 아래 그림과 같습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이제 JSON 파쇄의 작동 원리에 대한 기본 사항을 살펴보았으니, 이 접근 방식을 유연하고 고성능으로 만드는 주요 기능에 대해 자세히 살펴보겠습니다.</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">파쇄 및 컬럼화</h3><p>새 JSON 문서가 작성되면 Milvus는 이를 세분화하여 최적화된 컬럼형 스토리지로 재구성합니다:</p>
<ul>
<li><p>입력된 키와 동적 키는 자동으로 식별되어 전용 열에 저장됩니다.</p></li>
<li><p>JSON에 중첩된 개체가 포함된 경우, Milvus는 경로 기반 열 이름을 자동으로 생성합니다. 예를 들어, <code translate="no">user</code> 객체 내의 <code translate="no">name</code> 필드는 <code translate="no">/user/name</code> 라는 열 이름으로 저장될 수 있습니다.</p></li>
<li><p>공유 키는 하나의 컴팩트한 바이너리 JSON 열에 함께 저장됩니다. 이러한 키는 자주 나타나지 않기 때문에 Milvus는 이러한 키에 대해 반전 인덱스를 생성하여 빠른 필터링을 가능하게 하고 시스템에서 지정된 키가 포함된 행을 빠르게 찾을 수 있도록 합니다.</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">지능형 컬럼 관리</h3><p>밀버스는 JSON을 열로 파쇄하는 것 외에도 동적 열 관리를 통해 인텔리전스 계층을 추가하여 데이터가 진화함에 따라 JSON 파쇄를 유연하게 유지할 수 있도록 합니다.</p>
<ul>
<li><p><strong>필요에 따라 생성되는 열:</strong> 수신되는 JSON 문서에 새로운 키가 나타나면 Milvus는 동일한 키를 가진 값을 전용 열에 자동으로 그룹화합니다. 따라서 사용자가 스키마를 미리 설계할 필요 없이 컬럼형 스토리지의 성능 이점을 그대로 유지할 수 있습니다. 또한 Milvus는 새 필드의 데이터 유형(예: INTEGER, DOUBLE, VARCHAR)을 추론하여 효율적인 열 형식을 선택합니다.</p></li>
<li><p><strong>모든 키는 자동으로 처리됩니다:</strong> Milvus는 JSON 문서의 모든 키를 분석하고 처리합니다. 따라서 사용자가 미리 필드를 정의하거나 인덱스를 구축할 필요 없이 광범위한 쿼리 범위를 보장합니다.</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">쿼리 최적화</h3><p>데이터가 올바른 열로 재구성되면 Milvus는 각 쿼리에 대해 가장 효율적인 실행 경로를 선택합니다:</p>
<ul>
<li><p><strong>입력된 키와 동적 키에 대한 직접 열 스캔:</strong> 쿼리가 이미 자체 열로 분할된 필드를 대상으로 하는 경우, Milvus는 해당 열을 직접 스캔할 수 있습니다. 이렇게 하면 처리해야 하는 총 데이터 양이 줄어들고 SIMD 가속 열 계산을 활용하여 더욱 빠르게 실행할 수 있습니다.</p></li>
<li><p><strong>공유 키에 대한 색인 조회:</strong> 쿼리에 자체 열로 승격되지 않은 필드(일반적으로 희귀 키)가 포함된 경우, Milvus는 공유 키 열에 대해 쿼리를 평가합니다. 이 열에 구축된 반전 인덱스를 통해 Milvus는 지정된 키가 포함된 행을 빠르게 식별하고 나머지는 건너뛸 수 있으므로 사용 빈도가 낮은 필드의 성능이 크게 향상됩니다.</p></li>
<li><p><strong>자동 메타데이터 관리:</strong> Milvus는 글로벌 메타데이터와 사전을 지속적으로 유지 관리하여 시간이 지남에 따라 수신되는 JSON 문서의 구조가 변화하더라도 쿼리가 정확하고 효율적으로 유지될 수 있도록 합니다.</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">성능 벤치마크<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>전체 JSON 문서를 단일 원시 필드로 저장할 때와 새로 출시된 JSON 파쇄 기능을 사용할 때의 쿼리 성능을 비교하기 위해 벤치마크를 설계했습니다.</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">테스트 환경 및 방법론</h3><ul>
<li><p>하드웨어: 1코어/8GB 클러스터</p></li>
<li><p>데이터 세트: <a href="https://github.com/ClickHouse/JSONBench.git">JSONBench의</a> 문서 1백만 개</p></li>
<li><p>방법론: 다양한 쿼리 패턴에 대한 QPS 및 지연 시간 측정</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">결과: 입력된 키</h3><p>이 테스트는 대부분의 문서에 존재하는 키를 쿼리할 때의 성능을 측정했습니다.</p>
<table>
<thead>
<tr><th>쿼리 표현식</th><th>QPS(파쇄 제외)</th><th>QPS(파쇄 포함)</th><th>성능 향상</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'commit'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">결과: 공유 키</h3><p>이 테스트는 "공유" 범주에 속하는 희소하고 중첩된 키를 쿼리하는 데 중점을 두었습니다.</p>
<table>
<thead>
<tr><th>쿼리 표현식</th><th>QPS(파쇄 제외)</th><th>QPS(조각화 포함)</th><th>성능 향상</th></tr>
</thead>
<tbody>
<tr><td>json['identity']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>공유 키 쿼리가 가장 극적인 개선(최대 89배 빨라짐)을 보여주며, 입력 키 쿼리는 15~30배의 일관된 속도 향상을 제공합니다. 전반적으로 모든 쿼리 유형이 JSON 조각화의 이점을 누리며 전반적으로 뚜렷한 성능 향상을 보입니다.</p>
<h2 id="Try-It-Now" class="common-anchor-header">지금 사용해 보기<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>API 로그, IoT 센서 데이터, 빠르게 진화하는 애플리케이션 페이로드 등 어떤 작업을 하든 JSON 파쇄는 유연성과 고성능을 모두 갖춘 보기 드문 기능을 제공합니다.</p>
<p>이 기능은 현재 사용 가능하며 지금 바로 사용해 보세요. 자세한 내용은 <a href="https://milvus.io/docs/json-shredding.md">이 문서에서도</a> 확인할 수 있습니다.</p>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
