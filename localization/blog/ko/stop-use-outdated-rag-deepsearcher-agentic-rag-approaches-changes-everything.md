---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: '오래된 RAG 사용 중단: 모든 것을 바꾸는 DeepSearcher의 에이전트 RAG 접근 방식'
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">LLM과 딥 리서치를 통한 AI 기반 검색으로의 전환<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>검색 기술의 진화는 2000년대 이전의 키워드 기반 검색에서 2010년대 개인화된 검색 경험에 이르기까지 수십 년 동안 극적으로 발전해 왔습니다. 심층적이고 전문적인 분석이 필요한 복잡한 쿼리를 처리할 수 있는 AI 기반 솔루션의 출현을 목격하고 있습니다.</p>
<p>추론 기능을 사용해 대량의 정보를 종합하고 다단계 연구 보고서를 생성하는 OpenAI의 딥 리서치는 이러한 변화를 잘 보여줍니다. 예를 들어 "테슬라의 적정 시가총액은 얼마인가?"라는 질문에 대해 다음과 같이 답할 수 있습니다. 딥 리서치는 기업 재무, 비즈니스 성장 궤적, 시장 가치 추정치를 종합적으로 분석할 수 있습니다.</p>
<p>딥 리서치는 핵심에 고급 형태의 RAG(검색 증강 세대) 프레임워크를 구현합니다. 기존의 RAG는 관련 외부 정보를 검색하고 통합하여 언어 모델 결과물을 향상시킵니다. OpenAI의 접근 방식은 반복적인 검색 및 추론 주기를 구현하여 이를 한 단계 더 발전시킵니다. 딥 리서치는 단일 검색 단계 대신 여러 쿼리를 동적으로 생성하고 중간 결과를 평가하며 검색 전략을 개선함으로써 고급 또는 에이전트 RAG 기술이 어떻게 단순한 질문 답변이 아닌 전문 연구처럼 느껴지는 고품질의 엔터프라이즈급 콘텐츠를 제공할 수 있는지를 보여줍니다.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">딥서처: 로컬 딥 리서치를 통해 모든 사람에게 에이전틱 RAG를 제공하는 딥서처<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>이러한 발전에서 영감을 얻은 전 세계 개발자들이 자체 구현을 만들어 왔습니다. 질리즈 엔지니어들은 로컬 오픈소스 딥 리서치라고 할 수 있는 <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> 프로젝트를 구축하고 오픈소스로 공개했습니다. 이 프로젝트는 한 달도 채 되지 않아 4,900개 이상의 GitHub 별을 받았습니다.</p>
<p>DeepSearcher는 고급 추론 모델, 정교한 검색 기능, 통합 리서치 어시스턴트의 힘을 결합하여 AI 기반 엔터프라이즈 검색을 재정의합니다. 고성능 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/docs/overview.md">Milvus를</a> 통해 로컬 데이터를 통합하는 DeepSearcher는 더 빠르고 관련성 높은 결과를 제공하는 동시에 사용자가 핵심 모델을 쉽게 교체하여 맞춤형 환경을 구축할 수 있도록 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 1:</em> <em>DeepSearcher의 스타 이력(</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>출처</em></a><em>)</em></p>
<p>이 글에서는 기존 RAG에서 에이전틱 RAG로의 진화 과정을 살펴보고, 기술적인 측면에서 이러한 접근 방식이 구체적으로 어떻게 다른지 살펴보겠습니다. 그런 다음, 지능형 에이전트 기능을 활용하여 동적 멀티턴 추론을 가능하게 하는 방법과 이것이 엔터프라이즈급 검색 솔루션을 구축하는 개발자에게 왜 중요한지를 보여주는 DeepSearcher의 구현에 대해 설명합니다.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">기존 RAG에서 에이전트 RAG로: 반복 추론의 힘<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>에이전틱 RAG는 지능형 에이전트 기능을 통합하여 기존 RAG 프레임워크를 향상시킵니다. DeepSearcher는 에이전틱 RAG 프레임워크의 대표적인 예입니다. 동적 계획, 다단계 추론, 자율적 의사 결정을 통해 복잡한 문제를 해결하기 위해 데이터를 검색, 처리, 검증, 최적화하는 폐쇄 루프 프로세스를 구축합니다.</p>
<p>에이전틱 RAG의 인기가 높아지는 것은 대규모 언어 모델(LLM) 추론 기능, 특히 복잡한 문제를 세분화하고 여러 단계에 걸쳐 일관된 사고의 사슬을 유지하는 능력이 크게 향상되었기 때문입니다.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>비교 차원</strong></td><td><strong>기존 RAG</strong></td><td><strong>에이전트 RAG</strong></td></tr>
<tr><td>핵심 접근 방식</td><td>수동적이고 사후 대응적</td><td>사전 예방적, 에이전트 중심</td></tr>
<tr><td>프로세스 흐름</td><td>단일 단계 검색 및 생성(일회성 프로세스)</td><td>동적 다단계 검색 및 생성(반복적 개선)</td></tr>
<tr><td>검색 전략</td><td>초기 쿼리에 따른 고정 키워드 검색</td><td>적응형 검색(예: 키워드 세분화, 데이터 소스 전환)</td></tr>
<tr><td>복잡한 쿼리 처리</td><td>직접 생성, 상충되는 데이터로 오류 발생 가능성 높음</td><td>작업 분해 → 타깃 검색 → 답변 합성</td></tr>
<tr><td>상호 작용 기능</td><td>전적으로 사용자 입력에 의존, 자율성 없음</td><td>능동적인 참여(예: 모호한 부분 명확히 하기, 세부 정보 요청)</td></tr>
<tr><td>오류 수정 및 피드백</td><td>자체 수정 기능 없음; 초기 결과에 의해 제한됨</td><td>반복적인 유효성 검사 → 정확성을 위해 자체 트리거 재검색</td></tr>
<tr><td>이상적인 사용 사례</td><td>간단한 Q&amp;A, 사실 조회</td><td>복잡한 추론, 다단계 문제 해결, 개방형 작업</td></tr>
<tr><td>예시</td><td>사용자가 질문합니다: "양자 컴퓨팅이란 무엇인가요?" → 시스템에서 교과서적인 정의를 반환</td><td>사용자가 질문합니다: "양자 컴퓨팅이 물류를 어떻게 최적화할 수 있나요?" → 시스템에서 양자 원리를 검색하여 실행 가능한 인사이트를 종합합니다. → 시스템이 양자 원리와 물류 알고리즘을 검색한 후 실행 가능한 인사이트를 종합합니다.</td></tr>
</tbody>
</table>
<p>단일 쿼리 기반 검색에 의존하는 기존 RAG와 달리, 에이전틱 RAG는 쿼리를 여러 하위 질문으로 세분화하고 만족스러운 답변에 도달할 때까지 반복적으로 검색을 개선합니다. 이러한 진화는 세 가지 주요 이점을 제공합니다:</p>
<ul>
<li><p><strong>능동적인 문제 해결:</strong> 시스템이 수동적으로 반응하는 방식에서 능동적으로 문제를 해결하는 방식으로 전환됩니다.</p></li>
<li><p><strong>동적 멀티턴 검색:</strong> 일회성 검색을 수행하는 대신 지속적인 피드백을 기반으로 시스템이 지속적으로 쿼리를 조정하고 스스로 수정합니다.</p></li>
<li><p><strong>폭넓은 적용성:</strong> 기본적인 사실 확인을 넘어 복잡한 추론 작업을 처리하고 종합적인 보고서를 생성할 수 있습니다.</p></li>
</ul>
<p>이러한 기능을 활용함으로써 DeepSearcher와 같은 에이전틱 RAG 앱은 인간 전문가처럼 작동하여 최종 답변뿐만 아니라 추론 과정과 실행 세부 사항에 대한 완전하고 투명한 분석을 제공합니다.</p>
<p>장기적으로 에이전틱 RAG는 기본 RAG 시스템을 추월할 것으로 예상됩니다. 기존의 접근 방식은 반복적인 추론, 반영, 지속적인 최적화가 필요한 사용자 쿼리의 기본 로직을 처리하는 데 어려움을 겪는 경우가 많습니다.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">에이전트 RAG 아키텍처는 어떤 모습일까요? 딥서처를 예로 들어보기<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 에이전트 RAG 시스템의 성능을 이해했으니, 그 아키텍처는 어떤 모습일까요? DeepSearcher를 예로 들어보겠습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 2: DeepSearcher 내의 두 모듈</em></p>
<p>DeepSearcher의 아키텍처는 크게 두 가지 모듈로 구성되어 있습니다:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. 데이터 수집 모듈</h3><p>이 모듈은 Milvus 벡터 데이터베이스를 통해 다양한 타사 독점 데이터 소스를 연결합니다. 독점 데이터 세트에 의존하는 엔터프라이즈 환경에 특히 유용합니다. 이 모듈이 처리합니다:</p>
<ul>
<li><p>문서 구문 분석 및 청킹</p></li>
<li><p>임베딩 생성</p></li>
<li><p>벡터 저장 및 인덱싱</p></li>
<li><p>효율적인 검색을 위한 메타데이터 관리</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. 온라인 추론 및 쿼리 모듈</h3><p>이 구성 요소는 RAG 프레임워크 내에서 다양한 에이전트 전략을 구현하여 정확하고 통찰력 있는 응답을 제공합니다. 이 모듈은 동적 반복 루프에서 작동하며, 각 데이터 검색 후 시스템은 축적된 정보가 원래 쿼리에 대한 충분한 답변을 제공하는지 여부를 반영합니다. 그렇지 않은 경우 또 다른 반복이 트리거되고, 그렇지 않은 경우 최종 보고서가 생성됩니다.</p>
<p>이러한 지속적인 '후속 조치'와 '반영'의 주기는 다른 기본적인 RAG 접근 방식에 비해 근본적으로 개선된 방식입니다. 기존의 RAG가 단발적인 검색 및 생성 프로세스를 수행하는 반면, DeepSearcher의 반복적인 접근 방식은 초기 질문을 하고, 받은 정보를 평가하고, 격차를 파악하고, 새로운 질문 라인을 추구하는 인간 연구원의 작업 방식을 반영합니다.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">DeepSearcher는 얼마나 효과적이며 어떤 사용 사례에 가장 적합할까요?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>설치 및 구성이 완료되면, DeepSearcher는 Milvus 벡터 데이터베이스를 통해 로컬 파일을 색인합니다. 쿼리를 제출하면 이 색인된 콘텐츠에 대해 포괄적이고 심층적인 검색을 수행합니다. 개발자를 위한 주요 장점은 시스템이 검색 및 추론 과정의 모든 단계를 기록하여 결론에 도달하는 과정을 투명하게 보여주며, 이는 RAG 시스템을 디버깅하고 최적화하는 데 중요한 기능입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 3: 딥서처 반복 재생 가속화</em></p>
<p>이 접근 방식은 기존 RAG보다 더 많은 계산 리소스를 소비하지만 복잡한 쿼리에 대해 더 나은 결과를 제공합니다. DeepSearcher가 가장 적합한 두 가지 구체적인 사용 사례에 대해 알아보겠습니다.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. 개요형 쿼리</h3><p>보고서 생성, 문서 초안 작성, 트렌드 요약과 같은 개요형 쿼리는 간략한 주제를 제공하지만 철저하고 상세한 결과물이 필요합니다.</p>
<p>예를 들어, &quot;심슨 가족은 시간이 지남에 따라 어떻게 변했나요?&quot;라고 쿼리할 때, DeepSearcher는 먼저 초기 하위 쿼리 집합을 생성합니다:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>관련 정보를 검색한 다음 피드백을 통해 반복하여 검색을 구체화하여 다음 하위 쿼리를 생성합니다:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>각 반복은 이전 반복을 기반으로 하여 다음과 같은 섹션으로 구성된 주제의 여러 측면을 다루는 종합적인 보고서로 마무리됩니다:</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(간결성을 위해 프로세스 및 최종 보고서의 일부만 발췌하여 보여드립니다.)</em></p>
<p>최종 보고서는 적절한 인용과 체계적인 구성으로 철저한 분석을 제공합니다.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. 복잡한 추론 쿼리</h3><p>복잡한 쿼리는 여러 계층의 로직과 상호 연결된 엔티티를 포함합니다.</p>
<p>다음 쿼리를 생각해 보세요: "신의 선물과 알드리 아네트 엔 브락 중 감독이 나이가 많은 영화는 무엇인가요?"</p>
<p>사람에게는 간단해 보일 수 있지만, 단순한 RAG 시스템에서는 지식 베이스에 답이 직접 저장되지 않기 때문에 어려움을 겪을 수 있습니다. 딥서처는 쿼리를 더 작은 하위 질문으로 분해하여 이 문제를 해결합니다:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>먼저 두 영화의 감독에 대한 정보를 검색합니다,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 하위 쿼리를 생성합니다:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 생년월일을 추출하고 마지막으로 이를 비교하여 정답을 결정합니다:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>반면, 기존의 RAG 시스템은 한 번에 제한된 검색으로 인해 주요 세부 정보를 놓칠 수 있으며, 잠재적으로 <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">엉뚱하거나</a> 부정확한 답변이 나올 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher는 가져온 로컬 데이터에 대해 심층적인 반복 검색을 수행한다는 점에서 돋보입니다. 추론 과정의 각 단계를 기록하고 궁극적으로 종합적이고 통합된 보고서를 제공합니다. 따라서 상세 보고서 생성이나 추세 요약과 같은 개요 유형의 쿼리와 질문을 더 작은 하위 질문으로 세분화하고 여러 피드백 루프를 통해 데이터를 집계해야 하는 복잡한 추론 쿼리에 특히 효과적입니다.</p>
<p>다음 섹션에서는 반복적인 접근 방식과 유연한 모델 통합이 기존 방식과 어떻게 비교되는지 살펴보면서 DeepSearcher를 다른 RAG 시스템과 비교해 보겠습니다.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">정량적 비교: DeepSearcher와 기존 RAG 비교<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSearcher GitHub 리포지토리에는 정량적 테스트를 위한 코드가 공개되어 있습니다. 이 분석에는 널리 사용되는 2WikiMultiHopQA 데이터 세트를 사용했습니다. (참고: API 토큰 소비를 관리하기 위해 처음 50개 항목만 평가했지만 전반적인 추세는 명확합니다.)</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">리콜률 비교</h3><p>그림 4에서 볼 수 있듯이, 최대 반복 횟수가 증가함에 따라 리콜률이 크게 향상됩니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 4: 최대 반복 횟수 대 리콜률 비교</em></p>
<p>특정 시점 이후에는 한계 개선이 줄어들기 때문에 일반적으로 기본값을 3회의 반복으로 설정하지만, 필요에 따라 조정할 수 있습니다.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">토큰 소비 분석</h3><p>또한 다양한 반복 횟수에 걸쳐 50개의 쿼리에 대한 총 토큰 사용량을 측정했습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 5: 최대 반복 횟수 대 토큰 사용량 비교</em></p>
<p>그 결과, 반복 횟수가 증가할수록 토큰 사용량이 선형적으로 증가하는 것으로 나타났습니다. 예를 들어, 반복 횟수가 4회인 경우, DeepSearcher는 약 0.3M 토큰을 소비합니다. OpenAI의 gpt-4o-mini 가격인 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>60/1M</mi></mrow><annotation encoding="application/x-tex">출력 토큰을</annotation></semantics></math></span></span>기준으로 대략적인 추정치를 사용하면 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">, 이는</annotation></semantics></math></span></span>쿼리당 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">평균 비용 약</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0. <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">60/1M</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">출력 토큰</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">0</span></span></span></span>.0036(또는 쿼리 50개의 경우 약 $0.18)에 해당합니다.</p>
<p>리소스 집약적인 추론 모델의 경우, 토큰당 가격이 더 높고 토큰 출력량이 더 많기 때문에 비용이 몇 배 더 높을 수 있습니다.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">모델 성능 비교</h3><p>딥서처의 가장 큰 장점은 다양한 모델을 유연하게 전환할 수 있다는 점입니다. 다양한 추론 모델과 비추론 모델(예: gpt-4o-mini)을 테스트했습니다. 전반적으로 추론 모델, 특히 클로드 3.7 소네트가 가장 우수한 성능을 보였지만 그 차이는 크지 않았습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 6: 모델별 평균 회상률</em></p>
<p>특히 일부 소규모 비추론 모델은 지침을 따르는 능력이 제한되어 전체 에이전트 쿼리 프로세스를 완료하지 못하는 경우가 있었는데, 이는 유사한 시스템을 사용하는 많은 개발자들이 흔히 겪는 문제입니다.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">딥서처(에이전트 RAG)와 그래프 RAG 비교<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">그래프 RAG는</a> 복잡한 쿼리, 특히 멀티홉 쿼리도 처리할 수 있습니다. 그렇다면 딥서처(에이전트 RAG)와 그래프 RAG의 차이점은 무엇일까요?</p>
<p>Graph RAG는 명시적 관계형 링크를 기반으로 문서를 쿼리하도록 설계되어 특히 멀티홉 쿼리에 강합니다. 예를 들어, 긴 소설을 처리할 때 Graph RAG는 등장인물 간의 복잡한 관계를 정확하게 추출할 수 있습니다. 그러나 이 방법은 이러한 관계를 매핑하기 위해 데이터를 가져오는 동안 상당한 토큰 사용이 필요하며, 쿼리 모드가 경직되는 경향이 있어 일반적으로 단일 관계 쿼리에만 효과적입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 7: 그래프 RAG와 DeepSearcher 비교</em></p>
<p>이와는 대조적으로, DeepSearcher에서 예시된 에이전트 RAG는 근본적으로 다른 접근 방식을 취합니다. 이 방식은 데이터를 가져오는 동안 토큰 소비를 최소화하고 대신 쿼리 처리 중에 계산 리소스를 투자합니다. 이러한 설계 선택은 중요한 기술적 절충점을 만들어냅니다:</p>
<ol>
<li><p>초기 비용 절감: DeepSearcher는 문서 전처리가 덜 필요하기 때문에 초기 설정이 더 빠르고 저렴합니다.</p></li>
<li><p>동적 쿼리 처리: 시스템이 중간 결과에 따라 검색 전략을 즉각적으로 조정할 수 있습니다.</p></li>
<li><p>쿼리당 비용 증가: 각 쿼리는 Graph RAG보다 더 많은 계산을 필요로 하지만 더 유연한 결과를 제공합니다.</p></li>
</ol>
<p>개발자의 경우, 이러한 차이는 사용 패턴이 다른 시스템을 설계할 때 매우 중요합니다. 예측 가능한 쿼리 패턴과 쿼리 양이 많은 애플리케이션에는 Graph RAG가 더 효율적일 수 있지만, 유연성이 필요하고 예측할 수 없는 복잡한 쿼리를 처리해야 하는 시나리오에서는 DeepSearcher의 접근 방식이 더 뛰어납니다.</p>
<p>앞으로 LLM의 비용이 하락하고 추론 성능이 계속 향상됨에 따라, DeepSearcher와 같은 에이전틱 RAG 시스템이 더욱 널리 보급될 것으로 보입니다. 계산 비용의 단점은 줄어들고 유연성의 장점은 유지될 것입니다.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">딥서처와 딥 리서치 비교<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI의 딥 리서치와 달리 DeepSearcher는 비공개 데이터의 심층 검색 및 분석에 특별히 맞춤화되어 있습니다. 벡터 데이터베이스를 활용하여 다양한 데이터 소스를 수집하고, 다양한 데이터 유형을 통합하고, 벡터 기반 지식 저장소에 균일하게 저장할 수 있습니다. 강력한 시맨틱 검색 기능을 통해 방대한 양의 오프라인 데이터를 효율적으로 검색할 수 있습니다.</p>
<p>또한, DeepSearcher는 완전한 오픈 소스입니다. 딥 리서치는 콘텐츠 생성 품질 면에서 여전히 선두를 달리고 있지만, 월별 요금이 부과되고 비공개 소스 제품으로 운영되기 때문에 내부 프로세스가 사용자에게 공개되지 않습니다. 이와는 대조적으로, 사용자가 코드를 검토하고 필요에 맞게 사용자 정의하거나 자체 프로덕션 환경에 배포할 수도 있는 완전한 투명성을 제공합니다.</p>
<h2 id="Technical-Insights" class="common-anchor-header">기술 인사이트<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>개발 과정과 그 이후의 반복 작업을 통해 몇 가지 중요한 기술적 인사이트를 수집했습니다:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">추론 모델: 효과적이지만 완벽하지는 않은 추론 모델</h3><p>실험 결과, 추론 모델은 에이전트 역할을 잘 수행하지만 때로는 간단한 명령을 과도하게 분석하여 토큰을 과도하게 소비하고 응답 시간을 느리게 만드는 것으로 나타났습니다. 이러한 관찰은 더 이상 추론 모델과 비추론 모델을 구분하지 않는 OpenAI와 같은 주요 AI 제공업체의 접근 방식과 일치합니다. 대신, 모델 서비스는 토큰 보존을 위한 특정 요구 사항에 따라 추론의 필요성을 자동으로 결정해야 합니다.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">에이전트 RAG의 임박한 부상</h3><p>수요 측면에서 심층적인 콘텐츠 생성은 필수적이며, 기술적으로도 RAG의 효율성을 높이는 것이 중요합니다. 장기적으로 에이전틱 RAG의 광범위한 채택을 가로막는 가장 큰 장벽은 비용입니다. 그러나 DeepSeek-R1과 같은 비용 효율적인 고품질 LLM의 등장과 무어의 법칙에 따른 비용 절감으로 추론 서비스 관련 비용은 감소할 것으로 예상됩니다.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">에이전트 RAG의 숨겨진 확장 한계</h3><p>이번 연구에서 중요한 발견은 성능과 컴퓨팅 리소스 간의 관계에 관한 것입니다. 처음에는 단순히 반복 횟수와 토큰 할당량을 늘리면 복잡한 쿼리의 결과가 비례적으로 개선될 것이라는 가설을 세웠습니다.</p>
<p>하지만 실험 결과, 반복 횟수를 늘릴수록 성능이 향상되기는 하지만 뚜렷한 수익률 감소가 관찰되는 미묘한 현실이 드러났습니다. 구체적으로 살펴보면 다음과 같습니다:</p>
<ul>
<li><p>1회에서 3회 반복으로 성능이 급격히 향상됨</p></li>
<li><p>3~5회 반복에서는 개선이 완만하게 이루어졌습니다.</p></li>
<li><p>5회 반복 이후에는 토큰 소비가 크게 증가했음에도 불구하고 수익이 미미하게 증가했습니다.</p></li>
</ul>
<p>이 결과는 개발자에게 중요한 시사점을 줍니다. 단순히 RAG 시스템에 더 많은 컴퓨팅 리소스를 투입하는 것이 가장 효율적인 접근 방식은 아니라는 것입니다. 검색 전략, 분해 로직, 합성 프로세스의 품질이 원시 반복 횟수보다 더 중요한 경우가 많습니다. 이는 개발자가 단순히 토큰 예산을 늘리기보다는 이러한 구성 요소를 최적화하는 데 집중해야 함을 시사합니다.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">기존 RAG를 넘어선 진화</h3><p>기존의 RAG는 저비용의 단일 검색 접근 방식으로 상당한 효율성을 제공하므로 간단한 질문-답변 시나리오에 적합합니다. 하지만 복잡한 암시적 로직이 포함된 쿼리를 처리할 때는 그 한계가 분명해집니다.</p>
<p>"1년에 1억을 버는 방법"과 같은 사용자 쿼리를 생각해 봅시다. 기존의 RAG 시스템은 고수익 직업이나 투자 전략에 대한 콘텐츠를 검색할 수는 있지만, 이를 처리하는 데는 어려움을 겪을 것입니다:</p>
<ol>
<li><p>쿼리에서 비현실적인 기대치를 파악합니다.</p></li>
<li><p>문제를 실현 가능한 하위 목표로 세분화하기</p></li>
<li><p>여러 영역(비즈니스, 재무, 기업가 정신)의 정보를 종합합니다.</p></li>
<li><p>현실적인 타임라인과 함께 구조화된 다중 경로 접근 방식 제시</p></li>
</ol>
<p>바로 이 부분에서 DeepSearcher와 같은 에이전틱 RAG 시스템이 강점을 발휘합니다. 복잡한 쿼리를 분해하고 다단계 추론을 적용함으로써 사용자의 근본적인 정보 요구 사항을 더 잘 해결할 수 있는 미묘하고 포괄적인 응답을 제공할 수 있습니다. 이러한 시스템의 효율성이 높아짐에 따라 엔터프라이즈 애플리케이션 전반에 걸쳐 도입이 가속화될 것으로 예상됩니다.</p>
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
    </button></h2><p>DeepSearcher는 RAG 시스템 설계에서 중요한 진화를 이루었으며, 개발자에게 보다 정교한 검색 및 연구 기능을 구축할 수 있는 강력한 프레임워크를 제공합니다. 주요 기술적 장점은 다음과 같습니다:</p>
