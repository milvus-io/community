---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: 使用 iYUNDONG 体育应用程序提取赛事集锦
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: 与 Milvus 一起制作 iYUNDONG 体育应用程序智能图像检索系统
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>使用 iYUNDONG 体育应用程序提取赛事亮点</custom-h1><p>iYUNDONG 是一家互联网公司，旨在吸引更多体育爱好者和马拉松等赛事的参与者。它开发的<a href="https://en.wikipedia.org/wiki/Artificial_intelligence">人工智能（AI）</a>工具可以分析体育赛事中捕捉到的媒体，自动生成赛事集锦。例如，参加体育赛事的 iYUNDONG 运动应用程序用户只需上传一张自拍照，就能立即从赛事的海量媒体数据集中检索到自己的照片或视频片段。</p>
<p>iYUNDONG 应用程序的主要功能之一是 "在运动中找到我"。  摄影师通常会在马拉松比赛等体育赛事期间拍摄大量照片或视频，并将照片和视频实时上传到 iYUNDONG 媒体数据库。马拉松选手如果想查看自己的精彩瞬间，只需上传一张自拍照，就能检索到包括自己在内的照片。这为他们节省了大量时间，因为 iYUNDONG 应用程序中的图像检索系统会完成所有图像匹配工作。iYUNDONG 采用<a href="https://milvus.io/">Milvus</a>为这一系统提供动力，因为 Milvus 可以大大加快检索过程，并返回高度准确的结果。</p>
<p><br/></p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">使用 iYUNDONG 体育应用程序提取赛事亮点</a><ul>
<li><a href="#difficulties-and-solutions">困难与解决方案</a></li>
<li><a href="#what-is-milvus">什么是 Milvus</a>-<a href="#an-overview-of-milvus"><em>Milvus 概述。</em></a></li>
<li><a href="#why-milvus">为什么选择 Milvus</a></li>
<li><a href="#system-and-workflow">系统和工作流程</a></li>
<li><a href="#iyundong-app-interface">iYUNDONG 应用程序界面</a>-<a href="#iyundong-app-interface-1"><em>iYUNDONG 应用程序界面。</em></a></li>
<li><a href="#conclusion">结论</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">困难与解决方案</h3><p>在建立图像检索系统时，iYUNDONG 遇到了以下问题，并成功找到了相应的解决方案。</p>
<ul>
<li>活动照片必须立即可供检索。</li>
</ul>
<p>iYUNDONG 开发了一个名为 InstantUpload 的功能，以确保活动照片在上传后立即可供搜索。</p>
<ul>
<li>海量数据集的存储</li>
</ul>
<p>照片和视频等海量数据每毫秒都要上传到 iYUNDONG 后端。因此，iYUNDONG 决定迁移到云存储系统上，包括<a href="https://aws.amazon.com/">AWS</a>、<a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a> 和<a href="https://www.alibabacloud.com/product/oss">阿里巴巴云对象存储服务 (OSS)</a>，以安全、快速、可靠的方式处理巨量的非结构化数据。</p>
<ul>
<li>即时阅读</li>
</ul>
<p>为了实现即时读取，iYUNDONG 开发了自己的分片中间件，以轻松实现横向扩展，减轻磁盘读取对系统的影响。此外，还使用<a href="https://redis.io/">Redis</a>作为缓存层，以确保在高并发情况下性能的一致性。</p>
<ul>
<li>即时提取面部特征</li>
</ul>
<p>为了准确、高效地从用户上传的照片中提取面部特征，iYUNDONG 开发了一种专有的图像转换算法，可将图像转换为 128 维特征向量。遇到的另一个问题是，许多用户和摄影师经常同时上传图片或视频。因此，系统工程师在部署系统时需要考虑动态可扩展性。具体来说，iYUNDONG 充分利用了云上的弹性计算服务（ECS）来实现动态扩展。</p>
<ul>
<li>快速、大规模的向量搜索</li>
</ul>
<p>iYUNDONG 需要一个向量数据库来存储其通过人工智能模型提取的大量特征向量。根据自身独特的业务应用场景，iYUNDONG 希望该向量数据库能够</p>
<ol>
<li>在超大数据集上执行快速向量检索。</li>
<li>以更低的成本实现海量存储。</li>
</ol>
<p>最初，平均每年要处理 100 万张图像，因此，iYUNDONG 将所有搜索数据都存储在 RAM 中。但近两年，其业务蓬勃发展，非结构化数据呈指数级增长--2019 年，iYUNDONG 数据库中的图片数量超过 6000 万张，这意味着需要存储的特征向量超过 10 亿个。巨大的数据量不可避免地使 iYUNDONG 系统的构建和资源消耗变得十分庞大。因此，它必须不断投资硬件设施，以确保高性能。具体来说，iYUNDONG 部署了更多的搜索服务器、更大的内存和性能更好的 CPU，以实现更高的效率和横向扩展能力。然而，这种解决方案的缺陷之一是导致操作符成本过高。因此，iYUNDONG 开始探索更好的解决方案，并考虑利用像 Faiss 这样的向量索引库来节约成本，更好地指导业务。最终，iYUNDONG 选择了开源向量数据库 Milvus。</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">什么是 Milvus</h3><p>Milvus 是一个开源的向量数据库，具有易用性、高度灵活性、可靠性和极快的速度。结合照片和语音识别、视频处理、自然语言处理等多种深度学习模型，Milvus 可以处理和分析非结构化数据，这些数据通过各种人工智能算法转换成向量。以下是 Milvus 处理所有非结构化数据的工作流程：</p>
<p>通过深度学习模型或其他人工智能算法将非结构化数据转换为嵌入向量。</p>
<p>然后将嵌入向量插入 Milvus 进行存储。Milvus 还会为这些向量建立索引。</p>
<p>Milvus 根据各种业务需求执行相似性搜索，并返回准确的搜索结果。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>iYUNDONG 博客 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">为什么选择 Milvus</h3><p>从2019年底开始，i云动使用Milvus对其图像检索系统进行了一系列测试。测试结果表明，Milvus 的性能优于其他主流向量数据库，因为它支持多索引，并能有效降低内存使用率，大幅压缩向量相似性搜索的时间线。</p>
<p>此外，Milvus 还定期发布新版本。在测试期间，Milvus 经历了从 v0.6.0 到 v0.10.1 的多次版本更新。</p>
<p>此外，凭借其活跃的开源社区和强大的开箱即用功能，Milvus 允许 iYUNDONG 在紧张的开发预算内操作。</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">系统和工作流程</h3><p>iYUNDONG 的系统首先通过检测摄影师上传的活动照片中的人脸来提取面部特征。然后将这些面部特征转换成 128 维向量并存储到 Milvus 库中。Milvus 会为这些向量创建索引，并能即时返回高度准确的结果。</p>
<p>其他附加信息，如照片 ID 和显示人脸在照片中位置的坐标，则存储在第三方数据库中。</p>
<p>iYUNDONG 采用<a href="https://about.meituan.com/en">美团</a>基础研发平台开发的分布式 ID 生成服务<a href="https://github.com/Meituan-Dianping/Leaf">Leaf 算法</a>，将 Milvus 中的向量 ID 与另一个数据库中存储的相应附加信息关联起来。通过将特征向量与附加信息相结合，i 云洞系统可以在用户搜索时返回相似的结果。</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">iYUNDONG 应用程序界面</h3><p>主页上列出了一系列最新的体育赛事。点击其中一项赛事，用户就能看到全部详情。</p>
<p>点击相册页面上方的按钮后，用户可以上传自己的照片，获取精彩瞬间的图片。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interface.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">总结</h3><p>本文介绍了 iYUNDONG 应用程序如何建立一个智能图像检索系统，根据用户上传的照片在分辨率、大小、清晰度、角度等方面的不同，以及其他使相似性搜索复杂化的方式，返回准确的搜索结果。在 Milvus 的帮助下，iYUNDONG App 可以在 6000 多万张图片的数据库中成功运行毫秒级查询。照片检索的准确率始终保持在 92% 以上。Milvus 使 iYUNDONG 更容易在短时间内利用有限资源创建强大的企业级图片检索系统。</p>
<p>阅读其他<a href="https://zilliz.com/user-stories">用户故事</a>，了解更多使用 Milvus 制作的信息。</p>
