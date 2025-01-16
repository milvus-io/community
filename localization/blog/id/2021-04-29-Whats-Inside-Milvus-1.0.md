---
id: Whats-Inside-Milvus-1.0.md
title: Apa yang Ada di Dalam Milvus 1.0?
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: >-
  Milvus v1.0 telah tersedia sekarang. Pelajari tentang dasar-dasar Milvus serta
  fitur-fitur utama Milvus v1.0.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>Apa yang ada di dalam Milvus 1.0?</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvus adalah basis data vektor sumber terbuka yang dirancang untuk mengelola jutaan, miliaran, atau bahkan triliunan set data vektor. Milvus memiliki aplikasi yang luas yang mencakup penemuan obat baru, visi komputer, pengemudian otonom, mesin rekomendasi, chatbot, dan banyak lagi.</p>
<p>Pada bulan Maret 2021, Zilliz, perusahaan di balik Milvus, merilis versi dukungan jangka panjang pertama platform ini - Milvus v1.0. Setelah berbulan-bulan pengujian ekstensif, versi stabil dan siap produksi dari basis data vektor paling populer di dunia ini siap untuk digunakan. Artikel blog ini membahas beberapa dasar-dasar Milvus serta fitur-fitur utama v1.0.</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Distribusi Milvus</h3><p>Milvus tersedia dalam distribusi khusus CPU dan distribusi yang mendukung GPU. Distribusi yang pertama hanya mengandalkan CPU untuk pembuatan indeks dan pencarian; distribusi yang kedua memungkinkan pencarian hibrida CPU dan GPU serta pembuatan indeks yang semakin mempercepat Milvus. Sebagai contoh, dengan menggunakan distribusi hibrida, CPU dapat digunakan untuk pencarian dan GPU untuk pembuatan indeks, yang selanjutnya meningkatkan efisiensi kueri.</p>
<p>Kedua distribusi Milvus tersedia di Docker. Anda dapat mengkompilasi Milvus dari Docker (jika sistem operasi Anda mendukungnya) atau mengkompilasi Milvus dari kode sumber di Linux (sistem operasi lain tidak didukung).</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">Menyematkan vektor</h3><p>Vektor disimpan dalam Milvus sebagai entitas. Setiap entitas memiliki satu bidang ID vektor dan satu bidang vektor. Milvus v1.0 hanya mendukung ID vektor bilangan bulat. Ketika membuat koleksi di dalam Milvus, ID vektor dapat dibuat secara otomatis atau ditentukan secara manual. Milvus memastikan ID vektor yang dibuat secara otomatis adalah unik, namun ID yang dibuat secara manual dapat diduplikasi di dalam Milvus. Jika mendefinisikan ID secara manual, pengguna bertanggung jawab untuk memastikan bahwa semua ID adalah unik.</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">Partisi</h3><p>Milvus mendukung pembuatan partisi dalam sebuah koleksi. Dalam situasi di mana data dimasukkan secara teratur dan data historis tidak signifikan (misalnya, data streaming), partisi dapat digunakan untuk mempercepat pencarian kemiripan vektor. Satu koleksi dapat memiliki hingga 4.096 partisi. Menentukan pencarian vektor dalam partisi tertentu mempersempit pencarian dan dapat secara signifikan mengurangi waktu kueri, terutama untuk koleksi yang berisi lebih dari satu triliun vektor.</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">Pengoptimalan algoritme indeks</h3><p>Milvus dibangun di atas beberapa pustaka indeks yang diadopsi secara luas, termasuk Faiss, NMSLIB, dan Annoy. Milvus lebih dari sekadar pembungkus dasar untuk pustaka-pustaka indeks ini. Berikut ini adalah beberapa peningkatan utama yang telah dilakukan pada pustaka-pustaka yang mendasarinya:</p>
<ul>
<li>Pengoptimalan kinerja indeks IVF menggunakan algoritma k-means Elkan.</li>
<li>Pengoptimalan pencarian FLAT.</li>
<li>Dukungan indeks hibrida IVF_SQ8H, yang dapat mengurangi ukuran file indeks hingga 75% tanpa mengorbankan akurasi data. IVF_SQ8H dibangun di atas IVF_SQ8, dengan daya ingat yang sama namun dengan kecepatan kueri yang jauh lebih cepat. Ini dirancang khusus untuk Milvus untuk memanfaatkan kapasitas pemrosesan paralel GPU, dan potensi sinergi antara pemrosesan bersama CPU/GPU.</li>
<li>Kompatibilitas set instruksi dinamis.</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">Pencarian, pembuatan indeks, dan pengoptimalan Milvus lainnya</h3><p>Pengoptimalan berikut ini telah dilakukan pada Milvus untuk meningkatkan kinerja pencarian dan pembuatan indeks.</p>
<ul>
<li>Performa pencarian dioptimalkan dalam situasi ketika jumlah kueri (nq) kurang dari jumlah thread CPU.</li>
<li>Milvus menggabungkan permintaan pencarian dari klien yang mengambil topK dan parameter pencarian yang sama.</li>
<li>Pembuatan indeks dihentikan ketika permintaan pencarian masuk.</li>
<li>Milvus secara otomatis memuat koleksi ke memori pada saat start.</li>
<li>Beberapa perangkat GPU dapat ditugaskan untuk mempercepat pencarian kemiripan vektor.</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">Metrik jarak</h3><p>Milvus adalah basis data vektor yang dibangun untuk mendukung pencarian kemiripan vektor. Platform ini dibangun dengan mempertimbangkan MLOps dan aplikasi AI tingkat produksi. Milvus mendukung berbagai metrik jarak untuk menghitung kemiripan, seperti jarak Euclidean (L2), inner product (IP), jarak Jaccard, Tanimoto, jarak Hamming, superstruktur, dan substruktur. Dua metrik terakhir biasanya digunakan dalam pencarian molekuler dan penemuan obat baru yang didukung oleh AI.</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">Penebangan</h3><p>Milvus mendukung rotasi log. Dalam file konfigurasi sistem, milvus.yaml, Anda dapat mengatur ukuran file log tunggal, jumlah file log, dan output log ke stdout.</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">Solusi terdistribusi</h3><p>Mishards, middleware sharding Milvus, adalah solusi terdistribusi untuk Milvus Dengan satu simpul tulis dan simpul baca dalam jumlah yang tidak terbatas, Mishards melepaskan potensi komputasi cluster server. Fitur-fiturnya meliputi penerusan permintaan, pemisahan baca/tulis, penskalaan dinamis/horizontal, dan banyak lagi.</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">Pemantauan</h3><p>Milvus kompatibel dengan Prometheus, sebuah perangkat pemantauan dan peringatan sistem sumber terbuka. Milvus menambahkan dukungan untuk Pushgateway di Prometheus, sehingga memungkinkan Prometheus untuk memperoleh metrik batch yang berumur pendek. Sistem pemantauan dan peringatan bekerja sebagai berikut:</p>
<ul>
<li>Server Milvus mendorong data metrik yang disesuaikan ke Pushgateway.</li>
<li>Pushgateway memastikan data metrik yang bersifat sementara dikirim dengan aman ke Prometheus.</li>
<li>Prometheus terus menarik data dari Pushgateway.</li>
<li>Alertmanager digunakan untuk mengatur ambang batas peringatan untuk berbagai indikator dan mengirim peringatan melalui email atau pesan.</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">Manajemen metadata</h3><p>Milvus menggunakan SQLite untuk manajemen metadata secara default. SQLite diimplementasikan di Milvus dan tidak memerlukan konfigurasi. Dalam lingkungan produksi, Anda disarankan untuk menggunakan MySQL untuk manajemen metadata.</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">Bergabunglah dengan komunitas sumber terbuka kami:</h3><ul>
<li>Temukan atau berkontribusi ke Milvus di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Terhubung dengan kami di <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
