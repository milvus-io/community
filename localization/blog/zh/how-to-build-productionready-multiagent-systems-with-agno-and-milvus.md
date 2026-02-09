---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: 如何利用 Agno 和 Milvus 构建生产就绪的多代理系统
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: 了解如何使用 Agno、AgentOS 和 Milvus 为实际工作负载构建、部署和扩展生产就绪的多代理系统。
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>如果您一直在构建人工智能 Agents，您可能会遇到这样的问题：您的演示效果很好，但要将其投入生产却完全是另一回事。</p>
<p>我们在前面的文章中介绍了代理内存管理和 Rerankers。现在，让我们来应对更大的挑战--建立能在生产中真正站稳脚跟的 Agents。</p>
<p>现实情况是：生产环境非常混乱。单个 Agents 很少能胜任，这就是多 Agents 系统随处可见的原因。但目前可用的框架往往分为两类：一类是轻量级的，演示效果很好，但在实际负载下就会崩溃；另一类是功能强大的，但学习和构建都要花很长时间。</p>
<p>我最近一直在尝试使用<a href="https://github.com/agno-agi/agno">Agno</a>，它似乎找到了一个合理的中间点--既注重生产准备，又不过分复杂。几个月来，该项目在 GitHub 上获得了 37,000 多颗星，这表明其他开发者也觉得它很有用。</p>
<p>在这篇文章中，我将分享在使用 Agno 和<a href="https://milvus.io/">Milvus</a>作为内存层构建多代理系统时学到的知识。我们将探讨 Agno 与 LangGraph 等替代方案的比较，并介绍一个完整的实现方案，您可以亲自尝试。</p>
<h2 id="What-Is-Agno" class="common-anchor-header">Agno 是什么？<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a>是专为生产应用而构建的多代理框架。它有两个不同的层：</p>
<ul>
<li><p><strong>Agno 框架层</strong>：您定义代理逻辑的地方</p></li>
<li><p><strong>AgentOS 运行层</strong>：将逻辑转化为可实际部署的 HTTP 服务</p></li>
</ul>
<p>可以这样理解：框架层定义 Agents 应该做<em>什么</em>，而 AgentOS 处理<em>如何</em>执行和提供这些工作。</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">框架层</h3><p>这是你直接使用的部分。它引入了三个核心概念：</p>
<ul>
<li><p><strong>Agent</strong>：处理特定类型的任务</p></li>
<li><p><strong>团队</strong>：协调多个代理解决复杂问题</p></li>
<li><p><strong>工作流</strong>：定义执行顺序和结构</p></li>
</ul>
<p>我最欣赏的一点是：你不需要学习新的 DSL 或绘制流程图。Agents 的行为是通过标准 Python 函数调用定义的。该框架处理 LLM 调用、工具执行和内存管理。</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">AgentOS 运行时层</h3><p>AgentOS 专为通过异步执行处理大量请求而设计，其无状态架构使扩展变得简单易行。</p>
<p>主要功能包括</p>
<ul>
<li><p>内置 FastAPI 集成，可将 Agents 作为 HTTP 端点公开</p></li>
<li><p>会话管理和流式响应</p></li>
<li><p>监控端点</p></li>
<li><p>支持横向扩展</p></li>
</ul>
<p>在实践中，AgentOS 处理大部分基础架构工作，这让您可以专注于代理逻辑本身。</p>
<p>Agno 架构的高层视图如下所示。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno 与 LangGraph 的对比<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>要了解 Agno 的优势所在，让我们将其与 LangGraph 进行比较--LangGraph 是使用最广泛的多代理框架之一。</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a>使用基于图的状态机。您可以将整个代理工作流程模型化为一张图：步骤是节点，执行路径是边。在流程固定且严格有序的情况下，这种方法效果很好。但对于开放式或对话式场景，这可能会让人感觉受到限制。随着交互变得越来越动态，维持一个清晰的图变得越来越难。</p>
<p><strong>Agno</strong>采用了不同的方法。它不是一个纯粹的协调层，而是一个端到端的系统。您只需定义代理行为，AgentOS 就会自动将其作为生产就绪的 HTTP 服务--内置监控、可扩展性和多轮对话支持。无需单独的 API 网关，无需自定义会话管理，无需额外的操作符。</p>
<p>下面是一个快速比较：</p>
<table>
<thead>
<tr><th>维度</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>协调模型</td><td>使用节点和边明确定义图</td><td>用 Python 定义的声明式工作流</td></tr>
<tr><td>状态管理</td><td>由开发人员定义和管理自定义状态类</td><td>内置内存系统</td></tr>
<tr><td>调试和可观察性</td><td>LangSmith（付费）</td><td>AgentOS UI（开源）</td></tr>
<tr><td>运行时模型</td><td>集成到现有运行时中</td><td>基于 FastAPI 的独立服务</td></tr>
<tr><td>部署复杂性</td><td>需要通过 LangServe 进行额外设置</td><td>开箱即用</td></tr>
</tbody>
</table>
<p>LangGraph 可为您提供更多灵活性和细粒度控制。Agno 进行了优化，可加快产品上市时间。正确的选择取决于您的项目阶段、现有基础设施以及所需的定制化程度。如果您不确定，使用这两种系统进行小型概念验证可能是最可靠的决定方式。</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">为 Agents 内存层选择 Milvus<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦选择了框架，下一个决定就是如何存储内存和知识。为此，我们使用了 Milvus。<a href="https://milvus.io/">Milvus</a>是专为人工智能工作负载构建的最受欢迎的开源向量数据库，在<a href="https://github.com/milvus-io/milvus">GitHub 上</a>拥有超过<a href="https://github.com/milvus-io/milvus">42,000+ 个</a>星级。</p>
<p><strong>Agno 原生支持 Milvus。</strong> <code translate="no">agno.vectordb.milvus</code> 模块封装了连接管理、自动重试、批量写入和 Embeddings 生成等生产功能。你不需要自己建立连接池或处理网络故障--几行 Python 代码就能为你提供一个工作向量内存层。</p>
<p><strong>Milvus 可根据你的需求进行扩展。</strong>它支持三种<a href="https://milvus.io/docs/install-overview.md">部署模式：</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>：轻量级、基于文件--非常适合本地开发和测试</p></li>
<li><p><strong>独立</strong>部署：生产工作负载的单服务器部署</p></li>
<li><p><strong>分布式</strong>：用于大规模场景的全集群</p></li>
</ul>
<p>你可以从 Milvus Lite 开始，在本地验证你的代理内存，然后随着流量的增长转到独立或分布式--而无需改变你的应用代码。当您在早期阶段快速迭代，但需要明确的扩展路径时，这种灵活性尤其有用。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">逐步实现：使用 Milvus 构建生产就绪的 Agno Agent<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们从头开始构建一个可投入生产的 Agents。</p>
<p>我们将从一个简单的单个 Agents 示例开始，展示完整的工作流程。然后，我们将把它扩展到一个多 Agents 系统。AgentOS 会自动将所有内容打包成可调用的 HTTP 服务。</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1.使用 Docker 部署 Milvus 单机版</h3><p><strong>(1) 下载部署文件</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 启动 Milvus 服务</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2.核心实施</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) 运行 Agents</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3.连接到 AgentOS 控制台</h3><p>https://os.agno.com/</p>
<p><strong>(1) 创建账户并登录</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) 将代理连接到 AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) 配置公开端口和 Agents 名称</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) 添加文件并在 Milvus 中建立索引</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) 端对端测试 Agents</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在此设置中，Milvus 处理高性能语义检索。当知识库助手收到一个技术问题时，它会调用<code translate="no">search_knowledge</code> 工具嵌入查询，从 Milvus 中检索最相关的文档块，并将这些结果作为其响应的基础。</p>
<p>Milvus 提供三种部署选项，您可以选择适合您操作要求的架构，同时在所有部署模式中保持应用级 API 的一致性。</p>
<p>上面的演示展示了核心检索和生成流程。不过，要将这一设计应用到生产环境中，还需要对几个架构方面进行更详细的讨论。</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">如何在 Agents 之间共享检索结果<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno 的团队模式有一个<code translate="no">share_member_interactions=True</code> 选项，允许后来的代理继承先前代理的全部交互历史。在实践中，这意味着当第一个 Agents 从 Milvus 检索信息时，后面的 Agents 可以重复使用这些结果，而不用再次运行相同的搜索。</p>
<ul>
<li><p><strong>好处</strong>检索成本可在整个团队中分摊。一个向量搜索支持多个 Agents，减少了冗余查询。</p></li>
<li><p><strong>缺点</strong>检索质量会被放大。如果初始搜索返回的结果不完整或不准确，那么这个错误就会传播给依赖它的每个 Agents。</p></li>
</ul>
<p>这就是为什么检索准确性在多 Agents 系统中更为重要的原因。糟糕的检索不仅会降低一个 Agents 的响应，还会影响整个团队。</p>
<p>下面是一个团队设置示例：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">为什么 Agno 和 Milvus 要分开分层？<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>在此架构中，<strong>Agno</strong>位于对话和协调层。它负责管理对话流、协调 Agents 和维护对话状态，并将会话历史记录保存在关系数据库中。系统的实际领域知识（如产品文档和技术报告）则单独处理，并以向量嵌入的形式存储在<strong>Milvus</strong> 中。这种明确的划分使会话逻辑和知识存储完全分离。</p>
<p>操作符为何如此重要？</p>
<ul>
<li><p><strong>独立扩展</strong>：随着 Agno 需求的增长，增加更多的 Agno 实例。随着查询量的增长，通过增加查询节点来扩展 Milvus。每一层都是独立扩展的。</p></li>
<li><p><strong>不同的硬件需求</strong>：Agno 需要占用 CPU 和内存（LLM 推断、工作流执行）。Milvus 针对高吞吐量向量检索（磁盘 I/O，有时 GPU 加速）进行了优化。将它们分开可防止资源争用。</p></li>
<li><p><strong>成本优化</strong>：您可以为每一层独立调整和分配资源。</p></li>
</ul>
<p>这种分层方法为您提供了一个更高效、更有弹性、更适合生产的架构。</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">将 Agno 与 Milvus 结合使用时的监控内容<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno 具有内置的评估功能，但添加 Milvus 后，您需要监控的内容会更多。根据我们的经验，应重点关注以下三个方面：</p>
<ul>
<li><p><strong>检索质量</strong>：Milvus 返回的文档与查询是否真正相关，还是只是在向量层面上表面相似？</p></li>
<li><p><strong>答案忠实性</strong>：最终的响应是以检索内容为基础，还是 LLM 在生成无据可循的主张？</p></li>
<li><p><strong>端到端延迟细分</strong>：不要只跟踪总响应时间。将其按阶段细分--Embeddings 生成、向量搜索、上下文组装、LLM 推断--这样你就能确定哪里出现了延迟。</p></li>
</ul>
<p><strong>举个实际例子：</strong>当你的 Milvus Collections 从 100 万个向量增加到 1000 万个向量时，你可能会发现检索延迟在逐渐增加。这通常是一个信号，表明需要调整索引参数（如<code translate="no">nlist</code> 和<code translate="no">nprobe</code> ）或考虑从独立部署转为分布式部署。</p>
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
    </button></h2><p>构建生产就绪的 Agents 系统需要的不仅仅是将 LLM 调用和检索演示连接在一起。您需要明确的架构边界、可独立扩展的基础架构以及可观察性，以便及早发现问题。</p>
<p>在这篇文章中，我介绍了 Agno 和 Milvus 如何协同工作：Agno 用于多代理协调，Milvus 用于可扩展内存和语义检索。通过将这些层分开，您可以在不重写核心逻辑的情况下从原型转向生产，并根据需要扩展每个组件。</p>
<p>如果你正在尝试类似的设置，我很想听听你的想法。</p>
<p><strong>对 Milvus 有疑问？</strong>加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>，或预约 20 分钟的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>课程。</p>
