---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: Understanding Consistency Level in the Milvus Vector Database - Part II
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  An anatomy of the mechanism behind tunable consistency levels in the Milvus
  vector database.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
    <span>Cover_image</span>
  </span>
</p>
<blockquote>
<p>This article is written by <a href="https://github.com/longjiquan">Jiquan Long</a> and transcreated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>In the <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">previous blog</a> about consistency, we have explained what is the connotation of consistency in a distributed vector database, covered the four levels of consistency - strong, bounded staleness, session, and eventual supported in the Milvus vector database, and explained the best-suited application scenario of each consistency level.</p>
<p>In this post, we will continue to examine the mechanism behind that enables users of the Milvus vector database to flexibly choose the ideal consistency level for various application scenarios. We will also provide the basic tutorial on how to tune consistency level in the Milvus vector database.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">The underlying time tick mechanism</a></li>
<li><a href="#Guarantee-timestamp">Guarantee timestamp</a></li>
<li><a href="#Consistency-levels">Consistency levels</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">How to tune consistency level in Milvus?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">The underlying time tick mechanism<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus uses the time tick mechanism to ensure different levels of consistency when a vector search or query is conducted. Time Tick is the watermark of Milvus which acts like a clock in Milvus and signifies at which point of time is the Milvus system in. Whenever there is a data manipulation language (DML) request sent to the Milvus vector database, it assigns a timestamp to the request. As shown in the figure below, when new data are inserted into the message queue for instance, Milvus not only marks a timestamp on these inserted data, but also inserts time ticks at a regular interval.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
    <span>timetick</span>
  </span>
</p>
<p>Let’s take <code translate="no">syncTs1</code> in the figure above as an example. When downstream consumers like query nodes see <code translate="no">syncTs1</code>, the consumer components understand that all data which are inserted earlier than <code translate="no">syncTs1</code> has been consumed. In other words, the data insertion requests whose timestamp values are smaller than <code translate="no">syncTs1</code> will no longer appear in the message queue.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">Guarantee Timestamp<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>As mentioned in the previous section, downstream consumer components like query nodes continuously obtains messages of data insertion requests and time tick from the message queue. Every time a time tick is consumed, the query node will mark this consumed time tick as the serviceable time - <code translate="no">ServiceTime</code> and all data inserted before <code translate="no">ServiceTime</code> are visible to the query node.</p>
<p>In addition to <code translate="no">ServiceTime</code>, Milvus also adopts a type of timestamp - guarantee timestamp (<code translate="no">GuaranteeTS</code>) to satisfy the need for various levels of consistency and availability by different users. This means that users of the Milvus vector datbase can specify <code translate="no">GuaranteeTs</code> in order to inform query nodes that all the data before <code translate="no">GuaranteeTs</code> should be visible and involved when a search or query is conducted.</p>
<p>There are usually two scenarios when the query node executes a search request in the Milvus vector database.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">Scenario 1: Execute search request immediately</h3><p>As shown in the figure below, if <code translate="no">GuaranteeTs</code> is smaller than <code translate="no">ServiceTime</code>, query nodes can execute the search request immediately.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
    <span>execute_immediately</span>
  </span>
</p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">Scenario 2: Wait till “ServiceTime &gt; GuaranteeTs”</h3><p>If <code translate="no">GuaranteeTs</code> is greater than <code translate="no">ServiceTime</code>, query nodes must continue to consume time tick from the message queue. Search requests cannot be executed until <code translate="no">ServiceTime</code> is greater than <code translate="no">GuaranteeTs</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
    <span>wait_search</span>
  </span>
</p>
<h2 id="Consistency-Levels" class="common-anchor-header">Consistency Levels<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Therefore, the <code translate="no">GuaranteeTs</code> is configurable in the search request to achieve the level of consistency specified by you. A <code translate="no">GuaranteeTs</code> with a large value ensures <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">strong consistency</a> at the cost of a high search latency. And a <code translate="no">GuaranteeTs</code> with a small value reduces search latency but the data visibility is compromised.</p>
<p><code translate="no">GuaranteeTs</code> in Milvus is a hybrid timestamp format. And the user has no idea of the <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a> inside Milvus. Therefore, Specifying the value of<code translate="no">GuaranteeTs</code> is a much too complicated task for users. To save the trouble for users and provide an optimal user experience, Milvus only requires the users to choose the specific consistency level, and the Milvus vector database will automatically handle the <code translate="no">GuaranteeTs</code> value for users. That is to say, the Milvus user only needs to choose from the four consistency levels: <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, and <code translate="no">Eventually</code>. And each of the consistency level corresponds to a certain <code translate="no">GuaranteeTs</code> value.</p>
<p>The figure below illustrates the <code translate="no">GuaranteeTs</code> for each of the four levels of consistency in the Milvus vector database.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
    <span>guarantee_ts</span>
  </span>
</p>
<p>The Milvus vector database supports four levels of consistency:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code>: <code translate="no">GuaranteeTs</code> is set to the same value as the latest system timestamp, and query nodes wait until the service time proceeds to the latest system timestamp to process the search or query request.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code>: <code translate="no">GuaranteeTs</code> is set to a value insignificantly smaller than the latest system timestamp in order to skip the consistency check. Query nodes search immediately on the existing data view.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code>: <code translate="no">GuaranteeTs</code> is set to a value relatively smaller than the latest system timestamp, and query nodes search on a tolerably less updated data view.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: The client uses the timestamp of the last write operation as the <code translate="no">GuaranteeTs</code> so that each client can at least retrieve the data inserted by itself.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">How to tune consistency level in Milvus?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supports tuning the consistency level when <a href="https://milvus.io/docs/v2.1.x/create_collection.md">creating a collection</a> or conducting a <a href="https://milvus.io/docs/v2.1.x/search.md">search</a> or <a href="https://milvus.io/docs/v2.1.x/query.md">query</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">Conduct a vector similarity search</h3><p>To conduct a vector similarity search with the level of consistency you want, simply set the value for the parameter <code translate="no">consistency_level</code> as either <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, or <code translate="no">Eventually</code>. If you do not set the value for the parameter <code translate="no">consistency_level</code>, the consistency level will be <code translate="no">Bounded</code> by default. The example conducts a vector similarity search with <code translate="no">Strong</code> consistency.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">Conduct a vector query</h3><p>Similar to conducting a vector similarity search, you can specify the value for the parameter <code translate="no">consistency_level</code> when conducting a vector query. The example conducts a vector query with <code translate="no">Strong</code> consistency.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
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
