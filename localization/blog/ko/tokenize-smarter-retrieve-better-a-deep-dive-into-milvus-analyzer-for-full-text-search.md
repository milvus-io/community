---
id: >-
  tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
title: '더 스마트한 토큰화, 더 나은 검색: 전체 텍스트 검색을 위한 Milvus 분석기 자세히 알아보기'
author: Jack Li
date: 2025-10-16T00:00:00.000Z
desc: >-
  효율적인 토큰화 및 필터링을 통해 더 빠르고 스마트한 전체 텍스트 검색을 지원하는 Milvus Analyzer가 어떻게 하이브리드 AI
  검색을 지원하는지 알아보세요.
cover: assets.zilliz.com/Milvus_Analyzer_2_ccde10876e.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_title: |
  A Deep Dive into Milvus Analyzer for Full-Text Search
meta_keywords: 'Milvus Analyzer, RAG, full-text search, vector database, tokenization'
origin: >-
  https://milvus.io/blog/tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
---
<p>최신 AI 애플리케이션은 복잡하고 일차원적인 경우가 드뭅니다. 많은 경우 단일 검색 방법만으로는 현실의 문제를 해결할 수 없습니다. 추천 시스템을 예로 들어보겠습니다. 텍스트나 이미지의 의미를 이해하기 위해서는 <strong>벡터 검색</strong>, 가격, 카테고리 또는 위치별로 결과를 세분화하기 위한 <strong>메타데이터 필터링</strong>, "Nike Air Max"와 같은 직접 검색을 처리하기 위한<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md"> <strong>전체 텍스트 검색이</strong></a> 필요합니다. 각 방법은 퍼즐의 다른 부분을 해결하며, 실제 시스템은 이 모든 방법이 원활하게 함께 작동하는 데 달려 있습니다.</p>
<p>Milvus는 벡터 검색과 메타데이터 필터링에 탁월하며, 버전 2.5부터는 최적화된 BM25 알고리즘에 기반한 전체 텍스트 검색을 도입했습니다. 이번 업그레이드를 통해 의미론적 이해와 정확한 키워드 의도를 결합하여 AI 검색이 더욱 스마트하고 정확해졌습니다.<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> Milvus 2.6을</a> 통해 전체 텍스트 검색은<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> Elasticsearch의 성능보다 최대 4배까지</a> 빨라집니다.</p>
<p>이 기능의 핵심은 원시 텍스트를 검색 가능한 토큰으로 변환하는 구성 요소인 <strong>Milvus Analyzer입니다</strong>. Milvus가 언어를 효율적으로 해석하고 대규모로 키워드 매칭을 수행할 수 있게 해주는 것이 바로 이 분석기입니다. 이 글의 나머지 부분에서는 Milvus 분석기가 어떻게 작동하는지, 그리고 왜 Milvus에서 하이브리드 검색의 잠재력을 최대한 활용하는 데 핵심적인 역할을 하는지 자세히 살펴보겠습니다.</p>
<h2 id="What-is-Milvus-Analyzer" class="common-anchor-header">Milvus 분석기란 무엇인가요?<button data-href="#What-is-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>키워드 매칭이든 시맨틱 검색이든 효율적인 전체 텍스트 검색을 위해서는 시스템이 이해하고 색인하고 비교할 수 있는 토큰으로 원시 텍스트를 변환하는 첫 번째 단계가 항상 동일합니다.</p>
<p><strong>Milvus 분석기는</strong> 이 단계를 처리합니다. 이는 내장된 텍스트 전처리 및 토큰화 구성 요소로, 입력 텍스트를 개별 토큰으로 나눈 다음 정규화, 정리, 표준화하여 쿼리와 문서 전반에서 일관된 일치를 보장합니다. 이 프로세스는 정확한 고성능 전체 텍스트 검색과 하이브리드 검색을 위한 토대를 마련합니다.</p>
<p>밀버스 애널라이저 아키텍처의 개요는 다음과 같습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_5_8e0ec1dbdf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>다이어그램에서 볼 수 있듯이, 분석기에는 <strong>토큰화기와</strong> <strong>필터라는</strong> 두 가지 핵심 구성 요소가 있습니다. 이들은 함께 입력 텍스트를 토큰으로 변환하고 효율적인 색인 및 검색을 위해 이를 최적화합니다.</p>
<ul>
<li><p><strong>토큰화기</strong>: 공백 분할(공백), 중국어 단어 분할(Jieba) 또는 다국어 분할(ICU) 등의 방법을 사용하여 텍스트를 기본 토큰으로 분할합니다.</p></li>
<li><p><strong>필터</strong>: 특정 변환을 통해 토큰을 처리합니다. Milvus에는 대소문자 정규화(Lowercase), 구두점 제거(Removepunct), 단어 필터링 중지(Stop), 어간 제거(Stemmer), 패턴 일치(Regex) 등의 작업을 위한 풍부한 내장 필터 세트가 포함되어 있습니다. 여러 필터를 연결하여 복잡한 처리 요구를 처리할 수 있습니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tokenizer_70a57e893c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus는 세 가지 기본 제공 옵션(표준, 영어, 중국어), 토큰화기와 필터 조합을 직접 정의하는 사용자 정의 분석기, 다국어 문서 처리를 위한 다국어 분석기 등 여러 가지 분석기 유형을 제공합니다. 처리 흐름은 간단합니다: 원시 텍스트 → 토큰화기 → 필터 → 토큰.</p>
<h3 id="Tokenizer" class="common-anchor-header">토큰화기</h3><p>토큰화기는 첫 번째 처리 단계입니다. 원시 텍스트를 더 작은 토큰(단어 또는 하위 단어)으로 분할하며, 언어와 사용 사례에 따라 올바른 선택이 달라집니다.</p>
<p>Milvus는 현재 다음과 같은 유형의 토큰화기를 지원합니다:</p>
<table>
<thead>
<tr><th><strong>토큰화기</strong></th><th><strong>사용 사례</strong></th><th><strong>설명</strong></th></tr>
</thead>
<tbody>
<tr><td>표준</td><td>영어 및 공백으로 구분된 언어</td><td>가장 일반적인 범용 토큰화 도구로, 단어 경계를 감지하고 그에 따라 분할합니다.</td></tr>
<tr><td>공백</td><td>최소한의 전처리를 거친 간단한 텍스트</td><td>공백으로만 분할하며 구두점이나 대소문자는 처리하지 않습니다.</td></tr>
<tr><td>지에바(중국어)</td><td>중국어 텍스트</td><td>연속된 중국어 문자를 의미 있는 단어로 분할하는 사전 및 확률 기반 토큰화기.</td></tr>
<tr><td>린데라(일본어/KR)</td><td>일본어 및 한국어 텍스트</td><td>효과적인 분할을 위해 린데라 형태소 분석을 사용합니다.</td></tr>
<tr><td>ICU（다중 언어)</td><td>아랍어와 같은 복잡한 언어 및 다국어 시나리오</td><td>유니코드 전반에 걸친 다국어 토큰화를 지원하는 ICU 라이브러리를 기반으로 합니다.</td></tr>
</tbody>
</table>
<p>컬렉션의 스키마를 생성할 때, 특히 <code translate="no">analyzer_params</code> 매개변수를 통해 <code translate="no">VARCHAR</code> 필드를 정의할 때 토큰화기를 구성할 수 있습니다. 즉, 토큰화기는 독립형 객체가 아니라 필드 수준의 구성입니다. Milvus는 데이터를 삽입할 때 토큰화 및 전처리를 자동으로 수행합니다.</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
       <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>   <span class="hljs-comment"># Configure Tokenizer here</span>
    }
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Filter" class="common-anchor-header">필터</h3><p>토큰화기가 텍스트를 잘라내면, 필터는 남은 부분을 정제합니다. 필터는 토큰을 표준화, 정리 또는 변환하여 검색할 수 있도록 합니다.</p>
<p>일반적인 필터 작업에는 대소문자 정규화, 중단어 제거("the", "and" 등), 구두점 제거, 어간 적용("running"을 "run"으로 축소)이 포함됩니다.</p>
<p>Milvus에는 대부분의 언어 처리 요구에 맞는 다양한 기본 제공 필터가 포함되어 있습니다:</p>
<table>
<thead>
<tr><th><strong>필터 이름</strong></th><th><strong>기능</strong></th><th><strong>사용 사례</strong></th></tr>
</thead>
<tbody>
<tr><td>소문자</td><td>모든 토큰을 소문자로 변환합니다.</td><td>대소문자 불일치를 피하기 위해 영어 검색에 필수적입니다.</td></tr>
<tr><td>Asciifolding</td><td>악센트가 있는 문자를 ASCII로 변환합니다.</td><td>다국어 시나리오(예: "카페" → "카페")</td></tr>
<tr><td>알파벳만</td><td>문자와 숫자만 유지</td><td>로그와 같은 텍스트에서 혼합 기호를 제거합니다.</td></tr>
<tr><td>Cncharonly</td><td>중국어 문자만 유지</td><td>중국어 말뭉치 정리</td></tr>
<tr><td>Cnalphanumonly</td><td>중국어, 영어, 숫자만 유지</td><td>중국어-영어 혼합 텍스트</td></tr>
<tr><td>길이</td><td>길이별로 토큰 필터링</td><td>지나치게 짧거나 긴 토큰을 제거합니다.</td></tr>
<tr><td>중지</td><td>단어 필터링 중지</td><td>"is", "the"와 같이 빈도가 높은 무의미한 단어를 제거합니다.</td></tr>
<tr><td>합성어 분해기</td><td>복합어 분할</td><td>독일어, 네덜란드어와 같이 복합어가 빈번하게 사용되는 언어</td></tr>
<tr><td>Stemmer</td><td>단어 어간 제거</td><td>영어 시나리오(예: &quot;연구&quot; 및 &quot;공부&quot; → &quot;공부&quot;)</td></tr>
<tr><td>구두점 제거</td><td>구두점 제거</td><td>일반 텍스트 정리</td></tr>
<tr><td>정규식</td><td>정규식 패턴으로 필터링 또는 바꾸기</td><td>이메일 주소만 추출하는 등 사용자 지정 요구사항</td></tr>
</tbody>
</table>
<p>필터의 강점은 유연성에 있습니다. 필요에 따라 정리 규칙을 혼합하고 조합할 수 있습니다. 영어 검색의 경우 소문자 + 마침표 + 어간을 조합하여 대소문자 통일성을 보장하고, 필러 단어를 제거하고, 단어 형태를 어간에 맞게 정규화하는 것이 일반적입니다.</p>
<p>중국어 검색의 경우, 더 깔끔하고 정확한 결과를 위해 일반적으로 소문자만 + 중지를 조합합니다. 필드 스키마에서 <code translate="no">analyzer_params</code> 을 통해 토큰화기와 동일한 방식으로 필터를 구성하세요:</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
        <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
               <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
               <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
    }
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Analyzer-Types" class="common-anchor-header">분석기 유형<button data-href="#Analyzer-Types" class="anchor-icon" translate="no">
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
    </button></h2><p>올바른 분석기를 사용하면 검색 속도와 비용 효율을 모두 높일 수 있습니다. 다양한 요구 사항을 충족하기 위해 Milvus는 세 가지 유형을 제공합니다: 기본 제공, 다국어 및 사용자 지정 분석기입니다.</p>
