---
id: data-addressing-storage-systems.md
title: >
  A Deep Dive into Data Addressing in Storage Systems: From HashMap to HDFS,
  Kafka, Milvus, and Iceberg
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >
  Trace how data addressing works from HashMap to HDFS, Kafka, Milvus, and
  Iceberg — and why computing locations beats searching at every scale.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>If you work on backend systems or distributed storage, you’ve probably seen this: the network isn’t saturated, machines aren’t overloaded, yet a simple lookup triggers thousands of disk I/Os or object storage API calls — and the query still takes seconds.</p>
<p>The bottleneck is rarely bandwidth or compute. It’s <em>addressing</em> — the work a system does to figure out where data lives before it can read it. <strong>Data addressing</strong> is the process of translating a logical identifier (a key, a file path, an offset, a query predicate) into the physical location of the data on storage. At scale, this process — not the actual data transfer — dominates latency.</p>
<p>Storage performance can be reduced to a simple model:</p>
<blockquote>
<p><strong>Total addressing cost = metadata accesses + data accesses</strong></p>
</blockquote>
<p>Nearly every storage optimization — from hash tables to lakehouse metadata layers — targets this equation. The techniques vary, but the goal is always the same: locate data with as few high-latency operations as possible.</p>
<p>This article traces that idea across systems of increasing scale — from in-memory data structures like HashMap, to distributed systems like HDFS and Apache Kafka, and finally to modern engines like <a href="https://milvus.io/">Milvus</a> (a <a href="https://zilliz.com/learn/what-is-a-vector-database">vector database</a>) and Apache Iceberg that operate on object storage. Despite their differences, they all optimize the same equation.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">Three Core Addressing Techniques<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>Across storage systems and distributed engines, most addressing optimizations fall into three techniques:</p>
<ul>
<li><strong>Computation</strong> — Derive the data’s location directly from a formula, instead of scanning or traversing structures to find it.</li>
<li><strong>Caching</strong> — Keep frequently accessed metadata or indexes in memory to avoid repeated high-latency reads from disk or remote storage.</li>
<li><strong>Pruning</strong> — Use range information or partition boundaries to rule out files, shards, or nodes that cannot contain the result.</li>
</ul>
<p>Throughout this article, an <em>access</em> means any operation with a real system-level cost: a disk read, a network call, or an object storage API request. Nanosecond-level CPU computation doesn’t count. What matters is reducing the number of I/O operations — or turning expensive random I/O into cheaper sequential reads.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">How Addressing Works: The Two Sum Problem<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>To make addressing concrete, consider a classic algorithm problem. Given an array of integers <code translate="no">nums</code> and a target value <code translate="no">target</code>, return the indices of two numbers that sum to <code translate="no">target</code>.</p>
<p>For example: <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → result <code translate="no">[0, 1]</code>.</p>
<p>This problem cleanly illustrates the difference between searching for data and computing where it lives.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">Solution 1: Brute-Force Search</h3><p>The brute-force approach checks every pair. For each element, it scans the rest of the array looking for a match. Simple, but O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>There’s no notion of where the answer might be. Each lookup starts from scratch and traverses the array blindly. The bottleneck isn’t the arithmetic — it’s the repeated scanning.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">Solution 2: Direct Addressing via Computation</h3><p>The optimized solution replaces scanning with a HashMap. Instead of searching for a matching value, it computes what value is needed and looks it up directly. Time complexity drops to O(n).</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>The shift: instead of scanning the array to find a match, you compute what you need and go directly to its location. Once the location can be derived, traversal disappears.</p>
<p>This is the same idea behind every high-performance storage system we’ll examine: replace scans with computation, and indirect search paths with direct addressing.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap: How Computed Addresses Replace Scans<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>A HashMap stores key-value pairs and locates values by computing an address from the key — not by searching through entries. Given a key, it applies a hash function, calculates an array index, and jumps directly to that location. No scanning required.</p>
<p>This is the simplest form of the principle that drives all the systems in this article: avoid scans by deriving locations through computation. The same idea — which underpins everything from distributed metadata lookups to <a href="https://zilliz.com/learn/vector-index">vector indexes</a> — shows up at every scale.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">The Core Data Structure</h3><p>At its core, a HashMap is built around a single structure: an array. A hash function maps keys to array indexes. Because the key space is much larger than the array, collisions are inevitable — different keys may hash to the same index. These are handled locally within each slot using a linked list or red-black tree.</p>
<p>Arrays provide constant-time access by index. This property — direct, predictable addressing — is the foundation of HashMap’s performance, and the same principle that underlies efficient data access in large-scale storage systems.</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">How Does a HashMap Locate Data?</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
    <span>Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal</span>
  </span>
