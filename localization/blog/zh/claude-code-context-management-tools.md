---
id: claude-code-context-management-tools.md
title: |
  7款最佳开源工具，用于管理Claude代码上下文
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: |
  长时间的克劳德代码会话会很快丢失信号。学习7种工具，用于过滤终端噪声、代码检索、工具输出、内存管理以及令牌使用。
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>即使为 Claude Code 提供 1M 个令牌的上下文窗口，随着时间推移，得到的答案质量仍会下降。问题不仅在于上下文大小，更在于上下文质量。</p>
<p>当终端日志、工具的原始输出、重复的文件读取、冗长的响应以及被遗忘的项目历史记录都在争夺注意力时，Claude Code的会话质量就会下降。在长期运行的代理工作流中，这种“噪音”会形成一个恶性循环：模型会偏离主题，你不得不增加更多轮交互来修正答案，而这些额外的交互又会带来更多的噪音。</p>
<p>这就是<strong>“上下文失焦”现象</strong>：模型有足够的空间容纳信息，但重要信息却被信号微弱的上下文所掩盖。更大的上下文窗口可能会让人更容易忽视这个问题，因为开发者不再仔细思考提示语中包含的内容。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>提示词缓存示意图，展示了重复使用的前缀如何在不同轮次中仍会增加计费上下文</span>
  
 </span></p>
<p>提示词缓存虽能降低前缀重复的成本，但并不会让上下文窗口变成“杂物抽屉”。新令牌仍需付费，且模型仍需对正确信息进行推理。</p>
<p>本文回顾了七种从不同层面对“上下文失焦”问题进行攻克的开源工具：终端输出、工具输出、代码库导航、文件读取、模型冗长度、语义代码检索以及跨会话记忆。同时，本文还阐述了这些思路如何映射到<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库设计</a>、<a href="https://zilliz.com/learn/vector-similarity-search">向量相似度搜索</a>以及 Milvus 等检索系统中。</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">是什么导致了 Claude Code 的上下文失焦？<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 的上下文失焦通常源于五种故障模式：过多的原始指令文本、噪声工具输出、重复的代码库探索、冗长的模型响应，以及跨会话或跨 Agents 的记忆缺失。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>Claude Code 上下文丢失的五大原因：冗余指令、杂乱的工具输出、重复的代码库检索、冗长的响应以及跨会话或跨代理的记忆缺失</span>
  
 </span></p>
