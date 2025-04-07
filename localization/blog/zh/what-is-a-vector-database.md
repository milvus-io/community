---
id: what-is-vector-database-and-how-it-works.md
title: 究竟什么是向量数据库？
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: 向量数据库存储、索引和搜索由机器学习模型生成的向量 Embeddings，用于快速信息检索和相似性搜索。
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>向量数据库对向量 Embeddings 进行索引和存储，以实现快速检索和相似性搜索，并具有专为人工智能应用设计的 CRUD 操作、元数据过滤和水平扩展等功能。</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">简介：人工智能时代向量数据库的崛起<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>在 ImageNet 初期，需要 25,000 名人类管理员对数据集进行人工标注。这个惊人的数字凸显了人工智能的一个基本挑战：人工对非结构化数据进行分类根本无法扩展。每天都会产生数十亿张图片、视频、文档和音频文件，因此需要转变计算机理解内容并与之交互的模式。</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">传统的关系型数据库系统</a>擅长管理具有预定义格式的结构化数据，并执行精确的搜索操作。相比之下，向量数据库擅长通过称为向量 Embeddings 的高维数字表示来存储和检索<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据类型 </a>，如图像、音频、视频和文本内容。向量数据库通过提供高效的数据检索和管理来支持<a href="https://zilliz.com/glossary/large-language-models-(llms)">大型语言模型</a>。通过硬件感知优化（AVX512、SIMD、GPU、NVMe SSD）、高度优化的搜索算法（HNSW、IVF、DiskANN）和面向列的存储设计，现代向量数据库的性能比传统系统高出 2-10 倍。它们的云原生、解耦架构实现了搜索、数据插入和索引组件的独立扩展，使系统能够高效处理数十亿个向量，同时为 Salesforce、PayPal、eBay 和英伟达等公司的企业人工智能应用保持性能。</p>
<p>这就是专家们所说的 "语义鸿沟"--传统数据库的操作符是精确匹配和预定义关系，而人类对内容的理解是细微的、上下文的和多维的。随着人工智能应用的需要，这种差距变得越来越成问题：</p>
<ul>
<li><p>寻找概念上的相似性，而不是精确匹配</p></li>
<li><p>理解不同内容之间的上下文关系</p></li>
<li><p>捕捉关键字之外的信息语义本质</p></li>
<li><p>在统一框架内处理多模态数据</p></li>
</ul>
<p>向量数据库已成为弥合这一差距的关键技术，成为现代人工智能基础设施的重要组成部分。它们通过促进聚类和分类等任务来提高机器学习模型的性能。</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">了解向量 Embeddings：基础<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>是跨越语义鸿沟的关键桥梁。这些高维数字表示以计算机可以高效处理的形式捕捉非结构化数据的语义本质。现代嵌入模型将原始内容--无论是文本、图像还是音频--转换为密集向量，在向量空间中，相似的概念聚集在一起，而不考虑表面上的差异。</p>
<p>例如，正确构建的 Embeddings 会将 "automobile"（汽车）、"car"（汽车）和 "vehicle"（车辆）等概念定位在向量空间中的相近位置，尽管它们具有不同的词汇形式。这一特性使<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>、<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推荐系统</a>和人工智能应用能够理解内容，而不仅仅是简单的模式匹配。</p>
<p>Embeddings 的强大功能可以延伸到各种模式。先进的向量数据库可在统一的系统中支持各种非结构化数据类型--文本、图像、音频，从而实现跨模态搜索，并建立以前无法高效建模的关系。这些向量数据库功能对于聊天机器人和图像识别系统等人工智能驱动的技术至关重要，可支持语义搜索和推荐系统等高级应用。</p>
<p>然而，大规模存储、索引和检索嵌入数据带来了独特的计算挑战，而传统数据库并不是为解决这些挑战而构建的。</p>
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
    </button></h2><p>向量数据库代表了我们存储和查询非结构化数据方式的范式转变。传统的关系型数据库系统擅长管理预定义格式的结构化数据，而向量数据库则不同，它擅长通过数字向量表示来处理非结构化数据。</p>
