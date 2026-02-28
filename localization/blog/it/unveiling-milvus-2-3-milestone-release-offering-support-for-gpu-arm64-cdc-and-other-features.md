---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  Unveiling Milvus 2.3: A Milestone Release Offering Support for GPU, Arm64,
  CDC, and Many Other Highly Anticipated Features
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 is a milestone release with numerous highly anticipated features,
  including support for GPU, Arm64, upsert, change data capture, ScaNN index,
  and range search. It also introduces improved query performance, more robust
  load balancing and scheduling, and better observability and operability.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Exciting news! After eight months of concerted effort, we’re thrilled to announce the release of Milvus 2.3, a milestone version that brings numerous highly anticipated features, including support for GPU, Arm64, upsert, change data capture, ScaNN index, and MMap technology. Milvus 2.3 also introduces improved query performance, more robust load balancing and scheduling, and better observability and operability.</p>
<p>Join me to look at these new features and enhancements and learn how you can benefit from this release.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">Support for GPU index that leads to 3-10 times faster in QPS<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>GPU index is a highly anticipated feature in the Milvus community. Thanks to a great collaboration with the Nvidia engineers, Milvus 2.3 has supported GPU indexing with the robust RAFT algorithm added to Knowhere, the Milvus index engine. With GPU support, Milvus 2.3 is more than three times faster in QPS than older versions using the CPU HNSW index and almost ten times faster for specific datasets that require heavy computation.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">Arm64 support to accommodate growing user demand<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>Arm CPUs are becoming increasingly popular among cloud providers and developers. To meet this growing demand, Milvus now provides Docker images for the ARM64 architecture. With this new CPU support, MacOS users can build their applications with Milvus more seamlessly.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Upsert support for better user experience<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 introduces a notable enhancement by supporting the upsert operation. This new functionality allows users to update or insert data seamlessly and empowers them to perform both operations in a single request through the Upsert interface. This feature streamlines data management and brings efficiency to the table.</p>
<p><strong>Note</strong>:</p>
<ul>
<li>The upsert feature does not apply to auto-increment IDs.</li>
<li>Upsert is implemented as a combination of <code translate="no">delete</code> and <code translate="no">insert</code>, which may result in some performance loss. We recommend using <code translate="no">insert</code> if you use Milvus in write-heavy scenarios.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">Range search for more accurate results<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 allows users to specify the distance between the input vector and the vectors stored in Milvus during a query. Milvus then returns all matching results within the set range. Below is an example of specifying the search distance using the range search feature.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>In this example, the user requires Milvus to return vectors within a distance of 10 to 20 units from the input vector.</p>
<p><strong>Note</strong>: Different distance metrics vary in how they calculate distances, resulting in distinct value ranges and sorting strategies. Therefore, it is essential to understand their characteristics before using the range search feature.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">ScaNN index for faster query speed<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 now supports the ScaNN index, an open-source <a href="https://zilliz.com/glossary/anns">approximate nearest neighbor (ANN)</a> index developed by Google. ScaNN index has demonstrated superior performance in various benchmarks, outperforming HNSW by around 20% and being approximately seven times faster than IVFFlat. With the support for the ScaNN index, Milvus achieves much faster query speed compared to older versions.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">Growing index for stable and better query performance<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus includes two categories of data: indexed data and streaming data. Milvus can use indexes to search indexed data quickly but can only brutely search streaming data row by row, which can impact performance. Milvus 2.3 introduces the Growing Index, which automatically creates real-time indexes for streaming data to improve query performance.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">Iterator for data retrieval in batches<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus 2.3, Pymilvus has introduced an iterator interface that allows users to retrieve more than 16,384 entities in a search or range search. This feature is handy when users need to export tens of thousands or even more vectors in batches.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">Support for MMap for increased capacity<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap is a UNIX system call used to map files and other objects into memory. Milvus 2.3 supports MMap, which enables users to load data onto local disks and map it to memory, thereby increasing single-machine capacity.</p>
<p>Our testing results indicate that using MMap technology, Milvus can double its data capacity while limiting performance degradation to within 20%. This approach significantly reduces overall costs, making it particularly beneficial for users on a tight budget who do not mind compromising performance.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">CDC support for higher system availability<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>Change Data Capture (CDC) is a commonly used feature in database systems that captures and replicates data changes to a designated destination. With the CDC feature, Milvus 2.3 enables users to synchronize data across data centers, back up incremental data, and seamlessly migrate data, making the system more available.</p>
<p>In addition to the features above, Milvus 2.3 introduces a count interface to accurately calculate the number of rows of data stored in a collection in real-time, supports the Cosine metric to measure vector distance, and more operations on JSON arrays. For more features and detailed information, refer to <a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 release notes</a>.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Enhancements and bug fixes<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>In addition to new features, Milvus 2.3 includes many improvements and bug fixes for older versions.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">Improved performance for data filtering</h3><p>Milvus performs scalar filtering before vector searching in hybrid scalar and vector data queries to achieve more accurate results. However, the indexing performance may decline if the user has filtered out too much data after scalar filtering. In Milvus 2.3, we optimized the filtering strategy of HNSW to address this issue, resulting in improved query performance.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">Increased multi-core CPU usage</h3><p>Approximate nearest search (ANN) is a computationally intensive task that requires massive CPU resources. In previous releases, Milvus could only utilize around 70% of the available multi-core CPU resources. However, with the latest release, Milvus has overcome this limitation and can fully utilize all available multi-core CPU resources, resulting in improved query performance and reduced resource waste.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">Refactored QueryNode</h3><p>QueryNode is a crucial component in Milvus that is responsible for vector searching. However, in older versions, QueryNode had complex states, duplicate message queues, an unorganized code structure, and non-intuitive error messages.</p>
<p>In Milvus 2.3, we’ve upgraded QueryNode by introducing a stateless code structure and removing the message queue for deleting data. These updates result in less resource waste and faster and more stable vector searching.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">Enhanced message queues based on NATS</h3><p>We built Milvus on a log-based architecture, and in previous versions, we used Pulsar and Kafka as the core log brokers. However, this combination faced three key challenges:</p>
<ul>
<li>It was unstable in multi-topic situations.</li>
<li>It consumed resources when idle and struggled to deduplicate messages.</li>
<li>Pulsar and Kafka are closely tied to the Java ecosystem, so their community rarely maintains and updates their Go SDKs.</li>
</ul>
<p>To address these problems, we have combined NATS and Bookeeper as our new log broker for Milvus, which fits users’ needs better.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">Optimized load balancer</h3><p>Milvus 2.3 has adopted a more flexible load-balancing algorithm based on the system’s real loads. This optimized algorithm lets users quickly detect node failures and unbalanced loads and adjust schedulings accordingly. According to our testing results, Milvus 2.3 can detect faults, unbalanced load, abnormal node status, and other events within seconds and make adjustments promptly.</p>
<p>For more information about Milvus 2.3, refer to <a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 release notes</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">Tool upgrades<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>We have also upgraded Birdwatcher and Attu, two valuable tools for operating and maintaining Milvus, along with Milvus 2.3.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Birdwatcher update</h3><p>We’ve upgraded <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a>, the debug tool of Milvus, introducing numerous features and enhancements, including:</p>
<ul>
<li>RESTful API for seamless integration with other diagnostic systems.</li>
<li>PProf command support to facilitate integration with the Go pprof tool.</li>
<li>Storage usage analysis capabilities.</li>
<li>Efficient log analysis functionality.</li>
<li>Support for viewing and modifying configurations in etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Attu update</h3><p>We’ve launched a brand-new interface for <a href="https://zilliz.com/attu">Attu</a>, an all-in-one vector database administration tool. The new interface has a more straightforward design and is easier to understand.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>For more details, refer to <a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 release notes</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Let’s keep in touch!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>If you have questions or feedback about Milvus, please don’t hesitate to contact us through <a href="https://twitter.com/milvusio">Twitter</a> or <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. You’re also welcome to join our <a href="https://milvus.io/slack/">Slack channel</a> to chat with our engineers and the community directly or check out our <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Tuesday office hours</a>!</p>
