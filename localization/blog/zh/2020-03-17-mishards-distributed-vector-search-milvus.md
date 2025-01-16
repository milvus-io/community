---
id: mishards-distributed-vector-search-milvus.md
title: 分布式架构概述
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: 如何扩大规模
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Milvus 中的分布式向量搜索</custom-h1><p>Milvus 旨在实现大规模向量的高效相似性搜索和分析。一个独立的 Milvus 实例可以轻松处理十亿规模向量的向量搜索。但是，对于 100 亿、1000 亿甚至更大的数据集，则需要一个 Milvus 集群。集群可作为独立实例用于上层应用，并能满足海量数据低延迟、高并发的业务需求。Milvus 集群可以重发请求、读写分离、水平扩展和动态扩展，从而提供一个可以无限制扩展的 Milvus 实例。Mishards 是 Milvus 的分布式解决方案。</p>
<p>本文将简要介绍 Mishards 架构的组件。更多详细信息将在接下来的文章中介绍。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">分布式架构概述<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
<h2 id="Service-tracing" class="common-anchor-header">服务跟踪<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
<h2 id="Primary-service-components" class="common-anchor-header">主要服务组件<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>服务发现框架，如 ZooKeeper、etcd 和 Consul。</li>
<li>负载平衡器，如 Nginx、HAProxy、Ingress Controller。</li>
<li>Mishards 节点：无状态、可扩展。</li>
<li>只能写入的 Milvus 节点：单节点，不可扩展。该节点需要使用高可用性解决方案，以避免单点故障。</li>
<li>只读 Milvus 节点：有状态节点，可扩展。</li>
<li>共享存储服务：所有 Milvus 节点都使用共享存储服务共享数据，如 NAS 或 NFS。</li>
<li>元数据服务：所有 Milvus 节点都使用该服务共享元数据。目前只支持 MySQL。该服务需要 MySQL 高可用性解决方案。</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">可扩展组件<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>数据仓库</li>
<li>只读 Milvus 节点</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">组件介绍<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Mishards 节点</strong></p>
<p>Mishards 负责分解上游请求，并将子请求路由到子服务。结果汇总后返回上游。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-mishards-nodes.jpg</span> </span></p>
<p>如上图所示，在接受 TopK 搜索请求后，Mishards 会首先将请求分解为子请求，然后将子请求发送给下游服务。当收集到所有子响应后，再将子响应合并并返回给上游。</p>
<p>由于 Mishards 是一种无状态服务，它不保存数据，也不参与复杂的计算。因此，节点对配置要求不高，计算能力主要用于合并子结果。因此，可以增加 Mishards 节点的数量，以实现高并发。</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Milvus 节点<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 节点负责 CRUD 相关的核心操作，所以对配置要求相对较高。首先，内存大小要足够大，避免过多的磁盘 IO 操作。其次，CPU 配置也会影响性能。随着集群规模的增加，需要更多的 Milvus 节点来提高系统吞吐量。</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">只读节点和可写节点</h3><ul>
<li>Milvus 的核心操作符是向量插入和搜索。搜索对 CPU 和 GPU 配置的要求极高，而插入或其他操作的要求相对较低。将运行搜索的节点与运行其他操作符的节点分开，可以带来更经济的部署。</li>
<li>在服务质量方面，当一个节点执行搜索操作时，相关硬件处于满负荷运行状态，无法保证其他操作的服务质量。因此，使用了两种节点类型。搜索请求由只读节点处理，其他请求由可写节点处理。</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">只允许有一个可写节点</h3><ul>
<li><p>目前，Milvus 不支持多个可写实例共享数据。</p></li>
<li><p>在部署过程中，需要考虑可写节点的单点故障。需要为可写节点准备高可用性解决方案。</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">只读节点的可扩展性</h3><p>当数据量极大或对延迟要求极高时，可以将只读节点作为有状态节点进行水平扩展。假设有 4 台主机，每台主机的配置如下：CPU 内核：1616、GPU1，内存：64 GB。下图显示了横向扩展有状态节点时的集群。计算能力和内存都是线性扩展。数据分为 8 个分片，每个节点处理来自 2 个分片的请求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>当某些分片的请求数量较大时，可以为这些分片部署无状态只读节点，以提高吞吐量。以上面的主机为例。当主机组合成无服务器集群时，计算能力会线性增加。由于需要处理的数据不会增加，因此相同数据分片的处理能力也会线性增加。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6- 只读节点可扩展性-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">元数据服务</h3><p>关键字MySQL</p>
<p>有关 Milvus 元数据的更多信息，请参阅如何查看元数据。在分布式系统中，Milvus 可写节点是元数据的唯一生产者。Mishards 节点、Milvus 可写节点和 Milvus 只读节点都是元数据的消费者。目前，Milvus 只支持 MySQL 和 SQLite 作为元数据的存储后台。在分布式系统中，该服务只能部署为高可用的 MySQL。</p>
<h3 id="Service-discovery" class="common-anchor-header">服务发现</h3><p>关键字Apache Zookeeper、etcd、Consul、Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-服务发现.png</span> </span></p>
<p>服务发现提供所有 Milvus 节点的信息。Milvus 节点上线时会注册自己的信息，下线时会注销。Milvus 节点还可以通过定期检查服务的健康状态来检测异常节点。</p>
<p>服务发现包含很多框架，包括 etcd、Consul、ZooKeeper 等。Mishards 定义了服务发现接口，并提供了通过插件进行扩展的可能性。目前，Mishards 提供两种插件，分别对应 Kubernetes 集群和静态配置。你可以根据这些插件的实现来定制自己的服务发现。这些接口是临时的，需要重新设计。有关编写自己的插件的更多信息将在接下来的文章中详细阐述。</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">负载平衡和服务分片</h3><p>关键字Nginx、HAProxy、Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-load-balancing-and-service-sharding.png</span> </span></p>
<p>服务发现和负载均衡是一起使用的。负载平衡可配置为轮询、散列或一致散列。</p>
<p>负载平衡器负责将用户请求重新发送到 Mishards 节点。</p>
<p>每个 Mishards 节点通过服务发现中心获取所有下游 Milvus 节点的信息。所有相关的元数据都可以通过元数据服务获取。Mishards 通过消耗这些资源来实现分片。Mishards 定义了与路由策略相关的接口，并通过插件提供扩展。目前，Mishards 提供基于最低段级别的一致散列策略。如图所示，共有 10 个段，即 s1 至 s10。根据基于段的一致散列策略，Mishards 会将有关 s1、24、s6 和 s9 的请求路由到 Milvus 1 节点，将有关 s2、s3 和 s5 的请求路由到 Milvus 2 节点，将有关 s7、s8 和 s10 的请求路由到 Milvus 3 节点。</p>
<p>您可以根据业务需要，按照默认的一致散列路由插件定制路由。</p>
<h3 id="Tracing" class="common-anchor-header">跟踪</h3><p>关键字OpenTracing、Jaeger、Zipkin</p>
<p>鉴于分布式系统的复杂性，请求会被发送到多个内部服务调用。为了帮助找出问题所在，我们需要跟踪内部服务调用链。随着复杂性的增加，可用跟踪系统的好处不言自明。我们选择了 CNCF OpenTracing 标准。OpenTracing 为开发人员提供了独立于平台、独立于厂商的应用程序接口，方便他们实施跟踪系统。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>上图是在搜索调用过程中进行跟踪的示例。搜索连续调用了<code translate="no">get_routing</code> 、<code translate="no">do_search</code> 和<code translate="no">do_merge</code> 。<code translate="no">do_search</code> 还调用了<code translate="no">search_127.0.0.1</code> 。</p>
<p>整个跟踪记录形成如下树状：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>下图显示了每个节点的请求/响应信息和标记示例：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>Milvus 已集成 OpenTracing。更多信息将在接下来的文章中介绍。</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">监控和警报</h3><p>关键字Prometheus、Grafana</p>
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
    </button></h2><p>作为服务中间件，Mishards 集成了服务发现、路由请求、结果合并和跟踪功能。此外还提供基于插件的扩展。目前，基于 Mishards 的分布式解决方案仍存在以下不足：</p>
<ul>
<li>Mishards 使用代理作为中间层，存在延迟成本。</li>
<li>Milvus 可写节点是单点服务。</li>
<li>依赖于高可用的 MySQL 服务。</li>
<li>缺乏缓存层，如对元数据的访问。</li>
</ul>
<p>我们将在即将推出的版本中修复这些已知问题，以便更方便地将 Mishards 应用到生产环境中。</p>