<h3 id="Built-in-Analyzer" class="common-anchor-header">기본 제공 분석기</h3><p>기본 제공 분석기는 대부분의 일반적인 시나리오에 적합한 표준 구성으로 바로 사용할 수 있습니다. 미리 정의된 토큰화 도구 및 필터 조합이 함께 제공됩니다:</p>
<table>
<thead>
<tr><th><strong>이름</strong></th><th><strong>구성 요소(토큰화기+필터)</strong></th><th><strong>사용 사례</strong></th></tr>
</thead>
<tbody>
<tr><td>표준</td><td>표준 토큰화기 + 소문자</td><td>영어 또는 공백으로 구분된 언어에 일반적으로 사용</td></tr>
<tr><td>영어</td><td>표준 토큰화기 + 소문자 + 중지 + 스템머</td><td>더 높은 정확도의 영어 검색</td></tr>
<tr><td>중국어</td><td>지에바 토큰화 + 소문자 전용</td><td>자연스러운 단어 세분화를 통한 중국어 텍스트 검색</td></tr>
</tbody>
</table>
<p>간단한 영어 또는 중국어 검색의 경우, 이러한 기본 제공 분석기는 별도의 설정 없이 작동합니다.</p>
<p>한 가지 중요한 점은 표준 분석기는 기본적으로 영어용으로 설계되었다는 점입니다. 중국어 텍스트에 적용하면 전체 텍스트 검색에서 결과가 표시되지 않을 수 있습니다.</p>
<h3 id="Multi-language-Analyzer" class="common-anchor-header">다국어 분석기</h3><p>여러 언어를 다룰 때는 단일 토큰 분석기로는 모든 것을 처리할 수 없는 경우가 많습니다. 다국어 분석기는 각 텍스트의 언어에 따라 적합한 토큰화 도구를 자동으로 선택해 줍니다. 다음은 언어가 토큰화기에 매핑되는 방식입니다:</p>
<table>
<thead>
<tr><th><strong>언어 코드</strong></th><th><strong>사용되는 토큰화 도구</strong></th></tr>
</thead>
<tbody>
<tr><td>한국어</td><td>영어 분석기</td></tr>
<tr><td>zh</td><td>Jieba</td></tr>
<tr><td>ja / ko</td><td>Lindera</td></tr>
<tr><td>ar</td><td>ICU</td></tr>
</tbody>
</table>
<p>데이터 세트에 영어, 중국어, 일본어, 한국어, 심지어 아랍어가 섞여 있는 경우에도 Milvus는 동일한 필드에서 이를 모두 처리할 수 있습니다. 따라서 수동 전처리를 대폭 줄일 수 있습니다.</p>
<h3 id="Custom-Analyzer" class="common-anchor-header">맞춤형 분석기</h3><p>기본 제공 또는 다국어 분석기가 적합하지 않은 경우, Milvus를 사용하면 맞춤형 분석기를 구축할 수 있습니다. 토큰화기와 필터를 믹스 앤 매치하여 필요에 맞는 것을 만들 수 있습니다. 다음은 예시입니다:</p>
<pre><code translate="no">FieldSchema(
        name=<span class="hljs-string">&quot;text&quot;</span>,
        dtype=DataType.VARCHAR,
        max_length=<span class="hljs-number">512</span>,
        analyzer_params={
           <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;jieba&quot;</span>,  
            <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;cncharonly&quot;</span>, <span class="hljs-string">&quot;stop&quot;</span>]  <span class="hljs-comment"># Custom combination for mixed Chinese-English text</span>
        }
    )
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hands-on-Coding-with-Milvus-Analyzer" class="common-anchor-header">Milvus 애널라이저로 실습 코딩하기<button data-href="#Hands-on-Coding-with-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>이론도 도움이 되지만, 전체 코드 예제를 능가하는 것은 없습니다. 기본 제공 분석기와 다국어 분석기를 모두 다루는 Python SDK로 Milvus에서 분석기를 사용하는 방법을 살펴보겠습니다. 이 예제에서는 Milvus v2.6.1 및 Pymilvus v2.6.1을 사용합니다.</p>
<h3 id="How-to-Use-Built-in-Analyzer" class="common-anchor-header">기본 제공 분석기 사용 방법</h3><p>데이터 삽입 중에 토큰화 및 전처리를 자동으로 처리하는 영어 텍스트 검색용 컬렉션을 구축하고자 한다고 가정해 보겠습니다. 내장된 영어 분석기( <code translate="no">standard + lowercase + stop + stemmer</code> )를 사용하겠습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

