---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: >-
  Menyatukan Pemfilteran Geospasial dan Pencarian Vektor dengan Bidang Geometri
  dan RTREE di Milvus 2.6
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_new_cover_1_a0439d3adf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Geospatial Filtering + Vector Search in Milvus with Geometry Fields and RTREE
desc: >-
  Pelajari bagaimana Milvus 2.6 menyatukan pencarian vektor dengan pengindeksan
  geospasial menggunakan bidang Geometri dan indeks RTREE, yang memungkinkan
  pencarian AI yang akurat dan sadar lokasi.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>Karena sistem AI semakin banyak diterapkan pada pengambilan keputusan secara real-time, data geospasial menjadi semakin penting dalam serangkaian aplikasi yang terus berkembang-terutama aplikasi yang beroperasi di dunia nyata atau melayani pengguna di lokasi nyata.</p>
<p>Pertimbangkan platform pengantaran makanan seperti DoorDash atau Uber Eats. Ketika pengguna melakukan pemesanan, sistem tidak hanya menghitung jarak terpendek antara dua titik. Sistem ini mengevaluasi kualitas restoran, ketersediaan kurir, kondisi lalu lintas langsung, area layanan, dan semakin banyak, penyematan pengguna dan barang yang mewakili preferensi pribadi. Demikian pula, kendaraan otonom harus melakukan perencanaan jalur, deteksi rintangan, dan pemahaman semantik tingkat pemandangan di bawah batasan latensi yang ketat - seringkali dalam hitungan milidetik. Dalam domain ini, keputusan yang efektif bergantung pada penggabungan kendala spasial dengan kesamaan semantik, daripada memperlakukannya sebagai langkah yang berdiri sendiri-sendiri.</p>
<p>Namun, pada lapisan data, data spasial dan semantik secara tradisional ditangani oleh sistem yang terpisah.</p>
<ul>
<li><p>Basis data geospasial dan ekstensi spasial dirancang untuk menyimpan koordinat, poligon, dan hubungan spasial seperti penahanan atau jarak.</p></li>
<li><p>Basis data vektor menangani penyematan vektor yang mewakili makna semantik data.</p></li>
</ul>
<p>Ketika aplikasi membutuhkan keduanya, mereka sering kali dipaksa masuk ke dalam pipeline kueri multi-tahap-memfilter berdasarkan lokasi di satu sistem, lalu melakukan pencarian vektor di sistem lain. Pemisahan ini meningkatkan kompleksitas sistem, menambah latensi kueri, dan menyulitkan untuk melakukan penalaran spasial-semantik secara efisien dalam skala besar.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> mengatasi masalah ini dengan memperkenalkan <a href="https://milvus.io/docs/geometry-field.md">Bidang Geometri</a>, yang memungkinkan pencarian kemiripan vektor digabungkan secara langsung dengan batasan spasial. Hal ini memungkinkan kasus penggunaan seperti:</p>
<ul>
<li><p>Layanan Berbasis Lokasi (LBS): "temukan POI yang mirip dalam blok kota ini"</p></li>
<li><p>Pencarian multi-modal: "mengambil foto yang serupa dalam jarak 1 km dari titik ini"</p></li>
<li><p>Peta &amp; logistik: "aset di dalam suatu wilayah" atau "rute yang berpotongan dengan jalur"</p></li>
</ul>
<p>Dipasangkan dengan <a href="https://milvus.io/docs/rtree.md">indeks RTREE yang baru-sebuah</a>struktur berbasis pohon yang dioptimalkan untuk penyaringan spasial-Milvus kini mendukung operator geospasial yang efisien seperti <code translate="no">st_contains</code>, <code translate="no">st_within</code>, dan <code translate="no">st_dwithin</code> di samping pencarian vektor berdimensi tinggi. Bersama-sama, mereka membuat pencarian cerdas yang sadar spasial tidak hanya memungkinkan, tetapi juga praktis.</p>
<p>Dalam artikel ini, kita akan membahas cara kerja Geometry Field dan indeks RTREE, dan bagaimana keduanya digabungkan dengan pencarian kemiripan vektor untuk memungkinkan aplikasi spasial-semantik di dunia nyata.</p>
<h2 id="What-Is-a-Geometry-Field-in-Milvus" class="common-anchor-header">Apa yang dimaksud dengan Bidang Geometri di Milvus?<button data-href="#What-Is-a-Geometry-Field-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Bidang Geometri</strong> adalah sebuah tipe data yang ditentukan oleh skema (<code translate="no">DataType.GEOMETRY</code>) di Milvus yang digunakan untuk menyimpan data geometri. Tidak seperti sistem yang hanya menangani koordinat mentah, Milvus mendukung berbagai struktur spasial-termasuk <strong>Point</strong>, <strong>LineString</strong>, dan <strong>Poligon</strong>.</p>
<p>Hal ini memungkinkan untuk merepresentasikan konsep dunia nyata seperti lokasi restoran (Point), zona pengantaran (Polygon), atau lintasan kendaraan otonom (LineString), semuanya dalam basis data yang sama yang menyimpan vektor semantik. Dengan kata lain, Milvus menjadi sistem terpadu untuk mengetahui <em>letak</em> sesuatu dan <em>artinya</em>.</p>
<p>Nilai geometri disimpan menggunakan format <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT</a> ), sebuah standar yang dapat dibaca manusia untuk memasukkan dan menanyakan data geometri. Hal ini menyederhanakan pemasukan dan permintaan data karena string WKT dapat dimasukkan secara langsung ke dalam catatan Milvus. Sebagai contoh:</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">Apa itu Indeks RTREE dan Bagaimana Cara Kerjanya?<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah Milvus memperkenalkan tipe data Geometri, Milvus juga membutuhkan cara yang efisien untuk menyaring objek-objek spasial. Milvus menangani hal ini dengan menggunakan pipeline penyaringan spasial dua tahap:</p>
<ul>
<li><p><strong>Pemfilteran kasar:</strong> Mempersempit kandidat dengan cepat menggunakan indeks spasial seperti RTREE.</p></li>
<li><p><strong>Penyaringan halus:</strong> Menerapkan pemeriksaan geometri yang tepat pada kandidat yang tersisa, memastikan ketepatan pada batas-batas.</p></li>
</ul>
<p>Desain ini menyeimbangkan antara kinerja dan akurasi. Indeks spasial secara agresif memangkas data yang tidak relevan, sementara pemeriksaan geometri yang tepat memastikan hasil yang benar untuk operator seperti penahanan, persimpangan, dan ambang batas jarak.</p>
<p>Inti dari pipeline ini adalah <strong>RTREE (Rectangle Tree)</strong>, struktur pengindeksan spasial yang dirancang untuk mempercepat kueri atas data geometris. RTREE bekerja dengan mengatur objek secara hirarkis menggunakan <strong>Minimum Bounding Rectangles (MBR)</strong>, yang memungkinkan sebagian besar ruang pencarian dilewati selama eksekusi kueri.</p>
<h3 id="Phase-1-Building-the-RTREE-Index" class="common-anchor-header">Tahap 1: Membangun Indeks RTREE</h3><p>Konstruksi RTREE mengikuti proses dari bawah ke atas yang mengelompokkan objek spasial yang berdekatan ke dalam wilayah yang semakin besar:</p>
<p><strong>1. Buatlah simpul-simpul daun (leaf nodes):</strong> Untuk setiap objek geometri, hitung <strong>Minimum Bounding Rectangle (MBR</strong>) - persegi panjang terkecil yang sepenuhnya berisi objek tersebut - dan simpan sebagai leaf node.</p>
<p><strong>2. Kelompokkan ke dalam kotak yang lebih besar:</strong> Kelompokkan node daun yang berdekatan dan bungkus setiap kelompok di dalam MBR baru, sehingga menghasilkan node internal.</p>
<p><strong>3. Tambahkan simpul akar:</strong> Buat simpul akar yang MBR-nya mencakup semua kelompok internal, membentuk struktur pohon yang seimbang.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Tahap 2: Mempercepat kueri</strong></p>
<p><strong>1. Membentuk kueri MBR:</strong> Hitung MBR untuk geometri yang digunakan dalam kueri Anda.</p>
<p><strong>2. Pangkas cabang:</strong> Mulai dari akar, bandingkan MBR kueri dengan setiap simpul internal. Lewati setiap cabang yang MBR-nya tidak bersinggungan dengan MBR kueri.</p>
<p><strong>3. Kumpulkan kandidat:</strong> Turun ke cabang-cabang yang berpotongan dan kumpulkan simpul-simpul daun kandidat.</p>
<p><strong>4. Lakukan pencocokan yang tepat:</strong> Untuk setiap kandidat, jalankan predikat spasial untuk mendapatkan hasil yang tepat.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">Mengapa RTREE Cepat</h3><p>RTREE memberikan kinerja yang kuat dalam penyaringan spasial karena beberapa fitur desain utama:</p>
<ul>
<li><p><strong>Setiap node menyimpan MBR:</strong> Setiap node memperkirakan area dari semua geometri di dalam sub-pohonnya. Hal ini memudahkan untuk memutuskan apakah sebuah cabang harus dieksplorasi selama kueri.</p></li>
<li><p><strong>Pemangkasan cepat:</strong> Hanya sub-pohon yang MBR-nya memotong wilayah kueri yang dieksplorasi. Area yang tidak relevan diabaikan sepenuhnya.</p></li>
<li><p><strong>Skala dengan ukuran data:</strong> RTREE mendukung pencarian spasial dalam waktu <strong>O(log N)</strong>, memungkinkan kueri yang cepat bahkan ketika dataset berkembang.</p></li>
<li><p><strong>Implementasi Boost.Geometry:</strong> Milvus membangun indeks RTREE menggunakan <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a>, pustaka C++ yang banyak digunakan yang menyediakan algoritme geometri yang dioptimalkan dan implementasi RTREE yang aman bagi thread yang cocok untuk beban kerja yang bersamaan.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">Operator geometri yang didukung</h3><p>Milvus menyediakan seperangkat operator spasial yang memungkinkan Anda untuk memfilter dan mengambil entitas berdasarkan hubungan geometris. Operator-operator ini sangat penting untuk beban kerja yang perlu memahami bagaimana objek-objek berhubungan satu sama lain dalam ruang.</p>
<p>Tabel berikut mencantumkan <a href="https://milvus.io/docs/geometry-operators.md">operator geometri</a> yang saat ini tersedia di Milvus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Operator</strong></th><th style="text-align:center"><strong>Deskripsi</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">Mengembalikan TRUE jika geometri A dan B memiliki setidaknya satu titik yang sama.</td></tr>
<tr><td style="text-align:center"><strong>st_berisi(A, B)</strong></td><td style="text-align:center">Mengembalikan TRUE jika geometri A sepenuhnya berisi geometri B (tidak termasuk batas).</td></tr>
<tr><td style="text-align:center"><strong>st_dalam(A, B)</strong></td><td style="text-align:center">Mengembalikan TRUE jika geometri A sepenuhnya terkandung di dalam geometri B. Ini adalah kebalikan dari st_contains(A, B).</td></tr>
<tr><td style="text-align:center"><strong>st_menutupi(A, B)</strong></td><td style="text-align:center">Mengembalikan TRUE jika geometri A menutupi geometri B (termasuk batas).</td></tr>
<tr><td style="text-align:center"><strong>st_menyentuh(A, B)</strong></td><td style="text-align:center">Mengembalikan TRUE jika geometri A dan B bersentuhan pada batas-batasnya tetapi tidak berpotongan secara internal.</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">Mengembalikan TRUE jika geometri A dan B identik secara spasial.</td></tr>
<tr><td style="text-align:center"><strong>st_overlap(A, B)</strong></td><td style="text-align:center">Mengembalikan TRUE jika geometri A dan B tumpang tindih sebagian dan tidak ada yang sepenuhnya berisi yang lain.</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">Mengembalikan TRUE jika jarak antara A dan B kurang dari <em>d</em>.</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">Cara Menggabungkan Indeks Geolokasi dan Indeks Vektor</h3><p>Dengan dukungan Geometri dan indeks RTREE, Milvus dapat menggabungkan pemfilteran geospasial dengan pencarian kemiripan vektor dalam satu alur kerja. Proses ini bekerja dalam dua langkah:</p>
<p><strong>1. Memfilter berdasarkan lokasi menggunakan RTREE:</strong> Milvus pertama-tama menggunakan indeks RTREE untuk mempersempit pencarian ke entitas dalam rentang geografis yang ditentukan (misalnya, "dalam jarak 2 km").</p>
<p><strong>2. Beri peringkat berdasarkan semantik menggunakan pencarian vektor:</strong> Dari kandidat yang tersisa, indeks vektor memilih hasil Top-N yang paling mirip berdasarkan kemiripan semantik.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="common-anchor-header">Kasus Penggunaan Dunia Nyata dari Pengambilan Vektor Geografis<button data-href="#Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. Layanan Pengiriman: Rekomendasi yang Lebih Cerdas dan Sadar Lokasi</h3><p>Platform seperti DoorDash atau Uber Eats menangani ratusan juta permintaan setiap harinya. Pada saat pengguna membuka aplikasi, sistem harus menentukan-berdasarkan lokasi pengguna, waktu, preferensi rasa, estimasi waktu pengantaran, lalu lintas waktu nyata, dan ketersediaan kurir-restoran atau kurir mana yang paling cocok untuk saat <em>ini</em>.</p>
<p>Biasanya, hal ini membutuhkan permintaan database geospasial dan mesin rekomendasi yang terpisah, diikuti dengan beberapa kali penyaringan dan pemeringkatan ulang. Dengan Indeks Geolokasi, Milvus sangat menyederhanakan alur kerja ini:</p>
<ul>
<li><p><strong>Penyimpanan terpadu</strong> - Koordinat restoran, lokasi kurir, dan penyematan preferensi pengguna, semuanya berada dalam satu sistem.</p></li>
<li><p><strong>Pengambilan bersama</strong> - Pertama-tama terapkan filter spasial (misalnya, <em>restoran dalam jarak 3 km</em>), lalu gunakan pencarian vektor untuk menentukan peringkat berdasarkan kesamaan, preferensi rasa, atau kualitas.</p></li>
<li><p><strong>Pengambilan keputusan yang dinamis</strong> - Menggabungkan distribusi kurir secara real-time dan sinyal lalu lintas untuk dengan cepat menentukan kurir terdekat yang paling sesuai.</p></li>
</ul>
<p>Pendekatan terpadu ini memungkinkan platform untuk melakukan penalaran spasial dan semantik dalam satu kueri. Misalnya, ketika pengguna mencari "nasi kari," Milvus mengambil restoran yang relevan secara semantik <em>dan</em> memprioritaskan restoran yang terdekat, mengantarkan dengan cepat, dan sesuai dengan profil selera pengguna.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. Mengemudi secara otonom: Keputusan yang Lebih Cerdas</h3><p>Dalam pengemudian otonom, pengindeksan geospasial sangat penting untuk persepsi, pelokalan, dan pengambilan keputusan. Kendaraan harus terus menerus menyelaraskan diri dengan peta definisi tinggi, mendeteksi rintangan, dan merencanakan lintasan yang aman-semuanya hanya dalam beberapa milidetik.</p>
<p>Dengan Milvus, tipe Geometri dan indeks RTREE dapat menyimpan dan meminta struktur spasial yang kaya seperti:</p>
<ul>
<li><p><strong>Batas-batas jalan</strong> (LineString)</p></li>
<li><p><strong>Zona pengaturan lalu lintas</strong> (Poligon)</p></li>
<li><p><strong>Rintangan</strong> yang<strong>terdeteksi</strong> (Titik)</p></li>
</ul>
<p>Struktur ini dapat diindeks secara efisien, sehingga data geospasial dapat mengambil bagian secara langsung dalam lingkaran keputusan AI. Sebagai contoh, kendaraan otonom dapat dengan cepat menentukan apakah koordinat saat ini berada di jalur tertentu atau bersinggungan dengan area terlarang, cukup melalui predikat spasial RTREE.</p>
<p>Ketika dikombinasikan dengan penyematan vektor yang dihasilkan oleh sistem persepsi-seperti penyematan pemandangan yang menangkap lingkungan mengemudi saat ini-Milvus dapat mendukung kueri yang lebih canggih, seperti mengambil skenario mengemudi historis yang mirip dengan yang sekarang dalam radius 50 meter. Hal ini membantu model menginterpretasikan lingkungan dengan lebih cepat dan membuat keputusan yang lebih baik.</p>
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
    </button></h2><p>Geolokasi lebih dari sekadar garis lintang dan garis bujur. Dalam aplikasi yang peka terhadap lokasi, geolokasi memberikan konteks penting tentang <strong>di mana peristiwa terjadi, bagaimana entitas berhubungan secara spasial, dan bagaimana hubungan tersebut membentuk perilaku sistem</strong>. Ketika digabungkan dengan sinyal semantik dari model pembelajaran mesin, data geospasial memungkinkan kelas kueri yang lebih kaya yang sulit untuk diekspresikan - atau tidak efisien untuk dieksekusi - ketika data spasial dan vektor ditangani secara terpisah.</p>
