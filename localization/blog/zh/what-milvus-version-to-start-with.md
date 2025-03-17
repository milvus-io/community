---
id: what-milvus-version-to-start-with.md
title: 从哪个版本的 Milvus 开始
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: 全面介绍 Milvus 各个版本的特点和功能，为您的向量搜索项目做出明智的决定。
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Milvus 版本介绍</custom-h1><p>选择合适的 Milvus 版本是任何利用向量搜索技术的项目取得成功的关键。不同的 Milvus 版本可满足不同的需求，了解选择正确版本的重要性对于实现预期结果至关重要。</p>
<p>正确的 Milvus 版本可以帮助开发人员快速学习和建立原型，或帮助优化资源利用、简化开发工作，并确保与现有基础设施和工具的兼容性。归根结底，这是为了保持开发人员的生产力，提高效率、可靠性和用户满意度。</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">Milvus 可用版本<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 有三个版本可供开发人员使用，并且都是开源的。这三个版本分别是 Milvus Lite、Milvus Standalone 和 Milvus Cluster，它们在功能和用户计划短期和长期使用 Milvus 的方式上有所不同。因此，让我们逐一探讨。</p>
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
    </button></h2><p>顾名思义，Milvus Lite 是与 Google Colab 和 Jupyter Notebook 无缝集成的轻量级版本。它被打包成一个二进制文件，没有额外的依赖关系，因此很容易在机器上安装和运行，或嵌入到 Python 应用程序中。此外，Milvus Lite 还包括一个基于 CLI 的 Milvus Standalone 服务器，为直接在机器上运行它提供了灵活性。是将其嵌入 Python 代码中，还是将其作为独立服务器使用，完全取决于您的偏好和具体应用要求。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">特点和功能</h3><p>Milvus Lite 包含 Milvus 向量搜索的所有核心功能。</p>
