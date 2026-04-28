---
id: turboquant-rabitq-vector-database-cost.md
title: >
  Beyond the TurboQuant-RaBitQ Debate: Why Vector Quantization Matters for AI
  Infrastructure Costs
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >
  The TurboQuant-RaBitQ debate made vector quantization headline news. How
  RaBitQ 1-bit compression works and how Milvus ships IVF_RABITQ for 97% memory
  savings.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>Google’s TurboQuant paper (ICLR 2026) reported 6x KV cache compression with near-zero accuracy loss — results striking enough to wipe <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html">$90 billion off memory chip stocks</a> in a single day. SK Hynix dropped 12%. Samsung dropped 7%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The paper quickly drew scrutiny. <a href="https://gaoj0017.github.io/">Jianyang Gao</a>, first author of <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024), <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">raised questions</a> about the relationship between TurboQuant’s methodology and his prior work on vector quantization. (We’ll be publishing a conversation with Dr. Gao soon — follow us if you’re interested.)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This article isn’t about taking sides in that discussion. What struck us is something bigger: the fact that a single <a href="https://milvus.io/docs/index-explained.md">vector quantization</a> paper could move $90 billion in market value tells you how critical this technology has become for AI infrastructure. Whether it’s compressing KV cache in inference engines or compressing indexes in <a href="https://zilliz.com/learn/what-is-vector-database">vector databases</a>, the ability to shrink high-dimensional data while preserving quality has enormous cost implications — and it’s a problem we’ve been working on, integrating RaBitQ into <a href="https://milvus.io/">Milvus</a> vector database and turning it into production infrastructure.</p>
