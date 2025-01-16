---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: 論文閱讀｜HM-ANN 當 ANNS 遇上異質記憶體
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: HM-ANN 在異質記憶體上高效的十億點最近鄰搜索
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>論文閱讀 ｜ HM-ANN: 當ANNS遇上異質記憶體</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: Efficient Billion-Point Nearest Neighbor Search on Heterogenous Memory</a>是一篇已被 2020 年神經信息處理系統會議<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020</a>) 接受的研究論文。本文提出了一種新穎的圖基類似性搜尋演算法，稱為 HM-ANN。此演算法同時考量了現代硬體設定中的記憶體異質性和資料異質性。HM-ANN 不需要壓縮技術就能在單一機器上進行十億級的相似性搜尋。異質記憶體 (HM) 代表快速但小的動態隨機存取記憶體 (DRAM) 與慢速但大的持久性記憶體 (PMem) 的組合。HM-ANN 可達到低搜尋延遲和高搜尋準確度，尤其是當資料集無法放入 DRAM 時。與最先進的近似近鄰 (ANN) 搜尋解決方案相比，此演算法具有明顯的優勢。</p>
<custom-h1>動機</custom-h1><p>由於 DRAM 容量有限，ANN 搜尋演算法從一開始就在查詢精確度與查詢延遲之間做了基本的取捨。若要在 DRAM 中儲存索引以進行快速查詢存取，就必須限制資料點的數量或儲存壓縮向量，這兩種方法都會損害搜尋準確度。圖形索引（例如 Hierarchical Navigable Small World，HNSW）擁有優異的查詢執行時效能和查詢精確度。但是，在十億級資料集上運作時，這些索引也會消耗 1-TiB 級的 DRAM。</p>
<p>要避免讓 DRAM 以原始格式儲存十億級資料集，還有其他變通的方法。當資料集太大而無法放入單一機器的記憶體時，就會使用資料集點的乘積量化等壓縮方法。但由於量化過程中會損失精確度，因此使用壓縮資料集的索引召回率通常很低。Subramanya 等人 [1] 探索利用固態硬碟機 (SSD) 來實現十億規模的單機 ANN 搜尋，其方法稱為 Disk-ANN，原始資料集儲存於 SSD，壓縮表示則儲存於 DRAM。</p>
<custom-h1>異質記憶體簡介</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>異質記憶體 (HM) 代表速度快但容量小的 DRAM 與速度慢但容量大的 PMem 的組合。DRAM 是每個現代伺服器都有的一般硬體，其存取速度相對較快。新的 PMem 技術，例如 Intel® Optane™ DC 持久記憶體模組，彌補了以 NAND 為基礎的快閃記憶體 (SSD) 與 DRAM 之間的差距，消除了 I/O 瓶頸。PMem 像 SSD 一樣耐用，也像記憶體一樣可由 CPU 直接寻址。Renen 等人 [2] 發現，在配置的實驗環境中，PMem 的讀取頻寬比 DRAM 低 2.6 倍，寫入頻寬比 DRAM 低 7.5 倍。</p>
<custom-h1>HM-ANN 設計</custom-h1><p>HM-ANN 是一種精確且快速的十億尺度 ANN 搜尋演算法，可在單機上執行，無須壓縮。HM-ANN 的設計概括了 HNSW 的想法，其層次結構自然地與 HM 吻合。HNSW 由多層組成 - 只有第 0 層包含整個資料集，其餘每一層都包含其正下層的元素子集。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>上層的元素只包含資料集的子集，只佔整個儲存空間的一小部分。這一觀察使它們成為放置在 DRAM 中的合適候選。如此一來，HM-ANN 上的大部分搜尋預計都會發生在上層，這樣就能最大限度地利用 DRAM 的快速存取特性。然而，在 HNSW 的情況下，大多數的搜尋都發生在底層。</li>
<li>由於存取第 0 層的速度較慢，因此最好每次查詢只存取一小部分，並降低存取頻率。</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">圖形建構演算法<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>HM-ANN 構建的主要想法是建立高品質的上層，以便為第 0 層的搜尋提供更好的導航。 因此，大部分的記憶體存取都發生在 DRAM 中，而 PMem 中的存取則會減少。為了做到這一點，HM-ANN 的建構演算法有一個由上而下的插入階段和一個由下而上的提升階段。</p>
<p>自上而下的插入階段會在 PMem 上放置最底層時，建立一個可瀏覽的小世界圖形。</p>
<p>自下而上的提升階段則是在不損失太多精確度的情況下，從最底層提升樞軸點，以形成放置在 DRAM 上的上層。如果在第 1 層建立了第 0 層元素的高品質投影，則在第 0 層進行搜尋時，只需跳幾下就能找到查詢的精確近鄰。</p>
<ul>
<li>HM-ANN 並非使用 HNSW 的隨機選擇進行晉升，而是使用高程度晉升策略，將第 0 層中具有最高程度的元素晉升到第 1 層。對於更高的層，HM-ANN 會根據升級率將高程度節點升級到上層。</li>
<li>HM-ANN 會將更多節點從第 0 層升級到第 1 層，並為第 1 層的每個元素設定較大的最大鄰居數。上層節點的數量由可用的 DRAM 空間決定。由於第 0 層不儲存在 DRAM 中，因此使儲存在 DRAM 中的每一層更密集，可以提高搜尋品質。</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">圖搜尋演算法<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>搜尋演算法包含兩個階段：快速記憶體搜尋和具有預取功能的平行第 0 層搜尋。</p>
<h3 id="Fast-memory-search" class="common-anchor-header">快速記憶體搜尋</h3><p>與 HNSW 相同，在 DRAM 中的搜尋從頂層的入口點開始，然後從頂層到第 2 層執行 1-greedy 搜尋。為了縮小第 0 層的搜尋空間，HM-ANN 在第 1 層執行搜尋，搜尋預算為<code translate="no">efSearchL1</code> ，這限制了第 1 層候選清單的大小。而 HNSW 只使用一個入口點，因此 HM-ANN 會比其他兩層之間的空隙更特別地處理第 0 層與第 1 層之間的空隙。</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">具有預取功能的第 0 層平行搜尋</h3><p>在底層，HM-ANN 會平均分割前述從第 1 層搜尋出來的候選人，並將其視為入口點，以執行具有線程的平行多起點 1-greedy 搜尋。收集每次搜尋的頂端候選人，找出最佳候選人。眾所周知，從第 1 層下到第 0 層正好是到 PMem，平行搜尋隱藏了 PMem 的延遲，並充分利用記憶體頻寬，在不增加搜尋時間的情況下提高搜尋品質。</p>
<p>HM-ANN 在 DRAM 中實作一個軟體管理的緩衝區，在記憶體存取發生之前從 PMem 預先擷取資料。搜尋第 1 層時，HM-ANN 會非同步地將<code translate="no">efSearchL1</code> 中那些候選元素的鄰近元素以及第 1 層中鄰近元素的連線從 PMem 複製到緩衝區。當在第 0 層進行搜尋時，有一部分要存取的資料已經預先寫入 DRAM，這隱藏了存取 PMem 的延遲，並縮短了查詢時間。這符合 HM-ANN 的設計目標，即大部分記憶體存取發生在 DRAM 中，而 PMem 中的記憶體存取會減少。</p>
<custom-h1>評估</custom-h1><p>本文進行了廣泛的評估。所有實驗都是在搭載 Intel Xeon Gold 6252 CPU@2.3GHz 的機器上進行。它使用 DDR4 (96GB) 作為快速記憶體，Optane DC PMM (1.5TB) 作為慢速記憶體。評估了五個資料集：BIGANN、DEEP1B、SIFT1M、DEEP1M 和 GIST1M。在十億尺度測試中，包含以下方案：基於量化的十億尺度方法 (IMI+OPQ 和 L&amp;C)、基於非壓縮的方法 (HNSW 和 NSG)。</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">十億尺度演算法比較<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>表 1 比較了不同圖形索引的建立時間和儲存空間。HNSW 的建立時間最短，HM-ANN 則比 HNSW 多花 8%。就整個儲存空間使用量而言，HM-ANN 索引比 HSNW 大 5-13%，因為它將更多節點從第 0 層提升到第 1 層。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>圖 1 分析了不同索引的查詢效能。圖 1 (a) 和 (b) 顯示 HM-ANN 在 1ms 之內達到 &gt; 95% 的 top-1 召回率。圖 1 © 和 (d) 顯示 HM-ANN 在 4 毫秒內取得 &gt; 90% 的 top-100 召回率。與其他所有方法相比，HM-ANN 提供了最佳的延遲召回率效能。</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">百萬尺度演算法比較<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>在圖 2 中，分析了不同索引在純 DRAM 設定下的查詢效能。HNSW、NSG 和 HM-ANN 使用三個以 DRAM 擬合的百萬尺度資料集進行評估。HM-ANN 仍然比 HNSW 取得更好的查詢效能。原因是 HM-ANN 的總距離計算次數 (平均 850 次/查詢) 低於 HNSW (平均 900 次/查詢)，以達到 99% 的召回目標。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">高程度推廣的效果<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>在圖 3 中，在相同的配置下，隨機推廣策略和高程度推廣策略進行了比較。高degree 推廣優於基線。在達到 95%、99% 和 99.5% 的召回目標時，高程度推廣的表現分別比隨機推廣快 1.8 倍、4.3 倍和 3.9 倍。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">記憶體管理技術的效能優勢<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>圖 5 包含 HNSW 與 HM-ANN 之間的一系列步驟，以顯示 HM-ANN 的每項最佳化對其改善的貢獻。BP 代表建立索引時的 Bottom-up Promotion。PL0 代表 Parallel layer-0 search，而 DP 代表從 PMem 到 DRAM 的資料預取。一步一步地，HM-ANN 的搜尋效能進一步提升。</p>
<custom-h1>結論</custom-h1><p>一種新的圖形索引與搜尋演算法，稱為 HM-ANN，將圖形 ANN 的分層設計與 HM 的記憶體異質性相結合。評估結果顯示，HM-ANN 在十億點資料集中屬於最先進的新索引。</p>
<p>我們注意到在學術界和產業界都有一個趨勢，那就是在持久性儲存裝置上建立索引成為焦點。為了減輕 DRAM 的壓力，Disk-ANN [1] 是建立在 SSD 上的索引，其吞吐量明顯低於 PMem。 然而，HM-ANN 的建立仍需要數天的時間，與 Disk-ANN 相比並沒有巨大的差異。我們相信，當我們更小心地利用 PMem 的特性時，就有可能優化 HM-ANN 的建立時間，例如，注意 PMem 的粒度 (256 Bytes)，並使用串流指令來繞過快取記憶體。我們也相信未來會有更多使用耐久性儲存裝置的方法被提出。</p>
<custom-h1>參考資料</custom-h1><p>[1]:Suhas Jayaram Subramanya and Devvrit and Rohan Kadekodi and Ravishankar Krishaswamy and Ravishankar Krishaswamy：DiskANN：在單一節點上進行快速精確的十億點最近鄰搜索，NIPS，2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN：在單一節點上進行快速精確的十億點最近鄰搜索 - 微軟研究院</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN：在單一節點上進行快速精確的十億點最近鄰搜索</a></p>
<p>[2]:Alexander van Renen and Lukas Vogel and Viktor Leis and Thomas Neumann and Alfons Kemper：Persistent Memory I/O Primitives, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">持久記憶體 I/O 基元</a></p>
