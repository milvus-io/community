---
id: announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >
 Announcing Milvus 3.0: Lake-Native Vector Search and a More Powerful Retrieval Engine
author: Fendy Feng and Li Liu
date: 2026-7-16
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Milvus 3.0, lake-native vector search, vector database, External Collections, AI retrieval engine
meta_title: >
 Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >
 Discover Milvus 3.0’s lake-native vector search, zero-copy external collections, faster sparse retrieval, snapshots, Spark integration, and advanced ranking capabilities.
origin: https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---

Today, we're releasing Milvus 3.0, a major architectural milestone for the project. It changes both where Milvus can build and serve indexes and how much retrieval work can be done directly within the engine.

-   Milvus 3.0 introduces **a lake-native path** for indexing vector data that lives in object storage and open table formats, including Parquet, Lance, Iceberg, and Vortex. Teams can make lake-resident data searchable without maintaining another copy in a vector database.
-   **This release also expands Milvus beyond initial candidate retrieval.** Server-side sorting, aggregation, faceted search, StructArray for nested doc/chunk structure and ColBERT vectors, and a redesigned sparse index move more ranking, grouping, and result processing out of application code and into the retrieval engine.


Together, these advances make Milvus the open-source foundation for production AI retrieval and for [Vector Lakebase](https://zilliz.com/blog/from-vector-database-to-vector-lakebase) architectures that combine lake-native storage with high-performance vector retrieval.


<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## A quick glance at the Milvus 3.0 feature set

| **Area** | **Features** | **Why it matters** |
| --- | --- | --- |
| Lake-native retrieval | External Collections over Parquet, Lance, Iceberg, and Vortex | Search lake-resident data without maintaining a second serving copy |
| S3-based Storage | Loon (Storage v3) | Reduce point-read amplification for serving-style access and support schema evolution |
| Offline/batch workflows and recovery | Snapshots, Spark DataSource V2, and online schema evolution | Bring stable collection views into evaluation, deduplication, clustering, and feature pipelines |
| Retrieval engine | ORDER BY, aggregation, facets, StructArray, and improved sparse retrieval | Move more result processing and multi-vector scoring into Milvus |
| Data Model & Operations | Nullable vectors, TEXT LOB, TTL, MinHash, Woodpecker, and ForceMerge | Support richer data models and production operating patterns |

## The lake-native infrastructure: index and serve data where it already lives

The biggest architectural change in Milvus 3.0 is where the system can build and serve indexes. Vector data can remain in open formats on object storage while Milvus provides production-grade indexing, retrieval, and APIs.

### 1. External Collections: indexing directly on lake-resident data

Many teams already store embeddings in a data lake — Lance tables, Iceberg tables, Parquet files, or other open-format datasets on S3, GCS, or Azure Blob Storage. Before Milvus 3.0, there were usually two options for searching that data.

-   Copy the embeddings into a vector database. This provides low-latency search, but creates a second copy and an ETL pipeline that must remain synchronized.
-   Query the lake directly. This avoids duplication, but without ANN indexes, vector search becomes a brute-force scan that cannot meet production latency.

**External Collections introduce a third path.** You define a Milvus collection over data that remains in object storage, map external fields into a Milvus schema, and use the same search and query APIs as a native collection. The source files do not move; Milvus builds and serves vector, BM25 inverted, JSON, and scalar indexes over the external data.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png)

**External Collections are read-only and zero-copy**, which makes them useful when governance, ownership boundaries, or operating cost require the source dataset to remain in the lake.

When the external dataset changes, Milvus reads its storage manifest and indexes newly added fragments instead of rebuilding the entire collection. A collection-level load mode also lets teams choose how much data to keep local:

| **Load mode** | **Behavior** | **Best for** |
| --- | --- | --- |
| Take | Read from object storage on each query | Lowest storage cost; less latency-sensitive workloads |
| LazyLoad | Cache data on first access | Mixed workloads where hot data emerges over time |
| Load | Keep data resident | Lowest-latency serving |

```python
# register a lake table as a zero-copy Collection
client.create_collection(
  name="docs",
  external_source={"format": "iceberg",  # iceberg|lance|parquet|vortex
                   "uri": "s3://lake/docs"},
  schema=[
    Field("id",  INT64, primary=True, external_field="doc_id"),
    Field("emb", FLOAT_VECTOR, dim=1024, external_field="embedding"),
    Field("title", VARCHAR, external_field="title")])

client.create_index("docs", "emb", {"index_type": "HNSW"})  # in place
client.load("docs", mode="lazy")  # Take | LazyLoad | Load
```

For governed environments, retrieval can run where the data is allowed to live. For large AI systems, a lake-resident dataset can support multiple retrieval deployments without a migration job between them.

