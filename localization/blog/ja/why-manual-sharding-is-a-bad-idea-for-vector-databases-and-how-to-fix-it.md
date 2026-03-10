---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: Why Manual Sharding is a Bad Idea for Vector Database And How to Fix It
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  Discover why manual vector database sharding creates bottlenecks and how
  Milvus's automated scaling eliminates engineering overhead for seamless
  growth.
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_1_968a5be504.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p><em>“We initially built our semantic search on pgvector instead of Milvus because all our relational data was already in PostgreSQL,”</em> recalls Alex, CTO of an enterprise AI SaaS startup. <em>“But as soon as we hit product-market fit, our growth ran into serious hurdles on the engineering side. It quickly became clear that pgvector wasn’t designed for scalability. Simple tasks such as rolling out schema updates across multiple shards turned into tedious, error-prone processes that consumed days of engineering effort. When we reached 100 million vector embeddings, query latency spiked to over a second, something far beyond what our customers would tolerate. After moving to Milvus, sharding manually felt like stepping into the stone age. It’s no fun juggling shard servers as if they were fragile artifacts. No company should have to endure that.”</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">A Common Challenge for AI Companies<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>Alex’s experience isn’t unique to pgvector users. Whether you’re using pgvector, Qdrant, Weaviate, or any other vector database that relies on manual sharding, the scaling challenges remain the same. What starts as a manageable solution quickly turns into a tech debt as data volumes grow.</p>
<p>For startups today, <strong>scalability isn’t optional—it’s mission-critical</strong>. This is especially true for AI products powered by Large Language Models(LLM) and vector databases, where the leap from early adoption to exponential growth can happen overnight. Achieving product-market fit often triggers a surge in user growth, overwhelming data inflows, and skyrocketing query demands. But if the database infrastructure can’t keep up, slow queries and operational inefficiencies can stall momentum and hinder business success.</p>
<p>A short-term technical decision could lead to long-term bottleneck, forcing engineering teams to constantly address urgent performance issues, database crashes, and system failures instead of focusing on innovation. The worst-case scenario? A costly, time-consuming database re-architecture—precisely when a company should be scaling.</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">Isn’t Sharding a Natural Solution to Scalability?<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Scalability can be addressed in multiple ways. The most straightforward approach, <strong>Scaling Up</strong>, involves enhancing a single machine’s resources by adding more CPU, memory, or storage to accommodate growing data volumes. While simple, this method has clear limitations. In a Kubernetes environment, for example, large pods are inefficient, and relying on a single node increases the risk of failure, potentially leading to significant downtime.</p>
<p>When Scaling Up is no longer viable, businesses naturally turn to <strong>Scaling Out</strong>, distributing data across multiple servers. At first glance, <strong>sharding</strong> appears to be a simple solution—splitting a database into smaller, independent databases to increase capacity and enable multiple writable primary nodes.</p>
<p>However, while conceptually straightforward, sharding quickly becomes a complex challenge in practice. Most applications are initially designed to work with a single, unified database. The moment a vector database is divided into multiple shards, every part of the application that interacts with data must be modified or entirely rewritten, introducing significant development overhead. Designing an effective sharding strategy becomes crucial, as does implementing routing logic to ensure data is directed to the correct shard. Managing atomic transactions across multiple shards often requires restructuring applications to avoid cross-shard operations. Additionally, failure scenarios must be handled gracefully to prevent disruptions when certain shards become unavailable.</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">Why Manual Sharding Becomes a Burden<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p><em>“We originally estimated implementing manual sharding for our pgvector database would take two engineers about six months,”</em> Alex remembers. <em>&quot;What we didn’t realize was that those engineers would</em> <strong><em>always</em></strong> <em>be needed. Every schema change, data rebalancing operation, or scaling decision required their specialized expertise. We were essentially committing to a permanent ‘sharding team’ just to keep our database running.&quot;</em></p>
<p>Real-world challenges with sharded vector databases include:</p>
<ol>
<li><p><strong>Data Distribution Imbalance (Hotspots)</strong>: In multi-tenant use cases, data distribution can range from hundreds to billions of vectors per tenant. This imbalance creates hotspots where certain shards become overloaded while others sit idle.</p></li>
<li><p><strong>The Resharding Headache</strong>: Choosing the right number of shards is nearly impossible. Too few leads to frequent and costly resharding operations. Too many creates unnecessary metadata overhead, increasing complexity and reducing performance.</p></li>
<li><p><strong>Schema Change Complexity</strong>: Many vector databases implement sharding by managing multiple underlying databases. This makes synchronizing schema changes across shards cumbersome and error-prone, slowing development cycles.</p></li>
<li><p><strong>Resource Waste</strong>: In storage-compute coupled databases, you must meticulously allocate resources across every node while anticipating future growth. Typically, when resource utilization reaches 60-70%, you need to start planning for resharding.</p></li>
</ol>
<p>Simply put, <strong>managing shards manually is bad for your business</strong>. Instead of locking your engineering team into constant shard management, consider investing in a vector database designed to scale automatically—without the operational burden.</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">How Milvus Solves the Scalability Problem<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Many developers—from startups to enterprises—have recognized the significant overhead associated with manual database sharding. Milvus takes a fundamentally different approach, enabling seamless scaling from millions to billions of vectors without the complexity.</p>
<h3 id="Automated-Scaling-Without-the-Tech-Debt" class="common-anchor-header">Automated Scaling Without the Tech Debt</h3><p>Milvus leverages Kubernetes and a disaggregated storage-compute architecture to support seamless expansion. This design enables:</p>
<ul>
<li><p>Rapid scaling in response to changing demands</p></li>
<li><p>Automatic load balancing across all available nodes</p></li>
<li><p>Independent resource allocation, letting you adjust compute, memory, and storage separately</p></li>
<li><p>Consistent high performance, even during periods of rapid growth</p></li>
</ul>
<h3 id="Distributed-Architecture-Designed-from-the-Ground-Up" class="common-anchor-header">Distributed Architecture Designed from the Ground Up</h3><p>Milvus achieves its scaling capabilities through two key innovations:</p>
<p><strong>Segment-Based Architecture:</strong> At its core, Milvus organizes data into &quot;segments&quot;—the smallest units of data management:</p>
<ul>
<li><p>Growing Segments reside on StreamNodes, optimizing data freshness for real-time queries</p></li>
<li><p>Sealed Segments are managed by QueryNodes, utilizing powerful indexes to accelerate search</p></li>
<li><p>These segments are evenly distributed across nodes to optimize parallel processing</p></li>
</ul>
<p><strong>Two-Layer Routing</strong>: Unlike traditional databases where each shard lives on a single machine, Milvus distributes data in one shard dynamically across multiple nodes:</p>
<ul>
<li><p>Each shard can store over 1 billion data points</p></li>
<li><p>Segments within each shard are automatically balanced across machines</p></li>
<li><p>Expanding collections is as simple as increasing the number of shards</p></li>
<li><p>The upcoming Milvus 3.0 will introduce dynamic shard splitting, eliminating even this minimal manual step</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">Query Processing at Scale</h3><p>When executing a query, Milvus follows an efficient process:</p>
<ol>
<li><p>The Proxy identifies relevant shards for the requested collection</p></li>
<li><p>The Proxy gathers data from both StreamNodes and QueryNodes</p></li>
<li><p>StreamNodes handle real-time data while QueryNodes process historical data concurrently</p></li>
<li><p>Results are aggregated and returned to the user</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">A Different Engineering Experience<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><em>“When scalability is built into the database itself, all those headaches just… disappear,”</em> says Alex, reflecting on his team’s transition to Milvus. <em>“My engineers are back to building features customers love instead of babysitting database shards.”</em></p>
<p>If you’re grappling with the engineering burden of manual sharding, performance bottlenecks at scale, or the daunting prospect of database migrations, it’s time to rethink your approach. Visit our <a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">docs page</a> to learn more about Milvus architecture, or experience effortless scalability firsthand with fully-managed Milvus at <a href="https://zilliz.com/cloud">zilliz.com/cloud</a>.</p>
<p>With the right vector database foundation, your innovation knows no limits.</p>
