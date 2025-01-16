---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: 'Milvus 2.5를 소개합니다: 전체 텍스트 검색, 더욱 강력해진 메타데이터 필터링, 사용성 개선!'
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">개요<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>어휘 또는 키워드 검색이라고도 하는 <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">전체 텍스트 검색이라는</a> 강력한 새 기능을 도입한 Milvus의 최신 버전 2.5를 선보이게 되어 기쁘게 생각합니다. 검색을 처음 사용하는 경우, 전체 텍스트 검색을 사용하면 Google에서 검색하는 방식과 유사하게 문서 내에서 특정 단어나 구문을 검색하여 문서를 찾을 수 있습니다. 이는 정확한 단어만 일치시키는 것이 아니라 검색의 의미를 이해하는 기존의 시맨틱 검색 기능을 보완합니다.</p>
<p>문서 유사성에는 업계 표준인 BM25 메트릭을 사용하며, 스파스 벡터를 기반으로 구현되어 보다 효율적인 저장과 검색이 가능합니다. 이 용어가 익숙하지 않은 분들을 위해 설명하자면, 스파스 벡터는 대부분의 값이 0인 텍스트를 표현하는 방법으로, 저장 및 처리 효율이 매우 높습니다. 몇 개의 셀에만 숫자가 들어 있고 나머지는 비어 있는 거대한 스프레드시트를 상상해 보세요. 이 접근 방식은 벡터를 핵심 검색 개체로 삼는 Milvus의 제품 철학에 잘 맞습니다.</p>
<p>이 구현에서 주목할 만한 또 다른 측면은 사용자가 텍스트를 스파스 벡터로 수동 변환하는 대신 <em>직접</em> 텍스트를 삽입하고 쿼리할 수 있는 기능입니다. 이로써 Milvus는 비정형 데이터의 완전한 처리에 한 걸음 더 다가서게 되었습니다.</p>
<p>하지만 이것은 시작에 불과합니다. 2.5 버전 출시와 함께 <a href="https://milvus.io/docs/roadmap.md">Milvus 제품 로드맵을</a> 업데이트했습니다. 향후 Milvus의 제품 반복 버전에서는 다음 네 가지 핵심 방향으로 Milvus의 기능을 발전시키는 데 초점을 맞출 것입니다:</p>
<ul>
<li>간소화된 비정형 데이터 처리;</li>
<li>검색 품질 및 효율성 향상</li>
<li>보다 쉬운 데이터 관리</li>
<li>알고리즘 및 설계 발전을 통한 비용 절감</li>
</ul>
<p>우리의 목표는 AI 시대에 정보를 효율적으로 저장하고 효과적으로 검색할 수 있는 데이터 인프라를 구축하는 것입니다.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">Sparse-BM25를 통한 전체 텍스트 검색<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>일반적으로 시맨틱 검색은 문맥 인식과 의도 이해가 더 뛰어나지만, 사용자가 특정 고유 명사, 일련 번호 또는 완전히 일치하는 구문을 검색해야 하는 경우 키워드 매칭을 통한 전체 텍스트 검색이 더 정확한 결과를 산출하는 경우가 많습니다.</p>
<p>예를 들어 설명해 보겠습니다:</p>
<ul>
<li>"재생 에너지 솔루션에 관한 문서 찾기"와 같은 질문에는 시맨틱 검색이 더 효과적입니다.</li>
<li>&quot; <em>테슬라 모델 3 2024에</em> 관한 문서 찾기&quot;와 같이 필요할 때는 전체 텍스트 검색이 더 좋습니다.</li>
</ul>
<p>이전 버전(Milvus 2.4)에서는 사용자가 검색하기 전에 자신의 컴퓨터에서 별도의 도구(PyMilvus의 BM25EmbeddingFunction 모듈)를 사용해 텍스트를 사전 처리해야 했습니다. 이 방식은 증가하는 데이터 세트를 잘 처리하지 못하고, 추가 설정 단계가 필요하며, 전체 프로세스를 필요 이상으로 복잡하게 만드는 등 몇 가지 한계가 있었습니다. 기술적인 측면에서는 한 대의 기계에서만 작동할 수 있다는 점, BM25 채점에 사용되는 어휘 및 기타 말뭉치 통계는 말뭉치가 변경될 때 업데이트할 수 없다는 점, 클라이언트 측에서 텍스트를 벡터로 변환하는 작업이 직관적이지 않다는 점이 가장 큰 한계였습니다.</p>
<p>Milvus 2.5는 모든 것을 간소화합니다. 이제 텍스트로 직접 작업할 수 있습니다:</p>
<ul>
<li>원본 텍스트 문서를 그대로 저장</li>
<li>자연어 쿼리를 사용한 검색</li>
<li>결과를 읽기 쉬운 형태로 다시 가져오기</li>
</ul>
<p>Milvus는 복잡한 벡터 변환을 모두 자동으로 처리하여 텍스트 데이터로 더 쉽게 작업할 수 있습니다. 이를 "문서 입력, 문서 출력" 방식이라고 하는데, 사용자는 가독성 있는 텍스트로 작업하고 나머지는 저희가 처리합니다.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">기술적 구현</h3><p>기술적인 세부 사항에 관심이 있는 분들을 위해 Milvus 2.5는 내장된 Sparse-BM25 구현을 통해 다음과 같은 전체 텍스트 검색 기능을 추가했습니다:</p>
<ul>
<li><strong>탄티비 기반의 토큰화</strong>: Milvus는 이제 번성하는 탄티비 에코시스템과 통합됩니다.</li>
<li><strong>원시 문서를 수집하고 검색할 수 있는 기능</strong>: 텍스트 데이터의 직접 수집 및 쿼리 지원</li>
<li><strong>BM25 관련성 점수</strong>: 스파스 벡터를 기반으로 구현된 BM25 스코어링 내재화</li>
</ul>
<p>저희는 잘 발달된 탠티비 생태계와 협력하여 탠티비에서 Milvus 텍스트 토큰화기를 구축하기로 결정했습니다. 앞으로 Milvus는 더 많은 토큰라이저를 지원하고 토큰화 프로세스를 공개하여 사용자가 검색 품질을 더 잘 이해할 수 있도록 도울 것입니다. 또한, 전체 텍스트 검색의 성능을 더욱 최적화하기 위해 딥 러닝 기반 토큰라이저와 스템머 전략을 연구할 예정입니다. 아래는 토큰화기를 사용하고 구성하기 위한 샘플 코드입니다:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>수집 스키마에서 토큰화기를 구성한 후, 사용자는 add_function 메서드를 통해 텍스트를 bm25 함수에 등록할 수 있습니다. 이 함수는 Milvus 서버 내부에서 실행됩니다. 이후 추가, 삭제, 수정, 쿼리와 같은 모든 데이터 흐름은 벡터 표현이 아닌 원시 텍스트 문자열에 대한 연산을 통해 완료할 수 있습니다. 새로운 API로 텍스트를 수집하고 전체 텍스트 검색을 수행하는 방법은 아래 코드 예시를 참조하세요:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>쿼리와 문서를 <strong>스파스-BM25라는</strong> 스파스 벡터로 표현하는 BM25 연관성 점수 구현을 채택했습니다. 이를 통해 다음과 같은 스파스 벡터를 기반으로 한 많은 최적화가 가능해졌습니다:</p>
<p>Milvus는 전체 텍스트 검색을 벡터 데이터베이스 아키텍처에 통합하는 최첨단 <strong>Sparse-BM25 구현을</strong> 통해 하이브리드 검색 기능을 달성합니다. 용어 빈도를 기존의 역 인덱스 대신 희소 벡터로 표현함으로써 Sparse-BM25는 <strong>그래프 인덱싱</strong>, <strong>제품 양자화(PQ)</strong>, <strong>스칼라 양자화(SQ)</strong>와 같은 고급 최적화를 가능하게 합니다. 이러한 최적화는 메모리 사용량을 최소화하고 검색 성능을 가속화합니다. 역 인덱스 접근 방식과 유사하게, Milvus는 원시 텍스트를 입력으로 받아 내부적으로 스파스 벡터를 생성하는 것을 지원합니다. 이를 통해 모든 토큰화기와 함께 작동하고 동적으로 변화하는 말뭉치에 표시되는 모든 단어를 파악할 수 있습니다.</p>
<p>또한 휴리스틱 기반 가지치기는 가치가 낮은 스파스 벡터를 폐기하여 정확도 저하 없이 효율성을 더욱 향상시킵니다. 스파스 벡터를 사용하는 이전 접근 방식과 달리, BM25 점수의 정확도가 아니라 증가하는 말뭉치에 적응할 수 있습니다.</p>
<ol>
<li>스파스 벡터에 그래프 인덱스를 구축하는 것은 긴 텍스트가 포함된 쿼리에서 반전 인덱스보다 더 나은 성능을 발휘하는데, 반전 인덱스는 쿼리의 토큰 매칭을 완료하는 데 더 많은 단계가 필요하기 때문입니다;</li>
<li>벡터 양자화 및 휴리스틱 기반 가지치기와 같이 검색 품질에 약간의 영향만 미치면서 검색 속도를 높이는 근사화 기법을 활용합니다;</li>
<li>시맨틱 검색과 전체 텍스트 검색을 수행하기 위한 인터페이스와 데이터 모델을 통합하여 사용자 경험을 향상시킵니다.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>요약하자면, Milvus 2.5는 시맨틱 검색을 넘어 전체 텍스트 검색을 도입함으로써 검색 기능을 확장하여 사용자가 고품질의 AI 애플리케이션을 더 쉽게 구축할 수 있도록 지원합니다. 이는 스파스-BM25 검색의 초기 단계에 불과하며, 앞으로 더 많은 최적화를 시도할 수 있을 것으로 예상됩니다.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">텍스트 매칭 검색 필터<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5와 함께 출시된 두 번째 텍스트 검색 기능은 사용자가 특정 텍스트 문자열이 포함된 항목으로 검색을 필터링할 수 있는 <strong>텍스트 일치입니다</strong>. 이 기능 역시 토큰화를 기반으로 구축되었으며 <code translate="no">enable_match=True</code> 에서 활성화됩니다.</p>
<p>텍스트 일치를 사용하면 쿼리 텍스트의 처리가 토큰화 후 OR 논리를 기반으로 한다는 점에 주목할 필요가 있습니다. 예를 들어, 아래 예에서는 '벡터' 또는 '데이터베이스'가 포함된 모든 문서('텍스트' 필드 사용)를 반환합니다.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>시나리오에서 '벡터'와 '데이터베이스'를 모두 일치시켜야 하는 경우, 목표를 달성하려면 두 개의 개별 텍스트 매치를 작성하고 AND로 오버레이해야 합니다.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">스칼라 필터링 성능의 대폭적인 향상<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>우리가 스칼라 필터링 성능에 중점을 둔 것은 벡터 검색과 메타데이터 필터링을 결합하면 다양한 시나리오에서 쿼리 성능과 정확도를 크게 향상시킬 수 있다는 사실을 발견한 데서 비롯되었습니다. 이러한 시나리오는 자율 주행의 코너 케이스 식별과 같은 이미지 검색 애플리케이션부터 기업 지식 베이스의 복잡한 RAG 시나리오에 이르기까지 다양합니다. 따라서 기업 사용자가 대규모 데이터 애플리케이션 시나리오에서 구현하기에 매우 적합합니다.</p>
<p>실제로는 필터링하는 데이터의 양, 데이터 구성 방식, 검색 방식 등 여러 가지 요소가 성능에 영향을 미칠 수 있습니다. 이 문제를 해결하기 위해 Milvus 2.5에서는 비트맵 인덱스, 배열 반전 인덱스, 그리고 바차르 텍스트 필드를 토큰화한 후의 반전 인덱스 등 세 가지 새로운 유형의 인덱스가 도입되었습니다. 이러한 새로운 인덱스는 실제 사용 사례에서 성능을 크게 향상시킬 수 있습니다.</p>
<p>구체적으로 설명하면 다음과 같습니다:</p>
<ol>
<li><strong>비트맵 인덱스는</strong> 태그 필터링을 가속화하는 데 사용할 수 있으며(일반적인 연산자에는 in, array_contains 등이 포함됨), 필드 카테고리 데이터(데이터 카디널리티)가 적은 시나리오에 적합합니다. 원칙은 데이터 행이 열에 특정 값을 가지고 있는지 여부를 1은 예, 0은 아니오로 판단한 다음 비트맵 목록을 유지하는 것입니다. 다음 차트는 고객의 비즈니스 시나리오를 기반으로 수행한 성능 테스트 비교를 보여줍니다. 이 시나리오에서 데이터 볼륨은 5억 개, 데이터 카테고리는 20개, 값의 분포 비율(1%, 5%, 10%, 50%)이 다르며 필터링 양에 따라 성능도 달라집니다. 50% 필터링을 사용하면 비트맵 인덱스를 통해 6.8배의 성능 향상을 달성할 수 있습니다. 카디널리티가 증가함에 따라 비트맵 인덱스에 비해 반전 인덱스가 더 균형 잡힌 성능을 보인다는 점에 주목할 필요가 있습니다.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>텍스트</strong> 일치는 텍스트 필드가 토큰화된 후 반전 인덱스를 기반으로 합니다. 그 성능은 2.4에서 제공한 와일드카드 일치(즉, + %와 같은) 함수를 훨씬 뛰어넘습니다. 내부 테스트 결과에 따르면, 텍스트 일치는 특히 동시 쿼리 시나리오에서 최대 400배의 QPS 증가를 달성할 수 있는 등 그 장점이 매우 분명합니다.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>JSON 데이터 처리와 관련해서는 구문 분석 속도를 높이기 위해 사용자가 지정한 키에 대한 역 인덱스 구축과 모든 키에 대한 기본 위치 정보 기록을 2.5.x 후속 버전에 도입할 계획입니다. 이 두 가지 영역 모두 JSON과 동적 필드의 쿼리 성능을 크게 향상시킬 것으로 기대합니다. 향후 릴리즈 노트와 기술 블로그에서 더 많은 정보를 소개할 예정이니 기대해 주세요!</p>
<h2 id="New-Management-Interface" class="common-anchor-header">새로운 관리 인터페이스<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터베이스를 관리하는 데 컴퓨터 공학 학위가 필요하지는 않지만, 데이터베이스 관리자에게는 강력한 도구가 필요하다는 것을 잘 알고 있습니다. 그렇기 때문에 포트 9091/webui의 클러스터 주소에서 액세스할 수 있는 새로운 웹 기반 인터페이스인 <strong>클러스터 관리 웹UI를</strong> 도입했습니다. 이 통합 가시성 도구는 다음을 제공합니다:</p>
<ul>
<li>클러스터 전체 메트릭을 보여주는 실시간 모니터링 대시보드</li>
<li>노드별 상세 메모리 및 성능 분석</li>
<li>세그먼트 정보 및 느린 쿼리 추적</li>
<li>시스템 상태 표시기 및 노드 상태</li>
<li>복잡한 시스템 문제를 위한 사용하기 쉬운 문제 해결 도구</li>
</ul>
<p>이 인터페이스는 아직 베타 버전이지만, 데이터베이스 관리자의 사용자 피드백을 바탕으로 활발히 개발 중입니다. 향후 업데이트에는 AI 지원 진단, 더 많은 대화형 관리 기능, 향상된 클러스터 관찰 기능이 포함될 예정입니다.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">문서 및 개발자 환경<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>숙련된 사용자를 위해 깊이를 유지하면서 Milvus의 접근성을 높이기 위해 <strong>문서와</strong> <strong>SDK/API</strong> 환경을 완전히 개편했습니다. 개선 사항은 다음과 같습니다:</p>
<ul>
<li>기본 개념부터 고급 개념까지 보다 명확하게 진행되도록 재구성된 문서 시스템</li>
<li>실제 구현을 보여주는 대화형 튜토리얼 및 실제 예제</li>
<li>실용적인 코드 샘플이 포함된 포괄적인 API 레퍼런스</li>
<li>일반적인 작업을 간소화하는 더욱 사용자 친화적인 SDK 디자인</li>
<li>복잡한 개념을 쉽게 이해할 수 있는 그림 가이드</li>
<li>빠른 답변을 제공하는 AI 기반 문서화 도우미(ASK AI)</li>
</ul>
<p>업데이트된 SDK/API는 보다 직관적인 인터페이스와 문서와의 더 나은 통합을 통해 개발자 경험을 개선하는 데 중점을 두었습니다. 2.5.x 시리즈로 작업할 때 이러한 개선 사항을 체감하실 수 있을 것입니다.</p>
<p>하지만 문서와 SDK 개발은 지속적인 과정이라는 것을 잘 알고 있습니다. 커뮤니티의 피드백을 바탕으로 콘텐츠 구조와 SDK 디자인을 계속 최적화해 나갈 것입니다. Discord 채널에 참여하여 제안 사항을 공유하고 개선에 도움을 주세요.</p>
<h2 id="Summary" class="common-anchor-header"><strong>요약</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5에는 질리즈뿐만 아니라 오픈소스 커뮤니티가 기여한 13개의 새로운 기능과 여러 시스템 수준의 최적화가 포함되어 있습니다. 이 글에서는 그 중 일부만 다루었으며, 자세한 내용은 <a href="https://milvus.io/docs/release_notes.md">릴리즈 노트와</a> <a href="https://milvus.io/docs">공식 문서를</a> 참조하시기 바랍니다!</p>
