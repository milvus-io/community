---
id: claude-code-context-management-tools.md
title: 用于克劳德代码上下文管理的 7 个最佳开源工具
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/claude_code_context_management_tools_16_9fdd81ad02.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: 冗长的克劳德代码会话很快就会失去信号。学习 7 种工具，以减少终端噪音、代码检索、工具输出、内存和令牌使用。
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>你可以给克劳德代码一个 100 万个令牌的上下文窗口，但随着时间的推移，得到的答案仍然会越来越差。问题不仅在于上下文大小，还在于上下文质量。而是上下文质量。</p>
<p>当终端日志、原始工具输出、重复文件读取、冗长响应和被遗忘的项目历史都在争夺注意力时，克劳德代码会话的质量就会下降。在长期运行的 Agents 工作流程中，这些噪音会变成一个循环：模型失去了线程，你需要增加更多的回合来解决答案，而这些额外的回合又会增加更多的噪音。</p>
<p>这就是<strong>上下文失焦</strong>：模型有足够的空间容纳信息，但重要信息却被埋没在低信号上下文中。更大的窗口会使这种情况更容易被忽略，因为开发人员不再仔细考虑进入提示的内容。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>提示缓存示意图，显示重复使用的前缀如何仍能跨轮次添加计费上下文</span> </span></p>
<p>提示缓存可以降低重复使用前缀的成本，但并不会将上下文窗口变成垃圾抽屉。你仍然需要为新标记付费，仍然需要模型来推理正确的信息。</p>
<p>本文回顾了七种开源工具，它们从不同层面解决了上下文失焦问题：终端输出、工具输出、代码库导航、文件阅读、模型冗余、语义代码检索和跨会话记忆。它还解释了这些想法如何映射到<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>设计、<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性搜索</a>以及 Milvus 等检索系统。</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">克劳德代码上下文失焦的原因是什么？<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>克劳德代码上下文失焦通常来自五种故障模式：原始指令文本过多、工具输出噪音过大、重复代码库探索、模型响应时间过长以及跨会话或 Agents 的记忆间隙。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>克劳德代码上下文丢失的五个原因：冗余指令、杂乱的工具输出、重复的代码库检索、冗长的响应和记忆间隙</span> </span></p>
<table>
<thead>
<tr><th>上下文失效模式</th><th>在克劳德代码中的表现</th><th>有帮助的工具类别</th></tr>
</thead>
<tbody>
<tr><td>终端日志嘈杂</td><td><code translate="no">git</code>,<code translate="no">pytest</code>,<code translate="no">gh</code>, 和云 CLI 转储的文本比模型需要的要多。</td><td>CLI 输出压缩</td></tr>
<tr><td>工具输出充斥窗口</td><td>测试日志、DOM 转储和 MCP 输出以巨大的原始块形式进入聊天窗口。</td><td>工具输出沙箱</td></tr>
<tr><td>代码库导航重复</td><td>Claude 会列出目录、进行搜索、读取文件，并在每个会话中重复相同的探索。</td><td>代码图或语义检索</td></tr>
<tr><td>文件读取范围太广</td><td>当模型只需要一个符号或摘要时，却读取了整个文件。</td><td>渐进式代码读取</td></tr>
<tr><td>克劳德说得太多</td><td>答案本身为未来的转向增加了不必要的上下文。</td><td>响应压缩</td></tr>
<tr><td>记忆不持久</td><td>每次开始新的会话时，都要重新解释项目决策。</td><td>Markdown 优先记忆</td></tr>
</tbody>
</table>
<p>一个好的上下文管理堆栈应该做到以下三点：防止垃圾信息进入、按需检索正确的项目知识、跨会话保存持久的决策。</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">你应该首先使用哪个克劳德代码上下文工具？<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>从工作流程中产生噪音最大的层开始。如果问题出在终端输出上，那就从 RTK 开始。如果克劳德一直在一个大型版本库中徘徊，那就从 claude-context 或 code-review-graph 开始。如果你真正的痛苦是每天都要重新解释同样的决定，那就从 memsearch 开始吧。</p>
<table>
<thead>
<tr><th>工具</th><th>解决的主要问题</th><th>最适合</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>开发人员常用命令产生的嘈杂终端输出。</td><td>在克劳德代码中运行许多 CLI 命令的开发人员。</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">上下文模式</a></td><td>大量原始工具输出进入主对话。</td><td>大量使用 Playwright、GitHub、日志或 MCP 工具的用户。</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">代码审查图</a></td><td>在大型仓库中盲目探索代码库。</td><td>审查、依赖性分析和爆炸半径问题。</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">代币救星</a></td><td>只需符号摘要即可读取完整文件。</td><td>大文件、重复符号查找和增量代码阅读。</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">野人</a></td><td>克劳德自己的冗长响应习惯。</td><td>需要简洁的输出和较小的未来上下文的用户。</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">克劳德上下文</a></td><td>每次会话都重新探索代码库。</td><td>通过 MCP 进行语义代码搜索。</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">记忆搜索</a></td><td>跨会话、Agent 和模型切换丢失项目记忆。</td><td>具有持久决策和经验教训的长期项目。</td></tr>
</tbody>
</table>
<p>前五个工具减少了进入或留在上下文中的内容。后两种工具可使有用的上下文更容易调用。</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK 在克劳德看到之前压缩原始命令输出<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
<p>RTK 是一种 CLI 代理，用于减少开发人员常用命令的标记使用量。它在 GitHub 上的描述称，它能将常用开发命令的 LLM 令牌消耗量减少 60-90%，并以单个 Rust 二进制文件的形式发布。</p>
<p>在克劳德代码的日常使用中，像<code translate="no">git status</code> 、<code translate="no">pytest</code> 和目录列表这样的命令经常会将完整的环境信息和状态描述转储到上下文窗口中。模型通常只需要一个较小的答案：哪些文件发生了变化、哪些测试失败了、PR 在哪里卡住了，或者目录中存在哪些关键文件。</p>
<p>RTK 位于 shell 和 Claude 之间。它可以通过 Claude 代码钩子重写命令，并传回压缩输出。</p>
<p>原始<code translate="no">git status</code> 输出：</p>
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
<p>与<code translate="no">pytest</code> 的情况相同。原始输出充满了传递案例和环境噪音：</p>
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
<p>压缩后，信号是直接的：</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>当你的上下文臃肿来自 shell 命令而非代码检索时，RTK 是最简单的起点。</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">上下文模式沙盒将巨大的工具输出置于主聊天之外<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>上下文模式专为工具返回的原始数据块而设计：测试日志、浏览器 DOM 快照、GitHub 有效载荷、MCP 工具输出和刮擦页面。它在 GitHub 上的描述强调了针对人工智能编码 Agents 的上下文窗口优化，并报告称工具输出减少了 98%。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>上下文模式 GitHub 存储库卡显示沙盒工具输出和上下文优化定位</span> </span></p>
<p>其方法是将大型工具输出隔离到本地沙箱和索引中，然后只将摘要和检索句柄传递到克劳德对话中。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>上下文模式流程显示大型工具输出在沙箱执行、SQLite 或 FTS 索引、摘要和检索结果中的移动情况</span> </span></p>
<p>该流程非常有用，因为编码 Agents 通常需要的是失败的节点、损坏的选择器或相关堆栈跟踪，而不是整个 DOM 或每个通过的测试行。上下文模式可在本地保留完整的输出，同时防止其占据主要对话。</p>
<p>这与生产型<a href="https://zilliz.com/blog/hybrid-search-with-milvus">混合搜索</a>系统将存储与检索分开的方式类似。你可以将原始数据保存在某个持久的地方，然后只检索重要的部分。</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">代码审查图在克劳德浏览代码之前映射代码结构<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph 解决的是一个不同的问题：克劳德并不总是需要更多的文本，而是需要一个更好的地图。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>原始文章中使用的 code-review-graph 徽标图片</span> </span></p>
<p>在一个大型版本库中，一个简单的问题就可能引发昂贵的探索：</p>
<blockquote>
<p>改变这个登录逻辑后，哪些文件和测试会受到影响？</p>
</blockquote>
<p>如果没有代码图，克劳德的典型做法是：</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph 预先构建了代码库的结构图。它使用 Tree-sitter 来解析函数、类、导入、调用关系、继承和测试依赖关系，然后将图写入 SQLite。</p>
<p>这使得它在代码审查和爆炸半径分析中非常有用。与其让克劳德通过反复读取来重新发现依赖关系图，不如让它先查询结构。</p>
<p>这与<a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">语义搜索</a>相近，但并不相同。结构图回答的是 "什么依赖于什么？语义检索回答的是 "哪些代码在概念上与这个问题相关？在实际的代码辅助工作流程中，你往往希望两者兼得。</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior 在完整文件之前提供克劳德符号摘要<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Token Savior 的核心理念很简单：默认情况下不发送完整文件。先发送索引或符号摘要，然后在任务需要更多细节时再扩展。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>Token Savior GitHub 存储库卡片显示其 MCP 服务器说明和项目统计数据</span> </span></p>
<p>如果询问支付 webhook 在哪里处理，模型往往不需要每个相关文件的每一行。它首先需要知道某个文件或符号是否相关。</p>
<p>令牌救星分层提供代码：</p>
<table>
<thead>
<tr><th>层</th><th>克劳德接收的内容</th><th>何时扩展</th></tr>
</thead>
<tbody>
<tr><td>摘要</td><td>索引、符号名称和简短描述。</td><td>默认第一响应。</td></tr>
<tr><td>代码片段</td><td>围绕相关符号的较小代码段。</td><td>当摘要可能相关时。</td></tr>
<tr><td>完整文件</td><td>完整的文件内容。</td><td>只有在编辑或深入推理时才需要。</td></tr>
</tbody>
</table>
<p>这反映了开发人员实际阅读代码的方式。您需要扫描、确认相关性，然后仅在必要时打开完整文件。这也类似于<a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG 应用程序</a>中使用的渐进式检索模式：检索范围广泛，足以确定方向，然后在生成前缩小上下文范围。</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman 减少了克劳德自身响应的臃肿<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>大多数上下文工具都关注进入模型的内容。Caveman 的目标是克劳德输出的内容。</p>
<p>Caveman 是克劳德代码的一项技能/插件，可去除填充、寒暄、包装句、过度解释和重复结构。其目的不是去除知识，而是让答案更密集。</p>
<p>没有野人：</p>
<blockquote>
<p>你的 React 组件重新渲染的原因可能是...</p>
</blockquote>
<p>有了 Caveman</p>
<blockquote>
<p>每次渲染都有新的对象 ref。Inline object prop = new ref = re-render.在 useMemo 中打包。</p>
</blockquote>
<p>这很重要，因为克劳德自己的答案会成为未来的上下文。如果每个答案都包含冗长的解释，那么下一轮开始时的文字就会超出需要。简短的答案可以改善下一轮，就像改善当前一轮一样。</p>
<p>对于考虑<a href="https://zilliz.com/blog/context-engineering-for-ai-agents">人工智能 Agents 上下文工程的</a>团队来说，"洞穴人 "提醒我们，输出策略是上下文策略的一部分。</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context 通过 MCP 增加了语义代码搜索功能<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context 通过语义检索解决了重复代码库探索问题。它为一个资源库编制索引，将代码块存储在向量数据库中，并通过<a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">模型上下文协议</a>公开搜索。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>原文中 GitHub 上显示的 Claude Context 代码库趋势</span> </span></p>
<p>在一个大型代码库中，你会经常向 Claude 提出这样的问题：</p>
<blockquote>
<p>帮我找出代码中哪些部分可能与这个 bug 有关。</p>
</blockquote>
<p>在没有检索层的情况下，Claude 的默认方法通常是："......"：</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>Claude-context 会将这些工作转移到检索层。它对资源库进行分块，生成 Embeddings，将其存储在<a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">Milvus 支持的代码索引</a>中，并在模型开始盲读文件之前检索相关的代码块。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>claude-context 流程显示代码库分块、嵌入、向量数据库和混合搜索、相关代码检索和 Claude 上下文注入</span> </span></p>
<p>这就是人工智能编码工具开始像搜索系统的地方。你需要分块、嵌入、元数据、词性匹配、排名和新鲜度。这些都是<a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">生产型 RAG 检索</a>、<a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">混合检索路由</a>和<a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">嵌入模型选择</a>背后的相同构件。</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch 跨会话和代理保留有用的记忆<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch 解决的是问题的另一面：不是忘记什么，而是如何回忆起重要的东西。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>memsearch徽标图片来自原文</span> </span></p>
<p>想象一下，你在周一告诉克劳德：</p>
<blockquote>
<p>我们的 webhook 不能在失败时重试--失败的事件需要进入死信队列。</p>
</blockquote>
<p>周三，您打开一个新会话并问道："我们还能在网络钩子中优化什么？</p>
<blockquote>
<p>我们还能在 webhook 层优化什么？</p>
</blockquote>
<p>没有持久记忆，克劳德会把周一的决定当作从未发生过。你再解释一遍。</p>
<p>memsearch 将内存存储为本地的、人类可读的 Markdown 文件，并使用 Milvus 作为可重建的检索索引。这样的设计既能让人类编辑内存，又能让代理搜索内存。</p>
<p>在检索时，memsearch 采用渐进式检索：首先进行搜索，必要时进行扩展，只有在必要时才深入到原始文本。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>memsearch 的渐进式检索流程显示了搜索、扩展、转录和归纳后返回主对话的过程</span> </span></p>
<p>这种 Markdown 优先模式对跨会话、模型和 Agents 的团队工作非常有用。它还能与<a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">长期人工智能 Agents 记忆</a>、<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">共享多代理</a> <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">记忆</a>以及防止<a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">代理系统中上下文腐烂</a>这一更广泛的问题自然搭配。</p>
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
    </button></h2><p>这七种工具是互补的，不能互换。将它们作为层来使用。</p>
