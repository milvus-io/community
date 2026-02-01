---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: 现在，像 Claude Cowork 这样的长线 Agents 正在崛起，RAG 是否已经过时？
author: Min Yin
date: 2026-1-27
desc: 深入分析克劳德-考沃克（Claude Cowork）的长期记忆、可写代理记忆、RAG 权衡，以及为什么向量数据库仍然重要。
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">Claude Cowork</a>是 Claude Desktop 应用程序中的一项新 Agents 功能。从开发者的角度来看，它基本上是一个包裹在模型周围的自动任务运行程序：它可以读取、修改和生成本地文件，还可以规划多步骤任务，而无需手动提示每一步。你可以把它想象成克劳德代码背后的那个循环，只不过是暴露在桌面上，而不是终端上。</p>
<p>Cowork 的关键能力在于它能长时间运行而不丢失状态。它不会遇到通常的对话超时或上下文重置。它可以继续工作，跟踪中间结果，并在不同会话中重复使用以前的信息。这给人一种 "长期记忆 "的感觉，尽管其基本机制更像是持久任务状态+上下文延续。无论如何，这种体验都不同于传统的聊天模型，在传统的聊天模型中，除非建立自己的记忆层，否则一切都会重置。</p>
<p>这给开发人员带来了两个实际问题：</p>
<ol>
<li><p><strong>如果模型已经可以记忆过去的信息，那么 RAG 或代理 RAG 还能在哪里发挥作用？RAG 是否会被取代？</strong></p></li>
<li><p><strong>如果我们想要一个本地的、Cowork 式的 Agents，我们该如何自己实现长期记忆？</strong></p></li>
</ol>
<p>本文其余部分将详细讨论这些问题，并解释向量数据库如何融入这一新的 "模型记忆 "版图。</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork 与 RAG：区别何在？<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>正如我之前提到的，Claude Cowork 是 Claude Desktop 中的一种代理模式，它可以读写本地文件，将任务分解成更小的步骤，并在不丢失状态的情况下继续工作。它能保持自己的工作环境，因此多小时的任务不会像普通聊天会话那样重置。</p>
<p><strong>RAG</strong>（检索-增强生成）解决的是另一个问题：让模型访问外部知识。您将数据索引到一个向量数据库中，为每次查询检索相关的大块数据，然后将它们输入到模型中。它之所以被广泛使用，是因为它为 LLM 应用程序提供了一种 "长期记忆 "形式，可用于文档、日志、产品数据等。</p>
<p>如果这两种系统都能帮助模型 "记忆"，那么它们之间到底有什么区别呢？</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">Cowork 如何处理内存</h3><p>Cowork 的内存是读写式的。Agents 会决定当前任务或对话中哪些信息是相关的，并将其存储为记忆条目，之后随着任务的进展进行检索。这样，Cowork 就能在长期运行的工作流中保持连续性，尤其是那些在运行过程中会产生新的中间状态的工作流。</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">RAG 和 Agents RAG 如何处理内存</h3><p>标准的 RAG 是查询驱动型检索：用户提出问题，系统获取相关文档，然后模型使用这些文档进行回答。检索语料库保持稳定和版本化，开发人员可以准确控制进入语料库的内容。</p>
<p>现代 Agents RAG 扩展了这种模式。该模型可以决定何时检索信息、检索什么以及在规划或执行工作流期间如何使用这些信息。这些系统可以运行长任务并调用工具，类似于 Cowork。但即使是 Agents RAG，检索层仍然是以知识为导向，而不是以状态为导向。Agents 只检索权威事实，而不会将其不断变化的任务状态写回语料库。</p>
<p>换个角度看问题：</p>
<ul>
<li><p><strong>Cowork 的记忆是任务驱动的：</strong>代理会写入并读取自己不断变化的状态。</p></li>
<li><p><strong>而 RAG 是知识驱动型的：</strong>系统会检索模型应该依赖的既定信息。</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">反向工程克劳德-科沃克（Claude Cowork）：如何建立长期运行的 Agents 记忆<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>克劳德-科沃克（Claude Cowork）之所以受到热捧，是因为它在处理多步骤任务时不会经常忘记自己在做什么。从开发者的角度来看，我很想知道<strong>它是如何在如此长的会话中保持状态的？</strong>Anthropic 还没有公布内部结构，但根据早前对克劳德记忆模块的开发实验，我们可以拼凑出一个像样的心理模型。</p>
<p>克劳德似乎依赖于一种混合设置：<strong>持久的长期记忆层加上按需检索工具。</strong>克劳德不会在每次请求中都塞入完整的对话内容，而是在认为相关时才有选择性地调入过去的上下文。这样，该模型就能保持较高的准确性，而不会每次都耗尽令牌。</p>
<p>如果对请求结构进行细分，它大致是这样的：</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>有趣的行为不是结构本身，而是模型如何决定更新内容和何时运行检索。</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">用户内存：持久层</h3><p>Claude 保存了一个随时间更新的长期记忆库。与 ChatGPT 更可预测的内存系统不同，克劳德的内存系统感觉更 "活 "一些。它将记忆存储在类似 XML 的块中，并通过两种方式进行更新：</p>
<ul>
<li><p><strong>隐式更新：</strong>有时，模型会认为某些东西是稳定的偏好或事实，并悄悄地将其写入内存。这些更新并不是瞬时的；它们会在几个回合后显示出来，而且如果相关对话消失，旧的记忆也会逐渐消失。</p></li>
<li><p><strong>明确更新：</strong>用户可以使用<code translate="no">memory_user_edits</code> 工具直接修改记忆（"记住 X"、"忘记 Y"）。这些写入是即时的，行为更像 CRUD 操作。</p></li>
</ul>
<p>Claude 正在后台运行启发式方法，以决定哪些内容值得持久化，而不是等待明确的指令。</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">对话检索：按需部分</h3><p>克劳德<em>不像</em>许多 LLM 系统那样保存滚动摘要。相反，它有一个检索函数工具箱，只要认为缺少上下文，就可以调用。这些检索调用并不是每次都会发生--模型会根据自己的内部判断来触发它们。</p>
<p>其中最突出的是<code translate="no">conversation_search</code> 。当用户说出 "上个月的那个项目 "这样含糊不清的话时，克劳德就会经常调用这个工具来挖掘相关内容。值得注意的是，当措辞含糊不清或使用不同语言时，它仍能发挥作用。这显然意味着</p>
<ul>
<li><p>某种语义匹配（Embeddings）</p></li>
<li><p>可能与规范化或轻量级翻译相结合</p></li>
<li><p>为提高精确度而加入关键词搜索</p></li>
</ul>
<p>从根本上说，这看起来很像一个捆绑在模型工具集中的微型 RAG 系统。</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">克劳德的检索行为与基本历史缓冲区有何不同</h3><p>从测试和日志来看，有几种模式比较突出：</p>
<ul>
<li><p><strong>检索不是自动的。</strong>模型会选择何时调用。如果它认为已经有了足够的上下文，它甚至不会去打扰。</p></li>
<li><p><strong>检索到的</strong> <strong>信息</strong><strong>块</strong> <em>既</em><strong>包括</strong> <strong>用户信息，也</strong><strong>包括</strong> <strong>助手信息。</strong>这很有用，因为它比只包含用户信息的摘要能保留更多细微差别。</p></li>
<li><p><strong>令牌使用保持正常。</strong>由于历史记录不是每次都会注入，因此长时间的会话不会出现不可预知的膨胀。</p></li>
</ul>
<p>总的来说，它给人的感觉就像一个检索增强型 LLM，只不过检索是模型自身推理循环的一部分。</p>
<p>这种架构很聪明，但并不自由：</p>
<ul>
<li><p>检索增加了延迟和更多的 "移动部件"（索引、排序、重新排序）。</p></li>
<li><p>模型偶尔会误判是否需要上下文，这意味着即使数据可用，你<em>也</em>会看到典型的 "LLM 遗忘"。</p></li>
<li><p>调试变得更加棘手，因为模型行为依赖于不可见的工具触发，而不仅仅是提示输入。</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">克劳德 Cowork 与克劳德 Codex 在处理长期记忆方面的对比</h3><p>与克劳德重检索的设置相比，ChatGPT 处理记忆的方式更加结构化和可预测。ChatGPT 不做语义查找，也不把旧对话当作迷你向量存储，而是通过以下分层组件将记忆直接注入每个会话：</p>
<ul>
<li><p>用户内存</p></li>
<li><p>会话元数据</p></li>
<li><p>当前会话信息</p></li>
</ul>
<p><strong>用户内存</strong></p>
<p>用户记忆是主要的长期存储层--跨会话持续存在的部分，用户可以对其进行编辑。它存储的内容非常标准：姓名、背景、正在进行的项目、学习偏好等。每次新对话都会在开始时注入这个区块，因此模型总是以一致的用户视图开始。</p>
<p>ChatGPT 通过两种方式更新这一层：</p>
<ul>
<li><p><strong>显式更新：</strong>用户可以告诉模型 "记住这个 "或 "忘记那个"，这样内存就会立即发生变化。这基本上是模型通过自然语言公开的 CRUD API。</p></li>
<li><p><strong>隐式更新：</strong>如果模型发现了符合 OpenAI 长期记忆规则的信息，比如工作职位或偏好，而用户又没有禁用记忆功能，那么它就会自己悄悄地添加这些信息。</p></li>
</ul>
<p>从开发人员的角度来看，这一层非常简单、确定，而且易于推理。不需要 Embeddings 查找，也不需要启发式获取。</p>
<p><strong>会话元数据</strong></p>
<p>会话元数据与之截然相反。它会话元数据是短暂的、非持久的，而且只在会话开始时注入一次。可以将其视为会话的环境变量。其中包括以下内容</p>
<ul>
<li><p>您使用的设备</p></li>
<li><p>账户/订阅状态</p></li>
<li><p>粗略的使用模式（活跃天数、模型分布、平均会话长度）</p></li>
</ul>
<p>这些元数据可以帮助模型根据当前环境塑造回复，例如，在移动设备上编写更简短的答案，而不会污染长期记忆。</p>
<p><strong>当前会话信息</strong></p>
<p>这是标准的滑动窗口历史记录：当前会话中的所有信息，直到达到标记限制为止。当窗口过大时，较旧的信息会自动删除。</p>
<p>最重要的是，这种删除<strong>不会</strong>影响用户记忆或跨会话摘要。只有本地对话历史会缩小。</p>
<p>ChatGPT 与克劳德最大的不同之处在于如何处理 "最近但非当前 "的会话。如果克劳德认为过去的上下文是相关的，它就会调用搜索工具来检索。ChatGPT 不会这么做。</p>
<p>相反，ChatGPT 会保留一个非常轻量级的<strong>跨会话摘要</strong>，并注入到每次对话中。关于这一层的几个关键细节</p>
<ul>
<li><p>它<strong>只</strong>汇总<strong>用户信息</strong>，不汇总助手信息。</p></li>
<li><p>它只存储很小的项目集--大约 15 个--足以捕捉稳定的主题或兴趣。</p></li>
<li><p>它<strong>不</strong>进行<strong>嵌入计算、相似性排序和检索调用</strong>。它基本上是预先咀嚼的上下文，而不是动态查找。</p></li>
</ul>
<p>从工程角度来看，这种方法以灵活性换取了可预测性。这样就不会出现奇怪的检索失败，推理延迟也会保持稳定，因为没有任何东西是动态配置的。缺点是，除非 ChatGPT 的摘要层中有六个月前的随机消息，否则它不会被调入。</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">让 Agents 内存可写的挑战<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>当 Agents 从<strong>只读存储器</strong>（典型的 RAG）转移到<strong>可写存储器</strong>（可记录用户操作、决策和偏好）时，复杂性会迅速飙升。你不再只是检索文档，而是要维护模型所依赖的不断增长的状态。</p>
<p>可写内存系统必须解决三个实际问题：</p>
<ol>
<li><p><strong>记住什么：</strong>代理需要一些规则来决定哪些事件、偏好或观察结果值得保留。如果不这样做，内存要么爆炸式增长，要么充满噪音。</p></li>
<li><p><strong>如何存储和分层记忆：</strong>并非所有记忆都是一样的。近期项目、长期事实和短暂笔记都需要不同的存储层、保留策略和索引策略。</p></li>
<li><p><strong>如何在不影响检索的情况下快速写入：</strong>内存必须持续写入，但如果系统不是为高吞吐量插入而设计，频繁更新可能会降低索引质量或减慢查询速度。</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">挑战 1：什么值得记住？</h3><p>并非用户所做的所有事情都应在长期内存中结束。如果有人创建了一个临时文件，五分钟后又将其删除，那么永远记录下来对任何人都没有帮助。这就是核心难点：<strong>系统如何决定什么才是真正重要的？</strong></p>
<p><strong>(1) 判断重要性的常见方法</strong></p>
<p>团队通常采用多种启发式方法：</p>
<ul>
<li><p><strong>基于时间</strong>：最近的操作比以前的更重要</p></li>
<li><p><strong>基于频率</strong>：重复访问的文件或操作更重要</p></li>
<li><p><strong>基于类型</strong>：某些对象本质上更重要（例如，项目配置文件与缓存文件）。</p></li>
</ul>
<p><strong>(2) 当规则发生冲突时</strong></p>
<p>这些信号经常会发生冲突。上周创建的文件，今天却被大量编辑--是时间重要还是活动重要？没有唯一的 "正确 "答案，这就是为什么重要性评分往往会迅速变得混乱的原因。</p>
<p><strong>(3) 向量数据库如何提供帮助</strong></p>
<p>向量数据库提供了无需手动清理即可执行重要性规则的机制：</p>
<ul>
<li><p><strong>TTL：</strong>Milvus 可以在设定时间后自动删除数据</p></li>
<li><p><strong>衰减：</strong>可以对较旧的向量进行降权，使其自然从检索中消失</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">挑战 2：实践中的内存分层</h3><p>Agents 运行时间越长，内存就越大。将所有内容都保存在快速存储器中是不可持续的，因此系统需要一种方法将内存分成<strong>热层</strong>（频繁访问）和<strong>冷</strong>层（很少访问）。</p>
<p><strong>(1) 决定内存何时变冷</strong></p>
<p>在这个模型中，<em>热内存</em>指的是保留在 RAM 中以实现低延迟访问的数据，而<em>冷内存</em>指的是转移到磁盘或对象存储中以降低成本的数据。</p>
<p>决定内存何时变为冷内存的方法多种多样。有些系统使用轻量级模型，根据动作或文件的含义和最近的使用情况来估计其语义重要性。其他系统则依赖于简单、基于规则的逻辑，例如移动 30 天内未被访问或一周内未出现在检索结果中的内存。用户还可以将某些文件或操作明确标记为重要文件或操作，确保它们始终保持热状态。</p>
<p><strong>(2) 热内存和冷内存的存储位置</strong></p>
<p>一旦分类，热内存和冷内存的存储方式是不同的。热内存保留在 RAM 中，用于存储经常访问的内容，如活动任务上下文或最近的用户操作。冷内存则被转移到磁盘或 S3 等对象存储系统中，虽然访问速度较慢，但存储成本却低得多。这种权衡方式效果很好，因为冷内存很少需要，通常只在长期参考时才会被访问。</p>
<p><strong>(3) 向量数据库如何提供帮助</strong></p>
<p><strong>Milvus 和 Zilliz Cloud</strong>支持这种模式，启用冷热分层存储，同时保持单一查询界面，因此经常访问的向量留在内存中，而较旧的数据则自动转移到成本较低的存储中。</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">挑战 3：内存的写入速度应该有多快？</h3><p>传统的 RAG 系统通常分批写入数据。索引在离线状态下重建--通常是在一夜之间，然后才能进行搜索。这种方法适用于静态知识库，但不适合 Agents 内存。</p>
<p><strong>(1) 为什么代理记忆库需要实时写入？</strong></p>
<p>Agents 内存必须在用户行为发生时捕捉到它们。如果不立即记录某个操作，下一次对话可能会缺少关键的上下文。因此，可写内存系统需要实时写入，而不是延迟的离线更新。</p>
<p><strong>(2) 写入速度与检索质量之间的矛盾</strong></p>
<p>实时存储器要求极低的写入延迟。同时，高质量的检索依赖于完善的索引，而索引的构建需要时间。每次写入都重建索引成本太高，但延迟建立索引意味着新写入的数据暂时无法检索。这种权衡正是可写入内存设计的核心所在。</p>
<p><strong>(3) 向量数据库的帮助</strong></p>
<p>向量数据库通过将写入与索引解耦来解决这一问题。一种常见的解决方案是流式写入并执行增量索引构建。以<strong>Milvus</strong>为例，新数据首先被写入内存缓冲区，这样系统就能高效处理高频写入。即使在建立完整索引之前，也可以通过动态合并或近似搜索在几秒钟内查询缓冲区数据。</p>
<p>当缓冲区达到预定义阈值时，系统会分批建立索引并持久化。这样既能提高长期检索性能，又不会阻碍实时写入。通过将快速摄取与较慢的索引构建分离开来，Milvus 在写入速度和搜索质量之间实现了切实可行的平衡，对 Agents 内存来说效果很好。</p>
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
    </button></h2><p>Cowork 让我们看到了一类新的 Agents--持久的、有状态的，并能在长时间轴上携带上下文。不过，它也让我们明白了另外一点：长期记忆只是成功的一半。要建立既自主又可靠的可投入生产的 Agents，我们仍然需要对不断发展的大型知识库进行结构化检索。</p>
<p>RAG 处理世界上的事实；可写内存处理 Agents 的内部状态。而向量数据库则位于两者的交汇处，提供索引、混合搜索和可扩展存储功能，使这两个层次能够协同工作。</p>
<p>随着长期运行的 Agents 不断成熟，它们的架构很可能会向这种混合设计靠拢。Cowork 是一个强烈的信号，表明了事物的发展方向--不是走向一个没有 RAG 的世界，而是走向由向量数据库驱动的、拥有更丰富内存堆栈的 Agents。</p>
<p>如果你想探索这些想法或在自己的设置中获得帮助，请<strong>加入我们的</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>与 Milvus 工程师聊天。如果想获得更多实践指导，您可以随时<strong>预约</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours 会议</strong></a> <strong>。</strong></p>
