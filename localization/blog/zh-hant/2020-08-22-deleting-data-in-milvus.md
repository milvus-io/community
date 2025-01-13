---
id: deleting-data-in-milvus.md
title: 總結
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: 在 Milvus v0.7.0 中，我們提出了全新的設計，讓刪除更有效率，並支援更多索引類型。
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Milvus 如何實現刪除功能</custom-h1><p>本文將介紹 Milvus 如何實現刪除功能。作為很多用戶期待已久的功能，刪除功能被引入到 Milvus v0.7.0。我們並沒有直接在 FAISS 中呼叫 remove_ids，而是想出了一個全新的設計，讓刪除更有效率，並支援更多的索引類型。</p>
<p>在《<a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">Milvus 如何實現動態資料更新與查詢</a>》一文中，我們介紹了從插入資料到刷新資料的整個過程。讓我們重溫一些基本知識。MemManager 管理所有插入緩衝區，每個 MemTable 對應一個集合（我們在 Milvus v0.7.0 中將 "table「 改名為 」collection"）。Milvus 會自動將插入記憶體的資料分割成多個 MemTableFiles。當資料刷新到磁碟時，每個 MemTableFile 會序列化成原始檔案。在設計刪除函式時，我們保留了這個架構。</p>
<p>我們將 delete 方法的功能定義為刪除特定集合中與指定實體 ID 相對應的所有資料。在開發這個函式時，我們設計了兩種情況。第一種是刪除仍在插入緩衝區中的資料，第二種是刪除已刷新到磁碟上的資料。第一種情況比較直覺。我們可以找到與指定 ID 對應的 MemTableFile，直接刪除記憶體中的資料（圖 1）。由於刪除和插入資料不能同時進行，而且在刷新資料時，MemTableFile 會由可變變為不可變的機制，因此刪除只能在可變緩衝區中進行。如此一來，刪除作業就不會與資料刷新發生衝突，從而確保資料的一致性。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-delete-request-milvus.jpg</span> </span></p>
<p>第二種情況比較複雜，但也比較常見，因為在大多數情況下，資料會先在插入緩衝區中短暫停留，然後才刷新到磁碟上。由於將刷新的資料載入記憶體進行硬刪除的效率非常低，因此我們決定採用軟刪除這種更有效率的方式。軟刪除不是實際刪除刷新的資料，而是將已刪除的 ID 儲存在單獨的檔案中。如此一來，我們就可以在讀取作業（例如搜尋）時篩選出那些已刪除的 ID。</p>
<p>說到實作，我們有幾個問題需要考慮。在 Milvus 中，資料只有在刷新到磁碟上時才會可見，或者換句話說，才可以復原。因此，刷新的資料不會在刪除方法呼叫中刪除，而是在下一次刷新作業中刪除。原因是已刷新到磁碟的資料檔案將不會再包含新資料，因此軟刪除不會影響已刷新的資料。呼叫 delete 時，可以直接刪除仍在插入緩衝區中的資料，而對於已沖洗的資料，則需要在記憶體中記錄刪除資料的 ID。當將資料刷新到磁碟時，Milvus 會將刪除的 ID 寫入 DEL 檔案，以記錄相對應區段中的哪個實體被刪除。只有在資料刷新完成後，這些更新才會顯現。這個過程如圖 2 所示。在 v0.7.0 之前，我們只有自動沖洗機制；也就是 Milvus 每秒將插入緩衝區中的資料序列化。在我們的新設計中，我們加入了一個 flush 方法，允許開發人員在 delete 方法之後呼叫，確保新插入的資料是可見的，而刪除的資料則無法再復原。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-delete-request-milvus.jpg</span> </span></p>
<p>第二個問題是原始資料檔案和索引檔案在 Milvus 中是兩個獨立的檔案，在 metadata 中也是兩個獨立的記錄。在刪除指定 ID 時，我們需要找到與 ID 相對應的原始檔案和索引檔案，並將它們一起記錄下來。因此，我們引入了段的概念。一個段包含原始檔案（其中包括原始向量檔案和 ID 檔案）、索引檔案和 DEL 檔案。在 Milvus 中，段是讀取、寫入和搜尋向量的最基本單位。一個集合（圖 3）是由多個段組成的。因此，磁碟中一個 collection 資料夾下有多個 segment 資料夾。由於我們的元資料是以關係資料庫（SQLite 或 MySQL）為基礎，因此記錄段內的關係非常簡單，刪除操作也不再需要分開處理原始檔案和索引檔案。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-delete-request-milvus.jpg</span> </span></p>
<p>第三個問題是如何在搜尋過程中篩選出已刪除的資料。實際上，DEL 記錄的 ID 是段中儲存的相應資料的偏移量。由於刷新的區段不包含新資料，因此偏移量不會改變。DEL 的資料結構是記憶體中的位元圖，其中有效位元代表刪除的偏移量。我們也相應更新了 FAISS：當您在 FAISS 中搜尋時，活動位元對應的向量將不再包含在距離計算中（圖 4）。FAISS 的變更在此不做詳細說明。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-delete-request-milvus.jpg</span> </span></p>
<p>最後一個問題是關於效能改善。刪除已刷新的資料時，首先需要找出被刪除的 ID 位於集合的哪個區段，然後記錄其偏移量。最直接的方法是搜尋每一段中的所有 ID。我們所考慮的最佳化方法是在每個區段中加入 Bloom 過濾器。Bloom 過濾器是一種隨機資料結構，用來檢查元素是否為集合的成員。因此，我們可以只載入每個區段的 Bloom 過濾器。只有當 bloom filter 斷定被刪除的 ID 在目前的區段中，我們才能在區段中找到對應的偏移量；否則，我們可以忽略這個區段 (圖 5)。我們選擇 bloom 過濾器的原因，是因為它使用較少的空間，而且搜尋效率比許多同級產品 (例如哈希表) 更高。雖然 bloom filter 有一定的誤判率，但我們可以將需要搜尋的區段減少到理想的數量來調整這個概率。同時，bloom filter 也需要支援刪除功能。否則，已刪除的實體 ID 仍然可以在 bloom filter 中找到，導致假陽性率增加。因此，我們使用計數 bloom filter，因為它支援刪除。在這篇文章中，我們不會詳細說明 bloom filter 如何運作。如果您有興趣，可以參考 Wikipedia。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-delete-request-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">總結<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>到目前為止，我們已經簡單介紹了 Milvus 如何依 ID 刪除向量。大家都知道，我們使用軟刪除來刪除刷新的資料。隨著刪除資料的增加，我們需要壓縮集合中的段來釋放被刪除資料佔用的空間。此外，如果某個區段已經建立索引，compact 也會刪除先前的索引檔案，並建立新的索引。目前，開發人員需要呼叫 compact 方法來壓縮資料。展望未來，我們希望能引入檢查機制。例如，當刪除的資料量達到某個臨界值，或是刪除後的資料分佈發生了變化，Milvus 就會自動壓縮該區段。</p>
<p>現在我們介紹了刪除函式背後的設計理念及其實作。我們肯定還有改進的空間，歡迎您提出任何意見或建議。</p>
<p>了解 Milvus：https://github.com/milvus-io/milvus。您也可以加入我們的社群<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>進行技術討論！</p>
