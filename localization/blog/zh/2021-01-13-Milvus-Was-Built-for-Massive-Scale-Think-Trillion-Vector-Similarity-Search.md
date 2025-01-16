---
id: Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md
title: Milvus 专为大规模（万亿次）向量相似性搜索而设计
author: milvus
date: 2021-01-13T08:56:00.480Z
desc: 在下一个人工智能或机器学习项目中探索开源的力量。使用 Milvus 管理大规模向量数据并支持相似性搜索。
cover: assets.zilliz.com/1_9a6be0b54f.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search
---
<custom-h1>Milvus 专为大规模（万亿次）向量相似性搜索而设计</custom-h1><p>每天，由于公司无法理清自己的数据，浪费了无法估量的关键业务洞察力。据估计，文本、图像、视频和音频等非结构化数据占所有数据的 80%，但其中仅有 1% 得到了分析。幸运的是，<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f">人工智能（AI）</a>、开源软件和摩尔定律使机器规模的分析比以往任何时候都更容易实现。利用向量相似性搜索，可以从海量非结构化数据集中提取价值。这项技术包括将非结构化数据转换为特征向量，这是一种机器友好的数字数据格式，可以进行实时处理和分析。</p>
<p>向量相似性搜索的应用领域涵盖电子商务、安全、新药开发等。这些解决方案依赖于包含数百万、数十亿甚至数万亿向量的动态数据集，其实用性往往取决于是否能返回近乎即时的结果。<a href="https://milvus.io/">Milvus</a>是一个开源的向量数据管理解决方案，从底层开始构建，用于高效管理和搜索大型向量数据集。本文将介绍 Milvus 的向量数据管理方法，以及该平台如何针对向量相似性搜索进行优化。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#milvus-was-built-for-massive-scale-think-trillion-vector-similarity-search">Milvus 专为大规模（万亿次）向量相似性搜索而建</a><ul>
<li><a href="#lsm-trees-keep-dynamic-data-management-efficient-at-massive-scales">LSM 树使动态数据管理在大规模时保持高效</a>-<a href="#a-segment-of-10-dimensional-vectors-in-milvus"><em>Milvus 中的一段 10 维向量。</em></a></li>
<li><a href="#data-management-is-optimized-for-rapid-access-and-limited-fragmentation">数据管理经过优化，可实现快速访问和有限碎片化</a>-<a href="#an-illustration-of-inserting-vectors-in-milvus"><em>在 Milvus 中插入向量的示例</em></a>-<a href="#queried-data-files-before-the-merge"><em>合并前查询的数据文件</em></a>-<a href="#queried-data-files-after-the-merge"><em>合并后查询的数据文件。</em></a></li>
<li><a href="#similarity-searched-is-accelerated-by-indexing-vector-data">通过索引向量数据加速相似性搜索</a></li>
<li><a href="#learn-more-about-milvus">了解有关 Milvus 的更多信息</a></li>
</ul></li>
</ul>
<h3 id="LSM-trees-keep-dynamic-data-management-efficient-at-massive-scales" class="common-anchor-header">LSM 树使大规模动态数据管理保持高效</h3><p>为了提供高效的动态数据管理，Milvus 采用了日志结构合并树（LSM 树）数据结构。LSM 树非常适合访问插入和删除次数较多的数据。有关 LSM 树有助于确保高性能动态数据管理的具体属性的详细信息，请参阅其发明者发布的<a href="http://paperhub.s3.amazonaws.com/18e91eb4db2114a06ea614f0384f2784.pdf">原始研究</a>报告。LSM 树是<a href="https://cloud.google.com/bigtable">BigTable</a>、<a href="https://cassandra.apache.org/">Cassandra</a> 和<a href="https://rocksdb.org/">RocksDB</a> 等许多流行数据库使用的底层数据结构。</p>
<p>向量在 Milvus 中作为实体存在，并存储在段中。每个段包含从 1 到 ~8 百万个实体。每个实体都有唯一 ID 和向量输入字段，后者代表 1 到 32768 个维度。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_2_492d31c7a0.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_2.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_2.png" />
   </span> <span class="img-wrapper"> <span>博客_Milvus 专为大规模（万亿次）向量相似性搜索而建_2.png</span> </span></p>
