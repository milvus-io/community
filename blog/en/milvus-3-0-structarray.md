---
id: milvus-3-0-structarray.md
title: >
 One Entity, Many Vectors: Entity- and Element-Level Search with Milvus 3.0 StructArray
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Milvus 3.0, StructArray, multi-vector search, EmbeddingList search, element-level search
meta_title: >
 Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >
 One entity can contain multiple aligned vectors and metadata fields, and Milvus can search either the entire entity or an individual element without flattening the data into separate rows.
origin: https://milvus.io/blog/milvus-3-0-structarray.md
---


Most vector database schemas start with a simple assumption: one entity, one embedding. A product gets one vector, as does a document. A user query is embedded and compared with those vectors through approximate nearest neighbor (ANN) search. This model works for the first generation of vector search use cases, including RAG, semantic search, and recommendation systems.

**Real-world AI data, however, rarely fits that assumption.** A video contains clips, shots, or keyframes, each with its own embedding, time range, caption, scene label, and confidence score. A product may have several images and viewing angles. A long document contains passages or sections whose local meaning matters more than a single embedding of the whole document. Popular late-interaction models expose the same limitation at an even finer granularity: ColBERT produces one vector per token, while ColPali produces one vector per visual patch.

In each case, the parent entity remains the unit that the application stores, displays, secures, and returns. Yet relevance, filtering, and result explanation often depend on elements inside that entity.

**The new StructArray feature gives Milvus a native data model for this shape: one entity contains an ordered array of schema-defined Struct elements, and each element can carry scalar metadata, vector embeddings, or both.** Milvus can filter fields that belong to the same element, compare two embedding lists at the entity level, or search individual elements and return the matching offset.

This article uses a video-search example to explain the data model, then traces it through schema design, filtering, vector-search granularities, EmbeddingList index strategies, hybrid result collapse, and the physical layout that makes the feature executable.

## Why one vector and one flat row model are no longer enough

Consider a user searching a video catalog for "a person cutting vegetables in a kitchen." The relevant signal may live in one eight-second clip, not in an embedding of the entire video. **Compressing every clip, object, and action into a single vector may preserve the broad topic, but it can wash out local details.**

The same mismatch appears in other workloads:

-   A product's relevance may come from one of several images or angles.
-   A document may match because of one passage rather than its overall subject.
-   An agent memory may contain several observations, only one of which matters to the current task.
-   A ColBERT or ColPali record contains a variable-length list of token or patch vectors rather than one dense vector.

One alternative is to split every clip, image, or passage into a separate database row. That enables local search, but it also separates each fragment from its parent entity. Parent metadata may be repeated across rows, and entity-level retrieval then requires grouping, deduplication, and reranking after the fragment search.

Nested storage alone does not solve the query problem. JSON can store objects, but it does not give Milvus a predefined subfield schema for vector and scalar indexing. Parallel arrays can store captions, scene labels, and confidence values, but the application must maintain offset alignment. The database cannot safely infer that `scene_type[3]` and `label_confidence[3]` describe the same clip unless that relationship is part of the data model.

StructArray encodes that relationship directly. It keeps local elements inside the parent entity while exposing their aligned subfields to schema validation, indexing, filtering, and vector search.

## What is StructArray and its data model?

A StructArray, also known as an array of structs, stores an ordered set of Struct elements in each entity. A StructArray field is an `Array` whose elements all follow one predefined `Struct` schema. For a video collection, the logical shape could look like this:

```
Plaintext
clips: ARRAY<STRUCT<
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
>>
```

Here:

-   `clips` is the parent StructArray field.
-   `clip_embedding_list`, `clip_embedding`, `start_sec`, and the other attributes are subfields.
-   `clips[0]` is the first clip.
-   Every subfield at offset `0` belongs to that same clip.
-   Every subfield at offset `3` belongs to another clip.

