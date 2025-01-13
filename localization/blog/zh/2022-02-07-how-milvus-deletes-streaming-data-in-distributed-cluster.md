---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: 使用方法
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: 世界上最先进的向量数据库 Milvus 2.0 中删除功能背后的 Cardinal 设计。
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Milvus 如何在分布式集群中删除流数据</custom-h1><p>Milvus 2.0 具有统一的批处理和流处理功能以及云原生架构，在开发 DELETE 功能的过程中面临着比其前身更大的挑战。得益于其先进的存储-计算分解设计和灵活的发布/订阅机制，我们可以自豪地宣布，我们实现了这一目标。在 Milvus 2.0 中，你可以用主键删除给定 Collections 中的一个实体，这样被删除的实体就不会再出现在搜索或查询的结果中。</p>
<p>请注意，Milvus 中的 DELETE 操作指的是逻辑删除，而物理数据清理则发生在数据压缩过程中。逻辑删除不仅能大大提高受 I/O 速度限制的搜索性能，还有利于数据恢复。在时间旅行功能的帮助下，逻辑删除的数据仍然可以恢复。</p>
<h2 id="Usage" class="common-anchor-header">使用方法<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们先试试 Milvus 2.0 中的 DELETE 函数。(以下示例在 Milvus 2.0.0 上使用 PyMilvus 2.0.0）。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Implementation" class="common-anchor-header">执行<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 实例中，数据节点主要负责将流数据（日志代理中的日志）打包为历史数据（日志快照）并自动刷新到对象存储中。查询节点在完整数据（即流数据和历史数据）上执行搜索请求。</p>
<p>为了充分利用集群中并行节点的数据写入能力，Milvus 采用了基于主键散列的分片策略，将写入操作平均分配给不同的工作节点。也就是说，代理会将实体的数据处理语言（DML）消息（即请求）路由到相同的数据节点和查询节点。这些信息通过 DML 通道发布，并由数据节点和查询节点分别消费，从而共同提供搜索和查询服务。</p>
<h3 id="Data-node" class="common-anchor-header">数据节点</h3><p>收到数据 INSERT 消息后，数据节点会将数据插入一个不断增长的段，这是为接收内存中的流数据而创建的新段。如果数据行数或增长段的持续时间达到阈值，数据节点就会将其封存，以防止任何数据进入。然后，数据节点会将包含历史数据的密封段刷新到对象存储中。与此同时，数据节点会根据新数据的主键生成一个 Bloom 过滤器，并将其与密封段一起冲入对象存储区，同时将 Bloom 过滤器作为包含段统计信息的统计二进制日志（binlog）的一部分保存起来。</p>
<blockquote>
<p>bloom 过滤器是一种概率数据结构，由一个长的二进制向量和一系列随机映射函数组成。它可用于测试某个元素是否是某个集合的成员，但可能会返回假阳性匹配。           --维基百科</p>
</blockquote>
<p>当收到数据 DELETE 消息时，数据节点会缓冲相应分片中的所有 Bloom 过滤器，并将它们与消息中提供的主键进行匹配，以检索可能包含要删除的实体的所有分段（从增长的分段和封存的分段中）。在精确定位了相应的分段后，数据节点会将其缓冲到内存中，以生成记录删除操作的 Delta binlog，然后将这些 binlog 和分段一起刷新到对象存储中。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>数据节点</span> </span></p>
<p>由于一个分区只分配一个 DML 通道，因此群集中添加的其他查询节点将无法订阅该 DML 通道。为确保所有查询节点都能收到 DELETE 消息，数据节点会过滤 DML-Channel 中的 DELETE 消息，并将其转发到 Delta-Channel 以通知所有查询节点删除操作符。</p>
<h3 id="Query-node" class="common-anchor-header">查询节点</h3><p>从对象存储加载 Collections 时，查询节点首先会获取每个分片的检查点，该检查点标记了自上次刷新操作以来的 DML 操作。在检查点的基础上，查询节点会加载所有密封分段及其 Delta binlog 和 Bloom 过滤器。加载所有数据后，查询节点会订阅 DML 通道、Delta 通道和查询通道。</p>
<p>如果在 Collections 加载到内存后收到更多的数据 INSERT 消息，查询节点会首先根据消息精确定位增长的数据段，并更新内存中相应的 Bloom 过滤器，仅供查询使用。查询结束后，这些查询专用的 bloom 过滤器不会被刷新到对象存储中。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>查询节点</span> </span></p>
<p>如上所述，只有一定数量的查询节点可以从 DML 通道接收 DELETE 信息，这意味着只有它们可以执行不断增长的 DELETE 请求。对于那些订阅了 DML-Channel 的查询节点来说，它们首先会过滤成长段中的 DELETE 消息，通过将提供的主键与成长段中的查询专用 bloom 过滤器进行匹配来定位实体，然后在相应的段中记录删除操作。</p>
<p>不能订阅 DML 通道的查询节点只能处理密封网段上的搜索或查询请求，因为它们只能订阅 Delta 通道，并接收数据节点转发的 DELETE 消息。查询节点从 Delta-Channel 收集到密封网段中的所有 DELETE 消息后，通过将提供的主键与密封网段的 Bloom 过滤器进行匹配来定位实体，然后在相应的网段中记录删除操作。</p>
<p>最终，在搜索或查询时，查询节点会根据删除记录生成一个比特集，以省略已删除的实体，并在所有段中搜索剩余的实体，而不管段的状态如何。最后但并非最不重要的一点是，一致性级别会影响已删除数据的可见性。在强一致性级别下（如前面的代码示例所示），删除实体后立即不可见。如果采用有界一致性级别，则会有几秒钟的延迟，删除的实体才会不可见。</p>
<h2 id="Whats-next" class="common-anchor-header">下一步是什么？<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>在 2.0 新功能系列博客中，我们将介绍新功能的设计。阅读本系列博客的更多内容！</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Milvus 如何在分布式集群中删除流数据</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Milvus 如何压缩数据？</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Milvus 如何平衡各节点的查询负载？</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bitset 如何实现向量相似性搜索的多功能性？</a></li>
</ul>
