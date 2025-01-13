---
id: Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md
title: 得益于 Milvus，任何人都可以建立一个包含 10 多亿张图片的向量数据库
author: milvus
date: 2020-11-11T07:13:02.135Z
desc: 通过人工智能和开源软件，只需一台服务器和 10 行代码就能建立一个反向图像搜索引擎。利用开源向量数据管理平台 Milvus 实时搜索 10 多亿张图片等。
cover: assets.zilliz.com/build_search_9299109ca7.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images
---
<custom-h1>得益于 Milvus，任何人都可以为 10 多亿张图片建立向量数据库</custom-h1><p>计算能力的不断提高和计算成本的不断降低，使得机器级分析和人工智能（AI）比以往任何时候都更容易实现。在实践中，这意味着只需一台服务器和 10 行代码，就可以建立一个能够实时查询 10 多亿张图片的反向图片搜索引擎。本文介绍了如何利用开源向量数据管理平台<a href="https://milvus.io/">Milvus</a> 创建强大的非结构化数据处理和分析系统，以及使这一切成为可能的底层技术。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#thanks-to-milvus-anyone-can-build-a-vector-database-for-1-billion-images">得益于 Milvus，任何人都可以为 10 多亿张图片建立向量数据库</a><ul>
<li><a href="#how-does-ai-enable-unstructured-data-analytics">人工智能如何实现非结构化数据分析？</a></li>
<li><a href="#neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors">神经网络将非结构化数据转换为计算机友好的特征向量</a>-<a href="#ai-algorithms-convert-unstructured-data-to-vectors"><em>AI 算法将非结构化数据转换为向量</em></a></li>
<li><a href="#what-are-vector-data-management-platforms">什么是向量数据管理平台？</a></li>
<li><a href="#what-are-limitations-of-existing-approaches-to-vector-data-management">现有的向量数据管理方法有哪些局限性？</a> <a href="#an-overview-of-milvus-architecture"><em>- 概述 Milvus 的架构。</em></a></li>
<li><a href="#what-are-applications-for-vector-data-management-platforms-and-vector-similarity-search">向量数据管理平台和向量相似性搜索有哪些应用？</a></li>
<li><a href="#reverse-image-search">反向图像搜索</a>--<a href="#googles-search-by-image-feature"><em>谷歌的 "图像搜索 "功能。</em></a><ul>
<li><a href="#video-recommendation-systems">视频推荐系统</a></li>
<li><a href="#natural-language-processing-nlp">自然语言处理（NLP）</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus">了解有关 Milvus 的更多信息</a></li>
</ul></li>
</ul>
<h3 id="How-does-AI-enable-unstructured-data-analytics" class="common-anchor-header">人工智能如何实现非结构化数据分析？</h3><p>一个经常被引用的统计数字是，世界上 80% 的数据是非结构化数据，但只有 1% 的数据得到了分析。非结构化数据，包括图像、视频、音频和自然语言，并不遵循预定义的模型或组织方式。这就给处理和分析大型非结构化数据集带来了困难。随着智能手机和其他联网设备的普及，将非结构化数据的生产推向了新的高度，企业也越来越意识到从这些模糊信息中获得的洞察力有多么重要。</p>
<p>几十年来，计算机科学家已经开发出了专门用于组织、搜索和分析特定数据类型的索引算法。对于结构化数据，有位图法、哈希表法和 B 树法，这些算法通常用于甲骨文和 IBM 等科技巨头开发的关系数据库中。对于半结构化数据，倒排索引算法是标准算法，可在<a href="http://www.solrtutorial.com/basic-solr-concepts.html">Solr</a>和<a href="https://www.elastic.co/blog/found-elasticsearch-from-the-bottom-up#inverted-indexes-and-index-terms">ElasticSearch</a> 等流行搜索引擎中找到。然而，非结构化数据索引算法依赖于计算密集型人工智能，而人工智能在过去十年中才得到广泛应用。</p>
<h3 id="Neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors" class="common-anchor-header">神经网络将非结构化数据转换为计算机友好的特征向量</h3><p>利用神经网络（如<a href="https://en.wikipedia.org/wiki/Convolutional_neural_network">CNN</a>、<a href="https://en.wikipedia.org/wiki/Recurrent_neural_network">RNN</a> 和<a href="https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270">BERT</a>）可将非结构化数据转换为特征向量（又称 Embeddings），即一串整数或浮点数。这种数字数据格式更易于机器处理和分析。通过将非结构化数据嵌入到特征向量中，然后使用欧氏距离或余弦相似度等度量计算向量之间的相似性，可以建立起涵盖反向图像搜索、视频搜索、自然语言处理（NLP）等领域的应用。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_2_db8c16aea4.jpeg" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_2.jpeg" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_2.jpeg" />
   </span> <span class="img-wrapper"> <span>博客_得益于人工智能，任何人都能为十亿多张图片构建搜索引擎_2.jpeg</span> </span></p>
