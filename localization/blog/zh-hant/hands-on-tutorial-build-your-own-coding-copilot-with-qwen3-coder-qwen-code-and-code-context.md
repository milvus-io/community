---
id: >-
  hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
title: 實作教學：使用 Qwen3-Coder、Qwen Code 和 Code Context 建立自己的 Coding Copilot
author: Lumina Wang
date: 2025-07-29T00:00:00.000Z
desc: >-
  學習使用 Qwen3-Coder、Qwen Code CLI 以及 Code Context 外掛程式來建立您自己的 AI
  編碼輔助駕駛員，以進行深入的語意程式碼理解。
cover: assets.zilliz.com/_9dfadf5877.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Qwen3 Code, Qwen3, Cursor, Code Context, Code Search'
meta_title: |
  Build a Coding Copilot with Qwen3-Coder & Code Context
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
---
<p>AI 編碼助手的戰場正在迅速升溫。我們已經看到 Anthropic 的<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Claude Code</a>掀起波瀾，Google 的<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Gemini CLI</a>顛覆了終端工作流程，OpenAI 的 Codex 助力 GitHub Copilot，Cursor 贏得了 VS Code 用戶的青睞，<strong>而現在阿里巴巴雲也加入了 Qwen Code。</strong></p>
<p>老實說，這對開發人員來說是個好消息。更多的參與者意味著更好的工具、創新的功能，最重要的是，<strong>開放源碼可以替代</strong>昂貴的專有解決方案。讓我們了解一下這個最新的玩家帶來了什麼。</p>
<h2 id="Meet-Qwen3-Coder-and-Qwen-Code" class="common-anchor-header">認識 Qwen3-Coder 和 Qwen Code<button data-href="#Meet-Qwen3-Coder-and-Qwen-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>阿里巴巴雲最近發布了<a href="https://github.com/QwenLM/Qwen3-Coder"> <strong>Qwen3-Coder</strong></a>，這是一個開源代理編碼模型，在多個基準中取得了最先進的結果。他們還發佈了<a href="https://github.com/QwenLM/qwen-code"> <strong>Qwen Code</strong></a>，這是一個開源的 AI 編碼 CLI 工具，建基於 Gemini CLI，但為 Qwen3-Coder 增強了專門的解析器。</p>
<p>旗艦機種<strong>Qwen3-Coder-480B-A35B-Instruct</strong> 提供令人印象深刻的功能：原生支援 358 種程式語言、256K 記憶體上下文視窗 (可透過 YaRN 擴充至 1M 記憶體)，以及與 Claude Code、Cline 和其他編碼輔助工具的無縫整合。</p>
<h2 id="The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="common-anchor-header">現代人工智能編碼輔助程式的普遍盲點<button data-href="#The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="anchor-icon" translate="no">
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
    </button></h2><p>雖然 Qwen3-Coder 功能強大，但我對它的編碼助手更感興趣：<strong>Qwen Code</strong>。以下是我發現的有趣之處。儘管有這麼多的創新，Qwen Code 與 Claude Code 和 Gemini CLI 有著完全相同的限制：<strong><em>它們很擅長產生新的程式碼，卻很難理解現有的程式碼庫。</em></strong></p>
