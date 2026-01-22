---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: 使用 LangSmith Agent Builder + Milvus 在 10 分钟内使用自然语言构建人工智能代理
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  了解如何使用 LangSmith Agent Builder 和 Milvus 在几分钟内构建支持记忆的人工智能
  Agents--无需代码、自然语言、生产就绪。
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>随着人工智能发展的加速，越来越多的团队发现，构建人工智能助手并不一定需要软件工程背景。最需要助手的人--产品团队、操作、支持、研究人员--往往清楚地知道 Agents 应该做什么，却不知道如何用代码实现。传统的 "无代码 "工具试图通过拖放画布来弥补这一差距，然而当你需要真正的代理行为时，它们就会崩溃：多步骤推理、工具使用或持久记忆。</p>
<p>新发布的<a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a>采用了不同的方法。你不需要设计工作流程，而是用简单的语言描述 Agents 的目标和可用工具，然后运行时会处理决策。没有流程图，没有脚本，只有清晰的意图。</p>
<p>但仅有意图并不能生成智能助手。<strong>记忆</strong>才是关键。这就是被广泛采用的开源向量数据库<a href="https://milvus.io/"><strong>Milvus 所</strong></a>提供的基础。通过将文档和对话历史存储为 Embeddings，Milvus 可以让您的 Ag 回忆上下文，检索相关信息，并做出准确的大规模响应。</p>
<p>本指南将介绍如何使用<strong>LangSmith Agent Builder + Milvus 构建</strong>一个生产就绪、支持记忆的人工智能助手，而且无需编写任何代码。</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">什么是 LangSmith Agent Builder 及其工作原理？<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>正如它的名字所示，<a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builder</a>是 LangChain 推出的一款无需编写代码的工具，可让您使用纯语言构建、部署和管理人工智能代理。你无需编写逻辑或设计可视化流程，只需解释 Agents 应该做什么、可以使用什么工具以及应该如何行为。然后，系统会处理难处理的部分--生成提示、选择工具、将组件连接在一起并启用内存。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>与传统的无代码或工作流工具不同，Agent Builder 没有拖放画布，也没有节点库。您与它的交互方式与您与 ChatGPT 的交互方式相同。描述你想创建的内容，回答几个明确的问题，生成器就会根据你的意图生成一个功能完备的 Agents。</p>
<p>在幕后，该代理由四个核心构建模块构成。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>提示：</strong>提示是代理的大脑，它定义了代理的目标、约束条件和决策逻辑。LangSmith Agent Builder 使用元提示来自动构建：你描述你想要什么，它就会问一些明确的问题，然后将你的答案综合成一个详细的、生产就绪的系统提示。您只需表达意图，而无需手写逻辑。</li>
<li><strong>工具：</strong>工具可让 Agents 采取行动--发送电子邮件、发布到 Slack、创建日历事件、搜索数据或调用 API。Agent Builder 通过模型上下文协议（MCP）集成了这些工具，提供了一种安全、可扩展的方式来公开功能。用户可以依靠内置集成或添加自定义 MCP 服务器，包括用于向量搜索和长期记忆的 Milvus<a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">MCP 服务器</a>。</li>
<li><strong>触发器：</strong>触发器定义了代理运行的时间。除手动执行外，您还可以将 Agents 附加到计划或外部事件，使其自动响应消息、电子邮件或 webhook 活动。触发器触发时，Agent Builder 会启动一个新的执行线程并运行代理逻辑，从而实现连续的事件驱动行为。</li>
<li><strong>子代理</strong>子代理将复杂的任务分解成更小、更专业的单元。主代理可以将工作委托给子代理--每个子代理都有自己的提示和工具集--这样，数据检索、汇总或格式化等任务就由专门的助手来处理。这就避免了单个提示符过载，并创建了一个模块化程度更高、可扩展的代理架构。</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">代理如何记住你的偏好？<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>Agent Builder 的独特之处在于它如何处理<em>记忆</em>。代理不会将首选项塞进聊天记录，而是在运行时更新自己的行为规则。如果你说："从现在开始，用一首诗来结束每条 Slack 消息"，Agent 不会将其视为一次性请求，而是将其存储为适用于未来运行的持久首选项。</p>
<p>在引擎盖下，Agent 保存着一个内部存储文件，基本上就是它不断进化的系统提示。每次启动时，它都会读取该文件，以决定如何行动。当你提出更正或限制时，Agent 就会通过添加结构化规则来编辑该文件，比如 "总是用一首振奋人心的短诗来结束简报"。这种方法比依赖对话历史记录要稳定得多，因为 Agents 会主动改写操作符，而不是把你的偏好埋藏在文字记录中。</p>
<p>这种设计来自 DeepAgents 的文件系统中间件（FilesystemMiddleware），但在 Agent Builder 中被完全抽象化了。您永远不会直接接触文件：您用自然语言表达更新，系统会在幕后处理编辑。如果您需要更多控制，可以插入自定义 MCP 服务器，或下放到 DeepAgents 层进行高级内存自定义。</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">实践演示：使用代理生成器在 10 分钟内构建 Milvus 助手<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我们已经介绍了 Agent Builder 背后的设计理念，下面就让我们通过一个实际操作示例来了解完整的构建过程。我们的目标是创建一个智能助手，它可以回答与 Milvus 相关的技术问题，搜索官方文档，并长期记忆用户的偏好。</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">步骤 1.登录 LangChain 网站</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">步骤 2.设置 Anthropic API 密钥</h3><p><strong>注：</strong>默认支持 Anthropic。您也可以使用自定义模型，只要其类型包含在 LangChain 官方支持的列表中即可。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1.添加 API 密钥</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2.输入并保存 API 密钥</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">步骤 3.创建新 Agents</h3><p><strong>注：</strong>单击 "<strong>了解更多</strong>"查看使用文档。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>配置自定义模型（可选）</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) 输入参数并保存</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">步骤 4.描述您的需求以创建 Agents</h3><p><strong>注意：</strong>使用自然语言描述创建 Agents。</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>系统会询问后续问题以完善需求</strong></li>
</ol>
<p>问题 1： 选择希望代理记住的 Milvus 索引类型</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>问题 2：选择代理应如何处理技术问题  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>问题 3：指定代理是否应重点指导特定的 Milvus 版本  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">步骤 5.审查并确认生成的 Agents</h3><p><strong>注意：</strong>系统会自动生成 Agents 配置。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>创建代理之前，可以查看其元数据、工具和提示。一旦一切正常，单击 "<strong>创建 "</strong>继续。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">步骤 6.探索界面和功能区</h3><p>创建代理后，您会在界面左下角看到三个功能区：</p>
<p><strong>(1) 触发器</strong></p>
<p>触发器定义了代理应在何时运行，可以是响应外部事件，也可以是按计划运行：</p>
<ul>
<li><strong>Slack：</strong>当特定频道收到信息时激活代理</li>
<li><strong>Gmail</strong>收到新邮件时触发代理</li>
<li><strong>Cron：</strong>按计划间隔运行 Agents</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) 工具箱</strong></p>
<p>这是代理可以调用的一组工具。在所示示例中，三个工具是在创建过程中自动生成的，您可以单击<strong>添加工具</strong>来添加更多工具。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>如果您的 Agents 需要向量搜索功能--例如在大量技术文档中进行语义搜索--您可以部署 Milvus 的 MCP 服务器</strong>，并使用<strong>MCP</strong>按钮将其添加到这里。确保 MCP 服务器运行<strong>在可到达的网络端点</strong>；否则，Agent Builder 将无法调用它。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) 子代理</strong></p>
<p>创建专用于特定子任务的独立代理模块，实现模块化系统设计。</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">步骤 7.测试代理</h3><p>单击右上角的 "<strong>测试</strong>"进入<strong>测试</strong>模式。以下是测试结果示例。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Agent Builder 与 DeepAgents：您应该选择哪一个？<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain 提供多种代理框架，正确的选择取决于您需要多少控制权。<a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a>是代理构建工具。它用于构建自主、长期运行的人工智能 Agents，以处理复杂的多步骤任务。它基于 LangGraph 构建，支持高级规划、基于文件的上下文管理和子代理协调，非常适合长期或生产级项目。</p>
<p>那么，<strong>Agent Builder</strong> 和<strong>Agent Builder</strong> 相比有何优势？</p>
<p><strong>Agent Builder</strong>注重简单和速度。它抽象化了大部分实施细节，让您可以用自然语言描述 Agents、配置工具并立即运行。内存、工具使用和人机交互工作流都由它代为处理。这使得 Agents Builder 成为快速原型开发、内部工具和早期验证的完美选择，在这些应用中，易用性比细粒度控制更重要。</p>
<p>相比之下，<strong>DeepAgents 专为</strong>需要完全控制内存、执行和基础架构的场景而设计。您可以定制中间件，集成任何 Python 工具，修改存储后端（包括在<a href="https://milvus.io/blog">Milvus</a> 中持久化内存），并明确管理 Agents 的状态图。这样做的代价是工程上的努力--你要自己编写代码、管理依赖关系和处理故障模式，但你会得到一个完全可定制的 Agents 堆栈。</p>
<p>重要的是，<strong>Agent Builder 和 DeepAgents 并不是两个独立的生态系统，它们构成了一个统一体</strong>。Agent Builder 构建在 DeepAgents 之上。这意味着您可以从 Agent Builder 中的快速原型开始，然后在需要更多灵活性时再进入 DeepAgents，而无需从头开始重写一切。反之亦然：在 DeepAgents 中构建的模式可以打包成 Agent Builder 模板，这样非技术用户就可以重复使用它们。</p>
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
    </button></h2><p>得益于人工智能的发展，构建人工智能代理不再需要复杂的工作流程或繁重的工程设计。有了 LangSmith Agent Builder，你只需使用自然语言就能创建有状态的、长期运行的助手。你只需专注于描述 Agents 应该做什么，而系统则负责处理规划、工具执行和持续的内存更新。</p>
<p>与<a href="https://milvus.io/blog">Milvus</a> 搭配使用，这些 Agents 可获得可靠的持久内存，用于语义搜索、偏好跟踪和跨会话的长期上下文。无论您是在验证一个想法，还是在部署一个可扩展的系统，LangSmith Agent Builder 和 Milvus 都能为 Agents 提供一个简单、灵活的基础，让它们不仅能做出响应，还能随着时间的推移不断记忆和改进。</p>
<p>有问题或想深入了解？加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>，或预约 20 分钟的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>课程，获得个性化指导。</p>
