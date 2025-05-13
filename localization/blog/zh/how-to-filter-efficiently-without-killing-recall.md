---
id: how-to-filter-efficiently-without-killing-recall.md
title: 真实世界中的向量搜索：如何高效过滤而不扼杀回忆能力
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: 本博客探讨了向量搜索中流行的过滤技术，以及我们在 Milvus 和 Zilliz Cloud 中内置的创新优化技术。
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>很多人认为，向量搜索就是简单地实施一个 ANN（近似近邻）算法，然后就可以了。但如果你在生产中运行过向量搜索，你就会知道真相：它很快就会变得复杂。</p>
<p>想象一下，你正在构建一个产品搜索引擎。用户可能会问："<em>给我看与这张照片相似的鞋子，但只能是红色的，价格在 100 美元以下</em>。要满足这个查询要求，就需要对语义相似性搜索结果应用元数据过滤器。听起来就像在向量搜索返回后应用过滤器一样简单？其实不然。</p>
<p>如果过滤条件具有高度选择性，会发生什么情况？你可能得不到足够的结果。而简单地增加向量搜索的<strong>topK</strong>参数可能会迅速降低性能，并在处理相同的搜索量时消耗更多的资源。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在引擎盖下，高效的元数据过滤非常具有挑战性。你的向量数据库需要扫描图索引、应用元数据过滤器，并在严格的延迟预算（例如 20 毫秒）内做出响应。要在不破产的情况下每秒为数千次此类查询提供服务，需要深思熟虑的工程设计和精心的优化。</p>
<p>本博客将探讨向量搜索中流行的过滤技术，以及我们在<a href="https://milvus.io/docs/overview.md">Milvus</a>向量数据库及其完全托管的云服务<a href="https://zilliz.com/cloud">（Zilliz Cloud</a>）中内置的创新优化技术。我们还将分享一个基准测试，展示完全托管的 Milvus 在 1000 美元云预算的情况下，比其他向量数据库的性能高出多少。</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">图索引优化<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库需要高效的索引方法来处理大型数据集。如果没有索引，数据库必须将您的查询与数据集中的每个向量进行比较（暴力扫描），随着数据的增长，速度会变得非常慢。</p>
<p><strong>Milvus</strong>支持多种索引类型来解决这一性能难题。最常用的是基于图的索引类型：HNSW（完全在内存中运行）和 DiskANN（有效利用内存和固态硬盘）。这些索引将向量组织成一个网络结构，在这个结构中，向量的邻域在地图上相互连接，允许搜索快速导航到相关结果，同时只检查所有向量中的一小部分。全面管理的 Milvus 服务<strong>Zilliz Cloud</strong> 更进一步，引入了先进的专有向量搜索引擎 Cardinal，进一步增强了这些索引，使其性能更加出色。</p>
<p>然而，当我们添加过滤要求（如 "只显示低于 100 美元的产品"）时，新的问题就出现了。标准方法是创建一个<em>比特集</em>--一个标记哪些向量符合筛选条件的列表。在搜索过程中，系统只考虑该比特集中标记为有效的向量。这种方法看似合乎逻辑，但却带来了一个严重的问题：<strong>连接中断</strong>。当许多向量被过滤掉时，我们图形索引中精心构建的路径就会被打乱。</p>
<p>下面是这个问题的一个简单例子：在下图中，A 点与 B、C 和 D 相连，但 B、C 和 D 之间并不直接相连。如果我们的过滤器去掉了 A 点（可能是成本太高），那么即使 B、C 和 D 与我们的搜索相关，它们之间的路径也会中断。这就形成了连接断开的向量 "孤岛"，在搜索过程中变得无法到达，从而损害了搜索结果的质量（召回率）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在图遍历过程中，有两种常见的过滤方法：一是事先排除所有过滤掉的点，二是包含所有点，然后再应用过滤。如下图所示，这两种方法都不理想。当过滤率接近 1 时，完全跳过过滤点会导致召回率崩溃（蓝线），而不管元数据如何，访问每个点都会使搜索空间变得臃肿，并大大降低性能（红线）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>研究人员提出了几种在召回率和性能之间取得平衡的方法：</p>
<ol>
<li><strong>阿尔法策略：</strong>这引入了一种概率方法：即使某个向量与过滤器不匹配，我们仍可能在搜索过程中以某种概率访问它。这种概率（alpha）取决于过滤比率--过滤的严格程度。这有助于在不访问过多无关向量的情况下保持图中的基本连接。</li>
</ol>
<ol start="2">
<li><strong>ACORN 方法 [1]：</strong>在标准 HNSW 中，索引构建过程中会使用边剪枝来创建稀疏图并加快搜索速度。ACORN 方法有意跳过了这一剪枝步骤，以保留更多的边并加强连接性--这在过滤器可能排除许多节点的情况下至关重要。在某些情况下，ACORN 还会通过收集更多近似近邻来扩展每个节点的邻居列表，从而进一步强化图。此外，ACORN 的遍历算法会提前两步（即检查邻居的邻居），即使在高过滤率的情况下也能提高找到有效路径的几率。</li>
</ol>
<ol start="3">
<li><strong>动态选择邻居：</strong>这是一种比阿尔法策略更先进的方法。这种方法不依赖概率跳转，而是在搜索过程中自适应地选择下一个节点。与阿尔法策略相比，它提供了更多的控制。</li>
</ol>
<p>在 Milvus 中，我们将 Alpha 策略与其他优化技术一起实施。例如，在检测到选择性极强的筛选器时，它会动态切换策略：比如，当大约 99% 的数据与筛选表达式不匹配时，"包含全部 "策略会导致图遍历路径大大延长，从而造成性能下降和孤立的数据 "孤岛"。在这种情况下，Milvus 会自动退回到暴力扫描，完全绕过图索引以提高效率。在为全面管理的 Milvus（Zilliz Cloud）提供动力的向量搜索引擎 Cardinal 中，我们进一步实现了 "包含全部 "和 "排除全部 "遍历方法的动态组合，根据数据统计进行智能调整，以优化查询性能。</p>
<p>我们使用 AWS r7gd.4xlarge 实例在 Cohere 1M 数据集（维度 = 768）上进行的实验证明了这种方法的有效性。在下图中，蓝线表示我们的动态组合策略，红线表示遍历图中所有过滤点的基线方法。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">元数据感知索引<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>另一个挑战来自元数据和向量 Embeddings 之间的关系。在大多数应用中，项目的元数据属性（如产品价格）与向量实际表示的内容（语义或视觉特征）之间的联系微乎其微。例如，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>90</mi><mn>dressanda90</mn></mrow><annotation encoding="application/x-tex">连衣裙和</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90</span></span></span></span>腰带的价位相同，但视觉特征却完全不同。这种脱节使得将过滤与向量搜索结合在一起本质上是低效的。</p>
<p>为了解决这个问题，我们开发了<strong>元数据感知向量索引</strong>。它不是只为所有向量建立一个图，而是为不同的元数据值建立专门的 "子图"。例如，如果您的数据有 "颜色 "和 "形状 "字段，它就会为这些字段创建单独的图结构。</p>
<p>当您使用 "颜色 = 蓝色 "这样的过滤器进行搜索时，它会使用特定于颜色的子图，而不是主图。这样速度会更快，因为子图已经围绕你要筛选的元数据进行了组织。</p>
<p>在下图中，主图索引称为<strong>基础图</strong>，而为特定元数据字段构建的专用图称为<strong>列图</strong>。为了有效管理内存使用情况，它会限制每个点可以有多少个连接（外延度）。当搜索不包含任何元数据过滤器时，它默认使用基础图。当应用过滤器时，它会切换到相应的列图，从而提供显著的速度优势。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">迭代过滤<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>有时，过滤本身会成为瓶颈，而不是向量搜索。尤其是在使用 JSON 条件或详细的字符串比较等复杂过滤器时，这种情况更容易发生。传统的方法（先过滤，后搜索）可能会非常慢，因为系统甚至在开始向量搜索之前就必须对可能数以百万计的记录评估这些昂贵的过滤器。</p>
<p>你可能会想："为什么不先进行向量搜索，然后再过滤最重要的结果呢？这种方法有时可行，但有一个很大的缺陷：如果您的过滤器很严格，能过滤掉大部分结果，那么过滤后的结果可能太少（或为零）。</p>
<p>为了解决这一难题，我们受<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a> 的启发，在 Milvus 和 Zilliz Cloud 中创建了<strong>迭代过滤法</strong>。迭代过滤不是全有或全无的方法，而是分批进行：</p>
<ol>
<li><p>获取一批最匹配的向量</p></li>
<li><p>对该批次应用过滤器</p></li>
<li><p>如果没有足够的过滤结果，再获取一批</p></li>
<li><p>重复上述步骤，直到我们得到所需的结果数量</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种方法大大减少了我们需要执行的昂贵的过滤操作，同时还能确保我们获得足够多的高质量结果。有关启用迭代过滤的更多信息，请参阅此<a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">迭代过滤文档页面</a>。</p>
<h2 id="External-Filtering" class="common-anchor-header">外部过滤<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>现实世界中的许多应用都会将数据分割到不同的系统中--向量数据库中的向量和传统数据库中的元数据。例如，许多组织将产品描述和用户评论作为向量存储在 Milvus 中，用于语义搜索，同时将库存状态、定价和其他结构化数据保存在 PostgreSQL 或 MongoDB 等传统数据库中。</p>
<p>这种分离在架构上是合理的，但却给过滤搜索带来了挑战。典型的工作流程是</p>
<ul>
<li><p>查询关系数据库中与筛选条件（如 "50 美元以下的库存商品"）相匹配的记录</p></li>
<li><p>获取匹配的 ID 并将其发送给 Milvus 以过滤向量搜索</p></li>
<li><p>只对与这些 ID 匹配的向量执行语义搜索</p></li>
</ul>
<p>这听起来很简单，但当行数超过数百万时，就会成为瓶颈。传输大量 ID 列表会消耗网络带宽，而在 Milvus 中执行大量过滤表达式又会增加开销。</p>
<p>为了解决这个问题，我们在 Milvus 中引入了<strong>外部过滤</strong>功能，这是一种轻量级的 SDK 级解决方案，它使用搜索迭代器 API 并颠覆了传统的工作流程。</p>
<ul>
<li><p>首先执行向量搜索，检索一批语义最相关的候选对象</p></li>
<li><p>在客户端对每个批次应用自定义过滤功能</p></li>
<li><p>自动获取更多批次，直到有足够的过滤结果为止</p></li>
</ul>
<p>这种分批迭代的方法大大减少了网络流量和处理开销，因为您只需处理向量搜索中最有希望的候选结果。</p>
<p>下面是一个如何在 pymilvus 中使用外部过滤的示例：</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>迭代过滤法在分段级迭代器上操作，与之不同的是，外部过滤法在全局查询级别上操作。这种设计最大限度地减少了元数据评估，避免了在 Milvus 内部执行大型过滤器，从而实现了更精简、更快速的端到端性能。</p>
<h2 id="AutoIndex" class="common-anchor-header">自动索引<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>向量搜索总是需要在准确性和速度之间做出权衡--检查的向量越多，结果就越好，但查询速度就越慢。如果添加过滤器，这种平衡就变得更加难以把握。</p>
<p>在 Zilliz Cloud 中，我们创建了<strong>AutoIndex</strong>- 一种基于 ML 的优化器，可自动为您调整这种平衡。AutoIndex 不需要手动配置复杂的参数，而是利用机器学习来确定特定数据和查询模式的最佳设置。</p>
<p>要了解其工作原理，最好先了解一下 Milvus 的架构，因为 Zilliz 是在 Milvus 的基础上构建的：查询分布在多个查询节点实例上。每个节点处理数据的一部分（段），执行搜索，然后将结果合并在一起。</p>
<p>AutoIndex 会分析这些分段的统计数据，并做出智能调整。对于低过滤率，索引查询范围会扩大，以提高召回率。过滤率高时，则缩小查询范围，避免浪费精力在不可能的候选项上。这些决定都是在统计模型的指导下做出的，该模型可预测每个特定过滤情况下最有效的搜索策略。</p>
<p>AutoIndex 不只是索引参数。它还能帮助选择最佳的过滤评估策略。通过解析过滤表达式和采样段数据，它可以估算评估成本。如果检测到评估成本较高，它会自动切换到迭代过滤等更高效的技术。这种动态调整可确保您始终为每个查询使用最合适的策略。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">1,000 美元预算下的性能<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>理论上的改进固然重要，但对于大多数开发人员来说，实际性能才是最重要的。我们想测试在实际预算限制下，这些优化如何转化为实际应用性能。</p>
<p>我们以每月 1,000 美元的实际预算对几种向量数据库解决方案进行了基准测试，这是许多公司分配给向量搜索基础架构的合理金额。对于每个解决方案，我们都选择了在预算限制范围内性能最高的实例配置。</p>
<p>我们的测试使用了</p>
<ul>
<li><p>包含 100 万个 768 维向量的 Cohere 1M 数据集</p></li>
<li><p>现实世界中过滤和非过滤搜索工作负载的混合体</p></li>
<li><p>用于一致比较的开源 vdb-bench 基准工具</p></li>
</ul>
<p>竞争解决方案（匿名为 "VDB A"、"VDB B "和 "VDB C"）都在预算范围内进行了优化配置。结果显示，完全托管的 Milvus（Zilliz Cloud）在过滤和非过滤查询中始终保持最高吞吐量。在预算同样为 1000 美元的情况下，我们的优化技术以极具竞争力的召回率提供了最高的性能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>带有过滤功能的向量搜索表面上看起来很简单，只需在查询中添加一个过滤子句就可以了。但是，正如我们在本博客中所展示的那样，要在大规模范围内实现高性能和精确结果，需要复杂的工程解决方案。Milvus 和 Zilliz Cloud 通过几种创新方法来应对这些挑战：</p>
<ul>
<li><p><strong>图索引优化</strong>：即使过滤器删除了连接节点，也会保留类似项目之间的路径，防止出现降低结果质量的 "孤岛 "问题。</p></li>
<li><p><strong>元数据感知索引</strong>：为常见的过滤条件创建专门的路径，在不影响准确性的前提下显著加快过滤搜索的速度。</p></li>
<li><p><strong>迭代过滤</strong>：成批处理结果，只对最有希望的候选结果而不是整个数据集应用复杂的筛选器。</p></li>
<li><p><strong>自动索引</strong>：利用机器学习，根据数据和查询自动调整搜索参数，在速度和准确性之间取得平衡，无需手动配置。</p></li>
<li><p><strong>外部过滤</strong>：将向量搜索与外部数据库有效衔接，消除网络瓶颈，同时保持结果质量。</p></li>
</ul>
<p>Milvus 和 Zilliz Cloud 不断发展新功能，进一步提高过滤搜索性能。<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Key</a>等功能可根据过滤模式实现更高效的数据组织，而先进的子图路由技术则进一步推动了性能极限。</p>
<p>非结构化数据的数量和复杂性继续呈指数增长，给各地的搜索系统带来了新的挑战。我们的团队不断突破向量数据库的极限，以提供更快、更可扩展的人工智能搜索。</p>
<p>如果您的应用程序在使用过滤向量搜索时遇到性能瓶颈，我们邀请您加入我们活跃的开发人员社区：<a href="https://milvus.io/community">milvus.io/community</a>--在这里您可以分享挑战、获得专家指导并发现新兴的最佳实践。</p>
<h2 id="References" class="common-anchor-header">参考资料<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
