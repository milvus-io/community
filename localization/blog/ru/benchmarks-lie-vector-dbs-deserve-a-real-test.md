---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  Uncover the performance gap in vector databases with VDBBench. Our tool tests
  under real production scenarios, ensuring your AI applications run smoothly
  without unexpected downtime.
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">The Vector Database You Chose Based on Benchmarks Might Fail in Production<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>When selecting a <a href="https://milvus.io/blog/what-is-a-vector-database.md">vector database</a> for your AI application, conventional benchmarks are like test-driving a sports car on an empty track, only to find it stalls in rush hour traffic. The uncomfortable truth? Most benchmarks only evaluate performance in artificial conditions that never exist in production environments.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Most benchmarks test vector databases <strong>after</strong> all data has been ingested and the index is fully built. But in production, data never stops flowing. You don’t get to pause your system for hours to rebuild an index.</p>
<p>We’ve seen the disconnect firsthand. For example, Elasticsearch might boast millisecond-level query speeds, but behind the scenes, we’ve watched it take <strong>over 20 hours</strong> just to optimize its index. That’s downtime no production system can afford, especially in AI workloads that demand continuous updates and instant responses.</p>
<p>With Milvus, after running countless Proof of Concept (PoC) evaluations with enterprise clients, we’ve uncovered a troubling pattern: <strong>vector databases that excel in controlled lab environments frequently struggle under actual production loads.</strong> This critical gap doesn’t just frustrate infrastructure engineers—it can derail entire AI initiatives built on these misleading performance promises.</p>
<p>That’s why we built <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>: an open-source benchmark designed from the ground up to simulate production reality. Unlike synthetic tests that cherry-pick scenarios, VDBBench pushes databases through continuous ingestion, rigorous filtering conditions, and diverse scenarios, just like your actual production workloads. Our mission is simple: give engineers a tool that shows how vector databases actually perform under real-world conditions so you can make infrastructure decisions based on trustworthy numbers.</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">The Gap between Benchmarks and Reality<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>Traditional benchmarking approaches suffer from three critical flaws that render their results practically meaningless for production decision-making:</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1. Outdated Data</h3><p>Many benchmarks still rely on outdated datasets like SIFT or<a href="https://zilliz.com/glossary/glove"> GloVe</a>, which bear little resemblance to today’s complex, high-dimensional vector embeddings generated by AI models. Consider this: SIFT contains 128-dimensional vectors, while popular embeddings from OpenAI’s embedding models range from 768 to 3072 dimensions.</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2. Vanity Metrics</h3><p>Many benchmarks focus solely on average latency or peak QPS, which creates a distorted picture. These idealized metrics fail to capture the outliers and inconsistencies that actual users experience in production environments. For example, what good is an impressive QPS number if it requires unbounded computational resources that would bankrupt your organization?</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3. Oversimplified Scenarios</h3><p>Most benchmarks test only basic, static workloads—essentially the “Hello World” of vector search. For example, they issue search requests only after the entire dataset is ingested and indexed, ignoring the dynamic reality where users search while new data streams in. This simplistic design overlooks the complex patterns defining real production systems such as concurrent queries, filtered searches, and continuous data ingestion.</p>
<p>Recognizing these flaws, we realized the industry needed a <strong>radical shift in benchmarking philosophy</strong>—one grounded in how AI systems actually behave in the wild. That’s why we built <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>.</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">From Lab to Production: How VDBBench Bridges the Gap<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench doesn’t just iterate on outdated benchmarking philosophies—it rebuilds the concept from first principles with one guiding belief: <strong>a benchmark is only valuable if it predicts actual production behavior</strong>.</p>
<p>We’ve engineered VDBBench to faithfully replicate real-world conditions across three critical dimensions: data authenticity, workload patterns, and performance measurement.</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">Modernizing the Dataset</h3><p>We’ve completely overhauled the datasets used for vectorDB benchmarking. Instead of legacy test sets like SIFT and GloVe, VDBBench uses vectors generated from state-of-the-art embedding models that power today’s AI applications.</p>
<p>To ensure relevance, especially for use cases like Retrieval-Augmented Generation (RAG), we selected corpora that reflect real-world enterprise and domain-specific scenarios. These range from general-purpose knowledge bases to vertical applications like biomedical question answering and large-scale web search.</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Embedding Model</strong></td><td><strong>Dimensions</strong></td><td><strong>Size</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td></tr>
</tbody>
</table>
<p>Table: Datasets used in VDBBench</p>
<p>VDBBench also supports custom datasets, letting you benchmark with your own data generated from your specific embedding models for your specific workloads. After all, no dataset tells a better story than your own production data.</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Production-Focused Metric Design</h3><p><strong>VDBBench prioritizes metrics that reflect real-world performance, not just lab results.</strong> We’ve redesigned benchmarking around what actually matters in production environments: reliability under load, tail latency, sustained throughput, and accuracy.</p>
<ul>
<li><p><strong>P95/P99 latency to measure real user experience</strong>: Average/median latency masks the outliers that frustrate real users. That’s why VDBBench focuses on tail latency like P95/P99, revealing what performance 95% or 99% of your queries will actually achieve.</p></li>
<li><p><strong>Sustainable throughput under load:</strong> A system that performs well for 5 seconds doesn’t cut it in production. VDBBench gradually increases concurrency to find your database’s maximum sustainable queries per second (<code translate="no">max_qps</code>)—not the peak number under short, ideal conditions. This shows how well your system holds up over time.</p></li>
<li><p><strong>Recall balanced with performance:</strong> Speed without accuracy is meaningless. Every performance number in VDBBench is paired with recall, so you know exactly how much relevance you’re trading off for throughput. This enables fair, apples-to-apples comparisons between systems with vastly different internal tradeoffs.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Test Methodology That Reflects Reality</h3><p>A key innovation in VDBBench’s design is the <strong>separation of serial and concurrent testing</strong>, which helps capture how systems behave under different types of load. For instance, latency metrics are divided as follows:</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> measures system performance under minimal load, where only one request is processed at a time. This represents the <em>best-case scenario</em> for latency.</p></li>
<li><p><code translate="no">conc_latency_p99</code> captures system behavior under <em>realistic, high-concurrency conditions</em>, where multiple requests arrive simultaneously.</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">Two Benchmark Phases</h3><p>VDBBench separates testing into two crucial phases:</p>
<ol>
<li><strong>Serial Test</strong></li>
</ol>
<p>This is a single-process run of 1,000 queries. This phase establishes a baseline for ideal performance and accuracy, reporting both <code translate="no">serial_latency_p99</code> and recall.</p>
<ol start="2">
<li><strong>Concurrency Test</strong></li>
</ol>
<p>This phase simulates a production environment under sustained load.</p>
<ul>
<li><p><strong>Realistic client simulation</strong>: Each test process operates independently with its own connection and query set. This avoids shared-state (e.g., cache) interference that could distort results.</p></li>
<li><p><strong>Synchronized start</strong>: All processes begin simultaneously, ensuring that the measured QPS accurately reflects the claimed concurrency level.</p></li>
</ul>
<p>These carefully structured methods ensure that the <code translate="no">max_qps</code> and <code translate="no">conc_latency_p99</code> values reported by VDBBench are both <strong>accurate and production-relevant</strong>, providing meaningful insights for production capacity planning and system design.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: QPS and Latency of Milvus-16c64g-standalone at Varying Concurrency Levels (Cohere 1M Test). In this test, Milvus is initially underutilized—up to</em> <strong><em>concurrency level 20</em></strong><em>, increasing concurrency improves system utilization and results in higher QPS. Beyond</em> <strong><em>concurrency 20</em></strong><em>, the system reaches full load: further increases in concurrency no longer improve throughput, and latency rises due to queuing delays.</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">Beyond Searching Static Data: The Real Production Scenarios<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>To the best of our knowledge, VDBBench is the only benchmark tool that tests vector databases across the complete spectrum of production-critical scenarios, including static collection, filtering, and streaming cases.</p>
<h3 id="Static-Collection" class="common-anchor-header">Static Collection</h3><p>Unlike other benchmarks that rush into testing, VDBBench first ensures each database has fully optimized its indexes—a critical production prerequisite that many benchmarks often neglect. This gives you the complete picture:</p>
<ul>
<li><p>Data ingestion time</p></li>
<li><p>Indexing time (the time used to build an optimized index, which dramatically affects search performance)</p></li>
<li><p>Search performance on fully optimized indexes under both serial and concurrent conditions</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">Filtering</h3><p>Vector search in production rarely happens in isolation. Real applications combine vector similarity with metadata filtering (“find shoes that look like this photo but cost under $100”). This filtered vector search creates unique challenges:</p>
<ul>
<li><p><strong>Filter Complexity</strong>: More scalar columns and logic conditions increase computational demands</p></li>
<li><p><strong>Filter Selectiveness</strong>: <a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Our production experience</a> reveals this as the hidden performance killer—query speeds can fluctuate by orders of magnitude depending on how selective filters are</p></li>
</ul>
<p>VDBBench systematically evaluates filter performance across varying selectivity levels (from 50% to 99.9%), delivering a comprehensive profile of how databases handle this critical production pattern.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: QPS and Recall of Milvus and OpenSearch Across Different Filter Selectivity Levels (Cohere 1M Test). The X-axis represents the percentage of data filtered. As shown, Milvus maintains consistently high recall across all filter selectivity levels, while OpenSearch exhibits unstable performance, with recall fluctuating significantly under different filtering conditions.</em></p>
<h3 id="Streaming" class="common-anchor-header">Streaming</h3><p>Production systems rarely enjoy the luxury of static data. New information continuously flows in while searches execute—a scenario where many otherwise impressive databases collapse.</p>
<p>VDBBench’s unique streaming test case examines search-while-inserting performance, measuring:</p>
<ol>
<li><p><strong>Impact of Growing Data Volume</strong>: How search performance scales with increasing data size.</p></li>
<li><p><strong>Impact of Write Load</strong>: How concurrent writes affect search latency and throughput, as write also consumes CPU or memory resources in the system.</p></li>
</ol>
<p>Streaming scenarios represent a comprehensive stress test for any vector database. But building a <em>fair</em> benchmark for this isn’t trivial. It’s not enough to describe how one system behaves—we need a consistent evaluation model that enables <strong>apples-to-apples comparisons</strong> across different databases.</p>
<p>Drawing from our experience helping enterprises with real-world deployments, we built a structured, repeatable approach. With VDBBench:</p>
<ul>
<li><p>You <strong>define a fixed insertion rate</strong> that mirrors your target production workload.</p></li>
<li><p>VDBBench then applies <strong>identical load pressure</strong> across all systems, ensuring performance results are directly comparable.</p></li>
</ul>
<p>For example, with a Cohere 10M dataset and a 500 rows/second ingestion target:</p>
<ul>
<li><p>VDBBench spins up 5 parallel producer processes, each inserting 100 rows per second.</p></li>
<li><p>After every 10% of data is ingested, VDBBench triggers a round of search testing under both serial and concurrent conditions.</p></li>
<li><p>Metrics such as latency, QPS, and recall are recorded after each stage.</p></li>
</ul>
<p>This controlled methodology reveals how each system’s performance evolves over time and under real operational stress—giving you the insight you need to make infrastructure decisions that scale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: QPS and Recall of Pinecone vs. Elasticsearch in the Cohere 10M Streaming Test (500 rows/s Ingestion Rate). Pinecone maintained higher QPS and recall, showing a significant QPS improvement after inserting 100% of the data.</em></p>
<p>But this is not the end of the story. VDBBench goes even further by supporting an optional optimization step, allowing users to compare streaming search performance before and after index optimization. It also tracks and reports the actual time spent on each stage, offering deeper insights into system efficiency and behavior under production-like conditions.</p>
<p>​
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: QPS and Recall of Pinecone vs. Elasticsearch in the Cohere 10M Streaming Test After Optimization (500 rows/s Ingestion Rate)</em></p>
<p>As shown in the diagram, ElasticSearch surpassed Pinecone in QPS—after index optimization. A miracle? Not quite. The right chart tells the full story: once the x-axis reflects actual elapsed time, it’s clear that ElasticSearch took significantly longer to reach that performance. And in production, that delay matters. This comparison reveals a key tradeoff: peak throughput vs. time-to-serve.</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">Choose Your Vector Database with Confidence<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>The gap between benchmark results and real-world performance shouldn’t be a guessing game. VDBBench provides a way to evaluate vector databases under realistic, production-like conditions, including continuous data ingestion, metadata filtering, and streaming workloads.</p>
<p>If you’re planning to deploy a vector database in production, it’s worth understanding how it performs beyond idealized lab tests. VDBBench is open-source, transparent, and designed to support meaningful, apples-to-apples comparisons.</p>
<p>Try VDBBench with your own workloads today and see how different systems hold up in practice: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a>.</p>
<p>Have questions or want to share your results? Join the conversation on<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> or connect with our community on <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>. We’d love to hear your opinions.</p>
