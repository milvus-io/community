---
id: harness-engineering-ai-agents.md
title: 驾驭工程：人工智能代理实际需要的执行层
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: Harness Engineering 围绕自主人工智能 Agents 构建执行环境。了解它是什么，OpenAI 如何使用它，以及它为什么需要混合搜索。
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>米切尔-桥本（Mitchell Hashimoto）创建了哈希公司（HashiCorp），并与他人共同创建了 Terraform。2026 年 2 月，他发表了一篇<a href="https://mitchellh.com/writing/my-ai-adoption-journey">博文</a>，描述了他在与人工智能 Agents 合作时养成的一个习惯：每次 Agents 犯错，他都会在该代理的环境中设计一个永久性的修复方案。他称之为 "工程线束"。几周之内，<a href="https://openai.com/index/harness-engineering/">OpenAI</a>和<a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic 相继</a>发表了工程文章，对这一想法进行了扩展。<em>线束工程</em>"一词由此诞生。</p>
<p>它之所以能引起共鸣，是因为它点明了每个构建<a href="https://zilliz.com/glossary/ai-agents">人工智能 Agents</a>的工程师都会遇到的一个问题。<a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">及时工程</a>能让你获得更好的单轮输出。情境工程可以管理模型所看到的内容。但两者都无法解决 Agents 自主运行数小时、在无人监督的情况下做出数百个决定时发生的问题。这就是 Harness Engineering 所要填补的空白--它几乎总是依赖于混合搜索（混合全文和语义搜索）来发挥作用。</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">什么是线束工程？<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Harness 工程是围绕自主人工智能 Agents 设计执行环境的一门学科。它定义了 Agents 可以调用哪些工具、从哪里获取信息、如何验证自己的决策以及何时应该停止。</p>
<p>要理解它的重要性，可以考虑人工智能代理开发的三个层次：</p>
<table>
<thead>
<tr><th>层</th><th>优化内容</th><th>范围</th><th>示例</th></tr>
</thead>
<tbody>
<tr><td><strong>提示工程</strong></td><td>您对模型说的话</td><td>单一交流</td><td>少量实例、思维链提示</td></tr>
<tr><td><strong>情境工程</strong></td><td>模型可以看到的内容</td><td><a href="https://zilliz.com/glossary/context-window">上下文窗口</a></td><td>文件检索、历史压缩</td></tr>
<tr><td><strong>驾驭工程</strong></td><td>Agents 操作符所处的世界</td><td>多小时自主执行</td><td>工具、验证逻辑、架构约束</td></tr>
</tbody>
</table>
<p><strong>即时工程</strong>优化单次交流的质量--措辞、结构、示例。一次对话，一次输出。</p>
<p><strong>上下文工程</strong>管理模型一次能看到多少信息--检索哪些文件、如何压缩历史记录、哪些内容适合上下文窗口、哪些内容会被丢弃。</p>
<p><strong>Harness 工程</strong>构建了 Agents 的操作符世界。工具、知识源、验证逻辑、架构限制--所有这些都决定了一个 Agents 能否在没有人工监督的情况下可靠地运行数百个决策。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>人工智能 Agents 开发的三个层次：提示工程（Prompt Engineering）优化你说的话，情境工程（Context Engineering）管理模型看到的东西，驾驭工程（Harness Engineering）设计执行环境</span> </span></p>
<p>前两层决定了单次转向的质量。第三层决定了 Agents 是否能在你不在场的情况下操作数小时。</p>
<p>这些并不是相互竞争的方法。它们是一个渐进的过程。随着 Agents 能力的提高，同一个团队通常会在一个项目中完成所有三个层次的工作。</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">OpenAI 如何利用 Harness Engineering 构建百万行代码库以及他们学到的经验教训<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI 开展了一项内部实验，将 Harness Engineering 具体化。他们在工程博文<a href="https://openai.com/index/harness-engineering/">《Harness Engineering》</a>中对此进行了描述<a href="https://openai.com/index/harness-engineering/">：在 Agents 优先的世界中利用 Codex》一文中进行了描述。</a>2025 年 8 月底，一个三人团队从一个空仓库开始。在长达五个月的时间里，他们自己不写代码，每一行代码都由 OpenAI 的人工智能编码代理 Codex 生成。结果是：100 万行生产代码和 1500 个合并拉取请求。</p>
<p>有趣的部分并不是产出。而是他们遇到的四个问题和构建的线束层解决方案。</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">问题 1：没有对代码库的共同理解</h3><p>Agents 应该使用哪个抽象层？命名规则是什么？上周讨论的架构在哪里？在没有答案的情况下，Agent 只能反复猜测--而且猜错了。</p>
<p>第一种本能是使用一个包含所有约定、规则和历史决策的<code translate="no">AGENTS.md</code> 文件。失败的原因有四个。语境是稀缺的，臃肿的指令文件挤占了实际任务。当一切都被标注为重要时，一切都不重要了。文件会腐烂--第二周的规则到第八周就会变成错误的。而且，平面文档无法进行机械验证。</p>
<p>解决方法：将<code translate="no">AGENTS.md</code> 缩小到 100 行。不是规则，而是地图。它指向一个结构化的<code translate="no">docs/</code> 目录，其中包含设计决策、执行计划、产品规格和参考文档。Linters 和 CI 会验证交叉链接是否完好无损。Agents 可以准确导航到所需内容。</p>
<p>其基本原则是：如果某样东西在运行时不在上下文中，那么它对 Agents 来说就不存在。</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">问题 2：人工 QA 无法跟上代理输出的速度</h3><p>团队将 Chrome DevTools 协议接入 Codex。代理可以截图用户界面路径、观察运行时事件、使用 LogQL 查询日志以及使用 PromQL 查询指标。他们设定了一个具体的阈值：服务必须在 800 毫秒内启动，任务才算完成。Codex 任务每次运行时间超过 6 小时，通常是在工程师睡觉的时候。</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">问题 3：没有约束的架构漂移</h3><p>在没有防护措施的情况下，Agent 会复制它在 repo 中发现的任何模式，包括糟糕的模式。</p>
<p>解决方法：严格的分层架构，单一的强制依赖方向--类型 → 配置 → Repo → 服务 → 运行时 → 用户界面。自定义处理程序以机械方式执行这些规则，错误信息包括内嵌的修复指令。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>具有单向依赖验证的严格分层架构：类型位于底层，用户界面位于顶层，自定义联结器通过内联修复建议执行规则</span> </span></p>
<p>在人类团队中，当公司规模扩大到数百名工程师时，通常会出现这种限制。对于编码代理来说，从第一天起这就是一个先决条件。没有约束的 Agents 行动越快，架构漂移就越严重。</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">问题 4：无声的技术债务</h3><p>解决方案：将项目的核心原则编码到资源库中，然后按计划运行后台 Codex 任务，扫描偏差并提交重构 PR。大部分都在一分钟内自动合并--小额持续付款，而不是定期清算。</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">为什么人工智能 Agents 无法为自己的工作打分？<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI 的实验证明了 Harness Engineering 是有效的。但另一项研究却暴露了其中的失败模式：Agents 系统性地不擅长评估自己的产出。</p>
<p>这个问题有两种表现形式。</p>
<p><strong>语境焦虑。</strong>随着情境窗口的填满，Agent 开始过早地结束任务--不是因为工作已经完成，而是因为它们感觉到窗口限制正在逼近。人工智能编码代理 Devin 背后的团队 Cognition 在为 Claude Sonnet 4.5 版重建 Devin 时<a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">记录了这种行为</a>：模型开始意识到自己的上下文窗口，并在实际空间耗尽之前就开始走捷径。</p>
<p>他们的解决方案纯粹是线束工程。他们启用了 100 万枚令牌的上下文测试版，但将实际使用量限制在 20 万枚令牌--欺骗模型，让它相信自己有足够的空间。焦虑消失了。不需要改变模型，只需要一个更智能的环境。</p>
<p>最常见的一般缓解方法是压缩：总结历史，让同一个 Agents 继续使用压缩后的上下文。这可以保持连续性，但不会消除潜在行为。另一种方法是重置上下文：清除窗口，启动一个全新的实例，并通过结构化的工具移交状态。这就完全消除了焦虑触发因素，但需要完整的移交文件--文件中的空白意味着新 Agents 理解上的空白。</p>
<p><strong>自我评价偏差。</strong>当 Agents 评估自己的产出时，他们会打高分。即使在具有客观通过/失败标准的任务中，Agent 也会发现问题，说服自己相信问题并不严重，并批准本应失败的工作。</p>
<p>解决方法借鉴了生成对抗网络（GANs）：将生成器与评价器完全分离。在生成对抗网络（GAN）中，两个神经网络相互竞争--一个生成，一个评判--这种对抗性的紧张关系会迫使质量提高。同样的动力也适用于<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">多 Agents 系统</a>。</p>
<p>Anthropic 公司用一个三代理系统（规划者、生成者、评估者）与一个单独的代理进行了测试，测试的任务是建立一个二维复古游戏引擎。他们在<a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"长期应用程序开发的线束设计"</a>（Anthropic，2026 年）一文中描述了完整的实验过程。规划者将简短的提示扩展为完整的产品规格，故意不明确实施细节--早期的过度规范会导致下游错误。生成器在冲刺阶段实现功能，但在编写代码之前，会与评估者签署一份冲刺合同：共同定义 "完成"。评估者使用 Playwright（微软的开源浏览器自动化框架）像真正的用户一样点击应用程序，测试 UI、API 和数据库行为。如果有任何失败，冲刺就会失败。</p>
<p>单个 Agents 制作的游戏在技术上可以启动，但实体到运行时的连接在代码层面上出现了问题，只有通过阅读源代码才能发现。三代理线束制作出了一个可玩的游戏，并带有人工智能辅助关卡生成、精灵动画和音效。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>单个代理与三代理线束的比较：单个代理运行了 20 分钟，耗资 9 美元，核心功能被破坏；而完整的线束运行了 6 小时，耗资 200 美元，制作出了一个功能齐全的游戏，具有人工智能辅助功能。</span> </span></p>
<p>三代理架构的成本大约高出 20 倍。产出从不可用到可用。这就是 Harness Engineering 所做的核心交易：以结构开销换取可靠性。</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">每个Agent Harness内部的检索问题<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>这两种模式--结构化<code translate="no">docs/</code> 系统和生成器/评估器冲刺周期--都有一个无声的依赖关系：当 Agents 需要时，它必须从实时、不断发展的知识库中找到正确的信息。</p>
<p>这比看上去要难。举个具体的例子：生成器正在执行冲刺 3，实施用户身份验证。在编写代码之前，它需要两种信息。</p>
<p>首先是<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>查询：<em>本产品围绕用户会话的设计原则是什么？</em>相关文档可能使用 "会话管理 "或 "访问控制"，而不是 "用户身份验证"。如果不理解语义，检索就会遗漏。</p>
<p>第二，精确匹配查询：<em>哪些文档引用了<code translate="no">validateToken</code> 函数？</em>函数名是一个没有语义的任意字符串。<a href="https://zilliz.com/glossary/vector-embeddings">基于 Embeddings 的检索</a>无法可靠地找到它。只有关键字匹配才有效。</p>
<p>这两个查询是同时进行的。它们不能分成连续的步骤。</p>
<p>纯<a href="https://zilliz.com/learn/vector-similarity-search">向量检索</a>在精确匹配时失效。传统的<a href="https://milvus.io/docs/embed-with-bm25.md">BM25</a>在语义查询上失效，无法预测文档将使用哪些词汇。在 Milvus 2.5 之前，唯一的选择是两个并行检索系统--一个向量索引和一个<a href="https://milvus.io/docs/full-text-search.md">全文索引</a>--在查询时通过自定义的结果融合逻辑同时运行。对于不断更新的<code translate="no">docs/</code> 实时资源库来说，两个索引必须保持同步：每一次文档变更都会触发两个地方的重新索引，而且始终存在不一致的风险。</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Milvus 2.6 如何通过单一混合管道解决 Agents 检索问题<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是专为人工智能工作负载设计的开源<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>。Milvus 2.6 的 Sparse-BM25 将双管道检索问题折叠成一个系统。</p>
<p>在摄取时，Milvus 会同时生成两种表示形式：用于语义检索的<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密集嵌入</a>和用于 BM25 评分<a href="https://milvus.io/docs/sparse_vector.md">的 TF 编码稀疏向量</a>。全局<a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">IDF 统计数据</a>会随着文档的添加或删除而自动更新，无需手动重新索引。在查询时，自然语言输入会在内部生成两种查询向量类型。<a href="https://milvus.io/docs/rrf-ranker.md">互惠排序融合（RRF）</a>会合并排序结果，调用者会收到一个统一的结果集。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>前后对比：两个独立的系统，手动同步、结果分散、融合逻辑定制与 Milvus 2.6 单一流水线，密集嵌入、稀疏 BM25、RRF 融合、自动 IDF 维护产生统一结果对比</span> </span></p>
<p>一个界面。只需维护一个索引。</p>
<p>在<a href="https://zilliz.com/glossary/beir">BEIR 基准</a>（涵盖 18 个异构检索数据集的标准评估套件）上，Milvus 在同等召回率下的吞吐量是 Elasticsearch 的 3-4 倍，在特定工作负载上的 QPS 提高了 7 倍。在冲刺场景中，单次查询即可找到会话设计原则（语义路径）和所有提及<code translate="no">validateToken</code> 的文档（精确路径）。<code translate="no">docs/</code> 库会持续更新；BM25 IDF 维护意味着新编写的文档会参与下一次查询的评分，而无需进行任何批量重建。</p>
<p>这正是为这类问题而构建的检索层。当一个 Agents 需要搜索一个活生生的知识库（代码文档、设计决策、冲刺历史）时，单管道混合搜索并不是一个好帮手。单管道混合搜索并不是锦上添花，而是让代理服务器的其他部分发挥作用的关键所在。</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">最好的线束组件是为删除而设计的<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>线束中的每个组件都编码了对模型限制的假设。当模型在长时间任务中失去连贯性时，就需要进行冲刺分解。当模型在接近窗口极限时出现焦虑时，情境重置是必要的。当自我评估偏差无法控制时，就需要评估者 Agents。</p>
<p>这些假设都过期了。当模型发展出真正的长语境耐力时，认知的语境-窗口技巧可能就变得没有必要了。随着模型的不断改进，其他组件也将成为不必要的开销，它们会拖慢 Agents 的速度，却不会增加可靠性。</p>
<p>Harness Engineering 并不是一个固定的架构。它是一个随着每个新模型的发布而重新校准的系统。任何重大升级后的第一个问题都不是 "我能添加什么？而是 "我能删除什么？"</p>
<p>同样的逻辑也适用于检索。随着模型能更可靠地处理更长的上下文，分块策略和检索时机也会发生变化。今天需要仔细分块的信息，明天就可能变成整页的信息。检索基础架构会与模型同步调整。</p>
<p>精心打造的检索系统中的每个组件都在等待着被更智能的模型取代。这不是问题。这就是我们的目标。</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">开始使用 Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您正在构建需要混合检索的 Agents 基础设施，即在一个管道中进行语义和关键词搜索，那么就从这里开始吧：</p>
<ul>
<li>阅读<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6 发布说明</strong></a>，了解 Sparse-BM25、自动 IDF 维护和性能基准的全部详情。</li>
<li>加入<a href="https://milvus.io/community"><strong>Milvus 社区</strong></a>，提出问题并分享您的构建成果。</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>预约免费的 Milvus Office Hours 会议</strong></a>，与向量数据库专家一起讨论您的使用案例。</li>
<li>如果您想跳过基础架构设置，<a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a>（全面管理 Milvus）提供免费层级，使用工作电子邮件注册后即可获得 100 美元的免费积分，开始使用。</li>
<li>在 GitHub 上给我们加星：<a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a>- 43k+ stars，并且还在不断增加。</li>
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">什么是线束工程，它与提示工程有何不同？</h3><p>提示工程优化您在单次交流中对一个模型所说的话--措辞、结构和示例。驾驭工程（Harness Engineering）围绕自主人工智能 Agents 构建执行环境：它可以调用的工具、可以访问的知识、检查其工作的验证逻辑以及防止架构漂移的约束条件。即时工程塑造了一次对话的转折。驾驭工程（Harness Engineering）塑造了一个代理能否在没有人类监督的情况下，在数百个决策中可靠地操作数小时。</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">为什么人工智能代理同时需要向量搜索和 BM25？</h3><p>代理必须同时回答两个根本不同的检索问题。语义查询--<em>我们围绕用户会话的设计原则是什么？</em>- 语义查询--我们围绕用户会话的设计原则是什么？完全匹配查询--<em>哪些文档引用了<code translate="no">validateToken</code> 函数？</em>- 需要 BM25 关键词评分，因为函数名称是没有语义的任意字符串。只处理一种模式的检索系统将系统性地错过其他类型的查询。</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">Milvus Sparse-BM25 如何用于 Agents 知识检索？</h3><p>在摄取时，Milvus 会同时为每个文档生成密集嵌入和 TF 编码的稀疏向量。全局 IDF 统计数据会随着知识库的变化而实时更新，无需手动重新索引。在查询时，两种向量类型都会在内部生成，互惠排序融合会合并排序结果，Agent 会收到一个统一的结果集。整个管道通过一个界面和一个索引运行，这对代码文档库等持续更新的知识库至关重要。</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">我应该在何时为我的 Agents 线束添加一个评估器代理？</h3><p>当生成器的输出质量无法单独通过自动测试验证，或自我评估偏差导致缺陷遗漏时，可添加单独的评估器。关键原则：评估器必须在架构上与生成器分离--共享上下文会重新产生您试图消除的偏差。评估者应该能够使用运行时工具（浏览器自动化、API 调用、数据库查询）来测试行为，而不仅仅是审查代码。Anthropic 的<a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">研究</a>发现，这种由 GAN 启发的分离将输出质量从 "技术上已启动但已损坏 "提升到 "功能齐全，独行代理从未尝试过的功能"。</p>
