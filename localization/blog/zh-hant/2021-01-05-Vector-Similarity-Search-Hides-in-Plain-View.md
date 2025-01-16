---
id: Vector-Similarity-Search-Hides-in-Plain-View.md
title: 要瞭解向量相似性搜尋的更多資訊，請參閱下列資源：
author: milvus
date: 2021-01-05T03:40:20.821Z
desc: 探索什麼是向量相似性搜尋、它的各種應用，以及讓人工智慧比以往更容易取得的公共資源。
cover: assets.zilliz.com/plainview_703d8497ca.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View'
---
<custom-h1>矢量相似性搜索隱藏在眾目睽睽之下</custom-h1><p><a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#a291">人工智能 (AI)</a>有潛力改變最不起眼的事情的處理方式。例如，每年（反正是在 COVID 之前）都有超過 73,000 人聚集在一起參加香港馬拉松比賽。為了正確感應並記錄所有參賽者的完賽時間，主辦單位會向每位參賽者派發 73,000 個 RFID 晶片計時器。晶片計時是一項複雜的工作，也有明顯的缺點。必須向計時公司購買或租用材料 (晶片和電子讀取裝置)，而且在比賽當天必須設置註冊區供參賽者領取晶片。此外，如果感應器只安裝在起點線和終點線，不法選手就有可能繞道。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_1_e55c133e05.jpeg" alt="blog-1.jpeg" class="doc-image" id="blog-1.jpeg" />
   </span> <span class="img-wrapper"> <span>blog-1.jpeg</span> </span></p>
