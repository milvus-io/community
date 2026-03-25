---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: 超越 Naive RAG：利用查詢路由和混合檢索建立更聰明的系統
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_new_565494b6a6.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: 瞭解現代 RAG 系統如何使用查詢路由、混合檢索和逐階段評估，以更低的成本提供更好的答案。
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>您的<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>管道會為每個查詢擷取文件，無論是否需要擷取。它對程式碼、自然語言和財務報告執行相同的相似性檢索。當結果不佳時，您無法判斷是哪個階段出了問題。</p>
<p>這些都是幼稚 RAG 的症狀 - 固定的管道以相同的方式處理每個查詢。現代 RAG 系統的運作方式不同。它們會將查詢路由到正確的處理者，結合多種檢索方法，並獨立評估每個階段。</p>
<p>本文將介紹建立更聰明的 RAG 系統的四節點架構，解釋如何在不維護獨立索引的情況下實作<a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">混合式擷取</a>，並說明如何評估每個管道階段，以便您能更快地除錯問題。</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">為何長上下文不能取代 RAG<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>現在模型支援 128K+ 記憶體視窗，「只要把所有東西都放在提示中」是一個常見的建議。這在生產中站不住腳，原因有二。</p>
<p><strong>成本與您的知識庫而非您的查詢成正比。</strong>每個請求都會透過模型傳送完整的知識庫。對於 100K 記憶體的語料庫來說，每次請求就是 100K 輸入記憶體，不論答案需要一段還是十段。每月的推理成本會隨著語料庫大小呈線性成長。</p>
<p><strong>注意力會隨著上下文的長度而降低。</strong>模型難以專注於埋藏在長上下文中的相關資訊。有關「迷失在中間」效應的研究（Liu 等人，2023 年）顯示，模型更有可能遺漏放置在長輸入中間的資訊。更大的上下文視窗並沒有解決這個問題 - 注意力品質並沒有跟上視窗大小的步伐。</p>
<p>RAG 可以避免這兩個問題，因為它只會在生成之前檢索相關的段落。問題不在於是否需要 RAG，而是如何建立真正有效的 RAG。</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">傳統 RAG 有什麼問題？<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>傳統的 RAG 遵循一個固定的管道：嵌入查詢、執行<a href="https://zilliz.com/learn/what-is-vector-search">向量相似性搜尋</a>、取前 K 個結果、產生答案。每個查詢都遵循相同的路徑。</p>
<p>這產生了兩個問題：</p>
<ol>
<li><p><strong>在瑣碎的查詢上浪費運算。</strong>「2+2是什麼？」不需要檢索，但系統還是會執行，增加了延遲和成本，卻沒有任何好處。</p></li>
<li><p><strong>複雜查詢的脆性檢索。</strong>含糊不清的措辭、同義詞或混合語言的查詢通常會使純向量相似性失敗。當檢索遺漏了相關文件時，生成品質就會下降，而且沒有後備方案。</p></li>
</ol>
<p>解決方法：在檢索前加入決策。現代的 RAG 系統會決定<em>是否</em>擷取、搜尋<em>什麼</em>以及<em>如何</em>搜尋，而不是每次都盲目地執行相同的管道。</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">現代 RAG 系統如何運作：四節點架構<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>現代的 RAG 系統不是固定的管道，而是將每項查詢經過四個決策節點。每個節點回答一個關於如何處理目前查詢的問題。</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">節點 1：查詢路由 - 此查詢是否需要檢索？</h3><p>查詢路由是管道中的第一個決策。它會將傳入的查詢分類，並將其傳送到適當的路徑：</p>
<table>
<thead>
<tr><th>查詢類型</th><th>範例</th><th>動作</th></tr>
</thead>
<tbody>
<tr><td>常識/一般知識</td><td>"什麼是 2 + 2？</td><td>直接使用 LLM-skip 檢索回答</td></tr>
<tr><td>知識庫問題</td><td>"Model X 的規格是什麼？</td><td>路由到檢索管道</td></tr>
<tr><td>即時資訊</td><td>「巴黎本週末的天氣」</td><td>呼叫外部 API</td></tr>
</tbody>
</table>
<p>預先路由可避免對不需要的查詢進行不必要的檢索。在大部分查詢都是簡單或一般知識的系統中，光是這一點就能大幅降低運算成本。</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">節點 2：查詢重寫 - 系統應該搜尋什麼？</h3><p>使用者的查詢通常都很含糊。像「LightOn 第三季報告中的主要數字」這樣的問題並不能很好地轉換成搜尋查詢。</p>
<p>查詢重寫可將原始問題轉換為結構化的搜尋條件：</p>
<ul>
<li><strong>時間範圍：</strong>2025 年 7 月 1 日 - 9 月 30 日 (Q3)</li>
<li><strong>文件類型：</strong>財務報告</li>
<li><strong>實體：</strong>LightOn，財務部門</li>
</ul>
<p>這個步驟縮短了使用者如何發問與檢索系統如何索引文件之間的差距。更好的查詢意味著更少的不相關結果。</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">節點 3：檢索策略選擇 - 系統應該如何搜尋？</h3><p>不同的內容類型需要不同的檢索策略。單一方法無法涵蓋所有內容：</p>
<table>
<thead>
<tr><th>內容類型</th><th>最佳檢索方法</th><th>為什麼</th></tr>
</thead>
<tbody>
<tr><td>程式碼 (變數名稱、函式簽章)</td><td>詞彙檢索<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">(BM25</a>)</td><td>精確關鍵字比對對結構化標記效果良好</td></tr>
<tr><td>自然語言 (文件、文章)</td><td>語意搜尋（密集向量）</td><td>可處理同義詞、意譯和意向</td></tr>
<tr><td>多模式（圖表、圖示、圖畫）</td><td>多模式檢索</td><td>捕捉文字萃取所遺漏的視覺結構</td></tr>
</tbody>
</table>
<p>在建立索引時，會為文件加上元資料標記。在查詢時，這些標籤會引導要搜尋哪些文件以及使用哪種檢索方法。</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">節點 4：最小上下文產生 - 模型需要多少上下文？</h3><p>在檢索和<a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">重新排序</a>之後，系統只會傳送最相關的段落給模型，而不是整個文件。</p>
<p>這比聽起來更重要。與完整文件載入相比，只傳送相關段落可以減少 90% 以上的標記使用量。較低的標記數量意味著更快的回應速度和更低的成本，即使在快取的情況下也是如此。</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">為何混合式檢索對企業 RAG 非常重要<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>實際上，大多數團隊都會在擷取策略選擇 (節點 3) 上遇到困難。沒有任何一種檢索方法可以涵蓋所有企業文件類型。</p>
<p>有些人認為關鍵字搜尋已經足夠，畢竟 Claude Code 基於 grep 的程式碼搜尋效果很好。但代碼是高度結構化的，具有一致的命名慣例。企業文件則不同。</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">企業文件雜亂無章</h3><p><strong>同義詞和不同的措辭。</strong>"優化記憶體使用」和「減少記憶體佔用」意義相同，但使用不同的字詞。關鍵字搜尋會匹配其中一個，卻遺漏了另一個。在多語言環境中（中文有分詞、日文有混合文字、德文有複合字），問題會成倍增加。</p>
<p><strong>視覺結構很重要。</strong>工程圖紙取決於版面設計。財務報告依賴於表格。醫學影像取決於空間關係。OCR 可以擷取文字，但會遺失結構。純文字檢索無法可靠地處理這些文件。</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">如何實施混合式檢索</h3><p>混合式檢索結合了多種檢索方法 - 通常是用<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">於關鍵字比對的 BM25 和用於語意檢索的密集向量，以涵</a>蓋兩種方法都無法單獨處理的問題。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>傳統方法會執行兩個獨立的系統：一個用於 BM25，另一個用於向量搜尋。每個查詢都會同時使用這兩個系統，然後將結果合併。這種方法很有效，但也有實際的開銷：</p>
<table>
<thead>
<tr><th></th><th>傳統 (獨立系統)</th><th>統一 (單一集合)</th></tr>
</thead>
<tbody>
<tr><td>儲存</td><td>兩個獨立索引</td><td>一個集合，兩種向量類型</td></tr>
<tr><td>資料同步</td><td>必須保持兩個系統同步</td><td>單一寫入路徑</td></tr>
<tr><td>查詢路徑</td><td>兩個查詢 + 結果合併</td><td>一個 API 呼叫，自動融合</td></tr>
<tr><td>調整</td><td>跨系統調整合併權重</td><td>在一次查詢中變更密集/稀疏權重</td></tr>
<tr><td>操作複雜性</td><td>高</td><td>低</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a>2.6 支援在同一個集合中同時使用密集向量 (用於語意搜尋) 和稀疏向量 (用於 BM25 類型的關鍵字搜尋)。單一 API 呼叫即可傳回融合結果，並可透過改變向量類型之間的權重調整檢索行為。沒有獨立索引、沒有同步問題、沒有合併延遲。</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">如何逐階段評估 RAG 管道<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>僅檢查最終答案是不夠的。RAG 是一個多階段管道，任何階段的失敗都會向下傳播。如果您只測量答案品質，您就無法判斷問題是出在路由、重寫、檢索、重新排序或產生。</p>
<p>當使用者報告「結果不準確」時，根本原因可能在任何地方：路由可能在不該跳過檢索時跳過；查詢重寫可能遺漏關鍵實體；檢索可能遺漏相關文件；重新排序可能掩蓋好的結果；或者模型可能完全忽略檢索的上下文。</p>
<p>使用自己的指標評估每個階段：</p>
<table>
<thead>
<tr><th>階段</th><th>指標</th><th>捕獲內容</th></tr>
</thead>
<tbody>
<tr><td>路由</td><td>F1 得分</td><td>高假陰性率 = 跳過需要檢索的查詢</td></tr>
<tr><td>查詢重寫</td><td>實體萃取精確度、同義詞涵蓋率</td><td>重寫的查詢遺漏重要詞彙或改變意圖</td></tr>
<tr><td>檢索</td><td>Recall@K, NDCG@10</td><td>相關文件未被擷取，或排名太低</td></tr>
<tr><td>重新排序</td><td>精確度@3</td><td>排名最前的結果實際上並不相關</td></tr>
<tr><td>世代</td><td>忠實性、答案完整性</td><td>模型忽略擷取的上下文或提供部分答案</td></tr>
</tbody>
</table>
<p><strong>設定分層監控。</strong>使用離線測試集定義每個階段的基線指標範圍。在生產中，當任何階段低於其基線時，觸發警示。這可讓您及早發現退步，並追蹤到特定階段，而不是靠猜測。</p>
<h2 id="What-to-Build-First" class="common-anchor-header">先建立什麼<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>在實際的 RAG 部署中，有三個優先項目最為突出：</p>
<ol>
<li><p><strong>及早加入路由。</strong>許多查詢根本不需要檢索。事先篩選這些查詢可減少負載，並以最少的工程工作改善回應時間。</p></li>
<li><p><strong>使用統一的混合擷取。</strong>維護獨立的 BM25 和向量搜尋系統，會使儲存成本加倍、造成同步複雜性，並增加合併延遲。Milvus 2.6 之類的統一系統 (密集向量和稀疏向量存放在同一個集合中) 可消除這些問題。</p></li>
<li><p><strong>獨立評估每個階段。</strong>光是端對端的答案品質並不是有用的訊號。每個階段的指標 (路由的 F1、擷取的 Recall@K 和 NDCG) 可讓您更快地除錯，並避免在調整另一個階段時破壞一個階段。</p></li>
</ol>
<p>現代 RAG 系統的真正價值不只是檢索，而是知道<em>何時</em>檢索以及<em>如何</em>檢索。從路由和統一混合搜尋開始，您將擁有可擴充的基礎。</p>
<hr>
<p>如果您正在建立或升級 RAG 系統，並遇到檢索品質問題，我們樂意提供協助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>，提出問題、分享您的架構，並向其他正在處理類似問題的開發人員取經。</li>
<li><a href="https://milvus.io/office-hours">預約 20 分鐘的免費 Milvus Office Hours 課程</a>，以瞭解您的使用案例 - 無論是路由設計、混合檢索設定或多階段評估。</li>
<li>如果您想跳過基礎架構的設定，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(管理的 Milvus) 提供免費的層級來開始使用。</li>
</ul>
<hr>
<p>當團隊開始建立更聰明的 RAG 系統時，經常會遇到的幾個問題：</p>
<p><strong>問：現在模型支援 128K+ 上下文視窗，RAG 是否仍有必要？</strong></p>
<p>是的。當您需要處理單一大型文件時，長上下文視窗會有所幫助，但它們無法取代知識庫查詢的檢索功能。每次請求都傳送整個語料庫會使成本以線性方式增加，而且模型在長上下文中會失去對相關資訊的專注--這個問題已被詳細記錄，稱為「中途迷失」效應 (Liu et al., 2023)。RAG 只擷取相關資訊，讓成本和延遲時間保持可預測。</p>
<p><strong>問：如何結合 BM25 與向量搜尋，而不需要執行兩個獨立的系統？</strong></p>
<p>使用可在同一集合中同時支援密集向量與稀疏向量的向量資料庫。Milvus 2.6 可在每個文件中同時儲存兩種向量類型，並從單一查詢返回融合結果。您可以透過改變權重參數，調整關鍵字與語意匹配之間的平衡--不需要獨立的索引、不需要合併結果、不需要頭痛的同步問題。</p>
<p><strong>問：要改善現有的 RAG 管道，首先要增加什麼？</strong></p>
<p>查詢路由。這是影響最大、費時最少的改進。大多數生產系統都會看到相當比例的查詢根本不需要檢索，例如常識性問題、簡單的計算、常識。將這些查詢直接路由到 LLM 可減少不必要的檢索呼叫，並立即改善回應時間。</p>
<p><strong>問：如何找出 RAG 管道中導致不良結果的階段？</strong></p>
<p>獨立評估每個階段。使用 F1 分數評估路由精確度、Recall@K 和 NDCG@10 評估檢索品質、Precision@3 評估重新排序，以及忠誠度指標評估生成。從離線測試資料中設定基線，並在生產中監控每個階段。當答案品質下降時，您可以追蹤到倒退的特定階段，而不是猜測。</p>
