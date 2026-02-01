---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: 現在像 Claude Cowork 這種長期經營的代理商正在崛起，RAG 是否已經過時？
author: Min Yin
date: 2026-1-27
desc: 深入分析 Claude Cowork 的長期記憶體、可寫代理記憶體、RAG 權衡，以及為什麼向量資料庫仍然重要。
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">Claude Cowork</a>是 Claude Desktop 應用程式的新代理功能。從開發人員的觀點來看，它基本上是包覆在模型上的自動化任務執行器：它可以讀取、修改和產生本機檔案，並且可以規劃多步驟任務，而不需要您手動提示每一步驟。把它想像成 Claude Code 背後的相同循環，不過是暴露在桌面上，而不是終端機。</p>
<p>Cowork 的關鍵能力在於它能長時間執行而不會失去狀態。它不會遇到一般的對話超時或上下文重設。它可以持續工作、追蹤中間結果，並在不同的會話中重複使用先前的資訊。這給人一種「長期記憶」的感覺，儘管其基本機制更像是持久的任務狀態 + 上下文攜帶。無論如何，這種體驗都有別於傳統的聊天模式，除非您建立自己的記憶層，否則一切都會重設。</p>
<p>這帶給開發人員兩個實際的問題：</p>
<ol>
<li><p><strong>如果模型已經可以記住過去的資訊，那麼 RAG 或代理的 RAG 還能在哪裡適應？RAG 會被取代嗎？</strong></p></li>
<li><p><strong>如果我們想要一個本地的、Cowork 式的代理，我們該如何自己實作長期記憶？</strong></p></li>
</ol>
<p>本文其餘部分將詳細討論這些問題，並解釋向量資料庫如何融入這個新的「模型記憶」格局。</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork vs. RAG：區別在哪裡？<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>正如我之前提到的，Claude Cowork 是 Claude Desktop 內的一個代理模式，它可以讀寫本機檔案、將任務分割成較小的步驟，並且在不遺失狀態的情況下持續工作。它能維持自己的工作情境，因此多個小時的任務不會像一般聊天會話一樣重設。</p>
<p><strong>RAG</strong>(Retrieval-Augmented Generation) 解決了一個不同的問題：讓模型存取外部知識。您將您的資料索引到向量資料庫中，為每個查詢擷取相關的區塊，並將它們饋送至模型中。它之所以被廣泛使用，是因為它為 LLM 應用程式提供了一種「長期記憶」的形式，可以記錄文件、日誌、產品資料等。</p>
<p>如果這兩個系統都能幫助模型「記得」，那麼實際上有什麼不同呢？</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">Cowork 如何處理記憶體</h3><p>Cowork 的記憶體是讀寫式的。代理會決定當前任務或對話中哪些資訊是相關的，並將其儲存為記憶項目，之後再隨著任務的進展擷取這些資訊。這讓 Cowork 可以在長時間運作的工作流程中維持連續性，尤其是那些會隨著進度產生新的中間狀態的工作流程。</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">RAG 和 Agentic RAG 如何處理記憶體</h3><p>標準的 RAG 是查詢驅動式的檢索：使用者提出問題，系統取得相關的文件，然後模型使用這些文件來回答。擷取的語料保持穩定和版本化，而且開發人員可以準確控制進入語料庫的內容。</p>
<p>現代的代理 RAG 延伸了這個模式。模型可以決定何時擷取資訊、擷取什麼資訊，以及在規劃或執行工作流程時如何使用這些資訊。這些系統可以執行長時間的任務並呼叫工具，類似於 Cowork。但即使是代理式 RAG，檢索層仍是以知識為導向，而非以狀態為導向。代理程式擷取的是權威性的事實；它並沒有將演進中的任務狀態寫回語料庫中。</p>
<p>從另一個角度來看：</p>
<ul>
<li><p><strong>Cowork 的記憶體是由任務驅動的：</strong>代理程式會寫入並讀取其演進中的狀態。</p></li>
<li><p><strong>RAG 則是知識驅動：</strong>系統檢索模型應該依賴的既定資訊。</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">逆向工程 Claude Cowork：它如何建立長時間運作的代理程式記憶體<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Cowork 被炒得沸沸揚揚，因為它能處理多步驟的任務，而且不會經常忘記當初在做什麼。從開發者的角度來看，我很好奇<strong>它是如何在如此長的階段中保持狀態的？</strong>Anthropic 並未公佈其內部結構，但根據 Claude 記憶模組的早期開發實驗，我們可以拼湊出一個像樣的心智模型。</p>
<p>Claude 似乎依賴一種混合設定：<strong>一個持續的長期記憶層加上按需檢索工具。</strong>Claude 並沒有將完整的對話內容塞入每個請求中，而是只在它認為相關時，才選擇性地拉入過去的情境。這可讓模型保持高準確度，而不致於每次都要花費大量代幣。</p>
<p>如果您將請求結構拆解開來，它大致上是這樣的：</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>有趣的行為並不是結構本身，而是模型如何決定更新內容以及何時執行擷取。</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">使用者記憶體：持久層</h3><p>Claude 保留了一個長期記憶庫，並隨時間更新。與 ChatGPT 更可預測的記憶體系統不同，Claude 的記憶體系統感覺更有 「生命力」。Claude 將記憶儲存在類似 XML 的區塊中，並透過兩種方式進行更新：</p>
<ul>
<li><p><strong>隱含更新：</strong>有時候，模型只是判斷某些東西是穩定的偏好或事實，然後靜靜地寫入記憶體。這些更新不是即時的，它們會在幾個回合之後顯示出來，而且如果相關的對話消失了，較舊的記憶體也會逐漸消失。</p></li>
<li><p><strong>明確更新：</strong>使用者可以使用<code translate="no">memory_user_edits</code> 工具直接修改記憶 (「記得 X」、「忘記 Y」)。這些寫入是立即的，行為上更像是 CRUD 操作。</p></li>
</ul>
<p>Claude 正在運行背景啟發式方法來決定什麼值得持久化，而不是等待明確的指示。</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">會話檢索：隨選部分</h3><p>Claude<em>不會</em>像許多 LLM 系統一樣保留滾動摘要。相反地，它有一個擷取函數的工具箱，只要它認為缺少上下文，就可以呼叫這個工具箱。這些檢索呼叫並非每次都會發生 - 模型會根據自己的內部判斷來觸發它們。</p>
<p>最突出的是<code translate="no">conversation_search</code> 。當使用者說「上個月的那個專案」這樣含糊不清的話，Claude 通常會啟動這個工具來挖掘相關的內容。值得注意的是，當語句模棱兩可或使用不同的語言時，它仍能運作。這很明顯地暗示了</p>
<ul>
<li><p>某種語意匹配 (嵌入)</p></li>
<li><p>可能結合規範化或輕量級翻譯</p></li>
<li><p>為了精確度而分層的關鍵字搜尋</p></li>
</ul>
<p>基本上，這看起來很像是在模型的工具集中捆綁了一個微型的 RAG 系統。</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">Claude 的檢索行為如何與基本歷史緩衝區不同</h3><p>從測試和日誌中，有幾個模式很突出：</p>
<ul>
<li><p><strong>擷取不是自動的。</strong>模型選擇何時呼叫它。如果它認為已經有足夠的上下文，它甚至不會去煩惱。</p></li>
<li><p><strong>擷取的區塊包括</strong> <strong>使用者與助理的訊息。</strong>這是很有用的 - 它比只有使用者的摘要能保留更多的細節。</p></li>
<li><p><strong>令牌使用保持正常。</strong>由於歷史記錄不是每次都會注入，因此長時間的會話不會出現不可預測的氣球。</p></li>
</ul>
<p>總體來說，它感覺像是一個檢索增強的 LLM，只是檢索是模型本身推理循環的一部分。</p>
<p>這個架構很聰明，但不是免費的：</p>
<ul>
<li><p>檢索增加了延遲和更多的「移動零件」（索引、排序、重新排序）。</p></li>
<li><p>模型偶爾會錯誤判斷它是否需要上下文，這表示您會看到典型的「LLM 遺忘症」，即使資料<em>是</em>可用的。</p></li>
<li><p>調試變得更棘手，因為模型行為取決於隱形的工具觸發，而不只是提示輸入。</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">Claude Cowork 與 Claude Codex 在處理長期記憶方面的對比</h3><p>相較於 Claude 重檢索的設定，ChatGPT 處理記憶體的方式更有條理、更可預測。ChatGPT 不會進行語意查詢，也不會把舊會話當成迷你向量倉，而是透過下列分層元件，直接將記憶注入每個會話：</p>
<ul>
<li><p>使用者記憶體</p></li>
<li><p>會話元資料</p></li>
<li><p>當前會話訊息</p></li>
</ul>
<p><strong>使用者記憶體</strong></p>
<p>使用者記憶體是主要的長期儲存層--跨會話持續存在並可由使用者編輯的部分。它儲存了相當標準的東西：名稱、背景、正在進行的專案、學習偏好等等。每個新的對話都會在一開始就注入這個區塊，因此模型總是以一致的使用者觀點開始。</p>
<p>ChatGPT 以兩種方式更新這一層：</p>
<ul>
<li><p><strong>明確更新：</strong>使用者可以告訴模型「記住這個」或「忘記那個」，記憶體就會立即改變。這基本上是模型透過自然語言揭露的 CRUD API。</p></li>
<li><p><strong>隱含更新：</strong>如果模型發現符合 OpenAI 長期記憶規則的資訊，例如工作職稱或偏好，而使用者並未停用記憶功能，它就會自行悄悄地新增這些資訊。</p></li>
</ul>
<p>從開發人員的角度來看，這一層是簡單、確定且容易推理的。不需要嵌入查詢，也不需要啟發式的擷取方式。</p>
<p><strong>會話元資料</strong></p>
<p>Session Metadata 處於光譜的另一端。它是短暫的、非持久性的，而且只會在會話開始時注入一次。將其視為會話的環境變數。這包括以下項目</p>
<ul>
<li><p>您所在的裝置</p></li>
<li><p>帳戶/訂閱狀態</p></li>
<li><p>粗略的使用模式（活動天數、模型分佈、平均對話長度）</p></li>
</ul>
<p>此元資料可協助模型針對目前環境塑造回應，例如，在行動裝置上撰寫較短的答案，而不會污染長期記憶。</p>
<p><strong>目前會話訊息</strong></p>
<p>這是標準的滑動視窗歷史：目前會話中的所有訊息，直到達到代幣限制為止。當視窗變得太大時，較舊的內容會自動刪除。</p>
<p>最重要的是，這種驅逐<strong>不會</strong>觸及使用者記憶體或跨會話摘要。只有本機會話歷史會縮小。</p>
<p>ChatGPT 與 Claude 最大的差異在於如何處理「最近但非目前」的會談。如果 Claude 認為過去的內容是相關的，它會呼叫搜尋工具來擷取。ChatGPT 不會這麼做。</p>
<p>相反地，ChatGPT 會保留一個非常輕量級的<strong>跨會話摘要</strong>，並注入到每次對話中。關於這一層的幾個關鍵細節：</p>
<ul>
<li><p>它<strong>只會</strong>總結<strong>使用者訊息</strong>，不會總結助理訊息。</p></li>
<li><p>它儲存的項目非常少，大約只有 15 個，足以捕捉穩定的主題或興趣。</p></li>
<li><p>它<strong>不</strong>進行<strong>嵌入計算、類似度排序，也不呼叫檢索</strong>。它基本上是預先咀嚼的上下文，而不是動態查詢。</p></li>
</ul>
<p>從工程的角度來看，這種方法以靈活性換取可預測性。這樣就不會發生奇怪的擷取失敗，推論的延遲也會保持穩定，因為沒有任何東西是在飛行中擷取的。缺點是，除非 ChatGPT 將六個月前的訊息寫入摘要層，否則它不會隨機讀取這些訊息。</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">讓代理程式記憶體可寫的挑戰<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>當代理程式從<strong>唯讀記憶體</strong>（典型的 RAG）轉移到<strong>可寫</strong>記<strong>憶</strong>體時（可記錄使用者的動作、決定和偏好），複雜度就會快速增加。您不再只是檢索文件；您還要維護模型所依賴的成長狀態。</p>
<p>可寫記憶體系統必須解決三個真正的問題：</p>
<ol>
<li><p><strong>記住什麼：</strong>代理需要規則來決定哪些事件、偏好或觀察值得保留。如果不這樣做，記憶體的大小就會爆炸，或是充滿雜訊。</p></li>
<li><p><strong>如何儲存與分層記憶體：</strong>並非所有的記憶都是一樣的。近期項目、長期事實和短暫筆記都需要不同的儲存層、保留政策和索引策略。</p></li>
<li><p><strong>如何在不破壞檢索的情況下快速寫入：</strong>記憶體必須持續寫入，但如果系統不是為高吞吐量插入而設計，頻繁更新可能會降低索引品質或減慢查詢速度。</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">挑戰 1：什麼值得記住？</h3><p>並非使用者所做的每件事都應該最終留在長期記憶體中。如果有人建立了臨時檔案，並在五分鐘後刪除，那麼永遠記錄下來對任何人都沒有幫助。這就是核心難題：<strong>系統如何判斷什麼才是真正重要的？</strong></p>
<p><strong>(1) 判斷重要性的常見方法</strong></p>
<p>團隊通常會依賴混合的啟發式方法：</p>
<ul>
<li><p><strong>以時間為基礎</strong>：最近的動作比舊的動作重要</p></li>
<li><p><strong>基於頻率</strong>：重複存取的檔案或動作較為重要</p></li>
<li><p><strong>基於類型</strong>：某些物件本質上比較重要 (例如專案組態檔案與快取檔案)</p></li>
</ul>
<p><strong>(2) 當規則衝突時</strong></p>
<p>這些訊號經常會發生衝突。上星期建立的檔案，今天卻被大量編輯，應該以年齡還是活動為優先？沒有單一「正確」的答案，這就是重要性評分會迅速變得混亂的原因。</p>
<p><strong>(3) 向量資料庫如何提供協助</strong></p>
<p>向量資料庫提供您執行重要性規則的機制，而不需要手動清理：</p>
<ul>
<li><p><strong>TTL：</strong>Milvus 可以在設定時間後自動移除資料</p></li>
<li><p><strong>衰減：</strong>可以降低較舊向量的權重，讓它們自然地從檢索中消失。</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">挑戰二：實際中的記憶體分層</h3><p>隨著代理運行的時間越來越長，記憶體也越堆越高。將所有記憶體保留在快速儲存區是無法持續的，因此系統需要一種方法將記憶體分成<strong>熱</strong>（經常存取）和<strong>冷</strong>（很少存取）兩層。</p>
<p><strong>(1) 決定何時成為冷記憶體</strong></p>
<p>在此模型中，<em>熱記憶體</em>指的是保留在 RAM 中以進行低延遲存取的資料，而<em>冷記憶體</em>指的是移至磁碟或物件儲存以降低成本的資料。</p>
<p>決定何時記憶體變成冷記憶體可以用不同的方式處理。有些系統使用輕量級模型，根據動作或檔案的意義和最近的使用情況來估計其語意重要性。其他系統則依賴簡單、基於規則的邏輯，例如移動 30 天內未被存取或一週內未出現在檢索結果中的記憶體。使用者也可以明確地將某些檔案或作業標記為重要，以確保它們永遠保持熱狀態。</p>
<p><strong>(2) 冷熱記憶體的儲存位置</strong></p>
<p>一旦分類，熱記憶體和冷記憶體的儲存方式是不同的。熱記憶體保留在 RAM 中，用於經常存取的內容，例如作用中的工作上下文或最近的使用者動作。冷記憶體則會移至磁碟或物件儲存系統 (如 S3)，雖然存取速度較慢，但儲存成本卻低得多。由於冷記憶體很少被使用，而且通常只在長期參考時才會被存取，因此這種權衡方式運作良好。</p>
<p><strong>(3) 矢量資料庫如何提供協助</strong></p>
<p><strong>Milvus 和 Zilliz Cloud</strong>支援這種模式，在維持單一查詢介面的同時，啟用冷熱分層儲存，因此經常存取的向量會留在記憶體中，而較舊的資料則會自動移至成本較低的儲存空間。</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">挑戰三：記憶體的寫入速度應該有多快？</h3><p>傳統的 RAG 系統通常會分批寫入資料。索引會在離線狀態下重建 (通常是隔夜重建)，之後才能開始搜尋。這種方法適用於靜態知識庫，但不適合代理程式記憶體。</p>
<p><strong>(1) 代理程式記憶體需要即時寫入的原因</strong></p>
<p>代理程式記憶體必須在使用者動作發生時即刻捕捉它們。如果某個動作沒有被立即記錄下來，下一個會話回合可能會缺乏關鍵的情境。因此，可寫記憶體系統需要即時寫入，而不是延遲的離線更新。</p>
<p><strong>(2) 寫入速度與檢索品質之間的張力</strong></p>
<p>即時記憶體需要非常低的寫入延遲。同時，高品質的檢索取決於建立良好的索引，而索引的建立需要時間。每次寫入都要重建索引的成本太高，但延遲建立索引意味著新寫入的資料暫時無法檢索。這種權衡是可寫入記憶體設計的核心。</p>
<p><strong>(3) 矢量資料庫如何提供協助</strong></p>
<p>向量資料庫透過將寫入與索引解耦來解決這個問題。常見的解決方案是以流方式寫入，並執行增量索引建置。以<strong>Milvus</strong>為例，新資料會先寫入記憶體內的緩衝區，讓系統能有效率地處理高頻率的寫入。即使在完整索引建立之前，緩衝資料也能在幾秒鐘內透過動態合併或近似搜尋來查詢。</p>
<p>當緩衝記憶體達到預先定義的臨界值時，系統會分批建立索引並將其持久化。這可提高長期檢索效能，而不會阻礙即時寫入。Milvus 將快速的資料擷取與較慢的索引建置分開，在寫入速度與搜尋品質之間取得實際的平衡，對於代理程式記憶體來說非常有效。</p>
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
    </button></h2><p>Cowork 讓我們窺見了新的代理體類型--持久化、狀態化，並且能夠在長時間線上攜帶上下文。但它也讓我們了解到另一件事：長時間記憶只是其中的一半。要建立既自主又可靠的可投入生產的代理程式，我們仍然需要在龐大且不斷演進的知識庫上進行結構化檢索。</p>
<p>RAG 處理世界的事實；可寫記憶體處理代理程式的內部狀態。向量資料庫則處於兩者的交叉點，提供索引、混合搜尋與可擴充的儲存空間，讓兩層資料庫能夠共同運作。</p>
<p>隨著長時間運行的代理程式持續成熟，它們的架構很可能會向這種混合設計靠攏。Cowork 是一個強烈的訊號，顯示了事物的發展方向-不是走向沒有 RAG 的世界，而是走向擁有更豐富的記憶體堆疊，並由底下的向量資料庫提供動力的代理程式。</p>
<p>如果您想要探索這些想法，或是在您自己的設定上獲得協助，請<strong>加入我們的</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>，與 Milvus 工程師交談。如需更多實作指導，您可以<strong>預約</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours</strong></a> <strong>課程。</strong></p>