The two vector subfields serve different search modes. `clips[clip_embedding_list]` is indexed with a `MAX_SIM*` metric for entity-level EmbeddingList search, while `clips[clip_embedding]` is indexed with a regular vector metric for element-level search. Because a vector field or vector subfield accepts only one index, a collection that needs both modes must define and index the two subfields separately.

This model supports three distinct query semantics.

### 1. EmbeddingList search returns parent entities

The vectors in `clips[clip_embedding_list]` form one embedding list for the video. The query is also an `EmbeddingList`. Milvus compares the query list with each stored list using a `MAX_SIM*` metric and returns an entity-level result.

```
Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
```

### 2. The `MATCH_*` family filters parent entities

`MATCH_ANY`, `MATCH_ALL`, `MATCH_LEAST`, `MATCH_MOST`, and `MATCH_EXACT` evaluate a predicate against Struct elements, count how many elements satisfy it, and decide whether the parent entity passes the filter.

For example:

```
Plaintext
MATCH_ANY(clips, $[scene_type] == "kitchen" && $[label_confidence] > 0.8)
```

Both scalar conditions must be true at the same clip offset. Milvus does not combine a kitchen label from one clip with a high-confidence value from another.

### 3. Element-level search returns the matching element offset

A regular query vector can search every vector in `clips[clip_embedding]` independently. Each hit identifies the parent entity and the zero-based offset of the matching Struct element. An `element_filter` can restrict which elements participate in that vector search.

These operations share one premise: Milvus knows which vector and scalar values belong to the same element, and which elements belong to the same entity.

StructArray is not a general-purpose arbitrary nesting system. Its current model is one `Array` of `Struct` elements with supported scalar and vector subfields. That boundary makes subfield indexing and element-aware execution tractable.

## Build the schema, indexes, and insert path

The following simplified PyMilvus example creates a video collection with one top-level vector and a StructArray for clips. It uses separate clip vector subfields so the same collection can demonstrate both search modes.

```python
from pymilvus import DataType, MilvusClient

client = MilvusClient(uri="http://localhost:19530")

schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
schema.add_field("id", DataType.INT64, is_primary=True)
schema.add_field("title", DataType.VARCHAR, max_length=512)
schema.add_field("video_embedding", DataType.FLOAT_VECTOR, dim=768)

# Define the Struct schema explicitly.
clip_schema = client.create_struct_field_schema()
clip_schema.add_field("clip_embedding_list", DataType.FLOAT_VECTOR, dim=768)
clip_schema.add_field("clip_embedding", DataType.FLOAT_VECTOR, dim=768)
clip_schema.add_field("start_sec", DataType.DOUBLE)
clip_schema.add_field("end_sec", DataType.DOUBLE)
clip_schema.add_field("caption", DataType.VARCHAR, max_length=2048)
clip_schema.add_field("scene_type", DataType.VARCHAR, max_length=128)
clip_schema.add_field("label_confidence", DataType.FLOAT)

schema.add_field(
    "clips",
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=1024,
)

client.create_collection("videos", schema=schema)
```

Vector subfields must be indexed before search. Because the metric family determines the search mode, each vector subfield gets its own index:

```python
index_params = client.prepare_index_params()

# EmbeddingList search.
index_params.add_index(
    field_name="clips[clip_embedding_list]",
    index_type="HNSW",
    metric_type="MAX_SIM_COSINE",
    index_name="clips_clip_embedding_list_maxsim_idx",
    params={"M": 16, "efConstruction": 200},
)

# Element-level search.
index_params.add_index(
    field_name="clips[clip_embedding]",
    index_type="HNSW",
    metric_type="COSINE",
    index_name="clips_clip_embedding_cosine_idx",
    params={"M": 16, "efConstruction": 200},
)

client.create_index("videos", index_params=index_params)
```

Scalar indexes are optional, but subfields that appear frequently in large-scale filters should use a compatible scalar index. For example, `clips[scene_type]` can use an inverted index, while a numeric subfield such as `clips[label_confidence]` can use an index suited to numeric filtering.

