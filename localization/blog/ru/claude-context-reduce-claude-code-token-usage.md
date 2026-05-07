---
id: claude-context-reduce-claude-code-token-usage.md
title: >
  Claude Context: Reduce Claude Code Token Usage with Milvus-Powered Code
  Retrieval
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >
  Claude Code burning tokens on grep? See how Claude Context uses Milvus-backed
  hybrid retrieval to cut token usage by 39.4%.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>Large context windows make AI coding agents feel limitless, right up until they start reading half your repository to answer one question. For many Claude Code users, the expensive part is not just model reasoning. It is the retrieval loop: search a keyword, read a file, search again, read more files, and keep paying for irrelevant context.</p>
<p>Claude Context is an open-source code retrieval MCP server that gives Claude Code and other AI coding agents a better way to find relevant code. It indexes your repository, stores searchable code chunks in a <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a>, and uses <a href="https://zilliz.com/blog/hybrid-search-with-milvus">hybrid retrieval</a> so the agent can pull in the code it actually needs instead of flooding the prompt with grep results.</p>
<p>In our benchmarks, Claude Context reduced token consumption by 39.4% on average and cut tool calls by 36.1% while preserving retrieval quality. This post explains why grep-style retrieval wastes context, how Claude Context works under the hood, and how it compares with a baseline workflow on real debugging tasks.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
    <span>Claude Context GitHub repository trending and passing 10,000 stars</span>
  </span>
</p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">Why grep-style code retrieval burns tokens in AI coding agents<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>An AI coding agent can only write useful code if it understands the codebase around the task: function call paths, naming conventions, related tests, data models, and historical implementation patterns. A large context window helps, but it does not solve the retrieval problem. If the wrong files enter the context, the model still wastes tokens and may reason from irrelevant code.</p>
<p>Code retrieval usually falls into two broad patterns:</p>
<table>
<thead>
<tr><th>Retrieval pattern</th><th>How it works</th><th>Where it breaks down</th></tr>
</thead>
<tbody>
<tr><td>Grep-style retrieval</td><td>Search literal strings, then read matching files or line ranges.</td><td>Misses semantically related code, returns noisy matches, and often requires repeated search/read cycles.</td></tr>
<tr><td>RAG-style retrieval</td><td>Index code in advance, then retrieve relevant chunks with semantic, lexical, or hybrid search.</td><td>Requires chunking, embeddings, indexing, and update logic that most coding tools do not want to own directly.</td></tr>
</tbody>
</table>
<p>This is the same distinction developers see in <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG application</a> design: literal matching is useful, but it is rarely enough when meaning matters. A function named <code translate="no">compute_final_cost()</code> may be relevant to a query about <code translate="no">calculate_total_price()</code> even if the exact words do not match. That is where <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">semantic search</a> helps.</p>
<p>In one debugging run, Claude Code repeatedly searched and read files before locating the right area. After several minutes, only a small fraction of the code it had consumed was relevant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
    <span>Claude Code grep-style search spending time on irrelevant file reads</span>
  </span>
</p>
<p>That pattern is common enough that developers complain about it publicly: the agent can be smart, but the context retrieval loop still feels expensive and imprecise.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
    <span>Developer comment about Claude Code context and token usage</span>
  </span>
