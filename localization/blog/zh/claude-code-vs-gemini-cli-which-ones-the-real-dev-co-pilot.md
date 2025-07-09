---
id: claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
title: 克劳德代码与双子座 CLI：哪一个才是真正的开发副驾驶？
author: Min Yin
date: 2025-07-09T00:00:00.000Z
desc: 比较 Gemini CLI 和 Claude Code 这两款改变终端工作流程的人工智能编码工具。您的下一个项目应该使用哪一款？
cover: assets.zilliz.com/Claude_Code_vs_Gemini_CLI_e3a04a49cf.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, Gemini, Claude'
meta_keywords: >-
  Claude Code, Gemini CLI, Natural Language Coding, Vibe Coding, AI Coding
  Assistants
meta_title: |
  Claude Code vs Gemini CLI: Who’s the Real Dev Co-Pilot?
origin: >-
  https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
---
<p>你的集成开发环境过于臃肿。你的编码助手过时了。你还在为右键重构而苦恼？欢迎来到 CLI 复兴时代。</p>
<p>人工智能代码助手正从噱头演变为必备工具，开发者们也纷纷站队。除了初创公司 Cursor 外，<strong>Anthropic 的</strong> <a href="https://www.anthropic.com/claude-code"><strong>Claude Code</strong></a>也带来了精确和精致。谷歌的<a href="https://github.com/google-gemini/gemini-cli"><strong>Gemini CLI</strong></a>？快速、免费，而且渴望语境。两者都承诺让自然语言成为新的 shell 脚本。那么，<em>你</em>应该相信哪一个来重构你的下一个 repo 呢？</p>
<p>在我看来，Claude Code 在早期处于领先地位。但游戏规则变化很快。Gemini CLI 推出后，开发者蜂拥而至，<strong>24 小时内就在 GitHub 上获得了 15.1k颗星。</strong>截至目前，它已飙升至<strong>55,000 颗星</strong>，而且还在不断增加。令人惊叹！</p>
<p>以下是我对 Gemini CLI 受到如此多开发者追捧的简要看法：</p>
<ul>
<li><p><strong>它是 Apache 2.0 下的开源软件，完全免费：</strong>Gemini CLI 可免费连接到 Google 的顶级 Gemini 2.0 Flash 模型。只需使用个人 Google 账户登录，即可访问 Gemini Code Assist。在预览期间，您每分钟最多可收到 60 个请求，每天可收到 1,000 个请求，所有这些都是免费的。</p></li>
<li><p><strong>这是一款真正的多任务处理工具：</strong>除了编程（它的强项），它还能处理文件管理、内容生成、脚本控制，甚至是深度研究功能。</p></li>
<li><p><strong>轻便：</strong>您可以将其无缝嵌入终端脚本，也可以将其作为独立的 Agents 使用。</p></li>
<li><p><strong>它提供较长的上下文长度：</strong>它拥有 100 万个上下文标记（约 75 万个单词），可以一次性摄取较小项目的整个代码库。</p></li>
</ul>
<h2 id="Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="common-anchor-header">开发人员为何抛弃集成开发环境，转而使用人工智能驱动的终端？<button data-href="#Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="anchor-icon" translate="no">
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
    </button></h2><p>为什么人们对这些基于终端的工具如此热衷？作为开发人员，您可能已经感受到了这种痛苦：传统的集成开发环境拥有令人印象深刻的功能，但其工作流程的复杂性会扼杀开发的动力。想重构一个函数？你需要选中代码，右击右键菜单，导航到 "重构"，选择特定的重构类型，在对话框中配置选项，最后应用更改。</p>
<p><strong>终端人工智能工具将所有操作精简为自然语言命令，从而改变了这一工作流程。</strong>你无需记住命令语法，只需说：<em>&quot;帮我重构这个函数，以提高可读性</em>&quot;，然后看着工具处理整个过程。</p>
<p>这不仅仅是方便，而是我们思维方式的根本转变。复杂的技术操作变成了自然语言对话，让我们可以专注于业务逻辑，而不是工具的机制。</p>
<h2 id="Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="common-anchor-header">克劳德代码还是双子座 CLI？明智选择你的副驾驶<button data-href="#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="anchor-icon" translate="no">
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
    </button></h2><p>既然 Claude Code 也是相当流行和易用的工具，并在之前的应用中占据主导地位，那么它与新的 Gemini CLI 相比如何？我们应该如何在两者之间做出选择？让我们仔细看看这些人工智能编码工具。</p>
