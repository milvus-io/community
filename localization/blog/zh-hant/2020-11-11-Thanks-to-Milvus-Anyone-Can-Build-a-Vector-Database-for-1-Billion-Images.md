---
id: Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md
title: 感謝 Milvus，任何人都能建立超過 10 億張圖片的向量資料庫
author: milvus
date: 2020-11-11T07:13:02.135Z
desc: >-
  AI 與開放原始碼軟體讓您只需一台伺服器與 10 行程式碼，就能建立反向圖片搜尋引擎。使用開放原始碼向量資料管理平台 Milvus 即時搜尋超過 10
  億張圖片，以及更多。
cover: assets.zilliz.com/build_search_9299109ca7.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images
---
<custom-h1>感謝 Milvus，任何人都能建立超過 10 億張圖片的向量資料庫</custom-h1><p>運算能力的提升和運算成本的下降，使得機器規模的分析和人工智能 (AI) 比以往任何時候都更容易獲得。實際上，這意味著只需要一台伺服器和 10 行代碼，就可以建立一個能夠即時查詢超過 10 億張圖片的反向圖片搜尋引擎。本文將解釋如何利用開放原始碼向量資料管理平台<a href="https://milvus.io/">Milvus</a> 來建立強大的非結構化資料處理與分析系統，以及讓這一切成為可能的底層技術。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#thanks-to-milvus-anyone-can-build-a-vector-database-for-1-billion-images">感謝 Milvus，任何人都能建立超過 10 億張圖片的向量資料庫</a><ul>
<li><a href="#how-does-ai-enable-unstructured-data-analytics">人工智能如何實現非結構化資料分析？</a></li>
<li><a href="#neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors">神經網路將非結構化資料轉換為電腦友善的特徵向量</a>-<a href="#ai-algorithms-convert-unstructured-data-to-vectors"><em>AI 演算法將非結構化資料轉換為向量</em></a></li>
<li><a href="#what-are-vector-data-management-platforms">什麼是向量資料管理平台？</a></li>
<li><a href="#what-are-limitations-of-existing-approaches-to-vector-data-management">向量資料管理的現有方法有哪些限制？</a>-<a href="#an-overview-of-milvus-architecture"><em>Milvus 架構概述。</em></a></li>
<li><a href="#what-are-applications-for-vector-data-management-platforms-and-vector-similarity-search">向量資料管理平台和向量相似性搜尋有哪些應用？</a></li>
<li><a href="#reverse-image-search">反向圖像搜尋</a>-<a href="#googles-search-by-image-feature"><em>Google 的「圖像搜尋」功能。</em></a><ul>
<li><a href="#video-recommendation-systems">視訊推薦系統</a></li>
<li><a href="#natural-language-processing-nlp">自然語言處理 (NLP)</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus">進一步瞭解 Milvus</a></li>
</ul></li>
</ul>
<h3 id="How-does-AI-enable-unstructured-data-analytics" class="common-anchor-header">AI 如何實現非結構化資料分析？</h3><p>一個經常被引用的統計數據是，全球 80% 的資料都是非結構化的，但只有 1% 得到分析。非結構化資料，包括影像、視訊、音訊和自然語言，並不遵循預先定義的模型或組織方式。這使得處理和分析大型非結構化資料集變得困難。隨著智慧型手機和其他連線裝置的普及，將非結構化資料的產生推向新的高峰，企業也逐漸意識到從這些模糊的資訊中所獲得的洞察力有多重要。</p>
<p>數十年來，電腦科學家們開發了專門用於組織、搜尋和分析特定資料類型的索引演算法。對於結構化資料，有位圖 (bitmap)、哈希表 (hash tables) 和 B 樹 (B-tree)，這些常用於 Oracle 和 IBM 等科技巨擘所開發的關聯式資料庫。對於半結構化資料，倒轉式索引演算法是標準演算法，可在<a href="http://www.solrtutorial.com/basic-solr-concepts.html">Solr</a>和<a href="https://www.elastic.co/blog/found-elasticsearch-from-the-bottom-up#inverted-indexes-and-index-terms">ElasticSearch</a> 等熱門搜尋引擎中找到。然而，非結構化資料的索引演算法則依賴於計算密集的人工智慧，而人工智慧在過去十年才開始普及。</p>
<h3 id="Neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors" class="common-anchor-header">神經網路將非結構化資料轉換為電腦友善的特徵向量</h3><p>使用神經網路（例如<a href="https://en.wikipedia.org/wiki/Convolutional_neural_network">CNN</a>、<a href="https://en.wikipedia.org/wiki/Recurrent_neural_network">RNN</a> 和<a href="https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270">BERT</a>）可將非結構性資料轉換為特徵向量（又稱嵌入），特徵向量是一串整數或浮點數。這種數值資料格式更容易被機器處理和分析。將非結構化的資料嵌入到特徵向量中，然後用歐氏距離或余弦相似度等方法計算向量之間的相似度，就可以建立跨越反向圖像搜尋、視訊搜尋、自然語言處理 (NLP) 等應用程式。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_2_db8c16aea4.jpeg" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_2.jpeg" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_2.jpeg" />
   </span> <span class="img-wrapper"> <span>博客_有了人工智能，任何人都可以為十億張以上的圖片建立搜尋引擎_2.jpeg</span> </span></p>
