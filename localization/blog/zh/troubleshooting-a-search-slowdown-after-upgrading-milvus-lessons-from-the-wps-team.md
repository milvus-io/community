---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: 升级 Milvus 后搜索速度变慢的故障排除：WPS 团队的经验教训
author: the WPS engineering team
date: 2026-3-18
cover: assets.zilliz.com/Version_A_Warm_Background_20b93359df.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus
meta_keywords: 'Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting'
meta_title: |
  Troubleshooting a Search Slowdown After Upgrading Milvus
desc: >-
  Milvus 从 2.2 升级到 2.5 后，WPS 团队遇到了 3-5 倍的搜索延迟倒退。原因是：Milvus-backup
  的一个还原标志导致了片段的碎片化。
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>本帖由金山办公软件公司的 WPS 工程团队撰写，他们在推荐系统中使用了 Milvus。在他们从 Milvus 2.2.16 升级到 2.5.16 的过程中，搜索延迟增加了 3 到 5 倍。这篇文章介绍了他们是如何调查并解决这个问题的，可能对社区中计划进行类似升级的其他用户有所帮助。</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">我们升级 Milvus 的原因<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>我们是 WPS 工程团队的一员，负责开发生产力软件，我们在在线推荐系统中使用 Milvus 作为实时相似性搜索背后的向量搜索引擎。我们的生产集群存储了数千万个向量，平均维度为 768。数据由 16 个查询节点提供，每个 pod 的配置限制为 16 个 CPU 内核和 48 GB 内存。</p>
<p>在运行 Milvus 2.2.16 时，我们遇到了一个已经影响到业务的严重稳定性问题。在高查询并发情况下，<code translate="no">planparserv2.HandleCompare</code> 可能会导致空指针异常，从而导致代理组件崩溃并频繁重启。这个错误在高并发场景下非常容易触发，直接影响了我们在线推荐服务的可用性。</p>
<p>以下是实际的代理错误日志和堆栈跟踪：</p>
<pre><code translate="no">[<span class="hljs-meta">2025/12/23 10:43:13.581 +00:00</span>] [ERROR] [concurrency/pool_option.go:<span class="hljs-number">53</span>] [<span class="hljs-string">&quot;Conc pool panicked&quot;</span>]
[<span class="hljs-meta">panic=<span class="hljs-string">&quot;runtime error: invalid memory address or nil pointer dereference&quot;</span></span>]
[<span class="hljs-meta">stack=<span class="hljs-string">&quot;...
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345
...
github.com/milvus-io/milvus/internal/proxy.(*queryTask).PreExecute
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_query.go:271
github.com/milvus-io/milvus/internal/proxy.(*taskScheduler).processTask
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_scheduler.go:455
...&quot;</span></span>]

panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference [recovered]
panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference
[<span class="hljs-meta">signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x2f1a02a</span>]
  
