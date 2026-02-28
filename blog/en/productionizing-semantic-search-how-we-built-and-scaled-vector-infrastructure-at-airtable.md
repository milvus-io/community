---
id: productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: >
 Productionizing Semantic Search: How We Built and Scaled Vector Infrastructure at Airtable
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-2-28
cover: assets.zilliz.com/cover_Productionizing_Semantic_Search_How_We_Built_and_Scaled_Vector_Infrastructure_at_Airtable_1a2fbeb3e0.png
tag: Use Cases
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: semantic search, Milvus vector database, vector infrastructure, large-scale embeddings, multi-tenant architecture
meta_title: >
 Scaling Semantic Search with Milvus at Airtable
desc: >
 How Airtable scaled semantic search with Milvus, supporting billions of embeddings, multi-tenancy, low latency, and resilient vector infrastructure.
origin: https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
# Productionizing Semantic Search: How We Built and Scaled Vector Infrastructure at Airtable

By Aria Malkani and Cole Dearmon-Moore

As semantic search at Airtable evolved from a concept into a core product feature, the Data Infrastructure team faced the challenge of supporting it at scale. As detailed in our [](https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2)[previous post on Building the Embedding System](https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2), we had already designed a robust, eventually consistent application layer to handle the embedding lifecycle. But one critical piece was still missing from our architecture diagram: the vector database itself.

We needed a storage engine capable of indexing and serving billions of embeddings, supporting massive multi-tenancy, and maintaining performance and availability targets in a distributed cloud environment. This is the story of how we architected, hardened, and evolved our vector search platform to become a core pillar of Airtable’s infrastructure stack.

## Background

At Airtable, our goal is to help customers work with their data in powerful, intuitive ways. With the emergence of increasingly powerful and accurate LLMs, features that leverage the semantic meaning of your data have become core to our product.

### How We Use Semantic Search

#### AI Chat (Omni): Answering real questions from large datasets

Imagine asking a natural-language question of your base (database) with half a million rows, and getting a correct, context-rich answer. For example:

“What are customers saying about battery life lately?”

On small datasets, it’s possible to send all rows directly to an LLM. At scale, that quickly becomes infeasible. Instead, we needed a system capable of:

-   Understanding the semantic intent of a query
-   Retrieving the most relevant rows via vector similarity search
-   Supplying those rows as context to an LLM

This requirement shaped nearly every design decision that followed: Omni needed to feel instant and intelligent, even on very large bases.

#### Linked record recommendations: Meaning over exact matches

Semantic search also enhances a core Airtable feature: linked records. Users need relationship suggestions based on context rather than exact text matches. For instance, a project description might imply a relationship with “Team Infrastructure” without ever using that specific phrase.

Delivering these on-demand suggestions requires high-quality semantic retrieval with consistent, predictable latency.

### Our Design Priorities

To support these features and more, we anchored the system around 4 goals:

-   **Low-latency queries (500ms p99)**: predictable performance is critical for user trust
-   **High-throughput writes**: bases change constantly and embeddings must stay in sync
-   **Horizontal scalability**: the system must support millions of independent bases
-   **Self-hosting**: all customer data must remain inside Airtable-controlled infrastructure

These goals shaped every architectural decision that followed.

## Vendor Evaluation

