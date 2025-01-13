---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: 使用语义向量搜索推荐内容
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: 了解如何利用 Milvus 在应用程序内构建智能新闻推荐系统。
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>在搜狐新闻应用程序中构建智能新闻推荐系统</custom-h1><p><a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">71%的美国人</a>从社交平台获得新闻推荐，个性化内容已迅速成为人们发现新媒体的方式。无论是搜索特定主题，还是与推荐内容互动，用户所看到的一切都经过算法优化，以提高点击率（CTR）、参与度和相关性。搜狐是一家在纳斯达克上市的中国在线媒体、视频、搜索和游戏集团。它利用由<a href="https://zilliz.com/">Zilliz</a> 构建的开源向量数据库<a href="https://milvus.io/">Milvus</a>，在其新闻应用内构建了一个语义向量搜索引擎。本文介绍了该公司如何利用用户资料对个性化内容推荐进行长期微调，从而提高用户体验和参与度。</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">使用语义向量搜索推荐内容<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>搜狐新闻的用户档案是根据浏览历史记录建立的，并在用户搜索新闻内容并与之互动时进行调整。搜狐的推荐系统使用语义向量搜索来查找相关新闻文章。该系统的工作原理是根据用户的浏览历史记录识别出一组用户可能感兴趣的标签。然后，该系统会快速搜索相关文章，并根据受欢迎程度（以平均点击率衡量）对结果进行排序，然后再提供给用户。</p>
<p>仅《纽约时报》一天就发布<a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 篇内容</a>，由此可见，一个有效的推荐系统必须能够处理大量的新内容。接收大量新闻需要毫秒级的相似性搜索和每小时将标签与新内容进行匹配。搜狐之所以选择 Milvus，是因为它能高效、准确地处理海量数据集，减少搜索过程中的内存占用，并支持高性能部署。</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">了解新闻推荐系统的工作流程<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>搜狐基于语义向量搜索的内容推荐依赖于深度结构化语义模型（DSSM），该模型使用两个神经网络将用户查询和新闻文章表示为向量。该模型计算两个语义向量的余弦相似度，然后将最相似的一批新闻发送到推荐候选池。接下来，根据预估点击率对新闻文章进行排序，并向用户展示预估点击率最高的文章。</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">利用 BERT-as-service 将新闻文章编码为语义向量</h3><p>为了将新闻文章编码成语义向量，系统使用了<a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>工具。在使用该模型时，如果任何一篇内容的字数超过 512，嵌入过程中就会出现信息丢失。为帮助克服这一问题，系统首先提取摘要并将其编码为 768 维语义向量。然后从每篇新闻文章中提取两个最相关的主题，并根据主题 ID 确定相应的预训练主题向量（200 维）。接着将主题向量拼接到从文章摘要中提取的 768 维语义向量中，形成 968 维语义向量。</p>
<p>新内容不断通过 Kafta 输入，并在插入 Milvus 数据库之前被转换成语义向量。</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">利用 BERT-as-service 从用户资料中提取语义相似的标签</h3><p>模型的其他神经网络是用户语义向量。根据兴趣、搜索查询和浏览历史，从用户资料中提取语义相似的标签（如冠状病毒、covid、COVID-19、大流行、新型毒株、肺炎）。获取的标签列表按权重排序，前 200 个标签被分为不同的语义组。每个语义组内标签的排列组合用于生成新的标签短语，然后通过 BERT-as-service 将其编码为语义向量。</p>
<p>对于每个用户配置文件，标签短语集都有<a href="https://github.com/baidu/Familia">相应的主题集</a>，这些<a href="https://github.com/baidu/Familia">主题集用</a>权重标记，表示用户的兴趣水平。从所有相关主题中选出前两个主题，由机器学习（ML）模型进行编码，拼接成相应的标签语义向量，形成一个 968 维的用户语义向量。即使系统为不同的用户生成了相同的标签，但标签及其对应主题的权重不同，以及每个用户的主题向量之间存在明确的差异，确保了推荐的唯一性</p>
<p>通过计算从用户资料和新闻文章中提取的语义向量的余弦相似度，系统能够进行个性化的新闻推荐。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>搜狐01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">计算新的语义用户资料向量并将其插入 Milvus</h3><p>语义用户资料向量每天计算一次，前 24 小时的数据在第二天晚上处理。向量被单独插入 Milvus，并通过查询流程运行，为用户提供相关的新闻结果。新闻内容本身具有时事性，因此需要每小时进行计算，以生成当前的新闻提要，其中包含预测点击率高且与用户相关的内容。新闻内容还按日期进行分区排序，每天清除旧新闻。</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">将语义向量提取时间从几天缩短到几小时</h3><p>使用语义向量检索内容需要每天将数千万个标签短语转换成语义向量。这是一个耗时的过程，即使在图形处理器（GPU）上运行，也需要数天才能完成。为了克服这一技术问题，必须对之前嵌入的语义向量进行优化，这样当相似的标签短语浮出水面时，就能直接检索到相应的语义向量。</p>
<p>现有标签短语集的语义向量会被存储起来，而每天生成的新标签短语集会被编码成 MinHash 向量。<a href="https://milvus.io/docs/v1.1.1/metric.md">雅卡德距离</a>用于计算新标签词组的 MinHash 向量与保存的标签词组向量之间的相似度。如果 Jaccard 距离超过了预先设定的阈值，则这两个集合被认为是相似的。如果达到了相似度阈值，新短语就可以利用以前嵌入的语义信息。测试表明，在大多数情况下，0.8 以上的距离应能保证足够的准确性。</p>
<p>通过这一过程，上述数千万向量的每日转换时间从数天缩短到两小时左右。虽然根据具体项目的要求，其他存储语义向量的方法可能更合适，但在 Milvus 数据库中使用 Jaccard 距离计算两个标签短语之间的相似度，仍然是一种在各种情况下高效、准确的方法。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>搜狐02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">克服短文本分类的 "坏情况<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>在对新闻文本进行分类时，与长篇新闻相比，短篇新闻可提取的特征较少。正因为如此，当不同长度的内容在同一个分类器中运行时，分类算法就会失效。Milvus 通过搜索语义相似、得分可靠的多条长文本分类信息，然后使用投票机制修改短文本分类，从而帮助解决这一问题。</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">识别和解决分类错误的短文本</h3><p>对每篇新闻文章进行精确分类对于提供有用的内容推荐至关重要。由于短新闻文章的特征较少，对不同长度的新闻使用相同的分类器会导致短文本分类的错误率较高。人工标注对于这项任务来说太慢且不准确，因此 BERT-as-service 和 Milvus 被用来快速识别成批被错误分类的短文，正确地重新分类，然后将成批数据作为语料库，针对这一问题进行训练。</p>
<p>BERT-as-service 用于将分类器得分大于 0.9 的共计 500 万篇长篇新闻文章编码为语义向量。将长文本文章插入 Milvus 后，再将短文本新闻编码成语义向量。每个短新闻语义向量用于查询 Milvus 数据库，获得与目标短新闻余弦相似度最高的前 20 篇长新闻。如果在语义相似度最高的前 20 篇长新闻中，有 18 篇出现在相同的分类中，且与查询的短新闻不同，则短新闻分类被认为是不正确的，必须进行调整以与这 18 篇长新闻保持一致。</p>
<p>这一过程可快速识别并纠正不准确的短文分类。随机抽样统计显示，短文分类纠正后，文本分类的总体准确率超过 95%。通过利用高置信度长文本的分类来纠正短文本的分类，大多数不良分类情况都能在短时间内得到纠正。这也为训练短文本分类器提供了良好的语料库。</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg "发现短文分类 "坏案例 "的流程图")</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">Milvus 可为实时新闻内容推荐等提供动力<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 极大地提高了搜狐新闻推荐系统的实时性能，同时也增强了识别短文分类错误的效率。如果您有兴趣了解 Milvus 及其各种应用：</p>
<ul>
<li>阅读我们的<a href="https://zilliz.com/blog">博客</a>。</li>
<li>在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上与我们的开源社区互动。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用或贡献世界上最流行的向量数据库。</li>
<li>使用我们的新<a href="https://github.com/milvus-io/bootcamp">启动训练营</a>快速测试和部署人工智能应用。</li>
</ul>
