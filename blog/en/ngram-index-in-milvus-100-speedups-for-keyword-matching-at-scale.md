---
id: ngram-index-in-milvus-100-speedups-for-keyword-matching-at-scale.md
title: >
 Ngram Index in Milvus: 100× Speedups for Keyword Matching at Scale
author: Chenjie Tang
date: 2025-12-19
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Milvus, Ngram Index, n-gram search, LIKE queries
meta_title: >
 Ngram Index in Milvus: 100× Faster LIKE Queries at Scale
desc: Learn how the Ngram Index in Milvus accelerates LIKE queries by turning substring matching into efficient n-gram lookups, delivering 100× faster performance.
origin: https://milvus.io/blog/ngram-index-in-milvus-100-speedups-for-keyword-matching-at-scale.md
---

In Agent systems, context processing spans multiple critical stages, including retrieval, filtering, validation, and decision-making. Throughout this pipeline, exact keyword matching has always been a foundational requirement.

This is common in scenarios such as customer support agents searching historical conversations for a specific product name or ingredient, coding agents retrieving code snippets that contain a particular function, API call, or error message, and agents in legal, medical, and academic domains filtering documents that explicitly reference a given term.

For a long time, the SQL `LIKE` expression has been the standard tool for handling this type of query. For example, if you want to find all records where the `name` field contains the string rod anywhere in the text, you can use a filter such as `name LIKE '%rod%'`.

However, under high concurrency and large data volumes, this simplicity comes with significant performance trade-offs:

- **Without an index**, `LIKE` queries must scan the entire context store and apply regular expression–style matching row by row. With millions of records, even a single query can take seconds—far too slow for real-time Agent interactions.

- **Even with a conventional inverted index**, patterns such as `%rod%` are still difficult to optimize. The database must traverse the entire index dictionary and perform pattern matching on each entry. While this avoids scanning raw data rows, the operation remains fundamentally linear, resulting in only marginal performance improvements.

