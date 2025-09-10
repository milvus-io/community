---
id: langchain-vs-langgraph.md
title: '랭체인과 랭그래프 비교: AI 프레임워크 선택을 위한 개발자 가이드'
author: Min Yin
date: 2025-09-09T00:00:00.000Z
desc: >-
  LLM 앱용 LangChain과 LangGraph를 비교해 보세요. 아키텍처, 상태 관리 및 사용 사례에서 어떻게 다른지, 그리고 각각의
  사용 시기를 알아보세요.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_9_2025_09_42_12_PM_1_49154d15cc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, langchain, langgraph'
meta_keywords: 'Milvus, vector database, langchain, langgraph, langchain vs langgraph'
meta_title: |
  LangChain vs LangGraph: A Developer's Guide to Choosing Your AI Frameworks
origin: 'https://milvus.io/blog/langchain-vs-langgraph.md'
---
<p>대규모 언어 모델(LLM)로 빌드할 때 선택하는 프레임워크는 개발 경험에 큰 영향을 미칩니다. 좋은 프레임워크는 워크플로를 간소화하고 상용구를 줄이며 프로토타입에서 프로덕션으로 쉽게 이동할 수 있게 해줍니다. 적합하지 않은 프레임워크는 반대로 마찰과 기술 부채를 가중시킬 수 있습니다.</p>
<p>현재 가장 인기 있는 두 가지 옵션은 오픈 소스이며 <a href="https://python.langchain.com/docs/introduction/"><strong>LangChain</strong></a> 팀에서 만든 LangChain과 <a href="https://langchain-ai.github.io/langgraph/"><strong>LangGraph입니다</strong></a>. LangChain은 구성 요소 오케스트레이션과 워크플로 자동화에 초점을 맞추기 때문에 검색 증강 생성<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>과 같은 일반적인 사용 사례에 적합합니다. LangGraph는 상태 저장 애플리케이션, 복잡한 의사 결정, 다중 에이전트 조정에 더 적합한 그래프 기반 아키텍처로 LangChain 위에 구축됩니다.</p>
<p>이 가이드에서는 두 프레임워크의 작동 방식, 강점, 가장 적합한 프로젝트 유형 등을 나란히 비교해보겠습니다. 이 가이드가 끝나면 어떤 프레임워크가 여러분의 필요에 가장 적합한지 더 명확하게 파악할 수 있을 것입니다.</p>
<h2 id="LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="common-anchor-header">LangChain: 컴포넌트 라이브러리 및 LCEL 오케스트레이션의 강자<button data-href="#LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langchain"><strong>LangChain은</strong></a> LLM 애플리케이션을 보다 쉽게 구축할 수 있도록 설계된 오픈소스 프레임워크입니다. 모델(예: OpenAI의 <a href="https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md">GPT-5</a> 또는 Anthropic의 <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude</a>)과 실제 앱 사이에 있는 미들웨어라고 생각하면 됩니다. 주요 역할은 프롬프트, 외부 API, <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스</a>, 사용자 지정 비즈니스 로직 등 모든 움직이는 부분을 <em>서로</em> 연결하도록 돕는 것입니다.</p>
<p>RAG를 예로 들어보겠습니다. LangChain은 모든 것을 처음부터 배선하는 대신, LLM을 벡터 스토어(예: <a href="https://milvus.io/">Milvus</a> 또는 <a href="https://zilliz.com/cloud">Zilliz Cloud</a>)와 연결하고, 시맨틱 검색을 실행하고, 결과를 프롬프트에 다시 피드하는 기성품 추상화를 제공합니다. 그 외에도 프롬프트 템플릿, 도구를 호출할 수 있는 에이전트, 복잡한 워크플로를 유지 관리할 수 있는 오케스트레이션 계층을 위한 유틸리티를 제공합니다.</p>
<p><strong>LangChain이 돋보이는 이유는 무엇인가요?</strong></p>
<ul>
<li><p><strong>풍부한 구성 요소 라이브러리</strong> - 문서 로더, 텍스트 스플리터, 벡터 스토리지 커넥터, 모델 인터페이스 등.</p></li>
<li><p><strong>LCEL(LangChain 표현 언어) 오케스트레이션</strong> - 보일러플레이트가 적은 선언적 방식으로 구성 요소를 믹스 앤 매치할 수 있습니다.</p></li>
<li><p><strong>손쉬운 통합</strong> - API, 데이터베이스, 타사 도구와 원활하게 연동됩니다.</p></li>
<li><p><strong>성숙한 에코시스템</strong> - 강력한 문서, 예제 및 활발한 커뮤니티.</p></li>
</ul>
<h2 id="LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="common-anchor-header">LangGraph: 스테이트풀 에이전트 시스템을 위한 최고의 선택<button data-href="#LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langgraph">LangGraph는</a> 스테이트풀 애플리케이션에 초점을 맞춘 LangChain의 전문 확장입니다. 워크플로를 선형 스크립트로 작성하는 대신, 노드와 에지의 그래프, 즉 상태 머신으로 정의합니다. 각 노드는 LLM 호출, 데이터베이스 쿼리, 조건 확인과 같은 작업을 나타내며, 에지는 결과에 따라 흐름이 어떻게 움직이는지를 정의합니다. 이 구조를 사용하면 코드가 if/else 문으로 얽히지 않고 루프, 분기 및 재시도를 더 쉽게 처리할 수 있습니다.</p>
<p>이 접근 방식은 코파일럿이나 <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">자율 에이전트와</a> 같은 고급 사용 사례에 특히 유용합니다. 이러한 시스템은 종종 메모리를 추적하고, 예상치 못한 결과를 처리하거나, 동적으로 의사 결정을 내려야 합니다. LangGraph는 로직을 그래프로 명시적으로 모델링함으로써 이러한 동작을 더욱 투명하고 유지 관리하기 쉽게 만듭니다.</p>
<p><strong>LangGraph의 핵심 기능은 다음과 같습니다:</strong></p>
<ul>
<li><p><strong>그래프 기반 아키텍처</strong> - 루프, 백트래킹, 복잡한 제어 흐름을 기본적으로 지원합니다.</p></li>
<li><p><strong>상태 관리</strong> - 중앙 집중식 상태로 여러 단계에 걸쳐 컨텍스트가 보존됩니다.</p></li>
<li><p><strong>다중 에이전트 지원</strong> - 여러 에이전트가 협업하거나 조율하는 시나리오를 위해 구축되었습니다.</p></li>
<li><p><strong>디버깅 도구</strong> - 그래프 실행을 추적하기 위해 LangSmith Studio를 통한 시각화 및 디버깅.</p></li>
</ul>
<h2 id="LangChain-vs-LangGraph-Technical-Deep-Dive" class="common-anchor-header">LangChain과 LangGraph 비교: 기술 심층 분석<button data-href="#LangChain-vs-LangGraph-Technical-Deep-Dive" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Architecture" class="common-anchor-header">아키텍처</h3><p>LangChain은 <strong>LCEL(LangChain 표현 언어)을</strong> 사용해 선형 파이프라인에서 구성 요소를 서로 연결합니다. 이는 선언적이고 가독성이 뛰어나며, RAG와 같은 간단한 워크플로우에 적합합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># LangChain LCEL orchestration example</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Please answer the following question: {question}&quot;</span>)
model = ChatOpenAI()

