---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: Bacaan Makalah ｜ HM-ANN Ketika ANNS Memenuhi Memori Heterogen
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: >-
  HM-ANN Pencarian Tetangga Terdekat dengan Titik Miliar yang Efisien pada
  Memori Heterogen
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>Bacaan Makalah ｜ HM-ANN: Ketika ANNS Bertemu dengan Memori Heterogen</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: Pencarian Tetangga Terdekat yang Efisien pada Memori Heterogen</a> adalah makalah penelitian yang diterima di Konferensi Sistem Pemrosesan Informasi Neural 2020<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020)</a>. Dalam makalah ini, sebuah algoritma baru untuk pencarian kemiripan berbasis graf, yang disebut HM-ANN, diusulkan. Algoritma ini mempertimbangkan heterogenitas memori dan heterogenitas data dalam pengaturan perangkat keras modern. HM-ANN memungkinkan pencarian kemiripan berskala miliaran pada satu mesin tanpa teknologi kompresi. Memori heterogen (HM) merupakan kombinasi dari memori akses acak dinamis (DRAM) yang cepat namun kecil dan memori persisten (PMem) yang lambat namun besar. HM-ANN mencapai latensi pencarian yang rendah dan akurasi pencarian yang tinggi, terutama ketika set data tidak dapat masuk ke dalam DRAM. Algoritme ini memiliki keunggulan yang berbeda dari solusi pencarian perkiraan tetangga terdekat (ANN) yang canggih.</p>
<custom-h1>Motivasi</custom-h1><p>Sejak awal, algoritme pencarian ANN telah menimbulkan tradeoff mendasar antara akurasi kueri dan latensi kueri karena kapasitas DRAM yang terbatas. Untuk menyimpan indeks dalam DRAM untuk akses kueri yang cepat, perlu untuk membatasi jumlah titik data atau menyimpan vektor yang dikompresi, yang keduanya merusak akurasi pencarian. Indeks berbasis grafik (misalnya Hierarchical Navigable Small World, HNSW) memiliki performa runtime kueri dan akurasi kueri yang unggul. Namun, indeks ini juga dapat menghabiskan DRAM tingkat 1-TiB ketika beroperasi pada set data berskala miliaran.</p>
<p>Ada solusi lain untuk menghindari DRAM menyimpan set data berskala miliaran dalam format mentah. Ketika dataset terlalu besar untuk dimasukkan ke dalam memori pada satu mesin, pendekatan terkompresi seperti kuantisasi produk dari titik-titik dataset digunakan. Namun, recall dari indeks-indeks tersebut dengan dataset terkompresi biasanya rendah karena hilangnya presisi selama kuantisasi. Subramanya dkk. [1] mengeksplorasi pemanfaatan solid-state drive (SSD) untuk mencapai pencarian ANN berskala miliaran menggunakan mesin tunggal dengan pendekatan yang disebut Disk-ANN, di mana dataset mentah disimpan di SSD dan representasi yang dikompresi di DRAM.</p>
<custom-h1>Pengantar Memori Heterogen</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Memori heterogen (HM) merupakan kombinasi dari DRAM yang cepat namun kecil dan PMem yang lambat namun besar. DRAM adalah perangkat keras normal yang dapat ditemukan di setiap server modern, dan aksesnya relatif cepat. Teknologi PMem baru, seperti Modul Memori Persisten Intel® Optane™ DC, menjembatani kesenjangan antara flash berbasis NAND (SSD) dan DRAM, sehingga menghilangkan hambatan I/O. PMem tahan lama seperti SSD, dan dapat dialamatkan langsung oleh CPU, seperti memori. Renen dkk. [2] menemukan bahwa bandwidth baca PMem 2,6 kali lebih rendah, dan bandwidth tulis 7,5 kali lebih rendah, dibandingkan DRAM dalam lingkungan eksperimen yang dikonfigurasi.</p>
<custom-h1>Desain HM-ANN</custom-h1><p>HM-ANN adalah algoritme pencarian ANN berskala miliaran yang akurat dan cepat yang berjalan pada satu mesin tanpa kompresi. Desain HM-ANN menggeneralisasi ide HNSW, yang struktur hirarkinya secara alami cocok dengan HM. HNSW terdiri dari beberapa lapisan-hanya lapisan 0 yang berisi seluruh dataset, dan setiap lapisan yang tersisa berisi subset elemen dari lapisan yang berada tepat di bawahnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>Elemen-elemen di lapisan atas, yang hanya mencakup subset dari dataset, menggunakan sebagian kecil dari keseluruhan penyimpanan. Pengamatan ini membuat mereka menjadi kandidat yang layak untuk ditempatkan di DRAM. Dengan cara ini, sebagian besar pencarian pada HM-ANN diharapkan terjadi pada lapisan atas, yang memaksimalkan pemanfaatan karakteristik akses cepat DRAM. Namun, dalam kasus HNSW, sebagian besar pencarian terjadi di lapisan bawah.</li>
<li>Lapisan paling bawah membawa seluruh dataset, yang membuatnya cocok untuk ditempatkan di PMem. Karena mengakses lapisan 0 lebih lambat, maka akan lebih baik jika hanya sebagian kecil saja yang diakses oleh setiap kueri dan frekuensi aksesnya dikurangi.</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">Algoritma Konstruksi Graf<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>Ide utama dari konstruksi HM-ANN adalah membuat lapisan atas berkualitas tinggi, untuk menyediakan navigasi yang lebih baik untuk pencarian di lapisan 0. Dengan demikian, sebagian besar akses memori terjadi di DRAM, dan akses di PMem dikurangi. Untuk memungkinkan hal ini, algoritma konstruksi HM-ANN memiliki fase penyisipan dari atas ke bawah dan fase promosi dari bawah ke atas.</p>
<p>Fase penyisipan dari atas ke bawah membangun grafik dunia kecil yang dapat dinavigasi saat lapisan paling bawah ditempatkan pada PMem.</p>
<p>Fase promosi bottom-up mempromosikan titik pivot dari lapisan bawah untuk membentuk lapisan atas yang ditempatkan pada DRAM tanpa kehilangan banyak akurasi. Jika proyeksi elemen berkualitas tinggi dari lapisan 0 dibuat di lapisan 1, pencarian di lapisan 0 akan menemukan tetangga terdekat yang akurat dari kueri hanya dengan beberapa lompatan.</p>
<ul>
<li>Alih-alih menggunakan pemilihan acak HNSW untuk promosi, HM-ANN menggunakan strategi promosi tingkat tinggi untuk mempromosikan elemen dengan tingkat tertinggi di lapisan 0 ke lapisan 1. Untuk lapisan yang lebih tinggi, HM-ANN mempromosikan node berderajat tinggi ke lapisan atas berdasarkan tingkat promosi.</li>
<li>HM-ANN mempromosikan lebih banyak node dari lapisan 0 ke lapisan 1 dan menetapkan jumlah maksimum tetangga yang lebih besar untuk setiap elemen di lapisan 1. Jumlah node di lapisan atas ditentukan oleh ruang DRAM yang tersedia. Karena lapisan 0 tidak disimpan dalam DRAM, membuat setiap lapisan yang tersimpan dalam DRAM menjadi lebih padat akan meningkatkan kualitas pencarian.</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">Algoritma Pencarian Graf<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Algoritma pencarian terdiri dari dua tahap: pencarian memori cepat dan pencarian lapisan-0 paralel dengan prefetching.</p>
<h3 id="Fast-memory-search" class="common-anchor-header">Pencarian memori cepat</h3><p>Sama seperti pada HNSW, pencarian pada DRAM dimulai pada titik masuk di lapisan paling atas dan kemudian melakukan pencarian 1-greedy dari atas ke lapisan 2. Untuk mempersempit ruang pencarian di lapisan 0, HM-ANN melakukan pencarian di lapisan 1 dengan anggaran pencarian dengan <code translate="no">efSearchL1</code>, yang membatasi ukuran daftar kandidat di lapisan 1. Kandidat-kandidat dari daftar tersebut digunakan sebagai beberapa titik masuk untuk pencarian di lapisan 0, untuk meningkatkan kualitas pencarian di lapisan 0. Sementara HNSW hanya menggunakan satu titik masuk, kesenjangan antara lapisan 0 dan lapisan 1 lebih ditangani secara khusus di HM-ANN daripada kesenjangan antara dua lapisan lainnya.</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">Pencarian lapisan-0 paralel dengan pengambilan awal</h3><p>Di lapisan bawah, HM-ANN mempartisi kandidat yang disebutkan di atas secara merata dari pencarian lapisan 1 dan melihatnya sebagai titik masuk untuk melakukan pencarian multi-start 1-serakah paralel dengan utas. Kandidat teratas dari setiap pencarian dikumpulkan untuk menemukan kandidat terbaik. Seperti yang diketahui, turun dari lapisan 1 ke lapisan 0 persis menuju ke PMem. Pencarian paralel menyembunyikan latensi PMem dan memanfaatkan bandwidth memori dengan sebaik-baiknya, untuk meningkatkan kualitas pencarian tanpa meningkatkan waktu pencarian.</p>
<p>HM-ANN mengimplementasikan buffer yang dikelola perangkat lunak dalam DRAM untuk mengambil data dari PMem sebelum akses memori terjadi. Ketika mencari lapisan 1, HM-ANN secara asinkron menyalin elemen tetangga dari kandidat-kandidat di <code translate="no">efSearchL1</code> dan koneksi elemen tetangga di lapisan 1 dari PMem ke buffer. Ketika pencarian di lapisan 0 terjadi, sebagian data yang akan diakses sudah di-prefetch di DRAM, yang menyembunyikan latensi untuk mengakses PMem dan menyebabkan waktu kueri yang lebih singkat. Hal ini sesuai dengan tujuan desain HM-ANN, di mana sebagian besar akses memori terjadi di DRAM dan akses memori di PMem dikurangi.</p>
<custom-h1>Evaluasi</custom-h1><p>Dalam makalah ini, evaluasi ekstensif dilakukan. Semua percobaan dilakukan pada mesin dengan Intel Xeon Gold 6252 CPU@2.3GHz. Mesin ini menggunakan DDR4 (96GB) sebagai memori cepat dan Optane DC PMM (1,5TB) sebagai memori lambat. Lima set data dievaluasi: BIGANN, DEEP1B, SIFT1M, DEEP1M, dan GIST1M. Untuk pengujian skala miliaran, skema berikut ini disertakan: metode berbasis kuantisasi skala miliaran (IMI+OPQ dan L&amp;C), metode berbasis non-kompresi (HNSW dan NSG).</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">Perbandingan algoritme skala miliar<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Pada tabel 1, waktu pembuatan dan penyimpanan indeks berbasis grafik yang berbeda dibandingkan. HNSW membutuhkan waktu pembuatan yang paling singkat dan HM-ANN membutuhkan waktu tambahan 8% lebih lama dari HNSW. Dalam hal penggunaan penyimpanan keseluruhan, indeks HM-ANN 5-13% lebih besar daripada HSNW, karena mempromosikan lebih banyak node dari lapisan 0 ke lapisan 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Pada Gambar 1, kinerja kueri dari indeks yang berbeda dianalisis. Gambar 1 (a) dan (b) menunjukkan bahwa HM-ANN mencapai top-1 recall &gt;95% dalam waktu 1ms. Gambar 1 © dan (d) menunjukkan bahwa HM-ANN mendapatkan top-100 recall &gt; 90% dalam waktu 4 ms. HM-ANN memberikan kinerja latency-vs-recall terbaik daripada semua pendekatan lainnya.</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">Perbandingan algoritma skala jutaan<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>Pada Gambar 2, kinerja kueri dari berbagai indeks dianalisis dalam pengaturan DRAM murni. HNSW, NSG, dan HM-ANN dievaluasi dengan tiga dataset berskala jutaan yang sesuai dengan DRAM. HM-ANN masih mencapai kinerja kueri yang lebih baik daripada HNSW. Alasannya adalah karena jumlah total komputasi jarak dari HM-ANN lebih rendah (rata-rata 850/kueri) daripada HNSW (rata-rata 900/kueri) untuk mencapai target recall 99%.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">Efektivitas promosi tingkat tinggi<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada Gambar 3, strategi promosi acak dan promosi tingkat tinggi dibandingkan dalam konfigurasi yang sama. Promosi tingkat tinggi mengungguli baseline. Promosi tingkat tinggi berkinerja 1,8x, 4,3x, dan 3,9x lebih cepat daripada promosi acak untuk mencapai target pengingatan masing-masing sebesar 95%, 99%, dan 99,5%.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">Manfaat kinerja dari teknik manajemen memori<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>Gambar 5 berisi serangkaian langkah antara HNSW dan HM-ANN untuk menunjukkan bagaimana setiap optimasi HM-ANN berkontribusi pada peningkatannya. BP adalah singkatan dari Promosi dari bawah ke atas saat membangun indeks. PL0 mewakili pencarian lapisan-0 paralel, sementara DP untuk pengambilan data dari PMem ke DRAM. Selangkah demi selangkah, kinerja pencarian HM-ANN didorong lebih jauh.</p>
<custom-h1>Kesimpulan</custom-h1><p>Algoritma pengindeksan dan pencarian berbasis grafik baru, yang disebut HM-ANN, memetakan desain hirarkis ANN berbasis grafik dengan heterogenitas memori di HM. Evaluasi menunjukkan bahwa HM-ANN termasuk dalam indeks canggih baru dalam dataset miliaran titik.</p>
<p>Kami melihat adanya tren di dunia akademis dan juga industri, di mana pembangunan indeks pada perangkat penyimpanan persisten difokuskan. Untuk mengurangi tekanan dari DRAM, Disk-ANN [1] adalah sebuah indeks yang dibangun di atas SSD, yang throughput-nya jauh lebih rendah daripada PMem. Namun, pembangunan HM-ANN masih memerlukan waktu beberapa hari, di mana tidak ada perbedaan yang besar dibandingkan dengan Disk-ANN. Kami percaya bahwa ada kemungkinan untuk mengoptimalkan waktu pembangunan HM-ANN, ketika kami memanfaatkan karakteristik PMem dengan lebih hati-hati, misalnya dengan memperhatikan granularitas PMem (256 Bytes) dan menggunakan instruksi streaming untuk memotong cache. Kami juga percaya akan ada lebih banyak pendekatan dengan perangkat penyimpanan yang tahan lama yang diusulkan di masa depan.</p>
<custom-h1>Referensi</custom-h1><p>[1]: Suhas Jayaram Subramanya dan Devvrit dan Rohan Kadekodi dan Ravishankar Krishaswamy dan Ravishankar Krishaswamy: DiskANN: Pencarian Tetangga Terdekat Miliar Titik yang Akurat dan Cepat pada Satu Simpul, NIPS, 2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN: Pencarian Tetangga Terdekat dengan Titik Miliar yang Akurat dan Cepat pada Satu Simpul - Microsoft Research</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN: Pencarian Tetangga Terdekat dengan Akurasi Miliaran Titik yang Cepat dan Akurat pada Satu Simpul</a></p>
<p>[2]: Alexander van Renen dan Lukas Vogel dan Viktor Leis dan Thomas Neumann dan Alfons Kemper: Persistent Memory I/O Primitives, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">Primitif I/O Memori Persisten</a></p>
