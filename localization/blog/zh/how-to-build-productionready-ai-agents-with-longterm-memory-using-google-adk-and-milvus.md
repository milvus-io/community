---
id: >-
  how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
title: 如何使用 Google ADK 和 Milvus 构建具有长期记忆功能的生产就绪型人工智能 Agents
author: Min Yin
date: 2026-02-26T00:00:00.000Z
cover: assets.zilliz.com/cover_c543dbeab4.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: >-
  AI agent memory, long-term memory, ADK framework, Milvus vector database,
  semantic retrieval
meta_title: |
  Production AI Agents with Persistent Memory Using Google ADK and Milvus
desc: 使用 ADK 和 Milvus 构建具有真正长期记忆的人工智能 Agents，内容包括记忆设计、语义检索、用户隔离和生产就绪架构。
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
---
<p>在构建智能 Agents 时，最难解决的问题之一就是内存管理：决定 Agents 应该记住什么，忘记什么。</p>
<p>并不是所有的内存都能持续使用。有些数据只在当前对话中需要，因此在对话结束时就应清除。其他数据，如用户偏好，则必须在不同对话中持续存在。当这些数据混杂在一起时，临时数据就会堆积起来，重要信息就会丢失。</p>
<p>真正的问题在于架构。大多数框架都没有明确区分短期内存和长期内存，开发人员只能手动处理。</p>
<p>2025 年发布的谷歌开源<a href="https://google.github.io/adk-docs/">Agents 开发工具包（ADK）</a>通过将内存管理作为头等大事，在框架层面解决了这一问题。它默认将短期会话内存和长期内存分开。</p>
<p>在本文中，我们将了解这种分离在实践中是如何发挥作用的。使用 Milvus 作为向量数据库，我们将从头开始构建一个具有真正长期内存的可投入生产的 Agents。</p>
<h2 id="ADK’s-Core-Design-Principles" class="common-anchor-header">ADK 的核心设计原则<button data-href="#ADK’s-Core-Design-Principles" class="anchor-icon" translate="no">
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
    </button></h2><p>ADK 的设计目的是让开发人员不再需要管理内存。该框架会自动将短期会话数据与长期内存分开，并分别进行适当处理。它通过四种核心设计方案来实现这一目标。</p>
<h3 id="Built-in-Interfaces-for-Short--and-Long-Term-Memory" class="common-anchor-header">短期和长期内存的内置接口</h3><p>每个 ADK Agents 都有两个用于管理内存的内置接口：</p>
<p><strong>会话服务（临时数据）</strong></p>
<ul>
<li><strong>存储内容</strong>：当前对话内容和工具调用的中间结果</li>
<li><strong>何时清除</strong>：会话结束时自动清除</li>
<li><strong>存储位置</strong>：内存（最快）、数据库或云服务</li>
</ul>
<p><strong>内存服务（长期内存）</strong></p>
<ul>
<li><strong>存储内容</strong>：应记住的信息，如用户偏好或过去的记录</li>
<li><strong>何时清除</strong>：不会自动清除；必须手动删除</li>
<li><strong>存储在哪里</strong>？ADK 仅定义了接口；存储后端由您决定（例如 Milvus）</li>
</ul>
<h3 id="A-Three-Layer-Architecture" class="common-anchor-header">三层架构</h3><p>ADK 将系统分为三层，每一层都有各自的职责：</p>
<ul>
<li><strong>Agents 层</strong>：业务逻辑所在，如 "在回答用户之前检索相关内存"。</li>
<li><strong>运行时层</strong>：由框架管理，负责创建和销毁会话，并跟踪每个执行步骤。</li>
<li><strong>服务层</strong>：与外部系统集成，如 Milvus 等向量数据库或大型模型 API。</li>
</ul>
<p>这种结构将关注点分开：业务逻辑在 Agents 中，而存储在其他地方。你可以更新其中一个，而不会破坏其他。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_2_6af7f3a395.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Everything-Is-Recorded-as-Events" class="common-anchor-header">一切都记录为事件</h3><p>Agents 的每个操作--调用记忆调用工具、调用模型、生成响应--都会被记录为<strong>事件</strong>。</p>
<p>这有两个实际好处。首先，当出现问题时，开发人员可以一步步重放整个交互过程，找到确切的故障点。其次，在审计和合规性方面，系统可提供每次用户交互的完整执行跟踪。</p>
<h3 id="Prefix-Based-Data-Scoping" class="common-anchor-header">基于前缀的数据范围界定</h3><p>ADK 使用简单的键前缀控制数据可见性：</p>
<ul>
<li><strong>temp:xxx</strong>- 仅在当前会话中可见，会话结束时自动删除</li>
<li><strong>user:xxx</strong>- 在同一用户的所有会话中共享，实现持久的用户首选项</li>
<li><strong>app:xxx</strong>- 在所有用户中全局共享，适用于应用范围内的知识，如产品文档</li>
</ul>
<p>通过使用前缀，开发人员可以控制数据范围，而无需编写额外的访问逻辑。框架会自动处理可见性和生命周期。</p>
<h2 id="Milvus-as-the-Memory-Backend-for-ADK" class="common-anchor-header">Milvus 作为 ADK 的内存后端<button data-href="#Milvus-as-the-Memory-Backend-for-ADK" class="anchor-icon" translate="no">
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
    </button></h2><p>在 ADK 中，MemoryService 只是一个接口。它定义了如何使用长期内存，而不是如何存储内存。数据库的选择取决于开发人员。那么，什么样的数据库能很好地用作 Agents 的内存后台呢？</p>
