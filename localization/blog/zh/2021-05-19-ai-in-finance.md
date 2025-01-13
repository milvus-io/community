---
id: ai-in-.md
title: 利用开源向量数据库 Milvus 加速金融领域的人工智能发展
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: Milvus 可用于构建金融行业的人工智能应用，包括聊天机器人、推荐系统等。
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>利用开源向量数据库 Milvus 加速金融领域的人工智能发展</custom-h1><p>长期以来，银行和其他金融机构一直是用于大数据处理和分析的开源软件的早期采用者。2010 年，摩根士丹利<a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">开始使用</a>开源 Apache Hadoop 框架，作为小型实验的一部分。该公司一直在努力将传统数据库成功扩展到其科学家希望利用的海量数据，因此决定探索其他解决方案。现在，Hadoop 已成为摩根士丹利的主要工具，帮助管理从客户关系管理数据到投资组合分析的所有工作。其他开源关系数据库软件，如 MySQL、MongoDB 和 PostgreSQL，已经成为金融业理解大数据不可或缺的工具。</p>
<p>技术是金融服务业的竞争优势所在，而人工智能（AI）正迅速成为从大数据中提取有价值的见解并实时分析银行、资产管理和保险行业活动的标准方法。通过使用人工智能算法将图像、音频或视频等非结构化数据转换为向量（一种机器可读的数字数据格式），就可以在海量的百万、十亿甚至万亿向量数据集上运行相似性搜索。矢量数据存储在高维空间中，使用相似性搜索可以找到相似的矢量，这需要一个称为矢量数据库的专用基础设施。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a>是专为管理向量数据而构建的开源向量数据库，这意味着工程师和数据科学家可以专注于构建 AI 应用程序或进行分析--而不是底层数据基础设施。该平台围绕人工智能应用程序开发工作流而构建，并经过优化，可简化机器学习操作（MLOps）。有关 Milvus 及其底层技术的更多信息，请查看我们的<a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">博客</a>。</p>
<p>人工智能在金融服务行业的常见应用包括算法交易、投资组合构成和优化、模型验证、回溯测试、机器人咨询（Robo-advising）、虚拟客户助理、市场影响分析、监管合规和压力测试。本文将介绍利用向量数据作为银行和金融公司最宝贵资产之一的三个具体领域：</p>
<ol>
<li>利用银行聊天机器人提升客户体验</li>
<li>利用推荐系统促进金融服务销售和更多业务</li>
<li>利用语义文本挖掘分析收益报告和其他非结构化金融数据</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">利用银行聊天机器人提升客户体验</h3><p>银行聊天机器人可以帮助消费者选择投资、银行产品和保险政策，从而改善客户体验。数字服务正在迅速普及，部分原因是冠状病毒大流行加速了这一趋势。聊天机器人的工作原理是利用自然语言处理（NLP）将用户提交的问题转换成语义向量，从而搜索匹配的答案。现代银行聊天机器人为用户提供个性化的自然体验，并以对话的口吻说话。Milvus 提供的数据结构非常适合使用实时向量相似性搜索创建聊天机器人。</p>
<p>请观看我们的演示，了解<a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">用 Milvus</a> 构建<a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">聊天机器人的</a>更多信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">利用推荐系统促进金融服务销售等：</h4><p>私人银行业使用推荐系统，通过基于客户资料的个性化推荐来提高金融产品的销售额。推荐系统还可用于金融研究、商业新闻、股票选择和交易支持系统。得益于深度学习模型，每个用户和项目都被描述为一个 Embeddings 向量。向量数据库提供了一个嵌入空间，可以计算用户和项目之间的相似性。</p>
<p>从我们的<a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">演示</a>中了解更多有关 Milvus 基于图的推荐系统的信息。</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">利用语义文本挖掘分析收益报告和其他非结构化金融数据：</h4><p>文本挖掘技术对金融业产生了重大影响。随着金融数据呈指数级增长，文本挖掘已成为金融领域的一个重要研究领域。</p>
<p>目前，深度学习模型被应用于通过能够捕捉众多语义方面的单词向量来表示金融报告。像 Milvus 这样的向量数据库能够存储来自数百万份报告的海量语义词向量，然后在几毫秒内对其进行相似性搜索。</p>
<p>进一步了解如何将<a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">deepset 的 HayStack 与 Milvus 结合使用</a>。</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">不做陌生人</h3><ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上查找 Milvus 或为其做出贡献。</li>
<li>通过<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 与社区互动。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上与我们联系。</li>
</ul>
