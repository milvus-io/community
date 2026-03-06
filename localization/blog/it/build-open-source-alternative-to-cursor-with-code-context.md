---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: |
  Building an Open-Source Alternative to Cursor with Code Context
author: Cheney Zhang
date: 2025-07-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context—an open-source, MCP-compatible plugin that brings powerful
  semantic code search to any AI coding agent, Claude Code and Gemini CLI, IDEs
  like VSCode, and even environments like Chrome.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">The AI Coding Boom—And Its Blind Spot<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>AI coding tools are everywhere—and they’re going viral for good reason. From <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code, Gemini CLI</a> to open-source Cursor alternatives, these agents can write functions, explain code dependency, and refactor entire files with a single prompt. Developers are racing to integrate them into their workflows, and in many ways, they’re delivering on the hype.</p>
<p><strong>But when it comes to <em>understanding your codebase</em>, most AI tools hit a wall.</strong></p>
<p>Ask Claude Code to find “where this project handles user authentication,” and it falls back on <code translate="no">grep -r &quot;auth&quot;</code>—spitting out 87 loosely related matches across comments, variable names, and filenames, likely missing many functions with authentication logic but not called “auth”. Try Gemini CLI, and it’ll look for keywords like “login” or “password,” missing functions like <code translate="no">verifyCredentials()</code> entirely. These tools are great at generating code, but when it’s time to navigate, debug, or explore unfamiliar systems, they fall apart. Unless they send the entire codebase to the LLM for context—burning through tokens and time—they struggle to provide meaningful answers.</p>
<p><em>That’s the real gap in today’s AI tooling:</em> <strong><em>code context.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursor Nailed It—But Not for Everyone<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong> tackles this head-on. Instead of keyword search, it builds a semantic map of your codebase using syntax trees, vector embeddings, and code-aware search. Ask it “where’s the email validation logic?” and it returns <code translate="no">isValidEmailFormat()</code> —not because the name matches, but because it understands what that code <em>does</em>.</p>
<p>While Cursor is powerful, it may not be suitable for everyone. <strong><em>Cursor is closed-source, cloud-hosted, and subscription-based.</em></strong> That puts it out of reach for teams working with sensitive code, security-conscious organizations, indie developers, students, and anyone who prefers open systems.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">What if You Could Build Your Own Cursor?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Here’s the thing: the core technology behind Cursor isn’t proprietary. It’s built on proven open-source foundations—vector databases like <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/ai-models">embedding models</a>, syntax parsers with Tree-sitter—all available to anyone willing to connect the dots.</p>
<p><em>So, we asked:</em> <strong><em>What if anyone could build their own Cursor?</em></strong> Runs on your infrastructure. No subscription fees. Fully customizable. Complete control over your code and data.</p>
<p>That’s why we built <a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a>—an open-source, MCP-compatible plugin that brings powerful semantic code search to any AI coding agent, such as Claude Code and Gemini CLI, IDEs like VSCode, and even environments like Google Chrome. It also gives you the power to build your own coding agent like Cursor from scratch, unlocking real-time, intelligent navigation of your codebase.</p>
<p><strong><em>No subscriptions. No black boxes. Just code intelligence—on your terms.</em></strong></p>
<p>In the rest of this post, we’ll walk through how Code Context works—and how you can start using it today.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Code Context: Open-Source Alternative to Cursor’s Intelligence<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> is an open-source, MCP-compatible semantic code search engine. Whether you’re building a custom AI coding assistant from scratch or adding semantic awareness to AI coding agents like Claude Code and Gemini CLI, Code Context is the engine that makes it possible.</p>
<p>It runs locally, integrates with your favorite tools and environments, such as VS Code and Chrome browsers, and delivers robust code understanding without relying on cloud-only, closed-source platforms.</p>
<p><strong>Core capabilities include:</strong></p>
<ul>
<li><p><strong>Semantic Code Search via Natural Language:</strong> Find code using plain English. Search for concepts like “user login verification” or “payment processing logic,” and Code Context locates the relevant functions—even if they don’t match the keywords exactly.</p></li>
<li><p><strong>Multi-Language Support:</strong> Search seamlessly across 15+ programming languages, including JavaScript, Python, Java, and Go, with consistent semantic understanding across them all.</p></li>
<li><p><strong>AST-Based Code Chunking:</strong> Code is automatically split into logical units, such as functions and classes, using AST parsing, ensuring search results are complete, meaningful, and never cut off mid-function.</p></li>
<li><p><strong>Live, Incremental Indexing:</strong> Code changes are indexed in real time. As you edit files, the search index stays up to date—no need for manual refreshes or re-indexing.</p></li>
<li><p><strong>Fully Local, Secure Deployment:</strong> Run everything on your own infrastructure. Code Context supports local models via Ollama and indexing via <a href="https://milvus.io/">Milvus</a>, so your code never leaves your environment.</p></li>
<li><p><strong>First-Class IDE Integration:</strong> The VSCode extension lets you search and jump to results instantly—right from your editor, with zero context switching.</p></li>
<li><p><strong>MCP Protocol Support:</strong> Code Context speaks MCP, making it easy to integrate with AI coding assistants and bring semantic search directly into their workflows.</p></li>
<li><p><strong>Browser Plugin Support:</strong> Search repositories directly from GitHub in your browser—no tabs, no copy-pasting, just instant context wherever you’re working.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">How Code Context Works</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context uses a modular architecture with a core orchestrator and specialized components for embedding, parsing, storage, and retrieval.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">The Core Module: Code Context Core</h3><p>At the heart of Code Context is the <strong>Code Context Core</strong>, which coordinates code parsing, embedding, storage, and semantic retrieval:</p>
<ul>
<li><p><strong>Text Processing Module</strong> splits and parses code using Tree-sitter for language-aware AST analysis.</p></li>
<li><p><strong>Embedding Interface</strong> supports pluggable backends—currently OpenAI and VoyageAI—converting code chunks into vector embeddings that capture their semantic meaning and contextual relationships.</p></li>
<li><p><strong>The Vector Database Interface</strong> stores these embeddings in a self-hosted <a href="https://milvus.io/">Milvus</a> instance (by default) or in <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, the managed version of Milvus.</p></li>
</ul>
<p>All of this is synchronized with your file system on a scheduled basis, ensuring the index stays up to date without requiring manual intervention.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Extension Modules on top of Code Context Core</h3><ul>
<li><p><strong>VSCode Extension</strong>: Seamless IDE integration for fast in-editor semantic search and jump-to-definition.</p></li>
<li><p><strong>Chrome Extension</strong>: Inline semantic code search while browsing GitHub repositories—no need to switch tabs.</p></li>
<li><p><strong>MCP Server</strong>: Exposes Code Context to any AI coding assistants via the MCP protocol, enabling real-time, context-aware assistance.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Getting Started with Code Context<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context can be plugged into coding tools you already use or to build a custom AI coding assistant from scratch. In this section, we’ll walk through both scenarios:</p>
<ul>
<li><p>How to integrate Code Context with existing tools</p></li>
<li><p>How to set up the Core Module for standalone semantic code search when building your own AI coding assistant</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">MCP Integration</h3><p>Code Context supports <strong>Model Context Protocol (MCP)</strong>, allowing AI coding agents like Claude Code to use it as a semantic backend.</p>
<p>To integrate with Claude Code:</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Once configured, Claude Code will automatically call Code Context for semantic code search when needed.</p>
<p>To integrate with other tools or environments, check out our<a href="https://github.com/zilliztech/code-context"> GitHub repo</a> for more examples and adapters.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Building Your Own AI Coding Assistant with Code Context</h3><p>To build a custom AI assistant using Code Context, you’ll set up the core module for semantic code search in just three steps:</p>
<ol>
<li><p>Configure your embedding model</p></li>
<li><p>Connect to your vector database</p></li>
<li><p>Index your project and start searching</p></li>
</ol>
<p>Here’s an example using <strong>OpenAI Embeddings</strong> and <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> <strong>vector database</strong> as the vector backend:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">VSCode Extension</h3><p>Code Context is available as a VSCode extension named <strong>“Semantic Code Search”</strong>, which brings intelligent, natural language–driven code search directly into your editor.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Once installed:</p>
<ul>
<li><p>Configure your API key</p></li>
<li><p>Index your project</p></li>
<li><p>Use plain English queries (no exact match needed)</p></li>
<li><p>Jump to results instantly with click-to-navigate</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This makes semantic exploration a native part of your coding workflow—no terminal or browser required.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Chrome Extension (Coming Soon)</h3><p>Our upcoming <strong>Chrome extension</strong> brings Code Context to GitHub web pages, allowing you to run semantic code search directly inside any public repository—no context switching or tabs required.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>You’ll be able to explore unfamiliar codebases with the same deep search capabilities you have locally. Stay tuned—the extension is in development and launching soon.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">Why Use Code Context?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>The basic setup gets you running quickly, but where <strong>Code Context</strong> truly shines is in professional, high-performance development environments. Its advanced features are designed to support serious workflows, from enterprise-scale deployments to custom AI tooling.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">Private Deployment for Enterprise-Grade Security</h3><p>Code Context supports fully offline deployment using the <strong>Ollama</strong> local embedding model and <strong>Milvus</strong> as a self-hosted vector database. This enables an entirely private code search pipeline: no API calls, no internet transmission, and no data ever leaves your local environment.</p>
<p>This architecture is ideal for industries with strict compliance requirements—such as finance, government, and defense—where code confidentiality is non-negotiable.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">Real-Time Indexing with Intelligent File Sync</h3><p>Keeping your code index up to date shouldn’t be slow or manual. Code Context includes a <strong>Merkle Tree–based file monitoring system</strong> that detects changes instantly and performs incremental updates in real time.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_0fd958fe81.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>By only re-indexing modified files, it reduces update times for large repositories from minutes to seconds. This ensures the code you just wrote is already searchable, without needing to click “refresh.”</p>
<p>In fast-paced dev environments, that kind of immediacy is critical.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">AST Parsing That Understands Code Like You Do</h3><p>Traditional code search tools split text by line or character count, often breaking logical units and returning confusing results.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context does better. It utilizes Tree-sitter AST parsing to comprehend the actual code structure. It identifies complete functions, classes, interfaces, and modules, providing clean, semantically complete results.</p>
<p>It supports major programming languages, including JavaScript/TypeScript, Python, Java, C/C++, Go, and Rust, with language-specific strategies for accurate chunking. For unsupported languages, it falls back to rule-based parsing, ensuring graceful handling without crashes or empty results.</p>
<p>These structured code units also feed into metadata for more accurate semantic search.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">Open Source and Extensible by Design</h3><p>Code Context is fully open source under the MIT license. All core modules are publicly available on GitHub.</p>
<p>We believe open infrastructure is the key to building powerful, trustworthy developer tools—and invite developers to extend it for new models, languages, or use cases.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">Solving the Context Window Problem for AI Assistants</h3><p>Large language models (LLMs) have a hard limit: their context window. This restricts them from seeing an entire codebase, which reduces the accuracy of completions, fixes, and suggestions.</p>
<p>Code Context helps bridge that gap. Its semantic code search retrieves the <em>right</em> pieces of code, giving your AI assistant focused, relevant context to reason with. It improves the quality of AI-generated output by letting the model “zoom in” on what actually matters.</p>
<p>Popular AI coding tools, such as Claude Code and Gemini CLI, lack native semantic code search—they rely on shallow, keyword-based heuristics. Code Context, when integrated via <strong>MCP</strong>, gives them a brain upgrade.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">Built for Developers, by Developers</h3><p>Code Context is packaged for modular reuse: each component is available as an independent <strong>npm</strong> package. You can mix, match, and extend as needed for your project.</p>
<ul>
<li><p>Need only a semantic code search? Use<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>Want to plug into an AI agent? Add <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>Building your own IDE/browser tool? Fork our VSCode and Chrome extension examples</p></li>
</ul>
<p>Some example applications of code context:</p>
<ul>
<li><p><strong>Context-aware autocomplete plugins</strong> that pull relevant snippets for better LLM completions</p></li>
<li><p><strong>Intelligent bug detectors</strong> that gather surrounding code to improve fix suggestions</p></li>
<li><p><strong>Safe code refactoring tools</strong> that find semantically related locations automatically</p></li>
<li><p><strong>Architecture visualizers</strong> that build diagrams from semantic code relationships</p></li>
<li><p><strong>Smarter code review assistants</strong> that surface historical implementations during PR reviews</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">Welcome to Join Our Community<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> is more than just a tool—it’s a platform for exploring how <strong>AI and vector databases</strong> can work together to truly understand code. As AI-assisted development becomes the norm, we believe semantic code search will be a foundational capability.</p>
<p>We welcome contributions of all kinds:</p>
<ul>
<li><p>Support for new languages</p></li>
<li><p>New embedding model backends</p></li>
<li><p>Innovative AI-assisted workflows</p></li>
<li><p>Feedback, bug reports, and design ideas</p></li>
</ul>
<p>Find us here:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Code Context on GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>MCP npm package</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCode marketplace</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>Together, we can build the infrastructure for the next generation of AI development tools—transparent, powerful, and developer-first.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
