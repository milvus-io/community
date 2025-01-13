---
id: how-to-use-milvus-backup-tool-step-by-step-guide.md
title: 如何使用 Milvus 備份工具：逐步指南
author: Michael Mo
date: 2024-09-27T00:00:00.000Z
desc: 本指南將教您如何使用 Milvus Backup，確保您能自信地處理您的備份需求。
cover: >-
  assets.zilliz.com/How_to_Use_the_Milvus_Backup_Tool_A_Step_by_Step_Guide_411029fa4b.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, Backup and restore'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-use-milvus-backup-tool-step-by-step-guide.md'
---
<p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong></a>是一個開放原始碼、高效能且高度可擴充的<a href="https://zilliz.com/learn/what-is-vector-database">向量</a> <a href="https://zilliz.com/learn/introduction-to-unstructured-data">資料</a> <a href="https://zilliz.com/learn/what-is-vector-database">庫</a>，可透過高維<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入來</a>儲存、索引及搜尋十億規模<a href="https://zilliz.com/learn/introduction-to-unstructured-data">的非結構化資料</a>。它非常適合建立現代人工智能應用程式，例如檢索擴增生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>)、語義搜尋、<a href="https://zilliz.com/blog/multimodal-rag-expanding-beyond-text-for-smarter-ai">多模態搜尋</a>和推薦系統。Milvus 可在從筆記型電腦到大型分散式系統等各種<a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">環境中</a>高效運行。它可以開放原始碼軟體和雲端服務的方式提供。</p>
<p><a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>是用於備份和還原 Milvus 資料的工具。它提供 CLI 和 API 兩種方式來滿足不同的應用情境。本指南將帶領您完成使用 Milvus Backup 的過程，確保您能自信地處理您的備份需求。</p>
<h2 id="Preparation" class="common-anchor-header">準備工作<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>在開始備份或還原過程之前，您需要設定您的環境：</p>
<p><strong>1.</strong>從<a href="https://github.com/zilliztech/milvus-backup/releases"> Milvus-backup 套件庫版本</a><strong>中下載最新的二進位版本</strong>。針對您的作業系統選擇適當的版本：</p>
<ul>
<li><p>適用於 macOS：<code translate="no">milvus-backup_Darwin_arm64.tar.gz</code> 或<code translate="no">milvus-backup_Darwin_x86_64.tar.gz</code></p></li>
<li><p>對於 Linux：<code translate="no">milvus-backup_Linux_arm64.tar.gz</code> 或<code translate="no">milvus-backup_Linux_x86_64.tar.gz</code></p></li>
</ul>
<p><strong>2.</strong>從<a href="https://github.com/zilliztech/milvus-backup/blob/main/configs/backup.yaml">GitHub</a><strong>下載配置檔案</strong>。</p>
<p><strong>3.解壓縮 tar 檔案</strong>到您偏好的目錄，並將<code translate="no">backup.yaml</code> 置於同一解壓縮資料夾內的<code translate="no">configs/</code> 目錄。確保您的目錄結構如下所示：</p>
<pre><code translate="no">├── configs
│   └── backup.yaml
├── milvus-backup
└── README.md
<button class="copy-code-btn"></button></code></pre>
<h2 id="Command-Overview" class="common-anchor-header">指令概述<button data-href="#Command-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>導覽到您的終端，熟悉工具的命令：</p>
<p><strong>1.一般說明</strong>：輸入<code translate="no">milvus-backup help</code> 檢視可用的指令和旗標。</p>
<pre><code translate="no">milvus-backup <span class="hljs-keyword">is</span> a backup&amp;restore tool <span class="hljs-keyword">for</span> milvus.

Usage:
 milvus-backup [flags]
 milvus-backup [command]

Available Commands:
 check       check <span class="hljs-keyword">if</span> the connects <span class="hljs-keyword">is</span> right.
 create      create subcommand create a backup.
 delete      delete subcommand delete backup <span class="hljs-keyword">by</span> name.
 <span class="hljs-keyword">get</span>         <span class="hljs-keyword">get</span> subcommand <span class="hljs-keyword">get</span> backup <span class="hljs-keyword">by</span> name.
 help        Help about any command
 list        list subcommand shows all backup <span class="hljs-keyword">in</span> the cluster.
 restore     restore subcommand restore a backup.
 server      server subcommand start milvus-backup RESTAPI server.

