---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: 我们为生产型 RAG 和人工智能搜索训练并开源了一个双语语义突出显示模型
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: 深入了解语义高亮，了解 Zilliz 的双语模型是如何建立的，以及它在 RAG 系统的中英文基准测试中的表现如何。
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>无论您是在构建产品搜索、RAG 管道还是人工智能代理，用户最终都需要同样的东西：一种快速查看结果为何相关的方法。<strong>高亮功能</strong>通过标记支持匹配的准确文本来帮助用户，这样用户就不必扫描整个文档。</p>
<p>大多数系统仍然依赖于基于关键字的高亮显示。如果用户搜索 "iPhone 性能"，系统就会突出显示 "iPhone "和 "性能 "这两个确切的标记。但是，一旦文本用不同的措辞表达了相同的意思，系统就会崩溃。像 "A15 仿生芯片，基准测试超过 100 万次，流畅无延迟 "这样的描述显然是针对性能的，但却没有突出显示任何内容，因为关键词从未出现过。</p>
<p><strong>语义高亮</strong>可以解决这个问题。它不是匹配精确的字符串，而是识别与查询语义一致的文本跨度。对于 RAG 系统、人工智能搜索和 Agents（相关性取决于意义而非表面形式）来说，这可以更精确、更可靠地解释检索文档的原因。</p>
<p>然而，现有的语义高亮方法并不是为生产型人工智能工作负载而设计的。在对所有可用解决方案进行评估后，我们发现没有一种方案能提供 RAG 管道、Agent 系统或大规模网络搜索所需的精度、延迟、多语言覆盖率或稳健性。<strong>因此，我们训练了自己的双语语义高亮模型，并将其开源。</strong></p>
<ul>
<li><p>我们的语义高亮模型：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>请告诉我们您的想法--加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord</a>，在<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> 上关注我们，或与我们预约一次<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">20 分钟的 Milvus Office Hours</a>会议。</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">基于关键词的高亮是如何工作的--以及它在现代人工智能系统中失败的原因<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>传统的搜索系统通过简单的关键词匹配来实现高亮功能</strong>。当返回结果时，引擎会找到与查询相匹配的确切标记位置，并将其封装在标记中（通常是<code translate="no">&lt;em&gt;</code> 标记），然后让前端来呈现高亮显示。当查询词逐字出现在文本中时，这种方法很有效。</p>
<p>问题在于，这种模型假定相关性与精确的关键词重叠相关。一旦这一假设被打破，可靠性就会迅速下降。任何以不同措辞表达正确想法的结果，即使检索步骤是正确的，最终也不会有高亮显示。</p>
<p>这一弱点在现代人工智能应用中变得非常明显。在 RAG 管道和人工智能 Agents 工作流程中，查询更加抽象，文档更长，相关信息可能不会重复使用相同的词语。基于关键字的高亮显示无法再向开发人员或最终用户显示<em>答案的实际</em>位置，这使得整个系统即使在检索按预期运行时也感觉不够准确。</p>
<p>假设用户问<em>"如何提高 Python 代码的执行效率？</em>系统从向量数据库中检索到一份技术文档。传统的高亮功能只能标记字面匹配，如<em>"Python"、</em> <em>"代码"、"</em> <em>执行 "</em>和<em>"效率"。</em></p>
<p>然而，文档中最有用的部分可能是</p>
<ul>
<li><p>使用 NumPy 向量操作符代替显式循环</p></li>
<li><p>避免在循环内重复创建对象</p></li>
</ul>
<p>这些句子直接回答了问题，但它们不包含任何查询术语。因此，传统的高亮功能完全失效。文档可能是相关的，但用户仍需逐行扫描才能找到真正的答案。</p>
<p>对于人工智能 Agents 来说，这个问题变得更加突出。Agents 的搜索查询往往不是用户的原始问题，而是通过推理和任务分解产生的派生指令。例如，如果用户问<em>"能否分析一下最近的市场趋势？"，</em>Agents 可能会生成类似 "检索 2024 年第四季度消费电子产品的销售数据、同比增长率、主要竞争对手的市场份额变化以及供应链成本波动 "的查询。</p>
<p>这一查询跨越多个维度，编码了复杂的意图。然而，传统的基于关键字的高亮功能只能机械地标记<em>"2024"、</em> <em>"销售数据 "</em>或<em>"增长率 "</em>等字面匹配<em>。</em></p>
<p>与此同时，最有价值的洞察可能是这样的</p>
<ul>
<li><p>iPhone 15 系列推动了更广泛的市场复苏</p></li>
<li><p>芯片供应紧张导致成本上升 15</p></li>
</ul>
<p>这些结论可能与查询没有一个共同的关键词，尽管它们正是代理商试图提取的内容。Agents 需要从大量的检索内容中快速识别出真正有用的信息，而基于关键字的高亮功能并不能提供真正的帮助。</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">什么是语义高亮以及当今解决方案的痛点<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>语义高亮基于语义搜索背后的相同理念：基于意义而非精确词进行匹配</strong>。在语义搜索中，Embeddings 模型将文本映射为向量，这样搜索系统--通常由<a href="https://milvus.io/">Milvus</a>这样的向量数据库提供支持--<a href="https://milvus.io/">就能</a>检索到与查询表达相同意思的段落，即使措辞有所不同。语义高亮将这一原则应用到更细的粒度上。它不是标记字面的关键词命中，而是突出显示文档中与用户意图在语义上相关的特定段落。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种方法解决了传统高亮的一个核心问题，即只有当查询词逐字出现时，高亮才会起作用。如果用户搜索 "iPhone 性能"，基于关键字的高亮显示就会忽略 "A15 仿生芯片"、"超过 100 万的基准测试 "或 "流畅无延迟 "等短语，即使这些短语明显回答了问题。语义高亮可以捕捉这些意义驱动的关联，并显示用户真正关心的文本部分。</p>
<p>理论上，这是一个简单明了的语义匹配问题。现代嵌入模型已经对相似性进行了很好的编码，因此概念部分已经到位。挑战来自于现实世界的限制：每次查询都会出现高亮显示，而且往往跨越许多检索文档，因此对延迟、吞吐量和跨域鲁棒性的要求不容商量。大型语言模型速度太慢、成本太高，根本无法在这种高频路径中运行。</p>
<p>这就是为什么实用的语义高亮需要一个轻量级的专用模型--小到可以与搜索基础设施并存，快到可以在几毫秒内返回结果。这正是大多数现有解决方案的缺陷所在。重型模型精度高，但无法大规模运行；轻型模型速度快，但精度低，或者无法处理多语言或特定领域的数据。</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">开放搜索语义高亮器</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>今年早些时候，OpenSearch 发布了一个专门用于语义高亮的模型：<a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>。 虽然这是一个有意义的尝试，但它有两个关键的局限性。</p>
<ul>
<li><p><strong>上下文窗口小：</strong>该模型基于 BERT 架构，最多支持 512 个标记--大约 300-400 个汉字或 400-500 个英文单词。在实际应用中，产品描述和技术文档往往长达数千字。超出第一个窗口的内容会被简单截断，从而迫使模型只能根据文档的一小部分内容来识别亮点。</p></li>
<li><p><strong>域外泛化能力差：</strong>该模型仅在与其训练集类似的数据分布上表现良好。当应用到域外数据时，例如使用在新闻文章中训练的模型来突出显示电子商务内容或技术文档，性能就会急剧下降。在我们的实验中，该模型在域内数据上的 F1 得分为 0.72 左右，但在域外数据集上则降至 0.46 左右。这种不稳定性在生产中很成问题。此外，该模型不支持中文。</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">普罗旺斯/XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a>是由<a href="https://zilliz.com/customers/naver">Naver</a>开发的一个模型，最初是为<strong>上下文剪枝</strong>任务而训练的，该任务与语义高亮密切相关。</p>
<p>这两项任务都基于相同的基本理念：使用语义匹配来识别相关内容并过滤掉不相关的部分。因此，Provence 只需进行相对较少的调整，就可用于语义高亮。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence 是一种纯英语模型，在这种情况下表现相当出色。<a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>是其多语言变体，支持包括中文、日文和韩文在内的十几种语言。乍一看，XProvence 似乎是双语或多语种语义高亮场景的理想选择。</p>
<p>但实际上，Provence 和 XProvence 都有几个明显的局限性：</p>
<ul>
<li><p><strong>在多语言模型中英语性能较弱：</strong>XProvence 在英语基准测试中的表现无法与 Provence 相提并论。这是多语种模型中常见的权衡问题：容量在不同语言间共享，往往导致英语等高资源语言的性能较弱。在现实世界的系统中，英语仍然是主要或主导的工作负载，这种限制很重要。</p></li>
<li><p><strong>中文性能有限：</strong> XProvence 支持多种语言。在多语言训练过程中，数据和模型容量会分散到不同的语言中，这就限制了模型在任何一种语言中的专业化程度。因此，XProvence 的中文性能只能勉强接受，通常不足以满足高精度高亮使用案例的要求。</p></li>
<li><p><strong>剪枝和高亮目标不匹配：</strong>Provence 针对上下文剪枝进行了优化，在这种情况下，优先考虑的是回忆--保留尽可能多的潜在有用内容，以避免丢失关键信息。相比之下，语义高亮则强调精确性：只高亮最相关的句子，而不是文档的大部分内容。当普罗旺斯风格的模型应用于高亮时，这种不匹配往往会导致过于宽泛或嘈杂的高亮。</p></li>
<li><p><strong>限制性许可：</strong>普罗旺斯和 XProvence 都是根据 CC BY-NC 4.0 许可发布的，不允许用于商业用途。仅这一限制就使它们不适合许多生产部署。</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">开放式普罗旺斯</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provence</strong></a>是一个社区驱动的项目，它以开放和透明的方式重新实现了 Provence 培训管道。它不仅提供训练脚本，还提供数据处理工作流、评估工具和多种规模的预训练模型。</p>
<p>Open Provence 的一个关键优势是其<strong>MIT 许可</strong>。与普罗旺斯和 XProvence 不同，它可以在商业环境中安全使用，不受法律限制，因此对面向生产的团队很有吸引力。</p>
<p>尽管如此，Open Provence 目前只支持<strong>英语和日语</strong>，因此不适合我们的双语使用案例。</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">我们训练并开源了一个双语语义高亮模型<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>为实际工作负载而设计的语义高亮模型必须具备一些基本功能：</p>
<ul>
<li><p>强大的多语言性能</p></li>
<li><p>足够大的上下文窗口以支持长文档</p></li>
<li><p>强大的域外泛化能力</p></li>
<li><p>语义高亮任务的高精度</p></li>
<li><p>允许使用、便于生产的许可证（MIT 或 Apache 2.0）</p></li>
</ul>
<p>在对现有解决方案进行评估后，我们发现现有的模型都无法满足生产使用的要求。因此，我们决定训练我们自己的语义高亮模型：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>为了实现所有这些，我们采用了一种简单直接的方法：使用大型语言模型生成高质量的标注数据，然后在此基础上使用开源工具训练一个轻量级的语义高亮模型。这样，我们就能将 LLM 的推理优势与生产系统所需的高效率和低延迟结合起来。</p>
<p><strong>这一过程中最具挑战性的部分是数据构建</strong>。在注释过程中，我们促使 LLM（Qwen3 8B）不仅输出高亮跨度，而且输出其背后的全部推理。这种额外的推理信号能产生更准确、更一致的监督，并显著提高所生成模型的质量。</p>
<p>在高层次上，注释管道的工作原理如下：<strong>LLM 推理 → 高亮标签 → 筛选 → 最终训练样本。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种设计在实践中有三个具体优势：</p>
<ul>
<li><p><strong>更高的标签质量</strong>：促使模型<em>先思考，后回答</em>。这一中间推理步骤可作为内置的自我检查，降低标签浅薄或不一致的可能性。</p></li>
<li><p><strong>提高可观察性和可调试性</strong>：由于每个标签都附有推理轨迹，因此错误变得清晰可见。这使得诊断失败案例和快速调整管道中的提示、规则或数据过滤器变得更加容易。</p></li>
<li><p><strong>可重复使用的数据</strong>：推理跟踪为未来的重新标记提供了宝贵的上下文。随着需求的变化，同样的数据可以重新审视和完善，而无需从头开始。</p></li>
</ul>
<p>利用这一管道，我们生成了 100 多万个双语训练样本，其中英文和中文样本各占一半。</p>
<p>在模型训练方面，我们从 BGE-M3 Reranker v2（0.6B 参数，8,192 个代词上下文窗口）开始，采用 Open Provence 训练框架，并在 8×A100 GPU 上进行了三个历元的训练，在大约五个小时内完成了训练。</p>
<p>我们将在后续文章中深入探讨这些技术选择，包括为什么要依赖推理轨迹、如何选择基础模型以及如何构建数据集。</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Zilliz双语语义突出模型的基准测试<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>为了评估实际性能，我们在不同的数据集上评估了多个语义高亮模型。这些基准测试涵盖了域内和域外的中英文场景，以反映生产系统中遇到的各种内容。</p>
<h3 id="Datasets" class="common-anchor-header">数据集</h3><p>我们在评估中使用了以下数据集：</p>
<ul>
<li><p><strong>MultiSpanQA（英文）</strong>--域内多跨度问题解答数据集</p></li>
<li><p><strong>WikiText-2（英文）</strong>--域外维基百科语料库</p></li>
<li><p><strong>MultiSpanQA-ZH（中文）</strong>--中文多跨度问题解答数据集</p></li>
<li><p><strong>WikiText-2-ZH（中文）</strong>--域外中文维基百科语料库</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">比较模型</h3><p>参与比较的模型包括</p>
<ul>
<li><p><strong>开放式普罗旺斯模型</strong></p></li>
<li><p><strong>Provence / XProvence</strong>（由 Naver 发布）</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong></p></li>
<li><p><strong>Zilliz 的双语语义高亮模型</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">结果与分析</h3><p><strong>英文数据集</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>中文数据集</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在所有双语基准测试中，我们的模型都取得了<strong>最先进的平均F1分数</strong>，超过了所有之前评估过的模型和方法。在<strong>中文数据集上</strong>，我们的模型明显优于 XProvence（唯一支持中文的其他评估模型）。</p>
<p>更重要的是，我们的模型在中英文两种语言中都能提供均衡的性能，这是现有解决方案难以达到的：</p>
<ul>
<li><p><strong>Open Provence</strong>仅支持英文</p></li>
<li><p>与普罗旺斯相比，<strong>XProvence</strong>牺牲了英文性能</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong>缺乏中文支持，泛化能力较弱</p></li>
</ul>
<p>因此，我们的模型避免了语言覆盖范围和性能之间的常见权衡，使其更适合现实世界中的双语部署。</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">实践中的具体实例</h3><p>除了基准分数之外，研究一个具体的例子往往更能说明问题。下面的案例展示了我们的模型在实际语义高亮场景中的表现，以及为什么精确度很重要。</p>
<p><strong>查询：</strong>电影<em>《杀死一只圣鹿》</em>是谁写的？</p>
<p><strong>上下文（5 句）：</strong></p>
<ol>
<li><p><em>杀死一只圣鹿》</em>是 2017 年由约里奥斯-兰斯莫斯（Yorgos Lanthimos）执导的心理惊悚电影，剧本由兰斯莫斯和 Efthymis Filippou 共同创作。</p></li>
<li><p>影片由科林-法瑞尔、妮可-基德曼、巴里-基欧汉、拉菲-卡西迪、桑尼-苏尔吉奇、艾丽西亚-西尔维斯通、比尔-坎普等主演。</p></li>
<li><p>故事改编自欧里庇得斯的古希腊戏剧《<em>奥利斯的伊菲革涅亚</em>》。</p></li>
<li><p>影片讲述了一名心脏外科医生与一名与他的过去有关的少年建立了秘密友谊。</p></li>
<li><p>他将男孩介绍给自己的家人，之后神秘的疾病开始出现。</p></li>
</ol>
<p><strong>正确亮点：第 1 句</strong>是正确答案，因为它明确指出剧本是由 Yorgos Lanthimos 和 Efthymis Filippou 创作的。</p>
<p>本例包含一个微妙的陷阱。<strong>第 3 句</strong>提到了欧里庇得斯，他是希腊戏剧原著的作者，而故事正是松散地根据希腊戏剧改编的。然而，问题问的是谁写了这部<em>电影</em>，而不是古代的原始材料。因此，正确答案是电影的编剧，而不是几千年前的剧作家。</p>
<p><strong>结果：</strong></p>
<p>下表总结了不同模型在此示例中的表现。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>模型</strong></th><th style="text-align:center"><strong>确定的正确答案</strong></th><th style="text-align:center"><strong>结果</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>我们的（双语 M3）</strong></td><td style="text-align:center">✓</td><td style="text-align:center">选择句子 1（正确）和句子 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">只选择了句子 3，错过了正确答案</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">只选择了句子 3，错过了正确答案</td></tr>
</tbody>
</table>
<p><strong>句子得分比较</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>句子</strong></th><th><strong>我们的（双语 M3）</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">句子 1（电影剧本，<strong>正确）</strong></td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">句子 3（原创剧本，干扰项）</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>XProvence 的不足之处</strong></p>
<ul>
<li><p>XProvence 对关键词<em>"欧里庇得斯 "</em>和<em>"写的</em> <em>"</em>具有强烈的吸引力，给句子 3 打出了几乎满分（0.947 和 0.802）。</p></li>
<li><p>同时，它在很大程度上忽略了句子 1 中的正确答案，给出了极低的分数（0.133 和 0.081）。</p></li>
<li><p>即使将判定阈值从 0.5 降到 0.2，该模型仍未能浮现出正确答案。</p></li>
</ul>
<p>换句话说，该模型主要是由表层关键词关联驱动的，而不是问题的实际意图。</p>
<p><strong>我们的模型如何表现不同</strong></p>
<ul>
<li><p>我们的模型为句子 1 中的正确答案打出了高分（0.915），正确识别了<em>电影的编剧</em>。</p></li>
<li><p>同时，它也给句子 3 打出了中等分数（0.719），因为该句子确实提到了与编剧相关的概念。</p></li>
<li><p>最重要的是，这种区分是明确而有意义的：<strong>0.915 与 0.719 相比</strong>，差距接近 0.2。</p></li>
</ul>
<p>这个例子凸显了我们方法的核心优势：超越关键词驱动的关联，正确解读用户意图。即使出现多个 "作者 "概念，模型也能始终突出问题实际所指的那个概念。</p>
<p>我们将在后续文章中分享更详细的评估报告和其他案例研究。</p>
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
    </button></h2><p>我们已经在<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a> 上开源了我们的双语语义高亮模型，并公开了所有模型权重，因此您可以立即开始尝试。我们很想听听您对它的评价--请在试用过程中分享任何反馈、问题或改进意见。</p>
<p>与此同时，我们还在开发可投入生产的推理服务，并将该模型直接集成到<a href="https://milvus.io/">Milvus</a>中，成为原生的语义高亮应用程序接口（Semantic Highlighting API）。这种集成已经在进行中，很快就会推出。</p>
<p>语义高亮为更直观的 RAG 和 Agents 人工智能体验打开了大门。当Milvus检索几个长文档时，系统可以立即浮现出最相关的句子，让人一目了然答案在哪里。这不仅改善了终端用户的体验，还通过准确显示系统所依赖的上下文部分，帮助开发人员调试检索管道。</p>
<p>我们相信，语义高亮将成为下一代搜索和 RAG 系统的标准功能。如果您有关于双语语义高亮的想法、建议或使用案例，请加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>并分享您的想法。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>预约20分钟的一对一会议，以获得见解、指导和问题解答。</p>