To address these limitations, [Milvus](https://milvus.io/) introduces the [Ngram Index](https://milvus.io/docs/ngram.md), which improves `LIKE` query performance by splitting text into smaller substrings and indexing them for efficient lookup. This approach significantly reduces the amount of data that needs to be examined during query execution, resulting in **tens to hundreds of times faster** `LIKE` queries in real workloads.

In this post, we’ll walk through how the Ngram Index in Milvus works and evaluate its real-world performance.


## What Is the Ngram Index?

In databases, text filtering is commonly expressed using **SQL**, the standard query language used to retrieve and manage data. One of its most widely used text operators is `LIKE`, which supports pattern-based string matching.

LIKE expressions can be broadly grouped into four common pattern types, depending on how wildcards are used:

- **Infix match** (`name LIKE '%rod%'`): Matches records where the substring rod appears anywhere in the text.

- **Prefix match** (`name LIKE 'rod%'`): Matches records whose text starts with rod.

- **Suffix match** (`name LIKE '%rod'`): Matches records whose text ends with rod.

- **Wildcard match** (`name LIKE '%rod%aab%bc_de'`): Combines multiple substring conditions (`%`) with single-character wildcards (`_`) in a single pattern.

While these patterns differ in appearance and expressiveness, the **Ngram Index** in Milvus accelerates all of them using the same underlying approach.

Before building the index, Milvus splits each text value into short, overlapping substrings of fixed lengths, known as _n-grams_. For example, when n = 3, the word **“Milvus”** is decomposed into the following 3-grams: **“Mil”**, **“ilv”**, **“lvu”**, and **“vus”**. Each n-gram is then stored in an inverted index that maps the substring to the set of document IDs in which it appears. At query time, `LIKE` conditions are translated into combinations of n-gram lookups, allowing Milvus to quickly filter out most non-matching records and evaluate the pattern against a much smaller candidate set. This is what turns expensive string scans into efficient index-based queries.

Two parameters control how the Ngram Index is constructed: `min_gram` and `max_gram`. Together, they define the range of substring lengths that Milvus generates and indexes.

- **`min_gram`**: The shortest substring length to index. In practice, this also sets the minimum query substring length that can benefit from the Ngram Index

- **`max_gram`**: The longest substring length to index. At query time, it additionally determines the maximum window size used when splitting longer query strings into n-grams.

By indexing all contiguous substrings whose lengths fall between `min_gram` and `max_gram`, Milvus establishes a consistent and efficient foundation for accelerating all supported `LIKE` pattern types.


## How Does the Ngram Index Work?

Milvus implements the Ngram Index in a two-phase process:

- **Build the index:** Generate n-grams for each document and build an inverted index during data ingestion.

- **Accelerate queries:** Use the index to narrow the search to a small candidate set, then verify exact `LIKE` matches on those candidates.

A concrete example makes this process easier to understand.


### Phase 1: Build the index

**Decompose text into n-grams:**

Assume we index the text **“Apple”** with the following settings:

- `min_gram = 2`

- `max_gram = 3`

Under this setting, Milvus generates all contiguous substrings of length 2 and 3:

- 2-grams: `Ap`, `pp`, `pl`, `le`

- 3-grams: `App`, `ppl`, `ple`

**Build an inverted index:**

Now consider a small dataset of five records:

- **Document 0**: `Apple`

- **Document 1**: `Pineapple`

- **Document 2**: `Maple`

- **Document 3**: `Apply`

- **Document 4**: `Snapple`

During ingestion, Milvus generates n-grams for each record and inserts them into an inverted index. In this index:

- **Keys** are n-grams (substrings)

- **Values** are lists of document IDs where the n-gram appears

```
"Ap"  -> [0, 3]
"App" -> [0, 3]
"Ma"  -> [2]
"Map" -> [2]
"Pi"  -> [1]
"Pin" -> [1]
"Sn"  -> [4]
"Sna" -> [4]
"ap"  -> [1, 2, 4]
"apl" -> [2]
"app" -> [1, 4]
"ea"  -> [1]
"eap" -> [1]
"in"  -> [1]
"ine" -> [1]
"le"  -> [0, 1, 2, 4]
"ly"  -> [3]
"na"  -> [4]
"nap" -> [4]
"ne"  -> [1]
"nea" -> [1]
"pl"  -> [0, 1, 2, 3, 4]
"ple" -> [0, 1, 2, 4]
"ply" -> [3]
"pp"  -> [0, 1, 3, 4]
"ppl" -> [0, 1, 3, 4]
```

Now the index is fully built. 


### Phase 2: Accelerate queries

When a `LIKE` filter is executed, Milvus uses the Ngram Index to speed up query evaluation through the following steps:

**1. Extract the query term:** Contiguous substrings without wildcards are extracted from the `LIKE` expression (for example, `'%apple%'` becomes `apple`).

**2. Decompose the query term:** The query term is decomposed into n-grams based on its length (`L`) and the configured `min_gram` and `max_gram`.

**3. Look for each gram & intersect:** Milvus looks up query n-grams in the inverted index and intersects their document ID lists to produce a small candidate set. 

**4. Verify and return results:** The original `LIKE` condition is applied only to this candidate set to determine the final result.

In practice, the way a query is split into n-grams depends on the shape of the pattern itself. To see how this works, we’ll focus on two common cases: infix matches and wildcard matches. Prefix and suffix matches behave the same as infix matches, so we won’t cover them separately.

**Infix match**

For an infix match, execution depends on the length of the literal substring (`L`) relative to `min_gram` and `max_gram`.

**1. `min_gram ≤ L ≤ max_gram`** (e.g., `strField LIKE '%ppl%'`)

The literal substring `ppl` falls entirely within the configured n-gram range. Milvus directly looks up the n-gram `"ppl"` in the inverted index, producing the candidate document IDs `[0, 1, 3, 4]`.

Because the literal itself is an indexed n-gram, all candidates already satisfy the infix condition. The final verification step does not eliminate any records, and the result remains `[0, 1, 3, 4]`.

**2. `L > max_gram`** (e.g., `strField LIKE '%pple%'`)

The literal substring `pple` is longer than `max_gram`, so it is decomposed into overlapping n-grams using a window size of `max_gram`. With `max_gram = 3`, this produces the n-grams `"ppl"` and `"ple"`.

Milvus looks up each n-gram in the inverted index: 

- `"ppl"` → `[0, 1, 3, 4]`

- `"ple"` → `[0, 1, 2, 4]`

Intersecting these lists yields the candidate set `[0, 1, 4]`. The original `LIKE '%pple%'` filter is then applied to these candidates. All three satisfy the condition, so the final result remains `[0, 1, 4]`.

**3. `L < min_gram`** (e.g., `strField LIKE '%pp%'`)

The literal substring is shorter than `min_gram` and therefore cannot be decomposed into indexed n-grams. In this case, the Ngram Index cannot be used, and Milvus falls back to the default execution path, evaluating the `LIKE` condition through a full scan with pattern matching.

**Wildcard match** (e.g., `strField LIKE '%Ap%pple%'`)

This pattern contains multiple wildcards, so Milvus first splits it into contiguous literals: `"Ap"` and `"pple"`.

Milvus then processes each literal independently:

- `"Ap"` has length 2 and falls within the n-gram range.

- `"pple"` is longer than `max_gram` and is decomposed into `"ppl"` and `"ple"`.

This reduces the query to the following n-grams:

- `"Ap"` → `[0, 3]`

- `"ppl"` → `[0, 1, 3, 4]`

- `"ple"` → `[0, 1, 2, 4]`

Intersecting these lists produces a single candidate: `[0]`.

Finally, the original `LIKE '%Ap%pple%'` filter is applied to document 0 (`"Apple"`). Since it does not satisfy the full pattern, the final result set is empty.


## Limitations and Trade-offs of the Ngram Index

While the Ngram Index can significantly improve `LIKE` query performance, it introduces trade-offs that should be considered in real-world deployments.

- **Increased index size**

The primary cost of the Ngram Index is higher storage overhead. Because the index stores all contiguous substrings whose lengths fall between `min_gram` and `max_gram`, the number of generated n-grams grows quickly as this range expands. Each additional n-gram length effectively adds another full set of overlapping substrings for every text value, increasing both the number of index keys and their posting lists. In practice, expanding the range by just one character can roughly double the index size compared to a standard inverted index.

- **Not effective for all workloads**

The Ngram Index does not accelerate every workload. If query patterns are highly irregular, contain very short literals, or fail to reduce the dataset to a small candidate set in the filtering phase, the performance benefit may be limited. In such cases, query execution can still approach the cost of a full scan, even though the index is present. 


## Evaluating Ngram Index Performance on LIKE Queries

The goal of this benchmark is to evaluate how effectively the Ngram Index accelerates `LIKE` queries in practice. 


### Test Methodology

To put its performance in context, we compare it against two baseline execution modes:

- **Master**: Brute-force execution without any index.

- **Master-inverted**: Execution using a conventional inverted index.

We designed two test scenarios to cover different data characteristics:

- **Wiki text dataset**: 100,000 rows, with each text field truncated to 1 KB.

- **Single-word dataset**: 1,000,000 rows, where each row contains a single word.

Across both scenarios, the following settings are applied consistently:

- Queries use the **infix match pattern** (`%xxx%`)

- The Ngram Index is configured with `min_gram = 2` and `max_gram = 4`

- To isolate query execution cost and avoid result materialization overhead, all queries return `count(*)` instead of full result sets.

### Results

**Test for wiki, each line is a wiki text with content length truncated by 1000, 100K rows**


|                 | Literal                                       | Time(ms) | Speedup        | Count |
| --------------- | --------------------------------------------- | -------- | -------------- | ----- |
| Master          | stadium                                       | 207.8    |                | 335   |
| Master-inverted |                                               | 2095     |                | 335   |
| Ngram           |                                               | 1.09     | 190 / 1922     | 335   |
|                 |                                               |          |                |       |
| Master          | secondary school                              | 204.8    |                | 340   |
| Master-inverted |                                               | 2000     |                | 340   |
| Ngram           |                                               | 1.26     | 162.5 / 1587   | 340   |
|                 |                                               |          |                |       |
| Master          | is a coeducational, secondary school sponsore | 223.9    |                | 1     |
| Master-inverted |                                               | 2100     |                | 1     |
| Ngram           |                                               | 1.69     | 132.5 / 1242.6 | 1     |

**Test for single words, 1M rows**

|                 | Literal | Time(ms) | Speedup     | Count |
| --------------- | ------- | -------- | ----------- | ----- |
| Master          | na      | 128.6    |             | 40430 |
| Master-inverted |         | 66.5     |             | 40430 |
| Ngram           |         | 1.38     | 93.2 / 48.2 | 40430 |
|                 |         |          |             |       |
| Master          | nat     | 122      |             | 5200  |
| Master-inverted |         | 65.1     |             | 5200  |
| Ngram           |         | 1.27     | 96 / 51.3   | 5200  |
|                 |         |          |             |       |
| Master          | nati    | 118.8    |             | 1630  |
| Master-inverted |         | 66.9     |             | 1630  |
| Ngram           |         | 1.21     | 98.2 / 55.3 | 1630  |
|                 |         |          |             |       |
| Master          | natio   | 118.4    |             | 1100  |
| Master-inverted |         | 65.1     |             | 1100  |
| Ngram           |         | 1.33     | 89 / 48.9   | 1100  |
|                 |         |          |             |       |
| Master          | nation  | 118      |             | 1100  |
| Master-inverted |         | 63.3     |             | 1100  |
| Ngram           |         | 1.4      | 84.3 / 45.2 | 1100  |

**Note:** These results are based on benchmarks conducted in May. Since then, the Master branch has undergone additional performance optimizations, so the performance gap observed here is expected to be smaller in current versions.

The benchmark results highlight a clear pattern: the Ngram Index significantly accelerates LIKE queries in all cases, and how much faster the queries run depends strongly on the structure and length of the underlying text data.

- For **long text fields**, such as Wiki-style documents truncated to 1,000 bytes, the performance gains are especially pronounced. Compared to brute-force execution with no index, the Ngram Index achieves speedups of roughly **100–200×**. When compared against a conventional inverted index, the improvement is even more dramatic, reaching **1,200–1,900×**. This is because LIKE queries on long text are particularly expensive for traditional indexing approaches, while n-gram lookups can quickly narrow the search space to a very small set of candidates.

On datasets consisting of **single-word entries**, the gains are smaller but still substantial. In this scenario, the Ngram Index runs approximately **80–100×** faster than brute-force execution and **45–55×** faster than a conventional inverted index. Although shorter text is inherently cheaper to scan, the n-gram–based approach still avoids unnecessary comparisons and consistently reduces query cost.

## Conclusion

The Ngram Index accelerates `LIKE` queries by breaking text into fixed-length n-grams and indexing them using an inverted structure. This design turns expensive substring matching into efficient n-gram lookups followed by minimal verification. As a result, full-text scans are avoided while the exact semantics of `LIKE` are preserved.

In practice, this approach is effective across a wide range of workloads, with especially strong results for fuzzy matching on long text fields. The Ngram Index is therefore well suited for real-time scenarios such as code search, customer support agents, legal and medical document retrieval, enterprise knowledge bases, and academic search, where precise keyword matching remains essential.

At the same time, the Ngram Index benefits from careful configuration. Choosing appropriate `min_gram` and `max_gram` values is critical to balancing index size and query performance. When tuned to reflect real query patterns, the Ngram Index provides a practical, scalable solution for high-performance `LIKE` queries in production systems.

For more information about the Ngram Index, check the documentation below: 

- [Ngram Index | Milvus Documentation](https://milvus.io/docs/ngram.md)

Have questions or want a deep dive on any feature of the latest Milvus? Join our[ Discord channel](https://discord.com/invite/8uyFbECzPX) or file issues on[ GitHub](https://github.com/milvus-io/milvus). You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through[ Milvus Office Hours](https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md).


## Learn More about Milvus 2.6 Features

- [Introducing Milvus 2.6: Affordable Vector Search at Billion Scale](https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md)

- [Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization and Semantic Search](https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md)

- [JSON Shredding in Milvus: 88.9x Faster JSON Filtering with Flexibility](https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md)

- [Unlocking True Entity-Level Retrieval: New Array-of-Structs and MAX_SIM Capabilities in Milvus](https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md)

- [Bringing Geospatial Filtering and Vector Search Together with Geometry Fields and RTREE in Milvus 2.6](https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md)

- [Introducing AISAQ in Milvus: Billion-Scale Vector Search Just Got 3,200× Cheaper on Memory](https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md)

- [Optimizing NVIDIA CAGRA in Milvus: A Hybrid GPU–CPU Approach to Faster Indexing and Cheaper Queries](https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md)

- [MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data ](https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md)

- [Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ](https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md)

- [Benchmarks Lie — Vector DBs Deserve a Real Test ](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md)

- [We Replaced Kafka/Pulsar with a Woodpecker for Milvus ](https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md)

