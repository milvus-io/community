---
id: force-merge-compaction-milvus-qps.md
title: Force Merge Compaction이 Milvus 검색 QPS를 거의 두 배로 높인 방법
author: Jack Li
date: 2026-07-1
cover: assets.zilliz.com/force_merge_compaction_milvus_qps_md_1_9a9b0a774a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, compaction, HNSW, performance'
meta_keywords: >-
  force merge compaction, milvus QPS, milvus performance tuning, milvus
  compaction, milvus HNSW
meta_title: |
  Force Merge Compaction: Nearly 2x Milvus Search QPS
desc: >-
  Force Merge는 Milvus의 작은 sealed 세그먼트를 더 적고 더 큰 세그먼트로 통합합니다. HNSW 인덱스를 사용한 100만
  개 벡터에서 검색 QPS가 약 3,000에서 약 5,600~6,000으로 증가했습니다.
origin: 'https://milvus.io/blog/force-merge-compaction-milvus-qps.md'
---
<p><a href="https://milvus.io/docs/force-merge.md"><strong>Force Merge Compaction</strong></a> is a Milvus compaction option that consolidates a collection’s small sealed segments into fewer, larger ones. <strong>Under the right conditions — a collection that has</strong> become static and read-heavy, with many small, sealed segments — it can meaningfully increase <strong>search QPS</strong>.</p>
<p>The reason is fan-out. Every query has to search each sealed segment’s index and merge the partial results, so the more segments a collection holds, the more redundant search, scheduling, and merging each query pays for, even when the total data is unchanged.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_2_f0b4781f16.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>We built a controlled experiment to measure it.</strong> Once a collection’s data has gone relatively static, how much does search throughput improve if you use Force Merge to consolidate its segments? On 1 million 768-dimensional vectors with an HNSW graph index, on the same hardware, consolidating the collection with Force Merge <strong>raised search QPS from about 3,000 to about 5,600–6,000</strong> (a 76% to 87% gain across concurrency levels), with p99 latency down about a third.</p>
<p>The rest of this blog covers why Milvus leaves you with many small segments, how Force Merge consolidates them, what the experiment showed run by run, and when the operation is worth its cost.</p>
<h2 id="Why-Small-Segments-Accumulate" class="common-anchor-header">Why Small Segments Accumulate<button data-href="#Why-Small-Segments-Accumulate" class="anchor-icon" translate="no">
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
    </button></h2><p>Those small segments cost you at query time, so why does Milvus leave them around in the first place? <strong>It can’t tell when your writes are finished.</strong> Merging isn’t free (it spends I/O, memory, and CPU and forces a fresh index build), so consolidating a collection that might still be taking writes would waste that work and risk write throughput and stability. The safe default is to leave sealed segments alone.</p>
