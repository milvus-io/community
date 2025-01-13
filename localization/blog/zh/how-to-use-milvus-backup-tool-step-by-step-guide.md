---
id: how-to-use-milvus-backup-tool-step-by-step-guide.md
title: 如何使用 Milvus 备份工具：分步指南
author: Michael Mo
date: 2024-09-27T00:00:00.000Z
desc: 本指南将指导你使用 Milvus 备份，确保你能自信地处理备份需求。
cover: >-
  assets.zilliz.com/How_to_Use_the_Milvus_Backup_Tool_A_Step_by_Step_Guide_411029fa4b.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, Backup and restore'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-use-milvus-backup-tool-step-by-step-guide.md'
---
<p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong></a>是一个开源、高性能和高度可扩展的<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>，可以通过高维<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>来存储、索引和搜索十亿规模的<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>。它非常适合构建现代人工智能应用，如检索增强生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（RAG</a>）、语义搜索、<a href="https://zilliz.com/blog/multimodal-rag-expanding-beyond-text-for-smarter-ai">多模态搜索</a>和推荐系统。Milvus 可在从笔记本电脑到大规模分布式系统的各种<a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">环境</a>中高效运行。它以开源软件和云服务的形式提供。</p>
<p><a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus 备份</strong></a>是用于备份和恢复 Milvus 数据的工具。它提供 CLI 和 API 以适应不同的应用场景。本指南将指导你如何使用 Milvus 备份，确保你能自信地处理备份需求。</p>
<h2 id="Preparation" class="common-anchor-header">准备工作<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>在开始备份或还原过程之前，您需要设置您的环境：</p>
<p><strong>1.</strong>从<a href="https://github.com/zilliztech/milvus-backup/releases"> Milvus-backup 版本库中</a><strong>下载最新的二进制文件</strong>。选择适合您操作系统的版本：</p>
<ul>
<li><p>对于 macOS：<code translate="no">milvus-backup_Darwin_arm64.tar.gz</code> 或<code translate="no">milvus-backup_Darwin_x86_64.tar.gz</code></p></li>
<li><p>Linux:<code translate="no">milvus-backup_Linux_arm64.tar.gz</code> 或<code translate="no">milvus-backup_Linux_x86_64.tar.gz</code></p></li>
</ul>
<p><strong>2.</strong>从<a href="https://github.com/zilliztech/milvus-backup/blob/main/configs/backup.yaml">GitHub</a><strong>下载配置文件</strong>。</p>
<p><strong>3.</strong>3.<strong>将 tar 文件解压缩</strong>到首选目录，并将<code translate="no">backup.yaml</code> 放在同一解压缩文件夹内的<code translate="no">configs/</code> 目录中。确保目录结构如下：</p>
<pre><code translate="no">├── configs
│   └── backup.yaml
├── milvus-backup
└── README.md
<button class="copy-code-btn"></button></code></pre>
<h2 id="Command-Overview" class="common-anchor-header">命令概述<button data-href="#Command-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>导航至终端，熟悉工具的命令：</p>
<p><strong>1.一般帮助</strong>：键入<code translate="no">milvus-backup help</code> 查看可用命令和标记。</p>
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
<p><strong>2.创建备份</strong>：输入<code translate="no">milvus-backup create --help</code> 获取创建备份的具体帮助。</p>
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
<p><strong>3.恢复备份</strong>：要了解如何恢复备份，请使用<code translate="no">milvus-backup restore --help</code> 。</p>
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
<h2 id="BackupRestore-Use-Cases" class="common-anchor-header">备份/还原用例<button data-href="#BackupRestore-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>根据您的具体需求和配置，milvus-backup 工具可有效应用于以下几种使用情况：</p>
<ol>
<li><p><strong>在单个 Milvus 实例内：</strong>在同一个 Milvus 服务中，将一个 Collections 复制到一个新的 Collections。</p></li>
<li><p><strong>在单个 S3 的 Milvus 实例之间使用一个 Bucket：</strong>在具有不同根路径但使用相同 S3 存储桶的 Milvus 实例之间传输 Collections。</p></li>
<li><p><strong>跨不同 S3 存储桶的 Milvus 实例之间：</strong>在同一 S3 服务的不同 S3 存储桶之间传输 Collections。</p></li>
<li><p><strong>跨不同 S3 服务：</strong>在使用不同 S3 服务的 Milvus 实例之间复制 Collections。</p></li>
</ol>
<p>让我们详细了解每种用例。</p>
<h2 id="Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="common-anchor-header">用例 1：在一个 Milvus 实例内备份和还原<button data-href="#Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="anchor-icon" translate="no">
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
    </button></h2><p>在同一个 Milvus 实例内备份和还原一个 Collections。假设使用同一个 S3 存储桶备份名为 "coll "的 Collections 并将其还原为 "coll_bak"。</p>
