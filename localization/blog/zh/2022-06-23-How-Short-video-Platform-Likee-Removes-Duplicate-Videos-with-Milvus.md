---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: 短视频平台 Likee 如何利用 Milvus 删除重复视频
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: 了解 Likee 如何使用 Milvus 在几毫秒内识别重复视频。
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由 BIGO 工程师郭昕阳和韩宝玉撰写，<a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a> 翻译。</p>
</blockquote>
<p><a href="https://www.bigo.sg/">BIGO Technology</a>（BIGO）是新加坡发展最快的科技公司之一。在人工智能技术的支持下，BIGO 基于视频的产品和服务在全球大受欢迎，在 150 多个国家拥有超过 4 亿用户。这些产品和服务包括<a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a>（直播）和<a href="https://likee.video/">Likee</a>（短视频）。</p>
<p>Likee 是一个全球性的短视频创作平台，用户可以在这里分享他们的精彩瞬间，表达自我，并与世界建立联系。为了提高用户体验并向用户推荐更高质量的内容，Likee 需要从用户每天产生的海量视频中剔除重复视频，而这并不是一项简单的任务。</p>
<p>本博客介绍了 BIGO 如何使用开源向量数据库<a href="https://milvus.io">Milvus</a> 来有效去除重复视频。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#Overview">概述</a></li>
<li><a href="#Video-deduplication-workflow">重复数据删除工作流程</a></li>
<li><a href="#System-architecture">系统架构</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">使用 Milvus 进行相似性搜索</a></li>
</ul>
<custom-h1>概述</custom-h1><p>Milvus 是一个开源向量数据库，具有超快速向量搜索功能。在 Milvus 的支持下，Likee 能够在 200 毫秒内完成搜索，同时确保高召回率。同时，通过<a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">横向扩展 Milvus</a>，Likee 成功提高了向量查询的吞吐量，进一步提高了效率。</p>
<custom-h1>重复数据删除工作流程</custom-h1><p>Likee 如何识别重复视频？每次将查询视频输入 Likee 系统时，都会将其剪切成 15-20 帧，并将每一帧转换成特征向量。然后，Likee 会在包含 7 亿个向量的数据库中进行搜索，找出最相似的前 K 个向量。前 K 个向量中的每一个都对应数据库中的一段视频。Likee 会进一步进行细化搜索，以获得最终结果并确定要删除的视频。</p>
<custom-h1>系统架构</custom-h1><p>让我们仔细看看 Likee 的视频去重系统是如何使用 Milvus 工作的。如下图所示，上传到 Likee 的新视频将实时写入数据存储系统 Kafka，并被 Kafka 消费者消费。这些视频的特征向量通过深度学习模型提取，非结构化数据（视频）被转换成特征向量。这些特征向量将由系统打包，发送给相似性审核员。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Likee 视频重复数据删除系统架构图</span> </span></p>
<p>提取的特征向量将被 Milvus 索引并存储在 Ceph 中，然后<a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">由 Milvus 查询节点加载</a>，以便进一步搜索。这些特征向量对应的视频 ID 也将根据实际需要同时存储在 TiDB 或 Pika 中。</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">利用 Milvus 向量数据库助力相似性搜索</h3><p>在搜索相似向量时，现有的数十亿数据，加上每天产生的大量新数据，给向量搜索引擎的功能带来了极大的挑战。经过全面分析，Likee 最终选择了高性能、高召回率的分布式向量搜索引擎 Milvus 来进行向量相似性搜索。</p>
<p>如下图所示，相似性搜索的流程如下：</p>
<ol>
<li><p>首先，Milvus 对从新视频中提取的多个特征向量进行批量搜索，为每个特征向量召回前 100 个相似向量。每个相似向量都与其对应的视频 ID 绑定。</p></li>
<li><p>其次，通过比较视频 ID，Milvus 会删除重复视频，并从 TiDB 或 Pika 中检索剩余视频的特征向量。</p></li>
<li><p>最后，Milvus 对检索到的每组特征向量与查询视频的特征向量之间的相似度进行计算和评分。得分最高的视频 ID 将作为结果返回。至此，视频相似性搜索结束。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>相似性搜索的程序</span> </span></p>
<p>作为高性能的向量搜索引擎，Milvus 在 Likee 的视频去重系统中发挥了非凡的作用，极大地推动了 BIGO 短视频业务的发展。在视频业务方面，Milvus 还可以应用于许多其他场景，如非法内容拦截或个性化视频推荐等。BIGO 和 Milvus 都期待未来在更多领域开展合作。</p>
