---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: How to Deploy the Open-Source Milvus Vector Database on Amazon EKS
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  A step-by-step guide on deploying the Milvus vector database on AWS using
  managed services such as Amazon EKS, S3, MSK, and ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>This post was originally published on the <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>AWS website</em></a> and is translated, edited, and reposted here with permission.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">An Overview of Vector Embeddings and Vector Databases<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>The rise of <a href="https://zilliz.com/learn/generative-ai">Generative AI (GenAI)</a>, particularly large language models (<a href="https://zilliz.com/glossary/large-language-models-(llms)">LLMs</a>), has significantly boosted interest in <a href="https://zilliz.com/learn/what-is-vector-database">vector databases</a>, establishing them as an essential component within the GenAI ecosystem. As a result, vector databases are being adopted in increasing <a href="https://milvus.io/use-cases">use cases</a>.</p>
<p>An <a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">IDC Report</a> predicts that by 2025, over 80% of business data will be unstructured, existing in formats such as text, images, audio, and videos. Understanding, processing, storing, and querying this vast amount of <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstructured data</a> at scale presents a significant challenge. The common practice in GenAI and deep learning is to transform unstructured data into vector embeddings, store, and index them in a vector database like <a href="https://milvus.io/intro">Milvus</a> or <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (the fully managed Milvus) for <a href="https://zilliz.com/learn/vector-similarity-search">vector similarity</a> or semantic similarity searches.</p>
<p>But what exactly are <a href="https://zilliz.com/glossary/vector-embeddings">vector embeddings</a>? Simply put, they are numerical representations of floating-point numbers in a high-dimensional space. The <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">distance between two vectors</a> indicates their relevance: the closer they are, the more relevant they are to each other, and vice versa. This means that similar vectors correspond to similar original data, which differs from traditional keyword or exact searches.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
    <span>How to perform a vector similarity search</span>
  </span>
</p>
<p><em>Figure 1:  How to perform a vector similarity search</em></p>
<p>The ability to store, index, and search vector embeddings is the core functionality of vector databases. Currently, mainstream vector databases fall into two categories. The first category extends existing relational database products, such as Amazon OpenSearch Service with the <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> plugin and Amazon RDS for <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> with the pgvector extension. The second category comprises specialized vector database products, including well-known examples like Milvus, Zilliz Cloud (the fully managed Milvus), <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a>, and <a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a>.</p>
<p>Embedding techniques and vector databases have broad applications across various <a href="https://zilliz.com/vector-database-use-cases">AI-driven use cases</a>, including image similarity search, video deduplication and analysis, natural language processing, recommendation systems, targeted advertising, personalized search, intelligent customer service, and fraud detection.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a> is one of the most popular open-source options among the numerous vector databases. This post introduces Milvus and explores the practice of deploying Milvus on AWS EKS.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">What is Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a> is a highly flexible, reliable, and blazing-fast cloud-native, open-source vector database. It powers vector similarity search and AI applications and strives to make vector databases accessible to every organization. Milvus can store, index, and manage a billion+ vector embeddings generated by deep neural networks and other machine learning (ML) models.</p>
<p>Milvus was released under the <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">open-source Apache License 2.0</a> in October 2019. It is currently a graduate project under <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. At the time of writing this blog, Milvus had reached more than <a href="https://hub.docker.com/r/milvusdb/milvus">50 million Docker pull</a> downloads and was used by <a href="https://milvus.io/">many customers</a>, such as NVIDIA, AT&amp;T, IBM, eBay, Shopee, and Walmart.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Milvus Key Features</h3><p>As a cloud-native vector database, Milvus boasts the following key features:</p>
<ul>
<li><p>High performance and millisecond search on billion-scale vector datasets.</p></li>
<li><p>Multi-language support and toolchain.</p></li>
<li><p>Horizontal scalability and high reliability even in the event of a disruption.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">Hybrid search</a>, achieved by pairing scalar filtering with vector similarity search.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus Architecture</h3><p>Milvus follows the principle of separating data flow and control flow. The system breaks down into four levels, as shown in the diagram:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
    <span>Milvus Architecture</span>
  </span>
