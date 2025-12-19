---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: 停止為冷資料付費：Milvus 分層儲存中的隨選冷熱資料載入功能可降低 80% 的成本
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: 瞭解 Milvus 中的分層儲存如何針對熱資料和冷資料實現按需載入，在規模上提供高達 80% 的成本降低和更快的載入時間。
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>有多少人仍在為系統幾乎不碰觸的資料支付高額基礎架構帳單？老實說，大多數團隊都是如此。</strong></p>
<p>如果您在生產中執行向量搜尋，您可能已經親眼看到這種情況。您提供大量的記憶體和 SSD，讓一切都能「準備好查詢」，儘管您的資料集只有一小部分實際在使用中。您並不孤單。我們也見過很多類似的案例：</p>
<ul>
<li><p><strong>多租戶 SaaS 平台：</strong>數百個已加入的租戶，但只有 10-15% 在任何特定日子活躍。其餘的閒置，但仍佔用資源。</p></li>
<li><p><strong>電子商務推薦系統：</strong>數百萬個 SKU，卻只有前 8% 的產品產生大部分的推薦與搜尋流量。</p></li>
<li><p><strong>AI 搜尋：</strong>龐大的嵌入式檔案，儘管 90% 的使用者查詢都是針對過去一週的項目。</p></li>
</ul>
<p>各行各業的情況都是一樣：<strong>只有少於 10% 的資料會被頻繁查詢，但卻往往消耗了 80% 的儲存空間和記憶體。</strong>每個人都知道這種不平衡現象的存在 - 但直到最近，仍沒有一個乾淨的架構方式來解決這個問題。</p>
<p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>改變了這一情況</strong><strong>。</strong></p>
<p>在這個版本之前，Milvus (就像大多數向量資料庫一樣) 依賴於<strong>全載模式</strong>：如果資料需要搜尋，就必須載入到本機節點上。無論資料是每分鐘上千次還是每季一次，<strong>都必須保持熱狀。</strong>這樣的設計選擇確保了可預測的效能，但也意味著叢集的規模過大，並且需要為冷資料支付根本不值得的資源。</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">分層儲存</a> <strong>就是我們的答案。</strong></p>
<p>Milvus 2.6 引入了全新的分層儲存架構，具有<strong>真正的按需載入</strong>功能，可讓系統自動區分熱資料和冷資料：</p>
<ul>
<li><p>熱段保留在靠近運算的緩存區</p></li>
<li><p>冷區段以低成本存放於遠端物件儲存空間</p></li>
<li><p><strong>只有當查詢實際需要</strong>資料<strong>時，才</strong>會將資料擷取至本機節點</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這將成本結構從「擁有多少資料」轉變為<strong>「實際使用多少資料」。</strong>在早期的生產部署中，這個簡單的轉移可<strong>降低高達 80% 的儲存和記憶體成本</strong>。</p>
<p>在這篇文章的其餘部分，我們將介紹分層儲存的運作方式，分享實際的效能結果，並顯示這項變更會在哪些方面產生最大的影響。</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">為什麼完全載入會在規模上瓦解<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入瞭解解決方案之前，值得仔細瞭解一下 Milvus 2.5 和早期版本中使用的<strong>Full-load 模式</strong>為何會在工作負載擴充時成為限制因素。</p>
<p>在 Milvus 2.5 及更早版本中，當使用者發出<code translate="no">Collection.load()</code> 請求時，每個 QueryNode 會在本機快取整個集合，包括元資料、欄位資料和索引。這些元件會從物件儲存中下載，並完全儲存在記憶體中，或以記憶體映射 (mmap) 的方式儲存在本機磁碟中。只有在<em>所有</em>這些資料都在本機可用之後，資料集才會被標記為已載入，並準備好提供查詢服務。</p>
<p>換句話說，除非節點上有完整的資料集（無論是熱的還是冷的），否則資料集是不可查詢的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>注意：</strong>對於嵌入原始向量資料的索引類型，Milvus 只會載入索引檔案，而不會分別載入向量欄位。即使如此，索引必須完全載入才能提供查詢服務，而不論實際存取了多少資料。</p>
<p>要瞭解為什麼這會變成問題，請考慮一個具體的範例：</p>
<p>假設您有一個中等大小的向量資料集，其中有</p>
<ul>
<li><p><strong>1 億向量</strong></p></li>
<li><p><strong>768 個維度</strong>(BERT 嵌入)</p></li>
<li><p><strong>float32</strong>精度 (每個維度 4 位元組)</p></li>
<li><p>一個<strong>HNSW 索引</strong></p></li>
</ul>
<p>在此設定中，單是 HNSW 索引 (包括內嵌的原始向量) 就佔用了約 430 GB 的記憶體。在加入使用者 ID、時間戳記或類別標籤等常見標量欄位後，本機資源總使用量很容易就超過 500 GB。</p>
<p>這表示，即使 80% 的資料很少或從未被查詢，系統仍必須提供並保留超過 500 GB 的本機記憶體或磁碟，才能讓資料集維持在線。</p>
<p>對於某些工作負載，這種行為是可以接受的：</p>
<ul>
<li><p>如果幾乎所有資料都會被頻繁存取，則完全載入所有資料可提供最低的查詢延遲，但成本也最高。</p></li>
<li><p>如果資料可分為熱子集和暖子集，將暖資料記憶體映射到磁碟可以部分降低記憶體壓力。</p></li>
</ul>
<p>但是，在 80% 或更多資料位於長尾資料的工作負載中，完全載入的缺點很快就會浮現，包括<strong>效能</strong>和<strong>成本</strong>。</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">效能瓶頸</h3><p>實際上，完全載入所影響的不只是查詢效能，通常還會拖慢例行作業工作流程：</p>
<ul>
<li><p><strong>較長的滾動升級時間：</strong>在大型集群中，滾動升級可能需要數小時甚至一整天的時間，因為每個節點都必須重新載入整個資料集，才能再次變為可用。</p></li>
<li><p><strong>故障後恢復速度較慢：</strong>當 QueryNode 重新啟動時，在重新載入所有資料之前，它無法提供流量服務，這將大幅延長復原時間，並擴大節點故障的影響。</p></li>
<li><p><strong>迭代與實驗速度變慢：</strong>完全載入會減慢開發工作流程，迫使人工智能團隊在測試新資料集或索引配置時，需要等待數小時才能載入資料。</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">成本效率低</h3><p>完全載入也會推高基礎架構成本。例如，在主流雲端記憶體最佳化的實體上，在本機儲存 1 TB 的資料大約需要<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mo separator="true">,</mo><mo>000peryear∗∗</mo><mo separator="true">,</mo><mi>basedonconservativepricing</mi><mo stretchy="false">(</mo><mi>AWSr6i</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex">70<span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">,000</annotation><mrow><mn>per year</mn></mrow><annotation encoding="application/x-tex">**, based</annotation></semantics></math></span></span>on conservative<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">pricing (AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">000peryear</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span>∗<span class="base"><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">basedonconservativepricing</span><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74 / GB / 月；GCP n4-highmem：~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>.</mn><mi>68</mi><mn>/ GB / month</mn><mo separator="true">;</mo><mi>AzureE-series</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext> 5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.68 / GB / month; Azure E-series：~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">68</span><span class="mord">/ GB / 月</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">系列</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.67 / GB / 月)。</span></span></span></p>
<p>現在考慮一個更現實的存取模式，其中 80% 的資料是冷資料，可儲存在物件儲存中取代 (價格約為 $0.023 / GB / 月)：</p>
<ul>
<li><p>200 GB 熱資料 × $5.68</p></li>
<li><p>800 GB 冷資料 × $0.023</p></li>
</ul>
<p>年度成本：(200×5.68+800×0.023)×12≈$14<strong>,000</strong></p>
<p>總儲存成本<strong>降低了 80%</strong>，而在實際重要的地方卻沒有犧牲效能。</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">什麼是分層儲存，如何運作？<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>為了消除這種取捨，Milvus 2.6 引入了<strong>分層</strong>儲存，透過將本機儲存視為快取記憶體，而非整個資料集的容器，來平衡效能與成本。</p>
<p>在此模型中，QueryNodes 只會在啟動時載入輕量級的元資料。字段資料和索引會在查詢需要時從遠端物件儲存按需取得，如果需要經常存取，則會在本機進行快取。不活動的資料會被驅逐，以釋放空間。</p>
<p>因此，熱資料會留在計算層附近，以進行低延遲的查詢，而冷資料則會留在物件儲存中，直到需要為止。這可減少載入時間、提高資源效率，並允許 QueryNodes 查詢遠大於其本機記憶體或磁碟容量的資料集。</p>
<p>實際上，分層儲存的運作方式如下：</p>
<ul>
<li><p><strong>將熱門資料保留在本機：</strong>大約 20% 經常存取的資料會保留在本機節點上，以確保 80% 最重要查詢的低延遲。</p></li>
<li><p><strong>根據需求載入冷資料：</strong>其餘 80% 很少存取的資料只會在需要時才擷取，以釋放大部分的本機記憶體和磁碟資源。</p></li>
<li><p><strong>以 LRU 為基礎的驅逐動態適應：</strong>Milvus 使用 LRU（最近最少使用）驅逐策略來持續調整哪些資料被視為熱資料或冷資料。不活動的資料會被自動驅逐，為新存取的資料騰出空間。</p></li>
</ul>
<p>有了這種設計，Milvus 不再受限於本機記憶體和磁碟的固定容量。取而代之的是，本機資源作為動態管理的快取記憶體，持續從非作用中的資料回收空間，並重新分配給作用中的工作負載。</p>
<p>在引擎蓋下，此行為由三個核心技術機制啟用：</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1.懶惰載入</h3><p>在初始化時，Milvus 只載入最小的區段層級元資料，讓資料集在啟動後幾乎可以立即查詢。欄位資料和索引檔案保留在遠端儲存，並在執行查詢時按需取得，以保持本機記憶體和磁碟的低使用率。</p>
<p><strong>集合載入在 Milvus 2.5 中如何運作</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>在 Milvus 2.6 及之後的版本中，懶惰載入如何運作</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>初始化期間載入的元資料分為四個主要類別：</p>
<ul>
<li><p><strong>區段統計</strong>(基本資訊，例如行數、區段大小和模式元資料)</p></li>
<li><p><strong>時間戳記</strong>(用於支援時間旅行查詢)</p></li>
<li><p><strong>插入和刪除記錄</strong>（在查詢執行期間需要用來維持資料一致性）</p></li>
<li><p><strong>Bloom 過濾器</strong>(用於快速預過濾，以快速消除不相關的區段)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2.部分載入</h3><p>懶惰載入控制資料載入的<em>時間</em>，而部分載入則控制資料載入的<em>數量</em>。一旦開始查詢或搜尋，QueryNode 會執行部分載入，僅從物件儲存區擷取所需的資料區塊或索引檔案。</p>
<p><strong>向量索引：租戶感知載入</strong></p>
<p>Milvus 2.6+ 引入的最具影響力的功能之一，是專為多租戶工作負載而設計的向量索引的租戶感知載入。</p>
<p>當查詢存取來自單一租戶的資料時，Milvus 只會載入向量索引中屬於該租戶的部分，而跳過所有其他租戶的索引資料。這可讓本機資源專注於活動租戶。</p>
<p>這種設計提供了幾個好處：</p>
<ul>
<li><p>不活動租戶的向量索引不會消耗本機記憶體或磁碟。</p></li>
<li><p>活動租戶的索引資料保持快取，以便進行低延遲存取</p></li>
<li><p>租戶層級的 LRU 驅逐政策可確保各租戶公平使用快取記憶體</p></li>
</ul>
<p><strong>標量欄位：列級部分載入</strong></p>
<p>部分載入也適用於<strong>標量欄位</strong>，允許 Milvus 只載入查詢明確引用的欄位。</p>
<p>考慮一個有<strong>50 個模式欄位</strong>的集合，例如<code translate="no">id</code>,<code translate="no">vector</code>,<code translate="no">title</code>,<code translate="no">description</code>,<code translate="no">category</code>,<code translate="no">price</code>,<code translate="no">stock</code>, 和<code translate="no">tags</code>, 而您只需要傳回三個欄位 -<code translate="no">id</code>,<code translate="no">title</code>, 和<code translate="no">price</code> 。</p>
<ul>
<li><p>在<strong>Milvus 2.5</strong> 中，無論查詢需求為何，都會載入所有 50 個標量字段。</p></li>
<li><p>在<strong>Milvus 2.6+</strong> 中，只有三個要求的欄位會被載入。其餘 47 個欄位不被載入，僅在稍後需要存取時才被擷取。</p></li>
</ul>
<p>這可以節省大量資源。如果每個標量欄位佔用 20 GB：</p>
<ul>
<li><p>載入所有欄位需要<strong>1,000 GB</strong>(50 × 20 GB)</p></li>
<li><p>僅載入三個所需欄位需要<strong>60 GB</strong></p></li>
</ul>
<p>這表示標量資料載入<strong>減少了 94%</strong>，而不會影響查詢的正確性或結果。</p>
<p><strong>注意：</strong>標量欄位和向量索引的租戶感知部分載入將在即將發佈的版本中正式推出。一旦推出，它將進一步減少負載延遲，並改善大型多租戶部署中的冷查詢效能。</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3.基於 LRU 的快取驅逐</h3><p>懶惰載入和部分載入可大幅減少導入本機記憶體和磁碟的資料數量。然而，在長時間運行的系統中，快取記憶體仍會隨著新資料的存取而成長。當達到本機容量時，以 LRU 為基礎的快取驅逐就會生效。</p>
<p>LRU (最近最少使用) 驅逐遵循一個簡單的規則：最近未被存取的資料會先被驅逐。這可為新存取的資料騰出本機空間，同時將經常使用的資料保留在快取記憶體中。</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">效能評估：分層儲存與完全載入<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>為了評估<strong>分層儲存</strong>的實際影響，我們建立了一個與生產工作負載非常接近的測試環境。我們從五個層面比較了有分層儲存與沒有分層儲存的 Milvus：載入時間、資源使用、查詢效能、有效容量和成本效益。</p>
<h3 id="Experimental-setup" class="common-anchor-header">實驗設定</h3><p><strong>資料集</strong></p>
<ul>
<li><p>1 億個向量，共 768 個維度 (BERT 嵌入)</p></li>
<li><p>向量索引大小：約 430 GB</p></li>
<li><p>10 個標量字段，包括 ID、時間戳記和類別</p></li>
</ul>
<p><strong>硬體配置</strong></p>
<ul>
<li><p>1 個 QueryNode，配備 4 個 vCPU、32 GB 記憶體和 1 TB NVMe SSD</p></li>
<li><p>10 Gbps 網路</p></li>
<li><p>MinIO 物件儲存群集作為遠端儲存後端</p></li>
</ul>
<p><strong>存取模式</strong></p>
<p>查詢遵循真實的冷熱存取分佈：</p>
<ul>
<li><p>80% 的查詢以最近 30 天的資料為目標 (≈總資料的 20%)</p></li>
<li><p>15% 的查詢以 30-90 天內的資料為目標 (≈總資料的 30%)</p></li>
<li><p>5% 針對 90 天以上的資料 (≈總資料的 50%)</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">主要結果</h3><p><strong>1.載入時間快 33 倍</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>階段</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (分層儲存)</strong></th><th style="text-align:center"><strong>速度提升</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">資料下載</td><td style="text-align:center">22 分鐘</td><td style="text-align:center">28 秒</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">索引載入</td><td style="text-align:center">3 分鐘</td><td style="text-align:center">17 秒</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>總計</strong></td><td style="text-align:center"><strong>25 分鐘</strong></td><td style="text-align:center"><strong>45 秒</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>在 Milvus 2.5 中，載入資料集需要<strong>25 分鐘</strong>。在 Milvus 2.6+ 中使用分層儲存後，相同的工作負載只需<strong>45 秒</strong>即可完成，代表負載效率大幅提升。</p>
<p><strong>2.本機資源使用量減少 80</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>階段</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (分層儲存)</strong></th><th style="text-align:center"><strong>減少</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">負載後</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">1 小時後</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">24 小時後</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">穩定狀態</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>在 Milvus 2.5 中，不論工作負載或執行時間，本機資源使用量都維持在<strong>430 GB</strong>。相比之下，Milvus 2.6+ 在載入後立即以<strong>12 GB</strong>開始。</p>
<p>隨著查詢的執行，經常存取的資料會被緩存到本機，資源使用量也會逐漸增加。大約 24 小時後，系統穩定在<strong>85-95 GB</strong>，反映出熱資料的工作集。長期而言，這會導致本機記憶體和磁碟使用量<strong>減少約 80%</strong>，而不會犧牲查詢的可用性。</p>
<p><strong>3.對熱資料效能的影響近乎零</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>查詢類型</strong></th><th style="text-align:center"><strong>Milvus 2.5 P99 延遲</strong></th><th style="text-align:center"><strong>Milvus 2.6+ P99 延遲</strong></th><th style="text-align:center"><strong>變更</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">熱資料查詢</td><td style="text-align:center">15 毫秒</td><td style="text-align:center">16 毫秒</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">熱資料查詢</td><td style="text-align:center">15 毫秒</td><td style="text-align:center">28 毫秒</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">冷資料查詢 (首次存取)</td><td style="text-align:center">15 毫秒</td><td style="text-align:center">120 毫秒</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">冷資料查詢 (快取)</td><td style="text-align:center">15 毫秒</td><td style="text-align:center">18 毫秒</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>對於約佔所有查詢 80% 的熱資料，P99 延遲僅增加 6.7%，對生產幾乎沒有影響。</p>
<p>冷資料查詢在首次存取時會因為按需求從物件儲存載入而顯示較高的延遲。不過，一旦快取之後，其延遲只會增加 20%。由於冷資料的存取頻率較低，因此對大多數的實際工作負載而言，這種折衷通常是可以接受的。</p>
<p><strong>4.4.3 倍的有效容量</strong></p>
<p>在相同的硬體預算下 (八台伺服器，每台 64 GB 記憶體 (總共 512 GB))，Milvus 2.5 最多可載入 512 GB 的資料，相當於約 1.36 億個向量。</p>
<p>在 Milvus 2.6+ 中啟用分層儲存後，相同的硬體可支援 2.2 TB 的資料，或大約 5.9 億向量。這代表有效容量增加了 4.3 倍，無須擴充本機記憶體即可提供更大的資料集。</p>
<p><strong>5.成本降低 80.1%</strong></p>
<p>以 AWS 環境中的 2 TB 向量資料集為例，假設 20% 的資料是熱資料 (400 GB)，成本比較如下：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>項目</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (分層儲存)</strong></th><th style="text-align:center"><strong>節省成本</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">每月成本</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">年度成本</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">節省率</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">基準摘要</h3><p>在所有測試中，分層儲存提供一致且可衡量的改善：</p>
<ul>
<li><p><strong>載入時間快 33 倍：</strong>收集載入時間從<strong>25 分鐘縮</strong>短<strong>至 45 秒</strong>。</p></li>
<li><p><strong>本機資源使用率降低 80%：</strong>在穩態運作中，記憶體和本機磁碟使用量減少約<strong>80%</strong>。</p></li>
<li><p><strong>對熱資料效能幾近零影響：</strong>熱資料的 P99 延遲增加<strong>不到 10%</strong>，維持低延遲的查詢效能。</p></li>
<li><p><strong>控制冷資料的延遲：</strong>冷資料在首次存取時會產生較高的延遲，但由於其存取頻率較低，因此是可以接受的。</p></li>
<li><p><strong>4.3 倍的有效容量：</strong>相同的硬體可以提供<strong>4-5 倍的資料</strong>服務，而不需要額外的記憶體。</p></li>
<li><p><strong>成本降低 80% 以上：</strong>每年基礎架構成本可降低<strong>80% 以上</strong>。</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">何時在 Milvus 中使用分層儲存設備<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>根據基準結果和實際生產案例，我們將分層儲存使用案例分為三類，以協助您決定它是否適合您的工作負載。</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">最適合的使用案例</h3><p><strong>1.多租戶向量搜尋平台</strong></p>
<ul>
<li><p><strong>特性：</strong>大量租戶，活動高度不平均；向量搜尋是核心工作負載。</p></li>
<li><p><strong>存取模式：</strong>少於 20% 的租戶產生超過 80% 的向量查詢。</p></li>
<li><p><strong>預期效益：</strong>成本降低 70-80%；容量擴充 3-5倍。</p></li>
</ul>
<p><strong>2.電子商務推薦系統 (向量搜尋工作負載)</strong></p>
<ul>
<li><p><strong>特性：</strong>頂尖商品與長尾商品之間有強烈的人氣傾斜。</p></li>
<li><p><strong>存取模式：</strong>前 10% 的產品佔向量搜尋流量的 ~80%。</p></li>
<li><p><strong>預期效益：</strong>高峰活動期間無需額外容量；成本降低 60-70</p></li>
</ul>
<p><strong>3.冷熱區分明確的大型資料集（向量主導）</strong></p>
<ul>
<li><p><strong>特性：</strong>TB 規模或更大的資料集，存取方式偏重於最近的資料。</p></li>
<li><p><strong>存取模式：</strong>典型的 80/20 分佈：20% 的資料為 80% 的查詢服務</p></li>
<li><p><strong>預期效益：</strong>成本降低 75-85</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">適合的使用個案</h3><p><strong>1.成本敏感型工作負載</strong></p>
<ul>
<li><p><strong>特性：</strong>預算緊縮，但可容忍輕微的效能折衷。</p></li>
<li><p><strong>存取模式：</strong>向量查詢相對集中。</p></li>
<li><p><strong>預期效益：</strong>成本降低 50-70%；冷資料在首次存取時可能會產生 ~500 毫秒的延遲，應根據 SLA 要求進行評估。</p></li>
</ul>
<p><strong>2.歷史資料保留與存檔搜尋</strong></p>
<ul>
<li><p><strong>特性：</strong>大量歷史向量，查詢頻率非常低。</p></li>
<li><p><strong>存取模式：</strong>約 90% 的查詢以最近的資料為目標。</p></li>
<li><p><strong>預期效益：</strong>保留完整的歷史資料集；保持基礎結構成本的可預測性與可控性</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">不適合的使用個案</h3><p><strong>1.一致的熱資料工作負載</strong></p>
<ul>
<li><p><strong>特徵：</strong>所有資料都以類似的頻率存取，沒有明顯的冷熱區分。</p></li>
<li><p><strong>不適合的原因：</strong>快取記憶體效益有限；增加系統複雜度，卻沒有意義的增益</p></li>
</ul>
<p><strong>2.超低延遲工作負載</strong></p>
<ul>
<li><p><strong>特性：</strong>對延遲極為敏感的系統，例如金融交易或即時競價</p></li>
<li><p><strong>為什麼不適合？</strong>即使是微小的延遲變化也無法接受；完全載入可提供更可預測的效能</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">快速入門：在 Milvus 2.6+ 中嘗試分層儲存<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 中的分層儲存解決了向量資料的儲存方式與實際存取方式之間常見的錯配問題。在大多數生產系統中，只有一小部分資料會被頻繁查詢，但傳統的載入模型卻將所有資料視為同樣熱門的資料。Milvus 轉向按需載入，並將本機記憶體和磁碟作為快取記憶體來管理，使資源消耗符合實際查詢行為，而非最壞情況的假設。</p>
<p>此方法可讓系統擴充至更大的資料集，而不需按比例增加本機資源，同時保持熱查詢效能大致不變。冷資料在需要時仍可存取，並具有可預測和受限的延遲，讓權衡變得明確和可控。隨著向量搜尋深入成本敏感、多租戶及長時間運作的生產環境，分層儲存為有效率的規模運作提供了實用的基礎。</p>
<p>如需更多關於分層儲存的資訊，請參閱下列說明文件：</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">分層儲存 | Milvus 文件</a></li>
</ul>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的瞭解、指導和問題解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">進一步了解 Milvus 2.6 功能<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介紹 Milvus 2.6：十億規模的經濟實惠向量搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介紹嵌入功能：Milvus 2.6 如何簡化矢量化和語意搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus的JSON粉碎功能：彈性化JSON篩選速度提升88.9倍</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解鎖真正的實體層級檢索：Milvus 的全新結構陣列與 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">在 Milvus 2.6 中將地理空間篩選和向量搜尋與幾何字段和 RTREE 結合起來</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">在 Milvus 中引入 AISAQ：十億級向量搜尋在記憶體上的成本降低了 3,200 倍</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">在 Milvus 中優化 NVIDIA CAGRA：GPU-CPU 混合方法可加快索引速度並降低查詢成本</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：對抗 LLM 訓練資料中重複資料的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮發揮到極致：Milvus 如何利用 RaBitQ 提供多 3 倍的查詢服務</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基準會說謊 - 向量資料庫應該接受真正的測試 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar</a></p></li>
</ul>
