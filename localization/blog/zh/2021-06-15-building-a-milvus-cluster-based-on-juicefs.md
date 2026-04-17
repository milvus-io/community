---
id: building-a-milvus-cluster-based-on-juicefs.md
title: 什么是 JuiceFS？
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: 了解如何基于 JuiceFS（专为云原生环境设计的共享文件系统）构建 Milvus 集群。
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>基于 JuiceFS 构建 Milvus 集群</custom-h1><p>开源社区之间的合作是一件神奇的事情。充满热情、智慧和创造力的志愿者们不仅让开源解决方案不断创新，他们还努力将不同的工具以有趣而有用的方式结合在一起。<a href="https://milvus.io/">Milvus</a> 是世界上最流行的向量数据库，而<a href="https://github.com/juicedata/juicefs">JuiceFS</a> 则是专为云原生环境设计的共享文件系统，它们在各自的开源社区中本着这种精神联合在一起。本文将解释什么是 JuiceFS、如何基于 JuiceFS 共享文件存储构建 Milvus 集群，以及用户使用该解决方案可以期待的性能。</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>什么是 JuiceFS？</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS 是一个高性能、开源的分布式 POSIX 文件系统，可以构建在 Redis 和 S3 的基础上。它专为云原生环境设计，支持管理、分析、归档和备份任何类型的数据。JuiceFS 常用于解决大数据难题、构建人工智能（AI）应用以及收集日志。该系统还支持多个客户端之间的数据共享，并可直接用作 Milvus 中的共享存储。</p>
<p>数据及其相应的元数据分别持久化到对象存储和<a href="https://redis.io/">Redis</a>后，JuiceFS 就成了一个无状态中间件。通过标准的文件系统接口，不同的应用程序可以无缝对接，从而实现数据共享。JuiceFS 依靠开源内存数据存储 Redis 来存储元数据。之所以使用 Redis，是因为它能保证原子性并提供高性能的元数据操作。所有数据都通过 JuiceFS 客户端存储在对象存储中。架构图如下：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>基于 JuiceFS 构建 Milvus 集群</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>使用 JuiceFS 构建的 Milvus 集群（见下面的架构图）通过使用集群分片中间件 Mishards 对上游请求进行拆分，从而将请求级联到其子模块。插入数据时，Mishards 将上游请求分配给 Milvus 写节点，后者将新插入的数据存储在 JuiceFS 中。读取数据时，Mishards 通过 Milvus 读节点将数据从 JuiceFS 加载到内存中进行处理，然后从上游的子服务收集并返回结果。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>Milvus-cluster-built-with-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>步骤 1：启动 MySQL 服务</strong></h3><p>在群集中的<strong>任意</strong>节点上启动 MySQL 服务。有关详细信息，请参阅<a href="https://milvus.io/docs/v1.1.0/data_manage.md">使用 MySQL 管理元数据</a>。</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>第 2 步：创建 JuiceFS 文件系统</strong></h3><p>为演示目的，使用预编译的二进制 JuiceFS 程序。为你的系统下载正确的<a href="https://github.com/juicedata/juicefs/releases">安装包</a>，并按照《JuiceFS<a href="https://github.com/juicedata/juicefs-quickstart">快速入门指南》</a>了解详细的安装说明。要创建 JuiceFS 文件系统，首先要为元数据存储设置一个 Redis 数据库。对于公共云部署，建议将 Redis 服务托管在与应用程序相同的云上。此外，为 JuiceFS 设置对象存储。本例中使用的是 Azure Blob Storage，但 JuiceFS 支持几乎所有对象服务。请选择最适合您的应用场景需求的对象存储服务。</p>
<p>配置好 Redis 服务和对象存储后，格式化一个新文件系统并将 JuiceFS 挂载到本地目录：</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>如果 Redis 服务器不在本地运行，请将 localhost 替换为以下地址：<code translate="no">redis://&lt;user:password&gt;@host:6379/1</code> 。</p>
</blockquote>
<p>安装成功后，JuiceFS 会返回共享存储页面<strong>/root/jfs</strong>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>安装成功.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>第 3 步：启动 Milvus</strong></h3><p>集群中的所有节点都应安装 Milvus，每个 Milvus 节点都应配置读或写权限。只有一个 Milvus 节点可以配置为写节点，其余的必须是读节点。首先，在 Milvus 系统配置文件<strong>server_config.yaml</strong> 中设置<code translate="no">cluster</code> 和<code translate="no">general</code> 部分的参数：</p>
<p><strong>部分</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>参数</strong></th><th style="text-align:left"><strong>说明</strong></th><th style="text-align:left"><strong>配置</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">是否启用群集模式</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Milvus 部署角色</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>部分</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>安装过程中，配置的 JuiceFS 共享存储路径设置为<strong>/root/jfs/milvus/db</strong>。</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>安装完成后，启动 Milvus 并确认其已正常启动。 最后，在群集中的<strong>任意</strong>节点上启动 Mishards 服务。下图显示了 Mishards 的成功启动。有关详细信息，请参阅 GitHub<a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">教程</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>性能基准</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>共享存储解决方案通常由网络附加存储（NAS）系统实现。常用的 NAS 系统类型包括网络文件系统（NFS）和服务器消息块（SMB）。公共云平台通常提供与这些协议兼容的托管存储服务，如亚马逊弹性文件系统（EFS）。</p>
<p>与传统的 NAS 系统不同，JuiceFS 是基于用户空间文件系统（FUSE）实现的，所有数据读写都直接在应用程序端进行，从而进一步减少了访问延迟。JuiceFS 还有其他 NAS 系统所不具备的独特功能，如数据压缩和缓存。</p>
<p>基准测试表明，JuiceFS 比 EFS 具有更大的优势。在元数据基准测试中（图 1），JuiceFS 的每秒 I/O 操作符（IOPS）比 EFS 高出 10 倍。此外，I/O 吞吐量基准测试（图 2）显示，JuiceFS 在单任务和多任务情况下的性能均优于 EFS。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>性能基准-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>性能基准-2.png</span> </span></p>
<p>此外，基准测试表明，基于 JuiceFS 的 Milvus 集群的首次查询检索时间（或将新插入的数据从磁盘加载到内存的时间）平均仅为 0.032 秒，这表明数据几乎是瞬间从磁盘加载到内存的。在这项测试中，首次查询检索时间是使用 100 万行 128 维向量数据，以 100k 为一批，每隔 1 到 8 秒插入一次来测量的。</p>
<p>JuiceFS 是一个稳定可靠的共享文件存储系统，基于 JuiceFS 构建的 Milvus 集群既能提供高性能，又能提供灵活的存储容量。</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>了解有关 Milvus 的更多信息</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一款强大的工具，能够为大量人工智能和向量相似性搜索应用提供动力。要了解有关该项目的更多信息，请查看以下资源：</p>
<ul>
<li>阅读我们的<a href="https://zilliz.com/blog">博客</a>。</li>
<li>在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上与我们的开源社区互动。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用或贡献世界上最流行的向量数据库。</li>
<li>使用我们新的<a href="https://github.com/milvus-io/bootcamp">Bootcamp</a> 快速测试和部署人工智能应用。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>writer bio-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>writer bio-jingjing jia.png</span> </span></p>
