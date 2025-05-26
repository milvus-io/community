---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: Memahami Hierarchical Navigable Small Worlds (HNSW) untuk Pencarian Vektor
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: >-
  HNSW (Hierarchical Navigable Small World) adalah algoritme yang efisien untuk
  perkiraan pencarian tetangga terdekat dengan menggunakan struktur graf
  berlapis.
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p>Operasi utama dari <a href="https://milvus.io/blog/what-is-a-vector-database.md">basis data vektor</a> adalah <em>pencarian kemiripan</em>, yang melibatkan pencarian tetangga terdekat dalam basis data dengan vektor kueri, misalnya, dengan jarak Euclidean. Metode naif akan menghitung jarak dari vektor kueri ke setiap vektor yang tersimpan di dalam basis data dan mengambil K yang paling dekat. Namun, hal ini jelas tidak sesuai dengan ukuran database. Dalam praktiknya, pencarian kemiripan naif hanya praktis untuk basis data dengan kurang dari 1 juta vektor. Bagaimana kita dapat meningkatkan skala pencarian kita ke 10 juta dan 100 juta, atau bahkan ke miliaran vektor?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Menuruni hirarki indeks pencarian vektor</em></p>
<p>Banyak algoritme dan struktur data yang telah dikembangkan untuk menskalakan pencarian kemiripan dalam ruang vektor berdimensi tinggi hingga kompleksitas waktu sub-linear. Dalam artikel ini, kami akan menjelaskan dan mengimplementasikan sebuah metode yang populer dan efektif yang disebut Hierarchical Navigable Small Worlds (HNSW), yang sering kali menjadi pilihan default untuk set data vektor berukuran sedang. Metode ini termasuk dalam keluarga metode pencarian yang membangun sebuah grafik di atas vektor, di mana simpul menunjukkan vektor dan sisi menunjukkan kemiripan di antara vektor-vektor tersebut. Pencarian dilakukan dengan menavigasi grafik, dalam kasus yang paling sederhana, dengan rakus melintasi ke tetangga simpul saat ini yang paling dekat dengan kueri dan mengulangi sampai minimum lokal tercapai.</p>
<p>Kami akan menjelaskan secara lebih rinci bagaimana graf pencarian dibangun, bagaimana graf memungkinkan pencarian, dan pada akhirnya, menautkan ke implementasi HNSW, karya Anda sendiri, dalam bahasa pemrograman Python yang sederhana.</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">Dunia Kecil yang Dapat Dijelajahi<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Grafik NSW yang dibuat dari 100 titik 2D yang ditempatkan secara acak.</em></p>
<p>Seperti yang telah disebutkan, HNSW membuat grafik pencarian secara offline sebelum kita dapat melakukan kueri. Algoritma ini dibangun di atas pekerjaan sebelumnya, sebuah metode yang disebut Navigable Small Worlds (NSW). Kami akan menjelaskan NSW terlebih dahulu dan kemudian akan sangat mudah untuk beralih ke <em>Hierarchical</em> NSW. Ilustrasi di atas adalah sebuah grafik pencarian yang dibangun untuk NSW atas vektor 2 dimensi. Pada semua contoh di bawah ini, kami membatasi diri kami pada vektor 2 dimensi agar dapat memvisualisasikannya.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Membangun Graf<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebuah NSW adalah sebuah graf dimana simpul-simpulnya merepresentasikan vektor-vektor dan sisi-sisinya dibangun secara heuristik dari kemiripan antara vektor-vektor sehingga sebagian besar vektor-vektor dapat dijangkau dari mana saja melalui sejumlah kecil lompatan. Inilah yang disebut dengan properti "dunia kecil" yang memungkinkan navigasi cepat. Lihat gambar di atas.</p>
<p>Graf diinisialisasi kosong. Kita melakukan iterasi melalui vektor-vektor, menambahkan setiap vektor ke dalam graf secara bergantian. Untuk setiap vektor, dimulai dari sebuah simpul entri acak, kita dengan rakus mencari simpul R terdekat yang dapat dijangkau dari titik entri <em>pada graf yang</em> telah <em>dibuat</em>. R node ini kemudian dihubungkan ke sebuah node baru yang mewakili vektor yang sedang dimasukkan, secara opsional memangkas setiap node tetangga yang sekarang memiliki lebih dari R tetangga. Mengulangi proses ini untuk semua vektor akan menghasilkan graf NSW. Lihat ilustrasi di atas yang memvisualisasikan algoritma, dan lihat sumber-sumber di akhir artikel untuk analisis teoritis tentang sifat-sifat graf yang dibangun seperti ini.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Mencari Graf<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita telah melihat algoritma pencarian dari penggunaannya dalam konstruksi graf. Akan tetapi, dalam kasus ini, simpul kueri disediakan oleh pengguna, dan bukannya menjadi simpul untuk dimasukkan ke dalam graf. Dimulai dari sebuah catatan entri acak, kami dengan rakus menavigasi ke tetangganya yang paling dekat dengan kueri, mempertahankan satu set dinamis dari vektor-vektor terdekat yang ditemui sejauh ini. Lihat ilustrasi di atas. Perhatikan bahwa kita dapat meningkatkan akurasi pencarian dengan memulai pencarian dari beberapa titik entri acak dan menggabungkan hasilnya, serta mempertimbangkan beberapa tetangga pada setiap langkah. Namun, peningkatan ini harus dibayar dengan peningkatan latensi.</p>
<custom-h1>Menambahkan Hirarki</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sejauh ini, kami telah menjelaskan algoritme NSW dan struktur data yang dapat membantu kami meningkatkan pencarian dalam ruang dimensi tinggi. Meskipun demikian, metode ini memiliki kekurangan yang serius, termasuk kegagalan dalam dimensi rendah, konvergensi pencarian yang lambat, dan kecenderungan untuk terjebak dalam minimum lokal.</p>
<p>Para penulis HNSW memperbaiki kekurangan-kekurangan ini dengan tiga modifikasi pada NSW:</p>
<ul>
<li><p>Pemilihan eksplisit dari simpul-simpul entri selama konstruksi dan pencarian;</p></li>
<li><p>Pemisahan sisi-sisi dengan skala yang berbeda; dan,</p></li>
<li><p>Penggunaan heuristik tingkat lanjut untuk memilih tetangga.</p></li>
</ul>
<p>Dua yang pertama direalisasikan dengan ide yang sederhana: membangun <em>sebuah hirarki graf pencarian</em>. Alih-alih sebuah graf tunggal, seperti pada NSW, HNSW membangun sebuah hirarki graf. Setiap graf, atau lapisan, dicari secara individual dengan cara yang sama seperti NSW. Lapisan teratas, yang dicari pertama kali, berisi sangat sedikit simpul, dan lapisan yang lebih dalam secara progresif mencakup lebih banyak simpul, dengan lapisan terbawah mencakup semua simpul. Ini berarti bahwa lapisan teratas berisi lompatan yang lebih panjang melintasi ruang vektor, sehingga memungkinkan pencarian yang lebih baik. Lihat di atas untuk sebuah ilustrasi.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Membangun Graf<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Algoritma konstruksi bekerja sebagai berikut: kita menetapkan sejumlah lapisan, <em>L</em>, terlebih dahulu. Nilai l = 1 akan berhubungan dengan lapisan yang paling kasar, di mana pencarian dimulai, dan l = L akan berhubungan dengan lapisan yang paling padat, di mana pencarian selesai. Kita melakukan iterasi melalui setiap vektor yang akan disisipkan dan mengambil sampel dari lapisan penyisipan mengikuti <a href="https://en.wikipedia.org/wiki/Geometric_distribution">distribusi geometris</a> terpotong (baik menolak <em>l &gt; L</em> atau mengatur <em>l' =</em> min_(l, L)_). Katakanlah kita mengambil sampel <em>1 &lt; l &lt; L</em> untuk vektor saat ini. Kita melakukan pencarian serakah pada lapisan teratas, L, sampai kita mencapai minimum lokalnya. Kemudian, kita mengikuti sebuah sisi dari minimum lokal pada lapisan ke-L ke vektor yang sesuai pada lapisan ke-l dan menggunakannya sebagai titik masuk untuk mencari lapisan ke-l secara serakah.</p>
<p>Proses ini diulangi sampai kita mencapai lapisan ke-l. Kita kemudian mulai membuat node untuk vektor yang akan disisipkan, menghubungkannya dengan tetangga terdekat yang ditemukan oleh pencarian serakah di lapisan ke-l yang telah dibuat sejauh ini, menavigasi ke lapisan ke-(l-1) dan mengulanginya hingga kita telah menyisipkan vektor tersebut ke dalam lapisan ke-(l-1). Animasi di atas memperjelas hal ini</p>
<p>Kita dapat melihat bahwa metode konstruksi graf hirarkis ini menggunakan pemilihan eksplisit yang cerdas dari simpul penyisipan untuk setiap vektor. Kami mencari lapisan di atas lapisan penyisipan yang dibangun sejauh ini, mencari secara efisien dari jarak yang dekat. Sejalan dengan itu, metode ini memisahkan tautan dengan skala yang berbeda di setiap lapisan: lapisan teratas memberikan lompatan skala panjang di ruang pencarian, dengan skala yang semakin menurun ke lapisan bawah. Kedua modifikasi ini membantu menghindari terjebak dalam minima yang kurang optimal dan mempercepat konvergensi pencarian dengan mengorbankan memori tambahan.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Mencari Grafik<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Prosedur pencarian bekerja sama seperti langkah konstruksi graf dalam. Mulai dari lapisan teratas, kita dengan rakus menavigasi ke simpul atau simpul-simpul yang paling dekat dengan kueri. Kemudian kita mengikuti simpul-simpul tersebut ke lapisan berikutnya dan mengulangi prosesnya. Jawaban kita didapatkan dari daftar tetangga terdekat <em>R</em> di lapisan paling bawah, seperti yang diilustrasikan oleh animasi di atas.</p>
<h2 id="Conclusion" class="common-anchor-header">Kesimpulan<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor seperti Milvus menyediakan implementasi HNSW yang sangat dioptimalkan dan disetel, dan sering kali menjadi indeks pencarian default terbaik untuk set data yang muat di memori.</p>
<p>Kami telah membuat sketsa gambaran umum tingkat tinggi tentang bagaimana dan mengapa HNSW bekerja, lebih memilih visualisasi dan intuisi daripada teori dan matematika. Akibatnya, kami telah menghilangkan deskripsi yang tepat tentang algoritma konstruksi dan pencarian<a href="https://arxiv.org/abs/1603.09320">[Malkov dan Yashushin, 2016</a>; Alg 1-3], analisis kompleksitas pencarian dan konstruksi<a href="https://arxiv.org/abs/1603.09320">[Malkov dan Yashushin, 2016</a>; §4.2], dan rincian yang kurang penting seperti heuristik untuk memilih simpul tetangga secara lebih efektif selama konstruksi<a href="https://arxiv.org/abs/1603.09320">[Malkov dan Yashushin, 2016</a>; Alg 5]. Selain itu, kami telah menghilangkan diskusi tentang hyperparameter algoritma, maknanya dan bagaimana mereka mempengaruhi pertukaran latensi/kecepatan/memori<a href="https://arxiv.org/abs/1603.09320">[Malkov dan Yashushin, 2016</a>; §4.1]. Pemahaman akan hal ini penting untuk menggunakan HNSW dalam praktiknya.</p>
<p>Sumber-sumber di bawah ini berisi bacaan lebih lanjut tentang topik-topik ini dan implementasi pedagogis Python lengkap (ditulis oleh saya sendiri) untuk NSW dan HNSW, termasuk kode untuk menghasilkan animasi dalam artikel ini.</p>
<custom-h1>Sumber daya</custom-h1><ul>
<li><p>GitHub: "<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Ilustrasi: Implementasi kecil dari Hierarchical Navigable Small Worlds (HNSW), sebuah algoritma pencarian vektor, untuk tujuan pembelajaran</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Dokumentasi Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">Memahami Hierarchical Navigable Small Worlds (HNSW) - Zilliz Learn</a></p></li>
<li><p>Makalah HNSW: "<a href="https://arxiv.org/abs/1603.09320">Pencarian tetangga terdekat yang efisien dan kuat menggunakan graf Hierarchical Navigable Small World</a>"</p></li>
<li><p>Makalah NSW: "<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">Perkiraan algoritma tetangga terdekat berdasarkan graf dunia kecil yang dapat dinavigasi</a>"</p></li>
</ul>