<h3 id="What-an-Agent-Memory-System-Needs--and-How-Milvus-Delivers" class="common-anchor-header">Agents 记忆系统的需求--以及 Milvus 如何提供这些需求</h3><ul>
<li><strong>语义检索</strong></li>
</ul>
<p><strong>需求</strong>：</p>
<p>用户很少以相同的方式提出相同的问题。"连接不上 "和 "连接超时 "的意思是一样的。记忆系统必须理解含义，而不仅仅是匹配关键字。</p>
<p><strong>Milvus 如何满足它</strong>：</p>
<p>Milvus 支持多种向量索引类型，如 HNSW 和 DiskANN，允许开发人员选择适合自己工作负载的类型。即使有数千万个向量，查询延迟也能保持在 10 毫秒以内，这对于代理使用来说已经足够快了。</p>
<ul>
<li><strong>混合查询</strong></li>
</ul>
<p><strong>需求</strong>：</p>
<p>记忆调用需要的不仅仅是语义搜索。系统还必须通过 user_id 等结构化字段进行过滤，以便只返回当前用户的数据。</p>
<p><strong>Milvus 如何满足它</strong>：</p>
<p>Milvus 本机支持将向量搜索与标量过滤相结合的混合查询。例如，它可以检索语义相似的记录，同时在同一查询中应用 user_id = 'xxx' 等过滤器，而不会影响性能或召回质量。</p>
<ul>
<li><strong>可扩展性</strong></li>
</ul>
<p><strong>需求</strong>：</p>
<p>随着用户数量和存储记忆的增加，系统必须平滑扩展。随着数据的增加，性能应保持稳定，而不会突然变慢或出现故障。</p>
<p><strong>Milvus 如何满足这一要求</strong>：</p>
<p>Milvus 采用计算与存储分离的架构。查询能力可根据需要通过添加查询节点进行横向扩展。即使是在单机上运行的独立版本，也能处理数千万个向量，适合早期阶段的部署。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_4_e1d89e6986.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>注：为进行本地开发和测试，本文中的示例使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>或<a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone</a>。</p>
<h2 id="Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="common-anchor-header">使用 Milvus 提供的 Long-TermMemory 构建一个 Agents<button data-href="#Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在本节中，我们将构建一个简单的技术支持 Agents。当用户提出问题时，Agent 会查找过去类似的支持单来回答，而不是重复同样的工作。</p>
<p>这个例子非常有用，因为它展示了真实代理内存系统必须处理的三个常见问题。</p>
<ul>
<li><strong>跨会话的长期记忆</strong></li>
</ul>
<p>今天提出的问题可能与几周前创建的票单有关。Agents 必须记住跨会话的信息，而不仅仅是当前会话中的信息。这就是需要通过 MemoryService 管理长期内存的原因。</p>
<ul>
<li><strong>用户隔离</strong></li>
</ul>
<p>每个用户的支持历史必须保持私密。一个用户的数据绝不能出现在另一个用户的结果中。这就需要对 user_id 等字段进行过滤，Milvus 通过混合查询支持这种过滤。</p>
<ul>
<li><strong>语义匹配</strong></li>
</ul>
<p>用户会以不同的方式描述相同的问题，如 "无法连接 "或 "超时"。关键词匹配是不够的。Agents 需要进行语义搜索，而向量检索可以提供这种搜索。</p>
<h3 id="Environment-setup" class="common-anchor-header">环境设置</h3><ul>
<li>Python 3.11+</li>
<li>Docker 和 Docker Compose</li>
<li>双子座 API 密钥</li>
</ul>
<p>本节涵盖基本设置，以确保程序能正确运行。</p>
<pre><code translate="no">pip install google-adk pymilvus google-generativeai  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;  
ADK + Milvus + Gemini Long-term Memory Agent  
Demonstrates how to implement a cross-session memory recall system  
&quot;&quot;&quot;</span>  
<span class="hljs-keyword">import</span> os  
<span class="hljs-keyword">import</span> asyncio  
<span class="hljs-keyword">import</span> time  
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType, utility  
<span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai  
<span class="hljs-keyword">from</span> google.adk.agents <span class="hljs-keyword">import</span> Agent  
<span class="hljs-keyword">from</span> google.adk.tools <span class="hljs-keyword">import</span> FunctionTool  
<span class="hljs-keyword">from</span> google.adk.runners <span class="hljs-keyword">import</span> Runner  
<span class="hljs-keyword">from</span> google.adk.sessions <span class="hljs-keyword">import</span> InMemorySessionService  
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Deploy-Milvus-Standalone-Docker" class="common-anchor-header">步骤 1：部署 Milvus 单机版（Docker）</h3><p><strong>(1) 下载部署文件</strong></p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml  
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 启动 Milvus 服务</strong></p>
<pre><code translate="no">docker-compose up -d  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_1_0ab7f330eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Model-and-Connection-Configuration" class="common-anchor-header">第 2 步：模型和连接配置</h3><p>配置 Gemini API 和 Milvus 连接设置。</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Configuration ====================  </span>
<span class="hljs-comment"># 1. Gemini API configuration  </span>
GOOGLE_API_KEY = os.getenv(<span class="hljs-string">&quot;GOOGLE_API_KEY&quot;</span>)  
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> GOOGLE_API_KEY:  
   <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Please set the GOOGLE_API_KEY environment variable&quot;</span>)  
