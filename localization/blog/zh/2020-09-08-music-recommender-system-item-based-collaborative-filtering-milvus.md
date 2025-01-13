---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: 选择嵌入式相似性搜索引擎
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: 万印 APP 案例研究
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>基于项目的协作过滤音乐推荐系统</custom-h1><p>万音应用程序是一个基于人工智能的音乐分享社区，旨在鼓励音乐分享，让音乐爱好者更轻松地创作音乐。</p>
<p>万音的音乐库包含用户上传的大量音乐。其主要任务是根据用户以往的行为习惯筛选出他们感兴趣的音乐。我们评估了两种经典模型：基于用户的协同过滤（User-based CF）和基于项目的协同过滤（Item-based CF），作为潜在的推荐系统模型。</p>
<ul>
<li>基于用户的协同过滤使用相似性统计来获取具有相似偏好或兴趣的相邻用户。通过检索到的最近邻居集，系统可以预测目标用户的兴趣并生成推荐。</li>
<li>由亚马逊推出的基于物品的 CF，或称物品对物品（I2I）CF，是推荐系统中一种著名的协同过滤模型。它基于感兴趣的项目必须与高分项目相似这一假设，计算项目之间而非用户之间的相似性。</li>
</ul>
<p>当用户数量超过一定程度时，基于用户的 CF 可能会导致计算时间过长。考虑到我们产品的特点，我们决定采用 I2I CF 来实现音乐推荐系统。鉴于我们并不掌握太多歌曲的元数据，我们必须处理歌曲本身，从中提取特征向量（Embeddings）。我们的方法是将这些歌曲转换成旋律-频率倒频谱（MFC），设计一个卷积神经网络（CNN）来提取歌曲的特征嵌入，然后通过嵌入相似性搜索进行音乐推荐。</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">选择嵌入式相似性搜索引擎<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>既然已经有了特征向量，剩下的问题就是如何从海量向量中检索出与目标向量相似的向量。说到嵌入式搜索引擎，我们在 Faiss 和 Milvus 之间进行了权衡。我是在 2019 年 11 月浏览 GitHub 的趋势软件仓库时注意到 Milvus 的。我看了一下这个项目，它的抽象 API 非常吸引我。(当时它的版本是 v0.5.x，现在是 v0.10.2）。</p>
<p>相比 Faiss，我们更喜欢 Milvus。一方面，我们以前用过 Faiss，因此想尝试一些新东西。另一方面，与 Milvus 相比，Faiss 更像是一个底层库，因此使用起来不太方便。随着对 Milvus 了解的增多，我们最终决定采用 Milvus，因为它有两大特点：</p>
<ul>
<li>Milvus 非常容易使用。你所需要做的就是拉取其 Docker 镜像，并根据自己的场景更新参数。</li>
<li>它支持更多索引，并有详细的支持文档。</li>
</ul>
<p>总而言之，Milvus 对用户非常友好，文档也相当详细。如果你遇到任何问题，通常都能在文档中找到解决方案；否则，你可以随时从 Milvus 社区获得支持。</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Milvus 集群服务 ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>决定使用 Milvus 作为功能向量搜索引擎后，我们在开发 (DEV) 环境中配置了一个 Standalone 节点。几天来它一直运行良好，因此我们计划在工厂验收测试 (FAT) 环境中运行测试。如果独立节点在生产中崩溃，整个服务都将不可用。因此，我们需要部署高可用性的搜索服务。</p>
<p>Milvus 同时提供了集群分片中间件 Mishards 和用于配置的 Milvus-Helm。部署 Milvus 集群服务的过程很简单。我们只需更新一些参数，然后打包部署到 Kubernetes 中。Milvus 文档中的下图展示了 Mishards 的工作原理：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-how-mishards-works-in-milvus-documentation.png</span> </span></p>
<p>Mishards 会将来自上游的请求级联到其子模块，拆分上游请求，然后收集子服务的结果并返回给上游。基于 Mishards 的集群解决方案的整体架构如下所示：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>官方文档清楚地介绍了 Mishards。如果你感兴趣，可以参考<a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a>。</p>
<p>在我们的音乐推荐系统中，我们在 Kubernetes 中部署了一个可写节点、两个只读节点和一个 Mishards 中间件实例，使用的是 Milvus-Helm。服务在 FAT 环境中稳定运行一段时间后，我们将其部署到生产环境中。到目前为止，它一直很稳定。</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 I2I 音乐推荐 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>如上所述，我们利用现有歌曲的提取嵌入构建了万音的 I2I 音乐推荐系统。首先，我们将用户上传的新歌曲的人声和 BGM 分离（音轨分离），并提取 BGM 嵌入作为歌曲的特征表示。这也有助于对原创歌曲的翻唱版本进行分类。接下来，我们将这些 embeddings 存储在 Milvus 中，根据用户收听的歌曲搜索相似歌曲，然后对检索到的歌曲进行排序和重新排列，生成音乐推荐。具体实现过程如下所示：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-Music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">重复歌曲过滤器<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>我们使用 Milvus 的另一个场景是重复歌曲过滤。有些用户会多次上传相同的歌曲或片段，这些重复的歌曲可能会出现在他们的推荐列表中。这意味着，如果不经过预处理就生成推荐，会影响用户体验。因此，我们需要找出重复的歌曲，并通过预处理确保它们不会出现在同一列表中。</p>
<p>我们使用 Milvus 的另一个场景是重复歌曲过滤。有些用户会多次上传相同的歌曲或片段，这些重复的歌曲可能会出现在他们的推荐列表中。这意味着，如果不经过预处理就生成推荐，会影响用户体验。因此，我们需要找出重复的歌曲，并通过预处理确保它们不会出现在同一列表中。</p>
<p>与前一种情况相同，我们通过搜索相似的特征向量来实现重复歌曲过滤。首先，我们将人声和 BGM 分离开来，并使用 Milvus 检索了一些相似歌曲。为了准确过滤重复歌曲，我们提取了目标歌曲和相似歌曲的音频指纹（利用 Echoprint、Chromaprint 等技术），计算目标歌曲的音频指纹与每首相似歌曲指纹之间的相似度。如果相似度超过阈值，我们就将该歌曲定义为目标歌曲的复制品。音频指纹匹配过程能更准确地过滤重复歌曲，但也很耗时。因此，在对海量音乐库中的歌曲进行过滤时，我们使用 Milvus 对候选重复歌曲进行初步过滤。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-using-milvus-filter-songs-music-recommender-duplicates.png</span> </span></p>
<p>为了实现万音海量曲库的 I2I 推荐系统，我们的做法是提取歌曲的嵌入作为其特征，召回与目标歌曲嵌入相似的嵌入，然后将结果排序并重新排列，生成推荐列表提供给用户。为了实现实时推荐，我们选择了 Milvus 而不是 Faiss 作为特征向量相似性搜索引擎，因为事实证明 Milvus 更加友好和成熟。同样，我们还将 Milvus 应用于重复歌曲过滤，从而提高了用户体验和效率。</p>
<p>您可以下载<a href="https://enjoymusic.ai/wanyin">Wanyin App</a>🎶 并试用。(注：可能无法在所有应用商店下载）。</p>
<h3 id="📝-Authors" class="common-anchor-header">📝作者：</h3><p>Stepbeats 算法工程师 Jason Zilliz 数据工程师陈世宇</p>
<h3 id="📚-References" class="common-anchor-header">📚 参考文献：</h3><p>Mishards Docs: https://milvus.io/docs/v0.10.2/mishards.md Mishards: https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗 不要陌生，请在<a href="https://twitter.com/milvusio/">Twitter</a>上关注我们或在<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> 上加入我们！👇🏻</strong></p>
