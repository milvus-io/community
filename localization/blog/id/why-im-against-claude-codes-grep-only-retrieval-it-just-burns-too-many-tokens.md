---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: >-
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  Learn how vector-based code retrieval cuts Claude Code token consumption by
  40%. Open-source solution with easy MCP integration. Try claude-context today.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>AI coding assistants are exploding. In just the last two years, tools like Cursor, Claude Code, Gemini CLI, and Qwen Code have gone from curiosities to everyday companions for millions of developers. But behind this rapid rise lies a brewing fight over something deceptively simple: <strong>how should an AI coding assistant actually search your codebase for context?</strong></p>
<p>Right now, there are two approaches:</p>
<ul>
<li><p><strong>Vector search-powered RAG</strong> (semantic retrieval).</p></li>
<li><p><strong>Keyword search with grep</strong> (literal string matching).</p></li>
</ul>
<p>Claude Code and Gemini have chosen the latter. In fact, a Claude engineer openly admitted on Hacker News that Claude Code doesn’t use RAG at all. Instead, it just greps your repo line by line (what they call “agentic search”)—no semantics, no structure, just raw string matching.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>That revelation split the community:</p>
<ul>
<li><p><strong>Supporters</strong> defend grep’s simplicity. It’s fast, exact, and—most importantly—predictable. With programming, they argue, precision is everything, and today’s embeddings are still too fuzzy to trust.</p></li>
<li><p><strong>Critics</strong> see grep as a dead end. It drowns you in irrelevant matches, burns tokens, and stalls your workflow. Without semantic understanding, it’s like asking your AI to debug blindfolded.</p></li>
</ul>
<p>Both sides have a point. And after building and testing my own solution, I can say this: vector search-based RAG approach changes the game. <strong>Not only does it make search dramatically faster and more accurate, but it also reduces token usage by 40% or more. (Skip to the Claude Context part for my approach)</strong></p>
<p>So why is grep so limiting? And how can vector search actually deliver better results in practice? Let’s break it down.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">What’s Wrong with Claude Code’s Grep-Only Code Search?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>I ran into this problem while debugging a thorny issue. Claude Code fired off grep queries across my repo, dumping giant blobs of irrelevant text back at me. One minute in, I still hadn’t found the relevant file. Five minutes later, I finally had the right 10 lines—but they’d been buried in 500 lines of noise.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>That’s not an edge case. Skimming Claude Code’s GitHub issues shows plenty of frustrated developers running into the same wall:</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>issue2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The community’s frustration boils down to three pain points:</p>
<ol>
<li><p><strong>Token bloat.</strong> Every grep dump shovels massive amounts of irrelevant code into the LLM, driving up costs that scale horribly with repo size.</p></li>
<li><p><strong>Time tax.</strong> You’re stuck waiting while the AI plays twenty questions with your codebase, killing focus and flow.</p></li>
<li><p><strong>Zero context.</strong> Grep matches literal strings. It has no sense of meaning or relationships, so you’re effectively searching blind.</p></li>
</ol>
<p>That’s why the debate matters: grep isn’t just “old school,” it’s actively holding back AI-assisted programming.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">Claude Code vs Cursor: Why the Latter Has Better Code Context<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>When it comes to code context, Cursor has done a better job. From day one, Cursor has leaned into <strong>codebase indexing</strong>: break your repo into meaningful chunks, embed those chunks into vectors, and retrieve them semantically whenever the AI needs context. This is textbook Retrieval-Augmented Generation (RAG) applied to code, and the results speak for themselves: tighter context, fewer tokens wasted, and faster retrieval.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Code, by contrast, has doubled down on simplicity. No indexes, no embeddings—just grep. That means every search is literal string matching, with no understanding of structure or semantics. It’s fast in theory, but in practice, developers often end up sifting through haystacks of irrelevant matches before finding the one needle they actually need.</p>
<table>
<thead>
<tr><th></th><th><strong>Claude Code</strong></th><th><strong>Cursor</strong></th></tr>
</thead>
<tbody>
<tr><td>Search Accuracy</td><td>Only surfaces exact matches—misses anything named differently.</td><td>Finds semantically relevant code even when keywords don’t match exactly.</td></tr>
<tr><td>Efficiency</td><td>Grep dumps massive blobs of code into the model, driving up token costs.</td><td>Smaller, higher-signal chunks reduce token load by 30–40%.</td></tr>
<tr><td>Scalability</td><td>Re-greps the repo every time, which slows down as projects grow.</td><td>Indexes once, then retrieves at scale with minimal lag.</td></tr>
<tr><td>Philosophy</td><td>Stay minimal—no extra infrastructure.</td><td>Index everything, retrieve intelligently.</td></tr>
</tbody>
</table>
<p>So why hasn’t Claude (or Gemini, or Cline) followed Cursor’s lead? The reasons are partly technical and partly cultural. <strong>Vector retrieval isn’t trivial—you need to solve chunking, incremental updates, and large-scale indexing.</strong> But more importantly, Claude Code is built around minimalism: no servers, no indexes, just a clean CLI. Embeddings and vector DBs don’t fit that design philosophy.</p>
<p>That simplicity is appealing—but it also caps the ceiling of what Claude Code can deliver. Cursor’s willingness to invest in real indexing infrastructure is why it feels more powerful today.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context: an Open-Source Project for Adding Semantic Code Search to Claude Code<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code is a strong tool—but it has poor code context. Cursor solved this with codebase indexing, but Cursor is closed-source, locked behind subscriptions, and pricey for individuals or small teams.</p>
<p>That gap is why we started building our own open-source solution: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>.</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> is an open-source MCP plugin that brings <strong>semantic code search</strong> to Claude Code (and any other AI coding agent that speaks MCP). Instead of brute-forcing your repo with grep, it integrates vector databases with embedding models to give LLMs <em>deep, targeted context</em> from your entire codebase. The result: sharper retrieval, less token waste, and a far better developer experience.</p>
<p>Here is how we built it:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">Technologies We Use</h3><p><strong>🔌 Interface Layer: MCP as the Universal Connector</strong></p>
<p>We wanted this to work everywhere—not just Claude. MCP (Model Context Protocol) acts like the USB standard for LLMs, letting external tools plug in seamlessly. By packaging Claude Context as an MCP server, it works not only with Claude Code but also with Gemini CLI, Qwen Code, Cline, and even Cursor.</p>
<p><strong>🗄️ Vector Database: Zilliz Cloud</strong></p>
<p>For the backbone, we chose <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (a fully managed service built on <a href="https://milvus.io/">Milvus</a>). It’s high-performance, cloud-native, elastic, and designed for AI workloads like codebase indexing. That means low-latency retrieval, near-infinite scale, and rock-solid reliability.</p>
<p><strong>🧩 Embedding Models: Flexible by Design</strong>Different teams have different needs, so Claude Context supports multiple embedding providers out of the box:</p>
<ul>
<li><p><strong>OpenAI embeddings</strong> for stability and wide adoption.</p></li>
<li><p><strong>Voyage embeddings</strong> for code-specialized performance.</p></li>
<li><p><strong>Ollama</strong> for privacy-first local deployments.</p></li>
</ul>
<p>Additional models can be slotted in as requirements evolve.</p>
<p><strong>💻 Language Choice: TypeScript</strong></p>
<p>We debated Python vs. TypeScript. TypeScript won—not just for application-level compatibility (VSCode plugins, web tooling) but also because Claude Code and Gemini CLI themselves are TypeScript-based. That makes integration seamless and keeps the ecosystem coherent.</p>
<h3 id="System-Architecture" class="common-anchor-header">System Architecture</h3><p>Claude Context follows a clean, layered design:</p>
<ul>
<li><p><strong>Core modules</strong> handle the heavy lifting: code parsing, chunking, indexing, retrieval, and synchronization.</p></li>
<li><p><strong>User interface</strong> handles integrations—MCP servers, VSCode plugins, or other adapters.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This separation keeps the core engine reusable across different environments while letting integrations evolve quickly as new AI coding assistants emerge.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">Core Module Implementation</h3><p>The core modules form the foundation of the entire system. They abstract vector databases, embedding models, and other components into composable modules that create a Context object, enabling different vector databases and embedding models for different scenarios.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">Solving Key Technical Challenges<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>Building Claude Context wasn’t just about wiring up embeddings and a vector DB. The real work came in solving the hard problems that make or break code indexing at scale. Here’s how we approached the three biggest challenges:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">Challenge 1: Intelligent Code Chunking</h3><p>Code can’t just be split by lines or characters. That creates messy, incomplete fragments and strips away the logic that makes code understandable.</p>
<p>We solved this with <strong>two complementary strategies</strong>:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">AST-Based Chunking (Primary Strategy)</h4><p>This is the default approach, using tree-sitter parsers to understand code syntax structure and split along semantic boundaries: functions, classes, methods. This delivers:</p>
<ul>
<li><p><strong>Syntax completeness</strong> – no chopped functions or broken declarations.</p></li>
<li><p><strong>Logical coherence</strong> – related logic stays together for better semantic retrieval.</p></li>
<li><p><strong>Multi-language support</strong> – works across JS, Python, Java, Go, and more via tree-sitter grammars.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">LangChain Text Splitting (Fallback Strategy)</h4><p>For languages that AST can’t parse or when parsing fails, LangChain’s <code translate="no">RecursiveCharacterTextSplitter</code> provides a reliable backup.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>It’s less “intelligent” than AST, but highly reliable—ensuring developers are never left stranded. Together, these two strategies balance semantic richness with universal applicability.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">Challenge 2: Handling Code Changes Efficiently</h3><p>Managing code changes represents one of the biggest challenges in code indexing systems. Re-indexing entire projects for minor file modifications would be completely impractical.</p>
<p>To solve this problem, we built the Merkle Tree-based synchronization mechanism.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Merkle Trees: The Foundation of Change Detection</h4><p>Merkle Trees create a hierarchical “fingerprint” system where each file has its own hash fingerprint, folders have fingerprints based on their contents, and everything culminates in a unique root node fingerprint for the entire codebase.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>When file content changes, the hash fingerprints cascade upward through each layer to the root node. This enables rapid change detection by comparing hash fingerprints layer by layer from the root downward, quickly identifying and localizing file modifications without full project re-indexing.</p>
<p>The system performs handshake synchronization checks every 5 minutes using a streamlined three-phase process:</p>
<p><strong>Phase 1: Lightning-Fast Detection</strong> calculates the entire codebase’s Merkle root hash and compares it with the previous snapshot. Identical root hashes mean no changes occurred—the system skips all processing in milliseconds.</p>
<p><strong>Phase 2: Precise Comparison</strong> triggers when root hashes differ, performing detailed file-level analysis to identify exactly which files were added, deleted, or modified.</p>
<p><strong>Phase 3: Incremental Updates</strong> recalculates vectors only for changed files and updates the vector database accordingly, maximizing efficiency.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">Local Snapshot Management</h4><p>All synchronization state persists locally in the user’s <code translate="no">~/.context/merkle/</code> directory. Each codebase maintains its own independent snapshot file containing file hash tables and serialized Merkle tree data, ensuring accurate state recovery even after program restarts.</p>
<p>This design delivers obvious benefits: most checks complete in milliseconds when no changes exist, only genuinely modified files trigger reprocessing (avoiding massive computational waste), and state recovery works flawlessly across program sessions.</p>
<p>From a user experience perspective, modifying a single function triggers re-indexing for only that file, not the entire project, dramatically improving development efficiency.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">Challenge 3: Designing the MCP Interface</h3><p>Even the smartest indexing engine is useless without a clean developer-facing interface. MCP was the obvious choice, but it introduced unique challenges:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 Tool Design: Keep It Simple</strong></h4><p>The MCP module serves as the user-facing interface, making user experience the top priority.</p>
<p>Tool design starts with abstracting standard codebase indexing and search operations into two core tools: <code translate="no">index_codebase</code> for indexing codebases and <code translate="no">search_code</code> for searching code.</p>
<p>This raises an important question: what additional tools are necessary?</p>
<p>The tool count requires careful balance—too many tools create cognitive overhead and confuse LLM tool selection, while too few might miss essential functionality.</p>
<p>Working backward from real-world use cases helps answer this question.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">Addressing Background Processing Challenges</h4><p>Large codebases can take considerable time to index. The naive approach of synchronously waiting for completion forces users to wait several minutes, which is simply unacceptable. Asynchronous background processing becomes essential, but MCP doesn’t natively support this pattern.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
    <span>8.png</span>
  </span>
