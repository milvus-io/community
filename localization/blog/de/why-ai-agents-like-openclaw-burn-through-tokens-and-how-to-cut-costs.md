---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >
  Why OpenClaw and other AI agents’ token bills spike, and how to fix it with
  BM25 + vector retrieval (index1, QMD, Milvus) and Markdown-first memory
  (memsearch).
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<p>If you’ve spent any time with <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (formerly Clawdbot and Moltbot), you already know how good this AI Agent is. It’s fast, local, flexible, and capable of pulling off surprisingly complex workflows across Slack, Discord, your codebase, and practically anything else you hook it into. But once you start using it seriously, one pattern quickly emerges: <strong>your token usage starts to climb.</strong></p>
<p>This isn’t OpenClaw’s fault specifically — it’s how most AI agents behave today. They trigger an LLM call for almost everything: looking up a file, planning a task, writing a note, executing a tool, or asking a follow-up question. And because tokens are the universal currency of these calls, every action has a cost.</p>
<p>To understand where that cost comes from, we need to look under the hood at two big contributors:</p>
<ul>
<li><strong>Search:</strong> Badly constructed searches pull in sprawling context payloads — entire files, logs, messages, and code regions that the model didn’t actually need.</li>
<li><strong>Memory:</strong> Storing unimportant information forces the agent to reread and reprocess it on future calls, compounding token usage over time.</li>
</ul>
<p>Both issues silently increase operational costs without improving capability.</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">How AI Agents Like OpenClaw Actually Perform Searches — and Why That Burns Tokens<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>When an agent needs information from your codebase or document library, it typically does the equivalent of a project-wide <strong>Ctrl+F</strong>. Every matching line is returned — unranked, unfiltered, and unprioritized. Claude Code implements this through a dedicated Grep tool built on ripgrep. OpenClaw doesn’t have a built-in codebase search tool, but its exec tool lets the underlying model run any command, and loaded skills can guide the agent to use tools like rg. In both cases, codebase search returns keyword matches unranked and unfiltered.</p>
<p>This brute-force approach works fine in small projects. But as repositories grow, so does the price. Irrelevant matches pile into the LLM’s context window, forcing the model to read and process thousands of tokens it didn’t actually need. A single unscoped search might drag in full files, huge comment blocks, or logs that share a keyword but not the underlying intent. Repeat that pattern across a long debugging or research session, and the bloat adds up quickly.</p>
<p>Both OpenClaw and Claude Code try to manage this growth. OpenClaw prunes oversized tool outputs and compacts long conversation histories, while Claude Code limits file-read output and supports context compaction. These mitigations work — but only after the bloated query has already been executed. The unranked search results still consumed tokens, and you still paid for them. Context management helps future turns, not the original call that generated the waste.</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">How AI Agent Memory Works and Why It Also Costs Tokens<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Search isn’t the only source of token overhead. Every piece of context an agent recalls from memory must also be loaded into the LLM’s context window, and that costs tokens as well.</p>
<p>The LLM APIs that most agents rely on today are stateless: Anthropic’s Messages API requires the full conversation history with every request, and OpenAI’s Chat Completions API works the same way. Even OpenAI’s newer stateful Responses API, which manages conversation state server-side, still bills for the full context window on every call. Memory loaded into context costs tokens regardless of how it gets there.</p>
<p>To work around this, agent frameworks write notes to files on disk and load relevant notes back into the context window when the agent needs them. For instance, OpenClaw stores curated notes in MEMORY.md and appends daily logs to timestamped Markdown files, then indexes them with hybrid BM25 and vector search so the agent can recall relevant context on demand.</p>
<p>OpenClaw’s memory design works well, but it requires the full OpenClaw ecosystem: the Gateway process, messaging platform connections, and the rest of the stack. The same is true of Claude Code’s memory, which is tied to its CLI. If you’re building a custom agent outside these platforms, you need a standalone solution. The next section covers the tools available for both problems.</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">How to Stop OpenClaw From Burning Through Tokens<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>If you want to reduce how many tokens OpenClaw consumes, there are two levers you can pull.</p>
<ul>
<li>The first is <strong>better retrieval</strong> — replacing grep-style keyword dumps with ranked, relevance-driven search tools so the model only sees the information that actually matters.</li>
<li>The second is <strong>better memory</strong> — moving from opaque, framework-dependent storage to something you can understand, inspect, and control.</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">Replacing grep with Better Retrieval: index1, QMD, and Milvus</h3><p>Many AI coding agents search codebases with grep or ripgrep. Claude Code has a dedicated Grep tool built on ripgrep. OpenClaw doesn’t have a built-in codebase search tool, but its exec tool lets the underlying model run any command, and skills like ripgrep or QMD can be loaded to guide how the agent searches. Without a retrieval-focused skill, the agent falls back on whatever approach the underlying model chooses. The core problem is the same across agents: without ranked retrieval, keyword matches enter the context window unfiltered.</p>
<p>This works when a project is small enough that every match fits comfortably in the context window. The problem starts when a codebase or document library grows to the point where a keyword returns dozens or hundreds of hits and the agent has to load all of them into the prompt. At that scale, you need results ranked by relevance, not just filtered by match.</p>
<p>The standard fix is hybrid search, which combines two complementary ranking methods:</p>
<ul>
<li>BM25 scores each result by how often and how uniquely a term appears in a given document. A focused file that mentions “authentication” 15 times ranks higher than a sprawling file that mentions it once.</li>
<li>Vector search converts text into numerical representations of meaning, so “authentication” can match “login flow” or “session management” even when they share no keywords.</li>
</ul>
<p>Neither method alone is sufficient: BM25 misses paraphrased terms, and vector search misses exact terms like error codes. Combining both and merging the ranked lists through a fusion algorithm covers both gaps.</p>
<p>The tools below implement this pattern at different scales. Grep is the baseline everyone starts with. index1, QMD, and Milvus each add hybrid search with increasing capacity.</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1: fast hybrid search on a single machine</h4><p><a href="https://github.com/gladego/index1">index1</a> is a CLI tool that packages hybrid search into a single SQLite database file. FTS5 handles BM25, sqlite-vec handles vector similarity, and RRF fuses the ranked lists. Embeddings are generated locally by Ollama, so nothing leaves your machine.</p>
<p>index1 chunks code by structure, not by line count: Markdown files split by headings, Python files by AST, JavaScript and TypeScript by regex patterns. This means search results return coherent units like a full function or a complete documentation section, not arbitrary line ranges that cut off mid-block. Response time is 40 to 180ms for hybrid queries. Without Ollama, it falls back to BM25-only, which still ranks results rather than dumping every match into the context window.</p>
<p>index1 also includes an episodic memory module for storing lessons learned, bug root causes, and architectural decisions. These memories live inside the same SQLite database as the code index rather than as standalone files.</p>
<p>Note: index1 is an early-stage project (0 stars, 4 commits as of February 2026). Evaluate it against your own codebase before committing.</p>
<ul>
<li><strong>Best for</strong>: solo developers or small teams with a codebase that fits on one machine, looking for a fast improvement over grep.</li>
<li><strong>Outgrow it when</strong>: you need multi-user access to the same index, or your data exceeds what a single SQLite file handles comfortably.</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD: higher accuracy through local LLM re-ranking</h4><p><a href="https://github.com/tobi/qmd">QMD</a> (Query Markup Documents), built by Shopify founder Tobi Lütke, adds a third stage: LLM re-ranking. After BM25 and vector search each return candidates, a local language model re-reads the top results and reorders them by actual relevance to your query. This catches cases where both keyword and semantic matches return plausible but wrong results.</p>
<p>QMD runs entirely on your machine using three GGUF models totaling about 2 GB: an embedding model (embeddinggemma-300M), a cross-encoder reranker (Qwen3-Reranker-0.6B), and a query expansion model (qmd-query-expansion-1.7B). All three download automatically on first run. No cloud API calls, no API keys.</p>
<p>The tradeoff is cold-start time: loading three models from disk takes roughly 15 to 16 seconds. QMD supports a persistent server mode (qmd mcp) that keeps models in memory between requests, eliminating the cold-start penalty for repeated queries.</p>
<ul>
<li><strong>Best for:</strong> privacy-critical environments where no data can leave your machine, and where retrieval accuracy matters more than response time.</li>
<li><strong>Outgrow it when:</strong> you need sub-second responses, shared team access, or your dataset exceeds single-machine capacity.</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus: hybrid search at team and enterprise scale</h4><p>The single-machine tools above work well for individual developers, but they hit limits when multiple people or agents need access to the same knowledge base. <a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> is an open-source vector database built for that next stage: distributed, multi-user, and capable of handling billions of vectors.</p>
<p>Its key feature for this use case is built-in Sparse-BM25, available since Milvus 2.5 and significantly faster in 2.6. You provide raw text, and Milvus tokenizes it internally using an analyzer built on tantivy, then converts the result to sparse vectors that are pre-computed and stored at index time.</p>
<p>Because the BM25 representation is already stored, retrieval doesn’t need to recalculate scores on the fly. These sparse vectors live alongside dense vectors (semantic embeddings) in the same Collection. At query time, you fuse both signals with a ranker such as RRFRanker, which Milvus provides out of the box. Same hybrid search pattern as index1 and QMD, but running on infrastructure that scales horizontally.</p>
<p>Milvus also provides capabilities that single-machine tools cannot: multi-tenant isolation (separate databases or collections per team), data replication with automatic failover, and hot/cold data tiering for cost-efficient storage. For agents, this means multiple developers or multiple agent instances can query the same knowledge base concurrently without stepping on each other’s data.</p>
<ul>
<li><strong>Best for</strong>: multiple developers or agents sharing a knowledge base, large or fast-growing document sets, or production environments that need replication, failover, and access control.</li>
</ul>
<p>To sum up:</p>
<table>
<thead>
<tr><th>Tool</th><th>Stage</th><th>Deployment</th><th>Migration signal</th></tr>
</thead>
<tbody>
<tr><td>Claude Native Grep</td><td>Prototyping</td><td>Built-in, zero setup</td><td>Bills climb or queries slow down</td></tr>
<tr><td>index1</td><td>Single-machine (speed)</td><td>Local SQLite + Ollama</td><td>Need multi-user access or data outgrows one machine</td></tr>
<tr><td>QMD</td><td>Single-machine (accuracy)</td><td>Three local GGUF models</td><td>Need team-shared indexes</td></tr>
<tr><td>Milvus</td><td>Team or Production</td><td>Distributed cluster</td><td>Large document sets or multi-tenant requirements</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">Reducing AI Agent Token Costs by Giving Them Persistent, Editable Memory with memsearch</h3><p>Search optimization reduces token waste per query, but it doesn’t help with what the agent retains between sessions.</p>
<p>Every piece of context an agent recalls from memory has to be loaded into the prompt, and that costs tokens too. The question isn’t whether to store memory, but how. The storage method determines whether you can see what the agent remembers, fix it when it’s wrong, and take it with you if you switch tools.</p>
<p>Most frameworks fail on all three counts. Mem0 and Zep store everything in a vector database, which works for retrieval, but makes memory:</p>
<ul>
<li><strong>Opaque.</strong> You can’t see what the agent remembers without querying an API.</li>
<li><strong>Hard to edit.</strong> Correcting or removing a memory means API calls, not opening a file.</li>
<li><strong>Locked in.</strong> Switching frameworks means exporting, converting, and reimporting your data.</li>
</ul>
<p>OpenClaw takes a different approach. All memory lives in plain Markdown files on disk. The agent writes daily logs automatically, and humans can open and edit any memory file directly. This solves all three problems: the memory is readable, editable, and portable by design.</p>
<p>The trade-off is deployment overhead. Running OpenClaw’s memory means running the full OpenClaw ecosystem: the Gateway process, messaging platform connections, and the rest of the stack. For teams already using OpenClaw, that’s fine. For everyone else, the barrier is too high. <strong>memsearch</strong> was built to close this gap: it extracts OpenClaw’s Markdown-first memory pattern into a standalone library that works with any agent.</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearch</a></strong>, built by Zilliz (the team behind Milvus), treats Markdown files as the single source of truth. A MEMORY.md holds long-term facts and decisions you write by hand. Daily logs (2026-02-26.md) are generated automatically from session summaries. The vector index, stored in Milvus, is a derived layer that can be rebuilt from the Markdown at any time.</p>
<p>In practice, this means you can open any memory file in a text editor, read exactly what the agent knows, and change it. Save the file, and memsearch’s file watcher detects the change and re-indexes automatically. You can manage memories with Git, review AI-generated memories through pull requests, or move to a new machine by copying a folder. If the Milvus index is lost, you rebuild it from the files. The files are never at risk.</p>
<p>Under the hood, memsearch uses the same hybrid search pattern described above: chunks split by heading structure and paragraph boundaries, BM25 + vector retrieval, and an LLM-powered compact command that summarizes old memories when logs grow large.
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Best for: teams that want full visibility into what the agent remembers, need version control over memory, or want a memory system that isn’t locked to any single agent framework.</p>
<p>To sum up:</p>
<table>
<thead>
<tr><th>Capability</th><th>Mem0 / Zep</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Source of truth</td><td>Vector database (sole data source)</td><td>Markdown files (primary) + Milvus (index)</td></tr>
<tr><td>Transparency</td><td>Black box, requires API to inspect</td><td>Open any .md file to read</td></tr>
<tr><td>Editability</td><td>Modify via API calls</td><td>Edit directly in any text editor, auto re-indexed</td></tr>
<tr><td>Version control</td><td>Requires separate audit logging</td><td>Git works natively</td></tr>
<tr><td>Migration cost</td><td>Export → convert format → re-import</td><td>Copy the Markdown folder</td></tr>
<tr><td>Human-AI collaboration</td><td>AI writes, humans observe</td><td>Humans can edit, supplement, and review</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">Which setup fits your scale<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
<tr><th>Scenario</th><th>Search</th><th>Memory</th><th>When to move on</th></tr>
</thead>
<tbody>
<tr><td>Early prototype</td><td>Grep (built-in)</td><td>—</td><td>Bills climb or queries slow down</td></tr>
<tr><td>Single developer, search only</td><td><a href="https://github.com/gladego/index1">index1</a> (speed) or <a href="https://github.com/tobi/qmd">QMD</a> (accuracy)</td><td>—</td><td>Need multi-user access or data outgrows one machine</td></tr>
<tr><td>Single developer, both</td><td><a href="https://github.com/gladego/index1">index1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Need multi-user access or data outgrows one machine</td></tr>
<tr><td>Team or production, both</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>—</td></tr>
<tr><td>Quick integration, memory only</td><td>—</td><td>Mem0 or Zep</td><td>Need to inspect, edit, or migrate memories</td></tr>
</tbody>
</table>
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
    </button></h2><p>The token costs that come with always-on AI agents aren’t inevitable. This guide covered two areas where better tooling can cut the waste: search and memory.</p>
