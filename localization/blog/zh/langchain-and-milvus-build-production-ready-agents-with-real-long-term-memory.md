---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: LangChain 1.0 和 Milvus：如何构建具有真正长期记忆功能的生产就绪型 Agents
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
desc: 了解 LangChain 1.0 如何简化 Agents 架构，以及 Milvus 如何为可扩展、可投入生产的人工智能应用添加长期内存。
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain 是一个流行的开源框架，用于开发由大型语言模型（LLMs）驱动的应用程序。它为构建推理和工具使用 Agents、将模型与外部数据连接以及管理交互流提供了模块化工具包。</p>
<p>随着<strong>LangChain 1.0</strong> 的发布，该框架向更便于生产的架构迈进了一步。新版本用标准化的 ReAct 循环（推理→工具调用→观察→决策）取代了早期基于链的设计，并引入了中间件来管理执行、控制和安全。</p>
<p>然而，仅有推理是不够的。Agents 还需要存储、调用和重用信息的能力。这正是开源向量数据库<a href="https://milvus.io/"><strong>Milvus</strong></a> 可以发挥重要作用的地方。Milvus 提供了一个可扩展的高性能存储层，使 Agents 能够通过语义相似性高效地存储、搜索和检索信息。</p>
<p>在本篇文章中，我们将探讨 LangChain 1.0 如何更新 Agents 架构，以及集成 Milvus 如何帮助 Agents 超越推理--为实际用例实现持久、智能的内存。</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">基于链的设计为何失败<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>在早期（0.x 版），LangChain 的架构以 Chains 为中心。每个 Chain 都定义了一个固定的序列，并附带预制模板，使 LLM 的协调变得简单而快速。这种设计非常适合快速构建原型。但随着 LLM 生态系统的发展和实际用例的日益复杂，这种架构开始出现裂缝。</p>
<p><strong>1.缺乏灵活性</strong></p>
<p>LangChain 的早期版本提供了模块化流水线，如 SimpleSequentialChain 或 LLMChain，每个流水线都遵循固定的线性流程--提示创建 → 模型调用 → 输出处理。这种设计对于简单和可预测的任务非常有效，而且易于快速建立原型。</p>
<p>然而，随着应用程序变得越来越动态，这些僵化的模板开始让人感觉受到限制。当业务逻辑不再整齐地符合预定义的序列时，您就会面临两种令人不满意的选择：强迫您的逻辑符合框架，或者直接调用 LLM API 以完全绕过框架。</p>
<p><strong>2.缺乏生产级控制</strong></p>
<p>在演示中运行良好的功能在生产中往往会被破坏。链并不包含大规模、持久性或敏感应用程序所需的保障措施。常见问题包括</p>
<ul>
<li><p><strong>上下文溢出：</strong>冗长的对话可能超过令牌限制，导致崩溃或无声截断。</p></li>
<li><p><strong>敏感数据泄漏：</strong>个人身份信息（如电子邮件或 ID）可能会无意中发送到第三方模型。</p></li>
<li><p><strong>无监督操作符：</strong>Agents 可能会在未经人工批准的情况下删除数据或发送电子邮件。</p></li>
</ul>
<p><strong>3.缺乏跨模型兼容性</strong></p>
<p>每个 LLM 提供商--OpenAI、Anthropic 和许多中国模型--都执行自己的推理和工具调用协议。每次更换提供商，都必须重写集成层：提示模板、适配器和响应解析器。这种重复性的工作拖慢了开发速度，也让实验变得非常痛苦。</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0：全功能 ReAct 代理<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>当 LangChain 团队分析了数百个生产级 Agents 实施方案后，有一个观点非常突出：几乎所有成功的 Agents 都自然而然地采用了<strong>ReAct（"推理 + 行动"）模式</strong>。</p>
<p>无论是在多 Agents 系统中，还是在执行深度推理的单个 Agents 中，都会出现相同的控制循环：在简短的推理步骤与有针对性的工具调用之间交替进行，然后将观察结果反馈到后续决策中，直至 Agents 能够提供最终答案。</p>
<p>LangChain 1.0 将 ReAct 循环置于其架构的核心位置，使其成为构建可靠、可解释和可投入生产的 Agents 的默认架构。</p>
<p>为了支持从简单的 Agents 到复杂的编排，LangChain 1.0 采用了分层设计，将易用性与精确控制相结合：</p>
<ul>
<li><p><strong>标准场景：</strong>从 create_agent() 函数开始--这是一个简洁、标准化的 ReAct 循环，可处理推理和工具调用。</p></li>
<li><p><strong>扩展方案：</strong>添加中间件，获得精细控制。中间件可让你检查或修改代理内部发生的事情，例如，添加 PII 检测、人工审批检查点、自动重试或监控钩子。</p></li>
<li><p><strong>复杂场景：</strong>对于有状态的工作流或多代理协调，可使用 LangGraph，这是一种基于图形的执行引擎，可对逻辑流、依赖关系和执行状态进行精确控制。</p></li>
</ul>
<p>现在，让我们来分解使 Agents 开发更简单、更安全、跨模型更一致的三个关键组件。</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1.创建代理（create_agent()）：构建代理的更简单方法</h3><p>LangChain 1.0 的一个关键突破在于它如何将构建代理的复杂性降低到一个函数 - create_agent()。您不再需要手动处理状态管理、错误处理或流输出。LangGraph 运行时会自动管理这些生产级功能。</p>
<p>只需三个参数，您就能启动一个功能齐全的 Agents：</p>
<ul>
<li><p><strong>model</strong>- 模型标识符（字符串）或实例化模型对象。</p></li>
<li><p><strong>tools</strong>- 赋予 Agents 功能的函数列表。</p></li>
<li><p><strong>system_prompt</strong>- 定义 Agents 角色、语气和行为的指令。</p></li>
</ul>
<p>在引擎盖下，create_agent() 按标准的代理循环运行--调用一个模型，让它选择要执行的工具，并在不再需要工具时完成：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>它还继承了 LangGraph 内置的状态持久性、中断恢复和流功能。过去需要数百行协调代码才能完成的任务，现在只需通过一个声明式 API 即可完成。</p>
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
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2.中间件：生产就绪控制的可组合层</h3><p>中间件是将 LangChain 从原型推向生产的关键桥梁。它在 Agents 的执行循环中的战略点上提供钩子，使您可以添加自定义逻辑，而无需重写核心 ReAct 流程。</p>
<p>Agents 的主循环遵循三步决策流程--模型 → 工具 → 终止：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 为常见模式提供了一些<a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">预构建的中间件</a>。下面是四个例子。</p>
<ul>
<li><strong>PII 检测：任何处理敏感用户数据的应用程序</strong></li>
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
<li><strong>总结：在接近令牌限制时自动总结对话历史。</strong></li>
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
<li><strong>工具重试：自动重试失败的工具调用，并可配置指数式延迟。</strong></li>
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
<li><strong>自定义中间件</strong></li>
</ul>
<p>除了官方预构建的中间件选项外，您还可以使用基于装饰器或基于类的方式创建自定义中间件。</p>
<p>例如，下面的代码段展示了如何在执行前记录模型调用：</p>
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
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3.结构化输出：处理数据的标准化方法</h3><p>在传统 Agents 开发中，结构化输出一直是难以管理的问题。每个模型提供商的处理方式都不尽相同，例如，OpenAI 提供了本地结构化输出 API，而其他提供商只能通过工具调用间接支持结构化响应。这往往意味着要为每个提供商编写自定义适配器，从而增加了额外的工作，使维护工作变得更加痛苦。</p>
<p>在 LangChain 1.0 中，结构化输出可通过 create_agent() 中的 response_format 参数直接处理。  您只需定义一次数据 Schema。LangChain 会根据您使用的模型自动选择最佳执行策略，无需额外设置或特定于供应商的代码。</p>
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
<p>LangChain 支持两种结构化输出策略：</p>
<p><strong>1.提供商策略：</strong>一些模型提供商通过其 API 本机支持结构化输出（例如 OpenAI 和 Grok）。如果有这样的支持，LangChain 会直接使用提供商的内置 Schema 执行。这种方法提供了最高级别的可靠性和一致性，因为模型本身就能保证输出格式。</p>
<p><strong>2.工具调用策略：</strong>对于不支持本地结构化输出的模型，LangChain 使用工具调用来实现相同的结果。</p>
<p>你无需担心使用的是哪种策略--框架会检测模型的能力并自动适应。这种抽象性可让你在不同的模型提供者之间自由切换，而无需改变你的业务逻辑。</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Milvus 如何增强代理内存<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>对于生产级 Agents 而言，真正的性能瓶颈往往不是推理引擎，而是内存系统。在 LangChain 1.0 中，向量数据库充当了 Agents 的外部存储器，通过语义检索提供长期记忆。</p>
<p><a href="https://milvus.io/">Milvus</a>是当今最成熟的开源向量数据库之一，专为人工智能应用中的大规模向量搜索而设计。它与 LangChain 原生集成，因此您无需手动处理向量、索引管理或相似性搜索。langchain_milvus 软件包将 Milvus 包装成标准的 VectorStore 接口，只需几行代码就能将其连接到 Agents。</p>
<p>通过这样做，Milvus 解决了构建可扩展且可靠的 Agents 内存系统中的三大难题：</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1.从海量知识库中快速检索</strong></h4><p>当 Agents 需要处理成千上万的文档、过去的对话或产品手册时，简单的关键词搜索是远远不够的。Milvus 使用向量相似性搜索，能在几毫秒内找到语义相关的信息--即使查询使用了不同的措辞。这样，您的 Agents 就能根据意义调用知识，而不仅仅是精确的文本匹配。</p>
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
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2.持久的长期记忆</strong></h4><p>当对话历史过长时，LangChain 的摘要中间件（SummarizationMiddleware）可以压缩对话历史，但被摘要掉的所有细节会怎样呢？Milvus 会保留它们。每一次对话、工具调用和推理步骤都可以被向量化并存储起来，以供长期参考。需要时，Agent 可以通过语义搜索快速检索相关记忆，实现真正的跨会话连续性。</p>
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
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3.多模态内容的统一管理</strong></h4><p>现代 Agents 处理的不仅仅是文本，它们还与图像、音频和视频进行交互。Milvus 支持多向量存储和动态 Schema，使您能够在单一系统中管理多种模式的 Embeddings。这为多模态 Agents 提供了统一的存储基础，使不同类型数据的检索保持一致。</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain 与 LangGraph：如何为您的 Agents 选择合适的版本<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>升级到 LangChain 1.0 是构建生产级 Agents 的重要一步，但这并不意味着它总是每个用例的唯一或最佳选择。选择正确的框架决定了您能多快地将这些功能整合到一个可运行、可维护的系统中。</p>
<p>实际上，LangChain 1.0 和 LangGraph 1.0 可以看作是同一个分层堆栈的一部分，它们旨在协同工作，而不是相互替代：LangChain 可以帮助你快速构建标准 Agents，而 LangGraph 则为复杂的工作流程提供细粒度控制。换句话说，LangChain 可以帮助你快速行动，而 LangGraph 则可以帮助你深入研究。</p>
<p>下面是它们在技术定位上的不同之处的快速比较：</p>
<table>
<thead>
<tr><th><strong>尺寸</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>抽象级别</strong></td><td>高级抽象，专为标准 Agents 场景设计</td><td>低级协调框架，专为复杂工作流设计</td></tr>
<tr><td><strong>核心能力</strong></td><td>标准 ReAct 循环（原因 → 工具调用 → 观察 → 响应）</td><td>自定义状态机和复杂的分支逻辑（状态图 + 条件路由）</td></tr>
<tr><td><strong>扩展机制</strong></td><td>用于生产级功能的中间件</td><td>人工管理节点、边和状态转换</td></tr>
<tr><td><strong>基础实施</strong></td><td>手动管理节点、边和状态转换</td><td>具有内置持久性和恢复功能的本地运行时</td></tr>
<tr><td><strong>典型用例</strong></td><td>80% 的标准代理方案</td><td>多 Agents 协作和长期运行的工作流协调</td></tr>
<tr><td><strong>学习曲线</strong></td><td>用 ~10 行代码构建一个代理</td><td>需要了解状态图和节点协调</td></tr>
</tbody>
</table>
<p>如果您是构建 Agents 的新手，或者希望快速启动并运行一个项目，请从 LangChain 开始。如果您已经知道您的用例需要复杂的协调、多 Agents 协作或长期运行的工作流，那么请直接使用 LangGraph。</p>
<p>这两种框架可以在同一个项目中共存--您可以从简单的 LangChain 开始，当系统需要更多控制和灵活性时再引入 LangGraph。关键是为工作流程的每个部分选择合适的工具。</p>
<h2 id="Conclusion" class="common-anchor-header">总结<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>三年前，LangChain 作为调用 LLMs 的轻量级封装器起步。如今，它已成长为一个完整的生产级框架。</p>
<p>其核心是中间件层提供安全性、合规性和可观察性。LangGraph 增加了持久执行、控制流和状态管理功能。在内存层，<a href="https://milvus.io/">Milvus</a>填补了一个关键的空白--提供可扩展、可靠的长期内存，使 Agents 能够检索上下文、对历史进行推理，并随着时间的推移不断改进。</p>
<p>LangChain、LangGraph 和 Milvus 共同构成了现代 Agents 时代的实用工具链--在不牺牲可靠性或性能的前提下，实现了快速原型开发和企业级部署。</p>
<p>准备好为您的 Agents 提供可靠的长期记忆了吗？了解<a href="https://milvus.io">Milvus</a>，看看它如何为生产中的 LangChain 代理提供智能、长期的内存。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus">GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
