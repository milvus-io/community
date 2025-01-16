---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: 使用 iYUNDONG Sports App 擷取賽事精華
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: 使用 Milvus 製作運動應用程式 iYUNDONG 智慧型影像檢索系統
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>使用 iYUNDONG 運動應用程式擷取賽事精華</custom-h1><p>iYUNDONG 是一家互聯網公司，旨在吸引更多的運動愛好者和活動參與者，例如馬拉松比賽。該公司打造的<a href="https://en.wikipedia.org/wiki/Artificial_intelligence">人工智慧 (AI)</a>工具可分析在體育賽事中擷取的媒體，自動產生精華片段。舉例來說，只要上傳一張自拍照，iYUNDONG 運動應用程式的用戶只要參加過某項運動賽事，就能立即從該運動賽事的海量媒體資料集中檢索到自己的照片或視頻片段。</p>
<p>iYUNDONG App 的主要功能之一是 "Find me in motion"。  攝影師通常會在馬拉松比賽等體育活動中拍攝大量照片或影片，並即時上傳至 iYUNDONG 媒體資料庫。馬拉松選手如果想查看自己的精彩時刻，只需上傳一張自拍照，就可以檢索包括自己在內的照片。由於 iYUNDONG App 中的圖像檢索系統可完成所有圖像匹配工作，因此可節省大量時間。iYUNDONG 採用<a href="https://milvus.io/">Milvus</a>來推動這個系統，因為 Milvus 可以大大加快檢索過程，並返回高度準確的結果。</p>
<p><br/></p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">使用 iYUNDONG Sports App 擷取賽事精華</a><ul>
<li><a href="#difficulties-and-solutions">困難與解決方案</a></li>
<li><a href="#what-is-milvus">什麼是Milvus</a>-<a href="#an-overview-of-milvus"><em>Milvus的概述。</em></a></li>
<li><a href="#why-milvus">為什麼使用 Milvus</a></li>
<li><a href="#system-and-workflow">系統和工作流程</a></li>
<li><a href="#iyundong-app-interface">iYUNDONG 應用程式介面</a>-<a href="#iyundong-app-interface-1"><em>iYUNDONG 應用程式介面。</em></a></li>
<li><a href="#conclusion">總結</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">困難與解決方案</h3><p>iYUNDONG 在建立圖像檢索系統時，面臨以下問題，並成功找到相應的解決方案。</p>
<ul>
<li>活動照片必須立即可供搜尋。</li>
</ul>
<p>iYUNDONG 開發了一個名為 InstantUpload 的功能，以確保活動照片上傳後可立即供搜尋。</p>
<ul>
<li>海量資料集的儲存</li>
</ul>
<p>照片和視訊等海量資料每毫秒上傳至 iYUNDONG 後端。因此 iYUNDONG 決定轉移到雲端儲存系統，包括<a href="https://aws.amazon.com/">AWS</a>、<a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a> 和<a href="https://www.alibabacloud.com/product/oss">阿里巴巴雲端物件儲存服務 (OSS)</a>，以安全、快速和可靠的方式處理巨量的非結構化資料。</p>
<ul>
<li>即時讀取</li>
</ul>
<p>為了實現即時讀取，iYUNDONG 自行開發了 sharding 中介軟體，輕鬆實現橫向擴展，減輕磁碟讀取對系統的影響。此外，還使用<a href="https://redis.io/">Redis</a>作為快取層，以確保在高併發的情況下，仍能維持一致的效能。</p>
<ul>
<li>即時擷取臉部特徵</li>
</ul>
<p>為了準確且有效率地從使用者上傳的照片中萃取臉部特徵，iYUNDONG 開發了一套專屬的影像轉換演算法，將影像轉換成 128 維的特徵向量。遇到的另一個問題是，很多時候，很多用戶和攝影師同時上傳圖像或視頻。因此，系統工程師在部署系統時需要考慮動態可擴展性。具體而言，iYUNDONG 充分利用其雲端彈性運算服務 (ECS) 來實現動態擴充。</p>
<ul>
<li>快速且大規模的向量搜尋</li>
</ul>
<p>iYUNDONG 需要一個向量資料庫來存儲大量由人工智能模型提取的特徵向量。根據其獨特的業務應用情境，iYUNDONG 期望向量資料庫能夠</p>
<ol>
<li>在超大資料集上執行快速向量檢索。</li>
<li>以更低的成本實現海量儲存。</li>
</ol>
<p>最初，iYUNDONG 每年平均處理 100 萬張影像，因此將所有資料儲存在 RAM 中供搜尋。然而，近兩年來，其業務蓬勃發展，非結構化數據呈指數級增長--2019 年，iYUNDONG 資料庫中的圖像數量超過 6000 萬張，這意味著有超過 10 億個特徵向量需要存儲。龐大的數據量不可避免地讓 iYUNDONG 系統的建置變得繁重且耗費資源。因此，它必須持續投資硬體設施，以確保高效能。具體而言，iYUNDONG 部署了更多的搜尋伺服器、更大的記憶體和性能更佳的 CPU，以達到更高的效率和水平擴展性。然而，此解決方案的缺陷之一是導致營運成本過高。因此，iYUNDONG 開始探索更好的解決方案，並思考利用 Faiss 之類的向量索引函式庫來節省成本，並更好地引導其業務。最後，iYUNDONG 選擇了開源向量資料庫 Milvus。</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">什麼是 Milvus</h3><p>Milvus 是一個開源向量資料庫，易於使用、高度彈性、可靠且快速。結合各種深度學習模型，如照片和語音識別、視頻處理、自然語言處理等，Milvus 可以處理和分析非結構化資料，並利用各種 AI 演算法將這些資料轉換成向量。以下是 Milvus 處理所有非結構化資料的工作流程：</p>
<p>透過深度學習模型或其他 AI 演算法，將非結構化資料轉換為嵌入向量。</p>
<p>然後將嵌入向量插入 Milvus 進行儲存。Milvus 還會為這些向量建立索引。</p>
<p>Milvus 會根據各種業務需求執行相似性搜尋並回傳精確的搜尋結果。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>iYUNDONG 博客 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">為什麼選擇 Milvus</h3><p>自 2019 年底開始，iYUNDONG 就使用 Milvus 對其圖片檢索系統進行了一系列測試。測試結果顯示，Milvus 的表現優於其他主流向量資料庫，因為它支援多重索引，並能有效降低 RAM 使用量，大幅壓縮向量相似性搜尋的時間線。</p>
<p>此外，Milvus 會定期推出新版本。在測試期間，Milvus 經歷了從 v0.6.0 到 v0.10.1 的多次版本更新。</p>
<p>此外，Milvus 擁有活躍的開放原始碼社群和強大的開箱即用功能，讓 iYUNDONG 可以在緊絀的開發預算下運作。</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">系統與工作流程</h3><p>iYUNDONG 的系統首先透過偵測攝影師上傳的活動照片中的人臉來擷取臉部特徵。然後，這些臉部特徵會被轉換成 128 維向量，並儲存在 Milvus 資料庫中。Milvus 會為這些向量建立索引，並能即時傳回高度精確的結果。</p>
<p>其他附加資訊，例如照片 ID 和顯示人臉在照片中位置的座標，則儲存在第三方資料庫中。</p>
<p>iYUNDONG 採用<a href="https://about.meituan.com/en">美團</a>基礎研發平台開發的分散式 ID 生成服務<a href="https://github.com/Meituan-Dianping/Leaf">Leaf 演算法</a>，將 Milvus 中的向量 ID 與另一個資料庫中相對應的附加資訊聯繫起來。通過結合特徵向量和附加資訊，i 元冬系統可以在用戶搜索時返回相似的結果。</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">iYUNDONG 應用程式介面</h3><p>iYUNDONG App 首頁列出一系列最新的體育賽事。點選其中一項賽事，使用者即可看到完整的詳細資訊。</p>
<p>點選相冊頁面上方的按鈕後，用戶可以上傳自己的照片，檢索精華片段的影像。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interface.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">總結</h3><p>本文介紹了 iYUNDONG App 如何建立一個智慧型的圖片檢索系統，可以根據使用者上傳的照片在解析度、大小、清晰度、角度等方面的差異，以及其他使相似性檢索變得複雜的方式，準確地傳回檢索結果。在 Milvus 的協助下，iYUNDONG App 可以在 6000 多萬張圖片的資料庫中成功執行毫秒級的查詢。而照片檢索的準確率一直保持在 92% 以上。Milvus讓iYUNDONG更容易在短時間內以有限的資源建立一個強大的企業級圖片檢索系統。</p>
<p>閱讀其他<a href="https://zilliz.com/user-stories">用戶故事</a>，了解更多使用 Milvus 製造的事情。</p>
