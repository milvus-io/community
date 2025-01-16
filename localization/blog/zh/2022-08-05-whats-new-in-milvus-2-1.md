---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Milvus 2.1 的新功能--趋向简洁和快速
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: 开源向量数据库 Milvus 现在在性能和可用性方面都有了改进，用户对此期待已久。
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 中的新功能--趋向简洁和快速</span> </span></p>
<p>经过 Milvus 社区所有贡献者六个月的辛勤工作，我们非常高兴地宣布 Milvus 2.1 正式<a href="https://milvus.io/docs/v2.1.x/release_notes.md">发布</a>。这个广受欢迎的向量数据库的重大迭代强调了<strong>性能</strong>和<strong>可用性</strong>，这是我们关注的两个最重要的关键词。我们增加了对字符串、Kafka 消息队列和嵌入式 Milvus 的支持，并在性能、可扩展性、安全性和可观测性方面做了大量改进。Milvus 2.1 是一次激动人心的更新，它将打通从算法工程师的笔记本电脑到生产级向量相似性搜索服务的 "最后一公里"。</p>
<custom-h1>性能 - 提升 3.2 倍以上</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">5 毫秒级延迟<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 已经支持近似近邻（ANN）搜索，这与传统的 KNN 方法相比是一个实质性的飞跃。然而，吞吐量和延迟问题仍然是需要处理十亿级向量数据检索场景的用户所面临的挑战。</p>
<p>在 Milvus 2.1 中，有一个新的路由协议，不再依赖检索链路中的消息队列，大大降低了小数据集的检索延迟。我们的测试结果表明，Milvus 现在把延迟水平降到了 5ms，满足了相似性搜索和推荐等关键在线链接的要求。</p>
<h2 id="Concurrency-control" class="common-anchor-header">并发控制<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 通过引入新的成本评估模型和并发调度程序，对其并发模型进行了微调。它现在提供并发控制，确保不会出现大量并发请求争夺 CPU 和缓存资源的情况，也不会因为请求数量不足而导致 CPU 利用率不高。Milvus 2.1 中全新的智能调度层还能合并请求参数一致的小 nq 查询，在小 nq 和高查询并发的场景下，性能提升了惊人的 3.2 倍。</p>
<h2 id="In-memory-replicas" class="common-anchor-header">内存复制<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 带来了内存副本，提高了小型数据集的可扩展性和可用性。与传统数据库中的只读副本类似，当读取 QPS 较高时，内存中的副本可以通过增加机器进行水平扩展。在针对小型数据集的向量检索中，推荐系统往往需要提供超过单台机器性能极限的 QPS。现在，在这些情况下，通过在内存中加载多个副本，可以显著提高系统的吞吐量。未来，我们还将引入基于内存中副本的对冲读取机制，在系统需要从故障中恢复时，快速请求其他功能副本，充分利用内存冗余提高系统的整体可用性。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>内存副本允许查询服务基于相同数据的不同副本</span>。 </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">更快的数据加载<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>最后一项性能提升来自数据加载。Milvus 2.1 现在使用 Zstandard (zstd) 压缩<a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">二进制日志</a>，这大大减少了对象存储区和消息存储区的数据大小以及数据加载过程中的网络开销。此外，现在还引入了 goroutine 池，这样 Milvus 就能在控制内存占用的情况下并发加载程序段，并最大限度地减少故障恢复和加载数据所需的时间。</p>
<p>Milvus 2.1 的完整基准测试结果将很快在我们的网站上发布。敬请期待。</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">字符串和标量索引支持<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 现在支持变长字符串 (VARCHAR) 作为标量数据类型。VARCHAR 可用作输出返回的主键，也可用作属性筛选器。<a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">属性筛选</a>是 Milvus 用户最需要的功能之一。如果您经常发现自己想要 &quot;找到与用户最相似的<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>价格区间的产品&quot;，或者 &quot;找到关键词为'向量数据库'且与云原生主题相关的文章&quot;，那么您一定会爱上 Milvus 2.1。</p>
<p>Milvus 2.1 还支持标量倒排索引，以提高基于<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">简洁</a><a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a>作为数据结构的过滤速度。现在，所有数据都能以极低的占用空间加载到内存中，从而能更快地对字符串进行比较、过滤和前缀匹配。我们的测试结果表明，MARISA-trie 将所有数据载入内存并提供查询功能所需的内存仅为 Python 字典的 10%。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 将 MARISA-Trie 与倒排索引相结合，大大提高了过滤速度。</span> </span></p>
<p>未来，Milvus 将继续关注标量查询相关的开发，支持更多的标量索引类型和查询操作符，并提供基于磁盘的标量查询功能，这些都是为降低标量数据的存储和使用成本而不断努力的一部分。</p>
<custom-h1>可用性改进</custom-h1><h2 id="Kafka-support" class="common-anchor-header">卡夫卡支持<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>我们的社区长期以来一直要求在 Milvus 中支持<a href="https://kafka.apache.org">Apache Kafka</a>作为<a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">消息存储</a>。 由于 Milvus 的抽象和封装设计以及 Confluent 提供的 Go Kafka SDK，Milvus 2.1 现在可以根据用户配置选择使用<a href="https://pulsar.apache.org">Pulsar</a>或 Kafka 作为消息存储。</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">生产就绪的 Java SDK<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.1 的发布，我们的<a href="https://github.com/milvus-io/milvus-sdk-java">Java SDK</a>也正式发布。Java SDK 具有与 Python SDK 完全相同的功能，并具有更好的并发性能。下一步，我们的社区贡献者将逐步完善 Java SDK 的文档和用例，并帮助 Go 和 RESTful SDK 进入生产就绪阶段。</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">可观察性和可维护性<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 增加了向量插入计数、搜索延迟/吞吐量、节点内存开销和 CPU 开销等重要的监控<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">指标</a>。此外，新版本还通过调整日志级别和减少无用的日志打印，大大优化了日志保存。</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">嵌入式 Milvus<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 大大简化了大规模海量向量数据检索服务的部署，但对于希望在较小规模上验证算法的科学家来说，Docker 或 K8s 还是太过于不必要的复杂。随着<a href="https://github.com/milvus-io/embd-milvus">嵌入式 Milvus</a> 的推出，你现在可以使用 pip 安装 Milvus，就像使用 Pyrocksb 和 Pysqlite 一样。Embedded Milvus 支持集群版和 Standalone 版的所有功能，让您可以轻松地从笔记本电脑切换到分布式生产环境，而无需更改一行代码。算法工程师在使用 Milvus 构建原型时将获得更好的体验。</p>
<custom-h1>立即试用开箱即用的向量搜索</custom-h1><p>此外，Milvus 2.1 在稳定性和可扩展性方面也有很大改进，我们期待您的使用和反馈。</p>
<h2 id="Whats-next" class="common-anchor-header">下一步计划<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>有关 Milvus 2.1 的所有变化，请参阅详细的<a href="https://milvus.io/docs/v2.1.x/release_notes.md">发行说明</a></li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">安装</a>Milvus 2.1 并试用新功能</li>
<li>加入我们的<a href="https://slack.milvus.io/">Slack 社区</a>，与全球数以千计的 Milvus 用户讨论新功能。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a>和<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>上关注我们，以便在我们的博客发布特定新功能时获得更新。</li>
</ul>
<blockquote>
<p>编辑：<a href="https://github.com/songxianj">蒋松贤</a></p>
</blockquote>