<ul>
<li><p><strong>搜索功能</strong>：支持 top-k、范围和混合搜索，包括元数据过滤，以满足不同的搜索要求。</p></li>
<li><p><strong>索引类型和相似度指标</strong>：支持 11 种索引类型和 5 种相似度指标，为您的特定用例提供灵活性和定制选项。</p></li>
<li><p><strong>数据处理</strong>：支持批处理（Apache Parquet、数组、JSON）和流处理，并通过 Airbyte、Apache Kafka 和 Apache Spark 连接器实现无缝集成。</p></li>
<li><p><strong>CRUD 操作符</strong>：提供全面的 CRUD 支持（创建、读取、更新/上载、删除），赋予用户全面的数据管理能力。</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">应用和限制</h3><p>Milvus Lite 是快速原型开发和本地开发的理想选择，为在机器上快速设置和实验小规模数据集提供支持。然而，当过渡到具有较大数据集和更高基础设施要求的生产环境时，其局限性就显而易见了。因此，虽然 Milvus Lite 是初步探索和测试的绝佳工具，但它可能不适合在大容量或生产就绪的环境中部署应用程序。</p>
<h3 id="Available-Resources" class="common-anchor-header">可用资源</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">文档</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Github 存储库</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">谷歌 Colab 示例</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">入门视频</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus 单机版<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 提供两种操作模式：独立模式和集群模式。这两种模式的核心向量数据库功能相同，但在数据规模支持和可扩展性要求方面有所不同。这种区别使您可以选择最符合您的数据集大小、流量和其他生产基础设施要求的模式。</p>
<p>Milvus Standalone 是 Milvus 向量数据库系统的一种操作模式，它作为单一实例独立操作，没有任何集群或分布式设置。在这种模式下，Milvus 在单个服务器或机器上运行，提供索引和向量搜索等功能。它适用于数据和流量规模相对较小，不需要集群设置提供的分布式功能的情况。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">特点和功能</h3><ul>
<li><p><strong>高性能</strong>：在海量数据集（数十亿或更多）上进行向量搜索，速度快，效率高。</p></li>
<li><p><strong>搜索功能</strong>：支持 top-k、范围和混合搜索，包括元数据过滤，以满足不同的搜索要求。</p></li>
<li><p><strong>索引类型和相似度指标</strong>：支持 11 种索引类型和 5 种相似度指标，为您的特定用例提供灵活性和定制选项。</p></li>
<li><p><strong>数据处理</strong>：支持批处理（Apache Parquet、数组、Json）和流处理，并通过 Airbyte、Apache Kafka 和 Apache Spark 连接器实现无缝集成。</p></li>
<li><p><strong>可扩展性</strong>：通过组件级扩展实现动态可扩展性，可根据需求进行无缝上下扩展。Milvus 可在组件级自动扩展，优化资源分配，提高效率。</p></li>
<li><p><strong>多租户</strong>：支持多租户，能够在一个集群中管理多达 10,000 个 Collections/分区，为不同用户或应用提供高效的资源利用和隔离。</p></li>
<li><p><strong>CRUD 操作符</strong>：提供全面的 CRUD 支持（创建、读取、更新/上载、删除），赋予用户全面的数据管理能力。</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">基本组件</h3><ul>
<li><p>Milvus：核心功能组件。</p></li>
<li><p>etcd：元数据引擎，负责访问和存储 Milvus 内部组件（包括代理、索引节点等）的元数据。</p></li>
<li><p>MinIO：负责 Milvus 内部数据持久性的存储引擎。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 1：Milvus 独立架构</p>
<h3 id="Available-Resources" class="common-anchor-header">可用资源</h3><ul>
<li><p>文档</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">使用 Docker Compose 安装 Milvus 的环境检查表</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">使用 Docker 安装 Milvus 单机版</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Github 存储库</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvus 集群<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Cluster 是 Milvus 向量数据库系统的一种操作模式，它在多个节点或服务器上操作和分布。在这种模式下，Milvus 实例集群在一起，形成一个统一的系统，与独立设置相比，可以处理更大的数据量和更高的流量负载。Milvus 集群具有可扩展性、容错性和负载平衡功能，适用于需要处理海量数据和高效服务众多并发查询的场景。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">特点和功能</h3><ul>
<li><p>继承了 Milvus Standalone 的所有功能，包括高性能向量搜索、支持多种索引类型和相似度指标，以及与批处理和流处理框架的无缝集成。</p></li>
<li><p>通过跨多个节点的分布式计算和负载平衡，提供无与伦比的可用性、性能和成本优化。</p></li>
<li><p>通过有效利用整个集群的资源，并根据工作负载需求优化资源分配，以较低的总成本部署和扩展安全的企业级工作负载。</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">基本组件：</h3><p>Milvus 集群包括八个微服务组件和三个第三方依赖项。所有微服务都可以在 Kubernetes 上独立部署，互不影响。</p>
<h4 id="Microservice-components" class="common-anchor-header">微服务组件</h4><ul>
<li><p>根节点</p></li>
<li><p>代理</p></li>
<li><p>查询协调器</p></li>
<li><p>查询节点</p></li>
<li><p>索引坐标</p></li>
<li><p>索引节点</p></li>
<li><p>数据坐标</p></li>
<li><p>数据节点</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">第三方依赖</h4><ul>
<li><p>etcd：存储集群中各种组件的元数据。</p></li>
<li><p>MinIO：负责集群中大型文件的数据持久性，如索引和二进制日志文件。</p></li>
<li><p>Pulsar管理最近突变操作的日志，输出流式日志，并提供日志发布-订阅服务。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 2：Milvus 集群架构</p>
<h4 id="Available-Resources" class="common-anchor-header">可用资源</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">文档</a>| 如何开始</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">使用 Milvus Operator 安装 Milvus 群集</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">使用 Helm 安装 Milvus 群集</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">如何扩展 Milvus 集群</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Github 存储库</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">决定使用哪个版本的 Milvus<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>在决定项目使用哪个版本的 Milvus 时，必须考虑数据集大小、流量、可扩展性要求和生产环境限制等因素。Milvus Lite 非常适合在笔记本电脑上进行原型开发。Milvus Standalone 为在数据集上进行向量搜索提供了高性能和灵活性，适合较小规模的部署、CI/CD 以及在没有 Kubernetes 支持时进行离线部署......最后，Milvus Cluster 为企业级工作负载提供了无与伦比的可用性、可扩展性和成本优化，是大规模、高可用生产环境的首选。</p>
<p>还有一个版本是无忧版，那就是名为<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>的Milvus托管版。</p>
<p>最终，Milvus 版本将取决于您的具体用例、基础设施要求和长期目标。通过仔细评估这些因素并了解每个版本的特点和功能，您可以做出符合项目需求和目标的明智决定。无论您选择 Milvus Standalone 还是 Milvus Cluster，您都可以利用向量数据库的强大功能来提高人工智能应用的性能和效率。</p>