<h3 id="Configuration" class="common-anchor-header">配置：</h3><ul>
<li><p><strong>Milvus</strong>使用<code translate="no">bucket_A</code> 进行存储。</p></li>
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
<h3 id="Backup-Workflow" class="common-anchor-header">备份工作流程</h3><p>1.配置<code translate="no">backup.yaml</code> ，将 Milvus 和 MinIO 指向正确的位置。</p>
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
<p>2.使用命令创建备份。</p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p>该命令将备份放在<code translate="no">bucket_A/backup/my_backup</code> 中。</p>
<p>3.3. 将备份还原到新的 Collections 中。</p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>这将在同一 Milvus 实例中把 "coll "恢复为 "coll_bak"。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Within_One_Milvus_Instance_a232ee6e81.png" alt="Figure: The Backup and Restore Workflow Within One Milvus Instance" class="doc-image" id="figure:-the-backup-and-restore-workflow-within-one-milvus-instance" />
   <span>图一个 Milvus 实例内的备份和还原工作流程</span> </span></p>
<p>图一个 Milvus 实例内的备份和还原工作流程</p>
<h2 id="Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="common-anchor-header">用例 2：在共享一个 S3 存储桶的两个 Milvus 实例之间进行备份和还原<button data-href="#Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="anchor-icon" translate="no">
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
    </button></h2><p>从一个 Milvus 实例备份一个 Collections，然后使用相同的 S3 存储桶但使用不同的根路径将其还原到另一个实例。假设在 milvus_A 中有一个名为 "coll "的 Collections，我们将其备份并恢复到 milvus_B 中名为 "coll_bak "的新 Collections。这两个 Milvus 实例共享同一个存储桶 "bucket_A"，但它们的根路径不同。</p>
<h3 id="Configuration" class="common-anchor-header">配置</h3><ul>
<li><p><strong>Milvus A</strong>使用<code translate="no">files_A</code> 作为根路径。</p></li>
<li><p><strong>Milvus B</strong>使用<code translate="no">files_B</code> 作为根路径。</p></li>
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
<li><strong>Milvus B 的 MinIO 配置：</strong></li>
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
<h3 id="Backup-Workflow" class="common-anchor-header">备份工作流程</h3><p><strong>1.Milvus A 的备份配置</strong></p>
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
<p><strong>2.执行备份命令：</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.恢复 Milvus B 的配置</strong></p>
<p>修改<code translate="no">backup.yaml</code> ，指向 Milvus B，并调整 MinIO 根路径：</p>
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
<p><strong>4.执行还原命令：</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Sharing_One_S3_Bucket_80f282a6f4.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Sharing One S3 Bucket" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-sharing-one-s3-bucket" />
   <span>图共享一个 S3 存储桶的两个 Milvus 实例之间的备份和还原工作流程</span> </span></p>
<h2 id="Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="common-anchor-header">用例 3：在一个 S3、不同桶的两个 Milvus 实例之间进行备份和还原<button data-href="#Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="anchor-icon" translate="no">
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
    </button></h2><p>从一个 Milvus 实例 (Milvus_A) 备份一个 Collections，并将其还原到同一 S3 服务中但使用不同桶的另一个 Milvus 实例 (Milvus_B)。</p>
<h3 id="Configuration" class="common-anchor-header">配置：</h3><ul>
<li><p><strong>Milvus</strong>使用<code translate="no">bucket_A</code> 进行存储。</p></li>
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
<li><strong>Milvus B 的 MinIO 配置：</strong></li>
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
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">备份和还原工作流程</h3><p><strong>1.Milvus A 的备份配置</strong></p>
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
<p><strong>2.执行备份命令：</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.恢复 Milvus B 的配置</strong></p>
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
<p><strong>4.执行还原命令：</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_in_One_S3_Different_Buckets_02895ffe18.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances in One S3, Different Buckets" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-in-one-s3,-different-buckets" />
   <span>图一个 S3 中不同桶的两个 Milvus 实例之间的备份和还原工作流程</span> </span></p>
