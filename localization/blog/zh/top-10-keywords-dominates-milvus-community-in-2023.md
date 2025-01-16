---
id: top-10-keywords-dominates-milvus-community-in-2023.md
title: 揭晓 2023 年主导 Milvus 社区的十大关键词
author: 'Jack Li, Fendy Feng'
date: 2024-1-21
desc: 本篇文章通过分析聊天记录和揭示讨论中的十大关键词来探索社区的核心。
metaTitle: Top 10 Keywords Dominating the Milvus Community in 2023
cover: >-
  assets.zilliz.com/Top_10_Keywords_in_the_Milvus_Community_20240116_111204_1_f65b17a8ea.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/top-10-keywords-dominates-milvus-community-in-2023.md'
---
<p>在 2023 年即将结束之际，让我们回顾一下 Milvus 社区的非凡历程：拥有<a href="https://github.com/milvus-io/milvus">25000 个 GitHub Stars</a>、推出<a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 2.3.0</a> 以及<a href="https://hub.docker.com/r/milvusdb/milvus">Docker 镜像</a>下载量突破 1000 万。这篇文章通过分析聊天记录和揭示讨论中的十大关键词来探索社区的核心。</p>
<iframe class="video-player" src="https://www.youtube.com/embed/o5uMdNLioQ0?list=PLPg7_faNDlT5Fb8WN8r1PzzQTNzdechnS" title="Mastering Milvus: Turbocharge Your Vector Database with Optimization Secrets!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="common-anchor-header">#1 版本--AIGC 的崛起推动了 Milvus 的快速迭代<button data-href="#1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="anchor-icon" translate="no">
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
    </button></h2><p>令人惊讶的是，"版本 "成为 2023 年讨论最多的关键词。这一启示源于这一年的人工智能浪潮，向量数据库是应对 AIGC 应用幻觉问题挑战的重要基础设施。</p>
<p>围绕向量数据库的热情推动Milvus进入快速迭代阶段。仅在2023年，社区就见证了20个版本的发布，满足了AIGC开发者的需求，他们涌入社区询问如何为各种应用选择最优版本的Milvus。对于浏览这些更新的用户，我们建议使用最新版本，以增强功能和性能。</p>
<p>如果您对 Milvus 的发布规划感兴趣，请参考官方网站上的<a href="https://wiki.lfaidata.foundation/display/MIL/Milvus+Long+Term+Roadmap+and+Time+schedule">Milvus 路线图</a>页面。</p>
<h2 id="2-Search--beyond-Vector-Search" class="common-anchor-header">#2 搜索--超越向量搜索<button data-href="#2-Search--beyond-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>"搜索 "排在第二位，反映了它在数据库操作中的基础作用。Milvus 支持多种搜索功能，从 Top-K ANN 搜索到标量过滤搜索和范围搜索。即将发布的 Milvus 3.0（测试版）承诺提供关键字搜索（稀疏嵌入），许多 RAG 应用程序开发人员对此翘首以盼。</p>
<p>社区关于搜索的讨论主要集中在性能、功能和原则方面。用户经常提出有关属性过滤、设置索引阈值和解决延迟问题的问题。<a href="https://milvus.io/docs/v2.0.x/search.md">查询和搜索文档</a>、<a href="https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287103">Milvus 增强提案（MEP）</a>和 Discord 讨论等资源已成为解开 Milvus 内部错综复杂的搜索问题的首选参考资料。</p>
<h2 id="3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="common-anchor-header">#3 内存--在性能和准确性之间权衡，尽量减少内存开销<button data-href="#3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="anchor-icon" translate="no">
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
    </button></h2><p>在过去的一年里，"内存 "也是社区讨论的中心议题。作为一种独特的数据类型，向量本身具有很高的维度。为了获得最佳性能，将向量存储在内存中是一种常见的做法，但不断增长的数据量限制了可用内存。Milvus 通过采用<a href="https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability">MMap</a>和 DiskANN 等技术来优化内存使用。</p>
