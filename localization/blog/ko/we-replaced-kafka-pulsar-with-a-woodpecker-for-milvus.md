---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus—Here’s What Happened
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  We built Woodpecker, a cloud-native WAL system, to replace Kafka and Pulsar in
  Milvus for lower operational complexity and cost.
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
<p><strong>TL;DR:</strong> We built Woodpecker, a cloud-native Write-Ahead Logging (WAL) system, to replace Kafka and Pulsar in Milvus 2.6. The result? Simplified operations, better performance, and lower costs for our Milvus vector database.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">The Starting Point: When Message Queues No Longer Fit<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>We loved and used Kafka and Pulsar. They worked until they didn’t. As Milvus, the leading open-source vector database, evolved, we found that these powerful message queues no longer met our scalability requirements. So we made a bold move: we rewrote the streaming backbone in Milvus 2.6 and implemented our own WAL — <strong>Woodpecker</strong>.</p>
<p>Let me walk you through our journey and explain why we made this change, which might seem counterintuitive at first glance.</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">Cloud-Native From Day One<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus has been a cloud-native vector database from its inception. We leverage Kubernetes for elastic scaling and quick failure recovery, alongside object storage solutions like Amazon S3 and MinIO for data persistence.</p>
<p>This cloud-first approach offers tremendous advantages, but it also presents some challenges:</p>
<ul>
<li><p>Cloud object storage services like S3 provide virtually unlimited capability of handling throughputs and availability, but with latencies often exceeding 100ms.</p></li>
<li><p>These services’ pricing models (based on access patterns and frequency) can add unexpected costs to real-time database operations.</p></li>
<li><p>Balancing cloud-native characteristics with the demands of real-time vector search introduces significant architectural challenges.</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">The Shared Log Architecture: Our Foundation<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Many vector search systems restrict themselves to batch processing because building a streaming system in a cloud-native environment presents even greater challenges. In contrast, Milvus prioritizes real-time data freshness and implements a shared log architecture—think of it as a hard drive for a filesystem.</p>
<p>This shared log architecture provides a critical foundation that separates consensus protocols from core database functionality. By adopting this approach, Milvus eliminates the need to manage complex consensus protocols directly, allowing us to focus on delivering exceptional vector search capabilities.</p>
<p>We’re not alone in this architectural pattern—databases such as AWS Aurora, Azure Socrates, and Neon all leverage a similar design. <strong>However, a significant gap remains in the open-source ecosystem: despite the clear advantages of this approach, the community lacks a low-latency, scalable, and cost-effective distributed write-ahead log (WAL) implementation.</strong></p>
<p>Existing solutions like Bookie proved inadequate for our needs due to their heavyweight client design and the absence of production-ready SDKs for Golang and C++. This technological gap led us to our initial approach with message queues.</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">Our Initial Solution: Message Queues as WAL<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>To bridge this gap, our initial approach utilized message queues (Kafka/Pulsar) as our write-ahead log (WAL). The architecture worked like this:</p>
<ul>
<li><p>All incoming real-time updates flow through the message queue.</p></li>
<li><p>Writers receive immediate confirmation once it is accepted by the message queue.</p></li>
<li><p>QueryNode and DataNode process this data asynchronously, ensuring high write throughput while maintaining data freshness</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure: Milvus 2.0 Architecture Overview</p>
<p>This system effectively provided immediate write confirmation while enabling asynchronous data processing, which was crucial for maintaining the balance between throughput and data freshness that Milvus users expect.</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">Why We Needed Something Different for WAL<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>With Milvus 2.6, we’ve decided to phase out external message queues in favor of Woodpecker, our purpose-built, cloud-native WAL implementation. This wasn’t a decision we made lightly. After all, we had successfully used Kafka and Pulsar for years.</p>
<p>The issue wasn’t with these technologies themselves—both are excellent systems with powerful capabilities. Instead, the challenge came from the increasing complexity and overhead that these external systems introduced as Milvus evolved. As our requirements became more specialized, the gap between what general-purpose message queues offered and what our vector database needed continued to widen.</p>
<p>Three specific factors ultimately drove our decision to build a replacement:</p>
<h3 id="Operational-Complexity" class="common-anchor-header">Operational Complexity</h3><p>External dependencies like Kafka or Pulsar demand dedicated machines with multiple nodes and careful resource management. This creates several challenges:</p>
<ul>
<li>Increased operational complexity</li>
</ul>
<ul>
<li>Steeper learning curves for system administrators</li>
</ul>
<ul>
<li>Higher risks of configuration errors and security vulnerabilities</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">Architectural Constraints</h3><p>Message queues like Kafka have inherent limitations on the number of supported topics. We developed VShard as a workaround for topic sharing across components, but this solution—while effectively addressing scaling needs—introduced significant architectural complexity.</p>
<p>These external dependencies made it harder to implement critical features—such as log garbage collection—and increased integration friction with other system modules. Over time, the architectural mismatch between general-purpose message queues and the specific, high-performance demands of a vector database became increasingly clear, prompting us to reassess our design choices.</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">Resource Inefficiency</h3><p>Ensuring high availability with systems like Kafka and Pulsar typically demands:</p>
<ul>
<li><p>Distributed deployment across multiple nodes</p></li>
<li><p>Substantial resource allocation even for smaller workloads</p></li>
<li><p>Storage for ephemeral signals (like Milvus’s Timetick), which don’t actually require long-term retention</p></li>
</ul>
<p>However, these systems lack the flexibility to bypass persistence for such transient signals, leading to unnecessary I/O operations and storage usage. This leads to disproportionate resource overhead and increased cost—especially in smaller-scale or resource-constrained environments.</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">Introducing Woodpecker - A Cloud-Native, High-Performance WAL Engine<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus 2.6, we’ve replaced Kafka/Pulsar with <strong>Woodpecker</strong>, a purpose-built, cloud-native WAL system. Designed for object storage, Woodpecker simplifies operations while boosting performance and scalability.</p>
<p>Woodpecker is built from the ground up to maximize the potential of cloud-native storage, with a focused goal: to become the highest-throughput WAL solution optimized for cloud environments while delivering the core capabilities needed for an append-only write-ahead log.</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">The Zero-Disk Architecture for Woodpecker</h3><p>Woodpecker’s core innovation is its <strong>Zero-Disk architecture</strong>:</p>
<ul>
<li><p>All log data stored in cloud object storage (such as Amazon S3, Google Cloud Storage, or Alibaba OS)</p></li>
<li><p>Metadata managed through distributed key-value stores like etcd</p></li>
<li><p>No local disk dependencies for core operations</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure:  Woodpecker Architecture Overview</p>
<p>This approach dramatically reduces operational overhead while maximizing durability and cloud efficiency. By eliminating local disk dependencies, Woodpecker aligns perfectly with cloud-native principles and significantly reduces the operational burden on system administrators.</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">Performance Benchmarks: Exceeding Expectations</h3><p>We ran comprehensive benchmarks to evaluate Woodpecker’s performance in a single-node, single-client, single-log-stream setup. The results were impressive when compared to Kafka and Pulsar:</p>
<table>
<thead>
<tr><th><strong>System</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Throughput</td><td>129.96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latency</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1.8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>For context, we measured the theoretical throughput limits of different storage backends on our test machine:</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 MB/s</p></li>
<li><p><strong>Local file system</strong>: 600–750 MB/s</p></li>
<li><p><strong>Amazon S3 (single EC2 instance)</strong>: up to 1.1 GB/s</p></li>
</ul>
<p>Remarkably, Woodpecker consistently achieved 60-80% of the maximum possible throughput for each backend—an exceptional efficiency level for middleware.</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">Key Performance Insights</h4><ol>
<li><p><strong>Local File System Mode</strong>: Woodpecker achieved 450 MB/s—3.5× faster than Kafka and 4.2× faster than Pulsar—with ultra-low latency at just 1.8 ms, making it ideal for high-performance single-node deployments.</p></li>
<li><p><strong>Cloud Storage Mode (S3)</strong>: When writing directly to S3, Woodpecker reached 750 MB/s (about 68% of S3’s theoretical limit), 5.8× higher than Kafka and 7× higher than Pulsar. While latency is higher (166 ms), this setup provides exceptional throughput for batch-oriented workloads.</p></li>
<li><p><strong>Object Storage Mode (MinIO)</strong>: Even with MinIO, Woodpecker achieved 71 MB/s—around 65% of MinIO’s capacity. This performance is comparable to Kafka and Pulsar but with significantly lower resource requirements.</p></li>
</ol>
<p>Woodpecker is particularly optimized for concurrent, high-volume writes where maintaining order is critical. And these results only reflect the early stages of development—ongoing optimizations in I/O merging, intelligent buffering, and prefetching are expected to push performance even closer to theoretical limits.</p>
<h3 id="Design-Goals" class="common-anchor-header">Design Goals</h3><p>Woodpecker addresses the evolving demands of real-time vector search workloads through these key technical requirements:</p>
<ul>
<li><p>High-throughput data ingestion with durable persistence across availability zone</p></li>
<li><p>Low-latency tail reads for real-time subscriptions and high-throughput catch-up reads for failure recovery</p></li>
<li><p>Pluggable storage backends, including cloud object storage and file systems with NFS protocol support</p></li>
<li><p>Flexible deployment options, supporting both lightweight standalone setups and large-scale clusters for multi-tenant Milvus deployments</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">Architecture Components</h3><p>A standard Woodpecker deployment includes the following components.</p>
<ul>
<li><p><strong>Client</strong> – Interface layer for issuing read and write requests</p></li>
<li><p><strong>LogStore</strong> – Manages high-speed write buffering, asynchronous uploads to storage, and log compaction</p></li>
<li><p><strong>Storage Backend</strong> – Supports scalable, low-cost storage services such as S3, GCS, and file systems like EFS</p></li>
<li><p><strong>ETCD</strong> – Stores metadata and coordinates log state across distributed nodes</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">Flexible Deployments to Match Your Specific Needs</h3><p>Woodpecker offers two deployment modes to match your specific needs:</p>
<p><strong>MemoryBuffer Mode – Lightweight and Maintenance-Free</strong></p>
<p>MemoryBuffer Mode provides a simple and lightweight deployment option where Woodpecker temporarily buffers incoming writes in memory and periodically flushes them to a cloud object storage service. Metadata is managed using etcd to ensure consistency and coordination. This mode is best suited for batch-heavy workloads in smaller-scale deployments or production environments that prioritize simplicity over performance, especially when low write latency is not critical.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: The memoryBuffer Mode</em></p>
<p><strong>QuorumBuffer Mode – Optimized for Low-Latency, High-Durability Deployments</strong></p>
<p>QuorumBuffer Mode is designed for latency-sensitive, high-frequency read/write workloads requiring both real-time responsiveness and strong fault tolerance. In this mode, Woodpecker functions as a high-speed write buffer with three-replica quorum writes, ensuring strong consistency and high availability.</p>
<p>A write is considered successful once it’s replicated to at least two of the three nodes, typically completing within single-digit milliseconds, after which the data is asynchronously flushed to cloud object storage for long-term durability. This architecture minimizes on-node state, eliminates the need for large local disk volumes, and avoids complex anti-entropy repairs often required in traditional quorum-based systems.</p>
<p>The result is a streamlined, robust WAL layer ideal for mission-critical production environments where consistency, availability, and fast recovery are essential.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: The QuorumBuffer Mode</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">StreamingService: Built for Real-Time Data Flow<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Beyond Woodpecker, Milvus 2.6 introduces the <strong>StreamingService</strong>—a specialized component designed for log management, log ingestion, and streaming data subscription.</p>
<p>To understand how our new architecture works, it’s important to clarify the relationship between these two components:</p>
<ul>
<li><p><strong>Woodpecker</strong> is the storage layer that handles the actual persistence of write-ahead logs, providing durability and reliability</p></li>
<li><p><strong>StreamingService</strong> is the service layer that manages log operations and provides real-time data streaming capabilities</p></li>
</ul>
<p>Together, they form a complete replacement for external message queues. Woodpecker provides the durable storage foundation, while StreamingService delivers the high-level functionality that applications interact with directly. This separation of concerns allows each component to be optimized for its specific role while working seamlessly together as an integrated system.</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Adding Streaming Service to Milvus 2.6</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure: Streaming Service Added in Milvus 2.6 Architecture</p>
<p>The Streaming Service is composed of three core components:</p>
<p><strong>Streaming Coordinator</strong></p>
<ul>
<li><p>Discovers available Streaming Nodes by monitoring Milvus ETCD sessions</p></li>
<li><p>Manages the status of WALs and collects load balancing metrics through the ManagerService</p></li>
</ul>
<p><strong>Streaming Client</strong></p>
<ul>
<li><p>Queries the AssignmentService to determine WAL segment distribution across Streaming Nodes</p></li>
<li><p>Performs read/write operations via the HandlerService on the appropriate Streaming Node</p></li>
</ul>
<p><strong>Streaming Node</strong></p>
<ul>
<li><p>Handles actual WAL operations and provides publish-subscribe capabilities for real-time data streaming</p></li>
<li><p>Includes the <strong>ManagerService</strong> for WAL administration and performance reporting</p></li>
<li><p>Features the <strong>HandlerService</strong> that implements efficient publish-subscribe mechanisms for WAL entries</p></li>
</ul>
<p>This layered architecture allows Milvus to maintain clear separation between the streaming functionality (subscription, real-time processing) and the actual storage mechanisms. Woodpecker handles the “how” of log storage, while StreamingService manages the “what” and “when” of log operations.</p>
<p>As a result, the Streaming Service significantly enhances the real-time capabilities of Milvus by introducing native subscription support, eliminating the need for external message queues. It reduces memory consumption by consolidating previously duplicated caches in the query and data paths, lowers latency for strongly consistent reads by removing asynchronous synchronization delays, and improves both scalability and recovery speed across the system.</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">Conclusion - Streaming on a Zero-Disk Architecture<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Managing state is hard. Stateful systems often sacrifice elasticity and scalability. The increasingly accepted answer in cloud-native design is to decouple state from compute—allowing each to scale independently.</p>
<p>Rather than reinventing the wheel, we delegate the complexity of durable, scalable storage to the world-class engineering teams behind services like AWS S3, Google Cloud Storage, and MinIO. Among them, S3 stands out for its virtually unlimited capacity, eleven nines (99.999999999%) of durability, 99.99% availability, and high-throughput read/write performance.</p>
<p>But even “zero-disk” architectures have trade-offs. Object stores still struggle with high write latency and small-file inefficiencies—limitations that remain unresolved in many real-time workloads.</p>
<p>For vector databases—especially those supporting mission-critical RAG, AI agents, and low-latency search workloads—real-time access and fast writes are non-negotiable. That’s why we rearchitected Milvus around Woodpecker and the Streaming Service. This shift simplifies the overall system (let’s face it—no one wants to maintain a full Pulsar stack inside a vector database), ensures fresher data, improves cost-efficiency, and speeds up failure recovery.</p>
<p>We believe Woodpecker is more than just a Milvus component—it can serve as a foundational building block for other cloud-native systems. As cloud infrastructure evolves, innovations like S3 Express may bring us even closer to the ideal: cross-AZ durability with single-digit millisecond write latency.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Getting Started with Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 is available now. In addition to Woodpecker, it introduces dozens of new features and performance optimizations such as tiered storage, RabbitQ quantization method, and enhanced full-text search and multitenancy, directly addressing the most pressing challenges in vector search today: scaling efficiently while keeping costs under control.</p>
<p>Ready to explore everything Milvus offers? Dive into our<a href="https://milvus.io/docs/release_notes.md"> release notes</a>, browse the<a href="https://milvus.io/docs"> complete documentation</a>, or check out our<a href="https://milvus.io/blog"> feature blogs</a>.</p>
<p>Have questions? You’re also welcome to join our <a href="https://discord.com/invite/8uyFbECzPX">Discord community</a> or file an issue on<a href="https://github.com/milvus-io/milvus"> GitHub</a> — we’re here to help you make the most of Milvus 2.6.</p>
