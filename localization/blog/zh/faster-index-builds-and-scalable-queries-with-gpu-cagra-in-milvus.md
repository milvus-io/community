---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: 在 Milvus 中优化英伟达™（NVIDIA®）CAGRA：实现更快索引和更低查询成本的 GPU-CPU 混合方法
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: 了解 Milvus 2.6 中的 GPU_CAGRA 如何利用 GPU 快速构建图，并利用 CPU 提供可扩展的查询服务。
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>随着人工智能系统从实验走向生产基础设施，向量数据库不再需要处理数百万个 Embeddings。<strong>现在，数十亿嵌入已经是家常便饭，数百亿嵌入也越来越常见。</strong>在这种规模下，算法选择不仅会影响性能和召回率，还会直接转化为基础设施成本。</p>
<p>这就引出了大规模部署的一个核心问题：<strong>如何选择合适的索引来提供可接受的召回率和延迟，同时又不让计算资源的使用失控？</strong></p>
<p>基于图形的索引（如<strong>NSW、HNSW、CAGRA 和 Vamana</strong>）已成为最广泛采用的答案。通过浏览预先构建的邻域图，这些索引可实现十亿级规模的快速近邻搜索，避免了对每个向量进行粗暴扫描和与查询进行比较。</p>
<p>然而，这种方法的成本状况并不均衡。<strong>查询图谱的成本相对较低，而构建图谱的成本则相对较高。</strong>构建高质量的图形需要对整个数据集进行大规模的距离计算和迭代改进--随着数据的增长，传统的 CPU 资源难以高效处理这些工作负载。</p>
<p>英伟达™（NVIDIA®）的 CAGRA 通过利用 GPU 的大规模并行性来加速图构建，从而解决了这一瓶颈问题。虽然这大大缩短了构建时间，但在生产环境中，依赖 GPU 进行索引构建和查询服务会带来更高的成本和可扩展性限制。</p>
<p>为了平衡这些权衡，<a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1</a> <strong>采用了</strong> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a> <strong>索引</strong> <strong>的混合设计</strong>：<strong>GPU 仅用于图构建，而查询执行则在 CPU 上运行。</strong>这既保留了 GPU 构建图的质量优势，又保持了查询服务的可扩展性和成本效益，因此特别适合数据更新不频繁、查询量大且对成本有严格要求的工作负载。</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">什么是 CAGRA 及其工作原理？<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>基于图的向量索引一般分为两大类：</p>
<ul>
<li><p><strong>迭代图构建</strong>，以<strong>CAGRA</strong>为代表（Milvus 已支持）。</p></li>
<li><p><strong>基于插入的图构建</strong>，以<strong>Vamana</strong>为代表（目前正在 Milvus 中开发）。</p></li>
</ul>
<p>这两种方法在设计目标和技术基础上有很大不同，因此各自适用于不同的数据规模和工作负载模式。</p>
<p><strong>英伟达™ CAGRA（基于 CUDA ANN 图形）</strong>是一种用于近似近邻（ANN）搜索的 GPU 原生算法，专为高效构建和查询大规模近邻图而设计。与基于 CPU 的方法（如 HNSW）相比，通过利用 GPU 并行性，CAGRA 大大加快了图构建速度，并提供了高吞吐量查询性能。</p>
<p>CAGRA 基于<strong>NN-Descent（近邻后裔）</strong>算法构建，该算法通过迭代细化构建 k 近邻（kNN）图。在每次迭代中，都会对候选邻居进行评估和更新，从而在整个数据集上逐渐趋近于更高质量的邻居关系。</p>
<p>每轮细化后，CAGRA 都会应用额外的图剪枝技术（如<strong>2 跳迂回剪枝），以</strong>去除冗余边，同时保持搜索质量。这种迭代细化和剪枝相结合的方法可以生成一个<strong>紧凑但连接良好的图</strong>，在查询时可以高效地进行遍历。</p>
<p>通过反复细化和剪枝，CAGRA 生成的图结构可支持<strong>大规模的高召回率和低延迟近邻搜索</strong>，因此特别适用于静态或更新不频繁的数据集。</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">步骤 1：使用 NN-Descent（近邻新陈代谢）构建初始图</h3><p>NN-Descent 算法基于一个简单而强大的观察结果：如果节点<em>u</em>是<em>v</em> 的邻居，而节点<em>w</em>是<em>u</em> 的邻居，那么<em>w</em>很可能也是<em>v</em>的邻居。这一传递属性使算法能够高效地发现真正的近邻，而无需详尽地比较每一对向量。</p>
<p>CAGRA 使用 NN-Descent 作为其核心图构建算法。其工作过程如下</p>
<p><strong>1.随机初始化：</strong>每个节点从随机选择的一小组邻居开始，形成一个粗略的初始图。</p>
<p><strong>2.邻居扩展：</strong>在每次迭代中，节点收集其当前邻居及其邻居，形成候选列表。算法会计算该节点与所有候选节点之间的相似度。由于每个节点的候选列表都是独立的，因此这些计算可以分配给独立的 GPU 线程块，并大规模并行执行。</p>
<p><strong>3.候选列表更新：</strong>如果算法发现比节点当前邻居更近的候选者，它就会交换掉更远的邻居，并更新节点的 kNN 列表。经过多次迭代，这一过程会生成质量更高的近似 kNN 图。</p>
<p><strong>4.收敛检查：</strong>随着迭代的进行，邻居更新会越来越少。一旦更新的连接数低于设定的阈值，算法就会停止，表明图已经有效地稳定下来。</p>
<p>由于不同节点的邻居扩展和相似性计算是完全独立的，因此 CAGRA 将每个节点的 NN-Descent 工作负载映射到专用的 GPU 线程块上。这种设计实现了大规模并行性，使图形构建速度比基于 CPU 的传统方法快了几个数量级。</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">第 2 步：用 2 跳迂回修剪图</h3><p>NN-Descent 完成后，生成的图虽然准确，但过于密集。NN-Descent 会有意保留额外的候选邻居，而随机初始化阶段会引入许多弱边或无关边。因此，每个节点的阶数往往是目标阶数的两倍，甚至数倍。</p>
<p>为了生成一个紧凑高效的图，CAGRA 采用了 2 跳迂回剪枝法。</p>
<p>其原理很简单：如果节点<em>A</em>可以通过共享邻居<em>C</em>间接到达节点<em>B</em>（形成一条路径 A → C → B），并且这条间接路径的距离与<em>A</em>和<em>B</em> 之间的直接距离相当，那么直接边 A → B 就被认为是多余的，可以删除。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种剪枝策略的一个主要优点是，每条边的冗余检查只取决于本地信息--两个端点及其共享邻居之间的距离。由于每条边都可以独立评估，因此剪枝步骤具有很高的并行性，可以很自然地在 GPU 上批量执行。</p>
<p>因此，CAGRA 可以在 GPU 上高效地剪枝图，将存储开销减少<strong>40-50%</strong>，同时保持搜索精度并提高查询执行过程中的遍历速度。</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">Milvus 中的 GPU_CAGRA：有什么不同？<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>虽然 GPU 为图形构建提供了重大的性能优势，但生产环境却面临着实际挑战：GPU 资源远比 CPU 昂贵且有限。如果索引构建和查询执行都完全依赖 GPU，那么很快就会出现几个操作符问题：</p>
<ul>
<li><p><strong>资源利用率低：</strong>查询流量往往是不规则的、突发的，导致 GPU 长期闲置，浪费了昂贵的计算能力。</p></li>
<li><p><strong>部署成本高：</strong>为每个查询服务实例分配 GPU 会增加硬件成本，尽管大多数查询并不能充分利用 GPU 的性能。</p></li>
<li><p><strong>可扩展性有限：</strong>可用 GPU 的数量直接决定了可以运行多少个服务副本，从而限制了根据需求进行扩展的能力。</p></li>
<li><p><strong>灵活性降低：</strong>当索引构建和查询都依赖于 GPU 时，系统就会被 GPU 的可用性所束缚，无法轻松地将工作负载转移到 CPU 上。</p></li>
</ul>
<p>为了解决这些限制，Milvus 2.6.1 通过<code translate="no">adapt_for_cpu</code> 参数为 GPU_CAGRA 索引引入了灵活的部署模式。该模式支持混合工作流程：CAGRA 使用 GPU 构建高质量的图索引，而查询执行则在 CPU 上运行--通常使用 HNSW 作为搜索算法。</p>
<p>在这种设置下，GPU 可以发挥其最大价值--快速、高精度的索引构建，而 CPU 则以更具成本效益和可扩展性的方式处理大规模查询工作负载。</p>
<p>因此，这种混合方法特别适用于以下工作负载</p>
<ul>
<li><p><strong>数据更新不频繁</strong>，因此很少重建索引</p></li>
<li><p><strong>查询量大</strong>，需要很多廉价的副本</p></li>
<li><p><strong>成本敏感度高</strong>，必须严格控制 GPU 使用量</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">了解<code translate="no">adapt_for_cpu</code></h3><p>在 Milvus 中，<code translate="no">adapt_for_cpu</code> 参数控制着 CAGRA 索引在索引构建过程中如何序列化到磁盘，以及在加载时如何反序列化到内存。通过在构建时和加载时改变这一设置，Milvus 可以在基于 GPU 的索引构建和基于 CPU 的查询执行之间灵活切换。</p>
<p><code translate="no">adapt_for_cpu</code> 在构建时间和加载时间的不同组合会产生四种执行模式，每种模式都是为特定操作场景而设计的。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>构建时间 (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>加载时间 (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>执行逻辑</strong></th><th style="text-align:center"><strong>推荐方案</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>真</strong></td><td style="text-align:center"><strong>真</strong></td><td style="text-align:center">使用 GPU_CAGRA 构建 → 序列化为 HNSW → 反序列化为 HNSW →<strong>CPU 查询</strong></td><td style="text-align:center">成本敏感型工作负载；大规模查询服务</td></tr>
<tr><td style="text-align:center"><strong>真</strong></td><td style="text-align:center"><strong>假</strong></td><td style="text-align:center">使用 GPU_CAGRA 构建 → 序列化为 HNSW → 反序列化为 HNSW →<strong>CPU 查询</strong></td><td style="text-align:center">当出现参数不匹配时，后续查询返回 CPU</td></tr>
<tr><td style="text-align:center"><strong>假</strong></td><td style="text-align:center"><strong>真</strong></td><td style="text-align:center">使用 GPU_CAGRA 构建 → 序列化为 CAGRA → 反序列化为 HNSW →<strong>CPU 查询</strong></td><td style="text-align:center">保留原始 CAGRA 索引用于存储，同时启用临时 CPU 搜索</td></tr>
<tr><td style="text-align:center"><strong>假</strong></td><td style="text-align:center"><strong>错误</strong></td><td style="text-align:center">使用 GPU_CAGRA 构建 → 序列化为 CAGRA → 反序列化为 CAGRA →<strong>GPU 查询</strong></td><td style="text-align:center">成本次要的性能关键型工作负载</td></tr>
</tbody>
</table>
<p><strong>注：</strong> <code translate="no">adapt_for_cpu</code> 机制仅支持单向转换。CAGRA 索引可以转换为 HNSW，因为 CAGRA 图结构保留了 HNSW 所需的所有相邻关系。但是，HNSW 索引不能转换回 CAGRA，因为它缺乏基于 GPU 的查询所需的附加结构信息。因此，应谨慎选择构建时间设置，并考虑长期部署和查询需求。</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">测试 GPU_CAGRA<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>为了评估混合执行模型（使用 GPU 构建索引，CPU 执行查询）的有效性，我们在标准化环境中进行了一系列受控实验。评估主要集中在三个方面：<strong>索引构建性能</strong>、<strong>查询性能</strong>和<strong>召回准确率</strong>。</p>
<p><strong>实验设置</strong></p>
<p>实验在广泛采用的行业标准硬件上进行，以确保结果的可靠性和广泛适用性。</p>
<ul>
<li><p>中央处理器：MD EPYC 7R13 处理器（16 CPU）</p></li>
<li><p>图形处理器英伟达 L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1.索引构建性能</h3><p>在相同的 64 目标图度下，我们比较了在 GPU 上构建的 CAGRA 和在 CPU 上构建的 HNSW。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主要发现</strong></p>
<ul>
<li><p><strong>GPU CAGRA 建立索引的速度比 CPU HNSW 快 12-15 倍。</strong>在 Cohere1M 和 Gist1M 上，基于 GPU 的 CAGRA 都明显优于基于 CPU 的 HNSW，凸显了 GPU 并行性在图构建过程中的效率。</p></li>
<li><p><strong>构建时间随 NN-Descent 迭代次数的增加而线性增长。</strong>随着迭代次数的增加，构建时间也以接近线性的方式增长，这反映了 NN-Descent迭代精炼的特性，并在构建成本和图质量之间提供了可预测的权衡。</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2.查询性能</h3><p>在本实验中，CAGRA 图在 GPU 上构建一次，然后使用两种不同的执行路径进行查询：</p>
<ul>
<li><p><strong>CPU 查询</strong>：将索引反序列化为 HNSW 格式并在 CPU 上搜索</p></li>
<li><p><strong>GPU 查询</strong>：使用基于 GPU 的遍历直接在 CAGRA 图上运行搜索</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主要发现</strong></p>
<ul>
<li><p><strong>GPU 搜索吞吐量比 CPU 搜索高 5-6 倍。</strong>在 Cohere1M 和 Gist1M 中，基于 GPU 的遍历大大提高了 QPS，凸显了 GPU 上并行图导航的效率。</p></li>
<li><p><strong>Recall 随 NN-Descent 迭代次数的增加而增加，然后趋于平稳。</strong>随着构建迭代次数的增加，CPU 和 GPU 查询的召回率都有所提高。然而，超过一定程度后，更多的迭代产生的收益会逐渐减少，这表明图的质量已基本趋同。</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3.召回准确率</h3><p>在本实验中，CAGRA 和 HNSW 均在 CPU 上进行查询，以比较相同查询条件下的召回率。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主要发现</strong></p>
<p><strong>在这两个数据集上，CAGRA 的召回率都高于 HNSW</strong>，这表明即使在 GPU 上建立 CAGRA 索引并反序列化供 CPU 搜索时，图的质量也能得到很好的保持。</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">下一步：使用 Vamana 扩展索引构建<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus的GPU-CPU混合方法为当今的大规模向量搜索工作负载提供了一种实用且具有成本效益的解决方案。通过在 GPU 上构建高质量的 CAGRA 图，并在 CPU 上提供查询服务，它将快速索引构建与可扩展<strong>、</strong>经济实惠的查询执行相结合--尤其<strong>适合更新频率低、查询量大和成本限制严格的工作负载。</strong></p>
<p>在更大规模（<strong>数百亿或数千亿向量</strong>）的情况下，<strong>索引</strong>构建本身就会成为瓶颈。当整个数据集不再适合 GPU 内存时，业界通常会转向<strong>基于插入的图构建</strong>方法，如<strong>Vamana</strong>。Vamana 不是一次性构建图，而是分批处理数据，在保持全局连接性的同时逐步插入新向量。</p>
<p>其构建管道遵循三个关键阶段：</p>
<p><strong>1.几何批量增长</strong>--从小批量开始形成骨架图，然后增加批量大小以最大化并行性，最后使用大批量来完善细节。</p>
<p><strong>2.贪婪插入</strong>--每个新节点都从一个中心入口点导航插入，并迭代完善其邻居集。</p>
<p><strong>3.后向边更新</strong>--添加<strong>反向</strong>连接，以保持对称性并确保高效的图导航。</p>
<p>使用 α-RNG 准则将剪枝直接集成到构建过程中：如果候选邻居<em>v</em>已被现有邻居<em>p′</em>覆盖（即<em>d(p′, v) &lt; α × d(p,v)</em>），则<em>v</em>将被剪枝。参数 α 可以精确控制稀疏性和准确性。GPU 加速是通过批内并行和几何批量缩放实现的，在索引质量和吞吐量之间取得了平衡。</p>
<p>这些技术结合在一起，使团队能够处理快速的数据增长和大规模的索引更新，而不会受到 GPU 内存的限制。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 团队正在积极构建 Vamana 支持，目标是在 2026 年上半年发布。敬请期待。</p>
<p>对最新 Milvus 的任何功能有疑问或想深入了解？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预约 20 分钟的一对一课程，获得见解、指导和问题解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">了解有关 Milvus 2.6 功能的更多信息<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介绍 Milvus 2.6：十亿规模的经济型向量搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介绍 Embeddings 功能：Milvus 2.6 如何简化向量化和语义搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus中的JSON粉碎功能：快88.9倍的灵活JSON过滤功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解锁真正的实体级检索：Milvus 中新的结构数组和 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus如何利用RaBitQ将查询次数提高3倍</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准会说谎--向量数据库需要真正的测试 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们为 Milvus 用啄木鸟取代了 Kafka/Pulsar</a></p></li>
</ul>
