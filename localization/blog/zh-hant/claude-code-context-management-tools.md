---
id: claude-code-context-management-tools.md
title: 適用於 Claude 程式碼上下文管理的 7 個最佳開放原始碼工具
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
desc: 長時間的 Claude Code 會話會快速失去訊號。學習 7 種工具，用於修剪終端雜訊、代碼檢索、工具輸出、記憶體和令牌使用。
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>You can give Claude Code a 1M-token context window and still get worse answers over time. The issue is not only context size. It is context quality.</p>
<p>Claude Code sessions degrade when terminal logs, raw tool output, repeated file reads, verbose responses, and forgotten project history all compete for attention. In long-running agent workflows, that noise turns into a loop: the model loses the thread, you add more turns to fix the answer, and those extra turns add even more noise.</p>
<p>This is <strong>context defocus</strong>: the model has enough room to hold information, but the important information is buried under low-signal context. Bigger windows can make this easier to ignore because developers stop thinking carefully about what enters the prompt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
    <span>Prompt caching diagram showing how reused prefixes can still add billed context across turns</span>
  </span>
</p>
<p>Prompt caching can reduce repeated-prefix cost, but it does not turn the context window into a junk drawer. You still pay for new tokens, and you still need the model to reason over the right information.</p>
<p>This article reviews seven open-source tools that attack context defocus from different layers: terminal output, tool output, codebase navigation, file reading, model verbosity, semantic code retrieval, and cross-session memory. It also explains how these ideas map to <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> design, <a href="https://zilliz.com/learn/vector-similarity-search">vector similarity search</a>, and retrieval systems such as Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">What causes Claude Code context defocus?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code context defocus usually comes from five failure modes: too much raw instruction text, noisy tool output, repeated codebase exploration, long model responses, and memory gaps across sessions or agents.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
    <span>Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps</span>
  </span>
</p>
<table>
<thead>
<tr><th>Context failure mode</th><th>What it looks like in Claude Code</th><th>Tool category that helps</th></tr>
</thead>
<tbody>
<tr><td>Terminal logs are noisy</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code>, and cloud CLIs dump more text than the model needs.</td><td>CLI output compression</td></tr>
<tr><td>Tool outputs flood the window</td><td>Test logs, DOM dumps, and MCP outputs enter the chat as giant raw blocks.</td><td>Tool-output sandboxing</td></tr>
<tr><td>Codebase navigation repeats</td><td>Claude lists directories, greps, reads files, and repeats the same exploration every session.</td><td>Code graph or semantic retrieval</td></tr>
<tr><td>File reads are too broad</td><td>The model reads a whole file when it only needed one symbol or summary.</td><td>Progressive code reading</td></tr>
<tr><td>Claude talks too much</td><td>The answer itself adds unnecessary context for future turns.</td><td>Response compression</td></tr>
<tr><td>Memory does not persist</td><td>You re-explain project decisions every time you start a new session.</td><td>Markdown-first memory</td></tr>
</tbody>
</table>
<p>A good context-management stack should do three things: keep junk out, retrieve the right project knowledge on demand, and preserve durable decisions across sessions.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Which Claude Code context tool should you use first?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Start with the layer that creates the most noise in your workflow. If your terminal output is the problem, start with RTK. If Claude keeps wandering through a large repository, start with claude-context or code-review-graph. If your real pain is re-explaining the same decisions every day, start with memsearch.</p>
<table>
<thead>
<tr><th>Tool</th><th>Main problem it solves</th><th>Best fit</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Noisy terminal output from common developer commands.</td><td>Developers who run many CLI commands inside Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Context Mode</a></td><td>Massive raw tool outputs entering the main conversation.</td><td>Heavy Playwright, GitHub, log, or MCP-tool users.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>Blind codebase exploration in large repos.</td><td>Reviews, dependency analysis, and blast-radius questions.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>Full file reads when a symbol summary would be enough.</td><td>Large files, repeated symbol lookups, and incremental code reading.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Claude’s own verbose response habits.</td><td>Users who want terse output and smaller future context.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>Re-exploring the codebase every session.</td><td>Semantic code search through MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Losing project memory across sessions, agents, and model switches.</td><td>Long-running projects with durable decisions and lessons.</td></tr>
</tbody>
</table>
<p>The first five tools reduce what enters or remains in context. The last two make useful context easier to recall.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK compresses raw command output before Claude sees it<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
<p>RTK is a CLI proxy for reducing token usage from common developer commands. Its GitHub description says it reduces LLM token consumption by 60-90% on common dev commands, and it ships as a single Rust binary.</p>
<p>In everyday Claude Code use, commands like <code translate="no">git status</code>, <code translate="no">pytest</code>, and directory listings often dump full environment info and status descriptions into the context window. The model usually needs only a smaller answer: which files changed, which test failed, where the PR is stuck, or what key files exist in the directory.</p>
<p>RTK sits between the shell and Claude. It can rewrite commands through Claude Code hooks and pass back compressed output.</p>
<p>Raw <code translate="no">git status</code> output:</p>
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
<p>What actually matters:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Same story with <code translate="no">pytest</code>. The raw output is full of passing cases and environment noise:</p>
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
<p>Compressed, the signal is immediate:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK is the easiest starting point when your context bloat comes from shell commands rather than code retrieval.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">Context Mode sandboxes giant tool outputs outside the main chat<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Context Mode is built for the raw blocks that tools return: test logs, browser DOM snapshots, GitHub payloads, MCP tool output, and scraped pages. Its GitHub description highlights context-window optimization for AI coding agents and reports 98% tool-output reduction.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
    <span>Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning</span>
  </span>