</p>
<p><em>Figure 2 Milvus Architecture</em></p>
<ul>
<li><p><strong>Access layer:</strong> The access layer is composed of a group of stateless proxies and serves as the system’s front layer and endpoint to users.</p></li>
<li><p><strong>Coordinator service:</strong> The coordinator service assigns tasks to the worker nodes.</p></li>
<li><p><strong>Worker nodes:</strong> The worker nodes are dumb executors that follow instructions from the coordinator service and execute user-triggered DML/DDL commands.</p></li>
<li><p><strong>Storage:</strong> Storage is responsible for data persistence. It comprises a meta storage, log broker, and object storage.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus Deployment Options</h3><p>Milvus supports three running modes: <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, Standalone, and Distributed</a>.</p>
<ul>
<li><p><strong>Milvus Lite</strong> is a Python library that can be imported into local applications. As a lightweight version of Milvus, it is ideal for quick prototyping in Jupyter Notebooks or running on smart devices with limited resources.</p></li>
<li><p><strong>Milvus Standalone i</strong>s a single-machine server deployment. If you have a production workload but prefer not to use Kubernetes, running Milvus Standalone on a single machine with sufficient memory is a good option.</p></li>
<li><p><strong>Milvus Distributed</strong> can be deployed on Kubernetes clusters. It supports larger datasets, higher availability, and scalability, and is more suitable for production environments.</p></li>
</ul>
<p>Milvus is designed from the start to support Kubernetes, and can be easily deployed on AWS. We can use Amazon Elastic Kubernetes Service (Amazon EKS) as the managed Kubernetes, Amazon S3 as the Object Storage, Amazon Managed Streaming for Apache Kafka (Amazon MSK) as the Message storage, and Amazon Elastic Load Balancing (Amazon ELB) as the Load Balancer to build a reliable, elastic Milvus database cluster.</p>
<p>Next, we’ll provide step-by-step guidance on deploying a Milvus cluster using EKS and other services.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">Deploying Milvus on AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prerequisites</h3><p>We’ll use AWS CLI to create an EKS cluster and deploy a Milvus database. The following prerequisites are required:</p>
<ul>
<li><p>A PC/Mac or Amazon EC2 instance with<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> installed and configured with appropriate permissions. The AWS CLI tools are installed by default if you use Amazon Linux 2 or Amazon Linux 2023.</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">EKS tools installed</a>, including Helm, Kubectl, eksctl, etc.</p></li>
<li><p>An Amazon S3 bucket.</p></li>
<li><p>An Amazon MSK instance.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">Considerations when creating MSK</h3><ul>
<li>The latest stable version of Milvus (v2.3.13) depends on Kafka’s <code translate="no">autoCreateTopics</code> feature. So when creating MSK, we need to use a custom configuration and change the <code translate="no">auto.create.topics.enable</code> property from the default <code translate="no">false</code> to <code translate="no">true</code>. In addition, to increase the message throughput of MSK, it is recommended that the values of <code translate="no">message.max.bytes</code> and <code translate="no">replica.fetch.max.bytes</code> be increased. See <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">Custom MSK configurations</a> for details.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus does not support MSK’s IAM role-based authentication. So, when creating MSK, enable <code translate="no">SASL/SCRAM authentication</code> option in the security configuration, and configure <code translate="no">username</code> and <code translate="no">password</code> in the AWS Secrets Manager. See <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">Sign-in credentials authentication with AWS Secrets Manager</a> for details.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
    <span>Figure 3 Security settings enable SASL SCRAM authentication.png</span>
  </span>
