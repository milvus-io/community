---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: 벡터 검색을 위한 계층적 탐색 가능한 작은 세계(HNSW) 이해하기
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: 계층적 탐색 가능한 작은 세계(HNSW)는 계층화된 그래프 구조를 사용하여 근사 최인접 이웃을 검색하는 효율적인 알고리즘입니다.
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p><a href="https://milvus.io/blog/what-is-a-vector-database.md">벡터 데이터베이스의</a> 핵심 연산은 <em>유사도 검색으로</em>, 예를 들어 유클리드 거리를 사용하여 데이터베이스에서 쿼리 벡터와 가장 가까운 이웃을 찾는 것입니다. 순진한 방법으로는 쿼리 벡터에서 데이터베이스에 저장된 모든 벡터까지의 거리를 계산하여 가장 가까운 상위 K를 취합니다. 그러나 이 방법은 데이터베이스의 크기가 커짐에 따라 확장되지 않습니다. 실제로 순진한 유사도 검색은 벡터가 약 100만 개 미만인 데이터베이스에서만 실용적입니다. 그렇다면 검색을 수천만, 수억 개, 심지어 수십억 개의 벡터로 확장하려면 어떻게 해야 할까요?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 벡터 검색 인덱스의 계층 구조 내리기</em></p>
<p>고차원 벡터 공간에서의 유사도 검색을 서브-선형 시간 복잡성으로 확장하기 위해 많은 알고리즘과 데이터 구조가 개발되었습니다. 이 글에서는 중간 크기의 벡터 데이터 세트에 대해 기본으로 자주 선택되는 계층적 탐색 가능한 작은 세계(HNSW)라는 인기 있고 효과적인 방법을 설명하고 구현해 보겠습니다. 이 방법은 벡터 위에 그래프를 구성하는 검색 방법의 계열에 속하며, 정점은 벡터를 나타내고 가장자리는 벡터 간의 유사성을 나타냅니다. 검색은 그래프를 탐색하는 방식으로 수행되며, 가장 간단한 경우에는 쿼리에 가장 가까운 현재 노드의 이웃 노드로 탐욕스럽게 이동하여 로컬 최소값에 도달할 때까지 반복합니다.</p>
<p>검색 그래프가 어떻게 구성되는지, 그래프가 어떻게 검색을 가능하게 하는지, 그리고 마지막에는 간단한 Python으로 직접 만든 HNSW 구현에 대한 링크를 자세히 설명해 드리겠습니다.</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">탐색 가능한 작은 세계<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 무작위로 위치한 100개의 2D 점으로 만든 NSW 그래프.</em></p>
<p>앞서 언급했듯이 HNSW는 쿼리를 수행하기 전에 오프라인으로 검색 그래프를 구축합니다. 이 알고리즘은 탐색 가능한 작은 세계(NSW)라는 이전 작업을 기반으로 구축됩니다. 먼저 NSW에 대해 설명한 다음 <em>계층적</em> NSW로 넘어가는 것은 간단합니다. 위의 그림은 2차원 벡터에 대한 NSW 검색 그래프를 구성한 것입니다. 아래의 모든 예제에서는 시각화할 수 있도록 2차원 벡터로 제한합니다.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">그래프 구성하기<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>NSW는 정점은 벡터를 나타내고 가장자리는 벡터 간의 유사성을 통해 휴리스틱하게 구성되는 그래프로, 대부분의 벡터는 적은 수의 홉을 통해 어디에서나 도달할 수 있습니다. 이는 빠른 탐색을 가능하게 하는 소위 "작은 세계" 속성이라고 할 수 있습니다. 위 그림을 참조하세요.</p>
<p>그래프는 비어 있는 상태로 초기화됩니다. 벡터를 반복하여 각 벡터를 차례로 그래프에 추가합니다. 각 벡터에 대해 임의의 시작 노드에서 시작하여 <em>지금까지 구성된 그래프에서</em> 시작점에서 도달 가능한 가장 가까운 R 노드를 욕심내어 찾습니다. 그런 다음 이러한 R 노드를 삽입되는 벡터를 나타내는 새 노드에 연결하고, 선택적으로 R 이상의 이웃을 가진 이웃 노드를 모두 잘라냅니다. 모든 벡터에 대해 이 과정을 반복하면 NSW 그래프가 생성됩니다. 알고리즘을 시각화한 위의 그림을 참조하고, 이렇게 구성된 그래프의 속성에 대한 이론적 분석은 글 끝에 있는 리소스를 참조하세요.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">그래프 검색하기<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>우리는 이미 그래프 구성에 사용되는 검색 알고리즘을 살펴봤습니다. 그러나 이 경우 쿼리 노드는 그래프에 삽입하기 위한 노드가 아니라 사용자가 제공하는 노드입니다. 임의의 항목 노트에서 시작하여 지금까지 발견된 가장 가까운 벡터의 동적 집합을 유지하면서 쿼리에 가장 가까운 이웃 노드로 탐욕스럽게 이동합니다. 위의 그림을 참조하세요. 여러 임의의 진입점에서 검색을 시작하고 각 단계에서 여러 이웃을 고려하는 동시에 결과를 집계함으로써 검색 정확도를 향상시킬 수 있다는 점에 유의하세요. 그러나 이러한 개선 사항에는 지연 시간이 증가하는 대가가 따릅니다.</p>
<custom-h1>계층 구조 추가</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>지금까지 고차원 공간에서 검색을 확장하는 데 도움이 되는 NSW 알고리즘과 데이터 구조에 대해 설명했습니다. 그럼에도 불구하고 이 방법은 저차원에서의 실패, 느린 검색 수렴, 로컬 최소값에 갇히는 경향 등 심각한 단점을 가지고 있습니다.</p>
<p>HNSW의 저자는 NSW에 세 가지 수정 사항을 적용하여 이러한 단점을 해결했습니다:</p>
<ul>
<li><p>구성 및 검색 중에 항목 노드를 명시적으로 선택합니다;</p></li>
<li><p>서로 다른 스케일로 에지 분리; 그리고,</p></li>
<li><p>고급 휴리스틱을 사용해 이웃을 선택합니다.</p></li>
</ul>
<p>처음 두 가지는 <em>검색 그래프의 계층 구조를</em> 구축하는 간단한 아이디어로 실현할 수 있습니다. NSW에서와 같이 단일 그래프 대신, HNSW는 그래프의 계층 구조를 구성합니다. 각 그래프 또는 계층은 NSW와 동일한 방식으로 개별적으로 검색됩니다. 가장 먼저 검색되는 최상위 레이어에는 매우 적은 수의 노드가 포함되며, 더 깊은 레이어에는 점점 더 많은 노드가 포함되고 최하위 레이어에는 모든 노드가 포함됩니다. 즉, 최상위 레이어는 벡터 공간에 걸쳐 더 긴 홉을 포함하므로 일종의 코스-투-파인 검색이 가능합니다. 위 그림을 참조하세요.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">그래프 구축하기<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>그래프 구성 알고리즘은 다음과 같이 작동합니다. 먼저 레이어 수인 <em>L을</em> 미리 고정합니다. l=1 값은 검색이 시작되는 가장 조밀한 레이어에 해당하고, l=L은 검색이 끝나는 가장 조밀한 레이어에 해당합니다. 삽입할 각 벡터를 반복하여 잘린 <a href="https://en.wikipedia.org/wiki/Geometric_distribution">기하 분포에</a> 따라 삽입 레이어를 샘플링합니다( <em>l &gt; L을</em> 거부하거나 <em>l' =</em> min_(l, L)_로 설정). 현재 벡터에 대해 <em>1 &lt; l &lt; L을</em> 샘플링한다고 가정합니다. 로컬 최소값에 도달할 때까지 최상위 레이어인 L에서 탐욕스러운 탐색을 수행합니다. 그런 다음 _L_번째 레이어의 국부 최소값에서 _(L-1)번째 레이어의 해당 벡터까지 에지를 따라 _(L-1)번째 레이어를 탐욕적으로 탐색하기 위한 진입점으로 사용합니다.</p>
<p>이 과정은 _L_번째 레이어에 도달할 때까지 반복됩니다. 그런 다음 삽입할 벡터에 대한 노드를 생성하기 시작하여 지금까지 구성된 _l_번째 레이어에서 탐욕적인 탐색으로 찾은 가장 가까운 이웃에 연결하고 _(l-1)번째 레이어로 이동하여 _1번째 레이어에 벡터를 삽입할 때까지 반복합니다. 위의 애니메이션은 이를 명확하게 보여줍니다.</p>
<p>이 계층적 그래프 구성 방법은 각 벡터에 대해 삽입 노드를 명시적으로 선택하는 영리한 방법을 사용한다는 것을 알 수 있습니다. 지금까지 구축된 삽입 레이어 위의 레이어를 검색하여 코스에서 미세한 거리까지 효율적으로 검색합니다. 이와 관련하여, 이 방법은 각 레이어에서 서로 다른 스케일로 링크를 분리합니다. 즉, 최상위 레이어는 검색 공간 전체에 걸쳐 긴 스케일의 홉을 제공하고, 그 스케일은 최하위 레이어로 내려갈수록 줄어듭니다. 이 두 가지 수정 사항은 모두 최적이 아닌 최소값에 갇히는 것을 방지하고 메모리를 추가하는 대신 검색 수렴을 가속화하는 데 도움이 됩니다.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">그래프 검색<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>검색 절차는 내부 그래프 구성 단계와 매우 유사하게 작동합니다. 최상위 레이어에서 시작하여 쿼리와 가장 가까운 노드를 욕심내어 탐색합니다. 그런 다음 해당 노드를 따라 다음 계층으로 내려가 이 과정을 반복합니다. 위의 애니메이션에서 볼 수 있듯이 최하위 레이어에서 가장 가까운 <em>R</em> 이웃 목록으로 답을 얻습니다.</p>
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
    </button></h2><p>Milvus와 같은 벡터 데이터베이스는 고도로 최적화되고 조정된 HNSW 구현을 제공하며, 종종 메모리에 맞는 데이터 세트에 대한 최상의 기본 검색 인덱스입니다.</p>
