# From Retrieval to Structured Results: Aggregation and `ORDER BY` in Milvus 3.0

Consider a familiar product-search flow. A shopper uploads a photo of a dress, and vector search retrieves a relevant candidate set from a catalog containing tens of millions of products.

The page, however, needs more than a ranked list. It needs brand facets. It needs a price sort. The merchandising team wants to know which brands dominate this result set, the price range inside each brand, and a few representative products from every group.

Before Milvus 3.0, applications commonly handled that second step themselves: fetch rows from Milvus, group and sort them in pandas or a service layer, and then assemble the response. Some teams maintained a separate analytics pipeline solely to compute counts and distributions over data that was already in the vector database.

The vector database found the candidates; the application had to turn them into a structured result.

Milvus 3.0 moves more of that work into the retrieval engine. It adds three related but distinct capabilities:

- **Query aggregation** computes `count`, `sum`, `avg`, `min`, and `max` over filtered, visible rows, with optional `GROUP BY` fields.

- **Search Aggregation** organizes retained approximate nearest neighbor (ANN) candidates into buckets, computes per-bucket metrics, builds nested buckets, and returns representative hits.

- **Server-side `ORDER BY`** sorts query results or ANN candidates by one or more scalar fields before the application receives them.

The distinction between query and search matters:

| Capability | Data being summarized or ordered | Primary result shape | Exactness boundary |
|---|---|---|---|
| Query aggregation | All visible rows that match the filter | One row per group, with aggregate values | Exact over the query's visible row set |
| Search Aggregation | Candidates retained by ANN search and the grouping stage | Buckets, metrics, representative hits, and optional child buckets | Approximate by design |
| Query `ORDER BY` | Visible rows that match the filter | Sorted rows | Exact over the filtered query result |
| Search `ORDER BY` | ANN candidates | Sorted search hits or groups | Does not expand the ANN recall boundary |

This article explains why these operations belong inside the database, how distributed aggregation works, how Search Aggregation differs from Grouping Search, and where the new semantics stop.

## Why application-side post-processing breaks down

Moving aggregation and sorting to the application can look like a small implementation choice. At scale, it creates three larger problems.

### The application moves far more data than the answer contains

Suppose an operations dashboard needs the product count and average price for every category among two million in-stock rows. Even with a rough payload of only 100 bytes per row for the category, price, primary key, and serialization overhead, the application must receive about 200 MB of data before it can calculate the result.

If the catalog has 200 categories, the answer is only a few hundred keys and numbers—on the order of kilobytes. The application moves several orders of magnitude more data than it returns, pays the same cost on every refresh, and needs enough client memory to hold or stream the intermediate rows.

An in-engine aggregation changes the unit of data movement. Raw rows stay where they are. What crosses nodes and eventually leaves Milvus is the much smaller set of partial and final group states.

### Page-local sorting is not global sorting

Sorting after pagination is a correctness bug, not merely an inefficient implementation.

If an application fetches rows 11 through 20 and sorts only those rows by price, it has produced the price order inside that page—not rows 11 through 20 of the globally price-sorted result. A later page can contain products cheaper than every product on the first page.

The same boundary matters in vector search. Fetching a small Top-K set and sorting it in the application can reorder only those candidates. It cannot recover relevant candidates that the ANN stage did not return, and it often leads applications to over-fetch just to make the client-side sort useful.

Server-side sorting gives Milvus control over the ordering and pagination sequence. For query workloads, the engine sorts the filtered row set before it applies the page window. For search workloads, it sorts within the ANN candidate boundary and keeps that limitation explicit.

### The client cannot reproduce database visibility

Aggregation also depends on which rows are visible at the query timestamp. Deletes, expired entities, and concurrent writes are governed by Milvus' multiversion concurrency control (MVCC) and consistency semantics.

Once raw rows leave the database, the application usually assumes that the received batch represents the correct snapshot. Reconstructing the same visibility rules in a client is impractical, especially while the collection is receiving writes and deletes.

