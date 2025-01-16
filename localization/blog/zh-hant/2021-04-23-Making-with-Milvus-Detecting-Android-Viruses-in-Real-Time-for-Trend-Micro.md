---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: 與 Milvus 合作為趨勢科技即時偵測 Android 病毒
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: 瞭解 Milvus 如何透過即時病毒檢測來減緩對關鍵資料的威脅並加強網路安全。
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>與 Milvus 合作：為趨勢科技即時偵測 Android 病毒</custom-h1><p>網路安全對於個人和企業而言仍是持續的威脅，2020 年<a href="https://www.getapp.com/resources/annual-data-security-report/">有 86% 的公司</a>對於資料隱私的疑慮與日俱增，只有<a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23% 的消費者</a>認為他們的個人資料非常安全。隨著惡意軟體變得越來越無所不在和複雜，主動偵測威脅的方法變得非常重要。<a href="https://www.trendmicro.com/en_us/business.html">趨勢科技</a>是混合雲端安全、網路防禦、小型企業安全與端點安全的全球領導廠商。為了保護 Android 裝置免受病毒侵害，該公司建立了趨勢科技行動安全 (Trend Micro Mobile Security)，這是一個行動應用程式，可將 Google Play 商店的 APK (Android 應用程式套件) 與已知惡意軟體資料庫進行比較。病毒偵測系統的運作方式如下：</p>
<ul>
<li>抓取來自 Google Play 商店的外部 APK（Android 應用程式套件）。</li>
<li>已知的惡意軟體會被轉換成向量並儲存在<a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a> 中。</li>
<li>新的 APK 也會轉換成向量，然後與惡意軟體資料庫使用相似性搜尋進行比對。</li>
<li>如果 APK 向量與任何惡意軟體向量相似，應用程式會為使用者提供有關病毒及其威脅等級的詳細資訊。</li>
</ul>
<p>為了運作，系統必須即時在大量向量資料集上執行高效率的相似性搜尋。最初，趨勢科技使用<a href="https://www.mysql.com/">MySQL</a>。然而，隨著其業務的擴展，資料庫中儲存的含有惡意程式碼的 APK 數量也隨之增加。該公司的演算法團隊在迅速超越 MySQL 之後，開始尋找其他向量類似性搜尋解決方案。</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">比較向量類似性搜尋解決方案</h3><p>目前有許多向量類似性搜尋解決方案，其中許多都是開放原始碼。雖然每個專案的情況不同，但大多數使用者都能從利用專為非結構化資料處理和分析而建立的向量資料庫，而非需要大量設定的簡單資料庫中獲益。以下我們會比較一些熱門的向量相似性搜尋解決方案，並解釋趨勢科技選擇 Milvus 的原因。</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a>是由 Facebook AI Research 所開發的函式庫，能夠對密集向量進行有效率的相似性搜尋與聚類。它所包含的演算法可以在集合中搜尋任何大小的向量。Faiss 以 C++ 寫成，並有 Python/numpy 的 wrappers，支援多種索引，包括 IndexFlatL2、IndexFlatIP、HNSW 和 IVF。</p>
<p>雖然 Faiss 是個非常有用的工具，但也有其限制。它只能當作基本演算法函式庫，而不是管理向量資料集的資料庫。此外，它並不提供分散式版本、監控服務、SDK 或高可用性，而這些正是大多數雲端服務的主要特色。</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">基於 Faiss 及其他 ANN 搜尋程式庫的外掛程式</h4><p>在 Faiss、NMSLIB 和其他 ANN 搜尋程式庫的基礎上，有幾種外掛程式是為了增強底層工具的基本功能而設計的。Elasticsearch (ES) 是基於 Lucene 函式庫的搜尋引擎，其中有許多這樣的外掛。以下是 ES 外掛程式的架構圖：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>內建的分散式系統支援是 ES 解決方案的一大優勢。由於無需編寫程式碼，這可節省開發人員的時間和公司的成本。ES 外掛程式在技術上相當先進，也相當普遍。Elasticsearch 提供 QueryDSL (特定領域語言)，以 JSON 為基礎定義查詢，容易掌握。全套的 ES 服務使得同時進行向量/文字搜尋和標量資料篩選成為可能。</p>
<p>亞馬遜、阿里巴巴和網易是目前幾家依賴 Elasticsearch 外掛程式進行向量相似性搜尋的大型科技公司。此解決方案的主要缺點是記憶體消耗量大，且不支援效能調整。相比之下，<a href="http://jd.com/">JD.com</a>已基於 Faiss 開發了自己的分散式解決方案，稱為<a href="https://github.com/vearch/vearch">Vearch</a>。然而，Vearch 仍處於孵化階段，其開源社群也相對不活躍。</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus</a>是<a href="https://zilliz.com">Zilliz</a> 開發的開放原始碼向量資料庫。它高度靈活、可靠，而且速度極快。透過封裝多個廣泛採用的索引函式庫，例如 Faiss、NMSLIB 和 Annoy，Milvus 提供了一套完整的直覺式 API，讓開發人員可以針對自己的情境選擇理想的索引類型。它也提供分散式解決方案和監控服務。Milvus 擁有高度活躍的開放原始碼社群，在<a href="https://github.com/milvus-io/milvus">Github</a> 上有超過 5.5K 顆星星。</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus 勝過競爭對手</h4><p>我們從上述各種向量相似性搜尋解決方案中，編譯了許多不同的測試結果。從下面的比較表中我們可以看到，儘管測試的數據集有 10 億個 128 維向量，但 Milvus 的速度明顯快於競爭對手。</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>引擎</strong></th><th style="text-align:left"><strong>效能 (毫秒)</strong></th><th style="text-align:left"><strong>資料集大小 (百萬)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + 阿里巴巴雲</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">不好</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>向量類似性搜尋解決方案的比較。</em></h6><p>在權衡各解決方案的優缺點之後，趨勢科技選擇 Milvus 作為向量擷取模型。由於 Milvus 在巨量、十億級資料集上的卓越效能，該公司選擇 Milvus 來提供需要即時向量相似性搜尋的行動安全服務的原因也就不言而喻了。</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">設計即時病毒偵測系統</h3><p>趨勢科技在其 MySQL 資料庫中儲存了超過 1000 萬個惡意 APK，每天新增的 APK 達 10 萬個。該系統的工作原理是擷取並計算 APK 檔案中不同元件的 Thash 值，然後運用 Sha256 演算法將其轉換為二進位檔案，並產生 256 位元的 Sha256 值，以區別 APK 與其他 APK。由於 Sha256 值會因 APK 檔案而異，因此一個 APK 可以有一個合併的 Thash 值和一個獨特的 Sha256 值。</p>
<p>Sha256 值只用於區分 APK，而 Thash 值則用於向量相似性檢索。相似的 APK 可能有相同的 Thash 值，但有不同的 Sha256 值。</p>
<p>為了偵測具有惡意程式碼的 APK，趨勢科技開發了自己的系統，用以擷取相似的 Thash 值和對應的 Sha256 值。趨勢科技選擇 Milvus 在由 Thash 值轉換的大量向量資料集上進行瞬間向量相似性搜尋。執行相似性搜尋後，對應的 Sha256 值會在 MySQL 中進行查詢。架構中也加入了 Redis 快取層，將 Thash 值對應到 Sha256 值，大幅縮短查詢時間。</p>
<p>以下是趨勢科技行動安全系統的架構圖。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>選擇適當的距離指標有助於改善向量分類與聚類效能。下表顯示與二進位向量相關的<a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">距離</a>指標和相對應的索引。</p>
<table>
<thead>
<tr><th><strong>距離指標</strong></th><th><strong>索引類型</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard<br/> - Tanimoto<br/> - Hamming</td><td>- flat<br/> - ivf_flat</td></tr>
<tr><td>- 上層結構<br/> - 下層結構</td><td>扁平</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>二進位向量的距離度量和索引。</em></h6><p><br/></p>
<p>趨勢科技將 Thash 值轉換為二進位向量，並儲存在 Milvus 中。在此情況下，趨勢科技使用 Hamming 距離來比較向量。</p>
<p>Milvus 即將支援字串向量 ID，整數 ID 無須以字串格式映射到對應的名稱。這樣就不需要 Redis 快取層，系統架構也不會那麼笨重。</p>
<p>趨勢科技採用雲端解決方案，將許多任務部署在<a href="https://kubernetes.io/">Kubernetes</a> 上。為了達到高可用性，趨勢科技使用以 Python 開發的 Milvus 集群分片中介軟體<a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards</a>。</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>趨勢科技將儲存與距離計算分開，將所有向量儲存於<a href="https://aws.amazon.com/">AWS</a> 提供的<a href="https://aws.amazon.com/efs/">EFS</a>(Elastic File System，彈性檔案系統)。這種做法是業界的流行趨勢。Kubernetes 用來啟動多個讀取節點，並在這些讀取節點上開發 LoadBalancer 服務，以確保高可用性。</p>
<p>為了維持資料一致性，Mishards 只支援一個寫入節點。不過，支援多個寫入節點的分散式版本 Milvus 將於未來幾個月推出。</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">監控與警示功能</h3><p>Milvus 與建構在<a href="https://prometheus.io/">Prometheus</a> 上的監控系統相容，並使用<a href="https://grafana.com/">Grafana</a>(時間序列分析的開放原始碼平台) 來視覺化各種效能指標。</p>
<p>Prometheus 可監控並儲存下列指標：</p>
<ul>
<li>Milvus 性能指標，包括插入速度、查詢速度和 Milvus 正常運行時間。</li>
<li>系統效能指標，包括 CPU/GPU 使用量、網路流量和磁碟存取速度。</li>
<li>硬體儲存指標，包括資料大小和檔案總數。</li>
</ul>
<p>監控和警報系統的工作原理如下：</p>
<ul>
<li>Milvus 客戶端將自訂的度量資料推送至 Pushgateway。</li>
<li>Pushgateway 可確保短期、短暫的度量資料安全地傳送至 Prometheus。</li>
<li>Prometheus 從 Pushgateway 擷取資料。</li>
<li>Alertmanager 為不同的指標設定警示臨界值，並透過電子郵件或訊息提出警示。</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">系統效能</h3><p>自 Milvus 上建立的 ThashSearch 服務首次推出以來，已過了幾個月。下圖顯示端對端查詢延遲小於 95 毫秒。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>插入速度也很快。插入 3 百萬個 192 維向量約需 10 秒。在 Milvus 的協助下，系統效能得以達到趨勢科技所設定的效能標準。</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">別做陌生人</h3><ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上尋找或貢獻 Milvus。</li>
<li>透過<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 與社群互動。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上與我們連線。</li>
</ul>
