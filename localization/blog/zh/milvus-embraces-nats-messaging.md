---
id: milvus-embraces-nats-messaging.md
title: 优化数据通信：Milvus 采用 NATS 信息传输技术
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: 介绍 NATS 与 Milvus 的集成，探讨其功能、设置和迁移过程以及性能测试结果。
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在错综复杂的数据处理过程中，无缝通信是连接操作符的纽带。具有开拓性的<a href="https://zilliz.com/cloud">开源向量数据库</a> <a href="https://zilliz.com/what-is-milvus">Milvus</a> 凭借其最新功能踏上了转型之旅：NATS 消息集成。在这篇综合性博文中，我们将揭开这一集成的神秘面纱，探讨其核心功能、设置过程、迁移优势以及与其前身 RocksMQ 相比的优势。</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">了解消息队列在 Milvus 中的作用<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 的云原生架构中，消息队列或日志代理（Log Broker）具有举足轻重的地位。它是确保持久数据流、同步、事件通知和系统恢复期间数据完整性的支柱。传统上，在 Milvus Standalone 模式中，RocksMQ 是最直接的选择，尤其是与 Pulsar 和 Kafka 相比，但在大量数据和复杂场景下，它的局限性就显而易见了。</p>
<p>Milvus 2.3 引入了单节点 MQ 实现 NATS，重新定义了如何管理数据流。与前代产品不同，NATS 将 Milvus 用户从性能限制中解放出来，为处理大量数据提供无缝体验。</p>
<h2 id="What-is-NATS" class="common-anchor-header">什么是 NATS？<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS 是用 Go 实现的分布式系统连接技术。它支持跨系统的各种通信模式，如请求-回复（Request-Reply）和发布-订阅（Publish-Subscribe），通过 JetStream 提供数据持久性，并通过内置的 RAFT 提供分布式功能。有关 NATS 的更多详情，请参阅 NATS<a href="https://nats.io/">官方网站</a>。</p>
<p>在 Milvus 2.3 Standalone 模式下，NATS、JetStream 和 PubSub 为 Milvus 提供了强大的 MQ 功能。</p>
<h2 id="Enabling-NATS" class="common-anchor-header">启用 NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 提供了一个新的控制选项<code translate="no">mq.type</code> ，允许用户指定要使用的 MQ 类型。要启用 NATS，请设置<code translate="no">mq.type=natsmq</code> 。如果在启动 Milvus 实例后看到类似下面的日志，就说明已成功启用 NATS 作为消息队列。</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">为 Milvus 配置 NATS<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS 自定义选项包括指定监听端口、JetStream 存储目录、最大有效载荷大小和初始化超时。微调这些设置可确保最佳性能和可靠性。</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>注意</strong></p>
<ul>
<li><p>必须为 NATS 服务器监听指定<code translate="no">server.port</code> 。如果存在端口冲突，Milvus 将无法启动。将<code translate="no">server.port=-1</code> 设置为随机选择端口。</p></li>
<li><p><code translate="no">storeDir</code> 指定 JetStream 存储目录。建议将目录存储在高性能固态硬盘 (SSD) 中，以提高 Milvus 的读/写吞吐量。</p></li>
<li><p><code translate="no">maxFileStore</code> 设置 JetStream 存储容量的上限。超过此上限将阻止继续写入数据。</p></li>
<li><p><code translate="no">maxPayload</code> 限制单条信息的大小。应保持在 5MB 以上，以避免任何写入拒绝。</p></li>
<li><p><code translate="no">initializeTimeout</code>控制 NATS 服务器启动超时。</p></li>
<li><p><code translate="no">monitor</code> 配置 NATS 的独立日志。</p></li>
<li><p><code translate="no">retention</code> 控制 NATS 报文的保留机制。</p></li>
</ul>
<p>更多信息，请参阅<a href="https://docs.nats.io/running-a-nats-service/configuration">NATS 官方文档</a>。</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">从RocksMQ迁移到NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>从 RocksMQ 迁移到 NATS 是一个无缝的过程，涉及到停止写操作、刷新数据、修改配置和通过 Milvus Operator 日志验证迁移等步骤。</p>
<ol>
<li><p>在开始迁移之前，先停止 Milvus 中的所有写操作。</p></li>
<li><p>在 Milvus 中执行<code translate="no">FlushALL</code> 操作符并等待其完成。此步骤可确保所有待处理数据都已刷新，系统已为关闭做好准备。</p></li>
<li><p>修改 Milvus 配置文件，在<code translate="no">natsmq</code> 部分下设置<code translate="no">mq.type=natsmq</code> 并调整相关选项。</p></li>
<li><p>启动 Milvus 2.3。</p></li>
<li><p>备份并清理存储在<code translate="no">rocksmq.path</code> 目录中的原始数据。可选</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS 与 RocksMQ：性能对决<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">发布/子性能测试</h3><ul>
<li><p><strong>测试平台</strong>M1 Pro 芯片/内存：16GB</p></li>
<li><p><strong>测试场景</strong>向一个主题重复订阅和发布随机数据包，直到收到最后一个发布结果。</p></li>
<li><p><strong>测试结果</strong></p>
<ul>
<li><p>对于较小的数据包（&lt; 64kb），RocksMQ 在内存、CPU 和响应速度方面都优于 NATS。</p></li>
<li><p>对于较大的数据包（&gt; 64kb），NATS 的响应速度要比 RocksMQ 快得多。</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>测试类型</th><th>MQ</th><th>操作次数</th><th>每次操作成本</th><th>内存成本</th><th>CPU 总时间</th><th>存储成本</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 发布/分</td><td>NATS</td><td>50</td><td>1.650328186 秒/操作</td><td>4.29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 发布/分</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1.18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 发布/分</td><td>NATS</td><td>50</td><td>2.248722593 S/OP</td><td>2.60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 发布/分</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614.9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 发布/分</td><td>国家统计局</td><td>50</td><td>2.133345262 S/OP</td><td>3.29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 发布/分</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331.2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 发布/分</td><td>NATS</td><td>50</td><td>2.629391004 S/OP</td><td>635.1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 发布/子</td><td>RocksMQ</td><td>50</td><td>0.897638581 s/op</td><td>232.3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>表 1：Pub/Sub 性能测试结果</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Milvus 集成测试</h3><p><strong>数据大小：</strong>100M</p>
<p><strong>结果</strong>在使用 1 亿向量数据集进行的大量测试中，NATS 展示了较低的向量搜索和查询延迟。</p>
<table>
<thead>
<tr><th>指标</th><th>RocksMQ (毫秒)</th><th>NATS （毫秒）</th></tr>
</thead>
<tbody>
<tr><td>向量搜索平均延迟</td><td>23.55</td><td>20.17</td></tr>
<tr><td>每秒向量搜索请求数 (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>平均查询延迟</td><td>7.2</td><td>6.74</td></tr>
<tr><td>每秒查询请求 (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>表 2：Milvus 与 100M 数据集的集成测试结果</p>
<p><strong>数据集：&lt;100M</strong></p>
<p><strong>结果</strong>对于小于 100M 的数据集，NATS 和 RocksMQ 显示出相似的性能。</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">结论用 NATS 消息传递增强 Milvus 的能力<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中集成 NATS 标志着在数据处理方面取得了重大进展。无论是深入研究实时分析、机器学习应用，还是任何数据密集型风险投资，NATS 都能为您的项目带来效率、可靠性和速度。随着数据领域的不断发展，在 Milvus 中拥有像 NATS 这样强大的消息传递系统，可以确保无缝、可靠和高性能的数据通信。</p>