<p>向量数据库的核心是解决一个基本问题：在海量非结构化数据集上实现高效的相似性搜索。它们通过三个关键组件来实现这一目标：</p>
<p><strong>向量嵌入</strong>：捕捉非结构化数据（文本、图像、音频等）语义的高维数字表示法</p>
<p><strong>专业索引</strong>：针对高维向量空间进行优化的算法，可实现快速近似搜索。向量数据库对向量进行索引，以提高相似性搜索的速度和效率，利用各种 ML 算法在向量 Embeddings 上创建索引。</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>距离度量</strong></a>：量化向量间相似性的数学函数</p>
<p>向量数据库的主要操作符是<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k 近邻</a>（KNN）查询，它可以找到与给定查询向量最相似的 k 个向量。对于大规模应用，这些数据库通常采用<a href="https://zilliz.com/glossary/anns">近似近邻</a>（ANN）算法，用少量的准确性换取搜索速度的显著提高。</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">向量相似性的数学基础</h3><p>理解向量数据库需要掌握向量相似性背后的数学原理。以下是基本概念：</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">向量空间和嵌入</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">向量嵌入</a>是由浮点数组成的固定长度数组（维数范围为 100-32,768 维！），以数字格式表示非结构化数据。这些嵌入在高维向量空间中将同类项定位得更近。</p>
<p>例如，在训练有素的词嵌入空间中，"king"（国王）和 "queen"（王后）这两个词的向量表示比 "automobile"（汽车）更接近。</p>
<h3 id="Distance-Metrics" class="common-anchor-header">距离度量</h3><p>距离度量的选择会从根本上影响相似性的计算方式。常见的距离度量包括</p>
<ol>
<li><p><strong>欧氏距离</strong>：欧氏空间中两点之间的直线距离。</p></li>
<li><p><strong>余弦相似度</strong>：测量两个向量之间角度的余弦，侧重于方向而非大小</p></li>
<li><p><strong>点积</strong>：对于归一化向量，表示两个向量的对齐程度。</p></li>
<li><p><strong>曼哈顿距离（L1 Norm）</strong>：坐标间绝对差值之和。</p></li>
</ol>
<p>不同的使用情况可能需要不同的距离度量。例如，余弦相似度通常适用于文本嵌入，而欧氏距离可能更适合某些类型的<a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">图像嵌入</a>。</p>
<p>向量空间中向量之间的<a href="https://zilliz.com/glossary/semantic-similarity">语义相似性</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
   </span> <span class="img-wrapper"> <span>向量空间中向量间的语义相似性</span> </span></p>
<p>了解了这些数学基础之后，我们就会面临一个有关实现的重要问题：那么只要在任何数据库中添加一个向量索引就可以了，对吗？</p>
<p>仅仅在关系数据库中添加向量索引是不够的，使用独立的<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">向量索引库</a>也是不够的。虽然向量索引提供了高效查找相似向量的关键能力，但它们缺乏生产应用所需的基础架构：</p>
<ul>
<li><p>它们不提供管理向量数据的 CRUD 操作符</p></li>
<li><p>缺乏元数据存储和过滤功能</p></li>
<li><p>不提供内置扩展、复制或容错功能</p></li>
<li><p>数据持久化和管理需要自定义基础设施</p></li>
</ul>
<p>矢量数据库的出现就是为了解决这些局限性，提供专为矢量嵌入而设计的完整数据管理功能。它们将向量搜索的语义能力与数据库系统的操作符相结合。</p>
<p>与传统的数据库操作符精确匹配不同，向量数据库侧重于语义搜索--根据特定的距离度量找到与查询向量 "最相似 "的向量。这一根本区别推动了这些专用系统的独特架构和算法。</p>
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
    </button></h2><p>现代向量数据库采用了复杂的多层架构，可将关注点分开，实现可扩展性并确保可维护性。这种技术框架远远超越了简单的搜索索引，能够创建处理生产人工智能工作负载的系统。向量数据库的工作原理是为人工智能和 ML 应用程序处理和检索信息，利用近似近邻搜索算法，将各种类型的原始数据转换为向量，并通过语义搜索有效管理各种数据类型。</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">四层架构</h3><p>生产型向量数据库通常由四个主要架构层组成：</p>
