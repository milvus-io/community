---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: 如何在 Amazon EKS 上部署開放原始碼 Milvus 向量資料庫
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: 使用 Amazon EKS、S3、MSK 和 ELB 等管理服務在 AWS 上部署 Milvus 向量資料庫的逐步指南。
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>本篇文章最初發表於<a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>AWS 網站</em></a>，經過翻譯、編輯，並經授權轉貼於此。</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">向量嵌入與向量資料庫概述<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/generative-ai">生成式人工智能 (GenAI)</a> 的興起，尤其是大型語言模型<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>) 的興起，大幅提升了<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>的興趣，使其成為 GenAI 生態系統中不可或缺的元件。因此，向量資料庫正被越來越多的<a href="https://milvus.io/use-cases">使用案例所</a>採用。</p>
<p><a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">IDC 報告</a>預測，到 2025 年，將有超過 80% 的商業資料是非結構化的，以文字、影像、音訊和視訊等格式存在。要理解、處理、儲存和查詢這些大量的<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料</a>，是一項重大的挑戰。GenAI 和深度學習的常見做法是將非結構化資料轉換為向量嵌入，並儲存和索引至向量資料庫，例如<a href="https://milvus.io/intro">Milvus</a>或<a href="https://zilliz.com/cloud">Zilliz Cloud</a>(完全管理的 Milvus)，以進行向量<a href="https://zilliz.com/learn/vector-similarity-search">相似性</a>或語意相似性搜尋。</p>
<p>但<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>到底是什麼？簡單來說，它們是浮點數在高維空間中的數值表示。<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">兩個向量之間的距離</a>表示它們的相關性：<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">兩</a>者越接近，彼此的相關性就越高，反之亦然。這表示相似向量對應相似的原始資料，這與傳統的關鍵字或精確搜尋不同。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>如何執行向量相似性搜尋</span> </span></p>
<p><em>圖 1：如何執行向量相似性搜尋</em></p>
<p>向量嵌入的儲存、索引和搜尋能力是向量資料庫的核心功能。目前，主流的向量資料庫分為兩大類。第一類是擴充現有的關聯式資料庫產品，例如 Amazon OpenSearch Service 的<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a>外掛，以及 Amazon RDS for<a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a>的 pgvector 擴充。第二類是專門的向量資料庫產品，包括 Milvus、Zilliz Cloud (完全管理的 Milvus)、<a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>、<a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>、<a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a> 和<a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a> 等知名案例。</p>
<p>嵌入技術和向量資料庫在各種<a href="https://zilliz.com/vector-database-use-cases">人工智能驅動的用例</a>中都有廣泛的應用，包括影像相似性搜尋、視訊重複資料刪除與分析、自然語言處理、推薦系統、目標廣告、個人化搜尋、智慧型客戶服務和詐欺偵測。</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a>是眾多向量資料庫中最受歡迎的開源選項之一。本篇文章將介紹 Milvus，並探討在 AWS EKS 上部署 Milvus 的實作。</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvus 是什麼？<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a>是一個高度靈活、可靠、快速的雲原生開源向量資料庫。它為向量相似性搜尋與 AI 應用程式提供動力，並致力於讓每個組織都能存取向量資料庫。Milvus 可以儲存、索引和管理由深度神經網路和其他機器學習 (ML) 模型所產生的十億以上向量嵌入。</p>
<p>Milvus 於 2019 年 10 月以<a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">開源 Apache License 2.0</a>發布。它目前是<a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> 下的畢業專案。在撰寫這篇部落格時，Milvus 的<a href="https://hub.docker.com/r/milvusdb/milvus">Docker pull</a>下載量已超過<a href="https://hub.docker.com/r/milvusdb/milvus">5000 萬次</a>，並被<a href="https://milvus.io/">許多客戶</a>使用，例如 NVIDIA、AT&amp;T、IBM、eBay、Shopee 和 Walmart。</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Milvus 主要功能</h3><p>身為雲端原生向量資料庫，Milvus 擁有以下主要功能：</p>
<ul>
<li><p>十億級向量資料集的高效能與毫秒搜尋。</p></li>
<li><p>多語言支援與工具鏈。</p></li>
<li><p>橫向擴充能力和高可靠性，即使在系統中斷的情況下也是如此。</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">混合搜尋</a>，透過搭配標量篩選與向量相似性搜尋來達成。</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus 架構</h3><p>Milvus 遵循資料流與控制流分離的原則。系統分為四個層級，如圖所示：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 架構</span> </span></p>
<p><em>圖 2 Milvus 架構</em></p>
<ul>
<li><p><strong>存取層：</strong>存取層由一組無狀態代理組成，是系統的前端層，也是使用者的終端。</p></li>
<li><p><strong>協調服務：</strong>協調服務會指派任務給工作節點。</p></li>
<li><p><strong>工作節點：</strong>工作節點是遵循協調器服務指示並執行使用者觸發的 DML/DDL 指令的蠢執行器。</p></li>
<li><p><strong>儲存：</strong>儲存設備負責資料持久化。它包括元儲存、日誌中介及物件儲存。</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus 部署選項</h3><p>Milvus 支援三種執行模式：<a href="https://milvus.io/docs/install-overview.md">Milvus Lite、Standalone 和 Distributed</a>。</p>
<ul>
<li><p><strong>Milvus Lite</strong>是一個 Python 函式庫，可以匯入本機應用程式。作為 Milvus 的輕量級版本，它非常適合在 Jupyter Notebook 或資源有限的智慧型裝置上執行快速原型。</p></li>
<li><p><strong>Milvus Standalone 是</strong>單機伺服器部署。如果您有生產工作負載，但又不想使用 Kubernetes，在有足夠記憶體的單機上執行 Milvus Standalone 是個不錯的選擇。</p></li>
<li><p><strong>Milvus Distributed</strong>可以部署在 Kubernetes 集群上。它支援更大的資料集、更高的可用性和擴充性，更適合生產環境。</p></li>
</ul>
<p>Milvus 從一開始就是為了支援 Kubernetes 而設計，可以輕鬆部署在 AWS 上。我們可以使用 Amazon Elastic Kubernetes Service (Amazon EKS) 作為管理的 Kubernetes、Amazon S3 作為物件儲存、Amazon Managed Streaming for Apache Kafka (Amazon MSK) 作為訊息儲存，以及 Amazon Elastic Load Balancing (Amazon ELB) 作為負載平衡器，來建立一個可靠、彈性的 Milvus 資料庫叢集。</p>
<p>接下來，我們會提供使用 EKS 和其他服務部署 Milvus 叢集的逐步指導。</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">在 AWS EKS 上部署 Milvus<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><p>我們將使用 AWS CLI 建立 EKS 叢集並部署 Milvus 資料庫。需要以下先決條件：</p>
<ul>
<li><p>已安裝<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a>並配置適當權限的 PC/Mac 或 Amazon EC2 實例。如果您使用 Amazon Linux 2 或 Amazon Linux 2023，則預設會安裝 AWS CLI 工具。</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">已安裝 EKS 工具</a>，包括 Helm、Kubectl、eksctl 等。</p></li>
<li><p>一個 Amazon S3 儲存桶。</p></li>
<li><p>一個 Amazon MSK 實例。</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">建立 MSK 時的注意事項</h3><ul>
<li>Milvus 的最新穩定版本 (v2.3.13) 依賴於 Kafka 的<code translate="no">autoCreateTopics</code> 功能。因此在建立 MSK 時，我們需要使用自訂配置，並將<code translate="no">auto.create.topics.enable</code> 屬性從預設的<code translate="no">false</code> 改為<code translate="no">true</code> 。此外，為了增加 MSK 的訊息吞吐量，建議增加<code translate="no">message.max.bytes</code> 和<code translate="no">replica.fetch.max.bytes</code> 的值。詳情請參閱<a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">自訂 MSK 配置</a>。</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus 不支援 MSK 的 IAM 角色認證。因此，在建立 MSK 時，請在安全設定中啟用<code translate="no">SASL/SCRAM authentication</code> 選項，並在 AWS Secrets Manager 中設定<code translate="no">username</code> 和<code translate="no">password</code> 。詳情請參閱<a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">使用 AWS Secrets Manager 進行登入憑證認證</a>。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>圖 3 安全設定 啟用 SASL SCRAM 驗證.png</span> </span></p>
<p><em>圖 3：安全性設定：啟用 SASL/SCRAM 驗證</em></p>
<ul>
<li>我們需要啟用從 EKS 叢集的安全群組或 IP 位址範圍存取 MSK 安全群組。</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">建立 EKS 叢集</h3><p>创建 EKS 群集的方法有很多，例如通过控制台、CloudFormation、eksctl 等。本文章將介紹如何使用 eksctl 建立 EKS 叢集。</p>
<p><code translate="no">eksctl</code> 是一個簡單的命令列工具，用於在 Amazon EKS 上建立和管理 Kubernetes 叢集。它提供了最快、最簡單的方式為 Amazon EKS 建立一個有節點的新群集。更多資訊請參閱 eksctl<a href="https://eksctl.io/">網站</a>。</p>
<ol>
<li>首先，使用下列程式碼片段建立<code translate="no">eks_cluster.yaml</code> 檔案。將<code translate="no">cluster-name</code> 改為您的群集名稱，將<code translate="no">region-code</code> 改為您要建立群集的 AWS 區域，將<code translate="no">private-subnet-idx</code> 改為您的私有子網路。 注意：此組態檔會透過指定私有子網路，在現有的 VPC 中建立 EKS 群集。如果您要建立新的 VPC，請移除 VPC 和子網路設定，然後<code translate="no">eksctl</code> 會自動建立新的 VPC。</li>
</ol>
<pre><code translate="no">apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
 name: &lt;cluster-name&gt;
 region: &lt;region-code&gt;
 version: <span class="hljs-string">&quot;1.26&quot;</span>