<p>計算向量相似性是一個相對簡單的過程，需要依賴既有的演算法。然而，非結構化資料集即使在轉換成特徵向量之後，通常也會比傳統的結構化及半結構化資料集大上幾個數量級。要有效且精確地查詢大規模的非結構化資料，向量相似性搜尋所需的儲存空間和運算能力是相當複雜的。 不過，如果可以犧牲某種程度的精確度，有各種近似近鄰 (ANN) 搜尋演算法可以大幅改善高維度大規模資料集的查詢效率。這些 ANN 演算法透過將類似向量聚類在一起來降低儲存需求和計算負載，進而加快向量搜尋的速度。常用的演算法包括樹狀演算法、圖形演算法和組合 ANN。</p>
<h3 id="What-are-vector-data-management-platforms" class="common-anchor-header">什麼是向量資料管理平台？</h3><p>向量資料管理平台是專為儲存、處理和分析大量向量資料集而設計的應用程式。這些工具的設計目的在於輕易地與大量資料連接，並包含簡化向量資料管理的功能。遺憾的是，很少有系統既靈活又強大，足以解決現代的大數據挑戰。Milvus 是由<a href="https://zilliz.com/">Zilliz</a>發起，並於 2019 年以開放原始碼授權釋出的向量資料管理平台，試圖填補這個空白。</p>
<h3 id="What-are-limitations-of-existing-approaches-to-vector-data-management" class="common-anchor-header">向量資料管理的現有方法有哪些限制？</h3><p>建立非結構化資料分析系統的常見方式，是將 ANN 等演算法與 Facebook AI Similarity Search (Faiss) 等開源實作函式庫搭配使用。由於多種限制，這些演算法與實作函式庫的組合並不等同於 Milvus 之類的完整向量資料管理系統。用於管理向量資料的現有技術面臨以下問題：</p>
<ol>
<li><strong>彈性：</strong>預設情況下，現有系統通常會將所有資料儲存在主記憶體中，這表示它們無法在多台機器上執行，而且不適合處理大量資料集。</li>
<li><strong>動態資料處理：</strong>一旦將資料輸入現有系統，通常會假設資料是靜態的，這使得動態資料的處理變得複雜，也使得近乎即時的搜尋變得不可能。</li>
<li><strong>進階查詢處理：</strong>大多數工具都不支援進階查詢處理 (例如屬性篩選和多向量查詢)，而這對建立有用的相似性搜尋引擎是非常重要的。</li>
<li><strong>異質運算最佳化：</strong>很少有平台能同時在 CPU 和 GPU（不包括 Faiss）上為異質系統架構提供最佳化，導致效率降低。</li>
</ol>
<p>Milvus 嘗試克服所有這些限制。本系統透過提供多種應用程式介面 (包括 Python、Java、Go、C++ 的 SDK 及 RESTful APIs)、多種向量索引類型 (例如：基於量化的索引及基於圖的索引) 及進階查詢處理的支援，增強彈性。Milvus 使用日誌結構合併樹 (LSM tree) 來處理動態向量資料，讓資料的插入與刪除保持高效率，並能即時進行搜尋。Milvus 也針對現代 CPU 和 GPU 上的異質運算架構提供最佳化，讓開發人員可以針對特定的情境、資料集和應用環境調整系統。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_3_380e31d32c.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_3.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_3.png" />
   </span> <span class="img-wrapper"> <span>部落格_拜人工智慧所賜，任何人都能為十億張以上的圖片建立搜尋引擎_3.png</span> </span></p>
