---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: 揭开 Milvus 2.4 的神秘面纱：多向量搜索、稀疏向量、CAGRA 索引等！
author: Fendy Feng
date: 2024-3-20
desc: 我们很高兴地宣布推出 Milvus 2.4，这是在增强大规模数据集搜索能力方面的一大进步。
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>我们很高兴地宣布推出 Milvus 2.4，这是在增强大规模数据集搜索能力方面取得的重大进展。这个最新版本增加了一些新功能，如支持基于 GPU 的 CAGRA 索引、对<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">稀疏嵌入的</a>测试版支持、分组搜索以及搜索功能方面的其他各种改进。这些发展加强了我们对社区的承诺，为像您这样的开发人员提供了处理和查询向量数据的强大而高效的工具。让我们一起来了解 Milvus 2.4 的主要优势。</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">启用多向量搜索，简化多模式搜索<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 提供多矢量搜索功能，允许在同一 Milvus 系统中同时搜索不同类型的矢量并进行 Rerankers。这一功能简化了多模态搜索，显著提高了召回率，使开发人员能够轻松管理具有不同数据类型的复杂人工智能应用。此外，该功能还简化了自定义<a href="https://zilliz.com/vector-database-use-cases/recommender-system">Rerankers</a>模型的集成和微调，有助于创建高级搜索功能，如利用多维数据洞察力的精确<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推荐系统</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
    多 </span> <span class="img-wrapper"> <span>向量搜索功能的工作原理</span> </span></p>
<p>Milvus 的多矢量支持有两个组成部分：</p>
<ol>
<li><p>在一个 Collections 中为一个实体存储/查询多个向量的能力，这是一种更自然的数据组织方式</p></li>
<li><p>通过利用 Milvus 中预置的重排算法来构建/优化重排算法的能力</p></li>
</ol>
<p>除了是一项<a href="https://github.com/milvus-io/milvus/issues/25639">要求</a>很高的<a href="https://github.com/milvus-io/milvus/issues/25639">功能</a>外，我们之所以构建这项功能，还因为随着 GPT-4 和 Claude 3 的发布，业界正在向多模态模型发展。Rerankers 是进一步提高搜索查询性能的常用技术。我们的目标是让开发人员在 Milvus 生态系统内轻松构建和优化他们的 Rerankers。</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">支持分组搜索，提高计算效率<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>分组搜索是我们在 Milvus 2.4 中添加的另一项经常被<a href="https://github.com/milvus-io/milvus/issues/25343">要求的功能</a>。它集成了专为 BOOL、INT 或 VARCHAR 类型字段设计的分组操作，填补了执行大规模分组查询的关键效率空白。</p>
<p>传统上，开发人员依赖于广泛的 Top-K 搜索，然后通过手动后处理来提炼特定分组的结果，这是一种计算密集、代码繁重的方法。分组搜索通过有效地将查询结果与文档或视频名称等集合分组标识符联系起来，改进了这一过程，从而简化了对大型数据集中分段实体的处理。</p>
<p>Milvus 的分组搜索采用基于迭代器的实现方式，与同类技术相比，计算效率明显提高。这种选择确保了卓越的性能可扩展性，特别是在计算资源优化至关重要的生产环境中。通过减少数据遍历和计算开销，Milvus 支持更高效的查询处理，与其他向量数据库相比，显著缩短了响应时间，降低了操作符成本。</p>
<p>分组搜索增强了 Milvus 管理大容量复杂查询的能力，并与高性能计算实践相一致，从而提供了强大的数据管理解决方案。</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">稀疏向量嵌入测试版支持<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">稀疏矢量嵌入</a>是传统密集向量方法的范式转变，它迎合了语义相似性的细微差别，而不仅仅是关键词频率。这种区别使搜索能力更加细致入微，与查询和文档的语义内容密切相关。稀疏向量模型在信息检索和自然语言处理中尤为有用，与密集向量模型相比，稀疏向量模型具有强大的域外搜索能力和可解释性。</p>
<p>在 Milvus 2.4 中，我们扩展了混合搜索功能，使其包括由 SPLADEv2 等高级神经模型或 BM25 等统计模型生成的稀疏嵌入。在 Milvus 中，稀疏向量与稠密向量同等对待，可以创建具有稀疏向量场的 Collections、插入数据、建立索引和执行相似性搜索。值得注意的是，Milvus 中的稀疏 Embeddings 支持<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">内积</a>（IP）距离度量，鉴于其高维特性，这一点非常有利，使得其他度量方法的效果大打折扣。该功能还支持维数为无符号 32 位整数、值为 32 位浮点数的数据类型，从而促进了从细微文本搜索到复杂<a href="https://zilliz.com/learn/information-retrieval-metrics">信息检索</a>系统的广泛应用。</p>
<p>有了这一新功能，Milvus 可以实现混合搜索方法，将关键字和基于 Embeddings 的技术融为一体，为从以关键字为中心的搜索框架转向寻求全面、低维护解决方案的用户提供无缝过渡。</p>
<p>我们将该功能标记为 "测试版"，以继续对该功能进行性能测试，并收集社区的反馈意见。稀疏向量支持功能预计将在 Milvus 3.0 发布时全面推出 (GA)。</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">高级 GPU 加速图形索引的 CAGRA 索引支持<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://arxiv.org/abs/2308.15136">CAGRA</a>(Cuda Anns GRAph-based) 由英伟达™（NVIDIA®）开发，是一种基于 GPU 的图形索引技术，在效率和性能方面大大超过了传统的基于 CPU 的方法（如 HNSW 索引），尤其是在高吞吐量环境中。</p>
<p>随着 CAGRA 索引的引入，Milvus 2.4 提供了增强的 GPU 加速图索引能力。这一增强功能非常适合构建需要最小延迟的相似性搜索应用。此外，Milvus 2.4 还将暴力搜索与 CAGRA 索引整合在一起，以在应用中实现最大召回率。如需详细了解，请浏览<a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">有关 CAGRA 的介绍博客</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Raft CAGRA 与 Milvus HNSW 的比较</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">其他增强功能和特性<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 还包括其他关键增强功能，例如支持正则表达式以增强<a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">元</a>数据过滤中的子字符串匹配、用于高效标量数据类型过滤的新标量反转索引，以及用于监控和复制 Milvus Collections 中更改的更改数据捕获工具。这些更新共同增强了 Milvus 的性能和多功能性，使其成为复杂数据操作的全面解决方案。</p>
<p>更多详情，请参阅<a href="https://milvus.io/docs/release_notes.md">Milvus 2.4 文档</a>。</p>
<h2 id="Stay-Connected" class="common-anchor-header">保持联系！<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>想进一步了解 Milvus 2.4？<a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">参加我们即将举行的网络研讨会</a>，与 Zilliz 工程副总裁 James Luan 深入探讨这一最新版本的功能。如果您有问题或反馈，请加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>，与我们的工程师和社区成员交流。别忘了在<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>上关注我们，了解有关 Milvus 的最新消息和更新。</p>
