---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: >-
  Mempercepat Kompilasi 2.5X dengan Pemisahan Ketergantungan &amp;
  Kontainerisasi Pengujian
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: >-
  Temukan bagaimana zilliz mengurangi waktu kompilasi 2,5x menggunakan teknik
  pemisahan ketergantungan dan kontainerisasi untuk proyek AI dan MLOps berskala
  besar.
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>Mempercepat Kompilasi 2,5X dengan Pemisahan Ketergantungan &amp; Kontainerisasi Pengujian</custom-h1><p>Waktu kompilasi dapat diperparah dengan ketergantungan internal dan eksternal yang kompleks yang berkembang selama proses pengembangan, serta perubahan lingkungan kompilasi seperti sistem operasi atau arsitektur perangkat keras. Berikut ini adalah masalah umum yang mungkin ditemui saat mengerjakan proyek AI atau MLOps berskala besar:</p>
<p><strong>Kompilasi yang sangat lama</strong> - Integrasi kode dilakukan ratusan kali setiap hari. Dengan ratusan ribu baris kode yang ada, bahkan perubahan kecil pun dapat menghasilkan kompilasi penuh yang biasanya memakan waktu satu jam atau lebih.</p>
<p><strong>Lingkungan kompilasi yang kompleks</strong> - Kode proyek perlu dikompilasi di bawah lingkungan yang berbeda, yang melibatkan sistem operasi yang berbeda, seperti CentOS dan Ubuntu, ketergantungan yang mendasarinya, seperti GCC, LLVM, dan CUDA, dan arsitektur perangkat keras. Dan kompilasi di bawah lingkungan tertentu biasanya tidak dapat bekerja di lingkungan yang berbeda.</p>
<p><strong>Ketergantungan yang kompleks</strong> - Kompilasi proyek melibatkan lebih dari 30 ketergantungan antar-komponen dan pihak ketiga. Pengembangan proyek sering kali menyebabkan perubahan pada ketergantungan, yang pasti menyebabkan konflik ketergantungan. Kontrol versi antara dependensi sangat kompleks sehingga memperbarui versi dependensi akan dengan mudah mempengaruhi komponen lain.</p>
<p>Pengunduhan<strong>dependensi pihak ketiga lambat atau gagal</strong> - Penundaan jaringan atau pustaka dependensi pihak ketiga yang tidak stabil menyebabkan pengunduhan sumber daya yang lambat atau kegagalan akses, yang secara serius mempengaruhi integrasi kode.</p>
<p>Dengan memisahkan ketergantungan dan menerapkan kontainerisasi pengujian, kami berhasil mengurangi waktu kompilasi rata-rata sebesar 60% saat mengerjakan proyek pencarian kesamaan embedding sumber terbuka <a href="https://milvus.io/">Milvus</a>.</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">Memisahkan ketergantungan proyek</h3><p>Kompilasi proyek biasanya melibatkan sejumlah besar ketergantungan komponen internal dan eksternal. Semakin banyak ketergantungan yang dimiliki sebuah proyek, semakin rumit untuk mengelolanya. Seiring dengan pertumbuhan perangkat lunak, akan semakin sulit dan mahal untuk mengubah atau menghapus ketergantungan, serta mengidentifikasi efek dari hal tersebut. Pemeliharaan rutin diperlukan selama proses pengembangan untuk memastikan dependensi berfungsi dengan baik. Pemeliharaan yang buruk, dependensi yang kompleks, atau dependensi yang salah dapat menyebabkan konflik yang memperlambat atau menghentikan pengembangan. Dalam praktiknya, hal ini dapat berarti pengunduhan sumber daya yang lambat, kegagalan akses yang berdampak negatif pada integrasi kode, dan banyak lagi. Memisahkan dependensi proyek dapat mengurangi cacat dan mengurangi waktu kompilasi, mempercepat pengujian sistem, dan menghindari hambatan yang tidak perlu pada pengembangan perangkat lunak.</p>
<p>Oleh karena itu, kami merekomendasikan untuk memisahkan ketergantungan proyek Anda:</p>
<ul>
<li>Pisahkan komponen dengan ketergantungan yang kompleks</li>
<li>Gunakan repositori yang berbeda untuk manajemen versi.</li>
<li>Gunakan file konfigurasi untuk mengelola informasi versi, opsi kompilasi, ketergantungan, dll.</li>
<li>Tambahkan file konfigurasi ke pustaka komponen sehingga mereka diperbarui saat proyek beriterasi.</li>
</ul>
<p>Kompilasi<strong>optimasi antar komponen</strong> - Tarik dan kompilasi komponen yang relevan sesuai dengan ketergantungan dan opsi kompilasi yang dicatat dalam file konfigurasi. Tandai dan kemas hasil kompilasi biner dan berkas manifes yang sesuai, lalu unggah ke repositori pribadi Anda. Jika tidak ada perubahan yang dilakukan pada komponen atau komponen yang bergantung padanya, mainkan hasil kompilasi sesuai dengan file manifes. Untuk masalah seperti penundaan jaringan atau pustaka ketergantungan pihak ketiga yang tidak stabil, coba siapkan repositori internal atau gunakan repositori cermin.</p>
<p>Untuk mengoptimalkan kompilasi antar komponen:</p>
<p>1. Buat grafik hubungan ketergantungan - Gunakan file konfigurasi di pustaka komponen untuk membuat grafik hubungan ketergantungan. Gunakan hubungan ketergantungan untuk mengambil informasi versi (Cabang Git, Tag, dan ID komit Git) dan opsi kompilasi serta lebih banyak lagi dari komponen yang bergantung pada hulu dan hilir.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>2<strong>. Periksa ketergantungan</strong> - Menghasilkan peringatan untuk ketergantungan melingkar, konflik versi, dan masalah lain yang muncul di antara komponen.</p>
<p>3<strong>. Ratakan depend</strong> ensi - Urutkan dependensi berdasarkan Depth First Search (DFS) dan gabungkan komponen dengan dependensi duplikat untuk membentuk grafik dependensi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>4. Gunakan algoritma MerkleTree untuk menghasilkan hash (Root Hash) yang berisi dependensi setiap komponen berdasarkan informasi versi, opsi kompilasi, dan banyak lagi. Dikombinasikan dengan informasi seperti nama komponen, algoritme ini membentuk tag unik untuk setiap komponen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>5. Berdasarkan informasi tag unik komponen, periksa apakah arsip kompilasi yang sesuai ada di repo pribadi. Jika arsip kompilasi diambil, unzip untuk mendapatkan berkas manifes untuk pemutaran; jika tidak, kompilasi komponen, tandai berkas objek kompilasi dan berkas manifes yang dihasilkan, lalu unggah ke repo pribadi.</p>
<p><br/></p>
<p><strong>Menerapkan pengoptimalan kompilasi di dalam komponen</strong> - Pilih alat cache kompilasi khusus bahasa untuk menyimpan file objek yang dikompilasi, lalu unggah dan simpan di repositori pribadi Anda. Untuk kompilasi C/C++, pilih alat cache kompilasi seperti CCache untuk menyimpan cache file perantara kompilasi C/C++, dan kemudian mengarsipkan cache CCache lokal setelah kompilasi. Alat cache kompilasi semacam itu hanya menyimpan file kode yang diubah satu per satu setelah kompilasi, dan menyalin komponen yang dikompilasi dari file kode yang tidak berubah sehingga mereka dapat langsung terlibat dalam kompilasi akhir. Optimalisasi kompilasi dalam komponen mencakup langkah-langkah berikut:</p>
<ol>
<li>Tambahkan dependensi kompilasi yang diperlukan ke Dockerfile. Gunakan Hadolint untuk melakukan pemeriksaan kepatuhan pada Dockerfile untuk memastikan bahwa citra sesuai dengan praktik terbaik Docker.</li>
<li>Cerminkan lingkungan kompilasi sesuai dengan versi sprint proyek (versi + build), sistem operasi, dan informasi lainnya.</li>
<li>Jalankan kontainer lingkungan kompilasi yang dicerminkan, dan transfer ID citra ke kontainer sebagai variabel lingkungan. Berikut ini contoh perintah untuk mendapatkan ID citra: "docker inspect ' - type=image' - format '{{.ID}}' repository/build-env:v0.1-centos7".</li>
<li>Pilih alat cache kompilasi yang sesuai: Masukkan penampung Anda untuk mengintegrasikan dan mengkompilasi kode-kode Anda dan periksa di repositori pribadi Anda apakah cache kompilasi yang sesuai tersedia. Jika ya, unduh dan ekstrak ke direktori yang ditentukan. Setelah semua komponen dikompilasi, cache yang dihasilkan oleh alat compile cache akan dikemas dan diunggah ke repositori pribadi Anda berdasarkan versi proyek dan ID gambar.</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">Pengoptimalan kompilasi lebih lanjut</h3><p>Pada awalnya, kompilasi yang kami buat menghabiskan terlalu banyak ruang disk dan bandwidth jaringan, serta membutuhkan waktu yang lama untuk digunakan, sehingga kami mengambil langkah-langkah berikut ini:</p>
<ol>
<li>Pilih gambar dasar yang paling ramping untuk mengurangi ukuran gambar, misalnya alpine, busybox, dll.</li>
<li>Kurangi jumlah lapisan gambar. Gunakan kembali dependensi sebanyak mungkin. Gabungkan beberapa perintah dengan "&amp;&amp;".</li>
<li>Bersihkan produk antara selama pembuatan gambar.</li>
<li>Gunakan cache gambar untuk membangun gambar sebanyak mungkin.</li>
</ol>
<p>Saat proyek kami terus berjalan, penggunaan disk dan sumber daya jaringan mulai melonjak seiring bertambahnya cache kompilasi, sementara beberapa cache kompilasi kurang dimanfaatkan. Kami kemudian melakukan penyesuaian berikut ini:</p>
<p>Bersihkan<strong>file cache secara teratur</strong> - Periksa repositori pribadi secara teratur (menggunakan skrip misalnya), dan bersihkan file cache yang tidak berubah selama beberapa saat atau tidak banyak diunduh.</p>
<p>Tembolok<strong>kompilasi secara selektif</strong> - Hanya tembolok kompilasi yang membutuhkan sumber daya, dan lewati tembolok kompilasi yang tidak membutuhkan banyak sumber daya.</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">Memanfaatkan pengujian dalam kontainer untuk mengurangi kesalahan, meningkatkan stabilitas dan keandalan</h3><p>Kode harus dikompilasi di lingkungan yang berbeda, yang melibatkan berbagai sistem operasi (misalnya CentOS dan Ubuntu), ketergantungan yang mendasari (misalnya GCC, LLVM, dan CUDA), dan arsitektur perangkat keras tertentu. Kode yang berhasil dikompilasi di lingkungan tertentu akan gagal di lingkungan yang berbeda. Dengan menjalankan pengujian di dalam kontainer, proses pengujian menjadi lebih cepat dan akurat.</p>
<p>Kontainerisasi memastikan bahwa lingkungan pengujian konsisten, dan aplikasi bekerja seperti yang diharapkan. Pendekatan pengujian dalam kontainer mengemas pengujian sebagai kontainer gambar dan membangun lingkungan pengujian yang benar-benar terisolasi. Penguji kami menemukan bahwa pendekatan ini sangat berguna, yang pada akhirnya mengurangi waktu kompilasi sebanyak 60%.</p>
<p><strong>Memastikan lingkungan kompilasi yang konsisten</strong> - Karena produk yang dikompilasi sensitif terhadap perubahan lingkungan sistem, kesalahan yang tidak diketahui dapat terjadi pada sistem operasi yang berbeda. Kami harus menandai dan mengarsipkan cache produk yang dikompilasi sesuai dengan perubahan lingkungan kompilasi, tetapi sulit untuk dikategorikan. Jadi kami memperkenalkan teknologi kontainerisasi untuk menyatukan lingkungan kompilasi untuk menyelesaikan masalah tersebut.</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Kesimpulan</h3><p>Dengan menganalisis ketergantungan proyek, artikel ini memperkenalkan berbagai metode untuk pengoptimalan kompilasi di antara dan di dalam komponen, memberikan ide dan praktik terbaik untuk membangun integrasi kode berkelanjutan yang stabil dan efisien. Metode-metode ini membantu mengatasi integrasi kode yang lambat yang disebabkan oleh ketergantungan yang kompleks, menyatukan operasi di dalam kontainer untuk memastikan konsistensi lingkungan, dan meningkatkan efisiensi kompilasi melalui pemutaran hasil kompilasi dan penggunaan alat cache kompilasi untuk menyimpan hasil kompilasi antara.</p>
<p>Praktik-praktik yang disebutkan di atas telah mengurangi waktu kompilasi proyek sebesar rata-rata 60%, sehingga meningkatkan efisiensi integrasi kode secara keseluruhan. Ke depannya, kami akan terus memparalelkan kompilasi antara dan di dalam komponen untuk mengurangi waktu kompilasi lebih lanjut.</p>
<p><br/></p>
<p><em>Sumber-sumber berikut digunakan untuk artikel ini:</em></p>
<ul>
<li>"Memisahkan Pohon Sumber ke dalam Komponen Tingkat Pembuatan"</li>
<li>"<a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">Faktor-faktor yang perlu dipertimbangkan ketika menambahkan dependensi pihak ketiga ke dalam sebuah proyek</a>"</li>
<li>"<a href="https://queue.acm.org/detail.cfm?id=3344149">Ketergantungan Perangkat Lunak yang Bertahan</a>"</li>
<li>"<a href="https://www.cc.gatech.edu/~beki/t1.pdf">Memahami Ketergantungan: Sebuah Studi tentang Tantangan Koordinasi dalam Pengembangan Perangkat Lunak</a>"</li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">Tentang penulis</h3><p>Zhifeng Zhang adalah insinyur senior DevOps di Zilliz.com yang bekerja di Milvus, database vektor sumber terbuka, dan instruktur resmi universitas perangkat lunak sumber terbuka LF di Tiongkok. Ia menerima gelar sarjana di bidang Internet of Things (IOT) dari Institut Rekayasa Perangkat Lunak Guangzhou. Dia menghabiskan karirnya dengan berpartisipasi dan memimpin proyek-proyek di bidang CI/CD, DevOps, manajemen infrastruktur TI, perangkat Cloud-Native, kontainerisasi, dan pengoptimalan proses kompilasi.</p>