<ol>
<li><p><strong>存储层</strong>：管理向量数据和元数据的持久存储，实施专门的编码和压缩策略，并优化 I/O 模式以实现向量特定的访问。</p></li>
<li><p><strong>索引层</strong>：维护多种索引算法，管理索引的创建和更新，并实施针对硬件的性能优化。</p></li>
<li><p><strong>查询层</strong>：处理传入的查询，确定执行策略，处理结果，并为重复查询实施缓存。</p></li>
<li><p><strong>服务层</strong>：管理客户端连接，处理请求路由，提供监控和日志记录，并实现安全性和多租户。</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">向量搜索工作流程</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
   </span> <span class="img-wrapper"> <span>向量搜索操作的完整工作流程.png</span> </span></p>
<p>典型的向量数据库实施遵循以下工作流程：</p>
<ol>
<li><p>机器学习模型将非结构化数据（文本、图像、音频）转化为向量嵌入</p></li>
<li><p>这些向量嵌入与相关元数据一起存储在数据库中</p></li>
<li><p>当用户进行查询时，使用<em>相同的</em>模型将其转换为向量嵌入</p></li>
<li><p>数据库使用近似近邻算法将查询向量与存储的向量进行比较</p></li>
<li><p>系统根据向量相似度返回前 K 个最相关的结果</p></li>
<li><p>可选的后处理可应用额外的过滤器或 Rerankers</p></li>
</ol>
<p>这一管道可在海量非结构化数据的 Collections 中实现高效的语义搜索，而传统的数据库方法是不可能做到这一点的。</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">向量数据库的一致性</h4><p>由于需要在性能和正确性之间做出权衡，因此确保分布式向量数据库的一致性是一项挑战。虽然最终一致性在大规模系统中很常见，但对于欺诈检测和实时推荐等任务关键型应用，则需要强大的一致性模型。基于法定人数的写入和分布式共识（如<a href="https://zilliz.com/learn/raft-or-not">Raft</a>、Paxos）等技术可确保数据完整性，而无需对性能进行过多权衡。</p>
<p>生产实施采用共享存储架构，具有存储和计算分离的特点。这种分离遵循数据平面和控制平面分解的原则，每一层都可独立扩展，以优化资源利用率。</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">管理连接、安全和多租户</h3><p>由于这些数据库用于多用户和多租户环境，因此确保数据安全和管理访问控制对于维护保密性至关重要。</p>
<p>加密（静态和传输中）等安全措施可保护嵌入和元数据等敏感数据。身份验证和授权可确保只有授权用户才能访问系统，细粒度的权限可管理对特定数据的访问。</p>
<p>访问控制定义了限制数据访问的角色和权限。这对于存储客户数据或专有人工智能模型等敏感信息的数据库尤为重要。</p>
<p>多租户涉及隔离每个租户的数据，以防止未经授权的访问，同时实现资源共享。这可以通过分片、分区或行级安全来实现，以确保不同团队或客户的可扩展和安全访问。</p>
<p>外部身份和访问管理（IAM）系统与向量数据库集成，以执行安全策略，确保符合行业标准。</p>
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
    </button></h2><p>与传统数据库相比，矢量数据库具有多项优势，是处理向量数据的理想选择。以下是一些主要优势：</p>