<p>Here’s what we’ll cover: why vector quantization matters so much right now, how TurboQuant and RaBitQ compare, what RaBitQ is and how it works, the engineering work behind shipping it inside Milvus, and what the broader memory optimization landscape looks like for AI infrastructure.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">Why Does Vector Quantization Matter for Infrastructure Costs?<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector quantization is not new. What’s new is how urgently the industry needs it. Over the past two years, LLM parameters have ballooned, context windows have stretched from 4K to 128K+ tokens, and unstructured data — text, images, audio, video — has become a first-class input to AI systems. Every one of these trends creates more high-dimensional vectors that need to be stored, indexed, and searched. More vectors, more memory, more cost.</p>
<p>If you’re running vector search at scale — <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG pipelines</a>, recommendation engines, multimodal retrieval — memory cost is likely one of your biggest infrastructure headache.</p>
<p>During model deployment, every major LLM inference stack relies on <a href="https://zilliz.com/glossary/kv-cache">KV cache</a> — storing previously computed key-value pairs so the attention mechanism doesn’t recompute them for every new token. It’s what makes O(n) inference possible instead of O(n²). Every framework from <a href="https://github.com/vllm-project/vllm">vLLM</a> to <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a> depends on it. But KV cache can consume more GPU memory than the model weights themselves. Longer contexts, more concurrent users, and it spirals fast.</p>
<p>The same pressure hits vector databases — billions of high-dimensional vectors sitting in memory, each one a 32-bit float per dimension. Vector quantization compresses these vectors from 32-bit floats down to 4-bit, 2-bit, or even 1-bit representations — shrinking memory by 90% or more. Whether it’s KV cache in your inference engine or indexes in your vector database, the underlying math is the same, and the cost savings are real. That’s why a single paper reporting a breakthrough in this space moved $90 billion in stock market value.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant vs RaBitQ: What’s the Difference?<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Both TurboQuant and RaBitQ build on the same foundational technique: applying a random rotation (<a href="https://arxiv.org/abs/2406.03482">Johnson-Lindenstrauss transform</a>) to input vectors before quantization. This rotation transforms irregularly distributed data into a predictable uniform distribution, making it easier to quantize with low error.</p>
<p>Beyond that shared foundation, the two target different problems and take different approaches:</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>Target</strong></td><td>KV cache in LLM inference (ephemeral, per-request data)</td><td>Persistent vector indexes in databases (stored data)</td></tr>
<tr><td><strong>Approach</strong></td><td>Two-stage: PolarQuant (Lloyd-Max scalar quantizer per coordinate) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (1-bit residual correction)</td><td>Single-stage: hypercube projection + unbiased distance estimator</td></tr>
<tr><td><strong>Bit width</strong></td><td>3-bit keys, 2-bit values (mixed precision)</td><td>1-bit per dimension (with multi-bit variants available)</td></tr>
<tr><td><strong>Theoretical claim</strong></td><td>Near-optimal MSE distortion rate</td><td>Asymptotically optimal inner-product estimation error (matching Alon-Klartag lower bounds)</td></tr>
<tr><td><strong>Production status</strong></td><td>Community implementations; no official release from Google</td><td>Shipped in <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, adopted by Faiss, VSAG, Elasticsearch</td></tr>
</tbody>
</table>
<p>The key difference for practitioners: TurboQuant optimizes the transient KV cache inside an inference engine, while RaBitQ targets the persistent indexes that a vector database builds, shards, and queries across billions of vectors. For the rest of this article, we’ll focus on RaBitQ — the algorithm we’ve integrated and ship in production inside Milvus.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">What Is RaBitQ and What Does It Deliver?<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>Here’s the bottom line first: on a 10-million vector dataset at 768 dimensions, RaBitQ compresses each vector to 1/32 of its original size while keeping recall above 94%. In Milvus, that translates to 3.6x higher query throughput than a full-precision index. This isn’t a theoretical projection — it’s a benchmark result from Milvus 2.6.</p>
<p>Now, how it gets there.</p>
<p>Traditional binary quantization compresses FP32 vectors to 1 bit per dimension — 32x compression. The tradeoff: recall collapses because you’ve thrown away too much information. <a href="https://arxiv.org/abs/2405.12497">RaBitQ</a> (Gao &amp; Long, SIGMOD 2024) keeps the same 32x compression but preserves the information that actually matters for search. An <a href="https://arxiv.org/abs/2409.09913">extended version</a> (Gao &amp; Long, SIGMOD 2025) proves this is asymptotically optimal, matching the theoretical lower bounds established by Alon &amp; Klartag (FOCS 2017).</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">Why Do Angles Matter More Than Coordinates in High Dimensions?</h3><p>The key insight: <strong>in high dimensions, angles between vectors are more stable and informative than individual coordinate values.</strong> This is a consequence of measure concentration — the same phenomenon that makes Johnson-Lindenstrauss random projections work.</p>
<p>What this means in practice: you can discard the exact coordinate values of a high-dimensional vector and keep only its direction relative to the dataset. The angular relationships — which is what <a href="https://zilliz.com/glossary/anns">nearest-neighbor search</a> actually depends on — survive the compression.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">How Does RaBitQ Work?</h3><p>RaBitQ turns this geometric insight into three steps:</p>
<p><strong>Step 1: Normalize.</strong> Center each vector relative to the dataset centroid and scale to unit length. This converts the problem to inner-product estimation between unit vectors — easier to analyze and bound.</p>
<p><strong>Step 2: Random rotation + hypercube projection.</strong> Apply a random orthogonal matrix (a Johnson-Lindenstrauss-type rotation) to remove bias toward any axis. Project each rotated vector onto the nearest vertex of a {±1/√D}^D hypercube. Each dimension collapses to a single bit. The result: a D-bit binary code per vector.</p>
<p><strong>Step 3: Unbiased distance estimation.</strong> Construct an estimator for the inner product between a query and the original (unquantized) vector. The estimator is provably unbiased with error bounded by O(1/√D). For 768-dimensional vectors, this keeps recall above 94%.</p>
<p>Distance computation between binary vectors reduces to bitwise AND + popcount — operations modern CPUs execute in a single cycle. This is what makes RaBitQ fast, not just small.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">Why Is RaBitQ Practical, Not Just Theoretical?</h3><ul>
<li><strong>No training required.</strong> Apply the rotation, check signs. No iterative optimization, no codebook learning. Indexing time is comparable to <a href="https://milvus.io/docs/ivf-pq.md">product quantization</a>.</li>
<li><strong>Hardware-friendly.</strong> Distance computation is bitwise AND + popcount. Modern CPUs (Intel IceLake+, AMD Zen 4+) have dedicated AVX512VPOPCNTDQ instructions. Single-vector estimation runs 3x faster than PQ lookup tables.</li>
<li><strong>Multi-bit flexibility.</strong> The <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">RaBitQ Library</a> supports variants beyond 1-bit: 4-bit achieves ~90% recall, 5-bit ~95%, 7-bit ~99% — all without reranking.</li>
<li><strong>Composable.</strong> Plugs into existing index structures like <a href="https://milvus.io/docs/ivf-flat.md">IVF indexes</a> and <a href="https://milvus.io/docs/hnsw.md">HNSW graphs</a>, and works with FastScan for batch distance computation.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">From Paper to Production: What We Built to Ship RaBitQ in Milvus<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>The original RaBitQ code is a single-machine research prototype. Making it work across a <a href="https://milvus.io/docs/architecture_overview.md">distributed cluster</a> with sharding, failover, and real-time ingestion required solving four engineering problems. At <a href="https://zilliz.com/">Zilliz</a>, we went beyond simply implementing the algorithm — the work spanned engine integration, hardware acceleration, index optimization, and runtime tuning to turn RaBitQ into an industrial-grade capability inside Milvus. You can find more details in this blog as well: <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">Making RaBitQ Distributed-Ready</h3><p>We integrated RaBitQ directly into <a href="https://github.com/milvus-io/knowhere">Knowhere</a>, Milvus’s core search engine — not as a plugin, but as a native index type with unified interfaces. It works with Milvus’s full distributed architecture: sharding, partitioning, dynamic scaling, and <a href="https://milvus.io/docs/manage-collections.md">collection management</a>.</p>
<p>The key challenge: making the quantization codebook (rotation matrix, centroid vectors, scaling parameters) segment-aware, so that each shard builds and stores its own quantization state. Index builds, compactions, and load-balancing all understand the new index type natively.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">Squeezing Every Cycle Out of Popcount</h3><p>RaBitQ’s speed comes from popcount — counting set bits in binary vectors. The algorithm is inherently fast, but how much throughput you get depends on how well you use the hardware. We built dedicated SIMD code paths for both dominant server architectures:</p>
<ul>
<li><strong>x86 (Intel IceLake+ / AMD Zen 4+):</strong> AVX-512’s VPOPCNTDQ instruction computes popcount across multiple 512-bit registers in parallel. Knowhere’s inner loops are restructured to batch binary distance computations into SIMD-width chunks, maximizing throughput.</li>
<li><strong>ARM (Graviton, Ampere):</strong> SVE (Scalable Vector Extension) instructions for the same parallel popcount pattern — critical since ARM instances are increasingly common in cost-optimized cloud deployments.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">Eliminating Runtime Overhead</h3><p>RaBitQ needs auxiliary floating-point parameters at query time: the dataset centroid, per-vector norms, and the inner product between each quantized vector and its original (used by the distance estimator). Computing these per query adds latency. Storing the full original vectors defeats the purpose of compression.</p>
<p>Our solution: pre-compute and persist these parameters during index build, caching them alongside the binary codes. The memory overhead is small (a few floats per vector), but it eliminates per-query computation and keeps latency stable under high concurrency.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: The Index You Actually Deploy</h3><p>Starting with <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, we ship <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> — <a href="https://milvus.io/docs/ivf-flat.md">Inverted File Index</a> + RaBitQ quantization. The search works in two stages:</p>
<ol>
<li><strong>Coarse search (IVF).</strong> K-means partitions the vector space into clusters. At query time, only the nprobe closest clusters are scanned.</li>
<li><strong>Fine scoring (RaBitQ).</strong> Within each cluster, distances are estimated using 1-bit codes and the unbiased estimator. Popcount does the heavy lifting.</li>
</ol>
<p>The results on a 768-dimensional, 10-million vector dataset:</p>
<table>
<thead>
<tr><th>Metric</th><th>IVF_FLAT (baseline)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 refine</th></tr>
</thead>
<tbody>
<tr><td>Recall</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>—</td></tr>
<tr><td>Memory footprint</td><td>32 bits/dim</td><td>1 bit/dim (~3% of original)</td><td>~25% of original</td></tr>
</tbody>
</table>
<p>For workloads that can’t tolerate even a 0.5% recall gap, the refine_type parameter adds a second scoring pass: SQ6, SQ8, FP16, BF16, or FP32. SQ8 is the common choice — it restores recall to IVF_FLAT levels at roughly 1/4 the original memory. You can also apply <a href="https://milvus.io/docs/ivf-sq8.md">scalar quantization</a> to the query side (SQ1–SQ8) independently, giving you two knobs to tune the latency-recall-cost tradeoff per workload.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">How Milvus Optimizes Memory Beyond Quantization<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ is the most dramatic compression lever, but it’s one layer in a broader <a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">memory optimization</a> stack:</p>
<table>
<thead>
<tr><th>Strategy</th><th>What it does</th><th>Impact</th></tr>
</thead>
<tbody>
<tr><td><strong>Full-stack quantization</strong></td><td>SQ8, PQ, RaBitQ at different precision-cost tradeoffs</td><td>4x to 32x memory reduction</td></tr>
<tr><td><strong>Index structure optimization</strong></td><td>HNSW graph compaction, DiskANN SSD offloading, OOM-safe index builds</td><td>Less DRAM per index, larger datasets per node</td></tr>
<tr><td><strong>Memory-mapped I/O (mmap)</strong></td><td>Maps vector files to disk, loads pages on demand via OS page cache</td><td>TB-scale datasets without loading everything into RAM</td></tr>
<tr><td><strong>Tiered storage</strong></td><td>Hot/warm/cold data separation with automatic scheduling</td><td>Pay memory prices only for frequently accessed data</td></tr>
<tr><td><strong>Cloud-native scaling</strong> (<a href="https://zilliz.com/cloud">Zilliz Cloud</a>, managed Milvus)</td><td>Elastic memory allocation, auto-release of idle resources</td><td>Pay only for what you use</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">Full-Stack Quantization</h3><p>RaBitQ’s 1-bit extreme compression isn’t the right fit for every workload. Milvus offers a complete quantization matrix: <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> and <a href="https://milvus.io/docs/ivf-pq.md">product quantization (PQ)</a> for workloads that need a balanced precision-cost tradeoff, RaBitQ for maximum compression on ultra-large datasets, and hybrid configurations that combine multiple methods for fine-grained control.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">Index Structure Optimization</h3><p>Beyond quantization, Milvus continuously optimizes memory overhead in its core index structures. For <a href="https://milvus.io/docs/hnsw.md">HNSW</a>, we reduced adjacency list redundancy to lower per-graph memory usage. <a href="https://milvus.io/docs/diskann.md">DiskANN</a> pushes both vector data and index structures to SSD, dramatically reducing DRAM dependency for large datasets. We also optimized intermediate memory allocation during index building to prevent OOM failures when building indexes over datasets that approach node memory limits.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">Smart Memory Loading</h3><p>Milvus’s <a href="https://milvus.io/docs/mmap.md">mmap</a> (memory-mapped I/O) support maps vector data to disk files, relying on the OS page cache for on-demand loading — no need to load all data into memory at startup. Combined with lazy loading and segmented loading strategies that prevent sudden memory spikes, this enables smooth operation with TB-scale vector datasets at a fraction of the memory cost.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">Tiered Storage</h3><p>Milvus’s <a href="https://milvus.io/docs/tiered-storage-overview.md">three-tier storage architecture</a> spans memory, SSD, and object storage: hot data stays in memory for low latency, warm data is cached on SSD for a balance of performance and cost, and cold data sinks to object storage to minimize overhead. The system handles data scheduling automatically — no application-layer changes required.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">Cloud-Native Scaling</h3><p>Under Milvus’s <a href="https://milvus.io/docs/architecture_overview.md">distributed architecture</a>, data sharding and load balancing prevent single-node memory overload. Memory pooling reduces fragmentation and improves utilization. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (fully managed Milvus) takes this further with elastic scheduling for on-demand memory scaling — in Serverless mode, idle resources are automatically released, further reducing total cost of ownership.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">How These Layers Compound</h3><p>These optimizations aren’t alternatives — they stack. RaBitQ shrinks the vectors. DiskANN keeps the index on SSD. Mmap avoids loading cold data into memory. <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">Tiered storage</a> pushes archival data to object storage. The result: a deployment serving billions of vectors doesn’t need billions-of-vectors worth of RAM.</p>
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
    </button></h2><p>As AI data volumes continue to grow, vector database efficiency and cost will directly determine how far AI applications can scale. We’ll continue investing in high-performance, low-cost vector infrastructure — so that more AI applications can move from prototype to production.</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> is open source. To try IVF_RABITQ:</p>
