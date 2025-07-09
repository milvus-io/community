---
id: claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
title: Claude Code vs Gemini CLI：哪個才是真正的開發副駕駛？
author: Min Yin
date: 2025-07-09T00:00:00.000Z
desc: 比較 Gemini CLI 和 Claude Code 這兩種改變終端工作流程的 AI 編碼工具。您的下一個專案應該使用哪一款？
cover: assets.zilliz.com/Claude_Code_vs_Gemini_CLI_e3a04a49cf.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, Gemini, Claude'
meta_keywords: >-
  Claude Code, Gemini CLI, Natural Language Coding, Vibe Coding, AI Coding
  Assistants
meta_title: |
  Claude Code vs Gemini CLI: Who’s the Real Dev Co-Pilot?
origin: >-
  https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
---
<p>您的 IDE 過於臃腫。您的編碼助手過時。而你還是只能用滑鼠右鍵來重構？歡迎來到 CLI 的文藝復興。</p>
<p>AI 程式碼助手正從噱頭演進為必備工具，開發人員也站在了同一陣線。除了初創公司 Cursor 的轟動之外，<strong>Anthropic 的</strong> <a href="https://www.anthropic.com/claude-code"><strong>Claude Code</strong></a>也帶來了精確度與光澤度。Google 的<a href="https://github.com/google-gemini/gemini-cli"><strong>Gemini CLI</strong></a>？快速、免費，而且渴求上下文。兩者都承諾讓自然語言成為新的 shell scripting。那麼<em>您</em>應該相信哪一個來重構您的下一個 repo 呢？</p>
<p>就我所見，Claude Code 早期領先。但是遊戲規則改變得很快。Gemini CLI 推出後，開發人員蜂擁而至，<strong>在 24 小時內就獲得 15.1k GitHub stars。</strong>截至目前，它已飆升超過<strong>55,000 顆星星</strong>，而且還在持續增加中。太驚人了！</p>
<p>以下是我對為什麼這麼多開發人員對 Gemini CLI 感到興奮的快速解讀：</p>
<ul>
<li><p><strong>它是 Apache 2.0 下的開放原始碼，而且完全免費：</strong>Gemini CLI 可免費連結至 Google 的頂級 Gemini 2.0 Flash 模型。只需使用您的個人 Google 帳戶登入，即可存取 Gemini Code Assist。在預覽期間，您每分鐘最多可得 60 個請求，每天可得 1,000 個請求，全都是免費的。</p></li>
<li><p><strong>它是真正的多任務強器：</strong>除了程式編寫 (它的強項)，它還能處理檔案管理、內容產生、腳本控制，甚至深度研究功能。</p></li>
<li><p><strong>輕量級：</strong>您可以將它無縫嵌入終端腳本中，也可以將它當作獨立的代理使用。</p></li>
<li><p><strong>它提供較長的上下文長度：</strong>擁有 100 萬個上下文標記 (約 750,000 字)，它可以一次過攝取較小專案的整個程式碼庫。</p></li>
</ul>
<h2 id="Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="common-anchor-header">為什麼開發人員會捨棄 IDE 改用 AI 驅動的終端機？<button data-href="#Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="anchor-icon" translate="no">
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
    </button></h2><p>為什麼大家對這些以終端為基礎的工具如此熱衷？身為開發人員，您可能已經感受到這種痛苦：傳統 IDE 的功能令人印象深刻，但其工作流程的複雜性卻扼殺了動力。想要重構單一函數？您需要選取程式碼、按滑鼠右鍵取得上下文功能表、導覽至「重構」、選擇特定的重構類型、在對話方塊中設定選項，最後才套用變更。</p>
<p><strong>終端 AI 工具將所有操作簡化為自然語言指令，改變了這個工作流程。</strong>您只需要說：「<em>幫我重構這個函</em>式<em>，以提高可讀性</em>」，就能看著工具處理整個流程，而不需要記住命令語法。</p>
<p>這不只是方便，而是我們思考方式的根本轉變。複雜的技術操作變成自然語言對話，讓我們可以專注於商業邏輯，而不是工具的機制。</p>
<h2 id="Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="common-anchor-header">Claude 程式碼或 Gemini CLI？明智選擇您的副駕駛<button data-href="#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="anchor-icon" translate="no">
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
    </button></h2><p>由於 Claude Code 也相當受歡迎且易於使用，之前在採用上也佔了優勢，那麼它與新的 Gemini CLI 比較如何？我們應該如何在兩者之間作出選擇？讓我們仔細看看這些 AI 編碼工具。</p>