</p>
<p>Grep-style retrieval fails in three predictable ways:</p>
<ul>
<li><strong>Information overload:</strong> large repositories produce many literal matches, and most are not useful for the current task.</li>
<li><strong>Semantic blindness:</strong> grep matches strings, not intent, behavior, or equivalent implementation patterns.</li>
<li><strong>Context loss:</strong> line-level matches do not automatically include the surrounding class, dependencies, tests, or call graph.</li>
</ul>
<p>A better code retrieval layer needs to combine keyword precision with semantic understanding, then return complete enough chunks for the model to reason about the code.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">What is Claude Context?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context is an open-source <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Model Context Protocol</a> server for code retrieval. It connects AI coding tools to a Milvus-backed code index, so an agent can search a repository by meaning instead of relying only on literal text search.</p>
<p>The goal is simple: when the agent asks for context, return the smallest useful set of code chunks. Claude Context does this by parsing the codebase, generating embeddings, storing chunks in the <a href="https://zilliz.com/what-is-milvus">Milvus vector database</a>, and exposing retrieval through MCP-compatible tools.</p>
<table>
<thead>
<tr><th>Grep problem</th><th>Claude Context approach</th></tr>
</thead>
<tbody>
<tr><td>Too many irrelevant matches</td><td>Rank code chunks by vector similarity and keyword relevance.</td></tr>
<tr><td>No semantic understanding</td><td>Use an <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">embedding model</a> so related implementations can match even when names differ.</td></tr>
<tr><td>Missing surrounding context</td><td>Return complete code chunks with enough structure for the model to reason about behavior.</td></tr>
<tr><td>Repeated file reads</td><td>Search the index first, then read or edit only the files that matter.</td></tr>
</tbody>
</table>
<p>Because Claude Context is exposed through MCP, it can work with Claude Code, Gemini CLI, Cursor-style MCP hosts, and other MCP-compatible environments. The same core retrieval layer can support multiple agent interfaces.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">How Claude Context works under the hood<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context has two main layers: a reusable core module and integration modules. The core handles parsing, chunking, indexing, search, and incremental sync. The upper layer exposes those capabilities through MCP and editor integrations.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
    <span>Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database</span>
  </span>
</p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">How does MCP connect Claude Context to coding agents?</h3><p>MCP provides the interface between the LLM host and external tools. By exposing Claude Context as an MCP server, the retrieval layer stays independent from any one IDE or coding assistant. The agent calls a search tool; Claude Context handles the code index and returns relevant chunks.</p>
<p>If you want to understand the broader pattern, the <a href="https://milvus.io/docs/milvus_and_mcp.md">MCP + Milvus guide</a> shows how MCP can connect AI tools to vector database operations.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">Why use Milvus for code retrieval?</h3><p>Code retrieval needs fast vector search, metadata filtering, and enough scale to handle large repositories. Milvus is designed for high-performance vector search and can support dense vectors, sparse vectors, and reranking workflows. For teams building retrieval-heavy agent systems, the <a href="https://milvus.io/docs/multi-vector-search.md">multi-vector hybrid search</a> docs and <a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">PyMilvus hybrid_search API</a> show the same underlying retrieval pattern used in production systems.</p>
<p>Claude Context can use Zilliz Cloud as the managed Milvus backend, which avoids running and scaling the vector database yourself. The same architecture can also be adapted to self-managed Milvus deployments.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Which embedding providers does Claude Context support?</h3><p>Claude Context supports multiple embedding options:</p>
<table>
<thead>
<tr><th>Provider</th><th>Best fit</th></tr>
</thead>
<tbody>
<tr><td>OpenAI embeddings</td><td>General-purpose hosted embeddings with broad ecosystem support.</td></tr>
<tr><td>Voyage AI embeddings</td><td>Code-oriented retrieval, especially when search quality matters.</td></tr>
<tr><td>Ollama</td><td>Local embedding workflows for privacy-sensitive environments.</td></tr>
</tbody>
</table>
<p>For related Milvus workflows, see the <a href="https://milvus.io/docs/embeddings.md">Milvus embedding overview</a>, <a href="https://milvus.io/docs/embed-with-openai.md">OpenAI embedding integration</a>, <a href="https://milvus.io/docs/embed-with-voyage.md">Voyage embedding integration</a>, and examples of running <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Ollama with Milvus</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">Why is the core library written in TypeScript?</h3><p>Claude Context is written in TypeScript because many coding-agent integrations, editor plugins, and MCP hosts are already TypeScript-heavy. Keeping the retrieval core in TypeScript makes it easier to integrate with application-layer tooling while still exposing a clean API.</p>
<p>The core module abstracts the vector database and embedding provider into a composable <code translate="no">Context</code> object:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">How Claude Context chunks code and keeps indexes fresh<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>Chunking and incremental updates determine whether a code retrieval system is usable in practice. If chunks are too small, the model loses context. If chunks are too large, the retrieval system returns noise. If indexing is too slow, developers stop using it.</p>
<p>Claude Context handles this with AST-based chunking, a fallback text splitter, and Merkle tree-based change detection.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">How does AST-based code chunking preserve context?</h3><p>AST chunking is the primary strategy. Instead of splitting files by line count or character count, Claude Context parses code structure and chunks around semantic units such as functions, classes, and methods.</p>
<p>That gives each chunk three useful properties:</p>
<table>
<thead>
<tr><th>Property</th><th>Why it matters</th></tr>
</thead>
<tbody>
<tr><td>Syntactic completeness</td><td>Functions and classes are not split in the middle.</td></tr>
<tr><td>Logical coherence</td><td>Related logic stays together, so retrieved chunks are easier for the model to use.</td></tr>
<tr><td>Multi-language support</td><td>Different tree-sitter parsers can handle JavaScript, Python, Java, Go, and other languages.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
    <span>AST-based code chunking preserving complete syntactic units and chunking results</span>
  </span>
