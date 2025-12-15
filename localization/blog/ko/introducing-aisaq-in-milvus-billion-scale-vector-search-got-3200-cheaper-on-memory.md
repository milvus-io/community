---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: 'Milvus의 AISAQ 도입: 메모리 사용량이 3,200배 줄어든 10억 개 규모의 벡터 검색'
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
  Milvus가 AISAQ를 통해 메모리 비용을 3200배 절감하고 DRAM 오버헤드 없이 확장 가능한 10억 개 벡터 검색을 지원하는 방법을
  알아보세요.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>벡터 데이터베이스는 미션 크리티컬 AI 시스템의 핵심 인프라가 되었으며, 데이터의 양은 기하급수적으로 증가하여 수십억 개의 벡터에 이르는 경우가 많습니다. 이러한 규모에서는 짧은 지연 시간 유지, 정확성 유지, 안정성 보장, 복제본 및 지역 간 운영 등 모든 것이 더 어려워집니다. 그러나 한 가지 문제가 조기에 드러나 아키텍처 결정을 지배하는 경향이 있는데, 바로 비용입니다<strong>.</strong></p>
<p>빠른 검색을 제공하기 위해 대부분의 벡터 데이터베이스는 가장 빠르고 가장 비싼 메모리 계층인 DRAM(동적 랜덤 액세스 메모리)에 주요 인덱싱 구조를 유지합니다. 이 설계는 성능에는 효과적이지만 확장성이 떨어집니다. DRAM 사용량은 쿼리 트래픽이 아닌 데이터 크기에 따라 확장되며, 압축 또는 부분적인 SSD 오프로드를 사용하더라도 인덱스의 많은 부분이 메모리에 남아 있어야 합니다. 데이터 세트가 증가함에 따라 메모리 비용은 빠르게 제한 요소가 됩니다.</p>
<p>Milvus는 이미 인덱스의 대부분을 SSD로 이동시켜 메모리 부담을 줄여주는 디스크 기반 ANN 접근 방식인 <strong>DISKANN을</strong> 지원하고 있습니다. 그러나 DISKANN은 검색 중에 사용되는 압축 표현을 위해 여전히 DRAM에 의존합니다. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6은</a> 검색에 중요한 모든 데이터를 디스크에 저장하는 <a href="https://milvus.io/docs/diskann.md">DISKANN에서</a> 영감을 얻은 디스크 기반 벡터 인덱스인 <a href="https://milvus.io/docs/aisaq.md">AISAQ를</a> 통해 이를 한 단계 더 발전시켰습니다. 10억 개의 벡터 워크로드에서 메모리 사용량을 <strong>32GB에서 약 10MB로</strong> <strong>3,200배 줄이면서도</strong>실질적인 성능은 그대로 유지합니다.</p>
<p>다음 섹션에서는 그래프 기반 벡터 검색이 어떻게 작동하는지, 메모리 비용이 어디서 발생하는지, 그리고 AISAQ가 10억 개 규모의 벡터 검색을 위해 어떻게 비용 곡선을 재구성하는지에 대해 설명합니다.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">기존 그래프 기반 벡터 검색의 작동 방식<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>벡터 검색은</strong> 고차원 공간에서 쿼리에 가장 가까운 수치 표현을 가진 데이터 포인트를 찾는 프로세스입니다. "가장 가깝다"는 것은 단순히 코사인 거리 또는 L2 거리와 같은 거리 함수에 따른 가장 작은 거리를 의미합니다. 작은 규모에서는 쿼리와 모든 벡터 사이의 거리를 계산한 다음 가장 가까운 벡터를 반환하는 간단한 작업입니다. 그러나 수십억 개와 같은 대규모에서는 이 접근 방식이 너무 느려서 실용적이지 않습니다.</p>
<p>소모적인 비교를 피하기 위해 최신 근사 근접 이웃 검색(ANNS) 시스템은 <strong>그래프 기반 인덱스에</strong> 의존합니다. 이 인덱스는 쿼리를 모든 벡터와 비교하는 대신 벡터를 <strong>그래프로</strong> 구성합니다. 각 노드는 벡터를 나타내며, 에지는 수치적으로 가까운 벡터를 연결합니다. 이 구조를 통해 시스템은 검색 공간을 극적으로 좁힐 수 있습니다.</p>
<p>그래프는 벡터 간의 관계만을 기반으로 미리 구축됩니다. 쿼리에 의존하지 않습니다. 쿼리가 도착하면 시스템의 임무는 전체 데이터 세트를 스캔하지 않고도 <strong>그래프를 효율적으로 탐색하고</strong> 쿼리와의 거리가 가장 작은 벡터를 식별하는 것입니다.</p>
<p>검색은 그래프에서 미리 정의된 <strong>시작점에서</strong> 시작됩니다. 이 시작점은 쿼리에서 멀리 떨어져 있을 수 있지만, 알고리즘은 쿼리에 더 가깝게 나타나는 벡터를 향해 이동하면서 단계적으로 위치를 개선합니다. 이 과정에서 검색은 <strong>후보 목록과</strong> <strong>결과 목록이라는</strong> 두 가지 내부 데이터 구조를 함께 유지합니다.</p>
<p>그리고 이 과정에서 가장 중요한 두 단계는 후보 목록을 확장하고 결과 목록을 업데이트하는 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">후보 목록 확장하기</h3><p><strong>후보 목록은</strong> 검색이 다음에 이동할 수 있는 위치를 나타냅니다. 쿼리와의 거리에 따라 유망한 것으로 보이는 그래프 노드의 우선순위가 지정된 집합입니다.</p>
<p>각 반복마다 알고리즘:</p>
<ul>
<li><p><strong>지금까지 발견된 가장 가까운 후보를 선택합니다.</strong> 후보 목록에서 쿼리와의 거리가 가장 작은 벡터를 선택합니다.</p></li>
<li><p><strong>그래프에서 해당 벡터의 이웃을 검색합니다.</strong> 이러한 이웃은 인덱스 구성 중에 현재 벡터에 가까운 것으로 확인된 벡터입니다.</p></li>
<li><p><strong>방문하지 않은 이웃을 평가하여 후보 목록에 추가합니다.</strong> 아직 탐색되지 않은 각 이웃에 대해 알고리즘은 쿼리와의 거리를 계산합니다. 이전에 방문한 이웃은 건너뛰고, 새로운 이웃이 유망해 보이면 후보 목록에 삽입됩니다.</p></li>
</ul>
<p>후보 목록을 반복적으로 확장함으로써 검색은 그래프에서 점점 더 관련성이 높은 영역을 탐색합니다. 이를 통해 알고리즘은 전체 벡터의 극히 일부만 검사하면서 더 나은 답을 향해 꾸준히 나아갈 수 있습니다.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">결과 목록 업데이트</h3><p>동시에 알고리즘은 최종 결과물에 대해 지금까지 발견된 최상의 후보를 기록하는 <strong>결과 목록을</strong> 유지합니다. 검색이 진행됨에 따라</p>
<ul>
<li><p><strong>트래버스 중에 발견한 가장 가까운 벡터를 추적합니다.</strong> 여기에는 확장을 위해 선택된 벡터와 도중에 평가된 다른 벡터가 포함됩니다.</p></li>
<li><p><strong>쿼리까지의 거리를 저장합니다.</strong> 이를 통해 후보의 순위를 매기고 현재 상위 K개의 가장 가까운 이웃을 유지할 수 있습니다.</p></li>
</ul>
<p>시간이 지남에 따라 더 많은 후보가 평가되고 더 적은 개선 사항이 발견됨에 따라 결과 목록이 안정화됩니다. 더 이상의 그래프 탐색을 통해 더 가까운 벡터를 찾을 수 없을 것 같으면 검색이 종료되고 결과 목록이 최종 답변으로 반환됩니다.</p>
<p>간단히 말해, <strong>후보 목록은 탐색을 제어하고</strong> <strong>결과 목록은 지금까지 발견된 최상의 답을 캡처합니다</strong>.</p>
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
    </button></h2><p>이 그래프 기반 접근 방식은 애초에 대규모 벡터 검색을 실용적으로 만드는 것입니다. 모든 벡터를 스캔하는 대신 그래프를 탐색함으로써 시스템은 데이터 세트의 극히 일부만 건드리면서 고품질의 결과를 찾을 수 있습니다.</p>