<table>
<thead>
<tr><th>上下文失效模式</th><th>在 Claude Code 中的表现</th><th>可解决此问题的工具类别</th></tr>
</thead>
<tbody>
<tr><td>终端日志冗余</td><td><code translate="no">git</code>、<code translate="no">pytest</code> 、<code translate="no">gh</code> 以及云端CLI输出的文本量往往超过模型所需。</td><td>CLI 输出压缩</td></tr>
<tr><td>工具输出淹没了窗口</td><td>测试日志、DOM 转储和 MCP 输出以巨大的原始数据块形式进入聊天窗口。</td><td>工具输出沙箱化</td></tr>
<tr><td>代码库导航重复</td><td>Claude 列出目录、执行 grep 操作、读取文件，并在每次会话中重复相同的探索过程。</td><td>代码图或语义检索</td></tr>
<tr><td>文件读取范围过广</td><td>模型仅需一个符号或摘要时，却会读取整个文件。</td><td>渐进式代码阅读</td></tr>
<tr><td>克劳德说话太多</td><td>答案本身为后续对话添加了不必要的上下文。</td><td>响应压缩</td></tr>
<tr><td>记忆无法保留</td><td>每次开始新会话时，你都要重新解释项目决策。</td><td>以 Markdown 为先的记忆机制</td></tr>
</tbody>
</table>
<p>一个优秀的上下文管理方案应做到三点：过滤掉无关信息、按需检索正确的项目知识，并在不同会话间持久保存已做出的决策。</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">你应该先使用哪款 Claude Code 上下文工具？<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>从在你的工作流中产生最多干扰的那一层开始。如果终端输出是问题所在，就从 RTK 开始。如果 Claude 总是在庞大的代码库中漫无目的地游走，就从 claude-context 或 code-review-graph 开始。如果你真正的痛点是每天都要重新解释相同的决策，那就从 memsearch 开始。</p>
<table>
<thead>
<tr><th>工具</th><th>主要解决的问题</th><th>最适合</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>常见开发者命令产生的冗余终端输出。</td><td>在 Claude Code 中运行大量 CLI 命令的开发者。</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">上下文模式</a></td><td>大量原始工具输出进入主对话。</td><td>大量使用 Playwright、GitHub、日志或 MCP 工具的用户。</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>在大型代码库中进行盲探。</td><td>代码审查、依赖关系分析以及影响范围相关问题。</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>明明符号摘要就足够了，却还要读取整个文件。</td><td>大文件、重复的符号查找以及增量代码读取。</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Claude自身冗长的回复习惯。</td><td>希望输出简洁且未来上下文更小的用户。</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>每次会话都要重新探索代码库。</td><td>通过 MCP 进行语义代码搜索。</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>在不同会话、Agents和模型切换之间丢失项目记忆。</td><td>具有持久决策和经验教训的长期项目。</td></tr>
</tbody>
</table>
<p>前五种工具可减少进入或保留在上下文中的内容。后两种工具则使有用的上下文更易于调用。</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK 在 Claude 看到原始命令输出之前对其进行压缩<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK 是一个用于减少常见开发者命令令牌消耗的 CLI 代理。其 GitHub 描述称，它能将常见开发命令的 LLM 令牌消耗降低 60-90%，并以单个 Rust 二进制文件的形式发布。</p>
<p>在日常的 Claude Code 使用中，诸如 `<code translate="no">git status</code>`、`<code translate="no">pytest</code>` 以及目录列表等命令，往往会将完整的环境信息和状态描述倾倒到上下文窗口中。而模型通常只需要更简短的回答：哪些文件发生了变化、哪些测试失败了、PR 卡在哪个环节，或者目录中存在哪些关键文件。</p>
<p>RTK 位于 shell 和 Claude 之间。它可以通过 Claude Code 钩子重写命令，并返回压缩后的输出结果。</p>
<p><code translate="no">git status</code> 的原始输出：</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>真正重要的内容：</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">pytest</code> 也是同样的情况。原始输出中充斥着通过的测试用例和环境噪音：</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>经过压缩后，信号立竿见影：</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>当上下文膨胀源于 shell 命令而非代码检索时，RTK 是最简单的切入点。</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">上下文模式将庞大的工具输出隔离在主聊天窗口之外<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>上下文模式专为工具返回的原始数据块而设计：测试日志、浏览器 DOM 快照、GitHub 有效载荷、MCP 工具输出以及抓取的网页。其 GitHub 描述突出了针对 AI 编码 Agents 的上下文窗口优化，并报告称工具输出量减少了 98%。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>Context Mode GitHub 仓库卡片展示了隔离的工具输出及上下文优化定位</span>
  
 </span></p>
<p>其方法是将大型工具输出隔离到本地沙箱并建立索引，随后仅将摘要和检索句柄传递至 Claude 对话中。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>Context Mode 流程图，展示了大型工具输出如何经过沙箱执行、SQLite 或 FTS 索引、摘要生成及检索结果</span>
  
 </span></p>
<p>该流程非常实用，因为编码代理通常只需要故障节点、失效的选择器或相关的堆栈跟踪，而非整个 DOM 或每一行通过测试的代码。Context Mode 既确保完整输出在本地可用，又防止其占据主要对话空间。</p>
<p>这类似于生产环境中的<a href="https://zilliz.com/blog/hybrid-search-with-milvus">混合搜索</a>系统将存储与检索分离的方式。您将原始数据保存在某个持久存储位置，然后仅检索其中关键的部分。</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph 在 Claude 遍历代码之前映射代码结构<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph 解决了一个不同的问题：Claude 并不总是需要更多的文本；它需要的是更完善的映射。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>原文中使用的 code-review-graph 标志图片</span>
  
 </span></p>
<p>在大型代码库中，一个简单的问题可能会触发耗时的探索：</p>
<blockquote>
<p>修改了这个登录逻辑后，哪些文件和测试会受到影响？</p>
</blockquote>
<p>如果没有代码图，Claude 的典型操作是：</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph 会预先构建代码库的结构映射。它利用 Tree-sitter 解析函数、类、导入、调用关系、继承关系以及测试依赖关系，随后将该图写入 SQLite。</p>
<p>这使其在代码审查和影响范围分析中非常有用。与其让 Claude 通过反复读取来重新发现依赖关系图，不如先让它查询结构。</p>
<p>这与<a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">语义搜索</a>相近，但并不完全相同。结构图回答“什么依赖于什么？”，而语义检索则回答“哪些代码在概念上与这个问题相关？”。在实际的代码助手工作流中，通常需要两者兼备。</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior 在发送完整文件前先向 Claude 提供符号摘要<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Token Savior 的核心理念很简单：默认情况下不发送完整文件。先发送索引或符号摘要，仅在任务需要更多细节时才进行展开。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>Token Savior 的 GitHub 仓库卡片，展示了其 MCP 服务器描述和项目统计数据</span>
  
 </span></p>
