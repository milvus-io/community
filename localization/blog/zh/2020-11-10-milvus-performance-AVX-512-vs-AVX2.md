---
id: milvus-performance-AVX-512-vs-AVX2.md
title: 什么是高级向量扩展？
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: 使用各种不同的向量索引，了解 Milvus 在 AVX-512 与 AVX2 上的性能对比。
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Milvus在AVX-512与AVX2上的性能对比</custom-h1><p>在科幻小说中，有意识的智能机器总是想接管世界，但在现实中，现代计算机却非常听话。如果没有人告诉它们，它们很少知道自己该做什么。计算机根据程序发送给处理器的指令或命令执行任务。在最底层，每条指令都是一个 1 和 0 的序列，描述了计算机要执行的操作。 通常，在计算机汇编语言中，每条机器语言语句对应一条处理器指令。中央处理器（CPU）依靠指令来执行计算和控制系统。此外，CPU 性能通常以指令执行能力（如执行时间）来衡量。</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">什么是高级向量扩展？<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>高级向量扩展（AVX）是一种用于依赖 x86 系列指令集架构的微处理器的指令集。AVX 由英特尔于 2008 年 3 月首次提出，三年后随着 Sandy Bridge（英特尔第二代酷睿处理器（如酷睿 i7、i5、i3）中使用的微体系结构）和 AMD 的竞争微体系结构 Bulldozer（也于 2011 年发布）的推出而得到广泛支持。</p>
<p>AVX 引入了新的编码方案、新功能和新指令。AVX2 将大多数整数操作扩展到 256 位，并引入了融合乘法累加（FMA）操作。AVX-512 使用新的增强向量扩展（EVEX）前缀编码，将 AVX 扩展到 512 位操作符。</p>
<p><a href="https://milvus.io/docs">Milvus</a>是一个开源向量数据库，专为相似性搜索和人工智能（AI）应用而设计。该平台支持 AVX-512 指令集，这意味着它可用于所有包含 AVX-512 指令的 CPU。Milvus 应用广泛，涵盖推荐系统、计算机视觉、自然语言处理 (NLP) 等领域。本文介绍了在 AVX-512 和 AVX2 上运行 Milvus 向量数据库的性能结果和分析。</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Milvus 在 AVX-512 和 AVX2 上的性能对比<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">系统配置</h3><ul>
<li>CPU：英特尔® 铂金 8163 CPU @ 2.50GHz24 内核 48 线程</li>
<li>CPU 数量2</li>
<li>显卡： GeForce RTX 2080Ti 11GB 4显卡</li>
<li>内存： 768GB</li>
<li>磁盘：2 TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Milvus 参数</h3><ul>
<li>cahce.cahe_size：25，CPU 内存的大小，用于缓存数据以加快查询速度。</li>
<li>nlist：4096</li>
<li>nprobe：128</li>
</ul>
<p>注：<code translate="no">nlist</code> 是要从客户端创建的索引参数；<code translate="no">nprobe</code> 是搜索参数。IVF_FLAT 和 IVF_SQ8 都使用聚类算法将大量向量分割成桶，<code translate="no">nlist</code> 是聚类过程中要分割的桶的总数。查询的第一步是找出最接近目标向量的桶数，第二步是通过比较向量的距离找出这些桶中的 top-k 向量。<code translate="no">nprobe</code> 指的是第一步中的桶数。</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">数据集SIFT10M 数据集</h3><p>这些测试使用的是<a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">SIFT10M 数据集</a>，该数据<a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">集</a>包含 100 万个 128 维向量，通常用于分析相应近邻搜索方法的性能。我们将比较两个指令集在 nq = [1, 10, 100, 500, 1000] 条件下的 top-1 搜索时间。</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">按向量索引类型划分的结果</h3><p>向量<a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">索引</a>是利用各种数学模型在 Collections 的向量场上建立的省时省力的数据结构。当试图识别与输入向量相似的向量时，向量索引可以高效地搜索大型数据集。由于精确检索非常耗时，<a href="https://milvus.io/docs/v2.0.x/index.md#CPU">Milvus 支持</a>的大多数索引类型都使用近似近邻（ANN）搜索。</p>
<p>在这些测试中，AVX-512 和 AVX2 使用了三种索引：IVF_FLAT、IVF_SQ8 和 HNSW。</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>反转文件（IVF_FLAT）是一种基于量化的索引类型。它是最基本的 IVF 索引，每个单元中存储的编码数据与原始数据一致。 该索引将向量数据划分为若干簇单元（nlist），然后比较目标输入向量与每个簇中心之间的距离。根据系统设置查询的簇数（nprobe），相似性搜索结果仅根据目标输入与最相似簇中向量的比较结果返回--大大缩短了查询时间。通过调整 nprobe，可以在特定情况下找到准确性和速度之间的理想平衡点。</p>
<p><strong>性能结果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT 不进行任何压缩，因此其生成的索引文件大小与原始的非索引向量数据大致相同。当磁盘、CPU 或 GPU 内存资源有限时，IVF_SQ8 是比 IVF_FLAT 更好的选择。 这种索引类型可以通过执行标量量化，将原始向量的每个维度从四字节浮点数转换为一字节无符号整数。这可将磁盘、CPU 和 GPU 内存消耗减少 70-75%。</p>
<p><strong>性能结果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>分层小世界图（HNSW）是一种基于图的索引算法。查询从最上层开始，先找到与目标最接近的节点，然后再到下一层进行新一轮搜索。经过多次迭代后，它可以快速接近目标位置。</p>
<p><strong>性能结果</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">向量索引比较<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>在 AVX-512 指令集上，向量检索的速度始终快于 AVX2。这是因为 AVX-512 支持 512 位计算，而 AVX2 仅支持 256 位计算。从理论上讲，AVX-512 的速度应该是 AVX2 的两倍，但是，Milvus 除了进行向量相似性计算外，还执行其他耗时的任务。在实际应用中，AVX-512 的总体检索时间不可能是 AVX2 的两倍。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>在 HNSW 索引上，检索速度明显快于其他两种索引，而在两种指令集上，IVF_SQ8 检索速度略快于 IVF_FLAT。这可能是因为 IVF_SQ8 所需的内存仅为 IVF_FLAT 的 25%。IVF_SQ8 为每个向量维度加载 1 个字节，而 IVF_FLAT 为每个向量维度加载 4 个字节。计算所需时间很可能受到内存带宽的限制。因此，IVF_SQ8 不仅占用的空间更少，而且检索向量所需的时间也更短。</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus 是一个多功能、高性能的向量数据库<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>本文介绍的测试表明，在使用不同索引的 AVX-512 和 AVX2 指令集上，Milvus 都能提供出色的性能。无论索引类型如何，Milvus 在 AVX-512 上的性能都更好。</p>
<p>Milvus 与各种深度学习平台兼容，可用于各种人工智能应用。<a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0</a> 是世界上最流行的向量数据库的重构版本，于 2021 年 7 月在开源许可下发布。有关该项目的更多信息，请查看以下资源：</p>
<ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上查找或为 Milvus 投稿。</li>
<li>通过<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 与社区互动。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上与我们联系。</li>
</ul>
