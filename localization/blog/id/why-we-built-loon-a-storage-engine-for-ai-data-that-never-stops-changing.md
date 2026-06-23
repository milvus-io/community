---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >
  Mengapa Kami Mengembangkan Loon: Mesin Penyimpanan untuk Data AI yang Terus
  Berubah.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  Loon adalah mesin penyimpanan baru untuk Milvus 3.0 dan Zilliz Vector
  Lakebase, yang dirancang untuk mengelola kumpulan data vektor yang terus
  berkembang dengan fitur ColumnGroups, penyelarasan ID baris, dan Manifests.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Blog ini awalnya diterbitkan di zilliz.com dan telah diterbitkan ulang dengan izin.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Poin-poin utama<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Ini adalah pembahasan teknis yang panjang dan mendalam, jadi berikut adalah poin-poin utamanya sebelum kita masuk ke detailnya.</p>
<ul>
<li>Kumpulan data AI bukanlah tabel statis. Baris yang sama terus berubah seiring tim mengganti model embedding, menambahkan vektor spars, merevisi keterangan, mengisi ulang label, membangun kembali indeks, dan menjalankan analisis offline.</li>
<li>Tata letak penyimpanan tradisional memiliki tiga kelemahan: kolom vektor yang panjang membuat pengisian ulang menjadi mahal, format file tunggal tidak dapat melayani pemindaian dan pembacaan titik dengan baik, serta penyimpanan basis data pribadi memaksa pipa eksternal untuk membuat salinan tambahan dari data asli.</li>
<li>Loon adalah mesin penyimpanan baru untuk Milvus dan Zilliz Vector Lakebase. Mesin ini dibangun berdasarkan format file hibrida, penyelarasan ID baris, dan Manifest yang mendefinisikan status versi dataset.</li>
<li>Tujuannya adalah memungkinkan satu set data vektor untuk mendukung pencarian online, analisis offline, pengisian ulang, pemadatan, dan komputasi eksternal tanpa harus terus-menerus menyalin, menulis ulang, atau mengimpor ulang data.</li>
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
    </button></h2><p>Selama beberapa waktu, ada satu argumen yang menentang basis data vektor yang terdengar masuk akal.</p>
<p><em>Database tradisional sudah menyimpan bilangan bulat, string, JSON, blob, dan indeks. Mengapa tidak menambahkan</em> <em>tipe</em><em>"</em> <code translate="no">_vector_</code> <em>", membangun indeks ANN di sampingnya, dan selesai?</em></p>
<p>Untuk pencarian semantik awal, hal itu cukup berhasil. Kolom vektor ditambah indeks dapat mendukung demo, aplikasi RAG kecil, atau fitur pencarian internal. Masalahnya muncul kemudian, ketika dataset mulai berperilaku tidak lagi seperti tabel, melainkan lebih seperti sistem data AI.</p>
<p>Kumpulan data vektor produksi memiliki baris, kunci utama, bidang skalar, dan kolom yang dapat diquery. Dalam hal ini, kumpulan data tersebut tampak seperti tabel basis data. Namun, dataset tersebut juga memiliki skala dan bentuk alur kerja seperti data lake. Dataset tersebut mungkin berisi ratusan juta catatan. Dataset tersebut berulang kali dibaca dan ditulis ulang oleh Spark, Ray, DuckDB, pipeline pelatihan, pekerjaan evaluasi, dan sistem kualitas data.</p>
<p>Kumpulan data ini juga bergantung pada penyimpanan objek. Objek sumbernya seringkali berupa video, gambar, PDF, file audio, atau dokumen web yang tetap tersimpan di S3, GCS, OSS, atau penyimpanan objek lainnya. Database ini menyimpan referensi, metadata, fitur turunan, dan indeks. Kemudian, database ini menambahkan elemen-elemen yang tidak dirancang untuk dikelola oleh model penyimpanan tradisional sebagai objek utama: embedding padat, vektor langka, keterangan, indeks vektor, indeks teks, log penghapusan, statistik, versi model, versi parser, referensi blob eksternal, serta hubungan versi di antara semuanya.</p>
<p><strong>Di sinilah pendekatan “cukup tambahkan kolom vektor” mulai menemui kendala.</strong> Masalahnya bukanlah apakah sebuah basis data dapat menyimpan byte vektor. Banyak sistem yang mampu melakukannya. Pertanyaan yang lebih sulit adalah <strong>apakah model penyimpanan tersebut mampu menangani bagaimana data vektor berubah, bagaimana data tersebut di-query, dan bagaimana data tersebut dibagikan di seluruh tumpukan data AI.</strong></p>
<p><strong>Inilah alasan kami membangun Loon, mesin penyimpanan baru untuk Milvus dan</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(evolusi selanjutnya dari Zilliz Cloud).</strong></p>
<p>Loon dirancang berdasarkan tiga gagasan:</p>
<ol>
<li>Gunakan format fisik yang berbeda untuk jenis kolom yang berbeda.</li>
<li>Selaraskan kolom-kolom tersebut melalui ruang ID baris bersama.</li>
<li>Gunakan Manifest untuk mendefinisikan status versi dataset.</li>
</ol>
<p>Untuk memahami mengapa elemen-elemen tersebut penting, mari kita mulai dengan alur kerja multimodal yang umum.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Kumpulan data vektor sebenarnya tidak pernah benar-benar selesai.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Bayangkan sebuah tim AI sedang membangun dataset video untuk pelatihan multimodal.</p>
<p>Sebuah video berdurasi panjang diunggah ke penyimpanan objek. Sebuah pipeline memotongnya menjadi klip-klip berdasarkan perubahan adegan, batas pengambilan gambar, atau rentang waktu. Klip yang terlalu panjang atau terlalu pendek, buram, duplikat, atau berkualitas rendah disaring. Klip yang tersisa dinilai oleh model estetika, diberi keterangan oleh model lain, disematkan oleh model visi-bahasa, dan disimpan dalam basis data vektor untuk pencarian, deduplikasi, dan penyaringan data pelatihan.</p>
<p>Secara umum, alur kerja ini terlihat sederhana:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Namun, dataset tersebut tidak langsung tersedia dalam bentuk yang lengkap.</p>
<ul>
<li>Pada minggu pertama, tabel mungkin hanya berisi <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code>, dan <code translate="no">duration</code>.</li>
<li>Pada minggu kedua, tim menambahkan <code translate="no">aesthetic_score</code>.</li>
<li>Pada minggu ketiga, model penulisan teks dijalankan, dan setiap klip mendapatkan <code translate="no">caption</code>.</li>
<li>Pada minggu keempat, model embedding pertama mulai beroperasi, dan setiap klip mendapatkan embedding CLIP berdimensi 768.</li>
<li>Sebulan kemudian, tim mengganti model dan mengisi ulang <code translate="no">embedding_v2</code>, kini dengan 1024 dimensi.</li>
<li>Dua bulan kemudian, pencarian hibrida menjadi suatu keharusan, sehingga tim menambahkan kolom vektor spars.</li>
<li>Tiga bulan kemudian, keterangan video ditinjau oleh manusia dan harus diperbaiki di tempat.</li>
</ul>
<p>Kumpulan data tersebut tidak pernah selesai. Kumpulan data tersebut terus menumpuk interpretasi baru dari baris yang sama.</p>
<p>Itulah salah satu perbedaan inti antara data vektor dan data bisnis tradisional. Baris yang sama diproses ulang berulang kali. Dan skala mengubah hal ini dari ketidaknyamanan menjadi masalah penyimpanan: dataset multimodal seringkali bukan jutaan catatan, melainkan ratusan juta atau miliaran. LAION-5B merupakan referensi yang berguna untuk gambaran tersebut — miliaran pasangan gambar-teks, masing-masing dilengkapi dengan metadata, keterangan, dan embedding. Jadi, bagian yang sulit bukanlah penyisipan pertama. Bagian yang sulit adalah segala hal yang terjadi setelah dataset mulai berkembang. <strong>Perkembangan tersebut mengungkap tiga masalah.</strong></p>
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
    </button></h2><p>Format kolom seperti Parquet sangat cocok untuk banyak beban kerja analitis. Format ini bekerja dengan baik ketika skema cukup stabil, data lebih sering dibaca daripada ditulis ulang, pemindaian hanya menyentuh sebagian kolom, dan kompresi menjadi penting. Itulah dunia di mana banyak format analitis dioptimalkan.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Baris vektor jauh lebih lebar daripada baris analitis</h3><p>TPC-H <code translate="no">lineitem</code> adalah patokan yang baik. TPC-H memiliki 16 kolom: kunci bilangan bulat, nilai desimal, tanggal, string pendek, dan bidang komentar kecil. Satu baris yang tidak terkompresi berukuran sekitar 150 byte. Setelah dikompresi, ukurannya bisa jauh lebih kecil. Dengan kelompok baris berukuran 64 MB, sistem penyimpanan dapat mengemas ratusan ribu baris ke dalam satu kelompok.</p>
