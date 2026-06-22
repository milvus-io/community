---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: |
  在 Milvus 中介紹 AISAQ：十億級向量搜尋的記憶體成本現已降低 3,200 倍
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: 了解 Milvus 如何透過 AISAQ 將記憶體成本降低 3200 倍，實現無需 DRAM 開銷的可擴展性十億向量搜尋。
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>向量資料庫已成為關鍵任務型 AI 系統的核心基礎設施，其資料量正呈指數級增長——往往達到數十億個向量。在這種規模下，各項挑戰都變得更加艱鉅：維持低延遲、保持準確性、確保可靠性，以及在複本和不同區域間進行運作。但其中一項挑戰往往在早期便浮現，並主導架構決策——那就是「<strong>成本」。</strong></p>
<p>為了實現快速搜尋，大多數向量資料庫會將關鍵索引結構儲存在 DRAM（動態隨機存取記憶體）中，這是速度最快但成本最高的記憶體層級。這種設計雖能有效提升效能，但擴展性不佳。 DRAM 的使用量是隨資料規模而非查詢流量而擴展的，即使採用壓縮或部分 SSD 卸載技術，索引的大部分仍必須保留在記憶體中。隨著資料集不斷擴大，記憶體成本很快就會成為限制因素。</p>
<p>Milvus 已支援<strong>DISKANN</strong>——這是一種基於磁碟的人工神經網路（ANN）方法，透過將大部分索引移至 SSD 來減輕記憶體壓力。然而，DISKANN 在搜尋過程中仍需依賴 DRAM 來處理壓縮表示形式。<a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a>更進一步推出了<a href="https://milvus.io/docs/aisaq.md">AISAQ，</a>這是一種受<a href="https://milvus.io/docs/diskann.md">DISKANN</a> 啟發的基於磁碟的向量索引。 由 KIOXIA 開發的 AiSAQ，其架構採用「零 DRAM 佔用架構」，將所有搜尋關鍵資料儲存於磁碟上，並透過優化資料配置來最小化 I/O 操作。 在十億向量的工作負載下，此設計將記憶體使用量從<strong>32 GB 降低至約 10 MB</strong> <strong>——減少了 3,200 倍</strong>——同時仍能維持實用效能。</p>
<p>在接下來的章節中，我們將說明基於圖的向量搜尋如何運作、記憶體成本從何而來，以及 AISAQ 如何重塑十億級向量搜尋的成本曲線。</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">傳統基於圖的向量搜尋運作原理<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>向量搜尋</strong>是指在高維度空間中，找出數值表示最接近查詢的資料點的過程。 所謂「最接近」，單純是指根據距離函數（例如餘弦距離或 L2 距離）所計算出的最小距離。在小規模下，這很簡單：計算查詢向量與每個向量之間的距離，然後返回最接近的向量。然而，在大規模（例如十億級）的情況下，這種方法很快就會變得過於緩慢，難以實際應用。</p>
<p>為避免進行窮舉比對，現代的近似最近鄰搜尋（ANNS）系統仰賴<strong>基於圖的索引</strong>。索引不會將查詢與每個向量逐一比對，而是將向量組織成一個<strong>圖</strong>。每個節點代表一個向量，而邊則連接數值相近的向量。這種結構使系統能夠大幅縮小搜尋空間。</p>
<p>該圖是預先建構的，僅基於向量之間的關係，並不依賴於查詢。當查詢送達時，系統的任務是<strong>高效地遍歷該圖</strong>，並識別出與查詢距離最小的向量——而無需掃描整個資料集。</p>
<p>搜尋從圖中預先定義的<strong>起點</strong>開始。這個起點可能距離查詢很遠，但演算法會逐步朝著看似更接近查詢的向量移動，藉此逐步改善其位置。在此過程中，搜尋會維護兩種相互配合的內部資料結構：<strong>候選清單</strong>與<strong>結果清單</strong>。</p>
<p>而此過程中最重要的兩個步驟，便是擴展候選清單與更新結果清單。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">擴展候選清單</h3><p><strong>候選清單</strong>代表搜尋下一步可前往的位置。它是一組依優先順序排列的圖節點，這些節點根據其與查詢的距離，被視為具有潛在匹配的可能性。</p>
<p>在每次迭代中，演算法會：</p>
<ul>
<li><p><strong>選取迄今發現的最接近候選節點。</strong>從候選清單中，選取與查詢向量距離最小的向量。</p></li>
<li><p><strong>從圖中擷取該向量的鄰居。</strong>這些鄰居是在建立索引時，被識別為與當前向量距離較近的向量。</p></li>
<li><p><strong>評估尚未探訪的鄰居並將其加入候選清單。</strong>對於每個尚未被探索的鄰居，演算法會計算其與查詢的距離。先前已探訪過的鄰居將被跳過，而新的鄰居若看似有潛力，則會被插入候選清單中。</p></li>
</ul>
<p>透過反覆擴展候選清單，搜尋過程會逐步探索圖中相關性日益提高的區域。這使演算法能在僅檢查所有向量中一小部分的情況下，穩步朝更佳的解答邁進。</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">更新結果清單</h3><p>與此同時，演算法會維護一個<strong>結果清單，</strong>用以記錄迄今為止找到的最佳候選向量，作為最終輸出。隨著搜尋的進行，它會：</p>
<ul>
<li><p><strong>追蹤遍歷過程中遇到的最近向量。</strong>這些包括被選中進行擴展的向量，以及沿途評估的其他向量。</p></li>
<li><p><strong>儲存它們與查詢向量的距離。</strong>這使得對候選向量進行排序，並維持當前前 K 個最近鄰成為可能。</p></li>
</ul>
<p>隨著時間推移，當評估的候選向量越來越多，而發現的改進卻越來越少時，結果清單便會趨於穩定。一旦進一步探索圖狀結構不太可能產生更接近的向量，搜尋便會終止，並將結果清單作為最終答案返回。</p>
<p>簡而言之，<strong>候選清單控制探索過程</strong>，而<strong>結果清單則記錄迄今發現的最佳答案</strong>。</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">基於圖的向量搜尋中的權衡<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>正是這種基於圖的作法，才使大規模向量搜尋在實務上成為可能。透過在圖中導航而非掃描每個向量，系統僅需處理資料集的一小部分，便能找到高品質的結果。</p>
<p>然而，這種效率並非沒有代價。基於圖的搜尋揭示了<strong>準確度與成本之間</strong>的基本權衡<strong>。</strong></p>
<ul>
<li><p>探索更多鄰居能覆蓋更廣的圖範圍，並降低錯過真實最近鄰居的機率，從而提升準確性。</p></li>
<li><p>與此同時，每次額外的擴展都會增加運算負擔：需要進行更多的距離計算、更多次存取圖結構，以及更多次讀取向量資料。隨著搜尋範圍向更深或更廣處延伸，這些成本會不斷累積。視索引的設計方式而定，這些成本會表現為更高的 CPU 使用率、增加的記憶體壓力，或是額外的磁碟 I/O。</p></li>
</ul>
<p>平衡這些相互對立的因素——高召回率與高效的資源利用——是圖基搜索設計的核心。</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a>與<strong>AISAQ</strong>皆圍繞著這項矛盾而建構，但在如何以及在何處承擔這些成本方面，兩者做出了不同的架構選擇。</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">DISKANN 如何優化基於磁碟的向量搜尋<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN 是迄今為止最具影響力的基於磁碟的人工神經網路（ANN）解決方案，並作為 NeurIPS Big ANN 競賽的官方基準，該競賽是十億級向量搜尋的全球基準測試。其重要性不僅在於性能，更在於它所證實的一點：<strong>基於圖的人工神經網路搜尋無需完全駐留於記憶體中，也能實現高速運作</strong>。</p>
<p>透過結合 SSD 儲存與精心挑選的記憶體內結構，DISKANN 證明了大規模向量搜尋能在通用硬體上實現高準確度與低延遲——且無需佔用龐大的 DRAM 空間。其關鍵在於重新思考<em>搜尋過程中哪些部分必須快速</em>，<em>哪些部分則可容忍較慢的存取速度</em>。</p>
<p><strong>從高層次來看，DISKANN 將最常被存取的資料保留在記憶體中，同時將較大且較少被存取的結構移至磁碟。</strong>這種平衡是透過幾項關鍵的設計選擇來實現的。</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. 運用 PQ 距離擴展候選清單</h3><p>擴展候選清單是圖基搜尋中最常進行的操作。每次擴展都需要估算查詢向量與候選節點鄰居之間的距離。若使用完整的、高維度向量進行這些計算，將需要頻繁地從磁碟進行隨機讀取——這在運算和 I/O 方面都是相當耗費資源的操作。</p>
<p>DISKANN 透過將向量壓縮為<strong>產品量化（PQ）碼並</strong>將其保存在記憶體中，來避免此種開銷。PQ 碼的體積遠小於完整向量，但仍保留足夠的資訊以進行近似距離估算。</p>
<p>在候選節點擴展過程中，DISKANN 會利用這些記憶體中的 PQ 碼來計算距離，而非從 SSD 讀取完整的向量。這大幅減少了圖遍歷過程中的磁碟 I/O，使搜尋能快速且高效地擴展候選節點，同時將大部分 SSD 流量排除在關鍵路徑之外。</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. 將完整向量與鄰接清單共置於磁碟上</h3><p>並非所有資料都能被壓縮或以近似方式存取。一旦識別出有潛力的候選節點，搜尋過程仍需存取兩類資料以確保結果精確：</p>
<ul>
<li><p><strong>鄰接清單</strong>，用於繼續圖遍歷</p></li>
<li><p><strong>完整（未壓縮）向量</strong>，用於最終重新排序</p></li>
</ul>
<p>由於這些結構的存取頻率低於 PQ 碼，因此 DISKANN 將其儲存於 SSD 上。為將磁碟開銷降至最低，DISKANN 會將每個節點的鄰接清單及其完整向量放置於磁碟上的同一物理區域。這確保單次 SSD 讀取即可同時取得兩者。</p>
<p>透過將相關資料集中存放，DISKANN 減少了搜尋過程中所需的隨機磁碟存取次數。這項優化提升了擴展與重新排序的效率，特別是在大規模應用時。</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. 並行節點擴展以提升 SSD 利用率</h3><p>基於圖的 ANN 搜尋是一個迭代過程。若每次迭代僅擴展一個候選節點，系統每次僅發出單次磁碟讀取請求，導致 SSD 的大部分並行頻寬閒置。 為避免此種低效情況，DISKANN 會在每次迭代中擴展多個候選節點，並向 SSD 發送並行讀取請求。此方法能更充分地利用可用頻寬，並減少所需的總迭代次數。</p>
<p>`<strong>beam_width_ratio</strong>` 參數控制並行擴展的候選節點數量：<strong>搜索範圍寬度 = CPU 核心數 × `beam_width_ratio`。</strong>較高的比率會擴大搜索範圍——可能提高準確度——但也會增加運算量和磁碟 I/O。</p>
<p>為此，DISKANN 引入了「<code translate="no">search_cache_budget_gb_ratio</code> 」，該機制會預留記憶體來快取頻繁存取的資料，從而減少對 SSD 的重複讀取。這些機制共同協助 DISKANN 平衡準確性、延遲與 I/O 效率。</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">為何這很重要——以及限制何在</h3><p>DISKANN 的設計是基於磁碟的向量搜尋技術的一大進步。透過將 PQ 碼保留在記憶體中，並將較大的結構推送到 SSD，相較於完全在記憶體中的圖索引，它顯著減少了記憶體佔用量。</p>
<p>與此同時，此架構仍需依賴<strong>始終處於活躍狀態的 DRAM</strong>來儲存搜尋關鍵資料。PQ 碼、快取及控制結構必須常駐記憶體中，才能維持遍歷效率。隨著資料集規模擴增至數十億個向量，且部署環境新增複本或區域時，這項記憶體需求仍可能成為限制因素。</p>
<p>這正是<strong>AISAQ</strong>設計旨在解決的缺口。</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">AISAQ 的運作原理及其重要性<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ 直接基於 DISKANN 的核心理念，但引入了一項關鍵轉變：它消除了<strong>將 PQ 資料保留在 DRAM 中的必要性</strong>。AISAQ 不再將壓縮向量視為搜尋關鍵且必須始終駐留記憶體中的結構，而是將其移至 SSD，並重新設計圖資料在磁碟上的佈局方式，以維持高效的遍歷效率。</p>
<p>為實現此目標，AISAQ 重新組織了節點儲存方式，使圖搜尋過程中所需的数据——完整向量、鄰居清單及 PQ 資訊——在磁碟上以優化存取局部性的模式進行排列。其目標不僅是將更多數據移至更經濟的磁碟，更<strong>要在不破壞前述搜尋流程的前提下</strong>達成此目標。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>為因應不同的應用需求，AISAQ 提供兩種基於磁碟的儲存模式：「效能模式」與「規模模式」。從技術角度來看，這兩種模式的主要差異在於搜尋過程中，PQ 壓縮資料的儲存與存取方式。 從應用層面來看，這兩種模式分別滿足兩類截然不同的需求：低延遲需求（常見於線上語義搜尋與推薦系統），以及超大規模需求（常見於 RAG）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance：針對速度進行優化</h3><p>AISAQ-performance 將所有資料保留在磁碟上，同時透過資料共置來維持低 I/O 開銷。</p>
<p>在此模式下：</p>
<ul>
<li><p>每個節點的完整向量、邊列表及其鄰居的 PQ 碼均共同儲存於磁碟上。</p></li>
<li><p>訪問節點仍僅需<strong>單次 SSD 讀取</strong>，因為候選節點擴展與評估所需的所有資料均已共置。</p></li>
</ul>
<p>從搜尋演算法的角度來看，這與 DISKANN 的存取模式極為相似。儘管所有對搜尋至關重要的資料現已存放於磁碟上，候選節點擴展仍能保持高效，且執行時間效能與 DISKANN 相當。</p>
<p>其代價在於儲存開銷。由於鄰居節點的 PQ 資料可能出現在多個節點的磁碟頁中，此佈局會引入冗餘，並顯著增加整體索引大小。</p>
<p>因此，AISAQ-Performance 模式將低 I/O 延遲置於磁碟效率之上。從應用層面來看，AISAQ-Performance 模式可提供 10 毫秒級的延遲，符合線上語義搜尋的需求。</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Scale：針對儲存效率進行優化</h3><p>AISAQ-Scale 則採取相反的策略。其設計旨在<strong>將磁碟使用量降至最低</strong>，同時仍將所有資料保留在 SSD 上。</p>
<p>在此模式下：</p>
<ul>
<li><p>PQ 資料會獨立儲存於磁碟上，且不包含冗餘。</p></li>
<li><p>此舉可消除冗餘，並大幅縮小索引大小。</p></li>
</ul>
<p>其代價在於，存取某個節點及其鄰居的 PQ 碼可能需要<strong>多次 SSD 讀取</strong>，從而增加候選擴展過程中的 I/O 操作。若未進行優化，這將顯著降低搜尋速度。</p>
<p>為控制此開銷，AISAQ-Scale 模式引入了兩項額外優化：</p>
<ul>
<li><p><strong>PQ 資料重新排列</strong>，將 PQ 向量依存取優先級排序，以提升局部性並減少隨機讀取。</p></li>
<li><p><strong>DRAM 中的 PQ 快取</strong>（<code translate="no">pq_read_page_cache_size</code> ），用於儲存頻繁存取的 PQ 資料，並避免針對熱條目進行重複的磁碟讀取。</p></li>
</ul>
<p>透過這些優化，AISAQ-Scale 模式在維持實用搜尋效能的同時，實現了遠優於 AISAQ-Performance 的儲存效率。其效能雖仍低於 DISKANN，但無儲存開銷（索引大小與 DISKANN 相近），且記憶體佔用量大幅減少。 從應用層面來看，AiSAQ 提供了在超大規模下滿足 RAG 需求的解決方案。</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">AISAQ 的關鍵優勢</h3><p>透過將所有對搜尋至關重要的資料移至磁碟，並重新設計資料的存取方式，AISAQ 從根本上改變了基於圖的向量搜尋的成本與可擴展性特徵。其設計帶來三大顯著優勢。</p>
<p><strong>1. DRAM 使用量最高可降低 3,200 倍</strong></p>
<p>產品量化（Product Quantization）雖能顯著縮小高維向量的體積，但在十億級規模下，記憶體佔用量仍相當可觀。即使經過壓縮，在傳統設計中，PQ 碼在搜尋過程中仍必須保存在記憶體中。</p>
<p>例如，在包含 10 億個 128 維向量的基準測試集<strong>SIFT1B</strong> 上，僅 PQ 碼就需佔用約<strong>30 至 120 GB 的 DRAM，</strong>具體取決於配置。 若要儲存完整的未壓縮向量，則需<strong>額外約 480 GB</strong> 空間。雖然 PQ 可將記憶體使用量減少 4–16 倍，但剩餘的佔用空間仍大到足以主導基礎架構成本。</p>
<p>AISAQ 完全消除了這項需求。透過將 PQ 碼儲存於 SSD 而非 DRAM，記憶體不再被持久性索引資料佔用。DRAM 僅用於輕量級的暫存結構，例如候選清單和控制元資料。實際上，這將記憶體使用量從數十 GB 降低<strong>至約 10 MB</strong>。 在一個具代表性的十億規模配置中，DRAM 用量從<strong>32 GB 降至 10 MB</strong>，<strong>減少了 3,200 倍</strong>。</p>
<p>鑑於 SSD 的儲存成本約為 DRAM<strong>的 1/30</strong>（<strong>以單位容量計算</strong>），此項轉變對整體系統成本產生了直接且顯著的影響。</p>
<p><strong>2. 無額外 I/O 開銷</strong></p>
<p>若將 PQ 碼從記憶體移至磁碟，通常會增加搜尋過程中的 I/O 操作次數。 AISAQ 透過仔細控制<strong>資料佈局與存取模式來</strong>避免此問題。AISAQ 不會將相關資料分散存放在磁碟各處，而是將 PQ 碼、完整向量和鄰居清單集中存放，以便能一併檢索。這確保了候選擴展不會引入額外的隨機讀取。</p>
<p>為了讓使用者能掌控索引大小與 I/O 效率之間的權衡，AISAQ 引入了 `<code translate="no">inline_pq</code> ` 參數，用以決定每個節點中內聯儲存的 PQ 資料量：</p>
<ul>
<li><p><strong>inline_pq 值較低：</strong>索引大小較小，但可能需要額外的 I/O</p></li>
<li><p><strong>較高的 inline_pq 值：</strong>索引大小較大，但可維持單次讀取存取</p></li>
</ul>
<p>當設定 `<strong>inline_pq = max_degree</strong>` 時，AISAQ 會透過單次磁碟操作讀取節點的完整向量、鄰居清單及所有 PQ 碼，此模式與 DISKANN 的 I/O 模式相符，同時將所有資料保留在 SSD 上。</p>
<p><strong>3. 順序式 PQ 存取可提升運算效率</strong></p>
<p>在 DISKANN 中，擴展候選節點需要進行 R 次隨機記憶體存取，以擷取其 R 個鄰居的 PQ 碼。AISAQ 透過單次 I/O 擷取所有 PQ 碼，並將其依序儲存於磁碟上，從而消除此隨機性。</p>
<p>順序化佈局提供兩項重要優勢：</p>
<ul>
<li><p><strong>SSD 的順序讀取速度遠快</strong>於分散的隨機讀取。</p></li>
<li><p><strong>連續資料更有利於快取</strong>，使 CPU 能更有效率地計算 PQ 距離。</p></li>
</ul>
<p>這不僅提升了 PQ 距離計算的速度與可預測性，更有助於抵消將 PQ 碼儲存於 SSD 而非 DRAM 所產生的效能開銷。</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ 與 DISKANN：效能評估<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>在了解 AISAQ 與 DISKANN 在架構上的差異後，接下來的問題很明確：<strong>這些設計選擇在實際應用中會如何影響效能與資源使用？</strong>本次評估針對十億級規模下最關鍵的三大面向<strong>——搜尋效能、記憶體消耗及磁碟使用率——</strong>對 AISAQ 與 DISKANN 進行比較。</p>
<p>特別是，我們檢視當內嵌 PQ 資料量（<code translate="no">INLINE_PQ</code> ）變化時，AISAQ 的表現如何。此參數直接控制索引大小、磁碟 I/O 以及執行時效率之間的權衡。 此外，我們也針對<strong>低維度與高維度的向量工作負載</strong>對這兩種方法進行評估<strong>，因為維度會顯著影響距離計算的成本與</strong>儲存需求。</p>
<h3 id="Setup" class="common-anchor-header">實驗環境</h3><p>所有實驗均在單節點系統上進行，以隔離索引行為並避免網路或分散式系統效應造成的干擾。</p>
<p><strong>硬體配置：</strong></p>
<ul>
<li><p>CPU：AMD EPYC 9454P CPU @ 2.70GHz</p></li>
<li><p>記憶體：速度：3200 MT/s，類型：DDR4，容量：384 GB</p></li>
<li><p>儲存裝置：KIOXIA CM7 7.68 TB<sup>NVMe™</sup>SSD</p></li>
</ul>
<p><h6><em>AMD EPYC 是 Advanced Micro Devices, Inc. 的商標。</em></h6>
<h6><em>NVMe 是 NVM Express, Inc. 在美國及其他國家的註冊或未註冊商標。</em></h6></p>
<p><strong>索引建置參數</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>查詢參數</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">效能測試方法</h3><p>DISKANN 與 AISAQ 皆採用<a href="https://milvus.io/docs/knowhere.md">Knowhere</a> 進行測試，此為 Milvus 所使用的開源向量搜尋引擎。本次評估使用了兩組資料集：</p>
<ul>
<li><p><strong>SIFT128D（100 萬個向量）：</strong>一個廣為人知的 128 維基準資料集，常被用於影像描述子搜尋。<em>（原始資料集大小 ≈ 488 MB）</em></p></li>
<li><p><strong>Cohere768D（100 萬個向量）：</strong>一種典型的 768 維嵌入集，常用於基於 Transformer 的語義搜尋。<em>（原始資料集大小 ≈ 2930 MB）</em></p></li>
</ul>
<p>這些資料集反映了兩種截然不同的真實世界情境：緊湊的視覺特徵與大型語義嵌入。</p>
<h3 id="Results" class="common-anchor-header">結果</h3><p><strong>Sift128D1M（完整向量 ~488MB）</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>SIFT 召回率與延遲對比圖</span>
  
 </span></p>
