---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: Bangun Pencarian Semantik dengan Cepat
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: >-
  Pelajari lebih lanjut tentang penggunaan metodologi pembelajaran mesin
  semantik untuk mendukung hasil pencarian yang lebih relevan di seluruh
  organisasi Anda.
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>Bangun Pencarian Semantik dengan Cepat</custom-h1><p><a href="https://lucidworks.com/post/what-is-semantic-search/">Pencarian semantik</a> adalah alat yang hebat untuk membantu pelanggan-atau karyawan Anda-menemukan produk atau informasi yang tepat. Pencarian semantik bahkan dapat memunculkan informasi yang sulit diindeks untuk hasil yang lebih baik. Meskipun demikian, jika metodologi semantik Anda tidak digunakan untuk bekerja dengan cepat, metodologi tersebut tidak akan ada gunanya bagi Anda. Pelanggan atau karyawan tidak hanya akan duduk-duduk saja sementara sistem meluangkan waktu untuk merespons pertanyaan mereka-dan ribuan pertanyaan lain mungkin sedang dicerna pada saat yang bersamaan.</p>
<p>Bagaimana Anda dapat membuat pencarian semantik menjadi cepat? Pencarian semantik yang lambat tidak akan berhasil.</p>
<p>Untungnya, ini adalah jenis masalah yang ingin dipecahkan oleh Lucidworks. Baru-baru ini kami menguji sebuah klaster berukuran sedang-baca terus untuk detail lebih lanjut-yang menghasilkan 1500 RPS (permintaan per detik) terhadap koleksi lebih dari satu juta dokumen, dengan waktu respons rata-rata sekitar 40 milidetik. Ini adalah kecepatan yang luar biasa.</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">Menerapkan Pencarian Semantik</h3><p>Untuk mewujudkan keajaiban pembelajaran mesin yang secepat kilat, Lucidworks telah mengimplementasikan pencarian semantik menggunakan pendekatan pencarian vektor semantik. Ada dua bagian penting.</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">Bagian Satu: Model Pembelajaran Mesin</h4><p>Pertama, Anda membutuhkan cara untuk mengkodekan teks menjadi vektor numerik. Teks tersebut dapat berupa deskripsi produk, permintaan pencarian pengguna, pertanyaan, atau bahkan jawaban dari sebuah pertanyaan. Model pencarian semantik dilatih untuk menyandikan teks sedemikian rupa sehingga teks yang secara semantik mirip dengan teks lainnya dikodekan menjadi vektor yang secara numerik "dekat" satu sama lain. Langkah penyandian ini harus cepat untuk mendukung ribuan atau lebih kemungkinan pencarian pelanggan atau pertanyaan pengguna yang masuk setiap detiknya.</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">Bagian Dua: Mesin Pencari Vektor</h4><p>Kedua, Anda membutuhkan cara untuk menemukan kecocokan terbaik dengan pencarian pelanggan atau pertanyaan pengguna dengan cepat. Model akan mengkodekan teks tersebut ke dalam vektor numerik. Dari sana, Anda perlu membandingkannya dengan semua vektor numerik dalam katalog atau daftar pertanyaan dan jawaban Anda untuk menemukan kecocokan terbaik-vektor yang "paling dekat" dengan vektor kueri. Untuk itu, Anda memerlukan mesin vektor yang dapat menangani semua informasi tersebut secara efektif dan secepat kilat. Mesin ini dapat berisi jutaan vektor dan Anda hanya menginginkan dua puluh atau lebih kecocokan terbaik untuk kueri Anda. Dan tentu saja, mesin ini harus menangani seribu atau lebih kueri seperti itu setiap detiknya.</p>
<p>Untuk mengatasi tantangan ini, kami menambahkan mesin pencari vektor <a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a> pada <a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">rilis Fusion 5.3</a>. Milvus adalah perangkat lunak sumber terbuka dan cepat. Milvus menggunakan FAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI Similarity Search</a>), teknologi yang sama dengan yang digunakan Facebook dalam produksi untuk inisiatif pembelajaran mesinnya. Ketika dibutuhkan, ia dapat berjalan lebih cepat lagi pada <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a>. Ketika Fusion 5.3 (atau yang lebih tinggi) diinstal dengan komponen pembelajaran mesin, Milvus secara otomatis diinstal sebagai bagian dari komponen tersebut sehingga Anda dapat mengaktifkan semua kemampuan ini dengan mudah.</p>
<p>Ukuran vektor dalam koleksi yang diberikan, yang ditentukan ketika koleksi dibuat, tergantung pada model yang menghasilkan vektor tersebut. Sebagai contoh, koleksi yang diberikan dapat menyimpan vektor yang dibuat dari pengkodean (melalui model) semua deskripsi produk dalam katalog produk. Tanpa mesin pencari vektor seperti Milvus, pencarian kemiripan tidak akan dapat dilakukan di seluruh ruang vektor. Jadi, pencarian kemiripan harus dibatasi pada kandidat yang telah dipilih sebelumnya dari ruang vektor (misalnya, 500) dan akan memiliki kinerja yang lebih lambat dan hasil yang lebih rendah. Milvus dapat menyimpan ratusan miliar vektor di berbagai koleksi vektor untuk memastikan bahwa pencariannya cepat dan hasilnya relevan.</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">Menggunakan Pencarian Semantik</h3><p>Mari kita kembali ke alur kerja pencarian semantik, setelah kita mempelajari sedikit tentang mengapa Milvus mungkin sangat penting. Pencarian semantik memiliki tiga tahap. Pada tahap pertama, model pembelajaran mesin dimuat dan/atau dilatih. Setelah itu, data diindeks ke dalam Milvus dan Solr. Tahap terakhir adalah tahap kueri, ketika pencarian yang sebenarnya terjadi. Kami akan fokus pada dua tahap terakhir di bawah ini.</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Mengindeks ke dalam Milvus</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>Seperti yang ditunjukkan pada diagram di atas, tahap kueri dimulai dengan cara yang sama seperti tahap pengindeksan, hanya saja dengan kueri yang masuk, bukan dokumen. Untuk setiap kueri:</p>
<ol>
<li>Kueri dikirim ke pipa indeks <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a>.</li>
<li>Kueri kemudian dikirim ke model ML.</li>
<li>Model ML mengembalikan vektor numerik (terenkripsi dari kueri). Sekali lagi, jenis model menentukan ukuran vektor.</li>
<li>Vektor tersebut dikirim ke Milvus, yang kemudian menentukan vektor mana, dalam koleksi Milvus yang ditentukan, yang paling cocok dengan vektor yang disediakan.</li>
<li>Milvus mengembalikan daftar ID unik dan jarak yang sesuai dengan vektor yang ditentukan pada langkah keempat.</li>
<li>Kueri yang berisi ID dan jarak tersebut dikirim ke Solr.</li>
<li>Solr kemudian mengembalikan daftar dokumen yang diurutkan yang terkait dengan ID tersebut.</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">Pengujian Skala</h3><p>Untuk membuktikan bahwa alur penelusuran semantik kami berjalan dengan efisiensi yang kami perlukan untuk pelanggan kami, kami menjalankan pengujian skala menggunakan skrip Gatling di Google Cloud Platform menggunakan klaster Fusion dengan delapan replika model ML, delapan replika layanan kueri, dan satu contoh Milvus. Pengujian dijalankan menggunakan indeks Milvus FLAT dan HNSW. Indeks FLAT memiliki recall 100%, tetapi kurang efisien - kecuali jika datasetnya kecil. Indeks HNSW (Hierarchical Small World Graph) masih memiliki hasil yang berkualitas tinggi dan memiliki kinerja yang lebih baik pada set data yang lebih besar.</p>
<p>Mari kita lihat beberapa angka dari contoh terbaru yang kami jalankan:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">Memulai</h3><p>Pipeline <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a> dirancang agar mudah digunakan. Lucidworks memiliki <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">model-model yang sudah terlatih yang mudah digunakan</a> dan secara umum memberikan hasil yang baik-meskipun melatih model Anda sendiri, bersamaan dengan model yang sudah terlatih, akan memberikan hasil yang terbaik. Hubungi kami hari ini untuk mempelajari bagaimana Anda dapat menerapkan inisiatif ini ke dalam alat pencarian Anda untuk memberikan hasil yang lebih efektif dan menyenangkan.</p>
<blockquote>
<p>Blog ini diposting ulang dari: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