In late 2024, we evaluated several vector database options, ultimately selecting [Milvus](https://milvus.io/) based on three key requirements.

-   First, we prioritized a self-hosted solution to ensure data privacy and maintain fine-grained control of our infrastructure.
-   Second, our write-heavy workload and bursty query patterns required a system that could scale elastically while maintaining low, predictable latency.
-   Finally, our architecture required strong isolation across millions of customer tenants.

Milvus emerged as the best fit: its distributed architecture supports over 100K-scale multi-tenancy and allows us to scale ingestion, indexing, and query execution independently, delivering performance while keeping costs predictable.

## Architecture Design

After choosing a technology, we then had to determine an architecture to represent Airtable’s unique data shape: millions of distinct "bases" owned by different customers.

### The Partitioning Challenge

We evaluated two primary data partitioning strategies:

#### One Base per Partition

Each Airtable base is mapped to its own physical partition in Milvus. This provides strong isolation, enables fast and simple base deletion, and avoids the performance impact of post-query filtering.

#### Shared Partitions

Multiple bases share a partition, and queries are scoped by filtering on a base_id field. This improves resource utilization, but introduces additional filtering overhead and makes base deletion more complex.

#### Final Strategy

We chose option 1 for its simplicity and strong isolation. However, early tests showed that creating 100k partitions in a single Milvus collection caused significant performance degradation:

-   Partition creation latency increased from ~20 ms to ~250 ms
-   Partition load times exceeded 30 seconds

To address this, we capped the number of partitions per collection. For each Milvus cluster, we create 400 collections, each with at most 1,000 partitions. This limits the total number of bases per cluster to 400k, and new clusters are provisioned as additional customers are onboarded.

### Indexing & Recall

Index choice turned out to be one of the most consequential trade-offs in our system. When a partition is loaded, its index is cached in memory or on disk. To strike a balance between recall rate, index size, and performance, we benchmarked several index types.

-   **IVF-SQ8**: Offered a small memory footprint but lower recall.
-   **HNSW**: Delivers the best recall (99%-100%) but is memory-hungry.
-   **DiskANN**: Offers a recall similar to HNSW but with higher query latency

Ultimately, we selected HNSW for its superior recall and performance characteristics.

## The Application layer

At a high level, Airtable’s semantic search pipeline involves two core flows:

1.  **Ingestion flow**: Convert Airtable rows into embeddings and store them in Milvus
2.  **Query flow**: Embed user queries, retrieve relevant row IDs, and provide context to the LLM

Both flows must operate continuously and reliably at scale.We walk through each below.

### Ingestion Flow: Keeping Milvus in Sync with Airtable

When a user opens Omni, Airtable begins syncing their base to Milvus. We create a partition, then process the rows in chunks, generating embeddings and upserting into Milvus. From then on, we capture any changes made to the base, and re-embed and upsert those rows to keep the data consistent.

![](https://assets.zilliz.com/Airtable_Milvusblog_2_fe34ed2ab4.png)[[b]](#cmnt2)

![](https://assets.zilliz.com/Airtable_Milvusblog_3_0eb63128cc.png)

Query Flow: How we use the data

On the query side, we embed the user’s request and send it to Milvus to retrieve the most relevant row IDs. We then fetch the latest versions of those rows and include them as context in the request to the LLM.

![](https://assets.zilliz.com/Airtable_Milvusblog_1_ca176e5cd0.png)[[c]](#cmnt3)

![](https://assets.zilliz.com/Airtable_Milvusblog_4_06a2280734.png)

## Operational Challenges & How We Solved Them

Building a semantic search architecture is one challenge; running it reliably for hundreds of thousands of bases is another. Below are a few key operational lessons

### Deployment

We deploy Milvus using its Kubernetes CRD, which lets us define and manage clusters declaratively. Every change, whether it’s a configuration update, client improvement, or Milvus upgrade, runs through unit tests and an on-demand load test that simulates production traffic before rolling out to users.

Each Milvus cluster is made up of several core components that we operate in production:

-   **Query Nodes** hold the vector indexes in memory and execute vector searches
-   **Data Nodes** handle ingestion and compaction, and persist new data to storage.
-   **Index Nodes** build and maintain vector indexes to keep search fast as data grows.
-   **The Coordinator Node** orchestrates all cluster activity and shard assignment
-   **Proxy nodes** route API traffic and balance load across nodes.
-   **Kafka** provides the log/streaming backbone for internal messaging and data flow
-   **Etcd** stores cluster metadata and coordination state.

With CRD-driven automation and a rigorous testing pipeline, we can roll out updates quickly and safely.

### Observability: Understanding System Health End-to-End

We monitor the system on two levels to ensure semantic search remains fast and predictable.

At the infrastructure level, we track CPU, memory usage, and pod health across all Milvus components. These signals tell us whether the cluster is operating within safe limits and help us catch issues like resource saturation or unhealthy nodes before they impact users.

At the service layer, we focus on how well each database is keeping up with our ingestion and query workloads. Metrics like compaction and indexing throughput give us visibility into how efficiently data is being ingested. Query success rates and latency give us an understanding of the user experience querying the data, and partition growth lets us know how our data is growing so we are alerted if we need to scale.

### Node Rotation

For security and compliance reasons, we regularly rotate Kubernetes nodes. In a vector search cluster, this is non-trivial:

-   The coordinator will rebalance data between the query nodes as pods are spun up and down
-   kafka and etcd store stateful information and require quorum and continuous availability

We address this with strict disruption budgets and a one-node-at-a-time rotation policy. The Milvus coordinator is given time to rebalance before the next node is cycled. This careful orchestration preserves reliability without slowing down our velocity.

### Cold Partition Offloading

One of our biggest operational wins was recognizing our data has clear hot/cold access patterns. By analyzing usage, we found that only ~25% of data is accessed in a given week. Milvus lets us offload entire partitions, freeing memory on the Query Nodes. If that data is needed at a later point, we can reload it within seconds. This allows us to keep hot data in memory and offload the rest, reducing costs and allowing us to scale more efficiently over time.

### Data Recovery

Before rolling Milvus out broadly, we needed confidence that we could recover quickly from any failure scenario. While most issues are covered by the cluster’s built-in fault tolerance, we also planned for the rare cases where data might become corrupted or the system enters an unrecoverable state.

In those situations, our recovery path is straightforward. We first bring up a fresh Milvus cluster so we can resume serving traffic almost immediately. Once the new cluster is live, we proactively re-embed the most commonly used bases, then lazily process the rest as they are accessed. This minimizes downtime for critical data while the system gradually rebuilds a consistent semantic index.

## What’s next

Our work with Milvus has laid a strong foundation for semantic search at Airtable, powering fast, meaningful AI experiences at scale. With this system in place, we’re now exploring better embeddings, richer retrieval pipelines, and deeper AI integrations across the product. There’s a lot of exciting work ahead, and we’re just getting started.

Thanks to all past and present Airtablets on Data Infrastructure and across the organization who contributed to this project: Cole Dearmon-Moore, Aria Malkani, Xiaobing Xia, Nabeel Farooqui, Will Powelson, Andrew Wang, Alex Sorokin

[[a]](#cmnt_ref1)I just added some links to our website

[[b]](#cmnt_ref2)I would suggest that we add a Milvus logo here to this diagram. attached below.

[[c]](#cmnt_ref3)Same here