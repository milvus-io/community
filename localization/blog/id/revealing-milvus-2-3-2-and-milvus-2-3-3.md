---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: >-
  Mengungkap Milvus 2.3.2 &amp; 2.3.3: Dukungan untuk Tipe Data Array,
  Penghapusan Kompleks, Integrasi TiKV, dan Lainnya
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  Hari ini, kami dengan senang hati mengumumkan peluncuran Milvus 2.3.2 dan
  2.3.3! Pembaruan ini menghadirkan banyak fitur menarik, optimalisasi, dan
  peningkatan, meningkatkan kinerja sistem, fleksibilitas, dan pengalaman
  pengguna secara keseluruhan.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam lanskap teknologi pencarian vektor yang terus berkembang, Milvus tetap menjadi yang terdepan, mendorong batas-batas dan menetapkan standar baru. Hari ini, kami dengan senang hati mengumumkan peluncuran Milvus 2.3.2 dan 2.3.3! Pembaruan ini menghadirkan banyak fitur menarik, optimasi, dan peningkatan, meningkatkan kinerja sistem, fleksibilitas, dan pengalaman pengguna secara keseluruhan.</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">Dukungan untuk tipe data Array - membuat hasil pencarian menjadi lebih akurat dan relevan<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>Menambahkan dukungan tipe data Array adalah peningkatan penting untuk Milvus, terutama dalam skenario penyaringan kueri seperti intersection dan union. Penambahan ini memastikan bahwa hasil pencarian tidak hanya lebih akurat tetapi juga lebih relevan. Dalam istilah praktis, misalnya, dalam sektor e-commerce, tag produk yang disimpan sebagai string Array memungkinkan konsumen untuk melakukan pencarian lanjutan, menyaring hasil yang tidak relevan.</p>
