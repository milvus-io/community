---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: 整体架构
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: Milvus 可轻松为用户提供个性化推荐服务。
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>利用唯品会和 Milvus 构建个性化商品推荐系统</custom-h1><p>随着互联网数据规模的爆炸式增长，一方面，当前主流电商平台的商品数量和品类不断增加，另一方面，用户寻找所需商品的难度也在激增。</p>
<p><a href="https://www.vip.com/">唯品会</a>是中国领先的在线品牌折扣零售商。公司以低于零售价的大幅折扣向全国消费者提供高品质的流行品牌产品。为了优化顾客的购物体验，公司决定根据用户查询的关键词和用户画像建立一个个性化搜索推荐系统。</p>
<p>电子商务搜索推荐系统的核心功能是从大量商品中检索出合适的商品，并根据用户的搜索意图和偏好将其展示给用户。在此过程中，系统需要计算商品与用户搜索意图和偏好的相似度，并将相似度最高的 TopK 商品推荐给用户。</p>
<p>产品信息、用户搜索意图和用户偏好等数据都是非结构化数据。我们曾尝试使用搜索引擎 Elasticsearch（ES）的 CosineSimilarity(7.x) 计算此类数据的相似度，但这种方法存在以下缺点。</p>
<ul>
<li><p>计算响应时间长--从数百万个条目中检索 TopK 结果的平均延迟时间约为 300 毫秒。</p></li>
<li><p>ES 索引的维护成本高--商品特征向量和其他相关数据都使用同一套索引，这几乎不利于索引构建，但会产生海量数据。</p></li>
</ul>
<p>我们尝试开发自己的本地敏感哈希插件，以加速 ES 的余弦相似度（CosineSimilarity）计算。虽然加速后性能和吞吐量有了明显提高，但 100 多毫秒的延迟仍然难以满足实际在线产品检索的要求。</p>
<p>经过深入研究，我们决定使用开源向量数据库Milvus，与常用的单机版Faiss相比，它具有支持分布式部署、多语言SDK、读写分离等优势。</p>
<p>利用各种深度学习模型，我们将海量非结构化数据转化为特征向量，并将向量导入Milvus。借助 Milvus 的优异性能，我们的电商搜索推荐系统可以高效地查询到与目标向量相似的 TopK 向量。</p>
<h2 id="Overall-Architecture" class="common-anchor-header">整体架构<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>![架构](https://assets.zilliz.com/1_01551e7b2b.jpg &quot;架构。)如图所示，系统整体架构主要由两部分组成。</p>
<ul>
<li><p>写入流程：将深度学习模型生成的项目特征向量（以下简称项目向量）规范化后写入 MySQL。然后，MySQL 使用数据同步工具（ETL）读取处理后的物品特征向量，并将其导入向量数据库 Milvus。</p></li>
<li><p>读取过程：搜索服务根据用户查询关键词和用户画像获取用户偏好特征向量（以下简称用户向量），查询 Milvus 中的相似向量并调用 TopK 物品向量。</p></li>
</ul>
<p>Milvus 支持增量数据更新和整体数据更新。每次增量更新都要删除现有的项目向量并插入新的项目向量，这意味着每个新更新的 Collections 都要重新索引。它更适合读取较多、写入较少的情况。因此，我们选择了整体数据更新方法。此外，分批写入多个分区的全部数据只需几分钟，相当于近乎实时更新。</p>
<p>Milvus 写节点执行所有写操作，包括创建数据 Collections、建立索引、插入向量等，并以写域名向公众提供服务。Milvus 读节点执行所有读操作，并以只读域名向公众提供服务。</p>
<p>当前版本的 Milvus 不支持切换 Collections 别名，而我们引入了 Redis，可以在多个整个数据 Collections 之间无缝切换别名。</p>
<p>读取节点只需从 MySQL、Milvus 和 GlusterFS 分布式文件系统中读取现有的元数据信息和向量数据或索引，因此可以通过部署多个实例来横向扩展读取能力。</p>
<h2 id="Implementation-Details" class="common-anchor-header">实施细节<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">数据更新</h3><p>数据更新服务不仅包括写入向量数据，还包括向量的数据量检测、索引构建、索引预加载、别名控制等。整体流程如下。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>流程</span> </span></p>
<ol>
<li><p>假设在构建整个数据之前，CollectionA 向公众提供数据服务，正在使用的整个数据都指向 CollectionA (<code translate="no">redis key1 = CollectionA</code>)。构建整个数据的目的是创建一个新的 CollectionsB。</p></li>
<li><p>商品数据检查 - 检查 MySQL 表中商品数据的项目编号，将商品数据与 CollectionA 中的现有数据进行比较。可根据数量或百分比设置警报。如果未达到设置的数量（百分比），则不会构建整个数据，视为本次构建操作失败，触发警报；一旦达到设置的数量（百分比），则开始整个数据构建过程。</p></li>
<li><p>开始构建整个数据 - 初始化正在构建的整个数据的别名，并更新 Redis。更新后，正在构建的整个数据的别名将指向 CollectionB (<code translate="no">redis key2 = CollectionB</code>)。</p></li>
<li><p>创建新的整个 Collections - 确定 CollectionB 是否存在。如果存在，则先删除它，然后再创建新的。</p></li>
<li><p>数据批量写入 - 使用 modulo 操作计算每个商品数据的分区 ID 与自己的 ID，并将多个分区的数据批量写入新创建的 Collections。</p></li>
<li><p>建立和预加载索引--为新的 Collections 创建索引 (<code translate="no">createIndex()</code>)。索引文件存储在分布式存储服务器 GlusterFS 中。系统会自动模拟对新 Collection 的查询，并预载索引进行查询预热。</p></li>
<li><p>Collections 数据检查--检查新 Collection 中数据的条目数，将数据与现有 Collection 进行比较，并根据数量和百分比设置警报。如果未达到设定的数量（百分比），则不会切换 Collection，并将构建过程视为失败，触发警报。</p></li>
<li><p>切换 Collections - 别名控制。更新 Redis 后，正在使用的整个数据别名将被定向到 CollectionB (<code translate="no">redis key1 = CollectionB</code>)，原来的 Redis key2 将被删除，并完成构建过程。</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">数据调用</h3><p>多次调用 Milvus 分区数据，计算根据用户查询关键词和用户画像得到的用户向量与物品向量之间的相似度，合并后返回 TopK 物品向量。整体工作流程示意图如下：<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>工作流程</span> </span>下表列出了该流程中涉及的主要服务。可以看出，调用 TopK 向量的平均延迟时间约为 30 毫秒。</p>
<table>
<thead>
<tr><th><strong>服务</strong></th><th><strong>角色</strong></th><th><strong>输入参数</strong></th><th><strong>输出参数</strong></th><th><strong>响应延迟</strong></th></tr>
</thead>
<tbody>
<tr><td>获取用户向量</td><td>获取用户向量</td><td>用户信息 + 查询</td><td>用户向量</td><td>10 毫秒</td></tr>
<tr><td>Milvus 搜索</td><td>计算向量相似度并返回 TopK 结果</td><td>用户向量</td><td>项目向量</td><td>10 ms</td></tr>
<tr><td>调度逻辑</td><td>并发结果调用和合并</td><td>多通道调用的项目向量和相似度得分</td><td>前 K 个项目</td><td>10 ms</td></tr>
</tbody>
</table>
<p><strong>执行过程：</strong></p>
<ol>
<li>根据用户查询关键词和用户画像，通过深度学习模型计算出用户向量。</li>
<li>从 Redis currentInUseKeyRef 获取整个被使用数据的 Collections 别名，并获取 Milvus CollectionName。这个过程是数据同步服务，即在整个数据更新后将别名切换到 Redis。</li>
<li>Milvus 与用户向量并发异步调用，获取同一 Collections 不同分区的数据，Milvus 会计算用户向量与项目向量的相似度，并返回每个分区中的 TopK 相似项目向量。</li>
<li>合并每个分区返回的 TopK 项向量，并按照相似度距离的倒序排列结果，相似度距离使用 IP 内积计算（向量之间的距离越大，相似度越高）。最终返回 TopK 项目向量。</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">展望未来<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>目前，基于 Milvus 的向量搜索可以稳定地应用于推荐场景的搜索，它的高性能给了我们在模型维度和算法选择上更大的发挥空间。</p>
<p>Milvus 作为中间件将在更多场景中发挥关键作用，包括主站搜索的召回和全场景推荐。</p>
<p>Milvus 未来最值得期待的三个功能如下。</p>
<ul>
<li>集合别名切换逻辑 - 无需外部组件即可协调集合间的切换。</li>
<li>过滤机制--Milvus v0.11.0 单机版仅支持 ES DSL 过滤机制。新发布的 Milvus 2.0 支持标量过滤和读写分离。</li>
<li>对 Hadoop Distributed File System (HDFS) 的存储支持 - 我们正在使用的 Milvus v0.10.6 只支持 POSIX 文件接口，我们部署了支持 FUSE 的 GlusterFS 作为存储后端。不过，从性能和易于扩展的角度来看，HDFS 是一个更好的选择。</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">经验教训和最佳实践<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
<li>对于以读取操作为主的应用，读写分离部署可以显著提高处理能力，改善性能。</li>
<li>Milvus Java 客户端缺乏重新连接机制，因为召回服务使用的 Milvus 客户端常驻内存中。我们必须建立自己的连接池，通过心跳测试确保 Java 客户端与服务器之间的连接可用。</li>
<li>Milvus 上偶尔会出现查询缓慢的情况。这是由于新 Collections 的预热不足造成的。通过模拟对新 Collections 的查询，将索引文件加载到内存中，实现索引预热。</li>
<li>nlist 是索引构建参数，nprobe 是查询参数。您需要根据业务场景，通过压力测试实验获得合理的阈值，以平衡检索性能和准确性。</li>
<li>对于静态数据场景，先将所有数据导入 Collections，之后再建立索引会更有效率。</li>
</ol>
