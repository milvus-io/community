---
id: how-to-use-milvus-backup-tool-step-by-step-guide.md
title: 'Cara Menggunakan Alat Pencadangan Milvus: Panduan Langkah-demi-Langkah'
author: Michael Mo
date: 2024-09-27T00:00:00.000Z
desc: >-
  Panduan ini akan memandu Anda melalui proses penggunaan Milvus Backup,
  memastikan bahwa Anda dapat dengan percaya diri menangani kebutuhan backup
  Anda.
cover: >-
  assets.zilliz.com/How_to_Use_the_Milvus_Backup_Tool_A_Step_by_Step_Guide_411029fa4b.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, Backup and restore'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-use-milvus-backup-tool-step-by-step-guide.md'
---
<p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong></a> adalah <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> sumber terbuka, berkinerja tinggi, dan sangat skalabel yang dapat menyimpan, mengindeks, dan mencari <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data tak terstruktur</a> berskala miliaran melalui penyematan <a href="https://zilliz.com/glossary/vector-embeddings">vektor</a> berdimensi tinggi. Sangat cocok untuk membangun aplikasi AI modern seperti retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>, pencarian semantik, <a href="https://zilliz.com/blog/multimodal-rag-expanding-beyond-text-for-smarter-ai">pencarian multimodal</a>, dan sistem rekomendasi. Milvus berjalan secara efisien di berbagai <a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">lingkungan</a>, mulai dari laptop hingga sistem terdistribusi berskala besar. Ini tersedia sebagai perangkat lunak sumber terbuka dan layanan cloud.</p>
<p><a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a> adalah alat untuk mencadangkan dan memulihkan data Milvus. Alat ini menyediakan CLI dan API untuk mengakomodasi berbagai skenario aplikasi. Panduan ini akan memandu Anda melalui proses penggunaan Milvus Backup, memastikan bahwa Anda dapat dengan percaya diri menangani kebutuhan pencadangan Anda.</p>
<h2 id="Preparation" class="common-anchor-header">Persiapan<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum memulai proses pencadangan atau pemulihan, Anda perlu mengatur lingkungan Anda:</p>
<p><strong>1. Unduh biner terbaru</strong> dari<a href="https://github.com/zilliztech/milvus-backup/releases"> rilis repositori Milvus-backup</a>. Pilih versi yang sesuai untuk sistem operasi Anda:</p>
<ul>
<li><p>Untuk macOS: <code translate="no">milvus-backup_Darwin_arm64.tar.gz</code> atau <code translate="no">milvus-backup_Darwin_x86_64.tar.gz</code></p></li>
<li><p>Untuk Linux: <code translate="no">milvus-backup_Linux_arm64.tar.gz</code> atau <code translate="no">milvus-backup_Linux_x86_64.tar.gz</code></p></li>
</ul>
<p><strong>2. Unduh file konfigurasi</strong> dari <a href="https://github.com/zilliztech/milvus-backup/blob/main/configs/backup.yaml">GitHub</a>.</p>
<p><strong>3. Ekstrak berkas tar</strong> ke direktori pilihan Anda dan letakkan <code translate="no">backup.yaml</code> di direktori <code translate="no">configs/</code> di dalam folder yang sama yang telah diekstrak. Pastikan struktur direktori Anda terlihat seperti berikut:</p>
<pre><code translate="no">├── configs
│   └── backup.yaml
├── milvus-backup
└── README.md
<button class="copy-code-btn"></button></code></pre>
<h2 id="Command-Overview" class="common-anchor-header">Ikhtisar Perintah<button data-href="#Command-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Navigasikan ke terminal Anda dan biasakan diri Anda dengan perintah-perintah alat ini:</p>
<p><strong>1. Bantuan Umum</strong>: Ketik <code translate="no">milvus-backup help</code> untuk melihat perintah dan flag yang tersedia.</p>
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
<p><strong>2. Membuat Cadangan</strong>: Dapatkan bantuan khusus untuk membuat cadangan dengan mengetik <code translate="no">milvus-backup create --help</code>.</p>
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
<p><strong>3. Memulihkan Cadangan</strong>: Untuk memahami cara memulihkan cadangan, gunakan <code translate="no">milvus-backup restore --help</code>.</p>
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
<h2 id="BackupRestore-Use-Cases" class="common-anchor-header">Kasus Penggunaan Pencadangan/Pemulihan Cadangan<button data-href="#BackupRestore-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Ada beberapa kasus penggunaan di mana alat pencadangan milvus dapat diterapkan secara efektif, tergantung pada kebutuhan dan konfigurasi spesifik Anda:</p>
<ol>
<li><p><strong>Dalam Satu Instance Milvus:</strong> Menyalin koleksi ke koleksi baru dalam layanan Milvus yang sama.</p></li>
<li><p><strong>Antar Instance Milvus dalam S3 Tunggal dengan Satu Bucket:</strong> Mentransfer koleksi antar instance Milvus dengan jalur root yang berbeda namun menggunakan bucket S3 yang sama.</p></li>
<li><p><strong>Antara Instance Milvus di Seluruh Bucket S3 yang Berbeda:</strong> Mentransfer koleksi antar bucket S3 yang berbeda dalam layanan S3 yang sama.</p></li>
<li><p><strong>Lintas Layanan S3 yang Berbeda:</strong> Menyalin koleksi antar instance Milvus yang menggunakan layanan S3 yang berbeda.</p></li>
</ol>
<p>Mari kita jelajahi setiap kasus penggunaan secara detail.</p>
<h2 id="Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="common-anchor-header">Kasus Penggunaan 1: Pencadangan dan Pemulihan Dalam Satu Instance Milvus<button data-href="#Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="anchor-icon" translate="no">
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
    </button></h2><p>Mencadangkan dan memulihkan koleksi di dalam instance Milvus yang sama. Asumsikan koleksi bernama "coll" dicadangkan dan dipulihkan sebagai "coll_bak" menggunakan bucket S3 yang sama.</p>