<h3 id="Data-management-is-optimized-for-rapid-access-and-limited-fragmentation" class="common-anchor-header">优化数据管理，实现快速访问和有限碎片化</h3><p>收到插入请求时，Milvus 会将新数据<a href="https://milvus.io/docs/v0.11.0/write_ahead_log.md">写入超前写日志（WAL）</a>。请求成功记录到日志文件后，数据被写入可变缓冲区。最后，三个触发器之一会导致缓冲区不可变并刷新到磁盘：</p>
<ol>
<li><strong>定时间隔：</strong>数据会以定义的时间间隔（默认为 1 秒）定期刷新到磁盘。</li>
<li><strong>缓冲区大小：</strong>累积数据达到可变缓冲区的上限（128 MB）。</li>
<li><strong>手动触发：</strong>当客户端调用 flush 函数时，数据会被手动刷新到磁盘。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_3_852dc2c9bb.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_3.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_3.png" />
   </span> <span class="img-wrapper"> <span>博客_Milvus 为大规模（万亿次）向量相似性搜索而生_3.png</span> </span></p>
<p>用户可以一次添加数十或数百万个向量，在插入新向量时会生成不同大小的数据文件。这就造成了碎片化，会使数据管理复杂化，并减慢向量相似性搜索的速度。为防止数据过度碎片化，Milvus 会不断合并数据段，直到合并后的文件大小达到用户可配置的上限（如 1GB）。例如，在上限为 1 GB 的情况下，插入 1 亿个 512 维向量将只产生 ~200 个数据文件。</p>
<p>在增量计算场景中，向量的插入和搜索是同步进行的，Milvus 在将新插入的向量数据与其他数据合并之前，会立即将其用于搜索。数据合并后，原始数据文件将被移除，新创建的合并文件将被用于搜索。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_4_6bef3d914c.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_4.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_4.png" />
   </span> <span class="img-wrapper"> <span>博客_Milvus 专为大规模（万亿次）向量相似性搜索而建_4.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_5_3851c2d789.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_5.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_5.png" />
   </span> <span class="img-wrapper"> <span>博客_Milvus 是为大规模（Think Trillion）向量相似性搜索而建_5.png</span> </span></p>
<h3 id="Similarity-searched-is-accelerated-by-indexing-vector-data" class="common-anchor-header">通过索引向量数据加速相似性搜索</h3><p>默认情况下，Milvus 在查询向量数据时依靠暴力搜索。这种方法也称为穷举搜索，每次运行查询时都会检查所有向量数据。对于包含数百万或数十亿多维向量的数据集来说，这一过程过于缓慢，在大多数相似性搜索场景中都无法派上用场。为了帮助加快查询时间，可使用算法建立向量索引。对索引数据进行聚类，使相似向量靠得更近，从而使相似性搜索引擎只需查询全部数据中的一部分，在牺牲准确性的同时大幅缩短查询时间。</p>
<p>Milvus 支持的大多数向量索引类型都使用近似近邻（ANN）搜索算法。ANN 索引种类繁多，每种索引都需要在性能、准确性和存储要求之间做出权衡。Milvus 支持基于量化、图和树的索引，所有这些索引都服务于不同的应用场景。有关构建索引及其支持的特定向量索引类型的更多信息，请参阅 Milvus 的<a href="https://milvus.io/docs/v0.11.0/index.md#CPU">技术文档</a>。</p>
<p>索引构建会产生大量元数据。例如，对保存在 200 个数据文件中的 1 亿个 512 维向量建立索引，就会产生额外的 200 个索引文件。为了有效检查文件状态、删除或插入新文件，需要一个高效的元数据管理系统。Milvus 使用在线事务处理（OLTP），这是一种非常适合更新和/或删除数据库中少量数据的数据处理技术。Milvus 使用 SQLite 或 MySQL 管理元数据。</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">进一步了解 Milvus</h3><p>Milvus 是一个开源向量数据管理平台，目前正在 Linux 基金会的伞式组织<a href="https://lfaidata.foundation/">LF AI &amp; Data</a> 进行孵化。Milvus 于 2019 年由发起该项目的数据科学软件公司<a href="https://zilliz.com">Zilliz</a> 开源。有关 Milvus 的更多信息，可以在其<a href="https://milvus.io/">网站</a>上找到。如果您对向量相似性搜索感兴趣，或者对使用人工智能发掘非结构化数据的潜力感兴趣，请加入我们在 GitHub 上的<a href="https://github.com/milvus-io">开源社区</a>。</p>
