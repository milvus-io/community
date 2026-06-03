---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: '如何在不到 1GB 内存的 milvus 中运行 2,500 万个图像向量'
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  一位社区用户如何在 Milvus 中使用 FLAT、FP16 和 mmap 在 &lt;1GB 内存上运行 25M 向量图像搜索，而不是 Sizing
  Tool 估计的 139GB。
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>Milvus 的一位用户最近向我们提出了一个非常实用的图像搜索问题。</p>
<p>"我们需要对编码为 1280 维向量的 2500 万张图像进行图像到图像的搜索。一台机器就能完成这项工作。它有 64GB 内存，最多有 32GB 内存可以用于向量数据库。但<a href="https://milvus.io/tools/sizing"><strong>Milvus 大小工具</strong></a>显示我们需要 139GB。我们是不是不行了？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>规模工具估算结果：25M × 1280 维向量，原始数据大小 119.2GB，加载内存 139.4GB</p>
<p>不完全是。</p>
<p>起初，显而易见的答案似乎是更高级的索引。如果数据集很大，内存又很紧张，那么一个更智能的 ANN 索引肯定会有所帮助。但在这种情况下，并没有用。Milvus 最简单的索引最终起了作用：<a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>。</p>
<p>结果比预期的要好：稳态内存保持在 1GB 以下，容器的常驻内存约为 600MB，热查询延迟保持在 100ms 以下。启动时的短暂峰值约为 12.5GB，系统预热时的首次查询耗时约 30 秒。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>重要的不是 FLAT 神奇般地降低了 2500 万次强制比较的成本。事实并非如此。重要的是，这种工作负载几乎从未搜索过全部 2500 万个向量。标量过滤器首先缩小了每个查询的范围，而 FLAT 只比较了候选集中小得多的向量。</p>
<p>这篇文章将介绍失败的原因、FLAT 成功的原因，以及什么时候值得在自己的工作负载中尝试相同的模式。</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">为什么 AISAQ 和 IVF_FLAT 在这里不起作用<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>在 FLAT 之前，用户尝试了两种对于受限机器来说看起来更自然的索引。</p>
<p><strong>第一次尝试：</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>。</strong>AISAQ 是一个面向磁盘的索引，旨在降低内存使用率。该工作负载的缺陷在于构建和加载路径。在早前一次使用 5500 万向量的测试中，一次 Collections 加载向磁盘写入了 249GB 的临时数据，耗时过长，不实用。</p>
<p><strong>第二次尝试IVF_FLAT。</strong>IVF_FLAT 看起来也很合理，因为它是一个标准的 ANN 索引。索引构建成功，但 Collections 负载在 14% 时停滞不前，再也没有恢复。</p>
<p>在这两个死胡同之后，用户尝试了一个无聊的选项：FLAT。它加载得很干净。对于这种特定的查询模式，它也提供了最佳的运行时间。</p>
<table>
<thead>
<tr><th><strong>索引</strong></th><th><strong>为什么看起来很有希望</strong></th><th><strong>在此工作负载中发生了什么</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>面向磁盘的索引，理论上内存使用率低</td><td>构建/加载路径会产生大量临时文件。在 55M 向量测试中，一个 Collections 负载写入了 249GB 的临时数据，而且速度很慢。</td></tr>
<tr><td>IVF_FLAT</td><td>标准 ANN 索引，搜索成本低于全扫描</td><td>索引建立，但 Collections 负载在 14% 时停滞，无法恢复。</td></tr>
<tr><td>FLAT</td><td>没有额外的 ANN 结构，也没有建立索引的复杂性</td><td>稳态内存保持在 1GB 以下。容器常驻内存约为 600MB。启动时峰值接近 12.5GB。首次查询耗时约 30 秒，随后的热查询时间保持在 100ms 以下。</td></tr>
</tbody>
</table>
<p>经验很简单：理论上高效的索引可能仍然不适合特定的机器、数据形状和查询模式。</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">FLAT 为何有效<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT 是 Milvus 支持的最简单的索引。没有图。没有树。没有聚类。它直接将查询向量与候选向量进行比较。</p>
<p>对于 2500 万向量来说，这听起来是个错误的工具。如果每个查询都搜索整个 Collections，它也是错误的工具。</p>
<p>但这个工作负载在向量搜索前面有一个强大的过滤器。每次查询都会首先使用标量字段（如<code translate="no">dataid</code> 和<code translate="no">classid</code> ）缩小搜索空间。然后，Milvus 才运行向量相似性搜索。这就把问题从 "搜索 2500 万个向量 "变成了 "过滤后搜索几百到几万个向量"。</p>
<p>有三件事使这一设置得以实现：FP16 向量存储、用于原始向量数据的 mmap 以及 FLAT 通路前的标量过滤。</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">优化 1：FP16 将向量数据减半<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>向量有 1280 个维度。存储为 FP32 时，每个向量需要 5120 字节：</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>在 2500 万个向量中，原始向量数据约为 119.2GB。FP16 将每个维度从 4 字节减少到 2 字节：</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>因此原始向量数据降至约 59.6GB。</p>
<p>这仍然无法完全满足可用 RAM 的需求，但却将 Milvus 和操作系统需要处理的向量数据量减少了一半。在许多图像检索工作负载中，FP16 对召回率的影响很小，但这并不是一条免费规则。在将其作为默认值之前，请使用自己的 Embeddings、度量标准和质量条测试召回率。</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">优化 2：mmap 让原始向量远离进程堆<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>即使在 FP16 之后，约 60GB 的向量对于内存预算来说仍然太多。这时，<a href="https://milvus.io/docs/mmap.md"><strong>mmap</strong></a>就派上用场了。</p>
<p>利用 mmap，Milvus 可以通过内存映射文件访问向量数据，而不是将整个原始向量字段加载到进程内存中。操作系统会在查询触及数据时将其分页，并可将热页保留在其页面缓存中。</p>
<p>在该用户的 Milvus 2.6.14 环境中，集群级 mmap 配置已经涵盖了原始向量数据，因此用户无需手动设置 mmap。</p>
<p>在调试过程中，有一个细节引起了困惑：Attu 显示的是 Schema 级 mmap 设置，而不是集群级默认设置。因此，即使集群级配置有效启用了数据路径的 mmap，<a href="https://zilliz.com/attu"><strong>Attu</strong></a>也可能将 mmap 显示为禁用。</p>
<p>mmap 可以节省内存，但会更多地使用磁盘和操作系统页面缓存。你仍然需要 SSD 容量来存储向量文件，而且在从磁盘读取相关页面时，第一次查询可能会比较慢。</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">优化 3：标量过滤才是真正的性能倍增器<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 和 mmap 解释了内存数量。标量过滤解释了延迟数。</p>
<p>该工作负载中的每个查询都包含这样一个过滤表达式：</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>该过滤器在向量比较步骤之前运行。FLAT 不是与 2500 万向量进行比较，而是与经过过滤的候选集进行比较，候选集的向量数量从几百个到几万个不等。</p>
<p>这就是热查询时间保持在 100ms 以下的原因。在现代 CPU 上，数以万计的向量比较是切实可行的。而每次查询进行两千五百万次比较则完全不同。</p>
<p>这也解释了为什么 IVF_FLAT 和 HNSW 在这里不起作用。一旦标量过滤将候选集缩小到足够大的程度，额外的 ANN 结构就会成为累赘。它增加了内存、构建时间和加载复杂度，但可能不会大大改善延迟。</p>
<p>有一点需要注意。这个工作负载中的过滤器很简单。如果您的过滤器使用大型<code translate="no">IN</code> 列表、<code translate="no">LIKE</code> 模式、范围谓词或嵌套 JSON 条件，请在相关字段上添加标量索引，并直接测量过滤器阶段。</p>
<table>
<thead>
<tr><th>优化</th><th>作用</th><th>为什么在这里很重要</th><th>权衡</th></tr>
</thead>
<tbody>
<tr><td>FP16 向量存储</td><td>以 2 字节而非 4 字节存储每个向量维度</td><td>将原始向量数据从约 119.2GB 减少到约 59.6GB</td><td>调用影响取决于您的 Embeddings 和度量。测试一下</td></tr>
<tr><td>在原始向量上使用 mmap</td><td>从磁盘映射向量文件，而不是将完整的原始向量字段加载到进程内存中</td><td>将进程内存保持在较低水平，同时让操作系统根据需要进行数据翻页</td><td>需要固态硬盘容量，可能会使冷查询变慢。</td></tr>
<tr><td>先进行标量过滤</td><td>先通过标量字段进行过滤，然后再进行向量比较</td><td>将每次查询的候选数据从 25M 减少到数百或数万</td><td>复杂的过滤器可能需要标量索引。</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">此模式的适用范围<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>图像搜索案例之所以有效，是因为实际搜索空间远小于 Collections 总数。这种情况同样出现在许多生产工作负载中。</p>
<ol>
<li><strong>多租户 RAG：</strong>首先按<code translate="no">tenant_id</code> 、<code translate="no">workspace_id</code> 或<code translate="no">project_id</code> 过滤。每个租户可能只有几千或几万个数据块。</li>
<li><strong>电子商务产品搜索：</strong>在进行向量搜索前，按类别、品牌、卖家、地区或可用性进行筛选。</li>
<li><strong>日志和文档检索：</strong>在进行语义搜索前，根据时间范围、来源、服务或文档类型进行筛选。</li>
<li><strong>带标签的图像或媒体搜索：</strong>在比较 Embeddings 之前，先按数据集、类别、客户或资产组进行筛选。</li>
</ol>
<p>这些都是 FLAT + FP16 + mmap 的良好候选方案，因为完整的 Collections 可能很大，而每个查询仍然只涉及一小部分子集。</p>
<p>当每个查询都搜索整个 Collections 时，该模式就不适用了。如果每个查询真的需要扫描全部 2500 万个向量，那么 FLAT 将不会给你带来相同的延迟。在这种情况下，应使用 ANN 索引（如 HNSW、IVF 或面向磁盘的索引），并对内存、磁盘和构建时间进行权衡规划。</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">如何读取规模工具估算<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 大小工具是一个起点，而不是对硬件的最终裁决。</p>
<p>在本例中，139.4GB 的加载内存估计值是 2500 万个 1280 维 FP32 向量的保守基准。实际工作量改变了多项假设：</p>
<ol>
<li>FP16 将原始向量大小减少了大约一半。</li>
<li>mmap 避免了将整个原始向量场加载到进程内存中。</li>
<li>FLAT 避免了额外的 ANN 索引结构。</li>
<li>标量过滤器使每次查询搜索的候选集更小。</li>
</ol>
<p>这就是为什么实际工作负载测试非常重要。在仅根据尺寸估算拒绝硬件设置之前，请使用实际的向量精度、索引类型、mmap 配置、标量过滤器、冷查询行为和热查询行为进行测试。</p>
<h2 id="Get-Started" class="common-anchor-header">开始<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>如果想尝试相同的方法，请从查询模式而不是索引名称开始。</p>
<ol>
<li>检查每个查询是否都有选择性标量过滤器。</li>
<li>估计过滤后还剩下多少向量。</li>
<li>如果召回测试结果良好，则将向量存储为 FP16。</li>
<li>当过滤后的候选集足够小，可以进行粗暴比较时，使用 FLAT。</li>
<li>验证原始向量数据的 mmap 行为。检查 Schema 级设置和集群级配置。</li>
<li>测量启动内存、首次查询延迟、热查询延迟和磁盘 I/O。</li>
<li>如果过滤器评估成为瓶颈，则添加标量索引。</li>
</ol>
<p>对于本地测试，请从<a href="https://milvus.io/docs/quickstart.md"><strong>Milvus quickstart</strong></a>或 Milvus<a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a>代码库开始。使用 Attu 检查 Collections，但请记住，Attu 可能不会显示群集级 mmap 默认值。</p>
<p>如果不想自己运行基础架构，<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>是受管理的 Milvus 服务。你可以获得相同的 Milvus 核心，并可管理操作、扩展和用于测试的免费层。使用工作邮箱<a href="https://cloud.zilliz.com/signup"><strong>注册</strong></a>可获得 100 美元的免费点数，如果已有账户，也可以<a href="https://cloud.zilliz.com/login"><strong>登录</strong></a>。</p>
