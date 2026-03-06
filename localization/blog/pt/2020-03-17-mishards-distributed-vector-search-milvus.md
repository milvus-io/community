---
id: mishards-distributed-vector-search-milvus.md
title: Distributed architecture overview
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: How to scale out
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards — Distributed Vector Search in Milvus</custom-h1><p>Milvus aims to achieve efficient similarity search and analytics for massive-scale vectors. A standalone Milvus instance can easily handle vector search for billion-scale vectors. However, for 10 billion, 100 billion or even larger datasets, a Milvus cluster is needed. The cluster can be used as a standalone instance for upper-level applications and can meet the business needs of low latency, high concurrency for massive-scale data. A Milvus cluster can resend requests, separate reading from writing, scale horizontally, and expand dynamically, thus providing a Milvus instance that can expand without limit. Mishards is a distributed solution for Milvus.</p>
<p>This article will briefly introduce components of the Mishards architecture. More detailed information will be introduced in the upcoming articles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
    <span>1-milvus-cluster-mishards.png</span>
  </span>
</p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">Distributed architecture overview<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
    <span>2-distributed-architecture-overview.png</span>
  </span>
</p>
<h2 id="Service-tracing" class="common-anchor-header">Service tracing<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
    <span>3-service-tracing-milvus.png</span>
  </span>
</p>
<h2 id="Primary-service-components" class="common-anchor-header">Primary service components<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>Service discovery framework, such as ZooKeeper, etcd, and Consul.</li>
<li>Load balancer, such as Nginx, HAProxy, Ingress Controller.</li>
<li>Mishards node: stateless, scalable.</li>
<li>Write-only Milvus node: single node and not scalable. You need to use high availability solutions for this node to avoid single-point-of-failure.</li>
<li>Read-only Milvus node: Stateful node and scalable.</li>
<li>Shared storage service: All Milvus nodes use shared storage service to share data, such as NAS or NFS.</li>
<li>Metadata service: All Milvus nodes use this service to share metadata. Currently, only MySQL is supported. This service requires MySQL high availability solution.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">Scalable components<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>Mishards</li>
<li>Read-only Milvus nodes</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">Components introduction<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Mishards nodes</strong></p>
<p>Mishards is responsible for breaking up upstream requests and routing sub-requests to sub-services. The results are summarized to return to upstream.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
    <span>4-mishards-nodes.jpg</span>
  </span>
</p>
<p>As is indicated in the chart above, after accepting a TopK search request, Mishards first breaks up the request into sub-requests and send the sub-requests to the downstream service. When all sub-responses are collected, the sub-responses are merged and returned to upstream.</p>
<p>Because Mishards is a stateless service, it does not save data or participate in complex computation. Thus, nodes do not have high configuration requirements and the computing power is mainly used in merging sub-results. So, it is possible to increase the number of Mishards nodes for high concurrency.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Milvus nodes<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus nodes are responsible for CRUD related core operations, so they have relatively high configuration requirements. Firstly, the memory size should be large enough to avoid too many disk IO operations. Secondly, CPU configurations can also affect performance. As the cluster size increases, more Milvus nodes are required to increase system throughput.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">Read-only nodes and writable nodes</h3><ul>
<li>Core operations of Milvus are vector insertion and search. Search has extremely high requirements on CPU and GPU configurations, while insertion or other operations have relatively low requirements. Separating the node that runs search from the node that runs other operations leads to more economical deployment.</li>
<li>In terms of service quality, when a node is performing search operations, the related hardware is running in full load and cannot ensure the service quality of other operations. Therefore, two node types are used. Search requests are processed by read-only nodes and other requests are processed by writable nodes.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">Only one writable node is allowed</h3><ul>
<li><p>Currently, Milvus does not support sharing data for multiple writable instances.</p></li>
<li><p>During deployment, a single-point-of-failure of writable nodes needs to be considered. High availability solutions need to be prepared for writable nodes.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">Read-only node scalability</h3><p>When the data size is extremely large, or the latency requirement is extremely high, you can horizontally scale read-only nodes as stateful nodes. Assume there are 4 hosts and each has the following configuration: CPU Cores: 16, GPU: 1, Memory: 64 GB. The following chart shows the cluster when horizontally scaling stateful nodes. Both computing power and memory scale linearly. The data is split into 8 shards with each node processing requests from 2 shards.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
    <span>5-read-only-node-scalability-milvus.png</span>
  </span>
</p>
<p>When the number of requests is large for some shards, stateless read-only nodes can be deployed for these shards to increase throughput. Take the hosts above as an example. when the hosts are combined into a serverless cluster, the computing power increases linearly. Because the data to process does not increase, the processing power for the same data shard also increases linearly.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
    <span>6-read-only-node-scalability-milvus-2.png</span>
  </span>
