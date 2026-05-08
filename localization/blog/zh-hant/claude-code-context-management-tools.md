---
id: claude-code-context-management-tools.md
title: 適用於 Claude 程式碼上下文管理的 7 個最佳開放原始碼工具
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/cccm_11zon_848f7f1c6b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: 長時間的 Claude Code 會話會快速失去訊號。學習 7 種工具，用於修剪終端雜訊、代碼檢索、工具輸出、記憶體和令牌使用。
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>您可以給 Claude Code 一個 1M-token 的上下文視窗，但隨著時間的推移，仍會得到較差的答案。問題不只是上下文大小。它是上下文品質的問題。</p>
<p>當終端日誌、原始工具輸出、重複的檔案讀取、冗長的回覆，以及被遺忘的專案歷史都在爭奪注意力時，Claude Code 會話的品質就會下降。在長時間運作的代理程式工作流程中，這些雜訊會變成一個循環：模型失去線程，您增加更多的回合來修正答案，而這些額外的回合會增加更多的雜訊。</p>
<p>這就是<strong>上下文失焦</strong>：模型有足夠的空間容納資訊，但重要的資訊卻被埋藏在低訊號的上下文中。較大的視窗可能會讓這種情況更容易被忽略，因為開發人員不再仔細思考進入提示的內容。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>提示快取示意圖，顯示重複使用的前綴如何仍能跨輪次增加計費上下文</span> </span></p>
<p>提示快取可以降低重複使用前綴的成本，但它不會將上下文視窗變成垃圾抽屜。您仍然需要為新的代幣付費，而且您仍然需要模型來推理正確的資訊。</p>
<p>這篇文章回顧了七個從不同層面攻擊上下文失焦的開放原始碼工具：終端輸出、工具輸出、程式碼庫導覽、檔案閱讀、模型動詞、語意程式碼檢索，以及跨會話記憶。它也解釋了這些想法如何映射到<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>設計、<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性搜尋</a>以及 Milvus 等檢索系統。</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">什麼會造成 Claude Code 上下文失焦？<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 上下文失焦通常來自五種故障模式：太多原始指令文字、嘈雜的工具輸出、重複的代碼庫探索、過長的模型回應，以及跨會話或代理的記憶缺口。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>Claude Code 上下文失焦的五種原因：冗餘指令、雜亂的工具輸出、重複的代碼庫檢索、過長的回應，以及記憶間隙</span> </span></p>
<table>
<thead>
<tr><th>情境失效模式</th><th>在 Claude Code 中是什麼樣子</th><th>有幫助的工具類別</th></tr>
</thead>
<tbody>
<tr><td>終端日誌雜訊</td><td><code translate="no">git</code>,<code translate="no">pytest</code>,<code translate="no">gh</code>, 和雲端 CLI 傾倒的文字比模型需要的還多。</td><td>CLI 輸出壓縮</td></tr>
<tr><td>工具輸出充斥視窗</td><td>測試記錄、DOM 轉儲和 MCP 輸出會以巨型原始區塊的形式進入聊天室。</td><td>工具輸出沙箱</td></tr>
<tr><td>重複的程式碼庫導覽</td><td>Claude 列出目錄、greps、讀取檔案，並在每個階段重複相同的探索。</td><td>程式碼圖形或語意檢索</td></tr>
<tr><td>檔案讀取範圍太廣</td><td>當模型只需要一個符號或摘要時，卻讀取了整個檔案。</td><td>漸進式讀取程式碼</td></tr>
<tr><td>克勞德說得太多</td><td>答案本身為未來的轉彎增加了不必要的上下文。</td><td>回應壓縮</td></tr>
<tr><td>記憶體不持久</td><td>每次開始新的會話時，您都要重新解釋專案的決定。</td><td>Markdown 優先記憶體</td></tr>
</tbody>
</table>
<p>一個好的上下文管理堆疊應該做到三件事：防止垃圾進入、依需求擷取正確的專案知識，以及跨會話保留持久的決策。</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">您應該先使用哪一個 Claude Code 上下文工具？<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>從在您的工作流程中產生最多雜訊的那一層開始。如果您的終端輸出是問題所在，請從 RTK 開始。如果 Claude 一直在大型儲存庫中遊蕩，請從 claude-context 或 code-review-graph 開始。如果您真正的痛苦是每天重新解釋相同的決策，請從 memsearch 開始。</p>
<table>
<thead>
<tr><th>工具</th><th>解決的主要問題</th><th>最適合</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>常見的開發人員指令所產生的嘈雜終端機輸出。</td><td>在 Claude 程式碼內執行許多 CLI 指令的開發人員。</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">上下文模式</a></td><td>大量原始工具輸出進入主要對話。</td><td>大量使用 Playwright、GitHub、日誌或 MCP 工具的使用者。</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>大型 repos 中的盲目程式碼庫探索。</td><td>評論、相依性分析和爆炸半徑問題。</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">代號救星</a></td><td>在符號摘要已足夠的情況下讀取完整檔案。</td><td>大型檔案、重複符號查詢與增量式程式碼閱讀。</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">洞穴人</a></td><td>Claude 自己的動詞回應習慣。</td><td>想要簡潔的輸出和較小的未來上下文的使用者。</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>每次會話都重新探索程式碼庫。</td><td>透過 MCP 進行語意程式碼搜尋。</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>跨會話、代理和模型切換失去專案記憶。</td><td>長期運作的專案，有持久的決策與經驗教訓。</td></tr>
</tbody>
</table>
<p>前五種工具會減少進入或留在上下文中的內容。最後兩個則讓有用的上下文更容易回想。</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK 在 Claude 看到之前壓縮原始指令輸出<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK 是一個 CLI 代理，用來減少開發人員常用指令的符號使用量。它在 GitHub 上的說明指出，它可以將常見開發指令的 LLM 令牌消耗量減少 60-90%，並且以單一 Rust 二進位檔的形式發行。</p>
<p>在日常的 Claude Code 使用中，像<code translate="no">git status</code>,<code translate="no">pytest</code>, 和目錄列表這樣的命令，通常會將完整的環境資訊和狀態描述傾倒到上下文視窗中。模型通常只需要較小的答案：哪個檔案改變了、哪個測試失敗了、PR 在哪裡卡住了，或是目錄中存在哪些關鍵檔案。</p>
<p>RTK 位於 shell 與 Claude 之間。它可以透過 Claude Code 鉤子重寫指令，並傳回經壓縮的輸出。</p>
<p>原始<code translate="no">git status</code> 輸出：</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>實際上重要的東西：</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>與<code translate="no">pytest</code> 的情況相同。原始輸出充滿了經過的案例和環境雜訊：</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>壓縮後，信號是立即的：</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>當您的 context bloat 來自 shell 指令而非程式碼檢索時，RTK 是最簡單的起點。</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">Context Mode 沙盒將巨大的工具輸出置於主聊天室之外<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Context Mode 是專為工具回傳的原始區塊所建立：測試日誌、瀏覽器 DOM 快照、GitHub 有效載荷、MCP 工具輸出和刮除的網頁。其 GitHub 說明強調 AI 編碼代理的情境視窗最佳化，並報告工具輸出減少 98%。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>Context Mode GitHub 儲存庫卡片顯示沙箱工具輸出和上下文優化定位</span> </span></p>
<p>它的方法是將大型工具輸出隔離到本機沙箱和索引中，然後只將摘要和檢索句柄傳入 Claude 會話。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>顯示大型工具輸出經過沙箱執行、SQLite 或 FTS 索引、摘要和檢索結果的上下文模式流程</span> </span></p>
<p>這個流程非常有用，因為編碼代理通常需要失敗的節點、損壞的選擇器或相關的堆疊追蹤，而不是整個 DOM 或每條通過的測試線。Context Mode 可在本機中保留完整輸出，同時避免其支配主要對話。</p>
<p>這與生產<a href="https://zilliz.com/blog/hybrid-search-with-milvus">混合搜尋系統</a>如何將儲存與檢索分開的方式類似。您將原始資料保存在某個耐久的地方，然後只擷取重要的片段。</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph 會在 Claude 瀏覽之前映射程式碼結構<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph 可解決不同的問題：Claude 並不總是需要更多文字，而是需要更好的地圖。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>原始文章中使用的 code-review-graph 標誌圖片</span> </span></p>
<p>在一個大型的儲存庫中，一個簡單的問題就可能觸發昂貴的探索：</p>
<blockquote>
<p>變更這個登入邏輯之後，哪些檔案和測試會受到影響？</p>
</blockquote>
<p>如果沒有 code graph，Claude 的典型動作就是：</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph 會預先建立程式碼庫的結構圖。它使用 Tree-sitter 來解析函數、類別、匯入、呼叫關係、繼承和測試依賴關係，然後將圖寫入 SQLite。</p>
<p>這使得它對程式碼檢閱和爆炸半徑分析非常有用。與其要求 Claude 透過重複讀取重新發現依賴圖形，不如讓它先查詢結構。</p>
<p>這與<a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">語意搜尋</a>相近，但不完全相同。結構圖會回答「什麼依賴於什麼？語義檢索則回答「哪些程式碼在概念上與這個問題有關？在實際的程式碼輔助工作流程中，您通常兩者都需要。</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior 在完整檔案之前提供 Claude 符號摘要<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Token Savior 的核心理念很簡單：預設不傳送完整檔案。先傳送索引或符號摘要，然後在任務需要更多的細節時才擴充。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>Token Savior GitHub 儲存庫卡片顯示其 MCP 伺服器說明和專案統計資料</span> </span></p>
<p>如果您詢問支付 webhook 在哪裡處理，模型通常不需要每個相關檔案的每一行。它首先需要知道某個檔案或符號是否相關。</p>
<p>Token Savior 分層提供代碼服務：</p>
<table>
<thead>
<tr><th>層次</th><th>Claude 接收的內容</th><th>當它展開</th></tr>
</thead>
<tbody>
<tr><td>摘要</td><td>索引、符號名稱及簡短描述。</td><td>預設的第一個回應。</td></tr>
<tr><td>片段</td><td>相關符號周圍較小的程式碼區段。</td><td>摘要可能相關時。</td></tr>
<tr><td>完整檔案</td><td>完整的檔案內容。</td><td>僅在編輯或深入推理需要時。</td></tr>
</tbody>
</table>
<p>這反映開發人員實際閱讀程式碼的方式。您會掃描、確認相關性，然後只在必要時開啟完整檔案。這也類似<a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG 應用程式</a>中使用的漸進式擷取模式：擷取廣泛的內容以確定方向，然後在產生之前縮小上下文的範圍。</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman 可減少 Claude 本身回應的臃腫程度<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>大多數上下文工具都著重於進入模型的內容。Caveman 針對 Claude 輸出的內容。</p>
<p>Caveman 是 Claude Code 的一項技能/插件，可以刪除填充、寒暄、包裝句子、過度解釋和重複結構。其目的不是刪除知識，而是使答案更稠密。</p>
<p>沒有 Caveman：</p>
<blockquote>
<p>您的 React 元件重新渲染的原因可能是...</p>
</blockquote>
<p>使用 Caveman：</p>
<blockquote>
<p>每次渲染都會有新的物件 ref。Inline object prop = new ref = re-render.包裝在 useMemo 中。</p>
</blockquote>
<p>這很重要，因為 Claude 自己的答案會成為未來的上下文。如果每個答案都包含冗長的解釋，下一回合開始時的文字就會超過它所需要的。簡短的答案可以改善下一回合，就像改善當前回合一樣。</p>
<p>對於思考<a href="https://zilliz.com/blog/context-engineering-for-ai-agents">AI 代理情境工程的</a>團隊來說，Caveman 提醒他們輸出政策是情境政策的一部分。</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context 透過 MCP 增加語意程式碼搜尋功能<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context 透過語意檢索解決了重複代碼庫探索的問題。它為資源庫建立索引，將程式碼區塊儲存於向量資料庫中，並透過<a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">模型上下文通訊協定 (Model Context Protocol</a>) 進行搜尋。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>原文中 GitHub 上顯示的 Claude Context 儲存庫趨勢</span> </span></p>
<p>在一個大型的程式碼庫中，您會不斷向 Claude 提出類似的問題：</p>
<blockquote>
<p>幫我找出程式碼中哪些部分可能與這個 bug 有關。</p>
</blockquote>
<p>如果沒有檢索層，Claude 的預設做法往往是：</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context 將工作移到檢索層。它會將儲存庫分塊、產生嵌入、儲存在<a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">Milvus 支援的程式碼索引</a>中，並在模型開始盲讀檔案之前檢索相關的程式碼塊。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>claude-context 流程顯示程式碼庫分塊、內嵌、向量資料庫與混合搜尋、相關程式碼檢索，以及 Claude context injection</span> </span>。</p>
<p>這就是 AI 編碼工具開始看起來像搜尋系統的地方。您需要分塊、內嵌、元資料、詞彙匹配、排序和新鮮度。這些都是<a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">生產 RAG 檢索</a>、<a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">混合檢索路由</a>和<a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">嵌入模型選擇</a>背後的相同建構塊。</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch 跨會話和代理保留有用的記憶體<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch 處理的是問題的反面：不是忘記什麼，而是如何召回重要的東西。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>memsearch 標誌圖片來自原文</span> </span></p>
<p>想像你在星期一告訴 Claude</p>
<blockquote>
<p>我們的 webhook 不能在失敗時重試 - 失敗的事件需要進入死信佇列。</p>
</blockquote>
<p>在星期三，您開啟一個新的會話，並問到： 我們的 webhook 還可以優化什麼？</p>
<blockquote>
<p>我們還能在 webhook 層優化什麼？</p>
</blockquote>
<p>沒有持久記憶體，Claude 就把星期一的決定當作從未發生過。您再解釋一次。</p>
<p>memsearch 將記憶體儲存為本機、人類可讀的 Markdown 檔案，並使用 Milvus 作為可重建的檢索索引。這樣的設計讓人類可以編輯記憶體，同時也讓代理可以搜尋記憶體。</p>
<p>在擷取時，memsearch 使用漸進式擷取：先搜尋，必要時再擴充，然後只有在必要時才深入原始謄本。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>memsearch 循序漸進的檢索流程顯示搜尋、擴充、謄本，然後歸納回到主要會話。</span> </span></p>
<p>這種 Markdown 為先的模式對於跨會話、模型和代理的團隊非常有用。它也能與<a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">長期的 AI 代理程式記憶體</a>、<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">共享的多代理程式記憶體</a>，以及更廣泛的防止<a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">代理程式系統中上下文腐蝕的</a>問題自然地結合。</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">這些工具如何一起運作？<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>這七種工具是相輔相成的，而不是可以互換的。將它們當成層次來使用。</p>
<table>
<thead>
<tr><th>層次</th><th>使用這些工具</th><th>為什麼</th></tr>
</thead>
<tbody>
<tr><td>移除指令雜訊</td><td>RTK</td><td>在大量終端機輸出傳送至 Claude 之前進行壓縮。</td></tr>
<tr><td>沙箱原始工具輸出</td><td>情境模式</td><td>將大型日誌、DOM 和工具有效載荷保留在主要對話之外。</td></tr>
<tr><td>映射程式碼結構</td><td>程式碼檢閱圖</td><td>在不盲目讀取檔案的情況下，回答依賴性和爆破半徑的問題。</td></tr>
<tr><td>逐步讀取程式碼</td><td>代號救星</td><td>從符號摘要開始，然後只在需要時擴充。</td></tr>
<tr><td>壓縮 Claude 的答案</td><td>洞穴人</td><td>防止模型本身的輸出成為未來上下文的臃腫。</td></tr>
<tr><td>擷取相關程式碼</td><td>claude-context</td><td>使用語意與混合程式碼搜尋，取代重複的 grep 環路。</td></tr>
<tr><td>重複使用耐久的決策</td><td>記憶搜尋</td><td>憶起跨會話、代理和模型切換的專案歷史。</td></tr>
</tbody>
</table>
<p>一個實用的推出順序是</p>
<ol>
<li><strong>先消除明顯的雜訊。</strong>如果 shell 輸出和工具有效載荷支配您的上下文，則新增 RTK 或 Context Mode。</li>
<li><strong>修正儲存庫導覽。</strong>新增 code-review-graph 用於結構或 claude-context 用於語意程式碼檢索。</li>
<li><strong>控制剩餘的內容。</strong>使用 Token Savior 與 Caveman 來保持檔案讀取與模型回應的精簡。</li>
<li><strong>保存持久的知識。</strong>當重複解釋成為瓶頸時，使用 memsearch。</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">保持聯繫<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社群</a>，提出問題並與其他開發者比較情境管理模式。</li>
<li>如果您需要協助設計代碼、記憶體或 RAG 工作負載的檢索層，<a href="https://milvus.io/office-hours">請預約免費的 Milvus Office Hours</a>課程。</li>
<li>如果您想跳過基礎架構的設定，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(管理的 Milvus) 提供免費的層級讓您開始使用。</li>
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
    </button></h2><p><strong>我該如何減少 Claude Code 代碼的使用量，同時又不會遺失有用的上下文？</strong></p>