<p>然而，在数据库系统中同时实现低内存使用率、卓越性能和高精确度仍然很复杂，需要在性能和精确度之间进行权衡，以尽量减少内存开销。</p>
<p>就人工智能生成内容（AIGC）而言，开发人员通常会优先考虑快速响应和结果准确性，而不是严格的性能要求。Milvus 增加的 MMap 和 DiskANN 在最大限度地提高数据处理速度和结果准确性的同时，最大限度地减少了内存使用量，达到了与 AIGC 应用程序的实际需求相一致的平衡。</p>
<h2 id="4-Insert--smooth-sailing-through-data-insertion" class="common-anchor-header">#4 插入--数据插入一帆风顺<button data-href="#4-Insert--smooth-sailing-through-data-insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>高效的数据插入是开发人员关心的一个重要问题，这引发了 Milvus 社区对优化插入速度的频繁讨论。Milvus 在高效插入流式数据和建立索引方面表现出色，这要归功于它对流式数据和批量数据的巧妙分离。与其他向量数据库提供商（如 Pinecone）相比，这种能力使其脱颖而出，成为性能卓越的解决方案。</p>
<p>以下是关于数据插入的一些有价值的见解和建议：</p>
<ul>
<li><p><strong>批量插入：</strong>选择批量插入，而不是单行插入，以提高效率。值得注意的是，从文件插入的速度超过了批量插入。在处理超过 1000 万条记录的大型数据集时，可考虑使用<code translate="no">bulk_insert</code> 界面，以简化和加快导入流程。</p></li>
<li><p><strong>战略性使用<code translate="no">flush()</code> ：</strong>与其在每次批处理后调用<code translate="no">flush()</code> 接口，不如在完成所有数据插入后调用一次。在批次之间过度使用<code translate="no">flush()</code> 界面会导致生成碎片段文件，给系统带来相当大的压缩负担。</p></li>
<li><p><strong>主键重复数据删除：</strong>在使用<code translate="no">insert</code> 接口插入数据时，Milvus 不会执行主键重复数据删除。如果您需要重复数据删除主键，我们建议您部署<code translate="no">upsert</code> 接口。不过，由于多了一个内部查询操作，<code translate="no">upsert</code>的插入性能比<code translate="no">insert</code> 低。</p></li>
</ul>
<h2 id="5-Configuration--decoding-the-parameter-maze" class="common-anchor-header">#5 配置--解码参数迷宫<button data-href="#5-Configuration--decoding-the-parameter-maze" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一个分布式向量数据库，集成了许多第三方组件，如对象存储、消息队列和 Etcd。用户们努力调整参数，了解参数对 Milvus 性能的影响，因此 "配置 "成了经常讨论的话题。</p>
<p>在所有关于配置的问题中，"调整哪些参数 "可以说是最具挑战性的方面，因为在不同的情况下，参数会有所不同。例如，优化搜索性能参数不同于优化插入性能参数，在很大程度上依赖于实践经验。</p>
<p>一旦用户确定了 "需要调整哪些参数"，接下来的 "如何调整 "问题就变得更容易处理了。有关具体步骤，请参阅我们的<a href="https://milvus.io/docs/configure-helm.md">配置 Milvus</a> 文档。好消息是，Milvus 从 2.3.0 版开始支持动态参数调整，无需重新启动即可使更改生效。有关具体步骤，请参阅《<a href="https://milvus.io/docs/dynamic_config.md">动态配置 Milvus</a>》。</p>
<h2 id="6-Logs--navigating-the-troubleshooting-compass" class="common-anchor-header">#6 日志--故障排除指南针导航<button data-href="#6-Logs--navigating-the-troubleshooting-compass" class="anchor-icon" translate="no">
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
    </button></h2><p>"日志 "是故障排除指南针。用户在社区中寻求有关导出 Milvus 日志、调整日志级别以及与 Grafana 的 Loki 等系统集成的指导。以下是关于 Milvus 日志的一些建议。</p>
<ul>
<li><p><strong>如何查看和导出 Milvus 日志：</strong>您可以使用 GitHub 存储库中的<a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">export-milvus-log.sh</a>一键脚本轻松导出<a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">Milvus</a>日志。</p></li>
<li><p><strong>日志级别：</strong>Milvus 有多种日志级别，以适应不同的使用情况。info 级别足以应对大多数情况，而 debug 级别则用于调试。Milvus 日志过多可能意味着日志级别配置错误。</p></li>
<li><p><strong>我们建议将 Milvus 日志与</strong>Loki 等<strong>日志收集系统集成</strong>，以便在今后的故障排除中简化日志检索。</p></li>
</ul>
<h2 id="7-Cluster--scaling-for-production-environments" class="common-anchor-header">#7 集群--为生产环境扩展<button data-href="#7-Cluster--scaling-for-production-environments" class="anchor-icon" translate="no">
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
    </button></h2><p>鉴于 Milvus 作为分布式向量数据库的特性，"集群 "一词是社区中经常讨论的话题。讨论围绕集群中的数据扩展、数据迁移以及数据备份和同步展开。</p>