<p>Milvus 使用各種 ANN 索引技術，能夠達到 99% 的前五名召回率。該系統還能夠每分鐘載入一百多萬個資料項目。這使得在 10 億張圖片上執行反向圖片搜尋時，查詢時間少於 1 秒。由於 Milvus 是雲端原生應用程式，可作為部署在多個節點的分散式系統運作，因此可以輕鬆可靠地在包含 100 億甚至 1000 億張圖片的資料集上達到類似效能。此外，該系統並不限於影像資料，應用範圍涵蓋電腦視覺、會話式 AI、推薦系統、新藥發現等。</p>
<h3 id="What-are-applications-for-vector-data-management-platforms-and-vector-similarity-search" class="common-anchor-header">向量資料管理平台和向量相似性搜尋有哪些應用？</h3><p>如上文所述，Milvus 這類功能強大的向量資料管理平台搭配近似近鄰演算法，可在大量非結構化資料上進行相似性搜尋。這項技術可用於開發跨領域的應用程式。以下我們將簡單介紹向量資料管理工具和向量類似性搜尋的幾個常見用例。</p>
<h3 id="Reverse-image-search" class="common-anchor-header">反向影像搜尋</h3><p>Google 等主要搜尋引擎已經提供使用者依圖像搜尋的選項。此外，電子商務平台也意識到這項功能為線上購物者帶來的好處，Amazon 已將圖片搜尋納入其智慧型手機應用程式中。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_4_7884aabcd8.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_4.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_4.png" />
   </span> <span class="img-wrapper"> <span>部落格_藉由人工智慧，任何人都能建立超過十億張圖片的搜尋引擎_4.png</span> </span></p>
<p>Milvus 等開放原始碼軟體讓任何企業都能建立自己的反向圖片搜尋系統，降低了這項需求日增的功能的進入門檻。開發人員可以使用預先訓練好的 AI 模型，將自己的圖片資料集轉換成向量，然後再利用 Milvus 來實現透過圖片搜尋類似產品的功能。</p>
<h4 id="Video-recommendation-systems" class="common-anchor-header">視訊推薦系統</h4><p>YouTube 等大型線上視訊平台<a href="https://www.tubefilter.com/2019/05/07/number-hours-video-uploaded-to-youtube-per-minute/">每分鐘可</a>接收<a href="https://www.tubefilter.com/2019/05/07/number-hours-video-uploaded-to-youtube-per-minute/">500 小時的使用者產生內容</a>，因此在內容推薦方面有其獨特的需求。為了在考慮到新上傳內容的情況下進行相關的即時推薦，視訊推薦系統必須提供快如閃電的查詢時間和有效的動態資料處理。透過將關鍵畫面轉換為向量，然後將結果饋送至 Milvus，數十億的影片就可以近乎即時地進行搜尋和推薦。</p>
<h4 id="Natural-language-processing-NLP" class="common-anchor-header">自然語言處理 (NLP)</h4><p>自然語言處理是人工智慧的一個分支，其目的在於建立可以詮釋人類語言的系統。將文字資料轉換為向量後，Milvus 可用於快速識別和移除重複文字、強化語意搜尋，甚至<a href="https://medium.com/unstructured-data-service/how-artificial-intelligence-empowered-professional-writing-f433c7e5b561%22%20/">建立智慧型寫作助理</a>。有效的向量資料管理平台有助於最大化任何 NLP 系統的效用。</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">進一步瞭解 Milvus</h3><p>如果您想進一步瞭解 Milvus，請造訪我們的<a href="https://milvus.io/">網站</a>。此外，我們的<a href="https://github.com/milvus-io/bootcamp">Bootcamp</a>提供了多種教學，包括設定 Milvus、基準測試和建立各種不同應用程式的說明。如果您對向量資料管理、人工智慧和大資料挑戰感興趣，請加入我們在<a href="https://github.com/milvus-io">GitHub</a>上的開放原始碼社群，並與我們在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上交談。</p>
<p>想要瞭解更多關於建立影像搜尋系統的資訊嗎？查看此案例研究：</p>
<ul>
<li><a href="https://medium.com/vector-database/the-journey-to-optimize-billion-scale-image-search-part-1-a270c519246d">優化十億級圖片搜尋的旅程 (1/2)</a></li>
<li><a href="https://medium.com/unstructured-data-service/the-journey-to-optimizing-billion-scale-image-search-2-2-572a36d5d0d">優化十億級圖像搜尋之旅 (2/2)</a></li>
</ul>