The common workaround—a second analytics engine fed by export and ETL—adds another copy of the data, another consistency boundary, and another pipeline to operate. Counts, metrics, and sorting should run where both the data and its visibility rules already exist.

## Query aggregation: exact statistics over visible rows

Query aggregation answers questions such as:

- How many in-stock products are in each category?
- What is the average price per brand?
- What are the minimum and maximum event timestamps for each host?
- How many records remain after a filter and TTL visibility are applied?

The API looks familiar to anyone who has used SQL: pass one or more fields in `group_by_fields`, then place aggregation expressions in `output_fields`.

```python
res = client.query(
    collection_name="products",
    filter='status == "on_sale"',
    group_by_fields=["category"],
    output_fields=["category", "count(*)", "avg(price)"],
)

# [
#     {"category": "books", "count(*)": 18734, "avg(price)": 45.3},
#     ...
# ]
```

The syntax is the simple part. The execution model is what makes the result useful in a distributed vector database.

### Segment-local states replace raw-row movement

A Milvus collection can span hundreds or thousands of segments distributed across several query nodes, with recently written data still on the streaming path. No single execution node starts with every visible row.

Milvus therefore pushes aggregation down to the segments:

1. Each segment applies the filter and MVCC visibility rules locally.
2. The segment emits one partial state per group instead of its matching rows.
3. Partial states are merged within a query node.
4. The proxy performs the final cross-node merge and returns the completed groups.

The amount of intermediate data now scales with the number of groups and aggregate states, rather than directly with the number of matching rows.

The merge operation depends on the aggregate:

| Aggregate | Partial state | Merge rule |
|---|---|---|
| `count` | Partial count | Add counts |
| `sum` | Partial sum | Add sums |
| `min` | Partial minimum | Take the minimum |
| `max` | Partial maximum | Take the maximum |
| `avg` | Partial sum and count | Add both states, then divide once at the final stage |

`avg` is the instructive case. Averaging two partial averages is incorrect when the partitions contain different numbers of rows. Milvus carries `sum` and `count` independently and computes the final average only after both have been merged globally.

This is one reason aggregation belongs in the database: the operation is not simply “run the same function on several batches.” The engine must preserve the algebra of each aggregate across segment and node boundaries.

### Visibility is applied before aggregation

Deleted and expired rows are removed from the partial states at the segment level according to the query's visibility boundary. They do not travel upward and then get corrected in the application.

The result therefore describes the rows Milvus considers visible for that request, not an arbitrary collection of batches pulled at slightly different times.

### `limit` now counts groups

In a normal query, `limit` controls how many entity rows are returned. In a grouped query, it controls how many groups are returned. Because the result cardinality is determined by groups rather than matching rows, a query aggregation can also omit `limit` when it needs every group.

This sounds like a small API detail, but it reflects a different result model: the output is no longer a page of entities. It is a relation whose rows represent groups.

## Search Aggregation: a bucketed view of ANN candidates

Query aggregation answers, “What do the visible rows matching this filter look like?” Search Aggregation asks a different question: “What does the candidate set retrieved for this vector look like?”

That operation has no exact SQL equivalent. ANN search first establishes a similarity-driven candidate boundary. Milvus then organizes retained candidates by scalar keys and returns a bucket tree instead of an ordinary flat hit list.

A bucket can contain:

- a key such as `brand` or a composite key such as `(brand, color)`;
- a retained-candidate count;
- metrics including `count`, `sum`, `avg`, `min`, and `max`;
- representative entities selected with `top_hits`; and
- a nested `sub_aggregation` that creates child buckets.

For the product-search page, one request can return brand buckets, the average price inside each bucket, and three representative products per brand:

```python
from pymilvus import SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=["brand"],
    size=10,                                    # Return up to 10 brand buckets
    metrics={"avg_price": {"avg": "price"}},
    order=[{"_count": "desc"}],               # Order by retained-candidate count
    top_hits=TopHits(
        size=3,
        sort=[{"_score": "desc"}],            # Use "asc" for L2 distance
    ),
)

res = client.search(
    collection_name="products",
    data=[query_vector],
    anns_field="embedding",
    search_aggregation=aggregation,
    output_fields=["title", "brand", "price"],
)

buckets = res.agg_buckets[0]
```

