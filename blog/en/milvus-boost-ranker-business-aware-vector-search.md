---
id: milvus-boost-ranker-business-aware-vector-search.md
title: >
 How to Use Milvus Boost Ranker for Business-Aware Vector Search
author: Wei Zang
date: 2026-3-24
cover: assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: Milvus, vector database, vector search
meta_keywords: Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6
meta_title: >
 Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >
 Learn how Milvus Boost Ranker lets you layer business rules on top of vector similarity — boost official docs, demote stale content, add diversity.
origin: https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md
---

Vector search ranks results by embedding similarity — the closer the vectors, the higher the result. Some systems add a model-based reranker (BGE, Voyage, Cohere) to improve ordering. But neither approach handles a fundamental requirement in production: **business context matters as much as semantic relevance, sometimes more.**

An e-commerce site needs to surface in-stock products from official stores first. A content platform wants to pin recent announcements. An enterprise knowledge base needs authoritative documents at the top. When ranking relies solely on vector distance, these rules get ignored. The results may be relevant, but they're not appropriate.

**[Boost Ranker](https://milvus.io/docs/reranking.md)**, introduced in [Milvus](https://milvus.io/intro) 2.6, solves this. It lets you adjust search result rankings using metadata rules — no index rebuild, no model change. This article covers how it works, when to use it, and how to implement it with code.

## What Is Boost Ranker?

**Boost Ranker is a lightweight, rule-based reranking feature in Milvus 2.6.2** that adjusts [vector search](https://zilliz.com/learn/vector-similarity-search) results using scalar metadata fields. Unlike model-based rerankers that call external LLMs or embedding services, Boost Ranker operates entirely within Milvus using simple filter-and-weight rules. No external dependencies, minimal latency overhead — suitable for real-time use.

You configure it through the [Function API](https://milvus.io/docs/manage-functions.md). After vector search returns a set of candidates, Boost Ranker applies three operations:

1. **Filter:** identify results matching specific conditions (e.g., `is_official == true`)
2. **Boost:** multiply their scores by a configured weight
3. **Shuffle:** optionally add a small random factor (0–1) to introduce diversity

### How It Works Under the Hood

Boost Ranker runs inside Milvus as a post-processing step:

1. **Vector search** — each segment returns candidates with IDs, similarity scores, and metadata.
2. **Apply rules** — the system filters matching records and adjusts their scores using the configured weight and optional `random_score`.
3. **Merge and sort** — all candidates are combined and re-sorted by updated scores to produce the final Top-K results.

Because Boost Ranker only operates on already-retrieved candidates — not the full dataset — the additional computational cost is negligible.

## When Should You Use Boost Ranker?

### Boosting Important Results

The most common use case: layer simple business rules on top of semantic search.

- **E-commerce:** boost products from flagship stores, official sellers, or paid promotions. Push items with high recent sales or click-through rates higher.
- **Content platforms:** prioritize recently published content via a `publish_time` field, or boost posts from verified accounts.
- **Enterprise search:** give higher priority to documents where `doctype == "policy"` or `is_canonical == true`.

All configurable with a filter + weight. No embedding model changes, no index rebuilds.

### Demoting Without Removing

Boost Ranker can also lower ranking for certain results — a softer alternative to hard filtering.

- **Low-stock products:** if `stock < 10`, reduce their weight slightly. Still findable, but won't dominate top positions.
- **Sensitive content:** lower the weight of flagged content instead of removing it entirely. Limits exposure without hard censorship.
- **Stale documents:** documents where `year < 2020` get ranked lower so newer content surfaces first.

Users can still find demoted results by scrolling or searching more precisely, but they won't crowd out more relevant content.

### Adding Diversity with Controlled Randomness

When many results have similar scores, the Top-K can look identical across queries. Boost Ranker's `random_score` parameter introduces slight variation:

```json
"random_score": {
  "seed": 126,
  "field": "id"
}
```

- `seed`: controls overall randomness for reproducibility
- `field`: usually the primary key `id`, ensures the same record gets the same random value each time

This is useful for **diversifying recommendations** (preventing the same items from always appearing first) and **exploration** (combining fixed business weights with small random perturbations).

### Combining Boost Ranker with Other Rankers

Boost Ranker is set via the Function API with `params.reranker = "boost"`. Two things to know about combining it:

- **Limitation:** in hybrid (multi-vector) search, Boost Ranker cannot be the top-level ranker. But it can be used inside each individual `AnnSearchRequest` to adjust results before they're merged.
- **Common combinations:**
  - **RRF + Boost:** use RRF to merge multi-modal results, then apply Boost for metadata-based fine-tuning.
  - **Model ranker + Boost:** use a model-based ranker for semantic quality, then Boost for business rules.

## How to Configure Boost Ranker

Boost Ranker is configured through the Function API. For more complex logic, combine it with `FunctionScore` to apply multiple rules together.

### Required Fields

When creating a `Function` object:

- `name`: any custom name
- `input_field_names`: must be an empty list `[]`
- `function_type`: set to `FunctionType.RERANK`
- `params.reranker`: must be `"boost"`

### Key Parameters

**`params.weight` (required)**

The multiplier applied to matching records' scores. How you set it depends on the metric:

| Metric Type | To Boost Results | To Demote Results |
|-------------|-----------------|-------------------|
| Higher-is-better (COSINE, IP) | `weight > 1` | `weight < 1` |
| Lower-is-better (L2/Euclidean) | `weight < 1` | `weight > 1` |

**`params.filter` (optional)**

A condition that selects which records get their scores adjusted:

- `"doctype == 'abstract'"`
- `"is_premium == true"`
- `"views > 1000 and category == 'tech'"`

Only matching records are affected. Everything else keeps its original score.

**`params.random_score` (optional)**

Adds a random value between 0 and 1 for diversity. See the randomness section above for details.

### Single vs. Multiple Rules

**Single rule** — when you have one business constraint (e.g., boost official docs), pass the ranker directly to `search(..., ranker=ranker)`.

**Multiple rules** — when you need several constraints (prioritize in-stock items + demote low-rated products + add randomness), create multiple `Function` objects and combine them with `FunctionScore`. You configure:

- `boost_mode`: how each rule combines with the original score (`multiply` or `add`)
- `function_mode`: how multiple rules combine with each other (`multiply` or `add`)

## Hands-On: Prioritizing Official Documents

Let's walk through a concrete example: making official documents rank higher in a document search system.

### Schema

A collection called `milvus_collection` with these fields:

| Field | Type | Purpose |
|-------|------|---------|
| `id` | INT64 | Primary key |
| `content` | VARCHAR | Document text |
| `embedding` | FLOAT_VECTOR (3072) | Semantic vector |
| `source` | VARCHAR | Origin: "official", "community", or "ticket" |
| `is_official` | BOOL | `True` if `source == "official"` |

The `source` and `is_official` fields are the metadata Boost Ranker will use to adjust rankings.

### Setup Code

```python
from pymilvus import (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

# 1. Connect to Milvus
client = MilvusClient(uri="http://localhost:19530")
collection_name = "milvus_collection"

# If it already exists, drop it first for repeated testing
if collection_name in client.list_collections():
    client.drop_collection(collection_name)

# 2. Define schema
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=False,
)

schema.add_field(
    field_name="id",
    datatype=DataType.INT64,
    is_primary=True,
)
schema.add_field(
    field_name="content",
    datatype=DataType.VARCHAR,
    max_length=512,
)
schema.add_field(
    field_name="source",
    datatype=DataType.VARCHAR,
    max_length=32,
)
schema.add_field(
    field_name="is_official",
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name="embedding",
    datatype=DataType.FLOAT_VECTOR,
    dim=3072,
)

text_embedding_function = Function(
    name="openai_embedding",
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=["content"],
    output_field_names=["embedding"],
    params={
        "provider": "openai",
        "model_name": "text-embedding-3-large"
    }
)

schema.add_function(text_embedding_function)

# 3. Create Collection
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

# 4. Create index
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="embedding",
    index_type="IVF_FLAT",
    metric_type="COSINE",
    params={"nlist": 16},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

# 5. Load Collection into memory
client.load_collection(collection_name=collection_name)

docs = [
    {
        "id": 1,
        "content": "How to deploy Milvus on Kubernetes (Official Guide)",
        "source": "official",
        "is_official": True
    },
    {
        "id": 2,
        "content": "Quick deployment of Milvus with Docker Compose (Official Tutorial)",
        "source": "official",
        "is_official": True
    },
    {
        "id": 3,
        "content": "Community experience: Lessons learned from deploying Milvus",
        "source": "community",
        "is_official": False
    },
    {
        "id": 4,
        "content": "Ticket record: Milvus deployment issue",
        "source": "ticket",
        "is_official": False
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
```

### Comparing Results: With and Without Boost Ranker

First, run a baseline search without Boost Ranker. Then add Boost Ranker with `filter: is_official == true` and `weight: 1.2`, and compare.

```python
# 6. Baseline search (without Boost Ranker)
query_vector = "how to deploy milvus"

search_params = {
    "metric_type": "COSINE",
    "params": {"nprobe": 2},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="embedding",
    search_params=search_params,
    limit=4,
    output_fields=["content", "source", "is_official"],
)

print("=== Baseline search (no Boost Ranker) ===")
for hit in results[0]:
    entity = hit["entity"]
    print(
        f"id={hit['id']}, "
        f"score={hit['distance']:.4f}, "
        f"source={entity['source']}, "
        f"is_official={entity['is_official']}"
    )

# 7. Define Boost Ranker: apply weight to documents where is_official == true
boost_official_ranker = Function(
    name="boost_official",
    input_field_names=[],               # Boost Ranker requires this to be an empty list
    function_type=FunctionType.RERANK,
    params={
        "reranker": "boost",            # Specify Boost Ranker
        "filter": "is_official==true",
        # For COSINE / IP (higher score is better), use weight > 1 to boost
        "weight": 1.2
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="embedding",
    search_params=search_params,
    limit=4,
    output_fields=["content", "source", "is_official"],
    ranker=boost_official_ranker,
)

print("\n=== Search with Boost Ranker (official boosted) ===")
for hit in boosted_results[0]:
    entity = hit["entity"]
    print(
        f"id={hit['id']}, "
        f"score={hit['distance']:.4f}, "
        f"source={entity['source']}, "
        f"is_official={entity['is_official']}"
    )
```

### Results

```
=== Baseline search (no Boost Ranker) ===
id=1, score=0.7351, source=official, is_official=True
id=4, score=0.7017, source=ticket, is_official=False
id=3, score=0.6706, source=community, is_official=False
id=2, score=0.6435, source=official, is_official=True

=== Search with Boost Ranker (official boosted) ===
id=1, score=0.8821, source=official, is_official=True
id=2, score=0.7722, source=official, is_official=True
id=4, score=0.7017, source=ticket, is_official=False
id=3, score=0.6706, source=community, is_official=False
```

The key change: document `id=2` (official) jumped from 4th to 2nd place because its score was multiplied by 1.2. Community posts and ticket records aren't removed — they just rank lower. That's the point of Boost Ranker: keep semantic search as the foundation, then layer business rules on top.

## Conclusion

[Boost Ranker](https://milvus.io/docs/reranking.md) gives you a way to inject business logic into vector search results without touching your embeddings or rebuilding indexes. Boost official content, demote stale results, add controlled diversity — all through simple filter + weight configuration in the [Milvus Function API](https://milvus.io/docs/manage-functions.md).

Whether you're building RAG pipelines, recommendation systems, or enterprise search, Boost Ranker helps bridge the gap between what's semantically similar and what's actually useful to your users.

If you're working on search ranking and want to discuss your use case:

- Join the [Milvus Slack community](https://slack.milvus.io/) to connect with other developers building search and retrieval systems.
- [Book a free 20-minute Milvus Office Hours session](https://milvus.io/office-hours) to walk through your ranking logic with the team.
- If you'd rather skip infrastructure setup, [Zilliz Cloud](https://cloud.zilliz.com/signup) (managed Milvus) has a free tier to get started.

---

A few questions that come up when teams start using Boost Ranker:

**Can Boost Ranker replace a model-based reranker like Cohere or BGE?**
They solve different problems. Model-based rerankers re-score results by semantic quality — they're good at deciding "which document actually answers the question." Boost Ranker adjusts scores by business rules — it decides "which relevant document should appear first." In practice, you often want both: a model ranker for semantic relevance, then Boost Ranker for business logic on top.

**Does Boost Ranker add significant latency?**
No. It operates on the already-retrieved candidate set (typically the Top-K from vector search), not the full dataset. The operations are simple filter-and-multiply, so the overhead is negligible compared to the vector search itself.

**How do I set the weight value?**
Start with small adjustments. For COSINE similarity (higher is better), a weight of 1.1–1.3 is usually enough to noticeably shift rankings without overriding semantic relevance entirely. Test with your actual data — if boosted results with low similarity start dominating, lower the weight.

**Can I combine multiple Boost Ranker rules?**
Yes. Create multiple `Function` objects and combine them using `FunctionScore`. You control how rules interact through `boost_mode` (how each rule combines with the original score) and `function_mode` (how rules combine with each other) — both support `multiply` and `add`.