<h3 id="1-Cost-Free-vs-Paid" class="common-anchor-header"><strong>1.成本免费与付费</strong></h3><ul>
<li><p><strong>Gemini CLI</strong>对任何谷歌账户都是完全免费的，每天可提供 1,000 个请求，每分钟可提供 60 个请求，无需设置账单。</p></li>
<li><p><strong>Claude Code</strong>需要激活 Anthropic 订阅，并遵循按使用付费的模型，但包含企业级安全和支持，对商业项目很有价值。</p></li>
</ul>
<h3 id="2-Context-Window-How-Much-Code-Can-It-See" class="common-anchor-header"><strong>2.上下文窗口：它能看到多少代码？</strong></h3><ul>
<li><p><strong>双子座 CLI：</strong>100 万个标记（约 75 万字）</p></li>
<li><p><strong>克劳德代码：</strong>约 200,000 个词块（约 150,000 个单词）</p></li>
</ul>
<p>较大的上下文窗口能让模型在生成响应时参考更多的输入内容。它们还有助于在多轮对话中保持对话的连贯性，让模型更好地记忆您的整个对话。</p>
<p>从本质上讲，Gemini CLI 可以在一次会话中分析整个中小型项目，是理解大型代码库和跨文件关系的理想工具。当你专注于特定文件或函数时，克劳德代码的效果会更好。</p>
<h3 id="3-Code-Quality-vs-Speed" class="common-anchor-header"><strong>3.代码质量与速度</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>特点</strong></td><td><strong>双子座 CLI</strong></td><td><strong>克劳德代码</strong></td><td><strong>注释</strong></td></tr>
<tr><td><strong>编码速度</strong></td><td>8.5/10</td><td>7.2/10</td><td>双子座生成代码的速度更快</td></tr>
<tr><td><strong>编码质量</strong></td><td>7.8/10</td><td>9.1/10</td><td>克劳德生成的代码质量更高</td></tr>
<tr><td><strong>错误处理</strong></td><td>7.5/10</td><td>8.8/10</td><td>克劳德的错误处理能力更强</td></tr>
<tr><td><strong>上下文理解</strong></td><td>9.2/10</td><td>7.9/10</td><td>双子座内存更长</td></tr>
<tr><td><strong>支持多种语言</strong></td><td>8.9/10</td><td>8.5/10</td><td>两者都很出色</td></tr>
</tbody>
</table>
<ul>
<li><p><strong>Gemini CLI</strong>生成代码的速度更快，并擅长理解大型上下文，因此非常适合快速原型开发。</p></li>
<li><p><strong>Claude Code 擅长</strong>精确性和错误处理，因此更适合对代码质量要求极高的生产环境。</p></li>
</ul>
<h3 id="4-Platform-Support-Where-Can-You-Run-It" class="common-anchor-header"><strong>4.平台支持：在哪里运行？</strong></h3><ul>
<li><p><strong>Gemini CLI</strong>从一开始就能在 Windows、macOS 和 Linux 上正常运行。</p></li>
<li><p><strong>Claude Code</strong>首先针对 macOS 进行了优化，虽然可以在其他平台上运行，但最佳体验还是在 Mac 上。</p></li>
</ul>
<h3 id="5-Authentication-and-Access" class="common-anchor-header"><strong>5.认证和访问</strong></h3><p><strong>Claude Code</strong>需要激活 Anthropic 订阅（Pro、Max、Team 或 Enterprise）或通过 AWS Bedrock/Vertex AI 访问 API。这意味着你需要在开始使用前设置计费。</p>
<p><strong>Gemini CLI</strong>为谷歌个人账户持有者提供了慷慨的免费计划，包括每天 1,000 次免费请求和每分钟 60 次对全功能 Gemini 2.0 Flash 模型的请求。需要更高限制或特定模型的用户可通过 API 密钥进行升级。</p>
<h3 id="6-Feature-Comparison-Overview" class="common-anchor-header"><strong>6.功能比较概述</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>功能</strong></td><td><strong>克劳德代码</strong></td><td><strong>双子座 CLI</strong></td></tr>
<tr><td>上下文窗口长度</td><td>200K 标记</td><td>1M 标记</td></tr>
<tr><td>多模式支持</td><td>有限</td><td>强大（图像、PDF 等）</td></tr>
<tr><td>代码理解</td><td>优秀</td><td>优秀</td></tr>
<tr><td>工具集成</td><td>基本</td><td>丰富（MCP 服务器）</td></tr>
<tr><td>安全性</td><td>企业级</td><td>标准</td></tr>
<tr><td>免费请求</td><td>有限</td><td>60/分钟，1000/天</td></tr>
</tbody>
</table>
<h2 id="When-to-Choose-Claude-Code-vs-Gemini-CLI" class="common-anchor-header">何时选择 Claude Code，何时选择 Gemini CLI？<button data-href="#When-to-Choose-Claude-Code-vs-Gemini-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我们已经比较了这两种工具的主要功能，下面就是我对何时选择这两种工具的看法：</p>
<p><strong>在以下情况下选择 Gemini CLI</strong></p>
<ul>
<li><p>优先考虑成本效益和快速实验</p></li>
<li><p>您正在开发需要大量上下文窗口的大型项目</p></li>
<li><p>您喜欢尖端的开源工具</p></li>
<li><p>跨平台兼容性至关重要</p></li>
<li><p>您需要强大的多模式功能</p></li>
</ul>
<p><strong>如果您有以下需求，请选择克劳德代码</strong></p>
<ul>
<li><p>您需要高质量的代码生成</p></li>
<li><p>您正在构建关键任务商业应用程序</p></li>
<li><p>企业级支持不可或缺</p></li>
<li><p>代码质量高于成本考虑</p></li>
<li><p>您主要在 macOS 上工作</p></li>
</ul>
<h2 id="Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">克劳德代码与 Gemini CLI：设置与最佳实践<button data-href="#Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我们已经对这两款终端人工智能工具的功能有了基本了解，下面就让我们来详细了解一下如何开始使用它们以及最佳实践。</p>
<h3 id="Claude-Code-Setup-and-Best-Practices" class="common-anchor-header">克劳德代码设置和最佳实践</h3><p><strong>安装：</strong>Claude Code 需要 npm 和 Node.js 18 或更高版本。</p>
<pre><code translate="no"><span class="hljs-comment"># Install Claude Code on your system</span>
npm install -g @anthropic-ai/claude-code

