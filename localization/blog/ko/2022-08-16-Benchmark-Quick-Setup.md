---
id: 2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md
title: A Quick Guide to Benchmarking Milvus 2.1
author: Yanliang Qiao
date: 2022-08-16T00:00:00.000Z
desc: Follow our step-by-step guide to perform a Milvus 2.1 benchmark by yourself.
cover: assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png" alt="Cover" class="doc-image" id="cover" />
    <span>Cover</span>
  </span>
</p>
<p>Recently, we have updated the <a href="https://milvus.io/docs/v2.1.x/benchmark.md">benchmark report of Milvus 2.1</a>. Tests with a dataset of 1 million vectors have proved that QPS can be dramatically increased by merging small-<a href="https://milvus.io/docs/v2.1.x/benchmark.md#Terminology">nq</a> queries.</p>
<p>Here are some simple scripts for you to easily reproduce the tests.</p>
<h2 id="Procedures" class="common-anchor-header">Procedures<button data-href="#Procedures" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p>Deploy a Milvus standalone or cluster. In this case, the IP address of the Milvus server is 10.100.31.105.</p></li>
<li><p>Deploy a client. In this case, we use Ubuntu 18.04 and Python 3.8.13 for the deployment. Run the following code to install PyMilvus 2.1.1.</p></li>
</ol>
<pre><code translate="no">pip install pymilvus==2.1.1
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Download and copy the following files to the same working directory as the client. In this case, the working directory is <code translate="no">/go_ben</code>.</p>
<ul>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py"><code translate="no">collection_prepare.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py"><code translate="no">go_benchmark.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark"><code translate="no">benchmark</code></a> (for Ubuntu) or <a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac"><code translate="no">benchmark-mac</code></a> (for macOS)</p></li>
</ul>
<p><strong>Note:</strong></p>
<ul>
<li><p><code translate="no">benchmark</code> and <code translate="no">benchmark-mac</code> are executable files developed and compiled using Go SDK 2.1.1. They are only used to conduct a concurrent search.</p></li>
<li><p>For Ubuntu users, please download <code translate="no">benchmark</code>; for macOS users, please download <code translate="no">benchmark-mac</code>.</p></li>
<li><p>Executable permissions are required to access <code translate="no">benchmark</code> or <code translate="no">benchmark-mac</code>.</p></li>
<li><p>Mac users need to trust the <code translate="no">benchmark-mac</code> file by configuring Security &amp; Privacy in System Preferences.</p></li>
<li><p>Settings on concurrent search can be found and modified in the <code translate="no">go_benchmark.py</code> source code.</p></li>
</ul></li>
</ol>
<ol start="4">
<li>Create a collection and insert vector data.</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-comment"># python collection_prepare.py 10.100.31.105 </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Open <code translate="no">/tmp/collection_prepare.log</code> to check the running result.</li>
</ol>
<pre><code translate="no">...
08/11/2022 17:33:34 PM - INFO - Build index costs 263.626
08/11/2022 17:33:54 PM - INFO - Collection prepared completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li>Call <code translate="no">benchmark</code> (or <code translate="no">benchmark-mac</code> on macOS) to conduct a concurrent search.</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-meta"># python go_benchmark.py 10.100.31.105 ./benchmark</span>
[<span class="hljs-meta">write_json_file</span>] <span class="hljs-function">Remove <span class="hljs-title">file</span>(<span class="hljs-params">search_vector_file.json</span>).
[write_json_file] Write json <span class="hljs-keyword">file</span>:search_vector_file.json done.
Params of go_benchmark: [&#x27;./benchmark&#x27;, &#x27;locust&#x27;, &#x27;-u&#x27;, &#x27;10.100.31.105:19530&#x27;, &#x27;-q&#x27;, &#x27;search_vector_file.json&#x27;, &#x27;-s&#x27;, &#x27;</span>{\n  <span class="hljs-string">&quot;collection_name&quot;</span>: <span class="hljs-string">&quot;random_1m&quot;</span>,\n  <span class="hljs-string">&quot;partition_names&quot;</span>: [],\n  <span class="hljs-string">&quot;fieldName&quot;</span>: <span class="hljs-string">&quot;embedding&quot;</span>,\n  <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,\n  <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>,\n  <span class="hljs-string">&quot;params&quot;</span>: {\n    <span class="hljs-string">&quot;sp_value&quot;</span>: <span class="hljs-number">64</span>,\n    <span class="hljs-string">&quot;dim&quot;</span>: <span class="hljs-number">128</span>\n  },\n  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">1</span>,\n  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-literal">null</span>,\n  <span class="hljs-string">&quot;output_fields&quot;</span>: [],\n  <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">600</span>\n}<span class="hljs-string">&#x27;, &#x27;</span>-p<span class="hljs-string">&#x27;, &#x27;</span><span class="hljs-number">10&#x27;</span>, <span class="hljs-string">&#x27;-f&#x27;</span>, <span class="hljs-string">&#x27;json&#x27;</span>, <span class="hljs-string">&#x27;-t&#x27;</span>, <span class="hljs-string">&#x27;60&#x27;</span>, <span class="hljs-string">&#x27;-i&#x27;</span>, <span class="hljs-string">&#x27;20&#x27;</span>, <span class="hljs-string">&#x27;-l&#x27;</span>, <span class="hljs-string">&#x27;go_log_file.log&#x27;</span>]
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - go search     <span class="hljs-number">9665</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.679</span>     <span class="hljs-number">6.499</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">12.810</span>  |    <span class="hljs-number">483.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - go search    <span class="hljs-number">19448</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.443</span>     <span class="hljs-number">6.549</span>    <span class="hljs-number">78.121</span>    <span class="hljs-number">13.401</span>  |    <span class="hljs-number">489.22</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29170</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.568</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">76.887</span>    <span class="hljs-number">12.828</span>  |    <span class="hljs-number">486.15</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][   DEBUG] - go search run finished, parallel: <span class="hljs-number">10</span>(benchmark_run.go:<span class="hljs-number">95</span>:benchmark)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:159:samplingLoop)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29180</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.560</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">13.014</span>  |    <span class="hljs-number">486.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">160</span>:samplingLoop)
Result of go_benchmark: {<span class="hljs-string">&#x27;response&#x27;</span>: True, <span class="hljs-string">&#x27;err_code&#x27;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&#x27;err_message&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>} 
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>Open the <code translate="no">go_log_file.log</code> file under the current directory to check the detailed search log. The following is the search information you can find in the search log.
<ul>
<li><p>reqs: number of search requests from the moment when concurrency happens to the current moment (the current time-span)</p></li>
<li><p>fails: number of failed requests as a percentage of reqs in the current time-span</p></li>
<li><p>Avg: average request response time in the current time-span (unit: milliseconds)</p></li>
<li><p>Min: minimum request response time in the current time-span (unit: milliseconds)</p></li>
<li><p>Max: maximum request response time in the current time-span (unit: milliseconds)</p></li>
<li><p>Median: median request response time in the current time-span (unit: milliseconds)</p></li>
<li><p>req/s: number of requests per second, i.e. QPS</p></li>
<li><p>failures/s: average number of failed requests per second in the current time-span</p></li>
</ul></li>
</ol>
<h2 id="Downloading-Scripts-and-Executable-Files" class="common-anchor-header">Downloading Scripts and Executable Files<button data-href="#Downloading-Scripts-and-Executable-Files" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py">collection_prepare.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py">go_benchmark.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark">benchmark</a> for Ubuntu</p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac">benchmark-mac</a> for macOS</p></li>
</ul>
<h2 id="Whats-next" class="common-anchor-header">What’s next<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>With the official release of Milvus 2.1, we have prepared a series of blogs introducing the new features. Read more in this blog series:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">How to Use String Data to Empower Your Similarity Search Applications</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Using Embedded Milvus to Instantly Install and Run Milvus with Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Increase Your Vector Database Read Throughput with In-Memory Replicas</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Understanding Consistency Level in the Milvus Vector Database</a></li>
<li><a href="https://milvus.io/blog/data-security.md">How Does the Milvus Vector Database Ensure Data Security?</a></li>
</ul>
