---
id: >-
  hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
title: 实践教程：使用 Qwen3-Coder、Qwen Code 和 Code Context 构建自己的 Coding Copilot
author: Lumina Wang
date: 2025-07-29T00:00:00.000Z
desc: 学习使用 Qwen3-Coder、Qwen Code CLI 和用于深度语义代码理解的 Code Context 插件创建自己的人工智能编码副驾驶员。
cover: assets.zilliz.com/_9dfadf5877.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Qwen3 Code, Qwen3, Cursor, Code Context, Code Search'
meta_title: |
  Build a Coding Copilot with Qwen3-Coder & Code Context
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
---
<p>人工智能编码助手的战场正在迅速升温。我们已经看到 Anthropic 的<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Claude Code</a>掀起了波澜，谷歌的<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Gemini CLI</a>颠覆了终端工作流程，OpenAI 的 Codex 助力 GitHub Copilot，Cursor 赢得了 VS Code 用户的<strong>青睐，现在阿里巴巴云也加入了 Qwen</strong>Code。</p>
<p>老实说，这对开发者来说是个好消息。更多的参与者意味着更好的工具、创新的功能，最重要的是，可以用<strong>开源替代</strong>昂贵的专有解决方案。让我们来了解一下这个最新的参与者带来了什么。</p>
<h2 id="Meet-Qwen3-Coder-and-Qwen-Code" class="common-anchor-header">认识 Qwen3-Coder 和 Qwen Code<button data-href="#Meet-Qwen3-Coder-and-Qwen-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>阿里云最近发布了<a href="https://github.com/QwenLM/Qwen3-Coder"> <strong>Qwen3-Coder</strong></a>，这是一个开源 Agents 编码模型，在多个基准测试中取得了最先进的结果。他们还发布了<a href="https://github.com/QwenLM/qwen-code"> <strong>Qwen Code</strong></a>，这是一款开源的人工智能编码 CLI 工具，基于 Gemini CLI 开发，并为 Qwen3-Coder 增加了专门的解析器。</p>
<p>旗舰模型<strong>Qwen3-Coder-480B-A35B-Instruct</strong> 提供了令人印象深刻的功能：原生支持 358 种编程语言、256K 标记上下文窗口（可通过 YaRN 扩展到 1M 标记），以及与 Claude Code、Cline 和其他编码助手的无缝集成。</p>
<h2 id="The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="common-anchor-header">现代人工智能编码助手的普遍盲点<button data-href="#The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="anchor-icon" translate="no">
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
    </button></h2><p>虽然 Qwen3-Coder 功能强大，但我对它的编码助手更感兴趣：<strong>Qwen Code</strong>。以下是我发现的有趣之处。尽管 Qwen Code 有很多创新，但它与 Claude Code 和 Gemini CLI 有着完全相同的局限性：<strong><em>它们擅长生成新代码，却很难理解现有代码库。</em></strong></p>
