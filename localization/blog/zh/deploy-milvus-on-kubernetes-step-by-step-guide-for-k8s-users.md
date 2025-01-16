---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: 在 Kubernetes 上部署 Milvus：Kubernetes 用户分步指南
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: 本指南将提供使用 Milvus 操作符在 Kubernetes 上设置 Milvus 的清晰、循序渐进的演练。
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a>是一个开源<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>，旨在通过向量表示来存储、索引和搜索海量<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>，因此非常适合人工智能驱动的应用，如相似性搜索、<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>、检索增强生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（RAG</a>）、推荐引擎和其他机器学习任务。</p>
<p>但 Milvus 的更强大之处在于它与 Kubernetes 的无缝集成。如果你是 Kubernetes 爱好者，你就会知道该平台是协调可扩展分布式系统的完美平台。Milvus 充分利用 Kubernetes 的功能，让你可以轻松部署、扩展和管理分布式 Milvus 集群。本指南将提供使用 Milvus 操作符在 Kubernetes 上设置 Milvus 的清晰、循序渐进的演示。</p>
<h2 id="Prerequisites" class="common-anchor-header">前提条件<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>开始之前，请确保具备以下先决条件：</p>
<ul>
<li><p>已启动并运行的 Kubernetes 集群。如果是本地测试，<code translate="no">minikube</code> 是个不错的选择。</p></li>
<li><p><code translate="no">kubectl</code> 安装并配置好与 Kubernetes 集群交互。</p></li>
<li><p>熟悉基本的 Kubernetes 概念，如 pod、服务和部署。</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">第 1 步：安装 Minikube（用于本地测试）<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>如果你需要建立本地 Kubernetes 环境，<code translate="no">minikube</code> 就是你的理想工具。<a href="https://minikube.sigs.k8s.io/docs/start/">minikube入门页面</a>上有正式的安装说明。</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1.安装 Minikube</h3><p>访问<a href="https://github.com/kubernetes/minikube/releases"> minikube 发布页面</a>，为你的操作系统下载相应的版本。对于 macOS/Linux，您可以使用以下命令：</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2.启动 Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3.与集群交互</h3><p>现在，您可以使用 minikube 内的 kubectl 与集群交互。如果没有安装 kubectl，minikube 默认会下载相应的版本。</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>或者，你也可以创建一个指向 minikube 二进制文件的符号链接，命名为<code translate="no">kubectl</code> ，以方便使用。</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">第 2 步：配置存储类<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Kubernetes 中，<strong>StorageClass</strong>定义了工作负载可用的存储类型，为管理不同的存储配置提供了灵活性。在继续之前，你必须确保群集中有一个默认的 StorageClass。下面介绍如何检查并在必要时配置一个。</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1.检查已安装的存储类</h3><p>要查看 Kubernetes 集群中可用的存储类，请运行以下命令：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>这将显示群集中安装的存储类列表。如果已经配置了默认存储类，则会以<code translate="no">(default)</code> 标记。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2.配置默认存储类（如有必要）</h3><p>如果没有设置默认 StorageClass，可以通过在 YAML 文件中定义来创建一个。使用下面的示例创建默认 StorageClass：</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>此 YAML 配置定义了一个名为<code translate="no">default-storageclass</code> 的<code translate="no">StorageClass</code> ，它使用<code translate="no">minikube-hostpath</code> provisioner，常用于本地开发环境。</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3.应用 StorageClass</h3><p>创建<code translate="no">default-storageclass.yaml</code> 文件后，使用以下命令将其应用到群集：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>这将为你的群集设置默认的 StorageClass，确保今后能正确管理存储需求。</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">步骤 3：使用 Milvus 操作符安装 Milvus<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 操作符简化了在 Kubernetes 上部署 Milvus、管理部署、扩展和更新的过程。在安装 Milvus Operator 之前，你需要安装<strong>cert-manager</strong>，它为 Milvus Operator 使用的 webhook 服务器提供证书。</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1.安装证书管理器</h3><p>Milvus Operator 需要一个<a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a>来管理用于安全通信的证书。确保安装<strong>1.1.3</strong>或更高版本的<strong>cert</strong>-<strong>manager</strong>。要安装它，请运行以下命令：</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>安装完成后，执行以下命令验证 cert-manager pod 是否正在运行：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2.安装 Milvus 操作符</h3><p>一旦 cert-manager 启动并运行，就可以安装 Milvus 操作符了。运行以下命令，使用<code translate="no">kubectl</code> 进行部署：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>您可以使用以下命令检查 Milvus Operator pod 是否正在运行：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3.部署 Milvus 群集</h3><p>一旦 Milvus Operator pod 运行，就可以用操作符部署 Milvus 群集。以下命令将使用默认配置部署一个 Milvus 群集，并将其组件和依赖项分别放在不同的 pod 中：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>要自定义 Milvus 设置，需要用自己的配置 YAML 文件替换 YAML 文件。除了手动编辑或创建文件外，还可以使用 Milvus 大小工具调整配置，然后下载相应的 YAML 文件。</p>
<p>要自定义 Milvus 设置，必须用自己的配置替换默认 YAML 文件。您可以手动编辑或创建该文件，使其符合您的具体要求。</p>
<p>或者，你也可以使用<a href="https://milvus.io/tools/sizing"><strong>Milvus 大小工具</strong></a>，以获得更简化的方法。通过该工具，你可以调整各种设置，如资源分配和存储选项，然后下载相应的 YAML 文件和你所需的配置。这可确保您的 Milvus 部署针对特定用例进行了优化。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图Milvus 大小工具</p>
<p>完成部署可能需要一些时间。你可以通过命令查看 Milvus 集群的状态：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一旦你的 Milvus 集群准备就绪，Milvus 集群中的所有 pod 都应已运行或完成：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">第 4 步：访问 Milvus 群集<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>部署好 Milvus 群集后，你需要通过将本地端口转发到 Milvus 服务端口来访问它。请按照以下步骤检索服务端口并设置端口转发。</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1.获取服务端口</strong></h4><p>首先，使用以下命令确定服务端口。将<code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> 替换为 Milvus 代理 pod 的名称，通常以<code translate="no">my-release-milvus-proxy-</code> 开头：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>该命令将返回 Milvus 服务正在使用的端口号。</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2.转发端口</strong></h4><p>要在本地访问 Milvus 集群，请使用以下命令将本地端口转发到服务端口。将<code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> 替换为要使用的本地端口，将<code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> 替换为上一步中获取的服务端口：</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>该命令允许端口转发，以监听主机的所有 IP 地址。如果只需要服务监听<code translate="no">localhost</code> ，则可以省略<code translate="no">--address 0.0.0.0</code> 选项。</p>
<p>端口转发设置完成后，就可以通过指定的本地端口访问 Milvus 集群，进行进一步操作或集成。</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">步骤 5：使用 Python SDK 连接 Milvus<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 集群的启动和运行，你现在可以使用任何 Milvus SDK 与之交互。在本例中，我们将使用 Milvus 的<strong>Python SDK PyMilvus</strong>连接到集群并执行基本操作。</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1.安装 PyMilvus</h3><p>要通过 Python 与 Milvus 交互，需要安装<code translate="no">pymilvus</code> 软件包：</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2.连接 Milvus</h3><p>下面是一个连接到 Milvus 集群的 Python 脚本示例，演示了如何执行创建 Collections 等基本操作。</p>
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
<h4 id="Explanation" class="common-anchor-header">说明</h4><ul>
<li><p>连接到 Milvus：脚本使用在步骤 4 中设置的本地端口连接到运行在<code translate="no">localhost</code> 上的 Milvus 服务器。</p></li>
<li><p>创建 Collections：它将检查名为<code translate="no">example_collection</code> 的 Collections 是否已经存在，如果已经存在则将其删除，然后创建一个具有 768 维向量的新 Collection。</p></li>
</ul>
<p>该脚本建立了与 Milvus Operator 集群的连接，并创建了一个 Collection，作为插入向量和执行相似性搜索等更复杂操作的起点。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Kubernetes 上的分布式设置中部署 Milvus，可以释放管理大规模向量数据的强大功能，实现无缝可扩展性和高性能 AI 驱动型应用。通过本指南，您已经学会了如何使用 Milvus 操作符设置 Milvus，从而简化并高效地完成整个过程。</p>
<p>在继续探索 Milvus 的过程中，您可以考虑扩展集群以满足不断增长的需求，或将其部署到亚马逊 EKS、谷歌云或 Microsoft Azure 等云平台上。为了加强管理和监控，<a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>、<a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a> 和<a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a>等工具为维护部署的健康和性能提供了宝贵的支持。</p>
<p>现在，您已经准备好在 Kubernetes 上充分发挥 Milvus 的潜力，祝您部署愉快！🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">更多资源<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Milvus 文档</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed：哪种模式适合您？ </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">增强向量搜索：Milvus 在 GPU 上使用英伟达 RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">什么是 RAG？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">生成式人工智能资源中心｜Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">为您的 GenAI 应用程序提供性能最佳的 AI 模型 | Zilliz</a></p></li>
</ul>