<span class="hljs-comment"># LCEL chain orchestration</span>
chain = prompt | model

<span class="hljs-comment"># Run the chain</span>
result = chain.invoke({<span class="hljs-string">&quot;question&quot;</span>: <span class="hljs-string">&quot;What is artificial intelligence?&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>LangGraph는 다른 접근 방식을 취합니다. 워크플로는 <strong>노드와 에지의 그래프로</strong> 표현됩니다. 각 노드는 작업을 정의하고 그래프 엔진은 상태, 분기 및 재시도를 관리합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># LangGraph graph structure definition</span>
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict

<span class="hljs-keyword">class</span> <span class="hljs-title class_">State</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: <span class="hljs-built_in">list</span>
    current_step: <span class="hljs-built_in">str</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">node_a</span>(<span class="hljs-params">state: State</span>) -&gt; State:
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [<span class="hljs-string">&quot;Processing A&quot;</span>], <span class="hljs-string">&quot;current_step&quot;</span>: <span class="hljs-string">&quot;A&quot;</span>}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">node_b</span>(<span class="hljs-params">state: State</span>) -&gt; State:
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [<span class="hljs-string">&quot;Processing B&quot;</span>], <span class="hljs-string">&quot;current_step&quot;</span>: <span class="hljs-string">&quot;B&quot;</span>}

