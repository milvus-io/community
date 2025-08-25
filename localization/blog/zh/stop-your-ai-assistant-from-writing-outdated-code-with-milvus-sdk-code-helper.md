---
id: >-
  stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
title: 用 Milvus SDK 代码助手阻止人工智能助理编写过时代码
author: 'Cheney Zhang, Stacy Li'
date: 2025-08-22T00:00:00.000Z
desc: 设置 Milvus SDK 代码助手以阻止人工智能助手生成过时代码并确保最佳实践的分步教程。
cover: >-
  assets.zilliz.com/stop_your_ai_assistant_from_writing_outdated_code_with_milvus_sdk_code_helper_min_64fa8d3396.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus SDK Code Helper, AI coding assistant, MCP server, vibe coding, pymilvus'
meta_title: |
  Milvus SDK Code Helper Tutorial: Fix AI Outdated Code
origin: >-
  https://milvus.io/blog/stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
---
<h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Coding 正在改变我们编写软件的方式。Cursor 和 Windsurf 等工具让开发变得轻松直观--请求一个函数就能得到一个代码片段，需要快速调用 API 就能在输入之前生成。我们的承诺是实现流畅、无缝的开发，让人工智能助手预测你的需求，并准确提供你想要的东西。</p>
<p>但有一个关键的缺陷打破了这一美好的流程：人工智能助手经常会生成过时的代码，而这些代码在生产过程中会出现问题。</p>
<p>请看这个例子：我让 Cursor 生成 Milvus 连接代码，它生成了这个：</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>这在以前可以完美运行，但目前的 pymilvus SDK 建议使用<code translate="no">MilvusClient</code> 进行所有连接和操作。旧方法已不再被认为是最佳实践，但人工智能助手仍在继续建议使用这种方法，因为它们的训练数据往往已经过时数月或数年。</p>
<p>尽管 Vibe Coding 工具取得了长足进步，但开发人员仍然要花费大量时间，在生成的代码和生产就绪的解决方案之间架起 "最后一英里 "的桥梁。氛围是有了，但准确性却没有。</p>
<h3 id="What-is-the-Milvus-SDK-Code-Helper" class="common-anchor-header">Milvus SDK 代码助手是什么？</h3><p><strong>Milvus SDK 代码助手</strong>是一个以开发人员为中心的解决方案，它解决了 Vibe Coding 中的<em>"最后一英里 "</em>问题--缩小了人工智能辅助编码与可投入生产的 Milvus 应用程序之间的差距。</p>
<p>它的核心是一个<strong>模型上下文协议（MCP）服务器</strong>，可将人工智能驱动的集成开发环境直接连接到最新的 Milvus 官方文档。它与检索增强生成（RAG）相结合，可确保您的助手生成的代码始终准确、最新，并与 Milvus 最佳实践保持一致。</p>
<p>在您的开发工作流中，您将获得上下文感知、符合标准的代码建议，而不是过时的代码片段或猜测。</p>
<p><strong>主要优势：</strong></p>
<ul>
<li><p><strong>一次配置，永久提高效率</strong>：一次设置，持续更新代码生成</p></li>
<li><p><strong>始终保持最新</strong>：访问最新的 Milvus SDK 官方文档</p></li>
<li><p><strong>提高代码质量</strong>：生成遵循当前最佳实践的代码</p></li>
<li><p>🌊<strong>恢复流程</strong>：保持流畅的 Vibe Coding 体验</p></li>
</ul>
<p><strong>三工具合一</strong></p>
<ol>
<li><p><code translate="no">pymilvus-code-generator</code> → 为常见的 Milvus 任务（如创建 Collections、插入数据、运行向量搜索）快速编写 Python 代码。</p></li>
<li><p><code translate="no">orm-client-code-converter</code> → 用最新的 语法取代过时的 ORM 模式，从而使传统的 Python 代码现代化。<code translate="no">MilvusClient</code> </p></li>
<li><p><code translate="no">language-translator</code> → 在不同语言（如 Python ↔ TypeScript）之间无缝转换 Milvus SDK 代码。</p></li>
</ol>
<p>查看以下资源，了解更多详情：</p>
<ul>
<li><p>博客：<a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">为什么您的 Vibe 编码会生成过时的代码，以及如何使用 Milvus MCP 修复它 </a></p></li>
<li><p>文档：<a href="https://milvus.io/docs/milvus-sdk-helper-mcp.md#Quickstart">Milvus SDK 代码助手指南 | Milvus 文档</a></p></li>
</ul>
<h3 id="Before-You-Begin" class="common-anchor-header">开始之前</h3><p>在深入了解设置过程之前，让我们来看看代码助手在实践中带来的巨大变化。下面的对比显示了创建 Milvus Collections 的相同请求如何产生完全不同的结果：</p>
<table>
<thead>
<tr><th><strong>启用 MCP 代码助手</strong></th><th><strong>禁用 MCP 代码助手：</strong></th></tr>
</thead>
<tbody>
<tr><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_enabled_fcb94737fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_disabled_769db4faee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td></tr>
</tbody>
</table>
<p>这完美地说明了核心问题：如果没有代码助手，即使是最先进的人工智能助手也会使用过时的 ORM SDK 模式生成代码，而这些模式已不再被推荐使用。代码助手可确保您每次都能获得最新、最高效和官方认可的实现。</p>
<p><strong>实践中的差异：</strong></p>
<ul>
<li><p><strong>现代方法</strong>：使用当前的最佳实践编写简洁、可维护的代码</p></li>
<li><p><strong>过时的方法</strong>：可运行但遵循过时模式的代码</p></li>
<li><p><strong>对生产的影响</strong>：当前代码更高效、更易维护、面向未来</p></li>
</ul>
<p>本指南将指导您在多个人工智能集成开发环境和开发环境中设置 Milvus SDK 代码助手。设置过程简单明了，每个集成开发环境通常只需几分钟。</p>
<h2 id="Setting-Up-the-Milvus-SDK-Code-Helper" class="common-anchor-header">设置 Milvus SDK 代码助手<button data-href="#Setting-Up-the-Milvus-SDK-Code-Helper" class="anchor-icon" translate="no">
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
    </button></h2><p>以下各节为每个支持的集成开发环境和开发环境提供了详细的设置说明。请选择与您的首选开发设置相对应的部分。</p>