iam:
 withOIDC: true

 serviceAccounts:
 - metadata:
     name: aws-load-balancer-controller
     namespace: kube-system
   wellKnownPolicies:
     awsLoadBalancerController: true
 - metadata:
     name: milvus-s3-access-sa
     <span class="hljs-comment"># if no namespace is set, &quot;default&quot; will be used;</span>
     <span class="hljs-comment"># the namespace will be created if it doesn&#x27;t exist already</span>
     namespace: milvus
     labels: {aws-usage: <span class="hljs-string">&quot;milvus&quot;</span>}
   attachPolicyARNs:
   - <span class="hljs-string">&quot;arn:aws:iam::aws:policy/AmazonS3FullAccess&quot;</span>

<span class="hljs-comment"># Use existed VPC to create EKS.</span>
<span class="hljs-comment"># If you don&#x27;t config vpc subnets, eksctl will automatically create a brand new VPC</span>
vpc:
 subnets:
   private:
     us-west-2a: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id1&gt; }
     us-west-2b: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id2&gt; }
     us-west-2c: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id3&gt; }

managedNodeGroups:
 - name: ng-<span class="hljs-number">1</span>-milvus
   labels: { role: milvus }
   instanceType: m6i<span class="hljs-number">.2</span>xlarge
   desiredCapacity: <span class="hljs-number">3</span>
   privateNetworking: true
  