graph = StateGraph(State)
graph.add_node(<span class="hljs-string">&quot;node_a&quot;</span>, node_a)
graph.add_node(<span class="hljs-string">&quot;node_b&quot;</span>, node_b)
graph.add_edge(<span class="hljs-string">&quot;node_a&quot;</span>, <span class="hljs-string">&quot;node_b&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LCEL이 깔끔한 선형 파이프라인을 제공하는 반면, LangGraph는 기본적으로 루프, 분기, 조건부 흐름을 지원합니다. 따라서 <strong>에이전트와 같은 시스템이나</strong> 직선을 따르지 않는 다단계 상호 작용에 더 적합합니다.</p>
<h3 id="State-Management" class="common-anchor-header">상태 관리</h3><ul>
<li><p><strong>LangChain</strong>: 컨텍스트 전달을 위해 메모리 컴포넌트를 사용합니다. 간단한 멀티턴 대화나 선형 워크플로에 적합합니다.</p></li>
<li><p><strong>LangGraph</strong>: 롤백, 역추적, 상세 히스토리를 지원하는 중앙 집중식 상태 시스템을 사용합니다. 컨텍스트 연속성이 중요한 장기 실행 상태 저장 앱에 필수적입니다.</p></li>
</ul>
<h3 id="Execution-Models" class="common-anchor-header">실행 모델</h3><table>
<thead>
<tr><th><strong>기능</strong></th><th><strong>LangChain</strong></th><th><strong>LangGraph</strong></th></tr>
</thead>
<tbody>
<tr><td>실행 모드</td><td>선형 오케스트레이션</td><td>스테이트풀(그래프) 실행</td></tr>
<tr><td>루프 지원</td><td>제한적 지원</td><td>네이티브 지원</td></tr>
<tr><td>조건부 분기</td><td>런처블맵을 통해 구현</td><td>네이티브 지원</td></tr>
<tr><td>예외 처리</td><td>RunnableBranch를 통해 구현됨</td><td>내장 지원</td></tr>
<tr><td>오류 처리</td><td>체인 스타일 전송</td><td>노드 수준 처리</td></tr>
</tbody>
</table>
<h2 id="Real-World-Use-Cases-When-to-Use-Each" class="common-anchor-header">실제 사용 사례: 각각의 사용 시기<button data-href="#Real-World-Use-Cases-When-to-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p>프레임워크는 단순히 아키텍처에 관한 것이 아니라 다양한 상황에서 빛을 발합니다. 따라서 실제 질문은 언제 LangChain을 사용해야 하고, 언제 LangGraph가 더 합리적일까요? 몇 가지 실용적인 시나리오를 살펴보겠습니다.</p>
<h3 id="When-LangChain-Is-Your-Best-Choice" class="common-anchor-header">랭체인이 최선의 선택인 경우</h3><h4 id="1-Straightforward-Task-Processing" class="common-anchor-header">1. 간단한 작업 처리</h4><p>복잡한 상태 추적이나 분기 로직 없이 입력을 출력으로 변환해야 할 때 LangChain이 적합합니다. 예를 들어, 선택한 텍스트를 번역하는 브라우저 확장 프로그램을 예로 들 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Implementing simple text translation using LCEL</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Translate the following text to English: {text}&quot;</span>)
model = ChatOpenAI()
chain = prompt | model