<h3 id="Configuration" class="common-anchor-header">Konfigurasi:</h3><ul>
<li><p><strong>Milvus</strong> menggunakan <code translate="no">bucket_A</code> untuk penyimpanan.</p></li>
<li><p><strong>Konfigurasi MinIO:</strong></p></li>
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
<h3 id="Backup-Workflow" class="common-anchor-header">Alur Kerja Pencadangan</h3><p>1. Konfigurasikan <code translate="no">backup.yaml</code> untuk mengarahkan Milvus dan MinIO ke lokasi yang benar.</p>
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
<p>2. Buat cadangan menggunakan perintah.</p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p>Perintah ini menempatkan cadangan di <code translate="no">bucket_A/backup/my_backup</code>.</p>
<p>3. Kembalikan cadangan ke koleksi baru.</p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>Ini akan mengembalikan "coll" sebagai "coll_bak" di dalam instans Milvus yang sama.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Within_One_Milvus_Instance_a232ee6e81.png" alt="Figure: The Backup and Restore Workflow Within One Milvus Instance" class="doc-image" id="figure:-the-backup-and-restore-workflow-within-one-milvus-instance" />
   <span>Gambar: Alur Kerja Pencadangan dan Pemulihan Dalam Satu Instance Milvus</span> </span></p>
<p>Gambar: Alur Kerja Pencadangan dan Pemulihan Dalam Satu Instance Milvus</p>
<h2 id="Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="common-anchor-header">Kasus Penggunaan 2: Pencadangan dan Pemulihan Antara Dua Instance Milvus yang Berbagi Satu Bucket S3<button data-href="#Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="anchor-icon" translate="no">
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
    </button></h2><p>Mencadangkan koleksi dari satu instance Milvus dan mengembalikannya ke instance lainnya menggunakan bucket S3 yang sama tetapi dengan jalur root yang berbeda. Dengan asumsi ada koleksi bernama "coll" di milvus_A, kita mencadangkan dan mengembalikannya ke koleksi baru bernama "coll_bak" ke milvus_B. Kedua instans Milvus berbagi bucket "bucket_A" yang sama sebagai penyimpanan, tetapi memiliki jalur root yang berbeda.</p>
