---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 介紹 Milvus Lite：Milvus 的輕量版
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: 體驗 Milvus Lite 的速度與效率，Milvus Lite 是著名的 Milvus 向量資料庫的輕量型變體，可進行快如閃電的相似性搜尋。
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>重要提示</em></strong></p>
<p><em>我們於 2024 年 6 月升級 Milvus Lite，讓 AI 開發人員能夠更快速地建立應用程式，同時確保各種部署選項 (包括 Milvus on Kurbernetes、Docker 和託管式雲端服務) 的一致體驗。Milvus Lite 也整合各種 AI 框架與技術，以向量搜尋功能簡化 AI 應用程式的開發。如需詳細資訊，請參閱下列參考資料：</em></p>
<ul>
<li><p><em>Milvus Lite 發佈部落格：h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Milvus Lite 文件<a href="https://milvus.io/docs/quickstart.md">：https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Milvus Lite GitHub 資源庫<a href="https://github.com/milvus-io/milvus-lite">：https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a>是一個開放原始碼的向量資料庫，專門用來索引、儲存和查詢深度神經網路和其他機器學習 (ML) 模型所產生的嵌入向量，規模達到數十億。它已經成為許多必須在大型資料集上執行相似性搜尋的公司、研究人員和開發人員的熱門選擇。</p>
<p>然而，有些使用者可能會覺得完整版的 Milvus 過於繁重或複雜。為了解決這個問題，Milvus 社群中最活躍的貢獻者之一<a href="https://github.com/matrixji">Bin Ji</a> 建立了<a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>，一個輕量版的 Milvus。</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Milvus Lite 是什麼？<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>如前所述，<a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>是 Milvus 的簡化版替代品，它提供了許多優點和好處。</p>
<ul>
<li>您可以將它整合到您的 Python 應用程式中，而不會增加額外的重量。</li>
<li>由於獨立的 Milvus 能夠與嵌入式 Etcd 和本機儲存一起運作，因此它是自足的，不需要任何其他相依性。</li>
<li>您可以將其作為 Python 函式庫匯入，並將其用作基於命令列介面 (CLI) 的獨立伺服器。</li>
<li>它能與 Google Colab 和 Jupyter Notebook 順暢運作。</li>
<li>您可以安全地將您的工作和撰寫的程式碼遷移到其他 Milvus 實體 (獨立、群集和完全管理版本)，而不會有任何資料遺失的風險。</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">什麼時候應該使用 Milvus Lite？<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>具體來說，Milvus Lite 在以下情況最有幫助：</p>
<ul>
<li>當您喜歡使用 Milvus，而不需要<a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>、<a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> 或<a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a> 等容器技術和工具。</li>
<li>當您使用 Milvus 時不需要虛擬機器或容器。</li>
<li>當您想要將 Milvus 功能整合到您的 Python 應用程式中。</li>
<li>當您想要在 Colab 或 Notebook 中啟動一個 Milvus 實例進行快速實驗。</li>
</ul>
<p><strong>注意</strong>：我們不建議在任何生產環境中使用 Milvus Lite，如果你需要高性能、高可用性或高擴展性。相反，請考慮使用<a href="https://github.com/milvus-io/milvus">Milvus 集群</a>或<a href="https://zilliz.com/cloud">在 Zilliz Cloud 上完全管理的 Milvus 來</a>進行生產。</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">如何開始使用 Milvus Lite？<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>現在，讓我們來看看如何安裝、配置和使用 Milvus Lite。</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><p>要使用 Milvus Lite，請確保您已完成下列需求：</p>
<ul>
<li>安裝 Python 3.7 或更新版本。</li>
<li>使用下列其中一個已驗證的作業系統：<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>注意事項</strong>：</p>
<ol>
<li>Milvus Lite 使用<code translate="no">manylinux2014</code> 作為基本映像檔，讓它相容於大部分 Linux 發行版本的 Linux 使用者。</li>
<li>在 Windows 上執行 Milvus Lite 也是可能的，儘管這尚未完全驗證。</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">安裝 Milvus Lite</h3><p>Milvus Lite 可在 PyPI 上找到，因此您可以透過<code translate="no">pip</code> 安裝。</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>您也可以使用 PyMilvus 安裝，如下所示：</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">使用並啟動 Milvus Lite</h3><p>從我們專案倉庫的範例資料夾下載範例<a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">筆記本</a>。您有兩個使用 Milvus Lite 的選項：將它匯入為 Python 函式庫，或是使用 CLI 在您的機器上以獨立伺服器的方式執行。</p>
<ul>
<li>要啟動 Milvus Lite 作為 Python 模組，請執行下列指令：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要暫停或停止 Milvus Lite，使用<code translate="no">with</code> 語句。</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要啟動 Milvus Lite 作為以 CLI 為基礎的獨立伺服器，執行下列指令：</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>啟動 Milvus Lite 後，你可以使用 PyMilvus 或其他你喜歡的工具連接到獨立伺服器。</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">以偵錯模式啟動 Milvus Lite</h3><ul>
<li>要以 Python 模組的調試模式執行 Milvus Lite，執行下列指令：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要以除錯模式執行獨立伺服器，執行下列指令：</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">持久化資料和日誌</h3><ul>
<li>要為 Milvus Lite 建立一個包含所有相關資料和日誌的本機目錄，請執行下列指令：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要在您的本地磁碟機上持久保存由獨立伺服器產生的所有資料和日誌，請執行以下命令：</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">配置 Milvus Lite</h3><p>配置 Milvus Lite 與使用 Python API 或 CLI 設定 Milvus 實例類似。</p>
<ul>
<li>要使用 Python API 設定 Milvus Lite，請使用<code translate="no">MilvusServer</code> 實例的<code translate="no">config.set</code> API 進行基本和額外設定：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要使用 CLI 設定 Milvus Lite，執行下列指令進行基本設定：</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>或者，執行以下指令進行額外設定。</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>所有可設定的項目都在 Milvus 套件隨附的<code translate="no">config.yaml</code> 模板中。</p>
<p>關於如何安裝和配置 Milvus Lite 的更多技術細節，請參閱我們的<a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">說明文件</a>。</p>
<h2 id="Summary" class="common-anchor-header">總結<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite 是以精簡格式尋求 Milvus 功能的最佳選擇。無論您是研究人員、開發人員或資料科學家，都值得一試。</p>
<p>Milvus Lite 也是開放原始碼社群的一朵奇葩，展示了其貢獻者的非凡工作。感謝 Bin Ji 的努力，現在有更多的使用者可以使用 Milvus。我們迫不及待地想看到 Bin Ji 和 Milvus 社群的其他成員在未來帶來的創新想法。</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">讓我們保持聯繫！<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您在安裝或使用 Milvus Lite 時遇到問題，您可以<a href="https://github.com/milvus-io/milvus-lite/issues/new">在此提交問題</a>，或透過<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> 聯絡我們。我們也歡迎您加入我們的<a href="https://milvus.io/slack/">Slack 頻道</a>，與我們的工程師及整個社群聊天，或查看<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">我們的週二辦公時間</a>！</p>