result = chain.invoke({<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Hello, World!&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>이 경우 메모리, 재시도 또는 다단계 추론이 필요하지 않고 효율적인 입력-출력 변환만 있으면 됩니다. LangChain은 코드를 깔끔하고 집중적으로 유지합니다.</p>
<h4 id="2-Foundation-Components" class="common-anchor-header">2. 기본 구성 요소</h4><p>LangChain은 보다 복잡한 시스템을 구축하기 위한 빌딩 블록 역할을 할 수 있는 풍부한 기본 구성 요소를 제공합니다. LangGraph로 구축하는 팀들도 종종 LangChain의 성숙한 구성 요소에 의존합니다. 이 프레임워크는 다음을 제공합니다:</p>
<ul>
<li><p><strong>벡터 스토어 커넥터</strong> - Milvus 및 Zilliz Cloud와 같은 데이터베이스를 위한 통합 인터페이스.</p></li>
<li><p><strong>문서 로더 및 스플리터</strong> - PDF, 웹 페이지 및 기타 콘텐츠용.</p></li>
<li><p><strong>모델 인터페이스</strong> - 인기 있는 LLM을 위한 표준화된 래퍼.</p></li>
</ul>
<p>이를 통해 LangChain은 워크플로우 도구일 뿐만 아니라 대규모 시스템을 위한 안정적인 컴포넌트 라이브러리이기도 합니다.</p>
<h3 id="When-LangGraph-Is-the-Clear-Winner" class="common-anchor-header">LangGraph가 확실한 승자인 경우</h3><h4 id="1-Sophisticated-Agent-Development" class="common-anchor-header">1. 정교한 에이전트 개발</h4><p>LangGraph는 반복, 분기, 적응이 필요한 고급 에이전트 시스템을 구축할 때 탁월한 성능을 발휘합니다. 다음은 단순화된 에이전트 패턴입니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Simplified Agent system example</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">agent</span>(<span class="hljs-params">state</span>):
    messages = state[<span class="hljs-string">&quot;messages&quot;</span>]
    <span class="hljs-comment"># Agent thinks and decides next action</span>
    action = decide_action(messages)
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;action&quot;</span>: action, <span class="hljs-string">&quot;messages&quot;</span>: messages}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">tool_executor</span>(<span class="hljs-params">state</span>):
    <span class="hljs-comment"># Execute tool calls</span>
    action = state[<span class="hljs-string">&quot;action&quot;</span>]
    result = execute_tool(action)
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;result&quot;</span>: result, <span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [result]}

