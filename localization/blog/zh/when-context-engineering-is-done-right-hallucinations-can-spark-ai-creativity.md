---
id: >-
  when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
title: 如果情境工程做得好，幻觉就能成为人工智能创造力的 Spark
author: James Luan
date: 2025-09-30T00:00:00.000Z
desc: 探索为什么人工智能的幻觉不仅仅是错误，而是创造力的火花--以及情境工程如何将它们转化为可靠、真实的结果。
cover: assets.zilliz.com/Chat_GPT_Image_Oct_1_2025_10_42_15_AM_101639b3bf.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, AI Agents, Context Engineering'
meta_keywords: 'Milvus, vector database, AI Agents, Context Engineering'
meta_title: |
  If Context Engineering Done Right, Hallucinations Can Spark AI Creativity
origin: >-
  https://milvus.io/blog/when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
---
<p>长期以来，包括我在内的许多人都把 LLM 幻觉视为缺陷。我们围绕消除幻觉建立了一整套工具链：检索系统、防护栏、微调等等。这些保障措施仍然很有价值。但是，当我越多地研究模型究竟是如何产生反应的，以及<a href="https://milvus.io/"><strong>Milvus</strong></a>这样的系统是如何融入更广泛的人工智能管道时，我就越不相信幻觉只是简单的故障。事实上，它们也可以成为人工智能创造力的 Spark。</p>
<p>如果我们看看人类的创造力，就会发现相同的模式。每一次突破都依赖于想象力的飞跃。但这些飞跃从来不是凭空而来的。诗人在打破常规之前，首先要掌握节奏和韵律。科学家在涉足未经检验的领域之前，首先依靠的是已有的理论。进步有赖于这些飞跃，只要这些飞跃是以扎实的知识和理解为基础的。</p>
<p>LLMs 的操作符大致相同。他们所谓的 "幻觉 "或 "跃迁"--类比、联想和推断--产生于相同的生成过程，这一过程使模型能够建立联系、扩展知识，并浮现出超出他们所接受的明确训练的想法。并非每次飞跃都能成功，但一旦成功，结果就会令人信服。</p>
<p>这就是为什么我认为 "<strong>情境工程 "</strong>是关键的下一步。与其试图消除每一个幻觉，我们不如专注于<em>引导</em>它们。通过设计正确的情境，我们可以取得平衡--让模型保持足够的想象力去探索新的领域，同时确保它们保持足够的稳固性以值得信赖。</p>
<h2 id="What-is-Context-Engineering" class="common-anchor-header">什么是情境工程？<button data-href="#What-is-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>那么我们所说的<em>情境工程</em>到底是什么意思呢？这个词可能是个新词，但实践已经发展了很多年。RAG、提示、函数调用和 MCP 等技术都是解决同一问题的早期尝试：为模型提供合适的环境，使其产生有用的结果。情境工程就是要将这些方法统一到一个连贯的框架中。</p>
<h2 id="The-Three-Pillars-of-Context-Engineering" class="common-anchor-header">情境工程的三大支柱<button data-href="#The-Three-Pillars-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>有效的情境工程基于三个相互关联的层面：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_engineering_1_8f2b39c5e7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-The-Instructions-Layer--Defining-Direction" class="common-anchor-header">1.指令层--确定方向</h3><p>这一层包括提示、少量示例和演示。它是模型的导航系统：不只是模糊的 "向北走"，而是有航点的清晰路线。结构严谨的指令可以设定界限、确定目标，并减少模型行为的模糊性。</p>
<h3 id="2-The-Knowledge-Layer--Supplying-Ground-Truth" class="common-anchor-header">2.知识层--提供基本事实</h3><p>在这里，我们放置了模型有效推理所需的事实、代码、文档和状态。如果没有这一层，系统就会从不连贯的记忆中随机应变。有了它，模型就能将其输出建立在特定领域数据的基础上。知识越准确、越相关，推理就越可靠。</p>
<h3 id="3-The-Tools-Layer--Enabling-Action-and-Feedback" class="common-anchor-header">3.工具层--实现行动和反馈</h3><p>这一层包括应用程序接口、函数调用和外部集成。它使系统从推理转向执行--检索数据、执行计算或触发工作流。同样重要的是，这些工具可以提供实时反馈，并将其反馈回模型的推理过程中。有了这种反馈，才能进行修正、调整和持续改进。在实践中，这就是将 LLMs 从被动响应者转变为系统主动参与者的原因。</p>
<p>这些层次并不是孤立的，而是相互促进的。指令设定目标，知识提供信息，工具将决策转化为行动，并将结果反馈到循环中。如果协调得当，它们就能创造出一种环境，让模型既有创造性，又值得信赖。</p>
<h2 id="The-Long-Context-Challenges-When-More-Becomes-Less" class="common-anchor-header">长期背景挑战：当多变少<button data-href="#The-Long-Context-Challenges-When-More-Becomes-Less" class="anchor-icon" translate="no">
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
    </button></h2><p>现在，许多人工智能模型都标榜拥有数百万个令牌窗口，足以容纳约 75,000 行代码或 750,000 字的文档。但更多的上下文并不会自动产生更好的结果。在实践中，过长的上下文会带来明显的失效模式，从而降低推理能力和可靠性。</p>