<p><strong>Cohere768D1M（完整向量 約 2930 MB）</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Cohere 召回率與延遲對比圖</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">分析</h3><p><strong>SIFT128D 資料集</strong></p>
<p>在 SIFT128D 資料集上，當所有 PQ 資料均採用內聯方式（INLINE_PQ = 48），使每個節點所需的資料完全能容納於單一 4 KB SSD 頁面中時，AISAQ 的表現可與 DISKANN 匹敵。在此配置下，搜尋過程中所需的每一項資訊皆集中存放於同一位置：</p>
<ul>
<li><p>完整向量：512B</p></li>
<li><p>鄰居清單：48 × 4 + 4 = 196B</p></li>
<li><p>鄰居的 PQ 碼：48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>總計：3780B</p></li>
</ul>
<p>由於整個節點可容納於單一頁面內，每次存取僅需一次 I/O 操作，且 AISAQ 可避免對外部 PQ 資料進行隨機讀取。</p>
<p>然而，當僅有部分 PQ 資料被內聯時，其餘的 PQ 碼必須從磁碟的其他位置讀取（inline_pq 參數是為了優化 SSD 頁面的利用率而設定的，例如，inline_pq = 20 可讓兩個節點容納於單一 4KB 頁面中）。 這會引入額外的隨機 I/O 操作，導致 IOPS 需求急劇增加，進而造成效能下降。</p>
<p><strong>Cohere768D 資料集</strong></p>
<p>在 Cohere768D 資料集上，AISAQ 的表現比 DISKANN 低約 8%。原因在於一個 768 維向量根本無法容納於單一 4 KB SSD 頁面中：</p>
<ul>
<li><p>完整向量：3072B</p></li>
<li><p>鄰居清單：48 × 4 + 4 = 196B</p></li>
<li><p>鄰居的 PQ 碼：48 × (3072B × 0.04167) ≈ 6,144B</p></li>
<li><p>總計：9,412B（≈ 3 頁）</p></li>
</ul>
<p>在此情況下，即使所有 PQ 碼皆以內嵌方式儲存，每個節點仍會橫跨多個頁面。雖然 I/O 操作次數保持不變，但每次 I/O 都必須傳輸遠多於以往的資料量，導致 SSD 頻寬消耗速度大幅加快。 一旦頻寬成為限制因素，AISAQ 就無法與 DISKANN 並駕齊驅——特別是在高維度工作負載中，各節點的資料佔用空間會迅速增長。</p>
<p><strong>註：</strong></p>
<p>AISAQ 的儲存佈局通常會使磁碟上的索引大小增加<strong>3 至 5 倍</strong>。這是經過深思熟慮的權衡：完整向量、鄰居清單和 PQ 碼會共同存放於磁碟上，以便在搜尋過程中實現高效的單頁存取。 雖然這會增加 SSD 的使用量，但磁碟容量比 DRAM 便宜許多，且在處理大量資料時更容易擴展。</p>
<p>實際上，使用者可透過調整<code translate="no">INLINE_PQ</code> 及PQ壓縮比來微調此權衡。這些參數使系統能夠根據工作負載需求，在搜尋效能、磁碟佔用空間及整體系統成本之間取得平衡，而非受制於固定的記憶體限制。</p>
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
    </button></h2><p>現代硬體的經濟效益正在改變。DRAM 價格依然居高不下，而 SSD 效能則迅速提升——PCIe 5.0 硬碟如今已能提供超過<strong>14 GB/s</strong> 的頻寬。因此，將搜尋關鍵資料從昂貴的 DRAM 移轉至價格遠更實惠的 SSD 儲存裝置的架構，正變得越來越具吸引力。 由於 SSD<strong>的每 GB</strong>成本<strong>不到</strong>DRAM<strong>的 30 倍，</strong>這些差異已不再微不足道——它們對系統設計產生了實質性的影響。</p>
