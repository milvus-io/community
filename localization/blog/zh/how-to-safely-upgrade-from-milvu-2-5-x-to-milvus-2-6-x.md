---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: 如何安全地从 Milvus 2.5.x 升级到 Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/milvus_upgrade_25x_to_26x_700x438_856ac6b75c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: 探索 Milvus 2.6 的新功能，包括架构变化和主要功能，并了解如何从 Milvus 2.5 进行滚动升级。
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a>已上线一段时间，事实证明它是该项目向前迈出的坚实一步。该版本带来了完善的架构、更强的实时性能、更低的资源消耗以及在生产环境中更智能的扩展行为。其中许多改进都是直接根据用户反馈形成的，2.6.x 的早期用户已经报告说，在繁重或动态工作负载下，搜索速度明显加快，系统性能更可预测。</p>
<p>对于运行 Milvus 2.5.x 并正在评估向 2.6.x 迁移的团队，本指南将是您的起点。它分解了架构上的差异，强调了 Milvus 2.6 中引入的关键功能，并提供了一个实用的逐步升级路径，旨在最大限度地减少操作中断。</p>
<p>如果您的工作负载涉及实时流水线、多模态或混合搜索或大规模向量操作，本博客将帮助您评估 2.6 是否符合您的需求--如果您决定继续升级，请放心升级，同时保持数据完整性和服务可用性。</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">从 Milvus 2.5 到 Milvus 2.6 的架构变化<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解升级工作流程本身之前，让我们先来了解一下 Milvus 2.6 中 Milvus 架构的变化。</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Milvus 2.5 架构</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.5 架构</span> </span></p>
<p>在 Milvus 2.5 中，流式和批处理工作流交织在多个工作节点上：</p>
<ul>
<li><p><strong>QueryNode</strong>处理历史查询<em>和</em>增量（流式）查询。</p></li>
<li><p><strong>数据节点（DataNode</strong>）处理历史数据的摄取时刷新<em>和</em>后台压缩。</p></li>
</ul>
<p>这种批处理和实时逻辑的混合使得批处理工作负载难以独立扩展。这还意味着流状态分散在多个组件中，造成同步延迟，使故障恢复复杂化，并增加了操作的复杂性。</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Milvus 2.6 架构</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.6 架构</span> </span></p>
<p>Milvus 2.6 引入了专门的<strong>流节点（StreamingNode</strong>），负责处理所有实时数据：消耗消息队列、写入增量段、提供增量查询和管理基于 WAL 的恢复。有了流节点的隔离，其余组件的作用就更加简洁、集中：</p>
<ul>
<li><p><strong>QueryNode</strong>现在<em>只</em>处理对历史数据段的批量查询。</p></li>
<li><p><strong>数据节点</strong>现在<em>只</em>处理历史数据任务，如压缩和索引构建。</p></li>
</ul>
<p>StreamingNode 吸收了在 Milvus 2.5 中分属 DataNode、QueryNode 甚至 Proxy 的所有与流相关的任务，从而提高了清晰度并减少了跨角色状态共享。</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x 与 Milvus 2.6.x：逐个组件比较</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>变化</strong></th></tr>
</thead>
<tbody>
<tr><td>协调器服务</td><td style="text-align:center">根协调器 / 查询协调器 / 数据协调器（或混合协调器）</td><td style="text-align:center">混合协调</td><td style="text-align:center">元数据管理和任务调度合并为单一的 MixCoord，简化了协调逻辑，降低了分布式复杂性。</td></tr>
<tr><td>访问层</td><td style="text-align:center">代理</td><td style="text-align:center">代理</td><td style="text-align:center">写入请求只通过流节点进行数据摄取。</td></tr>
<tr><td>工作节点</td><td style="text-align:center">-</td><td style="text-align:center">流节点</td><td style="text-align:center">专用流处理节点，负责所有增量（增长段）逻辑，包括：- 增量数据摄取- 增量数据查询- 将增量数据持久化到对象存储- 基于流的写入- 基于 WAL 的故障恢复</td></tr>
<tr><td></td><td style="text-align:center">查询节点</td><td style="text-align:center">查询节点</td><td style="text-align:center">批处理节点，仅处理历史数据查询。</td></tr>
<tr><td></td><td style="text-align:center">数据节点</td><td style="text-align:center">数据节点</td><td style="text-align:center">批量处理节点，只负责历史数据，包括压缩和建立索引。</td></tr>
<tr><td></td><td style="text-align:center">索引节点</td><td style="text-align:center">-</td><td style="text-align:center">索引节点并入数据节点，简化了角色定义和部署拓扑。</td></tr>
</tbody>
</table>
<p>简而言之，Milvus 2.6 在流式工作负载和批处理工作负载之间划清了界限，消除了 2.5 中出现的跨组件纠缠，创建了更具可扩展性和可维护性的架构。</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Milvus 2.6 功能亮点<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>在进入升级工作流程之前，先来快速了解一下 Milvus 2.6 带来了什么。<strong>该版本重点关注降低基础架构成本、提高搜索性能，以及使大型动态人工智能工作负载更易于扩展。</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">成本和效率改进</h3><ul>
<li><p><strong>主索引的</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>量化</strong>- 一种新的 1 位量化方法，可将向量索引压缩到原始大小的<strong>1/32</strong>。结合 SQ8 Rerankers，它可将内存使用率降低至 ~28%，将 QPS 提高 4 倍，并保持 ~95% 的召回率，从而显著降低硬件成本。</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>BM25 优化的</strong></a><strong>全文搜索</strong>--稀疏术语权向量支持本地 BM25 评分。与 Elasticsearch 相比，关键词搜索的运行<strong>速度提高了 3-4倍</strong>（在某些数据集上提高了<strong>7</strong> <strong>倍</strong>），同时将索引大小保持在原始文本数据的三分之一左右。</p></li>
<li><p><strong>JSON 路径索引与 JSON 切碎</strong>--嵌套 JSON 的结构化过滤现在大大加快，而且更可预测。预先索引的 JSON 路径将过滤延迟从<strong>140 毫秒→1.5 毫秒</strong>（P99：<strong>480 毫秒→10 毫秒</strong>）缩短，使混合向量搜索和元数据过滤的响应速度显著提高。</p></li>
<li><p><strong>扩展数据类型支持</strong>--添加 Int8 向量类型、<a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">几何字段</a>（POINT / LINESTRING / POLYGON）和结构数组。这些扩展支持地理空间工作负载、更丰富的元数据模型和更简洁的 Schema。</p></li>
<li><p><strong>针对部分更新的 Upsert</strong>- 现在，您可以使用单个主键调用插入或更新实体。部分更新只修改所提供的字段，从而减少了写入放大，简化了经常刷新元数据或嵌入的管道。</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">搜索和检索功能增强</h3><ul>
<li><p><strong>改进了文本处理和多语言支持：</strong>新的 Lindera 和 ICU 标记器改进了日语、韩语和<a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">多语言</a>文本处理。Jieba 现在支持自定义词典。<code translate="no">run_analyzer</code> 可帮助调试标记化行为，多语言分析器可确保跨语言搜索的一致性。</p></li>
<li><p><strong>高精度文本匹配：</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">短语匹配</a>通过可配置的斜率执行有序短语查询。新的<a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a>索引可加速 VARCHAR 字段和 JSON 路径上的子串和<code translate="no">LIKE</code> 查询，实现快速的部分文本和模糊匹配。</p></li>
<li><p><strong>时间感知和元数据感知 Reranking：</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">衰减排名器</a>（指数、线性、高斯）使用时间戳调整分数；<a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">提升排名器</a>应用元数据驱动的规则对结果进行提升或降级。两者都有助于在不改变基础数据的情况下对检索行为进行微调。</p></li>
<li><p><strong>简化的模型集成和自动向量化：</strong>通过与 OpenAI、Embedging Face 和其他嵌入提供商的内置集成，Milvus 可在插入和查询操作过程中自动矢量化文本。普通用例不再需要手动嵌入管道。</p></li>
<li><p><strong>标量字段的在线 Schema 更新：</strong>在现有 Collections 中添加新的标量字段，无需停机或重新加载，从而简化了随着元数据需求增长而发生的 Schema 演变。</p></li>
<li><p><strong>使用 MinHash 进行近似重复检测：</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a>+ LSH 可在大型数据集中实现高效的近似重复检测，而无需进行昂贵的精确比较。</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">架构和可扩展性升级</h3><ul>
<li><p><strong>用于冷热数据管理的</strong><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>分层存储</strong></a> <strong>：</strong>在 SSD 和对象存储中分离热数据和冷数据；支持懒加载和部分加载；无需在本地完全加载 Collections；降低资源使用率达 50%，并加快大型数据集的加载时间。</p></li>
<li><p><strong>实时流服务：</strong>增加了与 Kafka/Pulsar 集成的专用流节点，以实现连续摄取；实现即时索引和查询可用性；提高写吞吐量，加快故障恢复，以适应实时、快速变化的工作负载。</p></li>
<li><p><strong>增强的可扩展性和稳定性：</strong>Milvus 现在支持 100,000+ Collections，适用于大型多租户环境。基础架构升级--<a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a>（零磁盘 WAL）、<a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a>（降低 IOPS/内存）和<a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a>--提高了集群的稳定性，并实现了繁重工作负载下的可预测扩展。</p></li>
</ul>
<p>有关 Milvus 2.6 功能的完整列表，请查看<a href="https://milvus.io/docs/release_notes.md">Milvus 发布说明</a>。</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">如何从 Milvus 2.5.x 升级到 Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>为了在升级过程中尽可能保持系统的可用性，Milvus 2.5 集群应按以下顺序升级到 Milvus 2.6。</p>
<p><strong>1.首先启动流节点</strong></p>
<p>提前启动流节点。新的<strong>Delegator</strong>（查询节点中负责流数据处理的组件）必须移到 Milvus 2.6 流节点。</p>
<p><strong>2.升级 MixCoord</strong></p>
<p>将协调器组件升级到<strong>MixCoord</strong>。在此步骤中，MixCoord 需要检测工作节点的版本，以便在分布式系统内处理跨版本兼容性问题。</p>
<p><strong>3.升级查询节点</strong></p>
<p>查询节点的升级通常需要较长的时间。在这一阶段，Milvus 2.5 数据节点和索引节点可以继续处理 Flush 和索引构建等操作，有助于在升级查询节点的同时减轻查询端压力。</p>
<p><strong>4.升级数据节点</strong></p>
<p>一旦 Milvus 2.5 数据节点下线，Flush 操作将变得不可用，而 Growing Segments 中的数据可能会继续累积，直到所有节点完全升级到 Milvus 2.6。</p>
<p><strong>5.升级代理</strong></p>
<p>将代理升级到 Milvus 2.6 后，该代理上的写操作将一直不可用，直到所有集群组件都升级到 2.6。</p>
<p><strong>6.删除索引节点</strong></p>
<p>其他所有组件升级完成后，就可以安全地移除独立索引节点了。</p>
<p><strong>注意</strong></p>
<ul>
<li><p>从 DataNode 升级完成到 Proxy 升级完成，Flush 操作不可用。</p></li>
<li><p>从升级第一个 Proxy 到升级所有 Proxy 节点，某些写操作不可用。</p></li>
<li><p><strong>从 Milvus 2.5.x 直接升级到 2.6.6 时，由于 DDL 框架的变化，在升级过程中 DDL（数据定义语言）操作不可用。</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">如何使用 Milvus Operator 升级到 Milvus 2.6<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator</a>是一个开源 Kubernetes 操作符，它提供了一种可扩展、高可用的方式来部署、管理和升级目标 Kubernetes 集群上的整个 Milvus 服务栈。操作符管理的 Milvus 服务栈包括</p>
<ul>
<li><p>Milvus 核心组件</p></li>
<li><p>所需的依赖项，如 etcd、Pulsar 和 MinIO</p></li>
</ul>
<p>Milvus 操作符遵循标准的 Kubernetes 操作符模式。它引入 Milvus 自定义资源（CR），描述 Milvus 集群的理想状态，如版本、拓扑和配置。</p>
<p>控制器会持续监控集群，并将实际状态与 CR 中定义的理想状态进行核对。当进行更改（如升级 Milvus 版本）时，操作符会以受控和可重复的方式自动应用这些更改，从而实现自动升级和持续的生命周期管理。</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Milvus 定制资源（CR）示例</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">使用 Milvus Operator 从 Milvus 2.5 到 2.6 的滚动升级</h3><p>Milvus Operator 在集群模式下为<strong>从 Milvus 2.5 到 2.6 的滚动升级</strong>提供内置支持，调整其行为以适应 2.6 中引入的架构变化。</p>
<p><strong>1.升级场景检测</strong></p>
<p>在升级过程中，Milvus Operator 会根据集群规范确定目标 Milvus 版本。具体方法如下</p>
<ul>
<li><p>检查<code translate="no">spec.components.image</code> 中定义的图像标签，或</p></li>
<li><p>读取<code translate="no">spec.components.version</code></p></li>
</ul>
<p>然后，操作符会将此期望版本与当前运行的版本（记录在<code translate="no">status.currentImage</code> 或<code translate="no">status.currentVersion</code> 中）进行比较。如果当前版本为 2.5，而期望版本为 2.6，则操作符会将升级识别为 2.5 → 2.6 升级方案。</p>
<p><strong>2.滚动升级执行顺序</strong></p>
<p>当检测到 2.5 → 2.6 升级且升级模式设置为滚动升级 (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code> ，这是默认设置)时，Milvus 操作符会自动按照与 Milvus 2.6 架构一致的预定义顺序执行升级：</p>
<p>启动流节点 → 升级 MixCoord → 升级查询节点 → 升级数据节点 → 升级代理 → 删除索引节点 3.</p>
<p><strong>3.自动合并协调器</strong></p>
<p>Milvus 2.6 用一个 MixCoord 取代多个协调器组件。Milvus 操作符自动处理这一架构过渡。</p>
<p>当<code translate="no">spec.components.mixCoord</code> 配置完毕后，操作符会调出 MixCoord 并等待它准备就绪。一旦 MixCoord 可以完全操作，操作符就会优雅地关闭传统协调器组件--RootCoord、QueryCoord 和 DataCoord--无需任何人工干预即可完成迁移。</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">从 Milvus 2.5 升级到 2.6 的步骤</h3><p>1.将 Milvus Operator 升级到最新版本（在本指南中，我们使用的是<strong>1.3.3 版</strong>，这是在编写本指南时的最新版本。）</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2.合并协调器组件</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.确保群集运行 Milvus 2.5.16 或更高版本</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4.将 Milvus 升级到 2.6 版</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">如何使用 Helm 将 Milvus 升级到 2.6 版<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>使用 Helm 部署 Milvus 时，所有 Kubernetes<code translate="no">Deployment</code> 资源都会并行更新，没有保证执行顺序。因此，Helm 无法严格控制组件间的滚动升级顺序。因此，对于生产环境，强烈建议使用 Milvus 操作符。</p>
<p>Milvus 仍可使用 Helm 从 2.5 升级到 2.6，具体步骤如下。</p>
<p>系统要求</p>
<ul>
<li><p><strong>Helm 版本：</strong>≥ 3.14.0</p></li>
<li><p><strong>Kubernetes 版本：</strong>≥ 1.20.0</p></li>
</ul>
<p>1.将 Milvus Helm 图表升级到最新版本。在本指南中，我们使用的<strong>图表版本为 5.0.7</strong>，这是在编写本指南时的最新<strong>版本</strong>。</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2.如果集群部署了多个协调器组件，请先将 Milvus 升级到 2.5.16 或更高版本，并启用 MixCoord。</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3.将 Milvus 升级到 2.6 版</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">关于 Milvus 2.6 升级和操作符的常见问题<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus Helm 与 Milvus Operator - 我应该使用哪一个？</h3><p>对于生产环境，强烈推荐使用 Milvus Operator。</p>
<p>详情请参考官方指南：<a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">问题 2： 我应该如何选择消息队列（MQ）？</h3><p>推荐的 MQ 取决于部署模式和操作符：</p>
<p><strong>1.独立模式：</strong>对于成本敏感型部署，推荐使用 RocksMQ。</p>
<p><strong>2.集群模式</strong></p>
<ul>
<li><p><strong>Pulsar</strong>支持多租户，允许大型集群共享基础设施，并提供强大的横向扩展能力。</p></li>
<li><p><strong>Kafka</strong>拥有更成熟的生态系统，在大多数主要云平台上都提供托管 SaaS 产品。</p></li>
</ul>
<p><strong>3.啄木鸟（在 Milvus 2.6 中引入）：</strong>Woodpecker 消除了对外部消息队列的需求，降低了成本和操作复杂性。</p>
<ul>
<li><p>目前，只支持 Embedded Woodpecker 模式，该模式轻量级且易于操作。</p></li>
<li><p>对于 Milvus 2.6 独立部署，推荐使用 Woodpecker。</p></li>
<li><p>对于生产集群部署，建议使用即将推出的 Woodpecker 集群模式。</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">问题 3：升级期间能否切换消息队列？</h3><p>目前不支持在升级期间切换消息队列。未来版本将引入管理 API，以支持在 Pulsar、Kafka、Woodpecker 和 RocksMQ 之间切换。</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">问题 4：Milvus 2.6 需要更新速率限制配置吗？</h3><p>现有的速率限制配置仍然有效，也适用于新的流节点。无需更改。</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">问题 5：协调器合并后，监控角色或配置会改变吗？</h3><ul>
<li><p>监控角色保持不变 (<code translate="no">RootCoord</code>,<code translate="no">QueryCoord</code>,<code translate="no">DataCoord</code>)。</p></li>
<li><p>现有的配置选项继续像以前一样工作。</p></li>
<li><p>引入了一个新的配置选项<code translate="no">mixCoord.enableActiveStandby</code> ，如果没有明确设置，将返回到<code translate="no">rootcoord.enableActiveStandby</code> 。</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">问题 6：StreamingNode 的推荐资源设置是什么？</h3><ul>
<li><p>对于轻型实时摄取或偶尔的写入查询工作负载，较小的配置（如 2 个 CPU 内核和 8 GB 内存）就足够了。</p></li>
<li><p>对于重度实时摄取或连续写入和查询工作负载，建议分配与查询节点相当的资源。</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">问题 7：如何升级使用 Docker Compose 的独立部署？</h3><p>对于基于 Docker Compose 的独立部署，只需更新<code translate="no">docker-compose.yaml</code> 中的 Milvus 映像标签即可。</p>
<p>详情请参考官方指南：<a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a></p>
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
    </button></h2><p>Milvus 2.6 标志着架构和操作符的重大改进。Milvus 2.6 通过引入流节点（StreamingNode）将流处理和批处理分离开来，将协调器合并到 MixCoord 中，并简化了工作者角色，从而为大规模向量工作负载提供了一个更稳定、更可扩展、更易操作的基础。</p>
