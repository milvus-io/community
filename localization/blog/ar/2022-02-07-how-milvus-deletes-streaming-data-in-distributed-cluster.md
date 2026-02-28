---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: Usage
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  The cardinal design behind the deletion function in Milvus 2.0, the world's
  most advanced vector database.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>How Milvus Deletes Streaming Data in a Distributed Cluster</custom-h1><p>Featuring unified batch-and-stream processing and cloud-native architecture, Milvus 2.0 poses a greater challenge than its predecessor did during the development of the DELETE function. Thanks to its advanced storage-computation disaggregation design and the flexible publication/subscription mechanism, we are proud to announce that we made it happen. In Milvus 2.0, you can delete an entity in a given collection with its primary key so that the deleted entity will no longer be listed in the result of a search or a query.</p>
<p>Please note that the DELETE operation in Milvus refers to logical deletion, whereas physical data cleanup occurs during the Data Compaction. Logical deletion not only greatly boosts the search performance constrained by the I/O speed, but also facilitates data recovery. Logically deleted data can still be retrieved with the help of the Time Travel function.</p>
<h2 id="Usage" class="common-anchor-header">Usage<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s try out the DELETE function in Milvus 2.0 first. (The following example uses PyMilvus 2.0.0 on Milvus 2.0.0).</p>
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
<h2 id="Implementation" class="common-anchor-header">Implementation<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>In a Milvus instance, a data node is mainly responsible for packing streaming data (logs in log broker) as historical data (log snapshots) and automatically flushing them to object storage. A query node executes search requests on full data, i.e. both streaming data and historical data.</p>
<p>To make the most of the data writing capacity of parallel nodes in a cluster, Milvus adopts a sharding strategy based on primary key hashing to distribute writing operations evenly to different worker nodes. That is to say, proxy will route the Data Manipulation Language (DML) messages (i.e. requests) of an entity to the same data node and query node. These messages are published through the DML-Channel and consumed by the data node and query node separately to provide search and query services together.</p>
<h3 id="Data-node" class="common-anchor-header">Data node</h3><p>Having received data INSERT messages, the data node inserts the data in a growing segment, which is a new segment created to receive streaming data in memory. If either the data row count or the duration of the growing segment reaches the threshold, the data node seals it to prevent any incoming data. The data node then flushes the sealed segment, which contains the historical data, to the object storage. Meanwhile, the data node generates a bloom filter based on the primary keys of the new data, and flushed it to the object storage together with the sealed segment, saving the bloom filter as a part of the statistics binary log (binlog), which contains the statistical information of the segment.</p>
<blockquote>
<p>A bloom filter is a probabilistic data structure that consists of a long binary vector and a series of random mapping functions. It can be used to test whether an element is a member of a set, but might return false positive matches.           —— Wikipedia</p>
</blockquote>
<p>When data DELETE messages come in, data node buffers all bloom filters in the corresponding shard, and matches them with the primary keys provided in the messages to retrieve all segments (from both growing and sealed ones) that possibly include the entities to delete. Having pinpointed the corresponding segments, data node buffers them in memory to generate the Delta binlogs to record the delete operations, and then flushes those binlogs together with the segments back to the object storage.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
    <span>Data Node</span>
  </span>
</p>
<p>Since one shard is only assigned with one DML-Channel, extra query nodes added to the cluster will not be able to subscribe to the DML-Channel. To ensure that all query nodes can receive the DELETE messages, data nodes filter the DELETE messages from the DML-Channel, and forward them to Delta-Channel to notify all query nodes of the delete operations.</p>
<h3 id="Query-node" class="common-anchor-header">Query node</h3><p>When loading a collection from object storage, the query node first obtains each shard’s checkpoint, which marks the DML operations since the last flush operation. Based on the checkpoint, the query node loads all sealed segments together with their Delta binlog and bloom filters. With all data loaded, the query node then subscribes to DML-Channel, Delta-Channel, and Query-Channel.</p>
<p>If more data INSERT messages come after the collection is loaded to memory, query node first pinpoints the growing segments according to the messages, and updates corresponding bloom filters in memory for query purposes only. Those query-dedicated bloom filters will not be flushed to object storage after the query is finished.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
    <span>Query Node</span>
  </span>
</p>
<p>As mentioned above, only a certain number of query nodes can receive DELETE messages from the DML-Channel, meaning only they can execute the DELETE requests in growing segments. For those query nodes which have subscribed to the DML-Channel, they first filter the DELETE messages in the growing segments, locate the entities by matching the provided primary keys with those query-dedicated bloom filters of the growing segments, and then record the delete operations in the corresponding segments.</p>
<p>Query nodes that cannot subscribe to the DML-Channel are only allowed to process search or query requests on sealed segments because they can only subscribe to the Delta-Channel, and receive the DELETE messages forwarded by data nodes. Having collected all DELETE messages in the sealed segments from Delta-Channel, the query nodes locate the entities by matching the provided primary keys with the bloom filters of the sealed segments, and then record the delete operations in the corresponding segments.</p>
<p>Eventually, in a search or query, the query nodes generate a bitset based on the delete records to omit the deleted entities, and search among the remaining entities from all segments, regardless of the segment status. Last but not least, the consistency level affects the visibility of the deleted data. Under Strong Consistency Level (as shown in the previous code sample), the deleted entities are immediately invisible after deletion. While Bounded Consistency Level is adopted, there will be several seconds of latency before the deleted entities become invisible.</p>
<h2 id="Whats-next" class="common-anchor-header">What’s next?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>In the 2.0 new feature series blog, we aim to explain the design of the new features. Read more in this blog series!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">How Milvus Deletes Streaming Data in a Distributed Cluster</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">How to Compact Data in Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">How Milvus Balances Query Load across Nodes?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">How Bitset Enables the Versatility of Vector Similarity Search</a></li>
</ul>
