---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: 我們擷取 OpenClaw 的記憶體系統並將其開放原始碼 (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  我們將 OpenClaw 的 AI 記憶體架構萃取到 memsearch - 一個獨立的 Python 函式庫，具有 Markdown 日誌、混合向量搜尋與
  Git 支援。
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a>(前身為 clawdbot 和 moltbot) 正以病毒式的方式傳播 - 在不到兩週的時間內，<a href="https://github.com/openclaw/openclaw">GitHub 上的星級已超過 189k</a>。這實在太瘋狂了。大部分的討論都圍繞著它在日常聊天管道上的自主代理能力，包括 iMessages、WhatsApp、Slack、Telegram 等等。</p>
<p>不過，身為研究向量資料庫系統的工程師，<strong>OpenClaw</strong> 真正吸引我們注意的是<strong>它對長期記憶的處理方式</strong>。與大多數的記憶體系統不同，OpenClaw 讓其人工智能自動將每日記錄寫成 Markdown 檔案。這些檔案是真相的來源，而模型只「記得」寫入磁碟的內容。人類開發者可以開啟這些 Markdown 檔案，直接編輯它們，提煉出長期原則，並確切看到 AI 在任何時候所記得的東西。沒有黑盒。老實說，這是我們見過最簡潔、最方便開發人員使用的記憶體架構之一。</p>
<p>所以很自然地，我們有了一個問題：<strong><em>為什麼這只能在 OpenClaw 中運作？如果任何代理都能擁有這樣的記憶體會如何？</em></strong>我們從 OpenClaw 擷取了精確的記憶體架構，並建立了<a href="https://github.com/zilliztech/memsearch">memsearch</a>- 一個獨立、隨插即用的長期記憶體函式庫，讓任何代理程式都能擁有持久、透明、可由人員編輯的記憶體。不需依賴 OpenClaw 的其他部分。只要將它放入，您的代理程式就能獲得由 Milvus/Zilliz Cloud 提供搜尋功能的持久性記憶體，以及 Markdown 日誌作為真相的正統來源。</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a>(開放原始碼，MIT 授權)</p></li>
<li><p><strong>說明文件</strong> <a href="https://zilliztech.github.io/memsearch/">：https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Claude 程式碼外掛</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">：https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">OpenClaw 記憶體的與眾不同之處<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入瞭解 OpenClaw 記憶體架構之前，讓我們先搞清楚兩個概念：<strong>上下文</strong>與<strong>記憶體</strong>。這兩個概念聽起來很相似，但實際運作起來卻很不同。</p>
<ul>
<li><p><strong>上下文</strong>是代理在單次請求中看到的所有內容 - 系統提示、專案層級的指導檔案（如<code translate="no">AGENTS.md</code> 和<code translate="no">SOUL.md</code> ）、會話歷史（訊息、工具呼叫、壓縮摘要），以及使用者目前的訊息。它只限於一個階段，而且相對精簡。</p></li>
<li><p><strong>記憶體</strong>是跨會話持續存在的東西。它存在於您的本機磁碟上 - 過往會話的完整記錄、代理程式處理過的檔案，以及使用者偏好設定。未經總結。未經壓縮。原始的東西。</p></li>
</ul>
<p>現在，OpenClaw 的設計決定讓它變得特別：<strong>所有的記憶體都儲存在本機檔案系統上的純 Markdown 檔案。</strong>每次會話之後，AI 都會自動寫入更新的 Markdown 記錄。您和任何開發人員都可以開啟、編輯、重組、刪除或精進它們。同時，向量資料庫與此系統並列，建立並維護檢索索引。每當 Markdown 檔案變更時，系統就會偵測到該變更，並自動重新建立索引。</p>
<p>如果您使用過 Mem0 或 Zep 之類的工具，您會立即發現其中的差異。那些系統會將記憶體儲存為 embeddings - 這是唯一的副本。您無法讀取代理程式所記憶的內容。您也無法透過編輯一行來修正錯誤的記憶。OpenClaw 的方法讓您兩者兼具：純檔案的透明度<strong>，以及</strong>使用向量資料庫進行向量搜尋的檢索能力。您可以讀取、<code translate="no">git diff</code> 、grep - 它只是檔案而已。</p>
<p>唯一的缺點是什麼？目前，這個 Markdown-first 記憶體系統與整個 OpenClaw 生態系統緊密交織在一起 - Gateway 程序、平台連接器、工作區設定以及訊息傳輸基礎架構。如果您只想要記憶體模型，那就需要拖入許多機器。</p>
<p>這正是我們建立<a href="http://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> 的原因：相同的理念 - 以 Markdown 作為真相來源、自動向量索引、完全由人工編輯 - 但卻以輕量、獨立的函式庫形式提供，您可以將其放入任何代理體架構中。</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Memsearch 如何運作<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>如前所述，<a href="https://github.com/zilliztech/memsearch">memsearch</a>是一個完全獨立的長期記憶體函式庫，它實現了 OpenClaw 所使用的相同記憶體架構，而不需要使用 OpenClaw 堆疊的其他部分。您可以將它插入任何代理程式框架 (Claude、GPT、Llama、客製化代理程式、工作流程引擎)，立即為您的系統提供持久、透明、可由人員編輯的記憶體。</p>
<p>memsearch 中的所有代理程式記憶體都是以純文字 Markdown 的方式儲存在本機目錄中。其結構刻意地簡單，因此開發人員可以一目了然：</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch 使用<a href="https://milvus.io/"><strong>Milvus</strong></a>作為向量資料庫，為這些 Markdown 檔案建立索引，以便快速進行語意檢索。但最重要的是，向量索引<em>不是</em>真相的來源，檔案才是。如果您完全刪除 Milvus 索引，<strong>您不會有任何損失。</strong>Memsearch 只需重新embed 並重新索引 Markdown 檔案，在幾分鐘內就能重建完整的檢索層。這表示您的代理程式的記憶體是透明、持久且完全可重建的。</p>
<p>以下是 memsearch 的核心功能：</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">可讀的 Markdown 讓調試就像編輯檔案一樣簡單</h3><p>調試人工智慧記憶體通常是很痛苦的。當代理程式產生錯誤答案時，大多數記憶體系統都無法讓您清楚看到它實際儲存了<em>什麼</em>。典型的工作流程是撰寫自訂程式碼來查詢記憶體 API，然後再篩選不透明的 embeddings 或冗長的 JSON blobs，這兩種方式都無法讓您了解 AI 真正的內部狀態。</p>
<p><strong>memsearch 可以解決所有這些問題。</strong>所有的記憶體都以純 Markdown 的形式存在於 memory/ 資料夾中：</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>如果 AI 做錯了什麼，只需要編輯檔案就可以解決問題。更新項目、儲存，memsearch 就會自動重新索引變更。五秒鐘。無需呼叫 API。不需要工具。沒有神秘感。您調試 AI 記憶體的方式與調試文件的方式相同，只需編輯檔案即可。</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">Git 支援的記憶體可讓團隊追蹤、檢閱及回復變更</h3><p>存儲在資料庫中的 AI 記憶體很難進行協作。若要找出誰在何時修改了什麼，就必須翻查稽核記錄，而許多解決方案甚至不提供這些記錄。變更發生得悄無聲息，而關於 AI 應該記住什麼的爭議也沒有明確的解決途徑。團隊最後只能依賴 Slack 訊息和假設。</p>
<p>Memsearch 可以解決這個問題，它讓記憶體變成 Markdown 檔案，也就是說<strong>Git 會自動處理版本</strong>。單一指令即可顯示整個歷史記錄：</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>現在 AI 記憶體與程式碼參與相同的工作流程。架構決定、組態更新和偏好變更都會顯示在差異檔中，任何人都可以評論、批准或回復：</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">純文字記憶體讓遷移幾乎不費吹灰之力</h3><p>遷移是記憶體框架最大的隱藏成本之一。從一個工具移轉到另一個工具通常意味著匯出資料、轉換格式、重新匯入，並希望欄位能夠相容。這樣的工作很容易花掉半天的時間，而且結果永遠無法保證。</p>
<p>memsearch 完全避免了這個問題，因為記憶體是明文 Markdown。沒有專屬格式、沒有模式需要翻譯，也沒有任何東西需要移植：</p>
<ul>
<li><p><strong>切換機器：</strong> <code translate="no">rsync</code> 記憶體資料夾。完成。</p></li>
<li><p><strong>切換嵌入模型：</strong>重新執行索引指令。只需花費五分鐘，markdown 檔案保持不變。</p></li>
<li><p><strong>切換向量資料庫部署：</strong>變更一個設定值。例如，從開發中的 Milvus Lite 到生產中的 Zilliz Cloud：</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>您的記憶體檔案完全保持不變。它們周圍的基礎架構可以自由發展。結果就是長期的可攜性 - 這是 AI 系統中少有的特性。</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">共用 Markdown 檔案讓人類與代理共同撰寫記憶體</h3><p>在大多數記憶體解決方案中，編輯 AI 記憶體需要針對 API 寫程式碼。這意味著只有開發人員才能維護 AI 記憶體，而且即使對他們來說也很麻煩。</p>
<p>Memsearch 可讓責任分工更自然：</p>
<ul>
<li><p><strong>AI 處理：</strong>自動每日日誌 (<code translate="no">YYYY-MM-DD.md</code>) 包含執行細節，例如「已部署 v2.3.1，效能提升 12%」。</p></li>
<li><p><strong>人類處理：</strong> <code translate="no">MEMORY.md</code> 中的長期原則，例如「團隊堆疊」：Python + FastAPI + PostgreSQL"。</p></li>
</ul>
<p>雙方使用他們已經使用的工具編輯相同的 Markdown 檔案。不需要呼叫 API、不需要特殊工具、不需要守門員。當記憶體被鎖定在資料庫內時，這種共享作者權是不可能的。</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">引擎蓋下：memsearch 運作在四個工作流程上，讓記憶體保持快速、新鮮和精簡<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch 有四個核心工作流程：<strong>觀察</strong>(監控) →<strong>索引</strong>(分塊和嵌入) →<strong>搜尋</strong>(擷取) →<strong>彙整</strong>(總結)。以下是每一項的作用。</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1.觀看：每次儲存檔案時自動重新索引</h3><p><strong>Watch</strong>工作流程會監控記憶體/目錄中的所有 Markdown 檔案，並在檔案修改和儲存時觸發重新索引。<strong>1500 毫秒</strong>的<strong>延遲</strong>可確保偵測到更新，而不會浪費運算：如果接連發生多次儲存，計時器就會重設，並在編輯穩定後才啟動。</p>
<p>這個延遲是根據經驗調整的：</p>
<ul>
<li><p><strong>100ms</strong>→ 太敏感；每次按鍵都會啟動，燒毀嵌入式呼叫</p></li>
<li><p><strong>10s</strong>→ 太慢；開發者會注意到滯後</p></li>
<li><p><strong>1500ms</strong>→ 反應速度與資源效率的理想平衡點</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>實際上，這表示開發人員可以在一個視窗中編寫程式碼，並在另一個視窗中編輯<code translate="no">MEMORY.md</code> 、新增 API docs URL 或修正過時的項目。儲存檔案後，下一次 AI 查詢就會擷取新的記憶體。不需要重新啟動，也不需要手動重新索引。</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2.索引：智能分塊、重複資料刪除和版本感知嵌入</h3><p>Index 是效能關鍵的工作流程。它處理三件事：<strong>分塊、重複資料刪除和版本化的分塊 ID。</strong></p>
<p><strong>分塊</strong>會沿著語意邊界分割文字 - 標題及其正文 - 因此相關內容會保持在一起。這可以避免像「Redis 配置」這樣的短語被分割到不同的區塊中。</p>
<p>例如，這個 Markdown：</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>變成兩個區塊：</p>
<ul>
<li><p>Chunk 1：<code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Chunk 2：<code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>重複資料刪除</strong>使用每個 chunk 的 SHA-256 切細值，以避免嵌入相同文字兩次。如果多個檔案提到「PostgreSQL 16」，嵌入 API 會被呼叫一次，而不是每個檔案呼叫一次。對於 ~500KB 的文字，<strong>每月</strong>可節省約<strong> 0.15 美元。</strong>若擴大規模，則可節省數百美元。</p>
<p><strong>Chunk ID 設計</strong>編碼了知道一個 chunk 是否過期所需的一切。格式為<code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code> 。<code translate="no">model_version</code> 欄位是重要的部分：當嵌入模型從<code translate="no">text-embedding-3-small</code> 升級到<code translate="no">text-embedding-3-large</code> 時，舊的嵌入就會變得無效。由於模型版本已嵌入 ID 中，因此系統會自動識別哪些片段需要重新嵌入。不需要手動清理。</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3.搜尋：混合向量 + BM25 擷取最大精確度</h3><p>擷取使用混合搜尋方式：向量搜尋佔 70% 的權重，BM25 關鍵字搜尋佔 30% 的權重。這平衡了在實務中經常出現的兩種不同需求。</p>
<ul>
<li><p><strong>向量搜尋可</strong>處理語意匹配。對「Redis 快取配置」的查詢會回傳一個包含「Redis L1 cache with 5min TTL」的 chunk，即使字眼不同。當開發人員記得概念，但不記得確切的措辭時，這將非常有用。</p></li>
<li><p><strong>BM25</strong>可處理精確匹配。查詢「PostgreSQL 16」不會回傳「PostgreSQL 15」的結果。這對於錯誤代碼、函式名稱和特定版本的行為很重要，在這些地方接近是不夠好的。</p></li>
</ul>
<p>預設的 70/30 分割對大多數使用個案而言都很好。對於偏重於精確匹配的工作流程，將 BM25 的權重提高到 50% 只需要單行設定變更。</p>
<p>結果會以 top-K chunks (預設 3) 的形式傳回，每個截斷為 200 個字元。需要完整內容時，<code translate="no">memsearch expand &lt;chunk_hash&gt;</code> 。這種循序漸進的揭露方式讓 LLM 上下文視窗的使用量保持精簡，同時又不會犧牲對細節的存取。</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4.緊湊：總結歷史記憶體以保持上下文乾淨</h3><p>累積的記憶體最終會成為問題。舊條目會填滿上下文視窗，增加代幣成本，並增加降低答案品質的雜訊。Compact 可透過呼叫 LLM 將歷史記憶總結成精簡的形式，然後刪除或歸檔原始內容，以解決這個問題。它可以手動觸發或排程定期執行。</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">如何開始使用 memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch 提供<strong>Python API</strong>和<strong>CLI</strong>，因此您可以在代理程式框架內使用它，或是將它當成獨立的除錯工具。設定非常簡單，而且系統的設計讓您的本機開發環境和生產部署看起來幾乎完全相同。</p>
<p>Memsearch 支援三種與 Milvus 相容的後端，全都透過<strong>相同的 API</strong> 開啟：</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (預設)</strong></a><strong>：</strong>本機<code translate="no">.db</code> 檔案，零組態，適合個人使用。</p></li>
<li><p><strong>Milvus Standalone / Cluster：</strong>自行託管，支援多個代理分享資料，適合團隊環境。</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>：</strong>全面管理，具備自動擴充、備份、高可用性及隔離功能。適合生產工作負載。</p></li>
</ul>
<p>從本機開發切換到生產環境通常<strong>只需要單行變更設定</strong>。您的程式碼維持不變。</p>
<h3 id="Install" class="common-anchor-header">安裝</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch 也支援多種嵌入提供者，包括 OpenAI、Google、Voyage、Ollama 和本機模型。這可確保您的記憶體架構保持可攜性與供應商無關。</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">選項 1：Python API (整合至您的代理程式框架)</h3><p>以下是使用 memsearch 的完整代理程式循環的最小範例。您可以根據需要複製/貼上並修改：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>這顯示核心迴圈：</p>
<ul>
<li><p><strong>回想</strong>：memsearch 執行混合向量 + BM25 檢索</p></li>
<li><p><strong>思考</strong>：您的 LLM 處理使用者輸入 + 擷取的記憶體</p></li>
<li><p><strong>記住</strong>：代理將新記憶體寫入 Markdown，而 memsearch 更新其索引</p></li>
</ul>
<p>這個模式很自然地適用於任何代理系統--LangChain、AutoGPT、語義路由器、LangGraph 或自訂代理循環。它在設計上與框架無關。</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">選項 2：CLI (快速操作，適合除錯)</h3><p>CLI 是獨立工作流程、快速檢查或在開發過程中檢查記憶體的理想選擇：</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>CLI 與 Python API 的功能相同，但不需要撰寫任何程式碼，非常適合除錯、檢查、遷移或驗證記憶體資料夾結構。</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">memsearch 與其他記憶體解決方案的比較<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>開發人員最常問的問題是，既然已有成熟的選擇，為什麼還要使用 memsearch？簡短的答案是：memsearch 以時間知識圖表等進階功能換取透明度、可移植性和簡易性。對於大多數的代理程式記憶體使用個案而言，這是正確的取捨。</p>
<table>
<thead>
<tr><th>解決方案</th><th>優勢</th><th>限制</th><th>最適合</th></tr>
</thead>
<tbody>
<tr><td>記憶體搜尋</td><td>透明的明文記憶體、人類與人工智能共同撰寫、零移轉摩擦、簡易除錯、Git-native</td><td>沒有內建時序圖或複雜的多重代理記憶體結構</td><td>重視長期記憶體的控制、簡易性與可攜性的團隊</td></tr>
<tr><td>Mem0</td><td>完全管理，無需執行或維護基礎架構</td><td>不透明 - 無法檢查或手動編輯記憶體；內嵌是唯一的表達方式</td><td>需要放手不管的管理服務，且能見度較低的團隊</td></tr>
<tr><td>Zep</td><td>豐富的功能集：時間記憶、多角色建模、複雜的知識圖表</td><td>沉重的架構；更多的移動元件；更難學習和操作</td><td>真正需要進階記憶結構或時間感知推理的 Agents</td></tr>
<tr><td>LangMem / Letta</td><td>在各自的生態系統中進行深入、無縫的整合</td><td>框架鎖定；很難移植到其他代理堆疊</td><td>團隊已經致力於那些特定的框架</td></tr>
</tbody>
</table>
<h2 id="Try-memsearch-and-let-us-know-your-feedback" class="common-anchor-header">嘗試 memsearch 並讓我們知道您的回饋<button data-href="#Try-memsearch-and-let-us-know-your-feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch 在 MIT 授權下完全開放原始碼，目前儲存庫已準備好進行生產實驗。</p>
<ul>
<li><p><strong>Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>說明文件：</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>如果您正在建立一個需要跨會話記憶東西的代理程式，並且想要完全控制它所記憶的東西，memsearch 是值得一看的。這個函式庫只需安裝到<code translate="no">pip install</code> ，就能與任何代理框架搭配使用，並將所有內容儲存為 Markdown 格式，您可以讀取、編輯，並使用 Git 進行版本更新。</p>
<p>我們正積極開發 memsearch，並歡迎社群提供意見。</p>
<ul>
<li><p>如果有任何問題，請開啟問題。</p></li>
<li><p>如果您想要擴充函式庫，請提交 PR。</p></li>
<li><p>如果您對 Markdown-as-source-of-truth 的理念有共嗚，請在 repo 加入星號。</p></li>
</ul>
<p>OpenClaw 的記憶體系統不再鎖在 OpenClaw 內。現在，任何人都可以使用它。</p>
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw 是什麼？開放原始碼 AI 代理完整指南</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 教學：連接至 Slack 的本地 AI 助理</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">使用 LangGraph 與 Milvus 建立 Clawdbot 式的 AI 代理程式</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG vs Long-Running Agents：RAG 是否過時？</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">為 Milvus 建立自訂人類技能以快速啟動 RAG</a></p></li>
</ul>
