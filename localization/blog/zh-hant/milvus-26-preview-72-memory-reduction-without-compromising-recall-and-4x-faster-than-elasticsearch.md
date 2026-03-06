---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: >-
  Get an exclusive first look at the innovations in upcoming Milvus 2.6 that
  will redefine vector database performance and efficiency.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>Throughout this week, we’ve shared a range of exciting innovations in Milvus that push the boundaries of vector database technology:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vector Search in the Real World: How to Filter Efficiently Without Killing Recall </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie — Vector DBs Deserve a Real Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data </a></p></li>
</ul>
<p>Now, as we wrap up our Milvus Week series, I’m excited to give you a sneak peek of what’s coming in Milvus 2.6—a crucial milestone in our 2025 product roadmap that’s currently in development, and how these improvements will transform AI-powered search. This upcoming release brings together all these innovations and more across three critical fronts: <strong>cost-efficiency optimization</strong>, <strong>advanced search capabilities</strong>, and <strong>a new architecture</strong> that pushes vector search beyond 10 billion vector scale.</p>
<p>Let’s dive into some of the key improvements you can expect when Milvus 2.6 arrives this June, starting with what might be the most immediately impactful: dramatic reductions in memory usage and cost, and ultra-fast performance.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">Cost-Reduction: Slash Memory Usage While Boosting Performance<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Relying on expensive memory presents one of the biggest obstacles to scaling vector search to billions of records. Milvus 2.6 will introduce several key optimizations that dramatically lower your infrastructure costs while improving performance.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">RaBitQ 1-bit Quantization: 72% Memory Reduction with 4× QPS and No Recall Loss</h3><p>Memory consumption has long been the Achilles’ heel of large-scale vector databases. While vector quantization isn’t new, most existing approaches sacrifice too much search quality for memory savings. Milvus 2.6 will tackle this challenge head-on by introducing<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> RaBitQ 1-bit quantization</a> in production environments.</p>
<p>What makes our implementation special is the adjustable Refine optimization capability we’re building. By implementing a primary index with RaBitQ quantization plus SQ4/SQ6/SQ8 Refine options, we’ve achieved an optimal balance between memory usage and search quality (~95% recall).</p>
<p>Our preliminary benchmarks reveal promising results:</p>
<table>
<thead>
<tr><th><strong>Performance</strong> <strong>Metric</strong></th><th><strong>Traditional IVF_FLAT</strong></th><th><strong>RaBitQ (1-bit) Only</strong></th><th><strong>RaBitQ (1-bit) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>Memory Footprint</td><td>100% (baseline)</td><td>3% (97% reduction)</td><td>28% (72% reduction)</td></tr>
<tr><td>Recall Quality</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Query Throughput (QPS)</td><td>236</td><td>648 (2.7× faster)</td><td>946 (4× faster)</td></tr>
</tbody>
</table>
<p><em>Table: VectorDBBench evaluation with 1M vectors of 768 dimensions, tested on AWS m6id.2xlarge</em></p>
<p>The real breakthrough here isn’t just the memory reduction, but achieving this while simultaneously delivering a 4× throughput improvement without compromising accuracy. This means you’ll be able to serve the same workload with 75% fewer servers or handle 4× more traffic on your existing infrastructure.</p>
<p>For enterprise users using fully managed Milvus on<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, we’re developing automated configuration profiles that will dynamically adjust RaBitQ parameters based on your specific workload characteristics and precision requirements.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">400% Faster Full-text Search Than Elasticsearch</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">Full-text search</a> capabilities in vector databases have become essential for building hybrid retrieval systems. Since introducing BM25 in <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>, we’ve received enthusiastic feedback—along with requests for better performance at scale.</p>
<p>Milvus 2.6 will deliver substantial performance gains on BM25. Our testing on the BEIR dataset shows 3-4× higher throughput than Elasticsearch with equivalent recall rates. For some workloads, the improvement reaches up to 7× higher QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure: Milvus vs. Elasticsearch on throughput</p>
<h3 id="JSON-Path-Index-99-Lower-Latency-for-Complex-Filtering" class="common-anchor-header">JSON Path Index: 99% Lower Latency for Complex Filtering</h3><p>Modern AI applications rarely rely on vector similarity alone—they almost always combine vector search with metadata filtering. As these filtering conditions become more complex (especially with nested JSON objects), query performance can deteriorate rapidly.</p>
<p>Milvus 2.6 will introduce a targeted indexing mechanism for nested JSON paths that allows you to create indexes on specific paths (e.g., <code translate="no">$meta user_info.location</code>) within JSON fields. Instead of scanning entire objects, Milvus will directly look up values from pre-built indexes.</p>
<p>In our evaluation with 100 M+ records, JSON Path Index reduced filter latency from <strong>140ms</strong> (P99: 480ms) to just <strong>1.5ms</strong> (P99: 10ms)—a 99% reduction that will transform previously impractical queries into instant responses.</p>
<p>This feature will be particularly valuable for:</p>
<ul>
<li><p>Recommendation systems with complex user attribute filtering</p></li>
<li><p>RAG applications that filter documents by various labels</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">Next-Generation Search: From Basic Vector Similarity to Production-Grade Retrieval<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector search alone isn’t enough for modern AI applications. Users demand the precision of traditional information retrieval combined with the semantic understanding of vector embeddings. Milvus 2.6 will introduce several advanced search features that bridge this gap.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">Better Full-text Search with Multi-language Analyzer</h3><p>Full-text search is highly language-dependent… Milvus 2.6 will introduce a completely revamped text analysis pipeline with multi-language support:</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> syntax support for analyzer/tokenization configuration observability</p></li>
<li><p>Lindera tokenizer for Asian languages like Japanese and Korean</p></li>
<li><p>ICU tokenizer for comprehensive multilingual support</p></li>
<li><p>Granular language configuration for defining language-specific tokenization rules</p></li>
<li><p>Enhanced Jieba with support for custom dictionary integration</p></li>
<li><p>Expanded filter options for more precise text processing</p></li>
</ul>
<p>For global applications, this means better multilingual search without specialized per-language indexing or complex workarounds.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">Phrase Match: Capturing Semantic Nuance in Word Order</h3><p>Word order conveys critical meaning distinctions that keyword search often misses. Try comparing “machine learning techniques” with &quot;learning machine techniques&quot;—same words, totally different meaning.</p>
<p>Milvus 2.6 will add <strong>Phrase Match</strong>, giving users more control over word order and proximity than full-text search or exact string match:</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p>The <code translate="no">slop</code> parameter will provide flexible control over word proximity—0 requires exact consecutive matches, while higher values allow for minor variations in phrasing.</p>
<p>This feature will be particularly valuable for:</p>
<ul>
<li><p>Legal document search where exact phrasing carries legal significance</p></li>
<li><p>Technical content retrieval where term order distinguishes different concepts</p></li>
<li><p>Patent databases where specific technical phrases must be matched precisely</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">Time-Aware Decay Functions: Automatically Prioritize Fresh Content</h3><p>Information value often diminishes with time. News articles, product releases, and social posts all become less relevant as they age, yet traditional search algorithms treat all content equally, regardless of timestamp.</p>
<p>Milvus 2.6 will introduce <strong>Decay Functions</strong> for time-aware ranking that automatically adjust relevance scores based on document age.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>You’ll be able to configure:</p>
<ul>
<li><p><strong>Function type</strong>: Exponential (rapid decay), Gaussian (gradual decay), or Linear (constant decay)</p></li>
<li><p><strong>Decay rate</strong>: How quickly relevance diminishes over time</p></li>
<li><p><strong>Origin point</strong>: The reference timestamp for measuring time differences</p></li>
</ul>
<p>This time-sensitive re-ranking will ensure that the most up-to-date and contextually relevant results appear first, which is crucial for news recommendation systems, e-commerce platforms, and social media feeds.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">Data in, Data Out: From Raw Text to Vector Search in One Step</h3><p>One of the biggest developer pain points with vector databases has been the disconnect between raw data and vector embeddings. Milvus 2.6 will dramatically simplify this workflow with a new <strong>Function</strong> interface that integrates third-party embedding models directly into your data pipeline. This streamlines your vector search pipeline with one single call.</p>
<p>Instead of pre-computing embeddings, you’ll be able to:</p>
<ol>
<li><p><strong>Insert raw data directly</strong>: Submit text, images, or other content to Milvus</p></li>
<li><p><strong>Configure embedding providers for vectorization</strong>: Milvus can connect to embedding model services like OpenAI, AWS Bedrock, Google Vertex AI, and Hugging Face.</p></li>
<li><p><strong>Query using natural language</strong>: Search using text queries, not vector embeddings</p></li>
</ol>
<p>This will create a streamlined “Data-In, Data-Out” experience where Milvus handles the vector generation internally, making your application code more straightforward.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">Architectural Evolution: Scaling to Hundreds of Billions of Vectors<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>A good database doesn’t just have great features, it must also deliver those features at scale, battle-tested in production.</p>
<p>Milvus 2.6 will introduce a fundamental architectural change that enables cost-effective scaling to hundreds of billions of vectors. The highlight is a new hot-cold tiered storage architecture that intelligently manages data placement based on access patterns, automatically moving hot data to high-performance memory/SSD while placing cold data in more economical object storage. This approach can dramatically reduce costs while maintaining query performance where it matters most.</p>
<p>Additionally, a new <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">Streaming Node</a> will enable real-time vector processing with direct integration to streaming platforms like Kafka and Pulsar and the newly created <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker</a>, making new data searchable immediately without batch delays.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Stay tuned for Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 is currently in active development and will be available this June. We’re excited to bring you these breakthrough performance optimizations, advanced search capabilities, and a new architecture to help you build scalable AI applications at lower cost.</p>
<p>In the meantime, we welcome your feedback on these upcoming features. What excites you most? Which capabilities would have the most impact on your applications? Join the conversation in our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or follow our progress on<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
<p>Want to be the first to know when Milvus 2.6 is released? Follow us on<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> or<a href="https://twitter.com/milvusio"> X</a> for the latest updates.</p>
