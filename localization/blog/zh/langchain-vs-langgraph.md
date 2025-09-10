---
id: langchain-vs-langgraph.md
title: LangChain vs LangGraph：开发人员选择人工智能框架指南
author: Min Yin
date: 2025-09-09T00:00:00.000Z
desc: 比较适用于 LLM 应用程序的 LangChain 和 LangGraph。看看它们在架构、状态管理和用例方面有何不同，以及何时使用。
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
<p>在使用大型语言模型 (LLM) 构建时，您所选择的框架会对您的开发体验产生巨大影响。一个好的框架可以简化工作流程、减少模板，并使从原型到生产的转变更加容易。不合适的框架则会适得其反，增加摩擦和技术债务。</p>
<p>目前最流行的两种选择是<a href="https://python.langchain.com/docs/introduction/"><strong>LangChain</strong></a>和<a href="https://langchain-ai.github.io/langgraph/"><strong>LangGraph</strong></a>，它们都是开源的，由 LangChain 团队创建。LangChain 专注于组件协调和工作流自动化，非常适合检索增强生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（RAG</a>）等常见用例。LangGraph 建立在 LangChain 的基础之上，采用基于图的架构，更适合有状态应用、复杂决策和多 Agents 协调。</p>
<p>在本指南中，我们将并列比较这两个框架：它们的工作原理、优势以及最适合的项目类型。最后，您将更清楚地了解哪个框架最符合您的需求。</p>
<h2 id="LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="common-anchor-header">LangChain：你的组件库和 LCEL 协调能力<button data-href="#LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langchain"><strong>LangChain</strong></a>是一个开源框架，旨在让构建 LLM 应用程序变得更易于管理。您可以将其视为模型（例如 OpenAI 的<a href="https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md">GPT-5</a>或 Anthropic 的<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude</a>）与实际应用程序之间的中间件。它的主要工作是帮助您将提示、外部 API、<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>和自定义业务逻辑等所有活动部件<em>串联起来</em>。</p>
<p>以 RAG 为例。LangChain 为您提供了现成的抽象概念，可将 LLM 与向量存储（如<a href="https://milvus.io/">Milvus</a>或<a href="https://zilliz.com/cloud">Zilliz Cloud</a>）连接起来，运行语义搜索，并将结果反馈到您的提示符中，而无需从头开始连接一切。除此之外，它还为提示模板、可调用工具的 Agents 以及可保持复杂工作流可维护性的协调层提供了实用工具。</p>
<p><strong>是什么让 LangChain 脱颖而出？</strong></p>
<ul>
<li><p><strong>丰富的组件库</strong>--文档加载器、文本分割器、向量存储连接器、模型接口等。</p></li>
<li><p><strong>LCEL（LangChain 表达式语言）协调</strong>--以声明的方式混合和匹配组件，减少模板。</p></li>
<li><p><strong>易于集成</strong>--可与应用程序接口、数据库和第三方工具顺利协作。</p></li>
<li><p><strong>成熟的生态系统</strong>--强大的文档、示例和活跃的社区。</p></li>
</ul>
<h2 id="LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="common-anchor-header">LangGraph：有状态 Agents 系统的必备工具<button data-href="#LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langgraph">LangGraph</a>是 LangChain 的专门扩展，专注于有状态应用程序。你可以将工作流定义为由节点和边组成的图形--本质上就是一个状态机，而不是以线性脚本的形式编写。每个节点代表一个动作（如调用 LLM、查询数据库或检查条件），而边则根据结果定义流程的移动方式。这种结构可以更轻松地处理循环、分支和重试，而不会让代码变成纠缠不清的 if/else 语句。</p>
<p>这种方法尤其适用于高级用例，如副驾驶和<a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">自主代理</a>。这些系统通常需要跟踪内存、处理意外结果或动态决策。通过将逻辑显式地建模为图形，LangGraph 使这些行为更加透明和可维护。</p>
<p><strong>LangGraph 的核心功能包括</strong></p>
<ul>
<li><p><strong>基于图形的架构</strong>--本地支持循环、回溯和复杂的控制流。</p></li>
<li><p><strong>状态管理</strong>--集中的状态可确保跨步骤保留上下文。</p></li>
<li><p><strong>多 Agents 支持</strong>--适用于多个 Agents 协作或协调的场景。</p></li>
<li><p><strong>调试工具</strong>--通过 LangSmith Studio 进行可视化和调试，以跟踪图的执行。</p></li>
</ul>
<h2 id="LangChain-vs-LangGraph-Technical-Deep-Dive" class="common-anchor-header">LangChain 与 LangGraph：技术深度剖析<button data-href="#LangChain-vs-LangGraph-Technical-Deep-Dive" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Architecture" class="common-anchor-header">架构</h3><p>LangChain 使用<strong>LCEL（LangChain 表达式语言）</strong>在线性流水线中将组件连接在一起。它具有声明性、可读性，非常适合 RAG 这样的简单工作流。</p>
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
<p>LangGraph 采用了一种不同的方法：工作流是以<strong>节点和边的图形</strong>来表达的。每个节点定义一个动作，而图引擎则管理状态、分支和重试。</p>
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
<p>LCEL 提供的是简洁的线性流水线，而 LangGraph 本身支持循环、分支和条件流。这使得它更适合<strong>类似 Agents 的系统</strong>或不遵循直线的多步骤交互。</p>
<h3 id="State-Management" class="common-anchor-header">状态管理</h3><ul>
<li><p><strong>LangChain</strong>使用内存组件传递上下文。适用于简单的多轮对话或线性工作流。</p></li>
<li><p><strong>LangGraph</strong>使用集中式状态系统，支持回滚、回溯和详细历史记录。对于需要保持上下文连续性的长期运行的有状态应用程序来说，这是必不可少的。</p></li>
</ul>
<h3 id="Execution-Models" class="common-anchor-header">执行模型</h3><table>
<thead>
<tr><th><strong>特点</strong></th><th><strong>LangChain</strong></th><th><strong>LangGraph</strong></th></tr>
</thead>
<tbody>
<tr><td>执行模式</td><td>线性协调</td><td>有状态（图）执行</td></tr>
<tr><td>循环支持</td><td>有限支持</td><td>本地支持</td></tr>
<tr><td>条件分支</td><td>通过 RunnableMap 实现</td><td>本地支持</td></tr>
<tr><td>异常处理</td><td>通过 RunnableBranch 实现</td><td>内置支持</td></tr>
<tr><td>错误处理</td><td>链式传输</td><td>节点级处理</td></tr>
</tbody>
</table>
<h2 id="Real-World-Use-Cases-When-to-Use-Each" class="common-anchor-header">实际应用案例：何时使用每种框架<button data-href="#Real-World-Use-Cases-When-to-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p>架构并不只是架构，它们在不同的情况下会有不同的表现。所以真正的问题是：什么时候应该使用 LangChain，什么时候使用 LangGraph 更有意义？让我们来看看一些实际应用场景。</p>
<h3 id="When-LangChain-Is-Your-Best-Choice" class="common-anchor-header">什么时候 LangChain 是您的最佳选择</h3><h4 id="1-Straightforward-Task-Processing" class="common-anchor-header">1.简单的任务处理</h4><p>如果您需要将输入转化为输出，而不需要大量的状态跟踪或分支逻辑，那么 LangChain 将是您的最佳选择。例如，翻译选定文本的浏览器扩展：</p>
<pre><code translate="no"><span class="hljs-comment"># Implementing simple text translation using LCEL</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Translate the following text to English: {text}&quot;</span>)
model = ChatOpenAI()
chain = prompt | model