<p>하지만 이러한 효율성이 공짜로 제공되는 것은 아닙니다. 그래프 기반 검색은 <strong>정확도와 비용</strong> 사이에 근본적인 트레이드오프가 존재합니다.</p>
<ul>
<li><p>더 많은 이웃을 탐색하면 그래프의 더 많은 부분을 커버하고 실제 가장 가까운 이웃을 놓칠 가능성을 줄임으로써 정확도가 향상됩니다.</p></li>
<li><p>동시에, 더 많은 거리 계산, 그래프 구조에 대한 더 많은 액세스, 벡터 데이터의 더 많은 읽기와 같은 추가 확장이 있을 때마다 작업이 추가됩니다. 검색이 더 깊거나 더 넓은 범위를 탐색할수록 이러한 비용은 누적됩니다. 인덱스가 어떻게 설계되었는지에 따라, 이러한 비용은 CPU 사용량 증가, 메모리 압박 증가 또는 추가 디스크 I/O로 나타납니다.</p></li>
</ul>
<p>그래프 기반 검색 설계의 핵심은 이러한 상반된 힘, 즉 높은 회상률과 효율적인 리소스 사용 간의 균형을 맞추는 것입니다.</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN과</strong></a> <strong>AISAQ는</strong> 모두 이 같은 긴장을 바탕으로 구축되었지만, 이러한 비용을 지불하는 방법과 위치에 대해 서로 다른 아키텍처 선택을 합니다.</p>
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
<p>DISKANN은 현재까지 가장 영향력 있는 디스크 기반 ANN 솔루션으로, 수십억 개 규모의 벡터 검색을 위한 글로벌 벤치마크인 NeurIPS Big ANN 대회의 공식 기준이 되고 있습니다. 이 솔루션의 중요성은 성능뿐만 아니라 <strong>그래프 기반 ANN 검색이 반드시 메모리에만 의존할 필요는 없다는</strong> 것을 증명했다는 데 있습니다.</p>
<p>디스크앤은 SSD 기반 스토리지와 엄선된 인메모리 구조를 결합함으로써 대규모 벡터 검색이 대규모 DRAM 풋프린트 없이도 상용 하드웨어에서 강력한 정확도와 낮은 지연 시간을 달성할 수 있음을 입증했습니다. 이는 <em>검색의 어느 부분이 반드시 빨라야</em> 하고 <em>어느 부분이 느린 액세스를 용인할 수 있는지</em> 재고함으로써 이루어집니다.</p>
<p><strong>높은 수준에서 보면, 디스크앤은 가장 자주 액세스하는 데이터는 메모리에 보관하고, 액세스 빈도가 낮은 대용량 구조는 디스크로 이동시킵니다.</strong> 이러한 균형은 몇 가지 주요 설계 선택을 통해 달성됩니다.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. PQ 거리를 사용해 후보 목록 확장하기</h3><p>후보 목록 확장은 그래프 기반 검색에서 가장 빈번하게 이루어지는 작업입니다. 각 확장은 쿼리 벡터와 후보 노드의 이웃 노드 사이의 거리를 추정해야 합니다. 전체 고차원 벡터를 사용해 이러한 계산을 수행하려면 디스크에서 자주 무작위로 읽어야 하는데, 이는 계산과 I/O 측면에서 모두 비용이 많이 드는 작업입니다.</p>
<p>DISKANN은 벡터를 <strong>제품 양자화(PQ) 코드로</strong> 압축하여 메모리에 보관함으로써 이러한 비용을 방지합니다. PQ 코드는 전체 벡터보다 훨씬 작지만 대략적인 거리를 추정할 수 있는 충분한 정보를 보존합니다.</p>
<p>후보 확장을 하는 동안 DISKANN은 SSD에서 전체 벡터를 읽는 대신 이러한 인메모리 PQ 코드를 사용하여 거리를 계산합니다. 이렇게 하면 그래프 탐색 중에 디스크 I/O가 크게 줄어들어 검색이 후보를 빠르고 효율적으로 확장하는 동시에 대부분의 SSD 트래픽을 임계 경로에서 제외시킬 수 있습니다.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. 전체 벡터와 이웃 목록을 디스크에 공동 배치하기</h3><p>모든 데이터를 대략적으로 압축하거나 액세스할 수 있는 것은 아닙니다. 유망한 후보가 식별된 후에도 정확한 결과를 얻으려면 검색은 두 가지 유형의 데이터에 액세스해야 합니다:</p>
<ul>
<li><p>그래프 탐색을 계속하기 위한<strong>이웃 목록</strong></p></li>
<li><p>최종 순위 재지정을 위한<strong>전체(압축되지 않은) 벡터</strong></p></li>
</ul>
<p>이러한 구조는 PQ 코드보다 액세스 빈도가 낮기 때문에 DISKANN은 이를 SSD에 저장합니다. 디스크 오버헤드를 최소화하기 위해 DISKANN은 각 노드의 이웃 목록과 전체 벡터를 디스크의 동일한 물리적 영역에 배치합니다. 이렇게 하면 한 번의 SSD 읽기로 두 가지를 모두 검색할 수 있습니다.</p>
<p>관련 데이터를 함께 배치함으로써 DISKANN은 검색 중에 필요한 무작위 디스크 액세스 횟수를 줄입니다. 이러한 최적화는 특히 대규모에서 확장 및 순위 재지정 효율성을 모두 향상시킵니다.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. SSD 활용도 향상을 위한 병렬 노드 확장</h3><p>그래프 기반 ANN 검색은 반복적인 프로세스입니다. 각 반복이 하나의 후보 노드만 확장하면 시스템은 한 번에 하나의 디스크 읽기만 수행하므로 대부분의 SSD 병렬 대역폭이 사용되지 않게 됩니다. 이러한 비효율성을 피하기 위해 DISKANN은 각 반복에서 여러 후보를 확장하고 병렬 읽기 요청을 SSD에 보냅니다. 이 접근 방식은 사용 가능한 대역폭을 훨씬 더 잘 활용하고 필요한 총 반복 횟수를 줄입니다.</p>
<p><strong>빔 폭 비율</strong> 매개변수는 병렬로 확장되는 후보의 수를 제어합니다: <strong>빔 폭 = CPU 코어 수 × beam_width_ratio.</strong> 이 비율이 높을수록 검색 범위가 넓어져 정확도가 향상되지만 계산 및 디스크 I/O도 증가합니다.</p>
<p>이를 상쇄하기 위해 DISKANN은 자주 액세스하는 데이터를 캐시하기 위해 메모리를 예약하는 <code translate="no">search_cache_budget_gb_ratio</code> 을 도입하여 반복되는 SSD 읽기를 줄입니다. 이러한 메커니즘을 통해 DISKANN은 정확도, 지연 시간, I/O 효율성의 균형을 맞출 수 있습니다.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">이것이 중요한 이유와 한계가 나타나는 지점</h3><p>디스크 기반 벡터 검색을 위한 DISKANN의 설계는 중요한 진전입니다. PQ 코드를 메모리에 유지하고 더 큰 구조를 SSD로 푸시함으로써 완전한 인메모리 그래프 인덱스에 비해 메모리 사용 공간을 크게 줄입니다.</p>
<p>동시에, 이 아키텍처는 검색에 중요한 데이터를 위해 여전히 상시 가동되는 <strong>DRAM에</strong> 의존합니다. 효율적인 탐색을 유지하려면 PQ 코드, 캐시, 제어 구조가 메모리에 상주해야 합니다. 데이터 세트가 수십억 개의 벡터로 증가하고 배포에 복제본이나 지역이 추가됨에 따라 이러한 메모리 요구 사항은 여전히 제한적인 요소가 될 수 있습니다.</p>
<p>이것이 바로 <strong>AISAQ가</strong> 해결하도록 설계된 격차입니다.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">AISAQ의 작동 방식과 중요한 이유<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ는 DISKANN의 핵심 아이디어를 직접적으로 기반으로 하지만 중요한 변화를 도입합니다. 바로 <strong>PQ 데이터를 DRAM에 보관할 필요가</strong> 없다는 점입니다. 압축된 벡터를 검색에 중요한 상시 메모리 구조로 취급하는 대신, AISAQ는 이를 SSD로 옮기고 그래프 데이터가 디스크에 배치되는 방식을 재설계하여 효율적인 탐색을 유지합니다.</p>
<p>이를 위해 노드 스토리지를 재구성하여 그래프 검색 시 필요한 데이터(전체 벡터, 이웃 목록, PQ 정보)가 액세스 위치에 최적화된 패턴으로 디스크에 배열되도록 합니다. 목표는 단순히 더 많은 데이터를 더 경제적인 디스크에 푸시하는 것이 아니라, <strong>앞서 설명한 검색 프로세스를 중단하지 않고도</strong> 그렇게 하는 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>다양한 워크로드에서 성능과 스토리지 효율성의 균형을 맞추기 위해 AISAQ는 두 가지 디스크 기반 스토리지 모드를 제공합니다. 이러한 모드는 주로 검색 중에 PQ 압축 데이터를 저장하고 액세스하는 방식에서 차이가 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ 성능: 속도 최적화</h3><p>AISAQ-성능은 데이터 코로케이션을 통해 낮은 I/O 오버헤드를 유지하면서 모든 데이터를 디스크에 보관합니다.</p>
<p>이 모드에서는</p>
<ul>
<li><p>각 노드의 전체 벡터, 에지 목록, 이웃 노드의 PQ 코드가 디스크에 함께 저장됩니다.</p></li>
<li><p>후보 확장 및 평가에 필요한 모든 데이터가 코로케이션되어 있기 때문에 노드를 방문하려면 여전히 단 한 번의 <strong>SSD 읽기만</strong> 필요합니다.</p></li>
</ul>
<p>검색 알고리즘의 관점에서 볼 때, 이는 디스크앤의 액세스 패턴과 매우 유사합니다. 후보 확장은 여전히 효율적이며, 모든 검색에 중요한 데이터가 이제 디스크에 저장되더라도 런타임 성능은 비슷합니다.</p>
<p>단점은 스토리지 오버헤드입니다. 이웃 노드의 PQ 데이터가 여러 노드의 디스크 페이지에 나타날 수 있기 때문에, 이 레이아웃은 중복성을 도입하고 전체 인덱스 크기를 크게 증가시킵니다.</p>
<p><strong>따라서 AISAQ-성능 모드는 디스크 효율성보다 낮은 I/O 레이턴시를 우선시합니다.</strong></p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ 규모: 스토리지 효율성에 최적화</h3><p>AISAQ-스케일은 정반대의 접근 방식을 취합니다. 이 모드는 모든 데이터를 SSD에 유지하면서 <strong>디스크 사용량을 최소화하도록</strong> 설계되었습니다.</p>
<p>이 모드에서는</p>
<ul>
<li><p>PQ 데이터는 중복 없이 디스크에 개별적으로 저장됩니다.</p></li>
<li><p>이렇게 하면 중복성이 제거되고 인덱스 크기가 크게 줄어듭니다.</p></li>
</ul>
<p>단, 한 노드와 그 이웃 노드의 PQ 코드에 액세스하려면 <strong>여러 번의 SSD 읽기가</strong> 필요할 수 있으며, 후보 확장 중에 I/O 작업이 증가할 수 있다는 단점이 있습니다. 최적화하지 않으면 검색 속도가 상당히 느려질 수 있습니다.</p>
<p>이 오버헤드를 제어하기 위해, AISAQ-스케일 모드에서는 두 가지 추가 최적화를 도입합니다:</p>
<ul>
<li><p>액세스 우선순위에 따라 PQ 벡터를 정렬하여 로컬리티를 개선하고 임의 읽기를 줄이는<strong>PQ 데이터 재배열</strong>.</p></li>
<li><p>자주 액세스하는 PQ 데이터를 저장하고 핫 엔트리에 대한 반복적인 디스크 읽기를 방지하는 <strong>DRAM의 PQ 캐시</strong> (<code translate="no">pq_cache_size</code>).</p></li>
</ul>
<p>이러한 최적화를 통해 AISAQ-스케일 모드는 실제 검색 성능을 유지하면서 AISAQ-성능보다 훨씬 뛰어난 스토리지 효율을 달성합니다. 이 성능은 DISKANN 또는 AISAQ-Performance보다 낮지만 메모리 사용량은 훨씬 더 작습니다.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">AISAQ의 주요 장점</h3><p>모든 검색에 중요한 데이터를 디스크로 옮기고 해당 데이터에 액세스하는 방식을 재설계함으로써 AISAQ는 그래프 기반 벡터 검색의 비용과 확장성 프로필을 근본적으로 변화시킵니다. 이 설계는 세 가지 중요한 이점을 제공합니다.</p>
<p><strong>1. 최대 3,200배 낮은 DRAM 사용량</strong></p>
<p>제품 양자화는 고차원 벡터의 크기를 크게 줄여주지만 10억 개 규모에서는 여전히 메모리 사용량이 상당합니다. 압축 후에도 기존 설계에서는 검색 중에 PQ 코드를 메모리에 유지해야 합니다.</p>
<p>예를 들어, 10억 개의 128차원 벡터가 있는 벤치마크인 <strong>SIFT1B에서는</strong> PQ 코드에만 구성에 따라 약 <strong>30-120GB의 DRAM이</strong> 필요합니다. 압축되지 않은 전체 벡터를 저장하려면 <strong> 약 480GB가</strong> 추가로 필요합니다. PQ는 메모리 사용량을 4~16배까지 줄여주지만, 남은 공간은 여전히 인프라 비용을 지배할 만큼 충분히 큽니다.</p>
<p>AISAQ는 이러한 요구 사항을 완전히 제거합니다. PQ 코드를 DRAM 대신 SSD에 저장하면 영구 인덱스 데이터로 인해 더 이상 메모리가 소모되지 않습니다. DRAM은 후보 목록 및 제어 메타데이터와 같이 가볍고 일시적인 구조에만 사용됩니다. 실제로 이렇게 하면 메모리 사용량이 수십 기가바이트에서 <strong>약 10MB로</strong> 줄어듭니다. 대표적인 10억 규모 구성에서 DRAM은 <strong>32GB에서 10MB로</strong> <strong>3,200배 감소합니다</strong>.</p>
<p>SSD 스토리지의 <strong>용량 단위당 가격이</strong> DRAM에 비해 약 <strong>1/30</strong> 수준이라는 점을 감안하면 이러한 변화는 총 시스템 비용에 직접적이고 극적인 영향을 미칩니다.</p>
<p><strong>2. 추가 I/O 오버헤드 없음</strong></p>
<p>PQ 코드를 메모리에서 디스크로 옮기면 일반적으로 검색 중 I/O 작업 횟수가 증가합니다. AISAQ는 <strong>데이터 레이아웃과 액세스 패턴을</strong> 신중하게 제어하여 이를 방지합니다. 관련 데이터를 디스크 전체에 흩어놓는 대신, AISAQ는 PQ 코드, 전체 벡터, 이웃 목록을 함께 배치하여 함께 검색할 수 있도록 합니다. 이렇게 하면 후보 확장이 추가적인 무작위 읽기를 유발하지 않습니다.</p>
<p>사용자가 인덱스 크기와 I/O 효율성 사이의 균형을 제어할 수 있도록, AISAQ는 각 노드에 인라인으로 저장되는 PQ 데이터의 양을 결정하는 <code translate="no">inline_pq</code> 파라미터를 도입했습니다:</p>
<ul>
<li><p><strong>낮은 inline_pq:</strong> 인덱스 크기가 작지만, 추가 I/O가 필요할 수 있습니다.</p></li>
<li><p><strong>inline_pq가 높을수록:</strong> 인덱스 크기는 커지지만 단일 읽기 액세스는 유지됩니다.</p></li>
</ul>
<p><strong>inline_pq = max_degree로</strong> 구성한 경우, AISAQ는 한 번의 디스크 작업으로 노드의 전체 벡터, 이웃 목록 및 모든 PQ 코드를 읽고, 모든 데이터를 SSD에 유지하면서 DISKANN의 I/O 패턴과 일치시킵니다.</p>
<p><strong>3. 순차적 PQ 액세스로 계산 효율성 향상</strong></p>
<p>DISKANN에서 후보 노드를 확장하려면 R 이웃 노드의 PQ 코드를 가져오기 위해 R 랜덤 메모리 액세스가 필요합니다. AISAQ는 단일 I/O에서 모든 PQ 코드를 검색하고 이를 디스크에 순차적으로 저장함으로써 이러한 무작위성을 제거합니다.</p>
<p>순차적 레이아웃은 두 가지 중요한 이점을 제공합니다:</p>
<ul>
<li><p><strong>순차적 SSD 읽기는</strong> 분산된 무작위 읽기보다<strong>훨씬 빠릅니다</strong>.</p></li>
<li><p><strong>인접한 데이터는 캐시 친화적이기</strong> 때문에 CPU가 PQ 거리를 더 효율적으로 계산할 수 있습니다.</p></li>
</ul>
<p>이는 PQ 거리 계산의 속도와 예측 가능성을 모두 개선하고 DRAM이 아닌 SSD에 PQ 코드를 저장하는 데 드는 성능 비용을 상쇄하는 데 도움이 됩니다.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ와 디스크앤 비교: 성능 평가<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ가 디스크앤과 아키텍처적으로 어떻게 다른지 이해했다면, 다음 질문은 <strong>이러한 설계 선택이 실제로 성능과 리소스 사용에 어떤 영향을 미치는지</strong> 알아보는 것입니다. 이 평가에서는 <strong>검색 성능, 메모리 사용량, 디스크 사용량</strong> 등 가장 중요한 세 가지 측면, 즉 10억 규모에서 가장 중요한 세 가지 측면에서 AISAQ와 DISKANN을 비교합니다.</p>
<p>특히, 인라인 PQ 데이터(<code translate="no">INLINE_PQ</code>)의 양이 변경될 때 AISAQ가 어떻게 작동하는지 살펴봅니다. 이 매개변수는 인덱스 크기, 디스크 I/O, 런타임 효율성 간의 절충점을 직접 제어합니다. 또한 <strong>차원이 거리 계산 비용과</strong> 스토리지 요구 사항에 <strong>큰 영향을 미치기 때문에 저차원 및 고차원 벡터 워크로드에</strong> 대해 두 가지 접근 방식을 모두 평가합니다.</p>
<h3 id="Setup" class="common-anchor-header">설정</h3><p>모든 실험은 인덱스 동작을 분리하고 네트워크 또는 분산 시스템 효과의 간섭을 피하기 위해 단일 노드 시스템에서 수행되었습니다.</p>
<p><strong>하드웨어 구성:</strong></p>
<ul>
<li><p>CPU: 인텔® 제온® 플래티넘 8375C CPU @ 2.90GHz</p></li>
<li><p>메모리: 속도: 3200 MT/s, 유형: DDR4, 크기: 32GB</p></li>
<li><p>디스크: 500GB NVMe SSD</p></li>
</ul>
<p><strong>인덱스 구축 매개변수</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>쿼리 매개변수</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">벤치마크 방법</h3><p>Milvus에서 사용되는 오픈 소스 벡터 검색 엔진인 <a href="https://milvus.io/docs/knowhere.md">Knowhere를</a> 사용하여 DISKANN과 AISAQ를 모두 테스트했습니다. 이 평가에는 두 가지 데이터 세트가 사용되었습니다:</p>
<ul>
<li><p><strong>SIFT128D(1M 벡터):</strong> 이미지 설명자 검색에 일반적으로 사용되는 잘 알려진 128차원 벤치마크입니다. <em>(원시 데이터 세트 크기 ≈ 488MB)</em></p></li>
<li><p><strong>Cohere768D(1M 벡터):</strong> 트랜스포머 기반 시맨틱 검색의 전형적인 768차원 임베딩 세트입니다. <em>(원시 데이터 세트 크기 ≈ 2930MB)</em></p></li>
</ul>
<p>이 데이터 세트는 두 가지 다른 실제 시나리오, 즉 소형 비전 특징과 대규모 시맨틱 임베딩을 반영합니다.</p>
<h3 id="Results" class="common-anchor-header">결과</h3><p><strong>Sift128D1M(전체 벡터 ~488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sift128_D1_M_706a5b4e23.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M(전체 벡터 ~2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">분석</h3><p><strong>SIFT128D 데이터 세트</strong></p>
<p>SIFT128D 데이터 세트에서, 모든 PQ 데이터가 인라인화되어 각 노드의 필수 데이터가 단일 4KB SSD 페이지에 완전히 들어맞을 때(INLINE_PQ = 48) AISAQ는 DISKANN의 성능과 일치할 수 있습니다. 이 구성에서는 검색 중에 필요한 모든 정보가 코로케이션됩니다:</p>
<ul>
<li><p>전체 벡터: 512B</p></li>
<li><p>이웃 목록: 48 × 4 + 4 = 196B</p></li>
<li><p>이웃의 PQ 코드: 48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>총: 3780B</p></li>
</ul>
<p>전체 노드가 한 페이지 안에 들어가기 때문에 액세스당 하나의 I/O만 필요하며, AISAQ는 외부 PQ 데이터의 무작위 읽기를 방지합니다.</p>
<p>그러나 PQ 데이터의 일부만 인라인된 경우 나머지 PQ 코드는 디스크의 다른 곳에서 가져와야 합니다. 이로 인해 추가적인 랜덤 I/O 작업이 발생하여 IOPS 수요가 급격히 증가하고 성능이 크게 저하됩니다.</p>
<p><strong>Cohere768D 데이터 세트</strong></p>
<p>Cohere768D 데이터 세트에서 AISAQ는 DISKANN보다 성능이 더 나쁩니다. 그 이유는 768차원 벡터가 단순히 4KB SSD 페이지 하나에 들어가지 않기 때문입니다:</p>
<ul>
<li><p>전체 벡터: 3072B</p></li>
<li><p>이웃 목록: 48 × 4 + 4 = 196B</p></li>
<li><p>이웃의 PQ 코드: 48 × (3072B × 0.125) ≈ 18432B</p></li>
<li><p>총: 21,700B(≈ 6페이지)</p></li>
</ul>
<p>이 경우 모든 PQ 코드가 인라인으로 되어 있어도 각 노드는 여러 페이지에 걸쳐 있습니다. 입출력 작업의 수는 일정하게 유지되지만 각 입출력은 훨씬 더 많은 데이터를 전송해야 하므로 SSD 대역폭을 훨씬 더 빠르게 소모합니다. 대역폭이 제한 요소가 되면, 특히 노드당 데이터 풋프린트가 빠르게 증가하는 고차원 워크로드에서는 AISAQ가 DISKANN을 따라잡을 수 없습니다.</p>
<p><strong>참고:</strong></p>
<p>AISAQ의 스토리지 레이아웃은 일반적으로 온디스크 인덱스 크기를 <strong>4배에서 6배까지</strong> 증가시킵니다. 이는 검색 중 효율적인 단일 페이지 액세스를 위해 전체 벡터, 이웃 목록, PQ 코드가 디스크에 배치되는 의도적인 절충안입니다. 이렇게 하면 SSD 사용량이 증가하지만, 디스크 용량은 DRAM보다 훨씬 저렴하고 대용량 데이터에서 더 쉽게 확장할 수 있습니다.</p>
<p>실제로 사용자는 <code translate="no">INLINE_PQ</code> 및 PQ 압축 비율을 조정하여 이 절충점을 조정할 수 있습니다. 이러한 매개변수를 사용하면 고정된 메모리 제한의 제약을 받지 않고 워크로드 요구 사항에 따라 검색 성능, 디스크 공간, 전체 시스템 비용의 균형을 맞출 수 있습니다.</p>
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
    </button></h2><p>최신 하드웨어의 경제성은 변화하고 있습니다. DRAM 가격은 여전히 높은 수준을 유지하고 있는 반면, SSD 성능은 빠르게 발전하여 이제 PCIe 5.0 드라이브는 <strong>14GB/s</strong> 이상의 대역폭을 제공합니다. 그 결과, 검색에 중요한 데이터를 값비싼 DRAM에서 훨씬 더 저렴한 SSD 스토리지로 옮기는 아키텍처가 점점 더 매력적으로 다가오고 있습니다. SSD 용량은 <strong>기가바이트당</strong> 비용이 DRAM의 <strong>30배도 되지</strong> 않기 때문에 이러한 차이는 더 이상 미미한 수준이 아니며, 시스템 설계에 의미 있는 영향을 미칩니다.</p>
<p>AISAQ는 이러한 변화를 반영합니다. 대용량 상시 메모리 할당의 필요성을 제거함으로써 벡터 검색 시스템은 DRAM 제한이 아닌 데이터 크기와 워크로드 요구사항에 따라 확장할 수 있습니다. 이러한 접근 방식은 빠른 SSD가 지속성뿐만 아니라 활성 연산 및 검색에서 중심적인 역할을 하는 <strong>'올인 스토리지' 아키텍처에</strong> 대한 광범위한 추세와도 일치합니다.</p>
<p>이러한 변화는 벡터 데이터베이스에만 국한되지 않을 것입니다. 개발자들이 적절한 성능을 달성하기 위해 데이터가 어디에 있어야 하는지에 대한 오랜 가정을 재고하면서 그래프 처리, 시계열 분석, 심지어 기존 관계형 시스템의 일부에서도 유사한 설계 패턴이 이미 나타나고 있습니다. 하드웨어 경제학이 계속 발전함에 따라 시스템 아키텍처도 그 뒤를 따를 것입니다.</p>
<p>여기서 설명하는 설계에 대한 자세한 내용은 설명서를 참조하세요:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus 문서</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">디스크앤 | Milvus 문서</a></p></li>
</ul>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수 있습니다.</p>
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
