---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: 利用 Milvus 注入人工智能的 Proptech 进行个性化房地产搜索
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: 人工智能正在改变房地产行业，了解智能物业技术如何加速房屋搜索和购买流程。
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>与 Milvus 合作：人工智能注入 Proptech，实现个性化房地产搜索</custom-h1><p>人工智能（AI）在房地产领域的<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">强大应用</a>正在改变房屋搜索流程。多年来，精通技术的房地产专业人士一直在利用人工智能，他们认识到人工智能能够帮助客户更快地找到合适的房屋，并简化购房流程。冠状病毒大流行<a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">加速了</a>全球对房地产技术（或称 Proptech）的兴趣、采用和投资，表明它将在房地产行业发挥越来越大的作用。</p>
<p>本文将探讨<a href="https://bj.ke.com/">北科公司</a>如何利用向量相似性搜索建立一个看房平台，以提供个性化的结果，并近乎实时地推荐房源。</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">什么是向量相似性搜索？</h3><p>向量<a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">相似性搜索</a>的应用横跨人工智能、深度学习和传统向量计算等多种场景。人工智能技术的普及在一定程度上归功于向量搜索及其对非结构化数据的理解能力，非结构化数据包括图像、视频、音频、行为数据、文档等。</p>
<p>据估计，非结构化数据占所有数据的 80-90%，从中提取洞察力正迅速成为企业在瞬息万变的世界中保持竞争力的必要条件。非结构化数据分析需求的不断增长、计算能力的不断提高以及计算成本的不断下降，使得人工智能支持的向量搜索比以往任何时候都更容易实现。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>传统上，非结构化数据由于不遵循预定义的模型或组织结构，一直是大规模处理和分析的难题。神经网络（如 CNN、RNN 和 BERT）使得将非结构化数据转换为特征向量成为可能，特征向量是一种数字数据格式，可以很容易地被计算机解读。然后使用算法，利用余弦相似度或欧氏距离等指标计算向量之间的相似度。</p>
<p>最终，向量相似性搜索是一个广义的术语，描述了在海量数据集中识别相似事物的技术。Beike 利用这一技术为智能家居搜索引擎提供动力，该引擎可根据个人用户的偏好、搜索历史和房产标准自动推荐房源，从而加快房地产搜索和购买过程。Milvus 是一个开源向量数据库，它将信息与算法连接起来，使 Beike 能够开发和管理其人工智能房地产平台。</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Milvus 如何管理向量数据？</h3><p>Milvus 是专为大规模向量数据管理而构建的，其应用范围涵盖图像和视频搜索、化学相似性分析、个性化推荐系统、对话式人工智能等。存储在 Milvus 中的向量数据集可以高效地进行查询，大多数实施方案都遵循这样的一般流程：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>Beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">北科如何利用 Milvus 让找房变得更智能？</h3><p>北科一般被称为中国的 Zillow，是一个允许房地产 Agents 列出出租或出售房产的在线平台。为了帮助改善找房者的找房体验，并帮助 Agents 更快地达成交易，该公司为其房源数据库建立了一个人工智能驱动的搜索引擎。Beike 的房地产房源数据库被转换成特征向量，然后输入 Milvus 进行索引和存储。然后，Milvus 根据输入的房源信息、搜索条件、用户资料或其他条件进行相似性搜索。</p>
<p>例如，在搜索与给定房源相似的更多房屋时，会提取楼层平面图、尺寸、朝向、内部装修、油漆颜色等特征。由于原始数据库中的房产列表数据已经<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">编制了索引</a>，因此只需几毫秒就能完成搜索。Beike 的最终产品在包含 300 多万个向量的数据集上的平均查询时间为 113 毫秒。不过，Milvus 能够在万亿规模的数据集上保持高效的速度，使这个相对较小的房地产数据库变得轻而易举。一般来说，该系统遵循以下流程：</p>
<ol>
<li><p>深度学习模型（如 CNN、RNN 或 BERT）将非结构化数据转换为特征向量，然后导入 Milvus。</p></li>
<li><p>Milvus 对特征向量进行存储和索引。</p></li>
<li><p>Milvus 根据用户查询返回相似性搜索结果。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>milvus-overview-diagram.png</span> </span></p>
<p><br/></p>
<p>Beike 的智能房地产搜索平台采用推荐算法，利用余弦距离计算向量相似度。该系统可根据最喜欢的房源和搜索条件找到相似的房屋。其工作原理大致如下：</p>
<ol>
<li><p>根据输入的房源信息，使用平面图、尺寸和朝向等特征来提取 4 个特征向量集合。</p></li>
<li><p>提取的特征集合用于在 Milvus 中执行相似性搜索。每个向量集合的查询结果是输入房源与其他类似房源之间相似性的度量。</p></li>
<li><p>对 4 个向量集合中每个集合的搜索结果进行比较，然后用于推荐类似的房屋。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>Beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p><br/></p>
<p>如上图所示，系统采用 A/B 表切换机制更新数据。Milvus 将前 T 天的数据存储在表 A 中，T+1 天开始将数据存储在表 B 中，2T+1 天开始重写表 A，以此类推。</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">想了解更多关于用 Milvus 制作东西的信息，请查看以下资源：</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">为 WPS Office 打造人工智能写作助手</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">用 Milvus 制作：小米手机浏览器内的 AI 驱动的新闻推荐</a></p></li>
</ul>
