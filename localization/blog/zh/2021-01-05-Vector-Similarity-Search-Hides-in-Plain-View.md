---
id: Vector-Similarity-Search-Hides-in-Plain-View.md
title: 要了解有关向量相似性搜索的更多信息，请查看以下资源：
author: milvus
date: 2021-01-05T03:40:20.821Z
desc: 了解什么是向量相似性搜索、它的各种应用，以及让人工智能比以往任何时候都更容易获取的公共资源。
cover: assets.zilliz.com/plainview_703d8497ca.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View'
---
<custom-h1>向量相似性搜索隐藏在众目睽睽之下</custom-h1><p><a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#a291">人工智能（AI）</a>有可能改变最不起眼的事情的处理方式。例如，每年（在 COVID 之前）都有超过 73,000 人参加香港马拉松比赛。为了正确感知和记录所有参赛者的完赛时间，主办方会向每位参赛者分发 73,000 个 RFID 芯片计时器。芯片计时是一项复杂的工作，缺点显而易见。必须向计时公司购买或租用材料（芯片和电子读取设备），还必须在比赛当天设置一个登记区供选手收集芯片。此外，如果只在起点线和终点线安装传感器，不法选手就有可能绕道。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_1_e55c133e05.jpeg" alt="blog-1.jpeg" class="doc-image" id="blog-1.jpeg" />
   </span> <span class="img-wrapper"> <span>博客-1.jpeg</span> </span></p>
