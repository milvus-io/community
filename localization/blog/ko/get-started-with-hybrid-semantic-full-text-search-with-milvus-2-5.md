---
id: get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
title: Milvus 2.5로 하이브리드 시맨틱/전체 텍스트 검색 시작하기
author: Stefan Webb
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Full_Text_Search_with_Milvus_2_5_7ba74461be.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
---
<p>이 문서에서는 새로운 전체 텍스트 검색 기능을 빠르게 실행하고 벡터 임베딩을 기반으로 하는 기존의 시맨틱 검색과 결합하는 방법을 보여드리겠습니다.</p>
<h2 id="Requirement" class="common-anchor-header">요구 사항<button data-href="#Requirement" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저, Milvus 2.5를 설치했는지 확인하세요:</p>
<pre><code translate="no">pip install -U pymilvus[model]
<button class="copy-code-btn"></button></code></pre>
<p>를 설치하고 Milvus <a href="https://milvus.io/docs/prerequisite-docker.md">문서의 설치 지침에</a> 따라 로컬 컴퓨터에서 Milvus Standalone 인스턴스를 실행 중이어야 합니다.</p>
<h2 id="Building-the-Data-Schema-and-Search-Indices" class="common-anchor-header">데이터 스키마 및 검색 인덱스 구축<button data-href="#Building-the-Data-Schema-and-Search-Indices" class="anchor-icon" translate="no">
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
    </button></h2><p>필요한 클래스와 함수를 가져옵니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">Function</span>, <span class="hljs-title class_">FunctionType</span>, model
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 2.5에 새로 추가된 두 가지 항목( <code translate="no">Function</code> 및 <code translate="no">FunctionType</code>)을 보셨을 텐데요, 곧 설명해 드리겠습니다.</p>
<p>다음으로 Milvus Standalone, 즉 로컬에서 데이터베이스를 열고 데이터 스키마를 생성합니다. 스키마는 정수 기본 키, 텍스트 문자열, 차원 384의 고밀도 벡터, 스파스 벡터(무제한 차원)로 구성됩니다. Milvus Lite는 현재 전체 텍스트 검색을 지원하지 않으며 Milvus Standalone과 Milvus Distributed만 지원합니다.</p>
<pre><code translate="no">client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema()

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;dense&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.VARCHAR: <span class="hljs-number">21</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;max_length&#x27;</span>: <span class="hljs-number">1000</span>, <span class="hljs-string">&#x27;enable_analyzer&#x27;</span>: <span class="hljs-literal">True</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;dense&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">768</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;sparse&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.SPARSE_FLOAT_VECTOR: <span class="hljs-number">104</span>&gt;}], <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">False</span>}
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">enable_analyzer=True</code> 매개변수를 보셨을 것입니다. 이는 Milvus 2.5가 이 필드에서 어휘 파서를 활성화하고 전체 텍스트 검색에 필요한 토큰 및 토큰 빈도 목록을 작성하도록 지시합니다. <code translate="no">sparse</code> 필드는 <code translate="no">text</code> 구문 분석에서 생성된 단어의 가방으로 문서의 벡터 표현을 보유하게 됩니다.</p>
<p>하지만 <code translate="no">text</code> 와 <code translate="no">sparse</code> 필드를 어떻게 연결하고 <code translate="no">sparse</code> 를 <code translate="no">text</code> 에서 어떻게 계산해야 하는지 Milvus에게 알려줄까요? 바로 여기에서 <code translate="no">Function</code> 객체를 호출하여 스키마에 추가해야 합니다:</p>
<pre><code translate="no">bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>, <span class="hljs-comment"># Function name</span>
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Name of the VARCHAR field containing raw text data</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Name of the SPARSE_FLOAT_VECTOR field reserved to store generated embeddings</span>
    function_type=FunctionType.BM25,
)

schema.add_function(bm25_function)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.VARCHAR: <span class="hljs-number">21</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;max_length&#x27;</span>: <span class="hljs-number">1000</span>, <span class="hljs-string">&#x27;enable_analyzer&#x27;</span>: <span class="hljs-literal">True</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;dense&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">768</span>}}, {<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;sparse&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.SPARSE_FLOAT_VECTOR: <span class="hljs-number">104</span>&gt;, <span class="hljs-string">&#x27;is_function_output&#x27;</span>: <span class="hljs-literal">True</span>}], <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&#x27;functions&#x27;</span>: [{<span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;text_bm25_emb&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;FunctionType.BM25: <span class="hljs-number">1</span>&gt;, <span class="hljs-string">&#x27;input_field_names&#x27;</span>: [<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;output_field_names&#x27;</span>: [<span class="hljs-string">&#x27;sparse&#x27;</span>], <span class="hljs-string">&#x27;params&#x27;</span>: {}}]}
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">Function</code> 객체의 추상화는 전체 텍스트 검색을 적용하는 것보다 더 일반적입니다. 향후에는 한 필드가 다른 필드의 함수여야 하는 다른 경우에도 사용될 수 있습니다. 저희의 경우 <code translate="no">FunctionType.BM25</code> 함수를 통해 <code translate="no">sparse</code> 이 <code translate="no">text</code> 의 함수임을 지정합니다. <code translate="no">BM25</code> 은 문서와 쿼리의 유사성을 계산하는 데 사용되는 정보 검색의 일반적인 메트릭(문서 모음 기준)을 나타냅니다.</p>
<p>Milvus에서는 기본 임베딩 모델인 <a href="https://huggingface.co/GPTCache/paraphrase-albert-small-v2">paraphrase-albert-small-v2를</a> 사용합니다:</p>
<pre><code translate="no">embedding_fn = model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>다음 단계는 검색 인덱스를 추가하는 것입니다. 밀도 벡터용 인덱스와 스파스 벡터용 인덱스가 따로 있습니다. 전체 텍스트 검색에는 표준 고밀도 벡터와는 다른 검색 방법이 필요하므로 인덱스 유형은 <code translate="no">SPARSE_INVERTED_INDEX</code> 와 <code translate="no">BM25</code> 입니다.</p>
<pre><code translate="no">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()

