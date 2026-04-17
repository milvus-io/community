---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: 采访 RaBitQ 作者：TurboQuant 之争及为何存储大跌是一场虚惊
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: RaBitQ 的作者回应谷歌 TurboQuant 论文：基准失衡、错误归因理论，以及为什么存储抛售是虚惊一场。
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>谷歌的<a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a>论文声称，向量表示法的<strong>压缩率为 6 倍，速度提高了 8 倍，精度损失近乎为零</strong>。论文发布后，内存和存储股票大幅下跌，各大科技媒体迅速将其作为头条新闻。</p>
<p>市场反应仅仅是个开始。研究人员很快开始质疑论文的说法是否言过其实，是否公平对待了之前的工作，尤其是<a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>。这场争论将<strong>向量量化</strong>重新推到了聚光灯下，部分原因是相同的基本思想现在在人工智能堆栈的两个关键部分都很重要：<a href="https://zilliz.com/learn/vector-similarity-search">向量搜索系统</a>和大型模型的 KV 缓存压缩。</p>
<p>为了了解这场技术争论及其对生产系统的意义，我们采访了新加坡南洋理工大学副教授兼 VectorDB@NTU 负责人<strong>程龙</strong>、RaBitQ 的第一作者<strong>高</strong>建阳和 Zilliz 工程总监<strong>刘力</strong>。谈话内容涉及向量量化本身、围绕 TurboQuant 提出的问题，以及为什么这对<a href="https://milvus.io/">Milvus</a>（最流行的开源<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>）等系统和大规模向量检索很重要。</p>
<p><strong><em>相关阅读：</em></strong> <em>如果你想了解工程方面而不是采访内容，请参阅我们的配套文章：</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>向量量化如何影响人工智能基础设施成本</em></a><em>。</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">为什么向量量化突然成了这么大的话题？<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：在我们进入争议之前，你能先解释一下什么是向量量化，以及为什么它在人工智能领域变得如此重要吗？</strong></p>
<p><strong>程龙：</strong>向量量化是一种<strong>数据压缩</strong>和<strong>近似表示的</strong>技术。它最初来自信号处理，用于图像和音频压缩。在现代人工智能系统中，它的作用发生了变化，因为向量已经成为计算的基本单位之一。</p>
<p>如今，矢量的重要性在两个方面体现得最为明显。</p>
<p>一是<strong>对拥有数十亿甚至上百亿向量的 Collections 进行实时搜索</strong>。在语义检索系统中，核心任务是对高维向量进行相似性搜索。但原始向量很大，浮点运算成本很高。因此，很难实现毫秒级的延迟。向量量化可以将向量压缩为低位表示，加快距离计算速度。这就是为什么它对<a href="https://milvus.io/docs/single-vector-search.md">单向量搜索</a>、<a href="https://milvus.io/docs/multi-vector-search.md">多向量搜索</a>以及<a href="https://milvus.io/docs/index-explained.md">Milvus 搜索架构</a>中的索引设计等实际工作负载很重要。</p>
<p>其他是针对大型模型的<strong>KV 缓存压缩</strong>。KV 缓存可以减少生成过程中的冗余计算，但随着上下文变长，内存成本会迅速增加。因此，问题就变成了如何压缩这些向量，同时又不会太影响输出质量。究其核心，这也是一个向量量化问题。</p>
<p><strong>Zilliz：如果向量量化得到更广泛的应用--如果 TurboQuant 的结果成立--这是否意味着存储需求会急剧下降？</strong></p>
<p><strong>高建阳</strong>在相同的模型和相同的工作负载下，压缩可以降低存储需求。但这并不能证明人们得出的结论是正确的。</p>
<p>当TurboQuant谈到<strong>6倍压缩</strong>和<strong>8倍加速</strong>时，它是在与基本的<strong>16位/32位基线</strong>进行比较。这与同类其他方法的比较是不同的。因此，真正的效果还需要更仔细地评估。</p>
<p><strong>Zilliz：那么从这个角度看，如果市场反应真的是针对技术本身，那么它是否应该更早出现，在类似的想法已经出现的时候？</strong></p>
<p><strong>程龙：</strong>从技术角度看，可以说类似的理论领域以前就已经出现过。但市场与研究并不同步。学术成果、工程采用和金融解读之间通常会有一个滞后期。</p>
<p>从更长的时间跨度来看，这种影响甚至可能不是线性的。压缩可以使大型模型在较小的设备上运行成为可能，这可以创造新的需求，而不仅仅是减少需求。技术与市场之间的关系比直线推断更为复杂。</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">RaBitQ 是如何出现的？<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：您最初是如何产生 RaBitQ 这个想法的？</strong></p>
<p><strong>高建阳：</strong>我们是从向量数据库中的一个空白开始的。传统的方法，如<a href="https://milvus.io/docs/ivf-pq.md">乘积量化</a>法，从经验上看效果很好，但在理论上却几乎没有保证。</p>
<p>当时，我正在新加坡南洋理工大学学习高维概率论，这让我产生了一个疑问：我们能否建立一种不仅实用，而且有明确理论保证的方法？这就是 RaBitQ 的起点。</p>
<p><strong>Zilliz：您认为 RaBitQ 的核心原创性是什么？</strong></p>
<p><strong>高建阳：</strong>它的关键想法是利用随机旋转，也就是约翰逊-林登斯特劳斯变换，使向量坐标的分布更加均匀，更可预测。</p>
<p>一旦掌握了这一点，就能在此基础上推导出最佳量化估计器。然后，我们给出了一个严格的证明，证明它达到了理论下限。</p>
<p>早期的工作也曾尝试引入随机旋转。但从我们的角度来看，由于算法设计中的实际问题，这些方法并没有达到我们想要的效果。</p>
<p><strong>Zilliz：从工程的角度来看，RaBitQ 最让你印象深刻的是什么？</strong></p>
<p><strong>刘力：</strong>我们曾经使用过很多量化算法，从<a href="https://milvus.io/docs/ivf-sq8.md">标量量化方法</a>到 PQ 和其他变体。RaBitQ 的突出之处在于它改变了人们处理问题的方式。</p>
<p>在此之前，该领域的许多工作仍然是相当经验主义的。你可以说一种方法似乎行之有效，但却很难解释清楚为什么。RaBitQ 以一种更加数学化的方式来解决问题。从某种意义上说，这种方法给人一种优雅、简单的感觉。这种思维方式影响了后来的很多工作。</p>
<p><strong>Zilliz：简单地说，它能节省多少内存和成本？</strong></p>
<p><strong>刘力：</strong>在相同的召回级别上，从 4 位压缩到 2 位压缩可以减少一半的内存使用。</p>
<p>这不仅仅是压缩的问题。在生产环境中，团队会同时关注内存效率和检索质量。这就是为什么它对需要平衡<a href="https://milvus.io/docs/dense-vector.md">密集向量存储</a>、吞吐量和调用的系统很重要。</p>
<p><strong>Zilliz：除了 Milvus，您认为 RaBitQ 目前在哪些领域得到了应用？</strong></p>
<p><strong>程龙：</strong>首先，我要感谢 Milvus 团队，因为他们是最早采用 RaBitQ 的团队之一。一路上我们也进行了很多讨论和合作研究。</p>
<p>RaBitQ还被其他一些系统采用，包括Meta的FAISS、VSAG、VectorChord、Volcengine OpenSearch、CockroachDB、ElasticSearch、Lucene和turbopuffer。在 Milvus 方面最突出的是，除了在<a href="https://milvus.io/docs/manage-collections.md">Collections 管理</a>、<a href="https://milvus.io/docs/ivf-flat.md">基于 IVF 的</a>索引和<a href="https://milvus.io/docs/hnsw.md">基于 HNSW 的索引</a>方面开展更广泛的工作外，该团队还在<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> 中将<a href="https://milvus.io/docs/ivf-flat.md">IVF_RABITQ</a> 作为一个真正的索引选项推出。</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">我们应该如何评估 TurboQuant？<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：在您的公开回应中，您说 TurboQuant 有一些严重的问题。您认为主要有哪些问题？</strong></p>
<p><strong>高建阳：</strong>我们认为主要有三个问题。</p>
<p>一是论文描述先前工作和讨论重叠的方式。TurboQuant 的论文错误地描述了 RaBitQ 的方法，忽略了最相似的部分，比如约翰逊-林登斯特劳斯变换（Johnson-Lindenstrauss Transformation）。另一个问题是论文对理论结果的描述。它在没有提供任何解释或证据的情况下把 RaBitQ 说成是次优的，但事实上 RaBitQ 是最优的。第三是实验对比的公平性。他们使用单核 CPU 评估 RaBitQ，而使用 A100 GPU 评估 TurboQuant。</p>
<p><strong>Zilliz：我们先来看看基准问题。您为什么认为比较不公平？</strong></p>
<p><strong>高建阳：</strong>只有在设置具有可比性的情况下，基准测试才有意义。如果一个系统是在非常不同的硬件或软件环境下进行测试，那么结果可能更多反映的是设置而不是算法本身。</p>
<p>我们认为，处理器选择、实现语言和优化水平的不同会造成很大的差异。这就是为什么需要非常谨慎地解释基准方法，尤其是对于构建生产检索系统的团队来说。</p>
<p><strong>程龙：</strong>论文还提出了其他一些不成立的说法。</p>
<p>例如，论文说<strong>RaBitQ 不能被向量化</strong>。但在2024年论文发表时，RaBitQ已经开源了基于SIMD的向量计算代码。因此，从我们的角度来看，这种说法与事实不符。</p>
<p>值得一提的是，我们去年开始与英伟达公司合作，并完成了 RaBitQ 的 GPU 实现。相关代码正在审查中，以便纳入英伟达公司的 cuVS 库。</p>
<p><strong>Zilliz：Milvus 在 2025 年下半年对 TurboQuant 进行了评估，但并未采用。你们团队在测试中看到了什么？</strong></p>
<p><strong>Li Liu：</strong>它确实包含了一个有用的想法。我们认为，它对量化网格的分配方式进行了小幅优化。但该方法中最重要的一步--使用随机旋转进行量化--是由 RaBitQ 首次提出的。</p>
<p>在无偏估计方面，RaBitQ 的方法更简洁，理论推导也更有力。</p>
<p>尽管如此，由于这是来自谷歌的结果，我们还是在 2025 年对其进行了测试。在我们的实验室里，在标准化的 CPU 环境下，TurboQuant 在大多数情况下都没有超过我们的内部 RaBitQ 版本。因此，当市场反应如此强烈时，我们着实感到惊讶。</p>
<p><strong>Zilliz：对于没有仔细阅读这两篇论文的读者，您能否用通俗易懂的语言介绍一下 RaBitQ 和 TurboQuant 的重叠之处？</strong></p>
<p><strong>刘力：</strong>从高层次来看，这两种方法都是从<strong>随机旋转</strong>开始的。在数学上，这意味着将向量乘以随机正交矩阵。你可以把它想象成在高维空间中改变你的观察角度。这并不会改变数据点的相对位置，但却能更均匀地分布各维度的信息。</p>
<p>然后是<strong>量化</strong>。您需要将连续实值空间划分为<strong>2^k 个网格单元</strong>，其中<strong>k</strong>是量化位数，然后将每个向量元素映射到附近的网格点。TurboQuant 在这里做了一个小调整，根据数据分布来分配网格，而不是平均分配。</p>
<p>最后一步是<strong>误差估计</strong>，这也是 RaBitQ 的主要贡献所在。传统方法直接从量化值进行计算，这使得误差更难控制。RaBitQ 能更精确地估计量化误差，这也是其数学最优性的来源。TurboQuant 的解决方案更为复杂，在我们的设置中，这种权衡看起来并不那么有吸引力。</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">为什么归因问题在实践中如此难以解决？<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：</strong>您发表公开声明后，谷歌和 ICLR 是如何回应的？</p>
<p><strong>程龙：</strong>ICLR 没有采取行动。去年 9 月审查期间，我们给他们发了电子邮件，但没有收到回复。今年 3 月，我们再次写信给他们，并被告知要在 OpenReview 上发表评论，但除此之外，他们没有采取任何行动。</p>
<p>至于谷歌，其中一位合著者几天前回复了我们。回复中说，他们将修改 arXiv 版本，纠正对 RaBitQ 最佳性的不准确描述。</p>
<p><strong>Zilliz：</strong>之前的讨论是围绕学术不端行为展开的。现在听起来也像是一个不平衡的问题，以及谁能塑造故事的问题。为什么为自己的工作辩护这么难？</p>
<p><strong>程龙：</strong>一个问题是规模。现在的人工智能会议规模非常大，一个周期就能带来数以万计的论文。主办方根本没有能力处理每一起此类争议。</p>
<p>其他问题是不平衡。大公司在公众面前的话语权要大得多。而独立研究人员或较小的团队则没有这样的沟通能力。</p>
<p><strong>高建阳</strong>对个人而言，成本极高。最近几周，我和龙教授几乎无法正常工作。</p>
<p>申请过程本身也令人沮丧。我们联系作者时被坚决拒绝，会议主办方也没有给我们任何答复。实际上，很多研究人员看到这样的情况，都会决定放手一搏。但这也是许多原创性贡献从公众叙述中消失的原因。</p>
<p><strong>Zilliz：</strong>听起来这不是你们团队第一次遇到这样的问题。</p>
<p><strong>程龙：</strong>不，不是。</p>
<p>我们以前也见过这样的情况：一些公司采用 RaBitQ，做一些工程修改，给它起一个新名字，然后只把它描述成受 RaBitQ 启发的东西。</p>
<p>这就是为什么我欣赏包括 Milvus 在内的一些行业团队的处理方式。当他们使用 RaBitQ 时，他们会客观地描述它。当他们在原始版本的基础上增加优化功能时，他们会清楚地解释这些是他们自己的工程贡献。这既是对原始工作的适当肯定，也显示了公司的技术实力。</p>
<p><strong>Zilliz：</strong>当大公司在学术成果的基础上进行开发时，他们通常会提供资金分享或利益分配吗？</p>
<p><strong>高建阳：</strong>大多数情况下不会。</p>
<p>尽管如此，大公司仍然有强烈的动机把技术进步说成是他们自己创造的，而不是从其他公司采用的。每个人都希望客户和投资者看到最先进的作品是自己团队的创新成果。</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">向量量化的下一步是什么？<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：</strong>你们现在的研究方向是什么？</p>
<p><strong>程龙：</strong>我们的很大一部分工作仍将集中在向量检索上。</p>
<p>其中一个方向是将 RaBitQ 与不同的向量检索索引（如 IVF 和 HNSW）结合起来，这样系统就能以更低的延迟、更高的并发性和更低的成本支持更大规模的数据。我也在关注 KV 缓存压缩。</p>
<p><strong>高建阳</strong>大模型中的 KV 缓存和向量检索在数学上和系统层面都有很多相同的特性，因为两者都处理高维向量。</p>
<p>展望未来，我想更多地思考如何应用数学工具，包括高维概率的思想，来加速推理和训练。</p>
<p><strong>Zilliz：</strong>作为一个领域，向量量化的上限在哪里？还有多大的提升空间？</p>
<p><strong>程龙：</strong>从理论角度来看，天花板已经基本在望。RaBitQ 已经是近似最优了。</p>
<p>但在工程方面仍有很大的空间。你仍然需要处理硬件特性、数据分布、延迟限制和其他许多实际因素。正是因为如此，生产系统仍需要在<a href="https://milvus.io/docs/architecture_overview.md">分布式向量数据库架构</a>、<a href="https://milvus.io/docs/sparse_vector.md">稀疏向量支持</a>、<a href="https://milvus.io/docs/reranking.md">重排管道</a>以及<a href="https://milvus.io/docs/metric.md">Milvus 距离度量</a>中的<a href="https://milvus.io/docs/metric.md">度量</a>选择等领域开展细致的工作。</p>
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
    </button></h2><p>如果您想深入了解 RaBitQ 的工程方面以及它如何融入 Milvus，这些是最相关的资源：</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ 文档</a>- 配置细节和调整指导。</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ 集成深度挖掘</a>--Milvus 如何将 RaBitQ 转化为生产索引。</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">向量量化如何影响人工智能基础设施成本</a>--我们对 TurboQuant-RaBitQ 讨论的更广泛分析。</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 版本发布</a>--IVF_RABITQ 作为真正的 Milvus 索引选项发货。</li>
<li><a href="https://milvus.io/docs/index-explained.md">Milvus 索引解释</a>--IVF_RABITQ 如何与其他索引选择相匹配。</li>
<li><a href="https://milvus.io/docs/ivf-flat.md">IVF_FLAT 索引</a>和<a href="https://milvus.io/docs/hnsw.md">HNSW 索引</a>--在比较索引权衡时的有用基准。</li>
<li><a href="https://milvus.io/docs/schema.md">Milvus 中的 Schema 设计</a>和<a href="https://milvus.io/docs/filtered-search.md">过滤搜索</a>--如果您要在实际应用中而不是孤立地评估 RaBitQ，这将非常有用。</li>
<li><a href="https://milvus.io/docs/quickstart.md">Milvus 快速入门</a>和<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 系统设计</a>--如果您想在检索管道中进行尝试，这很有帮助。</li>
</ul>
<p>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，或<a href="https://milvus.io/office-hours">预约 Milvus Office Hours</a>，如果你想讨论你的工作量的话。</p>
<p>如果您想跳过基础设施设置，可以<a href="https://cloud.zilliz.com/signup">注册 Zilliz Cloud</a>（全面管理 Milvus）。</p>