External collections are an additive capability. Native Milvus collections remain the primary path for write-heavy, low-latency serving, while External Collections are designed for datasets whose system of record remains outside Milvus.

For more details, see [[Create an External Collection]](https://milvus.io/docs/create-an-external-collection.md).

### 2. Loon (Storage v3): Efficient Point Reads for Lake-Native Retrieval

External Collections raise an obvious question: object storage is designed for scale and durability, but can it support the narrow point reads that follow an ANN search?

**The challenge is read amplification.** Vector search commonly runs in two stages: an ANN index returns candidate IDs, and the system fetches selected fields for those candidates. Formats optimized for analytical scans can turn a narrow logical lookup into a much larger physical read.

**Milvus 3.0 addresses this problem with Loon, also known as Storage v3, a manifest-based columnar storage engine for S3-compatible object storage.** Loon organizes fields into `ColumnGroups` with aligned row IDs, allowing scalar fields to favor filtering and scans while vectors and point-read-heavy fields use layouts designed for narrower lookups.

Loon keeps vector and inverted indexes separate from the file format rather than embedding them within it. Each dataset version is described by an immutable manifest that records its `ColumnGroups`, allowing the same indexing engine to work across Lance, Parquet, Iceberg, and Vortex.

The manifest design also makes schema evolution less disruptive. Adding or dropping a field can update metadata without rewriting existing columns. Filling a new field writes a new `ColumnGroup` while leaving existing `ColumnGroups` unchanged.

[**Vortex**](https://github.com/vortex-data/vortex) is the default format for this path. It is an open, Arrow-compatible columnar format with flexible layouts and nested encodings that better match point-query-heavy AI data. In one internal benchmark using 3 million rows, 128-dimensional vectors, S3, and 256 concurrent readers, measured I/O per point read fell from about 9.4 MB for the Parquet baseline to 0.07 MB for Vortex with Loon, roughly 135 times less.

Milvus 3.0 does not make object storage behave like local memory. It reduces the read amplification that otherwise makes object storage impractical for serving-style point lookups. Predicate pushdown into the format and a local Vortex variant are next on the roadmap.

_For more details, see our blog:_ [_Why We Built Loon_](https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md) _and the_ [_Vortex project_](https://github.com/vortex-data/vortex)_._

### 3. Snapshots: point-in-time view without data copy

Offline jobs need a consistent view of data even while production collections continue to receive writes. A Milvus snapshot is a point-in-time, read-only view that records references to existing data, index, and metadata files instead of copying the full dataset.

That makes snapshots inexpensive enough to create before risky operations such as a model swap, re-embedding job, or schema migration. Restoring a snapshot can reuse existing data and index files through server-side copy in object storage rather than reimporting every row and rebuilding every index. This feature is particularly useful for fast-moving workloads like AI agents, where data changes constantly, and you want frequent, cheap recovery points rather than occasional heavy backups.

The same frozen view can support evaluation, deduplication, backfill validation, and isolated testing while the live collection continues to accept writes. The snapshot stabilizes the logical input, although the workloads may still share infrastructure such as object storage and network bandwidth.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_2_f2a9f9e9da.png)

Snapshots do not replace backups. A snapshot references files owned by the live collection and is best suited to logical recovery, cloning, and short-lived stable views. A backup creates an independent copy for long-term retention and disaster recovery.

For more information, see [Snapshots](https://milvus.io/docs/snapshots.md), [Manage Snapshots](https://milvus.io/docs/manage-snapshots.md), and [Snapshot Use Cases](https://milvus.io/docs/snapshot-use-cases.md).

### 4. Spark connector: connect Milvus to batch workflows

A stable snapshot is only useful if batch engines can read it. Milvus 3.0 exposes Milvus as a Spark DataSource V2, allowing Spark, Databricks, and EMR jobs to read from and write to Milvus as part of standard batch pipelines.

This feature matters because AI data workflows are iterative: deduplication feeds re-embedding, clustering feeds evaluation, and evaluation produces curated training or serving sets. A stable snapshot provides those jobs with consistent input, while the live collection keeps serving. With the Spark connector, the sink of one job becomes the source of the next, without exporting a full collection out of Milvus each time.

Milvus 3.0 also introduces vector-native batch operators for tasks such as deduplication, anomaly detection, and clustering, keeping compute-heavy work outside the online query path while operating directly on vector data.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png)

### 5. Online schema changes and backfill

A schema rarely stays static in production — teams add new embedding models, sparse vectors, labels, metadata fields, and retention policies over time. Milvus 3.0 lets them add, fill, and drop columns while serving continues, instead of the disruptive rebuilds this used to require.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png)

Adding or dropping a column does not require rewriting existing data. `client.add_collection_field(...)` lands a new nullable column without taking the collection offline, and `client.drop_collection_field(...)` removes a deprecated or experimental field at runtime. Neither one rewrites the existing data — each is a change to the collection’s manifest rather than to the data files, which is why there is no rebuild.

Milvus 3.0 supports two backfill paths:

-   **Inner backfill** (in 3.0) is for values derived from existing fields. Milvus can generate a BM25 sparse vector from a text column within the kernel, eliminating the need for a client-side encoder when building dense-plus-sparse hybrid retrieval.
-   **External backfill**(on the roadmap) will be for values computed outside Milvus: take a snapshot, run Spark against the consistent view, compute a new column, write the values back, and let Milvus update the index incrementally. This is the intended path for large re-embedding jobs — for example, adding a new embedding column across hundreds of millions of rows while writes continue.

Together, online schema changes and backfill make it easier to evolve retrieval pipelines without rebuilding an entire collection every time the data model changes.

## A More Powerful Engine for End-to-End Retrieval

Milvus has long supported more than dense ANN search, including BM25-based sparse retrieval and hybrid search. Milvus 3.0 extends the engine along a different axis: it brings more of the multi-stage retrieval pipeline into Milvus itself, reducing over-fetching, duplicated application logic, and reliance on separate post-processing services.

### 1. Server-side ORDER BY: sort inside the engine, per segment

Sorting previously required applications to over-fetch candidates, move them to the client, and sort them there. That consumed bandwidth and made the final result dependent on where client-side truncation occurred.

**Milvus 3.0 adds server-side ORDER BY**, which lets query workloads sort filtered rows by scalar fields such as rating, price, freshness, inventory, or timestamp.

-   On the query path, each segment sorts its filtered result set, query nodes merge those streams, and the proxy returns the requested slice.
-   On the search path, ORDER BY sorts the ANN candidate set within Milvus, reducing client-side over-fetching and duplicate post-processing. It does not change the recall boundary established by the ANN candidates.

```sql
client.query(
    collection_name="products",
    filter="category == 'shoes'",
    output_fields=["price", "rating"],
    limit=10,
    order_by=["rating:desc", "price:asc"],
)
```

This is especially useful for searches that combine relevance with business or user-facing constraints such as rating, price, freshness, inventory, or timestamp.

For more information, refer to [Sort Search Results by Scalar Fields](https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x) and [Sort Query Results](https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x).

### 2. Aggregation and faceted search

Milvus 3.0 adds query-side aggregation with operations such as count, sum, average, minimum, and maximum, grouped by one or more scalar fields. This removes a common pattern where teams pull filtered rows into client code just to count, group, or compute simple statistics.

```sql
client.query(
    collection_name="orders",
    filter="in_stock == true",
    group_by_fields=["category"],
    output_fields=["category", "count(*)", "avg(price)", "max(rating)"],
)
```

Milvus 3.0 also adds **search aggregation** for faceted search. After an ANN search, Milvus groups the retrieved hits by a field and returns bucket counts, aggregate statistics, and top-N sample hits per bucket — the pattern behind grouping by brand, price range, color, tenant, or document type. One caveat: search aggregation operates over the ANN-retrieved result set, not the whole collection, so facet counts are approximate. When you need exact counts, use query-side aggregation.

For more information, refer to [Aggregate Query Results](https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x).

### 3. StructArray for Nested Vectors and Late-Interaction Model

Many entities are naturally represented by multiple vectors. A long document is a series of chunks; a video is a sequence of frames you would rather keep together in one row than scatter across many; a product has several images or angles. Late-interaction models push this even further — ColBERT emits one vector per token, ColPali one per visual patch. In every case, the unit you actually want to store and search for is the whole entity, not each fragment on its own.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png)