<table>
<thead>
<tr><th>层</th><th>使用这些工具</th><th>为什么</th></tr>
</thead>
<tbody>
<tr><td>消除指令噪音</td><td>RTK</td><td>在大量终端输出到达克劳德之前对其进行压缩。</td></tr>
<tr><td>沙盒原始工具输出</td><td>上下文模式</td><td>将大型日志、DOM 和工具有效载荷保留在主对话之外。</td></tr>
<tr><td>映射代码结构</td><td>代码审查图</td><td>回答依赖性和爆炸半径问题，无需盲目读取文件。</td></tr>
<tr><td>逐步读取代码</td><td>代币拯救者</td><td>从符号摘要开始，然后根据需要进行扩展。</td></tr>
<tr><td>压缩克劳德的答案</td><td>洞穴人</td><td>防止模型自身的输出成为未来上下文的累赘。</td></tr>
<tr><td>检索相关代码</td><td>克劳德上下文</td><td>使用语义和混合代码搜索，而不是重复的 grep 循环。</td></tr>
<tr><td>重用持久决策</td><td>记忆搜索</td><td>跨会话、Agent 和模型切换调用项目历史。</td></tr>
</tbody>
</table>
<p>一个实用的推出顺序是</p>
<ol>
<li><strong>先消除明显的噪音。</strong>如果 shell 输出和工具有效载荷在上下文中占主导地位，则添加 RTK 或上下文模式。</li>
<li><strong>修复版本库导航。</strong>为结构添加代码审查图（code-review-graph），或为语义代码检索添加条款上下文（claude-context）。</li>
<li><strong>控制剩余内容</strong>使用 Token Savior 和 Caveman 保持文件读取和模型响应的紧凑性。</li>
<li><strong>保存持久知识。</strong>当重复解释成为瓶颈时，使用 memsearch。</li>
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
<li>加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区</a>，提出问题并与其他开发人员比较上下文管理模式。</li>
<li>如果您希望获得帮助，为代码、内存或 RAG 工作负载设计检索层，可<a href="https://milvus.io/office-hours">预订 Milvus Office Hours 免费课程</a>。</li>
<li>如果您想跳过基础架构设置，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（Milvus 托管）提供免费层级供您开始使用。</li>
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
    </button></h2><p><strong>如何在不丢失有用上下文的情况下减少克劳德代码令牌的使用量？</strong></p>
<p>首先压缩噪音最大的输入：终端输出、原始工具有效载荷和重复代码读取。然后添加检索工具，如 claude-context 或 code-review-graph，这样克劳德就能提取相关代码，而不是从头开始探索版本库。</p>
<p><strong>大型版本库应该使用 claude-context 还是 code-review-graph？</strong></p>
<p>需要语义代码搜索时，尤其是不知道确切文件或符号名称时，请使用 claude-context。如果需要结构性答案，如调用关系、导入、测试依赖性和审查爆炸半径，则使用代码审查图。</p>
<p><strong>记忆与克劳德代码中的代码检索不同吗？</strong></p>
<p>是的。代码检索可以找到相关的项目文件或符号。Memsearch 侧重于记忆，而 claude-context 侧重于代码检索。</p>
<p><strong>这些工具是否能取代提示缓存或更大的上下文窗口？</strong></p>
<p>提示缓存和较大的上下文窗口有助于提高容量和成本，但并不能决定哪些信息值得关注。上下文管理工具可以提高首先进入模型的信息的质量和密度。</p>
