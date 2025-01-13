---
id: Whats-Inside-Milvus-1.0.md
title: Milvus 1.0 包含哪些内容？
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: Milvus v1.0 现已发布。了解 Milvus 的基本原理以及 Milvus v1.0 的主要功能。
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>Milvus 1.0 内部有什么？</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvus 是一个开源向量数据库，旨在管理百万、十亿甚至万亿级的海量向量数据集。Milvus 应用广泛，涵盖新药发现、计算机视觉、自动驾驶、推荐引擎、聊天机器人等领域。</p>
<p>2021 年 3 月，Milvus 背后的公司 Zilliz 发布了该平台的首个长期支持版本--Milvus v1.0。经过几个月的广泛测试，世界上最流行的向量数据库的稳定生产就绪版本已准备就绪，进入黄金时间。这篇博客文章涉及 Milvus 的一些基本原理以及 v1.0 的主要功能。</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Milvus 发行版</h3><p>Milvus 有仅支持 CPU 的发行版和支持 GPU 的发行版。前者完全依赖 CPU 进行索引构建和搜索；后者可启用 CPU 和 GPU 混合搜索和索引构建，进一步加速 Milvus。例如，使用混合发行版，CPU 可用于搜索，GPU 可用于索引构建，从而进一步提高查询效率。</p>
<p>Milvus 的两个发行版都可以在 Docker 中使用。你既可以从 Docker 编译 Milvus（如果你的操作系统支持），也可以在 Linux 上从源代码编译 Milvus（不支持其他操作系统）。</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">嵌入向量</h3><p>向量在 Milvus 中以实体形式存储。每个实体有一个向量 ID 字段和一个向量字段。Milvus v1.0 仅支持整数向量 ID。在 Milvus 中创建 Collections 时，可自动生成或手动定义向量 ID。Milvus 可确保自动生成的向量 ID 是唯一的，但手动定义的 ID 可在 Milvus 内重复。如果手动定义 ID，用户有责任确保所有 ID 都是唯一的。</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">分区</h3><p>Milvus 支持在 Collections 中创建分区。在数据定期插入且历史数据并不重要的情况下（如流数据），分区可用于加速向量相似性搜索。一个 Collections 最多可以有 4,096 个分区。在特定分区内指定向量搜索可缩小搜索范围，并可能显著缩短查询时间，尤其是对于包含超过一万亿个向量的 Collections。</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">索引算法优化</h3><p>Milvus 建立在多个广泛采用的索引库之上，包括 Faiss、NMSLIB 和 Annoy。Milvus 远不止是这些索引库的基本封装。以下是对底层库的一些主要改进：</p>
<ul>
<li>使用 Elkan k-means 算法优化 IVF 索引性能。</li>
<li>FLAT 搜索优化。</li>
<li>支持 IVF_SQ8H 混合索引，可在不影响数据准确性的情况下将索引文件大小减少 75%。IVF_SQ8H 基于 IVF_SQ8，具有相同的召回率，但查询速度更快。它是专为 Milvus 设计的，以利用 GPU 的并行处理能力以及 CPU/GPU 协同处理之间的协同潜力。</li>
<li>动态指令集兼容性。</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">搜索、索引构建和 Milvus 的其他优化功能</h3><p>Milvus 进行了以下优化，以提高搜索和索引构建性能。</p>
<ul>
<li>当查询次数 (nq) 少于 CPU 线程数时，搜索性能将得到优化。</li>
<li>Milvus 会合并来自客户端的搜索请求，这些请求会使用相同的 topK 和搜索参数。</li>
<li>当收到搜索请求时，将暂停建立索引。</li>
<li>Milvus 会在启动时自动将 Collections 预加载到内存中。</li>
<li>可分配多个 GPU 设备来加速向量相似性搜索。</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">距离度量</h3><p>Milvus 是一个向量数据库，旨在为向量相似性搜索提供动力。该平台是针对 MLOps 和生产级人工智能应用而构建的。Milvus 支持多种用于计算相似性的距离度量，如欧氏距离（L2）、内积（IP）、杰卡德距离、谷本距离、汉明距离、上层结构和下层结构。后两种度量常用于分子搜索和人工智能驱动的新药发现。</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">对数</h3><p>Milvus 支持日志轮换。在系统配置文件 milvus.yaml 中，你可以设置单个日志文件的大小、日志文件的数量以及日志输出到 stdout 的位置。</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">分布式解决方案</h3><p>Mishards 是 Milvus 的分片中间件，是 Milvus 的分布式解决方案。 Mishards 有一个写节点和无限多个读节点，能释放服务器集群的计算潜力。其功能包括请求转发、读/写分片、动态/横向扩展等。</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">监控</h3><p>Milvus 与开源系统监控和警报工具包 Prometheus 兼容。Milvus 增加了对 Prometheus 中 Pushgateway 的支持，使 Prometheus 获取短时批量指标成为可能。监控和警报系统的工作原理如下：</p>
<ul>
<li>Milvus 服务器将定制的度量数据推送到 Pushgateway。</li>
<li>Pushgateway 确保将短暂指标数据安全发送到 Prometheus。</li>
<li>Prometheus 继续从 Pushgateway 提取数据。</li>
<li>Alertmanager 用于设置不同指标的警报阈值，并通过电子邮件或消息发送警报。</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">元数据管理</h3><p>Milvus 默认使用 SQLite 进行元数据管理。SQLite 在 Milvus 中实现，无需配置。在生产环境中，建议使用 MySQL 进行元数据管理。</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">参与我们的开源社区：</h3><ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上查找 Milvus 或为其做出贡献。</li>
<li>通过<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 与社区互动。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上与我们联系。</li>
</ul>
