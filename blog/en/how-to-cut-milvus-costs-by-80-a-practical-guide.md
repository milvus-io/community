---
id: how-to-cut-milvus-costs-by-80-a-practical-guide.md
title: >
 How to Cut Milvus Costs by 80%: A Practical Guide
author: Jack Li
date: 2026-3-31
cover: assets.zilliz.com/Chat_GPT_Image_Mar_31_2026_04_32_24_PM_6410052639.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Milvus cost optimization, vector database memory reduction, IVF_SQ8 index, MMap Milvus, tiered storage Milvus
meta_title: >
 How to Cut Milvus Vector Database Costs by 80%: A Practical Guide
desc: >
 Learn 4 proven strategies to reduce Milvus memory costs by up to 80%—index tuning, MMap, tiered storage, and TTL.
origin: https://milvus.io/blog/how-to-cut-milvus-costs-by-80-a-practical-guide.md
---



In most RAG systems, the vector database is the second-largest line item on the bill, right behind LLM API calls. Depending on the architecture, it can eat roughly 45% of total infrastructure spend.

Most of that cost is memory. Vector indexes like [](https://milvus.io/docs/index.md?tab=floating#HNSW)[HNSW](https://milvus.io/docs/index.md?tab=floating#HNSW) and [](https://milvus.io/docs/index.md?tab=floating#IVF_FLAT)[IVF](https://milvus.io/docs/index.md?tab=floating#IVF_FLAT) need to live in RAM for millisecond-level search latency, and at scale, that RAM adds up fast. A 100-million-vector deployment on a major cloud provider can easily run thousands of dollars a month — almost entirely driven by memory.

The good news: you can cut that bill dramatically. Milvus ships with features that reduce memory costs by up to 80%, from compressed indexes to tiered storage to automatic data expiration. Most of them require minimal changes and barely affect search quality.

This guide covers four strategies, ordered by impact:

1.  **Choose a memory-efficient index** to cut memory usage by 4–6x
2.  **Offload data from RAM with MMap or tiered storage** to save another 60–80%
3.  **Use lower-dimension embeddings** to shrink the data at the source
4.  **Manage data lifecycle with compaction and TTL** to stop paying for stale data

## What Causes the Expenses in Using Milvus

In a production Milvus deployment, costs break down into three categories. Here’s a reference workload of 100 million vectors at 768 dimensions (float32):

| **Resource** | **Share of total cost** | **Estimated monthly cost** |
| --- | --- | --- |
| Compute instances (CPU + memory) | 85–90% | ~$2,800* |
| Network | 5–10% | ~$250 |
| Object storage | 2–5% | ~$100 |

**Approximate. Actual cost varies by cloud provider, instance type, and pricing model (on-demand vs. reserved).*

**Memory dominates because vector search works differently from traditional databases.** A SQL database uses compact B-tree indexes and serves most queries from disk. Vector search runs millions of floating-point comparisons per query, and indexes like HNSW build graph structures that can be 1.5–2x the size of the raw data. All of that has to live in RAM to keep latency in the low milliseconds.

Here’s a quick memory estimate for the reference workload:

```
Memory needed = vectors x dimensions x 4 bytes x index overhead
             = 100M x 768 x 4B x 1.8 (HNSW)
             = ~553 GB
```

That requires multiple high-memory instances. It’s where the vast majority of optimization effort should go.

**Network** costs stay manageable if you avoid cross-region calls, return IDs and scores instead of raw vectors, and keep replica sync overhead in check.

**Storage** is the cheapest part. Milvus uses a storage-compute separation architecture, so all data and indexes persist in object storage (S3 or MinIO) at roughly $0.02–$0.03/GB/month. The reference workload costs about $26/month for storage. Not worth optimizing unless you run dozens of replicas.

The rest of this guide focuses on memory.

## Strategy 1: Pick a Cheaper Index

The single biggest lever is your index type. Different indexes compress and organize vectors differently, and the memory gap between them can be as high as 4–6x for the same dataset.

Most teams start with [](https://milvus.io/docs/hnsw.md)[HNSW](https://milvus.io/docs/hnsw.md) (fast queries, high recall) or [](https://milvus.io/docs/ivf-flat.md)[IVF_FLAT](https://milvus.io/docs/ivf-flat.md) (simple, accurate). Both keep vectors at or above their original size in memory. Switching to a quantized index like [](https://milvus.io/docs/ivf-flat.md#IVF_SQ8)[IVF_SQ8](https://milvus.io/docs/ivf-flat.md#IVF_SQ8) — which compresses each float32 value down to uint8 — cuts memory by roughly 4x with only a small recall tradeoff.

Here's how the main index types compare for a 100M-vector, 768-dim, float32 collection:

| **Index type** | **Memory (vs. raw data)** | **Build time** | **Query speed** | **Recall** | **Best for** |
| --- | --- | --- | --- | --- | --- |
| [FLAT](https://milvus.io/docs/index.md) | ~1.0x | Fast | Slow | 100% | Small datasets (<1M vectors) |
| [IVF_FLAT](https://milvus.io/docs/ivf-flat.md) | ~1.05x | Medium | Medium | 95–99% | General-purpose |
| [IVF_PQ](https://milvus.io/docs/ivf-pq.md) | **~0.30x** | **Medium** | **Medium** | **93–97%** | **Cost-sensitive (recommended)** |
| [IVF_PQ](https://milvus.io/docs/ivf-pq.md) | ~0.12x | Slow | Fast | 70–80% | Very large scale |
| [HNSW](https://milvus.io/docs/hnsw.md) | ~1.8x | Slow | Fastest | 98–99% | Low-latency priority |
| [DiskANN](https://milvus.io/docs/disk_index.md) | ~0.08x* | Slow | Medium | 95–98% | Very large scale + fast SSD |

**DiskANN’s in-memory footprint depends on configuration. Default is closer to ~0.125x; aggressive tuning can push it to ~0.08x.*

A few things to note:

-   **FLAT** stores vectors as-is with no compression. It scans everything on every query, so it only works for small datasets. But it’s perfectly accurate.
-   **IVF variants** organize vectors into clusters. At query time, Milvus only searches the nearest clusters. IVF_SQ8 adds scalar quantization on top, cutting memory by 4x with minimal recall loss.
-   **HNSW** builds a multi-layer graph of shortcuts between similar vectors. It’s the fastest at query time, but the graph structure roughly doubles the memory footprint.
-   **DiskANN** keeps most of the index on SSD and loads only a compressed representation into memory. It requires a high-performance NVMe SSD (IOPS > 10,000).
-   **For most RAG workloads, IVF_SQ8 hits the sweet spot.** Recall typically drops by only 2–3 percentage points compared to IVF_FLAT (from ~97% to ~94–95%), but memory costs drop by 70%. For chatbots, knowledge bases, and document search, that tradeoff works well.

If your use case tolerates even lower recall, IVF_PQ and IVF_RABITQ (available in Milvus 2.6+) compress further through product quantization and 1-bit quantization.

## Strategy 2: Stop Loading Everything into RAM with MMap and Tiered Storage

Changing your index reduces *how much* memory each vector needs. **MMap** and **tiered storage** reduce *how much of your data* sits in memory at all.

Both reduce memory usage by 60–80%. They work differently, and the right choice depends on your latency requirements and access patterns.

### How MMap and Tiered Storage Work in Milvus

**MMap (memory-mapped files)** downloads all data from object storage to local disk, then uses the OS page cache to load chunks into memory on demand. When Milvus reads a piece of data, the OS pulls just that 4 KB page into RAM. If memory fills up, it evicts the least-recently-used pages automatically.

Your data stays available locally (consistent latency), but only the actively-used portion occupies RAM. The tradeoff: you still need enough local disk to hold the full dataset.

**Tiered storage** goes a step further. Instead of downloading everything to local disk, data stays in object storage (S3/MinIO) and only gets pulled into a local cache when accessed. The local cache holds only "hot" data, the subset that gets queried frequently.

On startup, only metadata loads (megabytes, not gigabytes), so the node starts in seconds. Cache hits return in under 5 ms. Cache misses pull from object storage (50–200 ms) and then get cached for next time.

```
Traditional full-load:
  Object storage --full load--> RAM (100% resident)
                                ^ highest cost

MMap:
  Object storage --full download--> Local disk (100%) --on demand--> RAM (10-30%)
                                    ^ new cost                      ^ big savings

Tiered storage:
  Object storage <--on demand--> Local cache (10-30%) --on demand--> RAM (minimal)
  ^ persistent layer             ^ big savings                      ^ big savings
```

### Should You Use MMap or Tiered Storage?

| **Scenario** | **Recommended** | **Why** |
| --- | --- | --- |
| Latency-sensitive (P99 < 20 ms) | MMap | All data is local, no object storage round-trips |
| Uniform access, no clear hot/cold split | MMap | Tiered storage cache hit rates would be low |
| Cost is the priority, occasional latency spikes OK | Tiered storage | Local disk needs shrink by 70–90% |
| Clear hot/cold pattern (80/20 rule) | Tiered storage | High cache hit rates, low cost + good performance |
| Very large scale (500M+ vectors) | Tiered storage | Local disk can’t hold the full dataset anyway |
| Running Milvus 2.3–2.5 | MMap | Tiered storage requires 2.6+ |

Both options benefit from a fast local SSD. NVMe with IOPS > 10,000 is recommended.

### MMap Configuration

**Option 1: YAML config (recommended for new deployments)**

Edit milvus.yaml under the queryNode section:

```
queryNode:
  mmap:
    vectorField: true      # Vector data
    vectorIndex: true      # Vector index (biggest savings!)
    scalarField: true      # Scalar data (recommended for RAG)
    scalarIndex: true      # Scalar index
    growingMmapEnabled: false  # Keep incoming data in memory
```

**Option 2: Python SDK (for existing collections)**

```
from pymilvus import MilvusClient

client = MilvusClient(uri="http://localhost:19530")

# Must release the collection before modifying mmap properties
client.release_collection("my_collection")

# Enable MMap
client.alter_collection_properties(
    collection_name="my_collection",
    properties={"mmap.enabled": True}
)

# Reload (applies MMap config)
client.load_collection("my_collection")

# Verify the config took effect
print(client.describe_collection("my_collection")["properties"])
# Output: {'mmap.enabled': 'True'}
```

### Tiered Storage Configuration (Milvus 2.6+)

Edit milvus.yaml under the queryNode section:

```
queryNode:
  segcore:
    tieredStorage:
      warmup:
          # Options: sync, async, disable
          # Controls when tiered storage cache warmup happens.
          # - "sync": Data loads into cache before a segment is considered loaded.
          # - "disable": Data only loads into cache when a search/query needs it.
          # Default is "sync", but vector fields default to "disable".
          scalarField: sync
          scalarIndex: sync
          vectorField: disable # Cache warmup for raw vector data is off by default.
          vectorIndex: sync
      memoryHighWatermarkRatio: 0.85   # Start evicting when memory usage exceeds 85%
      memoryLowWatermarkRatio: 0.70    # Stop evicting at 70%
      diskHighWatermarkRatio: 0.80     # Disk eviction high watermark
      diskLowWatermarkRatio: 0.75      # Disk eviction low watermark
      evictionEnabled: true            # Must be enabled!
      backgroundEvictionEnabled: true  # Background eviction thread
      cacheTtl: 3600                   # Evict data not accessed for 1 hour
```

## Strategy 3: Use Smaller Embeddings

Vector dimensions multiply costs across the board: memory, storage, and compute. A 1536-dimension embedding uses exactly 4x the resources of a 384-dimension one. It also takes 4x longer to compute distance on each query, which affects throughput under load.

Choosing a lower-dimensional model is the most direct way to reduce this multiplier. Here's how common embedding models compare (relative cost is indexed to the 384-dim model as 1.0x):

| **Model** | **Dimensions** | **Relative cost** | **Recall** | **Best for** |
| --- | --- | --- | --- | --- |
| text-embedding-3-large | 3072 | 8.0x | Highest (98%+) | Research, medical, high-precision |
| text-embedding-3-small | 1536 | 4.0x | High (95–97%) | General RAG |
| text-embedding-ada-002 | 1536 | 4.0x | High (95–97%) | General-purpose (older model) |
| DistilBERT | 768 | 2.0x | Medium-high (92–95%) | Balanced cost and performance |
| all-MiniLM-L6-v2 | 384 | 1.0x (baseline) | Medium (88–92%) | Cost-sensitive applications |

**Test before you commit.** Run a sample dataset (around 1M vectors) across a few models at different dimensions. Find the smallest dimension that meets your recall requirements, then deploy at scale. The difference between 384 and 1536 dimensions is a 4x cost multiplier. Spending a day on benchmarking pays for itself.

You can also reduce dimensions through post-processing techniques like PCA (principal component analysis) or Matryoshka embeddings, which let you truncate a high-dimensional vector to a shorter one with graceful quality degradation.

## Strategy 4: Clean Up Stale Data with Compaction and TTL

The strategies above reduce per-vector costs. This one keeps the total vector count from growing unchecked.

Milvus uses append-only storage. When you delete a record, it gets a logical delete marker — the underlying data isn't reclaimed immediately. Over time, this means your storage footprint grows even as your active dataset stays the same size. More segments to scan, more data to sync, more backup overhead.

Two mechanisms keep this under control:

### Compaction: Reclaim Space from Deleted Records

[Compaction](https://milvus.io/docs/compact-data.md) merges small segments, strips out deletion markers, and produces clean, compact segments. Think of it as garbage collection for your vector data.

**When you need it:**

High write volume with frequent deletes (e-commerce catalog updates, content moderation, log pipelines)

Segment count keeps growing

Storage usage climbs even though your active dataset hasn’t changed

**One warning:** compaction is resource-intensive. Schedule it during off-peak hours to avoid affecting query performance.

### TTL (Time to Live): Automatic Expiration

For time-sensitive data like chat logs, session data, news articles, and event streams, [TTL](https://milvus.io/docs/set-collection-ttl.md) is the cleaner solution. You set a time window (7 days, 30 days, whatever fits), and Milvus automatically marks records older than that for deletion. Combined with compaction, the physical space gets reclaimed too.

**Common TTL use cases:**

RAG systems that only need the last 7 or 30 days of data

Real-time recommendation engines where older signals lose relevance

Any system where "freshness" is part of the quality model

## A Managed Alternative: Zilliz Cloud

Every strategy in this guide requires someone to configure it, test it, and keep it running. Index selection, MMap tuning, compaction scheduling, capacity planning: that's real engineering time, and it compounds as your dataset grows.

Two paths forward from here:

Self-host Milvus if you want full control over your deployment. You get complete flexibility to tune every parameter covered in this guide, run on your own infrastructure, and customize the setup to your exact needs. The tradeoff is that your team owns the ongoing operations.

Use [Zilliz Cloud](https://cloud.zilliz.com/signup) if you'd rather not manage that yourself. It's fully managed Milvus, built by the same team that builds the open-source project. The optimizations in this guide (index selection, MMap, tiered storage, compaction) are applied by default. You sign up, get a URI, and swap it into your existing code.

A few specifics on what changes:

Cardinal engine powers Zilliz Cloud's search layer. In [VectorDBBench](https://github.com/zilliztech/VectorDBBench) benchmarks, it delivers 3-5x the throughput of open-source Milvus on the same hardware. Fewer nodes for the same workload means a lower bill without any YAML editing.

AutoIndex picks and tunes index algorithms automatically, maintaining 96%+ recall. No more manual index benchmarking.

Free tier includes 5 GB of storage and 2.5M vCUs per month, permanently. Enough to test everything in this guide without a credit card.

Because Milvus and Zilliz Cloud share the same API and data format, [migration](https://docs.zilliz.com/docs/via-stage) doesn't require re-embedding or rewriting queries. For a detailed feature comparison, see [Zilliz Cloud vs. self-hosted Milvus](https://zilliz.com/comparison).

## Conclusion

Memory accounts for 85–90% of your Milvus bill. These four strategies stack to cut it by up to 80%:

| **Strategy** | **What it does** | **Typical savings** | **Tradeoff** |
| --- | --- | --- | --- |
| 1. Switch to a compressed index (e.g., IVF_SQ8) | Quantizes vectors from float32 to uint8 | 4–6x less memory | 2–3% recall drop (97% to 94%) |
| 2. Enable MMap or tiered storage | Moves data off RAM to disk or object storage | 60–80% less memory | Slightly higher tail latency |
| 3. Use lower-dimension embeddings | Fewer numbers per vector = less everything | 2–4x less memory | Depends on model quality at lower dims |
| 4. Set up compaction + TTL | Removes dead and expired data | Prevents long-term bloat | Compaction needs off-peak scheduling |

**The recommended order:**

1.  **Start with the index.** Switching from HNSW to IVF_SQ8 is a config change that can cut memory by 70% overnight.
2.  **Then enable MMap or tiered storage.** Change how data loads into memory: full-resident becomes on-demand.
3.  **Then evaluate your embedding dimensions.** This requires re-embedding your data, so it’s a bigger lift, but the savings are permanent.
4.  **Finally, set up lifecycle management.** TTL and compaction prevent costs from creeping back up over time.

Each strategy works independently. You can apply them in any combination. But stacking them is where the real savings happen.

Questions about cutting your vector DB bill? Join the [](https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q)[Milvus Slack community](https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q) or [](https://meetings.hubspot.com/chloe-williams1/milvus-office-hour)[book an office hours session](https://meetings.hubspot.com/chloe-williams1/milvus-office-hour) for hands-on help. We'd like to hear what's working for you.