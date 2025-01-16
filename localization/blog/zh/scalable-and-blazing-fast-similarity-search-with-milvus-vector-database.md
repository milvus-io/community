---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: 利用 Milvus 向量数据库进行可扩展的快速相似性搜索
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: 以毫秒级速度存储、索引、管理和搜索数万亿文档向量！
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>本文将介绍与向量数据库和大规模相似性搜索相关的一些有趣方面。在当今快速发展的世界中，我们看到了新技术、新业务和新数据源，因此，我们需要不断使用新方法来存储、管理和利用这些数据以获得洞察力。几十年来，结构化的表格数据一直存储在关系数据库中，而商业智能正是通过分析这些数据并从中提取洞察力而发展起来的。然而，考虑到当前的数据状况，"超过 80-90% 的数据是文本、视频、音频、网络服务器日志、社交媒体等非结构化信息"。企业一直在利用机器学习和深度学习的力量，尝试从这些数据中提取洞察力，因为传统的基于查询的方法可能还不够，甚至不可能。从这些数据中提取有价值的洞察力有着巨大的、尚未开发的潜力，而我们才刚刚起步！</p>
<blockquote>
<p>"由于世界上大多数数据都是非结构化的，因此对其进行分析和采取行动的能力将带来巨大的机遇。- Kensho 公司 ML 主管 Mikey Shulman</p>
</blockquote>
<p>非结构化数据，顾名思义，没有隐含的结构，如由行和列组成的表格（因此称为表格数据或结构化数据）。与结构化数据不同，没有简单的方法将非结构化数据的内容存储在关系数据库中。利用非结构化数据获取洞察力面临三大挑战：</p>
<ul>
<li><strong>存储：</strong>常规关系数据库适合存储结构化数据。虽然您可以使用 NoSQL 数据库来存储此类数据，但要处理此类数据以提取正确的表征，从而为大规模人工智能应用提供动力，则需要额外的开销。</li>
<li><strong>表征：</strong>计算机无法像我们一样理解文本或图像。它们只理解数字，因此我们需要将非结构化数据转换成一些有用的数字表示，通常是向量或嵌入。</li>
<li><strong>查询：</strong>你不能像结构化数据的 SQL 那样，直接根据确定的条件语句来查询非结构化数据。举个简单的例子，如果你有一双你最喜欢的鞋子的照片，你可以尝试搜索相似的鞋子！您不能使用原始像素值进行搜索，也不能表示鞋的形状、大小、款式、颜色等结构化特征。现在想象一下，要对数百万双鞋进行搜索！</li>
</ul>
<p>因此，为了让计算机理解、处理和表示非结构化数据，我们通常会将它们转换成密集向量，也就是常说的 Embeddings。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>图 1</span> </span></p>
<p>特别是利用深度学习，存在着各种各样的方法，包括用于图像等视觉数据的卷积神经网络（CNN）和用于文本数据的 Transformers，它们可以用来将这类非结构化数据转换为嵌入式数据。<a href="https://zilliz.com/">Zilliz</a>有<a href="https://zilliz.com/learn/embedding-generation">一篇出色的文章，介绍了不同的嵌入技术</a>！</p>
<p>仅仅存储这些嵌入向量是不够的。我们还需要能够查询并找出类似的向量。为什么这么问？现实世界中的大多数应用都是基于人工智能解决方案的向量相似性搜索。这包括谷歌的视觉（图像）搜索、Netflix 或亚马逊的推荐系统、谷歌的文本搜索引擎、多模态搜索、重复数据删除等！</p>
<p>大规模存储、管理和查询向量并不是一项简单的任务。你需要专门的工具来完成这项工作，而向量数据库是最有效的工具！本文将介绍以下几个方面：</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">向量和向量相似性搜索</a></li>
<li><a href="#What-is-a-Vector-Database">什么是向量数据库？</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - 世界上最先进的向量数据库</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">使用 Milvus 进行可视化图像搜索--使用案例蓝图</a></li>
</ul>
<p>让我们开始吧</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">向量和向量相似性搜索<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>早些时候，我们确定了将图像和文本等非结构化数据表示为向量的必要性，因为计算机只能理解数字。我们通常利用人工智能模型，更具体地说是深度学习模型，将非结构化数据转换成机器可以读取的数字向量。通常情况下，这些向量基本上是浮点数的列表，它们集合起来代表了底层项目（图像、文本等）。</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">了解向量</h3><p>考虑到自然语言处理（NLP）领域，我们有许多单词嵌入模型，如<a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec、GloVe 和 FastText</a>，它们可以帮助将单词表示为数字向量。随着时间的<a href="https://arxiv.org/abs/1706.03762">推移</a>，我们看到了像<a href="https://jalammar.github.io/illustrated-bert/">BERT</a>这样的<a href="https://arxiv.org/abs/1706.03762">Transformer</a>模型的兴起，这些模型可以用来学习上下文嵌入向量和更好地表示整个句子和段落。</p>
<p>同样，在计算机视觉领域，我们也有<a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">卷积神经网络（CNN）</a>这样的模型，可以帮助从图像和视频等视觉数据中学习表征。随着变形器的兴起，我们也有了<a href="https://arxiv.org/abs/2010.11929">视觉变形器</a>，其性能比普通的 CNN 更好。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>图 2</span> </span></p>
<p>拥有这类向量的优势在于，我们可以利用它们来解决现实世界中的问题，比如视觉搜索，通常上传一张照片，就能得到包括视觉相似图片在内的搜索结果。如下图所示，谷歌将此作为其搜索引擎中一项非常受欢迎的功能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>图 3</span> </span></p>
<p>此类应用的动力来自数据向量和向量相似性搜索。如果考虑 X-Y 直角坐标空间中的两个点。两点之间的距离可以用简单的欧氏距离计算，如下式所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>图 4</span> </span></p>
<p>现在设想每个数据点都是一个具有 D 维的向量，你仍然可以使用欧氏距离甚至其他距离度量，如汉明距离或余弦距离，来找出两个数据点之间的距离有多近。这有助于建立一个接近度或相似度的概念，可将其作为一种可量化的度量方法，使用它们的向量找到给定参考项的相似项。</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">了解向量相似性搜索</h3><p>向量相似性搜索通常被称为近邻（NN）搜索，基本上是计算参考项目（我们要为其查找相似项目）与现有项目集合（通常在数据库中）之间的成对相似性（或距离），并返回前 "k "个近邻（即前 "k "个最相似的项目）的过程。计算这种相似性的关键要素是相似度量，可以是欧氏距离、内积、余弦距离、汉明距离等。距离越小，向量越相似。</p>
<p>精确近邻（NN）搜索的挑战在于可扩展性。每次都需要计算 N 个距离（假设存在 N 个项目）才能获得相似项目。这可能会非常慢，尤其是如果你没有在某个地方存储数据并建立索引（比如向量数据库！）。为了加快计算速度，我们通常会利用近似近邻搜索（通常称为 ANN 搜索），最终将向量存储到索引中。索引有助于以智能方式存储这些向量，以便快速检索参考查询项的 "近似 "近邻。典型的 ANN 索引方法包括</p>
<ul>
<li><strong>向量变换：</strong>这包括向向量添加额外的变换，如降维（如 PCA \ t-SNE）、旋转等。</li>
<li><strong>向量编码：</strong>这包括应用基于数据结构的技术，如位置敏感散列（LSH）、量化、树等，这有助于更快地检索类似项目</li>
<li><strong>非穷举搜索方法：</strong>这主要用于防止穷举搜索，包括邻域图、倒排索引等方法。</li>
</ul>
<p>由此可见，要建立任何向量相似性搜索应用程序，都需要一个数据库，它能帮助你进行高效的大规模存储、索引和查询（搜索）。这就是向量数据库！</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">什么是向量数据库？<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>鉴于我们现在已经了解向量如何用于表示非结构化数据以及向量搜索如何工作，我们可以将这两个概念结合在一起，建立一个向量数据库。</p>
<p>向量数据库是一种可扩展的数据平台，用于存储、索引和跨嵌入向量查询，这些向量是利用深度学习模型从非结构化数据（图像、文本等）中生成的。</p>
<p>处理海量向量进行相似性搜索（即使有索引）的成本可能会超级昂贵。尽管如此，最好、最先进的向量数据库应允许您在数百万或数十亿目标向量中进行插入、索引和搜索，此外还可以指定您所选择的索引算法和相似性度量。</p>
<p>考虑到要在企业中使用一个强大的数据库管理系统，向量数据库主要应满足以下关键要求：</p>
<ol>
<li><strong>可扩展：</strong>向量数据库应能为数十亿个嵌入向量建立索引并运行近似近邻搜索</li>
<li><strong>可靠：</strong>向量数据库应能处理内部故障而不丢失数据，并将操作影响降至最低，即具有容错能力</li>
<li><strong>快速：</strong>查询和写入速度对向量数据库非常重要。对于 Snapchat 和 Instagram 等平台来说，每秒可能上传成百上千张新图片，因此速度成为一个极其重要的因素。</li>
</ol>
<p>矢量数据库不只是存储数据向量。它们还负责使用高效的数据结构对这些向量进行索引，以实现快速检索，并支持 CRUD（创建、读取、更新和删除）操作。向量数据库最好还能支持属性过滤，即根据元数据字段（通常是标量字段）进行过滤。一个简单的例子是，根据特定品牌的图像向量检索类似的鞋子。在这里，品牌就是过滤所依据的属性。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>图 5</span> </span></p>
<p>上图展示了我们即将谈到的向量数据库<a href="https://milvus.io/">Milvus</a> 是如何使用属性过滤的。<a href="https://milvus.io/">Milvus</a>在过滤机制中引入了位掩码的概念，在满足特定属性过滤的基础上，保留位掩码为 1 的相似向量。更多详情，请点击<a href="https://zilliz.com/learn/attribute-filtering">此处</a>。</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - 世界上最先进的向量数据库<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>是专为大规模向量数据和简化机器学习操作（MLOps）而构建的开源向量数据库管理平台。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>图 6</span> </span></p>
<p><a href="https://zilliz.com/">Zilliz</a>，是构建世界上最先进的向量数据库<a href="https://milvus.io/">Milvus</a> 的幕后组织，旨在加速下一代数据结构的发展。Milvus 目前是<a href="https://lfaidata.foundation/">LF AI &amp; Data 基金会</a>的毕业项目，专注于管理海量非结构化数据集的存储和搜索。该平台的高效性和可靠性简化了大规模部署人工智能模型和 MLOps 的过程。Milvus 应用广泛，涵盖药物发现、计算机视觉、推荐系统、聊天机器人等领域。</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Milvus 的主要功能</h3><p>Milvus 拥有众多实用的特性和功能，例如</p>
<ul>
<li><strong>在万亿个向量数据集上的惊人搜索速度：</strong>在万亿个向量数据集上，向量搜索和检索的平均延迟以毫秒为单位。</li>
<li><strong>简化非结构化数据管理：</strong>Milvus 拥有专为数据科学工作流设计的丰富 API。</li>
<li><strong>可靠、始终在线的向量数据库：</strong>Milvus 内置的复制和故障转移/故障恢复功能可确保数据和应用程序始终保持业务连续性。</li>
<li><strong>高度可扩展性和弹性：</strong>组件级可扩展性使按需扩展和缩减成为可能。</li>
<li><strong>混合搜索：</strong>除向量外，Milvus 还支持布尔、字符串、整数、浮点数等数据类型。Milvus 将标量过滤与强大的向量相似性搜索配对使用（如前面的鞋子相似性示例所示）。</li>
<li><strong>统一的 Lambda 结构：</strong>Milvus 将数据存储的流式处理和批处理相结合，兼顾了时效性和效率。</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">时间旅行</a>：</strong>Milvus 为所有数据插入和删除操作维护时间轴。它允许用户在搜索中指定时间戳，以检索指定时间点的数据视图。</li>
<li><strong>社区支持和行业认可：</strong>Milvus 拥有 1,000 多家企业用户，在<a href="https://github.com/milvus-io/milvus">GitHub</a> 上有 10.5K+ 星级，是一个活跃的开源社区，因此使用 Milvus 并不孤单。作为<a href="https://lfaidata.foundation/">LF AI &amp; Data 基金会</a>下的一个研究生项目，Milvus 拥有机构支持。</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">向量数据管理和搜索的现有方法</h3><p>构建由向量相似性搜索驱动的人工智能系统的常见方法是将近似近邻搜索（ANNS）等算法与开源库配对使用，例如：</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI 相似性搜索 (FAISS)：</a></strong>该框架可对密集向量进行高效的相似性搜索和聚类。它包含的算法可以在任意大小的向量集合中进行搜索，最大可能无法容纳在 RAM 中。它支持反向多索引和乘积量化等索引功能。</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotify 的 Annoy（近似近邻哦耶）</a>：</strong>该框架使用<a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">随机投影</a>并建立一棵树，以大规模实现密集向量的 ANNS</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">谷歌的 ScaNN（可扩展近邻）</a>：</strong>该框架可大规模执行高效的向量相似性搜索。该框架的实现包括搜索空间剪枝和最大内积搜索（MIPS）的量化。</li>
</ul>
<p>虽然这些库各有各的用处，但由于一些局限性，这些算法库组合并不等同于像 Milvus 这样的成熟向量数据管理系统。下面我们将讨论其中的一些局限性。</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">现有方法的局限性</h3><p>上一节讨论的用于管理向量数据的现有方法有以下局限性：</p>
<ol>
<li><strong>灵活性：</strong>现有系统通常将所有数据存储在主内存中，因此无法在多台机器上以分布式模式轻松运行，也不适合处理海量数据集。</li>
<li><strong>动态数据处理：</strong>数据一旦输入现有系统，通常被假定为静态数据，从而使动态数据处理复杂化，无法进行近乎实时的搜索</li>
<li><strong>高级查询处理：</strong>大多数工具不支持高级查询处理（如属性过滤、混合搜索和多向量查询），而这对于构建支持高级过滤的真实世界相似性搜索引擎至关重要。</li>
<li><strong>异构计算优化：</strong>很少有平台能同时为 CPU 和 GPU（不包括 FAISS）上的异构系统架构提供优化，从而导致效率损失。</li>
</ol>
<p><a href="https://milvus.io/">Milvus</a>尝试克服所有这些限制，我们将在下一节详细讨论。</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">Milvus 的优势 - 理解 Knowhere</h3><p><a href="https://milvus.io/">Milvus</a>试图通过以下方式解决并成功解决建立在低效向量数据管理和相似性搜索算法之上的现有系统的局限性：</p>
<ul>
<li>它支持多种应用接口（包括 Python、Java、Go、C++ SDK 和 RESTful API），从而提高了灵活性。</li>
<li>它支持多种向量索引类型（如基于量化的索引和基于图的索引）以及高级查询处理</li>
<li>Milvus 使用日志结构合并树（LSM 树）处理动态向量数据，保持数据插入和删除的高效性，并保持搜索的实时性。</li>
<li>Milvus 还针对现代 CPU 和 GPU 上的异构计算架构进行了优化，允许开发人员针对特定场景、数据集和应用环境调整系统。</li>
</ul>
<p>Milvus的向量执行引擎Knowhere是一个操作界面，用于访问系统上层的服务和系统下层的Faiss、Hnswlib、Annoy等向量相似性搜索库。此外，Knowhere还负责异构计算。Knowhere控制在哪种硬件（如CPU或GPU）上执行索引构建和搜索请求。这就是Knowhere名字的由来--知道在哪里执行操作符。未来版本将支持更多类型的硬件，包括 DPU 和 TPU。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>图 7</span> </span></p>
<p>Milvus 中的计算主要涉及向量和标量操作。Knowhere 只处理 Milvus 中对向量的操作符。上图展示了 Milvus 中的 Knowhere 架构。最底层是系统硬件。第三方索引库位于硬件之上。然后，Knowhere 通过 CGO 与顶层的索引节点和查询节点进行交互。Knowhere不仅进一步扩展了Faiss的功能，还优化了性能，并具有多项优势，包括支持BitsetView、支持更多相似度指标、支持AVX512指令集、自动选择SIMD指令以及其他性能优化。详情请<a href="https://milvus.io/blog/deep-dive-8-knowhere.md">点击此处</a>。</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus 架构</h3><p>下图展示了 Milvus 平台的整体架构。Milvus 将数据流与控制流分开，分为四层，在可扩展性和灾难恢复方面相互独立。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>图 8</span> </span></p>
<ul>
<li><strong>访问层：</strong>访问层由一组无状态代理组成，是系统的前端层和用户的终端。</li>
<li><strong>协调器服务：</strong>协调器服务负责集群拓扑节点管理、负载平衡、时间戳生成、数据声明和数据管理。</li>
<li><strong>工作节点：</strong>工作节点或执行节点执行协调器服务发出的指令和代理发起的数据操作语言（DML）命令。Milvus 中的工作节点类似于<a href="https://hadoop.apache.org/">Hadoop</a> 中的数据节点或 HBase 中的区域服务器。</li>
<li><strong>存储：</strong>这是 Milvus 的基石，负责数据持久性。存储层包括<strong>元存储</strong>、<strong>日志代理</strong>和<strong>对象存储</strong>。</li>
</ul>
<p><a href="https://milvus.io/docs/v2.0.x/four_layers.md">点击这里</a>查看有关架构的更多详情！</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">使用 Milvus 进行可视化图像搜索--用例蓝图<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 等开源向量数据库使任何企业都能以最少的步骤创建自己的可视化图像搜索系统。开发人员可以使用预先训练好的人工智能模型将自己的图像数据集转换成向量，然后利用 Milvus 实现按图像搜索类似产品。下面让我们看看如何设计和构建这样一个系统的蓝图。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>图 9</span> </span></p>
<p>在这个工作流程中，我们可以使用像<a href="https://github.com/towhee-io/towhee">towhee</a>这样的开源框架，利用 ResNet-50 这样的预训练模型，从图片中提取向量，在 Milvus 中轻松存储这些向量并建立索引，还可以在 MySQL 数据库中存储图片 ID 与实际图片的映射关系。数据索引完成后，我们就可以轻松上传任何新图片，并使用 Milvus 按比例执行图片搜索。下图显示了一个可视化图像搜索示例。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>图 10</span> </span></p>
<p>请查看详细<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">教程</a>，该<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">教程</a>已在 GitHub 上开源，感谢 Milvus。</p>
<h2 id="Conclusion" class="common-anchor-header">总结<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>我们在这篇文章中涉及了相当多的内容。我们首先讨论了表示非结构化数据、利用向量以及使用开源向量数据库 Milvus 进行大规模向量相似性搜索所面临的挑战。我们详细讨论了 Milvus 的结构、支持它的关键组件，以及如何利用 Milvus 解决视觉图像搜索这一实际问题的蓝图。快来试试吧，用<a href="https://milvus.io/">Milvus</a> 解决你自己的实际问题！</p>
<p>喜欢这篇文章吗？请<a href="https://www.linkedin.com/in/dipanzan/">与我联系</a>，讨论更多内容或提供反馈！</p>
<h2 id="About-the-author" class="common-anchor-header">关于作者<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar 是数据科学负责人、谷歌机器学习开发专家、作家、顾问和人工智能顾问。连接： http://bit.ly/djs_linkedin</p>
