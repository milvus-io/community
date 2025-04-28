---
id: the-developers-guide-to-milvus-configuration.md
title: Panduan Pengembang untuk Konfigurasi Milvus
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Sederhanakan konfigurasi Milvus Anda dengan panduan terfokus kami. Temukan
  parameter kunci untuk menyesuaikan kinerja yang lebih baik dalam aplikasi
  basis data vektor Anda.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">Pengantar<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagai pengembang yang bekerja dengan Milvus, Anda mungkin pernah menemukan file konfigurasi <code translate="no">milvus.yaml</code> yang menakutkan dengan lebih dari 500 parameter. Menangani kerumitan ini dapat menjadi tantangan ketika yang Anda inginkan adalah mengoptimalkan kinerja database vektor Anda.</p>
<p>Kabar baiknya: Anda tidak perlu memahami setiap parameter. Panduan ini memotong semua kerumitan dan berfokus pada pengaturan penting yang benar-benar berdampak pada kinerja, menyoroti dengan tepat nilai mana yang harus diubah untuk kasus penggunaan spesifik Anda.</p>
<p>Baik Anda sedang membangun sistem rekomendasi yang membutuhkan kueri secepat kilat atau mengoptimalkan aplikasi pencarian vektor dengan batasan biaya, saya akan menunjukkan kepada Anda parameter mana yang harus dimodifikasi dengan nilai yang praktis dan teruji. Di akhir panduan ini, Anda akan mengetahui cara menyetel konfigurasi Milvus untuk kinerja puncak berdasarkan skenario penerapan di dunia nyata.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">Kategori Konfigurasi<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum masuk ke parameter spesifik, mari kita uraikan struktur file konfigurasi. Saat bekerja dengan <code translate="no">milvus.yaml</code>, Anda akan berurusan dengan tiga kategori parameter:</p>
<ul>
<li><p><strong>Konfigurasi Komponen Ketergantungan</strong>: Layanan eksternal yang terhubung dengan Milvus (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - penting untuk pengaturan cluster dan persistensi data</p></li>
<li><p><strong>Konfigurasi Komponen Internal</strong>: Arsitektur internal Milvus (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, dll.) - kunci untuk penyetelan kinerja</p></li>
<li><p><strong>Konfigurasi Fungsional</strong>: Keamanan, pencatatan, dan batas sumber daya - penting untuk penerapan produksi</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Konfigurasi Komponen Ketergantungan Milvus<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita mulai dengan layanan eksternal yang menjadi ketergantungan Milvus. Konfigurasi ini sangat penting ketika berpindah dari pengembangan ke produksi.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: Penyimpanan Metadata</h3><p>Milvus bergantung pada <code translate="no">etcd</code> untuk persistensi metadata dan koordinasi layanan. Parameter-parameter berikut ini sangat penting:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: Menentukan alamat cluster etcd. Secara default, Milvus meluncurkan instance yang dibundel, tetapi di lingkungan perusahaan, praktik terbaiknya adalah menyambungkan ke layanan <code translate="no">etcd</code> terkelola untuk ketersediaan dan kontrol operasional yang lebih baik.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Mendefinisikan awalan kunci untuk menyimpan data terkait Milvus dalam etcd. Jika Anda mengoperasikan beberapa cluster Milvus pada backend etcd yang sama, menggunakan jalur root yang berbeda memungkinkan isolasi metadata yang bersih.</p></li>
<li><p><code translate="no">etcd.auth</code>: Mengontrol kredensial autentikasi. Milvus tidak mengaktifkan auth etcd secara default, tetapi jika instans etcd yang Anda kelola membutuhkan kredensial, Anda harus menentukannya di sini.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: Penyimpanan Objek</h3><p>Terlepas dari namanya, bagian ini mengatur semua klien layanan penyimpanan objek yang kompatibel dengan S3. Bagian ini mendukung penyedia seperti AWS S3, GCS, dan Aliyun OSS melalui pengaturan <code translate="no">cloudProvider</code>.</p>
<p>Perhatikan empat konfigurasi utama ini:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: Gunakan ini untuk menentukan titik akhir layanan penyimpanan objek Anda.</p></li>
<li><p><code translate="no">minio.bucketName</code>: Tetapkan bucket terpisah (atau awalan logis) untuk menghindari tabrakan data saat menjalankan beberapa cluster Milvus.</p></li>
<li><p><code translate="no">minio.rootPath</code>: Mengaktifkan intra-bucket namespacing untuk isolasi data.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: Mengidentifikasi backend OSS. Untuk daftar kompatibilitas lengkap, lihat <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">dokumentasi Milvus</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: Antrian Pesan</h3><p>Milvus menggunakan antrean pesan untuk penyebaran peristiwa internal-baik Pulsar (default) atau Kafka. Perhatikan tiga parameter berikut ini.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: Atur nilai ini untuk menggunakan cluster Pulsar eksternal.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: Menentukan nama penyewa. Ketika beberapa gugus Milvus berbagi contoh Pulsar, ini memastikan pemisahan saluran yang bersih.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: Jika Anda lebih suka melewati model penyewa Pulsar, sesuaikan awalan saluran untuk mencegah tabrakan.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus juga mendukung Kafka sebagai antrean pesan. Untuk menggunakan Kafka, beri komentar pada pengaturan khusus Pulsar dan hapus komentar pada blok konfigurasi Kafka.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Konfigurasi Komponen Internal Milvus<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: Metadata + Stempel Waktu</h3><p>Node <code translate="no">rootCoord</code> menangani perubahan metadata (DDL/DCL) dan manajemen stempel waktu.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>Menetapkan batas atas jumlah partisi per koleksi. Meskipun batas kerasnya adalah 1024, parameter ini terutama berfungsi sebagai pengaman. Untuk sistem multi-penyewa, hindari penggunaan partisi sebagai batas isolasi - sebagai gantinya, terapkan strategi kunci penyewa yang berskala jutaan penyewa logis.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>Mengaktifkan ketersediaan tinggi dengan mengaktifkan node siaga. Hal ini sangat penting karena node koordinator Milvus tidak menskalakan secara horizontal secara default.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: API Gateway + Router Permintaan</h3><p><code translate="no">proxy</code> menangani permintaan yang dihadapi klien, validasi permintaan, dan agregasi hasil.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: Membatasi jumlah bidang (skalar + vektor) per koleksi. Jaga agar tetap di bawah 64 untuk meminimalkan kompleksitas skema dan mengurangi overhead I/O.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: Mengontrol jumlah bidang vektor dalam sebuah koleksi. Milvus mendukung pencarian multimodal, tetapi dalam praktiknya, 10 bidang vektor adalah batas atas yang aman.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>: Mendefinisikan jumlah pecahan konsumsi. Sebagai aturan praktis:</p>
<ul>
<li><p>&lt; 200 juta catatan → 1 pecahan</p></li>
<li><p>200-400 juta catatan → 2 pecahan</p></li>
<li><p>Skala secara linear di luar itu</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: Ketika diaktifkan, log ini mencatat info permintaan yang mendetail (pengguna, IP, titik akhir, SDK). Berguna untuk mengaudit dan melakukan debug.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: Eksekusi Permintaan</h3><p>Menangani eksekusi pencarian vektor dan pemuatan segmen. Perhatikan parameter berikut ini.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: Mengaktifkan I/O yang dipetakan dalam memori untuk memuat bidang dan segmen skalar. Mengaktifkan <code translate="no">mmap</code> membantu mengurangi jejak memori, tetapi dapat menurunkan latensi jika I / O disk menjadi hambatan.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: Manajemen Segmen + Indeks</h3><p>Parameter ini mengontrol segmentasi data, pengindeksan, pemadatan, dan pengumpulan sampah (GC). Parameter konfigurasi utama meliputi:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: Menentukan ukuran maksimum segmen data dalam memori. Segmen yang lebih besar umumnya berarti lebih sedikit segmen total dalam sistem, yang dapat meningkatkan kinerja kueri dengan mengurangi pengindeksan dan overhead pencarian. Sebagai contoh, beberapa pengguna yang menjalankan instance <code translate="no">queryNode</code> dengan RAM 128GB melaporkan bahwa meningkatkan pengaturan ini dari 1GB menjadi 8GB menghasilkan kinerja kueri sekitar 4× lebih cepat.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Mirip dengan yang di atas, parameter ini mengontrol ukuran maksimum untuk <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">indeks disk</a> (diskann index) secara khusus.</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: Menentukan kapan segmen yang sedang berkembang disegel (yaitu, diselesaikan dan diindeks). Segmen disegel ketika mencapai <code translate="no">maxSize * sealProportion</code>. Secara default, dengan <code translate="no">maxSize = 1024MB</code> dan <code translate="no">sealProportion = 0.12</code>, segmen akan disegel sekitar 123MB.</p></li>
</ol>
<ul>
<li><p>Nilai yang lebih rendah (misalnya, 0,12) memicu penyegelan lebih cepat, yang dapat membantu pembuatan indeks yang lebih cepat - berguna dalam beban kerja dengan pembaruan yang sering.</p></li>
<li><p>Nilai yang lebih tinggi (misalnya, 0,3 hingga 0,5) menunda penyegelan, mengurangi overhead pengindeksan - lebih cocok untuk skenario konsumsi offline atau batch.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  Mengatur faktor ekspansi yang diizinkan selama pemadatan. Milvus menghitung ukuran segmen maksimum yang diizinkan selama pemadatan sebagai <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: Setelah sebuah segmen dipadatkan atau sebuah koleksi dibuang, Milvus tidak langsung menghapus data yang mendasarinya. Sebaliknya, Milvus menandai segmen-segmen tersebut untuk dihapus dan menunggu siklus pengumpulan sampah (GC) selesai. Parameter ini mengontrol durasi penundaan tersebut.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">Konfigurasi Fungsional Lainnya<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: Pengamatan dan Diagnostik</h3><p>Pencatatan yang kuat adalah landasan dari sistem terdistribusi mana pun, tidak terkecuali Milvus. Pengaturan pencatatan yang dikonfigurasi dengan baik tidak hanya membantu dengan masalah debugging saat masalah tersebut muncul, tetapi juga memastikan visibilitas yang lebih baik ke dalam kesehatan dan perilaku sistem dari waktu ke waktu.</p>
<p>Untuk penerapan produksi, kami merekomendasikan untuk mengintegrasikan log Milvus dengan alat pencatatan dan pemantauan terpusat-seperti <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki-untuk</a> merampingkan analisis dan peringatan. Pengaturan utama meliputi:</p>
<ol>
<li><p><code translate="no">log.level</code>: Mengontrol verbositas output log. Untuk lingkungan produksi, gunakan level <code translate="no">info</code> untuk menangkap detail runtime yang penting tanpa membebani sistem. Selama pengembangan atau pemecahan masalah, Anda dapat beralih ke <code translate="no">debug</code> untuk mendapatkan wawasan yang lebih terperinci tentang operasi internal. ⚠️ Berhati-hatilah dengan level <code translate="no">debug</code> dalam produksi - ini menghasilkan volume log yang tinggi, yang dapat dengan cepat menghabiskan ruang disk dan menurunkan kinerja I / O jika dibiarkan.</p></li>
<li><p><code translate="no">log.file</code>: Secara default, Milvus menulis log ke output standar (stdout), yang cocok untuk lingkungan terkontainerisasi di mana log dikumpulkan melalui sespan atau agen node. Untuk mengaktifkan pencatatan berbasis file, Anda dapat mengonfigurasi:</p></li>
</ol>
<ul>
<li><p>Ukuran file maksimum sebelum rotasi</p></li>
<li><p>Periode penyimpanan file</p></li>
<li><p>Jumlah file log cadangan yang harus disimpan</p></li>
</ul>
<p>Ini berguna di lingkungan bare-metal atau on-prem di mana pengiriman log stdout tidak tersedia.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: Otentikasi dan Kontrol Akses</h3><p>Milvus mendukung <a href="https://milvus.io/docs/authenticate.md?tab=docker">otentikasi pengguna</a> dan <a href="https://milvus.io/docs/rbac.md">kontrol akses berbasis peran (RBAC</a>), yang keduanya dikonfigurasikan dalam modul <code translate="no">common</code>. Pengaturan ini sangat penting untuk mengamankan lingkungan multi-penyewa atau penerapan apa pun yang terpapar ke klien eksternal.</p>
<p>Parameter utama meliputi:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: Sakelar ini mengaktifkan atau menonaktifkan autentikasi dan RBAC. Secara default dimatikan, yang berarti semua operasi diizinkan tanpa pemeriksaan identitas. Untuk menerapkan kontrol akses yang aman, atur parameter ini ke <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: Bila autentikasi diaktifkan, pengaturan ini menentukan kata sandi awal untuk pengguna <code translate="no">root</code> bawaan.</p></li>
</ol>
<p>Pastikan untuk mengubah kata sandi default segera setelah mengaktifkan autentikasi untuk menghindari kerentanan keamanan di lingkungan produksi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: Pembatasan Kecepatan dan Kontrol Tulis</h3><p>Bagian <code translate="no">quotaAndLimits</code> di <code translate="no">milvus.yaml</code> memainkan peran penting dalam mengontrol bagaimana data mengalir melalui sistem. Bagian ini mengatur batas laju untuk operasi seperti menyisipkan, menghapus, mem-flush, dan kueri-memastikan stabilitas klaster di bawah beban kerja yang berat dan mencegah penurunan kinerja karena amplifikasi penulisan atau pemadatan yang berlebihan.</p>
<p>Parameter utama meliputi:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Mengontrol seberapa sering Milvus melakukan flush data dari koleksi.</p>
<ul>
<li><p><strong>Nilai default</strong>: <code translate="no">0.1</code> yang berarti sistem mengizinkan satu flush setiap 10 detik.</p></li>
<li><p>Operasi flush akan menyegel segmen yang sedang tumbuh dan mempertahankannya dari antrean pesan ke penyimpanan objek.</p></li>
<li><p>Melakukan flush terlalu sering dapat menghasilkan banyak segmen kecil yang tersegel, yang meningkatkan overhead pemadatan dan merusak kinerja kueri.</p></li>
</ul>
<p>💡 Praktik terbaik: Dalam banyak kasus, biarkan Milvus menangani hal ini secara otomatis. Segmen yang sedang tumbuh akan disegel setelah mencapai <code translate="no">maxSize * sealProportion</code>, dan segmen yang disegel akan disiram setiap 10 menit. Pembilasan manual hanya disarankan setelah penyisipan massal ketika Anda tahu tidak ada lagi data yang akan masuk.</p>
<p>Juga perlu diingat: <strong>visibilitas data</strong> ditentukan oleh <em>tingkat konsistensi</em> kueri, bukan waktu pembilasan-jadi pembilasan tidak membuat data baru dapat langsung di-query.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: Parameter-parameter ini menentukan kecepatan maksimum yang diperbolehkan untuk operasi upsert dan delete.</p>
<ul>
<li><p>Milvus bergantung pada arsitektur penyimpanan LSM-Tree, yang berarti seringnya pembaruan dan penghapusan akan memicu pemadatan. Hal ini dapat menghabiskan banyak sumber daya dan mengurangi throughput secara keseluruhan jika tidak dikelola dengan hati-hati.</p></li>
<li><p>Disarankan untuk membatasi <strong>kecepatan</strong> <code translate="no">upsertRate</code> dan <code translate="no">deleteRate</code> pada <strong>0,5 MB/s</strong> agar tidak membebani pipeline pemadatan.</p></li>
</ul>
<p>🚀 Perlu memperbarui kumpulan data yang besar dengan cepat? Gunakan strategi alias koleksi:</p>
<ul>
<li><p>Masukkan data baru ke dalam koleksi baru.</p></li>
<li><p>Setelah pembaruan selesai, tunjuk ulang alias ke koleksi baru. Hal ini untuk menghindari penalti pemadatan dari pembaruan di tempat dan memungkinkan peralihan instan.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">Contoh Konfigurasi Dunia Nyata<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita lihat dua skenario penerapan yang umum untuk mengilustrasikan bagaimana pengaturan konfigurasi Milvus dapat disesuaikan agar sesuai dengan tujuan operasional yang berbeda.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">⚡ Contoh 1: Konfigurasi Berkinerja Tinggi</h3><p>Ketika latensi kueri sangat penting-pikirkan mesin rekomendasi, platform pencarian semantik, atau penilaian risiko waktu nyata-setiap milidetik sangat berarti. Dalam kasus penggunaan ini, Anda biasanya akan bersandar pada indeks berbasis grafik seperti <strong>HNSW</strong> atau <strong>DISKANN</strong>, dan mengoptimalkan penggunaan memori dan perilaku siklus hidup segmen.</p>
<p>Strategi penyetelan utama:</p>
<ul>
<li><p>Tingkatkan <code translate="no">dataCoord.segment.maxSize</code> dan <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Naikkan nilai ini menjadi 4GB atau bahkan 8GB, tergantung pada RAM yang tersedia. Segmen yang lebih besar mengurangi jumlah pembuatan indeks dan meningkatkan throughput kueri dengan meminimalkan fanout segmen. Namun, segmen yang lebih besar mengkonsumsi lebih banyak memori pada waktu kueri-jadi, pastikan instance <code translate="no">indexNode</code> dan <code translate="no">queryNode</code> Anda memiliki ruang yang cukup.</p></li>
<li><p>Turunkan <code translate="no">dataCoord.segment.sealProportion</code> dan <code translate="no">dataCoord.segment.expansionRate</code>: Targetkan ukuran segmen yang terus bertambah sekitar 200MB sebelum melakukan penyegelan. Hal ini membuat penggunaan memori segmen dapat diprediksi dan mengurangi beban Delegator (pemimpin queryNode yang mengoordinasikan pencarian terdistribusi).</p></li>
</ul>
<p>Aturan praktis: Pilihlah segmen yang lebih sedikit dan lebih besar jika memori berlimpah dan latensi menjadi prioritas. Bersikaplah konservatif dengan ambang batas seal jika kesegaran indeks penting.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰 Contoh 2: Konfigurasi yang Dioptimalkan untuk Biaya</h3><p>Jika Anda memprioritaskan efisiensi biaya daripada kinerja mentah - umum terjadi pada jalur pelatihan model, alat internal QPS rendah, atau pencarian gambar berekor panjang - Anda dapat menukar recall atau latensi untuk mengurangi permintaan infrastruktur secara signifikan.</p>
<p>Strategi yang disarankan:</p>
<ul>
<li><p><strong>Gunakan kuantisasi indeks:</strong> Jenis indeks seperti <code translate="no">SCANN</code>, <code translate="no">IVF_SQ8</code>, atau <code translate="no">HNSW_PQ/PRQ/SQ</code> (diperkenalkan pada Milvus 2.5) secara dramatis mengurangi ukuran indeks dan jejak memori. Ini sangat ideal untuk beban kerja di mana presisi tidak terlalu penting dibandingkan dengan skala atau anggaran.</p></li>
<li><p><strong>Gunakan strategi pengindeksan yang didukung oleh disk:</strong> Tetapkan jenis indeks ke <code translate="no">DISKANN</code> untuk mengaktifkan pencarian berbasis disk murni. <strong>Aktifkan</strong> <code translate="no">mmap</code> untuk pembongkaran memori secara selektif.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk penghematan memori yang ekstrem, aktifkan <code translate="no">mmap</code> untuk yang berikut ini: <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code>, dan <code translate="no">scalarIndex</code>. Hal ini akan melepaskan sebagian besar data ke memori virtual, sehingga mengurangi penggunaan RAM residen secara signifikan.</p>
<p>⚠️ Peringatan: Jika pemfilteran skalar merupakan bagian utama dari beban kerja kueri Anda, pertimbangkan untuk menonaktifkan <code translate="no">mmap</code> untuk <code translate="no">vectorIndex</code> dan <code translate="no">scalarIndex</code>. Pemetaan memori dapat menurunkan kinerja kueri skalar di lingkungan yang dibatasi I/O.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">Kiat penggunaan disk</h4><ul>
<li><p>Indeks HNSW yang dibuat dengan <code translate="no">mmap</code> dapat memperbesar ukuran data total hingga <strong>1,8</strong> kali lipat.</p></li>
<li><p>Disk fisik 100GB mungkin secara realistis hanya dapat menampung ~50GB data efektif ketika Anda memperhitungkan overhead indeks dan caching.</p></li>
<li><p>Selalu sediakan penyimpanan ekstra saat bekerja dengan <code translate="no">mmap</code>, terutama jika Anda juga menyimpan vektor asli secara lokal.</p></li>
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
    </button></h2><p>Menyetel Milvus bukan tentang mengejar angka yang sempurna - ini tentang membentuk sistem di sekitar perilaku dunia nyata beban kerja Anda. Pengoptimalan yang paling berdampak sering kali berasal dari pemahaman tentang bagaimana Milvus menangani I/O, siklus hidup segmen, dan pengindeksan di bawah tekanan. Ini adalah jalur di mana kesalahan konfigurasi paling merugikan - dan di mana penyetelan yang bijaksana menghasilkan keuntungan terbesar.</p>
<p>Jika Anda baru mengenal Milvus, parameter konfigurasi yang telah kami bahas akan mencakup 80-90% kebutuhan kinerja dan stabilitas Anda. Mulailah dari sana. Setelah Anda membangun intuisi, gali lebih dalam spesifikasi lengkap <code translate="no">milvus.yaml</code> dan dokumentasi resminya-Anda akan menemukan kontrol halus yang dapat membawa penerapan Anda dari fungsional menjadi luar biasa.</p>
<p>Dengan konfigurasi yang tepat, Anda akan siap untuk membangun sistem pencarian vektor yang dapat diskalakan dan berkinerja tinggi yang selaras dengan prioritas operasional Anda-apakah itu berarti penyajian dengan latensi rendah, penyimpanan yang hemat biaya, atau beban kerja analitik yang sangat tinggi.</p>