**StructArray** allows a Milvus row to contain a variable-length array of structured elements, including multiple vectors, while preserving a single entity ID and a single set of metadata. That avoids splitting a document into multiple rows and duplicating labels, permissions, or other fields across fragments.

Milvus supports two search granularities.

-   **Element-level search** matches one query vector against each element in the list and returns the specific matching element with its offset. This is useful when you want to know which chunk, token, patch, or image matched. A row can appear more than once if multiple elements match.
-   **Entity-level search** compares a query’s full vector list against the row’s vector list using `MAX_SIM`, with the `MAX_SIM_COSINE` metric. Each query token takes its best match in the document, and those best scores are summed. This gives Milvus native support for late-interaction retrieval patterns such as ColBERT and ColPali while keeping one row per document.

Indexing every token vector can be expensive; so Milvus 3.0 adds multiple acceleration paths, including TokenANN, Muvera, and Lemur, which trade index size, training cost, and recall.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_6_2064b9d975.png)

In our benchmarks, Lemur matches or beats TokenANN recall on most datasets while collapsing each document to a single vector; the exception is corpora with high length variance, where TokenANN or another strategy is safer.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png)

For corpora larger than memory, Milvus also supports a `DISKANN` index that keeps embedding lists on disk to reduce RAM pressure.

