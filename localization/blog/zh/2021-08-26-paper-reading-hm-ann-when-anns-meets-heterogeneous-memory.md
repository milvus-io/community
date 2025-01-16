---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: 论文阅读｜HM-ANN 当 ANNS 遇到异构存储器
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: HM-ANN 异构存储器上的高效十亿点近邻搜索
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>论文阅读 ｜ HM-ANN：当ANNS遇到异质内存</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: Efficient Billion-Point Nearest Neighbor Search on Heterogenous Memory</a>》是一篇被2020年神经信息处理系统会议<a href="https://nips.cc/Conferences/2020">（NeurIPS 2020</a>）录用的研究论文。本文提出了一种基于图的相似性搜索新算法，称为 HM-ANN。该算法同时考虑了现代硬件环境下的内存异构性和数据异构性。HM-ANN 无需压缩技术就能在单台机器上实现十亿规模的相似性搜索。异构内存（HM）是速度快但容量小的动态随机存取内存（DRAM）和速度慢但容量大的持久内存（PMem）的结合。HM-ANN 实现了较低的搜索延迟和较高的搜索精度，尤其是当数据集无法放入 DRAM 时。与最先进的近似近邻（ANN）搜索解决方案相比，该算法具有明显优势。</p>
<custom-h1>研究动机</custom-h1><p>由于 DRAM 容量有限，ANN 搜索算法从一开始就在查询准确性和查询延迟之间进行了根本性的权衡。要在 DRAM 中存储索引以实现快速查询访问，就必须限制数据点的数量或存储压缩向量，而这两者都会损害搜索精度。基于图形的索引（如分层导航小世界，HNSW）在查询运行时性能和查询准确性方面更胜一筹。不过，在十亿规模的数据集上操作时，这些索引也会消耗 1-TiB 级别的 DRAM。</p>
<p>还有其他变通方法可以避免让 DRAM 以原始格式存储十亿规模的数据集。当数据集过大，单机内存无法容纳时，就会使用压缩方法，例如对数据集的点进行乘积量化。但由于量化过程中会损失精确度，使用压缩数据集的这些索引的召回率通常很低。Subramanya 等人[1]探索利用固态硬盘（SSD），通过一种名为 "Disk-ANN "的方法，在一台机器上实现十亿规模的 ANN 搜索，其中原始数据集存储在 SSD 上，压缩表示存储在 DRAM 上。</p>
<custom-h1>异构内存简介</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>异构存储器（HM）是速度快但容量小的 DRAM 和速度慢但容量大的 PMem 的组合。DRAM 是每个现代服务器中都有的普通硬件，其访问速度相对较快。新的 PMem 技术（如英特尔® Optane™ DC 持久内存模块）弥补了基于 NAND 闪存（固态硬盘）和 DRAM 之间的差距，消除了 I/O 瓶颈。PMem 像固态硬盘一样耐用，像内存一样可由 CPU 直接寻址。Renen 等人[2]发现，在配置的实验环境中，PMem 的读取带宽比 DRAM 低 2.6 倍，写入带宽低 7.5 倍。</p>
<custom-h1>HM-ANN 设计</custom-h1><p>HM-ANN 是一种精确、快速的十亿尺度 ANN 搜索算法，无需压缩即可在单机上运行。HM-ANN 的设计概括了 HNSW 的理念，其分层结构与 HM 自然契合。HNSW 由多层组成--只有第 0 层包含整个数据集，其余每一层都包含其下一层的元素子集。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>上层的元素只包含数据集的子集，只占用整个存储空间的一小部分。这一观察结果使它们成为放置在 DRAM 中的合适候选对象。这样，HM-ANN 上的大部分搜索都将发生在上层，从而最大限度地利用 DRAM 的快速访问特性。然而，在 HNSW 的情况下，大部分搜索发生在底层。</li>
<li>最底层承载着整个数据集，因此适合放在 PMem 中。 由于访问第 0 层的速度较慢，因此最好每次查询只访问一小部分，并降低访问频率。</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">图构建算法<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>HM-ANN 构建的关键思路是创建高质量的上层，以便为第 0 层的搜索提供更好的导航。 因此，大部分内存访问发生在 DRAM 中，而 PMem 中的访问则会减少。为了实现这一点，HM-ANN 的构建算法分为自上而下的插入阶段和自下而上的提升阶段。</p>
<p>自上而下的插入阶段在最底层放置到 PMem 上时，构建一个可导航的小世界图。</p>
<p>自下而上的提升阶段则在不损失太多精度的情况下，从底层提升枢轴点，形成放置在 DRAM 上的上层。如果在第 1 层创建了第 0 层元素的高质量投影，那么第 0 层的搜索只需几跳就能找到查询的精确近邻。</p>
<ul>
<li>HM-ANN 不使用 HNSW 的随机选择晋升，而是使用高度数晋升策略，将第 0 层中度数最高的元素晋升到第 1 层。对于更高的层，HM-ANN 会根据晋升率将高程度节点晋升到上一层。</li>
<li>HM-ANN 将更多节点从第 0 层提升到第 1 层，并为第 1 层的每个元素设置更大的最大邻居数。上层的节点数由可用的 DRAM 空间决定。由于第 0 层不存储在 DRAM 中，因此增加存储在 DRAM 中的每一层的密度可以提高搜索质量。</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">图搜索算法<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>搜索算法包括两个阶段：快速内存搜索和带预取功能的并行 0 层搜索。</p>
<h3 id="Fast-memory-search" class="common-anchor-header">快速内存搜索</h3><p>与 HNSW 相同，DRAM 中的搜索从最顶层的入口点开始，然后从顶层到第 2 层执行 1-greedy 搜索。为了缩小第 0 层的搜索空间，HM-ANN 在第 1 层执行搜索，搜索预算为<code translate="no">efSearchL1</code> ，这限制了第 1 层候选列表的大小。而 HNSW 只使用一个入口点，因此 HM-ANN 对 0 层和 1 层之间的间隙处理得比其他两层之间的间隙更特殊。</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">带有预取功能的第 0 层并行搜索</h3><p>在底层，HM-ANN 将上述来自第 1 层搜索的候选者平均分配，并将其视为入口点，用线程执行并行多起始 1 贪婪搜索。每次搜索的前几名候选者会被收集起来，以找到最佳候选者。众所周知，从第 1 层向下搜索到第 0 层正好是进入 PMem，并行搜索隐藏了 PMem 的延迟，并充分利用了内存带宽，从而在不增加搜索时间的情况下提高了搜索质量。</p>
<p>HM-ANN 在 DRAM 中实现了一个软件管理的缓冲区，以便在内存访问之前从 PMem 中预取数据。在搜索第 1 层时，HM-ANN 会异步将<code translate="no">efSearchL1</code> 中候选元素的邻近元素和第 1 层中邻近元素的连接从 PMem 复制到缓冲区。在第 0 层搜索时，部分待访问数据已经预置在 DRAM 中，从而隐藏了访问 PMem 的延迟，缩短了查询时间。这符合 HM-ANN 的设计目标，即大部分内存访问发生在 DRAM 中，减少 PMem 中的内存访问。</p>
<custom-h1>评估</custom-h1><p>本文进行了广泛的评估。所有实验均在装有 Intel Xeon Gold 6252 CPU@2.3GHz 的机器上进行。它使用 DDR4（96GB）作为快速内存，Optane DC PMM（1.5TB）作为慢速内存。评估了五个数据集：BIGANN、DEEP1B、SIFT1M、DEEP1M 和 GIST1M。十亿量级测试包括以下方案：基于十亿量级量化的方法（IMI+OPQ 和 L&amp;C）、基于非压缩的方法（HNSW 和 NSG）。</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">十亿尺度算法比较<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>表 1 比较了不同基于图的索引的构建时间和存储量。HNSW 的构建时间最短，HM-ANN 比 HNSW 多花 8%的时间。在整个存储使用方面，HM-ANN 索引比 HSNW 大 5-13%，因为它将更多节点从 0 层提升到了 1 层。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>图 1 分析了不同索引的查询性能。图 1(a)和(b)显示，HM-ANN 在 1 毫秒内实现了 &gt; 95% 的前 1 级召回率。图 1 © 和 (d) 显示，HM-ANN 在 4 毫秒内获得了 &gt; 90% 的前 100 条召回率。与其他所有方法相比，HM-ANN 的延迟与召回率性能最佳。</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">百万级别算法比较<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>图 2 分析了纯 DRAM 设置下不同索引的查询性能。HNSW、NSG 和 HM-ANN 利用 DRAM 中的三个百万级别数据集进行了评估。HM-ANN 的查询性能仍然优于 HNSW。原因在于，要达到 99% 的召回率目标，HM-ANN 的距离计算总数（平均 850 次/查询）低于 HNSW（平均 900 次/查询）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">高阶推广的效果<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>图 3 比较了相同配置下的随机推广和高程度推广策略。百度推广的效果优于基线推广。在达到 95%、99% 和 99.5% 的召回目标时，高程度推广的速度分别是随机推广的 1.8 倍、4.3 倍和 3.9 倍。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">内存管理技术的性能优势<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>图 5 包含 HNSW 和 HM-ANN 之间的一系列步骤，以显示 HM-ANN 的每项优化是如何促进其改进的。BP 代表建立索引时的自下而上推广。PL0 代表并行 0 层搜索，而 DP 代表从 PMem 到 DRAM 的数据预取。HM-ANN 的搜索性能一步步得到提升。</p>
<custom-h1>结论</custom-h1><p>一种名为 HM-ANN 的新型基于图的索引和搜索算法，将基于图的 ANN 的分层设计与 HM 的内存异构性相映射。评估表明，HM-ANN 在十亿点数据集中属于最先进的新索引。</p>
<p>我们注意到学术界和工业界都在关注在持久存储设备上建立索引的趋势。为了减轻 DRAM 的压力，Disk-ANN [1] 是一种建立在 SSD 上的索引，其吞吐量明显低于 PMem。 然而，HM-ANN 的建立仍然需要数天时间，与 Disk-ANN 相比没有巨大差异。我们相信，如果我们能更谨慎地利用 PMem 的特性，例如注意 PMem 的粒度（256 字节）和使用流指令绕过缓存线，就有可能优化 HM-ANN 的构建时间。我们还相信，未来会有更多使用耐用存储设备的方法被提出。</p>
<custom-h1>参考文献</custom-h1><p>[1]:Suhas Jayaram Subramanya and Devvrit and Rohan Kadekodi and Ravishankar Krishaswamy and Ravishankar Krishaswamy：DiskANN：单节点快速精确的十亿点近邻搜索，NIPS，2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN：在单节点上实现快速精确的十亿点近邻搜索 - 微软研究院</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN：单节点上的快速精确十亿点近邻搜索</a></p>
<p>[2]:Alexander van Renen 和 Lukas Vogel 和 Viktor Leis 和 Thomas Neumann 和 Alfons Kemper：Persistent Memory I/O Primitives, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">持久内存 I/O 基元</a></p>