Insert data in its natural entity shape: one video row with an array of clip objects. To keep the example compact, it writes the same clip vector to both vector subfields.

```python
rows = [
    {
        "id": 1,
        "title": "cooking tutorial",
        "video_embedding": video_vec,
        "clips": [
            {
                "clip_embedding_list": clip_vec_1,
                "clip_embedding": clip_vec_1,
                "start_sec": 0.0,
                "end_sec": 8.0,
                "caption": "A person washes vegetables.",
                "scene_type": "kitchen",
                "label_confidence": 0.92,
            },
            {
                "clip_embedding_list": clip_vec_2,
                "clip_embedding": clip_vec_2,
                "start_sec": 8.0,
                "end_sec": 16.0,
                "caption": "A person cuts carrots on a board.",
                "scene_type": "kitchen",
                "label_confidence": 0.96,
            },
        ],
    }
]

client.insert("videos", rows)
client.flush("videos")
client.load_collection("videos")
```

At the API boundary, `clips` remains an array of structured objects. Inside Milvus, each subfield follows the typed path required for its own index, filter, and output behavior. That distinction is transparent at insert time but fundamental to everything that follows.

## Same-element filtering is the difference between structure and parallel arrays

The main benefit of filtering is not shorter syntax for nested fields. It is correct correlation across scalar subfields.

Suppose the application needs videos containing a kitchen clip with label confidence above `0.8`. It is not enough for a video to contain some kitchen clip and some high-confidence clip; the same clip must satisfy both conditions.

The StructArray `MATCH_*` family expresses this directly:

```
Plaintext
MATCH_ANY(clips, $[scene_type] == "kitchen" && $[label_confidence] > 0.8)
MATCH_ALL(clips, $[label_confidence] > 0.5)
MATCH_LEAST(clips, $[scene_type] == "sports", threshold=3)
MATCH_MOST(clips, $[label_confidence] < 0.2, threshold=1)
MATCH_EXACT(clips, $[scene_type] == "intro", threshold=1)
```

Milvus evaluates the predicate at each element offset, then applies the operator's quantifier to decide whether the parent entity passes:

-   `MATCH_ANY`: At least one element matches.
-   `MATCH_ALL`: Every element matches.
-   `MATCH_LEAST`: At least `threshold` elements match.
-   `MATCH_MOST`: At most `threshold` elements match.
-   `MATCH_EXACT`: Exactly `threshold` elements match.

If the same data were stored as two independent arrays, the following expression would not preserve that correlation:

```
Plaintext
array_contains(clips[scene_type], "kitchen")
AND
array_contains(clips[label_confidence], 0.9)
```

The two values could occur at different offsets. That may be valid for unrelated attributes, but it is incorrect when both conditions describe the same clip, product image, or document passage.

StructArray makes element identity part of the database predicate rather than a convention the application must enforce.

## Two vector-search granularities, two result identities

Once an entity stores multiple vectors, retrieval must settle a modeling question before ANN search begins:

**Should the vectors be scored together as one representation of the parent entity, or should each element vector compete independently?**

StructArray supports both models, but they use different query shapes, metric families, vector subfields, and result identities.

### EmbeddingList search: a list of query vectors finds an entity

An `EmbeddingList` query contains multiple vectors. A query video might be divided into several clips; a product query might contain several reference images; a ColBERT query contains one vector per query token.

For each entity, Milvus compares the query list with the entity's stored embedding list. Under MaxSim-style scoring, each query vector selects its best match in the entity list, and Milvus aggregates those best-match scores into an entity score. The final hit represents the parent entity, not one particular Struct element.

```python
from pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.add(query_clip_vec_1)
query.add(query_clip_vec_2)

client.search(
    collection_name="videos",
    data=[query],
    anns_field="clips[clip_embedding_list]",
    search_params={"metric_type": "MAX_SIM_COSINE"},
    limit=10,
)
```

