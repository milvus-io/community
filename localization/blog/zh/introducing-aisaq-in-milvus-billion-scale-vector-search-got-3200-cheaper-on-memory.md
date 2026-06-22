---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: |
  Milvus 中引入 AISAQ：十亿量级向量搜索的内存成本降低了 3,200 倍
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: 了解 Milvus 如何借助 AISAQ 将内存成本降低 3200 倍，从而实现无需 DRAM 开销的可扩展数十亿向量搜索。
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>向量数据库已成为关键任务型人工智能系统的核心基础设施，其数据量正呈指数级增长——通常达到数十亿个向量。在这种规模下，一切都变得更加困难：保持低延迟、维持准确性、确保可靠性，以及在副本和不同区域之间进行操作。但有一个挑战往往会很早显现出来，并主导架构决策<strong>——成本。</strong></p>
<p>为了实现快速搜索，大多数向量数据库将关键索引结构保存在DRAM（动态随机存取存储器）中，这是速度最快但成本最高的存储层。这种设计虽然能有效提升性能，但扩展性较差。 DRAM 的使用量随数据规模而非查询流量而增长，即使采用压缩或部分 SSD 卸载技术，索引的大部分仍必须保存在内存中。随着数据集的增长，内存成本很快就会成为限制因素。</p>
<p>Milvus 已支持<strong>DISKANN</strong>——一种基于磁盘的人工神经网络（ANN）方案，通过将大部分索引迁移至 SSD 来减轻内存压力。然而，DISKANN 在搜索过程中仍依赖 DRAM 存储压缩后的表示形式。<a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a>在此基础上更进一步，推出了受<a href="https://milvus.io/docs/diskann.md">DISKANN</a> 启发的基于磁盘的向量索引<a href="https://milvus.io/docs/aisaq.md">AISAQ</a>。 由 KIOXIA 开发的 AiSAQ 架构采用“零 DRAM 占用架构”设计，将所有搜索关键数据存储在磁盘上，并通过优化数据布局来最大限度地减少 I/O 操作。 在十亿向量的工作负载下，这将内存使用量从<strong>32 GB 降至约 10 MB——</strong> <strong>减少了 3,200 倍</strong>——同时保持了实际性能。</p>
<p>在接下来的章节中，我们将阐述基于图的向量搜索的工作原理、内存开销的来源，以及 AISAQ 如何重塑数十亿量级向量搜索的成本曲线。</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">传统基于图的向量搜索的工作原理<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>向量搜索</strong>是在高维空间中查找数值表示最接近查询的数据点的过程。 “最近”仅指根据距离函数（如余弦距离或 L2 距离）计算出的最小距离。在小规模情况下，这很简单：计算查询向量与每个向量之间的距离，然后返回最近的那些。但在大规模（例如十亿级）情况下，这种方法很快就会变得过于缓慢，难以实际应用。</p>
<p>为了避免穷举比较，现代近似最近邻搜索（ANNS）系统依赖于<strong>基于图的索引</strong>。索引不再将查询与每个向量逐一比较，而是将向量组织成一个<strong>图</strong>。每个节点代表一个向量，边则连接数值相近的向量。这种结构使系统能够大幅缩小搜索空间。</p>
<p>该图是预先构建的，仅基于向量之间的关系，不依赖于查询。当收到查询时，系统的任务是<strong>高效地遍历该图</strong>，并识别出与查询距离最小的向量——而无需扫描整个数据集。</p>
<p>搜索从图中预先定义的<strong>入口点</strong>开始。该起点可能距离查询很远，但算法会通过逐步向看似更接近查询的向量移动，来优化其位置。在此过程中，搜索会维护两个协同工作的内部数据结构：<strong>候选列表</strong>和<strong>结果列表</strong>。</p>
<p>而该过程中最重要的两个步骤是扩展候选列表和更新结果列表。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">扩展候选列表</h3><p><strong>候选列表</strong>代表了搜索的下一步方向。它是一组按优先级排序的图节点，这些节点根据其与查询的距离被认为具有较高的匹配可能性。</p>
<p>在每次迭代中，算法会：</p>
<ul>
<li><p><strong>选择迄今发现的最接近的候选节点。</strong>从候选列表中，选取与查询向量距离最小的向量。</p></li>
<li><p><strong>从图中检索该向量的邻居。</strong>这些邻居是在构建索引时被识别为与当前向量距离较近的向量。</p></li>
<li><p><strong>评估未访问的邻居并将其添加到候选列表中。</strong>对于每个尚未探索过的邻居，算法会计算其与查询的距离。已访问过的邻居将被跳过，而新的邻居若看起来有希望，则会被插入到候选列表中。</p></li>
</ul>
<p>通过反复扩展候选列表，搜索过程会逐步探索图中相关性越来越高的区域。这使得算法在仅检查所有向量中的一小部分的同时，也能稳步向更优解迈进。</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">更新结果列表</h3><p>与此同时，算法会维护一个<strong>结果列表</strong>，用于记录迄今为止为最终输出找到的最佳候选项。随着搜索的进行，它会：</p>
<ul>
<li><p><strong>追踪遍历过程中遇到的最近向量。</strong>这些包括被选中进行扩展的向量，以及沿途评估的其他向量。</p></li>
<li><p><strong>存储它们与查询向量的距离。</strong>这使得对候选向量进行排序并维护当前前 K 个最近邻成为可能。</p></li>
</ul>
<p>随着时间推移，当评估的候选向量越来越多而改进空间越来越小，结果列表便趋于稳定。一旦进一步探索图结构不太可能产生更接近的向量，搜索便终止，并将结果列表作为最终答案返回。</p>
<p>简而言之，<strong>候选列表控制着探索过程</strong>，而<strong>结果列表则记录了迄今为止发现的最佳答案</strong>。</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">基于图的向量搜索中的权衡<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>正是这种基于图的方法，才使得大规模向量搜索成为可能。通过遍历图结构而非扫描每个向量，系统仅需处理数据集的一小部分，就能找到高质量的结果。</p>
<p>然而，这种效率并非没有代价。基于图的搜索暴露了<strong>准确率与成本</strong>之间的一种根本性权衡<strong>。</strong></p>
<ul>
<li><p>探索更多邻居可以覆盖更大的图区域，从而降低遗漏真实最近邻的可能性，进而提高准确率。</p></li>
<li><p>与此同时，每次额外的扩展都会增加工作量：更多的距离计算、更多对图结构的访问，以及更多向量数据的读取。随着搜索范围向更深或更广的方向扩展，这些成本会不断累积。根据索引的设计方式不同，这些成本会表现为更高的 CPU 占用率、更大的内存压力或额外的磁盘 I/O。</p></li>
</ul>
<p>平衡这些相互对立的因素——高召回率与高效的资源利用——是图搜索设计的核心。</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a>和<strong>AISAQ</strong>均围绕这一矛盾构建，但在如何以及在何处承担这些成本方面，它们做出了不同的架构选择。</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">DISKANN 如何优化基于磁盘的向量搜索<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN 是迄今为止最具影响力的基于磁盘的 ANN 解决方案，也是 NeurIPS Big ANN 竞赛的官方基准——该竞赛是十亿量级向量搜索的全球基准。其意义不仅在于性能，更在于它所证明的一点：<strong>基于图的 ANN 搜索并不需要完全驻留内存才能实现高速运行</strong>。</p>
<p>通过将基于 SSD 的存储与精心设计的内存结构相结合，DISKANN 证明了大规模向量搜索可以在通用硬件上实现高精度和低延迟——而无需占用大量 DRAM 空间。它通过重新思考<em>搜索的哪些部分必须快速</em>，<em>哪些部分可以容忍较慢的访问速度</em>来实现这一点。</p>
<p><strong>从宏观层面来看，DISKANN 将访问频率最高的数据保存在内存中，而将体积较大、访问频率较低的结构移至磁盘。</strong>这种平衡是通过若干关键的设计选择实现的。</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. 使用 PQ 距离扩展候选列表</h3><p>扩展候选项列表是基于图的搜索中最频繁的操作。每次扩展都需要估算查询向量与候选项节点的邻居之间的距离。如果使用完整的高维向量进行这些计算，将需要频繁地从磁盘进行随机读取——这在计算和 I/O 方面都是非常耗费资源的操作。</p>
<p>DISKANN 通过将向量压缩为<strong>产品量化（PQ）码并</strong>保存在内存中，从而避免了这一开销。PQ 码的体积远小于完整向量，但仍保留了足够的信息以进行近似距离估算。</p>
<p>在候选节点扩展过程中，DISKANN 利用内存中的 PQ 码计算距离，而非从 SSD 读取完整向量。这极大地减少了图遍历过程中的磁盘 I/O，使搜索能够快速高效地扩展候选节点，同时将大部分 SSD 流量排除在关键路径之外。</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. 将完整向量与邻居列表在磁盘上共置</h3><p>并非所有数据都能被压缩或通过近似方式访问。一旦确定了有潜力的候选节点，搜索过程仍需访问以下两类数据以获得准确结果：</p>
<ul>
<li><p><strong>邻接列表</strong>，用于继续图遍历</p></li>
<li><p><strong>完整（未压缩）向量</strong>，用于最终重新排序</p></li>
</ul>
<p>由于这些结构的访问频率低于 PQ 码，因此 DISKANN 将其存储在 SSD 上。为最大限度地降低磁盘开销，DISKANN 将每个节点的邻居列表及其完整向量放置在磁盘上的同一物理区域内。这确保了一次 SSD 读取即可同时获取两者。</p>
<p>通过将相关数据集中存储，DISKANN 减少了搜索过程中所需的随机磁盘访问次数。这种优化既提高了扩展效率，也提升了重新排序效率，尤其在大规模场景下效果显著。</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. 并行节点扩展以提高 SSD 利用率</h3><p>基于图的人工神经网络（ANN）搜索是一个迭代过程。如果每次迭代仅扩展一个候选节点，系统每次仅发出一次磁盘读取请求，导致 SSD 的大部分并行带宽被闲置。 为避免这种低效情况，DISKANN 在每次迭代中扩展多个候选节点，并向 SSD 发送并行读取请求。这种方法能更充分地利用可用带宽，并减少所需的总迭代次数。</p>
<p>参数<strong>beam_width_ratio</strong>控制并行扩展的候选节点数量：<strong>搜索宽度 = CPU 核心数 × beam_width_ratio。</strong>较高的比率会扩大搜索范围——可能提高准确率——但也会增加计算量和磁盘 I/O。</p>
<p>为抵消这一影响，DISKANN引入了<code translate="no">search_cache_budget_gb_ratio</code> ，该机制预留内存以缓存频繁访问的数据，从而减少对SSD的重复读取。这些机制共同作用，帮助DISKANN在准确率、延迟和I/O效率之间取得平衡。</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">为何这很重要——以及局限性何在</h3><p>DISKANN 的设计是基于磁盘的向量搜索领域的一大进步。通过将 PQ 码保存在内存中，并将更大的结构推送到 SSD，与完全基于内存的图索引相比，它显著减少了内存占用。</p>
<p>与此同时，该架构仍依赖于<strong>始终处于活动状态的 DRAM</strong>来存储搜索关键数据。PQ 码、缓存和控制结构必须驻留在内存中，以保持遍历效率。随着数据集规模扩大至数十亿个向量，以及部署中增加副本或区域，这种内存需求仍可能成为限制因素。</p>
<p><strong>AISAQ</strong>的设计正是为了弥补这一差距。</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">AISAQ 的工作原理及其重要性<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ 直接基于 DISKANN 的核心理念构建，但引入了一项关键转变：它消除了<strong>将 PQ 数据保存在 DRAM 中的必要性</strong>。AISAQ 不再将压缩向量视为对搜索至关重要且必须始终驻留内存的结构，而是将其移至 SSD，并重新设计了图数据在磁盘上的布局方式，以保持高效的遍历效率。</p>
<p>为实现这一目标，AISAQ 重新组织了节点存储方式，使图搜索过程中所需的数据——完整向量、邻居列表和 PQ 信息——在磁盘上以优化访问局部性的模式进行排列。其目标不仅是将更多数据转移到更经济的磁盘上，而且<strong>要在不破坏前述搜索流程的前提下</strong>实现这一点。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>为满足不同的应用需求，AISAQ 提供了两种基于磁盘的存储模式：性能模式和规模模式。从技术角度来看，这两种模式的主要区别在于搜索过程中 PQ 压缩数据的存储和访问方式。 从应用角度来看，这两种模式分别满足两类截然不同的需求：低延迟需求（典型应用于在线语义搜索和推荐系统），以及超大规模需求（典型应用于 RAG）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance：针对速度进行优化</h3><p>AISAQ-performance 将所有数据保存在磁盘上，同时通过数据共置保持较低的 I/O 开销。</p>
<p>在此模式下：</p>
<ul>
<li><p>每个节点的完整向量、边列表及其邻居的 PQ 代码均共同存储在磁盘上。</p></li>
<li><p>访问一个节点仍只需<strong>一次 SSD 读取操作</strong>，因为候选节点扩展和评估所需的所有数据均已共置。</p></li>
</ul>
<p>从搜索算法的角度来看，这与 DISKANN 的访问模式极为相似。尽管所有对搜索至关重要的数据现在都存储在磁盘上，但候选节点扩展依然高效，运行时性能也与 DISKANN 相当。</p>
<p>其代价是存储开销。由于邻居节点的 PQ 数据可能出现在多个节点的磁盘页中，这种布局会引入冗余，并显著增加整体索引大小。</p>
<p>因此，AISAQ-Performance模式优先考虑低I/O延迟，而非磁盘效率。从应用角度来看，AISAQ-Performance模式可实现10毫秒量级的延迟，满足在线语义搜索的要求。</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-scale：针对存储效率进行优化</h3><p>AISAQ-Scale 则采取了相反的策略。其设计旨在<strong>最大限度地减少磁盘使用</strong>，同时仍将所有数据保存在 SSD 上。</p>
<p>在此模式下：</p>
<ul>
<li><p>PQ 数据单独存储在磁盘上，且不包含冗余。</p></li>
<li><p>这消除了冗余，并大幅缩减了索引大小。</p></li>
</ul>
<p>其取舍在于：访问某个节点及其邻居节点的 PQ 码可能需要<strong>多次 SSD 读取操作</strong>，从而在候选项扩展过程中增加了 I/O 操作。若不进行优化，这将显著降低搜索速度。</p>
<p>为控制这种开销，AISAQ-Scale 模式引入了两项额外优化：</p>
<ul>
<li><p><strong>PQ 数据重排</strong>：按访问优先级对 PQ 向量进行排序，以提升局部性并减少随机读取。</p></li>
<li><p><strong>DRAM中的PQ缓存</strong>（<code translate="no">pq_read_page_cache_size</code> ），用于存储频繁访问的PQ数据，从而避免对热门条目进行重复的磁盘读取。</p></li>
</ul>
<p>借助这些优化，AISAQ-Scale 模式在保持实用搜索性能的同时，实现了比 AISAQ-Performance 模式更优的存储效率。虽然其性能仍低于 DISKANN，但不存在存储开销（索引大小与 DISKANN 相当），且内存占用大幅减少。 从应用角度来看，AiSAQ 提供了在超大规模下满足 RAG 需求的方法。</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">AISAQ 的主要优势</h3><p>通过将所有对搜索至关重要的数据移至磁盘，并重新设计数据访问方式，AISAQ 从根本上改变了基于图的向量搜索的成本和可扩展性特征。其设计带来了三大显著优势。</p>
<p><strong>1. DRAM 使用量最高可降低 3,200 倍</strong></p>
<p>产品量化（Product Quantization）显著缩减了高维向量的体积，但在数十亿量级下，内存占用依然相当可观。即使经过压缩，在传统设计中，PQ 码在搜索过程中仍必须保存在内存中。</p>
<p>例如，在包含 10 亿个 128 维向量的基准测试集<strong>SIFT1B</strong> 上，仅 PQ 编码就根据配置不同，需要大约<strong>30–120 GB 的 DRAM</strong>。 若要存储完整的未压缩向量，则需额外<strong>约 480 GB</strong> 空间。尽管 PQ 可将内存占用降低 4–16 倍，但剩余的内存占用量仍大到足以主导基础设施成本。</p>
<p>AISAQ 完全消除了这一需求。通过将 PQ 码存储在 SSD 而非 DRAM 上，持久化索引数据不再占用内存。DRAM 仅用于存储候选列表和控制元数据等轻量级、临时结构。实际上，这将内存使用量从数十 GB<strong>降至约 10 MB</strong>。 在典型的十亿级配置中，DRAM 占用量从<strong>32 GB 降至 10 MB</strong>，<strong>减少了 3,200 倍</strong>。</p>
<p>鉴于 SSD<strong>的单位容量</strong>存储成本约为 DRAM<strong>的 1/30</strong>，这种转变对系统总成本产生了直接且显著的影响。</p>
<p><strong>2. 无额外 I/O 开销</strong></p>
<p>将 PQ 代码从内存移至磁盘通常会增加搜索过程中的 I/O 操作次数。 AISAQ 通过仔细控制<strong>数据布局和访问模式</strong>来避免这种情况。AISAQ 不会将相关数据分散在磁盘上，而是将 PQ 代码、完整向量和邻居列表集中存放，以便能够一起检索。这确保了候选项扩展不会引入额外的随机读取。</p>
<p>为了让用户能够控制索引大小与I/O效率之间的权衡，AISAQ引入了<code translate="no">inline_pq</code> 参数，该参数决定每个节点内联存储多少PQ数据：</p>
<ul>
<li><p><strong>inline_pq 值较低：</strong>索引大小较小，但可能需要额外的 I/O 操作</p></li>
<li><p><strong>inline_pq 值较高：</strong>索引大小较大，但可保持单次读取访问</p></li>
</ul>
<p>当配置为 `<strong>inline_pq = max_degree</strong>` 时，AISAQ 通过一次磁盘操作读取节点的完整向量、邻居列表以及所有 PQ 代码，既保持了与 DISKANN 相同的 I/O 模式，又将所有数据保存在 SSD 上。</p>
<p><strong>3. 顺序 PQ 访问提升计算效率</strong></p>
<p>在 DISKANN 中，展开一个候选节点需要进行 R 次随机内存访问，以获取其 R 个邻居的 PQ 码。AISAQ 通过单次 I/O 检索所有 PQ 码并将其顺序存储在磁盘上，从而消除了这种随机性。</p>
<p>顺序布局具有两大重要优势：</p>
<ul>
<li><p><strong>SSD 的顺序读取速度远快于</strong>分散的随机读取。</p></li>
<li><p><strong>连续数据更有利于缓存</strong>，使 CPU 能更高效地计算 PQ 距离。</p></li>
</ul>
<p>这既提高了PQ距离计算的速度和可预测性，也有助于抵消将PQ码存储在SSD而非DRAM所带来的性能开销。</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ 与 DISKANN：性能评估<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>在了解了 AISAQ 与 DISKANN 在架构上的差异后，接下来的问题很直观：<strong>这些设计选择在实际应用中如何影响性能和资源使用？</strong>本次评估从十亿级规模下最关键的三个维度对 AISAQ 和 DISKANN 进行了比较：<strong>搜索性能、内存消耗和磁盘使用情况。</strong></p>
<p>特别是，我们考察了随着内联 PQ 数据量（<code translate="no">INLINE_PQ</code> ）的变化，AISAQ 的表现如何。该参数直接控制着索引大小、磁盘 I/O 与运行时效率之间的权衡。 此外，我们还在<strong>低维和高维向量工作负载</strong>上对这两种方法进行了评估<strong>，因为维度会显著影响距离计算的成本和</strong>存储需求。</p>
<h3 id="Setup" class="common-anchor-header">实验环境</h3><p>所有实验均在单节点系统上进行，以隔离索引行为，并避免网络或分布式系统效应的干扰。</p>
<p><strong>硬件配置：</strong></p>
<ul>
<li><p>CPU：AMD EPYC 9454P CPU @ 2.70GHz</p></li>
<li><p>内存：速度：3200 MT/s，类型：DDR4，容量：384 GB</p></li>
<li><p>硬盘：KIOXIA CM7 7.68 TB<sup>NVMe™</sup>SSD</p></li>
</ul>
<p><h6><em>AMD EPYC 是 Advanced Micro Devices, Inc. 的商标。</em></h6>
<h6><em>NVMe 是 NVM Express, Inc. 在美国及其他国家/地区的注册或未注册商标。</em></h6></p>
<p><strong>索引构建参数</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>查询参数</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">基准测试方法</h3><p>DISKANN 和 AISAQ 均使用 Milvus 中采用的开源向量搜索引擎<a href="https://milvus.io/docs/knowhere.md">Knowhere</a> 进行了测试。本次评估使用了两个数据集：</p>
<ul>
<li><p><strong>SIFT128D（100 万个向量）：</strong>一个广为人知的 128 维基准数据集，常用于图像描述子搜索。<em>（原始数据集大小 ≈ 488 MB）</em></p></li>
<li><p><strong>Cohere768D（100 万个向量）：</strong>一种典型的 768 维 Embeddings 集，常用于基于 Transformer 的语义搜索。<em>（原始数据集大小 ≈ 2930 MB）</em></p></li>
</ul>
<p>这些数据集反映了两种截然不同的实际应用场景：紧凑的视觉特征与大型语义Embeddings。</p>
<h3 id="Results" class="common-anchor-header">结果</h3><p><strong>Sift128D1M（完整向量 ~488MB）</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>SIFT 召回率与延迟对比图</span>
  
 </span></p>
