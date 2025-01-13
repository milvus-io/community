---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: Milvus 2.3.4：更快速的搜尋、擴大的資料支援、改進的監控功能等
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: 介紹 Milvus 2.3.4 的新功能和改進
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們很高興推出 Milvus 2.3.4 的最新版本。此次更新引入了一系列精心打造的功能和改進，以優化性能、提高效率，並提供無縫的用戶體驗。在這篇博文中，我們將深入探討 Milvus 2.3.4 的亮點。</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">改善監控的存取日誌<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 現在支援存取日誌，提供與外部介面互動的寶貴洞察力。這些日誌記錄了方法名稱、使用者請求、回應時間、錯誤代碼和其他互動資訊，讓開發人員和系統管理員能夠進行效能分析、安全稽核和有效的故障排除。</p>
<p><strong><em>注意：</em></strong> <em>目前，存取日誌僅支援 gRPC 互動。不過，我們會繼續致力於改進，未來的版本將擴展此功能，以包括 RESTful 請求日誌。</em></p>
<p>如需詳細資訊，請參閱<a href="https://milvus.io/docs/configure_access_logs.md">配置存取日誌</a>。</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">Parquet 檔案匯入可提升資料處理效率<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4 現在支援匯入 Parquet 檔案，這是一種廣受歡迎的列式儲存格式，旨在提升大型資料集的儲存與處理效率。這項新增功能讓使用者在處理資料時更靈活、更有效率。透過省去繁複的資料格式轉換，管理 Parquet 格式大型資料集的使用者將體驗到簡化的資料匯入程序，大幅縮短從初始資料準備到後續向量擷取的時間。</p>
<p>此外，我們的資料格式轉換工具 BulkWriter 現已採用 Parquet 作為其預設輸出資料格式，確保開發人員獲得更直覺的體驗。</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">在不斷成長的區段上建立 Binlog 索引，以加快搜尋速度<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 現在可利用成長中區段的 binlog 索引，使成長中區段的搜尋速度提高 10 倍。這項增強功能大幅提升搜尋效率，並支援 IVF 或 Fast Scan 等進階索引，改善整體使用者體驗。</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">支援多達 10,000 個集合/分割區<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>如同關聯式資料庫中的表格與分區，集合與分區是 Milvus 儲存與管理向量資料的核心單位。為了回應使用者對細緻資料組織不斷演進的需求，Milvus 2.3.4 現在可在一個群集中支援多達 10,000 個集合/分區，比之前的 4,096 個限制大幅躍進。這項增強功能對於知識庫管理和多租戶環境等多樣化的使用案例大有助益。對集合/分區的擴大支援來自於時間刻度機制、goroutine 管理和記憶體使用的改進。</p>
<p><strong><em>注意：</em></strong> <em>建議的集合/分區數量限制為 10,000，因為超過此限制可能會影響故障復原和資源使用。</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">其他增強功能<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>除了上述功能外，Milvus 2.3.4 還包含各種改進和錯誤修正。這些改進包括降低資料擷取和變長資料處理時的記憶體使用量、改進錯誤訊息、加快載入速度，以及改善查詢分片平衡。這些集體增強功能有助於提供更順暢、更有效率的整體使用者體驗。</p>
<p>如需全面瞭解 Milvus 2.3.4 中引入的所有變更，請參閱我們的<a href="https://milvus.io/docs/release_notes.md#v234">《發行記錄》</a>。</p>
<h2 id="Stay-connected" class="common-anchor-header">保持聯繫！<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您有任何關於 Milvus 的問題或回饋，請加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>，直接與我們的工程師和社群交流，或加入我們的<a href="https://discord.com/invite/RjNbk8RR4f">Milvus 社群午餐會</a>，時間為每週二下午 12 點至 12 點 30 分 (太平洋標準時間)。也歡迎您在<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>上關注我們，以獲得 Milvus 的最新消息和更新。</p>
