---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: 使用轻量级 memsearch 插件为克劳德代码添加持久内存
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: 使用 memsearch ccplugin 为克劳德代码提供长期记忆。轻量级、透明的 Markdown 存储，自动语义检索，零标记开销。
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>我们最近构建并开源了<a href="https://github.com/zilliztech/memsearch">memsearch</a>，这是一个独立的、即插即用的长期内存库，可以为任何 Agents 提供持久、透明、可由人工编辑的内存。它使用与 OpenClaw 相同的底层内存架构，只是没有 OpenClaw 堆栈的其他部分。这意味着你可以将它放入任何 Agents 框架（Claude、GPT、Llama、自定义 Agents、工作流引擎），并立即添加可查询的持久内存。<em>(如果你想深入了解 memsearch 的工作原理，我们</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>在这里单独</em></a> <em>写了一篇</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>文章</em></a><em>）。</em></p>
<p>在大多数 Agents 工作流中，memsearch 都能发挥预期的作用。但<strong>Agents 的编码工作</strong>则完全不同。编码过程持续时间长，上下文不断切换，值得保存的信息会在数天或数周内不断积累。这种庞大的信息量和不稳定性暴露了典型的 Ag 记忆系统（包括内存搜索）的弱点。在编码场景中，检索模式各不相同，我们不能简单地按原样重用现有工具。</p>
<p>为了解决这个问题，我们<strong>专门为克劳德代码设计</strong>了一个<strong>持久内存插件</strong>。它位于 memsearch CLI 之上，我们称之为<strong>memsearch ccplugin</strong>。</p>
<ul>
<li>GitHub Repo：<a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/"></a> <em> https://zilliztech.github.io/memsearch/claude-plugin/（开源，MIT 许可）</em></li>
</ul>
<p>有了轻量级的<strong>memsearch ccplugin</strong>在幕后管理内存，克劳德代码就能记住每一次对话、每一个决定、每一种风格偏好以及每一个多日线程--自动索引、完全可搜索、跨会话持久化。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>为清楚起见，本文中的 "ccplugin "指的是"ccplugin "指的是上层，即克劳德代码插件本身。"memsearch "指的是下层，即其下的独立 CLI 工具。</em></p>
<p>那么，为什么编码需要自己的插件，为什么我们要构建如此轻量级的东西呢？归根结底，你几乎肯定遇到了两个问题：克劳德代码缺乏持久内存，以及现有解决方案（如 claude-mem）的笨拙和复杂。</p>
<p>那为什么还要开发一个专用插件呢？因为编码代理会遇到两个痛点，你几乎肯定亲身经历过：</p>
<ul>
<li><p>克劳德代码没有持久内存。</p></li>
<li><p>许多现有的社区解决方案（如<em>claude-mem）</em>功能强大，但对于日常的编码工作来说，过于笨重或复杂。</p></li>
</ul>
<p>ccplugin 的目标是在 memsearch 的基础上提供一个最小、透明、开发者友好的层，从而解决这两个问题。</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">克劳德代码的内存问题：会话结束后会忘记所有内容<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们从克劳德代码用户肯定遇到过的情况开始。</p>
<p>你在早上打开克劳德代码。你输入："继续昨天的 auth 重构"。克劳德回复道"我不知道你昨天在忙什么。于是你花了十分钟复制粘贴昨天的日志。这不是什么大问题，但由于出现频率太高，很快就会让人厌烦。</p>
<p>尽管克劳德代码有自己的存储机制，但还远远不能令人满意。<code translate="no">CLAUDE.md</code> 文件可以存储项目指令和偏好设置，但它更适合静态规则和简短命令，而不适合积累长期知识。</p>
<p>克劳德代码确实提供了<code translate="no">resume</code> 和<code translate="no">fork</code> 命令，但它们远非用户友好型。对于 fork 命令，你需要记住会话 ID，手动输入命令，并管理一棵分支对话历史树。当你运行<code translate="no">/resume</code> 时，你会看到会话标题墙。如果你只记得几天前做过的一些细节，那么祝你好运能找到正确的会话。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>对于长期的、跨项目的知识积累来说，这整个方法都是不可能的。</p>
<p>为了实现这一想法，claude-mem 采用了三层记忆系统。第一层搜索高级摘要。第二层是在时间轴中挖掘更多细节。第三层则提取原始对话的完整观察结果。除此之外，还有隐私标签、成本跟踪和网络可视化界面。</p>
<p>下面是它的工作原理：</p>
<ul>
<li><p><strong>运行层。</strong>一个 Node.js Worker 服务在 37777 端口上运行。会话元数据保存在一个轻量级 SQLite 数据库中。向量数据库负责对内存内容进行精确的语义检索。</p></li>
<li><p><strong>交互层。</strong>基于 React 的 Web UI 可让您实时查看捕获的记忆：摘要、时间轴和原始记录。</p></li>
<li><p><strong>接口层。</strong>MCP（模型上下文协议）服务器提供标准化的工具接口。克劳德可以调用<code translate="no">search</code> （查询高级摘要）、<code translate="no">timeline</code> （查看详细时间线）和<code translate="no">get_observations</code> （检索原始交互记录）来直接检索和使用记忆。</p></li>
</ul>
<p>平心而论，这是一个能解决克劳德代码记忆问题的可靠产品。但在日常工作中，它显得笨拙而复杂。</p>
<table>
<thead>
<tr><th>层</th><th>技术层</th></tr>
</thead>
<tbody>
<tr><td>语言</td><td>TypeScript（ES2022、ESNext 模块）</td></tr>
<tr><td>运行时</td><td>Node.js 18+</td></tr>
<tr><td>数据库</td><td>SQLite 3，带 bun:sqlite 驱动程序</td></tr>
<tr><td>向量存储</td><td>ChromaDB（可选，用于语义搜索）</td></tr>
<tr><td>HTTP 服务器</td><td>Express.js 4.18</td></tr>
<tr><td>实时</td><td>服务器发送事件（SSE）</td></tr>
<tr><td>用户界面框架</td><td>React + TypeScript</td></tr>
<tr><td>人工智能 SDK</td><td>@anthropic-ai/claude-agents-sdk</td></tr>
<tr><td>构建工具</td><td>esbuild（捆绑 TypeScript）</td></tr>
<tr><td>进程管理器</td><td>包</td></tr>
<tr><td>测试</td><td>Node.js 内置测试运行器</td></tr>
</tbody>
</table>
<p><strong>对于初学者来说，设置工作非常繁重。</strong>要让 claude-mem 运行，需要安装 Node.js、Bun 和 MCP 运行时，然后在此基础上建立 Worker 服务、Express 服务器、React UI、SQLite 和向量存储。这需要部署、维护和调试很多移动部件，一旦出现故障，就会很麻烦。</p>
<p><strong>所有这些组件还会消耗你没有要求花费的令牌。</strong>MCP 工具定义会永久加载到 Claude 的上下文窗口中，每次工具调用都会在请求和响应中消耗令牌。在长时间的会话中，这种开销会迅速增加，并可能导致令牌成本失控。</p>
<p><strong>内存调用并不可靠，因为它完全取决于克劳德是否选择搜索。</strong>克劳德必须自己决定调用<code translate="no">search</code> 等工具来触发检索。如果它没有意识到自己需要一个存储器，相关内容就永远不会出现。而且三个内存层中的每一层都需要自己明确调用工具，因此如果克劳德没有想到要查找，就没有后备方案。</p>
<p><strong>最后，数据存储是不透明的，这使得调试和迁移都很麻烦。</strong>会话元数据存储在 SQLite 中，二进制向量数据存储在 Chroma 中，没有开放格式将它们连接在一起。迁移意味着要编写导出脚本。查看人工智能实际记忆的内容需要通过 Web UI 或专用查询界面。根本无法查看原始数据。</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">为什么克劳德代码的 memsearch 插件更好？<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>我们想要一个真正轻量级的内存层--没有额外的服务、没有复杂的架构、没有操作符开销。这就是我们开发<strong>memsearch ccplugin 的</strong>动机。从根本上说，这是一次实验：<em>以编码为核心的内存系统能否从根本上变得更简单？</em></p>
<p>是的，我们证明了这一点。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>整个 ccplugin 由四个 shell 钩子和一个后台监视进程组成。没有 Node.js，没有 MCP 服务器，没有 Web UI。它只是调用 memsearch CLI 的 shell 脚本，大大降低了设置和维护门槛。</p>
<p>ccplugin 之所以能如此精简，是因为它有严格的责任边界。它不处理内存存储、向量检索或文本嵌入。所有这些都委托给了下面的 memsearch CLI。ccplugin 只有一项工作：将克劳德代码的生命周期事件（会话开始、提示提交、响应停止、会话结束）连接到相应的 memsearch CLI 函数。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种解耦设计使系统的灵活性超越了 Claude Code。memsearch CLI 可与其他集成开发环境、其他 Agents 框架，甚至普通手动调用独立运行。它并不局限于单一的使用情况。</p>
<p>在实践中，这种设计有三个关键优势。</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1.所有内存都保存在纯 Markdown 文件中</h3><p>ccplugin 创建的每个内存都以 Markdown 文件的形式存在于<code translate="no">.memsearch/memory/</code> 中。</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>每天一个文件。每个文件都以纯文本形式包含当天的会话摘要，完全可由人类阅读。下面是 memsearch 项目本身的每日记忆文件截图：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>你可以立刻看到文件格式：时间戳、会话 ID、回合 ID 和会话摘要。没有任何隐藏内容。</p>
<p>想知道人工智能的记忆内容吗？打开 Markdown 文件。想编辑记忆？使用文本编辑器。想迁移数据？复制<code translate="no">.memsearch/memory/</code> 文件夹。</p>
<p><a href="https://milvus.io/">Milvus</a>向量索引是加快语义搜索的缓存。它可以随时从 Markdown 中重建。没有不透明的数据库，没有二进制黑盒。所有数据都是可追溯和完全可重建的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2.自动注入上下文，零额外令牌成本</h3><p>透明存储是本系统的基础。在 ccplugin 中，内存调用是完全自动的。</p>
<p>每次提交提示时，<code translate="no">UserPromptSubmit</code> 钩子都会启动语义搜索，并将前 3 个相关记忆注入上下文。克劳德不会决定是否进行搜索。它只是获取上下文。</p>
<p>在此过程中，克劳德从未看到 MCP 工具定义，因此上下文窗口中没有任何额外内容。钩子在 CLI 层运行，并注入纯文本搜索结果。没有 IPC 开销，没有工具调用令牌成本。MCP 工具定义带来的上下文窗口臃肿现象完全消失了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如果自动前三名还不够，我们还构建了三层渐进式检索。这三层都是 CLI 命令，而不是 MCP 工具。</p>
<ul>
<li><p><strong>L1（自动）：</strong>每次提示都会返回前 3 个语义搜索结果，并带有<code translate="no">chunk_hash</code> 和 200 个字符的预览。这涵盖了大部分日常使用。</p></li>
<li><p><strong>L2（按需）：</strong>需要完整上下文时，<code translate="no">memsearch expand &lt;chunk_hash&gt;</code> 返回完整的 Markdown 部分和元数据。</p></li>
<li><p><strong>L3（深度）：</strong>需要原始对话时，<code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> 从克劳德代码中提取原始 JSONL 记录。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3.以近乎零的成本在后台生成会话摘要</h3><p>检索涵盖了记忆的使用方式。但记忆必须先编写。这些 Markdown 文件是如何创建的？</p>
<p>ccplugin 通过后台流水线生成，该流水线异步运行，成本几乎为零。每次停止 Claude 响应时，<code translate="no">Stop</code> 钩子就会启动：它会解析对话副本，调用 Claude Haiku (<code translate="no">claude -p --model haiku</code>) 生成摘要，并将其附加到当日的 Markdown 文件中。Haiku API 调用非常便宜，每次调用几乎可以忽略不计。</p>
<p>在此基础上，观察进程会检测到文件变化，并自动将新内容编入 Milvus 索引，以便立即检索。整个流程在后台运行，不会干扰你的工作，成本也可控。</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">使用克劳德代码快速启动 memsearch 插件<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">首先，从 Claude Code 插件市场安装：</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">其次，重新启动 Claude Code。</h3><p>插件会自动初始化配置。</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">第三，对话后，检查当天的内存文件：</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">第四，享受。</h3><p>下次启动克劳德代码时，系统会自动检索并注入相关记忆。无需额外步骤。</p>
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
    </button></h2><p>让我们回到最初的问题：如何为人工智能提供持久记忆？ claude-mem 和 memsearch ccplugin 采用了不同的方法，各有千秋。我们总结了一份快速选择指南：</p>
<table>
<thead>
<tr><th>类别</th><th>记忆搜索</th><th>克劳德内存</th></tr>
</thead>
<tbody>
<tr><td>架构</td><td>4 个 shell 钩子 + 1 个监视进程</td><td>Node.js Worker + Express + React UI</td></tr>
<tr><td>集成方法</td><td>本地钩子 + CLI</td><td>MCP 服务器（stdio）</td></tr>
<tr><td>调用</td><td>自动（钩子注入）</td><td>Agents 驱动（需要调用工具）</td></tr>
<tr><td>上下文消耗</td><td>零（仅注入结果文本）</td><td>MCP 工具定义持续存在</td></tr>
<tr><td>会话摘要</td><td>一次异步 Haiku CLI 调用</td><td>多个 API 调用 + 观察压缩</td></tr>
<tr><td>存储格式</td><td>纯 Markdown 文件</td><td>SQLite + Chroma Embeddings</td></tr>
<tr><td>数据迁移</td><td>普通 Markdown 文件</td><td>SQLite + Chroma Embeddings</td></tr>
<tr><td>迁移方法</td><td>复制 .md 文件</td><td>从数据库导出</td></tr>
<tr><td>运行时间</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCP 运行时</td></tr>
</tbody>
</table>
<p>claude-mem 提供了更丰富的功能、完善的用户界面和更精细的控制。对于需要协作、网络可视化或详细内存管理的团队来说，它是一个强有力的选择。</p>
<p>memsearch ccplugin 设计简约，上下文窗口开销为零，存储完全透明。对于需要轻量级内存层而不需要额外复杂性的工程师来说，ccplugin 更为合适。哪一个更好取决于你的需求。</p>
<p>想深入了解或获得使用 memsearch 或 Milvus 构建的帮助？</p>
<ul>
<li><p>加入<a href="https://milvus.io/slack">Milvus Slack 社区</a>，与其他开发人员交流，分享您的开发成果。</p></li>
<li><p>预约<a href="https://milvus.io/office-hours">Milvus 办公时间，获得</a>团队的现场问答和直接支持。</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">资源<button data-href="#Resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><strong>memsearch ccplugin 文档</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">：https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>memsearch 项目</strong> <a href="https://github.com/zilliztech/memsearch">: https://github.com/zilliztech/memsearch</a></p></li>
<li><p>博客：<a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我们提取了 OpenClaw 的内存系统并将其开源 (memsearch)</a></p></li>
<li><p>博客：什么是OpenClaw？<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">什么是 OpenClaw？开源人工智能 Agents 完全指南--OpenClaw 是什么？</a></p></li>
<li><p>博客：什么是OpenClaw？<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw教程：为本地人工智能助理连接到 Slack</a></p></li>
</ul>
