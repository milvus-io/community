---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: 문자열 데이터를 사용하여 유사도 검색 애플리케이션을 강화하는 방법
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: 문자열 데이터를 사용하여 자체 유사도 검색 애플리케이션을 구축하는 프로세스를 간소화할 수 있습니다.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>표지</span> </span></p>
<p>Milvus 2.1에는 Milvus 작업을 훨씬 더 쉽게 만들어주는 <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">몇 가지 중요한 업데이트가</a> 포함되어 있습니다. 그 중 하나가 바로 문자열 데이터 유형 지원입니다. 현재 Milvus는 문자열, 벡터, 부울, 정수, 부동 소수점 숫자 등의 <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">데이터 유형을 지원합니다</a>.</p>
<p>이 문서에서는 문자열 데이터 유형 지원에 대해 소개합니다. 이를 통해 무엇을 할 수 있는지, 어떻게 사용하는지 읽어보고 배워보세요.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">문자열 데이터로 무엇을 할 수 있나요?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">Milvus 2.1에서 문자열 데이터는 어떻게 관리하나요?</a><ul>
<li><a href="#Create-a-collection">컬렉션 만들기</a></li>
<li><a href="#Insert-data">데이터 삽입 및 삭제</a></li>
<li><a href="#Build-an-index">인덱스 구축</a></li>
<li><a href="#Hybrid-search">하이브리드 검색</a></li>
<li><a href="#String-expressions">문자열 표현식</a></li>
</ul></li>
</ul>
<custom-h1>문자열 데이터로 무엇을 할 수 있을까요?</custom-h1><p>문자열 데이터 유형 지원은 사용자들이 가장 기대했던 기능 중 하나였습니다. Milvus 벡터 데이터베이스로 애플리케이션을 구축하는 과정을 간소화하고 유사도 검색 및 벡터 쿼리 속도를 가속화하여 작업 중인 애플리케이션의 효율성을 크게 높이고 유지 관리 비용을 절감할 수 있습니다.</p>
<p>특히 Milvus 2.1은 다양한 길이의 문자 문자열을 저장하는 VARCHAR 데이터 유형을 지원합니다. VARCHAR 데이터 유형을 지원하면 다음과 같이 할 수 있습니다:</p>
<ol>
<li>외부 관계형 데이터베이스의 도움 없이 문자열 데이터를 직접 관리할 수 있습니다.</li>
</ol>
<p>밀버스에 데이터를 삽입할 때 문자열을 다른 데이터 유형으로 변환하는 단계를 생략할 수 있습니다. 온라인 서점을 위한 도서 검색 시스템을 개발 중이라고 가정해 보겠습니다. 도서 데이터 세트를 생성하고 있으며 이름으로 책을 식별하려고 합니다. Milvus가 문자열 데이터 유형을 지원하지 않는 이전 버전에서는 MIilvus에 데이터를 삽입하기 전에 먼저 MySQL과 같은 관계형 데이터베이스를 사용하여 문자열(책 이름)을 책 ID로 변환해야 할 수 있습니다. 지금은 문자열 데이터 유형이 지원되므로 문자열 필드를 생성하고 ID 번호 대신 책 이름을 직접 입력하면 됩니다.</p>
<p>이러한 편의성은 검색 및 쿼리 프로세스에도 적용됩니다. <em>헬로 밀버스라는</em> 책을 가장 좋아하는 고객이 있다고 가정해 봅시다. 시스템에서 비슷한 책을 검색하여 고객에게 추천하고 싶다고 가정해 보겠습니다. 이전 버전의 Milvus에서는 시스템에서 도서 ID만 반환하므로 관계형 데이터베이스에서 해당 도서 정보를 확인하기 위해 추가 단계를 수행해야 합니다. 하지만 Milvus 2.1에서는 책 이름이 포함된 문자열 필드를 이미 생성했기 때문에 책 이름을 직접 가져올 수 있습니다.</p>
<p>한마디로 문자열 데이터 유형을 지원하므로 문자열 데이터를 관리하기 위해 다른 도구를 사용할 필요가 없어 개발 프로세스가 크게 간소화됩니다.</p>
<ol start="2">
<li>속성 필터링을 통해 <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">하이브리드 검색</a> 및 <a href="https://milvus.io/docs/v2.1.x/query.md">벡터 쿼리</a> 속도를 가속화하세요.</li>
</ol>
<p>다른 스칼라 데이터 유형과 마찬가지로, VARCHAR는 부울 표현식을 통해 하이브리드 검색 및 벡터 쿼리에서 속성 필터링에 사용할 수 있습니다. 특히 Milvus 2.1에서는 접두사 매칭을 수행할 수 있는 <code translate="no">like</code> 연산자가 추가되었습니다. 또한 <code translate="no">==</code> 연산자를 사용하여 정확한 매칭을 수행할 수도 있습니다.</p>
<p>또한, 하이브리드 검색 및 쿼리를 가속화하기 위해 MARISA-trie 기반 역 인덱스가 지원됩니다. 계속해서 문자열 데이터로 속성 필터링을 수행하기 위해 알아야 할 모든 문자열 표현식을 읽어보고 알아보세요.</p>
<custom-h1>Milvus 2.1에서 문자열 데이터는 어떻게 관리하나요?</custom-h1><p>이제 문자열 데이터 유형이 매우 유용하다는 것을 알았지만, 자체 애플리케이션을 구축할 때 정확히 언제 이 데이터 유형을 사용해야 할까요? 다음에서는 문자열 데이터가 포함될 수 있는 시나리오의 몇 가지 코드 예시를 통해 Milvus 2.1에서 VARCHAR 데이터를 관리하는 방법을 더 잘 이해할 수 있습니다.</p>
<h2 id="Create-a-collection" class="common-anchor-header">컬렉션 만들기<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>이전 예제를 따라해 보겠습니다. 여전히 도서 추천 시스템에서 작업 중이며 <code translate="no">book_name</code> 이라는 기본 키 필드를 사용하여 문자열 데이터를 삽입할 도서 컬렉션을 만들고자 합니다. 이 경우 아래 예시와 같이 필드 스키마를 설정할 때 데이터 유형을 <code translate="no">DataType.VARCHAR</code>으로 설정할 수 있습니다.</p>
<p>VARCHAR 필드를 만들 때는 1에서 65,535 사이의 값을 사용할 수 있는 <code translate="no">max_length</code> 매개변수를 통해 최대 문자 길이를 지정해야 합니다.  이 예에서는 최대 길이를 200으로 설정했습니다.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">데이터 삽입<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 컬렉션이 생성되었으므로 컬렉션에 데이터를 삽입할 수 있습니다. 다음 예제에서는 무작위로 생성된 문자열 데이터 2,000행이 삽입됩니다.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">데이터 삭제<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">book_0</code> 및 <code translate="no">book_1</code> 이라는 이름의 책 두 권을 스토어에서 더 이상 사용할 수 없으므로 데이터베이스에서 관련 정보를 삭제하려고 한다고 가정해 보겠습니다. 이 경우 아래 예시와 같이 <code translate="no">in</code> 표현식을 사용하여 삭제할 엔티티를 필터링할 수 있습니다.</p>
<p>Milvus는 기본 키가 명확하게 지정된 엔티티만 삭제할 수 있으므로 다음 코드를 실행하기 전에 <code translate="no">book_name</code> 필드를 기본 키 필드로 설정했는지 확인하세요.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">색인 구축<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1은 문자열 필드의 필터링 속도를 크게 높여주는 스칼라 인덱스 구축을 지원합니다. 벡터 인덱스 구축과 달리, 스칼라 인덱스 구축 전에 매개변수를 준비할 필요가 없습니다. Milvus는 일시적으로 사전 트리(MARISA-trie) 인덱스만 지원하므로, VARCHAR 타입 필드의 인덱스 유형은 기본적으로 MARISA-trie입니다.</p>
<p>인덱스 생성 시 인덱스 이름을 지정할 수 있습니다. 지정하지 않으면 <code translate="no">index_name</code> 의 기본값은 <code translate="no">&quot;_default_idx_&quot;</code> 입니다. 아래 예제에서는 <code translate="no">scalar_index</code> 로 인덱스 이름을 지정했습니다.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">하이브리드 검색<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>부울 표현식을 지정하면 벡터 유사도 검색 중에 문자열 필드를 필터링할 수 있습니다.</p>
<p>예를 들어 헬로 밀버스와 가장 유사한 소개를 가진 책을 검색하되 이름이 'book_2'로 시작하는 책만 가져오려면 아래 예와 같이 <code translate="no">like</code>연산자를 사용하여 접두사 일치를 수행하여 대상 책을 가져올 수 있습니다.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">문자열 표현식<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>새로 추가된 연산자 <code translate="no">like</code> 외에도 이전 버전의 Milvus에서 이미 지원되던 다른 연산자도 문자열 필드 필터링에 사용할 수 있습니다. 다음은 일반적으로 사용되는 <a href="https://milvus.io/docs/v2.1.x/boolean.md">문자열 표현식의</a> 몇 가지 예입니다. <code translate="no">A</code> 는 VARCHAR 유형의 필드를 나타냅니다. 아래의 모든 문자열 표현식은 AND, OR, NOT과 같은 논리 연산자를 사용하여 논리적으로 결합할 수 있다는 점을 기억하세요.</p>
<h3 id="Set-operations" class="common-anchor-header">집합 연산</h3><p><code translate="no">in</code> 및 <code translate="no">not in</code> 을 사용하여 <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code> 과 같은 집합 연산을 구현할 수 있습니다.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">두 문자열 필드 비교</h3><p>관계형 연산자를 사용하여 두 문자열 필드의 값을 비교할 수 있습니다. 이러한 관계형 연산자에는 <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> 등이 있습니다. 자세한 내용은 <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">관계형 연산자를</a> 참조하세요.</p>
<p>문자열 필드는 다른 데이터 유형의 필드가 아닌 다른 문자열 필드와만 비교할 수 있습니다. 예를 들어 VARCHAR 타입의 필드는 부울 타입의 필드나 정수 타입의 필드와 비교할 수 없습니다.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">상수 값과 필드 비교</h3><p><code translate="no">==</code> 또는 <code translate="no">!=</code> 을 사용하여 필드 값이 상수 값과 같은지 확인할 수 있습니다.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">단일 범위로 필드 필터링</h3><p><code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> 을 사용하여 <code translate="no">A &gt; &quot;str1&quot;</code> 과 같이 단일 범위의 문자열 필드를 필터링할 수 있습니다.</p>
<h3 id="Prefix-matching" class="common-anchor-header">접두사 일치</h3><p>앞서 언급했듯이 Milvus 2.1에서는 <code translate="no">A like &quot;prefix%&quot;</code> 과 같은 접두사 일치를 위해 <code translate="no">like</code> 연산자를 추가했습니다.</p>
<h2 id="Whats-next" class="common-anchor-header">다음 업데이트<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1의 공식 출시와 함께 새로운 기능을 소개하는 블로그 시리즈를 준비했습니다. 이 블로그 시리즈에서 자세히 읽어보세요:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">문자열 데이터를 사용해 유사도 검색 애플리케이션을 강화하는 방법</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">임베디드 Milvus를 사용하여 Python으로 Milvus 즉시 설치 및 실행하기</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">인메모리 복제본으로 벡터 데이터베이스 읽기 처리량 늘리기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기(2부)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 데이터베이스는 어떻게 데이터 보안을 보장하나요?</a></li>
</ul>
