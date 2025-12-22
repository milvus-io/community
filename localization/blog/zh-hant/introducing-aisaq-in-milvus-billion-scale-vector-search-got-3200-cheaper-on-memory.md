---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: '介紹 Milvus 中的 AISAQ：十億級向量搜尋在記憶體上的成本降低了 3,200 倍'
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
desc: 探索 Milvus 如何利用 AISAQ 將記憶體成本降低 3200 倍，在無需 DRAM 開銷的情況下實現可擴充的十億向量搜尋。
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>向量資料庫已經成為關鍵任務 AI 系統的核心基礎架構，而且其資料量正以指數級的速度成長 - 通常會達到數十億個向量。在這樣的規模下，一切都變得更困難：維持低延遲、保持精確度、確保可靠性，以及跨複本和區域運作。但有一項挑戰往往很早就會浮現，並且主導架構決策 - 成本<strong>。</strong></p>
<p>為了提供快速搜尋，大多數向量資料庫將關鍵索引結構保留在 DRAM (動態隨機存取記憶體)，也就是最快、最昂貴的記憶體層級。這種設計對於效能來說很有效，但擴充性卻很差。DRAM 的使用量會隨資料大小而擴充，而不是隨查詢流量而擴充，而且即使有壓縮或部分 SSD 卸載，索引的大部分仍必須保留在記憶體中。隨著資料集的成長，記憶體成本很快就會成為限制因素。</p>
<p>Milvus 已支援<strong>DISKANN</strong>，這是一種以磁碟為基礎的 ANN 方法，可將大部分索引移至 SSD 上，從而降低記憶體壓力。然而，DISKANN 在搜尋過程中使用的壓縮表示法仍依賴 DRAM。<a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a>在<a href="https://milvus.io/docs/diskann.md">DISKANN</a> 的啟發下，進一步採用<a href="https://milvus.io/docs/aisaq.md">AISAQ</a> 這個以磁碟為基礎的向量索引。AiSAQ 由 KIOXIA 開發，其架構設計採用「零 DRAM 足跡架構」，將所有搜尋關鍵資料儲存在磁碟上，並最佳化資料放置位置，以盡量減少 I/O 作業。在十億向量的工作負載中，記憶體使用量從<strong>32 GB</strong> <strong>減少</strong> <strong>到約 10 MB</strong>，減少了<strong>3,200 倍，同時</strong>維持實際效能。</p>
<p>在接下來的幾節中，我們將解釋基於圖的向量搜尋如何運作、記憶體成本從何而來，以及 AISAQ 如何重塑十億向量搜尋的成本曲線。</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">傳統圖形向量搜尋的運作方式<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>向量搜尋</strong>是在高維空間中尋找其數值表示最接近查詢的資料點的過程。"最接近」的意思是根據距離函數，例如余弦距離或 L2 距離，找出最小的距離。在小規模的情況下，這是很直接的：計算查詢與每個向量之間的距離，然後傳回最接近的向量。然而，在大規模的情況下，例如十億規模，這種方法很快就會變得太慢而不切實際。</p>
<p>為了避免鉅細無遺的比較，現代的近似近鄰搜尋 (ANNS) 系統依賴於<strong>圖表索引</strong>。索引不是將查詢與每個向量進行比較，而是將向量組織<strong>成圖</strong>。每個節點代表一個向量，而邊則連接數字上接近的向量。這種結構可讓系統大幅縮小搜尋空間。</p>
<p>圖形是事先建立的，完全基於向量之間的關係。它不取決於查詢。當查詢到達時，系統的任務就是<strong>有效率地瀏覽圖表</strong>，找出與查詢距離最小的向量，而無需掃描整個資料集。</p>
<p>搜尋從圖形中預先定義的<strong>入口點開始</strong>。這個起點可能遠離查詢點，但演算法會朝離查詢點較近的向量移動，逐步改善其位置。在這個過程中，搜尋會維護兩個共同運作的內部資料結構：一個<strong>候選清單</strong>和一個結<strong>果清單</strong>。</p>
<p>在這個過程中，最重要的兩個步驟是擴充候選列表和更新結果列表。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">擴充候選清單</h3><p><strong>候選清單</strong>代表搜尋的下一步。它是一組根據與查詢的距離排列的優先圖形節點。</p>
<p>在每次迭代時，演算法會</p>
<ul>
<li><p><strong>選擇目前發現的最接近的候選人。</strong>從候選清單中，選擇與查詢距離最小的向量。</p></li>
<li><p><strong>從圖表中擷取向量的鄰居。</strong>這些鄰居是在索引建構過程中被識別為接近目前向量的向量。</p></li>
<li><p><strong>評估未訪問的鄰居，並將其加入候選清單中。</strong>對於每個尚未探索過的鄰居，演算法會計算其與查詢的距離。之前造訪過的鄰居會被跳過，而新的鄰居如果看起來很有希望，就會被插入候選清單。</p></li>
</ul>
<p>透過反覆擴大候選清單，搜尋會探索圖表中越來越多的相關區域。這可讓演算法在僅檢查所有向量的一小部分時，就能穩定地獲得更好的答案。</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">更新結果清單</h3><p>與此同時，演算法會維護一個<strong>結果清單</strong>，記錄目前為止找到的最佳候選人，作為最終輸出。隨著搜尋的進行</p>
<ul>
<li><p><strong>追蹤遍歷過程中遇到的最接近向量。</strong>這些向量包括選定用來擴充的向量，以及沿途評估的其他向量。</p></li>
<li><p><strong>儲存它們與查詢的距離。</strong>這樣就可以對候選向量進行排序，並維持目前的前 K 最近鄰向量。</p></li>
</ul>
<p>隨著時間的推移，當更多的候選項被評估，而發現的改進較少時，結果清單就會穩定下來。一旦進一步的圖探索不太可能產生更接近的向量，搜尋就會終止，並返回結果清單作為最終答案。</p>
<p>簡單來說，<strong>候選清單會控制探索</strong>，而<strong>結果</strong> <strong>清單</strong>則會<strong>捕捉到目前發現的最佳答案</strong>。</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">基於圖表的向量搜尋中的權衡<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>這種以圖表為基礎的方法首先使得大規模向量搜尋變得實用。透過瀏覽圖形而不是掃描每個向量，系統可以找到高品質的結果，而只需碰觸資料集的一小部分。</p>
<p>然而，這種效率並不是免費的。基於圖形的搜尋暴露了<strong>精確度與成本</strong>之間的基本權衡<strong>。</strong></p>
<ul>
<li><p>探索更多的鄰居可以涵蓋圖表中更大的部分，減少遺漏真正近鄰的機會，從而提高精確度。</p></li>
<li><p>同時，每一次額外的擴充都會增加工作量：更多的距離計算、更多的圖形結構存取，以及更多的向量資料讀取。隨著搜尋的深入或擴大，這些成本就會累積起來。視索引的設計方式而定，它們會顯示為更高的 CPU 使用率、更大的記憶體壓力或額外的磁碟 I/O。</p></li>
</ul>
<p>在高召回率與資源使用效率之間取得平衡，是圖搜尋設計的核心。</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a>和<strong>AISAQ</strong>都是圍繞著相同的張力而建立的，但它們對於如何以及在何處支付這些成本做了不同的架構選擇。</p>
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
<p>DISKANN 是迄今最有影響力的磁碟式 ANN 解決方案，也是 NeurIPS Big ANN 大賽的官方基準，是十億規模向量搜尋的全球基準。它的重要性不僅在於效能，更在於它證明：<strong>基於圖表的 ANN 搜尋不一定要完全使用記憶體才能快速</strong>。</p>
<p>DISKANN 將固態硬碟機儲存與精心挑選的記憶體結構結合，證明大規模向量搜尋可以在商品硬體上達到高準確度與低延遲，而不需要大量的 DRAM 足跡。它是透過重新思考<em>哪些部分的搜尋必須快速</em>，<em>哪些部分可以容忍較慢的存取速度</em>來實現這一目<em>標</em>的。</p>
<p><strong>在高層級上，DISKANN 將存取最頻繁的資料保留在記憶體中，而將較大、存取較不頻繁的結構移到磁碟上。</strong>這種平衡是透過幾個關鍵的設計選擇來達成的。</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1.使用 PQ 距離來擴大候選清單</h3><p>擴充候選清單是基於圖的搜尋中最常見的作業。每次擴充都需要估計查詢向量與候選節點的鄰居之間的距離。如果使用完整的高維向量來執行這些計算，就需要頻繁地從磁碟隨機讀取資料，無論在計算上或 I/O 上都是昂貴的作業。</p>
<p>DISKANN 將向量壓縮成<strong>乘積量化 (PQ) 代碼</strong>，並將它們保存在記憶體中，從而避免了這種成本。PQ 碼比完整向量小很多，但仍保留足夠的資訊來近似估計距離。</p>
<p>在擴充候選向量時，DISKANN 會使用這些記憶體內的 PQ 代碼來計算距離，而不是從 SSD 讀取完整向量。這大幅降低了圖形遍歷過程中的磁碟 I/O，允許搜尋快速且有效率地擴充候選，同時將大部分 SSD 流量保持在關鍵路徑之外。</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2.將完整向量與鄰居清單共置於磁碟上</h3><p>並非所有資料都能近似壓縮或存取。一旦識別出有潛力的候選項目，搜尋仍然需要存取兩種類型的資料，才能得到精確的結果：</p>
<ul>
<li><p><strong>鄰居清單</strong>，以繼續圖形遍歷</p></li>
<li><p><strong>完整（未壓縮）向量</strong>，用於最終重排</p></li>
</ul>
<p>這些結構的存取頻率比 PQ 代碼低，因此 DISKANN 將它們儲存在 SSD 上。為了最小化磁碟開銷，DISKANN 將每個節點的鄰居列表和完整向量放在磁碟上的同一個實體區域。這可確保單一 SSD 讀取可同時擷取兩者。</p>
<p>透過共置相關資料，DISKANN 可減少搜尋期間所需的隨機磁碟存取次數。這項優化改善了擴充和重新排序的效率，尤其是在大規模的情況下。</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3.並行節點擴展以提高 SSD 利用率</h3><p>基於圖形的 ANN 搜尋是一個迭代過程。如果每次迭代只擴充一個候選節點，系統每次只會發出單次磁碟讀取，導致 SSD 的大部分平行頻寬未被使用。為了避免這種低效率的情況，DISKANN 會在每次迭代中擴展多個候選節點，並向 SSD 傳送平行讀取請求。這種方法可以更好地利用可用頻寬，並減少所需的總迭代次數。</p>
<p><strong>beam_width_ratio</strong>參數控制並行擴展的候選數：<strong>波束寬度 = CPU 核心數 × beam_width_ratio。</strong>較高的比率會擴大搜尋範圍，可能會提高精確度，但也會增加計算量和磁碟 I/O。</p>
<p>為了抵銷這個問題，DISKANN 引進了<code translate="no">search_cache_budget_gb_ratio</code> ，保留記憶體以快取頻繁存取的資料，減少 SSD 重複讀取的次數。這些機制共同幫助 DISKANN 在精確度、延遲和 I/O 效率之間取得平衡。</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">為什麼這很重要？</h3><p>DISKANN 的設計是磁碟式向量搜尋的一大進步。藉由將 PQ 代碼保留在記憶體中，並將較大的結構推送到 SSD，相較於完全在記憶體中的圖索引，DISKANN 大幅減少了記憶體佔用量。</p>
<p>與此同時，此架構仍<strong>依賴永遠在線的 DRAM</strong>來處理搜尋的關鍵資料。PQ 代碼、快取記憶體和控制結構必須保持駐留在記憶體中，以保持遍歷的效率。當資料集增加到數十億向量，部署也增加複本或區域時，記憶體需求仍可能成為限制因素。</p>
<p>這就是<strong>AISAQ</strong>所要解決的缺口。</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">AISAQ 如何運作及其重要性<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ 直接建基於 DISKANN 背後的核心理念，但引入了一個關鍵的轉變：它不再<strong>需要在 DRAM 中保留 PQ 資料</strong>。AISAQ 將壓縮向量移至 SSD，並重新設計圖形資料在磁碟上的佈局，以維持有效率的遍歷，而非將壓縮向量視為搜尋關鍵、永遠在記憶體中的結構。</p>
<p>為了實現這一目標，AISAQ 重組了節點儲存，使圖表搜尋時所需的資料 (完整向量、鄰居清單和 PQ 資訊) 以最佳化存取位置的模式排列在磁碟上。我們的目標不只是將更多資料推送到更經濟的磁碟，而是<strong>在不破壞前面所述的搜尋程序</strong>的情況下做到這一點。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>為了滿足不同的應用需求，AISAQ 提供了兩種基於磁碟的儲存模式：效能與規模。從技術角度來看，這兩種模式的差異主要在於 PQ 壓縮資料在搜尋過程中的儲存與存取方式。從應用程式的角度來看，這些模式可滿足兩種不同類型的需求：低延遲需求（線上語義搜尋和推薦系統的典型需求）和超高規模需求（RAG 的典型需求）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ 效能：速度最佳化</h3><p>AISAQ-performance 將所有資料保留在磁碟上，同時透過資料代管維持低 I/O 開銷。</p>
<p>在此模式下：</p>
<ul>
<li><p>每個節點的完整向量、邊緣列表及其鄰居的 PQ 代碼都一起儲存在磁碟上。</p></li>
<li><p>造訪節點仍然只需要<strong>讀取一次 SSD</strong>，因為候選人擴充和評估所需的所有資料都是集中在一起的。</p></li>
</ul>
<p>從搜尋演算法的角度來看，這非常接近 DISKANN 的存取模式。儘管所有關鍵搜尋資料現在都存放在磁碟上，候選人擴充仍然很有效率，而執行時間效能也不相上下。</p>
<p>取捨是儲存開銷。由於鄰居的 PQ 資料可能會出現在多個節點的磁碟頁中，因此此佈局會引入冗餘，並大幅增加整體索引大小。</p>
<p>因此，AISAQ-Performance 模式將低 I/O 延遲優先於磁碟效率。從應用程式的角度來看，AiSAQ-Performance 模式可以提供線上語意搜尋所需的 10 mSec 範圍內的延遲。</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ 規模：儲存效率最佳化</h3><p>AISAQ-Scale 採用相反的方法。它的設計目的是在 SSD 上保留所有資料的同時，將<strong>磁碟使用量降至最低</strong>。</p>
<p>在此模式下：</p>
<ul>
<li><p>PQ 資料會單獨儲存於磁碟上，沒有冗餘。</p></li>
<li><p>這可以消除冗餘，並大幅減少索引大小。</p></li>
</ul>
<p>權衡之下，存取節點及其鄰居的 PQ 代碼可能需要<strong>多次讀取 SSD</strong>，增加候選人擴充時的 I/O 作業。如果不加以優化，搜尋速度會大幅減慢。</p>
<p>為了控制這個開銷，AISAQ-Scale 模式引入了兩個額外的最佳化：</p>
<ul>
<li><p><strong>PQ 資料重新排列</strong>，依存取優先順序排列 PQ 向量，以改善位置性並減少隨機讀取。</p></li>
<li><p><strong>DRAM 中的 PQ 快取記憶體</strong>(<code translate="no">pq_read_page_cache_size</code>)，可儲存經常存取的 PQ 資料，避免重複讀取磁碟上的熱門項目。</p></li>
</ul>
<p>透過這些最佳化，AISAQ-Scale 模式達到比 AISAQ-Performance 更佳的儲存效率，同時維持實際的搜尋效能。該效能仍低於 DISKANN，但沒有儲存開銷 (索引大小與 DISKANN 相似)，且記憶體佔用量大幅減少。從應用的角度來看，AiSAQ 提供了在超高規模下滿足 RAG 要求的方法。</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">AISAQ 的主要優勢</h3><p>AISAQ 將所有關鍵搜尋資料移至磁碟，並重新設計資料的存取方式，從根本上改變了以圖表為基礎的向量搜尋的成本與擴充性。它的設計提供了三個顯著的優勢。</p>
<p><strong>1.DRAM 使用量最多可降低 3,200 倍</strong></p>
<p>乘積量化 (Product Quantization) 可顯著縮小高維向量的大小，但在十億級的規模下，記憶體佔用量仍相當可觀。在傳統設計中，即使經過壓縮，PQ 代碼在搜尋過程中仍必須保留在記憶體中。</p>
<p>舉例來說，在<strong>SIFT1B</strong> 這個擁有十億個 128 維向量的基準上，光是 PQ 代碼就需要大約<strong>30-120 GB 的 DRAM</strong>，視配置而定。儲存完整、未壓縮的向量則需要額外的<strong>~480 GB</strong>。雖然 PQ 將記憶體使用量降低了 4-16倍，但剩餘的佔用空間仍然大到足以支配基礎架構成本。</p>
<p>AISAQ 完全消除了這個需求。透過將 PQ 代碼儲存於 SSD 而非 DRAM，記憶體不再被持久性索引資料所消耗。DRAM 僅用於輕量、暫態結構，例如候選清單及控制元資料。實際上，這可將記憶體使用量從數十 GB 減少到<strong>約 10 MB</strong>。在具有代表性的十億級配置中，DRAM 從<strong>32 GB 降至 10 MB</strong>，<strong>降低了 3,200 倍</strong>。</p>
<p>鑑於 SSD 儲存的<strong>單位容量</strong>成本約為 DRAM<strong>的 1/30</strong>，因此這種轉變對總系統成本有直接且顯著的影響。</p>
<p><strong>2.無額外 I/O 開銷</strong></p>
<p>將 PQ 代碼從記憶體移至磁碟通常會增加搜尋期間的 I/O 作業。AISAQ 透過仔細控制<strong>資料佈局和存取模式</strong>來避免這個問題。AISAQ 並未將相關資料分散到磁碟上，而是將 PQ 代碼、完整向量和鄰居清單共置一處，以便一起檢索。這可確保候選人擴充不會帶來額外的隨機讀取。</p>
<p>為了讓使用者控制索引大小與 I/O 效率之間的取捨，AISAQ 引進了<code translate="no">inline_pq</code> 參數，決定每個節點內嵌儲存多少 PQ 資料：</p>
<ul>
<li><p><strong>較低的 inline_pq：</strong>較小的索引大小，但可能需要額外的 I/O</p></li>
<li><p><strong>較高的 inline_pq：</strong>索引大小較大，但可保留單讀取存取。</p></li>
</ul>
<p>當配置為<strong>inline_pq = max_degree</strong>，AISAQ 會在一次磁碟操作中讀取節點的完整向量、鄰居清單和所有 PQ 代碼，符合 DISKANN 的 I/O 模式，同時將所有資料保留在 SSD 上。</p>
<p><strong>3.順序 PQ 存取提高計算效率</strong></p>
<p>在 DISKANN 中，擴充候選節點需要 R 次隨機存取記憶體，以取得其 R 個鄰居的 PQ 代碼。AISAQ 透過單次 I/O 擷取所有 PQ 代碼，並將它們依序儲存在磁碟上，消除了這種隨機性。</p>
<p>順序佈局提供了兩個重要的優點：</p>
<ul>
<li><p><strong>順序的 SSD 讀取</strong>比分散的隨機讀取<strong>快得多</strong>。</p></li>
<li><p><strong>連續資料對快取記憶體較為友善</strong>，可讓 CPU 更有效率地計算 PQ 距離。</p></li>
</ul>
<p>這可提高 PQ 距離計算的速度和可預測性，並有助於抵銷在 SSD 而非 DRAM 上儲存 PQ 代碼的效能成本。</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs. DISKANN：效能評估<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>瞭解 AISAQ 與 DISKANN 在架構上的差異之後，下一個問題就很直接了：<strong>這些設計選擇在實際上對效能和資源使用有何影響？</strong>本評估將比較 AISAQ 和 DISKANN 在<strong>搜尋效能、記憶體消耗和磁碟使用量</strong>這三個在十億規模上最重要的層面。</p>
<p>我們特別檢視 AISAQ 在內嵌 PQ 資料數量 (<code translate="no">INLINE_PQ</code>) 變化時的表現。這個參數直接控制索引大小、磁碟 I/O 和執行效率之間的權衡。我們也在<strong>低維和高維向量工作負載</strong>上評估這兩種方法<strong>，因為維度會強烈影響距離計算的成本和</strong>儲存需求。</p>
<h3 id="Setup" class="common-anchor-header">實驗設定</h3><p>所有實驗都在單結點系統上進行，以隔離索引行為，避免網路或分散式系統效應的干擾。</p>
<p><strong>硬體配置：</strong></p>
<ul>
<li><p>CPU：Intel® Xeon® Platinum 8375C CPU @ 2.90GHz</p></li>
<li><p>記憶體：速度: 3200 MT/秒, 類型：DDR4, 大小: 32 GB</p></li>
<li><p>磁碟：500 GB NVMe SSD</p></li>
</ul>
<p><strong>索引建立參數</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>查詢參數</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">基準方法</h3><p>DISKANN 和 AISAQ 都使用 Milvus 使用的開放原始碼向量搜尋引擎<a href="https://milvus.io/docs/knowhere.md">Knowhere</a> 進行測試。本次評估使用了兩個資料集：</p>
<ul>
<li><p><strong>SIFT128D (1M 向量)：</strong>著名的 128 維基準，常用於影像描述符搜尋。<em>(原始資料集大小 ≈ 488 MB）</em></p></li>
<li><p><strong>Cohere768D (1M vectors)：</strong>一個 768 維嵌入集，典型用於基於轉換器的語意搜尋。<em>(原始資料集大小 ≈ 2930 MB）</em></p></li>
</ul>
<p>這些資料集反映了兩個截然不同的真實世界情境：小巧的視覺特徵和大型的語意嵌入。</p>
<h3 id="Results" class="common-anchor-header">結果</h3><p><strong>Sift128D1M (全向量 ~488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_53da7b566a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (完整向量 ~2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">分析結果</h3><p><strong>SIFT128D 資料集</strong></p>
<p>在 SIFT128D 資料集上，當所有 PQ 資料都內嵌到單一 4 KB SSD 頁面時 (INLINE_PQ = 48)，AISAQ 的效能可媲美 DISKANN。在此配置下，搜尋過程中所需的每項資訊都是共址的：</p>
<ul>
<li><p>全向量：512B</p></li>
<li><p>鄰居列表：48 × 4 + 4 = 196B</p></li>
<li><p>鄰居的 PQ 代碼：48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>總計：3780B</p></li>
</ul>
<p>由於整個節點可容納在一個頁面內，因此每次存取只需要一次 I/O，而且 AISAQ 可避免隨機讀取外部 PQ 資料。</p>
<p>然而，當只有部分 PQ 資料內嵌時，其餘的 PQ 代碼必須從磁碟上的其他地方取得。這會引入額外的隨機 I/O 作業，大幅增加 IOPS 需求，導致效能大幅下降。</p>
<p><strong>Cohere768D 資料集</strong></p>
<p>在 Cohere768D 資料集上，AISAQ 的效能比 DISKANN 差。原因是 768 維向量根本無法放入一個 4 KB 的 SSD 頁面：</p>
<ul>
<li><p>完整向量：3072B</p></li>
<li><p>鄰居列表：48 × 4 + 4 = 196B</p></li>
<li><p>鄰居的 PQ 代碼：48 × (3072B × 0.125) ≈ 18432B</p></li>
<li><p>總計：21,700 B (≈ 6 頁)</p></li>
</ul>
<p>在這種情況下，即使所有 PQ 代碼都內嵌，每個節點仍會跨越多個頁面。雖然 I/O 作業的次數保持一致，但每次 I/O 必須傳輸更多資料，因此 SSD 頻寬的消耗速度會更快。一旦頻寬成為限制因素，AISAQ 就無法跟上 DISKANN 的步伐，尤其是在高維工作負載上，每個節點的資料足跡會快速增加。</p>
<p><strong>請注意：</strong></p>
<p>AISAQ 的儲存配置通常會將磁碟上的索引大小增加<strong>4 到 6 倍</strong>。這是刻意權衡的結果：全向量、鄰接列表和 PQ 代碼都集中在磁碟上，以便在搜尋時進行有效率的單頁存取。雖然這會增加 SSD 的使用量，但磁碟容量比 DRAM 便宜得多，而且在大量資料時更容易擴充。</p>
<p>實際上，使用者可透過調整<code translate="no">INLINE_PQ</code> 和 PQ 壓縮比率來調整這種取捨。這些參數可根據工作負載需求，平衡搜尋效能、磁碟佔用空間和整體系統成本，而不是受限於固定的記憶體限制。</p>
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
    </button></h2><p>現代硬體的經濟效益正在改變。DRAM 價格居高不下，而固態硬碟機的效能卻突飛猛進 -CIe 5.0 硬碟機現在的頻寬已超過<strong>14 GB/秒</strong>。因此，將搜索關鍵資料從昂貴的 DRAM 轉移到更經濟實惠的 SSD 儲存的架構，正變得越來越有吸引力。固態硬碟機容量的<strong>每 GB</strong>成本<strong>不到</strong>DRAM 的<strong>30 倍</strong>，這些差異不再是微不足道，而是會影響系統設計。</p>
<p>AISAQ 反映了這一轉變。AISAQ 不需要大量永遠開啟的記憶體分配，因此向量搜尋系統可以根據資料大小和工作負載需求而非 DRAM 限制進行擴充。此方法符合「全儲存」架構的大趨勢，在此架構中，快速固態硬碟機不僅在持久性方面扮演核心角色，在主動運算和搜尋方面也是如此。AiSAQ 提供效能與規模兩種作業模式，可滿足語意搜尋 (需要最低延遲) 與 RAG (需要極高規模，但延遲適中) 的需求。</p>
<p>這種轉變不太可能僅限於向量資料庫。類似的設計模式已經出現在圖表處理、時序分析，甚至是傳統關係系統的某些部分，因為開發人員重新思考長久以來的假設：資料必須存放在何處才能達到可接受的效能。隨著硬體經濟的持續發展，系統架構也會跟著改變。</p>
<p>有關本文所討論設計的詳細資訊，請參閱說明文件：</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus 文件</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus 文件</a></p></li>
</ul>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的了解、指導和問題解答。</p>
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
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解鎖真正的實體層級檢索：Milvus 中新的結構陣列與 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：對抗 LLM 訓練資料中重複資料的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮發揮到極致：Milvus 如何利用 RaBitQ 提供多 3 倍的查詢服務</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基準會說謊 - 向量資料庫應該接受真正的測試 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">現實世界中的向量搜尋：如何有效率地過濾而不損害回復率</a></p></li>
</ul>
