---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >-
  Mengatasi Masalah Perlambatan Pencarian Setelah Meningkatkan Milvus: Pelajaran
  dari Tim WPS
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
  Setelah meng-upgrade Milvus dari 2.2 ke 2.5, tim WPS mengalami regresi latensi
  pencarian 3-5x lipat. Penyebabnya: satu bendera pemulihan cadangan Milvus yang
  memecah segmen.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>Artikel ini dikontribusikan oleh tim teknisi WPS di Kingsoft Office Software, yang menggunakan Milvus dalam sistem rekomendasi. Selama peningkatan dari Milvus 2.2.16 ke 2.5.16, latensi pencarian meningkat 3 hingga 5 kali lipat. Artikel ini menjelaskan bagaimana mereka menyelidiki masalah dan memperbaikinya, dan mungkin berguna bagi orang lain dalam komunitas yang merencanakan peningkatan serupa.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Mengapa Kami Meningkatkan Milvus<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami adalah bagian dari perangkat lunak produktivitas pembangunan tim teknik WPS, dan kami menggunakan Milvus sebagai mesin pencari vektor di balik pencarian kemiripan waktu nyata dalam sistem rekomendasi online kami. Cluster produksi kami menyimpan puluhan juta vektor, dengan dimensi rata-rata 768. Data tersebut dilayani oleh 16 QueryNode, dan setiap pod dikonfigurasi dengan batas 16 core CPU dan 48 GB memori.</p>
