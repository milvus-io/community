---
id: diskann-explained.md
title: DiskANN 설명
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  DiskANN이 SSD를 사용하여 낮은 메모리 사용량, 높은 정확도, 확장 가능한 성능의 균형을 유지하면서 어떻게 수십억 개 규모의 벡터
  검색을 제공하는지 알아보세요.
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">DiskANN이란?<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN은</a> <a href="https://zilliz.com/learn/vector-similarity-search">벡터 유사도 검색에</a> 대한 패러다임 전환 접근 방식을 나타냅니다. 그 전에는 HNSW와 같은 대부분의 벡터 인덱스 유형이 낮은 지연 시간과 높은 리콜을 달성하기 위해 RAM에 크게 의존했습니다. 이 접근 방식은 적당한 크기의 데이터 세트에는 효과적이지만, 데이터 볼륨이 커지면 비용이 엄청나게 비싸고 확장성이 떨어집니다. DiskANN은 SSD를 활용하여 인덱스를 저장함으로써 메모리 요구 사항을 크게 줄임으로써 비용 효율적인 대안을 제공합니다.</p>
<p>DiskANN은 디스크 액세스에 최적화된 플랫 그래프 구조를 사용하므로 인메모리 방식에 필요한 메모리 공간의 일부만으로 수십억 개 규모의 데이터 세트를 처리할 수 있습니다. 예를 들어, DiskANN은 최대 10억 개의 벡터를 색인하면서 5ms의 지연 시간으로 95%의 검색 정확도를 달성할 수 있는 반면, RAM 기반 알고리즘은 비슷한 성능으로 1억~2억 포인트에서 정점을 찍습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 1: DiskANN을 사용한 벡터 인덱싱 및 검색 워크플로</em></p>
<p>DiskANN은 RAM 기반 접근 방식에 비해 지연 시간이 약간 더 길 수 있지만, 상당한 비용 절감과 확장성 이점을 고려하면 이 정도는 감수할 수 있는 수준입니다. DiskANN은 특히 상용 하드웨어에서 대규모 벡터 검색이 필요한 애플리케이션에 적합합니다.</p>
<p>이 글에서는 DiskANN이 RAM과 더불어 SSD를 활용하고 비용이 많이 드는 SSD 읽기를 줄이는 현명한 방법을 설명합니다.</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">DiskANN은 어떻게 작동하나요?<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN은 HNSW와 동일한 방법 계열에 속하는 그래프 기반 벡터 검색 방법입니다. 먼저 노드가 벡터(또는 벡터 그룹)에 해당하는 검색 그래프를 구성하고, 에지는 한 쌍의 벡터가 어떤 의미에서 "상대적으로 가깝다"는 것을 나타냅니다. 일반적인 검색은 '엔트리 노드'를 무작위로 선택하고 쿼리에 가장 가까운 이웃 노드로 이동하여 로컬 최소값에 도달할 때까지 탐욕스러운 방식으로 반복합니다.</p>
<p>그래프 기반 인덱싱 프레임워크는 주로 검색 그래프를 구성하고 검색을 수행하는 방식에서 차이가 있습니다. 이 섹션에서는 이러한 단계를 위한 DiskANN의 혁신과 이를 통해 어떻게 짧은 지연 시간, 낮은 메모리 성능을 구현할 수 있는지에 대해 기술적으로 자세히 살펴보겠습니다. (요약은 위 그림을 참조하세요.)</p>
<h3 id="An-Overview" class="common-anchor-header">개요</h3><p>사용자가 일련의 문서 벡터 임베딩을 생성했다고 가정합니다. 첫 번째 단계는 임베딩을 클러스터링하는 것입니다. 각 클러스터에 대한 검색 그래프는 다음 섹션에서 설명하는 바마나 알고리즘을 사용해 개별적으로 구성되며, 그 결과는 하나의 그래프로 병합됩니다. <em>최종 검색 그래프를 생성하기 위한 분할 및 정복 전략은 검색 지연 시간이나 리콜에 큰 영향을 주지 않으면서 메모리 사용량을 크게 줄입니다.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 2: DiskANN이 RAM과 SSD에 벡터 인덱스를 저장하는 방법</em></p>
<p>글로벌 검색 그래프가 생성되면 고정밀 벡터 임베딩과 함께 SSD에 저장됩니다. SSD 액세스는 RAM 액세스에 비해 비용이 많이 들기 때문에 제한된 SSD 읽기 횟수 내에서 검색을 완료하는 것이 가장 큰 과제입니다. 따라서 읽기 횟수를 제한하기 위해 몇 가지 영리한 트릭이 사용됩니다:</p>
<p>첫째, Vamana 알고리즘은 노드의 최대 이웃 수를 제한하면서 가까운 노드 간의 경로를 더 짧게 만들도록 인센티브를 제공합니다. 둘째, 고정 크기 데이터 구조를 사용해 각 노드의 임베딩과 그 이웃을 저장합니다(위 그림 참조). 즉, 데이터 구조의 크기에 노드의 인덱스를 곱하고 이를 오프셋으로 사용하는 동시에 노드의 임베딩을 가져오는 방식으로 노드의 메타데이터를 처리할 수 있다는 뜻입니다. 셋째, SSD의 작동 방식으로 인해 읽기 요청당 여러 노드(이 경우에는 이웃 노드)를 가져올 수 있으므로 읽기 요청 횟수를 더욱 줄일 수 있습니다.</p>
<p>이와 별도로, 제품 양자화를 사용하여 임베딩을 압축하고 RAM에 저장합니다. 이렇게 하면 디스크 읽기 없이 <em>대략적인 벡터 유사도를</em> 빠르게 계산하기 위해 수십억 개의 벡터 데이터 세트를 단일 컴퓨터에서 실행 가능한 메모리에 넣을 수 있습니다. 이는 SSD에서 다음에 액세스할 이웃 노드의 수를 줄이기 위한 지침을 제공합니다. 그러나 중요한 것은 검색 결정이 <em>정확한 벡터 유사도를</em> 사용해 이루어지며, SSD에서 전체 임베딩을 검색하므로 더 높은 리콜을 보장한다는 점입니다. 강조하자면, 메모리에서 양자화된 임베딩을 사용하는 초기 검색 단계와 SSD에서 읽는 더 작은 하위 집합에 대한 후속 검색 단계가 있습니다.</p>
<p>이 설명에서는 그래프를 구성하는 방법과 그래프를 검색하는 방법, 즉 위의 빨간색 상자로 표시된 두 가지 중요한 단계에 대해 간략하게 설명했습니다. 이제 각 단계를 차례로 살펴보겠습니다.</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">"바마나" 그래프 구성</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: "Vamana" 그래프 구성</em></p>
<p>DiskANN의 저자들은 검색 그래프를 구성하는 새로운 방법을 개발했으며, 이를 Vamana 알고리즘이라고 부릅니다. 이 알고리즘은 O(N)개의 에지를 무작위로 추가하여 검색 그래프를 초기화합니다. 이렇게 하면 욕심 많은 검색 수렴에 대한 보장은 없지만 "잘 연결된" 그래프가 생성됩니다. 그런 다음 충분한 장거리 연결을 보장하기 위해 지능적인 방식으로 에지를 잘라내고 다시 연결합니다(위 그림 참조). 자세히 설명하겠습니다:</p>
<h4 id="Initialization" class="common-anchor-header">초기화</h4><p>검색 그래프는 각 노드에 R개의 아웃이웃이 있는 무작위 방향 그래프로 초기화됩니다. 또한 그래프의 중간값, 즉 다른 모든 점과의 평균 거리가 최소인 점을 계산합니다. 이를 노드 집합의 구성원인 중심과 유사하게 생각할 수 있습니다.</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">후보 검색</h4><p>초기화 후에는 노드를 반복하여 각 단계에서 에지를 추가하고 제거하는 작업을 수행합니다. 먼저 선택한 노드 p에서 검색 알고리즘을 실행하여 후보 목록을 생성합니다. 검색 알고리즘은 메도이드에서 시작하여 선택한 노드에 점점 더 가깝게 탐색하면서 각 단계에서 지금까지 발견된 가장 가까운 노드의 아웃이웃을 추가합니다. p에 가장 가까운 노드를 찾은 L의 목록이 반환됩니다. (개념이 익숙하지 않은 경우 그래프의 정중앙은 다른 모든 점과의 평균 거리가 최소인 점으로, 그래프에서 구심점과 비슷한 역할을 합니다.)</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">가지치기 및 에지 추가하기</h4><p>노드의 후보 이웃은 거리별로 정렬되며, 알고리즘은 각 후보에 대해 이미 선택된 이웃과 방향이 "너무 가까운"지 여부를 확인합니다. 만약 그렇다면 가지치기를 합니다. 이렇게 하면 이웃 간의 각도 다양성이 촉진되어 경험적으로 더 나은 탐색 속성으로 이어집니다. 실제로 이는 임의의 노드에서 시작하는 검색이 희박한 장거리 및 로컬 링크 집합을 탐색하여 목표 노드에 더 빨리 도달할 수 있음을 의미합니다.</p>
<p>에지를 가지치기한 후에는 p에 대한 탐욕스러운 검색 경로를 따라 에지가 추가됩니다. 두 번의 가지 치기를 수행하여 가지 치기를 위한 거리 임계값을 변경하여 두 번째 가지 치기에서 장거리 에지가 추가되도록 합니다.</p>
<h2 id="What’s-Next" class="common-anchor-header">다음 단계는 무엇인가요?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>추가적인 개선을 위해 DiskANN을 기반으로 후속 작업이 진행 중입니다. 주목할 만한 한 가지 예로, 구축 후 인덱스를 쉽게 업데이트할 수 있도록 방법을 수정한 <a href="https://arxiv.org/abs/2105.09613">FreshDiskANN이</a> 있습니다. 이 검색 인덱스는 성능 기준 간에 탁월한 절충점을 제공하며, <a href="https://milvus.io/docs/overview.md">Milvus</a> 벡터 데이터베이스에서 <code translate="no">DISKANN</code> 인덱스 유형으로 사용할 수 있습니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>자세한 내용은 <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">문서 페이지를</a> 참조하세요. <code translate="no">MaxDegree</code> 및 <code translate="no">BeamWidthRatio</code> 과 같은 DiskANN 매개변수를 조정할 수도 있습니다.</p>
<h2 id="Resources" class="common-anchor-header">리소스<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">DiskANN 사용에 대한 Milvus 문서</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN: 단일 노드에서 빠르고 정확한 10억 포인트 최인접 이웃 검색"</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN: 스트리밍 유사도 검색을 위한 빠르고 정확한 그래프 기반 ANN 인덱스"</a></p></li>
</ul>
