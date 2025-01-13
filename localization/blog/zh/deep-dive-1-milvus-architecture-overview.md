---
id: deep-dive-1-milvus-architecture-overview.md
title: 为可扩展的相似性搜索建立向量数据库
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: 这是博客系列的第一篇，旨在深入探讨构建最受欢迎的开源向量数据库背后的思维过程和设计原则。
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由栾晓帆撰写，倪安琪和余晴转译。</p>
</blockquote>
<p><a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">据统计</a>，全球约有 80%-90% 的数据是非结构化数据。在互联网快速发展的推动下，预计未来几年非结构化数据将出现爆炸式增长。因此，企业迫切需要一个功能强大的数据库，帮助他们更好地处理和理解这类数据。然而，开发数据库总是说起来容易做起来难。本文旨在分享构建用于可扩展相似性搜索的开源云原生向量数据库 Milvus 的思考过程和设计原则。本文还详细介绍了 Milvus 的架构。</p>
<p>跳转到</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">非结构化数据需要完整的基础软件栈</a><ul>
<li><a href="#Vectors-and-scalars">向量和标量</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">从向量搜索引擎到向量数据库</a></li>
<li><a href="#A-cloud-native-first-approach">云原生的第一方法</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Milvus 2.0 的设计原则</a><ul>
<li><a href="#Log-as-data">日志即数据</a></li>
<li><a href="#Duality-of-table-and-log">表与日志的二元性</a></li>
<li><a href="#Log-persistency">日志持久性</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">为可扩展的相似性搜索建立向量数据库</a><ul>
<li><a href="#Standalone-and-cluster">单机和集群</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus 架构的基本骨架</a></li>
<li><a href="#Data-Model">数据模型</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">非结构化数据需要完整的基础软件栈<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>随着互联网的发展和演变，非结构化数据变得越来越常见，包括电子邮件、论文、物联网传感器数据、Facebook 照片、蛋白质结构等。为了让计算机理解和处理非结构化数据，需要使用<a href="https://zilliz.com/learn/embedding-generation">Embeddings 技术</a>将这些数据转换成向量。</p>
<p>Milvus 对这些向量进行存储和索引，并通过计算两个向量的相似性距离来分析它们之间的相关性。如果两个嵌入向量非常相似，说明原始数据源也很相似。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>处理非结构化数据的工作流程</span>。 </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">向量和标量</h3><p>标量是一种只用一种测量方法（幅值）来描述的量。标量可以用数字表示。例如，一辆汽车以每小时 80 公里的速度行驶。在这里，速度（80km/h）就是一个标量。与此同时，向量是一个至少用两个量--大小和方向--来描述的量。如果一辆汽车以 80 km/h 的速度向西行驶，这里的速度（80 km/h 向西）就是一个向量。下图是常见标量和向量的示例。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>标量与向量</span> </span></p>
<p>由于大多数重要数据都有一个以上的属性，如果我们将这些数据转换成向量，就能更好地理解它们。我们处理向量数据的一个常用方法是使用欧氏距离、内积、谷本距离、汉明距离等<a href="https://milvus.io/docs/v2.0.x/metric.md">指标</a>计算向量之间的距离。距离越近，向量越相似。为了高效地查询海量向量数据集，我们可以通过建立向量索引来组织向量数据。在对数据集建立索引后，查询可以被路由到最有可能包含与输入查询相似的向量的数据集群或数据子集。</p>
<p>要了解有关索引的更多信息，请参阅<a href="https://milvus.io/docs/v2.0.x/index.md">向量索引</a>。</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">从向量搜索引擎到向量数据库</h3><p>从一开始，Milvus 2.0 的设计目的就不仅仅是作为一个搜索引擎，更重要的是作为一个功能强大的向量数据库。</p>
<p>有一种方法可以帮助你理解其中的区别，那就是类比<a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a>和<a href="https://www.mysql.com/">MySQL</a>，或者<a href="https://lucene.apache.org/">Lucene</a>和<a href="https://www.elastic.co/">Elasticsearch</a>。</p>
<p>就像 MySQL 和 Elasticsearch 一样，Milvus 也是建立在<a href="https://github.com/facebookresearch/faiss">Faiss</a>、<a href="https://github.com/nmslib/hnswlib">HNSW</a>、<a href="https://github.com/spotify/annoy">Annoy</a> 等开源库之上的，这些开源库的重点是提供搜索功能和确保搜索性能。不过，如果把 Milvus 仅仅贬低为 Faiss 上面的一层，那就有失公允了，因为它可以存储、检索、分析向量，而且与其他数据库一样，还为 CRUD 操作提供了标准接口。此外，Milvus 还拥有以下功能：</p>
<ul>
<li>分片和分区</li>
<li>复制</li>
<li>灾难恢复</li>
<li>负载平衡</li>
<li>查询解析器或优化器</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>向量数据库</span> </span></p>
<p>如需更全面地了解什么是向量数据库，请阅读<a href="https://zilliz.com/learn/what-is-vector-database">此处的</a>博客。</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">云原生方法</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>原生方法</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">从共享无到共享存储，再到共享有</h4><p>传统数据库过去采用 "无共享 "架构，即分布式系统中的节点相互独立，但通过网络连接。节点之间不共享内存或存储。然而，<a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a>引入了 "共享存储 "架构，将计算（查询处理）与存储（数据库存储）分开，从而彻底改变了整个行业。通过共享存储架构，数据库可以实现更高的可用性和可扩展性，并减少数据重复。受 Snowflake 的启发，许多公司开始利用基于云的基础设施进行数据持久化，同时使用本地存储进行缓存。这种数据库架构被称为 "共享的东西"（shared something），已成为当前大多数应用的主流架构。</p>
<p>除了 "共享的东西 "架构外，Milvus 还使用 Kubernetes 管理其执行引擎，并用微服务分离读、写和其他服务，从而支持每个组件的灵活扩展。</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">数据库即服务（DBaaS）</h4><p>数据库即服务是一个热门趋势，因为许多用户不仅关心常规的数据库功能，还渴望获得更多不同的服务。这意味着，除了传统的 CRUD 操作符，我们的数据库还要丰富服务类型，如数据库管理、数据传输、收费、可视化等。</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">与更广泛的开源生态系统协同合作</h4><p>数据库开发的另一个趋势是利用数据库与其他云原生基础设施之间的协同作用。就 Milvus 而言，它依赖于一些开源系统。例如，Milvus 使用<a href="https://etcd.io/">etcd</a>来存储元数据。它还采用了微服务架构中使用的一种异步服务对服务通信方式--消息队列，可以帮助导出增量数据。</p>
<p>未来，我们希望将 Milvus 构建在<a href="https://spark.apache.org/">Spark</a>或<a href="https://www.tensorflow.org/">Tensorflow</a> 等人工智能基础设施之上，并将 Milvus 与流引擎集成，从而更好地支持统一的流处理和批处理，满足 Milvus 用户的各种需求。</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Milvus 2.0 的设计原则<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>作为我们的下一代云原生向量数据库，Milvus 2.0 围绕以下三个原则构建。</p>
<h3 id="Log-as-data" class="common-anchor-header">日志即数据</h3><p>数据库中的日志会连续记录对数据所做的所有更改。如下图所示，从左到右依次是 &quot;旧数据 &quot;和 &quot;新数据&quot;。日志按时间顺序排列。Milvus 有一个全局计时器机制，分配一个全局唯一且自动递增的时间戳。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>日志</span> </span></p>
<p>在 Milvus 2.0 中，日志代理是系统的主干：所有数据插入和更新操作都必须经过日志代理，工作节点通过订阅和消费日志来执行 CRUD 操作。</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">表和日志的双重性</h3><p>表和日志都是数据，它们只是两种不同的形式。表是有界数据，而日志是无界数据。日志可以转换成表格。就 Milvus 而言，它使用 TimeTick 的处理窗口聚合日志。根据日志顺序，多个日志被聚合成一个称为日志快照的小文件。然后，这些日志快照被组合成一个段，可单独用于负载平衡。</p>
<h3 id="Log-persistency" class="common-anchor-header">日志持久性</h3><p>日志持久性是许多数据库面临的棘手问题之一。分布式系统中的日志存储通常取决于复制算法。</p>
<p>与<a href="https://aws.amazon.com/rds/aurora/">Aurora</a>、<a href="https://hbase.apache.org/">HBase</a>、<a href="https://www.cockroachlabs.com/">Cockroach DB</a> 和<a href="https://en.pingcap.com/">TiDB</a> 等数据库不同，Milvus 开创性地引入了发布-订阅（pub/sub）系统，用于日志存储和持久化。发布/订阅系统类似于<a href="https://kafka.apache.org/">Kafka</a>或<a href="https://pulsar.apache.org/">Pulsar</a> 中的消息队列。系统内的所有节点都可以使用日志。在 Milvus 中，这种系统被称为日志代理。有了日志代理，日志就能与服务器解耦，确保 Milvus 本身是无状态的，并能更好地从系统故障中快速恢复。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>日志代理</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">为可扩展的相似性搜索建立向量数据库<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 建立在流行的向量搜索库（包括 Faiss、ANNOY、HNSW 等）之上，专为在包含数百万、数十亿甚至数万亿向量的密集向量数据集上进行相似性搜索而设计。</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">独立和集群</h3><p>Milvus 提供两种部署方式--单机或集群。在 Milvus 单机版中，由于所有节点都部署在一起，因此我们可以把 Milvus 看作一个单独的进程。目前，Milvus Standalone 依赖 MinIO 和 etcd 进行数据持久化和元数据存储。在未来的版本中，我们希望取消这两个第三方依赖，以确保 Milvus 系统的简洁性。Milvus 集群包括八个微服务组件和三个第三方依赖项：MinIO、etcd 和 Pulsar。Pulsar 充当日志代理并提供日志发布/子服务。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>单机和集群</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Milvus 架构的基本骨架</h3><p>Milvus 将数据流与控制流分开，分为四层，在可扩展性和灾难恢复方面相互独立。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 架构</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">访问层</h4><p>访问层是系统的门面，向外界展示客户端连接的端点。它负责处理客户端连接、进行静态验证、对用户请求进行基本动态检查、转发请求、收集并向客户端返回结果。代理本身是无状态的，通过负载均衡组件（Nginx、Kubernetess Ingress、NodePort 和 LVS）向外部世界提供统一的访问地址和服务。Milvus 采用大规模并行处理（MPP）架构，代理在全局聚合和后处理后返回从工作节点收集的结果。</p>
<h4 id="Coordinator-service" class="common-anchor-header">协调器服务</h4><p>协调器服务是系统的大脑，负责集群拓扑节点管理、负载平衡、时间戳生成、数据声明和数据管理。有关每个协调器服务功能的详细说明，请阅读<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">Milvus 技术文档</a>。</p>
<h4 id="Worker-nodes" class="common-anchor-header">工作节点</h4><p>工作节点或执行节点充当系统的中枢，执行协调器服务发出的指令和代理启动的数据操作语言（DML）命令。Milvus 中的工作节点类似于<a href="https://hadoop.apache.org/">Hadoop</a> 中的数据节点或 HBase 中的区域服务器。每种类型的工作节点都对应一个协调服务。有关每个工作节点功能的详细解释，请阅读<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">Milvus 技术文档</a>。</p>
<h4 id="Storage" class="common-anchor-header">存储</h4><p>存储是 Milvus 的基石，负责数据持久化。存储层分为三个部分：</p>
<ul>
<li><strong>元存储：</strong>负责存储 Collections Schema、节点状态、消息消耗检查点等元数据的快照。Milvus 依靠 etcd 实现这些功能，Etcd 还承担服务注册和健康检查的责任。</li>
<li><strong>日志代理：</strong>支持回放的发布/子系统，负责流式数据持久化、可靠的异步查询执行、事件通知和返回查询结果。当节点执行宕机恢复时，日志代理通过日志代理回放确保增量数据的完整性。Milvus 集群使用 Pulsar 作为日志代理，而独立模式则使用 RocksDB。Kafka 和 Pravega 等流存储服务也可用作日志代理。</li>
<li><strong>对象存储：</strong>存储日志快照文件、标量/向量索引文件和中间查询处理结果。Milvus 支持<a href="https://aws.amazon.com/s3/">AWS S3</a>和<a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob</a>，以及轻量级开源对象存储服务<a href="https://min.io/">MinIO</a>。由于对象存储服务的访问延迟和每次查询计费较高，Milvus 将很快支持基于内存/SSD 的缓存池和冷热数据分离，以提高性能并降低成本。</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">数据模型</h3><p>数据模型组织数据库中的数据。在 Milvus 中，所有数据都是按 Collections、shard、partition、segment 和 entity 组织的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>数据模型 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">Collections</h4><p>在 Milvus 中，Collection 可以比作关系存储系统中的表。Collections 是 Milvus 中最大的数据单元。</p>
<h4 id="Shard" class="common-anchor-header">分区</h4><p>为了在写入数据时充分利用集群的并行计算能力，Milvus 中的 Collection 必须将数据写入操作分散到不同的节点上。默认情况下，一个 Collections 包含两个分片。根据你的数据集容量，你可以在一个 Collection 中拥有更多的分片。Milvus 使用主密钥散列方法进行分片。</p>
<h4 id="Partition" class="common-anchor-header">分区</h4><p>一个分区中也有多个分区。Milvus 中的分区指的是在一个 Collections 中标有相同标签的一组数据。常见的分区方法包括按日期、性别、用户年龄等进行分区。创建分区有利于查询过程，因为可以通过分区标签过滤大量数据。</p>
<p>相比之下，分片更注重写入数据时的扩展能力，而分区更注重提高读取数据时的系统性能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>数据模型 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">分区</h4><p>每个分区中都有多个小段。段是 Milvus 系统调度的最小单位。分段有两种类型，即增长分段和封存分段。增长段由查询节点订阅。Milvus 用户不断将数据写入成长段。当增长段的大小达到上限（默认为 512 MB）时，系统将不允许向该增长段写入额外数据，从而封存该段。索引建立在封存段上。</p>
<p>要实时访问数据，系统会读取增长数据段和密封数据段中的数据。</p>
<h4 id="Entity" class="common-anchor-header">实体</h4><p>每个数据段都包含大量实体。Milvus 中的实体相当于传统数据库中的一行。每个实体都有一个唯一的主键字段，也可以自动生成。实体还必须包含时间戳（ts）和向量字段--这是 Milvus 的核心。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">关于深入研究系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我们精心策划了这个 Milvus 深度剖析系列博客，对 Milvus 架构和源代码进行深入解读。本系列博客涉及的主题包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架构概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">应用程序接口和 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">数据处理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">数据管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">实时查询</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">标量执行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">质量保证系统</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量执行引擎</a></li>
</ul>
