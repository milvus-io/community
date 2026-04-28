---
id: claude-code-memory-memsearch.md
title: |
  We Read Claude Code's Leaked Source. Here's How Its Memory Actually Works
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >
  Claude Code's leaked source reveals a 4-layer memory capped at 200 lines with
  grep-only search. Here's how each layer works and what memsearch fixes.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>Claude Code’s source code was shipped publicly by accident. Version 2.1.88 included a 59.8 MB source map file that should have been stripped from the build. That one file contained the full, readable TypeScript codebase — 512,000 lines, now mirrored across GitHub.</p>
<p>The <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">memory system</a> caught our attention. Claude Code is the most popular AI coding agent on the market, and memory is the part most users interact with without understanding how it works under the hood. So we dug in.</p>
<p>The short version: Claude Code’s memory is more basic than you’d think. It caps out at 200 lines of notes. It can only find memories by exact keyword match — if you ask about “port conflicts,” but the note says “docker-compose mapping,” you get nothing. And none of it leaves Claude Code. Switch to a different agent and you start from zero.</p>
<p>Here are the four layers:</p>
<ul>
<li><strong>CLAUDE.md</strong> — a file you write yourself with rules for Claude to follow. Manual, static, and limited by how much you think to write down in advance.</li>
<li><strong>Auto Memory</strong> — Claude takes its own notes during sessions. Useful, but capped at a 200-line index with no search-by-meaning.</li>
<li><strong>Auto Dream</strong> — a background cleanup process that consolidates messy memories while you’re idle. Helps with days-old clutter, can’t bridge months.</li>
<li><strong>KAIROS</strong> — an unreleased always-on daemon mode found in the leaked code. Not in any public build yet.</li>
</ul>
<p>Below, we unpack each layer, then cover where the architecture breaks down and what we built to address the gaps.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">How Does CLAUDE.md Work?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md is a Markdown file you create and place in your project folder. You fill it with whatever you want Claude to remember: code style rules, project structure, test commands, deploy steps. Claude loads it at the start of every session.</p>
<p>Three scopes exist: project-level (in the repo root), personal (<code translate="no">~/.claude/CLAUDE.md</code>), and organizational (enterprise config). Shorter files get followed more reliably.</p>
<p>The limit is obvious: CLAUDE.md only holds things you wrote down in advance. Debugging decisions, preferences you mentioned mid-conversation, edge cases you discovered together — none of that gets captured unless you stop and manually add it. Most people don’t.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">How Does Auto Memory Work?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memory captures what surfaces during work. Claude decides what’s worth keeping and writes it to a memory folder on your machine, organized into four categories: user (role and preferences), feedback (your corrections), project (decisions and context), and reference (where things live).</p>
<p>Each note is a separate Markdown file. The entry point is <code translate="no">MEMORY.md</code> — an index where each line is a short label (under 150 characters) pointing to a detailed file. Claude reads the index, then pulls specific files when they seem relevant.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>The first 200 lines of MEMORY.md get loaded into every session. Anything beyond that is invisible.</p>
<p>One smart design choice: the leaked system prompt tells Claude to treat its own memory as a hint, not a fact. It verifies against real code before acting on anything remembered, which helps reduce hallucinations — a pattern that other <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">AI agent frameworks</a> are starting to adopt.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">How Does Auto Dream Consolidate Stale Memories?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memory captures notes, but after weeks of use those notes go stale. An entry saying “yesterday’s deploy bug” becomes meaningless a week later. A note says you use PostgreSQL; a newer one says you migrated to MySQL. Deleted files still have memory entries. The index fills with contradictions and outdated references.</p>
<p>Auto Dream is the cleanup process. It runs in the background and:</p>
<ul>
<li>Replaces vague time references with exact dates. “Yesterday’s deploy issue” → “2026-03-28 deploy issue.”</li>
<li>Resolves contradictions. PostgreSQL note + MySQL note → keeps the current truth.</li>
<li>Deletes stale entries. Notes referencing deleted files or completed tasks get removed.</li>
<li>Keeps <code translate="no">MEMORY.md</code> under 200 lines.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Trigger conditions:</strong> more than 24 hours since last cleanup AND at least 5 new sessions accumulated. You can also type “dream” to run it manually. The process runs in a background sub-agent — like actual sleep, it won’t interrupt your active work.</p>
<p>The dream agent’s system prompt starts with: <em>“You are performing a dream — a reflective pass over your memory files.”</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">What Is KAIROS? Claude Code’s Unreleased Always-On Mode<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>The first three layers are live or rolling out. The leaked code also contains something that hasn’t shipped: KAIROS.</p>
<p>KAIROS — apparently named after the Greek word for “the right moment” — appears over 150 times in the source. It would turn Claude Code from a tool you actively use into a background assistant that watches your project continuously.</p>
<p>Based on the leaked code, KAIROS:</p>
<ul>
<li>Keeps a running log of observations, decisions, and actions throughout the day.</li>
<li>Checks in on a timer. At regular intervals, it receives a signal and decides: act, or stay quiet.</li>
<li>Stays out of your way. Any action that would block you for more than 15 seconds gets deferred.</li>
<li>Runs dream cleanup internally, plus a full observe-think-act loop in the background.</li>
<li>Has exclusive tools that regular Claude Code doesn’t: pushing files to you, sending notifications, monitoring your GitHub pull requests.</li>
</ul>
<p>KAIROS is behind a compile-time feature flag. It’s not in any public build. Think of it as Anthropic exploring what happens when <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">agent memory</a> stops being session-by-session and becomes always-on.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">Where Does Claude Code’s Memory Architecture Break Down?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code’s memory does real work. But five structural limitations constrain what it can handle as projects grow.</p>
<table>
<thead>
<tr><th>Limitation</th><th>What happens</th></tr>
</thead>
<tbody>
<tr><td><strong>200-line index cap</strong></td><td><code translate="no">MEMORY.md</code> holds ~25 KB. Run a project for months, and old entries get pushed out by new ones. “What Redis config did we settle on last week?” — gone.</td></tr>
<tr><td><strong>Grep-only retrieval</strong></td><td>Memory search uses literal <a href="https://milvus.io/docs/full-text-search.md">keyword matching</a>. You remember “deploy-time port conflicts,” but the note says “docker-compose port mapping.” Grep can’t bridge that gap.</td></tr>
<tr><td><strong>Summaries only, no reasoning</strong></td><td>Auto Memory saves high-level notes, not the debugging steps or reasoning that got you there. The <em>how</em> is lost.</td></tr>
<tr><td><strong>Complexity stacks without fixing the foundation</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS. Each layer exists because the last one wasn’t enough. But no amount of layering changes what’s underneath: one tool, local files, session-by-session capture.</td></tr>
<tr><td><strong>Memory is locked inside Claude Code</strong></td><td>Switch to OpenCode, Codex CLI, or any other agent and you start from zero. No export, no shared format, no portability.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>These aren’t bugs. They’re the natural limits of single-tool, local-file architecture. New agents ship every month, workflows shift, but the knowledge you’ve built up in a project shouldn’t disappear with them. That’s why we built <a href="https://github.com/zilliztech/memsearch">memsearch</a>.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">What Is memsearch? Persistent Memory for Any AI Coding Agent<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a> pulls memory out of the agent and into its own layer. Agents come and go. Memory stays.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">How to Install memsearch</h3><p>Claude Code users install from the marketplace:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>Done. No configuration needed.</p>
<p>Other platforms are just as simple. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. Python API via uv or pip:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">What Does memsearch Capture?</h3><p>Once installed, memsearch hooks into the agent’s lifecycle. Every conversation gets summarized and indexed automatically. When you ask a question that needs history, recall triggers on its own.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Memory files are stored as dated Markdown — one file per day:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>You can open, read, and edit memory files in any text editor. If you want to migrate, you copy the folder. If you want version control, git works natively.</p>
<p>The <a href="https://milvus.io/docs/index-explained.md">vector index</a> stored in <a href="https://milvus.io/docs/overview.md">Milvus</a> is a cache layer — if it’s ever lost, you rebuild it from the Markdown files. Your data lives in the files, not the index.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">How Does memsearch Find Memories? Semantic Search vs. Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code’s memory retrieval uses grep — literal keyword matching. That works when you have a few dozen notes, but it breaks down after months of history when you can’t remember the exact wording.</p>
<p>memsearch uses <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">hybrid search</a> instead. <a href="https://zilliz.com/glossary/semantic-search">Semantic vectors</a> find content related to your query even when the wording is different, while BM25 matches exact keywords. <a href="https://milvus.io/docs/rrf-ranker.md">RRF (Reciprocal Rank Fusion)</a> merges and ranks both result sets together.</p>
<p>Say you ask “How did we fix that Redis timeout last week?” — semantic search understands the intent and finds it. Say you ask &quot;search for <code translate="no">handleTimeout</code>&quot; — BM25 hits the exact function name. The two paths cover each other’s blind spots.</p>
<p>When recall triggers, the sub-agent searches in three stages, going deeper only when needed:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: Semantic Search — Short Previews</h3><p>The sub-agent runs <code translate="no">memsearch search</code> against the Milvus index and pulls the most relevant results:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Each result shows a relevance score, source file, and a 200-character preview. Most queries stop here.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: Full Context — Expand a Specific Result</h3><p>If L1’s preview isn’t enough, the sub-agent runs <code translate="no">memsearch expand a3f8c1</code> to pull the complete entry:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: Raw Conversation Transcript</h3><p>In rare cases where you need to see exactly what was said, the sub-agent pulls the original exchange:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>The transcript preserves everything: your exact words, the agent’s exact response, and every tool call. The three stages go from light to heavy — the sub-agent decides how deep to drill, then returns organized results to your main session.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">How Does memsearch Share Memory Across AI Coding Agents?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>This is the most fundamental gap between memsearch and Claude Code’s memory.</p>
<p>Claude Code’s memory is locked inside one tool. Use OpenCode, OpenClaw, or Codex CLI, and you start from scratch. MEMORY.md is local, bound to one user and one agent.</p>
<p>memsearch supports four coding agents: Claude Code, OpenClaw, OpenCode, and Codex CLI. They share the same Markdown memory format and the same <a href="https://milvus.io/docs/manage-collections.md">Milvus collection</a>. Memories written from any agent are searchable from every other agent.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Two real scenarios:</strong></p>
<p><strong>Switching tools.</strong> You spend an afternoon in Claude Code figuring out the deploy pipeline, hitting several snags. Conversations get auto-summarized and indexed. The next day you switch to OpenCode and ask “how did we resolve that port conflict yesterday?” OpenCode searches memsearch, finds yesterday’s Claude Code memories, and gives you the right answer.</p>
<p><strong>Team collaboration.</strong> Point the Milvus backend at <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> and multiple developers on different machines, using different agents, read and write the same project memory. A new team member joins and doesn’t need to dig through months of Slack and docs — the agent already knows.</p>
<h2 id="Developer-API" class="common-anchor-header">Developer API<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>If you’re building your own <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">agent tooling</a>, memsearch provides a CLI and Python API.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>Python API:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>Under the hood, Milvus handles vector search. Run locally with <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (zero config), collaborate via <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (free tier available), or self-host with Docker. <a href="https://milvus.io/docs/embeddings.md">Embeddings</a> default to ONNX — runs on CPU, no GPU needed. Swap in OpenAI or Ollama any time.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Claude Code Memory vs. memsearch: Full Comparison<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Feature</th><th>Claude Code memory</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>What gets saved</td><td>What Claude considers important</td><td>Every conversation, auto-summarized</td></tr>
<tr><td>Storage limit</td><td>~200-line index (~25 KB)</td><td>Unlimited (daily files + vector index)</td></tr>
<tr><td>Finding old memories</td><td>Grep keyword matching</td><td>Meaning-based + keyword hybrid search (Milvus)</td></tr>
<tr><td>Can you read them?</td><td>Check memory folder manually</td><td>Open any .md file</td></tr>
<tr><td>Can you edit them?</td><td>Edit files by hand</td><td>Same — auto re-indexes on save</td></tr>
<tr><td>Version control</td><td>Not designed for it</td><td>git works natively</td></tr>
<tr><td>Cross-tool support</td><td>Claude Code only</td><td>4 agents, shared memory</td></tr>
<tr><td>Long-term recall</td><td>Degrades after weeks</td><td>Persistent across months</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">Get Started with memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code’s memory has real strengths — the self-skeptical design, the dream consolidation concept, and the 15-second blocking budget in KAIROS. Anthropic is thinking hard about this problem.</p>
<p>But single-tool memory has a ceiling. Once your workflow spans multiple agents, multiple people, or more than a few weeks of history, you need memory that exists on its own.</p>
<ul>
<li>Try <a href="https://github.com/zilliztech/memsearch">memsearch</a> — open source, MIT licensed. Install in Claude Code with two commands.</li>
<li>Read <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">how memsearch works under the hood</a> or the <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude Code plugin guide</a>.</li>
<li>Got questions? Join the <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a> or <a href="https://milvus.io/office-hours">book a free Office Hours session</a> to walk through your use case.</li>
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">How does Claude Code’s memory system work under the hood?</h3><p>Claude Code uses a four-layer memory architecture, all stored as local Markdown files. CLAUDE.md is a static rules file you write manually. Auto Memory lets Claude save its own notes during sessions, organized into four categories — user preferences, feedback, project context, and reference pointers. Auto Dream consolidates stale memories in the background. KAIROS is an unreleased always-on daemon found in the leaked source code. The entire system is capped at a 200-line index and searchable only by exact keyword matching — no semantic search or meaning-based recall.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">Can AI coding agents share memory across different tools?</h3><p>Not natively. Claude Code’s memory is locked to Claude Code — there’s no export format or cross-agent protocol. If you switch to OpenCode, Codex CLI, or OpenClaw, you start from scratch. memsearch solves this by storing memories as dated Markdown files indexed in a <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> (Milvus). All four supported agents read and write the same memory store, so context transfers automatically when you switch tools.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">What is the difference between keyword search and semantic search for agent memory?</h3><p>Keyword search (grep) matches exact strings — if your memory says “docker-compose port mapping” but you search “port conflicts,” it returns nothing. Semantic search converts text into <a href="https://zilliz.com/glossary/vector-embeddings">vector embeddings</a> that capture meaning, so related concepts match even with different wording. memsearch combines both approaches with hybrid search, giving you meaning-based recall and exact keyword precision in a single query.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">What was leaked in the Claude Code source code incident?</h3><p>Version 2.1.88 of Claude Code shipped with a 59.8 MB source map file that should have been stripped from the production build. The file contained the complete, readable TypeScript codebase — roughly 512,000 lines — including the full memory system implementation, the Auto Dream consolidation process, and references to KAIROS, an unreleased always-on agent mode. The code was quickly mirrored across GitHub before it could be taken down.</p>
