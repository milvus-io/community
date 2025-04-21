---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: Milvus SDK v2 简介：原生异步支持、统一 API 和卓越性能
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: 体验为开发人员重新设计的 Milvus SDK v2！为您的向量搜索项目提供统一的应用程序接口、本地异步支持和更高的性能。
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">简要说明<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>我们倾听了您的意见！Milvus SDK v2 是对我们开发者体验的一次全面重塑，直接源自您的反馈。Milvus SDK v2 拥有跨 Python、Java、Go 和 Node.js 的统一 API、您一直要求的原生异步支持、性能提升的 Schema Cache 以及简化的 MilvusClient 界面，使<a href="https://zilliz.com/learn/vector-similarity-search">向量搜索</a>开发比以往更快、更直观。无论您是在构建<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>应用程序、推荐系统还是<a href="https://zilliz.com/learn/what-is-computer-vision">计算机视觉</a>解决方案，这一社区驱动的更新都将改变您使用 Milvus 的方式。</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">我们为何构建它？解决社区痛点<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>多年来，Milvus 已成为成千上万人工智能应用的首选<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量数据库</a>。然而，随着社区的发展壮大，我们不断发现 SDK v1 存在一些局限性：</p>
<p><strong>"处理高并发性太复杂"。</strong>由于某些语言 SDK 缺乏本地异步支持，开发人员不得不依赖线程或回调，这使得代码更难管理和调试，尤其是在批量数据加载和并行查询等场景中。</p>
<p><strong>"性能随规模而降低</strong>如果没有 Schema 缓存，v1 会在操作过程中反复验证模式，从而为大容量工作负载带来瓶颈。在需要大规模向量处理的使用案例中，这一问题导致延迟增加，吞吐量降低。</p>
<p><strong>"不同语言之间不一致的接口造成了陡峭的学习曲线"。</strong>不同语言的 SDK 以各自的方式实现接口，使跨语言开发变得更加复杂。</p>
<p><strong>"RESTful API 缺少基本功能。</strong>分区管理和索引构建等关键功能不可用，迫使开发人员在不同的 SDK 之间切换。</p>
<p>这些不仅仅是功能要求，而是开发工作流程中的实际障碍。SDK v2 是我们消除这些障碍的承诺，让您专注于最重要的事情：构建令人惊叹的人工智能应用程序。</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">解决方案：Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 是以开发人员体验为重点的全面重新设计的结果，可用于多种语言：</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1.本地异步支持：从复杂到并发</h3><p>处理并发的旧方法涉及繁琐的 Future 对象和回调模式。SDK v2 引入了真正的异步/等待功能，尤其是在使用<code translate="no">AsyncMilvusClient</code> 的 Python 中（自 v2.5.3 起）。通过与同步 MilvusClient 相同的参数，您可以轻松地并行运行插入、查询和搜索等操作。</p>
<p>这种简化的方法取代了旧式繁琐的 Future 和回调模式，使代码更简洁、更高效。复杂的并发逻辑，如批量向量插入或并行多查询，现在可以使用<code translate="no">asyncio.gather</code> 等工具毫不费力地实现。</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2.Schema 缓存：在关键处提升性能</h3><p>SDK v2 引入了 Schema Cache，可在初始获取后在本地存储 Collections Schema，从而消除了操作过程中的重复网络请求和 CPU 开销。</p>
<p>对于高频率的插入和查询场景，这种更新可实现以下效果</p>
<ul>
<li><p>减少客户端和服务器之间的网络流量</p></li>
<li><p>降低操作延迟</p></li>
<li><p>降低服务器端 CPU 使用率</p></li>
<li><p>在高并发情况下更好地扩展</p></li>
</ul>
<p>这对于实时推荐系统或实时搜索功能等毫秒量级的应用尤为重要。</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3.统一、简化的 API 体验</h3><p>Milvus SDK v2 在所有支持的编程语言中引入了统一且更完整的 API 体验。特别是，RESTful API 得到了显著增强，其功能与 gRPC 接口接近。</p>
<p>在早期版本中，RESTful API 落后于 gRPC，限制了开发人员在不切换接口的情况下所能做的事情。现在情况不再如此。现在，开发人员可以使用 RESTful API 执行几乎所有的核心操作，如创建 Collections、管理分区、构建索引和运行查询，而无需使用 gRPC 或其他方法。</p>
<p>这种统一的方法可确保开发人员在不同环境和用例中获得一致的体验。它降低了学习曲线，简化了集成，提高了整体可用性。</p>
<p>注：对于大多数用户来说，RESTful API 提供了一种更快、更简单的方式来开始使用 Milvus。但是，如果您的应用程序需要高性能或迭代器等高级功能，gRPC 客户端仍然是实现最大灵活性和控制性的首选。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4.所有语言的统一 SDK 设计</h3><p>通过 Milvus SDK v2，我们对所有支持的编程语言的 SDK 进行了标准化设计，以提供更加一致的开发人员体验。</p>
<p>无论您使用 Python、Java、Go 还是 Node.js，每个 SDK 现在都遵循以 MilvusClient 类为中心的统一结构。这种重新设计为我们支持的每种语言带来了一致的方法命名、参数格式和整体使用模式。(参见：<a href="https://github.com/milvus-io/milvus/discussions/33979">MilvusClient SDK 代码示例更新 - GitHub 讨论 #33979）</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>现在，一旦您熟悉了 Milvus 的一种语言，您就可以轻松地切换到另一种语言，而无需重新学习 SDK 的工作方式。这样的调整不仅简化了上手过程，也使多语言开发更加顺畅和直观。</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5.更简单、更智能的 PyMilvus（Python SDK），包括<code translate="no">MilvusClient</code></h3><p>在之前的版本中，PyMilvus 依赖于 ORM 风格的设计，引入了面向对象和过程方法的混合。开发人员不得不定义<code translate="no">FieldSchema</code> 对象，构建一个<code translate="no">CollectionSchema</code> ，然后实例化一个<code translate="no">Collection</code> 类--所有这一切只是为了创建一个 Collections。这个过程不仅繁琐，而且给新用户带来了更大的学习难度。</p>
<p>有了新的<code translate="no">MilvusClient</code> 界面，一切都变得简单多了。现在，使用<code translate="no">create_collection()</code> 方法，只需一步就能创建一个 Collection。它允许您通过传递<code translate="no">dimension</code> 和<code translate="no">metric_type</code> 等参数快速定义 Schema，如果需要，您还可以使用自定义 Schema 对象。</p>
<p>更妙的是，<code translate="no">create_collection()</code> 支持在同一调用中创建索引。如果提供了索引参数，Milvus 会自动建立索引并将数据加载到内存中--无需单独调用<code translate="no">create_index()</code> 或<code translate="no">load()</code> 。只需一种方法即可完成所有操作：<em>创建 Collections → 建立索引 → 加载 Collections。</em></p>
<p>这种简化的方法降低了设置的复杂性，使开始使用 Milvus 变得更加容易，尤其是对于那些希望快速、高效地实现原型或生产的开发人员来说。</p>
<p>新的<code translate="no">MilvusClient</code> 模块在可用性、一致性和性能方面具有明显优势。虽然传统的 ORM 界面目前仍然可用，但我们计划在未来逐步淘汰它（<a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">请参阅参考资料</a>）。我们强烈建议升级到新的 SDK，以充分利用这些改进。</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6.更清晰、更全面的文档</h3><p>我们调整了产品文档的结构，以提供更完整、更清晰的<a href="https://milvus.io/docs">API 参考资料</a>。我们的用户指南现在包括多语言示例代码，使您能够快速上手，轻松了解 Milvus 的功能。此外，我们文档网站上的 Ask AI 助手可以介绍新功能、解释内部机制，甚至帮助生成或修改示例代码，使您的文档之旅更顺畅、更愉快。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7.Milvus MCP 服务器：专为人工智能集成的未来而设计</h3><p>建立在 Milvus SDK 基础上的<a href="https://github.com/zilliztech/mcp-server-milvus">MCP 服务器</a>是我们对人工智能生态系统中日益增长的需求的回应：大型语言模型<a href="https://zilliz.com/glossary/large-language-models-(llms)">（LLM</a>）、<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量数据库</a>和外部工具或数据源之间的无缝集成。它实现了模型上下文协议（MCP），为协调 Milvus Operator 操作及其他操作提供了统一的智能接口。</p>
<p>随着<a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">人工智能 Agents</a>的能力越来越强，不仅能生成代码，还能自主管理后端服务，对更智能、API 驱动的基础设施的需求也在不断上升。MCP 服务器的设计正是着眼于这一未来。它实现了与 Milvus 集群的智能自动交互，简化了部署、维护和数据管理等任务。</p>
<p>更重要的是，它为新型机器对机器协作奠定了基础。有了 MCP 服务器，人工智能 Agents 可以调用 API 来动态创建 Collections、运行查询、建立索引等，所有这些都无需人工干预。</p>
<p>简而言之，MCP 服务器不仅将 Milvus 变成了一个数据库，而且还变成了一个完全可编程、人工智能就绪的后端--为智能、自主和可扩展的应用铺平了道路。</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Milvus SDK v2 入门：示例代码<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>下面的示例展示了如何使用新的 PyMilvus（Python SDK v2）接口创建 Collections 并执行异步操作。与前一版本中的 ORM 风格相比，这段代码更简洁、更一致，也更容易操作。</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1.创建 Collections、定义 Schema、建立索引并用它加载数据<code translate="no">MilvusClient</code></h3><p>下面的 Python 代码片段演示了如何创建 Collections、定义其 Schema、构建索引和加载数据--所有这些都在一次调用中完成：</p>
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
<p><code translate="no">create_collection</code> 方法的<code translate="no">index_params</code> 参数消除了单独调用<code translate="no">create_index</code> 和<code translate="no">load_collection</code>的需要，一切都会自动发生。</p>
<p>此外，<code translate="no">MilvusClient</code> 还支持快速创建表格模式。例如，只需指定所需的参数，就能在一行代码中创建一个 Collection：</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(比较说明：在旧的 ORM 方法中，您必须创建<code translate="no">Collection(schema)</code> ，然后分别调用<code translate="no">collection.create_index()</code> 和<code translate="no">collection.load()</code> ；现在，MilvusClient 简化了整个过程）。</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2.使用 MilvusClient 执行高并发异步插入<code translate="no">AsyncMilvusClient</code></h3><p>下面的示例展示了如何使用<code translate="no">AsyncMilvusClient</code> ，使用<code translate="no">async/await</code> 执行并发插入操作：</p>
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
<p>在这个示例中，<code translate="no">AsyncMilvusClient</code> ，通过<code translate="no">asyncio.gather</code> 调度多个插入任务来并发插入数据。这种方法充分利用了 Milvus 的后端并发处理能力。与 v1 中的同步逐行插入不同，这种本地异步支持可显著提高吞吐量。</p>
<p>同样，您也可以修改代码以执行并发查询或搜索--例如，用<code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code> 代替插入调用。Milvus SDK v2 的异步接口可确保以非阻塞方式执行每个请求，从而充分利用客户端和服务器资源。</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">轻松迁移<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>我们知道您在 SDK v1 上投入了大量时间，因此我们在设计 SDK v2 时考虑到了您现有的应用程序。SDK v2 具有向后兼容性，因此现有的 v1/ORM 风格接口仍可继续使用一段时间。但我们强烈建议尽快升级到 SDK v2，因为对 v1 的支持将随着 Milvus 3.0 的发布（2025 年底）而终止。</p>
<p>升级到 SDK v2 后，开发人员将获得更一致、更现代的开发体验，语法更简化，异步支持更完善，性能更出色。这也是所有新功能和社区支持的重点所在。现在升级可确保您为下一步做好准备，并获得 Milvus 提供的最佳功能。</p>
<h2 id="Conclusion" class="common-anchor-header">总结<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 与 v1 相比有了显著的改进：性能增强、跨多种编程语言的统一一致的界面，以及简化高并发操作的本地异步支持。Milvus SDK v2 拥有更清晰的文档和更直观的代码示例，旨在简化您的开发流程，使构建和部署人工智能应用程序变得更简单、更快捷。</p>
<p>欲了解更多详细信息，请参阅我们最新的官方<a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">API 参考资料和用户指南</a>。如果您对新的 SDK 有任何问题或建议，请随时在<a href="https://github.com/milvus-io/milvus/discussions">GitHub</a>和<a href="https://discord.com/invite/8uyFbECzPX">Discord</a> 上提供反馈。我们期待您的意见，继续增强 Milvus 的功能。</p>