<p>图一个 S3 中不同桶的两个 Milvus 实例之间的备份和还原工作流程</p>
<h2 id="Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="common-anchor-header">用例 4：跨不同 S3 服务的两个 Milvus 实例之间的备份和还原<button data-href="#Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="anchor-icon" translate="no">
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
    </button></h2><p>便于使用一个 S3 服务 (MinIO_A) 从 Milvus_A 备份名为 "coll "的 Collect，并使用另一个 S3 服务 (MinIO_B) 将其还原到 Milvus_B，每个实例使用不同的存储桶。</p>
<h3 id="Configuration" class="common-anchor-header">配置</h3><ul>
<li><strong>Milvus A 的 MinIO 配置：</strong></li>
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
<li><strong>Milvus B 的 MinIO 配置</strong></li>
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
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">备份和还原工作流程</h3><p><strong>1.Milvus A 的备份配置</strong></p>
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
<p><strong>2.执行备份命令：</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.</strong>传输备份</p>
<p>使用 S3 兼容工具或 SDK 手动将备份从<code translate="no">minio_A:bucket_A/backup/my_backup</code> 复制到<code translate="no">minio_B:bucket_B/backup/my_backup</code> 。</p>
<p>4.<strong>恢复 Milvus B 的配置</strong></p>
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
<p>5.<strong>执行还原命令：</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Across_Different_S3_Services_6a1c55d559.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Across Different S3 Services" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-across-different-s3-services" />
   <span>图跨不同 S3 服务的两个 Milvus 实例之间的备份和还原工作流程</span> </span></p>
<p>图：跨不同 S3 服务的两个 Milvus 实例之间的备份和还原工作流程跨不同 S3 服务的两个 Milvus 实例之间的备份和还原工作流程</p>
<h2 id="Configuration-File-Explanation" class="common-anchor-header">配置文件说明<button data-href="#Configuration-File-Explanation" class="anchor-icon" translate="no">
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
    </button></h2><p>编辑<code translate="no">configs/backup.yaml</code> 文件，根据你的环境调整备份设置。下面是配置选项的细目：</p>
<p><strong>日志记录</strong>：配置日志级别和输出首选项。</p>
<pre><code translate="no"><span class="hljs-meta"># Configures the system log output.</span>
log:
 level: info <span class="hljs-meta"># Only supports debug, info, warn, <span class="hljs-keyword">error</span>, panic, or fatal. Default &#x27;info&#x27;.</span>
 console: <span class="hljs-literal">true</span> <span class="hljs-meta"># whether print log to console</span>
 <span class="hljs-keyword">file</span>:
   rootPath: <span class="hljs-string">&quot;logs/backup.log&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Milvus 连接</strong>：设置 Milvus 实例的连接详情。</p>
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
<p><strong>MinIO 配置</strong>：定义备份与 MinIO 或其他 S3 兼容存储的交互方式。</p>
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
    </button></h2><p><a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus 备份</strong></a>工具为在 Milvus 实例内和跨 Milvus 实例备份和恢复 Collections 提供了强大的解决方案。无论你是管理单个实例内、同一 S3 服务中不同实例间的备份，还是管理不同 S3 服务间的备份，milvus-backup 都能灵活、精确地处理。</p>
<h3 id="Key-Takeaways" class="common-anchor-header">主要启示</h3><ol>
<li><p><strong>多功能性：</strong>Milvus-backup 支持多种场景，从简单的实例内备份到复杂的跨服务恢复。</p></li>
<li><p><strong>配置灵活：</strong>通过适当配置<code translate="no">backup.yaml</code> 文件，用户可以定制备份和恢复流程，以适应不同的存储设置和网络配置，从而满足特定需求。</p></li>
<li><p><strong>安全和控制：</strong>直接操作 S3 存储桶和路径可实现对数据存储和安全性的控制，确保备份既安全又只有授权用户才能访问。</p></li>
</ol>
<p>有效的数据管理对于在应用中充分发挥 Milvus 的潜力至关重要。通过掌握 Milvus 备份工具，即使在复杂的 Distributed 环境中，也能确保数据的持久性和可用性。本指南帮助用户实施稳健的备份策略，推广最佳实践和高效的数据处理技术。</p>
<p>无论你是开发人员、数据工程师，还是 IT 专业人士，了解并使用 Milvus-backup 工具，都能通过提供可靠、高效的数据管理解决方案，极大地促进项目的成功。</p>