<p>这些架构上的变化使得升级--尤其是从 Milvus 2.5 升级--对顺序更加敏感。成功的升级取决于对组件依赖性和临时可用性限制的尊重。对于生产环境，Milvus Operator 是推荐的方法，因为它能自动进行升级排序并降低操作风险，而基于 Helm 的升级更适合非生产用例。</p>
<p>凭借增强的搜索功能、更丰富的数据类型、分层存储和改进的消息队列选项，Milvus 2.6 能够很好地支持需要实时摄取、高查询性能和大规模高效操作的现代人工智能应用。</p>
<p>对最新 Milvus 的任何功能有疑问或想深入了解？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">有关 Milvus 2.6 的更多资源<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 发布说明</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Milvus 2.6 网络研讨会录音：更快的搜索、更低的成本和更智能的扩展</a></p></li>
<li><p>Milvus 2.6 功能博客</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介绍 Embeddings 功能：Milvus 2.6如何简化向量化和语义搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus中的JSON粉碎：灵活的JSON过滤速度提高88.9倍</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解锁真正的实体级检索：Milvus 中新的结构阵列和 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">停止为冷数据付费：Milvus分层存储中的按需冷热数据加载可降低80%的成本</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">在Milvus中引入AISAQ：十亿级向量搜索的内存成本降低了3200倍</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">在Milvus中优化英伟达™（NVIDIA®）CAGRA：GPU-CPU混合方法实现更快的索引和更低的查询成本</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">介绍 Milvus Ngram 索引：针对 Agents 工作负载的更快关键词匹配和 LIKE 查询</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6 中的几何字段和 RTREE 将地理空间过滤和向量搜索结合在一起</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">真实世界中的向量搜索：如何高效过滤而不破坏恢复能力</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus 如何利用 RaBitQ 提供多 3 倍的查询服务</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准会说谎--向量数据库需要经受真正的考验</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们在 Milvus 中用啄木鸟取代了 Kafka/Pulsar--结果如何？</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器</a></p></li>
</ul></li>
</ul>
