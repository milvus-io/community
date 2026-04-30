---
id: claude-context-reduce-claude-code-token-usage.md
title: Claude Context：使用 Milvus 驅動的代碼擷取功能，減少 Claude 代碼令牌的使用量
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  Claude Code 在 grep 上燒代號？看看 Claude Context 如何使用 Milvus 支援的混合檢索，將 token 使用量減少
  39.4%。
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>大型上下文視窗讓 AI 編碼代理感覺無限，直到他們開始為了回答一個問題而閱讀您半個儲存庫為止。對許多 Claude Code 使用者而言，最昂貴的部分不只是模型推理。而是擷取的循環：搜尋關鍵字、讀取檔案、再次搜尋、讀取更多檔案，不斷為不相關的上下文付費。</p>
<p>Claude Context 是一個開放原始碼檢索 MCP 伺服器，提供 Claude Code 及其他 AI 編碼代理一個更好的方式來尋找相關程式碼。它會為您的儲存庫建立索引，將可搜尋的程式碼區塊儲存於<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫中</a>，並採用<a href="https://zilliz.com/blog/hybrid-search-with-milvus">混合式檢索</a>方式，讓程式代理可以取得實際需要的程式碼，而不是用 grep 結果來淹沒提示。</p>
<p>在我們的基準測試中，Claude Context 在保持檢索品質的同時，平均減少了 39.4% 的代幣消耗，並減少了 36.1% 的工具呼叫。這篇文章將解釋為什麼 grep 式的檢索會浪費上下文、Claude Context 在引擎蓋下的運作方式，以及它與基準工作流程在實際除錯任務上的比較。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>Claude Context GitHub 儲存庫的趨勢和超過 10,000 顆星星</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">為什麼 grep 式的程式碼檢索會燒掉 AI 編碼代理的代幣？<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>AI 編碼代理只有在瞭解任務周遭的程式碼庫：函式呼叫路徑、命名慣例、相關測試、資料模型和歷史實作模式後，才能寫出有用的程式碼。龐大的上下文視窗有助於解決問題，但卻無法解決擷取問題。如果錯誤的檔案進入上下文，模型仍會浪費代幣，並可能從不相干的程式碼推理。</p>
<p>程式碼檢索通常分為兩大模式：</p>
<table>
<thead>
<tr><th>擷取模式</th><th>如何運作</th><th>故障所在</th></tr>
</thead>
<tbody>
<tr><td>Grep 式擷取</td><td>搜尋字面字串，然後讀取匹配的檔案或行範圍。</td><td>遺漏語意相關的程式碼、傳回雜訊匹配，而且經常需要重複搜尋/讀取循環。</td></tr>
<tr><td>RAG 式檢索</td><td>預先索引程式碼，然後以語意、詞彙或混合搜尋方式擷取相關的區塊。</td><td>需要大部分編碼工具不想直接擁有的分塊、嵌入、索引和更新邏輯。</td></tr>
</tbody>
</table>
<p>這與開發人員在<a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG 應用程式</a>設計中所看到的區別相同：字面匹配是有用的，但當意思很重要時，字面匹配很少足夠。一個名為<code translate="no">compute_final_cost()</code> 的函式可能與關於<code translate="no">calculate_total_price()</code> 的查詢有關，即使確切的字詞並不相符。這就是<a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">語意搜尋的</a>幫助所在。</p>
<p>在一次除錯執行中，Claude Code 反覆搜尋並讀取檔案，才找到正確的區域。幾分鐘之後，它消耗的程式碼中只有一小部分是相關的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>Claude Code 的 grep 式搜尋花時間在讀取不相關的檔案上</span> </span></p>
<p>這種模式很常見，開發人員也曾公開抱怨：代理程式可以很聰明，但上下文擷取迴圈仍讓人覺得昂貴且不精確。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>開發人員對於 Claude Code 上下文與標記使用的評論</span> </span></p>
<p>Grep 式的擷取失敗有三種可預見的方式：</p>
<ul>
<li><strong>資訊超載：</strong>大型資料庫會產生許多字面上的匹配，而且大部分對目前的任務都沒有用。</li>
<li><strong>語意盲點：</strong>grep 匹配的是字串，而不是意圖、行為或相當的實作模式。</li>
<li><strong>上下文遺失：</strong>行層級的匹配不會自動包含周遭的類別、相依性、測試或呼叫圖。</li>
</ul>
<p>更好的程式碼檢索層需要結合關鍵字精確度與語意理解，然後傳回足夠完整的片段，讓模型可以推理程式碼。</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">什麼是 Claude Context？<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context 是用於程式碼檢索的開放原始碼<a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Model Context Protocol</a>伺服器。它將 AI 編碼工具連接到 Milvus 支援的程式碼索引，因此代理程式可以依據意義來搜尋儲存庫，而非僅依賴文字搜尋。</p>
<p>目標很簡單：當代理詢問上下文時，回傳最小的有用程式碼區塊集。Claude Context 透過解析程式碼庫、產生嵌入、在<a href="https://zilliz.com/what-is-milvus">Milvus 向量資料庫中</a>儲存區塊，並透過與 MCP 相容的工具公開檢索來達成這個目標。</p>
<table>
<thead>
<tr><th>Grep 問題</th><th>Claude Context 方法</th></tr>
</thead>
<tbody>
<tr><td>太多不相關的匹配</td><td>依向量相似度和關鍵字相關性排列程式碼區塊</td></tr>
<tr><td>沒有語意理解</td><td>使用<a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">嵌入模型</a>，即使名稱不同，也能匹配相關的實作。</td></tr>
<tr><td>遺失周遭上下文</td><td>傳回具有足夠結構的完整程式碼區塊，以便模型推理行為。</td></tr>
<tr><td>重複讀取檔案</td><td>先搜尋索引，然後只讀取或編輯重要的檔案。</td></tr>
</tbody>
</table>
<p>由於 Claude Context 是透過 MCP 暴露，因此它可以與 Claude Code、Gemini CLI、Cursor 式 MCP 主機，以及其他 MCP 相容的環境一起運作。相同的核心檢索層可支援多種代理介面。</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Claude Context 在引擎蓋下如何運作<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context 有兩個主要層：可重複使用的核心模組和整合模組。核心處理解析、分塊、索引、搜尋和增量同步。上層則透過 MCP 和編輯器整合來展現這些功能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>Claude Context 架構顯示 MCP 整合、核心模組、嵌入提供者和向量資料庫</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">MCP 如何將 Claude Context 連接到編碼代理？</h3><p>MCP 提供 LLM 主機與外部工具之間的介面。透過將 Claude Context 暴露為 MCP 伺服器，可使檢索層獨立於任何一個 IDE 或編碼助手。代理程式會呼叫搜尋工具；Claude Context 會處理程式碼索引，並傳回相關區塊。</p>
<p>如果您想要瞭解更廣泛的模式，<a href="https://milvus.io/docs/milvus_and_mcp.md">MCP + Milvus 指南會</a>說明 MCP 如何將 AI 工具連結至向量資料庫作業。</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">為什麼使用 Milvus 進行程式碼檢索？</h3><p>程式碼檢索需要快速的向量搜尋、元資料過濾，以及足夠的規模來處理大型資料庫。Milvus 專為高效能向量搜尋而設計，可支援密集向量、稀疏向量和重排工作流程。對於建立重檢索代理系統的團隊而言，<a href="https://milvus.io/docs/multi-vector-search.md">多向量混合搜尋</a>文件和<a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">PyMilvus hybrid_search API</a>顯示了生產系統所使用的相同底層檢索模式。</p>
<p>Claude Context 可以使用 Zilliz Cloud 作為受管理的 Milvus 後端，這可以避免自己執行與擴充向量資料庫。相同的架構也可適用於自我管理的 Milvus 部署。</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Claude Context 支援哪些嵌入供應商？</h3><p>Claude Context 支援多種嵌入選項：</p>
<table>
<thead>
<tr><th>提供者</th><th>最適合</th></tr>
</thead>
<tbody>
<tr><td>OpenAI 嵌入式</td><td>具有廣泛生態系統支援的通用託管嵌入式元件。</td></tr>
<tr><td>Voyage AI 嵌入式</td><td>以編碼為導向的檢索，尤其是在搜尋品質很重要的時候。</td></tr>
<tr><td>Ollama</td><td>適用於隱私敏感環境的局部嵌入工作流程。</td></tr>
</tbody>
</table>
<p>相關的 Milvus 工作流程，請參閱<a href="https://milvus.io/docs/embeddings.md">Milvus 嵌入概述</a>、<a href="https://milvus.io/docs/embed-with-openai.md">OpenAI 嵌入整合</a>、<a href="https://milvus.io/docs/embed-with-voyage.md">Voyage 嵌入整合</a>，以及<a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">使用 Milvus</a> 執行<a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Ollama 的</a>範例。</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">為什麼核心函式庫使用 TypeScript 寫成？</h3><p>Claude Context 採用 TypeScript 撰寫，是因為許多編碼代理整合、編輯器外掛和 MCP 主機已經是 TypeScript 的重度使用者。將擷取核心保留在 TypeScript 中，可以讓它更容易與應用程式層的工具整合，同時仍能呈現簡潔的 API。</p>
<p>核心模組將向量資料庫和嵌入提供者抽象成一個可組合的<code translate="no">Context</code> 物件：</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Claude Context 如何分割程式碼並保持索引新鮮<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>分塊和增量更新決定了程式碼檢索系統在實際中是否可用。如果分塊太小，模型就會失去上下文。如果分塊過大，檢索系統會返回雜訊。如果索引太慢，開發人員就會停止使用。</p>
<p>Claude Context 使用基於 AST 的分塊、後備文字分割器和基於 Merkle 樹的變更偵測來處理這些問題。</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">基於 AST 的程式碼分塊如何保留上下文？</h3><p>AST 分塊是主要策略。Claude Context 不會以行數或字元數分割檔案，而是會分析程式碼結構，並依據語意單位 (例如函式、類別和方法) 來分塊。</p>
<p>這讓每個分塊擁有三個有用的屬性：</p>
<table>
<thead>
<tr><th>屬性</th><th>為何重要</th></tr>
</thead>
<tbody>
<tr><td>語法完整性</td><td>函數和類別不會中間被分割。</td></tr>
<tr><td>邏輯一致性</td><td>相關的邏輯保持在一起，因此擷取的片段對於模型來說更容易使用。</td></tr>
<tr><td>多語言支援</td><td>不同的樹狀分隔解析器可處理 JavaScript、Python、Java、Go 及其他語言。</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>基於 AST 的程式碼分块可保留完整的語法單位和分塊結果</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">AST 解析失敗時會發生什麼？</h3><p>對於 AST 解析無法處理的語言或檔案，Claude Context 會退回到 LangChain 的<code translate="no">RecursiveCharacterTextSplitter</code> 。它的精確度不如 AST 分塊，但可以防止索引在不支援的輸入上失敗。</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Claude Context 如何避免對整個資源庫重新建立索引？</h3><p>在每次變更之後重新編制整個儲存庫的索引成本太高。Claude Context 使用 Merkle 樹來檢測確切的變更。</p>
<p>Merkle 樹會為每個檔案指定一個哈希值，從每個目錄的子目錄得出哈希值，然後將整個儲存庫捲入一個根哈希值。如果根切細值沒變，Claude Context 就可以跳過索引。如果根切細值變更，它會沿著樹狀結構向下搜尋已變更的檔案，並只重新納入這些檔案。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>Merkle 樹狀變更偵測比較未變和已變的檔案哈希值</span> </span></p>
<p>同步分三個階段執行：</p>
<table>
<thead>
<tr><th>階段</th><th>發生何事</th><th>為什麼有效率</th></tr>
</thead>
<tbody>
<tr><td>快速檢查</td><td>比較目前的 Merkle 根與上次的快照。</td><td>如果沒有任何改變，則快速完成檢查。</td></tr>
<tr><td>精確差異</td><td>在樹狀結構中移動，以識別新增、刪除和修改的檔案。</td><td>只有已變更的路徑才會向前移動。</td></tr>
<tr><td>遞增更新</td><td>重新計算已變更檔案的內嵌，並更新 Milvus。</td><td>向量索引保持新鮮，無需完全重建。</td></tr>
</tbody>
</table>
<p>本地同步狀態會儲存在<code translate="no">~/.context/merkle/</code> 下，因此 Claude Context 可以在重新啟動後還原檔案哈希表和序列化的 Merkle 樹。</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">Claude Code 使用 Claude Context 時會發生什麼事？<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>設定是啟動 Claude Code 前的單一指令：</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>在索引儲存庫之後，當 Claude Code 需要 codebase context 時，它可以呼叫 Claude Context。在相同的錯誤尋找情境中，之前在 grep 和檔案讀取上耗費時間，Claude Context 找到了精確的檔案和行號，並提供完整的解釋。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Claude Context 示範顯示 Claude Code 找到相關的 bug 位置</span> </span></p>
<p>該工具不僅限於尋找錯誤。它也有助於重構、重複代碼偵測、問題解決、測試產生，以及任何代理需要精確儲存庫上下文的任務。</p>
<p>在同等的回復率下，Claude Context 在我們的基準中減少了 39.4% 的代幣消耗，並減少了 36.1% 的工具呼叫。這一點很重要，因為工具呼叫和不相關的檔案讀取往往是編碼代理工作流程的主要成本。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>基準圖表顯示 Claude Context 相較於基準線減少了代幣使用量和工具呼叫</span> </span>。</p>
<p>該專案目前在 GitHub 上有超過 10,000 顆星星，儲存庫包含完整的基準細節和套件連結。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>Claude Context GitHub 星級歷史顯示快速成長</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Claude Context 在真實 bug 上與 grep 比較如何？<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>該基準比較純文字搜尋與 Milvus 支援的程式碼檢索在實際除錯任務上的表現。兩者的差異不只是字元數較少而已。Claude Context 會改變代理程式的搜尋路徑：它會從更接近需要變更的實作開始。</p>
<table>
<thead>
<tr><th>案例</th><th>基線行為</th><th>Claude Context 行為</th><th>減少代號</th></tr>
</thead>
<tbody>
<tr><td>Django<code translate="no">YearLookup</code> bug</td><td>搜尋錯誤的相關符號並編輯註冊邏輯。</td><td>直接找到<code translate="no">YearLookup</code> 優化邏輯。</td><td>減少了 93% 的代號</td></tr>
<tr><td>Xarray<code translate="no">swap_dims()</code> bug</td><td>閱讀提及<code translate="no">swap_dims</code> 附近的零散檔案。</td><td>更直接地找到實作與相關測試。</td><td>減少 62% 的字串</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">案例 1：Django YearLookup 錯誤</h3><p><strong>問題描述：</strong>在 Django 框架中，<code translate="no">YearLookup</code> 查詢最佳化破壞了<code translate="no">__iso_year</code> 過濾。當使用<code translate="no">__iso_year</code> 過濾器時，<code translate="no">YearLookup</code> 類會錯誤地套用標準的 BETWEEN 最佳化 - 對日曆年份有效，但對 ISO 週數年份無效。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>基準 (grep)：</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>文字搜尋集中於<code translate="no">ExtractIsoYear</code> 註冊，而非<code translate="no">YearLookup</code> 中的最佳化邏輯。</p>
<p><strong>Claude 上下文：</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>語意搜尋理解<code translate="no">YearLookup</code> 為核心概念，並直接進入正確的類別。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Django YearLookup 基準表顯示使用 Claude Context 後減少了 93% 的字詞串</span> </span></p>
<p><strong>結果：</strong>字塊減少 93%。</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">案例 2：Xarray swap_dims bug</h3><p><strong>問題描述：</strong>Xarray 函式庫的<code translate="no">.swap_dims()</code> 方法意外地變更原始物件，違反了不變的預期。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>基線 (grep)：</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>基線花了時間瀏覽目錄和閱讀附近的程式碼，然後才找到實際的實作路徑。</p>
<p><strong>Claude Context：</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>語意搜尋能更快找到相關的<code translate="no">swap_dims()</code> 實作與相關上下文。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Xarray swap_dims 基準表顯示使用 Claude Context 後減少了 62% 的文字詞組</span> </span></p>
<p><strong>結果：</strong>字串減少 62%。</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">開始使用 Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您想要嘗試這篇文章中的確切工具，請從<a href="https://github.com/zilliztech/claude-context">Claude Context GitHub 套件庫</a>和<a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">Claude Context MCP 套件</a>開始。該套件庫包含設定說明、基準和核心 TypeScript 套件。</p>
<p>如果您想要瞭解或自訂檢索層，這些資源是有用的下一步：</p>
<ul>
<li>使用<a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a> 學習向量資料庫基本知識。</li>
<li>如果您想要結合 BM25 風格的搜尋與密集向量，請探索<a href="https://milvus.io/docs/full-text-search.md">Milvus</a> <a href="https://milvus.io/docs/full_text_search_with_milvus.md">全文檢索</a>與<a href="https://milvus.io/docs/full_text_search_with_milvus.md">LangChain 全文檢索教學</a>。</li>
<li>如果您要比較基礎架構選項，請檢閱<a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">開放原始碼向量搜尋引擎</a>。</li>
<li>如果您想要在<a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Claude Code</a>工作流程中直接進行向量資料庫操作，請嘗試 Claude Code 的<a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Plugin</a>。</li>
</ul>
<p>如需 Milvus 或代碼檢索架構的協助，請加入<a href="https://milvus.io/community/">Milvus 社群</a>或預約<a href="https://milvus.io/office-hours">Milvus Office Hours</a>以取得一對一的指導。如果您想跳過基礎架構的設定，請<a href="https://cloud.zilliz.com/signup">註冊 Zilliz Cloud</a>或<a href="https://cloud.zilliz.com/login">登入 Zilliz Cloud</a>並使用受管理的 Milvus 作為後端。</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">為什麼 Claude Code 在某些編碼任務上使用這麼多的代碼？</h3><p>當任務需要在大型儲存庫中重複搜尋和讀取檔案循環時，Claude Code 可以使用很多代碼。如果代理按關鍵字搜尋、讀取不相干的檔案，然後再搜尋一次，那麼即使代碼對任務沒有用，每讀取一個檔案都會增加代碼。</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">Claude Context 如何減少 Claude Code 原始碼的使用量？</h3><p>Claude Context 在代理程式讀取檔案之前，會先搜尋 Milvus 支援的程式碼索引，以減少代碼使用量。它以混合搜尋的方式擷取相關的程式碼區塊，因此 Claude Code 可以檢查較少的檔案，並將更多的上下文視窗花在真正重要的程式碼上。</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Claude Context 是否僅適用於 Claude 程式碼？</h3><p>不是。Claude Context 是以 MCP 伺服器的形式呈現，因此它可以與任何支援 MCP 的編碼工具搭配使用。Claude Code 是這篇文章的主要範例，但相同的檢索層也可以支援其他 MCP 相容的 IDE 和代理工作流程。</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">我需要 Zilliz Cloud 才能使用 Claude Context 嗎？</h3><p>Claude Context 可以使用 Zilliz Cloud 作為受管理的 Milvus 後端，如果您不想操作向量資料庫基礎架構，這是最簡單的路徑。相同的檢索架構基於 Milvus 概念，因此團隊也可以將其調整至自我管理的 Milvus 部署。</p>