schema = client.create_schema()

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,                  <span class="hljs-comment"># Field name</span>
    datatype=DataType.INT64,          <span class="hljs-comment"># Integer data type</span>
    is_primary=<span class="hljs-literal">True</span>,                  <span class="hljs-comment"># Designate as primary key</span>
    auto_id=<span class="hljs-literal">True</span>                      <span class="hljs-comment"># Auto-generate IDs (recommended)</span>
)

schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">1000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    analyzer_params={
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
            <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
            <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
        },
    enable_match=<span class="hljs-literal">True</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,                   <span class="hljs-comment"># Field name</span>
    datatype=DataType.SPARSE_FLOAT_VECTOR  <span class="hljs-comment"># Sparse vector data type</span>
)

bm25_function = Function(
    name=<span class="hljs-string">&quot;text_to_vector&quot;</span>,            <span class="hljs-comment"># Descriptive function name</span>
    function_type=FunctionType.BM25,  <span class="hljs-comment"># Use BM25 algorithm</span>
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],       <span class="hljs-comment"># Process text from this field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>]     <span class="hljs-comment"># Store vectors in this field</span>
)

schema.add_function(bm25_function)

index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,        <span class="hljs-comment"># Field to index (our vector field)</span>
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,     <span class="hljs-comment"># Let Milvus choose optimal index type</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>          <span class="hljs-comment"># Must be BM25 for this feature</span>
)

