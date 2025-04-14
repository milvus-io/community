---
id: how-to-choose-the-right-embedding-model.md
title: 如何选择正确的 Embeddings 模型？
author: Lumina Wang
date: 2025-04-09T00:00:00.000Z
desc: 探索选择正确嵌入模型的基本要素和最佳实践，以实现有效的数据表示并提高性能。
cover: assets.zilliz.com/Complete_Workflow_31b4ac825c.gif
tag: Engineering
tags: >-
  Embedding Model, RAG, Model Selection, Machine Learning, Performance
  Optimization
canonicalUrl: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model.md'
---
<p>在构建可理解和处理文本、图像或音频等<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据的</a>系统时，选择正确的<a href="https://zilliz.com/ai-models">Embeddings 模型</a>是一项关键决策。这些模型能将原始输入转化为固定大小的高维向量，从而捕捉语义，在相似性搜索、推荐、分类等方面实现强大的应用。</p>
<p>但并非所有的 Embeddings 模型都是一样的。面对如此多的选择，您该如何正确选择呢？错误的选择可能导致次优的准确性、性能瓶颈或不必要的成本。本指南提供了一个实用框架，帮助您评估和选择最适合您特定要求的嵌入模型。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Complete_Workflow_31b4ac825c.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="1-Define-Your-Task-and-Business-Requirements" class="common-anchor-header">1.确定任务和业务要求<button data-href="#1-Define-Your-Task-and-Business-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>在选择嵌入模型之前，首先要明确您的核心目标：</p>
<ul>
<li><strong>任务类型：</strong>首先确定您正在构建的核心应用--语义搜索、推荐系统、分类管道或其他完全不同的应用。每种用例对 Embeddings 应如何表示和组织信息都有不同的要求。例如，如果您正在构建一个语义搜索引擎，就需要像 Sentence-BERT 这样的模型来捕捉查询和文档之间细微的语义，确保相似的概念在向量空间中比较接近。对于分类任务来说，Embeddings 必须反映出特定类别的结构，从而使来自同一类别的输入在向量空间中靠近放置。这样下游分类器就更容易区分类别。常用的模型有 DistilBERT 和 RoBERTa。在推荐系统中，我们的目标是找到能反映用户与物品之间关系或偏好的 Embeddings。为此，您可能会使用像神经协同过滤（NCF）这样根据隐式反馈数据专门训练的模型。</li>
<li><strong>投资回报率评估：</strong>根据具体的业务环境，平衡性能与成本。任务关键型应用（如医疗诊断）可能需要使用精度更高的高级模型，因为这可能是同类和死亡的问题，而对成本敏感的大批量应用则需要仔细进行成本效益分析。关键是要确定在特定情况下，仅仅 2%-3% 的性能提升是否能证明潜在的大幅成本增加是合理的。</li>
<li><strong>其他限制因素：</strong>在缩小选择范围时，考虑您的技术要求。如果您需要多语言支持，许多通用模型在处理非英语内容时都很吃力，因此可能需要专门的多语言模型。如果您从事的是专业领域（医疗/法律）的工作，通用嵌入通常会遗漏特定领域的专业术语--例如，它们可能不理解 "<em>stat "</em>在医疗语境中的意思是<em>"立即"，</em>或者 "<em>consideration</em> <em>"</em>在法律文件中指的是合同中交换的有价值的东西。同样，硬件限制和延迟要求也会直接影响哪些模型适合您的部署环境。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/clarify_task_and_business_requirement_b1bce2ccc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="2-Evaluate-Your-Data" class="common-anchor-header">2.评估数据<button data-href="#2-Evaluate-Your-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>数据的性质会对嵌入模型的选择产生重大影响。主要考虑因素包括</p>
<ul>
<li><strong>数据模式：</strong>您的数据是文本数据、可视数据还是多模态数据？将模型与数据类型相匹配。对文本使用<a href="https://zilliz.com/learn/what-is-bert">BERT</a>或<a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence-BERT</a>等基于变换器的模型，对图像使用<a href="https://zilliz.com/glossary/convolutional-neural-network">CNN 架构</a>或视觉变换器<a href="https://zilliz.com/learn/understanding-vision-transformers-vit">(ViT</a>)，对音频使用专门的模型，对多模态应用使用<a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>和 MagicLens 等多模态模型。</li>
<li><strong>特定领域：</strong>考虑通用模型是否足够，或者是否需要能理解专业知识的特定领域模型。在不同数据集上训练的通用模型（如<a href="https://zilliz.com/ai-models/text-embedding-3-large">OpenAI 文本 Embeddings 模型</a>）对于常见主题效果很好，但往往会忽略专业领域的细微区别。然而，在医疗保健或法律服务等领域，它们往往会错过细微的区别--因此，像<a href="https://arxiv.org/abs/1901.08746">BioBERT</a>或<a href="https://arxiv.org/abs/2010.02559">LegalBERT</a>这样的特定领域嵌入可能更适合。</li>
<li><strong>嵌入类型：</strong> <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">稀疏嵌入</a>擅长关键词匹配，是产品目录或技术文档的理想选择。密集嵌入则能更好地捕捉语义关系，因此适合自然语言查询和意图理解。许多生产系统（如电子商务推荐系统）都受益于利用这两种类型的混合方法--例如，使用<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a>（稀疏）进行关键词匹配，同时添加 BERT（密集嵌入）来捕捉语义相似性。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_your_data_6caeeb813e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="3-Research-Available-Models" class="common-anchor-header">3.研究现有模型<button data-href="#3-Research-Available-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>了解任务和数据之后，就该研究可用的 Embeddings 模型了。以下是您可以采用的方法：</p>
<ul>
<li><p><strong>人气：</strong>优先考虑社区活跃、应用广泛的模型。这些模型通常有更好的文档、更广泛的社区支持和定期更新。这可以大大降低实施难度。熟悉你所在领域的领先模型。例如</p>
<ul>
<li>对于文本：考虑 OpenAI 嵌入、Sentence-BERT 变体或 E5/BGE 模型。</li>
<li>图像：查看 ViT 和 ResNet，或 CLIP 和 SigLIP 用于文本-图像对齐。</li>
<li>音频：查看 PNN、CLAP 或<a href="https://zilliz.com/learn/top-10-most-used-embedding-models-for-audio-data">其他常用模型</a>。</li>
</ul></li>
<li><p><strong>版权和许可</strong>：仔细评估许可证的影响，因为它们直接影响短期和长期成本。开源模型（如 MIT、Apache 2.0 或类似许可）具有修改和商业使用的灵活性，可让您完全控制部署，但需要基础设施方面的专业知识。通过应用程序接口访问的专有模型具有方便性和简单性，但会带来持续成本和潜在的数据隐私问题。对于受监管行业的应用来说，这一决定尤为重要，因为在这些行业中，尽管初始投资较高，但数据主权或合规性要求可能会使自托管成为必要。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_research2_b0df75cb55.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="4-Evaluate-Candidate-Models" class="common-anchor-header">4.评估候选模型<button data-href="#4-Evaluate-Candidate-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>筛选出几个模型后，就该用样本数据对其进行测试了。以下是您应该考虑的关键因素：</p>
<ul>
<li><strong>评估：</strong>在评估 Embeddings 质量（尤其是在检索增强生成（RAG）或搜索应用中）时，衡量返回结果的<em>准确性、相关性和完整性</em>非常重要。关键指标包括忠实度、答案相关性、上下文精确度和召回率。Ragas、DeepEval、Phoenix 和 TruLens-Eval 等框架为评估嵌入质量的不同方面提供了结构化方法，从而简化了评估流程。数据集对于有意义的评估同样重要。这些数据集可以是手工制作的真实用例，也可以是 LLMs 为测试特定功能而合成的数据集，还可以是使用 Ragas 和 FiddleCube 等工具针对特定测试方面创建的数据集。数据集和框架的正确组合取决于您的具体应用，以及您需要的评估粒度水平，以便做出有把握的决策。</li>
<li><strong>基准性能：</strong>在特定任务的基准（如检索的 MTEB）上对模型进行评估。请记住，不同场景（搜索与分类）、不同数据集（通用数据集与特定领域数据集，如 BioASQ）和不同指标（准确性、速度）的排名会有很大不同。虽然基准性能能提供有价值的见解，但并不总是能完美地转化为实际应用。交叉检查与您的数据类型和目标相一致的最佳性能，但一定要使用您自己的自定义测试用例进行验证，以确定哪些模型可能过于符合基准，但在实际条件下与您的特定数据模式相比却表现不佳。</li>
<li><strong>负载测试：</strong>对于自托管模型，模拟真实的生产负载来评估实际条件下的性能。在推理过程中测量吞吐量以及 GPU 利用率和内存消耗，以找出潜在的瓶颈。在处理并发请求或复杂输入时，孤立运行性能良好的模型可能会出现问题。如果模型过于耗费资源，那么无论其基准指标的准确性如何，都可能不适合大规模或实时应用。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_candidate_models_3a7edd9cd7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="5-Model-Integration" class="common-anchor-header">5.模型集成<button data-href="#5-Model-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>选定模型后，现在就该规划集成方法了。</p>
<ul>
<li><strong>权重选择：</strong>是使用预训练的权重快速部署，还是根据特定领域的数据进行微调以提高性能。请记住，微调可以提高性能，但需要大量资源。考虑性能提升是否能证明额外的复杂性是合理的。</li>
<li><strong>自托管与第三方推理服务：</strong>根据您的基础设施能力和要求选择部署方法。自托管可让您完全控制模型和数据流，有可能降低大规模每次请求的成本，并确保数据隐私。不过，这需要基础设施方面的专业知识和持续维护。第三方推理服务只需最少的设置即可实现快速部署，但会引入网络延迟、潜在的使用上限和持续成本，这些成本在大规模使用时可能会变得非常高昂。</li>
<li><strong>集成设计：</strong>规划应用程序接口（API）设计、缓存策略、批处理方法以及<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量数据库</a>选择，以便高效地存储和查询 Embeddings。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_integration_8c8f0410c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="6-End-to-End-Testing" class="common-anchor-header">6.端到端测试<button data-href="#6-End-to-End-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>在全面部署之前，运行端到端测试以确保模型按预期运行：</p>
<ul>
<li><strong>性能</strong>：始终在自己的数据集上对模型进行评估，确保它们在特定用例中表现良好。考虑检索质量的 MRR、MAP 和 NDCG 等指标，准确性的精度、召回率和 F1，以及操作性能的吞吐量和延迟百分位数。</li>
<li><strong>鲁棒性</strong>：在不同条件下测试模型，包括边缘情况和不同的数据输入，以验证其性能的一致性和准确性。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/end_to_end_testing_7ae244a73b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>正如我们在本指南中所看到的，选择合适的嵌入模型需要遵循以下六个关键步骤：</p>
<ol>
<li>确定业务需求和任务类型</li>
<li>分析数据特征和领域特性</li>
<li>研究可用模型及其许可条款</li>
<li>根据相关基准和测试数据集严格评估候选模型</li>
<li>考虑部署选项，规划集成方法</li>
<li>在生产部署前进行全面的端到端测试</li>
</ol>
<p>通过遵循这一框架，您可以做出明智的决定，在性能、成本和特定用例的技术限制之间取得平衡。请记住，"最佳 "模型并不一定是基准分数最高的模型，而是在操作符限制下最能满足您特定要求的模型。</p>
<p>Embeddings 模型的发展日新月异，当新的选择出现并可能为您的应用带来重大改进时，值得定期重新评估您的选择。</p>
