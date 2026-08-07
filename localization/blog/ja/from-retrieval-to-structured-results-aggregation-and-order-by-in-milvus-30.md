---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: 検索から構造化された結果へ：Milvus 3.0 における集約と ORDER BY
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Milvus 3.0 がクエリ集計、Search Aggregation、サーバー側 ORDER BY
  を追加し、構造化された効率的なベクトル検索結果を実現する方法を学びましょう。
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>Consider a familiar product-search flow. A shopper uploads a photo of a dress, and vector search retrieves a relevant candidate set from a catalog containing tens of millions of products.</p>
<p>The page, however, needs more than a ranked list. It needs brand facets. It needs a price sort. The merchandising team wants to know which brands dominate this result set, the price range inside each brand, and a few representative products from every group.</p>
<p>Before Milvus 3.0, applications commonly handled that second step themselves: fetch rows from Milvus, group and sort them in pandas or a service layer, and then assemble the response. Some teams maintained a separate analytics pipeline solely to compute counts and distributions over data that was already in the vector database.</p>
<p>The vector database found the candidates; the application had to turn them into a structured result.</p>
<p>Milvus 3.0 moves more of that work into the retrieval engine. It adds three related but distinct capabilities:</p>
<ul>
<li><strong>Query aggregation</strong> computes <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, and <code translate="no">max</code> over filtered, visible rows, with optional <code translate="no">GROUP BY</code> fields.</li>
<li><strong>Search Aggregation</strong> organizes retained approximate nearest neighbor (ANN) candidates into buckets, computes per-bucket metrics, builds nested buckets, and returns representative hits.</li>
<li><strong>Server-side</strong> <code translate="no">**ORDER BY**</code> sorts query results or ANN candidates by one or more scalar fields before the application receives them.</li>
</ul>
<p>The distinction between query and search matters:</p>
<table>
<thead>
<tr><th>Capability</th><th>Data being summarized or ordered</th><th>Primary result shape</th><th>Exactness boundary</th></tr>
</thead>
<tbody>
<tr><td>Query aggregation</td><td>All visible rows that match the filter</td><td>One row per group, with aggregate values</td><td>Exact over the query’s visible row set</td></tr>
<tr><td>Search Aggregation</td><td>Candidates retained by ANN search and the grouping stage</td><td>Buckets, metrics, representative hits, and optional child buckets</td><td>Approximate by design</td></tr>
<tr><td>Query <code translate="no">ORDER BY</code></td><td>Visible rows that match the filter</td><td>Sorted rows</td><td>Exact over the filtered query result</td></tr>
<tr><td>Search <code translate="no">ORDER BY</code></td><td>ANN candidates</td><td>Sorted search hits or groups</td><td>Does not expand the ANN recall boundary</td></tr>
</tbody>
</table>
<p>This article explains why these operations belong inside the database, how distributed aggregation works, how Search Aggregation differs from Grouping Search, and where the new semantics stop.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">Why application-side post-processing breaks down<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>Moving aggregation and sorting to the application can look like a small implementation choice. At scale, it creates three larger problems.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">The application moves far more data than the answer contains</h3><p>Suppose an operations dashboard needs the product count and average price for every category among two million in-stock rows. Even with a rough payload of only 100 bytes per row for the category, price, primary key, and serialization overhead, the application must receive about 200 MB of data before it can calculate the result.</p>
<p>If the catalog has 200 categories, the answer is only a few hundred keys and numbers—on the order of kilobytes. The application moves several orders of magnitude more data than it returns, pays the same cost on every refresh, and needs enough client memory to hold or stream the intermediate rows.</p>
<p>An in-engine aggregation changes the unit of data movement. Raw rows stay where they are. What crosses nodes and eventually leaves Milvus is the much smaller set of partial and final group states.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">Page-local sorting is not global sorting</h3><p>Sorting after pagination is a correctness bug, not merely an inefficient implementation.</p>
<p>If an application fetches rows 11 through 20 and sorts only those rows by price, it has produced the price order inside that page—not rows 11 through 20 of the globally price-sorted result. A later page can contain products cheaper than every product on the first page.</p>
<p>The same boundary matters in vector search. Fetching a small Top-K set and sorting it in the application can reorder only those candidates. It cannot recover relevant candidates that the ANN stage did not return, and it often leads applications to over-fetch just to make the client-side sort useful.</p>
<p>Server-side sorting gives Milvus control over the ordering and pagination sequence. For query workloads, the engine sorts the filtered row set before it applies the page window. For search workloads, it sorts within the ANN candidate boundary and keeps that limitation explicit.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">The client cannot reproduce database visibility</h3><p>Aggregation also depends on which rows are visible at the query timestamp. Deletes, expired entities, and concurrent writes are governed by Milvus’ multiversion concurrency control (MVCC) and consistency semantics.</p>
<p>Once raw rows leave the database, the application usually assumes that the received batch represents the correct snapshot. Reconstructing the same visibility rules in a client is impractical, especially while the collection is receiving writes and deletes.</p>
<p>The common workaround—a second analytics engine fed by export and ETL—adds another copy of the data, another consistency boundary, and another pipeline to operate. Counts, metrics, and sorting should run where both the data and its visibility rules already exist.</p>
<p>Now, let’s take a look at what Milvus 3.0 offers.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">Query aggregation: exact statistics over visible rows<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>Query aggregation answers questions such as:</p>
<ul>
<li>How many in-stock products are in each category?</li>
<li>What is the average price per brand?</li>
<li>What are the minimum and maximum event timestamps for each host?</li>
<li>How many records remain after a filter and TTL visibility are applied?</li>
</ul>
<p>The API looks familiar to anyone who has used SQL: pass one or more fields in <code translate="no">group_by_fields</code>, then place aggregation expressions in <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>The syntax is the simple part. The execution model is what makes the result useful in a distributed vector database.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Segment-local states replace raw-row movement</h3><p>A Milvus collection can span hundreds or thousands of segments distributed across several query nodes, with recently written data still on the streaming path. No single execution node starts with every visible row.</p>
<p>Milvus therefore pushes aggregation down to the segments:</p>
<ol>
<li>Each segment applies the filter and MVCC visibility rules locally.</li>
<li>The segment emits one partial state per group instead of its matching rows.</li>
<li>Partial states are merged within a query node.</li>
<li>The proxy performs the final cross-node merge and returns the completed groups.</li>
</ol>
<p>The amount of intermediate data now scales with the number of groups and aggregate states, rather than directly with the number of matching rows.</p>
<p>The merge operation depends on the aggregate:</p>
<table>
<thead>
<tr><th>Aggregate</th><th>Partial state</th><th>Merge rule</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>Partial count</td><td>Add counts</td></tr>
<tr><td><code translate="no">sum</code></td><td>Partial sum</td><td>Add sums</td></tr>
<tr><td><code translate="no">min</code></td><td>Partial minimum</td><td>Take the minimum</td></tr>
<tr><td><code translate="no">max</code></td><td>Partial maximum</td><td>Take the maximum</td></tr>
<tr><td><code translate="no">avg</code></td><td>Partial sum and count</td><td>Add both states, then divide once at the final stage</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> is the instructive case. Averaging two partial averages is incorrect when the partitions contain different numbers of rows. Milvus carries <code translate="no">sum</code> and <code translate="no">count</code> independently and computes the final average only after both have been merged globally.</p>
<p>This is one reason aggregation belongs in the database: the operation is not simply “run the same function on several batches.” The engine must preserve the algebra of each aggregate across segment and node boundaries.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">Visibility is applied before aggregation</h3><p>Deleted and expired rows are removed from the partial states at the segment level according to the query’s visibility boundary. They do not travel upward and then get corrected in the application.</p>
<p>The result therefore describes the rows Milvus considers visible for that request, not an arbitrary collection of batches pulled at slightly different times.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> now counts groups</h3><p>In a normal query, <code translate="no">limit</code> controls how many entity rows are returned. In a grouped query, it controls how many groups are returned. Because the result cardinality is determined by groups rather than matching rows, a query aggregation can also omit <code translate="no">limit</code> when it needs every group.</p>
<p>This sounds like a small API detail, but it reflects a different result model: the output is no longer a page of entities. It is a relation whose rows represent groups.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation: a bucketed view of ANN candidates<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>Query aggregation answers, “What do the visible rows matching this filter look like?” Search Aggregation asks a different question: “What does the candidate set retrieved for this vector look like?”</p>
<p>That operation has no exact SQL equivalent. ANN search first establishes a similarity-driven candidate boundary. Milvus then organizes retained candidates by scalar keys and returns a bucket tree instead of an ordinary flat hit list.</p>
<p>A bucket can contain:</p>
<ul>
<li>a key such as <code translate="no">brand</code> or a composite key such as <code translate="no">(brand, color)</code>;</li>
<li>a retained-candidate count;</li>
<li>metrics including <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, and <code translate="no">max</code>;</li>
<li>representative entities selected with <code translate="no">top_hits</code>; and</li>
<li>a nested <code translate="no">sub_aggregation</code> that creates child buckets.</li>
</ul>
<p>For the product-search page, one request can return brand buckets, the average price inside each bucket, and three representative products per brand:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>When <code translate="no">search_aggregation</code> is set, the ordinary hit list is empty. The application reads the bucket response from <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">The aggregation specification sets two different bounds</h3><p>Search Aggregation does not run <code translate="no">GROUP BY</code> over every entity in the collection, and it does not simply take an ordinary Top-K response and aggregate that flat list.</p>
<p>Its execution has three stages:</p>
<ol>
<li>Milvus runs ANN search to retrieve candidates near the query vector.</li>
<li>The grouping stage retains a bounded number of candidates for each full bucket key.</li>
<li>Milvus builds buckets, calculates metrics over the retained candidates, orders the buckets, and attaches representative hits or child buckets.</li>
</ol>
<p>Two parameters control different parts of the result:</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> limits how many buckets are returned at that aggregation level.</li>
<li>The largest <code translate="no">TopHits.size</code> anywhere in the aggregation tree sets the retained-candidate budget for each full composite key. If the request contains no <code translate="no">top_hits</code>, the per-key budget defaults to one.</li>
</ul>
<p>The top-level search <code translate="no">limit</code> does not control this mode and is ignored when <code translate="no">search_aggregation</code> is present.</p>
<p>That distinction is essential when reading a bucket’s <code translate="no">count</code> or metrics. With <code translate="no">TopHits(size=3)</code>, a brand bucket can summarize at most three retained candidates for its full key, even if the collection contains thousands of relevant products from that brand. Increasing <code translate="no">TopHits.size</code> widens the per-key metric window, but it does not turn ANN search into an exact scan.</p>
<p>If the application needs exact statistics over every visible row matching a filter, it should use query aggregation. Search Aggregation is for describing and comparing the candidates produced by similarity retrieval.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation and Grouping Search solve different problems<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus has supported Grouping Search (<code translate="no">group_by</code>)since Milvus 2.4. It is easy to see the word “grouping” in both features and assume they are two interfaces for the same operation. Their output contracts are different.</p>
<p><strong>Grouping Search</strong> changes which entities appear in a ranked result list. A common RAG pattern stores chunks as individual entities, groups them by <code translate="no">doc_id</code>, and returns one or a few chunks from each document. The primary output remains ordinary search hits, but with fewer repeated values from the grouping field.</p>
<p><strong>Search Aggregation</strong> returns a statistical view. The primary output is a bucket tree containing keys, counts, metrics, representative hits, and optional child buckets.</p>
<table>
<thead>
<tr><th>Application needs</th><th>Prefer</th><th>Consume</th></tr>
</thead>
<tbody>
<tr><td>A ranked entity list with greater diversity across a field</td><td>Grouping Search</td><td>Ordinary search hits</td></tr>
<tr><td>Facet counts, per-group metrics, representative hits, or nested distributions</td><td>Search Aggregation</td><td><code translate="no">AggregationBucket</code> objects in <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>A practical rule is to start from the UI or API response shape. If the application renders a list, Grouping Search is usually the right primitive. If it renders facets, distribution cards, or a hierarchy of groups, use Search Aggregation.</p>
<p>The two modes are mutually exclusive in one request because they define different primary result shapes.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: move sorting before the application boundary<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>Sorting is the least exotic feature in this release and one of the easiest to implement incorrectly outside the engine.</p>
<p>Milvus 3.0 exposes sorting on both query and search, but the two paths use different SDK parameters and operate over different input sets.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">Query sorting orders the filtered row set</h3><p>PyMilvus query uses <code translate="no">order_by</code>, expressed as a list of <code translate="no">&quot;field:direction&quot;</code> strings. The engine applies the filter, orders the visible rows, and then applies <code translate="no">limit</code> and <code translate="no">offset</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>This makes query useful for business-ordered browsing: newest ingested records, highest-priced products inside a filter, lowest inventory, or extreme values for data inspection. Without server-side ordering, applications had to retrieve rows first and could not define a reliable business order across pages.</p>
<p>For nullable query fields, ascending order places nulls last and descending order places them first. A sort field does not have to appear in <code translate="no">output_fields</code>; include it only when the application needs the value in the response.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">Search sorting reorders the ANN candidate set</h3><p>PyMilvus search uses <code translate="no">order_by_fields</code>, where each entry names a scalar field and direction:</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>ANN still determines which entities become candidates. <code translate="no">order_by_fields</code> changes how those candidates are returned; it does not make the search globally scan the collection for the cheapest products.</p>
<p>That boundary gives the two APIs distinct jobs:</p>
<ul>
<li>Use query plus <code translate="no">order_by</code> when the scalar order itself defines the result, such as the ten cheapest in-stock products.</li>
<li>Use search plus <code translate="no">order_by_fields</code> when semantic or vector relevance defines the candidate set and a scalar field determines how those candidates should be presented.</li>
</ul>
<p>Multi-field sorting applies keys in list order. When search candidates have the same values for every specified scalar key, Milvus preserves their original similarity-score order.</p>
<p>Sorting also composes with Grouping Search. Milvus orders groups by the configured scalar value from each group’s top entity while retaining the grouped result shape. This is useful when the application wants both diversity across a field and a business-relevant group order.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">What these capabilities make possible<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>The APIs are general database primitives, but several retrieval workloads benefit immediately.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG and agents: inspect retrieval concentration</h3><p>A RAG or agentic system can bucket retrieved chunks by source document, product line, tenant, or content type. A result concentrated in two documents carries a different coverage signal from one spread across dozens of sources.</p>
<p>That distribution is not a guarantee of answer quality. It is, however, a useful retrieval diagnostic that an application or agent can combine with scores, citations, and other checks when deciding whether to broaden the query, retrieve again, or ask for clarification.</p>
<p>Grouping Search remains the right choice when the goal is simply to diversify the returned chunks. Search Aggregation is useful when the system needs the distribution itself.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">E-commerce and content recommendation: return facets with the search</h3><p>The opening product-search page can receive brand buckets, price metrics, representative items, and a scalar-sorted candidate list from Milvus. The application still controls presentation and business logic, but it no longer needs to reconstruct basic bucket semantics from exported hits.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">Logs and security: combine similarity with incident distribution</h3><p>Similarity search can find events related to a suspicious log line. Search Aggregation can then show which hosts dominate those candidates, the minimum and maximum timestamp in each host bucket, or how the candidates divide across severity and service.</p>
<p>The result remains a view of retrieved candidates rather than an exact global incident count. When the investigation needs exact counts over every event matching a filter, query aggregation provides that second path.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">Operations and data exploration: calculate instead of export</h3><p>Dashboards and administrative tools can run exact counts and averages over filtered rows, then browse the underlying entities in a defined scalar order. That removes many one-off “export, calculate, and sort” utilities without pretending that Milvus has become a full analytical database.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">Boundaries: what aggregation and <code translate="no">ORDER BY</code> do not replace<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>These features extend the retrieval engine; they do not turn Milvus into an online analytical processing (OLAP) system.</p>
<ul>
<li>Query aggregation supports grouping plus <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, and <code translate="no">max</code>. It does not add joins, window functions, or complex subqueries. Large offline analytical jobs still belong in systems such as Spark, which can work with Milvus 3.0 snapshots and shared storage paths.</li>
<li>Query group keys support integer, <code translate="no">VARCHAR</code>, and <code translate="no">TIMESTAMPTZ</code> fields. Search Aggregation bucket keys additionally support Boolean fields. Floating-point, vector, JSON, and array values are not bucket keys.</li>
<li>For Search Aggregation, <code translate="no">count</code> accepts <code translate="no">&quot;*&quot;</code> or a non-JSON, non-dynamic source; <code translate="no">sum</code> and <code translate="no">avg</code> require numeric sources; and <code translate="no">min</code> and <code translate="no">max</code> also support string and <code translate="no">TIMESTAMPTZ</code> sources. Query aggregation follows the same arithmetic type boundaries. Consult the API guide before applying an aggregate to a complex field type.</li>
<li>Query aggregation can order grouped output by group keys, while ordering by a computed aggregate such as <code translate="no">count(*)</code> remains a current boundary. Without an explicit order, group order is not guaranteed.</li>
<li>Search Aggregation cannot currently be combined with Hybrid Search, Grouping Search, Search Iterators, a non-zero offset, or highlighting in the same request.</li>
<li>Search Aggregation counts and metrics describe retained ANN candidates, not the complete collection and not every entity that might be semantically relevant.</li>
<li>Search <code translate="no">ORDER BY</code> changes candidate presentation. It does not repair missed ANN candidates or convert similarity retrieval into an exact scalar Top-N query.</li>
</ul>
<p>The cleanest way to choose among the new primitives is to start with the question:</p>
<ul>
<li>For exact statistics over filtered visible rows, use query aggregation.</li>
<li>For a distribution over similarity-retrieval candidates, use Search Aggregation.</li>
<li>For a diverse ranked list, use Grouping Search.</li>
<li>For a defined scalar order, use query or search <code translate="no">ORDER BY</code> according to which path established the result set.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">From candidate lists to structured results<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Vector databases have traditionally optimized one question: which K entities are nearest to this vector?</strong></p>
<p>Production retrieval systems ask follow-up questions immediately. Which groups dominate the result? What are their counts and ranges? Which examples represent each group? In what business order should the application present the rows or candidates?</p>
<p>Milvus 3.0 brings those operations into the same engine that owns the data, the ANN candidate boundary, and the visibility semantics. Query aggregation performs exact distributed reduction over visible rows. Search Aggregation builds a bucketed view over retained ANN candidates. <code translate="no">ORDER BY</code> gives query and search paths a server-side scalar order without asking the application to reconstruct it page by page.</p>
<p>The result is not an OLAP engine hidden inside a vector database. It is a retrieval engine that can return more of the structure applications actually need.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Try aggregation and <code translate="no">ORDER BY</code> in Milvus 3.0<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 is available now. Use the <a href="https://milvus.io/docs/get-and-scalar-query.md">Query guide</a> for exact aggregation and query sorting, the <a href="https://milvus.io/docs/search-aggregation.md">Search Aggregation guide</a> for bucket semantics and limits, the <a href="https://milvus.io/docs/single-vector-search.md">Basic Vector Search guide</a> for search sorting, and the <a href="https://milvus.io/docs/grouping-search.md">Grouping Search guide</a> when your primary goal is result diversity.</p>
<p>For the broader release, see the <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 launch blog</a>, <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 release notes</a>, and the <a href="https://github.com/milvus-io/milvus">milvus-io/milvus repository</a>.</p>
<p>If you want to evaluate the same APIs without operating the cluster yourself, try them on <a href="https://cloud.zilliz.com">Zilliz Cloud</a>. The current <a href="https://docs.zilliz.com/reference/python/python/Vector-query">Zilliz Cloud query reference</a> and <a href="https://docs.zilliz.com/reference/python/python/Vector-search">search reference</a> describe availability and parameters for managed cluster types.</p>
<p>To discuss a workload or an edge case with the team, join the <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a> or book a <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours session</a>.</p>
