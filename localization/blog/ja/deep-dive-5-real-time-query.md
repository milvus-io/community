---
id: deep-dive-5-real-time-query.md
title: Using the Milvus Vector Database for Real-Time Query
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: Learn about the underlying mechanism of real-time query in Milvus.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<blockquote>
<p>This article is written by <a href="https://github.com/xige-16">Xi Ge</a> and transcreated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>In the previous post, we have talked about <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">data insertion and data persistence</a> in Milvus. In this article, we will continue to explain how <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">different components</a> in Milvus interact with each other to complete real-time data query.</p>
<p><em>Some useful resources before getting started are listed below. We recommend reading them first to better understand the topic in this post.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep dive into the Milvus architecture</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus data model</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">The role and function of each Milvus component</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Data processing in Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Data insertion and data persistence in Milvus</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">Load data to query node<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Before a query is executed, the data has to be loaded to the query nodes first.</p>
<p>There are two types of data that are loaded to query node: streaming data from <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">log broker</a>, and historical data from <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">object storage</a> (also called persistent storage below).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
    <span>Flowchart</span>
  </span>
</p>
<p>Data coord is in charge of handling streaming data that are continuously inserted into Milvus. When a Milvus user calls <code translate="no">collection.load()</code> to load a collection, query coord will inquire the data coord to learn which segments have been persisted in storage and their corresponding checkpoints. A checkpoint is a mark to signify that persisted segments before the checkpoints are consumed while those after the checkpoint are not.</p>
<p>Then, the query coord outputs allocation strategy based on the information from the data coord: either by segment or by channel. The segment allocator is responsible for allocating segments in persistent storage  (batch data) to different query nodes. For instance, in the image above, the segment allocator allocates segment 1 and 3 (S1, S3) to query node 1, and segment 2 and 4 (S2, S4) to query node 2. The channel allocator assigns different query nodes to watch multiple data manipulation <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">channels</a> (DMChannels) in the log broker. For instance, in the image above, the channel allocator assigns query node 1 to watch  channel 1 (Ch1), and query node 2 to watch channel 2 (Ch2).</p>
<p>With the allocation strategy, each query node loads segment data and watch the channels accordingly. In query node 1 in the image, historical data (batch data), are loaded via the allocated S1 and S3 from persistent storage. In the meanwhile, query node 1 loads incremental data (streaming data) by subscribing to channel 1 in log broker.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">Data management in query node<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>A query node needs to manage both historical and incremental data. Historical data are stored in <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">sealed segments</a> while incremental data are stored in <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">growing segments</a>.</p>
<h3 id="Historical-data-management" class="common-anchor-header">Historical data management</h3><p>There are mainly two considerations for historical data management: load balance and query node failover.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
    <span>Load balance</span>
  </span>
</p>
<p>For instance, as shown in the illustration, query node 4 has been allocated more sealed segments than the rest of the query nodes. Very likely, this will make query node 4 the bottleneck that slows down the whole query process. To solve this issue, the system needs to allocate several segments in query node 4 to other query nodes. This is called load balance.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
    <span>Query node failover</span>
  </span>
</p>
<p>Another possible situation is illustrated in the image above. One of the nodes, query node 4, is suddenly down. In this case, the load (segments allocated to query node 4) needs to be transferred to other working query nodes to ensure the accuracy of query results.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">Incremental data management</h3><p>Query node watches DMChannels to receive incremental data. Flowgraph is introduced in this process. It first filters all the data insertion messages. This is to ensure that only data in a specified partition is loaded. Each collection in Milvus has a corresponding channel, which is shared by all partitions in that collection. Therefore, a flowgraph is needed for filtering inserted data if a Milvus user only needs to load data in a certain partition. Otherwise, data in all partitions in the collection will be loaded to query node.</p>
<p>After being filtered, the incremental data are inserted into growing segments, and further passed on to server time nodes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
    <span>Flowgraph</span>
  </span>