genai.configure(api_key=GOOGLE_API_KEY)  
<span class="hljs-comment"># 2. Milvus connection configuration  </span>
MILVUS_HOST = os.getenv(<span class="hljs-string">&quot;MILVUS_HOST&quot;</span>, <span class="hljs-string">&quot;localhost&quot;</span>)  
MILVUS_PORT = os.getenv(<span class="hljs-string">&quot;MILVUS_PORT&quot;</span>, <span class="hljs-string">&quot;19530&quot;</span>)  
<span class="hljs-comment"># 3. Model selection (best combination within the free tier limits)  </span>
LLM_MODEL = <span class="hljs-string">&quot;gemini-2.5-flash-lite&quot;</span>  <span class="hljs-comment"># LLM model: 1000 RPD  </span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;models/text-embedding-004&quot;</span>  <span class="hljs-comment"># Embedding model: 1000 RPD  </span>
EMBEDDING_DIM = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension  </span>
<span class="hljs-comment"># 4. Application configuration  </span>
APP_NAME = <span class="hljs-string">&quot;tech_support&quot;</span>  
USER_ID = <span class="hljs-string">&quot;user_123&quot;</span>  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Using model configuration:&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  LLM: <span class="hljs-subst">{LLM_MODEL}</span>&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Embedding: <span class="hljs-subst">{EMBEDDING_MODEL}</span> (dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>)&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Milvus-Database-Initialization" class="common-anchor-header">第 3 步 Milvus 数据库初始化</h3><p>创建向量数据库 Collections（类似于关系数据库中的表格）</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Initialize Milvus ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">init_milvus</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Initialize Milvus connection and collection&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Step 1: Establish connection  </span>
   Try:  
       connections.connect(  
           alias=<span class="hljs-string">&quot;default&quot;</span>,  
           host=MILVUS_HOST,  
           port=MILVUS_PORT  
       )  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Connected to Milvus: <span class="hljs-subst">{MILVUS_HOST}</span>:<span class="hljs-subst">{MILVUS_PORT}</span>&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✗ Failed to connect to Milvus: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Hint: make sure Milvus is running&quot;</span>)  
       Raise  
   <span class="hljs-comment"># Step 2: Define data schema  </span>
   fields = [  
       FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;session_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;question&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;solution&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">5000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM),  
       FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)  
   ]  
   schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Tech support memory&quot;</span>)  
   collection_name = <span class="hljs-string">&quot;support_memory&quot;</span>  
   <span class="hljs-comment"># Step 3: Create or load the collection  </span>
   <span class="hljs-keyword">if</span> utility.has_collection(collection_name):  
       memory_collection = Collection(name=collection_name)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; already exists&quot;</span>)  
   Else:  
       memory_collection = Collection(name=collection_name, schema=schema)  
   <span class="hljs-comment"># Step 4: Create vector index  </span>
   index_params = {  
       <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,  
       <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
   }  
   memory_collection.create_index(field_name=<span class="hljs-string">&quot;embedding&quot;</span>, index_params=index_params)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Created collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; and index&quot;</span>)  
   <span class="hljs-keyword">return</span> memory_collection  
