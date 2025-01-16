---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: 揭开 Milvus 2.3 的神秘面纱：支持 GPU、Arm64、CDC 和其他许多备受期待的功能的里程碑式版本
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 是一个里程碑式的版本，具有众多备受期待的功能，包括支持 GPU、Arm64、upsert、变更数据捕获、ScaNN
  索引和范围搜索。它还引入了更高的查询性能、更强大的负载平衡和调度功能，以及更好的可观察性和操作符。
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>令人振奋的消息！经过八个月的共同努力，我们非常高兴地宣布 Milvus 2.3 正式发布，这个里程碑式的版本带来了众多备受期待的功能，包括支持 GPU、Arm64、upsert、变更数据捕获、ScaNN 索引和 MMap 技术。Milvus 2.3 还引入了更高的查询性能、更强大的负载平衡和调度功能，以及更好的可观察性和可操作符。</p>
<p>请与我一起了解这些新功能和增强功能，并学习如何从这一版本中获益。</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">支持 GPU 索引，使 QPS 速度提高 3-10 倍<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>GPU 索引是 Milvus 社区高度期待的功能。得益于与 Nvidia 工程师的通力合作，Milvus 2.3 在 Milvus 索引引擎 Knowhere 中添加了强大的 RAFT 算法，从而支持 GPU 索引。有了 GPU 支持，Milvus 2.3 的 QPS 速度比使用 CPU HNSW 索引的旧版本快三倍多，对于需要大量计算的特定数据集，速度几乎快十倍。</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">支持 Arm64 以满足日益增长的用户需求<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>Arm CPU 越来越受云提供商和开发人员的青睐。为了满足这一日益增长的需求，Milvus 现在提供了针对 ARM64 架构的 Docker 映像。有了这一新的 CPU 支持，MacOS 用户可以更无缝地使用 Milvus 构建自己的应用程序。</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">支持 Upsert，提供更好的用户体验<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 引入了一个显著的增强功能，即支持 upsert 操作符。这项新功能允许用户无缝更新或插入数据，并使用户能够通过 Upsert 界面在单个请求中执行这两项操作。该功能简化了数据管理，提高了效率。</p>
<p><strong>注意</strong></p>
<ul>
<li>Upsert 功能不适用于自动递增 ID。</li>
<li>Upsert 是以<code translate="no">delete</code> 和<code translate="no">insert</code> 的组合方式实现的，这可能会导致一些性能损失。如果在写入量大的情况下使用 Milvus，我们建议使用<code translate="no">insert</code> 。</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">范围搜索，结果更准确<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 允许用户在查询时指定输入向量与 Milvus 中存储的向量之间的距离。然后，Milvus 会返回设定范围内的所有匹配结果。下面是一个使用范围搜索功能指定搜索距离的示例。</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>在这个例子中，用户要求 Milvus 返回距离输入向量 10 到 20 个单位范围内的向量。</p>
<p><strong>注意</strong>：不同的距离度量计算距离的方式各不相同，因此会产生不同的值范围和排序策略。因此，在使用范围搜索功能之前，必须了解它们的特点。</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">加快查询速度的 ScaNN 索引<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 现在支持 ScaNN 索引，这是一种由谷歌开发的开源<a href="https://zilliz.com/glossary/anns">近似近邻（ANN）</a>索引。ScaNN 索引在各种基准测试中表现出卓越的性能，比 HNSW 高出约 20%，比 IVFFlat 快约 7 倍。支持 ScaNN 索引后，Milvus 的查询速度比旧版本快得多。</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">不断增长的索引带来稳定和更好的查询性能<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 包括两类数据：索引数据和流数据。Milvus 可以使用索引快速搜索索引数据，但只能逐行粗略搜索流数据，这会影响性能。Milvus 2.3 引入了成长索引（Growing Index），它能自动为流式数据创建实时索引，从而提高查询性能。</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">用于批量数据检索的迭代器<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 2.3 中，Milvus 引入了迭代器界面，允许用户在搜索或范围搜索中检索超过 16384 个实体。当用户需要批量导出数万甚至更多向量时，这一功能非常方便。</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">支持 MMap 以提高容量<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap 是一种 UNIX 系统调用，用于将文件和其他对象映射到内存中。Milvus 2.3 支持 MMap，用户可以将数据加载到本地磁盘并映射到内存中，从而提高单机容量。</p>
<p>我们的测试结果表明，使用 MMap 技术，Milvus 可以将数据容量增加一倍，同时将性能下降限制在 20% 以内。这种方法大大降低了总体成本，对于预算紧张而又不介意降低性能的用户尤其有利。</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">支持 CDC，提高系统可用性<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>变更数据捕获（CDC）是数据库系统中常用的一项功能，可捕获数据变更并复制到指定目标。借助 CDC 功能，Milvus 2.3 使用户能够跨数据中心同步数据、备份增量数据和无缝迁移数据，从而使系统的可用性更高。</p>
<p>除上述功能外，Milvus 2.3 还引入了计数界面，可实时准确计算 Collections 中存储的数据行数，支持余弦度量法测量向量距离，并对 JSON 数组进行更多操作。有关更多功能和详细信息，请参阅<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 发布说明</a>。</p>
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
    </button></h2><p>除新功能外，Milvus 2.3 还包括许多针对旧版本的改进和错误修复。</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">提高数据过滤性能</h3><p>在混合标量和向量数据查询中，Milvus 会在向量搜索之前执行标量过滤，以获得更准确的结果。但是，如果用户在标量过滤后过滤掉太多数据，索引性能可能会下降。在 Milvus 2.3 中，我们针对这一问题优化了 HNSW 的过滤策略，从而提高了查询性能。</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">提高多核 CPU 使用率</h3><p>近似最近搜索（ANN）是一项计算密集型任务，需要大量的 CPU 资源。在以前的版本中，Milvus 只能利用约 70% 的可用多核 CPU 资源。但在最新版本中，Milvus 克服了这一限制，可以充分利用所有可用的多核 CPU 资源，从而提高了查询性能，减少了资源浪费。</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">重构查询节点</h3><p>QueryNode 是 Milvus 中负责向量搜索的重要组件。然而，在旧版本中，QueryNode 存在复杂的状态、重复的消息队列、无序的代码结构和不直观的错误信息。</p>
