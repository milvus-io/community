---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: Milvus 的最佳狀態：探索 v2.2 至 v2.2.6
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Milvus 2.2 至 2.2.6 的新功能
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>Milvus 的最佳狀態</span> </span></p>
<p>歡迎回來，Milvus 的追隨者們！我們知道自從上次分享關於這個尖端開放原始碼向量資料庫的更新以來，已經有一段時間了。但不用擔心，因為我們在這裡為您介紹自去年八月以來所有令人振奮的發展。</p>
<p>在這篇博文中，我們將帶您了解 Milvus 從 2.2 版到 2.2.6 版的最新版本。我們有許多要介紹的內容，包括新功能、改進、錯誤修正和最佳化。所以，請系好安全帶，讓我們一起開始吧！</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2：增強穩定性、更快的搜尋速度和彈性擴展性的重要版本<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2 是一個重要的版本，它引入了七個全新的功能，並對之前的版本進行了許多突破性的改進。讓我們仔細看看其中的亮點：</p>
<ul>
<li><strong>從檔案大量插入實體</strong>：有了這個功能，您只需要幾行程式碼，就可以將一個或多個檔案中的一批實體直接上傳到 Milvus，節省您的時間和精力。</li>
<li><strong>查詢結果分頁</strong>：為了避免在單一遠端程序呼叫 (RPC) 中傳回大量的搜尋和查詢結果，Milvus v2.2 允許您在搜尋和查詢中使用關鍵字配置偏移量和過濾結果。</li>
<li><strong>基於角色的存取控制 (RBAC)：</strong>Milvus v2.2 現在支援 RBAC，允許您透過管理使用者、角色和權限來控制對 Milvus 實例的存取。</li>
<li><strong>配額與限制</strong>：配額與限制是 Milvus v2.2 中的新機制，可保護資料庫系統在突然流量激增時不會發生記憶體不足 (OOM) 錯誤和當機。使用此功能，您可以控制攝取、搜尋和記憶體使用量。</li>
<li><strong>集合層級的存活時間 (TTL)：</strong>在先前的版本中，Milvus 只允許您為群集設定 TTL。然而，Milvus v2.2 現在支援在集合層級設定 TTL。為特定的集合設定 TTL，該集合中的實體將在 TTL 結束後自動過期。此設定提供更細緻的資料保留控制。</li>
<li><strong>基於磁碟的近似近鄰搜尋 (ANNS) 索引 (Beta)：</strong>Milvus v2.2 引入了對 DiskANN 的支援，DiskANN 是一種固態硬碟駐留、基於 Vamana 圖形的 ANNS 演算法。此支援可在大型資料集上直接搜尋，大幅減少記憶體使用量，最多可減少 10 倍。</li>
<li><strong>資料備份 (Beta)：</strong>Milvus v2.2 提供<a href="https://github.com/zilliztech/milvus-backup">全新的工具</a>，可透過命令列或 API 伺服器，正確備份和還原您的 Milvus 資料。</li>
</ul>
<p>除了上述的新功能外，Milvus v2.2 還包括五個錯誤的修正和多項改進，以增強 Milvus 的穩定性、可觀測性和性能。如需詳細資訊，請參閱<a href="https://milvus.io/docs/release_notes.md#v220">Milvus v2.2 發行紀錄</a>。</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 &amp; v2.2.2: 已修正問題的次要版本<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 和 v2.2.2 是次要版本，著重於修正舊版本中的關鍵問題，並引入新功能。以下是一些重點：</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>支援 Pulsa 租戶與認證</li>
<li>在 etcd 配置來源中支援傳輸層安全性 (TLS)</li>
<li>搜尋效能提升 30% 以上</li>
<li>優化排程器，增加合併任務的機率</li>
<li>修正了多個錯誤，包括索引標量欄位上的術語過濾失敗，以及索引節點（IndexNode）在創建索引失敗時的恐慌。</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>修正代理不會更新 shard leader 的快取記憶體的問題</li>
<li>修正了已釋放的集合/分區的載入資訊未清除的問題</li>
<li>修正載入次數沒有及時清除的問題</li>
</ul>
<p>更多詳情，請參閱<a href="https://milvus.io/docs/release_notes.md#v221">Milvus v2.2.1 發行紀錄</a>和<a href="https://milvus.io/docs/release_notes.md#v222">Milvus v2.2.2 發行紀錄</a>。</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3：更安全、穩定、可用<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3 是一個專注於增強系統安全性、穩定性和可用性的版本。此外，它還引入了兩個重要功能：</p>
<ul>
<li><p><strong>滾動升級</strong>：此功能允許 Milvus 在升級過程中回應傳入的請求，這在之前的版本中是不可能實現的。滾動升級可確保系統即使在升級過程中也能保持可用，並對使用者的要求作出回應。</p></li>
<li><p><strong>協調器高可用性 (HA)：</strong>此功能可讓 Milvus 協調器以主動待命模式運作，降低單點故障的風險。即使在突如其來的災難中，恢復時間也最多可縮短到 30 秒。</p></li>
</ul>
<p>除了這些新功能之外，Milvus v2.2.3 還包含許多改進與錯誤修正，包括增強大量插入效能、降低記憶體使用量、最佳化監控指標，以及改進元儲存效能。如需詳細資訊，請參閱<a href="https://milvus.io/docs/release_notes.md#v223">Milvus v2.2.3 發行紀錄</a>。</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4：更快、更可靠、更節省資源<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4 是 Milvus v2.2 的小更新。它引入了四個新功能和幾個增強功能，使性能更快、可靠性更高、資源消耗更少。此版本的重點包括</p>
<ul>
<li><strong>資源群組</strong>：Milvus 現在支援將 QueryNodes 分組到其他資源群組，允許完全隔離存取不同群組中的實體資源。</li>
<li><strong>集合重新命名</strong>：Collection-renaming API 允許使用者變更集合的名稱，提供更多管理集合的彈性，並改善可用性。</li>
<li><strong>支援 Google Cloud Storage</strong></li>
<li><strong>搜尋與查詢 API 的新選項</strong>：這項新功能允許使用者跳過對所有成長中的區段進行搜尋，在搜尋與資料插入同時進行的情況下，提供更好的搜尋效能。</li>
</ul>
<p>如需更多資訊，請參閱<a href="https://milvus.io/docs/release_notes.md#v224">Milvus v2.2.4 發行紀錄</a>。</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: 不建議使用<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5 有幾個關鍵問題，因此我們不建議使用此版本。  對於由此造成的不便，我們深表歉意。然而，這些問題已在 Milvus v2.2.6 中得到解決。</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6：解決了v2.2.5的關鍵問題<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6 已成功解決在 v2.2.5 發現的關鍵問題，包括回收髒的 binlog 資料和 DataCoord GC 失敗的問題。如果您目前使用 v2.2.5，請升級以確保最佳效能與穩定性。</p>
<p>已修復的重要問題包括</p>
<ul>
<li>DataCoord GC 失敗</li>
<li>覆寫傳送的索引參數</li>
<li>RootCoord 訊息積壓造成的系統延遲</li>
<li>指標 RootCoordInsertChannelTimeTick 不準確</li>
<li>可能的時間戳停止</li>
<li>重新啟動過程中偶爾的協調器角色自毀</li>
<li>檢查點因垃圾回收異常退出而落後</li>
</ul>
<p>如需詳細資訊，請參閱<a href="https://milvus.io/docs/release_notes.md#v226">Milvus v2.2.6 發行紀錄</a>。</p>
<h2 id="Summary" class="common-anchor-header">總結<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>總括而言，Milvus 從 v2.2 到 v2.2.6 的最新版本提供了許多令人振奮的更新和改進。從新功能到錯誤修復和優化，Milvus 繼續履行其承諾，提供最先進的解決方案，並賦予應用程序在不同領域的能力。請持續關注 Milvus 社群提供的更多令人振奮的更新和創新。</p>
