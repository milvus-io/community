---
id: 2019-12-18-datafile-cleanup.md
title: 之前的刪除策略及相關問題
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: 我們改進了檔案刪除策略，以修正查詢操作相關的問題。
cover: null
tag: Engineering
---
<custom-h1>資料檔案清理機制的改進</custom-h1><blockquote>
<p>作者：莫毅華</p>
<p>日期：2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">之前的刪除策略及相關問題<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>在《<a href="/blog/zh-hant/2019-11-08-data-management.md">Managing Data in Massive-Scale Vector Search Engine</a>》中，我們提到了資料檔案的刪除機制。刪除包括軟刪除和硬刪除。對資料表執行刪除作業後，資料表會被標記為軟刪除。之後的搜尋或更新作業將不再允許。但是，在刪除之前開始的查詢作業仍可執行。只有當查詢作業完成時，該表才會真正連同元資料和其他檔案一起刪除。</p>
<p>那麼，標記為 soft-delete 的檔案何時會被真正刪除？在 0.6.0 之前，策略是軟刪除 5 分鐘後檔案才會被真正刪除。下圖顯示了該策略：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5 分鐘</span> </span></p>
<p>這個策略的前提是查詢通常不會超過 5 分鐘，並不可靠。如果查詢持續超過 5 分鐘，查詢就會失敗。原因是查詢開始時，Milvus 會收集可搜尋的檔案資訊，並建立查詢任務。然後，查詢排程器逐一將檔案載入記憶體，並逐一搜尋檔案。如果載入檔案時檔案已不存在，查詢就會失敗。</p>
<p>延長時間可能有助於降低查詢失敗的風險，但也會造成另一個問題：磁碟使用量過大。原因是當有大量向量插入時，Milvus 會不斷合併資料檔案，即使沒有查詢發生，合併後的檔案也不會立即從磁碟移除。如果資料插入太快和/或插入的資料量太大，額外的磁碟使用量可能達到數十 GB。請參考下圖為例：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>結果</span> </span></p>
<p>如上圖所示，第一批插入的資料 (insert_1) 被刷新到磁碟並成為 file_1，然後 insert_2 成為 file_2。負責檔案組合的線程將檔案合併為 file_3。然後，file_1 和 file_2 被標記為軟刪除。第三批插入資料變成 file_4。該線程將檔案_3 和檔案_4 合併為檔案_5，並將檔案_3 和檔案_4 標記為軟刪除。</p>
<p>同樣地，insert_6 和 insert_5 合併。在 t3 中，file_5 和 file_6 被標記為軟刪除。在 t3 和 t4 之間，雖然許多檔案被標記為軟刪除，但它們仍在磁碟中。檔案在 t4 之後被真正刪除。因此，在 t3 和 t4 之間，磁碟使用量為 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MB。插入的資料為 64 + 64 + 64 + 64 = 256 MB。磁碟使用量是插入資料大小的 3 倍。磁碟的寫入速度越快，特定時段內的磁碟使用量就越高。</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">0.6.0 中刪除策略的改進<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>因此，我們在 v0.6.0 中改變了刪除檔案的策略。硬刪除不再使用時間作為觸發器。取而代之的是，當檔案不被任何任務使用時才是觸發因素。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>新策略</span> </span></p>
<p>假設插入兩批向量。在 t1 給出查詢請求，Milvus 取得兩個要查詢的檔案 (file_1 和 file_2，因為 file_3 仍然不存在。)接著，後端線程開始合併兩個檔案，查詢同時執行。當 file_3 產生時，file_1 和 file_2 會被標記為軟刪除。在查詢之後，沒有其他任務會使用 file_1 和 file_2，因此它們會在 t4 時被硬刪除。t2 和 t4 之間的間隔非常小，取決於查詢的間隔。如此一來，未使用的檔案就會被及時移除。</p>
<p>至於內部實作，則使用軟體工程師所熟悉的參考計數來判斷檔案是否可以被硬刪除。使用比較來解釋，當玩家在遊戲中有生命時，他仍然可以玩。當生命數變為 0 時，遊戲結束。Milvus 會監控每個檔案的狀態。當某個檔案被某個任務使用時，該檔案就會增加一條生命。當檔案不再使用時，會從檔案移除生命。當檔案被標記為軟刪除，且 life 數為 0 時，該檔案就可以進行硬刪除。</p>
<h2 id="Related-blogs" class="common-anchor-header">相關部落格<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="/blog/zh-hant/2019-11-08-data-management.md">在大規模向量搜尋引擎中管理資料</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Milvus 元資料管理 (1)：如何檢視元資料</a></li>
<li><a href="/blog/zh-hant/2019-12-27-meta-table.md">Milvus 元資料管理 (2)：元資料表中的欄位</a></li>
</ul>