COLLECTION_NAME = <span class="hljs-string">&quot;english_demo&quot;</span>

<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)  
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

client.create_collection(
    collection_name=COLLECTION_NAME,       <span class="hljs-comment"># Collection name</span>
    schema=schema,                         <span class="hljs-comment"># Our schema</span>
    index_params=index_params              <span class="hljs-comment"># Our search index configuration</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully created collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Prepare sample data</span>
sample_texts = [
    <span class="hljs-string">&quot;The quick brown fox jumps over the lazy dog&quot;</span>,
    <span class="hljs-string">&quot;Machine learning algorithms are revolutionizing artificial intelligence&quot;</span>,  
    <span class="hljs-string">&quot;Python programming language is widely used for data science projects&quot;</span>,
    <span class="hljs-string">&quot;Natural language processing helps computers understand human languages&quot;</span>,
    <span class="hljs-string">&quot;Deep learning models require large amounts of training data&quot;</span>,
    <span class="hljs-string">&quot;Search engines use complex algorithms to rank web pages&quot;</span>,
    <span class="hljs-string">&quot;Text analysis and information retrieval are important NLP tasks&quot;</span>,
    <span class="hljs-string">&quot;Vector databases enable efficient similarity searches&quot;</span>,
    <span class="hljs-string">&quot;Stemming reduces words to their root forms for better searching&quot;</span>,
    <span class="hljs-string">&quot;Stop words like &#x27;the&#x27;, &#x27;and&#x27;, &#x27;of&#x27; are often filtered out&quot;</span>
]

<span class="hljs-comment"># Insert data</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nInserting data...&quot;</span>)
data = [{<span class="hljs-string">&quot;text&quot;</span>: text} <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> sample_texts]

client.insert(
    collection_name=COLLECTION_NAME,
    data=data
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_texts)}</span> records&quot;</span>)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Tokenizer Analysis Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

