---
id: Milvus-Is-an-Open-Source-Scalable-Vector-Database.md
title: Milvus 是一个开源可扩展向量数据库
author: milvus
date: 2021-01-13T07:46:40.506Z
desc: 利用 Milvus 构建强大的机器学习应用程序并管理大规模向量数据。
cover: assets.zilliz.com/milvus_5b2cdec665.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Milvus-Is-an-Open-Source-Scalable-Vector-Database'
---
<custom-h1>Milvus 是一个开源可扩展向量数据库</custom-h1><p>使用易于定义的标准搜索数据非常简单，例如按演员、导演、类型或发行日期查询电影数据库。关系数据库使用 SQL 等查询语言就能很好地完成这类基本搜索。但是，当搜索涉及复杂对象和更抽象的查询时，例如使用自然语言搜索视频流媒体库或视频剪辑，简单的相似性指标（如匹配标题或描述中的单词）就不够用了。</p>
<p><a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">人工智能（AI）</a>大大提高了计算机理解语言语义的能力，并帮助人们理解大量难以分析的非结构化数据集（如音频、视频、文档和社交媒体数据）。通过人工智能，Netflix 可以创建复杂的内容推荐引擎，谷歌用户可以通过图像搜索网络，制药公司也可以发现新药。</p>
<h3 id="The-challenge-of-searching-large-unstructured-datasets" class="common-anchor-header">搜索大型非结构化数据集的挑战</h3><p>这些技术壮举是通过使用人工智能算法将密集的非结构化数据转换成向量来实现的，向量是一种便于机器读取的数字数据格式。接下来，使用其他算法来计算特定搜索的向量之间的相似性。非结构化数据集体积庞大，对于大多数机器学习应用来说，搜索整个数据集耗时过长。为了克服这一问题，近似近邻（ANN）算法被用来将相似向量聚类在一起，然后只搜索数据集中最有可能包含与目标搜索向量相似的向量的部分。</p>
<p>这使得相似性搜索的<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">速度大大加快</a>（尽管准确性略低），是构建有用的人工智能工具的关键。得益于庞大的公共资源，构建机器学习应用变得前所未有的容易和便宜。然而，人工智能驱动的向量相似性搜索往往需要交错使用不同的工具，这些工具的数量和复杂程度因具体项目要求而异。Milvus 是一个开源 AI 搜索引擎，旨在通过在统一平台下提供强大的功能来简化构建机器学习应用的过程。</p>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvus 是什么？</h3><p><a href="https://milvus.io/">Milvus</a>是一个开源数据管理平台，专为大规模向量数据和简化机器学习操作（MLOps）而建。Milvus 由 Facebook AI Similarity Search（Faiss）、Non-Metric Space Library（NMSLIB）和 Annoy 提供支持，它将各种强大的工具集中到一个地方，同时扩展了它们的独立功能。该系统专为存储、处理和分析大型向量数据集而构建，可用于构建涵盖计算机视觉、推荐引擎等的人工智能应用。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Is_an_Open_Source_Scalable_AI_Search_Engine_1_997255eb27.jpg" alt="Blog_Milvus Is an Open-Source Scalable AI Search Engine_1.jpg" class="doc-image" id="blog_milvus-is-an-open-source-scalable-ai-search-engine_1.jpg" />
   </span> <span class="img-wrapper"> <span>博客_Milvus 是一个开源的可扩展人工智能搜索引擎_1.jpg</span> </span></p>
<h3 id="Milvus-was-made-to-power-vector-similarity-search" class="common-anchor-header">Milvus 专为向量相似性搜索而设计</h3><p>Milvus 的设计非常灵活，允许开发人员针对自己的特定用例优化平台。它支持纯 CPU/GPU 和异构计算，因此可以加速数据处理并优化任何场景的资源需求。数据以分布式架构存储在 Milvus 中，使得扩展数据量变得轻而易举。Milvus 支持各种人工智能模型、编程语言（如 C++、Java 和 Python）和处理器类型（如 x86、ARM、GPU、TPU 和 FPGA），可与各种硬件和软件高度兼容。</p>
<p>有关 Milvus 的更多信息，请查看以下资源：</p>
<ul>
<li>探索 Milvus 的<a href="https://milvus.io/">技术文档</a>，了解该平台的内部运作。</li>
<li>通过<a href="https://tutorials.milvus.io/">Milvus 教程</a>了解如何启动 Milvus、构建应用程序等。</li>
<li>在<a href="https://github.com/milvus-io">GitHub</a> 上为项目做出贡献，并参与 Milvus 的开源社区。</li>
</ul>
