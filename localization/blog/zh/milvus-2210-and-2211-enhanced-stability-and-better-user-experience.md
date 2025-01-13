---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: Milvus 2.2.10 和 2.2.11：增强系统稳定性和用户体验的小更新
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: 介绍 Milvus 2.2.10 和 2.2.11 的新功能和改进之处
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 的粉丝们，你们好！我们很高兴地宣布，我们刚刚发布了 Milvus 2.2.10 和 2.2.11，这两个小更新主要集中在错误修复和整体性能提升上。您可以期待这两个更新带来更稳定的系统和更好的用户体验。让我们快速了解一下这两个版本的新功能。</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10 修正了偶尔出现的系统崩溃问题，加速了加载和索引，降低了数据节点的内存使用率，并做了许多其他改进。以下是一些显著的变化：</p>
<ul>
<li>用纯 Go 语言编写的新程序替换了旧的 CGO 有效载荷写入器，降低了数据节点的内存使用率。</li>
<li>在<code translate="no">milvus-proto</code> 文件中添加了<code translate="no">go-api/v2</code> ，以防止与不同的<code translate="no">milvus-proto</code> 版本混淆。</li>
<li>将 Gin 从 1.9.0 版升级到 1.9.1 版，以修复<code translate="no">Context.FileAttachment</code> 函数中的一个错误。</li>
<li>为 FlushAll 和数据库 API 添加了基于角色的访问控制 (RBAC)。</li>
<li>修复了 AWS S3 SDK 导致的随机崩溃。</li>
<li>提高了加载和索引速度。</li>
</ul>
<p>更多详情，请参阅<a href="https://milvus.io/docs/release_notes.md#2210">Milvus 2.2.10 发布说明</a>。</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11 解决了各种问题，提高了系统的稳定性。它还提高了监控、日志记录、速率限制和拦截跨集群请求的性能。请看下面的更新要点。</p>
<ul>
<li>为 Milvus GRPC 服务器添加了拦截器，以防止跨集群路由出现任何问题。</li>
<li>为 minio 块管理器添加了错误代码，使诊断和修复错误更容易。</li>
<li>使用了单例例程池，以避免浪费例程并最大限度地利用资源。</li>
<li>通过启用 zstd 压缩，把 RocksMq 的磁盘使用量减少到原来的十分之一。</li>
<li>修正了加载过程中偶尔出现的 QueryNode 恐慌。</li>
<li>修正了因两次计算队列长度而导致的读取请求节流问题。</li>
<li>修正了 MacOS 上 GetObject 返回空值的问题。</li>
<li>修正了因错误使用 noexcept 修饰符而导致的崩溃。</li>
</ul>
<p>更多详情，请参阅<a href="https://milvus.io/docs/release_notes.md#2211">Milvus 2.2.11 发行说明</a>。</p>
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