<p>舉個例子：您要求 Gemini CLI 或 Qwen Code「找出這個專案處理使用者驗證的地方」。工具會開始尋找明顯的關鍵字，例如「login」或「password」，但卻完全遺漏了關鍵的<code translate="no">verifyCredentials()</code> 功能。除非您願意將整個程式碼庫當作上下文來使用，否則這些工具很快就會碰壁。</p>
<p><strong><em>這就是當今 AI 工具的真正缺口：智慧型程式碼上下文理解。</em></strong></p>
<h2 id="Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="common-anchor-header">利用語意程式碼搜尋為任何編碼輔助工具增強功能<button data-href="#Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您能賦予任何 AI 編碼輔助工具（無論是 Claude Code、Gemini CLI 或 Qwen Code）真正以語義理解您的程式碼庫的能力，那會如何？如果您可以為自己的專案建立像 Cursor 這麼強大的功能，而不需要支付高昂的訂閱費用，同時又能完全控制您的程式碼與資料，那該怎麼辦？</p>
<p><a href="https://github.com/zilliztech/code-context"> <strong>Code Context 是一個</strong></a>開放原始碼、與 MCP 相容的外掛程式，可將任何 AI 編碼代理轉換成情境感知的強大功能。這就像是讓您的 AI 助理擁有資深開發人員的機構記憶體，而這些資深開發人員已在您的程式碼庫工作多年。無論您使用的是 Qwen Code、Claude Code、Gemini CLI、VSCode，甚至是 Chrome 瀏覽器，<strong>Code Context</strong>都能為您的工作流程帶來語意程式碼搜尋功能。</p>
<p>準備好看看如何運作了嗎？讓我們使用<strong>Qwen3-Coder + Qwen Code + Code Context</strong> 來建立一個企業級的 AI 編碼輔助系統。</p>
<h2 id="Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="common-anchor-header">上機教學：建立您自己的 AI 編碼輔助系統<button data-href="#Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><p>在我們開始之前，請確保您有</p>
<ul>
<li><p>已安裝<strong>Node.js 20+</strong></p></li>
<li><p><strong>OpenAI API 密鑰</strong><a href="https://openai.com/index/openai-api/">（在此獲得一個）</a></p></li>
<li><p><strong>阿里巴巴雲帳戶</strong>，用於訪問 Qwen3-Coder<a href="https://www.alibabacloud.com/en">(在此處獲得一個</a>)</p></li>
<li><p><strong>Zilliz 雲端帳號</strong>用於向量資料庫<a href="https://cloud.zilliz.com/login">（</a>如果您還沒有，請<a href="https://cloud.zilliz.com/login">在此</a>免費<a href="https://cloud.zilliz.com/login">註冊</a>一個）</p></li>
</ul>
<p><strong>注意事項1)</strong>在本教程中，我們將使用 Qwen3-Coder 的商業版本 Qwen3-Coder-Plus，因為它具有強大的編碼能力和易用性。如果您偏好開放原始碼的選項，您可以使用 qwen3-coder-480b-a35b-instruct。2) 雖然 Qwen3-Coder-Plus 提供了優異的性能和可用性，但它也有很高的代幣消耗。請務必將此因素列入您的企業預算計劃中。</p>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">步驟 1：環境設定</h3><p>驗證您的 Node.js 安裝：</p>
<pre><code translate="no">curl -qL <span class="hljs-attr">https</span>:<span class="hljs-comment">//www.npmjs.com/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Install-Qwen-Code" class="common-anchor-header">步驟 2：安裝 Qwen 程式碼</h3><pre><code translate="no">npm install -g <span class="hljs-meta">@qwen</span>-code/qwen-code
qwen --version
<button class="copy-code-btn"></button></code></pre>
<p>如果您看到如下的版本號，表示安裝成功。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0d5ebc152e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Configure-Qwen-Code" class="common-anchor-header">步驟 3：配置 Qwen Code</h3><p>導覽到您的專案目錄，並初始化 Qwen Code。</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>然後，您會看到如下的頁面。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_e6598ea982.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>API 配置要求：</strong></p>
<ul>
<li><p>API Key：從<a href="https://modelstudio.console.alibabacloud.com/"> 阿里巴巴雲模型工作室</a>獲取</p></li>
<li><p>基本 URL：<code translate="no">https://dashscope.aliyuncs.com/compatible-mode/v1</code></p></li>
<li><p>模型選擇：</p>
<ul>
<li><p><code translate="no">qwen3-coder-plus</code> (商業版本，能力最強)</p></li>
<li><p><code translate="no">qwen3-coder-480b-a35b-instruct</code> (開源版本)</p></li>
</ul></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5ed0c54084.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>配置完成後，按<strong>Enter 繼續</strong>。</p>
<h3 id="Step-4-Test-Basic-Functionality" class="common-anchor-header">步驟 4：測試基本功能</h3><p>讓我們用兩個實際測試來驗證您的設定：</p>
<p><strong>測試 1：了解程式碼</strong></p>
<p>提示："用一句話概括此專案的架構和主要元件。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_41e601fc82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3-Coder-Plus 完美地完成了這個摘要，將這個專案描述為建立在 Milvus 上的技術教程，並將重點放在 RAG 系統、檢索策略等方面。</p>
<p><strong>測試二：代碼產生</strong></p>
<p>提示："請製作一個俄羅斯方塊小遊戲</p>
<p>在一分鐘內，Qwen3-coder-plus：</p>
<ul>
<li><p>自動安裝所需的函式庫</p></li>
<li><p>建構遊戲邏輯</p></li>
<li><p>建立完整、可玩的實作</p></li>
<li><p>處理通常需要花費數小時研究的所有複雜問題</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_c67e1725eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_fd91d5a290.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這展示了真正的自主開發 - 不只是完成程式碼，而是架構決策和完整解決方案的交付。</p>
<h3 id="Step-5-Set-Up-Your-Vector-Database" class="common-anchor-header">步驟 5：設定您的向量資料庫</h3><p>在本教程中，我們將使用<a href="https://zilliz.com/cloud">Zilliz Cloud</a>作為向量資料庫。</p>
<p><strong>建立 Zilliz Cluster：</strong></p>
<ol>
<li><p>登入<a href="https://cloud.zilliz.com/"> Zilliz Cloud 主控台</a></p></li>
<li><p>建立新的叢集</p></li>
<li><p>複製<strong>公共端點</strong>和<strong>令牌</strong></p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_5e692e6e80.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_753f281055.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Configure-Code-Context-Integration" class="common-anchor-header">步驟 6：配置程式碼上下文整合</h3><p>建立<code translate="no">~/.qwen/settings.json</code> ：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;code-context&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;npx&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;@zilliz/code-context-mcp@latest&quot;</span>],
      <span class="hljs-string">&quot;env&quot;</span>: {
        <span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-xxxxxxxxxx&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_ADDRESS&quot;</span>: <span class="hljs-string">&quot;https://in03-xxxx.cloud.zilliz.com&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_TOKEN&quot;</span>: <span class="hljs-string">&quot;4f699xxxxx&quot;</span>
      },
      <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;./server-directory&quot;</span>,
      <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">30000</span>,
      <span class="hljs-string">&quot;trust&quot;</span>: <span class="hljs-literal">false</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Activate-Enhanced-Capabilities" class="common-anchor-header">步驟 7: 啟動增強功能</h3><p>重新啟動 Qwen Code：</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>按<strong>Ctrl + T</strong>在我們的 MCP 伺服器內看到三個新工具：</p>
