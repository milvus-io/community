---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: >-
  Membuat Rekomendasi Berita dengan Milvus yang Didukung AI di Dalam Browser
  Seluler Xiaomi
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  Temukan bagaimana Xiaomi memanfaatkan AI dan Milvus untuk membangun sistem
  rekomendasi berita cerdas yang mampu menemukan konten yang paling relevan bagi
  pengguna peramban web selulernya.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Membuat dengan Milvus: Rekomendasi Berita Bertenaga AI di Dalam Peramban Seluler Xiaomi</custom-h1><p>Dari umpan media sosial hingga rekomendasi daftar putar di Spotify, <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">kecerdasan buatan</a> telah memainkan peran utama dalam konten yang kita lihat dan berinteraksi dengannya setiap hari. Dalam upaya untuk membedakan peramban web seluler mereka, produsen elektronik multinasional Xiaomi membangun mesin rekomendasi berita bertenaga AI. <a href="https://milvus.io/">Milvus</a>, database vektor sumber terbuka yang dibuat khusus untuk pencarian kemiripan dan kecerdasan buatan, digunakan sebagai platform manajemen data inti aplikasi. Artikel ini menjelaskan bagaimana Xiaomi membangun mesin rekomendasi berita bertenaga AI, dan bagaimana Milvus serta algoritme AI lainnya digunakan.</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">Menggunakan AI untuk menyarankan konten yang dipersonalisasi dan mengurangi kebisingan berita</h3><p>Dengan New York Times sendiri menerbitkan lebih dari <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230</a> konten setiap hari, banyaknya artikel yang diproduksi membuat orang tidak mungkin mendapatkan pandangan yang komprehensif dari semua berita. Untuk membantu menyaring konten dalam jumlah besar, dan merekomendasikan konten yang paling relevan atau menarik, kami semakin beralih ke AI. Meskipun rekomendasi masih jauh dari sempurna, pembelajaran mesin semakin diperlukan untuk memotong aliran informasi baru yang terus mengalir dari dunia kita yang semakin kompleks dan saling terhubung.</p>
