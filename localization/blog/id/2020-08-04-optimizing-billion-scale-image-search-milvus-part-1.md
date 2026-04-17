---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: Gambaran Umum
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: >-
  Sebuah studi kasus dengan UPYUN. Pelajari tentang bagaimana Milvus berbeda
  dari solusi basis data tradisional dan membantu membangun sistem pencarian
  kemiripan gambar.
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>Perjalanan Mengoptimalkan Pencarian Gambar Berskala Miliaran (1/2)</custom-h1><p>Yupoo Picture Manager melayani puluhan juta pengguna dan mengelola puluhan miliar gambar. Karena galeri penggunanya semakin besar, Yupoo memiliki kebutuhan bisnis yang mendesak akan solusi yang dapat menemukan gambar dengan cepat. Dengan kata lain, ketika pengguna memasukkan gambar, sistem harus menemukan gambar aslinya dan gambar serupa di galeri. Pengembangan layanan pencarian berdasarkan gambar memberikan pendekatan yang efektif untuk masalah ini.</p>
<p>Pencarian berdasarkan layanan gambar telah mengalami dua kali evolusi:</p>
<ol>
<li>Memulai penyelidikan teknis pertama pada awal 2019 dan meluncurkan sistem generasi pertama pada bulan Maret dan April 2019;</li>
<li>Memulai penyelidikan rencana peningkatan pada awal tahun 2020 dan memulai peningkatan keseluruhan ke sistem generasi kedua pada bulan April 2020.</li>
</ol>
<p>Artikel ini menjelaskan pemilihan teknologi dan prinsip-prinsip dasar di balik dua generasi sistem pencarian berdasarkan gambar berdasarkan pengalaman saya sendiri dalam proyek ini.</p>
<h2 id="Overview" class="common-anchor-header">Gambaran Umum<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">Apa yang dimaksud dengan gambar?</h3><p>Kita harus tahu apa itu gambar sebelum berurusan dengan gambar.</p>
<p>Jawabannya adalah gambar adalah kumpulan piksel.</p>
<p>Sebagai contoh, bagian dalam kotak merah pada gambar ini sebenarnya adalah serangkaian piksel.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-apakah-gambar itu.png</span> </span></p>
<p>Misalkan bagian dalam kotak merah adalah sebuah gambar, maka setiap kotak kecil yang terpisah dalam gambar adalah piksel, unit informasi dasar. Maka, ukuran gambar tersebut adalah 11 x 11 px.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-apakah-sebuah-gambar itu.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">Representasi matematis dari gambar</h3><p>Setiap gambar dapat diwakili oleh sebuah matriks. Setiap piksel pada gambar berhubungan dengan sebuah elemen dalam matriks.</p>
<h3 id="Binary-images" class="common-anchor-header">Gambar biner</h3><p>Piksel gambar biner adalah hitam atau putih, sehingga setiap piksel dapat diwakili oleh 0 atau 1. Misalnya, representasi matriks dari gambar biner 4 * 4 adalah:</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">Gambar RGB</h3><p>Tiga warna primer (merah, hijau, dan biru) dapat dicampur untuk menghasilkan warna apa pun. Untuk gambar RGB, setiap piksel memiliki informasi dasar dari tiga saluran RGB. Demikian pula, jika setiap saluran menggunakan angka 8-bit (dalam 256 level) untuk merepresentasikan skala abu-abu, maka representasi matematis piksel adalah:</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>Mengambil gambar 4 * 4 RGB sebagai contoh:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>Inti dari pemrosesan gambar adalah memproses matriks piksel ini.</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">Masalah teknis pencarian berdasarkan gambar<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda mencari gambar asli, yaitu gambar dengan piksel yang sama persis, maka Anda dapat langsung membandingkan nilai MD5-nya. Namun, gambar yang diunggah ke Internet sering kali dikompresi atau diberi tanda air. Bahkan perubahan kecil pada gambar bisa menciptakan hasil MD5 yang berbeda. Selama ada ketidakkonsistenan dalam piksel, tidak mungkin menemukan gambar aslinya.</p>
<p>Untuk sistem pencarian berdasarkan gambar, kita ingin mencari gambar dengan konten yang serupa. Maka, kita perlu menyelesaikan dua masalah dasar:</p>
<ul>
<li>Merepresentasikan atau mengabstraksikan gambar sebagai format data yang dapat diproses oleh komputer.</li>
<li>Data harus sebanding untuk perhitungan.</li>
</ul>
<p>Secara lebih spesifik, kita membutuhkan fitur-fitur berikut:</p>
<ul>
<li>Ekstraksi fitur gambar.</li>
<li>Perhitungan fitur (perhitungan kemiripan).</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">Sistem pencarian berdasarkan gambar generasi pertama<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">Ekstraksi fitur - abstraksi gambar</h3><p>Sistem pencarian berdasarkan gambar generasi pertama menggunakan algoritma hash perseptual atau pHash untuk ekstraksi fitur. Apa saja dasar-dasar algoritme ini?</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-pencarian-gambar-generasi-pertama.png</span> </span></p>
<p>Seperti yang ditunjukkan pada gambar di atas, algoritma pHash melakukan serangkaian transformasi pada gambar untuk mendapatkan nilai hash. Selama proses transformasi, algoritme ini secara terus menerus mengabstraksikan gambar, sehingga mendorong hasil gambar yang mirip menjadi lebih dekat satu sama lain.</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">Perhitungan fitur - perhitungan kemiripan</h3><p>Bagaimana cara menghitung kemiripan antara nilai hash dari dua gambar? Jawabannya adalah dengan menggunakan jarak Hamming. Semakin kecil jarak Hamming, semakin mirip konten gambarnya.</p>
<p>Apa yang dimaksud dengan jarak Hamming? Ini adalah jumlah bit yang berbeda.</p>
<p>Sebagai contoh,</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>Ada dua bit yang berbeda dalam dua nilai di atas, jadi jarak Hamming di antara keduanya adalah 2.</p>
<p>Sekarang kita sudah mengetahui prinsip perhitungan kemiripan. Pertanyaan selanjutnya adalah, bagaimana cara menghitung jarak Hamming dari data berskala 100 juta dari gambar berskala 100 juta? Singkatnya, bagaimana cara mencari gambar yang mirip?</p>
<p>Pada tahap awal proyek ini, saya tidak menemukan alat yang memuaskan (atau mesin komputasi) yang dapat dengan cepat menghitung jarak Hamming. Jadi, saya mengubah rencana saya.</p>
<p>Ide saya adalah jika jarak Hamming dari dua nilai pHash kecil, maka saya dapat memotong nilai pHash dan bagian-bagian kecil yang sesuai kemungkinan besar akan sama.</p>
<p>Sebagai contoh:</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>Kami membagi dua nilai di atas menjadi delapan segmen dan nilai dari enam segmen persis sama. Dapat disimpulkan bahwa jarak Hamming mereka dekat dan dengan demikian kedua gambar ini mirip.</p>
<p>Setelah transformasi, Anda dapat menemukan bahwa masalah penghitungan jarak Hamming telah menjadi masalah pencocokan kesepadanan. Jika saya membagi setiap nilai pHash menjadi delapan segmen, selama ada lebih dari lima segmen yang memiliki nilai yang sama persis, maka kedua nilai pHash tersebut serupa.</p>
<p>Dengan demikian, sangat mudah untuk menyelesaikan pencocokan kesetaraan. Kita bisa menggunakan pemfilteran klasik dari sistem basis data tradisional.</p>
<p>Tentu saja, saya menggunakan pencocokan multi-term dan menentukan tingkat pencocokan menggunakan minimum_should_match di ElasticSearch (artikel ini tidak memperkenalkan prinsip ES, Anda dapat mempelajarinya sendiri).</p>
<p>Mengapa kami memilih ElasticSearch? Pertama, ia menyediakan fungsi pencarian yang disebutkan di atas. Kedua, proyek image manager itu sendiri menggunakan ES untuk menyediakan fungsi pencarian teks lengkap dan sangat ekonomis untuk menggunakan sumber daya yang ada.</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">Ringkasan sistem generasi pertama<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Sistem pencarian berdasarkan gambar generasi pertama memilih solusi pHash + ElasticSearch, yang memiliki fitur-fitur berikut:</p>
<ul>
<li>Algoritme pHash mudah digunakan dan dapat menahan tingkat kompresi, tanda air, dan derau tertentu.</li>
<li>ElasticSearch menggunakan sumber daya yang ada pada proyek tanpa menambahkan biaya tambahan untuk pencarian.</li>
<li>Tetapi keterbatasan sistem ini sudah jelas: Algoritma pHash adalah representasi abstrak dari keseluruhan gambar. Setelah kita menghancurkan integritas gambar, seperti menambahkan batas hitam pada gambar asli, hampir tidak mungkin untuk menilai kemiripan antara gambar asli dan gambar lainnya.</li>
</ul>
<p>Untuk menerobos keterbatasan tersebut, sistem pencarian gambar generasi kedua dengan teknologi yang sama sekali berbeda, muncul.</p>
<p>Artikel ini ditulis oleh rifewang, pengguna Milvus dan insinyur perangkat lunak UPYUN. Jika Anda menyukai artikel ini, selamat datang untuk menyapa! https://github.com/rifewang</p>
