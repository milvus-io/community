---
id: 2022-01-20-story-of-smartnews.md
title: SmartNews 的故事--从 Milvus 用户到积极贡献者
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: 了解 Milvus 用户和贡献者 SmartNews 的故事。
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>本文由<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> 翻译。</p>
<p>信息在我们的生活中无处不在。Meta（前身为 Facebook）、Instagram、Twitter 和其他社交媒体平台让信息流变得更加无处不在。因此，处理此类信息流的引擎已成为大多数系统架构的必备功能。然而，作为社交媒体平台和相关应用程序的用户，我想您一定被重复的文章、新闻、备忘录等内容困扰过。重复内容会阻碍信息检索过程，并导致糟糕的用户体验。</p>
<p>对于一个处理信息流的产品来说，如何找到一个灵活的数据处理器，将其无缝集成到系统架构中，从而对相同的新闻或广告进行重复处理，是开发人员的当务之急。</p>
<p>估值<a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">20 亿美元</a>的<a href="https://www.smartnews.com/en/">SmartNews</a> 是美国估值最高的新闻应用程序公司。值得注意的是，它曾经是开源向量数据库 Milvus 的用户，后来转变为 Milvus 项目的积极贡献者。</p>
<p>本文分享了 SmartNews 的故事，并讲述了它决定为 Milvus 项目做出贡献的原因。</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">SmartNews 概述<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews 成立于 2012 年，总部位于日本东京。SmartNews 开发的新闻应用程序在日本市场一直<a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">名列前茅</a>。SmartNews 是<a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">增长最快的</a>新闻应用程序，在美国市场也拥有<a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">很高的用户粘度</a>。根据<a href="https://www.appannie.com/en/">APP Annie</a> 的统计数据，截至 2021 年 7 月底，SmartNews 的月平均会话时长在所有新闻应用程序中排名第一，超过 AppleNews 和 Google News 的累计会话时长。</p>
<p>随着用户基数和黏性的快速增长，SmartNews 在推荐机制和人工智能算法方面面临更多挑战。这些挑战包括在大规模机器学习（ML）中利用海量离散特征、利用向量相似性搜索加速非结构化数据查询等。</p>
<p>2021 年初，SmartNews 的动态广告算法团队向人工智能基础架构团队提出了需要优化广告召回和查询功能的请求。经过两个月的研究，AI 基础架构工程师舒决定使用支持多索引和相似度指标、在线数据更新的开源向量数据库 Milvus。Milvus 受到全球千余家机构的信赖。</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">由向量相似性搜索驱动的广告推荐<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews 广告系统采用了开源向量数据库 Milvus，可从 10 million 规模的数据集中匹配并向用户推荐动态广告。通过这种方式，SmartNews 可以在用户数据和广告数据这两个以前无法匹配的数据集之间建立映射关系。2021 年第二季度，Shu 成功在 Kubernetes 上部署了 Milvus 1.0。了解有关如何<a href="https://milvus.io/docs">部署 Milvus</a> 的更多信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>图像</span> </span></p>
<p>Milvus 1.0 成功部署后，第一个使用 Milvus 的项目是 SmartNews 广告团队发起的广告召回项目。在初始阶段，广告数据集的规模为百万级。同时，P99 延迟被严格控制在 10 毫秒以内。</p>
<p>2021 年 6 月，舒畅和算法团队的同事们将 Milvus 应用到更多业务场景中，尝试数据聚合和在线数据/索引实时更新。</p>
<p>至此，Milvus 这个开源向量数据库已经在 SmartNews 的广告推荐等多个业务场景中得到应用。</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>从用户到积极贡献者</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>在将 Milvus 集成到 Smartnews 产品架构中时，Shu 和其他开发人员提出了热重载、条目 TTL（time-to-live）、条目更新/替换等功能要求。这些也是 Milvus 社区许多用户所希望的功能。因此，SmartNews 人工智能基础架构团队负责人 Dennis Zhao 决定开发并向社区贡献热重载功能。Dennis 认为："SmartNews 团队一直受益于 Milvus 社区，因此，如果我们有东西可以与社区分享，我们更愿意贡献出来。"</p>
<p>数据重载支持在运行代码的同时进行代码编辑。在数据重载的帮助下，开发人员不再需要在断点处停止或重启应用程序。相反，他们可以直接编辑代码并实时查看结果。</p>
<p>7 月下旬，SmartNews 的工程师 Yusup 提出了利用<a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">Collections 别名</a>实现热重载的想法。</p>
<p>创建 Collections 别名指的是为集合指定别名。一个 Collection 可以有多个别名。不过，一个别名最多对应一个 Collection。简单地类比一下 Collection 和储物柜。储物柜和 Collections 一样，都有自己的编号和位置，而且始终保持不变。不过，你可以随时从储物柜中放入或取出不同的东西。同样，Collection 的名称是固定的，但集合中的数据却是动态的。您可以随时插入或删除 Collections 中的向量，因为在 Milvus<a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">的预 GA 版本</a>中支持数据删除。</p>
<p>就 SmartNews 广告业务而言，随着新动态广告向量的生成，近 1 亿个向量会被插入或更新。对此有几种解决方案：</p>
<ul>
<li>解决方案 1：先删除旧数据，再插入新数据。</li>
<li>解决方案 2：为新数据创建新的 Collections。</li>
<li>解决方案 3：使用 Collections 别名。</li>
</ul>
<p>对于解决方案 1，最直接的缺点之一就是非常耗时，尤其是当要更新的数据集非常庞大时。更新一个亿级别的数据集一般需要几个小时。</p>
<p>至于解决方案 2，问题在于新的 Collections 无法立即用于搜索。也就是说，Collection 在加载过程中是无法搜索的。另外，Milvus 不允许两个 Collection 使用相同的 Collection 名称。切换到新的 Collections 总是需要用户手动修改客户端代码。也就是说，用户每次需要在 Collections 之间切换时，都必须修改参数<code translate="no">collection_name</code> 的值。</p>
<p>解决方案 3 将是灵丹妙药。您只需在新的 Collections 中插入新数据，并使用 Collections 别名即可。这样，每次需要切换集合进行搜索时，只需交换集合别名即可。您无需额外修改代码。该解决方案为您省去了前两个解决方案中提到的麻烦。</p>
<p>Yusup 从这个要求出发，帮助整个 SmartNews 团队了解 Milvus 架构。一个半月后，Milvus 项目收到了 Yusup 关于热重载的 PR。而后，伴随着 Milvus 2.0.0-RC7 的发布，这一功能正式上线。</p>
<p>目前，人工智能基础架构团队正在牵头部署 Milvus 2.0，并将所有数据从 Milvus 1.0 逐步迁移到 2.0。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>图像集合别名</span> </span></p>
<p>支持 Collections 别名可以大大提升用户体验，尤其是对于那些用户请求量极大的大型互联网公司。来自 Milvus 社区的数据工程师李成龙帮助搭建了 Milvus 与 Smartnews 之间的桥梁，他说："Collection alias 功能源于 Milvus 用户 SmartNews 的真实业务需求。而 SmartNews 向 Milvus 社区贡献了代码。这种互惠行为是开源精神的典范：来自社区，为了社区。我们希望看到更多像 SmartNews 这样的贡献者，共同建设一个更加繁荣的 Milvus 社区。"</p>
<p>"目前，部分广告业务采用 Milvus 作为离线向量数据库。Milvus 2.0 正式发布在即，我们希望可以利用 Milvus 构建更可靠的系统，为更多业务场景提供实时服务。" Dennis 说。</p>
<blockquote>
<p>更新：Milvus 2.0 现已全面上市！<a href="/blog/zh/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">了解更多</a></p>
</blockquote>
