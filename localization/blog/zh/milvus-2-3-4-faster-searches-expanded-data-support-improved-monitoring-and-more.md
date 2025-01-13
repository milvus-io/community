---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: Milvus 2.3.4：更快的搜索、更大的数据支持、更好的监控等
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: 介绍 Milvus 2.3.4 的新功能和改进
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们很高兴发布最新的 Milvus 2.3.4 版本。此次更新引入了一系列精心设计的功能和增强功能，以优化性能、提高效率并提供无缝的用户体验。在这篇博文中，我们将深入探讨 Milvus 2.3.4 的亮点。</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">改进监控的访问日志<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 现在支持访问日志，为了解与外部接口的交互提供了宝贵的信息。这些日志记录了方法名称、用户请求、响应时间、错误代码和其他交互信息，使开发人员和系统管理员能够进行性能分析、安全审计和高效的故障排除。</p>
<p><strong><em>注：</em></strong> <em>目前，访问日志仅支持 gRPC 交互。不过，我们将继续致力于改进，未来版本将扩展此功能，以包括 RESTful 请求日志。</em></p>
<p>有关详细信息，请参阅<a href="https://milvus.io/docs/configure_access_logs.md">配置访问日志</a>。</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">通过 Parquet 文件导入提高数据处理效率<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4 现在支持导入 Parquet 文件，这是一种广受欢迎的列式存储格式，旨在提高大规模数据集的存储和处理效率。这一新增功能提高了用户处理数据的灵活性和效率。通过省去费力的数据格式转换，管理 Parquet 格式大型数据集的用户将体验到简化的数据导入流程，大大缩短从初始数据准备到后续向量检索的时间。</p>
<p>此外，我们的数据格式转换工具 BulkWriter 现在已将 Parquet 作为其默认输出数据格式，确保为开发人员提供更直观的体验。</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">在不断增长的数据段上建立 Binlog 索引，加快搜索速度<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 现在可在不断增长的数据段上利用 binlog 索引，从而将不断增长的数据段中的搜索速度提高 10 倍。这一改进大大提高了搜索效率，并支持 IVF 或快速扫描等高级索引，从而改善了整体用户体验。</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">支持多达 10,000 个 Collections/分区<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>与关系数据库中的表和分区一样，Collections 和分区是 Milvus 中存储和管理向量数据的核心单元。为了满足用户对细微数据组织不断变化的需求，Milvus 2.3.4 现在支持一个集群中多达 10,000 个 Collections/分区，与之前的 4,096 个限制相比有了大幅提升。这一改进有利于知识库管理和多租户环境等各种使用案例。对 Collections/分区支持的扩大源于对时间刻度机制、"程序 "管理和内存使用的改进。</p>
<p><strong><em>注意：</em></strong> <em>建议将 Collections/partition 的数量限制为 10,000 个，因为超过这一限制可能会影响故障恢复和资源使用。</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">其他增强功能<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>除上述功能外，Milvus 2.3.4 还包括各种改进和错误修复。这些改进包括降低数据检索和变长数据处理过程中的内存使用率、改进错误消息传递、加快加载速度以及改进查询分片平衡。这些 Collections 增强功能有助于实现更流畅、更高效的整体用户体验。</p>
<p>如需全面了解 Milvus 2.3.4 中引入的所有更改，请参阅我们的<a href="https://milvus.io/docs/release_notes.md#v234">发行说明</a>。</p>
<h2 id="Stay-connected" class="common-anchor-header">保持联系！<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您有关于 Milvus 的问题或反馈，请加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>，直接与我们的工程师和社区交流，或参加每周二下午 12:12:30 的<a href="https://discord.com/invite/RjNbk8RR4f">Milvus 社区午餐学习会</a>。也欢迎您在<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>上关注我们，了解有关 Milvus 的最新消息和更新。</p>