</p>
<p>Take <code translate="no">put(&quot;apple&quot;, 100)</code> as an example. The entire lookup takes four steps — no full-table scan:</p>
<ol>
<li><strong>Hash the key:</strong> Pass the key through a hash function → <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>Map to an array index:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → e.g., <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>Jump to the bucket:</strong> Access <code translate="no">table[10]</code> directly — a single memory access, not a traversal</li>
<li><strong>Resolve locally:</strong> If no collision, read or write immediately. If there’s a collision, check a small linked list or red-black tree within that bucket.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">Why Is HashMap Lookup O(1)?</h3><p>Array access is O(1) because of a simple addressing formula:</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>Given an index, the memory address is computed with one multiplication and one addition. The cost is fixed regardless of array size — one computation, one memory read. A linked list, by contrast, must be traversed node by node, following pointers through separate memory locations: O(n) in the worst case.</p>
<p>A HashMap hashes a key into an array index, turning what would be a traversal into a computed address. Instead of searching for data, it computes exactly where the data lives and jumps there.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">How Does Addressing Change in Distributed Systems?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap solves addressing within a single machine, where data lives in memory and access costs are trivial. At larger scales, the constraints shift dramatically:</p>
<table>
<thead>
<tr><th>Scale Factor</th><th>Impact</th></tr>
</thead>
<tbody>
<tr><td>Data size</td><td>Megabytes → terabytes or petabytes across clusters</td></tr>
<tr><td>Storage medium</td><td>Memory → disk → network → object storage</td></tr>
<tr><td>Access latency</td><td>Memory: ~100 ns / Disk: 10–20 ms / Same-DC network: ~0.5 ms / Cross-region: ~150 ms</td></tr>
</tbody>
</table>
<p>The addressing problem doesn’t change — it just gets more expensive. Every lookup may involve network hops and disk I/O, so reducing the number of accesses matters far more than in memory.</p>
<p>To see how real systems handle this, we’ll look at two classic examples. HDFS applies computation-based addressing to large, block-based files. Kafka applies it to append-only message streams. Both follow the same principle: compute where the data is instead of searching for it.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: Addressing Large Files with In-Memory Metadata<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS is a <a href="https://milvus.io/docs/architecture_overview.md">distributed storage</a> system designed for very large files across clusters of machines. Given a file path and byte offset, it needs to find the right data block and the DataNode that stores it.</p>
<p>HDFS solves this with a deliberate design choice: keep all filesystem metadata in memory.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
    <span>HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication</span>
  </span>
</p>
<p>At the center is the NameNode. It loads the entire filesystem tree — directory structure, file-to-block mappings, and block-to-DataNode mappings — into memory. Because metadata never touches disk during reads, HDFS resolves all addressing questions through in-memory lookups only.</p>
<p>Conceptually, this is HashMap at cluster scale: use in-memory data structures to turn slow searches into fast, computed lookups. The difference is that HDFS applies the same principle to datasets spread across thousands of machines.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">How Does HDFS Locate Data?</h3><p>Consider reading data at the 200 MB offset of <code translate="no">/user/data/bigfile.txt</code>, with a default block size of 128 MB:</p>
<ol>
<li>The client sends a single RPC to the NameNode</li>
<li>The NameNode resolves the file path and computes that offset 200 MB falls in the second block (128–256 MB range) — entirely in memory</li>
<li>The NameNode returns the DataNodes storing that block (e.g., DN2 and DN3)</li>
<li>The client reads directly from the nearest DataNode (DN2)</li>
</ol>
<p>Total cost: one RPC, a few in-memory lookups, one data read. Metadata never hits disk during this process, and each lookup is constant-time. HDFS avoids expensive metadata scans even as data scales across large clusters.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka: How Sparse Indexing Avoids Random I/O<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka is designed for high-throughput message streams. Given a message offset, it needs to locate the exact byte position on disk — without turning reads into random I/O.</p>
<p>Kafka combines sequential storage with a sparse, in-memory index. Instead of searching through data, it computes an approximate location and performs a small, bounded scan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
    <span>Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files</span>
  </span>
