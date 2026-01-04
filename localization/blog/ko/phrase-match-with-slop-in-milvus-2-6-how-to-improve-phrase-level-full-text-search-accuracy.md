---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: 'Milvus 2.6에서 슬로프가 포함된 구문 일치: 구문 수준의 전체 텍스트 검색 정확도를 개선하는 방법'
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  밀버스 2.6의 구문 검색이 슬로프가 포함된 구문 수준의 전체 텍스트 검색을 지원하여 실제 프로덕션에서 보다 관대한 키워드 필터링을 가능하게
  하는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>비정형 데이터가 계속 폭발적으로 증가하고 AI 모델이 계속 더 똑똑해지면서 벡터 검색은 많은 AI 시스템(RAG 파이프라인, AI 검색, 에이전트, 추천 엔진 등)의 기본 검색 계층이 되었습니다. 벡터 검색은 사용자가 입력하는 단어뿐만 아니라 그 뒤에 숨은 의도까지 파악하기 때문에 효과가 있습니다.</p>
<p>그러나 이러한 애플리케이션이 프로덕션 환경으로 전환되면 팀은 의미론적 이해가 검색 문제의 한 측면에 불과하다는 사실을 알게 되는 경우가 많습니다. 또한 많은 워크로드는 정확한 용어 일치, 어순 유지, 기술적, 법적 또는 운영상 중요한 의미를 지닌 구문 식별과 같은 엄격한 텍스트 규칙에 의존합니다.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6은</a> 벡터 데이터베이스에 직접 기본 전체 텍스트 검색을 도입함으로써 이러한 분할을 제거합니다. 핵심 엔진에 내장된 토큰 및 위치 인덱스를 통해 Milvus는 쿼리의 의미적 의도를 해석하는 동시에 정확한 키워드 및 구문 수준의 제약 조건을 적용할 수 있습니다. 그 결과, 의미와 구조가 별도의 시스템에 존재하는 것이 아니라 서로를 강화하는 통합된 검색 파이프라인이 탄생합니다.</p>
<p><a href="https://milvus.io/docs/phrase-match.md">구문</a> 검색은 이 전체 텍스트 기능의 핵심적인 부분입니다. 이 기능은 순서대로 함께 나타나는 용어의 시퀀스를 식별하며, 로그 패턴, 오류 서명, 제품 이름, 그리고 어순이 의미를 정의하는 모든 텍스트를 탐지하는 데 매우 중요합니다. 이 포스팅에서는 <a href="https://milvus.io/">Milvus에서</a> <a href="https://milvus.io/docs/phrase-match.md">구문</a> 일치가 어떻게 작동하는지, <code translate="no">slop</code> 이 실제 텍스트에 필요한 유연성을 어떻게 추가하는지, 그리고 이러한 기능들이 단일 데이터베이스 내에서 하이브리드 벡터-풀텍스트 검색을 가능하게 할 뿐만 아니라 실용적으로 만드는 이유에 대해 설명합니다.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">구문 검색이란 무엇인가요?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>구문 일치는 문서 내에서 일련의 단어가 같은 순서로 나타나는지 여부, 즉 <em>구조에</em>초점을 맞춘 Milvus의 전체 텍스트 쿼리 유형입니다. 유연성이 허용되지 않는 경우 쿼리는 엄격하게 작동하며, 용어가 서로 나란히 순서대로 나타나야 합니다. 따라서 <strong>'로봇 공학 머신 러닝'</strong> 과 같은 쿼리는 세 단어가 연속된 구문으로 나타날 때만 일치합니다.</p>
<p>문제는 실제 텍스트가 이렇게 깔끔하게 동작하는 경우가 드물다는 것입니다. 자연어에는 추가 형용사가 끼어들고, 필드 순서가 바뀌고, 제품 이름에 수식어가 붙고, 작성자가 쿼리 엔진을 염두에 두고 작성하지 않는 등 노이즈가 발생하기 마련입니다. 엄격한 구문 일치는 단어 하나, 문구 하나, 용어 하나만 바뀌어도 쉽게 깨질 수 있습니다. 그리고 많은 AI 시스템, 특히 프로덕션을 대상으로 하는 시스템에서는 관련 로그 라인이나 규칙을 트리거하는 문구가 누락되는 것은 용납되지 않습니다.</p>
<p>Milvus 2.6은 <strong>슬로프라는</strong> 간단한 메커니즘으로 이러한 마찰을 해결합니다. 슬로프는 <em>쿼리</em> 용어 <em>사이에 허용되는 여백의 양을</em> 정의합니다. 슬로프를 사용하면 구문을 유연하지 못한 것으로 취급하는 대신 한 단어가 추가되는 것을 허용할지, 두 단어를 허용할지, 심지어 약간의 순서를 바꿔도 일치로 간주할지 여부를 결정할 수 있습니다. 이는 구문 검색을 이진 합격/불합격 테스트에서 제어되고 조정 가능한 검색 도구로 전환합니다.</p>
<p>이것이 왜 중요한지 알아보려면 익숙한 네트워킹 오류인 <strong>"피어에 의한 연결 재설정"</strong> 의 모든 변종에 대해 로그를 검색한다고 상상해 보세요. 실제로 로그는 다음과 같이 보일 수 있습니다:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>한눈에 보기에는 모두 동일한 기본 이벤트를 나타냅니다. 하지만 일반적인 검색 방법으로는 어려움을 겪습니다:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25는 구조적으로 어려움을 겪습니다.</h3><p>쿼리를 키워드가 나타나는 순서를 무시한 채 키워드의 묶음으로 간주합니다. '연결'과 '피어'가 어딘가에 나타나기만 하면, BM25는 문구가 거꾸로 되어 있거나 실제로 검색하는 개념과 관련이 없는 경우에도 문서의 순위를 높게 매길 수 있습니다.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">벡터 검색은 제약 조건으로 인해 어려움을 겪습니다.</h3><p>임베딩은 의미와 의미 관계를 포착하는 데는 탁월하지만 "이 단어는 이 순서로 나타나야 한다"와 같은 규칙을 적용할 수는 없습니다. 의미적으로 관련된 메시지를 검색할 수는 있지만 디버깅이나 규정 준수에 필요한 정확한 구조 패턴을 놓칠 수 있습니다.</p>
<p>구문 일치는 이 두 가지 접근 방식 사이의 간극을 메워줍니다. <strong>슬로프를</strong> 사용하면 허용되는 변형의 정도를 정확히 지정할 수 있습니다:</p>
<ul>
<li><p><code translate="no">slop = 0</code> - 정확히 일치(모든 용어가 연속적으로 순서대로 나타나야 합니다.)</p></li>
<li><p><code translate="no">slop = 1</code> - 추가 단어 하나 허용(하나의 삽입된 용어로 일반적인 자연어 변형을 다룹니다.)</p></li>
<li><p><code translate="no">slop = 2</code> - 여러 단어 삽입 허용(보다 설명적이거나 장황한 문구를 처리합니다.)</p></li>
<li><p><code translate="no">slop = 3</code> - 순서 바꾸기 허용(실제 텍스트에서 가장 어려운 경우인 반전되거나 느슨하게 정렬된 구문을 지원합니다.)</p></li>
</ul>
<p>채점 알고리즘이 "제대로 맞추기를" 바라는 대신 애플리케이션에 필요한 구조적 허용 오차를 명시적으로 선언하세요.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Milvus에서 구문 일치가 작동하는 방식<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/quickwit-oss/tantivy">Tantivy</a> 검색 엔진 라이브러리를 기반으로 하는 Milvus의 구문 일치는 위치 정보가 포함된 반전 인덱스 위에 구현됩니다. 문서에 용어가 나타나는지 여부만 확인하는 것이 아니라, 용어가 올바른 순서와 제어 가능한 거리 내에 나타나는지 확인합니다.</p>
<p>아래 다이어그램은 그 과정을 보여줍니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. 문서 토큰화(위치 포함)</strong></p>
<p>문서가 Milvus에 삽입되면 텍스트 필드는 <a href="https://milvus.io/docs/analyzer-overview.md">분석기에</a> 의해 처리되며, <a href="https://milvus.io/docs/analyzer-overview.md">분석기는</a> 텍스트를 토큰(단어 또는 용어)으로 분할하고 문서 내에서 각 토큰의 위치를 기록합니다. 예를 들어 <code translate="no">doc_1</code> 는 토큰화되어 다음과 같이 표시됩니다: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. 역 인덱스 생성</strong></p>
<p>다음으로 Milvus는 반전 인덱스를 생성합니다. 반전 인덱스는 문서를 콘텐츠에 매핑하는 대신 각 토큰을 해당 토큰이 나타나는 문서에 매핑하고 각 문서 내에서 해당 토큰의 모든 기록된 위치를 매핑합니다.</p>
<p><strong>3. 구문 매칭</strong></p>
<p>구문 쿼리가 실행되면 Milvus는 먼저 반전된 인덱스를 사용하여 모든 쿼리 토큰이 포함된 문서를 식별합니다. 그런 다음 토큰 위치를 비교하여 각 후보를 검증하여 용어가 올바른 순서와 허용된 <code translate="no">slop</code> 거리 내에 표시되는지 확인합니다. 두 조건을 모두 만족하는 문서만 일치하는 문서로 반환됩니다.</p>
<p>아래 다이어그램은 구문 일치가 엔드투엔드로 작동하는 방식을 요약한 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">Milvus에서 구문 일치를 활성화하는 방법<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>구문 일치는 다음과 같은 유형의 필드에서 작동합니다. <strong><code translate="no">VARCHAR</code></strong>유형의 필드에서 작동합니다. 이를 사용하려면 Milvus가 텍스트 분석을 수행하고 필드에 대한 위치 정보를 저장하도록 컬렉션 스키마를 구성해야 합니다. 이는 <code translate="no">enable_analyzer</code> 와 <code translate="no">enable_match</code> 의 두 매개 변수를 활성화하여 수행됩니다.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">enable_analyzer 및 enable_match 설정하기</h3><p>특정 VARCHAR 필드에 대해 구문 일치를 켜려면 필드 스키마를 정의할 때 두 매개변수를 <code translate="no">True</code> 으로 설정하세요. 이 두 매개변수는 함께 Milvus에 다음을 지시합니다:</p>
<ul>
<li><p>텍스트를<strong>토큰화</strong> ( <code translate="no">enable_analyzer</code> 를 통해), 그리고</p></li>
<li><p><strong>위치 오프셋이 있는 역 인덱스를 구축합니다</strong> ( <code translate="no">enable_match</code>).</p></li>
</ul>
<p>분석기는 텍스트를 토큰으로 나누고, 일치 인덱스는 그 토큰이 나타나는 위치를 저장하여 효율적인 구문 및 경사 기반 쿼리를 가능하게 합니다.</p>
<p>다음은 <code translate="no">text</code> 필드에서 구문 일치를 활성화하는 스키마 구성의 예입니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">구문 일치를 사용하여 검색: 슬로프가 후보 집합에 미치는 영향<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>컬렉션 스키마에서 VARCHAR 필드에 대해 일치를 사용하도록 설정한 후에는 <code translate="no">PHRASE_MATCH</code> 표현식을 사용하여 구문 일치를 수행할 수 있습니다.</p>
<p>참고: <code translate="no">PHRASE_MATCH</code> 표현식은 대소문자를 구분하지 않습니다. <code translate="no">PHRASE_MATCH</code> 또는 <code translate="no">phrase_match</code> 을 사용할 수 있습니다.</p>
<p>검색 작업에서 구문 일치는 일반적으로 벡터 유사도 순위보다 먼저 적용됩니다. 먼저 명시적인 텍스트 제약 조건에 따라 문서를 필터링하여 후보 집합을 좁힙니다. 그런 다음 벡터 임베딩을 사용하여 나머지 문서의 순위를 다시 매깁니다.</p>
<p>아래 예는 다양한 <code translate="no">slop</code> 값이 이 프로세스에 어떤 영향을 미치는지 보여줍니다. <code translate="no">slop</code> 매개변수를 조정하여 구문 필터를 통과하고 벡터 순위 지정 단계로 진행할 문서를 직접 제어할 수 있습니다.</p>
<p>다음 5개의 엔터티가 포함된 <code translate="no">tech_articles</code> 이라는 이름의 컬렉션이 있다고 가정해 보겠습니다:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>text</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>대규모 데이터 분석의 효율성을 높여주는 머신 러닝</td></tr>
<tr><td>2</td><td>기계 기반 접근 방식 학습은 최신 AI 발전에 필수적입니다.</td></tr>
<tr><td>3</td><td>계산 부하를 최적화하는 딥 러닝 머신 아키텍처</td></tr>
<tr><td>4</td><td>지속적인 학습을 위해 모델 성능을 빠르게 개선하는 머신 러닝</td></tr>
<tr><td>5</td><td>고급 머신 알고리즘 학습으로 AI 기능 확장</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>여기서는 1의 기울기를 허용합니다. 이 필터는 '학습 기계'라는 문구가 포함된 문서에 약간의 유연성을 가지고 적용됩니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>일치 결과</p>
<table>
<thead>
<tr><th>doc_id</th><th>text</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>기계 기반 접근 방식 학습은 최신 AI 발전에 필수적입니다.</td></tr>
<tr><td>3</td><td>계산 부하를 최적화하는 딥 러닝 머신 아키텍처</td></tr>
<tr><td>5</td><td>고급 머신 알고리즘 학습으로 AI 기능 확장</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>이 예에서는 슬로프가 2로, '기계'와 '학습'이라는 단어 사이에 최대 2개의 추가 토큰(또는 반전된 용어)이 허용됩니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>일치 결과:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>text</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">대규모 데이터 분석의 효율성을 높여주는 머신 러닝</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">계산 부하를 최적화하는 딥 러닝 머신 아키텍처</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>이 예에서 슬로프 3은 훨씬 더 많은 유연성을 제공합니다. 이 필터는 단어 사이에 최대 3개의 토큰 위치가 허용되는 "머신 러닝"을 검색합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>일치하는 결과:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>text</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">대규모 데이터 분석의 효율성을 높여주는 머신 러닝</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">기계 기반 접근 방식 학습은 최신 AI 발전에 필수적입니다.</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">계산 부하를 최적화하는 딥 러닝 머신 아키텍처</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">고급 머신 알고리즘 학습을 통한 AI 기능 확장</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">빠른 팁 Milvus에서 구문 일치를 활성화하기 전에 알아야 할 사항<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>구문 일치는 구문 수준 필터링을 지원하지만, 이를 활성화하려면 쿼리 시 구성 이상의 작업이 필요합니다. 프로덕션 환경에서 적용하기 전에 관련 고려 사항을 숙지하는 것이 도움이 됩니다.</p>
<ul>
<li><p>필드에서 구문 일치를 사용하도록 설정하면 역 인덱스가 생성되므로 스토리지 사용량이 증가합니다. 정확한 비용은 텍스트 길이, 고유 토큰 수, 분석기 구성과 같은 요인에 따라 달라집니다. 큰 텍스트 필드나 카디널리티가 높은 데이터로 작업할 때는 이러한 오버헤드를 미리 고려해야 합니다.</p></li>
<li><p>분석기 구성은 또 다른 중요한 설계 선택입니다. 수집 스키마에 분석기가 정의되면 변경할 수 없습니다. 나중에 다른 분석기로 전환하려면 기존 컬렉션을 삭제하고 새 스키마로 다시 만들어야 합니다. 따라서 분석기 선택은 실험이 아닌 장기적인 결정으로 취급해야 합니다.</p></li>
<li><p>구문 일치 동작은 텍스트가 토큰화되는 방식과 밀접하게 연관되어 있습니다. 전체 컬렉션에 분석기를 적용하기 전에 <code translate="no">run_analyzer</code> 방법을 사용하여 토큰화 출력을 검사하고 예상과 일치하는지 확인하는 것이 좋습니다. 이 단계는 나중에 미묘한 불일치 및 예기치 않은 쿼리 결과를 방지하는 데 도움이 될 수 있습니다. 자세한 내용은 <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">분석기 개요를</a> 참조하세요.</p></li>
</ul>
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
    </button></h2><p>구문 검색은 단순한 키워드 일치를 넘어 구문 수준 및 위치 제한을 가능하게 하는 핵심적인 전체 텍스트 검색 유형입니다. 토큰 순서와 근접성을 기반으로 작동함으로써, 용어가 실제로 텍스트에 나타나는 방식에 따라 문서를 필터링하는 예측 가능하고 정확한 방법을 제공합니다.</p>
