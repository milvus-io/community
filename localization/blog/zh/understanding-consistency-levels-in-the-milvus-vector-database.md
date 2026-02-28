---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Understanding Consistency Level in the Milvus Vector Database
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  Learn about the four levels of consistency - strong, bounded staleness,
  session, and eventual supported in the Milvus vector database.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
    <span>Cover_image</span>
  </span>
</p>
<blockquote>
<p>This article is written by <a href="https://github.com/JackLCL">Chenglong Li</a> and transcreated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Have you ever wondered why sometimes the data you have deleted from the Mlivus vector database still appear in the search results?</p>
<p>A very likely reason is that you have not set the appropriate consistency level for your application. Consistency level in a distributed vector database is critical as it determines at which point a particular data write can be read by the system.</p>
<p>Therefore, this article aims to demystify the concept of consistency and delve into the levels of consistency supported by the Milvus vector database.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#What-is-consistency">What is consistency</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Four levels of consistency in the Milvus vector database</a>
<ul>
<li><a href="#Strong">Strong</a></li>
<li><a href="#Bounded-staleness">Bounded staleness</a></li>
<li><a href="#Session">Session</a></li>
<li><a href="#Eventual">Eventual</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">What is consistency<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>Before getting started, we need to first clarify the connotation of consistency in this article as the word “consistency” is an overloaded term in the computing industry. Consistency in a distributed database specifically refers to the property that ensures every node or replica has the same view of data when writing or reading data at a given time. Therefore, here we are talking about consistency as in the <a href="https://en.wikipedia.org/wiki/CAP_theorem">CAP theorem</a>.</p>
<p>For serving massive online businesses in the modern world, multiple replicas are commonly adopted. For instance, online e-commerce giant Amazon replicates its orders or SKU data across multiple data centers, zones, or even countries to ensure high system availability in the event of a system crash or failure. This poses a challenge to the system - data consistency across multiple replicas. Without consistency, it is very likely that the deleted item in your Amazon cart reappears, causing very bad user experience.</p>
<p>Hence, we need different data consistency levels for different applications. And luckily, Milvus, a database for AI, offers flexibility in consistency level and you can set the consistency level that best suits your application.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Consistency in the Milvus vector database</h3><p>The concept of consistency level was first introduced with the release of Milvus 2.0. The 1.0 version of Milvus was not a distributed vector database so we did not involve tunable levels of consistency then. Milvus 1.0 flushes data every second, meaning that new data are almost immediately visible upon their insertion and Milvus reads the most updated data view at the exact time point when a vector similarity search or query request comes.</p>
<p>However, Milvus was refactored in its 2.0 version and <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0 is a distributed vector database</a> based on a pub-sub mechanism. The <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a> theorem points out that a distributed system must trade off among consistency, availability, and latency. Furthermore, different levels of consistency serve for different scenarios. Therefore, the concept of consistency was introduced in <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a> and it supports tuning levels of consistency.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Four levels of consistency in the Milvus vector database<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supports four levels of consistency:  strong, bounded staleness, session, and eventual. And a Milvus user can specify the consistency level when <a href="https://milvus.io/docs/v2.1.x/create_collection.md">creating a collection</a> or conducting a <a href="https://milvus.io/docs/v2.1.x/search.md">vector similarity search</a> or <a href="https://milvus.io/docs/v2.1.x/query.md">query</a>. This section will continue to explain how these four levels of consistency are different and which scenario are they best suited for.</p>
<h3 id="Strong" class="common-anchor-header">Strong</h3><p>Strong is the highest and the most strict level of consistency. It ensures that users can read the latest version of data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
    <span>Strong</span>
  </span>
</p>
<p>According to the PACELC theorem, if the consistency level is set to strong, the latency will increase. Therefore, we recommend choosing strong consistency during functional testings to ensure the accuracy of the test results. And strong consistency is also best suited for applications that have strict demand for data consistency at the cost of search speed. An example can be an online financial system dealing with order payments and billing.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">Bounded staleness</h3><p>Bounded staleness, as its name suggests, allows data inconsistency during a certain period of time. However, generally, the data are always globally consistent out of that period of time.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
    <span>Bounded_staleness</span>
  </span>
</p>
<p>Bounded staleness is suitable for scenarios that needs to control search latency and can accept sporadic data invisibility. For instance, in recommender systems like video recommendation engines, data invisibility once in a while has really small impact on the overall recall rate, but can significantly boost the performance of the recommender system. An example can be an app for tracking the status of your online orders.</p>
<h3 id="Session" class="common-anchor-header">Session</h3><p>Session ensures that all data writes can be immediately perceived in reads during the same session. In other words, when you write data via one client, the newly inserted data instantaneously become searchable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
    <span>Session</span>
  </span>
</p>
<p>We recommend choosing session as the consistency level for those scenarios where the demand of data consistency in the same session is high. An example can be deleting the data of a book entry from the library system, and after confirmation of the deletion and refreshing the page (a different session), the book should no longer be visible in search results.</p>
<h3 id="Eventual" class="common-anchor-header">Eventual</h3><p>There is no guaranteed order of reads and writes, and replicas eventually converge to the same state given that no further write operations are done. Under eventual consistency, replicas start working on read requests with the latest updated values. Eventual consistency is the weakest level among the four.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
    <span>Eventual</span>
  </span>
</p>
<p>However, according to the PACELC theorem, search latency can be tremendously shortened upon sacrificing consistency. Therefore, eventual consistency is best suited for scenarios that do not have high demand for data consistency but requires blazing-fast search performance. An example can be retrieving reviews and ratings of Amazon products with eventual consistency.</p>
<h2 id="Endnote" class="common-anchor-header">Endnote<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>So going back to the question raised at the beginning of this article, deleted data are still returned as search results because the user has not chosen the proper level of consistency. The default value for consistency level is bounded staleness (<code translate="no">Bounded</code>) in the Milvus vector database. Therefore, the data read might lag behind and Milvus might happen to read the data view before you conducted delete operations during a similarity search or query. However, this issue is simple to solve. All you need to do is <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">tune the consistency level</a> when creating a collection or conducting vector similarity search or query. Simple!</p>
<p>In the next post, we will unveil the mechanism behind and explain how the Milvus vector database achieves different levels of consistency. Stay tuned!</p>
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