<span class="hljs-comment"># Set up API key</span>
claude config <span class="hljs-built_in">set</span> api-key YOUR_API_KEY

<span class="hljs-comment"># Verify installation was successful</span>
claude --version

<span class="hljs-comment"># Launch Claude Code</span>
Claude
<button class="copy-code-btn"></button></code></pre>
<p>****  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c413bbf950.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
****</p>
<p><strong>克劳德代码的最佳实践：</strong></p>
<ol>
<li><strong>从了解架构开始：</strong>在接触一个新项目时，让 Claude Code 首先使用自然语言帮助您了解整体结构。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Let Claude analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>要具体并提供上下文：</strong>你提供的上下文越多，克劳德代码的建议就越准确。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Implement specific features</span>
&gt; Implement an initial version <span class="hljs-keyword">for</span> GitHub issue <span class="hljs-meta">#123</span>

<span class="hljs-meta"># Code migration</span>
&gt; Help me migrate <span class="hljs-keyword">this</span> codebase to the latest Java version, first create a plan

<span class="hljs-meta"># Code refactoring</span>
&gt; Refactor <span class="hljs-keyword">this</span> function to make it more readable <span class="hljs-keyword">and</span> maintainable
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>将其用于调试和优化：</strong></li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Error analysis</span>
&gt; What caused <span class="hljs-keyword">this</span> error? How can we fix it?

<span class="hljs-meta"># Performance optimization</span>
&gt; Analyze the performance bottlenecks <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> code