This search answers: **Which videos are the best overall match for this set of query clips?**

It fits video-to-video retrieval, multi-image product search, ColBERT- and ColPali-style retrieval, and other cases where both the query and the stored entity are represented by multiple vectors.

### Element-level search: one query vector finds a clip inside an entity

Element-level search uses a regular query vector. Every vector in `clips[clip_embedding]` participates in ANN search as an independent candidate. Each hit identifies the parent entity and the offset of the matching element.

```python
client.search(
    collection_name="videos",
    data=[query_vec],
    anns_field="clips[clip_embedding]",
    search_params={"metric_type": "COSINE"},
    limit=10,
    output_fields=["id", "title", "clips"],
)
```

To search only selected clips, attach an `element_filter` whose scalar conditions apply to the same clip:

```python
client.search(
    collection_name="videos",
    data=[query_vec],
    anns_field="clips[clip_embedding]",
    search_params={"metric_type": "COSINE"},
    filter='element_filter(clips, $[scene_type] == "kitchen" && $[label_confidence] > 0.8)',
    limit=10,
    output_fields=["id", "title", "clips"],
)
```

The filter does not first select a kitchen clip and then search a different high-confidence clip. Both predicates and the vector candidate refer to the same Struct element.

An ungrouped response may look like this:

```
Plaintext
id = 1, offset = 1, distance = 0.91
id = 8, offset = 4, distance = 0.88
id = 1, offset = 3, distance = 0.84
```

The same entity may appear more than once because several clips can match. That is useful when the application needs to show not only which video or document is relevant, but also which clip or passage produced the match.

| Aspect | EmbeddingList search | Element-level search |
| --- | --- | --- |
| Query input | One or more query vectors in an `EmbeddingList` | One regular query vector |
| Example target | `clips[clip_embedding_list]` | `clips[clip_embedding]` |
| Metric family | `MAX_SIM*` | Regular metrics such as `COSINE`, `IP`, or `L2` |
| ANN candidate unit | The parent entity's embedding list | Each Struct element vector |
| Result identity | Parent entity | Parent entity plus element offset |
| Typical use case | Match a multi-vector query against a multi-vector entity | Find the most relevant clip, image, passage, patch, or fact |

To support both modes in one collection, define and index separate vector subfields. The query shape, metric family, and target index must agree.

## EmbeddingList indexing is a quality-cost decision

With one embedding per entity, an ANN index finds entities near a query vector. EmbeddingList search is more expensive because relevance depends on pairwise interactions between two lists of vectors.

Computing exact MaxSim against every vector in every entity produces the cleanest reference ranking, but a full scan is usually too expensive for online retrieval. Milvus therefore uses a two-stage model:

1.  An approximate strategy retrieves candidate parent entities.
2.  When `emb_list_rerank` is enabled, Milvus recomputes MaxSim over those candidates to produce the final ranking.

Retrieving more first-stage candidates generally improves the chance that the true top results reach the reranker, but it also increases latency and compute. The three strategies differ mainly in how they produce that candidate set.

| Strategy | First-stage candidate representation | Good starting point when | Main tradeoff |
| --- | --- | --- | --- |
| TokenANN | Index every vector in each embedding list. Query vectors run ANN independently; matches are aggregated back to parent entities before MaxSim reranking. | Quality is the priority, lists are short or medium, and individual vectors are discriminative. | Index size and first-stage search work grow with list length and the number of query vectors. |
| MUVERA | Encode each embedding list into one fixed-dimensional vector through random projections, then run ordinary ANN. | TokenANN is too heavy and compression without a training pipeline is preferred. | The encoding loses information; stronger projection settings increase encoded dimensionality and ANN cost. |
| LEMUR | Train a model that maps an embedding list to a fixed-dimensional parent-entity vector. | Embeddings are less discriminative, lists are large, or the workload is visual or multimodal. | It requires training and can be sensitive to corpus distribution and document-length bias. |

