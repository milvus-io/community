---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: LLM 上下文剪枝：开发人员指南：获得更好的 RAG 和 Agents AI 结果
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: 了解上下文剪枝在长上下文 RAG 系统中的工作原理、其重要性以及 Provence 等模型如何实现语义过滤并在实践中发挥作用。
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>最近，LLM 的上下文窗口变得越来越大。有些模型一次就能处理一百万个或更多的标记，而每个新版本似乎都在不断推高这一数字。这很令人兴奋，但如果你实际构建过任何使用长上下文的东西，你就会知道在<em>可能</em>和<em>有用</em>之间存在差距。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一个模型<em>能</em>在一次提示中读完一整本书，并不意味着你应该给它一次提示。大多数冗长的输入内容都是模型不需要的。一旦你开始将成百上千的标记输入一个提示符，你通常会得到更慢的响应、更高的计算费用，有时还会得到更低质量的答案，因为模型试图同时关注所有的东西。</p>
<p>因此，即使上下文窗口不断变大，真正的问题仍然是：<strong>我们到底应该在里面放些什么？</strong>这就是<strong>上下文修剪的</strong>用武之地。从根本上说，这就是对检索或组装的上下文中无助于模型回答问题的部分进行修剪的过程。如果方法得当，它能使系统保持快速、稳定，并且更具可预测性。</p>
<p>在本文中，我们将讨论为什么长上下文的表现往往与你的预期不同，剪枝如何帮助控制局面，以及<strong>Provence</strong>等剪枝工具如何融入实际的 RAG 管道，而不会让你的设置变得更加复杂。</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">长上下文系统中常见的四种故障模式<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>更大的上下文窗口并不能神奇地让模型变得更聪明。相反，一旦你开始在提示中塞入大量信息，你就会发现一系列新的出错方式。以下是在构建长语境或 RAG 系统时经常会遇到的四个问题。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1.上下文冲突</h3><p>当多个回合中积累的信息变得相互矛盾时，就会发生上下文冲突。</p>
<p>例如，用户可能会在对话初期说 "我喜欢苹果"，随后又说 "我不喜欢水果"。当这两种说法都保留在上下文中时，模型就没有可靠的方法来解决冲突，从而导致不一致或犹豫不决的反应。</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2.语境混淆</h3><p>当上下文包含大量不相关或弱相关的信息，使得模型难以选择正确的行动或工具时，就会出现上下文混乱。</p>
<p>这一问题在工具增强系统中尤为明显。当上下文中充斥着大量不相关的细节时，模型可能会误解用户意图，选择错误的工具或操作--这并不是因为缺少正确的选项，而是因为信号被掩盖在噪音之下。</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3.上下文分心</h3><p>当过多的上下文信息占据了模型的注意力，降低了模型对预先训练的知识和一般推理的依赖性时，就会出现上下文分心。</p>
<p>模型不依赖广泛学习的模式，而是过度重视上下文中的近期细节，即使这些细节不完整或不可靠。这可能会导致推理过于肤浅或脆性，过于紧密地反映上下文，而不是应用更高层次的理解。</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4.语境中毒</h3><p>当不正确的信息进入语境并在多个回合中被反复引用和强化时，就会出现语境中毒。</p>
<p>对话初期引入的一个错误陈述可能成为后续推理的基础。随着对话的继续，模型会建立在这一错误假设的基础上，使错误更加复杂，离正确答案越来越远。</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">什么是上下文剪枝及其重要性<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦开始处理较长的上下文，你很快就会意识到你需要不止一种技巧来控制局面。在实际系统中，团队通常会结合一系列策略--RAG、工具加载、汇总、隔离特定消息、卸载旧历史记录等。它们都以不同的方式提供帮助。但<strong>"上下文剪枝"（Context Pruning）</strong>是直接决定<em>哪些信息会被送入</em>模型的手段。</p>
<p>简单来说，上下文剪枝就是在无关信息、低价值信息或冲突信息进入模型上下文窗口之前自动将其删除的过程。它基本上是一个过滤器，只保留对当前任务最重要的文本片段。</p>
<p>其他策略可能会重组上下文、压缩上下文或将某些部分放到一边备用。剪枝策略更为直接：<strong>它回答的问题是 "这部分信息是否应该出现在提示中？</strong></p>
<p>这就是为什么剪枝在 RAG 系统中尤为重要。向量搜索很好，但并不完美。它经常会返回一大袋候选信息--有些有用，有些关系松散，有些完全不靠谱。如果你把它们都扔进提示器，就会遇到我们前面提到的失败模式。剪枝位于检索和模型之间，就像一个看门人，决定哪些数据块需要保留。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>当剪枝工作顺利进行时，好处就会立即显现出来：上下文更清晰、答案更一致、标记使用率更低、无关文本潜入造成的奇怪副作用更少。即使不改变检索设置，增加一个可靠的剪枝步骤也能明显改善系统的整体性能。</p>
<p>在实践中，剪枝是长语境或 RAG 管道中效率最高的优化之一--想法简单，影响巨大。</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">普罗旺斯实用的上下文剪枝模型<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>在探索上下文剪枝方法时，我发现了<strong>Naver Labs Europe</strong> 开发的两个引人注目的开源模型：<a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a>及其多语言变体<a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence 是一种为检索增强生成训练轻量级上下文剪枝模型的方法，尤其侧重于问题解答。给定一个用户问题和一个检索到的段落，它会识别并删除无关的句子，只保留对最终答案有帮助的信息。</p>
<p>通过在生成前修剪低价值内容，Provence 减少了模型输入中的噪音，缩短了提示时间，降低了 LLM 推理延迟。它还具有即插即用的特点，可与任何 LLM 或检索系统配合使用，无需进行紧密集成或架构更改。</p>
<p>Provence 为现实世界中的 RAG 管道提供了几项实用功能。</p>
<p><strong>1.文档级理解</strong></p>
<p>Provence 将文档作为一个整体进行推理，而不是孤立地对句子进行评分。这一点很重要，因为现实世界中的文档经常包含 "it"、"this "或 "the method above "等引用。孤立地看，这些句子可能模棱两可，甚至毫无意义。如果结合上下文来看，它们的相关性就会一目了然。通过对文档进行整体模型化，Provence 可以做出更准确、更连贯的剪枝决定。</p>
<p><strong>2.自适应句子选择</strong></p>
<p>Provence 会自动决定从检索到的文档中保留多少句子。它不依赖于 "保留前五句 "这样的固定规则，而是根据查询和内容进行调整。</p>
<p>有些问题只需一个句子就能回答，而其他问题则需要多个辅助语句。Provence 可以动态地处理这种变化，它使用的相关性阈值在各个领域都能很好地发挥作用，并且可以在需要时进行调整--在大多数情况下无需手动调整。</p>
<p><strong>3.通过集成 Rerankers 实现高效率</strong></p>
<p>Provence 的设计宗旨是高效。它是一个紧凑、轻量级的模型，与基于 LLM 的剪枝方法相比，运行速度明显更快、成本更低。</p>
<p>更重要的是，Provence 可以将 Rerankers 和上下文剪枝合并为一个步骤。由于重排已经是现代 RAG 管道中的一个标准阶段，在这一点上整合剪枝使得上下文剪枝的额外成本接近于零，同时还能提高传递给语言模型的上下文质量。</p>
<p><strong>4.通过 XProvence 支持多语言</strong></p>
<p>Provence 还有一个名为 XProvence 的变体，它使用相同的架构，但在多语言数据上进行训练。这使它能够评估跨语言（如中文、英文和韩文）的查询和文档，从而适用于多语言和跨语言 RAG 系统。</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">如何训练 Provence</h3><p>Provence 采用基于交叉编码器架构的简洁有效的训练设计。在训练过程中，查询和每个检索到的段落都被串联成一个输入，并一起编码。这样，模型就能同时观察到问题和段落的全部上下文，并直接推理出它们的相关性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种联合编码使 Provence 能够从细粒度的相关性信号中学习。该模型在<a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a>上作为轻量级编码器进行了微调，并进行了优化，以同时执行两项任务：</p>
<ol>
<li><p><strong>文档级相关性评分（Rerankers 分数）：</strong>该模型预测整个文档的相关性得分，表明其与查询的匹配程度。例如，0.8 分代表强相关性。</p></li>
<li><p><strong>令牌级相关性标记（二进制掩码）：</strong>与此同时，模型会给每个标记符分配一个二进制标签，标明它与查询是相关（<code translate="no">1</code> ）还是不相关（<code translate="no">0</code> ）。</p></li>
</ol>
<p>因此，训练有素的模型可以评估文档的整体相关性，并确定哪些部分应该保留或删除。</p>
<p>在推理时，Provence 会在标记级别预测相关性标签。然后在句子层面对这些预测进行汇总：如果一个句子包含的相关标记多于不相关标记，则保留该句子；反之，则删除该句子。由于模型是在句子级别的监督下进行训练的，因此同一句子中的标记预测往往是一致的，这使得这种聚合策略在实践中是可靠的。剪枝行为也可以通过调整聚合阈值来实现更保守或更激进的剪枝。</p>
<p>最重要的是，Provence 重用了大多数 RAG 管道已经包含的重排步骤。这意味着增加上下文剪枝几乎不需要额外的开销，这使得 Provence 特别适用于现实世界中的 RAG 系统。</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">评估不同模型的上下文剪枝性能<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>到目前为止，我们主要介绍了 Provence 的设计和训练。下一步是评估它在实践中的表现：它修剪上下文的效果如何，与其他方法相比如何，以及在真实世界条件下的表现如何。</p>
<p>为了回答这些问题，我们设计了一组定量实验，在现实评估环境中比较多个模型的上下文剪枝质量。</p>
<p>实验重点关注两个主要目标：</p>
<ul>
<li><p><strong>剪枝效果：</strong>我们使用精确度、召回率和 F1 分数等标准指标来衡量每个模型在去除无关信息的同时保留相关内容的准确度。</p></li>
<li><p><strong>域外泛化：</strong>我们评估每个模型在不同于其训练数据的数据分布上的表现，从而评估其在域外场景中的鲁棒性。</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">比较的模型</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>普罗旺斯</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch Semantic Highlighter</strong></a>（基于 BERT 架构的剪枝模型，专为语义高亮任务而设计）</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">数据集</h3><p>我们使用 WikiText-2 作为评估数据集。WikiText-2 源自维基百科文章，包含多种文档结构，其中的相关信息往往分布在多个句子中，语义关系可能并不复杂。</p>
<p>重要的是，WikiText-2 与通常用于训练上下文剪枝模型的数据有很大不同，但仍然类似于现实世界中的知识密集型内容。这使得它非常适合域外评估，而这正是我们实验的重点。</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">查询生成和注释</h3><p>为了构建域外剪枝任务，我们使用<strong>GPT-4o-mini</strong> 从原始 WikiText-2 语料库中自动生成问答对。每个评估样本由三个部分组成：</p>
<ul>
<li><p><strong>查询：</strong>从文档中生成的自然语言问题。</p></li>
<li><p><strong>上下文：</strong>未经修改的完整文档。</p></li>
<li><p><strong>地面实况：</strong>句子级注释，表明哪些句子包含答案（保留），哪些句子无关（剪枝）。</p></li>
</ul>
<p>这种设置很自然地定义了上下文剪枝任务：给定查询和完整文档后，模型必须识别出真正重要的句子。包含答案的句子被标记为相关句，应予以保留，而其他句子则被视为不相关句，应予以剪枝。这种表述方式允许使用精确度、召回率和 F1 分数来量化衡量剪枝质量。</p>
<p>最重要的是，生成的问题不会出现在任何评估模型的训练数据中。因此，性能反映的是真正的泛化而不是记忆。我们总共生成了 300 个样本，涵盖了简单的基于事实的问题、多跳推理任务和更复杂的分析提示，以更好地反映真实世界的使用模式。</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">评估流程</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>超参数优化：对于每个模型，我们都会在预定义的超参数空间内进行网格搜索，并选择能使 F1 分数最大化的配置。</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">结果与分析</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>结果显示，三种模型之间存在明显的性能差异。</p>
<p><strong>普罗旺斯</strong>的整体性能最强，<strong>F1 得分为 66.76%</strong>。其精确度<strong>（69.53%</strong>）和召回率<strong>（64.19%</strong>）非常均衡，表明其具有强大的域外泛化能力。最佳配置使用的剪枝阈值为<strong>0.6</strong>和 α<strong>= 0.051</strong>，这表明模型的相关性得分校准良好，剪枝行为直观且易于在实践中调整。</p>
<p><strong>XProvence</strong>的<strong>F1 得分为 58.97%</strong>，特点是<strong>召回率高（75.52%）</strong>，<strong>精度较低（48.37%）</strong>。这反映了一种更为保守的剪枝策略，即优先保留潜在的相关信息，而不是积极去除噪音。在误报代价高昂的领域（如医疗保健或法律应用），这种行为可能是可取的，但它也会增加误报率，从而降低精确度。尽管如此，XProvence 的多语言功能使其成为非英语或跨语言环境的有力选择。</p>
<p>相比之下，<strong>OpenSearch Semantic Highlighter</strong>的表现要差得多，<strong>F1 得分为 46.37%</strong>（精确度<strong>62.35%</strong>，召回率<strong>36.98%</strong>）。与Provence和XProvence的差距表明，在分数校准和域外泛化方面都存在局限性，尤其是在域外条件下。</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">语义高亮找到文本中真正重要内容的另一种方法<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我们已经谈到了上下文剪枝，那么就应该看看拼图中的相关部分：<a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>语义高亮</strong></a>。从技术上讲，这两种功能的基本工作几乎是一样的--它们都是根据文本片段与查询的相关程度对其进行评分。区别在于如何在管道中使用结果。</p>
<p>大多数人一听到 "高亮"，就会想到 Elasticsearch 或 Solr 中的经典关键词高亮工具。这些工具基本上是查找字面上的关键词匹配，然后用类似<code translate="no">&lt;em&gt;</code> 这样的东西将其包装起来。这些工具既便宜又可预测，但只有在文本使用了与查询<em>完全相同</em>的词语时才会起作用。如果文档进行了转述、使用了同义词或对观点进行了不同的表述，传统的高亮工具就会完全错过。</p>
<p><strong>语义高亮则采取了不同的方法。</strong>它不检查精确的字符串匹配，而是使用一个模型来估计查询和不同文本跨度之间的语义相似性。这样，即使措辞完全不同，它也能突出显示相关内容。对于 RAG 管道、Agent 工作流或任何人工智能搜索系统来说，意义比词组更重要，语义高亮可以让你更清楚地了解检索文档的<em>原因</em>。</p>
<p>问题在于，大多数现有的语义高亮解决方案都不是为生产型人工智能工作负载而构建的。我们测试了所有可用的解决方案，但没有一个能提供真正的 RAG 和 Agents 系统所需的精度、延迟或多语言可靠性。因此，我们最终训练并开源了自己的模型：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1。</a></p>
<p>从高层次来看，<strong>上下文剪枝和语义高亮解决的是相同的核心任务</strong>：给定一个查询和一大段文本，找出其中真正重要的部分。唯一的区别在于接下来会发生什么。</p>
<ul>
<li><p><strong>上下文剪枝会</strong>在生成前删除不相关的部分。</p></li>
<li><p><strong>语义高亮则</strong>保留全文，但在视觉上<strong>突出</strong>重要的部分。</p></li>
</ul>
<p>由于底层操作符非常相似，因此相同的模型通常可以支持这两种功能。这样就更容易在堆栈中重复使用组件，并使 RAG 系统在整体上更简单、更高效。</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Milvus和Zilliz Cloud中的语义高亮功能</h3><p><a href="https://milvus.io">Milvus</a>和<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>（Milvus的全面托管服务）现在完全支持语义高亮，而且它已经被证明对任何使用RAG或人工智能驱动搜索的人都非常有用。该功能解决了一个非常简单但令人头疼的问题：当向量搜索返回大量语块时，如何快速找出<em>这些语块中哪些句子是真正重要的</em>？</p>
<p>如果没有高亮功能，用户最终只能通过阅读整个文档来了解为什么会检索到某些内容。有了内置的语义高亮功能，Milvus 和 Zilliz Cloud 可以自动标记与您的查询语义相关的特定句段，即使措辞不同也是如此。无需再寻找匹配的关键字或猜测某块内容出现的原因。</p>
<p>这使得检索更加透明。Milvus 不只是返回 "相关文档"，而是显示相关性<em>所在</em>。对于 RAG 管道，这一点尤其有帮助，因为您可以立即看到模型应该关注的内容，从而使调试和提示构建变得更加容易。</p>
<p>我们在 Milvus 和 Zilliz Cloud 中直接内置了这种支持，因此您不必为了获得可用的归因而附加外部模型或运行其他服务。一切都在检索路径中运行：向量搜索 → 相关性评分 → 突出显示跨度。它可以开箱即用，并通过我们的<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>模型支持多语言工作负载。</p>
<h2 id="Looking-Ahead" class="common-anchor-header">展望未来<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>上下文工程仍然是一项全新的技术，还有很多问题有待解决。即使剪枝和语义高亮在<a href="https://milvus.io">Milvus</a>和<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>中运行良好<strong>，</strong>我们也远未到故事结束的时候。还有很多领域需要真正的工程设计工作--在不降低速度的前提下提高剪枝模型的准确性，更好地处理奇怪的或领域外的查询，并将所有环节连接起来，使检索→Rerankers→剪枝→高亮感觉就像一个简洁的流水线，而不是粘在一起的一组黑客。</p>
<p>随着上下文窗口的不断增加，这些决策只会变得越来越重要。良好的上下文管理不再是 "锦上添花"，它已成为长上下文和 RAG 系统可靠运行的核心部分。</p>
<p>我们将继续进行实验、基准测试，并推出能真正为开发人员带来改变的产品。我们的目标很简单：让构建系统变得更容易，使其不会在混乱的数据、不可预测的查询或大规模工作负载下崩溃。</p>
<p>如果您想讨论其中的任何问题，或者只是需要调试方面的帮助，您可以进入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>，或者通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预约 20 分钟的一对一会议，以获得见解、指导和问题解答。</p>
<p>我们总是很乐意与其他建设者聊天和交流。</p>
