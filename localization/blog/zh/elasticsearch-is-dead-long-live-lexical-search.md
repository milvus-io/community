---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: Elasticsearch 已死，词法搜索万岁
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>现在，每个人都知道混合搜索提高了<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>（检索增强生成）搜索的质量。虽然<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密集 Embeddings</a>搜索在捕捉查询和文档之间的深层语义关系方面表现出了令人印象深刻的能力，但它仍有明显的局限性。这些限制包括缺乏可解释性，以及在处理长尾查询和稀有术语时性能不佳。</p>
<p>许多 RAG 应用之所以举步维艰，是因为预先训练的模型往往缺乏特定领域的知识。在某些情况下，简单的 BM25 关键字匹配就能胜过这些复杂的模型。这就是混合搜索的优势所在，它将密集向量检索的语义理解与关键词匹配的精确性结合在一起。</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">为什么混合搜索在生产中很复杂<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>虽然像<a href="https://zilliz.com/learn/LangChain">LangChain</a>或<a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a>这样的框架可以轻松构建概念验证型混合检索器，但将其扩展到大规模数据集的生产却具有挑战性。传统的架构需要单独的向量数据库和搜索引擎，这导致了几个关键的挑战：</p>
<ul>
<li><p>高昂的基础设施维护成本和操作复杂性</p></li>
<li><p>跨多个系统的数据冗余</p></li>
<li><p>数据一致性管理困难</p></li>
<li><p>跨系统的安全和访问控制复杂</p></li>
</ul>
<p>市场需要一种统一的解决方案，既能支持词法和语义搜索，又能降低系统复杂性和成本。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Elasticsearch 的痛点<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch 是过去十年中最具影响力的开源搜索项目之一。它基于 Apache Lucene 构建，凭借其高性能、可扩展性和分布式架构而广受欢迎。虽然它在 8.0 版中增加了向量 ANN 搜索，但生产部署仍面临几个关键挑战：</p>
<p><strong>高更新和索引成本：</strong>Elasticsearch 的架构不能完全解耦写入操作、索引构建和查询。这导致在写操作过程中，尤其是批量更新时，CPU 和 I/O 开销巨大。索引和查询之间的资源争用会影响性能，成为高频更新场景的主要瓶颈。</p>
<p><strong>实时性差：</strong>作为一种 "接近实时 "的搜索引擎，Elasticsearch 在数据可见性方面引入了明显的延迟。对于 Agents 系统等人工智能应用来说，这种延迟尤其成问题，因为在这些应用中，高频率的交互和动态决策需要即时的数据访问。</p>
<p><strong>分片管理困难：</strong>虽然 Elasticsearch 使用分片来实现分布式架构，但分片管理带来了巨大挑战。缺乏动态分片支持造成了两难境地：小数据集中的分片过多会导致性能低下，而大数据集中的分片过少则会限制可扩展性并造成数据分布不均。</p>
<p><strong>非云原生架构：</strong>Elasticsearch 是在云原生架构流行之前开发的，其设计将存储和计算紧密结合在一起，限制了它与公共云和 Kubernetes 等现代基础架构的集成。资源扩展需要同时增加存储和计算资源，从而降低了灵活性。在多副本场景中，每个分片都必须独立建立索引，从而增加了计算成本，降低了资源效率。</p>
<p><strong>向量搜索性能差：</strong>虽然 Elasticsearch 8.0 引入了向量 ANN 搜索，但其性能明显落后于 Milvus 等专用向量引擎。基于 Lucene 内核，其索引结构在处理高维数据时效率低下，难以满足大规模向量搜索的要求。在涉及标量过滤和多租户的复杂情况下，其性能尤其不稳定，这使其难以支持高负荷或多样化的业务需求。</p>
<p><strong>资源消耗过大：</strong>Elasticsearch 对内存和 CPU 的要求极高，尤其是在处理大规模数据时。其对 JVM 的依赖性要求频繁调整堆大小和调整垃圾收集，严重影响了内存效率。向量搜索操作需要密集的 SIMD 优化计算，而 JVM 环境远非理想。</p>
<p>随着企业扩展其人工智能基础架构，这些基本限制变得越来越成问题，这使得 Elasticsearch 对于要求高性能和高可靠性的现代人工智能应用来说尤其具有挑战性。</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">引入 Sparse-BM25：重塑词法搜索<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>在 2.4 版推出的混合搜索功能基础上，通过 Sparse-BM25 引入了本地词法搜索支持。这一创新方法包括以下关键组件：</p>
<ul>
<li><p>通过 Tantivy 进行高级标记化和预处理</p></li>
<li><p>分布式词汇和词频管理</p></li>
<li><p>使用语料库 TF 和查询 TF-IDF 生成稀疏向量</p></li>
<li><p>使用 WAND 算法支持反索引（Block-Max WAND 和图索引支持正在开发中）</p></li>
</ul>
<p>与 Elasticsearch 相比，Milvus 在算法灵活性方面具有显著优势。其基于向量距离的相似性计算可实现更复杂的匹配，包括实施基于 "端到端查询术语加权 "研究的 TW-BERT（术语加权 BERT）。这种方法在域内和域外测试中都表现出了卓越的性能。</p>
<p>另一个关键优势是成本效益。通过利用倒排索引和密集嵌入压缩，Milvus 实现了五倍的性能提升，而召回率下降不到 1%。通过尾端剪枝和向量量化，内存使用量减少了 50%以上。</p>
<p>长查询优化是 Milvus 的一大优势。传统的 WAND 算法在处理长查询时非常吃力，而 Milvus 则通过将稀疏嵌入与图索引相结合，在高维稀疏向量搜索场景中实现了十倍的性能提升。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus：RAG 的终极向量数据库<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 功能全面，是 RAG 应用程序的首选。主要优势包括</p>
<ul>
<li><p>丰富的元数据支持，具有动态 Schema 功能和强大的过滤选项</p></li>
<li><p>企业级多租户，通过 Collections、分区和分区 Key 实现灵活隔离</p></li>
<li><p>业内首创的磁盘向量索引支持，提供从内存到 S3 的多层存储</p></li>
<li><p>云原生可扩展性，支持从 10M 到 1B+ 向量的无缝扩展</p></li>
<li><p>全面的搜索功能，包括分组、范围和混合搜索</p></li>
<li><p>与 LangChain、LlamaIndex、Dify 和其他人工智能工具的深度生态系统集成</p></li>
</ul>
<p>系统的多种搜索功能包括分组、范围和混合搜索方法。与 LangChain、LlamaIndex 和 Dify 等工具的深度集成，以及对众多人工智能产品的支持，使 Milvus 成为现代人工智能基础设施生态系统的中心。</p>
<h2 id="Looking-Forward" class="common-anchor-header">展望未来<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>随着人工智能从 POC 过渡到生产，Milvus 将继续发展。我们专注于使向量搜索更易于使用、更具成本效益，同时提高搜索质量。无论您是初创公司还是企业，Milvus 都能降低人工智能应用开发的技术壁垒。</p>
<p>对可访问性和创新的承诺使我们又向前迈进了一大步。虽然我们的开源解决方案仍是全球成千上万应用的基础，但我们认识到，许多企业需要一个完全托管的解决方案，以消除操作开销。</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud：托管解决方案<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>在过去三年中，我们在 Milvus 的基础上构建了完全托管的向量数据库服务<a href="https://zilliz.com/cloud">Zilliz Cloud</a>。通过对 Milvus 协议的云原生重新实施，它提供了更高的可用性、成本效率和安全性。</p>
<p>借鉴我们维护全球最大向量搜索集群和支持数千名人工智能应用开发人员的经验，与自托管解决方案相比，Zilliz Cloud 大大降低了操作符和成本。</p>
<p>准备好体验向量搜索的未来了吗？立即开始免费试用，无需信用卡，最高可获得 200 美元积分。</p>
