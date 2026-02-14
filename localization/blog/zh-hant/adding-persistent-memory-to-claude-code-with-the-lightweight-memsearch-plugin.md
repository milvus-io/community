---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: 使用輕量級 memsearch 外掛為 Claude 程式碼加入持久記憶體
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  使用 memsearch ccplugin 賦予 Claude Code 長期記憶。輕量、透明的 Markdown 儲存，自動語意檢索，零 token
  開銷。
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>我們最近建立並開源了<a href="https://github.com/zilliztech/memsearch">memsearch</a>，這是一個獨立、隨插即用的長期記<a href="https://github.com/zilliztech/memsearch">憶體</a>函式庫，可提供任何代理程式持久、透明且可由人類編輯的記憶體。它使用與 OpenClaw 相同的底層記憶體架構，只是沒有 OpenClaw 堆疊的其他部分。這表示您可以將它放入任何代理程式框架 (Claude、GPT、Llama、客製化代理程式、工作流程引擎)，並立即新增持久、可查詢的記憶體。<em>(如果您想要深入瞭解 memsearch 的運作方式，我們</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>在這裡另外</em></a> <em>寫了一篇</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>文章</em></a><em>）。</em></p>
<p>在大多數的代理程式工作流程中，memsearch 都能發揮預期的功能。但<strong>代理程式編碼</strong>卻是另一回事。編碼工作會持續很長時間，上下文會不斷轉換，值得保留的資訊會累積數天或數週。這種龐大的數量和不穩定性暴露了典型代理程式記憶體系統的弱點，memsearch 也包括在內。在編碼情境中，檢索模式的差異足以讓我們無法原封不動地重複使用現有工具。</p>
<p>為了解決這個問題，我們建立了一個<strong>專為 Claude Code 設計的持久記憶體外掛程式</strong>。它位於 memsearch CLI 之上，我們稱之為<strong>memsearch ccplugin</strong>。</p>
<ul>
<li>GitHub Repo:<a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(開放原始碼，MIT 授權)</em></li>
</ul>
<p>有了輕量級的<strong>memsearch ccplugin</strong>在幕後管理記憶體，Claude Code 就有能力記住每一次對話、每一個決定、每一個風格偏好，以及每一個多天的線程 - 自動索引、完全可搜尋，以及跨會話的持久性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>為了清楚起見，本文章中的"ccplugin」是指上層，或 Claude Code 外掛程式本身。"memsearch" 指的是下層，也就是其下的獨立 CLI 工具。</em></p>
<p>那麼，為什麼編碼需要自己的外掛程式？歸根究柢，你幾乎一定會碰到兩個問題：Claude Code 缺乏持久記憶體，以及 claude-mem 等現有解決方案的笨拙與複雜。</p>
<p>那麼，為什麼要建立一個專用的外掛程式呢？因為編碼代理程式會遇到兩個痛點，您幾乎一定親身體驗過：</p>
<ul>
<li><p>Claude 程式碼沒有持久性記憶體。</p></li>
<li><p>許多現有的社群解決方案 (例如<em>claude-mem)，雖然</em>功能強大，但對於日常的編碼工作而言，卻顯得笨重、笨拙或過於複雜。</p></li>
</ul>
<p>ccplugin 的目標是在 memsearch 的基礎上，以最小、透明、開發者友善的層級來解決這兩個問題。</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">Claude 程式碼的記憶體問題：會話結束時會忘記所有事情<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們從 Claude Code 使用者最常遇到的情況開始。</p>
<p>您在早上打開 Claude Code。您輸入：「繼續昨天的 auth 重構」。Claude 回覆："我不確定你昨天在做什麼。於是你花了十分鐘複製貼上昨天的記錄。這不是個大問題，但因為出現得太頻繁，所以很快就變得很煩人。</p>
<p>儘管 Claude Code 有自己的記憶體機制，但還是差強人意。<code translate="no">CLAUDE.md</code> 檔案可以儲存專案指令和偏好設定，但它更適合靜態規則和簡短指令，不適合長期累積知識。</p>
<p>Claude Code 提供<code translate="no">resume</code> 和<code translate="no">fork</code> 指令，但對使用者來說並不友善。對於 fork 指令，您需要記住 session ID、手動輸入指令，以及管理一棵樹狀的分支會話歷史。當您執行<code translate="no">/resume</code> 時，您會得到一堵會話標題牆。如果您只記得幾個關於您所做的事的細節，而且是幾天前的事，那麼祝您好運，能找到正確的會話。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>對於長期的、跨專案的知識累積，這整個方法是不可能的。</p>
<p>為了實現這個想法，claude-mem 使用三層記憶系統。第一層會搜尋高層摘要。第二層會深入時間線尋找更多細節。第三層會抽取原始對話的完整觀察。除此之外，還有隱私標籤、成本追蹤和網路可視化介面。</p>
<p>以下是它的工作原理：</p>
<ul>
<li><p><strong>執行層。</strong>Node.js Worker 服務在連接埠 37777 上執行。會話元資料存放在輕量級 SQLite 資料庫中。向量資料庫處理記憶體內容的精確語意檢索。</p></li>
<li><p><strong>互動層。</strong>基於 React 的 Web UI 可讓您即時檢視擷取的記憶：摘要、時間線和原始記錄。</p></li>
<li><p><strong>介面層。</strong>MCP (Model Context Protocol，模型上下文協定) 伺服器提供標準化的工具介面。Claude 可以呼叫<code translate="no">search</code> (查詢高階摘要)、<code translate="no">timeline</code> (檢視詳細時間線) 和<code translate="no">get_observations</code> (擷取原始互動記錄) 來直接擷取和使用記憶體。</p></li>
</ul>
<p>平心而論，這是一個解決 Claude Code 記憶問題的可靠產品。但在日常工作中，它顯得笨拙而複雜。</p>
<table>
<thead>
<tr><th>層級</th><th>技術</th></tr>
</thead>
<tbody>
<tr><td>語言</td><td>TypeScript (ES2022, ESNext 模組)</td></tr>
<tr><td>運行時間</td><td>Node.js 18+</td></tr>
<tr><td>資料庫</td><td>SQLite 3 與 bun:sqlite 驅動程式</td></tr>
<tr><td>向量儲存</td><td>ChromaDB (可選，用於語意搜尋)</td></tr>
<tr><td>HTTP 伺服器</td><td>Express.js 4.18</td></tr>
<tr><td>即時</td><td>伺服器發送事件 (SSE)</td></tr>
<tr><td>UI 架構</td><td>React + TypeScript</td></tr>
<tr><td>AI SDK</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>建置工具</td><td>esbuild (bundles TypeScript)</td></tr>
<tr><td>流程管理員</td><td>包</td></tr>
<tr><td>測試</td><td>Node.js 內建測試執行器</td></tr>
</tbody>
</table>
<p><strong>對於初學者來說，設定工作相當繁重。</strong>要讓 claude-mem 執行就必須先安裝 Node.js、Bun 和 MCP runtime，然後在上面架設 Worker 服務、Express 伺服器、React UI、SQLite 和向量儲存。這需要部署、維護和在出現問題時調試許多移動部件。</p>
<p><strong>所有這些元件也會燒掉你沒有要求花費的代幣。</strong>MCP 工具定義會永久載入 Claude 的上下文視窗，而每次工具呼叫都會在請求與回應中消耗代幣。在長時間的會話中，這種開銷會快速增加，並可能使代幣成本失控。</p>
<p><strong>記憶體回憶並不可靠，因為它完全取決於 Claude 是否選擇搜尋。</strong>Claude 必須自行決定呼叫<code translate="no">search</code> 等工具來啟動擷取。如果它沒有意識到自己需要記憶體，相關內容就永遠不會出現。而且三層記憶體中的每一層都需要自己明確的工具調用，所以如果 Claude 沒有想到要去找，就沒有後備。</p>
<p><strong>最後，資料儲存是不透明的，這使得除錯和遷移變得不愉快。</strong>記憶體分為 SQLite 的會話元資料和 Chroma 的二進位向量資料，沒有開放格式將它們連結在一起。遷移意味著撰寫匯出腳本。要查看 AI 的實際記憶內容，必須透過 Web UI 或專用的查詢介面。沒辦法只看原始資料。</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">為什麼 Claude Code 的 memsearch 外掛程式更好？<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>我們想要一個真正輕量級的記憶體層級 - 沒有額外的服務、沒有糾結的架構、沒有運作開支。這就是我們建立<strong>memsearch ccplugin</strong> 的動機。其核心是一項實驗：<em>以編碼為重點的記憶體系統能夠從根本上簡化嗎？</em></p>
<p>是的，而且我們證明了這一點。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>整個 ccplugin 就是四個 shell 鉤子加上一個背景監視程序。沒有 Node.js、沒有 MCP 伺服器、沒有 Web UI。它只是呼叫 memsearch CLI 的 shell 腳本，大幅降低了設定與維護的難度。</p>
<p>ccplugin 之所以可以如此薄，是因為有嚴格的責任界限。它不處理記憶體儲存、向量檢索或文字嵌入。所有這些工作都交由下方的 memsearch CLI 處理。ccplugin 只有一個工作：將 Claude Code 的生命週期事件（會話開始、提示提交、回應停止、會話結束）橋接至相應的 memsearch CLI 函式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>此解耦設計讓系統的彈性超越 Claude Code。memsearch CLI 可獨立於其他 IDE、其他代理框架，甚至是單純的手動調用。它不會侷限於單一的使用情況。</p>
<p>實際上，這種設計提供了三個主要優點。</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1.所有記憶體都位於純 Markdown 檔案中</h3><p>ccplugin 創建的每個記憶體都以 Markdown 檔案的形式存在於<code translate="no">.memsearch/memory/</code> 。</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>每天一個檔案。每個檔案都以純文字包含當天的會話摘要，完全人類可讀。以下是 memsearch 專案本身的每日記憶體檔案截圖：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>您可以馬上看到格式：時間戳記、會話 ID、回合 ID，以及會話摘要。沒有任何東西是隱藏的。</p>
<p>想知道 AI 記憶了什麼嗎？打開 Markdown 檔案。想要編輯記憶體？使用您的文字編輯器。想要遷移資料嗎？複製<code translate="no">.memsearch/memory/</code> 資料夾。</p>
<p><a href="https://milvus.io/">Milvus</a>向量索引是一個加速語意搜尋的快取記憶體。它可以隨時從 Markdown 重建。沒有不透明的資料庫，沒有二進位的黑盒子。所有資料都是可追蹤且完全可重建的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2.自動內文注入零額外代號成本</h3><p>透明儲存是本系統的基礎。真正的回報來自於這些記憶體的使用方式，在 ccplugin 中，記憶體的調用是完全自動的。</p>
<p>每次提交提示時，<code translate="no">UserPromptSubmit</code> 鉤子就會啟動語意搜尋，並將前三名的相關記憶體注入上下文。Claude 不會決定是否搜尋。它只是取得上下文。</p>
<p>在此過程中，Claude 永遠不會看到 MCP 工具定義，因此上下文視窗中沒有任何額外內容。鉤子在 CLI 層執行，並注入純文字搜尋結果。沒有 IPC 開銷，也沒有工具呼叫代幣成本。MCP 工具定義帶來的上下文視窗臃腫現象完全消失。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>對於自動 top-3 還不夠的情況，我們也建立了三層漸進式擷取。這三個層級都是 CLI 指令，而非 MCP 工具。</p>
<ul>
<li><p><strong>L1 (自動)：</strong>每次提示都會返回前三名的語意搜尋結果，並提供<code translate="no">chunk_hash</code> 和 200 個字元的預覽。這涵蓋了大部分的日常使用。</p></li>
<li><p><strong>L2 (隨選)：</strong>當需要完整的上下文時，<code translate="no">memsearch expand &lt;chunk_hash&gt;</code> 會傳回完整的 Markdown 章節以及元資料。</p></li>
<li><p><strong>L3 (深入)：</strong>當需要原始對話時，<code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> 從 Claude Code 取得原始 JSONL 記錄。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3.會話摘要以接近零的成本在背景中產生</h3><p>擷取涵蓋記憶體的使用方式。但記憶體必須先寫入。所有這些 Markdown 檔案是如何產生的？</p>
<p>ccplugin 透過背景管道來產生它們，該管道以異步方式執行，幾乎不花費任何成本。每次您停止 Claude 回應時，<code translate="no">Stop</code> 鉤子就會啟動：它會解析對話記錄，呼叫 Claude Haiku (<code translate="no">claude -p --model haiku</code>) 來產生摘要，並將摘要附加到當天的 Markdown 檔案。Haiku API 調用非常便宜，每次調用幾乎可以忽略不计。</p>
<p>之後，觀察程序會偵測檔案變更，並自動將新內容編入 Milvus 索引，以便立即檢索。整個流程在背景中執行，不會中斷您的工作，而且成本可控。</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">使用 Claude Code 快速啟動 memsearch 外掛程式<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">首先，從 Claude Code 外掛程式市場安裝：</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">其次，重新啟動 Claude Code。</h3><p>外掛程式會自動初始化其設定。</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">第三，在對話之後，檢查當天的記憶體檔案：</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">第四，享受。</h3><p>下次 Claude Code 啟動時，系統會自動檢索並注入相關記憶。不需要額外的步驟。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們回到最初的問題：如何賦予 AI 持續記憶體？ claude-mem 和 memsearch ccplugin 採取了不同的方法，各有優點。我們總結了一份快速選擇指南：</p>
<table>
<thead>
<tr><th>類別</th><th>記憶體搜尋</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>架構</td><td>4 個 shell 鉤子 + 1 個監視程序</td><td>Node.js Worker + Express + React UI</td></tr>
<tr><td>整合方式</td><td>原生掛鉤 + CLI</td><td>MCP 伺服器 (stdio)</td></tr>
<tr><td>召回</td><td>自動 (鉤子注入)</td><td>代理驅動 (需要調用工具)</td></tr>
<tr><td>內容消耗</td><td>零（僅注入結果文字）</td><td>MCP 工具定義持續存在</td></tr>
<tr><td>會話摘要</td><td>一次異步 Haiku CLI 呼叫</td><td>多次 API 呼叫 + 觀察壓縮</td></tr>
<tr><td>儲存格式</td><td>純 Markdown 檔案</td><td>SQLite + Chroma 嵌入</td></tr>
<tr><td>資料遷移</td><td>純 Markdown 檔案</td><td>SQLite + Chroma 嵌入</td></tr>
<tr><td>遷移方法</td><td>複製 .md 檔案</td><td>從資料庫匯出</td></tr>
<tr><td>運行時間</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCP 運行時</td></tr>
</tbody>
</table>
<p>claude-mem 提供更豐富的功能、精緻的使用者介面以及更細緻的控制。對於需要協同合作、網路可視化或詳細記憶體管理的團隊來說，這是一個強大的選擇。</p>
<p>memsearch ccplugin 提供極簡的設計、零上下文視窗開銷以及完全透明的儲存。對於需要輕量級記憶體層而不需要額外複雜性的工程師來說，它是更適合的選擇。哪一個更好，取決於您的需求。</p>
<p>想要深入瞭解或獲得使用 memsearch 或 Milvus 建置的協助嗎？</p>
<ul>
<li><p>加入<a href="https://milvus.io/slack">Milvus Slack 社群</a>，與其他開發人員聯繫，分享您的建置成果。</p></li>
<li><p>預約我們的<a href="https://milvus.io/office-hours">Milvus 辦公時間，獲得</a>即時問答和團隊的直接支援。</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">資源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>memsearch ccplugin 文件</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">: https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>memsearch 專案:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>部落格：<a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我們提取了 OpenClaw 的記憶體系統並將其開源 (memsearch)</a></p></li>
<li><p>部落格：<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw 是什麼？開放原始碼 AI 代理的完整指南 - OpenClaw</a></p></li>
<li><p>部落格：<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 教學：連接至 Slack 的本地 AI 助理</a></p></li>
</ul>
