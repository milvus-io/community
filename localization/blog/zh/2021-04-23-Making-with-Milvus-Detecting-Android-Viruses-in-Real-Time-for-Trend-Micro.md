---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: 与 Milvus 合作为趋势科技实时检测安卓病毒
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: 了解如何利用 Milvus 缓解对关键数据的威胁，并通过实时病毒检测加强网络安全。
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>与Milvus合作：为趋势科技实时检测安卓病毒</custom-h1><p>2020 年，<a href="https://www.getapp.com/resources/annual-data-security-report/">86% 的公司</a>对数据隐私的担忧会增加，仅有<a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23% 的消费者</a>认为他们的个人数据非常安全。随着恶意软件变得越来越普遍和复杂，积极主动的威胁检测方法变得至关重要。<a href="https://www.trendmicro.com/en_us/business.html">趋势科技</a>是混合云安全、网络防御、小型企业安全和端点安全领域的全球领导者。为了保护安卓设备免受病毒侵害，该公司开发了趋势科技移动安全（Trend Micro Mobile Security）--一款移动应用程序，可将谷歌应用商店（Google Play Store）中的APK（安卓应用程序包）与已知恶意软件数据库进行比较。病毒检测系统的工作原理如下：</p>
<ul>
<li>从 Google Play 商店抓取外部 APK（安卓应用程序包）。</li>
<li>已知的恶意软件被转换成向量并存储在<a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a> 中。</li>
<li>新的 APK 也会被转换成向量，然后使用相似性搜索与恶意软件数据库进行比较。</li>
<li>如果一个 APK 向量与任何一个恶意软件向量相似，该程序就会向用户提供有关病毒及其威胁级别的详细信息。</li>
</ul>
<p>为了发挥作用，该系统必须在海量向量数据集上实时执行高效的相似性搜索。最初，趋势科技使用的是<a href="https://www.mysql.com/">MySQL</a>。然而，随着其业务的扩展，数据库中存储的带有邪恶代码的 APK 数量也在增加。该公司的算法团队在迅速淘汰 MySQL 后，开始寻找其他向量相似性搜索解决方案。</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">向量相似性搜索解决方案比较</h3><p>目前有很多向量相似性搜索解决方案，其中很多都是开源的。虽然不同项目的情况各不相同，但大多数用户都能从利用为非结构化数据处理和分析而构建的向量数据库中获益，而不是利用需要大量配置的简单库。下面我们将比较一些流行的向量相似性搜索解决方案，并解释趋势科技选择 Milvus 的原因。</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a>是 Facebook AI Research 开发的一个库，可以对密集向量进行高效的相似性搜索和聚类。它所包含的算法以集合的形式搜索任意大小的向量。Faiss 是用 C++ 编写的，带有 Python/numpy 封装程序，支持多种索引，包括 IndexFlatL2、IndexFlatIP、HNSW 和 IVF。</p>
<p>虽然 Faiss 是一款非常有用的工具，但它也有局限性。它只能作为一个基本算法库，而不是管理向量数据集的数据库。此外，它不提供分布式版本、监控服务、SDK 或高可用性，而这些正是大多数基于云的服务的主要特点。</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">基于 Faiss 和其他 ANN 搜索库的插件</h4><p>在 Faiss、NMSLIB 和其他 ANN 搜索库的基础上构建了一些插件，这些插件旨在增强为其提供支持的底层工具的基本功能。Elasticsearch (ES) 是基于 Lucene 库的搜索引擎，其中包含大量此类插件。下面是 ES 插件的架构图：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>对分布式系统的内置支持是 ES 解决方案的一大优势。由于无需编写代码，这为开发人员节省了时间和公司成本。ES 插件在技术上非常先进，而且非常普遍。Elasticsearch 提供一种 QueryDSL（特定领域语言），它基于 JSON 定义查询，易于掌握。全套 ES 服务使得同时进行向量/文本搜索和标量数据过滤成为可能。</p>
<p>亚马逊、阿里巴巴和网易是目前依靠 Elasticsearch 插件进行向量相似性搜索的几家大型科技公司。这种解决方案的主要缺点是内存消耗大，而且不支持性能调整。相比之下，<a href="http://jd.com/">JD.com</a>基于 Faiss 开发了自己的分布式解决方案，名为<a href="https://github.com/vearch/vearch">Vearch</a>。不过，Vearch 仍处于孵化阶段，其开源社区也相对不活跃。</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus</a>是由<a href="https://zilliz.com">Zilliz</a> 创建的开源向量数据库。它高度灵活、可靠、快速。通过封装 Faiss、NMSLIB 和 Annoy 等多个广泛采用的索引库，Milvus 提供了一套全面直观的 API，允许开发人员根据自己的场景选择理想的索引类型。它还提供分布式解决方案和监控服务。Milvus 拥有一个高度活跃的开源社区，在<a href="https://github.com/milvus-io/milvus">Github</a> 上有 5.5K 多颗星。</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus 优于竞争对手</h4><p>我们从上述各种向量相似性搜索解决方案中整理出了一些不同的测试结果。从下面的对比表中我们可以看到，尽管是在 10 亿个 128 维向量的数据集上进行测试，Milvus 的速度还是明显快于竞争对手。</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>引擎</strong></th><th style="text-align:left"><strong>性能（毫秒）</strong></th><th style="text-align:left"><strong>数据集大小（百万）</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + 阿里云</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">不好</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>向量相似性搜索解决方案比较。</em></h6><p>在权衡了每种解决方案的优缺点后，趋势科技最终选择 Milvus 作为其向量检索模型。Milvus 在海量、十亿规模的数据集上表现出色，该公司选择 Milvus 作为需要实时向量相似性搜索的移动安全服务的原因显而易见。</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">设计实时病毒检测系统</h3><p>趋势科技的 MySQL 数据库中存储了 1,000 多万个恶意 APK，每天新增的 APK 有 10 万个。该系统的工作原理是提取并计算 APK 文件中不同组件的 Thash 值，然后使用 Sha256 算法将其转换为二进制文件，并生成 256 位 Sha256 值，将 APK 与其他 APK 区分开来。由于 Sha256 值因 APK 文件而异，因此一个 APK 可以有一个组合的 Thash 值和一个唯一的 Sha256 值。</p>
<p>Sha256 值仅用于区分 APK，而 Thash 值则用于向量相似性检索。相似的 APK 可能有相同的 Thash 值，但有不同的 Sha256 值。</p>
<p>为了检测带有恶意代码的 APK，趋势科技开发了自己的系统，用于检索相似的 Thash 值和相应的 Sha256 值。趋势科技选择 Milvus 对从 Thash 值转换而来的海量向量数据集进行瞬时向量相似性搜索。运行相似性搜索后，在 MySQL 中查询相应的 Sha256 值。架构中还添加了 Redis 缓存层，将 Thash 值映射为 Sha256 值，大大缩短了查询时间。</p>
<p>以下是趋势科技移动安全系统的架构图。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>选择合适的距离度量有助于提高向量分类和聚类性能。下表显示了二进制向量的<a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">距离度量</a>和相应的索引。</p>
<table>
<thead>
<tr><th><strong>距离度量</strong></th><th><strong>索引类型</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard<br/> - Tanimoto<br/> - Hamming</td><td>- 平面<br/> - ivf_flat</td></tr>
<tr><td>- 上层结构<br/> - 下层结构</td><td>平面</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>二进制向量的距离度量和索引。</em></h6><p><br/></p>
<p>趋势科技将 Thash 值转换为二进制向量并存储在 Milvus 中。在这种情况下，趋势科技使用汉明距离来比较向量。</p>
<p>Milvus 很快将支持字符串向量 ID，整数 ID 不必映射到字符串格式的相应名称。这样就不需要 Redis 缓存层，系统架构也不会那么笨重。</p>
<p>趋势科技采用了基于云的解决方案，并在<a href="https://kubernetes.io/">Kubernetes</a> 上部署了许多任务。为了实现高可用性，趋势科技使用了用 Python 开发的 Milvus 集群分片中间件<a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards</a>。</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Milvus 中的 Mishards 架构&quot;)。</p>
<p><br/></p>
<p>趋势科技通过将所有向量存储在<a href="https://aws.amazon.com/">AWS</a> 提供的<a href="https://aws.amazon.com/efs/">EFS</a>（弹性文件系统）中，实现了存储和距离计算的分离。这种做法是业界的流行趋势。Kubernetes 用于启动多个读取节点，并在这些读取节点上开发 LoadBalancer 服务，以确保高可用性。</p>
<p>为了保持数据一致性，Mishards 只支持一个写节点。不过，支持多个写节点的分布式版本 Milvus 将在未来几个月内推出。</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">监控和警报功能</h3><p>Milvus 兼容基于<a href="https://prometheus.io/">Prometheus</a> 构建的监控系统，并使用时间序列分析开源平台<a href="https://grafana.com/">Grafana</a> 来可视化各种性能指标。</p>
<p>Prometheus 监控并存储以下指标：</p>
<ul>
<li>Milvus 性能指标，包括插入速度、查询速度和 Milvus 正常运行时间。</li>
<li>系统性能指标，包括 CPU/GPU 使用率、网络流量和磁盘访问速度。</li>
<li>硬件存储指标，包括数据大小和文件总数。</li>
</ul>
<p>监控和警报系统的工作原理如下：</p>
<ul>
<li>Milvus 客户端向 Pushgateway 推送自定义指标数据。</li>
<li>Pushgateway 可确保安全地向 Prometheus 发送短期、短暂的指标数据。</li>
<li>Prometheus 不断从 Pushgateway 提取数据。</li>
<li>Alertmanager 为不同指标设置警报阈值，并通过电子邮件或消息发出警报。</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">系统性能</h3><p>自基于 Milvus 的 ThashSearch 服务首次推出以来，几个月过去了。下图显示，端到端查询延迟小于 95 毫秒。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>插入也很快。插入 300 万个 192 维向量大约需要 10 秒钟。在 Milvus 的帮助下，系统性能能够达到趋势科技设定的性能标准。</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">不做陌生人</h3><ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上查找 Milvus 或为其做出贡献。</li>
<li>通过<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 与社区互动。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上与我们联系。</li>
</ul>