<h3 id="Context-Poisoning--When-Bad-Information-Spreads" class="common-anchor-header">上下文中毒--当不良信息传播时</h3><p>一旦错误信息进入工作上下文--无论是目标、摘要还是中间状态--就会破坏整个推理过程。<a href="https://arxiv.org/pdf/2507.06261">DeepMind 的双子座 2.5 报告</a>提供了一个清晰的例子。一个玩《口袋妖怪》的 LLM Agents 读错了游戏状态，认为自己的任务是 "捕捉无法捕捉的传奇"。这个错误的目标被记录为事实，导致 Agents 生成了精心设计但不可能实现的策略。</p>
<p>如下节选所示，中毒的上下文使模型陷入了一个循环--重复错误、忽略常识、强化同样的错误，直到整个推理过程崩溃。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Excerpt_from_Gemini_2_5_Tech_Paper_e89adf9eed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 1：<a href="https://arxiv.org/pdf/2507.06261">双子座 2.5 技术论文</a>节选</p>
<h3 id="Context-Distraction--Lost-in-the-Details" class="common-anchor-header">上下文分心--迷失在细节中</h3><p>随着上下文窗口的扩大，模型可能会开始过重使用文字记录，而对训练过程中学到的知识使用不足。例如，DeepMind 的 Gemini 2.5 Pro 支持百万代币窗口，但<a href="https://arxiv.org/pdf/2507.06261">在约 100,000 个代币左右就开始偏移，重复使用</a>过去的操作，而不是生成新的策略。<a href="https://www.databricks.com/blog/long-context-rag-performance-llms">Databricks 的研究</a>表明，像 Llama 3.1-405B 这样的小型模型，在大约 32,000 代币时就已经达到了极限。这就是我们熟悉的人类效应：背景阅读太多，就会迷失方向。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Excerpt_from_Gemini_2_5_Tech_Paper_56d775c59d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 2：摘自<a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5 技术论文</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Long_context_performance_of_GPT_Claude_Llama_Mistral_and_DBRX_models_on_4_curated_RAG_datasets_Databricks_Docs_QA_Finance_Bench_Hot_Pot_QA_and_Natural_Questions_Source_Databricks_99086246b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 3：GPT、Claude、Llama、Mistral 和 DBRX 模型在 4 个 RAG 数据集（Databricks DocsQA、FinanceBench、HotPotQA 和 Natural Questions）上的长语境性能 [来源：</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>]</em><em>。</em></p>
<h3 id="Context-Confusion--Too-Many-Tools-in-the-Kitchen" class="common-anchor-header">上下文混淆--厨房里的工具太多了</h3><p>添加更多工具并不一定有帮助。<a href="https://gorilla.cs.berkeley.edu/leaderboard.html">伯克利函数调用排行榜（Berkeley Function-Calling Leaderboard</a>）显示，当上下文显示大量工具菜单（通常包含许多无关选项）时，模型的可靠性就会降低，甚至在不需要工具时也会调用。一个明显的例子是：量化的 Llama 3.1-8B 在有 46 个工具可用的情况下失败了，但当工具集减少到 19 个时却成功了。这就是人工智能系统的选择悖论--选择太多，决策更糟糕。</p>
<h3 id="Context-Clash--When-Information-Conflicts" class="common-anchor-header">情境冲突--当信息发生冲突时</h3><p>多轮交互增加了一种独特的失败模式：早期的误解会随着对话的分支而加剧。在<a href="https://arxiv.org/pdf/2505.06120v1">微软和 Salesforce 的实验</a>中，开放权重和封闭权重的 LLMs 在多轮互动与单轮互动中的表现都明显不如单轮互动--在六个生成任务中平均下降了 39%。一旦一个错误的假设进入对话状态，后续回合就会继承它并扩大错误。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_LL_Ms_get_lost_in_multi_turn_conversations_in_experiments_21f194b02d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 4：实验中 LLMs 在多轮对话中丢失</em></p>
<p>即使在前沿模型中也会出现这种影响。当基准任务分配到各个回合时，OpenAI 的 o3 模型的性能得分从<strong>98.1</strong>降至<strong>64.1</strong>。最初的误读实际上 "设定 "了世界模型；每次回复都建立在此基础上，将一个小矛盾变成了一个坚硬的盲点，除非明确加以纠正。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_The_performance_scores_in_LLM_multi_turn_conversation_experiments_414d3a0b3f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 4：LLM 多轮对话实验中的性能得分</em></p>
<h2 id="Six-Strategies-to-Tame-Long-Context" class="common-anchor-header">驯服长语境的六种策略<button data-href="#Six-Strategies-to-Tame-Long-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>应对长语境挑战的办法不是放弃这种能力，而是对其进行规范化设计。以下是我们在实践中见过的六种有效策略：</p>
<h3 id="Context-Isolation" class="common-anchor-header">情境隔离</h3><p>将复杂的工作流分解成具有隔离上下文的专门 Agents。每个 Agents 专注于自己的领域，互不干涉，从而降低了错误传播的风险。这不仅能提高准确性，还能实现并行执行，就像一个结构合理的工程团队。</p>
<h3 id="Context-Pruning" class="common-anchor-header">上下文剪枝</h3><p>定期审核和修剪上下文。删除多余的细节、陈旧的信息和不相关的痕迹。就像重构一样：清除死代码和依赖关系，只留下精华部分。有效的修剪需要明确的标准来确定哪些属于哪些不属于。</p>
<h3 id="Context-Summarization" class="common-anchor-header">上下文汇总</h3><p>冗长的历史不需要完整地随身携带。相反，应将其浓缩为简明的摘要，只记录下一步所需的重要内容。好的总结可以保留关键事实、决策和限制因素，同时消除重复和不必要的细节。这就好比用一页纸的设计概要取代了 200 页的规格说明书，但仍能为你提供前进所需的一切。</p>
<h3 id="Context-Offloading" class="common-anchor-header">语境卸载</h3><p>并非每个细节都需要成为实时上下文的一部分。将非关键数据保存在外部系统（知识库、文档存储或 Milvus 等向量数据库）中，只有在需要时才提取。这样既能减轻模型的认知负荷，又能保持背景信息的可访问性。</p>
<h3 id="Strategic-RAG" class="common-anchor-header">战略性 RAG</h3><p>信息检索只有在有选择的情况下才会强大。通过严格的过滤和质量控制引入外部知识，确保模型使用相关且准确的输入。与任何数据管道一样：垃圾进，垃圾出--但有了高质量的检索，背景信息就会成为一种资产，而不是负债。</p>
<h3 id="Optimized-Tool-Loading" class="common-anchor-header">优化工具加载</h3><p>工具越多并不等于性能越好。研究表明，可用工具超过 30 个，可靠性就会急剧下降。只加载特定任务所需的功能，并对其他功能进行访问控制。精简的工具箱有助于提高精确度，减少可能影响决策的噪音。</p>
<h2 id="The-Infrastructure-Challenge-of-Context-Engineering" class="common-anchor-header">情境工程的基础设施挑战<button data-href="#The-Infrastructure-Challenge-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>情境工程的有效性取决于其运行的基础设施。当今的企业正面临着数据挑战的完美风暴：</p>
<h3 id="Scale-Explosion--From-Terabytes-to-Petabytes" class="common-anchor-header">规模爆炸--从 TB 到 PB</h3><p>如今，数据增长重新定义了基线。曾经可以轻松容纳在单个数据库中的工作负载，现在已经跨越了 PB 级，需要分布式存储和计算。过去只需单行 SQL 更新即可完成的 Schema 更改，现在可能需要跨集群、管道和服务的全面协调工作。扩展不是简单地增加硬件，而是在每一个假设都要经过压力测试的情况下，对协调性、复原力和弹性进行工程设计。</p>
<h3 id="Consumption-Revolution--Systems-That-Speak-AI" class="common-anchor-header">消费革命--会说人工智能的系统</h3><p>人工智能 Agents 不只是查询数据，它们还能以机器速度持续生成、转换和消费数据。专为面向人类的应用而设计的基础设施无法跟上。为了支持 Agents，系统必须提供低延迟检索、流式更新和不中断的重写工作负载。换句话说，基础架构堆栈必须将人工智能作为其原生工作负载来构建，而不是事后才考虑。</p>
<h3 id="Multimodal-Complexity--Many-Data-Types-One-System" class="common-anchor-header">多模态复杂性--多种数据类型，一个系统</h3><p>人工智能工作负载融合了文本、图像、音频、视频和高维嵌入，每种数据都附带丰富的元数据。管理这种异质性是实用上下文工程的关键所在。所面临的挑战不仅仅是存储不同的对象，还包括为它们建立索引、高效检索它们以及在不同模式之间保持语义一致性。真正的人工智能就绪基础设施必须将多模态性视为一流的设计原则，而不是附加功能。</p>
<h2 id="Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="common-anchor-header">Milvus + Loon：为人工智能量身打造的数据基础设施<button data-href="#Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>规模、消费和多模态的挑战不能仅靠理论来解决，它们需要专为人工智能打造的基础设施。这就是我们<a href="https://zilliz.com/">Zilliz</a>设计<strong>Milvus</strong>和<strong>Loon</strong>的原因，它们可以协同工作，同时解决两个方面的问题：运行时的高性能检索和上游的大规模数据处理。</p>
<ul>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a>：最广泛采用的开源向量数据库，针对高性能向量检索和存储进行了优化。</p></li>
<li><p><strong>Loon</strong>：我们即将推出的云原生多模态数据湖服务，用于在大规模多模态数据到达数据库之前对其进行处理和组织。敬请期待。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/loon_milvus_min_76aaa39b4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Lightning-Fast-Vector-Search" class="common-anchor-header">快如闪电的向量搜索</h3><p><strong>Milvus</strong>从一开始就是为向量工作负载而构建的。作为服务层，它能在 10 毫秒内完成数亿甚至数十亿向量的检索，无论这些向量来自文本、图像、音频还是视频。对于人工智能应用来说，检索速度并不是一个 "很好的条件"。它决定了 Agents 是否感觉反应灵敏或迟缓，搜索结果是否感觉相关或脱节。性能直接体现在最终用户体验上。</p>
<h3 id="Multimodal-Data-Lake-Service-at-Scale" class="common-anchor-header">规模化多模式数据湖服务</h3><p><strong>Loon</strong>是我们即将推出的多模态数据湖服务，旨在对非结构化数据进行大规模离线处理和分析。它是 Milvus 在管道方面的补充，可在数据到达数据库之前对其进行准备。现实世界中的多模态数据集涵盖文本、图像、音频和视频，往往杂乱无章，存在重复、噪音和格式不一致等问题。Loon 使用 Ray 和 Daft 等分布式框架来处理这些繁重的工作，对数据进行压缩、复制和聚类，然后将其直接流式传输到 Milvus。结果很简单：没有暂存瓶颈，没有痛苦的格式转换，只有模型可以立即使用的干净、结构化数据。</p>
<h3 id="Cloud-Native-Elasticity" class="common-anchor-header">云原生弹性</h3><p>这两个系统都是云原生构建的，存储和计算可独立扩展。这意味着，当工作负载从千兆字节增长到 PB 级时，您可以在实时服务和离线培训之间平衡资源，而不是为其中一个过度配置或削弱其他资源。</p>
<h3 id="Future-Proof-Architecture" class="common-anchor-header">面向未来的架构</h3><p>最重要的是，该架构旨在与您共同成长。情境工程仍在不断发展。目前，大多数团队都专注于语义搜索和 RAG 管道。但是，下一波浪潮将要求更多--整合多种数据类型，在它们之间进行推理，并为代理驱动的工作流提供动力。</p>
<p>有了 Milvus 和 Loon，这种转变并不需要放弃基础。支持当前用例的堆栈可以自然扩展到未来的用例。您无需从头开始就能添加新功能，这意味着风险更小、成本更低，而且随着人工智能工作负载变得更加复杂，道路也会更加平坦。</p>
<h2 id="Your-Next-Move" class="common-anchor-header">下一步行动<button data-href="#Your-Next-Move" class="anchor-icon" translate="no">
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
    </button></h2><p>情境工程不仅仅是另一门技术学科--它是我们释放人工智能创造潜能的方式，同时又能使其保持稳固和可靠。如果您准备将这些想法付诸实践，请从最重要的地方开始。</p>
<ul>
<li><p><a href="https://milvus.io/docs/overview.md"><strong>使用 Milvus 进行实验</strong></a>，看看向量数据库如何在实际部署中锚定检索。</p></li>
<li><p><a href="https://www.linkedin.com/company/the-milvus-project/"><strong>关注 Milvus</strong></a>，了解有关 Loon 发布的最新信息以及管理大规模多模态数据的见解。</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>加入 Discord 上的 Zilliz 社区</strong></a>，分享策略、比较架构并帮助形成最佳实践。</p></li>
</ul>
<p>今天掌握上下文工程的公司将塑造明天的人工智能格局。不要让基础设施成为制约因素--为您的人工智能创造力打下坚实的基础。</p>
