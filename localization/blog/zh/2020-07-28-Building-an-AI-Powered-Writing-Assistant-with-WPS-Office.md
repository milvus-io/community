---
id: Building-an-AI-Powered-Writing-Assistant-with-WPS-Office.md
title: 为 WPS Office 打造人工智能写作助手
author: milvus
date: 2020-07-28T03:35:40.105Z
desc: 了解金山如何利用开源相似性搜索引擎 Milvus 为 WPS Office 的人工智能写作助手打造推荐引擎。
cover: assets.zilliz.com/wps_thumbnail_6cb7876963.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office
---
<custom-h1>为 WPS Office 打造人工智能写作助手</custom-h1><p>WPS Office 是金山软件开发的一款生产力工具，全球用户超过 1.5 亿。公司的人工智能（AI）部门利用意图识别和文本聚类等语义匹配算法，从零开始打造了一款智能写作助手。该工具既是网络应用程序，也是<a href="https://walkthechat.com/wechat-mini-programs-simple-introduction/">微信小程序</a>，用户只需输入标题和最多五个关键词，就能快速创建提纲、单个段落和整篇文档。</p>
<p>写作助手的推荐引擎使用了开源相似性搜索引擎 Milvus，为其核心向量处理模块提供动力。下面我们将探讨 WPS Offices 智能写作助手的构建过程，包括如何从非结构化数据中提取特征，以及 Milvus 在存储数据和为工具的推荐引擎提供动力方面发挥的作用。</p>
<p>跳转到</p>
<ul>
<li><a href="#building-an-ai-powered-writing-assistant-for-wps-office">为 WPS Office 打造人工智能写作助手</a><ul>
<li><a href="#making-sense-of-unstructured-textual-data">理解非结构化文本数据</a></li>
<li><a href="#using-the-tfidf-model-to-maximize-feature-extraction">使用 TFIDF 模型最大限度地提取特征</a></li>
<li><a href="#extracting-features-with-the-bi-directional-lstm-cnns-crf-deep-learning-model">使用双向 LSTM-CNNs-CRF 深度学习模型提取特征</a></li>
<li><a href="#creating-sentence-embeddings-using-infersent">使用 Infersent 创建句子 Embeddings</a></li>
<li><a href="#storing-and-querying-vectors-with-milvus">使用 Milvus 存储和查询向量</a></li>
<li><a href="#ai-isnt-replacing-writers-its-helping-them-write">人工智能不是取代作家，而是帮助他们写作</a></li>
</ul></li>
</ul>
<h3 id="Making-sense-of-unstructured-textual-data" class="common-anchor-header">理解非结构化文本数据</h3><p>与任何值得解决的现代问题一样，构建 WPS 写作助手也是从混乱的数据开始的。准确地说，我们必须从数以千万计的密集文本文档中提取有意义的特征。要理解这个问题的复杂性，可以考虑一下来自不同新闻机构的两名记者是如何报道同一个话题的。</p>
<p>虽然两人都会遵守规范句子结构的规则、原则和流程，但他们会选择不同的词语，创造长短不一的句子，并使用各自的文章结构来讲述相似（或可能不同）的故事。与具有固定维数的结构化数据集不同，文本体本质上缺乏结构性，因为支配它们的语法具有很强的可塑性。为了找到意义，必须从非结构化文档语料库中提取机器可读特征。但首先，必须对数据进行清理。</p>
<p>清理文本数据的方法有很多，本文将不作深入介绍。不过，这是处理数据前的一个重要步骤，可包括去除标记、去除重音字符、扩展缩略词、去除特殊字符、去除停止词等。有关预处理和清理文本数据方法的详细说明，请<a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">点击此处</a>。</p>
<h3 id="Using-the-TFIDF-model-to-maximize-feature-extraction" class="common-anchor-header">使用 TFIDF 模型最大限度地提取特征</h3><p>为了开始理解非结构化文本数据，我们将词频-反向文档频率（TFIDF）模型应用于 WPS 写作助手提取的语料库。该模型使用词频和反文档频率这两个指标的组合，为文档中的每个词赋予一个 TFIDF 值。词频（TF）表示文档中某个词的原始计数除以文档中词的总数，而反向文档频率（IDF）则是语料库中的文档数除以某个词出现的文档数。</p>
<p>TF 和 IDF 的乘积可以衡量一个词在文档中出现的频率乘以该词在语料库中的唯一性。归根结底，TFIDF 值衡量的是一个词在文档 Collections 中与文档的相关程度。术语按照 TFIDF 值进行排序，在使用深度学习从语料库中提取特征时，可以降低那些低值术语（即常见词）的权重。</p>
<h3 id="Extracting-features-with-the-bi-directional-LSTM-CNNs-CRF-deep-learning-model" class="common-anchor-header">使用双向 LSTM-CNNs-CRF 深度学习模型提取特征</h3><p>利用双向长短期记忆（BLSTM）、卷积神经网络（CNN）和条件随机场（CRF）的组合，可以从语料库中提取单词和字符级表征。用于构建 WPS Office 写作助手的<a href="https://arxiv.org/pdf/1603.01354.pdf">BLSTM-CNNs-CRF 模型</a>的工作原理如下：</p>
<ol>
<li><strong>CNN：</strong>字符嵌入作为 CNN 的输入，然后提取语义相关的单词结构（即前缀或后缀）并编码为字符级表示向量。</li>
<li><strong>BLSTM：</strong>字符级向量与单词嵌入向量连接，然后输入 BLSTM 网络。每个序列都会向前和向后呈现两个独立的隐藏状态，以捕捉过去和未来的信息。</li>
<li><strong>CRF：</strong>BLSTM 的输出向量被送入 CRF 层，共同解码出最佳标签序列。</li>
</ol>
<p>现在，神经网络能够从非结构化文本中提取命名实体并对其进行分类。这一过程被称为<a href="https://en.wikipedia.org/wiki/Named-entity_recognition">命名实体识别（NER）</a>，涉及人名、机构、地理位置等类别的定位和分类。这些实体在分类和调用数据方面发挥着重要作用。从这里可以从语料库中提取关键句子、段落和摘要。</p>
<h3 id="Creating-sentence-embeddings-using-Infersent" class="common-anchor-header">使用 Infersent 创建句子嵌入</h3><p><a href="https://github.com/facebookresearch/InferSent">Infersent</a> 是 Facebook 设计的一种监督句子嵌入方法，可将完整句子嵌入向量空间，用于创建向量，并将其输入 Milvus 数据库。Infersent 使用斯坦福自然语言推理（SNLI）语料库进行训练，该语料库包含 570k 对由人类撰写和标注的句子。有关 Infersent 工作原理的更多信息，请<a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">点击此处</a>。</p>
<h3 id="Storing-and-querying-vectors-with-Milvus" class="common-anchor-header">使用 Milvus 存储和查询向量</h3><p><a href="https://www.milvus.io/">Milvus</a>是一个开源的相似性搜索引擎，支持添加、删除、更新和近实时搜索万亿字节规模的 Embeddings。为提高查询性能，Milvus 允许为每个向量字段指定索引类型。WPS Office 智能助手使用的是 IVF_FLAT 索引，这是最基本的反转文件（IVF）索引类型，其中 "flat "表示向量存储时没有压缩或量化。聚类是基于 IndexFlat2，它使用精确搜索 L2 距离。</p>
<p>虽然 IVF_FLAT 的查询召回率为 100%，但由于没有压缩，查询速度相对较慢。Milvus 的<a href="https://milvus.io/docs/manage-partitions.md">分区功能</a>用于根据预定义规则将数据划分到物理存储的多个部分，使查询更快、更准确。当向量被添加到 Milvus 时，标签会指定数据应被添加到哪个分区。向量数据的查询使用标签来指定查询应在哪个分区上执行。数据可以在每个分区中进一步细分，以进一步提高速度。</p>
<p>智能写作助手还使用 Kubernetes 集群，允许应用容器在多台机器和环境中运行，并使用 MySQL 进行元数据管理。</p>
<h3 id="AI-isn’t-replacing-writers-it’s-helping-them-write" class="common-anchor-header">人工智能不是取代写作者，而是帮助他们写作</h3><p>金山WPS Office的写作助手依靠Milvus来管理和查询200多万份文档的数据库。该系统高度灵活，能够在万亿规模的数据集上运行近乎实时的搜索。查询平均在 0.2 秒内完成，这意味着只需一个标题或几个关键词，就能几乎即时生成整篇文档。虽然人工智能不会取代专业作家，但当今的技术能够以新颖有趣的方式增强写作过程。未来尚不可知，但至少作家们可以期待更富有成效的、对某些人来说不那么困难的 "动笔写作 "方法。</p>
<p>本文采用了以下资料来源：</p>
<ul>
<li><a href="https://arxiv.org/pdf/1603.01354.pdf">"通过双向 LSTM-CNNs-CRF 进行端到端序列标注</a>》，Xuezhe Ma 和 Eduard Hovy。</li>
<li><a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">"文本数据的传统方法</a>》，Dipanjan (DJ) Sarkar。</li>
<li><a href="https://ieeexplore.ieee.org/document/8780663">"基于 TF-IDF 关联语义的文本特征提取</a>"，刘青、王静、张德海、杨云、王乃尧。</li>
<li><a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">"使用 Facebook 的 Infersent 理解句子嵌入</a>，"Rehan Ahmad</li>
<li><a href="https://arxiv.org/pdf/1705.02364.pdf">"从自然语言推理数据监督学习通用句子表示法</a>》，Alexis Conneau、Douwe Kiela、Holger Schwenk、LoÏc Barrault、Antoine Bordes.V1</li>
</ul>
<p>阅读其他<a href="https://zilliz.com/user-stories">用户故事</a>，了解更多使用 Milvus 制作的信息。</p>
