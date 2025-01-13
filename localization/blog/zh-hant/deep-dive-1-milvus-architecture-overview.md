---
id: deep-dive-1-milvus-architecture-overview.md
title: 建立向量資料庫以進行可擴充的相似性搜尋
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: 本系列部落格的第一篇文章將深入探討建立最受歡迎的開放原始碼向量資料庫背後的思考過程與設計原則。
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文由栾小凡撰写，倪安琪和余晴转译。</p>
</blockquote>
<p>根據<a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">統計</a>，全球約有 80%-90% 的資料是非結構化的。在網際網路快速成長的推波助瀾下，非結構化資料預計將在未來幾年內激增。因此，企業迫切需要功能強大的資料庫，以幫助他們更好地處理和理解這類資料。然而，開發資料庫總是說易行難。本文旨在分享建立 Milvus 的思考過程和設計原則，Milvus 是一個開放源碼、雲原生向量資料庫，用於可擴充的相似性搜尋。本文也會詳細說明 Milvus 的架構。</p>
<p>跳到</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">非結構化資料需要完整的基本軟體堆疊</a><ul>
<li><a href="#Vectors-and-scalars">向量與標量</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">從向量搜尋引擎到向量資料庫</a></li>
<li><a href="#A-cloud-native-first-approach">雲端原生的第一個方法</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Milvus 2.0 的設計原則</a><ul>
<li><a href="#Log-as-data">日誌即資料</a></li>
<li><a href="#Duality-of-table-and-log">表與日誌的二元性</a></li>
<li><a href="#Log-persistency">日誌持久性</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">為可擴充的相似性搜尋建立向量資料庫</a><ul>
<li><a href="#Standalone-and-cluster">獨立與集群</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus 架構的基本骨架</a></li>
<li><a href="#Data-Model">資料模型</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">非結構化資料需要完整的基本軟體堆疊<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著網際網路的成長與演進，非結構化資料變得越來越普遍，包括電子郵件、論文、物聯網感測器資料、Facebook 照片、蛋白質結構等等。為了讓電腦能夠理解並處理非結構化資料，這些資料會使用<a href="https://zilliz.com/learn/embedding-generation">嵌入技術</a>轉換成向量。</p>
<p>Milvus 會儲存這些向量並建立索引，並透過計算兩個向量的相似度距離，分析它們之間的相關性。如果兩個嵌入向量非常相似，就表示原始資料來源也很相似。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>處理非結構化資料的工作流程</span>。 </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">向量與標量</h3><p>標量是只用一種量度 - 大小來描述的量。標量可以用數字來表示。例如，一輛汽車以每小時 80 公里的速度行駛。在此，速度 (80km/h) 是一個標量。與此同時，向量是至少用兩個量度 - 大小和方向來描述的量。如果汽車以每小時 80 公里的速度朝西行駛，在此速度 (80 km/h west) 是一個向量。下圖是常見的標量與向量的範例。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>標量與向量</span> </span></p>
<p>由於大多數重要的資料都有一個以上的屬性，如果我們將它們轉換成向量，就可以更好地理解這些資料。我們處理向量資料的一個常見方法是使用歐氏距離、內積、Tanimoto 距離、Hamming 距離等<a href="https://milvus.io/docs/v2.0.x/metric.md">指標</a>計算向量之間的距離。距離越近，向量就越相似。為了有效率地查詢大量向量資料集，我們可以透過建立索引來組織向量資料。在資料集建立索引之後，查詢就可以路由到最有可能包含與輸入查詢相似向量的群組或資料子集。</p>
<p>若要進一步瞭解索引，請參閱<a href="https://milvus.io/docs/v2.0.x/index.md">向量索引</a>。</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">從向量搜尋引擎到向量資料庫</h3><p>從一開始，Milvus 2.0 的設計不只是作為一個搜尋引擎，更重要的是，它是一個強大的向量資料庫。</p>
<p>有一個方法可以幫助您了解這其中的差異，那就是拿<a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a>和<a href="https://www.mysql.com/">MySQL</a>，或是<a href="https://lucene.apache.org/">Lucene</a>和<a href="https://www.elastic.co/">Elasticsearch</a> 來做類比。</p>
<p>就像 MySQL 和 Elasticsearch，Milvus 也是建構在<a href="https://github.com/facebookresearch/faiss">Faiss</a>、<a href="https://github.com/nmslib/hnswlib">HNSW</a>、<a href="https://github.com/spotify/annoy">Annoy</a> 等開放原始碼程式庫之上，這些程式庫專注於提供搜尋功能和確保搜尋效能。然而，如果將 Milvus 貶低為只是 Faiss 頂層的一個層次，那是不公平的，因為它可以儲存、擷取、分析向量，而且就像其他資料庫一樣，也提供 CRUD 作業的標準介面。此外，Milvus 還擁有以下功能：</p>
<ul>
<li>分片與分割</li>
<li>複製</li>
<li>災難復原</li>
<li>負載平衡</li>
<li>查詢解析器或最佳化器</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>向量資料庫</span> </span></p>
<p>如需更全面瞭解何謂向量資料庫，請閱讀<a href="https://zilliz.com/learn/what-is-vector-database">此</a>部落格。</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">雲端原生的第一個方法</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>可能原生的方法</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">從共用無到共用儲存，再到共用有</h4><p>傳統資料庫採用「無共享」架構，分散式系統中的節點各自獨立，但透過網路連接。節點之間不共用記憶體或儲存空間。但是，<a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a>引入了 「共享儲存 」架構，將計算（查詢處理）與儲存（資料庫儲存）分開，從而在業界掀起了一場革命。透過共用儲存架構，資料庫可以達到更高的可用性、可擴充性，並減少資料重複。受到 Snowflake 的啟發，許多公司開始利用雲端基礎架構進行資料持久化，同時使用本機儲存進行快取。這類資料庫架構稱為「共用東西」，並已成為目前大多數應用程式的主流架構。</p>
<p>除了「共用東西」的架構外，Milvus 還透過使用 Kubernetes 來管理其執行引擎，並利用微服務將讀取、寫入和其他服務分開，以支援各元件的彈性擴充。</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">資料庫即服務 (DBaaS)</h4><p>資料庫即服務（Database as a service）是一種熱門趨勢，因為許多使用者不僅關心常規的資料庫功能，也嚮往更多樣化的服務。這表示除了傳統的 CRUD 操作之外，我們的資料庫還必須豐富其可提供的服務類型，例如資料庫管理、資料傳輸、計費、可視化等。</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">與更廣泛的開放原始碼生態系統協同合作</h4><p>資料庫發展的另一個趨勢是利用資料庫與其他雲端原生基礎架構之間的協同效應。就 Milvus 而言，它依賴於一些開源系統。例如，Milvus 使用<a href="https://etcd.io/">etcd</a>來儲存元資料。它也採用了訊息佇列 (message queue)，這是微服務架構中使用的一種服務對服務的異步通訊方式，可以幫助輸出增量資料。</p>
<p>未來，我們希望能將 Milvus 建構在<a href="https://spark.apache.org/">Spark</a>或<a href="https://www.tensorflow.org/">Tensorflow</a> 等人工智能基礎架構之上，並將 Milvus 與串流引擎整合，以更好地支援統一的串流與批次處理，滿足 Milvus 使用者的各種需求。</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Milvus 2.0 的設計原則<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>作為我們的下一代雲原生向量資料庫，Milvus 2.0 是圍繞以下三個原則而建立的。</p>
<h3 id="Log-as-data" class="common-anchor-header">日誌即資料</h3><p>資料庫中的日誌會連續記錄所有對資料所做的變更。如下圖所示，從左至右依序為「舊資料」與「新資料」。而日誌是按照時間順序排列的。Milvus 有一個全局定時器機制，分配一個全局唯一和自動遞增的時間戳。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>日誌</span> </span></p>
<p>在 Milvus 2.0 中，日誌經紀人 (log broker) 是系統的主幹：所有資料插入和更新作業都必須經過日誌經紀人，而工作節點則透過訂閱和消耗日誌來執行 CRUD 作業。</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">表與日誌的雙重性</h3><p>表和日誌都是資料，它們只是兩種不同的形式。表是有界的資料，而日誌是無界的。日誌可以轉換成表。就 Milvus 而言，它使用 TimeTick 的處理視窗來聚合日誌。根據日誌順序，多個日誌會彙集成一個稱為日誌快照的小檔案。然後，這些日誌快照會合併為一個區段，可單獨用於負載平衡。</p>
<h3 id="Log-persistency" class="common-anchor-header">日誌持續性</h3><p>日誌持久性是許多資料庫面臨的棘手問題之一。分散式系統中的日誌儲存通常取決於複製演算法。</p>
<p>與<a href="https://aws.amazon.com/rds/aurora/">Aurora</a>、<a href="https://hbase.apache.org/">HBase</a>、<a href="https://www.cockroachlabs.com/">Cockroach DB</a> 和<a href="https://en.pingcap.com/">TiDB</a> 等資料庫不同，Milvus 採取了一種突破性的方法，並引進了一個用於日誌儲存和持久化的發佈-訂閱 (pub/sub) 系統。pub/sub 系統類似於<a href="https://kafka.apache.org/">Kafka</a>或<a href="https://pulsar.apache.org/">Pulsar</a> 中的訊息佇列。系統內的所有節點都可以使用日誌。在 Milvus 中，這種系統稱為日誌經紀人 (log broker)。有了日誌中介，日誌就能與伺服器解耦，確保 Milvus 本身是無狀態的，並能更好地從系統故障中快速恢復。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>日誌中介</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">為可擴充的相似性搜尋建立向量資料庫<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 建立在流行的向量搜尋程式庫之上，包括 Faiss、ANNOY、HNSW 等，專為包含數百萬、數十億甚至數萬億向量的密集向量資料集的相似性搜尋而設計。</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">獨立與群集</h3><p>Milvus 提供兩種部署方式 - 單機或群集。在 Milvus 單機版中，由於所有節點都部署在一起，因此我們可以將 Milvus 視為單一進程。目前，Milvus standalone 依賴 MinIO 和 etcd 來進行資料持久化和元資料儲存。在未來的版本中，我們希望能消除這兩個第三方的依賴，以確保 Milvus 系統的簡潔性。Milvus 叢集包含八個微服務元件和三個第三方相依性：MinIO, etcd 和 Pulsar。Pulsar 擔任日誌中介，並提供日誌 pub/sub 服務。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>單機與群集</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Milvus 架構的基本骨架</h3><p>Milvus 將資料流與控制流分開，並分為四層，在可擴充性及災難復原方面都是獨立的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 架構</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">存取層</h4><p>存取層就像是系統的門面，將用戶端連線的端點暴露給外界。它負責處理客戶端連線、進行靜態驗證、使用者請求的基本動態檢查、轉發請求，以及收集並將結果回傳給客戶端。代理本身是無狀態的，並透過負載平衡元件 (Nginx、Kubernetess Ingress、NodePort 和 LVS) 向外界提供統一的存取位址和服務。Milvus 採用大規模平行處理 (MPP) 架構，代理伺服器會將從工作節點收集到的結果，經過全局聚合與後期處理後傳回。</p>
<h4 id="Coordinator-service" class="common-anchor-header">協調器服務</h4><p>協調器服務是系統的大腦，負責叢集拓樸節點管理、負載平衡、時戳產生、資料宣告和資料管理。有關每個協調器服務功能的詳細說明，請閱讀<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">Milvus 技術文件</a>。</p>
<h4 id="Worker-nodes" class="common-anchor-header">工作節點</h4><p>工作節點（或稱執行節點）充當系統的肢體，執行由協調器服務發出的指令以及由代理啟動的資料處理語言 (DML) 指令。Milvus 中的工作節點類似於<a href="https://hadoop.apache.org/">Hadoop</a> 中的資料節點或 HBase 中的區域伺服器。每種工人節點都對應一個協調服務。如需詳細解釋每個 Worker 節點的功能，請閱讀<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">Milvus 技術文件</a>。</p>
<h4 id="Storage" class="common-anchor-header">儲存空間</h4><p>儲存是 Milvus 的基石，負責資料的持久化。儲存層分為三個部分：</p>
<ul>
<li><strong>元儲存：</strong>負責儲存元資料的快照，例如收集模式、節點狀態、訊息消耗檢查點等。Milvus 依賴 etcd 來執行這些功能，Etcd 也負責服務註冊和健康檢查。</li>
<li><strong>日誌經紀人：</strong>支援播放的 pub/sub 系統，負責串流資料的持久化、可靠的異步查詢執行、事件通知，以及傳回查詢結果。當節點執行停機復原時，日誌中介透過日誌中介回放來確保增量資料的完整性。Milvus 集群使用 Pulsar 作為日誌代理，而獨立模式則使用 RocksDB。Kafka 和 Pravega 等串流儲存服務也可用作日誌中介。</li>
<li><strong>物件儲存：</strong>儲存日誌快照檔案、標量/向量索引檔案，以及中間查詢處理結果。Milvus 支援<a href="https://aws.amazon.com/s3/">AWS S3</a>和<a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob</a>，以及<a href="https://min.io/">MinIO</a>(一種輕量級的開放原始碼物件儲存服務)。由於物件儲存服務的存取延遲及每次查詢計費較高，Milvus 即將支援以記憶體/SSD 為基礎的快取記憶體池及冷熱資料分離，以提升效能並降低成本。</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">資料模型</h3><p>資料模型組織資料庫中的資料。在 Mileryvus 中，所有資料都是以集合、分片、分割、區段和實體來組織。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>資料模型 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">集合</h4><p>在 Milvus 中，集合可以比作關聯式儲存系統中的表。集合是 Milvus 最大的資料單位。</p>
<h4 id="Shard" class="common-anchor-header">分片</h4><p>為了在寫入資料時充分利用集群的平行運算能力，Milvus 中的集合必須將資料寫入作業分散到不同的節點。預設情況下，單一集合包含兩個分片。根據您的資料集數量，您可以在一個集合中擁有更多的分片。Milvus 使用主密鑰雜湊方法進行分片。</p>
<h4 id="Partition" class="common-anchor-header">分區</h4><p>一個分區中也有多個分區。在 Milvus 中，分區是指在資料集中標示相同標籤的一組資料。常見的分區方法包括按日期、性別、使用者年齡等進行分區。建立分區可以使查詢過程受益，因為巨大的資料可以透過分區標籤過濾。</p>
<p>相較之下，分片 (sharding) 更注重寫入資料時的擴充能力，而分區 (partitioning) 則更注重讀取資料時的系統效能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>資料模型 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">分區</h4><p>每個分割區內有多個小區段。在 Milvus 中，段是系統排程的最小單位。分段有兩種類型：成長型和封閉型。成長中的區段由查詢節點訂閱。Milvus 使用者會持續將資料寫入成長中的區段。當成長區段的大小達到上限 (預設為 512 MB)，系統將不允許寫入額外的資料到此成長區段，因此封鎖此區段。索引會建立在封閉區段上。</p>
<p>若要即時存取資料，系統會讀取成長中的區段和封閉區段中的資料。</p>
<h4 id="Entity" class="common-anchor-header">實體</h4><p>每個區段包含大量的實體。在 Milvus 中，實體等同於傳統資料庫中的一行。每個實體都有一個唯一的主索引欄位，也可以自動產生。實體也必須包含時間戳記 (ts)，以及向量欄位 - 這是 Milvus 的核心。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">關於深入研究系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我們安排了這個 Milvus 深度探究系列部落格，提供對 Milvus 架構和原始碼的深入詮釋。本系列部落格涵蓋的主題包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架構概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 與 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">資料處理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">資料管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">即時查詢</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">標量執行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 系統</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量執行引擎</a></li>
</ul>
