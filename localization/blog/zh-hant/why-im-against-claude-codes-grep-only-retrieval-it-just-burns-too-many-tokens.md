---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: 為什麼我反對 Claude Code 的 Grep 專用擷取？它消耗了太多的代幣
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  瞭解向量式程式碼檢索如何將 Claude Code token 消耗量減少 40%。可輕鬆整合 MCP 的開放原始碼解決方案。立即試用
  claude-context。
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>AI 編碼輔助程式正瘋狂發展。在過去短短兩年間，Cursor、Claude Code、Gemini CLI 和 Qwen Code 等工具已經從好奇變成數百萬開發人員的日常夥伴。但在這快速崛起的背後，卻隱藏著一場正在醞釀中的爭鬥：<strong>AI 編碼助手究竟應該如何搜尋程式碼的上下文？</strong></p>
<p>目前有兩種方法：</p>
<ul>
<li><p><strong>向量搜尋驅動的 RAG</strong>(語意檢索)。</p></li>
<li><p><strong>使用 grep 的關鍵字搜尋</strong>(字面字串匹配)。</p></li>
</ul>
<p>Claude Code 和 Gemini 選擇了後者。事實上，一位 Claude 工程師在 Hacker News 上公開承認 Claude Code 完全不使用 RAG。相反地，它只是逐行搜尋您的 repo (他們稱之為「代理搜尋」)--沒有語意、沒有結構，只有原始的字串比對。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這個啟示分裂了社群：</p>
<ul>
<li><p><strong>支持者</strong>維護 grep 的簡單性。它快速、精確，而且最重要的是可預測。他們認為，對程式設計而言，精確度就是一切，而現今的嵌入式技術仍太模糊，難以信任。</p></li>
<li><p><strong>批評者</strong>認為 grep 是死胡同。它會讓你淹沒在無關的匹配中、燒毀記號、阻礙你的工作流程。如果沒有對語意的理解，就好像要人工智能蒙著眼睛去除錯一樣。</p></li>
</ul>
<p>雙方都有道理。在建立並測試了我自己的解決方案之後，我可以這麼說：向量式搜尋的 RAG 方法改變了遊戲規則。<strong>它不僅讓搜尋速度大幅提昇，而且更精確，同時也減少了 40% 以上的代幣使用量。(跳至 Claude Context 部分了解我的方法）</strong></p>
<p>那麼為什麼 grep 有這麼大的限制？向量搜尋實際上又如何能提供更好的結果？讓我們來分析一下。</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">Claude Code 的 Grep 專用程式碼搜尋出了什麼問題？<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>我在調試一個棘手的問題時遇到了這個問題。Claude Code 在我的 repo 中啟動了 grep 查詢，將一大堆不相關的文字倒回給我。一分鐘之後，我還是找不到相關的檔案。五分鐘之後，我終於找到了正確的 10 行，但它們被埋藏在 500 行的雜訊中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這不是邊緣案例。瀏覽 Claude Code 在 GitHub 上的問題，可以發現很多受挫的開發人員都遇到了同樣的問題：</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>問題 2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>社群的挫敗感歸結為三個痛點：</p>
<ol>
<li><p><strong>令牌臃腫。</strong>每個 grep dump 都會將大量不相關的程式碼輸入 LLM，導致成本隨著 repo 的大小而大幅增加。</p></li>
<li><p><strong>時間稅。</strong>當 AI 與您的程式碼庫玩二十條問題時，您只能等待，這會扼殺專注力與流程。</p></li>
<li><p><strong>零上下文。</strong>Grep 會匹配字面上的字串。它沒有意義或關係，所以你實際上是在盲目搜尋。</p></li>
</ol>
<p>這就是為什麼這場辯論很重要：Grep 不只是「老派」，它還在積極阻礙 AI 輔助程式設計。</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">克勞德程式碼 vs 游標：為什麼後者有更好的程式碼上下文<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>說到程式碼上下文，Cursor 做得更好。從一開始，Cursor 就著重於程式<strong>碼庫索引</strong>：將您的 repo 分成有意義的區塊，將這些區塊嵌入向量，然後在 AI 需要上下文時，以語義方式擷取這些區塊。這是教科書式的 Retrieval-Augmented Generation (RAG) 應用在程式碼上，結果不言而喻：更緊密的上下文、更少浪費的標記，以及更快速的檢索。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>相比之下，Claude Code 則加倍簡化。沒有索引、沒有嵌入 - 只有 grep。這表示每次搜尋都是字串匹配，完全不了解結構或語意。理論上這是很快的，但實際上，開發人員在找到他們真正需要的那根針之前，往往要在一堆不相關的匹配中篩選。</p>
<table>
<thead>
<tr><th></th><th><strong>克勞德程式碼</strong></th><th><strong>游標</strong></th></tr>
</thead>
<tbody>
<tr><td>搜尋準確度</td><td>只會浮現完全匹配的程式碼，不會遺漏任何名稱不同的程式碼。</td><td>即使關鍵字不完全相同，也能找到語義相關的程式碼。</td></tr>
<tr><td>效率</td><td>Grep 會將大量的程式碼儲存到模型中，導致代幣成本上升。</td><td>較小、訊號較高的程式碼塊可減少 30-40% 的代幣負載。</td></tr>
<tr><td>擴充性</td><td>每次都重新 Grep 儲存庫，隨著專案成長速度會減慢。</td><td>一次索引，然後以最小的延遲進行大規模檢索。</td></tr>
<tr><td>經營理念</td><td>保持最低限度 - 無需額外的基礎架構。</td><td>索引一切，智能檢索。</td></tr>
</tbody>
</table>
<p>那麼為什麼 Claude (或 Gemini 或 Cline) 沒有跟隨 Cursor 的腳步呢？部分原因在於技術，部分原因在於文化。<strong>向量擷取並非小事，您需要解決分塊、增量更新和大規模索引等問題。</strong>但更重要的是，Claude Code 是以極簡主義為基礎：沒有伺服器、沒有索引，只有乾淨的 CLI。嵌入式與向量資料庫並不符合這個設計理念。</p>
<p>這種簡約很吸引人，但也限制了 Claude Code 能提供的功能。Cursor 願意投資在真正的索引基礎架構上，這也是它今天感覺更強大的原因。</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context：為 Claude Code 增加語意程式碼搜尋的開放原始碼專案<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 是一個強大的工具，但它的程式碼上下文卻很差。Cursor 藉由代碼庫索引解決了這個問題，但 Cursor 是封閉源碼、鎖定在訂閱之後，而且對於個人或小型團隊來說價格昂貴。</p>
<p>因此，我們開始建立自己的開放原始碼解決方案：<a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>。</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>是一個開放原始<strong>碼</strong>的 MCP 外掛程式，可為 Claude Code (以及任何其他會說 MCP 的 AI 編碼代理程式) 帶來<strong>語意程式碼搜尋功能</strong>。Claude Context 整合向量資料庫與嵌入模型，讓 LLMs 能從您的整個程式碼庫中獲得<em>深入且具針對性的上下文</em>，而非使用 grep 來強制您的 repo。結果是：更敏銳的檢索、更少的代幣浪費，以及更好的開發人員體驗。</p>
<p>以下是我們的建置過程：</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">我們使用的技術</h3><p><strong>介面層：MCP 作為通用連接器</strong></p>
<p>我們希望它在任何地方都能運作，而不只是 Claude。MCP (Model Context Protocol) 就像是 LLM 的 USB 標準，讓外部工具可以無縫插入。透過將 Claude Context 包裝成 MCP 伺服器，它不僅可以與 Claude Code 搭配使用，也可以與 Gemini CLI、Qwen Code、Cline 甚至 Cursor 搭配使用。</p>
<p><strong>🗄️ 矢量資料庫：Zilliz Cloud</strong></p>
<p>對於骨幹，我們選擇了<a href="https://zilliz.com/cloud">Zilliz Cloud</a>(建構在<a href="https://milvus.io/">Milvus</a> 上的完全管理服務)。它具有高效能、雲原生、彈性的特性，專為編碼庫索引等 AI 工作負載而設計。這意味著低延遲檢索、近乎無限的規模以及堅如磐石的可靠性。</p>
<p><strong>嵌入式模型：設計靈活不同的</strong>團隊有不同的需求，因此 Claude Context 開箱即支援多種嵌入提供者：</p>
<ul>
<li><p><strong>OpenAI 嵌入式</strong>提供穩定性與廣泛採用。</p></li>
<li><p><strong>Voyage 嵌入式</strong>提供專門的程式碼效能。</p></li>
<li><p><strong>Ollama</strong>用於隱私至上的本地部署。</p></li>
</ul>
<p>其他模型可隨著需求的演進而加入。</p>
<p><strong>語言選擇：TypeScript</strong></p>
<p>我們討論過 Python vs. TypeScript。TypeScript 勝出，不只是因為應用程式層級的相容性 (VSCode 外掛程式、Web 工具)，也因為 Claude Code 和 Gemini CLI 本身就是以 TypeScript 為基礎。這使得整合無縫，並保持生態系統的一致性。</p>
<h3 id="System-Architecture" class="common-anchor-header">系統架構</h3><p>Claude Context 採用簡潔的分層設計：</p>
<ul>
<li><p><strong>核心模組</strong>處理繁重的工作：程式碼解析、分塊、索引、擷取與同步。</p></li>
<li><p><strong>使用者介面</strong>則處理整合--CP 伺服器、VSCode 外掛程式或其他適配器。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這種分離方式可讓核心引擎在不同的環境中保持可重複使用，同時讓整合功能隨著新的 AI 編碼輔助工具的出現而快速演進。</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">核心模組實作</h3><p>核心模組是整個系統的基礎。核心模組將向量資料庫、嵌入模型和其他元件抽象成可組合的模組，以建立 Context 物件，讓不同的向量資料庫和嵌入模型適用於不同的情境。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">解決關鍵技術挑戰<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>建立 Claude Context 不只是將嵌入模型和向量資料庫連線。真正的工作來自於解決規模化編碼索引的難題。以下是我們如何解決三大挑戰：</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">挑戰 1：智慧型程式碼分割</h3><p>程式碼不能只按行或字元分割。這會造成雜亂、不完整的片段，並剝離讓程式碼易於理解的邏輯。</p>
<p>我們使用<strong>兩種互補的策略</strong>來解決這個問題：</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">基於 AST 的分塊（主要策略）</h4><p>這是預設的方法，使用樹狀解析器來瞭解程式碼的語法結構，並依據語意邊界進行分割：函式、類別、方法。這可提供</p>
<ul>
<li><p><strong>語法完整性</strong>- 沒有切斷的函數或破碎的宣告。</p></li>
<li><p><strong>邏輯一致性</strong>- 相關的邏輯維持在一起，以獲得更好的語意檢索。</p></li>
<li><p><strong>多語言支援</strong>- 透過樹狀分隔<strong>語法</strong>(tree-sitter grammars)，可在 JS、Python、Java、Go 等<strong>語言間</strong>運作。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">LangChain 文字分割 (備用策略)</h4><p>對於 AST 無法解析或解析失敗的語言，LangChain 的<code translate="no">RecursiveCharacterTextSplitter</code> 提供了可靠的備援。</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>它沒有 AST 那麼「智慧」，但卻非常可靠，可確保開發人員不會陷入困境。這兩種策略結合起來，在豐富的語義與普遍的適用性之間取得平衡。</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">挑戰二：有效處理程式碼變更</h3><p>管理程式碼變更是程式碼索引系統的最大挑戰之一。為了微小的檔案修改而重新索引整個專案是完全不切實際的。</p>
<p>為了解決這個問題，我們建立了以 Merkle Tree 為基礎的同步機制。</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Merkle 樹：變更偵測的基礎</h4><p>Merkle 樹創造了一個分層的「指紋」系統，其中每個檔案都有自己的哈希指紋，資料夾則根據其內容建立指紋，最後整個程式碼都有一個唯一的根節點指紋。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>當檔案內容變更時，切細指紋會逐層向上傳遞到根節點。這樣就能從根節點向下逐層比較雜湊指紋，快速偵測變更，從而快速識別和定位檔案修改，而無需重新編排整個專案的索引。</p>
<p>系統使用簡化的三階段程序，每 5 分鐘執行一次握手同步檢查：</p>
<p><strong>第 1 階段：Lightning-Fast Detection</strong>會計算整個程式碼庫的 Merkle 根切細值，並與上一個快照進行比較。相同的根切細值表示沒有發生任何變更 - 系統會在幾毫秒內跳過所有處理。</p>
<p><strong>第二階段：精確比較會</strong>在根雜湊值不同時觸發，執行詳細的檔案層級分析，以確認哪些檔案被新增、刪除或修改。</p>
<p><strong>第 3 階段：增量更新</strong>僅針對變更的檔案重新計算向量，並據此更新向量資料庫，以達到最高效率。</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">本機快照管理</h4><p>所有同步狀態都會持續存在使用者的<code translate="no">~/.context/merkle/</code> 目錄中。每個程式碼庫都維護自己獨立的快照檔案，其中包含檔案雜湊表及序列化的 Merkle 樹資料，以確保即使在程式重新啟動後仍能恢復精確的狀態。</p>
<p>這種設計的好處顯而易見：當沒有變更時，大多數檢查在幾毫秒內完成，只有真正修改過的檔案才會觸發重新處理 (避免大量的計算浪費)，而且狀態復原可以在程式階段中完美運作。</p>
<p>從使用者體驗的角度來看，修改單一函式只會觸發重新索引該檔案，而非整個專案，大幅提升開發效率。</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">挑戰三：設計 MCP 介面</h3><p>即使是最聰明的索引引擎，如果沒有一個乾淨的開發人員介面，也是毫無用處的。MCP 是顯而易見的選擇，但也帶來了獨特的挑戰：</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>工具設計：保持簡單</strong></h4><p>MCP 模組是面向使用者的介面，因此使用者體驗是重中之重。</p>
<p>工具設計的起點是將標準的程式碼庫索引和搜尋作業抽象為兩個核心工具：<code translate="no">index_codebase</code> 用於索引程式碼庫，<code translate="no">search_code</code> 用於搜尋程式碼。</p>
<p>這帶出了一個重要的問題：還需要哪些額外的工具？</p>
<p>工具的數量需要謹慎的平衡-太多的工具會造成認知上的負擔，混淆 LLM 工具的選擇，而太少的工具又可能會遺漏重要的功能。</p>
<p>從真實世界的使用案例倒推，有助於回答這個問題。</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">解決背景處理挑戰</h4><p>大型程式碼庫可能需要相當長的時間才能建立索引。同步等待完成的天真方法會迫使使用者等待數分鐘，這是完全無法接受的。異步背景處理變得非常重要，但 MCP 本身並不支援此模式。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>我們的 MCP 伺服器在 MCP 伺服器內執行一個背景進程來處理索引，同時立即回傳啟動訊息給使用者，讓他們可以繼續工作。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>這產生了一個新的挑戰：使用者如何追蹤索引的進度？</p>
<p>查詢索引進度或狀態的專用工具可以優雅地解決這個問題。背景索引處理會異步緩存進度資訊，讓使用者可以隨時檢查完成百分比、成功狀態或失敗情況。此外，手動索引清除工具可處理使用者需要重設不準確索引或重新啟動索引程序的情況。</p>
<p><strong>最終工具設計：</strong></p>
<p><code translate="no">index_codebase</code> - 索引程式碼 - 搜尋程式碼 - 查詢索引狀態 - 清除索引<code translate="no">search_code</code><code translate="no">get_indexing_status</code><code translate="no">clear_index</code> </p>
<p>四種工具在簡單性與功能性之間取得完美平衡。</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">環境變數管理</h4><p>儘管環境變數管理對使用者體驗有重大影響，但卻經常被忽略。要求為每個 MCP Client 獨立配置 API 金鑰會迫使使用者在 Claude Code 和 Gemini CLI 之間切換時多次配置憑證。</p>
<p>全局配置方法透過在使用者的主目錄中建立<code translate="no">~/.context/.env</code> 檔案，消除了這種摩擦：</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>此方法的優點顯而易見：</strong>使用者只需設定一次，即可在所有 MCP 用戶端中隨處使用；所有設定都集中在單一位置，方便維護；敏感的 API 金鑰不會分散在多個設定檔中。</p>
<p>我們還實施了三層優先順序架構：流程環境變數具有最高優先順序，全局組態檔案具有中等優先順序，而預設值則作為後備。</p>
<p>這種設計提供了極大的靈活性：開發人員可以使用環境變數進行臨時測試覆寫，生產環境可以透過系統環境變數注入敏感組態以增強安全性，而使用者只需設定一次，即可在 Claude Code、Gemini CLI 及其他工具之間無縫運作。</p>
<p>至此，MCP 伺服器的核心架構已經完成，從程式碼解析、向量儲存到智慧型擷取與組態管理。每個元件都經過精心設計與最佳化，以創造出功能強大且易於使用的系統。</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">實際測試<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context 的實際表現如何？我對它進行了測試，測試的對象正是最初讓我感到沮喪的尋找錯誤的情境。</p>
<p>在啟動 Claude Code 之前，安裝只需要一個指令：</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>當我的程式碼庫建立索引之後，我給 Claude Code 相同的 bug 描述，這之前曾讓 Claude Code 進行了<strong>五分鐘的 grep 追蹤</strong>。這一次，透過<code translate="no">claude-context</code> MCP 呼叫，它<strong>立即精確地找出了檔案和行號</strong>，並完整地解釋了問題。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這不是微妙的差異，而是日以繼夜。</p>
<p>這不僅僅是尋找錯誤。在整合 Claude Context 後，Claude Code 能夠持續產生更高品質的結果：</p>
<ul>
<li><p><strong>問題解決</strong></p></li>
<li><p><strong>程式碼重整</strong></p></li>
<li><p><strong>重複程式碼偵測</strong></p></li>
<li><p><strong>全面測試</strong></p></li>
</ul>
<p>效能提升也顯示在數字上。在並排測試中：</p>
<ul>
<li><p>令牌使用量下降了 40% 以上，而召回率卻沒有任何下降。</p></li>
<li><p>這直接轉化為更低的 API 成本和更快的回應速度。</p></li>
<li><p>另外，在預算相同的情況下，Claude Context 所提供的擷取準確度也高出許多。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們已將 Claude Context 開源於 GitHub，目前已獲得 2.6K+ 顆星星。感謝大家的支持與喜愛。</p>
<p>您可以親自試用：</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm：<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>詳細的基準和測試方法可在 repo- 中找到，我們非常歡迎您的意見。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">展望未來<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 中的 grep 最初只是一種挫折，現在已經發展成一個穩固的解決方案：<a href="https://github.com/zilliztech/claude-context"><strong>Claude Context 是一個</strong></a>開放原始碼的 MCP 外掛，為 Claude Code 和其他編碼輔助工具帶來語意、向量式的搜尋功能。這個訊息很簡單：開發人員不必滿足於低效率的 AI 工具。有了 RAG 和向量檢索，您可以更快速地進行除錯，將代碼成本降低 40%，並終於獲得真正瞭解您程式碼的 AI 協助。</p>
<p>而且這不僅限於 Claude Code。由於 Claude Context 是建構在開放標準之上，因此相同的方法可與 Gemini CLI、Qwen Code、Cursor、Cline 及其他軟體無縫搭配使用。您再也不會被供應商將簡單性置於效能之上的取捨所侷限。</p>
<p>我們希望您能成為未來的一員：</p>
<ul>
<li><p><strong>試用</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a><strong>：</strong>它是開放源碼且完全免費的。</p></li>
<li><p><strong>為其開發貢獻心力</strong></p></li>
<li><p><strong>或</strong>使用 Claude Context<strong>建立您自己的解決方案</strong></p></li>
</ul>
<p>加入我們的<a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord 社群</strong></a>，分享您的意見、提出問題或獲得協助。</p>