<p>举个例子：你要求 Gemini CLI 或 Qwen Code "找到这个项目处理用户身份验证的地方"。该工具开始搜索 "登录 "或 "密码 "等显而易见的关键词，但却完全忽略了<code translate="no">verifyCredentials()</code> 这一关键功能。除非你愿意将你的整个代码库作为上下文来使用令牌，否则这些工具很快就会碰壁。</p>
<p><strong><em>这就是当今人工智能工具的真正差距：智能代码上下文理解。</em></strong></p>
<h2 id="Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="common-anchor-header">用语义代码搜索为任何编码辅助工具增效<button data-href="#Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>如果你能让任何人工智能编码辅助工具--无论是 Claude Code、Gemini CLI 还是 Qwen Code--都能真正从语义上理解你的代码库，你会怎么做？如果你能为自己的项目构建像 Cursor 一样强大的功能，而无需支付高昂的订阅费用，同时又能保持对代码和数据的完全控制，你会怎么做？</p>
<p><a href="https://github.com/zilliztech/code-context"> <strong>Code Context 就是这样一款</strong></a>开源、兼容 MCP 的插件，它能将任何人工智能编码代理转化为上下文感知的强大工具。这就好比让你的人工智能助手拥有一个在你的代码库中工作多年的资深开发人员的机构记忆。无论你使用的是 Qwen Code、Claude Code、Gemini CLI，还是在 VSCode 中工作，甚至在 Chrome 浏览器中编码，<strong>Code Context</strong>都能为你的工作流程带来语义代码搜索。</p>
<p>准备好看看它是如何工作的吗？让我们使用<strong>Qwen3-Coder + Qwen Code + Code Context</strong> 构建一个企业级 AI 编码副驾驶。</p>
<h2 id="Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="common-anchor-header">动手教程：构建您自己的人工智能编码辅助程序<button data-href="#Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>在我们开始之前，请确保您已</p>
<ul>
<li><p>已安装<strong>Node.js 20+</strong></p></li>
<li><p><strong>OpenAI API 密钥</strong><a href="https://openai.com/index/openai-api/">（在此获取）</a></p></li>
<li><p>用于访问 Qwen3-Coder 的<strong>阿里云账户</strong><a href="https://www.alibabacloud.com/en">（在此获取一个）</a></p></li>
<li><p>用于访问向量数据库的<strong>Zilliz Cloud 账户</strong><a href="https://cloud.zilliz.com/login">（</a>如果还没有，请<a href="https://cloud.zilliz.com/login">在此处</a>免费<a href="https://cloud.zilliz.com/login">注册</a>一个）</p></li>
</ul>
<p><strong>注释1)</strong>在本教程中，我们将使用 Qwen3-Coder 的商业版本 Qwen3-Coder-Plus，因为它具有强大的编码能力和易用性。如果你更喜欢开源版本，可以使用 qwen3-coder-480b-a35b-instruct。2) Qwen3-Coder-Plus 性能和可用性都很出色，但需要消耗大量令牌。请务必将其纳入企业预算计划。</p>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">第 1 步：环境设置</h3><p>验证您的 Node.js 安装：</p>
<pre><code translate="no">curl -qL <span class="hljs-attr">https</span>:<span class="hljs-comment">//www.npmjs.com/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Install-Qwen-Code" class="common-anchor-header">第 2 步：安装 Qwen 代码</h3><pre><code translate="no">npm install -g <span class="hljs-meta">@qwen</span>-code/qwen-code
qwen --version
<button class="copy-code-btn"></button></code></pre>
<p>如果看到如下版本号，则表示安装成功。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0d5ebc152e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Configure-Qwen-Code" class="common-anchor-header">第 3 步：配置 Qwen 代码</h3><p>导航至项目目录并初始化 Qwen Code。</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>然后，你会看到如下页面。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_e6598ea982.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>API 配置要求：</strong></p>
<ul>
<li><p>API 密钥：从<a href="https://modelstudio.console.alibabacloud.com/"> 阿里云模型工作室</a>获取</p></li>
<li><p>基本 URL：<code translate="no">https://dashscope.aliyuncs.com/compatible-mode/v1</code></p></li>
<li><p>模型选择：</p>
<ul>
<li><p><code translate="no">qwen3-coder-plus</code> (商业版，功能最强大）</p></li>
<li><p><code translate="no">qwen3-coder-480b-a35b-instruct</code> (开源版本）</p></li>
</ul></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5ed0c54084.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>配置完成后，按<strong>Enter</strong>继续。</p>
<h3 id="Step-4-Test-Basic-Functionality" class="common-anchor-header">步骤 4：测试基本功能</h3><p>让我们通过两个实际测试来验证您的设置：</p>
<p><strong>测试 1：代码理解</strong></p>
<p>提示"用一句话概括本项目的架构和主要组件。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_41e601fc82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3-Coder-Plus 完美地完成了总结--将该项目描述为基于 Milvus 的技术教程，重点是 RAG 系统、检索策略等。</p>
<p><strong>测试 2：代码生成</strong></p>
<p>提示"请创建一个俄罗斯方块小游戏</p>
<p>在不到一分钟的时间内，Qwen3-coder-plus：</p>
<ul>
<li><p>自主安装所需的库</p></li>
<li><p>构建游戏逻辑</p></li>
<li><p>创建完整、可玩的实现</p></li>
<li><p>处理通常需要花费数小时研究的所有复杂问题</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_c67e1725eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_fd91d5a290.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这展示了真正的自主开发--不仅仅是完成代码，还包括架构决策和完整解决方案的交付。</p>
<h3 id="Step-5-Set-Up-Your-Vector-Database" class="common-anchor-header">第 5 步：建立向量数据库</h3><p>在本教程中，我们将使用<a href="https://zilliz.com/cloud">Zilliz Cloud</a>作为向量数据库。</p>
<p><strong>创建 Zilliz 集群：</strong></p>
<ol>
<li><p>登录<a href="https://cloud.zilliz.com/"> Zilliz Cloud 控制台</a></p></li>
<li><p>创建新集群</p></li>
<li><p>复制<strong>公共端点</strong>和<strong>令牌</strong></p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_5e692e6e80.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_753f281055.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Configure-Code-Context-Integration" class="common-anchor-header">第 6 步：配置代码上下文集成</h3><p>创建<code translate="no">~/.qwen/settings.json</code> ：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;code-context&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;npx&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;@zilliz/code-context-mcp@latest&quot;</span>],
      <span class="hljs-string">&quot;env&quot;</span>: {
        <span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-xxxxxxxxxx&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_ADDRESS&quot;</span>: <span class="hljs-string">&quot;https://in03-xxxx.cloud.zilliz.com&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_TOKEN&quot;</span>: <span class="hljs-string">&quot;4f699xxxxx&quot;</span>
      },
      <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;./server-directory&quot;</span>,
      <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">30000</span>,
      <span class="hljs-string">&quot;trust&quot;</span>: <span class="hljs-literal">false</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Activate-Enhanced-Capabilities" class="common-anchor-header">第 7 步：激活增强功能</h3><p>重新启动 Qwen Code：</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>按<strong>Ctrl + T 键</strong>，在我们的 MCP 服务器中查看三个新工具：</p>
<ul>
<li><p><code translate="no">index-codebase</code>:为资源库理解创建语义索引</p></li>
<li><p><code translate="no">search-code</code>:在您的代码库中进行自然语言代码搜索</p></li>
<li><p><code translate="no">clear-index</code>:需要时重置索引。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_bebbb44460.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Test-the-Complete-Integration" class="common-anchor-header">第 8 步：测试完整的集成</h3><p>下面是一个真实的例子：在一个大项目中，我们检查了代码名称，发现 "更宽的窗口 "听起来很不专业，因此我们决定更改它。</p>
<p>提示查找与 "更宽的窗口 "相关的所有需要专业重命名的函数。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_c54398c4f2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如下图所示，qwen3-coder-plus 首先调用<code translate="no">index_codebase</code> 工具为整个项目创建索引。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_25a7f3a039.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>然后，<code translate="no">index_codebase</code> 工具为该项目中的 539 个文件创建了索引，将它们分割成 9991 块。建立索引后，它立即调用<code translate="no">search_code</code>工具执行查询。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/13_6766663346.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>接着，它通知我们找到了需要修改的相应文件。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/14_7b3c7e9cc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最后，它使用 Code Context 发现了 4 个问题，包括函数、导入和文档中的一些命名，帮助我们完成了这项小任务。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/15_a529905b28.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>有了 Code Context，<code translate="no">qwen3-coder-plus</code> 现在可以提供更智能的代码搜索和对编码环境的更好理解。</p>
<h3 id="What-Youve-Built" class="common-anchor-header">您已构建的内容</h3><p>现在，您拥有了一个完整的人工智能编码导航器，它集以下功能于一身：</p>
<ul>
<li><p><strong>Qwen3-Coder</strong>：智能代码生成和自主开发</p></li>
<li><p><strong>代码上下文</strong>：对现有代码库的语义理解</p></li>
<li><p><strong>通用兼容性</strong>：与 Claude Code、Gemini CLI、VSCode 等兼容</p></li>
</ul>
<p>这不仅仅是更快的开发速度，它还为遗留问题的现代化、跨团队协作和架构演进提供了全新的方法。</p>
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
    </button></h2><p>作为一名开发人员，我尝试过很多人工智能编码工具--从 Claude Code 到 Cursor 和 Gemini CLI，再到 Qwen Code--虽然它们在生成新代码方面都很出色，但在理解现有代码库方面通常都不尽如人意。这才是真正的痛点：不是从头开始编写函数，而是浏览复杂、凌乱的遗留代码，并弄清<em>为什么</em>要以某种方式处理事情。</p>
<p>这就是<strong>Qwen3-Coder + Qwen Code+ Code Context</strong>这种设置的魅力所在。你可以获得两全其美的结果：一个可以生成全功能实现的强大编码模型<em>和</em>一个能真正理解你的项目历史、结构和命名规则的语义搜索层。</p>
<p>有了向量搜索和 MCP 插件生态系统，你就不再需要将随机文件粘贴到提示窗口中，或者在软件仓库中翻来覆去试图找到正确的上下文。你只需用简单的语言提出要求，它就会为你找到相关的文件、函数或决定，就像有一个什么都记得的资深开发人员一样。</p>
<p>说白了，这种方法不仅仅是更快，它实际上改变了你的工作方式。这是迈向新型开发工作流程的一步，在这种流程中，人工智能不仅仅是编码助手，还是架构助手，是了解整个项目背景的队友。</p>
<p><em>话虽如此......还是要提醒一下：Qwen3-Coder-Plus令人惊叹，但也非常耗费代币。光是构建这个原型就烧掉了 2000 万个代币。所以，是的，我现在正式没有代币了 😅。</em></p>
<p>__</p>