<p>Dengan diperkenalkannya Bidang Geometri dan indeks RTREE, Milvus menghadirkan pencarian kesamaan vektor dan penyaringan spasial ke dalam satu mesin kueri. Hal ini memungkinkan aplikasi untuk melakukan pengambilan bersama di seluruh <strong>vektor, data geospasial, dan waktu</strong>, mendukung kasus penggunaan seperti sistem rekomendasi yang sadar secara spasial, pencarian berbasis lokasi multimodal, dan analisis yang dibatasi wilayah atau jalur. Lebih penting lagi, hal ini mengurangi kompleksitas arsitektur dengan menghilangkan jalur pipa multi-tahap yang memindahkan data di antara sistem khusus.</p>
<p>Karena sistem AI terus bergerak lebih dekat dengan pengambilan keputusan di dunia nyata, pemahaman tentang konten <strong><em>apa</em></strong> yang relevan akan semakin perlu dipasangkan dengan <strong><em>tempat</em></strong> konten tersebut berlaku dan <strong><em>kapan</em></strong> konten tersebut penting. Milvus menyediakan blok bangunan untuk kelas beban kerja spasial-semantik ini dengan cara yang ekspresif dan praktis untuk beroperasi dalam skala besar.</p>
<p>Untuk informasi lebih lanjut mengenai Geometry Field dan indeks RTREE, lihat dokumentasi di bawah ini:</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Bidang Geometri | Dokumentasi Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Dokumentasi Milvus</a></p></li>
</ul>
<p>Ada pertanyaan atau ingin mendalami fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Pelajari Lebih Lanjut tentang Fitur Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Memperkenalkan Milvus 2.6: Pencarian Vektor yang Terjangkau dalam Skala Miliaran</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Memperkenalkan Fungsi Penyematan: Bagaimana Milvus 2.6 Menyederhanakan Vektorisasi dan Pencarian Semantik</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Penghancuran JSON di Milvus: Pemfilteran JSON 88,9x Lebih Cepat dengan Fleksibilitas</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Membuka Pengambilan Tingkat Entitas yang Sebenarnya: Kemampuan Array-of-Structs dan MAX_SIM Baru di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH di Milvus: Senjata Rahasia untuk Memerangi Duplikat dalam Data Pelatihan LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Membawa Kompresi Vektor ke Tingkat Ekstrim: Bagaimana Milvus Melayani Kueri 3× Lebih Banyak dengan RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmark Bohong - DB Vektor Layak Mendapat Ujian Nyata </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Burung Pelatuk untuk Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pencarian Vektor di Dunia Nyata: Cara Memfilter Secara Efisien Tanpa Membunuh Recall</a></p></li>
</ul>