<h3 id="1-Cost-Free-vs-Paid" class="common-anchor-header"><strong>1.成本：免費 vs 付費</strong></h3><ul>
<li><p><strong>Gemini CLI</strong>使用任何 Google 帳戶都是完全免費的，每天提供 1,000 個請求，每分鐘 60 個請求，無需設定帳單。</p></li>
<li><p><strong>Claude Code</strong>需要使用中的 Anthropic 訂閱，並遵循按使用量付費的模式，但包含企業級的安全性與支援，對商業專案而言非常有價值。</p></li>
</ul>
<h3 id="2-Context-Window-How-Much-Code-Can-It-See" class="common-anchor-header"><strong>2.上下文視窗：它能看到多少程式碼？</strong></h3><ul>
<li><p><strong>Gemini CLI：</strong>100 萬個符記 (約 750,000 字)</p></li>
<li><p><strong>Claude 程式碼：</strong>約 200,000 字元 (約 150,000 字)</p></li>
</ul>
<p>較大的上下文視窗可讓模型在產生回應時參考更多的輸入內容。它們也有助於在多回合對話中維持對話的連貫性，讓模型對您的整個對話有更好的記憶。</p>
<p>基本上，Gemini CLI 可以在單一會話中分析整個中小型專案，因此非常適合理解大型程式碼庫和跨檔案的關係。Claude Code 在您專注於特定檔案或函式時效果更佳。</p>
<h3 id="3-Code-Quality-vs-Speed" class="common-anchor-header"><strong>3.程式碼品質與速度</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>特點</strong></td><td><strong>Gemini CLI</strong></td><td><strong>克勞德程式碼</strong></td><td><strong>注意事項</strong></td></tr>
<tr><td><strong>編碼速度</strong></td><td>8.5/10</td><td>7.2/10</td><td>Gemini 生成程式碼的速度更快</td></tr>
<tr><td><strong>編碼品質</strong></td><td>7.8/10</td><td>9.1/10</td><td>Claude 產生的程式碼品質較高</td></tr>
<tr><td><strong>錯誤處理</strong></td><td>7.5/10</td><td>8.8/10</td><td>Claude 更擅長錯誤處理</td></tr>
<tr><td><strong>上下文理解</strong></td><td>9.2/10</td><td>7.9/10</td><td>Gemini 的記憶體較長</td></tr>
<tr><td><strong>支援多國語言</strong></td><td>8.9/10</td><td>8.5/10</td><td>兩者都很優秀</td></tr>
</tbody>
</table>
<ul>
<li><p><strong>Gemini CLI</strong>生成程式碼的速度更快，而且擅長理解大型上下文，非常適合快速原型開發。</p></li>
<li><p><strong>Claude Code</strong>釘死精確度和錯誤處理，使其更適合程式碼品質非常重要的生產環境。</p></li>
</ul>
<h3 id="4-Platform-Support-Where-Can-You-Run-It" class="common-anchor-header"><strong>4.平台支援：您可以在哪裡執行？</strong></h3><ul>
<li><p><strong>Gemini CLI</strong>從一開始就能在 Windows、macOS 和 Linux 上運作良好。</p></li>
<li><p><strong>Claude Code</strong>首先針對 macOS 進行了最佳化，雖然可在其他平台上執行，但最佳體驗仍在 Mac 上。</p></li>
</ul>
<h3 id="5-Authentication-and-Access" class="common-anchor-header"><strong>5.驗證與存取</strong></h3><p><strong>Claude Code</strong>需要有效的 Anthropic 訂閱（Pro、Max、Team 或 Enterprise），或透過 AWS Bedrock/Vertex AI 進行 API 存取。這表示您需要先設定帳單，才能開始使用。</p>
<p><strong>Gemini CLI</strong>為個別 Google 帳戶持有者提供優厚的免費計劃，包括每天 1,000 次免費請求，以及每分鐘 60 次請求至全功能的 Gemini 2.0 Flash 機型。需要更高限制或特定機型的使用者可透過 API 金鑰升級。</p>
<h3 id="6-Feature-Comparison-Overview" class="common-anchor-header"><strong>6.功能比較概觀</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>功能</strong></td><td><strong>克勞德代碼</strong></td><td><strong>Gemini CLI</strong></td></tr>
<tr><td>上下文視窗長度</td><td>200K 字元</td><td>1M 字元</td></tr>
<tr><td>多模式支援</td><td>有限</td><td>功能強大 (影像、PDF 等)</td></tr>
<tr><td>代碼理解</td><td>優異</td><td>優異</td></tr>
<tr><td>工具整合</td><td>基本</td><td>豐富 (MCP 伺服器)</td></tr>
<tr><td>安全性</td><td>企業級</td><td>標準</td></tr>
<tr><td>免費要求</td><td>限量</td><td>60/分鐘，1000/天</td></tr>
</tbody>
</table>
<h2 id="When-to-Choose-Claude-Code-vs-Gemini-CLI" class="common-anchor-header">何時選擇 Claude Code vs Gemini CLI？<button data-href="#When-to-Choose-Claude-Code-vs-Gemini-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我們已經比較了這兩種工具的主要功能，以下是我對何時選擇兩者的看法：</p>
<p><strong>在下列情況下選擇 Gemini CLI</strong></p>
<ul>
<li><p>成本效益和快速實驗是優先考量</p></li>
<li><p>您正在處理需要大量上下文視窗的大型專案</p></li>
<li><p>您喜歡最先進的開放原始碼工具</p></li>
<li><p>跨平台相容性極為重要</p></li>
<li><p>您需要強大的多模式功能</p></li>
</ul>
<p><strong>如果您有以下需求，請選擇 Claude Code</strong></p>
<ul>
<li><p>您需要高品質的程式碼產生</p></li>
<li><p>您正在建立關鍵任務的商業應用程式</p></li>
<li><p>企業等級的支援是不可或缺的</p></li>
<li><p>程式碼品質勝過成本考量</p></li>
<li><p>您主要在 macOS 上工作</p></li>
</ul>
<h2 id="Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Claude Code 與 Gemini CLI：設定與最佳實務<button data-href="#Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><p>現在我們對這兩種終端 AI 工具的功能有了基本的瞭解，讓我們仔細看看如何開始使用它們以及最佳實務。</p>
<h3 id="Claude-Code-Setup-and-Best-Practices" class="common-anchor-header">Claude Code 設定與最佳實務</h3><p><strong>安裝：</strong>Claude Code 需要 npm 和 Node.js 18 或更高版本。</p>
<pre><code translate="no"><span class="hljs-comment"># Install Claude Code on your system</span>
npm install -g @anthropic-ai/claude-code