</p>
<p>Messages are organized as Topic → Partition → Segment. Each partition is an append-only log split into segments, each consisting of:</p>
<ul>
<li>A <code translate="no">.log</code> file storing messages sequentially on disk</li>
<li>A <code translate="no">.index</code> file acting as a sparse index into the log</li>
</ul>
<p>The <code translate="no">.index</code> file is memory-mapped (mmap), so index lookups are served directly from memory without disk I/O.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
    <span>Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory</span>
  </span>
</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">How Does Kafka Locate Data?</h3><p>Suppose a consumer reads the message at offset 500,000. Kafka resolves this in three steps:</p>
<p><strong>1. Locate the segment</strong> (TreeMap lookup)</p>
<ul>
<li>Segment base offsets: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>Target file: <code translate="no">00000000000000367834.log</code></li>
<li>Time complexity: O(log S), where S is the number of segments (typically &lt; 100)</li>
</ul>
<p><strong>2. Look up the position in the sparse index</strong> (.index)</p>
<ul>
<li>Relative offset: <code translate="no">500000 − 367834 = 132166</code></li>
<li>Binary search in <code translate="no">.index</code>: find the largest entry ≤ 132166 → <code translate="no">[132100 → position 20500000]</code></li>
<li>Time complexity: O(log N), where N is the number of index entries</li>
</ul>
<p><strong>3. Sequential read from the log</strong> (.log)</p>
<ul>
<li>Start reading from position 20,500,000</li>
<li>Continue until offset 500,000 is reached</li>
<li>At most one index interval (~4 KB) is scanned</li>
</ul>
<p>Total: one in-memory segment lookup, one index lookup, one short sequential read. No random disk access.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS vs. Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Dimension</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>Design goal</td><td>Efficient storage and reading of massive files</td><td>High-throughput sequential read/write of message streams</td></tr>
<tr><td>Addressing model</td><td>Path → block → DataNode via in-memory HashMaps</td><td>Offset → segment → position via sparse index + sequential scan</td></tr>
<tr><td>Metadata storage</td><td>Centralized in NameNode memory</td><td>Local files, memory-mapped via mmap</td></tr>
<tr><td>Access cost per lookup</td><td>1 RPC + N block reads</td><td>1 index lookup + 1 data read</td></tr>
<tr><td>Key optimization</td><td>All metadata in memory — no disk in the lookup path</td><td>Sparse indexing + sequential layout avoids random I/O</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">Why Object Storage Changes the Addressing Problem<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>From HashMap to HDFS and Kafka, we’ve seen addressing in memory and in classic distributed storage. As workloads evolve, the requirements keep rising:</p>
<ul>
<li><strong>Richer queries.</strong> Modern systems handle multi-field filters, <a href="https://zilliz.com/glossary/similarity-search">similarity search</a>, and complex predicates — not just simple keys and offsets.</li>
<li><strong>Object storage as the default.</strong> Data increasingly lives in S3-compatible stores. Files are spread across buckets, and each access is an API call with fixed latency on the order of tens of milliseconds — even for a few kilobytes.</li>
</ul>
<p>At this point, latency — not bandwidth — is the bottleneck. A single S3 GET request costs ~50 ms regardless of how much data it returns. If a query triggers thousands of such requests, total latency balloons. Minimizing API fan-out becomes the central design constraint.</p>
<p>We’ll look at two modern systems — <a href="https://milvus.io/">Milvus</a>, a <a href="https://zilliz.com/learn/what-is-a-vector-database">vector database</a>, and Apache Iceberg, a lakehouse table format — to see how they address these challenges. Despite their differences, both apply the same core ideas: minimize high-latency accesses, reduce fan-out early, and favor computation over traversal.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1: When Field-Level Storage Creates Too Many Files<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is a widely used vector database designed for <a href="https://zilliz.com/glossary/similarity-search">similarity search</a> over <a href="https://zilliz.com/glossary/vector-embeddings">vector embeddings</a>. Its early storage design reflects a common first approach to building on object storage: store each field separately.</p>
<p>In V1, each field in a <a href="https://milvus.io/docs/manage-collections.md">collection</a> is stored in separate binlog files across <a href="https://milvus.io/docs/glossary.md">segments</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
    <span>Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics</span>
  </span>