test_text = <span class="hljs-string">&quot;The running dogs are jumping over the lazy cats&quot;</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nOriginal text: &#x27;<span class="hljs-subst">{test_text}</span>&#x27;&quot;</span>)

<span class="hljs-comment"># Use run_analyzer to show tokenization results</span>
analyzer_result = client.run_analyzer(
    texts=test_text,
    collection_name=COLLECTION_NAME,
    field_name=<span class="hljs-string">&quot;text&quot;</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Tokenization result: <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nBreakdown:&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- lowercase: Converts all letters to lowercase&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stop words: Filtered out [&#x27;of&#x27;, &#x27;to&#x27;] and common English stop words&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)&quot;</span>)

<span class="hljs-comment"># Full-text search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Full-Text Search Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

<span class="hljs-comment"># Wait for indexing to complete</span>
<span class="hljs-keyword">import</span> time
time.sleep(<span class="hljs-number">2</span>)

<span class="hljs-comment"># Search query examples</span>
search_queries = [
    <span class="hljs-string">&quot;jump&quot;</span>,           <span class="hljs-comment"># Test stem matching (should match &quot;jumps&quot;)</span>
    <span class="hljs-string">&quot;algorithm&quot;</span>,      <span class="hljs-comment"># Test exact matching</span>
    <span class="hljs-string">&quot;python program&quot;</span>, <span class="hljs-comment"># Test multi-word query</span>
    <span class="hljs-string">&quot;learn&quot;</span>          <span class="hljs-comment"># Test stem matching (should match &quot;learning&quot;)</span>
]

<span class="hljs-keyword">for</span> i, query <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_queries, <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery <span class="hljs-subst">{i}</span>: &#x27;<span class="hljs-subst">{query}</span>&#x27;&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
    
    <span class="hljs-comment"># Execute full-text search</span>
    search_results = client.search(
        collection_name=COLLECTION_NAME,
        data=[query],                    <span class="hljs-comment"># Query text</span>
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>],         <span class="hljs-comment"># Return original text</span>
        limit=<span class="hljs-number">3</span>                         <span class="hljs-comment"># Return top 3 results</span>
    )
    
    <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
        <span class="hljs-keyword">for</span> j, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_results[<span class="hljs-number">0</span>], <span class="hljs-number">1</span>):
            score = result[<span class="hljs-string">&quot;distance&quot;</span>]
            text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Result <span class="hljs-subst">{j}</span> (relevance: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>): <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No relevant results found&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search complete！&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<button class="copy-code-btn"></button></code></pre>
