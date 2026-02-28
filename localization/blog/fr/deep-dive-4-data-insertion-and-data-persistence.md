---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: Data Insertion and Data Persistence in a Vector Database
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  Learn about the mechanism behind data insertion and data persistence in Milvus
  vector database.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<blockquote>
<p>This article is written by <a href="https://github.com/sunby">Bingyi Sun</a> and transcreated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>In the previous post in the Deep Dive series, we have introduced <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">how data is processed in Milvus</a>, the world’s most advanced vector database. In this article, we will continue to examine the components involved in data insertion, illustrate the data model in detail, and explain how data persistence is achieved in Milvus.</p>
<p>Jump to:</p>
<ul>
<li><a href="#Milvus-architecture-recap">Milvus architecture recap</a></li>
<li><a href="#The-portal-of-data-insertion-requests">The portal of data insertion requests</a></li>
<li><a href="#Data-coord-and-data-node">Data coord and data node</a></li>
<li><a href="#Root-coord-and-Time-Tick">Root coord and Time Tick</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">Data organization: collection, partition, shard (channel), segment</a></li>
<li><a href="#Data-allocation-when-and-how">Data allocation: when and how</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Binlog file structure and data persistence</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Milvus architecture recap<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
    <span>Milvus architecture.</span>
  </span>
</p>
<p>SDK sends data requests to proxy, the portal, via load balancer. Then the proxy interacts with coordinator service to write DDL (data definition language) and DML (data manipulation language) requests into message storage.</p>
<p>Worker nodes, including query node, data node, and index node, consume the requests from message storage. More specifically, the query node is in charge of data query; the data node is responsible for data insertion and data persistence; and the index node mainly deals with index building and query acceleration.</p>
<p>The bottom layer is object storage, which mainly leverages MinIO, S3, and AzureBlob for storing logs, delta binlogs, and index files.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">The portal of data insertion requests<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
    <span>Proxy in Milvus.</span>
  </span>
</p>
<p>Proxy serves as a portal of data insertion requests.</p>
<ol>
<li>Initially, proxy accepts data insertion requests from SDKs, and allocates those requests into several buckets using hash algorithm.</li>
<li>Then the proxy requests data coord to assign segments, the smallest unit in Milvus for data storage.</li>
<li>Afterwards, the proxy inserts information of the requested segments into message store so that these information will not be lost.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">Data coord and data node<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>The main function of data coord is to manage channel and segment allocation while the main function of data node is to consume and persist inserted data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
    <span>Data coord and data node in Milvus.</span>
  </span>
</p>
<h3 id="Function" class="common-anchor-header">Function</h3><p>Data coord serves in the following aspects:</p>
<ul>
<li><p><strong>Allocate segment space</strong>
Data coord allocates space in growing segments to the proxy so that the proxy can use free space in segments to insert data.</p></li>
<li><p><strong>Record segment allocation and the expiry time of the allocated space in the segment</strong>
The space within each segment allocated by the data coord is not permanent, therefore, the data coord also needs to keep a record of the expiry time of each segment allocation.</p></li>
<li><p><strong>Automatically flush segment data</strong>
If the segment is full, the data coord automatically triggers data flush.</p></li>
<li><p><strong>Allocate channels to data nodes</strong>
A collection can have multiple <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">vchannels</a>. Data coord determines which vchannels are consumed by which data nodes.</p></li>
</ul>
<p>Data node serves in the following aspects:</p>
<ul>
<li><p><strong>Consume data</strong>
Data node consumes data from the channels allocated by data coord and creates a sequence for the data.</p></li>
<li><p><strong>Data persistence</strong>
Cache inserted data in memory and auto-flush those inserted data to disk when data volume reach a certain threshold.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">Workflow</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
    <span>One vchannel can only be assigned to one data node.</span>
  </span>
