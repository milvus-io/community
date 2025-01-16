---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: 在小米手機瀏覽器中使用 Milvus AI 技術進行新聞推薦
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: 探索小米如何利用 AI 和 Milvus 建立智慧型新聞推薦系統，能夠為其行動網頁瀏覽器的使用者找到最相關的內容。
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>與 Milvus 一起創造：小米手機瀏覽器中的人工智能新聞推薦</custom-h1><p>從社交媒體飼料到 Spotify 上的播放列表推薦，<a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">人工智能</a>已經在我們每天看到的內容和互動中扮演了重要角色。跨國電子製造商小米為了讓自己的行動網頁瀏覽器與眾不同，打造了一個人工智能驅動的新聞推薦引擎。<a href="https://milvus.io/">Milvus</a> 是專為相似性搜尋與人工智慧所建立的開放原始碼向量資料庫，被用來作為應用程式的核心資料管理平台。本文將解釋小米如何建立人工智能驅動的新聞推薦引擎，以及如何使用 Milvus 和其他人工智能演算法。</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">使用 AI 來推薦個人化內容並剔除新聞雜訊</h3><p>光是《紐約時報》每天就發表超過<a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 篇</a>內容，所產生的大量文章讓個人無法全面掌握所有新聞。為了協助篩選大量內容，並推薦最相關或最有趣的文章，我們越來越多地求助於人工智能。儘管推薦仍遠未達到完美的境界，但機器學習對於篩選從日益複雜且互聯的世界中湧現的源源不斷的新資訊而言，已變得越來越必要。</p>
<p>小米公司製造並投資於智慧型手機、行動應用程式、筆記型電腦、家電等許多產品。為了讓公司每季銷售的 4,000 多萬部智慧型手機上預先安裝的行動瀏覽器與眾不同，小米在其中內建了新聞推薦系統。當使用者啟動小米的行動瀏覽器時，人工智慧會根據使用者的搜尋歷史、興趣等推薦類似的內容。Milvus 是一個開放原始碼的向量相似性搜尋資料庫，用來加速檢索相關文章。</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">人工智能驅動的內容推薦是如何運作的？</h3><p>新聞推薦（或任何其他類型的內容推薦系統）的核心是將輸入資料與大量資料庫進行比較，以找出類似資訊。成功的內容推薦需要在相關性與及時性之間取得平衡，並有效地整合大量新資料 - 通常是即時的。</p>
<p>為了適應海量資料集，推薦系統通常分為兩個階段：</p>
<ol>
<li><strong>檢索</strong>：在擷取過程中，會根據使用者的興趣和行為，從更廣泛的資料庫中篩選內容。在小米的行動瀏覽器中，數以千計的內容會從包含數百萬篇新聞文章的龐大資料集中挑選出來。</li>
<li><strong>排序</strong>：接下來，在檢索過程中選擇的內容會根據特定指標進行排序，然後再推送給用戶。當使用者參與推薦的內容時，系統會即時調整，以提供更相關的建議。</li>
</ol>
<p>新聞內容推薦需要根據使用者行為和最近發表的內容即時進行。此外，推薦的內容必須儘可能符合使用者的興趣和搜尋意向。</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = 智慧型內容建議</h3><p>Milvus 是一個開放原始碼的向量相似性搜尋資料庫，可與深度學習模型整合，為自然語言處理、身分驗證等應用程式提供動力。Milvus 為大型向量資料集編製索引，讓搜尋更有效率，並支援多種流行的人工智能框架，簡化開發機器學習應用程式的流程。這些特性使該平台成為儲存和查詢向量資料的理想選擇，而向量資料是許多機器學習應用程式的重要組成部分。</p>
<p>小米選擇 Milvus 來管理其智慧型新聞推薦系統的向量資料，因為它快速、可靠，而且只需最少的設定與維護。然而，Milvus 必須搭配人工智能演算法，才能建立可部署的應用程式。小米選擇了 BERT（Bidirectional Encoder Representation Transformers 的簡稱）作為其推薦引擎中的語言表示模型。BERT 可作為一般的 NLU（自然語言理解）模型，能驅動許多不同的 NLP（自然語言處理）任務。其主要功能包括</p>
<ul>
<li>BERT 的轉換器用作演算法的主要框架，能夠捕捉句子內部和句子之間的明確和隱含關係。</li>
<li>多任務學習目標、遮蔽語言建模 (MLM) 和下一句預測 (NSP)。</li>
<li>BERT 在資料量較大的情況下表現更佳，並可透過作為轉換矩陣，增強 Word2Vec 等其他自然語言處理技術。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>博客_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>BERT 的網路架構採用多層轉換器結構，捨棄了傳統的 RNN 和 CNN 神經網路。它的工作原理是透過其注意力機制，將任意位置的兩個字之間的距離轉換成一個字，解決了 NLP 中長期存在的依賴性問題。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>博客-小美-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>博客-小美-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT 提供了一個簡單模型和一個複雜模型。對應的超參數如下：BERT BASE：L = 12，H = 768，A = 12，總參數為 110M；BERT LARGE：L = 24，H = 1024，A = 16，總參數為 340M。</p>
<p>在上述超參數中，L 代表網路的層數（即 Transformer 區塊的數量），A 代表多頭注意（Multi-Head Attention）中的自注意（self-Attention）數量，篩選器大小為 4H。</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">小米的內容推薦系統</h3><p>小米瀏覽器的新聞推薦系統依賴於三個關鍵組成部分：向量化、ID 映射和近似最近鄰（ANN）服務。</p>
<p>向量化是將文章標題轉換成一般句子向量的過程。小米的推薦系統採用了基於 BERT 的 SimBert 模型。SimBert 是一個 12 層模型，隱藏大小為 768。Simbert 使用訓練模型中文 L-12_H-768_A-12 進行持續訓練（訓練任務為「度量學習 +UniLM」，在 signle TITAN RTX 上使用 Adam 優化器訓練了 117 萬步（學習率 2e-6，批次大小 128）。簡單來說，這是一個最佳化的 BERT 模型。</p>
<p>ANN 演算法會將向量化的文章標題與儲存於 Milvus 的整個新聞資料庫進行比較，然後為使用者傳回類似的內容。ID 映射用於獲取相應文章的頁面瀏覽量和點擊量等相關資訊。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>博客-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>存儲在 Milvus 中為小米新聞推薦引擎提供動力的資料會不斷更新，包括額外的文章和活動資訊。當系統加入新資料時，舊資料就必須清除。在這個系統中，前 T-1 天會進行完整的資料更新，後 T 天會進行增量更新。</p>
<p>在指定的時間間隔內，舊資料會被刪除，並將 T-1 天內處理過的資料插入資料庫。新產生的資料會即時加入。一旦插入新資料，就會在 Milvus 中進行相似性搜尋。擷取的文章會再次依點擊率和其他因素排序，並將最優先的內容顯示給使用者。在這種資料頻繁更新、結果必須即時傳遞的情況下，Milvus 快速納入和搜索新資料的能力，使小米手機瀏覽器大幅加速新聞內容推薦成為可能。</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus 讓向量相似性搜索更出色</h3><p>將資料向量化，然後計算向量之間的相似性是最常用的檢索技術。基於 ANN 的向量相似性搜索引擎的興起，大大提高了向量相似性計算的效率。與類似的解決方案相比，Milvus 提供了優化的資料儲存、豐富的 SDK 以及分散式版本，大大降低了建立檢索層的工作量。此外，Milvus 活躍的開放原始碼社群是一個強大的資源，可以協助解答問題，並在問題發生時排除故障。</p>
<p>如果您想進一步瞭解向量相似性檢索和 Milvus，請查看下列資源：</p>
<ul>
<li>在 Github 上查看<a href="https://github.com/milvus-io/milvus">Milvus</a>。</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">矢量類似性搜尋隱藏在眾目睽睽之下</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">使用向量索引加速真正大數據上的相似性搜索</a></li>
</ul>
<p>閱讀其他<a href="https://zilliz.com/user-stories">使用者故事</a>，瞭解更多關於使用 Milvus 製造物品的資訊。</p>