<p><strong>Kumpulan data vektor tidak terlihat seperti itu.</strong></p>
<p>Kumpulan data gambar-teks bergaya LAION jauh lebih mirip dengan apa yang dihasilkan oleh banyak alur kerja AI saat ini. Setiap baris masih memiliki metadata biasa: URL, keterangan, lebar, tinggi, skor kualitas, label, dan sebagainya. Namun, begitu embedding ditambahkan, bentuk fisik baris tersebut berubah.</p>
<p>Vektor CLIP berdimensi 768 membutuhkan ruang sekitar 1,5 KB dalam format fp16 atau 3 KB dalam format fp32. Satu kolom tersebut bisa jauh lebih besar daripada satu baris TPC-H <code translate="no">lineitem</code> secara keseluruhan.</p>
<p>Dan 768 dimensi bukanlah hal yang tidak biasa atau besar menurut standar saat ini. Embedding berdimensi 1024 atau 2048 umum ditemukan dalam pipeline multimodal. Model OpenAI “ <code translate="no">text-embedding-3-large</code> ” mencapai 3072 dimensi, yang setara dengan sekitar 12 KB per vektor dalam format fp32.</p>
<p>Perbandingannya sangat mencolok:</p>
<table>
<thead>
<tr><th>Bentuk dataset</th><th>Perkiraan ukuran baris</th><th>Apa yang mendominasi baris</th></tr>
</thead>
<tbody>
<tr><td>TPC-H lineitem</td><td>~150 byte tanpa kompresi</td><td>bidang skalar dan string pendek</td></tr>
<tr><td>Baris bergaya LAION dengan vektor fp16 berdimensi 768</td><td>~1,5 KB+</td><td>penyisipan</td></tr>
<tr><td>baris gaya LAION dengan vektor fp32 berdimensi 768</td><td>~3 KB+</td><td>penyisipan</td></tr>
<tr><td>Baris dengan vektor fp32 berdimensi 3072</td><td>~12 KB+ hanya untuk vektornya saja</td><td>penyisipan</td></tr>
</tbody>
</table>
<p>Dalam banyak dataset AI, kolom vektor bukan sekadar bidang biasa. Secara fisik, kolom tersebut mencakup sebagian besar baris. Hal ini mengubah biaya evolusi skema.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">Menambahkan satu kolom vektor bisa berarti ratusan gigabyte</h3><p>Misalkan sebuah dataset memiliki 100 juta klip video. Menambahkan kolom embedding fp32 berdimensi 1024 baru berarti menulis sekitar 400 GB data vektor mentah. Itu belum termasuk statistik, indeks, pembaruan metadata, overhead penyimpanan objek, validasi, atau integrasi jalur penyajian.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Jika tim menambahkan satu atau dua kolom serupa vektor setiap bulan, seperti fitur " <code translate="no">embedding_v2</code>", " <code translate="no">sparse_vector</code>", atau "rerank", evolusi skema menjadi tugas rekayasa data berulang yang diukur dalam ratusan gigabyte atau terabyte.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">Pembaruan logis kecil dapat memicu penulisan ulang fisik yang besar</h3><p>Pembaruan sama pentingnya.</p>
<p>Dalam sistem kolom, data lama biasanya tidak diperbarui di tempat. Log penghapusan mencatat apa yang berubah, dan pemadatan kemudian menulis ulang baris aktif ke dalam file baru. Model tersebut dapat dikelola jika barisnya kecil.</p>
<p>Dengan data vektor, pembaruan logis kecil dapat memicu penulisan ulang fisik yang besar.</p>
<p>Tugas peninjauan oleh manusia mungkin hanya memperbaiki beberapa ratus byte dalam sebuah keterangan. Namun, jika keterangan, vektor padat, vektor jarang, dan fitur turunan lainnya berbagi siklus hidup berkas fisik yang sama, sistem mungkin akhirnya menulis ulang vektor-vektor tersebut juga. Perubahan logisnya kecil. I/O fisiknya bisa sangat besar.</p>
<p>Inilah masalah amplifikasi penulisan dalam penyimpanan vektor. Bagian yang mahal bukan hanya karena vektor berukuran besar. Melainkan karena bidang turunan yang besar dan bidang yang dapat diubah berukuran kecil sering kali terikat bersama oleh tata letak penyimpanan yang memperlakukannya sebagai satu kesatuan.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Untuk dataset AI, backfill merupakan beban kerja rutin</h3><p>Untuk tabel analitik tradisional, evolusi skema mungkin hanya terjadi sesekali. Untuk dataset AI, hal ini merupakan rutinitas. Model caption ditingkatkan. Model embedding diganti. Vektor langka ditambahkan kemudian. Fitur rerank muncul. Label manusia dikoreksi. Tag tata kelola diisi ulang. Indeks dibangun ulang.</p>
<p>Operasi-operasi ini bukan sekadar penambahan sederhana. Operasi-operasi ini sering kali memodifikasi atau memperluas baris yang sudah ada.</p>
<p>Itulah mengapa penyimpanan vektor tidak hanya dapat mengoptimalkan throughput pemindaian. Penyimpanan vektor juga harus membuat pengisian ulang dan pembaruan parsial menjadi lebih murah.</p>
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
    </button></h2><p>Setelah data ditulis, jalur pembacaan terpecah. Kumpulan data vektor yang sama biasanya memiliki dua pola akses yang berbeda: <strong>pemindaian analitis dan pembacaan titik.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">Beban kerja analitis membutuhkan pemindaian yang luas dan terkompresi</h3><p>Sebuah pipa mungkin menjalankan filter seperti:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Atau mungkin menjalankan analisis offline, evaluasi embedding penuh, statistik BM25, konstruksi bitmap, pemeriksaan kualitas data, penghitungan, dan pengelompokan.</p>
