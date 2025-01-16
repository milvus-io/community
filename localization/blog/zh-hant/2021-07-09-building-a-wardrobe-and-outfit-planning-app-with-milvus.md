---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: 系統概述
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: 探索 Mozat 如何運用開放原始碼向量資料庫 Milvus 來強化時尚應用程式，提供個人化的風格推薦與圖片搜尋系統。
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>使用 Milvus 建立衣櫃與服裝規劃應用程式</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p><a href="http://www.mozat.com/home">Mozat</a>成立於 2003 年，是一家新創公司，總部設在新加坡，並在中國和沙烏地阿拉伯設有辦事處。該公司專精於建立社交媒體、通訊和生活方式應用程式。<a href="https://stylepedia.com/">Stylepedia</a>是 Mozat 打造的衣櫃應用程式，可協助使用者發現新風格，並與其他熱愛時尚的人聯繫。它的主要功能包括整理數位衣櫥、個人化風格推薦、社群媒體功能，以及用於尋找與線上或現實生活中所見相似物品的圖片搜尋工具。</p>
<p><a href="https://milvus.io">Milvus</a>用於支援 Stylepedia 內的圖片搜尋系統。該應用程式處理三種圖片類型：使用者圖片、產品圖片和時尚照片。每張圖片都可以包含一個或多個項目，使每個查詢更加複雜。為了實用，圖片搜尋系統必須精確、快速且穩定，這些特性為應用程式新增功能 (例如服裝建議和時尚內容推薦) 奠定了堅實的技術基礎。</p>
<h2 id="System-overview" class="common-anchor-header">系統概述<button data-href="#System-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-system-process.png</span> </span></p>
<p>圖片搜尋系統分為離線與線上兩部分。</p>
<p>離線時，圖片會被向量化並插入向量資料庫（Milvus）。在資料工作流程中，相關的產品影像和時尚照片會使用物件偵測和特徵抽取模型轉換成 512 維特徵向量。然後將向量資料編入索引並加入向量資料庫。</p>
<p>在線上，影像資料庫會被查詢，並將相似的影像傳回給使用者。與離線元件類似，查詢的影像會經由物件偵測和特徵抽取模型處理，以取得特徵向量。使用特徵向量，Milvus 會搜尋 TopK 類似向量，並取得其相對應的影像 ID。最後，經過後處理 (過濾、排序等)，就會傳回與查詢影像相似的影像集合。</p>
<h2 id="Implementation" class="common-anchor-header">執行<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>實作分成四個模組：</p>
<ol>
<li>成衣偵測</li>
<li>特徵萃取</li>
<li>向量相似性搜尋</li>
<li>後處理</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">成衣偵測</h3><p>在成衣偵測模組中，使用<a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a> 作為物件偵測模型，<a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a> 是一個單階段、基於錨點的目標偵測架構，因其體積小且可即時推論。它提供四種模型尺寸 (YOLOv5s/m/l/x)，每種特定尺寸都有其優缺點。較大的模型會有較好的表現（精確度較高），但需要較多的運算能力，且執行速度較慢。由於本案例中的物件都是相對較大的項目，而且容易偵測，因此使用最小的模型 YOLOv5s 就足夠了。</p>
<p>每張影像中的服裝物品都會被辨識出來，並剪下來作為後續處理中使用的特徵萃取模型輸入。同時，物件偵測模型也會根據預先定義的類別 (上衣、外衣、褲子、裙子、連衣裙和連身褲) 來預測服裝分類。</p>
<h3 id="Feature-extraction" class="common-anchor-header">特徵萃取</h3><p>相似性搜尋的關鍵在於特徵萃取模型。裁剪後的衣服影像被嵌入 512 維浮點向量，以機器可讀的數值資料格式來表示其屬性。採用<a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">深度公因子學習 (DML)</a>方法，並以<a href="https://arxiv.org/abs/1905.11946">EfficientNet</a>作為骨幹模型。</p>
<p>度量學習的目的是訓練一個基於 CNN 的非線性特徵萃取模組（或稱編碼器），以減少相同類別樣本對應的特徵向量之間的距離，並增加不同類別樣本對應的特徵向量之間的距離。在這種情況下，同類樣本指的是同一件衣服。</p>
<p>EfficientNet 在均匀扩展网络宽度、深度和分辨率时，同时考虑了速度和精度。EfficientNet-B4 用作特徵抽取網路，最終全連結層的輸出是進行向量相似性搜尋所需的影像特徵。</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">向量相似性搜尋</h3><p>Milvus 是一個開放原始碼的向量資料庫，支援建立、讀取、更新和刪除 (CRUD) 等作業，以及在萬億位元組的資料集上進行近乎即時的搜尋。在 Stylepedia 中，它被用於大規模向量相似性搜尋，因為它具有高彈性、穩定性、可靠性和快速性。Milvus 擴充了廣泛使用的向量索引函式庫 (Faiss、NMSLIB、Annoy 等) 的功能，並提供一套簡單直覺的 API，讓使用者可以針對特定的情境選擇理想的索引類型。</p>
<p>考量到情境需求和資料規模，Stylepedia 的開發人員使用 Milvus 的 CPU 專用發行版搭配 HNSW 索引。建立了兩個索引集合，一個用於產品，另一個用於時尚照片，以支援不同的應用程式功能。每個集合會根據檢測與分類結果進一步分為六個區塊，以縮窄搜尋範圍。Milvus 能在幾毫秒內對數千萬向量執行搜尋，提供最佳效能，同時保持低開發成本，並將資源消耗降至最低。</p>
<h3 id="Post-processing" class="common-anchor-header">後處理</h3><p>為了提高圖像檢索結果與查詢圖像的相似度，我們使用顏色過濾和關鍵標籤（袖子長度、衣服長度、領子款式等）過濾來過濾掉不合格的圖像。此外，我們也使用影像品質評估演算法，以確保優質的影像會先呈現給使用者。</p>
<h2 id="Application" class="common-anchor-header">應用程式<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">使用者上傳與圖片搜尋</h3><p>使用者可以拍攝自己的衣服並上傳到 Stylepedia 數位衣櫥，然後擷取與上傳內容最相似的商品圖片。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-search-results.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">服裝建議</h3><p>透過在 Stylepedia 資料庫中進行相似度搜尋，使用者可以找到包含特定時尚項目的時尚照片。這些可能是某人正在考慮購買的新款服裝，也可能是他們自己收藏中可以穿著或搭配不同的服裝。然後，透過對其經常搭配的單品進行聚類，便可產生穿著建議。舉例來說，一件黑色機車夾克可以搭配多種單品，例如一條黑色緊身牛仔褲。使用者就可以瀏覽在選定公式中出現此搭配的相關時尚照片。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-outfit.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-snapshot.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">時尚照片推薦</h3><p>根據使用者的瀏覽記錄、喜好以及數位衣櫥的內容，系統會計算相似度，並提供使用者可能感興趣的客製化時尚照片推薦。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-user-wardrobe.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>透過結合深度學習與電腦視覺方法，Mozat 得以利用 Milvus 建立快速、穩定且精準的圖像相似度搜尋系統，為 Stylepedia 應用程式中的各種功能提供動力。</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">別做陌生人<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上尋找或貢獻 Milvus。</li>
<li>透過<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 與社群互動。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上與我們連線。</li>
</ul>