<ul>
<li><p><code translate="no">index-codebase</code>:為儲存庫的理解建立語意索引</p></li>
<li><p><code translate="no">search-code</code>:自然語言程式碼搜尋</p></li>
<li><p><code translate="no">clear-index</code>:需要時重設索引。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_bebbb44460.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Test-the-Complete-Integration" class="common-anchor-header">步驟八：測試完整的整合</h3><p>這裡有一個真實的例子：在一個大專案中，我們檢閱了程式碼名稱，發現「更寬的視窗」聽起來很不專業，因此我們決定更改它。</p>
<p>提示："找出所有與 'wider window' 相關、需要專業重命名的函式"。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_c54398c4f2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如下圖所示，qwen3-coder-plus 首先呼叫<code translate="no">index_codebase</code> 工具為整個專案建立索引。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_25a7f3a039.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>接著，<code translate="no">index_codebase</code> 工具為這個專案中的 539 個檔案建立索引，將它們分割成 9991 個小塊。建立索引後，它立即呼叫<code translate="no">search_code</code>工具執行查詢。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/13_6766663346.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>接下來，它通知我們找到需要修改的相對應檔案。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/14_7b3c7e9cc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最後，它使用 Code Context 發現了 4 個問題，包括函式、匯入和文件中的一些命名，幫助我們完成這項小任務。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/15_a529905b28.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>有了 Code Context 的加入，<code translate="no">qwen3-coder-plus</code> 現在可以提供更聰明的程式碼搜尋，以及對編碼環境更好的了解。</p>
<h3 id="What-Youve-Built" class="common-anchor-header">您所建立的</h3><p>您現在擁有了一個完整的 AI 編碼輔助系統，它結合了以下功能：</p>
<ul>
<li><p><strong>Qwen3-Coder</strong>: 智慧型代碼產生與自主開發</p></li>
<li><p><strong>Code Context</strong>：現有程式碼庫的語意理解</p></li>
<li><p><strong>通用相容性</strong>：可與 Claude Code、Gemini CLI、VSCode 等相容</p></li>
</ul>
<p>這不僅是更快的開發速度，還能以全新的方式進行傳統現代化、跨團隊協作和架構演進。</p>
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
    </button></h2><p>身為一名開發人員，我已經嘗試過許多 AI 編碼工具 - 從 Claude Code 到 Cursor 和 Gemini CLI，再到 Qwen Code，雖然它們在產生新程式碼方面都很出色，但在理解現有程式碼庫方面通常都不盡如人意。這才是真正的痛點：不是從頭開始寫函式，而是瀏覽複雜、亂七八糟的舊程式碼，並找出<em>為何</em>事情會以某種方式進行。</p>
<p>這就是<strong>Qwen3-Coder + Qwen Code+ Code Context</strong>這個設定如此引人注目的原因。您可以得到兩者的最佳結合：一個能夠產生全功能實作的強大編碼模型<em>，以及</em>一個能夠真正瞭解專案歷史、結構和命名慣例的語意搜尋層。</p>
<p>有了向量搜尋和 MCP 外掛生態系統，您不再需要在提示視窗中貼入隨機檔案，或是捲動您的 repo 來尋找正確的上下文。您只需以簡單的語言提出問題，它就會為您找到相關的檔案、函式或決定，就像有一位記得所有東西的資深開發人員一樣。</p>
<p>說得清楚一點，這種方法不只是更快而已，它實際上改變了您的工作方式。這是朝向新型開發工作流程邁進的一步，在這種流程中，AI 不只是編碼的幫手，而是建築的助手，是瞭解整個專案背景的隊友。</p>
<p><em>說到這......公平警告：Qwen3-Coder-Plus 非常驚人，但也非常飢渴。光是建立這個原型就花掉了 2,000 萬個代幣。所以是的，我現在正式沒有代幣了😅。</em></p>
<p>__</p>
