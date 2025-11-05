---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: 拖放和部署：如何使用 Langflow 和 Milvus 构建 RAG 工作流
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: 了解如何使用 Langflow 和 Milvus 构建可视化 RAG 工作流。在几分钟内拖放和部署上下文感知的人工智能应用程序，无需编码。
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>构建人工智能工作流程往往让人感觉难上加难。在编写胶水代码、调试 API 调用和管理数据管道之间，这个过程可能要耗费数小时才能看到结果。<a href="https://www.langflow.org/"><strong>Langflow</strong></a>和<a href="https://milvus.io/"><strong>Milvus</strong></a>则大大简化了这一过程--为您提供了一种轻代码方式，让您可以在几分钟内而不是几天内设计、测试和部署检索增强生成（RAG）工作流。</p>
<p><strong>Langflow</strong>提供了一个简洁的拖放界面，感觉更像是在白板上勾画想法，而不是编码。您可以直观地将语言模型、数据源和外部工具连接起来，定义工作流程逻辑，而无需接触任何模板代码。</p>
<p><strong>Milvus</strong> 是一个开源向量数据库，可为 LLMs 提供长期记忆和上下文理解能力，与<strong>Milvus</strong> 搭配使用，二者构成了生产级 RAG 的完整环境。Milvus 可以高效地存储和检索企业数据或特定领域数据中的 Embeddings，让 LLMs 生成有依据、准确和上下文感知的答案。</p>
<p>在本指南中，我们将介绍如何结合 Langflow 和 Milvus 来构建高级 RAG 工作流程--所有这一切都只需通过几次拖放和点击即可完成。</p>
<h2 id="What-is-Langflow" class="common-anchor-header">什么是 Langflow？<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>在进行 RAG 演示之前，让我们先了解一下 Langflow 是什么以及它能做什么。</p>
<p>Langflow 是一个基于 Python 的开源框架，它能让人工智能应用的构建和实验变得更简单。它支持代理和模型上下文协议（MCP）等关键的人工智能功能，为开发人员和非开发人员创建智能系统提供了灵活的基础。</p>
<p>Langflow 的核心是一个可视化编辑器。你可以拖放和连接不同的资源，设计出结合模型、工具和数据源的完整应用。导出工作流时，Langflow 会在本地计算机上自动生成一个名为<code translate="no">FLOW_NAME.json</code> 的文件。该文件记录了描述流程的所有节点、边和元数据，让您可以在不同团队间轻松实现项目的版本控制、共享和复制。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在幕后，一个基于 Python 的运行时引擎会执行流程。它协调 LLMs、工具、检索模块和路由逻辑，管理数据流、状态和错误处理，确保从开始到结束都能顺利执行。</p>
<p>Langflow 还包含一个丰富的组件库，其中有用于流行的 LLMs 和向量数据库（包括<a href="https://milvus.io/">Milvus</a>）的预置适配器。您还可以为专门的用例创建自定义 Python 组件，从而进一步扩展这些组件。在测试和优化方面，Langflow 提供了逐步执行功能、用于快速测试的 Playground 以及与 LangSmith 和 Langfuse 的集成，用于监控、调试和端到端重放工作流。</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">实践演示：如何使用 Langflow 和 Milvus 构建 RAG 工作流<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Langflow 的架构基础上，Milvus 可以充当向量数据库，管理 Embeddings 并检索私有企业数据或特定领域知识。</p>
<p>在本演示中，我们将使用 Langflow 的向量存储 RAG 模板来演示如何集成 Milvus 并从本地数据建立向量索引，从而实现高效的上下文增强问题解答。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件： 1.</h3><p>1.Python 3.11（或 Conda）</p>
<p>2.uv</p>
<p>3.Docker和Docker Compose</p>
<p>4.OpenAI密钥</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">步骤 1.部署 Milvus 向量数据库</h3><p>下载部署文件。</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>启动 Milvus 服务。</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">步骤 2.创建 Python 虚拟环境</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">步骤 3.安装最新软件包</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">步骤 4.启动 Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>访问 Langflow。</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">第 5 步：配置 RAG 模板配置 RAG 模板</h3><p>在 Langflow 中选择向量存储 RAG 模板。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>选择 Milvus 作为默认向量数据库。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在左侧面板中搜索 "Milvus "并将其添加到您的流程中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>配置 Milvus 连接细节。其他选项暂时保持默认。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>将 OpenAI API 密钥添加到相关节点。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">步骤 6.准备测试数据</h3><p>注意：使用 Milvus 2.6 的官方常见问题作为测试数据。</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">步骤 7.第一阶段测试</h3><p>上传您的数据集并将其摄入 Milvus。 注意：然后 Langflow 会将您的文本转换为向量表示。您必须上传至少两个数据集，否则嵌入过程将失败。这是 Langflow 当前节点实现中的一个已知错误。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>请检查节点状态。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">步骤 8.第二阶段测试</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">步骤 9.运行完整的 RAG 工作流程</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>构建人工智能工作流并不一定很复杂。Langflow + Milvus 使其变得快速、可视化和代码轻量化--这是一种无需大量工程工作即可增强 RAG 的简单方法。</p>
<p>Langflow 的拖放界面使其成为教学、研讨会或现场演示的合适选择，在这些场合中，您需要以清晰和互动的方式展示人工智能系统是如何工作的。对于寻求将直观的工作流程设计与企业级向量检索整合在一起的团队来说，将 Langflow 的简易性与 Milvus 的高性能检索结合起来，既灵活又强大。</p>
<p>现在就开始使用<a href="https://milvus.io/">Milvus</a>构建更智能的 RAG 工作流。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
