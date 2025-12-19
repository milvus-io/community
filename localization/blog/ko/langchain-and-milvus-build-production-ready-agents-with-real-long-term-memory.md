---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: 'LangChain 1.0과 Milvus: 실제 장기 메모리로 생산 준비가 완료된 에이전트를 구축하는 방법'
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  LangChain 1.0이 에이전트 아키텍처를 간소화하는 방법과 Milvus가 확장 가능한 프로덕션 지원 AI 애플리케이션을 위해 장기
  메모리를 추가하는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain은 대규모 언어 모델(LLM)로 구동되는 애플리케이션을 개발하는 데 널리 사용되는 오픈 소스 프레임워크입니다. 추론 및 도구 사용 에이전트를 구축하고, 모델을 외부 데이터에 연결하고, 상호 작용 흐름을 관리하기 위한 모듈식 툴킷을 제공합니다.</p>
<p><strong>LangChain 1.0의</strong> 출시와 함께, 이 프레임워크는 보다 프로덕션 친화적인 아키텍처를 향해 한 걸음 더 나아갑니다. 새 버전은 이전의 체인 기반 설계를 표준화된 ReAct 루프(추론 → 도구 호출 → 관찰 → 결정)로 대체하고 실행, 제어 및 안전 관리를 위한 미들웨어를 도입했습니다.</p>
<p>하지만 추론만으로는 충분하지 않습니다. 에이전트는 정보를 저장하고, 불러오고, 재사용할 수 있는 기능도 필요합니다. 바로 이 부분에서 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus가</strong></a> 중요한 역할을 할 수 있습니다. Milvus는 확장 가능한 고성능 메모리 계층을 제공하여 상담원이 의미적 유사성을 통해 정보를 효율적으로 저장, 검색 및 검색할 수 있도록 지원합니다.</p>
<p>이 포스팅에서는 LangChain 1.0이 에이전트 아키텍처를 업데이트하는 방법과 Milvus를 통합하여 에이전트가 추론을 넘어 실제 사용 사례를 위한 지속적이고 지능적인 메모리를 구현하는 데 어떻게 도움이 되는지 살펴볼 것입니다.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">체인 기반 설계가 부족한 이유<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>초기(버전 0.x)에 LangChain의 아키텍처는 체인을 중심으로 설계되었습니다. 각 체인은 고정된 시퀀스를 정의했고, LLM 오케스트레이션을 간단하고 빠르게 만드는 사전 빌드된 템플릿이 함께 제공되었습니다. 이러한 설계는 프로토타입을 빠르게 구축하는 데 매우 유용했습니다. 하지만 LLM 생태계가 발전하고 실제 사용 사례가 복잡해지면서 이 아키텍처에 균열이 생기기 시작했습니다.</p>
<p><strong>1. 유연성 부족</strong></p>
<p>초기 버전의 LangChain은 각각 고정된 선형적 흐름(생성 → 모델 호출 → 출력 처리)을 따르는 SimpleSequentialChain 또는 LLMChain과 같은 모듈식 파이프라인을 제공했습니다. 이 설계는 간단하고 예측 가능한 작업에 적합했으며 프로토타입을 빠르게 제작하기 쉬웠습니다.</p>
<p>하지만 애플리케이션이 더욱 역동적으로 성장함에 따라 이러한 경직된 템플릿은 제한적으로 느껴지기 시작했습니다. 비즈니스 로직이 더 이상 사전 정의된 순서에 깔끔하게 들어맞지 않으면 로직을 프레임워크에 강제로 맞추거나 LLM API를 직접 호출하여 완전히 우회하는 두 가지 불만족스러운 옵션이 남게 됩니다.</p>
<p><strong>2. 프로덕션 수준의 제어 부족</strong></p>
<p>데모에서는 잘 작동하던 것이 프로덕션에서는 종종 문제가 발생했습니다. 체인에는 대규모, 지속적 또는 민감한 애플리케이션에 필요한 안전장치가 포함되어 있지 않았습니다. 일반적인 문제는 다음과 같습니다:</p>
<ul>
<li><p><strong>컨텍스트 오버플로:</strong> 긴 대화는 토큰 한도를 초과하여 충돌이나 자동 잘림을 일으킬 수 있습니다.</p></li>
<li><p><strong>민감한 데이터 유출:</strong> 이메일이나 ID와 같은 개인 식별 정보가 실수로 타사 모델에 전송될 수 있습니다.</p></li>
<li><p><strong>감독되지 않은 작업:</strong> 상담원이 사용자의 승인 없이 데이터를 삭제하거나 이메일을 보낼 수 있습니다.</p></li>
</ul>
<p><strong>3. 모델 간 호환성 부족</strong></p>
<p>OpenAI, Anthropic, 그리고 많은 중국 모델 등 각 LLM 제공업체는 추론 및 도구 호출을 위한 자체 프로토콜을 구현합니다. 공급업체를 바꿀 때마다 프롬프트 템플릿, 어댑터, 응답 파서 등 통합 계층을 다시 작성해야 했습니다. 이러한 반복적인 작업은 개발 속도를 늦추고 실험을 고통스럽게 만들었습니다.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0: 올인 리액트 에이전트<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain 팀이 수백 개의 프로덕션 등급 에이전트 구현을 분석했을 때, 한 가지 인사이트가 눈에 띄었습니다. 거의 모든 성공적인 에이전트가 <strong>ReAct("추론 + 행동") 패턴으로</strong> 자연스럽게 수렴한다는 것이었습니다.</p>
<p>다중 에이전트 시스템에서든 심층 추론을 수행하는 단일 에이전트에서든, 목표 도구 호출을 통해 간단한 추론 단계를 번갈아 수행한 다음 에이전트가 최종 답변을 제공할 수 있을 때까지 관찰 결과를 후속 결정에 반영하는 동일한 제어 루프가 등장합니다.</p>
<p>이 입증된 구조를 기반으로 LangChain 1.0은 ReAct 루프를 아키텍처의 핵심에 배치하여 안정적이고 해석 가능하며 프로덕션 준비가 완료된 에이전트를 구축하기 위한 기본 구조로 삼았습니다.</p>
<p>간단한 에이전트부터 복잡한 오케스트레이션까지 모든 것을 지원하기 위해 LangChain 1.0은 사용 편의성과 정밀한 제어를 결합한 계층화된 디자인을 채택했습니다:</p>
<ul>
<li><p><strong>표준 시나리오:</strong> 추론과 도구 호출을 바로 처리하는 깔끔하고 표준화된 ReAct 루프인 create_agent() 함수로 시작하세요.</p></li>
<li><p><strong>확장 시나리오:</strong> 미들웨어를 추가하여 세밀하게 제어하세요. 미들웨어를 사용하면 에이전트 내부에서 일어나는 일을 검사하거나 수정할 수 있습니다(예: PII 탐지, 사람 승인 체크포인트, 자동 재시도 또는 모니터링 후크 추가).</p></li>
<li><p><strong>복잡한 시나리오:</strong> 상태 저장 워크플로 또는 다중 에이전트 오케스트레이션의 경우 로직 흐름, 종속성 및 실행 상태를 정밀하게 제어할 수 있는 그래프 기반 실행 엔진인 LangGraph를 사용하세요.</p></li>
</ul>
<p>이제 에이전트 개발을 더 간단하고 안전하며 일관성 있게 만드는 세 가지 핵심 구성 요소를 모델 전반에서 자세히 살펴보겠습니다.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. create_agent(): 에이전트를 구축하는 더 간단한 방법</h3><p>LangChain 1.0의 주요 혁신은 에이전트 구축의 복잡성을 create_agent() 단일 함수로 줄인 것입니다. 더 이상 상태 관리, 오류 처리 또는 스트리밍 출력을 수동으로 처리할 필요가 없습니다. 이러한 프로덕션 수준의 기능은 이제 그 아래에 있는 LangGraph 런타임에 의해 자동으로 관리됩니다.</p>
<p>단 세 가지 매개변수만으로 모든 기능을 갖춘 에이전트를 시작할 수 있습니다:</p>
<ul>
<li><p><strong>model</strong> - 모델 식별자(문자열) 또는 인스턴스화된 모델 객체.</p></li>
<li><p><strong>tools</strong> - 에이전트에 기능을 부여하는 함수 목록입니다.</p></li>
<li><p><strong>system_prompt</strong> - 상담원의 역할, 어조 및 행동을 정의하는 명령어입니다.</p></li>
</ul>
<p>내부적으로 create_agent()는 표준 에이전트 루프에서 실행되며, 모델을 호출하고 실행할 도구를 선택하게 한 다음 더 이상 도구가 필요하지 않으면 완료됩니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>또한 상태 지속성, 중단 복구 및 스트리밍을 위한 LangGraph의 기본 제공 기능도 상속받습니다. 수백 줄의 오케스트레이션 코드가 필요했던 작업이 이제 하나의 선언적 API를 통해 처리됩니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. 미들웨어: 프로덕션-레디 제어를 위한 컴포저블 레이어</h3><p>미들웨어는 LangChain을 프로토타입에서 프로덕션으로 가져가는 핵심 다리입니다. 에이전트의 실행 루프에서 전략적 지점에 후크를 노출하여 핵심 ReAct 프로세스를 다시 작성하지 않고도 사용자 정의 로직을 추가할 수 있습니다.</p>
<p>에이전트의 메인 루프는 모델 → 도구 → 종료의 3단계 의사 결정 프로세스를 따릅니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0은 일반적인 패턴을 위해 <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">미리 빌드된</a> 몇 가지 <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">미들웨어를</a> 제공합니다. 다음은 네 가지 예시입니다.</p>
<ul>
<li><strong>PII 탐지: 민감한 사용자 데이터를 처리하는 모든 애플리케이션</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>요약: 토큰 한도에 근접할 때 대화 기록을 자동으로 요약합니다.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>도구 재시도: 구성 가능한 지수 백오프를 통해 실패한 도구 호출을 자동으로 재시도합니다.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>사용자 지정 미들웨어</strong></li>
</ul>
<p>공식적으로 미리 빌드된 미들웨어 옵션 외에도 데코레이터 기반 또는 클래스 기반 방식으로 사용자 지정 미들웨어를 만들 수도 있습니다.</p>
<p>예를 들어 아래 스니펫은 실행 전에 모델 호출을 로깅하는 방법을 보여줍니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. 구조화된 출력: 데이터를 처리하는 표준화된 방법</h3><p>기존 에이전트 개발에서 구조화된 출력은 항상 관리하기 어려웠습니다. 예를 들어 OpenAI는 기본 구조화된 출력 API를 제공하는 반면, 다른 모델 제공업체는 도구 호출을 통해 간접적으로만 구조화된 응답을 지원하는 등 각 모델 제공업체마다 처리 방식이 달랐기 때문입니다. 이는 종종 각 공급자에 대해 사용자 정의 어댑터를 작성해야 한다는 것을 의미하며, 추가 작업이 추가되고 유지 관리가 필요 이상으로 힘들어집니다.</p>
<p>LangChain 1.0에서는 구조화된 출력이 create_agent()의 response_format 매개변수를 통해 직접 처리됩니다.  데이터 스키마를 한 번만 정의하면 됩니다. LangChain은 사용 중인 모델에 따라 최적의 시행 전략을 자동으로 선택하므로 추가 설정이나 공급업체별 코드가 필요하지 않습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChain은 구조화된 출력을 위해 두 가지 전략을 지원합니다:</p>
<p><strong>1. 공급자 전략:</strong> 일부 모델 공급자는 API를 통해 구조화된 출력을 기본적으로 지원합니다(예: OpenAI 및 Grok). 이러한 지원이 가능한 경우, LangChain은 공급자의 내장된 스키마 적용을 직접 사용합니다. 이 접근 방식은 모델 자체가 출력 형식을 보장하기 때문에 가장 높은 수준의 안정성과 일관성을 제공합니다.</p>
<p><strong>2. 도구 호출 전략:</strong> 기본 구조화된 출력을 지원하지 않는 모델의 경우, LangChain은 동일한 결과를 얻기 위해 도구 호출을 사용합니다.</p>
<p>프레임워크가 모델의 기능을 감지하여 자동으로 조정하므로 어떤 전략이 사용되는지 걱정할 필요가 없습니다. 이러한 추상화를 통해 비즈니스 로직을 변경하지 않고도 다양한 모델 제공자 간에 자유롭게 전환할 수 있습니다.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Milvus가 에이전트 메모리를 향상시키는 방법<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>프로덕션 등급 에이전트의 경우, 실제 성능 병목 현상은 추론 엔진이 아니라 메모리 시스템인 경우가 많습니다. LangChain 1.0에서는 벡터 데이터베이스가 에이전트의 외부 메모리 역할을 하여 시맨틱 검색을 통해 장기적인 리콜을 제공합니다.</p>
<p><a href="https://milvus.io/">Milvus는</a> 현재 사용 가능한 가장 성숙한 오픈 소스 벡터 데이터베이스 중 하나로, AI 애플리케이션에서 대규모 벡터 검색을 위해 특별히 구축되었습니다. 기본적으로 LangChain과 통합되므로 벡터화, 인덱스 관리 또는 유사도 검색을 수동으로 처리할 필요가 없습니다. langchain_milvus 패키지는 Milvus를 표준 VectorStore 인터페이스로 래핑하여 몇 줄의 코드만으로 에이전트에 연결할 수 있게 해줍니다.</p>
<p>이렇게 함으로써 Milvus는 확장 가능하고 안정적인 에이전트 메모리 시스템을 구축하는 데 있어 세 가지 주요 과제를 해결합니다:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. 대규모 지식 기반에서 빠르게 검색</strong></h4><p>상담원이 수천 개의 문서, 과거 대화 또는 제품 매뉴얼을 처리해야 하는 경우 단순한 키워드 검색만으로는 충분하지 않습니다. Milvus는 벡터 유사성 검색을 사용하여 쿼리에 다른 문구가 사용되더라도 의미적으로 관련성이 높은 정보를 밀리초 내에 찾아냅니다. 이를 통해 상담원은 정확한 텍스트 일치뿐만 아니라 의미에 기반한 지식을 기억할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. 지속적인 장기 기억</strong></h4><p>LangChain의 요약 미들웨어는 대화 기록이 너무 길어지면 압축할 수 있지만, 요약된 모든 세부 정보는 어떻게 될까요? 밀버스는 이를 보관합니다. 모든 대화, 도구 호출, 추론 단계를 벡터화하여 장기적으로 참조할 수 있도록 저장할 수 있습니다. 필요할 때 상담원은 시맨틱 검색을 통해 관련 기억을 빠르게 검색할 수 있으므로 세션 전반에서 진정한 연속성을 유지할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. 멀티모달 콘텐츠의 통합 관리</strong></h4><p>최신 에이전트는 텍스트뿐만 아니라 이미지, 오디오, 비디오와도 상호 작용합니다. Milvus는 멀티 벡터 스토리지와 동적 스키마를 지원하므로 단일 시스템에서 여러 모달리티의 임베딩을 관리할 수 있습니다. 이는 멀티모달 에이전트를 위한 통합 메모리 기반을 제공하여 다양한 유형의 데이터에서 일관된 검색을 가능하게 합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain과 LangGraph 비교: 에이전트에 적합한 것을 선택하는 방법<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain 1.0으로 업그레이드하는 것은 프로덕션급 에이전트를 구축하기 위한 필수 단계이지만, 그렇다고 해서 모든 사용 사례에 대해 항상 유일하거나 최선의 선택이라는 의미는 아닙니다. 올바른 프레임워크를 선택하는 것은 이러한 기능을 얼마나 빨리 작동하고 유지보수가 가능한 시스템으로 결합할 수 있는지에 따라 결정됩니다.</p>
<p>실제로 LangChain 1.0과 LangGraph 1.0은 서로를 대체하는 것이 아니라 함께 작동하도록 설계된 동일한 계층형 스택의 일부로 볼 수 있습니다: LangChain은 표준 에이전트를 빠르게 구축하는 데 도움을 주며, LangGraph는 복잡한 워크플로우를 세밀하게 제어할 수 있도록 지원합니다. 즉, LangChain은 빠르게 움직일 수 있도록 도와주며, LangGraph는 심층적으로 작업할 수 있도록 도와줍니다.</p>
<p>아래는 기술적 포지셔닝에서 두 제품이 어떻게 다른지 간략하게 비교한 것입니다:</p>
<table>
<thead>
<tr><th><strong>차원</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>추상화 수준</strong></td><td>표준 에이전트 시나리오를 위해 설계된 높은 수준의 추상화</td><td>복잡한 워크플로우를 위해 설계된 로우레벨 오케스트레이션 프레임워크</td></tr>
<tr><td><strong>핵심 기능</strong></td><td>표준 ReAct 루프(이유 → 도구 호출 → 관찰 → 응답)</td><td>사용자 지정 상태 머신 및 복잡한 분기 로직(StateGraph + 조건부 라우팅)</td></tr>
<tr><td><strong>확장 메커니즘</strong></td><td>프로덕션급 기능을 위한 미들웨어</td><td>노드, 엣지, 상태 전환의 수동 관리</td></tr>
<tr><td><strong>기본 구현</strong></td><td>노드, 엣지, 상태 전환의 수동 관리</td><td>지속성 및 복구 기능이 내장된 네이티브 런타임</td></tr>
<tr><td><strong>일반적인 사용 사례</strong></td><td>표준 에이전트 시나리오의 80%</td><td>멀티 에이전트 협업 및 장기적인 워크플로우 오케스트레이션</td></tr>
<tr><td><strong>학습 곡선</strong></td><td>최대 10줄의 코드로 에이전트 구축</td><td>상태 그래프 및 노드 오케스트레이션에 대한 이해가 필요합니다.</td></tr>
</tbody>
</table>
<p>에이전트 구축이 처음이거나 프로젝트를 빠르게 시작하고 실행하고 싶다면 LangChain으로 시작하세요. 사용 사례에 복잡한 오케스트레이션, 멀티에이전트 협업 또는 장기적인 워크플로가 필요하다는 것을 이미 알고 있다면 LangGraph로 바로 이동하세요.</p>
<p>두 프레임워크는 동일한 프로젝트에서 공존할 수 있습니다. LangChain으로 간단하게 시작하고 시스템에 더 많은 제어와 유연성이 필요할 때 LangGraph를 도입할 수 있습니다. 핵심은 워크플로우의 각 부분에 적합한 도구를 선택하는 것입니다.</p>
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
    </button></h2><p>3년 전, LangChain은 LLM을 호출하기 위한 경량 래퍼로 시작되었습니다. 현재는 완전한 프로덕션급 프레임워크로 성장했습니다.</p>
