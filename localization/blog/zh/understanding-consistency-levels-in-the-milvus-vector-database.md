---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: 了解 Milvus 向量数据库中的一致性水平
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: 了解 Milvus 向量数据库支持的四种级别的一致性--强一致性、有界滞后性、会话一致性和最终一致性。
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/JackLCL">李成龙</a>撰写，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>翻译。</p>
</blockquote>
<p>您是否想过，为什么有时从 Mlivus 向量数据库中删除的数据仍然会出现在搜索结果中？</p>
<p>一个很可能的原因是，您没有为自己的应用程序设置适当的一致性级别。分布式向量数据库中的一致性级别至关重要，因为它决定了系统在哪一点上可以读取特定的数据写入。</p>
<p>因此，本文旨在揭开一致性概念的神秘面纱，并深入探讨 Milvus 向量数据库支持的一致性级别。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#What-is-consistency">什么是一致性</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Milvus 向量数据库的四种一致性级别</a><ul>
<li><a href="#Strong">强</a></li>
<li><a href="#Bounded-staleness">有界滞后性</a></li>
<li><a href="#Session">会话</a></li>
<li><a href="#Eventual">最终</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">什么是一致性<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>在开始讨论之前，我们首先需要澄清本文中一致性的内涵，因为 "一致性 "一词在计算机行业中是一个过载的术语。分布式数据库中的一致性特指确保每个节点或副本在给定时间写入或读取数据时对数据有相同看法的属性。因此，我们在这里讨论的是<a href="https://en.wikipedia.org/wiki/CAP_theorem">CAP 定理</a>中的一致性。</p>
<p>在现代世界中，为了服务于大规模的在线业务，通常会采用多个副本。例如，在线电子商务巨头亚马逊在多个数据中心、地区甚至国家复制其订单或 SKU 数据，以确保在系统崩溃或故障时系统的高可用性。这就给系统带来了一个挑战--多个副本之间的数据一致性。如果没有一致性，亚马逊购物车中被删除的商品很可能会重新出现，造成非常糟糕的用户体验。</p>
<p>因此，我们需要为不同的应用提供不同的数据一致性级别。幸运的是，Milvus 作为一款人工智能数据库，提供了灵活的一致性级别，您可以设置最适合自己应用的一致性级别。</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 向量数据库中的一致性</h3><p>一致性级别的概念是在 Milvus 2.0 发布时首次提出的。Milvus 1.0 版本不是分布式向量数据库，因此我们当时没有涉及可调整的一致性级别。Milvus 1.0 每秒刷新一次数据，这意味着新数据插入后几乎立即可见，而且当向量相似性搜索或查询请求到来时，Milvus 会在准确的时间点读取最新的数据视图。</p>
<p>不过，Milvus 在 2.0 版本中进行了重构，<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0 是</a>基于 pub-sub 机制<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">的分布式向量数据库</a>。<a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a>定理指出，分布式系统必须在一致性、可用性和延迟之间进行权衡。此外，不同级别的一致性适用于不同的应用场景。因此，<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a>引入了一致性的概念，并支持一致性级别的调整。</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 向量数据库的四级一致性<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 支持四种级别的一致性：强一致性、有界滞后性、会话一致性和最终一致性。而 Milvus 用户可以在<a href="https://milvus.io/docs/v2.1.x/create_collection.md">创建 Collections</a>或进行<a href="https://milvus.io/docs/v2.1.x/search.md">向量相似性搜索</a>或<a href="https://milvus.io/docs/v2.1.x/query.md">查询</a>时指定一致性级别。本节将继续解释这四种一致性级别有何不同，以及它们最适合哪种情况。</p>
<h3 id="Strong" class="common-anchor-header">强</h3><p>强是最高、最严格的一致性级别。它确保用户可以读取最新版本的数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>强</span> </span></p>
<p>根据 PACELC 定理，如果将一致性级别设置为强，延迟会增加。因此，我们建议在功能测试时选择强一致性，以确保测试结果的准确性。强一致性也最适合那些以牺牲搜索速度为代价、对数据一致性有严格要求的应用。处理订单付款和账单的在线财务系统就是一个例子。</p>
<h3 id="Bounded-staleness" class="common-anchor-header">有界滞后</h3><p>有界僵化，顾名思义，允许数据在一定时间内不一致。不过，一般来说，在这段时间之外，数据始终是全局一致的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>有界滞后</span> </span></p>
<p>有界滞后性适用于需要控制搜索延迟并能接受零星数据不可见的场景。例如，在视频推荐引擎等推荐系统中，偶尔的数据不可见对总体召回率的影响确实很小，但却能显著提升推荐系统的性能。一个例子是用于跟踪在线订单状态的应用程序。</p>
<h3 id="Session" class="common-anchor-header">会话</h3><p>会话确保所有数据写入都能在同一会话中立即被读取。换句话说，当你通过一个客户端写入数据时，新插入的数据会立即成为可搜索的数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>会话</span> </span></p>
<p>我们建议在对同一会话中数据一致性要求较高的情况下选择会话作为一致性级别。例如，从图书馆系统中删除图书条目的数据，在确认删除并刷新页面（不同的会话）后，该图书在搜索结果中应该不再可见。</p>
<h3 id="Eventual" class="common-anchor-header">最终</h3><p>读取和写入的顺序没有保证，在不再进行写操作的情况下，副本最终会收敛到相同的状态。在最终一致性下，副本会使用最新更新的值开始处理读取请求。最终一致性是四种一致性中最弱的一种。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>最终</span> </span>一致性</p>
<p>然而，根据 PACELC 定理，牺牲一致性可以大大缩短搜索延迟。因此，最终一致性最适用于对数据一致性要求不高但需要极快搜索性能的场景。使用最终一致性检索亚马逊产品的评论和评级就是一个例子。</p>
<h2 id="Endnote" class="common-anchor-header">尾注<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>回到本文开头提出的问题，由于用户没有选择适当的一致性级别，删除的数据仍会作为搜索结果返回。在 milvus 向量数据库中，一致性级别的默认值是有界滞后（<code translate="no">Bounded</code> ）。因此，数据读取可能会滞后，Milvus 可能会碰巧在您进行相似性搜索或查询时进行删除操作之前读取数据视图。不过，这个问题很容易解决。您只需在创建 Collections 或进行向量相似性搜索或查询时<a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">调整一致性级别</a>即可。很简单！</p>
<p>在下一篇文章中，我们将揭开其背后的机制，并解释 Milvus 向量数据库如何实现不同级别的一致性。敬请期待！</p>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.1 的正式发布，我们准备了一系列介绍新功能的博客。请阅读本系列博客中的更多内容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字符串数据增强相似性搜索应用程序的功能</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即时安装并用 Python 运行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">利用内存复制提高向量数据库的读取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">了解 Milvus 向量数据库中的一致性水平</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">了解 Milvus 向量数据库的一致性水平（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus 向量数据库如何确保数据安全？</a></li>
</ul>
