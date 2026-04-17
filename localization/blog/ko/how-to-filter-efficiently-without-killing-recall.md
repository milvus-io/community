---
id: how-to-filter-efficiently-without-killing-recall.md
title: '실제 환경에서의 벡터 검색: 리콜을 죽이지 않고 효율적으로 필터링하는 방법'
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: >-
  이 블로그에서는 벡터 검색에서 널리 사용되는 필터링 기술과 Milvus 및 Zilliz Cloud에 내장된 혁신적인 최적화에 대해
  살펴봅니다.
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>많은 사람들이 벡터 검색을 단순히 ANN(근사 최인접 이웃) 알고리즘을 구현하고 하루를 끝내는 것으로 알고 있습니다. 하지만 실제 운영 환경에서 벡터 검색을 실행해 보면 금방 복잡해진다는 사실을 알 수 있습니다.</p>
<p>제품 검색 엔진을 구축한다고 상상해 보세요. 사용자가 "<em>이 사진과 비슷하지만 빨간색이고 100달러 미만인 신발을 보여주세요</em>."라고 요청할 수 있습니다. 이 쿼리를 처리하려면 의미적 유사성 검색 결과에 메타데이터 필터를 적용해야 합니다. 벡터 검색 결과가 나온 후 필터를 적용하는 것만큼 간단할 것 같나요? 글쎄요, 그렇지 않습니다.</p>
<p>필터링 조건이 매우 선택적일 때는 어떻게 될까요? 충분한 결과를 반환하지 못할 수도 있습니다. 또한 단순히 벡터 검색의 <strong>topK</strong> 매개변수를 늘리면 성능이 빠르게 저하되고 동일한 검색량을 처리하는 데 훨씬 더 많은 리소스가 소모될 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>내부적으로 효율적인 메타데이터 필터링은 상당히 까다로운 작업입니다. 벡터 데이터베이스는 그래프 인덱스를 스캔하고 메타데이터 필터를 적용하면서도 20밀리초라는 빠듯한 지연 시간 예산 내에서 응답해야 합니다. 이러한 초당 수천 개의 쿼리를 파산하지 않고 처리하려면 신중한 엔지니어링과 세심한 최적화가 필요합니다.</p>
<p>이 블로그에서는 <a href="https://milvus.io/docs/overview.md">Milvus</a> 벡터 데이터베이스와 완전 관리형 클라우드 서비스<a href="https://zilliz.com/cloud">(Zilliz Cloud)</a>에 구축된 혁신적인 최적화와 함께 벡터 검색에서 널리 사용되는 필터링 기법에 대해 살펴봅니다. 또한, 1000달러의 클라우드 예산으로 다른 벡터 데이터베이스에 비해 완전 관리형 Milvus가 얼마나 더 나은 성능을 낼 수 있는지 보여주는 벤치마크 테스트도 공유할 것입니다.</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">그래프 인덱스 최적화<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 대규모 데이터 세트를 처리하기 위해 효율적인 인덱싱 방법이 필요합니다. 인덱스가 없으면 데이터베이스는 쿼리를 데이터 세트의 모든 벡터와 비교해야 하므로(무차별 대입 검색) 데이터가 증가함에 따라 속도가 매우 느려집니다.</p>
<p><strong>Milvus는</strong> 이러한 성능 문제를 해결하기 위해 다양한 인덱스 유형을 지원합니다. 가장 많이 사용되는 것은 그래프 기반 인덱스 유형입니다: HNSW(전적으로 메모리에서 실행)와 DiskANN(메모리와 SSD를 모두 효율적으로 사용)입니다. 이러한 인덱스는 벡터를 맵에서 벡터의 이웃이 연결된 네트워크 구조로 구성하여 전체 벡터의 일부만 확인하면서 관련 검색 결과를 빠르게 탐색할 수 있습니다. 밀버스 완전 관리형 서비스인 <strong>질리즈 클라우드는</strong> 여기서 한 걸음 더 나아가 고급 벡터 검색 엔진인 카디널을 도입하여 이러한 인덱스를 더욱 강화하여 성능을 더욱 향상시켰습니다.</p>
<p>하지만 필터링 요구 사항('100달러 미만의 제품만 표시' 등)을 추가하면 새로운 문제가 발생합니다. 표준 접근 방식은 필터 기준을 충족하는 벡터를 표시하는 목록인 <em>비트셋을</em> 만드는 것입니다. 검색 중에 시스템은 이 비트셋에 유효한 것으로 표시된 벡터만 고려합니다. 이 접근 방식은 논리적으로 보이지만 <strong>연결이</strong> 끊어지는 심각한 문제를 야기합니다. 많은 벡터가 필터링되면 그래프 인덱스에서 신중하게 구성된 경로가 끊어지게 됩니다.</p>
<p>아래 다이어그램에서 점 A는 B, C, D에 연결되지만, B, C, D는 서로 직접 연결되지 않습니다. 필터가 포인트 A를 제거하면(아마도 너무 비싸서) B, C, D가 검색과 관련이 있더라도 이들 사이의 경로가 끊어집니다. 이렇게 하면 검색 중에 도달할 수 없는 단절된 벡터의 '섬'이 생성되어 결과의 품질(리콜)이 저하됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그래프 탐색 중 필터링에는 필터링된 모든 포인트를 미리 제외하거나 모든 포인트를 포함하고 나중에 필터를 적용하는 두 가지 일반적인 접근 방식이 있습니다. 아래 다이어그램에서 볼 수 있듯이 두 가지 접근 방식 모두 이상적이지 않습니다. 필터링된 포인트를 완전히 건너뛰면 필터링 비율이 1에 가까워지면서 리콜이 붕괴될 수 있으며(파란색 선), 메타데이터와 관계없이 모든 포인트를 방문하면 검색 공간이 비대해지고 성능이 크게 느려집니다(빨간색 선).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>연구원들은 회상률과 성능 사이의 균형을 맞추기 위해 몇 가지 접근법을 제안했습니다:</p>
<ol>
<li><strong>알파 전략:</strong> 이는 확률론적 접근 방식을 도입한 것으로, 벡터가 필터와 일치하지 않더라도 검색 중에 어느 정도의 확률로 해당 벡터를 방문할 수 있습니다. 이 확률(알파)은 필터링 비율, 즉 필터가 얼마나 엄격한지에 따라 달라집니다. 이렇게 하면 관련 없는 벡터를 너무 많이 방문하지 않고 그래프에서 필수적인 연결을 유지하는 데 도움이 됩니다.</li>
</ol>
<ol start="2">
<li><strong>ACORN 방법 [1]:</strong> 표준 HNSW에서는 인덱스 구성 중에 에지 프루닝을 사용해 희박한 그래프를 생성하고 검색 속도를 높입니다. ACORN 방식은 필터가 많은 노드를 제외할 수 있을 때 중요한 에지를 더 많이 유지하고 연결성을 강화하기 위해 이 가지치기 단계를 의도적으로 건너뜁니다. 경우에 따라 ACORN은 대략적으로 가장 가까운 이웃을 추가로 수집하여 각 노드의 이웃 목록을 확장함으로써 그래프를 더욱 강화하기도 합니다. 또한, 탐색 알고리즘은 두 단계 앞서서(즉, 이웃의 이웃을 검사) 탐색하므로 높은 필터링 비율에서도 유효한 경로를 찾을 확률이 향상됩니다.</li>
</ol>
<ol start="3">
<li><strong>동적으로 선택된 이웃:</strong> 알파 전략보다 개선된 방법입니다. 이 접근 방식은 확률적 건너뛰기에 의존하는 대신 검색 중에 다음 노드를 적응적으로 선택합니다. 알파 전략보다 더 많은 제어 기능을 제공합니다.</li>
</ol>
<p>Milvus에서는 알파 전략을 다른 최적화 기법과 함께 구현했습니다. 예를 들어, 극도로 선택적인 필터를 감지할 때 전략을 동적으로 전환합니다. 예를 들어, 데이터의 약 99%가 필터링 식과 일치하지 않는 경우, '모두 포함' 전략을 사용하면 그래프 탐색 경로가 상당히 길어져 성능이 저하되고 데이터의 '섬'이 고립될 수 있습니다. 이러한 경우, Milvus는 효율성을 높이기 위해 그래프 인덱스를 완전히 우회하는 무차별 검색으로 자동 전환합니다. 완전 관리형 Milvus를 구동하는 벡터 검색 엔진인 Cardinal(Zilliz Cloud)에서는 데이터 통계에 따라 지능적으로 적응하여 쿼리 성능을 최적화하는 '모두 포함' 및 '모두 제외' 탐색 방법의 동적 조합을 구현함으로써 이를 한 단계 더 발전시켰습니다.</p>
<p>AWS r7gd.4xlarge 인스턴스를 사용해 Cohere 1M 데이터 세트(차원 = 768)에 대한 실험을 통해 이 접근 방식의 효과를 확인할 수 있습니다. 아래 차트에서 파란색 선은 동적 조합 전략을 나타내고 빨간색 선은 그래프에서 필터링된 모든 지점을 통과하는 기준 접근 방식을 보여줍니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">메타데이터 인식 인덱싱<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>또 다른 문제는 메타데이터와 벡터 임베딩이 서로 어떻게 관련되어 있는지에서 비롯됩니다. 대부분의 애플리케이션에서 항목의 메타데이터 속성(예: 제품 가격)은 벡터가 실제로 나타내는 것(의미적 의미 또는 시각적 특징)과 최소한의 연관성을 갖습니다. 예를 들어, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>90dressanda90</mi></mrow><annotation encoding="application/x-tex">드레스와</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90</span></span></span></span>벨트는 가격대는 같지만 시각적 특성은 완전히 다릅니다. 이러한 단절로 인해 필터링과 벡터 검색을 결합하는 것은 본질적으로 비효율적입니다.</p>
<p>이 문제를 해결하기 위해 저희는 <strong>메타데이터 인식 벡터 인덱스를</strong> 개발했습니다. 모든 벡터에 대해 하나의 그래프만 있는 대신, 다양한 메타데이터 값에 대해 특화된 '하위 그래프'를 구축합니다. 예를 들어, 데이터에 '색상'과 '모양'에 대한 필드가 있는 경우, 이 필드에 대해 별도의 그래프 구조를 생성합니다.</p>
<p>'색상 = 파란색'과 같은 필터로 검색하면 기본 그래프가 아닌 색상별 하위 그래프가 사용됩니다. 하위 그래프는 이미 필터링하려는 메타데이터를 중심으로 구성되어 있기 때문에 훨씬 더 빠릅니다.</p>
<p>아래 그림에서 기본 그래프 인덱스를 <strong>기본 그래프라고</strong> 하고, 특정 메타데이터 필드를 위해 만들어진 특수 그래프를 <strong>열 그래</strong>프라고 합니다. 메모리 사용량을 효과적으로 관리하기 위해 각 지점이 가질 수 있는 연결 수를 제한합니다(아웃도). 검색에 메타데이터 필터가 포함되지 않은 경우 기본 그래프가 기본값으로 사용됩니다. 필터가 적용되면 적절한 열 그래프로 전환되어 상당한 속도 이점을 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">반복 필터링<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>때로는 벡터 검색이 아니라 필터링 자체가 병목 현상이 될 수 있습니다. 이는 특히 JSON 조건이나 상세한 문자열 비교와 같은 복잡한 필터에서 발생합니다. 기존의 접근 방식(선 필터링, 후 검색)은 시스템이 벡터 검색을 시작하기도 전에 잠재적으로 수백만 개의 레코드에 대해 이러한 고가의 필터를 평가해야 하기 때문에 속도가 매우 느려질 수 있습니다.</p>
<p>"벡터 검색을 먼저 한 다음 상위 결과를 필터링하면 어떨까?"라고 생각할 수도 있습니다. 이 방법은 때때로 효과가 있지만, 필터가 엄격하여 대부분의 결과를 걸러내는 경우 필터링 후 결과가 너무 적거나 아예 없을 수 있다는 큰 결함이 있습니다.</p>
<p>이러한 딜레마를 해결하기 위해 저희는<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase에서</a> 영감을 받아 Milvus와 Zilliz Cloud에 <strong>반복 필터링</strong> 기능을 만들었습니다. 반복 필터링은 전부 아니면 전무 접근 방식 대신 일괄 처리 방식으로 작동합니다:</p>
<ol>
<li><p>가장 가까운 벡터 일치 항목을 일괄적으로 가져옵니다.</p></li>
<li><p>이 배치에 필터 적용</p></li>
<li><p>필터링된 결과가 충분하지 않으면 다른 배치를 가져옵니다.</p></li>
<li><p>필요한 수의 결과를 얻을 때까지 반복합니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 접근 방식을 사용하면 고비용의 필터링 작업 횟수를 크게 줄이면서도 고품질의 결과를 충분히 얻을 수 있습니다. 반복 필터링 활성화에 대한 자세한 내용은 이 <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">반복 필터링 문서 페이지를</a> 참조하세요.</p>
<h2 id="External-Filtering" class="common-anchor-header">외부 필터링<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>실제 많은 애플리케이션은 데이터를 벡터 데이터베이스의 벡터와 기존 데이터베이스의 메타데이터 등 서로 다른 시스템으로 분할합니다. 예를 들어, 많은 조직에서 시맨틱 검색을 위해 제품 설명과 사용자 리뷰는 Milvus에 벡터로 저장하고 재고 상태, 가격 및 기타 구조화된 데이터는 PostgreSQL이나 MongoDB와 같은 기존 데이터베이스에 보관합니다.</p>
<p>이러한 분리는 구조적으로는 합리적이지만 필터링된 검색에는 문제가 있습니다. 일반적인 워크플로는 다음과 같습니다:</p>
<ul>
<li><p>관계형 데이터베이스에서 필터 조건(예: "$50 미만의 재고 품목")과 일치하는 레코드가 있는지 쿼리합니다.</p></li>
<li><p>일치하는 ID를 가져와 Milvus로 전송하여 벡터 검색을 필터링합니다.</p></li>
<li><p>이러한 ID와 일치하는 벡터에 대해서만 시맨틱 검색을 수행합니다.</p></li>
</ul>
<p>간단해 보이지만 행 수가 수백만 개 이상으로 늘어나면 병목 현상이 발생합니다. 대량의 ID 목록을 전송하면 네트워크 대역폭이 소모되고, Milvus에서 대규모 필터 표현식을 실행하면 오버헤드가 추가됩니다.</p>
<p>이 문제를 해결하기 위해 검색 반복기 API를 사용하고 기존 워크플로우를 뒤집는 경량 SDK 수준의 솔루션인 <strong>외부 필터링을</strong> Milvus에 도입했습니다.</p>
<ul>
<li><p>벡터 검색을 먼저 수행하여 의미적으로 가장 연관성이 높은 후보를 일괄적으로 검색합니다.</p></li>
<li><p>클라이언트 측의 각 배치에 사용자 정의 필터 기능 적용</p></li>
<li><p>필터링된 결과가 충분히 나올 때까지 자동으로 더 많은 배치를 가져옵니다.</p></li>
</ul>
<p>이러한 일괄 반복 접근 방식은 벡터 검색에서 가장 유망한 후보만 작업하기 때문에 네트워크 트래픽과 처리 오버헤드를 모두 크게 줄여줍니다.</p>
<p>다음은 pymilvus에서 외부 필터링을 사용하는 방법의 예시입니다:</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>세그먼트 수준 반복자에서 작동하는 반복 필터링과 달리 외부 필터링은 전체 쿼리 수준에서 작동합니다. 이 설계는 메타데이터 평가를 최소화하고 Milvus 내에서 대규모 필터를 실행하지 않으므로 엔드투엔드 성능이 더 간결하고 빨라집니다.</p>
<h2 id="AutoIndex" class="common-anchor-header">자동 색인<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 검색에는 항상 정확성과 속도 사이의 절충점이 존재합니다. 벡터를 더 많이 확인할수록 결과는 더 좋아지지만 쿼리 속도는 느려집니다. 필터를 추가하면 이 균형을 맞추기가 더욱 까다로워집니다.</p>
<p>Zilliz Cloud에서는 이 균형을 자동으로 미세 조정하는 ML 기반 최적화 도구인 <strong>AutoIndex를</strong> 만들었습니다. 복잡한 매개변수를 수동으로 구성하는 대신 AutoIndex는 머신 러닝을 사용하여 특정 데이터 및 쿼리 패턴에 대한 최적의 설정을 결정합니다.</p>
<p>이것이 어떻게 작동하는지 이해하려면 Zilliz가 Milvus를 기반으로 구축되었으므로 Milvus의 아키텍처에 대해 조금 아는 것이 도움이 됩니다: 쿼리는 여러 개의 쿼리노드 인스턴스에 분산됩니다. 각 노드는 데이터의 일부(세그먼트)를 처리하고 검색을 수행한 다음 결과를 병합합니다.</p>
<p>자동 인덱스는 이러한 세그먼트의 통계를 분석하고 지능적으로 조정합니다. 필터링 비율이 낮은 경우, 색인 쿼리 범위가 넓어져 검색 회수율이 높아집니다. 필터링 비율이 높으면 쿼리 범위가 좁아져 가능성이 낮은 후보에 노력이 낭비되지 않도록 합니다. 이러한 결정은 각 특정 필터링 시나리오에 가장 효과적인 검색 전략을 예측하는 통계 모델을 통해 이루어집니다.</p>
<p>자동 색인 기능은 색인 매개변수 그 이상입니다. 또한 최상의 필터 평가 전략을 선택하는 데도 도움을 줍니다. 필터 표현식을 구문 분석하고 세그먼트 데이터를 샘플링하여 평가 비용을 추정할 수 있습니다. 높은 평가 비용이 감지되면 자동으로 반복 필터링과 같은 더 효율적인 기술로 전환합니다. 이러한 동적 조정을 통해 각 쿼리에 항상 가장 적합한 전략을 사용할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">1,000달러 예산으로 성능 향상<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>이론적인 개선도 중요하지만, 대부분의 개발자에게 중요한 것은 실제 성능입니다. 현실적인 예산 제약 조건에서 이러한 최적화가 실제 애플리케이션 성능에 어떤 영향을 미치는지 테스트해보고 싶었습니다.</p>
<p>많은 기업들이 벡터 검색 인프라에 할당하는 합리적인 금액인 월 1,000달러의 실제 예산으로 여러 벡터 데이터베이스 솔루션을 벤치마킹했습니다. 각 솔루션에 대해 이 예산 제약 내에서 가능한 최고 성능의 인스턴스 구성을 선택했습니다.</p>
<p>테스트에 사용된 데이터</p>
<ul>
<li><p>백만 개의 768차원 벡터가 포함된 Cohere 1M 데이터 세트</p></li>
<li><p>실제 필터링된 검색 워크로드와 필터링되지 않은 검색 워크로드 혼합</p></li>
<li><p>일관된 비교를 위한 오픈 소스 vdb 벤치 벤치마크 도구</p></li>
</ul>
<p>경쟁 솔루션('VDB A', 'VDB B', 'VDB C'로 익명화)은 모두 예산 범위 내에서 최적으로 구성되었습니다. 그 결과, 완전 관리형 Milvus(질리즈 클라우드)가 필터링된 쿼리와 필터링되지 않은 쿼리 모두에서 일관되게 가장 높은 처리량을 달성한 것으로 나타났습니다. 동일한 1,000달러의 예산으로 최적화 기술을 사용하면 경쟁사 리콜에서 가장 높은 성능을 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>필터링이 포함된 벡터 검색은 쿼리에 필터 절을 추가하기만 하면 되기 때문에 겉으로 보기에는 간단해 보일 수 있습니다. 그러나 이 블로그에서 살펴본 바와 같이, 대규모로 고성능과 정확한 결과를 모두 달성하려면 정교한 엔지니어링 솔루션이 필요합니다. 밀버스와 질리즈 클라우드는 몇 가지 혁신적인 접근 방식을 통해 이러한 문제를 해결합니다:</p>
<ul>
<li><p><strong>그래프 인덱스 최적화</strong>: 필터가 연결 노드를 제거하더라도 유사한 항목 사이의 경로를 보존하여 결과 품질을 저하시키는 '섬' 문제를 방지합니다.</p></li>
<li><p><strong>메타데이터 인식 인덱싱</strong>: 일반적인 필터 조건에 대한 특수 경로를 생성하여 정확도 저하 없이 필터링된 검색을 훨씬 빠르게 처리합니다.</p></li>
<li><p><strong>반복 필터링</strong>: 결과를 일괄 처리하여 전체 데이터 세트가 아닌 가장 유망한 후보에만 복잡한 필터를 적용합니다.</p></li>
<li><p><strong>자동 색인</strong>: 머신 러닝을 사용해 데이터와 쿼리를 기반으로 검색 매개변수를 자동으로 조정하여 수동 구성 없이도 속도와 정확성의 균형을 맞출 수 있습니다.</p></li>
<li><p><strong>외부 필터링</strong>: 벡터 검색과 외부 데이터베이스를 효율적으로 연결하여 결과 품질을 유지하면서 네트워크 병목 현상을 제거합니다.</p></li>
</ul>
<p>Milvus와 Zilliz Cloud는 필터링된 검색 성능을 더욱 향상시키는 새로운 기능으로 계속 발전하고 있습니다.<a href="https://docs.zilliz.com/docs/use-partition-key"> 파티션 키와</a> 같은 기능을 통해 필터링 패턴에 따라 데이터를 더욱 효율적으로 구성할 수 있으며, 고급 하위 그래프 라우팅 기술은 성능의 한계를 더욱 확장하고 있습니다.</p>
<p>비정형 데이터의 양과 복잡성은 계속해서 기하급수적으로 증가하여 모든 검색 시스템에 새로운 과제를 안겨주고 있습니다. 저희 팀은 더 빠르고 확장 가능한 AI 기반 검색을 제공하기 위해 벡터 데이터베이스로 가능한 것의 한계를 끊임없이 넓혀가고 있습니다.</p>
<p>애플리케이션에서 필터링된 벡터 검색으로 인해 성능 병목 현상이 발생하고 있다면, 문제를 공유하고, 전문가의 조언을 얻고, 새로운 모범 사례를 발견할 수 있는 활발한 개발자 커뮤니티( <a href="https://milvus.io/community">milvus.io/community</a> )에 가입해 보세요.</p>
<h2 id="References" class="common-anchor-header">참조<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
