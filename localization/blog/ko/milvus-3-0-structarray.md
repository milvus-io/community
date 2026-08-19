---
id: milvus-3-0-structarray.md
title: '하나의 엔티티, 다수의 벡터: Milvus 3.0 StructArray를 이용한 엔티티 및 요소 수준 검색'
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  하나의 엔티티는 여러 개의 정렬된 벡터와 메타데이터 필드를 포함할 수 있으며, Milvus는 데이터를 별도의 행으로 평면화하지 않고 전체
  엔티티 또는 개별 요소를 검색할 수 있습니다.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>대부분의 벡터 데이터베이스 스키마는 단순한 가정에서 출발합니다. 하나의 엔티티에 하나의 임베딩입니다. 제품에는 하나의 벡터가, 문서에도 하나의 벡터가 제공됩니다. 사용자 쿼리는 임베딩되어 ANN(근사 최근접 이웃) 검색을 통해 이러한 벡터들과 비교됩니다. 이 모델은 RAG, 의미 검색, 추천 시스템을 포함한 1세대 벡터 검색 사용 사례에는 잘 맞습니다.</p>
<p><strong>하지만 실제 AI 데이터가 그런 가정에 맞는 경우는 드뭅니다.</strong> 비디오에는 클립, 셔트, 또는 키프레임이 포함되며, 각각은 고유한 임베딩, 시간 범위, 캡션, 장면 레이블, 신뢰도 점수를 가집니다. 제품에는 여러 이미지와 촬영 각도가 있을 수 있습니다. 긴 문서에는 문서 전체의 단일 임베딩보다 지역적 의미가 더 중요한 구절이나 섹션이 포함됩니다. 널리 사용되는 late-interaction 모델은 더 미세한 단위에서 동일한 한계를 드러냅니다. ColBERT는 토큰당 하나의 벡터를 생성하고, ColPali는 시각적 패치당 하나의 벡터를 생성합니다.</p>
<p>각 경우에서, 애플리케이션이 저장, 표시, 보안, 반환하는 단위는 여전히 부모 엔티티입니다. 그러나 관련성, 필터링, 결과 설명은 종종 해당 엔티티 내부의 요소에 의존합니다.</p>
<p><strong>새로운 StructArray 기능은 Milvus에 이러한 형태를 위한 네이티브 데이터 모델을 제공합니다. 하나의 엔티티가 스키마로 정의된 Struct 요소의 정렬된 배열을 포함하고, 각 요소는 스칼라 메타데이터, 벡터 임베딩, 또는 둘 다를 담을 수 있습니다.</strong> Milvus는 동일한 요소에 속하는 필드를 필터링하고, 엔티티 수준에서 두 임베딩 리스트를 비교하거나, 개별 요소를 검색하여 일치하는 오프셋을 반환할 수 있습니다.</p>
<p>이 기사는 비디오 검색 예제를 통해 데이터 모델을 설명한 다음, 스키마 설계, 필터링, 벡터 검색 세분성, EmbeddingList 인덱스 전략, 하이브리드 결과 축소, 그리고 이 기능을 실행 가능하게 만드는 물리적 레이아웃까지 살펴봅니다.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">단일 벡터와 단일 플랫 행 모델이 더 이상 충분하지 않은 이유<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>사용자가 비디오 카탈로그에서 "주방에서 채소를 썰고 있는 사람"을 검색한다고 가정해 봅시다. 관련 신호는 전체 비디오의 임베딩이 아니라 8초짜리 클립 하나에 있을 수 있습니다. <strong>모든 클립, 객체, 동작을 하나의 벡터로 압축하면 전반적인 주제는 보존될 수 있지만, 지역적 세부 정보는 희석될 수 있습니다.</strong></p>
<p>동일한 불일치는 다른 워크로드에서도 나타납니다:</p>
<ul>
<li>제품의 관련성은 여러 이미지나 각도 중 하나에서 비롯될 수 있습니다.</li>
<li>문서는 전체 주제가 아니라 하나의 구절 때문에 매칭될 수 있습니다.</li>
<li>에이전트 메모리에는 여러 관측치가 포함될 수 있으며, 현재 작업에 중요한 것은 그중 하나뿐일 수 있습니다.</li>
<li>ColBERT 또는 ColPali 레코드에는 하나의 밀집 벡터가 아니라 가변 길이의 토큰 또는 패치 벡터 목록이 포함됩니다.</li>
</ul>
<p>한 가지 대안은 모든 클립, 이미지, 구절을 별도의 데이터베이스 행으로 분할하는 것입니다. 그러면 지역 검색이 가능해지지만, 각 조각을 부모 엔티티에서 분리합니다. 부모 메타데이터가 여러 행에 반복될 수 있고, 엔티티 수준 검색은 조각 검색 후 그룹화, 중복 제거, 재순위화가 필요하게 됩니다.</p>
<p>중첩 저장소만으로는 쿼리 문제를 해결할 수 없습니다. JSON은 객체를 저장할 수 있지만, 벡터 및 스칼라 인덱싱을 위한 사전 정의된 하위 필드 스키마를 Milvus에 제공하지 않습니다. 병렬 배열은 캡션, 장면 레이블, 신뢰도 값을 저장할 수 있지만, 애플리케이션이 오프셋 정렬을 유지해야 합니다. 데이터베이스는 <code translate="no">scene_type[3]</code>과 <code translate="no">label_confidence[3]</code>이 동일한 클립을 설명한다는 것을 그 관계가 데이터 모델의 일부가 아닌 이상 안전하게 추론할 수 없습니다.</p>
<p>StructArray는 그 관계를 직접 인코딩합니다. 부모 엔티티 내부에 지역 요소를 유지하면서 정렬된 하위 필드를 스키마 검증, 인덱싱, 필터링, 벡터 검색에 노출합니다.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">StructArray란 무엇이며 데이터 모델은 무엇인가?<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray는 구조체 배열이라고도 하며, 각 엔티티에 정렬된 Struct 요소 집합을 저장합니다. StructArray 필드는 모든 요소가 하나의 사전 정의된 <code translate="no">Struct</code> 스키마를 따르는 <code translate="no">Array</code>입니다. 비디오 컬렉션의 경우 논리적 형태는 다음과 같을 수 있습니다:</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>여기서:</p>
<ul>
<li><code translate="no">clips</code>는 부모 StructArray 필드입니다.</li>
<li><code translate="no">clip_embedding_list</code>, <code translate="no">clip_embedding</code>, <code translate="no">start_sec</code> 및 기타 속성은 하위 필드입니다.</li>
<li><code translate="no">clips[0]</code>은 첫 번째 클립입니다.</li>
<li>오프셋 <code translate="no">0</code>의 모든 하위 필드는 동일한 클립에 속합니다.</li>
<li>오프셋 <code translate="no">3</code>의 모든 하위 필드는 다른 클립에 속합니다.</li>
</ul>
<p>두 벡터 하위 필드는 서로 다른 검색 모드를 제공합니다. <code translate="no">clips[clip_embedding_list]</code>는 엔티티 수준 EmbeddingList 검색을 위해 <code translate="no">MAX_SIM*</code> 메트릭으로 인덱싱되고, <code translate="no">clips[clip_embedding]</code>은 요소 수준 검색을 위해 일반 벡터 메트릭으로 인덱싱됩니다. 벡터 필드나 벡터 하위 필드는 하나의 인덱스만 허용하므로 두 모드가 모두 필요한 컬렉션은 두 하위 필드를 별도로 정의하고 인덱싱해야 합니다.</p>
<p>이 모델은 세 가지 서로 다른 쿼리 의미를 지원합니다.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. EmbeddingList 검색은 부모 엔티티를 반환합니다</h3><p><code translate="no">clips[clip_embedding_list]</code>의 벡터는 비디오에 대한 하나의 임베딩 리스트를 형성합니다. 쿼리도 <code translate="no">EmbeddingList</code>입니다. Milvus는 <code translate="no">MAX_SIM*</code> 메트릭을 사용하여 쿼리 리스트와 각 저장된 리스트를 비교하고 엔티티 수준 결과를 반환합니다.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. <code translate="no">MATCH_*</code> 패밀리는 부모 엔티티를 필터링합니다</h3><p><code translate="no">MATCH_ANY</code>, <code translate="no">MATCH_ALL</code>, <code translate="no">MATCH_LEAST</code>, <code translate="no">MATCH_MOST</code>, <code translate="no">MATCH_EXACT</code>는 Struct 요소에 대해 조건자를 평가하고, 이를 충족하는 요소 수를 계산한 다음, 부모 엔티티가 필터를 통과하는지 결정합니다.</p>
<p>예를 들어:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>두 스칼라 조건은 동일한 클립 오프셋에서 모두 참이어야 합니다. Milvus는 한 클립의 주방 레이블과 다른 클립의 높은 신뢰도 값을 결합하지 않습니다.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. 요소 수준 검색은 일치하는 요소 오프셋을 반환합니다</h3><p>일반 쿼리 벡터는 <code translate="no">clips[clip_embedding]</code>의 모든 벡터를 독립적으로 검색할 수 있습니다. 각 히트는 부모 엔티티와 일치하는 Struct 요소의 0부터 시작하는 오프셋을 식별합니다. <code translate="no">element_filter</code>는 해당 벡터 검색에 참여하는 요소를 제한할 수 있습니다.</p>
<p>이러한 연산은 하나의 전제를 공유합니다. Milvus는 어떤 벡터와 스칼라 값이 같은 요소에 속하는지, 어떤 요소가 같은 엔티티에 속하는지를 알고 있습니다.</p>
<p>StructArray는 범용 임의 중첩 시스템이 아닙니다. 현재 모델은 지원되는 스칼라 및 벡터 하위 필드를 가진 <code translate="no">Struct</code> 요소의 <code translate="no">Array</code> 하나입니다. 이러한 경계 덕분에 하위 필드 인덱싱과 요소 인지 실행이 가능해집니다.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">스키마, 인덱스, 삽입 경로 구축<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>다음은 간소화된 PyMilvus 예제로, 최상위 벡터 하나와 클립용 StructArray를 가진 비디오 컬렉션을 생성합니다. 동일한 컬렉션에서 두 검색 모드를 모두 시연할 수 있도록 별도의 클립 벡터 하위 필드를 사용합니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>벡터 하위 필드는 검색 전에 인덱싱되어야 합니다. 메트릭 패밀리가 검색 모드를 결정하므로 각 벡터 하위 필드는 자체 인덱스를 갖습니다:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>스칼라 인덱스는 선택 사항이지만, 대규모 필터에서 자주 등장하는 하위 필드는 호환되는 스칼라 인덱스를 사용해야 합니다. 예를 들어, <code translate="no">clips[scene_type]</code>은 역인덱스를 사용할 수 있고, <code translate="no">clips[label_confidence]</code> 같은 숫자 하위 필드는 숫자 필터링에 적합한 인덱스를 사용할 수 있습니다.</p>
<p>자연스러운 엔티티 형태로 데이터를 삽입합니다: 클립 객체 배열을 가진 하나의 비디오 행입니다. 예제를 간결하게 유지하기 위해 동일한 클립 벡터를 두 벡터 하위 필드에 모두 기록합니다.</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>API 경계에서 <code translate="no">clips</code>는 구조화된 객체의 배열로 유지됩니다. Milvus 내부에서는 각 하위 필드가 자체 인덱스, 필터, 출력 동작에 필요한 타입 경로를 따릅니다. 이러한 구분은 삽입 시점에는 투명하지만 이후 모든 것에 있어 근본적입니다.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">동일 요소 필터링이 구조와 병렬 배열의 차이를 만든다<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>필터링의 주요 이점은 중첩 필드에 대한 더 짧은 문법이 아니라 스칼라 하위 필드 간의 올바른 상관 관계입니다.</p>
<p>애플리케이션이 라벨 신뢰도가 <code translate="no">0.8</code> 이상인 주방 클립이 포함된 비디오를 필요로 한다고 가정해 봅시다. 비디오에 어떤 주방 클립과 어떤 높은 신뢰도 클립이 포함된 것만으로는 충분하지 않습니다. 동일한 클립이 두 조건을 모두 충족해야 합니다.</p>
<p>StructArray <code translate="no">MATCH_*</code> 패밀리는 이를 직접적으로 표현합니다:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus는 각 요소 오프셋에서 조건자를 평가한 다음, 연산자의 한정사를 적용하여 부모 엔티티가 통과하는지 결정합니다:</p>
<ul>
<li><code translate="no">MATCH_ANY</code>: 하나 이상의 요소가 일치합니다.</li>
<li><code translate="no">MATCH_ALL</code>: 모든 요소가 일치합니다.</li>
<li><code translate="no">MATCH_LEAST</code>: 최소 <code translate="no">threshold</code>개 요소가 일치합니다.</li>
<li><code translate="no">MATCH_MOST</code>: 최대 <code translate="no">threshold</code>개 요소가 일치합니다.</li>
<li><code translate="no">MATCH_EXACT</code>: 정확히 <code translate="no">threshold</code>개 요소가 일치합니다.</li>
</ul>
<p>동일한 데이터가 두 개의 독립적인 배열로 저장된 경우, 다음 표현식은 그 상관 관계를 보존하지 못합니다:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>두 값은 서로 다른 오프셋에 있을 수 있습니다. 이는 관련 없는 속성에는 유효할 수 있지만, 두 조건이 동일한 클립, 제품 이미지, 또는 문서 구절을 설명할 때는 올바르지 않습니다.</p>
<p>StructArray는 요소 정체성을 애플리케이션이 강제해야 하는 규칙이 아니라 데이터베이스 조건자의 일부로 만듭니다.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">두 가지 벡터 검색 세분성, 두 가지 결과 정체성<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>엔티티가 여러 벡터를 저장하게 되면, 검색은 ANN 검색이 시작되기 전에 모델링 질문을 해결해야 합니다:</p>
<p><strong>벡터가 부모 엔티티의 하나의 표현으로 함께 점수가 매겨져야 할까요, 아니면 각 요소 벡터가 독립적으로 경쟁해야 할까요?</strong></p>
<p>StructArray는 두 모델을 모두 지원하지만, 서로 다른 쿼리 형태, 메트릭 패밀리, 벡터 하위 필드, 결과 정체성을 사용합니다.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">EmbeddingList 검색: 쿼리 벡터 목록이 엔티티를 찾습니다.</h3><p><code translate="no">EmbeddingList</code> 쿼리는 여러 개의 벡터를 포함합니다. 쿼리 비디오는 여러 클립으로 나뉠 수 있고, 제품 쿼리는 여러 참조 이미지를 포함할 수 있으며, ColBERT 쿼리는 쿼리 토큰당 하나의 벡터를 포함합니다.</p>
<p>각 엔티티에 대해 Milvus는 쿼리 리스트를 엔티티의 저장된 임베딩 리스트와 비교합니다. MaxSim 방식 점수 계산에서 각 쿼리 벡터는 엔티티 리스트에서 최상의 일치를 선택하고, Milvus는 이러한 최상의 일치 점수를 엔티티 점수로 집계합니다. 최종 히트는 특정 Struct 요소가 아닌 부모 엔티티를 나타냅니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>이 검색은 다음 질문에 답합니다: <strong>이 쿼리 클립 집합에 가장 잘 맞는 비디오는 무엇인가?</strong></p>
<p>이는 비디오-비디오 검색, 다중 이미지 제품 검색, ColBERT 및 ColPali 방식 검색, 쿼리와 저장된 엔티티가 모두 여러 벡터로 표현되는 기타 사례에 적합합니다.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">요소 수준 검색: 하나의 쿼리 벡터가 엔티티 내부의 클립을 찾습니다.</h3><p>요소 수준 검색은 일반 쿼리 벡터를 사용합니다. <code translate="no">clips[clip_embedding]</code>의 모든 벡터는 독립적인 후보로 ANN 검색에 참여합니다. 각 히트는 부모 엔티티와 일치하는 요소의 오프셋을 식별합니다.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>선택한 클립만 검색하려면 스칼라 조건이 동일한 클립에 적용되는 <code translate="no">element_filter</code>를 연결하세요:</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>필터는 먼저 주방 클립을 선택한 다음 다른 높은 신뢰도 클립을 검색하지 않습니다. 조건자와 벡터 후보는 모두 동일한 Struct 요소를 참조합니다.</p>
<p>그룹화되지 않은 응답은 다음과 같을 수 있습니다:</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>여러 클립이 일치할 수 있으므로 같은 엔티티가 두 번 이상 나타날 수 있습니다. 이는 애플리케이션이 어떤 비디오나 문서가 관련이 있는지뿐만 아니라 어떤 클립 또는 구절이 일치를 만들었는지도 보여줘야 할 때 유용합니다.</p>
<table>
<thead>
<tr><th>측면</th><th>EmbeddingList 검색</th><th>요소 수준 검색</th></tr>
</thead>
<tbody>
<tr><td>쿼리 입력</td><td><code translate="no">EmbeddingList</code>의 하나 이상의 쿼리 벡터</td><td>하나의 일반 쿼리 벡터</td></tr>
<tr><td>예제 대상</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>메트릭 패밀리</td><td><code translate="no">MAX_SIM*</code></td><td><code translate="no">COSINE</code>, <code translate="no">IP</code>, <code translate="no">L2</code> 같은 일반 메트릭</td></tr>
<tr><td>ANN 후보 단위</td><td>부모 엔티티의 임베딩 리스트</td><td>각 Struct 요소 벡터</td></tr>
<tr><td>결과 정체성</td><td>부모 엔티티</td><td>부모 엔티티 + 요소 오프셋</td></tr>
<tr><td>일반적인 사용 사례</td><td>다중 벡터 쿼리를 다중 벡터 엔티티와 매칭</td><td>가장 관련성 높은 클립, 이미지, 구절, 패치, 팩트 찾기</td></tr>
</tbody>
</table>
<p>하나의 컬렉션에서 두 모드를 모두 지원하려면 별도의 벡터 하위 필드를 정의하고 인덱싱하세요. 쿼리 형태, 메트릭 패밀리, 대상 인덱스는 일치해야 합니다.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">EmbeddingList 인덱싱은 품질-비용 결정입니다.<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>엔티티당 하나의 임베딩이 있으면 ANN 인덱스는 쿼리 벡터 근처의 엔티티를 찾습니다. EmbeddingList 검색은 관련성이 두 벡터 리스트 간의 쌍별 상호작용에 의존하기 때문에 더 비쌉니다.</p>
<p>모든 엔티티의 모든 벡터에 대해 정확한 MaxSim을 계산하면 가장 깔끔한 참조 순위가 생성되지만, 전체 스캔은 온라인 검색에 일반적으로 너무 비쌉니다. 따라서 Milvus는 2단계 모델을 사용합니다:</p>
<ol>
<li>근사 전략이 후보 부모 엔티티를 검색합니다.</li>
<li><code translate="no">emb_list_rerank</code>이 활성화되면 Milvus는 해당 후보에 대해 MaxSim을 다시 계산하여 최종 순위를 생성합니다.</li>
</ol>
<p>더 많은 1단계 후보를 검색하면 일반적으로 실제 상위 결과가 리랭커에 도달할 확률이 높아지지만, 지연 시간과 계산량도 증가합니다. 세 가지 전략은 주로 후보 집합을 생성하는 방식에서 차이가 있습니다.</p>
<table>
<thead>
<tr><th>전략</th><th>1단계 후보 표현</th><th>적합한 시작 조건</th><th>주요 트레이드오프</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>각 임베딩 리스트의 모든 벡터를 인덱싱합니다. 쿼리 벡터는 독립적으로 ANN을 실행하고, MaxSim 재순위화 전에 일치 항목이 부모 엔티티로 집계됩니다.</td><td>품질이 우선이고, 리스트가 짧거나 중간 길이이며, 개별 벡터의 식별력이 높은 경우.</td><td>인덱스 크기와 1단계 검색 작업량이 리스트 길이와 쿼리 벡터 수에 따라 증가합니다.</td></tr>
<tr><td>MUVERA</td><td>각 임베딩 리스트를 무작위 프로젝션을 통해 하나의 고정 차원 벡터로 인코딩한 다음 일반 ANN을 실행합니다.</td><td>TokenANN이 너무 무겁고 학습 파이프라인 없이 압축하는 것이 선호되는 경우.</td><td>인코딩이 정보를 잃습니다. 더 강한 프로젝션 설정은 인코딩 차원과 ANN 비용을 증가시킵니다.</td></tr>
<tr><td>LEMUR</td><td>임베딩 리스트를 고정 차원의 부모 엔티티 벡터로 매핑하는 모델을 학습합니다.</td><td>임베딩의 식별력이 낮거나, 리스트가 크거나, 워크로드가 시각적 또는 다중 모달인 경우.</td><td>학습이 필요하고, 말뭉치 분포와 문서 길이 편향에 민감할 수 있습니다.</td></tr>
</tbody>
</table>
<p>단일 전략이 모든 워크로드에 최선은 아닙니다. 대상 데이터와 쿼리 분포에서 시작하세요:</p>
<ul>
<li>데이터셋 크기가 허용된다면 TokenANN을 품질 우선 기준선으로 사용하세요.</li>
<li>리스트 길이가 증가하면서 TokenANN의 인덱스나 후보 검색 비용이 너무 커지고 학습 파이프라인을 피하고 싶다면 MUVERA를 시도하세요.</li>
<li>임베딩 공간이 노이즈가 많거나 식별력이 약한 경우, 또는 워크로드가 시각적이거나 다중 모달인 경우 LEMUR을 평가하세요.</li>
<li>지연 시간과 인덱스 크기와 함께 재현율이나 nDCG를 측정하세요. 짧은 텍스트에 잘 맞는 전략은 긴 꼬리 문서 길이나 수천 개의 시각적 패치에서는 다르게 동작할 수 있습니다.</li>
</ul>
<p>StructArray는 한 가지 문제를 해결합니다: 단일 엔티티 내부에 정렬되고 필터링 가능하며 벡터를 포함하는 요소를 표현하는 방법입니다. EmbeddingList 전략은 다른 문제를 해결합니다: 특정 모델과 말뭉치에 대해 허용 가능한 비용으로 MaxSim을 근사하는 방법입니다.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">하이브리드 검색은 결과 정체성을 명확하게 합니다.<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>프로덕션 검색은 단일 벡터 경로만 따르는 경우가 드뭅니다. 비디오 요청은 최상위 비디오 임베딩, 하나 이상의 클립 수준 임베딩, 캡션 또는 트랜스크립트 신호, 그리고 리랭커를 결합할 수 있습니다.</p>
<p>요소 수준 후보가 해당 파이프라인에 들어가면 엔진은 최종 후보를 식별하는 기준을 결정해야 합니다.</p>
<table>
<thead>
<tr><th>하이브리드 요청 구성</th><th>최종 후보 범위</th><th>결과 정체성</th></tr>
</thead>
<tbody>
<tr><td>모든 하위 검색이 요소 수준이고 동일한 StructArray 아래의 벡터 하위 필드를 대상으로 함</td><td>요소 수준</td><td>기본 키 + StructArray 필드 + 요소 오프셋</td></tr>
<tr><td>최상위 벡터 필드가 포함됨</td><td>엔티티 수준</td><td>기본 키</td></tr>
<tr><td>EmbeddingList 요청이 포함됨</td><td>엔티티 수준</td><td>기본 키</td></tr>
<tr><td>요소 수준 요청이 서로 다른 StructArray 필드를 대상으로 함</td><td>엔티티 수준</td><td>기본 키</td></tr>
</tbody>
</table>
<p>첫 번째 구성은 오프셋 <code translate="no">3</code>이 주어진 부모 StructArray 아래의 모든 하위 검색에 대해 동일한 Struct 요소를 참조하므로 요소 정체성을 보존합니다. 이는 여러 요소 수준 신호를 융합한 후 가장 관련성 높은 클립이나 구절을 반환하려는 애플리케이션에 적합합니다.</p>
<p>다른 구성은 후보 세분성 또는 요소 네임스페이스를 혼합합니다. 따라서 요소 히트는 최종 재순위화 전에 엔티티 수준 점수로 축소되어야 합니다. Milvus는 여러 축소 전략을 지원합니다:</p>
<table>
<thead>
<tr><th>축소 전략</th><th>반환된 요소 히트에서 얻은 엔티티 점수</th><th>중요 조건</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>최상의 요소 점수</td><td>지원되는 일반 벡터 메트릭과 함께 작동</td></tr>
<tr><td><code translate="no">sum</code></td><td>반환된 모든 요소 점수의 합</td><td><code translate="no">IP</code> 또는 <code translate="no">COSINE</code> 같은 양의 상관 메트릭과 함께 사용</td></tr>
<tr><td><code translate="no">avg</code></td><td>반환된 요소 점수의 평균</td><td>지원되는 일반 벡터 메트릭과 함께 작동</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>반환된 요소 점수 중 상위 <code translate="no">K</code>개의 합</td><td>양의 <code translate="no">topk</code> 필요, <code translate="no">IP</code> 또는 <code translate="no">COSINE</code>과 함께 사용</td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>반환된 요소 점수 중 상위 <code translate="no">K</code>개의 평균</td><td>양의 <code translate="no">topk</code> 필요</td></tr>
</tbody>
</table>
<p>축소는 해당 ANN 하위 검색에서 반환된 요소 히트에 대해서만 작동하며, 검색 후 엔티티의 모든 요소를 스캔하지 않습니다. 따라서 요청 <code translate="no">limit</code>은 축소 함수에 사용할 수 있는 요소 히트를 제어합니다.</p>
<p>이 선택은 단순한 출력 형식이 아니라 검색 의미론을 결정합니다. 애플리케이션이 클립이나 구절을 표시한다면 융합 과정에서 오프셋을 보존하는 것이 자연스럽습니다. 비디오, 제품, 또는 문서를 표시한다면 엔티티 수준 축소가 자연스럽습니다. 신호가 서로 다른 세분성에서 작동할 때 시스템은 요소-엔티티 점수 규칙을 명시적으로 정의해야 합니다.</p>
<p>StructArray는 정체성-축소 문제를 임시방편적 사후 처리에서 검색 실행 모델로 옮깁니다.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Milvus가 StructArray를 blob으로 취급하지 않고 실행하는 방법<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>사용자에게 노출되는 모델은 <code translate="no">ARRAY&lt;STRUCT&gt;</code>입니다. 그러나 전체 값을 하나의 불투명한 blob으로 저장하면 하위 필드 인덱스, 필터, 선택적 출력이 비효율적이게 됩니다.</p>
<p>Milvus는 논리적 부모-물리적 자식 컬럼 설계를 사용합니다.</p>
<p>스키마 계층에서 <code translate="no">clips</code>는 논리적 부모 필드입니다. Struct 스키마, 최대 용량, null 허용 여부와 같은 속성을 정의합니다. 하위 필드는 <code translate="no">clips[clip_embedding_list]</code>, <code translate="no">clips[clip_embedding]</code>, <code translate="no">clips[scene_type]</code>, <code translate="no">clips[label_confidence]</code> 같은 경로로 정규화됩니다.</p>
<p>스칼라 하위 필드는 엔티티별 스칼라 배열 저장 경로를 따르고, 벡터 하위 필드는 벡터 배열 경로를 따릅니다. 그런 다음 각 하위 필드는 해당 유형에 적합한 데이터 경로를 사용할 수 있습니다: 메타데이터에는 스칼라 필터링과 스칼라 인덱스, 임베딩에는 벡터 인덱스와 ANN 검색입니다.</p>
<p>수집 시 Proxy는 중첩된 Struct 리스트를 타입이 지정된 자식 컬럼으로 확장합니다. 실행 중에 Milvus는 각 물리적 요소와 부모 엔티티 간의 관계를 유지합니다. 개념적으로 그 관계는 다음과 같습니다:</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>요소 수준 검색이 물리적 요소 ID를 반환하면 Milvus는 이를 부모 엔티티와 요소 오프셋으로 다시 매핑합니다. <code translate="no">element_filter</code>가 요소 수준 비트맵을 생성하면 엔진은 이를 부모 엔티티 가시성, 삭제, 기타 필터와 정렬합니다.</p>
<p>결과를 반환할 때 Milvus는 논리적 스키마와 공유 오프셋을 사용하여 애플리케이션이 삽입한 StructArray 형태를 재구성합니다. 시스템은 타입이 지정된 자식 컬럼에서 실행하면서도 사용자는 자연스러운 중첩 객체를 계속 읽고 쓸 수 있습니다. 이러한 물리적 레이아웃은 StructArray를 단순한 타입 지정 JSON 이상으로 만듭니다. 중첩 관계가 인덱스 및 실행 모델에 참여합니다.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">StructArray가 적합한 경우와 그렇지 않은 경우<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray는 다음 조건이 모두 충족될 때 매우 적합합니다:</p>
<ul>
<li>애플리케이션에 비디오, 제품, 문서, 시각적 페이지, 또는 메모리 레코드와 같은 의미 있는 부모 엔티티가 있습니다.</li>
<li>각 부모는 정렬되고 가변 길이의 지역 요소 집합을 포함합니다.</li>
<li>해당 요소에는 자체 스칼라 메타데이터, 벡터, 또는 둘 다 필요합니다.</li>
<li>검색 또는 필터링이 동일한 요소 오프셋에서 하위 필드 간의 관계를 보존해야 합니다.</li>
<li>애플리케이션에 엔티티 수준 다중 벡터 검색, 요소 수준 히트, 또는 둘 다 필요합니다.</li>
</ul>
<p>StructArray가 모든 컬렉션에서 자동으로 더 나은 것은 아닙니다. 짧은 문서나 단순한 쿼리는 단일 밀집 임베딩으로 충분할 수 있습니다. 다중 벡터 인덱싱은 저장 및 검색 비용을 추가하므로, 추가 표현은 향상된 검색 품질이나 더 유용한 결과 세분성을 통해 그 자리를 정당화해야 합니다.</p>
<p>현재 스키마 및 실행 경계도 중요합니다:</p>
<ul>
<li><code translate="no">Struct</code>는 최상위 컬렉션 필드가 아니라 <code translate="no">Array</code>의 요소 유형으로 지원됩니다.</li>
<li>하나의 StructArray의 모든 요소는 하나의 사전 정의된 스키마를 공유합니다.</li>
<li><code translate="no">max_capacity</code>는 필수이며 엔티티당 요소 수를 제한합니다.</li>
<li>StructArray 내부에서는 중첩된 <code translate="no">Struct</code>, <code translate="no">Array</code>, <code translate="no">ArrayOfStruct</code>, <code translate="no">JSON</code> 하위 필드가 지원되지 않습니다.</li>
<li>벡터 하위 필드는 하나의 인덱스를 허용합니다. 둘 다 필요한 경우 EmbeddingList 및 요소 수준 검색에 별도의 벡터 하위 필드를 사용하세요.</li>
<li>벡터 하위 필드는 검색 전에 인덱싱되어야 합니다. 필터에서 많이 사용되는 스칼라 하위 필드는 적절히 인덱싱해야 합니다.</li>
<li>StructArray 필드가 생성된 후에는 하위 필드 스키마가 고정되므로 프로덕션 출시 전에 요소 속성을 계획하세요.</li>
</ul>
<p>이러한 제약은 모델을 문서 데이터베이스의 임의 중첩보다 좁게 만들지만, 동시에 Milvus가 요소 정체성을 추론하고 각 하위 필드를 인덱싱하며 두 가지 검색 세분성으로 실행할 수 있는 충분한 구조를 제공합니다.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray는 엔티티를 잃지 않으면서 지역 증거를 일급으로 유지합니다.<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray는 평면 스키마가 표현하기 어려운 검색 객체를 Milvus에 제공합니다: 정렬된 구조화된 요소 집합을 가진 부모 엔티티입니다. 이러한 요소 간의 관계는 저장소에만 존재하는 것이 아니라 필터링, 인덱싱, 검색에 참여합니다.</p>
<p>각 요소는 자체 메타데이터와 임베딩을 유지합니다. 요소는 동일 요소 스칼라 조건을 충족하거나, 엔티티 수준 EmbeddingList 검색에 함께 참여하거나, 요소 수준 검색에서 독립적으로 경쟁할 수 있습니다. 동시에 메타데이터, 권한, 애플리케이션 정체성이 컨텍스트를 제공하는 부모 엔티티에 계속 연결되어 있습니다.</p>
<p>비디오 클립, 제품 이미지, 문서 구절, 시각적 패치, 메모리 조각의 경우, 지역 증거가 속한 엔티티를 잃지 않으면서 검색하고 필터링할 수 있습니다. 남은 설계 선택은 명확합니다: 검색 세분성을 선택하고, 각 벡터 하위 필드에 일치하는 메트릭과 인덱스를 제공하며, 하이브리드 결과가 요소 오프셋을 보존할지 아니면 엔티티로 축소할지 결정하세요.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">Milvus 3.0에서 StructArray 사용해 보기<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray는 Milvus 3.0에서 사용할 수 있습니다. <a href="https://milvus.io/docs/array-of-structs.md">StructArray 개요</a>로 시작하세요. 엔티티 수준 다중 벡터 검색을 평가 중이라면 <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">EmbeddingList 전략 가이드</a>를 읽어보세요. 결과 세분성과 축소 동작에 대해서는 <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">StructArray를 이용한 하이브리드 검색</a>을 참조하세요.</p>
<p>더 넓은 릴리스 맥락은 <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 출시 블로그</a>, <a href="https://milvus.io/docs/release_notes.md">릴리스 노트</a>, <a href="https://github.com/milvus-io/milvus">milvus-io/milvus 저장소</a>를 참조하세요.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a>도 관리형 배포를 위해 StructArray 및 EmbeddingList 검색을 지원합니다. 서비스별 제한 사항은 <a href="https://docs.zilliz.com/docs/use-array-of-structs">Zilliz Cloud StructArray 가이드</a>를 검토하세요. Zilliz Cloud에서 StructArray의 스칼라 연산자는 현재 On-Demand 클러스터에 대해 문서화되어 있습니다.</p>
<p>팀과 스키마 또는 검색 설계에 대해 논의하려면 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 커뮤니티</a>에 참여하거나 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a> 세션을 예약하세요.</p>
