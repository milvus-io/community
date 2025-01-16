---
id: AI-applications-with-Milvus.md
title: Cara Membuat 4 Aplikasi AI Populer dengan Milvus
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvus mempercepat pengembangan aplikasi pembelajaran mesin dan operasi
  pembelajaran mesin (MLOps). Dengan Milvus, Anda dapat dengan cepat
  mengembangkan produk yang layak secara minimum (MVP) sambil menjaga biaya
  tetap rendah.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>Cara Membuat 4 Aplikasi AI Populer dengan Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>sampul blog.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka. Milvus mendukung penambahan, penghapusan, pembaruan, dan pencarian hampir seketika untuk kumpulan data vektor yang sangat besar yang dibuat dengan mengekstraksi vektor fitur dari data yang tidak terstruktur menggunakan model AI. Dengan seperangkat API intuitif yang komprehensif, dan dukungan untuk beberapa pustaka indeks yang diadopsi secara luas (misalnya, Faiss, NMSLIB, dan Annoy), Milvus mempercepat pengembangan aplikasi pembelajaran mesin dan operasi pembelajaran mesin (MLOps). Dengan Milvus, Anda dapat dengan cepat mengembangkan produk yang layak secara minimum (MVP) sambil menjaga biaya tetap rendah.</p>
<p>&quot;Sumber daya apa saja yang tersedia untuk mengembangkan aplikasi AI dengan Milvus?&quot; adalah pertanyaan yang sering ditanyakan di komunitas Milvus. Zilliz, <a href="https://zilliz.com/">perusahaan</a> di balik Milvus, mengembangkan sejumlah demo yang memanfaatkan Milvus untuk melakukan pencarian kemiripan secepat kilat yang mendukung aplikasi cerdas. Kode sumber solusi Milvus dapat ditemukan di <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a>. Skenario interaktif berikut ini mendemonstrasikan pemrosesan bahasa alami (NLP), pencarian gambar terbalik, pencarian audio, dan visi komputer.</p>
<p>Jangan ragu untuk mencoba solusi-solusi tersebut untuk mendapatkan pengalaman langsung dengan skenario tertentu! Bagikan skenario aplikasi Anda sendiri melalui:</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">Pemrosesan bahasa alami (chatbot)</a></li>
<li><a href="#reverse-image-search-systems">Pencarian gambar terbalik</a></li>
<li><a href="#audio-search-systems">Pencarian audio</a></li>
<li><a href="#video-object-detection-computer-vision">Deteksi objek video (visi komputer)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">Pemrosesan bahasa alami (chatbots)</h3><p>Milvus dapat digunakan untuk membuat chatbot yang menggunakan pemrosesan bahasa alami untuk mensimulasikan operator langsung, menjawab pertanyaan, mengarahkan pengguna ke informasi yang relevan, dan mengurangi biaya tenaga kerja. Untuk mendemonstrasikan skenario aplikasi ini, Zilliz membangun chatbot bertenaga AI yang memahami bahasa semantik dengan menggabungkan Milvus dengan <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a>, sebuah model pembelajaran mesin (machine learning/ML) yang dikembangkan untuk pra-pelatihan NLP.</p>
<p>👉Kode <a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">sumber：zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Cara menggunakan</h4><ol>
<li><p>Unggah dataset yang berisi pasangan pertanyaan dan jawaban. Format pertanyaan dan jawaban dalam dua kolom terpisah. Sebagai alternatif, <a href="https://zilliz.com/solutions/qa">dataset contoh</a> tersedia untuk diunduh.</p></li>
<li><p>Setelah mengetikkan pertanyaan Anda, daftar pertanyaan serupa akan diambil dari set data yang diunggah.</p></li>
<li><p>Ungkapkan jawabannya dengan memilih pertanyaan yang paling mirip dengan pertanyaan Anda.</p></li>
</ol>
<p>👉Video：<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">[Demo] Sistem QA yang Didukung oleh Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Bagaimana cara kerjanya</h4><p>Pertanyaan diubah menjadi vektor fitur menggunakan model BERT Google, kemudian Milvus digunakan untuk mengelola dan menanyakan dataset.</p>
<p><strong>Pemrosesan data:</strong></p>
<ol>
<li>BERT digunakan untuk mengubah pasangan pertanyaan-jawaban yang diunggah menjadi vektor fitur 768 dimensi. Vektor-vektor tersebut kemudian diimpor ke Milvus dan diberi ID masing-masing.</li>
<li>ID vektor pertanyaan dan jawaban yang sesuai disimpan di PostgreSQL.</li>
</ol>
<p><strong>Mencari pertanyaan-pertanyaan serupa:</strong></p>
<ol>
<li>BERT digunakan untuk mengekstrak vektor fitur dari pertanyaan masukan pengguna.</li>
<li>Milvus mengambil ID vektor untuk pertanyaan yang paling mirip dengan pertanyaan masukan.</li>
<li>Sistem mencari jawaban yang sesuai di PostgreSQL.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">Sistem pencarian gambar terbalik</h3><p>Pencarian gambar terbalik mengubah e-commerce melalui rekomendasi produk yang dipersonalisasi dan alat pencarian produk serupa yang dapat meningkatkan penjualan. Dalam skenario aplikasi ini, Zilliz membangun sistem pencarian gambar terbalik dengan menggabungkan Milvus dengan <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a>, sebuah model ML yang dapat mengekstrak fitur gambar.</p>
<p><a href="https://github.com/zilliz-bootcamp/image_search">👉Kode</a> sumber: zilliz-bootcamp/image_search</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Cara menggunakan</h4><ol>
<li>Unggah dataset gambar zip yang terdiri dari gambar .jpg saja (jenis file gambar lain tidak diterima). Sebagai alternatif, <a href="https://zilliz.com/solutions/image-search">kumpulan data sampel</a> tersedia untuk diunduh.</li>
<li>Unggah gambar yang akan digunakan sebagai masukan pencarian untuk menemukan gambar yang serupa.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[Demo] Pencarian Gambar Didukung oleh Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Bagaimana cara kerjanya</h4><p>Gambar diubah menjadi vektor fitur 512 dimensi menggunakan model VGG, kemudian Milvus digunakan untuk mengelola dan menanyakan dataset.</p>
<p><strong>Pemrosesan data:</strong></p>
<ol>
<li>Model VGG digunakan untuk mengubah dataset gambar yang diunggah menjadi vektor fitur. Vektor-vektor ini kemudian diimpor ke Milvus dan diberi ID masing-masing.</li>
<li>Vektor fitur gambar, dan jalur berkas gambar yang sesuai, disimpan di CacheDB.</li>
</ol>
<p><strong>Mencari gambar yang serupa:</strong></p>
<ol>
<li>VGG digunakan untuk mengubah gambar yang diunggah pengguna menjadi vektor fitur.</li>
<li>ID vektor gambar yang paling mirip dengan gambar input diambil dari Milvus.</li>
<li>Sistem mencari jalur file gambar yang sesuai di CacheDB.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">Sistem pencarian audio</h3><p>Pencarian ucapan, musik, efek suara, dan jenis pencarian audio lainnya memungkinkan untuk dengan cepat meminta data audio dalam jumlah besar dan memunculkan suara-suara yang mirip. Aplikasi termasuk mengidentifikasi efek suara yang mirip, meminimalkan pelanggaran IP, dan banyak lagi. Untuk mendemonstrasikan skenario aplikasi ini, Zilliz membangun sistem pencarian kemiripan audio yang sangat efisien dengan menggabungkan Milvus dengan <a href="https://arxiv.org/abs/1912.10211">PANN-jaringan</a>syaraf tiruan audio yang sudah terlatih berskala besar yang dibangun untuk pengenalan pola audio.</p>
<p>👉Kode <a href="https://github.com/zilliz-bootcamp/audio_search">sumber：zilliz-bootcamp/audio_search</a> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Cara menggunakan</h4><ol>
<li>Unggah dataset audio yang di-zip yang hanya terdiri dari file .wav (jenis file audio lainnya tidak diterima). Sebagai alternatif, <a href="https://zilliz.com/solutions/audio-search">kumpulan data sampel</a> tersedia untuk diunduh.</li>
<li>Unggah file .wav untuk digunakan sebagai input pencarian untuk menemukan audio serupa.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[Demo] Pencarian Audio Didukung oleh Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Bagaimana cara kerjanya</h4><p>Audio diubah menjadi vektor fitur menggunakan PANN, jaringan saraf audio berskala besar yang telah dilatih sebelumnya yang dibangun untuk pengenalan pola audio. Kemudian Milvus digunakan untuk mengelola dan menanyakan dataset.</p>
<p><strong>Pemrosesan data:</strong></p>
<ol>
<li>PANN mengubah audio dari set data yang diunggah menjadi vektor fitur. Vektor-vektor tersebut kemudian diimpor ke Milvus dan diberi ID masing-masing.</li>
<li>ID vektor fitur audio dan jalur file .wav yang sesuai disimpan di PostgreSQL.</li>
</ol>
<p><strong>Mencari audio yang serupa:</strong></p>
<ol>
<li>PANN digunakan untuk mengubah file audio yang diunggah pengguna menjadi vektor fitur.</li>
<li>ID vektor audio yang paling mirip dengan file yang diunggah diambil dari Milvus dengan menghitung jarak inner product (IP).</li>
<li>Sistem mencari jalur file audio yang sesuai di MySQL.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">Pendeteksian objek video (visi komputer)</h3><p>Deteksi objek video memiliki aplikasi dalam visi komputer, pengambilan gambar, mengemudi secara otonom, dan banyak lagi. Untuk mendemonstrasikan skenario aplikasi ini, Zilliz membangun sistem pendeteksian objek video dengan menggabungkan Milvus dengan teknologi dan algoritme termasuk <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>, <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a>, dan <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a>.</p>
<p>👉Kode sumber: <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Cara menggunakan</h4><ol>
<li>Unggah dataset gambar zip yang terdiri dari file .jpg saja (jenis file gambar lainnya tidak diterima). Pastikan setiap file gambar diberi nama sesuai dengan objek yang digambarkan. Sebagai alternatif, <a href="https://zilliz.com/solutions/video-obj-analysis">dataset sampel</a> tersedia untuk diunduh.</li>
<li>Unggah video yang akan digunakan untuk analisis.</li>
<li>Klik tombol putar untuk melihat video yang diunggah dengan hasil deteksi objek yang ditampilkan secara real time.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=m9rosLClByc">[Demo] Sistem Deteksi Objek Video yang Didukung oleh Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Bagaimana cara kerjanya</h4><p>Gambar objek diubah menjadi vektor fitur 2048 dimensi menggunakan ResNet50. Kemudian Milvus digunakan untuk mengelola dan meminta dataset.</p>
<p><strong>Pemrosesan data:</strong></p>
<ol>
<li>ResNet50 mengubah gambar objek menjadi vektor fitur 2048 dimensi. Vektor-vektor tersebut kemudian diimpor ke Milvus dan diberi ID masing-masing.</li>
<li>ID vektor fitur audio dan jalur file gambar yang sesuai disimpan di MySQL.</li>
</ol>
<p><strong>Mendeteksi objek dalam video:</strong></p>
<ol>
<li>OpenCV digunakan untuk memangkas video.</li>
<li>YOLOv3 digunakan untuk mendeteksi objek dalam video.</li>
<li>ResNet50 mengubah gambar objek yang terdeteksi menjadi vektor fitur 2048 dimensi.</li>
</ol>
<p>Milvus mencari gambar objek yang paling mirip dalam kumpulan data yang diunggah. Nama objek yang sesuai dan jalur file gambar diambil dari MySQL.</p>
