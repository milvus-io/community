---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: Milvus 2.2.9：备受期待的最佳用户体验版本
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们非常高兴地宣布 Milvus 2.2.9 版本的到来，这是一个备受期待的版本，标志着团队和社区的一个重要里程碑。该版本提供了许多令人兴奋的功能，包括期待已久的 JSON 数据类型、动态 Schema 和 Partition Key 支持，确保优化用户体验和简化开发工作流程。此外，该版本还包含大量增强功能和错误修复。请与我们一起探索 Milvus 2.2.9，了解该版本为何如此令人兴奋。</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">通过 JSON 支持优化用户体验<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 推出了备受期待的 JSON 数据类型支持，允许在用户的 Collections 中无缝存储 JSON 数据以及向量的元数据。通过这一增强功能，用户可以高效地批量插入 JSON 数据，并根据 JSON 字段的内容执行高级查询和过滤。此外，用户还可以利用表达式，针对数据集的 JSON 字段执行操作，根据 JSON 字段的内容和结构构建查询和应用过滤器，从而更好地提取相关信息和操作数据。</p>
<p>未来，Milvus 团队将为 JSON 类型中的字段添加索引，进一步优化混合标量和向量查询的性能。敬请期待未来激动人心的发展！</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">通过支持动态 Schema 增加灵活性<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>由于支持 JSON 数据，Milvus 2.2.9 现在可通过简化的软件开发工具包（SDK）提供动态模式功能。</p>
<p>从 Milvus 2.2.9 开始，Milvus SDK 包括一个高级 API，可自动将动态字段填入 Collections 的隐藏 JSON 字段，使用户只需专注于业务字段。</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">利用 Partition Key 更好地分离数据并提高搜索效率<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 通过引入分区键功能增强了分区能力。它允许将用户特定列作为主键进行分区，无需使用<code translate="no">loadPartition</code> 和<code translate="no">releasePartition</code> 等额外的 API。这项新功能还取消了对分区数量的限制，从而提高了资源利用效率。</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">支持阿里云 OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 现在支持阿里巴巴云对象存储服务（OSS）。阿里云用户可轻松将<code translate="no">cloudProvider</code> 配置到阿里云，并利用无缝集成的优势，在云中高效存储和检索向量数据。</p>
<p>除了前面提到的功能外，Milvus 2.2.9 还在基于角色的访问控制（RBAC）中提供了数据库支持，引入了连接管理，并包含多个增强功能和错误修复。更多信息，请参阅<a href="https://milvus.io/docs/release_notes.md">Milvus 2.2.9 发行说明</a>。</p>
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
    </button></h2><p>如果您有关于 Milvus 的问题或反馈，请随时通过<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> 与我们联系。也欢迎您加入我们的<a href="https://milvus.io/slack/">Slack 频道</a>，直接与我们的工程师和社区交流，或查看我们的<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">周二办公时间</a>！</p>
