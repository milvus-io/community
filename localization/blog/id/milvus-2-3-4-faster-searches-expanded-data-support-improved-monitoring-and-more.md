---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: >-
  Milvus 2.3.4: Pencarian Lebih Cepat, Dukungan Data yang Diperluas, Pemantauan
  yang Lebih Baik, dan Banyak Lagi
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: Memperkenalkan fitur dan peningkatan baru Milvus 2.3.4
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kami sangat senang untuk memperkenalkan rilis terbaru Milvus 2.3.4. Pembaruan ini memperkenalkan serangkaian fitur dan peningkatan yang dibuat dengan cermat untuk mengoptimalkan kinerja, meningkatkan efisiensi, dan memberikan pengalaman pengguna yang mulus. Dalam artikel blog ini, kami akan membahas hal-hal penting dari Milvus 2.3.4.</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">Akses log untuk pemantauan yang lebih baik<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus sekarang mendukung log akses, menawarkan wawasan yang sangat berharga tentang interaksi dengan antarmuka eksternal. Log ini mencatat nama metode, permintaan pengguna, waktu respons, kode kesalahan, dan informasi interaksi lainnya, yang memberdayakan pengembang dan administrator sistem untuk melakukan analisis kinerja, audit keamanan, dan pemecahan masalah yang efisien.</p>
<p><strong><em>Catatan:</em></strong> <em>Saat ini, log akses hanya mendukung interaksi gRPC. Namun, komitmen kami untuk terus melakukan peningkatan, dan versi mendatang akan memperluas kemampuan ini untuk menyertakan log permintaan RESTful.</em></p>
<p>Untuk informasi lebih lanjut, lihat <a href="https://milvus.io/docs/configure_access_logs.md">Mengonfigurasi Log Akses</a>.</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">Impor file parket untuk meningkatkan efisiensi pemrosesan data<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4 sekarang mendukung impor file Parquet, format penyimpanan kolom yang digunakan secara luas yang dirancang untuk meningkatkan efisiensi penyimpanan dan pemrosesan set data berskala besar. Penambahan ini memberikan fleksibilitas dan efisiensi yang lebih baik kepada pengguna dalam upaya pemrosesan data mereka. Dengan menghilangkan kebutuhan konversi format data yang melelahkan, pengguna yang mengelola kumpulan data substansial dalam format Parket akan mengalami proses impor data yang efisien, secara signifikan mengurangi waktu dari persiapan data awal hingga pengambilan vektor berikutnya.</p>
<p>Selain itu, alat konversi format data kami, BulkWriter, kini telah menggunakan Parquet sebagai format data output default, memastikan pengalaman yang lebih intuitif bagi para pengembang.</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">Indeks binlog pada segmen yang sedang berkembang untuk pencarian yang lebih cepat<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus sekarang memanfaatkan indeks binlog pada segmen yang sedang berkembang, menghasilkan pencarian yang lebih cepat hingga sepuluh kali lipat di segmen yang sedang berkembang. Peningkatan ini secara signifikan meningkatkan efisiensi penelusuran dan mendukung indeks tingkat lanjut seperti IVF atau Fast Scan, sehingga meningkatkan pengalaman pengguna secara keseluruhan.</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">Dukungan hingga 10.000 koleksi/partisi<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti tabel dan partisi dalam basis data relasional, koleksi dan partisi merupakan unit inti untuk menyimpan dan mengelola data vektor di Milvus. Menanggapi kebutuhan pengguna yang terus berkembang akan organisasi data yang bernuansa, Milvus 2.3.4 kini mendukung hingga 10.000 koleksi/partisi dalam sebuah cluster, sebuah lompatan signifikan dari batas sebelumnya, yaitu 4.096 koleksi/partisi. Peningkatan ini bermanfaat bagi beragam kasus penggunaan, seperti manajemen basis pengetahuan dan lingkungan multi-penyewa. Dukungan yang diperluas untuk koleksi/partisi berasal dari penyempurnaan mekanisme time tick, manajemen goroutine, dan penggunaan memori.</p>
<p><strong><em>Catatan:</em></strong> <em>Batas yang disarankan untuk jumlah koleksi/partisi adalah 10.000, karena melebihi batas ini dapat berdampak pada pemulihan kegagalan dan penggunaan sumber daya</em>.</p>
<h2 id="Other-enhancements" class="common-anchor-header">Peningkatan lainnya<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain fitur-fitur di atas, Milvus 2.3.4 juga menyertakan berbagai peningkatan dan perbaikan bug. Ini termasuk pengurangan penggunaan memori selama pengambilan data dan penanganan data dengan panjang variabel, pesan kesalahan yang disempurnakan, kecepatan pemuatan yang dipercepat, dan keseimbangan pecahan kueri yang lebih baik. Peningkatan kolektif ini berkontribusi pada pengalaman pengguna yang lebih lancar dan lebih efisien secara keseluruhan.</p>
<p>Untuk gambaran umum yang komprehensif tentang semua perubahan yang diperkenalkan di Milvus 2.3.4, lihat <a href="https://milvus.io/docs/release_notes.md#v234">Catatan Rilis</a> kami.</p>
<h2 id="Stay-connected" class="common-anchor-header">Tetap terhubung!<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda memiliki pertanyaan atau umpan balik tentang Milvus, bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami untuk berinteraksi dengan para insinyur dan komunitas kami secara langsung atau bergabunglah dengan <a href="https://discord.com/invite/RjNbk8RR4f">Makan Si</a> ang <a href="https://discord.com/invite/RjNbk8RR4f">dan Belajar Komunitas Milvus</a> setiap hari Selasa mulai pukul 12.00 - 12.30 PST. Anda juga dapat mengikuti kami di <a href="https://twitter.com/milvusio">Twitter</a> atau <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> untuk mendapatkan berita dan informasi terbaru tentang Milvus.</p>
