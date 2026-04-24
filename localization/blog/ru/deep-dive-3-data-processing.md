---
id: deep-dive-3-data-processing.md
title: How Is Data Processed in a Vector Database?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  Milvus provides a data management infrastructure essential for production AI
  applications. This article unveils the intricacies of data processing inside.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<blockquote>
<p>This article is written by <a href="https://github.com/czs007">Zhenshan Cao</a> and transcreated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>In the previous two posts in this blog series, we have already covered the <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">system architecture</a> of Milvus, the world’s most advanced vector database, and its <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Python SDK and API</a>.</p>
<p>This post mainly aims to help you understand how data is processed in Milvus by going deep into the Milvus system and examining the interaction between the data processing components.</p>
<p><em>Some useful resources before getting started are listed below. We recommend reading them first to better understand the topic in this post.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep dive into the Milvus architecture</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus data model</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">The role and function of each Milvus component</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Data processing in Milvus</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">MsgStream interface<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">MsgStream interface</a> is crucial to data processing in Milvus. When <code translate="no">Start()</code> is called, the coroutine in the background writes data into the <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">log broker</a> or reads data from there. When <code translate="no">Close()</code> is called, the coroutine stops.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
    <span>MsgStream interface</span>
  </span>
</p>
<p>The MsgStream can serve as a producer and a consumer. The <code translate="no">AsProducer(channels []string)</code> interface defines MsgStream as a producer while the <code translate="no">AsConsumer(channels []string, subNamestring)</code>defines it as a consumer. The parameter <code translate="no">channels</code> is shared in both interfaces and it is used to define which (physical) channels to writes data into or read data from.</p>
<blockquote>
<p>The number of shards in a collection can be specified when a collection is created. Each shard corresponds to a <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">virtual channel (vchannel)</a>. Therefore, a collection can have multiple vchannels. Milvus assigns each vchannel in the log broker a <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">physical channel (pchannel)</a>.</p>
</blockquote>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
    <span>Each virtual channel/shard corresponds to a physical channel.</span>
  </span>
</p>
<p><code translate="no">Produce()</code> in the MsgStream interface in charge of writing data into the pchannels in log broker. Data can be written in two ways:</p>
<ul>
<li>Single write: entities are written into different shards (vchannel) by the hash values of primary keys. Then these entities flow into corresponding pchannels in the log broker.</li>
<li>Broadcast write: entities are written into all of the pchannels specified by the parameter <code translate="no">channels</code>.</li>
</ul>
<p><code translate="no">Consume()</code> is a type of blocking API. If there is no data available in the specified pchannel, the coroutine will be blocked when <code translate="no">Consume()</code> is called in MsgStream interface. On the other hand, <code translate="no">Chan()</code> is a non-blocking API, which means that the coroutine reads and processes data only if there is existing data in the specified pchannel. Otherwise, the coroutine can process other tasks and will not be blocked when there is no data available.</p>
<p><code translate="no">Seek()</code> is method for failure recovery. When a new node is started, the data consumption record can be obtained and data consumption can resume from where it was interrupted by calling <code translate="no">Seek()</code>.</p>
<h2 id="Write-data" class="common-anchor-header">Write data<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>The data written  into different vchannels (shards) can either be insert message or delete message. These vchannels can also be called DmChannels (data manipulation channels).</p>
<p>Different collections may share the same pchannels in the log broker. One collection can have multiple shards and hence multiple corresponding vchannels. The entities in the same collection consequently flow into multiple corresponding pchannels in the log broker. As a result, the benefit of sharing pchannels is an increased volume of throughput enabled by high concurrency of the log broker.</p>
<p>When a collection is created, not only the number of shards is specified, but also the mapping between vchannels and pchannels in the log broker is decided.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
    <span>Write path in Milvus</span>
  </span>
</p>
<p>As shown in the illustration above, in the write path, proxies write data into the log broker via the <code translate="no">AsProducer()</code> interface of the MsgStream. Then data nodes consume the data, then convert and store the consumed data in object storage. The storage path is a type of meta information which will be recorded in etcd by data coordinators.</p>
<h3 id="Flowgraph" class="common-anchor-header">Flowgraph</h3><p>Since different collections may share the same pchannels in the log broker, when consuming data, data nodes or query nodes need to judge to which collection the data in a pchannel belongs. To solve this problem, we introduced flowgraph in Milvus. It is mainly in charge of filtering data in a shared pchannel by collection IDs. So, we can say that each flowgraph handles the data stream in a corresponding shard (vchannel) in a collection.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
    <span>Flowgraph in write path</span>
  </span>
</p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStream creation</h3><p>When writing data, MsgStream object is created in the following two scenarios:</p>
<ul>
<li>When the proxy receives a data insertion request, it first tries to obtain the mapping between vchannels and pchannels via root coordinator (root coord). Then the proxy creates an MsgStream object.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
    <span>Scenario 1</span>
  </span>
</p>
<ul>
<li>When data node starts and reads the meta information of channels in etcd, the MsgStream object is created.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
    <span>Scenario 2</span>
  </span>
</p>
<h2 id="Read-data" class="common-anchor-header">Read data<button data-href="#Read-data" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
    <span>Read path in Milvus</span>
  </span>
