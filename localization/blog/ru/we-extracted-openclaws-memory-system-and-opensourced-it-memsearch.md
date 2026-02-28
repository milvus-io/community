---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >
  We extracted OpenClaw's AI memory architecture into memsearch — a standalone
  Python library with Markdown logs, hybrid vector search, and Git support.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (previously clawdbot and moltbot) is going viral — <a href="https://github.com/openclaw/openclaw">189k+ GitHub stars</a> in under two weeks. That’s insane. Most of the buzz is around its autonomous, agentic capabilities across everyday chat channels, including iMessages, WhatsApp, Slack, Telegram, and more.</p>
<p>But as engineers working on a vector database system, what really caught our attention was <strong>OpenClaw’s approach to long-term memory</strong>. Unlike most memory systems out there, OpenClaw has its AI automatically write daily logs as Markdown files. Those files are the source of truth, and the model only “remembers” what gets written to disk. Human developers can open those markdown files, edit them directly, distill long-term principles, and see exactly what the AI remembers at any point. No black boxes. Honestly, it’s one of the cleanest and most developer-friendly memory architectures we’ve seen.</p>
<p>So naturally, we had a question: <strong><em>why should this only work inside OpenClaw? What if any agent could have memory like this?</em></strong> We took the exact memory architecture from OpenClaw and built <a href="https://github.com/zilliztech/memsearch">memsearch</a> — a standalone, plug-and-play long-term memory library that gives any agent persistent, transparent, human-editable memory. No dependency on the rest of OpenClaw. Just drop it in, and your agent gets durable memory with search powered by Milvus/Zilliz Cloud, plus Markdown logs as the canonical source of truth.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (open-source, MIT license)</p></li>
<li><p><strong>Documentation</strong>: <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Claude code plugin:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">What Makes OpenClaw’s Memory Different<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Before diving into the OpenClaw memory architecture, let’s get two concepts straight: <strong>context</strong> and <strong>memory</strong>. They sound similar but work very differently in practice.</p>
<ul>
<li><p><strong>Context</strong> is everything the agent sees in a single request — system prompts, project-level guidance files like <code translate="no">AGENTS.md</code> and <code translate="no">SOUL.md</code>, conversation history (messages, tool calls, compressed summaries), and the user’s current message. It’s scoped to one session and relatively compact.</p></li>
<li><p><strong>Memory</strong> is what persists across sessions. It lives on your local disk — the full history of past conversations, files the agent has worked with, and user preferences. Not summarized. Not compressed. The raw stuff.</p></li>
</ul>
<p>Now here’s the design decision that makes OpenClaw’s approach special: <strong>all memory is stored as plain Markdown files on the local filesystem.</strong> After each session, the AI writes updates to those Markdown logs automatically. You—and any developer—can open them, edit them, reorganize them, delete them, or refine them. Meanwhile, the vector database sits alongside this system, creating and maintaining an index for retrieval. Whenever a Markdown file changes, the system detects the change and re-indexes it automatically.</p>
<p>If you’ve used tools like Mem0 or Zep, you’ll notice the difference immediately. Those systems store memories as embeddings — that’s the only copy. You can’t read what your agent remembers. You can’t fix a bad memory by editing a row. OpenClaw’s approach gives you both: the transparency of plain files <strong>and</strong> the retrieval power of vector search using a vector database. You can read it, <code translate="no">git diff</code> it, grep it — it’s just files.</p>
<p>The only downside? Right now this Markdown-first memory system is tightly intertwined with the full OpenClaw ecosystem—the Gateway process, platform connectors, workspace configuration, and messaging infrastructure. If you only want the memory model, that’s a lot of machinery to drag in.</p>
<p>Which is exactly why we built <a href="http://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>: the same philosophy—Markdown as source of truth, automatic vector indexing, fully human-editable—but delivered as a lightweight, standalone library you can drop into any agentic architecture.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">How Memsearch Works<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>As mentioned earlier, <a href="https://github.com/zilliztech/memsearch">memsearch</a> is a fully independent long-term memory library that implements the same memory architecture used in OpenClaw—without bringing along the rest of the OpenClaw stack. You can plug it into any agent framework (Claude, GPT, Llama, custom agents, workflow engines) and instantly give your system persistent, transparent, human-editable memory.</p>
<p>All agent memory in memsearch is stored as plain-text Markdown in a local directory. The structure is intentionally simple so developers can understand it at a glance:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch uses <a href="https://milvus.io/"><strong>Milvus</strong></a> as the vector database to index these Markdown files for fast semantic retrieval. But crucially, the vector index is <em>not</em> the source of truth—the files are. If you delete the Milvus index entirely, <strong>you lose nothing.</strong> Memsearch simply re-embeds and re-indexes the Markdown files, rebuilding the full retrieval layer in a few minutes. This means your agent’s memory is transparent, durable, and fully reconstructable.</p>
<p>Here are the core capabilities of memsearch:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">Readable Markdown Makes Debugging as Simple as Editing a File</h3><p>Debugging AI memory is usually painful. When an agent produces a wrong answer, most memory systems give you no clear way to see <em>what</em> it actually stored. The typical workflow is writing custom code to query a memory API, then sifting through opaque embeddings or verbose JSON blobs—neither of which tell you much about the AI’s real internal state.</p>
<p><strong>memsearch eliminates that entire class of problems.</strong> All memory lives in the memory/ folder as plain Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>If the AI gets something wrong, fixing it is as simple as editing the file. Update the entry, save, and memsearch automatically re-indexes the change. Five seconds. No API calls. No tooling. No mystery. You debug AI memory the same way you debug documentation—by editing a file.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">Git-Backed Memory Means Teams Can Track, Review, and Roll Back Changes</h3><p>AI memory that lives in a database is hard to collaborate on. Figuring out who changed what and when means digging through audit logs, and many solutions do not even provide those. Changes happen silently, and disagreements about what the AI should remember have no clear resolution path. Teams end up relying on Slack messages and assumptions.</p>
<p>Memsearch fixes this problem by making memory just Markdown files—which means <strong>Git handles versioning automatically</strong>. A single command shows the entire history:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>Now AI memory participates in the same workflow as code. Architecture decisions, configuration updates, and preference changes all appear in diffs that anyone can comment on, approve, or revert:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">Plaintext Memory Makes Migration Nearly Effortless</h3><p>Migration is one of the biggest hidden costs of memory frameworks. Moving from one tool to another usually means exporting data, converting formats, re-importing, and hoping the fields are compatible. That kind of work can easily eat half a day, and the result is never guaranteed.</p>
<p>memsearch avoids the problem entirely because memory is plaintext Markdown. There is no proprietary format, no schema to translate, nothing to migrate:</p>
<ul>
<li><p><strong>Switch machines:</strong> <code translate="no">rsync</code> the memory folder. Done.</p></li>
<li><p><strong>Switch embedding models:</strong> Re-run the index command. It’ll take five minutes, and markdown files stay untouched.</p></li>
<li><p><strong>Switch vector database deployment:</strong> Change one config value. For example, going from Milvus Lite in development to Zilliz Cloud in production:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Your memory files stay exactly the same. The infrastructure around them can evolve freely. The result is long-term portability—a rare property in AI systems.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">Shared Markdown Files Let Humans and Agents Co-Author Memory</h3><p>In most memory solutions, editing what the AI remembers requires writing code against an API. That means only developers can maintain AI memory, and even for them, it is cumbersome.</p>
<p>Memsearch enables a more natural division of responsibility:</p>
<ul>
<li><p><strong>AI handles:</strong> Automatic daily logs (<code translate="no">YYYY-MM-DD.md</code>) with execution details like “deployed v2.3.1, 12% performance improvement.”</p></li>
<li><p><strong>Humans handle:</strong> Long-term principles in <code translate="no">MEMORY.md</code>, like “Team stack: Python + FastAPI + PostgreSQL.”</p></li>
</ul>
<p>Both sides edit the same Markdown files with whatever tools they already use. No API calls, no special tooling, no gatekeeper. When memory is locked inside a database, this kind of shared authorship is not possible. memsearch makes it the default.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">Under the Hood: memsearch Runs on Four Workflows That Keep Memory Fast, Fresh, and Lean<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch has four core workflows: <strong>Watch</strong> (monitor) → <strong>Index</strong> (chunk and embed) → <strong>Search</strong> (retrieve) → <strong>Compact</strong> (summarize). Here is what each one does.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Watch: Automatically Re-Index on Every File Save</h3><p>The <strong>Watch</strong> workflow monitors all Markdown files in the memory/ directory and triggers a re-index whenever a file is modified and saved. A <strong>1500ms debounce</strong> ensures updates are detected without wasting compute: if multiple saves occur in quick succession, the timer resets and fires only when edits have stabilized.</p>
<p>That delay is empirically tuned:</p>
<ul>
<li><p><strong>100ms</strong> → too sensitive; fires on every keystroke, burning embedding calls</p></li>
<li><p><strong>10s</strong> → too slow; developers notice lag</p></li>
<li><p><strong>1500ms</strong> → ideal balance of responsiveness and resource efficiency</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In practice, this means a developer can write code in one window and edit <code translate="no">MEMORY.md</code> in another, adding an API docs URL or correcting an outdated entry. Save the file, and the next AI query picks up the new memory. No restart, no manual re-index.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. Index: Smart Chunking, Deduplication, and Version-Aware Embeddings</h3><p>Index is the performance-critical workflow. It handles three things: <strong>chunking, deduplication, and versioned chunk IDs.</strong></p>
<p><strong>Chunking</strong> splits text along semantic boundaries—headings and their bodies—so related content stays together. This avoids cases where a phrase like “Redis configuration” gets split across chunks.</p>
<p>For example, this Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>Becomes two chunks:</p>
<ul>
<li><p>Chunk 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Chunk 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>Deduplication</strong> uses a SHA-256 hash of each chunk to avoid embedding the same text twice. If multiple files mention “PostgreSQL 16,” the embedding API is called once, not once per file. For ~500KB of text, this saves around <strong>$0.15/month.</strong> At scale, that adds up to hundreds of dollars.</p>
<p><strong>Chunk ID design</strong> encodes everything needed to know whether a chunk is stale. The format is <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. The <code translate="no">model_version</code> field is the important part: when an embedding model is upgraded from <code translate="no">text-embedding-3-small</code> to <code translate="no">text-embedding-3-large</code>, the old embeddings become invalid. Because the model version is baked into the ID, the system automatically identifies which chunks need re-embedding. No manual cleanup required.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. Search: Hybrid Vector + BM25 Retrieval for Maximum Accuracy</h3><p>Retrieval uses a hybrid search approach: vector search weighted at 70% and BM25 keyword search weighted at 30%. This balances two different needs that arise frequently in practice.</p>
<ul>
<li><p><strong>Vector search</strong> handles semantic matching. A query for “Redis cache config” returns a chunk containing “Redis L1 cache with 5min TTL” even though the wording is different. This is useful when the developer remembers the concept but not the exact phrasing.</p></li>
<li><p><strong>BM25</strong> handles exact matching. A query for “PostgreSQL 16” does not return results about “PostgreSQL 15.” This matters for error codes, function names, and version-specific behavior, where close is not good enough.</p></li>
</ul>
<p>The default 70/30 split works well for most use cases. For workflows that lean heavily toward exact matches, raising the BM25 weight to 50% is a one-line configuration change.</p>
<p>Results are returned as top-K chunks (default 3), each truncated to 200 characters. When the full content is needed, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> loads it. This progressive disclosure keeps LLM context window usage lean without sacrificing access to detail.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. Compact: Summarize Historical Memory to Keep Context Clean</h3><p>Accumulated memory eventually becomes a problem. Old entries fill the context window, increase token costs, and add noise that degrades answer quality. Compact addresses this by calling an LLM to summarize historical memory into a condensed form, then deleting or archiving the originals. It can be triggered manually or scheduled to run on a regular interval.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">How to get started with memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch provides both a <strong>Python API</strong> and a <strong>CLI</strong>, so you can use it inside agent frameworks or as a standalone debugging tool. Setup is minimal, and the system is designed so your local development environment and production deployment look almost identical.</p>
<p>Memsearch supports three Milvus-compatible backends, all exposed through the <strong>same API</strong>:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (default)</strong></a><strong>:</strong> Local <code translate="no">.db</code> file, zero configuration, suited for individual use.</p></li>
<li><p><strong>Milvus Standalone / Cluster:</strong> Self-hosted, supports multiple agents sharing data, suited for team environments.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>:</strong> Fully managed, with auto-scaling, backups, high availability, and isolation. Ideal for production workloads.</p></li>
</ul>
<p>Switching from local development to production is typically <strong>a one-line config change</strong>. Your code stays the same.</p>
<h3 id="Install" class="common-anchor-header">Install</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch also supports multiple embedding providers, including OpenAI, Google, Voyage, Ollama, and local models. This ensures your memory architecture stays portable and vendor-agnostic.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">Option 1: Python API (integrated into your agent framework)</h3><p>Here is a minimal example of a full agent loop using memsearch. You can copy/paste and modify as needed:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>This shows the core loop:</p>
<ul>
<li><p><strong>Recall</strong>: memsearch performs hybrid vector + BM25 retrieval</p></li>
<li><p><strong>Think</strong>: your LLM processes the user input + retrieved memory</p></li>
<li><p><strong>Remember</strong>: the agent writes new memory to Markdown, and memsearch updates its index</p></li>
</ul>
<p>This pattern fits naturally into any agent system—LangChain, AutoGPT, semantic routers, LangGraph, or custom agent loops. It’s framework-agnostic by design.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">Option 2: CLI (quick operations, good for debugging)</h3><p>The CLI is ideal for standalone workflows, quick checks, or inspecting memory during development:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>The CLI mirrors the Python API’s capabilities but works without writing any code—great for debugging, inspections, migrations, or validating your memory folder structure.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">How memsearch Compares to Other Memory Solutions<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>The most common question developers ask is why they would use memsearch when established options already exist. The short answer: memsearch trades advanced features like temporal knowledge graphs for transparency, portability, and simplicity. For most agent memory use cases, that is the right tradeoff.</p>
<table>
<thead>
<tr><th>Solution</th><th>Strengths</th><th>Limitations</th><th>Best For</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>Transparent plaintext memory, human-AI co-authoring, zero migration friction, easy debugging, Git-native</td><td>No built-in temporal graphs or complex multi-agent memory structures</td><td>Teams that value control, simplicity, and portability in long-term memory</td></tr>
<tr><td>Mem0</td><td>Fully managed, no infrastructure to run or maintain</td><td>Opaque—cannot inspect or manually edit memory; embeddings are the only representation</td><td>Teams that want a hands-off managed service and are okay with less visibility</td></tr>
<tr><td>Zep</td><td>Rich feature set: temporal memory, multi-persona modeling, complex knowledge graphs</td><td>Heavy architecture; more moving pieces; harder to learn and operate</td><td>Agents that truly need advanced memory structures or time-aware reasoning</td></tr>
<tr><td>LangMem / Letta</td><td>Deep, seamless integration inside their own ecosystems</td><td>Framework lock-in; hard to port to other agent stacks</td><td>Teams already committed to those specific frameworks</td></tr>
</tbody>
</table>
<h2 id="Try-memsearch-and-let-us-know-your-feedback" class="common-anchor-header">Try memsearch and let us know your feedback<button data-href="#Try-memsearch-and-let-us-know-your-feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch is fully open source under the MIT license, and the repository is ready for production experiments today.</p>
<ul>
<li><p><strong>Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>Docs:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>If you are building an agent that needs to remember things across sessions and want full control over what it remembers, memsearch is worth a look. The library installs with a single <code translate="no">pip install</code>, works with any agent framework, and stores everything as Markdown that you can read, edit, and version with Git.</p>
<p>We are actively developing memsearch and would love input from the community.</p>
<ul>
<li><p>Open an issue if something breaks.</p></li>
<li><p>Submit a PR if you want to extend the library.</p></li>
<li><p>Star the repo if the Markdown-as-source-of-truth philosophy resonates with you.</p></li>
</ul>
<p>OpenClaw’s memory system is no longer locked inside OpenClaw. Now, anyone can use it.</p>
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">What Is OpenClaw? Complete Guide to the Open-Source AI Agent</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw Tutorial: Connect to Slack for Local AI Assistant</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Build Clawdbot-Style AI Agents with LangGraph &amp; Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG vs Long-Running Agents: Is RAG Obsolete?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG</a></p></li>
</ul>
