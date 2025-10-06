---
id: how-to-debug-slow-requests-in-milvus.md
title: 如何调试 Milvus 中缓慢的搜索请求
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: 在这篇文章中，我们将分享如何在 Milvus 中分流缓慢的请求，并分享您可以采取的实际步骤，以保持延迟的可预测性、稳定性和持续低延迟。
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>性能是 Milvus 的核心。在正常情况下，Milvus 的搜索请求只需几毫秒即可完成。但如果集群速度减慢，搜索延迟延长到整秒，会发生什么情况？</p>
<p>缓慢的搜索并不经常发生，但在大规模或复杂的工作负载下可能会出现。一旦出现这种情况，就会很严重：它们会破坏用户体验、影响应用程序性能，而且往往会暴露出设置中隐藏的低效问题。</p>
<p>在这篇文章中，我们将介绍如何在 Milvus 中分流慢速请求，并分享您可以采取的实用步骤，以保持可预测、稳定和持续的低延迟。</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">识别慢速搜索<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>诊断慢速请求需要从两个问题入手：慢速请求<strong>发生的频率以及时间流向？</strong>Milvus 通过指标和日志为您提供这两个答案。</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Milvus 指标</h3><p>Milvus 会导出详细的指标，您可以在 Grafana 面板中进行监控。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>主要面板包括</p>
<ul>
<li><p><strong>服务质量 → 查询速度慢</strong>：标记任何超过 proxy.slowQuerySpanInSeconds （默认：5 秒）的请求。这些也会在 Prometheus 中标记。</p></li>
<li><p><strong>服务质量 → 搜索延迟</strong>：显示总体延迟分布。如果看起来正常，但最终用户仍看到延迟，则问题可能出在 Milvus 外部--网络或应用层。</p></li>
<li><p><strong>查询节点 → 按阶段搜索延迟</strong>：将延迟分为队列、查询和缩减阶段。对于更深入的归因，<em>标量</em> <em>过滤延迟</em>、<em>向量搜索延迟</em>和<em>等待安全延迟等</em>面板可显示哪个阶段占主导地位。</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Milvus 日志</h3><p>Milvus 还记录任何持续时间超过 1 秒的请求，并标注[搜索速度慢]等标记。这些日志显示了<em>哪些</em>查询速度较慢，补充了度量指标的洞察力。经验法则是</p>
<ul>
<li><p><strong>&lt; 30 毫秒</strong>→大多数情况下搜索延迟正常</p></li>
<li><p><strong>&gt; 100 毫秒</strong>→ 值得研究</p></li>
<li><p><strong>&gt; 1 秒</strong>→ 绝对缓慢，需要注意</p></li>
</ul>
<p>日志示例：</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>简而言之，<strong>指标会告诉你时间的去向；日志会告诉你哪些查询被命中。</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">分析根本原因<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">工作量大</h3><p>请求速度慢的一个常见原因是工作量过大。当一个请求的<strong>NQ</strong>（每个请求的查询次数）非常大时，它就会长期运行并垄断查询节点资源。其他请求会堆积在它后面，导致队列延迟上升。即使每个请求的 NQ 较小，但由于 Milvus 可能会在内部合并并发的搜索请求，因此非常高的总体吞吐量（QPS）仍会造成同样的影响。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>需要注意的信号：</strong></p>
<ul>
<li><p>所有查询都显示意外的高延迟。</p></li>
<li><p>查询节点指标报告高<strong>队列延迟</strong>。</p></li>
<li><p>日志显示一个请求的 NQ 较大，总持续时间较长，但每个 NQ 的持续时间相对较小，这表明一个超大请求正在支配资源。</p></li>
</ul>
<p><strong>如何解决</strong></p>
<ul>
<li><p><strong>批量查询</strong>：保持适度的 NQ，避免单个请求超载。</p></li>
<li><p><strong>缩小查询节点的规模</strong>：如果高并发是工作负载的常规组成部分，则应增加查询节点，以分散负载并保持低延迟。</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">低效过滤</h3><p>另一个常见瓶颈来自效率低下的过滤器。如果过滤器表达式不佳或字段缺乏标量索引，Milvus 可能会退回到<strong>全扫描</strong>，而不是扫描目标明确的小范围子集。JSON 过滤器和严格的一致性设置会进一步增加开销。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>需要注意的信号</strong></p>
<ul>
<li><p>查询节点指标中的高<strong>标量过滤器延迟</strong>。</p></li>
<li><p>只有在应用过滤器时才会出现明显的延迟峰值。</p></li>
<li><p>如果启用了严格一致性，则<strong>等待 tSafe 延迟较长</strong>。</p></li>
</ul>
<p><strong>如何解决</strong></p>
<ul>
<li><strong>简化过滤器表达式</strong>：通过优化筛选器降低查询计划的复杂性。例如，用 IN 表达式替换长 OR 链：</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>Milvus 还引入了过滤器表达式模板化机制，旨在通过减少解析复杂表达式的时间来提高效率。详情请参见<a href="https://milvus.io/docs/filtering-templating.md">本文档</a>。</p></li>
<li><p><strong>添加适当的索引</strong>：通过为过滤器中使用的字段创建标量索引来避免全扫描。</p></li>
<li><p><strong>高效处理 JSON</strong>：Milvus 2.6 为 JSON 字段引入了路径和平面索引，从而实现了对 JSON 数据的高效处理。为了进一步提高性能，我们还<a href="https://milvus.io/docs/roadmap.md">将</a>对 JSON 进行粉碎处理。有关更多信息，请参阅<a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">JSON 字段文档</a>。</p></li>
<li><p><strong>调整一致性级别</strong>：在不需要严格保证时，使用 "<em>有界</em> <em>"</em>或<em>"最终</em>"一致性读取，减少<em>tSafe</em>等待时间。</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">向量索引选择不当</h3><p><a href="https://milvus.io/docs/index-explained.md">向量索引</a>不是万能的。选择错误的索引会严重影响延迟。内存索引能提供最快的性能，但会消耗更多内存，而磁盘索引则以速度为代价节省内存。二进制向量也需要专门的索引策略。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>需要注意的信号：</strong></p>
<ul>
<li><p>查询节点指标中的向量搜索延迟过高。</p></li>
<li><p>使用 DiskANN 或 MMAP 时磁盘 I/O 饱和。</p></li>
<li><p>缓存冷启动导致重启后查询速度变慢。</p></li>
</ul>
<p><strong>如何解决</strong></p>
<ul>
<li><p><strong>将索引与工作负载相匹配（浮动向量）：</strong></p>
<ul>
<li><p><strong>HNSW</strong>- 最适合高召回率和低延迟的内存用例。</p></li>
<li><p><strong>IVF 系列</strong>--在召回率和速度之间灵活权衡。</p></li>
<li><p><strong>DiskANN</strong>- 支持十亿规模的数据集，但需要强大的磁盘带宽。</p></li>
</ul></li>
<li><p><strong>对于二进制向量：</strong>使用<a href="https://milvus.io/docs/minhash-lsh.md">MINHASH_LSH 索引</a>（Milvus 2.6 中引入）与 MHJACCARD 度量，有效地近似雅卡德相似性。</p></li>
<li><p><strong>启用</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>：将索引文件映射到内存中，而不是完全驻留在内存中，以便在延迟和内存使用率之间取得平衡。</p></li>
<li><p><strong>调整索引/搜索参数</strong>：调整设置，以平衡工作负载的检索和延迟。</p></li>
<li><p><strong>减少冷启动</strong>：对重启后频繁访问的数据段进行预热，以避免初始查询速度变慢。</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">运行时间和环境条件</h3><p>并非所有缓慢的查询都是由查询本身造成的。查询节点通常会与压缩、数据迁移或索引构建等后台作业共享资源。频繁的上载会产生许多未编入索引的小片段，从而迫使搜索扫描原始数据。在某些情况下，特定版本的低效率也会带来延迟，直到打上补丁。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>需要注意的信号</strong></p>
<ul>
<li><p>后台工作（压缩、迁移、索引构建）期间 CPU 使用率激增。</p></li>
<li><p>影响查询性能的磁盘 I/O 饱和。</p></li>
<li><p>重启后缓存预热非常缓慢。</p></li>
<li><p>大量未编入索引的小数据段（频繁插入造成）。</p></li>
<li><p>与特定 Milvus 版本相关的延迟回归。</p></li>
</ul>
<p><strong>如何解决</strong></p>
<ul>
<li><p>将<strong>后台任务</strong>（如压缩）<strong>重新安排</strong>到非高峰时段。</p></li>
<li><p><strong>释放未使用的 Collections</strong>以释放内存。</p></li>
<li><p><strong>考虑</strong>重启后的<strong>预热时间</strong>；必要时预热缓存。</p></li>
<li><p><strong>批量上载</strong>，减少创建微小数据段，让压缩跟上。</p></li>
<li><p><strong>保持最新</strong>：升级到较新的 Milvus 版本，以获得错误修复和优化。</p></li>
<li><p><strong>配置资源</strong>：为对延迟敏感的工作负载分配额外的 CPU/内存。</p></li>
</ul>
<p>通过将每个信号与正确的操作相匹配，可以快速、可预测地解决大多数缓慢查询。</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">防止缓慢搜索的最佳实践<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>最好的调试会话是永远不需要运行的会话。根据我们的经验，在 Milvus 中，一些简单的习惯对防止缓慢查询有很大帮助：</p>
<ul>
<li><p><strong>规划资源分配</strong>，避免 CPU 和磁盘争用。</p></li>
<li><p>为故障和延迟峰值<strong>设置主动警报</strong>。</p></li>
<li><p><strong>保持过滤表达式</strong>简短、高效。</p></li>
<li><p><strong>批量上载</strong>并将 NQ/QPS 保持在可持续水平。</p></li>
<li><p>为过滤器中使用的<strong>所有字段建立索引</strong>。</p></li>
</ul>
<p>Milvus 中很少出现查询速度慢的情况，即使出现，通常也有明确的、可诊断的原因。利用指标、日志和结构化方法，您可以快速识别并解决问题。我们的支持团队每天都在使用这本指南，现在您也可以使用了。</p>
<p>我们希望本指南不仅能提供故障排除框架，还能让您有信心保持 Milvus 工作负载平稳高效地运行。</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">想要深入了解？<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>加入<a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a>，提问、分享经验并向社区学习。</p></li>
<li><p>注册参加我们的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus 办公时间</strong></a>，与团队直接对话，在工作负载方面获得实际帮助。</p></li>
</ul>
