---
id: diskann-explained.md
title: DiskANN 解释
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: 了解 DiskANN 如何使用 SSD 提供十亿规模的向量搜索，在低内存使用率、高精确度和可扩展性能之间实现平衡。
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">什么是 DiskANN？<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a>代表了一种改变<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性搜索</a>模式的方法。在此之前，大多数向量索引类型（如 HNSW）都严重依赖 RAM 来实现低延迟和高召回率。这种方法虽然对中等规模的数据集有效，但随着数据量的增长，其成本和可扩展性都会变得过高。DiskANN 利用固态硬盘来存储索引，大大降低了内存需求，从而提供了一种经济高效的替代方案。</p>
<p>DiskANN 采用扁平图结构，针对磁盘访问进行了优化，因此只需占用内存的一小部分，就能处理十亿规模的数据集。例如，DiskANN 可以索引多达 10 亿个向量，同时以 5ms 的延迟达到 95% 的搜索准确率，而基于 RAM 的算法在 1 亿到 2 亿个点时才能达到类似的性能峰值。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 1：使用 DiskANN 的向量索引和搜索工作流程</em></p>
<p>虽然与基于 RAM 的方法相比，DiskANN 可能会带来稍高的延迟，但考虑到可观的成本节约和可扩展性优势，这种权衡通常是可以接受的。DiskANN 尤其适用于需要在商品硬件上进行大规模向量搜索的应用。</p>
<p>本文将介绍 DiskANN 在利用 RAM 的同时，还利用固态硬盘并降低固态硬盘读取成本的巧妙方法。</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">DiskANN 如何工作？<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN 是一种基于图的向量搜索方法，与 HNSW 属于同一系列方法。我们首先构建一个搜索图，其中节点对应向量（或向量组），边表示一对向量在某种意义上 "相对接近"。典型的搜索是随机选择一个 "入口节点"，然后导航到与查询最接近的邻近节点，以贪婪的方式不断重复，直到达到局部最小值。</p>
<p>基于图的索引框架主要在构建搜索图和执行搜索的方式上有所不同。在本节中，我们将从技术上深入探讨 DiskANN 在这些步骤中的创新，以及它们如何实现低延迟、低内存性能。(参见上图摘要）。</p>
<h3 id="An-Overview" class="common-anchor-header">概述</h3><p>我们假设用户已经生成了一组文档向量嵌入。第一步是对嵌入进行聚类。使用 Vamana 算法（将在下一节中解释）分别为每个聚类构建搜索图，然后将结果合并为一个图。<em>创建最终搜索图的分而治之策略大大减少了内存使用量，同时也不会对搜索延迟或召回率造成太大影响。</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 2：DiskANN 如何跨 RAM 和 SSD 存储向量索引</em></p>
<p>生成全局搜索图后，它会与全精度向量嵌入一起存储在固态硬盘上。由于 SSD 的访问成本比 RAM 高，因此如何在一定的 SSD 读取次数内完成搜索是一大挑战。因此，我们使用了一些巧妙的技巧来限制读取次数：</p>
<p>首先，Vamana 算法鼓励缩短相近节点之间的路径，同时限制节点邻居的最大数量。其次，使用固定大小的数据结构来存储每个节点的 Embeddings 及其邻居（见上图）。这意味着，我们只需将数据结构的大小乘以节点的索引，并以此作为偏移量，同时获取节点的 embedding，就可以寻址节点的元数据。第三，由于固态硬盘的工作原理，我们可以在每次读取请求中获取多个节点（在我们的例子中是邻节点），从而进一步减少读取请求的次数。</p>
<p>另外，我们使用乘积量化技术压缩 Embeddings，并将其存储在 RAM 中。这样，我们就能将数十亿规模的向量数据集放入内存中，在单台机器上就能快速计算<em>近似向量相似度</em>，而无需读取磁盘。这为减少下一步在固态硬盘上访问的邻居节点数量提供了指导。不过，重要的是，搜索决策是使用<em>精确的向量相似度</em>做出的，并从 SSD 中检索完整的嵌入，这确保了更高的召回率。需要强调的是，搜索的初始阶段使用的是内存中的量化嵌入，随后的搜索使用的是从 SSD 中读取的较小的子集。</p>
<p>在上述描述中，我们忽略了两个重要的步骤：如何构建图，以及如何搜索图--也就是上面红框所示的两个步骤。让我们依次检查这两个步骤。</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">构建 "Vamana "图</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图"瓦马纳 "图构建</em></p>
<p>DiskANN 的作者开发了一种构建搜索图的新方法，他们称之为 Vamana 算法。它通过随机添加 O(N) 条边来初始化搜索图。这将产生一个 "连接良好 "的图，但无法保证贪婪搜索的收敛性。然后，它会以一种智能方式修剪和重新连接边，以确保有足够的长距离连接（见上图）。请允许我们详细说明：</p>
<h4 id="Initialization" class="common-anchor-header">初始化</h4><p>搜索图初始化为随机有向图，其中每个节点都有 R 个外邻。我们还会计算图的 medoid，即与其他所有点的平均距离最小的点。你可以将其视为类似于节点集合中的一个中心点。</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">搜索候选点</h4><p>初始化后，我们会遍历节点，每一步都会添加和删除边。首先，我们在选定的节点 p 上运行搜索算法，生成候选节点列表。搜索算法从 medoid 开始，贪婪地不断靠近所选节点，每一步都会添加迄今发现的最近节点的外邻。最后会返回最接近 p 的 L 个节点列表。(如果你对这一概念不熟悉，那么图的中间值就是与其他所有点的平均距离最小的点，类似于图的中心点）。</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">修剪和添加边</h4><p>节点的候选邻居按距离排序，对于每个候选邻居，算法都会检查其方向是否与已选择的邻居 "过于接近"。如果是，就对其进行修剪。这就促进了邻居之间的角度多样性，根据经验，这会带来更好的导航性能。在实践中，这意味着从随机节点开始的搜索可以通过探索稀疏的远距离和本地链接集，更快地到达任何目标节点。</p>
<p>修剪边缘后，沿着通往 p 的贪婪搜索路径添加边缘。修剪工作会进行两次，改变修剪的距离阈值，以便在第二次修剪时添加长距离边。</p>
<h2 id="What’s-Next" class="common-anchor-header">下一步工作<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>后续工作在 DiskANN 的基础上进行了更多改进。其中一个值得注意的例子是<a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>，它修改了方法，使索引在构建后可以轻松更新。这种搜索索引在性能标准之间进行了很好的权衡，在<a href="https://milvus.io/docs/overview.md">Milvus</a>向量数据库中可作为<code translate="no">DISKANN</code> 索引类型使用。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>您甚至可以调整 DiskANN 参数，如<code translate="no">MaxDegree</code> 和<code translate="no">BeamWidthRatio</code> ：详情请查看<a href="https://milvus.io/docs/disk_index.md#On-disk-Index">文档页面</a>。</p>
<h2 id="Resources" class="common-anchor-header">资源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Milvus 关于使用 DiskANN 的文档</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN：在单节点上进行快速精确的十亿点近邻搜索</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN：用于流式相似性搜索的基于图的快速准确 ANN 索引</a></p></li>
</ul>
