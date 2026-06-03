---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: Cara Menjalankan 25 Juta Vektor Gambar dengan Memori Kurang dari 1GB di Milvus
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  Bagaimana seorang pengguna komunitas menjalankan pencarian gambar vektor 25
  juta dengan memori &lt;1GB di Milvus menggunakan FLAT, FP16, dan mmap -
  alih-alih estimasi 139GB dari Sizing Tool.
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>Seorang pengguna Milvus baru-baru ini datang kepada kami dengan masalah pencarian gambar yang sangat praktis.</p>
<p>"Kami perlu melakukan pencarian gambar-ke-gambar pada 25 juta gambar, yang dikodekan sebagai vektor 1280 dimensi. Satu mesin akan melayani beban kerja tersebut. Mesin ini memiliki 64GB RAM, dan paling banyak 32GB yang bisa masuk ke database vektor. Namun <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> mengatakan bahwa kami membutuhkan 139GB. Apakah kita sudah siap?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hasil estimasi Sizing Tool: vektor 25M × 1280 dimensi, Ukuran Data Mentah 119,2 GB, Memori Pemuatan 139,4 GB</p>
<p>Tidak juga.</p>
<p>Pada awalnya, jawaban yang jelas tampaknya adalah indeks yang lebih canggih. Jika datasetnya besar dan memorinya terbatas, tentu saja indeks ANN yang lebih cerdas akan membantu. Dalam kasus ini, ternyata tidak. Indeks yang akhirnya berhasil adalah opsi paling sederhana dari Milvus: <a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>.</p>
<p>Hasilnya lebih baik dari yang diharapkan: memori steady-state tetap di bawah 1GB, memori residen kontainer sekitar 600MB, dan latensi warm-query tetap di bawah 100ms. Startup sempat mencapai puncaknya sekitar 12,5GB, dan kueri pertama membutuhkan waktu sekitar 30 detik saat sistem melakukan pemanasan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bagian yang penting bukanlah bahwa FLAT secara ajaib membuat 25 juta perbandingan brute-force menjadi murah. Ternyata tidak. Bagian yang penting adalah bahwa beban kerja ini hampir tidak pernah mencari semua 25 juta vektor. Filter skalar mempersempit setiap kueri terlebih dahulu, dan FLAT hanya membandingkan vektor di dalam kumpulan kandidat yang jauh lebih kecil.</p>
<p>Artikel ini akan membahas apa yang gagal, mengapa FLAT berhasil, dan kapan pola yang sama layak untuk dicoba pada beban kerja Anda.</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">Mengapa AISAQ dan IVF_FLAT Tidak Berhasil di Sini<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum FLAT, pengguna mencoba dua indeks yang terlihat lebih alami untuk mesin yang dibatasi.</p>
<p><strong>Percobaan pertama:</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>.</strong> AISAQ adalah indeks berorientasi disk yang dirancang untuk menjaga penggunaan memori tetap rendah. Kendala dalam beban kerja ini adalah jalur pembuatan dan pemuatan. Pada pengujian sebelumnya dengan 55 juta vektor, satu kali beban koleksi menulis 249GB data sementara ke disk dan membutuhkan waktu yang terlalu lama untuk menjadi praktis.</p>
<p><strong>Percobaan kedua: IVF_FLAT.</strong> IVF_FLAT juga terlihat masuk akal karena merupakan indeks ANN standar. Indeks berhasil dibangun, tetapi beban pengumpulan terhenti pada 14% dan tidak pernah pulih.</p>
<p>Setelah dua jalan buntu itu, pengguna mencoba opsi yang membosankan: FLAT. Opsi ini dimuat dengan bersih. Opsi ini juga memberikan perilaku runtime terbaik untuk pola kueri spesifik ini.</p>
<table>
<thead>
<tr><th><strong>Indeks</strong></th><th><strong>Mengapa terlihat menjanjikan</strong></th><th><strong>Apa yang terjadi dalam beban kerja ini</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>Indeks berorientasi disk dengan penggunaan memori yang rendah secara teori</td><td>Jalur build/load menghasilkan file sementara yang besar. Dalam pengujian vektor 55M, satu beban koleksi menulis data sementara sebesar 249GB dan lambat.</td></tr>
<tr><td>IVF_FLAT</td><td>Indeks ANN standar dengan biaya pencarian yang lebih rendah daripada pemindaian penuh</td><td>Indeks dibangun, tetapi beban koleksi terhenti pada 14% dan tidak pulih.</td></tr>
<tr><td>FLAT</td><td>Tidak ada struktur ANN tambahan dan tidak ada kompleksitas pembuatan indeks</td><td>Memori kondisi tunak tetap di bawah 1GB. Memori penghuni kontainer sekitar 600MB. Startup mencapai puncaknya di dekat 12,5GB. Kueri pertama membutuhkan waktu sekitar 30-an, kemudian kueri hangat tetap di bawah 100ms.</td></tr>
</tbody>
</table>
<p>Pelajarannya sederhana: indeks yang efisien secara teori mungkin saja tidak cocok untuk mesin, bentuk data, dan pola kueri tertentu.</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">Mengapa FLAT Berhasil<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT adalah indeks paling sederhana yang didukung Milvus. Tidak ada grafik. Tidak ada pohon. Tidak ada pengelompokan. FLAT membandingkan vektor kueri secara langsung dengan vektor kandidat.</p>
<p>Kedengarannya seperti alat yang salah untuk 25 juta vektor. Akan menjadi alat yang salah jika setiap kueri mencari seluruh koleksi.</p>
<p>Tetapi beban kerja ini memiliki filter yang kuat di depan pencarian vektor. Setiap kueri pertama-tama mempersempit ruang pencarian dengan bidang skalar seperti <code translate="no">dataid</code> dan <code translate="no">classid</code>. Baru setelah itu Milvus menjalankan pencarian kemiripan vektor. Hal ini mengubah masalah dari "mencari 25 juta vektor" menjadi "mencari beberapa ratus hingga puluhan ribu vektor setelah penyaringan."</p>
<p>Tiga bagian yang membuat penyiapannya berhasil: Penyimpanan vektor FP16, mmap untuk data vektor mentah, dan pemfilteran skalar sebelum FLAT pass.</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">Optimalisasi 1: FP16 Memotong Data Vektor Menjadi Dua<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektor memiliki 1280 dimensi. Disimpan sebagai FP32, setiap vektor membutuhkan 5120 byte:</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>Untuk 25 juta vektor, itu berarti sekitar 119,2GB data vektor mentah. FP16 memotong setiap dimensi dari 4 byte menjadi 2 byte:</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>Jadi, data vektor mentah turun menjadi sekitar 59,6GB.</p>
<p>Hal ini masih belum sesuai dengan RAM yang tersedia, tetapi mengurangi separuh jumlah data vektor yang harus ditangani oleh Milvus dan sistem operasi. Dalam banyak beban kerja pengambilan gambar, FP16 memiliki dampak recall yang kecil, tetapi ini bukan aturan yang bebas. Uji recall dengan embedding, metrik, dan bilah kualitas Anda sendiri sebelum menjadikannya sebagai default.</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">Pengoptimalan 2: mmap Menjaga Vektor Mentah dari Tumpukan Proses<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>Bahkan setelah FP16, sekitar 60GB vektor masih terlalu banyak untuk anggaran memori. Di sinilah <a href="https://milvus.io/docs/mmap.md"><strong>mmap</strong></a> menjadi berguna.</p>
<p>Dengan mmap, Milvus dapat mengakses data vektor melalui file yang dipetakan ke dalam memori alih-alih memuat seluruh bidang vektor mentah ke dalam memori proses. Sistem operasi akan mem-page data saat query menyentuhnya dan dapat menyimpan halaman yang sedang aktif dalam cache halamannya.</p>
<p>Dalam lingkungan Milvus 2.6.14 pengguna ini, konfigurasi mmap tingkat kluster sudah mencakup data vektor mentah, sehingga pengguna tidak perlu mengatur mmap secara manual.</p>
<p>Satu detail menyebabkan kebingungan selama debugging: Attu menampilkan pengaturan mmap tingkat skema, bukan pengaturan default tingkat cluster. Jadi, <a href="https://zilliz.com/attu"><strong>Attu</strong></a> dapat menampilkan mmap sebagai dinonaktifkan bahkan ketika konfigurasi tingkat kluster secara efektif mengaktifkan mmap untuk jalur data.</p>
<p>Pengorbanannya sangat mudah. mmap menghemat RAM, tetapi menggunakan disk dan cache halaman OS lebih banyak. Anda masih membutuhkan kapasitas SSD untuk file vektor, dan kueri pertama dapat menjadi lebih lambat saat halaman yang relevan dibaca dari disk.</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">Pengoptimalan 3: Pemfilteran Skalar Adalah Pengganda Performa yang Sesungguhnya<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 dan mmap menjelaskan nomor memori. Pemfilteran skalar menjelaskan angka latensi.</p>
<p>Setiap kueri dalam beban kerja ini menyertakan ekspresi filter seperti ini:</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>Filter tersebut dijalankan sebelum langkah perbandingan vektor. Alih-alih membandingkan terhadap 25 juta vektor, FLAT membandingkan terhadap kumpulan kandidat yang difilter, yang berkisar dari beberapa ratus hingga puluhan ribu vektor.</p>
<p>Itulah sebabnya mengapa kueri hangat tetap berada di bawah 100ms. Puluhan ribu perbandingan vektor praktis dilakukan pada CPU modern. Dua puluh lima juta perbandingan per kueri akan menjadi cerita yang sangat berbeda.</p>
<p>Hal ini juga menjelaskan mengapa IVF_FLAT dan HNSW tidak berguna di sini. Setelah pemfilteran skalar telah cukup mengurangi kumpulan kandidat, struktur ANN tambahan dapat menjadi beban mati. Ini menambah memori, waktu pembuatan, dan kompleksitas beban, tetapi mungkin tidak banyak meningkatkan latensi.</p>
<p>Ada satu peringatan. Filter dalam beban kerja ini sederhana. Jika filter Anda menggunakan daftar <code translate="no">IN</code> yang besar, pola <code translate="no">LIKE</code>, predikat rentang, atau kondisi JSON bersarang, tambahkan indeks skalar pada bidang yang relevan dan ukur tahap filter secara langsung.</p>
<table>
<thead>
<tr><th>Pengoptimalan</th><th>Apa yang dilakukannya</th><th>Mengapa penting di sini</th><th>Pertukaran</th></tr>
</thead>
<tbody>
<tr><td>Penyimpanan vektor FP16</td><td>Menyimpan setiap dimensi vektor dengan 2 byte, bukan 4 byte</td><td>Mengurangi data vektor mentah dari sekitar 119,2GB menjadi sekitar 59,6GB</td><td>Dampak penarikan kembali tergantung pada penyematan dan metrik Anda. Mengujinya.</td></tr>
<tr><td>mmap pada vektor mentah</td><td>Memetakan file vektor dari disk alih-alih memuat bidang vektor mentah secara penuh ke dalam memori proses</td><td>Menjaga memori proses tetap rendah sambil membiarkan OS memasukkan data sesuai kebutuhan</td><td>Memerlukan kapasitas SSD dan dapat membuat kueri dingin menjadi lebih lambat.</td></tr>
<tr><td>Pemfilteran skalar terlebih dahulu</td><td>Memfilter berdasarkan bidang skalar sebelum perbandingan vektor</td><td>Mengurangi setiap kueri dari 25 juta kandidat menjadi ratusan atau puluhan ribu</td><td>Filter yang kompleks mungkin memerlukan indeks skalar.</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">Di mana Pola Ini Berlaku<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>Kasus pencarian gambar berhasil karena ruang pencarian yang sebenarnya jauh lebih kecil daripada total koleksi. Bentuk yang sama muncul di banyak beban kerja produksi.</p>
<ol>
<li><strong>RAG multi-penyewa:</strong> Saring berdasarkan <code translate="no">tenant_id</code>, <code translate="no">workspace_id</code>, atau <code translate="no">project_id</code> terlebih dahulu. Setiap penyewa mungkin hanya memiliki ribuan atau puluhan ribu potongan.</li>
<li><strong>Pencarian produk e-commerce:</strong> Saring berdasarkan kategori, merek, penjual, wilayah, atau ketersediaan sebelum pencarian vektor.</li>
<li><strong>Pengambilan log dan dokumen:</strong> Saring berdasarkan rentang waktu, sumber, layanan, atau jenis dokumen sebelum pencarian semantik.</li>
<li><strong>Pencarian gambar atau media dengan label:</strong> Saring berdasarkan kumpulan data, kelas, pelanggan, atau kelompok aset sebelum membandingkan penyematan.</li>
</ol>
<p>Ini adalah kandidat yang baik untuk FLAT + FP16 + mmap karena koleksi lengkapnya bisa jadi besar sementara setiap kueri masih menyentuh sebagian kecil.</p>
<p>Pola ini tidak berlaku jika setiap kueri mencari seluruh koleksi. Jika setiap kueri benar-benar perlu memindai semua 25 juta vektor, FLAT tidak akan memberikan latensi yang sama. Dalam hal ini, gunakan indeks ANN seperti HNSW, IVF, atau indeks berorientasi disk, dan rencanakan pertukaran memori, disk, dan waktu pembuatan.</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">Cara Membaca Perkiraan Alat Bantu Ukuran<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Sizing Tool adalah titik awal, bukan keputusan akhir pada perangkat keras Anda.</p>
<p>Dalam kasus ini, estimasi memori pemuatan 139,4GB berfungsi sebagai garis dasar konservatif untuk 25 juta vektor FP32 1280 dimensi. Beban kerja yang sebenarnya mengubah beberapa asumsi:</p>
<ol>
<li>FP16 memotong ukuran vektor mentah kira-kira menjadi setengahnya.</li>
<li>mmap menghindari pemuatan bidang vektor mentah secara penuh ke dalam memori proses.</li>
<li>FLAT menghindari struktur indeks ANN tambahan.</li>
<li>Filter skalar membuat setiap kueri mencari kumpulan kandidat yang jauh lebih kecil.</li>
</ol>
<p>Itulah mengapa pengujian beban kerja yang sebenarnya penting. Sebelum menolak pengaturan perangkat keras hanya berdasarkan perkiraan ukuran, uji dengan ketepatan vektor aktual, jenis indeks, konfigurasi mmap, filter skalar, perilaku kueri dingin, dan perilaku kueri hangat.</p>
<h2 id="Get-Started" class="common-anchor-header">Memulai<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda ingin mencoba resep yang sama, mulailah dengan pola kueri, bukan nama indeks.</p>
<ol>
<li>Periksa apakah setiap kueri memiliki filter skalar selektif.</li>
<li>Perkirakan berapa banyak vektor yang tersisa setelah penyaringan.</li>
<li>Simpan vektor sebagai FP16 jika pengujian pemanggilan terlihat baik.</li>
<li>Gunakan FLAT ketika kumpulan kandidat yang difilter cukup kecil untuk perbandingan secara brute force.</li>
<li>Verifikasi perilaku mmap untuk data vektor mentah. Periksa pengaturan tingkat skema dan konfigurasi tingkat cluster.</li>
<li>Ukur memori startup, latensi kueri pertama, latensi kueri hangat, dan I / O disk.</li>
<li>Tambahkan indeks skalar jika evaluasi filter menjadi hambatan.</li>
</ol>
<p>Untuk pengujian lokal, mulailah dengan <a href="https://milvus.io/docs/quickstart.md"><strong>quickstart Milvus</strong></a> atau repositori Milvus <a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a>. Gunakan Attu untuk memeriksa koleksi, tetapi ingat bahwa Attu mungkin tidak menampilkan default mmap tingkat cluster.</p>
<p>Jika Anda tidak ingin menjalankan infrastruktur sendiri, <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> adalah layanan Milvus terkelola. Anda mendapatkan inti Milvus yang sama dengan operasi terkelola, penskalaan, dan tingkat gratis untuk pengujian. <a href="https://cloud.zilliz.com/signup"><strong>Daftar</strong></a> untuk mendapatkan kredit gratis $100 dengan email kantor, atau <a href="https://cloud.zilliz.com/login"><strong>masuk</strong></a> jika Anda sudah memiliki akun.</p>