<p>Ketika menjalankan Milvus 2.2.16, kami mengalami masalah stabilitas yang serius yang telah mempengaruhi bisnis. Di bawah konkurensi kueri yang tinggi, <code translate="no">planparserv2.HandleCompare</code> dapat menyebabkan pengecualian penunjuk nol, menyebabkan komponen Proxy menjadi panik dan sering restart. Bug ini sangat mudah dipicu dalam skenario konkurensi tinggi dan secara langsung memengaruhi ketersediaan layanan rekomendasi online kami.</p>
<p>Di bawah ini adalah log kesalahan Proxy yang sebenarnya dan stack trace dari insiden tersebut:</p>
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
<p><strong>Apa yang ditunjukkan oleh stack trace</strong>: Kepanikan terjadi selama prapemrosesan kueri di Proxy, di dalam <code translate="no">queryTask.PreExecute</code>. Jalur panggilannya adalah:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p>Kerusakan terjadi ketika <code translate="no">HandleCompare</code> mencoba mengakses memori yang tidak valid di alamat <code translate="no">0x8</code>, memicu SIGSEGV dan menyebabkan proses Proxy macet.</p>
<p><strong>Untuk sepenuhnya menghilangkan risiko stabilitas ini, kami memutuskan untuk meng-upgrade cluster dari Milvus 2.2.16 ke 2.5.16.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">Mencadangkan Data Dengan milvus-backup Sebelum Upgrade<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum menyentuh cluster produksi, kami mencadangkan semuanya menggunakan alat pencadangan resmi <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>. Alat ini mendukung pencadangan dan pemulihan dalam cluster yang sama, lintas cluster, dan lintas versi Milvus.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">Memeriksa Kompatibilitas Versi</h3><p>milvus-backup memiliki dua aturan versi untuk <a href="https://milvus.io/docs/milvus_backup_overview.md">pemulihan lintas versi</a>:</p>
<ol>
<li><p><strong>Cluster target harus menjalankan versi Milvus yang sama atau yang lebih baru.</strong> Cadangan dari 2.2 dapat dimuat ke 2.5, tetapi tidak sebaliknya.</p></li>
<li><p><strong>Target harus minimal Milvus 2.4.</strong> Target pemulihan yang lebih lama tidak didukung.</p></li>
</ol>
<p>Jalur kami (cadangan dari 2.2.16, muat ke 2.5.16) memenuhi kedua aturan tersebut.</p>
<table>
<thead>
<tr><th>Cadangkan dari ↓ \ Kembalikan ke →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Bagaimana Milvus-Backup Bekerja</h3><p>Milvus Backup memfasilitasi pencadangan dan pemulihan metadata, segmen, dan data di seluruh instance Milvus. Ini menyediakan antarmuka northbound, seperti CLI, API, dan modul Go berbasis gRPC, untuk manipulasi proses pencadangan dan pemulihan yang fleksibel.</p>
<p>Milvus Backup membaca metadata koleksi dan segmen dari instance Milvus sumber untuk membuat cadangan. Kemudian menyalin data koleksi dari jalur root instance Milvus sumber dan menyimpannya ke jalur root cadangan.</p>
<p>Untuk memulihkan dari cadangan, Milvus Backup membuat koleksi baru di instance Milvus target berdasarkan metadata koleksi dan informasi segmen dalam cadangan. Kemudian menyalin data cadangan dari jalur root cadangan ke jalur root instans target.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">Menjalankan Pencadangan</h3><p>Kami menyiapkan berkas konfigurasi khusus, <code translate="no">configs/backup.yaml</code>. Kolom utama ditunjukkan di bawah ini, dengan nilai sensitif dihapus:</p>
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
<p>Kami kemudian menjalankan perintah ini:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> mendukung <strong>pencadangan panas</strong>, sehingga biasanya berdampak kecil pada lalu lintas online. Menjalankan pada jam-jam di luar jam sibuk masih lebih aman untuk menghindari perebutan sumber daya.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">Memverifikasi Cadangan</h3><p>Setelah pencadangan selesai, kami memverifikasi bahwa pencadangan telah selesai dan dapat digunakan. Kami terutama memeriksa apakah jumlah koleksi dan segmen dalam cadangan sesuai dengan yang ada di kluster sumber.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Ternyata cocok, jadi kami melanjutkan ke peningkatan.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Memutakhirkan Dengan Bagan Helm<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>Melompat tiga versi utama (2.2 → 2.5) dengan puluhan juta vektor membuat peningkatan di tempat menjadi terlalu berisiko. Sebagai gantinya, kami membangun cluster baru dan memigrasikan data ke dalamnya. Cluster lama tetap online untuk rollback.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">Menerapkan Cluster Baru</h3><p>Kami menerapkan cluster Milvus 2.5.16 yang baru dengan Helm:</p>
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
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">Perubahan Konfigurasi Utama (<code translate="no">values-v25.yaml</code>)</h3><p>Untuk membuat perbandingan kinerja yang adil, kami menjaga agar cluster baru semirip mungkin dengan cluster lama. Kami hanya mengubah beberapa pengaturan yang penting untuk beban kerja ini:</p>
<ul>
<li><p><strong>Nonaktifkan Mmap</strong> (<code translate="no">mmap.enabled: false</code>): Beban kerja rekomendasi kami sensitif terhadap latensi. Jika Mmap diaktifkan, beberapa data dapat dibaca dari disk saat dibutuhkan, yang dapat menambah penundaan I/O disk dan menyebabkan lonjakan latensi. Kami mematikannya agar data tetap berada di memori dan latensi kueri menjadi lebih stabil.</p></li>
<li><p><strong>Jumlah QueryNode:</strong> dipertahankan pada <strong>16</strong>, sama seperti cluster lama</p></li>
<li><p><strong>Batas sumber daya:</strong> setiap Pod masih memiliki <strong>16 inti CPU</strong>, sama seperti cluster lama</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">Kiat untuk peningkatan versi utama:</h3><ul>
<li><p><strong>Bangunlah cluster baru alih-alih melakukan peningkatan di tempat.</strong> Anda menghindari risiko kompatibilitas metadata dan mempertahankan jalur rollback yang bersih.</p></li>
<li><p><strong>Verifikasi cadangan Anda sebelum melakukan migrasi.</strong> Setelah data berada dalam format versi baru, Anda tidak dapat dengan mudah kembali.</p></li>
<li><p><strong>Biarkan kedua cluster tetap berjalan selama peralihan.</strong> Pindahkan trafik secara bertahap dan hanya menonaktifkan cluster lama setelah verifikasi penuh.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Memigrasi Data Setelah Upgrade dengan Milvus-Backup Restore<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami menggunakan <code translate="no">milvus-backup restore</code> untuk memuat cadangan ke dalam cluster baru. Dalam terminologi milvus-backup, "restore" berarti "memuat data cadangan ke dalam cluster target." Target harus menjalankan versi Milvus yang sama atau yang lebih baru, jadi, terlepas dari namanya, pemulihan selalu memindahkan data ke depan.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">Menjalankan Pemulihan</h3><p>File konfigurasi pemulihan, <code translate="no">configs/restore.yaml</code>, harus mengarah ke <strong>kluster baru</strong> dan pengaturan penyimpanannya. Kolom utama terlihat seperti ini:</p>
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
<p>Kami kemudian menjalankannya:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> membutuhkan informasi koneksi Milvus dan MinIO dari cluster baru sehingga data yang dipulihkan dituliskan ke penyimpanan cluster baru.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">Pemeriksaan Setelah Pemulihan</h3><p>Setelah pemulihan selesai, kami memeriksa empat hal untuk memastikan migrasi sudah benar:</p>
<ul>
<li><p><strong>Skema.</strong> Skema koleksi di cluster baru harus sama persis dengan yang lama, termasuk definisi field dan dimensi vektor.</p></li>
<li><p><strong>Jumlah total baris.</strong> Kami membandingkan jumlah total entitas di cluster lama dan baru untuk memastikan tidak ada data yang hilang.</p></li>
<li><p><strong>Status indeks.</strong> Kami mengonfirmasi bahwa semua indeks telah selesai dibuat dan statusnya telah diatur ke <code translate="no">Finished</code>.</p></li>
<li><p><strong>Hasil kueri.</strong> Kami menjalankan kueri yang sama pada kedua cluster dan membandingkan ID yang dikembalikan dan skor jarak untuk memastikan hasilnya cocok.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">Pergeseran Trafik Secara Bertahap dan Kejutan Latensi<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami memindahkan trafik produksi ke cluster baru secara bertahap:</p>
<table>
<thead>
<tr><th>Fase</th><th>Bagian Lalu Lintas</th><th>Durasi</th><th>Apa yang Kami Amati</th></tr>
</thead>
<tbody>
<tr><td>Fase 1</td><td>5%</td><td>24 jam</td><td>Latensi kueri P99, tingkat kesalahan, dan akurasi hasil</td></tr>
<tr><td>Fase 2</td><td>25%</td><td>48 jam</td><td>Latensi kueri P99/P95, QPS, penggunaan CPU</td></tr>
<tr><td>Fase 3</td><td>50%</td><td>48 jam</td><td>Metrik ujung ke ujung, penggunaan sumber daya</td></tr>
<tr><td>Fase 4</td><td>100%</td><td>Pemantauan berkelanjutan</td><td>Stabilitas metrik secara keseluruhan</td></tr>
</tbody>
</table>
<p>Kami tetap menjalankan cluster lama sepanjang waktu untuk melakukan rollback secara instan.</p>
<p><strong>Selama peluncuran ini, kami menemukan masalahnya: latensi penelusuran di cluster v2.5.16 yang baru 3-5 kali lebih tinggi daripada cluster v2.2.16 yang lama.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">Menemukan Penyebab Perlambatan Pencarian<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">Langkah 1: Periksa Penggunaan CPU Secara Keseluruhan</h3><p>Kami mulai dengan penggunaan CPU per komponen untuk melihat apakah cluster kekurangan sumber daya.</p>
<table>
<thead>
<tr><th>Komponen</th><th>Penggunaan CPU (core)</th><th>Analisis</th></tr>
</thead>
<tbody>
<tr><td>QueryNode</td><td>10.1</td><td>Batasnya adalah 16 core, jadi penggunaannya sekitar 63%. Tidak sepenuhnya digunakan</td></tr>
<tr><td>Proxy</td><td>0.21</td><td>Sangat rendah</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>Sangat rendah</td></tr>
<tr><td>DataNode</td><td>0.14</td><td>Sangat rendah</td></tr>
<tr><td>IndexNode</td><td>0.02</td><td>Sangat rendah</td></tr>
</tbody>
</table>
<p>Hal ini menunjukkan bahwa QueryNode masih memiliki CPU yang cukup. Jadi, perlambatan <strong>tidak disebabkan oleh kekurangan CPU secara keseluruhan</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">Langkah 2: Periksa Saldo QueryNode</h3><p>Total CPU terlihat baik-baik saja, tetapi masing-masing pod QueryNode memiliki <strong>ketidakseimbangan yang jelas</strong>:</p>
<table>
<thead>
<tr><th>Pod QueryNode</th><th>Penggunaan CPU (Terakhir)</th><th>Penggunaan CPU (Maks)</th></tr>
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
<p>Pod-1 menggunakan hampir 5x lipat CPU daripada pod-8. Ini adalah masalah karena Milvus menyebarkan kueri ke semua QueryNode dan menunggu sampai yang paling lambat selesai. Beberapa pod yang kelebihan beban akan memperlambat setiap pencarian.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">Langkah 3: Bandingkan Distribusi Segmen</h3><p>Beban yang tidak merata biasanya mengindikasikan distribusi data yang tidak merata, jadi kami membandingkan tata letak segmen antara cluster lama dan baru.</p>
<p><strong>Tata letak segmen v2.2.16 (total 13 segmen)</strong></p>
<table>
<thead>
<tr><th>Rentang jumlah baris</th><th>Jumlah segmen</th><th>Status</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Disegel</td></tr>
<tr><td>533,630</td><td>1</td><td>Disegel</td></tr>
</tbody>
</table>
<p>Cluster yang lama cukup merata. Hanya memiliki 13 segmen, dan sebagian besar memiliki sekitar <strong>740.000 baris</strong>.</p>
<p><strong>Tata letak segmen v2.5.16 (total 21 segmen)</strong></p>
<table>
<thead>
<tr><th>Rentang jumlah baris</th><th>Jumlah segmen</th><th>Status</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Disegel</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Disegel</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Disegel</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Disegel</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Disegel</td></tr>
</tbody>
</table>
<p>Cluster yang baru terlihat sangat berbeda. Cluster ini memiliki 21 segmen (60% lebih banyak), dengan ukuran segmen yang bervariasi: beberapa memiliki ~685 ribu baris, sementara yang lain hanya 350 ribu. Pemulihan telah menyebarkan data secara tidak merata.</p>
<h3 id="Root-Cause" class="common-anchor-header">Akar Masalah</h3><p>Kami menelusuri masalahnya kembali ke perintah pemulihan awal kami:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>Bendera <code translate="no">--use_v2_restore</code> mengaktifkan mode pemulihan penggabungan segmen, yang mengelompokkan beberapa segmen ke dalam satu pekerjaan pemulihan. Mode ini dirancang untuk mempercepat pemulihan ketika Anda memiliki banyak segmen kecil.</p>
<p>Tetapi dalam pemulihan lintas versi kami (2.2 → 2.5), logika v2 membangun ulang segmen secara berbeda dari cluster asli: ia membagi segmen besar menjadi segmen-segmen yang lebih kecil dan berukuran tidak sama. Setelah dimuat, beberapa QueryNode terjebak dengan lebih banyak data daripada yang lain.</p>
<p>Hal ini merusak kinerja dalam tiga cara:</p>
<ul>
<li><p><strong>Node panas:</strong> QueryNode dengan segmen yang lebih besar atau lebih banyak harus melakukan lebih banyak pekerjaan</p></li>
<li><p><strong>Efek simpul paling lambat:</strong> latensi kueri terdistribusi tergantung pada simpul paling lambat</p></li>
<li><p><strong>Lebih banyak overhead penggabungan:</strong> lebih banyak segmen juga berarti lebih banyak pekerjaan saat menggabungkan hasil</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">Perbaikan</h3><p>Kami menghapus <code translate="no">--use_v2_restore</code> dan mengembalikannya ke logika default:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Kami membersihkan data yang buruk dari klaster baru terlebih dahulu, lalu menjalankan pemulihan default. Distribusi segmen kembali seimbang, latensi pencarian kembali normal, dan masalahnya pun hilang.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">Apa yang Akan Kami Lakukan Secara Berbeda di Lain Waktu<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam kasus ini, kami membutuhkan waktu terlalu lama untuk menemukan masalah yang sebenarnya: <strong>distribusi segmen yang tidak merata</strong>. Inilah yang akan membuatnya lebih cepat.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">Meningkatkan Pemantauan Segmen</h3><p>Milvus tidak menampilkan jumlah segmen, distribusi baris, atau distribusi ukuran per koleksi di dasbor standar Grafana. Kami harus menggali secara manual melalui <a href="https://github.com/zilliztech/attu">Attu</a> dan etcd, yang mana hal ini sangat lambat.</p>
<p>Akan sangat membantu jika ditambahkan:</p>
<ul>
<li><p><strong>dasbor distribusi segmen</strong> di Grafana, yang menunjukkan berapa banyak segmen yang telah dimuat oleh setiap QueryNode, ditambah jumlah baris dan ukurannya</p></li>
<li><p><strong>peringatan ketidakseimbangan</strong>, yang dipicu ketika jumlah baris segmen di seluruh node melampaui ambang batas</p></li>
<li><p><strong>tampilan perbandingan migrasi</strong>, sehingga pengguna dapat membandingkan distribusi segmen antara cluster lama dan baru setelah peningkatan</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">Gunakan Daftar Periksa Migrasi Standar</h3><p>Kami telah memeriksa jumlah baris dan menganggapnya baik-baik saja. Itu tidak cukup. Validasi pasca migrasi yang lengkap juga harus mencakup:</p>
<ul>
<li><p><strong>Konsistensi skema.</strong> Apakah definisi field dan dimensi vektor sudah sesuai?</p></li>
<li><p><strong>Jumlah segmen.</strong> Apakah jumlah segmen berubah secara drastis?</p></li>
<li><p><strong>Keseimbangan segmen.</strong> Apakah jumlah baris di seluruh segmen seimbang?</p></li>
<li><p><strong>Status indeks.</strong> Apakah semua indeks <code translate="no">finished</code>?</p></li>
<li><p><strong>Tolok ukur latensi.</strong> Apakah latensi kueri P50, P95, dan P99 terlihat mirip dengan kluster lama?</p></li>
<li><p><strong>Keseimbangan beban.</strong> Apakah penggunaan CPU QueryNode didistribusikan secara merata di seluruh pod?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">Tambahkan Pemeriksaan Otomatis</h3><p>Anda dapat membuat skrip validasi ini dengan PyMilvus untuk menangkap ketidakseimbangan sebelum mencapai produksi:</p>
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
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">Gunakan Alat yang Sudah Ada dengan Lebih Baik</h3><p>Beberapa alat sudah mendukung diagnostik tingkat segmen:</p>
<ul>
<li><p><strong>Birdwatcher:</strong> dapat membaca metadata Etcd secara langsung dan menunjukkan tata letak segmen dan penetapan saluran</p></li>
<li><p><strong>Milvus Web UI (v2.5+):</strong> memungkinkan Anda memeriksa informasi segmen secara visual</p></li>
<li><p><strong>Grafana + Prometheus:</strong> dapat digunakan untuk membuat dasbor khusus untuk pemantauan klaster secara real-time</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Saran untuk Komunitas Milvus<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Beberapa perubahan pada Milvus akan membuat pemecahan masalah seperti ini menjadi lebih mudah:</p>
<ol>
<li><p><strong>Jelaskan kompatibilitas parameter dengan lebih jelasDokumen</strong> <code translate="no">milvus-backup</code> harus menjelaskan dengan jelas bagaimana opsi seperti <code translate="no">--use_v2_restore</code> berperilaku selama pemulihan lintas versi dan risiko yang mungkin ditimbulkannya.</p></li>
<li><p><strong>Tambahkan pemeriksaan yang lebih baik setelah pemulihanSetelah</strong> <code translate="no">restore</code> selesai, akan sangat membantu jika alat ini secara otomatis mencetak ringkasan distribusi segmen.</p></li>
<li><p><strong>Paparkan metrik terkait keseimbanganMetrik yang dipromosikan</strong>harus menyertakan informasi keseimbangan segmen, sehingga pengguna dapat memantaunya secara langsung.</p></li>
<li><p><strong>Mendukung analisis rencana kueriMirip</strong>dengan MySQL <code translate="no">EXPLAIN</code>, Milvus akan mendapatkan keuntungan dari alat yang menunjukkan bagaimana kueri dieksekusi dan membantu menemukan masalah kinerja.</p></li>
</ol>
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
    </button></h2><p>Kesimpulannya:</p>