<p>Pola ini membaca banyak baris tetapi hanya beberapa kolom. Pola ini cocok dengan I/O sekuensial, kelompok baris yang lebih besar, kompresi, pemangkasan kolom, decoding batch, dan eksekusi vektorisasi.</p>
<p>Kelompok baris yang besar sangat membantu dalam hal ini. Kelompok baris tersebut memungkinkan satu permintaan I/O menarik sejumlah besar data yang berguna, meningkatkan efisiensi kompresi, dan menyediakan mesin eksekusi dengan data berurutan yang cukup untuk mengamortisasi overhead. Ketika beberapa kolom dibaca bersamaan, mengaturnya agar tetap terorganisir untuk throughput pemindaian juga membantu mengurangi cache miss selama eksekusi vektorisasi.</p>
<p>Parquet unggul dalam hal ini.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">Hasil ANN memerlukan pencarian tingkat baris yang sempit</h3><p>Setelah pencarian ANN mengembalikan ID baris kandidat, sistem sering kali perlu mengambil bidang-bidang seperti:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Pola ini membaca lebih sedikit baris, seringkali ratusan atau ribuan, tetapi memerlukan akses yang tepat berdasarkan ID baris. Pola ini ingin menemukan baris dan kolom tertentu, mengambil hanya rentang byte yang diperlukan, dan menghindari pengambilan seluruh kelompok baris hanya untuk mengambil beberapa catatan.</p>
<p>Pencarian titik memiliki preferensi yang hampir berlawanan dalam hal pemindaian. Ia menginginkan granularitas pembacaan yang lebih kecil. Idealnya, lapisan penyimpanan dapat menemukan segmen atau rentang byte yang relevan berdasarkan ID baris, hanya membaca rentang tersebut, dan mendekode hanya data yang diperlukan untuk hasil.</p>
<p>Kompresi juga memiliki tradeoff yang berbeda. Untuk pemindaian, kompresi yang lebih berat sering kali sepadan karena sistem membaca banyak data dan menghemat I/O. Untuk pencarian titik, kompresi dapat menjadi beban jika mengambil satu baris memerlukan dekode blok terkompresi yang jauh lebih besar.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Satu tata letak tidak dapat mengoptimalkan kedua jalur tersebut</h3><p>Inilah konflik utamanya. Penyaringan skalar dan analitik menginginkan tata letak yang luas, terkompresi, dan ramah pemindaian. Pencarian vektor menginginkan tata letak yang sempit, tepat, dan dapat dialamatkan per baris.</p>
<p>Satu format file dapat mendukung keduanya sampai batas tertentu, tetapi tidak dapat menjadi yang optimal untuk keduanya secara bersamaan.</p>
<p>Jika semua kolom disimpan dalam Parquet, pemindaian skalar berjalan lancar. Namun, pencarian ANN setelah pemanggilan ulang menjadi lebih sulit. Sistem mungkin hanya memerlukan beberapa ratus vektor, keterangan, atau catatan metadata, sementara lapisan penyimpanan mungkin harus membaca kelompok baris besar yang sebagian besar berisi baris yang tidak relevan.</p>
<p>Pada SSD lokal, cache dan mmap dapat menyembunyikan sebagian biaya ini. Begitu data disimpan di penyimpanan objek, biayanya menjadi lebih terlihat. Setiap kegagalan cache dapat berubah menjadi pembacaan rentang jarak jauh. Jika baris kandidat tersebar di banyak kelompok baris, satu kueri dapat memicu beberapa pembacaan, masing-masing menarik lebih banyak data daripada yang dibutuhkan kueri. Dalam tata letak yang buruk, mengambil 1.000 baris kandidat dapat dengan mudah mengakibatkan puluhan atau ratusan megabita I/O yang tidak perlu, dan dalam kasus ekstrem, jauh lebih banyak lagi.</p>
<p>Membuat kelompok baris lebih kecil membantu pencarian titik, tetapi merugikan pemindaian. Terlalu banyak fragmen kecil mengurangi efisiensi kompresi, meningkatkan beban metadata, dan mengganggu pembacaan berurutan panjang yang diandalkan oleh mesin analitik.</p>
<p><strong>Jadi, masalahnya bukanlah menemukan ukuran kelompok baris ajaib yang tepat. Masalahnya adalah bahwa kumpulan data yang sama diminta untuk berperilaku seperti dua sistem penyimpanan yang berbeda.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">Pencarian hibrida memaksa kedua jalur tersebut menjadi satu kueri</h3><p>Pencarian hibrida membuat konflik ini semakin sulit untuk diabaikan. Sebuah kueri tunggal mungkin pertama-tama menerapkan filter skalar:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian menjalankan pencarian ANN.</p>
<p>Kemudian mengambil keterangan, vektor, dan metadata berdasarkan ID baris.</p>
<p>Bagi pengguna, ini adalah satu permintaan pencarian. Bagi lapisan penyimpanan, ini merupakan pemindaian analitis sekaligus pencarian acak dengan latensi rendah.</p>
<p>Itulah mengapa penyimpanan vektor membutuhkan lebih dari sekadar pengaturan Parquet yang lebih baik. Ia membutuhkan cara untuk menempatkan kolom-kolom yang berbeda sesuai dengan cara mereka sebenarnya dibaca.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">Masalah ketiga: dataset tidak berada di dalam satu mesin<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Dua masalah pertama terjadi di dalam database. Masalah ketiga terjadi di perbatasan antar sistem.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">Pipa data AI mencakup banyak sistem</h3><p>Dalam alur kerja video, sangat sedikit yang terjadi di dalam basis data vektor itu sendiri.</p>
<p>Video mentah disimpan di penyimpanan objek. Pembuatan klip mungkin dijalankan di Spark atau Ray. Penilaian estetika mungkin dijalankan di layanan GPU. Pembuatan teks mungkin dijalankan di pipa inferensi LLM. Embedding mungkin dihasilkan oleh pekerjaan GPU lainnya. Vektor spars mungkin berasal dari layanan SPLADE. Evaluasi offline, penyaringan data pelatihan, tinjauan manusia, dan tugas tata kelola mungkin semuanya dijalankan di tempat lain.</p>
<p>Database vektor melayani pencarian online, tetapi dataset diproduksi, dikoreksi, dievaluasi, dan diperluas oleh banyak sistem.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">Format penyimpanan pribadi menciptakan banyak salinan dari data asli</h3><p>Jika basis data menggunakan format fisik pribadi yang hanya dapat dibaca dan ditulis olehnya sendiri, setiap pekerjaan eksternal memerlukan ekspor, konversi, penyalinan, dan impor. Koleksi yang sama mungkin ada di basis data, di direktori sementara Spark, di hasil evaluasi, dan di direktori backfill lokal. Maka, pertanyaan sebenarnya menjadi:</p>
<ul>
<li>Salinan mana yang merupakan sumber kebenaran?</li>
<li>Manakah yang berisi model keterangan dari bulan lalu?</li>
<li>Baris mana yang sudah dikoreksi melalui tinjauan manusia?</li>
<li>Kolom vektor langka mana yang dihasilkan oleh model mana?</li>
<li>Indeks vektor mana yang masih valid setelah backfill?</li>
<li>Objek video asli mana yang dirujuk oleh baris ini?</li>
</ul>
<p>Dalam skala kecil, tim terkadang dapat bertahan dengan konvensi penamaan dan pemeriksaan manual. Dengan ratusan juta baris dan terabyte embedding, hal ini menjadi masalah konsistensi.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Kumpulan data vektor memerlukan status versi bersama</h3><p>Sistem Lakehouse telah mengatasi versi masalah ini untuk data terstruktur. Iceberg, Delta Lake, dan Hudi tidak hanya sekadar menyimpan file. Kontribusi inti mereka adalah memungkinkan berbagai mesin berkoordinasi berdasarkan status tabel yang sama.</p>
<p>Database vektor kini membutuhkan kemampuan serupa, tetapi statusnya lebih kompleks. Status tersebut tidak hanya harus mencakup file tabel dan partisi, tetapi juga indeks vektor, indeks teks, fitur spars, log penghapusan, statistik, rentang ID baris, dan referensi ke blob eksternal.</p>
<p>Pertanyaannya bukan sekadar, “Apakah Spark dapat membaca file Milvus?”</p>
<p>Pertanyaannya adalah, setelah Spark mengisi kolom vektor yang jarang, bagaimana Milvus mengetahui versi mana yang dimiliki kolom tersebut, baris mana yang dicakupnya, model mana yang menghasilkannya, dan kapan kueri online dapat menggunakannya dengan aman?</p>
<p>Jawabannya harus terdapat dalam model penyimpanan.</p>
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
    </button></h2><p>Sangat menggoda untuk memperlakukan hal-hal ini sebagai tiga masalah teknik yang terpisah.</p>