<span class="hljs-comment"># Run initialization  </span>
memory_collection = init_milvus()  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Memory-Operation-Functions" class="common-anchor-header">第 4 步 存储器操作符</h3><p>将存储和检索逻辑封装为 Agents 的工具。</p>
<p>(1) 存储记忆功能</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Memory Operation Functions ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">store_memory</span>(<span class="hljs-params">question: <span class="hljs-built_in">str</span>, solution: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Store a solution record into the memory store  
   Args:  
       question: the user&#x27;s question  
       solution: the solution  
   Returns:  
       str: result message  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] store_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - question: <span class="hljs-subst">{question[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - solution: <span class="hljs-subst">{solution[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-comment"># Use global USER_ID (in production, this should come from ToolContext)  </span>
       user_id = USER_ID  
       session_id = <span class="hljs-string">f&quot;session_<span class="hljs-subst">{<span class="hljs-built_in">int</span>(time.time())}</span>&quot;</span>  
       <span class="hljs-comment"># Key step 1: convert the question into a 768-dimensional vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=question,  
           task_type=<span class="hljs-string">&quot;retrieval_document&quot;</span>,  <span class="hljs-comment"># specify document indexing task  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: insert into Milvus  </span>
       memory_collection.insert([{  
           <span class="hljs-string">&quot;user_id&quot;</span>: user_id,  
           <span class="hljs-string">&quot;session_id&quot;</span>: session_id,  
           <span class="hljs-string">&quot;question&quot;</span>: question,  
           <span class="hljs-string">&quot;solution&quot;</span>: solution,  
           <span class="hljs-string">&quot;embedding&quot;</span>: embedding,  
           <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-built_in">int</span>(time.time())  
       }])  
       <span class="hljs-comment"># Key step 3: flush to disk (ensure data persistence)  </span>
       memory_collection.flush()  
       result = <span class="hljs-string">&quot;✓ Successfully stored in memory&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> result  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;✗ Storage failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(2) 检索内存功能</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_memory</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Retrieve relevant historical cases from the memory store  
   Args:  
       query: query question  
       top_k: number of most similar results to return  
   Returns:  
       str: retrieval result  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] recall_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - query: <span class="hljs-subst">{query}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - top_k: <span class="hljs-subst">{top_k}</span>&quot;</span>)  
       user_id = USER_ID  
       <span class="hljs-comment"># Key step 1: convert the query into a vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=query,  
           task_type=<span class="hljs-string">&quot;retrieval_query&quot;</span>,  <span class="hljs-comment"># specify query task (different from indexing)  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       query_embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: load the collection into memory (required for the first query)  </span>
       memory_collection.load()  
       <span class="hljs-comment"># Key step 3: hybrid search (vector similarity + scalar filtering)  </span>
       results = memory_collection.search(  
           data=[query_embedding],  
           anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,  
           param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},  
           limit=top_k,  
           expr=<span class="hljs-string">f&#x27;user_id == &quot;<span class="hljs-subst">{user_id}</span>&quot;&#x27;</span>,  <span class="hljs-comment"># 🔑 key to user isolation  </span>
           output_fields=[<span class="hljs-string">&quot;question&quot;</span>, <span class="hljs-string">&quot;solution&quot;</span>, <span class="hljs-string">&quot;timestamp&quot;</span>]  
       )  
       <span class="hljs-comment"># Key step 4: format results  </span>
       <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results[<span class="hljs-number">0</span>]:  
           result = <span class="hljs-string">&quot;No relevant historical cases found&quot;</span>  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
           <span class="hljs-keyword">return</span> result  
       result_text = <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> relevant cases:\\n\\n&quot;</span>  
       <span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results[<span class="hljs-number">0</span>]):  
           result_text += <span class="hljs-string">f&quot;Case <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> (similarity: <span class="hljs-subst">{hit.score:<span class="hljs-number">.2</span>f}</span>):\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;question&#x27;</span>)}</span>\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Solution: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;solution&#x27;</span>)}</span>\\n\\n&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> cases&quot;</span>)  
       <span class="hljs-keyword">return</span> result_text  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;Retrieval failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(3) 注册为 ADK 工具</p>
