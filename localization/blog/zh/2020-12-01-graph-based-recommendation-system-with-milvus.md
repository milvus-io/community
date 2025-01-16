---
id: graph-based-recommendation-system-with-milvus.md
title: 推荐系统如何运行？
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: 推荐系统可以创造收入、降低成本并提供竞争优势。了解如何使用开源工具免费构建推荐系统。
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>利用 milvus、PinSage、DGL 和 MovieLens 数据集构建基于图的推荐系统</custom-h1><p>推荐系统由算法驱动，这些算法<a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">起初</a>只是帮助人类筛选不需要的电子邮件。1990 年，发明者 Doug Terry 使用协同过滤算法从垃圾邮件中筛选出理想的电子邮件。用户只需 "喜欢 "或 "讨厌 "某封电子邮件，并与其他对类似邮件内容做同样处理的人合作，就能快速训练计算机，以确定哪些邮件要推送到用户的收件箱，哪些邮件要封存到垃圾邮件文件夹。</p>
<p>一般来说，推荐系统是向用户提供相关建议的算法。建议可以是观看的电影、阅读的书籍、购买的产品，也可以是任何其他内容，这取决于具体场景或行业。这些算法就在我们身边，影响着我们从 Youtube、亚马逊、Netflix 等大型科技公司消费的内容和购买的产品。</p>
<p>设计精良的推荐系统可以成为重要的创收工具、降低成本和差异化竞争手段。得益于开源技术和不断下降的计算成本，定制化推荐系统从未像现在这样容易获得。本文将介绍如何使用开源向量数据库 Milvus、图卷积神经网络（GCN）PinSage、用于图深度学习的可扩展 python 软件包深度图库（DGL）以及 MovieLens 数据集来构建基于图的推荐系统。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">推荐系统如何运行？</a></li>
<li><a href="#tools-for-building-a-recommender-system">构建推荐系统的工具</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">使用 Milvus 构建基于图的推荐系统</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">推荐系统如何运行？<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>构建推荐系统有两种常见的方法：协同过滤和基于内容的过滤。尽管推荐系统的复杂程度和构建方式各不相同，但它们通常包括三个核心要素：</p>
<ol>
<li><strong>用户模型：</strong>推荐系统需要对用户特征、偏好和需求进行模型化。许多推荐系统的建议都是基于用户隐式或显式的项目级输入。</li>
<li><strong>对象模型：</strong>推荐系统还需要建立物品模型，以便根据用户画像进行物品推荐。</li>
<li><strong>推荐算法：</strong>任何推荐系统的核心组成部分都是为其推荐提供动力的算法。常用的算法包括协同过滤、隐含语义模型、基于图的模型、组合推荐等。</li>
</ol>
<p>从高层次上讲，依赖于协同过滤的推荐系统会根据用户过去的行为（包括来自相似用户的行为输入）建立一个模型，以预测用户可能感兴趣的内容。基于内容过滤的系统则使用基于项目特征的离散、预定义标签来推荐类似项目。</p>
<p>协作过滤的一个例子是 Spotify 上的个性化电台，它基于用户的收听历史、兴趣、音乐库等。该电台会播放用户没有保存或以其他方式表示感兴趣的音乐，但其他具有类似品味的用户通常会播放这些音乐。基于内容过滤的例子是基于特定歌曲或艺术家的广播电台，它利用输入的属性来推荐类似的音乐。</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">构建推荐系统的工具<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>在本示例中，从零开始构建基于图的推荐系统需要借助以下工具：</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage：图卷积网络</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a>是一种随机漫步图卷积网络，能够为包含数十亿对象的网络规模图中的节点学习嵌入。该网络由在线图钉板公司<a href="https://www.pinterest.com/">Pinterest</a> 开发，用于向用户提供专题视觉推荐。</p>
<p>Pinterest 用户可以将自己感兴趣的内容 "钉 "到 "板 "上，"板 "是被钉内容的 Collections。该公司拥有超过<a href="https://business.pinterest.com/audience/">4.78 亿月</a>活跃用户（MAU）和超过<a href="https://newsroom.pinterest.com/en/company">2400 亿</a>保存对象，用户数据量巨大，必须建立新技术才能跟上。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSage 利用图钉-板块双向图从图钉中生成高质量的 Embeddings，用于向用户推荐视觉上相似的内容。传统的 GCN 算法会对特征矩阵和整个图进行卷积，与之不同的是，PinSage 会对附近的节点/图钉进行采样，并通过动态构建计算图来执行更高效的局部卷积。</p>
<p>对节点的整个邻域进行卷积会产生一个庞大的计算图。为了减少资源需求，传统的 GCN 算法通过聚合节点 k 跳邻域的信息来更新节点的表示。PinSage 模拟随机行走，将经常访问的内容设置为关键邻域，然后在此基础上构建卷积。</p>
<p>由于 k 跳邻域常常存在重叠，对节点进行局部卷积会导致重复计算。为了避免这种情况，在每个聚合步骤中，PinSage 会映射所有节点，而不进行重复计算，然后将它们链接到相应的上层节点，最后检索上层节点的 Embeddings。</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">深度图库用于图上深度学习的可扩展 python 软件包</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-graph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library（DGL）</a>是一个 Python 包，旨在现有深度学习框架（如 PyTorch、MXNet、Gluon 等）之上构建基于图的神经网络模型。DGL 包含一个用户友好的后台界面，可以轻松植入基于张量并支持自动生成的框架。上文提到的 PinSage 算法经过优化，可与 DGL 和 PyTorch 配合使用。</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus：为人工智能和相似性搜索构建的开源向量数据库</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>Milvus 是如何工作的？</span> </span></p>
<p>Milvus 是一个开源向量数据库，用于支持向量相似性搜索和人工智能（AI）应用。在高层次上，使用 Milvus 进行相似性搜索的工作原理如下：</p>
<ol>
<li>深度学习模型用于将非结构化数据转换为特征向量，并将其导入 Milvus。</li>
<li>Milvus 对特征向量进行存储和索引。</li>
<li>根据请求，Milvus 会搜索并返回与输入向量最相似的向量。</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">使用 Milvus 构建基于图的推荐系统<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3 构建基于图的推荐系统.png</span> </span></p>
<p>使用 Milvus 构建基于图的推荐系统包括以下步骤：</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">第 1 步：数据预处理</h3><p>数据预处理包括将原始数据转换成更易于理解的格式。本示例使用的开放数据集 MovieLens[5] (m1-1m)，包含 6000 名用户对 4000 部电影的 100 万个评分。这些数据由 GroupLens 收集，包括电影描述、电影评分和用户特征。</p>
<p>请注意，本示例中使用的 MovieLens 数据集只需进行最低限度的数据清理或组织。但是，如果您使用的是不同的数据集，则可能会有所不同。</p>
<p>要开始构建推荐系统，请使用 MovieLens 数据集中的历史用户-电影数据构建用户-电影双向图，以便进行分类。</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">第 2 步：使用 PinSage 训练模型</h3><p>使用 PinSage 模型生成的 Pin 的嵌入向量是获取的电影信息的特征向量。根据双向图 g 和自定义的电影特征向量维度（默认为 256-d）创建 PinSage 模型。然后，用 PyTorch 训练模型，获得 4000 部电影的 h_item embeddings。</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">步骤 3：加载数据</h3><p>将 PinSage 模型生成的电影嵌入 h_item 加载到 Milvus 中，Milvus 会返回相应的 ID。将 ID 和相应的电影信息导入 MySQL。</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">步骤 4：进行向量相似性搜索</h3><p>根据电影 ID 在 Milvus 中获取相应的 Embeddings，然后使用 Milvus 对这些 Embeddings 进行相似性搜索。然后，在 MySQL 数据库中找出相应的电影信息。</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">步骤 5：获得推荐</h3><p>现在，系统将推荐与用户搜索查询最相似的电影。这就是构建推荐系统的一般工作流程。要快速测试和部署推荐系统和其他人工智能应用，请尝试 Milvus<a href="https://github.com/milvus-io/bootcamp">启动营</a>。</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus 不仅能为推荐系统提供动力<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一个强大的工具，能够为大量人工智能和向量相似性搜索应用提供动力。要了解有关该项目的更多信息，请查看以下资源：</p>
<ul>
<li>阅读我们的<a href="https://zilliz.com/blog">博客</a>。</li>
<li>在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上与我们的开源社区互动。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用或贡献世界上最流行的向量数据库。</li>
</ul>
