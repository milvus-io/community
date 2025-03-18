---
id: from-scaling-pains-to-seamless-growth-why-vector-database-architecture-matters.md
title: "From Scaling Pains to Seamless Growth: Why Vector Database Architecture Matters"
author: James Luan
date: 2025-03-18
desc: Many developers—from startups to enterprises—have recognized the significant overhead associated with manual database sharding. Milvus takes a fundamentally different approach, enabling seamless scaling from millions to billions of vectors without the complexity.
cover: assets.zilliz.com/From_Scaling_Pains_to_Seamless_Growth_Why_Vector_Database_Architecture_Matters_7ce21ed9a2.png
tag: Engineering
recommend: true
canonicalUrl: https://milvus.io/blog/from-scaling-pains-to-seamless-growth-why-vector-database-architecture-matters.md
---

_"We initially built our vector search system on pgvector because all our relational data was already in PostgreSQL,"_ recalls Alex, CTO of an enterprise AI SaaS startup. _"But as soon as we hit product-market fit, our growth trajectory exposed a critical limitation: pgvector requires manual sharding to scale, which created enormous engineering complexity."_

Alex's team discovered this the hard way. _"Simple tasks—like rolling out schema updates across multiple shards—turned into tedious, error-prone processes that consumed days of engineering effort. When we reached 100 million vector embeddings, query latency spiked to over a second—far beyond what our customers would tolerate."_

That's when they decided to make a change. _"Moving to Milvus eliminated the need for manual sharding entirely. Looking back, juggling individual database servers felt like working with fragile artifacts. No company should have to endure that engineering burden when they should be focused on growth."_


## A Common Challenge for AI Companies

Alex's experience isn't unique to pgvector users. Whether you're using pgvector, Qdrant, Weaviate, or any other vector database that relies on manual sharding, the scaling challenges remain the same. What starts as a manageable solution quickly turns into a technical bottleneck as data volumes grow.

For AI startups today, **scalability isn't optional—it's mission-critical**. This is especially true for products powered by Large Language Models (LLMs) and vector databases, where the leap from early adoption to exponential growth can happen overnight. Achieving product-market fit often triggers a surge in user acquisition, overwhelming data inflows, and skyrocketing query demands. But if the database infrastructure can't keep up, slow queries and operational inefficiencies can stall momentum and hinder business success.

Short-term technical decisions often lead to long-term bottlenecks, forcing engineering teams to constantly address urgent performance issues, database crashes, and system failures instead of focusing on innovation. The worst-case scenario? A costly, time-consuming database re-architecture—precisely when a company should be scaling.


## The Scaling Dilemma: Up or Out?

When facing growth challenges, companies typically consider two approaches to scalability:

**Scale-Up**: The simplest approach involves enhancing a single machine's capabilities—adding more CPU, memory, or storage to handle larger data volumes. While straightforward, this strategy quickly runs into practical limitations. Particularly in Kubernetes environments, large pods aren't efficient solutions, and a single node's failure can trigger substantial downtime.

**Scale-Out**: If Scale-Up isn't feasible, businesses naturally turn to distributing data across multiple servers through sharding. At first glance, this seems simple: split your database into smaller, independent databases, creating more capacity and multiple writable primary nodes.

Unfortunately, while conceptually simple, sharding quickly becomes incredibly complex in practice. Once a single vector database is fragmented into multiple shards, every piece of application code interacting with data must be revised or rewritten.


## Why Manual Sharding Becomes a Burden

_"We originally estimated implementing manual sharding for our pgvector database would take two engineers about six months,"_ Alex remembers. _"What we didn't realize was that those engineers would_ **_always_** _be needed. Every schema change, data rebalancing operation, or scaling decision required their specialized expertise. We were essentially committing to a permanent 'sharding team' just to keep our database running."_

Real-world challenges with sharded vector databases include:

1. **Data Distribution Imbalance (Hotspots)**: In multi-tenant use cases, data distribution can range from hundreds to billions of vectors per tenant. This imbalance creates hotspots where certain shards become overloaded while others sit idle.

2. **The Resharding Headache**: Choosing the right number of shards is nearly impossible. Too few leads to frequent and costly resharding operations. Too many creates unnecessary metadata overhead, increasing complexity and reducing performance.

3. **Schema Change Complexity**: Many vector databases implement sharding by managing multiple underlying databases. This makes synchronizing schema changes across shards cumbersome and error-prone, slowing development cycles.

4. **Resource Waste**: In storage-compute coupled databases, you must meticulously allocate resources across every node while anticipating future growth. Typically, when resource utilization reaches 60-70%, you need to start planning for resharding.

Simply put, **sharding is bad for your business**. Instead of locking your engineering team into constant shard management, consider investing in a vector database designed to scale automatically—without the operational burden.


## How Milvus Solves the Scalability Problem

Many developers—from startups to enterprises—have recognized the significant overhead associated with manual database sharding. Milvus takes a fundamentally different approach, enabling seamless scaling from millions to billions of vectors without the complexity.


### Automated Scaling Without the Engineering Tax

Milvus leverages Kubernetes and a disaggregated storage-compute architecture to support seamless expansion. This design enables:

- Rapid scaling in response to changing demands

- Automatic load balancing across all available nodes

- Independent resource allocation, letting you adjust compute, memory, and storage separately

- Consistent high performance, even during periods of rapid growth


### How Milvus Scales: The Technical Foundation

Milvus achieves its scaling capabilities through two key innovations:

**Segment-Based Architecture**: At its core, Milvus organizes data into "segments"—the smallest units of data management:

- Growing Segments reside on StreamNodes, optimizing data freshness for real-time queries

- Sealed Segments are managed by QueryNodes, utilizing powerful indexes to accelerate search

- These segments are evenly distributed across nodes to optimize parallel processing

**Two-Layer Routing**: Unlike traditional databases where each shard lives on a single machine, Milvus distributes data in one shard dynamically across multiple nodes:

- Each shard can store over 1 billion data points

- Segments within each shard are automatically balanced across machines

- Expanding collections is as simple as increasing the number of shards

- The upcoming Milvus 3.0 will introduce dynamic shard splitting, eliminating even this minimal manual step


### Query Processing at Scale

When executing a query, Milvus follows an efficient process:

1. The Proxy identifies relevant shards for the requested collection

2. The Proxy gathers data from both StreamNodes and QueryNodes

3. StreamNodes handle real-time data while QueryNodes process historical data concurrently

4. Results are aggregated and returned to the user


![](https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png)

## A Different Engineering Experience

_"When scalability is built into the database itself, all those headaches just... disappear,"_ says Alex, reflecting on his team's transition to Milvus. _"My engineers are back to building features customers love instead of babysitting database shards."_

If you're grappling with the engineering burden of manual sharding, performance bottlenecks at scale, or the daunting prospect of database migrations, it's time to rethink your approach. Visit[ ](https://milvus.io/docs/overview.md)our [docs page](https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable)  to learn more about Milvus architecture, or experience effortless scalability firsthand with [Zilliz Cloud, a fully managed Milvus service](https://zilliz.com/cloud) at[zilliz.com](https://zilliz.com/).

With the right vector database foundation, your innovation knows no limits.