</p>
<p>Its approach is to isolate large tool outputs into a local sandbox and index, then pass only summaries and retrieval handles into the Claude conversation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
    <span>Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results</span>
  </span>
</p>
<p>The flow is useful because a coding agent often needs the failing node, broken selector, or relevant stack trace, not the entire DOM or every passing test line. Context Mode keeps the full output available locally while preventing it from dominating the main conversation.</p>
<p>This is similar to how production <a href="https://zilliz.com/blog/hybrid-search-with-milvus">hybrid search</a> systems separate storage from retrieval. You keep the raw data somewhere durable, then retrieve only the slice that matters.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph maps code structure before Claude navigates it<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph addresses a different problem: Claude does not always need more text; it needs a better map.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
    <span>code-review-graph logo image used in the original article</span>
  </span>
</p>
<p>In a large repository, a simple question can trigger expensive exploration:</p>
<blockquote>
<p>After changing this login logic, which files and tests are affected?</p>
</blockquote>
<p>Without a code graph, Claude’s typical move is:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph pre-builds a structural map of the codebase. It uses Tree-sitter to parse functions, classes, imports, call relationships, inheritance, and test dependencies, then writes the graph into SQLite.</p>
<p>That makes it useful for code review and blast-radius analysis. Instead of asking Claude to rediscover the dependency graph through repeated reads, you let it query structure first.</p>
<p>This is adjacent to <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">semantic search</a>, but not identical. A structural graph answers “what depends on what?” Semantic retrieval answers “what code is conceptually related to this question?” In real code-assistant workflows, you often want both.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior gives Claude symbol summaries before full files<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Token Savior’s core idea is simple: do not send the full file by default. Send an index or symbol summary first, then expand only when the task needs more detail.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
    <span>Token Savior GitHub repository card showing its MCP server description and project statistics</span>
  </span>
</p>
<p>If you ask where a payment webhook is handled, the model often does not need every line of every related file. It first needs to know whether a file or symbol is relevant.</p>
<p>Token Savior serves code in layers:</p>
<table>
<thead>
<tr><th>Layer</th><th>What Claude receives</th><th>When it expands</th></tr>
</thead>
<tbody>
<tr><td>Summary</td><td>Index, symbol names, and short descriptions.</td><td>Default first response.</td></tr>
<tr><td>Snippet</td><td>A smaller code section around the relevant symbol.</td><td>When the summary is likely relevant.</td></tr>
<tr><td>Full file</td><td>The complete file content.</td><td>Only when editing or deep reasoning requires it.</td></tr>
</tbody>
</table>
<p>This mirrors how developers actually read code. You scan, confirm relevance, then open the full file only when necessary. It also resembles the progressive retrieval pattern used in <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG applications</a>: retrieve broadly enough to orient, then narrow the context before generation.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman reduces Claude’s own response bloat<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>Most context tools focus on what enters the model. Caveman targets what Claude outputs.</p>
<p>Caveman is a Claude Code skill/plugin that strips filler, pleasantries, wrapper sentences, over-explanation, and repetitive structures. The goal is not to remove knowledge; it is to make the answer denser.</p>
<p>Without Caveman:</p>
<blockquote>
<p>The reason your React component is re-rendering is likely because…</p>
</blockquote>
<p>With Caveman:</p>
<blockquote>
<p>New object ref each render. Inline object prop = new ref = re-render. Wrap in useMemo.</p>
</blockquote>
<p>This matters because Claude’s own answers become future context. If every answer includes a long explanation, the next turn starts with more text than it needs. Shorter answers can improve the next turn as much as they improve the current one.</p>
<p>For teams thinking about <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">context engineering for AI agents</a>, Caveman is a reminder that output policy is part of context policy.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context adds semantic code search through MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context solves the repeated-codebase-exploration problem with semantic retrieval. It indexes a repository, stores code chunks in a vector database, and exposes search through the <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
    <span>Claude Context repository shown on GitHub Trending in the original article</span>
  </span>
</p>
<p>In a big codebase, you constantly ask Claude questions like:</p>
<blockquote>
<p>Help me figure out which parts of the code might be related to this bug.</p>
</blockquote>
<p>Without a retrieval layer, Claude’s default approach is often:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context moves that work into a retrieval layer. It chunks the repository, generates embeddings, stores them in a <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">Milvus-backed code index</a>, and retrieves relevant code chunks before the model starts reading files blindly.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
    <span>claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection</span>
  </span>
