---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: 使用 VOVA 和 Milvus 建立圖片搜尋購物體驗
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: 探索電子商務平台 VOVA 如何運用開放原始碼向量資料庫 Milvus 來強化圖片購物功能。
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>使用 VOVA 和 Milvus 建立圖片搜尋購物體驗</custom-h1><p>跳至：</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">使用VOVA和Milvus建立圖像搜索購物體驗</a><ul>
<li><a href="#system-process-of-vovas-search-by-image-functionality"><em>VOVA 圖像搜尋功能的系統流程。</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">使用 YOLO 模型偵測目標</a>-<a href="#yolo-network-architecture"><em>YOLO 網路架構。</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">使用 ResNet 的影像特徵向量萃取</a>-<a href="#resnet-structure"><em>ResNet 結構。</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">由 Milvus 驅動的向量相似性搜尋</a>-<a href="#mishards-architecture-in-milvus"><em>Milvus 中的 Mishards 架構。</em></a></li>
<li><a href="#vovas-shop-by-image-tool">VOVA 的圖像購物工具</a>-<a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>VOVA 的圖像購物工具搜尋螢幕截圖。</em></a></li>
<li><a href="#reference">參考</a></li>
</ul></li>
</ul>
<p>線上購物在 2020 年激增<a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">44%</a>，很大程度上是因為冠狀病毒大流行。由於人們追求社交距離，避免與陌生人接觸，無接觸的送貨成為許多消費者極為嚮往的選擇。這種普及也讓人們在線上購買更多樣化的商品，包括使用傳統關鍵字搜尋難以描述的小眾商品。</p>
<p>為了幫助使用者克服基於關鍵字查詢的限制，公司可以建立圖像搜尋引擎，讓使用者使用圖像來代替文字進行搜尋。這不僅能讓使用者找到難以描述的物品，還能幫助他們購買在現實生活中遇到的物品。此功能有助於建立獨特的使用者體驗，並提供一般的便利性，深受客戶喜愛。</p>
<p>VOVA 是一個新興的電子商務平台，著重於經濟實惠以及為使用者提供良好的購物體驗，其商品清單涵蓋數百萬種商品，並支援 20 種語言和 35 種主要貨幣。為了提升使用者的購物體驗，該公司使用 Milvus 在其電子商務平台中建立圖片搜尋功能。本文探討 VOVA 如何利用 Milvus 成功建立圖片搜尋引擎。</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">圖片搜尋如何運作？</h3><p>VOVA的圖像商店系統會在公司庫存中搜尋與用戶上傳圖像相似的產品圖像。下圖顯示系統流程的兩個階段，資料匯入階段（藍色）和查詢階段（橘色）：</p>
<ol>
<li>使用 YOLO 模型從上傳的照片中偵測目標；</li>
<li>使用 ResNet 從偵測到的目標中抽取特徵向量；</li>
<li>使用 Milvus 進行向量相似性搜尋。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">使用 YOLO 模型偵測目標</h3><p>VOVA 在 Android 和 iOS 上的行動應用程式目前支援影像搜尋。該公司使用最先進的即時物件偵測系統 YOLO (You only look once) 來偵測使用者上傳影像中的物件。YOLO 模型目前已進入第五次迭代。</p>
<p>YOLO 是一個單階段模型，只使用一個卷繞神經網路 (CNN) 來預測不同目標的類別和位置。它體積小，結構緊湊，非常適合移動使用。</p>
<p>YOLO 使用卷積層來擷取特徵，並使用全連結層來取得預測值。受到 GooLeNet 模型的啟發，YOLO 的 CNN 包含 24 個卷繞層和兩個全連結層。</p>
<p>如下圖所示，一張 448 × 448 輸入影像經由多個卷繞層與池化層轉換成 7 × 7 × 1024 維張數 (如下圖倒數第三個立方體所示)，再經由兩個全連結層轉換成 7 × 7 × 30 維張數輸出。</p>
<p>YOLO P 的預測輸出是一個二維張量，其形狀為 [批次,7 ×7 ×30]。使用切片法，P[:,0:7×7×20] 是類別概率，P[:,7×7×20:7×7×(20+2)] 是置信度，P[:,7×7×(20+2)]:]是邊框的預測結果。</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png「YOLO 網路架構」。)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">使用 ResNet 抽取影像特徵向量</h3><p>VOVA 採用殘差神經網路 (ResNet) 模型，從龐大的產品圖庫和使用者上傳的照片中抽取特徵向量。ResNet 有其限制，因為隨著學習網路深度的增加，網路的精確度也會降低。下圖描述了 ResNet 運行 VGG19 模型（VGG 模型的變體）的情況，該模型經過修改，通過短路機制加入了殘留單元。VGG 於 2014 年提出，僅包含 14 層，而 ResNet 在一年後面世，最多可達 152 層。</p>
<p>ResNet 結構很容易修改和擴充。透過改變區塊中通道的數量以及堆疊區塊的數量，可以輕鬆調整網路的寬度和深度，從而獲得具有不同表達能力的網路。這可以有效解決網路退化效應 (network degeneration effect)，即準確度會隨著學習深度的增加而下降。只要有足夠的訓練資料，就可以在逐漸加深網路的同時，獲得表達能力不斷提升的模型。透過模型訓練，每張圖片的特徵都會被抽取出來，並轉換為 256 維浮點向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">由 Milvus 驅動的向量相似性搜尋</h3><p>VOVA 的產品圖片資料庫包含 3,000 萬張圖片，而且還在快速增加中。為了從這個龐大的資料集中快速擷取最相似的產品圖片，我們使用 Milvus 來進行向量相似性搜尋。由於進行了大量優化，Milvus 提供了一種快速、簡化的方法來管理向量資料和建立機器學習應用程式。Milvus 提供與熱門索引函式庫 (例如 Faiss、Annoy) 的整合，支援多種索引類型和距離指標，擁有多種語言的 SDK，並提供豐富的 API 來管理向量資料。</p>
<p>Milvus 可以在幾毫秒內對萬億向量資料集進行相似性搜尋，當 nq=1 時，查詢時間低於 1.5 秒，平均批次查詢時間低於 0.08 秒。為了建立其圖像搜尋引擎，VOVA 參考了 Milvus 的分片中介軟體解決方案 Mishards 的設計（其系統設計見下圖），以實現高可用性的伺服器集群。利用 Milvus 集群的水平擴展性，滿足了項目對海量資料集上高查詢性能的要求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">VOVA 的圖像商店工具</h3><p>以下截圖展示了 VOVA 在公司 Android 應用程式上的圖像購物搜尋工具。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>隨著越來越多的用戶搜尋產品和上傳照片，VOVA 將繼續優化為系統提供動力的模型。此外，該公司還將加入新的 Milvus 功能，以進一步提升用戶的線上購物體驗。</p>
<h3 id="Reference" class="common-anchor-header">參考資料</h3><p><strong>YOLO：</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet：</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus</strong></p>
<p>https://milvus.io/docs</p>