</p>
<p><em>Figure 3: Security settings: enable SASL/SCRAM authentication</em></p>
<ul>
<li>We need to enable access to the MSK security group from the EKS cluster’s security group or IP address range.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">Creating an EKS Cluster</h3><p>There are many ways to create an EKS cluster, such as via the console, CloudFormation, eksctl, etc. This post will show how to create an EKS cluster using eksctl.</p>
<p><code translate="no">eksctl</code> is a simple command-line tool for creating and managing Kubernetes clusters on Amazon EKS. It provides the fastest and easiest way to create a new cluster with nodes for Amazon EKS. See eksctl’s <a href="https://eksctl.io/">website</a> for more information.</p>
<ol>
<li>First, create an <code translate="no">eks_cluster.yaml</code> file with the following code snippet. Replace <code translate="no">cluster-name</code> with your cluster name, replace <code translate="no">region-code</code> with the AWS region where you want to create the cluster and replace <code translate="no">private-subnet-idx</code> with your private subnets.
Note: This configuration file creates an EKS cluster in an existing VPC by specifying private subnets. If you want to create a new VPC, remove the VPC and subnets configuration, and then the <code translate="no">eksctl</code> will automatically create a new one.</li>
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
<li>Then, run the <code translate="no">eksctl</code> command to create the EKS cluster.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>This command will create the following resources:</p>
<ul>
<li><p>An EKS cluster with the specified version.</p></li>
<li><p>A managed node group with three m6i.2xlarge EC2 instances.</p></li>
<li><p>An <a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">IAM OIDC identity provider</a> and a ServiceAccount called <code translate="no">aws-load-balancer-controller</code>, which we will use later when installing the <strong>AWS Load Balancer Controller</strong>.</p></li>
<li><p>A namespace <code translate="no">milvus</code> and a ServiceAccount <code translate="no">milvus-s3-access-sa</code> within this namespace. This namespace will be used later when configuring S3 as the object storage for Milvus.</p>
<p>Note: For simplicity, the <code translate="no">milvus-s3-access-sa</code> here is granted full S3 access permissions. In production deployments, it’s recommended to follow the principle of least privilege and only grant access to the specific S3 bucket used for Milvus.</p></li>
<li><p>Multiple add-ons, where <code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> are core add-ons required by EKS. <code translate="no">aws-ebs-csi-driver</code> is the AWS EBS CSI driver that allows EKS clusters to manage the lifecycle of Amazon EBS volumes.</p></li>
</ul>
<p>Now, we just need to wait for the cluster creation to complete.</p>
<p>Wait for the cluster creation to complete. During the cluster creation process, the <code translate="no">kubeconfig</code> file will be automatically created or updated. You can also manually update it by running the following command. Make sure to replace <code translate="no">region-code</code> with the AWS region where your cluster is being created, and replace <code translate="no">cluster-name</code> with the name of your cluster.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Once the cluster is created, you can view nodes by running:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Create a <code translate="no">ebs-sc</code> StorageClass configured with GP3 as the storage type, and set it as the default StorageClass. Milvus uses etcd as its Meta Storage and needs this StorageClass to create and manage PVCs.</li>
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
<p>Then, set the original <code translate="no">gp2</code> StorageClass to non-default:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Install the AWS Load Balancer Controller. We will use this controller later for the Milvus Service and Attu Ingress, so let’s install it beforehand.</li>
</ol>
<ul>
<li>First, add the <code translate="no">eks-charts</code> repo and update it.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Next, install the AWS Load Balancer Controller. Replace <code translate="no">cluster-name</code> with your cluster name. The ServiceAccount named <code translate="no">aws-load-balancer-controller</code> was already created when we created the EKS cluster in previous steps.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Verify if the controller was installed successfully.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>The output should look like:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Deploying a Milvus Cluster</h3><p>Milvus supports multiple deployment methods, such as Operator and Helm. Operator is simpler, but Helm is more direct and flexible. We’ll use Helm to deploy Milvus in this example.</p>
<p>When deploying Milvus with Helm, you can customize the configuration via the <code translate="no">values.yaml</code> file. Click <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a> to view all the options. By default, Milvus creates in-cluster minio and pulsar as the Object Storage and Message Storage, respectively. We will make some configuration changes to make it more suitable for production.</p>
<ol>
<li>First, add the Milvus Helm repo and update it.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Create a <code translate="no">milvus_cluster.yaml</code> file with the following code snippet. This code snippet customizes Milvus’s configuration, such as configuring Amazon S3 as the object storage and Amazon MSK as the message queue. We’ll provide detailed explanations and configuration guidance later.</li>
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
<p>The code contains six sections. Follow the following instructions to change the corresponding configurations.</p>
<p><strong>Section 1</strong>: Configure S3 as Object Storage. The serviceAccount grants Milvus access to S3 (in this case, it is <code translate="no">milvus-s3-access-sa</code>, which was created when we created the EKS cluster). Make sure to replace <code translate="no">&lt;region-code&gt;</code> with the AWS region where your cluster is located. Replace <code translate="no">&lt;bucket-name&gt;</code> with the name of your S3 bucket and <code translate="no">&lt;root-path&gt;</code> with the prefix for the S3 bucket (this field can be left empty).</p>
<p><strong>Section 2</strong>: Configure MSK as Message Storage. Replace <code translate="no">&lt;broker-list&gt;</code> with the endpoint addresses corresponding to the SASL/SCRAM authentication type of MSK. Replace <code translate="no">&lt;username&gt;</code> and <code translate="no">&lt;password&gt;</code> with the MSK account username and password. You can get the <code translate="no">&lt;broker-list&gt;</code> from MSK client information, as shown in the image below.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
    <span>Figure 4 Configure MSK as the Message Storage of Milvus.png</span>
  </span>
