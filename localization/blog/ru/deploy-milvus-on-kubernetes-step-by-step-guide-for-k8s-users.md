---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: 'Deploying Milvus on Kubernetes: A Step-by-Step Guide for Kubernetes Users'
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  This guide will provide a clear, step-by-step walkthrough for setting up
  Milvus on Kubernetes using the Milvus Operator.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a> is an open-source <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> designed to store, index, and search massive amounts of <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstructured data</a> through vector representations, making it perfect for AI-driven applications, such as similarity search, <a href="https://zilliz.com/glossary/semantic-search">semantic search</a>, retrieval augmented generation (<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>), recommendation engines, and other machine learning tasks.</p>
<p>But what makes Milvus even more powerful is its seamless integration with Kubernetes. If you’re a Kubernetes aficionado, you know the platform is perfect for orchestrating scalable, distributed systems. Milvus takes full advantage of Kubernetes’ capabilities, allowing you to easily deploy, scale, and manage distributed Milvus clusters. This guide will provide a clear, step-by-step walkthrough for setting up Milvus on Kubernetes using the Milvus Operator.</p>
<h2 id="Prerequisites" class="common-anchor-header">Prerequisites<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Before we begin, ensure you have the following prerequisites in place:</p>
<ul>
<li><p>A Kubernetes cluster up and running. If you’re testing locally, <code translate="no">minikube</code> is a great choice.</p></li>
<li><p><code translate="no">kubectl</code> installed and configured to interact with your Kubernetes cluster.</p></li>
<li><p>Familiarity with basic Kubernetes concepts like pods, services, and deployments.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">Step 1: Installing Minikube (For Local Testing)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>If you need to set up a local Kubernetes environment, <code translate="no">minikube</code> is the tool for you. Official installation instructions are on the <a href="https://minikube.sigs.k8s.io/docs/start/">minikube getting started page</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. Install Minikube</h3><p>Visit the<a href="https://github.com/kubernetes/minikube/releases"> minikube releases page</a> and download the appropriate version for your operating system. For macOS/Linux, you can use the following command:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. Start Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. Interact with Cluster</h3><p>Now, you can interact with your clusters with the kubectl inside minikube. If you haven’t installed kubectl, minikube will download the appropriate version by default.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>Alternatively, you can create a symbolic link to minikube’s binary named <code translate="no">kubectl</code> for easier usage.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">Step 2: Configuring the StorageClass<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>In Kubernetes, a <strong>StorageClass</strong> defines the types of storage available for your workloads, providing flexibility in managing different storage configurations. Before proceeding, you must ensure a default StorageClass is available in your cluster. Here’s how to check and configure one if necessary.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. Check Installed StorageClasses</h3><p>To see the available StorageClasses in your Kubernetes cluster, run the following command:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>This will display the list of storage classes installed in your cluster. If a default StorageClass is already configured, it will be marked with <code translate="no">(default)</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. Configure a Default StorageClass (if necessary)</h3><p>If no default StorageClass is set, you can create one by defining it in a YAML file. Use the following example to create a default StorageClass:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>This YAML configuration defines a <code translate="no">StorageClass</code> called <code translate="no">default-storageclass</code> that uses the <code translate="no">minikube-hostpath</code> provisioner, commonly used in local development environments.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. Apply the StorageClass</h3><p>Once the <code translate="no">default-storageclass.yaml</code> file is created, apply it to your cluster using the following command:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>This will set up the default StorageClass for your cluster, ensuring that your storage needs are properly managed in the future.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">Step 3: Installing Milvus Using the Milvus Operator<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>The Milvus Operator simplifies deploying Milvus on Kubernetes, managing the deployment, scaling, and updates. Before installing the Milvus Operator, you’ll need to install the <strong>cert-manager</strong>, which provides certificates for the webhook server used by the Milvus Operator.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. Install cert-manager</h3><p>Milvus Operator requires a <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a> to manage certificates for secure communication. Make sure you install <strong>cert-manager version 1.1.3</strong> or later. To install it, run the following command:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>After the installation, verify that the cert-manager pods are running by executing:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. Install the Milvus Operator</h3><p>Once the cert-manager is up and running, you can install the Milvus Operator. Run the following command to deploy it using <code translate="no">kubectl</code>:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>You can check if the Milvus Operator pod is running using the following command:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Deploy Milvus Cluster</h3><p>Once the Milvus Operator pod is running, you can deploy a Milvus cluster with the operator. The following command deploys a Milvus cluster with its components and dependencies in separate pods using default configurations:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>To customize the Milvus settings, you will need to replace the YAML file with your own configuration YAML file. In addition to manually editing or creating the file, you can use the Milvus Sizing Tool to adjust the configurations and then download the corresponding YAML file.</p>
<p>Alternatively, you can use the <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> for a more streamlined approach. This tool allows you to adjust various settings, such as resource allocation and storage options, and then download the corresponding YAML file with your desired configurations. This ensures that your Milvus deployment is optimized for your specific use case.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure: Milvus sizing tool</p>
<p>It may take some time to finish the deployment. You can check the status of your Milvus cluster via the command:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Once your Milvus cluster is ready, all pods in the Milvus cluster should be running or completed:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">Step 4: Accessing Your Milvus Cluster<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Once your Milvus cluster is deployed, you need to access it by forwarding a local port to the Milvus service port. Follow these steps to retrieve the service port and set up port forwarding.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. Get the Service Port</strong></h4><p>First, identify the service port by using the following command. Replace <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> with the name of your Milvus proxy pod, which typically starts with <code translate="no">my-release-milvus-proxy-</code>:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>This command will return the port number that your Milvus service is using.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. Forward the Port</strong></h4><p>To access your Milvus cluster locally, forward a local port to the service port using the following command. Replace <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> with the local port you want to use and <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> with the service port retrieved in the previous step:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>This command allows port-forwarding to listen on all IP addresses of the host machine. If you only need the service to listen on <code translate="no">localhost</code>, you can omit the <code translate="no">--address 0.0.0.0</code> option.</p>
<p>Once the port-forwarding is set up, you can access your Milvus cluster via the specified local port for further operations or integrations.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">Step 5: Connecting to Milvus Using Python SDK<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>With your Milvus cluster up and running, you can now interact with it using any Milvus SDK. In this example, we’ll use <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus</a>, Milvus’s <strong>Python SDK,</strong>  to connect to the cluster and perform basic operations.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. Install PyMilvus</h3><p>To interact with Milvus via Python, you need to install the <code translate="no">pymilvus</code> package:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Connect to Milvus</h3><p>The following is a sample Python script that connects to your Milvus cluster and demonstrates how to perform basic operations such as creating a collection.</p>
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
<h4 id="Explanation" class="common-anchor-header">Explanation:</h4><ul>
<li><p>Connect to Milvus: The script connects to the Milvus server running on <code translate="no">localhost</code> using the local port you set up in Step 4.</p></li>
<li><p>Create a Collection: It checks if a collection named <code translate="no">example_collection</code> already exists, drops it if so, and then creates a new collection with vectors of 768 dimensions.</p></li>
</ul>
<p>This script establishes a connection to the Milvus cluster and creates a collection, serving as a starting point for more complex operations like inserting vectors and performing similarity searches.</p>
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
    </button></h2><p>Deploying Milvus in a distributed setup on Kubernetes unlocks powerful capabilities for managing large-scale vector data, enabling seamless scalability and high-performance AI-driven applications. Following this guide, you’ve learned how to set up Milvus using the Milvus Operator, making the process streamlined and efficient.</p>
<p>As you continue to explore Milvus, consider scaling your cluster to meet growing demands or deploying it on cloud platforms such as Amazon EKS, Google Cloud, or Microsoft Azure. For enhanced management and monitoring, tools like <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a>, and <a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> offer valuable support for maintaining the health and performance of your deployments.</p>
<p>You’re now ready to harness the full potential of Milvus on Kubernetes—happy deploying! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">Further Resources<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Milvus Documentation</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed: Which Mode is Right for You? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">Supercharging Vector Search: Milvus on GPUs with NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">What is RAG? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Generative AI Resource Hub | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Top Performing AI Models for Your GenAI Apps | Zilliz</a></p></li>
</ul>
