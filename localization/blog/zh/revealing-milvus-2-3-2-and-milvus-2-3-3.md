---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: 揭秘 Milvus 2.3.2 和 2.3.3：支持数组数据类型、复杂删除、TiKV 集成等功能
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  今天，我们非常高兴地宣布 Milvus 2.3.2 和 2.3.3
  正式发布！这些更新带来了许多令人兴奋的功能、优化和改进，提高了系统性能、灵活性和整体用户体验。
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在不断发展的向量搜索技术领域，Milvus 始终站在最前沿，不断突破界限，设立新的标准。今天，我们非常高兴地宣布 Milvus 2.3.2 和 2.3.3 正式发布！这些更新带来了许多令人兴奋的功能、优化和改进，提高了系统性能、灵活性和整体用户体验。</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">支持数组数据类型--使搜索结果更准确、更相关<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>添加对数组数据类型的支持是 Milvus 的一项关键改进，尤其是在查询过滤场景（如交集和联合）中。这一新增功能可确保搜索结果不仅更加准确，而且更加相关。在实际应用中，例如在电子商务领域，存储为字符串数组的产品标签允许消费者执行高级搜索，过滤掉不相关的结果。</p>
<p>进入我们的综合<a href="https://milvus.io/docs/array_data_type.md">文档</a>，深入了解如何在 Milvus 中使用数组类型。</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">支持复杂的删除表达式--改善您的数据管理<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>在以前的版本中，Milvus 支持主键删除表达式，提供了稳定和精简的架构。使用 Milvus 2.3.2 或 2.3.3，用户可以采用复杂的删除表达式，促进复杂的数据管理任务，如基于用户 ID 的旧数据滚动清理或 GDPR 合规驱动的数据删除。</p>
<p>注意：在使用复杂表达式之前，请确保已加载了 Collections。此外，需要注意的是，删除过程不保证原子性。</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">TiKV 集成--具有稳定性的可扩展元数据存储<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 以前依赖 Etcd 进行元数据存储，在元数据存储方面面临容量有限和可扩展性的挑战。为解决这些问题，Milvus 增加了开源键值存储 TiKV，作为元数据存储的又一选择。TiKV 具有更强的可扩展性、稳定性和效率，是满足 Milvus 不断发展的需求的理想解决方案。从 Milvus 2.3.2 开始，用户可以通过修改配置无缝过渡到 TiKV 作为元数据存储。</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">支持 FP16 向量类型--拥抱机器学习效率<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2 及更高版本现在在接口级支持 FP16 向量类型。FP16 或 16 位浮点是一种广泛应用于深度学习和机器学习的数据格式，可高效地表示和计算数值。虽然对 FP16 的全面支持正在进行中，但索引层中的各种索引需要在构建过程中将 FP16 转换为 FP32。</p>
<p>我们将在 Milvus 的后续版本中全面支持 FP16、BF16 和 int8 数据类型。敬请期待。</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">显著改善滚动升级体验--为用户提供无缝过渡<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>滚动升级是分布式系统的一项重要功能，可在不中断业务服务或停机的情况下实现系统升级。在最新发布的 Milvus 版本中，我们加强了 Milvus 的滚动升级功能，确保用户从 2.2.15 版升级到 2.3.3 版及所有后续版本时，过渡更加简洁高效。社区还投入大量精力进行测试和优化，将升级过程中的查询影响降至 5 分钟以内，为用户提供无忧体验。</p>
<h2 id="Performance-optimization" class="common-anchor-header">性能优化<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>除了引入新功能，我们还在最新的两个版本中大幅优化了 Milvus 的性能。</p>
<ul>
<li><p>最小化数据复制操作，优化数据加载</p></li>
<li><p>使用批量 varchar 读取简化了大容量插入操作</p></li>
<li><p>删除了数据填充过程中不必要的偏移检查，以提高调用阶段的性能。</p></li>
<li><p>解决了在插入大量数据的情况下 CPU 消耗过高的问题</p></li>
</ul>
<p>这些优化 Collections 共同为更快、更高效的 Milvus 体验做出了贡献。查看我们的监控仪表板，快速了解 Milvus 是如何提高性能的。</p>
<h2 id="Incompatible-changes" class="common-anchor-header">不兼容的更改<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>永久删除 TimeTravel 相关代码。</p></li>
<li><p>不再支持 MySQL 作为元数据存储。</p></li>
</ul>
<p>有关所有新功能和增强功能的详细信息，请参阅<a href="https://milvus.io/docs/release_notes.md">Milvus 发行说明</a>。</p>
<h2 id="Conclusion" class="common-anchor-header">总结<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>通过最新的 Milvus 2.3.2 和 2.3.3 版本，我们致力于提供一个强大、功能丰富、高性能的数据库解决方案。探索这些新功能，利用优化功能，加入我们的旅程，让 Milvus 不断发展，以满足现代数据管理的需求。立即下载最新版本，体验 Milvus 数据存储的未来！</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">让我们保持联系！<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