<p>최신 검색 시스템에서 구문 검색은 일반적으로 벡터 기반 랭킹보다 먼저 적용됩니다. 먼저 후보 집합을 필요한 구문이나 구조를 명시적으로 충족하는 문서로 제한합니다. 그런 다음 벡터 검색을 사용하여 의미론적 관련성에 따라 이러한 결과의 순위를 매깁니다. 이 패턴은 의미적 유사성을 고려하기 전에 텍스트 제약 조건을 적용해야 하는 로그 분석, 기술 문서 검색, RAG 파이프라인과 같은 시나리오에서 특히 효과적입니다.</p>
<p>Milvus 2.6에 <code translate="no">slop</code> 매개변수가 도입됨에 따라, 구문 일치는 전체 텍스트 필터링 메커니즘으로서의 역할을 유지하면서 자연어 변형에 더욱 관대해졌습니다. 따라서 프로덕션 검색 워크플로우에서 구문 수준 제약 조건을 더 쉽게 적용할 수 있습니다.</p>
<p><a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">데모</a> 스크립트를 통해 사용해 보고, <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6을</a> 살펴보고 구문 인식 검색이 스택에 어떻게 적용되는지 알아보세요.</p>
<p>궁금한 점이 있거나 최신 Milvus의 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에서</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내, 질문에 대한 답변을 얻을 수도 있습니다.</p>
