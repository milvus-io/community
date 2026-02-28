---
id: how-to-debug-slow-requests-in-milvus.md
title: |
  How to Debug Slow Search Requests in Milvus
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  In this post, we’ll share how to triage slow requests in Milvus and share
  practical steps you can take to keep latency predictable, stable, and
  consistently low.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>Performance is at the heart of Milvus. Under normal conditions, a search request within Milvus completes in just milliseconds. But what happens when your cluster slows down—when search latency stretches into whole seconds instead?</p>
<p>Slow searches don’t happen often, but they can surface at scale or under complex workloads. And when they do, they matter: they disrupt user experience, skew application performance, and often expose hidden inefficiencies in your setup.</p>
<p>In this post, we’ll walk through how to triage slow requests in Milvus and share practical steps you can take to keep latency predictable, stable, and consistently low.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">Identifying Slow Searches<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Diagnosing a slow request starts with two questions: <strong>how often does it happen, and where is the time going?</strong> Milvus gives you both answers through metrics and logs.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Milvus Metrics</h3><p>Milvus exports detailed metrics you can monitor in Grafana dashboards.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Key panels include:</p>
<ul>
<li><p><strong>Service Quality → Slow Query</strong>: Flags any request exceeding proxy.slowQuerySpanInSeconds (default: 5s). These are also marked in Prometheus.</p></li>
<li><p><strong>Service Quality → Search Latency</strong>: Shows overall latency distribution. If this looks normal, but end users still see delays, the problem is likely outside Milvus—in the network or application layer.</p></li>
<li><p><strong>Query Node → Search Latency by Phase</strong>: Breaks latency into queue, query, and reduce stages. For deeper attribution, panels such as <em>Scalar</em> <em>Filter Latency</em>, <em>Vector Search Latency</em>, and <em>Wait tSafe Latency</em> reveal which stage dominates.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Milvus Logs</h3><p>Milvus also logs any request lasting more than one second, tagged with markers like [Search slow]. These logs show <em>which</em> queries are slow, complementing the <em>where</em> insights from metrics. As a rule of thumb:</p>
<ul>
<li><p><strong>&lt; 30 ms</strong> → healthy search latency in most scenarios</p></li>
<li><p><strong>&gt; 100 ms</strong> → worth investigating</p></li>
<li><p><strong>&gt; 1 s</strong> → definitely slow and requires attention</p></li>
</ul>
<p>Example log:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>In short, <strong>metrics tell you where the time is going; logs tell you which queries are hit.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">Analyzing Root Cause<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">Heavy Workload</h3><p>A common cause of slow requests is an excessive workload. When a request has a very large <strong>NQ</strong> (number of queries per request), it can run for an extended period and monopolize query node resources. Other requests stack up behind it, resulting in rising queue latency. Even if each request has a small NQ, a very high overall throughput (QPS) can still cause the same effect, as Milvus may merge concurrent search requests internally.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signals to watch for:</strong></p>
<ul>
<li><p>All queries show unexpectedly high latency.</p></li>
<li><p>Query Node metrics report high <strong>in-queue latency</strong>.</p></li>
<li><p>Logs show a request with a large NQ and a long total duration, but a relatively small durationPerNQ—indicating that one oversized request is dominating resources.</p></li>
</ul>
<p><strong>How to fix it:</strong></p>
<ul>
<li><p><strong>Batch queries</strong>: Keep NQ modest to avoid overloading a single request.</p></li>
<li><p><strong>Scale out query nodes</strong>: If high concurrency is a regular part of your workload, add query nodes to spread the load and maintain low latency.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">Inefficient Filtering</h3><p>Another common bottleneck comes from inefficient filters. If filter expressions are poorly conducted or fields lack scalar indexes, Milvus may fall back to a <strong>full scan</strong> instead of scanning a small, targeted subset. JSON filters and strict consistency settings can further increase overhead.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signals to watch for:</strong></p>
<ul>
<li><p>High <strong>Scalar Filter Latency</strong> in Query Node metrics.</p></li>
<li><p>Noticeable latency spikes only when filters are applied.</p></li>
<li><p>Long <strong>Wait tSafe Latency</strong> if strict consistency is enabled.</p></li>
</ul>
<p><strong>How to fix it:</strong></p>
<ul>
<li><strong>Simplify filter expressions</strong>: Reduce query plan complexity by optimizing filters. For example, replace long OR chains with an IN expression:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>Milvus also introduces a filter expression templating mechanism designed to improve efficiency by reducing the time spent parsing complex expressions. See <a href="https://milvus.io/docs/filtering-templating.md">this document</a> for more details.</p></li>
<li><p><strong>Add proper indexes</strong>: Avoid full scans by creating scalar indexes on fields used in filters.</p></li>
<li><p><strong>Handle JSON efficiently</strong>: Milvus 2.6 introduced path and flat indexes for JSON fields, enabling efficient handling of JSON data. JSON shredding is also on <a href="https://milvus.io/docs/roadmap.md">the roadmap</a> to further improve performance. Refer to <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">the JSON field document</a> for additional information.</p></li>
<li><p><strong>Tune consistency level</strong>: Use <em>Bounded</em> or <em>Eventually</em> consistent reads when strict guarantees are not required, reducing <em>tSafe</em> wait time.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">Improper Choice of Vector Index</h3><p><a href="https://milvus.io/docs/index-explained.md">Vector indexes</a> are not one-size-fits-all. Selecting the wrong index can significantly impact latency. In-memory indexes deliver the fastest performance but consume more memory, while on-disk indexes save memory at the cost of speed. Binary vectors also require specialized indexing strategies.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signals to watch for:</strong></p>
<ul>
<li><p>High Vector Search Latency in Query Node metrics.</p></li>
<li><p>Disk I/O saturation when using DiskANN or MMAP.</p></li>
<li><p>Slower queries immediately after restart due to cache cold start.</p></li>
</ul>
<p><strong>How to fix it:</strong></p>
<ul>
<li><p><strong>Match index to workload (float vectors):</strong></p>
<ul>
<li><p><strong>HNSW</strong> — best for in-memory use cases with high recall and low latency.</p></li>
<li><p><strong>IVF family</strong> — flexible trade-offs between recall and speed.</p></li>
<li><p><strong>DiskANN</strong> — supports billion-scale datasets, but requires strong disk bandwidth.</p></li>
</ul></li>
<li><p><strong>For binary vectors:</strong> Use the <a href="https://milvus.io/docs/minhash-lsh.md">MINHASH_LSH index</a> (introduced in Milvus 2.6) with the MHJACCARD metric to efficiently approximate Jaccard similarity.</p></li>
<li><p><strong>Enable</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>: Map index files into memory instead of keeping them fully resident to strike a balance between latency and memory usage.</p></li>
<li><p><strong>Tune index/search parameters</strong>: Adjust settings to balance recall and latency for your workload.</p></li>
<li><p><strong>Mitigate cold starts</strong>: Warm up frequently accessed segments after a restart to avoid initial query slowness.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">Runtime &amp; Environment Conditions</h3><p>Not all slow queries are caused by the query itself. Query nodes often share resources with background jobs, such as compaction, data migration, or index building. Frequent upserts can generate many small, unindexed segments, forcing searches to scan raw data. In some cases, version-specific inefficiencies can also introduce latency until patched.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signals to watch for:</strong></p>
<ul>
<li><p>CPU usage spikes during background jobs (compaction, migration, index builds).</p></li>
<li><p>Disk I/O saturation affecting query performance.</p></li>
<li><p>Very slow cache warm-up after a restart.</p></li>
<li><p>Large numbers of small, unindexed segments (from frequent upserts).</p></li>
<li><p>Latency regressions tied to specific Milvus versions.</p></li>
</ul>
<p><strong>How to fix it:</strong></p>
<ul>
<li><p><strong>Reschedule background tasks</strong> (e.g., compaction) to off-peak hours.</p></li>
<li><p><strong>Release unused collections</strong> to free memory.</p></li>
<li><p><strong>Account for warm-up time</strong> after restarts; pre-warm caches if needed.</p></li>
<li><p><strong>Batch upserts</strong> to reduce the creation of tiny segments and let compaction keep up.</p></li>
<li><p><strong>Stay current</strong>: upgrade to newer Milvus versions for bug fixes and optimizations.</p></li>
<li><p><strong>Provision resources</strong>: dedicate extra CPU/memory to latency-sensitive workloads.</p></li>
</ul>
<p>By matching each signal with the right action, most slow queries can be resolved quickly and predictably.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">Best Practices to Prevent Slow Searches<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>The best debugging session is the one you never need to run. In our experience, a few simple habits go a long way toward preventing slow queries in Milvus:</p>
<ul>
<li><p><strong>Plan resource allocation</strong> to avoid CPU and disk contention.</p></li>
<li><p><strong>Set proactive alerts</strong> for both failures and latency spikes.</p></li>
<li><p><strong>Keep filter expressions</strong> short, simple, and efficient.</p></li>
<li><p><strong>Batch upserts</strong> and keep NQ/QPS at sustainable levels.</p></li>
<li><p><strong>Index all fields</strong> that are used in filters.</p></li>
</ul>
<p>Slow queries in Milvus are rare, and when they do appear, they usually have clear, diagnosable causes. With metrics, logs, and a structured approach, you can quickly identify and resolve issues. This is the same playbook our support team uses every day — and now it’s yours too.</p>
<p>We hope this guide provides not only a troubleshooting framework but also the confidence to keep your Milvus workloads running smoothly and efficiently.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 Want to dive deeper?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>Join the <a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a> to ask questions, share experiences, and learn from the community.</p></li>
<li><p>Sign up for our <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours</strong></a> to speak directly with the team and receive hands-on assistance with your workloads.</p></li>
</ul>
