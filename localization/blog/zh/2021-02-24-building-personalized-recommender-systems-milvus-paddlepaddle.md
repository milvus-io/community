---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: 背景介绍
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: 如何构建深度学习驱动的推荐系统
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>利用 Milvus 和 PaddlePaddle 构建个性化推荐系统</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">背景介绍<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>随着网络技术的不断发展和电子商务规模的不断扩大，商品的数量和种类迅速增加，用户需要花费大量时间才能找到想要购买的商品。这就是信息过载。为了解决这一问题，推荐系统应运而生。</p>
<p>推荐系统是信息过滤系统的一个子集，可用于电影、音乐、电子商务和 Feed 流推荐等一系列领域。推荐系统通过分析和挖掘用户行为，发现用户的个性化需求和兴趣，并推荐用户可能感兴趣的信息或产品。与搜索引擎不同，推荐系统不需要用户准确描述自己的需求，而是对用户的历史行为进行建模，主动提供符合用户兴趣和需求的信息。</p>
<p>本文利用百度的深度学习平台 PaddlePaddle 建立模型，并结合向量相似性搜索引擎 Milvus 构建个性化推荐系统，能够快速准确地为用户提供感兴趣的信息。</p>
<h2 id="Data-Preparation" class="common-anchor-header">数据准备<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>我们以MovieLens百万数据集（ml-1m）[1]为例。ml-1m 数据集包含 6000 名用户对 4000 部电影的 100 万条评论，由 GroupLens 研究室收集。原始数据包括电影的特征数据、用户特征和用户对电影的评分，可参考 ml-1m-README [2] 。</p>
<p>ml-1m 数据集包括 3 篇 .dat 文章：movies.dat、users.dat 和 ratings.dat。movies.dat 包含电影的特征，请参见下面的示例：</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>这表示电影 id 为 1，标题为《玩具总动员》，分为三个类别。这三个类别分别是动画片、儿童片和喜剧片。</p>
<p>users.dat 包括用户的特征，请看下面的例子：</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>这意味着用户 ID 是 1，女性，年龄小于 18 岁。职业 ID 是 10。</p>
<p>ratings.dat 包含电影分级特征，请参见下面的示例：</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>也就是说，用户 1 给电影 1193 打了 5 分。</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">融合推荐模型<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>在电影个性化推荐系统中，我们使用了 PaddlePaddle 实现的融合推荐模型 [3]。该模型是其在行业实践中创建的。</p>
<p>首先，将用户特征和电影特征作为神经网络的输入：</p>
<ul>
<li>用户特征包含四个属性信息：用户 ID、性别、职业和年龄。</li>
<li>电影特征包含三个属性信息：电影 ID、电影类型 ID 和电影名称。</li>
</ul>
<p>对于用户特征，将用户 ID 映射为维度为 256 的向量表示，进入全连接层，并对其他三个属性进行类似处理。然后对四个属性的特征表示进行全连接并分别添加。</p>
<p>对于电影特征，电影 ID 的处理方式与用户 ID 相似。电影类型 ID 以向量的形式直接输入全连接层，电影名称则使用文本卷积神经网络以定长向量表示。然后将这三个属性的特征表示进行全连接并分别添加。</p>
<p>得到用户和电影的向量表示后，计算它们的余弦相似度，作为个性化推荐系统的得分。最后，将相似度得分与用户真实得分之差的平方作为回归模型的损失函数。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-user-film-personalized-recommender-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">系统概述<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>结合 PaddlePaddle 的融合推荐模型，将模型生成的电影特征向量存储在 Milvus 向量相似性搜索引擎中，以用户特征作为目标向量进行搜索。在 Milvus 中进行相似性搜索，得到查询结果，作为向用户推荐的电影。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-overview.jpg</span> </span></p>
<blockquote>
<p>Milvus 中提供了内积（IP）方法来计算向量距离。对数据进行归一化处理后，内积相似度与融合推荐模型中的余弦相似度结果一致。</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">个人推荐系统的应用<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>用 Milvus 构建个性化推荐系统有三个步骤，详细操作方法请参考 Milvus Bootcamp [4]。</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">第一步：模型训练</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>运行此命令将在目录中生成一个模型 recommender_system.inference.model，它可以将电影数据和用户数据转换成特征向量，并生成应用数据供 Milvus 存储和检索。</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">第二步：数据预处理</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>运行此命令将在目录中生成测试数据 movies_data.txt，实现对电影数据的预处理。</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">第三步：使用 Milvus 实现个人推荐系统</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>运行此命令将为指定用户实现个性化推荐。</p>
<p>主要过程如下</p>
<ul>
<li>通过 load_inference_model，电影数据经过模型处理，生成电影特征向量。</li>
<li>通过 milvus.insert，将电影特征向量载入 Milvus。</li>
<li>根据参数指定的用户年龄/性别/职业，转换为用户特征向量，利用 milvus.search_vectors 进行相似度检索，返回用户与电影相似度最高的结果。</li>
</ul>
<p>预测用户感兴趣的前五部电影：</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>通过向融合推荐模型输入用户信息和电影信息，我们可以得到匹配分数，然后根据用户对所有电影的分数进行排序，推荐用户可能感兴趣的电影。<strong>本文结合 Milvus 和 PaddlePaddle 来构建个性化推荐系统。Milvus 是一个向量搜索引擎，用于存储所有电影特征数据，然后对 Milvus 中的用户特征进行相似性检索。</strong>搜索结果就是系统推荐给用户的电影排名。</p>
<p>Milvus [5] 向量相似性搜索引擎兼容各种深度学习平台，搜索数十亿向量仅需毫秒级响应。有了 Milvus，你可以轻松探索人工智能应用的更多可能性！</p>
<h2 id="Reference" class="common-anchor-header">参考资料<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>PaddlePaddle 的融合推荐模型： https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
