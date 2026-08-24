---
id: what-is-vector-database-and-how-it-works.md
title: 向量数据库到底是什么以及它如何工作
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: 向量数据库存储、索引和搜索由机器学习模型生成的向量嵌入，以实现快速信息检索和相似性搜索。
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>向量数据库用于索引和存储向量嵌入（vector embeddings），以支持快速检索和相似性搜索，并提供专为 AI 应用设计的 CRUD 操作、元数据过滤和水平扩展等能力。</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">引言：AI 时代向量数据库的崛起<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>在 ImageNet 的早期，需要 25,000 名人工标注员手动标注数据集。这个惊人的数字凸显了 AI 中的一个根本性挑战：人工对非结构化数据进行分类根本无法扩展。面对每天生成的数十亿张图片、视频、文档和音频文件，计算机理解和交互内容的方式亟需范式转变。</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">传统关系型数据库</a>系统擅长管理具有预定义格式的结构化数据，并执行精确的搜索操作。相比之下，向量数据库专注于通过称为向量嵌入（vector embeddings）的高维数值表示来存储和检索<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>类型，如图片、音频、视频和文本内容。向量数据库通过提供高效的数据检索和管理来支持<a href="https://zilliz.com/glossary/large-language-models-(llms)">大语言模型</a>。现代向量数据库通过面向硬件的优化（AVX512、SIMD、GPU、NVMe SSD）、高度优化的搜索算法（HNSW、IVF、DiskANN）以及列式存储设计，性能比传统系统高出 2-10 倍。其云原生的解耦架构支持搜索、数据插入和索引组件独立扩展，使系统能够高效处理数十亿向量，同时为 Salesforce、PayPal、eBay 和 NVIDIA 等企业的 AI 应用保持高性能。</p>
<p>这就是专家所称的"语义鸿沟"——传统数据库基于精确匹配和预定义关系进行运算，而人类对内容的理解是细致入微、依赖上下文且多维度的。随着 AI 应用提出以下需求，这一鸿沟变得越来越成问题：</p>
<ul>
<li><p>寻找概念上的相似性，而非精确匹配</p></li>
<li><p>理解不同内容片段之间的上下文关系</p></li>
<li><p>捕捉超越关键词的信息语义本质</p></li>
<li><p>在统一框架中处理多模态数据</p></li>
</ul>
<p>向量数据库已成为弥合这一鸿沟的关键技术，成为现代 AI 基础设施中不可或缺的组成部分。它们通过促进聚类和分类等任务来增强机器学习模型的性能。</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">理解向量嵌入：基础<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>是跨越语义鸿沟的关键桥梁。这些高维数值表示以计算机能够高效处理的形式捕捉非结构化数据的语义本质。现代嵌入模型将原始内容（无论是文本、图片还是音频）转换为密集向量，使相似的概念在向量空间中聚集在一起，而无论其表面形式有何不同。</p>
<p>例如，构造得当的嵌入会将"automobile"（汽车）、"car"（小汽车）和"vehicle"（车辆）等概念置于向量空间中相近的位置，尽管它们具有不同的词汇形式。这一特性使得<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>、<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推荐系统</a>和 AI 应用能够超越简单的模式匹配来理解内容。</p>
<p>嵌入的能力跨越了多种模态。先进的向量数据库在统一系统中支持各种非结构化数据类型——文本、图片、音频——从而实现了以前无法高效建模的跨模态搜索和关系。这些向量数据库能力对于聊天机器人和图像识别系统等 AI 驱动技术至关重要，支持语义搜索和推荐系统等高级应用。</p>
<p>然而，大规模存储、索引和检索嵌入带来了传统数据库无法应对的独特计算挑战。</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">向量数据库：核心概念<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库代表了我们在存储和查询非结构化数据方式上的范式转变。不同于擅长管理具有预定义格式的结构化数据的传统关系型数据库系统，向量数据库专长于通过数值向量表示来处理非结构化数据。</p>
<p>从其核心来看，向量数据库旨在解决一个根本性问题：在海量非结构化数据集中实现高效的相似性搜索。它们通过三个关键组件来实现这一点：</p>
<p><strong>向量嵌入</strong>：捕捉非结构化数据（文本、图片、音频等）语义含义的高维数值表示</p>
<p><strong>专用索引</strong>：针对高维向量空间优化的算法，能够实现快速的近似搜索。向量数据库对向量建立索引以提升相似性搜索的速度和效率，利用各种机器学习算法为向量嵌入创建索引。</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>距离度量</strong></a>：量化向量之间相似性的数学函数</p>
<p>向量数据库中的主要操作是 <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k 最近邻</a>（KNN）查询，即寻找与给定查询向量最相似的 k 个向量。对于大规模应用，这些数据库通常实现<a href="https://zilliz.com/glossary/anns">近似最近邻</a>（ANN）算法，用少量的精度损失换取搜索速度的显著提升。</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">向量相似性的数学基础</h3><p>理解向量数据库需要掌握向量相似性背后的数学原理。以下是基础概念：</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">向量空间与嵌入</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">向量嵌入</a>是一个固定长度的浮点数数组（维度范围可以从 100 到 32,768！），以数值格式表示非结构化数据。这些嵌入将相似的项目在高维向量空间中置于更接近的位置。</p>
<p>例如，在一个训练良好的词嵌入空间中，"king"（国王）和"queen"（王后）的向量表示之间的距离会小于它们各自与"automobile"（汽车）之间的距离。</p>
<h3 id="Distance-Metrics" class="common-anchor-header">距离度量</h3><p>距离度量的选择从根本上影响相似性的计算方式。常见的距离度量包括：</p>
<ol>
<li><p><strong>欧氏距离</strong>：欧氏空间中两点之间的直线距离。</p></li>
<li><p><strong>余弦相似性</strong>：衡量两个向量之间夹角的余弦值，关注方向而非大小。</p></li>
<li><p><strong>点积</strong>：对于归一化向量，表示两个向量的对齐程度。</p></li>
<li><p><strong>曼哈顿距离（L1 范数）</strong>：坐标之间绝对差的总和。</p></li>
</ol>
<p>不同的用例可能需要不同的距离度量。例如，余弦相似性通常适用于文本嵌入，而欧氏距离可能更适合某些类型的<a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">图像嵌入</a>。</p>
<p>向量空间中向量之间的<a href="https://zilliz.com/glossary/semantic-similarity">语义相似性</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>向量空间中向量之间的语义相似性</span>
  </span>
