---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: 基準會說謊 - 向量 DB 應該接受真正的測試
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: 利用 VDBBench 發掘向量資料庫的效能差距。我們的工具可在真實的生產情境下進行測試，確保您的 AI 應用程式能順暢運作，不會發生意料之外的停機時間。
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">您根據基準選擇的向量資料庫可能會在生產中失敗<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>為您的 AI 應用程式選擇<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量資料庫時</a>，傳統的基準就像是在空曠的跑道上試駕跑車，卻發現它在交通尖峰時刻停滯不前。令人不安的事實是什麼？大多數的基準只會評估人工條件下的效能，而生產環境中從未出現這種情況。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>大多數基準都是<strong>在</strong>所有資料都已被擷取、索引也已完全建立之<strong>後</strong>，才測試向量資料庫。但在生產環境中，資料從未停止流動。您不可能為了重建索引而暫停系統幾個小時。</p>
<p>我們已經親眼目睹了這種脫節。舉例來說，Elasticsearch 可能標榜毫秒級的查詢速度，但在幕後，我們看見它光是優化索引就花了<strong>超過 20 小時</strong>。這是任何生產系統都無法負擔的停機時間，尤其是在需要持續更新和即時回應的 AI 工作負載中。</p>
<p>在 Milvus，我們與企業客戶進行了無數次概念驗證 (PoC) 評估後，發現了一個令人不安的模式：<strong>在受控實驗室環境中表現優異的向量資料庫，在實際生產負載下卻往往舉步維艱。</strong>這個重要的缺口不僅讓基礎架構工程師感到沮喪，也可能讓建立在這些誤導性效能承諾上的整個 AI 計畫脫軌。</p>
<p>這就是我們建立<a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a> 的原因：一個開放源碼基準，從一開始就是為了模擬實際生產環境而設計。與挑選情境的合成測試不同，VDBBench 透過持續的擷取、嚴格的過濾條件以及多樣化的情境來推動資料庫，就像您的實際生產工作負載一樣。我們的任務很簡單：提供工程師一個工具，顯示向量資料庫在真實世界條件下的實際表現，讓您可以根據可信的數據做出基礎架構決策。</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">基準與現實之間的差距<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>傳統的基準測試方法有三大缺點，使得其結果對於生產決策幾乎毫無意義：</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1.過時的資料</h3><p>許多基準仍依賴於 SIFT 或<a href="https://zilliz.com/glossary/glove"> GloVe</a> 等過時的資料集，這些資料集與今日人工智能模型所產生的複雜、高維向量嵌入幾乎沒有相似之處。請考慮這一點：SIFT 包含 128 維向量，而 OpenAI 的嵌入模型所產生的流行嵌入則從 768 維到 3072 維不等。</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2.虛榮指標</h3><p>許多基準只著重於平均延遲或峰值 QPS，這會造成扭曲的畫面。這些理想化的指標無法捕捉實際使用者在生產環境中經歷的異常值和不一致情況。例如，如果需要無限的計算資源，會讓您的組織破產，那麼令人印象深刻的 QPS 數字又有什麼用呢？</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3.過度簡化的情境</h3><p>大多數基準只測試基本、靜態的工作負載，基本上就是向量搜尋的「Hello World」。例如，它們只會在整個資料集被擷取和編入索引後才發出搜尋要求，而忽略了使用者在新資料流入時進行搜尋的動態現實。這種簡單化的設計忽略了定義實際生產系統的複雜模式，例如並發查詢、篩選搜尋和連續資料擷取。</p>
<p>認識到這些缺點後，我們意識到業界需要<strong>徹底改變基準測試的理念--</strong>以 AI 系統在實際應用中的行為為基礎。這就是我們建立<a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a> 的原因。</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">從實驗室到生產：VDBBench 如何縮短差距<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench 並不只是迭代過時的基準測試哲學，而是以一項指導信念，從第一原則開始重建<strong>基準</strong>測試概念：<strong>基準測試只有在預測實際生產行為時才有價值</strong>。</p>
<p>我們設計的 VDBBench 能在資料真實性、工作負載模式和效能測量這三個關鍵層面忠實複製真實世界的情況。</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">資料集現代化</h3><p>我們徹底改變了 vectorDB 基準測試所使用的資料集。VDBBench 不再使用 SIFT 和 GloVe 等傳統測試集，而是使用最先進的嵌入模型產生的向量，這些嵌入模型為當今的 AI 應用程式提供了動力。</p>
<p>為了確保相關性，特別是對於像 Retrieval-Augmented Generation (RAG) 之類的使用個案，我們選擇了能反映真實企業世界和特定領域情境的語料庫。這些範圍從一般用途的知識庫到垂直應用程式，例如生物醫學問題解答和大型網路搜尋。</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>語料庫</strong></td><td><strong>嵌入模型</strong></td><td><strong>尺寸</strong></td><td><strong>大小</strong></td></tr>
<tr><td>維基百科</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1m / 10m / 138m</td></tr>
</tbody>
</table>
<p>表：VDBBench 使用的資料集</p>
<p>VDBBench 也支援自訂資料集，讓您可以針對特定工作負載，使用從特定嵌入模型產生的自有資料進行基準測試。畢竟，沒有任何資料集比您自己的生產資料更能說明問題。</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">以生產為重點的指標設計</h3><p><strong>VDBBench 優先採用能反映實際效能的指標，而不僅僅是實驗室結果。</strong>我們圍繞生產環境中實際重要的因素重新設計基準：負載下的可靠性、尾端延遲、持續吞吐量和精確度。</p>
<ul>
<li><p><strong>P95/P99 延遲來衡量真實的使用者體驗</strong>：平均/中間延遲掩蓋了讓真實使用者感到沮喪的異常值。這就是為什麼 VDBBench 著重於 P95/P99 等尾端延遲，揭示 95% 或 99% 的查詢實際會達到的效能。</p></li>
<li><p><strong>負載下的可持續吞吐量：</strong>5 秒內表現良好的系統在生產過程中並不適用。VDBBench 會逐漸增加並發量，以找出資料庫每秒的最大持續查詢量 (<code translate="no">max_qps</code>)，而非短時間理想狀況下的峰值。這可顯示您的系統在長時間內的穩定性。</p></li>
<li><p><strong>調用與效能的平衡：</strong>沒有精確度的速度是沒有意義的。VDBBench 中的每個效能數字都與召回率搭配，因此您可以確切知道為了吞吐量，您需要犧牲多少相關性。這樣就能在內部取舍大不相同的系統之間進行公平、對等的比較。</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">反映現實的測試方法</h3><p>VDBBench 設計中的一項關鍵創新是<strong>分離串行和並行測試</strong>，這有助於捕捉系統在不同類型負載下的行為。舉例來說，延遲指標的分法如下：</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> 測量最小負載下的系統效能，一次只處理一個請求。這代表延遲的<em>最佳情況</em>。</p></li>
<li><p><code translate="no">conc_latency_p99</code> 捕捉<em>現實、高並發情況</em>下的系統行為，即多個要求同時到達。</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">兩個基準階段</h3><p>VDBBench 將測試分成兩個重要階段：</p>
<ol>
<li><strong>序列測試</strong></li>
</ol>
<p>這是單一程序執行 1,000 次查詢。此階段會建立理想效能與精確度的基線，同時報告<code translate="no">serial_latency_p99</code> 與回復率。</p>
<ol start="2">
<li><strong>並發測試</strong></li>
</ol>
<p>此階段模擬持續負載下的生產環境。</p>
<ul>
<li><p><strong>真實的用戶端模擬</strong>：每個測試程序都以自己的連線和查詢集獨立運作。這可以避免共享狀態 (例如快取) 干擾，以免結果失真。</p></li>
<li><p><strong>同步啟動</strong>：所有程序同時開始，以確保測量的 QPS 準確反映所聲稱的並發等級。</p></li>
</ul>
<p>這些結構嚴謹的方法可確保 VDBBench 所報告的<code translate="no">max_qps</code> 和<code translate="no">conc_latency_p99</code> 值既<strong>精確又與生產相關</strong>，為生產容量規劃和系統設計提供有意義的啟示。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：Milvus-16c64g-standalone 在不同併發等級下的 QPS 與延遲 (Cohere 1M 測試)。在此測試中，Milvus 一開始未被充分利用，直到</em> <strong><em>並發等級 20</em></strong><em>，增加並發可提高系統利用率，並帶來更高的 QPS。超過</em> <strong><em>並發</em></strong><em>等級</em> <strong><em>20</em></strong><em> 後</em><em>，系統達到滿載：進一步增加並發等級不再能改善吞吐量，而且延遲會因為佇列延遲而上升。</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">超越搜尋靜態資料：真正的生產情境<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>就我們所知，VDBBench 是唯一的基準工具，可在完整的生產關鍵情境中測試向量資料庫，包括靜態收集、過濾和串流情境。</p>
<h3 id="Static-Collection" class="common-anchor-header">靜態收集</h3><p>VDBBench 與其他急於進行測試的基準不同，VDBBench 會先確保每個資料庫已完全最佳化其索引 - 這是許多基準經常忽略的關鍵生產先決條件。如此一來，您就能得到完整的資料：</p>
<ul>
<li><p>資料擷取時間</p></li>
<li><p>索引時間（用於建立最佳化索引的時間，這會大幅影響搜尋效能）</p></li>
<li><p>在串行和並行條件下，完全最佳化索引的搜尋效能</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">篩選</h3><p>生產中的向量搜尋很少是單獨發生的。實際應用程式會結合向量相似性與元資料篩選 (「尋找與這張照片相似但價格低於 100 美元的鞋子」)。這種篩選向量搜尋造成了獨特的挑戰：</p>
<ul>
<li><p><strong>篩選複雜性</strong>：更多的標量列和邏輯條件增加了計算需求</p></li>
<li><p><strong>篩選的選擇性</strong>：<a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">我們的生產經驗</a>顯示，這是隱藏的效能殺手 - 查詢速度可能會因為篩選器的選擇性而出現幾個數量級的波動。</p></li>
</ul>
<p>VDBBench 有系統地評估不同選擇性等級 (50% 到 99.9%) 的篩選器效能，提供資料庫如何處理此關鍵生產模式的全面概況。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：Milvus 與 OpenSearch 在不同篩選級別下的 QPS 與 Recall (Cohere 1M 測試)。X 軸代表過濾資料的百分比。如圖所示，Milvus 在所有過濾選擇性層級中都能維持穩定的高召回率，而 OpenSearch 則表現不穩定，在不同過濾條件下召回率有明顯的波動。</em></p>
<h3 id="Streaming" class="common-anchor-header">串流</h3><p>生產系統很少享有靜態資料。在執行搜尋的同時，新資訊會不斷流入，許多令人印象深刻的資料庫就是在這種情況下崩潰的。</p>
<p>VDBBench 獨特的串流測試案例可檢查在輸入資料時進行搜尋的效能，並可測量下列各項：</p>
<ol>
<li><p><strong>資料量成長的影響</strong>：搜尋效能如何隨著資料大小的增加而調整。</p></li>
<li><p><strong>寫入負載的影響</strong>：並發寫入如何影響搜尋延遲和吞吐量，因為寫入也會消耗系統中的 CPU 或記憶體資源。</p></li>
</ol>
<p>串流情境代表任何向量資料庫的全面壓力測試。但為此建立<em>公平的</em>基準並非易事。僅描述一個系統的行為是不夠的，我們需要一個一致的評估模型，以便在不同的資料庫間進行<strong>蘋果對蘋果的比較</strong>。</p>
<p>根據我們協助企業進行實際部署的經驗，我們建立了一套結構化、可重複的方法。使用 VDBBench：</p>
<ul>
<li><p>您可以<strong>定義一個固定的插入率</strong>，以反映您的目標生產工作負載。</p></li>
<li><p>然後，VDBBench 在所有系統上施加<strong>相同的負載壓力</strong>，確保效能結果可直接比較。</p></li>
</ul>
<p>例如，使用 Cohere 10M 資料集和 500 行/秒的擷取目標：</p>
<ul>
<li><p>VDBBench 启动 5 个并行生产进程，每个进程每秒插入 100 行。</p></li>
<li><p>在每擷取 10% 的資料後，VDBBench 會在序列和並發條件下啟動一輪搜尋測試。</p></li>
<li><p>每個階段之後都會記錄延遲、QPS 和回復率等指標。</p></li>
</ul>
<p>這種受控的方法揭示了每個系統的效能如何隨著時間和實際作業壓力而演變，讓您深入瞭解基礎結構決策所需的規模。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：Pinecone 與 Elasticsearch 在 Cohere 10M Streaming Test 中的 QPS 和 Recall 比較（500 行/秒輸入率）。Pinecone 維持較高的 QPS 和召回率，在插入 100% 的資料後，QPS 有顯著的改善。</em></p>
<p>但這並不是故事的結尾。VDBBench 更進一步支援可選的最佳化步驟，讓使用者可以比較索引最佳化前後的串流搜尋效能。它還會追蹤並報告每個階段所花費的實際時間，提供更深入的洞察力，讓您了解類似生產條件下的系統效率與行為。</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：Pinecone 與 Elasticsearch 在 Cohere 10M Streaming 測試中優化後的 QPS 與 Recall 比較（500 行/秒的輸入率）</em></p>
<p>如圖所示，ElasticSearch 在索引最佳化後的 QPS 超越了 Pinecone。奇蹟？不完全是。右圖說明了一切：當 x 軸反映實際經過的時間時，很明顯 ElasticSearch 花了更長的時間才達到這個效能。而在生產中，這種延遲是很重要的。這項比較揭示了一個關鍵的權衡：峰值吞吐量 vs. 服務時間。</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">信心十足地選擇您的向量資料庫<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>基準結果與實際效能之間的差距不應該是猜測遊戲。VDBBench 提供了一種方法，讓您可以在現實、類似生產的條件下評估向量資料庫，包括連續資料擷取、元資料篩選和串流工作負載。</p>
<p>如果您打算在生產中部署向量資料庫，就值得瞭解它在理想化實驗室測試之外的表現。VDBBench 是開放源碼、透明的，其設計旨在支援有意義的、蘋果對蘋果的比較。</p>
<p>現在就用您自己的工作負載試試 VDBBench，看看不同系統在實際應用中的表現如何<a href="https://github.com/zilliztech/VectorDBBench">：https://github.com/zilliztech/VectorDBBench。</a></p>
<p>有問題或想分享您的結果？加入<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>上的對話，或在<a href="https://discord.com/invite/FG6hMJStWu">Discord</a> 上與我們的社群連線。我們很樂意聽取您的意見。</p>