</p>
<p>The general workflow of reading data is illustrated in the image above. Query requests are broadcast via DqRequestChannel to query nodes. The query nodes execute the query tasks in parallel. The query results from query nodes go through gRPC and proxy aggregate the results and returns them to the client.</p>
<p>To take a closer look at the data reading process, we can see that the proxy writes query requests into DqRequestChannel. Query nodes then consume message by subscribing to DqRequestChannel. Each message in the DqRequestChannel is broadcast so that all subscribed query nodes can receive the message.</p>
<p>When query nodes receive query requests, they conduct a local query on both batch data stored in sealed segments and streaming data that are dynamically inserted into Milvus and stored in growing segments. Afterwards, query nodes need to aggregate the query results in both <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">sealed and growing segments</a>. These aggregated results are passed on to proxy via gRPC.</p>
<p>The proxy collects all the results from multiple query nodes and then aggregate them to obtain the final results. Then the proxy returns the final query results to the client. Since each query request and its corresponding query results are labelled by the same unique requestID, proxy can figure out which query results correspond to which query request.</p>
<h3 id="Flowgraph" class="common-anchor-header">Flowgraph</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
    <span>Flowgraph in read path</span>
  </span>
</p>
<p>Similar to the write path, flowgraphs are also introduced in the read path. Milvus implements the unified Lambda architecture, which integrates the processing of the incremental and historical data. Therefore, query nodes need to obtain real-time streaming data as well. Similarly, flowgraphs in read path filters and differentiates data from different collections.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStream creation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
    <span>Creating MsgStream object in read path</span>
  </span>
</p>
<p>When reading data, the MsgStream object is created in the following scenario:</p>
<ul>
<li>In Milvus, data cannot be read unless they are loaded. When the proxy receives a data load request, it sends the request to query coordinator which decides the way of assigning shards to different query nodes. The assigning information (i.e. The names of vchannels and the mapping between vchannels and their corresponding pchannels) is sent to query nodes via method call or RPC (remote procedure call). Subsequently, the query nodes create corresponding MsgStream objects to consume data.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">DDL operations<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL stands for data definition language. DDL operations on metadata can be categorized into write requests and read requests. However, these two types of requests are treated equally during metadata processing.</p>
<p>Read requests on metadata include:</p>
<ul>
<li>Query collection schema</li>
<li>Query indexing information
And more</li>
</ul>
<p>Write requests include:</p>
<ul>
<li>Create a collection</li>
<li>Drop a collection</li>
<li>Build an index</li>
<li>Drop an index
And more</li>
</ul>
<p>DDL requests are sent to the proxy from the client, and the proxy further passes on these requests in the received order to the root coord which assigns a timestamp for each DDL request and conducts dynamic checks on the requests. Proxy handles each request in a serial manner, meaning one DDL request at a time. The proxy will not process the next request until it completes processing the previous request and receive results from the root coord.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
    <span>DDL operations.</span>
  </span>
</p>
<p>As shown in the illustration above, there are <code translate="no">K</code> DDL requests in the Root coord task queue. The DDL requests in the task queue are arranged in the order they are received by the root coord. So, <code translate="no">ddl1</code> is the first sent to root coord, and <code translate="no">ddlK</code> is the last one in this batch. The root coord processes the requests one by one in the time order.</p>
<p>In a distributed system, the communication between the proxies and the root coord is enabled by gRPC. The root coord keeps a record of the maximum timestamp value of the executed tasks to ensure that all DDL requests are processed in time order.</p>
<p>Suppose there are two independent proxies, proxy 1 and proxy 2. They both send DDL requests to the same root coord. However, one problem is that earlier requests are not necessarily sent to the root coord before those requests received by another proxy later. For instance, in the image above, when <code translate="no">DDL_K-1</code> is sent to the root coord from proxy 1, <code translate="no">DDL_K</code> from proxy 2 has already been accepted and executed by the root coord. As recorded by the root coord, the maximum timestamp value of the executed tasks at this point is <code translate="no">K</code>. So in order not to interrupt the time order, the request <code translate="no">DDL_K-1</code> will be rejected by the root coord’s task queue . However, if proxy 2 sends the request <code translate="no">DDL_K+5</code> to the root coord at this point, the request will be accepted to the task queue and will be executed later according to its timestamp value.</p>
<h2 id="Indexing" class="common-anchor-header">Indexing<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">Building an index</h3><p>Upon receiving index building requests from the client, the proxy first carries out static checks on the requests and sends them to the root coord. Then the root coord persists these index building requests into meta storage (etcd) and sends the requests to the index coordinator (index coord).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
    <span>Building an index.</span>
  </span>
</p>
<p>As illustrated above, when the index coord receives index building requests from the root coord, it first persists the task in etcd for meta store. The initial status of the index building task is <code translate="no">Unissued</code>. The index coord maintains a record of the task load of each index node, and sends to inbound tasks to a less loaded index node. Upon completion of the task, the index node writes the status of the task, either <code translate="no">Finished</code> or <code translate="no">Failed</code> into meta storage, which is etcd in Milvus. Then the index coord will understand if the index building task succeeds or fails by looking up in etcd. If the task fails due to limited system resources or dropout of the index node, the index coord will re-trigger the whole process and assign the same task to another index node.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">Dropping an index</h3><p>In addition, the index coord is also in charge of the requests of dropping indexes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
    <span>Dropping an index.</span>
  </span>
</p>
<p>When the root coord receives a request of dropping an index from the client, it first marks the index as &quot;dropped&quot;, and returns the result to the client while notifying the index coord. Then the index  coord filters all indexing tasks with the <code translate="no">IndexID</code> and those tasks matching the condition are dropped.</p>
<p>The background coroutine of the index coord will gradually delete all indexing tasks marked as “dropped” from object storage (MinIO and S3). This process involves the recycleIndexFiles interface. When all corresponding index files are deleted, the meta information of the deleted indexing tasks are removed from meta storage (etcd).</p>
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
