---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: 实践教程：用 Dify 和 Milvus 在 10 分钟内构建一个由 RAG 驱动的文档助手
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: 在这个快速、实用的开发人员教程中，您将了解如何使用 Dify 和 Milvus 的检索增强生成（RAG）创建一个人工智能驱动的文档助手。
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如果你能将整个文档库--数千页的技术规范、内部维基和代码文档--转化为一个能即时回答特定问题的智能人工智能助手，会怎么样？</p>
<p>更妙的是，如果你能在比修复合并冲突所需的时间更短的时间内构建它，会怎样？</p>
<p>这就是 "<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">检索增强生成"</a>（RAG）以正确方式实现的前景。</p>
<p>虽然 ChatGPT 和其他 LLMs 令人印象深刻，但当被问及公司的特定文档、代码库或知识库时，它们很快就会达到极限。RAG 将您的专有数据整合到对话中，为您提供与您的工作直接相关的人工智能功能，从而弥补了这一差距。</p>
<p>问题出在哪里？传统的 RAG 实现是这样的</p>
<ul>
<li><p>编写自定义嵌入生成管道</p></li>
<li><p>配置和部署向量数据库</p></li>
<li><p>设计复杂的提示模板</p></li>
<li><p>构建检索逻辑和相似性阈值</p></li>
<li><p>创建可用界面</p></li>
</ul>
<p>但如果可以直接跳到结果呢？</p>
<p>在本教程中，我们将使用两个以开发人员为重点的工具来构建一个简单的 RAG 应用程序：</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>：一个开源平台，只需最少的配置即可处理 RAG 协调工作</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>：速度极快的开源向量数据库，专门用于相似性搜索和人工智能搜索。</p></li>
</ul>
<p>在本 10 分钟指南的最后，您将拥有一个可以工作的人工智能助手，它可以回答您向其提出的任何文档 Collections 的详细问题--无需机器学习学位。</p>
<h2 id="What-Youll-Build" class="common-anchor-header">您将创建的内容<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>只需几分钟，你就能创建</p>
<ul>
<li><p>将任何 PDF 文件转换为可查询知识的文档处理管道</p></li>
<li><p>一个能准确找到正确信息的向量搜索系统</p></li>
<li><p>能准确回答技术问题的聊天机器人界面</p></li>
<li><p>可与现有工具集成的可部署解决方案</p></li>
</ul>
<p>最棒的是什么？大部分功能都可以通过简单的用户界面（UI）进行配置，而无需自定义代码。</p>
<h2 id="What-Youll-Need" class="common-anchor-header">你需要什么<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>基本的 Docker 知识（<code translate="no">docker-compose up -d</code> 级别即可）</p></li>
<li><p>OpenAI API 密钥</p></li>
<li><p>一份用于实验的 PDF 文档（我们将使用一篇研究论文）</p></li>
</ul>
<p>准备好在最短时间内创建一些真正有用的东西了吗？让我们开始吧！</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">使用 Milvus 和 Dify 构建 RAG 应用程序<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>在本节中，我们将使用 Dify 构建一个简单的 RAG 应用程序，我们可以就研究论文中包含的信息提出问题。对于研究论文，您可以使用任何您想要的论文；不过，在本例中，我们将使用向我们介绍 Transformer 架构的著名论文 &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>&quot;。</p>
<p>我们将使用 Milvus 作为向量存储，在这里我们将存储所有必要的上下文。对于嵌入模型和 LLM，我们将使用 OpenAI 的模型。因此，我们需要先设置一个 OpenAI API 密钥。有关设置的更多信息，请<a href="https://platform.openai.com/docs/quickstart"> 点击此处</a>。</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">步骤 1：启动 Dify 和 Milvus 容器</h3><p>在本例中，我们将使用 Docker Compose 自托管 Dify。因此，在开始之前，请确保本地计算机上安装了 Docker。如果尚未安装，请参阅 Docker 安装<a href="https://docs.docker.com/desktop/"> 页面</a>进行安装。</p>
<p>安装好 Docker 后，我们需要使用以下命令将 Dify 源代码克隆到本地计算机中：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>接下来，进入刚刚克隆的源代码中的<code translate="no">docker</code> 目录。在那里，你需要用以下命令复制<code translate="no">.env</code> 文件：</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>简而言之，<code translate="no">.env</code> 文件包含了 Dify 应用程序启动和运行所需的配置，如选择向量数据库、访问向量数据库所需的凭证、Dify 应用程序的地址等。</p>
<p>由于我们将使用 Milvus 作为向量数据库，因此需要将<code translate="no">.env</code> 文件中<code translate="no">VECTOR_STORE</code> 变量的值改为<code translate="no">milvus</code> 。此外，我们还需要将<code translate="no">MILVUS_URI</code> 变量更改为<code translate="no">http://host.docker.internal:19530</code> ，以确保部署后 Docker 容器之间不会出现通信问题。</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>现在，我们准备启动 Docker 容器。为此，我们只需运行<code translate="no">docker compose up -d</code> 命令。完成后，你会在终端中看到如下类似的输出：</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们可以使用<code translate="no">docker compose ps</code> 命令检查所有容器的状态，看看它们是否已启动并健康运行。如果它们都运行正常，你将看到如下输出：</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最后，如果我们访问<a href="http://localhost/install"> </a>http://localhost/install，你会看到一个 Dify 登陆页面，在这里我们可以注册并立即开始构建我们的 RAG 应用程序。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>注册完成后，您就可以使用凭据登录 Dify 了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">第二步：设置 OpenAI API 密钥</h3><p>注册 Dify 后，我们需要做的第一件事就是设置 API 密钥，我们将用它来调用 embedding 模型以及 LLM。由于我们要使用 OpenAI 的模型，因此需要在配置文件中插入 OpenAI API 密钥。为此，请将光标悬停在用户界面右上方的个人资料上，进入 "设置"，如下图所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>接下来，转到 "模型提供程序"，将光标悬停在 OpenAI 上，然后点击 "设置"。然后你会看到一个弹出屏幕，提示你输入 OpenAI API 密钥。完成后，我们就可以使用 OpenAI 的模型作为嵌入模型和 LLM 了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">第三步：将文档插入知识库</h3><p>现在，让我们为 RAG 应用程序存储知识库。知识库由内部文档或文本 Collections 组成，这些文档或文本可用作相关上下文，帮助 LLM 生成更准确的响应。</p>
<p>在我们的使用案例中，我们的知识库实质上就是 "关注就是你所需要的一切 "文件。然而，由于多种原因，我们无法原封不动地存储这篇论文。首先，这篇论文太长了，给 LLM 提供过长的上下文不会有任何帮助，因为上下文太宽泛了。其次，如果我们的输入是原始文本，我们就无法进行相似性搜索来获取最相关的上下文。</p>
<p>因此，在将论文存储到知识库之前，我们至少需要采取两个步骤。首先，我们需要将论文划分为文本块，然后通过嵌入模型将每个文本块转化为嵌入。最后，我们可以将这些嵌入作为向量数据库存储到 Milvus 中。</p>
<p>Dify 可以让我们轻松地将论文中的文本分割成块，并将其转化为嵌入式。我们只需上传论文的 PDF 文件，设置块长度，并通过滑块选择嵌入模型。要完成所有这些步骤，请转到 &quot;知识&quot;，然后点击 &quot;创建知识&quot;。接下来，系统会提示你从本地电脑上传 PDF 文件。因此，最好先从 ArXiv 下载论文并保存在电脑上。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>上传文件后，我们可以设置分块长度、索引方法、要使用的嵌入模型以及检索设置。</p>
<p>在 "分块设置 "区域，你可以选择任何数字作为最大分块长度（在我们的使用案例中，我们将其设置为 100）。接下来，对于 "索引方法"，我们需要选择 "高质量 "选项，因为它能让我们执行相似性搜索，找到相关上下文。对于 "Embedding Model（嵌入模型）"，你可以从 OpenAI 中选择任何你想要的嵌入模型，但在本例中，我们将使用 text-embedding-3-small 模型。最后，对于 "检索设置"，我们需要选择 "向量搜索"，因为我们要执行相似性搜索，以找到最相关的上下文。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>现在，如果点击 "保存并处理 "且一切顺利，就会看到一个绿色的"√"出现，如下图所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">步骤 4：创建 RAG 应用程序</h3><p>到此为止，我们已经成功创建了一个知识库，并将其存储在 Milvus 数据库中。现在我们准备创建 RAG 应用程序。</p>
<p>使用 Dify 创建 RAG 应用程序非常简单。我们需要进入 "Studio"（工作室），而不是之前的 "Knowledge"（知识），然后点击 "Create from Blank"（从空白创建）。接下来，选择 "聊天机器人 "作为应用程序类型，并在提供的字段中为您的应用程序命名。完成后，点击 "创建"。现在您将看到以下页面：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在 "指令 "字段下，我们可以编写系统提示，如 "简明扼要地回答用户的询问"。接下来，作为 "上下文"，我们需要点击 "添加 "符号，然后添加刚刚创建的知识库。这样，我们的 RAG 应用程序就会从该知识库中获取可能的上下文来回答用户的询问。</p>
<p>现在，我们已经将知识库添加到 RAG 应用程序中，最后需要做的是从 OpenAI 中选择 LLM。为此，您可以点击右上角的模型列表，如下图所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>现在，我们已经准备好发布 RAG 应用程序了！在右上角点击 "Publish（发布）"，您可以找到多种发布 RAG 应用程序的方法：我们可以在浏览器中运行它，也可以将它嵌入到我们的网站上，还可以通过 API 访问应用程序。在本例中，我们只需在浏览器中运行应用程序，点击 &quot;运行应用程序 &quot;即可。</p>
<p>就这样！现在，你可以向法律硕士询问任何与 "关注就是你所需要的 "论文或我们知识库中的任何文档相关的问题了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">结束语<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>现在，你已经使用 Dify 和 Milvus，用最少的代码和配置构建了一个可用的 RAG 应用程序。这种方法使开发人员无需具备向量数据库或 LLM 集成方面的深厚专业知识，就能使用复杂的 RAG 架构。 主要收获：</p>
<ol>
<li><strong>低设置开销</strong>：使用 Docker Compose 简化部署</li>
<li><strong>无代码/低代码协调</strong>：Dify 处理大部分 RAG 管道</li>
<li><strong>生产就绪的向量数据库</strong>：Milvus 提供高效的 Embeddings 存储和检索功能</li>
<li><strong>可扩展架构</strong>：易于添加文档或调整参数 对于生产部署，请考虑以下几点</li>
</ol>
<ul>
<li>为您的应用程序设置身份验证</li>
<li>为 Milvus 配置适当的扩展（尤其是针对较大的文档 Collections）</li>
<li>对 Dify 和 Milvus 实例实施监控</li>
<li>微调检索参数，以获得最佳性能 Dify 和 Milvus 的结合可实现 RAG 应用程序的快速开发，从而有效地利用现代大型语言模型 (LLMs) 的组织内部知识。 快乐构建！</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">其他资源<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://docs.dify.ai/">Dify 文档</a></li>
<li><a href="https://milvus.io/docs">Milvus 文档</a></li>
<li><a href="https://zilliz.com/learn/vector-database">向量数据库基础知识</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 实现模式</a></li>
</ul>
