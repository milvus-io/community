---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: 使用 Milvus 人工智慧 Proptech 進行個人化不動產搜尋
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: AI 正在改變房地產業，探索智慧型 Proptech 如何加速房屋搜尋與購買流程。
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>與 Milvus 一起創造：人工智能注入 Proptech，實現個性化房地產搜尋</custom-h1><p>人工智能 (AI) 在房地產領域的<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">強大應用</a>正在改變房屋搜尋過程。精通技術的房地產專業人士多年來一直在利用人工智能，並認識到它能夠幫助客戶更快地找到合適的房屋，並簡化購買物業的流程。冠狀病毒大流行<a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">加速了</a>全球對房地產科技（或稱 Proptech）的興趣、採用和投資，顯示其在房地產產業中將扮演越來越重要的角色。</p>
<p>本文將探討<a href="https://bj.ke.com/">Beike</a>如何利用向量相似性搜尋建立一個尋找房子的平台，提供個人化的結果，並近乎即時地推薦房源。</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">什麼是向量相似性搜尋？</h3><p>向量<a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">相似性搜尋的</a>應用範圍廣泛，涵蓋各種人工智慧、深度學習和傳統向量計算的情境。人工智能技術的普及部分歸功於向量搜尋及其對非結構化資料的理解能力，這些資料包括影像、視訊、音訊、行為資料、文件等。</p>
<p>非結構化資料估計佔所有資料的 80-90%，從中擷取洞察力正迅速成為企業在瞬息萬變的世界中保持競爭力的必要條件。非結構化資料分析需求的增加、運算能力的提升以及運算成本的下降，使得人工智能向量搜尋比以往任何時候都更容易使用。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>傳統上，非結構化資料一直是大規模處理和分析的挑戰，因為它不遵循預定義的模型或組織結構。神經網路 (例如 CNN、RNN 和 BERT) 可將非結構化資料轉換為特徵向量，這是一種可輕鬆由電腦解釋的數值資料格式。之後，演算法會使用余弦相似度或歐氏距離等指標來計算向量之間的相似度。</p>
<p>最終，向量相似性搜尋是一個廣泛的術語，描述在大量資料集中識別相似事物的技術。Beike 使用此技術為智慧型房屋搜尋引擎提供動力，可根據個別使用者的偏好、搜尋歷史和房地產標準自動推薦房源，加速房地產搜尋與購買流程。Milvus 是一個開放原始碼的向量資料庫，可將資訊與演算法連接起來，讓 Beike 得以開發和管理其 AI 房地產平台。</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Milvus 如何管理向量資料？</h3><p>Milvus 是專為大規模向量資料管理而建立，其應用範圍涵蓋影像與視訊搜尋、化學相似性分析、個人化推薦系統、會話式 AI 等等。儲存於 Milvus 的向量資料集可以有效率地進行查詢，大多數的實作都遵循這個一般流程：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>Beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">Beike 如何使用 Milvus 讓找房子更聰明？</h3><p>通常被描述為中國的 Zillow，Beike 是一個線上平台，允許房地產經紀人列出出租或出售的房源。為了幫助改善找房者的搜房體驗，並幫助經紀人更快達成交易，該公司為其房源資料庫建立了一個人工智能驅動的搜索引擎。Beike 的房源資料庫被轉換成特徵向量，然後輸入 Milvus 進行索引和儲存。然後，Milvus 會根據輸入的房源、搜尋條件、使用者資料或其他條件進行相似度搜尋。</p>
<p>例如，在搜尋更多與指定房源相似的住宅時，會擷取平面圖、尺寸、朝向、室內裝潢、油漆顏色等特徵。由於原始資料庫的房源清單資料已被<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">編入索引</a>，因此搜尋只需幾毫秒即可完成。Beike 的最終產品在包含超過 3 百萬向量的資料集上，平均查詢時間為 113 毫秒。然而，Milvus 能夠在萬億規模的資料集上維持高效的速度，讓這個相對較小的不動產資料庫輕鬆應付。一般而言，系統遵循以下流程：</p>
<ol>
<li><p>深度學習模型 (例如 CNN、RNN 或 BERT) 將非結構化資料轉換為特徵向量，然後將特徵向量匯入 Milvus。</p></li>
<li><p>Milvus 儲存並為特徵向量建立索引。</p></li>
<li><p>Milvus 會根據使用者的查詢返回相似性搜尋結果。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>Milvus-overview-diagram.png</span> </span></p>
<p><br/></p>
<p>Beike 的智慧型房地產搜尋平台採用推薦演算法，利用余弦距離計算向量相似度。該系統根據喜愛的房源和搜索條件找到相似的房屋。從高層次來看，其工作原理如下：</p>
<ol>
<li><p>根據輸入的房源資訊，使用平面圖、尺寸和朝向等特徵來萃取 4 個特徵向量集合。</p></li>
<li><p>擷取的特徵集合會用於在 Milvus 中執行相似性搜尋。每個向量集合的查詢結果是輸入房源與其他類似房源之間相似性的量度。</p></li>
<li><p>比較 4 個向量集合的搜尋結果，然後用來推薦相似的房屋。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p><br/></p>
<p>如上圖所示，該系統實現了更新資料的 A/B 表切換機制。Milvus 將前 T 天的資料儲存在 A 表中，在 T+1 天開始將資料儲存在 B 表中，在 2T+1 天開始重寫 A 表，如此類推。</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">若要瞭解更多關於使用 Milvus 製作的資訊，請參閱下列資源：</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">為 WPS Office 打造 AI 寫作助理</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">使用 Milvus 創造：小米手機瀏覽器內的 AI Powered 新聞推薦</a></p></li>
</ul>