<p>現在試想一下，<a href="https://cloud.google.com/video-intelligence">視訊 AI</a>應用程式能夠從終點線拍攝的<a href="https://cloud.google.com/video-intelligence">影片</a>中，利用單張照片自動識別出個別的選手。與其在每位參賽者身上貼上計時晶片，跑手只需在衝過終點線後，透過應用程式上傳自己的照片。即時就會提供個人化的精華片段、賽事統計資料和其他相關資訊。安裝在整個賽程中不同地點的攝影機可以捕捉更多關於參賽者的畫面，確保每位選手都跑完全程。哪一種解決方案看起來更容易實作且更具成本效益？</p>
<p>雖然香港馬拉松賽事並沒有利用機器學習來取代計時晶片（目前還沒有），但這個例子說明人工智能有可能大幅改變我們周遭的一切。對於賽事計時而言，它可將數以萬計的晶片減少為數台搭配機器學習演算法的攝影機。但視訊 AI 只是向量類似性搜尋的眾多應用之一，向量類似性搜尋是一種使用人工智慧來分析數兆規模的大量非結構性資料集的程序。本文將概述向量搜尋技術，包括何謂向量搜尋技術、如何使用向量搜尋技術，以及使向量搜尋技術比以往更容易取得的開放原始碼軟體與資源。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><p><a href="#what-is-vector-similarity-search">什麼是向量類似性搜尋？</a></p></li>
<li><p><a href="#what-are-some-applications-of-vector-similarity-search">向量類似性搜尋有哪些應用？</a></p></li>
<li><p><a href="#open-source-vector-similarity-search-software-and-resources">開放源碼向量類似性搜尋軟體與資源。</a></p></li>
</ul>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">什麼是向量類似性搜尋？</h3><p>視訊資料非常詳盡，而且越來越常見，因此從邏輯上來看，它似乎是建立視訊人工智能的絕佳無監督學習信號。實際上，情況並非如此。處理和分析視訊資料，尤其是大量的視訊資料，仍然是<a href="https://arxiv.org/pdf/1905.11954.pdf">人工智慧的一大挑戰</a>。這個領域最近的進展，就像非結構化資料分析的大部分進展一樣，很大程度上要歸功於向量相似性搜尋。</p>
<p>與所有非結構化資料一樣，視訊的問題在於它並不遵循預先定義的模型或組織結構，因此難以進行大規模的處理與分析。非結構化資料包括影像、音訊、社交媒體行為和文件等，估計合共佔所有資料的 80-90% 以上。企業越來越意識到埋藏在龐大、神秘的非結構化資料集中的關鍵業務洞察力，這驅動了對能夠發掘這些未實現潛力的 AI 應用程式的需求。</p>
<p>使用 CNN、RNN 和 BERT 等<a href="https://en.wikipedia.org/wiki/Neural_network">神經網路</a>，可將非結構化資料轉換為特徵向量 (又稱嵌入)，這是一種機器可讀取的數值資料格式。之後，就可以使用類似余弦相似度或歐氏距離的方法來計算向量之間的相似度。向量嵌入和相似性搜尋讓我們可以使用以前無法分辨的資料集來分析和建立機器學習應用程式。</p>
<p>向量相似性是使用已建立的演算法來計算的，然而，非結構化資料集通常都很龐大。這意味著高效且精確的搜尋需要大量的儲存空間和運算能力。為了<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">加速相似性搜尋並</a>降低資源需求，我們使用近似近鄰 (ANN) 搜尋演算法。ANN 演算法將類似向量聚類在一起，因此可以將查詢傳送至最有可能包含類似向量的向量聚類，而不是搜尋整個資料集。雖然這種方法速度較快，但卻犧牲了某種程度的精確度。利用 ANN 演算法，向量搜尋可以在毫秒鐘內梳理數十億個深度學習模型的洞察力。</p>
<h3 id="What-are-some-applications-of-vector-similarity-search" class="common-anchor-header">向量相似性搜尋有哪些應用？</h3><p>向量類似性搜尋的應用範圍涵蓋各種人工智慧、深度學習和傳統向量計算情境。以下是各種向量類似性搜尋應用的高階概述：</p>
<p><strong>電子商務：</strong>向量類似性搜尋在電子商務中具有廣泛的應用性，包括反向圖像搜尋引擎，可讓購物者使用智慧型手機擷取的圖像或線上找到的圖像來搜尋產品。此外，基於使用者行為、興趣、購物歷史等的個人化推薦，也可由依賴向量搜尋的專業推薦系統提供。</p>
<p><strong>實體與網路安全：</strong>視訊 AI 只是向量類似性搜尋在安全領域的眾多應用之一。其他應用情境包括臉部辨識、行為追蹤、身分驗證、智慧型門禁控制等。此外，向量類似性搜尋在挫敗日益普遍且複雜的網路攻擊中扮演重要角色。舉例來說，<a href="https://medium.com/gsi-technology/application-of-ai-to-cybersecurity-part-3-19659bdb3422">程式碼相似性搜尋</a>可用於比較軟體與已知漏洞或惡意軟體資料庫，以辨識安全風險。</p>
<p><strong>推薦引擎：</strong>推薦引擎是使用機器學習和資料分析來向使用者推薦產品、服務、內容和資訊的系統。使用者行為、類似使用者的行為和其他資料會使用深度學習方法處理，以產生推薦。只要有足夠的資料，就可以訓練演算法來了解實體之間的關係，並發明自主表示實體的方法。推薦系統具有廣泛的適用性，人們每天都會與之互動，包括 Netflix 的內容推薦、亞馬遜的購物推薦以及 Facebook 的新聞推薦。</p>
<p><strong>聊天機器人：</strong>傳統上，聊天機器人是使用一般的知識圖形建立，需要大量的訓練資料集。但是，使用深度學習模型建立的聊天機器人不需要預先處理資料，而是會建立常見問題與答案之間的映射。使用預先訓練的自然語言處理 (NLP) 模型，可以從問題中萃取特徵向量，然後儲存並透過<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#92e0">向量資料管理平台</a>進行查詢。</p>
<p><strong>圖片或視訊搜尋：</strong>深度學習網路自 1970 年代末就開始用於辨識視覺模式，而現代科技趨勢也讓圖像與視訊搜尋比以往更為強大、更容易使用。</p>
<p><strong>化學相似性搜尋：</strong>化學相似性是預測化合物屬性與尋找具有特定屬性化學物質的關鍵，因此化學相似性是開發新藥不可或缺的關鍵。我們會為每個分子建立以特徵向量代表的指紋，然後用向量之間的距離來衡量相似性。將人工智能用於新藥開發在科技產業中的發展勢頭越來越猛，ByteDance（TikTok 的中國母公司）已經開始<a href="https://techcrunch.com/2020/12/23/bytedance-ai-drug/">招募該領域的人才</a>。</p>
<h3 id="Open-source-vector-similarity-search-software-and-resources" class="common-anchor-header">開放原始碼向量相似性搜尋軟體與資源。</h3><p>摩爾定律、雲端運算、資源成本下降等宏觀趨勢，讓人工智慧比以往更容易獲得。多虧了開源軟體和其他公開可用的資源，建立 AI/ML 應用程式不再只是大型科技公司的專利。以下我們將簡要介紹開放原始碼向量資料管理平台 Milvus，並重點介紹一些可公開取得的資料集，這些資料集有助於讓每個人都能接觸到人工智慧。</p>
<h4 id="Milvus-an-open-source-vector-data-management-platform" class="common-anchor-header">開放原始碼向量資料管理平台 Milvus</h4><p><a href="https://milvus.io/">Milvus</a>是一個開放源碼向量資料管理平台，專為大規模向量資料而打造。Milvus 由 Facebook AI Similarity Search (Faiss)、Non-Metric Space Library (NMSLIB) 和 Annoy 提供技術支援，將各種強大的工具整合在單一平台下，同時擴充其獨立功能。該系統專為儲存、處理及分析大型向量資料集而打造，可用於建立上述所有 (及更多) 的 AI 應用程式。</p>
<p>有關 Milvus 的更多資訊可在<a href="https://milvus.io/">其網站上</a>找到。在<a href="https://github.com/milvus-io/bootcamp">Milvus bootcamp</a> 中可以找到教學、設定<a href="https://github.com/milvus-io/bootcamp">Milvus</a> 的說明、基準測試，以及建立各種不同應用程式的資訊。有興趣為專案做出貢獻的開發人員，可以加入<a href="https://github.com/milvus-io">GitHub</a> 上 Milvus 的開放原始碼社群。</p>
<h4 id="Public-datasets-for-artificial-intelligence-and-machine-learning" class="common-anchor-header">人工智慧與機器學習的公共資料集</h4><p>Google 和 Facebook 等科技巨頭對小公司擁有資料優勢已不是秘密，有些學者甚至主張制定「<a href="https://www.technologyreview.com/2019/06/06/135067/making-big-tech-companies-share-data-could-do-more-good-than-breaking-them-up/">進步資料分享授權</a>」，強迫超過一定規模的公司與較小的競爭對手分享一些匿名資料。幸運的是，有數以千計的公開資料集可用於 AL/ML 專案：</p>
<ul>
<li><p><strong>The People's Speech Dataset：</strong>這個<a href="https://mlcommons.org/en/peoples-speech/">來自 ML Commons 的資料集</a>提供了全球最大的語音資料集，包含超過 87,000 小時的 59 種不同語言的語音轉錄。</p></li>
<li><p><strong>UC Irvine Machine Learning Repository：</strong>加州大學爾灣分校維護<a href="https://archive.ics.uci.edu/ml/index.php">數百個公共資料集</a>，致力於幫助機器學習社群。</p></li>
<li><p><strong>Data.gov：</strong>美國政府提供<a href="https://www.data.gov/">數十萬個開放資料集</a>，涵蓋教育、氣候、COVID-19 等。</p></li>
<li><p><strong>歐盟統計局 (Eurostat)：</strong>歐盟統計局提供的<a href="https://ec.europa.eu/eurostat/data/database">開放資料集涵</a>蓋各行各業，從經濟與金融到人口與社會狀況。</p></li>
<li><p><strong>Harvard Dataverse：</strong> <a href="https://dataverse.harvard.edu/">Harvard Dataverse Repository</a>是一個免費的資料庫，開放給各學科的研究人員使用。許多資料集是公開的，而其他資料集則有較受限制的使用條款。</p></li>
</ul>
<p>儘管這份清單並非詳盡無遺，但它是一個很好的起點，讓您發現多得令人驚訝的各種開放資料集。如需有關公開資料集的更多資訊，以及為您的下一個 ML 或資料科學專案選擇正確的資料，請參閱<a href="https://altexsoft.medium.com/best-public-datasets-for-machine-learning-and-data-science-sources-and-advice-on-the-choice-636a0e754052">Medium 的</a>這<a href="https://altexsoft.medium.com/best-public-datasets-for-machine-learning-and-data-science-sources-and-advice-on-the-choice-636a0e754052">篇文章</a>。</p>
<h2 id="To-learn-more-about-vector-similarity-search-check-out-the-following-resources" class="common-anchor-header">要瞭解向量相似性搜尋的更多資訊，請參閱下列資源：<button data-href="#To-learn-more-about-vector-similarity-search-check-out-the-following-resources" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md">感謝 Milvus，任何人都可以為超過 10 億張圖片建立搜尋引擎</a></li>
<li><a href="https://milvus.io/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md">Milvus 是專為大規模 (想想萬億) 矢量類似性搜尋而建立的</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">使用矢量索引加速大型資料的類似性搜尋</a></li>
<li><a href="https://zilliz.com/learn/index-overview-part-2">利用矢量索引加速大型資料的類似性搜尋（第二部分）</a></li>
</ul>