<p>在 Milvus 2.3 中，我们对 QueryNode 进行了升级，引入了无状态代码结构，并删除了用于删除数据的消息队列。这些更新减少了资源浪费，提高了向量搜索的速度和稳定性。</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">基于 NATS 的增强型消息队列</h3><p>我们在基于日志的架构上构建了 Milvus，在之前的版本中，我们使用 Pulsar 和 Kafka 作为核心日志代理。然而，这种组合面临三个主要挑战：</p>
<ul>
<li>在多主题情况下不稳定。</li>
<li>空闲时消耗资源，难以重复处理信息。</li>
<li>Pulsar 和 Kafka 与 Java 生态系统紧密相连，因此它们的社区很少维护和更新 Go SDK。</li>
</ul>
<p>为了解决这些问题，我们将 NATS 和 Bookeeper 结合起来，作为 Milvus 的新日志代理，这样更符合用户的需求。</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">优化的负载平衡器</h3><p>Milvus 2.3 采用了基于系统实际负载的更灵活的负载均衡算法。这种优化算法能让用户快速检测到节点故障和不平衡负载，并相应调整调度。根据我们的测试结果，Milvus 2.3 可以在几秒钟内检测到故障、不平衡负载、异常节点状态等事件，并及时做出调整。</p>
<p>有关 Milvus 2.3 的更多信息，请参阅<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 发布说明</a>。</p>
<h2 id="Tool-upgrades" class="common-anchor-header">工具升级<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 2.3 发布的同时，我们还升级了 Birdwatcher 和 Attu 这两个用于操作和维护 Milvus 的重要工具。</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Birdwatcher 升级</h3><p>我们对 Milvus 的调试工具<a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a> 进行了升级，引入了大量功能和改进，包括</p>
<ul>
<li>RESTful API，可与其他诊断系统无缝集成。</li>
<li>支持 PProf 命令，便于与 Go pprof 工具集成。</li>
<li>存储使用分析功能</li>
<li>高效的日志分析功能</li>
<li>支持在 etcd 中查看和修改配置。</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Attu 更新</h3><p>我们为一体化向量数据库管理工具<a href="https://zilliz.com/attu">Attu</a> 推出了全新界面。新界面的设计更加直观，也更容易理解。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>更多详情，请参阅<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 发布说明</a>。</p>
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
