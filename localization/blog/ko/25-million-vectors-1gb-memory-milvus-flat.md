---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >
  How a community user ran 25M-vector image search on <1GB of memory in Milvus
  using FLAT, FP16, and mmap — instead of the Sizing Tool's 139GB estimate.
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>A Milvus user recently came to us with a very practical image search problem.</p>
<p>“We need to do image-to-image search on 25 million images, encoded as 1280-dimensional vectors. A single machine will serve the workload. It has 64GB of RAM, and at most 32GB can go to the vector database. But the <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> says we need 139GB. Are we cooked?”</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sizing Tool estimation results: 25M × 1280-dimensional vectors, Raw Data Size 119.2 GB, Loading Memory 139.4 GB</p>
<p>Not quite.</p>
<p>At first, the obvious answer seemed to be a more advanced index. If the dataset is large and memory is tight, surely a smarter ANN index should help. In this case, it did not. The index that finally worked was Milvus’s simplest option: <a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>.</p>
<p>The result was better than expected: steady-state memory stayed under 1GB, the container’s resident memory was around 600MB, and warm-query latency stayed under 100ms. Startup briefly peaked at about 12.5GB, and the first query took about 30 seconds while the system warmed up.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The important part is not that FLAT magically made 25 million brute-force comparisons cheap. It did not. The important part is that this workload almost never searched all 25 million vectors. Scalar filters narrowed each query first, and FLAT only compared vectors inside that much smaller candidate set.</p>
<p>This post walks through what failed, why FLAT worked, and when the same pattern is worth trying in your own workload.</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">Why AISAQ and IVF_FLAT Did Not Work Here<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>Before FLAT, the user tried two indexes that looked more natural for a constrained machine.</p>
<p><strong>First attempt:</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>.</strong> AISAQ is a disk-oriented index designed to keep memory usage low. The catch in this workload was the build and load path. In an earlier test with 55 million vectors, one collection load wrote 249GB of temporary data to disk and took too long to be practical.</p>
<p><strong>Second attempt: IVF_FLAT.</strong> IVF_FLAT also looked reasonable because it is a standard ANN index. The index built successfully, but the collection load stalled at 14% and never recovered.</p>
<p>After those two dead ends, the user tried the boring option: FLAT. It loaded cleanly. It also gave the best runtime behavior for this specific query pattern.</p>
<table>
<thead>
<tr><th><strong>Index</strong></th><th><strong>Why it looked promising</strong></th><th><strong>What happened in this workload</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>Disk-oriented index with low memory usage in theory</td><td>The build/load path generated large temporary files. In a 55M-vector test, one collection load wrote 249GB of temporary data and was slow.</td></tr>
<tr><td>IVF_FLAT</td><td>Standard ANN index with lower search cost than a full scan</td><td>The index built, but collection load stalled at 14% and did not recover.</td></tr>
<tr><td>FLAT</td><td>No extra ANN structure and no index build complexity</td><td>Steady-state memory stayed under 1GB. Container resident memory was around 600MB. Startup peaked near 12.5GB. First query took about 30s, then warm queries stayed under 100ms.</td></tr>
</tbody>
</table>
<p>The lesson is simple: an index that is efficient in theory may still be the wrong fit for a specific machine, data shape, and query pattern.</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">Why FLAT Worked<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT is the simplest index Milvus supports. No graph. No tree. No clustering. It compares the query vector directly with candidate vectors.</p>
<p>That sounds like the wrong tool for 25 million vectors. It would be the wrong tool if every query searched the whole collection.</p>
<p>But this workload had a strong filter in front of vector search. Every query first narrowed the search space with scalar fields such as <code translate="no">dataid</code> and <code translate="no">classid</code>. Only then did Milvus run vector similarity search. That changed the problem from “search 25 million vectors” to “search a few hundred to tens of thousands of vectors after filtering.”</p>
<p>Three pieces made the setup work: FP16 vector storage, mmap for raw vector data, and scalar filtering before the FLAT pass.</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">Optimization 1: FP16 Cuts Vector Data in Half<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>The vectors had 1280 dimensions. Stored as FP32, each vector needs 5120 bytes:</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>Across 25 million vectors, that is about 119.2GB of raw vector data. FP16 cuts each dimension from 4 bytes to 2 bytes:</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>So the raw vector data drops to about 59.6GB.</p>
<p>This still does not fit neatly into the available RAM, but it halves the amount of vector data Milvus and the operating system need to handle. In many image retrieval workloads, FP16 has a small recall impact, but it is not a free rule. Test recall with your own embeddings, metric, and quality bar before making it the default.</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">Optimization 2: mmap Keeps Raw Vectors Off the Process Heap<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>Even after FP16, about 60GB of vectors is still too much for the memory budget. That is where <a href="https://milvus.io/docs/mmap.md"><strong>mmap</strong></a> becomes useful.</p>
<p>With mmap, Milvus can access vector data through memory-mapped files instead of loading the entire raw vector field into process memory. The operating system pages data in as queries touch it and can keep hot pages in its page cache.</p>
<p>In this user’s Milvus 2.6.14 environment, the cluster-level mmap configuration already covered raw vector data, so the user did not need to set mmap manually.</p>
<p>One detail caused confusion during debugging: Attu shows the schema-level mmap setting, not the cluster-level default. So <a href="https://zilliz.com/attu"><strong>Attu</strong></a> may show mmap as disabled even when the cluster-level configuration is effectively enabling mmap for the data path.</p>
<p>The trade-off is straightforward. mmap saves RAM, but it uses disk and the OS page cache more heavily. You still need SSD capacity for the vector files, and the first query can be slower while relevant pages are read from disk.</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">Optimization 3: Scalar Filtering Is the Real Performance Multiplier<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 and mmap explain the memory number. Scalar filtering explains the latency number.</p>
<p>Every query in this workload included a filter expression like this:</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>That filter ran before the vector comparison step. Instead of comparing against 25 million vectors, FLAT compared against the filtered candidate set, which ranged from a few hundred to tens of thousands of vectors.</p>
<p>That is why warm queries stayed under 100ms. Tens of thousands of vector comparisons are practical on a modern CPU. Twenty-five million comparisons per query would be a very different story.</p>
<p>This also explains why IVF_FLAT and HNSW were not useful here. Once scalar filtering has reduced the candidate set enough, an extra ANN structure can become dead weight. It adds memory, build time, and load complexity, but it may not improve latency much.</p>
<p>There is one caveat. The filters in this workload were simple. If your filters use large <code translate="no">IN</code> lists, <code translate="no">LIKE</code> patterns, range predicates, or nested JSON conditions, add scalar indexes on the relevant fields and measure the filter stage directly.</p>
<table>
<thead>
<tr><th>Optimization</th><th>What it does</th><th>Why it mattered here</th><th>Trade-off</th></tr>
</thead>
<tbody>
<tr><td>FP16 vector storage</td><td>Stores each vector dimension with 2 bytes instead of 4 bytes</td><td>Reduced raw vector data from about 119.2GB to about 59.6GB</td><td>Recall impact depends on your embeddings and metric. Test it.</td></tr>
<tr><td>mmap on raw vectors</td><td>Maps vector files from disk instead of loading the full raw vector field into process memory</td><td>Kept process memory low while letting the OS page in data as needed</td><td>Requires SSD capacity and can make cold queries slower.</td></tr>
<tr><td>Scalar filtering first</td><td>Filters by scalar fields before vector comparison</td><td>Reduced each query from 25M candidates to hundreds or tens of thousands</td><td>Complex filters may need scalar indexes.</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">Where This Pattern Applies<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>The image search case worked because the real search space was much smaller than the total collection. That same shape appears in many production workloads.</p>
<ol>
<li><strong>Multi-tenant RAG:</strong> Filter by <code translate="no">tenant_id</code>, <code translate="no">workspace_id</code>, or <code translate="no">project_id</code> first. Each tenant may only have thousands or tens of thousands of chunks.</li>
<li><strong>E-commerce product search:</strong> Filter by category, brand, seller, region, or availability before vector search.</li>
<li><strong>Log and document retrieval:</strong> Filter by time range, source, service, or document type before semantic search.</li>
<li><strong>Image or media search with labels:</strong> Filter by dataset, class, customer, or asset group before comparing embeddings.</li>
</ol>
<p>These are good candidates for FLAT + FP16 + mmap because the full collection can be large while each query still touches a small subset.</p>
<p>The pattern does not apply when every query searches the whole collection. If each query really needs to scan all 25 million vectors, FLAT will not give you the same latency. In that case, use an ANN index such as HNSW, IVF, or a disk-oriented index, and plan for the memory, disk, and build-time trade-offs.</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">How to Read the Sizing Tool Estimate<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>The Milvus Sizing Tool is a starting point, not a final verdict on your hardware.</p>
<p>In this case, the 139.4GB loading memory estimate served as a conservative baseline for 25 million 1280-dimensional FP32 vectors. The real workload changed several assumptions:</p>
<ol>
<li>FP16 cut raw vector size roughly in half.</li>
<li>mmap avoided loading the full raw vector field into process memory.</li>
<li>FLAT avoided extra ANN index structures.</li>
<li>Scalar filters made each query search a much smaller candidate set.</li>
</ol>
<p>That is why real workload testing matters. Before rejecting a hardware setup based only on a sizing estimate, test with your actual vector precision, index type, mmap configuration, scalar filters, cold-query behavior, and warm-query behavior.</p>
<h2 id="Get-Started" class="common-anchor-header">Get Started<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>If you want to try the same recipe, start with the query pattern, not the index name.</p>
<ol>
<li>Check whether every query has selective scalar filters.</li>
<li>Estimate how many vectors remain after filtering.</li>
<li>Store vectors as FP16 if recall testing looks good.</li>
<li>Use FLAT when the filtered candidate set is small enough for brute-force comparison.</li>
<li>Verify mmap behavior for raw vector data. Check both schema-level settings and cluster-level configuration.</li>
<li>Measure startup memory, first-query latency, warm-query latency, and disk I/O.</li>
<li>Add scalar indexes if filter evaluation becomes the bottleneck.</li>
</ol>
<p>For local testing, start with the <a href="https://milvus.io/docs/quickstart.md"><strong>Milvus quickstart</strong></a> or the Milvus <a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a> repository. Use Attu to inspect collections, but remember that Attu may not show cluster-level mmap defaults.</p>
<p>If you do not want to run the infrastructure yourself, <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> is the managed Milvus service. You get the same Milvus core with managed operations, scaling, and a free tier for testing. <a href="https://cloud.zilliz.com/signup"><strong>Sign up</strong></a> for $100 free credits with a work email, or <a href="https://cloud.zilliz.com/login"><strong>sign in</strong></a> if you already have an account.</p>