</p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">How Does Milvus V1 Locate Data?</h3><p>Consider a simple query: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>Metadata lookup</strong> — Query etcd/MySQL for the segment list → <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>Read the id field across segments</strong> — For each segment, read the id binlog files</li>
<li><strong>Locate the target row</strong> — Scan loaded id data to find <code translate="no">id = 123</code></li>
<li><strong>Read the vector field</strong> — Read the corresponding vector binlog files for the matching segment</li>
</ol>
<p>Total file accesses: <strong>N × (F₁ + F₂ + …)</strong> where N = number of segments, F = binlog files per field.</p>
<p>The math gets ugly fast. For a collection with 100 fields, 1,000 segments, and 5 binlog files per field:</p>
<blockquote>
<p><strong>1,000 × 100 × 5 = 500,000 files</strong></p>
</blockquote>
<p>Even if a query touches only three fields, that’s 15,000 object storage API calls. At 50 ms per S3 request, serialized latency reaches <strong>750 seconds</strong> — over 12 minutes for a single query.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2: How Segment-Level Parquet Cuts API Calls by 10x<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>To fix the scalability limits in V1, Milvus V2 makes a fundamental change: organize data by <a href="https://milvus.io/docs/glossary.md">segment</a> instead of by field. Rather than many small binlog files, V2 consolidates data into segment-based Parquet files.</p>
<p>The file count drops from <code translate="no">N × fields × binlogs</code> to approximately <code translate="no">N</code> (one file group per segment).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
    <span>Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics</span>
  </span>