Flags:
     --<span class="hljs-function">config <span class="hljs-built_in">string</span>   config YAML <span class="hljs-keyword">file</span> of <span class="hljs-title">milvus</span> (<span class="hljs-params"><span class="hljs-literal">default</span> <span class="hljs-string">&quot;backup.yaml&quot;</span></span>)
 -h, --help            help <span class="hljs-keyword">for</span> milvus-backup

Use &quot;milvus-backup [command] --help&quot; <span class="hljs-keyword">for</span> more information about a command.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>2.建立備份</strong>：輸入<code translate="no">milvus-backup create --help</code> 取得建立備份的特定說明。</p>
<pre><code translate="no">Usage:
 milvus-backup create [flags]

Flags:
 -n, --name <span class="hljs-built_in">string</span>                   backup name, <span class="hljs-keyword">if</span> unset will generate a name automatically
 -c, --colls <span class="hljs-built_in">string</span>                  collectionNames to backup, use <span class="hljs-string">&#x27;,&#x27;</span> to connect multiple collections
 -d, --databases <span class="hljs-built_in">string</span>              databases to backup
 -a, --database_collections <span class="hljs-built_in">string</span>   databases <span class="hljs-keyword">and</span> collections to backup, json format: {<span class="hljs-string">&quot;db1&quot;</span>:[<span class="hljs-string">&quot;c1&quot;</span>, <span class="hljs-string">&quot;c2&quot;</span>],<span class="hljs-string">&quot;db2&quot;</span>:[]}
 -f, --force                         force backup, will skip flush, should make sure data has been stored <span class="hljs-keyword">into</span> disk <span class="hljs-keyword">when</span> <span class="hljs-keyword">using</span> it
     --meta_only                     only backup collection meta instead of data
 -h, --help                          help <span class="hljs-keyword">for</span> create
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.還原備份</strong>：要瞭解如何還原備份，請使用<code translate="no">milvus-backup restore --help</code> 。</p>
<pre><code translate="no">Usage:
 milvus-backup restore [flags]

Flags:
 -n, --name <span class="hljs-built_in">string</span>                   backup name to restore
 -c, --collections <span class="hljs-built_in">string</span>            collectionNames to restore
 -s, --suffix <span class="hljs-built_in">string</span>                 <span class="hljs-keyword">add</span> a suffix to collection name to restore
 -r, --rename <span class="hljs-built_in">string</span>                 rename collections to <span class="hljs-keyword">new</span> names, format: db1.collection1:db2.collection1_new,db1.collection2:db2.collection2_new
 -d, --databases <span class="hljs-built_in">string</span>              databases to restore, <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">set</span>, restore all databases
 -a, --database_collections <span class="hljs-built_in">string</span>   databases <span class="hljs-keyword">and</span> collections to restore, json format: {<span class="hljs-string">&quot;db1&quot;</span>:[<span class="hljs-string">&quot;c1&quot;</span>, <span class="hljs-string">&quot;c2&quot;</span>],<span class="hljs-string">&quot;db2&quot;</span>:[]}
     --meta_only                     <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, restore meta only
     --restore_index                 <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, restore index
     --use_auto_index                <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, replace vector index <span class="hljs-keyword">with</span> autoindex
     --drop_exist_collection         <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, drop existing target collection before create
     --drop_exist_index              <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, drop existing index of target collection before create
     --skip_create_collection        <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, will skip collection, use <span class="hljs-keyword">when</span> collection exist, restore index <span class="hljs-keyword">or</span> data
 -h, --help                          help <span class="hljs-keyword">for</span> restore
<button class="copy-code-btn"></button></code></pre>
<h2 id="BackupRestore-Use-Cases" class="common-anchor-header">備份/還原使用案例<button data-href="#BackupRestore-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>根據您的具體需求和配置，milvus-backup 工具可以有效地應用於幾種使用情況：</p>
<ol>
<li><p><strong>在單一 Milvus Instance 內：</strong>在相同的 Milvus 服務中，複製集合到新的集合。</p></li>
<li><p><strong>在單一 S3 與單一儲存桶的 Milvus Instances 之間：</strong>在具有不同根路徑但使用相同 S3 儲存桶的 Milvus Instances 之間傳輸集合。</p></li>
<li><p><strong>跨不同 S3 儲存桶的 Milvus Instances 之間：</strong>在相同 S3 服務的不同 S3 儲存桶之間傳輸集合。</p></li>
<li><p><strong>跨不同 S3 服務：</strong>在使用不同 S3 服務的 Milvus 實體之間複製集合。</p></li>
</ol>
<p>讓我們詳細探討每個使用個案。</p>
<h2 id="Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="common-anchor-header">使用個案 1：在一個 Milvus Instance 內備份和還原<button data-href="#Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="anchor-icon" translate="no">
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
    </button></h2><p>在同一個 Milvus 實例中備份和還原一個資料集。假設使用相同的 S3 資料桶備份一個名為「coll」的資料集，並將其還原為「coll_bak」。</p>
