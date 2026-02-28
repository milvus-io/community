---
id: raft-or-not.md
title: Raft or not? The Best Solution to Data Consistency in Cloud-native Databases
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: >-
  Why consensus-based replication algorithm is not the silver bullet for
  achieving data consistency in distributed databases?
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<blockquote>
<p>This article was written by <a href="https://github.com/xiaofan-luan">Xiaofan Luan</a> and transcreated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Consensus-based replication is a widely-adopted strategy in many cloud-native, distributed databases. However, it has certain shortcomings and is definitely not the silver bullet.</p>
<p>This post aims to explain the concepts of replication, consistency, and consensus in a cloud-native and distributed database, then clarify why consensus-based algorithms like Paxos and Raft are not the silver bullet, and finally propose a <a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">solution to consensus-based replication</a>.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">Understanding replication, consistency, and consensus</a></li>
<li><a href="#Consensus-based-replication">Consensus-based replication</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">A log replication strategy for cloud-native and distributed database</a></li>
<li><a href="#Summary">Summary</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">Understanding replication, consistency, and consensus<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>Before going deep into the pros and cons of Paxos and Raft, and proposing a best suited log replication strategy, we need to first demystify concepts of replication, consistency, and consensus.</p>
<p>Note that this article mainly focuses on the synchronization of incremental data/log. Therefore, when talking about data/log replication, only replicating incremental data, not historical data, is referred to.</p>
<h3 id="Replication" class="common-anchor-header">Replication</h3><p>Replication is the process of making multiple copies of data and storing them in different disks, processes, machines, clusters, etc, for the purpose of increasing data reliability and accelerating data queries. Since in replication, data are copied and stored at multiple locations, data are more reliable in the face of recovering from disk failures, physical machine failures, or cluster errors. In addition, multiple replicas of data can boost the performance of a distributed database by greatly speeding up queries.</p>
<p>There are various modes of replication, such as synchronous/asynchronous replication, replication with strong/eventual consistency, leader-follower/decentralized replication. The choice of replication mode has an effect on system availability and consistency. Therefore, as proposed in the famous <a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">CAP theorem</a>, a system architect needs to trade off between consistency and availability when network partition is inevitable.</p>
<h3 id="Consistency" class="common-anchor-header">Consistency</h3><p>In short, consistency in a distributed database refers to the property that ensures every node or replica has the same view of data when writing or reading data at a given time. For a full list of consistency levels, read the doc <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">here</a>.</p>
<p>To clarify, here we are talking about consistency as in the CAP theorem, not ACID (atomicity, consistency, isolation, durability). Consistency in CAP theorem refers to each node in the system having the same data while consistency in ACID refers to a single node enforcing the same rules on every potential commit.</p>
<p>Generally, OLTP (online transaction processing) databases require strong consistency or linearizability to ensure that:</p>
<ul>
<li>Each read can access the latest inserted data.</li>
<li>If a new value is returned after a read, all following reads, regardless on the same or different clients, must return the new value.</li>
</ul>
<p>The essence of linearizability is to guarantee the recency of multiple data replicas - once a new value is written or read, all subsequent reads can view the new value until the value is later overwritten. A distributed system providing linearizability can save users the trouble of keeping an eye on multiple replicas, and can guarantee the atomicity and order or each operation.</p>
<h3 id="Consensus" class="common-anchor-header">Consensus</h3><p>The concept of consensus is introduced to distributed systems as users are eager to see distributed systems work in the same way as standalone systems.</p>
<p>To put it simple, consensus is a general agreement on value. For instance, Steve and Frank wanted to grab something to eat. Steve suggested having sandwiches. Frank agreed to Steve’s suggestion and both of them are had sandwiches. They reached a consensus. More specifically, a value (sandwiches) proposed by one of them is agreed upon by both, and both of them take actions based on the value. Similarly, consensus in a distributed system means when a process propose a value, all the rest processes in the system agree on and act upon this value.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
    <span>Consensus</span>
  </span>