When `search_aggregation` is set, the ordinary hit list is empty. The application reads the bucket response from `result.agg_buckets`.

### The aggregation specification sets two different bounds

Search Aggregation does not run `GROUP BY` over every entity in the collection, and it does not simply take an ordinary Top-K response and aggregate that flat list.

Its execution has three stages:

1. Milvus runs ANN search to retrieve candidates near the query vector.
2. The grouping stage retains a bounded number of candidates for each full bucket key.
3. Milvus builds buckets, calculates metrics over the retained candidates, orders the buckets, and attaches representative hits or child buckets.

Two parameters control different parts of the result:

- `SearchAggregation.size` limits how many buckets are returned at that aggregation level.

- The largest `TopHits.size` anywhere in the aggregation tree sets the retained-candidate budget for each full composite key. If the request contains no `top_hits`, the per-key budget defaults to one.

The top-level search `limit` does not control this mode and is ignored when `search_aggregation` is present.

That distinction is essential when reading a bucket's `count` or metrics. With `TopHits(size=3)`, a brand bucket can summarize at most three retained candidates for its full key, even if the collection contains thousands of relevant products from that brand. Increasing `TopHits.size` widens the per-key metric window, but it does not turn ANN search into an exact scan.

If the application needs exact statistics over every visible row matching a filter, it should use query aggregation. Search Aggregation is for describing and comparing the candidates produced by similarity retrieval.

## Search Aggregation and Grouping Search solve different problems

Milvus has supported Grouping Search since the 2.4 line. It is easy to see the word “grouping” in both features and assume they are two interfaces for the same operation. Their output contracts are different.

Grouping Search changes which entities appear in a ranked result list. A common RAG pattern stores chunks as individual entities, groups them by `doc_id`, and returns one or a few chunks from each document. The primary output remains ordinary search hits, but with fewer repeated values from the grouping field.

Search Aggregation returns a statistical view. The primary output is a bucket tree containing keys, counts, metrics, representative hits, and optional child buckets.

| Application needs | Prefer | Consume |
|---|---|---|
| A ranked entity list with greater diversity across a field | Grouping Search | Ordinary search hits |
| Facet counts, per-group metrics, representative hits, or nested distributions | Search Aggregation | `AggregationBucket` objects in `result.agg_buckets` |

A practical rule is to start from the UI or API response shape. If the application renders a list, Grouping Search is usually the right primitive. If it renders facets, distribution cards, or a hierarchy of groups, use Search Aggregation.

The two modes are mutually exclusive in one request because they define different primary result shapes.

## `ORDER BY`: move sorting before the application boundary

Sorting is the least exotic feature in this release and one of the easiest to implement incorrectly outside the engine.

Milvus 3.0 exposes sorting on both query and search, but the two paths use different SDK parameters and operate over different input sets.

### Query sorting orders the filtered row set

PyMilvus query uses `order_by`, expressed as a list of `"field:direction"` strings. The engine applies the filter, orders the visible rows, and then applies `limit` and `offset`.

```python
res = client.query(
    collection_name="products",
    filter='category == "books"',
    output_fields=["title", "price"],
    order_by=["price:desc", "title:asc"],
    limit=10,
    offset=10,  # Rows 11-20 in the filtered, price-sorted result
)
```

This makes query useful for business-ordered browsing: newest ingested records, highest-priced products inside a filter, lowest inventory, or extreme values for data inspection. Without server-side ordering, applications had to retrieve rows first and could not define a reliable business order across pages.

For nullable query fields, ascending order places nulls last and descending order places them first. A sort field does not have to appear in `output_fields`; include it only when the application needs the value in the response.

### Search sorting reorders the ANN candidate set

