---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: Gambaran umum sistem
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  Temukan bagaimana Milvus, database vektor sumber terbuka, digunakan oleh Mozat
  untuk mendukung aplikasi fesyen yang menawarkan rekomendasi gaya yang
  dipersonalisasi dan sistem pencarian gambar.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Membangun Aplikasi Perencanaan Lemari Pakaian dan Pakaian dengan Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p>Didirikan pada tahun 2003, <a href="http://www.mozat.com/home">Mozat</a> adalah perusahaan rintisan yang berkantor pusat di Singapura dan memiliki kantor di Cina dan Arab Saudi. Perusahaan ini mengkhususkan diri dalam membangun aplikasi media sosial, komunikasi, dan gaya hidup. <a href="https://stylepedia.com/">Stylepedia</a> adalah aplikasi lemari pakaian yang dibuat oleh Mozat yang membantu pengguna menemukan gaya baru dan terhubung dengan orang lain yang memiliki ketertarikan pada fashion. Fitur utamanya meliputi kemampuan untuk mengkurasi lemari digital, rekomendasi gaya yang dipersonalisasi, fungsionalitas media sosial, dan alat pencarian gambar untuk menemukan barang yang mirip dengan sesuatu yang dilihat secara online atau dalam kehidupan nyata.</p>
<p><a href="https://milvus.io">Milvus</a> digunakan untuk mendukung sistem pencarian gambar dalam Stylepedia. Aplikasi ini menangani tiga jenis gambar: gambar pengguna, gambar produk, dan foto mode. Setiap gambar dapat mencakup satu atau lebih item, yang semakin memperumit setiap kueri. Agar bermanfaat, sistem pencarian gambar harus akurat, cepat, dan stabil, fitur-fitur yang memberikan dasar teknis yang kuat untuk menambahkan fungsionalitas baru ke dalam aplikasi seperti saran pakaian dan rekomendasi konten fesyen.</p>
<h2 id="System-overview" class="common-anchor-header">Gambaran umum sistem<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-system-process.png</span> </span></p>
<p>Sistem pencarian gambar dibagi menjadi komponen offline dan online.</p>
<p>Secara offline, gambar dibuat dalam bentuk vektor dan dimasukkan ke dalam basis data vektor (Milvus). Dalam alur kerja data, gambar produk dan foto-foto mode yang relevan diubah menjadi vektor fitur 512 dimensi menggunakan deteksi objek dan model ekstraksi fitur. Data vektor kemudian diindeks dan ditambahkan ke basis data vektor.</p>
<p>Secara online, basis data gambar ditanyakan dan gambar yang serupa dikembalikan kepada pengguna. Mirip dengan komponen off-line, gambar kueri diproses dengan deteksi objek dan model ekstraksi fitur untuk mendapatkan vektor fitur. Dengan menggunakan vektor fitur, Milvus mencari vektor yang mirip dengan TopK dan mendapatkan ID gambar yang sesuai. Akhirnya, setelah pasca-pemrosesan (pemfilteran, penyortiran, dll.), kumpulan gambar yang mirip dengan gambar kueri dikembalikan.</p>
<h2 id="Implementation" class="common-anchor-header">Implementasi<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Implementasi dibagi menjadi empat modul:</p>
<ol>
<li>Deteksi pakaian</li>
<li>Ekstraksi fitur</li>
<li>Pencarian kesamaan vektor</li>
<li>Pasca-pemrosesan</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">Deteksi garmen</h3><p>Dalam modul deteksi garmen, <a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a>, kerangka kerja deteksi target berbasis jangkar satu tahap, digunakan sebagai model deteksi objek karena ukurannya yang kecil dan inferensi waktu nyata. Ini menawarkan empat ukuran model (YOLOv5s/m/l/x), dan setiap ukuran tertentu memiliki pro dan kontra. Model yang lebih besar akan berkinerja lebih baik (presisi lebih tinggi) tetapi membutuhkan lebih banyak daya komputasi dan berjalan lebih lambat. Karena objek dalam kasus ini adalah benda yang relatif besar dan mudah dideteksi, maka model terkecil, YOLOv5s, sudah cukup.</p>
<p>Item pakaian dalam setiap gambar dikenali dan dipotong untuk digunakan sebagai input model ekstraksi fitur yang digunakan dalam pemrosesan selanjutnya. Secara bersamaan, model pendeteksian objek juga memprediksi klasifikasi pakaian menurut kelas yang telah ditentukan (atasan, pakaian luar, celana panjang, rok, gaun, dan baju terusan).</p>
<h3 id="Feature-extraction" class="common-anchor-header">Ekstraksi fitur</h3><p>Kunci dari pencarian kemiripan adalah model ekstraksi fitur. Gambar pakaian yang telah dipotong dimasukkan ke dalam vektor floating point 512 dimensi yang merepresentasikan atributnya dalam format data numerik yang dapat dibaca mesin. Metodologi <a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">deep metric learning (DML</a> ) diadopsi dengan <a href="https://arxiv.org/abs/1905.11946">EfficientNet</a> sebagai model tulang punggung.</p>
<p>Pembelajaran metrik bertujuan untuk melatih modul ekstraksi fitur nonlinier berbasis CNN (atau encoder) untuk mengurangi jarak antara vektor fitur yang sesuai dengan kelas sampel yang sama, dan meningkatkan jarak antara vektor fitur yang sesuai dengan kelas sampel yang berbeda. Dalam skenario ini, kelas sampel yang sama mengacu pada pakaian yang sama.</p>
<p>EfficientNet memperhitungkan kecepatan dan ketepatan saat menskalakan lebar, kedalaman, dan resolusi jaringan secara seragam. EfficientNet-B4 digunakan sebagai jaringan ekstraksi fitur, dan output dari lapisan akhir yang terhubung sepenuhnya adalah fitur gambar yang diperlukan untuk melakukan pencarian kesamaan vektor.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Pencarian kesamaan vektor</h3><p>Milvus adalah basis data vektor sumber terbuka yang mendukung operasi buat, baca, perbarui, dan hapus (CRUD) serta pencarian nyaris seketika pada kumpulan data berukuran triliunan byte. Di Stylepedia, ini digunakan untuk pencarian kemiripan vektor berskala besar karena sangat elastis, stabil, dapat diandalkan, dan cepat. Milvus memperluas kemampuan pustaka indeks vektor yang banyak digunakan (Faiss, NMSLIB, Annoy, dll.), dan menyediakan seperangkat API yang sederhana dan intuitif yang memungkinkan pengguna untuk memilih jenis indeks yang ideal untuk skenario tertentu.</p>
<p>Dengan mempertimbangkan persyaratan skenario dan skala data, pengembang Stylepedia menggunakan distribusi Milvus khusus CPU yang dipasangkan dengan indeks HNSW. Dua koleksi yang diindeks, satu untuk produk dan satu lagi untuk foto-foto mode, dibuat untuk mendukung fungsi aplikasi yang berbeda. Setiap koleksi dibagi lagi menjadi enam partisi berdasarkan hasil deteksi dan klasifikasi untuk mempersempit cakupan pencarian. Milvus melakukan pencarian pada puluhan juta vektor dalam hitungan milidetik, memberikan kinerja optimal sekaligus menjaga biaya pengembangan tetap rendah dan meminimalkan konsumsi sumber daya.</p>
<h3 id="Post-processing" class="common-anchor-header">Pasca-pemrosesan</h3><p>Untuk meningkatkan kemiripan antara hasil pencarian gambar dan gambar kueri, kami menggunakan pemfilteran warna dan pemfilteran label kunci (panjang lengan, panjang pakaian, gaya kerah, dll.) untuk menyaring gambar yang tidak memenuhi syarat. Selain itu, algoritma penilaian kualitas gambar digunakan untuk memastikan bahwa gambar dengan kualitas yang lebih tinggi disajikan kepada pengguna terlebih dahulu.</p>
<h2 id="Application" class="common-anchor-header">Aplikasi<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">Unggahan pengguna dan pencarian gambar</h3><p>Pengguna dapat mengambil foto pakaian mereka sendiri dan mengunggahnya ke lemari digital Stylepedia mereka, kemudian mengambil gambar produk yang paling mirip dengan unggahan mereka.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-hasil-pencarian.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">Saran pakaian</h3><p>Dengan melakukan pencarian kemiripan pada database Stylepedia, pengguna dapat menemukan foto-foto fashion yang mengandung item fashion tertentu. Ini bisa berupa pakaian baru yang ingin dibeli oleh seseorang, atau sesuatu dari koleksi mereka sendiri yang dapat dikenakan atau dipasangkan secara berbeda. Kemudian, melalui pengelompokan item yang sering dipasangkan, saran pakaian dihasilkan. Sebagai contoh, jaket biker hitam dapat dipadukan dengan berbagai macam item, seperti celana jeans skinny hitam. Pengguna kemudian dapat menelusuri foto-foto mode yang relevan di mana kecocokan ini terjadi dalam formula yang dipilih.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-outfit.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jaket-jepretan.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">Rekomendasi foto mode</h3><p>Berdasarkan riwayat penelusuran pengguna, kesukaan, dan isi lemari digital mereka, sistem menghitung kemiripan dan memberikan rekomendasi foto mode khusus yang mungkin menarik.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-pengguna-lemari pakaian.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>Dengan menggabungkan metodologi deep learning dan visi komputer, Mozat mampu membangun sistem pencarian kemiripan gambar yang cepat, stabil, dan akurat dengan menggunakan Milvus untuk mendukung berbagai fitur di aplikasi Stylepedia.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Jangan menjadi orang asing<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Temukan atau kontribusikan Milvus di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Terhubung dengan kami di <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
