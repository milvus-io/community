---
id: the-developers-guide-to-milvus-configuration.md
title: 開發人員的 Milvus 配置指南
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: 使用我們的重點指南簡化您的 Milvus 設定。在您的向量資料庫應用程式中，發現可調整以增強效能的關鍵參數。
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">簡介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>身為使用 Milvus 的開發人員，您很可能遇過令人望而生畏的<code translate="no">milvus.yaml</code> 配置檔，裡面有 500 多個參數。當您只想優化向量資料庫的效能時，處理這種複雜性可能會是一大挑戰。</p>
<p>好消息是：您不需要瞭解每個參數。本指南剔除雜訊，將重點放在實際影響效能的關鍵設定上，並針對您的特定使用個案，明確指出需要調整的數值。</p>
<p>無論您是要建立一個需要快如閃電的查詢的推薦系統，或是要優化一個有成本限制的向量搜尋應用程式，我都會告訴您哪些參數需要以實用、經測試的值來修改。在本指南的最後，您將知道如何根據實際部署情況調整 Milvus 配置以獲得最佳性能。</p>
<h2 id="Configuration-Categories" class="common-anchor-header">配置類別<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入瞭解具體參數之前，讓我們先分解配置檔案的結構。當使用<code translate="no">milvus.yaml</code> 時，您會處理三個參數類別：</p>
<ul>
<li><p><strong>依賴元件組態</strong>：Milvus 連接到的外部服務 (<code translate="no">etcd</code>,<code translate="no">minio</code>,<code translate="no">mq</code>) - 對於群集設定和資料持久化非常重要。</p></li>
<li><p><strong>內部元件組態</strong>：Milvus 的內部架構 (<code translate="no">proxy</code>,<code translate="no">queryNode</code>, 等等) - 性能調整的關鍵</p></li>
<li><p><strong>功能配置</strong>：安全、日誌和資源限制 - 對於生產部署非常重要</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Milvus 依賴元件組態<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們從 Milvus 依賴的外部服務開始。從開發階段轉移到生產階段時，這些配置尤其重要。</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>:元資料儲存</h3><p>Milvus 依賴<code translate="no">etcd</code> 來進行元資料持久化和服務協調。以下參數非常重要：</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>:指定 etcd 集群的地址。預設情況下，Milvus 會啟動一個捆綁的實例，但在企業環境中，最好的做法是連線到受管理的<code translate="no">etcd</code> 服務，以獲得更好的可用性和作業控制。</p></li>
<li><p><code translate="no">etcd.rootPath</code>:定義在 etcd 中儲存 Milvus 相關資料的 key prefix。如果您在同一個 etcd 後端操作多個 Milvus 集群，使用不同的根路徑可以實現乾淨的元資料隔離。</p></li>
<li><p><code translate="no">etcd.auth</code>:控制認證憑證。Milvus 預設不啟用 etcd auth，但如果您管理的 etcd 實例需要認證，您必須在此指定。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>:物件儲存</h3><p>儘管名稱如此，這部分管理所有 S3 相容的物件儲存服務用戶端。它透過<code translate="no">cloudProvider</code> 設定支援 AWS S3、GCS 和阿里雲 OSS 等提供者。</p>
<p>請注意這四個關鍵設定：</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>:使用這些設定來指定物件儲存服務的端點。</p></li>
<li><p><code translate="no">minio.bucketName</code>:指定獨立的儲存桶（或邏輯前綴），以避免在執行多個 Milvus 集群時發生資料碰撞。</p></li>
<li><p><code translate="no">minio.rootPath</code>:啟用儲存桶內的命名間隔，以進行資料隔離。</p></li>
<li><p><code translate="no">minio.cloudProvider</code>:識別 OSS 後端。如需完整的相容性清單，請參閱<a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">Milvus 文件</a>。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>:訊息佇列</h3><p>Milvus 使用訊息佇列進行內部事件傳播 - Pulsar (預設) 或 Kafka。請注意以下三個參數。</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>:設定這些值來使用外部 Pulsar 集群。</p></li>
<li><p><code translate="no">pulsar.tenant</code>:定義租戶名稱。當多個 Milvus 叢集共用一個 Pulsar 實例時，這可確保清潔的通道分隔。</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>:如果你喜歡繞過 Pulsar 的租戶模型，調整通道前綴以防止碰撞。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 也支援 Kafka 作為訊息佇列。若要改用 Kafka，請注釋 Pulsar 特有的設定，並取消注釋 Kafka 配置區塊。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Milvus 內部元件配置<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>:元資料 + 時間戳</h3><p><code translate="no">rootCoord</code> 節點處理元資料變更 (DDL/DCL) 和時間戳管理。</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： 設定每個集合的分區數量上限。雖然硬限制是 1024，但此參數主要是作為一種保障。對於多租戶系統，請避免使用分割區作為隔離邊界，而應執行可擴充至數百萬個邏輯租戶的租戶金鑰策略。</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>：通過啟動備用節點來實現高可用性。這一點非常重要，因為 Milvus 協調器節點在預設情況下不會水平擴展。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>:API 閘道 + 請求路由器</h3><p><code translate="no">proxy</code> 處理面向用戶端的請求、請求驗證和結果聚合。</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>:限制每個集合的欄位（標量 + 向量）數量。保持在 64 個以下，以減少模式複雜性和 I/O 開銷。</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>:控制集合中向量欄位的數量。Milvus 支援多模式搜尋，但實際上，10 個向量欄位是安全的上限。</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:定義攝取分片的數量。作為經驗法則：</p>
<ul>
<li><p>&lt; 200M 記錄 → 1 個分片</p></li>
<li><p>200-400M 記錄 → 2 個分區</p></li>
<li><p>以線性方式擴充</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>:啟用時，會記錄詳細的請求資訊 (使用者、IP、端點、SDK)。有助於審計和除錯。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>:查詢執行</h3><p>處理向量搜尋執行和區段載入。請注意下列參數。</p>
<ul>
<li><code translate="no">queryNode.mmap</code>:切換記憶體映射 I/O，用於載入標量欄位和區段。啟用<code translate="no">mmap</code> 有助於減少記憶體佔用量，但如果磁碟 I/O 成為瓶頸，可能會降低延遲。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>:分段 + 索引管理</h3><p>此參數控制資料分割、索引、壓縮和垃圾回收 (GC)。主要設定參數包括</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>:指定記憶體內資料區段的最大大小。較大的資料段通常表示系統中的資料段總數較少，這可減少索引和搜尋開銷，從而改善查詢效能。例如，一些使用 128GB 記憶體執行<code translate="no">queryNode</code> 實例的使用者表示，將此設定從 1GB 增加到 8GB，查詢效能大約會提升 4 倍。</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>:與上述相似，此參數特別控制<a href="https://milvus.io/docs/disk_index.md#On-disk-Index">磁碟索引</a>(diskann index) 的最大大小。</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>:決定成長中的區段何時被封鎖（即最終完成並編入索引）。當區段達到<code translate="no">maxSize * sealProportion</code> 時，該區段即被封鎖。根據<code translate="no">maxSize = 1024MB</code> 和<code translate="no">sealProportion = 0.12</code> 的預設，一個區段會在大約 123MB 時封存。</p></li>
</ol>
<ul>
<li><p>較低的值（例如 0.12）會較早觸發封閉，這有助於更快建立索引 - 對於更新頻繁的工作負載很有用。</p></li>
<li><p>較高的值（例如 0.3 到 0.5）會延遲封閉，減少索引開銷 - 更適合離線或批次擷取的情況。</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  設定壓縮期間允許的擴充因子。Milvus 計算壓縮期間允許的最大區段大小為<code translate="no">maxSize * expansionRate</code> 。</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>:在壓縮區段或刪除集合之後，Milvus 不會立即刪除底層資料。相反，它會標示要刪除的區段，並等待垃圾回收 (GC) 循環完成。此參數可控制延遲的時間長度。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">其他功能配置<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>:可觀察性與診斷</h3><p>強大的日誌是任何分散式系統的基石，Milvus 也不例外。配置良好的日誌設定不僅有助於在問題發生時進行除錯，還能確保隨著時間的推移對系統健康和行為有更好的可視性。</p>
<p>對於生產部署，我們建議將 Milvus 日誌與集中式日誌和監控工具 (例如<a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a>) 整合，以簡化分析和警示。主要設定包括</p>
<ol>
<li><p><code translate="no">log.level</code>:控制日誌輸出的冗長程度。對於生產環境，請使用<code translate="no">info</code> 等級來擷取重要的執行時詳細資訊，而不會讓系統不堪負荷。在開發或疑難排解期間，您可以切換到<code translate="no">debug</code> ，以獲得更仔細的內部作業資訊。⚠️ 在生產環境中，請謹慎使用<code translate="no">debug</code> 層級 - 它會產生大量日誌，如果不加以檢查，可能會快速佔用磁碟空間，並降低 I/O 效能。</p></li>
<li><p><code translate="no">log.file</code>:預設情況下，Milvus 會將日誌寫入標準輸出 (stdout)，適用於透過 sidecars 或節點代理收集日誌的容器化環境。若要啟用檔案式記錄，您可以設定：</p></li>
</ol>
<ul>
<li><p>輪轉前的最大檔案大小</p></li>
<li><p>檔案保留期間</p></li>
<li><p>要保留的備份記錄檔數量</p></li>
</ul>
<p>這對於沒有 stdout 日誌傳輸的裸機或 on-prem 環境非常有用。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>:驗證與存取控制</h3><p>Milvus 支援<a href="https://milvus.io/docs/authenticate.md?tab=docker">使用者驗證</a>和<a href="https://milvus.io/docs/rbac.md">基於角色的存取控制 (RBAC)</a>，兩者都在<code translate="no">common</code> 模組下設定。這些設定對於保護多租戶環境或任何暴露給外部用戶端的部署是非常重要的。</p>
<p>主要參數包括</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>:此切換開啟或關閉認證和 RBAC。預設為關閉，表示允許所有操作而不需檢查身分。若要強制執行安全存取控制，請將此參數設定為<code translate="no">true</code> 。</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>:啟用驗證時，此設定會定義內建<code translate="no">root</code> 使用者的初始密碼。</p></li>
</ol>
<p>啟用驗證後，請務必立即變更預設密碼，以避免在生產環境中產生安全漏洞。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>:速率限制和寫入控制</h3><p><code translate="no">milvus.yaml</code> 中的<code translate="no">quotaAndLimits</code> 部分在控制資料如何流經系統方面扮演重要角色。它管理插入、刪除、刷新和查詢等作業的速率限制，以確保叢集在繁重工作負載下的穩定性，並防止因寫入擴大或過度壓縮而導致效能下降。</p>
<p>主要參數包括</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>:控制 Milvus 從資料集中刷新資料的頻率。</p>
<ul>
<li><p><strong>預設值</strong>：<code translate="no">0.1</code>表示系統允許每 10 秒刷新一次。</p></li>
<li><p>flush 作業會封閉成長中的區段，並將其從訊息佇列持久化到物件儲存空間。</p></li>
<li><p>刷新太頻繁會產生許多小的封存區段，這會增加壓縮開銷並損害查詢效能。</p></li>
</ul>
<p>💡 最佳做法：在大多數情況下，讓 Milvus 自動處理。成長中的區段一旦達到<code translate="no">maxSize * sealProportion</code> 就會被封鎖，而封鎖的區段會每 10 分鐘刷新一次。只有在知道沒有更多資料時，才建議在大量插入後進行手動刷新。</p>
<p>此外，請記住：<strong>資料的可見性</strong>是由查詢的<em>一致性等級</em>決定，而不是刷新時間 - 因此刷新不會讓新資料立即可供查詢。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code> ：這些參數定義了upsert 和 delete 操作的最大允許速率。</p>
<ul>
<li><p>Milvus 依賴 LSM-Tree 儲存架構，這意味著頻繁的更新和刪除會觸發壓縮。如果不小心管理，這可能會消耗大量資源，並降低整體吞吐量。</p></li>
<li><p>建議將<code translate="no">upsertRate</code> 和<code translate="no">deleteRate</code> 的速度上限設為<strong>0.5 MB/s</strong>，以避免壓縮管道不堪負荷。</p></li>
</ul>
<p>🚀 需要快速更新大型資料集？使用集合別名策略：</p>
<ul>
<li><p>將新資料插入新的資料集中。</p></li>
<li><p>更新完成後，將別名重新指向新的資料集。這可以避免就地更新的壓縮罰則，並允許即時切換。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">實際配置範例<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們走過兩個常見的部署情境，說明如何調整 Milvus 配置設定，以符合不同的作業目標。</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">示例 1：高性能配置</h3><p>當查詢延遲是關鍵任務時 - 想想推薦引擎、語意搜尋平台或即時風險評分 - 每一毫秒都很重要。在這些使用個案中，您通常會倚賴<strong>HNSW</strong>或<strong>DISKANN</strong> 等基於圖表的索引，並同時優化記憶體使用量和區段生命週期行為。</p>
<p>主要調整策略：</p>
<ul>
<li><p>增加<code translate="no">dataCoord.segment.maxSize</code> 和<code translate="no">dataCoord.segment.diskSegmentMaxSize</code> ：根據可用的 RAM，將這些值提高到 4GB 甚至 8GB。較大的區段可減少建立索引的次數，並透過最小化區段扇出 (segment fanout) 來改善查詢吞吐量。不過，較大的區段在查詢時會消耗較多記憶體，因此請確保您的<code translate="no">indexNode</code> 和<code translate="no">queryNode</code> 實體有足夠的空間。</p></li>
<li><p>降低<code translate="no">dataCoord.segment.sealProportion</code> 和<code translate="no">dataCoord.segment.expansionRate</code> ：在封閉之前，將不斷增長的區段大小設定為 200MB 左右。這可保持區段記憶體使用量的可預測性，並減輕 Delegator（負責協調分散式搜尋的 queryNode 領導者）的負擔。</p></li>
</ul>
<p>經驗法則：當記憶體充裕且延遲是優先考量時，請選擇較少、較大的區段。如果索引的新鮮度很重要，則在封存臨界值方面要保守一些。</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰範例 2：成本最佳化配置</h3><p>如果您的優先考量是成本效益而非原始效能 (常見於模型訓練管道、低 QPS 內部工具或長尾圖片搜尋)，您可以取捨召回率或延遲，以大幅降低基礎架構需求。</p>
<p>建議的策略：</p>
<ul>
<li><p><strong>使用索引量化：</strong>索引類型如<code translate="no">SCANN</code> 、<code translate="no">IVF_SQ8</code> 或<code translate="no">HNSW_PQ/PRQ/SQ</code> (Milvus 2.5 中引入)，可大幅減少索引大小和記憶體佔用量。對於精確度不如規模或預算重要的工作負載而言，這些是理想的選擇。</p></li>
<li><p><strong>採用磁碟支援索引策略：</strong>將索引類型設定為<code translate="no">DISKANN</code> ，以啟用純磁碟搜尋。<strong>啟用</strong> <code translate="no">mmap</code> 以選擇性地卸載記憶體。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>若要極度節省記憶體，請啟用<code translate="no">mmap</code> ：<code translate="no">vectorField</code>,<code translate="no">vectorIndex</code>,<code translate="no">scalarField</code>, 和<code translate="no">scalarIndex</code> 。這可將大塊資料卸載至虛擬記憶體，大幅減少常駐 RAM 的使用量。</p>
<p>⚠️ 注意事項：若標量過濾是您查詢工作負載的主要部分，請考慮停用<code translate="no">mmap</code> ，適用於<code translate="no">vectorIndex</code> 和<code translate="no">scalarIndex</code> 。在 I/O 受限的環境中，記憶體映射可能會降低標量查詢效能。</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">磁碟使用提示</h4><ul>
<li><p>使用<code translate="no">mmap</code> 建立的 HNSW 索引最多可擴充總資料大小<strong>1.8 倍</strong>。</p></li>
<li><p>如果考慮到索引開銷和快取，100GB 的實體磁碟實際上可能只能容納 ~50GB 的有效資料。</p></li>
<li><p>使用<code translate="no">mmap</code> 時，請務必預留額外的儲存空間，尤其是當您也在本機快取原始向量時。</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>調整 Milvus 並不是要追求完美的數字，而是要根據工作負載的實際行為來塑造系統。最有影響力的最佳化通常來自於了解 Milvus 如何在壓力下處理 I/O、區段生命週期和索引。這些都是錯誤配置傷害最大的路徑，也是經過深思熟慮的調整能獲得最大回報的路徑。</p>
<p>如果您是 Milvus 的新使用者，我們所涵蓋的配置參數將可滿足您 80-90% 的效能與穩定性需求。從這裡開始。一旦您建立了一些直覺，請深入瞭解完整的<code translate="no">milvus.yaml</code> 規格和官方文件，您會發現細節控制可以讓您的部署從功能性提升到卓越性。</p>
<p>有了正確的配置，您就可以建立可擴充的高效能向量搜尋系統，以符合您的作業優先順序 - 無論是低延遲服務、具成本效益的儲存或高測試分析工作負載。</p>
