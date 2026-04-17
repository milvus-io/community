---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: 与你的向量数据库对话：通过自然语言管理 Milvus
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
  Milvus MCP 服务器通过 MCP 将 Milvus 与人工智能编码助手（如 Claude Code 和
  Cursor）直接连接起来。你可以通过自然语言管理 Milvus。
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>您有没有想过，只需告诉人工智能助手 "<em>向我显示我的向量数据库中的所有 Collections "</em>或<em>"查找与此文本相似的文档"</em>，它就能真正发挥作用？</p>
<p><a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP 服务器</strong></a>通过模型上下文协议（MCP）将您的 Milvus 向量数据库直接连接到 Claude Desktop 和 Cursor IDE 等人工智能编码助手，从而实现了这一愿望。您可以通过自然语言对话管理整个 Milvus，而无需编写<code translate="no">pymilvus</code> 代码。</p>
<ul>
<li><p>无需 Milvus MCP 服务器：使用 pymilvus SDK 编写 Python 脚本搜索向量</p></li>
<li><p>使用 Milvus MCP 服务器："在我的 Collections 中查找与此文本相似的文档"。</p></li>
</ul>
<p>👉<strong>GitHub 存储库：</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>如果您正在使用<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（托管 Milvus），我们也会为您提供支持。在本博客的最后，我们还将介绍<strong>Zilliz MCP Server</strong>，这是一种与 Zilliz Cloud 无缝协作的托管选项。让我们深入了解。</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">使用 Milvus MCP 服务器的好处<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP 服务器为您的人工智能助手提供以下功能：</p>
<ul>
<li><p><strong>列出并探索</strong>向量集合</p></li>
<li><p>使用语义相似性<strong>搜索向量</strong></p></li>
<li><p>使用自定义 Schema<strong>创建新的 Collections</strong></p></li>
<li><p><strong>插入和管理</strong>向量数据</p></li>
<li><p>无需编写代码即可<strong>运行复杂的查询</strong></p></li>
<li><p>更多</p></li>
</ul>
<p>所有这些都可以通过自然对话完成，就像在与数据库专家交谈一样。查看<a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">此软件仓库</a>，了解功能的完整列表。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">快速入门指南<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">先决条件</h3><p><strong>要求：Python 3.10 或更高版本</strong></p>
<ul>
<li><p>Python 3.10 或更高版本</p></li>
<li><p>运行中的 Milvus 实例（本地或远程）</p></li>
<li><p><a href="https://github.com/astral-sh/uv">uv 软件包管理器</a>（推荐）</p></li>
</ul>
<p><strong>支持的人工智能应用程序：</strong></p>
<ul>
<li><p>克劳德桌面</p></li>
<li><p>光标集成开发环境</p></li>
<li><p>任何与 MCP 兼容的应用程序</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">我们将使用的技术栈</h3><p>在本教程中，我们将使用以下技术栈：</p>
<ul>
<li><p><strong>语言运行时：</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>软件包管理器</strong>UV</p></li>
<li><p><strong>IDE：</strong>光标</p></li>
<li><p><strong>MCP 服务器：</strong>mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong>Claude 3.7</p></li>
<li><p><strong>向量数据库</strong>Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">第 1 步：安装依赖项</h3><p>首先，安装 uv 软件包管理器：</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>或</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>验证安装：</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">第 2 步：设置 Milvus</h3><p><a href="https://milvus.io/">Milvus</a>是一个开源向量数据库，原生用于人工智能工作负载，由<a href="https://zilliz.com/">Zilliz</a> 创建。它专为处理数百万到数十亿条向量记录而设计，在 GitHub 上获得了 36,000 多颗星。在此基础上，Zilliz 还提供<a href="https://zilliz.com/cloud">Zilliz Cloud--</a>Milvus 的全面托管服务，该服务采用云原生架构，具有可用性、成本效益和安全性。</p>
<p>有关 Milvus 部署要求，请访问<a href="https://milvus.io/docs/prerequisite-docker.md">文档网站上的指南</a>。</p>
<p><strong>最低要求：</strong></p>
<ul>
<li><p><strong>软件：</strong>Docker、Docker Compose</p></li>
<li><p><strong>内存：</strong>16GB 以上</p></li>
<li><p><strong>磁盘：</strong>100GB 以上</p></li>
</ul>
<p>下载部署 YAML 文件：</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>启动 Milvus：</p>
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
<p>您的 Milvus 实例将在<code translate="no">http://localhost:19530</code> 上可用。</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">第 3 步：安装 MCP 服务器</h3><p>克隆并测试 MCP 服务器：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>我们建议在 Cursor 中注册服务器之前在本地安装依赖项并进行验证：</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>如果服务器启动成功，就可以配置人工智能工具了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">第 4 步：配置人工智能助手</h3><p><strong>选项 A：克劳德桌面</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">从<code translate="no">[claude.ai/download](http://claude.ai/download)</code> 安装 Claude Desktop。</h4></li>
<li><p>打开配置文件：</p></li>
</ol>
<ul>
<li>macOS：<code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows：<code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>添加此配置：</p>
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
<li>重启克劳德桌面</li>
</ol>
<p><strong>选项 B：光标 IDE</strong></p>
<ol>
<li><p>打开光标设置 → 功能 → MCP</p></li>
<li><p>添加新的全局 MCP 服务器（这将创建<code translate="no">.cursor/mcp.json</code>)</p></li>
<li><p>添加此配置：</p></li>
</ol>
<p>注意：根据实际文件结构调整路径。</p>
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
<p><strong>参数：</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> 是 uv 可执行文件的路径</li>
<li><code translate="no">--directory</code> 是克隆项目的路径</li>
<li><code translate="no">--milvus-uri</code> 是 Milvus 服务器端点</li>
</ul>
<ol start="4">
<li>重启光标或重新加载窗口</li>
</ol>
<p><strong>专业建议：</strong>在 macOS/Linux 上使用<code translate="no">which uv</code> 或在 Windows 上使用<code translate="no">where uv</code> 查找<code translate="no">uv</code> 路径。</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">第 5 步：实际操作</h3><p>配置完成后，试试这些自然语言命令：</p>
<ul>
<li><p><strong>探索你的数据库：</strong>"我的 Milvus 数据库中有哪些 Collections？</p></li>
<li><p><strong>创建一个新的 Collections：</strong>"创建一个名为'文章'的 Collections，其字段包括标题（字符串）、内容（字符串）和一个 768 维的 Embeddings 向量字段"。</p></li>
<li><p><strong>搜索相似内容：</strong>"在我的文章 Collections 中查找与'机器学习应用'最相似的五篇文章。"</p></li>
<li><p><strong>插入数据：</strong>"在文章 Collections 中添加一篇标题为'2024 年人工智能趋势'、内容为'人工智能不断发展......'的新文章"</p></li>
</ul>
<p><strong>过去需要 30 多分钟的编码工作，现在只需几秒钟的对话。</strong></p>
<p>您无需编写模板或学习应用程序接口（API），即可获得对 Milvus 的实时控制和自然语言访问。</p>
<h2 id="Troubleshooting" class="common-anchor-header">故障排除<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>如果 MCP 工具没有出现，请完全重启人工智能应用程序，使用<code translate="no">which uv</code> 验证 UV 路径，并使用<code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code> 手动测试服务器。</p>
<p>对于连接错误，请使用<code translate="no">docker ps | grep milvus</code> 检查 Milvus 是否在运行，尝试使用<code translate="no">127.0.0.1</code> 代替<code translate="no">localhost</code> ，并验证 19530 端口是否可访问。</p>
<p>如果遇到身份验证问题，如果您的 Milvus 需要身份验证，请设置<code translate="no">MILVUS_TOKEN</code> 环境变量，并验证您尝试操作的权限。</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">托管替代方案：Zilliz MCP 服务器<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>开源的<strong>Milvus MCP 服务器</strong>是本地或自托管部署 Milvus 的绝佳解决方案。但是，如果你正在使用<a href="https://zilliz.com/cloud">Zilliz Cloud--</a>由 Milvus 的创建者打造的完全托管的企业级服务--还有一个专门打造的替代方案：<a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP 服务器</strong></a>。</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a>通过提供可扩展、高性能和安全的云原生向量数据库，消除了管理自己的 Milvus 实例的开销。<strong>Zilliz MCP 服务器</strong>直接与 Zilliz Cloud 集成，并将其功能作为 MCP 兼容工具公开。这意味着您的人工智能助手--无论是在 Claude、Cursor 还是其他 MCP 感知环境中--现在都可以使用自然语言查询、管理和协调您的 Zilliz Cloud 工作区。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>无需模板代码。无需切换选项卡。无需手动编写 REST 或 SDK 调用。只需说出您的请求，其余的交给您的助手处理即可。</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 开始使用 Zilliz MCP 服务器</h3><p>如果您已准备好使用自然语言轻松实现生产就绪的向量基础架构，只需几个步骤即可开始使用：</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>注册 Zilliz Cloud</strong></a>- 免费层级。</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server">从 </a>GitHub 存储库<a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>安装 Zilliz MCP 服务器</strong> </a>。</p></li>
<li><p><strong>配置与 MCP 兼容的助手</strong>（Claude、Cursor 等），以便连接到 Zilliz Cloud 实例。</p></li>
</ol>
<p>这样，您就可以两全其美：强大的向量搜索和生产级基础架构，现在可以通过普通英语访问。</p>
<h2 id="Wrapping-Up" class="common-anchor-header">总结<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>就是这样--你刚刚学会了如何将 Milvus 变成一个自然语言友好型向量数据库，你可以<em>与它直接对话</em>。再也不用为了创建 Collections 或运行搜索而翻阅 SDK 文档或编写模板了。</p>
<p>无论您是在本地运行 Milvus 还是使用 Zilliz Cloud，MCP 服务器都能为您的人工智能助手提供一个工具箱，让它像专业人员一样管理您的向量数据。只需输入您想做的事情，剩下的就交给克劳德或光标来处理。</p>
<p>所以，来吧--启动你的人工智能开发工具，问一句 "我有哪些 Collections？"然后看看它是如何工作的。你再也不会想回到手工编写向量查询的时代了。</p>
<ul>
<li><p>本地设置？使用开源的<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP 服务器</a></p></li>
<li><p>更喜欢托管服务？注册 Zilliz Cloud 并使用<a href="https://github.com/zilliztech/zilliz-mcp-server"> Zilliz MCP 服务器</a></p></li>
</ul>
<p>你已经有了工具。现在就让人工智能来打字吧。</p>