<ol>
<li><p><strong>高效的相似性搜索</strong>：向量数据库的突出特点之一是能够执行高效的语义搜索。与依赖精确匹配的传统数据库不同，向量数据库擅长于查找与给定查询向量相似的数据点。这种能力对于推荐系统等应用来说至关重要，因为在推荐系统中，找到与用户过去互动类似的项目可以显著提升用户体验。</p></li>
<li><p><strong>处理高维数据</strong>：向量数据库专为高效管理高维数据而设计。这使它们特别适合自然语言处理、<a href="https://zilliz.com/learn/what-is-computer-vision">计算机视觉</a>和基因组学等应用，因为这些领域的数据通常存在于高维空间中。通过利用先进的索引和搜索算法，即使在复杂的向量嵌入数据集中，向量数据库也能快速检索相关数据点。</p></li>
<li><p><strong>可扩展性</strong>：可扩展性是现代人工智能应用的关键要求，而向量数据库就是为高效扩展而构建的。无论是处理数百万还是数十亿向量，向量数据库都能通过横向扩展应对人工智能应用不断增长的需求。即使数据量增加，也能确保性能保持一致。</p></li>
<li><p><strong>灵活性</strong>：向量数据库在数据表示方面具有显著的灵活性。它们可以存储和管理各种类型的数据，包括数字特征、文本或图像的 Embeddings，甚至是分子结构等复杂数据。这种多功能性使向量数据库成为从文本分析到科学研究等广泛应用的强大工具。</p></li>
<li><p><strong>实时应用</strong>：许多向量数据库都针对实时或接近实时查询进行了优化。这对于欺诈检测、实时推荐和交互式人工智能系统等需要快速响应的应用尤为重要。执行快速相似性搜索的能力可确保这些应用能及时提供相关结果。</p></li>
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
    </button></h2><p>向量数据库在各行各业都有广泛的应用，展示了其多功能性和强大的功能。以下是一些著名的使用案例：</p>
<ol>
<li><p><strong>自然语言处理</strong>：在自然语言处理（NLP）领域，向量数据库发挥着至关重要的作用。它们可用于文本分类、情感分析和语言翻译等任务。通过将文本转换为高维向量 Embeddings，向量数据库可实现高效的相似性搜索和语义理解，从而提高<a href="https://zilliz.com/learn/7-nlp-models">NLP 模型</a>的性能。</p></li>
<li><p><strong>计算机视觉</strong>：向量数据库在计算机视觉应用中也得到了广泛应用。图像识别、<a href="https://zilliz.com/learn/what-is-object-detection">物体检测</a>和图像分割等任务都得益于向量数据库处理高维图像嵌入的能力。这样就能快速准确地检索视觉相似的图像，使向量数据库成为自动驾驶、医疗成像和数字资产管理等领域不可或缺的工具。</p></li>
<li><p><strong>基因组学</strong>：在基因组学中，向量数据库用于存储和分析基因序列、蛋白质结构和其他分子数据。这些数据的高维特性使向量数据库成为管理和查询大型基因组数据集的理想选择。研究人员可以进行向量搜索，找到具有相似模式的基因序列，有助于发现遗传标记和了解复杂的生物过程。</p></li>
<li><p><strong>推荐系统</strong>：向量数据库是现代推荐系统的基石。通过将用户交互和项目特征存储为向量 Embeddings，这些数据库可以快速识别与用户之前交互过的项目相似的项目。这一功能提高了推荐的准确性和相关性，从而提高了用户满意度和参与度。</p></li>
<li><p><strong>聊天机器人和虚拟助理</strong>：向量数据库可用于聊天机器人和虚拟助手，为用户查询提供实时的上下文答案。通过将用户输入转换为向量嵌入，这些系统可以执行相似性搜索，找到最相关的回复。这使聊天机器人和虚拟助手能够提供更准确、更符合上下文的答案，从而提升整体用户体验。</p></li>
</ol>
<p>通过利用向量数据库的独特功能，各行各业的组织可以构建更加智能、反应更快、可扩展的人工智能应用。</p>
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
    </button></h2><p>向量数据库需要专门的索引<a href="https://zilliz.com/learn/vector-index">算法</a>，以便在高维空间中进行高效的相似性搜索。算法的选择直接影响准确性、速度、内存使用和可扩展性。</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">基于图的方法</h3><p><strong>HNSW（</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>层次化可导航小世界</strong></a><strong>）</strong>通过连接相似向量来创建可导航结构，从而在搜索过程中实现高效遍历。HNSW 限制每个节点的最大连接数和搜索范围，以平衡性能和准确性，使其成为向量相似性搜索中应用最广泛的算法之一。</p>
