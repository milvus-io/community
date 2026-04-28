---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >
  Troubleshooting a Search Slowdown After Upgrading Milvus: Lessons from the WPS
  Team
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
desc: >
  After upgrading Milvus from 2.2 to 2.5, the WPS team hit a 3-5x search latency
  regression. The cause: a single milvus-backup restore flag that fragmented
  segments.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>This post was contributed by the WPS engineering team at Kingsoft Office Software, who use Milvus in a recommendation system. During their upgrade from Milvus 2.2.16 to 2.5.16, search latency increased by 3 to 5 times. This article walks through how they investigated the problem and fixed it, and may be helpful to others in the community planning a similar upgrade.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Why We Upgraded Milvus<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>We are part of the WPS engineering team building productivity software, and we use Milvus as the vector search engine behind real-time similarity search in our online recommendation system. Our production cluster stored tens of millions of vectors, with an average dimension of 768. The data was served by 16 QueryNodes, and each pod was configured with limits of 16 CPU cores and 48 GB of memory.</p>
<p>While running Milvus 2.2.16, we ran into a serious stability issue that was already affecting the business. Under high query concurrency, <code translate="no">planparserv2.HandleCompare</code> could cause a null pointer exception, causing the Proxy component to panic and restart frequently. This bug was very easy to trigger in high-concurrency scenarios and directly affected the availability of our online recommendation service.</p>
<p>Below is the actual Proxy error log and stack trace from the incident:</p>
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
<p><strong>What the stack trace shows</strong>: The panic occurred during query preprocessing in Proxy, within <code translate="no">queryTask.PreExecute</code>. The call path was:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p>The crash occurred when <code translate="no">HandleCompare</code> attempted to access invalid memory at address <code translate="no">0x8</code>, triggering a SIGSEGV and causing the Proxy process to crash.</p>
<p><strong>To completely eliminate this stability risk, we decided to upgrade the cluster from Milvus 2.2.16 to 2.5.16.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">Backing Up Data With milvus-backup Before the Upgrade<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>Before touching the production cluster, we backed up everything using the official <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a> tool. It supports backup and restore within the same cluster, across clusters, and across Milvus versions.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">Checking Version Compatibility</h3><p>milvus-backup has two version rules for <a href="https://milvus.io/docs/milvus_backup_overview.md">cross-version restores</a>:</p>
<ol>
<li><p><strong>The target cluster must run the same Milvus version or a newer one.</strong> A backup from 2.2 can load into 2.5, but not the other way around.</p></li>
<li><p><strong>The target must be at least Milvus 2.4.</strong> Older restore targets aren’t supported.</p></li>
</ol>
<p>Our path (backup from 2.2.16, load into 2.5.16) satisfied both rules.</p>
<table>
<thead>
<tr><th>Backup From ↓ \ Restore To →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">How Milvus-Backup Works</h3><p>Milvus Backup facilitates backup and restore of metadata, segments, and data across Milvus instances. It provides northbound interfaces, such as a CLI, an API, and a gRPC-based Go module, for flexible manipulation of backup and restore processes.</p>
<p>Milvus Backup reads collection metadata and segments from the source Milvus instance to create a backup. It then copies collection data from the root path of the source Milvus instance and saves it to the backup root path.</p>
<p>To restore from a backup, Milvus Backup creates a new collection in the target Milvus instance based on the collection metadata and segment information in the backup. It then copies the backup data from the backup root path to the target instance’s root path.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">Running the Backup</h3><p>We prepared a dedicated config file, <code translate="no">configs/backup.yaml</code>. The main fields are shown below, with sensitive values removed:</p>
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
<p>We then ran this command:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> supports <strong>hot backup</strong>, so it usually has little impact on online traffic. Running during off-peak hours is still safer to avoid resource contention.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">Verifying the Backup</h3><p>After the backup finished, we verified it was complete and usable. We mainly checked whether the number of collections and segments in the backup matched those in the source cluster.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>They matched, so we moved on to the upgrade.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Upgrading With Helm Chart<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>Jumping three major versions (2.2 → 2.5) with tens of millions of vectors made an in-place upgrade too risky. We built a new cluster instead and migrated data into it. The old cluster stayed online for rollback.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">Deploying the New Cluster</h3><p>We deployed the new Milvus 2.5.16 cluster with Helm:</p>
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
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">Key Configuration Changes (<code translate="no">values-v25.yaml</code>)</h3><p>To make the performance comparison fair, we kept the new cluster as similar to the old one as possible. We only changed a few settings that mattered for this workload:</p>
<ul>
<li><p><strong>Disable Mmap</strong> (<code translate="no">mmap.enabled: false</code>): Our recommendation workload is sensitive to latency. If Mmap is enabled, some data may be read from disk when needed, which can add disk I/O delay and cause latency spikes. We turned it off so the data would stay fully in memory and query latency would be more stable.</p></li>
<li><p><strong>QueryNode count:</strong> kept at <strong>16</strong>, same as the old cluster</p></li>
<li><p><strong>Resource limits:</strong> each Pod still had <strong>16 CPU cores</strong>, the same as the old cluster</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">Tips for major-version upgrades:</h3><ul>
<li><p><strong>Build a new cluster instead of upgrading in place.</strong> You avoid metadata-compatibility risks and maintain a clean rollback path.</p></li>
<li><p><strong>Verify your backup before migrating.</strong> Once data is in the new version’s format, you can’t easily go back.</p></li>
<li><p><strong>Keep both clusters running during cutover.</strong> Shift traffic gradually and only decommission the old cluster after full verification.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Migrating Data After the Upgrade with Milvus-Backup Restore<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>We used <code translate="no">milvus-backup restore</code> to load the backup into the new cluster. In milvus-backup’s terminology, “restore” means “load backup data into a target cluster.” The target must run the same Milvus version or a newer one, so, despite the name, restores always move data forward.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">Running the Restore</h3><p>The restore config file, <code translate="no">configs/restore.yaml</code>, had to point to the <strong>new cluster</strong> and its storage settings. The main fields looked like this:</p>
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
<p>We then ran:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> needs the new cluster’s Milvus and MinIO connection information so the restored data is written to the new cluster’s storage.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">Checks After Restore</h3><p>After the restore finished, we checked four things to make sure the migration was correct:</p>
<ul>
<li><p><strong>Schema.</strong> The collection schema in the new cluster had to exactly match the old one, including field definitions and vector dimensions.</p></li>
<li><p><strong>Total row count.</strong> We compared the total number of entities in the old and new clusters to make sure no data was lost.</p></li>
<li><p><strong>Index status.</strong> We confirmed that all indexes had finished building and that their status was set to <code translate="no">Finished</code>.</p></li>
<li><p><strong>Query results.</strong> We ran the same queries on both clusters and compared the returned IDs and distance scores to make sure the results matched.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">Gradual Traffic Shift and the Latency Surprise<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>We moved production traffic to the new cluster in stages:</p>
<table>
<thead>
<tr><th>Phase</th><th>Traffic Share</th><th>Duration</th><th>What We Watched</th></tr>
</thead>
<tbody>
<tr><td>Phase 1</td><td>5%</td><td>24 hours</td><td>P99 query latency, error rate, and result accuracy</td></tr>
<tr><td>Phase 2</td><td>25%</td><td>48 hours</td><td>P99/P95 query latency, QPS, CPU usage</td></tr>
<tr><td>Phase 3</td><td>50%</td><td>48 hours</td><td>End-to-end metrics, resource usage</td></tr>
<tr><td>Phase 4</td><td>100%</td><td>Continued monitoring</td><td>Overall metric stability</td></tr>
</tbody>
</table>
<p>We kept the old cluster running the whole time for instant rollback.</p>
<p><strong>During this rollout, we spotted the problem: search latency on the new v2.5.16 cluster was 3-5 times higher than on the old v2.2.16 cluster.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">Finding the Cause of the Search Slowdown<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">Step 1: Check Overall CPU Usage</h3><p>We started with CPU usage per component to see whether the cluster was short on resources.</p>
<table>
<thead>
<tr><th>Component</th><th>CPU Usage (cores)</th><th>Analysis</th></tr>
</thead>
<tbody>
<tr><td>QueryNode</td><td>10.1</td><td>The limit was 16 cores, so usage was about 63%. Not fully used</td></tr>
<tr><td>Proxy</td><td>0.21</td><td>Very low</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>Very low</td></tr>
<tr><td>DataNode</td><td>0.14</td><td>Very low</td></tr>
<tr><td>IndexNode</td><td>0.02</td><td>Very low</td></tr>
</tbody>
</table>
<p>This showed that QueryNode still had enough CPU available. So the slowdown was <strong>not caused by overall CPU shortage</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">Step 2: Check QueryNode Balance</h3><p>Total CPU looked fine, but individual QueryNode pods had a <strong>clear imbalance</strong>:</p>
<table>
<thead>
<tr><th>QueryNode Pod</th><th>CPU Usage (Last)</th><th>CPU Usage (Max)</th></tr>
</thead>
<tbody>
<tr><td>querynode-pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>querynode-pod-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>querynode-pod-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>querynode-pod-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>querynode-pod-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>querynode-pod-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>querynode-pod-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>querynode-pod-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Pod-1 used nearly 5x as much CPU as pod-8. That’s a problem because Milvus fans a query out to all QueryNodes and waits for the slowest one to finish. A few overloaded pods were dragging down every single search.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">Step 3: Compare Segment Distribution</h3><p>Uneven load usually indicates an uneven data distribution, so we compared the segment layouts between the old and new clusters.</p>
<p><strong>v2.2.16 segment layout (13 segments total)</strong></p>
<table>
<thead>
<tr><th>Row count range</th><th>Segment count</th><th>State</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Sealed</td></tr>
<tr><td>533,630</td><td>1</td><td>Sealed</td></tr>
</tbody>
</table>
<p>The old cluster was fairly even. It had only 13 segments, and most of them had about <strong>740,000 rows</strong>.</p>
<p><strong>v2.5.16 segment layout (21 segments total)</strong></p>
<table>
<thead>
<tr><th>Row count range</th><th>Segment count</th><th>State</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Sealed</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Sealed</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Sealed</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Sealed</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Sealed</td></tr>
</tbody>
</table>
<p>The new cluster looked very different. It had 21 segments (60% more), with varying segment size: some held ~685k rows, others barely 350k. The restore had scattered data unevenly.</p>
<h3 id="Root-Cause" class="common-anchor-header">Root Cause</h3><p>We traced the problem back to our original restore command:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>That <code translate="no">--use_v2_restore</code> flag enables segment merging restore mode, which groups multiple segments into a single restore job. This mode is designed to speed up restores when you have many small segments.</p>
<p>But in our cross-version restore (2.2 → 2.5), the v2 logic rebuilt segments differently from the original cluster: it split large segments into smaller, unevenly sized ones. Once loaded, some QueryNodes got stuck with more data than others.</p>
<p>This hurt performance in three ways:</p>
<ul>
<li><p><strong>Hot nodes:</strong> QueryNodes with larger or more segments had to do more work</p></li>
<li><p><strong>Slowest-node effect:</strong> distributed query latency depends on the slowest node</p></li>
<li><p><strong>More merge overhead:</strong> more segments also meant more work when merging results</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">The Fix</h3><p>We removed <code translate="no">--use_v2_restore</code> and restored with the default logic:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>We cleaned up the bad data from the new cluster first, then ran the default restore. Segment distribution returned to balance, search latency returned to normal, and the problem was gone.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">What We’d Do Differently Next Time<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>In this case, it took us too long to find the real issue: <strong>uneven segment distribution</strong>. Here’s what would have made it faster.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">Improve Segment Monitoring</h3><p>Milvus doesn’t expose segment count, row distribution, or size distribution per collection in standard Grafana dashboards. We had to manually dig through <a href="https://github.com/zilliztech/attu">Attu</a> and etcd, which was slow.</p>
<p>It would help to add:</p>
<ul>
<li><p>a <strong>segment distribution dashboard</strong> in Grafana, showing how many segments each QueryNode has loaded, plus their row counts and sizes</p></li>
<li><p>an <strong>imbalance alert</strong>, triggered when segment row counts across nodes skew beyond a threshold</p></li>
<li><p>a <strong>migration comparison view</strong>, so users can compare segment distribution between the old and new clusters after an upgrade</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">Use a Standard Migration Checklist</h3><p>We checked the row count and deemed it fine. That wasn’t enough. A complete post-migration validation should also cover:</p>
<ul>
<li><p><strong>Schema consistency.</strong> Do field definitions and vector dimensions match?</p></li>
<li><p><strong>Segment count.</strong> Did the number of segments change drastically?</p></li>
<li><p><strong>Segment balance.</strong> Are row counts across segments reasonably even?</p></li>
<li><p><strong>Index status.</strong> Are all the indexes <code translate="no">finished</code>?</p></li>
<li><p><strong>Latency benchmark.</strong> Do P50, P95, and P99 query latencies look similar to the old cluster?</p></li>
<li><p><strong>Load balance.</strong> Is the CPU usage of QueryNode evenly distributed across pods?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">Add Automated Checks</h3><p>You can script this validation with PyMilvus to catch imbalance before it hits production:</p>
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
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">Use Existing Tools Better</h3><p>A few tools already support segment-level diagnostics:</p>
<ul>
<li><p><strong>Birdwatcher:</strong> can read Etcd metadata directly and show segment layout and channel assignment</p></li>
<li><p><strong>Milvus Web UI (v2.5+):</strong> lets you inspect segment information visually</p></li>
<li><p><strong>Grafana + Prometheus:</strong> can be used to build custom dashboards for real-time cluster monitoring</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Suggestions for the Milvus Community<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>A few changes to Milvus would make this kind of troubleshooting easier:</p>
<ol>
<li><p><strong>Explain parameter compatibility more clearly</strong>The <code translate="no">milvus-backup</code> docs should clearly explain how options like <code translate="no">--use_v2_restore</code> behave during cross-version restores and the risks they may introduce.</p></li>
<li><p><strong>Add better checks after restore</strong>After the <code translate="no">restore</code> finishes, it would be helpful if the tool automatically printed a summary of the segment distribution.</p></li>
<li><p><strong>Expose balance-related metrics</strong>Prometheus metrics should include segment balance information, so users can monitor it directly.</p></li>
<li><p><strong>Support query plan analysis</strong>Similar to MySQL <code translate="no">EXPLAIN</code>, Milvus would benefit from a tool that shows how a query is executed and helps locate performance issues.</p></li>
</ol>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>To sum up:</p>
<table>
<thead>
<tr><th>Stage</th><th>Tool / Method</th><th>Key Point</th></tr>
</thead>
<tbody>
<tr><td>Backup</td><td>milvus-backup create</td><td>Hot backup is supported, but the backup must be checked carefully</td></tr>
<tr><td>Upgrade</td><td>Build a new cluster with Helm</td><td>Disable Mmap to reduce I/O jitter, and keep the resource settings the same as the old cluster</td></tr>
<tr><td>Migration</td><td>milvus-backup restore</td><td>Be careful with --use_v2_restore. In cross-version restore, do not use non-default logic unless you clearly understand it</td></tr>
<tr><td>Gray rollout</td><td>Gradual traffic shift</td><td>Move traffic in stages: 5% → 25% → 50% → 100%, and keep the old cluster ready for rollback</td></tr>
<tr><td>Troubleshooting</td><td>Grafana + segment analysis</td><td>Do not only look at CPU and memory. Also check the segment balance and data distribution</td></tr>
<tr><td>Fix</td><td>Remove bad data and restore it again</td><td>Remove the wrong flag, restore with the default logic, and performance returns to normal</td></tr>
</tbody>
</table>
<p>When migrating data, it is important to consider more than just whether the data is present and accurate. You also need to pay attention to <strong>how the data</strong> <strong>is distributed</strong>.</p>
<p>Segment count and segment sizes determine how evenly Milvus distributes query work across nodes. When segments are unbalanced, a few nodes end up doing most of the work, and every search pays for it. Cross-version upgrades carry extra risk here because the restore process may rebuild segments differently from the original cluster. Flags like <code translate="no">--use_v2_restore</code> can fragment your data in ways that row counts alone won’t show.</p>
<p>Therefore, the safest approach in cross-version migration is to stick with the default restore settings unless you have a specific reason to do otherwise. Also, monitoring should go beyond CPU and memory; you need insight into the underlying data layout, particularly segment distribution and balance, to detect problems earlier.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">A Note from the Milvus Team<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>We’d like to thank the WPS engineering team for sharing this experience with the Milvus community. Write-ups like this are valuable because they capture real production lessons and make them useful to others facing similar issues.</p>
<p>If your team has a technical lesson, a troubleshooting story, or practical experience worth sharing, we’d love to hear from you. Join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channel</a> and reach out to us there.</p>
<p>And if you’re working through challenges of your own, those same community channels are a good place to connect with Milvus engineers and other users. You can also book a one-on-one session through <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> for help with backup and restore, cross-version upgrades, and query performance.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