<pre><code translate="no"><span class="hljs-comment"># Usage  </span>
<span class="hljs-comment"># Wrap functions with FunctionTool  </span>
store_memory_tool = FunctionTool(func=store_memory)  
recall_memory_tool = FunctionTool(func=recall_memory)  
memory_tools = [store_memory_tool, recall_memory_tool]  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Agent-Definition" class="common-anchor-header">第 5 步 代理定义</h3><p>核心思想：定义 Agents 的行为逻辑。</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Create Agent ====================  </span>
support_agent = Agent(  
   model=LLM_MODEL,  
   name=<span class="hljs-string">&quot;support_agent&quot;</span>,  
   description=<span class="hljs-string">&quot;Technical support expert agent that can remember and recall historical cases&quot;</span>,  
   <span class="hljs-comment"># Key: the instruction defines the agent’s behavior  </span>
   instruction=<span class="hljs-string">&quot;&quot;&quot;  
You are a technical support expert. Strictly follow the process below:  
&lt;b&gt;When the user asks a technical question:&lt;/b&gt;  
1. Immediately call the recall_memory tool to search for historical cases  
  - Parameter query: use the user’s question text directly  
  - Do not ask for any additional information; call the tool directly  
2. Answer based on the retrieval result:  
  - If relevant cases are found: explain that similar historical cases were found and answer by referencing their solutions  
  - If no cases are found: explain that this is a new issue and answer based on your own knowledge  
3. After answering, ask: “Did this solution resolve your issue?”  
&lt;b&gt;When the user confirms the issue is resolved:&lt;/b&gt;  
- Immediately call the store_memory tool to save this Q&amp;A  
- Parameter question: the user’s original question  
- Parameter solution: the complete solution you provided  
&lt;b&gt;Important rules:&lt;/b&gt;  
- You must call a tool before answering  
- Do not ask for user_id or any other parameters  
- Only store memory when you see confirmation phrases such as “resolved”, “it works”, or “thanks”  
&quot;&quot;&quot;</span>,  
   tools=memory_tools  
)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Main-Program-and-Execution-Flow" class="common-anchor-header">第 6 步 主程序和执行流程</h3><p>演示跨会话内存检索的完整过程。</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Main Program ====================  </span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Demonstrate cross-session memory recall&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Create Session service and Runner  </span>
   session_service = InMemorySessionService()  
   runner = Runner(  
       agent=support_agent,  
       app_name=APP_NAME,  
       session_service=session_service  
   )  
   <span class="hljs-comment"># ========== First round: build memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;First conversation: user asks a question and the solution is stored&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session1 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_001&quot;</span>  
   )  
   <span class="hljs-comment"># User asks the first question  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: What should I do if Milvus connection times out?&quot;</span>)  
   content1 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;What should I do if Milvus connection times out?&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content1  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># User confirms the issue is resolved  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: The issue is resolved, thanks!&quot;</span>)  
   content2 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;The issue is resolved, thanks!&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content2  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># ========== Second round: recall memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Second conversation: new session with memory recall&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session2 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_002&quot;</span>  
   )  
   <span class="hljs-comment"># User asks a similar question in a new session  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: Milvus can&#x27;t connect&quot;</span>)  
   content3 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;Milvus can&#x27;t connect&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session2.<span class="hljs-built_in">id</span>](http://session2.<span class="hljs-built_in">id</span>),  
       new_message=content3  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)

  
