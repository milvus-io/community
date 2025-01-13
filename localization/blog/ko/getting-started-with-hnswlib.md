---
id: getting-started-with-hnswlib.md
title: HNSWlib 시작하기
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSW를 구현하는 라이브러리인 HNSWlib는 효율성과 확장성이 뛰어나며 수백만 개의 포인트에서도 잘 작동합니다. 몇 분 안에 구현하는
  방법을 알아보세요.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색을</a> 사용하면 기계가 언어를 이해하고 더 나은 검색 결과를 얻을 수 있으며, 이는 AI 및 데이터 분석에 필수적입니다. 언어가 <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">임베딩으로</a> 표현되면 정확하거나 근사한 방법을 사용해 검색을 수행할 수 있습니다. 근사 이웃<a href="https://zilliz.com/glossary/anns">(ANN)</a> 검색은 고차원 데이터의 경우 계산 비용이 많이 드는 <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">정확한 가장 가까운 이웃 검색과</a> 달리 데이터 세트에서 주어진 쿼리 지점에 가장 가까운 지점을 빠르게 찾는 데 사용되는 방법입니다. ANN은 가장 가까운 이웃에 대략적으로 가까운 결과를 제공함으로써 더 빠른 검색을 가능하게 합니다.</p>
<p>근사 최인접 이웃(ANN) 검색을 위한 알고리즘 중 하나는 오늘 논의의 초점이 될 <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib에서</a> 구현된 <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (계층적 탐색 가능한 작은 세계)입니다. 이 블로그에서는 다음과 같이 설명합니다:</p>
<ul>
<li><p>HNSW 알고리즘을 이해합니다.</p></li>
<li><p>HNSWlib와 주요 기능을 살펴봅니다.</p></li>
<li><p>색인 구축과 검색 구현을 포함하는 HNSWlib 설정하기.</p></li>
<li><p>Milvus와 비교합니다.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">HNSW 이해하기<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>계층적 탐색 가능한 작은 세계(</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a>)<strong>는</strong> '작은 세계' 네트워크의 다층 그래프를 구축함으로써 특히 고차원 공간에서 효율적인 유사성 검색을 가능하게 하는 그래프 기반 데이터 구조입니다. <a href="https://arxiv.org/abs/1603.09320">2016년에</a> 도입된 HNSW는 무차별 대입 및 트리 기반 검색과 같은 기존 검색 방법과 관련된 확장성 문제를 해결합니다. 추천 시스템, 이미지 인식, <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">검색 증강 생성(RAG)</a>과 같은 대규모 데이터 세트가 포함된 애플리케이션에 이상적입니다.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">HNSW가 중요한 이유</h3><p>HNSW는 고차원 공간에서 가장 가까운 이웃 검색의 성능을 크게 향상시킵니다. 계층 구조와 스몰 월드 탐색 기능을 결합하면 기존 방법의 계산 비효율성을 피할 수 있어 방대하고 복잡한 데이터 세트에서도 우수한 성능을 발휘할 수 있습니다. 이를 더 잘 이해하기 위해 현재 어떻게 작동하는지 살펴보겠습니다.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">HNSW의 작동 방식</h3><ol>
<li><p><strong>계층적 레이어:</strong> HNSW는 데이터를 계층 구조로 구성하며, 각 계층은 에지로 연결된 노드를 포함합니다. 최상위 레이어는 밀도가 낮아서 지도를 축소하여 도시 사이의 주요 고속도로만 볼 수 있는 것처럼 그래프 전반을 광범위하게 '건너뛸' 수 있습니다. 아래쪽 레이어는 밀도가 높아져 더 세밀한 디테일과 가까운 이웃 간의 더 많은 연결을 제공합니다.</p></li>
<li><p><strong>탐색 가능한 작은 세계 개념:</strong> HNSW의 각 레이어는 노드(데이터 포인트)가 서로 몇 '홉' 밖에 떨어져 있지 않은 '작은 세계' 네트워크 개념을 기반으로 구축됩니다. 검색 알고리즘은 가장 높은, 가장 희박한 계층에서 시작하여 아래쪽으로 내려가면서 점점 더 밀도가 높은 계층으로 이동하여 검색을 구체화합니다. 이 접근 방식은 글로벌 뷰에서 이웃 수준의 세부 정보로 이동하여 검색 영역을 점차 좁혀가는 것과 같습니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">그림 1</a>: 탐색 가능한 작은 세계 그래프의 예시</p>
<ol start="3">
<li><strong>목록형 구조 건너뛰기:</strong> HNSW의 계층적 측면은 상위 계층일수록 노드 수가 적어 초기 검색을 더 빠르게 수행할 수 있는 확률적 데이터 구조인 스킵 리스트와 유사합니다.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">그림 2</a>: 스킵 리스트 구조의 예시</p>
<p>주어진 스킵 리스트에서 96을 검색하려면 맨 왼쪽 맨 위 헤더 노드에서 시작합니다. 오른쪽으로 이동하면 96개보다 적은 31개가 나오므로 다음 노드로 계속 이동합니다. 이제 다시 31이 표시되는 레벨로 내려가야 하는데, 여전히 96보다 작으므로 한 레벨을 더 내려갑니다. 다시 한 번 31을 찾은 다음 오른쪽으로 이동하여 목표 값인 96에 도달합니다. 이렇게 하면 건너뛰기 목록의 가장 낮은 레벨로 내려갈 필요 없이 96을 찾을 수 있습니다.</p>
<ol start="4">
<li><p><strong>검색 효율성:</strong> HNSW 알고리즘은 최상위 계층의 엔트리 노드에서 시작하여 각 단계마다 더 가까운 이웃 노드로 진행합니다. 가장 유사한 노드를 찾을 가능성이 높은 가장 낮은 레이어에 도달할 때까지 각 레이어를 거칠고 세밀한 탐색에 사용하면서 레이어를 내려갑니다. 이러한 계층 탐색은 탐색해야 하는 노드와 에지 수를 줄여주므로 검색이 빠르고 정확합니다.</p></li>
<li><p><strong>삽입 및 유지 관리</strong>: 새 노드를 추가할 때 알고리즘은 확률에 따라 진입 계층을 결정하고 이웃 선택 휴리스틱을 사용하여 인근 노드에 연결합니다. 이 휴리스틱은 연결성을 최적화하여 그래프 밀도의 균형을 유지하면서 탐색성을 개선하는 링크를 생성하는 것을 목표로 합니다. 이 접근 방식은 구조를 견고하게 유지하고 새로운 데이터 포인트에 적응할 수 있도록 합니다.</p></li>
</ol>
<p>HNSW 알고리즘에 대한 기본적인 이해는 있지만, 이를 처음부터 구현하는 것은 부담스러울 수 있습니다. 다행히도 커뮤니티에서는 사용법을 간소화하기 위해 <a href="https://github.com/nmslib/hnswlib">HNSWlib와</a> 같은 라이브러리를 개발하여 어렵지 않게 접근할 수 있습니다. 이제 HNSWlib에 대해 자세히 살펴보겠습니다.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">HNSWlib 개요<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSW를 구현하는 널리 사용되는 라이브러리인 HNSWlib는 효율성과 확장성이 뛰어나며 수백만 개의 포인트에서도 잘 작동합니다. 그래프 레이어 간에 빠른 점프를 허용하고 고밀도 고차원 데이터 검색을 최적화함으로써 비선형 시간 복잡성을 해결합니다. HNSWlib의 주요 기능은 다음과 같습니다:</p>
<ul>
<li><p><strong>그래프 기반 구조:</strong> 다층 그래프가 데이터 포인트를 나타내므로 가장 가까운 이웃을 빠르게 검색할 수 있습니다.</p></li>
<li><p><strong>고차원 효율성:</strong> 고차원 데이터에 최적화되어 빠르고 정확한 근사치 검색을 제공합니다.</p></li>
<li><p><strong>서브선형 검색 시간:</strong> 레이어를 건너뛰어 서브선형 복잡도를 달성하여 속도를 크게 향상시킵니다.</p></li>
<li><p><strong>동적 업데이트:</strong> 그래프를 완전히 다시 빌드할 필요 없이 노드를 실시간으로 삽입 및 삭제할 수 있습니다.</p></li>
<li><p><strong>메모리 효율성:</strong> 대용량 데이터 세트에 적합한 효율적인 메모리 사용.</p></li>
<li><p><strong>확장성:</strong> 수백만 개의 데이터 포인트까지 잘 확장되므로 추천 시스템과 같은 중간 규모 애플리케이션에 이상적입니다.</p></li>
</ul>
<p><strong>참고:</strong> HNSWlib은 벡터 검색 애플리케이션을 위한 간단한 프로토타입을 만드는 데 탁월합니다. 그러나 확장성 제한으로 인해 수억 개 또는 수십억 개의 데이터 포인트가 포함된 보다 복잡한 시나리오에는 <a href="https://zilliz.com/blog/what-is-a-real-vector-database">특수 제작된 벡터 데이터베이스와</a> 같은 더 나은 선택이 있을 수 있습니다. 실제로 확인해 보겠습니다.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">HNSWlib 시작하기: 단계별 가이드<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>이 섹션에서는 HNSW 인덱스를 만들고, 데이터를 삽입하고, 검색을 수행함으로써 HNSWlib를 <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">벡터 검색 라이브러리로</a> 사용하는 방법을 보여드립니다. 설치부터 시작하겠습니다:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">설정 및 가져오기</h3><p>Python에서 HNSWlib를 시작하려면 먼저 pip를 사용하여 설치합니다:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 필요한 라이브러리를 가져옵니다:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">데이터 준비하기</h3><p>이 예에서는 <code translate="no">NumPy</code>을 사용하여 각각 차원 크기가 256인 10,000개의 요소로 구성된 임의의 데이터 집합을 생성하겠습니다.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>데이터를 만들어 보겠습니다:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>이제 데이터가 준비되었으니 인덱스를 만들어 보겠습니다.</p>
<h3 id="Building-an-Index" class="common-anchor-header">인덱스 구축</h3><p>인덱스를 구축할 때는 벡터의 차원과 공간 유형을 정의해야 합니다. 인덱스를 만들어 보겠습니다:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: 이 매개변수는 유사도에 사용되는 거리 메트릭을 정의합니다. <code translate="no">'l2'</code> 로 설정하면 유클리드 거리(L2 노멀)를 사용합니다. 대신 <code translate="no">'ip'</code> 으로 설정하면 코사인 유사도와 같은 작업에 유용한 내적 곱을 사용합니다.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: 이 매개변수는 작업할 데이터 포인트의 차원을 지정합니다. 인덱스에 추가하려는 데이터의 차원과 일치해야 합니다.</li>
</ul>
<p>인덱스를 초기화하는 방법은 다음과 같습니다:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: 인덱스에 추가할 수 있는 최대 요소 수를 설정합니다. <code translate="no">Num_elements</code> 이 최대 용량이므로 10,000개의 데이터 포인트로 작업하므로 10,000개로 설정합니다.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: 이 매개변수는 인덱스 생성 시 정확도와 구축 속도 간의 균형을 제어합니다. 값이 클수록 리콜(정확도)은 향상되지만 메모리 사용량과 구축 시간이 늘어납니다. 일반적인 값은 100에서 200 사이입니다.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: 이 매개변수는 각 데이터 포인트에 대해 생성되는 양방향 링크의 수를 결정하며, 정확도와 검색 속도에 영향을 줍니다. 일반적인 값은 12에서 48 사이이며, 보통 16이 적당한 정확도와 속도를 위한 적절한 균형입니다.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: <code translate="no">ef</code> 매개변수는 '탐색 계수'의 줄임말로, 검색 중에 얼마나 많은 이웃을 검사할지를 결정합니다. <code translate="no">ef</code> 값이 높을수록 더 많은 이웃을 탐색하므로 일반적으로 검색의 정확도(리콜)가 높아지지만 검색 속도도 느려집니다. 반대로 <code translate="no">ef</code> 값이 낮으면 검색 속도는 빨라지지만 정확도는 떨어질 수 있습니다.</li>
</ul>
<p>이 경우 <code translate="no">ef</code> 을 50 으로 설정하면 검색 알고리즘이 가장 유사한 데이터 포인트를 찾을 때 최대 50 개의 이웃을 평가합니다.</p>
<p>참고: <code translate="no">ef_construction</code> 은 인덱스 생성 중에 이웃 검색 노력을 설정하여 정확도를 향상시키지만 구축 속도가 느려집니다. <code translate="no">ef</code> 은 쿼리 중에 검색 노력을 제어하여 각 쿼리에 대해 속도와 리콜의 균형을 동적으로 조정합니다.</p>
<h3 id="Performing-Searches" class="common-anchor-header">검색 수행</h3><p>HNSWlib를 사용하여 가장 가까운 이웃 검색을 수행하려면 먼저 임의의 쿼리 벡터를 생성합니다. 이 예제에서는 벡터의 차원이 색인된 데이터와 일치합니다.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: 이 줄은 인덱싱된 데이터와 동일한 차원을 가진 임의의 벡터를 생성하여 최근 이웃 검색의 호환성을 보장합니다.</li>
<li><code translate="no">knn_query</code>: 이 메서드는 인덱스 <code translate="no">p</code> 내에서 <code translate="no">query_vector</code> 의 가장 가까운 이웃인 <code translate="no">k</code> 을 검색합니다. 두 개의 배열을 반환합니다: <code translate="no">labels</code> 가장 가까운 이웃의 인덱스가 포함된 <code translate="no">distances</code> 와 쿼리 벡터에서 각 이웃까지의 거리를 나타내는 의 두 배열을 반환합니다. 여기서 <code translate="no">k=5</code> 은 가장 가까운 이웃 5개를 찾도록 지정합니다.</li>
</ul>
<p>다음은 레이블과 거리를 인쇄한 결과입니다:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>여기까지 HNSWlib를 시작하기 위한 간단한 가이드가 끝났습니다.</p>
<p>앞서 언급했듯이, HNSWlib은 중간 크기의 데이터 세트를 프로토타이핑하거나 실험하기 위한 훌륭한 벡터 검색 엔진입니다. 확장성 요구 사항이 더 높거나 다른 엔터프라이즈급 기능이 필요한 경우, 오픈 소스 <a href="https://zilliz.com/what-is-milvus">Milvus나</a> <a href="https://zilliz.com/cloud">Zilliz Cloud의</a> 완전 관리형 서비스와 같은 특수 목적의 벡터 데이터베이스를 선택해야 할 수도 있습니다. 따라서 다음 섹션에서는 HNSWlib과 Milvus를 비교해보겠습니다.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">밀버스와 같은 전용 벡터 데이터베이스와 HNSWlib 비교<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스는</a> 데이터를 수학적 표현으로 저장하여 <a href="https://zilliz.com/ai-models">머신 러닝 모델이</a> 문맥 이해를 위한 <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">유사성 메트릭을</a> 통해 데이터를 식별함으로써 검색, 추천 및 텍스트 생성을 강화할 수 있게 해줍니다.</p>
<p>HNSWlib와 같은 벡터 인덱스 라이브러리는<a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색</a> 및 검색을 개선하지만 전체 데이터베이스의 관리 기능이 부족합니다. 반면에 <a href="https://milvus.io/">Milvus와</a> 같은 벡터 데이터베이스는 벡터 임베딩을 대규모로 처리하도록 설계되어 독립형 라이브러리에는 일반적으로 부족한 데이터 관리, 색인 및 쿼리 기능에서 이점을 제공합니다. Milvus를 사용하면 얻을 수 있는 몇 가지 다른 이점은 다음과 같습니다:</p>
<ul>
<li><p><strong>고속 벡터 유사도 검색</strong>: Milvus는 수십억 개 규모의 벡터 데이터 세트에 대해 밀리초 수준의 검색 성능을 제공하며, 이미지 검색, 추천 시스템, 자연어 처리<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP)</a>, 검색 증강 생성<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a> 같은 애플리케이션에 이상적입니다.</p></li>
<li><p><strong>확장성 및 고가용성:</strong> 대량의 데이터를 처리할 수 있도록 구축된 Milvus는 수평적으로 확장되며, 안정성을 위한 복제 및 장애 조치 메커니즘이 포함되어 있습니다.</p></li>
<li><p><strong>분산 아키텍처:</strong> Milvus는 유연성과 견고성을 위해 여러 노드에 걸쳐 스토리지와 컴퓨팅을 분리하는 확장 가능한 분산 아키텍처를 사용합니다.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>하이브리드 검색</strong></a><strong>:</strong> Milvus는 멀티모달 검색, 하이브리드 <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">스파스 및 고밀도 검색</a>, 하이브리드 고밀도 및 <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">전체 텍스트 검색을</a> 지원하여 다양하고 유연한 검색 기능을 제공합니다.</p></li>
<li><p><strong>유연한 데이터 지원</strong>: Milvus는 벡터, 스칼라, 구조화된 데이터 등 다양한 데이터 유형을 지원하므로 단일 시스템 내에서 원활하게 관리하고 분석할 수 있습니다.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>활발한 커뮤니티</strong></a> <strong>및 지원</strong>: 활발한 커뮤니티를 통해 정기적인 업데이트, 튜토리얼, 지원을 제공함으로써 Milvus가 사용자의 요구와 현장의 발전에 발맞춰 나갈 수 있도록 합니다.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">AI 통합</a>: Milvus는 다양한 인기 AI 프레임워크 및 기술과 통합되어 개발자가 익숙한 기술 스택으로 애플리케이션을 쉽게 구축할 수 있습니다.</p></li>
</ul>
<p>또한 Milvus는 번거롭지 않고 10배 빠른 <a href="https://zilliz.com/cloud">Ziliz Cloud에서</a> 완전 관리형 서비스를 제공합니다.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">비교: Milvus와 HNSWlib 비교</h3><table>
<thead>
<tr><th style="text-align:center"><strong>기능</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">확장성</td><td style="text-align:center">수십억 개의 벡터를 손쉽게 처리</td><td style="text-align:center">RAM 사용량으로 인해 소규모 데이터 세트에 적합</td></tr>
<tr><td style="text-align:center">이상적인 대상</td><td style="text-align:center">프로토타이핑, 실험 및 엔터프라이즈급 애플리케이션</td><td style="text-align:center">프로토타입 및 경량 ANN 작업에 집중</td></tr>
<tr><td style="text-align:center">인덱싱</td><td style="text-align:center">HNSW, DiskANN, 정량화, 바이너리 등 10개 이상의 인덱싱 알고리즘을 지원합니다.</td><td style="text-align:center">그래프 기반 HNSW만 사용</td></tr>
<tr><td style="text-align:center">통합</td><td style="text-align:center">API 및 클라우드 네이티브 서비스 제공</td><td style="text-align:center">경량 독립형 라이브러리로 제공</td></tr>
<tr><td style="text-align:center">성능</td><td style="text-align:center">대용량 데이터, 분산 쿼리에 최적화됨</td><td style="text-align:center">빠른 속도를 제공하지만 확장성이 제한됨</td></tr>
</tbody>
</table>
<p>전반적으로 Milvus는 일반적으로 복잡한 인덱싱이 필요한 대규모 프로덕션급 애플리케이션에 적합하며, HNSWlib은 프로토타이핑 및 보다 간단한 사용 사례에 이상적입니다.</p>
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
    </button></h2><p>시맨틱 검색은 리소스 집약적일 수 있으므로 더 빠른 데이터 검색을 위해서는 HNSW에서 수행하는 것과 같은 내부 데이터 구조화가 필수적입니다. 개발자가 벡터 기능을 프로토타입으로 만들 수 있는 레시피가 준비되어 있는 HNSWlib과 같은 라이브러리는 구현에 신경을 쓰고 있습니다. 단 몇 줄의 코드만으로 자체 색인을 구축하고 검색을 수행할 수 있습니다.</p>
<p>HNSWlib은 시작하기에 좋은 방법입니다. 그러나 복잡하고 프로덕션에 바로 사용할 수 있는 AI 애플리케이션을 구축하려면 특별히 제작된 벡터 데이터베이스를 사용하는 것이 가장 좋습니다. 예를 들어 <a href="https://milvus.io/">Milvus는</a> 고속 벡터 검색, 확장성, 가용성, 데이터 유형 및 프로그래밍 언어의 유연성 등 엔터프라이즈에 적합한 많은 기능을 갖춘 오픈 소스 벡터 데이터베이스입니다.</p>
<h2 id="Further-Reading" class="common-anchor-header">더 읽어보기<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">Faiss(Facebook AI 유사도 검색)란 무엇인가요? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib이란 무엇인가요? 빠른 ANN 검색을 위한 그래프 기반 라이브러리 </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN(확장 가능한 가장 가까운 이웃)이란 무엇인가요? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: 오픈 소스 VectorDB 벤치마크 도구</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">생성적 AI 리소스 허브 | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스란 무엇이며 어떻게 작동하나요? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG란 무엇인가요? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">GenAI 앱을 위한 최고 성능의 AI 모델 | Zilliz</a></p></li>
</ul>