addons:
- name: vpc-cni <span class="hljs-comment"># no version is specified so it deploys the default version</span>
 attachPolicyARNs:
   - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
- name: coredns
 version: latest <span class="hljs-comment"># auto discovers the latest available</span>
- name: kube-proxy
 version: latest
- name: aws-ebs-csi-driver
 wellKnownPolicies:      <span class="hljs-comment"># add IAM and service account</span>
   ebsCSIController: true
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>然後，執行<code translate="no">eksctl</code> 指令來建立 EKS 群集。</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>此指令會建立下列資源：</p>
<ul>
<li><p>具有指定版本的 EKS 群集。</p></li>
<li><p>一個包含三個 m6i.2xlarge EC2 實體的受管節點群組。</p></li>
<li><p>一個<a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">IAM OIDC 身份提供者</a>和一個名為<code translate="no">aws-load-balancer-controller</code> 的 ServiceAccount，我們稍後安裝<strong>AWS Load Balancer Controller</strong> 時會用到。</p></li>
<li><p>一個命名空間<code translate="no">milvus</code> ，以及此命名空間中的一個 ServiceAccount<code translate="no">milvus-s3-access-sa</code> 。稍後配置 S3 作為 Milvus 的物件儲存時將使用此命名空間。</p>
<p>注意：為了簡單起見，這裡的<code translate="no">milvus-s3-access-sa</code> 被授予完整的 S3 存取權限。在生產部署中，建議遵循最小權限原則，僅授予用於 Milvus 的特定 S3 存儲桶的存取權限。</p></li>
<li><p>多個附加元件，其中<code translate="no">vpc-cni</code>,<code translate="no">coredns</code>,<code translate="no">kube-proxy</code> 是 EKS 所需的核心附加元件。<code translate="no">aws-ebs-csi-driver</code> 是 AWS EBS CSI 驅動程式，可讓 EKS 叢集管理 Amazon EBS 卷冊的生命週期。</p></li>
</ul>
<p>現在，我們只需等待群集建立完成。</p>
<p>等待叢集建立完成。在群集建立過程中，<code translate="no">kubeconfig</code> 檔案會自動建立或更新。您也可以執行下列指令手動更新。確保將<code translate="no">region-code</code> 替換為正在建立群集的 AWS 區域，並將<code translate="no">cluster-name</code> 替換為群集的名稱。</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>群集建立後，您可以執行下列指令檢視節點：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>建立<code translate="no">ebs-sc</code> StorageClass，設定 GP3 為儲存類型，並將其設定為預設 StorageClass。Milvus 使用 etcd 作為其 Meta Storage，並需要此 StorageClass 來建立和管理 PVC。</li>
</ol>
<pre><code translate="no">cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: ebs-sc
 annotations:
   storageclass.kubernetes.io/<span class="hljs-keyword">is</span>-default-<span class="hljs-keyword">class</span>: <span class="hljs-string">&quot;true&quot;</span>
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
 <span class="hljs-built_in">type</span>: gp3
