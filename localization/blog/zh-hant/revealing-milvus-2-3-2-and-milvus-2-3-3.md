---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: 揭露 Milvus 2.3.2 &amp; 2.3.3：支援陣列資料類型、複雜刪除、TiKV 整合等功能
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  今天，我們很高興地宣佈 Milvus 2.3.2 和 2.3.3
  正式發行！這些更新帶來了許多令人振奮的功能、優化和改進，增強了系統性能、靈活性和整體用戶體驗。
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在不斷發展的向量搜尋技術領域中，Milvus 始終站在最前沿，突破界限，建立新標準。今天，我們很高興地宣佈 Milvus 2.3.2 和 2.3.3 正式發行！這些更新帶來了許多令人振奮的功能、優化和改進，增強了系統性能、靈活性和整體用戶體驗。</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">支援陣列資料類型 - 讓搜尋結果更精確、更貼切<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>加入陣列資料類型支援對 Milvus 來說是一個關鍵的改進，特別是在查詢篩選的情況下，例如交集和聯合。此新增功能可確保搜尋結果不僅更精確，而且更相關。在實際應用上，例如在電子商務領域，儲存為字串陣列的產品標籤可讓消費者執行進階搜尋，篩選出不相關的結果。</p>
<p>請參閱我們全面的<a href="https://milvus.io/docs/array_data_type.md">說明文件</a>，深入瞭解如何在 Milvus 中使用陣列類型。</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">支援複雜的刪除表達式 - 改善您的資料管理<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>在之前的版本中，Milvus 支援主鍵刪除表達式，提供穩定且精簡的架構。使用 Milvus 2.3.2 或 2.3.3，用戶可以使用複雜的刪除表達式，促進複雜的資料管理任務，例如舊資料的滾動清理或基於用戶 ID 的 GDPR 合規驅動資料刪除。</p>
<p>注意：使用複雜表達式前，請確認已載入集合。此外，請注意刪除程序並不保證原子性。</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">TiKV 整合 - 具穩定性的可擴充元資料儲存<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 之前依賴 Etcd 進行 metadata 儲存，在 metadata 儲存方面面臨容量有限和可擴展性的挑戰。為了解決這些問題，Milvus 加入 TiKV 這個開放原始碼的鍵值儲存空間，作為元資料儲存的另一個選擇。TiKV 提供更強大的擴充性、穩定性和效率，使其成為滿足 Milvus 不斷演進的需求的理想解決方案。從 Milvus 2.3.2 開始，使用者可透過修改配置，無縫過渡至 TiKV 來儲存元資料。</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">支援 FP16 向量類型 - 擁抱機器學習效率<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2 及之後的版本現在在介面層級支援 FP16 向量類型。FP16 或 16 位元浮點是深度學習和機器學習中廣泛使用的資料格式，可提供高效的數值表示和計算。雖然全面支援 FP16 的工作正在進行中，但索引層中的各種索引需要在建構過程中將 FP16 轉換為 FP32。</p>
<p>我們將在 Milvus 後續版本中全面支援 FP16、BF16 和 int8 資料類型。敬請期待。</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">顯著改善滾動升級體驗 - 讓使用者無縫過渡<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>滾動升級是分散式系統的重要功能，可在不中斷業務服務或停機的情況下進行系統升級。在最新的Milvus版本中，我們強化了Milvus的滾動升級功能，確保用戶從2.2.15版本升級到2.3.3版本以及之後的所有版本時，能有更簡化、更高效的過渡。社群也投入大量的測試與優化，將升級過程中的查詢影響降低到 5 分鐘以內，提供使用者無後顧之憂的體驗。</p>
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
    </button></h2><p>除了引入新功能，我們在最新的兩個版本中大幅優化了 Milvus 的性能。</p>
<ul>
<li><p>最小化資料複製作業，以優化資料載入</p></li>
<li><p>使用批次 varchar 讀取簡化了大容量插入操作</p></li>
<li><p>移除資料填充時不必要的偏移量檢查，以改善召回階段效能。</p></li>
<li><p>在插入大量資料的情況下，解決了高 CPU 消耗的問題。</p></li>
</ul>
<p>這些優化共同貢獻了更快、更有效率的 Milvus 體驗。查看我們的監控儀表板，快速了解 Milvus 如何改善其效能。</p>
<h2 id="Incompatible-changes" class="common-anchor-header">不相容的變更<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>永久刪除 TimeTravel 相關程式碼。</p></li>
<li><p>不再支援 MySQL 作為 metadata 儲存空間。</p></li>
</ul>
<p>請參閱<a href="https://milvus.io/docs/release_notes.md">Milvus 發行紀錄</a>，以取得所有新功能和增強功能的詳細資訊。</p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>透過最新的 Milvus 2.3.2 和 2.3.3 版本，我們致力於提供一個強大、功能豐富、高性能的資料庫解決方案。探索這些新功能，利用優化的優勢，並加入我們這個令人興奮的旅程，因為我們發展 Milvus 以滿足現代資料管理的需求。現在就下載最新版本，與 Milvus 一起體驗資料儲存的未來！</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">讓我們保持聯繫<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您有任何關於 Milvus 的問題或回饋，請加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>，直接與我們的工程師和社群交流，或加入我們的<a href="https://discord.com/invite/RjNbk8RR4f">Milvus 社群午餐學習會</a>，時間是每週二下午 12 點到 12 點半 (太平洋標準時間)。也歡迎您在<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>上關注我們，以獲得 Milvus 的最新消息和更新。</p>
