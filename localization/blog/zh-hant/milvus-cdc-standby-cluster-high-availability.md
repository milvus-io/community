---
id: milvus-cdc-standby-cluster-high-availability.md
title: Vector 資料庫高可用性：如何使用 CDC 建立 Milvus 備援叢集
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: 學習如何使用 Milvus CDC 建立高可用性向量資料庫。逐步指導主要-備援複製、故障移轉和生產 DR。
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>每個生產型資料庫都需要一套計劃，以應付發生問題時的情況。關聯式資料庫擁有 WAL 出貨、binlog 複製和自動故障移轉功能已有數十年歷史。但是<a href="https://zilliz.com/learn/what-is-a-vector-database">向量資料庫，儘</a>管已經成為 AI 應用程式的核心基礎架構，在這方面仍處於起步階段。大部分資料庫最多只能提供節點級的備援。如果整個集群癱瘓，您就得從備份還原，並從頭重建<a href="https://zilliz.com/learn/vector-index">向量索引</a>- 這個過程可能需要數小時，而且要花費數千計的運算費用，因為透過您的 ML 管道重新生成<a href="https://zilliz.com/glossary/vector-embeddings">嵌入式資料</a>並不便宜。</p>
<p><a href="https://milvus.io/">Milvus</a>採取了不同的方法。它提供分層的高可用性：節點層級複製用於群集內的快速故障移轉、基於 CDC 的複製用於群集層級和跨區域保護，以及備份用於安全網恢復。這種分層模型是傳統資料庫的標準做法 - Milvus 是第一個將其應用於向量工作負載的主要向量資料庫。</p>
<p>本指南涵蓋兩方面內容：向量資料庫可用的高可用性策略（因此您可以評估「可生產」的實際意義），以及從零開始設定 Milvus CDC 主備複製的實務教學。</p>
<blockquote>
<p>這是系列文章的<strong>第一部分</strong>：</p>
<ul>
<li><strong>第 1 部分</strong>（本文）：在新集群上設定主備複製</li>
<li><strong>第 2 部分</strong>：使用<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a>將 CDC 加入已有資料的現有群集</li>
<li><strong>第 3 部分</strong>：管理故障移轉 - 當主機宕機時升級備機</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">為什麼向量資料庫的高可用性更重要？<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>當傳統 SQL 資料庫發生故障時，您會失去結構化記錄的存取權 - 但資料本身通常可以從上游來源重新匯入。當向量資料庫發生故障時，復原基本上會更困難。</p>
<p>向量資料庫儲存的是<a href="https://zilliz.com/glossary/vector-embeddings">內嵌</a>- 由 ML 模型產生的密集數值表示。重建矢量資料庫意味著透過嵌入管道重新執行整個資料集：載入原始文件、分割文件、呼叫<a href="https://zilliz.com/ai-models">嵌入模型</a>，以及重新編排所有索引。對於數以億計向量的資料集而言，這可能需要好幾天的時間，並花費數千美元的 GPU 計算費用。</p>
<p>與此同時，依賴<a href="https://zilliz.com/learn/what-is-vector-search">向量搜尋的</a>系統往往處於關鍵時刻：</p>
<ul>
<li>為面向客戶的聊天機器人和搜尋提供動力<strong><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">的 RAG</a>管道</strong>- 如果向量資料庫發生故障，擷取就會停止，人工智能就會傳回一般或幻覺的答案。</li>
<li>即時提供產品或內容建議<strong>的推薦引擎</strong>- 停機意味著錯失收入。</li>
<li>依賴<a href="https://zilliz.com/glossary/similarity-search">相似性搜尋來</a>標示可疑活動的<strong>詐欺偵測與異常監視</strong>系統 - 覆蓋範圍的缺口會造成漏洞。</li>
<li>使用向量儲存記憶體和工具檢索的<strong>自主代理系統</strong>- 代理在沒有知識庫的情況下會失敗或循環。</li>
</ul>
<p>如果您正在評估向量資料庫的任何這些使用個案，高可用性就不是稍後才檢查的好功能。它應該是您最先考慮的項目之一。</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">向量資料庫的生產級 HA 是什麼樣子？<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>不是所有的高可用性都是一樣的。只在單一叢集中處理節點故障的向量資料庫，並不是生產系統所要求的「高可用性」。真正的 HA 需要涵蓋三個層級：</p>
<table>
<thead>
<tr><th>層級</th><th>保護的對象</th><th>如何運作</th><th>復原時間</th><th>資料遺失</th></tr>
</thead>
<tbody>
<tr><td><strong>節點層級</strong>(多重複製)</td><td>單一節點當機、硬體故障、OOM kill、AZ 故障</td><td>在多個節點間複製相同的<a href="https://milvus.io/docs/glossary.md">資料片段</a>；其他節點吸收負載</td><td>瞬間</td><td>零</td></tr>
<tr><td><strong>群集層級</strong>(CDC 複製)</td><td>整個群集宕機 - K8s 錯誤推出、名稱空間刪除、儲存損壞</td><td>透過<a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log</a> 將每次寫入串流至備用叢集群；備用叢集總是落後數秒</td><td>分鐘</td><td>秒</td></tr>
<tr><td><strong>安全網</strong>(定期備份)</td><td>透過複製傳播的災難性資料損壞、勒索軟體、人為錯誤</td><td>定期拍攝快照並儲存於獨立位置</td><td>小時</td><td>小時（自上次備份起）</td></tr>
</tbody>
</table>
<p>這些層級是互補的，而不是替代的。生產部署應將它們堆疊在一起：</p>
<ol>
<li><strong>首先</strong>是<strong><a href="https://milvus.io/docs/replica.md">多重複製</a></strong>- 處理最常見的故障 (節點崩潰、AZ 故障)，零停機時間和零資料遺失。</li>
<li><strong>接下來</strong>是<strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a></strong>- 防止多重複製無法避免的故障：群集整體中斷、災難性人為錯誤。備用群集位於不同的故障域。</li>
<li><strong>永遠<a href="https://milvus.io/docs/milvus_backup_overview.md">定期備份</a></strong>- 您最後的安全網。如果損毀的資料在您發現之前複製到備用系統，即使是 CDC 也救不了您。</li>
</ol>
<p>評估向量資料庫時，請問：產品實際支援這三層中的哪一層？目前大多數的向量資料庫只提供第一層。Milvus 支援所有三層，CDC 是內建功能，而非第三方附加元件。</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Milvus CDC 是什麼？<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC（變更資料擷取）</strong>是一項內建的複製功能，可讀取主叢集的<a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log (WAL)</a>，並將每個項目串流至獨立的備用叢集。備用群集複製條目，最後會得到相同的資料，但通常會慢上幾秒鐘。</p>
<p>這種模式在資料庫領域中已廣為人知。MySQL 有 binlog 複製。PostgreSQL 有 WAL 出貨。MongoDB 有基於 oplog 的複製。這些都是行之有效的技術，讓關係型資料庫和文件資料庫在生產中運行了數十年。Milvus 將相同的方法帶入向量工作負載 - 它是第一個提供基於 WAL 複製作為內建功能的主要<a href="https://zilliz.com/learn/what-is-a-vector-database">向量資料庫</a>。</p>
<p>CDC 的三個特性非常適合災難復原：</p>
<ul>
<li><strong>低延遲同步。</strong>CDC 在操作發生時即進行串流，而非排程批次。在正常情況下，備用伺服器會比主伺服器慢數秒。</li>
<li><strong>有序重播。</strong>作業會以寫入的相同順序傳送到備用系統。資料無需調節即可保持一致。</li>
<li><strong>檢查點恢復。</strong>如果 CDC 程序當機或網路斷線，它會從之前的位置恢復。不會跳過或重複資料。</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">CDC 架構如何運作？</h3><p>CDC 部署包含三個元件：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>CDC 架構顯示具有 Streaming 節點和 CDC 節點的來源群集，CDC 節點消耗 WAL，將資料複製到目標群集的代理層，代理層將 DDL/DCL/DML 作業轉發到 Streaming 節點，並附加到 WAL。</span> </span></p>
<table>
<thead>
<tr><th>元件</th><th>角色</th></tr>
</thead>
<tbody>
<tr><td><strong>主叢集</strong></td><td>生產的<a href="https://milvus.io/docs/architecture_overview.md">Milvus 實例</a>。所有讀取和寫入都在此進行。每次寫入都會記錄在 WAL 中。</td></tr>
<tr><td><strong>CDC 節點</strong></td><td>主用集群旁的背景進程。讀取 WAL 項目並將其轉發至備用。獨立於讀/寫路徑執行 - 不影響查詢或插入效能。</td></tr>
<tr><td><strong>備用群集</strong></td><td>一個獨立的 Milvus 實例，重播轉發的 WAL 項目。持有與主機相同的資料，但較主機慢幾秒。可提供讀取查詢，但不接受寫入。</td></tr>
</tbody>
</table>
<p>流程：寫入到主機 → CDC 節點複製到備用 → 備用複製。沒有其他東西會與備用的寫入路徑對話。如果主機宕機，備用機幾乎已經擁有所有資料，並且可以升級。</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">教學：設定 Milvus CDC 備用叢集<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>本文的其餘部分為實作演練。到最後，您將可以運行兩個 Milvus 集群，並在它們之間進行實時複製。</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><p>開始之前：</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a>v2.6.6 或更新版本。</strong>CDC 需要此版本。建議使用最新的 2.6.x 修補程式。</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a>v1.3.4 或更新版本。</strong>本指南使用 Operator 在 Kubernetes 上進行叢集管理。</li>
<li>已設定<code translate="no">kubectl</code> 與<code translate="no">helm</code> 的<strong>執行中 Kubernetes 叢集</strong>。</li>
<li><strong>使用<a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong>進行複製配置步驟的<strong>Python</strong>。</li>
</ul>
<p>目前版本的兩個限制：</p>
<table>
<thead>
<tr><th>限制</th><th>詳細資訊</th></tr>
</thead>
<tbody>
<tr><td>單一 CDC 複製本</td><td>每個群集只有一個 CDC 複製本。分散式 CDC 計劃在未來版本中推出。</td></tr>
<tr><td>無 BulkInsert</td><td>啟用 CDC 時不支援<a href="https://milvus.io/docs/import-data.md">BulkInsert</a>。也計劃在未來版本推出。</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">步驟 1：升級 Milvus Operator</h3><p>將 Milvus Operator 升級至 v1.3.4 或更新版本：</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>確認操作員 pod 正在執行：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">步驟 2：部署主叢集</h3><p>為主要 (原始碼) 群集建立 YAML 檔案。<code translate="no">cdc</code> 下的<code translate="no">components</code> 部分告訴 Operator 在群集旁部署 CDC 節點：</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">msgStreamType: woodpecker</code> 設定使用 Milvus 內建的<a href="https://milvus.io/docs/four_layers.md">Woodpecker WAL</a>，而非 Kafka 或 Pulsar 等外部訊息佇列。Woodpecker 是 Milvus 2.6 中引入的雲原生寫入日誌，不需要外部訊息基礎架構。</p>
<p>套用組態：</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>等待所有 Pod 達到 Running 狀態。確認 CDC Pod 已啟動：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">步驟 3：部署備用群集</h3><p>備用 (目標) 群集使用相同的 Milvus 版本，但不包含 CDC 元件 - 它只接收複製的資料：</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>套用：</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>確認所有 pod 正在執行：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">步驟 4：配置複製關係</h3><p>兩個群集都執行後，使用 Python 與<a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a> 設定複製拓樸。</p>
<p>定義叢集連線詳細資訊和實體通道 (pchannel) 名稱：</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>建立複製組態：</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>套用至兩個群集：</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>一旦成功，主機上的增量變更就會開始自動複製到備機上。</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">步驟 5：驗證複製成功</h3><ol>
<li>連接到主機並<a href="https://milvus.io/docs/manage-collections.md">建立一個集合</a>，<a href="https://milvus.io/docs/insert-update-delete.md">插入一些向量</a>，<a href="https://milvus.io/docs/load-and-release.md">並載入它</a></li>
<li>在主機上執行搜尋以確認資料是否存在</li>
<li>連接到備用系統並執行相同的搜尋</li>
<li>如果備用系統傳回相同的結果，表示複製正在進行中</li>
</ol>
<p>如果您需要參考，<a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>涵蓋集合建立、插入和搜尋。</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">在生產中執行 CDC<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>設定 CDC 是最直接的部分。要使其長期保持可靠，需要注意幾個操作領域。</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">監控複製滯後</h3><p>備用總是稍稍落後於主用 - 這是異步複製的固有特性。在正常負載下，滯後時間只有幾秒鐘。但寫入尖峰、網路擁塞或備用資源壓力都可能導致滯後時間增加。</p>
<p>將滯後作為指標進行追蹤，並發出警示。不恢復的滯後時間增長通常表示 CDC 節點無法跟上寫入吞吐量。首先檢查群集間的網路頻寬，然後考慮備用是否需要更多的資源。</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">使用備用節點進行讀取擴充</h3><p>備用伺服器並非只是閒置的冷備份，直到災難發生為止。它可以在複製活動時接受<a href="https://milvus.io/docs/single-vector-search.md">搜尋和查詢要求</a>- 只有寫入會被攔截。這開啟了實際用途：</p>
<ul>
<li>將批次<a href="https://zilliz.com/glossary/similarity-search">相似性搜尋或</a>分析工作負載路由至備用伺服器</li>
<li>在高峰時段分割讀取流量，以減少對主機的壓力</li>
<li>在不影響生產寫入延遲的情況下執行昂貴的查詢 (大型 top-K、跨大型集合的篩選搜尋)</li>
</ul>
<p>這將您的 DR 基礎結構轉變為效能資產。即使沒有任何損壞，備用伺服器也能賺取報酬。</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">正確設定備用容量大小</h3><p>備用伺服器會重複主伺服器的每次寫入，因此需要類似的運算和記憶體資源。如果您還要將讀取路由至備用，則需考慮到額外的負載。儲存需求是相同的 - 它持有相同的資料。</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">在需要前測試故障移轉</h3><p>不要等到真正停機時才發現您的故障移轉程序無法運作。執行定期演練：</p>
<ol>
<li>停止寫入主機</li>
<li>等待備用程式趕上 (滯後時間 → 0)</li>
<li>升級備用</li>
<li>驗證查詢是否傳回預期結果</li>
<li>反向處理</li>
</ol>
<p>測量每個步驟所需的時間並記錄。目標是讓故障移轉成為有已知時間的例行程序 - 而不是在凌晨三點的緊張即興演出。本系列的第 3 部分將詳細介紹故障移轉流程。</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">不想自己管理 CDC？Zilliz Cloud 可以處理<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>設置和操作 Milvus 的 CDC 複製功能強大，但也會產生作業開銷：您需要管理兩個集群、監控複製健康狀況、處理故障移轉執行簿，以及維護跨區域的基礎架構。<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(管理的 Milvus) 可為需要生產級 HA 的團隊提供開箱即用的服務。</p>
<p><strong>Global Cluster</strong>是 Zilliz Cloud 的主要功能。它可讓您以單一邏輯集群的方式，執行跨越多個區域 (北美、歐洲、亞太地區等) 的 Milvus 部署。在引擎蓋下，它使用與本文所述相同的 CDC/WAL 複製技術，但完全受管理：</p>
<table>
<thead>
<tr><th>能力</th><th>自我管理的 CDC (本文)</th><th>Zilliz Cloud 全球叢集</th></tr>
</thead>
<tbody>
<tr><td><strong>複製</strong></td><td>由您設定與監控</td><td>自動化、非同步 CDC 管道</td></tr>
<tr><td><strong>故障移轉</strong></td><td>手動運行簿</td><td>自動化 - 不需變更程式碼、不需更新連線字串</td></tr>
<tr><td><strong>自我修復</strong></td><td>您重新佈建故障的群集</td><td>自動：偵測陳舊狀態、重設並重建為全新的次要集群</td></tr>
<tr><td><strong>跨區域</strong></td><td>您可以部署和管理兩個群集</td><td>內建多區域與本機讀取存取功能</td></tr>
<tr><td><strong>RPO</strong></td><td>秒（取決於您的監控）</td><td>秒 (非計畫) / 零 (計畫中的切換)</td></tr>
<tr><td><strong>RTO</strong></td><td>分鐘（取決於您的運行簿）</td><td>分鐘 (自動化)</td></tr>
</tbody>
</table>
<p>除了 Global Cluster 之外，Business Critical 方案還包括其他 DR 功能：</p>
<ul>
<li><strong>Point-in-Time Recovery (PITR)</strong>- 將資料集回溯至保留視窗內的任何時刻，適用於從意外刪除或複製至備用的資料損壞中恢復。</li>
<li><strong>跨區域備份</strong>- 自動持續備份複製到目的地區域。還原至新的群集只需數分鐘。</li>
<li><strong>99.99% 的正常運作時間 SLA</strong>- 由多重複製的 multiAZ 部署提供支援。</li>
</ul>
<p>如果您在生產中執行向量搜尋，且需要 DR，則值得將 Zilliz Cloud 與自我管理的 Milvus 方法一併評估。如需詳細資訊，請<a href="https://zilliz.com/contact-sales">聯絡 Zilliz 團隊</a>。</p>
<h2 id="Whats-Next" class="common-anchor-header">下一步<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>本文涵蓋向量資料庫的 HA 環境，並介紹如何從頭開始建立主備資料庫對。接下來：</p>
<ul>
<li><strong>第二部分</strong>：在已有資料的 Milvus 集群中加入 CDC，在啟用複製之前使用<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a>為備用提供種子。</li>
<li><strong>第 3 部分</strong>：管理故障移轉 - 升級備用、重定向流量以及復原原始主機</li>
</ul>
<p>請繼續關注。</p>
<hr>
<p>如果您正在生產中運行<a href="https://milvus.io/">Milvus</a>，並在考慮災難恢復，我們很樂意提供幫助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>，提出問題、分享您的 HA 架構，並向其他運行 Milvus 的團隊學習。</li>
<li><a href="https://milvus.io/office-hours">預約 20 分鐘的 Milvus Office Hours 免費課程</a>，了解您的災難復原設定 - 無論是 CDC 設定、故障移轉規劃或多區域部署。</li>
<li>如果您想跳過基礎架構設定，直接進入生產就緒的 HA，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(管理的 Milvus) 可透過其 Global Cluster 功能提供跨區域高可用性 - 無須手動設定 CDC。</li>
</ul>
<hr>
<p>當團隊開始設定向量資料庫高可用時，會出現幾個問題：</p>
<p><strong>問：CDC 會減慢主叢集嗎？</strong></p>
<p>不會。CDC 節點以獨立於讀/寫路徑的非同步方式讀取 WAL 日誌。它不會與查詢或插入爭用主資料庫上的資源。啟用 CDC 後，您不會看到效能上的差異。</p>
<p><strong>問：CDC 可以複製啟用前已存在的資料嗎？</strong></p>
<p>不能 - CDC 只會捕捉啟用之後的變更。若要將現有資料帶入備用，請先使用<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a>為備用提供種子，然後啟用 CDC 進行持續複製。本系列的第二部分將介紹此工作流程。</p>
<p><strong>問：如果我已啟用多重複製，還需要 CDC 嗎？</strong></p>
<p>答：CDC 和 multi-replica（多重複製）是兩種不同的複製模式，它們可防止不同的故障模式。<a href="https://milvus.io/docs/replica.md">多重複製會</a>在一個群集內的<a href="https://milvus.io/docs/glossary.md">節點間</a>保留相同<a href="https://milvus.io/docs/glossary.md">區段</a>的複本 - 對於節點故障非常有用，但當整個群集消失（部署不當、AZ 中斷、命名空間刪除）時就沒有用了。CDC 在不同的故障域中保留獨立的群集，並提供近乎即時的資料。對於開發環境以外的任何情況，您都需要兩者兼具。</p>
<p><strong>問：Milvus CDC 與其他向量資料庫的複製相比如何？</strong></p>
<p>目前大多數向量資料庫提供節點級備援（相當於多重複製），但缺乏群集級複製。Milvus 是目前唯一內建基於 WAL 的 CDC 複製的主要向量資料庫 - 與 PostgreSQL 和 MySQL 等關聯式資料庫使用了數十年的成熟模式相同。如果需要跨叢集或跨區域故障移轉，這是一個值得評估的差異化因素。</p>