EOF
<button class="copy-code-btn"></button></code></pre>
<p>然後將原本的<code translate="no">gp2</code> StorageClass 設定為非預設：</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>安裝 AWS Load Balancer Controller。我們稍後會在 Milvus 服務和 Attu Ingress 中使用此控制器，因此讓我們事先安裝。</li>
</ol>
<ul>
<li>首先，新增<code translate="no">eks-charts</code> repo 並更新。</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>接著，安裝 AWS Load Balancer Controller。將<code translate="no">cluster-name</code> 改為您的群集名稱。命名為<code translate="no">aws-load-balancer-controller</code> 的 ServiceAccount 已經在之前的步驟中建立 EKS 叢集時建立。</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>驗證控制器是否安裝成功。</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>輸出應該如下所示：</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">部署 Milvus 群集</h3><p>Milvus 支援多種部署方法，例如 Operator 和 Helm。Operator 比較簡單，但 Helm 更直接、更靈活。在這個範例中，我們會使用 Helm 來部署 Milvus。</p>
<p>使用 Helm 部署 Milvus 時，您可以透過<code translate="no">values.yaml</code> 檔案自訂配置。按一下<a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a>檢視所有選項。預設情況下，Milvus 會在集群內建立 minio 和 pulsar，分別作為物件儲存空間和訊息儲存空間。我們將做一些設定變更，使其更適合生產。</p>
<ol>
<li>首先，新增 Milvus Helm repo 並更新它。</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>使用下列程式碼片段建立<code translate="no">milvus_cluster.yaml</code> 檔案。此程式碼片段可自訂 Milvus 的設定，例如設定 Amazon S3 為物件儲存空間、Amazon MSK 為訊息佇列。我們稍後會提供詳細的說明和設定指引。</li>
</ol>
<pre><code translate="no"><span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 1</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure S3 as the Object Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Service account</span>
<span class="hljs-comment"># - this service account are used by External S3 access</span>
serviceAccount:
  create: false
  name: milvus-s3-access-sa

<span class="hljs-comment"># Close in-cluster minio</span>
minio:
  enabled: false

