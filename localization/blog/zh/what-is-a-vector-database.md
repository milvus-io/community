---
id: what-is-vector-database-and-how-it-works.md
title: 向量数据库到底是什么，以及它是如何工作的
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: 向量数据库存储、索引和搜索由机器学习模型生成的向量 Embeddings，以实现快速信息检索和相似性搜索。
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
好的，这是翻译后的HTML内容，保持不变结构及标签，仅对文本进行了英译中处理。

```html
<p>向量数据库对向量 Embeddings 进行索引和存储，以实现快速检索和相似性搜索，其具备 CRUD 操作、元数据过滤和水平扩展等能力，专门为 AI 应用设计。</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">引言：AI 时代中向量数据库的崛起<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>在 ImageNet 的早期，需要 25,000 名人工标注员手动标记数据集。这个惊人的数字凸显了 AI 中的一个基本挑战：手动分类非结构化数据根本无法扩展。面对每天产生的数十亿张图片、视频、文档和音频文件，计算机理解和交互内容的方式需要一种范式转变。</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">传统关系型数据库</a>擅长管理具有预定义格式的结构化数据并执行精确搜索操作。相比之下，向量数据库则专门通过被称为向量 Embeddings 的高维数值表示，来存储和检索<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>类型，例如图像、音频、视频和文本内容。向量数据库通过提供高效的数据检索和管理来支持<a href="https://zilliz.com/glossary/large-language-models-(llms)">大型语言模型</a>。现代向量数据库通过硬件感知优化（AVX512、SIMD、GPUs、NVMe SSDs）、高度优化的搜索算法（HNSW、IVF、DiskANN）以及列式存储设计，其性能比传统系统高出 2-10 倍。其云原生的解耦架构支持搜索、数据插入和索引组件的独立扩展，使系统能够高效处理数十亿个向量，同时为 Salesforce、PayPal、eBay 和 NVIDIA 等公司的企业级 AI 应用保持高性能。</p>
<p>这代表了专家们所说的“语义鸿沟”——传统数据库基于精确匹配和预定义关系操作，而人类对内容的理解是细微的、情境化的且多维度。随着 AI 应用的需求不断增长，这一鸿沟变得越来越成问题，这些需求包括：</p>
<ul>
<li><p>寻找概念上的相似性，而非精确匹配</p></li>
<li><p>理解不同内容片段之间的上下文关系</p></li>
<li><p>在关键词之外捕捉信息的语义本质</p></li>
<li><p>在统一框架内处理多模态数据</p></li>
</ul>
<p>向量数据库已成为弥合这一鸿沟的关键技术，成为现代 AI 基础设施中不可或缺的组成部分。它们通过促进聚类和分类等任务来提升机器学习模型的性能。</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">理解向量 Embeddings：基础<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">向量 Embeddings</a>是跨越语义鸿沟的关键桥梁。这些高维数值表示以计算机可以高效处理的形式，捕捉非结构化数据的语义本质。现代 Embeddings 模型将原始内容（无论是文本、图像还是音频）转换为稠密向量，在向量空间中相似的概念会聚在一起，而不管它们表面上的差异如何。</p>
<p>例如，正确构建的 Embeddings 会将“汽车”、“轿车”和“车辆”等概念在向量空间中放置在相近位置，尽管它们的词法形式不同。这一特性使<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>、<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推荐系统</a>和 AI 应用能够超越简单的模式匹配来理解内容。</p>
<p>Embeddings 的威力超越了单一模态。先进的向量数据库在统一系统中支持各种非结构化数据类型——文本、图像、音频——实现跨模态的搜索和关系，这在此前是无法高效建模的。这些向量数据库能力对聊天机器人和图像识别系统等 AI 驱动技术至关重要，并支持语义搜索和推荐系统等高级应用。</p>
<p>然而，大规模存储、索引和检索 Embeddings 带来了传统数据库并非为此构建的独特计算挑战。</p>
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
    </button></h2><p>向量数据库代表了我们在存储和查询非结构化数据方式上的范式转变。不同于擅长管理具有预定义格式的结构化数据的传统关系型数据库系统，向量数据库专门通过数值向量表示来处理非结构化数据。</p>
<p>向量数据库的核心是解决一个根本问题：在非结构化数据的大规模数据集上实现高效的相似性搜索。它们通过三个关键组件来实现这一目标：</p>
<p><strong>向量 Embeddings</strong>：捕捉非结构化数据（文本、图像、音频等）语义含义的高维数值表示。</p>
<p><strong>专门的索引</strong>：为高维向量空间优化的算法，能够实现快速的近似搜索。向量数据库索引向量以提升相似性搜索的速度和效率，利用各种 ML 算法在向量 Embeddings 上创建索引。</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>距离度量</strong></a>：量化向量之间相似度的数学函数。</p>
<p>向量数据库中的主要操作是<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-最近邻</a>（KNN）查询，即找到与给定查询向量最相似的 k 个向量。对于大规模应用，这些数据库通常实现<a href="https://zilliz.com/glossary/anns">近似最近邻</a>（ANN）算法，以少量精度换取显著的搜索速度提升。</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">向量相似性的数学基础</h3><p>理解向量数据库需要掌握向量相似性背后的数学原理。以下是基础概念：</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">向量空间与 Embeddings</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">向量 Embedding</a>是一个固定长度的浮点数数组（维度范围从 100 到 32,768！），以数值格式表示非结构化数据。这些 Embeddings 使相似的项目在高维向量空间中彼此更接近。</p>
<p>例如，在经过良好训练的词汇 Embedding 空间中，“国王”和“王后”这两个词的向量表示会比它们中的任何一个与“汽车”的距离都更近。</p>
<h3 id="Distance-Metrics" class="common-anchor-header">距离度量</h3><p>距离度量的选择从根本上影响相似度的计算方式。常见的距离度量包括：</p>
<ol>
<li><p><strong>欧氏距离</strong>：欧氏空间中两点之间的直线距离。</p></li>
<li><p><strong>余弦相似度</strong>：衡量两个向量之间夹角的余弦值，侧重于方向而非大小。</p></li>
<li><p><strong>点积</strong>：对于归一化向量，表示两个向量的对齐程度。</p></li>
<li><p><strong>曼哈顿距离（L1 范数）</strong>：坐标之间绝对差的总和。</p></li>
</ol>
<p>不同的用例可能需要不同的距离度量。例如，余弦相似度通常适用于文本 Embeddings，而欧氏距离可能更适合某些类型的<a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">图像 Embeddings</a>。</p>
<p>向量空间中向量之间的<a href="https://zilliz.com/glossary/semantic-similarity">语义相似性</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>向量空间中向量之间的语义相似性</span>
  </span>
</p>
<p>理解这些数学基础引出了一个关于实现的重要问题：那么，只需给任何数据库添加一个向量索引就可以了吗？</p>
<p>简单地向关系型数据库添加向量索引是不够的，使用独立的<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">向量索引库</a>也不够。虽然向量索引提供了高效查找相似向量的关键能力，但它们缺乏生产应用所需的基础设施：</p>
<ul>
<li><p>它们不提供用于管理向量数据的 CRUD 操作</p></li>
<li><p>它们缺乏元数据存储和过滤功能</p></li>
<li><p>它们不提供内置的扩展、复制或容错能力</p></li>
<li><p>它们需要自定义基础设施来进行数据持久化和数据管理</p></li>
</ul>
<p>向量数据库的出现就是为了解决这些限制，提供专门为向量 Embeddings 设计的完整数据管理能力。它们将向量搜索的语义能力与数据库系统的操作能力相结合。</p>
<p>与传统数据库基于精确匹配不同，向量数据库专注于语义搜索——根据特定的距离度量查找与查询向量“最相似”的向量。这一根本性差异驱动了为这些专用系统提供动力的独特架构和算法。</p>
<p>其他专门的存储库也遵循同样的逻辑——高频率、带时间有序的事件数据通常存储在像 QuestDB 这样的<a href="https://questdb.com/">时序数据库</a>中，而向量数据库则保存从这些数据中派生出的 Embeddings。</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">向量数据库架构：一个技术框架<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>现代向量数据库实现了复杂的多层架构，该架构分离关注点、支持可扩展性并确保可维护性。该技术框架远不止简单的搜索索引，而是创建能够处理生产级 AI 工作负载的系统。向量数据库通过处理和检索 AI 及 ML 应用的信息来工作，利用近似最近邻搜索算法，将各种类型的原始数据转换为向量，并通过语义搜索有效管理多样化的数据类型。</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">四层架构</h3><p>生产级向量数据库通常由四个主要的架构层组成：</p>
<ol>
