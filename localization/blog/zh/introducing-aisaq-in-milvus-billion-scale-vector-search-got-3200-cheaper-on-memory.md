---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: 'Milvus 中的 AISAQ 简介：十亿级向量搜索的内存成本降低了 3,200 倍'
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
desc: 了解 Milvus 如何利用 AISAQ 将内存成本降低 3200 倍，从而实现可扩展的十亿向量搜索，而无需 DRAM 开销。
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>向量数据库已成为关键任务人工智能系统的核心基础架构，其数据量呈指数级增长--往往达到数十亿向量。在这种规模下，一切都变得更加困难：保持低延迟、保持准确性、确保可靠性以及跨副本和跨区域操作。但有一个挑战往往很早就会出现，并主导着架构决策--成本<strong>。</strong></p>
<p>为了提供快速搜索，大多数向量数据库将关键索引结构保存在 DRAM（动态随机存取内存）中，这是速度最快、成本最高的内存层。这种设计对提高性能很有效，但扩展性很差。DRAM 的使用量随数据大小而非查询流量的变化而变化，即使进行了压缩或部分 SSD 卸载，索引的大部分仍必须保留在内存中。随着数据集的增长，内存成本很快就会成为限制因素。</p>
<p>Milvus 已经支持<strong>DISKANN</strong>，这是一种基于磁盘的 ANN 方法，通过将大部分索引转移到固态硬盘来减少内存压力。不过，DISKANN 在搜索过程中使用的压缩表示法仍依赖于 DRAM。<a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a>在此基础上更进一步，采用了<a href="https://milvus.io/docs/aisaq.md">AISAQ</a>，这是一种受<a href="https://milvus.io/docs/diskann.md">DISKANN</a>启发的基于磁盘的向量索引，将所有搜索关键数据存储在磁盘上。在十亿向量的工作负载中，内存使用量从<strong>32 GB</strong> <strong>减少</strong> <strong>到约 10 MB</strong> <strong>，减少了 3200 倍，同时</strong>保持了实用性能。</p>
<p>在接下来的章节中，我们将介绍基于图的向量搜索的工作原理、内存成本的来源以及 AISAQ 如何重塑十亿级向量搜索的成本曲线。</p>
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
    </button></h2><p><strong>向量搜索</strong>是在高维空间中查找数值表示最接近查询的数据点的过程。所谓 "最接近"，简单地说就是根据距离函数（如余弦距离或 L2 距离）得出的最小距离。在小范围内，这很简单：计算查询和每个向量之间的距离，然后返回最近的向量。然而，在大规模（例如十亿规模）的情况下，这种方法很快就会变得太慢而不实用。</p>
