---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: Membangun Pengalaman Berbelanja Berdasarkan Gambar dengan VOVA dan Milvus
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: >-
  Ketahui bagaimana Milvus, basis data vektor sumber terbuka, digunakan oleh
  platform e-commerce VOVA untuk mendukung belanja berdasarkan gambar.
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>Membangun Pengalaman Berbelanja Berdasarkan Gambar dengan VOVA dan Milvus</custom-h1><p>Langsung ke:</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">Membangun Pengalaman Berbelanja Berdasarkan Gambar dengan VOVA dan Milvus</a><ul>
<li><a href="#how-does-image-search-work">Bagaimana cara kerja pencarian gambar?</a>- <a href="#system-process-of-vovas-search-by-image-functionality"><em>Proses sistem dari fungsi pencarian berdasarkan gambar VOVA.</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">Deteksi target menggunakan model YOLO</a>- <a href="#yolo-network-architecture"><em>Arsitektur jaringan YOLO</em></a>.</li>
<li><a href="#image-feature-vector-extraction-with-resnet">Ekstraksi vektor fitur gambar dengan ResNet</a>- <a href="#resnet-structure"><em>Struktur ResNet</em></a>.</li>
<li><a href="#vector-similarity-search-powered-by-milvus">Pencarian kemiripan vektor yang didukung oleh Milvus</a>- <a href="#mishards-architecture-in-milvus"><em>Arsitektur Mishards dalam Milvus</em></a>.</li>
<li><a href="#vovas-shop-by-image-tool">Alat belanja berdasarkan gambar VOVA</a>- Tangkapan <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>layar pencarian VOVA berdasarkan alat belanja gambar.</em></a></li>
<li><a href="#reference">Referensi</a></li>
</ul></li>
</ul>
<p>Belanja online melonjak pada tahun 2020, <a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">naik 44%</a> sebagian besar karena pandemi virus corona. Ketika orang-orang berusaha menjaga jarak secara sosial dan menghindari kontak dengan orang asing, pengiriman tanpa kontak menjadi pilihan yang sangat diminati oleh banyak konsumen. Popularitas ini juga menyebabkan orang membeli lebih banyak variasi barang secara online, termasuk barang-barang khusus yang sulit dideskripsikan dengan pencarian kata kunci tradisional.</p>
<p>Untuk membantu pengguna mengatasi keterbatasan kueri berbasis kata kunci, perusahaan dapat membangun mesin pencari gambar yang memungkinkan pengguna untuk menggunakan gambar alih-alih kata-kata untuk pencarian. Hal ini tidak hanya memungkinkan pengguna untuk menemukan barang yang sulit dideskripsikan, tetapi juga membantu mereka berbelanja barang-barang yang mereka temui di kehidupan nyata. Fungsionalitas ini membantu membangun pengalaman pengguna yang unik dan menawarkan kenyamanan umum yang dihargai pelanggan.</p>
<p>VOVA adalah platform e-commerce baru yang berfokus pada keterjangkauan harga dan menawarkan pengalaman berbelanja yang positif bagi penggunanya, dengan daftar yang mencakup jutaan produk dan dukungan untuk 20 bahasa dan 35 mata uang utama. Untuk meningkatkan pengalaman berbelanja bagi para penggunanya, perusahaan ini menggunakan Milvus untuk membangun fungsionalitas pencarian gambar ke dalam platform e-niaga mereka. Artikel ini membahas bagaimana VOVA berhasil membangun mesin pencari gambar dengan Milvus.</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">Bagaimana cara kerja pencarian gambar?</h3><p>Sistem toko berdasarkan gambar VOVA mencari inventaris perusahaan untuk menemukan gambar produk yang mirip dengan unggahan pengguna. Bagan berikut ini menunjukkan dua tahap proses sistem, tahap impor data (biru) dan tahap kueri (oranye):</p>
<ol>
<li>Gunakan model YOLO untuk mendeteksi target dari foto yang diunggah;</li>
<li>Gunakan ResNet untuk mengekstrak vektor fitur dari target yang terdeteksi;</li>
<li>Gunakan Milvus untuk pencarian kemiripan vektor.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">Deteksi target menggunakan model YOLO</h3><p>Aplikasi seluler VOVA di Android dan iOS saat ini mendukung pencarian gambar. Perusahaan ini menggunakan sistem deteksi objek real-time yang canggih yang disebut YOLO (Anda hanya melihat sekali) untuk mendeteksi objek dalam gambar yang diunggah pengguna. Model YOLO saat ini berada pada iterasi kelima.</p>
<p>YOLO adalah model satu tahap, hanya menggunakan satu jaringan saraf convolutional (CNN) untuk memprediksi kategori dan posisi target yang berbeda. Model ini kecil, ringkas, dan sangat cocok untuk penggunaan seluler.</p>
<p>YOLO menggunakan lapisan konvolusi untuk mengekstrak fitur dan lapisan yang terhubung sepenuhnya untuk mendapatkan nilai prediksi. Mengambil inspirasi dari model GooLeNet, CNN YOLO memiliki 24 lapisan konvolusi dan dua lapisan yang terhubung penuh.</p>
<p>Seperti yang ditunjukkan pada ilustrasi berikut, gambar input berukuran 448 × 448 dikonversi oleh sejumlah lapisan konvolusi dan lapisan penyatuan ke tensor 7 × 7 × 1024 dimensi (digambarkan pada kubus ketiga hingga terakhir di bawah), dan kemudian dikonversi oleh dua lapisan yang terhubung penuh ke output tensor 7 × 7 × 30 dimensi.</p>
<p>Hasil prediksi dari YOLO P adalah tensor dua dimensi, yang bentuknya adalah [batch,7 ×7 ×30]. Dengan menggunakan slicing, P[:,0:7 × 7 × 20] adalah probabilitas kategori, P[:,7 × 7 × 20:7 × 7 × (20 + 2)] adalah kepercayaan, dan P[:,7 × 7 × (20 + 2)]:] adalah hasil prediksi dari kotak pembatas.</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;Arsitektur jaringan YOLO.)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">Ekstraksi vektor fitur gambar dengan ResNet</h3><p>VOVA mengadopsi model jaringan saraf sisa (ResNet) untuk mengekstrak vektor fitur dari perpustakaan gambar produk yang luas dan foto yang diunggah pengguna. ResNet terbatas karena dengan bertambahnya kedalaman jaringan pembelajaran, akurasi jaringan akan berkurang. Gambar di bawah ini menggambarkan ResNet yang menjalankan model VGG19 (varian dari model VGG) yang dimodifikasi untuk menyertakan unit residu melalui mekanisme hubung singkat. VGG diusulkan pada tahun 2014 dan hanya mencakup 14 lapisan, sementara ResNet keluar setahun kemudian dan dapat memiliki hingga 152 lapisan.</p>
<p>Struktur ResNet mudah dimodifikasi dan diskalakan. Dengan mengubah jumlah saluran dalam blok dan jumlah blok yang ditumpuk, lebar dan kedalaman jaringan dapat dengan mudah disesuaikan untuk mendapatkan jaringan dengan kemampuan ekspresif yang berbeda. Hal ini secara efektif mengatasi efek degenerasi jaringan, di mana akurasi menurun seiring dengan meningkatnya kedalaman pembelajaran. Dengan data pelatihan yang cukup, model dengan kinerja ekspresif yang lebih baik dapat diperoleh sambil memperdalam jaringan secara bertahap. Melalui pelatihan model, fitur diekstraksi untuk setiap gambar dan dikonversi ke vektor floating point 256 dimensi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Pencarian kemiripan vektor yang didukung oleh Milvus</h3><p>Basis data gambar produk VOVA mencakup 30 juta gambar dan terus bertambah dengan cepat. Untuk mengambil gambar produk yang paling mirip dengan cepat dari kumpulan data yang sangat besar ini, Milvus digunakan untuk melakukan pencarian kemiripan vektor. Berkat sejumlah pengoptimalan, Milvus menawarkan pendekatan yang cepat dan efisien untuk mengelola data vektor dan membangun aplikasi pembelajaran mesin. Milvus menawarkan integrasi dengan pustaka indeks populer (misalnya, Faiss, Annoy), mendukung berbagai jenis indeks dan metrik jarak, memiliki SDK dalam berbagai bahasa, dan menyediakan API yang kaya untuk mengelola data vektor.</p>
<p>Milvus dapat melakukan pencarian kemiripan pada kumpulan data vektor triliunan dalam hitungan milidetik, dengan waktu kueri di bawah 1,5 detik saat nq = 1 dan waktu kueri batch rata-rata di bawah 0,08 detik. Untuk membangun mesin pencari gambarnya, VOVA mengacu pada desain Mishards, solusi middleware sharding Milvus (lihat bagan di bawah ini untuk desain sistemnya), untuk mengimplementasikan klaster server yang sangat tersedia. Dengan memanfaatkan skalabilitas horizontal cluster Milvus, persyaratan proyek untuk kinerja kueri yang tinggi pada kumpulan data yang sangat besar dapat dipenuhi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">Toko VOVA dengan alat gambar</h3><p>Tangkapan layar di bawah ini menunjukkan pencarian VOVA dengan alat belanja gambar pada aplikasi Android perusahaan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>Seiring dengan semakin banyaknya pengguna yang mencari produk dan mengunggah foto, VOVA akan terus mengoptimalkan model-model yang mendukung sistem. Selain itu, perusahaan akan memasukkan fungsionalitas Milvus baru yang dapat lebih meningkatkan pengalaman belanja online penggunanya.</p>
<h3 id="Reference" class="common-anchor-header">Referensi</h3><p><strong>YOLO:</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet:</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus:</strong></p>
<p>https://milvus.io/docs</p>