</p>
<p>理解这些数学基础引出了一个关于实现的重要问题：那么，只需给任何数据库添加一个向量索引就可以了，对吧？</p>
<p>仅仅在关系型数据库中添加向量索引是不够的，使用独立的<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">向量索引库</a>也不够。虽然向量索引提供了高效查找相似向量的关键能力，但它们缺乏生产级应用所需的基础设施：</p>
<ul>
<li><p>它们不提供用于管理向量数据的 CRUD 操作</p></li>
<li><p>它们缺乏元数据存储和过滤能力</p></li>
<li><p>它们没有内置的扩展、副本或容错机制</p></li>
<li><p>它们需要自定义基础设施来实现数据持久化和管理</p></li>
</ul>
<p>向量数据库的出现正是为了解决这些限制，提供专为向量嵌入设计的完整数据管理能力。它们将向量搜索的语义能力与数据库系统的操作能力相结合。</p>
<p>不同于基于精确匹配运算的传统数据库，向量数据库专注于语义搜索——即根据特定的距离度量寻找与查询向量"最相似"的向量。这一根本性差异驱动了支撑这些专用系统的独特架构和算法。</p>
<p>其他专用存储也遵循同样的逻辑——高吞吐量、按时间排序的事件数据通常存储在时序数据库中（如 <a href="https://questdb.com/">QuestDB</a>），而向量数据库则保存从中派生的嵌入。</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">向量数据库架构：技术框架<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>现代向量数据库实现了精细的多层架构，将关注点分离、实现可扩展性并确保可维护性。这一技术框架远超简单的搜索索引，能够构建处理生产级 AI 工作负载的系统。向量数据库通过处理和检索信息来支持 AI 和机器学习应用，利用近似最近邻搜索算法，将各种类型的原始数据转换为向量，并通过语义搜索高效管理多样化的数据类型。</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">四层架构</h3><p>生产级向量数据库通常由四个主要架构层组成：</p>
<ol>
<li><p><strong>存储层</strong>：管理向量数据和元数据的持久化存储，实现专门的编码和压缩策略，并针对向量特有的访问模式优化 I/O。</p></li>
<li><p><strong>索引层</strong>：维护多种索引算法，管理其创建和更新，并实现针对硬件的优化以提升性能。</p></li>
<li><p><strong>查询层</strong>：处理传入的查询，确定执行策略，处理结果集，并为重复查询实现缓存。</p></li>
<li><p><strong>服务层</strong>：管理客户端连接，处理请求路由，提供监控和日志记录，并实现安全性和多租户支持。</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">向量搜索工作流</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
    <span>向量搜索操作的完整工作流.png</span>
  </span>
