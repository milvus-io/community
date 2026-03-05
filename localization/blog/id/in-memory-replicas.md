---
id: in-memory-replicas.md
title: Increase Your Vector Database Read Throughput with In-Memory Replicas
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  Use in-memory replicas to enhance read throughput and the utilization of
  hardware resources.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
    <span>Cover_image</span>
  </span>
</p>
<blockquote>
<p>This article is co-authored by <a href="https://github.com/congqixia">Congqi Xia</a> and <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>With its official release, Milvus 2.1 comes with many new features to provide convenience and a better user experience. Though the concept of in-memory replica is nothing new to the world of distributed databases, it is a critical feature that can help you boost system performance and enhance system availability in an effortless way. Therefore, this post sets out to explain what in-memory replica is and why it is important, and then introduces how to enable this new feature in Milvus, a vector database for AI.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">Concepts related to in-memory replica</a></p></li>
<li><p><a href="#What-is-in-memory-replica">What is in-memory replica?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">Why are in-memory replicas important?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Enable in-memory replicas in the Milvus vector database</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">Concepts related to in-memory replica<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Before getting to know what in-memory replica is and why it is important, we need to first understand a few relevant concepts including replica group, shard replica, streaming replica, historical replica, and shard leader. The image below is an illustration of these concepts.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
    <span>Replica_concepts</span>
  </span>
</p>
<h3 id="Replica-group" class="common-anchor-header">Replica group</h3><p>A replica group consists of multiple <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">query nodes</a> that are responsible for handling historical data and replicas.</p>
<h3 id="Shard-replica" class="common-anchor-header">Shard replica</h3><p>A shard replica consists of a streaming replica and a historical replica, both belonging to the same <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">shard</a> (i.e DML channel). Multiple shard replicas make up a replica group. And the exact number of shard replicas in a replica group is determined by the number of shards in a specified collection.</p>
<h3 id="Streaming-replica" class="common-anchor-header">Streaming replica</h3><p>A streaming replica contains all the <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">growing segments</a> from the same DML channel. Technically speaking, a streaming replica should be served by only one query node in one replica.</p>
<h3 id="Historical-replica" class="common-anchor-header">Historical replica</h3><p>A historical replica contains all the sealed segments from the same DML channel. The sealed segments of one historical replica can be distributed on several query nodes within the same replica group.</p>
<h3 id="Shard-leader" class="common-anchor-header">Shard leader</h3><p>A shard leader is the query node serving the streaming replica in a shard replica.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">What is in-memory replica?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Enabling in-memory replicas allows you to load data in a collection on multiple query nodes so that you can leverage extra CPU and memory resources. This feature is very useful if you have a relatively small dataset but want to increase read throughput and enhance the utilization of hardware resources.</p>
<p>The Milvus vector database holds one replica for each segment in memory for now. However, with in-memory replicas, you can have multiple replications of a segment on different query nodes. This means if one query node is conducting a search on a segment, an incoming new search request can be assigned to another idle query node as this query node has a replication of exactly the same segment.</p>
<p>In addition, if we have multiple in-memory replicas, we can better cope with the situation in which a query node crashes. Before, we have to wait for the segment to be reloaded in order to continue and search on another query node. However, with in-memory replication, the search request can be resent to a new query node immediately without having to reload the data again.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
    <span>Replication</span>
  </span>
</p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">Why are in-memory replicas important?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>One of the most significant benefits of enabling in-memory replicas is the increase in overall QPS (query per second) and throughput. Furthermore, multiple segment replicas can be maintained and the system is more resilient in the face of a failover.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Enable in-memory replicas in the Milvus vector database<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Enabling the new feature of in-memory replicas is effortless in the Milvus vector database. All you need to do is simply specify the number of replicas you want when loading a collection (ie. calling <code translate="no">collection.load()</code>).</p>
<p>In the following example tutorial, we suppose you have already <a href="https://milvus.io/docs/v2.1.x/create_collection.md">created a collection</a> named “book” and <a href="https://milvus.io/docs/v2.1.x/insert_data.md">inserted data</a> into it. Then you can run the following command to create two replicas when <a href="https://milvus.io/docs/v2.1.x/load_collection.md">loading</a> a book collection.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>You can flexibly modify the number of  replicas in the example code above to best suit your application scenario. Then you can directly conduct a vector similarity <a href="https://milvus.io/docs/v2.1.x/search.md">search</a> or <a href="https://milvus.io/docs/v2.1.x/query.md">query</a> on multiple replicas without running any extra commands. However, it should be noted that the maximum number of replicas allowed is limited by the total amount of usable memory to run the query nodes. If the number of replicas you specify exceeds the limitations of usable memory, an error will be returned during data load.</p>
<p>You can also check the information of the in-memory replicas you created by running <code translate="no">collection.get_replicas()</code>. The information of replica groups and the corresponding query nodes and shards will be returned. The following is an example of the output.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
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
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Understanding Consistency Level in the Milvus Vector Database (Part II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">How Does the Milvus Vector Database Ensure Data Security?</a></li>
</ul>
