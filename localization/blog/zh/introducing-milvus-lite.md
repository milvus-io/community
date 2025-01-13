---
id: introducing-milvus-lite.md
title: Milvus Lite 简介：在几秒钟内开始构建 GenAI 应用程序
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> 是一种轻量级向量数据库，可在 Python 应用程序中本地运行。Milvus Lite 基于流行的开源<a href="https://milvus.io/intro">Milvus</a>向量数据库，重用了向量索引和查询解析的核心组件，同时删除了为分布式系统中高可扩展性而设计的元素。这种设计使得紧凑高效的解决方案非常适合计算资源有限的环境，如笔记本电脑、Jupyter 笔记本以及移动或边缘设备。</p>
<p>Milvus Lite 与 LangChain 和 LlamaIndex 等各种人工智能开发堆栈集成，使其能够在检索增强生成（RAG）管道中用作向量存储，而无需进行服务器设置。只需运行<code translate="no">pip install pymilvus</code> （2.4.3 或更高版本），即可将其作为 Python 库纳入人工智能应用程序。</p>
<p>Milvus Lite 共享 Milvus API，确保您的客户端代码既适用于小规模本地部署，也适用于部署在拥有数十亿向量的 Docker 或 Kubernetes 上的 Milvus 服务器。</p>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">我们为什么构建 Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>许多人工智能应用需要对非结构化数据（包括文本、图像、语音和视频）进行向量相似性搜索，用于聊天机器人和购物助手等应用。向量数据库是为存储和搜索向量 Embeddings 而精心设计的，是人工智能开发堆栈的重要组成部分，尤其适用于生成式人工智能用例，如<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">检索增强生成（RAG）</a>。</p>
<p>尽管有众多的向量搜索解决方案，但仍缺少一种易于上手、同时适用于大规模生产部署的选择。作为 Milvus 的创建者，我们设计了 Milvus Lite，以帮助人工智能开发人员更快地构建应用程序，同时确保在各种部署选项中获得一致的体验，包括 Kubernetes、Docker 和托管云服务上的 Milvus。</p>
<p>Milvus Lite 是我们在 Milvus 生态系统内提供的产品套件的重要补充。它为开发人员提供了一个多功能工具，支持他们开发过程中的每个阶段。从原型开发到生产环境，从边缘计算到大规模部署，Milvus 现在是唯一一款能覆盖任何规模的用例和所有开发阶段的向量数据库。</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Milvus Lite 如何工作<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite 支持 Milvus 中的所有基本操作，如创建 Collections 以及插入、搜索和删除向量。它将很快支持混合搜索等高级功能。Milvus Lite 会将数据加载到内存中，以便进行高效搜索，并将其持久化为 SQLite 文件。</p>
<p>Milvus Lite 包含在<a href="https://github.com/milvus-io/pymilvus">Milvus 的 Python SDK</a>中，可通过简单的<code translate="no">pip install pymilvus</code> 进行部署。下面的代码片段演示了如何使用 Milvus Lite 设置向量数据库，方法是指定一个本地文件名，然后创建一个新的 Collections。对于熟悉 Milvus API 的人来说，唯一的区别是<code translate="no">uri</code> 指的是本地文件名而不是网络端点，例如，对于 Milvus 服务器来说，<code translate="no">&quot;milvus_demo.db&quot;</code> 而不是<code translate="no">&quot;http://localhost:19530&quot;</code> 。其他一切保持不变。Milvus Lite 还支持使用动态或明确定义的 Schema 将原始文本和其他标签作为元数据存储，如下图所示。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>为了提高可扩展性，使用 Milvus Lite 开发的人工智能应用可以轻松过渡到使用部署在 Docker 或 Kubernetes 上的 Milvus，只需指定<code translate="no">uri</code> 与服务器端点即可。</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">与人工智能开发堆栈集成<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>除了推出 Milvus Lite 以让向量搜索轻松上手之外，Milvus 还集成了人工智能开发堆栈的许多框架和提供商，包括<a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>、<a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>、<a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>、<a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>、<a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Ragas</a>、<a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina</a> <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">AI</a>、<a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>、<a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>、<a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>、<a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>、<a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>、<a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a>和<a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>。得益于其广泛的工具和服务，这些集成简化了具有向量搜索功能的人工智能应用的开发。</p>
<p>这仅仅是个开始，更多令人兴奋的集成即将推出！敬请期待！</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">更多资源和示例<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>探索<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入门文档</a>，了解使用 Milvus Lite 构建检索增强生成<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">（RAG</a>）和<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">图像搜索</a>等人工智能应用的详细指南和代码示例。</p>
<p>Milvus Lite 是一个开源项目，我们欢迎您的贡献。请查看我们的 "<a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">贡献指南"</a>。您还可以在<a href="https://github.com/milvus-io/milvus-lite">Milvus Lite GitHub</a>存储库中提交问题，报告错误或申请功能。</p>
