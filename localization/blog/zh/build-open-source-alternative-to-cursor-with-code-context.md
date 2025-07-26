---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: 利用代码上下文构建光标的开源替代方案
author: Cheney Zhang
date: 2025-06-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context--一个开源、兼容 MCP 的插件，为任何人工智能编码代理、Claude Code 和 Gemini CLI、VSCode
  等集成开发环境，甚至 Chrome 浏览器等环境带来强大的语义代码搜索功能。
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">人工智能编码热潮及其盲点<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>人工智能编码工具无处不在--它们的流行是有原因的。从<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code、Gemini CLI</a>到开源的 Cursor 替代品，这些 Agents 只需一个提示就能编写函数、解释代码依赖性并重构整个文件。开发人员正争先恐后地将它们集成到自己的工作流程中，而且在很多方面，它们都达到了预期的效果。</p>
<p><strong>但在<em>理解代码库时</em>，大多数人工智能工具都会遇到障碍。</strong></p>
<p>如果让克劳德代码查找 "这个项目在哪些地方处理用户身份验证"，它就会退回到<code translate="no">grep -r &quot;auth&quot;</code>- 在注释、变量名和文件名中找出 87 个松散相关的匹配项，而且很可能漏掉许多具有身份验证逻辑但不叫 "auth "的函数。试试 Gemini CLI，它会查找 "login "或 "password "这样的关键字，而完全忽略<code translate="no">verifyCredentials()</code> 这样的函数。这些工具在生成代码方面非常出色，但当需要导航、调试或探索陌生系统时，它们就会溃不成军。除非它们将整个代码库发送给 LLM 以获取上下文--烧掉令牌和时间--否则它们很难提供有意义的答案。</p>
<p><em>这就是当今人工智能工具的真正差距：</em> <strong><em>代码上下文。</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">光标做到了--但并非人人都能做到<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong>正视了这一问题。它不使用关键字搜索，而是使用语法树、向量嵌入和代码感知搜索来构建代码库的语义地图。如果问它 "电子邮件验证逻辑在哪里？"，它就会返回<code translate="no">isValidEmailFormat()</code> - 不是因为名称匹配，而是因为它了解代码的<em>作用</em>。</p>
<p>虽然 Cursor 功能强大，但未必适合所有人。<strong><em>Cursor 是闭源的、云托管的、基于订阅的。</em></strong>这使得处理敏感代码的团队、有安全意识的组织、独立开发者、学生以及任何喜欢开放系统的人都无法使用它。</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">如果你能构建自己的光标会怎样？<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>问题是：Cursor 背后的核心技术并非专有。它建立在成熟的开源基础之上--<a href="https://milvus.io/">Milvus</a> 这样的向量数据库、<a href="https://zilliz.com/ai-models">Embeddings 模型</a>、使用 Tree-sitter 的语法分析器--所有这些都可以提供给任何愿意连接点的人。</p>
<p><em>因此，我们提出了一个问题：</em> <strong><em>如果任何人都能构建自己的 Cursor 会怎样？</em></strong>在您的基础设施上运行。无需订阅费。完全可定制。完全控制您的代码和数据。</p>
<p>这就是我们构建<a href="https://github.com/zilliztech/code-context"><strong>Code Context 的</strong></a>原因<a href="https://github.com/zilliztech/code-context"><strong>--这是一个</strong></a>开源、兼容 MCP 的插件，可为任何人工智能编码代理（如 Claude Code 和 Gemini CLI、VSCode 等集成开发环境，甚至 Google Chrome 浏览器等环境）带来强大的语义代码搜索功能。它还能让你从头开始构建自己的编码代理（如 Cursor），解锁代码库的实时智能导航。</p>
<p><strong><em>无需订阅。没有黑盒。只有代码智能--根据你的条件。</em></strong></p>
<p>在本篇文章的其余部分，我们将介绍 Code Context 的工作原理，以及如何让您立即开始使用它。</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Code Context：Cursor 智能的开源替代品<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a>是一个开源、兼容 MCP 的语义代码搜索引擎。无论您是从头开始构建自定义人工智能编码助手，还是为 Claude Code 和 Gemini CLI 等人工智能编码 Agents 添加语义意识，Code Context 都是使之成为可能的引擎。</p>
<p>它可在本地运行，与您最喜欢的工具和环境（如 VS Code 和 Chrome 浏览器）集成，并提供强大的代码理解功能，而无需依赖纯云、闭源平台。</p>
<p><strong>核心功能包括</strong></p>
<ul>
<li><p><strong>通过自然语言进行语义代码搜索：</strong>使用普通英语查找代码。搜索 "用户登录验证 "或 "支付处理逻辑 "等概念，Code Context 就会找到相关函数--即使它们与关键字不完全匹配。</p></li>
<li><p><strong>多语言支持：</strong>在 15 种以上的编程语言（包括 JavaScript、Python、Java 和 Go）中进行无缝搜索，对所有语言的语义理解保持一致。</p></li>
<li><p><strong>基于 AST 的代码分块：</strong>使用 AST 解析技术将代码自动分割成函数和类等逻辑单元，确保搜索结果完整、有意义，且不会在函数执行过程中中断。</p></li>
<li><p><strong>实时增量索引：</strong>代码更改会实时编入索引。当你编辑文件时，搜索索引会保持更新，无需手动刷新或重新索引。</p></li>
<li><p><strong>完全本地化的安全部署：</strong>在自己的基础架构上运行一切。Code Context 通过 Ollama 支持本地模型，通过<a href="https://milvus.io/">Milvus</a> 支持索引，因此您的代码永远不会离开您的环境。</p></li>
<li><p><strong>一流的集成开发环境集成：</strong>VSCode 扩展功能可让您在编辑器中即时搜索和跳转结果，无需切换上下文。</p></li>
<li><p><strong>支持 MCP 协议：</strong>Code Context 支持 MCP 协议，可轻松与人工智能编码助手集成，将语义搜索直接引入其工作流程。</p></li>
<li><p><strong>浏览器插件支持：</strong>在浏览器中直接从 GitHub 搜索版本库--无需标签页，无需复制粘贴，无论您在哪里工作，都能即时查看上下文。</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">代码上下文如何工作</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context 采用模块化架构，包含一个核心协调器和用于嵌入、解析、存储和检索的专用组件。</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">核心模块代码上下文核心</h3><p>Code Context 的核心是<strong>Code Context Core</strong>，它负责协调代码解析、嵌入、存储和语义检索：</p>
<ul>
<li><p><strong>文本处理模块</strong>使用 Tree-sitter 对代码进行拆分和解析，以进行语言感知的 AST 分析。</p></li>
<li><p><strong>Embedding 接口</strong>支持可插拔的后端--目前是 OpenAI 和 VoyageAI--将代码块转换为向量嵌入，以捕捉其语义和上下文关系。</p></li>
<li><p><strong>向量数据库接口</strong>将这些嵌入存储在自托管的<a href="https://milvus.io/">Milvus</a>实例中（默认情况下），或存储在托管版 Milvus 的<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 中。</p></li>
</ul>
<p>所有这些都会按计划与您的文件系统同步，确保索引保持最新，无需人工干预。</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">代码上下文核心之上的扩展模块</h3><ul>
<li><p><strong>VSCode 扩展</strong>：无缝集成开发环境（IDE）集成，可实现快速的编辑器内语义搜索和定义跳转。</p></li>
<li><p><strong>Chrome 浏览器扩展</strong>：在浏览 GitHub 代码库时进行内联语义代码搜索，无需切换标签页。</p></li>
<li><p><strong>MCP 服务器</strong>：通过 MCP 协议将 Code Context 提供给任何人工智能编码助手，从而实现实时的上下文感知辅助功能。</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">开始使用代码上下文<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context 可插入您已经使用的编码工具，也可用于从头开始构建自定义的人工智能编码助手。在本节中，我们将介绍这两种情况：</p>
<ul>
<li><p>如何将 Code Context 与现有工具集成</p></li>
<li><p>在构建您自己的人工智能编码助手时，如何为独立的语义代码搜索设置核心模块</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">MCP 集成</h3><p>Code Context 支持<strong>模型上下文协议（MCP）</strong>，允许像 Claude Code 这样的人工智能编码 Agents 将其用作语义后台。</p>
<p>与 Claude Code 集成：</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>配置完成后，Claude Code 将在需要时自动调用 Code Context 进行语义代码搜索。</p>
<p>要与其他工具或环境集成，请查看我们的<a href="https://github.com/zilliztech/code-context"> GitHub 仓库</a>，了解更多示例和适配器。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">使用 Code Context 创建自己的人工智能编码助手</h3><p>要使用 Code Context 构建自定义 AI 助手，只需三步就能设置语义代码搜索的核心模块：</p>
<ol>
<li><p>配置您的 Embeddings 模型</p></li>
<li><p>连接到您的向量数据库</p></li>
<li><p>索引您的项目并开始搜索</p></li>
</ol>
<p>下面是一个使用<strong>OpenAI Embeddings</strong>和<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> <strong>向量数据库</strong>作为向量后台的示例：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">VSCode 扩展</h3><p>Code Context可作为名为<strong>"Semantic Code Search（语义代码搜索）"的</strong>VSCode扩展使用，它将智能、自然语言驱动的代码搜索直接引入到您的编辑器中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>安装后</p>
<ul>
<li><p>配置 API 密钥</p></li>
<li><p>索引您的项目</p></li>
<li><p>使用纯英文查询（无需精确匹配）</p></li>
<li><p>通过点击导航立即跳转到结果</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这使得语义探索成为您编码工作流程的原生组成部分--无需终端或浏览器。</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Chrome 浏览器扩展（即将推出）</h3><p>我们即将推出的<strong>Chrome 浏览器扩展</strong>将代码上下文引入 GitHub 网页，让您可以直接在任何公共版本库中运行语义代码搜索--无需上下文切换或标签。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>您将能使用与本地相同的深度搜索功能探索陌生的代码库。敬请期待，扩展正在开发中，很快就会推出。</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">为什么使用代码上下文？<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>基本设置可让您快速运行，但<strong>Code Context</strong>真正的亮点在于专业、高性能的开发环境。它的高级功能旨在支持从企业级部署到自定义人工智能工具等各种严谨的工作流程。</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">企业级安全的私有部署</h3><p>Code Context 支持使用<strong>Ollama</strong>本地嵌入模型和作为自托管向量数据库的<strong>Milvus</strong>进行完全离线部署。这就实现了完全私有的代码搜索管道：无需调用 API，无需互联网传输，任何数据都不会离开本地环境。</p>
<p>这种架构非常适合有严格合规性要求的行业，如金融、政府和国防等，在这些行业中，代码的保密性是不容商量的。</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">智能文件同步实时索引</h3><p>保持代码索引的更新不应是缓慢或手动的。Code Context 包含一个<strong>基于 Merkle Tree 的文件监控系统</strong>，可即时检测更改并实时执行增量更新。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>通过只重新索引修改过的文件，它能将大型代码库的更新时间从几分钟缩短到几秒钟。这确保了你刚刚编写的代码已经可以被搜索到，而无需点击 "刷新"。</p>
<p>在快节奏的开发环境中，这种即时性至关重要。</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">像你一样理解代码的 AST 解析</h3><p>传统的代码搜索工具按行数或字符数分割文本，往往会破坏逻辑单元，并返回令人困惑的结果。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context 做得更好。它利用 Tree-sitter AST 解析来理解实际代码结构。它能识别完整的函数、类、接口和模块，提供简洁、语义完整的结果。</p>
<p>它支持 JavaScript/TypeScript、Python、Java、C/C++、Go 和 Rust 等主要编程语言，并采用特定语言策略进行精确分块。对于不支持的语言，它会退回到基于规则的解析，确保处理得当，不会出现崩溃或空结果。</p>
<p>这些结构化的代码单元还可输入元数据，以实现更准确的语义搜索。</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">开源和可扩展设计</h3><p>Code Context 在 MIT 许可下完全开源。所有核心模块均可在 GitHub 上公开获取。</p>
<p>我们相信开放的基础架构是构建强大、值得信赖的开发者工具的关键，并邀请开发者针对新的模型、语言或使用案例对其进行扩展。</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">解决人工智能助手的语境窗口问题</h3><p>大型语言模型（LLM）有一个硬限制：它们的上下文窗口。这限制了它们看到整个代码库，从而降低了补全、修正和建议的准确性。</p>
<p>Code Context 可以弥补这一缺陷。它的语义代码搜索能检索到<em>正确的</em>代码片段，为人工智能助手提供有针对性的相关上下文。它能让模型 "放大 "真正重要的内容，从而提高人工智能生成输出的质量。</p>
<p>流行的人工智能编码工具（如 Claude Code 和 Gemini CLI）缺乏原生语义代码搜索--它们依赖于浅层的、基于关键字的启发式搜索。Code Context 通过<strong>MCP</strong> 集成后，为它们提供了大脑升级。</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">专为开发人员设计，由开发人员完成</h3><p>Code Context 是为模块化重用而打包的：每个组件都是独立的<strong>npm</strong>包。您可以根据项目需要进行混合、匹配和扩展。</p>
<ul>
<li><p>只需要语义代码搜索？使用<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>想要插入人工智能 Agents？添加<code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>构建自己的集成开发环境/浏览器工具？参考我们的 VSCode 和 Chrome 扩展示例</p></li>
</ul>
<p>代码上下文的一些应用实例：</p>
<ul>
<li><p><strong>上下文感知自动完成插件</strong>，可提取相关代码片段以更好地完成 LLM</p></li>
<li><p>收集周围代码以改进修复建议的<strong>智能错误检测器</strong></p></li>
<li><p>自动查找语义相关位置的<strong>安全代码重构工具</strong></p></li>
<li><p>根据语义代码关系构建图表的<strong>架构可视化工具</strong></p></li>
<li><p><strong>更智能的代码审查助手</strong>，可在 PR 审查期间显示历史实现</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">欢迎加入我们的社区<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a>不仅仅是一个工具，它还是一个探索<strong>人工智能和向量数据库</strong>如何协同工作以真正理解代码的平台。随着人工智能辅助开发成为常态，我们相信语义代码搜索将成为一项基础能力。</p>
<p>我们欢迎各种类型的贡献：</p>
<ul>
<li><p>支持新语言</p></li>
<li><p>新的嵌入模型后端</p></li>
<li><p>创新的人工智能辅助工作流程</p></li>
<li><p>反馈、错误报告和设计想法</p></li>
</ul>
<p>在这里找到我们</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">GitHub 上的 Code Context |</a> <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>MCP npm 软件包</strong></a>|<a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCode 市场</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a>|<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>|<a href="https://x.com/zilliz_universe">X</a>|<a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>我们可以一起为下一代人工智能开发工具构建基础架构--透明、强大、开发者优先。</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
