---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: 人类学技能如何改变 Agents 工具--以及如何为 Milvus 构建自定义技能以快速启动 RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: 了解什么是技能，以及如何在克劳德代码中创建自定义技能，利用可重复使用的工作流程，通过自然语言指令构建由 Milvus 支持的 RAG 系统。
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>工具的使用是 Agents 工作的重要组成部分。Agents 需要选择正确的工具，决定何时调用它，并正确格式化输入。这在纸面上听起来简单明了，但一旦开始构建实际系统，就会发现很多边缘情况和故障模式。</p>
<p>许多团队使用 MCP 风格的工具定义来组织这些工作，但 MCP 有一些粗糙的边缘。该模型必须同时对所有工具进行推理，而且没有太多的结构来指导其决策。此外，每个工具定义都必须放在上下文窗口中。其中有些工具非常庞大--GitHub 的 MCP 约有 26k 标记--这在代理开始实际工作之前就已经占用了上下文。</p>
<p>Anthropic 引入了<a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>技能</strong></a>来改善这种情况。技能更小、更集中、更容易按需加载。你可以将领域逻辑、工作流或脚本打包成紧凑的单元，让 Agents 只在需要时才调入，而不是将所有内容都倒入上下文。</p>
<p>在这篇文章中，我将介绍人类技能的工作原理，然后在克劳德代码中构建一个简单的技能，将自然语言转化为<a href="https://milvus.io/">由 Milvus 支持的</a>知识库--无需额外布线即可快速设置 RAG。</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">什么是人类技能？<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">人类技能</a>（或称 Agents 技能）就是将指令、脚本和参考文件捆绑在一起的文件夹，Agents 需要这些文件来处理特定任务。将它们视为小型、自足的能力包。一项技能可以定义如何生成报告、运行分析或遵循特定的工作流程或规则集。</p>
<p>关键在于技能是模块化的，可以按需加载。Agents 不需要在上下文窗口中塞入大量的工具定义，而只需调入所需的技能。这样既能降低上下文的使用率，又能为模型提供明确的指导，使其了解存在哪些工具、何时调用以及如何执行每个步骤。</p>
<p>这种格式非常简单，因此已经得到了许多开发者工具的支持，或者很容易在它们之间进行调整--如 Claude Code、Cursor、VS Code 扩展、GitHub 集成、Codex 风格的设置等等。</p>
<p>一个技能遵循一致的文件夹结构：</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong> （核心文件）</strong></p>
<p>这是 Agents 的执行指南--告诉代理应该如何准确执行任务的文件。它定义了技能的元数据（如名称、描述和触发关键字）、执行流程和默认设置。在此文件中，您应清楚地描述</p>
<ul>
<li><p><strong>技能应在何时运行：</strong>例如，当用户输入包含 "用 Python 处理 CSV 文件 "这样的短语时触发技能。</p></li>
<li><p><strong>任务应如何执行：</strong>按顺序列出执行步骤，例如：解释用户请求 → 调用<code translate="no">scripts/</code> 目录中的预处理脚本 → 生成所需的代码 → 使用<code translate="no">templates/</code> 中的模板格式化输出。</p></li>
<li><p><strong>规则和约束：</strong>指定编码约定、输出格式和错误处理方式等细节。</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong> （执行脚本）</strong></p>
<p>该目录包含 Python、Shell 或 Node.js 等语言预编写的脚本。Agents 可以直接调用这些脚本，而不是在运行时重复生成相同的代码。典型的例子包括<code translate="no">create_collection.py</code> 和<code translate="no">check_env.py</code> 。</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong> （文档模板）</strong></p>
<p>可重复使用的模板文件，代理可利用它们生成定制内容。常见的例子包括报告模板或配置模板。</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong> （参考资料）</strong></p>
<p>Agents 在执行过程中可以查阅的参考文档，如 API 文档、技术规范或最佳实践指南。</p>
<p>总体而言，这种结构反映了向新队友移交工作的方式：<code translate="no">SKILL.md</code> 解释工作，<code translate="no">scripts/</code> 提供即用工具，<code translate="no">templates/</code> 定义标准格式，<code translate="no">resources/</code> 提供背景信息。有了所有这些，Agent 就能可靠地执行任务，并将猜测减少到最低限度。</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">实践教程：为 Milvus 驱动的 RAG 系统创建自定义技能<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>在本节中，我们将介绍如何创建一个自定义 Skill，它可以设置一个 Milvus Collections，并通过简单的自然语言指令组装一个完整的 RAG 管道。我们的目标是跳过所有常规的设置工作--无需手动设计 Schema、无需索引配置、无需模板代码。你只需告诉 Agents 你想要什么，Agents 就会为你处理 Milvus 的所有工作。</p>
<h3 id="Design-Overview" class="common-anchor-header">设计概述</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">先决条件</h3><table>
<thead>
<tr><th>组件</th><th>要求</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>模型</td><td>GLM 4.7、OpenAI</td></tr>
<tr><td>容器</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>模型配置平台</td><td>CC-Switch</td></tr>
<tr><td>软件包管理器</td><td>npm</td></tr>
<tr><td>开发语言</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">步骤 1：环境设置</h3><p><strong>安装</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>安装 CC-Switch</strong></p>
<p><strong>注：</strong>CC-Switch 是一个模型切换工具，可在本地运行人工智能模型时轻松切换不同的模型 API。</p>
<p>项目库<a href="https://github.com/farion1231/cc-switch">：https://github.com/farion1231/cc-switch</a></p>
<p><strong>选择 Claude 并添加 API 密钥</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>查看当前状态</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>部署并启动 Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>配置 OpenAI API 密钥</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">第 2 步：为 Milvus 创建自定义技能</h3><p><strong>创建目录结构</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>初始化</strong> <code translate="no">SKILL.md</code></p>
<p><strong>注：</strong>SKILL.md 可作为 Agents 的执行指南。它定义了技能的作用和触发方式。</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>编写核心脚本</strong></p>
<table>
<thead>
<tr><th>脚本类型</th><th>文件名</th><th>目的</th></tr>
</thead>
<tbody>
<tr><td>环境检查</td><td><code translate="no">check_env.py</code></td><td>检查 Python 版本、所需依赖和 Milvus 连接。</td></tr>
<tr><td>意图解析</td><td><code translate="no">intent_parser.py</code></td><td>将 "建立 RAG 数据库 "之类的请求转换为结构化的意图，例如<code translate="no">scene=rag</code></td></tr>
<tr><td>创建 Collections</td><td><code translate="no">milvus_builder.py</code></td><td>生成 Collections Schema 和索引配置的核心生成器</td></tr>
<tr><td>数据摄取</td><td><code translate="no">insert_milvus_data.py</code></td><td>加载文档、分块、生成嵌入并将数据写入 Milvus</td></tr>
<tr><td>示例 1</td><td><code translate="no">basic_text_search.py</code></td><td>演示如何创建文档搜索系统</td></tr>
<tr><td>示例 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>演示如何建立一个完整的 RAG 知识库</td></tr>
</tbody>
</table>
<p>这些脚本展示了如何将以 Milvus 为重点的技能转化为实用的东西：一个可运行的文档搜索系统和一个智能问答（RAG）设置。</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">步骤 3：启用技能并运行测试</h3><p><strong>用自然语言描述请求</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>创建 RAG 系统</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>插入样本数据</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>运行查询</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>在本教程中，我们使用自定义技能构建了一个由 Milvus 驱动的 RAG 系统。我们的目的不仅仅是展示调用 Milvus 的另一种方法，而是要展示技能如何将通常需要多步骤、重配置的设置变成可以重复使用和迭代的东西。无需手动定义 Schema、调整索引或拼接工作流代码，技能就能处理大部分模板，让你专注于 RAG 中真正重要的部分。</p>
<p>这仅仅是个开始。一个完整的 RAG 流水线有很多活动部件：预处理、分块、混合搜索设置、Rerankers、评估等等。所有这些都可以打包成独立的 Skills，并根据您的使用情况进行组合。如果你的团队对向量维度、索引参数、提示模板或检索逻辑有内部标准，那么技能就是对这些知识进行编码并使其可重复的简洁方法。</p>
<p>对于新开发人员来说，这降低了入门门槛--不需要在开始运行之前学习 Milvus 的每一个细节。对于有经验的团队来说，这可以减少重复设置，并有助于保持项目在不同环境下的一致性。技能不能取代深思熟虑的系统设计，但它们能消除许多不必要的摩擦。</p>
<p>完整的实现可在<a href="https://github.com/yinmin2020/open-milvus-skills">开源软件库中</a>找到，您还可以在<a href="https://skillsmp.com/">技能市场</a>中探索更多社区构建的示例。</p>
<h2 id="Stay-tuned" class="common-anchor-header">敬请期待！<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>我们还在努力推出涵盖常见 RAG 模式和生产最佳实践的 Milvus 和 Zilliz Cloud 官方技能。如果您有希望得到支持的想法或特定工作流程，请加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>，与我们的工程师交流。如果您希望得到自己设置的指导，可以随时预约<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>会议。</p>
