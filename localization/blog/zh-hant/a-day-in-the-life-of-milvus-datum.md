---
id: a-day-in-the-life-of-milvus-datum.md
title: Milvus Datum 的一天
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: 因此，讓我們漫步在 Milvus 資料庫 Dave 的一天生活中。
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>建立像 Milvus 這種可擴充至數十億向量並處理網路規模流量的高效向量<a href="https://zilliz.com/learn/what-is-vector-database">資料庫並</a>不簡單。它需要對分散式系統進行仔細、智慧型的設計。在這種系統的內部設計中，必須在效能與簡單性之間作出取捨。</p>
<p>儘管我們已經嘗試很好地平衡這個取捨，但內部的某些方面仍然是不透明的。這篇文章的目的在於揭開 Milvus 如何分解資料插入、索引以及跨節點服務的神秘面紗。要有效優化查詢效能、系統穩定性及除錯相關問題，了解這些高層次的流程是不可或缺的。</p>
<p>因此，讓我們來漫步一下 Milvus 資料 Dave 的一天生活。假設您在<a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">Milvus 分佈式部署</a>中將 Dave 插入到您的資料集中（見下圖）。就您而言，他直接進入集合。然而，在幕後，有許多步驟發生在獨立的子系統。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">代理節點和訊息佇列<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一開始，您會呼叫 MilvusClient 物件，例如透過 PyMilvus 函式庫，並傳送<code translate="no">_insert()</code>_ 請求給<em>代理節點</em>。代理節點是使用者與資料庫系統之間的閘道，可執行負載平衡傳入流量等作業，並在回傳給使用者之前整理多個輸出。</p>
<p>哈希函數應用於項目的主索引鍵，以決定將其傳送至哪個<em>通道</em>。使用 Pulsar 或 Kafka 主題實作的頻道，代表流式資料的存放區，然後再傳送給頻道的訂閱者。</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">資料節點、區段和區塊<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>資料傳送到適當的通道後，通道會將資料傳送到資料<em>節點</em>中對應的區段。資料節點負責儲存和管理稱為<em>成長中區段</em>的資料緩衝區。每個分片有一個成長區段。</p>
<p>當資料插入區段時，該區段會朝最大大小成長，預設為 122MB。在此期間，該區段的較小部分（預設為 16MB，稱為<em>chunks</em>）會被推送至持久性儲存空間，例如使用 AWS 的 S3 或 MinIO 等其他相容的儲存空間。每個 chunk 都是物件儲存上的實體檔案，每個欄位都有獨立的檔案。請參閱上圖，說明物件儲存上的檔案層級。</p>
<p>因此，總而言之，一個集合的資料會被分割到不同的資料節點，在這些節點中，資料會被分割成區段以進行緩衝，而這些區段又會被分割成每個欄位的區塊以進行持久化儲存。上面的兩個圖表更清楚地說明了這一點。以這種方式分割傳入的資料後，我們就能充分利用集群在網路頻寬、運算和儲存方面的平行性。</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">封閉、合併和壓縮分段<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>到目前為止，我們已經講述了我們友善的資料 Dave 如何從<code translate="no">_insert()</code>_ 查詢進入持久性儲存的故事。當然，他的故事還沒有結束。還有更多的步驟可以讓搜尋和索引的過程更有效率。透過管理區段的大小和數量，系統可以充分利用群集的平行性。</p>
<p>一旦一個區段在資料節點上達到最大大小 (預設為 122MB)，就表示該區段已被<em>封鎖</em>。這表示資料節點上的緩衝區會被清空，為新的區段騰出空間，而持久性儲存空間中對應的區塊會被標記為屬於封閉的區段。</p>
<p>資料節點會定期尋找較小的封閉區段，並將它們合併為較大的區段，直到每個區段的最大大小達到 1GB（預設值）。回想一下，當一個項目在 Milvus 中被刪除時，它會被簡單地標記一個刪除標誌 - 把它想像成 Dave 的死囚牢。當區段中刪除的項目數量超過指定的臨界值 (預設為 20%)，區段的大小就會縮小；這種作業我們稱為<em>壓縮</em>。</p>
<p>透過區段進行索引和搜尋</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>有一個額外的節點類型，即<em>索引節點</em>，負責為封存的區段建立索引。當封閉區段時，資料節點會傳送索引節點的請求，以建立索引。索引節點然後將完成的索引傳送到物件儲存區。每個封閉區段都有自己的索引，儲存在獨立的檔案中。您可以透過存取資料桶來手動檢查此檔案 - 請參閱上圖的檔案層級結構。</p>
<p>查詢節點 - 不只是資料節點 - 會訂閱相對應分段的訊息佇列主題。成長中的片段會複製到查詢節點上，節點會根據需要將屬於集合的封存片段載入記憶體。當資料進入時，它會為每個成長中的區段建立索引，並從資料儲存中載入密封區段的最終索引。</p>
<p>現在想像一下，您以包含 Dave 的<em>search()</em>請求呼叫 MilvusClient 物件。經由代理節點傳送到所有查詢節點後，每個查詢節點會執行向量相似性搜尋（或其他搜尋方法，如查詢、範圍搜尋或群組搜尋），逐一反覆檢視區段。結果會以類似 MapReduce 的方式在節點間進行整理，然後傳送回使用者，Dave 會很高興地發現他終於與您團聚了。</p>
<h2 id="Discussion" class="common-anchor-header">討論<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>我們已經涵蓋了 Dave 的一天生活，包括<code translate="no">_insert()</code>_ 和<code translate="no">_search()</code>_ 兩個操作。其他的操作如<code translate="no">_delete()</code>_ 和<code translate="no">_upsert()</code>_ 也是類似的。無可避免地，我們必須簡化討論，省略更精細的細節。不過，整體來說，你現在應該可以充分了解 Milvus 是如何在分散式系統的節點間進行並行設計，以達到穩健且有效率的目的，以及你可以如何利用這一點來進行最佳化和除錯。</p>
<p><em>本文的一個重要啟示：Milvus 在設計上將不同節點類型的關注區分開來。每種節點類型都有特定的、互斥的功能，而且儲存和計算是分開的。</em>因此，每個元件都可以獨立擴充，並可根據使用個案和流量模式調整參數。例如，您可以在不調整資料和索引節點的情況下，調整查詢節點的數量，以應付增加的流量。有了這種靈活性，有些 Milvus 使用者可以處理數十億個向量，並提供 web 規模的流量，查詢延遲還低於 100 毫秒。</p>
<p>透過 Milvus 的全面管理服務<a href="https://zilliz.com/cloud">Zilliz Cloud</a>，您甚至不需要部署分散式群集，就能享受 Milvus 分散式設計的優點。<a href="https://cloud.zilliz.com/signup">立即註冊 Zilliz Cloud 免費版，將 Dave 付諸行動！</a></p>