</p>
<p>典型的向量数据库实现遵循以下工作流：</p>
<ol>
<li><p>机器学习模型将非结构化数据（文本、图片、音频）转换为向量嵌入</p></li>
<li><p>这些向量嵌入与相关元数据一起存储在数据库中</p></li>
<li><p>当用户执行查询时，使用<em>相同的</em>模型将查询转换为向量嵌入</p></li>
<li><p>数据库使用近似最近邻算法将查询向量与存储的向量进行比较</p></li>
<li><p>系统根据向量相似性返回最相关的 top-K 结果</p></li>
<li><p>可选的后处理阶段可能应用额外的过滤或重排序</p></li>
</ol>
<p>这一流水线使得在传统数据库方法无法处理的巨量非结构化数据集合上进行高效语义搜索成为可能。</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">向量数据库中的一致性</h4><p>在分布式向量数据库中确保一致性是一个挑战，因为需要在性能和正确性之间进行权衡。虽然最终一致性在大规模系统中很常见，但对于欺诈检测和实时推荐等关键任务应用，需要强一致性模型。基于仲裁的写入和分布式共识（例如 <a href="https://zilliz.com/learn/raft-or-not">Raft</a>、Paxos）等技术可在不过度牺牲性能的情况下确保数据完整性。</p>
<p>生产级实现采用共享存储架构，实现存储与计算分离。这种分离遵循数据平面和控制平面分离的原则，每一层都可独立扩展，以实现最佳的资源利用。</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">管理连接、安全性与多租户</h3><p>由于这些数据库用于多用户和多租户环境，保护数据安全和管理访问控制对于维护机密性至关重要。</p>
<p>加密等安全措施（包括静态加密和传输加密）可保护敏感数据，如嵌入和元数据。身份验证和授权确保只有授权用户才能访问系统，并通过细粒度权限来管理对特定数据的访问。</p>
<p>访问控制通过定义角色和权限来限制数据访问。这对于存储客户数据或专有 AI 模型等敏感信息的数据库尤为重要。</p>
<p>多租户涉及隔离每个租户的数据以防止未经授权的访问，同时实现资源共享。这通过分片、分区或行级安全来实现，为不同团队或客户端提供可扩展且安全的访问。</p>
<p>外部身份和访问管理（IAM）系统与向量数据库集成，以执行安全策略并确保符合行业标准。</p>
<h2 id="Advantages-of-Vector-Databases" class="common-anchor-header">向量数据库的优势<button data-href="#Advantages-of-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库相比传统数据库具有多项优势，使其成为处理向量数据的理想选择。以下是一些关键优势：</p>
<ol>
<li><p><strong>高效的相似性搜索</strong>：向量数据库最突出的特性之一是其执行高效语义搜索的能力。不同于依赖精确匹配的传统数据库，向量数据库擅长查找与给定查询向量相似的数据点。这一能力对于推荐系统等应用至关重要，因为查找与用户过往交互相似的项目可以显著提升用户体验。</p></li>
<li><p><strong>处理高维数据</strong>：向量数据库专门为高效管理高维数据而设计。这使得它们特别适合自然语言处理、<a href="https://zilliz.com/learn/what-is-computer-vision">计算机视觉</a>和基因组学等应用，这些领域的数据通常存在于高维空间中。通过利用先进的索引和搜索算法，向量数据库即使在复杂的向量嵌入数据集中也能快速检索相关数据点。</p></li>
<li><p><strong>可扩展性</strong>：可扩展性是现代 AI 应用的关键要求，而向量数据库正是为高效扩展而构建的。无论是处理数百万还是数十亿向量，向量数据库都能通过水平扩展来满足 AI 应用日益增长的需求。这确保了即使数据量增加，性能也能保持一致。</p></li>
<li><p><strong>灵活性</strong>：向量数据库在数据表示方面提供了卓越的灵活性。它们可以存储和管理各种类型的数据，包括数值特征、来自文本或图像的嵌入，甚至分子结构等复杂数据。这种多样性使向量数据库成为从文本分析到科学研究等广泛应用的强大工具。</p></li>
<li><p><strong>实时应用</strong>：许多向量数据库针对实时或近实时查询进行了优化。这对于需要快速响应的应用尤为重要，如欺诈检测、实时推荐和交互式 AI 系统。快速相似性搜索的能力确保这些应用能够提供及时且相关的结果。</p></li>
</ol>
<h2 id="Use-Cases-for-Vector-Databases" class="common-anchor-header">向量数据库的用例<button data-href="#Use-Cases-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库在各行各业都有广泛的应用，展示了其多样性和强大能力。以下是一些值得关注的用例：</p>
<ol>
<li><p><strong>自然语言处理</strong>：在自然语言处理（NLP）领域，向量数据库发挥着至关重要的作用。它们被用于文本分类、情感分析和语言翻译等任务。通过将文本转换为高维向量嵌入，向量数据库能够实现高效的相似性搜索和语义理解，从而增强 <a href="https://zilliz.com/learn/7-nlp-models">NLP 模型</a>的性能。</p></li>
<li><p><strong>计算机视觉</strong>：向量数据库在计算机视觉应用中也得到广泛使用。图像识别、<a href="https://zilliz.com/learn/what-is-object-detection">目标检测</a>和图像分割等任务都受益于向量数据库处理高维图像嵌入的能力。这使得快速准确地检索视觉上相似的图像成为可能，使向量数据库在自动驾驶、医学影像和数字资产管理等领域不可或缺。</p></li>
<li><p><strong>基因组学</strong>：在基因组学中，向量数据库用于存储和分析基因序列、蛋白质结构和其他分子数据。这些数据的高维特性使向量数据库成为管理和查询大型基因组数据集的理想选择。研究人员可以执行向量搜索来查找具有相似模式的基因序列，帮助发现遗传标记并理解复杂的生物过程。</p></li>
<li><p><strong>推荐系统</strong>：向量数据库是现代推荐系统的基石。通过将用户交互和项目特征存储为向量嵌入，这些数据库可以快速识别与用户过去交互过的项目相似的项目。这一能力提高了推荐的准确性和相关性，提升了用户满意度和参与度。</p></li>
<li><p><strong>聊天机器人与虚拟助手</strong>：向量数据库用于聊天机器人和虚拟助手中，为用户查询提供实时的上下文相关答案。通过将用户输入转换为向量嵌入，这些系统可以执行相似性搜索以找到最相关的回复。这使得聊天机器人和虚拟助手能够提供更准确且符合上下文的答案，从而增强整体用户体验。</p></li>
</ol>
<p>通过利用向量数据库的独特能力，各行各业的组织可以构建更智能、响应更迅速且可扩展的 AI 应用。</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">向量搜索算法：从理论到实践<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库需要专门的索引<a href="https://zilliz.com/learn/vector-index">算法</a>，以便在高维空间中实现高效的相似性搜索。算法的选择直接影响准确性、速度、内存使用和可扩展性。</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">基于图的方法</h3><p><strong>HNSW（</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>分层可导航小世界网络</strong></a><strong>）</strong>通过连接相似向量来创建可导航的结构，从而在搜索过程中实现高效遍历。HNSW 限制每个节点的最大连接数和搜索范围，以平衡性能和准确性，使其成为向量相似性搜索中使用最广泛的算法之一。</p>
<p><strong>Cagra</strong> 是一种专门针对 GPU 加速优化的基于图的索引。它构建与 GPU 处理模式相适应的可导航图结构，从而实现大规模的并行向量比较。Cagra 的高效之处在于它能够通过可配置参数（如图的度和搜索宽度）来平衡召回率和性能。使用配备 Cagra 的推理级 GPU 可能比昂贵的训练级硬件更具成本效益，同时仍能提供高吞吐量，尤其是对于大规模向量集合。不过值得注意的是，除非在高查询压力下运行，否则与 CPU 索引相比，Cagra 等 GPU 索引不一定能降低延迟。</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">量化技术</h3><p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>乘积量化（PQ）</strong></a>将高维向量分解为较小的子向量，并分别对每个子向量进行量化。这显著减少了存储需求（通常减少 90% 以上），但会引入一定程度的精度损失。</p>
<p><strong>标量量化（SQ）</strong>将 32 位浮点数转换为 8 位整数，内存使用减少 75%，且对精度影响极小。</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">磁盘索引：经济高效的扩展</h3><p>对于大规模向量集合（1 亿以上向量），内存索引的成本变得过高。例如，1 亿个 1024 维向量大约需要 400GB 内存。这正是 DiskANN 等磁盘索引算法能带来显著成本优势的地方。</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> 基于 Vamana 图算法，能够在将大部分索引存储在 NVMe SSD 而非内存中的情况下实现高效的向量搜索。这种方法具有多项成本优势：</p>
<ul>
<li><p><strong>降低硬件成本</strong>：组织可以使用配置适中的商用硬件进行大规模向量搜索部署</p></li>
<li><p><strong>降低运营支出</strong>：更少的内存意味着数据中心更低的功耗和散热成本</p></li>
<li><p><strong>线性成本扩展</strong>：内存成本随数据量线性增长，而性能保持相对稳定</p></li>
<li><p><strong>优化 I/O 模式</strong>：DiskANN 的专门设计通过精细的图遍历策略最大限度地减少磁盘读取</p></li>
</ul>
<p>其代价通常是查询延迟略有增加（通常仅为 2-3 毫秒），相比纯内存方法，这对于许多生产用例来说是可以接受的。</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">专用索引类型</h3><p><strong>二值嵌入索引</strong>专为计算机视觉、图像指纹识别和推荐系统而设计，在这些场景中数据可以表示为二值特征。这些索引服务于不同的应用需求。对于精确匹配至关重要的图像去重、数字水印和版权检测，优化的二值索引可提供精确的相似性检测。对于将速度优先于完美召回率的高吞吐量推荐系统、基于内容的图像检索和大规模特征匹配，二值索引提供了卓越的性能优势。</p>
<p><strong>稀疏向量索引</strong>针对大多数元素为零、仅有少数非零值的向量进行了优化。与稠密向量（其中大部分或所有维度都包含有意义的值）不同，稀疏向量高效地表示维度多但活跃特征少的数据。这种表示在文本处理中尤为常见，因为一篇文档可能只使用词汇表中所有可能词语的一小部分。稀疏向量索引在语义文档搜索、全文查询和主题建模等自然语言处理任务中表现出色。这些索引对于大型文档集合的企业搜索、需要高效定位特定术语和概念的法律文档发现，以及为包含专业术语的数百万篇论文建立索引的学术研究平台尤为有价值。</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">高级查询能力<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库的核心在于其执行高效语义搜索的能力。向量搜索能力涵盖从基础的相似性匹配到用于提升相关性和多样性的高级技术。</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">基础 ANN 搜索</h3><p>近似最近邻（ANN）搜索是向量数据库中最基础的搜索方法。不同于将查询向量与数据库中的每个向量进行比较的精确 k 最近邻（kNN）搜索，ANN 搜索利用索引结构快速识别可能最相似的向量子集，从而大幅提升性能。</p>
<p>ANN 搜索的关键组件包括：</p>
<ul>
<li><p><strong>查询向量</strong>：所搜索内容的向量表示</p></li>
<li><p><strong>索引结构</strong>：用于组织向量以实现高效检索的预构建数据结构</p></li>
<li><p><strong>度量类型</strong>：用于衡量向量之间相似性的数学函数，如欧氏距离（L2）、余弦相似性或内积</p></li>
<li><p><strong>Top-K 结果</strong>：要返回的最相似向量的指定数量</p></li>
</ul>
<p>向量数据库提供多种优化以提升搜索效率：</p>
<ul>
<li><p><strong>批量向量搜索</strong>：并行使用多个查询向量进行搜索</p></li>
<li><p><strong>分区搜索</strong>：将搜索限制在特定的数据分区内</p></li>
<li><p><strong>分页</strong>：使用 limit 和 offset 参数检索大型结果集</p></li>
<li><p><strong>输出字段选择</strong>：控制结果中返回哪些实体字段</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">高级搜索技术</h3><h4 id="Range-Search" class="common-anchor-header">范围搜索</h4><p>范围搜索通过将结果限制为相似性分数在特定范围内的向量来提高结果相关性。与返回 top-K 个最相似向量的标准 ANN 搜索不同，范围搜索使用以下参数定义一个"环形区域"：</p>
<ul>
<li><p>外边界（radius），设定最大允许距离</p></li>
<li><p>内边界（range_filter），可排除过于相似的向量</p></li>
</ul>
<p>当您想查找"相似但不相同"的项目时，这种方法特别有用，例如与用户已查看过的内容相关但不完全重复的产品推荐。</p>
<h4 id="Filtered-Search" class="common-anchor-header">过滤搜索</h4><p>过滤搜索将向量相似性与元数据约束相结合，将结果缩小到符合特定条件的向量。例如，在产品目录中，您可以查找视觉上相似的商品，但将结果限制在特定品牌或价格范围内。</p>
<p>高度可扩展的向量数据库支持两种过滤方法：</p>
<ul>
<li><p><strong>标准过滤</strong>：在向量搜索之前应用元数据过滤，显著减少候选集</p></li>
<li><p><strong>迭代过滤</strong>：先执行向量搜索，然后对每个结果应用过滤，直到达到所需的匹配数量</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">文本匹配</h4><p>文本匹配基于特定术语实现精确的文档检索，以精确文本匹配能力补充向量相似性搜索。与查找概念上相似内容的语义搜索不同，文本匹配专注于查找查询术语的精确出现。</p>
<p>例如，产品搜索可能会将文本匹配（查找明确提及"防水"的产品）与向量相似性（查找视觉上相似的产品）相结合，以确保同时满足语义相关性和特定功能要求。</p>
<h4 id="Grouping-Search" class="common-anchor-header">分组搜索</h4><p>分组搜索按指定字段对结果进行聚合，以提高结果多样性。例如，在每段文字都是独立向量的文档集合中，分组可确保结果来自不同的文档，而不是同一文档的多个段落。</p>
<p>这一技术在以下场景中很有价值：</p>
<ul>
<li><p>需要不同来源代表性的文档检索系统</p></li>
<li><p>需要呈现多样化选项的推荐系统</p></li>
<li><p>结果多样性与相似性同等重要的搜索系统</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">混合搜索</h4><p>混合搜索组合来自多个向量字段的结果，每个字段可能代表数据的不同方面或使用不同的嵌入模型。这实现了：</p>
<ul>
<li><p><strong>稀疏-稠密向量组合</strong>：将语义理解（稠密向量）与关键词匹配（稀疏向量）相结合，实现更全面的文本搜索</p></li>
<li><p><strong>多模态搜索</strong>：跨不同数据类型查找匹配项，例如同时使用图像和文本输入搜索产品</p></li>
</ul>
<p>混合搜索实现使用精细的重排序策略来组合结果：</p>
<ul>
<li><p><strong>加权排序</strong>：优先考虑来自特定向量字段的结果</p></li>
<li><p><strong>倒数排名融合</strong>：在所有向量字段之间平衡结果，不进行特定侧重</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">全文搜索</h4><p>现代向量数据库中的全文搜索能力弥合了传统文本搜索与向量相似性之间的差距。这些系统：</p>
<ul>
<li><p>自动将原始文本查询转换为稀疏嵌入</p></li>
<li><p>检索包含特定术语或短语的文档</p></li>
<li><p>根据术语相关性和语义相似性对结果进行排序</p></li>
<li><p>通过捕捉语义搜索可能遗漏的精确匹配来补充向量搜索</p></li>
</ul>
<p>这种混合方法对于需要同时具备精确术语匹配和语义理解的综合性<a href="https://zilliz.com/learn/what-is-information-retrieval">信息检索</a>系统尤为有价值。</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">性能工程：关键指标<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库的性能优化需要理解关键指标及其权衡关系。</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">召回率与吞吐量的权衡</h3><p>召回率衡量在返回结果中找到真正最近邻的比例。更高的召回率需要更广泛的搜索，从而降低吞吐量（每秒查询数）。生产系统根据应用需求来平衡这些指标，通常根据用例将召回率目标设定在 80-99% 之间。</p>
<p>在评估向量数据库性能时，ANN-Benchmarks 等标准化基准测试环境提供了有价值的对比数据。这些工具衡量的关键指标包括：</p>
<ul>
<li><p>搜索召回率：在返回结果中找到真正最近邻的查询比例</p></li>
<li><p>每秒查询数（QPS）：数据库在标准化条件下处理查询的速率</p></li>
<li><p>在不同数据集大小和维度下的性能表现</p></li>
</ul>
<p>另一种选择是名为 <a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a> 的开源基准测试系统。VectorDBBench 是一个<a href="https://github.com/zilliztech/VectorDBBench">开源基准测试工具</a>，旨在使用用户自己的数据集评估和比较 Milvus、Zilliz Cloud 等主流向量数据库的性能。它还能帮助开发人员为其用例选择最合适的向量数据库。</p>
<p>这些基准测试使组织能够根据其特定需求，在考虑准确性、速度和可扩展性之间的平衡后，确定最合适的向量数据库实现。</p>
<h3 id="Memory-Management" class="common-anchor-header">内存管理</h3><p>高效的内存管理使向量数据库能够扩展到数十亿向量，同时保持性能：</p>
<ul>
<li><p><strong>动态分配</strong>根据工作负载特征调整内存使用</p></li>
<li><p><strong>缓存策略</strong>将频繁访问的向量保留在内存中</p></li>
<li><p><strong>向量压缩技术</strong>显著降低内存需求</p></li>
</ul>
<p>对于超出内存容量的数据集，基于磁盘的解决方案提供了关键能力。这些算法通过束搜索和基于图的导航等技术优化 NVMe SSD 的 I/O 模式。</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">高级过滤与混合搜索</h3><p>向量数据库将语义相似性与传统过滤相结合，创建强大的查询能力：</p>
<ul>
<li><p><strong>预过滤</strong>在向量搜索之前应用元数据约束，减少用于相似性比较的候选集</p></li>
<li><p><strong>后过滤</strong>先执行向量搜索，再对结果应用过滤</p></li>
<li><p><strong>元数据索引</strong>通过针对不同数据类型使用专用索引来提升过滤性能</p></li>
</ul>
<p>高性能的向量数据库支持将多个向量字段与标量约束相结合的综合查询模式。多向量查询可同时查找与多个参考点相似的实体，而负向量查询则排除与指定示例相似的向量。</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">生产环境中向量数据库的扩展<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库需要审慎的部署策略，以确保在不同规模下实现最佳性能：</p>
<ul>
<li><p><strong>小规模部署</strong>（数百万向量）可以在具有足够内存的单台机器上有效运行</p></li>
<li><p><strong>中等规模部署</strong>（数千万到数亿）受益于使用高内存实例和 SSD 存储的垂直扩展</p></li>
<li><p><strong>十亿级部署</strong>需要跨多个具有专门角色的节点进行水平扩展</p></li>
</ul>
<p>分片和复制构成了可扩展向量数据库架构的基础：</p>
<ul>
<li><p><strong>水平分片</strong>将 Collections 分布到多个节点上</p></li>
<li><p><strong>复制</strong>创建数据的冗余副本，同时提高容错能力和查询吞吐量</p></li>
</ul>
<p>现代系统会根据查询模式和可靠性要求动态调整复制因子。</p>
<h2 id="Real-World-Impact" class="common-anchor-header">实际影响<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>高性能向量数据库的灵活性在其部署选项中得到了充分体现。系统可以在一系列环境中运行，从笔记本电脑上进行原型验证的轻量级安装，到管理数百亿向量的庞大分布式集群。这种可扩展性使组织无需更换数据库技术即可从概念验证走向生产部署。</p>
<p>Salesforce、PayPal、eBay、NVIDIA、IBM 和 Airbnb 等公司现在依靠开源 <a href="https://milvus.io/">Milvus</a> 等向量数据库来驱动大规模 AI 应用。这些实现涵盖各种用例——从精细的产品推荐系统到内容审核、欺诈检测和客户支持自动化——所有这些都建立在向量搜索的基础之上。</p>
<p>近年来，向量数据库在解决 LLM 中常见的幻觉问题方面变得至关重要，它提供特定领域、最新或机密的数据。例如，<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 将专业数据存储为向量嵌入。当用户提出问题时，它会将查询转换为向量，执行 ANN 搜索以获取最相关的结果，并将这些结果与原始问题相结合，为大语言模型构建全面的上下文。这一框架为开发可靠的 LLM 驱动应用奠定了基础，使这些应用能够生成更准确且与上下文更相关的回复。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库的崛起不仅仅代表一项新技术——它标志着我们在为 AI 应用进行数据管理的方式上发生了根本性转变。通过弥合非结构化数据与计算系统之间的鸿沟，向量数据库已成为现代 AI 基础设施中不可或缺的组成部分，使应用能够以越来越接近人类的方式理解和处理信息。</p>
<p>向量数据库相比传统数据库系统的关键优势包括：</p>
<ul>
<li><p>高维搜索：对用于机器学习和生成式 AI 应用的高维向量进行高效相似性搜索</p></li>
<li><p>可扩展性：水平扩展，实现大规模向量集合的高效存储和检索</p></li>
<li><p>混合搜索的灵活性：处理各种向量数据类型，包括稀疏和稠密向量</p></li>
<li><p>性能：与传统数据库相比，向量相似性搜索速度显著更快</p></li>
<li><p>可定制的索引：支持针对特定用例和数据类型优化的自定义索引方案</p></li>
</ul>
<p>随着 AI 应用变得越来越复杂，对向量数据库的要求也在不断演变。现代系统必须在性能、准确性、扩展和成本效益之间取得平衡，同时与更广泛的 AI 生态系统无缝集成。对于希望在规模化层面实施 AI 的组织来说，理解向量数据库技术不仅仅是一个技术考量——更是一项战略要务。</p>
