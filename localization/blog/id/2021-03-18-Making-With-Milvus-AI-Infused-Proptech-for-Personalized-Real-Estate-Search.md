---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: >-
  Membuat Dengan Milvus AI-Infused Proptech untuk Pencarian Real Estat yang
  Dipersonalisasi
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: >-
  AI mengubah industri real estat, temukan bagaimana proptech cerdas mempercepat
  proses pencarian dan pembelian rumah.
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>Membuat Dengan Milvus: Proptech yang Dipadukan dengan AI untuk Pencarian Real Estat yang Dipersonalisasi</custom-h1><p>Kecerdasan buatan (AI) memiliki <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">aplikasi yang kuat</a> dalam real estat yang mengubah proses pencarian rumah. Para profesional real estat yang paham teknologi telah memanfaatkan AI selama bertahun-tahun, mengakui kemampuannya untuk membantu klien menemukan rumah yang tepat dengan lebih cepat dan menyederhanakan proses pembelian properti. Pandemi virus corona telah <a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">mempercepat</a> minat, adopsi, dan investasi dalam teknologi properti (atau proptech) di seluruh dunia, menunjukkan bahwa teknologi ini akan memainkan peran yang semakin besar dalam industri real estat di masa mendatang.</p>
<p>Artikel ini membahas bagaimana <a href="https://bj.ke.com/">Beike</a> menggunakan pencarian kemiripan vektor untuk membangun platform pencarian rumah yang memberikan hasil yang dipersonalisasi dan merekomendasikan daftar properti secara real-time.</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">Apa itu pencarian kemiripan vektor?</h3><p><a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">Pencarian kemiripan vektor</a> memiliki aplikasi yang mencakup berbagai macam kecerdasan buatan, pembelajaran mendalam, dan skenario penghitungan vektor tradisional. Perkembangan teknologi AI sebagian disebabkan oleh pencarian vektor dan kemampuannya untuk memahami data yang tidak terstruktur, yang mencakup hal-hal seperti gambar, video, audio, data perilaku, dokumen, dan banyak lagi.</p>
<p>Data tidak terstruktur membentuk sekitar 80-90% dari semua data, dan penggalian wawasan dari data tersebut dengan cepat menjadi kebutuhan bisnis yang ingin tetap kompetitif di dunia yang terus berubah. Meningkatnya permintaan untuk analitik data yang tidak terstruktur, meningkatnya daya komputasi, dan menurunnya biaya komputasi telah membuat pencarian vektor dengan AI menjadi lebih mudah diakses daripada sebelumnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>Secara tradisional, data yang tidak terstruktur telah menjadi tantangan untuk diproses dan dianalisis dalam skala besar karena tidak mengikuti model atau struktur organisasi yang telah ditentukan sebelumnya. Jaringan syaraf (misalnya, CNN, RNN, dan BERT) memungkinkan untuk mengubah data yang tidak terstruktur menjadi vektor fitur, format data numerik yang dapat dengan mudah ditafsirkan oleh komputer. Algoritme kemudian digunakan untuk menghitung kemiripan antara vektor menggunakan metrik seperti kemiripan kosinus atau jarak Euclidean.</p>
<p>Pada akhirnya, pencarian kemiripan vektor adalah istilah yang luas yang menggambarkan teknik untuk mengidentifikasi hal-hal yang mirip dalam kumpulan data yang sangat besar. Beike menggunakan teknologi ini untuk menggerakkan mesin pencari rumah cerdas yang secara otomatis merekomendasikan daftar properti berdasarkan preferensi pengguna, riwayat pencarian, dan kriteria properti - mempercepat proses pencarian dan pembelian real estat. Milvus adalah basis data vektor sumber terbuka yang menghubungkan informasi dengan algoritme, sehingga memungkinkan Beike untuk mengembangkan dan mengelola platform real estat AI-nya.</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Bagaimana Milvus mengelola data vektor?</h3><p>Milvus dibangun secara khusus untuk manajemen data vektor berskala besar, dan memiliki aplikasi yang mencakup pencarian gambar dan video, analisis kemiripan bahan kimia, sistem rekomendasi yang dipersonalisasi, AI percakapan, dan banyak lagi. Kumpulan data vektor yang disimpan di Milvus dapat ditanyakan secara efisien, dengan sebagian besar implementasi mengikuti proses umum ini:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">Bagaimana Beike menggunakan Milvus untuk membuat pencarian rumah menjadi lebih cerdas?</h3><p>Umumnya digambarkan sebagai jawaban Tiongkok untuk Zillow, Beike adalah platform online yang memungkinkan agen real estat untuk mendaftarkan properti untuk disewakan atau dijual. Untuk membantu meningkatkan pengalaman pencarian rumah bagi para pemburu rumah, dan untuk membantu agen menyelesaikan transaksi lebih cepat, perusahaan ini membangun mesin pencari bertenaga AI untuk basis data daftarnya. Basis data daftar properti Beike diubah menjadi vektor fitur kemudian dimasukkan ke Milvus untuk diindeks dan disimpan. Milvus kemudian digunakan untuk melakukan pencarian kemiripan berdasarkan daftar input, kriteria pencarian, profil pengguna, atau kriteria lainnya.</p>
<p>Sebagai contoh, ketika mencari lebih banyak rumah yang mirip dengan daftar yang diberikan, fitur-fitur seperti denah lantai, ukuran, orientasi, finishing interior, warna cat, dan banyak lagi diekstraksi. Karena database asli dari daftar listing properti telah <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">diindeks</a>, pencarian dapat dilakukan dalam hitungan milidetik. Produk akhir Beike memiliki waktu kueri rata-rata 113 milidetik pada kumpulan data yang berisi lebih dari 3 juta vektor. Namun, Milvus mampu mempertahankan kecepatan yang efisien pada dataset berskala triliunan-membuat pekerjaan ringan pada basis data real estat yang relatif kecil ini. Secara umum, sistem ini mengikuti proses berikut:</p>
<ol>
<li><p>Model pembelajaran mendalam (misalnya, CNN, RNN, atau BERT) mengubah data yang tidak terstruktur menjadi vektor fitur, yang kemudian diimpor ke Milvus.</p></li>
<li><p>Milvus menyimpan dan mengindeks vektor fitur.</p></li>
<li><p>Milvus mengembalikan hasil pencarian kemiripan berdasarkan pertanyaan pengguna.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>milvus-overview-diagram.png</span> </span></p>
<p><br/></p>
<p>Platform pencarian real estat cerdas Beike didukung oleh algoritma rekomendasi yang menghitung kemiripan vektor menggunakan jarak kosinus. Sistem ini menemukan rumah yang mirip berdasarkan daftar favorit dan kriteria pencarian. Pada tingkat tinggi, cara kerjanya adalah sebagai berikut:</p>
<ol>
<li><p>Berdasarkan daftar input, karakteristik seperti denah, ukuran, dan orientasi digunakan untuk mengekstrak 4 koleksi vektor fitur.</p></li>
<li><p>Koleksi fitur yang diekstrak digunakan untuk melakukan pencarian kemiripan di Milvus. Hasil dari pencarian untuk setiap koleksi vektor adalah ukuran kemiripan antara daftar input dengan daftar lain yang serupa.</p></li>
<li><p>Hasil pencarian dari masing-masing 4 koleksi vektor dibandingkan dan kemudian digunakan untuk merekomendasikan rumah yang serupa.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p><br/></p>
<p>Seperti yang ditunjukkan oleh gambar di atas, sistem ini mengimplementasikan mekanisme peralihan tabel A/B untuk memperbarui data. Milvus menyimpan data untuk T hari pertama di tabel A, pada hari T+1 mulai menyimpan data di tabel B, pada hari ke-2T+1, mulai menulis ulang tabel A, dan seterusnya.</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">Untuk mempelajari lebih lanjut tentang membuat sesuatu dengan Milvus, lihat sumber-sumber berikut:</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">Membangun Asisten Penulisan Bertenaga AI untuk WPS Office</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Membuat dengan Milvus: Rekomendasi Berita Bertenaga AI di Dalam Peramban Seluler Xiaomi</a></p></li>
</ul>
