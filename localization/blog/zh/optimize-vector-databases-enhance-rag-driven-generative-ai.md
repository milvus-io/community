---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: 优化向量数据库，增强 RAG 驱动的生成式人工智能
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: 在本文中，您将了解更多关于向量数据库及其基准测试框架、解决不同方面问题的数据集以及用于性能分析的工具--您开始优化向量数据库所需的一切。
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>这篇文章最初发表在<a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">英特尔的 Medium 频道</a>上，现经授权在此转贴。</em></p>
<p><br></p>
<p>使用 RAG 时优化向量数据库的两种方法</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>照片由<a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a>在<a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a>上拍摄</p>
<p>作者：Cathy Zhang 和 Malini Bhandaru 博士 撰稿人：Cathy Zhang 和 Malini Bhandaru 博士杨林、刘长艳</p>
<p>生成式人工智能（GenAI）模型在我们的日常生活中得到了指数级的应用，它正在通过<a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">检索增强生成（RAG）</a>得到改进，<a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">RAG</a> 是一种通过从外部来源获取事实来提高响应准确性和可靠性的技术。RAG 可帮助常规<a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">大型语言模型（LLM）</a>理解上下文，并通过利用以向量形式存储的非结构化数据巨型数据库来减少<a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">幻觉</a>--向量是一种数学表现形式，有助于捕捉数据之间的上下文和关系。</p>
<p>RAG 有助于检索更多的上下文信息，从而生成更好的响应，但它们所依赖的向量数据库却越来越大，以提供丰富的内容供人们借鉴。就像万亿参数的 LLMs 即将出现一样，数十亿向量的向量数据库也不远了。作为优化工程师，我们很想知道能否让向量数据库的性能更强、加载数据的速度更快、创建索引的速度更快，以确保在增加新数据时仍能保持检索速度。这样做不仅能减少用户等待时间，还能使基于 RAG 的人工智能解决方案更具可持续性。</p>
<p>在本文中，您将了解更多关于向量数据库及其基准测试框架、解决不同方面问题的数据集以及用于性能分析的工具--您开始优化向量数据库所需的一切。我们还将分享我们在两个流行的向量数据库解决方案上取得的优化成果，为您的性能和可持续性影响优化之旅提供启发。</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">了解向量数据库<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>与以结构化方式存储数据的传统关系数据库或非关系数据库不同，向量数据库包含使用嵌入或转换函数构建的单个数据项（称为向量）的数学表示。向量通常表示特征或语义，可长可短。向量数据库通过使用距离度量（距离越近表示结果越相似），如<a href="https://www.pinecone.io/learn/vector-similarity/">欧几里得、点积或余弦相似度</a>进行相似性搜索来完成向量检索。</p>
<p>为了加速检索过程，向量数据使用索引机制进行组织。这些组织方法的例子包括平面结构、<a href="https://arxiv.org/abs/2002.09094">倒置文件（IVF）、</a> <a href="https://arxiv.org/abs/1603.09320">层次化可导航小世界（HNSW）</a>和<a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">位置敏感散列（LSH）</a>等等。这些方法中的每一种都有助于在需要时提高检索相似向量的效率和效果。</p>
<p>让我们来看看如何在 GenAI 系统中使用向量数据库。图 1 展示了向向量数据库加载数据以及在 GenAI 应用程序中使用数据的过程。当您输入提示时，它将经历一个与在数据库中生成向量相同的转换过程。转换后的向量提示将用于从向量数据库中检索类似的向量。这些检索到的项目实质上就是会话记忆，为提示提供了上下文历史，类似于 LLMs 的操作符。在自然语言处理、计算机视觉、推荐系统和其他需要语义理解和数据匹配的领域，这一功能尤其具有优势。您的初始提示随后会与检索到的元素 "合并"，从而提供上下文，并帮助 LLM 根据所提供的上下文制定响应，而不是完全依赖其原始训练数据。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 1.RAG 应用架构。</p>
<p>向量的存储和索引用于快速检索。向量数据库主要有两种类型，一种是扩展用于存储向量的传统数据库，另一种是专门构建的向量数据库。提供向量支持的传统数据库包括<a href="https://redis.io/">Redis</a>、<a href="https://github.com/pgvector/pgvector">pgvector</a>、<a href="https://www.elastic.co/elasticsearch">Elasticsearch</a> 和<a href="https://opensearch.org/">OpenSearch</a>。专用向量数据库的例子包括专有解决方案<a href="https://zilliz.com/">Zilliz</a>和<a href="https://www.pinecone.io/">Pinecone</a>，以及开源项目<a href="https://milvus.io/">Milvus</a>、<a href="https://weaviate.io/">Weaviate</a>、<a href="https://qdrant.tech/">Qdrant</a>、<a href="https://github.com/facebookresearch/faiss">Faiss</a> 和<a href="https://www.trychroma.com/">Chroma</a>。您可以通过<a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>和<a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a> 在 GitHub 上了解有关向量数据库的更多信息。</p>
<p>我们将从 Milvus 和 Redis 两类数据库中各选一个进行详细介绍。</p>
<h2 id="Improving-Performance" class="common-anchor-header">提高性能<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解优化之前，让我们先回顾一下向量数据库的评估方式、一些评估框架以及可用的性能分析工具。</p>
<h3 id="Performance-Metrics" class="common-anchor-header">性能指标</h3><p>让我们来看看可以帮助你衡量向量数据库性能的关键指标。</p>
<ul>
<li><strong>加载延迟</strong>衡量的是将数据加载到向量数据库内存和建立索引所需的时间。索引是一种数据结构，用于根据相似度或距离有效地组织和检索向量数据。<a href="https://milvus.io/docs/index.md#In-memory-Index">内存索引</a>的类型包括<a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">平面索引</a>、<a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>、<a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ、HNSW、</a> <a href="https://github.com/google-research/google-research/tree/master/scann">可扩展近邻（ScaNN）</a>和<a href="https://milvus.io/docs/disk_index.md">DiskANN</a>。</li>
<li><strong>召回率</strong>是指在搜索算法检索到的<a href="https://redis.io/docs/data-types/probabilistic/top-k/">前 K 个</a>结果中找到的真实匹配项或相关项所占的比例。召回值越高，表明检索到的相关项目越多。</li>
<li><strong>每秒查询次数（QPS）</strong>是指向量数据库处理传入查询的速度。QPS 值越高，说明查询处理能力和系统吞吐量越好。</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">基准框架</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 2.向量数据库基准测试框架。</p>
<p>矢量数据库基准测试需要矢量数据库服务器和客户端。在性能测试中，我们使用了两种流行的开源工具。</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>：</strong>VectorDBBench 由 Zilliz 开发并开源，可帮助测试具有不同索引类型的不同向量数据库，并提供方便的 Web 界面。</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>：</strong>vector-db-benchmark由Qdrant开发并开放源代码，有助于测试几种典型的<a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>索引类型的向量数据库。它通过命令行运行测试，并提供一个<a href="https://docs.docker.com/compose/">Docker Compose</a>__ 文件，以简化服务器组件的启动。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 3.用于运行基准测试的 vector-db-benchmark 命令示例。</p>
<p>但基准框架只是其中的一部分。我们需要能锻炼向量数据库解决方案本身不同方面的数据，比如它处理大量数据、各种向量大小和检索速度的能力。有了这些，让我们来看看一些可用的公开数据集。</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">锻炼向量数据库的开放数据集</h3><p>大型数据集是测试负载延迟和资源分配的理想选择。有些数据集具有高维数据，适合测试计算相似性的速度。</p>
<p>数据集的维度从 25 到 2048 不等。<a href="https://laion.ai/">LAION</a>数据集是一个开放的图像 Collections，已被用于训练非常大的视觉和语言深度神经模型，如稳定扩散生成模型。OpenAI 的数据集包含 5M 个向量，每个向量的维度为 1536，由 VectorDBBench 通过在<a href="https://huggingface.co/datasets/allenai/c4">原始数据</a>上运行 OpenAI 创建。鉴于每个向量元素的类型都是 FLOAT，因此仅保存向量就需要大约 29 GB（5M * 1536 * 4）的内存，再加上用于保存索引和其他元数据的类似额外内存，总共需要 58 GB 的内存用于测试。使用 vector-db-benchmark 工具时，要确保有足够的磁盘存储来保存结果。</p>
<p>为了测试负载延迟，我们需要大量的向量 Collections，而<a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular</a>可以提供。为了测试索引生成和相似性计算的性能，高维向量能提供更大的压力。为此，我们选择了包含 1536 维向量的 500K 数据集。</p>
<h3 id="Performance-Tools" class="common-anchor-header">性能工具</h3><p>我们已经介绍了对系统施加压力以确定相关指标的方法，下面我们来看看更低层次的情况：计算单元的繁忙程度、内存消耗、锁等待时间等。这些都提供了数据库行为的线索，对识别问题区域特别有用。</p>
<p>Linux<a href="https://www.redhat.com/sysadmin/interpret-top-output">top</a>工具提供系统性能信息。不过，Linux 中的<a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a>工具能提供更深入的见解。要了解更多信息，我们还建议阅读<a href="https://www.brendangregg.com/perf.html">Linux perf 示例</a>和<a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">英特尔自顶向下微体系结构分析方法</a>。还有一个工具是<a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">英特尔® vTune™ Profiler</a>，它不仅可以优化应用程序，还可以优化系统性能和配置，适用于 HPC、云计算、物联网、媒体、存储等各种工作负载。</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Milvus 向量数据库优化<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们举例说明我们是如何尝试提高 Milvus 向量数据库的性能的。</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">减少数据节点缓冲区写入时的内存移动开销</h3><p>Milvus 的写路径代理通过<em>MsgStream</em> 将数据写入日志代理。然后，数据节点消耗数据，将其转换并存储为段。分段将合并新插入的数据。合并逻辑会分配一个新的缓冲区，用于保存/移动旧数据和要插入的新数据，然后将新缓冲区作为旧数据返回，用于下一次数据合并。这导致旧数据逐渐变大，进而使数据移动速度变慢。性能曲线显示，这种逻辑的开销很大。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 4.在向量数据库中合并和移动数据会产生很高的性能开销。</p>
<p>我们改变了<em>合并缓冲区</em>逻辑，直接将要插入的新数据追加到旧数据中，避免了分配新缓冲区和移动大型旧数据。Perf 配置文件证实，这一逻辑没有任何开销。微代码指标<em>metric_CPU 操作频率</em>和<em>metric_CPU 利用率</em>表明，这种改善与系统无需再等待长时间的内存移动是一致的。负载延迟改善了 60% 以上。<a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a> 上记录了这一改进。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图 5.减少复制后，我们发现负载延迟的性能提高了 50%。</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">减少内存分配开销的反转索引构建</h3><p>Milvus 搜索引擎<a href="https://milvus.io/docs/knowhere.md">Knowhere</a> 采用<a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">Elkan k-means 算法</a>训练集群数据，用于创建<a href="https://milvus.io/docs/v1.1.1/index.md">反转文件（IVF）索引</a>。每一轮数据训练都会定义一个迭代次数。迭代次数越大，训练结果越好。不过，这也意味着 Elkan 算法将被更频繁地调用。</p>
<p>Elkan 算法每次执行时都要处理内存的分配和删除。具体来说，它会分配内存来存储一半大小的对称矩阵数据，但不包括对角线元素。在 Knowhere 中，Elkan 算法使用的对称矩阵维数设置为 1024，因此内存大小约为 2 MB。这意味着在每一轮训练中，Elkan 会重复分配和取消分配 2 MB 内存。</p>
<p>Perf 分析数据显示，频繁的大内存分配活动。事实上，它触发了<a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">虚拟内存区（VMA）</a>分配、物理页分配、页面映射设置以及内核中内存 cgroup 统计数据的更新。这种大内存分配/去分配活动模式在某些情况下还会加剧内存碎片。这是一项重大税收。</p>
<p><em>IndexFlatElkan</em>结构是为支持 Elkan 算法而专门设计和构建的。每个数据训练过程都会初始化一个<em>IndexFlatElkan</em>实例。为了减轻 Elkan 算法中频繁的内存分配和取消分配对性能的影响，我们重构了代码逻辑，将 Elkan 算法函数之外的内存管理转移到<em>IndexFlatElkan</em> 的构建过程中。这使得内存分配只需在初始化阶段进行一次，同时还能为当前数据训练过程中所有后续的 Elkan 算法函数调用提供服务，并有助于将负载延迟提高约 3%。<a href="https://github.com/zilliztech/knowhere/pull/280">点击此处</a>查找<a href="https://github.com/zilliztech/knowhere/pull/280">Knowhere 补丁</a>。</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">通过软件预取加速 Redis 向量搜索<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>Redis 是一种流行的传统内存键值数据存储，最近开始支持向量搜索。为了超越典型的键值存储，它提供了可扩展模块；<a href="https://github.com/RediSearch/RediSearch">RediSearch</a>模块便于直接在 Redis 中存储和搜索向量。</p>
<p>对于向量相似性搜索，Redis 支持两种算法，即蛮力算法和 HNSW 算法。HNSW 算法专门用于在高维空间中高效定位近似近邻。它使用名为<em>candidate_set</em>的优先级队列来管理用于距离计算的所有候选向量。</p>
<p>除向量数据外，每个候选向量还包含大量元数据。因此，当从内存加载候选向量时，可能会导致数据缓存丢失，从而造成处理延迟。我们的优化引入了软件预取功能，在处理当前候选数据的同时主动加载下一个候选数据。这一改进使单例 Redis 设置中向量相似性搜索的吞吐量提高了 2% 到 3%。该补丁正在向上游发布。</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">更改 GCC 默认行为以防止混合汇编代码处罚<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>为了最大限度地提高性能，经常使用的代码段通常以汇编形式手写。但是，当不同的代码段由不同的人或在不同的时间点编写时，所使用的指令可能来自不兼容的汇编指令集，如<a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512)</a>和<a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a>。如果编译不当，混合代码会导致性能下降。<a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">了解有关混合使用英特尔 AVX 和 SSE 指令的更多信息，请点击此处</a>。</p>
<p>你可以很容易地判断自己是否在使用混合模式汇编代码，以及是否没有使用<em>VZEROUPPER</em> 编译代码，从而导致性能下降。可以通过 perf 命令来观察，如<em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;。</em>如果操作系统不支持该事件，请使用<em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>。</p>
<p>Clang 编译器默认插入<em>VZEROUPPER</em>，从而避免了任何混合模式惩罚。但 GCC 编译器只有在指定 -O2 或 -O3 编译器标志时才插入<em>VZEROUPPER</em>。我们联系了 GCC 团队并解释了这个问题，现在他们默认会正确处理混合模式汇编代码。</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">开始优化您的向量数据库<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库在 GenAI 中发挥着不可或缺的作用，而且为了生成更高质量的响应，向量数据库的规模也在不断扩大。在优化方面，人工智能应用程序与其他软件应用程序没有什么不同，只要使用标准性能分析工具以及基准框架和压力输入，它们就会暴露自己的秘密。</p>
<p>利用这些工具，我们发现了与不必要的内存分配、未能预取指令以及使用不正确的编译器选项有关的性能陷阱。基于我们的发现，我们对 Milvus、Knowhere、Redis 和 GCC 编译器进行了上游增强，以帮助人工智能提高性能和可持续性。向量数据库是一类重要的应用，值得您进行优化。希望这篇文章能对您的工作有所帮助。</p>