<p>现在试想一下，如果有一个<a href="https://cloud.google.com/video-intelligence">视频人工智能</a>应用，只需一张照片，就能从终点线捕捉到的画面中自动识别出各个选手。参赛选手只需在冲过终点线后通过应用程序上传一张自己的照片，而无需在每位参赛选手身上安装计时芯片。随即，就会提供个性化的精彩片段、比赛统计数据和其他相关信息。安装在比赛各点的摄像头可以捕捉到参赛者的更多镜头，确保每位选手都跑完全程。哪种解决方案看起来更容易实施、更具成本效益？</p>
<p>虽然香港马拉松赛并没有利用机器学习来取代计时芯片（目前还没有），但这个例子说明了人工智能可以极大地改变我们周围的一切。在比赛计时方面，它将数以万计的芯片减少到了几个与机器学习算法相匹配的摄像头。但视频人工智能只是向量相似性搜索的众多应用之一，向量相似性搜索是一个利用人工智能分析海量、万亿规模非结构化数据集的过程。本文概述了向量搜索技术，包括它是什么、如何使用以及使其比以往任何时候都更容易获取的开源软件和资源。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><p><a href="#what-is-vector-similarity-search">什么是向量相似性搜索？</a></p></li>
<li><p><a href="#what-are-some-applications-of-vector-similarity-search">向量相似性搜索有哪些应用？</a></p></li>
<li><p><a href="#open-source-vector-similarity-search-software-and-resources">开源向量相似性搜索软件和资源。</a></p></li>
</ul>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">什么是向量相似性搜索？</h3><p>视频数据非常详细，而且越来越常见，因此从逻辑上讲，它似乎是构建视频人工智能的绝佳无监督学习信号。但实际上并非如此。处理和分析视频数据，尤其是大量视频数据，仍然是<a href="https://arxiv.org/pdf/1905.11954.pdf">人工智能面临的</a>一项<a href="https://arxiv.org/pdf/1905.11954.pdf">挑战</a>。这一领域最近取得的进展，就像非结构化数据分析领域取得的大部分进展一样，在很大程度上要归功于向量相似性搜索。</p>
<p>与所有非结构化数据一样，视频的问题在于它不遵循预定义的模型或组织结构，因此很难进行大规模处理和分析。非结构化数据包括图像、音频、社交媒体行为和文档等，估计总共占所有数据的 80-90% 以上。公司越来越意识到，大量神秘的非结构化数据集中蕴藏着对业务至关重要的洞察力，这推动了对能够挖掘这些未实现潜力的人工智能应用的需求。</p>
<p>利用 CNN、RNN 和 BERT 等<a href="https://en.wikipedia.org/wiki/Neural_network">神经网络</a>，可以将非结构化数据转换为特征向量（又称 Embeddings），这是一种机器可读的数字数据格式。然后使用算法，利用余弦相似度或欧氏距离等度量来计算向量之间的相似度。向量 Embeddings 和相似性搜索使得使用以前无法辨别的数据集分析和构建机器学习应用成为可能。</p>
<p>向量相似性是通过既定算法计算出来的，然而，非结构化数据集通常是海量的。这意味着高效准确的搜索需要巨大的存储和计算能力。为了<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">加速相似性搜索</a>并减少资源需求，我们使用了近似近邻（ANN）搜索算法。通过将相似向量聚类在一起，ANN 算法可以将查询发送到最有可能包含相似向量的向量集群，而不是搜索整个数据集。虽然这种方法速度更快，但在一定程度上牺牲了准确性。利用 ANN 算法，向量搜索可以在毫秒级的时间内梳理数十亿个深度学习模型的见解。</p>
<h3 id="What-are-some-applications-of-vector-similarity-search" class="common-anchor-header">向量相似性搜索有哪些应用？</h3><p>向量相似性搜索的应用横跨人工智能、深度学习和传统向量计算等多种场景。下面将对各种向量相似性搜索应用进行高层次概述：</p>
<p><strong>电子商务：</strong>向量相似性搜索在电子商务中具有广泛的适用性，包括反向图像搜索引擎，购物者可以使用智能手机拍摄的图像或在网上找到的图像搜索产品。此外，基于用户行为、兴趣、购买历史等的个性化推荐也可由依赖于向量搜索的专业推荐系统提供。</p>
<p><strong>物理和网络安全：</strong>视频人工智能只是向量相似性搜索在安全领域的众多应用之一。其他应用场景还包括面部识别、行为追踪、身份验证、智能访问控制等。此外，向量相似性搜索在挫败日益常见和复杂的网络攻击方面也发挥着重要作用。例如，<a href="https://medium.com/gsi-technology/application-of-ai-to-cybersecurity-part-3-19659bdb3422">代码相似性搜索</a>可通过将软件与已知漏洞或恶意软件数据库进行比较来识别安全风险。</p>
<p><strong>推荐引擎：</strong>推荐引擎是一种利用机器学习和数据分析向用户推荐产品、服务、内容和信息的系统。使用深度学习方法处理用户行为、类似用户行为和其他数据，从而生成推荐。有了足够多的数据，就可以训练算法来理解实体之间的关系，并发明自主表示这些关系的方法。推荐系统具有广泛的适用性，人们每天都会与之互动，包括 Netflix 上的内容推荐、亚马逊上的购物推荐和 Facebook 上的新闻推送。</p>
<p><strong>聊天机器人：</strong>传统上，聊天机器人使用常规知识图谱构建，需要大量的训练数据集。但是，使用深度学习模型构建的聊天机器人不需要预处理数据，而是在经常出现的问题和答案之间创建一个映射。使用预先训练好的自然语言处理（NLP）模型，可以从问题中提取<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#92e0">特征向量</a>，然后使用<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#92e0">向量数据管理平台</a>进行存储和查询。</p>
<p><strong>图像或视频搜索：</strong>自 20 世纪 70 年代末以来，深度学习网络就一直被用于识别视觉模式，而现代技术的发展趋势使得图像和视频搜索比以往任何时候都更加强大和便捷。</p>
<p><strong>化学相似性搜索：</strong>化学相似性是预测化合物性质和寻找具有特定属性的化学物质的关键，因此在新药研发中不可或缺。为每个分子创建以特征向量为代表的指纹，然后利用向量之间的距离来衡量相似性。将人工智能用于新药研发在科技行业的发展势头日益强劲，字节跳动（TikTok 的中国母公司）已开始<a href="https://techcrunch.com/2020/12/23/bytedance-ai-drug/">招聘该领域的人才</a>。</p>
<h3 id="Open-source-vector-similarity-search-software-and-resources" class="common-anchor-header">开源向量相似性搜索软件和资源。</h3><p>摩尔定律、云计算和资源成本下降等宏观趋势使人工智能比以往任何时候都更容易获得。得益于开源软件和其他公开可用的资源，构建人工智能/ML 应用程序并不仅仅是大型科技公司的专利。下面，我们将简要介绍开源向量数据管理平台 Milvus，同时重点介绍一些有助于让人工智能触手可及的公开数据集。</p>
<h4 id="Milvus-an-open-source-vector-data-management-platform" class="common-anchor-header">开源向量数据管理平台 Milvus</h4><p><a href="https://milvus.io/">Milvus</a>是一个开源向量数据管理平台，专为大规模向量数据而建。Milvus 由 Facebook AI 相似性搜索（Faiss）、非度量空间库（NMSLIB）和 Annoy 提供支持，它将各种强大的工具汇集到一个平台下，同时扩展了它们的独立功能。该系统专为存储、处理和分析大型向量数据集而建，可用于构建上述所有人工智能应用（以及更多）。</p>
<p>有关 Milvus 的更多信息，请访问其<a href="https://milvus.io/">网站</a>。<a href="https://github.com/milvus-io/bootcamp">Milvus 引导营中</a>提供了教程、设置 Milvus 的说明、基准测试以及构建各种不同应用的信息。有兴趣为该项目做出贡献的开发人员可以加入 Milvus 在<a href="https://github.com/milvus-io">GitHub</a> 上的开源社区。</p>
<h4 id="Public-datasets-for-artificial-intelligence-and-machine-learning" class="common-anchor-header">人工智能和机器学习公共数据集</h4><p>谷歌和脸书等科技巨头在数据方面比小企业更有优势，这已经不是什么秘密了，一些学者甚至提倡 "<a href="https://www.technologyreview.com/2019/06/06/135067/making-big-tech-companies-share-data-could-do-more-good-than-breaking-them-up/">渐进式数据共享授权</a>"，迫使超过一定规模的公司与小企业共享一些匿名数据。幸运的是，有数以千计的公开数据集可用于 AL/ML 项目：</p>
<ul>
<li><p><strong>人民之声数据集：</strong>该<a href="https://mlcommons.org/en/peoples-speech/">数据集来自 ML Commons</a>，是世界上最大的语音数据集，包含超过 87,000 小时的 59 种不同语言的转录语音。</p></li>
<li><p><strong>加州大学欧文分校机器学习资料库：</strong>加州大学欧文分校维护着<a href="https://archive.ics.uci.edu/ml/index.php">数百个公共数据集</a>，为机器学习社区提供帮助。</p></li>
<li><p><strong>Data.gov：</strong>美国政府提供<a href="https://www.data.gov/">数十万个开放数据集</a>，涵盖教育、气候、COVID-19 等领域。</p></li>
<li><p><strong>欧盟统计局（Eurostat）：</strong>欧盟统计局提供的<a href="https://ec.europa.eu/eurostat/data/database">开放数据集</a>涵盖经济、金融、人口和社会状况等多个行业。</p></li>
<li><p><strong>哈佛数据海：</strong> <a href="https://dataverse.harvard.edu/">Harvard Dataverse Repository</a>是一个向各学科研究人员开放的免费数据存储库。许多数据集是公开的，而其他数据集则有更多限制性使用条款。</p></li>
</ul>
<p>虽然这份清单并非详尽无遗，但它是一个很好的起点，可以帮助人们发现种类多得惊人的开放数据集。要了解有关公共数据集的更多信息，以及为下一个 ML 或数据科学项目选择合适的数据，请查看<a href="https://altexsoft.medium.com/best-public-datasets-for-machine-learning-and-data-science-sources-and-advice-on-the-choice-636a0e754052">Medium 上</a>的这<a href="https://altexsoft.medium.com/best-public-datasets-for-machine-learning-and-data-science-sources-and-advice-on-the-choice-636a0e754052">篇文章</a>。</p>
<h2 id="To-learn-more-about-vector-similarity-search-check-out-the-following-resources" class="common-anchor-header">要了解有关向量相似性搜索的更多信息，请查看以下资源：<button data-href="#To-learn-more-about-vector-similarity-search-check-out-the-following-resources" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md">得益于 Milvus，任何人都能为 10 多亿张图片构建搜索引擎</a></li>
<li><a href="https://milvus.io/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md">Milvus 专为大规模（上万亿）向量相似性搜索而生</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">利用向量索引加速大数据的相似性搜索</a></li>
<li><a href="https://zilliz.com/learn/index-overview-part-2">利用向量索引加速大数据的相似性搜索（第二部分）</a></li>
</ul>
