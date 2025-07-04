---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: 在 Kubernetes 上部署 Milvus：Kubernetes 使用者分步指南
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: 本指南將提供使用 Milvus Operator 在 Kubernetes 上設定 Milvus 的清晰、循序漸進的說明。
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a>是一個開放原始碼<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>，其設計目的是透過向量表示來儲存、索引和搜尋大量<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料</a>，因此非常適合 AI 驅動的應用程式，例如相似性<a href="https://zilliz.com/glossary/semantic-search">搜尋</a>、<a href="https://zilliz.com/glossary/semantic-search">語意搜</a>尋、檢索增強生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>)、推薦引擎和其他機器學習任務。</p>
<p>但 Milvus 更為強大的是它與 Kubernetes 的無縫整合。如果您是 Kubernetes 的愛好者，就會知道這個平台非常適合編排可擴充的分散式系統。Milvus 充分利用 Kubernetes 的功能，讓您輕鬆部署、擴充及管理分散式 Milvus 叢集。本指南將使用 Milvus Operator，提供在 Kubernetes 上設定 Milvus 的清晰、循序漸進的說明。</p>
<h2 id="Prerequisites" class="common-anchor-header">先決條件<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>在我們開始之前，請確保您已具備下列先決條件：</p>
<ul>
<li><p>Kubernetes 集群已啟動並運作。如果您在本機進行測試，<code translate="no">minikube</code> 是很好的選擇。</p></li>
<li><p><code translate="no">kubectl</code> 安裝並設定與 Kubernetes 叢集互動。</p></li>
<li><p>熟悉基本的 Kubernetes 概念，例如 Pod、服務和部署。</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">步驟 1：安裝 Minikube (用於本機測試)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您需要建立一個本機 Kubernetes 環境，<code translate="no">minikube</code> 是最適合您的工具。正式的安裝說明在<a href="https://minikube.sigs.k8s.io/docs/start/">minikube 入門頁面</a>。</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1.安裝 Minikube</h3><p>造訪<a href="https://github.com/kubernetes/minikube/releases"> minikube 發佈頁面</a>，下載適合您作業系統的版本。對於 macOS/Linux，您可以使用下列指令：</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2.啟動 Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3.與叢集互動</h3><p>現在，您可以使用 minikube 內的 kubectl 與群集互動。如果您尚未安裝 kubectl，minikube 預設會下載適當的版本。</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>或者，您可以為 minikube 的二進位檔案建立一個符號連結，命名為<code translate="no">kubectl</code> ，以方便使用。</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">步驟 2：配置 StorageClass<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Kubernetes 中，<strong>StorageClass</strong>定義工作負載可用的儲存類型，提供管理不同儲存配置的彈性。在繼續之前，您必須確保群集中有預設的 StorageClass。以下是如何檢查並在必要時設定一個。</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1.檢查安裝的儲存類別</h3><p>要查看 Kubernetes 群集中可用的 StorageClasses，請執行下列指令：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>這將會顯示群集中安裝的儲存類別清單。如果已設定預設 StorageClass，則會以<code translate="no">(default)</code> 標示。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2.配置預設 StorageClass（如有必要）</h3><p>如果沒有設定預設 StorageClass，您可以透過在 YAML 檔案中定義 StorageClass 來建立預設 StorageClass。使用以下範例建立預設 StorageClass：</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>此 YAML 配置定義了一個名為<code translate="no">default-storageclass</code> 的<code translate="no">StorageClass</code> ，它使用<code translate="no">minikube-hostpath</code> 供應器，常用於本機開發環境。</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3.套用 StorageClass</h3><p><code translate="no">default-storageclass.yaml</code> 檔案建立後，請使用下列指令將其套用至叢集：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>這將為您的群集設定預設的 StorageClass，以確保您的儲存需求在未來能被妥善管理。</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">步驟 3：使用 Milvus Operator 安裝 Milvus<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator 簡化在 Kubernetes 上部署 Milvus、管理部署、縮放和更新。在安裝 Milvus Operator 之前，您需要安裝<strong>cert-manager</strong>，它為 Milvus Operator 使用的 webhook 伺服器提供憑證。</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1.安裝 cert-manager</h3><p>Milvus Operator 需要<a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a>來管理安全通訊的憑證。確保您安裝了<strong>1.1.3</strong>或更新<strong>版本</strong>的<strong>cert</strong>-<strong>manager</strong>。要安裝它，請執行以下指令：</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>安裝完成後，執行以下指令，確認 cert-manager pods 正在執行：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2.安裝 Milvus Operator</h3><p>一旦 cert-manager 開啟並運行，您就可以安裝 Milvus Operator。執行以下指令，使用<code translate="no">kubectl</code> 部署它：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>您可以使用以下命令檢查 Milvus Operator pod 是否正在運行：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3.部署 Milvus 集群</h3><p>一旦 Milvus Operator pod 運行，您就可以使用 Operator 部署 Milvus 集群。以下指令會使用預設組態，在獨立的 Pod 中部署 Milvus 叢集及其元件和相依性：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>若要自訂 Milvus 設定，您需要用自己的組態 YAML 檔案取代 YAML 檔案。除了手動編輯或建立檔案外，您可以使用 Milvus Sizing Tool 調整組態，然後下載相對應的 YAML 檔案。</p>
<p>另外，您也可以使用<a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a>以更簡化的方式。此工具可讓您調整各種設定，例如資源分配和儲存選項，然後下載相應的 YAML 檔案與您所需的配置。這可確保您的 Milvus 部署能針對您的特定使用情況進行最佳化。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖：Milvus 大小工具</p>
<p>完成部署可能需要一些時間。您可以透過指令檢查 Milvus 叢集的狀態：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一旦您的 Milvus 叢集準備就緒，Milvus 叢集中的所有 Pod 應該都已執行或完成：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">步驟 4：存取您的 Milvus 叢集<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦您的 Milvus 叢集部署完成，您需要透過將本機連接埠轉寄到 Milvus 服務連接埠來存取它。按照以下步驟擷取服務連接埠並設定連接埠轉址。</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1.取得服務連接埠</strong></h4><p>首先，使用下列指令找出服務連接埠。將<code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> 改為您的 Milvus 代理 pod 的名稱，通常以<code translate="no">my-release-milvus-proxy-</code> 開頭：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>此命令將返回您的 Milvus 服務正在使用的連接埠號碼。</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2.轉寄連接埠</strong></h4><p>若要在本機存取您的 Milvus 叢集，請使用下列指令將本機連接埠轉寄至服務連接埠。將<code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> 改為您要使用的本機連接埠，並將<code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> 改為上一步擷取的服務連接埠：</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>此指令允許連接埠轉送至主機的所有 IP 位址進行聆聽。如果您只需要服務在<code translate="no">localhost</code> 聆聽，您可以省略<code translate="no">--address 0.0.0.0</code> 選項。</p>
<p>一旦端口轉發設置完成，您就可以通過指定的本地端口訪問您的 Milvus 集群，進行進一步的操作或集成。</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">步驟 5：使用 Python SDK 連線到 Milvus<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>當您的 Milvus 叢集啟動並執行後，您現在可以使用任何 Milvus SDK 與它互動。在這個範例中，我們將使用 Milvus 的<strong>Python SDK PyMilvus</strong>連線到集群並執行基本操作。</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1.安裝 PyMilvus</h3><p>要透過 Python 與 Milvus 互動，您需要安裝<code translate="no">pymilvus</code> 套件：</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2.連接至 Milvus</h3><p>以下是 Python 腳本範例，可連線到您的 Milvus 叢集，並示範如何執行基本操作，例如建立集合。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Connect to the Milvus server</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:&lt;YOUR_LOCAL_PORT&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Create a collection</span>
collection_name = <span class="hljs-string">&quot;example_collection&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name):
   client.drop_collection(collection_name)