<p><strong>Cohere768D1M（完整向量约2930 MB）</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Cohere召回率与延迟对比图</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">分析</h3><p><strong>SIFT128D数据集</strong></p>
<p>在 SIFT128D 数据集上，当所有 PQ 数据均采用内联存储（INLINE_PQ = 48），使得每个节点所需数据完全容纳于单个 4 KB SSD 页中时，AISAQ 的性能可与 DISKANN 持平。在此配置下，搜索过程中所需的每一项信息均位于同一位置：</p>
<ul>
<li><p>完整向量：512B</p></li>
<li><p>邻居列表：48 × 4 + 4 = 196B</p></li>
<li><p>邻居的 PQ 编码：48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>总计：3780B</p></li>
</ul>
<p>由于整个节点可容纳于一个页面内，每次访问仅需一次 I/O 操作，且 AISAQ 避免了对外部 PQ 数据的随机读取。</p>
<p>但是，当只有部分 PQ 数据被内联时，剩余的 PQ 代码必须从磁盘的其他位置读取（inline_pq 参数被设置为优化 SSD 页利用率，例如，inline_pq = 20 允许将两个节点放入一个 4KB 页中）。 这会引入额外的随机 I/O 操作，从而急剧增加 IOPS 需求，并导致性能下降。</p>
<p><strong>Cohere768D 数据集</strong></p>
<p>在 Cohere768D 数据集上，AISAQ 的性能比 DISKANN 低约 8%。原因是 768 维向量根本无法放入一个 4 KB 的 SSD 页中：</p>
<ul>
<li><p>完整向量：3072B</p></li>
<li><p>邻居列表：48 × 4 + 4 = 196B</p></li>
<li><p>邻居的 PQ 码：48 × (3072B × 0.04167) ≈ 6,144B</p></li>
<li><p>总计：9,412B（≈ 3个页）</p></li>
</ul>
<p>在这种情况下，即使所有 PQ 码都进行了内联存储，每个节点仍会跨越多个页。虽然 I/O 操作的次数保持不变，但每次 I/O 必须传输的数据量要大得多，这会更快地消耗 SSD 带宽。 一旦带宽成为限制因素，AISAQ就无法与DISKANN匹敌——特别是在高维工作负载中，此时每个节点的数据占用量会迅速增长。</p>
<p><strong>注：</strong></p>
<p>AISAQ 的存储布局通常会使磁盘上的索引大小增加<strong>3 到 5 倍</strong>。这是经过深思熟虑的权衡：完整向量、邻居列表和 PQ 码在磁盘上共置，以便在搜索过程中实现高效的单页访问。 虽然这会增加 SSD 的使用量，但磁盘容量的成本远低于 DRAM，且在处理海量数据时更易于扩展。</p>
<p>实际上，用户可以通过调整<code translate="no">INLINE_PQ</code> 和PQ压缩比来优化这种权衡。这些参数使得系统能够根据工作负载需求，在搜索性能、磁盘占用空间和整体系统成本之间取得平衡，而非受限于固定的内存限制。</p>
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
    </button></h2><p>现代硬件的经济性正在发生变化。DRAM 价格依然居高不下，而 SSD 性能却突飞猛进——PCIe 5.0 硬盘如今已能提供超过<strong>14 GB/s</strong> 的带宽。因此，将搜索关键数据从昂贵的 DRAM 转移到价格低廉得多的 SSD 存储的架构，正变得越来越具有吸引力。 由于 SSD<strong>的每千兆字节</strong>成本<strong>不到</strong>DRAM<strong>的 30 倍，</strong>这些差异已不再微不足道——它们对系统设计产生了实质性影响。</p>
