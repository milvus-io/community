---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: Bagaimana RoboBrain Membangun Memori Robot Jangka Panjang dengan Milvus
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: >-
  Modul robot dapat bekerja sendiri tetapi gagal ketika dirantai. CEO Senqi AI
  menjelaskan bagaimana RoboBrain menggunakan status tugas, umpan balik, dan
  memori Milvus.
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>Artikel ini dikontribusikan oleh Song Zhi, CEO Senqi AI, sebuah perusahaan AI yang membangun infrastruktur eksekusi tugas untuk robot. RoboBrain adalah salah satu produk inti Senqi AI.</em></p>
<p>Sebagian besar kemampuan robot dapat bekerja dengan sendirinya. Model navigasi dapat merencanakan rute. Model persepsi dapat mengidentifikasi objek. Sebuah modul bicara dapat menerima instruksi. Kegagalan produksi muncul ketika kemampuan-kemampuan tersebut harus berjalan sebagai satu tugas yang berkelanjutan.</p>
<p>Untuk robot, instruksi sederhana seperti "periksa area itu, foto apa pun yang tidak biasa, dan beri tahu saya" membutuhkan perencanaan sebelum tugas dimulai, beradaptasi saat berjalan, dan menghasilkan hasil yang berguna saat selesai. Setiap handoff bisa gagal: navigasi terhenti di belakang rintangan, foto yang buram diterima sebagai hasil akhir, atau sistem melupakan pengecualian yang ditangani lima menit yang lalu.</p>
<p>Itulah tantangan utama bagi <a href="https://zilliz.com/glossary/ai-agents">agen AI</a> yang beroperasi di dunia fisik. Tidak seperti agen digital, robot bekerja dengan <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data yang tidak terstruktur</a> secara terus menerus: jalur yang terhalang, cahaya yang berubah, batas baterai, kebisingan sensor, dan aturan operator.</p>
<p>RoboBrain adalah sistem operasi kecerdasan buatan Senqi AI untuk eksekusi tugas robot. Sistem ini berada di lapisan tugas, menghubungkan persepsi, perencanaan, kontrol eksekusi, dan umpan balik data sehingga instruksi bahasa alami dapat menjadi alur kerja robot yang terstruktur dan dapat dipulihkan.</p>
<table>
<thead>
<tr><th>Breakpoint</th><th>Apa yang Gagal dalam Produksi</th><th>Bagaimana RoboBrain Mengatasinya</th></tr>
</thead>
<tbody>
<tr><td>Perencanaan tugas</td><td>Instruksi yang tidak jelas membuat modul hilir tidak memiliki bidang eksekusi yang konkret.</td><td>Objektifikasi tugas mengubah maksud menjadi status bersama.</td></tr>
<tr><td>Perutean konteks</td><td>Informasi yang tepat ada, tetapi mencapai tahap keputusan yang salah.</td><td>Memori berjenjang merutekan konteks waktu nyata, jangka pendek, dan jangka panjang secara terpisah.</td></tr>
<tr><td>Umpan balik data</td><td>Satu lintasan selesai atau gagal tanpa memperbaiki lintasan berikutnya.</td><td>Umpan balik menulis ulang status tugas dan memori jangka panjang.</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">Tiga Titik Henti dalam Eksekusi Tugas Robot<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Tugas perangkat lunak sering kali dapat dibatasi sebagai masukan, proses, dan hasil. Tugas robot berjalan melawan keadaan fisik yang bergerak: jalur yang terhalang, cahaya yang berubah, batas baterai, kebisingan sensor, dan aturan operator.</p>
<p>Itulah sebabnya mengapa loop tugas membutuhkan lebih dari sekadar model yang terisolasi. Dibutuhkan cara untuk mempertahankan konteks di seluruh perencanaan, eksekusi, dan umpan balik.</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1. Perencanaan Tugas: Instruksi yang Tidak Jelas Menghasilkan Eksekusi yang Tidak Jelas</h3><p>Frasa seperti "coba lihat" menyembunyikan banyak keputusan. Area yang mana? Apa yang harus dipotret oleh robot? Apa yang dianggap tidak biasa? Apa yang harus dilakukan jika pemotretan gagal? Hasil apa yang harus dikembalikan ke operator?</p>
<p>Jika lapisan tugas tidak dapat menyelesaikan rincian tersebut ke dalam bidang konkret - area target, objek inspeksi, kondisi penyelesaian, kebijakan kegagalan, dan format pengembalian - tugas tersebut berjalan tanpa arah dari awal dan tidak pernah memulihkan konteks di bagian hilir.</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2. Perutean Konteks: Data yang Tepat Mencapai Tahap yang Salah</h3><p>Tumpukan robot mungkin sudah berisi informasi yang tepat, tetapi eksekusi tugas bergantung pada pengambilannya pada tahap yang tepat.</p>
<p>Tahap permulaan membutuhkan peta, definisi area, dan aturan operasi. Pertengahan eksekusi membutuhkan status sensor langsung. Penanganan pengecualian membutuhkan kasus serupa dari penerapan sebelumnya. Ketika sumber-sumber tersebut tercampur, sistem akan membuat keputusan yang tepat dengan konteks yang salah.</p>
<p>Ketika perutean gagal, startup menarik pengalaman yang sudah basi alih-alih aturan area, penanganan pengecualian tidak dapat menjangkau kasus yang dibutuhkannya, dan eksekusi pertengahan mendapatkan peta kemarin alih-alih pembacaan langsung. Memberi seseorang kamus tidak akan membantu mereka menulis esai. Data harus mencapai titik keputusan yang tepat, pada tahap yang tepat, dalam bentuk yang tepat.</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3. Umpan Balik Data: Eksekusi Sekali Jalan Tidak Membaik</h3><p>Tanpa umpan balik, robot dapat menyelesaikan satu lintasan tanpa memperbaiki lintasan berikutnya. Tindakan yang telah selesai masih memerlukan pemeriksaan kualitas: apakah gambar cukup tajam, atau haruskah robot melakukan pengambilan gambar ulang? Apakah jalurnya masih jelas, atau harus memutar? Apakah baterai sudah di atas ambang batas, atau haruskah tugas dihentikan?</p>
<p>Sistem single-pass tidak memiliki mekanisme untuk panggilan-panggilan tersebut. Sistem ini mengeksekusi, berhenti, dan mengulangi kegagalan yang sama di lain waktu.</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">Bagaimana RoboBrain Menutup Lingkaran Tugas Robot<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrain menghubungkan pemahaman lingkungan, perencanaan tugas, kontrol eksekusi, dan umpan balik data ke dalam satu loop operasi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>Arsitektur middleware inti RoboBrain yang menunjukkan bagaimana maksud pengguna mengalir melalui objek tugas, memori yang sadar panggung yang didukung oleh Milvus, dan mesin kebijakan sebelum mencapai kemampuan yang diwujudkan</span> </span></p>
<p>Dalam arsitektur yang dijelaskan dalam artikel ini, loop tersebut diimplementasikan melalui tiga mekanisme:</p>
<ol>
<li><strong>Objektifikasi tugas</strong> menyusun titik masuk.</li>
<li><strong>Memori berjenjang</strong> merutekan informasi yang tepat ke tahap yang tepat.</li>
<li><strong>Lingkaran umpan balik</strong> menulis hasil kembali dan memutuskan langkah selanjutnya.</li>
</ol>
<p>Mereka hanya bekerja sebagai satu rangkaian. Perbaiki satu tanpa yang lain dan rantai akan tetap putus pada titik berikutnya.</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1. Objektifikasi Tugas: Mengubah Niat menjadi Status Bersama</h3><p>Sebelum eksekusi dimulai, RoboBrain mengubah setiap instruksi menjadi objek tugas: jenis tugas, area target, objek inspeksi, batasan, keluaran yang diharapkan, tahap saat ini, dan kebijakan kegagalan.</p>
<p>Intinya bukan hanya mengurai bahasa. Intinya adalah memberikan setiap modul hilir pandangan yang sama tentang tugas. Tanpa konversi itu, tugas tidak memiliki arah.</p>
<p>Untuk contoh patroli, objek tugas mengisi jenis inspeksi, zona yang ditentukan, item anomali sebagai objek pemeriksaan, baterai &gt;= 20% sebagai batasan, foto anomali yang jelas ditambah peringatan operator sebagai output yang diharapkan, dan kembali ke pangkalan sebagai kebijakan kegagalan.</p>
<p>Bidang panggung diperbarui saat menjalankan perubahan. Rintangan akan memindahkan tugas dari menavigasi ke jalan memutar atau meminta bantuan. Gambar yang buram memindahkannya dari pemeriksaan ke pengambilan gambar ulang. Baterai lemah memindahkannya ke penghentian dan kembali ke pangkalan.</p>
<p>Modul hilir tidak lagi menerima perintah yang terisolasi. Mereka menerima tahap tugas saat ini, batasannya, dan alasan perubahan tahap.</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2. Memori Berjenjang: Merutekan Konteks ke Tahap yang Tepat</h3><p>RoboBrain membagi informasi yang relevan dengan tugas menjadi tiga tingkatan sehingga data yang tepat mencapai tahap yang tepat.</p>
<p><strong>Status real-time</strong> menyimpan pose, baterai, pembacaan sensor, dan pengamatan lingkungan. Ini mendukung keputusan di setiap langkah kontrol.</p>
<p><strong>Konteks jangka pendek</strong> mencatat peristiwa dalam tugas saat ini: rintangan yang dihindari robot dua menit yang lalu, foto yang diambil ulang, atau pintu yang gagal dibuka pada percobaan pertama. Hal ini membuat sistem tidak kehilangan jejak tentang apa yang baru saja terjadi.</p>
<p><strong>Memori semantik jangka panjang</strong> menyimpan pengetahuan pemandangan, pengalaman historis, kasus pengecualian, dan penulisan ulang setelah tugas selesai. Area parkir tertentu mungkin memerlukan penyesuaian sudut kamera pada malam hari karena permukaan yang memantulkan cahaya. Jenis anomali tertentu mungkin memiliki riwayat positif palsu dan harus memicu tinjauan manusia, bukan peringatan otomatis.</p>
<p>Tingkat jangka panjang ini berjalan pada <a href="https://zilliz.com/learn/vector-similarity-search">pencarian kemiripan vektor</a> melalui <a href="https://milvus.io/">basis data vektor Milvus</a>, karena mengambil memori yang tepat berarti mencocokkan berdasarkan makna, bukan dengan ID atau kata kunci. Deskripsi adegan dan catatan penanganan disimpan sebagai penyematan <a href="https://zilliz.com/glossary/vector-embeddings">vektor</a> dan diambil dengan <a href="https://zilliz.com/glossary/anns">perkiraan pencarian tetangga terdekat</a> untuk menemukan kecocokan semantik terdekat.</p>
<p>Startup menarik aturan area dan ringkasan patroli sebelumnya dari memori jangka panjang. Eksekusi pertengahan bergantung pada keadaan waktu nyata dan konteks jangka pendek. Penanganan pengecualian menggunakan <a href="https://zilliz.com/glossary/semantic-search">pencarian semantik</a> untuk menemukan kasus serupa dalam memori jangka panjang.</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3. Lingkaran Umpan Balik: Menuliskan Hasil Kembali ke dalam Sistem</h3><p>RoboBrain menulis hasil navigasi, persepsi, dan tindakan kembali ke objek tugas setelah setiap langkah, memperbarui bidang panggung. Sistem membaca pengamatan tersebut dan memutuskan langkah selanjutnya: memutar jika jalur tidak dapat dijangkau, memotret ulang jika gambar buram, mencoba lagi jika pintu tidak mau terbuka, atau menghentikan jika baterai lemah.</p>
<p>Eksekusi menjadi sebuah siklus: eksekusi, amati, sesuaikan, eksekusi lagi. Rantai ini terus beradaptasi dengan perubahan lingkungan alih-alih menghentikannya saat sesuatu yang tidak terduga muncul.</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Bagaimana Milvus Memperkuat Memori Robot Jangka Panjang RoboBrain<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Beberapa memori robot dapat ditanyakan dengan ID tugas, stempel waktu, atau metadata sesi. Pengalaman operasional jangka panjang biasanya tidak bisa.</p>
<p>Catatan yang berguna sering kali merupakan kasus yang secara semantik mirip dengan adegan saat ini, meskipun ID tugas, nama lokasi, atau kata-katanya berbeda. Hal ini menjadikannya masalah <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a>, dan Milvus cocok untuk tingkat memori jangka panjang.</p>
<p>Tingkat ini menyimpan informasi seperti:</p>
<ul>
<li>Deskripsi aturan area dan semantik lokasi titik</li>
<li>Definisi tipe anomali dan ringkasan contoh</li>
<li>Catatan penanganan historis dan kesimpulan tinjauan pasca-tugas</li>
<li>Rangkuman patroli yang ditulis pada saat penyelesaian tugas</li>
<li>Pengalaman penulisan ulang setelah pengambilalihan oleh manusia</li>
<li>Penyebab kegagalan dan strategi koreksi dari skenario serupa</li>
</ul>
<p>Semua itu tidak ada yang secara alami dikunci oleh bidang yang terstruktur. Semua itu perlu diingat berdasarkan makna.</p>
<p>Contoh konkret: robot berpatroli di pintu masuk tempat parkir pada malam hari. Silau dari lampu di atas kepala membuat deteksi anomali menjadi tidak stabil. Pantulan terus ditandai sebagai anomali.</p>
<p>Sistem perlu mengingat strategi pemotretan ulang yang berhasil di bawah silau malam hari yang kuat, koreksi sudut kamera dari area yang sama, dan kesimpulan tinjauan manusia yang menandai deteksi sebelumnya sebagai positif palsu. Kueri pencocokan yang tepat dapat menemukan ID tugas atau jendela waktu yang diketahui. Query ini tidak dapat diandalkan untuk memunculkan "kasus silau sebelumnya yang berperilaku seperti kasus ini" kecuali jika hubungan tersebut telah diberi label.</p>
<p>Kemiripan semantik adalah pola pengambilan yang bekerja. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">Metrik kem</a> iripan mengurutkan memori yang tersimpan berdasarkan relevansinya, sementara <a href="https://milvus.io/docs/filtered-search.md">pemfilteran metadata</a> dapat mempersempit ruang pencarian berdasarkan area, jenis tugas, atau jendela waktu. Dalam praktiknya, hal ini sering kali menjadi <a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">pencarian hibrida</a>: pencocokan semantik untuk makna, filter terstruktur untuk batasan operasional.</p>
<p>Untuk implementasi, lapisan filter sering kali menjadi tempat memori semantik menjadi operasional. <a href="https://milvus.io/docs/boolean.md">Ekspresi filter Milvus</a> mendefinisikan batasan skalar, sementara <a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">kueri skalar Milvus</a> mendukung pencarian yang tepat ketika sistem membutuhkan catatan berdasarkan metadata, bukan kesamaan.</p>
<p>Pola pengambilan ini menyerupai <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pengambilan-pembangkitan</a> yang diadaptasi untuk pengambilan keputusan di dunia fisik, bukan pengambilan teks. Robot ini tidak mengambil dokumen untuk menjawab sebuah pertanyaan; robot ini mengambil pengalaman sebelumnya untuk memilih tindakan yang aman berikutnya.</p>
<p>Tidak semua hal masuk ke Milvus. ID tugas, stempel waktu, dan metadata sesi berada di dalam basis data relasional. Catatan runtime mentah berada di dalam sistem pencatatan. Setiap sistem penyimpanan menangani pola kueri yang dibuatnya.</p>
<table>
<thead>
<tr><th>Tipe Data</th><th>Tempat Penyimpanannya</th><th>Bagaimana Ia Ditanyakan</th></tr>
</thead>
<tbody>
<tr><td>ID tugas, stempel waktu, metadata sesi</td><td>Basis data relasional</td><td>Pencarian yang tepat, penggabungan</td></tr>
<tr><td>Log runtime mentah dan aliran peristiwa</td><td>Sistem pencatatan</td><td>Pencarian teks lengkap, filter rentang waktu</td></tr>
<tr><td>Aturan adegan, penanganan kasus, penulisan ulang pengalaman</td><td>Milvus</td><td>Pencarian kemiripan vektor berdasarkan makna</td></tr>
</tbody>
</table>
<p>Saat tugas berjalan dan adegan terakumulasi, lapisan memori jangka panjang memberi makan proses hilir: kurasi sampel untuk penyempurnaan model, analisis data yang lebih luas, dan transfer pengetahuan lintas penerapan. Memori ini digabungkan menjadi aset data yang memberikan titik awal yang lebih tinggi bagi setiap penerapan di masa mendatang.</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">Apa yang Diubah oleh Arsitektur Ini dalam Penerapan<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Objektifikasi tugas, memori berjenjang, dan loop umpan balik mengubah loop tugas RoboBrain menjadi pola penerapan: setiap tugas mempertahankan status, setiap pengecualian dapat mengambil pengalaman sebelumnya, dan setiap proses dapat meningkatkan proses berikutnya.</p>
<p>Robot yang berpatroli di gedung baru tidak boleh memulai dari awal jika robot tersebut telah menangani pencahayaan, rintangan, jenis anomali, atau aturan operator yang serupa di tempat lain. Hal inilah yang membuat eksekusi tugas robot lebih dapat diulang di berbagai lokasi, dan membuat biaya penyebaran jangka panjang lebih mudah dikendalikan.</p>
<p>Untuk tim robotika, pelajaran yang lebih dalam adalah bahwa memori bukan hanya lapisan penyimpanan. Memori adalah bagian dari kontrol eksekusi. Sistem perlu mengetahui apa yang sedang dilakukannya, apa yang baru saja berubah, kasus serupa yang pernah terjadi sebelumnya, dan apa yang harus dituliskan kembali untuk proses selanjutnya.</p>
<h2 id="Further-Reading" class="common-anchor-header">Bacaan Lebih Lanjut<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda sedang mengerjakan masalah serupa dengan memori robot, eksekusi tugas, atau pengambilan semantik untuk AI yang diwujudkan, sumber-sumber ini adalah langkah selanjutnya yang berguna:</p>
<ul>
<li>Baca <a href="https://milvus.io/docs">dokumentasi Milvus</a> atau coba <a href="https://milvus.io/docs/quickstart.md">mulai cepat Milvus</a> untuk melihat bagaimana pencarian vektor bekerja dalam praktiknya.</li>
<li>Tinjau <a href="https://milvus.io/docs/architecture_overview.md">ikhtisar arsitektur Milvus</a> jika Anda merencanakan lapisan memori produksi.</li>
<li>Jelajahi <a href="https://zilliz.com/vector-database-use-cases">kasus penggunaan basis data vektor</a> untuk lebih banyak contoh pencarian semantik dalam sistem produksi.</li>
<li>Bergabunglah dengan <a href="https://milvus.io/community">komunitas Milvus</a> untuk mengajukan pertanyaan dan berbagi apa yang Anda bangun.</li>
<li>Jika Anda ingin mengelola Milvus alih-alih menjalankan infrastruktur Anda sendiri, pelajari lebih lanjut tentang <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</li>
</ul>
