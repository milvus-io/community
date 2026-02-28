---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  We're excited to announce that Milvus 2.6 is now available. This release
  introduces dozens of features directly addressing the most pressing challenges
  in vector search today - scaling efficiently while keeping costs under
  control.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>As AI-powered search has evolved from experimental projects to mission-critical infrastructure, the demands on <a href="https://milvus.io/blog/what-is-a-vector-database.md">vector databases</a> have intensified. Organizations need to handle billions of vectors while managing infrastructure costs, supporting real-time data ingestion, and providing sophisticated retrieval beyond basic <a href="https://zilliz.com/learn/vector-similarity-search">similarity search</a>. To tackle these evolving challenges, we’ve been hard at work developing and refining Milvus. The community response has been incredibly encouraging, with valuable feedback helping shape our direction.</p>
<p>After months of intensive development, we’re excited to announce that <strong>Milvus 2.6 is now available</strong>. This release directly addresses the most pressing challenges in vector search today: <strong><em>scaling efficiently while keeping costs under control.</em></strong></p>
<p>Milvus 2.6 delivers breakthrough innovations across three critical areas: <strong>cost reduction, advanced search capabilities, and architectural improvements for massive scale</strong>. The results speak for themselves:</p>
<ul>
<li><p><strong>72% memory reduction</strong> with RaBitQ 1-bit quantization while delivering 4x faster queries</p></li>
<li><p><strong>50% cost savings</strong> through intelligent tiered storage</p></li>
<li><p><strong>4x faster full-text search</strong> than Elasticsearch with our enhanced BM25 implementation</p></li>
<li><p><strong>100x faster</strong> JSON filtering with the newly introduced Path Index</p></li>
<li><p><strong>Search freshness is achieved economically</strong> with the new zero-disk architecture</p></li>
<li><p><strong>Streamlined embedding workflow</strong> with the new “data in and data out” experience</p></li>
<li><p><strong>Up to 100K collections in a single cluster</strong> for future-proof multi-tenancy</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">Innovations for Cost Reduction: Making Vector Search Affordable<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>Memory consumption presents one of the biggest challenges when scaling vector search to billions of records. Milvus 2.6 introduces several key optimizations that significantly reduce your infrastructure costs while also improving performance.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">RaBitQ 1-bit Quantization: 72% Memory Reduction with 4× Performance</h3><p>Traditional quantization methods force you to trade in search quality for memory savings. Milvus 2.6 changes this with <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1-bit quantization</a> combined with an intelligent refinement mechanism.</p>
<p>The new IVF_RABITQ index compresses the main index to 1/32 of its original size through 1-bit quantization. When used together with an optional SQ8 refinement, this approach maintains high search quality (95% recall) using only 1/4 of the original memory footprint.</p>
<p>Our preliminary benchmarks reveal promising results:</p>
<table>
<thead>
<tr><th><strong>Performance Metric</strong></th><th><strong>Traditional IVF_FLAT</strong></th><th><strong>RaBitQ (1-bit) Only</strong></th><th><strong>RaBitQ (1-bit) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>Memory Footprint</td><td>100% (baseline)</td><td>3% (97% reduction)</td><td>28% (72% reduction)</td></tr>
<tr><td>Recall</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Search Throughput (QPS)</td><td>236</td><td>648 (2.7× faster)</td><td>946 (4× faster)</td></tr>
</tbody>
</table>
<p><em>Table: VectorDBBench evaluation with 1M vectors of 768 dimensions, tested on AWS m6id.2xlarge</em></p>
<p>The real breakthrough here isn’t just the 72% memory reduction, but achieving this while simultaneously delivering a 4× throughput improvement. This means you can serve the same workload with 75% fewer servers or handle 4× more traffic on your existing infrastructure, all without sacrificing the recall.</p>
<p>For enterprise users utilizing fully managed Milvus on<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, we’re developing an automated strategy that dynamically adjusts RaBitQ parameters based on your specific workload characteristics and precision requirements. You will simply enjoy greater cost-effectiveness across all Zilliz Cloud CU types.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">Hot-Cold Tiered Storage: 50% Cost Reduction Through Intelligent Data Placement</h3><p>Real-world vector search workloads contain data with vastly different access patterns. Frequently accessed data needs instant availability, while archival data can tolerate slightly higher latency in exchange for dramatically lower storage costs.</p>
<p>Milvus 2.6 introduces a tiered storage architecture that automatically classifies data based on access patterns and places it in appropriate storage tiers:</p>
<ul>
<li><p><strong>Intelligent data classification</strong>: Milvus automatically identifies hot (frequently accessed) and cold (rarely accessed) data segments based on access patterns</p></li>
<li><p><strong>Optimized storage placement</strong>: Hot data remains in high-performance memory/SSD, while cold data moves to more economical object storage</p></li>
<li><p><strong>Dynamic data movement</strong>: As usage patterns change, data automatically migrates between tiers</p></li>
<li><p><strong>Transparent retrieval</strong>: When queries touch cold data, it’s automatically loaded on demand</p></li>
</ul>
<p>The result is up to 50% reduction in storage costs while maintaining query performance for active data.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">Additional Cost Optimizations</h3><p>Milvus 2.6 also introduces Int8 vector support for HNSW indexes, Storage v2 format for optimized structure that reduces IOPS and memory requirements, and easier installation directly through APT/YUM package managers.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">Advanced Search Capabilities: Beyond Basic Vector Similarity<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector search alone isn’t enough for modern AI applications. Users demand the precision of traditional information retrieval combined with the semantic understanding of vector embeddings. Milvus 2.6 introduces a suite of advanced search features that bridge this gap.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">Turbocharged BM25: 400% Faster Full-Text Search Than Elasticsearch</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">Full-text search</a> has become essential for building hybrid retrieval systems in vector databases. In Milvus 2.6, significant performance improvements have been made to full-text search, building on the BM25 implementation introduced since version 2.5. For example, this release introduces new parameters like <code translate="no">drop_ratio_search</code> and <code translate="no">dim_max_score_ratio</code>, enhancing precision and speed tuning and offering more fine-grained search controls.</p>
<p>Our benchmarks against the industry-standard BEIR dataset show Milvus 2.6 achieving 3-4× higher throughput than Elasticsearch with equivalent recall rates. For specific workloads, the improvement reaches 7× higher QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">JSON Path Index: 100x Faster Filtering</h3><p>Milvus has supported JSON data type for a long time, but filtering on JSON fields was slow due to the lack of index support. Milvus 2.6 adds support for JSON path index to boost the performance significantly.</p>
<p>Consider a user profile database where each record contains nested metadata like:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>For a semantic search “users interested in AI” scoped to only San Francisco, Milvus used to parse and evaluate the entire JSON object for every record, making the query very expensive and slow.</p>
<p>Now, Milvus allows you to create indexes on specific paths within JSON fields to speed up the search:</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>In our performance testing with 100M+ records, JSON Path Index reduced filter latency from <strong>140ms</strong> (P99: 480ms) to just <strong>1.5ms</strong> (P99: 10ms)—a 99% latency reduction that makes such searches practical in production.</p>
<p>This feature is particularly valuable for:</p>
<ul>
<li><p>Recommendation systems with complex user attribute filtering</p></li>
<li><p>RAG applications that filter documents by metadata</p></li>
<li><p>Multi-tenant systems where data segmentation is critical</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">Enhanced Text Processing and Time-Aware Search</h3><p>Milvus 2.6 introduces a completely revamped text analysis pipeline with sophisticated language handling, including the Lindera tokenizer for Japanese and Korean, the ICU tokenizer for comprehensive multilingual support, and enhanced Jieba with custom dictionary integration.</p>
<p><strong>Phrase Match Intelligence</strong> captures semantic nuance in word order, distinguishing between “machine learning techniques” and &quot;learning machine techniques&quot;:</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Time-Aware Decay Functions</strong> automatically prioritize fresh content by adjusting relevance scores based on document age, with configurable decay rates and function types (exponential, Gaussian, or linear).</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">Streamlined Search: Data in, Data Out Experience</h3><p>The disconnect between raw data and vector embeddings is another pain point for developers using vector databases. Before data reaches Milvus for indexing and vector search, it often undergoes preprocessing using external models that convert raw text, images, or audio into vector representations. After retrieval, additional downstream processing is also required, such as mapping result IDs back to the original content.</p>
<p>Milvus 2.6 simplifies these embedding workflows with the new <strong>Function</strong> interface that integrates third-party embedding models directly into your search pipeline. Instead of pre-computing embeddings, you can now:</p>
<ol>
<li><p><strong>Insert raw data directly</strong>: Submit text, images, or other content to Milvus</p></li>
<li><p><strong>Configure embedding providers</strong>: Connect to embedding API services from OpenAI, AWS Bedrock, Google Vertex AI, Hugging Face, and more.</p></li>
<li><p><strong>Query using natural language</strong>: Search using raw text queries directly</p></li>
</ol>
<p>This creates a “Data-In, Data-Out” experience where Milvus streamlines all the behind-the-scenes vector transformations for you.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">Architectural Evolution: Scaling to Tens of Billions of Vectors<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 introduces fundamental architectural innovations that enable cost-effective scaling to tens of billions of vectors.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">Replacing Kafka and Pulsar with a New Woodpecker WAL</h3><p>Previous Milvus deployments relied on external message queues, such as Kafka or Pulsar, as the Write-Ahead Log (WAL) system. While these systems initially worked well, they introduced significant operational complexity and resource overhead.</p>
<p>Milvus 2.6 introduces <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker</strong></a>, a purpose-built, cloud-native WAL system that eliminates these external dependencies through a revolutionary zero-disk design:</p>
<ul>
<li><p><strong>Everything on object storage</strong>: All log data is persisted in object storage like S3, Google Cloud Storage, or MinIO</p></li>
<li><p><strong>Distributed metadata</strong>: Metadata is still managed by the etcd key-value store</p></li>
<li><p><strong>No local disk dependencies</strong>: A choice to eliminate complex architecture and operational overhead involved in distributed local permanent state.</p></li>
</ul>
<p>We ran comprehensive benchmarks comparing Woodpecker’s performance:</p>
<table>
<thead>
<tr><th><strong>System</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Throughput</td><td>129.96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latency</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1.8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Woodpecker consistently reaches 60-80% of the theoretical maximum throughput for each storage backend, with local file system mode achieving 450 MB/s—3.5× faster than Kafka—and S3 mode reaching 750 MB/s, 5.8× higher than Kafka.</p>
<p>For more details about Woodpecker, check out this blog: <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">Search Freshness Achieved Economically</h3><p>Mission-critical search usually requires newly ingested data to be instantly searchable. Milvus 2.6 replaces message queue dependency to fundamentally improve the handling of fresh updates and provide search freshness at lower resource overhead. The new architecture adds the new <strong>Streaming Node</strong>, a dedicated component that works in close coordination with other Milvus components like the Query Node and Data Node. Streaming Node is built on top of Woodpecker, our lightweight, cloud-native Write-Ahead Log (WAL) system.</p>
<p>This new component enables:</p>
<ul>
<li><p><strong>Great compatibility</strong>: Works with both the new Woodpecker WAL and is backward compatible with Kafka, Pulsar, and other streaming platforms</p></li>
<li><p><strong>Incremental indexing</strong>: New data becomes searchable immediately, without batch delays</p></li>
<li><p><strong>Continuous query serving</strong>: Simultaneous high-throughput ingestion and low-latency querying</p></li>
</ul>
<p>By isolating streaming from batch processing, the Streaming Node helps Milvus maintain stable performance and search freshness even during high-volume data ingestion. It’s designed with horizontal scalability in mind, dynamically scaling node capacity based on data throughput.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">Enhanced Multi-tenancy Capability: Scaling to 100k Collections Per Cluster</h3><p>Enterprise deployments often require tenant-level isolation. Milvus 2.6 dramatically increases the multi-tenancy support by allowing up to <strong>100,000 collections</strong> per cluster. This is a crucial improvement for organizations running a monolithic large cluster serving many tenants.</p>
<p>This improvement is made possible by numerous engineering optimizations on metadata management, resource allocation, and query planning. Milvus users can now enjoy stable performance even with tens of thousands of collections.</p>
<h3 id="Other-Improvements" class="common-anchor-header">Other Improvements</h3><p>Milvus 2.6 offers more architectural enhancements, such as CDC + BulkInsert for simplified data replication across geographic regions and Coord Merge for better cluster coordination in large-scale deployments.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Getting Started with Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 represents a massive engineering effort with dozens of new features and performance optimizations, developed collaboratively by Zilliz engineers and our amazing community contributors. While we’ve covered the headline features here, there’s more to discover. We highly recommend diving into our comprehensive <a href="https://milvus.io/docs/release_notes.md">release notes</a> to explore everything this release has to offer!</p>
<p>Complete documentation, migration guides, and tutorials are available on the<a href="https://milvus.io/"> Milvus website</a>. For questions and community support, join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
