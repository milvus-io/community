---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: 人工智能代理还是工作流？为什么 80% 的自动化任务应该跳过 Agents？
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: Refly 和 Milvus 的整合提供了一种实用的自动化方法--重视可靠性和易用性，而不是不必要的复杂性。
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>现在，人工智能 Agents 无处不在--从编码副驾驶到客户服务机器人--它们在复杂推理方面的能力令人瞠目。和你们很多人一样，我也很喜欢它们。但在构建了 Agents 和自动化工作流程之后，我明白了一个简单的道理：<strong>Agent 并不是解决所有问题的最佳方案。</strong></p>
<p>例如，当我用 CrewAI 构建一个用于解码 ML 的多 Agents 系统时，事情很快就变得一团糟。研究代理 70% 的时间都在忽略网络爬虫。摘要代理放弃了引用。只要任务不明确，协调就会崩溃。</p>
<p>这不仅仅是在实验中。我们中的许多人已经在用于头脑风暴的 ChatGPT、用于编码的 Claude 和用于数据处理的半打 API 之间辗转反侧，悄悄地思考：<em>一定有更好的方法让所有这一切协同工作。</em></p>
<p>有时，答案就是 Agents。更常见的情况是，它是一个<strong>精心设计的人工智能工作流</strong>，能将现有工具缝合成强大的东西，而不会带来不可预知的复杂性。</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">利用 Refly 和 Milvus 构建更智能的人工智能工作流<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>我知道你们中有些人已经在摇头了："工作流程？那些都是死板的。对于真正的人工智能自动化来说，它们还不够智能"。有道理，大多数工作流程都是僵化的，因为它们是以老式流水线为模型的：步骤 A → 步骤 B → 步骤 C，不允许有任何偏差。</p>
<p>但真正的问题不在于工作流程的<em>理念</em>，而在于<em>执行</em>。我们不必满足于脆弱的线性流水线。我们可以设计出更智能的工作流程，它能适应环境，灵活运用创造力，还能提供可预测的结果。</p>
<p>在本指南中，我们将使用 Refly 和 Milvus 构建一个完整的内容创建系统，以说明为什么人工智能工作流可以胜过复杂的多 Agents 架构，尤其是当你关心速度、可靠性和可维护性时。</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">我们使用的工具</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>：围绕 "自由画布 "概念构建的开源 AI 原生内容创建平台。</p>
<ul>
<li><p><strong>核心功能：</strong>智能画布、知识管理、多线程对话和专业创作工具。</p></li>
<li><p><strong>为什么它有用？</strong>拖放式工作流程构建让你可以将工具串联起来，形成有凝聚力的自动化序列，而不会将你锁定在僵化、单一的执行路径上。</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>：处理数据层的开源向量数据库。</p>
<ul>
<li><p><strong>为何重要？</strong>内容创建主要是查找和重组现有信息。传统数据库能很好地处理结构化数据，但大多数创意工作都涉及非结构化格式--文档、图片和视频。</p></li>
<li><p><strong>新增功能</strong>Milvus 利用集成的 Embeddings 模型，将非结构化数据编码为向量，从而实现语义搜索，使您的工作流程能够以毫秒级的延迟检索相关上下文。通过 MCP 等协议，它可以与人工智能框架无缝集成，让您可以用自然语言查询数据，而不必纠结于数据库语法。</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">设置环境</h3><p>让我教你在本地设置这个工作流。</p>
<p><strong>快速设置清单：</strong></p>
<ul>
<li><p>Ubuntu 20.04+（或类似的 Linux 系统）</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>任何支持函数调用的 LLM 的 API 密钥。在本指南中，我将使用<a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>的 LLM。</p></li>
</ul>
<p><strong>系统要求</strong></p>
<ul>
<li><p>CPU：至少 8 核（建议 16 核）</p></li>
<li><p>内存：至少 16GB（建议 32GB）</p></li>
<li><p>存储空间最低 100GB SSD（建议 500GB）</p></li>
<li><p>网络：需要稳定的互联网连接</p></li>
</ul>
<p><strong>软件依赖性</strong></p>
<ul>
<li><p>操作系统：Linux（建议使用 Ubuntu 20.04 以上版本）</p></li>
<li><p>容器化Docker + Docker Compose</p></li>
<li><p>Python3.11 或更高版本</p></li>
<li><p>语言模型：任何支持函数调用的模型（在线服务或 Ollama 离线部署均可使用）</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">步骤 1：部署 Milvus 向量数据库</h3><p><strong>1.1 下载 Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 启动 Milvus 服务</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">第 2 步：部署 Refly 平台</h3><p><strong>2.1 克隆版本库</strong></p>
<p>除非有特殊要求，否则所有环境变量都可以使用默认值：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 验证服务状态</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">第 3 步：设置 MCP 服务</h3><p><strong>3.1 下载 Milvus MCP 服务器</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 启动 MCP 服务</strong></p>
<p>本例使用 SSE 模式。用可用的 Milvus 服务端点替换 URI：</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 确认 MCP 服务正在运行</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">步骤 4：配置和设置</h3><p>现在，您的基础架构已经运行，让我们来配置一切，以便无缝协作。</p>
<p><strong>4.1 访问 Refly 平台</strong></p>
<p>导航至本地 Refly 实例：</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 创建您的账户</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 配置语言模型</strong></p>
<p>在本指南中，我们将使用<a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>。首先，注册并获取 API 密钥。</p>
<p><strong>4.4 添加模型提供者</strong></p>
<p>输入您在上一步中获得的 API 密钥：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 配置 LLM 模型</strong></p>
<p>确保选择支持函数调用功能的模型，因为这对我们将要构建的工作流集成至关重要：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 集成 Milvus-MCP 服务</strong></p>
<p>注意网络版不支持 stdio 类型的连接，因此我们将使用之前设置的 HTTP 端点：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>非常好！一切配置完成后，让我们通过一些实际例子来看看这个系统的运行情况。</p>
<p><strong>4.7 示例使用 MCP-Milvus-Server 进行高效向量检索</strong></p>
<p>本例展示了<strong>MCP-Milvus 服务器</strong>如何作为人工智能模型和 Milvus 向量数据库实例之间的中间件。它就像一个翻译器--接受人工智能模型的自然语言请求，将其转换为正确的数据库查询，并返回结果--这样，您的模型就可以在不知道任何数据库语法的情况下处理向量数据。</p>
<p><strong>4.7.1 创建新画布</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 开始对话</strong></p>
<p>打开对话界面，选择您的模型，输入您的问题，然后发送。</p>
<p><strong>4.7.3 查看结果</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这里发生的事情非常了不起：我们刚刚展示了使用<a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a>作为集成层对<a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">Milvus</a>向量数据库的自然语言控制。没有复杂的查询语法--只需用简单的英语告诉系统你需要什么，它就会为你处理数据库操作。</p>
<p><strong>4.8 示例 2：使用工作流构建 Refly 部署指南</strong></p>
<p>第二个示例展示了工作流协调的真正威力。我们将把多个人工智能工具和数据源整合到一个统一的流程中，从而创建一个完整的部署指南。</p>
<p><strong>4.8.1 收集原始资料</strong></p>
<p>Refly 的强大之处在于它能灵活处理不同的输入格式。您可以导入多种格式的资源，无论是文档、图像还是结构化数据。</p>
<p><strong>4.8.2 创建任务并链接资源卡片</strong></p>
<p>现在，我们将通过定义任务并将它们连接到源材料来创建工作流程。</p>
<p><strong>4.8.3 设置三个处理任务</strong></p>
<p>这就是工作流程方法的真正优势所在。我们不会试图在一个复杂的流程中处理所有事情，而是将工作分解为三个重点任务，整合上传的资料并对其进行系统化提炼。</p>
<ul>
<li><p><strong>内容整合任务</strong>：合并和构建源材料</p></li>
<li><p><strong>内容完善任务</strong>：提高清晰度和流程</p></li>
<li><p><strong>最终草案汇编</strong>：创建可供出版的成果</p></li>
</ul>
<p>结果不言自明。原本需要花费数小时在多个工具之间进行人工协调的工作，现在可以自动完成，而且每个步骤都能在前一个步骤的基础上进行逻辑推理。</p>
<p><strong>多模式工作流程功能：</strong></p>
<ul>
<li><p><strong>图像生成和处理</strong>：与高质量模型（包括 flux-schnell、flux-pro 和 SDXL）集成</p></li>
<li><p><strong>视频生成和理解</strong>：支持各种风格化视频模型，包括 Seedance、Kling 和 Veo</p></li>
<li><p><strong>音频生成工具</strong>通过 Lyria-2 等模型生成音乐，通过 Chatterbox 等模型进行语音合成</p></li>
<li><p><strong>集成处理</strong>：所有多模式输出均可在系统内进行引用、分析和再处理</p></li>
</ul>
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
    </button></h2><p><strong>Refly</strong>和<strong>Milvus</strong>的整合提供了一种实用的自动化方法--重视可靠性和易用性，而不是不必要的复杂性。通过将工作流程协调与多模式处理相结合，团队可以更快地完成从概念到出版的过程，同时在每个阶段都能保持完全控制。</p>
<p>这并不是要否定人工智能代理。它们对于解决真正复杂、不可预测的问题很有价值。但对于许多自动化需求来说，特别是在内容创建和数据处理方面，精心设计的工作流程可以以更少的开销带来更好的结果。</p>
<p>随着人工智能技术的发展，最有效的系统可能会融合这两种策略：</p>
<ul>
<li><p><strong>工作流程</strong>的可预测性、可维护性和可重复性是关键。</p></li>
<li><p>需要真正的推理、适应性和开放式问题解决的<strong>Agents</strong>。</p></li>
</ul>
<p>我们的目标不是打造最华丽的人工智能，而是打造最<em>有用的</em>人工智能。而最有用的解决方案往往也是最直接的。</p>
