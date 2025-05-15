---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: 我们为 Milvus 用啄木鸟替换了卡夫卡/普尔萨--结果如下
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: 我们构建了云原生 WAL 系统 Woodpecker，以取代 Milvus 中的 Kafka 和 Pulsar，从而降低操作复杂性和成本。
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>简要说明：</strong>我们在 Milvus 2.6 中构建了啄木鸟（Woodpecker）--一个云原生的先写日志（WAL）系统，以取代 Kafka 和 Pulsar。结果如何？为我们的 Milvus 向量数据库简化了操作、提高了性能、降低了成本。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">起点：当消息队列不再适用时<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>我们喜欢并使用 Kafka 和 Pulsar。它们一直在发挥作用，直到它们不再适用。随着 Milvus（领先的开源向量数据库）的发展，我们发现这些强大的消息队列不再符合我们的可扩展性要求。于是，我们做出了一个大胆的举动：我们重写了 Milvus 2.6 中的流式骨干网，并实现了我们自己的 WAL -<strong>Woodpecker</strong>。</p>
<p>让我带领大家回顾一下我们的历程，并解释一下我们为什么要做出这种乍看之下可能有悖直觉的改变。</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">从第一天起就是云原生的<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 从一开始就是云原生向量数据库。我们利用 Kubernetes 进行弹性扩展和快速故障恢复，并利用亚马逊 S3 和 MinIO 等对象存储解决方案进行数据持久化。</p>
<p>这种云优先的方法具有巨大的优势，但也带来了一些挑战：</p>
<ul>
<li><p>S3 等云对象存储服务提供了几乎无限的吞吐量和可用性处理能力，但延迟往往超过 100 毫秒。</p></li>
<li><p>这些服务的定价模型（基于访问模式和频率）会给实时数据库操作增加意想不到的成本。</p></li>
<li><p>要在云原生特性与实时向量搜索需求之间取得平衡，在架构上面临着巨大的挑战。</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">共享日志架构：我们的基础<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>许多向量搜索系统都仅限于批处理，因为在云原生环境中构建流式系统会面临更大的挑战。相比之下，Milvus 将实时数据的新鲜度放在首位，并实现了共享日志架构--把它想象成文件系统的硬盘驱动器。</p>
<p>这种共享日志架构提供了一个重要的基础，将共识协议与核心数据库功能分离开来。通过采用这种方法，Milvus 无需直接管理复杂的共识协议，从而使我们能够专注于提供卓越的向量搜索功能。</p>
<p>我们并不是唯一采用这种架构模式的公司--AWS Aurora、Azure Socrates 和 Neon 等数据库都采用了类似的设计。<strong>然而，开源生态系统中仍存在一个重大空白：尽管这种方法具有明显的优势，但社区缺乏低延迟、可扩展和经济高效的分布式先写日志（WAL）实现。</strong></p>
<p>事实证明，Bookie 等现有解决方案无法满足我们的需求，因为它们采用了重量级的客户端设计，而且没有适用于 Golang 和 C++ 的可用于生产的 SDK。这一技术差距导致我们最初采用了消息队列方法。</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL-and-Its-Limitations" class="common-anchor-header">我们最初的解决方案：作为 WAL 的消息队列及其局限性<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL-and-Its-Limitations" class="anchor-icon" translate="no">
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
    </button></h2><p>为了弥补这一差距，我们最初采用了消息队列（Kafka/Pulsar）作为前写日志（WAL）。该架构是这样工作的：</p>
