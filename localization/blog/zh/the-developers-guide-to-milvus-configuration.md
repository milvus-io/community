---
id: the-developers-guide-to-milvus-configuration.md
title: Milvus 配置开发人员指南
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: 使用我们的重点指南简化您的 Milvus 配置。了解如何调整关键参数，以提高向量数据库应用程序的性能。
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>作为使用 Milvus 的开发人员，你很可能遇到过令人生畏的<code translate="no">milvus.yaml</code> 配置文件，其中包含 500 多个参数。当你只想优化你的向量数据库性能时，处理这种复杂性是很有挑战性的。</p>
<p>好消息是：你不需要了解每个参数。本指南将剔除杂音，重点关注对性能有实际影响的关键设置，并明确指出应根据具体使用情况调整哪些值。</p>
<p>无论你是在构建一个需要闪电般快速查询的推荐系统，还是在优化一个有成本限制的向量搜索应用，我都会告诉你到底该用哪些实用的、经过测试的值来修改参数。在本指南结束时，你将知道如何根据实际部署情况调整 Milvus 配置，以获得最佳性能。</p>
<h2 id="Configuration-Categories" class="common-anchor-header">配置类别<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解具体参数之前，我们先来了解一下配置文件的结构。在使用<code translate="no">milvus.yaml</code> 时，你需要处理三个参数类别：</p>
<ul>
<li><p><strong>依赖组件配置</strong>：Milvus 连接的外部服务 (<code translate="no">etcd</code>,<code translate="no">minio</code>,<code translate="no">mq</code>) - 对集群设置和数据持久性至关重要</p></li>
<li><p><strong>内部组件配置</strong>：Milvus 的内部架构 (<code translate="no">proxy</code>,<code translate="no">queryNode</code>, 等等) - 性能调整的关键</p></li>
<li><p><strong>功能配置</strong>：安全、日志和资源限制--对生产部署很重要</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Milvus 依赖组件配置<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们从 Milvus 依赖的外部服务开始。当从开发阶段转向生产阶段时，这些配置尤为重要。</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>:元数据存储</h3><p>Milvus 依赖<code translate="no">etcd</code> 进行元数据持久化和服务协调。以下参数至关重要：</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>:指定 etcd 集群的地址。默认情况下，Milvus 会启动一个捆绑实例，但在企业环境中，最佳做法是连接到托管的<code translate="no">etcd</code> 服务，以获得更好的可用性和操作控制。</p></li>
<li><p><code translate="no">etcd.rootPath</code>:定义在 etcd 中存储 Milvus 相关数据的关键前缀。如果在同一 etcd 后端操作多个 Milvus 集群，使用不同的根路径可实现干净的元数据隔离。</p></li>
<li><p><code translate="no">etcd.auth</code>:控制身份验证凭据。Milvus 默认不启用 etcd auth，但如果托管的 etcd 实例需要凭据，则必须在此处指定。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>:对象存储</h3><p>尽管名称如此，但该部分管理所有与 S3 兼容的对象存储服务客户端。它通过<code translate="no">cloudProvider</code> 设置支持 AWS S3、GCS 和阿里云 OSS 等提供商。</p>
<p>请注意以下四项关键配置：</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>:使用这些配置指定对象存储服务的端点。</p></li>
<li><p><code translate="no">minio.bucketName</code>:分配单独的存储桶（或逻辑前缀），以避免运行多个 Milvus 集群时发生数据碰撞。</p></li>
<li><p><code translate="no">minio.rootPath</code>:启用桶内命名，以实现数据隔离。</p></li>
<li><p><code translate="no">minio.cloudProvider</code>:标识 OSS 后端。有关完整的兼容性列表，请参阅<a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">Milvus 文档</a>。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>:消息队列</h3><p>Milvus 使用消息队列进行内部事件传播--Pulsar（默认）或 Kafka。请注意以下三个参数。</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>:设置这些值以使用外部 Pulsar 集群。</p></li>
<li><p><code translate="no">pulsar.tenant</code>:定义租户名称。当多个 Milvus 集群共享一个 Pulsar 实例时，这将确保干净的通道分离。</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>:如果你想绕过 Pulsar 的租户模型，请调整通道前缀以防止碰撞。</p></li>
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
<p>Milvus 还支持 Kafka 作为消息队列。要使用 Kafka，请注释掉 Pulsar 的特定设置，并取消注释 Kafka 配置块。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Milvus 内部组件配置<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>:元数据 + 时间戳</h3><p><code translate="no">rootCoord</code> 节点处理元数据更改（DDL/DCL）和时间戳管理。</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： 设置每个 Collections 的分区数上限。虽然硬限制是 1024，但该参数的主要作用是提供保障。对于多租户系统，应避免使用 Partition Key 作为隔离边界，而应实施可扩展至数百万逻辑租户的租户密钥策略。</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>：通过激活备用节点实现高可用性。这一点至关重要，因为 Milvus 协调器节点默认情况下不会横向扩展。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>:API 网关 + 请求路由器</h3><p><code translate="no">proxy</code> 处理面向客户端的请求、请求验证和结果聚合。</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>:限制每个 Collections 的字段（标量 + 向量）数量。保持在 64 个以下，以尽量减少 Schema 复杂性和 I/O 开销。</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>:控制 Collections 中向量字段的数量。Milvus 支持多模式搜索，但在实践中，10 个向量字段是一个安全的上限。</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:定义摄取分片的数量。经验法则是</p>
<ul>
<li><p>&lt; 2 亿条记录 → 1 个分片</p></li>
<li><p>2-4 亿条记录 → 2 个分区</p></li>
<li><p>超出后线性扩展</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>:启用后，会记录详细的请求信息（用户、IP、端点、SDK）。有助于审计和调试。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>:查询执行</h3><p>处理向量搜索执行和段加载。请注意以下参数。</p>
<ul>
<li><code translate="no">queryNode.mmap</code>:为加载标量字段和数据段切换内存映射 I/O。启用<code translate="no">mmap</code> 有助于减少内存占用，但如果磁盘 I/O 成为瓶颈，可能会降低延迟。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>:分段 + 索引管理</h3><p>该参数控制数据分段、索引、压缩和垃圾收集（GC）。主要配置参数包括</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>:指定内存数据段的最大大小。较大的数据段通常意味着系统中的总数据段较少，这可以通过减少索引和搜索开销来提高查询性能。例如，一些使用 128GB 内存运行<code translate="no">queryNode</code> 实例的用户报告说，将该设置从 1GB 增加到 8GB，查询性能大约提高了 4 倍。</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>:与上述参数类似，该参数专门控制<a href="https://milvus.io/docs/disk_index.md#On-disk-Index">磁盘索引</a>（diskann 索引）的最大大小。</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>:确定增长的数据段何时被封存（即最终完成并建立索引）。当数据段的长度达到<code translate="no">maxSize * sealProportion</code> 时，该数据段将被封存。默认情况下，在<code translate="no">maxSize = 1024MB</code> 和<code translate="no">sealProportion = 0.12</code> 时，将封存约 123MB 的数据段。</p></li>
</ol>
<ul>
<li><p>较低的值（如 0.12）会更早触发封存，这有助于更快地创建索引，对频繁更新的工作负载很有用处。</p></li>
<li><p>较高的值（如 0.3 到 0.5）会延迟封存，减少索引开销，更适合离线或批量摄取的情况。</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  设置压缩过程中允许的扩展因子。Milvus 计算压缩过程中允许的最大数据段大小为<code translate="no">maxSize * expansionRate</code> 。</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>:段压缩或 Collections 丢弃后，Milvus 不会立即删除底层数据。相反，它会标记要删除的数据段，并等待垃圾收集 (GC) 周期完成。该参数可控制延迟时间的长短。</p></li>
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
<h2 id="Other-Functional-Configurations" class="common-anchor-header">其他功能配置<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>:可观察性和诊断</h3><p>健全的日志记录是任何分布式系统的基石，Milvus 也不例外。配置完善的日志设置不仅有助于在出现问题时进行调试，还能确保随着时间的推移更好地了解系统的健康状况和行为。</p>
<p>对于生产部署，我们建议将 Milvus 日志与集中式日志和监控工具（如<a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a>）集成，以简化分析和警报。关键设置包括</p>
<ol>
<li><p><code translate="no">log.level</code>:控制日志输出的冗长程度。对于生产环境，请坚持使用<code translate="no">info</code> 级别，以捕获重要的运行时细节，而不会使系统不堪重负。在开发或故障排除过程中，可以切换到<code translate="no">debug</code> ，以便更细致地了解内部操作。⚠️ 在生产环境中应谨慎使用<code translate="no">debug</code> 级别--它会生成大量日志，如果不加以控制，会迅速占用磁盘空间并降低 I/O 性能。</p></li>
<li><p><code translate="no">log.file</code>:默认情况下，Milvus 会将日志写入标准输出（stdout），这适合通过 sidecars 或节点代理收集日志的容器化环境。要启用基于文件的日志记录，可以配置以下内容：</p></li>
</ol>
<ul>
<li><p>旋转前的最大文件大小</p></li>
<li><p>文件保留期</p></li>
<li><p>要保留的备份日志文件数量</p></li>
</ul>
<p>这对于无法使用 stdout 日志传输的裸机或内部环境非常有用。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>:身份验证和访问控制</h3><p>Milvus 支持<a href="https://milvus.io/docs/authenticate.md?tab=docker">用户身份验证</a>和<a href="https://milvus.io/docs/rbac.md">基于角色的访问控制（RBAC）</a>，两者都在<code translate="no">common</code> 模块下配置。这些设置对于保护多租户环境或任何暴露于外部客户端的部署至关重要。</p>
<p>主要参数包括</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>:此切换可启用或禁用身份验证和 RBAC。默认情况下是关闭的，这意味着允许所有操作而无需身份检查。要执行安全访问控制，请将此参数设置为<code translate="no">true</code> 。</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>:启用身份验证后，此设置将定义内置<code translate="no">root</code> 用户的初始密码。</p></li>
</ol>
<p>启用身份验证后，请务必立即更改默认密码，以避免在生产环境中出现安全漏洞。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>:速率限制和写入控制</h3><p><code translate="no">milvus.yaml</code> 中的<code translate="no">quotaAndLimits</code> 部分在控制数据如何流经系统方面起着至关重要的作用。它管理插入、删除、刷新和查询等操作的速率限制，确保群集在繁重工作负载下的稳定性，并防止因写放大或过度压缩而导致性能下降。</p>
<p>主要参数包括</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>:控制 Milvus 从 Collections 中刷新数据的频率。</p>
<ul>
<li><p><strong>默认值</strong>为<code translate="no">0.1</code>表示系统允许每 10 秒刷新一次。</p></li>
<li><p>刷新操作会封存不断增长的数据段，并将其从消息队列持久化到对象存储空间。</p></li>
<li><p>过于频繁地刷新会产生许多小的封存段，从而增加压缩开销并降低查询性能。</p></li>
</ul>
<p>💡 最佳实践：在大多数情况下，让 Milvus 自动处理。不断增长的数据段一旦达到<code translate="no">maxSize * sealProportion</code> 就会被封存，封存的数据段每 10 分钟刷新一次。只有在知道没有更多数据时，才建议在批量插入后进行手动刷新。</p>
<p>此外，请记住：<strong>数据可见性是</strong>由查询的<em>一致性级别</em>决定的，而不是刷新时间，因此刷新并不会使新数据立即可查询。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code> ：这些参数定义了上载和删除操作的最大允许速率。</p>
<ul>
<li><p>Milvus 依赖于 LSM-Tree 存储架构，这意味着频繁的更新和删除会触发压缩。如果管理不慎，这可能会耗费大量资源，并降低总体吞吐量。</p></li>
<li><p>建议将<code translate="no">upsertRate</code> 和<code translate="no">deleteRate</code> 的速度上限设定为<strong>0.5 MB/s</strong>，以避免压缩管道不堪重负。</p></li>
</ul>
<p>🚀 需要快速更新大型数据集？使用 Collections 别名策略：</p>
<ul>
<li><p>将新数据插入一个全新的 Collection。</p></li>
<li><p>更新完成后，将别名重新指向新的 Collections。这样可以避免就地更新带来的压缩惩罚，并实现即时切换。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">真实世界配置示例<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们通过两个常见的部署场景，来说明如何调整 Milvus 配置设置，以满足不同的操作目标。</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">示例 1：高性能配置</h3><p>当查询延迟对任务至关重要时--想想推荐引擎、语义搜索平台或实时风险评分--每一毫秒都很重要。在这些使用案例中，您通常会使用<strong>HNSW</strong>或<strong>DISKANN</strong> 等基于图的索引，并优化内存使用和段生命周期行为。</p>
<p>主要调整策略：</p>
<ul>
<li><p>提高<code translate="no">dataCoord.segment.maxSize</code> 和<code translate="no">dataCoord.segment.diskSegmentMaxSize</code> ：根据可用内存，将这些值提高到 4GB 甚至 8GB。较大的分段可减少索引建立次数，并通过最大限度地减少分段扇出提高查询吞吐量。不过，更大的分段在查询时会消耗更多内存，因此要确保<code translate="no">indexNode</code> 和<code translate="no">queryNode</code> 实例有足够的空间。</p></li>
<li><p>降低<code translate="no">dataCoord.segment.sealProportion</code> 和<code translate="no">dataCoord.segment.expansionRate</code> ：在封存之前，将不断增长的分段大小锁定在 200MB 左右。这样可以保持段内存使用的可预测性，并减轻委托者（负责协调分布式搜索的查询节点领导者）的负担。</p></li>
</ul>
<p>经验法则当内存充裕且延迟是优先考虑因素时，应选择更少、更大的数据段。如果索引的新鲜度很重要，则在密封阈值方面要保守一些。</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰示例 2：成本优化配置</h3><p>如果您优先考虑的是成本效率而不是原始性能（常见于模型训练管道、低 QPS 内部工具或长尾图像搜索），您可以在召回率或延迟之间进行权衡，以大幅降低对基础架构的需求。</p>
<p>推荐策略：</p>
<ul>
<li><p><strong>使用索引量化：</strong> <code translate="no">SCANN</code> 、<code translate="no">IVF_SQ8</code> 或<code translate="no">HNSW_PQ/PRQ/SQ</code> （Milvus 2.5 中引入）等索引类型可显著减少索引大小和内存占用。对于精度不如规模或预算重要的工作负载来说，这些类型是理想之选。</p></li>
<li><p><strong>采用磁盘支持索引策略：</strong>将索引类型设置为<code translate="no">DISKANN</code> ，以启用纯磁盘搜索。<strong>启用</strong> <code translate="no">mmap</code> ，进行选择性内存卸载。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>为节省大量内存，请启用<code translate="no">mmap</code> ：<code translate="no">vectorField</code>,<code translate="no">vectorIndex</code>,<code translate="no">scalarField</code>, 和<code translate="no">scalarIndex</code> 。这样可以将大块数据卸载到虚拟内存，从而大幅减少常驻内存的使用。</p>
<p>⚠️ 注意事项：如果标量过滤是查询工作负载的主要部分，请考虑对<code translate="no">vectorIndex</code> 和<code translate="no">scalarIndex</code> 禁用<code translate="no">mmap</code> 。在 I/O 受限的环境中，内存映射会降低标量查询性能。</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">磁盘使用提示</h4><ul>
<li><p>使用<code translate="no">mmap</code> 建立的 HNSW 索引最多可将总数据量扩大<strong>1.8 倍</strong>。</p></li>
<li><p>如果考虑到索引开销和缓存，100GB 的物理磁盘实际上只能容纳 ~50GB 的有效数据。</p></li>
<li><p>在使用<code translate="no">mmap</code> 时，一定要预留额外的存储空间，尤其是在本地缓存原始向量的情况下。</p></li>
</ul>
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
    </button></h2><p>调整 Milvus 并不是追求完美的数字，而是要根据工作负载的实际行为来塑造系统。最有影响力的优化通常来自于了解 Milvus 如何在压力下处理 I/O、段生命周期和索引。这些都是错误配置伤害最大的地方，也是经过深思熟虑的调整能获得最大回报的地方。</p>
<p>如果你是 Milvus 的新用户，我们介绍的配置参数将满足你 80-90% 的性能和稳定性需求。从这里开始。一旦建立了一定的直觉，请深入研究<code translate="no">milvus.yaml</code> 完整的规范和官方文档，您将发现细粒度的控制，这些控制可以将您的部署从功能性提升到卓越性。</p>
<p>有了正确的配置，您就可以根据操作的优先级构建可扩展的高性能向量搜索系统--无论是低延迟服务、高性价比存储，还是高测试分析工作负载。</p>