</p>
<p>During data insertion, each insertion message is assigned a timestamp. In the DMChannel shown in the image above, data are are inserted in order, from left to right. The timestamp for the first insertion message is 1; the second, 2; and the third, 6. The fourth message marked in red is not an insertion message, but rather a timetick message. This is to signify that inserted data whose timestamps are smaller than this timetick are already in log broker. In other words, data inserted after this timetick message should all have timestamps whose values are bigger than this timetick. For instance, in the image above, when query node perceives that the current timetick is 5, it means all insertion messages whose timestamp value is less than 5 are all loaded to query node.</p>
<p>The server time node provides an updated <code translate="no">tsafe</code> value every time it receives a timetick from the insert node. <code translate="no">tsafe</code> means safety time, and all data inserted before this point of time can be queried. Take an example, if <code translate="no">tsafe</code> = 9, inserted data with timestamps smaller than 9 can all be queried.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Real-time query in Milvus<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Real-time query in Milvus is enabled by query messages. Query messages are inserted into log broker by proxy. Then query nodes obtain query messages by watching the query channel in log broker.</p>
<h3 id="Query-message" class="common-anchor-header">Query message</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
    <span>Query message</span>
  </span>
</p>
<p>A query message includes the following crucial information about a query:</p>
<ul>
<li><code translate="no">msgID</code>: Message ID, the ID of the query message assigned by the system.</li>
<li><code translate="no">collectionID</code>: The ID of the collection to query (if specified by user).</li>
<li><code translate="no">execPlan</code>: The execution plan is mainly used for attribute filtering in a query.</li>
<li><code translate="no">service_ts</code>: Service timestamp will be updated together with <code translate="no">tsafe</code> mentioned above. Service timestamp signifies at which point is the service in. All data inserted before <code translate="no">service_ts</code> are available for query.</li>
<li><code translate="no">travel_ts</code>: Travel timestamp specifies a range of time in the past. And the query will be conducted on data existing in the time period specified by <code translate="no">travel_ts</code>.</li>
<li><code translate="no">guarantee_ts</code>: Guarantee timestamp specifies a period of time after which the query needs to be conducted. Query will only be conducted when <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">Real-time query</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
    <span>Query process</span>
  </span>
</p>
<p>When a query message is received, Milvus first judges if the current service time, <code translate="no">service_ts</code>, is larger than the guarantee timestamp, <code translate="no">guarantee_ts</code>, in the query message. If yes, the query will be executed. Query will be conducted in parallel on both historical data and incremental data. Since there can be an overlap of data between streaming data and batch data , an action called “local reduce” is needed to filter out the redundant query results.</p>
<p>However, if the current service time is smaller than the guarantee timestamp in a newly inserted query message, the query message will become an unsolved message and wait to be processed till the service time becomes bigger than the guarantee timestamp.</p>
<p>Query results are ultimately pushed to the result channel. Proxy obtains the query results from that channel. Likewise, proxy will conduct a “global reduce” as well because it receives results from multiple query nodes and query results might be repetitive.</p>
<p>To ensure that the proxy has received all query results before returning them to the SDK, result message will also keep a record of information including searched sealed segments, searched DMChannels, and global sealed segments (all segments on all query nodes). The system can conclude that the proxy has received all query results only if both of the following conditions are met:</p>
<ul>
<li>The union of all searched sealed segments recorded in all result messages is larger than global sealed segments,</li>
<li>All DMChannels in the collection are queried.</li>
</ul>
<p>Ultimately, proxy returns the final results after “global reduce” to the Milvus SDK.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">About the Deep Dive Series<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>With the <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">official announcement of general availability</a> of Milvus 2.0, we orchestrated this Milvus Deep Dive blog series to provide an in-depth interpretation of the Milvus architecture and source code. Topics covered in this blog series include:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus architecture overview</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs and Python SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Data processing</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Data management</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Real-time query</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Scalar execution engine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA system</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vector execution engine</a></li>
</ul>