<p>Xiaomi membuat dan berinvestasi pada smartphone, aplikasi seluler, laptop, peralatan rumah tangga, dan masih banyak lagi produk lainnya. Dalam upaya untuk membedakan peramban seluler yang sudah terinstal di banyak dari 40+ juta ponsel cerdas yang dijual perusahaan setiap kuartal, Xiaomi membangun sistem rekomendasi berita ke dalamnya. Ketika pengguna meluncurkan peramban seluler Xiaomi, kecerdasan buatan digunakan untuk merekomendasikan konten serupa berdasarkan riwayat pencarian pengguna, minat, dan banyak lagi. Milvus adalah basis data pencarian kemiripan vektor sumber terbuka yang digunakan untuk mempercepat pengambilan artikel terkait.</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">Bagaimana cara kerja rekomendasi konten yang didukung AI?</h3><p>Pada intinya, rekomendasi berita (atau jenis sistem rekomendasi konten lainnya) melibatkan perbandingan data masukan dengan basis data yang sangat besar untuk menemukan informasi yang serupa. Rekomendasi konten yang sukses melibatkan penyeimbangan relevansi dengan ketepatan waktu, dan secara efisien menggabungkan volume data baru yang sangat besar-sering kali secara real time.</p>
<p>Untuk mengakomodasi kumpulan data yang sangat besar, sistem rekomendasi biasanya dibagi menjadi dua tahap:</p>
<ol>
<li><strong>Pengambilan</strong>: Selama pengambilan, konten dipersempit dari perpustakaan yang lebih luas berdasarkan minat dan perilaku pengguna. Di peramban seluler Xiaomi, ribuan konten dipilih dari kumpulan data yang sangat besar yang berisi jutaan artikel berita.</li>
<li><strong>Penyortiran</strong>: Selanjutnya, konten yang dipilih selama pengambilan disortir menurut indikator tertentu sebelum didorong ke pengguna. Ketika pengguna terlibat dengan konten yang direkomendasikan, sistem beradaptasi secara real time untuk memberikan saran yang lebih relevan.</li>
</ol>
<p>Rekomendasi konten berita harus dibuat secara real-time berdasarkan perilaku pengguna dan konten yang baru saja diterbitkan. Selain itu, konten yang disarankan harus sesuai dengan minat dan maksud pencarian pengguna sebanyak mungkin.</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = saran konten yang cerdas</h3><p>Milvus adalah basis data pencarian kemiripan vektor sumber terbuka yang dapat diintegrasikan dengan model pembelajaran mendalam untuk mendukung aplikasi yang mencakup pemrosesan bahasa alami, verifikasi identitas, dan banyak lagi. Milvus mengindeks dataset vektor yang besar untuk membuat pencarian menjadi lebih efisien, dan mendukung berbagai kerangka kerja AI yang populer untuk menyederhanakan proses pengembangan aplikasi pembelajaran mesin. Karakteristik ini menjadikan platform ini ideal untuk menyimpan dan meminta data vektor, komponen penting dari banyak aplikasi pembelajaran mesin.</p>
<p>Xiaomi memilih Milvus untuk mengelola data vektor untuk sistem rekomendasi berita cerdasnya karena cepat, dapat diandalkan, dan membutuhkan konfigurasi dan pemeliharaan yang minimal. Namun, Milvus harus dipasangkan dengan algoritme AI untuk membangun aplikasi yang dapat diterapkan. Xiaomi memilih BERT, singkatan dari Bidirectional Encoder Representation Transformers, sebagai model representasi bahasa dalam mesin rekomendasinya. BERT dapat digunakan sebagai model NLU (pemahaman bahasa alami) umum yang dapat mendorong sejumlah tugas NLP (pemrosesan bahasa alami) yang berbeda. Fitur-fitur utamanya meliputi:</p>
<ul>
<li>Transformasi BERT digunakan sebagai kerangka kerja utama algoritma dan mampu menangkap hubungan eksplisit dan implisit di dalam dan di antara kalimat.</li>
<li>Tujuan pembelajaran multi-tugas, pemodelan bahasa bertopeng (MLM), dan prediksi kalimat berikutnya (NSP).</li>
<li>BERT berkinerja lebih baik dengan jumlah data yang lebih besar, dan dapat meningkatkan teknik pemrosesan bahasa alami lainnya seperti Word2Vec dengan bertindak sebagai matriks konversi.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>Arsitektur jaringan BERT menggunakan struktur transformator multi-layer yang meninggalkan jaringan saraf RNN dan CNN tradisional. Jaringan ini bekerja dengan mengubah jarak antara dua kata pada posisi apa pun menjadi satu melalui mekanisme perhatiannya, dan memecahkan masalah ketergantungan yang telah ada di NLP selama beberapa waktu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT menyediakan model yang sederhana dan kompleks. Hiperparameter yang sesuai adalah sebagai berikut: BERT BASE: L = 12, H = 768, A = 12, total parameter 110M; BERT BESAR: L = 24, H = 1024, A = 16, jumlah total parameter 340M.</p>
<p>Dalam hiperparameter di atas, L mewakili jumlah lapisan dalam jaringan (yaitu jumlah blok Transformer), A mewakili jumlah Perhatian diri dalam Perhatian Multi-Kepala, dan ukuran filter adalah 4H.</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">Sistem rekomendasi konten Xiaomi</h3><p>Sistem rekomendasi berita berbasis peramban Xiaomi bergantung pada tiga komponen utama: vektorisasi, pemetaan ID, dan layanan perkiraan tetangga terdekat (ANN).</p>
<p>Vektorisasi adalah proses di mana judul artikel diubah menjadi vektor kalimat umum. Model SimBert, berdasarkan BERT, digunakan dalam sistem rekomendasi Xiaomi. SimBert adalah model 12-lapisan dengan ukuran tersembunyi 768. Simbert menggunakan model pelatihan Chinese L-12_H-768_A-12 untuk pelatihan berkelanjutan (tugas pelatihan adalah "pembelajaran metrik + UniLM", dan telah melatih 1,17 juta langkah pada signle TITAN RTX dengan pengoptimal Adam (tingkat pembelajaran 2e-6, ukuran batch 128). Sederhananya, ini adalah model BERT yang dioptimalkan.</p>
<p>Algoritma ANN membandingkan judul artikel vektor dengan seluruh pustaka berita yang tersimpan di Milvus, kemudian mengembalikan konten yang serupa untuk pengguna. Pemetaan ID digunakan untuk mendapatkan informasi yang relevan seperti tampilan halaman dan klik untuk artikel yang sesuai.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>Data yang disimpan di Milvus yang mendukung mesin rekomendasi berita Xiaomi terus diperbarui, termasuk artikel tambahan dan informasi aktivitas. Saat sistem memasukkan data baru, data lama harus dibersihkan. Dalam sistem ini, pembaruan data penuh dilakukan selama T-1 hari pertama dan pembaruan tambahan dilakukan pada T hari berikutnya.</p>
<p>Pada interval yang ditentukan, data lama dihapus dan data yang diproses pada T-1 hari dimasukkan ke dalam koleksi. Di sini data yang baru dihasilkan dimasukkan secara real time. Setelah data baru dimasukkan, pencarian kemiripan dilakukan di Milvus. Artikel yang diperoleh kembali diurutkan berdasarkan rasio klik dan faktor lainnya, dan konten teratas ditampilkan kepada pengguna. Dalam skenario seperti ini di mana data sering diperbarui dan hasilnya harus disampaikan secara real time, kemampuan Milvus untuk memasukkan dan mencari data baru dengan cepat memungkinkan untuk secara drastis mempercepat rekomendasi konten berita di peramban seluler Xiaomi.</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus membuat pencarian kemiripan vektor menjadi lebih baik</h3><p>Memvektorkan data dan kemudian menghitung kemiripan antar vektor adalah teknologi pencarian yang paling umum digunakan. Munculnya mesin pencari kemiripan vektor berbasis ANN telah sangat meningkatkan efisiensi perhitungan kemiripan vektor. Dibandingkan dengan solusi serupa, Milvus menawarkan penyimpanan data yang dioptimalkan, SDK yang berlimpah, dan versi terdistribusi yang sangat mengurangi beban kerja dalam membangun lapisan pencarian. Selain itu, komunitas open-source Milvus yang aktif merupakan sumber daya yang kuat yang dapat membantu menjawab pertanyaan dan memecahkan masalah saat muncul.</p>
<p>Jika Anda ingin mempelajari lebih lanjut tentang pencarian kemiripan vektor dan Milvus, lihat sumber-sumber berikut:</p>
<ul>
<li>Lihat <a href="https://github.com/milvus-io/milvus">Milvus</a> di Github.</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">Pencarian Kemiripan Vektor Bersembunyi di Tampilan Biasa</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor</a></li>
</ul>
<p>Baca <a href="https://zilliz.com/user-stories">cerita pengguna</a> lain untuk mempelajari lebih lanjut tentang membuat sesuatu dengan Milvus.</p>
