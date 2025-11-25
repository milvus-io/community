---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: OpenAgents x Milvus：如何构建共享内存的更智能的多代理系统
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: 探索 OpenAgents 如何实现分布式多 Agent 协作，为什么 Milvus 对于添加可扩展内存至关重要，以及如何构建一个完整的系统。
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>大多数开发者都是从单个 Agents 开始开发代理系统的，后来才意识到他们基本上是在建造一个非常昂贵的聊天机器人。对于简单的任务，ReAct 类型的代理效果还不错，但很快就会达到极限：它无法并行运行步骤，无法跟踪较长的推理链，而且一旦添加太多工具，它就会分崩离析。多 Agents 设置有望解决这个问题，但它们也带来了自己的问题：协调开销、脆性交接，以及悄无声息地侵蚀模型质量的膨胀共享上下文。</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a>是一个用于构建多代理系统的开源框架，在这个框架中，人工智能代理可以协同工作、共享资源，并在持久的社区内处理长期项目。OpenAgents 不需要单一的中央协调者，而是让代理以一种更加分布式的方式进行协作：它们可以相互发现、交流，并围绕共同目标进行协调。</p>
<p>与<a href="https://milvus.io/">Milvus</a>向量数据库搭配使用，该管道可获得一个可扩展的高性能长期内存层。Milvus 通过快速语义搜索、灵活的索引选择（如 HNSW 和 IVF）以及通过分区实现的干净隔离，为 Agents 内存提供动力，因此 Agents 可以存储、检索和重用知识，而不会淹没在上下文中或踩踏其他数据。</p>
<p>在这篇文章中，我们将介绍 OpenAgents 如何实现分布式多代理协作，Milvus 为什么是可扩展代理内存的重要基础，以及如何逐步组建这样一个系统。</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">构建真实世界代理系统的挑战<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>当今的许多主流 Agents 框架--LangChain、AutoGen、CrewAI 等--都是围绕<strong>以任务为中心的</strong>模型构建的。你启动一组 Agents，给它们布置任务，或许定义一个工作流程，然后让它们运行。这对于狭窄或短暂的用例非常有效，但在实际生产环境中，它暴露出三个结构性局限：</p>
<ul>
<li><p><strong>知识仍然是孤立的。</strong>Agents 的经验仅限于自己的部署。工程部门的代码审查 Agents 不会与评估可行性的产品团队 Agents 分享它所学到的知识。每个团队最终都要从头开始重建知识，既低效又脆弱。</p></li>
<li><p><strong>协作僵化。</strong>即使在多 Agents 框架中，合作通常也依赖于事先定义的工作流程。当合作需要转变时，这些静态规则就无法适应，从而降低了整个系统的灵活性。</p></li>
<li><p><strong>缺乏持久状态。</strong>大多数 Agents 都遵循一个简单的生命周期：<em>启动 → 执行 → 关闭。</em>它们会忘记运行之间的一切--上下文、关系、决策和交互历史。没有持久状态，Agent 就无法建立长期记忆或演化其行为。</p></li>
</ul>
<p>这些结构性问题来自于将 Agents 视为孤立的任务执行者，而不是更广泛协作网络中的参与者。</p>
<p>OpenAgents 团队认为，未来的 Agents 系统需要的不仅仅是更强的推理能力--它们还需要一种机制，使 Agents 能够相互发现、建立关系、分享知识并动态地协同工作。重要的是，这种机制不应依赖于单一的中央控制器。互联网之所以行之有效，是因为它是分布式的--没有一个节点可以主宰一切，而且随着系统的发展，它也会变得更加强大和可扩展。多 Agents 系统也受益于同样的设计原则。这就是为什么 OpenAgents 摒弃了全能协调者的概念，转而支持分散的、网络驱动的合作。</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">什么是 OpenAgents？<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents 是一个用于构建人工智能代理网络的开源框架，可实现开放式合作，让人工智能代理协同工作、共享资源并解决长期项目。它为代理互联网提供了基础架构--在这个互联网中，代理与数百万其他代理在持久、不断发展的社区中公开协作。在技术层面，该系统围绕三个核心组件构建：<strong>Agents 网络、网络模块和运输工具。</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1.Agents 网络：协作的共享环境</h3><p>Agents 网络是一个共享环境，多个 Agents 可以在这个环境中连接、交流和协作，共同解决复杂的任务。其核心特征包括</p>
<ul>
<li><p><strong>持久操作符：</strong>一旦创建，网络就会保持在线，不受任何单一任务或工作流的影响。</p></li>
<li><p><strong>动态代理：</strong>代理可使用网络 ID 随时加入；无需预先注册。</p></li>
<li><p><strong>多协议支持：</strong>统一的抽象层支持通过 WebSocket、gRPC、HTTP 和 libp2p 进行通信。</p></li>
<li><p><strong>自主配置：</strong>每个网络都有自己的权限、管理和资源。</p></li>
</ul>
<p>只需一行代码，您就可以创建一个网络，任何 Agents 都可以通过标准接口立即加入。</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2.网络模块：协作的可插拔扩展</h3><p>Mods 提供了一个模块化的协作功能层，与核心系统保持分离。您可以根据自己的具体需求混合和匹配 Mods，从而实现针对每个用例量身定制的协作模式。</p>
<table>
<thead>
<tr><th><strong>模块</strong></th><th><strong>目的</strong></th><th><strong>使用案例</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>工作区消息传递</strong></td><td>实时信息交流</td><td>流式回复、即时反馈</td></tr>
<tr><td><strong>论坛</strong></td><td>异步讨论</td><td>提案审查、多轮审议</td></tr>
<tr><td><strong>维基</strong></td><td>共享知识库</td><td>知识整合、文件协作</td></tr>
<tr><td><strong>社交</strong></td><td>关系图谱</td><td>专家路由、信任网络</td></tr>
</tbody>
</table>
<p>所有 Mods 都在统一的事件系统上操作，便于随时扩展框架或引入自定义行为。</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3.传输：与协议无关的通信渠道</h3><p>传输协议是允许异构代理在 OpenAgents 网络中连接和交换信息的通信协议。OpenAgents 支持可在同一网络内同时运行的多种传输协议，包括</p>
<ul>
<li><p><strong>HTTP/REST</strong>用于广泛的跨语言集成</p></li>
<li><p>用于低延迟双向通信的<strong>WebSocket</strong></p></li>
<li><p>用于适合大规模集群的高性能<strong>RPC</strong>的<strong>gRPC</strong></p></li>
<li><p>用于分散式点对点网络的<strong>libp2p</strong></p></li>
<li><p><strong>A2A</strong>，一种专为 Agents 对 Agents 通信设计的新兴协议</p></li>
</ul>
<p>所有传输都通过统一的基于事件的消息格式操作，实现协议之间的无缝转换。您无需担心对等代理使用哪种协议，框架会自动处理。以任何语言或框架构建的 Agents 都可以加入 OpenAgents 网络，而无需重写现有代码。</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">将 OpenAgents 与 Milvus 集成，实现长期代理记忆<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents 解决了 Agents 如何<strong>交流、相互发现和协作的</strong>难题<strong>，但</strong>仅有协作是不够的。代理会产生见解、决策、对话历史、工具结果和特定领域的知识。如果没有持久内存层，所有这些都会在 Agents 关闭的那一刻烟消云散。</p>
<p>这就是<strong>Milvus</strong>的重要性所在。Milvus 提供高性能向量存储和语义检索，将 Agents 的交互转化为持久、可重复使用的内存。当集成到 OpenAgents 网络中时，它具有三大优势：</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1.语义搜索</strong></h4><p>Milvus 使用 HNSW 和 IVF_FLAT 等索引算法提供快速语义搜索。Agents 可以根据意义而非关键字检索最相关的历史记录，使他们能够</p>
<ul>
<li><p>回顾之前的决策或计划、</p></li>
<li><p>避免重复工作</p></li>
<li><p>在不同会话中保持长视距上下文。</p></li>
</ul>
<p>这就是<em>Agents 记忆</em>的支柱：快速、相关、上下文检索。</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2.十亿级水平可扩展性</strong></h4><p>真实的 Agents 网络会产生海量数据。Milvus 可在这种规模下轻松操作，提供以下功能</p>
<ul>
<li><p>数十亿向量的存储和搜索、</p></li>
<li><p>&lt; 即使在高吞吐量 Top-K 检索情况下，延迟时间也小于 30 毫秒、</p></li>
<li><p>完全分布式架构，可随需求增长线性扩展。</p></li>
</ul>
<p>无论你有十几个 Agents 还是成千上万个并行工作的 Agents，Milvus 都能保持检索的快速性和一致性。</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3.多租户隔离</strong></h4><p>Milvus 通过<strong>Partition Key</strong> 提供细粒度的多租户隔离，这是一种轻量级分区机制，可在单个 Collections 内分割内存。这允许</p>
<ul>
<li><p>不同团队、项目或 Agents 社区维护独立的内存空间、</p></li>
<li><p>与维护多个 Collections 相比，大大降低了开销、</p></li>
<li><p>需要共享知识时，可选择跨分区检索。</p></li>
</ul>
<p>这种隔离对于大型多代理部署至关重要，因为在这种部署中，必须在不影响检索速度的情况下尊重数据边界。</p>
<p>OpenAgents 通过直接调用 Milvus API 的<strong>自定义模块</strong>与 Milvus 连接。Agents 消息、工具输出和交互日志会自动嵌入向量并存储在 Milvus 中。开发人员可以自定义</p>
<ul>
<li><p>Embeddings 模型、</p></li>
<li><p>存储 Schema 和元数据、</p></li>
<li><p>和检索策略（如混合搜索、分区搜索）。</p></li>
</ul>
<p>这就为每个 Agents 社区提供了一个可扩展、持久并针对语义推理进行了优化的存储层。</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">如何使用 OpenAgent 和 Milvus 构建多代理聊天机器人<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>为了将事情具体化，让我们通过一个演示来了解一下：建立一个<strong>开发人员支持社区</strong>，让多个专业 Agents（Python 专家、数据库专家、DevOps 工程师等）合作回答技术问题。每个专家都会提供特定领域的推理，系统会自动将查询路由到最合适的 Agents，而不是依赖一个工作过度的通用代理。</p>
<p>本示例演示了如何将<strong>Milvus</strong>集成到 OpenAgents 部署中，为技术问答提供长期记忆。Agents 对话、过去的解决方案、故障排除日志和用户查询都被转换成向量嵌入并存储在 Milvus 中，从而使网络具备以下能力：</p>
<ul>
<li><p>记住以前的答案、</p></li>
<li><p>重复使用先前的技术解释</p></li>
<li><p>在不同会话中保持一致，并</p></li>
<li><p>随着交互次数的增加而不断改进。</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">前提条件</h3><ul>
<li><p>python3.11 以上</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1.定义依赖关系</h3><p>定义项目所需的 Python 软件包：</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2.环境变量</h3><p>这里是您的环境配置模板：</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3.配置 OpenAgents 网络</h3><p>定义 Agents 网络结构及其通信设置：</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4.实现多代理协作</h3><p>下面显示的是核心代码片段（不是完整的实现）。</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5.创建并激活虚拟环境</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>安装依赖项</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>配置 API 密钥</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>启动 OpenAgents 网络</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>启动多代理服务</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>启动 OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>访问工作室</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>检查 Agents 和网络的状态：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>OpenAgents 提供了一个协调层，让 Agents 可以相互发现、交流和协作，而 Milvus 则解决了如何存储、共享和重用知识这一同样重要的问题。通过提供高性能向量记忆层，Milvus 使 Agents 能够建立持久的上下文，回忆过去的交互，并随着时间的推移积累专业知识。它们共同推动人工智能系统超越孤立模型的限制，走向真正的多 Agents 网络更深层次的协作潜力。</p>
<p>当然，任何多代理架构都需要权衡利弊。并行运行 Agents 可能会增加令牌消耗，错误可能会在 Agents 之间串联，同时决策可能会导致偶尔的冲突。这些都是需要积极研究和不断改进的领域，但它们并不会降低构建能够协调、记忆和进化的系统的价值。</p>
<p>准备好让你的 Agents 拥有长期记忆了吗？</p>
<p>了解<a href="https://milvus.io/">Milvus</a>并尝试将其与您自己的工作流程整合。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
