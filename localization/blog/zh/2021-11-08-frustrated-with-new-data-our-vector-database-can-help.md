---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: 简介
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: 面向人工智能的通用向量数据库系统的设计与实践
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>对新数据感到沮丧？我们的向量数据库可以提供帮助</custom-h1><p>在大数据时代，哪些数据库技术和应用将成为焦点？下一个改变游戏规则的将是什么？</p>
<p>非结构化数据约占所有存储数据的 80-90%；我们该如何处理这些不断增长的数据湖？人们可能会想到使用传统的分析方法，但这些方法无法提取有用的信息，甚至根本无法提取任何信息。为了回答这个问题，Zilliz 研发团队的 "三剑客"--郭仁通博士、栾小凡先生和易晓萌博士共同撰写了一篇文章，讨论了在构建通用向量数据库系统时所面临的设计和挑战。</p>
<p>这篇文章被中国最大的软件开发者社区 CSDN 的期刊《程序员》收录。本期《程序员》还收录了 2020 年图灵奖获得者 Jeffrey Ullman、2018 年图灵奖获得者 Yann LeCun、MongoDB 首席技术官 Mark Porter、OceanBase 创始人杨振坤、PingCAP 创始人黄东旭等人的文章。</p>
<p>下面我们与大家分享全文：</p>
<custom-h1>面向人工智能的通用向量数据库系统的设计与实践</custom-h1><h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>现代数据应用可以轻松处理结构化数据，结构化数据约占当今数据的 20%。在它的工具箱中，有关系数据库、NoSQL 数据库等系统；相比之下，约占所有数据 80% 的非结构化数据却没有任何可靠的系统。为了解决这个问题，本文将讨论传统数据分析在非结构化数据上的痛点，并进一步讨论我们建立自己的通用向量数据库系统的架构和面临的挑战。</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">人工智能时代的数据革命<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 5G 和物联网技术的快速发展，各行各业都在寻求成倍增加数据收集渠道，并进一步将现实世界投射到数字空间。虽然这带来了一些巨大的挑战，但也为不断发展的行业带来了巨大的利益。其中一个严峻的挑战就是如何深入洞察这些新的数据。</p>
<p>根据 IDC 的统计数据，仅在 2020 年，全球就会产生超过 40,000 艾字节的新数据。其中，只有 20% 是结构化数据，即高度有序、易于通过数值计算和关系代数进行组织和分析的数据。相比之下，非结构化数据（占剩余的 80%）的数据类型变化极为丰富，因此很难通过传统的数据分析方法来揭示其深层语义。</p>
<p>幸运的是，我们正经历着非结构化数据和人工智能的同步快速发展，人工智能让我们能够通过各种类型的神经网络更好地理解数据，如图 1 所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>newdata1.jpeg</span> </span></p>
<p>嵌入技术在 Word2vec 首次亮相后迅速走红，"嵌入一切 "的理念深入机器学习的各个领域。由此出现了两大数据层：原始数据层和向量数据层。原始数据层由非结构化数据和某些类型的结构化数据组成；向量层则是源于原始数据层经过机器学习模型的易分析嵌入的 Collections。</p>
<p>与原始数据相比，向量数据具有以下优势：</p>
<ul>
<li>嵌入向量是一种抽象的数据类型，这意味着我们可以建立一个统一的代数系统，致力于降低非结构化数据的复杂性。</li>
<li>嵌入向量是通过密集浮点向量来表达的，允许应用利用 SIMD 的优势。由于 GPU 和几乎所有现代 CPU 都支持 SIMD，因此跨向量的计算能以相对较低的成本实现高性能。</li>
<li>与原始的非结构化数据相比，通过机器学习模型编码的向量数据占用更少的存储空间，从而实现更高的吞吐量。</li>
<li>算术运算也可以跨嵌入向量进行。图 2 显示了一个跨模态语义近似匹配的例子--图中所示图片是文字嵌入与图片嵌入匹配的结果。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>newdata2.png</span> </span></p>
<p>如图 3 所示，结合图像和单词语义可以通过简单的向量加减法在它们对应的嵌入式中完成。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>除上述功能外，这些操作符还支持实际场景中更复杂的查询语句。内容推荐就是一个著名的例子。一般来说，系统会嵌入内容和用户的观看偏好。接下来，系统通过语义相似性分析，将嵌入的用户偏好与最相似的嵌入内容进行匹配，从而得到与用户偏好相似的新内容。这种向量数据层不仅仅局限于推荐系统，用例还包括电子商务、恶意软件分析、数据分析、生物特征验证、化学公式分析、金融、保险等。</p>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">非结构化数据需要完整的基础软件栈<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>系统软件是所有面向数据应用的基础，但过去几十年来建立起来的数据系统软件，如数据库、数据分析引擎等，都是用来处理结构化数据的。现代数据应用几乎完全依赖于非结构化数据，无法从传统数据库管理系统中获益。</p>
<p>为解决这一问题，我们开发并开源了面向人工智能的通用向量数据库系统<em>Milvus</em>（参考文献编号 1~2）。与传统数据库系统相比，Milvus 工作在不同的数据层上。传统数据库，如关系数据库、KV 数据库、文本数据库、图像/视频数据库等......工作在原始数据层，而 Milvus 则工作在向量数据层。</p>
<p>在接下来的章节中，我们将讨论 Milvus 的新颖特性、架构设计以及我们在构建 Milvus 时所面临的技术挑战。</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">向量数据库的主要属性<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>矢量数据库可以存储、检索、分析矢量，与其他数据库一样，也为 CRUD 操作提供了标准接口。除了这些 "标准 "功能外，下面列出的属性也是向量数据库的重要品质：</p>
<ul>
<li><strong>支持高效向量操作符</strong></li>
</ul>
<p>分析引擎对向量操作符的支持主要集中在两个层面。首先，向量数据库应支持不同类型的操作符，例如上文提到的语义相似性匹配和语义算术。除此之外，它还应支持各种用于基础相似性计算的相似性度量。这种相似性通常量化为向量之间的空间距离，常见的度量指标有欧氏距离、余弦距离和内积距离。</p>
<ul>
<li><strong>支持向量索引</strong></li>
</ul>
<p>与传统数据库中基于 B 树或 LSM 树的索引相比，高维向量索引通常会消耗更多的计算资源。我们建议使用聚类和图索引算法，优先进行矩阵和向量操作，从而充分利用前面提到的硬件向量计算加速能力。</p>
<ul>
<li><strong>不同部署环境下的一致用户体验</strong></li>
</ul>
<p>向量数据库通常在不同的环境中开发和部署。在初始阶段，数据科学家和算法工程师主要在笔记本电脑和工作站上工作，因为他们更注重验证效率和迭代速度。验证完成后，他们可能会在私有集群或云上部署全尺寸数据库。因此，一个合格的向量数据库系统应能在不同的部署环境中提供一致的性能和用户体验。</p>
<ul>
<li><strong>支持混合搜索</strong></li>
</ul>
<p>随着向量数据库变得无处不在，新的应用不断涌现。在所有这些需求中，最常被提及的是对向量和其他类型数据的混合搜索。这方面的几个例子是标量过滤后的近似近邻搜索（ANNS）、全文搜索和向量搜索的多通道召回，以及时空数据和向量数据的混合搜索。此类挑战要求具备弹性扩展能力和查询优化能力，以便将向量搜索引擎与 KV、文本和其他搜索引擎有效融合。</p>
<ul>
<li><strong>云原生架构</strong></li>
</ul>
<p>随着数据 Collections 的指数级增长，向量数据量如雨后春笋般涌现。万亿规模的高维向量数据对应着数千 TB 的存储空间，远远超出了单个节点的极限。因此，横向扩展能力是向量数据库的关键能力，应满足用户对弹性和部署灵活性的需求。此外，它还应降低系统操作和维护的复杂性，同时借助云基础设施提高可观测性。其中一些需求包括多租户隔离、数据快照和备份、数据加密以及数据可视化等传统数据库中常见的功能。</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">向量数据库系统架构<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 遵循 &quot;日志即数据&quot;、&quot;统一批处理和流处理&quot;、&quot;无状态 &quot;和 &quot;微服务 &quot;的设计原则。图 4 描述了 Milvus 2.0 的整体架构。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>日志即数据</strong>：Milvus 2.0 不维护任何物理表。相反，它通过日志持久化和日志快照来确保数据的可靠性。日志代理（系统主干）存储日志，并通过日志发布-订阅（pub-sub）机制解耦组件和服务。如图 5 所示，日志代理由 &quot;日志序列 &quot;和 &quot;日志订阅者 &quot;组成。日志序列记录所有改变 Collections 状态的操作（相当于关系数据库中的表）；日志订阅者订阅日志序列，更新其本地数据，并以只读副本的形式提供服务。在变更数据捕获（CDC）和全局分布式部署方面，pub-sub 机制也为系统的可扩展性留出了空间。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>统一的批处理和流处理</strong>：日志流允许 Milvus 实时更新数据，从而确保实时交付。此外，通过将数据批量转化为日志快照并在快照上建立索引，Milvus 能够实现更高的查询效率。在查询过程中，Milvus 会合并增量数据和历史数据的查询结果，以保证返回数据的完整性。与传统的 Lambda 架构相比，这样的设计更好地平衡了实时性和效率，减轻了在线和离线系统的维护负担。</p>
<p><strong>无状态</strong>：云基础设施和开源存储组件使 Milvus 无需在自身组件内持久化数据。Milvus 2.0 通过三种存储方式持久化数据：元数据存储、日志存储和对象存储。元数据存储不仅能存储元数据，还能处理服务发现和节点管理。日志存储执行增量数据持久化和数据发布-订阅。对象存储存储日志快照、索引和一些中间计算结果。</p>
<p><strong>微服务</strong>：Milvus 遵循数据平面和控制平面分解、读/写分离、在线/离线任务分离的原则。它由四层服务组成：访问层、协调层、工作层和存储层。在扩展和灾难恢复方面，这些层是相互独立的。作为面向前端的层和用户终端，访问层处理客户端连接、验证客户端请求并合并查询结果。作为系统的 &quot;大脑&quot;，协调层承担着集群拓扑管理、负载平衡、数据声明和数据管理等任务。工作层包含系统的 "四肢"，执行数据更新、查询和索引构建操作。最后，存储层负责数据的持久性和复制。总体而言，这种基于微服务的设计确保了系统复杂性的可控性，每个组件都负责其相应的功能。Milvus 通过定义明确的接口澄清了服务边界，并根据更细的粒度解耦服务，从而进一步优化了弹性可扩展性和资源分配。</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">向量数据库面临的技术挑战<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>早期对向量数据库的研究主要集中在高效索引结构和查询方法的设计上--由此产生了各种向量搜索算法库（参考文献 No.3~5）。在过去几年中，越来越多的学术和工程团队从系统设计的角度重新审视向量搜索问题，并提出了一些系统性的解决方案。综合现有研究和用户需求，我们将向量数据库面临的主要技术挑战归纳如下：</p>
<ul>
<li><strong>相对于负载的性价比优化</strong></li>
</ul>
<p>与传统数据类型相比，向量数据由于维度高，分析起来需要耗费更多的存储和计算资源。此外，用户对向量搜索解决方案的负载特征和性价比优化表现出不同的偏好。例如，用户在处理超大数据集（数百亿或数千亿向量）时，会偏好数据存储成本较低且搜索延迟有变化的解决方案，而其他用户则可能要求更高的搜索性能和不变化的平均延迟。为了满足这种不同的偏好，向量数据库的核心索引组件必须能够支持不同类型存储和计算硬件的索引结构和搜索算法。</p>
<p>例如，在降低存储成本时，应考虑将向量数据和相应的索引数据存储在更便宜的存储介质（如 NVM 和 SSD）中。然而，现有的大多数向量搜索算法都是直接从内存中读取数据。为了避免使用磁盘驱动器带来的性能损失，向量数据库除了能够适应向量数据和索引结构的存储方案外，还应能够利用数据访问的局部性结合搜索算法（参考文献编号 6~8）。为了提高性能，当代研究的重点是涉及 GPU、NPU、FPGA 等的硬件加速技术（参考文献 9）。然而，特定加速硬件和芯片在架构设计上各不相同，不同硬件加速器之间最高效执行的问题尚未解决。</p>
<ul>
<li><strong>自动系统配置和调整</strong></li>
</ul>
<p>现有关于向量搜索算法的研究大多寻求存储成本、计算性能和搜索精度之间的灵活平衡。一般来说，算法参数和数据特征都会影响算法的实际性能。由于用户的需求在成本和性能方面各不相同，因此选择一种适合用户需求和数据特征的向量查询方法是一项重大挑战。</p>
<p>尽管如此，由于向量数据的维度较高，人工分析数据分布对搜索算法影响的方法并不有效。为了解决这个问题，学术界和工业界都在寻求基于机器学习的算法推荐解决方案（参考文献 10）。</p>
<p>设计一种由 ML 驱动的智能向量搜索算法也是一个研究热点。一般来说，现有的向量搜索算法是针对各种维度和分布模式的向量数据普遍开发的。因此，它们不支持根据数据特征建立特定的索引结构，优化空间很小。未来的研究还应探索有效的机器学习技术，针对不同的数据特征定制索引结构（参考文献 11-12）。</p>
<ul>
<li><strong>支持高级查询语义</strong></li>
</ul>
<p>现代应用往往依赖跨向量的更高级查询--传统的近邻搜索语义已不再适用于向量数据搜索。此外，跨多个向量数据库或对向量和非向量数据进行组合搜索的需求也在不断涌现（参考文献第 13 号）。</p>
<p>具体来说，向量相似性距离度量的变化增长很快。传统的相似性得分，如欧氏距离、内积距离和余弦距离，无法满足所有应用需求。随着人工智能技术的普及，许多行业都在开发自己领域特定的向量相似性度量，如谷本距离、马哈罗诺比距离、超结构和子结构等。将这些评价指标整合到现有的搜索算法中，以及利用这些指标设计新型算法，都是极具挑战性的研究课题。</p>
<p>随着用户服务复杂性的增加，应用程序将需要在向量数据和非向量数据中进行搜索。例如，内容推荐程序会分析用户的偏好和社会关系，并将其与当前的热门话题相匹配，从而向用户推荐合适的内容。这类搜索通常涉及对多种数据类型或跨多个数据处理系统的查询。如何高效灵活地支持这种混合搜索是系统设计的另一个挑战。</p>
<h2 id="Authors" class="common-anchor-header">作者<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>郭仁通博士（华中科技大学计算机软件与理论专业博士），Zilliz 公司合伙人兼研发总监。他是中国计算机学会分布式计算与处理技术委员会（CCF TCDCP）委员。他的研究重点是数据库、分布式系统、缓存系统和异构计算。他的研究成果发表在多个顶级会议和期刊上，包括 Usenix ATC、ICS、DATE、TPDS 等。作为 Milvus 的架构师，郭博士正在寻求解决方案，以开发高扩展性和高成本效益的基于人工智能的数据分析系统。</p>
<p>栾小凡，Zilliz 公司合伙人兼工程总监，LF AI &amp; Data 基金会技术顾问委员会成员。曾先后就职于甲骨文美国总部和软件定义存储初创公司Hedvig。他加入阿里巴巴云数据库团队，负责 NoSQL 数据库 HBase 和 Lindorm 的开发。栾先生拥有康奈尔大学电子计算机工程硕士学位。</p>
<p>易晓萌博士（华中科技大学计算机架构博士），资深研究员，Zilliz 研究团队负责人。他的研究集中于高维数据管理、大规模信息检索和分布式系统中的资源分配。易博士的研究成果发表在IEEE Network Magazine、IEEE/ACM TON、ACM SIGMOD、IEEE ICDCS和ACM TOMPECS等权威期刊和国际会议上。</p>
<p>Filip Haltmayer 是 Zilliz 数据工程师，毕业于加州大学圣克鲁兹分校，获得计算机科学学士学位。加入 Zilliz Cloud 后，Filip 的大部分时间都花在云部署、客户互动、技术讲座和人工智能应用开发上。</p>
<h2 id="References" class="common-anchor-header">参考资料<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Milvus 项目：https://github.com/milvus-io/milvus</li>
<li>Milvus：专用向量数据管理系统，SIGMOD'21</li>
<li>Faiss 项目：https://github.com/facebookresearch/faiss</li>
<li>Annoy 项目：https://github.com/spotify/annoy</li>
<li>SPTAG 项目： https://github.com/microsoft/SPTAG</li>
<li>GRIP：向量搜索引擎的多存储容量优化高性能近邻搜索，CIKM'19</li>
<li>DiskANN：单节点快速精确十亿点近邻搜索，NIPS'19</li>
<li>HM-ANN：异构内存上的高效十亿分最近邻搜索，NIPS'20</li>
<li>SONG：GPU 上的近似近邻搜索，ICDE'20</li>
<li>ottertune 自动数据库管理系统调整服务演示，VLDB'18</li>
<li>学习索引结构的案例，SIGMOD'18</li>
<li>通过学习型自适应早期终止改进近似近邻搜索》，SIGMOD'20</li>
<li>AnalyticDB-V：面向结构化和非结构化数据查询融合的混合分析引擎》，VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">参与我们的开源社区：<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>在<a href="https://bit.ly/3khejQB">GitHub</a> 上查找 Milvus 或为其做出贡献。</li>
<li>通过<a href="https://bit.ly/307HVsY">论坛</a>与社区互动。</li>
<li>在<a href="https://bit.ly/3wn5aek">Twitter</a> 上与我们联系。</li>
</ul>