<p>So they accumulate. <strong>Continuous writes, incremental updates, deletes, and flushes each leave sealed segments behind</strong>, and for Milvus, that’s a valid layout, even if it isn’t the fastest one for serving queries.</p>
<p>What Milvus can’t know, the operator can: <strong>that the data has settled.</strong> A bulk import just finished, a knowledge-base refresh wrapped up, or the collection has shifted to mostly serving queries. Force Merge is how the operator passes that signal, trading a one-time reorganization for the lower fan-out that follows.</p>
<h2 id="How-Force-Merge-Compaction-Works" class="common-anchor-header">How Force Merge Compaction Works<button data-href="#How-Force-Merge-Compaction-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Force Merge consolidates many small, scattered segments into fewer, larger ones, at a target size you choose.</strong> You trigger it through Milvus’s existing <code translate="no">compact()</code> API by passing a <code translate="no">target_size</code>.</p>
<p><strong>Two capabilities let it flatten a layout that routine compaction can’t:</strong></p>
<ul>
<li><strong>It merges many-to-many,</strong> regrouping segments into near-target outputs instead of nibbling one fragment at a time.</li>
<li><strong>It can aim past the per-segment cap</strong> (<code translate="no">dataCoord.segment.maxSize</code>), so even near-full segments can be combined.</li>
</ul>
<p>It’s also:</p>
<ul>
<li><strong>Backward-compatible,</strong> so existing <code translate="no">compact()</code> calls without <code translate="no">target_size</code> are unaffected and</li>
<li><strong>Asynchronous,</strong> which means the merge runs in the background without blocking search or query, though it spends I/O and memory while it works.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_3_1a6596eb96.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Standard compaction can’t do either of those, which is the whole reason Force Merge exists.</strong> It merges many-to-one and keeps every output under <code translate="no">dataCoord.segment.maxSize</code>. Once segments are big enough that combining two would cross that cap, it leaves them alone and the segment count stops dropping.</p>
<p>The <a href="https://milvus.io/docs/force-merge.md">documents</a> give a clean example: with <strong>five 2 MB segments and a 3 MB cap</strong>, merging any two would make a 4 MB segment, over the limit, so the count can’t drop at all. Force Merge isn’t bound by the cap, so a <code translate="no">target_size</code> of 4 MB collapses those five into fewer, larger segments.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_4_fead5d9755.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Consolidating helps because of how graph indexes behave: <strong>for HNSW, making one segment larger doesn’t raise its search cost proportionally</strong>, so fewer segments means less fan-out overhead without a matching rise in per-segment work. That’s why going from three segments to one is a net win, not just moving the cost around.</p>
<p><strong>The deeper difference is who decides, and why.</strong> Standard compaction asks whether the system can tidy up within its own rules. Force Merge is the operator saying the data is stable and the segments should be reshaped for the queries that follow: collection-wide consolidation for faster search, with tighter storage along the way.</p>
<p><strong>How far it goes depends on the</strong> <code translate="no">**target_size**</code> <strong>you pass</strong>, which has three modes:</p>
<ul>
<li><strong>Omitted or</strong> <code translate="no">**0**</code><strong>:</strong> behaves like standard compaction, using the configured <code translate="no">maxSize</code>.</li>
<li><strong>An explicit size in MB:</strong> segments merge toward it. It must be at least <code translate="no">maxSize</code>; a smaller value is rejected with an error.</li>
<li><code translate="no">**max_int64**</code><strong>:</strong> Milvus sizes the target itself, from the current segment layout and each node’s memory, so the merged segments stay small enough for QueryNodes to load. <strong>This auto mode is the recommended default</strong> unless you have a specific size in mind.</li>
</ul>
<table>
<thead>
<tr><th><strong>Note:</strong> This feature is in public preview. Do not use in production environments.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<h2 id="Experiment-Setup-Isolating-Segment-Shape" class="common-anchor-header">Experiment Setup: Isolating Segment Shape<button data-href="#Experiment-Setup-Isolating-Segment-Shape" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Fewer segments should mean less fan-out, and less fan-out should mean higher QPS.</strong> But “should” and “does” are different things, and the size of the gain is an open question. To measure it, we ran a controlled experiment.</p>
<p><strong>The experiment isolates one variable: whether Force Merge runs.</strong> Dataset, index type, query load, and the concurrency ladder are identical across both runs, so any difference in search performance traces back to segment shape and nothing else.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_5_154ccd56ab.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The environment:</p>
<table>
<thead>
<tr><th>Item</th><th>Configuration</th></tr>
</thead>
<tbody>
<tr><td>Milvus deployment</td><td>Docker Compose, single-node setup</td></tr>
<tr><td>Milvus version</td><td>2.6.17</td></tr>
<tr><td>Milvus server</td><td>16-core / 64 GB virtual machine</td></tr>
<tr><td>Load generator</td><td>32-core / 32 GB virtual machine</td></tr>
<tr><td>Benchmark tool</td><td><a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a></td></tr>
<tr><td>Dataset</td><td>VDBBench Cohere 1M vector dataset</td></tr>
<tr><td>Vector dimension</td><td>768</td></tr>
<tr><td>Data size</td><td>About 3 GB</td></tr>
<tr><td>Index type</td><td>HNSW graph index</td></tr>
<tr><td>Concurrency levels</td><td>80, 120, 160, 200, 240</td></tr>
<tr><td>Monitoring</td><td>Grafana / Prometheus</td></tr>
<tr><td>Metrics window</td><td>30 seconds</td></tr>
<tr><td>Segment configuration</td><td>Segment max size around 1024 MB; seal proportion set to 1.0</td></tr>
</tbody>
</table>
<h2 id="Baseline-Three-Sealed-Segments-3000-QPS" class="common-anchor-header">Baseline: Three Sealed Segments, ~3,000 QPS<button data-href="#Baseline-Three-Sealed-Segments-3000-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>The first run skips Force Merge. After 1 million rows are written, <strong>Attu shows three sealed segments, each holding 300,000-plus rows</strong>. Once <a href="https://milvus.io/docs/hnsw.md">HNSW</a> finishes building, the concurrency sweep begins.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_6_8b0342e40d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: three sealed segments visible in Attu, each ~300k+ rows</p>
<p><strong>QPS plateaus around 3,000 and stays there.</strong> It’s already past 3,000 at 80 concurrency, and pushing concurrency higher doesn’t lift the peak. Server-side monitoring shows why: <strong>Milvus pins its CPU during the query phase</strong>, and at the higher concurrency steps the load generator starts to bottleneck too.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_7_43b3ac8d61.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: Grafana CPU utilization during baseline run</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_8_6b00c5655e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: Grafana QPS panel during baseline run</p>
<p>The takeaway: <strong>the ceiling sits in the search execution path and the resources it uses</strong>, not anywhere else. That sets up the real question: <strong>can cutting the segment count claw back some of that headroom?</strong></p>
<h2 id="After-Force-Merge-One-Segment-5600–6000-QPS" class="common-anchor-header">After Force Merge: One Segment, ~5,600–6,000 QPS<button data-href="#After-Force-Merge-One-Segment-5600–6000-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>The second run turns Force Merge on. A single <code translate="no">compact()</code> call with a <code translate="no">target_size</code> starts the merge, which Milvus runs asynchronously in the background.</p>
<p>When it finishes, <strong>the three 300,000-row segments have become one segment of 1 million rows</strong>, and Milvus rebuilds the index for it. Monitoring showed the 16 cores pinned during that rebuild, which is the trade in plain sight: <strong>Force Merge spends its cost up front, in the merge and the index rebuild, and pays it back later, in the query phase.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_9_146e261905.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: single 1M-row sealed segment after Force Merge, in Attu</p>
<p><strong>On a cluster, you can keep that cost out of the way:</strong> separate DataNode and QueryNode resources, or build the index on GPU where that’s an option. On a single node like this one, the rebuild has nowhere to hide and competes with everything else for CPU and I/O.</p>
<h3 id="Test-results-search-QPS-from-3000-to-6000" class="common-anchor-header">Test results: search QPS from ~3,000 to ~6,000</h3><table>
<thead>
<tr><th>Concurrency</th><th>Baseline QPS</th><th>Force Merge QPS</th><th>Improvement</th><th>Baseline p99</th><th>Force Merge p99</th></tr>
</thead>
<tbody>
<tr><td>80</td><td>3079.1</td><td>5434.4</td><td><strong>+76.5%</strong></td><td>48.2 ms</td><td>32.8 ms</td></tr>
<tr><td>120</td><td>3123.5</td><td>5650.5</td><td><strong>+80.9%</strong></td><td>70.4 ms</td><td>44.9 ms</td></tr>
<tr><td>160</td><td>3099.0</td><td>5780.5</td><td><strong>+86.5%</strong></td><td>89.2 ms</td><td>56.9 ms</td></tr>
<tr><td>200</td><td>3150.1</td><td>5770.8</td><td><strong>+83.2%</strong></td><td>114.5 ms</td><td>70.6 ms</td></tr>
<tr><td>240</td><td>2303.7</td><td>4310.6</td><td><strong>+87.1%</strong></td><td>65.6 ms</td><td>40.8 ms</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/force_merge_compaction_milvus_qps_md_10_1f9d1d229d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: comparative QPS chart, baseline vs Force Merge across concurrency steps</p>
<p>Once the new segment is indexed, the same sweep tells a clear story. Baseline sits near 3,000 QPS; <strong>after Force Merge it runs at roughly 5,600 to 6,000</strong>. At 120 concurrency it’s about 5,600; at 160 and 200 it’s close to 5,700–5,800. Grafana and the VDBBench summary agree, and the post-merge throughput curve sits well above baseline.</p>
<p><strong>That gap is the fan-out tax made visible.</strong> With one segment instead of three, each query stops paying for the duplicate searches, the scheduling, and the merge, and the CPU that was going to that overhead now serves more queries instead.</p>
<p><strong>The 240-concurrency row is the one to read carefully:</strong> both numbers fall there (baseline to 2,303, Force Merge to 4,311) because the 32-core load generator, not Milvus, has become the bottleneck. The gap between them, +87%, still holds.</p>
<h2 id="When-to-Use-Force-Merge-and-When-Not-To" class="common-anchor-header">When to Use Force Merge (and When Not To)<button data-href="#When-to-Use-Force-Merge-and-When-Not-To" class="anchor-icon" translate="no">
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
    </button></h2><p>Force Merge isn’t for every collection. <strong>It pays off in some situations and backfires in others</strong>; the table sorts the common cases so you can place your own.</p>
