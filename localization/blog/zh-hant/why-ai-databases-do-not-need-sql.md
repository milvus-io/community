---
id: why-ai-databases-do-not-need-sql.md
title: 為什麼 AI 資料庫不需要 SQL？
author: James Luan
date: 2025-05-30T00:00:00.000Z
cover: assets.zilliz.com/why_ai_databases_don_t_need_SQL_840620515f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, SQL, AI Agents, LLM'
meta_keywords: 'SQL, AI Databases, vector databases, AI Agents'
meta_title: |
  Why AI Databases Don't Need SQL
desc: 無論您喜歡與否，事實就是如此，SQL 在 AI 時代注定會走向衰落。
origin: 'https://milvus.io/blog/why-ai-databases-do-not-need-sql.md'
---
<p>數十年來，<code translate="no">SELECT * FROM WHERE</code> 一直是資料庫查詢的金科玉律。不論是報表系統、財務分析或使用者行為查詢，我們都已習慣使用結構化語言來精確操作資料。即使是曾經宣稱「反 SQL 革命」的 NoSQL，最終也屈服並推出 SQL 支援，承認其看似不可取代的地位。</p>
<p><em>但您有沒有想過：我們花了 50 多年的時間教電腦說人類的語言，為什麼還要強迫人類說「電腦」呢？</em></p>
<p><strong>無論您喜歡與否，事實是這樣的：SQL 在 AI 時代注定會走向衰落。</strong>它也許還會用在傳統系統中，但對於現代的 AI 應用程式而言，它已經變得越來越不相干。AI 革命不僅改變了我們建立軟體的方式，也讓 SQL 變得過時，而大多數開發人員都忙著優化他們的 JOIN 而沒有注意到這一點。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_ai_databases_don_t_need_SQL_840620515f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Natural-Language-The-New-Interface-for-AI-Databases" class="common-anchor-header">自然語言：AI 資料庫的新介面<button data-href="#Natural-Language-The-New-Interface-for-AI-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>資料庫互動的未來不是學習更好的 SQL，而是<strong>完全放棄語法</strong>。</p>
<p>與其與複雜的 SQL 查詢糾纏不清，想像一下只要說</p>
<p><em>「幫我找到最近購買行為與我們上一季度的頂級客戶最相似的使用者」。</em></p>
<p>系統會了解您的意圖，並自動做出決定：</p>
<ul>
<li><p>它應該查詢結構化的表格，還是執行跨使用者嵌入的向量相似性搜尋？</p></li>
<li><p>是否應該呼叫外部 API 來豐富資料？</p></li>
<li><p>應該如何排序和過濾結果？</p></li>
</ul>
<p>全部自動完成。無需語法。無需除錯。無需在 Stack Overflow 搜尋「如何使用多重 CTE 執行視窗函數」。您不再是資料庫「程式設計員」 - 您正在與智慧型資料系統進行對話。</p>
<p>這不是科幻小說。根據 Gartner 的預測，到 2026 年，大多數企業將以自然語言作為主要的查詢介面，而 SQL 則從「必備」技能變成「可選」技能。</p>
<p>這種轉變已經在發生：</p>
<p><strong>✅ 零語法障礙：</strong>字段名稱、表關係和查詢優化成為系統的問題，而不是您的問題。</p>
<p>✅<strong>非結構化資料友好：</strong>圖像、音訊和文字成為一流的查詢物件</p>
<p><strong>✅ 民主化存取：</strong>營運團隊、產品經理和分析師可以直接查詢資料，就像您的資深工程師一樣容易。</p>
<h2 id="Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="common-anchor-header">自然語言只是表象，AI 代理才是真正的大腦<button data-href="#Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="anchor-icon" translate="no">
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
    </button></h2><p>自然語言查詢只是冰山一角。真正的突破是能夠像人類一樣推理資料的<a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">AI 代理</a>。</p>
