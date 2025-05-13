---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: 将向量压缩发挥到极致：Milvus 如何利用 RaBitQ 将查询次数提高 3 倍
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: 了解 Milvus 如何利用 RaBitQ 提高向量搜索效率，在保持准确性的同时降低内存成本。立即了解如何优化您的人工智能解决方案！
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a>是一个开源、高度可扩展的向量数据库，支持十亿向量规模的语义搜索。随着用户部署 RAG 聊天机器人、人工智能客户服务以及如此规模的可视化搜索，一个共同的挑战出现了：<strong>基础设施成本。</strong>相比之下，指数级的业务增长令人兴奋，但飞涨的云计算费用却并不令人兴奋。快速向量搜索通常需要在内存中存储向量，而这是很昂贵的。自然，你可能会问：<em>我们能压缩向量以节省空间，同时又不影响搜索质量吗？</em></p>
<p>答案是<strong>肯定的</strong>，在本篇博客中，我们将向您展示如何实施一种名为<a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a>的新技术，使 Milvus 能够以更低的内存成本提供 3 倍以上的流量，同时保持相当的准确性。我们还将分享将 RaBitQ 集成到开源 Milvus 和<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 上全面管理的 Milvus 服务中的实践经验。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">了解向量搜索和压缩<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解 RaBitQ 之前，我们先来了解一下面临的挑战。</p>
<p><a href="https://zilliz.com/glossary/anns"><strong>近似近邻（ANN）</strong></a>搜索算法是向量数据库的核心，它能找到与给定查询最接近的前 k 个向量。向量是高维空间中的坐标，通常由数百个浮点数组成。随着向量数据规模的扩大，存储和计算需求也随之增加。例如，在 FP32 中使用 10 亿个 768 维向量运行<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>（一种 ANN 搜索算法）需要超过 3TB 的内存！</p>
<p>就像 MP3 通过舍弃人耳无法感知的频率来压缩音频一样，向量数据也可以在对搜索精度影响最小的情况下进行压缩。研究表明，全精度 FP32 通常对 ANN 来说是不必要的。<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> 标量量化</a>（SQ）是一种流行的压缩技术，它将浮点数值映射到离散的分区中，并使用低位整数只存储分区索引。量化方法用更少的比特表示相同的信息，从而大大减少了内存使用量。该领域的研究致力于以最小的精度损失实现最大的节省。</p>
<p>最极端的压缩技术--1 位标量量化，也称为<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">二进制量化--</a>用一位<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">表示</a>每个浮点数。与 FP32（32 位编码）相比，内存使用量减少了 32 倍。由于内存通常是向量搜索的主要瓶颈，这种压缩可以显著提高性能。<strong>不过，挑战在于如何保持搜索精度。</strong>通常情况下，1 位 SQ 会将召回率降低到 70% 以下，使其几乎无法使用。</p>
<p>这正是<strong>RaBitQ</strong>脱颖而出的原因--它是一种出色的压缩技术，可在保持高召回率的同时实现 1 位量化。Milvus 现在从 2.6 版开始支持 RaBitQ，使向量数据库的 QPS 提高了 3 倍，同时保持了相当高的准确率。</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">RaBitQ 简介<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a>是一种设计巧妙的二进制量化方法，它利用高维空间的几何特性实现了高效、精确的向量压缩。</p>
<p>乍一看，将向量的每个维度减少到一个比特似乎过于激进，但在高维空间中，我们的直觉往往会失灵。正如 RaBitQ 的作者高建阳所<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> 说明的</a>，高维向量表现出一种特性，即单个坐标往往紧紧集中在零点附近，这是《<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> 度量的集中</a>》一书中解释的一种反直觉现象的结果。这使得在保留精确近邻搜索所需的相对结构的同时，还能舍弃大部分原始精度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图高维几何中的反直觉数值分布。<em>考虑从单位球中均匀采样的随机单位向量的一维值，其值在三维空间中均匀分布。然而，对于高维空间（如 1000D），数值集中在零附近，这是高维几何的一个非直观特性。(图片来源：<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">反直觉的高维空间量化）</a></em></p>
<p>受到高维空间这一特性的启发，<strong>RaBitQ 专注于编码角度信息，而不是精确的空间坐标</strong>。为此，它将每个数据向量相对于参考点（如数据集的中心点）进行归一化处理。然后将每个向量映射到超立方体上与其最接近的顶点，这样每个维度只需 1 位即可表示。这种方法自然可以扩展到<code translate="no">IVF_RABITQ</code> ，在这里，归一化是相对于最近的聚类中心点进行的，从而提高了局部编码的准确性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图通过在超立方体上寻找最接近的近似值来压缩向量，这样每个维度只需 1 比特就能表示。(图片来源：</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>反直觉高维空间中的量化）</em></a></p>
<p>为了确保即使在这种压缩表示法下搜索仍然可靠，RaBitQ 引入了一种<strong>有理论基础的无偏估计器</strong>，用于估计查询向量与二进制量化文档向量之间的距离。这有助于最大限度地减少重构误差并保持高召回率。</p>
<p>RaBitQ 还与其他优化技术高度兼容，如<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a>和<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> 随机旋转预处理</a>。此外，RaBitQ 还具有<strong>训练轻便、执行快速的</strong>特点。训练只需确定每个向量分量的符号，搜索则通过现代 CPU 支持的快速位操作来加速。通过这些优化，RaBitQ 能够以最小的精度损失提供高速搜索。</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Milvus 中的 RaBitQ 工程：从学术研究到生产应用<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>虽然 RaBitQ 在概念上简单明了，并附有<a href="https://github.com/gaoj0017/RaBitQ"> 参考实现</a>，但要将其应用到 Milvus 这样的分布式生产级向量数据库中，还面临着一些工程挑战。我们在 Knowhere（Milvus 的核心向量搜索引擎）中实现了 RaBitQ，并为开源 ANN 搜索库<a href="https://github.com/facebookresearch/faiss"> FAISS</a> 提供了优化版本。</p>
<p>让我们来看看我们是如何在 Milvus 中实现这一算法的。</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">实现上的权衡</h3><p>一个重要的设计决策涉及处理<strong>每个向量的辅助数据</strong>。RaBitQ 要求每个向量有两个浮点值需要在索引时预先计算，第三个值可以是动态配置计算的，也可以是预先计算的。在 Knowhere 中，我们选择在编制索引时预先计算这个值，并将其存储起来，以提高搜索效率。相比之下，FAISS 的实现方式是在查询时进行计算，从而节省了内存，在内存使用和查询速度之间做出了不同的权衡。</p>
<p>一个重要的设计决策涉及处理<strong>每个向量的辅助数据</strong>。RaBitQ 要求每个向量有两个浮点数值在索引时预先计算，第三个数值可以是动态配置计算的，也可以是预先计算的。在 Knowhere 中，我们在编制索引时预先计算了这个值，并将其存储起来，以提高搜索效率。相比之下，FAISS 实现在查询时计算该值，从而节省了内存，在内存使用和查询速度之间做出了不同的权衡。</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">硬件加速</h3><p>现代 CPU 提供的专用指令可以显著加速二进制操作。我们定制了距离计算内核，以利用现代 CPU 指令的优势。由于 RaBitQ 依赖于 popcount 操作，我们在 Knowhere 中创建了一个专门的路径，在可用时使用 AVX512 的<code translate="no">VPOPCNTDQ</code> 指令。在支持的硬件（如英特尔冰湖或 AMD Zen 4）上，这可以将二进制距离计算的速度提高数倍。</p>
<h3 id="Query-Optimization" class="common-anchor-header">查询优化</h3><p>Knowhere（Milvus 的搜索引擎）和我们的 FAISS 优化版本都支持对查询向量进行标量量化（SQ1-SQ8）。这提供了额外的灵活性：即使采用 4 位查询量化，召回率仍然很高，而计算需求却大幅降低，这在必须以高吞吐量处理查询时尤其有用。</p>
<p>我们进一步优化了专有的 Cardinal 引擎，该引擎为 Zilliz Cloud 上完全托管的 Milvus 提供动力。除了开源 Milvus 的功能外，我们还引入了先进的增强功能，包括与基于图的向量索引集成、额外的优化层以及对 Arm SVE 指令的支持。</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">性能提升：在精度相当的情况下提高 3 倍 QPS<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>从 2.6 版开始，Milvus 引入了新的<code translate="no">IVF_RABITQ</code> 索引类型。这种新索引将 RaBitQ 与 IVF 聚类、随机旋转变换和可选细化相结合，在性能、内存效率和准确性之间实现了最佳平衡。</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">在应用程序中使用 IVF_RABITQ</h3><p>以下是如何在你的 Milvus 应用程序中实现<code translate="no">IVF_RABITQ</code> ：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">基准测试：数字说明问题</h3><p>我们使用<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a> 对不同的配置进行了基准测试，这是一款用于评估向量数据库的开源基准测试工具。测试和控制环境都使用了部署在 AWS EC2<code translate="no">m6id.2xlarge</code> 实例上的 Milvus Standalone。这些机器具有 8 个 vCPU、32 GB 内存和基于冰湖架构的英特尔至强 8375C CPU，该 CPU 支持 VPOPCNTDQ AVX-512 指令集。</p>
<p>我们使用 vdb-bench 中的搜索性能测试，数据集包含 100 万个向量，每个向量有 768 个维度。由于 Milvus 的默认分段大小为 1 GB，而原始数据集（768 维×100 万向量×每个浮点 4 字节）的总大小约为 3 GB，因此基准测试涉及每个数据库的多个分段。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图vdb-bench 中的测试配置示例。</p>
<p>下面是 IVF、RaBitQ 和细化过程配置旋钮的一些低级细节：</p>
<ul>
<li><p><code translate="no">nlist</code> 和 是所有基于 方法的标准参数<code translate="no">nprobe</code> <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> 是一个非负整数，用于指定数据集的 IVF 桶总数。</p></li>
<li><p><code translate="no">nprobe</code> 是一个非负整数，用于指定搜索过程中单个数据向量所访问的 IVF 桶的数量。这是一个与搜索相关的参数。</p></li>
<li><p><code translate="no">rbq_bits_query</code> 指定查询向量的量化程度。使用 1...8 值表示 ... 量化级别。使用 0 值可禁用量化。这是一个与搜索相关的参数。<code translate="no">SQ1</code><code translate="no">SQ8</code> </p></li>
<li><p><code translate="no">refine</code>,<code translate="no">refine_type</code> 和<code translate="no">refine_k</code> 参数是细化过程的标准参数</p></li>
<li><p><code translate="no">refine</code> 是一个布尔值，用于启用细化策略。</p></li>
<li><p><code translate="no">refine_k</code> 是一个非负的 fp 值。细化过程使用更高质量的量化方法，从 倍的候选池中挑选出所需的近邻数量，这些候选池是通过 选取的。这是一个与搜索相关的参数。<code translate="no">refine_k</code> <code translate="no">IVFRaBitQ</code></p></li>
<li><p><code translate="no">refine_type</code> 是一个字符串，用于指定细化索引的量化类型。可用选项为 , , , 和 / 。<code translate="no">SQ6</code> <code translate="no">SQ8</code> <code translate="no">FP16</code> <code translate="no">BF16</code> <code translate="no">FP32</code> <code translate="no">FLAT</code></p></li>
</ul>
<p>结果揭示了重要的启示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图：采用不同细化策略的基准 (IVF_FLAT)、IVF_SQ8 和 IVF_RABITQ 的成本和性能比较</p>
<p>基线<code translate="no">IVF_FLAT</code> 索引的吞吐量为 236 QPS，召回率为 95.2%，相比之下，<code translate="no">IVF_RABITQ</code> 的吞吐量明显更高--使用 FP32 查询时为 648 QPS，使用 SQ8 量化查询时为 898 QPS。这些数据证明了 RaBitQ 的性能优势，尤其是在应用细化时。</p>
<p>不过，这种性能在召回率方面有明显的折损。在不进行细化的情况下使用<code translate="no">IVF_RABITQ</code> 时，召回率约为 76%，这对于要求高准确度的应用来说可能是不够的。尽管如此，使用 1 位向量压缩达到这样的召回率水平仍然令人印象深刻。</p>
<p>细化对恢复准确性至关重要。当配置 SQ8 查询和 SQ8 精炼功能时，<code translate="no">IVF_RABITQ</code> 可提供出色的性能和召回率。它保持了 94.7% 的高召回率，几乎与 IVF_FLAT 相当，同时达到了 864 QPS，比 IVF_FLAT 高出 3 倍多。即使与另一种流行的量化指数<code translate="no">IVF_SQ8</code> 相比，经过 SQ8 精炼的<code translate="no">IVF_RABITQ</code> 也能在相似的召回率下实现一半以上的吞吐量，只是成本略高。因此，对于既要求速度又要求准确性的应用场景来说，它是一个极佳的选择。</p>
<p>简而言之，<code translate="no">IVF_RABITQ</code> 本身就能在召回率可接受的情况下实现吞吐量最大化，如果与细化功能搭配使用，功能会更加强大，与<code translate="no">IVF_FLAT</code> 相比，只需占用一小部分内存空间，就能缩小质量差距。</p>
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
    </button></h2><p>RaBitQ 标志着向量量化技术的重大进步。它将二进制量化与智能编码策略相结合，实现了看似不可能实现的目标：以最小的精度损失实现极致压缩。</p>
<p>从即将推出的 2.6 版开始，Milvus 将引入 IVF_RABITQ，将这一强大的压缩技术与 IVF 聚类和细化策略整合在一起，将二进制量化技术引入到生产中。这种组合在准确性、速度和内存效率之间实现了实用的平衡，可以改变你的向量搜索工作负载。</p>
<p>我们致力于为开源 Milvus 及其在 Zilliz Cloud 上的全面托管服务带来更多类似的创新，使向量搜索更加高效，让每个人都能使用。</p>
<p>敬请期待 Milvus 2.6 发布，它将提供更多强大功能，请加入我们的社区<a href="https://milvus.io/discord"> milvus.io/discord</a>，了解更多信息、分享经验或提出问题。</p>
