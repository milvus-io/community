---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: Milvus 2.6 将地理空间过滤和向量搜索与几何字段和 RTREE 结合在一起
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_new_cover_1_a0439d3adf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Geospatial Filtering + Vector Search in Milvus with Geometry Fields and RTREE
desc: 了解 Milvus 2.6 如何利用几何字段和 RTREE 索引将向量搜索与地理空间索引统一起来，从而实现准确的位置感知人工智能检索。
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>随着人工智能系统越来越多地应用于实时决策，地理空间数据在越来越多的应用中变得越来越重要--尤其是那些在物理世界中操作或跨真实地点为用户提供服务的应用。</p>
<p>考虑一下 DoorDash 或 Uber Eats 这样的送餐平台。当用户下订单时，系统并不是简单地计算两点之间的最短距离。它需要评估餐厅质量、快递可用性、实时交通状况、服务区域，以及越来越多代表个人偏好的用户和物品嵌入。同样，自动驾驶汽车必须在严格的延迟限制条件下（通常在几毫秒内）执行路径规划、障碍物检测和场景级语义理解。在这些领域，有效的决策取决于空间约束与语义相似性的结合，而不是将它们视为独立的步骤。</p>
<p>然而，在数据层，空间数据和语义数据历来由不同的系统处理。</p>
<ul>
<li><p>地理空间数据库和空间扩展旨在存储坐标、多边形和空间关系（如包含或距离）。</p></li>
<li><p>向量数据库处理代表数据语义的向量 Embeddings。</p></li>
</ul>
<p>当应用程序同时需要这两种数据时，往往被迫进入多阶段查询管道--在一个系统中按位置进行过滤，然后在另一个系统中执行向量搜索。这种分离增加了系统的复杂性，增加了查询延迟，并且难以有效地大规模执行空间语义推理。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a>通过引入<a href="https://milvus.io/docs/geometry-field.md">几何字段（Geometry Field</a>）解决了这一问题，它允许将向量相似性搜索与空间约束直接结合起来。这样就可以实现以下用例</p>
<ul>
<li><p>位置服务（LBS）："查找该城市街区内的相似 POI</p></li>
<li><p>多模式搜索："检索该点 1km 范围内的相似照片</p></li>
<li><p>地图与物流："区域内的资产 "或 "与路径相交的路线"</p></li>
</ul>
<p>配合新的<a href="https://milvus.io/docs/rtree.md">RTREE 索引--一种</a>针对空间过滤进行了优化的树形结构--Milvus 现在支持高效的地理空间操作符，如<code translate="no">st_contains</code> 、<code translate="no">st_within</code> 和<code translate="no">st_dwithin</code> 以及高维向量搜索。它们的结合使空间感知智能检索不仅成为可能，而且非常实用。</p>
<p>在这篇文章中，我们将介绍几何字段和 RTREE 索引的工作原理，以及它们如何与向量相似性搜索相结合，从而实现现实世界中的空间语义应用。</p>
<h2 id="What-Is-a-Geometry-Field-in-Milvus" class="common-anchor-header">什么是 Milvus 中的几何字段？<button data-href="#What-Is-a-Geometry-Field-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中，<strong>几何字段</strong>是一种 Schema 定义的数据类型 (<code translate="no">DataType.GEOMETRY</code>) ，用于存储几何数据。与只处理原始坐标的系统不同，Milvus 支持一系列空间结构，包括<strong>点（Point</strong>）、<strong>线字符串（LineString</strong>）和<strong>多边形（Polygon</strong>）。</p>
<p>这样，就可以在存储语义向量的同一个数据库中表示真实世界的概念，如餐厅位置（点）、配送区域（多边形）或自动驾驶汽车轨迹（LineString）。换句话说，Milvus 成为了一个统一的系统，既能显示某物的<em>位置</em>，也能显示<em>其含义</em>。</p>
<p>几何值使用<a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">已知文本（WKT）</a>格式存储，这是一种用于插入和查询几何数据的人类可读标准。由于 WKT 字符串可以直接插入 Milvus 记录，因此简化了数据摄取和查询。例如</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">什么是 RTREE 索引及其工作原理？<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 引入几何数据类型后，还需要一种有效的方法来过滤空间对象。Milvus 使用两阶段空间过滤管道来处理这个问题：</p>
<ul>
<li><p><strong>粗过滤：</strong>使用 RTREE 等空间索引快速缩小候选对象的范围。</p></li>
<li><p><strong>精细过滤：</strong>对剩余的候选对象进行精确的几何检查，确保边界的正确性。</p></li>
</ul>
<p>这种设计兼顾了性能和准确性。空间索引会积极删除不相关的数据，而精确的几何检查则能确保包含、交叉和距离阈值等操作符的结果正确无误。</p>
<p>该管道的核心是<strong>RTREE（矩形树）</strong>，这是一种空间索引结构，旨在加快几何数据的查询速度。RTREE 使用<strong>最小边界矩形 (MBR)</strong> 对对象进行分层组织，允许在执行查询时跳过大部分搜索空间。</p>
<h3 id="Phase-1-Building-the-RTREE-Index" class="common-anchor-header">第 1 阶段：构建 RTREE 索引</h3><p>RTREE 的构建遵循一个自下而上的过程，将附近的空间对象分组到越来越大的边界区域中：</p>
<p><strong>1.创建叶节点：</strong>对于每个几何对象，计算其<strong>最小边界矩形 (MBR)</strong>- 即完全包含该对象的最小矩形，并将其存储为叶节点。</p>
<p><strong>2.组合成更大的方框：</strong>将附近的叶节点分组，并将每个分组包裹在一个新的 MBR 内，生成内部节点。</p>
<p><strong>3.添加根节点：</strong>创建一个根节点，其 MBR 覆盖所有内部组，形成一个高度平衡的树形结构。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>第二阶段：加速查询</strong></p>
<p><strong>1.形成查询 MBR：</strong>为查询中使用的几何图形计算 MBR。</p>
<p><strong>2.修剪分支：</strong>从根节点开始，将查询 MBR 与每个内部节点进行比较。跳过 MBR 与查询 MBR 不相交的任何分支。</p>
<p><strong>3.收集候选节点：</strong>下降到相交的分支，收集候选叶节点。</p>
<p><strong>4.执行精确匹配：</strong>对于每个候选节点，运行空间谓词以获得精确结果。</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">RTREE 为何快速</h3><p>RTREE 在空间过滤方面的强大性能得益于几个关键的设计特点：</p>
<ul>
<li><p><strong>每个节点都存储一个 MBR：</strong>每个节点都近似其子树中所有几何图形的面积。这使得在查询过程中很容易决定是否要探索某个分支。</p></li>
<li><p><strong>快速剪枝：</strong>只探索 MBR 与查询区域相交的子树。无关区域将被完全忽略。</p></li>
<li><p><strong>随数据大小扩展：</strong>RTREE 支持在<strong>O(log N)</strong>时间内进行空间搜索，即使数据集不断扩大，也能实现快速查询。</p></li>
<li><p><strong>Boost.Geometry 实现：</strong>Milvus 使用<a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a> 构建 RTREE 索引，<a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a> 是一个广泛使用的 C++ 库，提供优化的几何算法和线程安全的 RTREE 实现，适合并发工作负载。</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">支持的几何操作符</h3><p>Milvus 提供了一组空间操作符，允许您根据几何关系过滤和检索实体。这些操作符对于需要了解对象在空间中如何相互关联的工作负载至关重要。</p>
<p>下表列出了 Milvus 当前可用的<a href="https://milvus.io/docs/geometry-operators.md">几何操作符</a>。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>操作符</strong></th><th style="text-align:center"><strong>说明</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">如果几何图形 A 和 B 至少有一个公共点，则返回 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">如果几何体 A 完全包含几何体 B（不包括边界），则返回 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">如果几何体 A 完全包含在几何体 B 中，则返回 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">如果几何体 A 覆盖了几何体 B（包括边界），则返回 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A, B)</strong></td><td style="text-align:center">如果几何体 A 和 B 在边界处相交，但内部不相交，则返回 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">如果几何图形 A 和 B 在空间上相同，则返回 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">如果几何图形 A 和 B 部分重叠，且都不完全包含其他几何图形，则返回 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">如果 A 和 B 之间的距离小于<em>d</em>，则返回 TRUE。</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">如何结合地理位置索引和向量索引</h3><p>有了地理位置支持和 RTREE 索引，Milvus 可以在一个工作流程中将地理空间过滤与向量相似性搜索结合起来。该过程分为两个步骤：</p>
<p><strong>1.使用 RTREE 按位置过滤：</strong>Milvus 首先使用 RTREE 索引将搜索范围缩小到指定地理范围内的实体（如 "2 公里内"）。</p>
<p><strong>2.使用向量搜索按语义排序：</strong>从剩余的候选结果中，向量索引根据 Embeddings 相似度选出 Top-N 最相似的结果。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="common-anchor-header">地理向量检索的实际应用案例<button data-href="#Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1.配送服务：更智能的位置感知推荐</h3><p>DoorDash 或 Uber Eats 等平台每天要处理数以亿计的请求。在用户打开应用程序的那一刻，系统必须根据用户的位置、时间、口味偏好、预计送达时间、实时交通情况和快递员的可用性来确定哪些餐厅或快递员是<em>当前</em>最匹配的。</p>
<p>传统上，这需要查询地理空间数据库和单独的推荐引擎，然后进行多轮筛选和重新排序。有了地理位置索引，Milvus 极大地简化了这一工作流程：</p>
<ul>
<li><p><strong>统一存储</strong>--餐厅坐标、快递地点和用户偏好 Embeddings 都在一个系统中。</p></li>
<li><p><strong>联合检索</strong>- 首先应用空间过滤器（例如，<em>3 公里内的餐馆</em>），然后使用向量搜索按相似度、口味偏好或质量进行排序。</p></li>
<li><p><strong>动态决策</strong>--结合实时快递分布和交通信号，快速分配最近、最合适的快递。</p></li>
</ul>
<p>这种统一方法使平台能够在单个查询中执行空间和语义推理。例如，当用户搜索 "咖喱饭 "时，Milvus 会检索与语义相关的餐厅<em>，并</em>优先选择附近、配送速度快且符合用户历史口味特征的餐厅。</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2.自动驾驶：更智能的决策</h3><p>在自动驾驶中，地理空间索引是感知、定位和决策的基础。车辆必须不断对准高清地图，检测障碍物，规划安全轨迹--所有这些都必须在几毫秒内完成。</p>
<p>通过 Milvus，几何类型和 RTREE 索引可以存储和查询丰富的空间结构，例如</p>
<ul>
<li><p><strong>道路边界</strong>（LineString）</p></li>
<li><p><strong>交通管制区</strong>（多边形）</p></li>
<li><p><strong>检测到的障碍物</strong>（点）</p></li>
</ul>
<p>可以对这些结构进行高效索引，使地理空间数据直接参与人工智能决策循环。例如，只需通过 RTREE 空间谓词，自动驾驶汽车就能快速确定其当前坐标是否位于特定车道内或与限制区域相交。</p>
<p>当与感知系统生成的向量嵌入（例如捕捉当前驾驶环境的场景嵌入）相结合时，Milvus 可以支持更高级的查询，例如检索半径 50 米范围内与当前类似的历史驾驶场景。这有助于模型更快地解读环境，做出更好的决策。</p>
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
    </button></h2><p>地理定位不仅仅是经度和纬度。在位置敏感型应用中，它提供了有关<strong>事件发生地点、实体空间关系以及这些关系如何影响系统行为的</strong>重要背景信息。当地理空间数据与来自机器学习模型的语义信号相结合时，就能实现更丰富的查询，而在单独处理空间和向量数据时，这些查询难以表达或执行效率低下。</p>