</p>
<p><em>Figure 4: Configure MSK as the Message Storage of Milvus</em></p>
<p><strong>Section 3:</strong> Expose Milvus service and enable access from outside the cluster. Milvus endpoint used ClusterIP type service by default, which is only accessible within the EKS cluster. If needed, you can change it to LoadBalancer type to allow access from outside the EKS cluster. The LoadBalancer type Service uses Amazon NLB as the load balancer. According to security best practices, <code translate="no">aws-load-balancer-scheme</code> is configured as internal mode by default here, which means only intranet access to Milvus is allowed. Click to <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">view the NLB configuration instructions</a>.</p>
<p><strong>Section 4:</strong> Install and configure <a href="https://github.com/zilliztech/attu">Attu</a>, an open-source milvus administration tool. It has an intuitive GUI that allows you to easily interact with Milvus. We enable Attu, configure ingress using AWS ALB, and set it to <code translate="no">internet-facing</code> type so that Attu can be accessed via the Internet. Click <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">this document</a> for the guide to ALB configuration.</p>
<p><strong>Section 5:</strong> Enable HA deployment of Milvus Core Components. Milvus contains multiple independent and decoupled components. For example, the coordinator service acts as the control layer, handling coordination for the Root, Query, Data, and Index components. The Proxy in the access layer serves as the database access endpoint. These components default to only 1 pod replica. Deploying multiple replicas of these service components is especially necessary to improve Milvus availability.</p>
<p><strong>Note:</strong> The multi-replica deployment of the Root, Query, Data, and Index coordinator components requires the <code translate="no">activeStandby</code> option enabled.</p>
<p><strong>Section 6:</strong> Adjust resource allocation for Milvus components to meet your workloads’ requirements. The Milvus website also provides a <a href="https://milvus.io/tools/sizing/">sizing tool</a> to generate configuration suggestions based on data volume, vector dimensions, index types, etc. It can also generate a Helm configuration file with just one click. The following configuration is the suggestion given by the tool for 1 million 1024 dimensions vectors and HNSW index type.</p>
<ol>
<li>Use Helm to create Milvus (deployed in namespace <code translate="no">milvus</code>). Note: You can replace <code translate="no">&lt;demo&gt;</code> with a custom name.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Run the following command to check the deployment status.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>The following output shows that Milvus components are all AVAILABLE, and coordination components have multiple replicas enabled.</p>
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
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Accessing and Managing Milvus</h3><p>So far, we have successfully deployed the Milvus vector database. Now, we can access Milvus through endpoints. Milvus exposes endpoints via Kubernetes services. Attu exposes endpoints via Kubernetes Ingress.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Accessing Milvus endpoints</strong></h4><p>Run the following command to get service endpoints:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>You can view several services. Milvus supports two ports, port <code translate="no">19530</code> and port <code translate="no">9091</code>:</p>
<ul>
<li>Port <code translate="no">19530</code> is for gRPC and RESTful API. It is the default port when you connect to a Milvus server with different Milvus SDKs or HTTP clients.</li>
<li>Port <code translate="no">9091</code> is a management port for metrics collection, pprof profiling, and health probes within Kubernetes.</li>
</ul>
<p>The <code translate="no">demo-milvus</code> service provides a database access endpoint, which is used to establish a connection from clients. It uses NLB as the service load balancer. You can get the service endpoint from the <code translate="no">EXTERNAL-IP</code> column.</p>
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
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Managing Milvus using Attu</strong></h4><p>As described before, we have installed Attu to manage Milvus. Run the following command to get the endpoint:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>You can see an Ingress called <code translate="no">demo-milvus-attu</code>, where the <code translate="no">ADDRESS</code> column is the access URL.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Open the Ingress address in a browser and see the following page. Click <strong>Connect</strong> to log in.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
    <span>Figure 5 Log in to your Attu account.png</span>
  </span>
</p>
<p><em>Figure 5: Log in to your Attu account</em></p>
<p>After logging in, you can manage Milvus databases through Attu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
    <span>Figure 6 The Attu interface.png</span>
  </span>
</p>
<p>Figure 6: The Attu interface</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Testing the Milvus vector database<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>We will use the Milvus <a href="https://milvus.io/docs/example_code.md">example code</a> to test if the Milvus database is working properly. First, download the <code translate="no">hello_milvus.py</code> example code using the following command:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modify the host in the example code to the Milvus service endpoint.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Run the code:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>If the system returns the following result, then it indicates that Milvus is running normally.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>This post introduces <a href="https://milvus.io/intro">Milvus</a>, one of the most popular open-source vector databases, and provides a guide on deploying Milvus on AWS using managed services such as Amazon EKS, S3, MSK, and ELB to achieve greater elasticity and reliability.</p>
<p>As a core component of various GenAI systems, particularly Retrieval Augmented Generation (RAG), Milvus supports and integrates with a variety of mainstream GenAI models and frameworks, including Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex, and LangChain. Start your GenAI innovation journey with Milvus today!</p>
<h2 id="References" class="common-anchor-header">References<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Amazon EKS User Guide</a></li>
<li><a href="https://milvus.io/">Milvus Official Website</a></li>
<li><a href="https://github.com/milvus-io/milvus">Milvus GitHub Repository</a></li>
<li><a href="https://eksctl.io/">eksctl Official Website</a></li>
</ul>
