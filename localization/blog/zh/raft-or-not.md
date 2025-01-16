---
id: raft-or-not.md
title: 筏还是不筏？云原生数据库数据一致性的最佳解决方案
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: 为什么基于共识的复制算法不是实现分布式数据库数据一致性的灵丹妙药？
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/xiaofan-luan">栾晓帆</a>撰写，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>转译。</p>
</blockquote>
<p>基于共识的复制是许多云原生分布式数据库广泛采用的策略。然而，它也有一定的缺陷，绝对不是万能的。</p>
<p>本文章旨在首先解释云原生分布式数据库中复制、一致性和共识的概念，然后阐明为什么 Paxos 和 Raft 等基于共识的算法不是灵丹妙药，最后提出<a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">基于共识的复制的解决方案</a>。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">了解复制、一致性和共识</a></li>
<li><a href="#Consensus-based-replication">基于共识的复制</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">云原生和分布式数据库的日志复制策略</a></li>
<li><a href="#Summary">摘要</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">了解复制、一致性和共识<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入探讨 Paxos 和 Raft 的优缺点并提出最合适的日志复制策略之前，我们需要先解开复制、一致性和共识等概念的神秘面纱。</p>
<p>请注意，本文主要关注增量数据/日志的同步。因此，在讨论数据/日志复制时，仅提及增量数据的复制，而不是历史数据的复制。</p>
<h3 id="Replication" class="common-anchor-header">复制</h3><p>复制是将数据复制多份并存储在不同磁盘、进程、机器、集群等中的过程，目的是提高数据可靠性并加速数据查询。由于在复制过程中，数据被复制并存储在多个位置，因此面对磁盘故障、物理机器故障或集群错误时，数据的可靠性更高。此外，多个数据副本还能大大加快查询速度，从而提高分布式数据库的性能。</p>
<p>复制有多种模式，如同步/异步复制、强一致性/最终一致性复制、领导者-追随者/分散复制。复制模式的选择会影响系统的可用性和一致性。因此，正如著名的<a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">CAP 定理</a>所提出的，当网络分区不可避免时，系统架构师需要在一致性和可用性之间做出权衡。</p>
<h3 id="Consistency" class="common-anchor-header">一致性</h3><p>简而言之，分布式数据库中的一致性是指在给定时间写入或读取数据时，确保每个节点或副本对数据具有相同视图的属性。有关一致性级别的完整列表，请阅读<a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">此处的</a>文档。</p>
<p>需要说明的是，这里我们讨论的是 CAP 定理中的一致性，而不是 ACID（原子性、一致性、隔离性、持久性）。CAP 定理中的一致性指的是系统中的每个节点都拥有相同的数据，而 ACID 中的一致性指的是单个节点对每个潜在提交执行相同的规则。</p>
<p>一般来说，OLTP（在线事务处理）数据库需要很强的一致性或线性化，以确保</p>
<ul>
<li>每次读取都能访问最新插入的数据。</li>
<li>如果在一次读取后返回了新值，那么接下来的所有读取（无论在相同或不同的客户端上）都必须返回新值。</li>
</ul>
<p>可线性化的本质是保证多个数据副本的再现性--一旦写入或读取了新值，所有后续读取都可以查看新值，直到该值后来被覆盖。提供线性化功能的分布式系统可以为用户省去关注多个副本的麻烦，并能保证每个操作的原子性和顺序。</p>
<h3 id="Consensus" class="common-anchor-header">共识</h3><p>共识的概念被引入分布式系统，因为用户渴望看到分布式系统以与独立系统相同的方式运行。</p>
<p>简单地说，共识就是对价值的普遍认同。例如，史蒂夫和弗兰克想去吃点东西。史蒂夫建议吃三明治。弗兰克同意了史蒂夫的建议，两人都吃了三明治。他们达成了共识。更具体地说，其中一人提出的价值（三明治）得到了两人的同意，两人都根据该价值采取了行动。同样，分布式系统中的共识指的是，当一个进程提出一个值时，系统中的所有其他进程都同意并根据这个值采取行动。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>共识</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">基于共识的复制<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>最早的基于共识的算法是在 1988 年与<a href="https://pmg.csail.mit.edu/papers/vr.pdf">视图标记复制</a>一起提出的。1989 年，Leslie Lamport 提出了基于共识的算法<a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos</a>。</p>
<p>近年来，我们看到了业界另一种流行的基于共识的算法--<a href="https://raft.github.io/">Raft</a>。它已被 CockroachDB、TiDB、OceanBase 等许多主流 NewSQL 数据库所采用。</p>
<p>值得注意的是，分布式系统即使采用基于共识的复制，也不一定支持线性化。但是，线性化是构建 ACID 分布式数据库的前提条件。</p>
<p>在设计数据库系统时，应考虑日志和状态机的提交顺序。此外，还需要格外小心地维护 Paxos 或 Raft 的领导者租约，防止网络分区下的分脑。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Raft 复制状态机</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">优点和缺点</h3><p>事实上，Raft、ZAB 和 Aurora 中<a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">基于法定人数的日志协议</a>都是 Paxos 的变体。基于共识的复制有以下优点：</p>
<ol>
<li>虽然基于共识的复制更注重 CAP 定理中的一致性和网络分区，但与传统的领导者-追随者复制相比，它能提供相对更好的可用性。</li>
<li>Raft 是一项突破，大大简化了基于共识的算法。GitHub 上有许多开源的 Raft 库（如<a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>）。</li>
<li>基于共识的复制的性能可以满足大多数应用和业务的需要。随着高性能 SSD 和千兆网卡（网络接口卡）的普及，同步多个副本的负担得以减轻，Paxos 和 Raft 算法成为业界主流。</li>
</ol>
<p>一个误解是，基于共识的复制是在分布式数据库中实现数据一致性的灵丹妙药。然而，事实并非如此。基于共识的算法在可用性、复杂性和性能方面面临的挑战使其无法成为完美的解决方案。</p>
<ol>
<li><p>可用性大打折扣 优化的 Paxos 或 Raft 算法对领导副本有很强的依赖性，因此对抗灰色故障的能力较弱。在基于共识的复制中，只有当领导节点长时间没有响应时，才会重新选举领导副本。因此，基于共识的复制无法处理领导节点速度慢或发生故障的情况。</p></li>
<li><p>复杂性高 虽然已经有很多基于 Paxos 和 Raft 的扩展算法，但<a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">多 Raft</a>和<a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">并行 Raft</a>的出现需要对日志和状态机之间的同步进行更多的考虑和测试。</p></li>
<li><p>性能受损 在云原生时代，本地存储被 EBS 和 S3 等共享存储解决方案所取代，以确保数据的可靠性和一致性。因此，基于共识的复制不再是分布式系统的必备条件。更重要的是，基于共识的复制会带来数据冗余的问题，因为解决方案和 EBS 都有多个副本。</p></li>
</ol>
<p>对于多数据中心和多云复制来说，追求一致性不仅会影响可用性，还会影响<a href="https://en.wikipedia.org/wiki/PACELC_theorem">延迟</a>，导致性能下降。因此，在大多数应用中，线性化并不是多数据中心容灾的必要条件。</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">云原生和分布式数据库的日志复制策略<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>不可否认，Raft 和 Paxos 等基于共识的算法仍是许多 OLTP 数据库采用的主流算法。不过，通过观察<a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a>协议、<a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a>和<a href="https://rockset.com/">Rockset</a> 等实例，我们可以发现趋势正在发生转变。</p>
<p>为云原生分布式数据库提供最佳服务的解决方案有两大原则。</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1.复制即服务</h3><p>需要一个单独的微服务，专门用于数据同步。同步模块和存储模块不应再紧密耦合在同一个流程中。</p>
<p>例如，Socrates 将存储、日志和计算解耦。只有一个专门的日志服务（下图中间的 XLog 服务）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>苏格拉底架构</span> </span></p>
<p>XLog 服务是一个单独的服务。借助低延迟存储实现数据持久化。Socrates 中的登陆区负责以更快的速度保存三个副本。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>苏格拉底 XLog 服务</span> </span></p>
<p>领导节点将日志异步分发到日志代理，并将数据刷新到 Xstore。本地固态硬盘缓存可加速数据读取。一旦数据刷新成功，就可以清理登陆区的缓冲区。显然，所有日志数据都分为三层--着陆区、本地固态硬盘和 Xstore。</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2.俄罗斯娃娃原理</h3><p>设计系统的一种方法是遵循俄罗斯娃娃原则：每一层都是完整的，完全适合该层所做的事情，这样就可以在其之上或周围构建其他层。</p>
<p>在设计云原生数据库时，我们需要巧妙地利用其他第三方服务来降低系统架构的复杂性。</p>
<p>要避免单点故障，我们似乎无法绕过 Paxos。不过，我们仍然可以通过将领导者选举交给 Raft 或基于<a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>、<a href="https://github.com/bloomreach/zk-replicator">Zk</a> 和<a href="https://etcd.io/">etcd</a> 的 Paxos 服务来大大简化日志复制。</p>
<p>例如，<a href="https://rockset.com/">Rockset</a>架构遵循俄罗斯娃娃原则，使用 Kafka/Kineses 处理分布式日志，使用 S3 进行存储，并使用本地 SSD 缓存来提高查询性能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Rockset 架构</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">Milvus 方法</h3><p>Milvus 中的可调一致性实际上与基于共识的复制中的跟随者读类似。从属读取功能是指在强一致性的前提下，使用从属副本承担数据读取任务。其目的是提高集群吞吐量，减少领导者的负载。从属读取功能背后的机制是查询最新日志的提交索引，并在提交索引中的所有数据应用到状态机之前提供查询服务。</p>
<p>不过，Milvus 的设计并未采用跟随者策略。换句话说，Milvus 不会在每次收到查询请求时都查询提交索引。相反，Milvus 采用了一种类似<a href="https://flink.apache.org/">Flink</a> 中水印的机制，即定期通知查询节点提交索引的位置。采用这种机制的原因是，Milvus 用户通常对数据一致性的要求不高，他们可以接受为了提高系统性能而在数据可见性方面做出的妥协。</p>
<p>此外，Milvus 还采用了多种微服务，并将存储与计算分离。在<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus 架构</a>中，S3、MinIo 和 Azure Blob 被用于存储。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 架构</span> </span></p>
<h2 id="Summary" class="common-anchor-header">概述<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>如今，越来越多的云原生数据库将日志复制作为一项单独的服务。这样做可以降低添加只读复制和异构复制的成本。使用多个微服务可以快速利用成熟的云基础架构，这是传统数据库无法做到的。单个日志服务可以依赖基于共识的复制，但也可以采用俄罗斯娃娃策略，与 Paxos 或 Raft 一起采用各种一致性协议，以实现线性化。</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Lamport L. Paxos made simple[J].ACM SIGACT News (Distributed Computing Column) 32, 4 (Whole Number 121, December 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. In search of an understandable consensus algorithm[C]//2014 USENIX Annual Technical Conference (Usenix ATC 14).2014:305-319.</li>
<li>Oki B M, Liskov B H. Viewstamped replication：A new primary copy method to support highly-available distributed systems[C]//Proceedings of the seventh annual ACM Symposium on Principles of distributed computing.1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L, et al. PacificA: Replication in log-based distributed storage systems[J].2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora：关于避免 i/os、提交和成员变更的分布式共识[C]//2018 国际数据管理大会论文集.2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al. Socrates：云中的新 sql 服务器[C]//2019 国际数据管理大会论文集.2019: 1743-1756.</li>
</ul>
