---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: 如何在亚马逊 EKS 上部署开源 Milvus 向量数据库
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: 使用亚马逊 EKS、S3、MSK 和 ELB 等托管服务在 AWS 上部署 Milvus 向量数据库的分步指南。
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>这篇文章最初发表在<a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>AWS 网站</em></a>上，经翻译、编辑并获得许可后在此转贴。</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">向量嵌入和向量数据库概述<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/generative-ai">生成式人工智能（GenAI）</a>的兴起，尤其是大型语言模型<a href="https://zilliz.com/glossary/large-language-models-(llms)">（LLMs</a>）的兴起，极大地提升了人们对<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>的兴趣，使其成为 GenAI 生态系统中的重要组成部分。因此，向量数据库正被越来越多的<a href="https://milvus.io/use-cases">用例所</a>采用。</p>
<p><a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">IDC 报告</a>预测，到 2025 年，80% 以上的业务数据将是非结构化的，以文本、图像、音频和视频等格式存在。大规模地理解、处理、存储和查询这些海量<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>是一项巨大的挑战。GenAI 和深度学习的常见做法是将非结构化数据转化为向量嵌入，存储并索引到<a href="https://milvus.io/intro">Milvus</a>或<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（完全托管的 Milvus）等向量数据库中，用于<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性</a>或语义相似性搜索。</p>
<p>但<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>到底是什么呢？简单地说，它们是浮点数在高维空间中的数字表示。<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">两个向量之间的距离</a>表示它们的相关性：<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">距离</a>越近，它们之间的相关性越高，反之亦然。这意味着相似的向量对应着相似的原始数据，这与传统的关键字或精确搜索不同。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>如何执行向量相似性搜索</span> </span></p>
<p><em>图 1：如何执行向量相似性搜索</em></p>
<p>向量嵌入的存储、索引和搜索能力是向量数据库的核心功能。目前，主流的向量数据库分为两类。第一类是对现有关系数据库产品的扩展，如亚马逊 OpenSearch 服务的<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a>插件和亚马逊 RDS for<a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a>的 pgvector 扩展。第二类是专门的向量数据库产品，包括 Milvus、Zilliz Cloud（完全托管的 Milvus）、<a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>、<a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>、<a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a> 和<a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a> 等著名案例。</p>
<p>Embeddings 技术和向量数据库在各种<a href="https://zilliz.com/vector-database-use-cases">人工智能驱动的用例</a>中有着广泛的应用，包括图像相似性搜索、视频重复数据删除和分析、自然语言处理、推荐系统、定向广告、个性化搜索、智能客户服务和欺诈检测。</p>
<p>在众多向量数据库中，<a href="https://milvus.io/docs/quickstart.md">Milvus</a>是最受欢迎的开源选项之一。本篇文章将介绍 Milvus，并探讨在 AWS EKS 上部署 Milvus 的实践。</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvus 是什么？<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a>是一个高度灵活、可靠、快速的云原生开源向量数据库。它为向量相似性搜索和人工智能应用提供动力，并努力使每个组织都能访问向量数据库。Milvus 可以存储、索引和管理由深度神经网络和其他机器学习（ML）模型生成的 10 亿多个向量 Embeddings。</p>
<p>Milvus 于 2019 年 10 月以<a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">开源 Apache License 2.0</a>发布。它目前是<a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> 的一个毕业项目。在撰写本博客时，Milvus 的<a href="https://hub.docker.com/r/milvusdb/milvus">Docker pull</a>下载量已达到<a href="https://hub.docker.com/r/milvusdb/milvus">5000 多万次</a>，并被英伟达、AT&amp;T、IBM、eBay、Shopee 和沃尔玛等<a href="https://milvus.io/">众多客户</a>使用。</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Milvus 的主要功能</h3><p>作为云原生向量数据库，Milvus 拥有以下主要功能：</p>
<ul>
<li><p>在十亿级向量数据集上实现高性能和毫秒级搜索。</p></li>
<li><p>多语言支持和工具链。</p></li>
<li><p>横向可扩展性和高可靠性，即使在中断情况下也是如此。</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">混合搜索</a>，通过标量过滤与向量相似性搜索配对实现。</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus 架构</h3><p>Milvus 遵循数据流与控制流分离的原则。如图所示，系统分为四个层次：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 架构</span> </span></p>
<p><em>图 2 Milvus 架构</em></p>
<ul>
<li><p><strong>访问层：</strong>访问层由一组无状态代理组成，是系统的前端层和用户的终端。</p></li>
<li><p><strong>协调服务：</strong>协调服务将任务分配给工作节点。</p></li>
<li><p><strong>工作节点：</strong>工作节点是哑执行器，它们遵循协调者服务的指令，执行用户触发的 DML/DDL 命令。</p></li>
<li><p><strong>存储：</strong>存储负责数据持久性。它包括元存储、日志代理和对象存储。</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus 部署选项</h3><p>Milvus 支持三种运行模式：<a href="https://milvus.io/docs/install-overview.md">Milvus Lite、Standalone 和 Distributed</a>。</p>
<ul>
<li><p><strong>Milvus Lite</strong>是一个 Python 库，可导入本地应用程序。作为 Milvus 的轻量级版本，它非常适合在 Jupyter Notebooks 中进行快速原型开发，或在资源有限的智能设备上运行。</p></li>
<li><p><strong>Milvus Standalone 是</strong>单机服务器部署。如果你有生产工作负载，但又不想使用 Kubernetes，那么在内存充足的单机上运行 Milvus Standalone 是一个不错的选择。</p></li>
<li><p><strong>Milvus Distributed</strong>可以部署在 Kubernetes 集群上。它支持更大的数据集、更高的可用性和可扩展性，更适合生产环境。</p></li>
</ul>
<p>Milvus 从设计之初就支持 Kubernetes，可以轻松部署在 AWS 上。我们可以使用 Amazon Elastic Kubernetes Service（Amazon EKS）作为受管 Kubernetes，使用 Amazon S3 作为对象存储，使用 Amazon Managed Streaming for Apache Kafka（Amazon MSK）作为消息存储，使用 Amazon Elastic Load Balancing（Amazon ELB）作为负载平衡器，从而构建一个可靠、弹性的 Milvus 数据库集群。</p>
<p>接下来，我们将逐步指导大家使用 EKS 和其他服务部署 Milvus 集群。</p>
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">先决条件</h3><p>我们将使用 AWS CLI 创建 EKS 群集并部署 Milvus 数据库。需要以下先决条件：</p>
<ul>
<li><p>安装了<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a>并配置了适当权限的 PC/Mac 或 Amazon EC2 实例。如果使用 Amazon Linux 2 或 Amazon Linux 2023，则默认安装 AWS CLI 工具。</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">已安装 EKS 工具</a>，包括 Helm、Kubectl、eksctl 等。</p></li>
<li><p>一个亚马逊 S3 存储桶。</p></li>
<li><p>亚马逊 MSK 实例。</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">创建 MSK 时的注意事项</h3><ul>
<li>Milvus 的最新稳定版本（v2.3.13）依赖于 Kafka 的<code translate="no">autoCreateTopics</code> 功能。因此，在创建 MSK 时，我们需要使用自定义配置，并将<code translate="no">auto.create.topics.enable</code> 属性从默认的<code translate="no">false</code> 更改为<code translate="no">true</code> 。此外，为提高 MSK 的消息吞吐量，建议增加<code translate="no">message.max.bytes</code> 和<code translate="no">replica.fetch.max.bytes</code> 的值。有关详情，请参阅<a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">自定义 MSK 配置</a>。</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus 不支持 MSK 基于 IAM 角色的身份验证。因此，在创建 MSK 时，请在安全配置中启用<code translate="no">SASL/SCRAM authentication</code> 选项，并在 AWS Secrets Manager 中配置<code translate="no">username</code> 和<code translate="no">password</code> 。有关详情，请参阅<a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">使用 AWS Secrets Manager 进行登录凭据身份验证</a>。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>图 3 安全设置启用 SASL SCRAM 身份验证.png</span> </span></p>
<p><em>图 3：安全设置：启用 SASL/SCRAM 身份验证</em></p>
<ul>
<li>我们需要启用从 EKS 群集的安全组或 IP 地址范围访问 MSK 安全组。</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">创建 EKS 群集</h3><p>创建 EKS 群集的方法有很多，如通过控制台、CloudFormation、eksctl 等。本文章将介绍如何使用 eksctl 创建 EKS 群集。</p>
<p><code translate="no">eksctl</code> 是一个简单的命令行工具，用于在亚马逊 EKS 上创建和管理 Kubernetes 群集。它提供了最快、最简单的方法来为亚马逊 EKS 创建一个带有节点的新集群。更多信息，请参阅 eksctl<a href="https://eksctl.io/">网站</a>。</p>
<ol>
<li>首先，用以下代码段创建一个<code translate="no">eks_cluster.yaml</code> 文件。将<code translate="no">cluster-name</code> 替换为群集名称，将<code translate="no">region-code</code> 替换为要创建群集的 AWS 区域，将<code translate="no">private-subnet-idx</code> 替换为私有子网。 注意：此配置文件通过指定私有子网在现有 VPC 中创建 EKS 群集。如果要创建新的 VPC，请删除 VPC 和子网配置，然后<code translate="no">eksctl</code> 将自动创建一个新的 VPC。</li>
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
<li>然后，运行<code translate="no">eksctl</code> 命令创建 EKS 群集。</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>该命令将创建以下资源：</p>
<ul>
<li><p>具有指定版本的 EKS 群集。</p></li>
<li><p>一个包含三个 m6i.2xlarge EC2 实例的受管节点组。</p></li>
<li><p>一个<a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">IAM OIDC 身份提供程序</a>和一个名为<code translate="no">aws-load-balancer-controller</code> 的服务帐户，我们稍后将在安装<strong>AWS 负载平衡器控制器</strong>时使用该帐户。</p></li>
<li><p>一个命名空间<code translate="no">milvus</code> 和该命名空间中的一个服务帐户<code translate="no">milvus-s3-access-sa</code> 。稍后在配置 S3 作为 Milvus 的对象存储时将使用该命名空间。</p>
<p>注：为简单起见，此处的<code translate="no">milvus-s3-access-sa</code> 被授予了完整的 S3 访问权限。在生产部署中，建议遵循最小权限原则，只授予用于 Milvus 的特定 S3 存储桶的访问权限。</p></li>
<li><p>多个附加组件，其中<code translate="no">vpc-cni</code>,<code translate="no">coredns</code>,<code translate="no">kube-proxy</code> 是 EKS 所需的核心附加组件。<code translate="no">aws-ebs-csi-driver</code> 是 AWS EBS CSI 驱动程序，允许 EKS 群集管理 Amazon EBS 卷的生命周期。</p></li>
</ul>
<p>现在，我们只需等待群集创建完成。</p>
<p>等待群集创建完成。在群集创建过程中，<code translate="no">kubeconfig</code> 文件将自动创建或更新。也可以运行以下命令手动更新。确保将<code translate="no">region-code</code> 替换为创建群集的 AWS 区域，并将<code translate="no">cluster-name</code> 替换为群集的名称。</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>创建群集后，可以通过运行以下命令查看节点：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>创建<code translate="no">ebs-sc</code> StorageClass，将 GP3 配置为存储类型，并将其设置为默认 StorageClass。Milvus 使用 etcd 作为其元存储，并需要此 StorageClass 来创建和管理 PVC。</li>
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
<p>然后，将原来的<code translate="no">gp2</code> StorageClass 设置为非默认：</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>安装 AWS 负载平衡器控制器。我们稍后将在 Milvus 服务和 Attu Ingress 中使用此控制器，因此让我们事先安装它。</li>
</ol>
<ul>
<li>首先，添加<code translate="no">eks-charts</code> repo 并更新。</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>然后，安装 AWS 负载平衡器控制器。用群集名称替换<code translate="no">cluster-name</code> 。在前面的步骤中创建 EKS 群集时，已经创建了名为<code translate="no">aws-load-balancer-controller</code> 的 ServiceAccount。</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>验证控制器是否安装成功。</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>输出结果应如下所示：</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">部署 Milvus 群集</h3><p>Milvus 支持多种部署方法，如操作符和 Helm。操作符更简单，但 Helm 更直接、更灵活。本例中我们将使用 Helm 部署 Milvus。</p>
<p>使用 Helm 部署 Milvus 时，可以通过<code translate="no">values.yaml</code> 文件自定义配置。点击<a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a>查看所有选项。默认情况下，Milvus 将集群内的 minio 和 pulsar 分别创建为对象存储和消息存储。我们将对配置进行一些修改，使其更适合生产环境。</p>
<ol>
<li>首先，添加 Milvus Helm repo 并更新它。</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>用以下代码段创建<code translate="no">milvus_cluster.yaml</code> 文件。该代码片段自定义了 Milvus 的配置，例如将 Amazon S3 配置为对象存储，将 Amazon MSK 配置为消息队列。稍后我们将提供详细解释和配置指导。</li>
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
<p>代码包含六个部分。请按照以下说明更改相应配置。</p>
<p><strong>第 1 节</strong>：将 S3 配置为对象存储。serviceAccount 授予 Milvus 访问 S3 的权限（在本例中是<code translate="no">milvus-s3-access-sa</code> ，它是在我们创建 EKS 群集时创建的）。确保将<code translate="no">&lt;region-code&gt;</code> 替换为群集所在的 AWS 区域。将<code translate="no">&lt;bucket-name&gt;</code> 替换为 S3 存储桶的名称，将<code translate="no">&lt;root-path&gt;</code> 替换为 S3 存储桶的前缀（此字段可留空）。</p>
<p><strong>第 2 部分</strong>：将 MSK 配置为消息存储。将<code translate="no">&lt;broker-list&gt;</code> 替换为与 MSK 的 SASL/SCRAM 身份验证类型相对应的端点地址。将<code translate="no">&lt;username&gt;</code> 和<code translate="no">&lt;password&gt;</code> 替换为 MSK 帐户的用户名和密码。您可以从 MSK 客户端信息中获取<code translate="no">&lt;broker-list&gt;</code> ，如下图所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>图 4 将 MSK 配置为 Milvus.png 的消息存储器</span> </span></p>
<p><em>图 4：将 MSK 配置为 Milvus 的信息存储空间</em></p>
<p><strong>第 3 部分：</strong>公开 Milvus 服务并启用群集外部访问。Milvus 端点默认使用 ClusterIP 类型的服务，只能在 EKS 集群内访问。如有需要，可以将其更改为负载平衡器类型，以允许从 EKS 集群外部访问。LoadBalancer 类型服务使用 Amazon NLB 作为负载平衡器。根据安全最佳实践，这里默认将<code translate="no">aws-load-balancer-scheme</code> 配置为内部模式，这意味着只允许内网访问 Milvus。点击<a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">查看 NLB 配置说明</a>。</p>
<p><strong>第 4 部分：</strong>安装和配置开源 milvus 管理工具<a href="https://github.com/zilliztech/attu">Attu</a>。它有一个直观的图形用户界面，可以让你轻松与 Milvus 交互。我们启用 Attu，使用 AWS ALB 配置入口，并将其设置为<code translate="no">internet-facing</code> 类型，这样就可以通过互联网访问 Attu。点击<a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">本文档</a>获取 ALB 配置指南。</p>
<p><strong>第 5 节：</strong>启用 Milvus 核心组件的 HA 部署。Milvus 包含多个独立且解耦的组件。例如，协调器服务作为控制层，负责协调根、查询、数据和索引组件。访问层中的代理作为数据库访问端点。这些组件默认只有一个 pod 复制。为了提高 Milvus 的可用性，部署这些服务组件的多个副本尤为必要。</p>
<p><strong>注意：</strong>根、查询、数据和索引协调器组件的多副本部署需要启用<code translate="no">activeStandby</code> 选项。</p>
<p><strong>第 6 节：</strong>调整 Milvus 组件的资源分配，以满足工作负载的要求。Milvus 网站还提供了一个<a href="https://milvus.io/tools/sizing/">尺寸工具</a>，可根据数据量、向量尺寸、索引类型等生成配置建议。它还可以一键生成 Helm 配置文件。以下配置是该工具针对 100 万 1024 维向量和 HNSW 索引类型给出的建议。</p>
<ol>
<li>使用 Helm 创建 Milvus（部署在命名空间<code translate="no">milvus</code> ）。注：可以用自定义名称替换<code translate="no">&lt;demo&gt;</code> 。</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>运行以下命令检查部署状态。</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>以下输出显示 Milvus 组件都已可用，协调组件已启用多个副本。</p>
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
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">访问和管理 Milvus</h3><p>至此，我们已经成功部署了 Milvus 向量数据库。现在，我们可以通过端点访问 Milvus。Milvus 通过 Kubernetes 服务公开端点。Attu 通过 Kubernetes Ingress 公开端点。</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>访问 Milvus 端点</strong></h4><p>运行以下命令获取服务端点：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>您可以查看多个服务。Milvus 支持两个端口：端口<code translate="no">19530</code> 和端口<code translate="no">9091</code> ：</p>
<ul>
<li><code translate="no">19530</code> 端口用于 gRPC 和 RESTful API。使用不同的 Milvus SDK 或 HTTP 客户端连接 Milvus 服务器时，它是默认端口。</li>
<li><code translate="no">9091</code> 端口是管理端口，用于 Kubernetes 内的度量 Collections、pprof 剖析和健康探针。</li>
</ul>
<p><code translate="no">demo-milvus</code> 服务提供一个数据库访问端点，用于从客户端建立连接。它使用 NLB 作为服务负载平衡器。您可以从<code translate="no">EXTERNAL-IP</code> 列获取服务端点。</p>
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
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>使用 Attu 管理 Milvus</strong></h4><p>如前所述，我们安装了 Attu 来管理 Milvus。运行以下命令获取端点：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>你可以看到一个名为<code translate="no">demo-milvus-attu</code> 的 Ingress，其中<code translate="no">ADDRESS</code> 列是访问 URL。</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>在浏览器中打开 Ingress 地址，看到如下页面。单击<strong>连接</strong>登录。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>图 5 登录您的 Attu 账户.png</span> </span></p>
<p><em>图 5：登录您的 Attu 账户</em></p>
<p>登录后，您可以通过 Attu 管理 Milvus 数据库。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>图 6 Attu 界面.png</span> </span></p>
<p>图 6：Attu 界面</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">测试 Milvus 向量数据库<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>我们将使用 Milvus<a href="https://milvus.io/docs/example_code.md">示例代码</a>来测试 Milvus 数据库是否正常工作。首先，使用以下命令下载<code translate="no">hello_milvus.py</code> 示例代码：</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>修改示例代码中的主机为 Milvus 服务端点。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>运行代码：</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>如果系统返回如下结果，则表明 Milvus 运行正常。</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>本篇文章介绍了最流行的开源向量数据库之一<a href="https://milvus.io/intro">Milvus</a>，并指导如何使用亚马逊 EKS、S3、MSK 和 ELB 等托管服务在 AWS 上部署 Milvus，以实现更高的弹性和可靠性。</p>
<p>作为各种 GenAI 系统（尤其是检索增强生成（RAG））的核心组件，Milvus 支持并集成了各种主流 GenAI 模型和框架，包括 Amazon Sagemaker、PyTorch、HuggingFace、LlamaIndex 和 LangChain。立即使用 Milvus 开始您的 GenAI 创新之旅！</p>
<h2 id="References" class="common-anchor-header">参考资料<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">亚马逊 EKS 用户指南</a></li>
<li><a href="https://milvus.io/">Milvus 官方网站</a></li>
<li><a href="https://github.com/milvus-io/milvus">Milvus GitHub 存储库</a></li>
<li><a href="https://eksctl.io/">eksctl 官方网站</a></li>
</ul>