<p>결과: 출력</p>
<pre><code translate="no">Dropped existing collection: english_demo
Successfully created collection: english_demo

Inserting data...
Successfully inserted <span class="hljs-number">10</span> records

============================================================
Tokenizer Analysis Demo
============================================================

Original text: <span class="hljs-string">&#x27;The running dogs are jumping over the lazy cats&#x27;</span>
Tokenization result: [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;dog&#x27;</span>, <span class="hljs-string">&#x27;jump&#x27;</span>, <span class="hljs-string">&#x27;over&#x27;</span>, <span class="hljs-string">&#x27;lazi&#x27;</span>, <span class="hljs-string">&#x27;cat&#x27;</span>]

Breakdown:
- lowercase: Converts <span class="hljs-built_in">all</span> letters to lowercase
- stop words: Filtered out [<span class="hljs-string">&#x27;of&#x27;</span>, <span class="hljs-string">&#x27;to&#x27;</span>] <span class="hljs-keyword">and</span> common English stop words
- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)

============================================================
Full-Text Search Demo
============================================================

Query <span class="hljs-number">1</span>: <span class="hljs-string">&#x27;jump&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">2.0040</span>): The quick brown fox jumps over the lazy dog

Query <span class="hljs-number">2</span>: <span class="hljs-string">&#x27;algorithm&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Search engines use <span class="hljs-built_in">complex</span> algorithms to rank web pages

Query <span class="hljs-number">3</span>: <span class="hljs-string">&#x27;python program&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">3.7884</span>): Python programming language <span class="hljs-keyword">is</span> widely used <span class="hljs-keyword">for</span> data science projects

Query <span class="hljs-number">4</span>: <span class="hljs-string">&#x27;learn&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Deep learning models require large amounts of training data

============================================================
Search complete！
============================================================
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Use-Multi-language-Analyzer" class="common-anchor-header">다국어 분석기 사용 방법</h3><p>데이터 세트에 영어, 중국어, 일본어 등 여러 언어가 포함된 경우, 다국어 분석기를 활성화할 수 있습니다. 밀버스는 각 텍스트의 언어에 따라 적합한 토큰화 도구를 자동으로 선택합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-keyword">import</span> time

<span class="hljs-comment"># Configure connection</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_demo&quot;</span>

<span class="hljs-comment"># Drop existing collection if present</span>
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)

<span class="hljs-comment"># Create schema</span>
schema = client.create_schema()

<span class="hljs-comment"># Add primary key field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Add language identifier field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;language&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">50</span>
)