<p><strong>Cagra</strong>是一种基于图的索引，专门针对 GPU 加速进行了优化。它构建了与 GPU 处理模式相一致的可导航图结构，实现了大规模并行向量比较。Cagra 之所以特别有效，是因为它能够通过图程度和搜索宽度等可配置参数来平衡召回率和性能。与昂贵的训练级硬件相比，使用 Cagra 的推理级 GPU 更具成本效益，同时还能提供较高的吞吐量，特别是对于大规模向量 Collections 而言。不过，值得注意的是，与 CPU 索引相比，Cagra 等 GPU 索引不一定能减少延迟，除非是在高查询压力下操作。</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">量化技术</h3><p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>乘积量化（PQ）</strong></a>将高维向量分解为更小的子向量，并分别对每个子向量进行量化。这大大减少了存储需求（通常可减少 90% 以上），但会带来一定的精度损失。</p>
<p><strong>标量量化 (SQ)</strong>将 32 位浮点数转换为 8 位整数，可减少 75% 的内存使用量，但对精度的影响很小。</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">磁盘索引：经济高效的扩展</h3><p>对于大规模向量 Collections（1 亿个以上向量）来说，内存索引的成本过高。例如，1 亿个 1024 维向量大约需要 400GB 内存。这时，DiskANN 等磁盘索引算法就能带来显著的成本优势。</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> 基于 Vamana 图算法，可实现高效的向量搜索，同时将大部分索引存储在 NVMe SSD 而不是 RAM 上。这种方法具有多项成本优势：</p>
<ul>
<li><p><strong>降低硬件成本</strong>：企业可以使用配置适中内存的商品硬件大规模部署向量搜索</p></li>
<li><p><strong>降低操作费用</strong>：更少的 RAM 意味着更低的数据中心功耗和冷却成本</p></li>
<li><p><strong>线性成本缩放</strong>：内存成本随数据量线性扩展，同时性能保持相对稳定</p></li>
<li><p><strong>优化 I/O 模式</strong>：DiskANN 的专门设计通过谨慎的图遍历策略最大限度地减少了磁盘读取。</p></li>
</ul>
<p>与纯粹的内存方法相比，DiskANN 通常会适度增加查询延迟（通常仅为 2-3ms），这对于许多生产用例来说是可以接受的。</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">专用索引类型</h3><p><strong>二进制 Embeddings 索引</strong>专门用于计算机视觉、图像指纹识别和推荐系统，在这些系统中，数据可表示为二进制特征。这些索引可满足不同的应用需求。对于需要精确匹配的重复数据删除、数字水印和版权检测，优化的二进制索引可提供精确的相似性检测。对于高吞吐量推荐系统、基于内容的图像检索和大规模特征匹配（速度优先于完美召回率），二进制索引具有卓越的性能优势。</p>
<p><strong>稀疏向量索引</strong>针对大多数元素为零、只有少数几个非零值的向量进行了优化。与密集向量（大多数或所有维度都包含有意义的值）不同，稀疏向量能有效地表示维度多但活动特征少的数据。这种表示方法在文本处理中尤为常见，因为文档可能只使用了词汇表中所有可能词汇的一小部分。稀疏向量索引在语义文档搜索、全文查询和主题模型等自然语言处理任务中表现出色。这些索引对于跨大型文档 Collections 的企业搜索、必须有效定位特定术语和概念的法律文档发现，以及为数百万篇包含专业术语的论文编制索引的学术研究平台来说尤其有价值。</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">高级查询功能<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库的核心在于其执行高效语义搜索的能力。向量搜索功能包括从基本的相似性匹配到提高相关性和多样性的高级技术。</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">基本 ANN 搜索</h3><p>近似近邻（ANN）搜索是向量数据库的基础搜索方法。与将查询向量与数据库中的每个向量进行比较的精确 k-最近邻（kNN）搜索不同，ANN 搜索使用索引结构来快速识别可能最相似的向量子集，从而大大提高了性能。</p>
<p>ANN 搜索的主要组成部分包括</p>
<ul>
<li><p><strong>查询向量</strong>：搜索内容的向量表示法</p></li>
<li><p><strong>索引结构</strong>：预建数据结构，用于组织向量以实现高效检索</p></li>
<li><p><strong>度量类型</strong>：数学函数，如欧几里得（L2）、余弦或内积，用于衡量向量之间的相似性</p></li>
<li><p><strong>前 K 结果</strong>：返回最相似向量的指定数量</p></li>
</ul>
<p>向量数据库提供优化功能，以提高搜索效率：</p>
<ul>
<li><p><strong>批量向量搜索</strong>：并行搜索多个查询向量</p></li>
<li><p><strong>分区搜索</strong>：限制对特定数据分区的搜索</p></li>
<li><p><strong>分页</strong>：使用限制和偏移参数检索大型结果集</p></li>
<li><p><strong>输出字段选择</strong>：控制结果返回哪些实体字段</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">高级搜索技术</h3><h4 id="Range-Search" class="common-anchor-header">范围搜索</h4><p>范围搜索可将结果限制在相似度得分在特定范围内的向量上，从而提高结果的相关性。与返回前 K 个最相似向量的标准 ANN 搜索不同，范围搜索使用 "环形区域 "来定义：</p>
<ul>
<li><p>设定最大允许距离的外部边界（半径</p></li>
<li><p>内边界（range_filter），用于排除过于相似的向量</p></li>
</ul>
<p>这种方法在查找 "相似但不完全相同 "的项目时特别有用，例如与用户已浏览过的内容相关但不完全重复的产品推荐。</p>
<h4 id="Filtered-Search" class="common-anchor-header">过滤搜索</h4><p>过滤搜索将向量相似性与元数据约束相结合，将搜索结果缩小到符合特定条件的向量。例如，在产品目录中，您可以找到视觉上相似的商品，但将结果限制在特定品牌或价格范围内。</p>
<p>高扩展向量数据库支持两种过滤方法：</p>
<ul>
<li><p><strong>标准过滤</strong>：在向量搜索前应用元数据过滤器，大大减少了候选池的数量</p></li>
<li><p><strong>迭代过滤</strong>：先执行向量搜索，然后对每个结果应用过滤器，直到达到所需的匹配数</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">文本匹配</h4><p>文本匹配可根据特定术语进行精确的文档检索，通过精确的文本匹配功能对向量相似性搜索进行补充。与查找概念相似内容的语义搜索不同，文本匹配侧重于查找查询术语的精确出现。</p>
<p>例如，产品搜索可以结合文本匹配来查找明确提到 "防水 "的产品，并结合向量相似性来查找视觉上相似的产品，从而确保同时满足语义相关性和特定功能要求。</p>
<h4 id="Grouping-Search" class="common-anchor-header">分组搜索</h4><p>分组搜索按指定字段汇总搜索结果，以提高搜索结果的多样性。例如，在文档 Collections 中，每个段落都是一个单独的向量，分组可确保结果来自不同的文档，而不是同一文档中的多个段落。</p>
<p>这种技术对于以下情况非常有用</p>
<ul>
<li><p>需要来自不同来源的结果的文档检索系统</p></li>
<li><p>需要提供不同选项的推荐系统</p></li>
<li><p>结果多样性与相似性同等重要的搜索系统</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">混合搜索</h4><p>混合搜索结合了来自多个向量场的结果，每个向量场可能代表数据的不同方面或使用不同的嵌入模型。这可以实现</p>
<ul>
<li><p><strong>稀疏-密集向量组合</strong>：将语义理解（密集向量）与关键词匹配（稀疏向量）相结合，实现更全面的文本搜索</p></li>
<li><p><strong>多模态搜索</strong>：跨不同数据类型查找匹配，例如使用图像和文本输入搜索产品</p></li>
</ul>
<p>混合搜索实现使用复杂的 Rerankers 策略来组合搜索结果：</p>
<ul>
<li><p><strong>加权排序</strong>：优先处理来自特定向量场的结果</p></li>
<li><p><strong>互惠排名融合</strong>：平衡所有矢量字段的结果，不做特别强调</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">全文搜索</h4><p>现代向量数据库的全文搜索功能弥补了传统文本搜索和向量相似性之间的差距。这些系统</p>
<ul>
<li><p>自动将原始文本查询转换为稀疏嵌入</p></li>
<li><p>检索包含特定术语或短语的文档</p></li>
<li><p>根据术语相关性和语义相似性对结果进行排序</p></li>
<li><p>补充向量搜索，捕捉语义搜索可能会遗漏的精确匹配结果</p></li>
</ul>
<p>这种混合方法对于需要精确术语匹配和语义理解的综合<a href="https://zilliz.com/learn/what-is-information-retrieval">信息检索</a>系统尤为重要。</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">性能工程：重要指标<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库的性能优化需要了解关键指标及其权衡。</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">召回率-吞吐量权衡</h3><p>召回率衡量的是在返回结果中找到真正近邻的比例。更高的召回率要求更广泛的搜索，从而降低吞吐量（每秒查询次数）。生产系统会根据应用需求平衡这些指标，通常目标是 80-99% 的召回率，具体取决于使用情况。</p>
<p>在评估向量数据库性能时，ANN-Benchmarks 等标准化基准环境可提供宝贵的比较数据。这些工具测量的关键指标包括</p>
<ul>
<li><p>搜索召回率：在返回结果中找到真正近邻的查询比例</p></li>
<li><p>每秒查询次数（QPS）：数据库在标准化条件下处理查询的速度</p></li>
<li><p>不同数据集大小和维度的性能</p></li>
</ul>
<p>另一个替代方案是名为<a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a> 的开源基准系统。VectorDBBench 是一个<a href="https://github.com/zilliztech/VectorDBBench">开源基准测试工具</a>，旨在使用主流向量数据库（如 Milvus 和 Zilliz Cloud）自己的数据集对其性能进行评估和比较。它还可以帮助开发人员根据自己的用例选择最合适的向量数据库。</p>
<p>通过这些基准，企业可以在考虑准确性、速度和可扩展性之间的平衡的基础上，确定最适合其特定需求的向量数据库实施方案。</p>
<h3 id="Memory-Management" class="common-anchor-header">内存管理</h3><p>高效的内存管理可使向量数据库在保持性能的同时扩展到数十亿向量：</p>
<ul>
<li><p><strong>动态分配</strong>可根据工作负载特征调整内存使用量</p></li>
<li><p><strong>缓存策略</strong>将频繁访问的向量保留在内存中</p></li>
<li><p><strong>向量压缩技术</strong>大大降低了内存需求</p></li>
</ul>
<p>对于超出内存容量的数据集，基于磁盘的解决方案提供了至关重要的功能。这些算法通过波束搜索和基于图的导航等技术，优化了 NVMe SSD 的 I/O 模式。</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">高级过滤和混合搜索</h3><p>向量数据库将语义相似性与传统过滤相结合，创建了强大的查询功能：</p>
<ul>
<li><p><strong>预过滤</strong>在向量搜索前应用元数据限制，减少了用于相似性比较的候选集</p></li>
<li><p><strong>后过滤</strong>先执行向量搜索，然后对结果应用过滤器</p></li>
<li><p><strong>元数据索引</strong>通过针对不同数据类型的专门索引提高过滤性能</p></li>
</ul>
<p>性能卓越的向量数据库支持将多个向量字段与标量约束相结合的复杂查询模式。多向量查询可同时查找与多个参考点相似的实体，而负向量查询则可排除与指定示例相似的向量。</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">在生产中扩展向量数据库<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库需要深思熟虑的部署策略，以确保在不同规模下都能发挥最佳性能：</p>
<ul>
<li><p><strong>小规模部署</strong>（数百万向量）可以在一台具有足够内存的机器上有效操作符</p></li>
<li><p><strong>中等规模部署</strong>（数千万到数亿）可受益于高内存实例和固态硬盘存储的纵向扩展</p></li>
<li><p><strong>十亿级规模的部署</strong>需要在多个具有专门角色的节点上进行横向扩展</p></li>
</ul>
<p>分片和复制构成了可扩展向量数据库架构的基础：</p>
<ul>
<li><p><strong>水平分片</strong>将集合划分到多个节点上</p></li>
<li><p><strong>复制</strong>创建冗余数据副本，提高容错能力和查询吞吐量</p></li>
</ul>
<p>现代系统可根据查询模式和可靠性要求动态调整复制因子。</p>
<h2 id="Real-World-Impact" class="common-anchor-header">现实世界的影响<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>高性能向量数据库的灵活性体现在其部署选项上。系统可在各种环境中运行，从用于原型开发的笔记本电脑轻量级安装到管理数百亿向量的大规模分布式集群。这种可扩展性使企业能够在不改变数据库技术的情况下从概念转向生产。</p>
<p>Salesforce、PayPal、eBay、英伟达（NVIDIA）、IBM 和 Airbnb 等公司现在都依靠开源的<a href="https://milvus.io/">Milvus</a>等向量数据库来支持大规模人工智能应用。这些实施跨越了不同的用例--从复杂的产品推荐系统到内容管理、欺诈检测和客户支持自动化，所有这些都建立在向量搜索的基础上。</p>
<p>近年来，向量数据库通过提供特定领域的最新数据或机密数据，在解决 LLMs 中常见的幻觉问题方面变得至关重要。例如，<a href="https://zilliz.com/cloud">Zilliz Cloud</a>将专业数据存储为向量 Embeddings。当用户提问时，它会将查询转化为向量，执行 ANN 搜索以获得最相关的结果，并将这些结果与原始问题相结合，从而为大型语言模型创建一个综合语境。该框架是开发可靠的 LLM 驱动型应用程序的基础，可生成更准确、与上下文更相关的回复。</p>
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
    </button></h2><p>向量数据库的兴起代表的不仅仅是一种新技术--它标志着我们在人工智能应用的数据管理方式上发生了根本性的转变。通过弥合非结构化数据与计算系统之间的鸿沟，向量数据库已成为现代人工智能基础设施的重要组成部分，使应用程序能够以越来越像人类的方式理解和处理信息。</p>
<p>与传统数据库系统相比，向量数据库的主要优势包括：</p>
<ul>
<li><p>高维搜索：在机器学习和生成式人工智能应用中使用的高维向量上进行高效的相似性搜索</p></li>
<li><p>可扩展性：横向扩展，可高效存储和检索大型向量 Collections</p></li>
<li><p>混合搜索的灵活性：处理各种向量数据类型，包括稀疏向量和密集向量</p></li>
<li><p>性能与传统数据库相比，向量相似性搜索速度明显更快</p></li>
<li><p>可定制的索引：支持针对特定用例和数据类型进行优化的自定义索引方案</p></li>
</ul>
<p>随着人工智能应用变得越来越复杂，对向量数据库的要求也在不断发展。现代系统必须在性能、准确性、扩展性和成本效益之间取得平衡，同时与更广泛的人工智能生态系统无缝集成。对于希望大规模实施人工智能的企业来说，了解向量数据库技术不仅仅是技术上的考虑，更是战略上的当务之急。</p>
