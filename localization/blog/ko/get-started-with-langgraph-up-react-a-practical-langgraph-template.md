---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: '랭그래프 업 리액트 시작하기: 실용적인 LangGraph 템플릿'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: ReAct 에이전트를 위한 즉시 사용 가능한 LangGraph + ReAct 템플릿인 langgraph-up-react를 소개합니다.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>AI 에이전트는 응용 AI의 핵심 패턴으로 자리 잡고 있습니다. 더 많은 프로젝트가 단일 프롬프트와 배선 모델을 넘어 의사 결정 루프로 전환하고 있습니다. 이는 매우 흥미로운 일이지만, 상태 관리, 도구 조정, 브랜치 처리, 인간 핸드오프 추가 등 즉각적으로 명확하지 않은 일들을 의미하기도 합니다.</p>
<p>이 레이어를 위한 강력한 선택은<a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph입니다</strong></a>. 이 프레임워크는 루프, 조건부, 지속성, 휴먼 인 더 루프 제어, 스트리밍 등 아이디어를 실제 멀티 에이전트 앱으로 전환하기에 충분한 구조를 제공하는 AI 프레임워크입니다. 하지만 LangGraph는 가파른 학습 곡선을 가지고 있습니다. 문서가 빠르게 이동하고 추상적인 표현에 익숙해지는 데 시간이 걸리며, 간단한 데모에서 제품처럼 느껴지는 것으로 넘어가는 과정에서 좌절감을 느낄 수 있습니다.</p>
<p>최근에 저는 ReAct 에이전트를 위해 바로 사용할 수 있는 LangGraph + ReAct <a href="https://github.com/webup/langgraph-up-react"><strong>템플릿인 langgraph-up-react를</strong></a>사용하기 시작했습니다. 이 템플릿은 설정을 간소화하고, 합리적인 기본값을 제공하며, 상용구 대신 동작에 집중할 수 있게 해줍니다. 이 글에서는 이 템플릿을 사용하여 LangGraph를 시작하는 방법을 안내해 드리겠습니다.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">리액트 에이전트 이해하기<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>템플릿 자체에 대해 알아보기 전에 우리가 구축할 에이전트의 종류를 살펴볼 필요가 있습니다. 오늘날 가장 일반적인 패턴 중 하나는 <strong>ReAct(Reason + Act)</strong> 프레임워크로, 2022년 Google의 <em>'</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct</em></a>' 백서에서 처음 소개되었습니다<a href="https://arxiv.org/abs/2210.03629"><em>:</em></a><a href="https://arxiv.org/abs/2210.03629"><em>언어 모델에서 추론과 행동의 시너지 효과</em></a><em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>에서</em></a> 처음<em>소개되었습니다</em><a href="https://arxiv.org/abs/2210.03629"><em>.</em></a></p>
<p>추론과 행동을 별개의 것으로 취급하는 대신 ReAct는 이를 인간의 문제 해결과 매우 유사한 피드백 루프에 결합합니다. 에이전트는 문제에 대해 <strong>추론하고</strong> 도구나 API를 호출하여 <strong>조치를</strong> 취한 다음 결과를 <strong>관찰한</strong> 후 다음에 수행할 작업을 결정합니다. 이 간단한 사이클(추론 → 행동 → 관찰)을 통해 상담원은 정해진 스크립트를 따르지 않고 동적으로 적응할 수 있습니다.</p>
<p>각 요소들이 어떻게 서로 맞물려 있는지는 다음과 같습니다:</p>
<ul>
<li><p><strong>이유</strong>: 이 모델은 문제를 단계별로 나누고 전략을 계획하며 중간에 실수를 수정할 수도 있습니다.</p></li>
<li><p><strong>행동</strong>: 추론에 따라 상담원은 검색 엔진, 계산기, 사용자 지정 API 등의 도구를 호출합니다.</p></li>
<li><p><strong>관찰합니다</strong>: 상담원은 도구의 출력을 살펴보고 결과를 필터링한 다음 다음 추론 단계에 다시 피드백합니다.</p></li>
</ul>
<p>이 루프는 빠르게 최신 AI 에이전트의 근간이 되었습니다. ChatGPT 플러그인, RAG 파이프라인, 지능형 어시스턴트, 심지어 로보틱스에서도 그 흔적을 볼 수 있습니다. 저희의 경우 <code translate="no">langgraph-up-react</code> 템플릿이 그 기반이 되고 있습니다.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">LangGraph 이해하기<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 ReAct 패턴에 대해 살펴봤으니 다음 질문은 실제로 이를 어떻게 구현할 수 있을까요? 기본적으로 대부분의 언어 모델은 다단계 추론을 잘 처리하지 못합니다. 각 호출은 상태가 없는 상태이므로 모델은 답을 생성하고 완료되는 즉시 모든 것을 잊어버립니다. 따라서 중간 결과를 전달하거나 이전 단계를 기반으로 이후 단계를 조정하기가 어렵습니다.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph는</strong></a> 이 간극을 좁힙니다. 모든 프롬프트를 일회성으로 처리하는 대신 복잡한 작업을 여러 단계로 나누고 각 단계에서 발생한 일을 기억하며 현재 상태에 따라 다음에 수행할 작업을 결정할 수 있는 방법을 제공합니다. 즉, 상담원의 추론 프로세스를 임시적인 프롬프트의 연속이 아니라 구조화되고 반복 가능한 것으로 바꿔줍니다.</p>
<p><strong>AI 추론을 위한 순서도라고</strong> 생각하면 됩니다:</p>
<ul>
<li><p>사용자 쿼리<strong>분석</strong> </p></li>
<li><p>작업에 적합한 도구를<strong>선택합니다</strong>.</p></li>
<li><p>도구를 호출하여 작업<strong>실행</strong> </p></li>
<li><p>결과<strong>처리</strong> </p></li>
<li><p>작업이 완료되었는지<strong>확인하고</strong>, 완료되지 않은 경우 반복하여 추론을 계속합니다.</p></li>
<li><p>최종 답변<strong>출력</strong> </p></li>
</ul>
<p>이 과정에서 LangGraph는 <strong>메모리 저장을</strong> 처리하여 이전 단계의 결과가 손실되지 않도록 하며, <strong>외부 도구 라이브러리</strong> (API, 데이터베이스, 검색, 계산기, 파일 시스템 등)와 통합됩니다.</p>
<p>이것이 바로 <em>LangGraph라고</em> 불리는 이유입니다: <strong>Lang(언어) + 그래프, 즉</strong>언어 모델이 시간에 따라 사고하고 행동하는 방식을 정리하는 프레임워크입니다.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">랭그래프-업-리액트 이해하기<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph는 강력하지만 오버헤드가 발생합니다. 상태 관리 설정, 노드와 엣지 디자인, 오류 처리, 모델과 도구의 배선 등은 모두 시간이 걸립니다. 다단계 플로우를 디버깅하는 것도 힘들 수 있습니다. 문제가 발생하면 노드나 전환에 문제가 있을 수 있기 때문입니다. 프로젝트가 성장함에 따라 작은 변경 사항도 코드베이스에 파급되어 모든 것이 느려질 수 있습니다.</p>
<p>이때 성숙한 템플릿이 큰 차이를 만들어냅니다. 템플릿은 처음부터 다시 시작하는 대신 검증된 구조, 사전 구축된 도구 및 바로 작동하는 스크립트를 제공합니다. 상용구는 건너뛰고 에이전트 로직에 직접 집중할 수 있습니다.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react가</strong></a> 그러한 템플릿 중 하나입니다. 이 템플릿은 다음과 같은 기능을 통해 LangGraph ReAct 에이전트를 빠르게 가동할 수 있도록 설계되었습니다:</p>
<ul>
<li><p><strong>내장된 도구 에코시스템</strong>: 즉시 사용할 수 있는 어댑터 및 유틸리티 제공</p></li>
<li><p><strong>빠른 시작</strong>: 간단한 구성 및 몇 분 안에 에이전트 작동 가능</p></li>
<li><p><strong>테스트 포함</strong>: 확장을 위한 단위 테스트 및 통합 테스트를 통해 확신을 가질 수 있습니다.</p></li>
<li><p><strong>프로덕션 준비 설정</strong>: 배포 시 시간을 절약하는 아키텍처 패턴 및 스크립트</p></li>
</ul>
<p>요컨대, 비즈니스 문제를 실제로 해결하는 에이전트 구축에 집중할 수 있도록 상용구를 처리해 줍니다.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">langgraph-up-react 템플릿 시작하기<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>템플릿을 실행하는 것은 간단합니다. 단계별 설정 프로세스는 다음과 같습니다:</p>
<ol>
<li>환경 종속성 설치</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>프로젝트 복제</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>의존성 설치</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>환경 구성</li>
</ol>
<p>구성 예제를 복사하고 키를 추가합니다:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>.env를 편집하고 모델 공급자 하나 이상과 Tavily API 키를 설정합니다:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>프로젝트 시작</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>이제 개발 서버가 가동되고 테스트할 준비가 되었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">langgraph-up-react로 무엇을 만들 수 있나요?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>템플릿이 실행되고 나면 실제로 무엇을 할 수 있을까요? 다음은 실제 프로젝트에 어떻게 적용될 수 있는지 보여주는 두 가지 구체적인 예시입니다.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">기업 지식 기반 Q&amp;A(에이전트 RAG)</h3><p>일반적인 사용 사례는 회사 지식에 대한 내부 Q&amp;A 도우미입니다. 제품 설명서, 기술 문서, FAQ 등 유용하지만 흩어져 있는 정보를 생각해보세요. <code translate="no">langgraph-up-react</code> 을 사용하면 <a href="https://milvus.io/"><strong>Milvus</strong></a> 벡터 데이터베이스에서 이러한 문서를 색인하고, 가장 관련성이 높은 구절을 검색하며, 문맥에 기반한 정확한 답변을 생성하는 에이전트를 만들 수 있습니다.</p>
<p>배포를 위해 Milvus는 유연한 옵션을 제공합니다: 빠른 프로토타이핑을 위한 <strong>Lite</strong>, 중간 규모의 프로덕션 워크로드를 위한 <strong>독립형</strong>, 엔터프라이즈급 시스템을 위한 <strong>분산형</strong> 등 <strong>다양한</strong> 옵션을 제공합니다. 또한 속도와 정확도의 균형을 맞추기 위해 인덱스 매개변수(예: HNSW)를 조정하고 지연 시간 및 리콜에 대한 모니터링을 설정하여 부하가 걸린 상태에서도 시스템이 안정적으로 유지되도록 할 수 있습니다.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">멀티 에이전트 협업</h3><p>또 다른 강력한 사용 사례는 다중 에이전트 협업입니다. 한 명의 상담원이 모든 일을 처리하는 대신 여러 명의 전문 상담원이 함께 작업하도록 정의할 수 있습니다. 예를 들어 소프트웨어 개발 워크플로에서 제품 관리자 에이전트는 요구 사항을 분류하고, 아키텍트 에이전트는 설계 초안을 작성하며, 개발자 에이전트는 코드를 작성하고, 테스트 에이전트는 결과를 검증합니다.</p>
<p>이러한 오케스트레이션은 상태 관리, 브랜칭, 에이전트 간 조율이라는 LangGraph의 강점을 강조합니다. 이 설정에 대해서는 이후 글에서 더 자세히 다루겠지만, 핵심은 <code translate="no">langgraph-up-react</code> 을 사용하면 스캐폴딩에 몇 주를 들이지 않고도 이러한 패턴을 실용적으로 시도할 수 있다는 것입니다.</p>
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
    </button></h2><p>신뢰할 수 있는 에이전트를 구축한다는 것은 단순히 영리한 프롬프트를 만드는 것이 아니라 추론을 구조화하고, 상태를 관리하며, 모든 것을 실제로 유지 관리할 수 있는 시스템으로 연결하는 것입니다. LangGraph는 이를 위한 프레임워크를 제공하며, <code translate="no">langgraph-up-react</code> 는 에이전트 동작에 집중할 수 있도록 상용구를 처리하여 장벽을 낮춰줍니다.</p>
<p>이 템플릿을 사용하면 설정에 헤매지 않고 지식창고 Q&amp;A 시스템이나 다중 상담원 워크플로우와 같은 프로젝트를 시작할 수 있습니다. 시간을 절약하고 일반적인 함정을 피하며 LangGraph를 훨씬 더 원활하게 실험할 수 있는 출발점입니다.</p>
<p>다음 글에서는 실습 튜토리얼을 통해 템플릿을 확장하고 실제 사용 사례에 맞게 작동하는 에이전트를 구축하는 방법을 단계별로 자세히 살펴보겠습니다( <code translate="no">langgraph-up-react</code>, Milvus 벡터 데이터베이스). 기대해 주세요.</p>
