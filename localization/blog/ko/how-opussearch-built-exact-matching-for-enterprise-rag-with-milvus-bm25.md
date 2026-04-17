---
id: how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25.md
title: OpusSearch가 Milvus BM25로 엔터프라이즈 RAG를 위한 정확한 매칭을 구축한 방법
author: Chronos Kou
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/opus_cover_new_1505263938.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, enterprise RAG, vector database, semantic search'
meta_title: How OpusSearch Built Exact Matching for Enterprise RAG with Milvus
desc: >-
  OpusSearch가 Milvus BM25를 사용하여 어떻게 시맨틱 검색과 정확한 키워드 검색을 결합하여 엔터프라이즈 RAG 시스템에서
  정확히 일치하는 검색을 지원하는지 알아보세요.
origin: >-
  https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b
---
<p>이 게시물은 원래 <a href="https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b">Medium에</a> 게시되었으나 허가를 받아 이곳에 다시 게시되었습니다.</p>
<h2 id="The-Semantic-Search-Blind-Spot" class="common-anchor-header">시맨틱 검색의 사각지대<button data-href="#The-Semantic-Search-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>이 상황을 상상해 보세요: 마감 시간이 임박한 동영상 편집자라고 가정해 보겠습니다. 팟캐스트 '에피소드 281'의 클립이 필요합니다. 이를 검색에 입력합니다. 인공지능 기반의 시맨틱 검색은 뛰어난 지능을 자랑하며 280회, 282회의 클립을 반환하고 심지어 숫자가 비슷하다는 이유로 218회도 제안합니다.</p>
<p><strong>틀렸습니다</strong>.</p>
<p>2025년 1월 기업용 <a href="https://www.opus.pro/opussearch">OpusSearch를</a> 출시했을 때만 해도 시맨틱 검색만으로도 충분할 것이라고 생각했습니다. "데이트에 관한 재미있는 순간을 찾아줘"와 같은 자연어 쿼리는 훌륭하게 작동했습니다. <a href="https://milvus.io/">Milvus 기반</a> RAG 시스템이 이를 압도하고 있었죠.</p>
<p><strong>하지만 현실은 사용자 피드백이라는 벽에 부딪혔습니다:</strong></p>
<p>"281화 클립만 찾고 싶어요. 이게 왜 이렇게 어렵죠?"</p>
<p>"저는 '그녀가 말한 대로'를 검색할 때 '그가 말한 대로'가 아니라 정확히 그 문구를 원합니다."</p>
<p>동영상 편집자와 클리퍼가 항상 인공지능이 영리하기를 바라는 것은 아닙니다. 때로는 소프트웨어가 <strong>간단하고 정확하기를</strong> 원하기도 합니다.</p>
<h2 id="Why-do-we-care-about-Search" class="common-anchor-header">검색에 신경을 쓰는 이유는 무엇인가요?<button data-href="#Why-do-we-care-about-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>대규모 동영상 카탈로그를 <strong>수익화하는</strong> 것이 조직이 직면한 주요 과제라는 것을 파악했기 때문에 <a href="https://www.opus.pro/opussearch">엔터프라이즈 검색 기능을</a> 구축했습니다. RAG 기반 플랫폼은 기업이 <strong>전체 동영상 라이브러리를 검색하고, 용도를 변경하고, 수익화할</strong> 수 있도록 지원하는 <strong>성장 에이전트</strong> 역할을 합니다. <strong>올 더 스모크</strong>, <strong>KFC 라디오</strong>, <strong>TFTC의</strong> 성공 사례를 <a href="https://www.opus.pro/blog/growing-a-new-youtube-channel-in-90-days-without-creating-new-videos">여기에서</a> 읽어보세요.</p>
<h2 id="Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="common-anchor-header">다른 데이터베이스를 추가하는 대신 Milvus를 두 배로 늘린 이유<button data-href="#Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>분명한 해결책은 정확한 매칭을 위해 Elasticsearch나 MongoDB를 추가하는 것이었습니다. 그러나 스타트업으로서 여러 검색 시스템을 유지 관리하면 상당한 운영 오버헤드와 복잡성이 발생하게 됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Strong_community_adoption_with_35k_Git_Hub_stars_fbf773dcdb.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus는 최근에 전체 텍스트 검색 기능을 출시했는데, <strong>아무런 조정 없이</strong> 자체 데이터 세트를 사용해 평가한 결과 강력한 이점을 보여주었습니다:</p>
<ul>
<li><p><strong>뛰어난 부분 일치 정확도</strong>. 예를 들어 '음주 이야기'와 '높이 뛰어오르다'를 검색할 때 다른 벡터 DB는 '식사 이야기'와 '취하다'를 반환하여 의미가 달라지는 경우가 있습니다.</p></li>
<li><p>Milvus는 일반적인 쿼리일 때 다른 데이터베이스보다 <strong>더 길고 포괄적인 결과를 반환하므로</strong> 당연히 우리 사용 사례에 더 이상적입니다.</p></li>
</ul>
<h2 id="Architecture-from-5000-feet" class="common-anchor-header">5000피트 상공에서 바라본 아키텍처<button data-href="#Architecture-from-5000-feet" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_is_the_foundational_vector_database_for_our_Enterprise_RAG_architecture_b3c8ebf39c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="BM25-+-Filtering--Exact-Match-Magic" class="common-anchor-header">BM25 + 필터링 = 정확히 일치하는 매직<button data-href="#BM25-+-Filtering--Exact-Match-Magic" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus의 전체 텍스트 검색은 정확히 일치하는 것이 아니라 문서가 쿼리와 얼마나 연관성이 있는지를 계산하는 BM25<a href="https://en.wikipedia.org/wiki/Okapi_BM25">(베스트 매칭 25)를</a> 사용하여 관련성 점수를 매기는 것입니다. "비슷한 것을 찾아줘"라는 쿼리에는 좋지만 "정확히 이걸 찾아줘"라는 쿼리에는 끔찍합니다.</p>
<p>그런 다음 <strong>BM25의 강력한 기능을 Milvus의 TEXT_MATCH 필터링과 결합했습니다</strong>. 작동 방식은 다음과 같습니다:</p>
<ol>
<li><p><strong>먼저 필터링합니다</strong>: TEXT_MATCH가 정확한 키워드가 포함된 문서를 찾습니다.</p></li>
<li><p><strong>두 번째 순위</strong>: BM25가 관련성별로 정확히 일치하는 문서를 정렬합니다.</p></li>
<li><p><strong>승리</strong>: 지능적으로 순위를 매긴 정확한 일치 문서를 얻습니다.</p></li>
</ol>
<p>"'에피소드 281'이 포함된 모든 문서를 제공한 다음 가장 좋은 것을 먼저 보여주세요."라고 생각하면 됩니다.</p>
<h2 id="The-Code-That-Made-It-Work" class="common-anchor-header">작동을 가능하게 한 코드<button data-href="#The-Code-That-Made-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Schema-Design" class="common-anchor-header">스키마 설계</h3><p><strong>중요</strong>: 'The Office'와 'Office'와 같은 용어는 콘텐츠 도메인에서 별개의 개체를 나타내므로 중지 단어를 완전히 비활성화했습니다.</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> <span class="hljs-keyword">function</span> getExactMatchFields(): FieldType[] {
 <span class="hljs-built_in">return</span> [
   {
     name: <span class="hljs-string">&quot;id&quot;</span>,
     data_type: DataType.VarChar,
     is_primary_key: <span class="hljs-literal">true</span>,
     max_length: 100,
   },
   {
     name: <span class="hljs-string">&quot;text&quot;</span>,
     data_type: DataType.VarChar,
     max_length: 1000,
     enable_analyzer: <span class="hljs-literal">true</span>,
     enable_match: <span class="hljs-literal">true</span>,  // This is the magic flag
     analyzer_params: {
       tokenizer: <span class="hljs-string">&#x27;standard&#x27;</span>,
       filter: [
         <span class="hljs-string">&#x27;lowercase&#x27;</span>,
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stemmer&#x27;</span>,
           language: <span class="hljs-string">&#x27;english&#x27;</span>,  // <span class="hljs-string">&quot;running&quot;</span> matches <span class="hljs-string">&quot;run&quot;</span>
         },
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stop&#x27;</span>,
           stop_words: [],  // Keep ALL words (even <span class="hljs-string">&quot;the&quot;</span>, <span class="hljs-string">&quot;a&quot;</span>)
         },
       ],
     },
   },
   {
     name: <span class="hljs-string">&quot;sparse_vector&quot;</span>,
     data_type: DataType.SparseFloatVector,
   },
 ]
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="BM25-Function-Setup" class="common-anchor-header">BM25 기능 설정</h3><pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-attr">FUNCTIONS</span>: <span class="hljs-title class_">FunctionObject</span>[] = [
 {
   <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;text_bm25_embedding&#x27;</span>,
   <span class="hljs-attr">type</span>: <span class="hljs-title class_">FunctionType</span>.<span class="hljs-property">BM25</span>,
   <span class="hljs-attr">input_field_names</span>: [<span class="hljs-string">&#x27;text&#x27;</span>],
   <span class="hljs-attr">output_field_names</span>: [<span class="hljs-string">&#x27;sparse_vector&#x27;</span>],
   <span class="hljs-attr">params</span>: {},
 },
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Index-Config" class="common-anchor-header">인덱스 구성</h3><p>최적의 성능을 위해 프로덕션 데이터 세트에 대해 bm25_k1 및 bm25_b 매개변수를 조정했습니다.</p>
<p><strong>bm25_k1</strong>: 값이 클수록(최대 ~2.0) 반복되는 용어 발생에 더 많은 가중치를 부여하고, 값이 작을수록 처음 몇 번 발생한 후 용어 빈도의 영향을 줄입니다.</p>
<p><strong>bm25_b</strong>: 1.0에 가까운 값은 문서 길이가 길수록 큰 불이익을 주며, 0에 가까운 값은 문서 길이를 완전히 무시합니다.</p>
<pre><code translate="no">index_params: [
 {
   field_name: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
   index_type: <span class="hljs-string">&#x27;SPARSE_INVERTED_INDEX&#x27;</span>,
   metric_type: <span class="hljs-string">&#x27;BM25&#x27;</span>,
   <span class="hljs-keyword">params</span>: {
     inverted_index_algo: <span class="hljs-string">&#x27;DAAT_MAXSCORE&#x27;</span>,
     bm25_k1: <span class="hljs-number">1.2</span>,  <span class="hljs-comment">// How much does term frequency matter?</span>
     bm25_b: <span class="hljs-number">0.75</span>,  <span class="hljs-comment">// How much does document length matter?</span>
   },
 },
],
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Search-Query-That-Started-Working" class="common-anchor-header">작동하기 시작한 검색 쿼리</h3><pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">search</span>({
 <span class="hljs-attr">collection_name</span>: <span class="hljs-string">&#x27;my_collection&#x27;</span>,
 <span class="hljs-attr">limit</span>: <span class="hljs-number">30</span>,
 <span class="hljs-attr">output_fields</span>: [<span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;text&#x27;</span>],
 <span class="hljs-attr">filter</span>: <span class="hljs-string">`TEXT_MATCH(text, &quot;episode 281&quot;)`</span>,  <span class="hljs-comment">// Exact match filter</span>
 <span class="hljs-attr">anns_field</span>: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
 <span class="hljs-attr">data</span>: <span class="hljs-string">&#x27;episode 281&#x27;</span>,  <span class="hljs-comment">// BM25 ranking query</span>
})
<button class="copy-code-btn"></button></code></pre>
<p>여러 용어가 정확히 일치하는 경우:</p>
<pre><code translate="no"><span class="hljs-built_in">filter</span>: `TEXT_MATCH(text, <span class="hljs-string">&quot;foo&quot;</span>) <span class="hljs-keyword">and</span> TEXT_MATCH(text, <span class="hljs-string">&quot;bar&quot;</span>)`
<button class="copy-code-btn"></button></code></pre>
<h2 id="The-Mistakes-We-Made-So-You-Don’t-Have-To" class="common-anchor-header">우리가 저지른 실수(그래서 여러분은 실수하지 않아도 됩니다)<button data-href="#The-Mistakes-We-Made-So-You-Don’t-Have-To" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Dynamic-Fields-Critical-for-Production-Flexibility" class="common-anchor-header">동적 필드: 프로덕션 유연성을 위한 필수 요소</h3><p>처음에는 동적 필드를 활성화하지 않아서 문제가 있었습니다. 스키마를 수정하려면 프로덕션 환경에서 컬렉션을 삭제하고 다시 만들어야 했습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">createCollection</span>({
 <span class="hljs-attr">collection_name</span>: collectionName,
 <span class="hljs-attr">fields</span>: fields,
 <span class="hljs-attr">enable_dynamic_field</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">// DO THIS</span>
 <span class="hljs-comment">// ... rest of config</span>
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="Collection-Design-Maintain-Clear-Separation-of-Concerns" class="common-anchor-header">컬렉션 디자인: 명확한 관심사 분리 유지</h3><p>저희 아키텍처는 기능 도메인별로 전용 컬렉션을 사용합니다. 이 모듈식 접근 방식은 스키마 변경의 영향을 최소화하고 유지보수성을 향상시킵니다.</p>
<h3 id="Memory-Usage-Optimize-with-MMAP" class="common-anchor-header">메모리 사용량: MMAP로 최적화</h3><p>스파스 인덱스는 상당한 메모리 할당을 필요로 합니다. 대용량 텍스트 데이터 세트의 경우, 디스크 스토리지를 활용하도록 MMAP를 구성하는 것이 좋습니다. 이 접근 방식은 성능 특성을 유지하기 위해 적절한 I/O 용량이 필요합니다.</p>
<pre><code translate="no"><span class="hljs-comment">// In your Milvus configuration</span>
<span class="hljs-attr">use_mmap</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Production-Impact-and-Results" class="common-anchor-header">프로덕션 영향 및 결과<button data-href="#Production-Impact-and-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>2025년 6월 일치 검색 기능을 배포한 후, 사용자 만족도 지표가 측정 가능한 수준으로 개선되고 검색 관련 문제에 대한 지원량이 감소하는 것을 관찰했습니다. 이중 모드 접근 방식은 탐색 쿼리에 대한 시맨틱 검색을 가능하게 하는 동시에 특정 콘텐츠 검색을 위한 정확한 매칭을 제공합니다.</p>
<p>아키텍처의 주요 이점: 두 가지 검색 패러다임을 모두 지원하는 단일 데이터베이스 시스템을 유지하여 운영 복잡성을 줄이면서 기능을 확장할 수 있습니다.</p>
<h2 id="What’s-Next" class="common-anchor-header">다음 단계는 무엇인가요?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>저희는 <strong>단일 검색에서 시맨틱 검색과 일치 검색을 결합한</strong> <strong>하이브리드</strong> <strong>쿼리를</strong> 실험하고 있습니다. "에피소드 281의 재미있는 클립 찾기"에서 'funny'는 시맨틱 검색을, 'episode 281'은 일치 검색을 사용한다고 상상해 보세요.</p>
<p>검색의 미래는 시맨틱 AI와 정확히 일치하는 검색 중 하나를 선택하는 것이 아닙니다. 동일한 시스템에서 <strong>두 가지를 모두</strong> 지능적으로 사용하는 것입니다.</p>
