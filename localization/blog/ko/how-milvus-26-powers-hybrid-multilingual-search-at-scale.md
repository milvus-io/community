---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: Milvus 2.6이 다국어 전체 텍스트 검색을 대규모로 업그레이드하는 방법
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: Milvus 2.6은 전체 텍스트 검색을 위한 포괄적인 다국어 지원과 함께 완전히 개편된 텍스트 분석 파이프라인을 도입합니다.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>최신 AI 애플리케이션은 점점 더 복잡해지고 있습니다. 한 가지 검색 방법만으로 문제를 해결할 수는 없습니다.</p>
<p>추천 시스템을 예로 들면, 텍스트와 이미지의 의미를 이해하기 위한 <strong>벡터 검색</strong>, 가격, 카테고리 또는 위치별로 결과를 좁히기 위한 <strong>메타데이터 필터링</strong>, "Nike Air Max"와 같은 직접 검색어에 대한 <strong>키워드 검색이</strong> 필요합니다. 각 방법은 문제의 다른 부분을 해결하며, 실제 시스템에서는 이 모든 방법이 함께 작동해야 합니다.</p>
<p>검색의 미래는 벡터와 키워드 중 하나를 선택하는 것이 아닙니다. 벡터와 키워드, 필터링을 다른 검색 유형과 함께 한곳에서 모두 결합하는 것입니다. 이것이 바로 1년 전 Milvus 2.5 출시와 함께 Milvus에 <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">하이브리드 검색을</a> 구축하기 시작한 이유입니다.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">하지만 전체 텍스트 검색은 다르게 작동합니다.<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 네이티브 시스템에 전체 텍스트 검색을 도입하는 것은 쉽지 않습니다. 전체 텍스트 검색에는 고유한 문제들이 있습니다.</p>
<p>벡터 검색은 텍스트의 <em>의미론적</em> 의미를 포착하여 고차원 벡터로 변환하는 반면, 전체 텍스트 검색은 단어가 어떻게 형성되는지, 단어의 시작과 끝이 어디인지, 단어가 서로 어떻게 연관되는지 등 <strong>언어의 구조를</strong> 이해하는 데 달려 있습니다. 예를 들어, 사용자가 영어로 '운동화'를 검색하면 텍스트는 여러 처리 단계를 거칩니다:</p>
<p><em>공백 → 소문자로 나누기 → 중단어 제거 → 어간 'running'을 'run'으로 바꾸기.</em></p>
<p>이를 올바르게 처리하려면 분할, 어간 제거, 필터링 등을 처리할 수 있는 강력한 <strong>언어 분석기가</strong>필요합니다.</p>
<p>Milvus 2.5에 <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">BM25 전체 텍스트 검색을</a> 도입했을 때 사용자 정의 가능한 분석기를 포함시켰는데, 이 분석기는 설계 목적에 맞게 잘 작동했습니다. 토큰화기, 토큰 필터, 문자 필터를 사용해 파이프라인을 정의하여 색인 및 검색을 위한 텍스트를 준비할 수 있었습니다.</p>
<p>영어의 경우, 이 설정은 비교적 간단했습니다. 하지만 여러 언어를 다룰 때는 상황이 더 복잡해집니다.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">다국어 전체 텍스트 검색의 과제<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>다국어 전체 텍스트 검색에는 다양한 문제가 발생합니다:</p>
<ul>
<li><p><strong>복잡한 언어는 특별한 처리가 필요합니다</strong>: 중국어, 일본어, 한국어와 같은 언어는 단어 사이에 공백을 사용하지 않습니다. 문자를 의미 있는 단어로 분할하려면 고급 토큰화 도구가 필요합니다. 이러한 도구는 단일 언어에는 잘 작동할 수 있지만 여러 개의 복잡한 언어를 동시에 지원하는 경우는 드뭅니다.</p></li>
<li><p><strong>비슷한 언어끼리도 충돌할 수 있습니다</strong>: 영어와 프랑스어는 모두 공백을 사용하여 단어를 구분하지만, 어간이나 형태소 분석과 같은 언어별 처리를 적용하면 한 언어의 규칙이 다른 언어의 규칙을 방해할 수 있습니다. 영어의 정확도를 향상시키는 것이 프랑스어 쿼리를 왜곡할 수 있으며, 그 반대의 경우도 마찬가지입니다.</p></li>
</ul>
<p>요컨대, <strong>언어마다 서로 다른 분석기가 필요합니다</strong>. 영어 분석기로 중국어 텍스트를 처리하려고 하면 공백을 분할할 수 없고 영어 어간 규칙으로 인해 중국어 문자가 손상될 수 있기 때문에 실패로 이어집니다.</p>
<p>결론은? 다국어 데이터 세트에 대해 단일 토큰화 도구와 분석기에 의존하면 모든 언어에서 일관된 고품질의 토큰화를 보장하는 것이 거의 불가능합니다. 그리고 이는 곧 검색 성능 저하로 이어집니다.</p>
<p>Milvus 2.5에서 전체 텍스트 검색을 도입하기 시작하면서 팀에서 동일한 피드백을 듣기 시작했습니다:</p>
<p><em>"영어 검색에는 완벽하지만 다국어 고객 지원 티켓은 어떻게 해야 하나요?" "우리는 벡터와 BM25 검색을 모두 좋아하지만 우리 데이터 세트에는 중국어, 일본어, 영어 콘텐츠가 포함되어 있습니다." "모든 언어에서 동일한 검색 정확도를 얻을 수 있을까요?"</em></p>
<p>이러한 질문들은 우리가 이미 실무에서 경험했던 것을 확인시켜 주었습니다. 전체 텍스트 검색은 벡터 검색과 근본적으로 다르다는 것입니다. 의미적 유사성은 여러 언어에서 잘 작동하지만 정확한 텍스트 검색을 위해서는 각 언어의 구조에 대한 깊은 이해가 필요합니다.</p>
<p>이것이 바로 <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6이</a> 포괄적인 다국어 지원을 통해 완전히 개편된 텍스트 분석 파이프라인을 도입한 이유입니다. 이 새로운 시스템은 각 언어에 적합한 분석기를 자동으로 적용하여 수동 구성이나 품질 저하 없이 다국어 데이터 세트에서 정확하고 확장 가능한 전체 텍스트 검색을 가능하게 합니다.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Milvus 2.6이 강력한 다국어 전체 텍스트 검색을 지원하는 방법<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>광범위한 연구와 개발 끝에 다양한 다국어 시나리오를 처리하는 일련의 기능을 구축했습니다. 각 접근 방식은 고유한 방식으로 언어 종속성 문제를 해결합니다.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. 다국어 분석기: 제어를 통한 정확성</h3><p><a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>다중 언어 분석기를</strong></a> 사용하면 모든 언어를 동일한 분석 파이프라인을 통해 강제로 처리하는 대신 동일한 컬렉션 내에서 언어별로 서로 다른 텍스트 처리 규칙을 정의할 수 있습니다.</p>
<p><strong>작동 방식은 다음과</strong> 같습니다. 언어별 분석기를 구성하고 삽입하는 동안 각 문서에 해당 언어로 태그를 지정합니다. BM25 검색을 수행할 때 쿼리 처리에 사용할 언어 분석기를 지정합니다. 이렇게 하면 색인된 콘텐츠와 검색 쿼리가 모두 해당 언어에 맞는 최적의 규칙으로 처리됩니다.</p>
<p><strong>완벽한 대상:</strong> 콘텐츠의 언어를 알고 있고 최대한의 검색 정확도를 원하는 애플리케이션. 다국적 지식 베이스, 현지화된 제품 카탈로그 또는 지역별 콘텐츠 관리 시스템 등이 여기에 해당합니다.</p>
<p><strong>요구 사항:</strong> 각 문서에 대한 언어 메타데이터를 제공해야 합니다. 현재 BM25 검색 작업에만 사용할 수 있습니다.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. 언어 식별자 토큰화: 자동 언어 감지</h3><p>모든 콘텐츠에 수동으로 태그를 지정하는 것이 항상 실용적이지 않다는 것을 알고 있습니다. <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>언어 식별자 토큰화</strong></a> 도구는 텍스트 분석 파이프라인에 직접 자동 언어 감지 기능을 제공합니다.</p>
<p><strong>작동 원리는 다음과 같습니다:</strong> 이 지능형 토큰화 도구는 들어오는 텍스트를 분석하고, 정교한 탐지 알고리즘을 사용해 언어를 감지한 다음, 적절한 언어별 처리 규칙을 자동으로 적용합니다. 지원하려는 각 언어에 대해 하나씩 여러 개의 분석기 정의와 기본 대체 분석기를 사용하여 구성할 수 있습니다.</p>
<p>빠른 처리를 위한 <code translate="no">whatlang</code> 및 더 높은 정확도를 위한 <code translate="no">lingua</code> 등 두 가지 탐지 엔진을 지원합니다. 시스템은 선택한 탐지기에 따라 71~75개의 언어를 지원합니다. 색인 및 검색 중에 토큰화기는 감지된 언어를 기반으로 적합한 분석기를 자동으로 선택하며, 감지가 불확실한 경우 기본 구성으로 되돌아갑니다.</p>
<p><strong>완벽한 대상:</strong> 예측할 수 없는 언어 혼합이 있는 동적 환경, 사용자 생성 콘텐츠 플랫폼 또는 수동 언어 태깅이 불가능한 애플리케이션.</p>
<p>단점<strong>:</strong> 자동 감지는 처리 지연 시간이 길어지고 매우 짧은 텍스트나 혼합 언어 콘텐츠에서 어려움을 겪을 수 있습니다. 하지만 대부분의 실제 애플리케이션에서는 이러한 제한 사항보다 편의성이 훨씬 더 중요합니다.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. ICU 토큰화 도구: 범용 기반</h3><p>앞의 두 가지 옵션이 과하다고 느껴진다면 더 간단한 옵션이 있습니다.<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> ICU(국제 유니코드 컴포넌트) 토큰라이저를</a> Milvus 2.6에 새롭게 통합했습니다. ICU는 수많은 언어와 스크립트의 텍스트 처리를 처리하는 성숙하고 널리 사용되는 라이브러리 집합으로, 오래 전부터 사용되어 왔습니다. 멋진 점은 다양한 복잡하고 간단한 언어를 한 번에 처리할 수 있다는 것입니다.</p>
<p>ICU 토큰화 도구는 솔직히 훌륭한 기본 선택입니다. 유니코드 표준 규칙을 사용하여 단어를 나누기 때문에 자체 토큰화기가 없는 수십 개의 언어에 안정적으로 사용할 수 있습니다. 여러 언어에 걸쳐 잘 작동하는 강력하고 범용적인 것이 필요하다면 ICU를 사용하면 됩니다.</p>
<p><strong>제한:</strong> ICU는 여전히 단일 분석기 내에서 작동하므로 모든 언어가 동일한 필터를 공유하게 됩니다. 어간 또는 형태소 분석과 같은 언어별 작업을 하고 싶으신가요? 앞서 설명한 것과 동일한 충돌이 발생할 수 있습니다.</p>
<p><strong>정말 빛나는 부분:</strong> ICU는 다국어 또는 언어 식별자 설정 내에서 기본 분석기로 작동하도록 구축되었습니다. 이는 기본적으로 사용자가 명시적으로 구성하지 않은 언어를 처리하기 위한 지능형 안전망입니다.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">실제로 살펴보기: 실습 데모<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>이론은 그만하고 코드를 살펴봅시다! 다음은 <strong>pymilvus의</strong> 새로운 다국어 기능을 사용하여 다국어 검색 컬렉션을 구축하는 방법입니다.</p>
<p>재사용 가능한 분석기 구성을 정의하는 것부터 시작하여 <strong>두 가지 완전한 예제를</strong> 살펴보겠습니다:</p>
<ul>
<li><p><strong>다국어 분석기</strong> 사용하기</p></li>
<li><p><strong>언어 식별자 토큰화 도구</strong> 사용하기</p></li>
</ul>
<p>👉 전체 데모 코드는 <a href="https://github.com/milvus-io/pymilvus/tree/master/examples/full_text_search">이 GitHub 페이지를</a> 확인하세요.</p>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">1단계: Milvus 클라이언트 설정하기</h3><p><em>먼저 Milvus에 연결하여 컬렉션 이름을 설정하고 기존 컬렉션을 모두 정리하여 새로 시작합니다.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">2단계: 여러 언어에 대한 분석기 정의하기</h3><p>다음으로, 언어별 구성으로 <code translate="no">analyzers</code> 사전을 정의합니다. 이 사전은 나중에 보여드리는 두 가지 다국어 검색 방법 모두에 사용됩니다.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">옵션 A: 다국어 분석기 사용</h3><p>이 방법은 <strong>각 문서의 언어를 미리 알고 있을</strong> 때 가장 좋습니다. 데이터를 삽입하는 동안 전용 <code translate="no">language</code> 필드를 통해 해당 정보를 전달합니다.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">다국어 분석기로 컬렉션 만들기</h4><p><code translate="no">language</code> 필드 값에 따라 <code translate="no">&quot;text&quot;</code> 필드에 다른 분석기를 사용하는 컬렉션을 만들어 보겠습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">다국어 데이터 삽입 및 컬렉션 로드</h4><p>이제 영어와 일본어로 된 문서를 삽입합니다. <code translate="no">language</code> 필드는 Milvus가 어떤 분석기를 사용할지 알려줍니다.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">전체 텍스트 검색 실행</h4><p>검색하려면 언어에 따라 쿼리에 사용할 분석기를 지정합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">결과:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">옵션 B: 언어 식별자 토큰화기 사용</h3><p>이 접근 방식은 수동으로 언어를 처리하는 수고를 덜어줍니다. <strong>언어 식별자 토큰</strong> 화 도구는 각 문서의 언어를 자동으로 감지하여 올바른 분석기를 적용하므로 <code translate="no">language</code> 필드를 지정할 필요가 없습니다.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">언어 식별자 토큰화 도구로 컬렉션 만들기</h4><p>여기서는 <code translate="no">&quot;text&quot;</code> 필드가 자동 언어 감지를 사용하여 올바른 분석기를 선택하는 컬렉션을 생성합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">데이터 삽입 및 컬렉션 로드</h4><p>레이블을 지정할 필요 없이 다양한 언어로 텍스트를 삽입하세요. Milvus가 자동으로 올바른 분석기를 감지하여 적용합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">전체 텍스트 검색 실행</h4><p>가장 좋은 점은 검색할 때 <strong>분석기를 지정할 필요가 없다는</strong> 점입니다. 토큰화기가 자동으로 쿼리 언어를 감지하고 올바른 로직을 적용합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">결과</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Milvus 2.6은 이제 여러 언어에 걸쳐 벡터 검색과 키워드 검색을 결합하여 <strong>하이브리드 검색을</strong> 더욱 강력하고 접근하기 쉽게 만드는 데 큰 진전을 이루었습니다. 향상된 다국어 지원을 통해 <em>사용자가</em> 어떤 언어를 사용하든 <em>사용자의 의미와</em> <em>발언을</em> 이해하는 앱을 구축할 수 있습니다.</p>
<p>하지만 이는 업데이트의 일부에 불과합니다. Milvus 2.6은 검색을 더 빠르고 스마트하게, 더 쉽게 만들어주는 몇 가지 다른 기능도 제공합니다:</p>
<ul>
<li><p><strong>쿼리 매칭 개선</strong> - <code translate="no">phrase_match</code> 및 <code translate="no">multi_match</code> 을 사용하여 보다 정확한 검색이 가능합니다.</p></li>
<li><p><strong>더 빨라진 JSON 필터링</strong> - 새로운 JSON 필드 전용 인덱스 덕분입니다.</p></li>
<li><p><strong>스칼라 기반 정렬</strong> - 모든 숫자 필드를 기준으로 결과를 정렬합니다.</p></li>
<li><p><strong>고급 재순위</strong> 지정 - 모델 또는 사용자 지정 점수 로직을 사용하여 결과의 순서를 다시 지정합니다.</p></li>
</ul>
<p>Milvus 2.6에 대한 전체 분석이 궁금하신가요? 최신 게시물을 확인하세요: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6 소개: 10억 개 규모의 경제적인 벡터 검색</strong></a><strong>.</strong></p>
<p>궁금한 점이 있거나 어떤 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요.</p>
