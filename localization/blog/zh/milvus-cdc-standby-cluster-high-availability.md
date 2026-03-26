---
id: milvus-cdc-standby-cluster-high-availability.md
title: 向量数据库高可用性：如何利用 CDC 构建 Milvus 备用集群
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: 了解如何使用 Milvus CDC 构建高可用性向量数据库。分步指导主备复制、故障转移和生产灾难恢复。
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>每个生产型数据库都需要一个计划，以防出现问题。几十年来，关系型数据库已经拥有了 WAL 出货、binlog 复制和自动故障转移功能。但<a href="https://zilliz.com/learn/what-is-a-vector-database">向量数据库</a>--尽管已成为人工智能应用的核心基础架构--在这方面仍在迎头赶上。大多数数据库最多只能提供节点级冗余。如果整个集群宕机，你就得从备份中恢复并从头开始重建<a href="https://zilliz.com/learn/vector-index">向量索引</a>--这个过程可能需要数小时，计算成本高达数千美元，因为通过 ML 管道重新生成<a href="https://zilliz.com/glossary/vector-embeddings">Embeddings</a>的成本并不低。</p>
<p><a href="https://milvus.io/">Milvus</a>采用了不同的方法。它提供分层高可用性：节点级复制用于集群内的快速故障切换，基于 CDC 的复制用于集群级和跨区域保护，备份用于安全网恢复。这种分层模型是传统数据库的标准做法--Milvus 是第一个将其引入向量工作负载的主要向量数据库。</p>
<p>本指南涵盖两方面内容：向量数据库可用的高可用性策略（以便您评估 "生产就绪 "的实际含义），以及从头开始设置 Milvus CDC 主备复制的实践教程。</p>
<blockquote>
<p>本文是系列文章的<strong>第一部分</strong>：</p>
<ul>
<li><strong>第 1 部分</strong>（本文）：在新集群上设置主备复制</li>
<li><strong>第 2 部分</strong>：使用<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a>将 CDC 添加到已有数据的现有集群中</li>
<li><strong>第 3 部分</strong>：管理故障转移--当主服务器宕机时提升备用服务器</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">为什么向量数据库的高可用性更重要？<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>当传统的 SQL 数据库宕机时，你会失去对结构化记录的访问--但数据本身通常可以从上游来源重新导入。当向量数据库宕机时，从根本上说，恢复难度更大。</p>
<p>向量数据库存储的是<a href="https://zilliz.com/glossary/vector-embeddings">嵌入（Embeddings</a>）--由 ML 模型生成的密集数字表示。重建矢量数据库意味着通过嵌入管道重新运行整个数据集：加载原始文档、对文档进行分块、调用<a href="https://zilliz.com/ai-models">嵌入模型</a>并重新为所有内容建立索引。对于一个拥有数亿向量的数据集来说，这可能需要花费数天时间和数千美元的 GPU 计算成本。</p>
<p>与此同时，依赖<a href="https://zilliz.com/learn/what-is-vector-search">向量搜索的</a>系统往往处于关键路径上：</p>
<ul>
<li>为面向客户的聊天机器人和搜索提供动力的<strong><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>管道</strong>--如果向量数据库瘫痪，检索就会停止，人工智能就会返回通用或幻觉答案。</li>
<li>实时提供产品或内容建议的<strong>推荐引擎</strong>--宕机意味着错过收入。</li>
<li>依靠<a href="https://zilliz.com/glossary/similarity-search">相似性搜索</a>来标记可疑活动的<strong>欺诈检测和异常监控</strong>系统--覆盖范围的空白会造成漏洞。</li>
<li>使用向量存储进行记忆和工具检索的<strong>自主代理系统</strong>--没有知识库，代理就会失败或循环。</li>
</ul>
<p>如果您正在为这些使用案例中的任何一种评估向量数据库，那么高可用性就不是一个可以稍后检查的好功能。高可用性应该是您首先考虑的功能之一。</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">向量数据库的生产级高可用性是什么样的？<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>并非所有的高可用性都是一样的。仅能处理单个集群内节点故障的向量数据库并不具备生产系统所需的 "高可用性"。真正的高可用性需要涵盖三个层次：</p>
<table>
<thead>
<tr><th>层</th><th>保护对象</th><th>如何工作</th><th>恢复时间</th><th>数据丢失</th></tr>
</thead>
<tbody>
<tr><td><strong>节点级</strong>（多副本）</td><td>单个节点崩溃、硬件故障、OOM kill、AZ 故障</td><td>在多个节点上复制相同的<a href="https://milvus.io/docs/glossary.md">数据段</a>；其他节点吸收负载</td><td>瞬间</td><td>零</td></tr>
<tr><td><strong>群集级</strong>（CDC 复制）</td><td>整个群集宕机 - K8s 推出失败、命名空间删除、存储损坏</td><td>通过<a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log</a> 将每次写入数据流传输到备用群集；备用群集总是落后几秒</td><td>分钟</td><td>秒</td></tr>
<tr><td><strong>安全网</strong>（定期备份）</td><td>灾难性数据损坏、勒索软件、通过复制传播的人为错误</td><td>定期拍摄快照并存储在单独位置</td><td>小时</td><td>小时（自上次备份起）</td></tr>
</tbody>
</table>
<p>这些层是互补的，而不是替代的。生产部署应将它们堆叠在一起：</p>
<ol>
<li><strong>首先</strong>是<strong><a href="https://milvus.io/docs/replica.md">多重复制</a></strong>--处理最常见的故障（节点崩溃、AZ 故障），实现零停机时间和零数据丢失。</li>
<li><strong>其次是<a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a></strong>- 防止多重复制无法解决的故障：集群范围内的中断、灾难性的人为失误。备用群集处于不同的故障域。</li>
<li><strong>始终<a href="https://milvus.io/docs/milvus_backup_overview.md">定期备份</a></strong>- 您最后的安全网。如果损坏的数据在你发现之前复制到备用集群，即使 CDC 也救不了你。</li>
</ol>
<p>在评估向量数据库时，请问：该产品实际支持这三层中的哪一层？目前大多数向量数据库只提供第一层。Milvus 支持所有三个层次，CDC 是内置功能，而不是第三方附加功能。</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Milvus CDC 是什么，如何工作？<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC（变更数据捕获）</strong>是一种内置的复制功能，它读取主集群的<a href="https://milvus.io/docs/four_layers.md">前写日志（WAL）</a>，并将每个条目流式传输到单独的备用集群。备用群集对条目进行复制，并最终获得相同的数据，但通常比主群集晚几秒钟。</p>
<p>这种模式在数据库世界中早已确立。MySQL 有 binlog 复制。PostgreSQL 有 WAL 出货。MongoDB 有基于 oplog 的复制。这些都是行之有效的技术，几十年来，关系数据库和文档数据库一直在生产中运行。Milvus 为向量工作负载带来了同样的方法--它是第一个将基于 WAL 的复制作为内置功能提供的主要<a href="https://zilliz.com/learn/what-is-a-vector-database">向量数据库</a>。</p>
<p>CDC 有三个特性非常适合灾难恢复：</p>
<ul>
<li><strong>低延迟同步。</strong>CDC 在操作发生时进行流式操作，而不是按计划分批进行。在正常情况下，备用数据比主数据晚几秒钟。</li>
<li><strong>有序重放。</strong>操作符按照写入的相同顺序到达备用机。数据无需调节即可保持一致。</li>
<li><strong>检查点恢复。</strong>如果 CDC 进程崩溃或网络中断，它会从中断处恢复。不会跳过或重复数据。</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">CDC 架构如何工作？</h3><p>CDC 部署由三个部分组成：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>CDC 架构显示带有流节点和 CDC 节点的源群集，源群集消耗 WAL，将数据复制到目标群集的代理层，代理层将 DDL/DCL/DML 操作转发给流节点并追加到 WAL。</span> </span></p>
<table>
<thead>
<tr><th>组件</th><th>角色</th></tr>
</thead>
<tbody>
<tr><td><strong>主群集</strong></td><td><a href="https://milvus.io/docs/architecture_overview.md">Milvus</a> 生产<a href="https://milvus.io/docs/architecture_overview.md">实例</a>。所有读写都在这里进行。每次写入都会记录在 WAL 中。</td></tr>
<tr><td><strong>CDC 节点</strong></td><td>主节点旁的后台进程。读取 WAL 条目并将其转发给备用节点。独立于读/写路径运行，不会影响查询或插入性能。</td></tr>
<tr><td><strong>备用群集</strong></td><td>一个独立的 Milvus 实例，用于重播转发的 WAL 条目。持有与主服务器相同的数据，但比主服务器晚几秒。可以提供读取查询，但不接受写入。</td></tr>
</tbody>
</table>
<p>流程：主节点写入 → CDC 节点复制到备用节点 → 备用节点复制。备用节点的写入路径不会有任何其他内容。如果主服务器宕机，备用服务器已经拥有几乎所有数据，可以进行升级。</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">教程：设置 Milvus CDC 备用集群<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>本文其余部分为实践演练。到最后，你将拥有两个正在运行的 Milvus 集群，并在它们之间进行实时复制。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>开始之前：</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a>v2.6.6 或更高版本。</strong>CDC 需要此版本。建议使用最新的 2.6.x 补丁。</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus 操作符</a>v1.3.4 或更高版本。</strong>本指南使用操作符在 Kubernetes 上进行群集管理。</li>
<li><strong>运行中的 Kubernetes 集群</strong>，已配置<code translate="no">kubectl</code> 和<code translate="no">helm</code> 。</li>
<li>复制配置步骤<strong>使用 Python 和<a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong>。</li>
</ul>
<p>当前版本的两个限制：</p>
<table>
<thead>
<tr><th>限制</th><th>详细信息</th></tr>
</thead>
<tbody>
<tr><td>单个 CDC 复制</td><td>每个群集只有一个 CDC 副本。分布式 CDC 计划在未来版本中推出。</td></tr>
<tr><td>不支持批量插入</td><td>启用 CDC 时不支持<a href="https://milvus.io/docs/import-data.md">批量插入</a>。也计划在未来版本中推出。</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">步骤 1：升级 Milvus 操作符</h3><p>将 Milvus 操作符升级到 v1.3.4 或更高版本：</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>验证操作符 pod 正在运行：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">第 2 步：部署主群集</h3><p>为主（源）群集创建 YAML 文件。<code translate="no">cdc</code> 下的<code translate="no">components</code> 部分告诉操作符在群集旁边部署 CDC 节点：</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">msgStreamType: woodpecker</code> 设置使用 Milvus 内置的<a href="https://milvus.io/docs/four_layers.md">Woodpecker WAL</a>，而不是 Kafka 或 Pulsar 等外部消息队列。Woodpecker 是 Milvus 2.6 中引入的云原生写日志，无需外部消息传递基础设施。</p>
<p>应用配置：</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>等待所有 pod 达到运行状态。确认 CDC pod 已启动：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">步骤 3：部署备用群集</h3><p>备用（目标）群集使用相同的 Milvus 版本，但不包括 CDC 组件 - 它只接收复制的数据：</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>应用：</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>验证所有 pod 正在运行：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">步骤 4：配置复制关系</h3><p>两个群集都运行后，使用 Python 和<a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a> 配置复制拓扑。</p>
<p>定义群集连接详情和物理通道 (pchannel) 名称：</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>构建复制配置：</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>应用到两个群集：</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>一旦复制成功，主集群上的增量更改将开始自动复制到备用集群。</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">第 5 步：验证复制是否有效</h3><ol>
<li>连接到主用<a href="https://milvus.io/docs/manage-collections.md">集群</a>并<a href="https://milvus.io/docs/manage-collections.md">创建一个 Collection</a>，<a href="https://milvus.io/docs/insert-update-delete.md">插入一些向量</a>并<a href="https://milvus.io/docs/load-and-release.md">加载它</a></li>
<li>在主机上运行搜索以确认数据是否存在</li>
<li>连接到备用服务器并运行相同的搜索</li>
<li>如果备用机返回相同的结果，说明复制正在运行</li>
</ol>
<p>如果你需要参考，<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入门</a>包括 Collections 创建、插入和搜索。</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">在生产中运行 CDC<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>设置 CDC 是最简单的部分。要长期保持其可靠性，需要注意几个操作符。</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">监控复制滞后</h3><p>备用数据总是略微落后于主数据，这是异步复制的固有特性。在正常负载情况下，延迟时间为几秒钟。但写入峰值、网络拥塞或备用资源压力都会导致延迟增加。</p>
<p>将滞后作为一个指标进行跟踪，并发出警报。滞后增长而不恢复通常意味着 CDC 节点跟不上写吞吐量。首先检查群集之间的网络带宽，然后考虑备用节点是否需要更多资源。</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">使用备用节点进行读取扩展</h3><p>备用节点并不只是在灾难发生前闲置的冷备份。它可以在复制激活时接受<a href="https://milvus.io/docs/single-vector-search.md">搜索和查询请求</a>，只有写入会被阻止。这开辟了实际用途：</p>
<ul>
<li>将批量<a href="https://zilliz.com/glossary/similarity-search">相似性搜索</a>或分析工作负载路由至备用机</li>
<li>在高峰时段分流读取流量，减轻主用压力</li>
<li>在不影响生产写延迟的情况下运行昂贵的查询（大型 top-K、跨大型 Collections 的过滤搜索</li>
</ul>
<p>这就将灾难恢复基础设施变成了性能资产。即使在没有任何故障的情况下，备用机也能获得收益。</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">正确确定备用服务器的大小</h3><p>备用服务器会重复主服务器的每次写入，因此需要类似的计算和内存资源。如果还需要向其路由读取，则需要考虑额外的负载。存储需求是相同的，因为它保存相同的数据。</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">在需要之前测试故障转移</h3><p>不要等到真正发生故障时才发现自己的故障转移流程无法正常运行。定期进行演练：</p>
<ol>
<li>停止向主设备写入数据</li>
<li>等待备用机跟上（滞后 → 0）</li>
<li>提升备用机</li>
<li>验证查询是否返回预期结果</li>
<li>逆转流程</li>
</ol>
<p>测量每个步骤所需的时间并记录下来。目标是使故障切换成为一个具有已知时间安排的例行程序，而不是在凌晨 3 点的紧张即兴发挥。本系列第三部分将详细介绍故障切换流程。</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">不想自己管理 CDC？Zilliz Cloud 可以胜任<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>设置和操作Milvus CDC复制功能强大，但也会带来操作开销：你需要管理两个集群、监控复制健康状况、处理故障转移运行书，并跨区域维护基础设施。对于希望获得生产级 HA 而又没有操作负担的团队，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（托管 Milvus Operator）开箱即提供了这一功能。</p>
<p><strong>全局集群</strong>是 Zilliz Cloud 的主要功能。它可以让你将跨越北美、欧洲、亚太等多个地区的 Milvus 部署作为一个逻辑集群来运行。在引擎盖下，它使用与本文所述相同的 CDC/WAL 复制技术，但完全受管理：</p>
<table>
<thead>
<tr><th>功能</th><th>自主管理 CDC（本文）</th><th>Zilliz Cloud 全球集群</th></tr>
</thead>
<tbody>
<tr><td><strong>复制</strong></td><td>由您配置和监控</td><td>自动、异步 CDC 管道</td></tr>
<tr><td><strong>故障转移</strong></td><td>手动运行手册</td><td>自动化 - 无需更改代码，无需更新连接字符串</td></tr>
<tr><td><strong>自愈</strong></td><td>重新配置故障群集</td><td>自动：检测陈旧状态、重置并重建为新的辅助集群</td></tr>
<tr><td><strong>跨区域</strong></td><td>部署和管理两个群集</td><td>内置多区域，具有本地读取访问权限</td></tr>
<tr><td><strong>RPO</strong></td><td>秒（取决于您的监控）</td><td>秒（计划外）/零（计划内切换）</td></tr>
<tr><td><strong>RTO</strong></td><td>分钟（取决于您的运行手册）</td><td>分钟（自动）</td></tr>
</tbody>
</table>
<p>除全局群集外，关键业务计划还包括其他灾难恢复功能：</p>
<ul>
<li><strong>时间点恢复 (PITR)</strong>- 将 Collections 回滚到保留窗口内的任何时刻，对于从复制到备用的意外删除或数据损坏中恢复非常有用。</li>
<li><strong>跨区域备份</strong>--自动、持续地将备份复制到目标区域。恢复到新群集只需几分钟。</li>
<li><strong>99.99% 的正常运行时间服务级别协议（SLA）</strong>--由具有多个副本的多区域部署提供支持。</li>
</ul>
<p>如果您正在生产中运行向量搜索，并且需要进行灾难恢复，那么Zilliz Cloud和自我管理的Milvus方法值得您一试。有关详细信息，请<a href="https://zilliz.com/contact-sales">联系 Zilliz 团队</a>。</p>
<h2 id="Whats-Next" class="common-anchor-header">下一步<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>本文介绍了向量数据库的 HA 情况，并介绍了从头开始构建主备对的方法。下一篇</p>
<ul>
<li><strong>第二部分</strong>：将 CDC 添加到已有数据的 Milvus 集群，在启用复制之前使用<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus 备份</a>为备用提供种子数据</li>
<li><strong>第 3 部分</strong>：管理故障转移--提升备用、重定向流量和恢复原始主服务器</li>
</ul>
<p>敬请关注。</p>
<hr>
<p>如果您正在生产中运行<a href="https://milvus.io/">Milvus</a>并考虑灾难恢复问题，我们很乐意为您提供帮助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，提问、分享您的 HA 架构，并向其他大规模运行 Milvus 的团队学习。</li>
<li><a href="https://milvus.io/office-hours">预约 20 分钟的免费 Milvus Office Hours 会议</a>，了解您的灾难恢复设置--无论是 CDC 配置、故障转移规划还是多区域部署。</li>
<li>如果您想跳过基础架构设置，直接进行生产就绪 HA，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（Milvus 托管）通过其全球集群功能提供跨区域高可用性，无需手动设置 CDC。</li>
</ul>
<hr>
<p>团队开始设置向量数据库高可用性时会遇到一些问题：</p>
<p><strong>问：CDC 会减慢主集群的运行速度吗？</strong></p>
<p>不会。CDC 节点异步读取 WAL 日志，与读/写路径无关。它不会与查询或插入竞争主集群上的资源。启用 CDC 后，不会出现性能差异。</p>
<p><strong>问：CDC 能否复制启用前的数据？</strong></p>
<p>不能 - CDC 只能捕获启用后的更改。要将现有数据引入备用机，首先使用<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a>为备用机提供种子，然后启用 CDC 进行持续复制。本系列第二部分将介绍此工作流程。</p>
<p><strong>问：如果我已经启用了多重复制，还需要 CDC 吗？</strong></p>
<p>它们可以防止不同的故障模式。<a href="https://milvus.io/docs/replica.md">多重复制</a>在一个群集内的不同节点之间保留相同<a href="https://milvus.io/docs/glossary.md">网段</a>的副本--这对节点故障很有帮助，但在整个群集消失（部署不当、AZ 中断、命名空间删除）时则毫无用处。CDC 在不同的故障域中保留一个单独的集群，并提供近乎实时的数据。对于开发环境之外的任何情况，您都需要这两种集群。</p>
<p><strong>问：Milvus CDC 与其他向量数据库的复制相比如何？</strong></p>
<p>目前大多数向量数据库都提供节点级冗余（相当于多重复制），但缺乏集群级复制。Milvus 是目前唯一一个内置基于 WAL 的 CDC 复制的主要向量数据库--这与 PostgreSQL 和 MySQL 等关系数据库几十年来一直使用的成熟模式相同。如果需要进行跨集群或跨区域故障切换，这将是一个非常有意义的差异化评估指标。</p>
