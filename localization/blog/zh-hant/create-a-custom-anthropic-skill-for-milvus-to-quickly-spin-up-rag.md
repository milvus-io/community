---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: 人類技能如何改變代理工具 - 以及如何為 Milvus 建立自訂技能以快速升級 RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  了解什麼是 Skills，以及如何在 Claude Code 中建立自訂 Skill，利用可重複使用的工作流程，從自然語言指令建立 Milvus 支援的
  RAG 系統。
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>工具使用是使代理工作的重要部分。代理需要選擇正確的工具、決定何時呼叫它，並正確格式化輸入。從紙上看來，這聽起來很簡單，但是一旦您開始建置真實的系統，您就會發現很多邊緣案例和失敗模式。</p>
<p>許多團隊使用 MCP 式的工具定義來組織這些，但 MCP 有一些粗糙的邊緣。這個模型必須同時對所有工具進行推理，而且沒有太多結構來引導其決策。除此之外，每個工具定義都必須放在上下文視窗中。其中有些工具非常龐大，GitHub 的 MCP 就有約 26K 個字元，這會在代理程式開始執行實際工作之前就吃掉上下文。</p>
<p>Anthropic 引入了<a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>Skills</strong></a>來改善這種情況。Skills 更小、更集中，而且更容易按需載入。您可以將網域邏輯、工作流程或腳本包裝成精簡的單元，讓代理程式只在需要時才拉入，而不是將所有東西都倒入上下文。</p>
<p>在這篇文章中，我會說明 Anthropic Skills 如何運作，然後在 Claude Code 中建立一個簡單的 Skill，將自然語言轉換成<a href="https://milvus.io/">Milvus 支援的</a>知識庫 - RAG 的快速設定，不需要額外的佈線。</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">什麼是人類技能？<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">Anthropic Skills</a>（或稱為 Agent Skills）是一個資料夾，內含 Agent 處理特定任務所需的指令、腳本和參考檔。將它們視為小型、自足的能力包。一個技能可以定義如何產生報告、執行分析或遵循特定的工作流程或規則集。</p>
<p>關鍵在於 Skills 是模組化的，可以依需求載入。與其將大量的工具定義塞入上下文視窗，代理程式只會拉入所需的 Skill。這可以降低上下文的使用率，同時讓模型清楚知道有哪些工具、何時呼叫這些工具，以及如何執行每個步驟。</p>
<p>這個格式刻意設計得很簡單，正因為如此，它已經被許多開發人員工具支援或輕鬆適應 - Claude Code、Cursor、VS Code 擴充、GitHub 整合、Codex 式的設定等等。</p>
<p>一個 Skill 遵循一致的資料夾結構：</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(核心檔案)</strong></p>
<p>這是代理程式的執行指南 - 告知代理程式該如何執行任務的文件。它定義了 Skill 的元資料（如名稱、描述和觸發關鍵字）、執行流程和預設設定。在此檔案中，您應該清楚說明</p>
<ul>
<li><p><strong>技能應在何時執行：</strong>例如，當使用者輸入包含 「使用 Python 處理 CSV 檔案」 之類的短語時，觸發 Skill。</p></li>
<li><p><strong>任務應該如何執行：</strong>按順序列出執行步驟，例如：解釋使用者的請求 → 從<code translate="no">scripts/</code> 目錄中呼叫預處理腳本 → 產生所需的程式碼 → 使用<code translate="no">templates/</code> 中的範本格式化輸出。</p></li>
<li><p><strong>規則和約束：</strong>指定細節，例如編碼慣例、輸出格式以及應如何處理錯誤。</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(執行腳本)</strong></p>
<p>此目錄包含以 Python、Shell 或 Node.js 等語言預先寫好的指令碼。代理可以直接呼叫這些腳本，而不是在執行時重複產生相同的程式碼。典型的例子包括<code translate="no">create_collection.py</code> 和<code translate="no">check_env.py</code> 。</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(文件範本)</strong></p>
<p>可重複使用的範本檔案，代理可以使用這些檔案來產生自訂內容。常見的範例包括報告範本或組態範本。</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(參考資料)</strong></p>
<p>代理在執行過程中可以參考的參考文件，例如 API 文件、技術規格或最佳實務指南。</p>
<p>總體而言，此架構反映了如何將工作交給新隊友：<code translate="no">SKILL.md</code> 解釋工作、<code translate="no">scripts/</code> 提供即時可用的工具、<code translate="no">templates/</code> 定義標準格式，以及<code translate="no">resources/</code> 提供背景資訊。有了這一切，代理就能可靠地執行任務，並將猜測減到最低。</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">實作教學：為 Milvus 驅動的 RAG 系統建立自訂技能<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>在本節中，我們將逐步建立一個自訂的 Skill，它可以設定一個 Milvus 套件，並透過簡單的自然語言指令組裝一個完整的 RAG 管線。我們的目標是跳過所有常見的設定工作 - 不需要手動模式設計、不需要索引設定、不需要模板程式碼。您只需告訴代理您想要什麼，Skill 就會為您處理 Milvus 的元件。</p>
<h3 id="Design-Overview" class="common-anchor-header">設計概述</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><table>
<thead>
<tr><th>元件</th><th>需求</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>機型</td><td>GLM 4.7、OpenAI</td></tr>
<tr><td>容器</td><td>停車場</td></tr>
<tr><td>虛擬化</td><td>2.6.8</td></tr>
<tr><td>模型組態平台</td><td>CC-Switch</td></tr>
<tr><td>套件管理員</td><td>npm</td></tr>
<tr><td>開發語言</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">步驟 1：環境設定</h3><p><strong>安裝</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>安裝 CC-Switch</strong></p>
<p><strong>注意：</strong>CC-Switch 是一個模型切換工具，當本機執行 AI 模型時，可以輕鬆切換不同的模型 API。</p>
<p>專案儲存庫<a href="https://github.com/farion1231/cc-switch">：https://github.com/farion1231/cc-switch</a></p>
<p><strong>選擇 Claude 並新增 API 金鑰</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>檢查目前狀態</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>部署並啟動 Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>設定 OpenAI API 金鑰</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">步驟 2：為 Milvus 建立自訂技能</h3><p><strong>建立目錄結構</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>初始化</strong> <code translate="no">SKILL.md</code></p>
<p><strong>注意：</strong>SKILL.md 是代理的執行指南。它定義了 Skill 的作用以及觸發方式。</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>撰寫核心腳本</strong></p>
<table>
<thead>
<tr><th>腳本類型</th><th>檔案名稱</th><th>目的</th></tr>
</thead>
<tbody>
<tr><td>環境檢查</td><td><code translate="no">check_env.py</code></td><td>檢查 Python 版本、所需的相依性和 Milvus 連線。</td></tr>
<tr><td>意向解析</td><td><code translate="no">intent_parser.py</code></td><td>將類似「建立 RAG 資料庫」的請求轉換成結構化的意向，例如<code translate="no">scene=rag</code></td></tr>
<tr><td>建立資料庫</td><td><code translate="no">milvus_builder.py</code></td><td>產生集合模式和索引配置的核心建立器</td></tr>
<tr><td>資料擷取</td><td><code translate="no">insert_milvus_data.py</code></td><td>載入文件、將文件分塊、產生嵌入並將資料寫入 Milvus。</td></tr>
<tr><td>範例一</td><td><code translate="no">basic_text_search.py</code></td><td>示範如何建立文件搜尋系統</td></tr>
<tr><td>範例二</td><td><code translate="no">rag_knowledge_base.py</code></td><td>示範如何建立一個完整的 RAG 知識庫</td></tr>
</tbody>
</table>
<p>這些腳本展示了如何將以 Milvus 為重點的 Skill 轉化為實用的東西：一個可運作的文件搜索系統和一個智能問答 (RAG) 設置。</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">步驟 3：啟用技能並執行測試</h3><p><strong>用自然語言描述請求</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>建立 RAG 系統</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>插入樣本資料</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>執行查詢</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>在本教程中，我們使用自定義 Skill 建立了一個由 Milvus 驅動的 RAG 系統。我們的目標不只是展示另一種呼叫 Milvus 的方式，而是展示 Skills 如何將通常需要多個步驟、繁重配置的設定，轉變為可以重複使用和迭代的東西。與其手動定義模式、調整索引或拼接工作流程程式碼，Skill 可以處理大部分的模板，讓您可以專注於 RAG 中真正重要的部分。</p>
<p>這只是個開始。完整的 RAG 管線有許多移動部件：預處理、分塊、混合搜尋設定、重排、評估等等。所有這些都可以打包成獨立的 Skills，並依據您的使用情況進行組合。如果您的團隊對向量尺寸、索引參數、提示範本或擷取邏輯有內部標準，Skills 是將該知識編碼並使其可重複的簡易方式。</p>
<p>對於新的開發人員，這降低了入門門檻-在開始運行之前不需要學習 Milvus 的每個細節。對於有經驗的團隊來說，這可以減少重複設定的次數，並有助於保持專案在不同環境下的一致性。技能無法取代深思熟慮的系統設計，但卻能消除許多不必要的摩擦。</p>
<p>👉完整的實作可在<a href="https://github.com/yinmin2020/open-milvus-skills">開放原始碼倉庫中</a>取得，您也可以在<a href="https://skillsmp.com/">Skill 市集</a>探索更多社群建置的範例。</p>
<h2 id="Stay-tuned" class="common-anchor-header">敬請期待！<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>我們也在努力推出官方的 Milvus 和 Zilliz Cloud Skills，涵蓋常見的 RAG 模式和生產最佳實務。如果您有想要支援的想法或特定工作流程，請加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>，與我們的工程師交談。如果您想要獲得自己設定的指導，您可以隨時預約<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours 課程</a>。</p>