<span class="hljs-comment"># External S3</span>
<span class="hljs-comment"># - these configs are only used when `externalS3.enabled` is true</span>
externalS3:
  enabled: true
  host: <span class="hljs-string">&quot;s3.&lt;region-code&gt;.amazonaws.com&quot;</span>
  port: <span class="hljs-string">&quot;443&quot;</span>
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;bucket-name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;&lt;root-path&gt;&quot;</span>
  useIAM: true
  cloudProvider: <span class="hljs-string">&quot;aws&quot;</span>
  iamEndpoint: <span class="hljs-string">&quot;&quot;</span>

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 2</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure MSK as the Message Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Close in-cluster pulsar</span>
pulsar:
  enabled: false

<span class="hljs-comment"># External kafka</span>
<span class="hljs-comment"># - these configs are only used when `externalKafka.enabled` is true</span>
externalKafka:
  enabled: true
  brokerList: <span class="hljs-string">&quot;&lt;broker-list&gt;&quot;</span>
  securityProtocol: SASL_SSL
  sasl:
    mechanisms: SCRAM-SHA-<span class="hljs-number">512</span>
    username: <span class="hljs-string">&quot;&lt;username&gt;&quot;</span>
    password: <span class="hljs-string">&quot;&lt;password&gt;&quot;</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 3</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Expose the Milvus service to be accessed from outside the cluster (LoadBalancer service).</span>
<span class="hljs-comment"># or access it from within the cluster (ClusterIP service). Set the service type and the port to serve it.</span>
<span class="hljs-comment">#####################################</span>
service:
  <span class="hljs-built_in">type</span>: LoadBalancer
  port: <span class="hljs-number">19530</span>
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-<span class="hljs-built_in">type</span>: external <span class="hljs-comment">#AWS Load Balancer Controller fulfills services that has this annotation</span>
    service.beta.kubernetes.io/aws-load-balancer-name : milvus-service <span class="hljs-comment">#User defined name given to AWS Network Load Balancer</span>
    service.beta.kubernetes.io/aws-load-balancer-scheme: internal <span class="hljs-comment"># internal or internet-facing, later allowing for public access via internet</span>
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 4</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Installing Attu the Milvus management GUI</span>
<span class="hljs-comment">#####################################</span>
attu:
  enabled: true
  name: attu
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.<span class="hljs-keyword">class</span>: alb <span class="hljs-comment"># Annotation: set ALB ingress type</span>
      alb.ingress.kubernetes.io/scheme: internet-facing <span class="hljs-comment">#Places the load balancer on public subnets</span>
      alb.ingress.kubernetes.io/target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
      alb.ingress.kubernetes.io/group.name: attu <span class="hljs-comment"># Groups multiple Ingress resources</span>
    hosts:
      -
      
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 5</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># HA deployment of Milvus Core Components</span>
<span class="hljs-comment">#####################################</span>
rootCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for root coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 2Gi
indexCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for index coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
queryCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for query coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
dataCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for data coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
proxy:
  replicas: <span class="hljs-number">2</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 6</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Milvus Resource Allocation</span>
<span class="hljs-comment">#####################################</span>
queryNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">2</span>
      memory: 8Gi
dataNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi
indexNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">4</span>
      memory: 8Gi
