---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: 利用程式碼上下文建立 Cursor 的開放原始碼替代方案
author: Cheney Zhang
date: 2025-06-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context - 開放原始碼、與 MCP 相容的外掛程式，可為任何 AI 編碼代理程式、Claude Code 與 Gemini
  CLI、VSCode 等 IDE，甚至 Chrome 等環境帶來強大的語意程式碼搜尋功能。
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">人工智能編碼的熱潮及其盲點<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>AI 編碼工具無處不在，而且有其流行的理由。從<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code、Gemini CLI</a>到開放原始碼的 Cursor 替代品，這些代理程式可以撰寫函式、解釋程式碼相依存性，並透過單一提示重構整個檔案。開發人員正爭分奪秒地將它們整合到工作流程中，而且在許多方面，它們都能達到預期的效果。</p>
<p><strong>但是當要<em>了解您的程式碼庫</em>時，大多數的 AI 工具都會碰壁。</strong></p>
<p>請 Claude Code 尋找「此專案在何處處理使用者驗證」，它會回落到<code translate="no">grep -r &quot;auth&quot;</code>- 在註解、變數名稱和檔名中吐出 87 個鬆散的相關配對，很可能遺漏了許多具有驗證邏輯但不稱為「auth」的函式。試試 Gemini CLI，它會尋找「login」或「password」這些關鍵字，但卻完全遺漏了<code translate="no">verifyCredentials()</code> 這類函式。這些工具在產生程式碼方面非常出色，但當需要瀏覽、除錯或探索不熟悉的系統時，它們就會崩潰。除非它們將整個程式碼庫傳送至 LLM 以取得上下文，否則它們很難提供有意義的答案。</p>
<p><em>這就是當今 AI 工具的真正缺口：</em> <strong><em>程式碼上下文。</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursor 成功解決了這個問題，但並非人人適用<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong>正面解決了這個問題。它不使用關鍵字搜尋，而是使用語法樹、向量嵌入和程式碼感應搜尋為您的程式碼建立語意地圖。如果問它「電子郵件驗證邏輯在哪裡？」，它會回覆<code translate="no">isValidEmailFormat()</code> - 不是因為名稱相符，而是因為它了解該程式碼<em>的作用</em>。</p>
<p>雖然 Cursor 功能強大，但未必適合所有人。<strong><em>Cursor 是封閉源碼、雲託管和訂閱型的。</em></strong>這使得處理敏感程式碼的團隊、有安全意識的組織、獨立開發者、學生，以及任何喜歡開放系統的人都無法使用 Cursor。</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">如果您可以建立自己的游標呢？<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>事情是這樣的：Cursor 背後的核心技術並非專利。它是建立在經過驗證的開放原始碼基礎之上 - 像<a href="https://milvus.io/">Milvus</a> 之類的向量資料庫、<a href="https://zilliz.com/ai-models">嵌入模型</a>、使用 Tree-sitter 的語法解析器 - 所有這些都提供給任何願意連結點的人。</p>
<p><em>因此，我們問：</em> <strong><em>如果任何人都能建立自己的 Cursor 會如何？</em></strong>在您的基礎架構上執行。無需訂閱費用。完全可客製化。完全控制您的程式碼與資料。</p>
<p>這就是我們建立<a href="https://github.com/zilliztech/code-context"><strong>Code Context 的</strong></a>原因<a href="https://github.com/zilliztech/code-context"><strong>- 一個</strong></a>開放原始碼、與 MCP 相容的外掛程式，可將強大的語意程式碼搜尋功能帶入任何 AI 編碼代理程式，例如 Claude Code 和 Gemini CLI、VSCode 等 IDE，甚至 Google Chrome 等環境。它還能讓您從頭開始建立自己的編碼代理，例如 Cursor，從而解鎖程式碼庫的即時、智慧型導航。</p>
<p><strong><em>無需訂閱。沒有黑盒。只需根據您的條件進行編碼。</em></strong></p>
<p>在這篇文章的其餘部分，我們將介紹 Code Context 如何運作，以及您如何從今天開始使用它。</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Code Context：Cursor 智慧型程式碼的開放原始碼替代方案<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a>是一個開放原始碼、與 MCP 相容的語意程式碼搜尋引擎。無論您是從頭開始建立自訂的 AI 編碼助理，或是將語義意識加入 Claude Code 和 Gemini CLI 等 AI 編碼代理，Code Context 都是讓一切成為可能的引擎。</p>
<p>它可在本機執行，與您最喜愛的工具和環境 (例如 VS Code 和 Chrome 瀏覽器) 整合，並提供強大的程式碼理解能力，而無需依賴僅在雲端運作的封閉原始碼平台。</p>
<p><strong>核心功能包括</strong></p>
<ul>
<li><p><strong>透過自然語言進行語意程式碼搜尋：</strong>使用純英文搜尋程式碼。搜尋「使用者登入驗證」或「付款處理邏輯」等概念，Code Context 即會找出相關的功能 - 即使這些功能與關鍵字不完全符合。</p></li>
<li><p><strong>多語言支援：</strong>跨 15 種以上的程式語言進行無縫搜尋，包括 JavaScript、Python、Java 和 Go，並對所有語言進行一致的語義理解。</p></li>
<li><p><strong>以 AST 為基礎的程式碼分割：</strong>使用 AST 解析將程式碼自動分割為邏輯單位，例如函式與類別，確保搜尋結果完整、有意義，且不會在功能執行中斷。</p></li>
<li><p><strong>即時、遞增式索引：</strong>程式碼變更會即時編入索引。當您編輯檔案時，搜尋索引會保持更新，不需要手動刷新或重新編制索引。</p></li>
<li><p><strong>完全本機、安全的部署：</strong>在您自己的基礎架構上執行一切。Code Context 透過 Ollama 支援本機模型，並透過<a href="https://milvus.io/">Milvus</a> 支援索引，因此您的程式碼永遠不會離開您的環境。</p></li>
<li><p><strong>一流的 IDE 整合：</strong>VSCode 延伸功能可讓您從編輯器立即搜尋並跳轉至結果，而無須切換上下文。</p></li>
<li><p><strong>MCP 通訊協定支援：</strong>Code Context 會說 MCP，讓您輕鬆與 AI 編碼助手整合，並將語意搜尋直接帶入他們的工作流程。</p></li>
<li><p><strong>瀏覽器外掛支援：</strong>在瀏覽器中直接從 GitHub 搜尋儲存庫 - 無需標籤、無需複製貼上，無論您在何處工作，都能即時取得上下文。</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Code Context 如何運作</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context 採用模組化架構，包含一個核心協調器，以及用於嵌入、解析、儲存和檢索的專門元件。</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">核心模組：Code Context 核心</h3><p>Code Context 的核心是<strong>Code Context Core</strong>，它負責協調程式碼解析、嵌入、儲存和語義檢索：</p>
<ul>
<li><p><strong>文字處理模組 (Text Processing Module</strong>) 使用 Tree-sitter 來分割與解析程式碼，以進行語言感知的 AST 分析。</p></li>
<li><p><strong>嵌入介面 (Embedding Interface</strong>) 支援可插拔的後端 (目前為 OpenAI 與 VoyageAI)，可將程式碼區塊轉換為向量嵌入 (vector embeddings)，以擷取其語意與上下文關係。</p></li>
<li><p><strong>向量資料庫介面會將</strong>這些嵌入資料儲存於自行託管的<a href="https://milvus.io/">Milvus</a>實例 (預設值) 或 Milvus 的管理版本<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 中。</p></li>
</ul>
<p>所有這些都會依計畫與您的檔案系統同步，確保索引保持更新，而不需要手動介入。</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Code Context 核心之上的擴充模組</h3><ul>
<li><p><strong>VSCode 延伸</strong>模組：無縫整合 IDE，可在編輯器內快速進行語意搜尋與跳轉至定義。</p></li>
<li><p><strong>Chrome 擴充</strong>套件：在瀏覽 GitHub 儲存庫時進行內嵌式語意程式碼搜尋，無需切換索引標籤。</p></li>
<li><p><strong>MCP 伺服器</strong>：透過 MCP 通訊協定，將 Code Context 展示給任何 AI 編碼輔助工具，以提供即時、情境感知的協助。</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">開始使用 Code Context<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context 可插入您已使用的編碼工具，或從頭建立自訂的 AI 編碼輔助工具。在本節中，我們將介紹這兩種情況：</p>
<ul>
<li><p>如何將 Code Context 與現有工具整合</p></li>
<li><p>在建立您自己的 AI 編碼助手時，如何設定核心模組以進行獨立的語意程式碼搜尋</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">MCP 整合</h3><p>Code Context 支援<strong>Model Context Protocol (MCP)</strong>，允許像 Claude Code 之類的 AI 編碼代理使用它作為語意後端。</p>
<p>要與 Claude Code 整合：</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>配置完成後，Claude Code 會在需要時自動呼叫 Code Context 進行語意程式碼搜尋。</p>
<p>若要與其他工具或環境整合，請參閱我們的<a href="https://github.com/zilliztech/code-context"> GitHub repo</a>，以取得更多範例和適配器。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">使用 Code Context 建立您自己的 AI 編碼助理</h3><p>若要使用 Code Context 建立自訂的 AI 助理，您只需三個步驟即可設定語意程式碼搜尋的核心模組：</p>
<ol>
<li><p>設定您的嵌入模型</p></li>
<li><p>連接至您的向量資料庫</p></li>
<li><p>索引您的專案並開始搜尋</p></li>
</ol>
<p>以下是使用<strong>OpenAI Embeddings</strong>和<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> <strong>向量資料庫作</strong>為向量後端的範例：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">VSCode 延伸</h3><p>Code Context 可作為 VSCode 擴充套件使用，命名為<strong>「Semantic Code Search」，</strong>可將智慧型、自然語言驅動的程式碼搜尋直接帶入您的編輯器中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>安裝完成後</p>
<ul>
<li><p>配置您的 API 密鑰</p></li>
<li><p>索引您的專案</p></li>
<li><p>使用純英文查詢（無需精確匹配）</p></li>
<li><p>使用點選導覽功能立即跳到結果</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這讓語意探索成為您編碼工作流程的原生部分 - 不需要終端機或瀏覽器。</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Chrome 擴充套件 (即將推出)</h3><p>我們即將推出的<strong>Chrome 擴充</strong>套件將 Code Context 帶入 GitHub 網頁，讓您可以直接在任何公共儲存庫中執行語意程式碼搜尋 - 無須切換上下文或標籤頁。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>您將能夠使用與本機相同的深入搜尋功能來探索陌生的程式碼庫。敬請期待，擴充套件正在開發中，很快就會推出。</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">為什麼要使用 Code Context？<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Code Context</strong>的基本設定可讓您快速運作，但它真正的優勢在於專業、高效能的開發環境。它的進階功能專為支援嚴肅的工作流程而設計，從企業級部署到自訂 AI 工具。</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">企業級安全性的私有部署</h3><p>Code Context 支援完全離線部署，使用<strong>Ollama</strong>本機嵌入模型和<strong>Milvus</strong>作為自託管向量資料庫。這可實現完全隱私的程式碼搜尋管道：無 API 呼叫、無網路傳輸、資料不會離開您的本機環境。</p>
<p>此架構非常適用於有嚴格合規性要求的產業，例如金融、政府及國防，在這些產業中，程式碼的機密性是不容妥協的。</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">智慧型檔案同步即時索引</h3><p>保持程式碼索引更新不應該是緩慢或手動的。Code Context 包含一個<strong>以 Merkle Tree 為基礎的檔案監控系統</strong>，可立即偵測變更，並即時執行增量更新。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>透過只重新索引修改過的檔案，它可將大型儲存庫的更新時間從數分鐘縮短到數秒。這可確保您剛寫完的程式碼已經可以被搜尋到，而不需要按一下「刷新」。</p>
<p>在快節奏的開發環境中，這種即時性是非常重要的。</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">像您一樣理解程式碼的 AST 解析功能</h3><p>傳統的程式碼搜尋工具以行數或字數來分割文字，往往會打破邏輯單位，並傳回令人困惑的結果。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context 做得更好。它利用 Tree-sitter AST 解析來理解實際的程式碼結構。它能識別完整的函式、類別、介面和模組，提供乾淨且語意完整的結果。</p>
<p>它支援主要的程式語言，包括 JavaScript/TypeScript、Python、Java、C/C++、Go 和 Rust，並採用特定語言的策略來進行精確的分塊。對於不支援的語言，它會回歸到基於規則的解析，確保優雅的處理過程，不會發生當機或出現空結果。</p>
<p>這些結構化的程式碼單元也會納入元資料，以進行更精確的語意搜尋。</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">開放原始碼與可擴充設計</h3><p>Code Context 在 MIT 授權下完全開放原始碼。所有核心模組都可在 GitHub 上公開取得。</p>
<p>我們相信開放式基礎架構是建立強大、值得信賴的開發者工具的關鍵，並邀請開發者針對新的模型、語言或用例進行擴充。</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">解決人工智慧助理的情境視窗問題</h3><p>大型語言模型 (LLM) 有一個硬限制：它們的上下文視窗。這限制了他們看到整個程式碼庫，降低了完成、修正和建議的準確性。</p>
<p>Code Context 有助於縮小這一差距。它的語意程式碼搜尋功能可以擷取<em>正確的</em>程式碼片段，讓您的 AI 助理可以根據重點、相關的上下文進行推理。它可讓模型「放大」真正重要的內容，進而改善 AI 所產生的輸出品質。</p>
<p>流行的 AI 編碼工具，例如 Claude Code 和 Gemini CLI，都缺乏原生語意程式碼搜尋功能，只能依賴淺顯、基於關鍵字的啟發式搜尋。Code Context 經由<strong>MCP</strong> 整合後，可讓這些工具大腦升級。</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">由開發人員為開發人員打造</h3><p>Code Context 是為了模組化重複使用而封裝的：每個元件都是以獨立的<strong>npm</strong>套件形式提供。您可以根據專案的需要進行混合、搭配與擴充。</p>
<ul>
<li><p>只需要語意程式碼搜尋？使用<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>想要插入 AI 代理？新增<code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>建立您自己的 IDE/瀏覽器工具？加入我們的 VSCode 與 Chrome 擴充套件範例</p></li>
</ul>
<p>程式碼上下文的一些應用範例：</p>
<ul>
<li><p><strong>情境感知的自動完成外掛程式</strong>，可抽取相關片段以完成更好的 LLM</p></li>
<li><p>收集周遭程式碼以改善修正建議的<strong>智慧型錯誤偵測器</strong></p></li>
<li><p>自動尋找語意相關位置的<strong>安全程式碼重整工具</strong></p></li>
<li><p>從語意程式碼關係建立圖表的<strong>架構可視化工具</strong></p></li>
<li><p><strong>更聰明的程式碼檢閱輔助工具</strong>，可在 PR 檢閱期間顯示歷史實作</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">歡迎加入我們的社群<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a>不只是一個工具，更是一個探索<strong>AI 與向量資料庫</strong>如何合作以真正理解程式碼的平台。隨著 AI 輔助開發逐漸成為常態，我們相信語意程式碼搜尋將會是一項基礎能力。</p>
<p>我們歡迎各種形式的貢獻：</p>
<ul>
<li><p>支援新的語言</p></li>
<li><p>新的嵌入模型後端</p></li>
<li><p>創新的 AI 輔助工作流程</p></li>
<li><p>反饋、錯誤報告與設計構想</p></li>
</ul>
<p>在這裡找到我們</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Code Context on GitHub |</a> <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>MCP npm package</strong></a>|<a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCode marketplace</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a>|<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>|<a href="https://x.com/zilliz_universe">X</a>|<a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>我們可以一起建立下一代 AI 開發工具的基礎架構 - 透明、強大且開發者優先。</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