<p>이론과 수학보다는 시각화와 직관을 선호하며 HNSW의 작동 방식과 이유에 대한 개략적인 개요를 스케치했습니다. 따라서 구축 및 검색 알고리즘에 대한 정확한 설명<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 1-3], 검색 및 구축 복잡성 분석<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; §4.2], 구축 중 이웃 노드를 보다 효과적으로 선택하기 위한 휴리스틱<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 5] 등 덜 중요한 세부 사항은 생략했습니다. 또한 알고리즘의 하이퍼파라미터, 그 의미, 지연 시간/속도/메모리 트레이드오프에 미치는 영향에 대한 논의는 생략했습니다<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; §4.1]. 이에 대한 이해는 HNSW를 실제로 사용하는 데 중요합니다.</p>
<p>아래 리소스에는 이러한 주제에 대한 추가 자료와 이 글의 애니메이션을 제작하는 코드를 포함하여 NSW 및 HNSW를 위한 전체 Python 교육적 구현(제가 직접 작성)이 포함되어 있습니다.</p>
<custom-h1>리소스</custom-h1><ul>
<li><p>GitHub: "<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-일러스트: 학습 목적으로 벡터 검색 알고리즘인 계층적 탐색 가능한 작은 세계(HNSW)의 작은 구현</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Milvus 문서</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">계층적 탐색 가능한 작은 세계(HNSW)의 이해 - Zilliz Learn</a></p></li>
<li><p>HNSW 논문: "<a href="https://arxiv.org/abs/1603.09320">계층적 탐색 가능한 작은 세계 그래프를 사용한 효율적이고 강력한 근사 근접 이웃 검색</a>"</p></li>
<li><p>NSW 논문: "<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">탐색 가능한 작은 세계 그래프에 기반한 근사 최접 이웃 알고리즘</a>"</p></li>
</ul>
