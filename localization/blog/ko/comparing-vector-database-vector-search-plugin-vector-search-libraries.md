---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: '벡터 데이터베이스, 벡터 검색 라이브러리, 벡터 검색 플러그인 비교하기'
author: Frank Liu
date: 2023-11-9
desc: '이 글에서는 벡터 데이터베이스, 벡터 검색 플러그인, 벡터 검색 라이브러리를 비교하면서 벡터 검색의 복잡한 영역을 계속 살펴볼 것입니다.'
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>안녕하세요, 벡터 데이터베이스 101에 다시 오신 것을 환영합니다!</p>
<p><a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> 및 기타 대규모 언어 모델(LLM)의 급증으로 인해 벡터 검색 기술이 성장하고 있으며, 기존 데이터베이스 내에 <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> 및 통합 벡터 검색 플러그인과 같은 라이브러리와 함께 <a href="https://zilliz.com/what-is-milvus">Milvus</a> 및 <a href="https://zilliz.com/cloud">Zilliz Cloud와</a> 같은 전문 벡터 데이터베이스가 등장했습니다.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">이전 시리즈 게시물에서는</a> 벡터 데이터베이스의 기초에 대해 자세히 살펴보았습니다. 이번 글에서는 벡터 데이터베이스, 벡터 검색 플러그인, 벡터 검색 라이브러리를 비교하면서 벡터 검색의 복잡한 영역을 계속해서 살펴보겠습니다.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">벡터 검색이란 무엇인가요?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 유사도 검색이라고도 하는<a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색은</a> 광범위한 고밀도 벡터 데이터 모음 중에서 주어진 쿼리 벡터와 가장 유사하거나 의미적으로 관련된 상위 k개의 결과를 검색하는 기법입니다. 유사도 검색을 수행하기 전에 신경망을 활용하여 텍스트, 이미지, 동영상, 오디오와 같은 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터를</a> 임베딩 벡터라는 고차원 숫자 벡터로 변환합니다. 임베딩 벡터를 생성한 후, 벡터 검색 엔진은 입력 쿼리 벡터와 벡터 저장소에 있는 벡터 사이의 공간적 거리를 비교합니다. 공간적으로 가까울수록 더 유사합니다.</p>
<p>Python의 NumPy와 같은 머신 러닝 라이브러리, FAISS와 같은 벡터 검색 라이브러리, 기존 데이터베이스에 구축된 벡터 검색 플러그인, Milvus 및 Zilliz Cloud와 같은 전문 벡터 데이터베이스 등 다양한 벡터 검색 기술이 시중에 나와 있습니다.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">벡터 데이터베이스와 벡터 검색 라이브러리 비교<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">전문화된 벡터 데이터베이스만이</a> 유사도 검색을 위한 유일한 스택은 아닙니다. 벡터 데이터베이스가 등장하기 전에는 FAISS, ScaNN, HNSW와 같은 많은 벡터 검색 라이브러리가 벡터 검색에 사용되었습니다.</p>
<p>벡터 검색 라이브러리는 고성능 프로토타입 벡터 검색 시스템을 빠르게 구축하는 데 도움이 될 수 있습니다. FAISS를 예로 들어보면, 효율적인 유사도 검색과 고밀도 벡터 클러스터링을 위해 Meta에서 개발한 오픈 소스입니다. FAISS는 메모리에 완전히 로드할 수 없는 벡터 컬렉션을 포함해 모든 크기의 벡터 컬렉션을 처리할 수 있습니다. 또한 FAISS는 평가 및 파라미터 튜닝을 위한 도구도 제공합니다. C++로 작성되었지만 FAISS는 Python/NumPy 인터페이스도 제공합니다.</p>
<p>그러나 벡터 검색 라이브러리는 관리형 솔루션이 아닌 경량 ANN 라이브러리일 뿐이며 기능이 제한적입니다. 데이터 세트가 작고 제한적인 경우, 이러한 라이브러리는 프로덕션 환경에서 실행되는 시스템에서도 비정형 데이터 처리에 충분할 수 있습니다. 그러나 데이터 세트의 크기가 커지고 더 많은 사용자가 온보딩되면 규모 문제를 해결하기가 점점 더 어려워집니다. 게다가 인덱스 데이터에 대한 수정을 허용하지 않으며 데이터 가져오기 중에 쿼리할 수 없습니다.</p>
<p>이에 비해 벡터 데이터베이스는 비정형 데이터 저장 및 검색에 보다 최적화된 솔루션입니다. 수백만 또는 수십억 개의 벡터를 저장하고 쿼리하는 동시에 실시간 응답을 제공할 수 있으며, 사용자의 증가하는 비즈니스 요구 사항을 충족할 수 있도록 확장성이 뛰어납니다.</p>
<p>또한 Milvus와 같은 벡터 데이터베이스는 클라우드 네이티브, 멀티테넌시, 확장성 등 정형/반정형 데이터에 대해 훨씬 더 사용자 친화적인 기능을 갖추고 있습니다. 이러한 기능은 이 튜토리얼을 자세히 살펴보면서 더 명확해질 것입니다.</p>
<p>또한 벡터 검색 라이브러리와는 완전히 다른 추상화 계층에서 작동합니다. 벡터 데이터베이스는 완전한 서비스인 반면, ANN 라이브러리는 개발 중인 애플리케이션에 통합되기 위한 것입니다. 이러한 의미에서 ANN 라이브러리는 벡터 데이터베이스가 구축되는 많은 구성 요소 중 하나이며, 이는 마치 Elasticsearch가 Apache Lucene 위에 구축되는 방식과 유사합니다.</p>
<p>이러한 추상화가 중요한 이유를 설명하기 위해 벡터 데이터베이스에 새로운 비정형 데이터 요소를 삽입하는 경우를 예로 들어보겠습니다. Milvus에서는 이 작업이 매우 쉽습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>코드 3줄만 추가하면 됩니다. 안타깝게도 FAISS나 ScaNN과 같은 라이브러리를 사용하면 특정 체크포인트에서 전체 인덱스를 수동으로 다시 만들지 않고는 이 작업을 쉽게 수행할 방법이 없습니다. 가능하다고 하더라도 벡터 검색 라이브러리는 가장 중요한 벡터 데이터베이스 기능인 확장성과 멀티테넌시가 부족합니다.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">벡터 데이터베이스와 기존 데이터베이스용 벡터 검색 플러그인 비교<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 벡터 검색 라이브러리와 벡터 데이터베이스의 차이점을 알아보았으니, 벡터 데이터베이스가 <strong>벡터 검색 플러그인과</strong> 어떻게 다른지 살펴봅시다.</p>
<p>점점 더 많은 전통적인 관계형 데이터베이스와 Clickhouse 및 <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch와</a> 같은 검색 시스템에서 벡터 검색 플러그인을 기본으로 포함하고 있습니다. 예를 들어, Elasticsearch 8.0에는 restful API 엔드포인트를 통해 호출할 수 있는 벡터 삽입 및 ANN 검색 기능이 포함되어 있습니다. <strong>이러한 솔루션은 임베딩 관리와 벡터 검색에 대한 풀스택 접근 방식을 취하지 않는다는</strong> 점에서 벡터 검색 플러그인의 문제는 밤낮으로 명확해야 합니다. 대신, 이러한 플러그인은 기존 아키텍처를 개선하기 위한 것이기 때문에 제한적이고 최적화되지 않습니다. 기존 데이터베이스 위에 비정형 데이터 애플리케이션을 개발하는 것은 가스 구동 자동차의 프레임 안에 리튬 배터리와 전기 모터를 장착하는 것과 같으며, 좋은 생각이 아닙니다!</p>
<p>그 이유를 설명하기 위해 벡터 데이터베이스가 구현해야 하는 기능 목록(첫 번째 섹션에서)으로 돌아가 보겠습니다. 벡터 검색 플러그인에는 이 중 두 가지 기능, 즉 조정 가능성과 사용자 친화적인 API/SDK가 빠져 있습니다. 다른 벡터 검색 플러그인도 매우 유사하게 작동하므로 더 이상 자세히 설명하지 않고 Elasticsearch의 ANN 엔진을 예로 들어 설명하겠습니다. Elasticsearch는 <code translate="no">dense_vector</code> 데이터 필드 유형을 통해 벡터 저장소를 지원하며 <code translate="no">knnsearch endpoint</code> 을 통해 쿼리할 수 있습니다:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Elasticsearch의 ANN 플러그인은 하나의 인덱싱 알고리즘만 지원합니다: 계층적 탐색이 가능한 작은 세계, 즉 HNSW라고도 합니다(멀티버스를 대중화하는 데 있어서는 제작자가 Marvel보다 앞서 있었다고 생각합니다). 게다가 거리 측정 기준으로는 L2/유클리드 거리만 지원됩니다. 시작은 괜찮지만 본격적인 벡터 데이터베이스인 Milvus와 비교해 보겠습니다. <code translate="no">pymilvus</code> 을 사용합니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch와 Milvus</a> 모두 인덱스 생성, 임베딩 벡터 삽입, 가장 가까운 이웃 검색을 수행하는 방법을 가지고 있지만, 이 예제를 통해 Milvus가 더 직관적인 벡터 검색 API(더 나은 사용자 인터페이스 API)와 더 광범위한 벡터 인덱스 + 거리 메트릭 지원(더 나은 조정 가능성)을 가지고 있다는 것을 알 수 있습니다. Milvus는 향후 더 많은 벡터 인덱스를 지원하고 SQL과 유사한 문을 통해 쿼리할 수 있도록 하여 조정 가능성과 사용성을 더욱 개선할 계획입니다.</p>
<p>방금 꽤 많은 내용을 설명했습니다. 이 섹션은 상당히 길기 때문에 대충 훑어보신 분들을 위해 간단히 요약하자면, Milvus는 처음부터 벡터 데이터베이스로 구축되어 더 풍부한 기능과 비정형 데이터에 더 적합한 아키텍처를 제공하므로 벡터 검색 플러그인보다 낫다는 것입니다.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">다양한 벡터 검색 기술 중에서 선택하는 방법은 무엇인가요?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>모든 벡터 데이터베이스가 똑같이 만들어지는 것은 아니며, 각 데이터베이스는 특정 애플리케이션에 맞는 고유한 특성을 가지고 있습니다. 벡터 검색 라이브러리와 플러그인은 사용자 친화적이며 수백만 개의 벡터가 있는 소규모 프로덕션 환경을 처리하는 데 이상적입니다. 데이터 크기가 작고 기본적인 벡터 검색 기능만 필요한 경우, 이러한 기술만으로도 충분합니다.</p>
<p>하지만 수억 개의 벡터를 다루고 실시간 응답을 요구하는 데이터 집약적인 비즈니스에는 전문 벡터 데이터베이스가 가장 적합한 선택이 될 것입니다. 예를 들어 Milvus는 수십억 개의 벡터를 손쉽게 관리할 수 있으며, 초고속 쿼리 속도와 풍부한 기능을 제공합니다. 또한 Zilliz와 같은 완전 관리형 솔루션은 운영상의 어려움에서 벗어나 핵심 비즈니스 활동에만 집중할 수 있어 더욱 유리합니다.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">벡터 데이터베이스 101 강좌를 다시 한 번 살펴보세요.<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">비정형 데이터 소개</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스란 무엇인가요?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">벡터 데이터베이스, 벡터 검색 라이브러리, 벡터 검색 플러그인 비교하기</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Milvus 소개</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Milvus 퀵스타트</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">벡터 유사도 검색 소개</a></li>
<li><a href="https://zilliz.com/blog/vector-index">벡터 인덱스 기본 사항 및 반전된 파일 인덱스</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">스칼라 정량화 및 제품 정량화</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">계층적 탐색 가능한 작은 세계(HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">대략적인 가장 가까운 이웃 오 예(ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">프로젝트에 적합한 벡터 인덱스 선택하기</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN과 바마나 알고리즘</a></li>
</ol>
