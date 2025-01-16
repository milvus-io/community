---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: >-
  Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan
  Pengindeksan Vektor
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  Tanpa pengindeksan vektor, banyak aplikasi AI modern akan sangat lambat.
  Pelajari cara memilih indeks yang tepat untuk aplikasi pembelajaran mesin Anda
  berikutnya.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor</custom-h1><p>Mulai dari visi komputer hingga penemuan obat baru, mesin pencari kemiripan vektor mendukung banyak aplikasi kecerdasan buatan (AI) yang populer. Komponen besar yang memungkinkan untuk melakukan kueri secara efisien terhadap jutaan, miliaran, atau bahkan triliunan set data vektor yang menjadi andalan mesin pencari kemiripan adalah pengindeksan, sebuah proses pengorganisasian data yang secara drastis mempercepat pencarian data besar. Artikel ini membahas peran pengindeksan dalam membuat pencarian kemiripan vektor menjadi efisien, berbagai jenis indeks vector inverted file (IVF), dan saran mengenai indeks mana yang akan digunakan dalam berbagai skenario.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">Bagaimana pengindeksan vektor mempercepat pencarian kemiripan dan pembelajaran mesin?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">Apa saja jenis-jenis indeks IVF yang berbeda dan skenario mana yang paling cocok untuknya?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">DATAR: Baik untuk mencari set data yang relatif kecil (skala jutaan) ketika diperlukan 100% recall.</a><ul>