<p>핵심적으로 미들웨어 레이어는 안전, 규정 준수, 통합 가시성을 제공합니다. LangGraph는 지속적 실행, 제어 흐름, 상태 관리 기능을 추가합니다. 그리고 메모리 계층에서는 <a href="https://milvus.io/">Milvus가</a> 중요한 격차를 메워 에이전트가 컨텍스트를 검색하고, 기록을 통해 추론하고, 시간이 지남에 따라 개선할 수 있는 확장 가능하고 안정적인 장기 메모리를 제공합니다.</p>
<p>LangChain, LangGraph, Milvus는 함께 현대 에이전트 시대를 위한 실용적인 툴체인을 형성하여 안정성이나 성능의 저하 없이 신속한 프로토타이핑과 엔터프라이즈급 배포를 연결합니다.</p>
<p>상담원에게 안정적이고 장기적인 메모리를 제공할 준비가 되셨나요? <a href="https://milvus.io">Milvus를</a> 살펴보고 프로덕션 환경에서 LangChain 에이전트를 위한 지능형 장기 메모리를 어떻게 지원하는지 알아보세요.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요? <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에</a> 참여하거나 <a href="https://github.com/milvus-io/milvus">GitHub에</a> 이슈를 제출하세요. 또한 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내, 질문에 대한 답변을 얻을 수도 있습니다.</p>