No single strategy is best for every workload. Start with the target data and query distribution:

-   Use TokenANN as a quality-first baseline when the dataset size permits it.
-   Try MUVERA when TokenANN's index or candidate retrieval becomes too expensive as list length grows, and you want to avoid a training pipeline.
-   Evaluate LEMUR when the embedding space is noisy or weakly discriminative, or when the workload is visual or multimodal.
-   Measure recall or nDCG alongside latency and index size. A strategy that works for short text can behave differently with long-tail document lengths or thousands of visual patches.

StructArray addresses one problem: how to represent aligned, filterable, vector-bearing elements inside a single entity. The EmbeddingList strategy addresses another: how to approximate MaxSim at an acceptable cost for a particular model and corpus.

## Hybrid search makes result identity explicit

Production retrieval rarely follows a single vector path. A video request may combine a top-level video embedding, one or more clip-level embeddings, a caption or transcript signal, and a reranker.

Once element-level candidates enter that pipeline, the engine must decide what identifies a final candidate.

| Hybrid request composition | Final candidate scope | Result identity |
| --- | --- | --- |
| All sub-searches are element-level and target vector subfields under the same StructArray | Element level | Primary key plus StructArray field plus element offset |
| A top-level vector field is included | Entity level | Primary key |
| An EmbeddingList request is included | Entity level | Primary key |
| Element-level requests target different StructArray fields | Entity level | Primary key |

The first configuration preserves element identity because offset `3` refers to the same Struct element for every sub-search under a given parent StructArray. This fits an application that wants to return the most relevant clip or passage after fusing several element-level signals.

The other configurations mix candidate granularities or element namespaces. An element hit must therefore be collapsed into an entity-level score before final reranking. Milvus supports several collapse strategies:

| Collapse strategy | Entity score from the returned element hits | Important condition |
| --- | --- | --- |
| `max` | Best element score | Works with supported regular vector metrics |
| `sum` | Sum of all returned element scores | Use with positive-correlation metrics such as `IP` or `COSINE` |
| `avg` | Average of returned element scores | Works with supported regular vector metrics |
| `topk_sum` | Sum of the best `K` returned element scores | Requires a positive `topk`; use with `IP` or `COSINE` |
| `topk_avg` | Average of the best `K` returned element scores | Requires a positive `topk` |

Collapse operates only on the element hits returned by that ANN sub-search; it does not scan every element in the entity after retrieval. The request `limit` therefore controls which element hits are available to the collapse function.

This choice shapes retrieval semantics, not merely output formatting. If the application presents a clip or passage, preserving the offset through fusion is natural. If it presents a video, product, or document, entity-level collapse is natural. When signals operate at different granularities, the system needs an explicit element-to-entity scoring rule.

StructArray moves that identity-and-collapse problem from ad hoc post-processing into the search execution model.

## How Milvus executes StructArray without treating it as a blob

The user-facing model is `ARRAY<STRUCT>`. Storing the entire value as one opaque blob, however, would make subfield indexes, filters, and selective output inefficient.

Milvus uses a logical-parent, physical-child-column design.

At the schema layer, `clips` is the logical parent field. It defines properties such as the Struct schema, maximum capacity, and nullability. Its subfields are normalized into paths such as `clips[clip_embedding_list]`, `clips[clip_embedding]`, `clips[scene_type]`, and `clips[label_confidence]`.

Scalar subfields follow scalar-array storage paths per entity, while vector subfields follow vector-array paths. Each subfield can then use the data path appropriate to its type: scalar filtering and scalar indexes for metadata, and vector indexes and ANN search for embeddings.

At ingestion, the Proxy expands the nested Struct list into typed child columns. During execution, Milvus maintains the relationship between each physical element and its parent entity. Conceptually, that relationship looks like this:

```
Plaintext
entity 0 -> elements [0, 1, 2]
entity 1 -> elements [3]
entity 2 -> elements []
entity 3 -> elements [4, 5, 6, 7]
```

