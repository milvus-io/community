---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: '논문 읽기｜HM-ANN, ANNS가 이기종 메모리를 만났을 때'
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: 이기종 메모리에서 효율적인 10억 개 포인트 최인접 이웃 검색을 위한 HM-ANN
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>논문 읽기 ｜ HM-ANN: ANNS가 이기종 메모리를 만났을 때</custom-h1><p>2020년 신경 정보 처리 시스템 학회<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020)</a>에서 채택된 연구 논문 '<a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: 이기종 메모리에서 효율적인 10억 개 포인트 최인접 이웃 검색</a> '입니다. 이 논문에서는 그래프 기반 유사도 검색을 위한 새로운 알고리즘인 HM-ANN을 제안합니다. 이 알고리즘은 최신 하드웨어 환경에서 메모리 이질성과 데이터 이질성을 모두 고려합니다. HM-ANN을 사용하면 압축 기술 없이도 단일 컴퓨터에서 수십억 개의 유사도 검색을 수행할 수 있습니다. 이기종 메모리(HM)는 빠르지만 작은 동적 랜덤 액세스 메모리(DRAM)와 느리지만 큰 퍼시스턴트 메모리(PMem)의 조합을 나타냅니다. HM-ANN은 특히 데이터 세트가 DRAM에 맞지 않을 때 낮은 검색 지연 시간과 높은 검색 정확도를 달성합니다. 이 알고리즘은 최첨단 근사 근사 이웃(ANN) 검색 솔루션에 비해 뚜렷한 이점이 있습니다.</p>
<custom-h1>동기 부여</custom-h1><p>ANN 검색 알고리즘은 처음부터 제한된 DRAM 용량으로 인해 쿼리 정확도와 쿼리 지연 시간 사이에 근본적인 트레이드오프가 존재했습니다. 빠른 쿼리 액세스를 위해 DRAM에 인덱스를 저장하려면 데이터 포인트 수를 제한하거나 압축된 벡터를 저장해야 하는데, 이 두 가지 모두 검색 정확도를 떨어뜨립니다. 그래프 기반 인덱스(예: 계층적 탐색 가능한 작은 세계, HNSW)는 쿼리 런타임 성능과 쿼리 정확도가 우수합니다. 그러나 이러한 인덱스는 수십억 규모의 데이터 세트에서 작동할 때 1-TiB 수준의 DRAM을 소비할 수도 있습니다.</p>
<p>DRAM이 10억 규모의 데이터세트를 원시 형식으로 저장하지 않도록 하는 다른 해결 방법도 있습니다. 데이터 세트가 너무 커서 단일 머신의 메모리에 들어갈 수 없는 경우, 데이터 세트의 포인트를 제품 양자화하는 것과 같은 압축된 접근 방식이 사용됩니다. 그러나 압축된 데이터 세트의 인덱스는 양자화 과정에서 정밀도가 손실되기 때문에 일반적으로 정확도가 낮습니다. 수브라마냐 등[1]은 원시 데이터 세트는 SSD에 저장하고 압축된 표현은 DRAM에 저장하는 Disk-ANN이라는 접근 방식으로 단일 머신을 사용해 수십억 규모의 ANN 검색을 달성하기 위해 SSD를 활용하는 방법을 모색합니다.</p>
<custom-h1>이기종 메모리 소개</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>이기종 메모리(HM)는 빠르지만 작은 DRAM과 느리지만 큰 PMem의 조합을 나타냅니다. DRAM은 모든 최신 서버에서 볼 수 있는 일반적인 하드웨어로, 비교적 빠르게 액세스할 수 있습니다. 인텔® 옵테인™ DC 퍼시스턴트 메모리 모듈과 같은 새로운 PMem 기술은 NAND 기반 플래시(SSD)와 DRAM 간의 격차를 해소하여 I/O 병목 현상을 제거합니다. PMem은 SSD처럼 내구성이 뛰어나며 메모리처럼 CPU에서 직접 주소를 지정할 수 있습니다. Renen 등[2]은 구성된 실험 환경에서 PMem의 읽기 대역폭이 DRAM보다 2.6배, 쓰기 대역폭은 7.5배 더 낮다는 사실을 발견했습니다.</p>
<custom-h1>HM-ANN 설계</custom-h1><p>HM-ANN은 압축 없이 단일 머신에서 실행되는 정확하고 빠른 10억 개 규모의 ANN 검색 알고리즘입니다. HM-ANN의 설계는 계층 구조가 HM에 자연스럽게 들어맞는 HNSW의 아이디어를 일반화합니다. HNSW는 여러 개의 레이어로 구성되며, 레이어 0에만 전체 데이터 세트가 포함되고 나머지 각 레이어는 바로 아래에 있는 레이어의 요소 하위 집합을 포함합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>데이터 세트의 하위 집합만 포함하는 상위 레이어의 요소는 전체 스토리지의 작은 부분을 소비합니다. 이러한 점 때문에 DRAM에 배치하기에 적합한 후보입니다. 이러한 방식으로 HM-ANN의 검색 대부분은 상위 레이어에서 이루어질 것으로 예상되며, 이는 DRAM의 빠른 액세스 특성을 최대한 활용할 수 있습니다. 그러나 HNSW의 경우 대부분의 검색은 최하위 레이어에서 발생합니다.</li>
<li>최하위 레이어는 전체 데이터세트를 담고 있기 때문에 PMem에 배치하기에 적합합니다. 0 레이어에 액세스하는 속도가 느리기 때문에 각 쿼리에서 액세스하는 부분만 작게 하고 액세스 빈도를 줄이는 것이 바람직합니다.</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">그래프 구성 알고리즘<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>HM-ANN 구성의 핵심 아이디어는 계층 0에서 더 나은 탐색을 제공하기 위해 고품질 상위 계층을 생성하는 것입니다. 따라서 대부분의 메모리 액세스는 DRAM에서 발생하고 PMem에서의 액세스는 감소합니다. 이를 가능하게 하기 위해 HM-ANN의 구성 알고리즘에는 하향식 삽입 단계와 상향식 승격 단계가 있습니다.</p>
<p>하향식 삽입 단계에서는 최하위 계층이 PMem에 배치되면서 탐색 가능한 스몰월드 그래프를 구축합니다.</p>
<p>상향식 승격 단계는 하단 레이어에서 피벗 포인트를 승격하여 정확도를 크게 잃지 않고 DRAM에 배치되는 상위 레이어를 형성합니다. 레이어 0의 요소에 대한 고품질 투영이 레이어 1에 생성되면 레이어 0의 검색은 몇 번의 홉만으로 쿼리의 정확한 가장 가까운 이웃을 찾습니다.</p>
<ul>
<li>승격에 HNSW의 무작위 선택을 사용하는 대신, HM-ANN은 높은 수준의 승격 전략을 사용하여 0계층에서 가장 높은 수준의 요소를 1계층으로 승격합니다. 상위 레이어의 경우, HM-ANN은 승격률에 따라 상위 레이어로 높은 수준의 노드를 승격합니다.</li>
<li>HM-ANN은 계층 0에서 계층 1로 더 많은 노드를 승격하고 계층 1의 각 요소에 대해 최대 이웃 수를 더 많이 설정합니다. 상위 계층의 노드 수는 사용 가능한 DRAM 공간에 따라 결정됩니다. 레이어 0은 DRAM에 저장되지 않으므로 각 레이어를 더 조밀하게 저장하면 검색 품질이 향상됩니다.</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">그래프 시치 알고리즘<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>검색 알고리즘은 빠른 메모리 검색과 프리페칭을 사용한 병렬 레이어 0 검색의 두 단계로 구성됩니다.</p>
<h3 id="Fast-memory-search" class="common-anchor-header">빠른 메모리 검색</h3><p>HNSW와 마찬가지로 DRAM에서의 검색은 최상위 계층의 진입점에서 시작하여 최상위에서 2계층까지 1-욕심 검색을 수행합니다. 계층 0에서 검색 공간을 좁히기 위해 HM-ANN은 계층 1에서 후보 목록의 크기를 제한하는 <code translate="no">efSearchL1</code> 으로 검색 예산을 사용하여 계층 1에서 검색을 수행합니다. 이러한 후보 목록은 레이어 0에서 검색을 위한 여러 진입점으로 사용되어 레이어 0의 검색 품질을 향상시킵니다. HNSW는 하나의 진입점만 사용하지만, HM-ANN에서는 레이어 0과 레이어 1 사이의 간격이 다른 두 레이어 사이의 간격보다 더 특별하게 처리됩니다.</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">프리페칭을 통한 병렬 레이어 0 검색</h3><p>최하위 레이어에서 HM-ANN은 앞서 언급한 후보들을 레이어 1 검색에서 균등하게 분할하고 이를 진입점으로 간주하여 스레드를 사용한 병렬 다중 시작 1-욕심 검색을 수행합니다. 각 검색의 상위 후보를 수집하여 최적의 후보를 찾습니다. 알려진 대로 레이어 1에서 레이어 0으로 내려가는 것은 정확히 PMem으로 이동하는 것입니다. 병렬 검색은 PMem의 지연 시간을 숨기고 메모리 대역폭을 최대한 활용하여 검색 시간을 늘리지 않고 검색 품질을 향상시킵니다.</p>
<p>HM-ANN은 DRAM에 소프트웨어 관리 버퍼를 구현하여 메모리 액세스가 발생하기 전에 PMem에서 데이터를 프리페치합니다. 계층 1을 검색할 때, HM-ANN은 <code translate="no">efSearchL1</code> 에 있는 후보의 이웃 요소와 계층 1의 이웃 요소의 연결을 PMem에서 버퍼로 비동기적으로 복사합니다. 0계층에서 검색이 수행될 때 액세스해야 할 데이터의 일부가 이미 DRAM에 프리페치되어 있으므로 PMem에 액세스하는 대기 시간이 숨겨지고 쿼리 시간이 단축됩니다. 이는 대부분의 메모리 액세스가 DRAM에서 발생하고 PMem의 메모리 액세스가 줄어드는 HM-ANN의 설계 목표와 일치합니다.</p>
<custom-h1>평가</custom-h1><p>이 백서에서는 광범위한 평가를 수행합니다. 모든 실험은 인텔 제온 골드 6252(CPU@2.3GHz)가 탑재된 컴퓨터에서 수행되었습니다. 빠른 메모리로는 DDR4(96GB)를, 느린 메모리로는 Optane DC PMM(1.5TB)을 사용합니다. 5개의 데이터 세트가 평가됩니다: BIGANN, DEEP1B, SIFT1M, DEEP1M 및 GIST1M. 10억 규모 테스트의 경우, 10억 규모 양자화 기반 방식(IMI+OPQ 및 L&amp;C), 비압축 기반 방식(HNSW 및 NSG)이 포함됩니다.</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">10억 규모 알고리즘 비교<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>표 1에서는 다양한 그래프 기반 인덱스의 빌드 시간과 저장 공간을 비교한 것입니다. HNSW가 가장 짧은 빌드 시간이 걸리며, HM-ANN은 HNSW보다 8% 더 많은 시간이 필요합니다. 전체 스토리지 사용량 측면에서 보면, HM-ANN 인덱스는 계층 0에서 계층 1로 더 많은 노드를 승격하기 때문에 HSNW보다 5~13% 더 큽니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>그림 1에서는 다양한 인덱스의 쿼리 성능을 분석합니다. 그림 1 (a)와 (b)는 HM-ANN이 1ms 이내에 95% 이상의 상위 1순위 리콜을 달성하는 것을 보여줍니다. 그림 1 ©과 (d)는 HM-ANN이 4ms 이내에 90% 이상의 상위 100위 리콜을 달성하는 것을 보여줍니다. HM-ANN은 다른 모든 접근 방식보다 지연 시간 대비 리콜 성능이 가장 우수합니다.</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">백만 개 규모 알고리즘 비교<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>그림 2에서는 순수 DRAM 설정에서 다양한 인덱스의 쿼리 성능을 분석했습니다. 3백만 규모의 데이터 세트가 DRAM에 장착된 상태에서 HNSW, NSG, HM-ANN을 평가했습니다. HM-ANN이 여전히 HNSW보다 더 나은 쿼리 성능을 달성합니다. 그 이유는 99%의 리콜 목표를 달성하기 위해 HM-ANN의 총 거리 계산 횟수(평균 850/쿼리)가 HNSW(평균 900/쿼리)보다 낮기 때문입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">고도의 프로모션의 효과<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>그림 3은 동일한 구성에서 무작위 프로모션과 고도의 프로모션 전략을 비교한 것입니다. 고도 프로모션이 기준치를 능가하는 성과를 보였습니다. 고도 프로모션은 무작위 프로모션보다 각각 1.8배, 4.3배, 3.9배 빠른 속도로 95%, 99%, 99.5%의 리콜 목표에 도달했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">메모리 관리 기법의 성능 이점<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>그림 5는 HM-ANN의 각 최적화가 성능 향상에 어떻게 기여하는지 보여주기 위해 HNSW와 HM-ANN 사이의 일련의 단계를 담고 있습니다. BP는 인덱스를 구축하는 동안 상향식 프로모션을 의미합니다. PL0은 병렬 레이어 0 검색을, DP는 PMem에서 DRAM으로의 데이터 프리페칭을 나타냅니다. 단계적으로 HM-ANN의 검색 성능은 더욱 향상됩니다.</p>
<custom-h1>결론</custom-h1><p>새로운 그래프 기반 인덱싱 및 검색 알고리즘인 HM-ANN은 그래프 기반 ANN의 계층적 설계를 HM의 메모리 이질성과 매핑합니다. 평가 결과, HM-ANN은 10억 개 포인트 데이터 세트에서 새로운 최첨단 인덱스에 속하는 것으로 나타났습니다.</p>
<p>학계는 물론 업계에서도 영구 저장 장치에 인덱스를 구축하는 데 집중하는 추세를 발견할 수 있습니다. DRAM의 부담을 덜어주기 위해 Disk-ANN[1]은 처리량이 PMem보다 현저히 낮은 SSD에 구축된 인덱스입니다. 하지만 HM-ANN의 구축에는 아직 며칠이 걸리며, Disk-ANN과 비교해 큰 차이가 없는 것으로 확인되고 있습니다. PMem의 세분성(256바이트)을 인지하고 스트리밍 명령어를 사용해 캐셸라인을 우회하는 등 PMem의 특성을 보다 세심하게 활용하면 HM-ANN의 빌드 시간을 최적화할 수 있을 것으로 생각합니다. 또한 향후에는 내구성 있는 저장 장치를 사용하는 접근 방식이 더 많이 제안될 것으로 예상됩니다.</p>
<custom-h1>참고 자료</custom-h1><p>[1]: 수하스 자야람 수브라마냐, 데브브릿, 로한 카데코디, 라비샨카르 크리샤스와미, 라비샨카르 크리샤스와미: DiskANN: 단일 노드에서 빠르고 정확한 10억 개 지점 최인접 이웃 검색, NIPS, 2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN: 단일 노드에서 빠르고 정확한 10억 개 지점 최인접 이웃 검색 - Microsoft Research</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN: 단일 노드에서 빠르고 정확한 10억 개 최인접 이웃 검색 - Microsoft Research</a></p>
<p>[2]: 알렉산더 반 레넨, 루카스 보겔, 빅토르 레이즈, 토마스 노이만, 알폰스 켐퍼: 퍼시스턴트 메모리 I/O 프리미티브, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">퍼시스턴트 메모리 I/O 프리미티브</a></p>