<button class="copy-code-btn"></button></code></pre>
<p>程式碼包含六個部分。請依照下列指示變更相對應的設定。</p>
<p><strong>第 1 節</strong>：配置 S3 為物件儲存空間。serviceAccount 授權 Milvus 存取 S3 (在本例中，它是<code translate="no">milvus-s3-access-sa</code> ，這是我們建立 EKS 叢集時所建立的)。確保將<code translate="no">&lt;region-code&gt;</code> 改為群集所在的 AWS 區域。將<code translate="no">&lt;bucket-name&gt;</code> 改為 S3 儲存桶的名稱，將<code translate="no">&lt;root-path&gt;</code> 改為 S3 儲存桶的前綴（此欄位可留空）。</p>
<p><strong>第 2 節</strong>：將 MSK 設定為訊息儲存空間。以 MSK 的 SASL/SCRAM 認證類型對應的端點位址取代<code translate="no">&lt;broker-list&gt;</code> 。將<code translate="no">&lt;username&gt;</code> 和<code translate="no">&lt;password&gt;</code> 改為 MSK 帳戶的使用者名稱和密碼。您可以從 MSK 客戶端資訊取得<code translate="no">&lt;broker-list&gt;</code> ，如下圖所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>圖 4 設定 MSK 為 Milvus 的訊息儲存空間.png</span> </span></p>
<p><em>圖 4: 設定 MSK 為 Milvus 的訊息儲存空間</em></p>
<p><strong>第 3 節：</strong>開放 Milvus 服務，並啟用群集外部的存取。Milvus 端點預設使用 ClusterIP 類型的服務，只能在 EKS 集群內存取。如果需要，您可以將其變更為 LoadBalancer 類型，以允許從 EKS 集群外部訪問。LoadBalancer 類型服務使用 Amazon NLB 作為負載平衡器。根據安全最佳實務，<code translate="no">aws-load-balancer-scheme</code> 在此預設設定為內部模式，這表示只允許內部網路存取 Milvus。點擊<a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">查看 NLB 配置說明</a>。</p>
<p><strong>第 4 節：</strong>安裝並配置開放原始碼的 Milvus 管理工具<a href="https://github.com/zilliztech/attu">Attu</a>。它有直觀的圖形使用者介面，讓您輕鬆與 Milvus 互動。我們啟用 Attu，使用 AWS ALB 設定入口，並將其設定為<code translate="no">internet-facing</code> 類型，以便可以透過網際網路存取 Attu。<a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">點選此文件</a>取得 ALB 設定指南。</p>
<p><strong>第 5 節：</strong>啟用 Milvus 核心元件的 HA 部署。Milvus 包含多個獨立且解耦的元件。例如，協調器服務作為控制層，處理 Root、Query、Data 和 Index 元件的協調。存取層中的 Proxy 則作為資料庫存取端點。這些元件預設只有 1 個 pod 複製本。為了提高 Milvus 的可用性，部署這些服務元件的多個複本是特別必要的。</p>
<p><strong>注意：</strong>Root、Query、Data 和 Index 協調器元件的多重複製部署需要啟用<code translate="no">activeStandby</code> 選項。</p>
<p><strong>第 6 節：</strong>調整 Milvus 元件的資源分配，以滿足工作負載的需求。Milvus 網站也提供一個<a href="https://milvus.io/tools/sizing/">大小工具</a>，可根據資料量、向量尺寸、索引類型等產生配置建議。它還可以一鍵生成 Helm 配置文件。以下配置是該工具針對 100 萬 1024 維向量和 HNSW 索引類型提出的建議。</p>
<ol>
<li>使用 Helm 建立 Milvus (部署在命名空間<code translate="no">milvus</code>)。注意：您可以使用自訂名稱取代<code translate="no">&lt;demo&gt;</code> 。</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>執行下列指令檢查部署狀態。</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>以下輸出顯示 Milvus 元件都是 AVAILABLE，且協調元件已啟用多重複製。</p>
<pre><code translate="no">NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
demo-milvus-attu         1/1     1            1           5m27s
demo-milvus-datacoord    2/2     2            2           5m27s
demo-milvus-datanode     1/1     1            1           5m27s
demo-milvus-indexcoord   2/2     2            2           5m27s
demo-milvus-indexnode    1/1     1            1           5m27s
demo-milvus-proxy        2/2     2            2           5m27s
demo-milvus-querycoord   2/2     2            2           5m27s
demo-milvus-querynode    1/1     1            1           5m27s
demo-milvus-rootcoord    2/2     2            2           5m27s
<button class="copy-code-btn"></button></code></pre>
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">存取與管理 Milvus</h3><p>到目前為止，我們已成功部署 Milvus 向量資料庫。現在，我們可以透過端點存取 Milvus。Milvus 透過 Kubernetes 服務揭露端點。Attu 透過 Kubernetes Ingress 開啟端點。</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>存取 Milvus 端點</strong></h4><p>執行下列指令取得服務端點：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>您可以檢視數個服務。Milvus 支援兩個連接埠，連接埠<code translate="no">19530</code> 和連接埠<code translate="no">9091</code> ：</p>
<ul>
<li>連接埠<code translate="no">19530</code> 用於 gRPC 和 RESTful API。當您使用不同的 Milvus SDK 或 HTTP 用戶端連接到 Milvus 伺服器時，它是預設的連接埠。</li>
<li>連接埠<code translate="no">9091</code> 是 Kubernetes 內的指標收集、pprof 剖析和健康探測的管理連接埠。</li>
</ul>
<p><code translate="no">demo-milvus</code> 服務提供資料庫存取端點，用來從用戶端建立連線。它使用 NLB 作為服務負載平衡器。您可以從<code translate="no">EXTERNAL-IP</code> 列取得服務端點。</p>
<pre><code translate="no">NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP                                               PORT(S)                          AGE
demo-etcd                ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.103</span><span class="hljs-number">.138</span>   &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-etcd-headless       ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-milvus              LoadBalancer   <span class="hljs-number">172.20</span><span class="hljs-number">.219</span><span class="hljs-number">.33</span>    milvus-nlb-xxxx.elb.us-west-<span class="hljs-number">2.</span>amazonaws.com               <span class="hljs-number">19530</span>:<span class="hljs-number">31201</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31088</span>/TCP   62m
demo-milvus-datacoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.214</span><span class="hljs-number">.106</span>   &lt;none&gt;                                                    <span class="hljs-number">13333</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-datanode     ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-indexcoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.106</span><span class="hljs-number">.51</span>    &lt;none&gt;                                                    <span class="hljs-number">31000</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-indexnode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-querycoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.136</span><span class="hljs-number">.213</span>   &lt;none&gt;                                                    <span class="hljs-number">19531</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-querynode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-rootcoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.173</span><span class="hljs-number">.98</span>    &lt;none&gt;                                                    <span class="hljs-number">53100</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>使用 Attu 管理 Milvus</strong></h4><p>如前所述，我們已安裝 Attu 來管理 Milvus。執行下列指令來取得端點：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>您可以看到一個名為<code translate="no">demo-milvus-attu</code> 的 Ingress ，其中<code translate="no">ADDRESS</code> 欄是存取 URL。</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>在瀏覽器中打開 Ingress 位址，看到以下頁面。按一下<strong>Connect</strong>進行登入。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>圖 5 登入您的 Attu 帳戶.png</span> </span></p>
<p><em>圖 5：登入您的 Attu 帳戶</em></p>
<p>登入後，您可以透過 Attu 管理 Milvus 資料庫。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>圖 6 Attu 介面.png</span> </span></p>
<p>圖 6: Attu 介面</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">測試 Milvus 向量資料庫<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>我們將使用Milvus<a href="https://milvus.io/docs/example_code.md">範例程式碼來</a>測試Milvus資料庫是否正常運作。首先，使用下列指令下載<code translate="no">hello_milvus.py</code> 範例程式碼：</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>修改範例程式碼中的 host 為 Milvus 服務端點。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>執行程式碼：</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>如果系統返回以下結果，則表示 Milvus 運行正常。</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>這篇文章介紹了最受歡迎的開源向量資料庫之一<a href="https://milvus.io/intro">Milvus</a>，並提供在 AWS 上部署 Milvus 的指南，使用 Amazon EKS、S3、MSK 和 ELB 等管理服務來達到更高的彈性和可靠性。</p>
<p>作為各種 GenAI 系統的核心元件，特別是 Retrieval Augmented Generation (RAG)，Milvus 支援並整合各種主流 GenAI 模型和框架，包括 Amazon Sagemaker、PyTorch、HuggingFace、LlamaIndex 和 LangChain。立即使用 Milvus 開始您的 GenAI 創新之旅！</p>
<h2 id="References" class="common-anchor-header">參考資料<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">亞馬遜 EKS 使用指南</a></li>
<li><a href="https://milvus.io/">Milvus 官方網站</a></li>
<li><a href="https://github.com/milvus-io/milvus">Milvus GitHub 儲存庫</a></li>
<li><a href="https://eksctl.io/">eksctl 官方網站</a></li>
</ul>