</p>
<p>But V2 doesn’t store all fields in a single file. It groups fields by size:</p>
<ul>
<li><strong>Small <a href="https://milvus.io/docs/scalar_index.md">scalar fields</a></strong> (like id, timestamp) are stored together</li>
<li><strong>Large fields</strong> (like <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">dense vectors</a>) are split into dedicated files</li>
</ul>
<p>All files belong to the same segment, and rows are aligned by index across files.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
    <span>Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values</span>
  </span>
</p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">How Does Milvus V2 Locate Data?</h3><p>For the same query — <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>Metadata lookup</strong> — Fetch the segment list → <code translate="no">[12345, 12346, …]</code></li>
<li><strong>Read Parquet footers</strong> — Extract row group statistics. Check the min/max of the id column per row group. <code translate="no">id = 123</code> falls in Row Group 0 (min=1, max=1000).</li>
<li><strong>Read only what’s needed</strong> — Parquet’s column pruning reads only the id column from the small-field file and only the <a href="https://milvus.io/docs/index-vector-fields.md">vector</a> column from the large-field file. Only matching row groups are accessed.</li>
</ol>
<p>Splitting large fields out delivers two key benefits:</p>
<ul>
<li><strong>More efficient reads.</strong> <a href="https://zilliz.com/glossary/vector-embeddings">Vector embeddings</a> dominate storage size. Mixed with small fields, they limit how many rows fit in a row group, increasing file accesses. Isolating them lets small-field row groups hold far more rows while large fields use layouts optimized for their size.</li>
<li><strong>Flexible <a href="https://milvus.io/docs/schema.md">schema</a> evolution.</strong> Adding a column means creating a new file. Removing one means skipping it at read time. No historical data rewrite needed.</li>
</ul>
<p>The result: file counts drop by more than 10x, API calls by over 10x, and query latency falls from minutes to seconds.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 vs. V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Aspect</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>File organization</td><td>Split by field</td><td>Integrated by segment</td></tr>
<tr><td>Files per collection</td><td>N × fields × binlogs</td><td>~N × column groups</td></tr>
<tr><td>Storage format</td><td>Custom binlog</td><td>Parquet (also supports Lance and Vortex)</td></tr>
<tr><td>Column pruning</td><td>Natural (field-level files)</td><td>Parquet column pruning</td></tr>
<tr><td>Statistics</td><td>Separate stats_log files</td><td>Embedded in Parquet footer</td></tr>
<tr><td>S3 API calls per query</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>Query latency</td><td>Minutes</td><td>Seconds</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg: Metadata-Driven File Pruning<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg manages analytical tables over massive datasets in lakehouse systems. When a table spans thousands of data files, the challenge is narrowing a query to just the relevant files — without scanning everything.</p>
<p>Iceberg’s answer: decide which files to read <em>before</em> any data I/O happens, using layered metadata. This is the same principle behind <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">metadata filtering</a> in vector databases — use precomputed statistics to skip irrelevant data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
    <span>Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files</span>
  </span>
</p>
<p>Iceberg uses a layered metadata structure. Each layer filters out irrelevant data before the next is consulted — similar in spirit to how <a href="https://milvus.io/docs/architecture_overview.md">distributed databases</a> separate metadata from data for efficient access.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
    <span>Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files</span>
  </span>
</p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">How Does Iceberg Locate Data?</h3><p>Consider: <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>Read metadata.json</strong> (1 I/O) — Load the current snapshot and its manifest lists</li>
<li><strong>Read the manifest list</strong> (1 I/O) — Apply <a href="https://milvus.io/docs/use-partition-key.md">partition</a>-level filters to skip entire partitions (e.g., all 2023 data is eliminated)</li>
<li><strong>Read manifest files</strong> (2 I/O) — Use file-level statistics (min/max date, min/max amount) to eliminate files that can’t match the query</li>
<li><strong>Read data files</strong> (3 I/O) — Only three files remain and are actually read</li>
</ol>
<p>Instead of scanning all 1,000 data files, Iceberg completes the lookup in <strong>7 I/O operations</strong> — avoiding over 94% of unnecessary reads.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">How Different Systems Address Data<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>System</th><th>Data Organization</th><th>Core Addressing Mechanism</th><th>Access Cost</th></tr>
</thead>
<tbody>
<tr><td>HashMap</td><td>Key → array slot</td><td>Hash function → direct index</td><td>O(1) memory access</td></tr>
<tr><td>HDFS</td><td>Path → block → DataNode</td><td>In-memory HashMaps + block calculation</td><td>1 RPC + N block reads</td></tr>
<tr><td>Kafka</td><td>Topic → Partition → Segment</td><td>TreeMap + sparse index + sequential scan</td><td>1 index lookup + 1 data read</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Collection</a> → Segment → Parquet columns</td><td>Metadata lookup + column pruning</td><td>N reads (N = segments)</td></tr>
<tr><td>Iceberg</td><td>Table → Snapshot → Manifest → Data files</td><td>Layered metadata + statistical pruning</td><td>3 metadata reads + M data reads</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">Three Principles Behind Efficient Data Addressing<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. Computation Always Beats Search</h3><p>Across every system we’ve examined, the most effective optimization follows the same rule: compute where the data is instead of searching for it.</p>
<ul>
<li>HashMap computes an array index from <code translate="no">hash(key)</code> instead of scanning</li>
<li>HDFS computes the target block from a file offset instead of traversing filesystem metadata</li>
<li>Kafka computes the relevant segment and index position instead of scanning the log</li>
<li>Iceberg uses predicates and file-level statistics to compute which files are worth reading</li>
</ul>
<p>Computation is arithmetic with a fixed cost. Search is traversal — comparisons, pointer chasing, or I/O — and its cost grows with data size. When a system can derive a location directly, scanning becomes unnecessary.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. Minimize High-Latency Accesses</h3><p>This brings us back to the core formula: <strong>Total addressing cost = metadata accesses + data accesses.</strong> Every optimization ultimately aims at reducing these high-latency operations.</p>
<table>
<thead>
<tr><th>Pattern</th><th>Example</th></tr>
</thead>
<tbody>
<tr><td>Reduce file counts to limit API fan-out</td><td>Milvus V2 segment consolidation</td></tr>
<tr><td>Use statistics to rule out data early</td><td>Iceberg manifest pruning</td></tr>
<tr><td>Cache metadata in memory</td><td>HDFS NameNode, Kafka mmap indexes</td></tr>
<tr><td>Trade small sequential scans for fewer random reads</td><td>Kafka sparse index</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. Statistics Enable Early Decisions</h3><p>Recording simple information at write time — min/max values, partition boundaries, row counts — lets systems decide at read time which files are worth reading and which can be skipped entirely.</p>
<p>This is a small investment with a large payoff. Statistics turn file access from a blind read into a deliberate choice. Whether it’s Iceberg’s manifest-level pruning or Milvus V2’s Parquet footer statistics, the principle is the same: a few bytes of metadata at write time can eliminate thousands of I/O operations at read time.</p>
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
    </button></h2><p>From Two Sum to HashMap, and from HDFS and Kafka to Milvus and Apache Iceberg, one pattern keeps repeating: performance depends on how efficiently a system locates data.</p>
<p>As data grows and storage moves from memory to disk to object storage, the mechanics change — but the core ideas don’t. The best systems compute locations instead of searching, keep metadata close, and use statistics to avoid touching data that doesn’t matter. Every performance win we’ve examined comes from reducing high-latency accesses and narrowing the search space as early as possible.</p>
<p>Whether you’re designing a <a href="https://zilliz.com/learn/what-is-vector-search">vector search</a> pipeline, building systems over <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstructured data</a>, or optimizing a lakehouse query engine, the same equation applies. Understanding how your system addresses data is the first step toward making it faster.</p>
<hr>
<p>If you’re working with Milvus and want to optimize your storage or query performance, we’d love to help:</p>
<ul>
<li>Join the <a href="https://slack.milvus.io/">Milvus Slack community</a> to ask questions, share your architecture, and learn from other engineers working on similar problems.</li>
<li><a href="https://milvus.io/office-hours">Book a free 20-minute Milvus Office Hours session</a> to walk through your use case — whether it’s storage layout, query tuning, or scaling to production.</li>
<li>If you’d rather skip the infrastructure setup, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) offers a free tier to get started.</li>
</ul>
<hr>
<p>A few questions that come up when engineers start thinking about data addressing and storage design:</p>
<p><strong>Q: Why did Milvus switch from field-level to segment-level storage?</strong></p>
<p>In Milvus V1, each field was stored in separate binlog files across segments. For a collection with 100 fields and 1,000 segments, this created hundreds of thousands of small files — each requiring its own S3 API call. V2 consolidates data into segment-based Parquet files, reducing file counts by more than 10x and cutting query latency from minutes to seconds. The core insight: on object storage, the number of API calls matters more than total data volume.</p>
<p><strong>Q: How does Milvus handle both vector search and scalar filtering efficiently?</strong></p>
<p>Milvus V2 stores <a href="https://milvus.io/docs/scalar_index.md">scalar fields</a> and <a href="https://milvus.io/docs/index-vector-fields.md">vector fields</a> in separate file groups within the same segment. Scalar queries use Parquet column pruning and row group statistics to skip irrelevant data. <a href="https://zilliz.com/learn/what-is-vector-search">Vector search</a> uses dedicated <a href="https://zilliz.com/learn/vector-index">vector indexes</a>. Both share the same segment structure, so <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">hybrid queries</a> — combining scalar filters with vector similarity — can operate on the same data without duplication.</p>
<p><strong>Q: Does the “computation over search” principle apply to vector databases?</strong></p>
<p>Yes. <a href="https://zilliz.com/learn/vector-index">Vector indexes</a> like HNSW and IVF are built on the same idea. Instead of comparing a query vector against every stored vector (brute-force search), they use graph structures or cluster centroids to compute approximate neighborhoods and jump directly to relevant regions of the vector space. The tradeoff — a small accuracy loss for orders-of-magnitude fewer distance computations — is the same “computation over search” pattern applied to high-dimensional <a href="https://zilliz.com/glossary/vector-embeddings">embedding</a> data.</p>
<p><strong>Q: What’s the biggest performance mistake teams make with object storage?</strong></p>
<p>Creating too many small files. Each S3 GET request has a fixed latency floor (~50 ms), regardless of how much data it returns. A system that reads 10,000 small files serializes 500 seconds of latency — even if total data volume is modest. The fix is consolidation: merge small files into larger ones, use columnar formats like Parquet for selective reads, and maintain metadata that lets you skip files entirely.</p>