<h3 id="Configuration" class="common-anchor-header">設定：</h3><ul>
<li><p><strong>Milvus</strong>使用<code translate="no">bucket_A</code> 進行儲存。</p></li>
<li><p><strong>MinIO 配置：</strong></p></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backup-Workflow" class="common-anchor-header">備份工作流程</h3><p>1.設定<code translate="no">backup.yaml</code> ，將 Milvus 和 MinIO 指向正確的位置。</p>
<pre><code translate="no"><span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
  backupBucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.使用命令建立備份。</p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p>此指令將備份放置在<code translate="no">bucket_A/backup/my_backup</code> 。</p>
<p>3.將備份還原到新的資料集中。</p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>這會在同一個 Milvus 實例中，將 "coll「 還原為 」coll_bak"。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Within_One_Milvus_Instance_a232ee6e81.png" alt="Figure: The Backup and Restore Workflow Within One Milvus Instance" class="doc-image" id="figure:-the-backup-and-restore-workflow-within-one-milvus-instance" />
   <span>圖：在一個 Milvus 實例中的備份和還原工作流程</span> </span></p>
<p>圖：在一個 Milvus 實例中備份和還原工作流程</p>
<h2 id="Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="common-anchor-header">用例 2：在共用一個 S3 Bucket 的兩個 Milvus Instance 之間備份和還原<button data-href="#Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="anchor-icon" translate="no">
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
    </button></h2><p>從一個 Milvus 實例備份一個資料集，並使用相同的 S3 資料桶還原到另一個資料集，但使用不同的根路徑。假設在 milvus_A 中有一個名為「coll」的集合，我們將它備份並還原到一個名為「coll_bak」的新集合到 milvus_B。兩個 Milvus 實體共用相同的儲存空間「bucket_A」，但它們的根路徑不同。</p>
<h3 id="Configuration" class="common-anchor-header">配置</h3><ul>
<li><p><strong>Milvus A</strong>使用<code translate="no">files_A</code> 作為根路徑。</p></li>
<li><p><strong>Milvus B</strong>使用<code translate="no">files_B</code> 作為根路徑。</p></li>
<li><p><strong>Milvus A 的 MinIO 配置：</strong></p></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files_A <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Milvus B 的 MinIO 設定：</strong></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files_B <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backup-Workflow" class="common-anchor-header">備份工作流程</h3><p><strong>1.Milvus A 的備份設定</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_A
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: milvus_A <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files_A&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.執行備份指令：</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.還原 Milvus B 的配置</strong></p>
<p>修改<code translate="no">backup.yaml</code> 以指向 Milvus B，並調整 MinIO 根目錄：</p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_B
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  address: milvus_B <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files_B&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.執行還原指令：</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Sharing_One_S3_Bucket_80f282a6f4.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Sharing One S3 Bucket" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-sharing-one-s3-bucket" />
   <span>圖：共用一個 S3 Bucket 的兩個 Milvus Instance 之間的備份和還原工作流程</span> </span></p>
<h2 id="Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="common-anchor-header">用例 3：在共用一個 S3、不同資料桶的兩個 Milvus Instance 之間備份和還原<button data-href="#Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="anchor-icon" translate="no">
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
    </button></h2><p>從一個 Milvus 實例 (Milvus_A) 備份一個集合，並將其還原到相同 S3 服務內但使用不同資料桶的另一個 Milvus 實例 (Milvus_B)。</p>
<h3 id="Configuration" class="common-anchor-header">配置：</h3><ul>
<li><p><strong>Milvus</strong>使用<code translate="no">bucket_A</code> 進行儲存。</p></li>
<li><p><strong>Milvus A 的 MinIO 配置：</strong></p></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Milvus B 的 MinIO 設定：</strong></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_B <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">備份和還原工作流程</h3><p><strong>1.Milvus A 的備份設定</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_A
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.執行備份指令：</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.還原 Milvus B 的配置</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_B
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
  backupBucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.執行還原指令：</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_in_One_S3_Different_Buckets_02895ffe18.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances in One S3, Different Buckets" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-in-one-s3,-different-buckets" />
   <span>圖：兩個 Milvus Instance 在同一個 S3、不同資料桶之間的備份和還原工作流程</span> </span></p>