<p>AISAQ 正体现了这一转变。 通过消除对大型、始终在线内存分配的需求，它使向量搜索系统能够根据数据规模和工作负载要求进行扩展，而非受限于DRAM的容量。这种方法符合“全存储”架构的更广泛趋势，在这种架构中，高速SSD不仅在数据持久化方面发挥核心作用，还在主动计算和搜索中扮演关键角色。 通过提供“性能”和“扩展”两种运行模式，AiSAQ 既满足语义搜索（要求最低延迟）的需求，也满足 RAG（要求极高扩展性，但延迟适中）的需求。</p>
<p>这一转变不太可能仅限于向量数据库。随着开发人员重新审视关于“数据必须存储在何处才能实现可接受性能”这一长期存在的假设，类似的设计模式已在图处理、时间序列分析，甚至传统关系型系统的某些部分中逐渐显现。随着硬件经济性的持续演进，系统架构也将随之发展。</p>
<p>有关此处讨论的设计的更多详细信息，请参阅文档：</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus 文档</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus 文档</a></p></li>
</ul>
<p>如有疑问或希望深入了解最新 Milvus 的任何功能，欢迎加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以预约 20 分钟的一对一咨询，通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 办公时间获取</a>见解、指导并解答您的疑问。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">深入了解 Milvus 2.6 的功能<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 发布：经济实惠的百亿级向量搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">嵌入函数简介：Milvus 2.6 如何简化向量化与语义搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus 中的 JSON 拆分：兼具灵活性与 88.9 倍提速的 JSON 过滤</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解锁真正的实体级检索：Milvus 中的新“数组中的结构体”和 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：处理 LLM 训练数据中重复项的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩推向极致：Milvus 如何借助 RaBitQ 处理 3 倍的查询量</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准测试不可信——向量数据库值得接受真实测试 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们用 Woodpecker 取代了 Milvus 中的 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">现实世界中的向量搜索：如何在不牺牲召回率的前提下高效过滤结果</a></p></li>
</ul>
