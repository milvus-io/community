---
id: attu-3-0-beta.md
title: >
  Attu 3.0 Beta: Pengelolaan Multi-Cluster, Agen AI, dan Konsol Milvus yang
  Telah Diperbarui
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/attu_3_0_beta_md_1_39fd0ca127.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  Attu 3.0 beta menghadirkan versi baru konsol manajemen Milvus yang dilengkapi
  dengan fitur manajemen multi-kluster, status persisten, agen AI bawaan,
  diagnostik tingkat lanjut, metrik real-time, debugging API, pencadangan dan
  pemulihan, serta alur kerja RBAC yang disederhanakan.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 Beta kini telah tersedia.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> adalah konsol manajemen sumber terbuka untuk <a href="https://milvus.io"><strong>Milvus</strong></a>. Jika Anda pernah menggunakan Milvus secara lokal atau dalam produksi, Anda mungkin pernah menggunakan Attu untuk memeriksa koleksi, menelusuri data, mengelola skema, atau memeriksa apa yang terjadi di dalam sebuah kluster.</p>
<p>Attu 2.x berfungsi dengan baik untuk manajemen klaster tunggal dasar. Namun, seiring dengan berkembangnya penerapan Milvus, keterbatasannya menjadi semakin terlihat. Attu hanya dapat terhubung ke satu instance Milvus dalam satu waktu. Status koneksi akan hilang setelah kontainer dimulai ulang. Penjelajahan data sebagian besar berpusat pada koleksi. Diagnostik, pemantauan, debugging API, pencadangan dan pemulihan, serta pengelolaan izin sering kali memerlukan alat terpisah atau langkah-langkah manual.</p>
<p><strong>Attu 3.0 Beta adalah pembaruan total dari pengalaman pengelolaan Milvus.</strong></p>
<p>Rilis ini menambahkan manajemen multi-kluster, status lokal yang persisten, Agen AI bawaan dengan lebih dari 50 alat Milvus, kemampuan diagnostik ahli, penjelajah data yang didesain ulang, metrik Prometheus bawaan, API Playground, pencadangan dan pemulihan berbasis GUI, serta alur kerja RBAC yang disederhanakan.</p>
<p>Singkatnya, Attu bukan lagi sekadar penampil ringan untuk satu instance Milvus. Attu kini menjadi konsol operasi praktis bagi pengembang dan tim yang mengelola Milvus di lingkungan lokal, staging, dan produksi.</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Apa yang Berubah di Attu 3.0 Beta<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>Berikut adalah perbandingan tingkat tinggi antara Attu 2.x dan Attu 3.0 Beta.</p>
<table>
<thead>
<tr><th>Fitur</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>Koneksi kluster</td><td>Hanya satu instance</td><td>Beberapa kluster dengan peralihan satu klik</td></tr>
<tr><td>Persistensi status</td><td>Tanpa status; hilang saat kontainer dimulai ulang</td><td>Database lokal; tetap ada setelah restart</td></tr>
<tr><td>Bantuan AI</td><td>Tidak ada</td><td>Agen bawaan dengan lebih dari 50 alat Milvus</td></tr>
<tr><td>Diagnostik</td><td>Pemeriksaan manual</td><td>4 keterampilan diagnostik tingkat ahli bawaan</td></tr>
<tr><td>Manajemen RBAC</td><td>Halaman terpisah, alur multi-langkah</td><td>Pembuatan pengguna dalam konteks, satu klik</td></tr>
<tr><td>Navigasi data</td><td>Daftar koleksi datar</td><td>Pohon hierarki: database → koleksi → partisi</td></tr>
<tr><td>Pemantauan</td><td>Grafana eksternal diperlukan</td><td>Dasbor metrik Prometheus bawaan</td></tr>
<tr><td>Debugging API</td><td>Alat eksternal seperti curl atau Postman</td><td>Ruang Uji Coba REST API bawaan</td></tr>
<tr><td>Cadangkan dan pulihkan</td><td>Hanya CLI</td><td>GUI dengan dukungan S3, MinIO, GCS, dan Azure</td></tr>
<tr><td>Integrasi LLM</td><td>Tidak ada</td><td>BYOL: OpenAI, Anthropic, DeepSeek, Gemini, dan lainnya</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">Kelola Beberapa Kluster Milvus dari Satu Sidebar<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Perubahan terbesar dalam penggunaan sehari-hari adalah pengelolaan multi-kluster.</strong> Attu 3.0 dapat terhubung ke setiap instance Milvus yang Anda jalankan dan menampilkannya dalam satu bilah samping.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Bilah samping Attu 3.0 yang menampilkan beberapa koneksi Milvus dengan indikator kesehatan</p>
<p>Di Attu 2.x, beralih dari satu klaster Milvus ke klaster lainnya berarti harus memutuskan koneksi, menghubungkan kembali, dan menunggu. Jika Anda memiliki klaster terpisah untuk pengembangan, staging, produksi, atau lini bisnis yang berbeda, Anda sering kali harus membuka satu tab browser untuk setiap klaster.</p>
<p>Attu 3.0 menggantikan alur tersebut dengan bilah samping kiri yang tetap. Setiap koneksi Milvus terdaftar di satu tempat, dengan indikator kesehatan langsung di sebelahnya. Titik hijau berarti kluster dapat dijangkau. Titik merah berarti kluster sedang down atau tidak tersedia.</p>
<p>Beralih antar kluster hanya membutuhkan satu klik. Attu menyimpan konteks untuk setiap koneksi, sehingga Anda tidak perlu terhubung ulang setiap kali berpindah antar lingkungan.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">Pengaturan Koneksi Lebih Tahan Gangguan</h3><p>Koneksi baru mendukung enkripsi TLS/SSL, otentikasi token, dan otentikasi nama pengguna/kata sandi. Anda dapat menguji koneksi sebelum menyimpannya, menyimpan detail koneksi secara lokal, dan menghapus koneksi yang tidak aktif secara massal saat lingkungan lama tidak lagi diperlukan.</p>
<p><strong>Setiap kluster memiliki ruang kerjanya sendiri.</strong> Ringkasan, penjelajah data, manajemen pengguna, metrik, dan operasi semuanya dibatasi pada kluster yang saat ini dipilih. Hal ini membuat lebih sulit untuk salah mengartikan lingkungan staging dan produksi atau menjalankan operasi di tempat yang salah.</p>
<p>Bagi siapa pun yang mengelola lebih dari satu instance Milvus, ini adalah salah satu perubahan terpenting dalam Attu 3.0. Kedengarannya sederhana, tetapi hal ini menghilangkan banyak peralihan tab dan hambatan koneksi ulang dari pekerjaan Milvus sehari-hari.</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">Status Lokal Kini Tetap Ada Setelah Restart<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x tidak memiliki status. Jika kontainer dimulai ulang, informasi koneksi yang Anda simpan akan hilang dan Anda harus membangun kembali ruang kerja Anda.</p>
<p><strong>Attu 3.0 menambahkan database lokal yang menyimpan konfigurasi cluster, riwayat percakapan agen, keterampilan khusus, konfigurasi LLM, dan preferensi pengguna.</strong></p>
<p>Saat menjalankan Attu dengan Docker, pasang volume untuk menyimpan status tersebut:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Dengan volume yang dipasang, me-restart kontainer tidak lagi berarti memulai dari nol.</p>
<p>Hal ini juga penting untuk Agen AI baru. Riwayat percakapan, keterampilan khusus, dan konfigurasi LLM dapat disimpan secara lokal, sehingga Attu menjadi konsol yang dapat terus Anda gunakan dari waktu ke waktu, bukan UI sementara yang disetel ulang setelah setiap restart.</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">Gunakan Agen AI Bawaan untuk Mengoperasikan Milvus dalam Bahasa Alami<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 menyertakan Agen AI bawaan untuk pengelolaan Milvus. Ini bukanlah chatbot dokumentasi. <strong>Agen ini terhubung ke lebih dari 50 alat Milvus, sehingga dapat memeriksa status klaster dan menjalankan operasi nyata melalui Attu.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Agen AI Attu 3.0 dapat memanggil alat Milvus dari permintaan bahasa alami</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">50+ Alat Bawaan di Seluruh Alur Kerja Milvus Umum</h3><p>Agen ini mencakup operasi sehari-hari, diagnostik, izin, dan pengelolaan kluster. Anda dapat mengajukan pertanyaan atau memberikan instruksi seperti:</p>
<table>
<thead>
<tr><th>Skenario</th><th>Contoh perintah</th></tr>
</thead>
<tbody>
<tr><td>Operasi sehari-hari</td><td>“Tampilkan semua koleksi saya.”<br>“Buat koleksi dengan bidang id, judul, dan embedding. Gunakan dimensi 768 untuk bidang embedding.”<br>“Masukkan beberapa data uji ke dalam my_collection.”<br>“Cari 10 catatan yang paling mirip dengan 'kecerdasan buatan' di my_collection.”</td></tr>
<tr><td>Operasi dan diagnostik</td><td>“Apakah kluster saya dalam kondisi baik?”<br>“Mengapa pencarian begitu lambat?”<br>“Koleksi mana yang menggunakan memori paling banyak?”<br>“Adakah kueri yang lambat belakangan ini?”</td></tr>
<tr><td>Izin</td><td>“Buat pengguna baca-saja bernama analyst.”<br>“Berikan semua hak akses kepada peran admin.”<br>“Periksa hak akses apa saja yang dimiliki pengguna zhangsan.”</td></tr>
<tr><td>Manajemen kluster</td><td>“Tampilkan versi dan konfigurasi Milvus saat ini.”<br>“Tampilkan penggunaan grup sumber daya.”<br>“Kompres my_collection untuk saya.”</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">Tindakan yang Merusak Memerlukan Persetujuan</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Operasi yang merusak atau sensitif menampilkan dialog konfirmasi sebelum dieksekusi</p>
<p><strong>Agen ini dirancang agar transparan dan dapat dikendalikan.</strong> Operasi non-destruktif, seperti menampilkan daftar koleksi atau membaca metrik, langsung menampilkan hasilnya.</p>
<p>Operasi yang merusak atau sensitif, seperti menghapus koleksi, membersihkan data, atau mengubah hak akses, memicu dialog konfirmasi. Dialog tersebut mencantumkan parameter yang tepat dan menunggu persetujuan sebelum operasi dijalankan.</p>
<p>Anda juga dapat melihat alat apa saja yang dipanggil agen, berapa banyak token yang digunakan, dan apakah ada panggilan alat yang gagal. Hal ini penting bagi agen manajemen basis data. Pengguna harus dapat memahami apa yang dilakukan agen, bukan hanya melihat jawaban akhirnya.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">Jalankan Keterampilan Diagnostik Ahli dari Konsol<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>AI Agent dilengkapi dengan empat keterampilan diagnostik bawaan.</strong> Ini adalah alur kerja terpandu untuk skenario pemecahan masalah Milvus yang umum, bukan petunjuk umum.</p>
<table>
<thead>
<tr><th>Keterampilan diagnostik</th><th>Apa yang diperiksa</th></tr>
</thead>
<tbody>
<tr><td>Diagnosis kesehatan kluster</td><td>Versi, status node, kesehatan per komponen, dan metrik utama.</td></tr>
<tr><td>Diagnosis kinerja pencarian</td><td>Keselamatan indeks, fragmentasi segmen, keseimbangan replika, dan sinyal kinerja pencarian terkait.</td></tr>
<tr><td>Diagnosis penulisan data</td><td>Penyisipan yang lambat, pemeriksaan data yang hilang, anomali pembersihan, dan gejala jalur penulisan.</td></tr>
<tr><td>Audit konfigurasi</td><td>Pengaturan berisiko atau salah yang dapat memengaruhi stabilitas, kinerja, atau perilaku yang diharapkan.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Attu 3.0 menyertakan keterampilan diagnostik bawaan dan mendukung keterampilan khusus</p>
<p>Anda juga dapat membuat keterampilan khusus dalam bahasa alami. Sebuah keterampilan dapat mengkodekan daftar periksa pra-peluncuran, pemeriksaan kualitas data untuk koleksi tertentu, atau alur diagnostik yang dijalankan tim Anda untuk beban kerja yang diketahui.</p>
<p>Keterampilan khusus pada dasarnya adalah pengetahuan domain ditambah prosedur. Setelah disimpan, agen dapat menggunakannya kembali alih-alih mengandalkan prompt satu kali setiap saat.</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">Gunakan Penyedia LLM Anda Sendiri<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu tidak menggabungkan atau menjadi perantara layanan LLM.</strong> Anda mengonfigurasi penyedia Anda sendiri dan tetap mengontrol jalur model.</p>
<p>Opsi penyedia yang didukung meliputi OpenAI, Anthropic, DeepSeek, Google Gemini, OpenRouter, dan titik akhir khusus yang kompatibel dengan OpenAI.</p>
<table>
<thead>
<tr><th>Penyedia</th><th>Contoh model</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>DeepSeek</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>Model yang di-routing apa pun</td></tr>
<tr><td>Titik akhir kustom</td><td>API apa pun yang kompatibel dengan OpenAI</td></tr>
</tbody>
</table>
<p>Kunci API Anda dienkripsi secara lokal dan tidak diunggah ke layanan yang dikelola Attu. Desain tersebut penting bagi tim yang menginginkan bantuan AI namun tetap perlu mengontrol kredensial, aliran data, dan pilihan penyedia.</p>
<p>Dalam praktiknya, BYOL membuat agen dapat digunakan di berbagai lingkungan. Satu tim mungkin menggunakan OpenAI. Tim lain mungkin menggunakan model Anthropic. Tim ketiga mungkin merutekan melalui titik akhir yang kompatibel dengan OpenAI. Attu tidak memaksakan penyedia model tunggal.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">Jelajahi Data Milvus Dengan Pohon Database → Koleksi → Partisi<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 juga mendesain ulang penjelajah data. Attu 2.x terutama menampilkan daftar koleksi datar. Hal itu menjadi sulit digunakan begitu sebuah klaster memiliki beberapa basis data, puluhan koleksi, dan data yang dipartisi.</p>
<p><strong>Penjelajah baru ini menggunakan hierarki yang sesuai dengan cara Milvus mengatur data: database → koleksi → partisi.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Penjelajah data yang didesain ulang menggunakan navigasi hierarkis untuk database, koleksi, dan partisi</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">Operasi Data Lebih Dekat dengan Tempat Anda Menjelajah</h3><p>Penjelajah data mempertahankan operasi yang sudah diharapkan pengguna dan menambahkan lebih banyak tindakan langsung di antarmuka pengguna:</p>
<ul>
<li>Seret dan lepas koleksi ke database lain.</li>
<li>Jalankan pencarian vektor dengan mengetik teks secara langsung, saat model embedding telah dikonfigurasi.</li>
<li>Periksa skor kesamaan dan persempit hasil dengan facet.</li>
<li>Impor dan ekspor data dalam format CSV, JSON, dan Parquet.</li>
<li>Lihat dan edit skema koleksi secara visual, termasuk dukungan bidang dinamis.</li>
<li>Buat, hapus, dan periksa partisi serta statistik partisi.</li>
<li>Kelola siklus hidup koleksi secara penuh: buat, muat, lepaskan, salin, ganti nama, pindahkan antar basis data, dan hapus.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Penjelajah data Attu 3.0 dengan pencarian vektor dan pemeriksaan hasil</p>
<p>Sebagian besar tindakan ini tersedia melalui menu klik kanan atau panel operasi. Untuk pekerjaan koleksi umum, Anda tidak perlu lagi berpindah-pindah antara penjelajahan UI dan operasi baris perintah.</p>
<p>Attu 3.0 juga merupakan lini produk tempat dukungan UI untuk kemampuan <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0</a> yang baru, seperti snapshot dan vektor yang dapat dinonaktifkan, akan terus muncul seiring dengan semakin matangnya fitur-fitur tersebut.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">Periksa Operasi, Metrik, Kueri Lambat, Topologi, dan Pencadangan di Satu Tempat<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 menampilkan lebih banyak informasi operasional di konsol.</strong> Area Ops dan Pemantauan mencakup ikhtisar klaster, metrik langsung, analisis kueri lambat, topologi, serta pencadangan dan pemulihan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Halaman Ops dan Pemantauan Attu 3.0</p>
<p>Tujuannya bukan untuk menggantikan setiap sistem observabilitas yang sudah digunakan oleh tim produksi. Tim masih dapat menggunakan Prometheus, Grafana, log, peringatan, dan tumpukan pemantauan yang sudah ada. Tujuannya adalah agar pertanyaan umum tentang Milvus dapat dijawab dari dalam Attu.</p>
<table>
<thead>
<tr><th>Area</th><th>Apa yang dapat Anda lakukan</th></tr>
</thead>
<tbody>
<tr><td>Ikhtisar klaster visual</td><td>Lihat versi Milvus, mode penyebaran, jumlah node, jumlah database, jumlah koleksi, status beban, dan entitas kuota secara sekilas.</td></tr>
<tr><td>Metrik waktu nyata</td><td>Periksa QPS, tingkat penyisipan/penghapusan, latensi kueri, tingkat hit cache, dan metrik terkait yang didukung oleh Prometheus.</td></tr>
<tr><td>Analisis kueri lambat</td><td>Periksa kueri lambat berdasarkan jenis, durasi, koleksi, cap waktu, sumber, dan konteks pemecahan masalah terkait.</td></tr>
<tr><td>Tampilan topologi</td><td>Pahami topologi node dan koneksi antar komponen seperti RootCoord, DataCoord, IndexCoord, QueryCoord, dan Proxy.</td></tr>
<tr><td>Cadangkan dan pulihkan</td><td>Buat cadangan penuh atau tambahan ke S3, MinIO, GCS, atau Azure, dan unduh metadata cadangan sebagai ZIP atau unggah satu untuk memulihkan.</td></tr>
</tbody>
</table>
<p>Pencadangan dan pemulihan sangat penting karena memindahkan alur kerja yang sebelumnya bergantung pada penggunaan CLI ke dalam GUI. Hal ini berguna untuk pengujian lokal, validasi staging, dan tim yang menginginkan jalur pemulihan yang lebih terlihat.</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">Debug API REST Milvus dengan API Playground Bawaan<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 menambahkan API Playground REST untuk pengembangan dan debugging API Milvus.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: API Playground Attu 3.0</p>
<p>Playground ini mengkategorikan titik akhir REST Milvus berdasarkan kategori. Pilih database dan koleksi, dan Attu akan mengisi konteks eksekusi secara otomatis. Dari sana, Anda dapat mengirim permintaan dengan satu klik dan memeriksa respons secara real-time.</p>
<p>Ini berguna saat Anda ingin menguji panggilan API tanpa perlu menyiapkan perintah curl atau koleksi Postman. Fitur ini juga berguna untuk memahami bagaimana fitur Milvus dipetakan ke API REST, karena Anda dapat berpindah langsung antara konteks antarmuka pengguna dan badan permintaan.</p>
<p>Bagi pengembang aplikasi, API Playground adalah antarmuka debugging. Bagi pengguna Milvus baru, ini adalah antarmuka pembelajaran. Bagi tim platform, ini adalah cara cepat untuk memvalidasi operasi sebelum mengubahnya menjadi skrip atau kode aplikasi.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">Kelola RBAC di Samping Database atau Koleksi<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 mengubah cara kerja alur izin di antarmuka pengguna.</strong> Alih-alih memperlakukan <a href="https://milvus.io/docs/rbac.md">RBAC</a> sebagai tugas admin terpisah, fitur ini mendekatkan kontrol akses ke tab database dan koleksi tempat pengguna sudah bekerja.</p>
<p>Model dasarnya masih Milvus RBAC: pengguna, peran, <a href="https://milvus.io/docs/grant_privileges.md">hak istimewa</a>, pemberian, dan pencabutan. Attu 3.0 menyederhanakan jalur operasi seputar model tersebut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Manajemen pengguna dan izin dalam konteks di Attu 3.0</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">Pembuatan Pengguna Sekali Klik untuk Cakupan Umum</h3><p>Di Attu 2.x, membuka akses baca-saja ke sebuah koleksi biasanya melibatkan beberapa langkah: membuat pengguna, membuat peran, mengonfigurasi hak akses, menugaskan peran ke pengguna, dan memastikan lingkupnya benar.</p>
<p><strong>Di Attu 3.0, Anda dapat membuka koleksi, membuka tab Pengguna, mengklik Buat Pengguna, memilih ReadOnly atau ReadWrite, dan membiarkan Attu menyelesaikan alur kerjanya.</strong> Attu akan membuat pengguna, menghasilkan kata sandi yang aman, membuat peran dengan cakupan yang sesuai, dan menerapkan pemberian izin.</p>
<p>Pola yang sama berlaku di tingkat basis data. Anda juga dapat memberikan otorisasi kepada pengguna yang sudah ada ke koleksi saat ini atau mencabut akses dengan satu klik.</p>
<p>Hal ini membuat pengelolaan izin tetap dekat dengan sumber daya yang dilindungi. Anda tidak perlu berpindah-pindah ke beberapa halaman admin atau mengingat konvensi penamaan peran hanya untuk memberikan akses terbatas kepada rekan tim.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">Apa Arti Beta Ini bagi Pengguna Attu<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Beta adalah pembaruan terbesar pada konsol manajemen Milvus sejak Attu pertama kali diluncurkan.</strong> Ini bukan sekadar penyegaran visual. Pembaruan ini mengubah cakupan hal-hal yang dapat ditangani Attu.</p>
<p>Peningkatan utamanya adalah Attu kini sesuai dengan cara kerja banyak pengguna Milvus: beberapa klaster, pengaturan lokal yang tetap, lebih banyak perpindahan data, lebih banyak kontrol akses, lebih banyak pemecahan masalah, dan lebih banyak kebutuhan untuk memahami perilaku klaster tanpa perlu berpindah antar alat.</p>
<p>Fitur utamanya adalah:</p>
<ul>
<li>Manajemen multi-kluster dengan indikator kesehatan dan peralihan satu klik.</li>
<li>Status lokal yang tetap untuk konfigurasi kluster, preferensi, konfigurasi LLM, riwayat agen, dan keterampilan khusus.</li>
<li>Agen AI bawaan dengan 50+ alat Milvus dan gerbang konfirmasi untuk tindakan yang merusak.</li>
<li>Empat keterampilan diagnostik ahli bawaan untuk kesehatan kluster, kinerja pencarian, penulisan data, dan tinjauan konfigurasi.</li>
<li>Penjelajah data yang didesain ulang dengan navigasi database → koleksi → partisi serta operasi koleksi yang lebih kaya.</li>
<li>Metrik Prometheus bawaan, analisis kueri lambat, topologi, serta pencadangan dan pemulihan.</li>
<li>Ruang uji coba REST API untuk debugging dan mempelajari API Milvus.</li>
<li>Alur kerja RBAC yang terjadi di samping database atau koleksi, bukan hanya dalam alur admin terpisah.</li>
</ul>
<p>Jika Anda menggunakan Attu hanya untuk pengembangan Milvus lokal, versi 3.0 memberikan konsol yang lebih canggih. Jika Anda mengelola beberapa lingkungan Milvus, perubahan multi-kluster dan status persisten saja sudah layak dicoba. Jika Anda sering men-debug masalah kinerja atau izin, Agent, diagnostik, metrik, dan alur kerja RBAC dalam konteks seharusnya langsung menghemat waktu.</p>
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
    </button></h2><p>Coba Attu 3.0 Beta dengan Docker:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian buka:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>Tambahkan koneksi Milvus Anda dari bilah samping dan mulailah menjelajahi konsol baru.</p>
<p>Lebih suka aplikasi desktop? Unduh build untuk platform Anda dari <a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a>. Attu 3.0 Beta menyediakan paket desktop untuk macOS, Linux, dan Windows. Rilis terbaru juga mencakup paket server Linux mandiri untuk menjalankan Attu tanpa Docker atau Electron.</p>
<p><strong>Ada pertanyaan?</strong> Bawa pengaturan multi-cluster, keterampilan agen khusus, atau skenario diagnostik Anda ke <a href="https://discord.gg/milvus"><strong>Milvus Discord</strong></a>, atau pesan <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>Milvus Office Hours</strong></a> untuk membahasnya bersama komunitas.</p>
<p><strong>Tidak ingin mengoperasikan infrastruktur Milvus sendiri?</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> adalah platform yang dikelola sepenuhnya dari pencipta Milvus. Platform ini mempertahankan API Milvus dan menambahkan infrastruktur terkelola untuk pencarian vektor real-time, penemuan skala besar, dan operasi data AI. Bagi tim dengan persyaratan kedaulatan data, Zilliz Cloud <strong>BYOC</strong> berjalan di dalam akun cloud Anda sendiri sehingga data tetap berada di VPC Anda sementara Zilliz menangani operasinya.</p>
