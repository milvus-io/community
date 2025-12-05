---
id: data-in-and-data-out-in-milvus-2-6.md
title: '임베딩 기능을 소개합니다: Milvus 2.6이 벡터화 및 시맨틱 검색을 간소화하는 방법'
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  Milvus 2.6이 데이터 인, 데이터 아웃을 통해 임베딩 프로세스와 벡터 검색을 간소화하는 방법을 알아보세요. 임베딩과 순위 변경을
  자동으로 처리하므로 외부 전처리가 필요 없습니다.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>벡터 검색 애플리케이션을 구축해 본 적이 있다면 이미 워크플로우에 대해 잘 알고 계실 것입니다. 데이터를 저장하기 전에 먼저 임베딩 모델을 사용하여 데이터를 벡터로 변환하고, 정리 및 포맷을 지정한 다음, 마지막으로 벡터 데이터베이스에 수집해야 합니다. 모든 쿼리도 입력을 임베드하고 유사성 검색을 실행한 다음 결과 ID를 원본 문서나 레코드에 다시 매핑하는 동일한 과정을 거칩니다. 이 방법은 효과가 있지만 전처리 스크립트, 임베딩 파이프라인, 글루 코드가 분산되어 있어 유지 관리해야 합니다.</p>
<p>고성능 오픈 소스 벡터 데이터베이스인<a href="https://milvus.io/">Milvus는</a> 이제 이 모든 것을 간소화하기 위한 중요한 단계를 밟고 있습니다. <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6에는</a> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>임베딩 기능</strong></a> <strong>이라고도 하는 데이터 인, 데이터 아웃</strong> 기능이 도입되어 OpenAI, AWS Bedrock, Google Vertex AI, Hugging Face와 같은 주요 모델 제공업체에 직접 연결할 수 있는 임베딩 기능이 내장되어 있습니다. 이제 자체 임베딩 인프라를 관리하는 대신 Milvus가 이러한 모델을 대신 호출할 수 있습니다. 또한 원시 텍스트(그리고 곧 다른 데이터 유형)를 사용하여 삽입하고 쿼리할 수 있으며, Milvus는 쓰기 및 쿼리 시점에 벡터화를 자동으로 처리합니다.</p>
<p>이 글의 나머지 부분에서는 데이터 입력, 데이터 출력의 내부 작동 방식, 공급자 및 임베딩 함수를 구성하는 방법, 그리고 이를 사용하여 벡터 검색 워크플로를 엔드투엔드로 간소화하는 방법에 대해 자세히 살펴보겠습니다.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">데이터 인, 데이터 아웃이란 무엇인가요?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6의 데이터 인, 데이터 아웃은 외부 전처리 서비스 없이 데이터 변환과 임베딩 생성을 내부적으로 처리할 수 있는 프레임워크인 새로운 함수 모듈을 기반으로 합니다. (디자인 제안은 <a href="https://github.com/milvus-io/milvus/issues/35856">깃허브 이슈 #35856에서</a> 확인할 수 있습니다.) 이 모듈을 통해 Milvus는 원시 입력 데이터를 가져와 임베딩 공급자를 직접 호출하고 결과 벡터를 자동으로 컬렉션에 기록할 수 있습니다.</p>
<p><strong>함수</strong> 모듈은 높은 수준에서 임베딩 생성을 기본 데이터베이스 기능으로 전환합니다. 별도의 임베딩 파이프라인, 백그라운드 워커 또는 리랭커 서비스를 실행하는 대신, Milvus는 이제 구성된 제공자에게 요청을 전송하고 임베딩을 검색한 다음 데이터와 함께 저장하는 작업을 모두 수집 경로 내에서 수행합니다. 따라서 자체 임베딩 인프라를 관리하는 데 따른 운영 오버헤드가 제거됩니다.</p>
<p>데이터 인, 데이터 아웃은 Milvus 워크플로우에 세 가지 주요 개선 사항을 도입합니다:</p>
<ul>
<li><p><strong>원시 데이터 직접 삽입</strong> - 이제 처리되지 않은 텍스트, 이미지 또는 기타 데이터 유형을 Milvus에 직접 삽입할 수 있습니다. 미리 벡터로 변환할 필요가 없습니다.</p></li>
<li><p><strong>하나의 임베딩 기능 구성</strong> - Milvus에서 임베딩 모델을 구성하면 전체 임베딩 프로세스를 자동으로 관리합니다. Milvus는 OpenAI, AWS Bedrock, Google Vertex AI, Cohere, Hugging Face 등 다양한 모델 제공업체와 원활하게 통합됩니다.</p></li>
<li><p>원시<strong>입력으로 쿼리</strong> - 이제 원시 텍스트 또는 기타 콘텐츠 기반 쿼리를 사용하여 시맨틱 검색을 수행할 수 있습니다. Milvus는 구성된 동일한 모델을 사용하여 임베딩을 즉시 생성하고 유사성 검색을 수행하며 관련 결과를 반환합니다.</p></li>
</ul>
<p>간단히 말해, Milvus는 이제 데이터를 자동으로 임베드하고 선택적으로 순위를 재조정합니다. 벡터화는 데이터베이스에 내장된 기능이므로 외부 임베딩 서비스나 사용자 지정 전처리 로직이 필요하지 않습니다.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">데이터 인, 데이터 아웃의 작동 방식<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>아래 다이어그램은 Milvus 내에서 데이터 인, 데이터 아웃이 작동하는 방식을 보여줍니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>데이터 인, 데이터 아웃 워크플로는 6가지 주요 단계로 나눌 수 있습니다:</p>
<ol>
<li><p><strong>데이터 입력</strong> - 사용자가 텍스트, 이미지 또는 기타 콘텐츠 유형과 같은 원시 데이터를 외부 전처리 없이 Milvus에 직접 삽입합니다.</p></li>
<li><p>임베딩<strong>생성</strong> - 함수 모듈은 타사 API를 통해 구성된 임베딩 모델을 자동으로 호출하여 원시 입력을 실시간으로 벡터 임베딩으로 변환합니다.</p></li>
<li><p>임베딩<strong>저장</strong> - Milvus는 생성된 임베딩을 컬렉션 내의 지정된 벡터 필드에 기록하여 유사도 검색 작업에 사용할 수 있도록 합니다.</p></li>
<li><p><strong>쿼리 제출</strong> - 사용자가 입력 단계와 마찬가지로 Milvus에 원시 텍스트 또는 콘텐츠 기반 쿼리를 발행합니다.</p></li>
<li><p>시맨틱<strong>검색</strong> - Milvus는 구성된 동일한 모델을 사용하여 쿼리를 임베드하고 저장된 벡터에 대해 유사성 검색을 실행하여 가장 가까운 시맨틱 일치 항목을 결정합니다.</p></li>
<li><p><strong>결과 반환</strong> - Milvus는 원본 데이터에 다시 매핑된 가장 유사한 상위 k개의 결과를 애플리케이션에 직접 반환합니다.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">데이터 입력, 데이터 출력 구성 방법<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><ul>
<li><p>최신 버전의 <strong>Milvus 2.6을</strong> 설치합니다.</p></li>
<li><p>지원되는 제공업체(예: OpenAI, AWS Bedrock 또는 Cohere)에서 임베딩 API 키를 준비합니다. 이 예제에서는 임베딩 제공업체로 <strong>Cohere를</strong> 사용합니다.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header"><code translate="no">milvus.yaml</code> 구성 수정</h3><p><strong>Docker Compose와</strong> 함께 Milvus를 실행하는 경우, <code translate="no">milvus.yaml</code> 파일을 수정하여 Function 모듈을 활성화해야 합니다. 지침은 공식 문서를 참조하세요: (다른 배포 방법에 대한 지침은 여기에서 확인할 수 있습니다).</p>
<p>구성 파일에서 <code translate="no">credential</code> 및 <code translate="no">function</code> 섹션을 찾습니다.</p>
<p>그런 다음 <code translate="no">apikey1.apikey</code> 및 <code translate="no">providers.cohere</code> 필드를 업데이트합니다.</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>이러한 변경이 완료되면 Milvus를 다시 시작하여 업데이트된 구성을 적용합니다.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">데이터 입력, 데이터 출력 기능 사용 방법<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. 컬렉션에 대한 스키마 정의</h3><p>임베딩 기능을 사용하려면 <strong>컬렉션 스키마에</strong> 최소 3개의 필드가 포함되어야 합니다:</p>
<ul>
<li><p><strong>기본 키 필드(</strong><code translate="no">id</code> ) - 컬렉션의 각 엔티티를 고유하게 식별합니다.</p></li>
<li><p><strong>스칼라 필드(</strong><code translate="no">document</code> ) - 원본 원시 데이터를 저장합니다.</p></li>
<li><p><strong>벡터 필드 (</strong><code translate="no">dense</code> ) - 생성된 벡터 임베딩을 저장합니다.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. 임베딩 함수 정의하기</h3><p>다음으로 스키마에서 <strong>임베딩 함수를</strong> 정의합니다.</p>
<ul>
<li><p><code translate="no">name</code> - 함수에 대한 고유 식별자입니다.</p></li>
<li><p><code translate="no">function_type</code> - 텍스트 임베딩의 경우 <code translate="no">FunctionType.TEXTEMBEDDING</code> 로 설정합니다. Milvus는 <code translate="no">FunctionType.BM25</code> 및 <code translate="no">FunctionType.RERANK</code> 과 같은 다른 함수 유형도 지원합니다. 자세한 내용은 <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">전체 텍스트 검색</a> 및 <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">감쇠 랭커 개요를</a> 참조하세요.</p></li>
<li><p><code translate="no">input_field_names</code> - 원시 데이터의 입력 필드를 정의합니다(<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - 벡터 임베딩이 저장될 출력 필드를 정의합니다 (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - 임베딩 함수에 대한 구성 매개변수를 포함합니다. <code translate="no">provider</code> 및 <code translate="no">model_name</code> 의 값은 <code translate="no">milvus.yaml</code> 구성 파일의 해당 항목과 일치해야 합니다.</p></li>
</ul>
<p><strong>참고:</strong> 각 함수는 서로 다른 변환 로직을 구분하고 충돌을 방지하기 위해 고유한 <code translate="no">name</code> 및 <code translate="no">output_field_names</code> 을 가져야 합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. 색인 구성</h3><p>필드와 함수가 정의되면 컬렉션에 대한 인덱스를 만듭니다. 여기서는 간단하게 하기 위해 AUTOINDEX 유형을 예로 사용합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. 컬렉션 만들기</h3><p>정의된 스키마와 인덱스를 사용하여 새 컬렉션을 만듭니다. 이 예에서는 Demo라는 이름의 컬렉션을 만들겠습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. 데이터 삽입</h3><p>이제 임베딩을 수동으로 생성할 필요 없이 원시 데이터를 Milvus에 직접 삽입할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. 벡터 검색 수행</h3><p>데이터를 삽입한 후 원시 텍스트 쿼리를 사용하여 직접 검색을 수행할 수 있습니다. Milvus는 자동으로 쿼리를 임베딩으로 변환하고, 저장된 벡터를 대상으로 유사도 검색을 수행하여 가장 일치하는 항목을 반환합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>벡터 검색에 대한 자세한 내용은 벡터 검색을 참조하세요: <a href="https://milvus.io/docs/single-vector-search.md">기본 벡터 검색 </a>및 <a href="https://milvus.io/docs/get-and-scalar-query.md">쿼리 API를</a> 참조하세요.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Milvus 2.6 시작하기<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터 인, 데이터 아웃을 통해 Milvus 2.6은 벡터 검색의 단순성을 한 단계 더 끌어올렸습니다. 임베딩 및 리랭크 기능이 Milvus 내에 직접 통합되어 더 이상 외부 전처리를 관리하거나 별도의 임베딩 서비스를 유지할 필요가 없습니다.</p>
<p>사용해 볼 준비가 되셨나요? 지금 바로 <a href="https://milvus.io/docs">Milvus</a> 2.6을 설치하여 데이터 인, 데이터 아웃의 강력한 기능을 직접 경험해 보세요.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내, 질문에 대한 답변을 얻을 수도 있습니다.</p>
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
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus의 JSON 파쇄: 유연성을 갖춘 88.9배 빠른 JSON 필터링</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">진정한 엔티티 수준 검색을 실현합니다: Milvus의 새로운 배열 구조 및 MAX_SIM 기능</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus의 MinHash LSH: LLM 훈련 데이터의 중복을 방지하는 비밀 무기 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">벤치마크는 거짓말 - 벡터 DB는 실제 테스트가 필요합니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Milvus를 위해 카프카/펄서를 딱따구리로 대체했습니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">실제 환경에서의 벡터 검색: 리콜을 죽이지 않고 효율적으로 필터링하는 방법 </a></p></li>
</ul>
