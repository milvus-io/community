---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: |
  How to Build Production-Ready AI Agents with Deep Agents and Milvus
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
desc: >
  Learn how to build scalable AI agents using Deep Agents and Milvus for
  long-running tasks, lower token costs, and persistent memory.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>More and more teams are building AI agents, and the tasks they assign to them are becoming more complex. Many real-world workflows involve long-running jobs with multiple steps and many tool calls. As these tasks grow, two problems appear quickly: higher token costs and the limits of the model’s context window. Agents also often need to remember information across sessions, such as past research results, user preferences, or earlier conversations.</p>
<p>Frameworks like <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a>, released by LangChain, help organize these workflows. It provides a structured way to run agents, with support for task planning, file access, and sub-agent delegation. This makes it easier to build agents that can handle long, multi-step tasks more reliably.</p>
<p>But workflows alone are not enough. Agents also need <strong>long-term memory</strong> so they can retrieve useful information from previous sessions. This is where <a href="https://milvus.io/"><strong>Milvus</strong></a>, an open-source vector database, comes in. By storing embeddings of conversations, documents, and tool results, Milvus allows agents to search and recall past knowledge.</p>
<p>In this article, we’ll explain how Deep Agents works and show how to combine it with Milvus to build AI agents with structured workflows and long-term memory.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">What Is Deep Agents?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong> is an open-source agent framework built by the LangChain team. It is designed to help agents handle long-running, multi-step tasks more reliably. It focuses on three main capabilities:</p>
<p><strong>1. Task Planning</strong></p>
<p>Deep Agents includes built-in tools like <code translate="no">write_todos</code> and <code translate="no">read_todos</code>. The agent breaks a complex task into a clear to-do list, then works through each item step by step, marking tasks as completed.</p>
<p><strong>2. File System Access</strong></p>
<p>It provides tools such as <code translate="no">ls</code>, <code translate="no">read_file</code>, and <code translate="no">write_file</code>, so the agent can view, read, and write files. If a tool produces a large output, the result is automatically saved to a file instead of staying in the model’s context window. This helps prevent the context window from filling up.</p>
<p><strong>3. Sub-agent Delegation</strong></p>
<p>Using a <code translate="no">task</code> tool, the main agent can hand off subtasks to specialized sub-agents. Each sub-agent has its own context window and tools, which helps keep work organized.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Technically, an agent created with <code translate="no">create_deep_agent</code> is a compiled <strong>LangGraph StateGraph</strong>. (LangGraph is the workflow library developed by the LangChain team, and StateGraph is its core state structure.) Because of this, Deep Agents can directly use LangGraph features like streaming output, checkpointing, and human-in-the-loop interaction.</p>
<p><strong>So what makes Deep Agents useful in practice?</strong></p>
<p>Long-running agent tasks often face problems such as context limits, high token costs, and unreliable execution. Deep Agents helps solve these issues by making agent workflows more structured and easier to manage. By reducing unnecessary context growth, it lowers token usage and keeps long-running tasks more cost-efficient.</p>
<p>It also makes complex, multi-step tasks easier to organize. Subtasks can run independently without interfering with each other, which improves reliability. At the same time, the system is flexible, allowing developers to customize and extend it as their agents grow from simple experiments to production applications.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">Customization in Deep Agents<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>A general framework cannot cover every industry or business need. Deep Agents is designed to be flexible, so developers can adjust it to fit their own use cases.</p>
<p>With customization, you can:</p>
<ul>
<li><p>Connect your own internal tools and APIs</p></li>
<li><p>Define domain-specific workflows</p></li>
<li><p>Make sure the agent follows business rules</p></li>
<li><p>Support memory and knowledge sharing across sessions</p></li>
</ul>
<p>Here are the main ways you can customize Deep Agents:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">System Prompt Customization</h3><p>You can add your own system prompt on top of the default instructions provided by middleware. This is useful for defining domain rules and workflows.</p>
<p>A good custom prompt may include:</p>
<ul>
<li><strong>Domain workflow rules</strong></li>
</ul>
<p>Example: “For data analysis tasks, always run exploratory analysis before building a model.”</p>
<ul>
<li><strong>Specific examples</strong></li>
</ul>
<p>Example: “Combine similar literature search requests into one todo item.”</p>
<ul>
<li><strong>Stopping rules</strong></li>
</ul>
<p>Example: “Stop if more than 100 tool calls are used.”</p>
<ul>
<li><strong>Tool coordination guidance</strong></li>
</ul>
<p>Example: “Use <code translate="no">grep</code> to find code locations, then use <code translate="no">read_file</code> to view details.”</p>
<p>Avoid repeating instructions that middleware already handles, and avoid adding rules that conflict with the default behavior.</p>
<h3 id="Tools" class="common-anchor-header">Tools</h3><p>You can add your own tools to the built-in toolset. Tools are defined as normal Python functions, and their docstrings describe what they do.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents also supports tools that follow the Model Context Protocol (MCP) standard through <code translate="no">langchain-mcp-adapters</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">Middleware</h3><p>You can write custom middleware to:</p>
<ul>
<li><p>Add or modify tools</p></li>
<li><p>Adjust prompts</p></li>
<li><p>Hook into different stages of the agent’s execution</p></li>
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
<p>Deep Agents also includes built-in middleware for planning, sub-agent management, and execution control.</p>
<table>
<thead>
<tr><th>Middleware</th><th>Function</th></tr>
</thead>
<tbody>
<tr><td>TodoListMiddleware</td><td>Provides write_todos and read_todos tools to manage task lists</td></tr>
<tr><td>FilesystemMiddleware</td><td>Provides file operation tools and automatically saves large tool outputs</td></tr>
<tr><td>SubAgentMiddleware</td><td>Provides the task tool to delegate work to sub-agents</td></tr>
<tr><td>SummarizationMiddleware</td><td>Automatically summarizes when context exceeds 170k tokens</td></tr>
<tr><td>AnthropicPromptCachingMiddleware</td><td>Enables prompt caching for Anthropic models</td></tr>
<tr><td>PatchToolCallsMiddleware</td><td>Fixes incomplete tool calls caused by interruptions</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>Configures tools that require human approval</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">Sub-agents</h3><p>The main agent can delegate subtasks to sub-agents using the <code translate="no">task</code> tool. Each sub-agent runs in its own context window and has its own tools and system prompt.</p>
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
<p>For advanced use cases, you can even pass in a pre-built LangGraph workflow as a sub-agent.</p>
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
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (Human Approval Control)</h3><p>You can specify certain tools that require human approval using the <code translate="no">interrupt_on</code> parameter. When the agent calls one of these tools, execution pauses until a person reviews and approves it.</p>
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
<h3 id="Backend-Customization-Storage" class="common-anchor-header">Backend Customization (Storage)</h3><p>You can choose different storage backends to control how files are handled. Current options include:</p>
<ul>
<li><p><strong>StateBackend</strong> (temporary storage)</p></li>
<li><p><strong>FilesystemBackend</strong> (local disk storage)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>By changing the backend, you can adjust file storage behavior without changing the overall system design.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">Why Use Deep Agents with Milvus for AI Agents?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>In real applications, agents often need memory that lasts across sessions. For example, they may need to remember user preferences, build up domain knowledge over time, record feedback to adjust behavior, or keep track of long-term research tasks.</p>
<p>By default, Deep Agents uses <code translate="no">StateBackend</code>, which only stores data during a single session. When the session ends, everything is cleared. This means it cannot support long-term, cross-session memory.</p>
<p>To enable persistent memory, we use <a href="https://milvus.io/"><strong>Milvus</strong></a> as the vector database together with <code translate="no">StoreBackend</code>. Here’s how it works: important conversation content and tool results are converted into embeddings (numerical vectors that represent meaning) and stored in Milvus. When a new task starts, the agent performs semantic search to retrieve related past memories. This allows the agent to “remember” relevant information from previous sessions.</p>
<p>Milvus is well suited for this use case because of its compute-storage separation architecture. It supports:</p>
<ul>
<li><p>Horizontal scaling to tens of billions of vectors</p></li>
<li><p>High-concurrency queries</p></li>
<li><p>Real-time data updates</p></li>
<li><p>Production-ready deployment for large-scale systems</p></li>
</ul>
<p>Technically, Deep Agents uses <code translate="no">CompositeBackend</code> to route different paths to different storage backends:</p>
<table>
<thead>
<tr><th>Path</th><th>Backend</th><th>Purpose</th></tr>
</thead>
<tbody>
<tr><td>/workspace/, /temp/</td><td>StateBackend</td><td>Temporary data, cleared after the session</td></tr>
<tr><td>/memories/, /knowledge/</td><td>StoreBackend + Milvus</td><td>Persistent data, searchable across sessions</td></tr>
</tbody>
</table>
<p>With this setup, developers only need to save long-term data under paths like <code translate="no">/memories/</code>. The system automatically handles cross-session memory. Detailed configuration steps are provided in the section below.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">Hands-on: Build an AI Agent with Long-Term Memory Using Milvus and Deep Agents<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>This example shows how to give a DeepAgents-based agent persistent memory using Milvus.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">Step 1: Install dependencies</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">Step 2: Set up the memory backend</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
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
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">Step 3: Create the agent</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
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
<p><strong>Key Points</strong></p>
<ul>
<li><strong>Persistent path</strong></li>
</ul>
<p>Any files saved under <code translate="no">/memories/</code> will be stored permanently and can be accessed across different sessions.</p>
<ul>
<li><strong>Production setup</strong></li>
</ul>
<p>The example uses <code translate="no">InMemoryStore()</code> for testing. In production, replace it with a Milvus adapter to enable scalable semantic search.</p>
<ul>
<li><strong>Automatic memory</strong></li>
</ul>
<p>The agent automatically saves research results and important outputs to the <code translate="no">/memories/</code> folder. In later tasks, it can search and retrieve relevant past information.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">Built-in Tools Overview<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents includes several built-in tools, provided through middleware. They fall into three main groups:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">Task Management (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>Creates a structured todo list. Each task can include a description, priority, and dependencies.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>Shows the current todo list, including completed and pending tasks.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">File System Tools (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>Lists files in a directory. Must use an absolute path (starting with <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>Reads file content. Supports <code translate="no">offset</code> and <code translate="no">limit</code> for large files.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>Creates or overwrites a file.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>Replaces specific text inside a file.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>Finds files using patterns, such as <code translate="no">**/*.py</code> to search for all Python files.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>Searches for text inside files.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>Runs shell commands in a sandbox environment. Requires the backend to support <code translate="no">SandboxBackendProtocol</code>.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">Sub-agent Delegation (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>Sends a subtask to a specific sub-agent. You provide the sub-agent name and the task description.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">How Tool Outputs Are Handled</h3><p>If a tool generates a large result, Deep Agents automatically saves it to a file.</p>
<p>For example, if <code translate="no">internet_search</code> returns 100KB of content, the system saves it to something like <code translate="no">/tool_results/internet_search_1.txt</code>. The agent keeps only the file path in its context. This reduces Token usage and keeps the context window small.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents vs. Agent Builder: When Should You Use Each?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Since this article focuses on DeepAgents, it’s also helpful to understand how it compares with</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em>, another agent-building option in the LangChain ecosystem.</em></p>
<p>LangChain offers several ways to build AI agents, and the best choice usually depends on how much control you want over the system.</p>
<p><strong>DeepAgents</strong> is designed for building autonomous agents that handle long-running, multi-step tasks. It gives developers full control over how the agent plans tasks, uses tools, and manages memory. Because it is built on LangGraph, you can customize components, integrate Python tools, and modify the storage backend. This makes DeepAgents a good fit for complex workflows and production systems where reliability and flexibility are important.</p>
<p><strong>Agent Builder</strong>, in contrast, focuses on ease of use. It hides most of the technical details, so you can describe an agent, add tools, and run it quickly. Memory, tool usage, and human approval steps are handled automatically. This makes Agent Builder useful for quick prototypes, internal tools, or early experiments.</p>
<p><strong>Agent Builder and DeepAgents are not separate systems—they are part of the same stack.</strong> Agent Builder is built on top of DeepAgents. Many teams start with Agent Builder to test ideas, then switch to DeepAgents when they need more control. Workflows created with DeepAgents can also be turned into Agent Builder templates so others can reuse them easily.</p>
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
    </button></h2><p>Deep Agents makes complex agent workflows easier to manage by using three main ideas: task planning, file storage, and sub-agent delegation. These mechanisms turn messy, multi-step processes into structured workflows. When combined with Milvus for vector search, the agent can also keep long-term memory across sessions.</p>
<p>For developers, this means lower Token costs and a more reliable system that can scale from a simple demo to a production environment.</p>
<p>If you’re building AI agents that need structured workflows and real long-term memory, we’d love to connect.</p>
<p>Have questions about Deep Agents or using Milvus as a persistent memory backend? Join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack channel</a> or book a 20-minute <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> session to discuss your use case.</p>
