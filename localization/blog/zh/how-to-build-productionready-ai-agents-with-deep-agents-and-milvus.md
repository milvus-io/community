---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: 如何利用深度代理（Deep Agents）和 Milvus 构建生产就绪的人工智能代理
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
desc: 了解如何使用深度代理（Deep Agents）和 Milvus 构建可扩展的人工智能代理，以实现长期运行任务、降低令牌成本和持久内存。
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>越来越多的团队正在构建人工智能 Agents，而分配给它们的任务也变得越来越复杂。现实世界中的许多工作流程都涉及多个步骤和多次工具调用的长期工作。随着这些任务的增加，两个问题很快出现：更高的令牌成本和模型上下文窗口的限制。Agents 还经常需要跨会话记忆信息，例如过去的研究成果、用户偏好或先前的对话。</p>
<p>像 LangChain 发布的<a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a> 这样的框架有助于组织这些工作流程。它提供了运行 Agents 的结构化方式，支持任务规划、文件访问和子代理授权。这使得构建能更可靠地处理长、多步骤任务的 Agents 变得更加容易。</p>
<p>但仅有工作流还不够。代理还需要<strong>长期记忆</strong>，以便从以前的会话中检索有用的信息。这就是开源向量数据库<a href="https://milvus.io/"><strong>Milvus</strong></a> 的用武之地。通过存储对话、文档和工具结果的 Embeddings，Milvus 可以让 Agents 搜索和回忆过去的知识。</p>
<p>在本文中，我们将解释 Deep Agents 的工作原理，并展示如何将其与 Milvus 结合起来，构建具有结构化工作流程和长期记忆的人工智能代理。</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">什么是 Deep Agents？<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong>是由 LangChain 团队构建的开源代理框架。它旨在帮助 Agents 更可靠地处理长期运行的多步骤任务。它专注于三个主要功能：</p>
<p><strong>1.任务规划</strong></p>
<p>Deep Agents 包括<code translate="no">write_todos</code> 和<code translate="no">read_todos</code> 等内置工具。Agents 将复杂的任务分解成清晰的待办事项列表，然后一步步完成每个项目，并标记任务已完成。</p>
<p><strong>2.文件系统访问</strong></p>
<p>它提供了<code translate="no">ls</code> 、<code translate="no">read_file</code> 和<code translate="no">write_file</code> 等工具，因此 Agents 可以查看、读取和写入文件。如果工具产生了较大的输出，结果会自动保存到文件中，而不是停留在模型的上下文窗口中。这有助于防止上下文窗口被填满。</p>
<p><strong>3.子代理委托</strong></p>
<p>使用<code translate="no">task</code> 工具，主代理可以将子任务交给专门的子代理。每个子代理都有自己的上下文窗口和工具，这有助于保持工作的有序性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>从技术上讲，使用<code translate="no">create_deep_agent</code> 创建的 Agents 是一个编译后的<strong>LangGraph StateGraph</strong>。(LangGraph 是 LangChain 团队开发的工作流库，StateGraph 是其核心状态结构）。正因为如此，Deep Agents 可以直接使用 LangGraph 的功能，比如流式输出、检查点和人机交互。</p>
<p><strong>那么，是什么让深度代理在实践中发挥作用呢？</strong></p>
<p>长期运行的 Agents 任务经常面临上下文限制、高令牌成本和执行不可靠等问题。Deep Agents 通过使代理工作流更有条理、更易于管理来帮助解决这些问题。通过减少不必要的上下文增长，它可以降低令牌使用量，使长期运行的任务更具成本效益。</p>
<p>它还能让复杂的多步骤任务更容易组织。子任务可以独立运行，互不干扰，从而提高了可靠性。同时，该系统还很灵活，允许开发人员在 Agents 从简单实验发展到生产应用时对其进行定制和扩展。</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">深度代理的定制化<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>通用框架不可能涵盖所有行业或业务需求。Deep Agents 的设计非常灵活，开发人员可以根据自己的用例进行调整。</p>
<p>通过定制，您可以</p>
<ul>
<li><p>连接自己的内部工具和应用程序接口</p></li>
<li><p>定义特定领域的工作流</p></li>
<li><p>确保 Agents 遵循业务规则</p></li>
<li><p>支持跨会话记忆和知识共享</p></li>
</ul>
<p>以下是自定义 Deep Agents 的主要方式：</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">系统提示定制</h3><p>您可以在中间件提供的默认说明基础上添加自己的系统提示。这对于定义领域规则和工作流程非常有用。</p>
<p>一个好的自定义提示可能包括</p>
<ul>
<li><strong>域工作流程规则</strong></li>
</ul>
<p>例如"对于数据分析任务，始终在构建模型之前运行探索性分析"。</p>
<ul>
<li><strong>具体示例</strong></li>
</ul>
<p>例如"将类似的文献检索请求合并为一个待办事项"。</p>
<ul>
<li><strong>停止规则</strong></li>
</ul>
<p>示例"如果使用的工具调用次数超过 100 次，则停止"。</p>
<ul>
<li><strong>工具协调指导</strong></li>
</ul>
<p>示例："使用  查找代码位置，然后使用  查看详细信息："使用<code translate="no">grep</code> 查找代码位置，然后使用<code translate="no">read_file</code> 查看详细信息"。</p>
<p>避免重复中间件已经处理过的指令，避免添加与默认行为相冲突的规则。</p>
<h3 id="Tools" class="common-anchor-header">工具</h3><p>您可以在内置工具集中添加自己的工具。工具被定义为普通的 Python 函数，其文档说明了工具的作用。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents 还通过<code translate="no">langchain-mcp-adapters</code> 支持遵循模型上下文协议（MCP）标准的工具。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">中间件</h3><p>您可以编写自定义中间件，以便</p>
<ul>
<li><p>添加或修改工具</p></li>
<li><p>调整提示</p></li>
<li><p>与 Agents 执行的不同阶段挂钩</p></li>
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
<p>Deep Agents 还包含用于规划、子代理管理和执行控制的内置中间件。</p>
<table>
<thead>
<tr><th>中间件</th><th>功能</th></tr>
</thead>
<tbody>
<tr><td>任务列表中间件</td><td>提供用于管理任务列表的 write_todos 和 read_todos 工具</td></tr>
<tr><td>文件系统中间件</td><td>提供文件操作符工具，并自动保存大型工具的输出结果</td></tr>
<tr><td>子代理中间件</td><td>提供将工作委托给子 Agents 的任务工具</td></tr>
<tr><td>摘要中间件</td><td>当上下文超过 170k 标记时自动汇总</td></tr>
<tr><td>人类学提示缓存中间件</td><td>为 Anthropic 模型启用提示缓存功能</td></tr>
<tr><td>补丁工具调用中间件</td><td>修复因中断导致的不完整工具调用</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>配置需要人工批准的工具</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">子代理</h3><p>主代理可以使用<code translate="no">task</code> 工具将子任务委托给子代理。每个子代理都在自己的上下文窗口中运行，拥有自己的工具和系统提示。</p>
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
<p>对于高级用例，您甚至可以将预置的 LangGraph 工作流程作为子代理传入。</p>
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
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (人工审批控制）</h3><p>您可以使用<code translate="no">interrupt_on</code> 参数指定某些需要人工审批的工具。当 Agents 调用这些工具时，执行会暂停，直到有人审查并批准。</p>
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
<h3 id="Backend-Customization-Storage" class="common-anchor-header">后端定制（存储）</h3><p>您可以选择不同的存储后端来控制文件的处理方式。当前的选项包括</p>
<ul>
<li><p><strong>状态后端</strong>（临时存储）</p></li>
<li><p><strong>文件系统后端</strong>（本地磁盘存储）</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>通过改变后端，你可以调整文件存储行为，而无需改变整个系统的设计。</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">为什么要将深度代理与 Milvus 一起用于人工智能代理？<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>在实际应用中，Agent 通常需要跨会话持续的内存。例如，它们可能需要记住用户偏好，随着时间的推移积累领域知识，记录反馈以调整行为，或跟踪长期研究任务。</p>
<p>默认情况下，Deep Agents 使用<code translate="no">StateBackend</code> ，它只存储单次会话期间的数据。会话结束后，所有数据都会被清除。这意味着它无法支持长期、跨会话记忆。</p>
<p>为了实现持久记忆，我们将<a href="https://milvus.io/"><strong>Milvus</strong></a>与<code translate="no">StoreBackend</code> 一起用作向量数据库。工作原理如下：重要的对话内容和工具结果会被转换成 Embeddings（表示意义的数字向量）并存储在 Milvus 中。当新任务开始时，Agent 会执行语义搜索，检索相关的过往记忆。这样，Agent 就能 "记住 "以前会话中的相关信息。</p>
<p>Milvus 的计算-存储分离架构非常适合这一使用案例。它支持</p>
<ul>
<li><p>横向扩展至数百亿个向量</p></li>
<li><p>高并发查询</p></li>
<li><p>实时数据更新</p></li>
<li><p>大规模系统的生产就绪部署</p></li>
</ul>
<p>从技术上讲，Deep Agents 使用<code translate="no">CompositeBackend</code> 将不同路径路由到不同的存储后端：</p>
<table>
<thead>
<tr><th>路径</th><th>后端</th><th>目的</th></tr>
</thead>
<tbody>
<tr><td>/workspace/、/temp/</td><td>状态后端</td><td>会话结束后清除的临时数据</td></tr>
<tr><td>/memories/、/knowledge/</td><td>存储后端 + Milvus</td><td>持久数据，可跨会话搜索</td></tr>
</tbody>
</table>
<p>通过这种设置，开发人员只需在<code translate="no">/memories/</code> 等路径下保存长期数据。系统会自动处理跨会话内存。详细配置步骤见下文。</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">实际操作：使用 Milvus 和深度代理构建具有长期记忆的人工智能代理<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>本示例展示了如何使用 Milvus 赋予基于 DeepAgents 的代理持久内存。</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">第 1 步：安装依赖项</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">第 2 步：设置内存后台</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
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
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">第 3 步：创建代理</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
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
<p><strong>要点</strong></p>
<ul>
<li><strong>持久路径</strong></li>
</ul>
<p>任何保存在<code translate="no">/memories/</code> 下的文件都将永久保存，并可在不同会话中访问。</p>
<ul>
<li><strong>生产设置</strong></li>
</ul>
<p>本示例使用<code translate="no">InMemoryStore()</code> 进行测试。在生产中，用 Milvus 适配器替换它，以启用可扩展的语义搜索。</p>
<ul>
<li><strong>自动记忆</strong></li>
</ul>
<p>Agents 会自动将研究成果和重要输出保存到<code translate="no">/memories/</code> 文件夹。在以后的任务中，它可以搜索和检索过去的相关信息。</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">内置工具概述<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents 包含多个通过中间件提供的内置工具。它们主要分为三类：</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">任务管理 (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>创建结构化的待办事项列表。每项任务都可以包含描述、优先级和依赖关系。</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>显示当前的待办事项列表，包括已完成和待完成的任务。</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">文件系统工具 (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>列出目录中的文件。必须使用绝对路径（以<code translate="no">/</code> 开头）。</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>读取文件内容。大文件支持<code translate="no">offset</code> 和<code translate="no">limit</code> 。</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>创建或覆盖文件。</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>替换文件中的特定文本。</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>使用模式查找文件，如<code translate="no">**/*.py</code> 查找所有 Python 文件。</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>搜索文件中的文本。</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>在沙箱环境中运行 shell 命令。要求后端支持<code translate="no">SandboxBackendProtocol</code> 。</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">子代理委托 (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>将子任务发送给特定的子 Agents。由您提供子 Agents 名称和任务描述。</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">如何处理工具输出</h3><p>如果工具生成的结果较大，Deep Agents 会自动将其保存到文件中。</p>
<p>例如，如果<code translate="no">internet_search</code> 返回 100KB 的内容，系统会将其保存为类似<code translate="no">/tool_results/internet_search_1.txt</code> 的文件。Agents 在其上下文中只保留文件路径。这样可以减少令牌的使用量，并保持上下文窗口的小尺寸。</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents 与 Agent Builder：何时分别使用？<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>本文主要介绍 DeepAgents，因此了解它与</em><em> LangChain 生态系统中另一个代理构建选项</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder 的</em></a><em>比较也很有帮助</em><em>。</em></p>
<p>LangChain 提供了多种构建人工智能代理的方法，最佳选择通常取决于您对系统的控制程度。</p>
<p><strong>DeepAgents 专为</strong>构建处理长期运行、多步骤任务的自主代理而设计。它能让开发人员完全控制 Agents 如何规划任务、使用工具和管理内存。由于 DeepAgents 基于 LangGraph 构建，因此您可以自定义组件、集成 Python 工具并修改存储后端。这使得 DeepAgents 非常适合可靠性和灵活性都很重要的复杂工作流和生产系统。</p>
<p>相比之下，<strong>Agent Builder</strong> 则更注重易用性。它隐藏了大部分技术细节，因此你可以描述一个 Agents、添加工具并快速运行它。内存、工具使用和人工审批步骤都会自动处理。因此，Agent 生成器适用于快速原型、内部工具或早期实验。</p>
<p><strong>Agent Builder 和 DeepAgents 并不是独立的系统，它们是同一个堆栈的一部分。</strong>Agent Builder 建立在 DeepAgents 的基础之上。许多团队从 Agent Builder 开始测试创意，然后在需要更多控制时切换到 DeepAgents。使用 DeepAgents 创建的工作流程也可以转化为 Agent Builder 模板，以便其他人员轻松重用。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents 通过使用三个主要理念：任务规划、文件存储和子代理授权，使复杂的代理工作流更易于管理。这些机制将杂乱无章的多步骤流程转化为结构化的工作流。当与用于向量搜索的 Milvus 结合使用时，Agents 还能跨会话保持长期记忆。</p>
<p>对于开发人员来说，这意味着更低的令牌成本和更可靠的系统，可以从简单的演示扩展到生产环境。</p>
<p>如果您正在构建需要结构化工作流和真正长期记忆的人工智能代理，我们很乐意与您联系。</p>
<p>对深度代理或使用 Milvus 作为持久内存后端有疑问？加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>，或预约 20 分钟的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>会议，讨论您的用例。</p>