<h3 id="Configuration" class="common-anchor-header">Konfigurasi</h3><ul>
<li><p><strong>Milvus A</strong> menggunakan <code translate="no">files_A</code> sebagai jalur root.</p></li>
<li><p><strong>Milvus B</strong> menggunakan <code translate="no">files_B</code> sebagai root path.</p></li>
<li><p><strong>Konfigurasi MinIO untuk Milvus A:</strong></p></li>
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
<li><strong>Konfigurasi MinIO untuk Milvus B:</strong></li>
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
<h3 id="Backup-Workflow" class="common-anchor-header">Alur Kerja Pencadangan</h3><p><strong>1. Konfigurasi Cadangan untuk Milvus A</strong></p>
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
<p><strong>2. Jalankan perintah pencadangan:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Kembalikan Konfigurasi untuk Milvus B</strong></p>
<p>Ubah <code translate="no">backup.yaml</code> untuk mengarahkan ke Milvus B dan sesuaikan jalur root MinIO:</p>
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
<p><strong>4. Jalankan perintah pemulihan:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Sharing_One_S3_Bucket_80f282a6f4.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Sharing One S3 Bucket" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-sharing-one-s3-bucket" />
   <span>Gambar: Alur Kerja Pencadangan dan Pemulihan Antara Dua Instance Milvus yang Berbagi Satu Bucket S3</span> </span></p>
<h2 id="Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="common-anchor-header">Kasus Penggunaan 3: Pencadangan dan Pemulihan Antara Dua Instansi Milvus dalam Satu S3, Bucket Berbeda<button data-href="#Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="anchor-icon" translate="no">
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
    </button></h2><p>Mencadangkan koleksi dari instance Milvus (Milvus_A) dan mengembalikannya ke instance Milvus lain (Milvus_B) dalam layanan S3 yang sama tetapi menggunakan bucket yang berbeda.</p>
<h3 id="Configuration" class="common-anchor-header">Konfigurasi:</h3><ul>
<li><p><strong>Milvus</strong> menggunakan <code translate="no">bucket_A</code> untuk penyimpanan.</p></li>
<li><p><strong>Konfigurasi MinIO untuk Milvus A:</strong></p></li>
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
<li><strong>Konfigurasi MinIO untuk Milvus B:</strong></li>
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
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">Alur Kerja Pencadangan dan Pemulihan</h3><p><strong>1. Konfigurasi Cadangan untuk Milvus A</strong></p>
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
<p><strong>2. Jalankan perintah pencadangan:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Konfigurasi Pemulihan untuk Milvus B</strong></p>
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
<p><strong>4. Jalankan perintah pemulihan:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_in_One_S3_Different_Buckets_02895ffe18.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances in One S3, Different Buckets" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-in-one-s3,-different-buckets" />
   <span>Gambar: Alur Kerja Pencadangan dan Pemulihan Antara Dua Instance Milvus dalam Satu S3, Bucket yang Berbeda</span> </span></p>
<p>Gambar: Alur Kerja Pencadangan dan Pemulihan Antara Dua Instance Milvus dalam Satu S3, Bucket Berbeda</p>
<h2 id="Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="common-anchor-header">Kasus Penggunaan 4: Backup dan Restore Antara Dua Instance Milvus di Layanan S3 yang Berbeda<button data-href="#Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk memfasilitasi backup sebuah koleksi bernama "coll" dari Milvus_A menggunakan satu layanan S3 (MinIO_A) dan mengembalikannya ke dalam Milvus_B menggunakan layanan S3 yang berbeda (MinIO_B), dengan masing-masing instance menggunakan bucket penyimpanan yang berbeda.</p>
<h3 id="Configuration" class="common-anchor-header">Konfigurasi</h3><ul>
<li><strong>Konfigurasi MinIO untuk Milvus A:</strong></li>
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
<li><strong>Konfigurasi MinIO untuk Milvus B</strong></li>
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
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">Alur Kerja Pencadangan dan Pemulihan</h3><p><strong>1. Konfigurasi Cadangan untuk Milvus A</strong></p>
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
<p><strong>2. Jalankan perintah pencadangan:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.</strong> Mentransfer Cadangan</p>
<p>Salin cadangan secara manual dari <code translate="no">minio_A:bucket_A/backup/my_backup</code> ke <code translate="no">minio_B:bucket_B/backup/my_backup</code> menggunakan alat yang kompatibel dengan S3 atau SDK.</p>
<p>4. <strong>Kembalikan Konfigurasi untuk Milvus B</strong></p>
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
<p>5. <strong>Jalankan perintah pemulihan:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Across_Different_S3_Services_6a1c55d559.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Across Different S3 Services" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-across-different-s3-services" />
   <span>Gambar: Alur Kerja Pencadangan dan Pemulihan Antara Dua Instance Milvus di Layanan S3 yang Berbeda</span> </span></p>