PyMilvus search uses `order_by_fields`, where each entry names a scalar field and direction:

```python
res = client.search(
    collection_name="products",
    data=[query_vector],
    anns_field="embedding",
    limit=50,
    output_fields=["title", "price"],
    order_by_fields=[
        {"field": "price", "order": "asc"},
    ],
)
```

ANN still determines which entities become candidates. `order_by_fields` changes how those candidates are returned; it does not make the search globally scan the collection for the cheapest products.

That boundary gives the two APIs distinct jobs:

- Use query plus `order_by` when the scalar order itself defines the result, such as the ten cheapest in-stock products.

- Use search plus `order_by_fields` when semantic or vector relevance defines the candidate set and a scalar field determines how those candidates should be presented.

Multi-field sorting applies keys in list order. When search candidates have the same values for every specified scalar key, Milvus preserves their original similarity-score order.

Sorting also composes with Grouping Search. Milvus orders groups by the configured scalar value from each group's top entity while retaining the grouped result shape. This is useful when the application wants both diversity across a field and a business-relevant group order.

## What these capabilities make possible

The APIs are general database primitives, but several retrieval workloads benefit immediately.

### RAG and agents: inspect retrieval concentration

A RAG system can bucket retrieved chunks by source document, product line, tenant, or content type. A result concentrated in two documents carries a different coverage signal from one spread across dozens of sources.

That distribution is not a guarantee of answer quality. It is, however, a useful retrieval diagnostic that an application or agent can combine with scores, citations, and other checks when deciding whether to broaden the query, retrieve again, or ask for clarification.

Grouping Search remains the right choice when the goal is simply to diversify the returned chunks. Search Aggregation is useful when the system needs the distribution itself.

### E-commerce and content recommendation: return facets with the search

The opening product-search page can receive brand buckets, price metrics, representative items, and a scalar-sorted candidate list from Milvus. The application still controls presentation and business logic, but it no longer needs to reconstruct basic bucket semantics from exported hits.

### Logs and security: combine similarity with incident distribution

Similarity search can find events related to a suspicious log line. Search Aggregation can then show which hosts dominate those candidates, the minimum and maximum timestamp in each host bucket, or how the candidates divide across severity and service.

The result remains a view of retrieved candidates rather than an exact global incident count. When the investigation needs exact counts over every event matching a filter, query aggregation provides that second path.

### Operations and data exploration: calculate instead of export

Dashboards and administrative tools can run exact counts and averages over filtered rows, then browse the underlying entities in a defined scalar order. That removes many one-off “export, calculate, and sort” utilities without pretending that Milvus has become a full analytical database.

## Boundaries: what aggregation and `ORDER BY` do not replace

These features extend the retrieval engine; they do not turn Milvus into an online analytical processing (OLAP) system.

- Query aggregation supports grouping plus `count`, `sum`, `avg`, `min`, and `max`. It does not add joins, window functions, or complex subqueries. Large offline analytical jobs still belong in systems such as Spark, which can work with Milvus 3.0 snapshots and shared storage paths.

- Query group keys support integer, `VARCHAR`, and `TIMESTAMPTZ` fields. Search Aggregation bucket keys additionally support Boolean fields. Floating-point, vector, JSON, and array values are not bucket keys.

- For Search Aggregation, `count` accepts `"*"` or a non-JSON, non-dynamic source; `sum` and `avg` require numeric sources; and `min` and `max` also support string and `TIMESTAMPTZ` sources. Query aggregation follows the same arithmetic type boundaries. Consult the API guide before applying an aggregate to a complex field type.

- Query aggregation can order grouped output by group keys, while ordering by a computed aggregate such as `count(*)` remains a current boundary. Without an explicit order, group order is not guaranteed.

- Search Aggregation cannot currently be combined with Hybrid Search, Grouping Search, Search Iterators, a non-zero offset, or highlighting in the same request.

- Search Aggregation counts and metrics describe retained ANN candidates, not the complete collection and not every entity that might be semantically relevant.

