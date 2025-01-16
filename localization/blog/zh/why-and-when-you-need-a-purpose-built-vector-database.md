---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: 为什么以及何时需要专用向量数据库？
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: 本文章概述了向量搜索及其功能，比较了不同的向量搜索技术，并解释了为什么选择专门建立的向量数据库至关重要。
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>本文最初发表于<a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a>，经授权在此转发。</em></p>
<p><a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>和其他大型语言模型 (LLM) 的日益普及推动了向量搜索技术的兴起，其中包括<a href="https://milvus.io/docs/overview.md">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 等专用向量数据库、<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> 等向量搜索库以及与传统数据库集成的向量搜索插件。然而，选择满足您需求的最佳解决方案可能具有挑战性。就像在高端餐厅和快餐连锁店之间做出选择一样，选择合适的矢量搜索技术取决于您的需求和期望。</p>
<p>在本篇文章中，我将概述矢量搜索及其功能，比较不同的矢量搜索技术，并解释为什么选择专用的矢量数据库至关重要。</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">什么是向量搜索，它是如何工作的？<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>向量<a href="https://zilliz.com/blog/vector-similarity-search">搜索</a>又称向量相似性搜索，是一种在大量密集向量数据 Collections 中检索与给定查询向量最相似或语义最相关的 top-k 结果的技术。</p>
<p>在进行相似性搜索之前，我们先利用神经网络将文本、图像、视频和音频等<a href="https://zilliz.com/blog/introduction-to-unstructured-data">非结构化数据</a>转化为称为 Embeddings 向量的高维数值向量。例如，我们可以使用预先训练好的 ResNet-50 卷积神经网络，将鸟类图像转化为 2048 维的嵌入向量 Collections。在此，我们列出前三个和后三个向量元素：<code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Patrice Bouchard 拍摄的鸟类图像</span> </span></p>
<p>生成嵌入向量后，向量搜索引擎会比较输入查询向量和向量存储中的向量之间的空间距离。它们在空间上的距离越近，相似度就越高。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>嵌入运算</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">流行的向量搜索技术<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>市场上有多种向量搜索技术，包括 Python 的 NumPy 等机器学习库、FAISS 等向量搜索库、基于传统数据库构建的向量搜索插件，以及 Milvus 和 Zilliz Cloud 等专业向量数据库。</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">机器学习库</h3><p>使用机器学习库是实现向量搜索的最简单方法。例如，我们可以使用 Python 的 NumPy 在 20 行代码以内实现近邻算法。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>我们可以生成 100 个二维向量，并找到向量 [0.5, 0.5] 的最近邻。</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>机器学习库（如 Python 的 NumPy）以低成本提供了极大的灵活性。不过，它们也有一些局限性。例如，它们只能处理少量数据，而且不能确保数据的持久性。</p>
<p>我只建议在以下情况下使用 NumPy 或其他机器学习库进行向量搜索：</p>
<ul>
<li>需要快速建立原型。</li>
<li>不关心数据持久性。</li>
<li>数据量小于一百万，不需要标量过滤。</li>
<li>不需要高性能。</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">向量搜索库</h3><p>向量搜索库可以帮助您快速构建高性能的向量搜索原型系统。FAISS 就是一个典型的例子。它是开源的，由 Meta 公司开发，用于高效的相似性搜索和密集向量聚类。FAISS 可以处理任何大小的向量 Collections，甚至可以处理那些无法完全加载到内存中的向量 Collections。此外，FAISS 还提供了评估和参数调整工具。尽管 FAISS 是用 C++ 编写的，但它提供了 Python/NumPy 接口。</p>
<p>下面是基于 FAISS 的向量搜索示例代码：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>FAISS 等矢量搜索库易于使用，速度快，足以处理拥有数百万矢量的小规模生产环境。您可以利用量化和 GPU 以及减少数据维度来提高它们的查询性能。</p>
<p>不过，这些库在生产环境中使用时有一些限制。例如，FAISS 不支持实时数据添加和删除、远程调用、多语言、标量过滤、可扩展性或灾难恢复。</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">不同类型的向量数据库</h3><p>向量数据库的出现解决了上述库的局限性，为生产应用提供了更全面、更实用的解决方案。</p>
<p>目前战场上有四种类型的向量数据库：</p>
<ul>
<li>集成了向量搜索插件的现有关系型或列型数据库。PG Vector 就是一个例子。</li>
<li>支持密集向量索引的传统倒排索引搜索引擎。<a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a>就是一个例子。</li>
<li>基于向量搜索库构建的轻量级向量数据库。Chroma 就是一个例子。</li>
<li><strong>专用向量数据库</strong>。这类数据库专门为向量搜索而设计，并自下而上地进行了优化。专用向量数据库通常提供更先进的功能，包括分布式计算、灾难恢复和数据持久性。<a href="https://zilliz.com/what-is-milvus">Milvus</a>就是一个主要的例子。</li>
</ul>
<p>并非所有的向量数据库都是一样的。每个堆栈都有独特的优势和局限性，因此或多或少适合不同的应用。</p>
<p>与其他解决方案相比，我更喜欢专用向量数据库，因为它们是最高效、最方便的选择，具有众多独特优势。在下面的章节中，我将以 Milvus 为例，解释我偏爱的原因。</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">专用向量数据库的主要优势<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>是一个开源、分布式的专用向量数据库，可以存储、索引、管理和检索数十亿个嵌入向量。它也是用于<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM 检索增强生成的</a>最受欢迎的向量数据库之一。作为专门构建的向量数据库的典范实例，Milvus 与其同行共享许多独特的优势。</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">数据持久性和低成本存储</h3><p>虽然防止数据丢失是对数据库的最低要求，但许多单机和轻量级向量数据库并不把数据可靠性放在首位。相比之下，<a href="https://zilliz.com/what-is-milvus">Milvus</a>等专门构建的分布式向量数据库通过分离存储和计算，优先考虑了系统弹性、可扩展性和数据持久性。</p>
<p>此外，大多数利用近似近邻（ANN）索引的向量数据库都需要大量内存来执行向量搜索，因为它们将 ANN 索引纯粹加载到内存中。然而，Milvus 支持磁盘索引，使存储的成本效益比内存索引高十倍以上。</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">最佳查询性能</h3><p>与其他向量搜索方案相比，专门的向量数据库可提供最佳的查询性能。例如，Milvus 处理查询的速度比向量搜索插件快十倍。Milvus 使用<a href="https://zilliz.com/glossary/anns">ANN 算法</a>而不是 KNN 野蛮搜索算法，以实现更快的向量搜索。此外，Milvus 还对索引进行碎片化处理，从而在数据量增加时减少构建索引所需的时间。这种方法使 Milvus 能够轻松处理数十亿向量的实时数据增删。相比之下，其他向量搜索插件只适用于数据量少于数千万、添加和删除不频繁的场景。</p>
<p>Milvus 还支持 GPU 加速。内部测试显示，在搜索数千万数据时，GPU 加速的向量索引可达到 10,000+ QPS，在单机查询性能上比传统的 CPU 索引至少快十倍。</p>
<h3 id="System-Reliability" class="common-anchor-header">系统可靠性</h3><p>许多应用使用向量数据库进行在线查询，要求低查询延迟和高吞吐量。这些应用要求在分钟级进行单机故障切换，有些甚至要求在关键场景下进行跨区域灾难恢复。基于 Raft/Paxos 的传统复制策略存在严重的资源浪费问题，并且需要帮助预先分片数据，导致可靠性较差。相比之下，Milvus 采用分布式架构，利用 K8s 消息队列实现高可用性，缩短了恢复时间，节省了资源。</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">操作符和可观察性</h3><p>为了更好地服务企业用户，向量数据库必须提供一系列企业级功能，以获得更好的操作符和可观察性。Milvus 支持多种部署方法，包括 K8s Operator 和 Helm 图表、docker-compose 和 pip install，使不同需求的用户都能使用。Milvus 还提供了基于 Grafana、Prometheus 和 Loki 的监控和报警系统，提高了其可观察性。Milvus 采用分布式云原生架构，是业界首个支持多租户隔离、RBAC、配额限制和滚动升级的向量数据库。所有这些方法都使 Milvus 的管理和监控变得更加简单。</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">在 10 分钟内通过 3 个简单步骤开始使用 Milvus<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>建立向量数据库是一项复杂的任务，但使用向量数据库就像使用 Numpy 和 FAISS 一样简单。即使是不熟悉人工智能的学生，也能在短短十分钟内基于 Milvus 实现向量搜索。要体验高度可扩展和高性能的向量搜索服务，请遵循以下三个步骤：</p>
<ul>
<li>借助 Milvus<a href="https://milvus.io/docs/install_standalone-docker.md">部署文档</a>在服务器上部署 Milvus。</li>
<li>参考<a href="https://milvus.io/docs/example_code.md">Hello Milvus 文档</a>，仅用 50 行代码实现向量搜索。</li>
<li>探索<a href="https://github.com/towhee-io/examples/">Towhee 的示例文档</a>，深入了解<a href="https://zilliz.com/use-cases">向量数据库的</a>流行<a href="https://zilliz.com/use-cases">用例</a>。</li>
</ul>
