---
id: Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md
title: Milvus 專為大規模（想想萬億）向量相似性搜尋而設計
author: milvus
date: 2021-01-13T08:56:00.480Z
desc: 在您的下一個 AI 或機器學習專案中探索開放原始碼的力量。使用 Milvus 管理大規模向量資料並強化相似性搜尋。
cover: assets.zilliz.com/1_9a6be0b54f.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search
---
<custom-h1>Milvus 專為大規模（數萬億）向量相似性搜尋而設計</custom-h1><p>每天都有無法估計的關鍵業務洞察力，因為公司無法理解自己的資料而被浪費。據估計，文字、影像、視訊和音訊等非結構化資料佔所有資料的 80%，但其中只有 1% 會被分析。幸運的是，<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f">人工智慧 (AI)</a>、開放源碼軟體和摩爾定律讓機器規模的分析比以往更容易進行。使用向量相似性搜尋，可以從大量非結構化資料集中擷取價值。此技術包括將非結構化資料轉換為特徵向量，一種可即時處理和分析的機器友善數值資料格式。</p>
<p>向量相似性搜尋的應用範圍涵蓋電子商務、安全、新藥開發等。這些解決方案依賴於包含數百萬、數十億、甚至數萬億向量的動態資料集，而它們的實用性往往取決於是否能傳回接近即時的結果。<a href="https://milvus.io/">Milvus</a>是一套開放原始碼的向量資料管理解決方案，從一開始就是為了有效管理和搜尋大型向量資料集而設計。本文將介紹 Milvus 的向量資料管理方法，以及該平台如何針對向量相似性搜尋進行最佳化。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#milvus-was-built-for-massive-scale-think-trillion-vector-similarity-search">Milvus 專為大規模 (Think Trillion) 向量相似性搜尋而打造</a><ul>
<li><a href="#lsm-trees-keep-dynamic-data-management-efficient-at-massive-scales">LSM 樹讓動態資料管理在大規模下保持高效</a>-<a href="#a-segment-of-10-dimensional-vectors-in-milvus"><em>Milvus 中的一段 10 維向量。</em></a></li>
<li><a href="#an-illustration-of-inserting-vectors-in-milvus"><em>在 Milvus 中插入向量的說明。</em></a>-<a href="#queried-data-files-after-the-merge"><em>合</em></a> <a href="#queried-data-files-before-the-merge"><em>併前查詢的資料檔案</em></a>。</li>
<li><a href="#similarity-searched-is-accelerated-by-indexing-vector-data">透過索引向量資料加速相似性搜尋</a></li>
<li><a href="#learn-more-about-milvus">進一步了解 Milvus</a></li>
</ul></li>
</ul>
<h3 id="LSM-trees-keep-dynamic-data-management-efficient-at-massive-scales" class="common-anchor-header">LSM 樹讓大規模的動態資料管理保持高效率</h3><p>為了提供有效率的動態資料管理，Milvus 採用 log-structured merge-tree (LSM tree) 資料結構。LSM 樹非常適合存取有大量插入和刪除的資料。有關 LSM 樹有助於確保高效能動態資料管理的特定屬性的詳細資訊，請參閱其發明者所發表的<a href="http://paperhub.s3.amazonaws.com/18e91eb4db2114a06ea614f0384f2784.pdf">原始研究</a>。LSM 樹是許多流行資料庫所使用的底層資料結構，包括<a href="https://cloud.google.com/bigtable">BigTable</a>、<a href="https://cassandra.apache.org/">Cassandra</a> 和<a href="https://rocksdb.org/">RocksDB</a>。</p>
<p>向量在 Milvus 中以實體形式存在，並儲存在段中。每個區段包含 1 到 ~8 百萬個實體。每個實體都有獨特的 ID 和向量輸入欄位，後者代表 1 到 32768 個維度。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_2_492d31c7a0.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_2.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_2.png" />
   </span> <span class="img-wrapper"> <span>部落格_Milvus 是專為大規模 (Think Trillion) 向量相似性搜尋而設計_2.png</span> </span></p>