client.create_collection(
   collection_name=collection_name,
   dimension=<span class="hljs-number">768</span>,  <span class="hljs-comment"># The vectors we will use in this demo has 768 dimensions</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Explanation" class="common-anchor-header">說明：</h4><ul>
<li><p>連接至 Milvus：腳本使用您在步驟 4 中設定的本機連接埠，連接至在<code translate="no">localhost</code> 上執行的 Milvus 伺服器。</p></li>
<li><p>建立集合：它會檢查一個名為<code translate="no">example_collection</code> 的集合是否已經存在，如果已經存在，就丟棄它，然後以 768 個維度的向量建立一個新的集合。</p></li>
</ul>
<p>這個腳本會建立與 Milvus 叢集的連線，並建立一個集合，作為插入向量和執行相似性搜尋等更複雜操作的起點。</p>
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
    </button></h2><p>在 Kubernetes 上的分散式設定中部署 Milvus，可以釋放管理大型向量資料的強大功能，實現無縫擴充和高效能的 AI 驅動應用程式。遵循本指南，您已學會如何使用 Milvus Operator 設定 Milvus，使流程簡化且有效率。</p>
<p>當您繼續探索 Milvus 時，請考慮擴充您的群集以滿足不斷成長的需求，或將其部署在 Amazon EKS、Google Cloud 或 Microsoft Azure 等雲端平台上。為了強化管理和監控，<a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>、<a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a> 和<a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a>等工具為維護部署的健康和效能提供了寶貴的支援。</p>
<p>現在您已準備好在 Kubernetes 上發揮 Milvus 的全部潛力，祝您部署愉快！🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">更多資源<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Milvus 文件</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed：哪種模式適合您？ </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">增強矢量搜尋功能：Milvus 在 GPU 上使用 NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">什麼是 RAG？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">生成式 AI 資源中心 | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">適用於您的 GenAI 應用程式的最佳效能 AI 模型 | Zilliz</a></p></li>
</ul>
