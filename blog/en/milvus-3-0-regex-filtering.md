---
id: milvus-3-0-regex-filtering.md
title: >
 Beyond =~: How Milvus 3.0 Turns Regex into a Native Database Filter
author: Buqian Zheng
date: 2026-8-5
cover: assets.zilliz.com/regex_optimization_pipeline_with_milvus_57a9037801.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Milvus 3.0, vector search, regex filtering, full-text search
meta_title: >
 Beyond =~: How Milvus 3.0 Turns Regex into a Native Database Filter
desc: >
 Milvus 3.0 moves regex from application-side post-processing into the database query path, where it can be combined with vector search, full-text search, scalar filters, and indexed execution.
origin: https://milvus.io/blog/milvus-3-0-regex-filtering.md
---


Vector search can find logs that are semantically similar to an incident. During an outage, however, similarity is only the first cut. Engineers often need to narrow those results with structural rather than semantic constraints.

Consider a failure in the checkout service. We want logs related to the incident at hand, but only from `checkout`. The message must contain an error code in the form of `E` followed by four digits, and that code must appear before `timeout`.

```python
results = client.search(
    collection_name="logs",
    data=[incident_embedding],
    anns_field="embedding",
    filter=r'service == "checkout" and message =~ r"E[0-9]{4}:.*timeout"',
    limit=20,
    output_fields=["timestamp", "service", "message"],
)
```

Vector search and regex do different jobs in this query. Vector similarity retrieves logs that resemble the incident; the regex filter keeps only those that match the failure signature we care about.

Milvus 3.0 adds the `=~` and `!~` operators for this type of filter. Supporting those operators in a database involves more than parsing regex syntax: **Milvus must validate user-supplied patterns, preserve null and negation semantics, integrate regex with query planning and indexing, and keep its cost predictable across millions of strings.**

With the latest release, Milvus 3.0 moves regex from application-side post-processing into the database query path, where it can be combined with vector search, full-text search, scalar filters, and indexed execution. This article discusses those design choices, from operator semantics and RE2 validation to raw execution, NGRAM candidate generation, and benchmark results.

## Where regex fits in Milvus filtering

Before regex support, Milvus could already express simple string patterns with `LIKE`:

```
Plaintext
message LIKE "ERROR%"
message LIKE "%timeout%"
message LIKE "node_12_"
```

`LIKE` is simple and readable. For prefix, suffix, and ordinary contains filters, it also gives the execution engine an opportunity to use a more direct path. Its expressive range, however, stops at two wildcard rules: `%` for zero or more characters and `_` for exactly one character.

`Like` is not enough for patterns such as:

-   Error codes: `E[0-9]{4}`
-   Semantic versions: `v[0-9]+.[0-9]+.[0-9]+`
-   Multiple states: `ERROR|WARN`
-   URL routes: `^/api/v[0-9]+/users/[0-9]+$`
-   Required ordering: `checkout.*timeout`
-   Case-insensitive text: `(?i)connection refused`

Decomposing these structures into a large set of `LIKE`, range, and Boolean expressions is difficult to maintain and easy to get wrong at the edges. **Regex fills the gap between simple wildcard matching and token-based or semantic retrieval.** It describes string structure; it does not replace full-text relevance or vector similarity.

The clearest operator is usually the best one to use:

| Requirement | Recommended operation |
| --- | --- |
| Exact value | `==` / `IN` |
| Simple prefix, suffix, or substring | `LIKE` |
| Character classes, repetition, anchors, or structural order | Regex `=~` / `!~` |
| Token-level lexical relevance | `text_match` / BM25 |
| Ordered phrases | `phrase_match` |
| Typographical variation | Milvus currently has no native fuzzy match; handle it in the application layer |

A pattern such as `^ERROR` or `timeout$` is a valid regex, and the parser may rewrite it to a cheaper execution path. Even so, choosing the operator that states the intent most directly makes filters easier to read and maintain.

## User-facing semantics: `=~`, `!~`, anchors, and raw strings

Milvus 3.0 uses `=~` for a positive regex match and `!~` for a negative match:

-   `message =~ "E[0-9]{4}"` keeps rows whose string contains a matching error code.
-   `message !~ "DEBUG|TRACE"` excludes rows whose string matches either alternative.
-   `message =~ "timeout"` uses substring semantics and matches any string containing `timeout`.
-   `message =~ "^timeout$"` uses `^` and `$` to require a full-string match.

Regex can target several kinds of string values. For arrays and StructArray fields, the expression must identify a specific string element or string subfield:

-   A `VARCHAR` field: `message =~ r"timeout"`
-   A JSON path that resolves to a string: `metadata["error_message"] =~ r"E[0-9]{4}:.*timeout"`
-   One element of an `ARRAY<VARCHAR>`: `tags[0] =~ r"release-v[0-9]+"`
-   A `VARCHAR` subfield inside a StructArray expression: `MATCH_ANY(events, $[name] =~ r"error.*timeout")`

## Raw strings keep escaping manageable

Regex patterns frequently contain backslashes. Milvus 3.0 supports raw string literals in filter expressions. For example:

```python
filter_expr = r'message =~ r"\d+.\d+.\d+"'
```

The inner `r"..."` tells the Milvus expression parser to preserve the backslashes. The outer Python raw string then keeps the application language, Milvus expression, and regex layers from multiplying the escaping rules.

Filter templates work with regex as well:

```python
client.query(
    collection_name="logs",
    filter="message =~ {pattern}",
    filter_params={"pattern": r"E[0-9]{4}:.*timeout"},
    output_fields=["message"],
)
```

Passing the pattern as a template parameter is safer than concatenating an expression string and lets the same query template be reused.

## Why Milvus uses RE2: database regex must have predictable cost

Many regex engines use backtracking. A carefully constructed pattern can force their execution time to grow exponentially with the input length, a failure mode commonly called catastrophic backtracking or regular expression denial of service (ReDoS).

In a local script, a pathological pattern can stall one process. In a database, the pattern is query input. One request may apply it to millions of rows while many users submit other patterns concurrently. If worst-case execution is unbounded, an ordinary-looking filter can exhaust CPU across the service.

Milvus uses RE2 because it guarantees matching time that is linear in the input length. **The tradeoff is deliberate: RE2 does not support constructs that depend on backtracking, including:**

-   Backreferences
-   Lookahead
-   Lookbehind

**Milvus favors predictable execution over the largest possible regex syntax. Before a filter reaches the scan path, the expression parser compiles and validates its pattern. An invalid regex returns an error before Milvus begins scanning the data.**

## From syntax to execution: a layered path

The simplest implementation would compile a pattern and call RE2 once for every row. That would produce correct matches, but it would ignore structure the database already knows about the pattern, the rest of the filter, and available indexes.

Milvus instead uses a layered execution path. Each layer applies only reductions that preserve correctness. When the engine cannot prove that a shortcut is safe, it falls back to full RE2 verification.

### 1. Rewrite regex that is really a cheaper string operation

Some regex patterns do not need the regex engine at all:

| Pattern | Rewritten operation |
| --- | --- |
| `^ERROR$` | Equality |
| `^ERROR` | Prefix match |
| `ERROR$` | Suffix match |

The parser recognizes these anchored literals and rewrites them to cheaper operations.

An unanchored literal such as `ERROR` has different semantics: it asks whether `ERROR` occurs anywhere in the string. In the current implementation, anchored simple patterns become equality, prefix, or suffix operations, while an ordinary unanchored literal remains a `RegexMatch` expression.

### 2. Treat regex as a heavy predicate

Consider a compound filter:

```
Plaintext
service_id == 42 and message =~ r"E[0-9]{4}:.*timeout"
```

A numeric equality check or an existing indexed filter is usually cheaper than regex. Milvus marks regex as a heavy predicate so the planner can run cheaper conditions first and apply RE2 to the smaller candidate set.

The benchmark later in this article intentionally excludes vector search and compound filters, so it does not mix approximate nearest neighbor (ANN), scalar-index, and regex costs. In production queries, predicate ordering remains part of the complete execution path.

### 3. On the raw path, compile once and prefilter required literals

