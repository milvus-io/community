---
id: milvus-3-0-external-collection.md
title: >
 Milvus External Collection: Index and Retrieve Lake-Resident Data Without Moving It
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: External Collection, Milvus 3.0, vector search on data lake, Iceberg vector search, Vector Lakebase
meta_title: >
 Milvus External Collection: Index and Retrieve Lake-Resident Data Without Moving It
desc: >
 Milvus 3.0 introduced External Collection, allowing Milvus to build indexes and serve retrieval over data that remains in the lake.
origin: https://milvus.io/blog/milvus-3-0-external-collection.md
---

In many AI pipelines, embeddings and metadata are already produced and stored in a data lake. A product pipeline might write product attributes and multimodal embeddings to Parquet files in S3. A retrieval or training corpus might live in an Iceberg or Lance table. The lake is already where these datasets are generated, updated, versioned, and used by the rest of the data stack.

Vector databases, however, have traditionally been built around a database-owned serving copy. If teams wanted low-latency vector search over data already sitting in a lake, they generally had two options:

-   **Copy the data into a vector database.** This provides ANN indexes and a production serving path, but creates a second copy of the dataset and an ETL pipeline that must stay synchronized with the source.
-   **Query the lake directly.** This avoids duplication, but without an ANN indexing and serving layer, vector search falls back to scans that are not designed for production latency.

