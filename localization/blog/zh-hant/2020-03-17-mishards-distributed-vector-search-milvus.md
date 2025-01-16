---
id: mishards-distributed-vector-search-milvus.md
title: 分散式架構概觀
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: 如何縮小規模
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Milvus 的分散式向量搜尋</custom-h1><p>Milvus 的目標是為大規模向量實現高效率的相似性搜尋與分析。一個獨立的 Milvus 實例可以輕鬆處理十億級向量的向量搜尋。然而，對於 100 億、1000 億甚至更大的資料集，則需要 Milvus 集群。集群可作為上層應用程式的獨立實例，並能滿足海量規模資料的低延遲、高並發的業務需求。Milvus 集群可以重發請求、分開讀寫、水平擴展和動態擴充，因此可以提供無限制擴展的 Milvus 實例。Mishards 是 Milvus 的分散式解決方案。</p>
<p>本文將簡單介紹 Mishards 架構的元件。更詳細的資訊將在接下來的文章中介紹。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">分散式架構概觀<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-distributed-architecture-overview.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">服務追蹤<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-service-tracing-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">主要服務元件<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>服務發現框架，例如 ZooKeeper、etcd 和 Consul。</li>
<li>負載平衡器，例如 Nginx、HAProxy、Ingress Controller。</li>
<li>Mishards 節點：無狀態、可擴充。</li>
<li>只寫入的 Milvus 節點：單一節點，不可擴充。您需要為此節點使用高可用性解決方案，以避免單點故障。</li>
<li>唯讀的 Milvus 節點：有狀態節點且可擴充。</li>
<li>共用儲存服務：所有 Milvus 節點都使用共用儲存服務來共用資料，例如 NAS 或 NFS。</li>
<li>元資料服務：所有 Milvus 節點都使用此服務來共用元資料。目前僅支援 MySQL。此服務需要 MySQL 高可用性解決方案。</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">可擴充的元件<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>Mishards</li>
<li>只讀的 Milvus 節點</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">元件介紹<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Mishards 節點</strong></p>
<p>Mishards 負責分解上游請求，並將子請求路由到子服務。將結果總結後再返回上游。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-mishards-nodes.jpg</span> </span></p>
<p>如上圖所示，Mishards 在接受 TopK 搜尋請求後，會先將該請求拆解成子請求，並將子請求傳送給下游服務。當收集到所有的子回應後，再將這些子回應合併並傳回給上游。</p>
<p>由於 Mishards 是無狀態服務，因此不會儲存資料或參與複雜的計算。因此，節點對配置要求不高，計算能力主要用於合併子結果。因此，可以增加 Mishards 節點的數量，以達到高並發的目的。</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Milvus 節點<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 節點負責 CRUD 相關的核心作業，所以對配置的要求相對較高。首先，記憶體大小要夠大，以避免太多磁碟 IO 作業。其次，CPU 配置也會影響效能。隨著集群大小的增加，需要更多的 Milvus 節點來提高系統吞吐量。</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">唯讀節點與可寫節點</h3><ul>
<li>Milvus 的核心作業是向量插入和搜尋。搜尋對 CPU 和 GPU 配置的要求極高，而插入或其他作業的要求則相對較低。將執行搜尋的節點與執行其他作業的節點分離，可帶來更經濟的部署。</li>
<li>就服務品質而言，當一個節點執行搜尋作業時，相關硬體是在滿載狀態下執行，無法確保其他作業的服務品質。因此，使用了兩種節點類型。搜尋要求由唯讀節點處理，其他要求則由可寫節點處理。</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">只允許一個可寫節點</h3><ul>
<li><p>目前，Milvus 不支援多個可寫入實體分享資料。</p></li>
<li><p>在部署過程中，需要考慮可寫節點的單點故障。需要為可寫節點準備高可用性解決方案。</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">唯讀節點擴充能力</h3><p>當資料大小極大或延遲要求極高時，您可以將只讀節點視為有狀態節點進行水平擴充。假設有 4 台主機，且每台主機的配置如下：CPU 核心：16、GPU：1、記憶體：64 GB。下圖顯示了橫向擴充有狀態節點時的群集。運算能力和記憶體都是線性擴充。資料分為 8 個分片，每個節點處理來自 2 個分片的請求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>當某些分片的請求數量很大時，可以為這些分片部署無狀態唯讀節點，以提高吞吐量。以上面的主機為例。當主機合併為無伺服器集群時，運算能力會呈線性增加。由於要處理的資料不會增加，因此相同資料分片的處理能力也會呈線性增加。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-read-only-node-scalability-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">元資料服務</h3><p>關鍵字MySQL</p>
<p>關於 Milvus 元資料的更多資訊，請參考 如何檢視元資料。在分散式系統中，Milvus 可寫節點是元資料的唯一生產者。Mishards 節點、Milvus 可寫節點和 Milvus 只讀節點都是元資料的消費者。目前，Milvus 只支援 MySQL 和 SQLite 作為 metadata 的儲存後端。在分散式系統中，服務只能部署為高可用的 MySQL。</p>
<h3 id="Service-discovery" class="common-anchor-header">服務發現</h3><p>關鍵字：Apache Zookeeper、etcd、Consul、Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-service-discovery.png</span> </span></p>
<p>服務發現提供所有 Milvus 節點的資訊。Milvus 節點會在上線時登錄資訊，並在離線時登出。Milvus 節點也可以透過定期檢查服務的健康狀態來偵測異常的節點。</p>
<p>服務發現包含許多框架，包括 etcd、Consul、ZooKeeper 等。Mishards 定義了服務發現介面，並提供藉由外掛擴充的可能性。目前，Mishards 提供兩種外掛，分別對應 Kubernetes 集群和靜態配置。您可以依照這些外掛的實作，自訂您自己的服務發現。這些介面是臨時的，需要重新設計。更多有關寫自己的外掛的資訊將在接下來的文章中闡述。</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">負載平衡與服務分片</h3><p>關鍵字：Nginx、HAProxy、Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-load-balancing-and-service-sharding.png</span> </span></p>
<p>服務發現和負載平衡是一起使用的。負載平衡可以設定為輪詢、散列或一致散列。</p>
<p>負載平衡器負責將使用者請求重新傳送至 Mishards 節點。</p>
<p>每個 Mishards 節點透過服務發現中心取得所有下游 Milvus 節點的資訊。所有相關的 metadata 都可以透過 metadata 服務取得。Mishards 透過消耗這些資源來實現分片。Mishards 定義了與路由策略相關的介面，並透過外掛提供擴充。目前，Mishards 提供了基於最低區段層級的一致散列策略。如圖所示，共有 10 個區段，從 s1 到 s10。根據基於區段的一致散列策略，Mishards 將關於 s1、24、s6 和 s9 的請求路由到 Milvus 1 節點，將關於 s2、s3 和 s5 的請求路由到 Milvus 2 節點，將關於 s7、s8 和 s10 的請求路由到 Milvus 3 節點。</p>
<p>根據您的業務需求，您可以依據預設的一致散列路由外掛程式自訂路由。</p>
<h3 id="Tracing" class="common-anchor-header">追蹤</h3><p>關鍵字：OpenTracing, Jaeger, Zipkin</p>
<p>鑑於分散式系統的複雜性，請求會傳送到多個內部服務調用。為了幫助找出問題，我們需要追蹤內部服務的呼叫鏈。隨著複雜度的增加，可用追蹤系統的好處也就不言而喻了。我們選擇 CNCF OpenTracing 標準。OpenTracing 提供了平台獨立、廠商獨立的 API，讓開發人員可以方便地實作追蹤系統。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>前面的圖表是在搜尋調用時進行追蹤的範例。搜尋連續呼叫<code translate="no">get_routing</code> 、<code translate="no">do_search</code> 和<code translate="no">do_merge</code> 。<code translate="no">do_search</code> 也呼叫<code translate="no">search_127.0.0.1</code> 。</p>
<p>整個追蹤記錄形成以下樹狀：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>下圖顯示每個節點的 request/response 資訊和標記的範例：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>OpenTracing 已整合至 Milvus。更多資訊將在接下來的文章中涵蓋。</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">監控與警示</h3><p>關鍵字：Prometheus、Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-monitor-alert-milvus.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">摘要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>作為服務中介軟體，Mishards 整合了服務發現、路由請求、結果合併與追蹤。此外，還提供基於外掛的擴充功能。目前，基於 Mishards 的分散式解決方案仍有以下缺點：</p>
<ul>
<li>Mishards 使用代理作為中間層，有延遲成本。</li>
<li>Milvus 可寫節點是單點服務。</li>
<li>依賴高可用性的 MySQL 服務。 -當有多個分片且單一分片有多個複本時，部署會變得複雜。</li>
<li>缺乏快取層，例如存取元資料。</li>
</ul>
<p>我們會在即將推出的版本中修正這些已知問題，讓 Mishards 可以更方便地應用在生產環境中。</p>