<li><a href="#flat-performance-test-results">Hasil pengujian kinerja FLAT:</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Hasil pengujian waktu kueri untuk indeks FLAT di Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">Hal-hal penting:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: Meningkatkan kecepatan dengan mengorbankan akurasi (dan sebaliknya)</a>.<ul>
<li><a href="#ivf_flat-performance-test-results">Hasil tes kinerja IVF_FLAT:</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Hasil pengujian waktu kueri untuk indeks IVF_FLAT di Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">Kesimpulan utama:</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Hasil pengujian tingkat penarikan untuk indeks IVF_FLAT di Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">Hal-hal penting:</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: Lebih cepat dan tidak terlalu membutuhkan sumber daya dibandingkan IVF_FLAT, tetapi juga kurang akurat</a>.<ul>
<li><a href="#ivf_sq8-performance-test-results">Hasil uji kinerja IVF_SQ8:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Hasil pengujian waktu kueri untuk indeks IVF_SQ8 di Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">Kesimpulan utama:</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Hasil pengujian tingkat penarikan untuk indeks IVF_SQ8 di Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">Hal-hal penting:</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: Pendekatan hybrid GPU/CPU baru yang bahkan lebih cepat dari IVF_SQ8.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">Hasil uji performa IVF_SQ8H:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Hasil pengujian waktu kueri untuk indeks IVF_SQ8H di Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">Hal-hal penting:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">Pelajari lebih lanjut tentang Milvus, platform manajemen data vektor berskala besar.</a></li>
<li><a href="#methodology">Metodologi</a><ul>
<li><a href="#performance-testing-environment">Lingkungan pengujian kinerja</a></li>
<li><a href="#relevant-technical-concepts">Konsep teknis yang relevan</a></li>
<li><a href="#resources">Sumber daya</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">Bagaimana pengindeksan vektor mempercepat pencarian kemiripan dan pembelajaran mesin?</h3><p>Mesin pencari kemiripan bekerja dengan membandingkan input ke database untuk menemukan objek yang paling mirip dengan input. Pengindeksan adalah proses pengorganisasian data secara efisien, dan ini memainkan peran utama dalam membuat pencarian kemiripan menjadi berguna dengan mempercepat kueri yang memakan waktu secara dramatis pada kumpulan data yang besar. Setelah kumpulan data vektor yang sangat besar diindeks, kueri dapat dialihkan ke cluster, atau subset data, yang kemungkinan besar berisi vektor yang mirip dengan kueri masukan. Dalam praktiknya, ini berarti tingkat akurasi tertentu dikorbankan untuk mempercepat kueri pada data vektor yang sangat besar.</p>
<p>Sebuah analogi dapat diambil dari sebuah kamus, di mana kata-kata diurutkan menurut abjad. Ketika mencari sebuah kata, Anda dapat dengan cepat menavigasi ke bagian yang hanya berisi kata-kata dengan huruf awal yang sama - secara drastis mempercepat pencarian definisi kata yang dimasukkan.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">Apa saja jenis indeks IVF yang berbeda dan skenario mana yang paling cocok untuknya?</h3><p>Ada banyak indeks yang dirancang untuk pencarian kemiripan vektor berdimensi tinggi, dan masing-masing indeks memiliki kekurangan dan kelebihan dalam hal kinerja, akurasi, dan kebutuhan penyimpanan. Artikel ini membahas beberapa jenis indeks IVF yang umum, kekuatan dan kelemahannya, serta hasil pengujian kinerja untuk setiap jenis indeks. Pengujian kinerja mengukur waktu kueri dan tingkat penarikan untuk setiap jenis indeks di <a href="https://milvus.io/">Milvus</a>, sebuah platform manajemen data vektor sumber terbuka. Untuk informasi tambahan tentang lingkungan pengujian, lihat bagian metodologi di bagian bawah artikel ini.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">DATAR: Baik untuk mencari set data yang relatif kecil (skala jutaan) ketika diperlukan 100% recall.</h3><p>Untuk aplikasi pencarian kemiripan vektor yang membutuhkan akurasi sempurna dan bergantung pada set data yang relatif kecil (berskala jutaan), indeks FLAT adalah pilihan yang baik. FLAT tidak memampatkan vektor, dan merupakan satu-satunya indeks yang dapat menjamin hasil pencarian yang tepat. Hasil dari FLAT juga dapat digunakan sebagai titik perbandingan untuk hasil yang dihasilkan oleh indeks lain yang memiliki recall kurang dari 100%.</p>
<p>FLAT akurat karena menggunakan pendekatan yang menyeluruh dalam melakukan pencarian, yang berarti untuk setiap kueri, input target dibandingkan dengan setiap vektor dalam kumpulan data. Hal ini membuat FLAT menjadi indeks paling lambat dalam daftar kami, dan tidak cocok untuk mencari data vektor yang sangat besar. Tidak ada parameter untuk indeks FLAT di Milvus, dan menggunakannya tidak memerlukan pelatihan data atau penyimpanan tambahan.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">Hasil pengujian kinerja FLAT:</h4><p>Pengujian kinerja waktu kueri FLAT dilakukan di Milvus menggunakan dataset yang terdiri dari 2 juta vektor 128 dimensi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Hal-hal penting yang dapat diambil:</h4><ul>
<li>Ketika nq (jumlah vektor target untuk sebuah kueri) meningkat, waktu kueri juga meningkat.</li>
<li>Dengan menggunakan indeks FLAT di Milvus, kita dapat melihat bahwa waktu kueri meningkat tajam setelah nq melebihi 200.</li>
<li>Secara umum, indeks FLAT lebih cepat dan lebih konsisten ketika menjalankan Milvus pada GPU vs CPU. Namun, kueri FLAT pada CPU lebih cepat ketika nq di bawah 20.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: Meningkatkan kecepatan dengan mengorbankan akurasi (dan sebaliknya).</h3><p>Cara umum untuk mempercepat proses pencarian kesamaan dengan mengorbankan akurasi adalah dengan melakukan pencarian tetangga terdekat (ANN). Algoritma ANN mengurangi kebutuhan penyimpanan dan beban komputasi dengan mengelompokkan vektor-vektor yang mirip, sehingga menghasilkan pencarian vektor yang lebih cepat. IVF_FLAT adalah jenis indeks file terbalik yang paling dasar dan bergantung pada bentuk pencarian ANN.</p>
<p>IVF_FLAT membagi data vektor ke dalam sejumlah unit klaster (nlist), dan kemudian membandingkan jarak antara vektor input target dan pusat setiap klaster. Bergantung pada jumlah klaster yang diatur oleh sistem untuk kueri (nprobe), hasil pencarian kemiripan dikembalikan berdasarkan perbandingan antara input target dan vektor dalam klaster yang paling mirip saja - secara drastis mengurangi waktu kueri.</p>
<p>Dengan menyesuaikan nprobe, keseimbangan ideal antara akurasi dan kecepatan dapat ditemukan untuk skenario tertentu. Hasil dari uji kinerja IVF_FLAT kami menunjukkan bahwa waktu kueri meningkat tajam seiring dengan bertambahnya jumlah vektor input target (nq), dan jumlah klaster yang dicari (nprobe). IVF_FLAT tidak memampatkan data vektor, namun, file indeks menyertakan metadata yang sedikit meningkatkan kebutuhan penyimpanan dibandingkan dengan set data vektor mentah yang tidak diindeks.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">Hasil uji kinerja IVF_FLAT:</h4><p>Pengujian kinerja waktu kueri IVF_FLAT dilakukan di Milvus menggunakan dataset SIFT 1B publik, yang berisi 1 miliar vektor 128 dimensi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Kesimpulan utama:</h4><ul>
<li>Ketika berjalan di CPU, waktu kueri untuk indeks IVF_FLAT di Milvus meningkat dengan nprobe dan nq. Ini berarti semakin banyak vektor input yang dikandung kueri, atau semakin banyak cluster yang dicari kueri, maka waktu kueri akan semakin lama.</li>
<li>Pada GPU, indeks menunjukkan lebih sedikit varians waktu terhadap perubahan nq dan nprobe. Hal ini dikarenakan data indeks berukuran besar, dan menyalin data dari memori CPU ke memori GPU menyumbang sebagian besar dari total waktu kueri.</li>
<li>Pada semua skenario, kecuali saat nq = 1.000 dan nprobe = 32, indeks IVF_FLAT lebih efisien saat berjalan di CPU.</li>
</ul>
<p>Pengujian kinerja penarikan IVF_FLAT dilakukan di Milvus dengan menggunakan dataset SIFT 1M publik, yang berisi 1 juta vektor 128 dimensi, dan dataset sarung tangan-200-sudut, yang berisi lebih dari 1 juta vektor 200 dimensi, untuk membangun indeks (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Hal-hal penting yang dapat diambil:</h4><ul>
<li>Indeks IVF_FLAT dapat dioptimalkan untuk akurasi, mencapai tingkat recall di atas 0,99 pada dataset SIFT 1M ketika nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: Lebih cepat dan tidak terlalu membutuhkan sumber daya dibandingkan IVF_FLAT, tetapi juga kurang akurat.</h3><p>IVF_FLAT tidak melakukan kompresi apa pun, sehingga file indeks yang dihasilkannya memiliki ukuran yang kurang lebih sama dengan data vektor mentah yang tidak diindeks. Sebagai contoh, jika set data SIFT 1B asli berukuran 476 GB, file indeks IVF_FLAT akan sedikit lebih besar (~470 GB). Memuat semua file indeks ke dalam memori akan menghabiskan 470 GB penyimpanan.</p>
<p>Ketika sumber daya memori disk, CPU, atau GPU terbatas, IVF_SQ8 adalah pilihan yang lebih baik daripada IVF_FLAT. Jenis indeks ini dapat mengonversi setiap FLOAT (4 byte) menjadi UINT8 (1 byte) dengan melakukan kuantisasi skalar. Hal ini mengurangi konsumsi memori disk, CPU, dan GPU sebesar 70-75%. Untuk kumpulan data SIFT 1B, file indeks IVF_SQ8 hanya membutuhkan penyimpanan sebesar 140 GB.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">Hasil pengujian kinerja IVF_SQ8:</h4><p>Pengujian waktu kueri IVF_SQ8 dilakukan di Milvus dengan menggunakan dataset SIFT 1B publik, yang berisi 1 miliar vektor 128 dimensi, untuk membangun indeks.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Kesimpulan utama:</h4><ul>
<li>Dengan mengurangi ukuran file indeks, IVF_SQ8 menawarkan peningkatan kinerja yang nyata dibandingkan IVF_FLAT. IVF_SQ8 mengikuti kurva performa yang mirip dengan IVF_FLAT, dengan waktu kueri yang meningkat dengan nq dan nprobe.</li>
<li>Serupa dengan IVF_FLAT, IVF_SQ8 menunjukkan performa yang lebih cepat ketika berjalan pada CPU dan ketika nq dan nprobe lebih kecil.</li>
</ul>
<p>Pengujian performa recall IVF_SQ8 dilakukan di Milvus dengan menggunakan dataset SIFT 1M publik, yang berisi 1 juta vektor 128 dimensi, dan dataset sarung tangan-200-sudut, yang berisi lebih dari 1 juta vektor 200 dimensi, untuk membangun indeks (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Kesimpulan utama:</h4><ul>
<li>Meskipun mengompresi data asli, IVF_SQ8 tidak mengalami penurunan yang signifikan dalam akurasi kueri. Di berbagai pengaturan nprobe, IVF_SQ8 memiliki tingkat penarikan paling banyak 1% lebih rendah daripada IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: Pendekatan hybrid GPU/CPU baru yang bahkan lebih cepat dari IVF_SQ8.</h3><p>IVF_SQ8H adalah jenis indeks baru yang meningkatkan kinerja kueri dibandingkan dengan IVF_SQ8. Ketika indeks IVF_SQ8 yang berjalan di CPU di-query, sebagian besar waktu query dihabiskan untuk menemukan cluster nprobe yang paling dekat dengan vektor input target. Untuk mengurangi waktu kueri, IVF_SQ8 menyalin data untuk operasi kuantisasi kasar, yang lebih kecil daripada file indeks, ke memori GPU - sangat mempercepat operasi kuantisasi kasar. Kemudian gpu_search_threshold menentukan perangkat mana yang menjalankan kueri. Ketika nq &gt;= gpu_search_threshold, GPU menjalankan kueri; jika tidak, CPU menjalankan kueri.</p>
<p>IVF_SQ8H adalah jenis indeks hibrida yang membutuhkan CPU dan GPU untuk bekerja sama. Ini hanya dapat digunakan dengan Milvus yang mendukung GPU.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">Hasil uji kinerja IVF_SQ8H:</h4><p>Pengujian kinerja waktu kueri IVF_SQ8H dilakukan di Milvus menggunakan dataset SIFT 1B publik, yang berisi 1 miliar vektor 128 dimensi, untuk membangun indeks.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Poin-poin penting:</h4><ul>
<li>Ketika nq kurang dari atau sama dengan 1.000, IVF_SQ8H melihat waktu kueri hampir dua kali lebih cepat dari IVFSQ8.</li>
<li>Ketika nq = 2000, waktu kueri untuk IVFSQ8H dan IVF_SQ8 adalah sama. Namun, jika parameter gpu_search_threshold lebih rendah dari 2000, IVF_SQ8H akan mengungguli IVF_SQ8.</li>
<li>Tingkat penarikan kueri IVF_SQ8H identik dengan IVF_SQ8, yang berarti lebih sedikit waktu kueri yang dicapai tanpa kehilangan akurasi pencarian.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">Pelajari lebih lanjut tentang Milvus, platform manajemen data vektor berskala besar.</h3><p>Milvus adalah platform manajemen data vektor yang dapat mendukung aplikasi pencarian kemiripan di berbagai bidang yang mencakup kecerdasan buatan, pembelajaran mendalam, perhitungan vektor tradisional, dan banyak lagi. Untuk informasi tambahan tentang Milvus, lihat sumber-sumber berikut:</p>
<ul>
<li>Milvus tersedia di bawah lisensi sumber terbuka di <a href="https://github.com/milvus-io/milvus">GitHub</a>.</li>
<li>Jenis indeks tambahan, termasuk indeks berbasis grafik dan pohon, didukung di Milvus. Untuk daftar lengkap jenis indeks yang didukung, lihat <a href="https://milvus.io/docs/v0.11.0/index.md">dokumentasi untuk indeks vektor</a> di Milvus.</li>
<li>Untuk mempelajari lebih lanjut tentang perusahaan yang meluncurkan Milvus, kunjungi <a href="https://zilliz.com/">Zilliz.com</a>.</li>
<li>Mengobrol dengan komunitas Milvus atau dapatkan bantuan untuk masalah di <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">Metodologi</h3><h4 id="Performance-testing-environment" class="common-anchor-header">Lingkungan pengujian kinerja</h4><p>Konfigurasi server yang digunakan di seluruh pengujian performa yang dirujuk dalam artikel ini adalah sebagai berikut:</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz, 24 core</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>Memori 768 GB</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">Konsep teknis yang relevan</h4><p>Meskipun tidak diperlukan untuk memahami artikel ini, berikut adalah beberapa konsep teknis yang berguna untuk menginterpretasikan hasil dari pengujian performa indeks kami:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mempercepat Pencarian Kemiripan pada Data yang Sangat Besar dengan Pengindeksan Vektor_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">Sumber daya</h4><p>Sumber-sumber berikut digunakan untuk artikel ini:</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Ensiklopedia sistem basis data</a>," Ling Liu dan M. Tamer Özsu.</li>
</ul>
