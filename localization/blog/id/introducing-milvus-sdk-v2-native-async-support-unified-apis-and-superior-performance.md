---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >
  Introducing Milvus SDK v2: Native Async Support, Unified APIs, and Superior
  Performance
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  Experience Milvus SDK v2, reimagined for developers! Enjoy a unified API,
  native async support, and enhanced performance for your vector search
  projects.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">TL;DR<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>You spoke, and we listened! Milvus SDK v2 is a complete reimagining of our developer experience, built directly from your feedback. With a unified API across Python, Java, Go, and Node.js, native async support that you’ve been asking for, a performance-boosting Schema Cache, and a simplified MilvusClient interface, Milvus SDK v2 makes <a href="https://zilliz.com/learn/vector-similarity-search">vector search</a> development faster and more intuitive than ever. Whether you’re building <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> applications, recommendation systems, or <a href="https://zilliz.com/learn/what-is-computer-vision">computer vision</a> solutions, this community-driven update will transform how you work with Milvus.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">Why We Built It: Addressing Community Pain Points<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>Over the years, Milvus has become the <a href="https://milvus.io/blog/what-is-a-vector-database.md">vector database</a> of choice for thousands of AI applications. However, as our community grew, we consistently heard about several limitations with our SDK v1:</p>
<p><strong>“Handling high concurrency is too complex.”</strong> The lack of native async support in some language SDKs forced developers to rely on threads or callbacks, making code harder to manage and debug, especially in scenarios like batch data loading and parallel queries.</p>
<p><strong>“Performance degrades with scale.”</strong> Without a Schema Cache, v1 repeatedly validated schemas during operations, creating bottlenecks for high-volume workloads. In use cases requiring massive vector processing, this problem resulted in increased latency and reduced throughput.</p>
<p><strong>“Inconsistent interfaces between languages create a steep learning curve.”</strong> Different language SDKs implemented interfaces in their own ways, complicating cross-language development.</p>
<p><strong>“The RESTful API is missing essential features.”</strong> Critical functionalities like partition management and index construction were unavailable, forcing developers to switch between different SDKs.</p>
<p>These weren’t just feature requests — they were real obstacles in your development workflow. SDK v2 is our promise to remove these barriers and let you focus on what matters: building amazing AI applications.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">The Solution: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 is the result of a complete redesign focused on developer experience, available across multiple languages:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. Native Asynchronous Support: From Complex to Concurrent</h3><p>The old way of handling concurrency involved cumbersome Future objects and callback patterns. SDK v2 introduces true async/await functionality, particularly in Python with <code translate="no">AsyncMilvusClient</code> (since v2.5.3). With the same parameters as the synchronous MilvusClient, you can easily run operations like insert, query, and search in parallel.</p>
<p>This simplified approach replaces the old cumbersome Future and callback patterns, leading to cleaner and more efficient code. Complex concurrent logic, like batch vector inserts or parallel multi-queries, can now be effortlessly implemented using tools like <code translate="no">asyncio.gather</code>.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. Schema Cache: Boosting Performance Where It Counts</h3><p>SDK v2 introduces a Schema Cache that stores collection schemas locally after the initial fetch, eliminating repeated network requests and CPU overhead during operations.</p>
<p>For high-frequency insert and query scenarios, this update translates to:</p>
<ul>
<li><p>Reduced network traffic between client and server</p></li>
<li><p>Lower latency for operations</p></li>
<li><p>Decreased server-side CPU usage</p></li>
<li><p>Better scaling under high concurrency</p></li>
</ul>
<p>This is particularly valuable for applications like real-time recommendation systems or live search features where milliseconds matter.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. A Unified and Streamlined API Experience</h3><p>Milvus SDK v2 introduces a unified and more complete API experience across all supported programming languages. Particularly, the RESTful API has been significantly enhanced to offer near feature parity with the gRPC interface.</p>
<p>In earlier versions, the RESTful API lagged behind gRPC, limiting what developers could do without switching interfaces. That’s no longer the case. Now, developers can use the RESTful API to perform virtually all core operations—such as creating collections, managing partitions, building indexes, and running queries—without needing to fall back on gRPC or other methods.</p>
<p>This unified approach ensures a consistent developer experience across different environments and use cases. It reduces the learning curve, simplifies integration, and improves overall usability.</p>
<p>Note: For most users, the RESTful API offers a faster and easier way to get started with Milvus. However, if your application demands high-performance or advanced features like iterators, the gRPC client remains the go-to option for maximum flexibility and control.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. Aligned SDK Design Across All Languages</h3><p>With Milvus SDK v2, we’ve standardized the design of our SDKs across all supported programming languages to deliver a more consistent developer experience.</p>
<p>Whether you’re building with Python, Java, Go, or Node.js, each SDK now follows a unified structure centered around the MilvusClient class. This redesign brings consistent method naming, parameter formatting, and overall usage patterns to every language we support. (See: <a href="https://github.com/milvus-io/milvus/discussions/33979">MilvusClient SDK code example update · GitHub Discussion #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Now, once you’re familiar with Milvus in one language, you can easily switch to another without having to relearn how the SDK works. This alignment not only simplifies onboarding but also makes multi-language development much smoother and more intuitive.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. A Simpler, Smarter PyMilvus (Python SDK) with <code translate="no">MilvusClient</code></h3><p>In the previous version, PyMilvus relied on an ORM-style design that introduced a mix of object-oriented and procedural approaches. Developers had to define <code translate="no">FieldSchema</code> objects, build a <code translate="no">CollectionSchema</code>, and then instantiate a <code translate="no">Collection</code> class—all just to create a collection. This process was not only verbose but also introduced a steeper learning curve for new users.</p>
<p>With the new <code translate="no">MilvusClient</code> interface, things are much simpler. You can now create a collection in a single step using the <code translate="no">create_collection()</code> method. It allows you to quickly define the schema by passing parameters like <code translate="no">dimension</code> and <code translate="no">metric_type</code>, or you can still use a custom schema object if needed.</p>
<p>Even better, <code translate="no">create_collection()</code> supports index creation as part of the same call. If index parameters are provided, Milvus will automatically build the index and load the data into memory—no need for separate <code translate="no">create_index()</code> or <code translate="no">load()</code> calls. One method does it all: <em>create collection → build index → load collection.</em></p>
<p>This streamlined approach reduces setup complexity and makes it much easier to get started with Milvus, especially for developers who want a quick and efficient path to prototyping or production.</p>
<p>The new <code translate="no">MilvusClient</code> module offers clear advantages in usability, consistency, and performance. While the legacy ORM interface remains available for now, we plan to phase it out in the future (see <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">reference</a>). We strongly recommend upgrading to the new SDK to take full advantage of the improvements.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. Clearer and More Comprehensive Documentation</h3><p>We have restructured the product documentation to provide a more complete and clearer <a href="https://milvus.io/docs">API Reference</a>. Our User Guides now include multi-language sample code, enabling you to get started quickly and understand Milvus’ features with ease. Additionally, the Ask AI assistant available on our documentation site can introduce new features, explain internal mechanisms, and even help generate or modify sample code, making your journey through the documentation smoother and more enjoyable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Milvus MCP Server: Designed for the Future of AI Integration</h3><p>The <a href="https://github.com/zilliztech/mcp-server-milvus">MCP Server</a>, built on top of the Milvus SDK, is our answer to a growing need in the AI ecosystem: seamless integration between large language models (<a href="https://zilliz.com/glossary/large-language-models-(llms)">LLMs</a>), <a href="https://milvus.io/blog/what-is-a-vector-database.md">vector databases</a>, and external tools or data sources. It implements the Model Context Protocol (MCP), providing a unified and intelligent interface for orchestrating Milvus operations and beyond.</p>
<p>As <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">AI agents</a> become more capable—not just generating code but autonomously managing backend services—the demand for smarter, API-driven infrastructure is rising. The MCP Server was designed with this future in mind. It enables intelligent and automated interactions with Milvus clusters, streamlining tasks like deployment, maintenance, and data management.</p>
<p>More importantly, it lays the groundwork for a new kind of machine-to-machine collaboration. With the MCP Server, AI agents can call APIs to dynamically create collections, run queries, build indexes, and more—all without human intervention.</p>
<p>In short, the MCP Server transforms Milvus into not just a database, but a fully programmable, AI-ready backend—paving the way for intelligent, autonomous, and scalable applications.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Getting Started with Milvus SDK v2: Sample Code<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>The examples below show how to use the new PyMilvus (Python SDK v2) interface to create a collection and perform asynchronous operations. Compared to the ORM-style approach in the previous version, this code is cleaner, more consistent, and easier to work with.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. Creating a Collection, Defining Schemas, Building Indexes, and Loading Data with <code translate="no">MilvusClient</code></h3><p>The Python code snippet below demonstrates how to create a collection, define its schema, build indexes, and load data—all in one call:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>The <code translate="no">create_collection</code> method’s <code translate="no">index_params</code> parameter eliminates the need for separate calls for <code translate="no">create_index</code> and <code translate="no">load_collection</code>—everything happens automatically.</p>
<p>In addition, <code translate="no">MilvusClient</code> supports a quick table creation mode. For example, a collection can be created in a single line of code by specifying only the required parameters:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(Comparison note: In the old ORM approach, you had to create a <code translate="no">Collection(schema)</code>, then separately call <code translate="no">collection.create_index()</code> and <code translate="no">collection.load()</code>; now, MilvusClient streamlines the entire process.)</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. Performing High-Concurrency Asynchronous Inserts with <code translate="no">AsyncMilvusClient</code></h3><p>The following example shows how to use the <code translate="no">AsyncMilvusClient</code> to perform concurrent insert operations using <code translate="no">async/await</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>In this example, <code translate="no">AsyncMilvusClient</code> is used to concurrently insert data by scheduling multiple insertion tasks with <code translate="no">asyncio.gather</code>. This approach takes full advantage of Milvus’ backend concurrent processing capabilities. Unlike the synchronous, line-by-line insertions in v1, this native asynchronous support dramatically increases throughput.</p>
<p>Similarly, you can modify the code to perform concurrent queries or searches—for example, by replacing the insert call with <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code>. Milvus SDK v2’s asynchronous interface ensures that each request is executed in a non-blocking manner, fully leveraging both client and server resources.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">Migration Made Easy<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>We know you’ve invested time in SDK v1, so we’ve designed SDK v2 with your existing applications in mind. SDK v2 includes backward compatibility, so existing v1/ORM-style interfaces will continue to work for a while. But we strongly recommend upgrading to SDK v2 as soon as possible—support for v1 will end with the release of Milvus 3.0 (end of 2025).</p>
<p>Moving to SDK v2 unlocks a more consistent, modern developer experience with simplified syntax, better async support, and improved performance. It’s also where all new features and community support are focused going forward. Upgrading now ensures you’re ready for what’s next and gives you access to the best Milvus has to offer.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 brings significant improvements over v1: enhanced performance, a unified and consistent interface across multiple programming languages, and native asynchronous support that simplifies high-concurrency operations. With clearer documentation and more intuitive code examples, Milvus SDK v2 is designed to streamline your development process, making it easier and faster to build and deploy AI applications.</p>
<p>For more detailed information, please refer to our latest official <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">API Reference and User Guides</a>. If you have any questions or suggestions regarding the new SDK, feel free to provide feedback on <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> and <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>. We look forward to your input as we continue to enhance Milvus.</p>
