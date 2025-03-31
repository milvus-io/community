---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: 停止使用过时的 RAG：DeepSearcher 的 Agents RAG 方法改变了一切
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">借助 LLMs 和深度研究向人工智能驱动的搜索转变<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>几十年来，搜索技术的发展突飞猛进--从 2000 年代前基于关键字的检索到 2010 年代的个性化搜索体验。我们正在见证人工智能解决方案的出现，它们能够处理需要深入专业分析的复杂查询。</p>
<p>OpenAI 的 "深度研究"（Deep Research）就是这种转变的典范，它利用推理能力综合大量信息并生成多步骤研究报告。例如，当被问及 "特斯拉的合理市值是多少？时，Deep Research 可以全面分析企业财务、业务增长轨迹和市值估算。</p>
<p>深度学习的核心是 RAG（Retrieval-Augmented Generation，检索增强生成）框架的高级实现形式。传统的 RAG 通过检索和整合相关外部信息来增强语言模型的输出。OpenAI 的方法则通过实施迭代检索和推理循环，在此基础上更进一步。Deep Research 不采用单一的检索步骤，而是动态生成多个查询，评估中间结果，并改进搜索策略--这展示了高级或 Agents RAG 技术如何提供高质量的企业级内容，让人感觉更像是专业研究，而不是简单的问题解答。</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher：本地深度研究为每个人带来 Agents RAG<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>受到这些进步的启发，世界各地的开发人员都在创建自己的实施方案。Zilliz 工程师建立并开源了<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>项目，该项目可被视为本地开源深度研究。在不到一个月的时间里，该项目就在 GitHub 上获得了 4,900 多颗星。</p>
<p>DeepSearcher 结合了高级推理模型的强大功能、复杂的搜索功能和集成的研究助手，重新定义了人工智能驱动的企业搜索。DeepSearcher 通过<a href="https://milvus.io/docs/overview.md">Milvus</a>（高性能开源向量数据库）整合本地数据，提供更快、更相关的结果，同时允许用户轻松交换核心模型，获得定制化体验。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 1：</em> <em>DeepSearcher 的明星历史（</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>资料来源）</em></a></p>
<p>在本文中，我们将探索从传统 RAG 到 Agentsic RAG 的演变过程，探讨这些方法在技术层面上的具体不同之处。然后，我们将讨论 DeepSearcher 的实现，展示它如何利用智能 Agents 功能来实现动态、多轮推理--以及为什么这对构建企业级搜索解决方案的开发人员很重要。</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">从传统 RAG 到 Agentic RAG：迭代推理的力量<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Agentic RAG 结合了智能代理功能，从而增强了传统 RAG 框架。DeepSearcher 就是代理 RAG 框架的一个典型例子。通过动态规划、多步骤推理和自主决策，它建立了一个检索、处理、验证和优化数据的闭环流程，以解决复杂问题。</p>
<p>大型语言模型（LLM）推理能力的显著进步推动了 Agentic RAG 的日益普及，特别是其分解复杂问题和在多步骤中保持连贯思维链的能力得到了提高。</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>比较维度</strong></td><td><strong>传统 RAG</strong></td><td><strong>Agents RAG</strong></td></tr>
<tr><td>核心方法</td><td>被动和反应式</td><td>主动、Agent 驱动型</td></tr>
<tr><td>流程</td><td>单步检索和生成（一次性流程）</td><td>动态、多步骤检索和生成（迭代改进）</td></tr>
<tr><td>检索策略</td><td>固定关键词搜索，取决于初始查询</td><td>自适应检索（例如，关键词细化、数据源切换）</td></tr>
<tr><td>复杂查询处理</td><td>直接生成；数据冲突时容易出错</td><td>任务分解 → 目标检索 → 答案合成</td></tr>
<tr><td>交互能力</td><td>完全依赖用户输入；无自主性</td><td>主动参与（例如，澄清模糊之处，要求提供详细信息）</td></tr>
<tr><td>纠错和反馈</td><td>无自我纠正功能；受初始结果限制</td><td>迭代验证 → 自触发重新检索以确保准确性</td></tr>
<tr><td>理想用例</td><td>简单问答、事实查询</td><td>复杂推理、多阶段问题解决、开放式任务</td></tr>
<tr><td>示例</td><td>用户问"什么是量子计算？→ 系统返回教科书上的定义</td><td>用户问："量子计算如何优化物流？"量子计算如何优化物流？→ 系统检索量子原理和物流算法，然后综合可操作的见解</td></tr>
</tbody>
</table>
<p>传统的 RAG 依赖于单一的、基于查询的检索，与之不同的是，Agentic RAG 将查询分解为多个子问题，并迭代地完善搜索，直到获得满意的答案。这种演变提供了三个主要优势：</p>
<ul>
<li><p><strong>主动解决问题：</strong>系统从被动反应过渡到主动解决问题。</p></li>
<li><p><strong>动态、多轮检索：</strong>系统不再进行一次性搜索，而是不断调整查询，并根据持续反馈进行自我修正。</p></li>
<li><p><strong>更广泛的适用性：</strong>它不仅能进行基本的事实核查，还能处理复杂的推理任务并生成综合报告。</p></li>
</ul>
<p>通过利用这些功能，像 DeepSearcher 这样的 Agentic RAG 应用程序的操作符就像人类专家一样，不仅能提供最终答案，还能完整、透明地分解推理过程和执行细节。</p>
<p>从长远来看，Agentic RAG 将超越基线 RAG 系统。传统方法往往难以解决用户查询中的底层逻辑问题，这需要迭代推理、反思和持续优化。</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">Agents RAG 架构是什么样的？以 DeepSearcher 为例<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我们已经了解了代理 RAG 系统的强大功能，那么它们的架构又是什么样的呢？让我们以 DeepSearcher 为例。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 2：DeepSearcher 中的两个模块</em></p>
<p>DeepSearcher 的架构由两个主要模块组成：</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1.数据输入模块</h3><p>该模块通过 Milvus 向量数据库连接各种第三方专有数据源。对于依赖专有数据集的企业环境来说，该模块尤为重要。该模块处理</p>
<ul>
<li><p>文档解析和分块</p></li>
<li><p>嵌入生成</p></li>
<li><p>向量存储和索引</p></li>
<li><p>有效检索的元数据管理</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2.在线推理和查询模块</h3><p>该模块在 RAG 框架内实施多种代理策略，以提供精确、有洞察力的回复。它以动态迭代循环的方式操作--每次数据检索后，系统都会反思所积累的信息是否足以回答原始查询。如果不是，则触发另一次迭代；如果是，则生成最终报告。</p>
<p>这种持续的 "跟进 "和 "反思 "循环是对其他基本 RAG 方法的根本性改进。传统的 RAG 只执行一次检索和生成过程，而 DeepSearcher 的迭代方法反映了人类研究人员的工作方式--提出最初的问题、评估收到的信息、找出差距并继续新的研究方向。</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">DeepSearcher 有多有效，最适合哪些用例？<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>安装和配置完成后，DeepSearcher 会通过 Milvus 向量数据库为本地文件建立索引。当您提交查询时，它会对这些索引内容进行全面、深入的搜索。对于开发人员来说，一个关键优势是系统会记录其搜索和推理过程的每一步，从而使其得出结论的过程更加透明--这对于调试和优化 RAG 系统至关重要。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 3：DeepSearcher 迭代加速回放</em></p>
<p>这种方法比传统 RAG 消耗更多计算资源，但能为复杂查询提供更好的结果。让我们讨论一下 DeepSearcher 最适合的两个特定用例。</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1.概览型查询</h3><p>概览型查询（如生成报告、起草文件或总结趋势）提供了一个简短的主题，但需要详尽、详细的输出。</p>
<p>例如，在查询 &quot;辛普森一家随着时间的推移发生了哪些变化？&quot;时，DeepSearcher 会首先生成一组初始子查询：</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>它检索相关信息，然后根据反馈迭代以完善搜索，生成下一个子查询：</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>每次迭代都是在前一次的基础上进行的，最终形成一份涵盖该主题多个方面的综合报告，其结构如下</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(为简洁起见，仅显示过程和最终报告的摘录）</em></p>
<p>最终报告提供详尽的分析，并附有适当的引文和条理清晰的组织结构。</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2.复杂推理查询</h3><p>复杂查询涉及多层逻辑和相互关联的实体。</p>
<p>考虑一下这个查询："哪部电影的导演年龄更大，是《上帝赐予女人的礼物》还是《Aldri annet enn bråk》？"</p>
<p>虽然这对人类来说似乎很简单，但简单的 RAG 系统却很难处理，因为答案并没有直接存储在知识库中。DeepSearcher 通过将查询分解成更小的子问题来应对这一挑战：</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>它首先检索两部电影的导演信息、</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>然后生成子查询：</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>然后提取他们的出生日期，最后进行比较以确定正确答案：</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>相比之下，传统的 RAG 系统可能会因为单次检索有限而遗漏关键细节，从而可能导致答案<a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">出现幻觉</a>或不准确：</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher 通过对导入的本地数据进行深度迭代搜索而脱颖而出。它记录推理过程的每一步，最终提供全面统一的报告。这使它对于概览型查询（如生成详细报告或总结趋势）以及复杂的推理查询（需要将问题分解为更小的子问题，并通过多个反馈回路汇总数据）尤为有效。</p>
<p>在下一节中，我们将把 DeepSearcher 与其他 RAG 系统进行比较，探讨其迭代方法和灵活的模型集成与传统方法相比有何优势。</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">定量比较：DeepSearcher 与传统 RAG 的比较<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>在 DeepSearcher GitHub 代码库中，我们提供了用于定量测试的代码。为了进行分析，我们使用了流行的 2WikiMultiHopQA 数据集。(注：为了管理 API 令牌消耗，我们只评估了前 50 个条目，但总体趋势依然清晰）。</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">召回率比较</h3><p>如图 4 所示，随着最大迭代次数的增加，召回率显著提高：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 4：最大迭代次数与召回率对比</em></p>
<p>迭代次数达到一定程度后，边际改进逐渐减弱，因此，我们通常将默认值设置为 3 次迭代，但也可根据具体需要进行调整。</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">令牌消耗分析</h3><p>我们还测量了 50 个查询在不同迭代次数下的令牌总用量：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 5：最大迭代次数与令牌使用量对比</em></p>
<p>结果显示，令牌消耗量随着迭代次数的增加而线性增加。例如，在迭代 4 次的情况下，DeepSearcher 大约会消耗 30 万个令牌。根据 OpenAI 的 gpt-4o-mini 定价粗略估计<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo separator="true">，</mo><mn>0.60/</mn><mi>1</mi><mn>M 输出令牌</mn></mrow></semantics></math></span></span>的<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>平均成本</mi><mi>约</mi><mi>为 0</mi></mrow><annotation encoding="application/x-tex">.60/1M 输出令牌，这相当于平均成本约为</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0.<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">60/</span><span class="mord mathnormal">1</span><span class="mord">M输出令牌</span><span class="mpunct">，</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal"></span><span class="mord mathnormal">这</span><span class="mord mathnormal">相当于</span></span></span></span>每次查询的<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">平均成本约为 0</span></span></span></span>.0036 美元（或 50 次查询约 0.18 美元）。</p>
<p>对于资源密集型推理模型，由于每个令牌的定价更高，令牌输出量更大，因此成本会高出数倍。</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">模型性能比较</h3><p>DeepSearcher 的一个显著优势是可以在不同模型之间灵活切换。我们测试了各种推理模型和非推理模型（如 gpt-4o-mini）。总体而言，推理模型--尤其是 Claude 3.7 Sonnet--往往表现最佳，尽管差异并不显著。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 6：不同模型的平均召回率</em></p>
<p>值得注意的是，一些较小的非推理模型有时无法完成完整的 Agents 查询过程，因为它们遵循指令的能力有限--这是许多开发人员在开发类似系统时面临的共同挑战。</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher（Agent RAG）与 Graph RAG 的对比<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a>也能处理复杂的查询，尤其是多跳查询。那么，DeepSearcher（Agentic RAG）与 Graph RAG 有什么区别呢？</p>
<p>Graph RAG 专为基于显式关系链接的文档查询而设计，因此在多跳查询方面尤为强大。例如，在处理长篇小说时，Graph RAG 可以精确提取人物之间错综复杂的关系。不过，这种方法需要在数据导入时使用大量标记来映射出这些关系，而且其查询模式往往比较死板，通常只对单关系查询有效。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 7：Graph RAG 与 DeepSearcher 的对比</em></p>
<p>相比之下，以 DeepSearcher 为代表的 Agents RAG 采用了一种根本不同的方法。它在数据导入过程中尽量减少令牌消耗，而在查询处理过程中投入计算资源。这种设计选择产生了重要的技术折衷：</p>
<ol>
<li><p>降低前期成本：DeepSearcher 对文档的预处理要求较低，因此初始设置速度更快、成本更低</p></li>
<li><p>动态查询处理：系统可根据中间结果动态配置检索策略</p></li>
<li><p>每次查询成本较高：与图形 RAG 相比，每次查询需要更多计算，但结果更灵活</p></li>
</ol>
<p>对于开发人员来说，在设计具有不同使用模式的系统时，这种区别至关重要。对于具有可预测查询模式和高查询量的应用来说，Graph RAG 可能更高效，而 DeepSearcher 的方法则在需要灵活性和处理不可预测的复杂查询的场景中表现出色。</p>
<p>展望未来，随着 LLMs 成本的降低和推理性能的不断提高，像 DeepSearcher 这样的 Agents RAG 系统可能会越来越普遍。计算成本上的劣势将逐渐减弱，而灵活性上的优势将继续存在。</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher 与深度研究<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>与 OpenAI 的 "深度研究 "不同，DeepSearcher 专门为私人数据的深度检索和分析而定制。通过利用向量数据库，DeepSearcher 可以摄取不同的数据源，整合各种数据类型，并将它们统一存储在基于向量的知识库中。其强大的语义搜索功能使其能够高效地搜索海量离线数据。</p>
<p>此外，DeepSearcher 完全开源。虽然 Deep Research 在内容生成质量方面仍处于领先地位，但它需要支付月费，而且是作为闭源产品操作的，这意味着其内部流程对用户是隐藏的。相比之下，DeepSearcher 则完全透明--用户可以检查代码，根据自己的需求进行定制，甚至将其部署到自己的生产环境中。</p>
<h2 id="Technical-Insights" class="common-anchor-header">技术洞察<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>在 DeepSearcher 的开发和后续迭代过程中，我们收集了一些重要的技术见解：</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">推理模型：有效但并非无懈可击</h3><p>我们的实验表明，虽然推理模型作为 Agents 表现出色，但它们有时会过度分析直接指令，导致令牌消耗过多和响应速度变慢。这一观察结果与 OpenAI 等主要人工智能提供商的方法一致，它们不再区分推理模型和非推理模型。相反，模型服务应根据节约令牌的具体要求自动确定推理的必要性。</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">Agents RAG 的即将崛起</h3><p>从需求角度看，深度内容生成至关重要；从技术上看，提高 RAG 的有效性也至关重要。从长远来看，成本是 Agents RAG 广泛应用的主要障碍。不过，随着 DeepSeek-R1 等高性价比、高质量 LLMs 的出现，以及摩尔定律推动的成本降低，推理服务的相关支出有望减少。</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">Agents RAG 隐藏的扩展极限</h3><p>我们研究的一个重要发现涉及性能与计算资源之间的关系。最初，我们假设只需增加迭代次数和令牌分配，就能按比例提高复杂查询的结果。</p>
<p>我们的实验揭示了一个更微妙的现实：虽然性能确实会随着迭代次数的增加而提高，但我们观察到明显的收益递减。具体来说</p>
<ul>
<li><p>从 1 次迭代到 3 次迭代，性能急剧上升</p></li>
<li><p>3 至 5 次迭代的改进不大</p></li>
<li><p>迭代次数超过 5 次后，尽管令牌消耗量显著增加，但收益却微乎其微</p></li>
</ul>
<p>这一发现对开发人员具有重要意义：简单地向 RAG 系统投入更多计算资源并不是最有效的方法。检索策略、分解逻辑和合成过程的质量往往比原始迭代次数更重要。这表明，开发人员应专注于优化这些组件，而不仅仅是增加令牌预算。</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">超越传统 RAG 的发展</h3><p>传统的 RAG 以其低成本、单一检索方法提供了宝贵的效率，使其适用于简单的问题解答场景。然而，在处理具有复杂隐含逻辑的查询时，它的局限性就显现出来了。</p>
<p>考虑一下类似 "如何在一年内赚到一亿 "这样的用户查询。传统的 RAG 系统可能会检索到有关高收入职业或投资策略的内容，但很难做到以下几点：</p>
<ol>
<li><p>识别查询中不切实际的期望</p></li>
<li><p>将问题分解为可行的子目标</p></li>
<li><p>综合多个领域（商业、金融、创业）的信息</p></li>
<li><p>提出一种结构化的多途径方法，并制定切实可行的时间表</p></li>
</ol>
<p>这正是 DeepSearcher 等 Agents RAG 系统的优势所在。通过分解复杂查询并应用多步骤推理，它们可以提供细致入微的综合响应，从而更好地满足用户的基本信息需求。随着这些系统变得更加高效，我们预计它们将在企业应用中加速普及。</p>
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
    </button></h2><p>DeepSearcher 代表着 RAG 系统设计的重大发展，为开发人员提供了一个强大的框架，用于构建更复杂的搜索和研究功能。其主要技术优势包括</p>
<ol>
<li><p>迭代推理：能够将复杂的查询分解为逻辑子步骤，并逐步建立全面的答案</p></li>
<li><p>灵活的架构：支持交换底层模型和定制推理过程，以满足特定的应用需求</p></li>
<li><p>向量数据库集成：与 Milvus 无缝连接，从私有数据源高效存储和检索向量 Embeddings</p></li>
<li><p>透明执行：详细记录每个推理步骤，使开发人员能够调试和优化系统行为</p></li>
</ol>
<p>我们的性能测试证实，与传统的 RAG 方法相比，DeepSearcher 能为复杂查询提供更优越的结果，但在计算效率方面有明显的折衷。最佳配置（通常约为 3 次迭代）在准确性和资源消耗之间取得了平衡。</p>
<p>随着 LLM 成本的不断降低和推理能力的不断提高，DeepSearcher 中采用的 Agents RAG 方法在生产应用中将变得越来越实用。对于开发企业搜索、研究助手或知识管理系统的开发人员来说，DeepSearcher 提供了一个强大的开源基础，可以根据特定领域的要求进行定制。</p>
<p>我们欢迎开发者社区的贡献，并邀请您访问我们的<a href="https://github.com/zilliztech/deep-searcher">GitHub 存储库</a>，探索 RAG 实现的新模式。</p>
