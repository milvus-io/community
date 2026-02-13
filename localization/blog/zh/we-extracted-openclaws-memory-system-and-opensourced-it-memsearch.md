---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: 我们提取了 OpenClaw 的内存系统并将其开源（memsearch）
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  我们将 OpenClaw 的人工智能内存架构提取到 memsearch 中--这是一个独立的 Python 库，具有 Markdown 日志、混合向量搜索和
  Git 支持。
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a>（前身为 clawdbot 和 moltbot）正在病毒式传播--不到两周的时间里，<a href="https://github.com/openclaw/openclaw">GitHub 星级已超过 189k</a>。这太疯狂了。大部分热议都围绕着它在 iMessages、WhatsApp、Slack、Telegram 等日常聊天渠道中的自主代理功能。</p>
<p>但作为研究向量数据库系统的工程师，真正引起我们注意的是<strong>OpenClaw 的长期记忆方法</strong>。与大多数记忆系统不同，OpenClaw 让人工智能自动将每日日志写成 Markdown 文件。这些文件是真相的来源，模型只 "记住 "写入磁盘的内容。人类开发人员可以打开这些 Markdown 文件，直接对其进行编辑，提炼出长期原则，并准确查看人工智能在任何时候记住了什么。没有黑盒。老实说，这是我们见过的最简洁、对开发人员最友好的内存架构之一。</p>
<p>因此，我们自然而然地想到了一个问题：<strong><em>为什么这只能在 OpenClaw 内部使用？如果任何 Agents 都能拥有这样的内存呢？</em></strong>我们从 OpenClaw 中提取了完全相同的内存架构，并构建了<a href="https://github.com/zilliztech/memsearch">memsearch</a>- 一个独立的、即插即用的长期内存库，为任何 Agents 提供持久、透明、可由人工编辑的内存。无需依赖 OpenClaw 的其他部分。只需将其放入，您的 Agents 就能获得由 Milvus/Zilliz Cloud 提供搜索支持的持久内存，还能将 Markdown 日志作为真相的正统来源。</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo：</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a>（开源，MIT许可证）</p></li>
<li><p><strong>文档</strong> <a href="https://zilliztech.github.io/memsearch/">：https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>克劳德代码插件</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">：https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">OpenClaw内存的与众不同之处<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解 OpenClaw 内存架构之前，让我们先弄清楚两个概念：<strong>上下文</strong>和<strong>内存</strong>。这两个概念听起来很相似，但在实际工作中却大相径庭。</p>
<ul>
<li><p><strong>上下文</strong>是代理在单个请求中看到的所有内容--系统提示、项目级指导文件（如<code translate="no">AGENTS.md</code> 和<code translate="no">SOUL.md</code> ）、对话历史（消息、工具调用、压缩摘要）以及用户的当前消息。它只限于一个会话，而且相对紧凑。</p></li>
<li><p><strong>内存</strong>是跨会话持续存在的内容。它存在于本地磁盘中，包括过去对话的全部历史记录、代理处理过的文件以及用户偏好。未汇总。未压缩。原始内容。</p></li>
</ul>
<p>现在，OpenClaw 的设计决定使其与众不同：<strong>所有内存都以普通 Markdown 文件的形式存储在本地文件系统中。</strong>每次会话结束后，人工智能都会自动将更新内容写入这些 Markdown 日志。你和任何开发人员都可以打开、编辑、重组、删除或完善它们。与此同时，向量数据库与该系统并肩作战，创建并维护用于检索的索引。每当 Markdown 文件发生变化时，系统就会检测到变化并自动重新建立索引。</p>
<p>如果你用过 Mem0 或 Zep 这样的工具，你会立刻发现其中的不同。这些系统将记忆存储为 Embeddings，这是唯一的副本。你无法读取 Agents 的记忆。你无法通过编辑一行来修复糟糕的记忆。OpenClaw 的方法可以同时提供这两种功能：普通文件的透明度<strong>和</strong>使用向量数据库进行向量搜索的检索能力。你可以读取它、<code translate="no">git diff</code> 、grep--它只是文件。</p>
<p>唯一的缺点是什么？现在，这个 Markdown 优先的内存系统与整个 OpenClaw 生态系统--网关流程、平台连接器、工作区配置和消息传输基础架构--紧密相连。如果你只想要内存模型，那就需要拖入很多机器。</p>
<p>这正是我们构建<a href="http://github.com/zilliztech/memsearch"><strong>Memsearch</strong></a> 的原因：同样的理念--Markdown 作为真实来源、自动向量索引、完全由人工编辑--但它是一个轻量级的独立库，可以放入任何 Agents 架构中。</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Memsearch 如何工作<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>如前所述，<a href="https://github.com/zilliztech/memsearch">memsearch</a>是一个完全独立的长期内存库，它实现了与OpenClaw相同的内存架构，而无需使用OpenClaw堆栈的其他部分。您可以将其插入任何 Agents 框架（Claude、GPT、Llama、自定义 Agents、工作流引擎），并立即为您的系统提供持久、透明、人类可编辑的内存。</p>
<p>memsearch 中的所有 Agents 内存都以纯文本 Markdown 的形式存储在本地目录中。其结构非常简单，因此开发人员可以一目了然：</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch 使用<a href="https://milvus.io/"><strong>Milvus</strong></a>作为向量数据库，为这些 Markdown 文件编制索引，以便快速进行语义检索。但至关重要的是，向量索引<em>并不是</em>真相的来源，文件才是。如果完全删除 Milvus 索引，也不会<strong>有任何损失。</strong>Memsearch 只需重新嵌入并重新索引 Markdown 文件，在几分钟内就能重建完整的检索层。这意味着你的 Agents 内存是透明、持久和完全可重建的。</p>
<p>以下是 memsearch 的核心功能：</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">可读的 Markdown 使调试像编辑文件一样简单</h3><p>调试人工智能记忆通常很痛苦。当 Agents 得出错误答案时，大多数记忆系统都无法让你清楚地看到它到底存储了<em>什么</em>。典型的工作流程是编写自定义代码来查询内存 API，然后在不透明的 Embeddings 或冗长的 JSON blob 中进行筛选，而这两种方法都无法让你了解人工智能的真实内部状态。</p>
<p><strong>memsearch 解决了所有这些问题。</strong>所有内存都以纯 Markdown 的形式存在于 memory/ 文件夹中：</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>如果人工智能出了问题，修复它就像编辑文件一样简单。更新条目、保存，memsearch 就会自动重新索引更改内容。只需五秒。无需调用 API。无需工具。没有神秘感。你调试人工智能内存的方式与调试文档的方式相同--编辑文件。</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">Git 支持的内存意味着团队可以跟踪、审查和回滚变更</h3><p>生活在数据库中的人工智能内存很难进行协作。要想知道谁在什么时候修改了什么，就必须挖掘审计日志，而很多解决方案甚至不提供审计日志。变更发生得悄无声息，而关于人工智能应记住什么的分歧也没有明确的解决途径。团队最终只能依赖 Slack 消息和假设。</p>
<p>Memsearch 解决了这一问题，它只记忆 Markdown 文件，这意味着<strong>Git 会自动处理版本控制</strong>。一个命令就能显示整个历史记录：</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>现在，人工智能内存与代码一样参与工作流程。架构决策、配置更新和偏好更改都会显示在差异文件中，任何人都可以对其进行评论、批准或还原：</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">明文内存让迁移几乎不费吹灰之力</h3><p>迁移是内存框架最大的隐性成本之一。从一个工具迁移到另一个工具通常意味着导出数据、转换格式、重新导入，并希望字段能够兼容。这种工作很容易耗费半天时间，而且结果永远无法保证。</p>
<p>memsearch 完全避免了这个问题，因为内存是明文 Markdown。没有专有格式，没有需要翻译的 Schema，也没有需要迁移的东西：</p>
<ul>
<li><p><strong>切换机器：</strong> <code translate="no">rsync</code> 内存文件夹。完成。</p></li>
<li><p><strong>切换嵌入模型：</strong>重新运行索引命令。只需五分钟，markdown 文件保持不变。</p></li>
<li><p><strong>切换向量数据库部署：</strong>更改一个配置值。例如，从开发阶段的 Milvus Lite 切换到生产阶段的 Zilliz Cloud：</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>你的内存文件保持不变。它们周围的基础设施可以自由发展。这就是长期可移植性--人工智能系统中罕见的特性。</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">共享 Markdown 文件，让人类和代理共同撰写记忆文件</h3><p>在大多数记忆解决方案中，编辑人工智能记忆的内容需要根据 API 编写代码。这意味着只有开发人员才能维护人工智能记忆，而且即使是开发人员也很麻烦。</p>
<p>Memsearch 可以实现更自然的责任分工：</p>
<ul>
<li><p><strong>人工智能处理：</strong>自动每日日志 (<code translate="no">YYYY-MM-DD.md</code>) 包含执行细节，如 "已部署 v2.3.1，性能提升 12%"。</p></li>
<li><p><strong>人工智能处理</strong> <code translate="no">MEMORY.md</code> 中的长期原则，如 "团队堆栈：Python + FastAPI + PostgreSQL"。</p></li>
</ul>
<p>双方使用各自已经使用的工具编辑相同的 Markdown 文件。无需调用 API，无需特殊工具，无需看门人。当内存被锁定在数据库中时，这种共享作者身份是不可能的。</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">引擎盖下：memsearch 基于四个工作流运行，保持内存快速、新鲜和精简<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch 有四个核心工作流程：<strong>观察</strong>（监控）→<strong>索引</strong>（分块和嵌入）→<strong>搜索</strong>（检索）→<strong>压缩</strong>（汇总）。以下是每种方法的作用。</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1.观察：每次保存文件时自动重新索引</h3><p><strong>Watch</strong>工作流程监控内存/目录中的所有 Markdown 文件，并在文件修改和保存时触发重新索引。<strong>1500 毫秒</strong>的<strong>延时</strong>可确保在不浪费计算的情况下检测到更新：如果连续多次保存，定时器会重置，并在编辑稳定后才触发。</p>
<p>该延迟根据经验进行调整：</p>
<ul>
<li><p><strong>100 毫秒</strong>→ 太敏感；每次按键都触发，烧毁嵌入式调用</p></li>
<li><p><strong>10 秒</strong>→ 太慢；开发人员会注意到延迟</p></li>
<li><p><strong>1500ms</strong>→ 反应速度和资源效率的理想平衡点</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在实践中，这意味着开发人员可以在一个窗口中编写代码，在另一个窗口中编辑<code translate="no">MEMORY.md</code> ，添加 API 文档 URL 或更正过时的条目。保存文件后，下一次人工智能查询就会获取新的内存。无需重启，无需手动重新索引。</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2.索引：智能分块、重复数据删除和版本感知 Embeddings</h3><p>索引是性能关键的工作流程。它处理三件事：<strong>分块、重复数据删除和版本化分块 ID。</strong></p>
<p><strong>分块</strong>会沿着语义边界（标题和正文）分割文本，使相关内容保持在一起。这就避免了像 "Redis 配置 "这样的短语被分割到不同的块中。</p>
<p>例如，这个 Markdown：</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>变成了两个语块：</p>
<ul>
<li><p>块 1：<code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>2：<code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>重复数据消除</strong>使用每个分块的 SHA-256 哈希值来避免重复嵌入相同的文本。如果多个文件都提到了 "PostgreSQL 16"，嵌入 API 会被调用一次，而不是每个文件调用一次。对于 ~500KB 的文本，<strong>每月</strong>可节省约<strong> 0.15 美元。</strong>如果规模较大，则可节省数百美元。</p>
<p><strong>大块 ID 设计</strong>编码了了解大块是否过时所需的一切信息。格式为<code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code> 。<code translate="no">model_version</code> 字段是重要部分：当嵌入模型从<code translate="no">text-embedding-3-small</code> 升级到<code translate="no">text-embedding-3-large</code> 时，旧的嵌入就会失效。由于模型版本已嵌入到 ID 中，系统会自动识别哪些数据块需要重新嵌入。无需人工清理。</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3.搜索向量+BM25 混合检索，实现最高精确度</h3><p>检索采用混合搜索方法：向量搜索权重占 70%，BM25 关键字搜索权重占 30%。这平衡了在实践中经常出现的两种不同需求。</p>
<ul>
<li><p><strong>向量搜索</strong>处理语义匹配。对 "Redis 缓存配置 "的查询会返回一个包含 "Redis L1 缓存，5 分钟 TTL "的块，即使措辞不同。当开发人员记得概念但不记得确切措辞时，这就很有用了。</p></li>
<li><p><strong>BM25</strong>处理精确匹配。查询 "PostgreSQL 16 "不会返回有关 "PostgreSQL 15 "的结果。这对错误代码、函数名称和特定版本的行为很重要，在这些情况下，接近是不够好的。</p></li>
</ul>
<p>默认的 70/30 分法在大多数情况下都很有效。对于偏重精确匹配的工作流，只需更改一行配置就能将 BM25 权重提高到 50%。</p>
<p>结果以 top-K 块（默认为 3）的形式返回，每块截断为 200 个字符。需要完整内容时，<code translate="no">memsearch expand &lt;chunk_hash&gt;</code> 。这种循序渐进的披露方式可在不影响访问细节的情况下，减少 LLM 上下文窗口的使用量。</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4.紧凑：总结历史内存，保持上下文整洁</h3><p>累积的内存最终会成为一个问题。旧条目会填满上下文窗口，增加令牌成本，并增加噪音，从而降低答案质量。为了解决这个问题，Compact 调用 LLM 将历史记忆总结为浓缩形式，然后删除或归档原始内容。它可以手动触发，也可以计划定期运行。</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">如何开始使用 memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch 提供<strong>Python API</strong>和<strong>CLI</strong>，因此你可以在 Agents 框架内使用它，也可以将其作为独立的调试工具。设置非常简单，系统的设计使本地开发环境和生产部署看起来几乎一样。</p>
<p>Memsearch 支持三种与 Milvus 兼容的后端，所有后端都通过<strong>相同的 API</strong> 公开：</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite（默认）</strong></a><strong>：</strong>本地<code translate="no">.db</code> 文件，零配置，适合个人使用。</p></li>
<li><p><strong>Milvus Standalone / Cluster：</strong>自托管，支持多个 Agents 共享数据，适合团队环境。</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>：</strong>全面管理，具有自动扩展、备份、高可用性和隔离功能。是生产工作负载的理想选择。</p></li>
</ul>
<p>从本地开发切换到生产环境通常<strong>只需更改一行配置</strong>。您的代码保持不变。</p>
<h3 id="Install" class="common-anchor-header">安装</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch 还支持多个嵌入提供商，包括 OpenAI、Google、Voyage、Ollama 和本地模型。这能确保你的内存架构保持可移植性和与供应商无关性。</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">方案 1：Python API（集成到 Agents 框架中）</h3><p>下面是一个使用 memsearch 的完整 Agents 循环的最小示例。您可以根据需要复制/粘贴和修改：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>这显示的是核心循环：</p>
<ul>
<li><p><strong>回顾</strong>：memsearch 执行混合向量 + BM25 检索</p></li>
<li><p><strong>思考</strong>：您的 LLM 处理用户输入+检索内存</p></li>
<li><p><strong>记住</strong>：Agent 向 Markdown 写入新内存，而 memsearch 更新其索引</p></li>
</ul>
<p>这种模式可以很自然地融入任何 Agents 系统--LangChain、AutoGPT、语义路由器、LangGraph 或自定义 Agents 循环。它的设计与框架无关。</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">操作符 2：CLI（快速操作，利于调试）</h3><p>CLI 是独立工作流、快速检查或在开发过程中检查内存的理想选择：</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>CLI 反映了 Python API 的功能，但无需编写任何代码，非常适合调试、检查、迁移或验证内存文件夹结构。</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">memsearch 与其他内存解决方案的比较<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>开发人员最常问的问题是，既然已经有了成熟的选择，为什么还要使用 memsearch？简短的回答是：memsearch 以时态知识图谱等高级功能换取透明度、可移植性和简单性。对于大多数 Agents 内存使用案例来说，这是正确的选择。</p>
<table>
<thead>
<tr><th>解决方案</th><th>优势</th><th>局限性</th><th>最适合</th></tr>
</thead>
<tbody>
<tr><td>内存搜索</td><td>透明的明文内存、人类与人工智能共同创作、零迁移摩擦、易于调试、Git-native</td><td>没有内置时序图或复杂的多 Agents 内存结构</td><td>重视长期内存的控制、简单性和可移植性的团队</td></tr>
<tr><td>Mem0</td><td>完全托管，无需运行或维护基础架构</td><td>不透明--无法检查或手动编辑内存；嵌入是唯一的表示方法</td><td>希望获得放手式管理服务、可视性较低的团队</td></tr>
<tr><td>Zep</td><td>丰富的功能集：时态记忆、多角色模型、复杂的知识图谱</td><td>架构庞大；活动部件较多；学习和操作难度较大</td><td>真正需要高级记忆结构或时间感知推理的 Agents</td></tr>
<tr><td>LangMem / Letta</td><td>在各自生态系统内进行深度无缝集成</td><td>框架锁定；难以移植到其他 Agents 堆栈中</td><td>团队已致力于这些特定框架</td></tr>
</tbody>
</table>
<h2 id="Start-Using-memsearch-and-Join-the-Project" class="common-anchor-header">开始使用 memsearch 并加入项目<button data-href="#Start-Using-memsearch-and-Join-the-Project" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch 在 MIT 许可下完全开源，其资源库已准备就绪，可立即用于生产实验。</p>
<ul>
<li><p><strong>Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>文档：</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>如果你正在构建一个需要跨会话记忆的 Agents，并希望完全控制其记忆内容，那么 memsearch 值得一试。该库只需安装到<code translate="no">pip install</code> ，即可与任何代理框架配合使用，并将所有内容存储为 Markdown 格式，您可以阅读、编辑并使用 Git 进行版本控制。</p>
<p>我们正在积极开发 memsearch，欢迎社区提供意见。</p>
<ul>
<li><p>如果有问题，请提交问题。</p></li>
<li><p>如果你想扩展该库，请提交 PR。</p></li>
<li><p>如果你对 "Markdown-as-source-of-truth "的理念有共鸣，请在软件仓库中加入 "明星"。</p></li>
</ul>
<p>OpenClaw 的内存系统不再锁定在 OpenClaw 内部。现在，任何人都可以使用它。</p>
<h2 id="Keep-Reading" class="common-anchor-header">继续阅读<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">什么是 OpenClaw？开源人工智能代理完全指南</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 教程：为本地人工智能助理连接到 Slack</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">用LangGraph和Milvus构建爪机式人工智能代理</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG 与长运行代理：RAG 过时了吗？</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">为 Milvus 创建自定义人类技能，快速启动 RAG</a></p></li>
</ul>