</p>
<p>This is where AI coding tools start to look like search systems. You need chunking, embeddings, metadata, lexical matching, ranking, and freshness. Those are the same building blocks behind <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">production RAG retrieval</a>, <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">hybrid retrieval routing</a>, and <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">embedding model selection</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch keeps useful memory across sessions and agents<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch tackles the opposite side of the problem: not what to forget, but how to recall what matters.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
    <span>memsearch logo image from the original article</span>
  </span>
</p>
<p>Imagine you tell Claude on Monday:</p>
<blockquote>
<p>Our webhook can’t retry on failure — failed events need to go into a dead letter queue.</p>
</blockquote>
<p>On Wednesday, you open a new session and ask:</p>
<blockquote>
<p>What else can we optimize in the webhook layer?</p>
</blockquote>
<p>Without durable memory, Claude treats Monday’s decision as if it never happened. You explain it again.</p>
<p>memsearch stores memory as local, human-readable Markdown files and uses Milvus as a rebuildable retrieval index. That design keeps memory editable by humans while still making it searchable for agents.</p>
<p>At retrieval time, memsearch uses progressive recall: search first, expand if needed, then drill down to the original transcript only when necessary.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
    <span>memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation</span>
  </span>
</p>
<p>This Markdown-first pattern is useful for teams working across sessions, models, and agents. It also pairs naturally with <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">long-term AI agent memory</a>, <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">shared multi-agent memory</a>, and the broader problem of preventing <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">context rot in agent systems</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">How do these tools work together?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>The seven tools are complementary, not interchangeable. Use them as layers.</p>
<table>
<thead>
<tr><th>Layer</th><th>Use these tools</th><th>Why</th></tr>
</thead>
<tbody>
<tr><td>Remove command noise</td><td>RTK</td><td>Compress high-volume terminal output before it reaches Claude.</td></tr>
<tr><td>Sandbox raw tool output</td><td>Context Mode</td><td>Keep large logs, DOMs, and tool payloads outside the main conversation.</td></tr>
<tr><td>Map code structure</td><td>code-review-graph</td><td>Answer dependency and blast-radius questions without blind file reads.</td></tr>
<tr><td>Read code progressively</td><td>Token Savior</td><td>Start with symbol summaries, then expand only as needed.</td></tr>
<tr><td>Compress Claude’s answers</td><td>Caveman</td><td>Prevent the model’s own output from becoming future context bloat.</td></tr>
<tr><td>Retrieve relevant code</td><td>claude-context</td><td>Use semantic and hybrid code search instead of repeated grep loops.</td></tr>
<tr><td>Reuse durable decisions</td><td>memsearch</td><td>Recall project history across sessions, agents, and model switches.</td></tr>
</tbody>
</table>
<p>A practical rollout order is:</p>
<ol>
<li><strong>Kill obvious noise first.</strong> Add RTK or Context Mode if shell output and tool payloads dominate your context.</li>
<li><strong>Fix repository navigation.</strong> Add code-review-graph for structure or claude-context for semantic code retrieval.</li>
<li><strong>Control what remains.</strong> Use Token Savior and Caveman to keep file reads and model responses compact.</li>
<li><strong>Preserve durable knowledge.</strong> Use memsearch when repeated explanations become the bottleneck.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">Keep in touch<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>Join the <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a> to ask questions and compare context-management patterns with other developers.</li>
<li><a href="https://milvus.io/office-hours">Book a free Milvus Office Hours session</a> if you want help designing a retrieval layer for code, memory, or RAG workloads.</li>
<li>If you’d rather skip the infrastructure setup, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) offers a free tier to get started.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Frequently Asked Questions<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>How do I reduce Claude Code token usage without losing useful context?</strong></p>
<p>Start by compressing the noisiest inputs: terminal output, raw tool payloads, and repeated code reads. Then add retrieval tools such as claude-context or code-review-graph so Claude can pull relevant code instead of exploring the repository from scratch.</p>
<p><strong>Should I use claude-context or code-review-graph for a large repo?</strong></p>
<p>Use claude-context when you need semantic code search, especially when you do not know the exact file or symbol name. Use code-review-graph when you need structural answers such as call relationships, imports, test dependencies, and review blast radius.</p>
<p><strong>Is memory different from code retrieval in Claude Code?</strong></p>
<p>Yes. Code retrieval finds relevant project files or symbols. Memory retrieval recalls durable decisions, user preferences, debugging history, and cross-session lessons. memsearch focuses on memory; claude-context focuses on code retrieval.</p>
<p><strong>Do these tools replace prompt caching or a larger context window?</strong></p>
<p>No. Prompt caching and large context windows help with capacity and cost, but they do not decide what information deserves attention. Context-management tools improve the quality and density of what enters the model in the first place.</p>
