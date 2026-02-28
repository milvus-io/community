---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: How Milvus Balances Query Load across Nodes?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: Milvus 2.0 supports automatic load balance across query nodes.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
    <span>Binlog Cover Image</span>
  </span>
</p>
<p>By <a href="https://github.com/xige-16">Xi Ge</a>.</p>
<p>In previous blog articles, we have successively introduced the Deletion, Bitset, and Compaction functions in Milvus 2.0. To culminate this series, we would like to share the design behind Load Balance, a vital function in the distributed cluster of Milvus.</p>
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
    </button></h2><p>Whereas the number and size of segments buffered in query nodes differ, the search performance across the query nodes may also vary. The worst case could happen when a few query nodes are exhausted searching on a large amount of data, but newly created query nodes remain idle because no segment is distributed to them, causing a massive waste of CPU resources and a huge drop in search performance.</p>
<p>To avoid such circumstances, the query coordinator (query coord) is programmed to distribute segments evenly to each query node according to the RAM usage of the nodes. Therefore, CPU resources are consumed equally across the nodes, thereby significantly improving search performance.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">Trigger automatic load balance</h3><p>According to the default value of the configuration <code translate="no">queryCoord.balanceIntervalSeconds</code>, the query coord checks the RAM usage (in percentage) of all query nodes every 60 seconds. If either of the following conditions is satisfied, the query coord starts to balance the query load across the query node:</p>
<ol>
<li>RAM usage of any query node in the cluster is larger than <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (default: 90);</li>
<li>Or the absolute value of any two query nodes’ RAM usage difference is larger than <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (default: 30).</li>
</ol>
<p>After the segments are transferred from the source query node to the destination query node, they should also satisfy both the following conditions:</p>
<ol>
<li>RAM usage of the destination query node is no larger than <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (default: 90);</li>
<li>The absolute value of the source and destination query nodes’ RAM usage difference after load balancing is less than that before load balancing.</li>
</ol>
<p>With the above conditions satisfied, the query coord proceeds to balance the query load across the nodes.</p>
<h2 id="Load-balance" class="common-anchor-header">Load balance<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>When load balance is triggered, the query coord first loads the target segment(s) to the destination query node. Both query nodes return search results from the target segment(s) at any search request at this point to guarantee the completeness of the result.</p>
<p>After the destination query node successfully loads the target segment, the query coord publishes a <code translate="no">sealedSegmentChangeInfo</code> to the Query Channel. As shown below, <code translate="no">onlineNodeID</code> and <code translate="no">onlineSegmentIDs</code> indicate the query node that loads the segment and the segment loaded respectively, and <code translate="no">offlineNodeID</code> and <code translate="no">offlineSegmentIDs</code> indicate the query node that needs to release the segment and the segment to release respectively.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
    <span>sealedSegmentChangeInfo</span>
  </span>
</p>
<p>Having received the <code translate="no">sealedSegmentChangeInfo</code>, the source query node then releases the target segment.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
    <span>Load Balance Workflow</span>
  </span>
</p>
<p>The whole process succeeds when the source query node releases the target segment. By completing that, the query load is set balanced across the query nodes, meaning the RAM usage of all query nodes is no larger than <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code>, and the absolute value of the source and destination query nodes’ RAM usage difference after load balancing is less than that before load balancing.</p>
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
<p>This is the finale of the Milvus 2.0 new feature blog series. Following this series, we are planning a new series of Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>, which introduces the basic architecture of Milvus 2.0. Please stay tuned.</p>