<ul>
<li>Amplifikasi penulisan? Tambahkan pengelompokan.</li>
<li>Pembacaan titik? Tambahkan cache.</li>
<li>Sistem eksternal? Tambahkan alat ekspor dan impor.</li>
</ul>
<p>Patch-patch tersebut dapat membantu, tetapi tidak mengatasi masalah mendasar: dataset vektor secara fisik bersifat heterogen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam contoh video, <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code>, dan <code translate="no">aesthetic_score</code> adalah bidang skalar pendek. Mereka berguna untuk penyaringan dan analisis.</p>
<ul>
<li><code translate="no">caption</code> adalah teks. Teks ini dapat digunakan untuk BM25, tinjauan, koreksi, dan pengisian ulang.</li>
<li><code translate="no">embedding</code> adalah vektor panjang dan padat. Vektor ini digunakan untuk penghitungan recall Jaringan Saraf Tiruan (ANN) dan kemudian untuk pencarian tingkat baris atau penentuan peringkat ulang.</li>
<li><code translate="no">embedding_v2</code> adalah keluaran model baru, yang sering kali diisi ulang (backfill) jauh setelah data asli dimasukkan.</li>
<li><code translate="no">sparse_vector</code> mendukung pencarian hibrida dan memiliki pola aksesnya sendiri.</li>
<li>Video mentah harus tetap berada di penyimpanan objek. Basis data harus menyimpan referensi, checksum, tipe MIME, versi parser, dan hubungan tingkat baris.</li>
<li>Indeks vektor, indeks teks, statistik, dan log penghapusan adalah objek turunan dengan semantik versi tersendiri.</li>
</ul>
<p>Objek-objek ini berbagi baris logis, tetapi tidak harus semuanya berbagi tata letak fisik atau siklus hidup yang sama.</p>
<ul>
<li>Jika dipaksa ke dalam satu tata letak tabel biasa, pembaruan menjadi mahal.</li>
<li>Jika dipaksakan ke dalam satu format file kolom, pembacaan titik menjadi mahal.</li>
<li>Jika mereka diperlakukan sebagai file objek yang tidak terkait, pengelolaan versi menjadi rentan.</li>
</ul>
<p>Jadi, model penyimpanan harus dimulai dari fakta bahwa kumpulan data bersifat heterogen.</p>
<p><strong>Hal ini mengarah pada tiga persyaratan desain:</strong></p>
<ul>
<li>Pertama, kelompok kolom yang berbeda harus disimpan dalam format fisik yang berbeda.</li>
<li>Kedua, kelompok kolom tersebut memerlukan ruang ID baris bersama, sehingga mereka tetap dapat berperilaku sebagai satu tabel logis.</li>
<li>Ketiga, dataset memerlukan Manifest berversi yang menyatakan file, indeks, log, statistik, dan referensi objek mana yang termasuk dalam tampilan saat ini.</li>
</ul>
<p><strong>Inilah desain di balik Loon, mesin penyimpanan baru kami yang mendukung Milvus dan Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: mesin penyimpanan di balik Milvus dan Zilliz Cloud untuk dataset vektor yang terus berkembang<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk mengatasi semua masalah di atas, kami mengembangkan <strong>Loon</strong>, mesin penyimpanan baru untuk Milvus dan <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (evolusi selanjutnya dari Zilliz Cloud), yang dirancang untuk dataset vektor yang terus berkembang.</p>
<p>Nama ini mengikuti tradisi penamaan burung khas Zilliz. Loon adalah burung penyelam yang hidup di danau, yang sangat sesuai dengan tujuan sistem ini: sebuah basis data vektor seharusnya tidak perlu memindahkan, memindai, atau menulis ulang seluruh danau data setiap kali menjalankan kueri, mengisi ulang kolom, atau membangun indeks. Sistem tersebut harus terlebih dahulu memahami versi dataset saat ini, termasuk kolom, indeks, statistik, log penghapusan, dan referensi objeknya, kemudian hanya membaca bagian yang benar-benar dibutuhkan.</p>
<p>Format file hibrida, penyelarasan ID baris, dan Manifest bukanlah tiga fitur yang terpisah. Ketiganya berasal dari asumsi desain yang sama: kumpulan data vektor pada dasarnya bersifat heterogen.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Tiga bagian, satu model penyimpanan</h3><p>Format file hibrida mengakui bahwa kolom yang berbeda memiliki pola akses yang berbeda. Bidang skalar cocok untuk pemindaian dan penyaringan. Bidang vektor memerlukan pencarian tingkat baris yang efisien. Objek mentah seperti video, PDF, gambar, dan file audio sebaiknya disimpan di penyimpanan objek, bukan di dalam file data basis data.</p>
<p>Penyelarasan ID baris mengakui bahwa kolom-kolom ini mungkin terpisah secara fisik, tetapi tetap menggambarkan baris logis yang sama. Keterangan, embedding, vektor langka, dan URI video mungkin berada di berkas dan format yang berbeda, tetapi tetap perlu digabungkan kembali sebagai satu hasil.</p>
<p>Manifest mengakui bahwa dataset tidak ditulis sekali lalu dibiarkan begitu saja. Dataset akan dimodifikasi oleh berbagai sistem, melintasi berbagai versi, untuk berbagai tugas. Indeks, statistik, log penghapusan, referensi objek eksternal, dan kelompok kolom harus semuanya muncul dalam tampilan berversi yang sama.</p>
<p><strong>Inilah mengapa Loon bukan sekadar format file vektor yang lebih cepat.</strong> Format yang lebih cepat memang membantu pencarian titik, tetapi tidak menyelesaikan masalah evolusi skema atau koordinasi multi-mesin. Penyelarasan ID baris memungkinkan kolom yang terpisah berperilaku seperti satu tabel, tetapi tidak menentukan file mana yang termasuk dalam versi saat ini. Sebuah Manifest dapat mendeskripsikan keadaan dataset, tetapi tanpa kelompok kolom dan penyelarasan ID baris, Manifest tersebut tidak dapat secara jelas merepresentasikan tata letak fisik yang berbeda di dalam satu koleksi logis.</p>
<p>Model penyimpanan memerlukan ketiga hal tersebut: format yang berbeda untuk kelompok kolom yang berbeda, ruang ID baris bersama untuk merekonstruksi baris, dan Manifest berversi yang memberi tahu setiap pembaca dan penulis tentang kondisi dataset saat ini.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Di mana Loon berperan dalam Milvus dan Zilliz Vector Lakebase</h3><p>Di Milvus, model ini menggantikan lapisan penyimpanan binlog segmen lama dengan model yang dibangun di sekitar Manifest, ColumnGroup, format file, dan abstraksi sistem berkas. Di <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (evolusi selanjutnya dari Zilliz Cloud)<strong>,</strong> arah yang sama diterapkan pada arsitektur Vector Lakebase: menjaga jalur penyajian basis data vektor tetap cepat sambil membuat data di bawahnya lebih mudah untuk dikembangkan, dianalisis, dan dikoordinasikan dengan sistem eksternal.</p>
<p>Komponen Milvus tingkat atas tetap mempertahankan peran yang sudah dikenal. Proxy menangani perutean. QueryCoord dan DataCoord menangani penjadwalan. IndexNode membangun indeks. API yang berhadapan dengan aplikasi untuk pengumpulan, penyisipan, pencarian, dan pencarian hibrida tidak perlu mengekspos file Manifest atau ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Perubahan terjadi di tingkat yang lebih dalam.</p>
<p>DataNode, QueryNode, segcore, pemadatan, dan konektor eksternal dapat beroperasi melalui abstraksi penyimpanan yang sama. Hal ini penting karena kumpulan data tidak lagi hanya ditulis dan dibaca oleh basis data. Kumpulan data tersebut dapat diperluas oleh sistem komputasi eksternal dan digunakan oleh pencarian daring secara bersamaan.</p>
<p>Secara umum, lapisan-lapisan tersebut terlihat seperti ini:</p>
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
<p>Manifest mendeskripsikan status dataset yang telah diberi versi. ColumnGroups memetakan koleksi logis ke dalam kelompok kolom fisik. Lapisan format file memungkinkan setiap ColumnGroup memilih format yang sesuai. Abstraksi sistem file berfungsi di seluruh penyimpanan objek dan penyimpanan lokal.</p>
<p>Poin pentingnya adalah bahwa format file hibrida, penyelarasan ID baris, dan Manifest bukanlah fitur-fitur yang terpisah. Bersama-sama, ketiganya mendefinisikan model penyimpanan.</p>
<p>Dengan model tersebut, kita dapat melihat tiga pilihan desain satu per satu: bagaimana Loon menyimpan ColumnGroups yang berbeda, bagaimana Loon menyelaraskan kembali ColumnGroups tersebut ke dalam baris, dan bagaimana Manifest mengubah file-file tersebut menjadi dataset berversi.</p>
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
    </button></h2><p>Kolom yang berbeda memiliki pola akses yang berbeda pula. Kolom-kolom tersebut tidak boleh dipaksakan ke dalam format file yang sama.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon memisahkan kumpulan logis menjadi ColumnGroups.</h3><ul>
