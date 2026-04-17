---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: 语义搜索生产化：我们如何在 Airtable 构建和扩展向量基础设施
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: 了解 Airtable 如何为语义搜索、多用户检索和低延迟人工智能体验构建基于 Milvus 的可扩展向量基础架构。
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>这篇文章最初发表在</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Airtable Medium</a></em> <em>频道</em><em>上</em> <em>，现经授权在此转发。</em></p>
<p>随着Airtable的语义搜索从一个概念发展成为一项核心产品功能，数据基础设施团队面临着扩展它的挑战。正如我们<a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">在上一篇文章 "构建嵌入系统</a>"中所详述的，我们已经设计了一个强大的、最终保持一致的应用层来处理嵌入生命周期。但我们的架构图中还缺少一个关键部分：向量数据库本身。</p>
<p>我们需要一个存储引擎，能够索引和服务数十亿个 Embeddings，支持大规模多租户，并在分布式云环境中保持性能和可用性目标。这就是我们如何架构、加固和发展向量搜索平台，使其成为 Airtable 基础设施堆栈核心支柱的故事。</p>
<h2 id="Background" class="common-anchor-header">背景介绍<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Airtable，我们的目标是帮助客户以强大、直观的方式处理数据。随着功能越来越强大、准确度越来越高的LLMs的出现，利用数据语义的功能已经成为我们产品的核心。</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">我们如何使用语义搜索<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni（Airtable的人工智能聊天工具）回答来自大型数据集的真实问题</h3><p>想象一下，向您拥有50万行数据的数据库提出一个自然语言问题，并得到一个上下文丰富的正确答案。例如</p>
<p>"最近客户对电池续航时间有什么意见？</p>
<p>在小型数据集上，可以将所有行直接发送到 LLM。但在大规模数据集上，这种做法很快就变得不可行了。相反，我们需要的系统能够</p>
<ul>
<li>理解查询的语义意图</li>
<li>通过向量相似性搜索检索最相关的行</li>
<li>将这些行作为上下文提供给 LLM</li>
</ul>
<p>这一要求决定了随后几乎所有的设计决策：Omni 需要让人感觉即时、智能，即使在非常大的数据库中也是如此。</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">关联记录推荐：比精确匹配更有意义</h3><p>语义搜索还增强了Airtable的一项核心功能：关联记录。用户需要基于上下文的关系建议，而不是精确的文本匹配。例如，项目描述可能暗示与 "Team Infrastructure"（团队基础设施）存在关系，但却从未使用过这一特定短语。</p>
<p>提供这些按需建议需要高质量的语义检索和一致、可预测的延迟。</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">我们的设计重点<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>为了支持这些功能和更多的功能，我们围绕 4 个目标对系统进行了设计：</p>
<ul>
<li><strong>低延迟查询（500 毫秒 p99）：</strong>可预测的性能对用户信任度至关重要</li>
<li><strong>高吞吐量写入：</strong>碱基不断变化，Embeddings 必须保持同步</li>
<li><strong>横向可扩展性：</strong>系统必须支持数百万个独立数据库</li>
<li><strong>自托管：</strong>所有客户数据必须保留在 Airtable 控制的基础设施内</li>
</ul>
<p>这些目标决定了接下来的每一个架构决策。</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">向量数据库供应商评估<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>2024 年底，我们评估了多个向量数据库选项，最终根据三个关键要求选择了<a href="https://milvus.io/">Milvus</a>。</p>
<ul>
<li>首先，我们优先考虑自托管解决方案，以确保数据隐私并保持对基础设施的精细控制。</li>
<li>其次，我们的写入量大的工作负载和突发查询模式要求系统能够在保持低延迟和可预测延迟的同时进行弹性扩展。</li>
<li>最后，我们的架构需要在数百万客户租户之间实现强大的隔离。</li>
</ul>
<p><strong>Milvus</strong>成为了最佳选择：它的分布式特性支持大规模多租户，允许我们独立扩展摄取、索引和查询执行，在提供性能的同时保持成本的可预测性。</p>
<h2 id="Architecture-Design" class="common-anchor-header">架构设计<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>选定技术后，我们必须确定一个架构，以体现 Airtable 独特的数据形态：不同客户拥有数百万个不同的 "基地"。</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">分区挑战<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>我们评估了两种主要的数据分区策略：</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">方案 1：共享分区</h3><p>多个数据库共享一个分区，通过对数据库 ID 进行过滤来确定查询范围。这提高了资源利用率，但带来了额外的过滤开销，并使数据库删除变得更加复杂。</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">方案 2：每个分区一个碱基</h3><p>在 Milvus 中，每个 Airtable 数据库都映射到自己的物理分区。这提供了很强的隔离性，实现了快速、简单的基础删除，并避免了查询后过滤对性能的影响。</p>
<h3 id="Final-Strategy" class="common-anchor-header">最终策略</h3><p>我们选择了方案 2，因为它既简单又有很强的隔离性。不过，早期测试表明，在单个 Milvus Collections 中创建 100k 分区会导致性能显著下降：</p>
<ul>
<li>分区创建延迟从 ~20 毫秒增加到 ~250 毫秒</li>
<li>分区加载时间超过 30 秒</li>
</ul>
<p>为了解决这个问题，我们对每个 Collections 的分区数量设置了上限。对于每个 Milvus 集群，我们创建 400 个 Collection，每个 Collection 最多有 1,000 个分区。这就将每个群集的分区总数限制在了 400k，并随着新客户的加入而配置新的群集。</p>
<h2 id="Indexing--Recall" class="common-anchor-header">索引和调用<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>索引选择是我们系统中最重要的权衡之一。加载分区时，其索引会缓存在内存或磁盘中。为了在调用率、索引大小和性能之间取得平衡，我们对几种索引类型进行了基准测试。</p>
<ul>
<li><strong>IVF-SQ8：</strong>内存占用较小，但召回率较低。</li>
<li><strong>HNSW：</strong>召回率最高（99%-100%），但占用内存较多。</li>
<li><strong>DiskANN：</strong>召回率与 HNSW 相似，但查询延迟较高</li>
</ul>
<p>最终，我们选择了 HNSW，因为它具有更高的召回率和性能特点。</p>
<h2 id="The-Application-layer" class="common-anchor-header">应用层<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>从高层来看，Airtable 的语义搜索管道包括两个核心流程：</p>
<ol>
<li><strong>输入流：</strong>将Airtable行转换为嵌入并存储到Milvus中</li>
<li><strong>查询流：</strong>嵌入用户查询，检索相关行 ID，并为 LLM 提供上下文。</li>
</ol>
<p>这两个流程都必须持续可靠地大规模操作，我们将在下文逐一介绍。下面我们将逐一介绍。</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">输入流：保持 Milvus 与 Airtable 同步<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>当用户打开 Omni 时，Airtable 会开始将他们的基础数据同步到 Milvus。我们先创建一个分区，然后分块处理行，生成 Embeddings 并插入 Milvus。此后，我们会捕捉对基础数据所做的任何更改，并重新嵌入和倒插这些行，以保持数据的一致性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">查询流程：我们如何使用数据<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>在查询方面，我们会嵌入用户的请求并将其发送到 Milvus，以检索最相关的行 ID。然后，我们获取这些行的最新版本，并将其作为上下文包含在对 LLM 的请求中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">操作符挑战与我们的解决方法<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>构建语义搜索架构是一项挑战，而为成千上万的数据库可靠运行则是另一项挑战。下面是我们在操作过程中学到的一些关键经验。</p>
<h3 id="Deployment" class="common-anchor-header">部署</h3><p>我们使用 Milvus<a href="https://github.com/zilliztech/milvus-operator">操作符</a>通过 Kubernetes CRD 部署<a href="https://github.com/zilliztech/milvus-operator">Milvus</a>，这样就可以声明式地定义和管理集群。无论是配置更新、客户端改进还是 Milvus 升级，每一项变更都要经过单元测试和模拟生产流量的按需负载测试，然后才能向用户推出。</p>
<p>在 2.5 版中，Milvus 集群由这些核心组件组成：</p>
<ul>
<li>查询节点在内存中保存向量索引并执行向量搜索</li>
<li>数据节点处理摄取和压缩，并将新数据持久化到存储中</li>
<li>索引节点建立并维护向量索引，以便在数据增长时保持快速搜索</li>
<li>协调器节点协调所有集群活动和分片分配</li>
<li>代理节点路由 API 流量并平衡各节点的负载</li>
<li>Kafka 为内部消息传递和数据流提供日志/流主干网</li>
<li>Etcd 存储集群元数据和协调状态</li>
</ul>
<p>通过 CRD 驱动的自动化和严格的测试管道，我们可以快速、安全地推出更新。</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">可观察性：端到端了解系统健康状况<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>我们从两个层面对系统进行监控，以确保语义搜索保持快速和可预测。</p>
<p>在基础设施层面，我们跟踪所有 Milvus 组件的 CPU、内存使用情况和 pod 健康状况。这些信号告诉我们集群是否在安全范围内操作，并帮助我们在资源饱和或节点不健康等问题影响用户之前及时发现。</p>
<p>在服务层，我们重点关注每个基础如何跟上我们的摄取和查询工作负载。压缩和索引吞吐量等指标能让我们了解数据摄取的效率。查询成功率和延迟让我们了解用户查询数据的体验，分区增长让我们了解数据的增长情况，以便在需要扩展时发出警报。</p>
<h2 id="Node-Rotation" class="common-anchor-header">节点轮换<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>出于安全性和合规性考虑，我们会定期轮换 Kubernetes 节点。在向量搜索集群中，这并非易事：</p>
<ul>
<li>随着查询节点的轮换，协调器将重新平衡查询节点之间的内存数据。</li>
<li>Kafka 和 Etcd 存储有状态信息，需要法定人数和持续可用性</li>
</ul>
<p>我们采用严格的中断预算和一次轮换一个节点的策略来解决这个问题。在下一个节点循环之前，Milvus 协调器有时间重新平衡。这种精心的协调既能保证可靠性，又不会降低我们的速度。</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">冷分区卸载<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>我们最大的操作符之一是认识到我们的数据具有明确的冷热访问模式。通过分析使用情况，我们发现 Milvus 中只有约 25% 的数据在一周内被写入或读取。Milvus 可以让我们卸载整个分区，释放查询节点上的内存。如果以后需要这些数据，我们可以在几秒钟内重新加载。这样，我们就能将热数据保留在内存中，并卸载其余数据，从而降低成本，并使我们能够随着时间的推移更有效地扩展。</p>
<h2 id="Data-Recovery" class="common-anchor-header">数据恢复<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>在广泛推广 Milvus 之前，我们需要有信心能够从任何故障情况下快速恢复。虽然集群的内置容错功能可以解决大多数问题，但我们也计划应对数据可能损坏或系统可能进入无法恢复状态的罕见情况。</p>
<p>在这种情况下，我们的恢复路径非常简单。我们首先启动一个新的 Milvus 集群，这样几乎可以立即恢复流量服务。新集群上线后，我们会主动重新嵌入最常用的数据库，然后在其他数据库被访问时对其进行懒惰处理。这样，在系统逐步重建一致的语义索引的同时，最大限度地减少了最常访问数据的停机时间。</p>
<h2 id="What’s-Next" class="common-anchor-header">下一步计划<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>我们与<a href="https://milvus.io/">Milvus</a>的合作为 Airtable 的语义搜索奠定了坚实的基础：大规模提供快速、有意义的人工智能体验。有了这个系统，我们现在正在探索更丰富的检索管道，并在整个产品中实现更深入的人工智能集成。未来还有很多令人兴奋的工作，而我们才刚刚开始。</p>
<p><em>感谢所有过去和现在为这个项目做出贡献的数据基础架构上的 Airtablets 以及整个组织：Alex Sorokin、Andrew Wang、Aria Malkani、Cole Dearmon-Moore、Nabeel Farooqui、Will Powelson、夏小兵。</em></p>
<h2 id="About-Airtable" class="common-anchor-header">关于 Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtable</a>是领先的数字操作平台，使企业能够在企业规模内构建定制应用程序、自动执行工作流和管理共享数据。Airtable旨在支持复杂的跨职能流程，帮助团队建立灵活的系统，在共享的真相源上进行规划、协调和执行。随着 Airtable 扩展其人工智能驱动的平台，Milvus 等技术在加强提供更快、更智能的产品体验所需的检索基础设施方面发挥着重要作用。</p>
