---
id: how-to-use-milvus-backup-tool-step-by-step-guide.md
title: >-
  Как использовать инструмент резервного копирования Milvus: Пошаговое
  руководство
author: Michael Mo
date: 2024-09-27T00:00:00.000Z
desc: >-
  Это руководство проведет вас через весь процесс использования Milvus Backup,
  чтобы вы могли уверенно справляться со своими потребностями в резервном
  копировании.
cover: >-
  assets.zilliz.com/How_to_Use_the_Milvus_Backup_Tool_A_Step_by_Step_Guide_411029fa4b.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, Backup and restore'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-use-milvus-backup-tool-step-by-step-guide.md'
---
<p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong></a> - это высокопроизводительная и масштабируемая <a href="https://zilliz.com/learn/what-is-vector-database">векторная база данных</a> с открытым исходным кодом, которая может хранить, индексировать и искать <a href="https://zilliz.com/learn/introduction-to-unstructured-data">неструктурированные данные</a> миллиардного масштаба с помощью высокоразмерных <a href="https://zilliz.com/glossary/vector-embeddings">векторных вкраплений</a>. Она идеально подходит для создания современных приложений искусственного интеллекта, таких как поиск с расширенными возможностями<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), семантический поиск, <a href="https://zilliz.com/blog/multimodal-rag-expanding-beyond-text-for-smarter-ai">мультимодальный поиск</a> и рекомендательные системы. Milvus эффективно работает в различных <a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">средах</a>, от ноутбуков до крупных распределенных систем. Он доступен в виде программного обеспечения с открытым исходным кодом и облачного сервиса.</p>
<p><a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a> - это инструмент для резервного копирования и восстановления данных Milvus. Он предоставляет как CLI, так и API для различных сценариев применения. В этом руководстве вы узнаете, как пользоваться Milvus Backup, и сможете уверенно справляться с задачами резервного копирования.</p>
<h2 id="Preparation" class="common-anchor-header">Подготовка<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем начать процесс резервного копирования или восстановления, необходимо настроить среду:</p>
<p><strong>1. Загрузите последнюю версию бинарного файла</strong> из<a href="https://github.com/zilliztech/milvus-backup/releases"> релизов репозитория Milvus-backup</a>. Выберите подходящую версию для вашей операционной системы:</p>
<ul>
<li><p>Для macOS: <code translate="no">milvus-backup_Darwin_arm64.tar.gz</code> или <code translate="no">milvus-backup_Darwin_x86_64.tar.gz</code></p></li>
<li><p>Для Linux: <code translate="no">milvus-backup_Linux_arm64.tar.gz</code> или <code translate="no">milvus-backup_Linux_x86_64.tar.gz</code></p></li>
</ul>
<p><strong>2. Загрузите файл конфигурации</strong> с <a href="https://github.com/zilliztech/milvus-backup/blob/main/configs/backup.yaml">GitHub</a>.</p>
<p><strong>3. Распакуйте tar-файл</strong> в нужную вам директорию и поместите <code translate="no">backup.yaml</code> в директорию <code translate="no">configs/</code> в той же распакованной папке. Убедитесь, что структура каталогов выглядит следующим образом:</p>
<pre><code translate="no">├── configs
│   └── backup.yaml
├── milvus-backup
└── README.md
<button class="copy-code-btn"></button></code></pre>
<h2 id="Command-Overview" class="common-anchor-header">Обзор команд<button data-href="#Command-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Перейдите в терминал и ознакомьтесь с командами инструмента:</p>
<p><strong>1. Общая справка</strong>: Введите <code translate="no">milvus-backup help</code>, чтобы просмотреть доступные команды и флаги.</p>
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
<p><strong>2. Создание резервной копии</strong>: Чтобы получить конкретную справку по созданию резервной копии, введите <code translate="no">milvus-backup create --help</code>.</p>
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
<p><strong>3. Восстановление резервной копии</strong>: Чтобы понять, как восстановить резервную копию, используйте <code translate="no">milvus-backup restore --help</code>.</p>
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
<h2 id="BackupRestore-Use-Cases" class="common-anchor-header">Случаи использования резервного копирования/восстановления<button data-href="#BackupRestore-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Существует несколько вариантов использования инструмента milvus-backup, в которых он может быть эффективно применен, в зависимости от ваших конкретных потребностей и конфигураций:</p>
<ol>
<li><p><strong>В рамках одного экземпляра Milvus:</strong> Копирование коллекции в новую коллекцию в рамках одной службы Milvus.</p></li>
<li><p><strong>Между экземплярами Milvus в одном S3 с одним ведром:</strong> Перенос коллекции между экземплярами Milvus с разными корневыми путями, но с использованием одного ведра S3.</p></li>
<li><p><strong>Между экземплярами Milvus в разных ведрах S3:</strong> Передача коллекции между разными ведрами S3 в рамках одной службы S3.</p></li>
<li><p><strong>Между разными службами S3:</strong> Копирование коллекции между экземплярами Milvus, использующими разные службы S3.</p></li>
</ol>
<p>Давайте рассмотрим каждый вариант использования подробнее.</p>
<h2 id="Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="common-anchor-header">Пример 1: Резервное копирование и восстановление в рамках одного экземпляра Milvus<button data-href="#Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="anchor-icon" translate="no">
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
    </button></h2><p>Резервное копирование и восстановление коллекции в рамках одного экземпляра Milvus. Предположим, что коллекция с именем "coll" резервируется и восстанавливается как "coll_bak" с использованием одного и того же ведра S3.</p>