<table>
<thead>
<tr><th></th><th><strong>✅ When Force Merge fits</strong></th><th><strong>⚠️ When to be cautious or avoid</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Workload</strong></td><td>Data loaded once and rarely changing, reads dominate, and search throughput is already your bottleneck</td><td>The collection still takes steady writes, updates, or deletes</td></tr>
<tr><td><strong>Deployment</strong></td><td>A cluster where write and query resources are isolated, so the rebuild won’t starve queries</td><td>A single node, or CPU, memory, and disk I/O already running tight</td></tr>
<tr><td><strong>Timing</strong></td><td>You can run it in a quiet window, like overnight or before a release</td><td>No maintenance window available, or currently in peak traffic</td></tr>
</tbody>
</table>
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
    </button></h2><p><strong>The idea behind Force Merge is simple.</strong> Once the operator knows the data has settled, Force Merge consolidates many small segments into a few large ones, which cuts the per-segment overhead every later search would otherwise pay.</p>
<p>In this experiment (1 million 768-dimensional vectors on an HNSW graph index, single-node Docker Compose), <strong>that one merge took QPS from about 3,000 to roughly 5,600–6,000</strong>. It isn’t a reason to run Force Merge everywhere, but for static, read-heavy collections with scattered segments, segment shape is a performance variable worth measuring rather than assuming.</p>
<p>However, please note: <strong>Force Merge runs asynchronously and won’t block queries</strong>, but it spends I/O and memory while it works and can raise query latency, so <strong>run it during a quiet window and watch the segment count before and after</strong>.</p>
<p>Treat it as <strong>a maintenance action you can observe, roll back, and re-run</strong>: prove the gain on your own data and workload first, then decide whether it earns a place in your routine.</p>
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
    </button></h2><ul>
<li><strong>Try it yourself.</strong> The <a href="https://milvus.io/docs/force-merge.md"><strong>Force Merge Compaction docs</strong></a> cover the <code translate="no">compact()</code> parameters and the three <code translate="no">target_size</code> modes.</li>
<li><strong>Have questions?</strong> Ask about segment layout, compaction, or tuning in the <a href="https://discord.gg/milvus"><strong>Milvus Discord</strong></a>, or bring them to <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting"><strong>Milvus Office Hours</strong></a>.</li>
<li><strong>Prefer a managed option?</strong> <a href="https://zilliz.com/"><strong>Zilliz Cloud</strong></a> runs Milvus as a fully managed service, so you can skip the self-host (<a href="https://cloud.zilliz.com/signup?utm_source=blog-force-merge-compaction"><strong>sign up</strong></a><strong>,</strong> or <a href="https://cloud.zilliz.com/login"><strong>sign in</strong></a> if you already have an account). New work-email signups get $100 in free credits.</li>
</ul>
