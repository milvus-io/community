---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: 让人工智能 Agents 脚踏实地：使用 Milvus 防止语境腐化的语境工程策略
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  了解为什么在长期运行的 LLM 工作流中会发生上下文腐烂，以及上下文工程、检索策略和 Milvus 向量搜索如何帮助人工智能 Agents
  在复杂的多步骤任务中保持准确、专注和可靠。
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>如果你参与过长时间的 LLM 对话，你可能会遇到这种令人沮丧的情况：长长的对话进行到一半时，模型开始漂移。答案变得含糊不清，推理能力减弱，关键细节神秘消失。但如果你把完全相同的提示放到新的聊天中，模型就会突然表现得专注、准确、脚踏实地。</p>
<p>这不是模型 "累了"，而是<strong>语境</strong>发生了变化。随着对话的增加，模型必须处理更多的信息，其优先排序能力也会慢慢下降。<a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">反熵研究</a>表明，当上下文窗口从大约 8K 标记扩展到 128K 时，检索准确率会下降 15-30%。该模型仍有空间，但它会失去对重要内容的追踪。更大的上下文窗口有助于延缓问题的解决，但并不能消除问题。</p>
<p>这就是<strong>上下文工程的</strong>用武之地。我们不会一次性将所有信息都交给模型，而是塑造它所看到的内容：只检索重要的部分，压缩不再需要的内容，并保持提示和工具足够简洁，以便模型进行推理。我们的目标很简单：在适当的时候提供重要信息，而忽略其他信息。</p>
<p>检索在这里扮演着核心角色，尤其是对于长期运行的 Agents 来说。<a href="https://milvus.io/"><strong>Milvus</strong></a>等向量数据库为有效地将相关知识拉回到上下文中奠定了基础，即使任务的深度和复杂性不断增加，系统也能保持稳定。</p>
<p>在这篇博客中，我们将探讨上下文轮转是如何发生的、团队管理上下文轮转的策略，以及从检索到提示设计的架构模式，这些模式能让人工智能 Agents 在长时间、多步骤的工作流程中保持敏锐。</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">为什么会发生上下文腐烂<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>人们通常认为，给人工智能模型提供更多的上下文自然会带来更好的答案。但事实上并非如此。认知科学表明，我们的工作记忆大约能容纳<strong>7±2 块</strong>信息。如果超出这个范围，我们就会开始遗忘、模糊或曲解细节。</p>
<p>LLMs 也有类似的表现--只是规模更大，失效模式更多。</p>
<p>问题的根源来自<a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">Transformer 架构</a>本身。每个标记都必须与其他标记进行比较，在整个序列中形成成对关注。这意味着计算量会随着上下文长度的增加而增长<strong>O(n²)</strong>。将提示符从 1K 扩展到 100K 并不会让模型 "更努力地工作"，而是会让标记交互的数量增加<strong>10,000 倍</strong>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>然后是训练数据的问题。</strong>模型看到的短序列远远多于长序列。因此，当你要求 LLM 在极其庞大的上下文中操作时，你就会把它推向一个没有经过严格训练的环境。在实践中，对于大多数模型来说，超长上下文推理往往是<strong>不适用</strong>的。</p>
<p>尽管存在这些限制，长语境现在已不可避免。早期的 LLM 应用大多是单轮任务--分类、总结或简单的生成。如今，超过 70% 的企业人工智能系统都依赖于 Agents，这些 Agents 在多轮交互中保持活跃，往往长达数小时，管理着分支、多步骤的工作流程。长期会话已经从例外变成了默认。</p>
<p>那么，下一个问题就是：<strong>我们该如何保持模型的注意力，而又不至于让它不堪重负？</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">解决上下文旋转的上下文检索方法<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>在实践中，它往往以互补的模式出现，从不同角度解决上下文腐烂问题。</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1.及时检索：减少不必要的上下文</h3><p>上下文腐烂的一个主要原因是模型<em>过载</em>了它还不需要的信息。Claude Code-Anthropic的编码助手通过<strong>即时检索（JIT）</strong>解决了这一问题。</p>
<p>克劳德代码不会将整个代码库或数据集塞入其上下文（这会大大增加漂移和遗忘的几率），而是维护一个微小的索引：文件路径、命令和文档链接。当模型需要某项信息时，它会检索该特定项目，并<strong>在关键时刻--而不是</strong>之前<strong>--</strong>将其插入上下文。</p>
<p>例如，如果你要求克劳德代码分析一个 10GB 的数据库，它绝不会尝试加载整个数据库。它的工作方式更像工程师：</p>
<ol>
<li><p>运行 SQL 查询，获取数据集的高级摘要。</p></li>
<li><p>使用<code translate="no">head</code> 和<code translate="no">tail</code> 等命令查看样本数据并了解其结构。</p></li>
<li><p>只在上下文中保留最重要的信息，如关键统计数据或样本行。</p></li>
</ol>
<p>通过尽量减少保留在上下文中的内容，JIT 检索可以防止无关标记的积累，从而避免出现错误。由于模型只查看当前推理步骤所需的信息，因此能保持专注。</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2.预检索（向量搜索）：防止语境漂移于未然</h3><p>有时，模型无法动态地 "询问 "信息--客户支持、问答系统和 Agents 工作流程往往需要<em>在</em>生成开始<em>之前就</em>获得正确的知识。这时，<strong>预先检索</strong>就变得至关重要。</p>
<p>上下文腐坏的发生往往是因为模型收到了一大堆原始文本，并期望从中找出重要的内容。而预检索则相反：向量数据库（如<a href="https://milvus.io/">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a>）会<em>在</em>推理<em>之前</em>识别出最相关的片段，确保只有高价值的上下文才能到达模型。</p>
<p>在典型的 RAG 设置中：</p>
<ul>
<li><p>文档被嵌入并存储在一个向量数据库（如 Milvus）中。</p></li>
<li><p>在查询时，系统会通过相似性搜索检索出一小部分高度相关的语块。</p></li>
<li><p>只有这些数据块才会进入模型的上下文。</p></li>
</ul>
<p>这可以从两个方面防止垃圾信息：</p>
<ul>
<li><p><strong>减少噪音：</strong>无关或相关性较弱的文本永远不会进入上下文。</p></li>
<li><p><strong>提高效率：</strong>模型处理的标记数量大大减少，从而降低了丢失重要细节的几率。</p></li>
</ul>
<p>Milvus 可以在几毫秒内搜索数百万个文档，因此这种方法非常适合延迟很重要的实时系统。</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3.混合 JIT 和向量检索</h3><p>基于向量搜索的预检索通过确保模型从高信号信息而不是原始的超大文本开始，解决了上下文腐烂的一个重要部分。但 Anthropic 强调了团队经常忽略的两个真正挑战：</p>
<ul>
<li><p><strong>及时性：</strong>如果知识库的更新速度快于向量索引的重建速度，那么模型可能会依赖于陈旧的信息。</p></li>
<li><p><strong>准确性：</strong>在任务开始之前，很难准确预测模型将需要什么--尤其是多步骤或探索性工作流。</p></li>
</ul>
<p>因此，在实际工作负载中，混合应用是最佳解决方案。</p>
<ul>
<li><p>向量搜索，获取稳定、高可信度的知识</p></li>
<li><p>Agents 驱动的 JIT 探索，用于探索不断变化或仅在任务中期才变得相关的信息</p></li>
</ul>
<p>将这两种方法混合使用，既能获得向量检索的速度和效率，以获取已知信息，又能让模型灵活地发现和加载新的相关数据。</p>
<p>让我们看看这在实际系统中是如何工作的。以生产文档助理为例。大多数团队最终会采用两阶段管道：Milvus 驱动的向量搜索 + 基于 Agents 的 JIT 检索。</p>
<p><strong>1.Milvus 驱动的向量搜索（预检索）</strong></p>
<ul>
<li><p>将文档、API 引用、更新日志和已知问题转换为 Embeddings。</p></li>
<li><p>将它们与产品区域、版本和更新时间等元数据一起存储在 Milvus 向量数据库中。</p></li>
<li><p>当用户提问时，运行语义搜索，抓取前 K 个相关片段。</p></li>
</ul>
<p>这样就能在 500 毫秒内解决大约 80% 的常规查询，从而为模型提供了一个强大的、抗上下文干扰的起点。</p>
<p><strong>2.基于 Agents 的探索</strong></p>
<p>当初始检索不够充分时，例如，当用户询问的内容非常具体或具有时间敏感性时，Agent 可以调用工具来获取新信息：</p>
<ul>
<li><p>使用<code translate="no">search_code</code> 查找代码库中的特定函数或文件</p></li>
<li><p>使用<code translate="no">run_query</code> 从数据库中提取实时数据</p></li>
<li><p>使用<code translate="no">fetch_api</code> 获取最新系统状态</p></li>
</ul>
<p>这些调用通常需要<strong>3-5 秒钟</strong>，但它们能确保模型始终使用新鲜、准确和相关的数据运行--即使是系统事先无法预料的问题。</p>
<p>这种混合结构确保了上下文的及时性、正确性和特定任务，大大降低了长期运行的 Agents 工作流中上下文腐烂的风险。</p>
<p>Milvus 在这些混合场景中特别有效，因为它支持</p>
<ul>
<li><p><strong>向量搜索 + 标量过滤</strong>，将语义相关性与结构化约束相结合</p></li>
<li><p><strong>增量更新</strong>，允许在不停机的情况下刷新<strong>Embeddings</strong></p></li>
</ul>
<p>这使得 Milvus 成为既需要语义理解又需要精确控制检索内容的系统的理想支柱。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>例如，您可以运行以下查询</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">如何选择处理上下文旋转的正确方法<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>有了向量搜索预检索、即时检索和混合检索，问题自然就来了：<strong>你应该使用哪一种？</strong></p>
<p>这里有一个简单而实用的选择方法，它基于你的知识的<em>稳定性</em>和模型信息需求<em>的可预测性</em>。</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1.向量搜索 → 最适合稳定的领域</h3><p>如果领域变化缓慢，但要求精确--金融、法律工作、合规性、医疗文件--那么由 Milvus 驱动的、具有<strong>预检索</strong>功能的知识库通常是最合适的。</p>
<p>信息定义明确，更新频率低，大多数问题都可以通过预先检索语义相关的文档得到解答。</p>
<p><strong>可预测的任务 + 稳定的知识 → 预检索。</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2.及时检索 → 最适合动态、探索性工作流</h3><p>软件工程、调试、分析和数据科学等领域涉及快速变化的环境：新文件、新数据、新部署状态。在任务开始前，模型无法预测会需要什么。</p>
<p><strong>不可预测的任务 + 快速变化的知识 → 即时检索。</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3.混合方法 → 当两个条件都成立时</h3><p>许多实际系统并不是纯粹稳定或纯粹动态的。例如，开发人员的文档变化缓慢，而生产环境的状态却每分钟都在变化。混合方法可以让你</p>
<ul>
<li><p>使用向量搜索加载已知的稳定知识（快速、低延迟）</p></li>
<li><p>使用 Agents 工具按需获取动态信息（准确、最新）</p></li>
</ul>
<p><strong>混合知识 + 混合任务结构 → 混合检索方法。</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">如果上下文窗口仍然不够用怎么办？<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>上下文工程有助于减少过载，但有时问题更为根本：<strong>任务根本无法容纳</strong>，即使经过精心裁剪也无济于事。</p>
<p>某些工作流，如迁移大型代码库、审查多存储库架构或生成深度研究报告，在模型到达任务终点之前，上下文窗口可能会超过 200K 以上。即使有向量搜索做重活，有些任务也需要更持久的结构化内存。</p>
<p>最近，Anthropic 提出了三种实用策略。</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1.压缩：保留信号，减少噪音</h3><p>当上下文窗口接近极限时，模型可以<strong>将先前的交互压缩成</strong>简洁的摘要。良好的压缩可以保持</p>
<ul>
<li><p>关键决策</p></li>
<li><p>限制和要求</p></li>
<li><p>未决问题</p></li>
<li><p>相关样本或示例</p></li>
</ul>
<p>并删除</p>
<ul>
<li><p>繁琐的工具输出</p></li>
<li><p>无关日志</p></li>
<li><p>多余步骤</p></li>
</ul>
<p>挑战在于平衡。压缩得过猛，模型就会丢失关键信息；压缩得过轻，空间就会变得很小。有效的压缩可以保留 "为什么 "和 "是什么"，而丢弃 "我们是如何到达这里的"。</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2.结构化笔记：将稳定的信息移出语境</h3><p>系统可以将重要的事实存储在<strong>外部存储器</strong>中，而不是将所有东西都保存在模型的窗口内<strong>--</strong>一个独立的数据库或一个结构化的存储空间，Agent 可以根据需要进行查询。</p>
<p>举例来说，克劳德的神奇宝贝代理原型就存储了像以下这样的持久性事实：...........：</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>与此同时，瞬时细节--战斗日志、长期工具输出--则保留在活动上下文之外。这与人类使用笔记本的方式如出一辙：我们不会将每个细节都保存在工作记忆中；我们会将参考点存储在外部，并在需要时进行查询。</p>
<p>有条理的笔记可以防止因重复、不必要的细节而造成的上下文腐烂，同时也为模型提供了可靠的真实来源。</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3.子代理架构：分而治之的大型任务</h3><p>对于复杂的任务，可以设计一个多 Agent 架构，由一个领导 Agent 监督整体工作，同时由几个专门的子 Agent 处理任务的特定方面。这些子代理深入研究与其子任务相关的大量数据，但只返回简明、重要的结果。这种方法通常用于研究报告或数据分析等场景。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在实际操作中，最好一开始就使用单个 Agents 结合压缩来处理任务。只有在需要跨会话保留内存时，才应引入外部存储。多 Agents 架构应保留给真正需要并行处理复杂、专业子任务的任务。</p>
<p>每种方法都能扩展系统的有效 "工作内存"，而不会破坏上下文窗口，也不会引发上下文旋转。</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">设计真正有效的上下文的最佳实践<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>在处理上下文溢出后，还有一个同样重要的环节：如何首先构建上下文。即使使用了压缩、外部注释和子 Agents，如果提示和工具本身不是为了支持冗长、复杂的推理而设计的，那么系统也将举步维艰。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic 提供了一种有用的方法来思考这个问题--与其说它是一个单一的提示书写练习，不如说它是在三个层次上构建上下文。</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>系统提示：寻找黄金地带</strong></h3><p>大多数系统提示在极端情况下都会失败。过多的细节--规则列表、嵌套条件、硬编码例外--会使提示变得脆弱且难以维护。结构太少则会让模型猜测该怎么做。</p>
<p>最好的提示处于中间位置：结构化程度足以指导行为，灵活性足以让模型进行推理。在实践中，这意味着给予模型明确的角色、一般的工作流程和少量的工具指导--仅此而已。</p>
<p>举个例子：</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>这个提示设定了方向，但不会让模型不知所措，也不会强迫它去处理不属于这里的动态信息。</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">工具设计：少即是多</h3><p>一旦系统提示设定了高层次的行为，工具就会承载实际的操作符。在工具增强系统中，一个令人惊讶的常见失败模式就是工具过多，或者工具的用途相互重叠。</p>
<p>一个好的经验法则是</p>
<ul>
<li><p><strong>一个工具，一个目的</strong></p></li>
<li><p><strong>明确、清晰的参数</strong></p></li>
<li><p><strong>责任不重叠</strong></p></li>
</ul>
<p>如果人类工程师会对使用哪种工具犹豫不决，那么模型也会。简洁的工具设计可以减少模糊性，降低认知负荷，并防止不必要的工具尝试干扰上下文。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">应检索动态信息，而非硬编码</h3><p>最后一层最容易被忽视。动态或时间敏感信息，如状态值、最近更新或用户特定状态，根本不应出现在系统提示中。在提示中加入这些信息会使其在长期任务中变得陈旧、臃肿或自相矛盾。</p>
<p>相反，只有在需要时，才能通过检索或代理工具获取这些信息。将动态内容排除在系统提示之外可以防止上下文腐烂，并保持模型推理空间的整洁。</p>
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
    </button></h2><p>随着人工智能 Agents 进入各行各业的生产环境，它们所承担的工作流程比以往任何时候都要长，任务也比以往任何时候都要复杂。在这种情况下，管理上下文就成为了一种实际需要。</p>