</p>
<p>As shown in the image above, the collection has four vchannels (V1, V2, V3, and V4)  and there are two data nodes. It is very likely that data coord will assign one data node to consume data from V1 and V2, and the other data node from V3 and V4. One single vchannel cannot be assigned to multiple data nodes and this is to prevent repetition of data consumption, which will otherwise cause the same batch of data being inserted into the same segment repetitively.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Root coord and Time Tick<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>Root coord manages TSO (timestamp Oracle), and publishes time tick messages globally. Each data insertion request has a timestamp assigned by root coord. Time Tick is the cornerstone of Milvus which acts like a clock in Milvus and signifies at which point of time is the Milvus system in.</p>
<p>When data are written in Milvus, each data insertion request carries a timestamp. During data consumption, each time data node consumes data whose timestamps are within a certain range.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
    <span>An example of data insertion and data consumption based on timestamp.</span>
  </span>
</p>
<p>The image above is the process of data insertion. The value of the timestamps are represented by numbers 1,2,6,5,7,8. The data are written into the system by two proxies: p1 and p2. During data consumption, if the current time of the Time Tick is 5, data nodes can only read data 1 and 2. Then during the second read, if the current time of the Time Tick becomes 9, data 6,7,8 can be read by data node.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">Data organization: collection, partition, shard (channel), segment<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
    <span>Data organization in Milvus.</span>
  </span>
</p>
<p>Read this <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">article</a> first to understand the data model in Milvus and the concepts of collection, shard, partition, and segment.</p>
<p>In summary, the largest data unit in Milvus is a collection which can be likened to a table in a relational database. A collection can have multiple shards (each corresponding to a channel) and multiple partitions within each shard. As shown in the illustration above, channels (shards) are the vertical bars while the partitions are the horizontal ones. At each intersection is the concept of segment, the smallest unit for data allocation. In Milvus, indexes are built on segments. During a query, the Milvus system also balances query loads in different query nodes and this process is conducted based on the unit of segments. Segments contain several <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlogs</a>, and when the segment data are consumed, a binlog file will be generated.</p>
<h3 id="Segment" class="common-anchor-header">Segment</h3><p>There are three types of segments with different status in Milvus: growing, sealed, and flushed segment.</p>
<h4 id="Growing-segment" class="common-anchor-header">Growing segment</h4><p>A growing segment is a newly created segment that can be allocated to the proxy for data insertion. The internal space of a segment can be used, allocated, or free.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
    <span>Three status in a growing segment</span>
  </span>
</p>
<ul>
<li>Used: this part of space of a growing segment has been consumed by data node.</li>
<li>Allocated: this part of space of a growing segment has been requested by the proxy and allocated by data coord. Allocated space will expire after a certain period time.</li>
<li>Free: this part of space of a growing segment has not been used. The value of free space equals the overall space of the segment subtracted by the value of used and allocated space. So the free space of a segment increases as the allocated space expires.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">Sealed segment</h4><p>A sealed segment is a closed segment that can no longer be allocated to the proxy for data insertion.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
    <span>Sealed segment in Milvus</span>
  </span>
</p>
<p>A growing segment is sealed in the following circumstances:</p>
<ul>
<li>If the used space in a growing segment reaches 75% of the total space, the segment will be sealed.</li>
<li>Flush() is manually called by a Milvus user to persist all data in a collection.</li>
<li>Growing segments that are not sealed after a long period of time will be sealed as too many growing segments cause data nodes to over-consume memory.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">Flushed segment</h4><p>A flushed segment is a segment that has already been written into disk. Flush refers to storing segment data to object storage for the sake of data persistence. A segment can only be flushed when the allocated space in a sealed segment expires. When flushed, the sealed segment turns into a flushed segment.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
    <span>Flushed segment in Milvus</span>
  </span>
