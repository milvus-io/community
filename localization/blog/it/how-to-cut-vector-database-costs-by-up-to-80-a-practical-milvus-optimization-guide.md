---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >
  How to Cut Vector Database Costs by Up to 80%: A Practical Milvus Optimization
  Guide
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >
  Milvus is free, but the infrastructure isn't. Learn how to reduce vector
  database memory costs by 60-80% with better indexes, MMap, and tiered storage.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>Your RAG prototype worked great. Then it went to production, traffic grew, and now your vector database bill has gone from $500 to $5,000 a month. Sound familiar?</p>
<p>This is one of the most common scaling problems in AI applications right now. You’ve built something that creates real value, but the infrastructure costs are growing faster than your user base is growing. And when you look at the bill, the vector database is often the biggest surprise — in the deployments we’ve seen, it can account for roughly 40-50% of total application cost, second only to LLM API calls.</p>
<p>In this guide, I’ll walk through where the money actually goes and the specific things you can do to bring it down — in many cases by 60-80%. I’ll use <a href="https://milvus.io/">Milvus</a>, the most popular open-source vector database, as the primary example since that’s what I know best, but the principles apply to most vector databases.</p>
<p><em>To be clear:</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>itself is free and open source — you never pay for the software. The cost comes entirely from the infrastructure you run it on: cloud instances, memory, storage, and network. The good news is that most of that infrastructure cost is reducible.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">Where Does the Money Actually Go When Using a VectorDB?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s start with a concrete example. Say you have 100 million vectors, 768 dimensions, stored as float32 — a pretty typical RAG setup. Here’s roughly what that costs on AWS per month:</p>
<table>
<thead>
<tr><th><strong>Cost Component</strong></th><th><strong>Share</strong></th><th><strong>~Monthly Cost</strong></th><th><strong>Notes</strong></th></tr>
</thead>
<tbody>
<tr><td>Compute   (CPU + memory)</td><td>85-90%</td><td>$2,800</td><td>The big one — mostly driven by memory</td></tr>
<tr><td>Network</td><td>5-10%</td><td>$250</td><td>Cross-AZ traffic, large result payloads</td></tr>
<tr><td>Storage</td><td>2-5%</td><td>$100</td><td>Cheap — object storage (S3/MinIO) is ~$0.03/GB</td></tr>
</tbody>
</table>
<p>The takeaway is simple: memory is where 85-90% of your money goes. Network and storage matter at the margins, but if you want to cut costs meaningfully, memory is the lever. Everything in this guide focuses on that.</p>
<p><strong>Quick note on network and storage:</strong> You can reduce network costs by only returning the fields you need (ID, score, key metadata) and avoiding cross-region queries. For storage, Milvus already separates storage from compute — your vectors sit in cheap object storage like S3, so even at 100M vectors, storage is usually under $50/month. Neither of these will move the needle like memory optimization will.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">Why Memory Is So Expensive for Vector Search<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>If you’re coming from traditional databases, the memory requirements for vector search can be surprising. A relational database can leverage disk-based B-tree indexes and the OS page cache. Vector search is different — it involves massive floating-point computation, and indexes like HNSW or IVF need to stay loaded in memory to deliver millisecond-level latency.</p>
<p>Here’s a quick formula to estimate your memory needs:</p>
<p><strong>Memory required = (vectors × dimensions × 4 bytes) × index multiplier</strong></p>
<p>For our 100M × 768 × float32 example with HNSW (multiplier ~1.8x):</p>
<ul>
<li>Raw data: 100M × 768 × 4 bytes ≈ 307 GB</li>
<li>With HNSW index: 307 GB × 1.8 ≈ 553 GB</li>
<li>With OS overhead, cache, and headroom: ~768 GB total</li>
<li>On AWS: 3× r6i.8xlarge (256 GB each) ≈ $2,800/month</li>
</ul>
<p><strong>That’s the baseline. Now let’s look at how to bring it down.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. Pick the Right Index to Get 4x Less Memory Usage<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>This is the single highest-impact change you can make. For the same 100M-vector dataset, memory usage can vary by 4-6x depending on your index choice.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: almost no compression, so memory usage stays close to the raw data size, around <strong>300 GB</strong></li>
<li><strong>HNSW</strong>: stores an extra graph structure, so memory usage is usually <strong>1.5x to 2.0x</strong> the raw data size, or about <strong>450 to 600 GB</strong></li>
<li><strong>IVF_SQ8</strong>: compresses float32 values into uint8, giving about <strong>4x compression</strong>, so memory use can drop to around <strong>75 to 100 GB</strong></li>
<li><strong>IVF_PQ / DiskANN</strong>: use stronger compression or a disk-based index, so memory can drop further to about <strong>30 to 60 GB</strong></li>
</ul>
<p>Many teams start with HNSW because it has the best query speed, but they end up paying 3-5x more than they need to.</p>
<p>Here’s how the main index types compare:</p>
<table>
<thead>
<tr><th><strong>Index</strong></th><th><strong>Memory Multiplier</strong></th><th><strong>Query Speed</strong></th><th><strong>Recall</strong></th><th><strong>Best For</strong></th></tr>
</thead>
<tbody>
<tr><td>FLAT</td><td>~1.0x</td><td>Slow</td><td>100%</td><td>Small datasets (&lt;1M), testing</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>Medium</td><td>95-99%</td><td>General use</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>Medium</td><td>93-97%</td><td>Cost-sensitive production (recommended)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>Fast</td><td>70-80%</td><td>Very large datasets, coarse retrieval</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>Very fast</td><td>98-99%</td><td>Only when latency matters more than cost</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>Medium</td><td>95-98%</td><td>Very large scale with NVMe SSDs</td></tr>
</tbody>
</table>
<p><strong>The bottom line:</strong> Switching from HNSW or IVF_FLAT to IVF_SQ8 typically drops recall by only 2-3% (e.g., from 97% to 94-95%) while cutting memory cost by about 70%. For most RAG workloads, that tradeoff is absolutely worth it. If you’re doing coarse retrieval or your accuracy bar is lower, IVF_PQ or IVF_RABITQ can further boost savings.</p>
<p><strong>My recommendation:</strong> If you’re running HNSW in production and cost is a concern, try IVF_SQ8 on a test collection first. Measure recall on your actual queries. Most teams are surprised by how small the accuracy drop is.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. Stop Loading Everything into Memory for 60%-80% Cost Reduction<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Even after picking a more efficient index, you might still have more data in memory than necessary. Milvus offers two ways to fix this: <strong>MMap (available since 2.3) and tiered storage (available since 2.6). Both can reduce memory usage by 60-80%.</strong></p>
<p>The core idea behind both is the same: not all your data needs to live in memory at all times. The difference is how they handle the data that’s not in memory.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (Memory-Mapped Files)</h3><p>MMap maps your data files from local disk into the process address space. The full dataset remains on the node’s local disk, and the OS loads pages into memory on demand—only when they’re accessed. Before using MMap, all data gets downloaded from object storage (S3/MinIO) to the QueryNode’s local disk.</p>
<ul>
<li>Memory usage drops to ~10-30% of full-load mode</li>
<li>Latency stays stable and predictable (data is on local disk, no network fetch)</li>
<li>Tradeoff: local disk must be large enough to hold the full dataset</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">Tiered Storage</h3><p>Tiered storage takes it a step further. Instead of downloading everything to the local disk, it uses the local disk as a cache for hot data and keeps object storage as the primary layer. Data is fetched from object storage only when needed.</p>
<ul>
<li>Memory usage drops to &lt;10% of full-load mode</li>
<li>Local disk usage also drops — only hot data is cached (usually 10-30% of total)</li>
<li>Tradeoff: cache misses add 50-200ms latency (fetching from object storage)</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">Data flow and resource usage</h3><table>
<thead>
<tr><th><strong>Mode</strong></th><th><strong>Data Flow</strong></th><th><strong>Memory Usage</strong></th><th><strong>Local Disk Usage</strong></th><th><strong>Latency</strong></th></tr>
</thead>
<tbody>
<tr><td>Traditional full load</td><td>Object storage → memory (100%)</td><td>Very high (100%)</td><td>Low (temporary only)</td><td>Very low and stable</td></tr>
<tr><td>MMap</td><td>Object storage → local disk (100%) → memory (on demand)</td><td>Low (10-30%)</td><td>High (100%)</td><td>Low and stable</td></tr>
<tr><td>Tiered storage</td><td>Object storage ↔ local cache (hot data) → memory (on demand)</td><td>Very low (&lt;10%)</td><td>Low (hot data only)</td><td>Low on cache hit, higher on cache miss</td></tr>
</tbody>
</table>
<p><strong>Hardware recommendation:</strong> both methods depend heavily on local disk I/O, so <strong>NVMe SSDs</strong> are strongly recommended, ideally with <strong>IOPS above 10,000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap vs. Tiered Storage: Which One Should You Use?</h3><table>
<thead>
<tr><th><strong>Your Situation</strong></th><th><strong>Use This</strong></th><th><strong>Why</strong></th></tr>
</thead>
<tbody>
<tr><td>Latency-sensitive (P99 &lt; 20ms)</td><td>MMap</td><td>Data is already on local disk — no network fetch, stable latency</td></tr>
<tr><td>Uniform access (no clear hot/cold split)</td><td>MMap</td><td>Tiered storage needs hot/cold skew to be effective; without it, cache hit rate is low</td></tr>
<tr><td>Cost is the priority (occasional latency spikes OK)</td><td>Tiered storage</td><td>Saves on both memory and local disk (70-90% less disk)</td></tr>
<tr><td>Clear hot/cold pattern (80/20 rule)</td><td>Tiered storage</td><td>Hot data stays cached, cold data stays cheap in object storage</td></tr>
<tr><td>Very large scale (&gt;500M vectors)</td><td>Tiered storage</td><td>One node’s local disk often can’t hold the full dataset at this scale</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> MMap requires Milvus 2.3+. Tiered storage requires Milvus 2.6+. Both work best with NVMe SSDs (10,000+ IOPS recommended).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">How to Configure MMap</h3><p><strong>Option 1: YAML configuration (recommended for new deployments)</strong></p>
<p>Edit the Milvus configuration file milvus.yaml and add the following settings under the queryNode section:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Option 2: Python SDK configuration (for existing collections)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">How to Configure Tiered Storage (Milvus 2.6+)</h3><p>Edit the Milvus configuration file milvus.yaml and add the following settings under the queryNode section:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">Use Lower-Dimensional Embeddings<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>This one is easy to overlook, but the dimension directly scales your cost. Memory, storage, and compute all grow linearly with dimension count. A 1536-dim model costs roughly 4x more infrastructure than a 384-dim model for the same data.</p>
<p>Query cost scales the same way — cosine similarity is O(D), so 768-dim vectors take about twice the compute of 384-dim vectors per query. In high-QPS workloads, that difference translates directly into fewer nodes needed.</p>
<p>Here’s how common embedding models compare (using 384-dim as the 1.0x baseline):</p>
<table>
<thead>
<tr><th><strong>Model</strong></th><th><strong>Dimensions</strong></th><th><strong>Relative Cost</strong></th><th><strong>Recall</strong></th><th><strong>Best For</strong></th></tr>
</thead>
<tbody>
<tr><td>text-embedding-3-large</td><td>3072</td><td>8.0x</td><td>98%+</td><td>When accuracy is non-negotiable (research, healthcare)</td></tr>
<tr><td>text-embedding-3-small</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>General RAG workloads</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>Good cost-performance balance</td></tr>
<tr><td>all-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>Cost-sensitive workloads</td></tr>
</tbody>
</table>
<p><strong>Practical advice:</strong> Don’t assume you need the biggest model. Test on a representative sample of your actual queries (1M vectors is usually enough) and find the lowest-dimension model that meets your accuracy bar. Many teams discover that 768 dimensions works just as well as 1536 for their use case.</p>
<p><strong>Already committed to a high-dimensional model?</strong> You can reduce dimensions after the fact. PCA (Principal Component Analysis) can strip out redundant features, and <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">Matryoshka embeddings</a> let you truncate to the first N dimensions while retaining most of the quality. Both are worth trying before re-embedding your entire dataset.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">Manage Data Lifecycle with Compaction and TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>This one is less glamorous but still matters, especially for long-running production systems. Milvus uses an append-only storage model: when you delete data, it’s marked as deleted but not removed immediately. Over time, this dead data accumulates, wastes storage space, and causes queries to scan more rows than they need to.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">Compaction: Reclaim Storage from Deleted Data</h3><p>Compaction is Milvus’s background process for cleaning up. It merges small segments, physically removes deleted data, and rewrites compacted files. You’ll want this if:</p>
<ul>
<li>You have frequent writes and deletes (product catalogs, content updates, real-time logs)</li>
<li>Your segment count keeps growing (this increases per-query overhead)</li>
<li>Storage usage is growing much faster than your actual valid data</li>
</ul>
<p><strong>Heads up:</strong> Compaction is I/O-intensive. Schedule it during low-traffic periods (e.g., nightly) or tune the triggers carefully so it doesn’t compete with production queries.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL(Time to Live): Automatically Expire Old Vector Data</h3><p>For data that naturally expires, TTL is cleaner than manual deletion. Set a lifetime on your data, and Milvus automatically marks it for deletion when it expires. Compaction handles the actual cleanup.</p>
<p>This is useful for:</p>
<ul>
<li>Logs and session data — keep only the last 7 or 30 days</li>
<li>Time-sensitive RAG — prefer recent knowledge, let old documents expire</li>
<li>Real-time recommendations — only retrieve from recent user behavior</li>
</ul>
<p>Together, compaction and TTL keep your system from silently accumulating waste. It’s not the biggest cost lever, but it prevents the kind of slow storage creep that catches teams off guard.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">One More Option: Zilliz Cloud (Fully Managed Milvus)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Full disclosure: <a href="https://zilliz.com/">Zilliz Cloud</a> is built by the same team behind Milvus, so take this with the appropriate grain of salt.</p>
<p>That said, here’s the counterintuitive part: even though Milvus is free and open source, a managed service can actually cost less than self-hosting. The reason is simple — the software is free, but the cloud infrastructure to run it isn’t, and you need engineers to operate and maintain it. If a managed service can do the same work with fewer machines and fewer engineer hours, your total bill goes down even after paying for the service itself.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> is a fully managed service built on Milvus and API-compatible with it. Two things are relevant to cost:</p>
<ul>
<li><strong>Better performance per node.</strong> Zilliz Cloud runs on Cardinal, our optimized search engine. Based on <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">VectorDBBench results</a>, it delivers 3-5x higher throughput than open-source Milvus and is 10x faster. In practice, that means you need roughly one-third to one-fifth as many compute nodes for the same workload.</li>
<li><strong>Built-in optimizations.</strong> The features covered in this guide — MMap, tiered storage, and index quantization — are built in and automatically tuned. Auto-scaling adjusts capacity based on actual load, so you’re not paying for headroom you don’t need.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/zilliz-migration-service">Migration</a> is straightforward since the APIs and data formats are compatible. Zilliz also provides migration tooling to help. For a detailed comparison, see: <a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs. Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">Summary: A Step-by-Step Plan to Cut Vector Database Costs<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>If you only do one thing, do this: check your index type.</strong></p>
<p>If you’re running HNSW on a cost-sensitive workload, switch to IVF_SQ8. That alone can cut memory cost by ~70% with minimal recall loss.</p>
<p>If you want to go further, here’s the priority order:</p>
<ul>
<li><strong>Switch your index</strong> — HNSW → IVF_SQ8 for most workloads. Biggest bang for zero architectural change.</li>
<li><strong>Enable MMap or tiered storage</strong> — Stop keeping everything in memory. This is a config change, not a redesign.</li>
<li><strong>Evaluate your embedding dimensions</strong> — Test whether a smaller model meets your accuracy needs. This requires re-embedding but the savings compound.</li>
<li><strong>Set up compaction and TTL</strong> — Prevent silent data bloat, especially if you have frequent writes/deletes.</li>
</ul>
<p>Combined, these strategies can reduce your vector database bill by 60-80%. Not every team needs all four — start with the index change, measure the impact, and work your way down the list.</p>
<p>For teams looking to reduce operational work and improve cost efficiency, <a href="https://zilliz.com/">Zilliz Cloud</a> (managed Milvus) is another option.</p>
<p>If you’re working through any of these optimizations and want to compare notes, the <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus community Slack</a> is a good place to ask questions. You can also join <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> for a quick chat with the engineering team about your specific setup.</p>