<p>如果你询问支付 webhook 在何处被处理，模型通常并不需要每个相关文件的每一行代码。它首先需要知道某个文件或符号是否相关。</p>
<p>Token Savior 采用分层方式提供代码：</p>
<table>
<thead>
<tr><th>层级</th><th>Claude 接收的内容</th><th>展开时</th></tr>
</thead>
<tbody>
<tr><td>摘要</td><td>索引、符号名称和简短描述。</td><td>默认的首次响应。</td></tr>
<tr><td>代码片段</td><td>围绕相关符号的较小代码片段。</td><td>当摘要可能相关时。</td></tr>
<tr><td>完整文件</td><td>完整的文件内容。</td><td>仅在编辑或深度推理需要时才显示。</td></tr>
</tbody>
</table>
<p>这反映了开发者实际阅读代码的方式：先快速浏览、确认相关性，然后仅在必要时才打开完整文件。这也类似于<a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG 应用中</a>使用的渐进式检索模式：先进行范围较广的检索以把握方向，然后在生成内容前缩小上下文范围。</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman 解决了 Claude 自身响应冗余的问题<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>大多数上下文工具关注的是输入模型的内容。Caveman 则针对 Claude 的输出结果。</p>
<p>Caveman 是一款针对 Claude Code 的技能/插件，可去除填充语、客套话、包装句、过度解释和重复结构。其目标并非删除知识，而是让答案更精炼。</p>
<p>未使用 Caveman 时：</p>
<blockquote>
<p>你的 React 组件之所以会重新渲染，很可能是因为……</p>
</blockquote>
<p>使用 Caveman 后：</p>
<blockquote>
<p>每次渲染都会生成新的对象引用。内联对象 prop = new ref = 重新渲染。请使用 useMemo 包裹。</p>
</blockquote>
<p>这一点很重要，因为 Claude 自身的回答会成为未来的上下文。如果每个回答都包含冗长的解释，那么下一轮对话的起始文本量就会超过实际需求。简短的回答不仅能优化当前轮次，也能显著提升下一轮的对话质量。</p>
<p>对于正在考虑<a href="https://zilliz.com/blog/context-engineering-for-ai-agents">为 AI Agents 进行上下文工程的</a>团队而言，Caveman 提醒我们：输出策略是上下文策略的一部分。</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context 通过 MCP 实现语义代码搜索<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context 通过语义检索解决了代码库重复探索的问题。它对代码库进行索引，将代码片段存储在向量数据库中，并通过<a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">模型上下文协议</a>（MCP）提供搜索功能。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>GitHub 上展示的 Claude Context 代码库原文中的热门话题</span>
  
 </span></p>
<p>在庞大的代码库中，你经常会向 Claude 提出这样的问题：</p>
<blockquote>
<p>帮我找出代码中哪些部分可能与这个 bug 有关。</p>
</blockquote>
<p>如果没有检索层，Claude 的默认处理方式通常是：</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context 将这些工作转移到了检索层。它将代码库分割为代码片段，生成 Embeddings，将其存储在<a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">由 Milvus 支持的代码索引</a>中，并在模型开始盲目读取文件之前检索相关代码片段。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>claude-context 工作流示意图：展示代码库分块、Embeddings、向量数据库与混合搜索、相关代码检索以及 Claude 上下文注入</span>
  
 </span></p>
<p>正是在这一点上，AI 编码工具开始呈现出搜索系统的特征。你需要分块、Embeddings、元数据、词法匹配、排序以及时效性。这些正是<a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">生产级 RAG 检索</a>、<a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">混合检索路由</a>以及<a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">嵌入模型选择</a>背后的相同构建模块。</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch 能在不同会话和 Agents 之间保留有用的记忆<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch 则从问题的另一面入手：不是考虑该忘记什么，而是如何回忆起关键内容。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>memsearch 标志图片来自原文</span>
  
 </span></p>
<p>假设你在周一告诉 Claude：</p>
<blockquote>
<p>我们的 webhook 在失败时无法重试——失败的事件需要进入死信队列。</p>
</blockquote>
<p>周三，你开启一个新会话并询问：</p>
<blockquote>
<p>Webhook 层还有哪些地方可以优化？</p>
</blockquote>
<p>由于缺乏持久化存储，Claude 会将周一的决定视为从未发生过。你不得不再次解释。</p>
<p>memsearch 将记忆存储为本地、可供人类阅读的 Markdown 文件，并使用 Milvus 作为可重建的检索索引。这种设计既保持了人类对记忆的可编辑性，又确保了 Agents 能够对其进行检索。</p>
<p>在检索时，memsearch 采用渐进式检索：先搜索，如有需要则展开，仅在必要时才深入到原始对话记录。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>memsearch 渐进式检索流程示意图，展示搜索、扩展、对话记录以及返回主对话的摘要</span>
  
 </span></p>