**Milvus 3.0** [**External Collection**](https://milvus.io/docs/create-an-external-collection.md) **introduces a third path.** The source data remains in Parquet, Iceberg, Lance, Vortex, or another supported external format, while Milvus builds and serves indexes on it. You map the external fields into a Milvus schema, define the indexes you need, refresh the collection, and use the normal Milvus search and query APIs—without first copying the source rows into a Milvus-managed collection.

The architectural change is straightforward: the data can remain in the lake, while Milvus adds the indexing and retrieval layer.

That also makes External Collection an important step toward [**Vector Lakebase**](https://zilliz.com/blog/what-is-a-vector-lakebase)**,** a unified, lake-native data architecture for AI that combines vector-database-grade serving with open lake storage, reusable lake-level indexes, and a shared semantic layer. Online retrieval no longer has to start from a separate serving copy while Spark, training pipelines, evaluation jobs, and governance tools operate on another version of the data. They can work from the same lake-resident data foundation.

## What an External Collection is, and what it changes

**An External Collection** is a type of Milvus collection whose source data lives outside Milvus-managed storage.

Without an External Collection, putting that catalog behind production vector search normally means creating another copy in Milvus:

![](https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png)

Every time the catalog changes, the embedding model changes, or a field is backfilled, another pipeline has to move the updated data across that boundary.

With External Collection, the architecture becomes:

![](https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png)

Milvus does **not** make external files its own source data copy. Instead, the External Collection contains the information Milvus needs to interpret and search them:

1.  An `external_source` that identifies the external files or table.
2.  An `external_spec` that describes the source format and storage access.
3.  `external_field` mappings that connect fields in the Milvus schema to columns in the external dataset.
4.  The indexes, manifests, and serving state Milvus creates for retrieval.

**Zero-copy source data does not mean zero state inside Milvus.** Milvus still builds indexes. It still uses compute. It still caches data. The change is that the authoritative rows no longer have to be copied into Milvus simply because you need Milvus to search for them.

### Normal Milvus Collection vs. External Collection

| **Concern** | **Milvus-managed collection** | **External Collection** |
| --- | --- | --- |
| Source records | Stored and managed by Milvus | Remain in the external files or table |
| How data enters Milvus | Insert, upsert, import, or streaming write | External source mapping + Refresh |
| Online mutations | Supported | Read-only from Milvus |
| Freshness | Follows the Milvus write path and consistency model | Follows the last successfully published Refresh |
| Milvus-managed state | Source data, metadata, indexes, caches | Mappings, manifests, indexes, caches |
| Query path | Milvus search and query APIs | Milvus search and query APIs |
| Best fit | Continuously changing online data | Large, batch-produced, read-heavy lake data |

External Collection therefore complements normal Milvus collections rather than replacing them.

A system can keep rapidly changing online state in normal Milvus collections while using External Collections for large corpora, catalogs, historical datasets, model features, or other data already produced and governed in the lake.

## Why removing the second copy matters

It is tempting to describe External Collections as a storage optimization: don't copy several terabytes of data into another database, and you save storage. That is useful, but it is not the main architectural problem.

**The higher cost comes from keeping two data systems aligned.**

Consider the product catalog again. The data platform produces the authoritative Parquet dataset. Search imports it into a vector database. A recommendation team may read the same lake data through Spark for offline analysis. A new embedding model then generates a replacement vector column. Inventory and metadata keep changing simultaneously.

Once the online serving copy becomes independent from the lake, every change has to cross that boundary:

-   the data needs to be copied;
-   the transfer needs to be scheduled and monitored;
-   failed jobs need retries;
-   schemas and permissions may need to be represented in multiple systems;
-   freshness depends on how quickly the synchronization pipeline catches up;
-   teams have to know which copy represents the version they actually want.

Storage is only one line item.

| **Cost** | **Separate lake + serving copy** | **External Collection** |
| --- | --- | --- |
| **Source data copies** | Lake copy plus a separate serving copy | Source rows remain in the lake |
| **Data movement** | Persistent ETL/import pipeline | Refresh over the external source |
| **Freshness** | Depends on export/import cadence | Controlled by when a new Refresh is published |
| **Governance** | Source and serving copies must stay aligned | Source ownership, lineage, and versioning remain with the lake platform |
| **Offline reuse** | Other consumers may prepare their own copies | Existing lake tools can continue reading the same source |
| **Serving resources** | Sized around the database copy and query workload | Indexing, query compute, and caches can be managed separately from ownership of the source rows |

The difference becomes especially important as AI data changes more often.

Teams deduplicate corpora. They cluster data for analysis. They generate new embeddings when a model changes. They add labels, summaries, extracted entities, quality scores, or feedback signals. They run evaluation jobs and data-cleaning pipelines over the same corpus that production applications retrieve from.

If every system owns its own copy, every improvement becomes another synchronization job.

External Collection changes that boundary: **offline systems can continue working on the lake dataset, while Milvus serves retrieval on the same foundation.**

## What data sources External Collection supports

External Collection is designed around open, externally managed data rather than a Milvus-specific source layout. It supports multiple external source formats through [Storage V3](https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md):

| **External format** | **format value** | **What Milvus reads** |
| --- | --- | --- |
| Apache Parquet | parquet | A directory or object-storage prefix containing Parquet files and row groups |
| Vortex | vortex | Vortex files and their layout metadata |
| Lance | lance-table | A Lance dataset and its fragment metadata |
| Apache Iceberg | iceberg-table | Iceberg metadata plus a selected snapshot |
| Milvus snapshot | milvus-table | A supported Milvus snapshot exposed as an external source |

The mapping between the source and Milvus is explicit.

A source column named `product_id` can become the Milvus field `id`; `image_vec` can become `embedding`; and a wide source table does not need to expose every column to the collection. That means the data platform does not have to rename or rewrite its source just to satisfy the serving database.

Versioned formats add another useful property. With a source such as Iceberg, the collection can point at a particular snapshot rather than whatever happens to be current when the query runs. A fixed source version is useful for repeatable evaluation, regression testing, historical analysis, and audit workloads.

The underlying files also remain usable by the rest of the data stack. Spark, training frameworks, governance systems, and other lake-compatible tools can continue reading the same open data.

External Collection adds another consumer of that data; it does not turn Milvus into its sole owner.

### Accessing external storage securely

Milvus also needs permission to read the external storage.

Depending on the storage provider, deployments can use mechanisms such as workload or instance identity, AWS STS role assumption, service account impersonation, SAS-based access, or provider-specific role systems instead of embedding long-lived credentials in application configuration.

This storage identity controls how Milvus reaches the source. Authorization inside Milvus remains a separate security boundary.

## How to create, index, refresh, and query an external collection

The External Collection lifecycle has four main steps:

1.  Define the external source and map its columns into a Milvus schema.
2.  Define the indexes the workload needs.
3.  Run Refresh so Milvus discovers the source data and prepares a queryable version.
4.  Load the collection and use the normal Milvus search and query APIs.

Here is the same product catalog represented as an External Collection:

```python
import json
import time

from pymilvus import DataType, MilvusClient

client = MilvusClient(
    uri="http://localhost:19530",
    token="root:Milvus",
)

schema = client.create_schema(
    external_source="s3://my-lake/datasets/products/",
    external_spec=json.dumps(
        {
            "format": "parquet",
            "extfs": {
                "cloud_provider": "aws",
                "region": "us-east-1",
                "use_iam": "true",
                "iam_endpoint": "https://sts.us-east-1.amazonaws.com",
            },
        }
    ),
)

schema.add_field(
    field_name="id",
    datatype=DataType.INT64,
    external_field="product_id",
)
schema.add_field(
    field_name="embedding",
    datatype=DataType.FLOAT_VECTOR,
    dim=768,
    external_field="image_vec",
)
schema.add_field(
    field_name="title",
    datatype=DataType.VARCHAR,
    max_length=256,
    external_field="product_name",
)
schema.add_field(
    field_name="stock",
    datatype=DataType.INT64,
    external_field="stock",
)
schema.add_field(
    field_name="rating",
    datatype=DataType.FLOAT,
    external_field="rating",
)

client.create_collection(
    collection_name="products_ext",
    schema=schema,
)
```

Indexes use the normal Milvus interface:

```python
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="embedding",
    index_type="HNSW",
    metric_type="COSINE",
)
index_params.add_index(field_name="stock", index_type="AUTOINDEX")
index_params.add_index(field_name="rating", index_type="AUTOINDEX")

client.create_index(
    collection_name="products_ext",
    index_params=index_params,
)
```

Then refresh the external source:

```python
job_id = client.refresh_external_collection(
    collection_name="products_ext",
)

while True:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    if progress.state == "RefreshCompleted":
        break
    if progress.state == "RefreshFailed":
        raise RuntimeError(progress.reason)
    time.sleep(2)
```

Once the refreshed version is ready, load and search it like a normal Milvus collection:

```python
client.load_collection("products_ext")

results = client.search(
    collection_name="products_ext",
    data=[query_vec],
    anns_field="embedding",
    filter="stock > 0 and rating >= 4.0",
    limit=10,
    output_fields=["id", "title", "stock", "rating"],
)
```

The important difference is not the search call. It is where the lifecycle starts. A Milvus-managed collection starts with data being written or imported into Milvus. An External Collection starts with a reference to data that already exists elsewhere.

## How Refresh picks up changes in external data

External Collection is read-only from the Milvus side, but the underlying lake dataset does not have to stay frozen forever.

Suppose the product pipeline adds another batch, updates metadata, or writes embeddings from a new model. Milvus does not continuously follow every object that appears in the source path. Those changes become visible through **Refresh**.

Refresh reads the external metadata, resolves the source fragments, updates the manifests that connect them to the Milvus collection, and prepares the corresponding index state.

The key is that this work can be incremental.

Milvus identifies source fragments that have not changed and can reuse their existing segment and index work. New or changed fragments are the parts that require new processing.

A small change to a multi-terabyte dataset, therefore, does not have to trigger another full import and full index rebuild.

Refresh also gives the serving system a clear version boundary. While a new version is being prepared, queries continue to use the previously published state. Once Refresh completes, the new state becomes available as a complete version rather than exposing a mixture of old and partially prepared data.

![](https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png)

This model fits naturally with hourly catalog builds, nightly knowledge-base updates, periodic embedding refreshes, model-generated feature pipelines, and similar batch-oriented workloads.

It does **not** replace a streaming write path. If every insert or delete must become searchable through Milvus immediately, a managed collection remains the better model.

## How Lazy Loading reduces memory use for wide datasets

Keeping source rows in object storage only helps if the serving layer does not have to load every byte locally before it can answer queries. With Milvus Tiered Storage enabled, it does not.

At collection load time, QueryNodes can initially keep only lightweight metadata such as schema information, index definitions, chunk maps, and references to remote objects. Field data is fetched at the chunk level when a query needs it; indexes can remain remote until first use, then be cached locally. Frequently used data stays hot, while less frequently accessed data can be evicted.

![](https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png)

This is especially useful for wide AI datasets.

A product row might contain several embeddings, a long description, raw JSON, image metadata, generated summaries, inventory, pricing, ratings, and many other attributes. A typical similarity search may touch only one vector plus inventory, price, and rating. There is no reason every other field must permanently occupy serving memory just because it belongs to the same record.

External Collection can narrow the serving footprint at two levels:

-   **First, schema-level projection.** Through `external_field`, the External Collection can expose only the source columns the application needs. Other columns remain in the lake dataset and are not included in this serving schema.
-   **Second, runtime projection.** Under the tiered serving model, QueryNodes fetch and cache the fields and indexes actually needed by the workload rather than loading the entire mapped dataset up front.

In other words, **the dataset can stay wide in the lake without forcing the serving footprint to be equally wide.**

There is an obvious tradeoff. A query that hits a cold field or index may pay a remote-read cost on first access. Warm-up policies can preload latency-critical fields or indexes, while cache and eviction policies keep less frequently accessed state from occupying local resources indefinitely.

The point is not that object storage behaves like RAM. It is that memory and local disk can follow the working set of the retrieval workload, rather than the total size and width of the source dataset.

The source format also matters here. Formats designed for broad analytical scans and formats optimized for narrower or random reads can produce different I/O behavior under on-demand access. External Collection does not erase those storage-level trade-offs; it lets Milvus build a retrieval layer on top of them.

## What search and indexing capabilities External Collection supports

External Collection does not simply point Milvus at a directory of embeddings and scan through the files. Milvus builds retrieval structures on external data and executes queries through its standard retrieval engine.

### Milvus indexes built over external data

Depending on the fields and workload, Milvus can build:

-   vector indexes for ANN search;
-   scalar indexes for metadata filtering;
-   JSON indexes for semi-structured attributes;
-   BM25 and full-text indexes for lexical retrieval.
-   Function-generated fields supported by the Milvus data model.

ANN search uses those indexes to narrow the candidate set instead of reading every source vector.

That distinction matters because storing an embedding in a lake is not the same as operating a vector database over it. Persistence gives you bytes. Production retrieval also needs indexes, query planning, filtering, ranking, caching, and a low-latency serving path.

### Beyond vector top-K

Another common mistake is to read “External Collection” as “vector search over Parquet.” That undersells what production retrieval actually requires.

A production search result rarely depends on vector similarity alone. It may also depend on exact terms, access policy, inventory, timestamp, category, price, source quality, or business ranking signals.

Consider a query such as:

| red floral dress for summer, in stock, highest-rated first |
| --- |

A production retrieval path may need several signals:

-   **Vector similarity** for the semantic meaning of “summer floral dress.”
-   **Lexical or full-text search** for an exact term such as “red.”
-   **Scalar filters** to remove products that are out of stock or below a rating threshold.
-   **Hybrid retrieval and ranking** to combine multiple retrieval signals.

Milvus 3.0 also expands the query engine beyond initial nearest-neighbor retrieval with capabilities such as **server-side ordering, aggregation, and faceting.**

![](https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png)

The broader point is that External Collection gives lake-resident data a database retrieval path—not merely a way to read vectors from files.

## How the same lake data supports online serving and offline processing

The strongest architectural reason to keep the source in an open lake format is not simply that a second copy costs money. It is that the same dataset can remain available to the systems that continuously improve it.

Go back to the product catalog.

During the day, Milvus can serve an External Collection for product search, recommendations, or agent retrieval.

At the same time, other systems can work directly on the lake dataset:

-   Spark can identify duplicate products.
-   A training pipeline can generate embeddings from a new model.
-   A data-quality job can detect malformed or anomalous records.
-   An evaluation pipeline can compare retrieval quality between model versions.
-   A batch process can generate summaries, labels, or additional metadata.

External Collection does **not** run those jobs itself. Spark remains Spark; training remains training. Its role is to remove the extra serving-data boundary between them.

![](https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png)

Offline work can write improved data or new fields back to the lake. A subsequent Refresh makes the updated source available to the Milvus retrieval path.

There is no separate export-and-import loop whose only purpose is to reconstruct another authoritative copy for serving.

Governance remains divided cleanly as well. Source versions, lineage, and source ownership stay with the lake platform. Milvus maintains its own collection-level authorization and the credentials required to read the source. Sharing a single data foundation does not mean collapsing every security domain into a single system.

This is the connection to [**Vector Lakebase**](https://zilliz.com/blog/what-is-a-vector-lakebase): the lake remains the shared data foundation, while Milvus provides a low-latency retrieval layer on top of it. External Collection is one part of that architecture, alongside Storage V3, Snapshots, Spark integration, schema evolution, and backfill.

## Where External Collection fits—and where it does not

**External Collection is a strong fit when:**

-   Your authoritative data already lives in Parquet, Vortex, Lance, Iceberg, or another supported external source.
-   The dataset is primarily produced in batches rather than through high-frequency transactional writes.
-   Maintaining a second serving copy creates significant ETL, freshness, or governance overhead.
-   Multiple systems need to work with the same open dataset.
-   An explicit Refresh boundary is acceptable for serving freshness.
-   You want production Milvus retrieval without making Milvus the owner of the source rows.

**A normal Milvus collection is still the better choice when:**

-   the application continuously inserts or upserts records;
-   deletes need to become visible through the online write path;
-   the workload depends on collection features unavailable to external schemas;
-   The serving design intentionally keeps all required data in memory, avoiding remote cache misses.

**Several boundaries are worth keeping in mind.**

-   **External Collections are read-only.** Source changes happen outside Milvus.
-   **Zero-copy applies to source rows.** Indexes, manifests, caches, and compute still cost resources.
-   **Refresh is explicit.** It is not a streaming synchronization mechanism.
-   **The source must remain reachable.** Search, index, and refresh behavior still depends on storage access and credentials.
-   **Storage V3 is required.** In open-source Milvus 3.0, it must be enabled before using External Collection.
-   **External Collection does not replace upstream processing.** Embedding generation, clustering, deduplication, and data cleaning still happen in the appropriate upstream systems.

The choice is therefore complementary rather than binary. A system can use normal Milvus collections for rapidly changing online state and External Collections for large, batch-produced datasets whose natural home is the lake.

## Try External Collection in Milvus 3.0

External Collection is available in Milvus 3.0. Start with a representative lake dataset and evaluate the aspects that matter for your workload: initial and incremental refresh, index-build cost, warm- and cold-query behavior, and the freshness interval your application requires.

For implementation details, see:

-   [Create an External Collection](https://milvus.io/docs/create-an-external-collection.md)
-   [Milvus 3.0 release notes](https://milvus.io/docs/release_notes.md)
-   [Milvus 3.0 launch blog](https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md)

If you prefer a managed path, External Collection is also available as part of **Zilliz Vector Lakebase** in Zilliz Cloud. See:

-   [External Collection in Zilliz Cloud](https://docs.zilliz.com/docs/external-collection)
-   [From Vector Database to Vector Lakebase](https://zilliz.com/blog/from-vector-database-to-vector-lakebase)
-   [Why We Built Vector Lakebase: Rethinking Unstructured Data Architecture for AI](https://zilliz.com/blog/why-we-built-vector-lakebase)

You can also bring implementation questions or feedback to the [Milvus GitHub repository](https://github.com/milvus-io/milvus) or the [Milvus Discord community](https://discord.com/invite/8uyFbECzPX).