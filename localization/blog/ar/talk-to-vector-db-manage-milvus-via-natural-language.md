---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP Server connects Milvus directly to AI coding assistants like Claude
  Code and Cursor through MCP. You can manage Milvus via natural language.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>Ever wished you could just tell your AI assistant, <em>“Show me all collections in my vector database”</em> or <em>“Find documents similar to this text”</em> and have it actually work?</p>
<p>The <a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP Server</strong></a> makes this possible by connecting your Milvus vector database directly to AI coding assistants like Claude Desktop and Cursor IDE through Model Context Protocol (MCP). Instead of writing <code translate="no">pymilvus</code> code, you can manage your entire Milvus through natural language conversations.</p>
<ul>
<li><p>Without Milvus MCP Server: Writing Python scripts with pymilvus SDK to search vectors</p></li>
<li><p>With Milvus MCP Server: “Find documents similar to this text in my collection.”</p></li>
</ul>
<p>👉 <strong>GitHub Repository:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>And if you’re using <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (managed Milvus), we’ve got you covered too. At the end of this blog, we’ll also introduce the <strong>Zilliz MCP Server</strong>, a managed option that works seamlessly with Zilliz Cloud. Let’s dive in.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">What You’ll Get with Milvus MCP Server<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>The Milvus MCP Server gives your AI assistant the following capabilities:</p>
<ul>
<li><p><strong>List and explore</strong> vector collections</p></li>
<li><p><strong>Search vectors</strong> using semantic similarity</p></li>
<li><p><strong>Create new collections</strong> with custom schemas</p></li>
<li><p><strong>Insert and manage</strong> vector data</p></li>
<li><p><strong>Run complex queries</strong> without writing code</p></li>
<li><p>And more</p></li>
</ul>
<p>All through natural conversation, as if you’re talking to a database expert. Check out <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">this repo</a> for the complete list of capabilities.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">Quick Start Guide<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prerequisites</h3><p><strong>Required:</strong></p>
<ul>
<li><p>Python 3.10 or higher</p></li>
<li><p>A running Milvus instance (local or remote)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">uv package manager</a> (recommended)</p></li>
</ul>
<p><strong>Supported AI Applications:</strong></p>
<ul>
<li><p>Claude Desktop</p></li>
<li><p>Cursor IDE</p></li>
<li><p>Any MCP-compatible application</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">Tech Stack We’ll Use</h3><p>In this tutorial, we’ll use the following tech stack:</p>
<ul>
<li><p><strong>Language Runtime:</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>Package Manager:</strong> UV</p></li>
<li><p><strong>IDE:</strong> Cursor</p></li>
<li><p><strong>MCP Server:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> Claude 3.7</p></li>
<li><p><strong>Vector Database:</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Step 1: Install Dependencies</h3><p>First, install the uv package manager:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>Or:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verify installation:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">Step 2: Set Up Milvus</h3><p><a href="https://milvus.io/">Milvus</a> is an open-source vector database native for AI workloads, created by <a href="https://zilliz.com/">Zilliz</a>. Designed to handle millions to billions of vector records, it has gained over 36,000 stars on GitHub. Building on this foundation, Zilliz also offers <a href="https://zilliz.com/cloud">Zilliz Cloud</a>—a fully managed service of Milvus engineered for usability, cost-efficiency, and security with a cloud-native architecture.</p>
<p>For Milvus deployment requirements, visit <a href="https://milvus.io/docs/prerequisite-docker.md">this guide on the doc site</a>.</p>
<p><strong>Minimum requirements:</strong></p>
<ul>
<li><p><strong>Software:</strong> Docker, Docker Compose</p></li>
<li><p><strong>RAM:</strong> 16GB+</p></li>
<li><p><strong>Disk:</strong> 100GB+</p></li>
</ul>
<p>Download the deployment YAML file:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Start Milvus:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Your Milvus instance will be available at <code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">Step 3: Install the MCP Server</h3><p>Clone and test the MCP server:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>We recommend installing dependencies and verifying locally before registering the server in Cursor:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>If you see the server start successfully, you’re ready to configure your AI tool.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">Step 4: Configure Your AI Assistant</h3><p><strong>Option A: Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">Install Claude Desktop from <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>Open the configuration file:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>Add this configuration:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Restart Claude Desktop</li>
</ol>
<p><strong>Option B: Cursor IDE</strong></p>
<ol>
<li><p>Open Cursor Settings → Features → MCP</p></li>
<li><p>Add new global MCP server (this creates <code translate="no">.cursor/mcp.json</code>)</p></li>
<li><p>Add this configuration:</p></li>
</ol>
<p>Note: Adjust paths to your actual file structure.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parameters:</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> is the path to the uv executable</li>
<li><code translate="no">--directory</code> is the path to the cloned project</li>
<li><code translate="no">--milvus-uri</code> is your Milvus server endpoint</li>
</ul>
<ol start="4">
<li>Restart the Cursor or reload the window</li>
</ol>
<p><strong>Pro tip:</strong> Find your <code translate="no">uv</code> path with <code translate="no">which uv</code> on macOS/Linux or <code translate="no">where uv</code>  on Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">Step 5: See It in Action</h3><p>Once configured, try these natural language commands:</p>
<ul>
<li><p><strong>Explore your database:</strong> “What collections do I have in my Milvus database?”</p></li>
<li><p><strong>Create a new collection:</strong> “Create a collection called ‘articles’ with fields for title (string), content (string), and a 768-dimension vector field for embeddings.”</p></li>
<li><p><strong>Search for similar content:</strong> “Find the five most similar articles to ‘machine learning applications’ in my articles collection.”</p></li>
<li><p><strong>Insert data:</strong> “Add a new article with title ‘AI Trends 2024’ and content ‘Artificial intelligence continues to evolve…’ to the articles collection”</p></li>
</ul>
<p><strong>What used to require 30+ minutes of coding now takes seconds of conversation.</strong></p>
<p>You get real-time control and natural language access to Milvus—without writing boilerplate or learning the API.</p>
<h2 id="Troubleshooting" class="common-anchor-header">Troubleshooting<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>If MCP tools don’t appear, restart your AI application completely, verify the UV path with <code translate="no">which uv</code>, and test the server manually with <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>For connection errors, check that Milvus is running with <code translate="no">docker ps | grep milvus</code>, try using <code translate="no">127.0.0.1</code> instead of <code translate="no">localhost</code>, and verify port 19530 is accessible.</p>
<p>If you encounter authentication issues, set the <code translate="no">MILVUS_TOKEN</code> environment variable if your Milvus requires authentication, and verify your permissions for the operations you’re attempting.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">Managed Alternative: Zilliz MCP Server<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>The open-source <strong>Milvus MCP Server</strong> is a great solution for local or self-hosted deployments of Milvus. But if you’re using <a href="https://zilliz.com/cloud">Zilliz Cloud</a>—the fully managed, enterprise-grade service built by the creators of Milvus—there’s a purpose-built alternative: the <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Server</strong></a>.</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a> eliminates the overhead of managing your own Milvus instance by offering a scalable, performant, and secure cloud-native vector database. The <strong>Zilliz MCP Server</strong> integrates directly with Zilliz Cloud and exposes its capabilities as MCP-compatible tools. This means your AI assistant—whether in Claude, Cursor, or another MCP-aware environment—can now query, manage, and orchestrate your Zilliz Cloud workspace using natural language.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No boilerplate code. No switching tabs. No manually writing REST or SDK calls. Just say your request and let your assistant handle the rest.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 Getting Started with Zilliz MCP Server</h3><p>If you’re ready for production-ready vector infrastructure with the ease of natural language, getting started takes just a few steps:</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Sign up for Zilliz Cloud</strong></a> – free tier available.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>Install the Zilliz MCP Server</strong> </a>from the GitHub repository.</p></li>
<li><p><strong>Configure your MCP-compatible assistant</strong> (Claude, Cursor, etc.) to connect to your Zilliz Cloud instance.</p></li>
</ol>
<p>This gives you the best of both worlds: powerful vector search with production-grade infrastructure, now accessible through plain English.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Wrapping Up<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>And that’s it—you’ve just learned how to turn Milvus into a natural language-friendly vector database you can literally <em>talk to</em>. No more digging through SDK docs or writing boilerplate just to spin up a collection or run a search.</p>
<p>Whether you’re running Milvus locally or using Zilliz Cloud, the MCP Server gives your AI assistant a toolbox to manage your vector data like a pro. Just type what you want to do, and let Claude or Cursor handle the rest.</p>
<p>So go ahead—fire up your AI dev tool, ask “what collections do I have?” and see it in action. You’ll never want to go back to writing vector queries by hand.</p>
<ul>
<li><p>Local setup? Use the open-source<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP Server</a></p></li>
<li><p>Prefer a managed service? Sign up for Zilliz Cloud and use the<a href="https://github.com/zilliztech/zilliz-mcp-server"> Zilliz MCP Server</a></p></li>
</ul>
<p>You’ve got the tools. Now let your AI do the typing.</p>
