---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: 為什麼 Clawdbot 會成為病毒 - 以及如何使用 LangGraph 和 Milvus 建立生產就緒的長期運行代理程式
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: Clawdbot 証明了人們希望人工智能能夠行動。了解如何使用雙機構架構、Milvus 和 LangGraph 建立可生產的長期運行代理。
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot (現更名為 OpenClaw) 在網路上掀起熱潮<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a>(現已更名為 OpenClaw) 上週在網際網路上掀起一股風潮。這個由 Peter Steinberger 打造的開放原始碼 AI 助手在短短幾天內就在<a href="https://github.com/openclaw/openclaw">GitHub</a>上獲得了<a href="https://github.com/openclaw/openclaw">110,000+ 顆星星</a>。用戶張貼了它自主檢查航班、管理電子郵件和控制智能家居設備的視頻。OpenAI 的創辦工程師 Andrej Karpathy 對它大加讚賞。Tech 創辦人兼投資人 David Sacks 在推特上對它大加讚賞。人們稱之為 「真實的 Jarvis」。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>接著是安全警告。</p>
<p>研究人員發現了數百個外露的管理面板。殭屍預設以 root 存取權限執行。沒有沙箱。提示注入漏洞可能會讓攻擊者劫持代理程式。安全噩夢。</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot 病毒式傳播的原因<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot 病毒式傳播是有原因的。</strong>它可在本機或您自己的伺服器上執行。它連接到人們已經在使用的訊息應用程式-WhatsApp、Slack、Telegram、iMessage。它能長時間記住上下文，而不是每次回覆後就忘記一切。它可以管理行事曆、總結電子郵件，並跨應用程式自動執行任務。</p>
<p>使用者會感覺到它是一個不需動手、永遠在線的個人 AI，而不只是一個提示與回應的工具。它的開放原始碼、自我託管模式吸引了想要控制和客製化的開發人員。此外，與現有工作流程整合的易用性，也讓它更容易分享與推薦。</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">建立長期運作代理程式的兩大挑戰<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot 的受歡迎程度證明人們需要的是能</strong> <em>行動</em><strong>的人工智能，</strong><strong>而不只是回答問題。</strong>但任何能長時間執行並完成實際任務的代理程式，無論是 Clawdbot 或是您自己建立的程式，都必須解決兩個技術難題：<strong>記憶體</strong>與<strong>驗證</strong>。</p>
<p><strong>記憶體問題</strong>有多種表現方式：</p>
<ul>
<li><p>代理程式會在任務中途耗盡上下文視窗，留下半成品</p></li>
<li><p>他們忽略了完整的任務清單並過早宣告「完成」。</p></li>
<li><p>他們無法在工作階段之間交接上下文，因此每個新的工作階段都要從頭開始</p></li>
</ul>
<p>所有這些問題都有相同的根源：代理程式沒有持久性記憶體。上下文視窗是有限的，跨會話檢索也是有限的，而且進度也不是以代理可以存取的方式來追蹤。</p>
<p><strong>驗證問題則</strong>不同。即使記憶體正常運作，代理程式仍會在快速的單元測試後，將任務標示為已完成，而不檢查該功能是否真的能端對端運作。</p>
<p>Clawdbot 可以解決這兩個問題。Clawdbot 可以解決這兩個問題，它可以在本機儲存跨會話的記憶體，並使用模組化的「技能」來自動化瀏覽器、檔案和外部服務。這個方法很有效。但它不適合生產。對於企業用途而言，您需要結構、可稽核性與安全性，而 Clawdbot 並無提供這些功能。</p>
<p>這篇文章涵蓋了生產就緒解決方案的相同問題。</p>
<p>在記憶體方面，我們使用以<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic 的研究</a>為基礎的<strong>雙機構架構</strong>：一個初始化代理將專案分割成可驗證的功能，另一個編碼代理則以乾淨的交接方式逐一處理專案。對於跨會話的語意回憶，我們使用<a href="https://milvus.io/">Milvus</a>，這是一個向量資料庫，可讓代理以意義（而非關鍵字）進行搜尋。</p>
<p>在驗證方面，我們使用<strong>瀏覽器自動化</strong>。代理程式不會信任單元測試，而是以真實使用者的方式測試功能。</p>
<p>我們將介紹這些概念，然後顯示使用<a href="https://github.com/langchain-ai/langgraph">LangGraph</a>和 Milvus 的工作實作。</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">雙代理架構如何防止上下文耗盡<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>每個 LLM 都有一個上下文視窗：限制它一次可以處理多少文字。當代理處理複雜的任務時，這個視窗就會被程式碼、錯誤訊息、會話歷程和文件填滿。一旦視窗填滿，代理程式就會停止或開始遺忘先前的上下文。對於長時間執行的任務，這是不可避免的。</p>
<p>考慮給代理一個簡單的提示「建立 claude.ai 的複製檔」。這個專案需要驗證、聊天介面、對話歷史、串流回應以及其他數十種功能。單一代理會嘗試一次解決所有問題。在實作聊天介面的中途，上下文視窗填滿了。會話結束時，程式碼只寫了一半，沒有任何文件說明嘗試了什麼，也沒有說明哪些有效哪些無效。下一個 session 繼承了一個爛攤子。即使有上下文壓縮，新的代理程式還是得猜測上一個階段在做什麼、調試它沒有寫的程式碼，並找出要繼續的地方。在取得任何新進展之前，就已經浪費了數小時。</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">雙重代理解決方案</h3><p>Anthropic 的解決方案在他們的工程文章<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">「Effective harnesses for long-running agents」</a>中描述<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">，</a>就是使用兩種不同的提示模式：第一個會話使用<strong>初始化提示</strong>，後續會話使用<strong>編碼提示</strong>。</p>
<p>技術上來說，這兩種模式使用相同的底層代理程式、系統提示、工具和線束。唯一的差別在於初始使用者提示。但由於它們的角色不同，將它們視為兩個獨立的代理是一個有用的心智模型。我們稱之為雙代理體架構。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>初始化器會設定增量進度的環境。</strong>它接受一個模糊的請求，並做三件事：</p>
<ul>
<li><p><strong>將專案分割為具體、可驗證的功能。</strong>不是模糊的需求，例如「製作一個聊天介面」，而是具體、可測試的步驟：「使用者點選新聊天按鈕 → 新對話出現在側邊欄 → 聊天區顯示歡迎狀態」。Anthropic 的 claude.ai 克隆範例有超過 200 個這樣的功能。</p></li>
<li><p><strong>建立進度追蹤檔案。</strong>此檔案記錄每個功能的完成狀態，因此任何階段都能看到已完成與剩餘的功能。</p></li>
<li><p><strong>撰寫設定腳本，並進行初始的 git commit。</strong> <code translate="no">init.sh</code> 之類的腳本可以讓未來的工作階段快速啟動開發環境。git 提交建立了一個乾淨的基線。</p></li>
</ul>
<p>初始化程序不僅僅是規劃。它建立了基礎架構，讓未來的工作階段可以立即開始工作。</p>
<p><strong>編碼代理</strong>處理每個後續階段。它</p>
<ul>
<li><p>讀取進度檔和 git 日誌以瞭解目前的狀態</p></li>
<li><p>執行基本的端對端測試，確認應用程式仍可正常運作</p></li>
<li><p>挑選一個功能進行開發</p></li>
<li><p>執行該功能、徹底測試、提交到 git 並附上說明資訊，以及更新進度檔案</p></li>
</ul>
<p>當會議結束時，程式碼庫已處於可合併的狀態：無重大錯誤、程式碼井然有序、文件清晰。沒有半途而廢的工作，也沒有什麼神秘的事情。下一個工作階段會從這個階段結束的地方繼續進行。</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">使用 JSON 來追蹤功能，而非 Markdown</h3><p><strong>一個值得注意的實作細節：功能清單應該是 JSON，而不是 Markdown。</strong></p>
<p>編輯 JSON 時，AI 模型傾向於以手術方式修改特定欄位。編輯 Markdown 時，它們通常會重寫整個部分。對於 200 多項功能的清單，Markdown 編輯可能會意外損壞您的進度追蹤。</p>
<p>一個 JSON 項目看起來是這樣的：</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>每個功能都有明確的驗證步驟。<code translate="no">passes</code> 欄位會追蹤完成度。此外，也建議使用「刪除或編輯測試是不可接受的，因為這可能會導致功能缺失或錯誤」等措辭強烈的指示，以防止代理藉由刪除困難的功能來玩弄系統。</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Milvus 如何賦予代理跨會話的語意記憶力<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>雙代理架構解決了上下文耗盡的問題，但卻無法解決遺忘的問題。</strong>即使會話之間的交接很乾淨，代理程式還是會遺忘它所學到的東西。除非進度檔案中出現這些確切的字詞，否則代理無法想起「JWT 掃描標記」與「使用者驗證」的關係。隨著專案的成長，在數百個 git commit 中搜尋會變得很慢。關鍵字匹配會遺漏對人類來說顯而易見的關聯。</p>
<p><strong>這就是向量資料庫的用武之地。</strong>向量資料庫不是儲存文字和搜尋關鍵字，而是將文字轉換成表示意義的數字。當您搜尋「使用者驗證」時，它會找到有關「JWT 更新代幣」和「登入會話處理」的條目。這並不是因為字詞匹配，而是因為概念在語義上很接近。代理可以詢問「我以前有沒有看過這樣的東西？」，並得到有用的答案。</p>
<p><strong>實際上，這是以向量的方式將進度記錄和 git 提交嵌入資料庫。</strong>當編碼會話開始時，代理會以目前的任務查詢資料庫。資料庫會以毫秒為單位回傳相關的歷史記錄：之前嘗試過的項目、成功的項目、失敗的項目。代理程式不會從頭開始。它從上下文開始。</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>非常適合這個使用個案。</strong>它是開放原始碼，專為生產規模的向量搜尋而設計，處理數以十億計的向量不費吹灰之力。對於小型專案或本機開發，<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>可直接嵌入 SQLite 等應用程式。不需要集群設定。當專案成長時，您可以移轉至分散式 Milvus，而無需變更程式碼。對於產生嵌入，您可以使用外部模型（如<a href="https://www.sbert.net/">SentenceTransformer）</a>進行細緻的控制，或參考這些<a href="https://milvus.io/docs/embeddings.md">內建的嵌入函數</a>進行更簡單的設定。Milvus 也支援<a href="https://milvus.io/docs/hybridsearch.md">混合搜尋</a>，結合向量相似性與傳統過濾功能，因此您可以在單次呼叫中查詢「尋找最近一週的類似認證問題」。</p>
<p><strong>這也解決了傳輸問題。</strong>向量資料庫持續存在於任何單一會話之外，因此知識會隨著時間累積。會話 50 可以存取在會話 1 到 49 中學到的所有知識。此專案會發展機構記憶。</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">使用自動測試來驗證完成度<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>即使有雙代理體架構和長期記憶，代理體仍可能過早宣告勝利。這就是驗證問題。</strong></p>
<p>以下是一個常見的失敗模式：編碼階段完成了一個功能，執行了快速的單元測試，看到它通過了，就把<code translate="no">&quot;passes&quot;: false</code> 翻到<code translate="no">&quot;passes&quot;: true</code> 。但是單元測試通過並不代表功能真的可以運作。API 可能會傳回正確的資料，但 UI 卻因為 CSS bug 而無法顯示。進度檔說 「完成」，但使用者什麼都看不到。</p>
<p><strong>解決方案是讓代理程式像真實使用者一樣進行測試。</strong>功能清單中的每個功能都有具體的驗證步驟：「用戶點擊新聊天按鈕 → 新對話出現在側邊欄 → 聊天區顯示歡迎狀態」。代理應實際驗證這些步驟。與其僅執行程式碼層級的測試，不如使用 Puppeteer 等瀏覽器自動化工具來模擬實際使用情況。它會打開頁面、點選按鈕、填寫表單，並檢查正確的元素是否出現在螢幕上。只有當全流程通過時，代理才會標記功能完成。</p>
<p><strong>這可以捕捉單元測試遺漏的問題</strong>。聊天功能可能有完美的後端邏輯和正確的 API 回應。但如果前端沒有渲染回覆，使用者就什麼都看不到。瀏覽器自動化可以截取結果，並驗證螢幕上顯示的內容是否與應該顯示的內容相符。只有當功能真正能端對端運作時，<code translate="no">passes</code> 欄位才會變成<code translate="no">true</code> 。</p>
<p><strong>不過，這也有其限制。</strong>有些瀏覽器原生功能無法透過 Puppeteer 等工具自動化。檔案擷取器和系統確認對話框就是常見的例子。<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic 指出</a>，依賴瀏覽器原生警示模組的功能往往會有較多錯誤，因為代理無法透過 Puppeteer 看到它們。實際的解決方案是繞過這些限制來設計。盡可能使用自訂 UI 元件取代原生對話框，讓代理可以測試功能清單中的每個驗證步驟。</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">結合起來：會話狀態的 LangGraph、長期記憶的 Milvus<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>上述概念透過兩個工具結合到一個可運作的系統中：會話狀態的 LangGraph 和長期記憶體的 Milvus。</strong>LangGraph 管理單一會話中發生的事情：正在處理的功能、已完成的功能、下一步的功能。Milvus 可儲存跨會話的可搜尋歷史：之前做了什麼、遇到什麼問題、什麼解決方案奏效。兩者結合起來，就能讓代理擁有短期和長期的記憶。</p>
<p><strong>關於此實作的說明：</strong>下面的程式碼是一個簡化的示範。它在單一腳本中展示了核心模式，但並沒有完全複製前面描述的會話分離。在生產設定中，每個編碼階段都是單獨的調用，可能會在不同的機器上或不同的時間進行。LangGraph 中的<code translate="no">MemorySaver</code> 和<code translate="no">thread_id</code> 透過在調用之間持久化狀態來實現這一點。要清楚看到恢復行為，您可以執行一次腳本，停止腳本，然後以相同的<code translate="no">thread_id</code> 再執行一次。第二次執行會從第一次離開的地方繼續。</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">結論</h3><p>AI 代理之所以無法完成長時間執行的任務，是因為它們缺乏持久記憶體和適當的驗證。Clawdbot 因解決了這些問題而大受歡迎，但它的方法並不適用於生產。</p>
<p>這篇文章涵蓋了三種解決方案：</p>
<ul>
<li><p><strong>雙代理架構：</strong>初始化程式會將專案分割成可驗證的功能；編碼代理程式會以乾淨的交接方式，一次完成一個功能。這可以防止上下文耗盡，並使進度可追蹤。</p></li>
<li><p><strong>語意記憶的向量資料庫：</strong> <a href="https://milvus.io/">Milvus</a>將進度記錄和 git 提交儲存為嵌入式資料，因此程式代理可以依據意義而非關鍵字進行搜尋。會話 50 會記住會話 1 所學到的東西。</p></li>
<li><p><strong>瀏覽器自動化實作驗證：</strong>單元測試驗證程式碼的執行。Puppeteer 透過測試使用者在螢幕上看到的內容來檢查功能是否真正運作。</p></li>
</ul>
<p>這些模式並不限於軟體開發。科學研究、財務建模、法律文件審查，任何跨越多個階段且需要可靠交接的任務都能受惠。</p>
<p>核心原則：</p>
<ul>
<li><p>使用初始化器將工作分割成可驗證的區塊</p></li>
<li><p>以結構化、機器可讀的格式追蹤進度</p></li>
<li><p>將經驗儲存於向量資料庫，以便進行語意檢索</p></li>
<li><p>使用實際測試來驗證完成度，而不只是單元測試</p></li>
<li><p>設計乾淨的會話邊界，讓工作可以安全地暫停或恢復</p></li>
</ul>
<p>工具已經存在。模式已被證實。剩下的就是應用它們。</p>
<p><strong>準備好開始了嗎？</strong></p>
<ul>
<li><p>探索<a href="https://milvus.io/">Milvus</a>和<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>，為您的代理程式加入語意記憶體。</p></li>
<li><p>參考 LangGraph 來管理會話狀態</p></li>
<li><p>閱讀<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic</a>對於長時間運作的代理程式束<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">的完整研究</a>。</p></li>
</ul>
<p><strong>有問題或想分享您正在建立的東西？</strong></p>
<ul>
<li><p>加入<a href="https://milvus.io/slack">Milvus Slack 社群</a>，與其他開發人員聯繫。</p></li>
<li><p>參加<a href="https://milvus.io/office-hours">Milvus 辦公時間</a>，與團隊進行即時問答</p></li>
</ul>