<li>Kolom skalar, kolom filter, kunci bisnis, dan kolom statistik sering kali dipindai, difilter, diagregasi, atau digunakan untuk perencanaan kueri. Kolom-kolom ini mendapat manfaat dari kompresi, pemangkasan kolom, dan kompatibilitas ekosistem. Parquet sangat cocok untuk kolom-kolom ini.</li>
<li>Vektor padat, vektor jarang, dan fitur rerank sering dibaca setelah pemanggilan ANN berdasarkan ID baris. Kolom-kolom ini memerlukan akses acak dengan latensi rendah, pembacaan rentang byte yang presisi, dan dekoding selektif. Tata letak berorientasi segmen lebih cocok. Loon menggunakan Vortex untuk tujuan ini.</li>
<li>Objek mentah seperti video, PDF, gambar, dan file audio tidak boleh disematkan ke dalam file data basis data vektor. Objek-objek tersebut harus tetap berada di penyimpanan objek. Basis data mencatat referensi, checksum, tipe MIME, versi parser, dan hubungan tingkat baris.</li>
</ul>
<p>Untuk contoh video, tata letak fisiknya mungkin terlihat seperti ini:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Bagi aplikasi, ini tetap merupakan satu koleksi. Bagi lapisan penyimpanan, bagian-bagian berbeda dari koleksi tersebut menggunakan format fisik yang berbeda. Hal ini secara langsung mengurangi penulisan ulang yang tidak perlu. Menambahkan " <code translate="no">embedding_v2</code> " dapat menjadi ColumnGroup vektor baru ditambah commit Manifest. Hal ini tidak memerlukan penulisan ulang kolom keterangan, metadata skalar, atau kolom embedding yang sudah ada.</p>
<p>Ide yang sama berlaku untuk vektor spars, fitur rerank, atau bidang turunan lainnya. Jika kolom baru dapat bersifat independen secara fisik dan diselaraskan berdasarkan ID baris, kolom tersebut tidak perlu menyeret kolom yang tidak terkait melalui jalur penulisan ulang yang sama.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon juga menyesuaikan penggunaan format file.</h3><p><strong>Untuk Parquet, pengaturan default tidak selalu ideal untuk data yang sarat vektor.</strong> Grup baris berukuran 64 MB bisa terlalu besar untuk pencarian titik karena pembacaan acak kecil mungkin menarik data jauh lebih banyak daripada yang dibutuhkan. Loon memperketat ukuran grup baris menjadi 1 MB pada jalur yang relevan dan menonaktifkan pengkodean, seperti pengkodean kamus pada kolom vektor, ketika pengkodean tersebut tidak membantu data vektor yang tersebar secara acak.</p>
<p><strong>Untuk Vortex, aspek yang lebih penting adalah tata letak.</strong> Loon menggunakan tata letak yang menyeimbangkan efisiensi pemindaian dan pencarian titik. Di dalam grup baris, segmen dari kolom terkait dapat ditempatkan berdekatan untuk mendukung pemindaian. Untuk melakukan operasi, pembacaan sub-segmen memungkinkan sistem mengambil hanya byte yang relevan daripada menarik seluruh segmen.</p>
<p><strong>Loon juga mendukung integrasi Lance yang hanya dapat dibaca</strong>, sehingga kumpulan data Lance yang ada dapat dipasang sebagai ColumnGroups ketika kompatibilitas menjadi pertimbangan.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Apa yang ditunjukkan oleh benchmark</h3><p>Dalam satu pengujian lokal, menggunakan satu file dengan 40.000 baris dan skema <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code>, Vortex menunjukkan hasil berikut dibandingkan dengan Parquet dengan kelompok baris berukuran 1 MB:</p>
<table>
<thead>
<tr><th>Operasi</th><th>Vortex</th><th>Parquet</th><th>Perbedaan</th></tr>
</thead>
<tbody>
<tr><td>Pengambilan, K=1.000 baris acak</td><td>5,8 ms</td><td>144 ms</td><td>25 kali lebih cepat</td></tr>
<tr><td>Pemindaian kolom vektor penuh</td><td>21 ms</td><td>142 ms</td><td>6,76 kali lebih cepat</td></tr>
<tr><td>Ukuran file, ~21 MB data mentah</td><td>6,62 MB</td><td>7,16 MB</td><td>7% lebih kecil</td></tr>
</tbody>
</table>
<p>Hasil " <code translate="no">take</code> " diperoleh dengan mengurangi jumlah data yang tidak relevan yang harus dibaca dan didekode. Hasil pemindaian diperoleh dari kompresi dan pilihan implementasi.</p>
<p>Angka-angka ini harus tetap terkait dengan pengaturannya: 8 vCPU Ubuntu 22.04 KVM, sistem file lokal, satu file, 40.000 baris, kelompok baris 1 MB, dan skema di atas. Pada penyimpanan objek, I/O jaringan dapat menjadi faktor dominan, sehingga mengurangi amplifikasi pembacaan bisa menjadi lebih penting. Hasil aktual bergantung pada bentuk dataset, perilaku penyimpanan objek, status cache, dan pola kueri.</p>
<p>Inti dari pembahasan ini bukanlah bahwa setiap kolom harus menggunakan Vortex.</p>
<p>Intinya adalah bahwa dataset vektor memerlukan pilihan format file pada tingkat ColumnGroup.</p>
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
    </button></h2><p>Format file hibrida memecahkan satu masalah: kolom yang berbeda kini dapat berada dalam format yang paling sesuai untuknya.</p>
