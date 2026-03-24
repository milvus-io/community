---
id: milvus-boost-ranker-business-aware-vector-search.md
title: 비즈니스 인식 벡터 검색을 위한 밀버스 부스트 랭커 사용 방법
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  밀버스 부스트 랭커를 통해 벡터 유사성 위에 비즈니스 규칙을 레이어링하여 공식 문서를 강화하고, 오래된 콘텐츠를 강등하고, 다양성을 추가하는
  방법을 알아보세요.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>벡터 검색은 유사성을 포함시켜 결과의 순위를 매기는 방식으로, 벡터가 가까울수록 결과가 높아집니다. 일부 시스템에서는 모델 기반 재랭커(BGE, Voyage, Cohere)를 추가하여 순서를 개선하기도 합니다. 그러나 두 가지 접근 방식 모두 <strong>비즈니스 컨텍스트가 의미적 관련성만큼, 때로는 그 이상 중요하다는</strong> 근본적인 요구 사항을 처리하지 못합니다 <strong>.</strong></p>
<p>이커머스 사이트는 공식 매장의 재고 상품을 먼저 노출해야 합니다. 콘텐츠 플랫폼은 최근 공지 사항을 고정하고 싶어합니다. 기업 지식창고에는 권위 있는 문서가 상단에 표시되어야 합니다. 벡터 거리에만 의존하여 순위를 매기면 이러한 규칙은 무시됩니다. 결과는 관련성이 있을 수 있지만 적절하지 않습니다.</p>
<p><a href="https://milvus.io/intro">Milvus</a> 2.6에 도입된<strong><a href="https://milvus.io/docs/reranking.md">부스트 랭커는</a></strong> 이 문제를 해결합니다. 인덱스 재구축이나 모델 변경 없이 메타데이터 규칙을 사용해 검색 결과 순위를 조정할 수 있습니다. 이 문서에서는 작동 방식, 사용 시기, 코드로 구현하는 방법에 대해 설명합니다.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">부스트 랭커란 무엇인가요?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>부스트 랭커는</strong> 스칼라 메타데이터 필드를 사용하여 <a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색</a> 결과를 조정하는<strong>Milvus 2.6.2의 경량 규칙 기반 재랭크 기능입니다</strong>. 외부 LLM이나 임베딩 서비스를 호출하는 모델 기반 재랭커와 달리, Boost Ranker는 간단한 필터 및 가중치 규칙을 사용하여 Milvus 내부에서 완전히 작동합니다. 외부 종속성이 없고 지연 시간 오버헤드가 최소화되어 실시간 사용에 적합합니다.</p>
<p><a href="https://milvus.io/docs/manage-functions.md">함수 API를</a> 통해 구성할 수 있습니다. 벡터 검색이 후보 세트를 반환한 후 Boost Ranker는 세 가지 작업을 적용합니다:</p>
<ol>
<li><strong>필터:</strong> 특정 조건(예: <code translate="no">is_official == true</code>)과 일치하는 결과를 식별합니다.</li>
<li><strong>부스트:</strong> 점수에 구성된 가중치를 곱합니다.</li>
<li><strong>셔플:</strong> 선택적으로 작은 무작위 계수(0-1)를 추가하여 다양성을 도입합니다.</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">내부 작동 방식</h3><p>부스트 랭커는 Milvus 내부에서 후처리 단계로 실행됩니다:</p>
<ol>
<li><strong>벡터 검색</strong> - 각 세그먼트는 ID, 유사도 점수, 메타데이터가 포함된 후보를 반환합니다.</li>
<li><strong>규칙 적용</strong> - 시스템이 일치하는 레코드를 필터링하고 구성된 가중치와 선택 사항인 <code translate="no">random_score</code> 을 사용하여 점수를 조정합니다.</li>
<li><strong>병합 및 정렬</strong> - 모든 후보를 합치고 업데이트된 점수에 따라 다시 정렬하여 최종 Top-K 결과를 생성합니다.</li>
</ol>
<p>부스트 랭커는 전체 데이터 세트가 아닌 이미 검색된 후보자에 대해서만 작동하므로 추가 계산 비용은 무시할 수 있을 정도로 적습니다.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">부스트 랭커는 언제 사용해야 하나요?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">중요한 결과 부스팅</h3><p>가장 일반적인 사용 사례: 시맨틱 검색 위에 간단한 비즈니스 규칙을 계층화합니다.</p>
<ul>
<li><strong>전자상거래:</strong> 플래그십 스토어, 공식 판매자 또는 유료 프로모션의 제품을 부스트하세요. 최근 판매량이나 클릭률이 높은 항목을 더 높게 표시하세요.</li>
<li><strong>콘텐츠 플랫폼:</strong> <code translate="no">publish_time</code> 필드를 통해 최근에 게시된 콘텐츠의 우선순위를 지정하거나 인증된 계정의 게시물을 부스트하세요.</li>
<li><strong>엔터프라이즈 검색:</strong> <code translate="no">doctype == &quot;policy&quot;</code> 또는 <code translate="no">is_canonical == true</code> 이 있는 문서에 더 높은 우선 순위를 부여합니다.</li>
</ul>
<p>모두 필터 + 가중치로 구성할 수 있습니다. 임베딩 모델을 변경하거나 인덱스를 다시 빌드하지 않습니다.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">제거하지 않고 강등</h3><p>부스트 랭커는 특정 결과의 순위를 낮출 수도 있습니다. 하드 필터링보다 더 부드러운 대안입니다.</p>
<ul>
<li><strong>재고가 적은 제품:</strong> <code translate="no">stock &lt; 10</code>, 가중치를 약간 줄입니다. 여전히 검색 가능하지만 상위 순위를 차지하지는 않습니다.</li>
<li><strong>민감한 콘텐츠:</strong> 플래그가 지정된 콘텐츠의 가중치를 완전히 제거하는 대신 낮춥니다. 엄격한 검열 없이 노출을 제한합니다.</li>
<li><strong>오래된 문서:</strong> <code translate="no">year &lt; 2020</code> 의 문서 순위가 낮아져 최신 콘텐츠가 먼저 표시됩니다.</li>
</ul>
<p>사용자는 여전히 스크롤하거나 더 정밀하게 검색하여 강등된 결과를 찾을 수 있지만, 더 관련성 높은 콘텐츠가 밀려나지는 않습니다.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">무작위성을 제어하여 다양성 추가하기</h3><p>많은 결과의 점수가 비슷하면 상위-K가 여러 쿼리에서 동일하게 보일 수 있습니다. 부스트 랭커의 <code translate="no">random_score</code> 매개변수는 약간의 변형을 도입합니다:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: 재현성을 위해 전반적인 무작위성을 제어합니다.</li>
<li><code translate="no">field</code>일반적으로 기본 키 <code translate="no">id</code> 는 동일한 레코드가 매번 동일한 무작위 값을 갖도록 합니다.</li>
</ul>
<p>이는 <strong>추천을 다양화</strong> (항상 같은 항목이 먼저 표시되는 것을 방지)하고 <strong>탐색</strong> (고정된 비즈니스 가중치와 작은 무작위 변동을 결합)하는 데 유용합니다.</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">부스트 랭커와 다른 랭커 결합하기</h3><p>부스트 랭커는 함수 API를 통해 <code translate="no">params.reranker = &quot;boost&quot;</code> 로 설정합니다. 결합에 대해 알아야 할 두 가지 사항이 있습니다:</p>
<ul>
<li><strong>제한 사항:</strong> 하이브리드(멀티벡터) 검색에서 부스트 랭커는 최상위 랭커가 될 수 없습니다. 하지만 각 개별 <code translate="no">AnnSearchRequest</code> 내에서 병합되기 전에 결과를 조정하는 데 사용할 수 있습니다.</li>
<li><strong>일반적인 조합:</strong><ul>
<li><strong>RRF + Boost:</strong> RRF를 사용하여 다중 모드 결과를 병합한 다음 메타데이터 기반 미세 조정을 위해 Boost를 적용합니다.</li>
<li><strong>모델 랭커 + Boost:</strong> 시맨틱 품질에는 모델 기반 랭커를 사용한 다음 비즈니스 규칙에는 Boost를 사용합니다.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">부스트 랭커를 구성하는 방법<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>부스트 랭커는 함수 API를 통해 구성됩니다. 보다 복잡한 로직의 경우 <code translate="no">FunctionScore</code> 와 결합하여 여러 규칙을 함께 적용하세요.</p>
<h3 id="Required-Fields" class="common-anchor-header">필수 필드</h3><p><code translate="no">Function</code> 객체를 생성할 때</p>
<ul>
<li><code translate="no">name</code>: 임의의 사용자 지정 이름</li>
<li><code translate="no">input_field_names</code>: 빈 목록이어야 함 <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>로 설정된 <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>여야합니다. <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">주요 매개변수</h3><p><strong><code translate="no">params.weight</code> (필수)</strong></p>
<p>일치하는 레코드의 점수에 적용되는 승수입니다. 설정 방법은 지표에 따라 다릅니다:</p>
<table>
<thead>
<tr><th>메트릭 유형</th><th>결과 부스트하려면</th><th>결과를 낮추려면</th></tr>
</thead>
<tbody>
<tr><td>높을수록 좋음(COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>낮을수록 좋음(L2/유클리드)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (선택 사항)</strong></p>
<p>점수를 조정할 레코드를 선택하는 조건입니다:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>일치하는 레코드만 영향을 받습니다. 다른 모든 레코드는 원래 점수를 유지합니다.</p>
<p><strong><code translate="no">params.random_score</code> (선택 사항)</strong></p>
<p>다양성을 위해 0과 1 사이의 임의 값을 추가합니다. 자세한 내용은 위의 무작위성 섹션을 참조하세요.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">단일 규칙과 다중 규칙 비교</h3><p><strong>단일 규칙</strong> - 하나의 비즈니스 제약 조건(예: 부스트 공식 문서)이 있는 경우 순위 결정자를 <code translate="no">search(..., ranker=ranker)</code> 으로 직접 전달합니다.</p>
<p><strong>다중 규칙</strong> - 여러 제약 조건(재고 품목 우선 순위 지정 + 낮은 평점의 제품 강등 + 무작위성 추가)이 필요한 경우 여러 개의 <code translate="no">Function</code> 개체를 만들어 <code translate="no">FunctionScore</code> 과 결합하여 구성합니다:</p>
<ul>
<li><code translate="no">boost_mode</code>각 규칙이 원래 점수와 결합하는 방법 (<code translate="no">multiply</code> 또는 <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>여러 규칙이 서로 결합하는 방법 (<code translate="no">multiply</code> 또는 <code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">실습: 공식 문서 우선순위 지정하기<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>문서 검색 시스템에서 공식 문서의 순위를 높이는 구체적인 예를 살펴봅시다.</p>
<h3 id="Schema" class="common-anchor-header">스키마</h3><p>다음 필드가 있는 <code translate="no">milvus_collection</code> 이라는 컬렉션입니다:</p>
<table>
<thead>
<tr><th>필드</th><th>Type</th><th>Purpose</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>기본 키</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>문서 텍스트</td></tr>
<tr><td><code translate="no">embedding</code></td><td>float_vector (3072)</td><td>시맨틱 벡터</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>출처: &quot;공식&quot;, &quot;커뮤니티&quot; 또는 &quot;티켓&quot;</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> if <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p><code translate="no">source</code> 및 <code translate="no">is_official</code> 필드는 부스트 랭커가 순위를 조정하는 데 사용할 메타데이터입니다.</p>
<h3 id="Setup-Code" class="common-anchor-header">설정 코드</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">결과 비교: 부스트 랭커를 사용했을 때와 사용하지 않았을 때</h3><p>먼저 부스트 랭커를 사용하지 않고 기준 검색을 실행합니다. 그런 다음 <code translate="no">filter: is_official == true</code> 및 <code translate="no">weight: 1.2</code> 에 부스트 랭커를 추가하고 비교합니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">결과</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>주요 변경 사항: 문서 <code translate="no">id=2</code> (공식)의 점수가 1.2를 곱하여 4위에서 2위로 뛰어올랐습니다. 커뮤니티 게시물과 티켓 기록은 삭제되지 않고 순위만 낮아졌습니다. 시맨틱 검색을 기본으로 유지한 다음 그 위에 비즈니스 규칙을 계층화하는 것이 바로 Boost Ranker의 요점입니다.</p>
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">부스트 랭커는</a> 임베딩을 건드리거나 인덱스를 다시 구축하지 않고도 벡터 검색 결과에 비즈니스 로직을 주입할 수 있는 방법을 제공합니다. 공식 콘텐츠 부스트, 오래된 결과 강등, 제어된 다양성 추가 - 이 모든 것이 <a href="https://milvus.io/docs/manage-functions.md">Milvus 함수 API의</a> 간단한 필터 + 가중치 구성을 통해 이루어집니다.</p>
<p>RAG 파이프라인, 추천 시스템 또는 엔터프라이즈 검색을 구축하든, Boost Ranker는 의미적으로 유사한 것과 사용자에게 실제로 유용한 것 사이의 간극을 메우는 데 도움을 줍니다.</p>
<p>검색 랭킹에 대해 작업 중이고 사용 사례에 대해 논의하고 싶으신 경우:</p>
<ul>
<li><a href="https://slack.milvus.io/">Milvus Slack 커뮤니티에</a> 가입하여 검색 및 검색 시스템을 구축하는 다른 개발자들과 소통하세요.</li>
<li><a href="https://milvus.io/office-hours">20분 동안 진행되는 무료 Milvus 오피스 아워 세션을 예약하여</a> 팀과 함께 랭킹 로직을 살펴보세요.</li>
<li>인프라 설정을 건너뛰고 싶다면 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)의 무료 티어에서 시작할 수 있습니다.</li>
</ul>
<hr>
<p>팀이 부스트 랭커를 사용하기 시작할 때 자주 묻는 질문 몇 가지를 소개합니다:</p>
<p><strong>부스트 랭커가 Cohere나 BGE와 같은 모델 기반 리랭커를 대체할 수 있나요?</strong>이 둘은 서로 다른 문제를 해결합니다. 모델 기반 재랭커는 시맨틱 품질에 따라 결과의 점수를 다시 매기며, "어떤 문서가 실제로 질문에 대한 답을 주는지"를 결정하는 데 능숙합니다. 부스트 랭커는 비즈니스 규칙에 따라 점수를 조정하여 "어떤 관련 문서를 먼저 표시할지"를 결정합니다. 실제로는 의미론적 관련성을 위한 모델 랭커와 그 위에 비즈니스 로직을 위한 Boost Ranker, 이 두 가지를 모두 원하는 경우가 많습니다.</p>
<p><strong>부스트 랭커는 상당한 지연 시간을 추가하나요?</strong>아니요. 전체 데이터 세트가 아니라 이미 검색된 후보 세트(일반적으로 벡터 검색의 Top-K)를 대상으로 작동합니다. 작업은 단순한 필터링과 곱하기이므로 벡터 검색 자체에 비해 오버헤드는 무시할 수 있는 수준입니다.</p>
<p><strong>가중치 값은 어떻게 설정하나요?</strong>작은 조정부터 시작하세요. COSINE 유사도(높을수록 좋음)의 경우, 일반적으로 1.1~1.3의 가중치는 의미론적 관련성을 완전히 무시하지 않고도 순위를 눈에 띄게 바꾸는 데 충분합니다. 실제 데이터로 테스트하여 유사도가 낮은 부스트 결과가 우세해지기 시작하면 가중치를 낮추세요.</p>
<p><strong>여러 개의 부스트 랭커 규칙을 결합할 수 있나요?</strong>네. 예. 여러 개의 <code translate="no">Function</code> 개체를 생성하고 <code translate="no">FunctionScore</code> 을 사용하여 결합하세요. <code translate="no">boost_mode</code> (각 규칙이 원래 점수와 결합하는 방식) 및 <code translate="no">function_mode</code> (규칙이 서로 결합하는 방식)을 통해 규칙 상호 작용 방식을 제어할 수 있으며, 둘 다 <code translate="no">multiply</code> 및 <code translate="no">add</code> 을 지원합니다.</p>
