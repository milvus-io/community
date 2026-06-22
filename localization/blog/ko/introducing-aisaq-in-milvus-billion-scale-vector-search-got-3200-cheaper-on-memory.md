---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: |
  Milvus의 AISAQ 소개: 메모리 사용량이 3,200배나 줄어든 10억 규모 벡터 검색
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: >-
  Milvus가 AISAQ를 통해 메모리 비용을 3200배 절감함으로써, DRAM 오버헤드 없이 수십억 벡터 규모의 확장 가능한 검색을
  구현하는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>벡터 데이터베이스는 미션 크리티컬 AI 시스템의 핵심 인프라로 자리 잡았으며, 데이터 양은 기하급수적으로 증가하여 종종 수십억 개의 벡터에 달하기도 합니다. 이러한 규모에서는 낮은 지연 시간 유지, 정확도 보존, 신뢰성 확보, 복제본 및 지역 간 운영 등 모든 것이 더 어려워집니다. 하지만 그중에서도<strong>‘비용(COST)</strong>’이라는 과제가 가장 먼저 대두되어 아키텍처 설계에 결정적인 영향을 미치는 경향이 있습니다<strong>.</strong></p>
<p>빠른 검색을 제공하기 위해 대부분의 벡터 데이터베이스는 핵심 인덱싱 구조를 가장 빠르지만 가장 비싼 메모리 계층인 DRAM(동적 랜덤 액세스 메모리)에 저장합니다. 이 설계는 성능 면에서는 효과적이지만 확장성이 떨어집니다. DRAM 사용량은 쿼리 트래픽이 아닌 데이터 크기에 비례하여 증가하며, 압축이나 부분적인 SSD 오프로딩을 적용하더라도 인덱스의 상당 부분은 메모리에 남아 있어야 합니다. 데이터셋이 커짐에 따라 메모리 비용은 금세 제한 요인이 됩니다.</p>
<p>Milvus는 이미 인덱스의 상당 부분을 SSD로 이동시켜 메모리 부하를 줄이는 디스크 기반 ANN(인공 신경망) 방식인 <strong>DISKANN을</strong> 지원하고 있습니다. 그러나 DISKANN은 검색 시 사용되는 압축된 표현을 위해 여전히 DRAM에 의존합니다. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6은</a> <a href="https://milvus.io/docs/diskann.md">DISKANN에서</a> 영감을 받은 디스크 기반 벡터 인덱스인 <a href="https://milvus.io/docs/aisaq.md">AISAQ를</a> 통해 이를 한 단계 더 발전시켰습니다. KIOXIA가 개발한 AiSAQ의 아키텍처는 “제로 DRAM 풋프린트 아키텍처(Zero-DRAM-Footprint Architecture)”를 기반으로 설계되었으며, 검색에 필수적인 모든 데이터를 디스크에 저장하고 데이터 배치를 최적화하여 I/O 작업을 최소화합니다. 10억 개 벡터 워크로드에서 이 아키텍처는 실질적인 성능을 유지하면서도 메모리 사용량을 <strong>32GB에서 약 10MB로</strong>줄여, <strong>3,200배의 절감</strong>효과를 달성합니다.</p>
<p>다음 섹션에서는 그래프 기반 벡터 검색의 작동 방식, 메모리 비용이 발생하는 원인, 그리고 AISAQ가 10억 규모 벡터 검색의 비용 곡선을 어떻게 재구성하는지 설명합니다.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">기존 그래프 기반 벡터 검색의 작동 원리<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>벡터 검색은</strong> 고차원 공간에서 쿼리와 수치적 표현이 가장 가까운 데이터 포인트를 찾는 과정입니다. “가장 가까운”이란 코사인 거리나 L2 거리와 같은 거리 함수에 따라 거리가 가장 짧은 것을 의미합니다. 소규모에서는 이 과정이 간단합니다. 쿼리와 모든 벡터 간의 거리를 계산한 다음, 가장 가까운 벡터들을 반환하면 됩니다. 그러나 10억 규모와 같은 대규모에서는 이 접근 방식이 금세 너무 느려져 실용적이지 않게 됩니다.</p>
<p>모든 벡터와의 비교를 피하기 위해, 현대의 근사 최인접 이웃 검색(ANNS) 시스템은 <strong>그래프 기반 인덱스를</strong> 활용합니다. 쿼리를 모든 벡터와 일일이 비교하는 대신, 인덱스는 벡터들을 <strong>그래프로</strong> 구성합니다. 각 노드는 하나의 벡터를 나타내며, 가장자리는 수치적으로 가까운 벡터들을 연결합니다. 이러한 구조를 통해 시스템은 검색 공간을 획기적으로 좁힐 수 있습니다.</p>
<p>이 그래프는 벡터 간의 관계만을 기반으로 사전에 구축됩니다. 쿼리에 의존하지 않습니다. 쿼리가 도착하면 시스템의 임무는 전체 데이터셋을 스캔하지 않고도 <strong>그래프를 효율적으로 탐색하여</strong> 쿼리와 거리가 가장 가까운 벡터들을 식별하는 것입니다.</p>
<p>검색은 그래프 내의 <strong>미리 정의된 진입점에서</strong> 시작됩니다. 이 시작점은 쿼리와 멀리 떨어져 있을 수 있지만, 알고리즘은 쿼리에 더 가깝게 보이는 벡터 쪽으로 이동하며 단계적으로 위치를 개선합니다. 이 과정에서 검색은 서로 연동되는 두 <strong>가지</strong> 내부 데이터 구조, <strong>즉 후보 목록과</strong> <strong>결과 목록을</strong> 유지합니다.</p>
<p>그리고 이 과정에서 가장 중요한 두 단계는 후보 목록을 확장하고 결과 목록을 업데이트하는 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">후보 목록 확장</h3><p><strong>후보 목록은</strong> 검색이 다음으로 이동할 수 있는 위치를 나타냅니다. 이는 쿼리와의 거리를 기준으로 유망해 보이는 그래프 노드들을 우선순위 순으로 정리한 집합입니다.</p>
<p>각 반복 단계에서 알고리즘은 다음과 같이 동작합니다:</p>
<ul>
<li><p><strong>지금까지 발견된 후보 중 가장 가까운 것을 선택합니다.</strong> 후보 목록에서 쿼리와의 거리가 가장 짧은 벡터를 선택합니다.</p></li>
<li><p><strong>그래프에서 해당 벡터의 이웃을 검색합니다.</strong> 이 이웃들은 인덱스 구축 과정에서 현재 벡터와 가까운 것으로 식별된 벡터들입니다.</p></li>
<li><p><strong>아직 탐색하지 않은 인접 노드를 평가하고 후보 목록에 추가합니다.</strong> 아직 탐색되지 않은 각 인접 노드에 대해 알고리즘은 쿼리와의 거리를 계산합니다. 이전에 탐색한 인접 노드는 건너뛰고, 유망해 보이는 새로운 인접 노드는 후보 목록에 삽입합니다.</p></li>
</ul>
<p>후보 목록을 반복적으로 확장함으로써, 검색은 그래프에서 점점 더 관련성이 높은 영역을 탐색합니다. 이를 통해 알고리즘은 전체 벡터의 극히 일부만 검토하면서도 더 나은 해답을 향해 꾸준히 나아갈 수 있습니다.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">결과 목록 업데이트</h3><p>동시에 알고리즘은 최종 출력을 위해 지금까지 발견된 최상의 후보들을 기록하는 <strong>결과 목록을</strong> 유지합니다. 검색이 진행됨에 따라 알고리즘은 다음과 같은 작업을 수행합니다:</p>
<ul>
<li><p><strong>탐색 과정에서 만난 가장 가까운 벡터들을 추적합니다.</strong> 여기에는 확장을 위해 선택된 벡터뿐만 아니라 그 과정에서 평가된 다른 벡터들도 포함됩니다.</p></li>
<li><p><strong>쿼리와의 거리를 저장합니다.</strong> 이를 통해 후보들을 순위별로 정렬하고 현재 상위 K개 가장 가까운 이웃을 유지할 수 있습니다.</p></li>
</ul>
<p>시간이 지남에 따라 더 많은 후보가 평가되고 개선 여지가 줄어들면 결과 목록은 안정화됩니다. 더 이상 그래프를 탐색해도 더 가까운 벡터를 찾을 가능성이 낮아지면 검색이 종료되고, 결과 목록이 최종 답으로 반환됩니다.</p>
<p>간단히 말해, <strong>후보 목록은 탐색을 제어하는</strong> 반면, <strong>결과 목록은 지금까지 발견된 최상의 답변을 기록합니다</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">그래프 기반 벡터 검색의 장단점<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>이 그래프 기반 접근 방식이야말로 대규모 벡터 검색을 애초에 실용적으로 만드는 핵심 요소입니다. 모든 벡터를 스캔하는 대신 그래프를 탐색함으로써, 시스템은 데이터셋의 극히 일부만 처리하면서도 고품질의 결과를 찾을 수 있습니다.</p>
<p>그러나 이러한 효율성은 공짜로 얻어지는 것이 아닙니다. 그래프 기반 검색은 <strong>정확도와 비용</strong> 사이의 근본적인 상충 관계를 내포하고 있습니다 <strong>.</strong></p>
<ul>
<li><p>더 많은 이웃을 탐색하면 그래프의 더 넓은 영역을 커버하고 진정한 가장 가까운 이웃을 놓칠 가능성을 줄임으로써 정확도가 향상됩니다.</p></li>
<li><p>동시에, 탐색 범위를 확장할 때마다 추가적인 작업이 발생합니다. 즉, 거리 계산 횟수가 늘어나고, 그래프 구조에 대한 접근 횟수가 증가하며, 벡터 데이터 읽기 횟수도 늘어납니다. 검색이 더 깊거나 넓게 탐색될수록 이러한 비용은 누적됩니다. 인덱스의 설계 방식에 따라, 이는 CPU 사용량 증가, 메모리 부하 증가, 또는 추가적인 디스크 I/O로 나타납니다.</p></li>
</ul>
<p>높은 리콜과 효율적인 자원 사용이라는 상반된 요소 간의 균형을 맞추는 것이 그래프 기반 검색 설계의 핵심입니다.</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN과</strong></a> <strong>AISAQ</strong> 모두 이러한 상충 관계를 중심으로 구축되었지만, 이러한 비용을 어떻게, 그리고 어디에서 부담할지에 대해서는 서로 다른 아키텍처적 선택을 했습니다.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">DISKANN이 디스크 기반 벡터 검색을 최적화하는 방법<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN은 현재까지 가장 영향력 있는 디스크 기반 ANN 솔루션이며, 10억 규모 벡터 검색의 글로벌 벤치마크인 NeurIPS Big ANN 대회의 공식 기준 모델로 사용됩니다. 이 솔루션의 중요성은 단순히 성능에 그치지 않고, <strong>그래프 기반 ANN 검색이 빠른 속도를 내기 위해 반드시 메모리 내에서만 실행될 필요는 없다는</strong> 점을 입증했다는 데 있습니다.</p>
<p>DISKANN은 SSD 기반 스토리지와 신중하게 선택된 인메모리 구조를 결합함으로써, 막대한 DRAM 용량을 필요로 하지 않으면서도 상용 하드웨어에서 대규모 벡터 검색이 높은 정확도와 낮은 지연 시간을 달성할 수 있음을 입증했습니다. 이는 <em>검색 과정 중 어떤 부분이 빠르게 처리되어야 하고</em>, <em>어떤 부분은 느린 액세스도 허용할 수 있는지를</em> 재고함으로써 가능해졌습니다.</p>
<p><strong>대체로 DISKANN은 가장 자주 액세스되는 데이터를 메모리에 보관하는 한편, 크기가 크고 액세스 빈도가 낮은 구조는 디스크로 이동시킵니다.</strong> 이러한 균형은 몇 가지 핵심적인 설계 선택을 통해 달성됩니다.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. PQ 거리를 활용한 후보 목록 확장</h3><p>후보 목록을 확장하는 것은 그래프 기반 검색에서 가장 빈번하게 수행되는 작업입니다. 각 확장 작업에는 쿼리 벡터와 후보 노드의 인접 노드 간의 거리를 추정해야 합니다. 전체 고차원 벡터를 사용하여 이러한 계산을 수행하려면 디스크에서 빈번한 무작위 읽기 작업이 필요하며, 이는 계산적 측면과 I/O 측면 모두에서 비용이 많이 드는 작업입니다.</p>
<p>DISKANN은 벡터를 <strong>PQ(Product Quantization) 코드로</strong> 압축하여 메모리에 보관함으로써 이러한 비용을 피합니다. PQ 코드는 전체 벡터보다 훨씬 작지만, 거리를 대략적으로 추정하기에 충분한 정보를 여전히 보존합니다.</p>
<p>후보 확장 과정에서 DISKANN은 SSD에서 전체 벡터를 읽어오는 대신 메모리에 저장된 PQ 코드를 사용하여 거리를 계산합니다. 이를 통해 그래프 탐색 중 디스크 I/O가 획기적으로 감소하며, 대부분의 SSD 트래픽을 중요 경로에서 배제하면서도 후보를 빠르고 효율적으로 확장할 수 있습니다.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. 디스크 상의 전체 벡터와 인접 노드 목록의 병렬 배치</h3><p>모든 데이터를 압축하거나 근사적으로 접근할 수 있는 것은 아닙니다. 유망한 후보들이 식별된 후에도, 정확한 결과를 얻기 위해서는 검색이 다음 두 가지 유형의 데이터에 접근해야 합니다:</p>
<ul>
<li><p>그래프 탐색을 계속하기 위한<strong>이웃 목록</strong></p></li>
<li><p>최종 재순위를 위한<strong>전체(압축되지 않은) 벡터</strong></p></li>
</ul>
<p>이러한 구조는 PQ 코드보다 접근 빈도가 낮기 때문에 DISKANN은 이를 SSD에 저장합니다. 디스크 오버헤드를 최소화하기 위해 DISKANN은 각 노드의 인접 노드 목록과 전체 벡터를 디스크의 동일한 물리적 영역에 배치합니다. 이를 통해 단일 SSD 읽기 작업으로 두 데이터를 모두 가져올 수 있습니다.</p>
<p>관련 데이터를 한 곳에 배치함으로써, DISKANN은 검색 과정에서 필요한 무작위 디스크 액세스 횟수를 줄입니다. 이러한 최적화는 특히 대규모 환경에서 확장 및 재순위 지정 효율을 모두 향상시킵니다.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. SSD 활용도 향상을 위한 병렬 노드 확장</h3><p>그래프 기반 ANN 검색은 반복적인 과정입니다. 각 반복에서 후보 노드 하나만 확장한다면, 시스템은 한 번에 단 하나의 디스크 읽기 요청만 발행하게 되어 SSD의 병렬 대역폭 대부분이 활용되지 않게 됩니다. 이러한 비효율을 방지하기 위해 DISKANN은 각 반복 단계에서 여러 후보 노드를 확장하고 SSD에 병렬 읽기 요청을 전송합니다. 이 접근 방식은 사용 가능한 대역폭을 훨씬 더 효율적으로 활용하며 필요한 총 반복 횟수를 줄여줍니다.</p>
<p><strong>beam_width_ratio</strong> 매개변수는 병렬로 확장되는 후보 <strong>노드의</strong> 수를 제어합니다: <strong>빔 폭 = CPU 코어 수 × beam_width_ratio.</strong> 비율이 높을수록 검색 범위가 넓어져 정확도가 향상될 가능성이 있지만, 동시에 계산량과 디스크 I/O도 증가합니다.</p>
<p>이를 상쇄하기 위해 DISKANN은 자주 액세스되는 데이터를 캐시하기 위해 메모리를 할당하는 캐시 관리기( <code translate="no">search_cache_budget_gb_ratio</code> )를 도입하여 SSD의 반복적인 읽기 작업을 줄입니다. 이러한 메커니즘들이 결합되어 DISKANN은 정확도, 지연 시간, I/O 효율성 간의 균형을 맞춥니다.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">이것이 중요한 이유 — 그리고 한계가 나타나는 지점</h3><p>DISKANN의 설계는 디스크 기반 벡터 검색 분야에서 큰 진전을 이룬 것입니다. PQ 코드를 메모리에 유지하고 더 큰 구조는 SSD로 이동시킴으로써, 완전한 인메모리 그래프 인덱스에 비해 메모리 사용량을 크게 줄입니다.</p>
<p>동시에, 이 아키텍처는 검색에 필수적인 데이터의 경우 여전히 <strong>상시 활성화된 DRAM에</strong> 의존합니다. 트래버설 효율을 유지하려면 PQ 코드, 캐시 및 제어 구조가 메모리에 상주해야 합니다. 데이터셋이 수십억 개의 벡터 규모로 증가하고 배포 환경에 복제본이나 리전이 추가됨에 따라, 이러한 메모리 요구 사항은 여전히 제한 요인이 될 수 있습니다.</p>
<p><strong>AISAQ는</strong> 바로 이러한 격차를 해소하기 위해 설계되었습니다.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">AISAQ의 작동 원리와 그 중요성<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ는 DISKANN의 핵심 개념을 직접 기반으로 하지만, <strong>PQ 데이터를 DRAM에 보관할 필요성을</strong> 제거한다는 중대한 변화를 도입합니다. 압축된 벡터를 검색에 필수적인 상시 메모리 구조로 취급하는 대신, AISAQ는 이를 SSD로 이동시키고 효율적인 트래버설을 유지하기 위해 그래프 데이터가 디스크에 배치되는 방식을 재설계합니다.</p>
<p>이를 실현하기 위해 AISAQ는 그래프 검색 중에 필요한 데이터(전체 벡터, 인접 노드 목록, PQ 정보)가 디스크 상에서 액세스 국소성에 최적화된 패턴으로 배열되도록 노드 저장 방식을 재구성합니다. 목표는 단순히 더 많은 데이터를 비용 효율적인 디스크로 옮기는 것뿐만 아니라, <strong>앞서 설명한 검색 프로세스를 저해하지 않으면서</strong> 이를 수행하는 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>다양한 애플리케이션 요구 사항을 충족하기 위해 AISAQ는 ‘성능(Performance)’과 ‘확장성(Scale)’이라는 두 가지 디스크 기반 저장 모드를 제공합니다. 기술적 관점에서 볼 때, 이 두 모드는 주로 검색 중 PQ 압축 데이터의 저장 및 액세스 방식에서 차이가 있습니다. 애플리케이션 관점에서 볼 때, 이 두 모드는 온라인 시맨틱 검색 및 추천 시스템에서 흔히 볼 수 있는 저지연 요구 사항과 RAG에서 흔히 볼 수 있는 초고확장성 요구 사항이라는 두 가지 서로 다른 유형의 요구 사항을 충족합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance: 속도 최적화</h3><p>AISAQ-performance는 데이터 콜로케이션을 통해 낮은 I/O 오버헤드를 유지하면서 모든 데이터를 디스크에 보관합니다.</p>
<p>이 모드에서는:</p>
<ul>
<li><p>각 노드의 전체 벡터, 에지 목록 및 인접 노드의 PQ 코드가 디스크에 함께 저장됩니다.</p></li>
<li><p>후보 확장 및 평가에 필요한 모든 데이터가 함께 배치되어 있으므로, 노드를 방문할 때도 여전히 <strong>단일 SSD 읽기</strong> 작업만 필요합니다.</p></li>
</ul>
<p>검색 알고리즘의 관점에서 볼 때, 이는 DISKANN의 액세스 패턴과 매우 유사합니다. 검색에 필수적인 모든 데이터가 이제 디스크에 저장되어 있음에도 불구하고, 후보 확장은 여전히 효율적이며 실행 시간 성능도 비슷한 수준을 유지합니다.</p>
<p>대신 저장소 오버헤드가 발생합니다. 인접 노드의 PQ 데이터가 여러 노드의 디스크 페이지에 나타날 수 있기 때문에, 이러한 레이아웃은 중복을 유발하고 전체 인덱스 크기를 상당히 증가시킵니다.</p>
<p>따라서 AISAQ-Performance 모드는 디스크 효율성보다 낮은 I/O 지연 시간을 우선시합니다. 애플리케이션 관점에서 볼 때, AISAQ-Performance 모드는 온라인 시맨틱 검색에 요구되는 10 mSec 범위의 지연 시간을 제공할 수 있습니다.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Scale: 스토리지 효율성 최적화</h3><p>AISAQ-Scale은 정반대의 접근 방식을 취합니다. 이 모드는 모든 데이터를 SSD에 유지하면서도 <strong>디스크 사용량을 최소화하도록</strong> 설계되었습니다.</p>
<p>이 모드에서는:</p>
<ul>
<li><p>PQ 데이터는 중복 없이 디스크에 별도로 저장됩니다.</p></li>
<li><p>이를 통해 중복성을 제거하고 인덱스 크기를 대폭 줄일 수 있습니다.</p></li>
</ul>
<p>대신, 노드 및 인접 노드의 PQ 코드에 접근할 때 <strong>여러 번의 SSD 읽기 작업이</strong> 필요할 수 있어, 후보 확장 시 I/O 작업이 증가합니다. 이를 최적화하지 않으면 검색 속도가 현저히 저하될 수 있습니다.</p>
<p>이러한 오버헤드를 제어하기 위해 AISAQ-Scale 모드는 두 가지 추가 최적화 기법을 도입합니다:</p>
<ul>
<li><p><strong>PQ 데이터 재배열</strong>: PQ 벡터를 액세스 우선순위에 따라 정렬하여 국소성을 개선하고 무작위 읽기 작업을 줄입니다.</p></li>
<li><p><strong>DRAM 내 PQ 캐시</strong> (<code translate="no">pq_read_page_cache_size</code>)는 자주 액세스되는 PQ 데이터를 저장하여 자주 사용되는 항목에 대한 반복적인 디스크 읽기를 방지합니다.</p></li>
</ul>
<p>이러한 최적화를 통해 AISAQ-Scale 모드는 실질적인 검색 성능을 유지하면서도 AISAQ-Performance보다 훨씬 더 뛰어난 저장 효율을 달성합니다. 이 성능은 DISKANN보다는 낮지만, 저장 오버헤드가 없으며(인덱스 크기는 DISKANN과 유사함) 메모리 사용량이 획기적으로 적습니다. 애플리케이션 관점에서 볼 때, AiSAQ는 초고규모 환경에서 RAG 요구 사항을 충족할 수 있는 수단을 제공합니다.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">AISAQ의 주요 장점</h3><p>검색에 필수적인 모든 데이터를 디스크로 이동하고 해당 데이터에 대한 액세스 방식을 재설계함으로써, AISAQ는 그래프 기반 벡터 검색의 비용 및 확장성 프로필을 근본적으로 변화시킵니다. 이 설계는 세 가지 중요한 이점을 제공합니다.</p>
<p><strong>1. 최대 3,200배 감소된 DRAM 사용량</strong></p>
<p>Product Quantization(PQ)은 고차원 벡터의 크기를 크게 줄여주지만, 수십억 규모에서는 메모리 사용량이 여전히 상당합니다. 기존 설계에서는 압축 후에도 검색 중 PQ 코드를 메모리에 유지해야 합니다.</p>
<p>예를 들어, 10억 개의 128차원 벡터로 구성된 벤치마크인 <strong>SIFT1B의</strong> 경우, 구성에 따라 PQ 코드만으로도 약 <strong>30~120GB의 DRAM이</strong> 필요합니다. 압축되지 않은 전체 벡터를 저장하려면 추가로 <strong> 약 480 GB가</strong> 필요합니다. PQ가 메모리 사용량을 4~16배 줄여주기는 하지만, 남아 있는 메모리 사용량은 여전히 인프라 비용을 좌우할 만큼 큽니다.</p>
<p>AISAQ는 이러한 요구 사항을 완전히 제거합니다. PQ 코드를 DRAM 대신 SSD에 저장함으로써, 영구적인 인덱스 데이터로 인해 메모리가 소모되는 일이 없어집니다. DRAM은 후보 목록이나 제어 메타데이터와 같은 가볍고 일시적인 구조에만 사용됩니다. 실제로 이를 통해 메모리 사용량이 수십 기가바이트에서 <strong>약 10 MB로</strong> 감소합니다. 대표적인 10억 규모 구성에서 DRAM <strong>사용량은 32 GB에서 10 MB로</strong> 줄어들어 <strong>3,200배 감소합니다</strong>.</p>
<p>SSD의 <strong>용량당 단가가</strong> DRAM에 비해 약 <strong>1/30 수준이라는</strong> 점을 고려할 때, 이러한 전환은 전체 시스템 비용에 직접적이고 극적인 영향을 미칩니다.</p>
<p><strong>2. 추가적인 I/O 오버헤드 없음</strong></p>
<p>PQ 코드를 메모리에서 디스크로 이동하면 일반적으로 검색 중 I/O 작업 횟수가 증가합니다. AISAQ는 <strong>데이터 레이아웃과 액세스 패턴을</strong> 세심하게 제어하여 이러한 <strong>문제를</strong> 방지합니다. AISAQ는 관련 데이터를 디스크 전체에 흩어 놓지 않고, PQ 코드, 전체 벡터 및 인접 목록을 한 곳에 배치하여 함께 검색할 수 있도록 합니다. 이를 통해 후보 확장이 추가적인 무작위 읽기를 유발하지 않도록 보장합니다.</p>
<p>사용자가 인덱스 크기와 I/O 효율성 간의 균형을 조절할 수 있도록, AISAQ는 각 노드와 함께 인라인으로 저장되는 PQ 데이터의 양을 결정하는 ` <code translate="no">inline_pq</code> ` 매개변수를 도입했습니다:</p>
<ul>
<li><p><strong>inline_pq 값이 낮을수록:</strong> 인덱스 크기는 작아지지만, 추가적인 I/O가 필요할 수 있습니다</p></li>
<li><p><strong>inline_pq 값을 높이면:</strong> 인덱스 크기는 커지지만, 단일 읽기 액세스를 유지합니다</p></li>
</ul>
<p><strong>inline_pq = max_degree로</strong> 구성할 경우, AISAQ는 하나의 디스크 작업으로 노드의 전체 벡터, 이웃 목록 및 모든 PQ 코드를 읽으며, 모든 데이터를 SSD에 보관하면서 DISKANN의 I/O 패턴과 일치합니다.</p>
<p><strong>3. 순차적 PQ 액세스를 통한 계산 효율성 향상</strong></p>
<p>DISKANN에서 후보 노드를 확장하려면 해당 노드의 R개 이웃 노드에 대한 PQ 코드를 가져오기 위해 R번의 무작위 메모리 액세스가 필요합니다. AISAQ는 단일 I/O로 모든 PQ 코드를 가져와 디스크에 순차적으로 저장함으로써 이러한 무작위성을 제거합니다.</p>
<p>순차적 레이아웃은 두 가지 중요한 이점을 제공합니다:</p>
<ul>
<li><p><strong>순차적인 SSD 읽기는</strong> 흩어진 무작위 읽기보다<strong>훨씬 빠릅니다</strong>.</p></li>
<li><p><strong>연속된 데이터는 캐시에 더 유리하여</strong> CPU가 PQ 거리를 더 효율적으로 계산할 수 있게 합니다.</p></li>
</ul>
<p>이는 PQ 거리 계산의 속도와 예측 가능성을 모두 향상시키며, DRAM 대신 SSD에 PQ 코드를 저장함으로써 발생하는 성능 손실을 상쇄하는 데 도움이 됩니다.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ 대 DISKANN: 성능 평가<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ가 DISKANN과 아키텍처적으로 어떻게 다른지 이해한 후, 다음 질문은 간단합니다. <strong>이러한 설계 선택이 실제로 성능과 리소스 사용량에 어떤 영향을 미칠까요?</strong> 이 평가에서는 10억 규모에서 가장 중요한 세 가지 측면, <strong>즉 검색 성능, 메모리 소비량, 디스크 사용량을</strong> 기준으로 AISAQ와 DISKANN을 비교합니다.</p>
<p>특히, 인라인 처리된 PQ 데이터(<code translate="no">INLINE_PQ</code>)의 양이 변함에 따라 AISAQ가 어떻게 동작하는지 살펴봅니다. 이 매개변수는 인덱스 크기, 디스크 I/O, 실행 시간 효율성 간의 균형을 직접적으로 제어합니다. 또한 <strong>차원은 거리 계산 비용과</strong> 저장 공간 요구 <strong>사항에 큰 영향을 미치므로, 저차원 및 고차원 벡터 워크로드에서</strong> 두 접근 <strong>방식을</strong> 모두 평가합니다.</p>
<h3 id="Setup" class="common-anchor-header">설정</h3><p>모든 실험은 인덱스 동작을 분리하고 네트워크 또는 분산 시스템의 영향으로 인한 간섭을 피하기 위해 단일 노드 시스템에서 수행되었습니다.</p>
<p><strong>하드웨어 구성:</strong></p>
<ul>
<li><p>CPU: AMD EPYC 9454P CPU @ 2.70GHz</p></li>
<li><p>메모리: 속도: 3200 MT/s, 유형: DDR4, 용량: 384 GB</p></li>
<li><p>디스크: KIOXIA CM7 7.68 TB<sup>NVMe™</sup> SSD</p></li>
</ul>
<p><h6><em>AMD EPYC는 Advanced Micro Devices, Inc.의 상표입니다.</em></h6>
<h6><em>NVMe는 미국 및 기타 국가에서 NVM Express, Inc.의 등록 상표 또는 미등록 상표입니다.</em></h6></p>
<p><strong>인덱스 구축 매개변수</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>쿼리 매개변수</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">벤치마크 방법</h3><p>DISKANN과 AISAQ 모두 Milvus에서 사용되는 오픈소스 벡터 검색 엔진인 <a href="https://milvus.io/docs/knowhere.md">Knowhere를</a> 사용하여 테스트되었습니다. 이번 평가에는 다음 두 가지 데이터셋이 사용되었습니다.</p>
<ul>
<li><p><strong>SIFT128D (1M 벡터):</strong> 이미지 디스크립터 검색에 일반적으로 사용되는 잘 알려진 128차원 벤치마크입니다. <em>(원본 데이터셋 크기 ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1M 벡터):</strong> 트랜스포머 기반 의미 검색에 전형적인 768차원 임베딩 세트입니다. <em>(원본 데이터셋 크기 ≈ 2930 MB)</em></p></li>
</ul>
<p>이 데이터셋들은 압축된 비전 특징과 대규모 시맨틱 임베딩이라는 두 가지 서로 다른 실제 시나리오를 반영합니다.</p>
<h3 id="Results" class="common-anchor-header">결과</h3><p><strong>Sift128D1M (전체 벡터 ~488MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>SIFT 리콜 대 지연 시간 차트</span>
  
 </span></p>
<p><strong>Cohere768D1M (전체 벡터 ~2930MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Cohere 리콜 대 지연 시간 차트</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">분석</h3><p><strong>SIFT128D 데이터셋</strong></p>
<p>SIFT128D 데이터셋에서, AISAQ는 모든 PQ 데이터가 인라인 처리되어 각 노드에 필요한 데이터가 단일 4KB SSD 페이지에 완전히 들어갈 수 있도록 설정된 경우(INLINE_PQ = 48), DISKANN과 동등한 성능을 보입니다. 이 구성 하에서는 검색 중에 필요한 모든 정보가 한 곳에 배치됩니다:</p>
<ul>
<li><p>전체 벡터: 512B</p></li>
<li><p>인접 노드 목록: 48 × 4 + 4 = 196B</p></li>
<li><p>인접 노드의 PQ 코드: 48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>합계: 3780B</p></li>
</ul>
<p>전체 노드가 하나의 페이지에 들어맞기 때문에 액세스당 단 한 번의 I/O만 필요하며, AISAQ는 외부 PQ 데이터에 대한 무작위 읽기를 피합니다.</p>
<p>그러나 PQ 데이터의 일부만 인라인 처리되는 경우, 나머지 PQ 코드는 디스크의 다른 위치에서 가져와야 합니다(inline_pq 매개 변수는 SSD 페이지 활용도를 최적화하도록 설정되었습니다. 예를 들어, inline_pq = 20을 설정하면 단일 4KB 페이지에 두 개의 노드를 담을 수 있습니다). 이로 인해 추가적인 랜덤 I/O 작업이 발생하여 IOPS 수요가 급격히 증가하고 성능 저하로 이어집니다.</p>
<p><strong>Cohere768D 데이터셋</strong></p>
<p>Cohere768D 데이터셋에서 AISAQ의 성능은 DISKANN보다 약 8% 낮습니다. 그 이유는 768차원 벡터가 4KB SSD 페이지 하나에 들어가지 않기 때문입니다:</p>
<ul>
<li><p>전체 벡터: 3072B</p></li>
<li><p>인접 노드 목록: 48 × 4 + 4 = 196B</p></li>
<li><p>인접 노드의 PQ 코드: 48 × (3072B × 0.04167) ≈ 6,144B</p></li>
<li><p>합계: 9,412B (≈ 3페이지)</p></li>
</ul>
<p>이 경우, 모든 PQ 코드를 인라인으로 처리하더라도 각 노드는 여러 페이지에 걸쳐 있습니다. I/O 작업 횟수는 동일하게 유지되지만, 각 I/O 작업마다 훨씬 더 많은 데이터를 전송해야 하므로 SSD 대역폭을 훨씬 더 빠르게 소모하게 됩니다. 대역폭이 제한 요인이 되면, AISAQ는 DISKANN을 따라잡을 수 없게 됩니다. 특히 노드당 데이터 용량이 급격히 증가하는 고차원 워크로드에서는 더욱 그렇습니다.</p>
<p><strong>참고:</strong></p>
<p>AISAQ의 스토리지 레이아웃은 일반적으로 디스크 상의 인덱스 크기를 <strong>3배에서 5배까지</strong> 증가시킵니다. 이는 의도된 절충안으로, 검색 시 효율적인 단일 페이지 액세스를 가능하게 하기 위해 전체 벡터, 인접 노드 목록 및 PQ 코드가 디스크 상에 함께 배치됩니다. 이로 인해 SSD 사용량은 증가하지만, 디스크 용량은 DRAM보다 훨씬 저렴하며 대용량 데이터에서도 더 쉽게 확장할 수 있습니다.</p>
<p>실제로 사용자는 ` <code translate="no">INLINE_PQ</code> ` 및 PQ 압축 비율을 조정하여 이러한 절충점을 미세 조정할 수 있습니다. 이러한 매개변수를 통해 고정된 메모리 한계에 얽매이지 않고, 워크로드 요구 사항에 따라 검색 성능, 디스크 공간, 전체 시스템 비용 간의 균형을 맞출 수 있습니다.</p>
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
    </button></h2><p>현대 하드웨어의 경제성이 변화하고 있습니다. DRAM 가격은 여전히 높은 반면, SSD 성능은 급속히 발전하여 현재 PCIe 5.0 드라이브는 <strong>14 GB/s를</strong> 초과하는 대역폭을 제공합니다. 그 결과, 검색에 필수적인 데이터를 고가의 DRAM에서 훨씬 더 저렴한 SSD 스토리지로 이동시키는 아키텍처가 점점 더 매력적인 대안이 되고 있습니다. SSD의 <strong>기가바이트당</strong> 비용이 <strong>DRAM보다 30배 미만인 점을</strong> 고려할 때, 이러한 차이는 더 이상 미미한 수준이 아니며 시스템 설계에 실질적인 영향을 미칩니다.</p>
<p>AISAQ는 이러한 변화를 반영합니다. 항상 켜져 있어야 하는 대용량 메모리 할당 필요성을 제거함으로써, 벡터 검색 시스템이 DRAM의 한계 대신 데이터 크기와 워크로드 요구 사항에 따라 확장될 수 있도록 합니다. 이러한 접근 방식은 빠른 SSD가 데이터 영구 저장뿐만 아니라 능동적인 연산 및 검색에서도 핵심적인 역할을 수행하는 “올-인-스토리지(all-in-storage)” 아키텍처로의 광범위한 추세와 부합합니다. AiSAQ는 ‘성능(Performance)’과 ‘확장성(Scale)’이라는 두 가지 운영 모드를 제공함으로써, 최저 지연 시간을 요구하는 시맨틱 검색과 매우 높은 확장성은 필요하지만 적당한 지연 시간을 요구하는 RAG의 요구 사항을 모두 충족합니다.</p>
<p>이러한 변화는 벡터 데이터베이스에만 국한되지 않을 것입니다. 개발자들이 수용 가능한 성능을 달성하기 위해 데이터가 반드시 어디에 상주해야 하는지에 대한 오랜 가정을 재고함에 따라, 그래프 처리, 시계열 분석, 심지어 기존 관계형 시스템의 일부에서도 유사한 설계 패턴이 이미 나타나고 있습니다. 하드웨어 경제성이 계속 진화함에 따라 시스템 아키텍처도 이에 발맞춰 발전할 것입니다.</p>
<p>여기서 논의된 설계에 대한 자세한 내용은 다음 문서를 참조하십시오:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus 문서</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus 문서</a></p></li>
</ul>
<p>질문이 있거나 최신 Milvus의 특정 기능에 대해 더 깊이 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 등록해 주세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours를</a> 통해 20분간의 1:1 세션을 예약하여 인사이트, 지침 및 질문에 대한 답변을 얻을 수 있습니다.</p>
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 소개: 10억 규모에서도 경제적인 벡터 검색</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">임베딩 기능 소개: Milvus 2.6이 벡터화 및 의미적 검색을 어떻게 간소화하는가</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus의 JSON 분할: 유연성을 유지하며 88.9배 더 빠른 JSON 필터링</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">진정한 엔티티 수준 검색의 실현: Milvus의 새로운 Array-of-Structs 및 MAX_SIM 기능</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus의 MinHash LSH: LLM 훈련 데이터 내 중복 처리의 비장의 무기 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축의 극한을 추구하다: Milvus가 RaBitQ를 통해 3배 더 많은 쿼리를 처리하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">벤치마크는 거짓말을 한다 — 벡터 DB는 진정한 테스트가 필요하다 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Milvus에서 Kafka/Pulsar를 Woodpecker로 대체했습니다 </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">실제 환경에서의 벡터 검색: 리콜률을 떨어뜨리지 않으면서 효율적으로 필터링하는 방법</a></p></li>
</ul>
