---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: Mengekstrak Sorotan Acara Menggunakan Aplikasi Olahraga iYUNDONG
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: >-
  Membuat dengan sistem pengambilan gambar cerdas Milvus untuk aplikasi olahraga
  iYUNDONG
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>Mengekstrak Sorotan Acara Menggunakan Aplikasi Olahraga iYUNDONG</custom-h1><p>iYUNDONG adalah perusahaan Internet yang bertujuan untuk melibatkan lebih banyak pecinta olahraga dan peserta acara seperti lomba maraton. Perusahaan ini membangun alat <a href="https://en.wikipedia.org/wiki/Artificial_intelligence">kecerdasan buatan (AI)</a> yang dapat menganalisis media yang diambil selama acara olahraga untuk menghasilkan sorotan secara otomatis. Misalnya, dengan mengunggah foto selfie, pengguna Aplikasi olahraga iYUNDONG yang ikut serta dalam acara olahraga dapat langsung mengambil foto atau klip videonya sendiri dari kumpulan data media yang sangat besar dari acara tersebut.</p>
<p>Salah satu fitur utama dari Aplikasi iYUNDONG disebut "Temukan saya saat bergerak".  Fotografer biasanya mengambil banyak sekali foto atau video selama acara olahraga seperti lomba maraton, dan akan mengunggah foto dan video tersebut secara real time ke basis data media iYUNDONG. Pelari maraton yang ingin melihat momen-momen penting mereka dapat mengambil foto-foto termasuk diri mereka sendiri hanya dengan mengunggah salah satu foto selfie mereka. Hal ini menghemat banyak waktu karena sistem pengambilan gambar di Aplikasi iYUNDONG melakukan semua pencocokan gambar. <a href="https://milvus.io/">Milvus</a> diadopsi oleh iYUNDONG untuk mendukung sistem ini karena Milvus dapat mempercepat proses pengambilan gambar dan memberikan hasil yang sangat akurat.</p>
<p><br/></p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">Mengekstrak Sorotan Acara Menggunakan Aplikasi Olahraga iYUNDONG</a><ul>
<li><a href="#difficulties-and-solutions">Kesulitan dan solusi</a></li>
<li><a href="#what-is-milvus">Apa itu Milvus</a>- <a href="#an-overview-of-milvus"><em>Gambaran umum tentang Milvus.</em></a></li>
<li><a href="#why-milvus">Mengapa Milvus</a></li>
<li><a href="#system-and-workflow">Sistem dan Alur Kerja</a></li>
<li><a href="#iyundong-app-interface">Antarmuka Aplikasi iYUNDONG</a>- <a href="#iyundong-app-interface-1"><em>Antarmuka aplikasi iYUNDONG.</em></a></li>
<li><a href="#conclusion">Kesimpulan</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">Kesulitan dan solusi</h3><p>iYUNDONG menghadapi masalah-masalah berikut ini dan berhasil menemukan solusi yang sesuai ketika membangun sistem pengambilan gambarnya.</p>
<ul>
<li>Foto acara harus segera tersedia untuk pencarian.</li>
</ul>
<p>iYUNDONG mengembangkan fungsi yang disebut InstantUpload untuk memastikan bahwa foto acara tersedia untuk pencarian segera setelah diunggah.</p>
<ul>
<li>Penyimpanan kumpulan data yang sangat besar</li>
</ul>
<p>Data besar seperti foto dan video diunggah ke backend iYUNDONG setiap milidetik. Jadi iYUNDONG memutuskan untuk bermigrasi ke sistem penyimpanan cloud termasuk <a href="https://aws.amazon.com/">AWS</a>, <a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a>, dan <a href="https://www.alibabacloud.com/product/oss">Alibaba Cloud Object Storage Service (OSS</a> ) untuk menangani volume besar data yang tidak terstruktur dengan cara yang aman, cepat, dan andal.</p>
<ul>
<li>Pembacaan instan</li>
</ul>
<p>Untuk mencapai pembacaan instan, iYUNDONG mengembangkan middleware sharding sendiri untuk mencapai skalabilitas horizontal dengan mudah dan mengurangi dampak pada sistem dari pembacaan disk. Selain itu, <a href="https://redis.io/">Redis</a> digunakan sebagai lapisan caching untuk memastikan kinerja yang konsisten dalam situasi konkurensi tinggi.</p>
<ul>
<li>Ekstraksi fitur wajah secara instan</li>
</ul>
<p>Untuk mengekstrak fitur wajah secara akurat dan efisien dari foto yang diunggah pengguna, iYUNDONG mengembangkan algoritme konversi gambar eksklusif yang mengubah gambar menjadi vektor fitur 128 dimensi. Masalah lain yang dihadapi adalah, seringkali, banyak pengguna dan fotografer mengunggah gambar atau video secara bersamaan. Jadi, insinyur sistem perlu mempertimbangkan skalabilitas dinamis saat menerapkan sistem. Lebih khusus lagi, iYUNDONG sepenuhnya memanfaatkan layanan komputasi elastis (ECS) di cloud untuk mencapai penskalaan dinamis.</p>
<ul>
<li>Pencarian vektor yang cepat dan berskala besar</li>
</ul>
<p>iYUNDONG membutuhkan basis data vektor untuk menyimpan sejumlah besar vektor fitur yang diekstraksi oleh model AI. Menurut skenario aplikasi bisnisnya yang unik, iYUNDONG mengharapkan database vektor dapat</p>
<ol>
<li>Melakukan pengambilan vektor yang sangat cepat pada kumpulan data yang sangat besar.</li>
<li>Mencapai penyimpanan massal dengan biaya lebih rendah.</li>
</ol>
<p>Awalnya, rata-rata 1 juta gambar diproses setiap tahun, jadi iYUNDONG menyimpan semua datanya untuk pencarian dalam RAM. Namun, dalam dua tahun terakhir, bisnisnya berkembang pesat dan melihat pertumbuhan eksponensial dari data yang tidak terstruktur - jumlah gambar dalam database iYUNDONG melebihi 60 juta pada tahun 2019, yang berarti ada lebih dari 1 miliar vektor fitur yang perlu disimpan. Jumlah data yang sangat besar tak pelak membuat sistem iYUNDONG menjadi sangat besar dan menghabiskan banyak sumber daya. Jadi, ia harus terus berinvestasi dalam fasilitas perangkat keras untuk memastikan kinerja yang tinggi. Secara khusus, iYUNDONG menggunakan lebih banyak server pencarian, RAM yang lebih besar, dan CPU yang berkinerja lebih baik untuk mencapai efisiensi yang lebih besar dan skalabilitas horizontal. Namun, salah satu kekurangan dari solusi ini adalah bahwa solusi ini membuat biaya operasional menjadi sangat tinggi. Oleh karena itu, iYUNDONG mulai mengeksplorasi solusi yang lebih baik untuk masalah ini dan merenungkan untuk memanfaatkan pustaka indeks vektor seperti Faiss untuk menghemat biaya dan mengarahkan bisnisnya dengan lebih baik. Akhirnya iYUNDONG memilih basis data vektor sumber terbuka Milvus.</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">Apa itu Milvus</h3><p>Milvus adalah database vektor sumber terbuka yang mudah digunakan, sangat fleksibel, dapat diandalkan, dan sangat cepat. Dikombinasikan dengan berbagai model pembelajaran mendalam seperti pengenalan foto dan suara, pemrosesan video, pemrosesan bahasa alami, Milvus dapat memproses dan menganalisis data tidak terstruktur yang diubah menjadi vektor dengan menggunakan berbagai algoritme AI. Di bawah ini adalah alur kerja bagaimana Milvus memproses semua data yang tidak terstruktur:</p>
<p>Data tidak terstruktur diubah menjadi vektor penyisipan dengan model pembelajaran mendalam atau algoritme AI lainnya.</p>
<p>Kemudian vektor penyisipan dimasukkan ke dalam Milvus untuk disimpan. Milvus juga membangun indeks untuk vektor-vektor tersebut.</p>
<p>Milvus melakukan pencarian kemiripan dan mengembalikan hasil pencarian yang akurat berdasarkan berbagai kebutuhan bisnis.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>Blog iYUNDONG 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">Mengapa Milvus</h3><p>Sejak akhir tahun 2019, iYUNDONG telah melakukan serangkaian pengujian menggunakan Milvus untuk memperkuat sistem pencarian gambar. Hasil pengujian menunjukkan bahwa Milvus mengungguli basis data vektor arus utama lainnya karena mendukung banyak indeks dan secara efisien dapat mengurangi penggunaan RAM, secara signifikan memampatkan waktu untuk pencarian kesamaan vektor.</p>
<p>Selain itu, versi baru Milvus dirilis secara teratur. Selama periode pengujian, Milvus telah mengalami beberapa kali pembaruan versi dari v0.6.0 hingga v0.10.1.</p>
<p>Selain itu, dengan komunitas open-source yang aktif dan fitur-fitur out-of-the-box yang kuat, Milvus memungkinkan iYUNDONG untuk beroperasi dengan anggaran pengembangan yang ketat.</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">Sistem dan Alur Kerja</h3><p>Sistem iYUNDONG mengekstrak fitur wajah dengan mendeteksi wajah dalam foto acara yang diunggah oleh fotografer terlebih dahulu. Kemudian fitur-fitur wajah tersebut diubah menjadi vektor 128 dimensi dan disimpan di perpustakaan Milvus. Milvus membuat indeks untuk vektor-vektor tersebut dan secara instan dapat memberikan hasil yang sangat akurat.</p>
<p>Informasi tambahan lainnya seperti ID foto dan koordinat yang menunjukkan posisi wajah dalam foto disimpan dalam basis data pihak ketiga.</p>
<p>Setiap vektor fitur memiliki ID uniknya di perpustakaan Milvus. iYUNDONG mengadopsi <a href="https://github.com/Meituan-Dianping/Leaf">algoritme Leaf</a>, layanan pembuatan ID terdistribusi yang dikembangkan oleh platform R&amp;D dasar <a href="https://about.meituan.com/en">Meituan</a>, untuk mengaitkan ID vektor di Milvus dengan informasi tambahan terkait yang disimpan di database lain. Dengan menggabungkan vektor fitur dan informasi tambahan, sistem iYUNDONG dapat memberikan hasil yang serupa pada pencarian pengguna.</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">Antarmuka Aplikasi iYUNDONG</h3><p>Serangkaian acara olahraga terbaru terdaftar di beranda. Dengan mengetuk salah satu acara, pengguna dapat melihat detail lengkapnya.</p>
<p>Setelah mengetuk tombol di bagian atas halaman galeri foto, pengguna kemudian dapat mengunggah foto mereka sendiri untuk mengambil gambar sorotan mereka.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interface.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Kesimpulan</h3><p>Artikel ini memperkenalkan bagaimana Aplikasi iYUNDONG membangun sistem pencarian gambar cerdas yang dapat mengembalikan hasil pencarian yang akurat berdasarkan foto yang diunggah pengguna yang bervariasi dalam resolusi, ukuran, kejelasan, sudut, dan cara-cara lain yang memperumit pencarian kemiripan. Dengan bantuan Milvus, Aplikasi iYUNDONG dapat berhasil menjalankan kueri tingkat milidetik pada basis data yang terdiri dari 60+ juta gambar. Dan tingkat akurasi pengambilan foto secara konstan di atas 92%. Milvus memudahkan iYUNDONG untuk membuat sistem pencarian gambar yang kuat dan berkelas perusahaan dalam waktu singkat dengan sumber daya yang terbatas.</p>
<p>Baca <a href="https://zilliz.com/user-stories">kisah pengguna</a> lain untuk mempelajari lebih lanjut tentang membuat sesuatu dengan Milvus.</p>
