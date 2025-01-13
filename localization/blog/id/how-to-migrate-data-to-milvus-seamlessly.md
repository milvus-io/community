---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'Cara Memigrasi Data Anda ke Milvus dengan Mudah: Panduan Komprehensif'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  Panduan komprehensif untuk memigrasikan data Anda dari Elasticsearch, FAISS,
  dan versi Milvus 1.x yang lebih lama ke Milvus 2.x.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka yang tangguh untuk <a href="https://zilliz.com/learn/vector-similarity-search">pencarian kemiripan</a> yang dapat menyimpan, memproses, dan mengambil miliaran bahkan triliunan data vektor dengan latensi minimal. Milvus juga sangat terukur, dapat diandalkan, cloud-native, dan kaya akan fitur. <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Rilis terbaru Milvus</a> memperkenalkan fitur dan peningkatan yang lebih menarik, termasuk <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">dukungan GPU</a> untuk kinerja lebih dari 10x lebih cepat dan MMap untuk kapasitas penyimpanan yang lebih besar pada satu mesin.</p>
<p>Pada September 2023, Milvus telah mendapatkan hampir 23.000 bintang di GitHub dan memiliki puluhan ribu pengguna dari berbagai industri dengan kebutuhan yang berbeda-beda. Milvus menjadi semakin populer karena teknologi AI Generatif seperti <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> menjadi semakin umum. Ini adalah komponen penting dari berbagai tumpukan AI, terutama kerangka kerja <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">generasi augmented retrieval</a>, yang mengatasi masalah halusinasi model bahasa yang besar.</p>
<p>Untuk memenuhi permintaan yang terus meningkat dari pengguna baru yang ingin bermigrasi ke Milvus dan pengguna lama yang ingin meningkatkan ke versi Milvus terbaru, kami mengembangkan <a href="https://github.com/zilliztech/milvus-migration">Migrasi Milvus</a>. Dalam blog ini, kami akan mengeksplorasi fitur-fitur dari Milvus Migration dan memandu Anda untuk memindahkan data Anda dengan cepat ke Milvus dari Milvus 1.x, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, dan <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> dan seterusnya.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration, alat bantu migrasi data yang canggih<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> adalah alat migrasi data yang ditulis dalam bahasa Go. Alat ini memungkinkan pengguna untuk memindahkan data mereka dengan lancar dari versi lama Milvus (1.x), FAISS, dan Elasticsearch 7.0 dan seterusnya ke versi Milvus 2.x.</p>
<p>Diagram di bawah ini menunjukkan bagaimana kami membangun Milvus Migration dan bagaimana cara kerjanya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Bagaimana Milvus Migration memigrasikan data</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">Dari Milvus 1.x dan FAISS ke Milvus 2.x</h4><p>Migrasi data dari Milvus 1.x dan FAISS melibatkan penguraian konten dari file data asli, mengubahnya ke dalam format penyimpanan data Milvus 2.x, dan menulis data menggunakan Milvus SDK's <code translate="no">bulkInsert</code>. Seluruh proses ini berbasis stream, secara teoritis hanya dibatasi oleh ruang disk, dan menyimpan file data pada disk lokal Anda, S3, OSS, GCP, atau Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Dari Elasticsearch ke Milvus 2.x</h4><p>Pada migrasi data Elasticsearch, pengambilan data berbeda. Data tidak diperoleh dari file, tetapi diambil secara berurutan menggunakan API gulir Elasticsearch. Data kemudian diurai dan ditransformasikan ke dalam format penyimpanan Milvus 2.x, diikuti dengan menuliskannya menggunakan <code translate="no">bulkInsert</code>. Selain memigrasikan vektor tipe <code translate="no">dense_vector</code> yang tersimpan di Elasticsearch, Milvus Migration juga mendukung pemindahan tipe field lainnya, termasuk long, integer, short, boolean, keyword, text, dan double.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Kumpulan fitur Milvus Migration</h3><p>Milvus Migration menyederhanakan proses migrasi melalui serangkaian fitur yang kuat:</p>
<ul>
<li><p><strong>Sumber Data yang Didukung:</strong></p>
<ul>
<li><p>Milvus 1.x ke Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 dan seterusnya ke Milvus 2.x</p></li>
<li><p>FAISS ke Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Beberapa Mode Interaksi:</strong></p>
<ul>
<li><p>Antarmuka baris perintah (CLI) menggunakan kerangka kerja Cobra</p></li>
<li><p>Restful API dengan UI Swagger bawaan</p></li>
<li><p>Integrasi sebagai modul Go di alat lain</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Dukungan Format File Serbaguna:</strong></p>
<ul>
<li><p>File lokal</p></li>
<li><p>Amazon S3</p></li>
<li><p>Layanan Penyimpanan Objek (Object Storage Service (OSS))</p></li>
<li><p>Google Cloud Platform (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Integrasi Elasticsearch yang fleksibel:</strong></p>
<ul>
<li><p>Migrasi vektor tipe <code translate="no">dense_vector</code> dari Elasticsearch</p></li>
<li><p>Dukungan untuk migrasi tipe field lain seperti panjang, integer, pendek, boolean, kata kunci, teks, dan ganda</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">Definisi antarmuka</h3><p>Milvus Migration menyediakan antarmuka-antarmuka utama berikut ini:</p>
<ul>
<li><p><code translate="no">/start</code>: Memulai pekerjaan migrasi (setara dengan kombinasi dump dan load, saat ini hanya mendukung migrasi ES).</p></li>
<li><p><code translate="no">/dump</code>: Memulai pekerjaan dump (menulis data sumber ke dalam media penyimpanan target).</p></li>
<li><p><code translate="no">/load</code>: Memulai pekerjaan load (menulis data dari media penyimpanan target ke dalam Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: Memungkinkan pengguna untuk melihat hasil eksekusi job. (Untuk lebih jelasnya, lihat <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">server.go proyek</a>)</p></li>
</ul>
<p>Selanjutnya, mari kita gunakan beberapa contoh data untuk mengeksplorasi bagaimana cara menggunakan Milvus Migration pada bagian ini. Anda dapat menemukan contoh-contoh ini di <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">sini</a> di GitHub.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Migrasi dari Elasticsearch ke Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Menyiapkan Data Elasticsearch</li>
</ol>
<p>Untuk <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">memigrasikan</a> data <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a>, Anda harus sudah menyiapkan server Elasticsearch Anda sendiri. Anda harus menyimpan data vektor di bidang <code translate="no">dense_vector</code> dan mengindeksnya dengan bidang lain. Pemetaan indeks seperti yang ditunjukkan di bawah ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>Mengkompilasi dan Membangun</li>
</ol>
<p>Pertama, unduh <a href="https://github.com/zilliztech/milvus-migration">kode sumber</a> Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">dari GitHub</a>. Kemudian, jalankan perintah berikut untuk mengkompilasinya.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Langkah ini akan menghasilkan file yang dapat dieksekusi dengan nama <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Konfigurasi <code translate="no">migration.yaml</code></li>
</ol>
<p>Sebelum memulai migrasi, Anda harus menyiapkan file konfigurasi bernama <code translate="no">migration.yaml</code> yang berisi informasi tentang sumber data, target, dan pengaturan lain yang relevan. Berikut adalah contoh konfigurasi:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>Untuk penjelasan lebih rinci tentang file konfigurasi, lihat <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">halaman ini</a> di GitHub.</p>
<ol start="4">
<li>Jalankan pekerjaan migrasi</li>
</ol>
<p>Setelah Anda mengonfigurasi berkas <code translate="no">migration.yaml</code>, Anda dapat memulai tugas migrasi dengan menjalankan perintah berikut:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Amati keluaran log. Jika Anda melihat log yang mirip dengan yang berikut ini, berarti migrasi berhasil.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Selain pendekatan baris perintah, Milvus Migration juga mendukung migrasi menggunakan Restful API.</p>
<p>Untuk menggunakan Restful API, jalankan server API menggunakan perintah berikut:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>Setelah layanan berjalan, Anda dapat memulai migrasi dengan memanggil API.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>Setelah migrasi selesai, Anda dapat menggunakan <a href="https://zilliz.com/attu">Attu</a>, alat administrasi basis data vektor lengkap, untuk melihat jumlah total baris yang berhasil dimigrasikan dan melakukan operasi terkait koleksi lainnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>Antarmuka Attu</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Migrasi dari Milvus 1.x ke Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Mempersiapkan Data Milvus 1.x</li>
</ol>
<p>Untuk membantu Anda merasakan proses migrasi dengan cepat, kami telah menempatkan 10.000 <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">data uji</a> Milvus 1.x di dalam kode sumber Milvus Migration. Namun, pada kasus nyata, Anda harus mengekspor file <code translate="no">meta.json</code> Anda sendiri dari instance Milvus 1.x sebelum memulai proses migrasi.</p>
<ul>
<li>Anda dapat mengekspor data dengan perintah berikut.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>Pastikan untuk:</p>
<ul>
<li><p>Mengganti placeholder dengan kredensial MySQL Anda yang sebenarnya.</p></li>
<li><p>Menghentikan server Milvus 1.x atau menghentikan penulisan data sebelum melakukan ekspor ini.</p></li>
<li><p>Salin folder Milvus <code translate="no">tables</code> dan file <code translate="no">meta.json</code> ke direktori yang sama.</p></li>
</ul>
<p><strong>Catatan:</strong> Jika Anda menggunakan Milvus 2.x pada <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (layanan yang dikelola sepenuhnya oleh Milvus), Anda dapat memulai migrasi menggunakan Cloud Console.</p>
<ol start="2">
<li>Mengkompilasi dan Membangun</li>
</ol>
<p>Pertama, unduh <a href="https://github.com/zilliztech/milvus-migration">kode sumber</a> Migrasi Milvus <a href="https://github.com/zilliztech/milvus-migration">dari GitHub</a>. Kemudian, jalankan perintah berikut untuk mengompilasinya.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Langkah ini akan menghasilkan file yang dapat dieksekusi dengan nama <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Konfigurasi <code translate="no">migration.yaml</code></li>
</ol>
<p>Siapkan berkas konfigurasi <code translate="no">migration.yaml</code>, dengan menentukan detail tentang sumber, target, dan pengaturan lain yang relevan. Berikut adalah contoh konfigurasi:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Untuk penjelasan lebih rinci tentang file konfigurasi, lihat <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">halaman ini</a> di GitHub.</p>
<ol start="4">
<li>Jalankan Pekerjaan Migrasi</li>
</ol>
<p>Anda harus menjalankan perintah <code translate="no">dump</code> dan <code translate="no">load</code> secara terpisah untuk menyelesaikan migrasi. Perintah-perintah ini akan mengonversi data dan mengimpornya ke dalam Milvus 2.x.</p>
<p><strong>Catatan:</strong> Kami akan menyederhanakan langkah ini dan memungkinkan pengguna untuk menyelesaikan migrasi hanya dengan menggunakan satu perintah dalam waktu dekat. Tetap disini.</p>
<p><strong>Perintah Buang:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Perintah Muat:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Setelah migrasi, koleksi yang dihasilkan di Milvus 2.x akan berisi dua bidang: <code translate="no">id</code> dan <code translate="no">data</code>. Anda dapat melihat detail lebih lanjut menggunakan <a href="https://zilliz.com/attu">Attu</a>, alat administrasi basis data vektor yang lengkap.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">Migrasi dari FAISS ke Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Mempersiapkan Data FAISS</li>
</ol>
<p>Untuk memigrasikan data Elasticsearch, Anda harus menyiapkan data FAISS Anda sendiri. Untuk membantu Anda dengan cepat mengalami proses migrasi, kami telah menempatkan beberapa <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">data uji FAISS</a> dalam kode sumber Milvus Migration.</p>
<ol start="2">
<li>Mengkompilasi dan Membangun</li>
</ol>
<p>Pertama, unduh <a href="https://github.com/zilliztech/milvus-migration">kode sumber</a> Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">dari GitHub</a>. Kemudian, jalankan perintah berikut untuk mengkompilasinya.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Langkah ini akan menghasilkan file yang dapat dieksekusi dengan nama <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Konfigurasi <code translate="no">migration.yaml</code></li>
</ol>
<p>Siapkan file konfigurasi <code translate="no">migration.yaml</code> untuk migrasi FAISS, dengan menentukan detail tentang sumber, target, dan pengaturan lain yang relevan. Berikut adalah contoh konfigurasi:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Untuk penjelasan lebih rinci tentang file konfigurasi, lihat <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">halaman ini</a> di GitHub.</p>
<ol start="4">
<li>Menjalankan Pekerjaan Migrasi</li>
</ol>
<p>Seperti migrasi Milvus 1.x ke Milvus 2.x, migrasi FAISS membutuhkan eksekusi perintah <code translate="no">dump</code> dan <code translate="no">load</code>. Perintah-perintah ini mengkonversi data dan mengimpornya ke dalam Milvus 2.x.</p>
<p><strong>Catatan:</strong> Kami akan menyederhanakan langkah ini dan memungkinkan pengguna untuk menyelesaikan migrasi hanya dengan menggunakan satu perintah dalam waktu dekat. Tetap disini.</p>
<p><strong>Perintah Buang:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Perintah Muat:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Anda dapat melihat detail lebih lanjut menggunakan <a href="https://zilliz.com/attu">Attu</a>, sebuah alat administrasi basis data vektor yang lengkap.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">Nantikan rencana migrasi di masa mendatang<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>Di masa mendatang, kami akan mendukung migrasi dari lebih banyak sumber data dan menambahkan lebih banyak fitur migrasi, termasuk:</p>
<ul>
<li><p>Mendukung migrasi dari Redis ke Milvus.</p></li>
<li><p>Mendukung migrasi dari MongoDB ke Milvus.</p></li>
<li><p>Mendukung migrasi yang dapat dilanjutkan.</p></li>
<li><p>Menyederhanakan perintah migrasi dengan menggabungkan proses pembuangan dan pemuatan menjadi satu.</p></li>
<li><p>Mendukung migrasi dari sumber data utama lainnya ke Milvus.</p></li>
</ul>
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
    </button></h2><p>Milvus 2.3, rilis terbaru dari Milvus, menghadirkan fitur-fitur baru yang menarik dan peningkatan kinerja yang memenuhi kebutuhan manajemen data yang terus berkembang. Memigrasi data Anda ke Milvus 2.x dapat membuka manfaat-manfaat ini, dan proyek Migrasi Milvus membuat proses migrasi menjadi efisien dan mudah. Cobalah, dan Anda tidak akan kecewa.</p>
<p><em><strong>Catatan:</strong> Informasi dalam blog ini didasarkan pada kondisi proyek Milvus dan <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> per September 2023. Periksa <a href="https://milvus.io/docs">dokumentasi</a> resmi <a href="https://milvus.io/docs">Milvus</a> untuk informasi dan instruksi terbaru.</em></p>
