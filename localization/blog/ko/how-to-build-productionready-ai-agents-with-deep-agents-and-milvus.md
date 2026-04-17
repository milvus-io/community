---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: 딥 에이전트 및 Milvus로 프로덕션 준비된 AI 에이전트를 구축하는 방법
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  장기 실행 작업, 토큰 비용 절감, 영구적인 메모리를 위해 딥 에이전트와 Milvus를 사용하여 확장 가능한 AI 에이전트를 구축하는 방법을
  알아보세요.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>점점 더 많은 팀이 AI 에이전트를 구축하고 있으며, AI 에이전트에게 할당하는 작업은 점점 더 복잡해지고 있습니다. 실제 워크플로에는 여러 단계와 많은 도구 호출이 포함된 장기 실행 작업이 많습니다. 이러한 작업이 증가함에 따라 토큰 비용 증가와 모델 컨텍스트 창의 한계라는 두 가지 문제가 빠르게 나타납니다. 또한 상담원은 과거 조사 결과, 사용자 선호도, 이전 대화 등 세션 전반에 걸친 정보를 기억해야 하는 경우가 많습니다.</p>
<p>LangChain에서 출시한 <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>딥 에이전트와</strong></a> 같은 프레임워크는 이러한 워크플로를 구성하는 데 도움이 됩니다. 작업 계획, 파일 액세스, 하위 에이전트 위임 등을 지원하여 에이전트를 체계적으로 실행할 수 있는 방법을 제공합니다. 이를 통해 긴 다단계 작업을 보다 안정적으로 처리할 수 있는 에이전트를 보다 쉽게 구축할 수 있습니다.</p>
<p>하지만 워크플로우만으로는 충분하지 않습니다. 상담원은 이전 세션에서 유용한 정보를 검색할 수 있도록 <strong>장기적인 메모리도</strong> 필요합니다. 이때 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus가</strong></a> 유용합니다. 대화, 문서 및 도구 결과의 임베딩을 저장함으로써 Milvus는 상담원이 과거 지식을 검색하고 기억할 수 있도록 해줍니다.</p>
<p>이 문서에서는 딥 에이전트의 작동 원리를 설명하고 이를 Milvus와 결합하여 구조화된 워크플로우와 장기 기억력을 갖춘 AI 에이전트를 구축하는 방법을 보여드립니다.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">딥 에이전트란 무엇인가요?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>딥 에이전트는</strong> LangChain 팀이 구축한 오픈 소스 에이전트 프레임워크입니다. 에이전트가 장기간 실행되는 다단계 작업을 보다 안정적으로 처리할 수 있도록 설계되었습니다. 세 가지 주요 기능에 중점을 두고 있습니다:</p>
<p><strong>1. 작업 계획</strong></p>
<p>딥 에이전트에는 <code translate="no">write_todos</code> 및 <code translate="no">read_todos</code> 과 같은 기본 제공 도구가 포함되어 있습니다. 상담원이 복잡한 작업을 명확한 할 일 목록으로 나눈 다음 각 항목을 단계별로 작업하여 작업을 완료로 표시합니다.</p>
<p><strong>2. 파일 시스템 액세스</strong></p>
<p><code translate="no">ls</code>, <code translate="no">read_file</code>, <code translate="no">write_file</code> 와 같은 도구를 제공하여 상담원이 파일을 보고, 읽고, 쓸 수 있습니다. 도구가 대용량 출력을 생성하는 경우 결과는 모델의 컨텍스트 창에 머무르지 않고 자동으로 파일에 저장됩니다. 이렇게 하면 컨텍스트 창이 가득 차는 것을 방지할 수 있습니다.</p>
<p><strong>3. 하위 에이전트 위임</strong></p>
<p><code translate="no">task</code> 도구를 사용하여 메인 에이전트는 전문화된 하위 에이전트에게 하위 작업을 위임할 수 있습니다. 각 하위 상담원에게는 고유한 컨텍스트 창과 도구가 있어 작업을 체계적으로 관리할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>엄밀히 말하면 <code translate="no">create_deep_agent</code> 으로 생성된 에이전트는 컴파일된 <strong>LangGraph StateGraph입니다</strong>. (LangGraph는 LangChain 팀에서 개발한 워크플로 라이브러리이며, StateGraph는 그 핵심 상태 구조입니다.). 따라서 딥 에이전트는 스트리밍 출력, 체크포인트, 휴먼 인 더 루프 상호 작용과 같은 LangGraph 기능을 직접 사용할 수 있습니다.</p>
<p><strong>그렇다면 딥 에이전트가 실제로 유용한 이유는 무엇일까요?</strong></p>
<p>장기간 실행되는 에이전트 작업은 컨텍스트 제한, 높은 토큰 비용, 불안정한 실행과 같은 문제에 직면하는 경우가 많습니다. 딥 에이전트는 상담원 워크플로를 보다 체계적이고 관리하기 쉽게 만들어 이러한 문제를 해결하는 데 도움이 됩니다. 불필요한 컨텍스트 증가를 줄임으로써 토큰 사용량을 낮추고 장기 실행 작업을 보다 비용 효율적으로 유지합니다.</p>
<p>또한 복잡한 다단계 작업을 더 쉽게 구성할 수 있습니다. 하위 작업은 서로 간섭하지 않고 독립적으로 실행할 수 있어 안정성이 향상됩니다. 동시에 이 시스템은 유연하기 때문에 개발자는 에이전트가 간단한 실험에서 프로덕션 애플리케이션으로 성장함에 따라 시스템을 사용자 지정하고 확장할 수 있습니다.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">딥 에이전트의 커스터마이징<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>일반적인 프레임워크는 모든 산업이나 비즈니스 요구 사항을 충족할 수 없습니다. 딥 에이전트는 유연하게 설계되었기 때문에 개발자가 자신의 사용 사례에 맞게 조정할 수 있습니다.</p>
<p>사용자 지정으로 가능합니다:</p>
<ul>
<li><p>자체 내부 도구 및 API 연결</p></li>
<li><p>도메인별 워크플로 정의</p></li>
<li><p>상담원이 비즈니스 규칙을 따르도록 보장</p></li>
<li><p>세션 전반에서 메모리 및 지식 공유 지원</p></li>
</ul>
<p>다음은 딥 에이전트를 사용자 지정할 수 있는 주요 방법입니다:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">시스템 프롬프트 사용자 지정</h3><p>미들웨어에서 제공하는 기본 안내에 자신만의 시스템 프롬프트를 추가할 수 있습니다. 이는 도메인 규칙 및 워크플로우를 정의하는 데 유용합니다.</p>
<p>좋은 사용자 지정 프롬프트에는 다음이 포함될 수 있습니다:</p>
<ul>
<li><strong>도메인 워크플로우 규칙</strong></li>
</ul>
<p>예: "데이터 분석 작업의 경우 모델을 구축하기 전에 항상 탐색 분석을 실행하세요."</p>
<ul>
<li><strong>구체적인 예</strong></li>
</ul>
<p>예: "유사한 문헌 검색 요청을 하나의 할 일 항목으로 결합하세요."</p>
<ul>
<li><strong>중지 규칙</strong></li>
</ul>
<p>예: "100개 이상의 도구 호출이 사용되면 중지하세요."</p>
<ul>
<li><strong>도구 조정 지침</strong></li>
</ul>
<p>예: " <code translate="no">grep</code> 을 사용하여 코드 위치를 찾은 다음 <code translate="no">read_file</code> 을 사용하여 세부 정보를 확인하세요."</p>
<p>미들웨어가 이미 처리하는 지침을 반복하지 않도록 하고 기본 동작과 충돌하는 규칙을 추가하지 마세요.</p>
<h3 id="Tools" class="common-anchor-header">도구</h3><p>기본 제공 도구 집합에 자신만의 도구를 추가할 수 있습니다. 도구는 일반 Python 함수로 정의되며, 해당 도구의 독스트링은 도구가 수행하는 작업을 설명합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>딥 에이전트는 <code translate="no">langchain-mcp-adapters</code> 을 통해 모델 컨텍스트 프로토콜(MCP) 표준을 따르는 도구도 지원합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">미들웨어</h3><p>사용자 지정 미들웨어를 작성할 수 있습니다:</p>
<ul>
<li><p>도구 추가 또는 수정</p></li>
<li><p>프롬프트 조정</p></li>
<li><p>에이전트 실행의 여러 단계에 연결하기</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>딥 에이전트에는 계획, 하위 에이전트 관리 및 실행 제어를 위한 기본 제공 미들웨어도 포함되어 있습니다.</p>
<table>
<thead>
<tr><th>미들웨어</th><th>기능</th></tr>
</thead>
<tbody>
<tr><td>TodoList미들웨어</td><td>작업 목록을 관리하기 위한 쓰기_todos 및 읽기_todos 도구를 제공합니다.</td></tr>
<tr><td>파일 시스템 미들웨어</td><td>파일 작업 도구를 제공하고 대용량 도구 출력을 자동으로 저장합니다.</td></tr>
<tr><td>서브에이전트미들웨어</td><td>하위 에이전트에 작업을 위임할 수 있는 작업 도구를 제공합니다.</td></tr>
<tr><td>요약 미들웨어</td><td>컨텍스트가 17만 토큰을 초과하면 자동으로 요약합니다.</td></tr>
<tr><td>AnthropicPromptCachingMiddleware</td><td>앤트로픽 모델에 프롬프트 캐싱을 활성화합니다.</td></tr>
<tr><td>패치툴콜미들웨어</td><td>중단으로 인한 불완전한 툴 호출 수정</td></tr>
<tr><td>휴먼인더루프미들웨어</td><td>사람의 승인이 필요한 툴을 구성합니다.</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">서브 에이전트</h3><p>메인 에이전트는 <code translate="no">task</code> 도구를 사용하여 하위 에이전트에게 하위 작업을 위임할 수 있습니다. 각 하위 에이전트는 자체 컨텍스트 창에서 실행되며 자체 도구와 시스템 프롬프트가 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>고급 사용 사례의 경우, 미리 구축된 LangGraph 워크플로를 하위 에이전트로 전달할 수도 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (사람 승인 제어)</h3><p><code translate="no">interrupt_on</code> 매개변수를 사용하여 사람의 승인이 필요한 특정 도구를 지정할 수 있습니다. 에이전트가 이러한 도구 중 하나를 호출하면 사람이 검토하고 승인할 때까지 실행이 일시 중지됩니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">백엔드 사용자 지정(스토리지)</h3><p>다양한 스토리지 백엔드를 선택하여 파일 처리 방식을 제어할 수 있습니다. 현재 옵션은 다음과 같습니다:</p>
<ul>
<li><p><strong>StateBackend</strong> (임시 저장소)</p></li>
<li><p><strong>파일시스템백엔드</strong> (로컬 디스크 스토리지)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>백엔드를 변경하면 전체 시스템 설계를 변경하지 않고도 파일 저장 동작을 조정할 수 있습니다.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">AI 에이전트를 위해 Milvus와 함께 딥 에이전트를 사용해야 하는 이유는 무엇인가요?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>실제 애플리케이션에서 에이전트는 여러 세션에 걸쳐 지속되는 메모리가 필요한 경우가 많습니다. 예를 들어 사용자 선호도를 기억하거나, 시간이 지남에 따라 도메인 지식을 쌓거나, 행동을 조정하기 위한 피드백을 기록하거나, 장기적인 연구 작업을 추적해야 할 수 있습니다.</p>
<p>기본적으로 딥 에이전트는 단일 세션 동안에만 데이터를 저장하는 <code translate="no">StateBackend</code> 을 사용합니다. 세션이 종료되면 모든 데이터가 지워집니다. 즉, 장기적인 세션 간 메모리를 지원할 수 없습니다.</p>
<p>영구 메모리를 지원하기 위해 <a href="https://milvus.io/"><strong>Milvus를</strong></a> <code translate="no">StoreBackend</code> 와 함께 벡터 데이터베이스로 사용합니다. 작동 방식은 다음과 같습니다. 중요한 대화 콘텐츠와 도구 결과는 임베딩(의미를 나타내는 숫자 벡터)으로 변환되어 Milvus에 저장됩니다. 새 작업이 시작되면 에이전트는 시맨틱 검색을 수행하여 관련된 과거의 기억을 검색합니다. 이를 통해 에이전트는 이전 세션의 관련 정보를 '기억'할 수 있습니다.</p>
<p>Milvus는 컴퓨팅-저장소 분리 아키텍처로 인해 이 사용 사례에 매우 적합합니다. 다음을 지원합니다:</p>
<ul>
<li><p>수백억 개의 벡터로 수평 확장 가능</p></li>
<li><p>높은 동시성 쿼리</p></li>
<li><p>실시간 데이터 업데이트</p></li>
<li><p>대규모 시스템을 위한 프로덕션 지원 배포</p></li>
</ul>
<p>기술적으로 Deep Agents는 <code translate="no">CompositeBackend</code> 을 사용하여 서로 다른 스토리지 백엔드로 서로 다른 경로를 라우팅합니다:</p>
<table>
<thead>
<tr><th>경로</th><th>백엔드</th><th>목적</th></tr>
</thead>
<tbody>
<tr><td>/작업 공간/, /템포/</td><td>상태 백엔드</td><td>세션 종료 후 지워지는 임시 데이터</td></tr>
<tr><td>/메모리즈/, /지식/</td><td>스토어백엔드 + 밀버스</td><td>영구 데이터, 여러 세션에서 검색 가능</td></tr>
</tbody>
</table>
<p>이 설정을 사용하면 개발자는 <code translate="no">/memories/</code> 와 같은 경로에 장기 데이터만 저장하면 됩니다. 시스템이 자동으로 세션 간 메모리를 처리합니다. 자세한 구성 단계는 아래 섹션에 나와 있습니다.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">실습: Milvus와 딥 에이전트를 사용하여 장기 메모리를 갖춘 AI 에이전트 구축하기<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>이 예에서는 Milvus를 사용하여 딥에이전트 기반 에이전트에 영구 메모리를 제공하는 방법을 보여줍니다.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">1단계: 종속성 설치</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">2단계: 메모리 백엔드 설정</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">3단계: 에이전트 만들기</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>핵심 사항</strong></p>
<ul>
<li><strong>영구 경로</strong></li>
</ul>
<p><code translate="no">/memories/</code> 에 저장된 모든 파일은 영구적으로 저장되며 여러 세션에서 액세스할 수 있습니다.</p>
<ul>
<li><strong>프로덕션 설정</strong></li>
</ul>
<p>이 예에서는 테스트용으로 <code translate="no">InMemoryStore()</code> 을 사용합니다. 프로덕션 환경에서는 확장 가능한 시맨틱 검색을 사용하려면 Milvus 어댑터로 교체하세요.</p>
<ul>
<li><strong>자동 메모리</strong></li>
</ul>
<p>에이전트는 연구 결과와 중요한 결과물을 <code translate="no">/memories/</code> 폴더에 자동으로 저장합니다. 이후 작업에서 관련 과거 정보를 검색하고 검색할 수 있습니다.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">기본 제공 도구 개요<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>딥 에이전트에는 미들웨어를 통해 제공되는 몇 가지 기본 제공 도구가 포함되어 있습니다. 이 도구들은 크게 세 가지 그룹으로 나뉩니다:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">작업 관리(<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>구조화된 할 일 목록을 만듭니다. 각 작업에는 설명, 우선순위 및 종속성이 포함될 수 있습니다.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>완료된 작업과 보류 중인 작업을 포함한 현재 할 일 목록을 표시합니다.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">파일 시스템 도구 (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>디렉터리에 있는 파일을 나열합니다. 절대 경로( <code translate="no">/</code> 로 시작)를 사용해야 합니다.</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>파일 콘텐츠를 읽습니다. 대용량 파일의 경우 <code translate="no">offset</code> 및 <code translate="no">limit</code> 을 지원합니다.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>파일을 생성하거나 덮어씁니다.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>파일 내부의 특정 텍스트를 바꿉니다.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p><code translate="no">**/*.py</code> 같은 패턴을 사용하여 파일을 찾습니다(예: 모든 Python 파일 검색).</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>파일 내부의 텍스트를 검색합니다.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>샌드박스 환경에서 셸 명령을 실행합니다. 백엔드에서 <code translate="no">SandboxBackendProtocol</code> 을 지원해야 합니다.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">하위 에이전트 위임 (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>특정 하위 에이전트에게 하위 작업을 보냅니다. 하위 에이전트 이름과 작업 설명을 제공합니다.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">도구 출력이 처리되는 방식</h3><p>도구가 대용량 결과를 생성하는 경우 딥 에이전트는 이를 파일에 자동으로 저장합니다.</p>
<p>예를 들어 <code translate="no">internet_search</code> 에서 100KB의 콘텐츠를 반환하면 시스템은 이를 <code translate="no">/tool_results/internet_search_1.txt</code> 과 같은 파일에 저장합니다. 에이전트는 해당 컨텍스트에서 파일 경로만 유지합니다. 이렇게 하면 토큰 사용량이 줄어들고 컨텍스트 창을 작게 유지할 수 있습니다.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">딥에이전트 대 에이전트 빌더: 각각 언제 사용해야 하나요?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>이 아티클은 딥에이전트에 초점을 맞추었으므로,</em><em> 랭체인 생태계의 또 다른 에이전트 구축 옵션인</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>에이전트 빌더와</em></a><em>비교하여 이해하는 것도 도움이 될 것입니다</em><em>.</em></p>
<p>LangChain은 AI 에이전트를 구축하는 여러 가지 방법을 제공하며, 최선의 선택은 일반적으로 시스템을 얼마나 많이 제어하고 싶은지에 따라 달라집니다.</p>
<p><strong>딥에이전트는</strong> 장기간 실행되는 다단계 작업을 처리하는 자율 에이전트를 구축하기 위해 설계되었습니다. 개발자는 에이전트가 작업을 계획하고, 도구를 사용하고, 메모리를 관리하는 방법을 완벽하게 제어할 수 있습니다. LangGraph를 기반으로 구축되었기 때문에 구성 요소를 사용자 정의하고, Python 도구를 통합하고, 스토리지 백엔드를 수정할 수 있습니다. 따라서 안정성과 유연성이 중요한 복잡한 워크플로우와 프로덕션 시스템에 적합한 솔루션입니다.</p>
<p>반면<strong>에이전트 빌더는</strong> 사용 편의성에 중점을 둡니다. 대부분의 기술적 세부 사항이 숨겨져 있으므로 에이전트를 설명하고, 툴을 추가하고, 빠르게 실행할 수 있습니다. 메모리, 도구 사용 및 사람의 승인 단계가 자동으로 처리됩니다. 따라서 에이전트 빌더는 빠른 프로토타입, 내부 도구 또는 초기 실험에 유용합니다.</p>
<p><strong>에이전트 빌더와 딥에이전트는 별도의 시스템이 아니라 동일한 스택의 일부입니다.</strong> 에이전트 빌더는 딥에이전트 위에 구축됩니다. 많은 팀이 에이전트 빌더로 시작하여 아이디어를 테스트한 다음 더 많은 제어가 필요할 때 DeepAgents로 전환합니다. DeepAgents로 만든 워크플로는 다른 사람들이 쉽게 재사용할 수 있도록 에이전트 빌더 템플릿으로 전환할 수도 있습니다.</p>
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
    </button></h2><p>딥 에이전트는 작업 계획, 파일 저장, 하위 상담원 위임이라는 세 가지 주요 아이디어를 사용하여 복잡한 상담원 워크플로우를 더 쉽게 관리할 수 있게 해줍니다. 이러한 메커니즘은 지저분한 다단계 프로세스를 구조화된 워크플로로 바꿔줍니다. 벡터 검색을 위해 Milvus와 결합하면 에이전트는 세션 전반에 걸쳐 장기적인 메모리를 유지할 수 있습니다.</p>
<p>개발자에게 이는 토큰 비용을 낮추고 간단한 데모에서 프로덕션 환경으로 확장할 수 있는 보다 안정적인 시스템을 의미합니다.</p>
<p>구조화된 워크플로우와 실제 장기 메모리가 필요한 AI 에이전트를 구축하고 계신다면 언제든지 연락주시기 바랍니다.</p>
<p>딥 에이전트 또는 Milvus를 영구 메모리 백엔드로 사용하는 것에 대해 질문이 있으신가요? <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하거나 20분 동안 진행되는 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션을 예약하여 사용 사례에 대해 논의하세요.</p>
