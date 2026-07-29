---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: Milvus 3.0発表：レイクネイティブなベクトル検索と、より強力な検索エンジン
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Milvus 3.0 のレイクネイティブなベクトル検索、ゼロコピー外部コレクション、より高速なスパース検索、スナップショット、Spark
  統合、高度なランキング機能をご覧ください。
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Today, we’re releasing Milvus 3.0, a major architectural milestone for the project. It changes both where Milvus can build and serve indexes and how much retrieval work can be done directly within the engine.</p>
<ul>
<li>Milvus 3.0 introduces <strong>a lake-native path</strong> for indexing vector data that lives in object storage and open table formats, including Parquet, Lance, Iceberg, and Vortex. Teams can make lake-resident data searchable without maintaining another copy in a vector database.</li>
<li><strong>This release also expands Milvus beyond initial candidate retrieval.</strong> Server-side sorting, aggregation, faceted search, StructArray for nested doc/chunk structure and ColBERT vectors, and a redesigned sparse index move more ranking, grouping, and result processing out of application code and into the retrieval engine.</li>
</ul>
<p>Together, these advances make Milvus the open-source foundation for production AI retrieval and for <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> architectures that combine lake-native storage with high-performance vector retrieval.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">A quick glance at the Milvus 3.0 feature set<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><table>
<thead>
<tr><th><strong>Area</strong></th><th><strong>Features</strong></th><th><strong>Why it matters</strong></th></tr>
</thead>
<tbody>
<tr><td>Lake-native retrieval</td><td>External Collections over Parquet, Lance, Iceberg, and Vortex</td><td>Search lake-resident data without maintaining a second serving copy</td></tr>
<tr><td>S3-based Storage</td><td>Loon (Storage v3)</td><td>Reduce point-read amplification for serving-style access and support schema evolution</td></tr>
<tr><td>Offline/batch workflows and recovery</td><td>Snapshots, Spark DataSource V2, and online schema evolution</td><td>Bring stable collection views into evaluation, deduplication, clustering, and feature pipelines</td></tr>
<tr><td>Retrieval engine</td><td>ORDER BY, aggregation, facets, StructArray, and improved sparse retrieval</td><td>Move more result processing and multi-vector scoring into Milvus</td></tr>
<tr><td>Data Model &amp; Operations</td><td>Nullable vectors, TEXT LOB, TTL, MinHash, Woodpecker, and ForceMerge</td><td>Support richer data models and production operating patterns</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">The lake-native infrastructure: index and serve data where it already lives<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>The biggest architectural change in Milvus 3.0 is where the system can build and serve indexes. Vector data can remain in open formats on object storage while Milvus provides production-grade indexing, retrieval, and APIs.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections: indexing directly on lake-resident data</h3><p>Many teams already store embeddings in a data lake — Lance tables, Iceberg tables, Parquet files, or other open-format datasets on S3, GCS, or Azure Blob Storage. Before Milvus 3.0, there were usually two options for searching that data.</p>
<ul>
<li>Copy the embeddings into a vector database. This provides low-latency search, but creates a second copy and an ETL pipeline that must remain synchronized.</li>
<li>Query the lake directly. This avoids duplication, but without ANN indexes, vector search becomes a brute-force scan that cannot meet production latency.</li>
</ul>
<p><strong>External Collections introduce a third path.</strong> You define a Milvus collection over data that remains in object storage, map external fields into a Milvus schema, and use the same search and query APIs as a native collection. The source files do not move; Milvus builds and serves vector, BM25 inverted, JSON, and scalar indexes over the external data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections are read-only and zero-copy</strong>, which makes them useful when governance, ownership boundaries, or operating cost require the source dataset to remain in the lake.</p>
<p>When the external dataset changes, Milvus reads its storage manifest and indexes newly added fragments instead of rebuilding the entire collection. A collection-level load mode also lets teams choose how much data to keep local:</p>
<table>
<thead>
<tr><th><strong>Load mode</strong></th><th><strong>Behavior</strong></th><th><strong>Best for</strong></th></tr>
</thead>
<tbody>
<tr><td>Take</td><td>Read from object storage on each query</td><td>Lowest storage cost; less latency-sensitive workloads</td></tr>
<tr><td>LazyLoad</td><td>Cache data on first access</td><td>Mixed workloads where hot data emerges over time</td></tr>
<tr><td>Load</td><td>Keep data resident</td><td>Lowest-latency serving</td></tr>
</tbody>
</table>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># register a lake table as a zero-copy Collection</span>
client.create_collection(
  name=<span class="hljs-string">&quot;docs&quot;</span>,
  external_source={<span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg&quot;</span>,  <span class="hljs-comment"># iceberg|lance|parquet|vortex</span>
                   <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;s3://lake/docs&quot;</span>},
  schema=[
    Field(<span class="hljs-string">&quot;id&quot;</span>,  INT64, primary=<span class="hljs-literal">True</span>, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>),
    Field(<span class="hljs-string">&quot;emb&quot;</span>, FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>),
    Field(<span class="hljs-string">&quot;title&quot;</span>, VARCHAR, external_field=<span class="hljs-string">&quot;title&quot;</span>)])

client.create_index(<span class="hljs-string">&quot;docs&quot;</span>, <span class="hljs-string">&quot;emb&quot;</span>, {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>})  <span class="hljs-comment"># in place</span>
client.load(<span class="hljs-string">&quot;docs&quot;</span>, mode=<span class="hljs-string">&quot;lazy&quot;</span>)  <span class="hljs-comment"># Take | LazyLoad | Load</span>
<button class="copy-code-btn"></button></code></pre>
<p>For governed environments, retrieval can run where the data is allowed to live. For large AI systems, a lake-resident dataset can support multiple retrieval deployments without a migration job between them.</p>
<p>External collections are an additive capability. Native Milvus collections remain the primary path for write-heavy, low-latency serving, while External Collections are designed for datasets whose system of record remains outside Milvus.</p>
<p>For more details, see <a href="https://milvus.io/docs/create-an-external-collection.md">Create an External Collection</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): Efficient Point Reads for Lake-Native Retrieval</h3><p>External Collections raise an obvious question: object storage is designed for scale and durability, but can it support the narrow point reads that follow an ANN search?</p>
<p><strong>The challenge is read amplification.</strong> Vector search commonly runs in two stages: an ANN index returns candidate IDs, and the system fetches selected fields for those candidates. Formats optimized for analytical scans can turn a narrow logical lookup into a much larger physical read.</p>
<p><strong>Milvus 3.0 addresses this problem with Loon, also known as Storage v3, a manifest-based columnar storage engine for S3-compatible object storage.</strong> Loon organizes fields into <code translate="no">ColumnGroups</code> with aligned row IDs, allowing scalar fields to favor filtering and scans while vectors and point-read-heavy fields use layouts designed for narrower lookups.</p>
<p>Loon keeps vector and inverted indexes separate from the file format rather than embedding them within it. Each dataset version is described by an immutable manifest that records its <code translate="no">ColumnGroups</code>, allowing the same indexing engine to work across Lance, Parquet, Iceberg, and Vortex.</p>
<p>The manifest design also makes schema evolution less disruptive. Adding or dropping a field can update metadata without rewriting existing columns. Filling a new field writes a new <code translate="no">ColumnGroup</code> while leaving existing <code translate="no">ColumnGroups</code> unchanged.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> is the default format for this path. It is an open, Arrow-compatible columnar format with flexible layouts and nested encodings that better match point-query-heavy AI data. In one internal benchmark using 3 million rows, 128-dimensional vectors, S3, and 256 concurrent readers, measured I/O per point read fell from about 9.4 MB for the Parquet baseline to 0.07 MB for Vortex with Loon, roughly 135 times less.</p>
<p>Milvus 3.0 does not make object storage behave like local memory. It reduces the read amplification that otherwise makes object storage impractical for serving-style point lookups. Predicate pushdown into the format and a local Vortex variant are next on the roadmap.</p>
<p><em>For more details, see our blog:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Why We Built Loon</em></a> <em>and the</em> <a href="https://github.com/vortex-data/vortex"><em>Vortex project</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots: point-in-time view without data copy</h3><p>Offline jobs need a consistent view of data even while production collections continue to receive writes. A Milvus snapshot is a point-in-time, read-only view that records references to existing data, index, and metadata files instead of copying the full dataset.</p>
<p>That makes snapshots inexpensive enough to create before risky operations such as a model swap, re-embedding job, or schema migration. Restoring a snapshot can reuse existing data and index files through server-side copy in object storage rather than reimporting every row and rebuilding every index. This feature is particularly useful for fast-moving workloads like AI agents, where data changes constantly, and you want frequent, cheap recovery points rather than occasional heavy backups.</p>
<p>The same frozen view can support evaluation, deduplication, backfill validation, and isolated testing while the live collection continues to accept writes. The snapshot stabilizes the logical input, although the workloads may still share infrastructure such as object storage and network bandwidth.</p>
<p>Snapshots do not replace backups. A snapshot references files owned by the live collection and is best suited to logical recovery, cloning, and short-lived stable views. A backup creates an independent copy for long-term retention and disaster recovery.</p>
<p>For more information, see <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Manage Snapshots</a>, and <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot Use Cases</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Spark connector: connect Milvus to batch workflows</h3><p>A stable snapshot is only useful if batch engines can read it. Milvus 3.0 exposes Milvus as a Spark DataSource V2, allowing Spark, Databricks, and EMR jobs to read from and write to Milvus as part of standard batch pipelines.</p>
<p>This feature matters because AI data workflows are iterative: deduplication feeds re-embedding, clustering feeds evaluation, and evaluation produces curated training or serving sets. A stable snapshot provides those jobs with consistent input, while the live collection keeps serving. With the Spark connector, the sink of one job becomes the source of the next, without exporting a full collection out of Milvus each time.</p>
<p>Milvus 3.0 also introduces vector-native batch operators for tasks such as deduplication, anomaly detection, and clustering, keeping compute-heavy work outside the online query path while operating directly on vector data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Online schema changes and backfill</h3><p>A schema rarely stays static in production — teams add new embedding models, sparse vectors, labels, metadata fields, and retention policies over time. Milvus 3.0 lets them add, fill, and drop columns while serving continues, instead of the disruptive rebuilds this used to require.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Adding or dropping a column does not require rewriting existing data. <code translate="no">client.add_collection_field(...)</code> lands a new nullable column without taking the collection offline, and <code translate="no">client.drop_collection_field(...)</code> removes a deprecated or experimental field at runtime. Neither one rewrites the existing data — each is a change to the collection’s manifest rather than to the data files, which is why there is no rebuild.</p>
<p>Milvus 3.0 supports two backfill paths:</p>
<ul>
<li><strong>Inner backfill</strong> (in 3.0) is for values derived from existing fields. Milvus can generate a BM25 sparse vector from a text column within the kernel, eliminating the need for a client-side encoder when building dense-plus-sparse hybrid retrieval.</li>
<li><strong>External backfill</strong>(on the roadmap) will be for values computed outside Milvus: take a snapshot, run Spark against the consistent view, compute a new column, write the values back, and let Milvus update the index incrementally. This is the intended path for large re-embedding jobs — for example, adding a new embedding column across hundreds of millions of rows while writes continue.</li>
</ul>
<p>Together, online schema changes and backfill make it easier to evolve retrieval pipelines without rebuilding an entire collection every time the data model changes.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">A More Powerful Engine for End-to-End Retrieval<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Milvus has long supported more than dense ANN search, including BM25-based sparse retrieval and hybrid search. Milvus 3.0 extends the engine along a different axis: it brings more of the multi-stage retrieval pipeline into Milvus itself, reducing over-fetching, duplicated application logic, and reliance on separate post-processing services.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. Server-side ORDER BY: sort inside the engine, per segment</h3><p>Sorting previously required applications to over-fetch candidates, move them to the client, and sort them there. That consumed bandwidth and made the final result dependent on where client-side truncation occurred.</p>
<p><strong>Milvus 3.0 adds server-side ORDER BY</strong>, which lets query workloads sort filtered rows by scalar fields such as rating, price, freshness, inventory, or timestamp.</p>
<ul>
<li>On the query path, each segment sorts its filtered result set, query nodes merge those streams, and the proxy returns the requested slice.</li>
<li>On the search path, ORDER BY sorts the ANN candidate set within Milvus, reducing client-side over-fetching and duplicate post-processing. It does not change the recall boundary established by the ANN candidates.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>This is especially useful for searches that combine relevance with business or user-facing constraints such as rating, price, freshness, inventory, or timestamp.</p>
<p>For more information, refer to <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Sort Search Results by Scalar Fields</a> and <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Sort Query Results</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Aggregation and faceted search</h3><p>Milvus 3.0 adds query-side aggregation with operations such as count, sum, average, minimum, and maximum, grouped by one or more scalar fields. This removes a common pattern where teams pull filtered rows into client code just to count, group, or compute simple statistics.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 also adds <strong>search aggregation</strong> for faceted search. After an ANN search, Milvus groups the retrieved hits by a field and returns bucket counts, aggregate statistics, and top-N sample hits per bucket — the pattern behind grouping by brand, price range, color, tenant, or document type. One caveat: search aggregation operates over the ANN-retrieved result set, not the whole collection, so facet counts are approximate. When you need exact counts, use query-side aggregation.</p>
<p>For more information, refer to <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Aggregate Query Results</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray for Nested Vectors and Late-Interaction Model</h3><p>Many entities are naturally represented by multiple vectors. A long document is a series of chunks; a video is a sequence of frames you would rather keep together in one row than scatter across many; a product has several images or angles. Late-interaction models push this even further — ColBERT emits one vector per token, ColPali one per visual patch. In every case, the unit you actually want to store and search for is the whole entity, not each fragment on its own.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> allows a Milvus row to contain a variable-length array of structured elements, including multiple vectors, while preserving a single entity ID and a single set of metadata. That avoids splitting a document into multiple rows and duplicating labels, permissions, or other fields across fragments.</p>
<p>Milvus supports two search granularities.</p>
<ul>
<li><strong>Element-level search</strong> matches one query vector against each element in the list and returns the specific matching element with its offset. This is useful when you want to know which chunk, token, patch, or image matched. A row can appear more than once if multiple elements match.</li>
<li><strong>Entity-level search</strong> compares a query’s full vector list against the row’s vector list using <code translate="no">MAX_SIM</code>, with the <code translate="no">MAX_SIM_COSINE</code> metric. Each query token takes its best match in the document, and those best scores are summed. This gives Milvus native support for late-interaction retrieval patterns such as ColBERT and ColPali while keeping one row per document.</li>
</ul>
<p>Indexing every token vector can be expensive; so Milvus 3.0 adds multiple acceleration paths, including TokenANN, Muvera, and Lemur, which trade index size, training cost, and recall.</p>
<table>
<thead>
<tr><th>Strategy</th><th>Stage-one representation</th><th>Cost profile</th><th>Best for</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Every token vector is indexed.</td><td>Highest, exact</td><td>High-discrimination models and short documents</td></tr>
<tr><td>Muvera</td><td>One vector per document using random-projection FDE.</td><td>Medium, no training</td><td>Long documents</td></tr>
<tr><td>Lemur</td><td>One vector per document using learned MLP compression</td><td>Lowest, requires training</td><td>Low-discrimination models and visual or patch vectors</td></tr>
</tbody>
</table>
<p>In our benchmarks, Lemur matches or beats TokenANN recall on most datasets while collapsing each document to a single vector; the exception is corpora with high length variance, where TokenANN or another strategy is safer.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>For corpora larger than memory, Milvus also supports a <code translate="no">DISKANN</code> index that keeps embedding lists on disk to reduce RAM pressure.</p>
<p>Element-level search has already arrived in Milvus 2.6. Filtering for Muvera, Lemur, and StructList is new in 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. BM25 Index Compression and SINDI</h3><p>Milvus has supported sparse vector search in earlier releases. Milvus 3.0 reduces the sparse-index footprint through block-compressed postings (VByte-related algorithms plus SIMD decoding) and quantization (fp16 for inner products, u16 for BM25).</p>
<p>Across one set of internal BM25 benchmarks, the new implementation was roughly 3 times smaller than the Milvus 2.6 sparse index at comparable recall. A smaller index reduces memory and bandwidth pressure and can improve speed in workloads limited by data movement.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 also introduces <a href="https://arxiv.org/abs/2509.08395">SINDI</a>, a new sparse retrieval algorithm optimized for learned sparse embeddings such as SPLADE. Because these embeddings produce denser posting lists than BM25, pruning-heavy search algorithms can spend substantial CPU time deciding what to skip. SINDI instead organizes postings into compact windows and uses SIMD-friendly score accumulation to process them efficiently, while preserving retrieval accuracy through lossless pruning.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We also extended SINDI beyond its original design to include native BM25 support, enabling Milvus to use the same optimized sparse retrieval path for both learned sparse embeddings and traditional full-text search.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In our benchmarks across 4 SPLADE sparse vector datasets, SINDI reaches up to about 10x the QPS of MaxScore on learned-sparse vectors, with a worst-case of around 5x.</p>
<p>SINDI is the default for sparse inner-product search in Milvus 3.0.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">Other Enhancements<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><ul>
<li><strong>TEXT LOB:</strong> Stores long source text beside vectors. Text under 64 KB remains inline; larger values use a Vortex LOB reference.</li>
<li><strong>Expanded dense index support:</strong> Adds more index choices within the Faiss family, including SVS, Panorama, PQ, IVFPQ, and ScaNN, for different scale, memory, and recall requirements.</li>
<li><strong>MinHash and near-duplicate search:</strong> Generates MinHash signatures on the server side and retrieves near-duplicate candidates using MINHASH_LSH.</li>
<li><strong>Nullable vectors and new types:</strong> Allows vector fields to be NULL and adds TIMESTAMPTZ for time-aware filtering and retention policies.</li>
<li><strong>Custom full-text dictionaries:</strong> Registers dictionaries, synonyms, and stop-word resources on the cluster for multilingual and domain-specific tokenization.</li>
<li><strong>Standalone Woodpecker:</strong> Runs the Milvus write-ahead log as an independently scalable and observable service.</li>
<li><strong>Entity</strong> <strong>TTL****:</strong> Expires individual records through a TIMESTAMPTZ field, with MVCC filtering followed by garbage collection during compaction.</li>
<li><strong>ForceMerge:</strong> Compacts small segments to a target size and rebuilds indexes to reduce read amplification before sustained read-heavy service.</li>
<li>And more</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Get started with Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Milvus 3.0 is available today under the Apache 2.0 license and remains an LF AI &amp; Data project. To get started:</p>
<ul>
<li>Read the <a href="https://milvus.io/docs/release_notes.md">release notes</a> and the <a href="https://milvus.io/docs/quickstart.md">quickstart</a>, and get the source at <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Join the <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a> or book a <a href="https://milvus.io/office-hours">Milvus Office Hours</a> session to talk through your use case with the maintainers.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 and Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Milvus 3.0 lays the open-source foundation for production AI retrieval and the emerging <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> architecture, which combines lake-native storage with high-performance vector retrieval on a single source of truth, each at the right cost.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> is a fully managed Vector Lakebase built by the team behind Milvus. It shares the same distributed, lake-native architecture as Milvus and is fully compatible with the Milvus API. Powered by its proprietary Cardinal indexing engine, Zilliz Cloud delivers up to 10× better price-performance than standard open-source indexing approaches while eliminating the operational complexity of managing infrastructure. Enterprise capabilities include scale-to-zero compute, cross-region disaster recovery, BYOC deployment, enterprise-grade security and compliance (SOC 2, HIPAA, ISO 27001, and GDPR), and up to a 99.99% SLA.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Developers can deploy Milvus as an open-source vector database or use <a href="https://zilliz.com/">Zilliz Cloud</a> for a managed platform across multiple workloads throughout the AI data lifecycle.</p>
<h2 id="What-comes-next" class="common-anchor-header">What comes next<button data-href="#What-comes-next" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>The Milvus roadmap builds on the 3.0 architecture with predicate pushdown for External Collections, external backfill, additional Spark operators, and support for more table formats, including Delta Lake and Apache Paimon.</p>
<p>The larger direction is clear: AI data systems need a tighter loop between online retrieval and offline data improvement. Vector data should not have to be copied into separate systems every time teams want to search, analyze, improve, or serve it.</p>
