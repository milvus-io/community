---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: 比较向量数据库、向量搜索库和向量搜索插件
author: Frank Liu
date: 2023-11-9
desc: 在本篇文章中，我们将继续探索向量搜索的复杂领域，比较向量数据库、向量搜索插件和向量搜索库。
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>大家好--欢迎回到向量数据库 101！</p>
<p><a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>和其他大型语言模型（LLMs）的迅猛发展推动了向量搜索技术的发展，其中包括<a href="https://zilliz.com/what-is-milvus">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a>等专业向量数据库，以及<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>等库和传统数据库中的集成向量搜索插件。</p>
<p>在<a href="https://zilliz.com/learn/what-is-vector-database">上一篇系列文章</a>中，我们深入探讨了向量数据库的基本原理。在这篇文章中，我们将继续探索矢量搜索的复杂领域，比较矢量数据库、矢量搜索插件和矢量搜索库。</p>
<h2 id="What-is-vector-search" class="common-anchor-header">什么是向量搜索？<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>向量<a href="https://zilliz.com/learn/vector-similarity-search">搜索</a>又称向量相似性搜索，是一种在大量密集向量数据 Collections 中检索与给定查询向量最相似或语义最相关的 top-k 结果的技术。在进行相似性搜索之前，我们利用神经网络将文本、图像、视频和音频等<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>转化为高维数字向量，称为嵌入向量。生成嵌入向量后，向量搜索引擎会比较输入查询向量与向量存储中的向量之间的空间距离。它们在空间上的距离越近，相似度就越高。</p>
<p>市场上有多种向量搜索技术，包括 Python 的 NumPy 等机器学习库、FAISS 等向量搜索库、建立在传统数据库上的向量搜索插件，以及 Milvus 和 Zilliz Cloud 等专业向量数据库。</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">向量数据库与向量搜索库的比较<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">专业矢量数据库</a>并不是相似性搜索的唯一堆栈。在向量数据库出现之前，FAISS、ScaNN 和 HNSW 等许多向量搜索库都用于向量检索。</p>
<p>向量搜索库可以帮助你快速构建高性能的向量搜索原型系统。以 FAISS 为例，它是开源的，由 Meta 公司开发，用于高效的相似性搜索和密集向量聚类。FAISS 可以处理任何大小的向量 Collections，甚至可以处理那些无法完全加载到内存中的向量 Collections。此外，FAISS 还提供了评估和参数调整工具。尽管 FAISS 是用 C++ 编写的，但它提供了 Python/NumPy 接口。</p>
<p>不过，向量搜索库只是轻量级 ANN 库，而不是托管解决方案，而且功能有限。如果您的数据集较小且有限，这些库足以满足非结构化数据处理的需要，甚至对于在生产中运行的系统也是如此。但是，随着数据集规模的扩大和更多用户的加入，规模问题变得越来越难以解决。此外，它们不允许对索引数据进行任何修改，也不能在数据导入时进行查询。</p>
<p>相比之下，向量数据库是非结构化数据存储和检索的更优解决方案。它们可以存储和查询数百万甚至数十亿个向量，同时提供实时响应；它们具有很强的可扩展性，可以满足用户不断增长的业务需求。</p>
<p>此外，Milvus 等向量数据库对于结构化/半结构化数据具有更多用户友好的功能：云计算性、多租户、可扩展性等。当我们深入学习本教程时，这些功能将变得更加清晰。</p>
<p>它们的操作抽象层也与向量搜索库完全不同--向量数据库是完全成熟的服务，而 ANN 库则是要集成到您正在开发的应用程序中。从这个意义上说，ANN 库是向量数据库构建在其之上的众多组件之一，这与 Elasticsearch 构建在 Apache Lucene 之上的情况类似。</p>
<p>为了举例说明为什么这种抽象如此重要，让我们来看看在向量数据库中插入一个新的非结构化数据元素。这在 Milvus 中超级简单：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>只需 3 行代码。遗憾的是，对于 FAISS 或 ScaNN 这样的库，如果不在某些检查点手动重新创建整个索引，就无法轻松实现这一功能。即使可以，向量搜索库仍然缺乏可扩展性和多租户性，而这是向量数据库最重要的两个功能。</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">向量数据库与传统数据库的向量搜索插件对比<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>很好，既然我们已经确定了向量搜索库和向量数据库之间的区别，那么让我们来看看向量数据库与<strong>向量搜索插件</strong>有何不同。</p>
<p>越来越多的传统关系型数据库，以及 Clickhouse 和<a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a>等搜索系统都包含了内置的向量搜索插件。例如，Elasticsearch 8.0 包括向量插入和 ANN 搜索功能，可以通过 restful API 端点调用。矢量搜索插件的问题应该是一目了然的--<strong>这些解决方案并没有采用全栈方法来进行嵌入管理和矢量搜索</strong>。相反，这些插件的目的是在现有架构的基础上进行增强，从而使其具有局限性和未优化性。在传统数据库上开发非结构化数据应用程序，就好比试图在汽油动力汽车的框架内安装锂电池和电动马达，这不是一个好主意！</p>
<p>为了说明原因，让我们回到向量数据库应实现的功能列表（从第一部分开始）。向量搜索插件缺少其中的两个功能--可调性和用户友好的 API/SDK。我将继续以 Elasticsearch 的 ANN 引擎为例；其他向量搜索插件的操作非常类似，因此我就不再过多赘述了。Elasticsearch 通过<code translate="no">dense_vector</code> 数据字段类型支持向量存储，并允许通过<code translate="no">knnsearch endpoint</code> 进行查询：</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Elasticsearch 的 ANN 插件只支持一种索引算法：分层导航小世界（Hierarchical Navigable Small Worlds），又称 HNSW（我想，在普及多元宇宙方面，创造者走在了漫威的前面）。除此之外，它只支持 L2/Euclidean 距离作为距离度量。这是一个不错的开端，但让我们把它与完整的向量数据库 Milvus 进行比较。使用<code translate="no">pymilvus</code> ：</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>虽然<a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 和 Milvus</a>都有创建索引、插入嵌入向量和执行近邻搜索的方法，但从这些示例中可以明显看出，Milvus 拥有更直观的向量搜索 API（更好的面向用户的 API）和更广泛的向量索引 + 距离度量支持（更好的可调性）。Milvus 还计划在未来支持更多向量索引，并允许通过类似 SQL 的语句进行查询，从而进一步提高可调性和可用性。</p>
<p>我们刚刚介绍了很多内容。这部分内容确实比较长，所以对于那些略读过这部分内容的人来说，我在这里简要地说一下：Milvus 比向量搜索插件更好，因为 Milvus 从一开始就是作为向量数据库构建的，因此具有更丰富的功能和更适合非结构化数据的架构。</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">如何从不同的向量搜索技术中进行选择？<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>并不是所有的向量数据库都是一样的；每种数据库都具有迎合特定应用的独特特征。矢量搜索库和插件对用户友好，非常适合处理拥有数百万矢量的小规模生产环境。如果您的数据规模较小，只需要基本的向量搜索功能，这些技术就足以满足您的业务需求。</p>
<p>但是，对于处理数亿矢量数据并要求实时响应的数据密集型企业来说，专业的矢量数据库应该是您的首选。例如，Milvus 可以毫不费力地管理数十亿个向量，提供快如闪电的查询速度和丰富的功能。此外，像 Zilliz 这样的全面管理解决方案证明更具优势，它能将您从操作挑战中解放出来，专注于您的核心业务活动。</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">再看看向量数据库 101 课程<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">非结构化数据简介</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">什么是向量数据库？</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">比较向量数据库、向量搜索库和向量搜索插件</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Milvus 简介</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Milvus 快速入门</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">向量相似性搜索简介</a></li>
<li><a href="https://zilliz.com/blog/vector-index">向量索引基础和反转文件索引</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">标量量化和乘积量化</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">分层可导航小世界（HNSW）</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">近似最近邻（ANNOY）</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">为项目选择合适的向量索引</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN 和 Vamana 算法</a></li>
</ol>
