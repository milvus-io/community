---
id: scheduling-query-tasks-milvus.md
title: Latar Belakang
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: Pekerjaan di balik layar
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Bagaimana Milvus Menjadwalkan Tugas Kueri</custom-h1><p>alam artikel ini, kita akan membahas bagaimana Milvus menjadwalkan tugas-tugas kueri. Kita juga akan membahas masalah, solusi, dan orientasi masa depan untuk mengimplementasikan penjadwalan Milvus.</p>
<h2 id="Background" class="common-anchor-header">Latar Belakang<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita tahu dari Mengelola Data dalam Mesin Pencari Vektor Berskala Besar bahwa pencarian kemiripan vektor diimplementasikan dengan jarak antara dua vektor dalam ruang dimensi tinggi. Tujuan dari pencarian vektor adalah untuk menemukan K vektor yang paling dekat dengan vektor target.</p>
<p>Ada banyak cara untuk mengukur jarak vektor, seperti jarak Euclidean:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euclidean-distance.png</span> </span></p>
<p>di mana x dan y adalah dua vektor. n adalah dimensi vektor.</p>
<p>Untuk menemukan K vektor terdekat dalam kumpulan data, jarak Euclidean perlu dihitung antara vektor target dan semua vektor dalam kumpulan data yang akan dicari. Kemudian, vektor diurutkan berdasarkan jarak untuk mendapatkan K vektor terdekat. Pekerjaan komputasi berbanding lurus dengan ukuran set data. Semakin besar dataset, semakin banyak pekerjaan komputasi yang dibutuhkan kueri. GPU, yang dikhususkan untuk pemrosesan grafik, memiliki banyak core untuk menyediakan daya komputasi yang dibutuhkan. Oleh karena itu, dukungan multi-GPU juga menjadi pertimbangan dalam implementasi Milvus.</p>
<h2 id="Basic-concepts" class="common-anchor-header">Konsep dasar<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">Blok data (TabelFile)</h3><p>Untuk meningkatkan dukungan pencarian data berskala masif, kami mengoptimalkan penyimpanan data Milvus. Milvus membagi data dalam tabel berdasarkan ukurannya menjadi beberapa blok data. Selama pencarian vektor, Milvus mencari vektor di setiap blok data dan menggabungkan hasilnya. Satu operasi pencarian vektor terdiri dari N operasi pencarian vektor independen (N adalah jumlah blok data) dan N-1 operasi penggabungan hasil.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">Antrian tugas (Tabel Tugas)</h3><p>Setiap Sumber Daya memiliki larik tugas, yang mencatat tugas-tugas milik Sumber Daya. Setiap tugas memiliki status yang berbeda, termasuk Mulai, Memuat, Dimuat, Dieksekusi, dan Dieksekusi. Pemuat dan Eksekutor dalam perangkat komputasi berbagi antrean tugas yang sama.</p>
<h3 id="Query-scheduling" class="common-anchor-header">Penjadwalan kueri</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>Penjadwalan 2-query.png</span> </span></p>
<ol>
<li>Ketika server Milvus dimulai, Milvus meluncurkan GpuResource yang sesuai melalui parameter <code translate="no">gpu_resource_config</code> dalam file konfigurasi <code translate="no">server_config.yaml</code>. DiskResource dan CpuResource masih belum dapat diedit di <code translate="no">server_config.yaml</code>. GpuResource adalah kombinasi dari <code translate="no">search_resources</code> dan <code translate="no">build_index_resources</code> dan disebut sebagai <code translate="no">{gpu0, gpu1}</code> dalam contoh berikut:</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-contoh-kode.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-contoh.png</span> </span></p>
<ol start="2">
<li>Milvus menerima sebuah permintaan. Metadata tabel disimpan dalam basis data eksternal, yaitu SQLite atau MySQl untuk host tunggal dan MySQL untuk terdistribusi. Setelah menerima permintaan pencarian, Milvus memvalidasi apakah tabel tersebut ada dan dimensinya konsisten. Kemudian, Milvus membaca daftar TableFile dari tabel tersebut.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-membaca-daftar-tablefile-list.png</span> </span></p>
<ol start="3">
<li>Milvus membuat sebuah SearchTask. Karena komputasi setiap TableFile dilakukan secara independen, Milvus membuat SearchTask untuk setiap TableFile. Sebagai unit dasar penjadwalan tugas, SearchTask berisi vektor target, parameter pencarian, dan nama-nama file dari TableFile.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-daftar-file-file-daftar-tugas-pembuat.png</span> </span></p>
<ol start="4">
<li>Milvus memilih perangkat komputasi. Perangkat yang digunakan SearchTask untuk melakukan komputasi tergantung pada <strong>perkiraan</strong> waktu <strong>penyelesaian</strong> untuk setiap perangkat. <strong>Perkiraan</strong> waktu penyelesaian menentukan perkiraan interval antara waktu saat ini dan perkiraan waktu ketika komputasi selesai.</li>
</ol>
<p>Misalnya, saat blok data SearchTask dimuat ke memori CPU, SearchTask berikutnya menunggu di antrean tugas komputasi CPU dan antrean tugas komputasi GPU menganggur. <strong>Perkiraan waktu penyelesaian</strong> untuk CPU sama dengan jumlah perkiraan biaya waktu SearchTask sebelumnya dan SearchTask saat ini. Perkiraan <strong>waktu penyelesaian</strong> untuk GPU sama dengan jumlah waktu blok data yang akan dimuat ke GPU dan perkiraan biaya waktu SearchTask saat ini. <strong>Perkiraan waktu penyelesaian</strong> untuk sebuah SearchTask dalam sebuah Sumber Daya sama dengan waktu eksekusi rata-rata semua SearchTask dalam Sumber Daya tersebut. Milvus kemudian memilih perangkat dengan <strong>estimasi waktu penyelesaian</strong> yang paling sedikit dan menetapkan SearchTask ke perangkat tersebut.</p>
<p>Di sini kami mengasumsikan bahwa <strong>estimasi waktu penyelesaian</strong> untuk GPU1 lebih pendek.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-estimasi-waktu-penyelesaian-lebih-pendek.png</span> </span></p>
<ol start="5">
<li><p>Milvus menambahkan SearchTask ke antrean tugas DiskResource.</p></li>
<li><p>Milvus memindahkan SearchTask ke antrean tugas CpuResource. Thread pemuatan di CpuResource memuat setiap tugas dari antrean tugas secara berurutan. CpuResource membaca blok data yang sesuai ke memori CPU.</p></li>
<li><p>Milvus memindahkan SearchTask ke GpuResource. Thread pemuatan di GpuResource menyalin data dari memori CPU ke memori GPU. GpuResource membaca blok data yang sesuai ke memori GPU.</p></li>
<li><p>Milvus mengeksekusi SearchTask di GpuResource. Karena hasil dari SearchTask relatif kecil, hasilnya langsung dikembalikan ke memori CPU.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-penjadwal.png</span> </span></p>
<ol start="9">
<li>Milvus menggabungkan hasil dari SearchTask ke seluruh hasil pencarian.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-menggabungkan-hasil-pencarian.png</span> </span></p>
<p>Setelah semua SearchTask selesai, Milvus mengembalikan seluruh hasil pencarian ke klien.</p>
<h2 id="Index-building" class="common-anchor-header">Pembuatan indeks<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>Pembuatan indeks pada dasarnya sama dengan proses pencarian tanpa proses penggabungan. Kami tidak akan membahas hal ini secara detail.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Pengoptimalan kinerja<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">Cache</h3><p>Seperti yang telah disebutkan sebelumnya, blok data perlu dimuat ke perangkat penyimpanan yang sesuai seperti memori CPU atau memori GPU sebelum komputasi. Untuk menghindari pemuatan data yang berulang-ulang, Milvus memperkenalkan cache LRU (Least Recently Used). Ketika cache penuh, blok data baru akan menyingkirkan blok data lama. Anda dapat menyesuaikan ukuran cache dengan file konfigurasi berdasarkan ukuran memori saat ini. Cache yang besar untuk menyimpan data pencarian disarankan untuk menghemat waktu pemuatan data secara efektif dan meningkatkan kinerja pencarian.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">Tumpang tindih pemuatan data dan komputasi</h3><p>Cache tidak dapat memenuhi kebutuhan kita akan kinerja pencarian yang lebih baik. Data perlu dimuat ulang ketika memori tidak mencukupi atau ukuran kumpulan data terlalu besar. Kita perlu mengurangi efek pemuatan data pada kinerja pencarian. Pemuatan data, baik dari disk ke memori CPU atau dari memori CPU ke memori GPU, termasuk dalam operasi IO dan hampir tidak memerlukan pekerjaan komputasi dari prosesor. Jadi, kami mempertimbangkan untuk melakukan pemuatan data dan komputasi secara paralel untuk penggunaan sumber daya yang lebih baik.</p>
<p>Kami membagi komputasi pada blok data menjadi 3 tahap (pemuatan dari disk ke memori CPU, komputasi CPU, penggabungan hasil) atau 4 tahap (pemuatan dari disk ke memori CPU, pemuatan dari memori CPU ke memori GPU, komputasi GPU dan pengambilan hasil, dan penggabungan hasil). Ambil komputasi 3 tahap sebagai contoh, kita dapat menjalankan 3 thread yang bertanggung jawab atas 3 tahap untuk berfungsi sebagai pipelining instruksi. Karena set hasil sebagian besar kecil, penggabungan hasil tidak membutuhkan banyak waktu. Dalam beberapa kasus, tumpang tindih pemuatan data dan komputasi dapat mengurangi waktu pencarian hingga 1/2.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-urutan-tumpang tindih-memuat-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">Masalah dan solusi<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">Kecepatan transmisi yang berbeda</h3><p>Sebelumnya, Milvus menggunakan strategi Round Robin untuk penjadwalan tugas multi-GPU. Strategi ini bekerja dengan sempurna di server 4-GPU kami dan performa pencarian 4 kali lebih baik. Namun, untuk host 2-GPU kami, kinerjanya tidak 2 kali lebih baik. Kami melakukan beberapa percobaan dan menemukan bahwa kecepatan penyalinan data untuk sebuah GPU adalah 11 GB/s. Namun, untuk GPU lainnya, kecepatannya adalah 3 GB/s. Setelah mengacu pada dokumentasi mainboard, kami mengonfirmasi bahwa mainboard tersebut terhubung ke satu GPU melalui PCIe x16 dan GPU lainnya melalui PCIe x4. Dengan kata lain, GPU ini memiliki kecepatan penyalinan yang berbeda. Kemudian, kami menambahkan waktu penyalinan untuk mengukur perangkat yang optimal untuk setiap SearchTask.</p>
<h2 id="Future-work" class="common-anchor-header">Pekerjaan di masa mendatang<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">Lingkungan perangkat keras dengan peningkatan kompleksitas</h3><p>Dalam kondisi nyata, lingkungan perangkat keras mungkin lebih rumit. Untuk lingkungan perangkat keras dengan banyak CPU, memori dengan arsitektur NUMA, NVLink, dan NVSwitch, komunikasi antar CPU/GPU membawa banyak peluang untuk pengoptimalan.</p>
<p>Pengoptimalan kueri</p>
<p>Selama eksperimen, kami menemukan beberapa peluang untuk peningkatan performa. Misalnya, ketika server menerima beberapa kueri untuk tabel yang sama, kueri dapat digabungkan dalam beberapa kondisi. Dengan menggunakan lokalitas data, kami dapat meningkatkan kinerja. Pengoptimalan ini akan diimplementasikan dalam pengembangan kami di masa depan. Sekarang kita sudah mengetahui bagaimana query dijadwalkan dan dilakukan untuk skenario single-host, multi-GPU. Kami akan terus memperkenalkan lebih banyak mekanisme dalam untuk Milvus di artikel-artikel mendatang.</p>
