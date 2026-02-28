---
id: how-to-filter-efficiently-without-killing-recall.md
title: >-
  Vector Search in the Real World: How to Filter Efficiently Without Killing
  Recall
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: >-
  This blog explores popular filtering techniques in vector search, along with
  the innovative optimizations we built into Milvus and Zilliz Cloud.
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>Many people think vector search is simply about implementing an ANN (Approximate Nearest Neighbor) algorithm and calling it a day. But if you run vector search in production, you know the truth: it gets complicated fast.</p>
<p>Imagine you’re building a product search engine. A user might ask, “<em>Show me shoes similar to this photo, but only in red and under $100</em>.” Serving this query requires applying a metadata filter to the semantic similarity search results. Sounds as simple as applying a filter after your vector search returns? Well, not quite.</p>
<p>What happens when your filtering condition is highly selective? You might not return enough results. And simply increasing the vector search’s <strong>topK</strong> parameter may quickly degrade performance and consume significantly more resources to handle the same search volume.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Under the hood, efficient metadata filtering is pretty challenging. Your vector database needs to scan the graph index, apply metadata filters, and still respond within a tight latency budget, say, 20 milliseconds. Serving thousands of such queries per second without going bankrupt requires thoughtful engineering and careful optimization.</p>
<p>This blog explores popular filtering techniques in vector search, along with the innovative optimizations we built into the <a href="https://milvus.io/docs/overview.md">Milvus</a> vector database and its fully managed cloud service (<a href="https://zilliz.com/cloud">Zilliz Cloud</a>). We’ll also share a benchmark test demonstrating how much more performance the fully-managed Milvus can achieve with a $1000 cloud budget over the other vector databases.</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">Graph Index Optimization<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector databases need efficient indexing methods to handle large datasets. Without indexes, a database must compare your query against every vector in the dataset (brute-force scanning), which becomes extremely slow as your data grows.</p>
<p><strong>Milvus</strong> supports various index types to solve this performance challenge. The most popular ones are graph-based index types: HNSW (runs entirely in memory) and DiskANN (efficiently uses both memory and SSD). These indexes organize vectors into a network structure where neighborhoods of vectors are connected on a map, allowing searches to quickly navigate to relevant results while checking only a small fraction of all vectors. <strong>Zilliz Cloud</strong>, the fully-managed Milvus service, takes one step further by introducing Cardinal, an advanced proprietary vector search engine, further enhancing these indexes for even better performance.</p>
<p>However, when we add filtering requirements (like “only show products less than $100”), a new problem emerges. The standard approach is creating a <em>bitset</em> - a list marking which vectors meet the filter criteria. During search, the system only considers vectors marked as valid in this bitset. This approach seems logical, but it creates a serious problem: <strong>broken connectivity</strong>. When many vectors get filtered out, the carefully constructed paths in our graph index get disrupted.</p>
<p>Here’s a simple example of the problem: In the diagram below, Point A connects to B, C and D, but B, C, and D don’t directly connect to each other. If our filter removes point A (perhaps it’s too expensive), then even if B, C, and D are relevant to our search, the path between them is broken. This creates “islands” of disconnected vectors that become unreachable during search, hurting the quality of results (recall).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>There are two common approaches to filtering during graph traversal: exclude all filtered-out points upfront, or include everything and apply the filter afterward. As illustrated in the diagram below, neither approach is ideal. Skipping filtered points entirely can cause recall to collapse as the filtering ratio nears 1 (blue line), while visiting every point regardless of its metadata bloats the search space and slows down performance significantly (red line).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Researchers have proposed several approaches to strike a balance between recall and performance:</p>
<ol>
<li><strong>Alpha Strategy:</strong> This introduces a probabilistic approach: even though a vector doesn’t match the filter, we might still visit it during search with some probability. This probability (alpha) depends on the filtering ratio - how strict the filter is. This helps maintain essential connections in the graph without visiting too many irrelevant vectors.</li>
</ol>
<ol start="2">
<li><strong>ACORN Method [1]:</strong> In standard HNSW, edge pruning is used during index construction to create a sparse graph and speed up search. The ACORN method deliberately skips this pruning step to retain more edges and strengthen connectivity—crucial when filters might exclude many nodes. In some cases, ACORN also expands each node’s neighbor list by gathering additional approximate nearest neighbors, further reinforcing the graph. Moreover, its traversal algorithm looks two steps ahead (i.e., examines neighbors of neighbors), improving the chances of finding valid paths even under high filtering ratios.</li>
</ol>
<ol start="3">
<li><strong>Dynamically Selected Neighbors:</strong> A method improves over Alpha Strategy. Instead of relying on probabilistic skipping, this approach adaptively selects the next nodes during search. It offers more control than Alpha Strategy.</li>
</ol>
<p>In Milvus, we implemented the Alpha strategy alongside other optimization techniques. For example, it dynamically switches strategies when detecting extremely selective filters: when, say, approximately 99% of the data doesn’t match the filtering expression, the “include-all” strategy would cause graph traversal paths to lengthen significantly, resulting in performance degradation and isolated “islands” of data. In such cases, Milvus automatically falls back to a brute-force scan, bypassing the graph index entirely for better efficiency. In Cardinal, the vector search engine powering fully-managed Milvus (Zilliz Cloud), we’ve taken this further by implementing a dynamic combination of “include-all” and “exclude-all” traversal methods that intelligently adapts based on data statistics to optimize query performance.</p>
<p>Our experiments on the Cohere 1M dataset (dimension = 768) using an AWS r7gd.4xlarge instance demonstrate the effectiveness of this approach. In the chart below, the blue line represents our dynamic combination strategy, while the red line illustrates the baseline approach that traverses all filtered points in the graph.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">Metadata-Aware Indexing<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Another challenge comes from how metadata and vector embeddings relate to each other. In most applications, an item’s metadata properties (e.g., a product’s price) have minimal connection to what the vector actually represents (the semantic meaning or visual features). For example, a <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>90</mn><mi>d</mi><mi>r</mi><mi>e</mi><mi>s</mi><mi>s</mi><mi>a</mi><mi>n</mi><mi>d</mi><mi>a</mi></mrow><annotation encoding="application/x-tex">90 dress and a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord">90</span><span class="mord mathnormal">d</span><span class="mord mathnormal">ress</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mord mathnormal">a</span></span></span></span>90 belt share the same price point but exhibit completely different visual characteristics. This disconnect makes combining filtering with vector search inherently inefficient.</p>
<p>To solve this problem, we’ve developed <strong>metadata-aware vector indexes</strong>. Instead of having just one graph for all vectors, it builds specialized “subgraphs” for different metadata values. For example, if your data has fields for “color” and “shape,” it creates separate graph structures for these fields.</p>
<p>When you search with a filter like “color = blue,” it uses the color-specific subgraph rather than the main graph. This is much faster because the subgraph is already organized around the metadata you’re filtering by.</p>
<p>In the figure below, the main graph index is called the <strong>base graph</strong>, while the specialized graphs built for specific metadata fields are called <strong>column graphs</strong>. To manage memory usage effectively, it limits how many connections each point can have (out-degree). When a search doesn’t include any metadata filters, it defaults to the base graph. When filters are applied, it switches to the appropriate column graph, offering a significant speed advantage.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">Iterative Filtering<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Sometimes the filtering itself becomes the bottleneck, not the vector search. This happens especially with complex filters like JSON conditions or detailed string comparisons. The traditional approach (filter first, then search) can be extremely slow because the system has to evaluate these expensive filters on potentially millions of records before even starting the vector search.</p>
<p>You might think: “Why not do vector search first, then filter the top results?” This approach works sometimes, but has a major flaw: if your filter is strict and filters out most results, you might end up with too few (or zero) results after filtering.</p>
<p>To solve this dilemma, we created <strong>Iterative Filtering</strong> in Milvus and Zilliz Cloud, inspired by<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a>. Instead of an all-or-nothing approach, Iterative Filtering works in batches:</p>
<ol>
<li><p>Get a batch of the closest vector matches</p></li>
<li><p>Apply filters to this batch</p></li>
<li><p>If we don’t have enough filtered results, get another batch</p></li>
<li><p>Repeat until we have the required number of results</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This approach dramatically reduces how many expensive filter operations we need to perform while still ensuring we get enough high-quality results. For more information on enabling iterative filtering, please refer to this <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">iterative filtering doc page</a>.</p>
<h2 id="External-Filtering" class="common-anchor-header">External Filtering<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Many real-world applications split their data across different systems - vectors in a vector database and metadata in traditional databases. For example, many organizations store product descriptions and user reviews as vectors in Milvus for semantic search, while keeping inventory status, pricing, and other structured data in traditional databases like PostgreSQL or MongoDB.</p>
<p>This separation makes sense architecturally but creates a challenge for filtered searches. The typical workflow becomes:</p>
<ul>
<li><p>Query your relational database for records matching filter criteria (e.g., “in-stock items under $50”)</p></li>
<li><p>Get the matching IDs and send them to Milvus to filter the vector search</p></li>
<li><p>Perform semantic search only on vectors that match these IDs</p></li>
</ul>
<p>This sounds simple—but when the number of rows grows beyond millions, it becomes a bottleneck. Transferring large lists of IDs consumes network bandwidth, and executing massive filter expressions in Milvus adds overhead.</p>
<p>To address this, we introduced <strong>External Filtering</strong> in Milvus, a lightweight SDK-level solution that uses the search iterator API and reverses the traditional workflow.</p>
<ul>
<li><p>Performs vector search first, retrieving batches of the most semantically relevant candidates</p></li>
<li><p>Applies your custom filter function to each batch on the client side</p></li>
<li><p>Automatically fetches more batches until you have enough filtered results</p></li>
</ul>
<p>This batched, iterative approach significantly reduces both network traffic and processing overhead, since you’re only working with the most promising candidates from the vector search.</p>
<p>Here’s an example of how to use External Filtering in pymilvus:</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>Unlike Iterative Filtering, which operates on segment-level iterators, External Filtering works at the global query level. This design minimizes metadata evaluation and avoids executing large filters within Milvus, resulting in leaner and faster end-to-end performance.</p>
<h2 id="AutoIndex" class="common-anchor-header">AutoIndex<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector search always involves a tradeoff between accuracy and speed - the more vectors you check, the better your results but the slower your query. When you add filters, this balance becomes even trickier to get right.</p>
<p>In Zilliz Cloud, we’ve created <strong>AutoIndex</strong> - an ML-based optimizer that automatically fine-tunes this balance for you. Instead of manually configuring complex parameters, AutoIndex uses machine learning to determine the optimal settings for your specific data and query patterns.</p>
<p>To understand how this works, it helps to know a bit about Milvus’s architecture since Zilliz is built on top of Milvus: Queries are distributed across multiple QueryNode instances. Each node handles a portion of your data (a segment), performs its search, and then results are merged together.</p>
<p>AutoIndex analyzes statistics from these segments and makes intelligent adjustments. For low filtering ratio, the index query range is widened to increase recall. For high filtering ratio, the query range is narrowed to avoid wasted effort on unlikely candidates. These decisions are guided by statistical models that predict the most effective search strategy for each specific filtering scenario.</p>
<p>AutoIndex goes beyond indexing parameters. It also helps select the best filter evaluation strategy. By parsing filter expressions and sampling segment data, it can estimate evaluation cost. If it detects high evaluation costs, it automatically switches to more efficient techniques such as Iterative Filtering. This dynamic adjustment ensures you’re always using the best-fit strategy for each query.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">Performance on a $1,000 Budget<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>While theoretical improvements are important, real-world performance is what matters to most developers. We wanted to test how these optimizations translate to actual application performance under realistic budget constraints.</p>
<p>We benchmarked several vector database solutions with a practical $1,000 monthly budget - a reasonable amount that many companies would allocate to vector search infrastructure. For each solution, we selected the highest-performing instance configuration possible within this budget constraint.</p>
<p>Our testing used:</p>
<ul>
<li><p>The Cohere 1M dataset with 1 million 768-dimensional vectors</p></li>
<li><p>A mix of real-world filtered and unfiltered search workloads</p></li>
<li><p>The open-source vdb-bench benchmark tool for consistent comparisons</p></li>
</ul>
<p>The competing solutions (anonymized as “VDB A,” “VDB B,” and “VDB C”) were all configured optimally within the budget. The results showed that fully-managed Milvus (Zilliz Cloud) consistently achieved the highest throughput across both filtered and unfiltered queries. With the same $1000 budge, our optimization techniques deliver the most performance at competitive recall.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector search with filtering might look simple on the surface - just add a filter clause to your query and you’re done. However, as we’ve demonstrated in this blog, achieving both high performance and accurate results at scale requires sophisticated engineering solutions. Milvus and Zilliz Cloud address these challenges through several innovative approaches:</p>
<ul>
<li><p><strong>Graph Index Optimization</strong>: Preserves paths between similar items even when filters remove connecting nodes, preventing the “islands” problem that reduces result quality.</p></li>
<li><p><strong>Metadata-Aware Indexing</strong>: Creates specialized paths for common filter conditions, making filtered searches significantly faster without sacrificing accuracy.</p></li>
<li><p><strong>Iterative Filtering</strong>: Processes results in batches, applying complex filters only to the most promising candidates instead of the entire dataset.</p></li>
<li><p><strong>AutoIndex</strong>: Uses machine learning to automatically tune search parameters based on your data and queries, balancing speed and accuracy without manual configuration.</p></li>
<li><p><strong>External Filtering</strong>: Bridges vector search with external databases efficiently, eliminating network bottlenecks while maintaining result quality.</p></li>
</ul>
<p>Milvus and Zilliz Cloud continue to evolve with new capabilities that further improve filtered search performance. Features like<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Key</a> allow for even more efficient data organization based on filtering patterns, and advanced subgraph routing techniques are pushing performance boundaries even further.</p>
<p>The volume and complexity of unstructured data continue to grow exponentially, creating new challenges for search systems everywhere. Our team is constantly pushing the boundaries of what’s possible with vector databases to deliver faster, more scalable AI-powered search.</p>
<p>If your applications are hitting performance bottlenecks with filtered vector search, we invite you to join our active developer community at <a href="https://milvus.io/community">milvus.io/community</a> - where you can share challenges, access expert guidance, and discover emerging best practices.</p>
<h2 id="References" class="common-anchor-header">References<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