<span class="hljs-meta"># Code review</span>
&gt; Review <span class="hljs-keyword">this</span> pull request <span class="hljs-keyword">and</span> point <span class="hljs-keyword">out</span> potential issues
<button class="copy-code-btn"></button></code></pre>
<p><strong>总结：</strong></p>
<ul>
<li><p>使用渐进式学习方法，从简单的代码解释开始，然后逐步过渡到更复杂的代码生成任务</p></li>
<li><p>保持对话上下文，因为克劳德代码会记住之前的讨论内容</p></li>
<li><p>使用<code translate="no">bug</code> 命令提供反馈，报告问题并帮助改进工具</p></li>
<li><p>通过查看数据 Collections 策略和谨慎处理敏感代码，保持安全意识</p></li>
</ul>
<h3 id="Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Gemini CLI 设置和最佳实践</h3><p><strong>安装：</strong>与 Claude Code 一样，Gemini CLI 也需要 npm 和 Node.js 18 或更高版本。</p>
<pre><code translate="no"><span class="hljs-comment"># Install Gemini CLI</span>
npm install -g @google/gemini-cli

<span class="hljs-comment"># Login to your Google account</span>
gemini auth login

<span class="hljs-comment"># Verify installation</span>
gemini --version

<span class="hljs-comment"># Launch Gemini CLI</span>
Gemini
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_bec1984bb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如果您有个人账户，请使用谷歌账户登录，以获得即时访问权限，每分钟仅限 60 次请求。如需更高限制，请配置您的 API 密钥：</p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GEMINI_API_KEY</span>=<span class="hljs-string">&quot;YOUR_API_KEY&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Gemini CLI 最佳实践：</strong></p>
<ol>
<li><strong>从了解架构开始：</strong>与 Claude Code 一样，在接触一个新项目时，让 Gemini CLI 首先使用自然语言帮助你了解整体结构。请注意，Gemini CLI 支持 100 万个标记上下文窗口，这使其在大规模代码库分析中非常有效。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>利用其多模态功能：</strong>这是 Gemini CLI 真正的闪光点。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Generate app from PDF</span>
&gt; Create a <span class="hljs-keyword">new</span> app based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> PDF design document

<span class="hljs-meta"># Generate code from sketch</span>
&gt; Generate frontend code based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> UI sketch

<span class="hljs-meta"># Image processing tasks</span>
&gt; Convert all images <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> directory to PNG format <span class="hljs-keyword">and</span> rename <span class="hljs-keyword">using</span> EXIF data
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>探索工具集成：</strong>Gemini CLI 可与多种工具和 MCP 服务器集成，以增强功能。</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Connect external tools</span>
&gt; Use MCP server to connect my <span class="hljs-built_in">local</span> system tools

<span class="hljs-comment"># Media generation</span>
&gt; Use Imagen to generate project logo