<p>Namun, hal itu menimbulkan masalah kedua. Jika bidang skalar berada di Parquet, vektor berada di Vortex, dan objek mentah berada di penyimpanan objek, bagaimana sistem tetap memperlakukan semuanya sebagai satu koleksi?</p>
<p><strong>Loon memecahkan masalah ini dengan penyelarasan ID baris.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">ID baris adalah sistem koordinat pada lapisan penyimpanan</h3><p>Setiap ColumnGroupFile fisik mencatat jalur file dan rentang ID baris yang dicakupnya:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>ColumnGroup yang berbeda dapat mencakup ruang ID baris yang sama meskipun berada dalam file dan format yang berbeda.</p>
<p>Untuk ID baris <code translate="no">12345</code>, metadata skalar mungkin berada di ColumnGroup Parquet, embedding mungkin berada di ColumnGroup Vortex, dan video mentah mungkin diwakili oleh referensi penyimpanan objek. Secara logis, ketiganya tetap merupakan satu baris. Hal ini memberikan sistem koordinat yang stabil pada lapisan penyimpanan.</p>
<p>ID baris bukanlah kunci utama bisnis. ID baris adalah sistem koordinat lapisan penyimpanan yang memungkinkan Loon membagi koleksi secara fisik tanpa kehilangan kemampuan untuk merekonstruksinya secara logis.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Kolom baru tidak perlu menulis ulang kolom lama</h3><p>Menambahk <code translate="no">embedding_v2</code> tidak memerlukan penulisan ulang caption, metadata, atau ColumnGroups " <code translate="no">embedding_v1</code> " yang asli. Loon dapat menulis ColumnGroup vektor baru, mencatat rentang ID baris yang dicakupnya, dan mengonfirmasi perubahan tersebut melalui Manifest.</p>
<p>Hal yang sama berlaku untuk vektor langka, fitur rerank, atau bidang turunan lainnya yang ditambahkan kemudian.</p>
<p>Selama ColumnGroup baru mencakup rentang ID baris yang tepat, ColumnGroup tersebut dapat bergabung dengan koleksi logis yang sama tanpa memaksa data yang tidak terkait untuk dipindahkan.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Penghapusan dan pemadatan dapat dilakukan secara lebih terarah</h3><p>Penyelarasan ID baris juga membantu dalam penghapusan.</p>
<p>Penghapusan dapat diekspresikan terlebih dahulu melalui log penghapusan. Baris tersebut menjadi tidak terlihat di tingkat logis, sementara pembersihan fisik ditunda hingga proses pemadatan. Ketika pemadatan akhirnya dijalankan, proses tersebut tidak selalu perlu menulis ulang setiap ColumnGroup yang terkait dengan baris yang terpengaruh. Proses tersebut dapat berfokus pada ColumnGroups yang memerlukan pembersihan.</p>
<p>Hal ini penting karena tidak setiap kolom memiliki profil biaya yang sama. Menulis ulang ColumnGroup skalar yang pendek sangat berbeda dengan menulis ulang ratusan gigabyte vektor padat.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">Pencarian hibrida hanya dapat mengambil kolom yang dibutuhkannya</h3><p>Penyelarasan ID baris juga merupakan hal yang membuat pencarian hibrida praktis di atas format file hibrida.</p>
<p>Setelah pencarian ANN mengembalikan ID baris kandidat, sistem dapat mengambil hanya bidang yang diperlukan untuk hasil akhir: keterangan, metadata, vektor, fitur peringkat ulang, atau referensi objek.</p>
<p>Misalnya, sebuah kueri mungkin memerlukan:</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Bidang-bidang tersebut mungkin berada di ColumnGroup yang berbeda. Loon dapat menemukan file yang relevan berdasarkan rentang ID baris, membaca rentang byte yang diperlukan, dan menyusun hasilnya.</p>
<p>Tanpa penyelarasan ID baris, format hibrida hanya akan berupa file-file terpisah yang berada berdampingan. Dengan penyelarasan ID baris, file-file tersebut berperilaku sebagai satu koleksi logis.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader menyembunyikan pemisahan tersebut dari lapisan atas</h3><p>Komponen runtime yang memungkinkan hal ini berfungsi adalah Packed Reader.</p>
<p>Lapisan atas melihat aliran Arrow RecordBatch yang terpadu. Di bawahnya, data mungkin berasal dari beberapa ColumnGroups dalam format file yang berbeda. Packed Reader menyembunyikan perbedaan tersebut, menyelaraskan data berdasarkan rentang ID baris, dan menjadwalkan I/O multi-file dengan penggunaan memori yang terkendali.</p>
<p>Packed Reader juga mendukung pembacaan langsung ( <code translate="no">take</code> ) berdasarkan ID baris. Dengan sekumpulan ID baris, Packed Reader akan menemukan ColumnGroupFiles yang relevan, melakukan pembacaan rentang, dan mengembalikan bidang yang diminta.</p>
<p>Untuk alur kerja video, kueri ANN mungkin memerlukan " <code translate="no">caption</code>", " <code translate="no">embedding</code>", dan " <code translate="no">video_uri</code>". Packed Reader dapat mengambil ColumnGroup skalar dan ColumnGroup vektor tanpa menyentuh kolom yang tidak terkait.</p>
<p>Itulah perbedaan antara “file terpisah” dan “tabel dengan beberapa tata letak fisik.”</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Desain 3: jadikan Manifest sebagai sumber kebenaran<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>Format file hibrida menentukan bagaimana data disimpan secara fisik. Penyelarasan ID baris menentukan bagaimana ColumnGroup yang terpisah tetap membentuk satu tabel logis. Namun, sistem masih perlu menjawab pertanyaan yang lebih besar: <strong>file, log, statistik, indeks, dan referensi objek mana yang termasuk dalam versi dataset saat ini? Itulah tugas Manifest.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Direktori penyimpanan objek saja tidak cukup</h3><p>Penyimpanan objek bukanlah katalog basis data. Sebuah direktori mungkin berisi berkas lama, berkas baru, hasil pekerjaan yang gagal, berkas sementara, log penghapusan, berkas yang masih dirujuk oleh snapshot lama, dan berkas yang menunggu pembersihan. Fakta bahwa sebuah berkas ada tidak berarti berkas tersebut termasuk dalam versi dataset saat ini.</p>
<p>Sebuah dataset Loon dapat diorganisasikan ke dalam direktori seperti:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Namun, struktur direktori bukanlah sumber kebenaran. Manifest-lah yang menjadi sumber kebenaran. Pembaca tidak boleh mencantumkan direktori dan menyimpulkan status dari file apa pun yang kebetulan ada. Mereka harus membaca Manifest terkini dan mengikuti tampilan versi yang dinyatakan di dalamnya.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">Manifest mendefinisikan satu tampilan berversi dari dataset</h3><p>Manifest mendefinisikan dataset dalam versi tertentu. Manifest mencatat:</p>
<ul>
<li>ColumnGroups mana saja yang ada</li>
<li>rentang ID baris mana yang dicakup oleh masing-masing ColumnGroup</li>
<li>format fisik apa yang digunakan oleh setiap ColumnGroup</li>
<li>di mana file-file tersebut berada</li>
<li>log penghapusan mana yang aktif</li>
<li>statistik mana saja yang tersedia</li>
<li>indeks mana saja yang ada</li>
<li>blob eksternal mana yang dirujuk</li>
<li>kolom dan rentang baris mana yang dicakup oleh statistik atau indeks tersebut</li>
</ul>
<p>Setiap pembaruan menulis versi Manifest baru. Pembaca yang membuka versi N akan melihat tampilan dataset yang stabil pada versi N. Penulis dapat menyiapkan versi N+1 tanpa mengganggu pembaca yang masih menggunakan versi N.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Manifest melacak lebih dari sekadar file tabel</h3><p>Di Loon, isi Manifest dikodekan dengan Apache Avro dan disusun berdasarkan empat bagian utama.</p>
<ul>
<li>ColumnGroups mendeskripsikan kolom, format, file, dan rentang ID baris.</li>
<li>DeltaLogs mendeskripsikan penghapusan. Jenis penghapusan yang berbeda mencakup sumber perubahan yang berbeda, seperti penghapusan kunci utama dari klien, penghapusan posisional dari pemadatan internal, atau penghapusan kesetaraan dari mesin eksternal.</li>
<li>Stats mencakup metadata perencanaan seperti filter bloom, statistik BM25, dan nilai min/maks.</li>
<li>Indexes menjelaskan jenis indeks, parameter, kolom yang dicakup, dan rentang ID baris. Ini dapat mencakup indeks vektor seperti HNSW atau IVF, indeks teks, indeks terbalik, indeks bitmap, dan struktur terkait.</li>
</ul>
<p>Di sinilah Loon berbeda dari manifest tabel tradisional.</p>
<p>Kumpulan data vektor tidak hanya perlu melacak file data dan partisi. Kumpulan data ini juga perlu melacak indeks vektor, indeks teks, fitur spars, log penghapusan, statistik, referensi objek eksternal, dan rentang ID baris yang menghubungkannya.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">Manifest harus dapat ditulis tidak hanya oleh database</h3><p>Bagian terpenting bukan hanya apa yang terkandung dalam Manifest, melainkan siapa yang dapat menulisnya.</p>
<ul>
<li>Jika hanya database yang dapat menulis Manifest, maka Manifest tersebut tetap menjadi metadata internal. Metadata yang lebih rapi, tetapi tetap bersifat privat untuk satu mesin.</li>
<li>Jika mesin eksternal dapat menghasilkan ColumnGroups, statistik, dan entri Manifest baru, Manifest menjadi antarmuka koordinasi.</li>
<li>Sebuah pekerjaan Spark, misalnya, dapat mengisi ulang kolom vektor spars. Pekerjaan tersebut menulis ColumnGroup baru, mencatat cakupan baris dan statistik, serta mengkomit Manifest baru. Kueri online dapat terus membaca versi lama selama pekerjaan berlangsung. Setelah komit berhasil, versi baru menjadi terlihat.</li>
</ul>
<p>Hal ini mirip dengan Iceberg dan Delta Lake, tetapi model objeknya lebih luas. Kumpulan data vektor perlu melacak indeks vektor, indeks teks, fitur yang jarang, log penghapusan, statistik, referensi blob, dan rentang ID baris, bukan hanya file tabel dan partisi.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">Komitmen optimis membuat pembaruan versi tetap sederhana</h3><p>Setiap komit menulis versi Manifest baru. Penulis dapat membuat konten baru berdasarkan versi N, lalu mencoba menulisk <code translate="no">manifest-{N+1}.avro</code>. Semantik penulisan bersyarat atau pencocokan generasi pada penyimpanan objek dapat membuat komit gagal jika versi tersebut sudah ada. Penulis kemudian dapat mencoba lagi terhadap versi yang lebih baru.</p>
<p>Hal ini memberikan Loon kemampuan konkurensi optimis tanpa memaksa setiap pembaruan melalui jalur koordinasi yang berat dan sangat konsisten. Tanpa Manifest, penyimpanan multi-format dan multi-mesin pada akhirnya akan berubah menjadi konvensi penamaan dan rekonsiliasi manual. Hal itu mungkin berhasil untuk kumpulan data kecil. Namun, hal itu tidak akan berhasil untuk data vektor berskala TB.</p>
<p>Manifest adalah yang mengubah file heterogen menjadi kumpulan data yang dapat dibaca dan diperbarui dengan aman oleh berbagai sistem.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">Apa yang berubah bagi pengguna ketika penyimpanan menjadi berbasis versi<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Bagi pengembang aplikasi, Loon seharusnya tidak menjadi beban API baru.</p>
<p>Pengguna tetap dapat bekerja dengan konsep Milvus yang sudah dikenal: koleksi, penyisipan, pencarian, dan pencarian hibrida. Mereka tidak perlu memikirkan berkas Manifest, ColumnGroups, rentang ID baris, atau tata letak berkas selama pengembangan aplikasi normal.</p>
<p>Perubahan terjadi di balik layar. Penyimpanan menjadi lebih memahami bagaimana dataset AI sebenarnya berkembang.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">Menambahkan embedding baru seharusnya tidak memindahkan data lama</h3><p>Sebelumnya, menambah <code translate="no">embedding_v2</code> ke koleksi yang sudah ada seringkali memerlukan ekspor data, melatih model baru, menghasilkan vektor, dan kemudian mengimpor ulang atau memperbarui koleksi secara massal melalui SDK. Proses tersebut menimbulkan banyak pekerjaan operasional: pelacakan versi, percobaan ulang pekerjaan yang gagal, pembangunan ulang indeks, dampak pada layanan, dan pemeriksaan konsistensi.</p>
<p><strong>Dengan Loon, hal ini dapat menjadi evolusi skema ditambah komit ColumnGroup baru.</strong> Kolom embedding baru dapat ditulis sebagai ColumnGroup fisik tersendiri, diselaraskan berdasarkan ID baris, dan dibuat terlihat melalui Manifest. Kolom caption lama, kolom metadata skalar, dan kolom embedding asli tidak perlu dipindahkan.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">Pengisian data historis (backfill) seharusnya tidak memerlukan siklus pembaruan di sisi klien</h3><p>Banyak pembaruan data AI berupa backfill. Sebuah tim mungkin menambahkan vektor spars setelah pencarian hibrida menjadi penting. Tim tersebut mungkin menambahkan fitur rerank setelah model baru dilatih. Tim tersebut mungkin mengoreksi keterangan setelah ditinjau oleh manusia. Tim tersebut mungkin menambahkan tag tata kelola setelah pembaruan kebijakan.</p>
<p>Dalam tata letak tradisional, perubahan ini sering terjadi melalui pembaruan SDK klien atau jalur penulisan khusus database, bahkan ketika data dihasilkan oleh Spark, Ray, atau mesin eksternal lainnya.</p>
<p>Dengan Loon, sistem komputasi eksternal dapat menghasilkan ColumnGroups baru dan mengkomitnya melalui Manifest. Basis data tidak lagi harus menjadi satu-satunya titik masuk untuk setiap penulisan ulang.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">Analisis offline seharusnya tidak memerlukan salinan kebenaran lainnya</h3><p>Sebelumnya, tim sering mengekspor koleksi online ke Parquet untuk evaluasi atau analisis offline. Hal ini menciptakan dua versi dari dataset yang sama: koleksi online dan salinan analisis. Setelah keterangan diperbaiki, embedding dihasilkan ulang, log penghapusan diterapkan, atau indeks dibangun ulang, tim harus menentukan salinan mana yang terbaru.</p>
<p>Dengan model penyimpanan berbasis Manifest, mesin analisis dapat membaca tampilan dataset berversi yang sama seperti sistem penyajian. Mereka dapat memproyeksikan hanya kolom yang mereka butuhkan, memindai hanya rentang baris yang relevan, dan bekerja berdasarkan versi dataset yang dinyatakan, bukan snapshot yang diekspor secara manual.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Penghapusan dan koreksi seharusnya hanya memengaruhi bagian yang berubah</h3><p>Penghapusan, koreksi keterangan, perbaikan label, dan pembaruan tata kelola merupakan hal rutin dalam dataset AI. Hal-hal tersebut tidak boleh memaksa setiap kolom vektor panjang melalui jalur penulisan ulang yang sama.</p>
<p>Dengan Loon, penghapusan log dapat diperlakukan terlebih dahulu sebagai penghapusan logis. Kompaksi selanjutnya dapat membersihkan ColumnGroups yang terpengaruh tanpa menulis ulang data yang tidak terkait. Jika bidang teks pendek berubah, lapisan penyimpanan tidak perlu menulis ulang ratusan gigabyte vektor padat hanya karena mereka berbagi baris logis yang sama.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">Mesin eksternal menjadi bagian dari alur kerja, bukan jalan keluar darurat</h3><p>Perubahan yang lebih besar adalah bahwa mesin eksternal tidak lagi diperlakukan sebagai sistem di luar basis data vektor.</p>
<p>Spark, Ray, pekerjaan evaluasi, sistem pelabelan, dan pipa tata kelola sudah menghasilkan dan memodifikasi sebagian besar data. Lapisan penyimpanan seharusnya memungkinkan mereka untuk berkolaborasi di sekitar satu sumber kebenaran tunggal, bukan terus-menerus mengekspor, menyalin, dan mengimpor ulang.</p>
<p>Itulah yang dimungkinkan oleh versi Manifest. Versi ini memberikan pandangan bersama atas dataset kepada layanan online, analisis offline, pekerjaan backfill, dan pemadatan.</p>
<p>Hal-hal ini mungkin terdengar seperti detail penyimpanan internal, tetapi memengaruhi seberapa cepat tim dapat mengiterasi dataset AI. Setiap perubahan model, pengisian ulang fitur, koreksi keterangan, filter kualitas, dan pembangunan ulang indeks bergantung pada pertanyaan yang sama: &quot;<strong>Dapatkah sistem memperbarui dataset tanpa memindahkan data yang tidak perlu dipindahkan?&quot;</strong></p>
<p>Itulah nilai praktis dari model penyimpanan ini.</p>
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
    </button></h2><p>Loon tersedia di <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 beta</a> dan juga merupakan bagian dari lapisan penyimpanan di <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, evolusi selanjutnya dari Zilliz Cloud. Rilis ini berfokus pada tiga area inti:</p>
