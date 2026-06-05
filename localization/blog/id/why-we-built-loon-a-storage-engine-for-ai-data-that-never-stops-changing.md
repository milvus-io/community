---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >-
  Mengapa Kami Membangun Loon: Mesin Penyimpanan untuk Data AI yang Tidak Pernah
  Berhenti Berubah.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Chat_GPT_Image_Jun_5_2026_04_23_58_PM_716fe391b5.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >-
  Loon adalah mesin penyimpanan baru untuk Milvus 3.0 dan Zilliz Vector
  Lakebase, yang dibuat untuk mengelola set data vektor yang terus berkembang
  dengan ColumnGroups, penyelarasan ID baris, dan Manifes.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Blog ini awalnya diterbitkan di zilliz.com dan telah diterbitkan ulang dengan izin.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Poin-poin penting<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Ini adalah pembahasan teknik yang panjang dan mendalam, jadi inilah poin-poin penting sebelum kita membahas detailnya.</p>
<ul>
<li>Kumpulan data AI bukanlah tabel statis. Baris yang sama terus berubah ketika tim mengganti model penyematan, menambahkan vektor yang jarang, merevisi keterangan, mengisi ulang label, membangun kembali indeks, dan menjalankan analisis offline.</li>
<li>Tata letak penyimpanan tradisional rusak dalam tiga cara: kolom vektor yang panjang membuat pengisian ulang menjadi mahal, format file tunggal tidak dapat melayani pemindaian dan pembacaan titik dengan baik, dan penyimpanan basis data pribadi memaksa saluran pipa eksternal untuk membuat salinan ekstra dari kebenaran.</li>
<li>Loon adalah mesin penyimpanan baru untuk Milvus dan Zilliz Vector Lakebase. Mesin ini dibangun berdasarkan format file hibrida, penyelarasan ID baris, dan Manifes yang mendefinisikan status versi set data.</li>
<li>Tujuannya adalah untuk memungkinkan dataset vektor tunggal untuk mendukung pencarian online, analisis offline, pengisian ulang, pemadatan, dan komputasi eksternal tanpa terus-menerus menyalin, menulis ulang, atau mengimpor ulang data.</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk sementara waktu, ada satu argumen yang menentang basis data vektor yang terdengar masuk akal.</p>
<p><em>Basis data tradisional sudah menyimpan bilangan bulat, string, JSON, gumpalan, dan indeks. Mengapa tidak menambahkan</em> <em>tipe</em> <code translate="no">_vector_</code> <em>, membangun indeks ANN di sampingnya, dan menyebutnya sebagai hari?</em></p>
<p>Untuk pencarian semantik awal, hal ini bekerja dengan cukup baik. Kolom vektor ditambah indeks dapat mendukung demo, aplikasi RAG kecil, atau fitur pencarian internal. Masalahnya muncul kemudian, ketika dataset mulai berperilaku kurang seperti tabel dan lebih seperti sistem data AI.</p>
<p>Dataset vektor produksi memiliki baris, kunci utama, bidang skalar, dan kolom yang dapat ditanyakan. Dalam hal ini, dataset ini terlihat seperti tabel basis data. Namun, dataset ini juga memiliki skala dan bentuk alur kerja seperti data lake. Ini mungkin berisi ratusan juta catatan. Data lake berulang kali dibaca dan ditulis ulang oleh Spark, Ray, DuckDB, pipeline pelatihan, pekerjaan evaluasi, dan sistem kualitas data.</p>
<p>Hal ini juga tergantung pada penyimpanan objek. Objek sumber sering kali berupa video, gambar, PDF, file audio, atau dokumen web yang disimpan di S3, GCS, OSS, atau penyimpanan objek lainnya. Basis data menyimpan referensi, metadata, fitur turunan, dan indeks. Kemudian menambahkan hal-hal yang tidak dapat dikelola oleh model penyimpanan tradisional sebagai objek kelas satu: penyematan padat, vektor yang jarang, keterangan, indeks vektor, indeks teks, log hapus, statistik, versi model, versi parser, referensi gumpalan eksternal, dan hubungan versi di antara semuanya.</p>
<p><strong>Di situlah "cukup tambahkan kolom vektor" mulai rusak.</strong> Masalahnya bukan apakah database dapat menyimpan byte vektor. Banyak sistem yang bisa. Pertanyaan yang lebih sulit adalah <strong>apakah model penyimpanan dapat menangani bagaimana data vektor berubah, bagaimana data vektor ditanyakan, dan bagaimana data vektor dibagikan di seluruh tumpukan data AI</strong>.</p>
<p><strong>Inilah alasan kami membangun Loon, mesin penyimpanan baru untuk Milvus dan</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(evolusi berikutnya dari Zilliz Cloud)</strong>.</p>
<p>Loon dirancang dengan tiga ide:</p>
<ol>
<li>Gunakan format fisik yang berbeda untuk berbagai jenis kolom.</li>
<li>Menyelaraskan kolom-kolom tersebut melalui ruang ID baris bersama.</li>
<li>Gunakan Manifest untuk mendefinisikan status versi kumpulan data.</li>
</ol>
<p>Untuk mengetahui mengapa bagian-bagian tersebut penting, mari kita mulai dengan alur kerja multimodal yang umum.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Dataset vektor tidak pernah benar-benar selesai.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Bayangkan sebuah tim AI sedang membangun set data video untuk pelatihan multimodal.</p>
<p>Sebuah video panjang diunggah ke penyimpanan objek. Sebuah pipeline memotongnya menjadi beberapa klip berdasarkan perubahan adegan, batas pengambilan gambar, atau jendela waktu. Klip yang terlalu panjang atau terlalu pendek, buram, terduplikasi, atau berkualitas rendah disaring. Klip yang tersisa dinilai oleh model estetika, diberi teks oleh model lain, disematkan oleh model bahasa visi, dan disimpan dalam basis data vektor untuk pencarian, deduplikasi, dan pemfilteran data pelatihan.</p>
<p>Pada tingkat tinggi, alur kerja terlihat sederhana:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Namun, dataset tidak datang dalam bentuk yang lengkap.</p>
<ul>
<li>Pada minggu pertama, tabel mungkin hanya berisi <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code>, dan <code translate="no">duration</code>.</li>
<li>Pada minggu kedua, tim menambahkan <code translate="no">aesthetic_score</code>.</li>
<li>Pada minggu ketiga, model teks berjalan, dan setiap klip mendapatkan <code translate="no">caption</code>.</li>
<li>Pada minggu keempat, model penyematan pertama berjalan secara online, dan setiap klip mendapatkan penyematan CLIP 768 dimensi.</li>
<li>Sebulan kemudian, tim mengganti model dan mengisi ulang <code translate="no">embedding_v2</code>, sekarang dengan 1024 dimensi.</li>
<li>Dua bulan kemudian, pencarian hibrida menjadi sebuah persyaratan, sehingga tim menambahkan kolom vektor yang jarang.</li>
<li>Tiga bulan kemudian, keterangan menjalani peninjauan manusia dan harus diperbaiki di tempat.</li>
</ul>
<p>Dataset tidak pernah selesai. Ia terus mengumpulkan interpretasi baru dari baris yang sama.</p>
<p>Itulah salah satu perbedaan utama antara data vektor dan data bisnis tradisional. Baris yang sama akan diproses ulang berulang kali. Dan skala mengubah hal ini dari ketidaknyamanan menjadi masalah penyimpanan: kumpulan data multimodal sering kali bukan jutaan catatan tetapi ratusan juta atau miliaran. LAION-5B adalah referensi yang berguna untuk bentuknya - miliaran pasangan gambar-teks, masing-masing dengan metadata, keterangan, dan penyematan. Jadi, bagian yang sulit bukanlah penyisipan pertama. Bagian yang sulit adalah segala sesuatu yang terjadi setelah kumpulan data mulai berevolusi. <strong>Evolusi itu memperlihatkan tiga masalah.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">Masalah pertama: kolom yang panjang membuat amplifikasi penulisan menjadi mahal<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Format kolom seperti Parquet sangat baik untuk banyak beban kerja analitis. Format ini bekerja dengan baik ketika skema cukup stabil, data lebih sering dibaca daripada ditulis ulang, pemindaian hanya menyentuh sebagian kecil kolom, dan kompresi menjadi penting. Itulah dunia di mana banyak format analitik dioptimalkan.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Baris vektor jauh lebih lebar daripada baris analitik</h3><p>TPC-H <code translate="no">lineitem</code> adalah garis dasar yang baik. Format ini memiliki 16 kolom: kunci bilangan bulat, nilai desimal, tanggal, string pendek, dan kolom komentar kecil. Satu baris yang belum dikompresi berukuran sekitar 150 byte. Setelah dikompresi, ukurannya mungkin jauh lebih kecil. Dengan kelompok baris 64 MB, sistem penyimpanan dapat mengemas ratusan ribu baris ke dalam satu kelompok.</p>
<p><strong>Kumpulan data vektor tidak terlihat seperti itu.</strong></p>
<p>Dataset gambar-teks gaya LAION jauh lebih dekat dengan apa yang dihasilkan oleh banyak pipeline AI saat ini. Setiap baris masih memiliki metadata biasa: URL, keterangan, lebar, tinggi, skor kualitas, label, dan sebagainya. Tetapi setelah penyematan ditambahkan, bentuk fisik baris berubah.</p>
<p>Vektor CLIP 768 dimensi membutuhkan sekitar 1,5 KB dalam fp16 atau 3 KB dalam fp32. Satu kolom tersebut bisa jauh lebih besar daripada seluruh baris TPC-H <code translate="no">lineitem</code>.</p>
<p>Dan 768 dimensi bukanlah hal yang tidak biasa atau besar menurut standar saat ini. Penyematan 1024 atau 2048 dimensi adalah hal yang umum dalam jaringan pipa multimodal. OpenAI's <code translate="no">text-embedding-3-large</code> mencapai 3072 dimensi, yaitu sekitar 12 KB per vektor dalam fp32.</p>
<p>Perbandingannya sangat mencolok:</p>
<table>
<thead>
<tr><th>Bentuk dataset</th><th>Perkiraan ukuran baris</th><th>Apa yang mendominasi baris</th></tr>
</thead>
<tbody>
<tr><td>Item baris TPC-H</td><td>~150 byte tidak terkompresi</td><td>bidang skalar dan string pendek</td></tr>
<tr><td>Baris gaya LAION dengan vektor fp16 768-dim</td><td>~1,5 KB+</td><td>penyematan</td></tr>
<tr><td>Baris gaya LAION dengan vektor fp32 768-dim</td><td>~3 KB+</td><td>penyematan</td></tr>
<tr><td>Baris dengan vektor fp32 berukuran 3072-dim</td><td>~12 KB+ untuk vektornya saja</td><td>penyematan</td></tr>
</tbody>
</table>
<p>Dalam banyak set data AI, kolom vektor bukan sekadar bidang. Secara fisik, kolom vektor adalah sebagian besar baris. Hal ini mengubah biaya evolusi skema.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">Menambahkan satu kolom vektor dapat berarti ratusan gigabyte</h3><p>Misalkan sebuah kumpulan data memiliki 100 juta klip video. Menambahkan kolom penyematan fp32 1024 dimensi baru berarti menulis sekitar 400 GB data vektor mentah. Itu belum termasuk statistik, indeks, pembaruan metadata, overhead penyimpanan objek, validasi, atau integrasi jalur penayangan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Jika tim menambahkan satu atau dua kolom seperti vektor setiap bulan, seperti <code translate="no">embedding_v2</code>, <code translate="no">sparse_vector</code>, atau fitur peringkat ulang, evolusi skema menjadi pekerjaan rekayasa daAta berulang yang diukur dalam ratusan gigabyte atau terabyte.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">Pembaruan logis yang kecil dapat memicu penulisan ulang fisik yang besar</h3><p>Pembaruan juga sama pentingnya.</p>
<p>Dalam sistem kolumnar, data lama biasanya tidak diperbarui pada tempatnya. Log penghapusan mencatat apa yang berubah, dan pemadatan kemudian menulis ulang baris langsung ke dalam file baru. Model tersebut dapat dikelola ketika baris-barisnya kecil.</p>
<p>Dengan data vektor, pembaruan logis yang kecil dapat memicu penulisan ulang fisik yang besar.</p>
<p>Pekerjaan tinjauan manusia mungkin hanya mengoreksi beberapa ratus byte dalam teks. Tetapi jika keterangan, vektor padat, vektor jarang, dan fitur turunan lainnya memiliki siklus hidup file fisik yang sama, sistem mungkin akan menulis ulang vektor-vektor tersebut juga. Perubahan logisnya kecil. I / O fisik bisa sangat besar.</p>
<p>Ini adalah masalah amplifikasi tulis dalam penyimpanan vektor. Bagian yang mahal bukan hanya karena vektornya besar. Bidang turunan yang besar dan bidang kecil yang dapat diubah sering kali disatukan oleh tata letak penyimpanan yang memperlakukannya sebagai satu unit.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Untuk set data AI, pengisian ulang adalah beban kerja rutin</h3><p>Untuk tabel analitik tradisional, evolusi skema mungkin hanya terjadi sesekali. Untuk dataset AI, ini adalah rutinitas. Model keterangan ditingkatkan. Model penyematan diganti. Vektor jarang ditambahkan kemudian. Fitur peringkat ulang muncul. Label manusia diperbaiki. Tag tata kelola diisi ulang. Indeks dibangun kembali.</p>
<p>Operasi-operasi ini bukanlah penambahan sederhana. Mereka sering memodifikasi atau memperluas baris yang ada.</p>
<p>Itulah sebabnya penyimpanan vektor tidak bisa hanya mengoptimalkan throughput pemindaian. Penyimpanan ini juga harus membuat pengisian ulang dan pembaruan parsial menjadi lebih murah.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">Masalah kedua: data yang sama harus mendukung pemindaian dan pembacaan titik<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah data ditulis, jalur baca akan terpecah. Kumpulan data vektor yang sama biasanya memiliki dua pola akses yang berbeda: <strong>pemindaian analitik dan pembacaan titik</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">Beban kerja analitik menginginkan pemindaian yang lebar dan terkompresi</h3><p>Pipeline dapat menjalankan filter seperti:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Atau dapat menjalankan analisis offline, evaluasi penyematan penuh, statistik BM25, konstruksi bitmap, pemeriksaan kualitas data, jumlah, dan group-bys.</p>
<p>Pola ini membaca banyak baris tetapi hanya beberapa kolom. Pola ini menyukai I/O berurutan, grup baris yang lebih besar, kompresi, pemangkasan kolom, decoding batch, dan eksekusi vektor.</p>
<p>Grup baris yang besar membantu di sini. Mereka membiarkan satu permintaan I/O menarik sejumlah besar data yang berguna, meningkatkan efisiensi kompresi, dan menyediakan mesin eksekusi dengan data yang cukup berdekatan untuk mengamortisasi overhead. Ketika beberapa kolom dibaca bersama-sama, menjaga mereka tetap teratur untuk throughput pemindaian juga membantu mengurangi kesalahan cache selama eksekusi vektor.</p>
<p>Parket kuat dalam hal ini.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">Hasil ANN membutuhkan pencarian tingkat baris yang sempit</h3><p>Setelah pencarian ANN mengembalikan ID baris kandidat, sistem sering kali perlu mengambil bidang seperti:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Pola ini membaca lebih sedikit baris, sering kali ratusan atau ribuan, tetapi membutuhkan akses yang tepat berdasarkan ID baris. Sistem ingin menemukan baris dan kolom tertentu, mengambil hanya rentang byte yang diperlukan, dan menghindari menarik seluruh grup baris hanya untuk mengambil beberapa record.</p>
<p>Pencarian titik memiliki preferensi yang hampir berlawanan dengan pemindaian. Ia menginginkan perincian pembacaan yang lebih kecil. Idealnya, lapisan penyimpanan dapat menemukan segmen atau rentang byte yang relevan dengan ID baris, hanya membaca rentang tersebut, dan memecahkan kode hanya data yang diperlukan untuk hasilnya.</p>
<p>Kompresi juga memiliki tradeoff yang berbeda. Untuk pemindaian, kompresi yang lebih berat sering kali sepadan karena sistem membaca banyak data dan menghemat I/O. Untuk pencarian titik, kompresi dapat menjadi beban jika mengambil satu baris memerlukan penguraian blok terkompresi yang jauh lebih besar.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Satu tata letak tidak dapat mengoptimalkan untuk kedua jalur</h3><p>Ini adalah konflik intinya. Pemfilteran skalar dan analitik menginginkan tata letak yang lebar, terkompresi, dan mudah dipindai. Pencarian vektor menginginkan tata letak yang sempit, tepat, dan dapat dialamatkan ke baris.</p>
<p>Satu format file dapat mendukung keduanya sampai tingkat tertentu, tetapi tidak dapat optimal untuk keduanya secara bersamaan.</p>
<p>Jika semua kolom berada di Parket, pemindaian skalar akan menjadi nyaman. Tetapi pencarian ANN setelah pemanggilan kembali menjadi lebih sulit. Sistem mungkin hanya membutuhkan beberapa ratus vektor, keterangan, atau catatan metadata, sementara lapisan penyimpanan mungkin harus membaca kelompok baris besar yang sebagian besar berisi baris yang tidak relevan.</p>
<p>Pada SSD lokal, cache dan mmap dapat menyembunyikan sebagian dari biaya ini. Setelah data disimpan dalam penyimpanan objek, biaya menjadi lebih terlihat. Setiap cache yang terlewat dapat menjadi pembacaan jarak jauh. Jika baris kandidat tersebar di banyak kelompok baris, satu kueri dapat memicu beberapa pembacaan, masing-masing menarik lebih banyak data daripada yang dibutuhkan kueri. Dalam tata letak yang kurang baik, mengambil 1.000 baris kandidat dapat dengan mudah menghasilkan puluhan atau ratusan megabyte I/O yang tidak perlu, dan dalam kasus yang ekstrim, lebih banyak lagi.</p>
<p>Membuat kelompok baris menjadi lebih kecil akan membantu pencarian titik, tetapi akan mengganggu pemindaian. Terlalu banyak fragmen kecil akan mengurangi efisiensi kompresi, meningkatkan overhead metadata, dan memecah pembacaan berurutan yang panjang yang diandalkan oleh mesin analitik.</p>
<p><strong>Jadi, masalahnya bukan tentang menemukan satu ukuran kelompok baris ajaib. Masalahnya adalah dataset yang sama diminta untuk berperilaku seperti dua sistem penyimpanan yang berbeda.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">Pencarian hibrida memaksa kedua jalur ke dalam satu kueri</h3><p>Pencarian hibrida membuat konflik lebih sulit untuk diabaikan. Sebuah kueri tunggal dapat menerapkan filter skalar terlebih dahulu:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian menjalankan pencarian ANN.</p>
<p>Kemudian mengambil keterangan, vektor, dan metadata berdasarkan ID baris.</p>
<p>Bagi pengguna, ini adalah satu permintaan pencarian. Bagi lapisan penyimpanan, ini adalah pemindaian analitis dan pencarian acak latensi rendah.</p>
<p>Itulah mengapa penyimpanan vektor membutuhkan lebih dari sekadar pengaturan Parket yang lebih baik. Diperlukan cara untuk menempatkan kolom yang berbeda sesuai dengan bagaimana mereka benar-benar dibaca.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">Masalah ketiga: kumpulan data tidak berada di dalam satu mesin<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Dua masalah pertama terjadi di dalam database. Masalah ketiga terjadi pada batas antar sistem.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">Pipeline data AI menjangkau banyak sistem</h3><p>Dalam alur kerja video, sangat sedikit yang terjadi di dalam basis data vektor itu sendiri.</p>
<p>Video mentah berada dalam penyimpanan objek. Pembuatan klip dapat berjalan di Spark atau Ray. Penilaian estetika dapat berjalan dalam layanan GPU. Captioning dapat berjalan dalam pipa inferensi LLM. Penyematan dapat dihasilkan oleh pekerjaan GPU lain. Vektor yang jarang dapat berasal dari layanan SPLADE. Evaluasi offline, pemfilteran data pelatihan, tinjauan manusia, dan pekerjaan tata kelola dapat berjalan di tempat lain.</p>
<p>Basis data vektor melayani pencarian online, tetapi kumpulan data diproduksi, dikoreksi, dievaluasi, dan diperluas oleh banyak sistem.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">Format penyimpanan pribadi membuat banyak salinan kebenaran</h3><p>Jika basis data menggunakan format fisik privat yang hanya dapat dibaca dan ditulis olehnya, setiap pekerjaan eksternal membutuhkan ekspor, konversi, salinan, dan impor. Koleksi yang sama mungkin ada di database, di direktori sementara Spark, di output evaluasi, dan di direktori isi ulang lokal. Kemudian pertanyaan yang sebenarnya menjadi:</p>
<ul>
<li>Salinan mana yang merupakan sumber kebenaran?</li>
<li>Yang mana yang berisi model keterangan dari bulan lalu?</li>
<li>Baris mana yang telah dikoreksi oleh peninjauan manusia?</li>
<li>Kolom vektor jarang mana yang dihasilkan oleh model yang mana?</li>
<li>Indeks vektor mana yang masih valid setelah pengisian ulang?</li>
<li>Objek video asli mana yang dirujuk oleh baris ini?</li>
</ul>
<p>Dalam skala kecil, tim terkadang dapat bertahan dengan konvensi penamaan dan pemeriksaan manual. Dengan ratusan juta baris dan terabyte penyematan, hal ini menjadi masalah konsistensi.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Kumpulan data vektor membutuhkan status versi bersama</h3><p>Sistem Lakehouse mengatasi masalah ini untuk data terstruktur. Iceberg, Delta Lake, dan Hudi bukan hanya tentang menyimpan file. Kontribusi utama mereka adalah memungkinkan beberapa mesin berkoordinasi di sekitar status tabel yang sama.</p>
<p>Basis data vektor sekarang membutuhkan kemampuan yang sama, tetapi keadaannya lebih kompleks. Ini harus mencakup tidak hanya file tabel dan partisi, tetapi juga indeks vektor, indeks teks, fitur yang jarang, menghapus log, statistik, rentang ID baris, dan referensi ke gumpalan eksternal.</p>
<p>Pertanyaannya bukan sekadar, "Bisakah Spark membaca file Milvus?"</p>
<p>Pertanyaannya adalah, setelah Spark mengisi ulang kolom vektor yang jarang, bagaimana Milvus mengetahui versi mana yang dimiliki kolom tersebut, baris mana yang dicakupnya, model mana yang membuatnya, dan kapan kueri online dapat menggunakannya dengan aman?</p>
<p>Jawabannya ada pada model penyimpanan.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">Mengapa tambalan saja tidak cukup<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Sangat menggoda untuk memperlakukan ini sebagai tiga masalah teknik yang terpisah.</p>
<ul>
<li>Menulis amplifikasi? Tambahkan batching.</li>
<li>Titik baca? Tambahkan cache.</li>
<li>Sistem eksternal? Tambahkan alat ekspor dan impor.</li>
</ul>
<p>Patch-patch tersebut dapat membantu, tetapi tidak mengatasi masalah yang mendasarinya: kumpulan data vektor secara fisik heterogen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam contoh video, <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code>, dan <code translate="no">aesthetic_score</code> adalah bidang skalar pendek. Bidang-bidang ini berguna untuk penyaringan dan analisis.</p>
<ul>
<li><code translate="no">caption</code> adalah teks. Ini dapat digunakan untuk BM25, tinjauan, koreksi, dan pengisian ulang.</li>
<li><code translate="no">embedding</code> adalah vektor yang panjang dan padat. Ini digunakan untuk pemanggilan kembali ANN dan kemudian untuk pencarian atau pemeringkatan ulang tingkat baris.</li>
<li><code translate="no">embedding_v2</code> adalah keluaran model baru, sering kali diisi ulang lama setelah data asli dimasukkan.</li>
<li><code translate="no">sparse_vector</code> mendukung pencarian hibrida dan memiliki pola aksesnya sendiri.</li>
<li>Video mentah harus tetap berada di penyimpanan objek. Basis data harus menyimpan referensi, checksum, tipe MIME, versi parser, dan hubungan tingkat baris.</li>
<li>Indeks vektor, indeks teks, statistik, dan log hapus adalah objek turunan dengan semantik versinya sendiri.</li>
</ul>
<p>Objek-objek ini berbagi baris logis, tetapi mereka tidak boleh memiliki tata letak fisik atau siklus hidup yang sama.</p>
<ul>
<li>Jika mereka dipaksa menjadi satu tata letak tabel biasa, pembaruan akan menjadi mahal.</li>
<li>Jika dipaksakan menjadi satu format file kolom, pembacaan titik menjadi mahal.</li>
<li>Jika mereka diperlakukan sebagai file objek yang tidak terkait, manajemen versi menjadi rapuh.</li>
</ul>
<p>Jadi model penyimpanan harus dimulai dari fakta bahwa kumpulan data bersifat heterogen.</p>
<p><strong>Hal ini mengarah pada tiga persyaratan desain:</strong></p>
<ul>
<li>Pertama, kelompok kolom yang berbeda harus disimpan dalam format fisik yang berbeda.</li>
<li>Kedua, kelompok-kelompok kolom tersebut membutuhkan ruang ID baris bersama, sehingga mereka masih dapat berperilaku sebagai satu tabel logis.</li>
<li>Ketiga, kumpulan data membutuhkan Manifest berversi yang menyatakan file, indeks, log, statistik, dan referensi objek mana yang termasuk dalam tampilan saat ini.</li>
</ul>
<p><strong>Ini adalah desain di balik Loon, mesin penyimpanan baru kami di balik Milvus dan Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: mesin penyimpanan di balik Milvus dan Zilliz Cloud untuk kumpulan data vektor yang terus berkembang<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk mengatasi semua masalah di atas, kami membangun <strong>Loon</strong>, mesin penyimpanan baru untuk Milvus dan <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (evolusi berikutnya dari Zilliz Cloud), yang dirancang untuk kumpulan data vektor yang terus berkembang.</p>
<p>Nama ini mengikuti tradisi penamaan burung Zilliz. Loon adalah burung penyelam yang hidup di danau, yang memetakan dengan baik tujuan sistem: basis data vektor seharusnya tidak perlu memindahkan, memindai, atau menulis ulang seluruh danau data setiap kali menjalankan kueri, mengisi ulang kolom, atau membangun indeks. Pertama-tama, database harus memahami versi kumpulan data saat ini, termasuk kolom, indeks, statistik, menghapus log, dan referensi objek, kemudian hanya membaca bagian yang benar-benar dibutuhkan.</p>
<p>Format file hibrida, perataan ID baris, dan Manifest bukanlah tiga fitur yang terpisah. Mereka berasal dari asumsi desain yang sama: kumpulan data vektor pada dasarnya heterogen.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Tiga bagian, satu model penyimpanan</h3><p>Format file hibrida mengakui bahwa kolom yang berbeda memiliki pola akses yang berbeda. Bidang skalar bagus untuk pemindaian dan filter. Bidang vektor membutuhkan pencarian tingkat baris yang efisien. Objek mentah seperti video, PDF, gambar, dan file audio termasuk dalam penyimpanan objek, bukan di dalam file data basis data.</p>
<p>Penjajaran ID baris mengakui bahwa kolom-kolom ini mungkin terpisah secara fisik, namun tetap menggambarkan baris logis yang sama. Caption, embedding, vektor jarang, dan URI video mungkin berada dalam file dan format yang berbeda, tetapi mereka masih harus disatukan sebagai satu hasil.</p>
<p>Manifes mengakui bahwa dataset tidak ditulis sekali dan ditinggalkan begitu saja. Dataset ini akan dimodifikasi oleh banyak sistem, di berbagai versi, untuk berbagai tugas. Indeks, statistik, log hapus, referensi objek eksternal, dan grup kolom harus muncul dalam tampilan versi yang sama.</p>
<p><strong>Inilah sebabnya mengapa Loon bukan hanya format file vektor yang lebih cepat.</strong> Format yang lebih cepat membantu pencarian titik, tetapi tidak menyelesaikan evolusi skema atau koordinasi multi-mesin. Penjajaran ID baris memungkinkan kolom yang terpisah berperilaku sebagai tabel tunggal, tetapi tidak menentukan file mana yang termasuk dalam versi saat ini. Manifes dapat mendeskripsikan status kumpulan data, tetapi tanpa kelompok kolom dan penyelarasan ID baris, Manifes tidak dapat dengan jelas merepresentasikan tata letak fisik yang berbeda di dalam satu koleksi logis.</p>
<p>Model penyimpanan membutuhkan ketiganya: format yang berbeda untuk kelompok kolom yang berbeda, ruang ID baris bersama untuk merekonstruksi baris, dan Manifes berversi yang memberi tahu setiap pembaca dan penulis tentang dataset saat ini.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Di mana Loon cocok dengan Milvus dan Zilliz Vector Lakebase</h3><p>Di Milvus, ia menggantikan lapisan penyimpanan binlog segmen lama dengan model yang dibangun di sekitar Manifest, ColumnGroup, format file, dan abstraksi sistem berkas. Di <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (evolusi berikutnya dari Zilliz Cloud)<strong>,</strong> arah yang sama berlaku untuk arsitektur Vector Lakebase: menjaga jalur penyajian basis data vektor tetap cepat sambil membuat data yang mendasarinya lebih mudah untuk dikembangkan, dianalisis, dan dikoordinasikan dengan sistem eksternal.</p>
<p>Komponen Milvus tingkat atas masih mempertahankan peran mereka yang sudah dikenal. Proxy menangani perutean. QueryCoord dan DataCoord menangani penjadwalan. IndexNode membangun indeks. API yang berhadapan dengan aplikasi untuk koleksi, sisipan, pencarian, dan pencarian hibrida tidak perlu mengekspos file Manifes atau ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Perubahannya ada di bawahnya.</p>
<p>DataNode, QueryNode, segcore, pemadatan, dan konektor eksternal dapat beroperasi melalui abstraksi penyimpanan yang sama. Hal ini penting karena kumpulan data tidak lagi ditulis dan hanya dibaca oleh database. Dataset ini dapat diperluas oleh sistem komputasi eksternal dan dikonsumsi oleh pencarian online secara bersamaan.</p>
<p>Pada tingkat tinggi, lapisan-lapisannya terlihat seperti ini:</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Manifes menggambarkan status versi dari kumpulan data. ColumnGroups memetakan koleksi logis ke dalam kelompok-kelompok kolom secara fisik. Lapisan format file memungkinkan setiap ColumnGroup memilih format yang sesuai. Abstraksi sistem berkas bekerja di seluruh penyimpanan objek dan penyimpanan lokal.</p>
<p>Poin pentingnya adalah bahwa format file hibrida, penyelarasan ID baris, dan Manifes bukanlah fitur yang terpisah. Bersama-sama, ketiganya mendefinisikan model penyimpanan.</p>
<p>Dengan adanya model tersebut, kita dapat melihat tiga pilihan desain satu per satu: bagaimana Loon menyimpan ColumnGroup yang berbeda, bagaimana Loon menyelaraskannya kembali ke dalam baris, dan bagaimana Manifest mengubah berkas-berkas tersebut menjadi kumpulan data berversi.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Desain 1: gunakan format file yang tepat untuk grup kolom yang tepat<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Kolom yang berbeda memiliki pola akses yang berbeda. Mereka tidak boleh dipaksakan ke dalam format file yang sama.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon memisahkan koleksi logis ke dalam ColumnGroups.</h3><ul>
<li>Kolom skalar, kolom filter, kunci bisnis, dan kolom statistik sering kali dipindai, difilter, digabungkan, atau digunakan untuk perencanaan kueri. Mereka mendapat manfaat dari kompresi, pemangkasan kolom, dan kompatibilitas ekosistem. Parket sangat cocok untuk kolom-kolom ini.</li>
<li>Vektor padat, vektor jarang, dan fitur peringkat ulang sering kali dibaca setelah pemanggilan kembali ANN berdasarkan ID baris. Mereka membutuhkan akses acak latensi rendah, pembacaan rentang byte yang tepat, dan decoding selektif. Tata letak yang berorientasi pada segmen lebih cocok. Loon menggunakan Vortex ke arah ini.</li>
<li>Objek mentah seperti video, PDF, gambar, dan file audio tidak boleh disematkan ke dalam file data basis data vektor. File-file tersebut harus tetap berada dalam penyimpanan objek. Basis data mencatat referensi, checksum, jenis MIME, versi parser, dan hubungan tingkat baris.</li>
</ul>
<p>Untuk contoh video, tata letak fisik mungkin terlihat seperti ini:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Untuk aplikasi, ini masih merupakan satu koleksi. Untuk lapisan penyimpanan, bagian yang berbeda dari koleksi itu menggunakan format fisik yang berbeda. Hal ini secara langsung mengurangi penulisan ulang yang tidak perlu. Menambahkan <code translate="no">embedding_v2</code> dapat menjadi vektor baru ColumnGroup ditambah dengan sebuah Manifes commit. Hal ini tidak memerlukan penulisan ulang kolom keterangan, metadata skalar, atau kolom penyematan yang sudah ada.</p>
<p>Ide yang sama berlaku untuk vektor jarang, fitur peringkat ulang, atau kolom turunan lainnya. Jika kolom baru dapat berdiri sendiri secara fisik dan disejajarkan dengan ID baris, maka kolom tersebut tidak perlu menyeret kolom yang tidak terkait melalui jalur penulisan ulang yang sama.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon juga mengadaptasi penggunaan format file.</h3><p><strong>Untuk Parket, pengaturan default tidak selalu ideal untuk data vektor yang berat.</strong> Grup baris 64 MB bisa jadi terlalu besar untuk pencarian titik karena pembacaan acak yang kecil dapat menarik lebih banyak data daripada yang dibutuhkan. Loon memperketat kelompok baris menjadi 1 MB pada jalur yang relevan dan menonaktifkan penyandian, seperti penyandian kamus pada kolom vektor, bila tidak membantu data vektor yang terlihat acak.</p>
<p><strong>Untuk Vortex, pekerjaan yang lebih penting adalah tata letak.</strong> Loon menggunakan tata letak yang menyeimbangkan efisiensi pemindaian dan pencarian titik. Dalam kelompok baris, segmen dari kolom terkait dapat ditempatkan berdekatan untuk mendukung pemindaian. Untuk melakukan operasi, pembacaan sub-segmen memungkinkan sistem untuk mengambil hanya byte yang relevan daripada menarik seluruh segmen.</p>
<p><strong>Loon juga mendukung integrasi Lance yang hanya dapat dibaca</strong>, sehingga kumpulan data Lance yang ada dapat dipasang sebagai ColumnGroup ketika kompatibilitas menjadi hal yang penting.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Apa yang ditunjukkan oleh benchmark</h3><p>Dalam satu pengujian lokal, menggunakan satu file dengan 40.000 baris dan skema <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code>, Vortex menunjukkan hasil ini terhadap Parquet dengan kelompok baris 1 MB:</p>
<table>
<thead>
<tr><th>Operasi</th><th>Vortex</th><th>Parket</th><th>Perbedaan</th></tr>
</thead>
<tbody>
<tr><td>Ambil, K = 1000 baris acak</td><td>5,8 ms</td><td>144 ms</td><td>25x lebih cepat</td></tr>
<tr><td>Pemindaian kolom vektor penuh</td><td>21 ms</td><td>142 ms</td><td>6,76x lebih cepat</td></tr>
<tr><td>Ukuran file, ~21 MB data mentah</td><td>6,62 MB</td><td>7,16 MB</td><td>7% lebih kecil</td></tr>
</tbody>
</table>
<p>Hasil <code translate="no">take</code> berasal dari pengurangan jumlah data yang tidak relevan yang harus dibaca dan diterjemahkan. Hasil pemindaian berasal dari kompresi dan pilihan implementasi.</p>
<p>Angka-angka ini harus tetap melekat pada pengaturannya: 8 vCPU Ubuntu 22.04 KVM, sistem berkas lokal, satu berkas, 40.000 baris, kelompok baris 1 MB, dan skema di atas. Pada penyimpanan objek, I/O jaringan dapat mendominasi, sehingga mengurangi amplifikasi pembacaan dapat menjadi lebih penting. Hasil yang sebenarnya tergantung pada bentuk dataset, perilaku penyimpanan objek, status cache, dan pola kueri.</p>
<p>Poin yang lebih luas bukanlah bahwa setiap kolom harus menggunakan Vortex.</p>
<p>Intinya adalah bahwa kumpulan data vektor memerlukan pilihan format file di tingkat ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Desain 2: menyelaraskan file fisik melalui ID baris<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>Format file hibrida menyelesaikan satu masalah: kolom yang berbeda sekarang dapat hidup dalam format yang paling sesuai dengan mereka.</p>
<p>Namun, hal ini menimbulkan masalah kedua. Jika bidang skalar berada di Parquet, vektor berada di Vortex, dan objek mentah berada di penyimpanan objek, bagaimana sistem masih memperlakukannya sebagai satu koleksi?</p>
<p><strong>Loon memecahkan masalah ini dengan penyelarasan ID baris.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">ID Baris adalah sistem koordinat lapisan penyimpanan</h3><p>Setiap ColumnGroupFile fisik mencatat jalur file dan rentang ID baris yang dicakupnya:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>ColumnGroup yang berbeda dapat mencakup ruang ID baris yang sama meskipun berada dalam file dan format yang berbeda.</p>
<p>Untuk ID baris <code translate="no">12345</code>, metadata skalar mungkin berada di dalam ColumnGroup Parket, penyematan mungkin di dalam ColumnGroup Vortex, dan video mentah mungkin diwakili oleh referensi penyimpanan objek. Secara logika, mereka masih satu baris. Hal ini memberikan lapisan penyimpanan sistem koordinat yang stabil.</p>
<p>ID Baris bukanlah kunci utama bisnis. Ini adalah sistem koordinat lapisan penyimpanan yang memungkinkan Loon membagi koleksi secara fisik tanpa kehilangan kemampuan untuk merekonstruksi secara logis.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Kolom baru tidak harus menulis ulang kolom lama</h3><p>Menambahkan <code translate="no">embedding_v2</code> tidak perlu menulis ulang keterangan asli, metadata, atau <code translate="no">embedding_v1</code> ColumnGroups. Loon dapat menulis vektor baru ColumnGroup, mencatat rentang ID baris yang dicakupnya, dan mengomit perubahan tersebut melalui Manifes.</p>
<p>Hal yang sama berlaku untuk vektor yang jarang, fitur peringkat ulang, atau bidang turunan lainnya yang datang kemudian.</p>
<p>Selama ColumnGroup baru mencakup rentang ID baris yang tepat, ia dapat bergabung dengan koleksi logis yang sama tanpa memaksa data yang tidak terkait untuk dipindahkan.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Penghapusan dan pemadatan bisa lebih tepat sasaran</h3><p>Penyelarasan ID baris juga membantu dengan penghapusan.</p>
<p>Penghapusan pertama-tama dapat dinyatakan melalui log penghapusan. Baris menjadi tidak terlihat pada tingkat logis, sementara pembersihan fisik ditunda sampai pemadatan. Ketika pemadatan akhirnya berjalan, ia tidak selalu perlu menulis ulang setiap ColumnGroup yang terkait dengan baris yang terpengaruh. Ia bisa fokus pada ColumnGroup yang perlu dibersihkan.</p>
<p>Hal ini penting karena tidak semua kolom memiliki profil biaya yang sama. Menulis ulang ColumnGroup skalar pendek sangat berbeda dengan menulis ulang ratusan gigabyte vektor padat.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">Pencarian hibrida hanya dapat mengambil kolom yang dibutuhkannya</h3><p>Penyelarasan ID baris juga yang membuat pencarian hibrida menjadi praktis di atas format file hibrida.</p>
<p>Setelah pencarian ANN mengembalikan ID baris kandidat, sistem hanya dapat mengambil kolom yang diperlukan untuk hasil akhir: keterangan, metadata, vektor, fitur peringkat, atau referensi objek.</p>
<p>Sebagai contoh, sebuah kueri mungkin membutuhkan:</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Bidang-bidang tersebut mungkin berada di dalam ColumnGroup yang berbeda. Loon dapat menemukan file yang relevan berdasarkan rentang ID baris, membaca rentang byte yang diperlukan, dan mengumpulkan hasilnya.</p>
<p>Tanpa penyelarasan ID baris, format hibrida hanya akan menjadi file terpisah yang duduk berdampingan. Dengan penyelarasan ID baris, mereka berperilaku sebagai koleksi logis tunggal.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader menyembunyikan pemisahan dari lapisan atas</h3><p>Komponen runtime yang membuat ini dapat digunakan adalah Packed Reader.</p>
<p>Lapisan atas melihat aliran Arrow RecordBatch terpadu. Di bawahnya, data mungkin berasal dari beberapa ColumnGroup dalam format file yang berbeda. Packed Reader menyembunyikan perbedaan-perbedaan tersebut, menyelaraskan data berdasarkan rentang ID baris, dan menjadwalkan I / O multi-file dengan penggunaan memori yang terkontrol.</p>
<p>Ini juga mendukung <code translate="no">take</code> langsung dengan ID baris. Diberikan satu set ID baris, ia menemukan ColumnGroupFiles yang relevan, mengeluarkan pembacaan rentang, dan mengembalikan bidang yang diminta.</p>
<p>Untuk alur kerja video, kueri ANN mungkin memerlukan <code translate="no">caption</code>, <code translate="no">embedding</code>, dan <code translate="no">video_uri</code>. Pembaca yang Dikemas dapat mengambil ColumnGroup skalar dan ColumnGroup vektor tanpa menyentuh kolom yang tidak terkait.</p>
<p>Itulah perbedaan antara "file terpisah" dan "tabel dengan beberapa tata letak fisik."</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Desain 3: Jadikan Manifes sebagai sumber kebenaran<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>Format file hibrida menentukan bagaimana data disimpan secara fisik. Penjajaran ID baris menentukan bagaimana KolomKolom yang terpisah masih membentuk satu tabel logis. Tetapi sistem masih perlu menjawab pertanyaan yang lebih besar: <strong>file, log, statistik, indeks, dan referensi objek mana yang termasuk dalam versi dataset saat ini? Itu adalah tugas Manifes.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Direktori penyimpanan objek tidak cukup</h3><p>Penyimpanan objek bukanlah katalog basis data. Sebuah direktori dapat berisi file lama, file baru, output pekerjaan yang gagal, file sementara, log hapus, file yang masih direferensikan oleh snapshot yang lebih lama, dan file yang menunggu pembersihan. Fakta bahwa sebuah file ada bukan berarti file tersebut termasuk dalam versi kumpulan data saat ini.</p>
<p>Dataset Loon dapat diatur ke dalam direktori seperti:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Tetapi struktur direktori bukanlah sumber kebenaran. Manifes adalah sumber kebenaran. Pembaca tidak boleh membuat daftar direktori dan menyimpulkan status dari file apa pun yang ada. Mereka harus membaca Manifes saat ini dan mengikuti tampilan berversi yang dideklarasikannya.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">Manifes mendefinisikan satu tampilan versi dari dataset</h3><p>Manifes mendefinisikan dataset dalam versi tertentu. Ia mencatat</p>
<ul>
<li>ColumnGroup mana yang ada</li>
<li>rentang ID baris mana yang dicakupnya</li>
<li>format fisik apa yang digunakan oleh setiap ColumnGroup</li>
<li>di mana berkas-berkas itu berada</li>
<li>log penghapusan mana yang aktif</li>
<li>statistik mana yang tersedia</li>
<li>indeks mana yang ada</li>
<li>gumpalan eksternal mana yang direferensikan</li>
<li>kolom dan rentang baris mana yang dicakup oleh statistik atau indeks tersebut</li>
</ul>
<p>Setiap pembaruan menulis versi Manifes yang baru. Pembaca yang membuka versi N akan melihat tampilan dataset yang stabil pada versi N. Penulis dapat menyiapkan versi N+1 tanpa mengganggu pembaca yang masih menggunakan versi N.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Manifes melacak lebih dari sekadar file tabel</h3><p>Di Loon, badan Manifest dikodekan dengan Apache Avro dan diorganisasikan di sekitar empat bagian utama.</p>
<ul>
<li>ColumnGroups mendeskripsikan kolom, format, file, dan rentang ID baris.</li>
<li>DeltaLogs mendeskripsikan penghapusan. Jenis penghapusan yang berbeda mencakup sumber perubahan yang berbeda, seperti penghapusan kunci utama dari klien, penghapusan posisi dari pemadatan internal, atau penghapusan kesetaraan dari mesin eksternal.</li>
<li>Statistik mencakup metadata perencanaan seperti filter bloom, statistik BM25, dan nilai min/max.</li>
<li>Indeks menjelaskan jenis indeks, parameter, kolom yang tercakup, dan rentang ID baris. Ini dapat mencakup indeks vektor seperti HNSW atau IVF, indeks teks, indeks terbalik, indeks bitmap, dan struktur terkait.</li>
</ul>
<p>Di sinilah Loon berbeda dari manifes tabel tradisional.</p>
<p>Dataset vektor tidak hanya perlu melacak file data dan partisi. Dataset ini juga perlu melacak indeks vektor, indeks teks, fitur-fitur yang jarang, log yang dihapus, statistik, referensi objek eksternal, dan rentang ID baris yang menghubungkannya.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">Manifes harus dapat ditulis oleh lebih dari database</h3><p>Bagian yang paling penting bukan hanya apa isi Manifest. Melainkan siapa yang dapat menulisnya.</p>
<ul>
<li>Jika hanya database yang dapat menulis Manifes, maka itu tetap merupakan metadata internal. Metadata yang lebih bersih, tetapi masih bersifat pribadi untuk satu mesin.</li>
<li>Jika mesin eksternal dapat menghasilkan ColumnGroups, statistik, dan entri Manifes baru, Manifes menjadi antarmuka koordinasi.</li>
<li>Sebuah pekerjaan Spark, misalnya, dapat mengisi ulang kolom vektor yang jarang. Ini menulis ColumnGroup baru, mencatat cakupan baris dan statistik, dan membuat Manifest baru. Kueri online dapat terus membaca versi lama selama pekerjaan berlangsung. Setelah komit berhasil, versi baru akan terlihat.</li>
</ul>
<p>Hal ini mirip dengan semangat Iceberg dan Delta Lake, tetapi model objeknya lebih luas. Dataset vektor perlu melacak indeks vektor, indeks teks, fitur yang jarang, menghapus log, statistik, referensi gumpalan, dan rentang ID baris, bukan hanya file tabel dan partisi.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">Komitmen yang optimis menjaga pembaruan versi tetap sederhana</h3><p>Setiap komit menulis versi Manifes yang baru. Seorang penulis dapat membuat konten baru berdasarkan versi N, lalu mencoba menulis <code translate="no">manifest-{N+1}.avro</code>. Penyimpanan objek penulisan bersyarat atau semantik pencocokan-generasi dapat membuat komit gagal jika versi tersebut sudah ada. Penulis kemudian dapat mencoba kembali dengan versi yang lebih baru.</p>
<p>Hal ini memberikan konkurensi yang optimis kepada Loon tanpa memaksa setiap pembaruan melalui jalur koordinasi yang berat dan sangat konsisten. Tanpa Manifest, penyimpanan multi-format dan multi-engine pada akhirnya berubah menjadi konvensi penamaan dan rekonsiliasi manual. Hal ini dapat bekerja untuk kumpulan data yang kecil. Hal ini tidak bekerja untuk data vektor skala TB.</p>
<p>Manifes inilah yang mengubah file heterogen menjadi kumpulan data yang dapat dibaca dan diperbarui dengan aman oleh banyak sistem.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">Apa yang berubah bagi pengguna ketika penyimpanan menjadi berversi<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk pengembang aplikasi, Loon seharusnya tidak menjadi beban API baru.</p>
<p>Pengguna harus tetap bekerja dengan konsep Milvus yang sudah dikenal: koleksi, sisipan, pencarian, dan pencarian hybrid. Mereka seharusnya tidak perlu memikirkan file Manifest, ColumnGroups, rentang ID baris, atau tata letak file selama pengembangan aplikasi normal.</p>
<p>Perubahannya ada di bawahnya. Penyimpanan menjadi lebih sadar akan bagaimana kumpulan data AI benar-benar berkembang.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">Menambahkan penyematan baru seharusnya tidak memindahkan data lama</h3><p>Sebelumnya, menambahkan <code translate="no">embedding_v2</code> ke koleksi yang sudah ada sering kali membutuhkan pengeksporan data, melatih model baru, menghasilkan vektor, dan kemudian mengimpor ulang atau memperbarui koleksi secara massal melalui SDK. Jalur tersebut menciptakan banyak pekerjaan operasional: pelacakan versi, percobaan ulang pekerjaan yang gagal, pembangunan kembali indeks, dampak penyajian, dan pemeriksaan konsistensi.</p>
<p><strong>Dengan Loon, hal ini dapat menjadi evolusi skema ditambah dengan komit ColumnGroup yang baru.</strong> Kolom penyematan yang baru dapat ditulis sebagai ColumnGroup fisiknya sendiri, disejajarkan dengan ID baris, dan dapat dilihat melalui Manifes. Kolom keterangan lama, kolom metadata skalar, dan kolom penyematan asli tidak perlu dipindahkan.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">Pengisian ulang seharusnya tidak memerlukan perulangan pembaruan sisi klien</h3><p>Banyak pembaruan data AI adalah pengisian ulang. Sebuah tim dapat menambahkan vektor yang jarang setelah pencarian hibrida menjadi penting. Tim dapat menambahkan fitur peringkat ulang setelah model baru dilatih. Dapat mengoreksi keterangan setelah ditinjau oleh manusia. Dapat menambahkan tag tata kelola setelah pembaruan kebijakan.</p>
<p>Dalam tata letak tradisional, perubahan ini sering terjadi melalui pembaruan SDK klien atau jalur penulisan khusus basis data, bahkan ketika data dihasilkan oleh Spark, Ray, atau mesin eksternal lainnya.</p>
<p>Dengan Loon, sistem komputasi eksternal dapat menghasilkan ColumnGroups baru dan mengomitnya melalui Manifest. Basis data tidak lagi harus menjadi satu-satunya titik masuk untuk setiap penulisan ulang.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">Analisis offline seharusnya tidak memerlukan salinan lain dari kebenaran</h3><p>Sebelumnya, tim sering kali membuang koleksi online ke dalam Parquet untuk evaluasi atau analisis offline. Hal ini menciptakan dua versi dari kumpulan data yang sama: koleksi online dan salinan analisis. Setelah keterangan dikoreksi, penyematan dibuat ulang, log hapus diterapkan, atau indeks dibangun kembali, tim harus menanyakan salinan mana yang terkini.</p>
<p>Dengan model penyimpanan berbasis Manifes, mesin analisis dapat membaca tampilan set data berversi yang sama dengan sistem penyajian. Mesin analisis dapat memproyeksikan hanya kolom yang mereka butuhkan, memindai hanya rentang baris yang relevan, dan bekerja berdasarkan versi dataset yang dideklarasikan, bukan snapshot yang diekspor secara manual.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Penghapusan dan koreksi hanya menyentuh apa yang berubah</h3><p>Penghapusan, koreksi keterangan, perbaikan label, dan pembaruan tata kelola merupakan hal yang rutin dilakukan dalam set data AI. Mereka tidak boleh memaksa setiap kolom vektor yang panjang melalui jalur penulisan ulang yang sama.</p>
<p>Dengan Loon, menghapus log pertama-tama dapat diperlakukan sebagai penghapusan logis. Pemadatan selanjutnya dapat membersihkan ColumnGroup yang terpengaruh tanpa menulis ulang data yang tidak terkait. Jika bidang teks pendek berubah, lapisan penyimpanan tidak perlu menulis ulang ratusan gigabyte vektor padat hanya karena mereka berbagi baris logis yang sama.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">Mesin eksternal menjadi bagian dari alur kerja, bukan tempat pelarian</h3><p>Pergeseran yang lebih besar adalah bahwa mesin eksternal tidak lagi diperlakukan sebagai sistem di luar basis data vektor.</p>
<p>Spark, Ray, pekerjaan evaluasi, sistem pelabelan, dan pipeline tata kelola sudah menghasilkan dan memodifikasi sebagian besar data. Lapisan penyimpanan harus memungkinkan mereka untuk berkolaborasi di sekitar satu sumber kebenaran daripada terus-menerus mengekspor, menyalin, dan mengimpor ulang.</p>
<p>Itulah yang dimungkinkan oleh versi Manifest. Versi ini memberikan penyajian online, analisis offline, pekerjaan pengisian ulang, dan pemadatan sebuah tampilan bersama dari kumpulan data.</p>
<p>Hal ini mungkin terdengar seperti detail penyimpanan internal, tetapi hal ini memengaruhi seberapa cepat tim dapat melakukan iterasi pada set data AI. Setiap perubahan model, pengisian ulang fitur, koreksi keterangan, filter kualitas, dan pembangunan ulang indeks bergantung pada pertanyaan yang sama: &quot;<strong>Dapatkah sistem memperbarui kumpulan data tanpa memindahkan data yang tidak perlu dipindahkan?&quot;</strong></p>
<p>Itulah nilai praktis dari model penyimpanan.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon tersedia di Milvus 3.0 beta dan Zilliz Vector Lakebase<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon tersedia di <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 beta</a> dan juga merupakan bagian dari lapisan penyimpanan di <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, evolusi berikutnya dari Zilliz Cloud. Dan rilis ini berfokus pada tiga area inti:</p>
<ul>
<li><strong>Manifes.</strong> Tujuannya adalah agar penulisan, pengisian ulang, penghapusan, statistik, dan pembaruan indeks dapat menghasilkan tampilan kumpulan data berversi yang dapat dibuka oleh pembaca secara konsisten. Bagi pembaca, ini berarti sebuah kueri dapat membuka versi Manifes tertentu dan melihat tampilan set data yang stabil. Bagi penulis, ini berarti bahwa file data baru, log hapus, statistik, atau file indeks dapat dipersiapkan terlebih dahulu dan kemudian dibuat terlihat melalui komit berversi.</li>
<li><strong>KolomGroup dan dukungan format.</strong> Parket mendukung kolom skalar dan kolom yang ramah ekosistem. Vortex mendukung pola akses vektor-berat. Lance dapat diintegrasikan dalam mode hanya-baca untuk kompatibilitas dengan kumpulan data Lance yang ada.</li>
<li><strong>Indeks di Lake.</strong> Statistik skalar, indeks pemfilteran, dan indeks terbalik teks dapat berpartisipasi dalam perencanaan berbasis Manifest berdasarkan rentang baris. Indeks vektor asli danau lebih banyak terlibat. HNSW dan IVF memiliki perilaku yang berbeda pada penyimpanan objek, dan HNSW khususnya sensitif terhadap akses acak dan lokalitas cache. HNSW tidak dapat begitu saja menggunakan kembali tata letak yang dirancang untuk SSD lokal dan mengharapkan hasil yang sama.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">Masih ada pekerjaan di depan</h3><ul>
<li><strong>Jalur penulisan eksternal</strong> penting karena Spark dan Ray harus dapat menghasilkan komit ColumnGroups dan Manifest tanpa memaksa setiap penulisan ulang melalui perulangan SDK klien.</li>
<li><strong>Interoperabilitas Lakehouse</strong> penting karena banyak tim yang sudah menggunakan katalog dan mesin kueri seperti <strong>Iceberg, Delta Lake, Trino, DuckDB, dan Athena</strong>. Data vektor harus dapat berpartisipasi dalam ekosistem tersebut tanpa kehilangan kinerja pencarian vektor.</li>
<li><strong>Tata letak indeks</strong> penting karena indeks grafik dan struktur terbalik memiliki pola akses yang berbeda pada penyimpanan objek.</li>
<li><strong>Semantik objek besar</strong> penting karena video mentah, PDF, gambar, dan file audio memerlukan manajemen referensi, pembuatan versi, dan perilaku penghapusan yang selaras dengan kumpulan data vektor yang diturunkan.</li>
</ul>
<p>Perilaku rilis yang tepat, pengaturan default, dan jalur migrasi harus mengikuti <a href="https://docs.zilliz.com/docs/release-notes-2605">catatan rilis</a> Milvus dan <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud</a> yang relevan. Namun, arah penyimpanannya jelas: basis data vektor membutuhkan fondasi asli danau yang berversi di bawah lapisan penyajian.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Coba Loon di bawah Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika tumpukan Anda saat ini memisahkan penayangan online, analisis offline, pengisian ulang, dan alur kerja data lake eksternal ke dalam sistem yang berbeda, Zilliz Vector Lakebase patut dicoba. Anda dapat mencobanya di <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. Pendaftaran email kantor baru mendapatkan kredit gratis $100. Anda juga dipersilakan untuk <a href="https://zilliz.com/contact-sales">berbicara dengan kami</a> tentang kasus penggunaan Anda.</p>
<p>Anda juga bisa mengikuti <a href="https://milvus.io/docs/release_notes.md">rilis Milvus 3.0</a> untuk melihat bagaimana Loon berevolusi dalam mesin sumber terbuka.</p>
<p><strong>Zilliz Vector Lakebase menyatukan:</strong></p>
<ul>
<li>Penyajian berjenjang untuk kinerja real-time yang berbeda dan pertukaran biaya</li>
<li>Pencarian sesuai permintaan untuk beban kerja berskala besar atau eksplorasi tanpa komputasi yang selalu aktif</li>
<li>Pencarian danau data eksternal, sehingga Anda dapat mengindeks dan mencari secara langsung di atas data danau yang ada</li>
<li>Pencarian spektrum penuh di seluruh vektor, teks, JSON, dan data geospasial, dengan pengambilan dan pemeringkatan hibrida</li>
<li>Penyimpanan asli danau terpadu yang dibangun di atas Vortex, format terbuka yang dirancang untuk pembacaan acak yang lebih cepat dan berbiaya lebih rendah pada data yang sangat banyak vektornya</li>
</ul>