<span class="hljs-comment"># Add text field with multi-language analyzer configuration</span>
multi_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,  <span class="hljs-comment"># Select analyzer based on language field</span>
    <span class="hljs-string">&quot;analyzers&quot;</span>: {
        <span class="hljs-string">&quot;en&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>  <span class="hljs-comment"># English analyzer</span>
        },
        <span class="hljs-string">&quot;zh&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;chinese&quot;</span>  <span class="hljs-comment"># Chinese analyzer</span>
        },
        <span class="hljs-string">&quot;jp&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,  <span class="hljs-comment"># Use ICU tokenizer for Japanese</span>
            <span class="hljs-string">&quot;filter&quot;</span>: [
                <span class="hljs-string">&quot;lowercase&quot;</span>,
                {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>,
                    <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;は&quot;</span>, <span class="hljs-string">&quot;が&quot;</span>, <span class="hljs-string">&quot;の&quot;</span>, <span class="hljs-string">&quot;に&quot;</span>, <span class="hljs-string">&quot;を&quot;</span>, <span class="hljs-string">&quot;で&quot;</span>, <span class="hljs-string">&quot;と&quot;</span>]
                }
            ]
        },
        <span class="hljs-string">&quot;default&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>  <span class="hljs-comment"># Default to ICU general tokenizer</span>
        }
    },
    <span class="hljs-string">&quot;alias&quot;</span>: {
        <span class="hljs-string">&quot;english&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;chinese&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, 
        <span class="hljs-string">&quot;japanese&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>,
        <span class="hljs-string">&quot;中文&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>,
        <span class="hljs-string">&quot;英文&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;日文&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>
    }
}

schema.add_field(
    field_name=<span class="hljs-string">&quot;text&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">2000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    multi_analyzer_params=multi_analyzer_params
)

<span class="hljs-comment"># Add sparse vector field for BM25</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    datatype=DataType.SPARSE_FLOAT_VECTOR
)

<span class="hljs-comment"># Define BM25 function</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>]
)

schema.add_function(bm25_function)

<span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Prepare multilingual test data</span>
multilingual_data = [
    <span class="hljs-comment"># English data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Artificial intelligence is revolutionizing technology industries worldwide&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Machine learning algorithms process large datasets efficiently&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Vector databases provide fast similarity search capabilities&quot;</span>},
    
    <span class="hljs-comment"># Chinese data  </span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工智能正在改变世界各行各业&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;机器学习算法能够高效处理大规模数据集&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;向量数据库提供快速的相似性搜索功能&quot;</span>},
    
    <span class="hljs-comment"># Japanese data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工知能は世界中の技術産業に革命をもたらしています&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;機械学習アルゴリズムは大量のデータセットを効率的に処理します&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;ベクトルデータベースは高速な類似性検索機能を提供します&quot;</span>},
]

client.insert(
    collection_name=COLLECTION_NAME,
    data=multilingual_data
)

<span class="hljs-comment"># Wait for BM25 function to generate vectors</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Waiting for BM25 vector generation...&quot;</span>)
client.flush(COLLECTION_NAME)
time.sleep(<span class="hljs-number">5</span>)
client.load_collection(COLLECTION_NAME)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nTokenizer Analysis:&quot;</span>)

test_texts = {
    <span class="hljs-string">&quot;en&quot;</span>: <span class="hljs-string">&quot;The running algorithms are processing data efficiently&quot;</span>,
    <span class="hljs-string">&quot;zh&quot;</span>: <span class="hljs-string">&quot;这些运行中的算法正在高效地处理数据&quot;</span>, 
    <span class="hljs-string">&quot;jp&quot;</span>: <span class="hljs-string">&quot;これらの実行中のアルゴリズムは効率的にデータを処理しています&quot;</span>
}