</p>
<p>Our MCP server runs a background process within the MCP server to handle indexing while immediately returning startup messages to users, allowing them to continue working.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
    <span>9.png</span>
  </span>
</p>
<p>This creates a new challenge: how do users track indexing progress?</p>
<p>A dedicated tool for querying indexing progress or status solves this elegantly. The background indexing process asynchronously caches progress information, enabling users to check completion percentages, success status, or failure conditions at any time. Additionally, a manual index clearing tool handles situations where users need to reset inaccurate indexes or restart the indexing process.</p>
<p><strong>Final Tool Design:</strong></p>
<p><code translate="no">index_codebase</code> - Index codebase
<code translate="no">search_code</code> - Search code
<code translate="no">get_indexing_status</code> - Query indexing status
<code translate="no">clear_index</code> - Clear index</p>
<p>Four tools that strike the perfect balance between simplicity and functionality.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">🔹 Environment Variable Management</h4><p>Environment variable management often gets overlooked despite significantly impacting user experience. Requiring separate API key configuration for every MCP Client would force users to configure credentials multiple times when switching between Claude Code and Gemini CLI.</p>
<p>A global configuration approach eliminates this friction by creating a <code translate="no">~/.context/.env</code> file in the user’s home directory:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>This approach delivers clear benefits:</strong> users configure once and use everywhere across all MCP clients, all configurations centralize in a single location for easy maintenance, and sensitive API keys don’t scatter across multiple configuration files.</p>
<p>We also implements a three-tier priority hierarchy: process environment variables take highest priority, global configuration files have medium priority, and default values serve as fallbacks.</p>
<p>This design offers tremendous flexibility: developers can use environment variables for temporary testing overrides, production environments can inject sensitive configurations through system environment variables for enhanced security, and users configure once to work seamlessly across Claude Code, Gemini CLI, and other tools.</p>
<p>At this point, the MCP server’s core architecture is complete, spanning code parsing and vector storage through intelligent retrieval and configuration management. Every component has been carefully designed and optimized to create a system that’s both powerful and user-friendly.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">Hands-on Testing<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>So how does Claude Context actually perform in practice? I tested it against the exact same bug-hunting scenario that initially left me frustrated.</p>
<p>Installation was just one command before launching Claude Code:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Once my codebase was indexed, I gave Claude Code the same bug description that had previously sent it on a <strong>five-minute grep-powered goose chase</strong>. This time, through <code translate="no">claude-context</code> MCP calls, it <strong>immediately pinpointed the exact file and line number</strong>, complete with an explanation of the issue.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The difference wasn’t subtle—it was night and day.</p>
<p>And it wasn’t just bug hunting. With Claude Context integrated, Claude Code consistently produced higher-quality results across:</p>
<ul>
<li><p><strong>Issue resolution</strong></p></li>
<li><p><strong>Code refactoring</strong></p></li>
<li><p><strong>Duplicate code detection</strong></p></li>
<li><p><strong>Comprehensive testing</strong></p></li>
</ul>
<p>The performance boost shows up in the numbers, too. In side-by-side testing:</p>
<ul>
<li><p>Token usage dropped by over 40%, without any loss in recall.</p></li>
<li><p>That translates directly into lower API costs and faster responses.</p></li>
<li><p>Alternatively, with the same budget, Claude Context delivered far more accurate retrievals.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We have open-sourced Claude Context on GitHub, and it has earned 2.6K+ stars already. Thank you all for your support and likes.</p>
<p>You can try it yourself:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>Detailed benchmarks and testing methodology are available in the repo—we’d love your feedback.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">Looking Forward<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>What started as a frustration with grep in Claude Code has grown into a solid solution: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>—an open-source MCP plugin that brings semantic, vector-powered search to Claude Code and other coding assistants. The message is simple: developers don’t have to settle for inefficient AI tooling. With RAG and vector retrieval, you can debug faster, cut token costs by 40%, and finally get AI assistance that truly understands your codebase.</p>
<p>And this isn’t limited to Claude Code. Because Claude Context is built on open standards, the same approach works seamlessly with Gemini CLI, Qwen Code, Cursor, Cline, and beyond. No more being locked into vendor trade-offs that prioritize simplicity over performance.</p>
<p>We’d love for you to be part of that future:</p>
<ul>
<li><p><strong>Try</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a><strong>:</strong> it is open-source and totally free</p></li>
<li><p><strong>Contribute to its development</strong></p></li>
<li><p><strong>Or build your own solution</strong> using Claude Context</p></li>
</ul>
<p>👉 Share your feedback, ask questions, or get help by joining our <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord community</strong></a>.</p>