<p>首先壓縮噪音最大的輸入：終端輸出、原始工具有效載荷，以及重複讀取的程式碼。然後加入 claude-context 或 code-review-graph 等擷取工具，讓 Claude 可以擷取相關的程式碼，而不需要從頭開始探索儲存庫。</p>
<p><strong>對於大型的套件庫，我應該使用 claude-context 還是 code-review-graph？</strong></p>
<p>當您需要進行語意程式碼搜尋時，請使用 claude-context，尤其是當您不知道確切的檔案或符號名稱時。當您需要結構性的答案，例如呼叫關係、匯入、測試依賴性和檢閱爆炸半徑時，請使用 code-review-graph。</p>
<p><strong>Claude Code 中的記憶體與程式碼檢索不同嗎？</strong></p>
<p>是的。程式碼檢索會找到相關的專案檔案或符號。記憶體檢索可回復持久的決策、使用者偏好、除錯歷史和跨會話教訓。memsearch 重點在記憶體；laude-context 重點在程式碼檢索。</p>
<p><strong>這些工具是否取代提示快取或較大的上下文視窗？</strong></p>
<p>提示快取和大型上下文視窗有助於容量和成本，但它們無法決定哪些資訊值得注意。上下文管理工具首先會改善進入模型資訊的品質和密度。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/cccm_11zon_848f7f1c6b.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /><span>cccm 11zon</span> </span></p>