</p>
<h2 id="Consensus-based-replication" class="common-anchor-header">Consensus-based replication<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>The earliest consensus-based algorithms were proposed  along with <a href="https://pmg.csail.mit.edu/papers/vr.pdf">viewstamped replication</a> in 1988. In 1989, Leslie Lamport proposed <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos</a>, a consensus-based algorithm.</p>
<p>In recent years, we witness another prevalent consensus-based algorithm in the industry - <a href="https://raft.github.io/">Raft</a>. It has been adopted by many mainstream NewSQL databases like CockroachDB, TiDB, OceanBase, etc.</p>
<p>Notably, a distributed system does not necessarily support linearizability even if it adopts consensus-based replication. However, linearizability is the prerequisite for building ACID distributed database.</p>
<p>When designing a database system, the commit order of logs and state machines should be taken into consideration. Extra caution is also needed to maintain the leader lease of Paxos or Raft and prevent a split-brain under network partition.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
    <span>Raft replication state machine</span>
  </span>
</p>
<h3 id="Pros-and-cons" class="common-anchor-header">Pros and cons</h3><p>Indeed, Raft, ZAB, and <a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">quorum-based log protocol</a> in Aurora are all Paxos variations. Consensus-based replication has the following advantages:</p>
<ol>
<li>Though consensus-based replication focus more on consistency and network partition in the CAP theorem, it provides relatively better availability compared to traditional leader-follower replication.</li>
<li>Raft is a breakthrough that greatly simplified consensus-based algorithms. And there are many open-source Raft libraries on GitHub (Eg. <a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>).</li>
<li>The performance of consensus-based replication can satisfy most of the applications and businesses. With the coverage of high-performance SSD and gigabyte NICs (network interface card), the burden of synchronizing multiple replicas is relieved, making Paxos and Raft algorithms the mainstream in the industry.</li>
</ol>
<p>One misconception is that consensus-based replication is the silver bullet to achieving data consistency in a distributed database. However, this is not the truth. The challenges in availability, complexity, and performance faced by consensus-based algorithm blocks it from being the perfect solution.</p>
<ol>
<li><p>Compromised availability
Optimized Paxos or Raft algorithm has strong dependency on the leader replica, which comes with a weak ability to fight against grey failure. In consensus-based replication, a new election of leader replica will not take place until the leader node does not respond for a long time. Therefore, consensus-based replication is incapable of handling situations where the leader node is slow or a thrashing occurs.</p></li>
<li><p>High complexity
Though there are already many extended algorithms based on Paxos and Raft, the emergence of <a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft</a> and <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel Raft</a> requires more considerations and tests on synchronization between logs and state machines.</p></li>
<li><p>Compromised performance
In a cloud-native era, local storage is replaced by shared storage solutions like EBS and S3 to ensure data reliability and consistency. As a result, consensus-based replication is no longer a must for distributed systems. What’s more, consensus-based replication comes with the problem of data redundancy as both the solution and EBS has multiple replicas.</p></li>
</ol>
<p>For multi-datacenter and multi-cloud replication, the pursuit for consistency compromises not only availability but also <a href="https://en.wikipedia.org/wiki/PACELC_theorem">latency</a>, resulting in a decline in performance. Therefore, linearizability is not a must for multi-datacenter disaster tolerance in most of the applications.</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">A log replication strategy for cloud-native and distributed database<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Undeniably, consensus-based algorithms like Raft and Paxos are still the mainstream algorithms adopted by many OLTP databases. However, by observing the examples of <a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a> protocol, <a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a> and <a href="https://rockset.com/">Rockset</a>, we can see the trend is shifting.</p>
<p>There are two major principles for a solution that can best serve a cloud-native, distributed database.</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1. Replication as a service</h3><p>A separate microservice dedicated to data synchronization is needed. The synchronization module and storage module should no longer be tightly coupled within the same process.</p>
<p>For instance, Socrates decouples storage, log, and computing. There is one dedicated log service (XLog service in the middle of the figure below).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
    <span>Socrates architecture</span>
  </span>