<p>Gambar: Alur Kerja Pencadangan dan Pemulihan Antara Dua Instance Milvus di Layanan S3 yang Berbeda</p>
<h2 id="Configuration-File-Explanation" class="common-anchor-header">Penjelasan File Konfigurasi<button data-href="#Configuration-File-Explanation" class="anchor-icon" translate="no">
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
    </button></h2><p>Edit file <code translate="no">configs/backup.yaml</code> untuk menyesuaikan pengaturan pencadangan dengan lingkungan Anda. Berikut ini adalah rincian opsi konfigurasi:</p>
<p><strong>Pencatatan</strong>: Mengonfigurasi tingkat pencatatan dan preferensi keluaran.</p>
<pre><code translate="no"><span class="hljs-meta"># Configures the system log output.</span>
log:
 level: info <span class="hljs-meta"># Only supports debug, info, warn, <span class="hljs-keyword">error</span>, panic, or fatal. Default &#x27;info&#x27;.</span>
 console: <span class="hljs-literal">true</span> <span class="hljs-meta"># whether print log to console</span>
 <span class="hljs-keyword">file</span>:
   rootPath: <span class="hljs-string">&quot;logs/backup.log&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Koneksi Milvus</strong>: Mengatur detail koneksi untuk instance Milvus Anda.</p>
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
<p><strong>Konfigurasi MinIO</strong>: Tentukan bagaimana cadangan berinteraksi dengan MinIO atau penyimpanan yang kompatibel dengan S3.</p>
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
<h2 id="Conclusion" class="common-anchor-header">Kesimpulan<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Alat Pencadangan <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus</strong></a> menyediakan solusi yang tangguh untuk mencadangkan dan memulihkan koleksi di dalam dan di seluruh instance Milvus. Baik Anda mengelola cadangan dalam satu instance, antar instance dalam layanan S3 yang sama, atau di seluruh layanan S3 yang berbeda, milvus-backup menangani semuanya dengan fleksibilitas dan presisi.</p>
<h3 id="Key-Takeaways" class="common-anchor-header">Hal-hal penting yang bisa diambil dari milvus-backup</h3><ol>
<li><p><strong>Fleksibilitas:</strong> Milvus-backup mendukung berbagai skenario, mulai dari pencadangan intra-instance yang sederhana hingga pemulihan lintas-layanan yang kompleks.</p></li>
<li><p><strong>Fleksibilitas Konfigurasi:</strong> Dengan mengonfigurasi file <code translate="no">backup.yaml</code> secara tepat, pengguna dapat menyesuaikan proses pencadangan dan pemulihan agar sesuai dengan kebutuhan spesifik, mengakomodasi pengaturan penyimpanan dan konfigurasi jaringan yang berbeda.</p></li>
<li><p><strong>Keamanan dan Kontrol:</strong> Manipulasi langsung dari bucket dan jalur S3 memungkinkan kontrol atas penyimpanan dan keamanan data, memastikan cadangan aman dan hanya dapat diakses oleh pengguna yang berwenang.</p></li>
</ol>
<p>Manajemen data yang efektif sangat penting untuk meningkatkan potensi penuh Milvus dalam aplikasi Anda. Dengan menguasai alat pencadangan Milvus, Anda dapat memastikan daya tahan dan ketersediaan data, bahkan dalam lingkungan terdistribusi yang kompleks. Panduan ini memberdayakan pengguna untuk menerapkan strategi pencadangan yang kuat, mempromosikan praktik terbaik dan teknik penanganan data yang efisien.</p>
<p>Apakah Anda seorang pengembang, insinyur data, atau profesional TI, memahami dan memanfaatkan alat pencadangan Milvus dapat berkontribusi secara signifikan terhadap kesuksesan proyek Anda dengan menyediakan solusi manajemen data yang andal dan efisien.</p>