Without an NGRAM index, a sealed segment reads the original strings and evaluates the match. Milvus reuses a compiled RE2 pattern at segment scope instead of compiling it once per row.

For a pattern with stable required literals, such as:

```
Plaintext
ERROR.*timeout
```

Milvus can first use Volnitsky string search to find rows that may contain the required literals. Only those rows proceed to exact RE2 verification.

Volnitsky is a prefilter, not a substitute for regex. A string that contains both `ERROR` and `timeout` does not necessarily satisfy their order or the full pattern. The prefilter's job is only to reduce the number of more expensive RE2 calls.

### 4. With NGRAM, generate candidates first and verify them with RE2

For large sealed datasets, a string field can carry an NGRAM index:

```python
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="message",
    index_type="NGRAM",
    params={"min_gram": 4, "max_gram": 4},
)
client.create_index("logs", index_params)
```

NGRAM does not execute the regex itself. It introduces a two-phase path:

1.  Conservatively extract literals that must occur in every match.
2.  Split those literals into n-grams and intersect their posting lists to produce a candidate bitmap.
3.  Read the original strings only for candidate rows.
4.  Run RE2 on those candidates to produce the exact result.

For `ERROR.*timeout`, suppose only 0.1% of 10 million rows contain the required literals. Phase 1 can remove almost the entire dataset before RE2 runs. The performance gain comes from candidate reduction, not from approximating regex.

This separation also protects correctness. A condition that cannot be extracted safely is not allowed to eliminate rows, and RE2 still decides every final match. The NGRAM coarse filter therefore does not introduce false negatives.

### 5. Fall back when candidate reduction is not provably safe

Not every pattern exposes useful fixed literals:

```
Plaintext
E[0-9]{4}
ERROR|WARN
(?i)error.*timeout
```

A character class may leave only a very short literal. Alternation requires reasoning across multiple branches, and case-insensitive matching requires case folding. In the current implementation, alternation and `(?i)` patterns bypass the NGRAM coarse filter and fall back to raw verification.

That fallback is the correct boundary for an index optimization. If Milvus cannot prove that a candidate reduction is safe, it does not use it.

## `!~` must preserve UNKNOWN, not just invert a bitmap

Once regex enters a database expression language, the difficult cases are not limited to pattern syntax. Nullability matters too.

Consider three JSON records:

```json
{"message": "request timeout"}
{"message": "request completed"}
{}
```

The third record has no `message`. Under the three-valued logic described by this design, the engine can prove neither that the missing value matches nor that it does not match, so the result is `UNKNOWN`:

| Input | `message =~ "timeout"` | `message !~ "timeout"` |
| --- | --- | --- |
| `"request timeout"` | TRUE | FALSE |
| `"request completed"` | FALSE | TRUE |
| NULL / missing path / invalid type | UNKNOWN | UNKNOWN |

A `WHERE` or `filter` clause returns only rows for which the expression is `TRUE`, so the final row is excluded by both operators.

Implementing `!~` as ordinary Boolean inversion would be wrong. A missing path represented as `false` would become `true`, and an entity with no value would unexpectedly appear in a "does not match" query. Milvus represents `!~` as `NOT (=~)` while preserving the validity bitmap, keeping `UNKNOWN` consistent across raw and indexed paths.

This is the difference between attaching a string library to an executor and implementing regex as a database predicate.

## Benchmark: NGRAM helps when literals shrink the candidate set

The benchmark isolates regex filtering over sealed segments so that the results reflect raw string scanning, NGRAM candidate generation, and RE2 verification. It excludes growing segments, vector search, and compound filters.

### Dataset and controlled selectivity