<h3 id="Configuration" class="common-anchor-header">Конфигурация:</h3><ul>
<li><p><strong>Milvus</strong> использует <code translate="no">bucket_A</code> для хранения данных.</p></li>
<li><p><strong>Конфигурация MinIO:</strong></p></li>
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
<h3 id="Backup-Workflow" class="common-anchor-header">Рабочий процесс резервного копирования</h3><p>1. Настройте <code translate="no">backup.yaml</code>, чтобы указать Milvus и MinIO на правильные места.</p>
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
<p>2. Создайте резервную копию с помощью команды.</p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p>Эта команда помещает резервную копию в <code translate="no">bucket_A/backup/my_backup</code>.</p>
<p>3. Восстановите резервную копию в новую коллекцию.</p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>При этом "coll" восстанавливается как "coll_bak" в том же экземпляре Milvus.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Within_One_Milvus_Instance_a232ee6e81.png" alt="Figure: The Backup and Restore Workflow Within One Milvus Instance" class="doc-image" id="figure:-the-backup-and-restore-workflow-within-one-milvus-instance" />
   <span>Рисунок: Рабочий процесс резервного копирования и восстановления в одном экземпляре Milvus</span> </span></p>
<p>Рисунок: Рабочий процесс резервного копирования и восстановления в одном экземпляре Milvus</p>
<h2 id="Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="common-anchor-header">Пример использования 2: Резервное копирование и восстановление между двумя экземплярами Milvus, совместно использующими один ведро S3<button data-href="#Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="anchor-icon" translate="no">
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
    </button></h2><p>Создайте резервную копию коллекции в одном экземпляре Milvus и восстановите ее в другом, используя один и тот же бакет S3, но с разными корневыми путями. Предположим, что в milvus_A есть коллекция с именем "coll", мы создаем резервную копию и восстанавливаем ее в новую коллекцию с именем "coll_bak" в milvus_B. Оба экземпляра Milvus используют одно и то же ведро "bucket_A" в качестве хранилища, но у них разные корневые пути.</p>
<h3 id="Configuration" class="common-anchor-header">Конфигурация</h3><ul>
<li><p><strong>Milvus A</strong> использует <code translate="no">files_A</code> в качестве корневого пути.</p></li>
<li><p><strong>Milvus B</strong> использует <code translate="no">files_B</code> в качестве корневого пути.</p></li>
<li><p><strong>Конфигурация MinIO для Milvus A:</strong></p></li>
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
<li><strong>Конфигурация MinIO для Milvus B:</strong></li>
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
<h3 id="Backup-Workflow" class="common-anchor-header">Рабочий процесс резервного копирования</h3><p><strong>1. Конфигурация резервного копирования для Milvus A</strong></p>
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
<p><strong>2. Выполните команду резервного копирования:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Восстановление конфигурации для Milvus B</strong></p>
<p>Измените <code translate="no">backup.yaml</code> так, чтобы он указывал на Milvus B, и настройте корневой путь MinIO:</p>
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
<p><strong>4. Выполните команду восстановления:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Sharing_One_S3_Bucket_80f282a6f4.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Sharing One S3 Bucket" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-sharing-one-s3-bucket" />
   <span>Рисунок: Рабочий процесс резервного копирования и восстановления между двумя экземплярами Milvus, совместно использующими одно ведро S3</span> </span></p>
<h2 id="Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="common-anchor-header">Пример 3: Резервное копирование и восстановление между двумя экземплярами Milvus в одном S3, но в разных ведрах<button data-href="#Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="anchor-icon" translate="no">
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
    </button></h2><p>Резервное копирование коллекции из экземпляра Milvus (Milvus_A) и ее восстановление в другом экземпляре Milvus (Milvus_B) в рамках одной службы S3, но с использованием разных ведер.</p>
<h3 id="Configuration" class="common-anchor-header">Конфигурация:</h3><ul>
<li><p><strong>Milvus</strong> использует <code translate="no">bucket_A</code> для хранения данных.</p></li>
<li><p><strong>Конфигурация MinIO для Milvus A:</strong></p></li>
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
<li><strong>Конфигурация MinIO для Milvus B:</strong></li>
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
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">Рабочий процесс резервного копирования и восстановления</h3><p><strong>1. Конфигурация резервного копирования для Milvus A</strong></p>
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
<p><strong>2. Выполните команду резервного копирования:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Восстановление конфигурации для Milvus B</strong></p>
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
<p><strong>4. Выполните команду восстановления:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_in_One_S3_Different_Buckets_02895ffe18.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances in One S3, Different Buckets" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-in-one-s3,-different-buckets" />
   <span>Рисунок: Рабочий процесс резервного копирования и восстановления между двумя экземплярами Milvus в одном S3, разные ведра</span> </span></p>