<p>圖：在一個 S3 的兩個 Milvus Instance 之間備份和還原工作流程，不同的資料桶</p>
<h2 id="Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="common-anchor-header">用例 4：跨不同 S3 服務的兩個 Milvus Instance 之間的備份和還原<button data-href="#Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="anchor-icon" translate="no">
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
    </button></h2><p>使用一個 S3 服務 (MinIO_A) 從 Milvus_A 備份一個名為「coll」的集合，並使用另一個 S3 服務 (MinIO_B) 將其還原到 Milvus_B，每個實體使用不同的儲存桶。</p>
<h3 id="Configuration" class="common-anchor-header">配置</h3><ul>
<li><strong>Milvus A 的 MinIO 設定：</strong></li>
</ul>
<pre><code translate="no">minio:
 address: minio_A <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Milvus B 的 MinIO 設定</strong></li>
</ul>
<pre><code translate="no"> minio:
 address: minio_B <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_B <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">備份和還原工作流程</h3><p><strong>1.適用於 Milvus A 的備份組態</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_A
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: minio_A <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.執行備份指令：</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.</strong>傳輸備份</p>
<p>使用 S3 相容的工具或 SDK，手動將備份從<code translate="no">minio_A:bucket_A/backup/my_backup</code> 複製到<code translate="no">minio_B:bucket_B/backup/my_backup</code> 。</p>
<p>4.<strong>還原 Milvus B 的組態</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_B
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: minio_B <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p>5.<strong>執行還原指令：</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Across_Different_S3_Services_6a1c55d559.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Across Different S3 Services" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-across-different-s3-services" />
   <span>圖：跨不同 S3 服務的兩個 Milvus Instance 之間的備份和還原工作流程</span> </span></p>
<p>圖：跨不同 S3 服務的兩個 Milvus Instance 之間的備份和還原工作流程跨不同 S3 服務的兩個 Milvus Instance 之間的備份和還原工作流程</p>
<h2 id="Configuration-File-Explanation" class="common-anchor-header">設定檔案說明<button data-href="#Configuration-File-Explanation" class="anchor-icon" translate="no">
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
    </button></h2><p>編輯<code translate="no">configs/backup.yaml</code> 檔案，以根據您的環境調整備份設定。以下是設定選項的細目：</p>
<p><strong>日誌</strong>：設定記錄層級和輸出偏好。</p>
<pre><code translate="no"><span class="hljs-meta"># Configures the system log output.</span>
log:
 level: info <span class="hljs-meta"># Only supports debug, info, warn, <span class="hljs-keyword">error</span>, panic, or fatal. Default &#x27;info&#x27;.</span>
 console: <span class="hljs-literal">true</span> <span class="hljs-meta"># whether print log to console</span>
 <span class="hljs-keyword">file</span>:
   rootPath: <span class="hljs-string">&quot;logs/backup.log&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Milvus 連線</strong>：設定 Milvus 實例的連線細節。</p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: localhost
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>MinIO 組態</strong>：定義備份如何與 MinIO 或其他 S3 相容的儲存設備互動。</p>
<pre><code translate="no"><span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;a-bucket&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;a-bucket&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p><a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus 備份</strong></a>工具提供強大的解決方案，可在 Milvus 實體內或跨實體備份和還原資料夾。無論您是管理單一實體內的備份、同一 S3 服務內不同實體間的備份，或是跨不同 S3 服務的備份，milvus-backup 都能彈性、精準地處理。</p>
<h3 id="Key-Takeaways" class="common-anchor-header">主要要點</h3><ol>
<li><p><strong>多功能性：</strong>Milvus-backup 支援多種情境，從簡單的實體內備份到複雜的跨服務還原。</p></li>
<li><p><strong>配置靈活性：</strong>透過適當配置<code translate="no">backup.yaml</code> 檔案，使用者可以自訂備份與還原程序，以符合特定需求，並適應不同的儲存設定與網路配置。</p></li>
<li><p><strong>安全性與控制：</strong>直接操作 S3 桶和路徑可控制資料儲存和安全性，確保備份既安全又只有授權使用者才能存取。</p></li>
</ol>
<p>有效的資料管理對於在您的應用程式中充分發揮 Milvus 的潛力至關重要。掌握 Milvus 備份工具，即使在複雜的分散式環境中，也能確保資料的耐用性和可用性。本指南讓用戶能夠實施強大的備份策略，推廣最佳實踐和高效的資料處理技術。</p>
<p>無論您是開發人員、資料工程師或 IT 專業人士，瞭解並運用 Milvus-backup 工具，都能提供可靠且有效率的資料管理解決方案，為專案的成功做出重大貢獻。</p>