<p>为了避免穷举比较，现代近似近邻搜索（ANNS）系统依赖于<strong>基于图的索引</strong>。索引不是将查询与每个向量进行比较，而是将向量组织成一个<strong>图</strong>。每个节点代表一个向量，边连接数值上接近的向量。这种结构能让系统极大地缩小搜索空间。</p>
<p>该图是事先建立的，完全基于向量之间的关系。它不依赖于查询。当查询到达时，系统的任务就是<strong>高效地浏览图谱</strong>，找出与查询距离最小的向量，而无需扫描整个数据集。</p>
<p>搜索从图中预定义的<strong>入口点</strong>开始。这个起点可能与查询点相距甚远，但算法会通过移动到与查询点更接近的向量来逐步改善其位置。在这个过程中，搜索会维护两个协同工作的内部数据结构：<strong>候选列表</strong>和<strong>结果列表</strong>。</p>
<p>在这个过程中，最重要的两个步骤是扩展候选列表和更新结果列表。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">扩展候选列表</h3><p><strong>候选列表</strong>代表搜索的下一个方向。它是一组根据与查询的距离排序的图节点。</p>
<p>每次迭代时，算法都会</p>
<ul>
<li><p><strong>选择迄今为止发现的最接近的候选节点。</strong>从候选列表中选择与查询距离最小的向量。</p></li>
<li><p><strong>从图中检索该向量的邻居。</strong>这些相邻向量是在索引构建过程中被识别为与当前向量接近的向量。</p></li>
<li><p><strong>评估未访问过的邻居，并将其添加到候选列表中。</strong>对于每个尚未探索过的邻居，算法都会计算其与查询的距离。之前访问过的邻居会被跳过，而新邻居如果看起来有希望，就会被添加到候选列表中。</p></li>
</ul>
<p>通过反复扩展候选列表，搜索会探索图中越来越多的相关区域。这样，算法就能在只检查一小部分向量的情况下，稳步获得更好的答案。</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">更新结果列表</h3><p>与此同时，算法会维护一个<strong>结果列表</strong>，其中记录了迄今为止发现的最佳候选<strong>结果</strong>，以便最终输出。在搜索过程中，算法会</p>
<ul>
<li><p><strong>跟踪遍历过程中遇到的最近向量。</strong>这些向量包括被选中进行扩展的向量，以及沿途评估过的其他向量。</p></li>
<li><p><strong>存储它们与查询的距离。</strong>这样就可以对候选向量进行排序，并保留当前的前 K 个近邻向量。</p></li>
</ul>
<p>随着时间的推移，评估的候选向量越来越多，发现的改进却越来越少，结果列表就会趋于稳定。一旦进一步的图探索不太可能产生更接近的向量，搜索就会终止，并返回结果列表作为最终答案。</p>
<p>简单来说，<strong>候选列表控制着探索</strong>，而<strong>结果列表</strong>则<strong>记录着迄今为止发现的最佳答案</strong>。</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">基于图的向量搜索中的权衡取舍<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>这种基于图的方法首先使大规模向量搜索变得实用。通过浏览图而不是扫描每个向量，系统只需接触数据集的一小部分，就能找到高质量的结果。</p>
<p>然而，这种效率并不是免费的。基于图的搜索揭示了<strong>准确性与成本</strong>之间的基本权衡<strong>。</strong></p>
<ul>
<li><p>探索更多的邻居可以覆盖图的更大部分，降低遗漏真正近邻的几率，从而提高准确率。</p></li>
<li><p>与此同时，每一次额外的扩展都会增加工作量：更多的距离计算、更多的图结构访问以及更多的向量数据读取。随着搜索的深入或扩大，这些成本就会累积起来。根据索引的设计方式，它们会表现为更高的 CPU 使用率、更大的内存压力或额外的磁盘 I/O。</p></li>
</ul>
<p>在高召回率与高效资源利用之间取得平衡，是基于图的搜索设计的核心。</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a>和<strong>AISAQ</strong>都是围绕这一矛盾而构建的，但它们在支付这些成本的方式和地点上做出了不同的架构选择。</p>
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
<p>DISKANN 是迄今为止最有影响力的基于磁盘的 ANN 解决方案，也是 NeurIPS Big ANN 竞赛的官方基准，该竞赛是十亿规模向量搜索的全球基准。它的意义不仅在于性能，还在于它证明了：<strong>基于图的 ANN 搜索不一定要完全在内存中才能实现快速搜索</strong>。</p>
<p>通过将基于固态硬盘的存储与精心选择的内存结构相结合，DISKANN 证明了大规模向量搜索可以在商品硬件上实现高精度和低延迟，而无需占用大量 DRAM 空间。为此，它重新考虑了<em>搜索的哪些部分必须快速</em>，<em>哪些部分可以容忍较慢的访问速度</em>。</p>
<p><strong>在高层次上，DISKANN 将访问频率最高的数据保留在内存中，而将访问频率较低的大型结构转移到磁盘上。</strong>这种平衡是通过几个关键的设计选择实现的。</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1.使用 PQ 距离扩展候选列表</h3><p>扩展候选列表是基于图的搜索中最频繁的操作符。每次扩展都需要估算查询向量与候选节点的邻居之间的距离。如果使用完整的高维向量来执行这些计算，就需要频繁地从磁盘随机读取数据，这在计算和 I/O 方面都是一项昂贵的操作符。</p>
<p>DISKANN 将向量压缩为<strong>乘积量化（PQ）代码</strong>并保存在内存中，从而避免了这一成本。PQ 代码比全向量小得多，但仍能保留足够的信息来近似估计距离。</p>
<p>在候选扩展过程中，DISKANN 会使用这些内存中的 PQ 代码计算距离，而不是从 SSD 中读取完整向量。这大大减少了图遍历过程中的磁盘 I/O，使搜索能快速高效地扩展候选对象，同时将大部分 SSD 流量保持在关键路径之外。</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2.在磁盘上共定位全向量和邻居列表</h3><p>并非所有数据都能压缩或近似访问。一旦确定了有希望的候选数据，搜索仍需要访问两类数据才能获得准确结果：</p>
<ul>
<li><p><strong>邻居列表</strong>，用于继续图遍历</p></li>
<li><p><strong>完整（未压缩）向量</strong>，用于最终<strong>Rerankers</strong></p></li>
</ul>
<p>与 PQ 代码相比，这些结构的访问频率较低，因此 DISKANN 将其存储在 SSD 上。为了尽量减少磁盘开销，DISKANN 将每个节点的邻居列表及其完整向量放在磁盘的同一物理区域。这确保了单次 SSD 读取就能检索到这两个数据。</p>
<p>通过共同定位相关数据，DISKANN 减少了搜索过程中所需的随机磁盘访问次数。这一优化提高了扩展和 Rerankers 的效率，尤其是在大规模扩展时。</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3.并行节点扩展，提高固态硬盘利用率</h3><p>基于图的 ANN 搜索是一个迭代过程。如果每次迭代只扩展一个候选节点，系统每次只进行一次磁盘读取，固态硬盘的大部分并行带宽就会闲置。为了避免这种低效率，DISKANN 在每次迭代中扩展多个候选节点，并向固态硬盘发送并行读取请求。这种方法能更好地利用可用带宽，并减少所需的迭代总数。</p>
<p><strong>波束宽度比（beam_width_ratio</strong>）参数可控制并行扩展候选数据的数量：<strong>波束宽度 = CPU 内核数 × 波束宽度比例。</strong>比例越大，搜索范围越宽，可能会提高准确性，但同时也会增加计算量和磁盘 I/O。</p>
<p>为了抵消这一影响，DISKANN 引入了一个<code translate="no">search_cache_budget_gb_ratio</code> ，用于保留内存以缓存频繁访问的数据，从而减少 SSD 的重复读取。这些机制共同帮助 DISKANN 在准确性、延迟和 I/O 效率之间取得平衡。</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">为什么这很重要--以及限制出现在哪里</h3><p>DISKANN 的设计是基于磁盘的向量搜索向前迈出的重要一步。通过将 PQ 代码保留在内存中，并将较大的结构推送到固态硬盘，与完全在内存中的图索引相比，它大大减少了内存占用。</p>
<p>同时，这种架构仍然依赖于<strong>始终在线的 DRAM</strong>来处理搜索关键数据。PQ 代码、缓存和控制结构必须保留在内存中，以保持高效遍历。当数据集增长到数十亿向量，部署增加了副本或区域时，内存需求仍会成为限制因素。</p>
<p><strong>AISAQ</strong>就是要解决这一问题。</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">AISAQ 的工作原理和重要性<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ 直接基于 DISKANN 背后的核心理念，但引入了一个关键的转变：它不再<strong>需要在 DRAM 中保留 PQ 数据</strong>。AISAQ 不再将压缩向量视为搜索关键、始终在内存中的结构，而是将其移至 SSD，并重新设计图数据在磁盘上的布局，以保持高效的遍历。</p>
<p>为了实现这一目标，AISAQ 对节点存储进行了重组，以便将图搜索过程中所需的数据（全向量、邻居列表和 PQ 信息）在磁盘上以优化访问定位的模式进行排列。这样做的目的不仅是将更多数据推送到更经济的磁盘上，而且<strong>不会破坏前面所述的搜索过程</strong>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>为了平衡不同工作负载下的性能和存储效率，AISAQ 提供了两种基于磁盘的存储模式。这两种模式的主要区别在于搜索过程中如何存储和访问 PQ 压缩数据。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ 性能：优化速度</h3><p>AISAQ-performance 将所有数据保存在磁盘上，同时通过数据主机托管保持较低的 I/O 开销。</p>
<p>在这种模式下</p>
<ul>
<li><p>每个节点的完整向量、边缘列表及其邻居的 PQ 代码都一起存储在磁盘上。</p></li>
<li><p>访问一个节点仍然只需要<strong>读取一次固态硬盘</strong>，因为候选扩展和评估所需的所有数据都被集中在一起。</p></li>
</ul>
<p>从搜索算法的角度来看，这与 DISKANN 的访问模式如出一辙。尽管所有搜索关键数据现在都在磁盘上，但候选扩展依然高效，运行时性能也不相上下。</p>
<p>需要权衡的是存储开销。因为一个邻居的 PQ 数据可能出现在多个节点的磁盘页面中，这种布局会带来冗余，并显著增加整体索引的大小。</p>
<p><strong>因此，AISAQ-性能模式优先考虑低 I/O 延迟，而不是磁盘效率。</strong></p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ 级：优化存储效率</h3><p>AISAQ-Scale 采用了相反的方法。它旨在<strong>尽量减少磁盘使用量</strong>，同时仍将所有数据保留在 SSD 上。</p>
<p>在这种模式下</p>
<ul>
<li><p>PQ 数据单独存储在磁盘上，没有冗余。</p></li>
<li><p>这样就消除了冗余，并显著减少了索引大小。</p></li>
</ul>
<p>权衡的结果是，访问一个节点及其邻居的 PQ 代码可能需要<strong>多次读取 SSD</strong>，从而增加了候选扩展期间的 I/O 操作符。如果不进行优化，这将大大降低搜索速度。</p>
<p>为了控制这一开销，AISAQ-Scale 模式引入了两项额外的优化：</p>
<ul>
<li><p><strong>PQ 数据重新排列</strong>，根据访问优先级对 PQ 向量进行排序，以提高定位性并减少随机读取。</p></li>
<li><p><strong>DRAM 中的 PQ 缓存</strong>（<code translate="no">pq_cache_size</code> ），用于存储频繁访问的 PQ 数据，避免重复读取磁盘<strong>中</strong>的热条目。</p></li>
</ul>
<p>通过这些优化，AISAQ-Scale 模式的存储效率大大高于 AISAQ-Performance，同时还能保持实用的搜索性能。该性能仍然低于 DISKANN 或 AISAQ-Performance，但内存占用却大大减少。</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">AISAQ 的主要优势</h3><p>通过将所有搜索关键数据转移到磁盘并重新设计数据访问方式，AISAQ 从根本上改变了基于图的向量搜索的成本和可扩展性。它的设计具有三个显著优势。</p>
<p><strong>1.DRAM 使用量最多可降低 3,200 倍</strong></p>
<p>乘积量化能显著减小高维向量的大小，但在十亿分规模下，内存占用仍然很大。在传统设计中，即使经过压缩，PQ 代码在搜索过程中也必须保留在内存中。</p>
<p>例如，在具有 10 亿 128 维向量的基准<strong>SIFT1B</strong> 上，仅 PQ 代码就需要大约<strong>30-120 GB 的 DRAM</strong>（取决于配置）。存储未压缩的完整向量则需要额外的<strong>~480 GB</strong>。虽然 PQ 将内存使用量降低了 4-16倍，但剩余的占用空间仍然很大，足以影响基础设施成本。</p>
<p>AISAQ 完全消除了这一要求。通过将 PQ 代码存储在固态硬盘而不是 DRAM 上，内存不再被持久索引数据消耗。DRAM 仅用于候选列表和控制元数据等轻量级瞬时结构。在实践中，这将内存使用量从数十 GB 减少到<strong>约 10 MB</strong>。在具有代表性的十亿规模配置中，DRAM 从<strong>32 GB 降至 10 MB</strong>，<strong>减少了 3200 倍</strong>。</p>
<p>与 DRAM 相比，固态硬盘存储的<strong>单位容量</strong>成本大约是 DRAM<strong>的 1/30</strong>，因此这种转变对系统总成本产生了直接而巨大的影响。</p>
<p><strong>2.无额外 I/O 开销</strong></p>
<p>将 PQ 代码从内存移至磁盘通常会增加搜索过程中的 I/O 操作符数量。AISAQ 通过仔细<strong>控制数据布局和访问模式</strong>避免了这种情况。AISAQ 不会将相关数据分散到磁盘上，而是将 PQ 代码、全向量和邻居列表放在同一位置，以便一起检索。这确保了候选扩展不会带来额外的随机读取。</p>
<p>为了让用户控制索引大小和 I/O 效率之间的权衡，AISAQ 引入了<code translate="no">inline_pq</code> 参数，该参数决定每个节点内联存储多少 PQ 数据：</p>
<ul>
<li><p><strong>较低的 inline_pq：</strong>较小的索引大小，但可能需要额外的 I/O</p></li>
<li><p><strong>较高的 inline_pq：</strong>索引大小较大，但保留了单读访问功能</p></li>
</ul>
<p>当配置为<strong>inline_pq = max_degree</strong> 时，AISAQ 会在一次磁盘操作中读取节点的完整向量、邻居列表和所有 PQ 代码，与 DISKANN 的 I/O 模式相匹配，同时将所有数据保留在 SSD 上。</p>
<p><strong>3.顺序 PQ 访问提高计算效率</strong></p>
<p>在 DISKANN 中，扩展一个候选节点需要 R 次随机内存访问，以获取其 R 个邻居的 PQ 代码。AISAQ 通过单次 I/O 获取所有 PQ 代码并按顺序存储在磁盘上，从而消除了这种随机性。</p>
<p>顺序布局有两个重要优势：</p>
<ul>
<li><p><strong>顺序 SSD 读取</strong>比分散随机读取<strong>快得多</strong>。</p></li>
<li><p><strong>连续数据对缓存更友好</strong>，使 CPU 能够更高效地计算 PQ 距离。</p></li>
</ul>
<p>这提高了 PQ 距离计算的速度和可预测性，有助于抵消在固态硬盘而非 DRAM 上存储 PQ 代码的性能成本。</p>
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
    </button></h2><p>在了解了 AISAQ 与 DISKANN 在架构上的不同之处后，下一个问题就直截了当了：<strong>这些设计选择在实践中对性能和资源使用有何影响？</strong>本评估从<strong>搜索性能、内存消耗和磁盘使用</strong>这三个在十亿规模上最重要的方面对 AISAQ 和 DISKANN 进行了比较。</p>