<span class="hljs-comment"># Search integration</span>
&gt; Use Google search tool to find related technical documentation
<button class="copy-code-btn"></button></code></pre>
<p><strong>总结：</strong></p>
<ul>
<li><p>以项目为导向：始终从项目目录启动 Gemini，以便更好地理解上下文。</p></li>
<li><p>通过使用图片、文档和其他媒体作为输入，而不仅仅是文本，最大限度地利用多模态功能</p></li>
<li><p>将外部工具与 MCP 服务器连接，探索工具集成</p></li>
<li><p>通过使用内置的谷歌搜索来获取最新信息，从而增强搜索能力</p></li>
</ul>
<h2 id="AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="common-anchor-header">人工智能代码一到就过时。如何用 Milvus 解决这个问题？<button data-href="#AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><em>克劳德代码（Claude Code）和双子座CLI等人工智能编码工具功能强大，但它们有一个盲点：</em> <strong><em>它们不知道什么是最新的</em></strong><em>。</em></p>
<p><em>现实是什么？大多数模型直接生成过时的模式。它们是几个月前，有时是几年前训练出来的。因此，虽然它们可以快速生成代码，但却无法保证这些代码能够反映</em> <strong><em>最新的 API</em></strong><em>、框架或 SDK 版本。</em></p>
<p><strong>真实例子</strong></p>
<p>如果询问 Cursor 如何连接 Milvus，你可能会得到这样的结果：</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>看起来很好，只是该方法已被弃用。推荐的方法是使用<code translate="no">MilvusClient</code> ，但大多数助手还不知道这一点。</p>
<p>或者使用 OpenAI 自己的 API。许多工具仍建议通过<code translate="no">openai.ChatCompletion</code> <code translate="no">gpt-3.5-turbo</code> ，这种方法已于 2024 年 3 月废弃。这种方法速度更慢、成本更高、结果更差。但 LLM 并不知道这一点。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_8f0d1a42b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5_3f4c4a0d4c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Fix-Real-Time-Intelligence-with-Milvus-MCP-+-RAG" class="common-anchor-header">解决之道Milvus MCP + RAG 实时智能技术</h3><p>为了解决这个问题，我们结合了两个强大的理念：</p>
<ul>
<li><p><strong>模型上下文协议（MCP）</strong>：通过自然语言与实时系统交互的 Agents 工具标准</p></li>
<li><p><strong>检索增强生成（RAG）</strong>：按需获取最新、最相关的内容</p></li>
</ul>
<p>这两者结合在一起，能让您的助手更智能、更及时。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_e6bc6cacd6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>工作原理如下</strong></p>
<ol>
<li><p>预处理文档、SDK 参考资料和 API 指南</p></li>
<li><p>将它们以向量嵌入的形式存储在我们的开源向量数据库<a href="https://milvus.io/"><strong>Milvus</strong></a> 中</p></li>
<li><p>当开发人员提问时（例如 "如何连接 Milvus？</p>
<ul>
<li><p>运行<strong>语义搜索</strong></p></li>
<li><p>检索最相关的文档和示例</p></li>
<li><p>将它们注入到助手的提示上下文中</p></li>
</ul></li>
</ol>
<ol start="4">
<li>结果：<strong>准确</strong>反映<strong>当前实际情况的</strong>代码建议</li>
</ol>
<h3 id="Live-Code-Live-Docs" class="common-anchor-header">实时代码，实时文档</h3><p>通过<strong>Milvus MCP 服务器</strong>，您可以将此流程直接插入您的编码环境。助手变得更聪明。代码变得更好。开发人员保持高效。</p>
<p>这不仅仅是理论上的，我们还与其他设置进行了测试，如 Cursor 的 Agents 模式、Context7 和 DeepWiki。区别何在？Milvus + MCP 不仅能总结项目，还能与项目保持同步。</p>
<p>看它的实际应用<a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">为什么您的 Vibe 编码会生成过时的代码，以及如何使用 Milvus MCP 解决这个问题 </a></p>
<h2 id="The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="common-anchor-header">编码的未来是对话式的--而且现在就在发生<button data-href="#The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>终端人工智能革命才刚刚开始。随着这些工具的成熟，我们很可能会看到与开发工作流更紧密的集成、更好的代码质量，以及通过 MCP+RAG 等方法解决货币问题。</p>
<p>无论您是因质量而选择 Claude Code，还是因其易用性和强大功能而选择 Gemini CLI，有一点是明确的：<strong>自然语言编程将继续存在。</strong>问题不在于是否采用这些工具，而在于如何将它们有效地集成到您的开发工作流程中。</p>
<p>我们正在见证从记忆语法到与代码对话的根本性转变。<strong>编码的未来是对话式的--它就发生在你的终端上。</strong></p>
<h2 id="Keep-Reading" class="common-anchor-header">继续阅读<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">使用 Spring Boot 和 Milvus 构建生产就绪的 AI 助手</a></p></li>
<li><p><a href="https://zilliz.com/blog/introducing-zilliz-mcp-server">使用 Spring Boot 和 Milvus 构建生产就绪的人工智能助手用自然语言访问向量数据库 - Zilliz 博客</a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0：向量数据库的真实世界基准测试 - Milvus 博客</a></p></li>
<li><p><a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">为什么您的 Vibe 编码会生成过时的代码以及如何使用 Milvus MCP 修复它</a></p></li>
<li><p><a href="https://milvus.io/blog/why-ai-databases-do-not-need-sql.md">为什么人工智能数据库不需要 SQL？ </a></p></li>
</ul>