<p>Рисунок: Рабочий процесс резервного копирования и восстановления между двумя экземплярами Milvus в одном S3, разные баки</p>
<h2 id="Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="common-anchor-header">Пример 4: Резервное копирование и восстановление между двумя экземплярами Milvus в разных службах S3<button data-href="#Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="anchor-icon" translate="no">
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
    </button></h2><p>Резервное копирование коллекции с именем "coll" из Milvus_A с помощью одного сервиса S3 (MinIO_A) и восстановление ее в Milvus_B с помощью другого сервиса S3 (MinIO_B), причем каждый экземпляр использует разные ведра хранения.</p>
<h3 id="Configuration" class="common-anchor-header">Конфигурация</h3><ul>
<li><strong>Конфигурация MinIO для Milvus A:</strong></li>
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
<li><strong>Конфигурация MinIO для Milvus B</strong></li>
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
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">Рабочий процесс резервного копирования и восстановления</h3><p><strong>1. Конфигурация резервного копирования для Milvus A</strong></p>
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
<p><strong>2. Выполните команду резервного копирования:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.</strong> Перенос резервной копии</p>
<p>Вручную скопируйте резервную копию с <code translate="no">minio_A:bucket_A/backup/my_backup</code> на <code translate="no">minio_B:bucket_B/backup/my_backup</code> с помощью инструмента или SDK, совместимого с S3.</p>
<p>4. <strong>Восстановление конфигурации для Milvus B</strong></p>
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
<p>5. <strong>Выполните команду восстановления:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Across_Different_S3_Services_6a1c55d559.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Across Different S3 Services" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-across-different-s3-services" />
   <span>Рисунок: Рабочий процесс резервного копирования и восстановления между двумя экземплярами Milvus на разных сервисах S3</span> </span></p>
<p>Рисунок: Рабочий процесс резервного копирования и восстановления между двумя экземплярами Milvus через разные службы S3</p>
<h2 id="Configuration-File-Explanation" class="common-anchor-header">Пояснения к файлу конфигурации<button data-href="#Configuration-File-Explanation" class="anchor-icon" translate="no">
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
    </button></h2><p>Отредактируйте файл <code translate="no">configs/backup.yaml</code>, чтобы адаптировать настройки резервного копирования к вашей среде. Ниже приведена разбивка опций конфигурации:</p>
<p><strong>Ведение журнала</strong>: Настройте уровни ведения журнала и параметры вывода.</p>
<pre><code translate="no"><span class="hljs-meta"># Configures the system log output.</span>
log:
 level: info <span class="hljs-meta"># Only supports debug, info, warn, <span class="hljs-keyword">error</span>, panic, or fatal. Default &#x27;info&#x27;.</span>
 console: <span class="hljs-literal">true</span> <span class="hljs-meta"># whether print log to console</span>
 <span class="hljs-keyword">file</span>:
   rootPath: <span class="hljs-string">&quot;logs/backup.log&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Подключение Milvus</strong>: Задайте параметры подключения для экземпляра Milvus.</p>
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
<p><strong>Конфигурация MinIO</strong>: Определите, как резервные копии будут взаимодействовать с MinIO или другим S3-совместимым хранилищем.</p>
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
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Инструмент <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a> представляет собой надежное решение для резервного копирования и восстановления коллекций внутри и между экземплярами Milvus. Независимо от того, управляете ли вы резервным копированием в рамках одного экземпляра, между экземплярами в одном сервисе S3 или между разными сервисами S3, milvus-backup справится со всем гибко и точно.</p>
<h3 id="Key-Takeaways" class="common-anchor-header">Основные выводы</h3><ol>
<li><p><strong>Универсальность:</strong> Milvus-backup поддерживает множество сценариев, от простого резервного копирования внутри инстанса до сложных межсервисных восстановлений.</p></li>
<li><p><strong>Гибкость конфигурации:</strong> Настроив соответствующим образом файл <code translate="no">backup.yaml</code>, пользователи могут настроить процессы резервного копирования и восстановления в соответствии с конкретными потребностями, учитывая различные системы хранения и сетевые конфигурации.</p></li>
<li><p><strong>Безопасность и контроль:</strong> Прямое управление ведрами S3 и путями позволяет контролировать хранение и безопасность данных, обеспечивая сохранность резервных копий и доступ к ним только для авторизованных пользователей.</p></li>
</ol>
<p>Эффективное управление данными имеет решающее значение для использования всего потенциала Milvus в ваших приложениях. Освоив инструмент резервного копирования Milvus, вы сможете обеспечить долговечность и доступность данных даже в сложных распределенных средах. Это руководство поможет пользователям реализовать надежные стратегии резервного копирования, пропагандируя лучшие практики и эффективные методы работы с данными.</p>
<p>Независимо от того, являетесь ли вы разработчиком, инженером по обработке данных или ИТ-специалистом, понимание и использование инструмента Milvus-backup может внести значительный вклад в успех вашего проекта, обеспечив надежные и эффективные решения по управлению данными.</p>
