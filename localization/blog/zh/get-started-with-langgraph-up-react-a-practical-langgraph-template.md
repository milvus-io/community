---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 开始使用 langgraph-up-react：实用的 LangGraph 模板
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: 介绍用于 ReAct Agents 的即用型 LangGraph + ReAct 模板--langgraph-up-react。
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
<p>Agents 正在成为应用人工智能的核心模式。越来越多的项目正在超越单一提示，将模型连接到决策循环中。这是令人兴奋的，但这也意味着要管理状态、协调工具、处理分支和添加人工切换--这些都不是一目了然的。</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a>是这一层的最佳选择。它是一个人工智能框架，提供了循环、条件、持久性、人在循环中的控制和流--这些结构足以将一个想法变成一个真正的多 Agents 应用程序。不过，LangGraph 的学习曲线非常陡峭。它的文档更新很快，抽象概念需要时间来适应，从一个简单的演示跳到感觉像产品的东西可能会令人沮丧。</p>
<p>最近，我开始使用<a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react - 一种</strong></a>用于 ReAct Agents 的即用型 LangGraph + ReAct 模板。它可以减少设置，提供合理的默认设置，让你专注于行为而不是模板。在本篇文章中，我将介绍如何使用该模板开始使用 LangGraph。</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">了解 ReAct 代理<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解模板本身之前，我们不妨先了解一下我们将要构建的代理类型。当今最常见的模式之一是<strong>ReAct（Reason + Act）</strong>框架，该框架在谷歌 2022 年的论文<em>《</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct</em></a>》中首次提出：<a href="https://arxiv.org/abs/2210.03629"><em>语言模型中推理与行动的协同</em></a><em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>中首次提出。</em></a></p>
<p>这个框架的理念很简单：ReAct 并非将推理和行动分开处理，而是将两者结合成一个反馈回路，这看起来很像人类解决问题的过程。Agents 对问题进行<strong>推理</strong>，通过调用工具或应用程序接口<strong>采取行动</strong>，然后<strong>观察</strong>结果，再决定下一步该怎么做。这种简单的循环--推理→行动→观察--让代理可以动态地调整，而不是按照固定的脚本行事。</p>
<p>以下是这些环节的组合方式：</p>
<ul>
<li><p><strong>原因</strong>：该模型将问题分解为多个步骤，规划策略，甚至可以在中途纠正错误。</p></li>
<li><p><strong>行动</strong>：根据推理，Agents 调用工具--无论是搜索引擎、计算器，还是你自己的自定义 API。</p></li>
<li><p><strong>观察</strong>：Agents 查看工具的输出，过滤结果，并将其反馈到下一轮推理中。</p></li>
</ul>
<p>这一循环已迅速成为现代人工智能 Agents 的支柱。你会在 ChatGPT 插件、RAG 管道、智能助手甚至机器人中看到它的踪迹。在我们的案例中，它是<code translate="no">langgraph-up-react</code> 模板的基础。</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">了解 LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我们已经了解了 ReAct 模式，那么下一个问题就是：如何在实践中真正实现这样的模式？开箱即用的大多数语言模型都不能很好地处理多步骤推理。每次调用都是无状态的：模型生成一个答案，一旦完成就会忘记一切。这样就很难将中间结果向前推进，或根据先前的结果调整后面的步骤。</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a>弥补了这一缺陷。它不再将每次提示都视为一次性的，而是提供了一种将复杂任务分解为多个步骤的方法，记住每个步骤发生了什么，并根据当前状态决定下一步该做什么。换句话说，它把 Agents 的推理过程变成了结构化、可重复的东西，而不是一连串的临时提示。</p>
<p>你可以把它想象成<strong>人工智能推理的流程图</strong>：</p>
<ul>
<li><p><strong>分析</strong>用户查询</p></li>
<li><p><strong>选择</strong>合适的工具</p></li>
<li><p>调用工具<strong>执行</strong>任务</p></li>
<li><p><strong>处理结果</strong></p></li>
<li><p><strong>检查</strong>任务是否完成；如果未完成，则返回并继续推理</p></li>
<li><p><strong>输出</strong>最终答案</p></li>
</ul>
<p>在此过程中，LangGraph 会处理<strong>内存存储</strong>，这样就不会丢失之前步骤的结果，它还能与<strong>外部工具库</strong>（API、数据库、搜索、计算器、文件系统等）集成。</p>
<p>这就是它被称为<em>LangGraph</em> 的原因：<strong>Lang（语言）+ Graph--一种</strong>组织语言模型如何随时间思考和行动的框架。</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">了解 LangGraph 向上反应<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph 功能强大，但也有开销。设置状态管理、设计节点和边沿、处理错误以及在模型和工具中布线都需要时间。调试多步骤流程也很痛苦--当出现故障时，问题可能出在任何节点或转换中。随着项目的发展，即使是很小的改动也会在代码库中产生连锁反应，导致一切进展缓慢。</p>
<p>这就是成熟模板的巨大作用。模板为您提供了成熟的结构、预置工具和脚本，而不是从零开始。您可以跳过模板，直接专注于 Agents 逻辑。</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a>就是这样一个模板。它旨在帮助您快速创建 LangGraph ReAct Agents 代理，其中包括</p>
<ul>
<li><p><strong>内置工具生态系统</strong>：开箱即用的适配器和实用程序</p></li>
<li><p><strong>⚡快速启动</strong>：简单配置，几分钟内就能创建可运行的 Agents</p></li>
<li><p>🧪<strong>包括测试</strong>：单元测试和集成测试，让您在扩展时更有信心</p></li>
<li><p>📦<strong>生产就绪设置</strong>：架构模式和脚本可节省部署时间</p></li>
</ul>
<p>简而言之，它处理了模板问题，因此您可以专注于构建能真正解决业务问题的 Agents。</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">开始使用 langgraph-up-react 模板<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>运行模板非常简单。以下是逐步设置过程：</p>
<ol>
<li>安装环境依赖项</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>克隆项目</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>安装依赖项</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>配置环境</li>
</ol>
<p>复制示例配置并添加你的密钥：</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>编辑 .env，设置至少一个模型提供者和你的 Tavily API 密钥：</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>启动项目</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>现在，你的开发服务器已经启动，可以进行测试了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">使用 langgraph-up-react 可以构建什么？<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>模板启动并运行后，你能做些什么呢？下面有两个具体示例展示了如何将其应用到实际项目中。</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">企业知识库问答（Agentic RAG）</h3><p>常见的使用案例是公司知识的内部问答助手。想想产品手册、技术文档、常见问题--有用但分散的信息。使用<code translate="no">langgraph-up-react</code> ，您可以创建一个代理，在<a href="https://milvus.io/"><strong>Milvus</strong></a>向量数据库中索引这些文档，检索最相关的段落，并根据上下文生成准确的答案。</p>
<p>在部署方面，Milvus 提供了灵活的选项：<strong>Lite</strong>用于快速原型开发，<strong>Standalone</strong>用于中型生产工作负载，<strong>Distributed</strong>用于企业级系统。您还需要调整索引参数（如 HNSW），以平衡速度和准确性，并设置对延迟和召回的监控，以确保系统在负载情况下保持可靠。</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">多 Agents 协作</h3><p>另一个强大的用例是多 Agents 协作。与其让一个代理尝试做所有的事情，不如定义几个专门的代理来协同工作。例如，在软件开发工作流中，产品经理 Agents 负责分解需求，架构师 Agents 负责起草设计，开发人员 Agents 负责编写代码，测试人员 Agents 负责验证结果。</p>
<p>这种协调突出了 LangGraph 的优势--状态管理、分支和跨 Agents 协调。我们将在以后的文章中更详细地介绍这种设置，但关键的一点是，<code translate="no">langgraph-up-react</code> ，无需在脚手架上花费数周时间，就能实用地尝试这些模式。</p>
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
    </button></h2><p>构建可靠的 Agents 不仅仅需要巧妙的提示--还需要构建推理、管理状态，并将所有内容连接到一个可以实际维护的系统中。LangGraph 为您提供了实现这一点的框架，而<code translate="no">langgraph-up-react</code> 则通过处理模板降低了门槛，让您可以专注于代理行为。</p>
<p>有了这个模板，您就可以启动知识库问答系统或多 Agents 工作流等项目，而不必在设置中迷失方向。它是一个起点，可以节省时间、避免常见陷阱，并使 LangGraph 的实验更加顺利。</p>
<p>在下一篇文章中，我将深入介绍实践教程--逐步展示如何扩展模板，并使用 LangGraph、<code translate="no">langgraph-up-react</code> 和 Milvus 向量数据库为实际用例构建一个工作代理。敬请期待。</p>
