---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: |
  Adding Persistent Memory to Claude Code with the Lightweight memsearch Plugin
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
desc: >
  Give Claude Code long-term memory with memsearch ccplugin. Lightweight,
  transparent Markdown storage, automatic semantic retrieval, zero token
  overhead.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>We recently built and open-sourced <a href="https://github.com/zilliztech/memsearch">memsearch</a>, a standalone, plug-and-play long-term memory library that gives any agent persistent, transparent, and human-editable memory. It uses the same underlying memory architecture as OpenClaw—just without the rest of the OpenClaw stack. That means you can drop it into any agent framework (Claude, GPT, Llama, custom agents, workflow engines) and instantly add durable, queryable memory. <em>(If you want the deep dive into how memsearch works, we wrote a</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>separate post here</em></a><em>.)</em></p>
<p>In most agent workflows, memsearch performs exactly as intended. But <strong>agentic coding</strong> is a different story. Coding sessions run long, context switches are constant, and the information worth keeping accumulates over days or weeks. That sheer volume and volatility expose weaknesses in typical agent memory systems—memsearch included. In coding scenarios, retrieval patterns differ enough that we couldn’t simply reuse the existing tool as-is.</p>
<p>To address this, we built a <strong>persistent memory plugin designed specifically for Claude Code</strong>. It sits on top of the memsearch CLI, and we’re calling it the <strong>memsearch ccplugin</strong>.</p>
<ul>
<li>GitHub Repo: <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(open-source, MIT license)</em></li>
</ul>
<p>With the lightweight <strong>memsearch ccplugin</strong> managing memory behind the scenes, Claude Code gains the ability to remember every conversation, every decision, every style preference, and every multi-day thread—automatically indexed, fully searchable, and persistent across sessions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>For clarity throughout this post: “ccplugin” refers to the upper layer, or the Claude Code plugin itself. “memsearch” refers to the lower layer, the standalone CLI tool underneath it.</em></p>
<p>So why does coding need its own plugin, and why did we build something so lightweight? It comes down to two problems you’ve almost certainly hit: Claude Code’s lack of persistent memory, and the clunkiness and complexity of existing solutions like claude-mem.</p>
<p>So why build a dedicated plugin at all? Because coding agents run into two pain points you’ve almost certainly experienced yourself:</p>
<ul>
<li><p>Claude Code has no persistent memory.</p></li>
<li><p>Many existing community solutions—like <em>claude-mem</em>—are powerful but heavy, clunky, or overly complex for day-to-day coding work.</p></li>
</ul>
<p>The ccplugin aims to solve both problems with a minimal, transparent, developer-friendly layer on top of memsearch.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">Claude Code’s Memory Problem: It Forgets Everything When a Session Ends<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s start with a scenario that Claude Code Users most definitely have run into.</p>
<p>You open Claude Code in the morning. “Continue yesterday’s auth refactor,” you type. Claude replies: “I’m not sure what you were working on yesterday.” So you spend the next ten minutes copy-pasting yesterday’s logs. It’s not a huge problem, but it gets annoying quickly because it appears so frequently.</p>
<p>Even though Claude Code has its own memory mechanisms, they’re far from satisfactory. The <code translate="no">CLAUDE.md</code> file can store project directives and preferences, but it works better for static rules and short commands, not for accumulating long-term knowledge.</p>
<p>Claude Code does offer <code translate="no">resume</code> and <code translate="no">fork</code> commands, but they’re far from user-friendly. For fork commands, you need to remember session IDs, type commands manually, and manage a tree of branching conversation histories. When you run <code translate="no">/resume</code>, you get a wall of session titles. If you only remember a few details about what you did and it was more than a few days ago, good luck finding the right one.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>For long-term, cross-project knowledge accumulation, this whole approach is impossible.</p>
<p>To deliver on that idea, claude-mem uses a three-tier memory system. The first tier searches high-level summaries. The second tier digs into a timeline for more detail. The third tier pulls full observations for raw conversation. On top of that, there are privacy labels, cost tracking, and a web visualization interface.</p>
<p>Here’s how it works under the hood:</p>
<ul>
<li><p><strong>Runtime layer.</strong> A Node.js Worker service runs on port 37777. Session metadata lives in a lightweight SQLite database. A vector database handles precise semantic retrieval over memory content.</p></li>
<li><p><strong>Interaction layer.</strong> A React-based web UI lets you view captured memories in real time: summaries, timelines, and raw records.</p></li>
<li><p><strong>Interface layer.</strong> An MCP (Model Context Protocol) server exposes standardized tool interfaces. Claude can call <code translate="no">search</code> (query high-level summaries), <code translate="no">timeline</code> (view detailed timelines), and <code translate="no">get_observations</code> (retrieve raw interaction records) to retrieve and use memories directly.</p></li>
</ul>
<p>To be fair, this is a solid product that solves Claude Code’s memory problem. But it’s clunky and complex in ways that matter day-to-day.</p>
<table>
<thead>
<tr><th>Layer</th><th>Technology</th></tr>
</thead>
<tbody>
<tr><td>Language</td><td>TypeScript (ES2022, ESNext modules)</td></tr>
<tr><td>Runtime</td><td>Node.js 18+</td></tr>
<tr><td>Database</td><td>SQLite 3 with bun:sqlite driver</td></tr>
<tr><td>Vector Store</td><td>ChromaDB (optional, for semantic search)</td></tr>
<tr><td>HTTP Server</td><td>Express.js 4.18</td></tr>
<tr><td>Real-time</td><td>Server-Sent Events (SSE)</td></tr>
<tr><td>UI Framework</td><td>React + TypeScript</td></tr>
<tr><td>AI SDK</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>Build Tool</td><td>esbuild (bundles TypeScript)</td></tr>
<tr><td>Process Manager</td><td>Bun</td></tr>
<tr><td>Testing</td><td>Node.js built-in test runner</td></tr>
</tbody>
</table>
<p><strong>For starters, setup is heavy.</strong> Getting claude-mem running means installing Node.js, Bun, and the MCP runtime, then standing up a Worker service, Express server, React UI, SQLite, and a vector store on top of that. That’s a lot of moving parts to deploy, maintain, and debug when something breaks.</p>
<p><strong>All those components also burn tokens you didn’t ask to spend.</strong> MCP tool definitions load permanently into Claude’s context window, and every tool call eats tokens on the request and response. Over long sessions, that overhead adds up fast and can push token costs out of control.</p>
<p><strong>Memory recall is unreliable because it depends entirely on Claude choosing to search.</strong> Claude has to decide on its own to call tools like <code translate="no">search</code> to trigger retrieval. If it doesn’t realize it needs a memory, the relevant content just never shows up. And each of the three memory tiers requires its own explicit tool invocation, so there’s no fallback if Claude doesn’t think to look.</p>
<p><strong>Finally, data storage is opaque, which makes debugging and migration unpleasant.</strong> Memories are split across SQLite for session metadata and Chroma for binary vector data, with no open format tying them together. Migrating means writing export scripts. Seeing what the AI actually remembers means going through the Web UI or a dedicated query interface. There’s no way to just look at the raw data.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">Why the memsearch Plugin for Claude Code is Better?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>We wanted a memory layer that was truly lightweight—no extra services, no tangled architecture, no operational overhead. That’s what motivated us to build the <strong>memsearch ccplugin</strong>. At its core, this was an experiment: <em>could a coding-focused memory system be radically simpler?</em></p>
<p>Yes, and we proved it.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The entire ccplugin is four shell hooks plus a background watch process. No Node.js, no MCP server, no Web UI. It’s just shell scripts calling the memsearch CLI, which drops the setup and maintenance bar dramatically.</p>
<p>The ccplugin can be this thin because of strict responsibility boundaries. It doesn’t handle memory storage, vector retrieval, or text embedding. All of that is delegated to the memsearch CLI underneath. The ccplugin has one job: bridge Claude Code’s lifecycle events (session start, prompt submission, response stop, session end) to the corresponding memsearch CLI functions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This decoupled design makes the system flexible beyond Claude Code. The memsearch CLI works independently with other IDEs, other agent frameworks, or even plain manual invocation. It’s not locked to a single use case.</p>
<p>In practice, this design delivers three key advantages.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. All Memories Live in Plain Markdown Files</h3><p>Every memory the ccplugin creates lives in <code translate="no">.memsearch/memory/</code> as a Markdown file.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>It’s one file per day. Each file contains that day’s session summaries in plain text, fully human-readable. Here’s a screenshot of the daily memory files from the memsearch project itself:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>You can see the format right away: timestamp, session ID, turn ID, and a summary of the session. Nothing is hidden.</p>
<p>Want to know what the AI remembers? Open the Markdown file. Want to edit a memory? Use your text editor. Want to migrate your data? Copy the <code translate="no">.memsearch/memory/</code> folder.</p>
<p>The <a href="https://milvus.io/">Milvus</a> vector index is a cache to speed up semantic search. It rebuilds from Markdown at any time. No opaque databases, no binary black boxes. All data is traceable and fully reconstructable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. Automatic Context Injection Costs Zero Extra Tokens</h3><p>Transparent storage is the foundation of this system. The real payoff comes from how these memories get used, and in ccplugin, memory recall is fully automatic.</p>
<p>Every time a prompt is submitted, the <code translate="no">UserPromptSubmit</code> hook fires a semantic search and injects the top-3 relevant memories into context. Claude doesn’t decide whether to search. It just gets the context.</p>
<p>During this process, Claude never sees MCP tool definitions, so nothing extra occupies the context window. The hook runs at the CLI layer and injects plain text search results. No IPC overhead, no tool-call token costs. The context-window bloat that comes with MCP tool definitions is gone entirely.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>For cases where the automatic top-3 isn’t enough, we also built three tiers of progressive retrieval. All three are CLI commands, not MCP tools.</p>
<ul>
<li><p><strong>L1 (automatic):</strong> Every prompt returns the top-3 semantic search results with a <code translate="no">chunk_hash</code> and 200-character preview. This covers most everyday use.</p></li>
<li><p><strong>L2 (on-demand):</strong> When full context is needed, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> returns the complete Markdown section plus metadata.</p></li>
<li><p><strong>L3 (deep):</strong> When the original conversation is needed, <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> pulls the raw JSONL record from Claude Code.</p></li>
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
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. Session Summaries Are Generated in the Background at Near-Zero Cost</h3><p>Retrieval covers how memories get used. But the memories have to be written first. How do all those Markdown files get created?</p>
<p>The ccplugin generates them through a background pipeline that runs asynchronously and costs almost nothing. Every time you stop a Claude response, the <code translate="no">Stop</code> hook fires: it parses the conversation transcript, calls Claude Haiku (<code translate="no">claude -p --model haiku</code>) to generate a summary, and appends it to the current day’s Markdown file. Haiku API calls are extremely cheap, nearly negligible per invocation.</p>
<p>From there, the watch process detects the file change and automatically indexes the new content into Milvus so it’s available for retrieval right away. The whole flow runs in the background without interrupting your work, and costs stay controlled.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Quickstart memsearch plugin with Claude Code<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">First, install from the Claude Code plugin marketplace:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">Second, restart Claude Code.</h3><p>The plugin initializes its configuration automatically.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">Third, after a conversation, check the day’s memory file:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">Fourth, enjoy.</h3><p>The next time Claude Code starts, the system automatically retrieves and injects relevant memories. No extra steps needed.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s go back to the original question: how do you give AI persistent memory? claude-mem and memsearch ccplugin take different approaches, each with different strengths. We summed up a quick guide to choosing between them:</p>
<table>
<thead>
<tr><th>Category</th><th>memsearch</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>Architecture</td><td>4 shell hooks + 1 watch process</td><td>Node.js Worker + Express + React UI</td></tr>
<tr><td>Integration Method</td><td>Native hooks + CLI</td><td>MCP server (stdio)</td></tr>
<tr><td>Recall</td><td>Automatic (hook injection)</td><td>Agent-driven (requires tool invocation)</td></tr>
<tr><td>Context Consumption</td><td>Zero (inject result text only)</td><td>MCP tool definitions persist</td></tr>
<tr><td>Session Summary</td><td>One asynchronous Haiku CLI call</td><td>Multiple API calls + observation compression</td></tr>
<tr><td>Storage Format</td><td>Plain Markdown files</td><td>SQLite + Chroma embeddings</td></tr>
<tr><td>Data Migration</td><td>Plain Markdown files</td><td>SQLite + Chroma embeddings</td></tr>
<tr><td>Migration Method</td><td>Copying .md files</td><td>Exporting from database</td></tr>
<tr><td>Runtime</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCP runtime</td></tr>
</tbody>
</table>
<p>claude-mem offers richer features, a polished UI, and finer-grained control. For teams that need collaboration, web visualization, or detailed memory management, it’s a strong pick.</p>
<p>memsearch ccplugin offers minimal design, zero context-window overhead, and fully transparent storage. For engineers who want a lightweight memory layer without additional complexity, it’s the better fit. Which one is better depends on what you need.</p>
<p>Want to dive deeper or get help building with memsearch or Milvus?</p>
<ul>
<li><p>Join the <a href="https://milvus.io/slack">Milvus Slack community</a> t to connect with other developers and share what you’re building.</p></li>
<li><p>Book our <a href="https://milvus.io/office-hours">Milvus Office Hours</a>for live Q&amp;A and direct support from the team.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">Resources<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>memsearch ccplugin documentation:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>memsearch project:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">What Is OpenClaw? Complete Guide to the Open-Source AI Agent -</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw Tutorial: Connect to Slack for Local AI Assistant</a></p></li>
</ul>
