---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: 介紹 Milvus 2.6：十億規模的經濟實惠向量搜尋
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: 我們很高興地宣布 Milvus 2.6 現已上市。此版本推出數十項功能，直接解決當今向量搜尋最迫切的挑戰 - 有效擴充，同時控制成本。
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>隨著人工智慧(AI)驅動的搜尋從實驗性專案演進到關鍵任務基礎架構，對<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量資料庫</a>的需求也隨之增加。組織需要處理數以十億計的向量，同時管理基礎架構成本、支援即時資料擷取，以及提供超越基本<a href="https://zilliz.com/learn/vector-similarity-search">相似性搜尋的</a>精密檢索。為了應對這些不斷演進的挑戰，我們一直在努力開發和改進 Milvus。社群的回應非常令人鼓舞，寶貴的回饋有助於塑造我們的方向。</p>
<p>經過幾個月的密集開發，我們很高興地宣布<strong>Milvus 2.6 現已推出</strong>。此版本直接解決當今向量搜尋最迫切的挑戰：<strong><em>有效率地擴充，同時控制成本。</em></strong></p>
<p>Milvus 2.6 在三個關鍵領域提供了突破性的創新：<strong>降低成本、先進的搜尋功能，以及針對大規模規模的架構改進</strong>。結果不言而喻：</p>
<ul>
<li><p>透過 RaBitQ 1 位元量化，<strong>記憶體減少 72%</strong>，同時提供 4 倍的查詢速度</p></li>
<li><p>透過智慧型分層儲存，<strong>可節省 50% 的成本</strong></p></li>
<li><p>透過增強的 BM25 實作，<strong>全文搜尋速度</strong>比 Elasticsearch<strong>快 4 倍</strong></p></li>
<li><p>使用新推出的路徑索引，JSON 篩選<strong>速度提高 100 倍</strong></p></li>
<li><p>透過全新的零磁碟架構，以<strong>更經濟的方式達到搜尋新鮮程度</strong></p></li>
<li><p>以全新的「資料進出」體驗<strong>簡化嵌入工作流程</strong></p></li>
<li><p><strong>單一叢集中最多可容納 100K 個資料集</strong>，以提供面向未來的多租戶服務</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">降低成本的創新：讓向量搜尋變得經濟實惠<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>當向量搜尋擴展至數十億筆記錄時，記憶體消耗是最大的挑戰之一。Milvus 2.6 引入了幾項關鍵優化，可大幅降低基礎架構成本，同時提升效能。</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">RaBitQ 1 位量化：記憶體減少 72%，效能提升 4 倍</h3><p>傳統的量化方法會迫使您以犧牲搜尋品質來換取記憶體的節省。Milvus 2.6 透過<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1 位元量化</a>與智慧型精細化機制，改變了這個現象。</p>
<p>新的 IVF_RABITQ 索引透過 1 位元量化將主索引壓縮為原始大小的 1/32。當與可選的 SQ8 細化機制一起使用時，此方法僅使用原始記憶體佔用量的 1/4 便可維持高搜尋品質 (95% 的回復率)。</p>
<p>我們的初步基準顯示出令人滿意的結果：</p>
<table>
<thead>
<tr><th><strong>效能指標</strong></th><th><strong>傳統 IVF_FLAT</strong></th><th><strong>僅 RaBitQ (1 位元)</strong></th><th><strong>RaBitQ (1 位元) + SQ8 精煉</strong></th></tr>
</thead>
<tbody>
<tr><td>記憶體佔用空間</td><td>100% (基線)</td><td>3% (減少 97%)</td><td>28% (減少 72%)</td></tr>
<tr><td>回復率</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>搜尋吞吐量 (QPS)</td><td>236</td><td>648 (2.7 倍速度)</td><td>946 (快 4 倍)</td></tr>
</tbody>
</table>
<p><em>表：在 AWS m6id.2xlarge 上以 1M 768 維向量進行 VectorDBBench 評估測試</em></p>
<p>這裡真正的突破不只是減少 72% 記憶體，而是在減少記憶體的同時，吞吐量也提升了 4 倍。這表示您可以使用減少 75% 的伺服器來服務相同的工作負載，或是在現有基礎架構上處理多 4 倍的流量，而不會犧牲記憶體。</p>
<p>對於在<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> 上使用完全管理式 Milvus 的企業使用者，我們正在開發一套自動化策略，可根據您特定的工作負載特性和精確度需求，動態調整 RaBitQ 參數。您只需在所有 Zilliz Cloud CU 類型中享受更高的成本效益。</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">熱冷分層儲存：透過智慧型資料放置，降低 50% 的成本</h3><p>現實世界的向量搜尋工作負載包含存取模式大不相同的資料。經常存取的資料需要即時可用性，而歸檔資料則可容忍稍高的延遲，以換取大幅降低的儲存成本。</p>
<p>Milvus 2.6 引入了分層儲存架構，可根據存取模式自動對資料進行分類，並將其放置在適當的儲存層中：</p>
<ul>
<li><p><strong>智慧型資料分類</strong>：Milvus 可根據存取模式自動識別熱（經常存取）與冷（很少存取）資料區段。</p></li>
<li><p><strong>最佳化儲存位置</strong>：熱資料保留在高效能記憶體/SSD，而冷資料移至更經濟的物件儲存空間</p></li>
<li><p><strong>動態資料移動</strong>：隨著使用模式的改變，資料會自動在層級之間遷移</p></li>
<li><p><strong>透明檢索</strong>：當查詢觸及冷資料時，會自動按需載入</p></li>
</ul>
<p>其結果是在維持有效資料查詢效能的同時，降低高達 50% 的儲存成本。</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">其他成本優化</h3><p>Milvus 2.6 還為 HNSW 索引引進 Int8 向量支援、可降低 IOPS 與記憶體需求的最佳化結構 Storage v2 格式，以及更容易直接透過 APT/YUM 套件管理員進行安裝。</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">進階搜尋功能：超越基本向量相似性<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>對於現代 AI 應用程式而言，光是向量搜尋並不夠。使用者需要傳統資訊檢索的精確度，並結合向量嵌入的語意理解。Milvus 2.6 引入了一套先進的搜尋功能，彌補了這方面的不足。</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">Turbocharged BM25：全文搜尋速度比 Elasticsearch 快 400</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">全文</a>檢索已成為向量資料庫中建立混合式檢索系統的必要條件。在 Milvus 2.6 中，以 2.5 版起推出的 BM25 實作為基礎，對全文搜尋的效能進行了顯著的改進。例如，此版本引入了<code translate="no">drop_ratio_search</code> 和<code translate="no">dim_max_score_ratio</code> 等新參數，增強了精確度和速度調整，並提供了更精細的搜尋控制。</p>
<p>我們針對業界標準 BEIR 資料集所做的基準測試顯示，Milvus 2.6 的吞吐量比 Elasticsearch 高出 3-4倍，且召回率相等。對於特定的工作負載，其改善可達到 7 倍的 QPS。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">JSON 路徑索引：篩選速度提升 100 倍</h3><p>Milvus 支援 JSON 資料類型已經很久了，但由於缺乏索引支援，過濾 JSON 欄位的速度很慢。Milvus 2.6 新增 JSON 路徑索引支援，大幅提升效能。</p>
<p>考慮一個使用者檔案資料庫，其中每條記錄都包含嵌套的元資料，例如：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>對於語意搜尋「對 AI 感興趣的使用者」，範圍僅限於舊金山，Milvus 過去需要解析並評估每筆記錄的整個 JSON 物件，使得查詢非常昂貴且緩慢。</p>
<p>現在，Milvus 允許您在 JSON 欄位內的特定路徑上建立索引，以加快搜尋速度：</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>在我們以 100M+ 記錄進行的效能測試中，JSON 路徑索引將篩選延遲從<strong>140 毫秒</strong>(P99: 480 毫秒) 降低到僅<strong>1.5</strong>毫秒 (P99: 10 毫秒)--延遲降低了 99%，使得此類搜尋在生產中變得實用。</p>
<p>此功能對於下列情況特別有價值</p>
<ul>
<li><p>具有複雜使用者屬性篩選功能的推薦系統</p></li>
<li><p>根據元資料篩選文件的 RAG 應用程式</p></li>
<li><p>資料分割非常重要的多租戶系統</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">增強的文字處理與時間感知搜尋</h3><p>Milvus 2.6 引進了全面改良的文字分析管道，具有精密的語言處理功能，包括適用於日文和韓文的 Lindera tokenizer、支援多國語言的 ICU tokenizer，以及具有自訂字典整合功能的增強型 Jieba。</p>
<p><strong>詞組匹配智慧 (Phrase Match Intelligence</strong>) 可捕捉詞序中的語意細微差異，區分「機器學習技術」與「學習機器技術」：</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>時間感知衰減函數 (Time-Aware Decay Functions</strong>) 可根據文件年齡調整相關性評分，自動優先處理新鮮內容，並可設定衰減速率和函數類型 (指數、高斯或線性)。</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">簡化搜尋：資料輸入、資料輸出的體驗</h3><p>原始資料與向量嵌入之間的斷層是使用向量資料庫的開發人員的另一個痛點。在資料到達 Milvus 進行索引和向量搜尋之前，通常會使用外部模型進行預先處理，將原始文字、影像或音訊轉換為向量表示。檢索之後，還需要額外的下游處理，例如將結果 ID 對應回原始內容。</p>
<p>Milvus 2.6 透過全新的<strong>Function</strong>介面簡化了這些嵌入工作流程，可將第三方嵌入模型直接整合至您的搜尋管道。您現在不需要預先計算嵌入，而是可以</p>
<ol>
<li><p><strong>直接插入原始資料</strong>：將文字、圖片或其他內容提交至 Milvus</p></li>
<li><p><strong>設定嵌入提供者</strong>：連接至 OpenAI、AWS Bedrock、Google Vertex AI、Hugging Face 等嵌入式 API 服務。</p></li>
<li><p><strong>使用自然語言查詢</strong>：直接使用原始文字查詢進行搜尋</p></li>
</ol>
<p>這創造了一個「資料進入，資料輸出」的體驗，Milvus 為您簡化所有幕後的向量轉換。</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">架構演進：擴充至數百億向量<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 引入了基本的架構創新，能夠以符合成本效益的方式擴充至數百億向量。</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">以全新的 Woodpecker WAL 取代 Kafka 和 Pulsar</h3><p>之前的 Milvus 部署依賴外部訊息佇列（例如 Kafka 或 Pulsar）作為 Write-Ahead Log (WAL) 系統。儘管這些系統最初運作良好，但卻引入了顯著的作業複雜性和資源開銷。</p>
<p>Milvus 2.6 引入了<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker</strong></a>，這是專為雲端原生設計的 WAL 系統，透過革命性的零磁碟設計消除了這些外部依賴：</p>
<ul>
<li><p><strong>一切都在物件儲存上</strong>：所有日誌資料都持久化在物件儲存中，例如 S3、Google Cloud Storage 或 MinIO。</p></li>
<li><p><strong>分散式元資料</strong>：元資料仍由 etcd 鍵值儲存管理</p></li>
<li><p><strong>不依賴本機磁碟</strong>：消除分散式本機永久狀態所涉及的複雜架構和作業開銷的選擇。</p></li>
</ul>
<p>我們進行了全面的基準測試，比較 Woodpecker 的效能：</p>
<table>
<thead>
<tr><th><strong>系統</strong></th><th><strong>卡夫卡</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>吞吐量</td><td>129.96 MB/秒</td><td>107 MB/秒</td><td>71 MB/s</td><td>450 MB/秒</td><td>750 MB/秒</td></tr>
<tr><td>延遲時間</td><td>58 毫秒</td><td>35 毫秒</td><td>184 毫秒</td><td>1.8 毫秒</td><td>166 毫秒</td></tr>
</tbody>
</table>
<p>Woodpecker 每個儲存後端都持續達到理論最大吞吐量的 60-80%，本機檔案系統模式達到 450 MB/s，比 Kafka 快 5.5 倍；S3 模式達到 750 MB/s，比 Kafka 高 5.8 倍。</p>
<p>有關 Woodpecker 的詳細資訊，請參閱此部落格：<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">以經濟的方式實現搜尋新鮮</h3><p>關鍵任務搜尋通常要求新擷取的資料可立即搜尋。Milvus 2.6 取代了訊息佇列的依賴性，從根本上改善了新鮮更新的處理方式，以更低的資源開銷提供搜尋新鮮度。新架構增加了新的<strong>Streaming Node</strong>，這是一個專用元件，可與其他 Milvus 元件 (如 Query Node 和 Data Node) 密切協同運作。Streaming Node 建立在 Woodpecker 之上，Woodpecker 是我們的輕量級、雲原生 Write-Ahead Log (WAL) 系統。</p>
<p>這個新元件可實現以下功能</p>
<ul>
<li><p><strong>極佳的相容性</strong>：可與新的 Woodpecker WAL 搭配使用，並向後相容於 Kafka、Pulsar 及其他串流平台。</p></li>
<li><p><strong>增量索引</strong>：新資料可立即搜尋，無批次延遲</p></li>
<li><p><strong>連續查詢服務</strong>：同時進行高吞吐量擷取和低延遲查詢</p></li>
</ul>
<p>透過將串流與批次處理隔離，串流節點可協助 Milvus 即使在大量資料擷取時，也能維持穩定的效能與新鮮度。它的設計考慮到了水平擴展性，可根據資料吞吐量動態調整節點容量。</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">增強的多租戶能力：每個群集可擴充至 10 萬個集合</h3><p>企業部署通常需要租戶層級的隔離。Milvus 2.6 大幅增加了多租戶支援，每個群集最多可支援<strong>100,000 個集合</strong>。對於運行單一大型集群、服務許多租戶的企業來說，這是一項重要的改進。</p>
<p>這項改進是由於在元資料管理、資源分配和查詢規劃方面進行了大量工程優化而實現的。Milvus 使用者現在即使擁有數萬個資料集，也能享有穩定的效能。</p>
<h3 id="Other-Improvements" class="common-anchor-header">其他改進</h3><p>Milvus 2.6 提供更多架構上的改進，例如 CDC + BulkInsert 可簡化跨地理區域的資料複製，Coord Merge 可在大規模部署中改善集群協調。</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">開始使用 Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 是一項龐大的工程，由 Zilliz 工程師和我們出色的社群貢獻者共同開發，包含數十項新功能和效能最佳化。雖然我們已在此涵蓋了主要的功能，但還有更多的功能等著我們去發現。我們強烈建議您深入閱讀我們全面的<a href="https://milvus.io/docs/release_notes.md">發行說明</a>，探索此版本所提供的一切！</p>
<p>完整的文件、遷移指南和教學可在<a href="https://milvus.io/"> Milvus 網站上</a>找到。若有任何問題與社群支援，請加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。</p>
