---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: >
  Announcing VDBBench 1.0: Open-Source Vector Database Benchmarking with Your
  Real-World Production Workloads
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  Discover VDBBench 1.0, an open-source tool for benchmarking vector databases
  with real-world data, streaming ingestion, and concurrent workloads.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>Most vector database benchmarks test with static data and pre-built indexes. But production systems don’t work that way—data flows continuously while users run queries, filters fragment indexes, and performance characteristics shift dramatically under concurrent read/write loads.</p>
<p>Today we’re releasing <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>, an open-source benchmark designed from the ground up to test vector databases under realistic production conditions: streaming data ingestion, metadata filtering with varying selectivity, and concurrent workloads that reveal actual system bottlenecks.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>Download VDBBench 1.0 →</strong></a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>View Leaderboard →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">Why Current Benchmarks Are Misleading<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s be honest—there’s a strange phenomenon in our industry. Everyone talks about “not gaming benchmarks,” yet many participate in exactly that behavior. Since the vector database market exploded in 2023, we’ve seen numerous examples of systems that “benchmark beautifully” but “fail miserably” in production, wasting engineering time and damaging project credibility.</p>
<p>We’ve witnessed this disconnect firsthand. For example, Elasticsearch boasts millisecond-level query speeds, but behind the scenes, it can take over 20 hours just to optimize its index. What production system can tolerate such downtime?</p>
<p>The problem stems from three fundamental flaws:</p>
<ul>
<li><p><strong>Outdated datasets:</strong> Many benchmarks still rely on legacy datasets like SIFT (128 dimensions) while modern embeddings range from 768-3,072 dimensions. The performance characteristics of systems operating on 128D vs. 1024D+ vectors are fundamentally different—memory access patterns, index efficiency, and computational complexity all change dramatically.</p></li>
<li><p><strong>Vanity metrics:</strong> Benchmarks focus on average latency or peak QPS, creating a distorted picture. A system with 10ms average latency but 2-second P99 latency creates a terrible user experience. Peak throughput measured over 30 seconds tells you nothing about sustained performance.</p></li>
<li><p><strong>Oversimplified scenarios:</strong> Most benchmarks test basic “write data, build index, query” workflows—essentially “Hello World” level testing. Real production involves continuous data ingestion while serving queries, complex metadata filtering that fragments indexes, and concurrent read/write operations competing for resources.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">What’s New in VDBBench 1.0?<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench doesn’t just iterate on outdated benchmarking philosophies—it rebuilds the concept from first principles with one guiding belief: a benchmark is only valuable if it predicts actual production behavior.</p>
<p>We’ve engineered VDBBench to faithfully replicate real-world conditions across three critical dimensions: <strong>data authenticity, workload patterns, and performance measurement methodologies.</strong></p>
<p>Let’s take a closer look at what new features are brought to the table.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 Redesigned Dashboard with Production-Relevant Visualizations</strong></h3><p>Most benchmarks focus only on raw data output, but what matters is how engineers interpret and act on those results. We redesigned the UI to prioritize clarity and interactivity—enabling you to spot performance gaps between systems and make fast infrastructure decisions.</p>
<p>The new dashboard visualizes not just performance numbers, but the relationships between them: how QPS degrades under different filter selectivity levels, how recall fluctuates during streaming ingestion, and how latency distributions reveal system stability characteristics.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We’ve retested major vector database platforms including <strong>Milvus, Zilliz Cloud, Elastic Cloud, Qdrant Cloud, Pinecone, and OpenSearch</strong> with their latest configurations and recommended settings, ensuring all benchmark data reflects current capabilities. All testing results are available at the<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a>.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ Tag Filtering: The Hidden Performance Killer</h3><p>Real-world queries rarely happen in isolation. Applications combine vector similarity with metadata filtering (“find shoes that look like this photo but cost under $100”). This filtered vector search creates unique challenges that most benchmarks completely ignore.</p>
<p>Filtered searches introduce complexity in two critical areas:</p>
<ul>
<li><p><strong>Filter Complexity</strong>: More scalar fields and complex logical conditions increase computational demands and can cause insufficient recall and graph index fragmentation.</p></li>
<li><p><strong>Filter Selectivity</strong>: This is the “hidden performance killer” we’ve repeatedly verified in production. When filtering conditions become highly selective (filtering out 99%+ of data), query speeds can fluctuate by orders of magnitude, and recall can become unstable as index structures struggle with sparse result sets.</p></li>
</ul>
<p>VDBBench systematically tests various filtering selectivity levels (from 50% to 99.9%), providing a comprehensive performance profile under this critical production pattern. The results often reveal dramatic performance cliffs that would never show up in traditional benchmarks.</p>
<p><strong>Example</strong>: In Cohere 1M tests, Milvus maintained consistently high recall across all filter selectivity levels, while OpenSearch exhibited unstable performance with recall fluctuating significantly under different filtering conditions—falling below 0.8 recall in many cases, which is unacceptable for most production environments.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: QPS and Recall of Milvus and OpenSearch Across Different Filter Selectivity Levels (Cohere 1M Test).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 Streaming Read/Write: Beyond Static Index Testing</h3><p>Production systems rarely enjoy the luxury of static data. New information continuously flows in while searches execute—a scenario where many otherwise impressive databases collapse under the dual pressure of maintaining search performance while handling continuous writes.</p>
<p>VDBBench’s streaming scenarios simulate real parallel operations, helping developers understand system stability in high-concurrency environments, particularly how data writing impacts query performance and how performance evolves as data volume increases.</p>
<p>To ensure fair comparisons across different systems, VDBBench uses a structured approach:</p>
<ul>
<li><p>Configure controlled write rates that mirror target production workloads (e.g., 500 rows/sec distributed across 5 parallel processes)</p></li>
<li><p>Trigger search operations after every 10% of data ingestion, alternating between serial and concurrent modes</p></li>
<li><p>Record comprehensive metrics: latency distributions (including P99), sustained QPS, and recall accuracy</p></li>
<li><p>Track performance evolution over time as data volume and system stress increase</p></li>
</ul>
<p>This controlled, incremental load testing reveals how well systems maintain stability and accuracy under ongoing ingestion—something traditional benchmarks rarely capture.</p>
<p><strong>Example</strong>: In Cohere 10M streaming tests, Pinecone maintained higher QPS and recall throughout the write cycle compared to Elasticsearch. Notably, Pinecone’s performance significantly improved after ingestion completion, demonstrating strong stability under sustained load, while Elasticsearch showed more erratic behavior during active ingestion phases.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure: QPS and Recall of Pinecone vs. Elasticsearch in the Cohere 10M Streaming Test (500 rows/s Ingestion Rate).</p>
<p>VDBBench goes even further by supporting an optional optimization step, allowing users to compare streaming search performance before and after index optimization. It also tracks and reports the actual time spent on each stage, offering deeper insights into system efficiency and behavior under production-like conditions.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: QPS and Recall of Pinecone vs. Elasticsearch in the Cohere 10M Streaming Test After Optimization (500 rows/s Ingestion Rate)</em></p>
<p>As shown in our tests, Elasticsearch surpassed Pinecone in QPS—after index optimization. But when the x-axis reflects actual elapsed time, it’s clear that Elasticsearch took significantly longer to reach that performance. In production, that delay matters. This comparison reveals a key tradeoff: peak throughput vs. time-to-serve.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">🔬 Modern Datasets That Reflect Current AI Workloads</h3><p>We’ve completely overhauled the datasets used for vector database benchmarking. Instead of legacy test sets like SIFT and GloVe, VDBBench uses vectors generated from state-of-the-art embedding models like OpenAI and Cohere that power today’s AI applications.</p>
<p>To ensure relevance, especially for use cases like Retrieval-Augmented Generation (RAG), we selected corpora that reflect real-world enterprise and domain-specific scenarios:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Embedding Model</strong></td><td><strong>Dimensions</strong></td><td><strong>Size</strong></td><td><strong>Use Case</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>General knowledge base</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>Domain-specific (biomedical)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>Web-scale text processing</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td><td>Large-scale search</td></tr>
</tbody>
</table>
<p>These datasets better simulate today’s high-volume, high-dimensional vector data, enabling realistic testing of storage efficiency, query performance, and retrieval accuracy under conditions that match modern AI workloads.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ Custom Dataset Support for Industry-Specific Testing</h3><p>Every business is unique. The financial industry might need testing focused on transaction embeddings, while social platforms care more about user behavior vectors. VDBBench lets you benchmark with your own data generated from your specific embedding models for your specific workloads.</p>
<p>You can customize:</p>
<ul>
<li><p>Vector dimensions and data types</p></li>
<li><p>Metadata schema and filtering patterns</p></li>
<li><p>Data volume and ingestion patterns</p></li>
<li><p>Query distributions that match your production traffic</p></li>
</ul>
<p>After all, no dataset tells a better story than your own production data.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">How VDBBench Measures What Actually Matters in Production<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Production-Focused Metric Design</h3><p>VDBBench prioritizes metrics that reflect real-world performance, not just lab results. We’ve redesigned benchmarking around what actually matters in production environments: <strong>reliability under load, tail latency characteristics, sustained throughput, and accuracy preservation.</strong></p>
<ul>
<li><p><strong>P95/P99 Latency for Real User Experience</strong>: Average/median latency masks the outliers that frustrate real users and can indicate underlying system instability. VDBBench focuses on tail latency like P95/P99, revealing what performance 95% or 99% of your queries will actually achieve. This is crucial for SLA planning and understanding worst-case user experience.</p></li>
<li><p><strong>Sustainable Throughput Under Load</strong>: A system that performs well for 5 seconds doesn’t cut it in production. VDBBench gradually increases concurrency to find your database’s maximum sustainable queries per second (<code translate="no">max_qps</code>)—not the peak number under short, ideal conditions. This methodology reveals how well your system holds up over time and helps with realistic capacity planning.</p></li>
<li><p><strong>Recall Balanced with Performance</strong>: Speed without accuracy is meaningless. Every performance number in VDBBench is paired with recall measurements, so you know exactly how much relevance you’re trading off for throughput. This enables fair, apples-to-apples comparisons between systems with vastly different internal tradeoffs.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Test Methodology That Reflects Reality</h3><p>A key innovation in VDBBench’s design is the separation of serial and concurrent testing, which helps capture how systems behave under different types of load and reveals performance characteristics that matter for different use cases.</p>
<p><strong>Latency Measurement Separation:</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> measures system performance under minimal load, where only one request is processed at a time. This represents the best-case scenario for latency and helps identify baseline system capabilities.</p></li>
<li><p><code translate="no">conc_latency_p99</code> captures system behavior under realistic, high-concurrency conditions, where multiple requests arrive simultaneously and compete for system resources.</p></li>
</ul>
<p><strong>Two-Phase Benchmark Structure</strong>:</p>
<ol>
<li><p><strong>Serial Test</strong>: Single-process run of 1,000 queries that establishes baseline performance and accuracy, reporting both <code translate="no">serial_latency_p99</code> and recall. This phase helps identify the theoretical performance ceiling.</p></li>
<li><p><strong>Concurrency Test</strong>: Simulates production environment under sustained load with several key innovations:</p>
<ul>
<li><p><strong>Realistic client simulation</strong>: Each test process operates independently with its own connection and query set, avoiding shared-state interference that could distort results</p></li>
<li><p><strong>Synchronized start</strong>: All processes begin simultaneously, ensuring measured QPS accurately reflects claimed concurrency levels</p></li>
<li><p><strong>Independent query sets</strong>: Prevents unrealistic cache hit rates that don’t reflect production query diversity</p></li>
</ul></li>
</ol>
<p>These carefully structured methods ensure that <code translate="no">max_qps</code> and <code translate="no">conc_latency_p99</code> values reported by VDBBench are both accurate and production-relevant, providing meaningful insights for production capacity planning and system design.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">Getting Started with VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0</strong> represents a fundamental shift toward production-relevant benchmarking. By covering continuous data writing, metadata filtering with varying selectivity, and streaming loads under concurrent access patterns, it provides the closest approximation to actual production environments available today.</p>
<p>The gap between benchmark results and real-world performance shouldn’t be a guessing game. If you’re planning to deploy a vector database in production, it’s worth understanding how it performs beyond idealized lab tests. VDBBench is open-source, transparent, and designed to support meaningful, apples-to-apples comparisons.</p>
<p>Don’t be swayed by impressive numbers that don’t translate to production value. <strong>Use VDBBench 1.0 to test scenarios that matter to your business, with your data, under conditions that reflect your actual workload.</strong> The era of misleading benchmarks in vector database evaluation is ending—it’s time to make decisions based on production-relevant data.</p>
<p><strong>Try VDBBench with your own workloads:</strong><a href="https://github.com/zilliztech/VectorDBBench"> https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>View testing results of major vector databases:</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a></p>
<p>Have questions or want to share your results? Join the conversation on<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> or connect with our community on<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a>.</p>
