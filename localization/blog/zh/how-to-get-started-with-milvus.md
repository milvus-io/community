---
id: how-to-get-started-with-milvus.md
title: 如何开始使用 Milvus
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>如何开始使用 Milvus</span> </span></p>
<p><strong><em>最后更新于 2025 年 1 月</em></strong></p>
<p>随着大型语言模型<a href="https://zilliz.com/glossary/large-language-models-(llms)">（LLMs</a>）的进步和数据量的不断增加，有必要建立一个灵活且可扩展的基础设施来存储海量信息，例如数据库。然而，<a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">传统数据库</a>是为存储表格和结构化数据而设计的，而通常对利用复杂 LLMs 和信息检索算法的强大功能有用的信息都<a href="https://zilliz.com/learn/introduction-to-unstructured-data">是非结构化的</a>，如文本、图像、视频或音频。</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>是专门为非结构化数据设计的数据库系统。我们不仅可以用向量数据库存储海量非结构化数据，还可以用<a href="https://zilliz.com/learn/vector-similarity-search">向量</a>数据库进行<a href="https://zilliz.com/learn/vector-similarity-search">向量搜索</a>。向量数据库拥有先进的索引方法，如反转文件索引（IVFFlat）或层次导航小世界<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">（HNSW</a>），可以执行快速高效的向量搜索和信息检索过程。</p>
<p><strong>Milvus</strong>是一个开源矢量数据库，我们可以利用它来发挥矢量数据库所能提供的所有有益功能。以下是我们将在本篇文章中介绍的内容：</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Milvus 概述</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Milvus 部署选项</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">开始使用 Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">开始使用 Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">全面管理的 Milvus </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvus 是什么？<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong>是 </a>一个开源向量数据库，使我们能够存储海量非结构化数据，并对其执行快速高效的向量搜索。Milvus 对于推荐系统、个性化聊天机器人、异常检测、图像搜索、自然语言处理和检索增强生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（RAG</a>）等许多流行的 GenAI 应用非常有用。</p>
<p>使用 Milvus 作为向量数据库可以获得以下几个优势：</p>
<ul>
<li><p>Milvus 提供多种部署选项，您可以根据自己的使用情况和要构建的应用程序的规模进行选择。</p></li>
<li><p>Milvus 支持多样化的索引方法，以满足各种数据和性能需求，包括 FLAT、IVFFlat、HNSW 和<a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a> 等内存内选项，提高内存效率的量化变体，用于大型数据集的磁盘上<a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DANN</a>，以及 GPU_CAGRA、GPU_IVF_FLAT 和 GPU_IVF_PQ 等 GPU 优化索引，以实现加速的内存效率搜索。</p></li>
<li><p>Milvus 还提供混合搜索，我们可以在向量搜索操作过程中结合使用密集嵌入、稀疏嵌入和元数据过滤，从而获得更准确的检索结果。此外，<a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>现在还支持混合<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">全文检索</a>和向量搜索，使您的检索更加精确。</p></li>
<li><p>Milvus 可通过<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 在云上全面使用，由于具有逻辑集群、流数据和历史数据分解、分层存储、自动扩展和多租户冷热分离等四种高级功能，您可以优化其操作符和向量搜索速度。</p></li>
</ul>
<p>使用 Milvus 作为向量数据库时，您可以选择三种不同的部署方案，每种方案都有其优势和好处。我们将在下一节逐一介绍。</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus 部署选项<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>我们可以选择四种部署方案来开始使用 Milvus：<strong>Milvus Lite、Milvus Standalone、Milvus Distributed 和 Zilliz Cloud（托管 Milvus）。</strong>每种部署选项都是为了适应我们使用案例中的各种情况而设计的，例如我们的数据规模、我们的应用目的以及我们的应用规模。</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Lite</strong></a>是 Milvus 的轻量级版本，也是我们最容易上手的方法。在下一节中，我们将看到如何实际运行 Milvus Lite，而要开始使用，我们只需用 pip 安装 Pymilvus 库。之后，我们就可以执行 Milvus 作为向量数据库的大部分核心功能。</p>
<p>Milvus Lite 非常适合快速制作原型或学习之用，无需任何复杂设置即可在 Jupyter 笔记本中运行。在向量存储方面，Milvus Lite 适合存储大约一百万个向量嵌入。由于其轻量级特性和存储容量，Milvus Lite 是与边缘设备合作的完美部署选择，例如私人文档搜索引擎、设备上的对象检测等。</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus 单机版</h3><p>Milvus Standalone 是打包在 Docker 镜像中的单机服务器部署。因此，我们只需在 Docker 中安装 Milvus，然后启动 Docker 容器即可开始使用。我们还将在下一节看到 Milvus Standalone 的详细实现。</p>
<p>Milvus Standalone 是构建和生产中小型应用的理想选择，因为它能够存储多达 10M 的向量嵌入。此外，Milvus Standalone 通过主备份模式提供高可用性，使其在生产就绪的应用程序中使用时具有很高的可靠性。</p>
<p>例如，在使用 Milvus Lite 快速创建原型和学习 Milvus 功能之后，我们还可以使用 Milvus Standalone，因为 Milvus Standalone 和 Milvus Lite 共享相同的客户端 API。</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">分布式 Milvus</h3><p>Milvus Distributed 是一种部署选项，利用基于云的架构，数据摄取和检索分开处理，从而实现高度可扩展和高效的应用。</p>
<p>要运行 Milvus Distributed，我们通常需要使用 Kubernetes 集群，让容器在多台机器和环境中运行。Kubernetes 集群的应用确保了 Milvus Distributed 的可扩展性和灵活性，可以根据需求和工作量定制分配资源。这也意味着，如果一个部分出现故障，其他部分可以接替，确保整个系统不中断。</p>
<p>Milvus Distributed 能够处理多达数百亿的向量 Embeddings，专为数据量太大、无法存储在单台服务器机器中的使用案例而设计。因此，这种部署方案非常适合服务于庞大用户群的企业客户端。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图不同 Milvus 部署选项的向量嵌入存储能力。</em></p>
<p>在本文中，我们将向你介绍如何开始使用 Milvus Lite 和 Milvus Standalone，因为这两种方法都可以快速上手，无需复杂的设置。而 Milvus Distributed 的设置则比较复杂。我们设置好 Milvus Distributed 后，创建 Collections、摄取数据、执行向量搜索等的代码和逻辑过程与 Milvus Lite 和 Milvus Standalone 类似，因为它们共享相同的客户端 API。</p>
<p>除了上述三种部署方案，您还可以尝试在<a href="https://zilliz.com/cloud">Zilliz Cloud</a>上托管 Milvus，获得无忧体验。我们还将在本文后面谈谈 Zilliz Cloud。</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">开始使用 Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>使用 pip 导入一个名为 Pymilvus 的库，就可以直接用 Python 实现 Milvus Lite。在安装 Pymilvus 之前，请确保您的环境满足以下要求：</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 和 arm64)</p></li>
<li><p>MacOS &gt;= 11.0（Apple Silicon M1/M2 和 x86_64）</p></li>
<li><p>Python 3.7 或更高版本</p></li>
</ul>
<p>满足这些要求后，你就可以使用以下命令安装 Milvus Lite 和演示所需的依赖程序：</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>:该命令安装或升级<code translate="no">pymilvus</code> 库，即 Milvus 的 Python SDK。Milvus Lite 与 PyMilvus 捆绑在一起，因此只需这一行代码就能安装 Milvus Lite。</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>:该命令添加了 Milvus 预集成的高级功能和额外工具，包括机器学习模型，如 Hugging Face Transformers、Jina AI 嵌入模型和 Rerankers 模型。</p></li>
</ul>
<p>下面是我们使用 Milvus Lite 的步骤：</p>
<ol>
<li><p>使用嵌入模型将文本数据转换为它们的嵌入表示。</p></li>
<li><p>在 Milvus 数据库中创建一个 Schema，用于存储文本数据及其嵌入表示。</p></li>
<li><p>在 Schema 中存储数据并编制索引。</p></li>
<li><p>对存储的数据执行简单的向量搜索。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图向量搜索操作符的工作流程。</em></p>
<p>为了将文本数据转换为向量嵌入，我们将使用 SentenceTransformers 中名为 "all-MiniLM-L6-v2 "的<a href="https://zilliz.com/ai-models">嵌入模型</a>。该嵌入模型可将我们的文本转换为 384 维向量嵌入。让我们加载模型，转换文本数据，并将所有内容打包在一起。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>接下来，让我们创建一个 Schema，将上述所有数据存储到 Milvus 中。如上图所示，我们的数据由三个字段组成：ID、向量和文本。因此，我们要创建一个包含这三个字段的 Schema。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>有了 Milvus Lite，我们只需几行代码，就能根据上面定义的 Schema 在特定数据库上轻松创建一个 Collections，还能将数据插入到 Collections 中并建立索引。</p>
<pre><code translate="no" class="language-python">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>在上面的代码中，我们在名为 &quot;milvus_demo &quot;的 Milvus 数据库中创建了一个名为 &quot;demo_collection &quot;的集合。接下来，我们将所有数据索引到刚刚创建的 "demo_collection "中。</p>
<p>现在，我们的数据已经在数据库中，我们可以针对任何给定的查询对它们执行向量搜索。比方说，我们有一个查询：<em>&quot;谁是艾伦-图灵？</em>我们可以通过以下步骤获得最合适的答案：</p>
<ol>
<li><p>使用将数据库中的数据转化为嵌入式数据时所使用的相同嵌入模型，将我们的查询转化为向量嵌入。</p></li>
<li><p>使用余弦相似度或欧几里得距离等指标计算我们的查询嵌入和数据库中每个条目的嵌入之间的相似度。</p></li>
<li><p>获取最相似的条目作为我们查询的合适答案。</p></li>
</ol>
<p>下面是使用 Milvus 实现上述步骤的过程：</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>就是这样！你还可以在<a href="https://milvus.io/docs/">Milvus 文档</a>中进一步了解 Milvus 提供的其他功能，如管理数据库、插入和删除 Collections、选择合适的索引方法，以及使用元数据过滤和混合搜索执行更高级的向量搜索。</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">开始使用 Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone 是一种部署选项，其中的所有内容都打包在一个 Docker 容器中。因此，我们需要在 Docker 中安装 Milvus，然后启动 Docker 容器，才能开始使用 Milvus Standalone。</p>
<p>在安装 Milvus Standalone 之前，请确保你的硬件和软件都满足<a href="https://milvus.io/docs/prerequisite-docker.md">本页</a>描述的要求。此外，确保已安装 Docker。要安装 Docker，请参阅<a href="https://docs.docker.com/get-started/get-docker/">本页</a>。</p>
<p>一旦系统满足要求并安装了 Docker，我们就可以使用以下命令在 Docker 中继续安装 Milvus：</p>
<pre><code translate="no" class="language-shell"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>在上面的代码中，我们还启动了 Docker 容器，一旦它启动，就会得到类似下面的输出：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图成功启动 Docker 容器后的信息。</em></p>
<p>运行上面的安装脚本 "standalone_embed.sh "后，一个名为 "milvus "的 Docker 容器就在 19530 端口启动了。因此，我们只要在启动客户端时指向这个端口，就能创建一个新数据库，也能访问与 Milvus 数据库相关的所有内容。</p>
<p>比方说，我们想创建一个名为 "milvus_demo "的数据库，类似于上面在 Milvus Lite 中的做法。我们可以按如下步骤创建：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)
client.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>接下来，你可以通过访问 Milvus<a href="https://milvus.io/docs/milvus-webui.md">Web UI</a> 来验证新创建的名为 "milvus_demo "的数据库是否真正存在于你的 Milvus 实例中。顾名思义，Milvus Web UI 是 Milvus 提供的图形用户界面，用于观察组件的统计和指标，检查数据库、Collection 和配置的列表和细节。启动上述 Docker 容器后，你就可以访问 Milvus Web UI，网址是 http://127.0.0.1:9091/webui/。</p>
<p>访问上述链接后，你会看到这样一个登陆页面：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在 "Collections "标签下，你会看到我们的 "milvus_demo "数据库已经成功创建。正如你所看到的，你还可以通过这个 Web UI 查看其他内容，如 Collections 列表、配置、执行过的查询等。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>现在，我们可以完全按照上面 Milvus Lite 部分中的方法执行一切操作。让我们在 "milvus_demo "数据库中创建一个名为 "demo_collection "的 Collections，它由三个字段组成，与之前在 Milvus Lite 部分中的字段相同。然后，我们将把数据插入 Collections 中。</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>执行向量搜索操作的代码也与 Milvus Lite 相同，你可以从下面的代码中看到：</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>除了使用 Docker，你还可以通过<a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a>（适用于 Linux）和<a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a>（适用于 Windows）来使用 Milvus Standalone。</p>
<p>当我们不再使用 Milvus 实例时，可以用下面的命令停止 Milvus Standalone：</p>
<pre><code translate="no" class="language-shell">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">完全托管 Milvus<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>开始使用 Milvus 的另一种方法是通过<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 中基于云的原生基础架构，在这里你可以获得无忧无虑、速度快 10 倍的体验。</p>
<p>Zilliz Cloud 提供具有专用环境和资源的专用集群，以支持您的人工智能应用。由于是基于 Milvus 构建的云数据库，我们无需设置和管理本地基础设施。Zilliz Cloud 还提供更多高级功能，例如向量存储与计算分离、将数据备份到 S3 等常用对象存储系统以及数据缓存以加快向量搜索和检索操作。</p>
<p>不过，在考虑基于云的服务时，需要考虑的一点是操作成本。在大多数情况下，即使集群闲置，没有数据摄取或向量搜索活动，我们仍然需要付费。如果想进一步优化应用程序的操作成本和性能，Zilliz Cloud Serverless 将是一个很好的选择。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图使用 Zilliz Cloud Serverless 的主要优势。</em></p>
<p>Zilliz Cloud Serverless 可在 AWS、Azure 和 GCP 等主要云提供商上使用。它提供现收现付定价等功能，这意味着您只需在使用集群时支付费用。</p>
<p>Zilliz Cloud Serverless 还实现了逻辑集群、自动缩放、分层存储、流数据和历史数据分解以及冷热数据分离等先进技术。与内存中的 Milvus Operator 相比，这些功能使 Zilliz Cloud Serverless 能够实现高达 50 倍的成本节约和约 10 倍的向量搜索操作速度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图分层存储和冷热数据分离示意图。</em></p>
<p>如果您想开始使用 Zilliz Cloud Serverless，请查看<a href="https://zilliz.com/serverless">此页面</a>了解更多信息。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 作为一款多功能、功能强大的向量数据库脱颖而出，旨在应对现代人工智能应用中管理非结构化数据和执行快速、高效向量搜索操作的挑战。它提供了多种部署选项，如用于快速原型开发的 Milvus Lite、用于中小型应用的 Milvus Standalone 以及用于企业级可扩展性的 Milvus Distributed，可灵活匹配任何项目的规模和复杂性。</p>
<p>此外，Zilliz Cloud Serverless 将 Milvus 的功能扩展到云中，并提供了一种经济高效的现收现付模型，无需本地基础设施。凭借分层存储和自动扩展等先进功能，Zilliz Cloud Serverless 在优化成本的同时，确保了更快的向量搜索操作符。</p>
