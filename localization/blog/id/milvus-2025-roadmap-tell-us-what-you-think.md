---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: Peta Jalan Milvus 2025 - Beritahu Kami Apa yang Anda Pikirkan
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  Pada tahun 2025, kami akan meluncurkan dua versi utama, Milvus 2.6 dan Milvus
  3.0, dan banyak fitur teknis lainnya. Kami mengundang Anda untuk berbagi
  pemikiran dengan kami.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Hai, para pengguna dan kontributor Milvus!</p>
<p>Kami sangat senang dapat berbagi <a href="https://milvus.io/docs/roadmap.md"><strong>peta jalan Milvus 2025</strong></a> dengan Anda. 🚀 Rencana teknis ini menyoroti fitur-fitur utama dan peningkatan yang sedang kami bangun untuk membuat Milvus semakin kuat untuk kebutuhan pencarian vektor Anda.</p>
<p>Tapi ini baru permulaan-kami ingin masukan dari Anda! Masukan Anda akan membantu membentuk Milvus, memastikan Milvus berevolusi untuk memenuhi tantangan dunia nyata. Beri tahu kami pendapat Anda dan bantu kami menyempurnakan peta jalan saat kami melangkah maju.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">Lanskap Saat Ini<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>Selama setahun terakhir, kami telah melihat banyak dari Anda yang membangun aplikasi RAG dan agen yang mengesankan dengan Milvus, memanfaatkan banyak fitur populer kami, seperti integrasi model, pencarian teks lengkap, dan pencarian hybrid. Implementasi Anda telah memberikan wawasan yang berharga tentang kebutuhan pencarian vektor di dunia nyata.</p>
<p>Seiring perkembangan teknologi AI, kasus penggunaan Anda menjadi lebih canggih - mulai dari pencarian vektor dasar hingga aplikasi multimodal kompleks yang mencakup agen cerdas, sistem otonom, dan AI yang diwujudkan. Tantangan teknis ini menginformasikan peta jalan kami saat kami terus mengembangkan Milvus untuk memenuhi kebutuhan Anda.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">Dua Rilis Utama pada tahun 2025: Milvus 2.6 dan Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada tahun 2025, kami akan meluncurkan dua versi utama: Milvus 2.6 (Pertengahan CY25) dan Milvus 3.0 (akhir tahun 2025).</p>
<p><strong>Milvus 2.6</strong> berfokus pada peningkatan arsitektur inti yang Anda minta:</p>
<ul>
<li><p>Penerapan yang lebih sederhana dengan lebih sedikit ketergantungan (selamat tinggal, sakit kepala saat penerapan!)</p></li>
<li><p>Pipa konsumsi data yang lebih cepat</p></li>
<li><p>Biaya penyimpanan yang lebih rendah (kami mendengar masalah biaya produksi Anda)</p></li>
<li><p>Penanganan yang lebih baik untuk operasi data berskala besar (hapus/modifikasi)</p></li>
<li><p>Pencarian skalar dan teks lengkap yang lebih efisien</p></li>
<li><p>Dukungan untuk model penyematan terbaru yang Anda gunakan</p></li>
</ul>
<p><strong>Milvus 3.0</strong> adalah evolusi arsitektur kami yang lebih besar, memperkenalkan sistem danau data vektor untuk:</p>
<ul>
<li><p>Integrasi layanan AI yang mulus</p></li>
<li><p>Kemampuan pencarian tingkat berikutnya</p></li>
<li><p>Manajemen data yang lebih kuat</p></li>
<li><p>Penanganan yang lebih baik untuk kumpulan data offline besar yang sedang Anda kerjakan</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">Fitur Teknis yang Kami Rencanakan - Kami Butuh Masukan Anda<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Di bawah ini adalah fitur-fitur teknis utama yang kami rencanakan untuk ditambahkan ke Milvus.</p>
<table>
<thead>
<tr><th><strong>Area Fitur Utama</strong></th><th><strong>Fitur Teknis</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Pemrosesan Data Tidak Terstruktur Berbasis AI</strong></td><td>- Data Masuk/Keluar: Integrasi asli dengan layanan model utama untuk konsumsi teks mentah<br>- Penanganan Data Asli: Dukungan referensi teks/URL untuk pemrosesan data mentah<br>- Dukungan Tensor: Implementasi daftar vektor (untuk skenario ColBERT/CoPali/Video)<br>- Tipe Data yang Diperluas: Dukungan DateTime, Peta, GIS berdasarkan kebutuhan<br>- Pencarian Iteratif: Penyempurnaan vektor kueri melalui umpan balik pengguna</td></tr>
<tr><td><strong>Peningkatan Kualitas dan Performa Pencarian</strong></td><td>- Pencocokan Tingkat Lanjut: kemampuan pencocokan frasa &amp; multi-pencocokan<br>- Peningkatan Penganalisis: Meningkatkan Penganalisis dengan dukungan tokenizer yang diperluas dan peningkatan kemampuan pengamatan<br>- Pengoptimalan JSON: Pemfilteran yang lebih cepat melalui pengindeksan yang lebih baik<br>- Penyortiran Eksekusi: Pengurutan hasil berbasis bidang skalar<br>- Pemeringkatan Lanjutan: Pemeringkatan ulang berbasis model &amp; fungsi penilaian khusus<br>- Pencarian Iteratif: Penyempurnaan vektor kueri melalui umpan balik pengguna</td></tr>
<tr><td><strong>Fleksibilitas Manajemen Data</strong></td><td>- Perubahan Skema: Tambah/hapus bidang, ubah panjang varchar<br>- Agregasi Skalar: operasi hitung/beda/min/max<br>- Mendukung UDF: Mendukung fungsi yang ditentukan pengguna<br>- Versi Data: Sistem rollback berbasis snapshot<br>- Pengelompokan Data: Lokasi bersama melalui konfigurasi<br>- Pengambilan Sampel Data: Dapatkan hasil yang cepat berdasarkan pengambilan sampel data</td></tr>
<tr><td><strong>Peningkatan Arsitektur</strong></td><td>- Stream Node: Konsumsi data tambahan yang disederhanakan<br>- MixCoord: Arsitektur koordinator terpadu<br>- Kemandirian Logstore: Mengurangi ketergantungan eksternal seperti pulsar<br>- Deduplikasi PK: Deduplikasi kunci utama global</td></tr>
<tr><td><strong>Efisiensi Biaya &amp; Peningkatan Arsitektur</strong></td><td>- Penyimpanan Berjenjang: Pemisahan data panas/dingin untuk biaya penyimpanan yang lebih rendah<br>- Kebijakan Pengusiran Data: Pengguna dapat menentukan kebijakan penggusuran data mereka sendiri<br>- Pembaruan Massal: Mendukung modifikasi nilai spesifik bidang, ETL, dll.<br>- TopK Besar: Mengembalikan set data yang sangat besar<br>- VTS GA: Terhubung ke berbagai sumber data<br>- Kuantisasi Tingkat Lanjut: Mengoptimalkan konsumsi memori dan kinerja berdasarkan teknik kuantisasi<br>- Elastisitas Sumber Daya: Skala sumber daya secara dinamis untuk mengakomodasi berbagai beban tulis, beban baca, dan beban tugas latar belakang</td></tr>
</tbody>
</table>
<p>Saat kami mengimplementasikan peta jalan ini, kami sangat menghargai pendapat dan umpan balik Anda mengenai hal-hal berikut ini:</p>
<ol>
<li><p><strong>Prioritas fitur:</strong> Fitur mana dalam peta jalan kami yang paling berdampak pada pekerjaan Anda?</p></li>
<li><p><strong>Ide-ide implementasi:</strong> Adakah pendekatan spesifik yang menurut Anda akan bekerja dengan baik untuk fitur-fitur ini?</p></li>
<li><p><strong>Penyelarasan kasus penggunaan:</strong> Bagaimana fitur-fitur yang direncanakan ini selaras dengan kasus penggunaan Anda saat ini dan di masa depan?</p></li>
<li><p><strong>Pertimbangan kinerja:</strong> Adakah aspek kinerja yang harus kami fokuskan untuk kebutuhan spesifik Anda?</p></li>
</ol>
<p><strong>Wawasan Anda membantu kami membuat Milvus lebih baik untuk semua orang. Jangan ragu untuk membagikan pemikiran Anda di<a href="https://github.com/milvus-io/milvus/discussions/40263"> Forum Diskusi Milvus</a> atau <a href="https://discord.com/invite/8uyFbECzPX">Saluran Discord</a> kami.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Selamat Datang untuk Berkontribusi di Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagai proyek sumber terbuka, Milvus selalu menyambut baik kontribusi Anda:</p>
<ul>
<li><p><strong>Berbagi umpan balik:</strong> Melaporkan masalah atau menyarankan fitur melalui <a href="https://github.com/milvus-io/milvus/issues">halaman masalah GitHub</a> kami</p></li>
<li><p><strong>Kontribusi kode:</strong> Kirimkan permintaan penarikan (lihat <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">Panduan Kontributor</a> kami)</p></li>
<li><p><strong>Sebarkan berita:</strong> Bagikan pengalaman Milvus Anda dan beri <a href="https://github.com/milvus-io/milvus">bintang pada repositori GitHub kami</a></p></li>
</ul>
<p>Kami sangat bersemangat untuk membangun babak baru Milvus bersama Anda. Kode, ide, dan umpan balik Anda akan mendorong proyek ini ke depan!</p>
<p>- Tim Milvus</p>
