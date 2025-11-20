---
id: power-high-performance-rag-for-genai-with-hpe-alletra-storag-mp-milvus.md
title: 利用 HPE Alletra Storage MP + Milvus 为 GenAI 的高性能 RAG 提供动力
author: Denise Ochoa-Mendoza
date: 2025-11-10T00:00:00.000Z
cover: assets.zilliz.com/hpe_cover_ead19ff709.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, HPE, Alletra Storage MP X10000, vector database, RAG'
meta_title: Optimized RAG with HPE Alletra Storage MP X10000 + Milvus
desc: >-
  利用 HPE Alletra Storage MP X10000 和 Milvus 提升
  GenAI。获得可扩展、低延迟的向量搜索和企业级存储，以实现快速、安全的 RAG。
origin: >-
  https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369
---
<p><em>这篇文章最初发表在<a href="https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369">HPE Community</a>上，经授权在此转发。</em></p>
<p>HPE Alletra Storage MP X10000 和 Milvus 为可扩展、低延迟的 RAG 提供动力，使 LLMs 能够通过高性能向量搜索为 GenAI 工作负载提供准确、上下文丰富的响应。</p>
<h2 id="In-generative-AI-RAG-needs-more-than-just-an-LLM" class="common-anchor-header">在生成式人工智能中，RAG 需要的不仅仅是 LLM<button data-href="#In-generative-AI-RAG-needs-more-than-just-an-LLM" class="anchor-icon" translate="no">
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
    </button></h2><p>上下文可以释放生成式人工智能（GenAI）和大型语言模型（LLM）的真正威力。当 LLM 有正确的信号来引导其响应时，它就能提供准确、相关和可信的答案。</p>
<p>试想一下：如果你带着一个没有卫星信号的 GPS 设备掉进了茂密的丛林。屏幕上显示的是地图，但没有你当前的位置，它对导航毫无用处。相反，卫星信号很强的 GPS 不仅能显示地图，还能为你提供逐向导航。</p>
<p>这就是检索增强生成（RAG）对 LLMs 的作用。模型已经有了地图（它的预训练知识），但还没有方向（你的特定领域数据）。没有 RAG 的 LLMs 就像 GPS 设备，充满了知识却没有实时方向。RAG 提供了一个信号，告诉模型它在哪里，该往哪里去。</p>
<p>RAG 将模型的响应建立在可信的、最新的知识基础上，这些知识来自特定领域的内容，包括政策、产品文档、票据、PDF、代码、音频脚本、图像等。让 RAG 大规模运行具有挑战性。检索过程需要足够快，以保持无缝的用户体验；足够准确，以返回最相关的信息；即使系统处于高负荷状态，检索过程也要具有可预测性。这意味着要在不降低性能的情况下处理高查询量、持续数据摄取以及索引构建等后台任务。使用少量 PDF 启动 RAG 管道相对简单。但是，当扩展到数百个 PDF 时，难度就大大增加了。你不可能把所有东西都保存在内存中，因此一个强大而高效的存储策略对于管理嵌入、索引和检索性能至关重要。RAG 需要一个向量数据库和一个能跟上并发量和数据量增长的存储层。</p>
<h2 id="Vector-databases-power-RAG" class="common-anchor-header">向量数据库为 RAG 提供动力<button data-href="#Vector-databases-power-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 的核心是语义搜索，即通过意义而不是准确的关键词来查找信息。这就是向量数据库的用武之地。矢量数据库存储文本、图像和其他非结构化数据的高维 Embeddings，可进行相似性搜索，为您的查询检索最相关的上下文。Milvus 就是一个领先的例子：它是一个云原生的开源向量数据库，专为十亿规模的相似性搜索而构建。它支持混合搜索，将向量相似性与关键字和标量过滤器相结合，以提高精确度，并提供独立的计算和存储扩展，以及 GPU 感知的加速优化选项。Milvus 还通过智能段生命周期管理数据，通过压缩和多种近似近邻（ANN）索引选项（如 HNSW 和 DiskANN），从增长段到封存段，确保 RAG 等实时人工智能工作负载的性能和可扩展性。</p>
<h2 id="The-hidden-challenge-Storage-throughput--latency" class="common-anchor-header">隐藏的挑战：存储吞吐量和延迟<button data-href="#The-hidden-challenge-Storage-throughput--latency" class="anchor-icon" translate="no">
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
    </button></h2><p>向量搜索工作负载给系统的每个部分都带来了压力。它们要求高并发摄取，同时为交互式查询保持低延迟检索。同时，索引构建、压缩和数据重载等后台操作必须在不影响实时性能的情况下运行。传统架构中的许多性能瓶颈都可追溯到存储。无论是输入/输出（I/O）限制、元数据查找延迟还是并发限制。要想大规模提供可预测的实时性能，存储层必须跟上向量数据库的需求。</p>