<span class="hljs-keyword">for</span> lang, text <span class="hljs-keyword">in</span> test_texts.items():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{lang}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">try</span>:
        analyzer_result = client.run_analyzer(
            texts=text,
            collection_name=COLLECTION_NAME,
            field_name=<span class="hljs-string">&quot;text&quot;</span>,
            analyzer_names=[lang]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → Analysis failed: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-comment"># Multi-language search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch Test:&quot;</span>)

search_cases = [
    (<span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;人工智能&quot;</span>),
    (<span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;機械学習&quot;</span>),
    (<span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;algorithm&quot;</span>),
]

<span class="hljs-keyword">for</span> lang, query <span class="hljs-keyword">in</span> search_cases:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n<span class="hljs-subst">{lang}</span> &#x27;<span class="hljs-subst">{query}</span>&#x27;:&quot;</span>)
    <span class="hljs-keyword">try</span>:
        search_results = client.search(
            collection_name=COLLECTION_NAME,
            data=[query],
            search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
            output_fields=[<span class="hljs-string">&quot;language&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>],
            limit=<span class="hljs-number">3</span>,
            <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;language == &quot;<span class="hljs-subst">{lang}</span>&quot;&#x27;</span>
        )
        
        <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
            <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> search_results[<span class="hljs-number">0</span>]:
                score = result[<span class="hljs-string">&quot;distance&quot;</span>]
                text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No results&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Error: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nComplete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>결과: 출력</p>
<pre><code translate="no"><span class="hljs-title class_">Waiting</span> <span class="hljs-keyword">for</span> <span class="hljs-title class_">BM25</span> vector generation...

<span class="hljs-title class_">Tokenizer</span> <span class="hljs-title class_">Analysis</span>:
<span class="hljs-attr">en</span>: <span class="hljs-title class_">The</span> running algorithms are processing data efficiently
  → [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;algorithm&#x27;</span>, <span class="hljs-string">&#x27;process&#x27;</span>, <span class="hljs-string">&#x27;data&#x27;</span>, <span class="hljs-string">&#x27;effici&#x27;</span>]
<span class="hljs-attr">zh</span>: 这些运行中的算法正在高效地处理数据
  → [<span class="hljs-string">&#x27;这些&#x27;</span>, <span class="hljs-string">&#x27;运行&#x27;</span>, <span class="hljs-string">&#x27;中&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;算法&#x27;</span>, <span class="hljs-string">&#x27;正在&#x27;</span>, <span class="hljs-string">&#x27;高效&#x27;</span>, <span class="hljs-string">&#x27;地&#x27;</span>, <span class="hljs-string">&#x27;处理&#x27;</span>, <span class="hljs-string">&#x27;数据&#x27;</span>]
<span class="hljs-attr">jp</span>: これらの実行中のアルゴリズムは効率的にデータを処理しています
  → [<span class="hljs-string">&#x27;これらの&#x27;</span>, <span class="hljs-string">&#x27;実行&#x27;</span>, <span class="hljs-string">&#x27;中の&#x27;</span>, <span class="hljs-string">&#x27;アルゴリズム&#x27;</span>, <span class="hljs-string">&#x27;効率&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;データ&#x27;</span>, <span class="hljs-string">&#x27;処理&#x27;</span>, <span class="hljs-string">&#x27;し&#x27;</span>, <span class="hljs-string">&#x27;てい&#x27;</span>, <span class="hljs-string">&#x27;ます&#x27;</span>]

<span class="hljs-title class_">Search</span> <span class="hljs-title class_">Test</span>:

zh <span class="hljs-string">&#x27;人工智能&#x27;</span>:
  <span class="hljs-number">3.300</span>: 人工智能正在改变世界各行各业

jp <span class="hljs-string">&#x27;機械学習&#x27;</span>:
  <span class="hljs-number">3.649</span>: 機械学習アルゴリズムは大量のデータセットを効率的に処理します

en <span class="hljs-string">&#x27;algorithm&#x27;</span>:
  <span class="hljs-number">2.096</span>: <span class="hljs-title class_">Machine</span> learning algorithms process large datasets efficiently

<span class="hljs-title class_">Complete</span>
<button class="copy-code-btn"></button></code></pre>
<p>또한 Milvus는 검색을 위해 language_identifier 토큰화기를 지원합니다. 이는 주어진 텍스트의 언어를 자동으로 감지하므로 언어 필드는 선택 사항입니다. 자세한 내용은<a href="https://milvus.io/blog/how-milvus-26-powers-hybrid-multilingual-search-at-scale.md"> Milvus 2.6에서 다국어 전체 텍스트 검색을 대규모로 업그레이드하는 방법을</a> 참조하세요.</p>
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
    </button></h2><p>Milvus 분석기는 단순한 전처리 단계였던 것을 텍스트 처리를 위한 잘 정의된 모듈식 시스템으로 바꾸어 놓았습니다. 토큰화 및 필터링을 중심으로 설계되어 개발자는 언어 해석, 정리 및 색인 방식을 세밀하게 제어할 수 있습니다. 단일 언어 애플리케이션을 구축하든, 여러 언어를 아우르는 글로벌 RAG 시스템을 구축하든, 분석기는 전체 텍스트 검색을 위한 일관된 기반을 제공합니다. 다른 모든 것을 조용히 더 잘 작동하게 만드는 Milvus의 일부입니다.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
