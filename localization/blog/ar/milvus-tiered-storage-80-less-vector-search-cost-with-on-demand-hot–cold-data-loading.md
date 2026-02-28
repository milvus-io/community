---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: >
  Stop Paying for Cold Data: 80% Cost Reduction with On-Demand Hot–Cold Data
  Loading in Milvus Tiered Storage
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  Learn how Tiered Storage in Milvus enables on-demand loading for hot and cold
  data, delivering up to 80% cost reduction and faster load times at scale.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>How many of you are still paying premium infrastructure bills for data your system barely touches? Be honest — most teams are.</strong></p>
<p>If you run vector search in production, you’ve probably seen this firsthand. You provision large amounts of memory and SSDs so everything stays “query-ready,” even though only a small slice of your dataset is actually active. And you’re not alone. We’ve seen a lot of similar cases as well:</p>
<ul>
<li><p><strong>Multi-tenant SaaS platforms:</strong> Hundreds of onboarded tenants, but only 10–15% active on any given day. The rest sit cold but still occupy resources.</p></li>
<li><p><strong>E-commerce recommendation systems:</strong> A million SKUs, yet the top 8% of products generate most of the recommendations and search traffic.</p></li>
<li><p><strong>AI search:</strong> Vast archives of embeddings, even though 90% of user queries hit items from the past week.</p></li>
</ul>
<p>It’s the same story across industries: <strong>less than 10% of your data gets queried frequently, but it often consumes 80% of your storage and memory.</strong> Everyone knows the imbalance exists — but until recently, there hasn’t been a clean architectural way to fix it.</p>
<p><strong>That changes with</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>.</strong></p>
<p>Before this release, Milvus (like most vector databases) depended on <strong>a full-load model</strong>: if data needed to be searchable, it had to be loaded onto local nodes. It didn’t matter whether that data was hit a thousand times a minute or once a quarter — <strong>it all had to stay hot.</strong> That design choice ensured predictable performance, but it also meant oversizing clusters and paying for resources that cold data simply didn’t deserve.</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">Tiered Storage</a> <strong>is our answer.</strong></p>
<p>Milvus 2.6 introduces a new tiered storage architecture with <strong>true on-demand loading</strong>, letting the system differentiate between hot and cold data automatically:</p>
<ul>
<li><p>Hot segments stay cached close to the compute</p></li>
<li><p>Cold segments live cheaply in remote object storage</p></li>
<li><p>Data is pulled into local nodes <strong>only when a query actually needs it</strong></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This shifts your cost structure from “how much data you have” to <strong>“how much data you actually use.”</strong> And in early production deployments, this simple shift delivers <strong>up to an 80% reduction in storage and memory cost</strong>.</p>
<p>In the rest of this post, we’ll walk through how Tiered Storage works, share real performance results, and show where this change delivers the biggest impact.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">Why Full Loading Breaks Down at Scale<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>Before diving into the solution, it’s worth taking a closer look at why the <strong>full-load mode</strong> used in Milvus 2.5 and earlier releases became a limiting factor as workloads scaled.</p>
<p>In Milvus 2.5 and earlier, when a user issued a <code translate="no">Collection.load()</code> request, each QueryNode cached the entire collection locally, including metadata, field data, and indexes. These components are downloaded from object storage and stored either fully in memory or memory-mapped (mmap) to local disk. Only after <em>all</em> of this data is available locally is the collection marked as loaded and ready to serve queries.</p>
<p>In other words, the collection is not queryable until the full dataset—hot or cold—is present on the node.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Note:</strong> For index types that embed raw vector data, Milvus loads only the index files, not the vector field separately. Even so, the index must be fully loaded to serve queries, regardless of how much of the data is actually accessed.</p>
<p>To see why this becomes problematic, consider a concrete example:</p>
<p>Suppose you have a mid-sized vector dataset with:</p>
<ul>
<li><p><strong>100 million vectors</strong></p></li>
<li><p><strong>768 dimensions</strong> (BERT embeddings)</p></li>
<li><p><strong>float32</strong> precision (4 bytes per dimension)</p></li>
<li><p>An <strong>HNSW index</strong></p></li>
</ul>
<p>In this setup, the HNSW index alone—including the embedded raw vectors—consumes approximately 430 GB of memory. After adding common scalar fields such as user IDs, timestamps, or category labels, total local resource usage easily exceeds 500 GB.</p>
<p>This means that even if 80% of the data is rarely or never queried, the system must still provision and hold more than 500 GB of local memory or disk just to keep the collection online.</p>
<p>For some workloads, this behavior is acceptable:</p>
<ul>
<li><p>If nearly all data is frequently accessed, fully loading everything delivers the lowest possible query latency—at the highest cost.</p></li>
<li><p>If data can be divided into hot and warm subsets, memory-mapping warm data to disk can partially reduce memory pressure.</p></li>
</ul>
<p>However, in workloads where 80% or more of the data sits in the long tail, the drawbacks of full loading surface quickly, across both <strong>performance</strong> and <strong>cost</strong>.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">Performance bottlenecks</h3><p>In practice, full loading affects more than query performance and often slows down routine operational workflows:</p>
<ul>
<li><p><strong>Longer rolling upgrades:</strong> In large clusters, rolling upgrades can take hours or even a full day, as each node must reload the entire dataset before becoming available again.</p></li>
<li><p><strong>Slower recovery after failures:</strong> When a QueryNode restarts, it cannot serve traffic until all data is reloaded, significantly prolonging recovery time and amplifying the impact of node failures.</p></li>
<li><p><strong>Slower iteration and experimentation:</strong> Full loading slows down development workflows, forcing AI teams to wait hours for data to load when testing new datasets or index configurations.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">Cost inefficiencies</h3><p>Full loading also drives up infrastructure costs. For example, on mainstream cloud memory-optimized instances, storing 1 TB of data locally costs roughly **<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>70</mn><mo separator="true">,</mo><mn>000</mn><mi>p</mi><mi>e</mi><mi>r</mi><mi>y</mi><mi>e</mi><mi>a</mi><mi>r</mi><mo>∗</mo><mo>∗</mo><mo separator="true">,</mo><mi>b</mi><mi>a</mi><mi>s</mi><mi>e</mi><mi>d</mi><mi>o</mi><mi>n</mi><mi>c</mi><mi>o</mi><mi>n</mi><mi>s</mi><mi>e</mi><mi>r</mi><mi>v</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>v</mi><mi>e</mi><mi>p</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo stretchy="false">(</mo><mi>A</mi><mi>W</mi><mi>S</mi><mi>r</mi><mn>6</mn><mi>i</mi><mo>:</mo><mtext> </mtext></mrow><annotation encoding="application/x-tex">70,000 per year**, based on conservative pricing (AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">000</span><span class="mord mathnormal">p</span><span class="mord mathnormal">erye</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">∗</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">ba</span><span class="mord mathnormal">se</span><span class="mord mathnormal">d</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal">co</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">i</span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mord mathnormal">e</span><span class="mord mathnormal">p</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">c</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mord mathnormal" style="margin-right:0.13889em;">W</span><span class="mord mathnormal" style="margin-right:0.05764em;">S</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord">6</span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace nobreak"> </span></span></span></span>5.74 / GB / month; GCP n4-highmem: ~<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>5.68</mn><mi mathvariant="normal">/</mi><mi>G</mi><mi>B</mi><mi mathvariant="normal">/</mi><mi>m</mi><mi>o</mi><mi>n</mi><mi>t</mi><mi>h</mi><mo separator="true">;</mo><mi>A</mi><mi>z</mi><mi>u</mi><mi>r</mi><mi>e</mi><mi>E</mi><mo>−</mo><mi>s</mi><mi>e</mi><mi>r</mi><mi>i</mi><mi>e</mi><mi>s</mi><mo>:</mo><mtext> </mtext></mrow><annotation encoding="application/x-tex">5.68 / GB / month; Azure E-series: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">5.68/</span><span class="mord mathnormal" style="margin-right:0.05017em;">GB</span><span class="mord">/</span><span class="mord mathnormal">m</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">A</span><span class="mord mathnormal" style="margin-right:0.04398em;">z</span><span class="mord mathnormal">u</span><span class="mord mathnormal">re</span><span class="mord mathnormal" style="margin-right:0.05764em;">E</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span><span class="mord mathnormal">i</span><span class="mord mathnormal">es</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace nobreak"> </span></span></span></span>5.67 / GB / month).</p>
<p>Now consider a more realistic access pattern, where 80% of that data is cold and could be stored in object storage instead (at roughly $0.023 / GB / month):</p>
<ul>
<li><p>200 GB hot data × $5.68</p></li>
<li><p>800 GB cold data × $0.023</p></li>
</ul>
<p>Annual cost: (200×5.68+800×0.023)×12≈<strong>$14,000</strong></p>
<p>That’s an <strong>80% reduction</strong> in total storage cost, without sacrificing performance where it actually matters.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">What Is the Tiered Storage and How Does It Work?<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>To remove the trade-off, Milvus 2.6 introduced <strong>Tiered Storage</strong>, which balances performance and cost by treating local storage as a cache rather than a container for the entire dataset.</p>
<p>In this model, QueryNodes load only lightweight metadata at startup. Field data and indexes are fetched on demand from remote object storage when a query requires them, and cached locally if they are accessed frequently. Inactive data can be evicted to free up space.</p>
<p>As a result, hot data stays close to the compute layer for low-latency queries, while cold data remains in object storage until needed. This reduces load time, improves resource efficiency, and allows QueryNodes to query datasets far larger than their local memory or disk capacity.</p>
<p>In practice, Tiered Storage works as follows:</p>
<ul>
<li><p><strong>Keep hot data local:</strong> Roughly 20% of frequently accessed data remains resident on local nodes, ensuring low latency for the 80% of queries that matter most.</p></li>
<li><p><strong>Load cold data on demand:</strong> The remaining 80% of rarely accessed data is fetched only when needed, freeing up the majority of local memory and disk resources.</p></li>
<li><p><strong>Adapt dynamically with LRU-based eviction:</strong> Milvus uses an LRU (Least Recently Used) eviction strategy to continuously adjust which data is considered hot or cold. Inactive data is automatically evicted to make room for newly accessed data.</p></li>
</ul>
<p>With this design, Milvus is no longer constrained by the fixed capacity of local memory and disk. Instead, local resources function as a dynamically managed cache, where space is continuously reclaimed from inactive data and reallocated to active workloads.</p>
<p>Under the hood, this behavior is enabled by three core technical mechanisms:</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. Lazy Load</h3><p>At initialization, Milvus loads only minimal segment-level metadata, allowing collections to become queryable almost immediately after startup. Field data and index files remain in remote storage and are fetched on demand during query execution, keeping local memory and disk usage low.</p>
<p><strong>How collection loading worked in Milvus 2.5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>How lazy loading works in Milvus 2.6 and later</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The metadata loaded during initialization falls into four key categories:</p>
<ul>
<li><p><strong>Segment statistics</strong> (Basic information such as row count, segment size, and schema metadata)</p></li>
<li><p><strong>Timestamps</strong> (Used to support time-travel queries)</p></li>
<li><p><strong>Insert and delete records</strong> (Required to maintain data consistency during query execution)</p></li>
<li><p><strong>Bloom filters</strong> (Used for fast pre-filtering to quickly eliminate irrelevant segments)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. Partial Load</h3><p>While Lazy loading controls <em>when</em> data is loaded, partial loading controls <em>how much</em> data is loaded. Once queries or searches begin, the QueryNode performs a partial load, fetching only the required data chunks or index files from object storage.</p>
<p><strong>Vector indexes: Tenant-aware loading</strong></p>
<p>One of the most impactful capabilities introduced in Milvus 2.6+ is tenant-aware loading of vector indexes, designed specifically for multi-tenant workloads.</p>
<p>When a query accesses data from a single tenant, Milvus loads only the portion of the vector index belonging to that tenant, skipping index data for all other tenants. This keeps local resources focused on active tenants.</p>
<p>This design provides several benefits:</p>
<ul>
<li><p>Vector indexes for inactive tenants do not consume local memory or disk</p></li>
<li><p>Index data for active tenants stays cached for low-latency access</p></li>
<li><p>A tenant-level LRU eviction policy ensures fair cache usage across tenants</p></li>
</ul>
<p><strong>Scalar fields: Column-level partial loading</strong></p>
<p>Partial loading also applies to <strong>scalar fields</strong>, allowing Milvus to load only the columns explicitly referenced by a query.</p>
<p>Consider a collection with <strong>50 schema fields</strong>, such as <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">title</code>, <code translate="no">description</code>, <code translate="no">category</code>, <code translate="no">price</code>, <code translate="no">stock</code>, and <code translate="no">tags</code>, and you only need to return three fields—<code translate="no">id</code>, <code translate="no">title</code>, and <code translate="no">price</code>.</p>
<ul>
<li><p>In <strong>Milvus 2.5</strong>, all 50 scalar fields are loaded regardless of query requirements.</p></li>
<li><p>In <strong>Milvus 2.6+</strong>, only the three requested fields are loaded. The remaining 47 fields stay unloaded and are fetched lazily only if they are accessed later.</p></li>
</ul>
<p>The resource savings can be substantial. If each scalar field occupies 20 GB:</p>
<ul>
<li><p>Loading all fields requires <strong>1,000 GB</strong> (50 × 20 GB)</p></li>
<li><p>Loading only the three required fields uses <strong>60 GB</strong></p></li>
</ul>
<p>This represents a <strong>94% reduction</strong> in scalar data loading, without affecting query correctness or results.</p>
<p><strong>Note:</strong> Tenant-aware partial loading for scalar fields and vector indexes will be officially introduced in an upcoming release. Once available, it will further reduce load latency and improve cold-query performance in large multi-tenant deployments.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. LRU-Based Cache Eviction</h3><p>Lazy loading and partial loading significantly reduce how much data is brought into local memory and disk. However, in long-running systems, the cache will still grow as new data is accessed over time. When local capacity is reached, LRU-based cache eviction takes effect.</p>
<p>LRU (Least Recently Used) eviction follows a simple rule: data that has not been accessed recently is evicted first. This frees up local space for newly accessed data while keeping frequently used data resident in the cache.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">Performance Evaluation: Tiered Storage vs. Full Loading<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>To evaluate the real-world impact of <strong>Tiered Storage</strong>, we set up a test environment that closely mirrors production workloads. We compared Milvus with and without Tiered Storage across five dimensions: load time, resource usage, query performance, effective capacity, and cost efficiency.</p>
<h3 id="Experimental-setup" class="common-anchor-header">Experimental setup</h3><p><strong>Dataset</strong></p>
<ul>
<li><p>100 million vectors with 768 dimensions (BERT embeddings)</p></li>
<li><p>Vector index size: approximately 430 GB</p></li>
<li><p>10 scalar fields, including ID, timestamp, and category</p></li>
</ul>
<p><strong>Hardware configuration</strong></p>
<ul>
<li><p>1 QueryNode with 4 vCPUs, 32 GB memory, and 1 TB NVMe SSD</p></li>
<li><p>10 Gbps network</p></li>
<li><p>MinIO object storage cluster as the remote storage backend</p></li>
</ul>
<p><strong>Access pattern</strong></p>
<p>Queries follow a realistic hot–cold access distribution:</p>
<ul>
<li><p>80% of queries target data from the most recent 30 days (≈20% of total data)</p></li>
<li><p>15% target data from 30–90 days (≈30% of total data)</p></li>
<li><p>5% target data older than 90 days (≈50% of total data)</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">Key results</h3><p><strong>1. 33× faster load time</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Stage</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Tiered Storage)</strong></th><th style="text-align:center"><strong>Speedup</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Data download</td><td style="text-align:center">22 minutes</td><td style="text-align:center">28 seconds</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">Index loading</td><td style="text-align:center">3 minutes</td><td style="text-align:center">17 seconds</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>Total</strong></td><td style="text-align:center"><strong>25 minutes</strong></td><td style="text-align:center"><strong>45 seconds</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>In Milvus 2.5, loading the collection took <strong>25 minutes</strong>. With Tiered Storage in Milvus 2.6+, the same workload completes in just <strong>45 seconds</strong>, representing a step-change improvement in load efficiency.</p>
<p><strong>2. 80% Reduction in Local Resource Usage</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Stage</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Tiered Storage)</strong></th><th style="text-align:center"><strong>Reduction</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">After load</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">–97%</td></tr>
<tr><td style="text-align:center">After 1 hour</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">–84%</td></tr>
<tr><td style="text-align:center">After 24 hours</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">–80%</td></tr>
<tr><td style="text-align:center">Steady state</td><td style="text-align:center">430 GB</td><td style="text-align:center">85–95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>In Milvus 2.5, local resource usage remains constant at <strong>430 GB</strong>, regardless of workload or runtime. In contrast, Milvus 2.6+ starts with just <strong>12 GB</strong> immediately after loading.</p>
<p>As queries run, frequently accessed data is cached locally and resource usage gradually increases. After approximately 24 hours, the system stabilizes at <strong>85–95 GB</strong>, reflecting the working set of hot data. Over the long term, this results in an <strong>~80% reduction</strong> in local memory and disk usage, without sacrificing query availability.</p>
<p><strong>3. Near-zero impact on hot data performance</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Query type</strong></th><th style="text-align:center"><strong>Milvus 2.5 P99 latency</strong></th><th style="text-align:center"><strong>Milvus 2.6+ P99 latency</strong></th><th style="text-align:center"><strong>Change</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Hot data queries</td><td style="text-align:center">15 ms</td><td style="text-align:center">16 ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">Warm data queries</td><td style="text-align:center">15 ms</td><td style="text-align:center">28 ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">Cold data queries (first access)</td><td style="text-align:center">15 ms</td><td style="text-align:center">120 ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">Cold data queries (cached)</td><td style="text-align:center">15 ms</td><td style="text-align:center">18 ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>For hot data, which accounts for roughly 80% of all queries, P99 latency increases by only 6.7%, resulting in virtually no perceptible impact in production.</p>
<p>Cold data queries show higher latency on first access due to on-demand loading from object storage. However, once cached, their latency increases by only 20%. Given the low access frequency of cold data, this trade-off is generally acceptable for most real-world workloads.</p>
<p><strong>4. 4.3× Larger Effective Capacity</strong></p>
<p>Under the same hardware budget—eight servers with 64 GB of memory each (512 GB total)—Milvus 2.5 can load at most 512 GB of data, equivalent to approximately 136 million vectors.</p>
<p>With Tiered Storage enabled in Milvus 2.6+, the same hardware can support 2.2 TB of data, or roughly 590 million vectors. This represents a 4.3× increase in effective capacity, enabling significantly larger datasets to be served without expanding local memory.</p>
<p><strong>5. 80.1% Cost Reduction</strong></p>
<p>Using a 2 TB vector dataset in an AWS environment as an example, and assuming 20% of the data is hot (400 GB), the cost comparison is as follows:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Item</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Tiered Storage)</strong></th><th style="text-align:center"><strong>Savings</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Monthly cost</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">Annual cost</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">Savings rate</td><td style="text-align:center">–</td><td style="text-align:center">–</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">Benchmark Summary</h3><p>Across all tests, Tiered Storage delivers consistent and measurable improvements:</p>
<ul>
<li><p><strong>33× faster load times:</strong> Collection load time is reduced from <strong>25 minutes to 45 seconds</strong>.</p></li>
<li><p><strong>80% lower local resource usage:</strong> In steady-state operation, memory and local disk usage drop by approximately <strong>80%</strong>.</p></li>
<li><p><strong>Near-zero impact on hot data performance:</strong> P99 latency for hot data increases by <strong>less than 10%</strong>, preserving low-latency query performance.</p></li>
<li><p><strong>Controlled latency for cold data:</strong> Cold data incurs higher latency on first access, but this is acceptable given its low access frequency.</p></li>
<li><p><strong>4.3× higher effective capacity:</strong> The same hardware can serve <strong>4–5× more data</strong> without additional memory.</p></li>
<li><p><strong>Over 80% cost reduction:</strong> Annual infrastructure costs are reduced by <strong>more than 80%</strong>.</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">When to Use Tiered Storage in Milvus<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Based on benchmark results and real-world production cases, we group Tiered Storage use cases into three categories to help you decide whether it is a good fit for your workload.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">Best-Fit Use Cases</h3><p><strong>1. Multi-tenant vector search platforms</strong></p>
<ul>
<li><p><strong>Characteristics:</strong> Large number of tenants with highly uneven activity; vector search is the core workload.</p></li>
<li><p><strong>Access pattern:</strong> Fewer than 20% of tenants generate over 80% of vector queries.</p></li>
<li><p><strong>Expected benefits:</strong> 70–80% cost reduction; 3–5× capacity expansion.</p></li>
</ul>
<p><strong>2. E-commerce recommendation systems (vector search workloads)</strong></p>
<ul>
<li><p><strong>Characteristics:</strong> Strong popularity skew between top products and the long tail.</p></li>
<li><p><strong>Access pattern:</strong> Top 10% of products account for ~80% of vector search traffic.</p></li>
<li><p><strong>Expected benefits:</strong> No need for extra capacity during peak events; 60–70% cost reduction</p></li>
</ul>
<p><strong>3. Large-scale datasets with clear hot–cold separation (vector-dominant)</strong></p>
<ul>
<li><p><strong>Characteristics:</strong> TB-scale or larger datasets, with access heavily biased toward recent data.</p></li>
<li><p><strong>Access pattern:</strong> A classic 80/20 distribution: 20% of data serves 80% of queries</p></li>
<li><p><strong>Expected benefits:</strong> 75–85% cost reduction</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">Good-Fit Use Cases</h3><p><strong>1. Cost-sensitive workloads</strong></p>
<ul>
<li><p><strong>Characteristics:</strong> Tight budgets with some tolerance for minor performance trade-offs.</p></li>
<li><p><strong>Access pattern:</strong> Vector queries are relatively concentrated.</p></li>
<li><p><strong>Expected benefits:</strong> 50–70% cost reduction; Cold data may incur ~500 ms latency on first access, which should be evaluated against SLA requirements.</p></li>
</ul>
<p><strong>2. Historical data retention and archival search</strong></p>
<ul>
<li><p><strong>Characteristics:</strong> Large volumes of historical vectors with very low query frequency.</p></li>
<li><p><strong>Access pattern:</strong> Around 90% of queries target recent data.</p></li>
<li><p><strong>Expected benefits:</strong> Retain full historical datasets; Keep infrastructure costs predictable and controlled</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">Poor-Fit Use Cases</h3><p><strong>1. Uniformly hot data workloads</strong></p>
<ul>
<li><p><strong>Characteristics:</strong> All data is accessed at a similar frequency, with no clear hot–cold distinction.</p></li>
<li><p><strong>Why unfit:</strong> Limited cache benefit; Added system complexity without meaningful gains</p></li>
</ul>
<p><strong>2. Ultra–low-latency workloads</strong></p>
<ul>
<li><p><strong>Characteristics:</strong> Extremely latency-sensitive systems, such as financial trading or real-time bidding</p></li>
<li><p><strong>Why unfit:</strong> Even small latency variations are unacceptable; Full loading provides more predictable performance</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">Quick Start: Try Tiered Storage in Milvus 2.6+<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Tiered Storage in Milvus 2.6 addresses a common mismatch between how vector data is stored and how it is actually accessed. In most production systems, only a small fraction of data is queried frequently, yet traditional loading models treat all data as equally hot. By shifting to on-demand loading and managing local memory and disk as a cache, Milvus aligns resource consumption with real query behavior rather than worst-case assumptions.</p>
<p>This approach allows systems to scale to larger datasets without proportional increases in local resources, while keeping hot-query performance largely unchanged. Cold data remains accessible when needed, with predictable and bounded latency, making the trade-off explicit and controllable. As vector search moves deeper into cost-sensitive, multi-tenant, and long-running production environments, Tiered Storage provides a practical foundation for operating efficiently at scale.</p>
<p>For more information about the Tiered Storage, check the documentation below:</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">Tiered Storage | Milvus Documentation</a></li>
</ul>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Learn More about Milvus 2.6 Features<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Introducing Milvus 2.6: Affordable Vector Search at Billion Scale</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization and Semantic Search</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88.9x Faster JSON Filtering with Flexibility</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Unlocking True Entity-Level Retrieval: New Array-of-Structs and MAX_SIM Capabilities in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Bringing Geospatial Filtering and Vector Search Together with Geometry Fields and RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introducing AISAQ in Milvus: Billion-Scale Vector Search Just Got 3,200× Cheaper on Memory</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimizing NVIDIA CAGRA in Milvus: A Hybrid GPU–CPU Approach to Faster Indexing and Cheaper Queries</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie — Vector DBs Deserve a Real Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus</a></p></li>
</ul>
