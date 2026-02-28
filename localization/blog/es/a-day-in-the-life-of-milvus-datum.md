---
id: a-day-in-the-life-of-milvus-datum.md
title: A Day in the Life of a Milvus Datum
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: 'So, let’s take a stroll in a day in the life of Dave, the Milvus datum.'
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>Building a performant <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> like Milvus that scales to billions of vectors and handles web-scale traffic is no simple feat. It requires the careful, intelligent design of a distributed system. Necessarily, there will be a trade-off between performance vs simplicity in the internals of a system like this.</p>
<p>While we have tried to well balance this trade-off, some aspects of the internals have remained opaque. This article aims to dispel any mystery around how Milvus breaks down data insertion, indexing, and serving across nodes. Understanding these processes at a high level is essential for effectively optimizing query performance, system stability, and debugging-related issues.</p>
<p>So, let’s take a stroll in a day in the life of Dave, the Milvus datum. Imagine you insert Dave into your collection in a <a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">Milvus Distributed deployment</a> (see the diagram below). As far as you are concerned, he goes directly into the collection. Behind the scenes, however, many steps occur across independent sub-systems.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">Proxy Nodes and the Message Queue<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Initially, you call the MilvusClient object, for example, via the PyMilvus library, and send an <code translate="no">_insert()</code>_ request to a <em>proxy node</em>. Proxy nodes are the gateway between the user and the database system, performing operations like load balancing on incoming traffic and collating multiple outputs before they are returned to the user.</p>
<p>A hash function is applied to the item’s primary key to determine which <em>channel</em> to send it to. Channels, implemented with either Pulsar or Kafka topics, represent a holding ground for streaming data, which can then be sent onwards to subscribers of the channel.</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">Data Nodes, Segments, and Chunks<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>After the data has been sent to the appropriate channel, the channel then sends it to the corresponding segment in the <em>data node</em>. Data nodes are responsible for storing and managing data buffers called <em>growing segments</em>. There is one growing segment per shard.</p>
<p>As data is inserted into a segment, the segment grows towards a maximum size, defaulting to 122MB. During this time, smaller parts of the segment, by default 16MB and known as <em>chunks</em>, are pushed to persistent storage, for example, using AWS’s S3 or other compatible storage like MinIO. Each chunk is a physical file on the object storage and there is a separate file per field. See the figure above illustrating the file hierarchy on object storage.</p>
<p>So to summarize, a collection’s data is split across data nodes, within which it is split into segments for buffering, which are further split into per-field chunks for persistent storage. The two diagrams above make this clearer. By dividing the incoming data in this way, we fully exploit the cluster’s parallelism of network bandwidth, compute, and storage.</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">Sealing, Merging, and Compacting Segments<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Thus far we have told the story of how our friendly datum Dave makes his way from an <code translate="no">_insert()</code>_ query into persistent storage. Of course, his story does not end there. There are further steps to make the search and indexing process more efficient. By managing the size and number of segments, the system fully exploits the cluster’s parallelism.</p>
<p>Once a segment reaches its maximum size on a data node, by default 122MB, it is said to be <em>sealed</em>. What this means is that the buffer on the data node is cleared to make way for a new segment, and the corresponding chunks in persistent storage are marked as belonging to a closed segment.</p>
<p>The data nodes periodically look for smaller sealed segments and merge them into larger ones until they have reached a maximum size of 1GB (by default) per segment. Recall that when an item is deleted in Milvus, it is simply marked with a deletion flag - think of it as Death Row for Dave. When the number of deleted items in a segment passes a given threshold, by default 20%, the segment is reduced in size, an operation we call <em>compaction</em>.</p>
<p>Indexing and Searching through Segments</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>There is an additional node type, the <em>index node</em>, that is responsible for building indexes for sealed segments. When the segment is sealed, the data node sends a request for an index node to construct an index. The index node then sends the completed index to object storage. Each sealed segment has its own index stored in a separate file. You can examine this file manually by accessing the bucket - see the figure above for the file hierarchy.</p>
<p>Query nodes - not only data nodes - subscribe to the message queue topics for the corresponding shards. The growing segments are replicated on the query nodes, and the node loads into memory sealed segments belonging to the collection as required. It builds an index for each growing segment as data comes in, and loads the finalized indexes for sealed segments from the data store.</p>
<p>Imagine now that you call the MilvusClient object with a <em>search()</em> request that encompasses Dave. After being routed to all query nodes via the proxy node, each query node performs a vector similarity search (or another one of the search methods like query, range search, or grouping search), iterating over the segments one by one. The results are collated across nodes in a MapReduce-like fashion and sent back to the user, Dave being happy to find himself reunited with you at last.</p>
<h2 id="Discussion" class="common-anchor-header">Discussion<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>We have covered a day in the life of Dave the datum, both for <code translate="no">_insert()</code>_ and <code translate="no">_search()</code>_ operations. Other operations like <code translate="no">_delete()</code>_ and <code translate="no">_upsert()</code>_ work similarly. Inevitably, we have had to simplify our discussion and omit finer details. On the whole, though, you should now have a sufficient picture of how Milvus is designed for parallelism across nodes in a distributed system to be robust and efficient, and how you can use this for optimization and debugging.</p>
<p><em>An important takeaway from this article: Milvus is designed with a separation of concerns across node types. Each node type has a specific, mutually exclusive function, and there is a separation of storage and compute.</em> The result is that each component can be scaled independently with parameters tweakable according to the use case and traffic patterns. For example, you can scale the number of query nodes to serve increased traffic without scaling data and index nodes. With that flexibility, there are Milvus users that handle billions of vectors and serve web-scale traffic, with sub-100ms query latency.</p>
<p>You can also enjoy the benefits of Milvus’ distributed design without even deploying a distributed cluster through <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, a fully managed service of Milvus. <a href="https://cloud.zilliz.com/signup">Sign up today for the free-tier of Zilliz Cloud and put Dave into action!</a></p>
