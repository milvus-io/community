---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: '전용 벡터 데이터베이스는 왜, 언제 필요한가요?'
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  이 글에서는 벡터 검색과 그 기능에 대한 개요를 제공하고, 다양한 벡터 검색 기술을 비교하며, 전용 벡터 데이터베이스를 선택하는 것이 중요한
  이유를 설명합니다.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>이 글은 원래 <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI에</a> 게시되었으며 허가를 받아 여기에 다시 게시되었습니다.</em></p>
<p><a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> 및 기타 대규모 언어 모델(LLM)의 인기가 높아지면서 <a href="https://milvus.io/docs/overview.md">Milvus</a> 및 <a href="https://zilliz.com/cloud">Zilliz Cloud와</a> 같은 전용 벡터 데이터베이스, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS와</a> 같은 벡터 검색 라이브러리, 기존 데이터베이스와 통합된 벡터 검색 플러그인 등 벡터 검색 기술의 부상이 가속화되고 있습니다. 하지만 필요에 가장 적합한 솔루션을 선택하는 것은 어려울 수 있습니다. 고급 레스토랑과 패스트푸드 체인점 중 하나를 선택하는 것과 마찬가지로, 적합한 벡터 검색 기술을 선택하는 것은 사용자의 요구와 기대에 따라 달라집니다.</p>
<p>이 글에서는 벡터 검색과 그 기능에 대한 개요를 제공하고, 다양한 벡터 검색 기술을 비교하며, 전용 벡터 데이터베이스를 선택하는 것이 중요한 이유를 설명합니다.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">벡터 검색이란 무엇이며 어떻게 작동하나요?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 유사도 검색이라고도 하는<a href="https://zilliz.com/blog/vector-similarity-search">벡터 검색은</a> 광범위한 고밀도 벡터 데이터 모음 중에서 주어진 쿼리 벡터와 가장 유사하거나 의미적으로 관련된 상위 k개의 결과를 검색하는 기술입니다.</p>
<p>유사도 검색을 수행하기 전에 신경망을 활용하여 텍스트, 이미지, 동영상, 오디오와 같은 <a href="https://zilliz.com/blog/introduction-to-unstructured-data">비정형 데이터를</a> 임베딩 벡터라는 고차원 숫자 벡터로 변환합니다. 예를 들어, 사전 학습된 ResNet-50 컨볼루션 신경망을 사용하여 새 이미지를 2,048개의 차원을 가진 임베딩 모음으로 변환할 수 있습니다. 여기서는 처음 세 개와 마지막 세 개의 벡터 요소를 나열합니다: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>파트리스 부샤르의 새 이미지</span> </span></p>
<p>임베딩 벡터를 생성한 후, 벡터 검색 엔진은 입력 쿼리 벡터와 벡터 저장소에 있는 벡터 사이의 공간적 거리를 비교합니다. 공간적으로 가까울수록 더 유사합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>임베딩 연산</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">인기 있는 벡터 검색 기술<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Python의 NumPy와 같은 머신 러닝 라이브러리, FAISS와 같은 벡터 검색 라이브러리, 기존 데이터베이스에 구축된 벡터 검색 플러그인, Milvus 및 Zilliz Cloud와 같은 전문 벡터 데이터베이스 등 다양한 벡터 검색 기술이 시중에 나와 있습니다.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">머신 러닝 라이브러리</h3><p>머신 러닝 라이브러리를 사용하는 것이 벡터 검색을 구현하는 가장 쉬운 방법입니다. 예를 들어, Python의 NumPy를 사용하면 20줄 미만의 코드로 가장 가까운 이웃 알고리즘을 구현할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>100개의 2차원 벡터를 생성하고 벡터 [0.5, 0.5]에 가장 가까운 이웃을 찾을 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>Python의 NumPy와 같은 머신 러닝 라이브러리는 저렴한 비용으로 뛰어난 유연성을 제공합니다. 하지만 몇 가지 한계가 있습니다. 예를 들어, 소량의 데이터만 처리할 수 있고 데이터 지속성을 보장하지 못합니다.</p>
<p>저는 벡터 검색에 NumPy나 다른 머신 러닝 라이브러리를 사용하는 것을 추천합니다:</p>
<ul>
<li>빠른 프로토타이핑이 필요한 경우.</li>
<li>데이터 지속성에 신경 쓰지 않는 경우.</li>
<li>데이터 크기가 100만 개 미만이고 스칼라 필터링이 필요하지 않은 경우.</li>
<li>고성능이 필요하지 않은 경우.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">벡터 검색 라이브러리</h3><p>벡터 검색 라이브러리를 사용하면 고성능 프로토타입 벡터 검색 시스템을 빠르게 구축할 수 있습니다. FAISS가 대표적인 예입니다. 효율적인 유사도 검색과 고밀도 벡터 클러스터링을 위해 Meta에서 개발한 오픈 소스입니다. FAISS는 메모리에 완전히 로드할 수 없는 벡터 컬렉션을 포함해 모든 크기의 벡터 컬렉션을 처리할 수 있습니다. 또한 FAISS는 평가 및 파라미터 튜닝을 위한 도구도 제공합니다. C++로 작성되었지만 FAISS는 Python/NumPy 인터페이스도 제공합니다.</p>
<p>아래는 FAISS에 기반한 벡터 검색 예제 코드입니다:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>FAISS와 같은 벡터 검색 라이브러리는 사용하기 쉽고 수백만 개의 벡터가 있는 소규모 프로덕션 환경에서도 충분히 빠르게 처리할 수 있습니다. 양자화 및 GPU를 활용하고 데이터 차원을 줄임으로써 쿼리 성능을 향상시킬 수 있습니다.</p>
<p>그러나 이러한 라이브러리는 프로덕션 환경에서 사용할 때 몇 가지 제한이 있습니다. 예를 들어, FAISS는 실시간 데이터 추가 및 삭제, 원격 호출, 여러 언어, 스칼라 필터링, 확장성 또는 재해 복구를 지원하지 않습니다.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">다양한 유형의 벡터 데이터베이스</h3><p>위 라이브러리의 한계를 해결하기 위해 등장한 벡터 데이터베이스는 프로덕션 애플리케이션을 위한 보다 포괄적이고 실용적인 솔루션을 제공합니다.</p>
<p>현재 네 가지 유형의 벡터 데이터베이스를 사용할 수 있습니다:</p>
<ul>
<li>벡터 검색 플러그인을 통합한 기존 관계형 또는 열 형식 데이터베이스. PG Vector가 그 예입니다.</li>
<li>고밀도 벡터 인덱싱을 지원하는 기존의 역 인덱스 검색 엔진. <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch가</a> 그 예입니다.</li>
<li>벡터 검색 라이브러리를 기반으로 구축된 경량 벡터 데이터베이스. Chroma가 그 예입니다.</li>
<li><strong>특수 목적으로 구축된 벡터 데이터베이스</strong>. 이 유형의 데이터베이스는 상향식 벡터 검색을 위해 특별히 설계되고 최적화되어 있습니다. 특수 목적으로 구축된 벡터 데이터베이스는 일반적으로 분산 컴퓨팅, 재해 복구, 데이터 지속성 등 고급 기능을 제공합니다. <a href="https://zilliz.com/what-is-milvus">Milvus가</a> 대표적인 예입니다.</li>
</ul>
<p>모든 벡터 데이터베이스가 똑같이 만들어지는 것은 아닙니다. 각 스택마다 고유한 장점과 한계가 있기 때문에 애플리케이션에 따라 어느 정도 적합합니다.</p>
<p>저는 다른 솔루션보다 전문 벡터 데이터베이스를 선호하는데, 그 이유는 가장 효율적이고 편리한 옵션이며 수많은 고유한 이점을 제공하기 때문입니다. 다음 섹션에서는 Milvus를 예로 들어 제가 선호하는 이유를 설명하겠습니다.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">전용 벡터 데이터베이스의 주요 이점<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus는</a> 수십억 개의 임베딩 벡터를 저장, 색인, 관리 및 검색할 수 있는 오픈 소스 분산형 특수 목적 벡터 데이터베이스입니다. 또한 <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM 검색 증강 생성을</a> 위해 가장 널리 사용되는 벡터 데이터베이스 중 하나입니다. 특수 목적으로 구축된 벡터 데이터베이스의 모범적인 사례인 Milvus는 다른 데이터베이스와 많은 고유한 장점을 공유합니다.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">데이터 지속성 및 비용 효율적인 스토리지</h3><p>데이터 손실 방지는 데이터베이스의 최소한의 요건이지만, 많은 단일 머신 및 경량 벡터 데이터베이스는 데이터 안정성을 우선시하지 않습니다. 이와는 대조적으로 <a href="https://zilliz.com/what-is-milvus">Milvus와</a> 같이 특별히 구축된 분산형 벡터 데이터베이스는 스토리지와 계산을 분리하여 시스템 복원력, 확장성, 데이터 지속성을 우선시합니다.</p>
<p>또한, 근사 근사 이웃(ANN) 인덱스를 사용하는 대부분의 벡터 데이터베이스는 ANN 인덱스를 메모리에만 로드하기 때문에 벡터 검색을 수행하는 데 많은 메모리가 필요합니다. 하지만 Milvus는 디스크 인덱스를 지원하므로 인메모리 인덱스보다 10배 이상 비용 효율적입니다.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">최적의 쿼리 성능</h3><p>특수 벡터 데이터베이스는 다른 벡터 검색 옵션에 비해 최적의 쿼리 성능을 제공합니다. 예를 들어, Milvus는 벡터 검색 플러그인보다 쿼리 처리 속도가 10배 빠릅니다. Milvus는 더 빠른 벡터 검색을 위해 KNN 잔인한 검색 알고리즘 대신 <a href="https://zilliz.com/glossary/anns">ANN 알고리즘을</a> 사용합니다. 또한 인덱스를 분할하여 데이터 볼륨이 증가함에 따라 인덱스를 구성하는 데 걸리는 시간을 단축합니다. 이러한 접근 방식을 통해 Milvus는 실시간으로 데이터를 추가하고 삭제하는 수십억 개의 벡터를 쉽게 처리할 수 있습니다. 반면, 다른 벡터 검색 애드온은 데이터가 수천만 개 미만이고 추가 및 삭제가 빈번하지 않은 시나리오에만 적합합니다.</p>
<p>Milvus는 GPU 가속도 지원합니다. 내부 테스트에 따르면 GPU 가속 벡터 인덱싱은 수천만 개의 데이터를 검색할 때 10,000+ QPS를 달성할 수 있으며, 이는 단일 머신 쿼리 성능을 위한 기존 CPU 인덱싱보다 최소 10배 이상 빠른 속도입니다.</p>
<h3 id="System-Reliability" class="common-anchor-header">시스템 안정성</h3><p>많은 애플리케이션이 쿼리 지연 시간이 짧고 처리량이 높은 온라인 쿼리를 위해 벡터 데이터베이스를 사용합니다. 이러한 애플리케이션은 분 단위의 단일 머신 장애 복구가 필요하며, 일부는 중요한 시나리오를 위해 지역 간 재해 복구가 필요합니다. Raft/Paxos를 기반으로 하는 기존의 복제 전략은 리소스 낭비가 심각하고 데이터를 사전 샤딩해야 하므로 안정성이 떨어집니다. 이와 달리 Milvus는 고가용성을 위해 K8 메시지 큐를 활용하는 분산형 아키텍처를 갖추고 있어 복구 시간을 단축하고 리소스를 절약할 수 있습니다.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">운영성 및 관찰 가능성</h3><p>엔터프라이즈 사용자에게 더 나은 서비스를 제공하려면 벡터 데이터베이스는 더 나은 운영성과 통합 가시성을 위한 다양한 엔터프라이즈급 기능을 제공해야 합니다. Milvus는 K8s Operator 및 Helm 차트, docker-compose, pip 설치 등 다양한 배포 방법을 지원하므로 다양한 요구 사항을 가진 사용자가 액세스할 수 있습니다. Milvus는 또한 Grafana, Prometheus, Loki를 기반으로 하는 모니터링 및 경보 시스템을 제공하여 통합 가시성을 향상시킵니다. 분산형 클라우드 네이티브 아키텍처를 갖춘 Milvus는 업계 최초로 멀티테넌트 격리, RBAC, 할당량 제한, 롤링 업그레이드를 지원하는 벡터 데이터베이스입니다. 이러한 모든 접근 방식을 통해 Milvus를 훨씬 더 간편하게 관리하고 모니터링할 수 있습니다.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">10분 이내에 간단한 3단계로 Milvus 시작하기<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스를 구축하는 것은 복잡한 작업이지만, Numpy와 FAISS를 사용하는 것만큼이나 간단합니다. AI에 익숙하지 않은 학생도 단 10분 만에 Milvus를 기반으로 벡터 검색을 구현할 수 있습니다. 확장성이 뛰어난 고성능 벡터 검색 서비스를 경험하려면 다음 세 단계를 따르세요:</p>
<ul>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 배포 문서의</a> 도움을 받아 서버에 Milvus를 배포합니다.</li>
<li><a href="https://milvus.io/docs/example_code.md">Hello Milvus 문서를</a> 참조하여 단 50줄의 코드로 벡터 검색을 구현하세요.</li>
<li><a href="https://github.com/towhee-io/examples/">Towhee의 예제 문서를</a> 살펴보고 <a href="https://zilliz.com/use-cases">벡터 데이터베이스의</a> 인기 있는 <a href="https://zilliz.com/use-cases">사용 사례에</a> 대한 인사이트를 얻으세요.</li>
</ul>