<span class="hljs-comment"># Program entry point  </span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:  
   Try:  
       asyncio.run(main())  
   <span class="hljs-keyword">except</span> KeyboardInterrupt:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n\\nProgram exited&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n\\nProgram error: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-keyword">import</span> traceback  
       traceback.print_exc()  
   Finally:  
       Try:  
           connections.disconnect(alias=<span class="hljs-string">&quot;default&quot;</span>)  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n✓ Disconnected from Milvus&quot;</span>)  
       Except:  
           <span class="hljs-keyword">pass</span>  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Run-and-Test" class="common-anchor-header">第 7 步 运行和测试</h3><p><strong>(1) 设置环境变量</strong></p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-gemini-api-key&quot;</span>  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">python milvus_agent.py  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Expected-Output" class="common-anchor-header">预期输出</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_5_0c5a37fe32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_3_cf3a60bd51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>输出结果显示了内存系统在实际使用中的运行情况。</p>
<p>在第一次对话中，用户询问如何处理 Milvus 连接超时。Agents 给出了一个解决方案。在用户确认问题已解决后，Agent 将问题和答案保存到内存中。</p>
<p>在第二次对话中，一个新的会话开始了。用户用不同的词语提出了同样的问题："Milvus 无法连接"。Agents 会自动从内存中检索类似的案例，并给出相同的解决方案。</p>
<p>无需人工操作。Agents 决定何时检索过去的案例，何时存储新案例，这显示了它的三大能力：跨会话记忆、语义匹配和用户隔离。</p>
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
    </button></h2><p>ADK 在框架层面使用会话服务（SessionService）和内存服务（MemoryService）分离了短期上下文和长期记忆。<a href="https://milvus.io/">Milvus</a>通过基于向量的检索来处理语义搜索和用户级过滤。</p>
<p>选择框架时，目标很重要。如果需要强大的状态隔离、可审计性和生产稳定性，ADK 会更适合。如果您正在进行原型设计或实验，LangChain（一种流行的 Python 框架，用于快速构建基于 LLM 的应用程序和 Agents）则能提供更多灵活性。</p>
<p>对于 Agents 内存来说，关键的一环是数据库。无论使用哪种框架，语义记忆都依赖于向量数据库。Milvus 运行良好，因为它开源、本地运行、支持在单台机器上处理数十亿向量，并支持混合向量、标量和全文检索。这些功能涵盖了早期测试和生产使用。</p>
<p>希望本文能帮助您更好地理解代理内存设计，并为您的项目选择合适的工具。</p>
<p>如果您正在构建需要真正内存的人工智能 Agents，而不仅仅是更大的上下文窗口，我们很想听听您是如何处理的。</p>
<p>如果您对 ADK、Agents 内存设计或使用 Milvus 作为内存后端有任何疑问？加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>，或预约 20 分钟的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>会议，讨论您的使用案例。</p>
