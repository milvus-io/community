---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >
  LangChain 1.0 and Milvus: How to Build Production-Ready Agents with Real
  Long-Term Memory
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
  Discover how LangChain 1.0 simplifies agent architecture and how Milvus adds
  long-term memory for scalable, production-ready AI applications.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain is a popular open-source framework for developing applications powered by large language models (LLMs). It provides a modular toolkit for building reasoning and tool-using agents, connecting models to external data, and managing interaction flows.</p>
<p>With the release of <strong>LangChain 1.0</strong>, the framework takes a step toward a more production-friendly architecture. The new version replaces the earlier Chain-based design with a standardized ReAct loop (Reason → Tool Call → Observe → Decide) and introduces Middleware for managing execution, control, and safety.</p>
<p>However, reasoning alone isn’t enough. Agents also need the ability to store, recall, and reuse information. That’s where <a href="https://milvus.io/"><strong>Milvus</strong></a>, an open-source vector database, can play an essential role. Milvus provides a scalable, high-performance memory layer that enables agents to store, search, and retrieve information efficiently via semantic similarity.</p>
<p>In this post, we’ll explore how LangChain 1.0 updates agent architecture, and how integrating Milvus helps agents go beyond reasoning  — enabling persistent, intelligent memory for real-world use cases.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">Why the Chain-based Design Falls Short<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>In its early days (version 0.x), LangChain’s architecture centered around Chains. Each Chain defined a fixed sequence and came with prebuilt templates that made LLM orchestration simple and fast. This design was great for quickly building prototypes. But as the LLM ecosystem evolved and real-world use cases grew more complex, cracks in this architecture began to show.</p>
<p><strong>1. Lack of Flexibility</strong></p>
<p>Early versions of LangChain provided modular pipelines such as SimpleSequentialChain or LLMChain, each following a fixed, linear flow—prompt creation → model call → output processing. This design worked well for simple and predictable tasks and made it easy to prototype quickly.</p>
<p>However, as applications grew more dynamic, these rigid templates began to feel restrictive. When business logic no longer fits neatly into a predefined sequence, you are left with two unsatisfying options: force your logic to conform to the framework or bypass it entirely by calling the LLM API directly.</p>
<p><strong>2. Lack of Production-Grade Control</strong></p>
<p>What worked fine in demos often broke in production. The Chains didn’t include the safeguards needed for large-scale, persistent, or sensitive applications. Common issues included:</p>
<ul>
<li><p><strong>Context overflow:</strong> Long conversations could exceed token limits, causing crashes or silent truncation.</p></li>
<li><p><strong>Sensitive data leaks:</strong> Personally identifiable information (like emails or IDs) could be inadvertently sent to third-party models.</p></li>
<li><p><strong>Unsupervised operations:</strong> Agents might delete data or send email without human approval.</p></li>
</ul>
<p><strong>3. Lack of Cross-Model Compatibility</strong></p>
<p>Each LLM provider—OpenAI, Anthropic, and many Chinese models—implements its own protocols for reasoning and tool calling. Every time you switched providers, you had to rewrite the integration layer: prompt templates, adapters, and response parsers. This repetitive work slowed development and made experimentation painful.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0: All-in ReAct Agent<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>When the LangChain team analyzed hundreds of production-grade agent implementations, one insight stood out: nearly all successful agents naturally converged on the <strong>ReAct (“Reasoning + Acting”) pattern</strong>.</p>
<p>Whether in a multi-agent system or a single agent performing deep reasoning, the same control loop emerges: alternating between brief reasoning steps with targeted tool calls, then feeding the resulting observations into subsequent decisions until the agent can deliver a final answer.</p>
<p>To build on this proven structure, LangChain 1.0 places the ReAct loop at the core of its architecture, making it the default structure for building reliable, interpretable, and production-ready agents.</p>
<p>To support everything from simple agents to complex orchestrations, LangChain 1.0 adopts a layered design that combines ease of use with precise control:</p>
<ul>
<li><p><strong>Standard scenarios:</strong> Start with the create_agent() function — a clean, standardized ReAct loop that handles reasoning and tool calls out of the box.</p></li>
<li><p><strong>Extended scenarios:</strong> Add Middleware to gain fine-grained control. Middleware lets you inspect or modify what happens inside the agent — for example, adding PII detection, human-approval checkpoints, automatic retries, or monitoring hooks.</p></li>
<li><p><strong>Complex scenarios:</strong> For stateful workflows or multi-agent orchestration, use LangGraph, a graph-based execution engine that provides precise control over logic flow, dependencies, and execution states.</p></li>
</ul>
<p>Now let’s break down the three key components that make agent development simpler, safer, and more consistent across models.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. The create_agent(): A Simpler Way to Build Agents</h3><p>A key breakthrough in LangChain 1.0 is how it reduces the complexity of building agents to a single function — create_agent(). You no longer need to manually handle state management, error handling, or streaming outputs. These production-level features are now automatically managed by the LangGraph runtime underneath.</p>
<p>With just three parameters, you can launch a fully functional agent:</p>
<ul>
<li><p><strong>model</strong> — either a model identifier (string) or an instantiated model object.</p></li>
<li><p><strong>tools</strong> — a list of functions that give the agent its abilities.</p></li>
<li><p><strong>system_prompt</strong> — the instruction that defines the agent’s role, tone, and behavior.</p></li>
</ul>
<p>Under the hood, create_agent() runs on the standard agent loop — calling a model, letting it choose tools to execute, and completing once no more tools are needed:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>It also inherits LangGraph’s built-in capabilities for state persistence, interruption recovery, and streaming. Tasks that once took hundreds of lines of orchestration code are now handled through a single, declarative API.</p>
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
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. The Middleware: A Composable Layer for Production-Ready Control</h3><p>Middleware is the key bridge that takes LangChain from prototype to production. It exposes hooks at strategic points in the agent’s execution loop, allowing you to add custom logic without rewriting the core ReAct process.</p>
<p>An agent’s main loop follows a three-step decision process — Model → Tool → Termination:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 provides a few <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">prebuilt middlewares</a> for common patterns. Here are four examples.</p>
<ul>
<li><strong>PII detection: Any application handling sensitive user data</strong></li>
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
<li><strong>Summarization: Automatically summarize conversation history when approaching token limits.</strong></li>
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
<li><strong>Tool retry: Automatically retry failed tool calls with configurable exponential backoff.</strong></li>
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
<li><strong>Custom Middleware</strong></li>
</ul>
<p>In addition to the official, prebuilt middleware options, you can also create custom middleware using decorator-based or class-based way.</p>
<p>For example, the snippet below shows how to log model calls before execution:</p>
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
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. Structured Output: A Standardized Way to Handle Data</h3><p>In traditional agent development, structured output has always been difficult to manage. Each model provider handles it differently — for example, OpenAI offers a native Structured Output API, while others only support structured responses indirectly through tool calls. This often meant writing custom adapters for each provider, adding extra work and making maintenance more painful than it should be.</p>
<p>In LangChain 1.0, structured output is handled directly through the response_format parameter in create_agent().  You only need to define your data schema once. LangChain automatically picks the best enforcement strategy based on the model you’re using — no extra setup or vendor-specific code required.</p>
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
<p>LangChain supports two strategies for structured output:</p>
<p><strong>1. Provider Strategy:</strong> Some model providers natively support structured output through their APIs (e.g. OpenAI and Grok). When such support is available, LangChain uses the provider’s built-in schema enforcement directly. This approach offers the highest level of reliability and consistency, since the model itself guarantees the output format.</p>
<p><strong>2. Tool Calling Strategy:</strong> For models that don’t support native structured output, LangChain uses tool calling to achieve the same result.</p>
<p>You don’t need to worry about which strategy is being used — the framework detects the model’s capabilities and adapts automatically. This abstraction lets you switch between different model providers freely without changing your business logic.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">How Milvus Enhances Agent Memory<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>For production-grade agents, the real performance bottleneck often isn’t the reasoning engine — it’s the memory system. In LangChain 1.0, vector databases act as an agent’s external memory, providing long-term recall through semantic retrieval.</p>
<p><a href="https://milvus.io/">Milvus</a> is one of the most mature open-source vector databases available today, purpose-built for large-scale vector search in AI applications. It integrates natively with LangChain, so you don’t have to manually handle vectorization, index management, or similarity search. The langchain_milvus package wraps Milvus as a standard VectorStore interface, allowing you to connect it to your agents with just a few lines of code.</p>
<p>By doing so, Milvus addresses three key challenges in building scalable and reliable agent memory systems:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. Fast Retrieval from Massive Knowledge Bases</strong></h4><p>When an agent needs to process thousands of documents, past conversations, or product manuals, simple keyword search just isn’t enough. Milvus uses vector similarity search to find semantically relevant information in milliseconds — even if the query uses different wording. This allows your agent to recall knowledge based on meaning, not just exact text matches.</p>
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
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. Persistent Long-Term Memory</strong></h4><p>LangChain’s SummarizationMiddleware can condense conversation history when it gets too long, but what happens to all the details that get summarized away? Milvus keeps them. Every conversation, tool call, and reasoning step can be vectorized and stored for long-term reference. When needed, the agent can quickly retrieve relevant memories through semantic search, enabling true continuity across sessions.</p>
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
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. Unified Management of Multimodal Content</strong></h4><p>Modern agents handle more than text — they interact with images, audio, and video. Milvus supports multi-vector storage and dynamic schema, allowing you to manage embeddings from multiple modalities in a single system. This provides a unified memory foundation for multimodal agents, enabling consistent retrieval across different types of data.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain vs. LangGraph: How to Choose the One That Fits for Your Agents<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Upgrading to LangChain 1.0 is an essential step toward building production-grade agents — but that doesn’t mean it’s always the only or best choice for every use case. Choosing the right framework determines how quickly you can combine these capabilities into a working, maintainable system.</p>
<p>Actually, LangChain 1.0 and LangGraph 1.0 can be seen as part of the same layered stack, designed to work together rather than replace each other: LangChain helps you build standard agents quickly, while LangGraph gives you fine-grained control for complex workflows. In other words, LangChain helps you move fast, while LangGraph helps you go deep.</p>
<p>Below is a quick comparison of how they differ in technical positioning:</p>
<table>
<thead>
<tr><th><strong>Dimension</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Abstraction Level</strong></td><td>High-level abstraction, designed for standard agent scenarios</td><td>Low-level orchestration framework, designed for complex workflows</td></tr>
<tr><td><strong>Core Capability</strong></td><td>Standard ReAct loop (Reason → Tool Call → Observation → Response)</td><td>Custom state machines and complex branching logic (StateGraph + Conditional Routing)</td></tr>
<tr><td><strong>Extension Mechanism</strong></td><td>Middleware for production-grade capabilities</td><td>Manual management of nodes, edges, and state transitions</td></tr>
<tr><td><strong>Underlying Implementation</strong></td><td>Manual management of nodes, edges, and state transitions</td><td>Native runtime with built-in persistence and recovery</td></tr>
<tr><td><strong>Typical Use Cases</strong></td><td>80% of standard agent scenarios</td><td>Multi-agent collaboration and long-running workflow orchestration</td></tr>
<tr><td><strong>Learning Curve</strong></td><td>Build an agent in ~10 lines of code</td><td>Requires understanding of state graphs and node orchestration</td></tr>
</tbody>
</table>
<p>If you’re new to building agents or want to get a project up and running quickly, start with LangChain. If you already know your use case requires complex orchestration, multi-agent collaboration, or long-running workflows, go straight to LangGraph.</p>
<p>Both frameworks can coexist in the same project — you can start simple with LangChain and bring in LangGraph when your system needs more control and flexibility. The key is to choose the right tool for each part of your workflow.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Three years ago, LangChain started as a lightweight wrapper for calling LLMs. Today, it has grown into a complete, production-grade framework.</p>
<p>At the core, middleware layers provide safety, compliance, and observability. LangGraph adds persistent execution, control flow, and state management. And at the memory layer, <a href="https://milvus.io/">Milvus</a> fills a critical gap—providing scalable, reliable long-term memory that allows agents to retrieve context, reason over history, and improve over time.</p>
<p>Together, LangChain, LangGraph, and Milvus form a practical toolchain for the modern agent era—bridging rapid prototyping with enterprise-scale deployment, without sacrificing reliability or performance.</p>
<p>🚀 Ready to give your agent a reliable, long-term memory? Explore <a href="https://milvus.io">Milvus</a> and see how it powers intelligent, long-term memory for LangChain agents in production.</p>
<p>Have questions or want a deep dive on any feature? Join our <a href="https://discord.com/invite/8uyFbECzPX">Discord channel</a> or file issues on <a href="https://github.com/milvus-io/milvus">GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