The test uses the public [Loghub HDFS_v1](https://github.com/logpai/loghub/tree/master/HDFS) dataset:

-   11,175,629 HDFS system-log rows
-   1.47 GiB of raw data
-   38.7 hours of logs
-   The first 10,000,000 valid rows used in the experiment

The original log length, token, and repetition distributions are preserved. To control match rates precisely, the test appends a benchmark marker to a small number of rows selected with a fixed random seed:

```
Plaintext
level=ERROR code=E4821 operation=checkout result=request_timeout
```

The injection targets are 0.01%, 1%, 10%, and 50%. Every dataset variant uses the same seeded row selection and transformation rules, making the marked HDFS_v1 data reproducible. A consistency test also runs on the original, unmodified log fields to confirm that the observed optimization trend is not an artifact of marker injection.

### Test environment

| **Item** | **Measured configuration** |
| --- | --- |
| Milvus commit | `03762320e8` |
| Deployment | Standalone, sealed segment, 1 shard |
| Hardware | Apple M5 Pro, 48 GiB memory |
| Collection rows | 10,000,000 |
| Fields | Five `VARCHAR(max_length=512)` fields plus a placeholder `BINARY_VECTOR(dim=8)` |
| NGRAM | `min_gram=4`, `max_gram=4` |
| Concurrency | 1 for latency, 32 for throughput |
| Repetition | 2 warm-up runs plus 5 measured runs; p50 / p95 / p99 reported |

The raw and NGRAM paths use the same data and query order. Results are measured after warm-up and cover warm-cache behavior only. The test does not support conclusions about cold starts or first-query latency.

### Pattern matrix

| Pattern | Main execution path | What the test isolates |
| --- | --- | --- |
| `^ERROR` | Anchored literal; candidate generation plus prefix verification | How anchor verification changes as candidate rate rises |
| `ERROR.*timeout` | Literal-rich; NGRAM candidates plus RE2 | The range in which NGRAM should provide the clearest gain |
| `E[0-9]{4}` | Weak required literal; fixed 4-gram provides little reduction | Whether weak literals approach raw-scan cost |
| `ERROR|WARN` | Alternation fallback | The current alternation boundary |
| `(?i)error.*timeout` | Case-insensitive fallback | The current case-insensitive boundary |

Each pattern is run over two sealed-segment paths:

-   No scalar index: raw string scan
-   NGRAM index: candidate generation plus RE2 verification, with automatic fallback when NGRAM cannot be used

### Latency across selectivity levels

Each cell below reports `raw p50 ms / NGRAM p50 ms / speedup`. A value greater than `1x` means NGRAM is faster.

| Pattern | 0.01% | 1% | 10% | 50% |
| --- | --- | --- | --- | --- |
| `^ERROR` | 12.65 / 6.99 / 1.81x | 12.98 / 9.63 / 1.35x | 12.73 / 10.98 / 1.16x | 13.96 / 20.27 / 0.69x |
| `ERROR.*timeout` | 24.31 / 7.47 / 3.26x | 26.06 / 12.65 / 2.06x | 39.86 / 30.44 / 1.31x | 100.24 / 85.73 / 1.17x |
| `E[0-9]{4}` | 17.24 / 16.43 / 1.05x | 16.77 / 16.91 / 0.99x | 22.14 / 22.18 / 1.00x | 44.90 / 44.73 / 1.00x |
| `ERROR|WARN` | 287.31 / 280.79 / 1.02x | 282.81 / 285.40 / 0.99x | 292.34 / 290.07 / 1.01x | 315.69 / 312.57 / 1.01x |
| `(?i)error.*timeout` | 73.66 / 72.58 / 1.01x | 75.14 / 75.89 / 0.99x | 86.58 / 86.35 / 1.00x | 136.78 / 134.94 / 1.01x |

At 1% selectivity, `ERROR.*timeout` also shows improvement beyond median latency: p95 falls from 26.47 ms to 13.03 ms, throughput at concurrency 32 rises from 72.70 to 117.60 QPS (61.77%), and CPU time per query falls by 52.14%.

The literal-rich `ERROR.*timeout` pattern benefits most. As selectivity rises from 0.01% to 50%, its speedup falls from 3.26x to 1.17x because more rows survive candidate generation and still require RE2.

Weak-literal, alternation, and case-insensitive patterns remain approximately level with the raw scan. The anchored `^ERROR` pattern helps at low candidate rates but falls to 0.69x at 50%. In this dataset, the injected marker puts `ERROR` near the end of the row, so the final anchored match count remains zero. Phase 1 still produces a large candidate set, and the extra verification work makes the indexed path slower.

### Candidate reduction explains the gain

The next table isolates `ERROR.*timeout` and places Phase 1 candidate count beside p50 latency:

| Injection rate | Phase 1 candidates | Candidate reduction | Raw p50 | NGRAM p50 | Speedup |
| --- | --- | --- | --- | --- | --- |
| 0.01% | 1,000 | 99.99% | 24.31 ms | 7.47 ms | 3.26x |
| 1% | 100,000 | 99% | 26.06 ms | 12.65 ms | 2.06x |
| 10% | 1,000,000 | 90% | 39.86 ms | 30.44 ms | 1.31x |
| 50% | 5,000,000 | 50% | 100.24 ms | 85.73 ms | 1.17x |

The relationship is direct. Reducing candidates by 99.99% produces a 3.26x speedup; reducing them by only 50% leaves 1.17x. NGRAM earns its cost when required literals remove a substantial share of rows before RE2 verification.

Data sources and references:

-   [Loghub repository](https://github.com/logpai/loghub)
-   [HDFS_v1 dataset](https://github.com/logpai/loghub/tree/master/HDFS)
-   [Zenodo dataset record](https://doi.org/10.5281/zenodo.8196385)
-   Jieming Zhu, Shilin He, Pinjia He, Jinyang Liu, and Michael R. Lyu. _Loghub: A Large Collection of System Log Datasets for AI-driven Log Analytics_. ISSRE 2023.

## Current boundaries and likely next steps

Milvus 3.0 regex filtering has several explicit boundaries:

-   RE2 does not support backreferences or lookaround.
-   Regex is a filter operation; it does not provide extract or replace functions.
-   Case-insensitive `(?i)` patterns do not currently use the NGRAM coarse filter.
-   Alternation is not currently split into separate NGRAM branches.
-   A pattern with no safely extractable required literal falls back to a raw scan.
-   The presence of an ordinary inverted index does not mean a regex filter will use it; NGRAM is the primary regex-acceleration path described here.

Those boundaries suggest natural extensions: case-folded NGRAM, branch splitting for alternation, and richer multi-pattern execution. Any such optimization must preserve the same contract as the current design: candidate generation may be conservative, but only exact matching can decide the final result.

## Regex as a database capability

Adding `=~` to an expression grammar is the easy part. A database implementation must also answer harder questions:

-   Can users submit arbitrary patterns without creating unbounded work?
-   Do nulls, missing JSON paths, and negation keep consistent semantics?
-   Which patterns can be rewritten?
-   Which rows must reach RE2?
-   When does the candidate reduction from NGRAM justify the index?

Milvus 3.0 answers with a layered execution path. RE2 provides a predictable safety boundary. The parser recognizes simpler operations. The planner runs cheaper predicates first. Volnitsky and NGRAM conservatively reduce candidates. RE2 then verifies the remaining rows.

That makes regex filtering more than a call to a regular expression library inside a vector database. It makes structural patterns part of the same database execution model as vector search, scalar filters, JSON data, and indexed retrieval.

## Try regex filtering on your own workload — and the rest of Milvus 3.0

Regex filtering is available in Milvus 3.0. The [Pattern Matching guide](https://milvus.io/docs/pattern-matching.md) covers operator syntax, supported targets, raw strings, and matching semantics, while the [NGRAM guide](https://milvus.io/docs/ngram.md) explains which patterns the index can accelerate and how to configure it.

If you are evaluating the broader release of Milvus 3.0, check out:

-   Milvus 3.0 [launch blog](https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md)
-   Milvus 3.0 [release notes](https://milvus.io/docs/release_notes.md)
-   Milvus 3.0 feature blog: [Milvus Snapshots: Point-in-Time Collection Views Without Copying Data](https://milvus.io/blog/milvus-snapshots.md)
-   [Milvus GitHub repo](https://github.com/milvus-io/milvus)

## Come talk to us

-   Join the [Milvus Discord community](https://discord.com/invite/8uyFbECzPX) — the fastest way to get an answer from the people who built this.
-   Book a 20-minute [Milvus office hour](https://meetings.hubspot.com/chloe-williams1/milvus-meeting) if you want to walk through your own collection with an engineer.