Element-level search has already arrived in Milvus 2.6. Filtering for Muvera, Lemur, and StructList is new in 3.0.

### 4. BM25 Index Compression and SINDI

Milvus has supported sparse vector search in earlier releases. Milvus 3.0 reduces the sparse-index footprint through block-compressed postings (VByte-related algorithms plus SIMD decoding) and quantization (fp16 for inner products, u16 for BM25).

Across one set of internal BM25 benchmarks, the new implementation was roughly 3 times smaller than the Milvus 2.6 sparse index at comparable recall. A smaller index reduces memory and bandwidth pressure and can improve speed in workloads limited by data movement.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png)

Milvus 3.0 also introduces [SINDI](https://arxiv.org/abs/2509.08395), a new sparse retrieval algorithm optimized for learned sparse embeddings such as SPLADE. Because these embeddings produce denser posting lists than BM25, pruning-heavy search algorithms can spend substantial CPU time deciding what to skip. SINDI instead organizes postings into compact windows and uses SIMD-friendly score accumulation to process them efficiently, while preserving retrieval accuracy through lossless pruning.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png)

We also extended SINDI beyond its original design to include native BM25 support, enabling Milvus to use the same optimized sparse retrieval path for both learned sparse embeddings and traditional full-text search.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png)

In our benchmarks across 4 SPLADE sparse vector datasets, SINDI reaches up to about 10x the QPS of MaxScore on learned-sparse vectors, with a worst-case of around 5x.

SINDI is the default for sparse inner-product search in Milvus 3.0.

## Other Enhancements

| **Feature sets** | **Descriptions** |
| --- | --- |
| **TEXT LOB** | Stores long source text beside vectors. Text under 64 KB remains inline; larger values use a Vortex LOB reference. |
| **Expanded dense index support** | Adds more index choices within the Faiss family, including SVS, Panorama, PQ, IVFPQ, and ScaNN, for different scale, memory, and recall requirements. |
| **MinHash and near-duplicate search** | Generates MinHash signatures on the server side and retrieves near-duplicate candidates using MINHASH_LSH. |
| **Nullable vectors and new types** | Allows vector fields to be NULL and adds TIMESTAMPTZ for time-aware filtering and retention policies. |
| **Custom full-text dictionaries** | Registers dictionaries, synonyms, and stop-word resources on the cluster for multilingual and domain-specific tokenization. |
| **Standalone Woodpecker** | Runs the Milvus write-ahead log as an independently scalable and observable service. |
| **Entity TTL** | Expires individual records through a TIMESTAMPTZ field, with MVCC filtering followed by garbage collection during compaction. |
| **ForceMerge** | Compacts small segments to a target size and rebuilds indexes to reduce read amplification before sustained read-heavy service. |
| And more. |   |

## Get started with Milvus 3.0

Milvus 3.0 is available today under the Apache 2.0 license and remains an LF AI & Data project. To get started:

-   Read the [release notes](https://milvus.io/docs/release_notes.md) and the [quickstart](https://milvus.io/docs/quickstart.md), and get the source at [github.com/milvus-io/milvus](https://github.com/milvus-io/milvus).
-   Join the [Milvus Discord community](https://discord.com/invite/8uyFbECzPX) or book a [Milvus Office Hours](https://milvus.io/office-hours) session to talk through your use case with the maintainers.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png)

## Milvus 3.0 and Zilliz Vector Lakebase

Milvus 3.0 also serves as the core indexing and retrieval engine within [Zilliz Cloud](https://zilliz.com/), a Vector Lakebase platform for production AI, created by the same team behind Milvus. Zilliz Cloud extends the Milvus core with advanced enterprise capabilities, including on-demand compute, AI-powered and learn-based AutoIndex, proprietary Cardinal index engine, enterprise security, governance, and compliance to support a diverse set of workloads on a unified AI data foundation.

![](https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png)

Developers can deploy Milvus as an open-source vector database or use [Zilliz Cloud](https://zilliz.com/) for a managed platform across multiple workloads throughout the AI data lifecycle.

## What comes next

The Milvus roadmap builds on the 3.0 architecture with predicate pushdown for External Collections, external backfill, additional Spark operators, and support for more table formats, including Delta Lake and Apache Paimon.

The larger direction is clear: AI data systems need a tighter loop between online retrieval and offline data improvement. Vector data should not have to be copied into separate systems every time teams want to search, analyze, improve, or serve it.