<table>
<thead>
<tr><th>Tahap</th><th>Alat / Metode</th><th>Poin Kunci</th></tr>
</thead>
<tbody>
<tr><td>Pencadangan</td><td>milvus-backup membuat cadangan</td><td>Pencadangan panas didukung, tetapi pencadangan harus diperiksa dengan cermat</td></tr>
<tr><td>Tingkatkan</td><td>Bangun cluster baru dengan Helm</td><td>Nonaktifkan Mmap untuk mengurangi jitter I/O, dan pertahankan pengaturan sumber daya yang sama dengan cluster lama</td></tr>
<tr><td>Migrasi</td><td>milvus-pemulihan cadangan</td><td>Hati-hati dengan --use_v2_restore. Dalam pemulihan lintas versi, jangan gunakan logika non-default kecuali Anda memahaminya dengan jelas</td></tr>
<tr><td>Peluncuran abu-abu</td><td>Pergeseran lalu lintas secara bertahap</td><td>Memindahkan lalu lintas secara bertahap: 5% → 25% → 50% → 100%, dan jaga agar cluster lama tetap siap untuk pengembalian</td></tr>
<tr><td>Pemecahan masalah</td><td>Grafana + analisis segmen</td><td>Jangan hanya melihat CPU dan memori. Periksa juga keseimbangan segmen dan distribusi data</td></tr>
<tr><td>Perbaikan</td><td>Hapus data yang buruk dan kembalikan lagi</td><td>Hapus flag yang salah, pulihkan dengan logika default, dan kinerja kembali normal</td></tr>
</tbody>
</table>
<p>Saat memigrasi data, penting untuk mempertimbangkan lebih dari sekadar apakah data tersebut ada dan akurat. Anda juga perlu memperhatikan <strong>bagaimana data</strong> <strong>didistribusikan</strong>.</p>
<p>Jumlah segmen dan ukuran segmen menentukan seberapa merata Milvus mendistribusikan pekerjaan kueri di seluruh node. Ketika segmen tidak seimbang, beberapa node akhirnya melakukan sebagian besar pekerjaan, dan setiap pencarian membayarnya. Peningkatan lintas versi membawa risiko ekstra di sini karena proses pemulihan dapat membangun kembali segmen yang berbeda dari klaster asli. Flag seperti <code translate="no">--use_v2_restore</code> dapat memecah data Anda dengan cara yang tidak dapat dilihat oleh jumlah baris saja.</p>
<p>Oleh karena itu, pendekatan teraman dalam migrasi lintas versi adalah tetap menggunakan pengaturan pemulihan default kecuali jika Anda memiliki alasan khusus untuk melakukan sebaliknya. Selain itu, pemantauan harus lebih dari sekadar CPU dan memori; Anda memerlukan wawasan tentang tata letak data yang mendasari, terutama distribusi dan keseimbangan segmen, untuk mendeteksi masalah lebih awal.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Catatan dari Tim Milvus<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami ingin berterima kasih kepada tim teknisi WPS yang telah berbagi pengalaman ini dengan komunitas Milvus. Tulisan seperti ini sangat berharga karena menangkap pelajaran produksi yang nyata dan membuatnya berguna bagi orang lain yang menghadapi masalah serupa.</p>
<p>Jika tim Anda memiliki pelajaran teknis, kisah pemecahan masalah, atau pengalaman praktis yang layak untuk dibagikan, kami ingin mendengarnya dari Anda. Bergabunglah dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Saluran Slack</a> dan hubungi kami di sana.</p>
<p>Dan jika Anda sedang menghadapi tantangan Anda sendiri, saluran komunitas yang sama adalah tempat yang baik untuk terhubung dengan teknisi Milvus dan pengguna lain. Anda juga dapat memesan sesi tatap muka melalui <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kantor Milvus</a> untuk mendapatkan bantuan pencadangan dan pemulihan, peningkatan lintas versi, dan kinerja kueri.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
