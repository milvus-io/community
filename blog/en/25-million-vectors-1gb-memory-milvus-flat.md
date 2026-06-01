---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: >
How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
author: Julie Xia
date: 2026-6-1
cover: 
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Milvus FLAT index, vector database memory, mmap vector index, FP16 vector quantization, scalar filtering
meta_title: >
 Milvus FLAT Index: 25M Vectors on Under 1GB of Memory
desc: >
 How a community user ran 25M-vector image search on <1GB of memory in Milvus using FLAT, FP16, and mmap — instead of the Sizing Tool's 139GB estimate.
origin: https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md
---

**2500万向量，1G内存，毫秒级检索：一台windows一体机上的milvus实战**

cover:

![](https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_f4dd853941.png)

# How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus

A friend from the Milvus community recently came to us with a question about [**image-to-image search**](https://milvus.io/docs/image_similarity_search.md).

"We need to do image-to-image search on 25 million images, encoded as 1280-dimensional vectors, with a single machine serving queries at the hundred-million scale. The box has 64GB of RAM, and at most 32GB of that can go to the vector database. But the [**Sizing Tool**](https://milvus.io/tools/sizing) says we need 139GB. Are we cooked?"

![](https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_f1a5040f1e.png)

Sizing Tool estimation results: 25M × 1280-dimensional vectors, Raw Data Size 119.2 GB, Loading Memory 139.4 GB

Run the math through an [**HNSW-style**](https://milvus.io/docs/hnsw.md) "efficient" index and yes, this is hopeless. Flip the question around, though, and the most boring index in the box — [**FLAT**](https://milvus.io/docs/flat.md) — turns out to be the right call.

It did work — on under 600MB of steady-state RAM, with query latency consistently under 100ms. This post explains how, and when the same approach applies to your own use case.

![](https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_3848990c1a.png)

## Why AISAQ and IVF_FLAT Failed Before We Settled on FLAT

Before FLAT, our friend tried two flashier indexes.

**First attempt — AISAQ.** [**AISAQ**](https://milvus.io/docs/aisaq.md) is a newer disk-based index that's supposed to keep memory usage low. The catch is the build path: it writes a large volume of temporary files. In an earlier test against 55 million vectors, a single collection load wrote 249GB to disk, and the load itself was slow — burning both disk and clock.

**Second attempt — IVF_FLAT.** Index built, collection load started, then stalled at 14% and never recovered.

After two dead ends, he tried Milvus's most primitive option: [FLAT](https://milvus.io/docs/flat.md). It worked immediately.

Steady-state memory came in under 1GB, with the container's resident memory around 600MB. Startup briefly spiked to 12.5GB, but that settled cleanly once the system stabilized; the first query took roughly 30 seconds, and every query after that stayed inside 100ms.

| Index | Theory | What happened in this workload |
| --- | --- | --- |
| **AISAQ** (disk-based) | Low memory footprint in theory | Build writes a lot of temp files; in a 55M-vector test, one collection load wrote 249GB and was slow |
| **IVF_FLAT** | Standard in-memory ANN | Index built, but collection load stalled at 14% and never recovered |
| **FLAT** (brute-force) | Sizing Tool said 139GB | Steady-state <1GB; container resident ~600MB; 12.5GB startup spike; first query ~30s, then <100ms |

## How FLAT Handles 25 Million Vectors on Under 1GB of Memory

FLAT is the simplest index Milvus ships — no trees, no graphs, no clustering, just brute-force comparison against the raw vectors.

On paper, brute-forcing 25 million vectors should blow both the memory budget and the latency budget. It doesn't, because three optimizations in Milvus stack on top of each other and turn FLAT into the right tool for this job.

### Optimization 1: FP16 Cuts Vector Memory in Half

The first win is precision: store vectors at **FP16** instead of FP32 and the dataset shrinks by half.

-   Per vector: 1280 dims × 4 bytes = 5120 bytes → 1280 dims × 2 bytes = 2560 bytes
-   Across 25 million vectors: ~120GB → ~60GB

In most retrieval workloads this costs almost nothing in accuracy — recall typically moves by less than 0.1% — while storage and memory both drop in half.

### Optimization 2: mmap Moves the Rest of the Vectors onto Disk

Even after FP16, 60GB still overshoots the 16GB of physical memory available. That's where [**mmap**](https://milvus.io/docs/mmap.md) takes over as the second optimization.

FLAT has no extra index data; what sits on disk is the raw vectors themselves. With mmap on, those vectors live as memory-mapped files on disk instead of being loaded wholesale into RAM. The OS pages data in as queries touch it, and overall memory usage drops sharply.

**From** [**Milvus 2.6**](https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md) **onward, mmap on raw vector data is enabled by default.** Our friend is running Milvus 2.6.14 and never touched the mmap setting — the cluster-level default already had it covered.

One gotcha worth knowing: [**Attu**](https://zilliz.com/attu) only shows the Schema-level mmap setting, not the cluster default. So Attu can read mmap as "disabled" while the cluster default has actually flipped it on.

**The trade-off:** mmap on raw vectors costs you about 60GB of extra disk. On a box with SSD, that's a perfectly fair price.

### Optimization 3: Scalar Filtering Is the Real Performance Multiplier

FP16 cuts data size in half. mmap handles the memory problem. But what about brute-force latency across 25 million rows?

The answer lies in the query pattern. Every query in this use case includes a [scalar filter](https://milvus.io/docs/boolean.md) — something like:

```sql
dataid in [123] AND classid in [0, 2, 3]
```

That [**filter expression**](https://milvus.io/docs/boolean.md) runs first against the scalar fields and trims 25 million candidates down to anywhere from a few hundred to tens of thousands. FLAT's brute-force pass then only has to compare against that small subset, and tens of thousands of vector comparisons fall comfortably into the millisecond range on a modern CPU. Layered onto mmap, only the matching vectors get paged into memory at all — so memory pressure stays low through the entire query path.

That's also why FLAT beats [**IVF_FLAT**](https://milvus.io/docs/ivf-flat.md) and HNSW in this scenario: once scalar filtering has crushed the candidate set down small enough, an extra index structure is just dead weight — it eats memory and build time but barely moves retrieval speed.

One caveat. The expressions in this workload are simple, so even without [**scalar indexes**](https://milvus.io/docs/scalar_index.md) the filter stage stays cheap. For heavier filters — `like` patterns, large `in` lists, multi-level JSON predicates — you'll want a scalar index on the relevant fields to keep filtering fast.

| Optimization | What it does | Memory impact | Trade-off |
| --- | --- | --- | --- |
| **FP16 storage** | Store vectors at half precision (FP32 → FP16) | 25M × 1280-dim: ~120GB → ~60GB | Recall typically moves <0.1% |
| **mmap on raw vectors** | Memory-map vectors on disk instead of loading them into RAM | Memory pressure drops to demand-paged | ~60GB of extra disk |
| **Scalar filtering first** | Filter on scalar fields before the brute-force pass, cutting 25M candidates down to hundreds–tens of thousands | Only matching vectors page in (when combined with mmap) | Heavy filters (large `in`, `like`, JSON) need scalar indexes |

## Beyond Image Search: Where Else the FLAT + FP16 + mmap Pattern Applies

The image search case works because of two conditions: strong scalar filtering, and a real search space much smaller than total data size. **That same pattern appears across many common workloads.**

-   [**Multi-tenant RAG**](https://milvus.io/docs/multi_tenancy.md): filtering by `tenant_id` typically leaves only thousands to tens of thousands of rows per tenant — well within FLAT's effective range.
-   **E-commerce product search**: filter by category or brand first, then run [vector similarity search](https://zilliz.com/learn/vector-similarity-search) within that subset.
-   **Log and document retrieval**: filter by time range and source, then run semantic search on the result.

All of these are good candidates for FLAT + FP16 + mmap: low memory overhead, solid retrieval performance, no index build complexity.

If your workload doesn't have strong scalar filtering — if every query searches across all 25 million vectors — this approach won't deliver the same latency. In that case, a graph-based index like [HNSW](https://milvus.io/docs/hnsw.md) is the right tool, even if it requires more memory.

One final note on the [Milvus Sizing Tool](https://milvus.io/tools/sizing): the 139GB estimate assumes all data is fully loaded into RAM at FP32 precision — a conservative worst-case baseline. Your actual memory footprint depends on vector precision, index type, scalar filter selectivity, and whether mmap is enabled. Use it as a starting point, then test against your real workload before drawing conclusions about hardware requirements.

## Get Started

If you want to try the same FLAT + FP16 + mmap recipe:

-   Spin up Milvus locally from the [**Milvus quickstart**](https://milvus.io/docs/quickstart.md) or grab the source on [**Milvus GitHub**](https://github.com/milvus-io/milvus). mmap on raw vectors is on by default from Milvus 2.6 forward, and FLAT needs no extra index parameters.
-   Manage and inspect collections with Attu — just remember it shows Schema-level mmap, not the cluster default.
-   Don't want to run the box yourself? [**Zilliz Cloud**](https://zilliz.com/cloud) is the managed-Milvus service with a free tier — [**sign up**](https://cloud.zilliz.com/signup) for free credits with a work email, or [**sign in**](https://cloud.zilliz.com/login) if you already have an account.