<ul>
<li>Check the <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ documentation</a> for configuration and tuning guidance.</li>
<li>Read the full <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ integration blog post</a> for deeper benchmarks and implementation details.</li>
<li>Join the <a href="https://slack.milvus.io/">Milvus Slack community</a> to ask questions and learn from other developers.</li>
<li><a href="https://milvus.io/office-hours">Book a free Milvus Office Hours session</a> to walk through your use case.</li>
</ul>
<p>If you’d rather skip infrastructure setup, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (fully managed Milvus) offers a free tier with IVF_RABITQ support.</p>
<p>We’re running an upcoming interview with Professor <a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a> (NTU, VectorDB@NTU) and <a href="https://gaoj0017.github.io/">Dr. Jianyang Gao</a> (ETH Zurich), the first author of RaBitQ, where we’ll go deeper into vector quantization theory and what’s next. Drop your questions in the comments.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Frequently Asked Questions<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">What are TurboQuant and RaBitQ?</h3><p>TurboQuant (Google, ICLR 2026) and RaBitQ (Gao &amp; Long, SIGMOD 2024) are both vector quantization methods that use random rotation to compress high-dimensional vectors. TurboQuant targets KV cache compression in LLM inference, while RaBitQ targets persistent vector indexes in databases. Both have contributed to the current wave of interest in vector quantization, though they solve different problems for different systems.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">How does RaBitQ achieve 1-bit quantization without destroying recall?</h3><p>RaBitQ exploits measure concentration in high-dimensional spaces: the angles between vectors are more stable than individual coordinate values as dimensionality increases. It normalizes vectors relative to the dataset centroid, then projects each one onto the nearest vertex of a hypercube (reducing each dimension to a single bit). An unbiased distance estimator with a provable error bound keeps search accurate despite the compression.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">What is IVF_RABITQ and when should I use it?</h3><p>IVF_RABITQ is a vector index type in Milvus (available since version 2.6) that combines inverted file clustering with RaBitQ 1-bit quantization. It achieves 94.7% recall at 3.6x the throughput of IVF_FLAT, with memory usage at roughly 1/32 of the original vectors. Use it when you need to serve large-scale vector search (millions to billions of vectors) and memory cost is a primary concern — common in RAG, recommendation, and multimodal search workloads.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">How does vector quantization relate to KV cache compression in LLMs?</h3><p>Both problems involve compressing high-dimensional floating-point vectors. KV cache stores key-value pairs from the Transformer attention mechanism; at long context lengths, it can exceed the model weights in memory usage. Vector quantization techniques like RaBitQ reduce these vectors to lower-bit representations. The same mathematical principles — measure concentration, random rotation, unbiased distance estimation — apply whether you’re compressing vectors in a database index or in an inference engine’s KV cache.</p>