</p>
<p>XLog service is an individual service. Data persistence is achieved with the help of low-latency storage. The landing zone in Socrates is in charge of keeping three replicas at an accelerated speed.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
    <span>Socrates XLog service</span>
  </span>
</p>
<p>The leader node distributes logs to log broker asynchronously, and flushes data to Xstore. Local SSD cache can accelerate data read. Once data flush is successful, buffers in the landing zone can be cleaned. Obviously, all log data are divided into three layers - landing zone, local SSD, and XStore.</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2. Russian doll principle</h3><p>One way to design a system is to follow the Russian doll principle: each layer is complete and perfectly suited to what the layer does so that other layers may be built on-top or around it.</p>
<p>When designing a cloud-native database, we need to cleverly leverage other third-party services to reduce the complexity of system architecture.</p>
<p>It seems like we cannot get around with Paxos to avoid single point failure. However, we can still greatly simplify log replication by handing leader election over to Raft or Paxos services based on <a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>, <a href="https://github.com/bloomreach/zk-replicator">Zk</a>, and <a href="https://etcd.io/">etcd</a>.</p>
<p>For instance, <a href="https://rockset.com/">Rockset</a> architecture follows the Russian doll principle and uses Kafka/Kineses for distributed logs, S3 for storage, and local SSD cache for improving query performance.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
    <span>Rockset architecture</span>
  </span>
</p>
<h3 id="The-Milvus-approach" class="common-anchor-header">The Milvus approach</h3><p>Tunable consistency in Milvus is in fact similar to follower reads in consensus-based replication. Follower read feature refers to using follower replica to undertake data read tasks under the premise of strong consistency. The purpose is to enhance cluster throughput and reduce the load on leader. The mechanism behind follower read feature is inquiring the commit index of the latest log and providing query service until all data in the commit index are applied to state machines.</p>
<p>However, the design of Milvus did not adopt the follower strategy. In other words, Milvus does not inquire commit index every time it receives a query request. Instead, Milvus adopts a mechanism like the watermark in <a href="https://flink.apache.org/">Flink</a>, which notifies query node the location of commit index at a regular interval. The reason for such a mechanism is that Milvus users usually do not have high demand for data consistency, and they can accept a compromise in data visibility for better system performance.</p>
<p>In addition, Milvus also adopts multiple microservices and separates storage from computing. In the <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus architecture</a>, S3, MinIo, and Azure Blob are used for storage.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
    <span>Milvus architecture</span>
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
    </button></h2><p>Nowadays, an increasing number of cloud-native databases are making log replication an individual service. By doing so, the cost of adding read-only replicas and heterogeneous replication can be reduced. Using multiple microservices enables quick utilization of mature cloud-based infrastructure, which is impossible for traditional databases. An individual log service can rely on consensus-based replication, but it can also follow the Russian doll strategy to adopt various consistency protocols together with Paxos or Raft to achieve linearizability.</p>
<h2 id="References" class="common-anchor-header">References<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Lamport L. Paxos made simple[J]. ACM SIGACT News (Distributed Computing Column) 32, 4 (Whole Number 121, December 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. In search of an understandable consensus algorithm[C]//2014 USENIX Annual Technical Conference (Usenix ATC 14). 2014: 305-319.</li>
<li>Oki B M, Liskov B H. Viewstamped replication: A new primary copy method to support highly-available distributed systems[C]//Proceedings of the seventh annual ACM Symposium on Principles of distributed computing. 1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L, et al. PacificA: Replication in log-based distributed storage systems[J]. 2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora: On avoiding distributed consensus for i/os, commits, and membership changes[C]//Proceedings of the 2018 International Conference on Management of Data. 2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al. Socrates: The new sql server in the cloud[C]//Proceedings of the 2019 International Conference on Management of Data. 2019: 1743-1756.</li>
</ul>
