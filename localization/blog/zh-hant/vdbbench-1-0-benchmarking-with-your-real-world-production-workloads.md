---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: 發表 VDBBench 1.0：開放原始碼向量資料庫基準與您真實世界的生產工作負載
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: 探索 VDBBench 1.0，這是一個開放原始碼工具，用於以真實世界的資料、串流攝取和並發工作負載來測試向量資料庫。
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>大多數向量資料庫基準都是以靜態資料和預先建立的索引進行測試。但生產系統並非如此-當使用者執行查詢時，資料會持續流動，篩選器會分割索引，而效能特性會在並發讀取/寫入負載下大幅改變。</p>
<p>今天，我們發佈<a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>，這是一個開放原始碼基準，專門用來測試向量資料庫在實際生產條件下的效能：串流資料擷取、選擇性各異的元資料篩選，以及揭示實際系統瓶頸的並發工作負載。</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>下載 VDBBench 1.0 →</strong></a>|<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>檢視排行榜 →</strong></a>|<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>閱讀排行榜 → 閱讀排行榜 → 閱讀排行榜 → 閱讀排行榜 → 閱讀排行榜</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">為什麼目前的 Benchmark 有誤導性？<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>老實說，我們業界有個奇怪的現象。每個人都在談論「不要玩基準」，但許多人卻恰恰參與了這種行為。自 2023 年向量資料庫市場爆發以來，我們已經看過無數系統「基準做得很好」但在生產中卻「失敗得很慘」的例子，浪費了工程時間，也損害了專案的可信度。</p>
<p>我們親眼目睹了這種脫節現象。舉例來說，Elasticsearch標榜毫秒級的查詢速度，但在幕後，光是優化索引就需要超過 20 小時。有哪個生產系統可以忍受這樣的停機時間？</p>
<p>問題源於三個基本缺陷：</p>
<ul>
<li><p><strong>過時的資料集：</strong>許多基準仍依賴傳統的資料集，例如 SIFT（128 維），而現代的嵌入式資料集則有 768-3,072 維。在 128D 與 1024D+ 向量上運作的系統，其效能特性有根本的不同 - 記憶體存取模式、索引效率和計算複雜度都有顯著的改變。</p></li>
<li><p><strong>虛榮指標：</strong>基準會著重於平均延遲時間或峰值 QPS，這會造成扭曲的現象。平均延遲 10 毫秒但 P99 延遲 2 秒的系統，會造成糟糕的使用者體驗。30 秒內測量的峰值吞吐量對於持續效能毫無幫助。</p></li>
<li><p><strong>過度簡化的情境：</strong>大多數的基準測試都是測試基本的「寫資料、建立索引、查詢」工作流程 - 基本上是「Hello World」等級的測試。真實的生產過程包括在提供查詢時持續擷取資料、過濾複雜的元資料以分割索引，以及競爭資源的並行讀/寫作業。</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">VDBBench 1.0 有什麼新功能？<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench 並不只是迭代過時的基準測試哲學，而是從第一原則出發，以一個指導信念重建基準測試概念：基準測試只有在預測實際生產行為時才有價值。</p>
<p>我們設計的 VDBBench 能在<strong>資料真實性、工作負載模式和效能測量方法</strong>這三個關鍵層面忠實複製真實世界的情況<strong>。</strong></p>
<p>讓我們仔細看看 VDBBench 帶來了哪些新功能。</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀重新設計的儀表板，提供與生產相關的可視化功能</strong></h3><p>大多數的基準只著重於原始資料輸出，但重要的是工程師如何解讀這些結果並採取行動。我們重新設計了 UI，將清晰度和互動性放在首位，讓您能夠發現系統之間的效能差距，並快速做出基礎架構決策。</p>
<p>新的儀表板不僅可視化效能數字，還可視化它們之間的關係：QPS 在不同篩選級別下如何降低、回復率在串流擷取過程中如何波動，以及延遲分佈如何顯示系統的穩定性特徵。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們重新測試了主要的向量資料庫平台，包括<strong>Milvus、Zilliz Cloud、Elastic Cloud、Qdrant Cloud、Pinecone 和 OpenSearch</strong>，並採用其最新的組態和建議設定，以確保所有基準資料都能反映目前的能力。所有測試結果均可在<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a> 取得。</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ Tag Filtering：隱藏的效能殺手</h3><p>現實世界的查詢很少是單獨發生的。應用程式會結合向量相似性與元資料篩選 (「尋找與這張照片相似但價格低於 100 美元的鞋子」)。這種經過篩選的向量搜尋造成了獨特的挑戰，而大多數基準完全忽略了這些挑戰。</p>
<p>過濾搜尋在兩個關鍵領域引入了複雜性：</p>
<ul>
<li><p><strong>篩選複雜性</strong>：更多的標量欄位和複雜的邏輯條件增加了計算需求，並可能導致召回率不足和圖索引破碎化。</p></li>
<li><p><strong>篩選選擇性</strong>：這是我們在生產中一再驗證的「隱藏效能殺手」。當篩選條件變得高度選擇性 (篩選出 99% 以上的資料)，查詢速度可能會出現幾個數量級的波動，而召回率可能會變得不穩定，因為索引結構會在稀疏的結果集上掙扎。</p></li>
</ul>
<p>VDBBench 有系統地測試各種過濾選擇性層級 (從 50% 到 99.9%)，在此關鍵生產模式下提供全面的效能概況。測試結果通常會揭露傳統基準中從未出現的顯著效能懸崖。</p>
<p><strong>舉例來說</strong>：在 Cohere 1M 測試中，Milvus 在所有過濾選擇性層級中都持續維持高召回率，而 OpenSearch 則表現不穩定，在不同過濾條件下召回率大幅波動 - 在許多情況下召回率低於 0.8，這對大多數生產環境而言是無法接受的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：Milvus 與 OpenSearch 在不同篩選條件下的 QPS 與召回率 (Cohere 1M 測試)。</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">串流讀寫：超越靜態索引測試</h3><p>生產系統很少享有靜態資料。在執行搜尋的同時，新資訊會不斷流入，在此情況下，許多原本令人印象深刻的資料庫會在既要維持搜尋效能，又要處理連續寫入的雙重壓力下崩潰。</p>
<p>VDBBench 的串流情境模擬真實的平行作業，協助開發人員瞭解高併發環境下的系統穩定性，特別是資料寫入如何影響查詢效能，以及效能如何隨著資料量增加而演變。</p>
<p>為了確保在不同系統間進行公平的比較，VDBBench 使用結構化的方法：</p>
<ul>
<li><p>設定可控制的寫入速率，以反映目標生產工作負載 (例如，500 行/秒分佈於 5 個平行進程)</p></li>
<li><p>在每 10% 的資料擷取之後觸發搜尋作業，交替使用序列與並行模式</p></li>
<li><p>記錄全面的指標：延遲分佈 (包括 P99)、持續 QPS 和回復精確度</p></li>
<li><p>追蹤隨著資料量和系統壓力增加的性能變化</p></li>
</ul>
<p>這種受控制的增量負載測試揭示了系統在持續擷取的情況下維持穩定性和精確度的能力，而傳統的基準很少能捕捉到這一點。</p>
<p><strong>舉例說明</strong>：在 Cohere 10M 串流測試中，與 Elasticsearch 相比，Pinecone 在整個寫入週期都能維持較高的 QPS 和召回率。值得注意的是，Pinecone 的效能在擷取完成後大幅提升，展現出在持續負載下的強大穩定性，而 Elasticsearch 則在主動擷取的階段中表現得較不穩定。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖：Pinecone 與 Elasticsearch 在 Cohere 10M Streaming 測試中的 QPS 與 Recall 比較（500 行/秒擷取率）。</p>
<p>VDBBench 更進一步支援可選的最佳化步驟，讓使用者可以比較索引最佳化前後的串流搜尋效能。它還會追蹤並報告每個階段所花費的實際時間，提供更深入的洞察力，讓您了解類似生產條件下的系統效率與行為。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：Pinecone 與 Elasticsearch 在優化後的 Cohere 10M Streaming 測試中的 QPS 與 Recall 比較（500 行/秒的輸入率）</em></p>
<p>如我們的測試所示，Elasticsearch 在索引最佳化後的 QPS 優於 Pinecone。但是當 x 軸反映實際經過的時間時，很明顯 Elasticsearch 花了更長的時間才達到這個效能。在生產中，這個延遲很重要。這項比較揭示了一個關鍵的權衡：峰值吞吐量 vs. 服務時間。</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">反映目前 AI 工作負載的現代資料集</h3><p>我們對向量資料庫基準測試所使用的資料集進行了全面調整。VDBBench 不再使用 SIFT 和 GloVe 等傳統測試集，而是使用 OpenAI 和 Cohere 等最先進嵌入模型產生的向量，這些模型為當今的 AI 應用程式提供了強大的動力。</p>
<p>為了確保相關性，特別是對於像 Retrieval-Augmented Generation (RAG) 之類的使用個案，我們選擇了能反映真實企業世界和特定領域情境的語料庫：</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>語料庫</strong></td><td><strong>嵌入模型</strong></td><td><strong>尺寸</strong></td><td><strong>大小</strong></td><td><strong>使用案例</strong></td></tr>
<tr><td>維基百科</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>一般知識庫</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>特定領域（生物醫學）</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>網路規模的文字處理</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1m / 10m / 138m</td><td>大規模搜尋</td></tr>
</tbody>
</table>
<p>這些資料集能夠更好地模擬當今的大容量、高維向量資料，在符合現代人工智能工作負載的條件下，對儲存效率、查詢效能和檢索準確性進行真實的測試。</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ 自訂資料集支援特定產業測試</h3><p>每個企業都是獨一無二的。金融業可能需要專注於交易嵌入的測試，而社交平台則更關心使用者行為向量。VDBBench 可讓您針對特定工作負載，使用由特定嵌入模型產生的自有資料進行基準測試。</p>
<p>您可以自訂</p>
<ul>
<li><p>向量尺寸和資料類型</p></li>
<li><p>元資料模式和篩選模式</p></li>
<li><p>資料量和擷取模式</p></li>
<li><p>符合您生產流量的查詢分佈</p></li>
</ul>
<p>畢竟，沒有任何資料集比您自己的生產資料更能說明問題。</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">VDBBench 如何測量生產中的實際重要性<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">以生產為重點的度量設計</h3><p>VDBBench 優先採用能反映實際效能的指標，而不僅僅是實驗室結果。我們圍繞生產環境中實際重要的事項重新設計基準：<strong>負載下的可靠性、尾端延遲特性、持續吞吐量以及精確度保存。</strong></p>
<ul>
<li><p><strong>P95/P99 延遲提供真實的使用者體驗</strong>：平均/中間延遲掩蓋了令實際使用者沮喪的異常值，並可能顯示潛在的系統不穩定性。VDBBench 專注於 P95/P99 等尾端延遲，揭示 95% 或 99% 的查詢實際會達到的效能。這對於 SLA 規劃和瞭解最壞情況下的使用者體驗至關重要。</p></li>
<li><p><strong>負載下的可持續吞吐量</strong>：5 秒內表現良好的系統不能用於生產。VDBBench 會逐漸增加並發量，以找出資料庫每秒的最大持續查詢量 (<code translate="no">max_qps</code>)，而不是在短時間、理想條件下的峰值。此方法揭示了您的系統在長時間內的穩定性，並有助於進行實際的容量規劃。</p></li>
<li><p><strong>調用與效能的平衡</strong>：沒有精確度的速度是沒有意義的。VDBBench 中的每個效能數字都與召回率測量成對，因此您可以確切知道為了獲得吞吐量，您需要犧牲多少相關性。這樣就能在內部取舍迥異的系統之間進行公平、對等的比較。</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">反映現實的測試方法</h3><p>VDBBench 設計中的一項關鍵創新是分離序列與並行測試，這有助於捕捉系統在不同類型負載下的行為，並揭示對不同用例而言非常重要的性能特性。</p>
<p><strong>延遲測量分離：</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> 測量最小負載下的系統效能，一次只處理一個請求。這代表延遲的最佳情況，有助於確定基線系統能力。</p></li>
<li><p><code translate="no">conc_latency_p99</code> 高併發：捕捉實際高併發情況下的系統行為，在此情況下，多個請求會同時到達並爭奪系統資源。</p></li>
</ul>
<p><strong>雙階段基準結構</strong>：</p>
<ol>
<li><p><strong>序列測試</strong>：單一程序執行 1,000 次查詢，以建立基線效能與精確度，同時報告<code translate="no">serial_latency_p99</code> 與回復率。此階段有助於確定理論效能上限。</p></li>
<li><p><strong>並發測試</strong>：模擬在持續負載下的生產環境，並採用多項關鍵創新：</p>
<ul>
<li><p><strong>真實用戶端模擬</strong>：每個測試程序都以自己的連線和查詢集獨立運作，避免可能扭曲結果的共用狀態干擾。</p></li>
<li><p><strong>同步啟動</strong>：所有程序同時開始，確保測得的 QPS 準確反映所聲稱的並發水準</p></li>
<li><p><strong>獨立查詢集</strong>：避免不切實際的快取記憶體命中率無法反映生產查詢的多樣性</p></li>
</ul></li>
</ol>
<p>這些結構嚴謹的方法可確保 VDBBench 所報告的<code translate="no">max_qps</code> 和<code translate="no">conc_latency_p99</code> 值既精確又與生產相關，為生產容量規劃和系統設計提供有意義的洞察力。</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">開始使用 VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0</strong>代表著向生產相關基準測試的根本性轉變。VDBBench 1.0 涵蓋連續資料寫入、選擇性不一的元資料篩選，以及並發存取模式下的串流負載，提供目前最接近實際生產環境的測試。</p>
<p>基準結果與實際效能之間的差距不應該是猜測遊戲。如果您打算在生產環境中部署向量資料庫，就值得瞭解它在理想化實驗室測試之外的表現。VDBBench 是開放源碼、透明的，旨在支援有意義的、蘋果對蘋果的比較。</p>
<p>不要被無法轉換為生產價值的可觀數字所動搖。<strong>使用 VDBBench 1.0 來測試與您的業務有關的情境、您的資料，以及反映您實際工作負載的條件。</strong>在向量資料庫評估中，誤導性基準的時代已經結束，現在是時候根據與生產相關的資料做出決策了。</p>
<p><strong>使用您自己的工作負載試用 VDBBench</strong><a href="https://github.com/zilliztech/VectorDBBench"> ：https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>檢視主要向量資料庫的測試結果：</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench 排行榜</a></p>
<p>有問題或想分享您的結果？加入<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>上的對話或在<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a> 上與我們的社群連線。</p>
