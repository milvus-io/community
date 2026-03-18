---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: 升級 Milvus 後搜尋速度變慢的疑難排解：WPS 團隊的教訓
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
  在 Milvus 從 2.2 升級到 2.5 之後，WPS 團隊遇到了 3-5 倍的搜尋延遲退步。原因是：單一 milvus-backup
  還原標誌導致片段破碎。
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>這篇文章是由金山辦公軟體的 WPS 工程團隊所撰寫，他們在推薦系統中使用 Milvus。在他們從 Milvus 2.2.16 升級到 2.5.16 的過程中，搜尋延遲增加了 3 到 5 倍。這篇文章闡述了他們是如何調查這個問題並修復它的，這可能會對社區中計劃進行類似的升級的其他人有所幫助。</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">我們升級 Milvus 的原因<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>我們是 WPS 建立生產力軟體工程團隊的一員，我們在線上推薦系統中使用 Milvus 作為即時相似性搜尋背後的向量搜尋引擎。我們的生產叢集儲存了數千萬個向量，平均維度為 768。資料由 16 個 QueryNodes 提供服務，每個 pod 的配置限制為 16 個 CPU 核心和 48 GB 記憶體。</p>
<p>在執行 Milvus 2.2.16 時，我們遇到了嚴重的穩定性問題，這個問題已經影響到業務。在高查詢併發下，<code translate="no">planparserv2.HandleCompare</code> ，可能會導致空指標異常，造成 Proxy 元件恐慌並頻繁重新啟動。這個錯誤在高併發情況下非常容易觸發，並直接影響到我們線上推薦服務的可用性。</p>
<p>以下是實際的 Proxy 錯誤記錄和堆疊追蹤：</p>
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
<p><strong>堆疊追蹤顯示的內容</strong>：恐慌發生在 Proxy 的查詢預處理過程中，在<code translate="no">queryTask.PreExecute</code> 之內。呼叫路徑如下：</p>
<p><code translate="no">taskScheduler.processTask</code> →<code translate="no">queryTask.PreExecute</code> →<code translate="no">planparserv2.CreateRetrievePlan</code> →<code translate="no">planparserv2.HandleCompare</code></p>
<p>當<code translate="no">HandleCompare</code> 嘗試存取位址<code translate="no">0x8</code> 的無效記憶體時，就會發生當機，觸發 SIGSEGV 並導致 Proxy 程序當機。</p>
<p><strong>為了完全消除這個穩定性風險，我們決定將叢集從 Milvus 2.2.16 升級到 2.5.16。</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">升級前使用 milvus-backup 備份資料<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>在接觸生產叢集前，我們使用官方的<a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>工具備份了所有資料。它支援在同一集群內、跨集群和跨 Milvus 版本的備份和還原。</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">檢查版本相容性</h3><p>milvus-backup 有兩個<a href="https://milvus.io/docs/milvus_backup_overview.md">跨版本還原</a>的版本規則：</p>
<ol>
<li><p><strong>目標集群必須執行相同的 Milvus 版本或更新的版本。</strong>從 2.2 的備份可以載入到 2.5，但不能反過來。</p></li>
<li><p><strong>目標必須至少是 Milvus 2.4。</strong>不支援較舊的還原目標。</p></li>
</ol>
<p>我們的路徑 (從 2.2.16 備份，載入到 2.5.16) 符合這兩個規則。</p>
<table>
<thead>
<tr><th>備份自 ↓ \ 復原至 → 2.4</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Milvus 備份如何運作</h3><p>Milvus 備份方便備份和還原跨 Milvus 實體的元資料、網段和資料。它提供北向介面，例如 CLI、API 和基於 gRPC 的 Go 模組，以彈性操作備份和還原程序。</p>
<p>Milvus Backup 從源 Milvus 實例讀取集合元資料和區段來建立備份。然後，它會從源 Milvus 實例的根目錄中複製收集資料，並將其儲存到備份的根目錄。</p>
<p>要從備份還原，Milvus Backup 會基於備份中的集合元資料和段資訊，在目標 Milvus 實例中建立新的集合。然後將備份資料從備份根目錄複製到目標實例的根目錄。</p>
<h3 id="Running-the-Backup" class="common-anchor-header">執行備份</h3><p>我們準備了一個專用的設定檔，<code translate="no">configs/backup.yaml</code> 。主要欄位如下所示，敏感值已移除：</p>
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
<p>然後，我們執行此指令：</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> 支援<strong>熱備份</strong>，因此通常對線上流量影響不大。在非繁忙時間執行仍較為安全，可避免資源爭用。</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">驗證備份</h3><p>備份完成後，我們驗證它是否完整可用。我們主要檢查備份中的集合和區段數量是否與來源群集中的相符。</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>它們相符，因此我們繼續進行升級。</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">使用 Helm Chart 升級<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>跳躍三個主要版本 (2.2 → 2.5) 與數千萬向量，使得原地升級風險太大。我們建立了一個新的群集，並將資料遷移至其中。舊的群集則維持在線，以便進行回溯。</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">部署新叢集</h3><p>我們使用 Helm 部署了新的 Milvus 2.5.16 集群：</p>
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
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">關鍵配置變更 (<code translate="no">values-v25.yaml</code>)</h3><p>為了讓效能比較公平，我們儘可能保持新叢集與舊叢集類似。我們只變更了幾個對此工作負載重要的設定：</p>
<ul>
<li><p><strong>禁用 Mmap</strong>(<code translate="no">mmap.enabled: false</code>)：我們的推薦工作負載對延遲很敏感。如果啟用 Mmap，某些資料可能會在需要時從磁碟讀取，這可能會增加磁碟 I/O 延遲並造成延遲尖峰。我們關閉了它，因此資料會完全留在記憶體中，查詢延遲會更穩定。</p></li>
<li><p><strong>查詢節點數：</strong>維持在<strong>16 個</strong>，與舊群集相同</p></li>
<li><p><strong>資源限制：</strong>每個 Pod 仍有<strong>16 個 CPU 核心</strong>，與舊群集相同。</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">主要版本升级的提示：</h3><ul>
<li><p><strong>建立新的群集，而不是原地升級。</strong>您可以避免元資料相容性風險，並維持乾淨的回溯路徑。</p></li>
<li><p><strong>遷移前先驗證您的備份。</strong>一旦資料採用新版本的格式，您就無法輕易返回。</p></li>
<li><p><strong>在切換期間，保持兩個群集都在執行。</strong>逐步轉移流量，並在完全驗證後才停用舊群集。</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">使用 Milvus 升級後的資料遷移 - 備份還原<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>我們使用<code translate="no">milvus-backup restore</code> 將備份載入新叢集。在 milvus-backup 的術語中，「還原 」的意思是 「將備份資料載入目標叢集」。目標必須執行相同的 Milvus 版本或更新的版本，因此，儘管名稱如此，還原總是將資料向前推進。</p>
<h3 id="Running-the-Restore" class="common-anchor-header">執行還原</h3><p>還原設定檔案<code translate="no">configs/restore.yaml</code> 必須指向<strong>新的群集</strong>及其儲存設定。主要欄位如下：</p>
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
<p>然後，我們執行</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> 需要新叢集的 Milvus 和 MinIO 連線資訊，因此還原的資料會寫入新叢集的儲存空間。</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">還原後的檢查</h3><p>還原完成後，我們檢查了四件事，以確保遷移正確：</p>
<ul>
<li><p><strong>模式。</strong>新叢集中的集合模式必須完全符合舊模式，包括欄位定義和向量尺寸。</p></li>
<li><p><strong>總行數。</strong>我們比較了新舊群集中的實體總數，以確保沒有資料遺失。</p></li>
<li><p><strong>索引狀態。</strong>我們確認所有索引都已完成建立，且其狀態設定為<code translate="no">Finished</code> 。</p></li>
<li><p><strong>查詢結果。</strong>我們在兩個叢集上執行相同的查詢，並比較傳回的 ID 和距離分數，以確保結果相符。</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">流量逐漸轉移與延遲的驚喜<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>我們分階段將生產流量移至新叢集：</p>
<table>
<thead>
<tr><th>階段</th><th>流量份額</th><th>持續時間</th><th>我們觀察到的情況</th></tr>
</thead>
<tbody>
<tr><td>階段 1</td><td>5%</td><td>24 小時</td><td>P99 查詢延遲、錯誤率和結果準確性</td></tr>
<tr><td>第二階段</td><td>25%</td><td>48 小時</td><td>P99/P95 查詢延遲、QPS、CPU 使用量</td></tr>
<tr><td>第三階段</td><td>50%</td><td>48 小時</td><td>端對端指標、資源使用量</td></tr>
<tr><td>第四階段</td><td>100%</td><td>持續監控</td><td>整體指標穩定性</td></tr>
</tbody>
</table>
<p>我們全程保持舊叢集的運行，以便即時回滾。</p>
<p><strong>在此滾回過程中，我們發現了問題：新的 v2.5.16 叢集上的搜尋延遲比舊的 v2.2.16 叢集高出 3-5 倍。</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">找出搜尋延遲的原因<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">步驟 1：檢查整體 CPU 使用量</h3><p>我們先從每個元件的 CPU 使用量開始，看看群集是否缺乏資源。</p>
<table>
<thead>
<tr><th>元件</th><th>CPU 使用量 (核心)</th><th>分析</th></tr>
</thead>
<tbody>
<tr><td>查詢節點</td><td>10.1</td><td>限制為 16 核心，因此使用率約為 63%。未完全使用</td></tr>
<tr><td>代理</td><td>0.21</td><td>非常低</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>非常低</td></tr>
<tr><td>資料節點</td><td>0.14</td><td>非常低</td></tr>
<tr><td>索引節點</td><td>0.02</td><td>非常低</td></tr>
</tbody>
</table>
<p>這顯示 QueryNode 仍有足夠的 CPU 可用。因此，速度變慢<strong>並非由於整體 CPU 不足所致</strong>。</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">步驟 2：檢查 QueryNode 的平衡情況</h3><p>總 CPU 看起來沒問題，但個別 QueryNode Pod 有<strong>明顯的不平衡</strong>：</p>
<table>
<thead>
<tr><th>查詢節點 Pod</th><th>CPU 使用量 (最後)</th><th>CPU 使用量 (最大值)</th></tr>
</thead>
<tbody>
<tr><td>查詢節點 Pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>喹啉-pod-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>喹啉-pod-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>喹啉-pod-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>喹啉-pod-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>喹啉-pod-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>喹啉-pod-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>喹啉-pod-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Pod-1 使用的 CPU 差不多是 pod-8 的 5 倍。這是個問題，因為 Milvus 會將查詢分散到所有 QueryNodes，並等待最慢的一個完成。幾個超載的 pod 拖慢了每一次搜尋。</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">步驟 3：比較區段分佈</h3><p>不平均的負載通常表示資料分佈不平均，因此我們比較了新舊叢集之間的區段佈局。</p>
<p><strong>v2.2.16 區段佈局 (共 13 個區段)</strong></p>
<table>
<thead>
<tr><th>行數範圍</th><th>段數</th><th>狀態</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>封裝</td></tr>
<tr><td>533,630</td><td>1</td><td>密封</td></tr>
</tbody>
</table>
<p>舊叢集相當平均。它只有 13 個區段，大部分區段約有<strong>740,000 行</strong>。</p>
<p><strong>v2.5.16 區段配置 (共 21 個區段)</strong></p>
<table>
<thead>
<tr><th>行數範圍</th><th>區段數量</th><th>狀態</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>密封</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>密封</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>密封</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>密封</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>密封</td></tr>
</tbody>
</table>
<p>新的叢集看起來非常不同。它有 21 個區段（多了 60%），區段大小各異：有些區段有 ~685k 行，有些則只有 350k。還原的資料分散不均。</p>
<h3 id="Root-Cause" class="common-anchor-header">根本原因</h3><p>我們將問題追溯到原始的還原指令：</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">--use_v2_restore</code> 旗標啟用了區段合併還原模式，該模式會將多個區段組合成單一還原工作。當您有許多小區段時，此模式可加快還原速度。</p>
<p>但在我們的跨版本還原 (2.2 → 2.5) 中，v2 邏輯重建區段的方式與原始群集不同：它將大區段分割成大小不均的小區段。一旦載入，某些 QueryNodes 就會被比其他更多的資料卡住。</p>
<p>這在三個方面損害了效能：</p>
<ul>
<li><p><strong>熱節點：</strong>擁有較大或較多區段的查詢節點必須做更多工作</p></li>
<li><p><strong>最慢節點效應：</strong>分散式查詢延遲取決於最慢的節點</p></li>
<li><p><strong>更多的合併開銷：</strong>更多的區段也意味著合併結果時更多的工作</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">修復方法</h3><p>我們移除<code translate="no">--use_v2_restore</code> ，並恢復使用預設邏輯：</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>我們先清理新叢集的不良資料，然後執行預設還原。區段分佈恢復平衡，搜尋延遲恢復正常，問題也就解決了。</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">下次我們會採取的不同做法<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>在這個案例中，我們花了太長的時間才找到真正的問題：<strong>區段分佈不均</strong>。以下是可以加快解決速度的方法。</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">改善網段監控</h3><p>Milvus 並未在標準 Grafana 面板中揭露每個集合的區段計數、行分佈或大小分佈。我們必須手動搜尋<a href="https://github.com/zilliztech/attu">Attu</a>和 etcd，速度很慢。</p>
<p>如果能增加</p>
<ul>
<li><p>Grafana 中的<strong>片段分佈儀表板</strong>，顯示每個 QueryNode 載入了多少片段，以及它們的行數和大小</p></li>
<li><p><strong>不平衡警示</strong>，當節點之間的區段行數偏移超過臨界值時會觸<strong>發警示</strong></p></li>
<li><p><strong>遷移比較檢視</strong>，讓使用者可以在升級後，比較新舊叢集之間的區段分佈。</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">使用標準遷移清單</h3><p>我們檢查了行數，認為沒有問題。這還不夠。完整的遷移後驗證還應包括</p>
<ul>
<li><p><strong>模式一致性。</strong>欄位定義與向量尺寸是否相符？</p></li>
<li><p><strong>區段數目。</strong>區段數量是否大幅改變？</p></li>
<li><p><strong>區段平衡。</strong>各區段的行數是否合理平均？</p></li>
<li><p><strong>索引狀態。</strong>所有索引是否<code translate="no">finished</code> ？</p></li>
<li><p><strong>延遲基準。</strong>P50、P95 和 P99 的查詢延遲是否與舊群集相似？</p></li>
<li><p><strong>負載平衡。</strong>QueryNode 的 CPU 使用量是否平均分配給 Pod？</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">新增自動檢查</h3><p>您可以使用 PyMilvus 撰寫此驗證的腳本，在不平衡的情況影響生產之前就加以捕捉：</p>
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
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">更好地使用現有工具</h3><p>有些工具已經支援段級診斷：</p>
<ul>
<li><p><strong>Birdwatcher:</strong>可以直接讀取 Etcd 元資料，並顯示段落配置和通道分配</p></li>
<li><p><strong>Milvus Web UI (v2.5+)：</strong>可讓您直觀地檢視網段資訊</p></li>
<li><p><strong>Grafana + Prometheus：</strong>可用於建立即時群集監控的自訂儀表板</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">給 Milvus 社群的建議<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 的一些變更會讓這類疑難排解變得更容易：</p>
<ol>
<li><p><strong>更清楚地解釋參數相容性</strong> <code translate="no">milvus-backup</code> docs 應該清楚地解釋<code translate="no">--use_v2_restore</code> 等選項在跨版本還原時的行為，以及它們可能帶來的風險。</p></li>
<li><p><strong>還原後加入更好的檢查在</strong> <code translate="no">restore</code> 完成後，如果工具能自動列印段落分佈的摘要，將會很有幫助。</p></li>
<li><p><strong>揭露平衡相關的指標Prometheus</strong>的指標應該包含網段平衡資訊，讓使用者可以直接監控。</p></li>
<li><p><strong>支援查詢計畫分析類似</strong>於 MySQL<code translate="no">EXPLAIN</code> ，Milvus 將受益於能顯示查詢如何執行並協助定位效能問題的工具。</p></li>
</ol>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>總結一下：</p>
<table>
<thead>
<tr><th>階段</th><th>工具/方法</th><th>關鍵點</th></tr>
</thead>
<tbody>
<tr><td>備份</td><td>milvus-backup 建立</td><td>支援熱備份，但必須仔細檢查備份內容</td></tr>
<tr><td>升級</td><td>使用 Helm 建立新的叢集</td><td>停用 Mmap 以減少 I/O 抖動，並保持資源設定與舊群集相同</td></tr>
<tr><td>遷移</td><td>還原 milvus-backup</td><td>使用 --use_v2_restore 時要小心。在跨版本還原中，除非清楚瞭解，否則請勿使用非預設邏輯</td></tr>
<tr><td>灰色推出</td><td>漸進式流量轉移</td><td>分階段移動流量：5% → 25% → 50% → 100%，並保留舊叢集以備回滾</td></tr>
<tr><td>疑難排解</td><td>Grafana + 區段分析</td><td>不要只看 CPU 和記憶體。還要檢查區段平衡和資料分佈</td></tr>
<tr><td>修復</td><td>移除不良資料，然後重新還原</td><td>移除錯誤的標誌，以預設邏輯還原，效能就會回復正常</td></tr>
</tbody>
</table>
<p>遷移資料時，不只需要考慮資料是否存在且準確。您還需要注意<strong>資料的</strong> <strong>分佈</strong> <strong>方式</strong>。</p>
<p>分段數量和分段大小決定 Milvus 如何在節點間平均分配查詢工作。當區段不平衡時，幾個節點最終做了大部分的工作，而每次搜尋都要付出代價。跨版本升級在這方面有額外的風險，因為還原程序可能會以不同於原始群集的方式重建區段。像<code translate="no">--use_v2_restore</code> 之類的旗標會讓您的資料變得支離破碎，而單靠行數是無法顯示出來的。</p>
<p>因此，在跨版本遷移中，最安全的方法是堅持使用預設的還原設定，除非您有特別的理由。此外，監控應超越 CPU 和記憶體；您需要深入瞭解底層資料佈局，特別是區段分佈和平衡，以便及早發現問題。</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Milvus 團隊的說明<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>我們要感謝 WPS 工程團隊與 Milvus 社群分享此經驗。像這樣的文章是很有價值的，因為它們捕捉了真實的生產經驗，使它們對其他面臨類似問題的人有用。</p>
<p>如果您的團隊有值得分享的技術經驗、故障排除故事或實務經驗，我們很樂意聽到您的意見。加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>，並在那裡與我們聯繫。</p>
<p>如果您正在解決自己的難題，這些相同的社群頻道也是與 Milvus 工程師和其他使用者聯繫的好地方。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>預約一對一服務，以獲得備份與還原、跨版本升級和查詢效能方面的協助。</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