index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, 
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, 
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>마지막으로 컬렉션을 생성합니다:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_collection</span>(<span class="hljs-string">&#x27;demo&#x27;</span>)
client.<span class="hljs-title function_">list_collections</span>()
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)

client.<span class="hljs-title function_">list_collections</span>()
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-string">&#x27;demo&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>이제 텍스트 문서를 받아들이고 시맨틱 및 전체 텍스트 검색을 수행할 수 있는 빈 데이터베이스가 설정되었습니다!</p>
<h2 id="Inserting-Data-and-Performing-Full-Text-Search" class="common-anchor-header">데이터 삽입 및 전체 텍스트 검색 수행하기<button data-href="#Inserting-Data-and-Performing-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터 삽입은 이전 버전의 Milvus와 다르지 않습니다:</p>
<pre><code translate="no">docs = [
    <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>,
    <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>,
    <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>
]

embeddings = embedding_fn(docs)

client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: doc, <span class="hljs-string">&#x27;dense&#x27;</span>: vec} <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(docs, embeddings)
])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">454387371651630485</span>, <span class="hljs-number">454387371651630486</span>, <span class="hljs-number">454387371651630487</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>하이브리드 검색으로 넘어가기 전에 먼저 전체 텍스트 검색을 예시해 보겠습니다:</p>
<pre><code translate="no">search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: 0.2},
}

results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;whats the focus of information retrieval?&#x27;</span>],
    output_fields=[<span class="hljs-string">&#x27;text&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    <span class="hljs-built_in">limit</span>=3,
    search_params=search_params
)
<button class="copy-code-btn"></button></code></pre>
<p>검색 매개변수 <code translate="no">drop_ratio_search</code> 는 검색 알고리즘 중에 삭제할 점수가 낮은 문서의 비율을 나타냅니다.</p>
<p>결과를 확인해 보겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(hit)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630485</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">1.3352930545806885</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630486</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.29726022481918335</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630487</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.2715056240558624</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Performing-Hybrid-Semantic-and-Full-Text-Search" class="common-anchor-header">하이브리드 시맨틱 및 전체 텍스트 검색 수행하기<button data-href="#Performing-Hybrid-Semantic-and-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 지금까지 배운 내용을 결합하여 별도의 시맨틱 검색과 전체 텍스트 검색을 결합하는 하이브리드 검색을 리랭커와 함께 수행해 보겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
query = <span class="hljs-string">&#x27;whats the focus of information retrieval?&#x27;</span>
query_dense_vector = <span class="hljs-title function_">embedding_fn</span>([query])

search_param_1 = {
    <span class="hljs-string">&quot;data&quot;</span>: query_dense_vector,
    <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;dense&quot;</span>,
    <span class="hljs-string">&quot;param&quot;</span>: {
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    },
    <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">3</span>
}
request_1 = <span class="hljs-title class_">AnnSearchRequest</span>(**search_param_1)

search_param_2 = {
    <span class="hljs-string">&quot;data&quot;</span>: [query],
    <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;sparse&quot;</span>,
    <span class="hljs-string">&quot;param&quot;</span>: {
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;drop_ratio_build&quot;</span>: <span class="hljs-number">0.0</span>}
    },
    <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">3</span>
}
request_2 = <span class="hljs-title class_">AnnSearchRequest</span>(**search_param_2)

reqs = [request_1, request_2]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">ranker = RRFRanker()

res = client.hybrid_search(
    collection_name=<span class="hljs-string">&quot;demo&quot;</span>,
    output_fields=[<span class="hljs-string">&#x27;text&#x27;</span>],
    reqs=reqs,
    ranker=ranker,
    <span class="hljs-built_in">limit</span>=3
)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> res[0]:
    <span class="hljs-built_in">print</span>(hit)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630485</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.032786883413791656</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval is a field of study.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630486</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.032258063554763794</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;information retrieval focuses on finding relevant information in large datasets.&#x27;</span>}}
{<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">454387371651630487</span>, <span class="hljs-string">&#x27;distance&#x27;</span>: <span class="hljs-number">0.0317460335791111</span>, <span class="hljs-string">&#x27;entity&#x27;</span>: {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;data mining and information retrieval overlap in research.&#x27;</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>이미 눈치채셨겠지만, 이것은 두 개의 개별 시맨틱 필드가 있는 하이브리드 검색과 다르지 않습니다(Milvus 2.4부터 사용 가능). 이 간단한 예에서 결과는 전체 텍스트 검색과 동일하지만, 대규모 데이터베이스 및 키워드별 검색의 경우 일반적으로 하이브리드 검색의 회상률이 더 높습니다.</p>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 Milvus 2.5로 전체 텍스트 및 하이브리드 시맨틱/전체 텍스트 검색을 수행하는 데 필요한 모든 지식을 갖추게 되었습니다. 전체 텍스트 검색의 작동 방식과 전체 텍스트 검색이 시맨틱 검색을 보완하는 이유에 대한 자세한 논의는 다음 문서를 참조하세요:</p>
<ul>
<li><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5 소개: 전체 텍스트 검색, 더욱 강력해진 메타데이터 필터링, 사용성 개선!</a></li>
<li><a href="https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md">시맨틱 검색 대 전체 텍스트 검색: Milvus 2.5에서는 어떤 것을 선택해야 할까요?</a></li>
</ul>
