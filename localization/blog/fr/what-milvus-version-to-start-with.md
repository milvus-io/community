---
id: what-milvus-version-to-start-with.md
title: What Milvus version to start with
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: >-
  A comprehensive guide to the features and capabilities of each Milvus version
  to make an informed decision for your vector search projects.
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Introduction to the Milvus versions</custom-h1><p>Selecting the appropriate Milvus version is foremost to the success of any project leveraging vector search technology. With different Milvus versions tailored to varying requirements, understanding the importance of selecting the correct version is crucial for achieving the desired results.</p>
<p>The right Milvus version can help a developer to learn and prototype quickly or help optimize resource utilization, streamline development efforts, and ensure compatibility with existing infrastructure and tools. Ultimately, it is about maintaining developer productivity and improving efficiency, reliability, and user satisfaction.</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">Available Milvus versions<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Three versions of Milvus are available for developers, and all are open source. The three versions are Milvus Lite, Milvus Standalone, and Milvus Cluster, which differ in features and how users plan to use Milvus in the short and long term. So, let’s explore these individually.</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>As the name suggests, Milvus Lite is a lightweight version that integrates seamlessly with Google Colab and Jupyter Notebook. It is packaged as a single binary with no additional dependencies, making it easy to install and run on your machine or embed in Python applications. Additionally, Milvus Lite includes a CLI-based Milvus standalone server, providing flexibility for running it directly on your machine. Whether you embed it within your Python code or utilize it as a standalone server is entirely up to your preference and specific application requirements.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Features and Capabilities</h3><p>Milvus Lite includes all core Milvus vector search features.</p>
<ul>
<li><p><strong>Search Capabilities</strong>: Supports top-k, range, and hybrid searches, including metadata filtering, to cater to diverse search requirements.</p></li>
<li><p><strong>Index Types and Similarity Metrics</strong>: Offers support for 11 index types and five similarity metrics, providing flexibility and customization options for your specific use case.</p></li>
<li><p><strong>Data Processing</strong>: Enables batch (Apache Parquet, Arrays, JSON) and stream processing, with seamless integration through connectors for Airbyte, Apache Kafka, and Apache Spark.</p></li>
<li><p><strong>CRUD Operations</strong>: Offers full CRUD support (create, read, update/upsert, delete), empowering users with comprehensive data management capabilities.</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">Applications and limitations</h3><p>Milvus Lite is ideal for rapid prototyping and local development, offering support for quick setup and experimentation with small-scale datasets on your machine. However, its limitations become apparent when transitioning to production environments with larger datasets and more demanding infrastructure requirements. As such, while Milvus Lite is an excellent tool for initial exploration and testing, it may not be suitable for deploying applications in high-volume or production-ready settings.</p>
<h3 id="Available-Resources" class="common-anchor-header">Available Resources</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">Documentation</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Github Repository</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Google Colab Example</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">Getting Started Video</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus offers two operational modes: Standalone and Cluster. Both modes are identical in core vector database features and differ in data size support and scalability requirements. This distinction allows you to select the mode that best aligns with your dataset size, traffic volume, and other infrastructure requirements for production.</p>
<p>Milvus Standalone is a mode of operation for the Milvus vector database system where it operates independently as a single instance without any clustering or distributed setup. Milvus runs on a single server or machine in this mode, providing functionalities such as indexing and searching for vectors. It is suitable for situations where the data and traffic volume scale is relatively small and does not require the distributed capabilities provided by a clustered setup.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Features and Capabilities</h3><ul>
<li><p><strong>High Performance</strong>: Conduct vector searches on massive datasets (billions or more) with exceptional speed and efficiency.</p></li>
<li><p><strong>Search Capabilities</strong>: Supports top-k, range, and hybrid searches, including metadata filtering, to cater to diverse search requirements.</p></li>
<li><p><strong>Index Types and Similarity Metrics</strong>: Offers support for 11 index types and 5 similarity metrics, providing flexibility and customization options for your specific use case.</p></li>
<li><p><strong>Data Processing</strong>: Enables both batch (Apache Parquet, Arrays, Json) and stream processing, with seamless integration through connectors for Airbyte, Apache Kafka, and Apache Spark.</p></li>
<li><p><strong>Scalability</strong>: Achieve dynamic scalability with component-level scaling, allowing for seamless scaling up and down based on demand. Milvus can autoscale at a component level, optimizing resource allocation for enhanced efficiency.</p></li>
<li><p><strong>Multi-Tenancy</strong>: Supports multi-tenancy with the capability to manage up to 10,000 collections/partitions in a cluster, providing efficient resource utilization and isolation for different users or applications.</p></li>
<li><p><strong>CRUD Operations</strong>: Offers full CRUD support (create, read, update/upsert, delete), empowering users with comprehensive data management capabilities.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Essential components:</h3><ul>
<li><p>Milvus: The core functional component.</p></li>
<li><p>etcd: The metadata engine responsible for accessing and storing metadata from Milvus’ internal components, including proxies, index nodes, and more.</p></li>
<li><p>MinIO: The storage engine responsible for data persistence within Milvus.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 1: Milvus Standalone Architecture</p>
<h3 id="Available-Resources" class="common-anchor-header">Available Resources</h3><ul>
<li><p>Documentation</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Environment Checklist for Milvus with Docker Compose</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">Install Milvus Standalone with Docker</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Github Repository</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvus Cluster<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Cluster is a mode of operation for the Milvus vector database system where it operates and is distributed across multiple nodes or servers. In this mode, Milvus instances are clustered together to form a unified system that can handle larger volumes of data and higher traffic loads compared to a standalone setup. Milvus Cluster offers scalability, fault tolerance, and load balancing features, making it suitable for scenarios that need to handle big data and serve many concurrent queries efficiently.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Features and Capabilities</h3><ul>
<li><p>Inherits all features available in Milvus Standalone, including high-performance vector search, support for multiple index types and similarity metrics, and seamless integration with batch and stream processing frameworks.</p></li>
<li><p>Offers unparalleled availability, performance, and cost optimization by leveraging distributed computing and load balancing across multiple nodes.</p></li>
<li><p>Enables deploying and scaling secure, enterprise-grade workloads with lower total costs by efficiently utilizing resources across the cluster and optimizing resource allocation based on workload demands.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Essential components:</h3><p>Milvus Cluster includes eight microservice components and three third-party dependencies. All microservices can be deployed on Kubernetes independently from each other.</p>
<h4 id="Microservice-components" class="common-anchor-header">Microservice components</h4><ul>
<li><p>Root coord</p></li>
<li><p>Proxy</p></li>
<li><p>Query coord</p></li>
<li><p>Query node</p></li>
<li><p>Index coord</p></li>
<li><p>Index node</p></li>
<li><p>Data coord</p></li>
<li><p>Data node</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">Third-party dependencies</h4><ul>
<li><p>etcd: Stores metadata for various components in the cluster.</p></li>
<li><p>MinIO: Responsible for data persistence of large files in the cluster, such as index and binary log files.</p></li>
<li><p>Pulsar: Manages logs of recent mutation operations, outputs streaming log, and provides log publish-subscribe services.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 2: Milvus Cluster Architecture</p>
<h4 id="Available-Resources" class="common-anchor-header">Available Resources</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Documentation</a> | How to get started</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Install Milvus Cluster with Milvus Operator</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">Install Milvus Cluster with Helm</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">How to scale a Milvus Cluster</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Github Repository</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">Making the Decision on which Milvus version to use<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>When deciding which version of Milvus to use for your project, you must consider factors such as your dataset size, traffic volume, scalability requirements, and production environment constraints. Milvus Lite is perfect for prototyping on your laptop. Milvus Standalone offers high performance and flexibility for conducting vector searches on your datasets, making it suitable for smaller-scale deployments, CI/CD, and offline deployments when you have no Kubernetes support… And finally, Milvus Cluster provides unparalleled availability, scalability, and cost optimization for enterprise-grade workloads, making it the preferred choice for large-scale, highly available production environments.</p>
<p>There is another version that is a hassle-free version, and that is a managed version of Milvus called <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>.</p>
<p>Ultimately, the Milvus version will depend on your specific use case, infrastructure requirements, and long-term goals. By carefully evaluating these factors and understanding the features and capabilities of each version, you can make an informed decision that aligns with your project’s needs and objectives. Whether you choose Milvus Standalone or Milvus Cluster, you can leverage the power of vector databases to enhance the performance and efficiency of your AI applications.</p>
