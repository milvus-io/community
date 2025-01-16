---
id: getting-started-with-hnswlib.md
title: HNSWlib 入门
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: HNSWlib 是一个实现 HNSW 的库，具有很高的效率和可扩展性，即使有数百万个点也能很好地运行。了解如何在几分钟内实现它。
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>能让机器理解语言，并产生更好的搜索结果，这对人工智能和数据分析至关重要。一旦语言被表示为<a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">Embeddings</a>，就可以使用精确或近似方法进行搜索。近似<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">近邻</a><a href="https://zilliz.com/glossary/anns">（ANN</a>）搜索是一种用于快速查找数据集中与给定查询点最接近的点的方法，与<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">精确近邻搜索</a>不同，<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">精确近邻搜索</a>对于高维数据来说计算成本很高。近邻搜索能提供近似于近邻的结果，从而加快检索速度。</p>
<p>近似近邻（ANN）搜索的算法之一是<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>（Hierarchical Navigable Small Worlds，层次导航小世界），在<a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a> 下实现，这将是今天讨论的重点。在本博客中，我们将</p>
<ul>
<li><p>了解 HNSW 算法。</p></li>
<li><p>探索 HNSWlib 及其主要功能。</p></li>
<li><p>设置 HNSWlib，包括索引构建和搜索实现。</p></li>
<li><p>与 Milvus 进行比较。</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">了解 HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds（</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>）</strong>是一种基于图的数据结构，通过构建 "小世界 "网络的多层图，可以进行高效的相似性搜索，尤其是在高维空间中。HNSW 于<a href="https://arxiv.org/abs/1603.09320">2016 年</a>推出，解决了与传统搜索方法（如暴力搜索和基于树的搜索）相关的可扩展性问题。它非常适合涉及大型数据集的应用，如推荐系统、图像识别和<a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">检索增强生成（RAG）</a>。</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">HNSW 为何重要</h3><p>HNSW 大大提高了高维空间中最近邻搜索的性能。分层结构与小世界可导航性相结合，避免了旧方法的计算效率低下问题，使其在处理大规模复杂数据集时也能表现出色。为了更好地理解这一点，让我们来看看它现在是如何工作的。</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">HNSW 如何工作</h3><ol>
<li><p><strong>分层：</strong>HNSW 将数据组织成层级结构，每一层都包含由边连接的节点。顶层较为稀疏，可以在图中进行大范围 "跳转"，就像在地图上放大后只能看到城市间的主要公路一样。下层的密度增加，提供了更多细节和更多近邻之间的连接。</p></li>
<li><p><strong>可导航的小世界概念：</strong>HNSW 中的每一层都建立在 "小世界 "网络概念的基础上，其中的节点（数据点）之间只有几个 "跳 "的距离。搜索算法从最高、最稀疏的层开始，向下移动到逐渐密集的层，以完善搜索。这种方法就像从全局视图向下移动到邻近层细节，逐渐缩小搜索范围。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">图 1</a>：可导航的小世界图示例</p>
<ol start="3">
<li><strong>跳过列表式结构：</strong>HNSW 的分层结构类似于跳过列表，这是一种概率数据结构，其中较高层的节点较少，因此初始搜索速度较快。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">图 2</a>：跳表结构示例</p>
<p>要在给定的跳过列表中搜索 96，我们从最左侧的顶层开始，在头节点处搜索。向右移动时，我们遇到了 31，小于 96，因此我们继续向下一个节点移动。现在，我们需要向下移动一级，再次看到 31；由于它仍然小于 96，我们又向下移动了一级。再次找到 31 后，我们向右移动，到达 96，也就是我们的目标值。这样，我们就找到了 96，而无需下移到跳转列表的最低层。</p>
<ol start="4">
<li><p><strong>搜索效率：</strong>HNSW 算法从最高层的入口节点开始，每一步都向更近的邻近节点前进。它逐层下降，利用每一层进行从粗到细的探索，直到到达可能找到最相似节点的最低层。这种分层导航减少了需要探索的节点和边的数量，使搜索既快速又准确。</p></li>
<li><p><strong>插入和维护</strong>：在添加新节点时，算法会根据概率确定其入口层，并使用邻居选择启发式将其连接到附近的节点。启发式的目的是优化连接性，在平衡图密度的同时创建可提高导航性的链接。这种方法使结构保持稳健，并能适应新的数据点。</p></li>
</ol>
<p>虽然我们已经对 HNSW 算法有了基本的了解，但从头开始实施可能会让人不知所措。幸运的是，社区开发了像<a href="https://github.com/nmslib/hnswlib">HNSWlib</a>这样的库来简化使用，使我们无需挠头就能使用它。下面，让我们来详细了解一下 HNSWlib。</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">HNSWlib 概述<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib 是实现 HNSW 的流行库，具有高效率和可扩展性，即使在数百万个点的情况下也能表现出色。它允许在图层之间快速跳转，并优化了高密度、高维数据的搜索，从而实现了亚线性时间复杂度。以下是 HNSWlib 的主要特点：</p>
<ul>
<li><p><strong>基于图形的结构：</strong>多层图表示数据点，允许快速近邻搜索。</p></li>
<li><p><strong>高维效率：</strong>针对高维数据进行优化，提供快速准确的近似搜索。</p></li>
<li><p><strong>亚线性搜索时间：</strong>通过跳层实现亚线性复杂性，显著提高速度。</p></li>
<li><p><strong>动态更新：</strong>支持实时插入和删除节点，无需重建整个图。</p></li>
<li><p><strong>内存效率</strong>内存使用效率高，适合大型数据集。</p></li>
<li><p><strong>可扩展性</strong>可扩展至数百万个数据点，非常适合推荐系统等中等规模的应用。</p></li>
</ul>
<p><strong>注：</strong>HNSWlib 非常适合创建向量搜索应用的简单原型。不过，由于可扩展性的限制，对于涉及数亿甚至数十亿数据点的更复杂场景，可能有更好的选择，如<a href="https://zilliz.com/blog/what-is-a-real-vector-database">专门构建的向量数据库</a>。让我们来看看实际应用。</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">HNSWlib 入门：分步指南<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>本节将通过创建 HNSW 索引、插入数据和执行搜索来演示如何将 HNSWlib 用作<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">向量搜索库</a>。让我们从安装开始：</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">安装和导入</h3><p>要开始使用 Python 中的 HNSWlib，首先使用 pip 安装：</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>然后，导入必要的库：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">准备数据</h3><p>在本例中，我们将使用<code translate="no">NumPy</code>生成一个包含 10,000 个元素的随机数据集，每个元素的维度大小为 256。</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>让我们创建数据：</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>现在数据已经准备就绪，让我们来建立索引。</p>
<h3 id="Building-an-Index" class="common-anchor-header">建立索引</h3><p>在建立索引时，我们需要定义向量的维度和空间类型。让我们创建一个索引：</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>:该参数定义了用于衡量相似性的距离度量。将其设置为<code translate="no">'l2'</code> 意味着使用欧氏距离（L2 规范）。如果将其设置为<code translate="no">'ip'</code> ，则将使用内积，这对余弦相似性等任务很有帮助。</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>:该参数用于指定数据点的维度。它必须与计划添加到索引中的数据维度相匹配。</li>
</ul>
<p>下面是初始化索引的方法：</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>:<code translate="no">Num_elements</code> 是最大容量，因此我们将其设置为 10,000，因为我们要处理 10,000 个数据点。</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>:该参数控制索引创建过程中准确性与构建速度之间的权衡。数值越大，召回率（准确率）越高，但内存使用量和构建时间也会增加。常用值范围为 100 到 200。</li>
</ul>
<ul>
<li><code translate="no">M=16</code>:该参数决定了为每个数据点创建的双向链接的数量，从而影响准确性和搜索速度。典型值介于 12 和 48 之间；16 通常是兼顾适度准确性和速度的最佳值。</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>:<code translate="no">ef</code> 参数是 "探索因子 "的缩写，决定了搜索过程中检查邻域的数量。<code translate="no">ef</code> 值越高，搜索的邻域越多，搜索的准确率（召回率）通常会提高，但搜索速度也会变慢。相反，<code translate="no">ef</code> 值越低，搜索速度越快，但可能会降低准确率。</li>
</ul>
<p>在这种情况下，将<code translate="no">ef</code> 设置为 50 意味着搜索算法在查找最相似数据点时最多将评估 50 个邻居。</p>
<p>注：<code translate="no">ef_construction</code> 设置索引创建过程中的邻居搜索工作，可提高准确性，但会减慢构建速度。<code translate="no">ef</code> 控制查询过程中的搜索工作，动态平衡每次查询的速度和召回率。</p>
<h3 id="Performing-Searches" class="common-anchor-header">执行搜索</h3><p>要使用 HNSWlib 执行近邻搜索，我们首先要创建一个随机查询向量。在本例中，向量的维度与索引数据相匹配。</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>:此行生成的随机向量与索引数据的维度相同，确保了近邻搜索的兼容性。</li>
<li><code translate="no">knn_query</code>:该方法在索引<code translate="no">p</code> 中搜索<code translate="no">k</code> <code translate="no">query_vector</code> 的最近邻。它返回两个数组：<code translate="no">labels</code>，其中包含近邻的索引，以及<code translate="no">distances</code> ，表示查询向量到每个近邻的距离。在这里，<code translate="no">k=5</code> 指定我们要查找五个最近的邻居。</li>
</ul>
<p>下面是打印标签和距离后的结果：</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>这就是使用 HNSWlib 的简单指南。</p>
<p>如前所述，HNSWlib 是一个很好的向量搜索引擎，适用于原型开发或中等规模数据集的实验。如果您有更高的可扩展性要求或需要其他企业级功能，可能需要选择专门构建的向量数据库，如开源的<a href="https://zilliz.com/what-is-milvus">Milvus</a>或其在<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 上的完全托管服务。因此，在下面的章节中，我们将比较 HNSWlib 和 Milvus。</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib 与 Milvus 等专用向量数据库的比较<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>将数据存储为数学表示，使<a href="https://zilliz.com/ai-models">机器学习模型</a>能够通过<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">相似性指标</a>识别数据，从而实现上下文理解，从而为搜索、推荐和文本生成提供动力。</p>
<p>像 HNSWlib 这样的向量索引库可以改进<a href="https://zilliz.com/learn/vector-similarity-search">向量搜索</a>和检索，但缺乏完整数据库的管理功能。另一方面，<a href="https://milvus.io/">Milvus</a> 等向量数据库旨在大规模处理向量 Embeddings，在数据管理、索引和查询功能方面具有独立库通常缺乏的优势。以下是使用 Milvus 的其他一些优势：</p>
<ul>
<li><p><strong>高速向量相似性搜索</strong>：Milvus 在十亿规模的向量数据集上提供毫秒级的搜索性能，是图像检索、推荐系统、自然语言处理<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">（NLP</a>）和检索增强生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（RAG</a>）等应用的理想选择。</p></li>
<li><p><strong>可扩展性和高可用性：</strong>Milvus 专为处理海量数据而构建，可横向扩展，并包含复制和故障转移机制，以确保可靠性。</p></li>
<li><p><strong>分布式架构：</strong>Milvus 采用分布式可扩展架构，将存储和计算分离到多个节点，具有灵活性和稳健性。</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>混合搜索</strong></a><strong>：</strong>Milvus 支持多模式搜索、混合<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">稀疏和密集搜索</a>，以及混合密集和<a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">全文搜索</a>，提供多功能和灵活的搜索功能。</p></li>
<li><p><strong>灵活的数据支持</strong>：Milvus 支持多种数据类型--向量、标量和结构化数据--允许在单一系统内进行无缝管理和分析。</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>活跃的社区</strong></a> <strong>和支持</strong>：蓬勃发展的社区提供定期更新、教程和支持，确保 Milvus 始终与用户需求和该领域的进步保持一致。</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">人工智能集成</a>：Milvus 集成了各种流行的人工智能框架和技术，使开发人员更容易使用自己熟悉的技术栈构建应用程序。</p></li>
</ul>
<p>Milvus 还在<a href="https://zilliz.com/cloud">Ziliz Cloud</a> 上提供全面托管服务，无后顾之忧，速度比 Milvus 快 10 倍。</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">比较：Milvus 与 HNSWlib 的比较</h3><table>
<thead>
<tr><th style="text-align:center"><strong>特点</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">可扩展性</td><td style="text-align:center">轻松处理数十亿向量</td><td style="text-align:center">由于使用 RAM，适合较小的数据集</td></tr>
<tr><td style="text-align:center">适用于</td><td style="text-align:center">原型开发、实验和企业级应用</td><td style="text-align:center">专注于原型和轻量级 ANN 任务</td></tr>
<tr><td style="text-align:center">索引</td><td style="text-align:center">支持 10 多种索引算法，包括 HNSW、DiskANN、量化和二进制算法</td><td style="text-align:center">仅使用基于图的 HNSW</td></tr>
<tr><td style="text-align:center">集成</td><td style="text-align:center">提供 API 和云原生服务</td><td style="text-align:center">作为轻量级独立库使用</td></tr>
<tr><td style="text-align:center">性能</td><td style="text-align:center">针对大型数据和分布式查询进行优化</td><td style="text-align:center">提供高速度，但可扩展性有限</td></tr>
</tbody>
</table>
<p>总的来说，Milvus 通常适用于具有复杂索引需求的大规模生产级应用，而 HNSWlib 则是原型开发和更直接使用案例的理想选择。</p>
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
    </button></h2><p>语义搜索可能是资源密集型的，因此像HNSW这样的内部数据结构化对于加快数据检索至关重要。像HNSWlib这样的库关心的是实现，因此开发人员已经准备好了用于向量功能原型的配方。只需几行代码，我们就能建立自己的索引并执行搜索。</p>
<p>HNSWlib 是一个很好的入门工具。不过，如果您想构建复杂且可投入生产的人工智能应用，专门构建的向量数据库是最佳选择。例如，<a href="https://milvus.io/">Milvus</a>是一个开源向量数据库，具有高速向量搜索、可扩展性、可用性以及数据类型和编程语言的灵活性等许多企业就绪的功能。</p>
<h2 id="Further-Reading" class="common-anchor-header">更多阅读<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">什么是 Faiss（Facebook 人工智能相似性搜索）？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">什么是 HNSWlib？基于图形的快速 ANN 搜索库 </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">什么是 ScaNN（可扩展近邻）？ </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench：开源 VectorDB 基准工具</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">生成式人工智能资源中心｜Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">什么是向量数据库及其工作原理？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">什么是 RAG？ </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">为您的 GenAI 应用程序提供性能最佳的 AI 模型 | Zilliz</a></p></li>
</ul>