<p>计算向量相似性是一个相对简单的过程，它依赖于成熟的算法。然而，非结构化数据集即使在转换成特征向量后，通常也比传统的结构化和半结构化数据集大几个数量级。向量相似性搜索因高效、准确地查询大规模非结构化数据所需的存储空间和计算能力而变得复杂。 不过，如果可以牺牲一定程度的准确性，有各种近似近邻（ANN）搜索算法可以大幅提高高维度大规模数据集的查询效率。这些 ANN 算法通过将相似向量聚类在一起，降低了存储需求和计算负荷，从而加快了向量搜索速度。常用的算法包括树型、图型和组合 ANN。</p>
<h3 id="What-are-vector-data-management-platforms" class="common-anchor-header">什么是向量数据管理平台？</h3><p>向量数据管理平台是专门为存储、处理和分析海量向量数据集而设计的应用程序。这些工具旨在方便地与海量数据对接，并包含简化向量数据管理的功能。遗憾的是，既灵活又强大到足以解决现代大数据挑战的系统却寥寥无几。Milvus是由<a href="https://zilliz.com/">Zilliz</a>发起并于2019年以开源许可方式发布的矢量数据管理平台，它试图填补这一空白。</p>
<h3 id="What-are-limitations-of-existing-approaches-to-vector-data-management" class="common-anchor-header">现有的向量数据管理方法有哪些局限性？</h3><p>构建非结构化数据分析系统的常见方法是将 ANN 等算法与 Facebook AI Similarity Search（Faiss）等开源实现库配对使用。由于存在一些局限性，这些算法库组合并不等同于 Milvus 这样的完整向量数据管理系统。用于管理向量数据的现有技术面临以下问题：</p>
<ol>
<li><strong>灵活性：</strong>默认情况下，现有系统通常将所有数据存储在主内存中，这意味着它们无法在多台机器上运行，也不适合处理海量数据集。</li>
<li><strong>动态数据处理：</strong>数据一旦输入现有系统，通常会被假定为静态数据，从而使动态数据的处理复杂化，无法进行近乎实时的搜索。</li>
<li><strong>高级查询处理：</strong>大多数工具不支持高级查询处理（如属性过滤和多向量查询），而这对于建立有用的相似性搜索引擎至关重要。</li>
<li><strong>异构计算优化：</strong>很少有平台能同时为 CPU 和 GPU（不包括 Faiss）上的异构系统架构提供优化，从而导致效率损失。</li>
</ol>
<p>Milvus 试图克服所有这些限制。该系统通过提供对各种应用接口（包括 Python、Java、Go、C++ 和 RESTful API 的 SDK）、多种向量索引类型（如基于量化的索引和基于图的索引）以及高级查询处理的支持，增强了灵活性。Milvus 使用日志结构合并树（LSM 树）处理动态向量数据，保持数据插入和删除的高效性，并使搜索实时进行。Milvus 还为现代 CPU 和 GPU 上的异构计算架构提供优化，允许开发人员针对特定场景、数据集和应用环境调整系统。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_3_380e31d32c.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_3.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_3.png" />
   </span> <span class="img-wrapper"> <span>博客_得益于人工智能，任何人都能为 10 多亿张图片构建搜索引擎_3.png</span> </span></p>