</p>
<h3 id="Channel" class="common-anchor-header">Channel</h3><p>A channel is allocated :</p>
<ul>
<li>When data node starts or shuts down; or</li>
<li>When segment space allocated is requested by proxy.</li>
</ul>
<p>Then there are several strategies of channel allocation. Milvus supports 2 of the strategies:</p>
<ol>
<li>Consistent hashing</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
    <span>Consistency hashing in Milvus</span>
  </span>
</p>
<p>The default strategy in Milvus. This strategy leverages the hashing technique to assign each channel a position on the ring, then searches in a clock-wise direction to find the nearest data node to a channel. Thus, in the illustration above, channel 1 is allocated to data node 2, while channel 2 is allocated to data node 3.</p>
<p>However, one problem with this strategy is that the increase or decrease in the number of data nodes (eg. A new data node starts or a data node suddenly shuts down) can affect the process of channel allocation. To solve this issue, data coord monitors the status of data nodes via etcd so that data coord can be immediately notified if there is any change in the status of data nodes. Then data coord further determines to which data node to allocate the channels properly.</p>
<ol start="2">
<li>Load balancing</li>
</ol>
<p>The second strategy is to allocate channels of the same collection to different data nodes, ensuring the channels are evenly allocated. The purpose of this strategy is to achieve load balance.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">Data allocation: when and how<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
    <span>The process of data allocation in Milvus</span>
  </span>
</p>
<p>The process of data allocation starts from the client. It first sends data insertion requests with a timestamp <code translate="no">t1</code> to proxy. Then the proxy sends a request to data coord for segment allocation.</p>
<p>Upon receiving the segment allocation request, the data coord checks segment status and allocates segment. If the current space of the created segments is sufficient for the newly inserted rows of data, the data coord allocates those created segments. However, if the space available in current segments is not sufficient, the data coord will allocate a new segment. The data coord can return one or more segments upon each request. In the meantime, the data coord also saves the allocated segment in meta server for data persistence.</p>
<p>Subsequently, the data coord returns the information of the allocated segment (including segment ID, number of rows, expiry time <code translate="no">t2</code>, etc.) to the proxy. The proxy sends such information of the allocated segment to message store so that these information are properly recorded. Note that the value of <code translate="no">t1</code> must be smaller than that of <code translate="no">t2</code>. The default value of <code translate="no">t2</code> is 2,000 millisecond and it can be changed by configuring the parameter <code translate="no">segment.assignmentExpiration</code> in the <code translate="no">data_coord.yaml</code> file.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Binlog file structure and data persistence<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
    <span>Data node flush</span>
  </span>
</p>
<p>Data node subscribes to the message store because data insertion requests are kept in the message store and the data nodes can thus consume insert messages. The data nodes first place insert requests in an insert buffer, and as the requests accumulate, they will be flushed to object storage after reaching a threshold.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Binlog file structure</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
    <span>Binlog file structure.</span>
  </span>
</p>
<p>The binlog file structure in Milvus is similar to that in MySQL. Binlog is used to serve two functions: data recovery and index building.</p>
<p>A binlog contains many <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">events</a>. Each event has an event header and event data.</p>
<p>Metadata including binlog creation time, write node ID, event length, and NextPosition (offset of the next event), etc. are written in the event header.</p>
<p>Event data can be divided into two parts: fixed and variable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
    <span>File structure of an insert event.</span>
  </span>
</p>
<p>The fixed part in the event data of an <code translate="no">INSERT_EVENT</code> contains <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code>, and <code translate="no">reserved</code>.</p>
<p>The variable part in fact stores inserted data. The insert data are sequenced into the format of parquet and stored in this file.</p>
<h3 id="Data-persistence" class="common-anchor-header">Data persistence</h3><p>If there are multiple columns in schema, Milvus will store binlogs in columns.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
    <span>Binlog data persistence.</span>
  </span>
</p>
<p>As illustrated in the image above, the first column is primary key binlog. The second one is timestamp column. The rest are the columns defined in schema. The file path of binlogs in MinIO is also indicated in the image above.</p>
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
