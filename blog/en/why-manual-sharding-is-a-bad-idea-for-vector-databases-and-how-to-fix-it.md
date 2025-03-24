---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: Why Manual Sharding is a Bad Idea for Vector Database And How to Fix It
author: James Luan
date: 2025-03-18
desc: Discover why manual vector database sharding creates bottlenecks and how Milvus's automated scaling eliminates engineering overhead for seamless growth.
cover: assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_1_968a5be504.png
tag: Engineering
tags: Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding
recommend: true
canonicalUrl: https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---

_"We initially built our semantic search on pgvector instead of Milvus because all our relational data was already in PostgreSQL,"_ recalls Alex, CTO of an enterprise AI SaaS startup. _"But as soon as we hit product-market fit, our growth ran into serious hurdles on the engineering side. It quickly became clear that pgvector wasn’t designed for scalability. Simple tasks such as rolling out schema updates across multiple shards turned into tedious, error-prone processes that consumed days of engineering effort. When we reached 100 million vector embeddings, query latency spiked to over a second, something far beyond what our customers would tolerate. After moving to Milvus, sharding manually felt like stepping into the stone age. It’s no fun juggling shard servers as if they were fragile artifacts. No company should have to endure that."_


## A Common Challenge for AI Companies

Alex's experience isn't unique to pgvector users. Whether you're using pgvector, Qdrant, Weaviate, or any other vector database that relies on manual sharding, the scaling challenges remain the same. What starts as a manageable solution quickly turns into a tech debt as data volumes grow.

For startups today, **scalability isn't optional—it's mission-critical**. This is especially true for AI products powered by Large Language Models(LLM) and vector databases, where the leap from early adoption to exponential growth can happen overnight. Achieving product-market fit often triggers a surge in user growth, overwhelming data inflows, and skyrocketing query demands. But if the database infrastructure can't keep up, slow queries and operational inefficiencies can stall momentum and hinder business success.

A short-term technical decision could lead to long-term bottleneck, forcing engineering teams to constantly address urgent performance issues, database crashes, and system failures instead of focusing on innovation. The worst-case scenario? A costly, time-consuming database re-architecture—precisely when a company should be scaling.


## Isn’t Sharding a Natural Solution to Scalability?

Scalability can be addressed in multiple ways. The most straightforward approach, **Scaling Up**, involves enhancing a single machine’s resources by adding more CPU, memory, or storage to accommodate growing data volumes. While simple, this method has clear limitations. In a Kubernetes environment, for example, large pods are inefficient, and relying on a single node increases the risk of failure, potentially leading to significant downtime.

When Scaling Up is no longer viable, businesses naturally turn to **Scaling Out**, distributing data across multiple servers. At first glance, **sharding** appears to be a simple solution—splitting a database into smaller, independent databases to increase capacity and enable multiple writable primary nodes.

However, while conceptually straightforward, sharding quickly becomes a complex challenge in practice. Most applications are initially designed to work with a single, unified database. The moment a vector database is divided into multiple shards, every part of the application that interacts with data must be modified or entirely rewritten, introducing significant development overhead. Designing an effective sharding strategy becomes crucial, as does implementing routing logic to ensure data is directed to the correct shard. Managing atomic transactions across multiple shards often requires restructuring applications to avoid cross-shard operations. Additionally, failure scenarios must be handled gracefully to prevent disruptions when certain shards become unavailable.


## Why Manual Sharding Becomes a Burden

_"We originally estimated implementing manual sharding for our pgvector database would take two engineers about six months,"_ Alex remembers. _"What we didn't realize was that those engineers would_ **_always_** _be needed. Every schema change, data rebalancing operation, or scaling decision required their specialized expertise. We were essentially committing to a permanent 'sharding team' just to keep our database running."_

Real-world challenges with sharded vector databases include:

1. **Data Distribution Imbalance (Hotspots)**: In multi-tenant use cases, data distribution can range from hundreds to billions of vectors per tenant. This imbalance creates hotspots where certain shards become overloaded while others sit idle.

2. **The Resharding Headache**: Choosing the right number of shards is nearly impossible. Too few leads to frequent and costly resharding operations. Too many creates unnecessary metadata overhead, increasing complexity and reducing performance.

3. **Schema Change Complexity**: Many vector databases implement sharding by managing multiple underlying databases. This makes synchronizing schema changes across shards cumbersome and error-prone, slowing development cycles.

4. **Resource Waste**: In storage-compute coupled databases, you must meticulously allocate resources across every node while anticipating future growth. Typically, when resource utilization reaches 60-70%, you need to start planning for resharding.

Simply put, **managing shards manually is bad for your business**. Instead of locking your engineering team into constant shard management, consider investing in a vector database designed to scale automatically—without the operational burden.


## How Milvus Solves the Scalability Problem

Many developers—from startups to enterprises—have recognized the significant overhead associated with manual database sharding. Milvus takes a fundamentally different approach, enabling seamless scaling from millions to billions of vectors without the complexity.


### Automated Scaling Without the Tech Debt

Milvus leverages Kubernetes and a disaggregated storage-compute architecture to support seamless expansion. This design enables:

- Rapid scaling in response to changing demands

- Automatic load balancing across all available nodes

- Independent resource allocation, letting you adjust compute, memory, and storage separately

- Consistent high performance, even during periods of rapid growth


### Distributed Architecture Designed from the Ground Up

Milvus achieves its scaling capabilities through two key innovations:

**Segment-Based Architecture:** At its core, Milvus organizes data into "segments"—the smallest units of data management:

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

If you're grappling with the engineering burden of manual sharding, performance bottlenecks at scale, or the daunting prospect of database migrations, it's time to rethink your approach. Visit our [docs page](https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable) to learn more about Milvus architecture, or experience effortless scalability firsthand with fully-managed Milvus at [zilliz.com/cloud](https://zilliz.com/cloud).

With the right vector database foundation, your innovation knows no limits.
