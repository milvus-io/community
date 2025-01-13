---
id: scheduling-query-tasks-milvus.md
title: 背景資料
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: 幕後工作
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Milvus 如何排程查詢任務</custom-h1><p>本文將討論 Milvus 如何排程查詢任務。我們也會討論實施 Milvus 排程的問題、解決方案和未來方向。</p>
<h2 id="Background" class="common-anchor-header">背景資料<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>從大規模向量搜尋引擎的資料管理中，我們知道向量相似性搜尋是透過兩個向量在高維空間中的距離來實現的。向量搜尋的目標是找出最接近目標向量的 K 個向量。</p>
<p>測量向量距離的方法有很多，例如歐氏距離：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euclidean-distance.png</span> </span></p>
<p>其中 x 和 y 是兩個向量。n 是向量的維度。</p>
<p>為了找出資料集中最近的 K 個向量，需要計算目標向量與要搜尋的資料集中所有向量之間的歐氏距離。然後，向量會依距離排序，以獲得 K 個最近的向量。計算工作與資料集的大小成正比。資料集越大，查詢所需的計算工作就越多。專門用於圖形處理的 GPU 恰好有很多核心，可以提供所需的運算能力。因此，在 Milvus 實作過程中也會考慮到多 GPU 支援。</p>
<h2 id="Basic-concepts" class="common-anchor-header">基本概念<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">資料區（TableFile）</h3><p>為了提高對大規模資料搜尋的支援，我們優化了 Milvus 的資料儲存。Milvus 將表中的資料按大小分割成多個資料區塊。在向量搜尋時，Milvus 會在每個資料區塊中搜尋向量，然後合併結果。一個向量搜尋作業包含 N 個獨立的向量搜尋作業 (N 是資料區塊的數量) 和 N-1 個結果合併作業。</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">任務佇列（TaskTable）</h3><p>每個資源都有一個任務陣列，記錄屬於該資源的任務。每個任務都有不同的狀態，包括 Start、Loading、Loaded、Executing 和 Executed。計算裝置中的 Loader 和 Executor 共用相同的任務佇列。</p>
<h3 id="Query-scheduling" class="common-anchor-header">查詢排程</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-query-scheduling.png</span> </span></p>
<ol>
<li>當 Milvus 伺服器啟動時，Milvus 會透過<code translate="no">server_config.yaml</code> 配置檔案中的<code translate="no">gpu_resource_config</code> 參數啟動相應的 GpuResource。DiskResource 和 CpuResource 仍然無法在<code translate="no">server_config.yaml</code> 中編輯。GpuResource 是<code translate="no">search_resources</code> 和<code translate="no">build_index_resources</code> 的組合，在以下範例中稱為<code translate="no">{gpu0, gpu1}</code> ：</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-sample-code.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-example.png</span> </span></p>
<ol start="2">
<li>Milvus 接收到一個請求。表元資料儲存在外部資料庫中，單一主機為 SQLite 或 MySQl，分散式為 MySQL。收到搜尋請求後，Milvus 會驗證該表是否存在，以及維度是否一致。然後，Milvus 讀取該表的 TableFile 清單。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-reads-tablefile-list.png</span> </span></p>
<ol start="3">
<li>Milvus 建立一個 SearchTask。因為每個 TableFile 的計算都是獨立進行的，所以 Milvus 會為每個 TableFile 建立一個 SearchTask。作為任務排程的基本單位，SearchTask 包含目標向量、搜尋參數和 TableFile 的檔案名稱。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvus 選擇運算裝置。SearchTask 執行計算的裝置取決於每個裝置的<strong>估計完成</strong>時間。<strong>估計完成</strong>時間指定目前時間與估計計算完成時間之間的估計間隔。</li>
</ol>
<p>例如，當 SearchTask 的資料區塊載入到 CPU 記憶體時，下一個 SearchTask 正在 CPU 計算任務佇列中等待，而 GPU 計算任務佇列則處於閒置狀態。CPU 的<strong>估計完成時間</strong>等於前一個 SearchTask 與目前 SearchTask 的估計時間成本總和。GPU 的<strong>估計完成時間</strong>等於資料區塊載入 GPU 的時間與目前 SearchTask 的估計時間成本之和。資源中 SearchTask 的<strong>估計完成時間</strong>等於資源中所有 SearchTask 的平均執行時間。Milvus 隨後會選擇<strong>估計完成時間</strong>最少的裝置，並將 SearchTask 指派給該裝置。</p>
<p>這裡我們假設 GPU1 的<strong>估計完成時間</strong>較短。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-shorter-estimated-completion-time.png</span> </span></p>
<ol start="5">
<li><p>Milvus 將 SearchTask 加入 DiskResource 的任務佇列。</p></li>
<li><p>Milvus 將 SearchTask 移至 CpuResource 的任務佇列。CpuResource 中的載入線程依序從任務佇列中載入每個任務。CpuResource 讀取對應的資料區塊到 CPU 記憶體。</p></li>
<li><p>Milvus 將 SearchTask 移至 GpuResource。GpuResource 中的載入線程將資料從 CPU 記憶體複製到 GPU 記憶體。GpuResource 讀取對應的資料區塊到 GPU 記憶體。</p></li>
<li><p>Milvus 在 GpuResource 中執行 SearchTask。由於 SearchTask 的結果相對較小，因此結果會直接回傳到 CPU 記憶體。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>Milvus 將 SearchTask 的結果合併為整個搜尋結果。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merges-searchtast-result.png</span> </span></p>
<p>所有 SearchTask 完成後，Milvus 會將整個搜尋結果回傳給用戶端。</p>
<h2 id="Index-building" class="common-anchor-header">索引建立<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>索引建立基本上和搜尋過程相同，沒有合併過程。我們不會詳細談論。</p>
<h2 id="Performance-optimization" class="common-anchor-header">效能最佳化<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">快取</h3><p>如前所述，在計算之前，資料區塊需要載入到相應的存儲設備，如 CPU 記憶體或 GPU 記憶體。為了避免重複載入資料，Milvus 引進 LRU (Least Recently Used) 快取記憶體。當快取滿時，新的資料區塊會推走舊的資料區塊。您可以根據目前的記憶體大小，透過設定檔自訂快取大小。建議使用較大的快取記憶體儲存搜尋資料，以有效節省資料載入時間並提昇搜尋效能。</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">資料載入與計算重疊</h3><p>快取記憶體無法滿足我們提升搜尋效能的需求。當記憶體不足或資料集大小過大時，需要重新載入資料。我們需要降低資料載入對搜尋效能的影響。資料載入，無論是從磁碟載入到 CPU 記憶體，或是從 CPU 記憶體載入到 GPU 記憶體，都屬於 IO 作業，幾乎不需要處理器做任何計算工作。因此，我們考慮並行執行資料載入與計算，以獲得更好的資源使用。</p>
<p>我們將資料區塊的運算分成 3 個階段 (從磁碟載入到 CPU 記憶體、CPU 運算、結果合併) 或 4 個階段 (從磁碟載入到 CPU 記憶體、從 CPU 記憶體載入到 GPU 記憶體、GPU 運算與結果擷取、結果合併)。以 3 階段計算為例，我們可以啟動 3 個線程來負責 3 個階段，以發揮指令流水線的功能。由於結果集大多較小，因此結果合併並不需要花費太多時間。在某些情況下，資料載入與計算的重疊可以減少 1/2 的搜尋時間。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequential-overlapping-load-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">問題與解決方案<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">不同的傳輸速度</h3><p>之前，Milvus 使用 Round Robin 策略進行多 GPU 任務排程。這個策略在我們的 4-GPU 伺服器上運作完美，搜尋效能提升了 4 倍。然而，對於我們的 2-GPU 主機，效能卻沒有提升 2 倍。我們做了一些實驗，發現一個 GPU 的資料複製速度是 11 GB/秒。然而，對於另一個 GPU 而言，則是 3 GB/秒。參考主機板的說明文件後，我們確認主機板是透過 PCIe x16 與一顆 GPU 連接，而另一顆 GPU 則是透過 PCIe x4 連接。也就是說，這些 GPU 的複製速度不同。之後，我們加入複製時間來測量每個 SearchTask 的最佳裝置。</p>
<h2 id="Future-work" class="common-anchor-header">未來的工作<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">增加複雜度的硬體環境</h3><p>在實際條件下，硬體環境可能會更複雜。對於有多顆 CPU、NUMA 架構的記憶體、NVLink 和 NVSwitch 的硬體環境，跨 CPU/GPU 的通訊會帶來許多最佳化的機會。</p>
<p>查詢最佳化</p>
<p>在實驗過程中，我們發現了一些效能改善的機會。例如，當伺服器收到針對相同資料表的多個查詢時，在某些條件下可以合併查詢。透過使用資料位置性，我們可以改善效能。這些優化將在我們未來的開發中實現。 現在我們已經知道單主機、多 GPU 情況下的查詢排程和執行方式。在接下來的文章中，我們會繼續介紹 Milvus 更多的內部機制。</p>