<span class="hljs-comment"># Set up API key</span>
claude config <span class="hljs-built_in">set</span> api-key YOUR_API_KEY

<span class="hljs-comment"># Verify installation was successful</span>
claude --version

<span class="hljs-comment"># Launch Claude Code</span>
Claude
<button class="copy-code-btn"></button></code></pre>
<p>****  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c413bbf950.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
****</p>
<p><strong>Claude Code 的最佳實作：</strong></p>
<ol>
<li><strong>從了解架構開始：</strong>當接觸一個新專案時，讓 Claude Code 使用自然語言協助您先瞭解整體架構。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Let Claude analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>要具體，並提供上下文：</strong>您提供的上下文越多，Claude Code 的建議就越準確。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Implement specific features</span>
&gt; Implement an initial version <span class="hljs-keyword">for</span> GitHub issue <span class="hljs-meta">#123</span>

<span class="hljs-meta"># Code migration</span>
&gt; Help me migrate <span class="hljs-keyword">this</span> codebase to the latest Java version, first create a plan

<span class="hljs-meta"># Code refactoring</span>
&gt; Refactor <span class="hljs-keyword">this</span> function to make it more readable <span class="hljs-keyword">and</span> maintainable
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>將它用於除錯和最佳化：</strong></li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Error analysis</span>
&gt; What caused <span class="hljs-keyword">this</span> error? How can we fix it?

<span class="hljs-meta"># Performance optimization</span>
&gt; Analyze the performance bottlenecks <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> code