<ol>
<li><p>반복 추론: 복잡한 쿼리를 논리적 하위 단계로 나누고 종합적인 답변을 향해 점진적으로 구축할 수 있습니다.</p></li>
<li><p>유연한 아키텍처: 기본 모델 교체 지원 및 특정 애플리케이션 요구 사항에 맞게 추론 프로세스를 사용자 정의할 수 있습니다.</p></li>
<li><p>벡터 데이터베이스 통합: 개인 데이터 소스에서 벡터 임베딩의 효율적인 저장 및 검색을 위해 Milvus에 원활하게 연결 가능</p></li>
<li><p>투명한 실행: 각 추론 단계에 대한 상세한 로깅을 통해 개발자가 시스템 동작을 디버그하고 최적화할 수 있습니다.</p></li>
</ol>
<p>성능 테스트 결과, 딥서처는 계산 효율성에 있어 분명한 트레이드오프가 있지만 기존의 RAG 접근 방식에 비해 복잡한 쿼리에 대해 우수한 결과를 제공한다는 것이 확인되었습니다. 최적의 구성(일반적으로 약 3회 반복)은 정확도와 리소스 소비의 균형을 맞춥니다.</p>
<p>LLM 비용이 계속 감소하고 추론 능력이 향상됨에 따라, DeepSearcher에 구현된 에이전트 RAG 접근 방식은 프로덕션 애플리케이션에 점점 더 실용화될 것입니다. 엔터프라이즈 검색, 리서치 어시스턴트 또는 지식 관리 시스템을 개발하는 개발자를 위해 DeepSearcher는 특정 도메인 요구사항에 맞게 사용자 정의할 수 있는 강력한 오픈 소스 기반을 제공합니다.</p>
<p>개발자 커뮤니티의 기여를 환영하며, <a href="https://github.com/zilliztech/deep-searcher">GitHub 리포지토리를</a> 확인하여 RAG 구현의 새로운 패러다임을 탐구해 보시기 바랍니다.</p>
