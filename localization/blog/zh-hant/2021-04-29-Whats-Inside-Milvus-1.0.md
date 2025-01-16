---
id: Whats-Inside-Milvus-1.0.md
title: Milvus 1.0 內含什麼？
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: Milvus v1.0 現已上市。了解 Milvus 的基本原理以及 Milvus v1.0 的主要功能。
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>Milvus 1.0 內有什麼？</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvus 是一個開放原始碼的向量資料庫，設計用來管理數百萬、數十億甚至數兆的向量資料集。Milvus 應用廣泛，涵蓋新藥發現、電腦視覺、自動駕駛、推薦引擎、聊天機器人等等。</p>
<p>2021 年 3 月，Milvus 背後的公司 Zilliz 發佈了平台的第一個長期支援版本-Milvus v1.0。經過數月的廣泛測試，全球最受歡迎的向量資料庫的穩定、可生產版本已準備就緒，進入黃金時期。這篇部落格文章涵蓋了一些 Milvus 的基本原理以及 v1.0 的主要功能。</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Milvus 發行版本</h3><p>Milvus 有純 CPU 與支援 GPU 兩種版本。前者完全依賴 CPU 來建立索引和進行搜尋；後者則可啟用 CPU 與 GPU 混合搜尋和建立索引，進一步加速 Milvus。舉例來說，使用混合分佈，CPU 可以用於搜尋，而 GPU 則用於建立索引，進一步提升查詢效率。</p>
<p>兩個 Milvus 發行版都可以在 Docker 中使用。您可以從 Docker 編譯 Milvus (如果您的作業系統支援)，或是在 Linux 上從原始碼編譯 Milvus (不支援其他作業系統)。</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">嵌入向量</h3><p>向量在 Milvus 中以實體形式儲存。每個實體有一個向量 ID 欄位和一個向量欄位。Milvus v1.0 只支援整數向量 ID。在 Milvus 中創建集合時，向量 ID 可以自動生成或手動定義。Milvus 確保自動產生的向量 ID 是唯一的，然而，手動定義的 ID 可以在 Milvus 內重複。如果手動定義 ID，用戶有責任確保所有 ID 都是唯一的。</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">分區</h3><p>Milvus 支援在資料集中建立分區。在資料定期插入且歷史資料不重要的情況下（例如，串流資料），分區可用於加速向量相似性搜尋。一個資料集最多可以有 4,096 個分區。在特定的分區中指定向量搜尋可縮窄搜尋範圍，並可大幅減少查詢時間，尤其是對於包含超過一兆位元向量的資料集。</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">索引演算法最佳化</h3><p>Milvus 建立在多個廣泛採用的索引函式庫之上，包括 Faiss、NMSLIB 和 Annoy。Milvus 遠遠不只是這些索引函式庫的基本包裝程式。以下是底層函式庫的一些主要增強功能：</p>
<ul>
<li>使用 Elkan k-means 演算法優化 IVF 索引效能。</li>
<li>FLAT 搜尋最佳化。</li>
<li>IVF_SQ8H 混合索引支援，可在不犧牲資料精確度的情況下，將索引檔案大小減少達 75%。IVF_SQ8H 建立在 IVF_SQ8 的基礎上，具有相同的召回率，但查詢速度更快。IVF_SQ8H 是專為 Milvus 所設計，以利用 GPU 的平行處理能力，以及 CPU/GPU 協同處理的潛力。</li>
<li>動態指令集相容性。</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">搜尋、索引建立及其他 Milvus 最佳化功能</h3><p>Milvus 已進行下列最佳化，以改善搜尋與索引建立效能。</p>
<ul>
<li>在查詢次數 (nq) 少於 CPU 線程數的情況下，可最佳化搜尋效能。</li>
<li>Milvus 會合併來自用戶端的搜尋請求，這些請求使用相同的 topK 和搜尋參數。</li>
<li>當有搜尋要求時，索引建立會暫停。</li>
<li>Milvus 會在啟動時自動預載資料集到記憶體。</li>
<li>可指派多個 GPU 裝置來加速向量相似性搜尋。</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">距離度量</h3><p>Milvus 是專為向量類似性搜尋而建立的向量資料庫。此平台是以 MLOps 和生產級 AI 應用程式為主。Milvus 支援多種計算相似性的距離指標，例如 Euclidean distance (L2)、inner product (IP)、Jaccard distance、Tanimoto、Hamming distance、superstructure 和 substructure。後兩種度量常用於分子搜尋和人工智能驅動的新藥發現。</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">對數</h3><p>Milvus 支援日誌輪換。在系統設定檔案 milvus.yaml 中，您可以設定單一日誌檔案的大小、日誌檔案的數量，以及日誌輸出至 stdout。</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">分散式解決方案</h3><p>Mishards 是 Milvus 的分片中介軟體，是 Milvus 的分散式解決方案。 Mishards 有一個寫入節點和無限數量的讀取節點，能釋放伺服器群集的計算潛力。其功能包括請求轉發、讀/寫分割、動態/水平擴充等。</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">監控</h3><p>Milvus 與 Prometheus 相容，Prometheus 是一套開放原始碼的系統監控與警示工具套件。Milvus 在 Prometheus 中增加了對 Pushgateway 的支援，使 Prometheus 能夠取得短暫的批次指標。監控與警示系統的運作方式如下：</p>
<ul>
<li>Milvus 伺服器會將自訂的度量資料推送至 Pushgateway。</li>
<li>Pushgateway 確保短暫的度量資料安全地傳送至 Prometheus。</li>
<li>Prometheus 繼續從 Pushgateway 抓取資料。</li>
<li>Alertmanager 用於設定不同指標的警示臨界值，並透過電子郵件或訊息傳送警示。</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">元資料管理</h3><p>Milvus 預設使用 SQLite 來管理元資料。SQLite 在 Milvus 中實現，不需要配置。在生產環境中，建議使用 MySQL 進行元資料管理。</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">參與我們的開放原始碼社群：</h3><ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上尋找或貢獻 Milvus。</li>
<li>透過<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 與社群互動。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上與我們連線。</li>
</ul>