<p>Lihat <a href="https://milvus.io/docs/array_data_type.md">dokumentasi</a> komprehensif kami untuk panduan mendalam tentang cara memanfaatkan tipe Array di Milvus.</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">Dukungan untuk ekspresi hapus yang kompleks - meningkatkan manajemen data Anda<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada versi sebelumnya, Milvus mendukung ekspresi penghapusan kunci utama, menyediakan arsitektur yang stabil dan efisien. Dengan Milvus 2.3.2 atau 2.3.3, pengguna dapat menggunakan ekspresi penghapusan yang kompleks, memfasilitasi tugas-tugas manajemen data yang canggih seperti pembersihan data lama secara bergilir atau penghapusan data yang digerakkan oleh kepatuhan terhadap GDPR berdasarkan ID pengguna.</p>
<p>Catatan: Pastikan Anda telah memuat koleksi sebelum menggunakan ekspresi yang rumit. Selain itu, penting untuk dicatat bahwa proses penghapusan tidak menjamin atomisitas.</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">Integrasi TiKV - penyimpanan metadata yang dapat diskalakan dengan stabilitas<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelumnya mengandalkan Etcd untuk penyimpanan metadata, Milvus menghadapi tantangan kapasitas dan skalabilitas yang terbatas dalam penyimpanan metadata. Untuk mengatasi masalah ini, Milvus menambahkan TiKV, sebuah penyimpanan nilai kunci sumber terbuka, sebagai satu lagi opsi untuk penyimpanan metadata. TiKV menawarkan skalabilitas, stabilitas, dan efisiensi yang lebih baik, menjadikannya solusi ideal untuk kebutuhan Milvus yang terus berkembang. Mulai dari Milvus 2.3.2, pengguna dapat beralih ke TiKV untuk penyimpanan metadata mereka dengan memodifikasi konfigurasi.</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">Dukungan untuk tipe vektor FP16 - merangkul efisiensi pembelajaran mesin<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2 dan versi yang lebih baru sekarang mendukung tipe vektor FP16 pada tingkat antarmuka. FP16, atau floating point 16-bit, adalah format data yang banyak digunakan dalam deep learning dan machine learning, yang menyediakan representasi dan perhitungan nilai numerik yang efisien. Meskipun dukungan penuh untuk FP16 sedang dilakukan, berbagai indeks dalam lapisan pengindeksan memerlukan konversi FP16 ke FP32 selama konstruksi.</p>
<p>Kami akan sepenuhnya mendukung tipe data FP16, BF16, dan int8 di versi Milvus yang lebih baru. Tetap disini.</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">Peningkatan signifikan dalam pengalaman peningkatan bergulir - transisi yang mulus bagi pengguna<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>Upgrade bergulir adalah fitur penting untuk sistem terdistribusi, memungkinkan peningkatan sistem tanpa mengganggu layanan bisnis atau mengalami waktu henti. Dalam rilis Milvus terbaru, kami telah memperkuat fitur peningkatan bergulir Milvus, memastikan transisi yang lebih efisien dan efisien untuk peningkatan pengguna dari versi 2.2.15 ke 2.3.3 dan semua versi yang lebih baru. Komunitas juga telah berinvestasi dalam pengujian dan pengoptimalan yang ekstensif, mengurangi dampak kueri selama peningkatan menjadi kurang dari 5 menit, memberikan pengalaman yang bebas gangguan kepada pengguna.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Optimalisasi kinerja<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain memperkenalkan fitur-fitur baru, kami telah mengoptimalkan kinerja Milvus secara signifikan dalam dua rilis terbaru.</p>
<ul>
<li><p>Operasi penyalinan data yang diminimalkan untuk pemuatan data yang dioptimalkan</p></li>
<li><p>Penyisipan berkapasitas besar yang disederhanakan menggunakan pembacaan varchar batch</p></li>
<li><p>Menghapus pemeriksaan offset yang tidak perlu selama padding data untuk meningkatkan kinerja fase pemanggilan.</p></li>
<li><p>Mengatasi masalah konsumsi CPU yang tinggi dalam skenario dengan penyisipan data yang besar</p></li>
</ul>
<p>Pengoptimalan ini secara kolektif berkontribusi pada pengalaman Milvus yang lebih cepat dan lebih efisien. Lihat dasbor pemantauan kami untuk melihat sekilas bagaimana Milvus meningkatkan kinerjanya.</p>
<h2 id="Incompatible-changes" class="common-anchor-header">Perubahan yang tidak kompatibel<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Kode terkait TimeTravel yang dihapus secara permanen.</p></li>
<li><p>Dukungan yang sudah tidak digunakan lagi untuk MySQL sebagai penyimpan metadata.</p></li>
</ul>
<p>Lihat <a href="https://milvus.io/docs/release_notes.md">catatan rilis Milvus</a> untuk informasi lebih rinci tentang semua fitur dan peningkatan baru.</p>
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
    </button></h2><p>Dengan rilis Milvus 2.3.2 dan 2.3.3 terbaru, kami berkomitmen untuk menyediakan solusi basis data yang kuat, kaya fitur, dan berkinerja tinggi. Jelajahi fitur-fitur baru ini, manfaatkan pengoptimalan, dan bergabunglah dengan kami dalam perjalanan yang menarik ini saat kami mengembangkan Milvus untuk memenuhi tuntutan manajemen data modern. Unduh versi terbaru sekarang dan rasakan masa depan penyimpanan data dengan Milvus!</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Mari tetap terhubung!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda memiliki pertanyaan atau umpan balik tentang Milvus, bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami untuk berinteraksi dengan teknisi dan komunitas kami secara langsung atau bergabunglah dengan <a href="https://discord.com/invite/RjNbk8RR4f">Makan Siang dan Belajar Komunitas Milvus</a> setiap hari Selasa mulai pukul 12.00-12.30 PST. Anda juga dapat mengikuti kami di <a href="https://twitter.com/milvusio">Twitter</a> atau <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> untuk mendapatkan berita dan informasi terbaru tentang Milvus.</p>
