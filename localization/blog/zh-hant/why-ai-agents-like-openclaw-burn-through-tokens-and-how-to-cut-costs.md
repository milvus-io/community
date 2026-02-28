---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: 為何 OpenClaw 等人工智慧代理會燒完代用幣，以及如何降低成本
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  OpenClaw 和其他 AI 代理的代幣帳單為何會激增，以及如何使用 BM25 + 向量檢索 (index1, QMD, Milvus) 和
  Markdown-first 記憶 (memsearch) 來解決這個問題。
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<custom-h1>為什麼 OpenClaw 等 AI 代理會燒完代用幣，以及如何降低成本</custom-h1><p>如果您曾使用過<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a>(前身為 Clawdbot 和 Moltbot)，您就已經知道這個 AI Agent 有多棒了。它快速、本地、靈活，而且能夠在 Slack、Discord、您的程式碼庫，以及任何您可以連結到的地方，完成令人驚訝的複雜工作流程。但是當您開始認真使用它時，有一種模式很快就會出現：<strong>您的代用幣使用量開始攀升。</strong></p>
<p>這並不是 OpenClaw 的錯，而是當今大多數 AI 代理的行為模式。它們幾乎每件事都會觸發 LLM 呼叫：尋找檔案、規劃任務、寫筆記、執行工具或提出後續問題。因為代幣是這些呼叫的通用貨幣，所以每個動作都有成本。</p>
<p>為了瞭解成本的來源，我們需要看看兩個主要的貢獻者：</p>
<ul>
<li><strong>搜尋：</strong>建構不當的搜尋會拉入大量的上下文有效負載 - 整個檔案、日誌、訊息和程式碼區域，而這些都是模型實際上不需要的。</li>
<li><strong>記憶體：</strong>儲存不重要的資訊會迫使代理程式在未來的呼叫中重讀並重新處理這些資訊，久而久之會增加代幣的使用量。</li>
</ul>
<p>這兩個問題都會默默增加作業成本，卻無法提升能力。</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">OpenClaw 等人工智能代理程式實際上是如何執行搜尋的 - 以及為何會消耗代幣<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>當代理需要您的程式碼庫或文件庫中的資訊時，它通常會執行相當於整個專案的<strong>Ctrl+F</strong>。每一行匹配的資料都會被傳回 - 未排序、未篩選、未優先。Claude Code 是透過一個建構在 ripgrep 上的 Grep 工具來實現這個功能。OpenClaw 並沒有內建的程式碼庫搜尋工具，但它的執行工具可以讓底層模型執行任何指令，而且載入的技能可以引導代理程式使用 rg 等工具。在這兩種情況下，程式碼庫搜尋都會傳回未經排序和篩選的關鍵字匹配結果。</p>
<p>這種粗暴的方式在小型專案中運作良好。但隨著資源庫的增加，代價也會隨之增加。不相關的匹配結果會堆積在 LLM 的上下文視窗中，迫使模型讀取和處理數以千計實際上不需要的符記。單一的非範圍搜尋可能會拖入完整的檔案、巨大的註解區塊，或是共享關鍵字但不共享基本意圖的記錄。在長時間的除錯或研究階段中重複這種模式，臃腫的情況就會迅速增加。</p>
<p>OpenClaw 與 Claude Code 都嘗試管理這種增長。OpenClaw 會刪除過大的工具輸出，並壓縮冗長的會話歷史，而 Claude Code 則會限制檔案讀取輸出，並支援上下文壓縮。這些緩解措施都奏效了，但都是在臃腫的查詢已經執行之後。未排序的搜尋結果仍會消耗代幣，而您仍需為它們付費。情境管理幫助的是未來的轉彎，而不是產生浪費的原始呼叫。</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">AI 代理記憶體如何運作，以及為什麼也會消耗代幣<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>搜尋並不是代幣開銷的唯一來源。代理程式從記憶體中召回的每一段上下文也必須載入 LLM 的上下文視窗，這也需要消耗代幣。</p>
<p>目前大多數代碼所依賴的 LLM API 都是無狀態的：Anthropic 的訊息 API 每次要求都需要完整的對話歷史，OpenAI 的聊天完成 API 也是如此。即使是 OpenAI 較新的有狀態回應 API（可在伺服器端管理對話狀態），每次呼叫時仍需要完整的上下文視窗。無論記憶體是如何載入上下文的，都會消耗代幣。</p>
<p>為了解決這個問題，代理程式框架會將筆記寫入磁碟上的檔案，並在代理程式需要時將相關筆記載入上下文視窗。舉例來說，OpenClaw 將整理好的筆記儲存在 MEMORY.md 中，並將每日記錄附加到有時間戳記的 Markdown 檔案中，然後以混合 BM25 與向量搜尋為其編制索引，讓代理程式可以依需求調用相關的上下文。</p>
<p>OpenClaw 的記憶體設計運作良好，但它需要完整的 OpenClaw 生態系統：Gateway 程序、訊息平台連線，以及堆疊的其他部分。Claude Code 的記憶體也是如此，它與 CLI 相連。如果您要在這些平台之外建立自訂的代理程式，就需要獨立的解決方案。下一節將介紹解決這兩個問題的工具。</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">如何阻止 OpenClaw 消耗代幣<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您想減少OpenClaw消耗的代幣數量，您可以使用兩種方法。</p>
<ul>
<li>第一個是<strong>更好的擷取</strong>- 以排名、相關性驅動的搜尋工具取代 grep 式的關鍵字轉儲，讓模型只看到真正重要的資訊。</li>
<li>第二是<strong>更好的記憶體</strong>- 從不透明、依賴框架的儲存轉換為您可以瞭解、檢查和控制的東西。</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">以更好的檢索取代 grep：index1、QMD 和 Milvus</h3><p>許多 AI 編碼代理程式使用 grep 或 ripgrep 搜尋程式碼庫。Claude Code 有一個建立在 ripgrep 上的專用 Grep 工具。OpenClaw 沒有內建程式碼庫搜尋工具，但它的執行工具可以讓底層模型執行任何指令，而且可以載入 ripgrep 或 QMD 等技能來引導代理程式如何搜尋。如果沒有以檢索為重點的技能，代理程式就會依賴底層模型選擇的任何方法。不同代理的核心問題是相同的：如果沒有排序檢索，關鍵字匹配就會不加篩選地進入上下文視窗。</p>
<p>如果專案夠小，每個匹配都能輕鬆適應上下文視窗，這個方法就能運作。當程式碼庫或文件庫成長到一個關鍵字會返回數十或數百個搜尋結果，而代理程式必須將所有搜尋結果載入提示時，問題就開始了。在這種規模下，您需要的是依相關性排序的結果，而不只是依匹配度過濾的結果。</p>
<p>標準的解決方案是混合搜尋，它結合了兩種互補的排序方法：</p>
<ul>
<li>BM25 依據詞彙在特定文件中出現的頻率與唯一性，為每個結果評分。一個提到「驗證」15 次的專注文件，會比只提到一次的龐大文件排名更高。</li>
<li>向量搜尋將文字轉換為意義的數字表示，因此即使「驗證」與「登入流程」或「會話管理」沒有共通的關鍵字，也能匹配。</li>
</ul>
<p>單靠這兩種方法都不夠：BM25 會遺漏轉述的詞彙，而向量搜尋則會遺漏確切的詞彙，例如錯誤代碼。結合這兩種方法，並透過融合演算法合併排序清單，就能彌補這兩方面的不足。</p>
<p>以下工具以不同規模實現此模式。index1、QMD 和 Milvus 各自增加了混合搜尋的容量。</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1：單機快速混合搜尋</h4><p><a href="https://github.com/gladego/index1">index1</a>是一個 CLI 工具，可將混合搜尋打包成單一的 SQLite 資料庫檔案。FTS5 處理 BM25，sqlite-vec 處理向量相似性，而 RRF 則融合排序清單。嵌入是由 Ollama 在本機產生，因此沒有任何東西會離開您的機器。</p>
<p>index1 依據結構而非行數來分割程式碼：Markdown 檔案以標題分割，Python 檔案以 AST 分割，JavaScript 與 TypeScript 則以 regex 模式分割。這表示搜尋結果會傳回連貫的單位，例如完整的函式或完整的文件區段，而不是中斷的任意行範圍。混合查詢的回應時間為 40 到 180 毫秒。如果沒有 Ollama，它會回落到 BM25-only，這仍會對結果進行排序，而不是將每個匹配的結果傾倒到上下文視窗中。</p>
<p>index1 也包含一個事件記憶模組，用來儲存經驗教訓、錯誤根源和架構決策。這些記憶體與程式碼索引位於相同的 SQLite 資料庫內，而非獨立的檔案。</p>
<p>注意：index1 是一個早期階段的專案 (0 stars, 4 commits as of February 2026)。在提交之前，請針對您自己的程式碼庫進行評估。</p>
<ul>
<li><strong>最適合</strong>：獨立開發人員或小型團隊，其程式碼庫可容納在一台機器上，並尋求比 grep 更快速的改進。</li>
<li><strong>當您</strong>需要多位使用者存取相同的索引，或您的資料超過單一 SQLite 檔案可輕鬆處理的範圍<strong>時</strong>，就需要超越<strong>它</strong>。</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD：透過本機 LLM 重新排序提高精確度</h4><p>由 Shopify 創辦人 Tobi Lütke 建立的<a href="https://github.com/tobi/qmd">QMD</a>(Query Markup Documents) 增加了第三個階段：LLM 重新排序。在 BM25 和向量搜尋各自返回候選結果後，本地語言模型會重新讀取頂端結果，並依據與您查詢的實際相關度重新排序。這樣就能捕捉到關鍵字和語意匹配都返回可信但錯誤結果的情況。</p>
<p>QMD 完全在您的機器上運行，使用三個 GGUF 模型，總計約 2 GB：一個嵌入模型 (embeddinggemma-300M)、一個交叉編碼器重排器 (Qwen3-Reranker-0.6B) 和一個查詢擴展模型 (qmd-query-expansion-1.7B)。首次執行時，三者皆會自動下載。不需要呼叫雲端 API，也不需要 API 金鑰。</p>
<p>取捨是冷啟動時間：從磁碟載入三個模型大約需要 15 到 16 秒。QMD 支援持久性伺服器模式 (qmd mcp)，可在多次要求之間將模型保留在記憶體中，消除重複查詢的冷啟動罰則。</p>
<ul>
<li><strong>最適合用於：</strong>對隱私極為重要的環境，在這種環境中，任何資料都不能離開您的機器，而且檢索精確度比回應時間更重要。</li>
<li><strong>當您</strong>需要次秒級回應、共享團隊存取，或資料集超出單機容量時，請汰換<strong>它</strong>。</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus：團隊與企業規模的混合式搜尋</h4><p>上述的單機工具對於個別開發人員來說非常好用，但是當多人或代理需要存取相同的知識庫時，這些工具就會受到限制。<a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a>是專為下一個階段所打造的開放原始碼向量資料庫：分散式、多使用者，並能處理數十億個向量。</p>
<p>此使用個案的關鍵功能是內建 Sparse-BM25，自 Milvus 2.5 起即已提供，並在 2.6 中大幅提升速度。您提供原始文字，Milvus 會使用建立在 tantivy 上的分析器在內部將文字標記化，然後將結果轉換為預先計算好的稀疏向量，並在索引時儲存起來。</p>
<p>由於 BM25 表示法已經儲存，因此檢索時不需要重新計算分數。這些稀疏向量與密集向量（語義嵌入）並存於同一個 Collection 中。在查詢時，您可以使用 Milvus 開箱即用的排序器 (例如 RRFRanker) 來融合這兩種訊號。與 index1 和 QMD 相同的混合搜尋模式，但運行在可水平擴充的基礎架構上。</p>
<p>Milvus 也提供單機工具無法提供的功能：多租戶隔離（每個團隊獨立的資料庫或集合）、具備自動故障移轉功能的資料複製，以及具成本效益儲存的冷熱資料分層。對於代理而言，這表示多個開發人員或多個代理實體可以同時查詢相同的知識庫，而不會踩到彼此的資料。</p>
<ul>
<li><strong>最適合</strong>：共享知識庫的多個開發人員或代理、大型或快速成長的文件集，或需要複製、故障移轉和存取控制的生產環境。</li>
</ul>
<p>總結一下：</p>
<table>
<thead>
<tr><th>工具</th><th>階段</th><th>部署</th><th>遷移信號</th></tr>
</thead>
<tbody>
<tr><td>克勞德原生 Grep</td><td>原型開發</td><td>內建、零設定</td><td>帳單攀升或查詢速度變慢</td></tr>
<tr><td>索引1</td><td>單機 (速度)</td><td>本機 SQLite + Ollama</td><td>需要多使用者存取或資料超出一台機器的範圍</td></tr>
<tr><td>QMD</td><td>單機 (精確度)</td><td>三個本機 GGUF 模型</td><td>需要團隊共享索引</td></tr>
<tr><td>Milvus</td><td>團隊或生產</td><td>分散式群集</td><td>大型文件集或多租戶需求</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">使用 memsearch 賦予人工智慧代理程式持久、可編輯的記憶體，以降低人工智慧代理程式代幣成本</h3><p>搜尋最佳化可減少每次查詢的代幣浪費，但對於代理程式在各個階段之間保留的內容卻沒有幫助。</p>
<p>代理從記憶體中召回的每一段上下文都必須載入提示，這也會消耗代幣。問題不在於是否要儲存記憶體，而是如何儲存。儲存方式決定了您是否可以看到代理程式所記憶的內容、在記憶出錯時修復它，以及在您切換工具時將它帶走。</p>
<p>大多數架構在這三點上都失敗了。Mem0 和 Zep 將所有東西都儲存在向量資料庫中，這對於擷取很有效，但卻讓記憶體：</p>
<ul>
<li><strong>不透明。</strong>如果不查詢 API，您就無法看到代理所記憶的內容。</li>
<li><strong>難以編輯。</strong>修正或移除記憶體需要呼叫 API，而不是開啟檔案。</li>
<li><strong>鎖定。</strong>轉換框架意味著匯出、轉換、再匯出您的資料。</li>
</ul>
<p>OpenClaw 採用不同的方法。所有的記憶體都存放在磁碟上的 Markdown 檔案中。代理程式會自動寫入每日日誌，而人類可以直接開啟和編輯任何記憶體檔案。這解決了所有三個問題：記憶體在設計上是可讀、可編輯和可移植的。</p>
<p>取捨是部署的開銷。運行 OpenClaw 的記憶體意味著運行整個 OpenClaw 生態系統：Gateway 程序、訊息平台連線以及堆疊的其他部分。對於已經使用 OpenClaw 的團隊來說，這是沒問題的。<strong>memsearch</strong>的建立就是為了縮短這個差距：它將 OpenClaw 的 Markdown-first 記憶模式萃取成獨立的函式庫，可與任何代理程式搭配使用。</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearch</a></strong> 由 Zilliz (Milvus 背後的團隊) 所建立，將 Markdown 檔案視為唯一的真相來源。一個 MEMORY.md 存放了您手寫的長期事實和決策。每日日誌 (2026-02-26.md) 則由會話摘要自動產生。存放在 Milvus 中的向量索引是一個衍生層，可以隨時從 Markdown 重建。</p>
<p>實際上，這表示您可以在文字編輯器中開啟任何記憶體檔案，讀取代理所知道的精確內容，並加以變更。儲存檔案後，memsearch 的檔案監視器就會偵測到變更，並自動重新索引。您可以使用 Git 管理記憶體，透過 pull request 檢閱 AI 產生的記憶體，或透過複製資料夾移到新的機器上。如果 Milvus 索引丟失，您可以從檔案重建索引。檔案永遠不會有任何風險。</p>
<p>在引擎蓋下，memsearch 使用上述相同的混合搜尋模式：以標題結構和段落邊界分割的 chunks、BM25 + 向量檢索，以及當日誌變大時可總結舊記憶體的 LLM Powered compact 指令。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最適合：想要完全瞭解代理程式所記憶的內容、需要對記憶體進行版本控制，或想要一個不鎖定於任何單一代理程式框架的記憶體系統的團隊。</p>
<p>總結一下：</p>
<table>
<thead>
<tr><th>能力</th><th>Mem0 / Zep</th><th>記憶體搜尋</th></tr>
</thead>
<tbody>
<tr><td>資料來源</td><td>向量資料庫（唯一資料來源）</td><td>Markdown 檔案 (主要) + Milvus (索引)</td></tr>
<tr><td>透明度</td><td>黑盒，需要 API 檢查</td><td>開啟任何 .md 檔案讀取</td></tr>
<tr><td>可編輯性</td><td>透過 API 來修改</td><td>直接在任何文字編輯器中編輯，自動重新索引</td></tr>
<tr><td>版本控制</td><td>需要獨立的稽核記錄</td><td>Git 原生可用</td></tr>
<tr><td>遷移成本</td><td>匯出 → 轉換格式 → 重新匯入</td><td>複製 Markdown 資料夾</td></tr>
<tr><td>人類與 AI 協作</td><td>AI 撰寫，人類觀察</td><td>人類可以編輯、補充和審閱</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">哪種設定適合您的規模<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>場景</th><th>搜尋</th><th>記憶體</th><th>何時繼續</th></tr>
</thead>
<tbody>
<tr><td>早期原型</td><td>Grep (內建)</td><td>-</td><td>帳單攀升或查詢速度減慢</td></tr>
<tr><td>單一開發人員，僅搜尋</td><td><a href="https://github.com/gladego/index1">index1</a>(速度) 或<a href="https://github.com/tobi/qmd">QMD</a>(精確度)</td><td>-</td><td>需要多使用者存取或資料超出一台機器的使用範圍</td></tr>
<tr><td>單一開發人員，同時使用</td><td><a href="https://github.com/gladego/index1">索引 1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>需要多位使用者存取或資料超出一台機器的範圍</td></tr>
<tr><td>團隊或生產，兩者皆是</td><td><a href="https://github.com/milvus-io/milvus">虛擬化</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>快速整合，僅用記憶體</td><td>-</td><td>Mem0 或 Zep</td><td>需要檢查、編輯或遷移記憶體</td></tr>
</tbody>
</table>
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
    </button></h2><p>永遠在線的 AI 代理所帶來的代幣成本並非不可避免。本指南涵蓋了兩個領域，使用更好的工具可以減少浪費：搜尋和記憶體。</p>
