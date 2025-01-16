---
id: 2019-11-08-data-management.md
title: Milvus 中如何進行資料管理
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: 本文章介紹 Milvus 的資料管理策略。
cover: null
tag: Engineering
origin: null
---
<custom-h1>在大規模向量搜尋引擎中管理資料</custom-h1><blockquote>
<p>作者：莫毅華</p>
<p>日期：2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Milvus 中如何進行資料管理<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>首先介紹 Milvus 的一些基本概念：</p>
<ul>
<li>表：Table 是一個向量的資料集，每個向量都有一個唯一的 ID。每個向量及其 ID 代表表中的一行。表中的所有向量必須具有相同的尺寸。以下是一個有 10 維向量的表格範例：</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>表</span> </span></p>
<ul>
<li>索引：建立索引是透過特定演算法將向量聚類的過程，需要額外的磁碟空間。有些索引類型需要較少的空間，因為它們會簡化和壓縮向量，而另一些類型則需要比原始向量更多的空間。</li>
</ul>
<p>在 Milvus 中，使用者可以執行建立資料表、插入向量、建立索引、搜尋向量、擷取資料表資訊、刪除資料表、移除資料表中的部分資料以及移除索引等工作。</p>
<p>假設我們有 1 億個 512 維向量，需要在 Milvus 中插入並管理這些向量，以達到有效率的向量搜尋。</p>
<p><strong>(1) 向量插入</strong></p>
<p>讓我們來看看向量是如何插入 Milvus 的。</p>
<p>由於每個向量需要 2 KB 的空間，一億個向量的最小儲存空間約為 200 GB，因此一次性插入所有這些向量是不切實際的。因此需要有多個資料檔案，而不是一個。插入性能是關鍵性能指標之一。Milvus 支援一次性插入數百甚至數萬個向量。例如，一次性插入 3 萬個 512 維向量一般只需要 1 秒鐘。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>插入</span> </span></p>
<p>並非每次向量插入都會載入磁碟。Milvus 在 CPU 記憶體中為每個建立的表保留一個可變緩衝區，插入的資料可以快速寫入。而當可變緩衝區中的資料達到一定大小時，這個空間就會被標示為不可變。與此同時，新的可變緩衝區會被保留。不可變緩衝區中的資料會定期寫入磁碟，相應的 CPU 記憶體也會被釋放。定時寫入磁碟的機制與 Elasticsearch 所使用的機制類似，Elasticsearch 會每 1 秒將緩衝區的資料寫入磁碟。此外，熟悉 LevelDB/RocksDB 的使用者可以在這裡看到與 MemTable 的一些相似之處。</p>
<p>資料插入機制的目標是</p>
<ul>
<li>資料插入必須有效率。</li>
<li>插入的資料可以立即使用。</li>
<li>資料檔案不能太零碎。</li>
</ul>
<p><strong>(2) 原始資料檔案</strong></p>
<p>當向量寫入磁碟時，它們會儲存在包含原始向量的原始資料檔案 (Raw Data File)。如前所述，大規模的向量需要以多個資料檔儲存和管理。插入的資料大小不一，使用者可以一次插入 10 個向量，或 100 萬個向量。然而，寫入磁碟的作業每 1 秒執行一次。因此會產生不同大小的資料檔案。</p>
<p>零碎的資料檔案既不方便管理，也不容易進行向量搜尋。Milvus 會不斷合併這些小資料檔案，直到合併後的檔案大小達到特定大小，例如 1GB。這個特定的大小可以在建立資料表的 API 參數<code translate="no">index_file_size</code> 中設定。因此，1 億個 512 維向量將分佈並儲存在約 200 個資料檔案中。</p>
<p>考慮到增量計算的情況（向量會同時插入和搜尋），我們需要確保向量一旦寫入磁碟，就可以用來搜尋。因此，在合併小資料檔案之前，就可以存取和搜尋它們。一旦合併完成，小數據檔案就會被移除，而新合併的檔案將用於搜尋。</p>
<p>這是合併前查詢檔案的樣子：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>合併後的查詢檔案：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) 索引檔案</strong></p>
<p>基於原始資料檔案的搜尋是強制搜尋，它比較查詢向量和原點向量之間的距離，並計算最近的 k 個向量。暴力搜尋的效率很低。如果以索引檔案為基礎進行搜尋，則可以大幅提高搜尋效率。建立索引需要額外的磁碟空間，而且通常很花時間。</p>
<p>那麼原始資料檔案和索引檔案有什麼不同？簡單來說，原始資料檔案記錄每個向量及其唯一 ID，而索引檔案則記錄向量聚類結果，例如索引類型、聚類中心點，以及每個聚類中的向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>索引檔案</span> </span></p>
<p>一般而言，索引檔案比原始資料檔案包含更多的資訊，但檔案大小卻小得多，因為向量在建立索引的過程中會被簡化和量化（針對某些索引類型）。</p>
<p>預設情況下，新建立的資料表會以暴力計算方式搜尋。一旦索引在系統中建立，Milvus 就會自動為合併後大小達到 1 GB 的檔案，以獨立的線程來建立索引。索引建立完成後，會產生新的索引檔案。原始資料檔案將歸檔，以便根據其他索引類型建立索引。</p>
<p>Milvus 會自動為達到 1 GB 的檔案建立索引：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>建立索引</span> </span></p>
<p>索引建立完成：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>索引</span> </span>建立<span class="img-wrapper"> <span>完成</span> </span></p>
<p>未達 1 GB 的原始資料檔案不會自動建立索引，這可能會降低搜尋速度。要避免這種情況，您需要手動強制為此表建立索引。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>強制建立</span> </span></p>
<p>為檔案強制建立索引後，搜尋效能會大幅提升。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>索引最終</span> </span></p>
<p><strong>(4) 元資料</strong></p>
<p>如前所述，有 1 億個 512 維向量保存在 200 個磁碟檔案中。當為這些向量建立索引時，會有 200 個額外的索引檔案，這使得檔案總數達到 400 個 (包括磁碟檔案和索引檔案)。我們需要一個有效率的機制來管理這些檔案的元資料（檔案狀態和其他資訊），以便檢查檔案狀態、移除或建立檔案。</p>
<p>使用 OLTP 資料庫來管理這些資訊是個不錯的選擇。單機版 Milvus 使用 SQLite 來管理元資料，而在分散式部署中，Milvus 則使用 MySQL。當 Milvus 伺服器啟動時，會分別在 SQLite/MySQL 中建立兩個資料表 (即 'Tables「 和 」TableFiles')。Tables「 記錄資料表資訊，而 」TableFiles' 記錄資料檔案和索引檔案的資訊。</p>
<p>如下流程圖所示，「表」包含元資料資訊，例如表名稱 (table_id)、向量維度 (dimension)、表建立日期 (created_on)、表狀態 (state)、索引類型 (engine_type)、向量簇數 (nlist) 和距離計算方法 (metric_type)。</p>
<p>而「TableFiles」則包含檔案所屬表的名稱 (table_id)、檔案的索引類型 (engine_type)、檔案名稱 (file_id)、檔案類型 (file_type)、檔案大小 (file_size)、行數 (row_count) 和檔案建立日期 (created_on)。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>元資料</span> </span></p>
<p>有了這些元資料，就可以執行各種作業。以下是一些範例：</p>
<ul>
<li>若要建立資料表，Meta Manager 只需要執行 SQL 語句：<code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code> 。</li>
<li>若要在 table_2 上執行向量搜尋，Meta Manager 會在 SQLite/MySQL 中執行查詢，也就是事實上的 SQL 語句：<code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> ，以擷取 table_2 的檔案資訊。之後，這些檔案會被 Query Scheduler 載入記憶體，以進行搜尋計算。</li>
<li>不允許立即刪除資料表，因為資料表上可能正在執行查詢。這就是表有軟刪除和硬刪除的原因。刪除資料表時，它會被標示為「軟刪除」，並且不允許對它進行進一步的查詢或變更。但是，刪除前正在執行的查詢仍在繼續。只有當這些刪除前的查詢都完成後，這個表，連同它的元資料和相關檔案，才會被永久硬刪除。</li>
</ul>
<p><strong>(5) 查詢排程</strong></p>
<p>下圖展示了向量在 CPU 和 GPU 中的搜尋過程，透過查詢複製並儲存在磁碟、CPU 記憶體和 GPU 記憶體中的檔案 (原始資料檔案和索引檔案)，尋找最相似的 topk 個向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>topkresult</span> </span></p>
<p>查詢排程演算法可大幅提升系統效能。基本的設計理念是透過硬體資源的最大利用，達到最佳的搜尋效能。以下只是查詢排程的簡要說明，將來會有專文討論此主題。</p>
<p>我們稱針對給定資料表的第一次查詢為「冷」查詢，而後續查詢為「熱」查詢。當針對給定資料表進行第一次查詢時，Milvus 會進行大量工作，將資料載入 CPU 記憶體，並將部分資料載入 GPU 記憶體，這些工作非常耗時。在接下來的查詢中，由於部分或全部資料已經在 CPU 記憶體中，因此可以節省從磁碟讀取資料的時間，因此搜尋速度會快很多。</p>
<p>為了縮短第一次查詢的搜尋時間，Milvus 提供 Preload Table (<code translate="no">preload_table</code>) 設定，可在伺服器啟動時自動預先將資料表載入 CPU 記憶體。對於包含 1 億個 512 維向量的資料表，也就是 200 GB，如果有足夠的 CPU 記憶體儲存這些資料，搜尋速度是最快的。但是，如果表中包含十億級的向量，有時難免需要釋放 CPU/GPU 記憶體，以增加未被查詢的新資料。目前，我們使用 LRU (Latest Recently Used) 作為資料替換策略。</p>
<p>如下圖所示，假設有一張表在磁碟上儲存了 6 個索引檔案。CPU 記憶體只能儲存 3 個索引檔案，而 GPU 記憶體只能儲存 1 個索引檔案。</p>
<p>搜尋開始時，3 個索引檔案會載入 CPU 記憶體進行查詢。第一個檔案被查詢後，會立即從 CPU 記憶體中釋放出來。同時，第 4 個檔案會載入 CPU 記憶體。同樣地，當一個檔案在 GPU 記憶體中被查詢時，它會立即被釋放並被新的檔案取代。</p>
<p>查詢排程主要處理兩組任務佇列，一組是資料載入，另一組是搜尋執行。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>查詢排程</span> </span></p>
<p><strong>(6) 結果還原器</strong></p>
<p>向量搜尋有兩個關鍵參數：一個是 'n「，表示 n 個目標向量；另一個是 」k'，表示前 k 個最相似的向量。搜尋結果實際上是 n 組 KVP（key-value 對），每組 KVP 有 k 組 key-value。由於查詢需要針對每個檔案執行，不論是原始資料檔案或索引檔案，因此每個檔案都會擷取 n 組前 k 個結果集。所有這些結果集會合併，以獲得表的 top-k 結果集。</p>
<p>以下範例顯示如何合併和縮小向量搜尋的結果集，以針對有 4 個索引檔案 (n=2, k=3) 的資料表。請注意，每個結果集有兩列。左列代表向量 ID，右列代表歐氏距離。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>結果</span> </span></p>
<p><strong>(7) 未來的最佳化</strong></p>
<p>以下是一些關於資料管理可能優化的想法。</p>
<ul>
<li>如果不可變緩衝區甚至是可變緩衝區中的資料也可以即時查詢呢？目前，不可變緩衝區中的資料無法被查詢，除非它們被寫入磁碟。有些使用者對插入後即時存取資料更感興趣。</li>
<li>提供資料表分割功能，允許使用者將非常大的資料表分為較小的分割區，並針對指定分割區執行向量搜尋。</li>
<li>在向量中加入一些可以過濾的屬性。例如，有些使用者只想搜尋具有特定屬性的向量。這需要擷取向量屬性，甚至是原始向量。一種可行的方法是使用 KV 資料庫，例如 RocksDB。</li>
<li>提供資料遷移功能，可自動將過時的資料遷移至其他儲存空間。對於某些資料一直流入的場景，資料可能會老化。由於某些使用者只關心最近一個月的資料，並針對這些資料執行搜尋，因此較舊的資料變得不太有用，但卻佔用了許多磁碟空間。資料遷移機制可協助釋放磁碟空間以儲存新資料。</li>
</ul>
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
    </button></h2><p>本文主要介紹 Milvus 的資料管理策略。更多關於 Milvus 分佈式部署、向量索引方法的選擇和查詢調度程序的文章將陸續推出。敬請期待！</p>
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus 元資料管理 (1)：如何檢視元資料</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus 元資料管理 (2)：元数据表中的字段</a></li>
</ul>