<h2 id="The-storage-foundation-for-high-performance-vector-search" class="common-anchor-header">高性能向量搜索的存储基础<button data-href="#The-storage-foundation-for-high-performance-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.hpe.com/in/en/alletra-storage-mp-x10000.html">HPE Alletra Storage MP X10000</a>是经过闪存优化、全 NVMe、兼容 S3 的对象存储平台，专为大规模实时性能而设计。与传统的以容量为重点的对象存储不同，HPE Alletra Storage MP X10000 专为向量搜索等低延迟、高吞吐量工作负载而设计。其日志结构的键值引擎和基于范围的元数据可实现高度并行的读写，而 GPUDirect RDMA 可提供零拷贝数据路径，从而降低 CPU 开销并加速数据向 GPU 的移动。该架构支持分解扩展，允许容量和性能独立增长，并包含加密、基于角色的访问控制（RBAC）、不变性和数据持久性等企业级功能。结合其云原生设计，HPE Alletra Storage MP X10000 可与 Kubernetes 环境无缝集成，是 Milvus 部署的理想存储基础。</p>
<h2 id="HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="common-anchor-header">HPE Alletra Storage MP X10000 和 Milvus：RAG 的可扩展基础<button data-href="#HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>HPE Alletra Storage MP X10000 和 Milvus 相辅相成，可提供快速、可预测和易于扩展的 RAG。图 1 展示了可扩展人工智能用例和 RAG 管道的架构，显示了部署在容器化环境中的 Milvus 组件如何与 HPE Alletra Storage MP X10000 的高性能对象存储进行交互。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Architecture_of_scalable_AI_use_cases_and_RAG_pipeline_using_HPE_Alletra_Storage_MP_X10000_and_Milvus_ed3a87a5ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 清晰地将计算与存储分离，而 HPE Alletra Storage MP X10000 则提供高吞吐量、低延迟的对象访问，与向量工作负载保持同步。它们共同实现了可预测的扩展性能：Milvus 将查询分布到各个分片，而 HPE Alletra Storage MP X10000 的分数、多维扩展可在数据和 QPS 增长时保持延迟一致。简单地说，您可以在需要的时候增加所需的容量或性能。操作简便是另一个优势：HPE Alletra Storage MP X10000 可从单个存储桶维持最高性能，消除了复杂的分层，而企业功能（加密、RBAC、不变性、稳健耐用性）支持内部部署或混合部署，具有强大的数据主权和一致的服务级目标 (SLO)。</p>
<p>当向量搜索规模扩大时，存储往往因摄取、压缩或检索速度慢而受到指责。有了 HPE Alletra Storage MP X10000 上的 Milvus，这种说法就会改变。该平台的全 NVMe、日志结构架构和 GPUDirect RDMA 选项可提供一致、超低延迟的对象访问 - 即使在并发严重的情况下以及在索引构建和重新加载等生命周期操作期间也是如此。在实践中，您的 RAG 流水线仍然是计算绑定的，而不是存储绑定的。随着 Collections 的增长和查询量的激增，Milvus 保持响应速度，同时 HPE Alletra Storage MP X10000 保留 I/O 净空，从而在不重新架构存储的情况下实现可预测的线性可扩展性。当 RAG 部署规模超过最初的概念验证阶段并进入全面生产阶段时，这一点变得尤为重要。</p>
<h2 id="Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="common-anchor-header">企业就绪的 RAG：可扩展、可预测，专为 GenAI 打造<button data-href="#Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="anchor-icon" translate="no">
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
    </button></h2><p>对于 RAG 和实时 GenAI 工作负载，HPE Alletra Storage MP X10000 与 Milvus 的组合提供了一个未来就绪的基础，可放心扩展。该集成解决方案使企业能够构建快速、弹性和安全的智能系统，而不会降低性能或可管理性。Milvus 通过模块化扩展提供分布式、GPU 加速的向量搜索，而 HPE Alletra Storage MP X10000 则确保超快、低延迟的对象访问，并提供企业级的耐用性和生命周期管理。它们共同实现了计算与存储的解耦，即使数据量和查询复杂性增加，也能实现可预测的性能。无论您是提供实时推荐、支持语义搜索，还是在数十亿个向量之间进行扩展，该架构都能使您的 RAG 管道保持快速响应、经济高效和云优化。通过与 Kubernetes 和 HPE GreenLake 云的无缝集成，您可以获得统一管理、基于消耗的定价以及在混合云或私有云环境中部署的灵活性。HPE Alletra Storage MP X10000 和 Milvus：针对现代 GenAI 的需求而构建的可扩展、高性能 RAG 解决方案。</p>