<p>Grep works at small scale, but as codebases grow, unranked keyword matches flood the context window with content the model never needed. <a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a> and <a href="https://github.com/tobi/qmd"></a><a href="https://github.com/tobi/qmd">QMD</a> solve this on a single machine by combining BM25 keyword scoring with vector search and returning only the most relevant results. For teams, multi-agent setups, or production workloads, <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> provides the same hybrid search pattern on infrastructure that scales horizontally.</p>
<p>For memory, most frameworks store everything in a vector database: opaque, hard to edit by hand, and locked to the framework that created it. <a href="https://github.com/zilliztech/memsearch">memsearch</a> takes a different approach. Memory lives in plain Markdown files you can read, edit, and version-control with Git. Milvus serves as a derived index that can be rebuilt from those files at any time. You stay in control of what the agent knows.</p>
<p>Both <a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a> and <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus</a> are open source. We’re actively developing memsearch and would love feedback from anyone running it in production. Open an issue, submit a PR, or just tell us what’s working and what isn’t.</p>
<p>Projects mentioned in this guide:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>: Markdown-first memory for AI agents, backed by Milvus.</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: Open-source vector database for scalable hybrid search.</li>
<li><a href="https://github.com/gladego/index1">index1</a>: BM25 + vector hybrid search for AI coding agents.</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: Local hybrid search with LLM re-ranking.</li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">Keep Reading<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Persistent Memory for Claude Code: memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">What Is OpenClaw? Complete Guide to the Open-Source AI Agent</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw Tutorial: Connect to Slack for Local AI Assistant</a></li>
</ul>
