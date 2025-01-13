---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: 与Milvus一起制作小米手机浏览器内的人工智能新闻推荐
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: 了解小米如何利用人工智能和 Milvus 构建智能新闻推荐系统，能够为其移动网络浏览器的用户找到最相关的内容。
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>与 Milvus 一起制作：小米手机浏览器内的人工智能新闻推荐</custom-h1><p>从社交媒体到 Spotify 上的播放列表推荐，<a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">人工智能</a>已经在我们每天看到的内容和互动中扮演了重要角色。为了使自己的移动网络浏览器与众不同，跨国电子产品制造商小米公司打造了一个人工智能驱动的新闻推荐引擎。<a href="https://milvus.io/">Milvus</a> 是专为相似性搜索和人工智能而构建的开源向量数据库，被用作该应用的核心数据管理平台。本文介绍了小米如何构建人工智能驱动的新闻推荐引擎，以及如何使用 Milvus 和其他人工智能算法。</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">利用人工智能推荐个性化内容，消除新闻噪音</h3><p>仅《纽约时报》每天发布的内容就超过<a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 篇</a>，庞大的文章数量使个人无法全面了解所有新闻。为了帮助筛选大量内容，推荐最相关或最有趣的文章，我们越来越多地求助于人工智能。尽管推荐工作远非完美，但要从日益复杂和相互关联的世界中源源不断地获取新信息，机器学习越来越有必要。</p>
<p>小米公司生产并投资了智能手机、移动应用程序、笔记本电脑、家用电器等众多产品。在公司每季度销售的 4000 多万部智能手机中，许多手机都预装了小米浏览器，为了使其与众不同，小米在浏览器中内置了新闻推荐系统。当用户启动小米手机浏览器时，人工智能会根据用户的搜索历史、兴趣等推荐类似的内容。Milvus 是一个开源的向量相似性搜索数据库，用于加速检索相关文章。</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">人工智能驱动的内容推荐是如何工作的？</h3><p>新闻推荐（或任何其他类型的内容推荐系统）的核心是将输入数据与海量数据库进行比较，以找到相似信息。成功的内容推荐需要在相关性和及时性之间取得平衡，并有效地整合海量新数据--通常是实时的。</p>
<p>为了适应海量数据集，推荐系统通常分为两个阶段：</p>
<ol>
<li><strong>检索</strong>：在检索过程中，根据用户的兴趣和行为从更广泛的资料库中筛选内容。在小米手机浏览器中，从包含数百万篇新闻文章的海量数据集中挑选出数千篇内容。</li>
<li><strong>排序</strong>：接下来，在检索过程中选择的内容会根据某些指标进行排序，然后再推送给用户。当用户使用推荐内容时，系统会进行实时调整，以提供更多相关建议。</li>
</ol>
<p>新闻内容推荐需要根据用户行为和最近发布的内容进行实时调整。此外，推荐的内容必须尽可能符合用户的兴趣和搜索意图。</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = 智能内容建议</h3><p>Milvus 是一个开源向量相似性搜索数据库，可与深度学习模型集成，为自然语言处理、身份验证等应用提供支持。Milvus 可为大型向量数据集编制索引，提高搜索效率，并支持各种流行的人工智能框架，简化机器学习应用的开发过程。这些特点使该平台成为存储和查询向量数据的理想选择，而向量数据是许多机器学习应用的重要组成部分。</p>
<p>小米选择 Milvus 为其智能新闻推荐系统管理向量数据，是因为它快速、可靠，而且只需最少的配置和维护。不过，Milvus 必须与人工智能算法配对，才能构建可部署的应用。小米选择了 BERT（双向编码器表征变换器的简称）作为其推荐引擎中的语言表征模型。BERT 可用作通用 NLU（自然语言理解）模型，可驱动多种不同的 NLP（自然语言处理）任务。其主要特点包括</p>
<ul>
<li>BERT 的 Sentence Transformers 用作算法的主要框架，能够捕捉句子内部和句子之间的显式和隐式关系。</li>
<li>多任务学习目标、屏蔽语言模型（MLM）和下一句预测（NSP）。</li>
<li>BERT 在数据量更大的情况下表现更好，并能通过充当转换矩阵来增强 Word2Vec 等其他自然语言处理技术。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>博客_小米_1.jpeg</span> </span></p>
<p><br/></p>
<p>BERT 的网络架构采用多层变换器结构，摒弃了传统的 RNN 和 CNN 神经网络。它的工作原理是通过注意力机制将任意位置的两个词之间的距离转换为一个词，从而解决了 NLP 领域长期存在的依赖性问题。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>博客-小米-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>博客-小米-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT 提供了一个简单模型和一个复杂模型。相应的超参数如下：BERT BASE：L = 12，H = 768，A = 12，总参数为 1.1 亿；BERT LARGE：L = 24，H = 1024，A = 16，总参数为 3.4 亿。</p>
<p>在上述超参数中，L 代表网络的层数（即 Transformer 块的数量），A 代表多头注意力（Multi-Head Attention）中的自注意力（self-Attention）数量，滤波器大小为 4H。</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">小米内容推荐系统</h3><p>基于小米浏览器的新闻推荐系统依赖于三个关键组件：向量化、ID 映射和近似近邻（ANN）服务。</p>
<p>向量化是将文章标题转换为一般句子向量的过程。小米推荐系统采用了基于 BERT 的 SimBert 模型。SimBert 是一个 12 层模型，隐藏大小为 768。Simbert 使用训练模型中文 L-12_H-768_A-12 进行持续训练（训练任务为 "度量学习 +UniLM"，已在 signle TITAN RTX 上使用 Adam 优化器训练了 117 万步（学习率 2e-6，批量大小 128）。简单地说，这是一个经过优化的 BERT 模型。</p>
<p>ANN 算法将向量化的文章标题与 Milvus 中存储的整个新闻库进行比较，然后为用户返回相似的内容。ID 映射用于获取相应文章的页面浏览量和点击量等相关信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>博客-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>存储在 Milvus 中为小米新闻推荐引擎提供动力的数据在不断更新，包括更多的文章和活动信息。当系统纳入新数据时，必须清除旧数据。在该系统中，前 T-1 天进行全面数据更新，随后 T 天进行增量更新。</p>
<p>在规定的时间间隔内，删除旧数据，并将 T-1 天内处理过的数据插入 Collections。在这里，新生成的数据被实时纳入。插入新数据后，Milvus 将进行相似性搜索。检索到的文章会再次根据点击率和其他因素进行排序，并向用户展示排名靠前的内容。在这样一个数据频繁更新、结果必须实时交付的场景中，Milvus 快速纳入和搜索新数据的能力使小米手机浏览器大幅加速新闻内容推荐成为可能。</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus 让向量相似性搜索更出色</h3><p>将数据向量化，然后计算向量之间的相似度是最常用的检索技术。基于 ANN 的向量相似性搜索引擎的兴起，大大提高了向量相似性计算的效率。与同类解决方案相比，Milvus 提供了优化的数据存储、丰富的 SDK 以及分布式版本，大大减少了构建检索层的工作量。此外，Milvus 活跃的开源社区是一个强大的资源，可以在出现问题时帮助答疑解惑、排除故障。</p>
<p>如果您想进一步了解向量相似性搜索和 Milvus，请查看以下资源：</p>
<ul>
<li>在 Github 上查看<a href="https://github.com/milvus-io/milvus">Milvus</a>。</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">矢量相似性搜索隐藏在众目睽睽之下</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">利用向量索引在真正的大数据上加速相似性搜索</a></li>
</ul>
<p>阅读其他<a href="https://zilliz.com/user-stories">用户故事</a>，了解用 Milvus 制作东西的更多信息。</p>
