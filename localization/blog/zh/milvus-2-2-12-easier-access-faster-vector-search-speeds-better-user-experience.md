---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: Milvus 2.2.12：更方便的访问、更快的向量搜索速度和更好的用户体验
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们非常高兴地宣布 Milvus 2.2.12 的最新发布。此次更新包括多个新功能，如支持 RESTful API、<code translate="no">json_contains</code> 功能以及 ANN 搜索过程中的向量检索，以回应用户反馈。我们还简化了用户体验，提高了向量搜索速度，并解决了许多问题。让我们深入了解一下 Milvus 2.2.12 的功能。</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">支持 RESTful API<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 现在支持 RESTful API，用户无需安装客户端即可访问 Milvus，使客户端-服务器操作毫不费力。此外，由于 Milvus SDK 和 RESTful API 共享相同的端口号，部署 Milvus 变得更加方便。</p>
<p><strong>注</strong>：我们仍然建议使用 SDK 部署 Milvus 进行高级操作，或者如果您的业务对延迟敏感的话。</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">ANN 搜索期间的向量检索<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>在早期版本中，为了优先考虑性能和内存使用情况，Milvus 不允许在近似近邻（ANN）搜索期间检索向量。因此，检索原始向量必须分为两个步骤：执行 ANN 搜索，然后根据原始向量的 ID 对其进行查询。这种方法增加了开发成本，使用户更难部署和采用 Milvus。</p>
<p>有了 Milvus 2.2.12，用户可以在进行 ANN 搜索时检索原始向量，方法是将向量字段设置为输出字段，并在 HNSW、DiskANN 或 IVF-FLAT 索引的 Collections 中进行查询。此外，用户还可以期待更快的向量检索速度。</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">支持对 JSON 数组的操作符<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>我们最近在 Milvus 2.2.8 中添加了对 JSON 的支持。从那时起，用户发出了大量请求，希望我们能支持更多 JSON 数组操作，如包含、排除、交集、联合、差分等。在 Milvus 2.2.12 中，我们优先支持了<code translate="no">json_contains</code> 函数，以启用包含操作。我们将在未来版本中继续添加对其他操作符的支持。</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">增强功能和错误修复<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>除了引入新功能外，Milvus 2.2.12 还提高了向量搜索性能，减少了开销，使其更容易处理大量 topk 搜索。此外，它还增强了在启用 Partition Key 和多分区情况下的写入性能，并优化了大型机器的 CPU 占用率。 本次更新解决了各种问题：磁盘使用率过高、压缩卡住、数据删除不频繁以及批量插入失败。更多信息，请参阅<a href="https://milvus.io/docs/release_notes.md#2212">Milvus 2.2.12 发布说明</a>。</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">让我们保持联系！<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
