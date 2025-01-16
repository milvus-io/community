---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: 整體架構
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: Milvus 可輕鬆為使用者提供個人化的推薦服務。
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>唯品會與 Milvus 共同打造個性化商品推薦系統</custom-h1><p>隨著互聯網數據規模的爆炸式增長，一方面，當前主流電子商務平臺的商品數量和品類不斷增加，另一方面，用戶尋找所需商品的難度也在激增。</p>
<p><a href="https://www.vip.com/">唯品會</a>是中國領先的網上品牌折扣零售商。唯品會是中國領先的網上品牌折扣零售商，為全中國的消費者提供高質量和受歡迎的品牌產品，價格遠低於零售價。為了優化客戶的購物體驗，公司決定根據用戶查詢關鍵字和用戶肖像建立個性化搜索推薦系統。</p>
<p>電子商務搜索推薦系統的核心功能是根據用戶的搜索意向和偏好，從大量商品中檢索出合適的商品並展示給用戶。在此過程中，系統需要計算商品與使用者搜尋意向與偏好的相似度，並將相似度最高的 TopK 商品推薦給使用者。</p>
<p>產品資訊、使用者搜尋意向、使用者偏好等資料都是非結構化的資料。我們嘗試使用搜尋引擎 Elasticsearch (ES) 的 CosineSimilarity(7.x) 來計算這些資料的相似度，但這種方法有以下缺點。</p>
<ul>
<li><p>計算回應時間長 - 從數百萬項中擷取 TopK 結果的平均延遲時間約為 300 毫秒。</p></li>
<li><p>ES 索引的維護成本高 - 商品特徵向量和其他相關資料都使用同一套索引，幾乎不方便索引建置，卻會產生大量資料。</p></li>
</ul>
<p>我們嘗試開發自己的本機敏感哈希插件來加速 ES 的 CosineSimilarity 計算。雖然加速後效能與吞吐量都有顯著的提升，但 100 多毫秒的延遲仍難以滿足實際線上商品檢索的需求。</p>
<p>經過深入研究，我們決定採用開源向量資料庫 Milvus，相較於常用的單機版 Faiss，Milvus 具備支援分散式部署、多語言 SDK、讀寫分離等優勢。</p>
<p>我們利用各種深度學習模型，將大量非結構化資料轉換為特徵向量，並將向量匯入 Milvus。藉由 Milvus 的優異效能，我們的電子商務搜尋推薦系統可以有效率地查詢與目標向量相似的 TopK 向量。</p>
<h2 id="Overall-Architecture" class="common-anchor-header">整體架構<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>![架構](https://assets.zilliz.com/1_01551e7b2b.jpg「架構」。)如圖所示，系統整體架構由兩大部分組成。</p>
<ul>
<li><p>寫入流程：將深度學習模型產生的項目特徵向量（以下簡稱項目向量）規範化後寫入 MySQL。然後 MySQL 使用資料同步工具 (ETL) 讀取處理過的項目特徵向量，並匯入向量資料庫 Milvus。</p></li>
<li><p>讀取過程：搜尋服務根據使用者查詢關鍵字及使用者肖像，取得使用者偏好特徵向量（以下簡稱使用者向量），查詢 Milvus 中的相似向量，並召回 TopK 項目向量。</p></li>
</ul>
<p>Milvus 支援增量資料更新與整體資料更新。每次增量更新都必須刪除現有的項目向量並插入新的項目向量，這意味著每個新更新的集合都要重新編排索引。它更適合讀取較多、寫入較少的情況。因此，我們選擇整體資料更新的方法。此外，分批寫入多個分區的整個資料只需要幾分鐘，等於接近即時更新。</p>
<p>Milvus 寫入節點執行所有寫入作業，包括建立資料集合、建立索引、插入向量等，並以寫入網域名提供服務給大眾。Milvus 讀取節點執行所有讀取作業，並以唯讀網域名稱向大眾提供服務。</p>
<p>目前版本的 Milvus 並不支援切換集合別名，而我們引進 Redis，可在多個完整的資料集合之間無縫切換別名。</p>
<p>讀取節點只需要從 MySQL、Milvus 和 GlusterFS 分散式檔案系統讀取現有的 metadata 資訊和向量資料或索引，因此讀取能力可以透過部署多個實體進行水平擴展。</p>
<h2 id="Implementation-Details" class="common-anchor-header">實作細節<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">資料更新</h3><p>資料更新服務除了寫入向量資料外，還包括向量的資料量偵測、索引建置、索引預載、別名控制等。整體流程如下。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>流程</span> </span></p>
<ol>
<li><p>假設在建置整個資料之前，CollectionA 提供資料服務給大眾，而被使用的整個資料是指向 CollectionA (<code translate="no">redis key1 = CollectionA</code>)。建構整個資料的目的是建立一個新的集合 CollectionB。</p></li>
<li><p>商品資料檢查 - 檢查 MySQL 表中商品資料的項目編號，比對商品資料與 CollectionA 中的現有資料。可根據數量或百分比設定警示。若未達到設定的數量 (百分比)，則不會建立整個資料，視為本次建立作業失敗，觸發警示；一旦達到設定的數量 (百分比)，則開始建立整個資料。</p></li>
<li><p>開始建立整個資料 - 初始化正在建立的整個資料的別名，並更新 Redis。更新後，正在建立的整個資料的別名就會被導向到 CollectionB (<code translate="no">redis key2 = CollectionB</code>)。</p></li>
<li><p>建立新的整個資料集合 - 判定 CollectionB 是否存在。如果存在，請先刪除它，再建立新的。</p></li>
<li><p>資料批次寫入 - 使用 modulo 運算計算每個商品資料與其本身 ID 的分割區 ID，並將資料分批寫入多個分割區至新建立的集合。</p></li>
<li><p>建立並預先載入索引 - 為新集合建立索引 (<code translate="no">createIndex()</code>)。索引檔案儲存在分散式儲存伺服器 GlusterFS 中。系統會自動模擬針對新集合的查詢，並預先載入索引進行查詢預熱。</p></li>
<li><p>集合資料檢查 - 檢查新集合的資料項目數量，與現有集合的資料進行比較，並根據數量和百分比設定警報。如果未達到設定的數量 (百分比)，則不會切換集合，建立過程會被視為失敗，並觸發警報。</p></li>
<li><p>切換集合 - 別名控制。更新 Redis 之後，正在使用的整個資料別名會被導向到 CollectionB (<code translate="no">redis key1 = CollectionB</code>)，原本的 Redis key2 會被刪除，建置過程完成。</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">資料調用</h3><p>多次調用 Milvus 分區資料，計算使用者向量與物品向量的相似度，使用者向量是根據使用者查詢關鍵字與使用者肖像取得，物品向量是根據使用者查詢關鍵字與使用者肖像取得，合併後會回傳 TopK 的物品向量。整體工作流程示意圖如下：<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>工作流程</span> </span>下表列出此流程中涉及的主要服務。可以看出，召回 TopK 向量的平均延遲時間約為 30 ms。</p>
<table>
<thead>
<tr><th><strong>服務</strong></th><th><strong>角色</strong></th><th><strong>輸入參數</strong></th><th><strong>輸出參數</strong></th><th><strong>回應延遲</strong></th></tr>
</thead>
<tbody>
<tr><td>使用者向量擷取</td><td>取得使用者向量</td><td>使用者資訊 + 查詢</td><td>使用者向量</td><td>10 毫秒</td></tr>
<tr><td>Milvus 搜尋</td><td>計算向量相似度並返回 TopK 結果</td><td>使用者向量</td><td>項目向量</td><td>10 ms</td></tr>
<tr><td>排程邏輯</td><td>並行結果召回與合併</td><td>多通道召回的項目向量和相似度得分</td><td>TopK 項目</td><td>10 ms</td></tr>
</tbody>
</table>
<p><strong>執行過程：</strong></p>
<ol>
<li>根據使用者查詢關鍵字與使用者肖像，透過深度學習模型計算使用者向量。</li>
<li>從 Redis currentInUseKeyRef 取得整個被使用資料的集合別名，並取得 Milvus CollectionName。此過程為資料同步服務，即在整個資料更新後，切換別名到 Redis。</li>
<li>Milvus 與使用者向量同時及非同步地被呼叫，從同一個集合的不同分區取得資料，Milvus 會計算使用者向量與項目向量的相似度，並返回每個分區中 TopK 的相似項目向量。</li>
<li>合併每個分區傳回的 TopK 項目向量，並將結果以相似度距離的相反順序排序，相似度距離使用 IP 內積計算（向量之間的距離越大，相似度越高）。最後會傳回 TopK 項目向量。</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">展望未來<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>目前，基於 Milvus 的向量搜索可以穩定地應用在推薦情境的搜索上，其高性能讓我們在模型的維度和演算法的選擇上有更大的發揮空間。</p>
<p>Milvus 作為中間件，將在更多的應用場景中發揮關鍵作用，包括主站搜索的召回和全場景推薦。</p>
<p>Milvus 未來最值得期待的三項功能如下。</p>
<ul>
<li>集合別名切換的邏輯 - 協調集合間的切換，無需外部元件。</li>
<li>過濾機制 - Milvus v0.11.0 單機版只支援 ES DSL 過濾機制。新發佈的 Milvus 2.0 支援標量過濾，以及讀寫分離。</li>
<li>Hadoop 分佈式檔案系統 (HDFS) 的儲存支援 - 我們使用的 Milvus v0.10.6 只支援 POSIX 檔案介面，我們部署了支援 FUSE 的 GlusterFS 作為儲存後端。然而，就效能和擴充的便利性而言，HDFS 是更好的選擇。</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">經驗與最佳實務<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>對於以讀取作業為主的應用程式，讀寫分離的部署可以大幅增加處理能力並改善效能。</li>
<li>Milvus Java 客戶端缺乏重新連線機制，因為召回服務使用的 Milvus 客戶端駐留在記憶體中。我們必須建立自己的連線池，透過心跳測試來確保 Java 用戶端與伺服器之間連線的可用性。</li>
<li>在 Milvus 上偶爾會發生查詢緩慢的情況。這是由於新集合的暖機不足所致。透過模擬在新集合上的查詢，索引檔案會被載入記憶體，以達到索引預熱的目的。</li>
<li>nlist 是索引建立參數，nprobe 是查詢參數。您需要根據您的業務場景，透過壓力測試實驗取得合理的臨界值，以平衡檢索效能與精確度。</li>
<li>對於靜態資料情境，先將所有資料匯入集合，之後再建立索引會比較有效率。</li>
</ol>
