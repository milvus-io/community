---
id: dynamic-data-update-and-query-milvus.md
title: 準備
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: 矢量搜尋現在更直覺、更方便
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Milvus 如何實現動態資料更新與查詢</custom-h1><p>在這篇文章中，我們主要描述向量資料如何記錄在 Milvus 的記憶體中，以及如何維護這些記錄。</p>
<p>以下是我們的主要設計目標：</p>
<ol>
<li>資料匯入的效率要高。</li>
<li>資料匯入後可以儘快看到資料。</li>
<li>避免資料檔案碎片化。</li>
</ol>
<p>因此，我們建立了一個記憶體緩衝區 (insert buffer) 來插入資料，以減少磁碟和作業系統上隨機 IO 的上下文切換次數，提高資料插入的效能。基於 MemTable 和 MemTableFile 的記憶體儲存架構，讓我們可以更方便地管理和序列化資料。緩衝區的狀態分為 Mutable 和 Immutable 兩種，可將資料持久化到磁碟，同時保持外部服務可用。</p>
<h2 id="Preparation" class="common-anchor-header">準備<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>當使用者準備插入向量到 Milvus 時，他首先需要建立一個 Collection (* Milvus 在 0.7.0 版本將 Table 改名為 Collection)。Collection 是在 Milvus 中記錄和搜尋向量的最基本單位。</p>
<p>每個 Collection 都有一個唯一的名稱和一些可以設定的屬性，向量會根據 Collection 名稱來插入或搜尋。當建立一個新的 Collection 時，Milvus 會在 metadata 中記錄這個 Collection 的資訊。</p>
<h2 id="Data-Insertion" class="common-anchor-header">資料插入<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>當使用者傳送插入資料的請求時，資料會被序列化和反序列化以到達 Milvus 伺服器。現在資料被寫入記憶體。記憶體寫入大致分為以下步驟：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-data-insertion-milvus.png</span> </span></p>
<ol>
<li>在 MemManager 中，找到或建立與 Collection 名稱對應的新 MemTable。每個 MemTable 對應於記憶體中的一個 Collection 緩衝區。</li>
<li>MemTable 將包含一個或多個 MemTableFile。每當我們建立一個新的 MemTableFile 時，我們會同時將此資訊記錄在 Meta 中。我們將 MemTableFile 分為兩種狀態：可變和不可變。當 MemTableFile 的大小達到臨界值時，它會變成 Immutable。每個 MemTable 在任何時候只能寫入一個 Mutable MemTableFile。</li>
<li>每個 MemTableFile 的資料最終會以設定索引類型的格式記錄在記憶體中。MemTableFile 是管理記憶體中資料的最基本單位。</li>
<li>在任何時候，插入資料的記憶體使用量都不會超過預設值 (insert_buffer_size)。這是因為每一次插入資料的請求來到，MemManager 都可以很容易地計算出每個 MemTable 所包含的 MemTableFile 所佔用的記憶體，然後根據目前的記憶體來協調插入請求。</li>
</ol>
<p>透過 MemManager、MemTable 和 MemTableFile 的多層次架構，可以更好地管理和維護資料插入。當然，它們能做的遠遠不止這些。</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">近乎即時的查詢<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中，插入的資料從記憶體移動到磁碟最長只需要等待一秒鐘。整個過程可以用下面的圖片大致概括：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-near-real-time-query-milvus.png</span> </span></p>
<p>首先，插入的資料會進入記憶體中的插入緩衝區。緩衝區會定期從初始的 Mutable 狀態變更為 Immutable 狀態，為序列化做準備。之後，這些不可變的緩衝區會由背景序列化線程定期序列化到磁碟。在放置資料之後，順序資訊會記錄在 metadata 中。此時，就可以搜尋資料了！</p>
<p>現在，我們將詳細說明圖中的步驟。</p>
<p>我們已經知道將資料插入可變緩衝區的過程。下一步是從可變緩衝區切換到不可變緩衝區：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>不可變的佇列會提供背景序列化線程不可變的狀態，以及準備好序列化的 MemTableFile。每個 MemTable 都管理自己的不可變佇列，當 MemTable 唯一可變的 MemTableFile 的大小達到臨界值時，就會進入不可變佇列。負責 ToImmutable 的背景線程會定期拉出 MemTable 管理的不可變佇列中的所有 MemTableFile，並將它們傳送到總的不可變佇列中。需要注意的是，將資料寫入記憶體和將記憶體中的資料變更為無法寫入的狀態這兩個操作不能同時發生，需要共用一個鎖。不過 ToImmutable 的操作非常簡單，幾乎不會造成任何延遲，所以對插入資料的效能影響很小。</p>
<p>下一步是將序列化佇列中的 MemTableFile 序列化到磁碟。這主要分為三個步驟：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialize-memtablefile-milvus.png</span> </span></p>
<p>首先，背景序列化線程會定期從不可變的佇列中抽取 MemTableFile。然後將它們序列化為固定大小的原始檔案 (Raw TableFiles)。最後，我們會將這些資訊記錄在 metadata 中。進行向量搜尋時，我們會查詢元資料中對應的 TableFile。從這裡就可以搜尋這些資料！</p>
<p>此外，根據設定的 index_file_size，序列化線程在完成一個序列化週期後，會將一些固定大小的 TableFile 合併為一個 TableFile，也會將這些資訊記錄在 metadata 中。此時，就可以為 TableFile 建立索引。索引建立也是異步的。另一個負責索引建立的背景線程會定期讀取元資料中 ToIndex 狀態的 TableFile，以執行相對應的索引建立。</p>
<h2 id="Vector-search" class="common-anchor-header">向量搜尋<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>事實上，您會發現在 TableFile 和 metadata 的幫助下，向量搜尋變得更直覺、更方便。一般來說，我們需要從元資料中取得與查詢的 Collection 相對應的 TableFile，在每個 TableFile 中進行搜尋，最後進行合併。在本文中，我們不深入討論搜尋的具體實作。</p>
<p>如果您想瞭解更多，歡迎閱讀我們的原始碼，或閱讀我們其他關於 Milvus 的技術文章！</p>
