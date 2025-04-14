---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: 为什么手动分片对向量数据库来说是个坏主意，以及如何解决这个问题
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: 了解手动向量数据库分片为何会产生瓶颈，以及 Milvus 的自动扩展如何消除工程开销，实现无缝增长。
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_1_968a5be504.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p>"一家企业级人工智能 SaaS 初创公司的首席技术官亚历克斯回忆说：<em>"我们最初是在 pgvector 而不是 Milvus 上构建语义搜索的，因为我们所有的关系数据都已经在 PostgreSQL 中了</em>。<em>"但是，当我们的产品与市场相匹配时，我们的发展就遇到了工程方面的严重障碍。我们很快就发现，pgvector 并不是为可扩展性而设计的。诸如在多个分片上推出 Schema 更新之类的简单任务变成了乏味、容易出错的流程，耗费了数天的工程精力。当我们的向量嵌入数达到 1 亿时，查询延迟飙升到了 1 秒以上，远远超出了客户的承受能力。搬到 Milvus 后，手动分片的感觉就像走进了石器时代。把分片服务器当作易碎品一样摆弄，这可不是件好玩的事。任何公司都不应该承受这种痛苦。</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">人工智能公司面临的共同挑战<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>对于 pgvector 用户来说，Alex 的经历并非独一无二。无论你使用的是 pgvector、Qdrant、Weaviate 还是其他依赖手动分片的向量数据库，扩展挑战都是一样的。随着数据量的增长，最初的可管理解决方案很快就会变成技术债务。</p>
<p>对于今天的初创企业来说，<strong>可扩展性不是可有可无的，而是至关重要的</strong>。对于由大型语言模型（LLM）和向量数据库驱动的人工智能产品来说尤其如此，从早期采用到指数级增长的飞跃可能在一夜之间发生。实现产品与市场的契合往往会引发用户激增、数据流入量过大以及查询需求激增。但是，如果数据库基础设施跟不上，缓慢的查询和低效的操作符就会阻碍发展势头，阻碍业务成功。</p>
<p>一个短期的技术决策可能会导致长期的瓶颈，迫使工程团队不断解决紧急的性能问题、数据库崩溃和系统故障，而不是专注于创新。最坏的情况是什么？重新架构数据库，成本高昂，耗时漫长，而这恰恰是公司应该进行扩展的时候。</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">分片难道不是可扩展性的自然解决方案吗？<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>可扩展性可以通过多种方式解决。最直接的方法是 "<strong>升级"（Scaling Up</strong>），即通过增加 CPU、内存或存储来增强单台机器的资源，以适应不断增长的数据量。这种方法虽然简单，但有明显的局限性。例如，在 Kubernetes 环境中，大型 pod 的效率很低，而且依赖单个节点会增加故障风险，可能导致严重停机。</p>
<p>当 "向上扩展 "不再可行时，企业自然会转向 "<strong>向外扩展</strong>"，将数据分布到多个服务器上。乍一看，<strong>分片</strong>似乎是一个简单的解决方案--将数据库<strong>分割</strong>成更小的、独立的数据库，以增加容量并启用多个可写主节点。</p>
<p>然而，虽然概念上简单明了，但在实践中，分片很快就变成了一项复杂的挑战。大多数应用程序最初都是为使用单一、统一的数据库而设计的。一旦将向量数据库划分为多个分片，应用程序中与数据交互的每个部分都必须修改或完全重写，从而带来巨大的开发开销。设计有效的分片策略变得至关重要，实施路由逻辑以确保数据被导向正确的分片也是如此。跨多个分片管理原子事务通常需要重组应用程序，以避免跨分片操作。此外，还必须从容应对故障情况，以防止某些分片不可用时出现中断。</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">手动分片为何成为负担<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p><em>&quot;我们最初估计，为 pgvector 数据库实施手动分片需要两名工程师大约六个月的时间，&quot;</em>Alex 回忆说，<em>&quot;但我们没想到的是，这些工程师</em> <strong><em>总是</em></strong> <em>需要的。每次 Schema 更改、数据再平衡操作或扩展决策都需要他们的专业知识。仅仅为了保证数据库的运行，我们就投入了一个永久性的'分片团队'。&quot;</em></p>
<p>分片向量数据库在现实世界中面临的挑战包括</p>
<ol>
<li><p><strong>数据分布不平衡（热点）</strong>：在多租户使用案例中，每个租户的数据分布可能从数百到数十亿向量不等。这种不平衡会产生热点，某些分片会超载，而其他分片则处于闲置状态。</p></li>
<li><p><strong>令人头疼的重分片问题</strong>：选择合适数量的分片几乎是不可能的。数量太少会导致频繁而昂贵的重新分片操作。数量过多会造成不必要的元数据开销，增加复杂性并降低性能。</p></li>
<li><p><strong>Schema 更改复杂</strong>：许多向量数据库通过管理多个底层数据库来实现分片。这使得在分片间同步 Schema 更改变得繁琐且容易出错，从而减缓了开发周期。</p></li>
<li><p><strong>资源浪费</strong>：在存储-计算耦合数据库中，您必须在每个节点上精心分配资源，同时预测未来的增长。通常情况下，当资源利用率达到 60-70% 时，就需要开始计划重新分片。</p></li>
</ol>
<p>简而言之，<strong>手动管理分片对业务不利</strong>。与其将工程团队锁定在持续的分片管理上，不如考虑投资设计用于自动扩展的向量数据库，而无需承担操作负担。</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Milvus 如何解决可扩展性问题<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>许多开发人员--从初创企业到大型企业--都认识到了手动数据库分片带来的巨大开销。Milvus 从根本上采用了不同的方法，实现了从数百万到数十亿向量的无缝扩展，而不存在复杂性。</p>
<h3 id="Automated-Scaling-Without-the-Tech-Debt" class="common-anchor-header">无需技术债务的自动扩展</h3><p>Milvus 利用 Kubernetes 和分解存储-计算架构支持无缝扩展。这种设计可实现</p>
<ul>
<li><p>快速扩展以应对不断变化的需求</p></li>
<li><p>在所有可用节点上自动平衡负载</p></li>
<li><p>独立的资源分配，让您可以分别调整计算、内存和存储</p></li>
<li><p>即使在快速增长期间，也能保持稳定的高性能</p></li>
</ul>
<h3 id="Distributed-Architecture-Designed-from-the-Ground-Up" class="common-anchor-header">从头开始设计的分布式架构</h3><p>Milvus 通过两项关键创新实现其扩展能力：</p>
<p><strong>基于网段的架构：</strong>Milvus 的核心是将数据组织成 &quot;段&quot;--数据管理的最小单位：</p>
<ul>
<li><p>增长段驻留在 StreamNodes 上，为实时查询优化数据新鲜度</p></li>
<li><p>密封段由查询节点管理，利用强大的索引加速搜索</p></li>
<li><p>这些分段均匀分布在各个节点上，以优化并行处理</p></li>
</ul>
<p><strong>双层路由</strong>：与传统数据库的每个分块都在一台机器上不同，Milvus 将一个分块中的数据动态地分布在多个节点上：</p>
<ul>
<li><p>每个分片可存储超过 10 亿个数据点</p></li>
<li><p>每个分区内的数据段在不同机器上自动平衡</p></li>
<li><p>扩展收集就像增加分片数量一样简单</p></li>
<li><p>即将推出的 Milvus 3.0 将引入动态分片功能，甚至连这一最基本的手动步骤也可省去。</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">大规模查询处理</h3><p>在执行查询时，Milvus 遵循高效的流程：</p>
<ol>
<li><p>代理为请求的 Collections 识别相关的分片</p></li>
<li><p>代理从流节点和查询节点收集数据</p></li>
<li><p>流节点处理实时数据，查询节点同时处理历史数据</p></li>
<li><p>汇总结果并返回给用户</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">与众不同的工程体验<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><em>"当可扩展性内置于数据库本身时，所有这些令人头疼的问题都......消失了，"</em>亚历克斯在谈到他的团队向 Milvus 过渡时说。<em>"我的工程师们重新开始构建客户喜爱的功能，而不是照看数据库碎片。</em></p>
<p>如果您正在为手动分片的工程负担、大规模性能瓶颈或令人生畏的数据库迁移前景而苦恼，那么是时候重新思考您的方法了。请访问我们的<a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">文档页面</a>，了解有关 Milvus 架构的更多信息，或访问<a href="https://zilliz.com/cloud">zilliz.com/cloud</a> 亲身体验完全托管的 Milvus 的轻松可扩展性。</p>
<p>有了正确的向量数据库基础，您的创新将不再受限。</p>