<p><strong>然而，更大的上下文窗口并不会自动产生更好的结果</strong>；在很多情况下，它的作用恰恰相反。当一个模型超负荷工作、被灌输陈旧信息或被迫接受大量提示时，准确性就会悄然下降。这种缓慢而微妙的下降就是我们现在所说的 "<strong>上下文腐烂</strong>"。</p>
<p>JIT检索、预检索、混合管道和向量数据库驱动的语义搜索等技术都是为了同一个目标：<strong>确保模型在正确的时刻看到正确的信息，不多也不少，这样它就能脚踏实地，得出可靠的答案。</strong></p>
<p>作为一个开源、高性能的向量数据库，<a href="https://milvus.io/"><strong>Milvus</strong></a>是这一工作流程的核心。它为高效存储知识和低延迟检索最相关的信息提供了基础架构。Milvus 与 JIT 检索和其他辅助策略搭配使用，可以帮助人工智能 Agents 在任务变得更深入、更动态时保持准确性。</p>
<p>但检索只是拼图的一部分。良好的提示设计、简洁明了的工具集以及合理的溢出策略--无论是压缩、结构化注释还是子 Agents--都能共同作用，使模型在长期运行的会话中保持专注。这才是真正的情境工程：不是聪明的黑客，而是深思熟虑的架构。</p>
<p>如果你想让人工智能 Agents 在数小时、数天或整个工作流中保持准确性，那么上下文值得你像对待堆栈中的其他核心部分一样重视。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
