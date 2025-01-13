---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: 使用 Milvus 和英伟达™（NVIDIA®）Merlin 在推荐工作流中进行高效向量相似性搜索
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: 介绍如何将英伟达™（NVIDIA®）Merlin 和 Milvus 集成到推荐系统中，并对其在各种情况下的性能进行基准测试。
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>本篇文章首次发布<a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">于英伟达梅兰日兰的 Medium 频道</a>，经授权编辑后在此转发。本文由来自 NVIDIA 的<a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya</a>和<a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a>以及来自 Zilliz 的<a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer</a>和<a href="https://github.com/liliu-z">Li Liu</a>共同撰写。</em></p>
<h2 id="Introduction" class="common-anchor-header">引言<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>现代推荐系统（Recsys）由训练/推理管道组成，涉及数据摄取、数据预处理、模型训练和超参数调整等多个阶段，用于检索、过滤、排序和为相关项目评分。推荐系统管道的一个重要组成部分是检索或发现与用户最相关的内容，尤其是在有大量项目目录的情况下。这一步骤通常涉及在索引数据库中对产品和用户属性的低维向量表示（即 Embeddings）进行<a href="https://zilliz.com/glossary/anns">近似近邻（ANN）</a>搜索，该数据库是由根据用户与产品/服务之间的交互进行训练的深度学习模型创建的。</p>
<p><a href="https://github.com/NVIDIA-Merlin">英伟达梅林（NVIDIA Merlin</a>）是为训练端到端模型以在任何规模上进行推荐而开发的开源框架，它集成了高效的<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>索引和搜索框架。最近备受关注的一个此类框架是由<a href="https://zilliz.com/">Zilliz</a> 创建的开源向量数据库<a href="https://zilliz.com/what-is-milvus">Milvus</a>。它提供快速索引和查询功能。Milvus 最近增加了<a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPU 加速支持</a>，它使用英伟达™（NVIDIA®）GPU 来维持人工智能工作流。GPU 加速支持是一个好消息，因为加速向量搜索库使快速并发查询成为可能，对当今推荐系统中的延迟要求产生了积极影响，开发人员期望在推荐系统中实现许多并发请求。Milvus 的 docker 拉取次数超过 500 万次，在 GitHub 上有 ~23k stars（截至 2023 年 9 月），拥有 5000 多家企业客户，是许多应用的核心组件（参见<a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">用例</a>）。</p>
<p>本博客展示了 Milvus 如何在训练和推理时与 Merlin Recsys 框架协同工作。我们展示了 Milvus 如何在项目检索阶段通过高效的 top-k 向量 Embeddings 搜索对 Merlin 进行补充，以及如何在推理时与英伟达 Triton Inference Server（TIS）配合使用（见图 1）。<strong>我们的基准测试结果表明，使用英伟达™（NVIDIA®）RAFT与Merlin模型生成的向量嵌入的GPU加速Milvus的速度提高了37倍至91倍，令人印象深刻。</strong>我们用来展示Merlin-Milvus集成的代码和详细的基准测试结果，以及促进我们基准测试研究的<a href="https://github.com/zilliztech/VectorDBBench">库</a>，都可以在这里获得。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 1.多阶段推荐系统，Milvus 框架在检索阶段做出了贡献。原始多级图来源：本<a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">博文</a>。</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">推荐器面临的挑战<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>鉴于推荐器的多阶段性以及所集成的各种组件和库的可用性，将所有组件无缝集成到端到端管道中是一项重大挑战。我们的目标是在我们的示例笔记本中向大家展示，集成工作可以事半功倍。</p>
<p>推荐工作流的另一个挑战是加速某些管道部分。众所周知，GPU 在训练大型神经网络方面发挥着巨大作用，但它只是最近才加入向量数据库和 ANN 搜索的。随着电子商务产品库存或流媒体数据库的规模以及使用这些服务的用户数量不断增加，CPU 必须提供所需的性能，才能在性能卓越的 Recsys 工作流中为数百万用户提供服务。其他流水线部分的 GPU 加速已成为应对这一挑战的必要手段。本博客中的解决方案通过展示使用 GPU 时 ANN 搜索的效率来应对这一挑战。</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">解决方案的技术栈<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，让我们回顾一下开展工作所需的一些基本要素。</p>
<ul>
<li><p>英伟达<a href="https://github.com/NVIDIA-Merlin/Merlin">™</a>（NVIDIA®）<a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>：一个开源库，具有高级应用程序接口，可在英伟达™（NVIDIA®）GPU上加速推荐程序。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>：用于预处理输入表格数据和特征工程。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin 模型</a>：用于训练深度学习模型，并在本例中从用户交互数据中学习用户和项目嵌入向量。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Merlin 系统</a>：用于将基于 TensorFlow 的推荐模型与其他元素（如特征存储、Milvus 的 ANN 搜索）结合起来，与 TIS 一起提供服务。</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton 推断服务器</a>：用于推理阶段，在该阶段传递用户特征向量，并生成产品推荐。</p></li>
<li><p>容器化：上述所有功能都可通过英伟达在<a href="https://catalog.ngc.nvidia.com/">NGC 目录</a>中提供的容器实现。我们使用了<a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">此处</a>提供的 Merlin TensorFlow 23.06 容器。</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>：用于进行 GPU 加速的向量索引和查询。</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>：同上，但用于在 CPU 上进行。</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>：用于连接 Milvus 服务器，创建向量数据库索引，并通过 Python 接口运行查询。</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>：用于在（开源）特征库中保存和检索用户和项目属性，作为端到端 RecSys 管道的一部分。</p></li>
</ul>
<p>我们还使用了一些底层库和框架。例如，Merlin 依赖于其他英伟达™（NVIDIA®）库，如 cuDF 和 Dask，这两个库均可在<a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a> 下使用。同样，Milvus 在 GPU 加速方面依赖于<a href="https://github.com/rapidsai/raft">英伟达 RAFT</a>的原语，在搜索方面依赖于<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>和<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>等修改过的库。</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">了解向量数据库和 Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">近似近邻（ANN）</a>是关系数据库无法处理的功能。关系数据库旨在处理具有预定义结构和直接可比值的表格数据。关系数据库索引依靠这一点来比较数据，并利用知道每个值是否小于或大于其他值的优势创建结构。Embeddings 向量不能以这种方式直接相互比较，因为我们需要知道向量中的每个值代表什么。他们不能说一个向量是否一定小于其他向量。我们唯一能做的就是计算两个向量之间的距离。如果两个向量之间的距离很小，我们就可以认为它们所代表的特征是相似的；如果距离很大，我们就可以认为它们所代表的数据差异较大。然而，这些高效的索引是有代价的，计算两个向量之间的距离计算成本很高，而且向量索引不容易适应，有时甚至无法修改。由于这两个限制，在关系数据库中集成这些索引更为复杂，这就是为什么需要<a href="https://zilliz.com/blog/what-is-a-real-vector-database">专门建立向量</a>数据库的原因。</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>就是为了解决关系数据库在向量方面遇到的问题而创建的，它从一开始就是为了大规模处理这些嵌入向量及其索引而设计的。为了履行云原生的徽章，Milvus 将计算和存储以及不同的计算任务--查询、数据理清和索引--分离开来。无论是重数据插入还是重搜索，用户都可以扩展每个数据库部分，以处理其他用例。如果有大量插入请求涌入，用户可以临时横向和纵向扩展索引节点，以处理数据插入。同样，如果没有数据输入，但有大量搜索，用户可以减少索引节点，转而扩大查询节点，以提高吞吐量。这种系统设计（见图 2）要求我们以并行计算的思维方式进行思考，从而产生了一个计算优化的系统，并为进一步优化打开了许多大门。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 2.Milvus 系统设计</em></p>
<p>Milvus 还使用了许多最先进的索引库，为用户提供尽可能多的系统定制功能。它通过增加处理 CRUD 操作符、流式数据和过滤的能力来改进它们。稍后，我们将讨论这些索引的不同之处以及各自的优缺点。</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">示例解决方案：Milvus 和 Merlin 的集成<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>我们在此介绍的示例解决方案展示了 Milvus 与 Merlin 在项目检索阶段（通过 ANN 搜索检索出 k 个最相关的项目时）的集成。我们使用的是来自<a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys 挑战赛的</a>真实数据集，详情如下。我们训练了一个双塔（Two-Tower）深度学习模型，学习用户和条目的向量嵌入。本节还提供了我们基准测试工作的蓝图，包括我们收集的指标和使用的参数范围。</p>
<p>我们的方法包括</p>
<ul>
<li><p>数据摄取和预处理</p></li>
<li><p>双塔深度学习模型训练</p></li>
<li><p>建立 Milvus 索引</p></li>
<li><p>Milvus 相似性搜索</p></li>
</ul>
<p>我们将简要介绍每个步骤，详情请读者参阅我们的<a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">笔记本</a>。</p>
<h3 id="Dataset" class="common-anchor-header">数据集</h3><p>YOOCHOOSE GmbH 为<a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys 2015 挑战赛</a>提供了我们在本集成和基准研究中使用的数据集，该数据集可在 Kaggle 上获取。该数据集包含来自一家欧洲在线零售商的用户点击/购买事件，其属性包括会话 ID、时间戳、与点击/购买相关的商品 ID 和商品类别，可在文件 yoochoose-clicks.dat 中获取。这些会话是独立的，而且没有返回用户的提示，因此我们将每个会话视为属于一个不同的用户。数据集中有 9,249,729 个唯一会话（用户）和 52,739 个唯一项目。</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">数据摄取和预处理</h3><p>我们使用的数据预处理工具是<a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>，它是 Merlin 的一个 GPU 加速、高度可扩展的特征工程和预处理组件。我们使用 NVTabular 将数据读入 GPU 内存，根据需要重新排列特征，导出为 parquet 文件，并为训练创建训练-验证分割。这样就有 7,305,761 个唯一用户和 49,008 个唯一项目可供训练。我们还将每一列及其值归类为整数值。现在，数据集已准备就绪，可以使用双塔模型进行训练。</p>
<h3 id="Model-training" class="common-anchor-header">模型训练</h3><p>我们使用<a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a>深度学习模型来训练并生成用户和物品嵌入，之后用于向量索引和查询。训练完模型后，我们就可以提取学习到的用户和项目嵌入。</p>
<p>下面两个步骤是可选的：一个是训练好的<a href="https://arxiv.org/abs/1906.00091">DLRM</a>模型，用于对检索到的项目进行排序推荐；另一个是使用的特征存储（在本例中是<a href="https://github.com/feast-dev/feast">Feast</a>），用于存储和检索用户和项目特征。为了使多阶段工作流程更加完整，我们加入了这两个步骤。</p>
<p>最后，我们将用户和项目的 Embeddings 导出到 parquet 文件中，之后可以重新加载这些文件来创建 Milvus 向量索引。</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">建立和查询 Milvus 索引</h3><p>Milvus 通过在推理机上启动 "服务器 "来促进向量索引和相似性搜索。在笔记本 #2 中，我们通过管道安装 Milvus 服务器和 Pymilvus 进行设置，然后使用默认监听端口启动服务器。接下来，我们将演示建立一个简单的索引（IVF_FLAT），并分别使用函数<code translate="no">setup_milvus</code> 和<code translate="no">query_milvus</code> 对其进行查询。</p>
<h2 id="Benchmarking" class="common-anchor-header">基准测试<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>我们设计了两个基准测试，以证明使用 Milvus 这样快速高效的向量索引/搜索库的可行性。</p>
<ol>
<li><p>使用 Milvus 建立向量索引时，我们生成了两组嵌入数据：1）730 万独特用户的用户嵌入，分为 85% 的训练集（用于索引）和 15% 的测试集（用于查询），以及 2）49K 产品的项目嵌入（训练-测试各占一半）。该基准测试是针对每个向量数据集独立完成的，结果将分别报告。</p></li>
<li><p>使用 Milvus 为 49K item embeddings 数据集建立向量索引，并根据该索引查询 7.3M 唯一用户进行相似性搜索。</p></li>
</ol>
<p>在这些基准测试中，我们使用了在 GPU 和 CPU 上执行的 IVFPQ 和 HNSW 索引算法以及各种参数组合。详情请<a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">点击此处</a>。</p>
<p>搜索质量与吞吐量的权衡是一个重要的性能考量因素，尤其是在生产环境中。Milvus 允许对索引参数进行完全控制，以探索特定用例的这一权衡，从而通过地面实况获得更好的搜索结果。这可能意味着以降低吞吐率或每秒查询次数（QPS）的形式增加计算成本。我们用召回率指标来衡量 ANN 搜索的质量，并提供 QPS 召回率曲线来证明这种权衡。这样，我们就可以根据业务案例的计算资源或延迟/吞吐量要求，确定可接受的搜索质量水平。</p>
<p>此外，请注意我们的基准中使用的查询批量大小（nq）。这在向推理发送多个并发请求的工作流中非常有用（例如，请求离线推荐并将其发送到电子邮件收件人列表，或通过汇集并发请求并一次性处理它们来创建在线推荐）。根据不同的使用情况，TIS 还可以帮助批量处理这些请求。</p>
<h3 id="Results" class="common-anchor-header">结果</h3><p>我们现在报告 CPU 和 GPU 上的三组基准测试结果，使用的是 Milvus 实现的 HNSW（仅 CPU）和 IVF_PQ（CPU 和 GPU）索引类型。</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">项与项向量相似性搜索</h4><p>使用这个最小的数据集，每次运行给定参数组合时，都会将 50%的项向量作为查询向量，并从其余向量中查询前 100 个相似向量。在测试的参数设置下，HNSW 和 IVF_PQ 的召回率都很高，分别在 0.958-1.0 和 0.665-0.997 之间。这一结果表明，HNSW 在召回率方面表现更好，但 IVF_PQ 在较小的 nlist 设置下产生的召回率非常接近。我们还应该注意到，召回率值会因索引和查询参数的不同而有很大差异。我们所报告的值是在对一般参数范围进行初步试验并进一步放大到选定子集后获得的。</p>
<p>在给定参数组合下，使用 HNSW 在 CPU 上执行所有查询的总时间为 5.22 至 5.33 秒（m 越大速度越快，ef 相对不变），使用 IVF_PQ 则为 13.67 至 14.67 秒（nlist 和 nprobe 越大速度越慢）。GPU 加速确实有明显的效果，如图 3 所示。</p>
<p>图 3 显示了使用 IVF_PQ 在 CPU 和 GPU 上完成的所有运行的召回-吞吐量权衡。我们发现，在测试的所有参数组合中，GPU 的速度提高了 4 到 15 倍（nprobe 越大，速度越快）。计算方法是，在每个参数组合下，GPU 运行的 QPS 与 CPU 运行的 QPS 之比。总体而言，该数据集对 CPU 或 GPU 的挑战较小，并显示出在更大数据集上进一步提速的前景，具体讨论见下文。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 3.在英伟达 A100 GPU 上运行 Milvus IVF_PQ 算法的 GPU 速度提升（项目-项目相似性搜索）</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">用户与用户向量相似性搜索</h4><p>对于规模更大的第二个数据集（730 万用户），我们将 85%（约 620 万）的向量作为 "训练"（需要索引的向量集），其余 15%（约 110 万）作为 "测试 "或查询向量集。在这种情况下，HNSW 和 IVF_PQ 的表现非常出色，召回值分别为 0.884-1.0 和 0.922-0.999。不过，它们的计算要求要高得多，尤其是在 CPU 上使用 IVF_PQ。使用 HNSW 在 CPU 上执行所有查询的总时间为 279.89 到 295.56 秒，使用 IVF_PQ 则为 3082.67 到 10932.33 秒。</p>
<p>但是，如果推理服务器需要处理成千上万个并发请求，对数以百万计的项目进行查询，那么基于 CPU 的查询可能就不可行了。</p>
<p>如图 4 所示，A100 GPU 在 IVF_PQ 的所有参数组合下，吞吐量（QPS）都大幅提升了 37 倍到 91 倍（平均 76.1 倍）。这与我们在小型数据集上观察到的结果一致，表明在使用具有数百万个嵌入向量的 Milvus 时，GPU 性能的扩展性相当不错。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 4在英伟达 A100 GPU 上运行 Milvus IVF_PQ 算法的 GPU 速度提升（用户-用户相似性搜索）</em></p>
<p>下面详细的图 5 显示了使用 IVF_PQ 在 CPU 和 GPU 上测试的所有参数组合的召回率-QPS 权衡。图中的每个点组（上部为 GPU，下部为 CPU）都描述了在改变向量索引/查询参数时所面临的权衡，即以较低的吞吐量为代价获得更高的召回率。请注意，在试图实现更高的召回率时，GPU 的 QPS 损失相当大。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 5.使用 IVF_PQ 在 CPU 和 GPU 上测试的所有参数组合的召回率-吞吐量权衡（用户 vs. 用户）</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">用户与项目向量相似性搜索</h4><p>最后，我们考虑另一个现实的使用案例，即用户向量与条目向量的查询（如上文笔记本 01 中的演示）。在这种情况下，49K 个项目向量被编入索引，7.3M 个用户向量分别查询前 100 个最相似的项目。</p>
<p>这就是有趣的地方，因为针对 49K 个项目的索引，以 1000 次为一批查询 730 万个用户向量，在 CPU 上对 HNSW 和 IVF_PQ 来说都很耗时。GPU 似乎能更好地处理这种情况（见图 6）。当 nlist = 100 时，在 CPU 上计算 IVF_PQ 的最高精确度平均约需 86 分钟，但随着 nprobe 值的增加，精确度会有显著变化（nprobe = 5 时为 51 分钟，nprobe = 20 时为 128 分钟）。英伟达™（NVIDIA®）A100 GPU 可将计算速度提高 4 至 17 倍（nprobe 越大，速度越快）。请记住，IVF_PQ 算法通过其量化技术也减少了内存占用，并结合 GPU 加速提供了计算上可行的 ANN 搜索解决方案。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 6.在英伟达 A100 GPU 上运行 Milvus IVF_PQ 算法的 GPU 加速（用户项目相似性搜索）</em></p>
<p>与图 5 类似，图 7 显示了使用 IVF_PQ 测试的所有参数组合的召回率-吞吐量权衡。在这里，我们仍然可以看到，为了提高吞吐量，我们可能需要略微放弃一些 ANN 搜索的准确性，不过这种差异已经不那么明显了，尤其是在 GPU 运行的情况下。这表明，使用 GPU 可以获得相对稳定的高计算性能，同时还能实现高召回率。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 7.IVF_PQ 在 CPU 和 GPU 上测试的所有参数组合的召回率-吞吐量权衡（用户与项目）</em></p>
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
    </button></h2><p>如果您已经阅读到这里，我们很乐意与您分享一些结束语。我们想提醒您的是，现代 Recsys 的复杂性和多阶段性要求每个步骤都必须具备性能和效率。希望本篇博客能为您提供令人信服的理由，让您考虑在 RecSys 管线中使用两项关键功能：</p>
<ul>
<li><p>英伟达™（NVIDIA®）Merlin 的 Merlin Systems 库允许您轻松插入<a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>，这是一个高效的 GPU 加速向量搜索引擎。</p></li>
<li><p>利用GPU加速向量数据库索引的计算，并利用<a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a>等技术进行ANN搜索。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这些研究结果表明，所介绍的 Merlin-Milvus 集成具有很高的性能，其训练和推理的复杂性远低于其他方案。而且，这两个框架都在积极开发，每次发布都会增加许多新功能（如 Milvus 的新 GPU 加速向量数据库索引）。向量相似性搜索是计算机视觉、大型语言模型和推荐系统等各种工作流程中的重要组成部分，这使得我们的努力更有价值。</p>
<p>最后，我们要感谢来自 Zilliz/Milvus 和 Milvus 以及 RAFT 团队的所有人员，感谢他们为完成这项工作和这篇博文所付出的努力。如果您有机会在您的recsys或其他工作流程中实施Merlin和Milvus，期待您的来信。</p>