</p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">What happens when AST parsing fails?</h3><p>For languages or files that AST parsing cannot handle, Claude Context falls back to LangChain’s <code translate="no">RecursiveCharacterTextSplitter</code>. It is less precise than AST chunking, but it prevents indexing from failing on unsupported input.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">How does Claude Context avoid re-indexing the whole repository?</h3><p>Re-indexing an entire repository after every change is too expensive. Claude Context uses a Merkle tree to detect exactly what changed.</p>
<p>A Merkle tree assigns each file a hash, derives each directory hash from its children, and rolls the whole repository into a root hash. If the root hash is unchanged, Claude Context can skip indexing. If the root changes, it walks down the tree to find the changed files and re-embeds only those files.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
    <span>Merkle tree change detection comparing unchanged and changed file hashes</span>
  </span>
</p>
<p>Sync runs in three stages:</p>
<table>
<thead>
<tr><th>Stage</th><th>What happens</th><th>Why it is efficient</th></tr>
</thead>
<tbody>
<tr><td>Quick check</td><td>Compare the current Merkle root with the last snapshot.</td><td>If nothing changed, the check finishes quickly.</td></tr>
<tr><td>Precise diff</td><td>Walk the tree to identify added, deleted, and modified files.</td><td>Only changed paths move forward.</td></tr>
<tr><td>Incremental update</td><td>Recompute embeddings for changed files and update Milvus.</td><td>The vector index stays fresh without a full rebuild.</td></tr>
</tbody>
</table>
<p>Local sync state is stored under <code translate="no">~/.context/merkle/</code>, so Claude Context can restore the file hash table and serialized Merkle tree after a restart.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">What happens when Claude Code uses Claude Context?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Setup is a single command before launching Claude Code:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>After indexing the repository, Claude Code can call Claude Context when it needs codebase context. In the same bug-finding scenario that previously burned time on grep and file reads, Claude Context found the exact file and line number with a full explanation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
    <span>Claude Context demo showing Claude Code finding the relevant bug location</span>
  </span>
</p>
<p>The tool is not limited to bug hunting. It also helps with refactoring, duplicate code detection, issue resolution, test generation, and any task where the agent needs accurate repository context.</p>
<p>At equivalent recall, Claude Context reduced token consumption by 39.4% and reduced tool calls by 36.1% in our benchmark. That matters because tool calls and irrelevant file reads often dominate the cost of coding-agent workflows.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
    <span>Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline</span>
  </span>
</p>
<p>The project now has more than 10,000 GitHub stars, and the repository includes the full benchmark details and package links.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
    <span>Claude Context GitHub star history showing rapid growth</span>
  </span>
