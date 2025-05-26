---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: 了解用于向量搜索的分层可导航小世界（HNSW）
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: HNSW（分层导航小世界）是一种利用分层图结构进行近似近邻搜索的高效算法。
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p><a href="https://milvus.io/blog/what-is-a-vector-database.md">向量数据库</a>的关键操作符是<em>相似性搜索</em>，即在数据库中寻找与查询向量最近的邻居，例如通过欧氏距离。一种简单的方法是计算查询向量到数据库中存储的每个向量的距离，然后取最接近的前 K 个向量。然而，这种方法显然无法随着数据库规模的扩大而扩展。实际上，天真的相似性搜索只适用于向量少于 100 万左右的数据库。我们该如何将搜索扩展到千万级、亿万级，甚至数十亿级向量呢？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图向量搜索索引的层级递减</em></p>
<p>为了将高维向量空间中的相似性搜索扩展到亚线性时间复杂度，人们已经开发出了许多算法和数据结构。在本文中，我们将解释并实现一种流行而有效的方法，即分层可导航小世界（HNSW），它经常是中等规模向量数据集的默认选择。它属于在向量上构建一个图的搜索方法系列，其中顶点表示向量，边表示向量之间的相似性。在最简单的情况下，搜索通过导航图进行，贪婪地遍历到当前节点与查询最接近的邻居，并不断重复，直到达到局部最小值。</p>
<p>我们将更详细地解释搜索图是如何构建的，以及搜索图是如何实现搜索的，并在最后链接到由我用简单的 Python 语言实现的 HNSW。</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">可导航的小世界<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图由 100 个随机定位的二维点创建的 NSW 图。</em></p>
<p>如前所述，在我们进行查询之前，HNSW 会离线构建一个搜索图。该算法建立在先前工作的基础上，是一种名为 "可导航的小世界"（NSW）的方法。我们将首先解释 NSW，然后再介绍<em>分层</em>NSW。上图是在 2 维向量上构建的 NSW 搜索图。在下面的所有示例中，我们都将自己限制在二维向量上，以便能够直观地展示它们。</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">构建图<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>NSW 是一个图，其中顶点代表向量，边是根据向量之间的相似性启发式构建的，因此大多数向量都可以通过少量跳转从任何地方到达。这就是所谓的 "小世界 "特性，它允许快速导航。请看上图。</p>
<p>图初始化为空。我们遍历向量，依次将每个向量添加到图中。对于每个向量，从一个随机的入口节点开始，我们贪婪地<em>在迄今为止构建的图中</em>找到从入口点可以到达的最近的 R 个节点。然后将这些 R 节点连接到代表新插入向量的新节点上，并选择性地修剪任何现在有超过 R 个相邻节点的相邻节点。对所有向量重复这一过程，将得到 NSW 图。请参阅上图，了解该算法的可视化过程，并参考文章末尾的资源，从理论上分析像这样构建的图的属性。</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">搜索图<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>我们已经了解了搜索算法在图构建中的应用。但在本例中，查询节点是由用户提供的，而不是插入图中的节点。我们从一个随机的输入音符开始，贪婪地导航到其最接近查询的邻近节点，并维护一个迄今为止遇到的最接近向量的动态集。参见上图。请注意，我们可以通过从多个随机入口点开始搜索、汇总搜索结果以及在每一步中考虑多个邻居来提高搜索精度。不过，这些改进都是以增加延迟为代价的。</p>
<custom-h1>增加层次结构</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>到目前为止，我们已经介绍了 NSW 算法和数据结构，它们可以帮助我们在高维空间中扩大搜索范围。然而，该方法存在严重缺陷，包括在低维空间中失效、搜索收敛速度慢以及容易陷入局部极小值。</p>
<p>HNSW 的作者对 NSW 做了三处修改，弥补了这些不足：</p>
<ul>
<li><p>在构建和搜索过程中明确选择入口节点；</p></li>
<li><p>按不同尺度分离边；以及</p></li>
<li><p>使用先进的启发式来选择邻接节点。</p></li>
</ul>
<p>前两者是通过一个简单的想法实现的：建立<em>搜索图的层次结构</em>。HNSW 构建的是图形的层次结构，而不是 NSW 中的单一图形。每个图或图层都以与 NSW 相同的方式进行单独搜索。首先搜索的顶层包含极少的节点，而更深的层则逐渐包含越来越多的节点，最底层则包含所有节点。这意味着顶层在向量空间中包含的跳数更长，允许进行某种从过程到精细的搜索。如上图所示。</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">构建图<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>构建算法的工作原理如下：我们预先确定层数<em>L</em>。l=1 将对应最粗的层，搜索从这里开始；l=L 将对应最密集的层，搜索从这里结束。我们遍历要插入的每个向量，并按照截断<a href="https://en.wikipedia.org/wiki/Geometric_distribution">几何分布</a>（拒绝<em>l &gt; L</em>或设置<em>l' =</em>min_(l，L)_）对插入层进行采样。假设我们对当前向量采样<em>1 &lt; l &lt; L</em>。我们对顶层 L 进行贪婪搜索，直到达到局部最小值。然后，我们沿着第_L_层局部最小值的一条边，找到第_(L-1)_层的相应向量，并以此为切入点，对第_(L-1)_层进行贪婪搜索。</p>
<p>这个过程一直重复到第_l_层。然后，我们开始为要插入的向量创建节点，将其连接到迄今为止在第_l_层中通过贪婪搜索找到的最邻近的节点，再导航到第_(l-1)_层，如此反复，直到将向量插入第_1_层。上面的动画可以清楚地说明这一点</p>
<p>我们可以看到，这种分层图构建方法巧妙地为每个向量明确选择了插入节点。我们在迄今为止构建的插入层之上的各层中进行搜索，有效地搜索从路线到细节的距离。与此相关的是，该方法在每一层中按不同尺度分离链接：顶层提供跨越搜索空间的长尺度跳转，尺度向下递减到底层。这两种修改都有助于避免陷入次优最小值，并以增加内存为代价加速搜索收敛。</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">搜索图<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>搜索过程与内部图构建步骤非常相似。从顶层开始，我们贪婪地导航到最接近查询的一个或多个节点。然后，我们沿着该节点下到下一层，并重复该过程。正如上面的动画所示，我们的答案是由底层的<em>R 个</em>近邻节点列表得到的。</p>
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
    </button></h2><p>像 Milvus 这样的向量数据库提供了高度优化和调整的 HNSW 实现，它通常是适合内存数据集的最佳默认搜索索引。</p>
