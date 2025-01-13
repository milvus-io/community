---
id: deep-dive-6-oss-qa.md
title: Jaminan Kualitas Perangkat Lunak Sumber Terbuka (OSS) - Studi Kasus Milvus
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: >-
  Jaminan kualitas adalah proses untuk menentukan apakah suatu produk atau
  layanan memenuhi persyaratan tertentu.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/zhuwenxing">Wenxing Zhu</a> dan disadur oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Jaminan kualitas (QA) adalah proses sistematis untuk menentukan apakah suatu produk atau layanan memenuhi persyaratan tertentu. Sistem QA adalah bagian tak terpisahkan dari proses R&amp;D karena, seperti namanya, sistem ini memastikan kualitas produk.</p>
<p>Tulisan ini memperkenalkan kerangka kerja QA yang diadopsi dalam mengembangkan basis data vektor Milvus, yang bertujuan untuk memberikan panduan bagi pengembang dan pengguna yang berkontribusi untuk berpartisipasi dalam proses tersebut. Ini juga akan mencakup modul pengujian utama di Milvus serta metode dan alat yang dapat dimanfaatkan untuk meningkatkan efisiensi pengujian QA.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Pengenalan umum terhadap sistem QA Milvus</a></li>
<li><a href="#Test-modules-in-Milvus">Modul-modul pengujian di Milvus</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">Alat dan metode untuk efisiensi QA yang lebih baik</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Pengenalan umum terhadap sistem QA Milvus<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Arsitektur sistem</a> sangat penting untuk melakukan pengujian QA. Semakin seorang insinyur QA memahami sistem, semakin besar kemungkinan dia akan menghasilkan rencana pengujian yang masuk akal dan efisien.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur Milvus</span> </span></p>
<p>Milvus 2.0 mengadopsi <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">arsitektur cloud-native, terdistribusi, dan berlapis</a>, dengan SDK sebagai <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">pintu masuk utama bagi data</a> untuk mengalir di Milvus. Pengguna Milvus sangat sering menggunakan SDK, oleh karena itu pengujian fungsional pada sisi SDK sangat dibutuhkan. Selain itu, uji fungsi pada SDK dapat membantu mendeteksi masalah internal yang mungkin ada di dalam sistem Milvus. Selain uji fungsi, jenis pengujian lain juga akan dilakukan pada database vektor, termasuk uji unit, uji penerapan, uji keandalan, uji stabilitas, dan uji kinerja.</p>
<p>Arsitektur cloud-native dan terdistribusi memberikan kemudahan sekaligus tantangan dalam pengujian QA. Tidak seperti sistem yang digunakan dan dijalankan secara lokal, instance Milvus yang digunakan dan dijalankan di cluster Kubernetes dapat memastikan bahwa pengujian perangkat lunak dilakukan dalam kondisi yang sama dengan pengembangan perangkat lunak. Namun, sisi negatifnya adalah kompleksitas arsitektur terdistribusi membawa lebih banyak ketidakpastian yang dapat membuat pengujian QA sistem menjadi lebih sulit dan berat. Sebagai contoh, Milvus 2.0 menggunakan layanan mikro dari komponen yang berbeda, dan hal ini menyebabkan peningkatan jumlah <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">layanan dan node</a>, serta kemungkinan lebih besar terjadinya kesalahan sistem. Oleh karena itu, rencana QA yang lebih canggih dan komprehensif diperlukan untuk efisiensi pengujian yang lebih baik.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">Pengujian QA dan manajemen masalah</h3><p>QA di Milvus melibatkan pelaksanaan pengujian dan pengelolaan masalah yang muncul selama pengembangan perangkat lunak.</p>
<h4 id="QA-testings" class="common-anchor-header">Pengujian QA</h4><p>Milvus melakukan berbagai jenis pengujian QA sesuai dengan fitur Milvus dan kebutuhan pengguna sesuai dengan urutan prioritas seperti yang ditunjukkan pada gambar di bawah ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>Prioritas pengujian QA</span> </span></p>
<p>Pengujian QA dilakukan pada aspek-aspek berikut di Milvus dengan prioritas sebagai berikut:</p>
<ol>
<li><strong>Fungsi</strong>: Memverifikasi apakah fungsi dan fitur bekerja sesuai dengan rancangan awal.</li>
<li><strong>Penerapan</strong>: Memeriksa apakah pengguna dapat melakukan deployment, menginstal ulang, dan meng-upgrade versi mandiri Mivus dan cluster Milvus dengan metode yang berbeda (Docker Compose, Helm, APT atau YUM, dll.).</li>
<li><strong>Kinerja</strong>:  Menguji kinerja penyisipan data, pengindeksan, pencarian vektor, dan kueri di Milvus.</li>
<li><strong>Stabilitas</strong>: Periksa apakah Milvus dapat berjalan dengan stabil selama 5-10 hari di bawah tingkat beban kerja normal.</li>
<li><strong>Keandalan</strong>: Menguji apakah Milvus masih dapat berfungsi sebagian jika terjadi kesalahan sistem tertentu.</li>
<li><strong>Konfigurasi</strong>: Memverifikasi apakah Milvus bekerja seperti yang diharapkan dalam konfigurasi tertentu.</li>
<li><strong>Kompatibilitas</strong>: Menguji apakah Milvus kompatibel dengan berbagai jenis perangkat keras atau perangkat lunak.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">Manajemen masalah</h4><p>Banyak masalah yang mungkin muncul selama pengembangan perangkat lunak. Penulis dari templat masalah dapat berupa insinyur QA sendiri atau pengguna Milvus dari komunitas sumber terbuka. Tim QA bertanggung jawab untuk mencari tahu masalah tersebut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>Alur kerja manajemen isu</span> </span></p>
<p>Ketika sebuah <a href="https://github.com/milvus-io/milvus/issues">isu</a> dibuat, isu tersebut akan melalui triase terlebih dahulu. Selama triase, masalah baru akan diperiksa untuk memastikan bahwa rincian masalah yang cukup disediakan. Jika isu tersebut dikonfirmasi, maka isu tersebut akan diterima oleh pengembang dan mereka akan mencoba untuk memperbaiki isu tersebut. Setelah pengembangan selesai, penulis isu perlu memverifikasi apakah isu tersebut sudah diperbaiki. Jika ya, isu tersebut akan ditutup.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">Kapan QA dibutuhkan?</h3><p>Salah satu kesalahpahaman umum adalah bahwa QA dan pengembangan tidak bergantung satu sama lain. Namun, kenyataannya adalah untuk memastikan kualitas sistem, diperlukan upaya dari pengembang dan insinyur QA. Oleh karena itu, QA perlu dilibatkan di seluruh siklus hidup.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>Siklus hidup QA</span> </span></p>
<p>Seperti yang ditunjukkan pada gambar di atas, siklus hidup R&amp;D perangkat lunak yang lengkap mencakup tiga tahap.</p>
<p>Pada tahap awal, pengembang mempublikasikan dokumentasi desain sementara insinyur QA membuat rencana pengujian, menentukan kriteria rilis, dan menetapkan tugas QA. Pengembang dan insinyur QA harus terbiasa dengan dokumen desain dan rencana pengujian sehingga pemahaman bersama tentang tujuan rilis (dalam hal fitur, kinerja, stabilitas, konvergensi bug, dll.) Dibagikan di antara kedua tim.</p>
<p>Selama R&amp;D, pengembangan dan pengujian QA sering berinteraksi untuk mengembangkan dan memverifikasi fitur dan fungsi, serta memperbaiki bug dan masalah yang dilaporkan oleh <a href="https://slack.milvus.io/">komunitas</a> sumber terbuka.</p>
<p>Pada tahap akhir, jika kriteria rilis terpenuhi, citra Docker baru dari versi Milvus yang baru akan dirilis. Sebuah catatan rilis yang berfokus pada fitur-fitur baru dan bug yang telah diperbaiki serta tag rilis diperlukan untuk rilis resmi. Kemudian tim QA juga akan mempublikasikan laporan pengujian pada rilis ini.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Modul pengujian di Milvus<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ada beberapa modul pengujian di Milvus dan bagian ini akan menjelaskan setiap modul secara rinci.</p>
<h3 id="Unit-test" class="common-anchor-header">Unit test</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>Uji coba unit</span> </span></p>
<p>Unit test dapat membantu mengidentifikasi bug perangkat lunak pada tahap awal dan memberikan kriteria verifikasi untuk restrukturisasi kode. Menurut kriteria penerimaan pull request (PR) Milvus, <a href="https://app.codecov.io/gh/milvus-io/milvus/">cakupan</a> uji unit kode harus 80%.</p>
<h3 id="Function-test" class="common-anchor-header">Uji fungsi</h3><p>Uji fungsi di Milvus terutama diatur di sekitar <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> dan SDK. Tujuan utama dari uji fungsi adalah untuk memverifikasi apakah antarmuka dapat bekerja seperti yang dirancang. Uji fungsi memiliki dua aspek:</p>
<ul>
<li>Menguji apakah SDK dapat mengembalikan hasil yang diharapkan ketika parameter yang benar diberikan.</li>
<li>Menguji apakah SDK dapat menangani kesalahan dan mengembalikan pesan kesalahan yang wajar ketika parameter yang salah diberikan.</li>
</ul>
<p>Gambar di bawah ini menggambarkan kerangka kerja saat ini untuk uji fungsi yang didasarkan pada kerangka kerja <a href="https://pytest.org/">pytest</a> arus utama. Kerangka kerja ini menambahkan pembungkus ke PyMilvus dan memberdayakan pengujian dengan antarmuka pengujian otomatis.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>Uji fungsi</span> </span></p>
<p>Mempertimbangkan metode pengujian bersama diperlukan dan beberapa fungsi perlu digunakan kembali, kerangka kerja pengujian di atas diadopsi, daripada menggunakan antarmuka PyMilvus secara langsung. Modul "cek" juga disertakan dalam kerangka kerja untuk memberikan kemudahan dalam verifikasi nilai yang diharapkan dan nilai aktual.</p>
<p>Sebanyak 2.700 kasus uji fungsi dimasukkan ke dalam direktori <code translate="no">tests/python_client/testcases</code>, yang mencakup hampir semua antarmuka PyMilvus. Uji fungsi ini secara ketat mengawasi kualitas setiap PR.</p>
<h3 id="Deployment-test" class="common-anchor-header">Uji penyebaran</h3><p>Milvus hadir dalam dua mode: <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">mandiri</a> dan <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">cluster</a>. Dan ada dua cara utama untuk men-deploy Milvus: menggunakan Docker Compose atau Helm. Dan setelah men-deploy Milvus, pengguna juga dapat memulai ulang atau meningkatkan layanan Milvus. Ada dua kategori utama dari uji coba penyebaran: uji coba restart dan uji coba peningkatan.</p>
<p>Restart test mengacu pada proses pengujian persistensi data, yaitu apakah data masih tersedia setelah restart. Upgrade test mengacu pada proses pengujian kompatibilitas data untuk mencegah situasi di mana format data yang tidak kompatibel dimasukkan ke dalam Milvus. Kedua jenis uji penerapan ini memiliki alur kerja yang sama seperti yang diilustrasikan pada gambar di bawah ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>Uji penyebaran</span> </span></p>
<p>Dalam uji coba restart, kedua deployment menggunakan citra docker yang sama. Namun dalam pengujian peningkatan, deployment pertama menggunakan citra docker dari versi sebelumnya sedangkan deployment kedua menggunakan citra docker dari versi yang lebih baru. Hasil pengujian dan data disimpan dalam file <code translate="no">Volumes</code> atau <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">persistent volume claim</a> (PVC).</p>
<p>Ketika menjalankan pengujian pertama, beberapa koleksi dibuat dan operasi yang berbeda dilakukan pada masing-masing koleksi. Ketika menjalankan pengujian kedua, fokus utamanya adalah memverifikasi apakah koleksi yang dibuat masih tersedia untuk operasi CRUD, dan apakah koleksi baru dapat dibuat lebih lanjut.</p>
<h3 id="Reliability-test" class="common-anchor-header">Uji keandalan</h3><p>Pengujian keandalan sistem terdistribusi cloud-native biasanya menggunakan metode chaos engineering yang bertujuan untuk mengatasi kesalahan dan kegagalan sistem sejak awal. Dengan kata lain, dalam uji coba chaos engineering, kami sengaja menciptakan kegagalan sistem untuk mengidentifikasi masalah dalam uji tekanan dan memperbaiki kegagalan sistem sebelum benar-benar mulai menimbulkan bahaya. Selama uji kekacauan di Milvus, kami memilih <a href="https://chaos-mesh.org/">Chaos Mesh</a> sebagai alat untuk menciptakan kekacauan. Ada beberapa jenis kegagalan yang perlu dibuat:</p>
<ul>
<li><strong>Pod kill</strong>: simulasi skenario di mana node mati.</li>
<li><strong>Kegagalan pod</strong>: Menguji jika salah satu pod node pekerja gagal apakah seluruh sistem masih dapat terus bekerja.</li>
<li><strong>Memory stress</strong>: simulasi konsumsi memori dan sumber daya CPU yang berat dari node kerja.</li>
<li><strong>Partisi jaringan</strong>: Karena Milvus <a href="https://milvus.io/docs/v2.0.x/four_layers.md">memisahkan penyimpanan dari komputasi</a>, sistem ini sangat bergantung pada komunikasi antara berbagai komponen. Simulasi skenario di mana komunikasi antara pod yang berbeda dipartisi diperlukan untuk menguji saling ketergantungan komponen Milvus yang berbeda.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>Uji keandalan</span> </span></p>
<p>Gambar di atas menunjukkan kerangka kerja uji reliabilitas di Milvus yang dapat mengotomatiskan uji kekacauan. Alur kerja uji reliabilitas adalah sebagai berikut:</p>
<ol>
<li>Inisialisasi cluster Milvus dengan membaca konfigurasi penerapan.</li>
<li>Ketika cluster sudah siap, jalankan <code translate="no">test_e2e.py</code> untuk menguji apakah fitur-fitur Milvus sudah tersedia.</li>
<li>Jalankan <code translate="no">hello_milvus.py</code> untuk menguji persistensi data. Buat koleksi bernama "hello_milvus" untuk penyisipan data, flush, pembuatan indeks, pencarian vektor, dan kueri. Koleksi ini tidak akan dirilis atau dihapus selama pengujian.</li>
<li>Buat sebuah objek pemantauan yang akan memulai enam thread yang mengeksekusi operasi create, insert, flush, index, search dan query.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Buat pernyataan pertama - semua operasi berhasil seperti yang diharapkan.</li>
<li>Perkenalkan kegagalan sistem pada Milvus dengan menggunakan Chaos Mesh untuk mem-parsing file yaml yang mendefinisikan kegagalan. Kegagalan dapat berupa mematikan simpul kueri setiap lima detik misalnya.</li>
<li>Buat pernyataan kedua saat memperkenalkan kegagalan sistem - Menilai apakah hasil yang dikembalikan dari operasi di Milvus selama kegagalan sistem sesuai dengan yang diharapkan.</li>
<li>Hilangkan kegagalan melalui Chaos Mesh.</li>
<li>Ketika layanan Milvus telah pulih (yang berarti semua pod telah siap), buat pernyataan ketiga - semua operasi berhasil seperti yang diharapkan.</li>
<li>Jalankan <code translate="no">test_e2e.py</code> untuk menguji apakah fitur Milvus tersedia. Beberapa operasi selama kekacauan mungkin diblokir karena pernyataan ketiga. Dan bahkan setelah kekacauan dihilangkan, beberapa operasi mungkin akan terus diblokir, sehingga menghambat pernyataan ketiga untuk berhasil seperti yang diharapkan. Langkah ini bertujuan untuk memfasilitasi pernyataan ketiga dan berfungsi sebagai standar untuk memeriksa apakah layanan Milvus telah pulih.</li>
<li>Jalankan <code translate="no">hello_milvus.py</code>, muat koleksi yang telah dibuat, dan lakukan operasi CRUP pada koleksi tersebut. Kemudian, periksa apakah data yang ada sebelum kegagalan sistem masih tersedia setelah pemulihan kegagalan.</li>
<li>Kumpulkan log.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">Uji stabilitas dan kinerja</h3><p>Gambar di bawah ini menjelaskan tujuan, skenario pengujian, dan metrik uji stabilitas dan performa.</p>
<table>
<thead>
<tr><th></th><th>Uji stabilitas</th><th>Uji kinerja</th></tr>
</thead>
<tbody>
<tr><td>Tujuan</td><td>- Memastikan bahwa Milvus dapat bekerja dengan lancar untuk jangka waktu tertentu di bawah beban kerja normal. <br> - Memastikan sumber daya dikonsumsi secara stabil ketika layanan Milvus dimulai.</td><td>- Menguji kinerja semua antarmuka Milvus. <br> - Temukan konfigurasi yang optimal dengan bantuan tes kinerja.  <br> - Berfungsi sebagai tolok ukur untuk rilis mendatang. <br> - Menemukan hambatan yang menghambat kinerja yang lebih baik.</td></tr>
<tr><td>Skenario</td><td>- Skenario offline read-intensive di mana data hampir tidak diperbarui setelah penyisipan dan persentase pemrosesan setiap jenis permintaan adalah: permintaan pencarian 90%, permintaan penyisipan 5%, lainnya 5%. <br> - Skenario online write-intensive dimana data disisipkan dan dicari secara bersamaan dan persentase pemrosesan setiap jenis permintaan adalah: permintaan sisipkan 50%, permintaan pencarian 40%, lainnya 10%.</td><td>- Penyisipan data <br> - Pembuatan indeks <br> - Pencarian vektor</td></tr>
<tr><td>Metrik</td><td>- Penggunaan memori <br> - Konsumsi CPU <br> - Latensi IO <br> - Status pod Milvus <br> - Waktu respons dari layanan Milvus <br> dll.</td><td>- Throughput data selama penyisipan data <br> - Waktu yang dibutuhkan untuk membangun indeks <br> - Waktu respons selama pencarian vektor <br> - Kueri per detik (QPS) <br> - Permintaan per detik  <br> - Tingkat penarikan kembali <br> dll.</td></tr>
</tbody>
</table>
<p>Uji stabilitas dan uji performa memiliki alur kerja yang sama:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>Uji stabilitas dan performa</span> </span></p>
<ol>
<li>Mengurai dan memperbarui konfigurasi, dan menentukan metrik. <code translate="no">server-configmap</code> berhubungan dengan konfigurasi Milvus standalone atau cluster, sedangkan <code translate="no">client-configmap</code> berhubungan dengan konfigurasi kasus uji.</li>
<li>Mengkonfigurasi server dan klien.</li>
<li>Persiapan data</li>
<li>Meminta interaksi antara server dan klien.</li>
<li>Melaporkan dan menampilkan metrik.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">Alat dan metode untuk efisiensi QA yang lebih baik<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Dari bagian pengujian modul, kita dapat melihat bahwa prosedur untuk sebagian besar pengujian sebenarnya hampir sama, terutama melibatkan modifikasi konfigurasi server dan klien Milvus, dan mengoper parameter API. Ketika ada beberapa konfigurasi, semakin bervariasi kombinasi konfigurasi yang berbeda, semakin banyak skenario pengujian yang dapat dicakup oleh eksperimen dan pengujian ini. Hasilnya, penggunaan ulang kode dan prosedur menjadi semakin penting dalam proses peningkatan efisiensi pengujian.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">Kerangka kerja pengujian SDK</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>Kerangka kerja pengujian SDK</span> </span></p>
<p>Untuk mempercepat proses pengujian, kita dapat menambahkan pembungkus <code translate="no">API_request</code> ke kerangka kerja pengujian asli, dan mengaturnya sebagai sesuatu yang mirip dengan API gateway. API gateway ini akan bertugas mengumpulkan semua permintaan API dan kemudian meneruskannya ke Milvus untuk menerima respons secara kolektif. Tanggapan ini akan diteruskan kembali ke klien setelahnya. Desain seperti ini membuat pengambilan informasi log tertentu seperti parameter, dan hasil yang dikembalikan menjadi lebih mudah. Selain itu, komponen pemeriksa dalam kerangka kerja pengujian SDK dapat memverifikasi dan memeriksa hasil dari Milvus. Dan semua metode pengecekan dapat ditentukan dalam komponen checker ini.</p>
<p>Dengan kerangka kerja pengujian SDK, beberapa proses inisialisasi yang krusial dapat dibungkus dalam satu fungsi. Dengan demikian, potongan besar kode yang membosankan dapat dihilangkan.</p>
<p>Perlu juga dicatat bahwa setiap kasus uji individu terkait dengan koleksi uniknya untuk memastikan isolasi data.</p>
<p>Saat menjalankan kasus uji,<code translate="no">pytest-xdist</code>, ekstensi pytest, dapat dimanfaatkan untuk menjalankan semua kasus uji secara paralel, sehingga sangat meningkatkan efisiensi.</p>
<h3 id="GitHub-action" class="common-anchor-header">Tindakan GitHub</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>Tindakan GitHub</span> </span></p>
<p><a href="https://docs.github.com/en/actions">GitHub Action</a> juga diadopsi untuk meningkatkan efisiensi QA karena karakteristiknya sebagai berikut:</p>
<ul>
<li>Ini adalah alat CI/CD asli yang terintegrasi secara mendalam dengan GitHub.</li>
<li>Alat ini hadir dengan lingkungan mesin yang dikonfigurasi secara seragam dan alat pengembangan perangkat lunak umum yang sudah diinstal sebelumnya, termasuk Docker, Docker Compose, dll.</li>
<li>Mendukung berbagai sistem operasi dan versi termasuk Ubuntu, MacOs, Windows-server, dll.</li>
<li>Memiliki pasar yang menawarkan ekstensi yang kaya dan fungsi-fungsi di luar kotak.</li>
<li>Matriksnya mendukung pekerjaan yang bersamaan, dan menggunakan kembali alur pengujian yang sama untuk meningkatkan efisiensi</li>
</ul>
<p>Terlepas dari karakteristik di atas, alasan lain untuk mengadopsi GitHub Action adalah karena uji penyebaran dan uji reliabilitas membutuhkan lingkungan yang independen dan terisolasi. Dan GitHub Action sangat ideal untuk pemeriksaan inspeksi harian pada dataset berskala kecil.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">Alat bantu untuk uji tolok ukur</h3><p>Untuk membuat pengujian QA lebih efisien, sejumlah alat bantu digunakan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>Alat bantu QA</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: seperangkat alat sumber terbuka untuk Kubernetes untuk menjalankan alur kerja dan mengelola cluster dengan menjadwalkan tugas. Alat ini juga dapat menjalankan beberapa tugas secara paralel.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Dasbor Kubernetes</a>: antarmuka pengguna Kubernetes berbasis web untuk memvisualisasikan <code translate="no">server-configmap</code> dan <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: Network attached storage (NAS) adalah server penyimpanan data komputer tingkat file untuk menyimpan dataset benchmark ANN yang umum.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> dan <a href="https://www.mongodb.com/">MongoDB</a>: Basis data untuk menyimpan hasil tes benchmark.</li>
<li><a href="https://grafana.com/">Grafana</a>: Solusi analitik dan pemantauan sumber terbuka untuk memantau metrik sumber daya server dan metrik kinerja klien.</li>
<li><a href="https://redash.io/">Redash</a>: Layanan yang membantu memvisualisasikan data Anda dan membuat bagan untuk pengujian benchmark.</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Tentang Seri Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">pengumuman resmi ketersediaan umum</a> Milvus 2.0, kami menyusun seri blog Milvus Deep Dive ini untuk memberikan interpretasi mendalam tentang arsitektur dan kode sumber Milvus. Topik-topik yang dibahas dalam seri blog ini meliputi:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Gambaran umum arsitektur Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API dan SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Pemrosesan data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Manajemen data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Kueri waktu nyata</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Mesin eksekusi skalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistem QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Mesin eksekusi vektor</a></li>
</ul>