<p>理解人類語音是第一步。了解您的需求並有效率地執行，這才是神奇之處。</p>
<p>AI 代理就像資料庫的「大腦」，負責處理資料：</p>
<ul>
<li><p><strong>🤔 意圖理解：</strong>確定您實際需要哪些欄位、資料庫和索引</p></li>
<li><p><strong>⚙️ 策略選擇：</strong>在結構化篩選、向量相似性或混合方法之間進行選擇</p></li>
<li><p><strong>📦 能力協調：</strong>執行 API、觸發服務、協調跨系統查詢</p></li>
<li><p><strong>智能格式化：</strong>傳回您可以立即了解並採取行動的結果</p></li>
</ul>
<p>以下是實際應用的情況。在<a href="https://milvus.io/">Milvus 向量資料庫中，</a>複雜的相似性搜尋變得微不足道：</p>
<pre><code translate="no">results = collection.search(query_vector, top_k=<span class="hljs-number">10</span>, <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;is_active == true&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>一行。沒有 JOIN。無需子查詢。無需效能調整。</strong> <a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>處理語意相似性，而傳統篩選器則處理精確匹配。它更快、更簡單，而且能真正理解您的需求。</p>
<p>這種「API-first」方式自然地與大型語言模型的<a href="https://zilliz.com/blog/function-calling-vs-mcp-vs-a2a-developers-guide-to-ai-agent-protocols">函式呼叫</a>功能整合在一起 - 執行速度更快、錯誤更少、整合更容易。</p>
<h2 id="Why-SQL-Falls-Apart-in-the-AI-Era" class="common-anchor-header">為什麼 SQL 在 AI 時代會分崩離析？<button data-href="#Why-SQL-Falls-Apart-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>SQL 是為結構化世界所設計的。然而，人工智能驅動的未來將以非結構化資料、語義理解和智慧檢索為主，而 SQL 從來就不是為了處理這些問題而設計的。</p>
<p>現代應用程式充斥著大量非結構化資料，包括來自語言模型的文字嵌入、來自電腦視覺系統的影像向量、來自語音辨識的音頻指紋，以及結合文字、影像和元資料的多模態表示。</p>
<p>這些資料無法整齊地排列成行和列，而是以向量嵌入的方式存在於高維語義空間中，而 SQL 完全不知道該如何處理這些資料。</p>
<h3 id="SQL-+-Vector-A-Beautiful-Idea-That-Executes-Poorly" class="common-anchor-header">SQL + 向量：美麗的想法卻執行不力</h3><p>傳統資料庫為了保持其相關性，紛紛在 SQL 中加入向量功能。PostgreSQL 加入了<code translate="no">&lt;-&gt;</code> 運算符，用於向量相似性搜尋：</p>
<pre><code translate="no">SELECT *
  FROM items
 ORDER BY embedding &lt;-&gt; query_vector
 LIMIT 10;
<button class="copy-code-btn"></button></code></pre>
<p>這看起來很聰明，但根本上是有缺陷的。你強迫向量操作通過 SQL 解析器、查詢最佳化器，以及為完全不同的資料模型設計的交易系統。</p>
<p>性能方面的懲罰是非常嚴重的：</p>
<p><strong>真正的基準資料</strong>：在相同條件下，專為 PostgreSQL 與 pgvector 設計的 Milvus 能提供低 60% 的查詢延遲和高 4.5 倍的吞吐量。</p>
<p>為什麼效能會這麼差？傳統資料庫產生不必要的複雜執行路徑：</p>
<ul>
<li><p><strong>解析器開銷</strong>：向量查詢必須通過 SQL 語法驗證</p></li>
<li><p><strong>優化器混亂</strong>：針對關係連接而優化的查詢規劃器，在類似性檢索時很吃力</p></li>
<li><p><strong>儲存效率低</strong>：以 BLOB 儲存的向量需要不斷的編碼/解碼</p></li>
<li><p><strong>索引不匹配</strong>：B樹和LSM結構對於高維相似性搜尋是完全錯誤的</p></li>
</ul>
<h3 id="Relational-vs-AIVector-Databases-Fundamentally-Different-Philosophies" class="common-anchor-header">關聯式資料庫 vs AI/Vector 資料庫：根本不同的理念</h3><p>不相容的程度比效能更深。這些都是完全不同的資料處理方式：</p>
<table>
<thead>
<tr><th><strong>面向</strong></th><th><strong>SQL / 關聯式資料庫</strong></th><th><strong>矢量/AI 資料庫</strong></th></tr>
</thead>
<tbody>
<tr><td>資料模型</td><td>行和列中的結構化欄位（數字、字串</td><td>非結構化資料的高維向量表示（文字、影像、音訊）</td></tr>
<tr><td>查詢邏輯</td><td>精確匹配 + 布林運算</td><td>相似性比對 + 語意搜尋</td></tr>
<tr><td>介面</td><td>SQL 語言</td><td>自然語言 + Python API</td></tr>
<tr><td>理念</td><td>符合 ACID 規範、完美一致性</td><td>優化召回率、語義相關性、即時效能</td></tr>
<tr><td>索引策略</td><td>B+ 樹、散列索引等</td><td>HNSW、IVF、產品量化等。</td></tr>
<tr><td>主要使用個案</td><td>交易、報告、分析</td><td>語意搜尋、多模態搜尋、推薦、RAG 系統、AI 代理</td></tr>
</tbody>
</table>
<p>試著讓 SQL 適用於向量作業，就像把螺絲起子當成榔頭使用一樣，技術上並不是不可能，但您使用了錯誤的工具。</p>
<h2 id="Vector-Databases-Purpose-Built-for-AI" class="common-anchor-header">向量資料庫：專為人工智能打造<button data-href="#Vector-Databases-Purpose-Built-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>和<a href="https://zilliz.com/">Zilliz Cloud</a>等向量資料庫並不是「具有向量功能的 SQL 資料庫」，而是專為 AI 原生應用程式從頭設計的智慧型資料系統。</p>
<h3 id="1-Native-Multimodal-Support" class="common-anchor-header">1.原生多模式支援</h3><p>真正的 AI 應用程式不只是儲存文字，還要處理圖像、音訊、視訊和複雜的巢狀文件。向量資料庫可處理多樣化的資料類型和多向量結構，例如<a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search">ColBERT</a>和<a href="https://zilliz.com/blog/colpali-milvus-redefine-document-retrieval-with-vision-language-models">ColPALI</a>，可適應不同 AI 模型的豐富語意表示。</p>
<h3 id="2-Agent-Friendly-Architecture" class="common-anchor-header">2.代理友好的架構</h3><p>大型語言模型最擅長的是函式呼叫，而非 SQL 產生。向量資料庫提供 Python-first API，可與 AI 代理無縫整合，讓向量擷取、過濾、重新排序和語意強調等複雜作業都能在單一函式呼叫中完成，而不需要查詢語言轉譯層。</p>
<h3 id="3-Semantic-Intelligence-Built-In" class="common-anchor-header">3.內建語意智慧</h3><p>向量資料庫不只是執行指令，<strong>還能理解意圖。</strong>透過與 AI 代理和其他 AI 應用程式合作，矢量資料庫可擺脫字面關鍵字匹配的束縛，達到真正的語意檢索。它們不僅知道「如何查詢」，還知道「您真正想要找到什麼」。</p>
<h3 id="4-Optimized-for-Relevance-Not-Just-Speed" class="common-anchor-header">4.優化相關性，不只是速度</h3><p>與大型語言模型一樣，向量資料庫在效能與召回率之間取得平衡。透過元資料過濾、<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">混合向量與全文</a>檢索，以及重新排序演算法，這些資料庫能持續改善結果品質與相關性，找出真正有價值的內容，而不只是快速檢索。</p>
<h2 id="The-Future-of-Databases-is-Conversational" class="common-anchor-header">資料庫的未來是對話式的<button data-href="#The-Future-of-Databases-is-Conversational" class="anchor-icon" translate="no">
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
    </button></h2><p>矢量資料庫代表著我們思考資料互動方式的根本性轉變。矢量資料庫並非取代關聯式資料庫，而是專為 AI 工作負載而打造，並能在 AI 為先的世界中解決完全不同的問題。</p>
<p>就像大型語言模型並不是傳統規則引擎的升級，而是完全重新定義了人機互動，向量資料庫正在重新定義我們尋找和處理資訊的方式。</p>
<p>我們正在從「寫給機器閱讀的語言」過渡到「理解人類意圖的系統」。資料庫正在從僵化的查詢執行器演進為瞭解上下文並主動浮現洞察力的智慧型資料代理。</p>
<p>現在建立 AI 應用程式的開發人員不想寫 SQL，他們只想描述他們需要的東西，然後讓智慧型系統找出如何取得。</p>
<p>因此，下次當您需要在資料中尋找某些東西時，請嘗試不同的方法。不要寫查詢，直接說您要找什麼。您的資料庫可能會出乎您意料之外地瞭解您的意思。</p>
<p><em>如果它不明白呢？也許是時候升級您的資料庫，而不是您的 SQL 技能了。</em></p>
