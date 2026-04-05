---
id: claude-code-memory-memsearch.md
title: 我們閱讀了 Claude Code 洩露的原始碼。它的記憶體實際上是如何運作的
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  Claude Code 洩漏的原始碼揭露了 4 層記憶體，上限為 200 行，並僅使用 grep 搜尋。以下是每一層的運作方式，以及 memsearch
  所修復的內容。
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>Claude Code 的原始碼意外地公開發放。版本 2.1.88 包含了一個 59.8 MB 的原始碼映射檔案，這個檔案應該從建置中刪除。這個檔案包含了完整的、可讀的 TypeScript 原始碼庫 - 512,000 行，現在已經鏡射到 GitHub 上。</p>
<p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">記憶體系統</a>引起了我們的注意。Claude Code 是市面上最受歡迎的 AI 編碼代理程式，而記憶體是大多數使用者在不瞭解其運作方式的情況下，與之互動的部分。因此我們深入瞭解。</p>
<p>簡而言之：Claude Code 的記憶體比你想像中更基本。它的上限是 200 行記事。它只能以完全符合關鍵字的方式尋找記憶體 - 如果您詢問「連接埠衝突」，但筆記卻寫著「docker-compose 映射」，那您就什麼都找不到。而且沒有一個會留下 Claude Code。切換到不同的代理程式，你就會從零開始。</p>
<p>以下是四個層次：</p>
<ul>
<li><strong>CLAUDE.md</strong>- 你自己寫的檔案，裡面有 Claude 要遵循的規則。手動、靜態、受限於您事先想好要寫下多少東西。</li>
<li><strong>自動記憶</strong>- Claude 會在會話中自行記下筆記。非常有用，但索引上限為 200 行，且無法依意思搜尋。</li>
<li><strong>Auto Dream</strong>- 背景清理程序，可在您閒置時整合雜亂的記憶。有助於處理數天前的雜亂記憶，但無法跨越數個月的時間。</li>
<li><strong>KAIROS</strong>- 在洩漏的程式碼中發現的未釋放的永遠開機的 daemon 模式。目前尚未公開。</li>
</ul>
<p>以下，我們將解開每一層，然後介紹架構的缺點，以及我們如何建立架構來解決缺口。</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">CLAUDE.md 如何運作？<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md 是您建立並放置在專案資料夾中的 Markdown 檔案。您可以在其中填入任何希望 Claude 記憶的內容：程式碼樣式規則、專案結構、測試指令、部署步驟。Claude 會在每個工作階段開始時載入它。</p>
<p>存在三種範圍：專案層級 (在 repo 根目錄)、個人 (<code translate="no">~/.claude/CLAUDE.md</code>) 及組織 (企業組態)。較短的檔案能更可靠地被跟蹤。</p>
<p>限制很明顯：CLAUDE.md 只保留您事先寫下的東西。調試決定、您在會談中間提到的偏好、您們一起發現的邊緣情況 - 除非您停下來手動新增，否則這些都不會被記錄下來。大多數人都不會這樣做。</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">自動記憶如何運作？<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>自動記憶會擷取工作期間浮現的內容。Claude 會決定哪些內容值得保留，並將其寫入您電腦上的記憶體資料夾，整理成四個類別：使用者 (角色與偏好)、回饋 (您的修正)、專案 (決策與情境)，以及參考 (東西的位置)。</p>
<p>每個筆記都是獨立的 Markdown 檔案。入口點是<code translate="no">MEMORY.md</code> - 一個索引，其中每一行都是指向詳細檔案的簡短標籤 (150 個字元以下)。Claude 會讀取索引，然後在特定檔案看起來相關時拉取它們。</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>MEMORY.md 的前 200 行會載入每個階段。除此之外的內容都是隱藏的。</p>
<p>一個聰明的設計選擇：洩漏的系統提示告訴 Claude 將它自己的記憶體當作一個提示，而非事實。它會先與真實程式碼驗證，然後再根據記憶中的任何東西行事，這有助於減少幻覺 - 這也是其他<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">AI 代理框架</a>開始採用的模式。</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">Auto Dream 如何鞏固陳舊的記憶？<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memory 會擷取筆記，但使用數週之後，這些筆記就會變得陳舊。一個記載「昨天部署的錯誤」的條目在一星期後就變得毫無意義。筆記說您使用 PostgreSQL，但更新的筆記卻說您已遷移至 MySQL。刪除的檔案仍有記憶體項目。索引中充斥著矛盾和過時的引用。</p>
<p>Auto Dream 就是清理程序。它在背景中執行，並且</p>
<ul>
<li>用精確的日期取代含糊不清的時間參照。"昨天的部署問題」→「2026-03-28 部署問題」。</li>
<li>解決矛盾。PostgreSQL 備註 + MySQL 備註 → 保留目前的真相。</li>
<li>刪除陳舊的項目。參考已刪除檔案或已完成任務的筆記會被移除。</li>
<li>將<code translate="no">MEMORY.md</code> 保持在 200 行以下。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>觸發條件：</strong>自上次清理後超過 24 小時，且累積至少 5 個新會話。您也可以輸入「dream」來手動執行。該程序在背景子代理程式中執行 - 就像實際睡眠一樣，它不會干擾您的工作。</p>
<p>造夢代理程式的系統提示以下列內容開始：<em>「您正在執行夢境 - 對您的記憶檔案進行反省」。</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">什麼是 KAIROS？Claude Code 未釋放的 Always-On 模式<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>前三層已經啟用或推出。洩漏的程式碼也包含一些尚未出貨的東西：KAIROS。</p>
<p>KAIROS 明顯是以希臘文「the right moment」命名，在原始碼中出現超過 150 次。它會將 Claude Code 從您主動使用的工具，變成持續監控您專案的背景助理。</p>
<p>根據洩露的程式碼，KAIROS：</p>
<ul>
<li>記錄一整天的觀察、決定與行動。</li>
<li>定時檢查。在固定的時間間隔內，它會接收訊號，並決定：採取行動或保持安靜。</li>
<li>不擋你的路。任何會阻礙你超過 15 秒的動作都會被延遲。</li>
<li>在內部執行夢想清理，並在背景執行完整的觀察-思考-行動循環。</li>
<li>擁有一般 Claude Code 所沒有的專屬工具：推送檔案給您，傳送通知，監控您的 GitHub 拉取請求。</li>
</ul>
<p>KAIROS 位於編譯時功能旗標之後。它不在任何公開版本中。把它想像成 Anthropic 在探索當<a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">代理程式記憶體</a>不再是逐次會話，而變成永遠在線時會發生什麼事。</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">Claude Code 的記憶體架構在哪些地方有問題？<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 的記憶體做了實際的工作。但隨著專案的成長，有五個結構上的限制限制了它的處理能力。</p>
<table>
<thead>
<tr><th>限制</th><th>發生什麼事</th></tr>
</thead>
<tbody>
<tr><td><strong>200 行索引上限</strong></td><td><code translate="no">MEMORY.md</code> 可容納 ~25 KB。執行專案數月後，舊的項目就會被新的項目取代。"我們上周決定的 Redis 配置是什麼？- 消失了。</td></tr>
<tr><td><strong>僅 Grep 檢索</strong></td><td>記憶體搜尋使用字面<a href="https://milvus.io/docs/full-text-search.md">關鍵字匹配</a>。您記得「部署時的連接埠衝突」，但筆記卻寫著「docker-compose 連接埠映射」。Grep 無法彌補這個差距。</td></tr>
<tr><td><strong>只有摘要，沒有推理</strong></td><td>自動記憶體儲存的是高層次的筆記，而不是調試步驟或達成目的的推理。<em>如何達成目標的過程</em>就消失了。</td></tr>
<tr><td><strong>複雜性堆疊卻沒有修正基礎</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS。每層的存在都是因為上一層還不夠。但再多的層次也無法改變底下的東西：一個工具、本機檔案、逐個會話擷取。</td></tr>
<tr><td><strong>記憶體被鎖定在 Claude Code 內</strong></td><td>切換到 OpenCode、Codex CLI 或任何其他代理程式，您都是從零開始。沒有匯出、沒有共用格式、沒有可移植性。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這些都不是錯誤。它們是單一工具、本地檔案架構的自然限制。每個月都會有新的代理程式推出，工作流程也會改變，但您在專案中建立的知識不該隨之消失。這就是我們建立<a href="https://github.com/zilliztech/memsearch">memsearch</a> 的原因。</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">什麼是 memsearch？任何 AI 編碼代理程式的持久記憶體<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a>將記憶體從代理程式中拉出，並放入自己的層中。代理程式來來去去。記憶體保持不變。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">如何安裝 memsearch</h3><p>Claude Code 使用者從市場上安裝：</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>完成。不需要任何設定。</p>
<p>其他平台也一樣簡單。OpenClaw:<code translate="no">openclaw plugins install clawhub:memsearch</code> 。透過 uv 或 pip 的 Python API：</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">memsearch 捕捉到什麼？</h3><p>一旦安裝，memsearch 就會鉤住代理程式的生命週期。每次對話都會自動進行總結和索引。當您提出一個需要歷史記錄的問題時，recall 會自行觸發。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>記憶檔案是以 Markdown 的方式儲存 - 每天一個檔案：</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>您可以在任何文字編輯器中開啟、閱讀和編輯記憶檔。如果您想要遷移，您可以複製資料夾。如果您想要版本控制，git 可以原生運作。</p>
<p>儲存於<a href="https://milvus.io/docs/overview.md">Milvus</a>的<a href="https://milvus.io/docs/index-explained.md">向量索引</a>是一個快取層 - 如果它遺失了，您可以從 Markdown 檔案重建它。您的資料存在檔案中，而不是索引中。</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">memsearch 如何尋找記憶體？語意搜尋 vs. Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 的記憶體檢索使用 grep - 文字關鍵字匹配。當您有數十筆筆記時，這種方法很有效，但當您記不起確切的字詞時，數個月的歷史就會讓這種方法失效。</p>
<p>memsearch 使用<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">混合搜尋來</a>取代。即使措辭不同，<a href="https://zilliz.com/glossary/semantic-search">語意向量</a>也能找到與您的查詢相關的內容，而 BM25 則會匹配精確的關鍵字。<a href="https://milvus.io/docs/rrf-ranker.md">RRF (Reciprocal Rank Fusion)</a>會將兩個結果集合併並排在一起。</p>
<p>比方說，您問「上星期 Redis 超時的問題是怎麼解決的？- 語意搜尋會了解您的意圖，並找到它。假設您詢問「搜尋<code translate="no">handleTimeout</code> 」- BM25 會命中確切的函式名稱。這兩種途徑會遮蔽彼此的盲點。</p>
<p>當召回觸發時，子代理會分三階段進行搜尋，僅在需要時才深入搜尋：</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1：語義搜尋 - 簡短預覽</h3><p>子代理程式針對 Milvus 索引執行<code translate="no">memsearch search</code> ，並擷取最相關的結果：</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>每個結果都會顯示相關度評分、原始檔案以及 200 個字元的預覽。大多數的查詢到此為止。</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2:完整內容 - 擴展特定結果</h3><p>如果 L1 的預覽還不夠，子代理程式會執行<code translate="no">memsearch expand a3f8c1</code> 來取得完整的項目：</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: 原始對話記錄</h3><p>在罕見的情況下，如果您需要看清楚對話內容，子代理程式會擷取原始的交談內容：</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>副本保留了所有內容：您的原話、代理的確切回應，以及每個工具呼叫。這三個階段由輕到重 - 子代理決定深入的程度，然後將整理好的結果回傳到您的主會話。</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">memsearch 如何跨 AI 編碼代理程式分享記憶體？<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>這是 memsearch 與 Claude Code 記憶體之間最根本的差距。</p>
<p>Claude Code 的記憶體被鎖定在一個工具裡面。使用 OpenCode、OpenClaw 或 Codex CLI，您就得從頭開始。MEMORY.md 是本地的，綁定在一個使用者和一個代理。</p>
<p>memsearch 支援四種編碼代理：Claude Code、OpenClaw、OpenCode 和 Codex CLI。它們共用相同的 Markdown 記憶體格式和相同的<a href="https://milvus.io/docs/manage-collections.md">Milvus 套件</a>。從任何代理寫入的記憶體都可以從其他代理搜尋到。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>兩個真實情境：</strong></p>
<p><strong>切換工具。</strong>您花了一個下午的時間在 Claude Code 中找出部署管道，但卻遇到幾個障礙。對話會被自動總結並編入索引。第二天您切換到 OpenCode，並問「昨天的連接埠衝突是怎麼解決的？OpenCode 會搜尋 memsearch，找到昨天的 Claude Code 記憶，然後給您正確的答案。</p>
<p><strong>團隊協作。</strong>將 Milvus 後端指向<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>，不同機器上的多位開發人員使用不同的代理，讀寫相同的專案記憶體。新團隊成員加入時，不需要翻查幾個月的 Slack 和文件 - 代理已經知道了。</p>
<h2 id="Developer-API" class="common-anchor-header">開發人員 API<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您要建立自己的<a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">代理工具</a>，memsearch 提供 CLI 和 Python API。</p>
<p><strong>CLI：</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>Python API：</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>在引擎蓋下，Milvus 會處理向量搜尋。使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>在本機執行 (零組態)、透過<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>進行協作 (提供免費層級)，或使用 Docker 自行託管。<a href="https://milvus.io/docs/embeddings.md">嵌入式</a>預設為 ONNX - 在 CPU 上執行，不需要 GPU。可隨時交換 OpenAI 或 Ollama。</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Claude Code Memory vs. memsearch：全面比較<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
<tr><th>特點</th><th>克勞德碼記憶體</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>什麼會被儲存</td><td>Claude 認為重要的內容</td><td>每次對話，自動摘要</td></tr>
<tr><td>儲存限制</td><td>~200 行索引 (~25 KB)</td><td>無限制 (每日檔案 + 向量索引)</td></tr>
<tr><td>尋找舊回憶</td><td>Grep 關鍵字比對</td><td>以意義為基礎 + 關鍵字混合搜尋 (Milvus)</td></tr>
<tr><td>您能讀取它們嗎？</td><td>手動檢查記憶體資料夾</td><td>開啟任何 .md 檔案</td></tr>
<tr><td>您可以編輯它們嗎？</td><td>手動編輯檔案</td><td>相同 - 儲存時自動重新索引</td></tr>
<tr><td>版本控制</td><td>非專為其設計</td><td>git 原生可用</td></tr>
<tr><td>跨工具支援</td><td>僅 Claude 程式碼</td><td>4 個代理，共享記憶體</td></tr>
<tr><td>長期記憶</td><td>數週後退化</td><td>持續數月</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">開始使用 memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 的記憶體有真正的優勢 - 自我懷疑的設計、夢想鞏固的概念，以及 KAIROS 中 15 秒的阻斷預算。Anthropic 正在努力思考這個問題。</p>
<p>但是單一工具記憶體是有上限的。一旦你的工作流程跨越多個代理、多個人，或是超過幾週的歷史，你就需要獨立存在的記憶體。</p>
<ul>
<li>試試<a href="https://github.com/zilliztech/memsearch">memsearch</a>- 開放原始碼，MIT 授權。只需兩個指令即可在 Claude Code 中安裝。</li>
<li>閱讀<a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">memsearch 在引擎蓋下的運作方式</a>或<a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude Code 外掛指南</a>。</li>
<li>有問題嗎？加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社群</a>，或<a href="https://milvus.io/office-hours">預約免費的 Office Hours 會話</a>，瞭解您的使用個案。</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常見問題<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">Claude Code 的記憶體系統是如何運作的？</h3><p>Claude Code 使用四層記憶體架構，全部儲存為本機 Markdown 檔案。CLAUDE.md 是您手寫的靜態規則檔案。Auto Memory 可讓 Claude 在會話期間儲存自己的筆記，整理成四個類別 - 使用者偏好、回饋、專案情境和參考指標。Auto Dream 會在背景中整合陳舊的記憶。KAIROS 是在洩露的原始碼中發現的未釋放的永遠開機 daemon。整個系統的索引上限為 200 行，而且只能透過精確的關鍵字匹配進行搜尋 - 不能進行語意搜尋或基於意義的回憶。</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">AI 編碼代理可以在不同的工具間分享記憶體嗎？</h3><p>本機無法。Claude Code 的記憶體被鎖定在 Claude Code 內 - 沒有匯出格式或跨代理協定。如果您切換到 OpenCode、Codex CLI 或 OpenClaw，您就得從頭開始。Memsearch 透過將記憶體儲存為有日期的 Markdown 檔案，並在<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>（Milvus）中編入索引，解決了這個問題。所有四種支援的代理都讀寫相同的記憶體儲存，因此當您切換工具時，上下文會自動轉移。</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">代理記憶體的關鍵字搜尋與語意搜尋有何不同？</h3><p>關鍵字搜尋 (grep) 會匹配精確的字串 - 如果您的記憶體寫的是 "docker-compose port mapping「 但您搜尋的是 」port conflicts"，它什麼都不會回傳。而語意搜尋則會將文字轉換成<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>，以擷取意義，因此相關的概念即使措辭不同也能匹配。membsearch 結合了這兩種方法與混合搜尋，讓您在單一查詢中就能獲得以意義為基礎的召回率與精確的關鍵字精確度。</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">Claude Code 原始碼事件洩漏了什麼？</h3><p>Claude Code 2.1.88 版在出貨時附帶了一個 59.8 MB 的原始碼地圖檔，這個檔案應該從生產版本中刪除。該檔案包含完整、可讀的 TypeScript 原始碼庫 - 大約 512,000 行 - 包括完整的記憶體系統實作、Auto Dream 整合程序，以及對 KAIROS (一種尚未釋出的永遠在線代理模式) 的參照。這些程式碼很快就在 GitHub 上被鏡射，然後才被移除。</p>