</p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">How does Claude Context compare with grep on real bugs?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>The benchmark compares pure text search with Milvus-backed code retrieval on real debugging tasks. The difference is not just fewer tokens. Claude Context changes the agent’s search path: it starts closer to the implementation that needs to change.</p>
<table>
<thead>
<tr><th>Case</th><th>Baseline behavior</th><th>Claude Context behavior</th><th>Token reduction</th></tr>
</thead>
<tbody>
<tr><td>Django <code translate="no">YearLookup</code> bug</td><td>Searched for the wrong related symbol and edited registration logic.</td><td>Found the <code translate="no">YearLookup</code> optimization logic directly.</td><td>93% fewer tokens</td></tr>
<tr><td>Xarray <code translate="no">swap_dims()</code> bug</td><td>Read scattered files around mentions of <code translate="no">swap_dims</code>.</td><td>Found the implementation and related tests more directly.</td><td>62% fewer tokens</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">Case 1: Django YearLookup bug</h3><p><strong>Problem description:</strong> In the Django framework, the <code translate="no">YearLookup</code> query optimization breaks <code translate="no">__iso_year</code> filtering. When using the <code translate="no">__iso_year</code> filter, the <code translate="no">YearLookup</code> class incorrectly applies the standard BETWEEN optimization — valid for calendar years, but not for ISO week-numbering years.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Baseline (grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>The text search focused on <code translate="no">ExtractIsoYear</code> registration instead of the optimization logic in <code translate="no">YearLookup</code>.</p>
<p><strong>Claude Context:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>Semantic search understood <code translate="no">YearLookup</code> as the core concept and went straight to the right class.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
    <span>Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context</span>
  </span>
</p>
<p><strong>Result:</strong> 93% fewer tokens.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">Case 2: Xarray swap_dims bug</h3><p><strong>Problem description:</strong> The Xarray library’s <code translate="no">.swap_dims()</code> method unexpectedly mutates the original object, violating the expectation of immutability.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Baseline (grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>The baseline spent time navigating directories and reading nearby code before locating the actual implementation path.</p>
<p><strong>Claude Context:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>Semantic search located the relevant <code translate="no">swap_dims()</code> implementation and related context faster.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
    <span>Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context</span>
  </span>
</p>
<p><strong>Result:</strong> 62% fewer tokens.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Get started with Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>If you want to try the exact tool from this post, start with the <a href="https://github.com/zilliztech/claude-context">Claude Context GitHub repository</a> and the <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">Claude Context MCP package</a>. The repository includes setup instructions, benchmarks, and the core TypeScript packages.</p>
<p>If you want to understand or customize the retrieval layer, these resources are useful next steps:</p>
<ul>
<li>Learn the vector database basics with the <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>.</li>
<li>Explore <a href="https://milvus.io/docs/full-text-search.md">Milvus full text search</a> and the <a href="https://milvus.io/docs/full_text_search_with_milvus.md">LangChain full-text search tutorial</a> if you want to combine BM25-style search with dense vectors.</li>
<li>Review <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">open-source vector search engines</a> if you are comparing infrastructure options.</li>
<li>Try the <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Plugin for Claude Code</a> if you want vector database operations directly inside the Claude Code workflow.</li>
</ul>
<p>For help with Milvus or code retrieval architecture, join the <a href="https://milvus.io/community/">Milvus community</a> or book <a href="https://milvus.io/office-hours">Milvus Office Hours</a> for one-on-one guidance. If you would rather skip infrastructure setup, <a href="https://cloud.zilliz.com/signup">sign up for Zilliz Cloud</a> or <a href="https://cloud.zilliz.com/login">sign in to Zilliz Cloud</a> and use managed Milvus as the backend.</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">Why does Claude Code use so many tokens on some coding tasks?</h3><p>Claude Code can use many tokens when a task requires repeated search and file-reading loops across a large repository. If the agent searches by keyword, reads irrelevant files, and then searches again, every file read adds tokens even when the code is not useful for the task.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">How does Claude Context reduce Claude Code token usage?</h3><p>Claude Context reduces token usage by searching a Milvus-backed code index before the agent reads files. It retrieves relevant code chunks with hybrid search, so Claude Code can inspect fewer files and spend more of its context window on code that actually matters.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Is Claude Context only for Claude Code?</h3><p>No. Claude Context is exposed as an MCP server, so it can work with any coding tool that supports MCP. Claude Code is the main example in this post, but the same retrieval layer can support other MCP-compatible IDEs and agent workflows.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">Do I need Zilliz Cloud to use Claude Context?</h3><p>Claude Context can use Zilliz Cloud as a managed Milvus backend, which is the easiest path if you do not want to operate vector database infrastructure. The same retrieval architecture is based on Milvus concepts, so teams can also adapt it to self-managed Milvus deployments.</p>