</p>
<h3 id="Metadata-service" class="common-anchor-header">Metadata service</h3><p>Keywords: MySQL</p>
<p>For more information about Milvus metadata, refer to How to view metadata. In a distributed system, Milvus writable nodes are the only producer of metadata. Mishards nodes, Milvus writable nodes, and Milvus read-only nodes are all consumers of metadata. Currently, Milvus only supports MySQL and SQLite as the storage backend of metadata. In a distributed system, the service can only be deployed as highly-available MySQL.</p>
<h3 id="Service-discovery" class="common-anchor-header">Service discovery</h3><p>Keywords: Apache Zookeeper, etcd, Consul, Kubernetes</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
    <span>7-service-discovery.png</span>
  </span>
</p>
<p>Service discovery provides information about all Milvus nodes. Milvus nodes register their information when going online and log out when going offline. Milvus nodes can also detect abnormal nodes by periodically checking the health status of services.</p>
<p>Service discovery contains a lot of frameworks, including etcd, Consul, ZooKeeper, etc. Mishards defines the service discovery interfaces and provides possibilities for scaling by plugins. Currently, Mishards provides two kinds of plugins, which correspond to Kubernetes cluster and static configurations. You can customize your own service discovery by following the implementation of these plugins. The interfaces are temporary and need a redesign. More information about writing your own plugin will be elaborated in the upcoming articles.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">Load balancing and service sharding</h3><p>Keywords: Nginx, HAProxy, Kubernetes</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
    <span>7-load-balancing-and-service-sharding.png</span>
  </span>
</p>
<p>Service discovery and load balancing are used together. Load balancing can be configured as polling, hashing, or consistent hashing.</p>
<p>The load balancer is responsible for resending user requests to the Mishards node.</p>
<p>Each Mishards node acquires the information of all downstream Milvus nodes via the service discovery center. All related metadata can be acquired by metadata service. Mishards implements sharding by consuming these resources. Mishards defines the interfaces related to routing strategies and provides extensions via plugins. Currently, Mishards provides a consistent hashing strategy based on the lowest segment level. As is shown in the chart, there are 10 segments, s1 to s10. Per the segment-based consistent hashing strategy, Mishards routes requests concerning s1, 24, s6, and s9 to the Milvus 1 node, s2, s3, s5 to the Milvus 2 node, and s7, s8, s10 to the Milvus 3 node.</p>
<p>Based on your business needs, you can customize routing by following the default consistent hashing routing plugin.</p>
<h3 id="Tracing" class="common-anchor-header">Tracing</h3><p>Keywords: OpenTracing, Jaeger, Zipkin</p>
<p>Given the complexity of a distributed system, requests are sent to multiple internal service invocations. To help pinpoint problems, we need to trace the internal service invocation chain. As the complexity increases, the benefits of an available tracing system are self-explanatory. We choose the CNCF OpenTracing standard. OpenTracing provides platform-independent, vendor-independent APIs for developers to conveniently implement a tracing system.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
    <span>8-tracing-demo-milvus.png</span>
  </span>
</p>
<p>The previous chart is an example of tracing during search invocation. Search invokes <code translate="no">get_routing</code>, <code translate="no">do_search</code>, and <code translate="no">do_merge</code> consecutively. <code translate="no">do_search</code> also invokes <code translate="no">search_127.0.0.1</code>.</p>
<p>The whole tracing record forms the following tree:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
    <span>8-search-traceid-milvus.png</span>
  </span>
</p>
<p>The following chart shows examples of request/response info and tags of each node:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
    <span>request-response-info-tags-node-milvus.png</span>
  </span>
</p>
<p>OpenTracing has been integrated to Milvus. More information will be covered in the upcoming articles.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">Monitoring and alerting</h3><p>Keywords: Prometheus, Grafana</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
    <span>10-monitor-alert-milvus.jpg</span>
  </span>
</p>
<h2 id="Summary" class="common-anchor-header">Summary<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>As the service middleware, Mishards integrates service discovery, routing request, result merging, and tracing. Plugin-based expansion is also provided. Currently, distributed solutions based on Mishards still have the following setbacks:</p>
<ul>
<li>Mishards uses proxy as the middle layer and has latency costs.</li>
<li>Milvus writable nodes are single-point services.</li>
<li>Dependent on highly-available MySQL service.
-Deployment is complicated when there are multiple shards and a single shard has multiple copies.</li>
<li>Lacks a cache layer, such as access to metadata.</li>
</ul>
<p>We will fix these know issues in the upcoming versions so that Mishards can be applied to the production environment more conveniently.</p>