<h3 id="Cursor-IDE-Setup" class="common-anchor-header">光标集成开发环境设置</h3><p>Cursor 通过其内置配置系统提供与 MCP 服务器的无缝集成。</p>
<p><strong>第 1 步：访问 MCP 设置</strong></p>
<p>导航至设置 → Cursor 设置 → 工具与集成 → 添加新的全局 MCP 服务器</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cursor_mcp_configuration_interface_9ff0b7dcb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
<em>光标 MCP 配置界面</em></p>
<p><strong>第 2 步：配置 MCP 服务器</strong></p>
<p>有两个配置选项：</p>
<p><strong>选项 A：全局配置（推荐）</strong></p>
<p>在 Cursor<code translate="no">~/.cursor/mcp.json</code> 文件中添加以下配置：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>选项 B：特定项目配置</strong></p>
<p>在项目文件夹中创建<code translate="no">.cursor/mcp.json</code> 文件，配置与上述相同。</p>
<p>有关其他配置选项和故障排除，请参阅<a href="https://docs.cursor.com/context/model-context-protocol"> Cursor MCP 文档</a>。</p>
<h3 id="Claude-Desktop-Setup" class="common-anchor-header">克劳德桌面设置</h3><p>Claude Desktop 通过其配置系统提供直接的 MCP 集成。</p>
<p><strong>第 1 步：找到配置文件</strong></p>
<p>将以下配置添加到 Claude Desktop 配置文件中：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 2 步：重启 Claude Desktop</strong></p>
<p>保存配置后，重启 Claude Desktop 以激活新的 MCP 服务器。</p>
<h3 id="Claude-Code-Setup" class="common-anchor-header">克劳德代码设置</h3><p>Claude Code 为 MCP 服务器提供命令行配置，非常适合喜欢基于终端设置的开发人员。</p>
<p><strong>步骤 1：通过命令行添加 MCP 服务器</strong></p>
<p>在终端中执行以下命令：</p>
<pre><code translate="no">claude mcp add-json sdk-code-helper --json &#x27;{
  &quot;url&quot;: &quot;https://sdk.milvus.io/mcp/&quot;,
  &quot;headers&quot;: {
    &quot;Accept&quot;: &quot;text/event-stream&quot;
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 2 步：验证安装</strong></p>
<p>运行该命令后，MCP 服务器将立即自动配置并准备就绪。</p>
<h3 id="Windsurf-IDE-Setup" class="common-anchor-header">Windsurf IDE 设置</h3><p>Windsurf 通过基于 JSON 的设置系统支持 MCP 配置。</p>
<p><strong>第 1 步：访问 MCP 设置</strong></p>
<p>将以下配置添加到 Windsurf MCP 设置文件中：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步骤 2：应用配置</strong></p>
<p>保存设置文件并重启 Windsurf 以激活 MCP 服务器。</p>
<h3 id="VS-Code-Setup" class="common-anchor-header">VS 代码设置</h3><p>VS Code 集成需要 MCP 兼容扩展才能正常运行。</p>
<p><strong>步骤 1：安装 MCP 扩展</strong></p>
<p>确保在 VS Code 中安装了 MCP 兼容扩展。</p>
<p><strong>第 2 步：配置 MCP 服务器</strong></p>
<p>在 VS Code MCP 设置中添加以下配置：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Cherry-Studio-Setup" class="common-anchor-header">Cherry Studio 设置</h3><p>Cherry Studio 为 MCP 服务器配置提供了用户友好的图形界面，使喜欢可视化设置过程的开发人员可以访问它。</p>
<p><strong>步骤 1：访问 MCP 服务器设置</strong></p>
<p>通过 Cherry Studio 界面导航至设置 → MCP 服务器 → 添加服务器。</p>
<p><strong>第 2 步：配置服务器详细信息</strong></p>
<p>在服务器配置表中填写以下信息：</p>
<ul>
<li><p><strong>名称</strong>：<code translate="no">sdk code helper</code></p></li>
<li><p><strong>类型</strong>：<code translate="no">Streamable HTTP</code></p></li>
<li><p><strong>URL</strong>：<code translate="no">https://sdk.milvus.io/mcp/</code></p></li>
<li><p><strong>标题</strong> <code translate="no">&quot;Accept&quot;: &quot;text/event-stream&quot;</code></p></li>
</ul>
<p><strong>步骤 3：保存并激活</strong></p>
<p>单击保存激活服务器配置。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cherry_studio_mcp_configuration_interface_b7dce8b26d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Cherry Studio MCP 配置界面</em></p>
<h3 id="Cline-Setup" class="common-anchor-header">Cline 设置</h3><p>Cline 使用基于 JSON 的配置系统，可通过其界面访问。</p>
<p><strong>第 1 步：访问 MCP 设置</strong></p>
<ol>
<li><p>打开 Cline，点击顶部导航栏中的 MCP 服务器图标</p></li>
<li><p>选择 "已安装 "选项卡</p></li>
<li><p>单击高级 MCP 设置</p></li>
</ol>
<p><strong>第 2 步：编辑配置文件</strong>在<code translate="no">cline_mcp_settings.json</code> 文件中，添加以下配置：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 3 步：保存并重新启动</strong></p>
<p>保存配置文件并重新启动 Cline 以应用更改。</p>
<h3 id="Augment-Setup" class="common-anchor-header">Augment 设置</h3><p>Augment 可通过高级设置面板访问 MCP 配置。</p>
<p><strong>第 1 步：访问设置</strong></p>
<ol>
<li><p>按 Cmd/Ctrl + Shift + P 或导航至 Augment 面板中的汉堡包菜单</p></li>
<li><p>选择 "编辑设置</p></li>
<li><p>在高级下，单击 settings.json 中的编辑</p></li>
</ol>
<p><strong>第 2 步：添加服务器配置</strong></p>
<p>将服务器配置添加到<code translate="no">augment.advanced</code> 对象中的<code translate="no">mcpServers</code> 数组：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Gemini-CLI-Setup" class="common-anchor-header">双子座 CLI 设置</h3><p>Gemini CLI 需要通过 JSON 设置文件进行手动配置。</p>
<p><strong>第 1 步：创建或编辑设置文件</strong></p>
<p>在系统上创建或编辑<code translate="no">~/.gemini/settings.json</code> 文件。</p>
<p><strong>第 2 步：添加配置</strong></p>
<p>将以下配置插入设置文件：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 3 步：应用更改</strong></p>
<p>保存文件并重启 Gemini CLI 以应用配置更改。</p>
<h3 id="Roo-Code-Setup" class="common-anchor-header">Roo 代码设置</h3><p>Roo 代码使用集中式 JSON 配置文件管理 MCP 服务器。</p>
<p><strong>步骤 1：访问全局配置</strong></p>
<ol>
<li><p>打开 Roo 代码</p></li>
<li><p>导航至设置 → MCP 服务器 → 编辑全局配置</p></li>
</ol>
<p><strong>步骤 2：编辑配置文件</strong></p>
<p>在<code translate="no">mcp_settings.json</code> 文件中，添加以下配置：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>第 3 步：激活服务器</strong></p>
<p>保存文件以自动激活 MCP 服务器。</p>
<h3 id="Verification-and-Testing" class="common-anchor-header">验证和测试</h3><p>完成所选集成开发环境的设置后，可以通过以下方式验证 Milvus SDK 代码助手是否正常工作：</p>
<ol>
<li><p><strong>测试代码生成</strong>：要求人工智能助手生成与 Milvus 相关的代码，并观察其是否使用了当前的最佳实践。</p></li>
<li><p><strong>检查文档访问</strong>：请求有关特定 Milvus 功能的信息，以确保助手提供最新响应</p></li>
<li><p><strong>比较结果</strong>：在有人工智能助手和没有人工智能助手的情况下生成相同的代码请求，以观察质量和最新性方面的差异。</p></li>
</ol>
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
    </button></h2><p>通过设置 Milvus SDK 代码助手，您已经向未来开发迈出了关键的一步--人工智能助手生成的不仅是快速代码，而且是<strong>准确、最新的代码</strong>。我们正在转向动态、实时的知识系统，而不是依赖于过时的静态训练数据。</p>
<p>随着人工智能编码助手变得越来越复杂，具备最新知识的工具与不具备最新知识的工具之间的差距只会越来越大。Milvus SDK 代码助手只是一个开端--我们期待看到针对其他主要技术和框架的类似专业化知识服务器。未来属于那些既能利用人工智能的速度，又能确保准确性和时效性的开发人员。现在，您已经具备了这两方面的能力。</p>