<ul>
<li><strong>Manifest.</strong> Tujuannya adalah agar penulisan, pengisian ulang, penghapusan, statistik, dan pembaruan indeks menghasilkan tampilan dataset berversi yang dapat dibuka secara konsisten oleh pembaca. Bagi pembaca, ini berarti sebuah kueri dapat membuka versi Manifest tertentu dan melihat tampilan dataset yang stabil. Bagi penulis, ini berarti file data baru, log penghapusan, statistik, atau file indeks dapat disiapkan terlebih dahulu dan kemudian ditampilkan melalui commit berversi.</li>
<li><strong>Dukungan ColumnGroup dan format.</strong> Parquet mendukung kolom skalar dan kolom yang ramah ekosistem. Vortex mendukung pola akses yang intensif vektor. Lance dapat diintegrasikan dalam mode baca-saja untuk kompatibilitas dengan dataset Lance yang sudah ada.</li>
<li><strong>Indeks di Lake.</strong> Statistik skalar, indeks penyaringan, dan indeks terbalik teks dapat berpartisipasi dalam perencanaan berbasis Manifest berdasarkan rentang baris. Indeks vektor asli Lake lebih kompleks. HNSW dan IVF memiliki perilaku yang berbeda pada penyimpanan objek, dan HNSW khususnya sensitif terhadap akses acak dan lokalitas cache. HNSW tidak dapat begitu saja menggunakan kembali tata letak yang dirancang untuk SSD lokal dan mengharapkan hasil yang sama.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">Masih ada pekerjaan yang harus diselesaikan</h3><ul>
<li><strong>Jalur penulisan eksternal</strong> penting karena Spark dan Ray harus dapat menghasilkan ColumnGroups dan komit Manifest tanpa memaksa setiap pengisian ulang melalui loop SDK klien.</li>
<li><strong>Interoperabilitas Lakehouse</strong> penting karena banyak tim sudah menggunakan katalog dan mesin kueri seperti <strong>Iceberg, Delta Lake, Trino, DuckDB, dan Athena.</strong> Data vektor harus dapat berpartisipasi dalam ekosistem tersebut tanpa kehilangan kinerja pencarian vektor.</li>
<li><strong>Tata letak indeks</strong> penting karena indeks graf dan struktur terbalik memiliki pola akses yang berbeda pada penyimpanan objek.</li>
<li><strong>Semantik objek besar</strong> penting karena video mentah, PDF, gambar, dan file audio memerlukan manajemen referensi, versi, dan perilaku penghapusan yang selaras dengan dataset vektor yang diturunkan.</li>
</ul>
<p>Perilaku rilis yang tepat, pengaturan default, dan jalur migrasi harus mengikuti <a href="https://docs.zilliz.com/docs/release-notes-2605">catatan rilis</a> Milvus dan <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud</a> yang relevan. Namun, arah penyimpanannya jelas: basis data vektor memerlukan fondasi berversi dan native lake di bawah lapisan penyajian.</p>
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
    </button></h2><p>Jika tumpukan sistem Anda saat ini memisahkan alur kerja penyajian online, analisis offline, pengisian data historis, dan data lake eksternal ke dalam sistem yang berbeda, Zilliz Vector Lakebase layak untuk dicoba. Anda dapat mencobanya di <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. Pendaftaran email kerja baru akan mendapatkan kredit gratis sebesar $100. Anda juga dipersilakan untuk <a href="https://zilliz.com/contact-sales">berdiskusi dengan kami</a> mengenai kasus penggunaan Anda.</p>
<p>Anda juga dapat mengikuti <a href="https://milvus.io/docs/release_notes.md">rilis Milvus 3.0</a> untuk melihat bagaimana Loon berkembang dalam mesin open-source tersebut.</p>
<p><strong>Zilliz Vector Lakebase menggabungkan:</strong></p>
<ul>
<li>Penyajian berjenjang untuk berbagai pertimbangan kinerja real-time dan biaya</li>
<li>Pencarian sesuai permintaan untuk beban kerja berskala besar atau eksploratif tanpa komputasi yang selalu aktif</li>
<li>Pencarian data lake eksternal, sehingga Anda dapat mengindeks dan mencari langsung di atas data lake yang sudah ada</li>
<li>Pencarian spektrum penuh di seluruh vektor, teks, JSON, dan data geospasial, dengan pengambilan dan pemeringkatan ulang hibrida</li>
<li>Penyimpanan terpadu yang native untuk data lake, dibangun di atas Vortex—sebuah format terbuka yang dirancang untuk pembacaan acak yang lebih cepat dan lebih hemat biaya pada data yang kaya vektor</li>
</ul>