<h3 id="Data-management-is-optimized-for-rapid-access-and-limited-fragmentation" class="common-anchor-header">資料管理經過最佳化，以達到快速存取和有限的破碎化</h3><p>當接收到插入請求時，Milvus 會寫入新的資料到<a href="https://milvus.io/docs/v0.11.0/write_ahead_log.md">前寫日誌 (WAL)</a> 中。請求成功記錄到日誌檔後，資料會寫入可變緩衝區。最後，三個觸發器之一會導致緩衝區變為不可變並刷新到磁碟：</p>
<ol>
<li><strong>定時間隔：</strong>資料會以定義的間隔 (預設為 1 秒) 定期刷新到磁碟。</li>
<li><strong>緩衝區大小：</strong>累積資料達到可變緩衝區的上限 (128 MB)。</li>
<li><strong>手動觸發：</strong>當用戶端呼叫 flush 函式時，資料會手動刷新到磁碟。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_3_852dc2c9bb.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_3.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_3.png" />
   </span> <span class="img-wrapper"> <span>部落格_Milvus 專為大規模 (Think Trillion)向量相似性搜尋而打造_3.png</span> </span></p>
<p>使用者可以一次新增數十或數百萬個向量，當插入新向量時會產生不同大小的資料檔案。這會造成資料分散，使資料管理變得複雜，並減慢向量相似性搜尋的速度。為了防止資料過度分散，Milvus 會不斷合併資料片段，直到合併後的檔案大小達到使用者設定的上限 (例如 1 GB)。舉例來說，在上限為 1 GB 的情況下，插入 1 億個 512 維向量將只會產生 ~200 個資料檔案。</p>
<p>在向量同時插入與搜尋的增量計算情境中，Milvus 會先讓新插入的向量資料立即可供搜尋，然後再與其他資料合併。在資料合併之後，原始的資料檔案會被移除，改用新建立的合併檔案進行搜尋。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_4_6bef3d914c.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_4.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_4.png" />
   </span> <span class="img-wrapper"> <span>部落格_Milvus 是專為大規模 (Think Trillion) 矢量相似性搜尋而建立_4.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_5_3851c2d789.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_5.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_5.png</span> </span></p>
<h3 id="Similarity-searched-is-accelerated-by-indexing-vector-data" class="common-anchor-header">透過索引向量資料加速類似性搜尋</h3><p>預設情況下，Milvus 在查詢向量資料時會依賴暴力搜尋。這種方法也稱為窮盡搜尋，每次執行查詢時都會檢查所有向量資料。對於包含數百萬或數十億個多維向量的資料集來說，這個過程太慢，在大多數類似性搜尋情況下都沒有用。為了幫助加快查詢時間，我們使用演算法來建立向量索引。索引的資料會被聚類，使類似向量靠得更近，讓相似性搜尋引擎只需查詢總資料的一部分，大幅縮短查詢時間，但卻犧牲了精確度。</p>
<p>Milvus 支援的向量索引類型大多使用近似近鄰 (ANN) 搜尋演算法。ANN 索引種類繁多，每種都需要在效能、準確性和儲存需求之間作出取捨。Milvus 支援量化、圖形和樹狀索引，所有這些索引都服務於不同的應用場景。請參閱 Milvus 的<a href="https://milvus.io/docs/v0.11.0/index.md#CPU">技術文件</a>，瞭解更多關於建立索引及其支援的向量索引特定類型的資訊。</p>
<p>索引建立會產生大量的元資料。例如，為保存在 200 個資料檔案中的 1 億個 512 維向量建立索引，會產生額外的 200 個索引檔案。為了有效率地檢查檔案狀態、刪除或插入新檔案，需要一個有效率的元資料管理系統。Milvus 使用線上事務處理 (OLTP)，這是一種非常適合更新和/或刪除資料庫中少量資料的資料處理技術。Milvus 使用 SQLite 或 MySQL 來管理元資料。</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">進一步了解 Milvus</h3><p>Milvus 是一個開放原始碼的向量資料管理平台，目前正在<a href="https://lfaidata.foundation/">LF AI &amp; Data</a>（Linux 基金會的傘式組織）進行孵化。Milvus 於 2019 年由發起該專案的資料科學軟體公司<a href="https://zilliz.com">Zilliz</a> 開源。有關 Milvus 的更多資訊，請參閱<a href="https://milvus.io/">其網站</a>。如果您對向量相似性搜尋有興趣，或使用 AI 來釋放非結構化資料的潛力，請加入我們在 GitHub 上的<a href="https://github.com/milvus-io">開放原始碼社群</a>。</p>
