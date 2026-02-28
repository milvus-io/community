---
id: the-developers-guide-to-milvus-configuration.md
title: The Developer’s Guide to Milvus Configuration
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Simplify your Milvus configuration with our focused guide. Discover key
  parameters to adjust for enhanced performance in your vector database
  applications.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>As a developer working with Milvus, you’ve likely encountered the daunting <code translate="no">milvus.yaml</code> configuration file with its 500+ parameters. Handling this complexity can be challenging when all you want is to optimize your vector database performance.</p>
<p>Good news: you don’t need to understand every parameter. This guide cuts through the noise and focuses on the critical settings that actually impact performance, highlighting exactly which values to tweak for your specific use case.</p>
<p>Whether you’re building a recommendation system that needs lightning-fast queries or optimizing a vector search application with cost constraints, I’ll show you exactly which parameters to modify with practical, tested values. By the end of this guide, you’ll know how to tune Milvus configurations for peak performance based on real-world deployment scenarios.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">Configuration Categories<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>Before diving into specific parameters, let’s break down the structure of the configuration file. When working with <code translate="no">milvus.yaml</code>, you’ll be dealing with three parameter categories:</p>
<ul>
<li><p><strong>Dependency Component Configurations</strong>: External services Milvus connects to (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - critical for cluster setup and data persistence</p></li>
<li><p><strong>Internal Component Configurations</strong>: Milvus’s internal architecture (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, etc.) - key for performance tuning</p></li>
<li><p><strong>Functional Configurations</strong>: Security, logging, and resource limits - important for production deployments</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Milvus Dependency Component Configurations<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s start with the external services Milvus depends on. These configurations are particularly important when moving from development to production.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: Metadata Store</h3><p>Milvus relies on <code translate="no">etcd</code> for metadata persistence and service coordination. The following parameters are crucial:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: Specifies the address of the etcd cluster. By default, Milvus launches a bundled instance, but in enterprise environments, it’s best practice to connect to a managed <code translate="no">etcd</code> service for better availability and operational control.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Defines the key prefix for storing Milvus-related data in etcd. If you’re operating multiple Milvus clusters on the same etcd backend, using different root paths allows clean metadata isolation.</p></li>
<li><p><code translate="no">etcd.auth</code>: Controls authentication credentials. Milvus doesn’t enable etcd auth by default, but if your managed etcd instance requires credentials, you must specify them here.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: Object Storage</h3><p>Despite the name, this section governs all S3-compatible object storage service clients. It supports providers such as AWS S3, GCS, and Aliyun OSS via the <code translate="no">cloudProvider</code> setting.</p>
<p>Pay attention to these four key configurations:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: Use these to specify the endpoint of your object storage service.</p></li>
<li><p><code translate="no">minio.bucketName</code>: Assign separate buckets (or logical prefixes) to avoid data collisions when running multiple Milvus clusters.</p></li>
<li><p><code translate="no">minio.rootPath</code>: Enables intra-bucket namespacing for data isolation.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: Identifies the OSS backend. For a full compatibility list, refer to the <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">Milvus documentation</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: Message Queue</h3><p>Milvus uses a message queue for internal event propagation—either Pulsar (default) or Kafka. Pay attention to the following three parameters.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: Set these values to use an external Pulsar cluster.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: Defines the tenant name. When multiple Milvus clusters share a Pulsar instance, this ensures clean channel separation.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: If you prefer to bypass Pulsar’s tenant model, adjust the channel prefix to prevent collisions.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus also supports Kafka as the message queue. To use Kafka instead, comment out the Pulsar-specific settings and uncomment the Kafka config block.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Milvus Internal Component Configurations<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: Metadata + Timestamps</h3><p>The <code translate="no">rootCoord</code> node handles metadata changes (DDL/DCL) and timestamp management.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： Sets the upper bound on the number of partitions per collection. While the hard limit is 1024, this parameter primarily serves as a safeguard. For multi-tenant systems, avoid using partitions as isolation boundaries—instead, implement a tenant key strategy that scales to millions of logical tenants.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>：Enables high availability by activating a standby node. This is critical since Milvus coordinator nodes don’t scale horizontally by default.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: API Gateway + Request Router</h3><p>The <code translate="no">proxy</code> handles client-facing requests, request validation, and result aggregation.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: Limits the number of fields (scalar + vector) per collection. Keep this under 64 to minimize schema complexity and reduce I/O overhead.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: Controls the number of vector fields in a collection. Milvus supports multimodal search, but in practice, 10 vector fields is a safe upper bound.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:Defines the number of ingestion shards. As a rule of thumb:</p>
<ul>
<li><p>&lt; 200M records → 1 shard</p></li>
<li><p>200–400M records → 2 shards</p></li>
<li><p>Scale linearly beyond that</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: When enabled, this logs detailed request info (user, IP, endpoint, SDK). Useful for auditing and debugging.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: Query Execution</h3><p>Handles vector search execution and segment loading. Pay attention to the following parameter.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: Toggles memory-mapped I/O for loading scalar fields and segments. Enabling <code translate="no">mmap</code> helps reduce memory footprint, but may degrade latency if disk I/O becomes a bottleneck.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: Segment + Index Management</h3><p>This parameter controls data segmentation, indexing, compaction, and garbage collection (GC). Key configuration parameters include:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: Specifies the maximum size of an in-memory data segment. Larger segments generally mean fewer total segments in the system, which can improve query performance by reducing indexing and search overhead. For example, some users running <code translate="no">queryNode</code> instances with 128GB of RAM reported that increasing this setting from 1GB to 8GB led to roughly 4× faster query performance.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Similar to the above, this parameter controls the maximum size for <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">disk indexes</a> (diskann index) specifically.</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: Determines when a growing segment is sealed (i.e., finalized and indexed). The segment is sealed when it reaches <code translate="no">maxSize * sealProportion</code>. By default, with <code translate="no">maxSize = 1024MB</code> and <code translate="no">sealProportion = 0.12</code>, a segment will be sealed at around 123MB.</p></li>
</ol>
<ul>
<li><p>Lower values (e.g., 0.12) trigger sealing sooner, which can help with faster index creation—useful in workloads with frequent updates.</p></li>
<li><p>Higher values (e.g., 0.3 to 0.5) delay sealing, reducing indexing overhead—more suitable for offline or batch ingestion scenarios.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  Sets the allowed expansion factor during compaction. Milvus calculates the maximum allowable segment size during compaction as <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: After a segment is compacted or a collection is dropped, Milvus does not immediately delete the underlying data. Instead, it marks the segments for deletion and waits for the garbage collection (GC) cycle to complete. This parameter controls the duration of that delay.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">Other Functional Configurations<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: Observability and Diagnostics</h3><p>Robust logging is a cornerstone of any distributed system, and Milvus is no exception. A well-configured logging setup not only helps with debugging issues as they arise but also ensures better visibility into system health and behavior over time.</p>
<p>For production deployments, we recommend integrating Milvus logs with centralized logging and monitoring tools—such as <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a> —to streamline analysis and alerting. Key settings include:</p>
<ol>
<li><p><code translate="no">log.level</code>: Controls the verbosity of log output. For production environments, stick with <code translate="no">info</code> level to capture essential runtime details without overwhelming the system. During development or troubleshooting, you can switch to <code translate="no">debug</code> to get more granular insights into internal operations. ⚠️ Be cautious with <code translate="no">debug</code> level in production—it generates a high volume of logs, which can quickly consume disk space and degrade I/O performance if left unchecked.</p></li>
<li><p><code translate="no">log.file</code>: By default, Milvus writes logs to standard output (stdout), which is suitable for containerized environments where logs are collected via sidecars or node agents. To enable file-based logging instead, you can configure:</p></li>
</ol>
<ul>
<li><p>Maximum file size before rotation</p></li>
<li><p>File retention period</p></li>
<li><p>Number of backup log files to keep</p></li>
</ul>
<p>This is useful in bare-metal or on-prem environments where stdout log shipping is not available.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: Authentication and Access Control</h3><p>Milvus supports <a href="https://milvus.io/docs/authenticate.md?tab=docker">user authentication</a> and <a href="https://milvus.io/docs/rbac.md">role-based access control (RBAC)</a>, both of which are configured under the <code translate="no">common</code> module. These settings are essential for securing multi-tenant environments or any deployment exposed to external clients.</p>
<p>Key parameters include:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: This toggle enables or disables authentication and RBAC. It’s turned off by default, meaning all operations are allowed without identity checks. To enforce secure access control, set this parameter to <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: When authentication is enabled, this setting defines the initial password for the built-in <code translate="no">root</code> user.</p></li>
</ol>
<p>Be sure to change the default password immediately after enabling authentication to avoid security vulnerabilities in production environments.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: Rate Limiting and Write Control</h3><p>The <code translate="no">quotaAndLimits</code> section in <code translate="no">milvus.yaml</code> plays a critical role in controlling how data flows through the system. It governs rate limits for operations like inserts, deletes, flushes, and queries—ensuring cluster stability under heavy workloads and preventing performance degradation due to write amplification or excessive compaction.</p>
<p>Key parameters include:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Controls how frequently Milvus flushes data from a collection.</p>
<ul>
<li><p><strong>Default value</strong>: <code translate="no">0.1</code>, which means the system allows one flush every 10 seconds.</p></li>
<li><p>The flush operation seals a growing segment and persists it from the message queue to object storage.</p></li>
<li><p>Flushing too frequently can generate many small sealed segments, which increases compaction overhead and hurts query performance.</p></li>
</ul>
<p>💡 Best practice: In most cases, let Milvus handle this automatically. A growing segment is sealed once it reaches <code translate="no">maxSize * sealProportion</code>, and sealed segments are flushed every 10 minutes. Manual flushes are only recommended after bulk inserts when you know no more data is coming.</p>
<p>Also keep in mind: <strong>data visibility</strong> is determined by the query’s <em>consistency level</em>, not the flush timing—so flushing does not make new data immediately queryable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: These parameters define the maximum allowed rate for upsert and delete operations.</p>
<ul>
<li><p>Milvus relies on an LSM-Tree storage architecture, which means frequent updates and deletions trigger compaction. This can be resource-intensive and reduce overall throughput if not managed carefully.</p></li>
<li><p>It’s recommended to cap both <code translate="no">upsertRate</code> and <code translate="no">deleteRate</code> at <strong>0.5 MB/s</strong> to avoid overwhelming the compaction pipeline.</p></li>
</ul>
<p>🚀 Need to update a large dataset quickly? Use a collection alias strategy:</p>
<ul>
<li><p>Insert new data into a fresh collection.</p></li>
<li><p>Once the update is complete, repoint the alias to the new collection. This avoids the compaction penalty of in-place updates and allows instant switchover.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">Real-World Configuration Examples<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s walk through two common deployment scenarios to illustrate how Milvus configuration settings can be tuned to match different operational goals.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">⚡ Example 1: High-Performance Configuration</h3><p>When query latency is mission-critical—think recommendation engines, semantic search platforms, or real-time risk scoring—every millisecond counts. In these use cases, you’ll typically lean on graph-based indexes like <strong>HNSW</strong> or <strong>DISKANN</strong>, and optimize both memory usage and segment lifecycle behavior.</p>
<p>Key tuning strategies:</p>
<ul>
<li><p>Increase <code translate="no">dataCoord.segment.maxSize</code> and <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Raise these values to 4GB or even 8GB, depending on available RAM. Larger segments reduce the number of index builds and improve query throughput by minimizing segment fanout. However, larger segments do consume more memory at query time—so make sure your <code translate="no">indexNode</code> and <code translate="no">queryNode</code> instances have enough headroom.</p></li>
<li><p>Lower <code translate="no">dataCoord.segment.sealProportion</code> and <code translate="no">dataCoord.segment.expansionRate</code>: Target a growing segment size around 200MB before sealing. This keeps segment memory usage predictable and reduces the burden on the Delegator (the queryNode leader that coordinates distributed search).</p></li>
</ul>
<p>Rule of thumb: Favor fewer, larger segments when memory is abundant and latency is a priority. Be conservative with seal thresholds if index freshness matters.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰 Example 2: Cost-Optimized Configuration</h3><p>If you’re prioritizing cost efficiency over raw performance—common in model training pipelines, low-QPS internal tools, or long-tail image search—you can trade off recall or latency to significantly reduce infrastructure demands.</p>
<p>Recommended strategies:</p>
<ul>
<li><p><strong>Use index quantization:</strong> Index types like <code translate="no">SCANN</code>, <code translate="no">IVF_SQ8</code>, or <code translate="no">HNSW_PQ/PRQ/SQ</code> (introduced in Milvus 2.5) dramatically reduce index size and memory footprint. These are ideal for workloads where precision is less critical than scale or budget.</p></li>
<li><p><strong>Adopt a disk-backed indexing strategy:</strong> Set the index type to <code translate="no">DISKANN</code> to enable pure disk-based search. <strong>Enable</strong> <code translate="no">mmap</code> for selective memory offloading.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>For extreme memory savings, enable <code translate="no">mmap</code> for the following: <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code>, and <code translate="no">scalarIndex</code>. This offloads large chunks of data to virtual memory, reducing resident RAM usage significantly.</p>
<p>⚠️ Caveat: If scalar filtering is a major part of your query workload, consider disabling <code translate="no">mmap</code> for <code translate="no">vectorIndex</code> and <code translate="no">scalarIndex</code>. Memory mapping can degrade scalar query performance in I/O-constrained environments.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">Disk usage tip</h4><ul>
<li><p>HNSW indexes built with <code translate="no">mmap</code> can expand total data size by up to <strong>1.8×</strong>.</p></li>
<li><p>A 100GB physical disk might realistically only accommodate ~50GB of effective data when you account for index overhead and caching.</p></li>
<li><p>Always provision extra storage when working with <code translate="no">mmap</code>, especially if you also cache the original vectors locally.</p></li>
</ul>
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
    </button></h2><p>Tuning Milvus isn’t about chasing perfect numbers—it’s about shaping the system around your workload’s real-world behavior. The most impactful optimizations often come from understanding how Milvus handles I/O, segment lifecycle, and indexing under pressure. These are the paths where misconfiguration hurts the most—and where thoughtful tuning yields the biggest returns.</p>
<p>If you’re new to Milvus, the configuration parameters we’ve covered will cover 80–90% of your performance and stability needs. Start there. Once you’ve built some intuition, dig deeper into the full <code translate="no">milvus.yaml</code> spec and the official documentation—you’ll uncover fine-grained controls that can take your deployment from functional to exceptional.</p>
<p>With the right configurations in place, you’ll be ready to build scalable, high-performance vector search systems that align with your operational priorities—whether that means low-latency serving, cost-efficient storage, or high-ingest analytical workloads.</p>
