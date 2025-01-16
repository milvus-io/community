---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 最好的 Milvus：从 v2.2 到 v2.2.6 的探索
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Milvus 2.2 至 2.2.6 的新功能
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>最好的 Milvus</span> </span></p>
<p>欢迎回来，Milvus 的粉丝们！我们知道，自从上次分享关于这个前沿开源向量数据库的更新以来，已经有一段时间了。但不用担心，因为我们在这里将为您介绍自去年 8 月以来发生的所有令人兴奋的进展。</p>
<p>在这篇博文中，我们将带您了解 Milvus 从 2.2 版到 2.2.6 版的最新版本。我们要介绍的内容很多，包括新功能、改进、错误修复和优化。因此，请系好安全带，让我们一起深入了解！</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2：稳定性更强、搜索速度更快、扩展性更灵活的重要版本<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2 是一个重要的版本，它引入了七项全新功能，并对以前的版本进行了大量突破性改进。让我们仔细看看其中的一些亮点：</p>
<ul>
<li><strong>从文件批量插入实体</strong>：有了这项功能，你只需几行代码就能将一个或多个文件中的实体批量直接上传到 Milvus，省时省力。</li>
<li><strong>查询结果分页</strong>：为了避免在一次远程过程调用（RPC）中返回大量搜索和查询结果，Milvus v2.2 允许你在搜索和查询中配置偏移量并用关键字过滤结果。</li>
<li><strong>基于角色的访问控制（RBAC）</strong>：Milvus v2.2 现在支持 RBAC，允许你通过管理用户、角色和权限来控制对 Milvus 实例的访问。</li>
<li><strong>配额和限制</strong>：配额和限制是 Milvus v2.2 中的一种新机制，可保护数据库系统在突然流量激增时不会发生内存不足（OOM）错误和崩溃。有了这项功能，你可以控制摄取、搜索和内存使用。</li>
<li><strong>Collection 级别的生存时间 (TTL)：</strong>在以前的版本中，Milvus 只允许你为集群配置 TTL。不过，Milvus v2.2 现在支持在 Collections 级别配置 TTL。为特定 Collections 配置 TTL，该 Collections 中的实体将在 TTL 结束后自动过期。这种配置可对数据保留进行更精细的控制。</li>
<li><strong>基于磁盘的近似近邻搜索（ANNS）索引（测试版）</strong>：Milvus v2.2 引入了对 DiskANN 的支持，这是一种固态硬盘驻留和基于 Vamana 图的 ANNS 算法。该支持允许在大规模数据集上直接搜索，可显著减少内存使用量，最多可减少 10 倍。</li>
<li><strong>数据备份（测试版）</strong>：Milvus v2.2 提供了<a href="https://github.com/zilliztech/milvus-backup">一个全新的工具</a>，可通过命令行或 API 服务器正确备份和恢复 Milvus 数据。</li>
</ul>
<p>除上述新功能外，Milvus v2.2 还包括对 5 个错误的修复和多项改进，以增强 Milvus 的稳定性、可观测性和性能。更多详情，请参阅<a href="https://milvus.io/docs/release_notes.md#v220">Milvus v2.2 发布说明</a>。</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 和 v2.2.2：已修复问题的小版本<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 和 v2.2.2 是小版本，主要修复旧版本中的关键问题并引入新功能。以下是一些亮点：</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>支持 Pulsa 租户和身份验证</li>
<li>在 etcd 配置源中支持传输层安全（TLS）</li>
<li>搜索性能提高 30% 以上</li>
<li>优化调度程序，提高合并任务的概率</li>
<li>修复了多个错误，包括索引标量字段上的术语过滤失败和索引节点在创建索引失败时的恐慌问题</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>修复了代理不更新分片领导缓存的问题</li>
<li>修复了已发布的 Collection/分区的加载信息未清理的问题</li>
<li>修复了加载计数未及时清除的问题</li>
</ul>
<p>更多详情，请参阅<a href="https://milvus.io/docs/release_notes.md#v221">Milvus v2.2.1 发布说明</a>和<a href="https://milvus.io/docs/release_notes.md#v222">Milvus v2.2.2 发布说明</a>。</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3：更安全、更稳定、更可用<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3 是一个注重增强系统安全性、稳定性和可用性的版本。此外，它还引入了两个重要功能：</p>
<ul>
<li><p><strong>滚动升级</strong>：该功能允许 Milvus 在升级过程中响应传入的请求，这在以前的版本中是不可能实现的。滚动升级可确保系统在升级过程中仍然可用，并对用户请求做出响应。</p></li>
<li><p><strong>协调器高可用性（HA）</strong>：该功能使 Milvus 协调员以主动-备用模式工作，降低了单点故障的风险。即使发生意外灾难，恢复时间也最多可缩短至 30 秒。</p></li>
</ul>
<p>除这些新功能外，Milvus v2.2.3 还包括大量改进和错误修复，包括增强批量插入性能、降低内存使用率、优化监控指标和改进元存储性能。更多详情，请参阅<a href="https://milvus.io/docs/release_notes.md#v223">Milvus v2.2.3 发行说明</a>。</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4：更快、更可靠、更节省资源<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4 是 Milvus v2.2 的小更新。它引入了四项新功能和几项增强功能，使性能更快、可靠性更高、资源消耗更少。该版本的亮点包括</p>
<ul>
<li><strong>资源分组</strong>：Milvus 现在支持将 QueryNodes 分组到其他资源组中，允许完全隔离对不同组中物理资源的访问。</li>
<li><strong>Collections 重命名</strong>：Collections 重命名 API 允许用户更改 Collections 的名称，为管理 Collections 提供了更大的灵活性，并提高了可用性。</li>
<li><strong>支持谷歌云存储</strong></li>
<li><strong>搜索和查询 API 中的新选项</strong>：这项新功能允许用户跳过对所有增长段的搜索，在搜索与数据插入同时进行的情况下提供更好的搜索性能。</li>
</ul>
<p>更多信息，请参阅<a href="https://milvus.io/docs/release_notes.md#v224">Milvus v2.2.4 发布说明</a>。</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5：不建议使用<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5 有几个关键问题，因此我们不建议使用此版本。  对于由此造成的不便，我们深表歉意。不过，这些问题已在 Milvus v2.2.6 中得到解决。</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6：解决了 v2.2.5 中的关键问题<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6 已成功解决了在 v2.2.5 中发现的关键问题，包括回收脏 binlog 数据和 DataCoord GC 失效的问题。如果您目前使用的是 v2.2.5，请升级以确保最佳性能和稳定性。</p>
<p>已修复的关键问题包括</p>
<ul>
<li>DataCoord GC 故障</li>
<li>覆盖已传递的索引参数</li>
<li>RootCoord 消息积压导致的系统延迟</li>
<li>指标 RootCoordInsertChannelTimeTick 不准确</li>
<li>可能的时间戳停止</li>
<li>重启过程中协调器角色偶尔自毁</li>
<li>垃圾收集异常退出导致检查点落后</li>
</ul>
<p>更多详情，请参阅<a href="https://milvus.io/docs/release_notes.md#v226">Milvus v2.2.6 发布说明</a>。</p>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>总之，Milvus 从 v2.2 到 v2.2.6 的最新版本提供了许多令人兴奋的更新和改进。从新功能到错误修复和优化，Milvus 将继续履行承诺，提供最前沿的解决方案，并增强各领域应用的能力。请继续关注 Milvus 社区带来的更多激动人心的更新和创新。</p>