When element-level search returns a physical element ID, Milvus maps it back to the parent entity and the element offset. When `element_filter` produces an element-level bitmap, the engine aligns it with parent-entity visibility, deletes, and other filters.

When returning results, Milvus uses the logical schema and shared offsets to reconstruct the StructArray shape that the application inserted. The system can execute over typed child columns while the user continues to read and write natural nested objects. This physical layout makes StructArray more than typed JSON: the nested relationship participates in the index and execution model.

## Where StructArray fits, and where it does not

StructArray is a strong fit when all of the following are true:

-   The application has a meaningful parent entity, such as a video, product, document, visual page, or memory record.
-   Each parent contains an ordered, variable-length set of local elements.
-   Those elements need their own scalar metadata, vectors, or both.
-   Search or filtering must preserve the relationship between subfields at the same element offset.
-   The application needs entity-level multi-vector retrieval, element-level hits, or both.

StructArray is not automatically better for every collection. A short document or simple query may be well served by a single dense embedding. Multi-vector indexing adds storage and search costs, so the additional representation should earn its place through improved retrieval quality or more useful granularity of results.

Current schema and execution boundaries also matter:

-   `Struct` is supported as the element type of an `Array`, not as a top-level collection field.
-   All elements in one StructArray share one predefined schema.
-   `max_capacity` is required and limits the number of elements per entity.
-   Nested `Struct`, `Array`, `ArrayOfStruct`, and `JSON` subfields are not supported inside a StructArray.
-   A vector subfield accepts one index. Use separate vector subfields for EmbeddingList and element-level search when both are required.
-   Vector subfields must be indexed before search. Scalar subfields used heavily in filters should be indexed appropriately.
-   The subfield schema is fixed after the StructArray field is created, so plan element attributes before production rollout.

These constraints make the model narrower than a document database's arbitrary nesting, but they also give Milvus enough structure to reason about element identity, index each subfield, and execute at two search granularities.

## StructArray keeps local evidence first-class without losing the entity

StructArray gives Milvus a retrieval object that flat schemas struggle to represent: a parent entity with an ordered set of structured elements. The relationships among those elements participate in filtering, indexing, and search rather than existing only in storage.

Each element retains its own metadata and embeddings. The elements can satisfy same-element scalar predicates, participate together in entity-level EmbeddingList search, or compete independently in element-level search. At the same time, they remain attached to the parent entity whose metadata, permissions, and application identity give them context.

For video clips, product images, document passages, visual patches, and memory fragments, local evidence can be searched and filtered without losing the entity to which it belongs. The remaining design choices are explicit: select the search granularity, give each vector subfield the matching metric and index, and decide whether hybrid results should preserve element offsets or collapse back to entities.

## Try StructArray in Milvus 3.0

StructArray is available in Milvus 3.0. Start with the [StructArray overview](https://milvus.io/docs/array-of-structs.md). If you are evaluating entity-level multi-vector retrieval, read the [EmbeddingList strategy guide](https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md). For result granularity and collapse behavior, see [Hybrid Search with StructArray](https://milvus.io/docs/hybrid-search-with-structarray.md).

For the broader release context, see the [Milvus 3.0 launch blog](https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md), [release notes](https://milvus.io/docs/release_notes.md), and the [milvus-io/milvus repository](https://github.com/milvus-io/milvus).

[Zilliz Cloud](https://zilliz.com/) also supports StructArray and EmbeddingList search for managed deployments. Review the [Zilliz Cloud StructArray guide](https://docs.zilliz.com/docs/use-array-of-structs) for service-specific limits. In Zilliz Cloud, scalar operators on StructArray are currently documented for On-Demand clusters.

To discuss a schema or retrieval design with the team, join the [Milvus Discord community](https://discord.com/invite/8uyFbECzPX) or book a [Milvus Office Hours](https://meetings.hubspot.com/chloe-williams1/milvus-meeting) session.