<p>我们特别考察了 AISAQ 在内联 PQ 数据量 (<code translate="no">INLINE_PQ</code>) 发生变化时的表现。该参数直接控制着索引大小、磁盘 I/O 和运行效率之间的权衡。我们还在<strong>低维和高维向量工作负载</strong>上对这两种方法进行了评估<strong>，因为维数对距离计算成本和</strong>存储要求<strong>有很大影响</strong>。</p>
<h3 id="Setup" class="common-anchor-header">实验设置</h3><p>所有实验都在单节点系统上进行，以隔离索引行为，避免网络或分布式系统效应的干扰。</p>
<p><strong>硬件配置</strong></p>
<ul>
<li><p>CPU：英特尔® 至强® Platinum 8375C CPU @ 2.90GHz</p></li>
<li><p>内存速度：3200 MT/s，类型：DDR4DDR4，大小：32 GB</p></li>
<li><p>磁盘：500 GB NVMe SSD</p></li>
</ul>
<p><strong>索引构建参数</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>查询参数</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">基准测试方法</h3><p>DISKANN 和 AISAQ 均使用 Milvus 使用的开源向量搜索引擎<a href="https://milvus.io/docs/knowhere.md">Knowhere</a> 进行测试。本次评估使用了两个数据集：</p>
<ul>
<li><p><strong>SIFT128D（1M 向量）：</strong>著名的 128 维基准，常用于图像描述符搜索。<em>(原始数据集大小 ≈ 488 MB）</em></p></li>
<li><p><strong>Cohere768D（1M 向量）：</strong>基于变换器语义搜索的典型 768 维嵌入集。<em>(原始数据集大小 ≈ 2930 MB）</em></p></li>
</ul>
<p>这些数据集反映了两种截然不同的真实世界场景：紧凑的视觉特征和大型语义嵌入。</p>
<h3 id="Results" class="common-anchor-header">搜索结果</h3><p><strong>Sift128D1M （全向量 ~488MB）</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sift128_D1_M_706a5b4e23.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M（全向量 ~2930MB）</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">分析结果</h3><p><strong>SIFT128D 数据集</strong></p>
<p>在 SIFT128D 数据集上，当所有 PQ 数据被内联，使每个节点所需的数据完全容纳在一个 4 KB SSD 页面（INLINE_PQ = 48）中时，AISAQ 的性能可与 DISKANN 相媲美。在这种配置下，搜索过程中所需的每一条信息都被集中在一起：</p>
<ul>
<li><p>全向量512B</p></li>
<li><p>邻居列表48 × 4 + 4 = 196B</p></li>
<li><p>邻居的 PQ 代码：48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>总计：3780B</p></li>
</ul>
<p>由于整个节点位于一页内，每次访问只需一次 I/O，AISAQ 可以避免随机读取外部 PQ 数据。</p>
<p>然而，当只有部分 PQ 数据被内联时，其余的 PQ 代码必须从磁盘的其他地方获取。这就引入了额外的随机 I/O 操作，急剧增加了 IOPS 需求，导致性能大幅下降。</p>
<p><strong>Cohere768D 数据集</strong></p>
<p>在 Cohere768D 数据集上，AISAQ 的性能比 DISKANN 差。原因是一个 4 KB SSD 页面无法容纳 768 维向量：</p>
<ul>
<li><p>全向量3072B</p></li>
<li><p>邻居列表48 × 4 + 4 = 196B</p></li>
<li><p>邻居的 PQ 代码：48 × (3072B × 0.125) ≈ 18432B</p></li>
<li><p>总计：21,700 B（≈ 6 页）</p></li>
</ul>
<p>在这种情况下，即使所有 PQ 代码都被内联，每个节点也会跨越多个页面。虽然 I/O 操作符的数量保持一致，但每次 I/O 必须传输的数据要多得多，消耗 SSD 带宽的速度也快得多。一旦带宽成为限制因素，AISAQ 就无法跟上 DISKANN 的步伐，尤其是在高维工作负载中，每个节点的数据足迹增长很快。</p>
<p><strong>注意：</strong></p>
<p>AISAQ 的存储布局通常会将磁盘上的索引大小增加<strong>4 到 6 倍</strong>。这是一种有意的权衡：全向量、邻接表和 PQ 代码都集中在磁盘上，以便在搜索过程中实现高效的单页访问。虽然这增加了固态硬盘的使用量，但磁盘容量比 DRAM 便宜得多，而且在数据量大时更容易扩展。</p>
<p>在实践中，用户可以通过调整<code translate="no">INLINE_PQ</code> 和 PQ 压缩率来调整这种权衡。这些参数可以根据工作负载要求平衡搜索性能、磁盘占用空间和系统总体成本，而不是受制于固定的内存限制。</p>
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
    </button></h2><p>现代硬件的经济性正在发生变化。DRAM 价格居高不下，而固态硬盘的性能却突飞猛进--PCIe 5.0 硬盘的带宽现已超过<strong>14 GB/s</strong>。因此，将搜索关键数据从昂贵的 DRAM 转移到价格低廉得多的 SSD 存储的架构正变得越来越有吸引力。由于固态硬盘<strong>每千兆字节的</strong>容量成本<strong>不到</strong>DRAM 的<strong>30 倍</strong>，这些差异不再是微不足道的，而是会对系统设计产生重大影响。</p>
<p>AISAQ 反映了这一转变。通过消除对大型、始终在线内存分配的需求，它使向量搜索系统能够根据数据大小和工作负载要求而不是 DRAM 限制进行扩展。这种方法符合<strong>"全存储 "架构的</strong>大趋势，在这种架构中，快速固态硬盘不仅在持久性方面，而且在主动计算和搜索方面都发挥着核心作用。</p>
<p>这种转变不可能仅限于向量数据库。类似的设计模式已经出现在图形处理、时间序列分析，甚至部分传统关系系统中，因为开发人员重新思考了长期以来关于数据必须位于何处才能实现可接受性能的假设。随着硬件经济的不断发展，系统架构也将随之改变。</p>
<p>有关此处讨论的设计的更多详情，请参阅文档：</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus 文档</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus 文档</a></p></li>
</ul>
<p>有问题或想深入了解最新 Milvus 的任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
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
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介绍 Embeddings 功能：Milvus 2.6 如何简化矢量化和语义搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus中的JSON粉碎功能：快88.9倍的灵活JSON过滤功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解锁真正的实体级检索：Milvus 中新的结构数组和 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus如何利用RaBitQ将查询次数提高3倍</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准会说谎--向量数据库需要真正的测试 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们为 Milvus 用啄木鸟取代了 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">真实世界中的向量搜索：如何高效过滤而不牺牲召回率</a></p></li>
</ul>