<span class="hljs-meta"># Code review</span>
&gt; Review <span class="hljs-keyword">this</span> pull request <span class="hljs-keyword">and</span> point <span class="hljs-keyword">out</span> potential issues
<button class="copy-code-btn"></button></code></pre>
<p><strong>總結：</strong></p>
<ul>
<li><p>使用循序漸進的學習方式，從簡單的程式碼解釋開始，然後逐漸轉移到更複雜的程式碼產生任務</p></li>
<li><p>保持會話上下文，因為 Claude Code 會記得先前的討論內容</p></li>
<li><p>使用<code translate="no">bug</code> 指令提供回饋，以報告問題並協助改進工具</p></li>
<li><p>檢閱資料收集政策並小心處理敏感程式碼，以保持安全意識</p></li>
</ul>
<h3 id="Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Gemini CLI 設定與最佳實務</h3><p><strong>安裝：</strong>如同 Claude Code，Gemini CLI 需要 npm 和 Node.js 18 或更高版本。</p>
<pre><code translate="no"><span class="hljs-comment"># Install Gemini CLI</span>
npm install -g @google/gemini-cli

<span class="hljs-comment"># Login to your Google account</span>
gemini auth login

<span class="hljs-comment"># Verify installation</span>
gemini --version

<span class="hljs-comment"># Launch Gemini CLI</span>
Gemini
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_bec1984bb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如果您有個人帳戶，請使用 Google 帳戶登入以立即存取，每分鐘限制 60 個請求。如需更高限制，請設定您的 API 金鑰：</p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GEMINI_API_KEY</span>=<span class="hljs-string">&quot;YOUR_API_KEY&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Gemini CLI 最佳實務：</strong></p>
<ol>
<li><strong>從了解架構開始：</strong>與 Claude Code 一樣，在接觸新專案時，讓 Gemini CLI 使用自然語言協助您先瞭解整體架構。請注意，Gemini CLI 支援 100 萬個 token 上下文視窗，因此對於大規模的程式碼庫分析非常有效。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>利用其多模式功能：</strong>這是 Gemini CLI 真正發光發熱的地方。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Generate app from PDF</span>
&gt; Create a <span class="hljs-keyword">new</span> app based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> PDF design document

<span class="hljs-meta"># Generate code from sketch</span>
&gt; Generate frontend code based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> UI sketch

<span class="hljs-meta"># Image processing tasks</span>
&gt; Convert all images <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> directory to PNG format <span class="hljs-keyword">and</span> rename <span class="hljs-keyword">using</span> EXIF data
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>探索工具整合：</strong>Gemini CLI 可與多種工具及 MCP 伺服器整合，以增強功能。</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Connect external tools</span>
&gt; Use MCP server to connect my <span class="hljs-built_in">local</span> system tools

<span class="hljs-comment"># Media generation</span>
&gt; Use Imagen to generate project logo

