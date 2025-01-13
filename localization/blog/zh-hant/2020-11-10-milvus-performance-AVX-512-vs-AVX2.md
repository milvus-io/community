---
id: milvus-performance-AVX-512-vs-AVX2.md
title: 什麼是進階向量擴充？
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: 使用各種不同的向量索引，探索 Milvus 在 AVX-512 與 AVX2 上的表現。
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Milvus 在 AVX-512 與 AVX2 上的效能比較</custom-h1><p>有意識的智慧型機器想要接管世界，是科幻小說中的常客，但現實中的現代電腦卻非常聽話。在沒有被告知的情況下，它們很少知道自己該做什麼。電腦根據從程式傳送到處理器的指令或命令來執行任務。一般而言，在電腦的彙編語言中，每條機器語言語句對應一個處理器指令。中央處理器 (CPU) 依賴指令來執行計算和控制系統。此外，CPU 的效能通常是以指令執行能力（如執行時間）來衡量。</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">什麼是進階向量擴充？<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>進階向量擴充 (AVX) 是依賴 x86 系列指令集架構的微處理器的指令集。AVX 由 Intel 於 2008 年 3 月首次提出，三年後隨著 Sandy Bridge (用於第二代 Intel Core 處理器 (例如 Core i7、i5、i3) 的微架構) 以及 AMD 於 2011 年推出的競爭微架構 Bulldozer 的推出，AVX 獲得廣泛支持。</p>
<p>AVX 引入了新的編碼方案、新功能和新指令。AVX2 將大部分的整數運算擴充至 256 位元，並引進融合乘法累加 (FMA) 運算。AVX-512 使用新的增強向量擴充 (EVEX) 前綴編碼，將 AVX 擴充至 512 位元的操作。</p>
<p><a href="https://milvus.io/docs">Milvus</a>是一個開放原始碼向量資料庫，專為相似性搜尋和人工智慧 (AI) 應用而設計。該平台支援 AVX-512 指令集，這意味著它可以在所有包含 AVX-512 指令的 CPU 上使用。Milvus 的應用範圍廣泛，涵蓋推薦系統、電腦視覺、自然語言處理 (NLP) 等。本文將介紹 Milvus 向量資料庫在 AVX-512 和 AVX2 上的效能結果與分析。</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Milvus 在 AVX-512 與 AVX2 上的效能比較<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">系統配置</h3><ul>
<li>CPU：Intel® Platinum 8163 CPU @ 2.50GHz24 核心 48 線程</li>
<li>CPU 數量：2</li>
<li>顯示卡, GeForce RTX 2080Ti 11GB 4 卡</li>
<li>記憶體：768GB</li>
<li>磁碟：2TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Milvus 參數</h3><ul>
<li>cahce.cahe_size: 25, CPU 用來快取資料的記憶體大小，以加快查詢速度。</li>
<li>nlist：4096</li>
<li>nprobe：128</li>
</ul>
<p>注意：<code translate="no">nlist</code> 是從客戶端建立的索引參數；<code translate="no">nprobe</code> 是搜尋參數。IVF_FLAT 和 IVF_SQ8 都使用聚類演算法將大量向量分割成桶，<code translate="no">nlist</code> 是聚類時要分割的桶的總數。查詢的第一步是找出最接近目標向量的水桶數目，第二步是比較向量的距離，找出這些水桶中的 top-k 向量。<code translate="no">nprobe</code> 指第一步中的水桶數目。</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">資料集：SIFT10M 資料集</h3><p>這些測試使用<a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">SIFT10M 資料集</a>，該資料<a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">集</a>包含一百萬個 128 維向量，通常用於分析相應近鄰搜尋方法的效能。nq = [1、10、100、500、1000] 的 top-1 搜尋時間將在兩個指令集之間進行比較。</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">向量索引類型的結果</h3><p>向量<a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">索引</a>是利用各種數學模型在集合的向量場上建立的節省時間和空間的資料結構。當嘗試找出與輸入向量相似的向量時，向量索引可以有效率地搜尋大型資料集。由於精確檢索非常耗時，<a href="https://milvus.io/docs/v2.0.x/index.md#CPU">Milvus 支援的</a>大部分索引類型都使用近似近鄰 (ANN) 搜尋。</p>
<p>在這些測試中，AVX-512 和 AVX2 使用了三種索引：IVF_FLAT、IVF_SQ8 和 HNSW。</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>反向檔案 (IVF_FLAT) 是基於量化的索引類型。它是最基本的 IVF 索引，每個單元中儲存的編碼資料與原始資料一致。 該索引將向量資料分成若干叢集單元 (nlist)，然後比較目標輸入向量與每個叢集中心的距離。根據系統設定查詢的叢集數量 (nprobe)，相似性搜尋結果只會根據目標輸入與最相似叢集中向量的比較結果傳回 - 大幅縮短查詢時間。透過調整 nprobe，可以在特定情況下找到精確度與速度之間的理想平衡。</p>
<p><strong>效能結果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT 不會執行任何壓縮，因此其產生的索引檔案大小與原始的非索引向量資料大致相同。當磁碟、CPU 或 GPU 記憶體資源有限時，IVF_SQ8 是比 IVF_FLAT 更好的選擇。 這種索引類型可以透過執行標量量化，將原始向量的每個維度從四位元浮點數轉換成一位元無符整數。這樣可以減少 70-75% 的磁碟、CPU 和 GPU 記憶體消耗。</p>
<p><strong>效能結果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>Hierarchical Small World Graph (HNSW) 是一種基於圖的索引演算法。查詢從最上層開始，先找出最接近目標的節點，然後再下到下一層進行另一輪搜尋。經過多次迭代後，它可以快速接近目標位置。</p>
<p><strong>效能結果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">比較向量索引<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>在 AVX-512 指令集上，向量擷取的速度始終比 AVX2 快。這是因為 AVX-512 支援 512 位元計算，而 AVX2 僅支援 256 位元計算。理論上，AVX-512 的速度應該是 AVX2 的兩倍，但是 Milvus 除了向量相似性計算之外，還執行其他耗時的任務。在實際情況下，AVX-512 的整體擷取時間不太可能是 AVX2 的兩倍。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>在 HNSW 索引上，檢索速度明顯快於其他兩個索引，而在兩個指令集上，IVF_SQ8 的檢索速度都略快於 IVF_FLAT。這可能是因為 IVF_SQ8 只需要 IVF_FLAT 所需記憶體的 25%。IVF_SQ8 為每個向量維度載入 1 個位元組，而 IVF_FLAT 則為每個向量維度載入 4 個位元組。計算所需的時間很可能受到記憶體頻寬的限制。因此，IVF_SQ8 不僅佔用較少的空間，擷取向量所需的時間也較少。</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus 是多功能、高效能的向量資料庫<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>本文所提出的測試證明，Milvus 在 AVX-512 和 AVX2 指令集上使用不同的索引，都能提供優異的效能。不論索引類型為何，Milvus 在 AVX-512 上的表現都較好。</p>
<p>Milvus 與多種深度學習平台相容，並用於各種 AI 應用。<a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0</a> 是全球最受歡迎向量資料庫的重構版本，已於 2021 年 7 月以開放原始碼授權釋出。如需更多關於此專案的資訊，請參閱下列資源：</p>
<ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上尋找 Milvus 或為 Milvus 做出貢獻。</li>
<li>透過<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 與社群互動。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上與我們連線。</li>
</ul>