<ul>
<li><p>所有传入的实时更新都流经消息队列。</p></li>
<li><p>消息队列接受更新后，写入者会立即收到确认。</p></li>
<li><p>查询节点（QueryNode）和数据节点（DataNode）异步处理这些数据，确保高写入吞吐量的同时保持数据的新鲜度。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图Milvus 2.0 架构概览</p>
<p>该系统在实现异步数据处理的同时，有效地提供了即时写入确认，这对于保持 Milvus 用户所期望的吞吐量和数据新鲜度之间的平衡至关重要。</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">为什么我们需要不同的 WAL<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.6 的推出，我们决定逐步淘汰外部消息队列，转而使用啄木鸟（Woodpecker）--我们专门构建的云原生 WAL 实现。这不是我们轻易做出的决定。毕竟，我们已经成功使用 Kafka 和 Pulsar 多年。</p>
<p>问题并不在于这些技术本身--它们都是功能强大的优秀系统。相反，随着 Milvus 的发展，这些外部系统带来了越来越多的复杂性和开销，这才是我们面临的挑战。随着我们的需求越来越专业化，通用消息队列提供的功能与我们的向量数据库需求之间的差距不断扩大。</p>
<p>三个具体因素最终促使我们决定建立一个替代系统：</p>
<h3 id="Operational-Complexity" class="common-anchor-header">操作复杂性</h3><p>外部依赖性（如 Kafka 或 Pulsar）要求使用多节点的专用机器并进行细致的资源管理。这带来了几个挑战：</p>
<ul>
<li>操作复杂性增加</li>
</ul>
<ul>
<li>系统管理员的学习曲线更长</li>
</ul>
<ul>
<li>配置错误和安全漏洞的风险更高</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">架构限制</h3><p>Kafka 等消息队列对支持的主题数量有固有限制。我们开发了 VShard 作为跨组件共享主题的变通方法，但这一解决方案在有效满足扩展需求的同时，也带来了显著的架构复杂性。</p>
<p>这些外部依赖性增加了实现关键功能（如日志垃圾 Collections）的难度，也增加了与其他系统模块集成的摩擦。随着时间的推移，通用消息队列与向量数据库特定的高性能需求之间的架构不匹配问题越来越明显，促使我们重新评估我们的设计选择。</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">资源效率低下</h3><p>确保 Kafka 和 Pulsar 等系统的高可用性通常需要：</p>
<ul>
<li><p>跨多个节点的分布式部署</p></li>
<li><p>即使是较小的工作负载也需要大量的资源分配</p></li>
<li><p>存储短暂信号（如 Milvus 的 Timetick），这些信号实际上并不需要长期保留</p></li>
</ul>
<p>然而，这些系统缺乏灵活性，无法绕过此类短暂信号的持久性，从而导致不必要的 I/O 操作和存储使用。这会导致不成比例的资源开销和成本增加，尤其是在规模较小或资源有限的环境中。</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">介绍啄木鸟--云原生的高性能 WAL 引擎<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 2.6 中，我们用专门构建的云原生 WAL 系统<strong>Woodpecker</strong> 取代了 Kafka/Pulsar。Woodpecker 专为对象存储而设计，在提高性能和可扩展性的同时简化了操作符。</p>
<p>Woodpecker 从底层开始构建，旨在最大限度地发挥云原生存储的潜力，其重点目标是：成为针对云环境优化的最高吞吐量 WAL 解决方案，同时提供只写前置日志（append-only write-ahead log）所需的核心功能。</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">啄木鸟的零磁盘架构</h3><p>Woodpecker 的核心创新是其<strong>零磁盘架构</strong>：</p>
<ul>
<li><p>所有日志数据都存储在云对象存储（如亚马逊 S3、谷歌云存储或阿里巴巴操作系统）</p></li>
<li><p>通过分布式键值存储（如 etcd）管理元数据</p></li>
<li><p>核心操作不依赖本地磁盘</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图  啄木鸟架构概述</p>
<p>这种方法大大降低了操作符开销，同时最大限度地提高了耐用性和云效率。通过消除本地磁盘依赖性，Woodpecker 与云原生原则完美契合，并大大减轻了系统管理员的操作负担。</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">性能基准：超出预期</h3><p>我们运行了全面的基准测试，以评估啄木鸟在单节点、单客户端、单日志流设置下的性能。与 Kafka 和 Pulsar 相比，结果令人印象深刻：</p>
<table>
<thead>
<tr><th><strong>系统</strong></th><th><strong>卡夫卡</strong></th><th><strong>脉冲星</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP 本地</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>吞吐量</td><td>129.96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>延迟</td><td>58 毫秒</td><td>35 毫秒</td><td>184 毫秒</td><td>1.8 毫秒</td><td>166 毫秒</td></tr>
</tbody>
</table>
<p>我们在测试机上测量了不同存储后端理论吞吐量的极限，以供参考：</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 MB/s</p></li>
<li><p><strong>本地文件系统</strong>：600-750 MB/s</p></li>
<li><p><strong>亚马逊 S3（单个 EC2 实例）</strong>：高达 1.1 GB/s</p></li>
</ul>
<p>值得注意的是，啄木鸟对每个后端都持续实现了最大可能吞吐量的 60-80%，这对于中间件来说是一个非凡的效率水平。</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">关键性能洞察</h4><ol>
<li><p><strong>本地文件系统模式</strong>：啄木鸟实现了 450 MB/s 的速度，比 Kafka 快 3.5 倍，比 Pulsar 快 4.2 倍，超低延迟仅为 1.8 毫秒，是高性能单节点部署的理想选择。</p></li>
<li><p><strong>云存储模式（S3）</strong>：当直接写入 S3 时，啄木鸟的速度达到 750 MB/s（约为 S3 理论极限的 68%），比 Kafka 高 5.8 倍，比 Pulsar 高 7 倍。虽然延迟较高（166 毫秒），但这种设置为面向批处理的工作负载提供了出色的吞吐量。</p></li>
<li><p><strong>对象存储模式（MinIO）</strong>：即使使用 MinIO，啄木鸟的吞吐量也达到了 71 MB/s，约为 MinIO 容量的 65%。这一性能可与 Kafka 和 Pulsar 相媲美，但对资源的要求要低得多。</p></li>
</ol>
<p>Woodpecker 特别针对并发、大容量写入进行了优化，在这种情况下，保持顺序至关重要。这些结果仅仅反映了开发的早期阶段--I/O 合并、智能缓冲和预取方面的持续优化有望使性能更接近理论极限。</p>
<h3 id="Design-Goals" class="common-anchor-header">设计目标</h3><p>啄木鸟通过这些关键技术要求来满足实时向量搜索工作负载不断变化的需求：</p>
<ul>
<li><p>高吞吐量数据摄取和跨可用区的持久性</p></li>
<li><p>用于实时订阅的低延迟尾部读取和用于故障恢复的高吞吐量追赶读取</p></li>
<li><p>可插拔的存储后端，包括云对象存储和支持 NFS 协议的文件系统</p></li>
<li><p>灵活的部署选项，既支持轻量级独立设置，也支持用于多租户 Milvus 部署的大型集群</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">架构组件</h3><p>标准的啄木鸟部署包括以下组件。</p>
<ul>
<li><p><strong>客户端</strong>- 用于发出读写请求的接口层</p></li>
<li><p><strong>日志存储</strong>- 管理高速写缓冲、异步上传到存储和日志压缩</p></li>
<li><p><strong>存储后端</strong>- 支持可扩展、低成本的存储服务，如 S3、GCS 和 EFS 等文件系统</p></li>
<li><p><strong>ETCD</strong>- 跨分布式节点存储元数据并协调日志状态</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">灵活部署，满足您的特定需求</h3><p>啄木鸟提供两种部署模式，以满足您的特定需求：</p>
<p><strong>MemoryBuffer 模式 - 轻便、免维护</strong></p>
<p>MemoryBuffer 模式提供了一个简单、轻量级的部署选项，啄木鸟会在内存中临时缓冲写入的内容，并定期将它们刷新到云对象存储服务。元数据使用 etcd 管理，以确保一致性和协调性。这种模式最适合小规模部署或生产环境中批量繁重的工作负载，它们优先考虑的是简单性而不是性能，尤其是在低写入延迟并不重要的情况下。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图内存缓冲模式</em></p>
<p><strong>QuorumBuffer 模式--专为低延迟、高耐用性部署而优化</strong></p>
<p>QuorumBuffer 模式专为对延迟敏感的高频读/写工作负载而设计，既要求实时响应能力，又要求较强的容错能力。在这种模式下，啄木鸟作为一个高速写缓冲区，通过三个副本的法定人数写入，确保强大的一致性和高可用性。</p>
<p>写入一旦复制到三个节点中的至少两个，即被视为成功，通常在个位数毫秒内完成，之后数据会异步刷新到云对象存储，以获得长期持久性。这种架构最大限度地减少了节点上的状态，消除了对大型本地磁盘卷的需求，并避免了传统的基于法定人数的系统通常需要的复杂的反熵修复。</p>
<p>因此，它是一个精简、稳健的 WAL 层，非常适合对一致性、可用性和快速恢复要求极高的关键任务生产环境。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图QuorumBuffer 模式</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">流服务为实时数据流而构建<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>除了啄木鸟之外，Milvus 2.6 还引入了流<strong>服务（StreamingService）--一个</strong>专门用于日志管理、日志摄取和流数据订阅的组件。</p>
<p>要了解我们的新架构是如何工作的，就必须弄清楚这两个组件之间的关系：</p>
<ul>
<li><p><strong>Woodpecker</strong>是存储层，负责处理先写日志的实际持久性，提供持久性和可靠性。</p></li>
<li><p><strong>StreamingService</strong>是服务层，负责管理日志操作并提供实时数据流功能。</p></li>
</ul>
<p>它们共同构成了外部消息队列的完全替代品。Woodpecker 提供了持久的存储基础，而 StreamingService 则提供了应用程序可直接交互的高级功能。这种关注点的分离使每个组件都能针对其特定角色进行优化，同时作为一个集成系统无缝地协同工作。</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">为 Milvus 2.6 添加流服务</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图Milvus 2.6 架构中添加的流服务</p>
<p>流服务由三个核心组件组成：</p>
<p><strong>流协调器</strong></p>
<ul>
<li><p>通过监控 Milvus ETCD 会话发现可用的流节点</p></li>
<li><p>通过 ManagerService 管理 WAL 的状态并收集负载平衡指标</p></li>
</ul>
<p><strong>流客户端</strong></p>
<ul>
<li><p>查询 AssignmentService 以确定 WAL 段在流节点间的分布情况</p></li>
<li><p>通过相应流节点上的 HandlerService 执行读/写操作符</p></li>
</ul>
<p><strong>流节点</strong></p>
<ul>
<li><p>处理实际 WAL 操作，并为实时数据流提供发布-订阅功能</p></li>
<li><p>包括用于 WAL 管理和性能报告的<strong>ManagerService</strong></p></li>
<li><p><strong>处理程序服务（HandlerService</strong>）可为 WAL 条目实现高效的发布-订阅机制。</p></li>
</ul>
<p>这种分层架构使 Milvus 能够保持流功能（订阅、实时处理）与实际存储机制之间的明确分离。Woodpecker 处理日志存储的 "如何"，而 StreamingService 则管理日志操作的 "什么 "和 "何时"。</p>
<p>因此，流服务通过引入本地订阅支持，大大增强了 Milvus 的实时能力，无需外部消息队列。它通过整合查询和数据路径中以前重复的缓存来减少内存消耗，通过消除异步同步延迟来降低强一致性读取的延迟，并提高整个系统的可扩展性和恢复速度。</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">结论--零磁盘架构上的流处理<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>管理状态很难。有状态系统往往会牺牲弹性和可扩展性。在云原生设计中，越来越多的人接受的答案是将状态与计算解耦，允许各自独立扩展。</p>
<p>我们没有重新发明轮子，而是将持久、可扩展存储的复杂性委托给 AWS S3、Google Cloud Storage 和 MinIO 等服务背后的世界级工程团队。其中，S3 以其几乎无限的容量、11 个 9（99.999999999%）的耐用性、99.99% 的可用性和高吞吐量读/写性能而脱颖而出。</p>
<p>但是，即使是 "零磁盘 "架构也有取舍。对象存储仍然存在写入延迟高和小文件效率低的问题，这些限制在许多实时工作负载中仍未得到解决。</p>
<p>对于向量数据库来说，特别是那些支持关键任务 RAG、人工智能 Agents 和低延迟搜索工作负载的数据库，实时访问和快速写入是不可或缺的。这就是我们围绕啄木鸟和流服务重新架构 Milvus 的原因。这种转变简化了整个系统（面对现实吧--没有人愿意在向量数据库中维护一个完整的 Pulsar 堆栈），确保了数据的新鲜度，提高了成本效益，并加快了故障恢复速度。</p>
<p>我们相信，啄木鸟不仅仅是 Milvus 的一个组件，它还可以作为其他云原生系统的基础构件。随着云基础设施的发展，像 S3 Express 这样的创新可能会让我们更加接近理想：具有个位数毫秒写延迟的跨 AZ 持久性。</p>
<h2 id="Whats-Next" class="common-anchor-header">下一步<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>敬请期待即将发布的 Milvus 2.6，它将提供啄木鸟和更多强大功能。准备好体验改进的性能和简化的操作符了吗？请查看我们的<a href="https://milvus.io/docs"> 文档</a>，开始使用！也欢迎您加入<a href="https://discord.gg/milvus"> Discord</a>或<a href="https://github.com/milvus-io/milvus/discussions">GitHub</a>上的 Milvus 社区，提出问题或分享经验。</p>
<p>如果您在处理大规模关键任务向量搜索工作负载时遇到困难，我们很乐意为您提供帮助。<a href="https://milvus.io/office-hours"> 预约 Milvus Office Hours 会议</a>，与我们的工程团队讨论您的具体需求。</p>
