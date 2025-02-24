---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: Bagaimana Platform Video Pendek Likee Menghapus Video Duplikat dengan Milvus
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: >-
  Pelajari bagaimana Likee menggunakan Milvus untuk mengidentifikasi video
  duplikat dalam hitungan milidetik.
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh Xinyang Guo dan Baoyu Han, insinyur di BIGO, dan diterjemahkan oleh <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p><a href="https://www.bigo.sg/">BIGO Technology</a> (BIGO) adalah salah satu perusahaan teknologi Singapura dengan pertumbuhan tercepat. Didukung oleh teknologi kecerdasan buatan, produk dan layanan berbasis video BIGO telah mendapatkan popularitas yang luar biasa di seluruh dunia, dengan lebih dari 400 juta pengguna di lebih dari 150 negara. Produk dan layanan tersebut meliputi <a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a> (live streaming) dan <a href="https://likee.video/">Likee</a> (video berdurasi pendek).</p>
<p>Likee adalah platform pembuatan video pendek global di mana pengguna dapat berbagi momen, mengekspresikan diri, dan terhubung dengan dunia. Untuk meningkatkan pengalaman pengguna dan merekomendasikan konten yang lebih berkualitas kepada pengguna, Likee perlu menyaring video duplikat dari sejumlah besar video yang dibuat oleh pengguna setiap harinya, yang mana hal ini bukanlah tugas yang mudah.</p>
<p>Blog ini menyajikan bagaimana BIGO menggunakan <a href="https://milvus.io">Milvus</a>, database vektor sumber terbuka, untuk menghapus video duplikat secara efektif.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#Overview">Gambaran Umum</a></li>
<li><a href="#Video-deduplication-workflow">Alur kerja deduplikasi video</a></li>
<li><a href="#System-architecture">Arsitektur Sistem</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">Menggunakan Milvus untuk mendukung pencarian kemiripan</a></li>
</ul>
<custom-h1>Gambaran Umum</custom-h1><p>Milvus adalah basis data vektor sumber terbuka yang menampilkan pencarian vektor yang sangat cepat. Didukung oleh Milvus, Likee dapat menyelesaikan pencarian dalam waktu 200 ms sekaligus memastikan tingkat penarikan yang tinggi. Sementara itu, dengan menskalakan <a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">Milvus secara horizontal</a>, Likee berhasil meningkatkan hasil pencarian vektor, sehingga meningkatkan efisiensinya.</p>
<custom-h1>Alur kerja deduplikasi video</custom-h1><p>Bagaimana cara Likee mengidentifikasi video duplikat? Setiap kali video kueri dimasukkan ke dalam sistem Likee, video tersebut akan dipotong menjadi 15-20 frame dan setiap frame akan diubah menjadi vektor fitur. Kemudian Likee mencari dalam database 700 juta vektor untuk menemukan K vektor yang paling mirip. Masing-masing dari K vektor teratas berhubungan dengan sebuah video dalam database. Likee selanjutnya melakukan pencarian yang disempurnakan untuk mendapatkan hasil akhir dan menentukan video yang akan dihapus.</p>
<custom-h1>Arsitektur sistem</custom-h1><p>Mari kita lihat lebih dekat bagaimana sistem de-duplikasi video Likee bekerja menggunakan Milvus. Seperti yang ditunjukkan pada diagram di bawah ini, video baru yang diunggah ke Likee akan ditulis ke Kafka, sebuah sistem penyimpanan data, secara real-time dan dikonsumsi oleh konsumen Kafka. Vektor fitur dari video-video ini diekstraksi melalui model pembelajaran mendalam, di mana data tidak terstruktur (video) diubah menjadi vektor fitur. Vektor fitur ini akan dikemas oleh sistem dan dikirim ke auditor kemiripan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Arsitektur sistem de-duplikasi video Likee</span> </span></p>
<p>Vektor fitur yang diekstraksi akan diindeks oleh Milvus dan disimpan di Ceph, sebelum <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">dimuat oleh simpul kueri Milvus</a> untuk pencarian lebih lanjut. ID video yang sesuai dari vektor fitur ini juga akan disimpan secara bersamaan di TiDB atau Pika sesuai dengan kebutuhan yang sebenarnya.</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">Menggunakan basis data vektor Milvus untuk mendukung pencarian kemiripan</h3><p>Ketika mencari vektor yang mirip, miliaran data yang ada, bersama dengan sejumlah besar data baru yang dihasilkan setiap hari, menimbulkan tantangan besar pada fungsionalitas mesin pencari vektor. Setelah melakukan analisis menyeluruh, Likee akhirnya memilih Milvus, mesin pencari vektor terdistribusi dengan kinerja tinggi dan tingkat recall yang tinggi, untuk melakukan pencarian kemiripan vektor.</p>
<p>Seperti yang ditunjukkan pada diagram di bawah ini, prosedur pencarian kemiripan adalah sebagai berikut:</p>
<ol>
<li><p>Pertama, Milvus melakukan pencarian batch untuk mengingat 100 vektor yang mirip untuk setiap vektor fitur yang diekstrak dari video baru. Setiap vektor yang mirip terikat dengan ID video yang sesuai.</p></li>
<li><p>Kedua, dengan membandingkan ID video, Milvus menghapus video duplikat dan mengambil vektor fitur dari video yang tersisa dari TiDB atau Pika.</p></li>
<li><p>Terakhir, Milvus menghitung dan memberi nilai kemiripan antara setiap set vektor fitur yang diambil dan vektor fitur dari video kueri. ID video dengan skor tertinggi dikembalikan sebagai hasilnya. Dengan demikian pencarian kemiripan video selesai.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>Prosedur pencarian kemiripan</span> </span></p>
<p>Sebagai mesin pencari vektor berkinerja tinggi, Milvus telah melakukan pekerjaan yang luar biasa dalam sistem de-duplikasi video Likee, yang sangat mendorong pertumbuhan bisnis video pendek BIGO. Dalam hal bisnis video, ada banyak skenario lain di mana Milvus dapat diterapkan, seperti pemblokiran konten ilegal atau rekomendasi video yang dipersonalisasi. Baik BIGO maupun Milvus menantikan kerja sama di masa depan di lebih banyak bidang.</p>
