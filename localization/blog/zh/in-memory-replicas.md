---
id: in-memory-replicas.md
title: 利用内存副本提高向量数据库的读取吞吐量
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: 使用内存中的副本来提高读取吞吐量和硬件资源的利用率。
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文<a href="https://github.com/congqixia">由夏琮琦</a>和<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>共同撰写。</p>
</blockquote>
<p>Milvus 2.1 正式发布后，新增了许多功能，为用户提供了便利和更好的用户体验。虽然对于分布式数据库世界来说，内存中副本的概念并不新鲜，但它却是一个能帮助你轻松提高系统性能和增强系统可用性的关键功能。因此，本篇文章将着手解释什么是内存中复制以及它的重要性，然后介绍如何在用于人工智能的向量数据库 Milvus 中启用这项新功能。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">与内存中复制相关的概念</a></p></li>
<li><p><a href="#What-is-in-memory-replica">什么是内存中复制？</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">为什么内存中副本很重要？</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">在 Milvus 向量数据库中启用内存中副本</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">与内存中副本相关的概念<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>在了解什么是内存中副本以及为什么它很重要之前，我们首先需要了解一些相关概念，包括副本组、分片副本、流式副本、历史副本和分片领导者。下图是这些概念的示意图。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>复制概念</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">副本组</h3><p>副本组由多个负责处理历史数据和副本的<a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">查询节点</a>组成。</p>
<h3 id="Shard-replica" class="common-anchor-header">碎片副本</h3><p>分片副本由流式副本和历史副本组成，两者属于同一个<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">分片</a>（即 DML 通道）。多个分片副本组成一个副本组。而副本组中碎片副本的确切数量是由指定 Collections 中碎片的数量决定的。</p>
<h3 id="Streaming-replica" class="common-anchor-header">流副本</h3><p>流式副本包含来自同一 DML 通道的所有<a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">增长片段</a>。从技术上讲，流副本只能由一个副本中的一个查询节点提供服务。</p>
<h3 id="Historical-replica" class="common-anchor-header">历史副本</h3><p>历史副本包含来自同一 DML 通道的所有密封数据段。一个历史副本的密封分段可分布在同一副本组内的多个查询节点上。</p>
<h3 id="Shard-leader" class="common-anchor-header">分片组长</h3><p>分片领导是在分片副本中为流式副本提供服务的查询节点。</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">什么是内存复制？<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>启用内存中副本后，就可以在多个查询节点上加载 Collections 中的数据，这样就可以充分利用额外的 CPU 和内存资源。如果你的数据集相对较小，但又想提高读取吞吐量和硬件资源的利用率，这项功能就非常有用。</p>
<p>Milvus 向量数据库暂时在内存中为每个数据段保存一个副本。不过，有了内存中的副本，就可以在不同的查询节点上对一个数据段进行多次复制。这意味着，如果一个查询节点正在对一个数据段进行搜索，那么新收到的搜索请求可以分配给另一个空闲的查询节点，因为这个查询节点拥有完全相同的数据段副本。</p>
<p>此外，如果我们有多个内存复制，就能更好地应对查询节点崩溃的情况。以前，我们必须等待段重新加载，才能在另一个查询节点上继续搜索。但是，有了内存复制，搜索请求可以立即重新发送到新的查询节点，而无需再次重新加载数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>复制</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">内存中复制为何重要？<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>启用内存复制的最大好处之一是提高整体 QPS（每秒查询次数）和吞吐量。此外，还可以维护多个网段副本，系统在发生故障切换时也更有弹性。</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">在 Milvus 向量数据库中启用内存内副本<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 向量数据库中启用内存中复制这一新功能毫不费力。只需在加载 Collections 时指定所需的副本数量即可（即调用<code translate="no">collection.load()</code> ）。</p>
<p>在下面的示例教程中，我们假设你已经<a href="https://milvus.io/docs/v2.1.x/create_collection.md">创建了一个</a>名为 "book "<a href="https://milvus.io/docs/v2.1.x/create_collection.md">的 Collections</a>并向其中<a href="https://milvus.io/docs/v2.1.x/insert_data.md">插入了数据</a>。然后，您可以运行以下命令，在<a href="https://milvus.io/docs/v2.1.x/load_collection.md">加载</a>图书 Collection 时创建两个副本。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>您可以灵活修改上述示例代码中的副本数量，以最适合您的应用场景。然后，您就可以直接在多个副本上进行向量相似性<a href="https://milvus.io/docs/v2.1.x/search.md">搜索</a>或<a href="https://milvus.io/docs/v2.1.x/query.md">查询</a>，而无需运行任何额外的命令。不过，需要注意的是，允许的最大副本数量受限于运行查询节点的可用内存总量。如果您指定的副本数量超过了可用内存的限制，那么在数据加载过程中将返回错误信息。</p>
<p>您还可以通过运行<code translate="no">collection.get_replicas()</code> 来检查您创建的内存中副本的信息。将返回副本组以及相应查询节点和分片的信息。下面是一个输出示例。</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.1 的正式发布，我们准备了一系列介绍新功能的博客。请阅读本系列博客中的更多内容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字符串数据增强相似性搜索应用程序的功能</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即时安装并用 Python 运行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">利用内存复制提高向量数据库的读取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">了解 Milvus 向量数据库的一致性水平</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">了解 Milvus 向量数据库的一致性水平（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus 向量数据库如何确保数据安全？</a></li>
</ul>
