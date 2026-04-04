---
id: turboquant-rabitq-vector-database-cost.md
title: 超越 TurboQuant-RaBitQ 之争：为什么向量量化对人工智能基础设施成本很重要？
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  TurboQuant-RaBitQ 之争使向量量化成为头条新闻。RaBitQ 1 位压缩是如何工作的，以及 Milvus 如何通过 IVF_RABITQ
  节省 97% 的内存。
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>谷歌的 TurboQuant 论文（ICLR 2026）报告了 6 倍 KV 高速缓存压缩，精度损失接近于零--这些惊人的结果足以让<a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html">内存芯片股票</a>在一天之内<a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html">跌去 900 亿美元</a>。SK 海力士下跌 12%。三星下跌了 7%。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这篇论文很快引起了广泛关注。<a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>》（SIGMOD 2024）的第一作者<a href="https://gaoj0017.github.io/">高建阳</a>对 TurboQuant 的方法与他之前的向量量化工作之间的关系<a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">提出了质疑</a>。(我们将很快发表与高博士的对话--如果您感兴趣，请关注我们）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>本文并不是要在这场讨论中偏袒任何一方。让我们印象深刻的是一些更大的事情：一篇<a href="https://milvus.io/docs/index-explained.md">向量量化</a>论文就能打动 900 亿美元的市值，这一事实告诉你，这项技术对于人工智能基础设施已经变得多么关键。无论是压缩推理引擎中的 KV 缓存，还是压缩<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>中的索引，在保持质量的同时缩小高维数据的能力都会带来巨大的成本影响--这也是我们一直在努力解决的问题，我们将 RaBitQ 集成到<a href="https://milvus.io/">Milvus</a>向量数据库中，并将其转化为生产基础设施。</p>
<p>以下是我们将介绍的内容：为什么向量量化现在如此重要、TurboQuant 和 RaBitQ 的比较、RaBitQ 是什么以及它如何工作、在 Milvus 内部推出它背后的工程工作，以及更广泛的人工智能基础架构内存优化情况。</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">为什么向量量化对基础设施成本很重要？<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>向量量化并不新鲜。新的是行业对它的迫切需求。在过去两年中，LLM 参数急剧膨胀，上下文窗口从 4K 扩展到 128K+ 标记，非结构化数据（文本、图像、音频、视频）已成为人工智能系统的一流输入。每一种趋势都会产生更多需要存储、索引和搜索的高维向量。向量越多，内存越大，成本越高。</p>
<p>如果你正在大规模运行向量搜索--<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 管道</a>、推荐引擎、多模态检索--内存成本很可能是你最头疼的基础设施之一。</p>
<p>在模型部署过程中，每个主要的 LLM 推断堆栈都依赖于<a href="https://zilliz.com/glossary/kv-cache">KV 缓存</a>--存储以前计算过的键值对，这样注意机制就不会为每个新标记重新计算它们。正是它使得 O(n) 而不是 O(n²) 的推理成为可能。从<a href="https://github.com/vllm-project/vllm">vLLM</a>到<a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a>，每个框架都依赖于它。但 KV 缓存消耗的 GPU 内存可能比模型权重本身还要多。更长的上下文、更多的并发用户，这些都会迅速增加。</p>
<p>向量数据库也面临同样的压力--内存中存储着数十亿个高维向量，每个向量每个维度都是 32 位浮点运算。向量量化可以将这些向量从 32 位浮点压缩到 4 位、2 位甚至 1 位，从而将内存缩减 90% 甚至更多。无论是推理引擎中的 KV 缓存，还是向量数据库中的索引，底层数学都是一样的，节省的成本也是实实在在的。这就是为什么一篇报道该领域突破性进展的论文就能带来 900 亿美元股票市值的原因。</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant 与 RaBitQ：有什么区别？<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>TurboQuant 和 RaBitQ 都基于相同的基础技术：在量化之前对输入向量进行随机旋转<a href="https://arxiv.org/abs/2406.03482">（约翰逊-林登斯特劳斯变换</a>）。这种旋转将不规则分布的数据转换为可预测的均匀分布，从而使量化更容易，误差更小。</p>
<p>除了这个共同的基础之外，两者还针对不同的问题，采取了不同的方法：</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>目标</strong></td><td>LLM 推理中的 KV 缓存（短暂的按请求数据）</td><td>数据库中的持久向量索引（存储数据）</td></tr>
<tr><td><strong>方法</strong></td><td>两阶段PolarQuant（每个坐标的 Lloyd-Max 标量量化器）+<a href="https://arxiv.org/abs/2406.03482">QJL</a>（1 位残差校正）</td><td>单级：超立方投影 + 无偏距离估计器</td></tr>
<tr><td><strong>位宽</strong></td><td>3 位键，2 位值（混合精度）</td><td>每个维度 1 位（可提供多位变体）</td></tr>
<tr><td><strong>理论主张</strong></td><td>接近最优的 MSE 失真率</td><td>渐近最优的内积估计误差（与 Alon-Klartag 下限相匹配）</td></tr>
<tr><td><strong>生产状况</strong></td><td>社区实现；谷歌未正式发布</td><td>在<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> 中发布，被 Faiss、VSAG 和 Elasticsearch 采用</td></tr>
</tbody>
</table>
<p>对于从业者而言，关键区别在于TurboQuant 优化的是推理引擎内部的瞬时 KV 缓存，而 RaBitQ 针对的是向量数据库在数十亿向量中构建、分片和查询的持久性索引。在本文的其余部分，我们将重点介绍 RaBitQ--我们在 Milvus 内部集成并投入生产的算法。</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">什么是 RaBitQ，它能提供什么？<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>首先是底线：在一个 1000 万向量的 768 维数据集上，RaBitQ 将每个向量压缩到原始大小的 1/32，而召回率却保持在 94% 以上。在 Milvus 中，这意味着查询吞吐量是全精度索引的 3.6 倍。这不是理论预测，而是 Milvus 2.6 的基准结果。</p>
<p>现在来看看它是如何实现的。</p>
<p>传统的二进制量化将 FP32 向量压缩到每个维度 1 位，压缩率为 32 倍。代价是：由于丢弃了太多信息，召回率会下降。<a href="https://arxiv.org/abs/2405.12497">RaBitQ</a>（Gao 和 Long，SIGMOD 2024）保持了相同的 32 倍压缩率，但保留了对搜索有实际意义的信息。<a href="https://arxiv.org/abs/2409.09913">扩展版本</a>（Gao &amp; Long，SIGMOD 2025）证明这是渐近最优的，与 Alon &amp; Klartag（FOCS 2017）建立的理论下限相匹配。</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">为什么在高维度中角度比坐标更重要？</h3><p>关键见解：<strong>在高维度中，向量之间的角度比单个坐标值更稳定，信息量更大。</strong>这是度量集中的结果--这种现象与约翰逊-林登斯特劳斯随机投影的原理相同。</p>
<p>这在实践中意味着：你可以舍弃高维向量的精确坐标值，只保留它相对于数据集的方向。角度关系--也就是<a href="https://zilliz.com/glossary/anns">近邻搜索</a>实际上所依赖的--在压缩后依然存在。</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">RaBitQ 如何工作？</h3><p>RaBitQ 将这一几何见解转化为三个步骤：</p>
<p><strong>第一步：归一化。</strong>将每个向量相对于数据集中心点居中，并缩放至单位长度。这就将问题转换为单位向量之间的内积估算--更易于分析和约束。</p>
<p><strong>步骤 2：随机旋转 + 超立方投影。</strong>应用随机正交矩阵（约翰逊-林登斯特劳斯型旋转）来消除对任何轴的偏差。将每个旋转向量投影到{±1/√D}^D 超立方体的最近顶点上。每个维度折叠为一个比特。结果：每个向量都是 D 位二进制代码。</p>
<p><strong>步骤 3：无偏距离估计。</strong>为查询和原始（未量化）向量之间的内积构建一个估计器。该估计器可证明是无偏的，误差边界为 O(1/√D)。对于 768 维向量，这能使召回率保持在 94% 以上。</p>
<p>二进制向量间的距离计算只需进行比特 AND + popcount 操作，而现代中央处理器只需一个周期即可完成这些操作。这就是 RaBitQ 之所以快，而不仅仅是小的原因。</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">为什么 RaBitQ 是实用的，而不仅仅是理论上的？</h3><ul>
<li><strong>无需培训。</strong>应用旋转，检查符号。无需迭代优化，无需学习编码本。索引时间与<a href="https://milvus.io/docs/ivf-pq.md">乘积量化</a>相当。</li>
<li><strong>硬件友好。</strong>距离计算采用比特 AND + popcount。现代 CPU（Intel IceLake+、AMD Zen 4+）具有专用的 AVX512VPOPCNTDQ 指令。单向量估算的运行速度比 PQ 查找表快 3 倍。</li>
<li><strong>多位灵活性。</strong> <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">RaBitQ 库</a>支持 1 位以上的变体：4 位实现 ~90% 的召回率，5 位 ~95%，7 位 ~99% - 所有这些都无需 Rerankers。</li>
<li><strong>可组合。</strong>可插入现有的索引结构，如<a href="https://milvus.io/docs/ivf-flat.md">IVF 索引</a>和<a href="https://milvus.io/docs/hnsw.md">HNSW 图</a>，并与<a href="https://milvus.io/docs/hnsw.md">FastScan</a> 协同工作，进行批量距离计算。</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">从论文到产品：我们为在 Milvus 中推出 RaBitQ 所做的工作<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>最初的 RaBitQ 代码是一个单机研究原型。要让它在具有分片、故障转移和实时摄取功能的<a href="https://milvus.io/docs/architecture_overview.md">分布式集群</a>中运行，需要解决四个工程问题。在<a href="https://zilliz.com/">Zilliz</a>，我们不仅仅是简单地实现算法，我们的工作还包括引擎集成、硬件加速、索引优化和运行时调整，以便将 RaBitQ 转化为 Milvus 内部的工业级功能。您还可以在本博客中找到更多详细信息：<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus 如何利用 RaBitQ 提供 3 倍的查询服务</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">让 RaBitQ 成为分布式就绪工具</h3><p>我们将 RaBitQ 直接集成到 Milvus 的核心搜索引擎<a href="https://github.com/milvus-io/knowhere">Knowhere</a> 中--不是作为插件，而是作为具有统一接口的本地索引类型。它与 Milvus 的完整分布式架构配合使用：分片、分区、动态扩展和<a href="https://milvus.io/docs/manage-collections.md">Collections 管理</a>。</p>
<p>关键的挑战是：使量化代码集（旋转矩阵、中心点向量、缩放参数）具有分段感知能力，这样每个分片都能构建和存储自己的量化状态。索引构建、压缩和负载平衡都能理解新的索引类型。</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">从 Popcount 中挤出每一个周期</h3><p>RaBitQ 的速度来自 popcount，即计算二进制向量中的集合位。该算法本身速度很快，但能获得多少吞吐量取决于硬件的使用情况。我们为两种主流服务器架构构建了专用的 SIMD 代码路径：</p>
<ul>
<li><strong>x86（英特尔 IceLake+ / AMD Zen 4+）：</strong>AVX-512 的 VPOPCNTDQ 指令在多个 512 位寄存器中并行计算 popcount。对 Knowhere 的内部循环进行了重组，将二进制距离计算批量转化为 SIMD 宽度的分块，最大限度地提高了吞吐量。</li>
<li><strong>ARM（引力子、安培）：</strong>SVE（可扩展向量扩展）指令用于相同的并行 popcount 模式--这一点至关重要，因为 ARM 实例在成本优化的云部署中越来越常见。</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">消除运行时开销</h3><p>RaBitQ 在查询时需要辅助浮点参数：数据集中心点、每个向量的规范以及每个量化向量与其原始向量之间的内积（由距离估计器使用）。每次查询计算这些参数会增加延迟。存储完整的原始向量有违压缩的初衷。</p>
<p>我们的解决方案是：在索引构建过程中预先计算并持久化这些参数，将它们与二进制代码一起缓存。内存开销很小（每个向量几个浮点数），但它消除了每次查询的计算，并在高并发情况下保持延迟稳定。</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ：实际部署的索引</h3><p>从<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> 开始，我们提供<a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a>-<a href="https://milvus.io/docs/ivf-flat.md">反转文件索引</a>+ RaBitQ 量化。搜索工作分为两个阶段：</p>
<ol>
<li><strong>粗搜索（IVF）。</strong>K-means 将向量空间划分为若干个簇。查询时，只扫描 nprobe 最近的簇。</li>
<li><strong>精细评分（RaBitQ）。</strong>在每个簇内，使用 1 位代码和无偏估计器估算距离。Popcount 会进行繁重的工作。</li>
</ol>
<p>768 维、1000 万向量数据集的结果：</p>
<table>
<thead>
<tr><th>指标</th><th>IVF_FLAT（基准）</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 refine</th></tr>
</thead>
<tbody>
<tr><td>召回率</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>内存占用</td><td>32 位/微米</td><td>1 位/微米（约为原来的 3）</td><td>~原始数据的 25</td></tr>
</tbody>
</table>
<p>对于连 0.5% 的召回率差距都无法容忍的工作负载，refine_type 参数会增加第二个评分通道：SQ6、SQ8、FP16、BF16 或 FP32。SQ8 是常见的选择，它能将召回率恢复到 IVF_FLAT 水平，内存大约是原来的四分之一。你还可以将<a href="https://milvus.io/docs/ivf-sq8.md">标量量化</a>独立应用于查询侧（SQ1-SQ8），这样就有两个旋钮来调整每个工作负载的延迟-恢复-成本权衡。</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Milvus 如何在量化之外优化内存<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ 是最显著的压缩工具，但它只是更广泛的<a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">内存优化</a>堆栈中的一层：</p>
<table>
<thead>
<tr><th>策略</th><th>作用</th><th>影响</th></tr>
</thead>
<tbody>
<tr><td><strong>全栈量化</strong></td><td>SQ8、PQ、RaBitQ 在不同精度-成本权衡下的效果</td><td>内存减少 4 至 32 倍</td></tr>
<tr><td><strong>索引结构优化</strong></td><td>HNSW 图压缩、DiskANN SSD 卸载、OOM 安全索引构建</td><td>每个索引的 DRAM 更少，每个节点的数据集更大</td></tr>
<tr><td><strong>内存映射 I/O (mmap)</strong></td><td>将向量文件映射到磁盘，通过操作系统页面缓存按需加载页面</td><td>TB 级数据集，无需将所有内容载入 RAM</td></tr>
<tr><td><strong>分层存储</strong></td><td>热/温/冷数据分离，自动调度</td><td>只为频繁访问的数据支付内存价格</td></tr>
<tr><td><strong>云原生扩展</strong><a href="https://zilliz.com/cloud">（Zilliz Cloud</a>、托管 Milvus）</td><td>弹性内存分配，自动释放闲置资源</td><td>只为您使用的资源付费</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">全栈量化</h3><p>RaBitQ 的 1 位极限压缩并不适合所有工作负载。Milvus 提供完整的量化矩阵：<a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a>和<a href="https://milvus.io/docs/ivf-pq.md">乘积量化（PQ）</a>适用于需要平衡精度与成本的工作负载，RaBitQ适用于在超大数据集上实现最大压缩，而混合配置则结合了多种方法以实现精细控制。</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">索引结构优化</h3><p>除了量化，Milvus 还不断优化其核心索引结构的内存开销。对于<a href="https://milvus.io/docs/hnsw.md">HNSW</a>，我们减少了邻接表冗余，以降低每个图的内存使用率。<a href="https://milvus.io/docs/diskann.md">DiskANN</a>将向量数据和索引结构都推送到固态硬盘，大大减少了大型数据集对 DRAM 的依赖。我们还优化了索引构建过程中的中间内存分配，以防止在接近节点内存限制的数据集上构建索引时出现 OOM 故障。</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">智能内存加载</h3><p>Milvus 的<a href="https://milvus.io/docs/mmap.md">mmap</a>（内存映射 I/O）支持将向量数据映射到磁盘文件，依靠操作系统的页面缓存按需加载--无需在启动时将所有数据加载到内存中。结合可防止内存突然激增的懒加载和分段加载策略，可实现 TB 级向量数据集的流畅操作，而内存成本仅为原来的一小部分。</p>
<h3 id="Tiered-Storage" class="common-anchor-header">分层存储</h3><p>Milvus 的<a href="https://milvus.io/docs/tiered-storage-overview.md">三层存储架构</a>横跨内存、固态硬盘和对象存储：热数据保留在内存中，以降低延迟；热数据缓存在固态硬盘上，以平衡性能和成本；冷数据汇入对象存储，以尽量减少开销。系统自动处理数据调度，无需更改应用层。</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">云原生扩展</h3><p>在 Milvus 的<a href="https://milvus.io/docs/architecture_overview.md">分布式架构</a>下，数据分片和负载平衡可防止单节点内存超载。内存池减少了碎片，提高了利用率。<a href="https://zilliz.com/cloud">Zilliz云</a>（全面管理Milvus）在此基础上更进一步，通过弹性调度实现按需内存扩展--在无服务器模式下，闲置资源会自动释放，从而进一步降低总拥有成本。</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">这些层是如何复合的</h3><p>这些优化并不是相互替代的，而是相互叠加的。RaBitQ 缩小了向量。DiskANN 将索引保存在 SSD 上。Mmap 避免将冷数据加载到内存中。<a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">分层存储</a>将存档数据推送到对象存储。结果是：提供数十亿向量的部署不需要价值数十亿向量的内存。</p>
<h2 id="Get-Started" class="common-anchor-header">开始使用<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>随着人工智能数据量的持续增长，向量数据库的效率和成本将直接决定人工智能应用的扩展能力。我们将继续投资于高性能、低成本的向量基础设施，让更多的人工智能应用从原型走向生产。</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a>是开源的。要试用 IVF_RABITQ，请访问</p>
<ul>
<li>查看<a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ 文档</a>，了解配置和调整指南。</li>
<li>阅读完整的<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ 集成博文</a>，了解更深入的基准和实施细节。</li>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，向其他开发人员提问和学习。</li>
<li><a href="https://milvus.io/office-hours">预订免费的 Milvus Office Hours 会议</a>，了解您的使用案例。</li>
</ul>
<p>如果您想跳过基础架构设置，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（全面管理 Milvus）提供支持 IVF_RABITQ 的免费层级。</p>
<p>我们即将对 RaBitQ 的第一作者<a href="https://personal.ntu.edu.sg/c.long/">程龙</a>教授（南洋理工大学，VectorDB@NTU）和<a href="https://gaoj0017.github.io/">高建阳博士</a>（苏黎世联邦理工学院）进行访谈，我们将深入探讨向量量化理论和下一步工作。请在评论中提出您的问题。</p>
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">TurboQuant 和 RaBitQ 是什么？</h3><p>TurboQuant（Google，ICLR 2026）和 RaBitQ（Gao &amp; Long，SIGMOD 2024）都是使用随机旋转压缩高维向量的向量量化方法。TurboQuant 针对的是 LLM 推理中的 KV 缓存压缩，而 RaBitQ 针对的是数据库中的持久向量索引。两者都推动了当前对向量量化的兴趣浪潮，尽管它们为不同的系统解决了不同的问题。</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">RaBitQ 如何在不破坏召回率的情况下实现 1 位量化？</h3><p>RaBitQ 利用了高维空间中的度量集中：随着维度的增加，向量之间的角度比单个坐标值更稳定。它将向量相对于数据集中心点进行归一化处理，然后将每个向量投影到超立方体的最近顶点上（将每个维度减少到一个比特）。尽管进行了压缩，但一个具有可证明误差范围的无偏距离估计器仍能保持搜索的准确性。</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">什么是 IVF_RABITQ，何时使用？</h3><p>IVF_RABITQ 是 Milvus 中的一种向量索引类型（自 2.6 版起可用），它将倒置文件聚类与 RaBitQ 1 位量化相结合。它的召回率高达 94.7%，吞吐量是 IVF_FLAT 的 3.6 倍，内存使用量约为原始向量的 1/32。当你需要进行大规模向量搜索（数百万到数十亿向量），并且内存成本是首要考虑因素时，就可以使用它--这在 RAG、推荐和多模态搜索工作负载中很常见。</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">向量量化与 LLMs 中的 KV 缓存压缩有何关系？</h3><p>这两个问题都涉及压缩高维浮点向量。KV 缓存存储来自 Transformer 注意机制的键值对；在上下文长度较长的情况下，它的内存使用量可能会超过模型权重。矢量量化技术（如 RaBitQ）可将这些向量缩减为低比特表示。无论是压缩数据库索引中的向量，还是压缩推理引擎 KV 缓存中的向量，都适用相同的数学原理--度量集中、随机旋转、无偏距离估计。</p>
