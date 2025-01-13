---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 'Milvus yang Terbaik: Menjelajahi v2.2 hingga v2.2.6'
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: apa yang baru di Milvus 2.2 hingga 2.2.6
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>Milvus yang Terbaik</span> </span></p>
<p>Selamat datang kembali, para pengikut Milvus! Kami tahu sudah cukup lama sejak terakhir kali kami membagikan pembaruan pada database vektor sumber terbuka yang canggih ini. Tapi jangan khawatir, karena kami di sini untuk memberi tahu Anda tentang semua perkembangan menarik yang telah terjadi sejak Agustus lalu.</p>
<p>Dalam artikel blog ini, kami akan mengajak Anda untuk melihat rilis Milvus terbaru, mulai dari versi 2.2 hingga versi 2.2.6. Ada banyak hal yang akan kami bahas, termasuk fitur-fitur baru, peningkatan, perbaikan bug, dan pengoptimalan. Jadi, kencangkan sabuk pengaman Anda, dan mari kita selami!</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2: rilis utama dengan peningkatan stabilitas, kecepatan pencarian yang lebih cepat, dan skalabilitas yang fleksibel<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2 adalah rilis penting yang memperkenalkan tujuh fitur baru dan berbagai terobosan peningkatan pada versi sebelumnya. Mari kita lihat lebih dekat beberapa hal yang menarik:</p>
<ul>
<li><strong>Penyisipan Massal Entitas dari File</strong>: Dengan fitur ini, Anda dapat mengunggah sejumlah entitas dalam satu atau beberapa file secara langsung ke Milvus hanya dengan beberapa baris kode, sehingga menghemat waktu dan tenaga Anda.</li>
<li><strong>Penomoran Hasil Kueri</strong>: Untuk menghindari hasil pencarian dan kueri yang sangat besar yang kembali dalam satu panggilan prosedur jarak jauh (RPC), Milvus v2.2 memungkinkan Anda untuk mengonfigurasi offset dan memfilter hasil dengan kata kunci dalam pencarian dan kueri.</li>
<li><strong>Kontrol Akses Berbasis Peran (RBAC</strong>): Milvus v2.2 sekarang mendukung RBAC, memungkinkan Anda untuk mengontrol akses ke instance Milvus Anda dengan mengelola pengguna, peran, dan izin.</li>
<li><strong>Kuota dan Batas</strong>: Kuota dan batasan adalah mekanisme baru dalam Milvus v2.2 yang melindungi sistem basis data dari kesalahan out-of-memory (OOM) dan crash saat terjadi lonjakan trafik secara tiba-tiba. Dengan fitur ini, Anda dapat mengontrol konsumsi, pencarian, dan penggunaan memori.</li>
<li><strong>Time to Live (TTL) pada Tingkat Koleksi</strong>: Pada rilis sebelumnya, Milvus hanya mengizinkan Anda untuk mengonfigurasi TTL untuk cluster Anda. Namun, Milvus v2.2 sekarang mendukung konfigurasi TTL pada tingkat koleksi. Mengkonfigurasi TTL untuk koleksi tertentu dan entitas dalam koleksi tersebut akan secara otomatis berakhir setelah TTL berakhir. Konfigurasi ini memberikan kontrol yang lebih baik atas retensi data.</li>
<li><strong>Indeks Perkiraan Pencarian Tetangga Terdekat (ANNS) Berbasis Disk (Beta)</strong>: Milvus v2.2 memperkenalkan dukungan untuk DiskANN, sebuah algoritme ANNS berbasis grafik Vamana yang berbasis pada SSD. Dukungan ini memungkinkan pencarian langsung pada kumpulan data berskala besar, yang secara signifikan dapat mengurangi penggunaan memori hingga 10 kali lipat.</li>
<li><strong>Pencadangan Data (Beta)</strong>: Milvus v2.2 menyediakan <a href="https://github.com/zilliztech/milvus-backup">alat baru</a> untuk mencadangkan dan memulihkan data Milvus Anda dengan benar, baik melalui baris perintah atau server API.</li>
</ul>
<p>Selain fitur-fitur baru yang disebutkan di atas, Milvus v2.2 mencakup perbaikan untuk lima bug dan beberapa peningkatan untuk meningkatkan stabilitas, kemampuan pengamatan, dan kinerja Milvus. Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md#v220">Catatan Rilis Milvus v2.2.</a></p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 &amp; v2.2.2: rilis minor dengan masalah yang telah diperbaiki<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 dan v2.2.2 merupakan rilis minor yang berfokus pada perbaikan masalah kritis pada versi sebelumnya dan memperkenalkan fitur-fitur baru. Berikut adalah beberapa sorotan:</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Mendukung penyewa Pulsa dan otentikasi</li>
<li>Mendukung keamanan lapisan transport (TLS) dalam sumber konfigurasi etcd</li>
<li>Meningkatkan kinerja pencarian lebih dari 30%.</li>
<li>Mengoptimalkan penjadwal dan meningkatkan kemungkinan penggabungan tugas</li>
<li>Memperbaiki beberapa bug, termasuk kegagalan pemfilteran istilah pada bidang skalar yang diindeks dan kepanikan IndexNode saat gagal membuat indeks</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>Memperbaiki masalah bahwa proksi tidak memperbarui cache pemimpin pecahan</li>
<li>Memperbaiki masalah bahwa info yang dimuat tidak dibersihkan untuk koleksi / partisi yang dirilis</li>
<li>Memperbaiki masalah bahwa jumlah beban tidak dibersihkan tepat waktu</li>
</ul>
<p>Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md#v221">Catatan Rilis Milvus v2.2.1</a> dan <a href="https://milvus.io/docs/release_notes.md#v222">Catatan Rilis Milvus v2.2.2</a>.</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3: lebih aman, stabil, dan tersedia<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3 adalah rilis yang berfokus pada peningkatan keamanan, stabilitas, dan ketersediaan sistem. Selain itu, rilis ini juga memperkenalkan dua fitur penting:</p>
<ul>
<li><p><strong>Upgrade bergulir</strong>: Fitur ini memungkinkan Milvus untuk menanggapi permintaan yang masuk selama proses upgrade, yang tidak mungkin dilakukan pada rilis sebelumnya. Upgrade bergulir memastikan sistem tetap tersedia dan responsif terhadap permintaan pengguna bahkan selama peningkatan.</p></li>
<li><p><strong>Ketersediaan tinggi koordinator (HA)</strong>: Fitur ini memungkinkan koordinator Milvus untuk bekerja dalam mode siaga aktif, sehingga mengurangi risiko kegagalan satu titik. Bahkan dalam bencana yang tidak terduga, waktu pemulihan dikurangi menjadi paling lama 30 detik.</p></li>
</ul>
<p>Selain fitur-fitur baru ini, Milvus v2.2.3 mencakup banyak peningkatan dan perbaikan bug, termasuk peningkatan kinerja penyisipan massal, penggunaan memori yang lebih sedikit, metrik pemantauan yang dioptimalkan, dan kinerja meta-storage yang lebih baik. Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md#v223">Catatan Rilis Milvus v2.2.3.</a></p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4: lebih cepat, lebih andal, dan hemat sumber daya<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4 merupakan pembaruan minor untuk Milvus v2.2. Milvus v2.2.4 memperkenalkan empat fitur baru dan beberapa peningkatan, yang menghasilkan kinerja yang lebih cepat, meningkatkan keandalan, dan mengurangi konsumsi sumber daya. Hal-hal penting dari rilis ini meliputi:</p>
<ul>
<li><strong>Pengelompokan sumber daya</strong>: Milvus sekarang mendukung pengelompokan QueryNode ke dalam kelompok sumber daya lain, memungkinkan isolasi penuh akses ke sumber daya fisik dalam kelompok yang berbeda.</li>
<li>Penggantian<strong>nama koleksi</strong>: API penggantian nama koleksi memungkinkan pengguna untuk mengubah nama koleksi, memberikan fleksibilitas yang lebih besar dalam mengelola koleksi dan meningkatkan kegunaan.</li>
<li><strong>Dukungan untuk Google Cloud Storage</strong></li>
<li><strong>Opsi baru dalam API pencarian dan kueri</strong>: Fitur baru ini memungkinkan pengguna untuk melewatkan pencarian pada semua segmen yang sedang berkembang, menawarkan kinerja pencarian yang lebih baik dalam skenario di mana pencarian dilakukan bersamaan dengan penyisipan data.</li>
</ul>
<p>Untuk informasi lebih lanjut, lihat <a href="https://milvus.io/docs/release_notes.md#v224">Catatan Rilis Milvus v2.2.4.</a></p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: TIDAK DIREKOMENDASIKAN<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5 memiliki beberapa masalah kritis, dan oleh karena itu, kami tidak menyarankan untuk menggunakan rilis ini.  Kami dengan tulus meminta maaf atas ketidaknyamanan yang disebabkan oleh masalah-masalah tersebut. Namun, masalah-masalah ini telah diatasi dalam Milvus v2.2.6.</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6: menyelesaikan masalah-masalah kritis dari v2.2.5<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6 telah berhasil mengatasi masalah kritis yang ditemukan pada v2.2.5, termasuk masalah dengan daur ulang data binlog kotor dan kegagalan DataCoord GC. Jika saat ini Anda menggunakan v2.2.5, silakan lakukan upgrade untuk memastikan kinerja dan stabilitas yang optimal.</p>
<p>Masalah kritis yang diperbaiki meliputi:</p>
<ul>
<li>Kegagalan DataCoord GC</li>
<li>Penimpaan parameter indeks yang dilewatkan</li>
<li>Penundaan sistem yang disebabkan oleh penumpukan pesan RootCoord</li>
<li>Ketidakakuratan metrik RootCoordInsertChannelTimeTick</li>
<li>Kemungkinan penghentian cap waktu</li>
<li>Penghancuran diri peran koordinator sesekali selama proses restart</li>
<li>Pos pemeriksaan yang tertinggal karena keluarnya pengumpulan sampah yang tidak normal</li>
</ul>
<p>Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md#v226">Catatan Rilis Milvus v2.2.6</a>.</p>
<h2 id="Summary" class="common-anchor-header">Ringkasan<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagai kesimpulan, rilis Milvus terbaru dari v2.2 ke v2.2.6 telah memberikan banyak pembaruan dan peningkatan yang menarik. Dari fitur-fitur baru hingga perbaikan bug dan pengoptimalan, Milvus terus memenuhi komitmennya untuk menyediakan solusi mutakhir dan memberdayakan aplikasi di berbagai domain. Nantikan pembaruan dan inovasi yang lebih menarik dari komunitas Milvus.</p>
