---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: Merekomendasikan konten menggunakan pencarian vektor semantik
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: >-
  Pelajari bagaimana Milvus digunakan untuk membangun sistem rekomendasi berita
  yang cerdas di dalam aplikasi.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>Membangun Sistem Rekomendasi Berita yang Cerdas di Dalam Aplikasi Berita Sohu</custom-h1><p>Dengan <a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">71% orang Amerika Serikat</a> mendapatkan rekomendasi berita dari platform sosial, konten yang dipersonalisasi dengan cepat menjadi cara media baru ditemukan. Baik saat orang mencari topik tertentu, atau berinteraksi dengan konten yang direkomendasikan, semua yang dilihat pengguna dioptimalkan oleh algoritme untuk meningkatkan rasio klik-tayang (CTR), keterlibatan, dan relevansi. Sohu adalah grup media, video, pencarian, dan game online Tiongkok yang terdaftar di NASDAQ. Sohu memanfaatkan <a href="https://milvus.io/">Milvus</a>, database vektor sumber terbuka yang dibangun oleh <a href="https://zilliz.com/">Zilliz</a>, untuk membangun mesin pencari vektor semantik di dalam aplikasi beritanya. Artikel ini menjelaskan bagaimana perusahaan menggunakan profil pengguna untuk menyempurnakan rekomendasi konten yang dipersonalisasi dari waktu ke waktu, meningkatkan pengalaman dan keterlibatan pengguna.</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">Merekomendasikan konten menggunakan pencarian vektor semantik<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Profil pengguna Sohu News dibuat dari riwayat penelusuran dan disesuaikan ketika pengguna mencari, dan berinteraksi dengan, konten berita. Sistem rekomendasi Sohu menggunakan pencarian vektor semantik untuk menemukan artikel berita yang relevan. Sistem ini bekerja dengan mengidentifikasi sekumpulan tag yang diharapkan menarik bagi setiap pengguna berdasarkan riwayat penelusuran. Sistem ini kemudian dengan cepat mencari artikel yang relevan dan mengurutkan hasilnya berdasarkan popularitas (diukur dengan CTR rata-rata), sebelum menyajikannya kepada pengguna.</p>
