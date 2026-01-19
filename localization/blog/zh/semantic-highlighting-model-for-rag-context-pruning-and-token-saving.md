---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: 我们如何为 RAG 上下文剪枝和标记保存构建语义高亮模型
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: 'https://assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png'
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: 了解 Zilliz 如何利用纯编码器架构、LLM 推理和大规模双语训练数据，为 RAG 噪声过滤、上下文剪枝和标记保存建立语义高亮模型。
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">问题所在：RAG 噪音和令牌浪费<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>向量搜索</strong>是 RAG 系统（企业助理、人工智能 Agents、客户支持机器人等）的坚实基础。它能可靠地找到重要的文档。但是，仅靠检索并不能解决上下文问题。即使是经过良好调整的索引也会返回具有广泛相关性的语块，而这些语块中只有一小部分句子真正回答了查询。</p>
<p>在生产系统中，这种差距会立即显现出来。一个查询可能会拉入几十个文档，每个文档都有数千个标记。只有少数几个句子包含实际信号；其余的都是上下文，会增加标记的使用，减慢推理速度，并经常分散 LLM 的注意力。在 Agents 工作流程中，问题变得更加明显，因为查询本身就是多步推理的结果，而且只与检索文本的一小部分相匹配。</p>
<p>这就明显需要一种模型，能够<em><strong>识别并突出</strong></em> <em>有用的句子，忽略其余部分--本质上就是</em>句子级相关性过滤，或者许多团队所说的<a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>上下文剪枝</strong></a>。这样做的目的很简单：保留重要的部分，在噪音到达 LLM 之前就将其丢弃。</p>
<p>传统的基于关键字的高亮处理无法解决这个问题。例如，如果用户问 "如何提高 Python 代码的执行效率？"，关键字高亮器会挑出 "Python "和 "效率"，但会漏掉真正回答问题的句子--"使用 NumPy 向量操作符代替循环"--因为它与查询不共享关键字。我们需要的是语义理解，而不是字符串匹配。</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">用于 RAG 噪声过滤和上下文剪枝的语义高亮模型<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>为了让RAG构建者更轻松地完成这项工作，我们训练并开源了一个语义高亮显示（<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>Semantic Highlighting）模型</strong></a>，用于识别和高亮显示检索文档中与查询语义更加一致的句子。目前，该模型在中英文两种语言中都能提供最先进的性能，并可直接插入现有的 RAG 管道中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>模型详情</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>授权许可</strong>MIT (商业友好)</p></li>
<li><p><strong>架构：</strong>基于 BGE-M3 Reranker v2 的 0.6B 纯编码器模型</p></li>
<li><p><strong>语境窗口</strong>8192 个 token</p></li>
<li><p><strong>支持语言</strong>英语和中文</p></li>
</ul>
<p>语义高亮（Semantic Highlighting）可提供相关性信号，以便只选择长检索文档中有用的部分。在实践中，该模型可实现以下功能</p>
<ul>
<li><p><strong>提高可解释性</strong>，显示文档中哪些部分真正重要</p></li>
<li><p>只向 LLM 发送突出显示的句子，<strong>令牌成本降低 70-80</strong></p></li>
<li><p><strong>更高的答案质量</strong>，因为模型看到的无关上下文更少</p></li>
<li><p><strong>调试更容易</strong>，因为工程师可以直接检查句子级别的匹配情况</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">评估结果：实现 SOTA 性能</h3><p>我们在多个数据集上对语义高亮显示模型进行了评估，这些数据集涵盖英语和中文，同时还包括域内和域外条件。</p>
<p>基准套件包括</p>
<ul>
<li><p><strong>英语多跨度 QA：</strong>multispanqa</p></li>
<li><p><strong>英语域外维基百科：</strong>wikitext2</p></li>
<li><p><strong>中文多跨 QA：</strong>multispanqa_zh</p></li>
<li><p><strong>中文域外维基百科：</strong>wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>评估的模型包括</p>
<ul>
<li><p>开放式普罗旺斯系列</p></li>
<li><p>Naver 的普罗旺斯/X 普罗旺斯系列</p></li>
<li><p>OpenSearch 的语义剔除器</p></li>
<li><p>我们训练的双语模型：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>在所有四个数据集中，我们的模型都名列前茅。更重要的是，它是<em>唯一一个</em>在中英文两个方面都表现出色的模型。同类竞争模型要么只专注于英文，要么在中文文本上表现出明显的性能下降。</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">我们如何构建这个语义高亮模型<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>为这项任务训练一个模型并不难；训练一个能处理早期问题并提供接近 SOTA 性能的<em>好</em>模型才是真正的工作。我们的方法主要集中在两方面：</p>
<ul>
<li><p><strong>模型架构：</strong>使用纯编码器设计以实现快速推理。</p></li>
<li><p><strong>训练数据：</strong>使用具有推理能力的 LLM 生成高质量的相关性标签，并利用本地推理框架扩展数据生成。</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">模型架构</h3><p>我们建立的模型是一个轻量级的<strong>纯编码器</strong>网络，它将上下文剪枝视为<strong>标记级相关性评分任务</strong>。这一设计灵感来自于 Naver 在 2025 年国际词表大会上推出的上下文剪枝方法<a href="https://arxiv.org/html/2501.16214v1">Provence</a>，该方法将剪枝从 "选择正确的大块 "重构为 "为每个标记评分"。该方法将剪枝从 "选择正确的语块 "重塑为 "对每个标记进行评分"，与语义高亮自然吻合，在语义高亮中，细粒度信号至关重要。</p>
<p>纯编码器模型并不是最新的架构，但在这里仍然非常实用：它们速度快、易于扩展，可以并行地为所有标记位置生成相关性评分。对于生产型 RAG 系统来说，速度优势远比使用更大的解码器模型更重要。</p>
<p>计算标记级相关性得分后，我们将其汇总为<strong>句子级</strong>得分。这一步将嘈杂的标记信号转化为稳定、可解释的相关性指标。高于可配置阈值的句子会被突出显示，其他句子则会被过滤掉。这样就形成了一种简单可靠的机制，用于选择与查询真正相关的句子。</p>
<h3 id="Inference-Process" class="common-anchor-header">推理过程</h3><p>在运行时，我们的语义高亮模型遵循一个简单的流程：</p>
<ol>
<li><p><strong>输入--</strong>流程从用户查询开始。检索到的文档被视为相关性评估的候选上下文。</p></li>
<li><p><strong>模型处理--</strong>查询和上下文被串联成一个序列：[BOS] + 查询 + 上下文</p></li>
<li><p>标记<strong>评分--</strong>上下文中的每个标记都会被赋予 0 到 1 之间的相关性分数，以反映其与查询的相关程度。</p></li>
<li><p><strong>句子聚合--</strong>在句子层面聚合标记得分，通常是通过平均的方式，为每个句子得出相关性得分。</p></li>
<li><p><strong>阈值过滤--</strong>得分高于可配置阈值的句子会被突出显示并保留下来，而得分低的句子则会被过滤掉，然后再传给下游 LLM。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">基础模型：BGE-M3 Reranker v2</h3><p>我们选择 BGE-M3 Reranker v2 作为基础模型有几个原因：</p>
<ol>
<li><p>它采用适合标记和句子评分的编码器架构</p></li>
<li><p>支持多种语言，对英文和中文都进行了优化</p></li>
<li><p>提供适合较长 RAG 文档的 8192 个标记上下文窗口</p></li>
<li><p>维持 0.6B 参数--足够强大，但计算量不大</p></li>
<li><p>确保基础模型具有足够的世界知识</p></li>
<li><p>针对 Rerankers 进行训练，这与相关性判断任务密切相关</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">训练数据：带有推理的 LLM 注释<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦我们确定了模型的架构，下一个挑战就是建立一个能真正训练出可靠模型的数据集。我们首先研究了 Open Provence 是如何处理这个问题的。他们的方法使用公共 QA 数据集和小型 LLM 来标注相关句子。这种方法的扩展性很好，而且易于自动化，因此对我们来说是一个很好的基准。</p>
<p>但我们很快就遇到了他们描述的同样问题：如果要求 LLM 直接输出句子级标签，结果并不总是稳定的。有些标签是正确的，其他的则有问题，而且事后很难清理。全手工标注也不是一种选择--我们需要的数据量远远超出了手工标注的范围。</p>
<p>为了在不牺牲可扩展性的前提下提高稳定性，我们做出了一项改变：LLM 必须为其输出的每个标签提供一个简短的推理片段。每个训练示例都包括查询、文档、句子跨度以及对句子相关或不相关原因的简要解释。这一小小的调整使注释更加一致，并为我们在验证或调试数据集时提供了具体的参考。</p>
<p>事实证明，加入理由说明具有惊人的价值：</p>
<ul>
<li><p><strong>提高注释质量：</strong>写出理由可以起到自我检查的作用，从而减少随意或不一致的标注。</p></li>
<li><p><strong>更好的可观察性：</strong>我们可以看到<em>为什么</em>会选择某个句子，而不是把标签当作黑箱。</p></li>
<li><p><strong>更容易调试：</strong>当出现问题时，推理可以让我们很容易地发现问题出在提示、领域还是注释逻辑上。</p></li>
<li><p><strong>可重复使用的数据：</strong>即使将来我们改用了不同的标注模型，推理轨迹仍可用于重新标注或审核。</p></li>
</ul>
<p>注释工作流程如下</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">用于注释的 Qwen3 8B</h3><p>我们选择 Qwen3 8B 进行标注，是因为它通过输出原生支持 "思考模式"，从而更容易提取一致的推理轨迹。较小的模型无法为我们提供稳定的标签，而较大的模型对于这种管道来说速度较慢，而且成本过高。Qwen3 8B 在质量、速度和成本之间取得了恰当的平衡。</p>
<p>我们使用<strong>本地 vLLM 服务</strong>而不是云 API 运行所有注释。这为我们带来了高吞吐量、可预测的性能和更低的成本--实际上是用 GPU 时间换取 API 令牌费用，这在生成数百万个样本时是更划算的交易。</p>
<h3 id="Dataset-Scale" class="common-anchor-header">数据集规模</h3><p>我们总共创建了<strong>500 多万个双语训练样本</strong>，其中英文和中文<strong>样本</strong>各占一半。</p>
<ul>
<li><p><strong>英文数据源：</strong>MS MARCO、Natural Questions、GooAQ</p></li>
<li><p><strong>中文来源</strong>DuReader, 中文维基百科, mmarco_chinese</p></li>
</ul>
<p>部分数据集来自于对开放普罗旺斯等项目使用的现有数据的重新标注。其余数据集来自原始语料库，首先创建查询-上下文对，然后使用我们基于推理的管道对其进行标注。</p>
<p>所有标注的训练数据也可在 HuggingFace 上获取，供社区开发和训练参考：<a href="https://huggingface.co/zilliz/datasets">Zilliz 数据集</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">训练方法</h3><p>模型架构和数据集准备就绪后，我们在<strong>8× A100 GPU</strong>上对模型进行了三个历元的训练，端到端大约耗时<strong>9 小时</strong>。</p>
<p><strong>注：</strong>训练只针对负责语义高亮任务的<strong>剪枝头</strong>。我们没有对<strong>Rerankers Head</strong> 进行训练，因为只专注于剪枝目标会为句子级相关性评分带来更好的结果。</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">真实世界案例研究<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>基准测试只能说明问题的一部分，下面是一个真实的案例，展示了模型在常见边缘情况下的表现：当检索到的文本同时包含正确答案和一个非常诱人的干扰项时。</p>
<p><strong>查询：</strong> <em>谁写了《杀死一只圣鹿》？</em></p>
<p><strong>上下文（5 句）：</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>正确答案：第 1 句（明确指出 "编剧是兰斯莫斯和 Efthymis Filippou"）。</p>
<p>这个例子有一个陷阱：第 3 句提到 "欧里庇得斯 "写了原剧。但问题问的是 "电影《杀死一只圣鹿》是谁写的"，答案应该是电影的编剧，而不是几千年前的希腊剧作家。</p>
<h3 id="Model-results" class="common-anchor-header">模型结果</h3><table>
<thead>
<tr><th>模型</th><th>找到正确答案？</th><th>预测</th></tr>
</thead>
<tbody>
<tr><td>我们的模型</td><td>✓</td><td>所选句子 1（正确）和 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>只选择了句子 3，错过了正确答案</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>只选择了句子 3，错过了正确答案</td></tr>
</tbody>
</table>
<p><strong>关键句得分比较：</strong></p>
<table>
<thead>
<tr><th>句子</th><th>我们的模型</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>句子 1（电影剧本，正确答案）</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>句子 3（原创剧本，干扰项）</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>XProvence 模型：</p>
<ul>
<li><p>强烈被 "欧里庇得斯 "和 "戏剧 "吸引，给句子 3 打出接近满分的分数（0.947 和 0.802）</p></li>
<li><p>完全忽略实际答案（句子 1），得分极低（0.133 和 0.081）</p></li>
<li><p>即使将阈值从 0.5 降到 0.2，它仍然无法找到正确答案</p></li>
</ul>
<p>我们的模型</p>
<ul>
<li><p>正确给予句子 1 最高分 (0.915)</p></li>
<li><p>由于句子 3 与背景相关，因此仍赋予其一定的相关性 (0.719)</p></li>
<li><p>以 ~0.2 的差值将两个句子明确分开</p></li>
</ul>
<p>这个例子显示了模型的核心优势：理解<strong>查询意图</strong>，而不仅仅是匹配表面关键字。在这种情况下，"<em>《杀死一只圣鹿》</em>是谁写的 "指的是电影，而不是古希腊戏剧。我们的模型能够捕捉到这一点，而其他模型则会被强烈的词汇线索所干扰。</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">试用并告诉我们您的想法<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>我们的<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>模型现已在 MIT 许可下完全开源，可供生产使用。您可以将其插入到您的 RAG 管道中，根据自己的领域对其进行微调，或在其基础上构建新的工具。我们也欢迎来自社区的贡献和反馈。</p>
<ul>
<li><p><strong>从 HuggingFace 下载</strong>：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>所有注释训练数据</strong>：<a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Milvus和Zilliz Cloud中提供的语义高亮功能</h3><p>语义高亮也直接内置于<a href="https://milvus.io/">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（全面管理的Milvus）中，让用户清楚地了解每份文档被检索的<em>原因</em>。您无需扫描整个文档块，而是可以立即看到与您的查询相关的具体句子--即使措辞并不完全匹配。这使得检索更容易理解，调试速度也更快。对于 RAG 管道而言，它还明确了下游 LLM 应关注的内容，这有助于进行及时的设计和质量检查。</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>免费试用完全托管的Zilliz Cloud中的语义高亮（Semantic Highlighting）功能</strong></a></p>
<p>我们很乐意听听您的使用情况--错误报告、改进意见或您在将其集成到工作流程中时发现的任何问题。</p>
<p>如果您想了解更多详情，请随时加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>或预约 20 分钟的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>会议。我们很乐意与其他建设者聊天并交换意见。</p>
<h2 id="Acknowledgements" class="common-anchor-header">鸣谢<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>这项工作建立在许多伟大的想法和开源贡献的基础之上，我们希望强调那些使这一模型成为可能的项目。</p>
<ul>
<li><p><strong>Provence</strong>使用轻量级编码器模型为上下文剪枝引入了一个简洁实用的框架。</p></li>
<li><p><strong>开放式普罗旺斯</strong>提供了坚实、精心设计的代码库--训练管道、数据处理和模型头--采用许可授权。这为我们的实验提供了一个坚实的起点。</p></li>
</ul>
<p>在此基础上，我们又做出了一些自己的贡献：</p>
<ul>
<li><p>使用<strong>LLM 推理</strong>生成更高质量的相关性标签</p></li>
<li><p>创建<strong>近 500 万个</strong>与真实 RAG 工作负载相一致的双语训练样本</p></li>
<li><p>选择更适合长语境相关性评分的基础模型<strong>（BGE-M3 Reranker v2）</strong></p></li>
<li><p>只训练<strong>剪枝头</strong>，使模型专门用于语义加亮</p></li>
</ul>
<p>我们非常感谢 Provence 和 Open Provence 团队公开发布他们的工作成果。他们的贡献大大加快了我们的开发速度，使本项目成为可能。</p>