<p>我们对 HNSW 的工作原理和原因做了一个高层次的概述，更倾向于可视化和直觉，而不是理论和数学。因此，我们省略了对构建和搜索算法的精确描述<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 1-3]、对搜索和构建复杂性的分析<a href="https://arxiv.org/abs/1603.09320">[Malkov</a><a href="https://arxiv.org/abs/1603.09320">and</a><a href="https://arxiv.org/abs/1603.09320">Yashushin</a><a href="https://arxiv.org/abs/1603.09320">, 2016</a>; §4.2]，以及一些不太重要的细节，比如在构建过程中更有效地选择邻居节点的启发式<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 5]。此外，我们还忽略了对算法超参数的讨论、其含义以及它们如何影响延迟/速度/内存权衡<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; §4.1]。了解这一点对于在实践中使用 HNSW 非常重要。</p>
<p>下面的资源包含有关这些主题的进一步阅读，以及 NSW 和 HNSW 的完整 Python 教学实现（由我自己编写），包括生成本文中动画的代码。</p>
<custom-h1>资源</custom-h1><ul>
<li><p>GitHub："<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Illustrated：Hierarchical Navigable Small Worlds (HNSW)（一种向量搜索算法）的小型实现，用于学习目的</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Milvus 文档</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">了解层次导航小世界（HNSW） - Zilliz Learn</a></p></li>
<li><p>HNSW 论文：<a href="https://arxiv.org/abs/1603.09320">"使用层次化可导航小世界图进行高效、稳健的近似近邻搜索</a></p></li>
<li><p>NSW 论文：<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">"基于可导航小型世界图的近似近邻算法</a></p></li>
</ul>
