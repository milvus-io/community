---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: OpenClaw 等人工智能代理为何烧光代币以及如何降低成本
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  为什么 OpenClaw 和其他人工智能 Agents 的令牌账单会激增，以及如何用 BM25 + 向量检索（index1、QMD、Milvus）和
  Markdown 优先记忆（memsearch）来解决这个问题。
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<custom-h1>为什么 OpenClaw 等人工智能代理会烧光代币以及如何降低成本</custom-h1><p>如果你用过<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a>（前身为 Clawdbot 和 Moltbot），你就已经知道这个人工智能代理有多棒了。它速度快、本地化、灵活，能够在 Slack、Discord、你的代码库以及你所连接的任何其他设备上完成令人惊讶的复杂工作流。但是，一旦你开始认真使用它，很快就会发现一个规律：<strong>你的令牌使用量开始攀升。</strong></p>
<p>这不是 OpenClaw 的错，而是当今大多数人工智能 Agents 的行为方式。几乎所有事情都会触发 LLM 调用：查找文件、计划任务、撰写笔记、执行工具或提出后续问题。由于代币是这些调用的通用货币，因此每项操作都有成本。</p>
<p>要了解这种成本的来源，我们需要深入了解两个主要贡献者：</p>
<ul>
<li><strong>搜索：</strong>构造不佳的搜索会拉入庞大的上下文有效载荷--整个文件、日志、消息和代码区域，而这些都是模型实际上并不需要的。</li>
<li><strong>内存：</strong>存储不重要的信息会迫使代理在未来的调用中重新阅读和处理这些信息，从而使令牌的使用量随着时间的推移不断增加。</li>
</ul>
<p>这两个问题都无声无息地增加了操作成本，却没有提高能力。</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">OpenClaw 等人工智能代理如何实际执行搜索--以及为什么会消耗令牌<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>当 Agents 需要从代码库或文档库中获取信息时，通常会在整个项目范围内<strong>按 Ctrl+F 键</strong>。每一行匹配的信息都会被返回--未排序、未过滤、未优先处理。克劳德代码通过基于 ripgrep 的专用 Grep 工具来实现这一点。OpenClaw 没有内置的代码库搜索工具，但它的执行工具可以让底层模型运行任何命令，加载的技能可以引导代理使用 rg 等工具。在这两种情况下，代码库搜索都会返回未排序和未过滤的关键字匹配结果。</p>
<p>这种粗暴的方法在小型项目中效果不错。但随着资源库的增加，代价也会增加。无关的匹配会堆积到 LLM 的上下文窗口中，迫使模型读取和处理成千上万实际上并不需要的标记。一次非范围搜索可能会拖入完整的文件、巨大的注释块或共享一个关键字但不共享底层意图的日志。在长时间的调试或研究过程中重复这种模式，臃肿就会迅速增加。</p>
<p>OpenClaw 和 Claude Code 都尝试管理这种增长。OpenClaw 会修剪过大的工具输出并压缩较长的对话历史，而 Claude Code 则会限制文件读取输出并支持上下文压缩。这些缓解措施发挥了作用，但只是在臃肿的查询已经执行之后。未排序的搜索结果仍在消耗代币，而你仍在为它们付费。上下文管理帮助的是未来的转向，而不是产生浪费的原始调用。</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">人工智能 Agents 内存是如何工作的，为什么也会消耗代币<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>搜索并不是代币开销的唯一来源。Agents 从内存中调用的每一条上下文都必须加载到 LLM 的上下文窗口中，这也需要消耗令牌。</p>
<p>目前大多数 Agents 依赖的 LLM API 都是无状态的：Anthropic 的 "消息 "应用程序接口（Messages API）每次请求都需要完整的对话历史记录，OpenAI 的 "聊天完成 "应用程序接口（Chat Completions API）也是如此。即使是 OpenAI 较新的有状态响应 API（可在服务器端管理对话状态），每次调用也仍然需要完整的上下文窗口。无论内存是如何加载到上下文中的，都需要花费令牌。</p>
<p>为了解决这个问题，Agent 框架会将注释写入磁盘上的文件，并在 Agent 需要时将相关注释加载回上下文窗口。例如，OpenClaw 将策划好的笔记存储在 MEMORY.md 中，并将每日日志附加到带有时间戳的 Markdown 文件中，然后使用混合 BM25 和向量搜索对其进行索引，这样代理就能按需调用相关上下文。</p>
<p>OpenClaw 的内存设计运行良好，但它需要完整的 OpenClaw 生态系统：网关进程、消息平台连接以及堆栈的其他部分。Claude Code 的内存也是如此，它与 CLI 相连。如果要在这些平台之外构建自定义 Agents，则需要独立的解决方案。下一节将介绍解决这两个问题的工具。</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">如何阻止OpenClaw消耗令牌<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>如果你想减少OpenClaw消耗的令牌数量，可以使用两个杠杆。</p>
<ul>
<li>首先是<strong>更好地检索</strong>--用相关性驱动的排序搜索工具取代grep式的关键词转储，这样模型只能看到真正重要的信息。</li>
<li>其次是<strong>更好的</strong>存储--从不透明性、依赖框架的存储转变为可以理解、检查和控制的存储。</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">用更好的检索取代 grep：index1、QMD 和 Milvus</h3><p>许多人工智能编码 Agents 使用 grep 或 ripgrep 搜索代码库。Claude Code 有一个基于 ripgrep 的专用 Grep 工具。OpenClaw 没有内置的代码库搜索工具，但它的执行工具可以让底层模型运行任何命令，并且可以加载 ripgrep 或 QMD 等技能来指导 Agents 如何搜索。如果没有以检索为重点的技能，Agent 就会依赖底层模型选择的任何方法。不同的 Agents 面临的核心问题是一样的：如果没有分级检索，关键词匹配就会未经过滤地进入上下文窗口。</p>
<p>当项目规模较小，每个匹配词都能轻松进入上下文窗口时，这种方法就会奏效。当代码库或文档库增长到一个关键字会返回几十或几百个匹配结果，而 Agents 必须将所有匹配结果加载到提示中时，问题就来了。在这种规模下，你需要的是按相关性排序的结果，而不仅仅是按匹配度过滤的结果。</p>
<p>标准的解决方案是混合搜索，它结合了两种互补的排名方法：</p>
<ul>
<li>BM25 根据某个术语在给定文档中出现的频率和唯一性对每个结果进行评分。一个重点突出的文件，如果提到 "身份验证 "15 次，其排名就会高于只提到一次的庞杂文件。</li>
<li>向量搜索将文本转换为表示含义的数字，因此 "身份验证 "可以与 "登录流程 "或 "会话管理 "匹配，即使它们没有共享的关键词。</li>
</ul>
<p>单靠这两种方法都不够：BM25 会遗漏转述术语，而向量搜索会遗漏精确术语，如错误代码。将这两种方法结合起来，并通过融合算法合并排序列表，就能弥补这两方面的不足。</p>
<p>下面的工具以不同的规模实现了这种模式。index1、QMD 和 Milvus 分别增加了混合搜索功能，其容量也在不断增加。</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1：单机快速混合搜索</h4><p><a href="https://github.com/gladego/index1">index1</a>是一款 CLI 工具，可将混合搜索打包到单个 SQLite 数据库文件中。FTS5 处理 BM25，sqlite-vec 处理向量相似性，RRF 融合排序列表。Embeddings 由 Ollama 本地生成，因此不会离开你的机器。</p>
<p>index1 按结构而非行数对代码进行分块：Markdown 文件按标题分割，Python 文件按 AST 分割，JavaScript 和 TypeScript 按 regex 模式分割。这意味着搜索结果会返回连贯的单元，如一个完整的函数或一个完整的文档部分，而不是中途截断的任意行范围。混合查询的响应时间为 40 到 180 毫秒。如果没有 Ollama，则会退回到 BM25-only，它仍然会对结果进行排序，而不是将每个匹配结果都转入上下文窗口。</p>
<p>index1 还包含一个事件记忆模块，用于存储经验教训、错误根源和架构决策。这些记忆与代码索引位于同一个 SQLite 数据库中，而不是独立的文件。</p>
<p>注：index1 是一个早期项目（截至 2026 年 2 月，0 星级，4 次提交）。在提交之前，请根据自己的代码库进行评估。</p>
<ul>
<li><strong>最适合</strong>：单人开发者或小型团队，其代码库可在一台机器上运行，并希望快速改进 grep。</li>
<li><strong>当</strong>您需要多用户访问同一索引，或您的数据超出了单个 SQLite 文件可轻松处理的范围<strong>时</strong>，<strong>它</strong>就会过时。</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD：通过本地 LLM 重新排序提高准确性</h4><p>由 Shopify 创始人托比-吕特克（Tobi Lütke）创建的<a href="https://github.com/tobi/qmd">QMD</a>（查询标记文档）增加了第三个阶段：LLM 重新排序。在 BM25 和向量搜索各自返回候选结果后，本地语言模型会重新读取排名靠前的结果，并根据与您查询的实际相关性重新排序。这样就能捕捉到关键字和语义匹配都返回可信但错误结果的情况。</p>
<p>QMD 完全在您的机器上运行，使用三个 GGUF 模型，总计约 2GB：一个嵌入模型（embeddinggemma-300M）、一个交叉编码器 Reranker（Qwen3-Reranker-0.6B）和一个查询扩展模型（qmd-query-expansion-1.7B）。首次运行时，三者都会自动下载。无需调用云 API，也无需 API 密钥。</p>
<p>代价是冷启动时间：从磁盘加载三个模型大约需要 15 到 16 秒。QMD 支持持久服务器模式（qmd mcp），可在两次请求之间将模型保存在内存中，从而消除了重复查询所带来的冷启动惩罚。</p>
<ul>
<li><strong>最适合：</strong>对隐私至关重要的环境，在这种环境中，任何数据都不能离开你的机器，检索的准确性比响应时间更重要。</li>
<li><strong>当</strong>您需要亚秒级响应、共享团队访问或数据集超过单机容量<strong>时，请淘汰它</strong>。</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus：团队和企业规模的混合搜索</h4><p>上述单机工具对于单个开发人员来说效果很好，但当多人或 Agents 需要访问同一个知识库时，这些工具就会受到限制。<a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a>是专为下一阶段设计的开源向量数据库：分布式、多用户，能够处理数十亿个向量。</p>
<p>针对这种使用情况，它的关键功能是内置 Sparse-BM25，从 Milvus 2.5 版开始使用，在 2.6 版中速度明显加快。你只需提供原始文本，Milvus 就会在内部使用基于 tantivy 的分析器对其进行标记，然后将结果转换为稀疏向量，并在索引时预先计算和存储。</p>
<p>由于 BM25 表示法已经存储，因此检索时无需重新计算分数。这些稀疏向量与密集向量（语义嵌入）并存于同一个 Collections 中。在查询时，你可以用 RRFRanker 等排序器来融合这两种信号，Milvus 开箱即提供了这种排序器。与 index1 和 QMD 的混合搜索模式相同，但运行在可横向扩展的基础架构上。</p>
<p>Milvus 还提供了单机工具无法提供的功能：多租户隔离（每个团队拥有独立的数据库或 Collections）、具有自动故障转移功能的数据复制，以及可实现高成本效益存储的热/冷数据分层。对于 Agents 而言，这意味着多个开发人员或多个 Agents 实例可以并发查询同一个知识库，而不会踩到对方的数据。</p>
<ul>
<li><strong>最适合</strong>：多个开发人员或 Agents 共享一个知识库、大型或快速增长的文档集，或需要复制、故障转移和访问控制的生产环境。</li>
</ul>
<p>总结</p>
<table>
<thead>
<tr><th>工具</th><th>阶段</th><th>部署</th><th>迁移信号</th></tr>
</thead>
<tbody>
<tr><td>克劳德本地 Grep</td><td>原型开发</td><td>内置，零设置</td><td>账单攀升或查询速度减慢</td></tr>
<tr><td>索引1</td><td>单机（速度）</td><td>本地 SQLite + Ollama</td><td>需要多用户访问或数据超出一台机器的容量</td></tr>
<tr><td>QMD</td><td>单机（精度）</td><td>三个本地 GGUF 模型</td><td>需要团队共享索引</td></tr>
<tr><td>Milvus</td><td>团队或生产</td><td>分布式集群</td><td>大型文档集或多租户需求</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">通过 memsearch 为人工智能 Agents 提供持久、可编辑的内存，降低其令牌成本</h3><p>搜索优化可减少每次查询的令牌浪费，但对 Agents 在会话之间保留的内容却毫无帮助。</p>
<p>Agents 从内存中调用的每一条上下文都必须加载到提示符中，这也会消耗令牌。问题不在于是否存储内存，而在于如何存储。存储方法决定了你是否能看到代理所记忆的内容，是否能在出错时修复它，以及是否能在更换工具时带走它。</p>
<p>大多数框架在这三个方面都不合格。Mem0 和 Zep 将所有内容都存储在一个向量数据库中，这对检索有效，但却使内存：</p>
<ul>
<li><strong>不透明。</strong>如果不查询 API，你就无法看到 Agents 记住了什么。</li>
<li><strong>难以编辑。</strong>修改或删除内存需要调用 API，而不是打开文件。</li>
<li><strong>锁定。</strong>切换框架意味着导出、转换和重新导入数据。</li>
</ul>
<p>OpenClaw采用了不同的方法。所有内存都保存在磁盘上的纯 Markdown 文件中。Agents 会自动写入每日日志，人类可以直接打开和编辑任何内存文件。这就解决了所有三个问题：内存具有可读性、可编辑性和可移植性。</p>
<p>代价是部署开销。运行OpenClaw内存意味着运行整个OpenClaw生态系统：网关进程、消息平台连接以及堆栈的其他部分。对于已经使用OpenClaw的团队来说，这没什么问题。<strong>memsearch</strong>的建立就是为了弥补这一缺陷：它将OpenClaw的Markdown-first内存模式提取为一个独立的库，可以与任何Agent一起使用。</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearch</a></strong>由Zilliz（Milvus背后的团队）创建，将Markdown文件视为唯一的真相来源。MEMORY.md 保存了你手写的长期事实和决策。每日日志（2026-02-26.md）由会话摘要自动生成。存储在 Milvus 中的向量索引是一个派生层，可以随时从 Markdown 中重建。</p>
<p>实际上，这意味着你可以用文本编辑器打开任何内存文件，准确读取 Agents 所知道的内容，并对其进行修改。保存文件后，memsearch 的文件监视器会检测到更改并自动重新索引。你可以用 Git 管理记忆库，通过拉取请求审查人工智能生成的记忆库，或者通过复制文件夹移动到新的机器上。如果 Milvus 索引丢失，你可以从文件中重建索引。文件永远不会有风险。</p>
<p>在引擎盖下，memsearch 采用了与上述相同的混合搜索模式：按标题结构和段落边界分割的块，BM25 + 向量检索，以及一个由 LLM 驱动的紧凑型命令，当日志变大时，该命令会汇总旧的记忆。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最适合：希望完全了解 Agents 记忆内容、需要对记忆进行版本控制，或者希望记忆系统不被任何单一代理框架锁定的团队。</p>
<p>总结</p>
<table>
<thead>
<tr><th>能力</th><th>Mem0 / Zep</th><th>内存搜索</th></tr>
</thead>
<tbody>
<tr><td>真相来源</td><td>向量数据库（唯一数据源）</td><td>Markdown 文件（主要）+ Milvus（索引）</td></tr>
<tr><td>透明度</td><td>黑盒，需要 API 才能检查</td><td>打开任何 .md 文件即可读取</td></tr>
<tr><td>可编辑性</td><td>通过 API 调用进行修改</td><td>直接在任何文本编辑器中编辑，自动重新索引</td></tr>
<tr><td>版本控制</td><td>需要单独的审计日志</td><td>Git 可本地运行</td></tr>
<tr><td>迁移成本</td><td>导出 → 转换格式 → 重新导入</td><td>复制 Markdown 文件夹</td></tr>
<tr><td>人机协作</td><td>人工智能编写，人类观察</td><td>人类可以编辑、补充和审核</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">哪种设置适合您的规模<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>场景</th><th>搜索</th><th>记忆</th><th>何时继续</th></tr>
</thead>
<tbody>
<tr><td>早期原型</td><td>Grep（内置）</td><td>-</td><td>账单攀升或查询速度减慢</td></tr>
<tr><td>单个开发人员，仅搜索</td><td><a href="https://github.com/gladego/index1">index1</a>（速度）或<a href="https://github.com/tobi/qmd">QMD</a>（准确性）</td><td>-</td><td>需要多用户访问或数据超出一台机器的使用范围</td></tr>
<tr><td>单个开发人员，同时使用</td><td><a href="https://github.com/gladego/index1">索引 1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>需要多用户访问或数据超出一台机器的范围</td></tr>
<tr><td>团队或生产，都需要</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>快速集成，仅内存</td><td>-</td><td>Mem0 或 Zep</td><td>需要检查、编辑或迁移内存</td></tr>
</tbody>
</table>
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
    </button></h2><p>始终在线的人工智能 Agents 带来的代币成本并非不可避免。本指南介绍了更好的工具可以减少浪费的两个领域：搜索和内存。</p>