<span class="hljs-comment"># Build Agent graph</span>
graph = StateGraph()
graph.add_node(<span class="hljs-string">&quot;agent&quot;</span>, agent)
graph.add_node(<span class="hljs-string">&quot;tool_executor&quot;</span>, tool_executor)
graph.add_edge(<span class="hljs-string">&quot;agent&quot;</span>, <span class="hljs-string">&quot;tool_executor&quot;</span>)
graph.add_edge(<span class="hljs-string">&quot;tool_executor&quot;</span>, <span class="hljs-string">&quot;agent&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>예시:</strong> GitHub Copilot X의 고급 기능은 LangGraph의 에이전트 아키텍처가 실제로 작동하는 모습을 완벽하게 보여줍니다. 이 시스템은 개발자의 의도를 이해하고, 복잡한 프로그래밍 작업을 관리 가능한 단계로 나누고, 여러 작업을 순차적으로 실행하고, 중간 결과를 통해 학습하고, 그 과정에서 발견한 내용을 기반으로 접근 방식을 조정합니다.</p>
<h4 id="2-Advanced-Multi-Turn-Conversation-Systems" class="common-anchor-header">2. 고급 멀티턴 대화 시스템</h4><p>LangGraph의 상태 관리 기능은 복잡한 멀티턴 대화 시스템을 구축하는 데 매우 적합합니다:</p>
<ul>
<li><p><strong>고객 서비스 시스템</strong>: 대화 이력 추적, 맥락 이해, 일관된 응답 제공 가능</p></li>
<li><p><strong>교육 튜터링 시스템</strong>: 학생의 답변 이력을 기반으로 교수 전략 조정 가능</p></li>
<li><p><strong>면접 시뮬레이션 시스템</strong>: 지원자의 답변에 따라 면접 질문 조정 가능</p></li>
</ul>
<p><strong>예시:</strong> 듀오링고의 AI 튜터링 시스템은 이를 완벽하게 보여줍니다. 이 시스템은 각 학습자의 응답 패턴을 지속적으로 분석하고, 특정 지식 격차를 파악하고, 여러 세션에 걸쳐 학습 진행 상황을 추적하며, 개별 학습 스타일, 속도 선호도 및 난이도에 맞는 개인화된 언어 학습 경험을 제공합니다.</p>
<h4 id="3-Multi-Agent-Collaboration-Ecosystems" class="common-anchor-header">3. 다중 에이전트 협업 생태계</h4><p>LangGraph는 기본적으로 여러 에이전트가 협력하는 에코시스템을 지원합니다. 예를 들면 다음과 같습니다:</p>
<ul>
<li><p><strong>팀 협업 시뮬레이션</strong>: 여러 역할이 협업하여 복잡한 작업을 완료하는 시뮬레이션</p></li>
<li><p><strong>토론 시스템</strong>: 서로 다른 관점을 가진 여러 역할이 토론에 참여하는 시스템</p></li>
<li><p><strong>창의적인 협업 플랫폼</strong>: 서로 다른 전문 영역의 지능형 에이전트가 함께 창작하기</p></li>
</ul>
<p>이러한 접근 방식은 에이전트가 서로 다른 전문 분야를 모델링하고 결과를 결합하여 새로운 인사이트를 도출하는 신약 개발과 같은 연구 분야에서 가능성을 보여주었습니다.</p>
<h3 id="Making-the-Right-Choice-A-Decision-Framework" class="common-anchor-header">올바른 선택: 의사 결정 프레임워크</h3><table>
<thead>
<tr><th><strong>프로젝트 특성</strong></th><th><strong>권장 프레임워크</strong></th><th><strong>왜</strong></th></tr>
</thead>
<tbody>
<tr><td>간단한 일회성 작업</td><td>LangChain</td><td>LCEL 오케스트레이션은 간단하고 직관적입니다.</td></tr>
<tr><td>텍스트 번역/최적화</td><td>LangChain</td><td>복잡한 상태 관리 필요 없음</td></tr>
<tr><td>에이전트 시스템</td><td>LangGraph</td><td>강력한 상태 관리 및 제어 흐름</td></tr>
<tr><td>멀티턴 대화 시스템</td><td>LangGraph</td><td>상태 추적 및 컨텍스트 관리</td></tr>
<tr><td>멀티 에이전트 협업</td><td>LangGraph</td><td>멀티 노드 상호작용을 위한 기본 지원</td></tr>
<tr><td>툴 사용이 필요한 시스템</td><td>LangGraph</td><td>유연한 도구 호출 흐름 제어</td></tr>
</tbody>
</table>
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
    </button></h2><p>대부분의 경우, LangChain과 LangGraph는 경쟁자가 아닌 상호 보완적인 관계입니다. LangChain은 빠른 프로토타입, 상태 저장소 없는 작업 또는 깔끔한 입출력 흐름이 필요한 프로젝트에 적합한 구성 요소와 LCEL 오케스트레이션의 탄탄한 기반을 제공합니다. 애플리케이션이 선형 모델을 넘어 상태, 분기 또는 여러 에이전트가 함께 작동해야 하는 경우 LangGraph가 개입합니다.</p>
<ul>
<li><p>텍스트 번역, 문서 처리 또는 데이터 변환과 같이 각 요청이 독립적으로 존재하는 간단한 작업에 중점을 두는 경우<strong>LangChain을 선택하세요</strong>.</p></li>
<li><p>컨텍스트와 의사 결정이 중요한 멀티턴 대화, 상담원 시스템 또는 협업 상담원 생태계를 구축하는 경우<strong>LangGraph를 선택하세요</strong>.</p></li>
<li><p>최상의 결과를 위해<strong>두 가지를 혼합하세요</strong>. 많은 프로덕션 시스템은 LangChain의 구성 요소(문서 로더, 벡터 스토어 커넥터, 모델 인터페이스)로 시작한 다음, 그 위에 상태 저장, 그래프 기반 로직을 관리하기 위해 LangGraph를 추가합니다.</p></li>
</ul>
<p>궁극적으로는 트렌드를 쫓기보다는 프레임워크를 프로젝트의 진정한 요구사항에 맞추는 것이 더 중요합니다. 두 생태계 모두 활발한 커뮤니티와 탄탄한 문서화를 바탕으로 빠르게 진화하고 있습니다. 각각이 어디에 적합한지 이해하면 Milvus로 첫 RAG 파이프라인을 구축하든 복잡한 멀티 에이전트 시스템을 조율하든 확장 가능한 애플리케이션을 더 잘 설계할 수 있습니다.</p>