goroutine <span class="hljs-number">989</span> [running]:
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.HandleCompare(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/utils.go:<span class="hljs-number">331</span> +<span class="hljs-number">0x2a</span>
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.(*ParserVisitor).VisitEquality(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/parser_visitor.go:<span class="hljs-number">345</span> +<span class="hljs-number">0x7e5</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>堆栈跟踪显示的内容</strong>：恐慌发生在 Proxy 的查询预处理过程中，在<code translate="no">queryTask.PreExecute</code> 内。调用路径为</p>
<p><code translate="no">taskScheduler.processTask</code> →<code translate="no">queryTask.PreExecute</code> →<code translate="no">planparserv2.CreateRetrievePlan</code> →<code translate="no">planparserv2.HandleCompare</code></p>
<p>当<code translate="no">HandleCompare</code> 尝试访问地址为<code translate="no">0x8</code> 的无效内存时发生了崩溃，触发了 SIGSEGV 并导致代理进程崩溃。</p>
<p><strong>为了彻底消除这一稳定性风险，我们决定将集群从 Milvus 2.2.16 升级到 2.5.16。</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">升级前使用 milvus-backup 备份数据<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>在接触生产集群之前，我们使用官方的<a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>工具备份了所有数据。它支持同一集群内、跨集群和跨 Milvus 版本的备份和还原。</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">检查版本兼容性</h3><p>milvus-backup 有两个<a href="https://milvus.io/docs/milvus_backup_overview.md">跨版本还原</a>的版本规则：</p>
<ol>
<li><p><strong>目标群集必须运行相同或更新的 Milvus 版本。</strong>2.2 版的备份可以加载到 2.5 版，反之则不行。</p></li>
<li><p><strong>目标必须至少是 Milvus 2.4。</strong>不支持较旧的还原目标。</p></li>
</ol>
<p>我们的路径（从 2.2.16 备份，加载到 2.5.16）符合这两条规则。</p>
<table>
<thead>
<tr><th>备份自 ↓ → 还原至</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Milvus 备份如何工作</h3><p>Milvus 备份便于跨 Milvus 实例备份和恢复元数据、段和数据。它提供北向接口，如 CLI、API 和基于 gRPC 的 Go 模块，以便灵活操作备份和还原过程。</p>
<p>Milvus Backup 从源 Milvus 实例读取 Collections 元数据和片段，创建备份。然后，它会从源 Milvus 实例的根路径复制 Collections 数据，并将其保存到备份根路径。</p>
<p>要从备份中还原，Milvus Backup 会根据备份中的 Collections 元数据和段信息，在目标 Milvus 实例中创建一个新的 Collections。然后将备份数据从备份根路径复制到目标实例的根路径。</p>
<h3 id="Running-the-Backup" class="common-anchor-header">运行备份</h3><p>我们准备了一个专用配置文件<code translate="no">configs/backup.yaml</code> 。主要字段如下所示，敏感值已删除：</p>
<pre><code translate="no">milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Source Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Source Milvus port</span>
  user: root  <span class="hljs-comment"># Source Milvus username (must have backup permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Source Milvus user password</span>

  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Source Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Source <span class="hljs-built_in">object</span> storage AK&gt;  
  secretAccessKey: &lt;Source <span class="hljs-built_in">object</span> storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Source object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the source object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>然后运行此命令：</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> 支持<strong>热备份</strong>，因此通常对在线流量影响不大。在非高峰时段运行更安全，可避免资源争用。</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">验证备份</h3><p>备份完成后，我们验证了备份的完整性和可用性。我们主要检查备份中的 Collections 和网段数量是否与源群集中的相匹配。</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>它们匹配，因此我们继续进行升级。</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">使用 Helm 图表升级<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>由于跳转了三个主要版本（2.2 → 2.5）和数千万向量，就地升级风险太大。因此，我们建立了一个新的集群，并将数据迁移到其中。旧群集保持在线，以便进行回滚。</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">部署新集群</h3><p>我们使用 Helm 部署了新的 Milvus 2.5.16 集群：</p>
<pre><code translate="no"><span class="hljs-comment"># Add the Milvus Helm repository</span>
: helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update  
<span class="hljs-comment"># Check the Helm chart version corresponding to the target Milvus version</span>
: helm search repo milvus/milvus -l | grep <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>
milvus/milvus        <span class="hljs-number">4.2</span><span class="hljs-number">.58</span>               <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>                    Milvus <span class="hljs-keyword">is</span> an <span class="hljs-built_in">open</span>-source vector database built ...
  
<span class="hljs-comment"># Deploy the new version cluster (with mmap disabled)</span>
helm install milvus-v25 milvus/milvus \
  --namespace milvus-new \
  --values values-v25.yaml \
  --version <span class="hljs-number">4.2</span><span class="hljs-number">.58</span> \
  --wait
<button class="copy-code-btn"></button></code></pre>
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">关键配置更改 (<code translate="no">values-v25.yaml</code>)</h3><p>为了公平地进行性能比较，我们尽可能保持新集群与旧集群的相似性。我们只更改了几个与该工作负载相关的设置：</p>
<ul>
<li><p><strong>禁用 Mmap</strong>(<code translate="no">mmap.enabled: false</code>)：我们的推荐工作负载对延迟很敏感。如果启用 Mmap，一些数据可能会在需要时从磁盘读取，这会增加磁盘 I/O 延迟并导致延迟峰值。我们将其关闭，这样数据就会完全保留在内存中，查询延迟也会更稳定。</p></li>
<li><p><strong>查询节点数：</strong>保持<strong>16 个</strong>，与旧集群相同</p></li>
<li><p><strong>资源限制：</strong>每个 Pod 仍有<strong>16 个 CPU 内核</strong>，与旧集群相同</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">主要版本升级提示：</h3><ul>
<li><p><strong>构建新的群集，而不是就地升级。</strong>这样可以避免元数据兼容性风险，并保持干净的回滚路径。</p></li>
<li><p><strong>迁移前验证备份。</strong>一旦数据采用了新版本的格式，就无法轻易返回。</p></li>
<li><p><strong>在切换过程中保持两个群集的运行。</strong>逐步转移流量，只有在完全验证后才停用旧群集。</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">使用 Milvus 升级后迁移数据--备份恢复<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>我们使用<code translate="no">milvus-backup restore</code> 将备份加载到新集群中。在 milvus-backup 的术语中，"还原 "指的是 "将备份数据加载到目标集群"。目标必须运行相同或更新的 Milvus 版本，因此，尽管名称相同，但还原总是将数据向前移动。</p>
<h3 id="Running-the-Restore" class="common-anchor-header">运行还原</h3><p>还原配置文件<code translate="no">configs/restore.yaml</code> 必须指向<strong>新群集</strong>及其存储设置。主要字段如下所示：</p>
<pre><code translate="no"><span class="hljs-comment"># Restore target Milvus connection information</span>
milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Milvus port</span>
  user: root  <span class="hljs-comment"># Milvus username (must have restore permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Milvus user password  </span>
  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to the target Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Target Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Object storage AK&gt;  
  secretAccessKey: &lt;Object storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>然后我们运行</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> 需要新群集的 Milvus 和 MinIO 连接信息，这样还原的数据就会写入新群集的存储中。</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">还原后的检查</h3><p>还原完成后，我们检查了四项内容，以确保迁移正确无误：</p>
<ul>
<li><p><strong>Schema 模式。</strong>新集群中的 Collections Schema 必须与旧的完全一致，包括字段定义和向量维度。</p></li>
<li><p><strong>总行数。</strong>我们比较了新旧群集中的实体总数，以确保没有数据丢失。</p></li>
<li><p><strong>索引状态。</strong>我们确认所有索引都已完成构建，且其状态设置为<code translate="no">Finished</code> 。</p></li>
<li><p><strong>查询结果。</strong>我们在两个群集上运行了相同的查询，并比较了返回的 ID 和距离分数，以确保结果一致。</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">流量逐步转移和延迟惊喜<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>我们分阶段将生产流量转移到新集群：</p>
<table>
<thead>
<tr><th>阶段</th><th>流量份额</th><th>持续时间</th><th>我们观察到的情况</th></tr>
</thead>
<tbody>
<tr><td>第一阶段</td><td>5%</td><td>24 小时</td><td>P99 查询延迟、错误率和结果准确性</td></tr>
<tr><td>第 2 阶段</td><td>25%</td><td>48 小时</td><td>P99/P95 查询延迟、QPS、CPU 使用率</td></tr>
<tr><td>第 3 阶段</td><td>50%</td><td>48 小时</td><td>端到端指标、资源使用情况</td></tr>
<tr><td>第 4 阶段</td><td>100%</td><td>持续监控</td><td>整体指标稳定性</td></tr>
</tbody>
</table>
<p>我们一直保持旧群集运行，以便即时回滚。</p>
<p><strong>在回滚过程中，我们发现了问题：新 v2.5.16 集群的搜索延迟比旧 v2.2.16 集群高出 3-5 倍。</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">查找搜索延迟的原因<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">第 1 步：检查总体 CPU 使用率</h3><p>我们从每个组件的 CPU 使用率入手，查看群集是否缺乏资源。</p>
<table>
<thead>
<tr><th>组件</th><th>CPU 使用率（内核）</th><th>分析</th></tr>
</thead>
<tbody>
<tr><td>查询节点</td><td>10.1</td><td>上限为 16 个内核，因此使用率约为 63%。未完全使用</td></tr>
<tr><td>代理</td><td>0.21</td><td>非常低</td></tr>
<tr><td>混合计算</td><td>0.11</td><td>非常低</td></tr>
<tr><td>数据节点</td><td>0.14</td><td>非常低</td></tr>
<tr><td>索引节点</td><td>0.02</td><td>非常低</td></tr>
</tbody>
</table>
<p>这表明 QueryNode 仍有足够的 CPU 可用。因此，速度变慢<strong>并不是由于 CPU 整体不足造成</strong>的。</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">第二步：检查查询节点的平衡情况</h3><p>CPU 总量看起来没有问题，但单个 QueryNode pod 存在<strong>明显的不平衡</strong>：</p>
<table>
<thead>
<tr><th>查询节点 pod</th><th>CPU 使用率（上次）</th><th>CPU 使用情况（最大值）</th></tr>
</thead>
<tbody>
<tr><td>查询节点 pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>喹啉模式-POD-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>喹啉模式-模块-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>喹啉-pod-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>喹啉-pod-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>喹啉-pod-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>喹啉-pod-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>喹啉-pod-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Pod-1 使用的 CPU 几乎是 pod-8 的 5 倍。这就是问题所在，因为 Milvus 会将查询分散到所有 QueryNodes，并等待速度最慢的节点完成查询。几个超负荷的 pod 拖累了每一次搜索。</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">第 3 步：比较分段分布</h3><p>负载不均通常表明数据分布不均，因此我们比较了新旧集群的数据段布局。</p>
<p><strong>v2.2.16 版数据段布局（共 13 个数据段）</strong></p>
<table>
<thead>
<tr><th>行数范围</th><th>段数</th><th>状态</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>密封</td></tr>
<tr><td>533,630</td><td>1</td><td>密封</td></tr>
</tbody>
</table>
<p>旧的集群相当均匀。它只有 13 个区段，其中大部分区段约有<strong>740 000 行</strong>。</p>
<p><strong>v2.5.16 版数据段布局（共 21 个数据段）</strong></p>
<table>
<thead>
<tr><th>行数范围</th><th>段数</th><th>状态</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>密封</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>密封</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>密封</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>密封</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>密封</td></tr>
</tbody>
</table>
<p>新的集群看起来很不一样。它有 21 个分段（多了 60%），分段大小各不相同：有些分段有 ~685k 行，其他分段只有 350k。还原后的数据分散不均。</p>
<h3 id="Root-Cause" class="common-anchor-header">根本原因</h3><p>我们将问题追溯到最初的还原命令：</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">--use_v2_restore</code> 标志启用了数据段合并还原模式，该模式将多个数据段合并为一个还原任务。该模式的设计目的是在有许多小片段时加快还原速度。</p>
<p>但在我们的跨版本还原（2.2 → 2.5）中，v2 逻辑重建的网段与原始群集不同：它将大网段分割成大小不均的小网段。一旦加载，一些查询节点就会被比其他节点更多的数据卡住。</p>
<p>这从三个方面损害了性能：</p>
<ul>
<li><p><strong>热节点：</strong>拥有较大或较多数据段的查询节点不得不做更多的工作</p></li>
<li><p><strong>最慢节点效应：</strong>分布式查询延迟取决于最慢的节点</p></li>
<li><p><strong>更多合并开销：</strong>更多数据段也意味着合并结果时需要更多工作</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">修复</h3><p>我们删除了<code translate="no">--use_v2_restore</code> ，并恢复使用默认逻辑：</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>我们首先清理了新集群中的不良数据，然后运行默认还原。分段分布恢复平衡，搜索延迟恢复正常，问题也就解决了。</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">下次我们会采取的不同措施<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>在这个案例中，我们花了太长时间才发现真正的问题：<strong>数据段分布不均衡</strong>。如果能这样做，就能更快地解决问题。</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">改进网段监控</h3><p>Milvus 没有在标准的 Grafana 仪表盘中公开每个 Collections 的段计数、行分布或大小分布。我们不得不通过<a href="https://github.com/zilliztech/attu">Attu</a>和 etcd 手动挖掘，速度很慢。</p>
<p>如果能增加</p>
<ul>
<li><p>Grafana 中的<strong>段分布仪表盘</strong>，显示每个查询节点加载了多少段，以及它们的行数和大小</p></li>
<li><p>当节点间的分段行数偏差超过阈值时触发<strong>失衡警报</strong></p></li>
<li><p><strong>迁移比较视图</strong>，以便用户在升级后比较新旧集群的数据段分布情况</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">使用标准迁移清单</h3><p>我们检查了行计数，认为没有问题。但这还不够。完整的迁移后验证还应该包括</p>
<ul>
<li><p><strong>Schema 一致性。</strong>字段定义和向量维度是否匹配？</p></li>
<li><p><strong>分段数。</strong>网段数量是否发生了巨大变化？</p></li>
<li><p><strong>分段平衡。</strong>各分段的行数是否合理均衡？</p></li>
<li><p><strong>索引状态。</strong>所有索引都是<code translate="no">finished</code> 吗？</p></li>
<li><p><strong>延迟基准。</strong>P50、P95 和 P99 查询延迟是否与旧群集相似？</p></li>
<li><p><strong>负载平衡。</strong>QueryNode 的 CPU 使用量是否平均分配给各个 pod？</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">添加自动检查</h3><p>您可以使用 PyMilvus 编写此验证脚本，以便在生产中出现不平衡之前及时发现：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection  
<span class="hljs-keyword">def</span> <span class="hljs-title function_">check_segment_balance</span>(<span class="hljs-params">collection_name: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Check Segment distribution balance&quot;&quot;&quot;</span>
    collection = Collection(collection_name)
    segments = utility.get_query_segment_info(collection_name)
    <span class="hljs-comment"># Group statistics by QueryNode</span>
    node_stats = {}
    <span class="hljs-keyword">for</span> seg <span class="hljs-keyword">in</span> segments:
        node_id = seg.nodeID
        <span class="hljs-keyword">if</span> node_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> node_stats:
            node_stats[node_id] = {<span class="hljs-string">&quot;count&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;rows&quot;</span>: <span class="hljs-number">0</span>}
        node_stats[node_id][<span class="hljs-string">&quot;count&quot;</span>] += <span class="hljs-number">1</span>
        node_stats[node_id][<span class="hljs-string">&quot;rows&quot;</span>] += seg.num_rows
    <span class="hljs-comment"># Calculate balance</span>
    row_counts = [v[<span class="hljs-string">&quot;rows&quot;</span>] <span class="hljs-keyword">for</span> v <span class="hljs-keyword">in</span> node_stats.values()]
    avg_rows = <span class="hljs-built_in">sum</span>(row_counts) / <span class="hljs-built_in">len</span>(row_counts)
    max_deviation = <span class="hljs-built_in">max</span>(<span class="hljs-built_in">abs</span>(r - avg_rows) / avg_rows <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> row_counts)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Number of nodes: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(node_stats)}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Average row count: <span class="hljs-subst">{avg_rows:<span class="hljs-number">.0</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Maximum deviation: <span class="hljs-subst">{max_deviation:<span class="hljs-number">.2</span>%}</span>&quot;</span>)
    <span class="hljs-keyword">if</span> max_deviation &gt; <span class="hljs-number">0.2</span>:  <span class="hljs-comment"># Raise a warning if deviation exceeds 20%</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️ Warning: Segment distribution is unbalanced and may affect query performance!&quot;</span>)
    <span class="hljs-keyword">for</span> node_id, stats <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(node_stats.items()):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Node <span class="hljs-subst">{node_id}</span>: <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;count&#x27;</span>]}</span> segments, <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;rows&#x27;</span>]}</span> rows&quot;</span>)
  
<span class="hljs-comment"># Usage example</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
check_segment_balance(<span class="hljs-string">&quot;your_collection_name&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">更好地使用现有工具</h3><p>一些工具已经支持分段级诊断：</p>
<ul>
<li><p><strong>Birdwatcher：</strong>可直接读取 Etcd 元数据并显示网段布局和通道分配</p></li>
<li><p><strong>Milvus Web UI（v2.5+）：</strong>可让您直观地检查网段信息</p></li>
<li><p><strong>Grafana + Prometheus：</strong>可用于为实时集群监控构建自定义仪表盘</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">对 Milvus 社区的建议<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>对 Milvus 做一些改动会让这类故障排除变得更容易：</p>
<ol>
<li><p><strong>更清楚地解释参数兼容性</strong> <code translate="no">milvus-backup</code> 文档应清楚地解释<code translate="no">--use_v2_restore</code> 等选项在跨版本还原过程中的行为，以及它们可能带来的风险。</p></li>
<li><p><strong>在还原后添加更好的检查在</strong> <code translate="no">restore</code> 完成<strong>后</strong>，如果工具能自动打印段分布的摘要，将会很有帮助。</p></li>
<li><p><strong>公开与平衡相关的指标Prometheus</strong>指标应包括网段平衡信息，以便用户直接监控。</p></li>
<li><p><strong>支持查询计划分析类似</strong>于 MySQL<code translate="no">EXPLAIN</code> ，Milvus 将受益于一个能显示查询如何执行并帮助定位性能问题的工具。</p></li>
</ol>
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
    </button></h2><p>总结</p>
<table>
<thead>
<tr><th>阶段</th><th>工具/方法</th><th>关键点</th></tr>
</thead>
<tbody>
<tr><td>备份</td><td>milvus-backup 创建</td><td>支持热备份，但必须仔细检查备份</td></tr>
<tr><td>升级</td><td>使用 Helm 构建新集群</td><td>禁用 Mmap 以减少 I/O 抖动，并保持与旧群集相同的资源设置</td></tr>
<tr><td>迁移</td><td>Milvus-backup 还原</td><td>小心使用 --use_v2_restore。在跨版本还原中，除非明确了解，否则不要使用非默认逻辑</td></tr>
<tr><td>灰色推出</td><td>逐步转移流量</td><td>分阶段转移流量：5% → 25% → 50% → 100%，并保留旧群集以备回滚</td></tr>
<tr><td>故障排除</td><td>Grafana + 网段分析</td><td>不要只看 CPU 和内存。还要检查分段平衡和数据分布</td></tr>
<tr><td>修复</td><td>删除坏数据并重新还原</td><td>删除错误标志，用默认逻辑还原，性能恢复正常</td></tr>
</tbody>
</table>
<p>迁移数据时，不仅要考虑数据是否存在、是否准确。您还需要注意<strong>数据是如何</strong> <strong>分布的</strong>。</p>
<p>分段数和分段大小决定了 Milvus 如何在各节点间均匀地分配查询工作。如果分段不平衡，少数节点就会承担大部分工作，而每次搜索都会为此付出代价。跨版本升级会带来额外的风险，因为还原过程可能会以不同于原始群集的方式重建数据段。像<code translate="no">--use_v2_restore</code> 这样的标记会使数据变得支离破碎，而单靠行数是无法显示出来的。</p>
<p>因此，在跨版本迁移中，最安全的方法是坚持使用默认还原设置，除非有特殊原因。此外，监控范围不应局限于 CPU 和内存；您需要深入了解底层数据布局，尤其是段分布和平衡，以便更早地发现问题。</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">来自 Milvus 团队的说明<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>我们要感谢 WPS 工程团队与 Milvus 社区分享这一经验。这样的文章很有价值，因为它们记录了真实的生产经验教训，并使之对面临类似问题的其他人员有所帮助。</p>
<p>如果您的团队有值得分享的技术经验、故障排除故事或实践经验，我们很乐意听取您的意见。请加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>并联系我们。</p>
<p>如果您正在解决自己的难题，这些社区频道也是与 Milvus 工程师和其他用户联系的好地方。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>预约一对一服务，以获得备份和恢复、跨版本升级和查询性能方面的帮助。</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