<p>New York Times sendiri menerbitkan <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 konten</a> setiap harinya, yang memberikan gambaran sekilas tentang besarnya konten baru yang harus dapat diproses oleh sistem rekomendasi yang efektif. Menelan berita dalam jumlah besar menuntut pencarian kemiripan milidetik dan pencocokan tag per jam untuk konten baru. Sohu memilih Milvus karena Milvus memproses kumpulan data yang sangat besar secara efisien dan akurat, mengurangi penggunaan memori selama pencarian, dan mendukung penerapan berkinerja tinggi.</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">Memahami alur kerja sistem rekomendasi berita<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Rekomendasi konten berbasis pencarian vektor semantik Sohu bergantung pada Deep Structured Semantic Model (DSSM), yang menggunakan dua jaringan saraf untuk merepresentasikan kueri pengguna dan artikel berita sebagai vektor. Model ini menghitung kemiripan kosinus dari dua vektor semantik, kemudian kumpulan berita yang paling mirip dikirim ke kumpulan kandidat rekomendasi. Selanjutnya, artikel berita diberi peringkat berdasarkan perkiraan CTR, dan artikel berita dengan perkiraan rasio klik-tayang tertinggi akan ditampilkan kepada pengguna.</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">Pengkodean artikel berita ke dalam vektor semantik dengan BERT-as-service</h3><p>Untuk menyandikan artikel berita ke dalam vektor semantik, sistem menggunakan alat <a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>. Jika jumlah kata dari suatu konten melebihi 512 saat menggunakan model ini, maka akan terjadi kehilangan informasi selama proses penyematan. Untuk membantu mengatasi hal ini, sistem pertama-tama mengekstrak ringkasan dan mengkodekannya ke dalam vektor semantik 768 dimensi. Kemudian dua topik yang paling relevan dari setiap artikel berita diekstraksi, dan vektor topik yang telah dilatih sebelumnya (200 dimensi) diidentifikasi berdasarkan ID topik. Selanjutnya, vektor topik tersebut disambungkan ke dalam vektor semantik 768 dimensi yang diekstrak dari ringkasan artikel, membentuk vektor semantik 968 dimensi.</p>
<p>Konten baru terus menerus masuk melalui Kafta, dan diubah menjadi vektor semantik sebelum dimasukkan ke dalam basis data Milvus.</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">Mengekstrak tag yang secara semantik mirip dari profil pengguna dengan BERT-as-service</h3><p>Jaringan saraf lain dari model ini adalah vektor semantik pengguna. Tag yang secara semantik mirip (misalnya, coronavirus, covid, COVID-19, pandemi, strain baru, pneumonia) diekstraksi dari profil pengguna berdasarkan minat, kueri penelusuran, dan riwayat penelusuran. Daftar tag yang diperoleh diurutkan berdasarkan beratnya, dan 200 tag teratas dibagi ke dalam kelompok semantik yang berbeda. Permutasi tag dalam setiap kelompok semantik digunakan untuk menghasilkan frasa tag baru, yang kemudian dikodekan ke dalam vektor semantik melalui BERT-as-service</p>
<p>Untuk setiap profil pengguna, kumpulan frasa tag memiliki <a href="https://github.com/baidu/Familia">kumpulan topik</a> yang <a href="https://github.com/baidu/Familia">sesuai</a> yang ditandai dengan bobot yang menunjukkan tingkat ketertarikan pengguna. Dua topik teratas dari semua topik yang relevan dipilih dan dikodekan oleh model pembelajaran mesin (ML) untuk disambungkan ke dalam vektor semantik tag yang sesuai, membentuk vektor semantik pengguna 968 dimensi. Meskipun sistem menghasilkan tag yang sama untuk pengguna yang berbeda, bobot yang berbeda untuk tag dan topik yang sesuai, serta perbedaan eksplisit antara vektor topik masing-masing pengguna, memastikan rekomendasi yang unik</p>
<p>Sistem ini dapat membuat rekomendasi berita yang dipersonalisasi dengan menghitung kemiripan kosinus dari vektor semantik yang diekstrak dari profil pengguna dan artikel berita.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">Menghitung vektor profil pengguna semantik baru dan memasukkannya ke Milvus</h3><p>Vektor profil pengguna semantik dihitung setiap hari, dengan data dari periode 24 jam sebelumnya diproses pada malam berikutnya. Vektor dimasukkan ke dalam Milvus satu per satu dan dijalankan melalui proses kueri untuk menyajikan hasil berita yang relevan kepada pengguna. Konten berita pada dasarnya bersifat topikal, sehingga membutuhkan komputasi yang dijalankan setiap jam untuk menghasilkan umpan berita terkini yang berisi konten yang memiliki tingkat klik-tayang yang tinggi dan relevan bagi pengguna. Konten berita juga diurutkan ke dalam partisi berdasarkan tanggal, dan berita lama dibersihkan setiap hari.</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">Mengurangi waktu ekstraksi vektor semantik dari hari ke jam</h3><p>Mengambil konten menggunakan vektor semantik membutuhkan pengubahan puluhan juta frasa tag menjadi vektor semantik setiap hari. Ini adalah proses yang memakan waktu yang membutuhkan waktu berhari-hari untuk menyelesaikannya, bahkan ketika berjalan pada unit pemrosesan grafis (GPU), yang mempercepat jenis komputasi ini. Untuk mengatasi masalah teknis ini, vektor semantik dari penyematan sebelumnya harus dioptimalkan sehingga ketika frasa tag yang serupa muncul, vektor semantik yang sesuai dapat langsung diambil.</p>
<p>Vektor semantik dari kumpulan frasa tag yang ada disimpan, dan kumpulan frasa tag baru yang dihasilkan setiap hari dikodekan ke dalam vektor MinHash. <a href="https://milvus.io/docs/v1.1.1/metric.md">Jarak Jaccard</a> digunakan untuk menghitung kemiripan antara vektor MinHash dari frasa tag baru dan vektor frasa tag yang disimpan. Jika jarak Jaccard melebihi ambang batas yang telah ditentukan sebelumnya, maka kedua set tersebut dianggap serupa. Jika ambang batas kemiripan terpenuhi, frasa baru dapat memanfaatkan informasi semantik dari penyematan sebelumnya. Pengujian menunjukkan bahwa jarak di atas 0,8 akan menjamin akurasi yang cukup untuk sebagian besar situasi.</p>
<p>Melalui proses ini, konversi harian dari puluhan juta vektor yang disebutkan di atas berkurang dari berhari-hari menjadi sekitar dua jam. Meskipun metode lain untuk menyimpan vektor semantik mungkin lebih tepat tergantung pada kebutuhan proyek tertentu, menghitung kesamaan antara dua frasa tag menggunakan jarak Jaccard dalam basis data Milvus tetap merupakan metode yang efisien dan akurat dalam berbagai skenario.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">Mengatasi "kasus buruk" dalam klasifikasi teks pendek<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika mengklasifikasikan teks berita, artikel berita yang pendek memiliki lebih sedikit fitur untuk diekstraksi dibandingkan dengan artikel berita yang lebih panjang. Karena itu, algoritme klasifikasi gagal ketika konten dengan panjang yang berbeda-beda dijalankan melalui pengklasifikasi yang sama. Milvus membantu menyelesaikan masalah ini dengan mencari beberapa informasi klasifikasi teks panjang dengan semantik yang sama dan nilai yang dapat diandalkan, kemudian menggunakan mekanisme pemungutan suara untuk memodifikasi klasifikasi teks pendek.</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">Mengidentifikasi dan menyelesaikan teks pendek yang salah klasifikasi</h3><p>Klasifikasi yang tepat untuk setiap artikel berita sangat penting untuk memberikan rekomendasi konten yang bermanfaat. Karena artikel berita pendek memiliki lebih sedikit fitur, menerapkan pengklasifikasi yang sama untuk berita dengan panjang yang berbeda menghasilkan tingkat kesalahan yang lebih tinggi untuk klasifikasi teks pendek. Pelabelan manusia terlalu lambat dan tidak akurat untuk tugas ini, sehingga BERT-as-service dan Milvus digunakan untuk dengan cepat mengidentifikasi teks pendek yang salah diklasifikasikan dalam batch, mengklasifikasikan ulang dengan benar, kemudian menggunakan batch data sebagai korpus untuk pelatihan untuk mengatasi masalah ini.</p>
<p>BERT-as-service digunakan untuk mengkodekan sejumlah lima juta artikel berita panjang dengan skor pengklasifikasi yang lebih besar dari 0,9 ke dalam vektor semantik. Setelah memasukkan artikel teks panjang ke dalam Milvus, berita teks pendek dikodekan ke dalam vektor semantik. Setiap vektor semantik berita pendek digunakan untuk melakukan query pada database Milvus dan mendapatkan 20 artikel berita panjang dengan kemiripan kosinus tertinggi dengan berita pendek target. Jika 18 dari 20 berita panjang yang memiliki kemiripan semantik tertinggi berada dalam klasifikasi yang sama dan berbeda dengan berita pendek yang ditanyakan, maka klasifikasi berita pendek tersebut dianggap tidak benar dan harus disesuaikan agar selaras dengan 18 berita panjang tersebut.</p>
<p>Proses ini dengan cepat mengidentifikasi dan mengoreksi klasifikasi teks pendek yang tidak akurat. Statistik pengambilan sampel acak menunjukkan bahwa setelah klasifikasi teks pendek dikoreksi, akurasi keseluruhan klasifikasi teks melebihi 95%. Dengan memanfaatkan klasifikasi teks panjang dengan tingkat kepercayaan tinggi untuk mengoreksi klasifikasi teks pendek, sebagian besar kasus klasifikasi yang buruk dapat dikoreksi dalam waktu singkat. Hal ini juga menawarkan korpus yang baik untuk melatih pengklasifikasi teks pendek.</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg "Diagram alir penemuan "kasus buruk" klasifikasi teks pendek.")</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">Milvus dapat mendukung rekomendasi konten berita secara real-time dan banyak lagi<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus sangat meningkatkan kinerja real-time sistem rekomendasi berita Sohu, dan juga meningkatkan efisiensi dalam mengidentifikasi teks pendek yang salah klasifikasi. Jika Anda tertarik untuk mempelajari lebih lanjut tentang Milvus dan berbagai aplikasinya:</p>
<ul>
<li>Baca <a href="https://zilliz.com/blog">blog</a> kami.</li>
<li>Berinteraksi dengan komunitas sumber terbuka kami di <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Gunakan atau kontribusikan ke basis data vektor paling populer di dunia di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Menguji dan menggunakan aplikasi AI dengan cepat dengan <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> baru kami.</li>
</ul>