<p>通过引入几何字段和 RTREE 索引，Milvus 将向量相似性搜索和空间过滤整合到了一个单一的查询引擎中。这样，应用程序就可以跨<strong>向量、地理空间数据和时间</strong>执行联合检索，支持空间感知推荐系统、基于位置的多模式搜索以及区域或路径受限分析等用例。更重要的是，它消除了在专业系统之间移动数据的多级管道，从而降低了架构的复杂性。</p>
<p>随着人工智能系统不断向现实世界的决策靠拢，了解<strong><em>哪些</em></strong>内容是相关的将越来越需要与它的<strong><em>适用范围</em></strong>和适用<strong><em>时间</em></strong>相匹配。Milvus 为这类空间语义工作负载提供了构建模块，其方式既具有表现力，又切实可行，适合大规模操作。</p>
<p>有关几何字段和 RTREE 索引的更多信息，请查看下面的文档：</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">几何字段 | Milvus 文档</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Milvus 文档</a></p></li>
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
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介绍 Embeddings 功能：Milvus 2.6 如何简化向量化和语义搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus中的JSON粉碎功能：快88.9倍的灵活JSON过滤功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解锁真正的实体级检索：Milvus 中新的结构数组和 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus如何利用RaBitQ将查询次数提高3倍</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准会说谎--向量数据库需要真正的测试 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们为 Milvus 用啄木鸟取代了 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">真实世界中的向量搜索：如何高效过滤而不牺牲召回率</a></p></li>
</ul>