<p><a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a>和<a href="https://github.com/tobi/qmd"></a> QMD 透過結合 BM25 關鍵字評分與向量搜尋，並只傳回最相關的結果，可以在單一機器上解決這個問題。對於團隊、多機構設定或生產工作負載，<a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a>在可水平擴充的基礎架構上提供相同的混合搜尋模式。</p>
<p>對於記憶體，大多數架構都會將所有東西儲存在向量資料庫中：不透明、很難手動編輯，而且<a href="https://github.com/zilliztech/memsearch">鎖定</a>在建立記憶體的架構中。記憶體存放在純 Markdown 檔案中，您可以讀取、編輯，並使用 Git 進行版本控制。Milvus 是一個衍生索引，可以隨時從這些檔案中重建。您可以隨時控制代理程式所知道的內容。</p>
<p><a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a>和<a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus</a>都是開放原始碼。我們正積極開發 memsearch，並歡迎在生產中運行它的任何人提供回饋。請開啟問題、提交 PR，或直接告訴我們哪些有用、哪些無用。</p>
<p>本指南中提及的專案：</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>：適用於 AI 代理的 Markdown-first 記憶體，由 Milvus 支援。</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: 可擴充混合搜尋的開放原始碼向量資料庫。</li>
<li><a href="https://github.com/gladego/index1">index1</a>：用於 AI 編碼代理的 BM25 + 向量混合搜尋。</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: Local hybrid search with LLM re-ranking。</li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">繼續閱讀<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我們擷取 OpenClaw 的記憶體系統並將其開源 (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude 程式碼的持久記憶體：memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw 是什麼？開源 AI 代理完整指南</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 教學：連接至 Slack 的本地 AI 助理</a></li>
</ul>