- Search `ORDER BY` changes candidate presentation. It does not repair missed ANN candidates or convert similarity retrieval into an exact scalar Top-N query.

The cleanest way to choose among the new primitives is to start with the question:

- For exact statistics over filtered visible rows, use query aggregation.

- For a distribution over similarity-retrieval candidates, use Search Aggregation.

- For a diverse ranked list, use Grouping Search.

- For a defined scalar order, use query or search `ORDER BY` according to which path established the result set.

## From candidate lists to structured results

Vector databases have traditionally optimized one question: which K entities are nearest to this vector?

Production retrieval systems ask follow-up questions immediately. Which groups dominate the result? What are their counts and ranges? Which examples represent each group? In what business order should the application present the rows or candidates?

Milvus 3.0 brings those operations into the same engine that owns the data, the ANN candidate boundary, and the visibility semantics. Query aggregation performs exact distributed reduction over visible rows. Search Aggregation builds a bucketed view over retained ANN candidates. `ORDER BY` gives query and search paths a server-side scalar order without asking the application to reconstruct it page by page.

The result is not an OLAP engine hidden inside a vector database. It is a retrieval engine that can return more of the structure applications actually need.

## Try aggregation and `ORDER BY` in Milvus 3.0

Milvus 3.0 is available now. Use the [Query guide](https://milvus.io/docs/get-and-scalar-query.md) for exact aggregation and query sorting, the [Search Aggregation guide](https://milvus.io/docs/search-aggregation.md) for bucket semantics and limits, the [Basic Vector Search guide](https://milvus.io/docs/single-vector-search.md) for search sorting, and the [Grouping Search guide](https://milvus.io/docs/grouping-search.md) when your primary goal is result diversity.

For the broader release, see the [Milvus 3.0 launch blog](https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md), [Milvus 3.0 release notes](https://milvus.io/docs/release_notes.md), and the [milvus-io/milvus repository](https://github.com/milvus-io/milvus).

If you want to evaluate the same APIs without operating the cluster yourself, try them on [Zilliz Cloud](https://cloud.zilliz.com). The current [Zilliz Cloud query reference](https://docs.zilliz.com/reference/python/python/Vector-query) and [search reference](https://docs.zilliz.com/reference/python/python/Vector-search) describe availability and parameters for managed cluster types.

To discuss a workload or an edge case with the team, join the [Milvus Discord community](https://discord.com/invite/8uyFbECzPX) or book a [Milvus Office Hours session](https://meetings.hubspot.com/chloe-williams1/milvus-meeting).

---

# Publishing Metadata (Not for Publication)

- **Meta title:** Milvus 3.0 Aggregation and ORDER BY for Query and Search
- **Meta description:** Milvus 3.0 adds exact query aggregation, bucket-based search aggregation, and server-side sorting so applications can group, measure, and order retrieval results inside the engine.
- **Meta keywords:** Milvus 3.0, query aggregation, search aggregation, ORDER BY, vector search
- **URL slug:** `milvus-3-0-aggregation-order-by.md`

# Editorial Note (Not for Publication)

## Rewrite decision

**Level 2: selective restructuring.** The Chinese draft already had a coherent engineering argument, a strong e-commerce example, distributed aggregation mechanics, API samples, use cases, limitations, and a conclusion. A full reconstruction would have replaced a sound article. The rewrite preserves that technical spine while separating concepts whose semantics differ in Milvus 3.0.

**Primary reader:** search, database, and AI-infrastructure engineers—especially existing Milvus users—deciding when in-engine aggregation and sorting can replace application-side post-processing, and what exactness boundary each API provides.

## Material editorial changes

- Preserved the draft's central premise, data-movement example, distributed partial-aggregation model, `avg = sum + count` explanation, MVCC visibility point, Search Aggregation mechanics, Grouping Search comparison, every source PyMilvus workflow, four workload categories, and feature boundaries.

- Introduced an early comparison table so query aggregation, Search Aggregation, query `ORDER BY`, and search `ORDER BY` are not presented as one undifferentiated feature.

- Corrected the PyMilvus query sorting example from `order_by_fields=[{...}]` to `order_by=["field:direction"]`. The source search example continues to use `order_by_fields`, which is the current PyMilvus search API.

- Reworked the Search Aggregation explanation around the current documented model: `SearchAggregation.size` limits returned buckets, while the largest `TopHits.size` sets the per-key retained-candidate budget. Removed the implication that simply increasing the bucket count makes metrics approach full-collection statistics.

- Clarified that search sorting reorders ANN candidates and does not expand the ANN recall boundary. Query sorting is the path for exact scalar Top-N over a filtered row set.

- Softened the RAG claim that source concentration predicts answer reliability. The final treats it as one retrieval diagnostic rather than a correctness signal.

- Removed the opening's unsourced “tens of milliseconds” performance figure because it had no index, hardware, recall, or workload setup. The catalog scale remains illustrative rather than benchmark-like.

- Added a current release CTA, official documentation links, a supported managed-service path through Zilliz Cloud, and community contact options.

- Code was cross-checked against the current public documentation but was not executed against a live Milvus 3.0 cluster.

## External source map

| Externally checked or added fact | Primary source |
|---|---|
| PyMilvus query `order_by` syntax, pagination order, nullable-query defaults, grouping expressions, group-key types, and metric types | [Milvus Query documentation](https://milvus.io/docs/get-and-scalar-query.md) |
| Search Aggregation response shape, retained-candidate model, `size`, `TopHits.size`, `limit` behavior, supported fields, and unsupported combinations | [Milvus Search Aggregation documentation](https://milvus.io/docs/search-aggregation.md) |
| PyMilvus search `order_by_fields` syntax and similarity-score tie behavior | [Milvus Basic Vector Search documentation](https://milvus.io/docs/single-vector-search.md) |
| Difference between ordinary grouped hits and bucket-oriented aggregation; ordering groups by the top entity's scalar value | [Milvus Grouping Search documentation](https://milvus.io/docs/grouping-search.md) |
| Milvus 3.0 release status and retrieval-engine feature context | [Milvus 3.0 release notes](https://milvus.io/docs/release_notes.md) and [Milvus 3.0 launch blog](https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md) |
| Managed query and search API paths | [Zilliz Cloud query reference](https://docs.zilliz.com/reference/python/python/Vector-query) and [Zilliz Cloud search reference](https://docs.zilliz.com/reference/python/python/Vector-search) |

## Claims to Verify Before Publication

| Claim or behavior | Why author or engineering confirmation is still needed |
|---|---|
| Segment-local partial aggregation, query-node merge, proxy final merge, and MVCC filtering at the lowest execution stage | These internal execution details come from the supplied engineering draft and are not fully specified in the public user documentation. Confirm them against the target 3.0.0 code path. |
| Query aggregation can order grouped output by group keys but not by computed aggregates such as `count(*)` | This boundary is stated in the supplied draft but is not clearly documented on the current public Query page. Confirm the final 3.0.0 behavior. |
| Search scalar ordering and offset always compose in the intended sequence, including tied similarity scores | GitHub issues [#49879](https://github.com/milvus-io/milvus/issues/49879) and [#49994](https://github.com/milvus-io/milvus/issues/49994) reported incorrect ordering in pre-release 3.0 builds. Confirm the exact fix status in the release image used for publication. |
| Search `ORDER BY` uses PostgreSQL-style null placement and supports explicit `nulls_first` / `nulls_last` in Milvus 3.0 | The source draft states this for search and query together, but current public search docs do not describe explicit null placement. GitHub issue [#49869](https://github.com/milvus-io/milvus/issues/49869) tracks the search behavior under a 3.1 milestone. The publishable article therefore states only the documented query behavior. |
| REST v2 and Go SDK expose every query/search aggregation and sorting option described by the server | SDK coverage changed during the 3.0 release cycle. Confirm the intended publication matrix and add language-specific examples only after testing those client versions. |