<span class="hljs-comment"># Search integration</span>
&gt; Use Google search tool to find related technical documentation
<button class="copy-code-btn"></button></code></pre>
<p><strong>總結：</strong></p>
<ul>
<li><p>以專案為導向：總是從您的專案目錄啟動 Gemini，以獲得更好的上下文理解</p></li>
<li><p>使用圖片、文件和其他媒體作為輸入，而不僅僅是文本，從而最大化多模態功能</p></li>
<li><p>透過連接外部工具與 MCP 伺服器，探索工具整合功能</p></li>
<li><p>使用內建的 Google 搜尋功能取得最新資訊，增強搜尋能力</p></li>
</ul>
<h2 id="AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="common-anchor-header">AI 程式碼一到就過時。如何使用 Milvus 修復它<button data-href="#AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><em>像 Claude Code 和 Gemini CLI 之類的 AI 編碼工具功能強大，但卻有一個盲點：</em> <strong><em>它們不知道什麼是最新的</em></strong><em>。</em></p>
<p><em>現實是什麼？大多數模型直接產生過時的模式。它們是幾個月前，有時甚至是幾年前訓練出來的。因此，儘管它們可以快速產生程式碼，卻無法保證能反映</em> <strong><em>最新的 API</em></strong><em>、架構或 SDK 版本。</em></p>
<p><strong>真實的例子：</strong></p>
<p>詢問 Cursor 如何連接到 Milvus，您可能會得到這個結果：</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>看起來沒問題，只是這個方法已經被廢棄了。建議的方法是使用<code translate="no">MilvusClient</code> ，但大多數助理還不知道。</p>
<p>或者使用 OpenAI 自己的 API。許多工具仍建議透過<code translate="no">openai.ChatCompletion</code> <code translate="no">gpt-3.5-turbo</code> ，這個方法已於 2024 年 3 月廢棄。這種方法速度較慢、成本較高，而且結果較差。但 LLM 並不知道這一點。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_8f0d1a42b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5_3f4c4a0d4c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Fix-Real-Time-Intelligence-with-Milvus-MCP-+-RAG" class="common-anchor-header">解決方案：使用 Milvus MCP + RAG 的即時智慧</h3><p>為了解決這個問題，我們結合了兩個強大的想法：</p>
<ul>
<li><p><strong>模型上下文協定 (MCP)：</strong>代理工具透過自然語言與即時系統互動的標準</p></li>
<li><p><strong>檢索增強世代 (RAG)：</strong>依需求擷取最新、最相關的內容</p></li>
</ul>
<p>兩者結合，讓您的助理更聰明、更及時。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_e6bc6cacd6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>工作原理如下：</strong></p>
<ol>
<li><p>預先處理您的文件、SDK 參考資料和 API 指南</p></li>
<li><p>將它們以向量嵌入的方式儲存在我們的開放原始碼向量資料庫<a href="https://milvus.io/"><strong>Milvus</strong></a> 中。</p></li>
<li><p>當開發人員提出問題時（例如「如何連接到 Milvus？</p>
<ul>
<li><p>執行<strong>語意搜尋</strong></p></li>
<li><p>擷取最相關的文件與範例</p></li>
<li><p>將它們注入到助手的提示上下文中</p></li>
</ul></li>
</ol>
<ol start="4">
<li>結果：<strong>準確</strong>反映<strong>當前真實情況的</strong>程式碼建議</li>
</ol>
<h3 id="Live-Code-Live-Docs" class="common-anchor-header">即時程式碼，即時文件</h3><p>透過<strong>Milvus MCP 伺服器</strong>，您可以將這個流程直接插入您的編碼環境。助理變得更聰明。程式碼變得更好。開發人員保持在流程中。</p>
<p>這並不只是理論上的，我們已經與 Cursor 的 Agent Mode、Context7 和 DeepWiki 等其他設定進行了實戰測試。差異何在？Milvus + MCP 不僅會總結您的專案，還會與專案保持同步。</p>
<p>看看它的實際應用：<a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">為什麼您的 Vibe 程式碼會產生過時的程式碼，以及如何使用 Milvus MCP 修復它。 </a></p>
<h2 id="The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="common-anchor-header">編碼的未來是對話式的，而且現在就在發生<button data-href="#The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>終端 AI 革命才剛剛開始。隨著這些工具的成熟，我們可能會看到與開發工作流程更緊密的整合、更好的程式碼品質，以及透過 MCP+RAG 等方法解決貨幣問題。</p>
<p>無論您是因為 Claude Code 的品質而選擇它，還是因為 Gemini CLI 的易用性和強大功能而選擇它，有一件事是很清楚的：<strong>自然語言程式設計將會持續發展。</strong>問題不在於是否採用這些工具，而是如何將它們有效地整合到您的開發工作流程中。</p>
<p>我們正在見證一個根本性的轉變，從記住語法到與程式碼進行對話。<strong>編碼的未來是會話式的，而且就發生在您的終端機。</strong></p>
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
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">使用 Spring Boot 和 Milvus 建立生產就緒的 AI 助手</a></p></li>
<li><p><a href="https://zilliz.com/blog/introducing-zilliz-mcp-server">Zilliz MCP 伺服器：以自然語言存取向量資料庫 - Zilliz 部落格</a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0：向量資料庫的真實世界基準測試 - Milvus 部落格</a></p></li>
<li><p><a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">為什麼您的 Vibe 編碼會產生過時的程式碼，以及如何使用 Milvus MCP 修復它</a></p></li>
<li><p><a href="https://milvus.io/blog/why-ai-databases-do-not-need-sql.md">為什麼 AI 資料庫不需要 SQL </a></p></li>
</ul>
