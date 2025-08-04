---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: 與您的向量資料庫對話：透過自然語言管理 Milvus
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
  Milvus MCP Server 透過 MCP 將 Milvus 直接連接到 Claude Code 和 Cursor 等 AI
  編碼助手。您可以透過自然語言管理 Milvus。
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>您有沒有想過只要告訴您的人工智慧助理，<em>「顯示我向量資料庫中的所有集合」</em>或<em>「尋找與此文字類似的文件」</em>，它就能實際運作？</p>
<p><a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP Server</strong></a>透過模型上下文協定 (Model Context Protocol, MCP) 將您的 Milvus 向量資料庫直接連接到 Claude Desktop 和 Cursor IDE 等 AI 編碼助手，讓這一切成為可能。您可以透過自然語言對話來管理整個 Milvus，而不需要撰寫<code translate="no">pymilvus</code> 程式碼。</p>
<ul>
<li><p>沒有 Milvus MCP 伺服器：使用 pymilvus SDK 寫 Python scripts 來搜尋向量</p></li>
<li><p>有了 Milvus MCP 伺服器「在我的收藏中查找與此文本相似的文件」。</p></li>
</ul>
<p>👉<strong>GitHub 儲存庫：</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>如果您正在使用<a href="https://zilliz.com/cloud">Zilliz Cloud</a>(管理的 Milvus)，我們也為您提供了保障。在這篇部落格的最後，我們也會介紹<strong>Zilliz MCP Server</strong>，這是一個可與 Zilliz Cloud 無縫運作的管理選項。讓我們深入瞭解。</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">您將從 Milvus MCP 伺服器獲得什麼<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP Server 為您的 AI 助手提供以下功能：</p>
<ul>
<li><p><strong>列出並探索</strong>向量集合</p></li>
<li><p>使用語意相似性<strong>搜尋向量</strong></p></li>
<li><p>使用自訂模式<strong>建立新的集合</strong></p></li>
<li><p><strong>插入和管理</strong>向量資料</p></li>
<li><p>無需編寫程式碼即可<strong>執行複雜的查詢</strong></p></li>
<li><p>更多</p></li>
</ul>
<p>所有這些都可透過自然對話完成，就像您在與資料庫專家對話一樣。查看<a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">此 repo</a>以獲得完整的功能清單。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">快速入門指南<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><p><strong>需要：</strong></p>
<ul>
<li><p>Python 3.10 或更高版本</p></li>
<li><p>執行中的 Milvus 實例 (本機或遠端)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">uv 套件管理器</a>(建議使用)</p></li>
</ul>
<p><strong>支援的 AI 應用程式：</strong></p>
<ul>
<li><p>Claude 桌面</p></li>
<li><p>游標 IDE</p></li>
<li><p>任何與 MCP 相容的應用程式</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">我們將使用的技術堆疊</h3><p>在本教程中，我們將使用下列技術堆疊：</p>
<ul>
<li><p><strong>語言運行時間：</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>套件管理員：</strong>UV</p></li>
<li><p><strong>IDE：</strong>游標</p></li>
<li><p><strong>MCP 伺服器：</strong>mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong>Claude 3.7</p></li>
<li><p><strong>向量資料庫</strong>Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">步驟 1: 安裝相依性</h3><p>首先，安裝 uv 套件管理程式：</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>或</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>驗證安裝：</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">步驟 2：設定 Milvus</h3><p><a href="https://milvus.io/">Milvus</a>是<a href="https://zilliz.com/">Zilliz</a> 專為 AI 工作負載設計的開放原始碼向量資料庫。其設計可處理數百萬至數十億筆向量記錄，目前已在 GitHub 上獲得超過 36,000 顆星星。在此基礎上，Zilliz 還提供<a href="https://zilliz.com/cloud">Zilliz Cloud -</a>Milvus 的全面管理服務，採用雲原生架構，提供可用性、成本效益和安全性。</p>
<p>有關 Milvus 部署需求，請參閱<a href="https://milvus.io/docs/prerequisite-docker.md">說明文件網站的此指南</a>。</p>
<p><strong>最低需求：</strong></p>
<ul>
<li><p><strong>軟體：</strong>Docker、Docker Compose</p></li>
<li><p><strong>記憶體：</strong>16GB 以上</p></li>
<li><p><strong>磁碟：</strong>100GB 以上</p></li>
</ul>
<p>下載部署 YAML 檔案：</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>啟動 Milvus：</p>
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
<p>您的 Milvus 實例將可在<code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">步驟 3：安裝 MCP 伺服器</h3><p>克隆並測試 MCP 伺服器：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>我們建議在 Cursor 註冊伺服器之前，先安裝相依性並在本機進行驗證：</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>如果您看到伺服器成功啟動，您就可以配置您的 AI 工具了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">步驟 4：配置您的 AI 助手</h3><p><strong>選項 A：Claude 桌面</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">從<code translate="no">[claude.ai/download](http://claude.ai/download)</code> 安裝 Claude Desktop。</h4></li>
<li><p>開啟設定檔案：</p></li>
</ol>
<ul>
<li>macOS：<code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows：<code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>新增此設定：</p>
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
<li>重新啟動 Claude Desktop</li>
</ol>
<p><strong>選項 B：游標 IDE</strong></p>
<ol>
<li><p>開啟 Cursor 設定 → 功能 → MCP</p></li>
<li><p>新增全局 MCP 伺服器 (這會建立<code translate="no">.cursor/mcp.json</code>)</p></li>
<li><p>添加此配置：</p></li>
</ol>
<p>注意：根據您的實際檔案結構調整路徑。</p>
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
<p><strong>參數：</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> 是 uv 可執行檔的路徑</li>
<li><code translate="no">--directory</code> 是複製專案的路徑</li>
<li><code translate="no">--milvus-uri</code> 是您的 Milvus 伺服器端點</li>
</ul>
<ol start="4">
<li>重新啟動游標或重新載入視窗</li>
</ol>
<p><strong>專業提示：</strong>在 macOS/Linux 上使用<code translate="no">which uv</code> 或在 Windows 上使用<code translate="no">where uv</code> 找到您的<code translate="no">uv</code> 路徑。</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">步驟 5：觀看實際運作</h3><p>設定完成後，請嘗試這些自然語言指令：</p>
<ul>
<li><p><strong>探索您的資料庫：</strong>"我的 Milvus 資料庫有哪些收藏集？</p></li>
<li><p><strong>建立一個新的收藏集：</strong>"建立一個稱為'articles'的收藏集，其中包含標題（字串）、內容（字串）欄位，以及一個 768 維的嵌入向量欄位"。</p></li>
<li><p><strong>搜尋類似內容：</strong>"在我的文章集中找出與「機器學習應用程式」最相似的五篇文章"。</p></li>
<li><p><strong>插入資料：</strong>"在文章集中新增一篇標題為'AI Trends 2024「、內容為」人工智慧持續演進...'的文章"</p></li>
</ul>
<p><strong>過去需要 30 多分鐘的編碼工作，現在只需要幾秒鐘的對話。</strong></p>
<p>您可以即時控制並透過自然語言存取 Milvus，無需撰寫模板或學習 API。</p>
<h2 id="Troubleshooting" class="common-anchor-header">疑難排解<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>如果 MCP 工具沒有出現，請完全重新啟動您的 AI 應用程式，使用<code translate="no">which uv</code> 驗證 UV 路徑，並使用<code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code> 手動測試伺服器。</p>
<p>對於連線錯誤，請使用<code translate="no">docker ps | grep milvus</code> 檢查 Milvus 是否正在執行，嘗試使用<code translate="no">127.0.0.1</code> 取代<code translate="no">localhost</code> ，並確認 19530 埠是否可存取。</p>
<p>如果遇到驗證問題，如果您的 Milvus 需要驗證，請設定<code translate="no">MILVUS_TOKEN</code> 環境變數，並驗證您嘗試操作的權限。</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">受管理的替代方案：Zilliz MCP 伺服器<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>開放原始碼的<strong>Milvus MCP 伺服器</strong>對於本機或自我託管的 Milvus 部署是一個很好的解決方案。但如果您使用的是<a href="https://zilliz.com/cloud">Zilliz Cloud -</a>由 Milvus 創造者打造的完全管理式企業級服務 - 則有一個專門打造的替代方案：<a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Server</strong></a>。</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a>透過提供可擴充、效能優異且安全的雲端原生向量資料庫，消除了管理您自己的 Milvus 實例的開銷。<strong>Zilliz MCP Server</strong>直接與 Zilliz Cloud 整合，並將其功能以 MCP 相容工具的形式呈現。這意味著您的 AI 助手 - 無論是在 Claude、Cursor 或其他 MCP 感知環境中 - 現在都可以使用自然語言來查詢、管理和協調您的 Zilliz Cloud 工作區。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>無需模板程式碼。無須切換標籤。無需手動撰寫 REST 或 SDK 呼叫。只要說出您的請求，其餘的就交給您的助理處理。</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">開始使用 Zilliz MCP 伺服器</h3><p>如果您已準備好以自然語言輕鬆使用生產就緒的向量基礎架構，只需幾個步驟即可開始使用：</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>註冊 Zilliz Cloud</strong></a>- 提供免費等級。</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server">從 </a>GitHub 套件<a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>庫安裝 Zilliz MCP Server</strong> </a>。</p></li>
<li><p><strong>設定您的 MCP 相容助手</strong>(Claude、Cursor 等) 以連線至您的 Zilliz Cloud 實例。</p></li>
</ol>
<p>這樣您就可以兩全其美：強大的向量搜尋與生產級的基礎架構，現在可以透過簡單的英文來存取。</p>
<h2 id="Wrapping-Up" class="common-anchor-header">總結<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>就這樣，您就學會了如何將 Milvus 變成一個自然語言友善的向量資料庫，您可以直接<em>與它對話</em>。再也不需要為了建立資料集或執行搜尋而翻查 SDK 文件或撰寫模板。</p>
<p>無論您是在本機執行 Milvus 或使用 Zilliz Cloud，MCP Server 都能為您的 AI 助手提供工具箱，讓您像專家一樣管理向量資料。只要輸入您想做的事，剩下的就交給 Claude 或 Cursor 處理。</p>
<p>所以，來吧，啟動您的 AI 開發工具，詢問「我有哪些集合？您再也不想回到手寫向量查詢的日子了。</p>
<ul>
<li><p>本地設定？使用開放原始碼的<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP 伺服器</a></p></li>
<li><p>喜歡管理式服務？註冊 Zilliz Cloud 並使用<a href="https://github.com/zilliztech/zilliz-mcp-server"> Zilliz MCP 伺服器</a></p></li>
</ul>
<p>您已經有了工具。現在讓您的 AI 來打字。</p>