<p>AISAQ 正體現了這項轉變。 透過消除對大型、持續啟用記憶體分配的需求，它使向量搜尋系統能夠根據資料大小和工作負載需求進行擴展，而非受限於 DRAM 的限制。這種做法符合「全儲存（all-in-storage）」架構的更廣泛趨勢，在此架構中，高速 SSD 不僅在資料持久化方面，更在主動運算與搜尋中扮演核心角色。 透過提供「效能」與「擴展」兩種運作模式，AiSAQ 同時滿足語義搜尋（需最低延遲）與 RAG（需極高擴展性，但延遲可接受）的需求。</p>
<p>這項轉變不太可能僅限於向量資料庫。隨著開發人員重新審視關於「資料必須存放於何處才能達到可接受效能」的長期假設，類似的設計模式已開始在圖處理、時間序列分析，甚至傳統關聯式系統的部分領域中嶄露頭角。隨著硬體經濟性的持續演進，系統架構也將隨之演變。</p>
<p>有關此處討論之設計的更多詳細資訊，請參閱文件：</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus 文件</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus 文件</a></p></li>
</ul>
<p>若有疑問，或希望深入了解最新版 Milvus 的任何功能？歡迎加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>，或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交問題。您也可以預約 20 分鐘的一對一諮詢時段，透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 辦公時間獲得見解</a>、指導及問題解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">進一步了解 Milvus 2.6 的功能<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 正式推出：十億級別的經濟實惠向量搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介紹嵌入函式：Milvus 2.6 如何簡化向量化與語義搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus 中的 JSON 拆分：兼具靈活性與 88.9 倍加速的 JSON 篩選</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解鎖真正的實體層級檢索：Milvus 新增的「結構體陣列」與 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：對抗大型語言模型（LLM）訓練資料中重複項目的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮推向極限：Milvus 如何透過 RaBitQ 處理多達 3 倍的查詢量</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基準測試會說謊——向量資料庫值得接受真正的考驗 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 將 Kafka/Pulsar 替換為 Woodpecker </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">現實世界中的向量搜尋：如何在不犧牲召回率的情況下高效過濾結果</a></p></li>
</ul>
