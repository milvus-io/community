---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: 利用向量索引加速海量数据的相似性搜索
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: 如果没有向量索引，许多现代人工智能应用的速度会慢得无法想象。了解如何为您的下一个机器学习应用选择合适的索引。
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>利用向量索引加速海量数据的相似性搜索</custom-h1><p>从计算机视觉到新药发现，向量相似性搜索引擎为许多流行的人工智能（AI）应用提供了动力。要想高效地查询相似性搜索引擎所依赖的百万、十亿甚至万亿向量数据集，其中一个重要的组成部分就是索引，这是一个组织数据的过程，可以大大加快大数据搜索的速度。本文将介绍索引在提高向量相似性搜索效率方面所起的作用、不同的向量反转文件（IVF）索引类型，以及在不同场景下使用哪种索引的建议。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">利用向量索引加速真正海量数据的相似性搜索</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">向量索引如何加速相似性搜索和机器学习？</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">有哪些不同类型的 IVF 索引，它们最适合哪些应用场景？</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">平面：适用于搜索相对较小（百万级）的数据集，要求100%的召回率。</a><ul>
<li><a href="#flat-performance-test-results">FLAT 性能测试结果：</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Milvus 中 FLAT 索引的查询时间测试结果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways">主要启示</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT：以牺牲准确性为代价提高速度（反之亦然）。</a><ul>
<li><a href="#ivf_flat-performance-test-results">IVF_FLAT 性能测试结果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Milvus 中 IVF_FLAT 索引的查询时间测试结果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">主要启示</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Milvus 中 IVF_FLAT 索引的召回率测试结果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">主要启示</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8：比 IVF_FLAT 更快，对资源的需求更少，但准确性也更低。</a><ul>
<li><a href="#ivf_sq8-performance-test-results">IVF_SQ8 性能测试结果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Milvus 中 IVF_SQ8 索引的查询时间测试结果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">主要启示</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Milvus 中 IVF_SQ8 索引的召回率测试结果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">主要启示</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H：新的 GPU/CPU 混合方法，比 IVF_SQ8 更快。</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">IVF_SQ8H 性能测试结果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Milvus 中 IVF_SQ8H 索引的查询时间测试结果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">主要收获：</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">进一步了解大规模向量数据管理平台 Milvus。</a></li>
<li><a href="#methodology">方法论</a><ul>
<li><a href="#performance-testing-environment">性能测试环境</a></li>
<li><a href="#relevant-technical-concepts">相关技术概念</a></li>
<li><a href="#resources">资源</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">向量索引如何加速相似性搜索和机器学习？</h3><p>相似性搜索引擎的工作原理是将输入数据与数据库进行比较，找出与输入数据最相似的对象。索引是有效组织数据的过程，它通过显著加快大型数据集上耗时的查询，在使相似性搜索变得有用方面发挥着重要作用。在对海量向量数据集进行索引后，查询可以被路由到最有可能包含与输入查询相似的向量的数据集群或子集。在实践中，这意味着要牺牲一定程度的准确性，以加快对真正大型向量数据的查询。</p>
<p>可以用字典来类比，字典中的单词是按字母顺序排序的。当查询一个单词时，可以快速浏览到只包含首字母相同的单词的部分--大大加快了对输入单词定义的搜索。</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">试管婴儿索引有哪些不同类型，它们最适合哪些情况？</h3><p>为高维向量相似性搜索而设计的索引有很多，每种索引都会在性能、准确性和存储要求方面有所权衡。本文将介绍几种常见的 IVF 索引类型、它们的优缺点以及每种索引类型的性能测试结果。性能测试量化了开源向量数据管理平台<a href="https://milvus.io/">Milvus</a> 中每种索引类型的查询时间和召回率。有关测试环境的更多信息，请参阅本文底部的方法论部分。</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">扁平：适合搜索要求 100%召回率的相对较小（百万级别）的数据集。</h3><p>对于要求完美准确性并依赖于相对较小（百万量级）数据集的向量相似性搜索应用来说，FLAT 索引是一个不错的选择。FLAT 不压缩向量，是唯一能保证精确搜索结果的索引。FLAT 的结果还可以作为其他召回率低于 100% 的索引所产生结果的比较点。</p>
<p>FLAT 之所以精确，是因为它采用了穷举搜索方法，这意味着每次查询都要将目标输入与数据集中的每个向量进行比较。这使得 FLAT 成为我们列表中速度最慢的索引，而且不适合查询海量向量数据。在 Milvus 中，FLAT 索引没有参数，使用它不需要数据训练或额外存储。</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">FLAT 性能测试结果：</h4><p>在 Milvus 中使用由 200 万个 128 维向量组成的数据集进行了 FLAT 查询时间性能测试。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>博客_利用向量索引加速真正大数据上的相似性搜索_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要启示</h4><ul>
<li>随着 nq（查询的目标向量数量）的增加，查询时间也会增加。</li>
<li>使用 Milvus 中的 FLAT 索引，我们可以看到，一旦 nq 超过 200，查询时间就会急剧上升。</li>
<li>一般来说，在 GPU 上运行 Milvus 与在 CPU 上运行 Milvus 相比，FLAT 索引的速度更快，一致性更好。不过，当 nq 低于 20 时，CPU 上的 FLAT 查询速度更快。</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT：以牺牲准确性为代价提高速度（反之亦然）。</h3><p>加速相似性搜索过程而牺牲准确性的常见方法是进行近似近邻（ANN）搜索。ANN 算法通过将相似向量聚类在一起来降低存储需求和计算负荷，从而加快向量搜索速度。IVF_FLAT 是最基本的反转文件索引类型，依赖于一种 ANN 搜索形式。</p>
<p>IVF_FLAT 将向量数据分成若干个聚类单元（nlist），然后比较目标输入向量与每个聚类中心之间的距离。根据系统设置查询的簇数（nprobe），相似性搜索结果将仅根据目标输入与最相似簇中向量的比较结果返回，从而大大缩短查询时间。</p>
<p>通过调整 nprobe，可以在特定情况下找到准确性和速度之间的理想平衡点。我们的 IVF_FLAT 性能测试结果表明，随着目标输入向量数（nq）和要搜索的簇数（nprobe）的增加，查询时间也会急剧增加。IVF_FLAT 不压缩向量数据，但索引文件包括元数据，与原始的非索引向量数据集相比，会略微增加存储需求。</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">IVF_FLAT 性能测试结果：</h4><p>在 Milvus 中使用公共 1B SIFT 数据集进行了 IVF_FLAT 查询时间性能测试，该数据集包含 10 亿个 128 维向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>博客_利用向量索引加速真正大数据上的相似性搜索_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要启示</h4><ul>
<li>在 CPU 上运行时，Milvus 中 IVF_FLAT 索引的查询时间随 nprobe 和 nq 的增加而增加。这意味着查询包含的输入向量越多，或者查询搜索的集群越多，查询时间就越长。</li>
<li>在 GPU 上，索引在 nq 和 nprobe 变化时显示的时间差异较小。这是因为索引数据量大，而将数据从 CPU 内存复制到 GPU 内存占了总查询时间的大部分。</li>
<li>在所有情况下，除了 nq = 1,000 和 nprobe = 32 时，IVF_FLAT 索引在 CPU 上运行时效率更高。</li>
</ul>
<p>IVF_FLAT 的召回性能测试是在 Milvus 中进行的，使用了包含 100 万个 128 维向量的公开 1M SIFT 数据集和包含 100 多万个 200 维向量的 glove-200-angular 数据集来构建索引（nlist = 16,384）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>博客_利用向量索引加速真正大数据上的相似性搜索_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要启示：</h4><ul>
<li>可以优化 IVF_FLAT 索引的准确性，当 nprobe = 256 时，1M SIFT 数据集的召回率超过 0.99。</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8：比 IVF_FLAT 更快，对资源的需求更少，但准确性也更低。</h3><p>IVF_FLAT 不进行任何压缩，因此它生成的索引文件大小与原始的无索引向量数据大致相同。例如，如果原始的 1B SIFT 数据集为 476 GB，那么其 IVF_FLAT 索引文件会稍大（~470 GB）。将所有索引文件加载到内存中将消耗 470 GB 的存储空间。</p>
<p>当磁盘、CPU 或 GPU 内存资源有限时，IVF_SQ8 是比 IVF_FLAT 更好的选择。这种索引类型可以通过执行标量量化将每个 FLOAT（4 字节）转换为 UINT8（1 字节）。这可将磁盘、CPU 和 GPU 内存消耗减少 70-75%。对于 1B SIFT 数据集，IVF_SQ8 索引文件只需要 140 GB 的存储空间。</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">IVF_SQ8 性能测试结果：</h4><p>IVF_SQ8 查询时间测试是在 Milvus 中进行的，使用的是包含 10 亿个 128 维向量的公开 1B SIFT 数据集来构建索引。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>博客_利用向量索引加速真正大数据上的相似性搜索_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要启示：</h4><ul>
<li>与 IVF_FLAT 相比，IVF_SQ8 通过减少索引文件大小显著提高了性能。IVF_SQ8 的性能曲线与 IVF_FLAT 相似，查询时间随 nq 和 nprobe 的增加而增加。</li>
<li>与 IVF_FLAT 类似，当在 CPU 上运行以及 nq 和 nprobe 较小时，IVF_SQ8 的性能更快。</li>
</ul>
<p>IVF_SQ8 的召回性能测试是在 Milvus 中进行的，使用了包含 100 万个 128 维向量的公开 1M SIFT 数据集和包含 100 多万个 200 维向量的 glove-200-angular 数据集来建立索引（nlist = 16,384）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>博客_利用向量索引加速真正大数据上的相似性搜索_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要启示</h4><ul>
<li>尽管压缩了原始数据，IVF_SQ8 的查询准确性并没有显著下降。在不同的 nprobe 设置下，IVF_SQ8 的召回率最多比 IVF_FLAT 低 1%。</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H：新的 GPU/CPU 混合方法，速度比 IVF_SQ8 更快。</h3><p>与 IVF_SQ8 相比，IVF_SQ8H 是一种能提高查询性能的新索引类型。当对运行在 CPU 上的 IVF_SQ8 索引进行查询时，总查询时间的大部分用于查找与目标输入向量最近的 nprobe 簇。为了缩短查询时间，IVF_SQ8 将比索引文件更小的粗量化器操作数据复制到 GPU 内存中--大大加快了粗量化器的操作速度。然后，gpu_search_threshold 决定由哪个设备运行查询。当 nq &gt;= gpu_search_threshold 时，GPU 运行查询；否则，CPU 运行查询。</p>
<p>IVF_SQ8H 是一种混合索引类型，需要 CPU 和 GPU 协同工作。它只能与支持 GPU 的 Milvus 一起使用。</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">IVF_SQ8H 性能测试结果：</h4><p>IVF_SQ8H 查询时间性能测试在 Milvus 中进行，使用公共 1B SIFT 数据集构建索引，该数据集包含 10 亿个 128 维向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>博客_利用向量索引加速真正大数据上的相似性搜索_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要启示</h4><ul>
<li>当 nq 小于或等于 1,000 时，IVF_SQ8H 的查询时间几乎是 IVFSQ8 的两倍。</li>
<li>当 nq = 2000 时，IVFSQ8H 和 IVF_SQ8 的查询时间相同。但是，如果 gpu_search_threshold 参数小于 2000，IVF_SQ8H 的性能将优于 IVF_SQ8。</li>
<li>IVF_SQ8H 的查询召回率与 IVF_SQ8 相同，这意味着在不损失搜索准确性的情况下减少了查询时间。</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">进一步了解大规模向量数据管理平台 Milvus。</h3><p>Milvus 是一个向量数据管理平台，可以为跨越人工智能、深度学习、传统向量计算等领域的相似性搜索应用提供动力。有关 Milvus 的更多信息，请查看以下资源：</p>
<ul>
<li>Milvus 在<a href="https://github.com/milvus-io/milvus">GitHub</a> 上以开源许可的方式提供。</li>
<li>Milvus 支持其他索引类型，包括基于图和树的索引。有关支持的索引类型的全面列表，请参阅 Milvus 中的<a href="https://milvus.io/docs/v0.11.0/index.md">向量索引文档</a>。</li>
<li>要了解有关推出 Milvus 的公司的更多信息，请访问<a href="https://zilliz.com/">Zilliz.com</a>。</li>
<li>与 Milvus 社区聊天，或在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上寻求问题帮助。</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">方法论</h3><h4 id="Performance-testing-environment" class="common-anchor-header">性能测试环境</h4><p>本文提及的性能测试所用服务器配置如下：</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz, 24 核</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 GB 内存</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">相关技术概念</h4><p>虽然不需要理解本文，但以下一些技术概念有助于解释我们的索引性能测试结果：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>博客_使用向量索引在真正的大数据上加速相似性搜索_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">资源</h4><p>本文使用了以下资源：</p>
<ul>
<li><a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">"数据库系统百科全书</a>》，Ling Liu 和 M. Tamer Özsu。</li>
</ul>