<p>这种“Markdown优先”模式对于跨会话、跨模型和跨智能代理协作的团队非常有用。它还与<a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">长期AI智能代理记忆</a>、<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">共享的多智能代理记忆</a>，以及<a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">智能代理系统中</a>防止<a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">上下文腐烂</a>这一更广泛的问题自然契合。</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">这些工具如何协同工作？<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>这七种工具是互补的，而非可互换的。请将其作为分层结构来使用。</p>
<table>
<thead>
<tr><th>层级</th><th>使用这些工具</th><th>原因</th></tr>
</thead>
<tbody>
<tr><td>消除命令噪声</td><td>RTK</td><td>在终端输出数据传至Claude之前对其进行压缩。</td></tr>
<tr><td>沙盒处理原始工具输出</td><td>上下文模式</td><td>将大型日志、DOM 和工具有效载荷保留在主对话之外。</td></tr>
<tr><td>映射代码结构</td><td>代码审查图</td><td>无需盲目读取文件即可解答依赖关系和影响范围问题。</td></tr>
<tr><td>渐进式阅读代码</td><td>标记拯救者</td><td>从符号摘要开始，仅在需要时展开。</td></tr>
<tr><td>压缩 Claude 的回答</td><td>Caveman</td><td>防止模型自身的输出成为未来上下文的冗余负担。</td></tr>
<tr><td>检索相关代码</td><td>claude-context</td><td>使用语义和混合代码搜索，取代重复的 grep 循环。</td></tr>
<tr><td>复用持久的决策</td><td>memsearch</td><td>在不同会话、Agents和模型切换之间调用项目历史记录。</td></tr>
</tbody>
</table>
<p>一个实用的部署顺序是：</p>
<ol>
<li><strong>首先消除明显的噪声。</strong>如果 shell 输出和工具负载占据了上下文的主体，则添加 RTK 或上下文模式。</li>
<li><strong>修复代码库导航。</strong>添加 code-review-graph 以优化结构，或使用 claude-context 进行语义代码检索。</li>
<li><strong>控制剩余内容。</strong>使用 Token Savior 和 Caveman 来保持文件读取和模型响应的紧凑性。</li>
<li><strong>保留持久性知识。</strong>当重复解释成为瓶颈时，使用 memsearch。</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">保持联系<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区，</a>向其他开发者提问并交流上下文管理模式。</li>
<li>如需帮助设计适用于代码、记忆或 RAG 工作负载的检索层，<a href="https://milvus.io/office-hours">请预约免费的 Milvus 办公时间咨询</a>。</li>
<li>如果您希望跳过基础设施的部署<a href="https://cloud.zilliz.com/signup">，Zilliz Cloud</a>（托管版 Milvus）提供免费套餐供您入门。</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常见问题<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>如何在不丢失有用上下文的情况下减少 Claude Code 的令牌使用量？</strong></p>
<p>首先压缩噪声最大的输入：终端输出、原始工具有效载荷以及重复的代码读取。然后添加 claude-context 或 code-review-graph 等检索工具，这样 Claude 就能提取相关代码，而无需从头开始探索代码库。</p>
<p><strong>对于大型代码库，应该使用 claude-context 还是 code-review-graph？</strong></p>
<p>当您需要语义代码搜索时（尤其是不知道确切文件名或符号名时），请使用 claude-context；当您需要结构化答案（如调用关系、导入、测试依赖项以及代码审查影响范围）时，请使用 code-review-graph。</p>
<p><strong>Claude Code 中的“记忆检索”与“代码检索”有何区别？</strong></p>
<p>是的。代码检索用于查找相关的项目文件或符号；记忆检索则用于调取持久的决策、用户偏好、调试历史以及跨会话的学习成果。memsearch 侧重于记忆检索；claude-context 侧重于代码检索。</p>
<p><strong>这些工具能否替代提示词缓存或更大的上下文窗口？</strong></p>
<p>不。提示词缓存和大上下文窗口有助于提升容量和降低成本，但它们无法决定哪些信息值得关注。上下文管理工具则从源头提升了输入模型的信息质量和密度。<span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