result = chain.invoke({<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Hello, World!&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>在这种情况下，不需要内存、重试或多步推理，只需要高效的输入输出转换。LangChain 能让代码保持简洁，重点突出。</p>
<h4 id="2-Foundation-Components" class="common-anchor-header">2.基础组件</h4><p>LangChain 提供丰富的基础组件，可作为构建更复杂系统的构件。即使团队使用 LangGraph 构建系统，他们也经常依赖 LangChain 的成熟组件。该框架提供</p>
<ul>
<li><p><strong>向量存储连接器</strong>--用于 Milvus 和 Zilliz Cloud 等数据库的统一接口。</p></li>
<li><p><strong>文档加载器和分割器</strong>--用于 PDF、网页和其他内容。</p></li>
<li><p><strong>模型接口</strong>--为常用的 LLMs 提供标准化封装。</p></li>
</ul>
<p>这使得 LangChain 不仅是一个工作流程工具，也是大型系统的可靠组件库。</p>
<h3 id="When-LangGraph-Is-the-Clear-Winner" class="common-anchor-header">当 LangGraph 明显胜出时</h3><h4 id="1-Sophisticated-Agent-Development" class="common-anchor-header">1.复杂的 Agents 开发</h4><p>在构建需要循环、分支和适应的高级 Agents 系统时，LangGraph 会表现出色。下面是一个简化的 Agents 模式：</p>
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
<p><strong>示例：GitHub Copilot X</strong>GitHub Copilot X 的高级功能完美展示了 LangGraph 的代理架构。该系统能理解开发人员的意图，将复杂的编程任务分解为可管理的步骤，依次执行多个操作，从中间结果中学习，并根据沿途的发现调整方法。</p>
<h4 id="2-Advanced-Multi-Turn-Conversation-Systems" class="common-anchor-header">2.先进的多轮对话系统</h4><p>LangGraph 的状态管理功能使其非常适合构建复杂的多轮对话系统：</p>
<ul>
<li><p><strong>客户服务系统</strong>：能够跟踪对话历史、理解上下文并提供连贯的回应</p></li>
<li><p><strong>教育辅导系统</strong>：根据学生的回答历史记录调整教学策略</p></li>
<li><p><strong>面试模拟系统</strong>：根据候选人的回答调整面试问题</p></li>
</ul>
<p><strong>举例说明</strong>Duolingo 的人工智能辅导系统完美地展示了这一点。该系统会持续分析每个学习者的回答模式，找出具体的知识差距，跟踪多个课程的学习进度，并提供个性化的语言学习体验，以适应个人的学习风格、进度偏好和困难领域。</p>
<h4 id="3-Multi-Agent-Collaboration-Ecosystems" class="common-anchor-header">3.多 Agents 协作生态系统</h4><p>LangGraph 本机支持多代理协调的生态系统。例如</p>
<ul>
<li><p><strong>团队协作模拟</strong>：多个角色协作完成复杂任务</p></li>
<li><p><strong>辩论系统</strong>：持有不同观点的多个角色参与辩论</p></li>
<li><p><strong>创意协作平台</strong>：来自不同专业领域的智能 Agents 共同创作</p></li>
</ul>
<p>这种方法在药物发现等研究领域大有可为，在这些领域中，Agents 可为不同专业领域建模，并将结果组合成新的见解。</p>
<h3 id="Making-the-Right-Choice-A-Decision-Framework" class="common-anchor-header">做出正确的选择：决策框架</h3><table>
<thead>
<tr><th><strong>项目特点</strong></th><th><strong>推荐框架</strong></th><th><strong>为什么</strong></th></tr>
</thead>
<tbody>
<tr><td>简单的一次性任务</td><td>LangChain</td><td>LCEL 协调简单直观</td></tr>
<tr><td>文本翻译/优化</td><td>LangChain</td><td>无需复杂的状态管理</td></tr>
<tr><td>Agents 系统</td><td>LangGraph</td><td>强大的状态管理和控制流</td></tr>
<tr><td>多轮对话系统</td><td>LangGraph</td><td>状态跟踪和上下文管理</td></tr>
<tr><td>多代理协作</td><td>LangGraph</td><td>本机支持多节点交互</td></tr>
<tr><td>需要使用工具的系统</td><td>LangGraph</td><td>灵活的工具调用流程控制</td></tr>
</tbody>
</table>
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
    </button></h2><p>在大多数情况下，LangChain 和 LangGraph 是互补而非竞争关系。LangChain 为您提供了组件和 LCEL 协调的坚实基础，非常适合快速原型、无状态任务或只需简洁输入输出流的项目。当您的应用超出了线性模型的范围，需要状态、分支或多个 Agents 协同工作时，LangGraph 就会介入。</p>
<ul>
<li><p>如果您的重点是文本翻译、文档处理或数据转换等简单任务，那么请<strong>选择 LangChain</strong>，因为在这些任务中，每个请求都是独立存在的。</p></li>
<li><p>如果您正在构建多轮对话、Agent 系统或协作式 Agents 生态系统，那么请<strong>选择 LangGraph</strong>，因为在这些系统中，上下文和决策非常重要。</p></li>
<li><p><strong>两者混合使用</strong>，效果更佳。许多生产系统都是从 LangChain 的组件（文档加载器、向量存储连接器、模型接口）开始，然后添加 LangGraph 来管理有状态的、图形驱动的逻辑。</p></li>
</ul>
<p>归根结底，与其说是追赶潮流，不如说是根据项目的真正需求调整框架。在活跃社区和强大文档的推动下，这两个生态系统都在快速发展。无论您是使用 Milvus 构建第一个 RAG 流水线，还是协调复杂的多 Agents 系统，通过了解各自的适用范围，您就能更好地设计可扩展的应用程序。</p>