<p>利用各种 ANN 索引技术，Milvus 能够达到 99% 的前五名召回率。该系统每分钟还能加载 100 多万个数据条目。因此，在对 10 亿张图片进行反向图片搜索时，查询时间不到一秒。Milvus Distributed 是一个云本地应用程序，可以作为部署在多个节点上的分布式系统进行操作，因此可以在包含 100 亿甚至 1000 亿张图片的数据集上轻松可靠地实现类似的性能。此外，该系统不仅限于图像数据，其应用范围还包括计算机视觉、对话式人工智能、推荐系统、新药发现等。</p>
<h3 id="What-are-applications-for-vector-data-management-platforms-and-vector-similarity-search" class="common-anchor-header">向量数据管理平台和向量相似性搜索有哪些应用？</h3><p>如上所述，Milvus 这样功能强大的向量数据管理平台与近似近邻算法搭配，可以在海量非结构化数据上进行相似性搜索。这项技术可用于开发各种领域的应用。下面，我们将简要介绍向量数据管理工具和向量相似性搜索的几种常见用例。</p>
<h3 id="Reverse-image-search" class="common-anchor-header">反向图像搜索</h3><p>谷歌等主要搜索引擎已经为用户提供了通过图像搜索的选项。此外，电子商务平台也意识到了这一功能为网上购物者带来的好处，亚马逊就将图像搜索纳入了其智能手机应用程序。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_4_7884aabcd8.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_4.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_4.png" />
   </span> <span class="img-wrapper"> <span>博客_得益于人工智能，任何人都能为十亿多张图片构建搜索引擎_4.png</span> </span></p>
<p>Milvus 等开源软件使任何企业都有可能创建自己的反向图像搜索系统，从而降低了这一需求日益增长的功能的准入门槛。开发人员可以使用预先训练好的人工智能模型将自己的图像数据集转换成向量，然后利用 Milvus 实现通过图像搜索类似产品。</p>
<h4 id="Video-recommendation-systems" class="common-anchor-header">视频推荐系统</h4><p>YouTube 等大型在线视频平台<a href="https://www.tubefilter.com/2019/05/07/number-hours-video-uploaded-to-youtube-per-minute/">每分钟</a>接收<a href="https://www.tubefilter.com/2019/05/07/number-hours-video-uploaded-to-youtube-per-minute/">500 小时的用户生成内容</a>，因此在内容推荐方面有着独特的需求。为了在考虑到新上传内容的情况下进行相关的实时推荐，视频推荐系统必须提供快如闪电的查询时间和高效的动态数据处理。通过将关键帧转换成向量，然后将结果输入 Milvus，可以近乎实时地搜索和推荐数十亿部视频。</p>
<h4 id="Natural-language-processing-NLP" class="common-anchor-header">自然语言处理（NLP）</h4><p>自然语言处理是人工智能的一个分支，旨在建立能够解释人类语言的系统。在将文本数据转换为向量后，Milvus 可用于快速识别和删除重复文本，为语义搜索提供动力，甚至<a href="https://medium.com/unstructured-data-service/how-artificial-intelligence-empowered-professional-writing-f433c7e5b561%22%20/">构建一个智能写作助手</a>。有效的向量数据管理平台有助于最大限度地发挥任何 NLP 系统的效用。</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">进一步了解 Milvus</h3><p>如果您想进一步了解 Milvus，请访问我们的<a href="https://milvus.io/">网站</a>。此外，我们的<a href="https://github.com/milvus-io/bootcamp">启动营</a>提供了多个教程，其中包括设置 Milvus、基准测试和构建各种不同应用程序的说明。如果您对向量数据管理、人工智能和大数据挑战感兴趣，请加入我们在<a href="https://github.com/milvus-io">GitHub</a>上的开源社区，并在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上与我们聊天。</p>
<p>想了解有关构建图像搜索系统的更多信息？查看本案例研究：</p>
<ul>
<li><a href="https://medium.com/vector-database/the-journey-to-optimize-billion-scale-image-search-part-1-a270c519246d">亿级图像搜索优化之旅 (1/2)</a></li>
<li><a href="https://medium.com/unstructured-data-service/the-journey-to-optimizing-billion-scale-image-search-2-2-572a36d5d0d">优化十亿级图像搜索之旅（2/2）</a></li>
</ul>
