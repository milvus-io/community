---
id: anthropic-managed-agents-memory-milvus.md
title: 如何使用 Milvus 为 Anthropic 的托管 Agents 添加长期记忆功能
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Anthropic 的托管代理（Managed Agents）让代理变得可靠，但每个会话开始时都是空白的。下面是如何配对 Milvus
  在会话内进行语义调用和跨 Agents 共享内存的方法。
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Anthropic 的 "<a href="https://www.anthropic.com/engineering/managed-agents">托管代理"（Managed Agents</a>）使代理基础架构具有弹性。Anthropic 报告称，解耦后，p50 time-to-first-token 下降了约 60%，p95 下降了 90%。</p>
<p>可靠性不能解决的是内存问题。200 步的代码迁移如果在第 201 步遇到新的依赖冲突，就无法有效地回顾上一步是如何处理的。为一个客户执行漏洞扫描的 Agents 不知道另一个 Agents 一小时前已经解决了同样的问题。每个会话都是从一张白纸上开始的，并行大脑无法了解其他大脑已经解决的问题。</p>
<p>解决方法是将<a href="https://milvus.io/">Milvus 向量数据库</a>与 Anthropic 的管理型 Agents 搭配使用：在会话内进行语义调用，跨会话共享<a href="https://milvus.io/docs/milvus_for_agents.md">向量记忆层</a>。会话合约保持不变，线束获得了一个新的层，而长期代理任务则获得了质的不同。</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">托管代理解决了什么问题（以及没有解决什么问题）<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>托管代理通过将代理解耦为三个独立模块，解决了可靠性问题。它没有解决的是记忆问题，无论是单个会话中的语义记忆，还是跨并行会话的共享经验。</strong>以下是解耦后的内容，以及在解耦设计中内存缺口的位置。</p>
<table>
<thead>
<tr><th>模块</th><th>作用</th></tr>
</thead>
<tbody>
<tr><td><strong>会话</strong></td><td>发生的所有事件的附加事件日志。存储在线束之外。</td></tr>
<tr><td><strong>线束</strong></td><td>调用克劳德并将克劳德的工具调用路由至相关基础设施的循环。</td></tr>
<tr><td><strong>沙箱</strong></td><td>克劳德运行代码和编辑文件的隔离执行环境。</td></tr>
</tbody>
</table>
<p>Anthropic 在文章中明确阐述了这一设计的重构：</p>
<p><em>"会话不是克劳德的上下文窗口。</em></p>
<p>上下文窗口是短暂的：以代币为界，每次模型调用都会重建，并在调用返回时丢弃。会话是持久的，存储在线束之外，代表整个任务的记录系统。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>当线束崩溃时，平台会使用<code translate="no">wake(sessionId)</code> 启动一个新的线束。新的线束通过<code translate="no">getSession(id)</code> 读取事件日志，任务从最后记录的步骤开始，无需编写自定义恢复逻辑，也无需操作会话级保姆。</p>
<p>托管代理》一文没有涉及，也没有声称涉及的是，当代理需要记住任何东西时，它该怎么做。在通过架构推动实际工作负载时，会出现两个缺口。一个存在于单个会话中；其他则存在于跨会话中。</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">问题 1：为什么线性会话日志在超过几百步后就会失效？<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>线性会话日志在超过几百步后就会失效，因为顺序读取和语义搜索从根本上说是不同的工作负载，而</strong> <code translate="no">**getEvents()**</code> <strong>API 只为前者提供服务。</strong>按位置切片或按时间戳搜索足以回答 "这个会话从哪里开始 "的问题。但这还不足以回答 Agents 在任何长期任务中都会遇到的问题：我们以前是否遇到过这种问题，我们又是如何解决的？</p>
<p>假设代码迁移到第 200 步时遇到了新的依赖冲突。自然的做法是回顾过去。Agents 之前在这项任务中遇到过类似的问题吗？尝试过什么方法？是成功了，还是出现了其他下游问题？</p>
<p><code translate="no">getEvents()</code> 有两种方法可以回答这个问题，但两种方法都不好：</p>
<table>
<thead>
<tr><th>选项</th><th>问题</th></tr>
</thead>
<tbody>
<tr><td>顺序扫描每个事件</td><td>200 步时速度慢。2,000 步时无法执行。</td></tr>
<tr><td>在上下文窗口中转入一大段数据流</td><td>对 Agents 来说很昂贵，在大规模情况下不可靠，而且会挤占代理在当前步骤中的实际工作内存。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>会话有利于恢复和审计，但它的索引并不支持 "我以前是否见过这个"。在长期任务中，这个问题不再是可有可无的。</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">解决方案 1：如何将语义记忆添加到受管代理的会话中<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>在会话日志旁添加一个Milvus Collections，并从</strong> <code translate="no">**emitEvent**</code><strong></strong>。会话合约保持不变，而驾驭器则获得了对自身过去的语义查询。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic 的设计正是为此留出了余地。他们在帖子中指出："任何获取的事件在传递到克劳德的上下文窗口之前，都可以在线束中进行转换。这些转换可以是线束编码的任何内容，包括上下文组织......和上下文工程"。上下文工程在线束中进行；会话只需保证持久性和可查询性。</p>
<p>其模式是：每次<code translate="no">emitEvent</code> ，线束也会为值得索引的事件计算一个<a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">向量嵌入</a>，并将其插入到一个 Milvus Collections 中。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>当 Agents 执行到第 200 步并需要回想之前的决策时，查询就是针对该会话的<a href="https://zilliz.com/glossary/vector-similarity-search">向量搜索</a>：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>在这之前，有三个生产细节非常重要：</p>
<ul>
<li><strong>选择索引内容。</strong>并非每个事件都值得嵌入。工具调用的中间状态、重试日志和重复状态事件对检索质量的影响比改善更快。<code translate="no">INDEXABLE_EVENT_TYPES</code> 策略取决于任务而非全局。</li>
<li><strong>定义一致性边界。</strong>如果线束在会话附加和插入 Milvus 之间崩溃，那么一层就会短暂领先于其他层。窗口很小，但却是真实的。选择调和路径（重启时重试、先写日志或最终调和），而不是抱有希望。</li>
<li><strong>控制 Embeddings 支出。</strong>一个 200 步的会话，每一步都会同步调用外部嵌入式应用程序接口（API），这样就会产生一张没有计划的发票。对嵌入进行排队，以异步方式分批发送。</li>
</ul>
<p>有了这些功能，向量搜索只需几毫秒，而嵌入调用只需不到 100 毫秒。在代理注意到摩擦之前，最相关的前五个过去事件就会出现在上下文中。会话保留了其作为持久日志的原有功能；线束则获得了按语义而不是按顺序查询自身过往事件的能力。这只是应用程序接口（API）表面上的微小变化，而对 Agents 在长期任务中所能做的事情来说，却是结构性的变化。</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">问题 2：为什么并行克劳德代理不能共享经验？<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>并行克劳德代理无法共享经验是因为托管代理会话在设计上是隔离的。这种隔离使横向扩展变得简单，同样也阻碍了每个大脑向其他大脑学习。</strong></p>
<p>在解耦驱动中，大脑是无状态和独立的。这种隔离不仅能解除人类学报告中的延迟问题，还能让每个会话在运行过程中对其他会话一无所知。</p>
<p>代理 A 花了 40 分钟为一位客户诊断一个棘手的 SQL 注入向量。一小时后，Agent B 为另一个客户接手了同样的案例，并花了 40 分钟走同样的死胡同，运行同样的工具调用，得出同样的答案。</p>
<p>对于偶尔运行 Agents 的单个用户来说，这就是计算的浪费。对于一个每天为不同客户并发运行数十个<a href="https://zilliz.com/glossary/ai-agents">人工智能 Agents</a>，包括代码审查、漏洞扫描和文档生成的平台来说，成本会在结构上加剧。</p>
<p>如果每次会话产生的体验都在会话结束时消失，那么这些智能就是一次性的。以这种方式构建的平台可以线性扩展，但不会像人类工程师那样随着时间的推移而变得更好。</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">解决方案 2：如何使用 Milvus 建立共享的 Agents 内存池<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>建立一个向量 Collections，每个线束在启动时读取，关闭时写入，按租户分区，这样就可以跨会话体验内存池，而不会跨客户泄漏。</strong></p>
<p>当会话结束时，关键决策、遇到的问题和有效的方法都会被推送到共享的 Milvus Collections 中。当新大脑初始化时，作为设置的一部分，线束会运行语义查询，并将最匹配的过往经验注入上下文窗口。新代理的第一步继承了之前每个代理的经验。</p>
<p>从原型到生产，有两项工程决策。</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">使用 Milvus 分区键隔离租户</h3><p><strong>通过</strong> <code translate="no">**tenant_id**</code><strong>进行分区</strong>，<strong>客户 A 的 Agents 体验与客户 B 的体验不会在同一个分区中。这是数据层的隔离，而不是查询约定。</strong></p>
<p>A 大脑在 A 公司代码库中的工作永远不会被 B 公司的 Agents 检索到。Milvus 的<a href="https://milvus.io/docs/use-partition-key.md">Partition Key</a>可在单个 Collections 上进行处理，每个租户没有第二个 Collections，应用代码中也没有分片逻辑。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>客户 A 的 Agents 经历永远不会出现在客户 B 的查询中，这不是因为查询过滤器编写正确（虽然必须正确），而是因为数据物理上与客户 B 的数据不在同一个分区中。一个 Collections 来操作，逻辑隔离在查询层执行，物理隔离在分区层执行。</p>
<p>有关何时适合使用 Partition Key，何时适合使用单独的 Collections 或数据库，请参阅<a href="https://milvus.io/docs/multi_tenancy.md">多租户策略文档</a>，有关生产部署注意事项，请参阅<a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">多租户 RAG 模式指南</a>。</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">为什么 Agents 的内存质量需要持续改进？</h3><p><strong>记忆质量会随着时间的推移而受到侵蚀：曾经成功过的有缺陷的变通方法会被重放和强化，与已废弃的依赖关系相关的陈旧条目会不断误导继承这些依赖关系的 Agents。防御措施是操作符，而不是数据库功能。</strong></p>
<p>一个 Agents 偶然发现了一个有缺陷的变通办法，而这个变通办法碰巧成功过一次。它被写入共享池。下一个 Agents 会检索它、重做它，并通过第二条 "成功 "的使用记录来强化这种不良模式。</p>
<p>过期条目遵循的是同一路径的慢速版本。一个固定在六个月前就已废弃的依赖版本上的修复项不断被检索，并不断误导继承它的 Agents。程序库越老、使用越频繁，这种情况就积累得越多。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>有三种操作符可以抵御这种情况：</p>
<ul>
<li><strong>信心分数。</strong>跟踪内存在下游会话中成功应用的频率。衰减重放失败的条目。提升重复成功的条目。</li>
<li><strong>时间加权。</strong>优先选择近期经验。在超过已知的僵化阈值（通常与主要依赖版本的提升相关）后，退出条目。</li>
<li><strong>人工抽查。</strong>检索频率高的条目利用率也高。当其中一个出错时，它就会出错很多次，这也是人工审核回报最快的地方。</li>
</ul>
<p>仅靠 Milvus 无法解决这个问题，Mem0、Zep 或其他内存产品也是如此。你只需设计一次，就能确保一个池中有许多租户，并且跨租户泄漏为零。而保持内存池的准确性、新鲜度和实用性则是一项持续的操作符工作，任何数据库都无法做到这一点。</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">收获：Milvus 为 Anthropic 的托管代理添加了什么？<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 通过在会话中添加语义调用和跨代理共享内存，将托管代理从一个可靠但容易遗忘的平台转变为一个能够随着时间的推移不断累积经验的平台。</strong></p>
<p>Managed Agents 干净利落地回答了可靠性问题：大脑和双手都是牛，任何一个都可以在不带走任务的情况下死去。这就是基础设施问题，人类学很好地解决了这个问题。</p>
<p>保持开放的是增长。人类工程师会随着时间的推移不断改进；多年的工作会变成模式识别，他们不会在每项任务中都从第一原理出发进行推理。如今的托管 Agents 也是如此，因为每个会话都是从空白页开始的。</p>
<p>把会话连接到Milvus，以便在任务中进行语义调用，并把大脑中的经验汇集到共享向量 Collections 中，这才是让 Agents 能够真正使用的过去。插入 Milvus 是基础架构部分；修剪错误记忆、删除陈旧记忆和执行租户边界则是操作符部分。一旦这两方面都准备就绪，记忆的形状就不再是一种负担，而开始成为一种复合资本。</p>
<h2 id="Get-Started" class="common-anchor-header">开始使用<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li><strong>本地试用：</strong>使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> 启动一个嵌入式<a href="https://milvus.io/docs/milvus_lite.md">Milvus</a> 实例。无需 Docker，无需集群，只需<code translate="no">pip install pymilvus</code> 。当你需要时，生产工作负载可以升级到<a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone 或 Distributed</a>。</li>
<li><strong>阅读设计原理：</strong>Anthropic 的<a href="https://www.anthropic.com/engineering/managed-agents">托管 Agents 工程帖子</a>深入介绍了会话、线束和沙箱解耦。</li>
<li><strong>有问题？</strong>加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>社区，参与代理内存设计讨论，或预约<a href="https://milvus.io/office-hours">Milvus Office Hours</a>会议，了解您的工作量。</li>
<li><strong>更喜欢托管服务？</strong> <a href="https://cloud.zilliz.com/signup">注册 Zilliz Cloud</a>（或<a href="https://cloud.zilliz.com/login">登录</a>），获得内置分区 Key、扩展和多租户功能的托管 Milvus。新账户可在工作电子邮件上获得免费积分。</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常见问题<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>问：Anthropic 托管 Agents 中的会话和上下文窗口有什么区别？</strong></p>
<p>上下文窗口是单个 Claude 调用看到的一组短暂的标记。它是有边界的，每次调用模型都会重置。会话是整个任务中发生的所有事件的持久事件日志，只可追加，存储在线束之外。当线束崩溃时，<code translate="no">wake(sessionId)</code> 会生成一个新的线束，读取会话日志并恢复运行。会话是记录系统，上下文窗口是工作内存。会话不是上下文窗口。</p>
<p><strong>问：如何在克劳德会话中持久保存 Agents 内存？</strong></p>
<p>会话本身已经是持久的，<code translate="no">getSession(id)</code> 。通常缺少的是可查询的长期记忆。我们的模式是在<code translate="no">emitEvent</code> 时将高信号事件（决策、决议、策略）嵌入到类似 Milvus 的向量数据库中，然后在检索时通过语义相似性进行查询。这样，既能获得 Anthropic 提供的持久会话日志，又能获得用于回顾数百个步骤的语义调用层。</p>
<p><strong>问：多个 Claude Agents 能否共享内存？</strong></p>
<p>不可以。每个受管代理会话在设计上都是孤立的，因此可以横向扩展。要在 Agents 之间共享内存，可添加一个共享向量 Collections（例如在 Milvus 中），每个线束在启动时从中读取，在关闭时写入。使用 Milvus 的 Partition Key 功能隔离租户，这样客户 A 的代理内存就不会泄漏到客户 B 的会话中。</p>
<p><strong>问：什么是最适合人工智能 Agents 内存的向量数据库？</strong></p>
<p>诚实的回答取决于规模和部署形式。对于原型和小型工作负载，像 Milvus Lite 这样的本地嵌入式选项可在进程内运行，无需基础架构。对于跨多个租户的生产型 Agents，你需要的是具有成熟的多租户（Partition Key、过滤搜索）、混合搜索（向量 + 标量 + 关键字）和百万向量时毫秒级延迟的数据库。Milvus 专为这种规模的向量工作负载而设计，这也是它出现在基于 LangChain、Google ADK、Deep Agents 和 OpenAgents 构建的生产型代理内存系统中的原因。</p>