<p><a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a>和<a href="https://github.com/tobi/qmd"></a> QMD 将 BM25 关键字评分与向量搜索相结合，只返回最相关的结果，从而在单机上解决了这一问题。对于团队、多 Agents 设置或生产工作负载，<a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a>在可水平扩展的基础架构上提供了相同的混合搜索模式。</p>
<p>在<a href="https://github.com/zilliztech/memsearch">内存</a>方面，大多数框架都将所有内容存储在向量数据库中：不透明、难以手工编辑，并且锁定在创建它的框架中。内存保存在普通的 Markdown 文件中，你可以读取、编辑并使用 Git 进行版本控制。Milvus 作为一个派生索引，可以随时从这些文件中重建。你可以随时控制 Agents 所知道的内容。</p>
<p><a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a>和<a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus</a>都是开源的。我们正在积极开发 memsearch，并希望在生产中运行它的用户提供反馈。打开一个问题，提交一份报告，或者告诉我们哪些是可行的，哪些是不可行的。</p>
<p>本指南中提到的项目：</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>：人工智能 Agents 的 Markdown 优先内存，由 Milvus 提供支持。</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>：用于可扩展混合搜索的开源向量数据库。</li>
<li><a href="https://github.com/gladego/index1">index1</a>：用于 AI 编码代理的 BM25 + 向量混合搜索。</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>：使用 LLM 重新排序的本地混合搜索。</li>
</ul>
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我们提取并开源了 OpenClaw 的内存系统（memsearch）</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">克劳德代码的持久内存：memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">什么是 OpenClaw？开源人工智能代理完全指南</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 教程：为本地人工智能助手连接到 Slack</a></li>
</ul>
