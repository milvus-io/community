---
id: deep-dive-8-knowhere.md
title: 是什么增强了 Milvus 向量数据库的相似性搜索功能？
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 不，不是费斯。
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/cydrain">蔡玉东</a>撰写，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>翻译。</p>
</blockquote>
<p>作为核心向量执行引擎，Knowhere之于Milvus，就如同发动机之于跑车。本文将介绍什么是 Knowhere，它与 Faiss 有何不同，以及 Knowhere 的代码结构。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Knowhere 的概念</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Milvus架构中的Knowhere</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere 与 Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">了解Knowhere代码</a></li>
<li><a href="#Adding-indexes-to-Knowhere">为Knowhere添加索引</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Knowhere的概念<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>狭义地说，Knowhere是一个操作界面，用于访问系统上层的服务和系统下层的向量相似性搜索库（如<a href="https://github.com/facebookresearch/faiss">Faiss</a>、<a href="https://github.com/nmslib/hnswlib">Hnswlib</a>、<a href="https://github.com/spotify/annoy">Annoy</a>）。此外，Knowhere 还负责异构计算。更具体地说，Knowhere控制在哪种硬件（如CPU或GPU）上执行索引构建和搜索请求。这就是 Knowhere 名字的由来--知道在哪里执行操作符。未来的版本将支持更多类型的硬件，包括DPU和TPU。</p>
<p>从广义上讲，Knowhere还集成了其他第三方索引库，如Faiss。因此，从整体上看，Knowhere 是公认的 Milvus 向量数据库的核心向量计算引擎。</p>
<p>从Knowhere的概念可以看出，它只处理数据计算任务，而分片、负载均衡、灾难恢复等任务则超出了Knowhere的工作范围。</p>
<p>从Milvus 2.0.1开始，<a href="https://github.com/milvus-io/knowhere">Knowhere</a>（广义上的）从Milvus项目中独立出来。</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Milvus 架构中的 Knowhere<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>Knowhere 架构</span> </span></p>
<p>Milvus 中的计算主要涉及向量和标量操作。Knowhere 只处理 Milvus 中对向量的操作符。上图展示了 Milvus 中的 Knowhere 架构。</p>
<p>最底层是系统硬件。第三方索引库位于硬件之上。然后，Knowhere通过CGO与顶层的索引节点和查询节点交互。</p>
<p>本文所讨论的Knowhere是广义上的Knowhere，即架构图中蓝色框内所标注的Knowhere。</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere 与 Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere不仅进一步扩展了Faiss的功能，还优化了性能。更具体地说，Knowhere 具有以下优势。</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1.支持比特视图</h3><p>最初，在 Milvus 中引入 bitset 是为了实现 &quot;软删除&quot;。软删除的向量仍然存在于数据库中，但在向量相似性搜索或查询时不会被计算。比特集中的每个比特都对应一个索引向量。如果某个向量在比特集中被标记为 "1"，则表示该向量已被软删除，在向量搜索过程中将不会涉及。</p>
<p>比特集参数被添加到 Knowhere 中所有公开的 Faiss 索引查询 API 中，包括 CPU 和 GPU 索引。</p>
<p>进一步了解<a href="https://milvus.io/blog/2022-2-14-bitset.md">bitset 如何实现向量搜索的多功能性</a>。</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2.支持更多二进制向量索引的相似度指标</h3><p>除<a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a> 外，Knowhere 还支持<a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>、<a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>、<a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superstructure</a> 和<a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Substructure</a>。Jaccard 和 Tanimoto 可用于测量两个样本集之间的相似性，而 Superstructure 和 Substructure 可用于测量化学结构的相似性。</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3.支持 AVX512 指令集</h3><p>Faiss 本身支持多种指令集，包括<a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>、<a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a> 和<a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>。Knowhere 通过添加<a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a> 进一步扩展了支持的指令集，与 AVX2 相比，<a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a> 可<a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">将索引构建和查询性能提高 20% 至 30%</a>。</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4.自动选择 SIMD 指令</h3><p>Knowhere 的设计目标是在具有不同 SIMD 指令（如 SIMD SSE、AVX、AVX2 和 AVX512）的各种 CPU 处理器（本地部署和云平台）上良好运行。因此，面临的挑战是，给定一个软件二进制文件（即 Milvus），如何让它在任何 CPU 处理器上自动调用合适的 SIMD 指令？Faiss 不支持自动选择 SIMD 指令，用户需要在编译时手动指定 SIMD 标志（如"-msse4"）。不过，Knowhere 是通过重构 Faiss 的代码库而构建的。依赖 SIMD 加速的常用函数（如相似性计算）被分解出来。然后为每个函数实现四个版本（即 SSE、AVX、AVX2、AVX512），并将每个版本放入单独的源文件中。然后，使用相应的 SIMD 标志对源文件进行单独编译。因此，在运行时，Knowhere 可以根据当前的 CPU 标志自动选择最合适的 SIMD 指令，然后使用挂钩功能链接正确的函数指针。</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5.其他性能优化</h3><p>阅读《<a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management System</a>》，了解有关 Knowhere 性能优化的更多信息。</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">了解 Knowhere 代码<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>如第一节所述，Knowhere 只处理向量搜索操作。因此，Knowhere只处理实体的向量场（目前只支持一个 Collections 中实体的一个向量场）。索引建立和向量相似性搜索也是针对段中的向量场。要想更好地了解数据模型，请阅读<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">此处的</a>博客。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>实体字段</span> </span></p>
<h3 id="Index" class="common-anchor-header">索引</h3><p>索引是一种独立于原始向量数据的数据结构。索引需要四个步骤：创建索引、训练数据、插入数据和建立索引。</p>
<p>对于某些人工智能应用来说，数据集训练是一个独立于向量搜索的过程。在这类应用中，首先要对数据集的数据进行训练，然后将数据插入到 Milvus 这样的向量数据库中进行相似性搜索。开放数据集（如 sift1M 和 sift1B）为训练和测试提供了数据。然而，在 Knowhere 中，训练数据和搜索数据是混合在一起的。也就是说，Knowhere 会训练一个数据段中的所有数据，然后插入所有训练过的数据并为它们建立索引。</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Knowhere 代码结构</h3><p>DataObj 是 Knowhere 中所有数据结构的基类。<code translate="no">Size()</code> 是 DataObj 中唯一的虚拟方法。Index 类继承自 DataObj，并带有一个名为 &quot;size_&quot;的字段。Index 类还有两个虚拟方法--<code translate="no">Serialize()</code> 和<code translate="no">Load()</code> 。从 Index 派生的 VecIndex 类是所有向量索引的虚拟基类。VecIndex 提供的方法包括<code translate="no">Train()</code>,<code translate="no">Query()</code>,<code translate="no">GetStatistics()</code> 和<code translate="no">ClearStatistics()</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>基类</span> </span></p>
<p>上图右侧列出了其他索引类型。</p>
<ul>
<li>Faiss 索引有两个子类：FaissBaseIndex 用于浮点向量上的所有索引，FaissBaseBinaryIndex 用于二进制向量上的所有索引。</li>
<li>GPUIndex 是所有 Faiss GPU 索引的基类。</li>
<li>OffsetBaseIndex 是所有自主开发索引的基类。索引文件中只存储向量 ID。因此，128 维向量的索引文件大小可以减少 2 个数量级。我们建议在使用这类索引进行向量相似性搜索时，也将原始向量考虑在内。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>从技术上讲，<a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a>不是索引，而是用于暴力搜索。当向量被插入到向量数据库时，不需要进行数据训练和建立索引。搜索将直接在插入的向量数据上进行。</p>
<p>不过，为了代码的一致性，IDMAP 也继承自 VecIndex 类及其所有虚拟接口。IDMAP 的用法与其他索引相同。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>反转</span> </span>文件</p>
<p>IVF（倒置文件）索引是最常用的索引。IVF 类派生自 VecIndex 和 FaissBaseIndex，并进一步扩展到 IVFSQ 和 IVFPQ。GPUIVF 衍生自 GPUIndex 和 IVF。然后 GPUIVF 进一步扩展到 GPUIVFSQ 和 GPUIVFPQ。</p>
<p>IVFSQHybrid 是一个自主开发的混合索引类，它在 GPU 上通过粗量化执行。而桶中的搜索则在 CPU 上执行。这种索引可以利用 GPU 的计算能力，减少 CPU 和 GPU 之间的内存拷贝。IVFSQHybrid 的召回率与 GPUIVFSQ 相同，但性能更好。</p>
<p>二进制索引的基类结构相对更简单。BinaryIDMAP 和 BinaryIVF 源自 FaissBaseBinaryIndex 和 VecIndex。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>第三方索引</span> </span></p>
<p>目前，除了 Faiss 之外，只支持两种第三方索引：基于树的索引 Annoy 和基于图的索引 HNSW。这两种常用的第三方索引都源自 VecIndex。</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">向Knowhere添加索引<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>如果想在Knowhere中添加新的索引，可以先参考现有的索引：</p>
<ul>
<li>要添加基于量化的索引，请参考 IVF_FLAT。</li>
<li>要添加基于图形的索引，请参考 HNSW。</li>
<li>要添加基于树的索引，请参考 Annoy。</li>
</ul>
<p>参考现有索引后，可以按照以下步骤向 Knowhere 添加新索引。</p>
<ol>
<li>在<code translate="no">IndexEnum</code> 中添加新索引的名称。数据类型为字符串。</li>
<li>在文件<code translate="no">ConfAdapter.cpp</code> 中为新索引添加数据验证检查。验证检查主要用于验证数据训练和查询的参数。</li>
<li>为新索引创建一个新文件。新索引的基类应包括<code translate="no">VecIndex</code> 和<code translate="no">VecIndex</code> 的必要虚拟接口。</li>
<li>在<code translate="no">VecIndexFactory::CreateVecIndex()</code> 中添加新索引的索引构建逻辑。</li>
<li>在<code translate="no">unittest</code> 目录下添加单元测试。</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">关于深入研究系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我们精心策划了这个 Milvus 深度挖掘系列博客，对 Milvus 架构和源代码进行深入解读。本系列博客涉及的主题包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架构概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">应用程序接口和 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">数据处理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">数据管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">实时查询</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">标量执行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">质量保证系统</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量执行引擎</a></li>
</ul>
