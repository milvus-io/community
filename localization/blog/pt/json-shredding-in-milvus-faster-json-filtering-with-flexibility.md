---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: |
  JSON Shredding in Milvus: 88.9x Faster JSON Filtering with Flexibility
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/JSON_Shredding_new_Cover_1_f9253063f5.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  Discover how Milvus JSON Shredding uses optimized columnar storage to speed up
  JSON queries by up to 89× while preserving full schema flexibility.
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>Modern AI systems are producing more semi-structured JSON data than ever before. Customer and product information are compacted to a JSON object, microservices emit JSON logs on every request, IoT devices stream sensor readings in lightweight JSON payloads, and today’s AI applications increasingly standardize on JSON for structured output. The result is a flood of JSON-like data flowing into vector databases.</p>
<p>Traditionally, there are two ways to handle JSON documents:</p>
<ul>
<li><p><strong>Predefine every field of JSON into a fixed schema and build an index:</strong> This approach delivers solid query performance, but it’s rigid. Once the data format changes, every new or modified field triggers another round of painful Data Definition Language (DDL) updates and schema migrations.</p></li>
<li><p><strong>Store the entire JSON object as a single column (both JSON type and Dynamic Schema in Milvus use this approach):</strong> This option offers excellent flexibility, but at the cost of query performance. Each request requires runtime JSON parsing and often a full table scan, resulting in latency that spikes as the dataset grows.</p></li>
</ul>
<p>It used to be a dilemma of flexibility and performance.</p>
<p>Not anymore with the newly introduced JSON Shredding feature in <a href="https://milvus.io/">Milvus</a>.</p>
<p>With the introduction of <a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a>, Milvus now achieves schema-free agility with the performance of columnar storage, finally making large-scale semi-structured data both flexible and query-friendly.</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">How JSON Shredding Works<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>JSON shredding speeds up JSON queries by transforming row-based JSON documents into highly optimized columnar storage. Milvus preserves the flexibility of JSON for data modeling while automatically optimizing columnar storage—significantly improving data access and query performance.</p>
<p>To handle sparse or rare JSON fields efficiently, Milvus also has an inverted index for shared keys. All of this happens transparently to users: you can insert JSON documents as usual, and leave it to Milvus to manage the optimal storage and indexing strategy internally.</p>
<p>When Milvus receives raw JSON records with varying shapes and structures, it analyzes each JSON key for its occurrence ratio and type stability (whether its data type is consistent across documents). Based on this analysis, each key is classified into one of three categories:</p>
<ul>
<li><p><strong>Typed keys:</strong> Keys that appear in most documents and always have the same data type (e.g., all integers or all strings).</p></li>
<li><p><strong>Dynamic keys</strong>: Keys that appear frequently but have mixed data types (e.g., sometimes a string, sometimes an integer).</p></li>
<li><p><strong>Shared keys:</strong> Keys that are infrequent, sparse, or nested, falling below a configurable frequency threshold.</p></li>
</ul>
<p>Milvus handles each category differently to maximize efficiency:</p>
<ul>
<li><p><strong>Typed keys</strong> are stored in dedicated, strongly typed columns.</p></li>
<li><p><strong>Dynamic keys</strong> are placed into dynamic columns based on the actual value type observed at runtime.</p></li>
<li><p>Both typed and dynamic columns are stored in Arrow/Parquet columnar formats for fast scanning and highly optimized query execution.</p></li>
<li><p><strong>Shared keys</strong> are consolidated into a compact binary-JSON column, accompanied by a shared-key inverted index. This index accelerates queries on low-frequency fields by pruning irrelevant rows early and restricting the search to only those documents that contain the queried key.</p></li>
</ul>
<p>This combination of adaptive columnar storage and inverted indexing forms the core of Milvus’s JSON shredding mechanism, enabling both flexibility and high performance at scale.</p>
<p>The overall workflow is illustrated below:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Now that we’ve covered the basics of how JSON Shredding works, let’s take a closer look at the key capabilities that make this approach both flexible and high-performance.</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">Shredding and Columnarization</h3><p>When a new JSON document is written, Milvus breaks it down and reorganizes it into optimized columnar storage:</p>
<ul>
<li><p>Typed and dynamic keys are automatically identified and stored in dedicated columns.</p></li>
<li><p>If the JSON contains nested objects, Milvus generates path-based column names automatically. For example, a <code translate="no">name</code> field inside a <code translate="no">user</code> object can be stored with the column name <code translate="no">/user/name</code>.</p></li>
<li><p>Shared keys are stored together in a single, compact binary JSON column. Because these keys appear infrequently, Milvus builds an inverted index for them, enabling fast filtering and allowing the system to quickly locate the rows that contain the specified key.</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">Intelligent Column Management</h3><p>Beyond shredding JSON into columns, Milvus adds an additional layer of intelligence through dynamic column management, ensuring that JSON Shredding stays flexible as data evolves.</p>
<ul>
<li><p><strong>Columns created as needed:</strong> When new keys appear in incoming JSON documents, Milvus automatically groups values with the same key into a dedicated column. This preserves the performance advantages of columnar storage without requiring users to design schemas upfront. Milvus also infers the data type of new fields (e.g., INTEGER, DOUBLE, VARCHAR) and selects an efficient columnar format for them.</p></li>
<li><p><strong>Every key is handled automatically:</strong> Milvus analyzes and processes every key in the JSON document. This ensures broad query coverage without forcing users to predefine fields or build indexes in advance.</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">Query Optimization</h3><p>Once the data is reorganized into the right columns, Milvus selects the most efficient execution path for each query:</p>
<ul>
<li><p><strong>Direct column scans for typed and dynamic keys:</strong> If a query targets a field that has already been split into its own column, Milvus can scan that column directly. This reduces the total amount of data that needs to be processed and leverages SIMD-accelerated columnar computation for even faster execution.</p></li>
<li><p><strong>Indexed lookup for shared keys:</strong> If the query involves a field that was not promoted into its own column—typically a rare key—Milvus evaluates it against the shared-key column. The inverted index built on this column allows Milvus to quickly identify which rows contain the specified key and skip over the rest, significantly improving performance for low-frequency fields.</p></li>
<li><p><strong>Automatic metadata management:</strong> Milvus continuously maintains global metadata and dictionaries so that queries remain accurate and efficient, even as the structure of incoming JSON documents evolves over time.</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">Performance benchmarks<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>We designed a benchmark to compare the query performance of storing the entire JSON document as a single raw field versus using the newly released JSON Shredding feature.</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">Test environment and methodology</h3><ul>
<li><p>Hardware: 1 core/8GB cluster</p></li>
<li><p>Dataset: 1 million documents from <a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a></p></li>
<li><p>Methodology: Measure QPS and latency across different query patterns</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">Results: typed keys</h3><p>This test measured performance when querying a key present in most documents.</p>
<table>
<thead>
<tr><th>Query Expression</th><th>QPS (without shredding)</th><th>QPS (with shredding)</th><th>Performance Boost</th></tr>
</thead>
<tbody>
<tr><td>json[‘time_us’] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json[‘kind’] == ‘commit’</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">Results: shared keys</h3><p>This test focused on querying sparse, nested keys that fall into the “shared” category.</p>
<table>
<thead>
<tr><th>Query Expression</th><th>QPS (without shredding)</th><th>QPS (with shredding)</th><th>Performance Boost</th></tr>
</thead>
<tbody>
<tr><td>json[‘identity’][‘seq’] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json[‘identity’][‘did’] == ‘xxxxx’</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>Shared-key queries show the most dramatic improvements (up to 89× faster), while typed-key queries deliver consistent 15–30× speedups. Overall, every query type benefits from JSON Shredding, with clear performance gains across the board.</p>
<h2 id="Try-It-Now" class="common-anchor-header">Try It Now<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Whether you’re working with API logs, IoT sensor data, or rapidly evolving application payloads, JSON Shredding gives you the rare ability to have both flexibility and high performance.</p>
<p>The feature is now available and welcome to try it out now. You can also check <a href="https://milvus.io/docs/json-shredding.md">this doc</a> for more details.</p>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
