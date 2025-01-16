---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: Milvus 推出 MMap，重新定义数据管理并提高存储能力
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: Milvus MMap 功能使用户能够在有限的内存中处理更多数据，在性能、成本和系统限制之间取得微妙的平衡。
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>是开源<a href="https://zilliz.com/blog/what-is-a-real-vector-database">向量数据库</a>中速度最快的解决方案，可满足用户对密集型性能的需求。然而，用户需求的多样性反映了他们所处理的数据的多样性。有些用户优先考虑预算友好型解决方案和大容量存储，而不是纯粹的速度。Milvus 了解这些需求，推出了 MMap 功能，重新定义了我们处理大数据量的方式，同时承诺在不牺牲功能的情况下实现成本效益。</p>
<h2 id="What-is-MMap" class="common-anchor-header">什么是 MMap？<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap 是内存映射文件的简称，它在操作系统中的文件和内存之间架起了一座桥梁。这项技术允许 Milvus 将大型文件直接映射到系统内存空间，将文件转化为连续的内存块。这种整合消除了显式读取或写入操作的需要，从根本上改变了 Milvus Operator 管理数据的方式。它确保了大文件或用户需要随机访问文件的情况下的无缝访问和高效存储。</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">谁能从 MMap 中受益？<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>由于向量数据的存储要求，向量数据库需要大量内存容量。有了 MMap 功能，在有限的内存中处理更多数据就成为现实。但是，这种能力的提高需要付出性能代价。系统会智能地管理内存，根据负载和使用情况驱逐部分数据。这种驱逐允许 Milvus 在相同内存容量下处理更多数据。</p>
<p>在测试过程中，我们发现在内存充足的情况下，所有数据在预热期后都会驻留在内存中，从而保持了系统性能。但是，随着数据量的增加，性能会逐渐下降。<strong>因此，我们建议对性能波动不太敏感的用户使用 MMap 功能。</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">在 Milvus 中启用 MMap：简单配置<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中启用 MMap 非常简单。您只需修改<code translate="no">milvus.yaml</code> 文件：在<code translate="no">queryNode</code> 配置下添加<code translate="no">mmapDirPath</code> 项，并将有效路径设为其值。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">取得平衡：性能、存储和系统限制<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>数据访问模式对性能有很大影响。Milvus 的 MMap 功能可根据位置优化数据访问。MMap 使 Milvus 能够将顺序访问数据段的标量数据直接写入磁盘。字符串等长度可变的数据会被扁平化，并使用内存中的偏移数组进行索引。这种方法确保了数据访问的本地性，并消除了单独存储每个变长数据的开销。对向量索引的优化非常细致。MMap 有选择地用于向量数据，同时在内存中保留邻接表，在不影响性能的情况下节省了大量内存。</p>
<p>此外，MMap 还能最大限度地减少内存使用量，从而提高数据处理效率。与以前的 Milvus 版本不同的是，QueryNode 会复制整个数据集，而 MMap 在开发过程中采用了简化的无复制流式处理。这种优化大大减少了内存开销。</p>
<p><strong>我们的内部测试结果表明，启用 MMap 后，Milvus 可以高效处理双倍的数据量。</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">未来之路：持续创新和以用户为中心的增强功能<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>虽然 MMap 功能还处于测试阶段，但 Milvus 团队致力于不断改进。未来的更新将完善系统的内存使用情况，使 Milvus 能够在单个节点上支持更大的数据量。用户可以预期对 MMap 功能进行更细粒度的控制，实现对 Collections 的动态更改和高级字段加载模式。这些增强功能提供了前所未有的灵活性，使用户能够根据具体要求定制数据处理策略。</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">结论：用 Milvus MMap 重新定义卓越的数据处理能力<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 的 MMap 功能标志着数据处理技术的重大飞跃。通过在性能、成本和系统限制之间取得微妙的平衡，Milvus 使用户能够高效、经济地处理海量数据。随着 Milvus 的不断发展，它将继续走在创新解决方案的前沿，重新定义数据管理的极限。</p>
<p>Milvus 将继续向无与伦比的卓越数据处理迈进，敬请期待更多突破性发展。</p>
