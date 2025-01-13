---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: 基于关键字的搜索
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: Tokopedia 使用 Milvus 构建了一个比原来智能 10 倍的搜索系统，极大地提升了用户体验。
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>我们如何利用语义搜索使我们的搜索智能化 10 倍</custom-h1><p>在 Tokopedia，我们深知只有当我们的买家能够找到与他们相关的产品时，我们产品语料库的价值才能得到释放，因此我们努力提高搜索结果的相关性。</p>
<p>为了进一步提高<strong>搜索</strong>结果的<strong>相关性</strong>，我们在 Tokopedia 上引入了<strong>相似性搜索</strong>。如果您在移动设备上进入搜索结果页面，您会发现一个"... "按钮，该按钮会显示一个菜单，让您选择搜索与该产品相似的产品。</p>
<h2 id="Keyword-based-search" class="common-anchor-header">基于关键字的搜索<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia 搜索使用<strong>Elasticsearch</strong>对产品进行搜索和排序。对于每个搜索请求，我们首先查询 Elasticsearch，Elasticsearch 会根据搜索查询对产品进行排名。ElasticSearch 将每个单词存储为一串数字，代表每个字母的<a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a>（或 UTF）编码。它建立了一个<a href="https://en.wikipedia.org/wiki/Inverted_index">倒排索引</a>，以快速找出哪些文档包含用户查询中的单词，然后使用各种评分算法找出其中最匹配的文档。这些评分算法并不关注单词的含义，而是关注单词在文档中出现的频率、单词之间的接近程度等。ASCII 表示法显然包含了足够的信息来表达语义（毕竟我们人类可以理解）。遗憾的是，计算机没有很好的算法来比较 ASCII 编码单词的含义。</p>
<h2 id="Vector-representation" class="common-anchor-header">向量表示法<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>解决这个问题的办法之一是采用另一种表示法，这种表示法不仅能告诉我们单词中包含的字母，还能告诉我们单词的含义。例如，我们可以编码<em>我们的单词经常与哪些其他单词一起使用</em>（用可能的语境表示）。然后，我们会假设相似的语境代表相似的事物，并尝试用数学方法对它们进行比较。我们甚至可以找到一种方法，根据句子的含义对整个句子进行编码。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>博客_我们如何使用语义搜索使我们的搜索智能化10倍_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">选择嵌入式相似性搜索引擎<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>现在我们有了特征向量，剩下的问题就是如何从海量向量中检索出与目标向量相似的向量。说到嵌入式搜索引擎，我们在 Github 上的几个引擎上进行了 POC 尝试，其中包括 FAISS、Vearch 和 Milvus。</p>
<p>根据负载测试结果，我们更倾向于使用 Milvus 而不是其他引擎。一方面，我们以前在其他团队中使用过 FAISS，因此想尝试一些新的东西。与 Milvus 相比，FAISS 更像是一个底层库，因此使用起来不太方便。随着对 Milvus 了解的增多，我们最终决定采用 Milvus，因为它有两大特点：</p>
<ul>
<li><p>Milvus 非常容易使用。你所需要做的就是拉取其 Docker 镜像，并根据自己的场景更新参数。</p></li>
<li><p>它支持更多索引，并有详细的支持文档。</p></li>
</ul>
<p>总而言之，Milvus 对用户非常友好，文档也相当详细。如果你遇到任何问题，通常都能在文档中找到解决方案；否则，你可以随时从 Milvus 社区获得支持。</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Milvus 集群服务<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>在决定使用 Milvus 作为功能向量搜索引擎后，我们决定将 Milvus 用于我们的一个广告服务用例，我们希望将<a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">低填充率</a>关键词与高填充率关键词进行匹配。我们在开发（DEV）环境中配置了一个独立节点，并开始提供服务，几天来一直运行良好，CTR/CVR 指标也有所改善。如果独立节点在生产环境中崩溃，整个服务都将不可用。因此，我们需要部署一个高可用的搜索服务。</p>
<p>Milvus 同时提供了集群分片中间件 Mishards 和用于配置的 Milvus-Helm。在 Tokopedia 中，我们使用 Ansible playbook 进行基础设施设置，因此我们创建了一个用于基础设施协调的 playbook。Milvus 文档中的下图展示了 Mishards 的工作原理：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>博客_我们如何使用语义搜索让我们的搜索更智能10倍_3.png</span> </span></p>
<p>Mishards 将来自上游的请求级联到拆分上游请求的子模块，然后收集子服务的结果并返回给上游。基于 Mishards 的集群解决方案的整体架构如下所示：<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_我们如何利用语义搜索让我们的搜索变得聪明 10 倍_4.jpeg</span> </span></p>
<p>官方文档清楚地介绍了 Mishards。如果您感兴趣，可以参考<a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a>。</p>
<p>在我们的关键词到关键词服务中，我们在 GCP 中部署了一个可写节点、两个只读节点和一个 Mishards 中间件实例，使用的是 Milvus ansible。到目前为止，它一直很稳定。要想高效地查询相似性搜索引擎所依赖的百万、十亿甚至万亿向量数据集，其中一个重要的组成部分就是<a href="https://milvus.io/docs/v0.10.5/index.md">索引</a>，这是一个组织数据的过程，可以大大加快大数据搜索的速度。</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">向量索引如何加速相似性搜索？<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>相似性搜索引擎的工作原理是将输入数据与数据库进行比较，找出与输入数据最相似的对象。索引是有效组织数据的过程，它通过显著加快大型数据集上耗时的查询，在使相似性搜索变得有用方面发挥着重要作用。在对海量向量数据集进行索引后，查询可以被路由到最有可能包含与输入查询相似的向量的数据集群或子集。在实践中，这意味着要牺牲一定程度的准确性，以加快对真正大型向量数据的查询。</p>
<p>可以用字典来类比，字典中的单词是按字母顺序排序的。当查询一个单词时，可以快速浏览到只包含首字母相同的单词的部分--大大加快了对输入单词定义的搜索。</p>
<h2 id="What-next-you-ask" class="common-anchor-header">您会问，接下来要做什么？<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>博客_我们如何利用语义搜索使我们的搜索智能化 10 倍_5.jpeg</span> </span></p>
<p>如上所示，没有放之四海而皆准的解决方案，我们总是希望提高用于获取 Embeddings 的模型的性能。</p>
<p>另外，从技术角度来看，我们希望同时运行多个学习模型，并比较不同实验的结果。请关注本版块，了解更多有关图像搜索、视频搜索等实验的信息。</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">参考资料：<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Milvus 文档：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>本博客文章转贴自： https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>阅读其他<a href="https://zilliz.com/user-stories">用户故事</a>，了解用 Milvus 制作东西的更多信息。</p>