<p>在生产环境中，强大的可扩展性和高可用性是分布式数据库系统的标准要求。Milvus 的存储-计算分离架构可通过扩展计算和存储节点资源实现无缝数据扩展，从而适应无限的数据规模。Milvus 还通过多副本架构和强大的备份与同步功能提供高可用性。  更多信息，请参阅<a href="https://milvus.io/docs/coordinator_ha.md#Coordinator-HA">协调器 HA</a>。</p>
<h2 id="8-Documentation--the-gateway-to-understanding-Milvus" class="common-anchor-header">#8 文档--了解 Milvus 的入口<button data-href="#8-Documentation--the-gateway-to-understanding-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在社区讨论中，"文档 "是另一个经常被提及的关键词，通常是关于特定功能是否有文档页面以及在哪里可以找到文档的问题。</p>
<p>作为了解 Milvus 的入口，大约 80% 的社区咨询都能在<a href="https://milvus.io/docs">官方文档</a>中找到答案。我们建议您在使用 Milvus 或遇到任何问题之前阅读我们的文档。此外，您还可以从各种 SDK 软件仓库中的代码示例中了解如何使用 Milvus。</p>
<h2 id="9-Deployment--simplifying-the-Milvus-journey" class="common-anchor-header">#9 部署--简化 Milvus 之旅<button data-href="#9-Deployment--simplifying-the-Milvus-journey" class="anchor-icon" translate="no">
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
    </button></h2><p>简单部署一直是 Milvus 团队的目标。为了实现这一承诺，我们推出了<a href="https://milvus.io/docs/milvus_lite.md#Get-Started-with-Milvus-Lite">Milvus Lite</a>，它是 Milvus 的轻量级替代品，功能齐全，但不依赖 K8s 或 Docker。</p>
<p>通过引入更轻量级的<a href="https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging">NATS</a>消息传递解决方案和整合节点组件，我们进一步简化了部署。根据用户的反馈，我们正在准备发布一个不依赖于 K8s 的独立版本，并不断努力增强功能和简化部署操作符。Milvus 的快速迭代展示了社区对不断完善部署流程的持续承诺。</p>
<h2 id="10-Deletion--unraveling-the-impact" class="common-anchor-header">#10 删除--消除影响<button data-href="#10-Deletion--unraveling-the-impact" class="anchor-icon" translate="no">
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
    </button></h2><p>关于 "删除 "的普遍讨论围绕着删除后数据数量不变、删除数据的持续可检索性以及删除后磁盘空间恢复失败等问题。</p>
<p>Milvus 2.3 引入了<code translate="no">count(*)</code> 表达式，以解决实体计数更新延迟的问题。查询中已删除数据的持续性可能是由于<a href="https://zilliz.com/blog/understand-consistency-models-for-vector-databases">数据一致性模型</a>使用不当造成的。磁盘空间恢复失败的担忧促使我们重新设计 Milvus 的垃圾 Collection 机制，该机制在完全删除数据前设置了一个等待期。这种方法为可能的恢复提供了时间窗口。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>从排名前 10 的关键词中，我们可以窥见 Milvus 社区内的热烈讨论。随着 Milvus 的不断发展，社区仍然是开发人员寻求解决方案、分享经验以及在人工智能时代推动向量数据库发展的宝贵资源。</p>
<p>请在 2024 年加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>，加入这一激动人心的旅程。在那里，您可以与我们出色的工程师互动，与志同道合的 Milvus 爱好者交流。此外，还可以参加每周二下午 12:00 至 12:30 的<a href="https://discord.com/invite/RjNbk8RR4f">Milvus 社区午餐学习</a>会。分享您的想法、问题和反馈，因为每个人的贡献都会为推动 Milvus 前进的协作精神添砖加瓦。我们不仅欢迎您的积极参与，更感谢您的参与。让我们一起创新！</p>
