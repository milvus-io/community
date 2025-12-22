---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >-
  Memperkenalkan AISAQ di Milvus: Pencarian Vektor Berskala Miliaran Baru Saja
  Menjadi 3.200× Lebih Murah untuk Memori
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: >-
  Temukan bagaimana Milvus mengurangi biaya memori hingga 3200× dengan AISAQ,
  memungkinkan pencarian miliaran vektor yang dapat diskalakan tanpa biaya
  tambahan DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Basis data vektor telah menjadi infrastruktur inti untuk sistem AI yang sangat penting, dan volume datanya tumbuh secara eksponensial-sering kali mencapai miliaran vektor. Pada skala tersebut, semuanya menjadi lebih sulit: mempertahankan latensi rendah, menjaga akurasi, memastikan keandalan, dan beroperasi di berbagai replika dan wilayah. Namun, satu tantangan cenderung muncul lebih awal dan mendominasi keputusan<strong>arsitektur-BIAYA</strong>.</p>
<p>Untuk menghadirkan pencarian cepat, sebagian besar basis data vektor menyimpan struktur pengindeksan kunci dalam DRAM (Dynamic Random Access Memory), tingkat memori tercepat dan termahal. Desain ini efektif untuk kinerja, tetapi penskalaannya buruk. Penggunaan DRAM berskala dengan ukuran data, bukan lalu lintas kueri, dan bahkan dengan kompresi atau pembongkaran sebagian SSD, sebagian besar indeks harus tetap berada di memori. Seiring dengan bertambahnya kumpulan data, biaya memori dengan cepat menjadi faktor pembatas.</p>
<p>Milvus telah mendukung <strong>DISKANN</strong>, sebuah pendekatan ANN berbasis disk yang mengurangi tekanan memori dengan memindahkan sebagian besar indeks ke SSD. Namun, DISKANN masih mengandalkan DRAM untuk representasi terkompresi yang digunakan selama pencarian. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> mengambil langkah lebih jauh dengan <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, indeks vektor berbasis disk yang terinspirasi oleh <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Dikembangkan oleh KIOXIA, arsitektur AiSAQ dirancang dengan "Zero-DRAM-Footprint Architecture", yang menyimpan semua data yang sangat penting untuk pencarian pada disk dan mengoptimalkan penempatan data untuk meminimalisir operasi I/O. Dalam beban kerja miliaran vektor, hal ini mengurangi penggunaan memori dari <strong>32 GB menjadi sekitar 10</strong> <strong>MB-pengurangan 3.200×-sekaligus</strong>mempertahankan kinerja praktis.</p>
<p>Pada bagian selanjutnya, kami akan menjelaskan cara kerja pencarian vektor berbasis grafik, di mana biaya memori berasal, dan bagaimana AISAQ membentuk ulang kurva biaya untuk pencarian vektor skala miliar.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Cara Kerja Pencarian Vektor Berbasis Grafik Konvensional<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Pencarian vektor</strong> adalah proses menemukan titik data yang representasi numeriknya paling dekat dengan kueri dalam ruang berdimensi tinggi. "Terdekat" berarti jarak terkecil menurut fungsi jarak, seperti jarak kosinus atau jarak L2. Dalam skala kecil, ini sangat mudah: hitung jarak antara kueri dan setiap vektor, lalu kembalikan yang terdekat. Namun, pada skala besar, katakanlah skala miliaran, pendekatan ini dengan cepat menjadi terlalu lambat untuk menjadi praktis.</p>
<p>Untuk menghindari perbandingan yang melelahkan, sistem pencarian tetangga terdekat (ANNS) modern mengandalkan <strong>indeks berbasis grafik</strong>. Alih-alih membandingkan kueri dengan setiap vektor, indeks mengatur vektor ke dalam sebuah <strong>grafik</strong>. Setiap simpul mewakili sebuah vektor, dan sisi-sisi menghubungkan vektor-vektor yang secara numerik berdekatan. Struktur ini memungkinkan sistem mempersempit ruang pencarian secara dramatis.</p>
<p>Grafik dibangun terlebih dahulu, hanya berdasarkan hubungan antar vektor. Ini tidak bergantung pada kueri. Ketika sebuah kueri tiba, tugas sistem adalah <strong>menavigasi grafik secara efisien</strong> dan mengidentifikasi vektor-vektor dengan jarak terkecil ke kueri-tanpa memindai seluruh kumpulan data.</p>
<p>Pencarian dimulai dari <strong>titik awal</strong> yang telah ditentukan dalam grafik. Titik awal ini mungkin jauh dari kueri, tetapi algoritme meningkatkan posisinya selangkah demi selangkah dengan bergerak ke arah vektor yang tampak lebih dekat dengan kueri. Selama proses ini, pencarian mempertahankan dua struktur data internal yang bekerja bersama: <strong>daftar kandidat</strong> dan <strong>daftar hasil</strong>.</p>
<p>Dan dua langkah terpenting selama proses ini adalah memperluas daftar kandidat dan memperbarui daftar hasil.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Memperluas Daftar Kandidat</h3><p><strong>Daftar kandidat</strong> menunjukkan ke mana pencarian dapat dilanjutkan. Ini adalah sekumpulan node graf yang diprioritaskan yang terlihat menjanjikan berdasarkan jaraknya ke kueri.</p>
<p>Pada setiap iterasi, algoritme:</p>
<ul>
<li><p><strong>Memilih kandidat terdekat yang ditemukan sejauh ini.</strong> Dari daftar kandidat, memilih vektor dengan jarak terkecil ke kueri.</p></li>
<li><p><strong>Mengambil tetangga-tetangga vektor tersebut dari graf.</strong> Tetangga-tetangga ini adalah vektor-vektor yang diidentifikasi selama pembangunan indeks sebagai vektor yang dekat dengan vektor saat ini.</p></li>
<li><p><strong>Mengevaluasi tetangga yang belum dikunjungi dan menambahkannya ke dalam daftar kandidat.</strong> Untuk setiap tetangga yang belum dieksplorasi, algoritme menghitung jaraknya ke kueri. Tetangga yang telah dikunjungi sebelumnya dilewati, sementara tetangga baru dimasukkan ke dalam daftar kandidat jika terlihat menjanjikan.</p></li>
</ul>
<p>Dengan berulang kali memperluas daftar kandidat, pencarian akan menjelajahi wilayah yang semakin relevan dari grafik. Hal ini memungkinkan algoritme untuk terus bergerak ke arah jawaban yang lebih baik dengan hanya memeriksa sebagian kecil dari semua vektor.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Memperbarui Daftar Hasil</h3><p>Pada saat yang sama, algoritma mempertahankan <strong>daftar hasil</strong>, yang mencatat kandidat terbaik yang ditemukan sejauh ini untuk hasil akhir. Saat pencarian berlangsung, algoritme ini:</p>
<ul>
<li><p><strong>Melacak vektor terdekat yang ditemui selama penelusuran.</strong> Ini termasuk vektor yang dipilih untuk perluasan serta vektor lain yang dievaluasi di sepanjang jalan.</p></li>
<li><p><strong>Menyimpan jarak mereka ke kueri.</strong> Hal ini memungkinkan untuk mengurutkan kandidat dan mempertahankan K tetangga terdekat saat ini.</p></li>
</ul>
<p>Seiring waktu, dengan semakin banyaknya kandidat yang dievaluasi dan semakin sedikitnya perbaikan yang ditemukan, daftar hasil akan menjadi stabil. Ketika eksplorasi graf lebih lanjut tidak mungkin menghasilkan vektor yang lebih dekat, pencarian dihentikan dan mengembalikan daftar hasil sebagai jawaban akhir.</p>
<p>Secara sederhana, <strong>daftar kandidat mengontrol eksplorasi</strong>, sementara <strong>daftar hasil menangkap jawaban terbaik yang ditemukan sejauh ini</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">Pertukaran dalam Pencarian Vektor Berbasis Graf<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Pendekatan berbasis grafik inilah yang membuat pencarian vektor berskala besar menjadi praktis. Dengan menavigasi grafik alih-alih memindai setiap vektor, sistem dapat menemukan hasil berkualitas tinggi dengan hanya menyentuh sebagian kecil dataset.</p>
<p>Namun, efisiensi ini tidak gratis. Pencarian berbasis grafik memperlihatkan pertukaran mendasar antara <strong>akurasi dan biaya</strong>.</p>
<ul>
<li><p>Menjelajahi lebih banyak tetangga akan meningkatkan akurasi dengan mencakup porsi yang lebih besar dari grafik dan mengurangi kemungkinan kehilangan tetangga terdekat yang sebenarnya.</p></li>
<li><p>Pada saat yang sama, setiap perluasan tambahan akan menambah pekerjaan: lebih banyak perhitungan jarak, lebih banyak akses ke struktur graf, dan lebih banyak pembacaan data vektor. Ketika pencarian menjelajah lebih dalam atau lebih luas, biaya-biaya ini akan terakumulasi. Tergantung pada bagaimana indeks dirancang, biaya-biaya ini muncul sebagai penggunaan CPU yang lebih tinggi, peningkatan tekanan memori, atau I/O disk tambahan.</p></li>
</ul>
<p>Menyeimbangkan kekuatan yang berlawanan ini - daya ingat yang tinggi versus penggunaan sumber daya yang efisien - adalah inti dari desain pencarian berbasis grafik.</p>
<p>Baik <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> maupun <strong>AISAQ</strong> dibangun berdasarkan ketegangan yang sama, tetapi mereka membuat pilihan arsitektur yang berbeda tentang bagaimana dan di mana biaya-biaya ini dibayarkan.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">Bagaimana DISKANN Mengoptimalkan Pencarian Vektor Berbasis Disk<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN adalah solusi ANN berbasis disk yang paling berpengaruh hingga saat ini dan berfungsi sebagai dasar resmi untuk kompetisi NeurIPS Big ANN, sebuah tolok ukur global untuk pencarian vektor berskala miliaran. Signifikansi DISKANN tidak hanya terletak pada performa, tetapi juga pada apa yang telah dibuktikannya: <strong>pencarian ANN berbasis grafik tidak harus disimpan di dalam memori untuk dapat bekerja dengan cepat.</strong></p>
<p>Dengan menggabungkan penyimpanan berbasis SSD dengan struktur memori yang dipilih dengan cermat, DISKANN menunjukkan bahwa pencarian vektor berskala besar dapat mencapai akurasi yang kuat dan latensi rendah pada perangkat keras komoditas-tanpa memerlukan jejak DRAM yang besar. Hal ini dilakukan dengan memikirkan kembali <em>bagian mana dari pencarian yang harus cepat</em> dan <em>bagian mana yang dapat mentolerir akses yang lebih lambat</em>.</p>
<p><strong>Pada tingkat yang tinggi, DISKANN menyimpan data yang paling sering diakses dalam memori, sementara memindahkan struktur yang lebih besar dan lebih jarang diakses ke disk.</strong> Keseimbangan ini dicapai melalui beberapa pilihan desain utama.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Menggunakan Jarak PQ untuk Memperluas Daftar Kandidat</h3><p>Memperluas daftar kandidat adalah operasi yang paling sering dilakukan dalam pencarian berbasis grafik. Setiap perluasan membutuhkan estimasi jarak antara vektor kueri dan tetangga dari simpul kandidat. Melakukan perhitungan ini menggunakan vektor dimensi tinggi yang lengkap akan membutuhkan pembacaan acak yang sering dari disk - sebuah operasi yang mahal baik secara komputasi maupun dalam hal I/O.</p>
<p>DISKANN menghindari biaya ini dengan mengompresi vektor ke dalam <strong>kode Product Quantization (PQ)</strong> dan menyimpannya di dalam memori. Kode PQ jauh lebih kecil daripada vektor penuh, tetapi masih menyimpan informasi yang cukup untuk memperkirakan jarak.</p>
<p>Selama perluasan kandidat, DISKANN menghitung jarak menggunakan kode PQ dalam memori ini alih-alih membaca vektor penuh dari SSD. Hal ini secara dramatis mengurangi I/O disk selama penelusuran grafik, sehingga pencarian dapat memperluas kandidat dengan cepat dan efisien sekaligus menjaga sebagian besar lalu lintas SSD di luar jalur kritis.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Menempatkan Vektor Penuh dan Daftar Tetangga secara Bersama pada Disk</h3><p>Tidak semua data dapat dikompresi atau diakses secara kira-kira. Setelah kandidat yang menjanjikan diidentifikasi, pencarian masih membutuhkan akses ke dua jenis data untuk mendapatkan hasil yang akurat:</p>
<ul>
<li><p><strong>Daftar tetangga</strong>, untuk melanjutkan penelusuran graf</p></li>
<li><p><strong>Vektor penuh (tidak terkompresi)</strong>, untuk pemeringkatan akhir</p></li>
</ul>
<p>Struktur-struktur ini lebih jarang diakses dibandingkan kode PQ, sehingga DISKANN menyimpannya di SSD. Untuk meminimalkan overhead disk, DISKANN menempatkan daftar tetangga setiap node dan vektor penuhnya di wilayah fisik yang sama pada disk. Hal ini memastikan bahwa satu kali pembacaan SSD dapat mengambil keduanya.</p>
<p>Dengan menempatkan data terkait secara bersamaan, DISKANN mengurangi jumlah akses disk acak yang diperlukan selama pencarian. Pengoptimalan ini meningkatkan efisiensi ekspansi dan pemeringkatan, terutama pada skala besar.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Perluasan Node Paralel untuk Pemanfaatan SSD yang Lebih Baik</h3><p>Pencarian ANN berbasis grafik adalah proses yang berulang. Jika setiap iterasi hanya memperluas satu node kandidat, sistem hanya mengeluarkan satu disk yang dibaca dalam satu waktu, sehingga sebagian besar bandwidth paralel SSD tidak terpakai. Untuk menghindari ketidakefisienan ini, DISKANN memperluas beberapa kandidat dalam setiap iterasi dan mengirimkan permintaan baca paralel ke SSD. Pendekatan ini memanfaatkan bandwidth yang tersedia dengan lebih baik dan mengurangi jumlah iterasi yang diperlukan.</p>
<p>Parameter <strong>beam_width_ratio</strong> mengontrol berapa banyak kandidat yang diperluas secara paralel: <strong>Lebar berkas = jumlah inti CPU × rasio beam_width_ratio.</strong> Rasio yang lebih tinggi akan memperluas pencarian - berpotensi meningkatkan akurasi - tetapi juga meningkatkan komputasi dan I/O disk.</p>
<p>Untuk mengimbangi hal ini, DISKANN memperkenalkan <code translate="no">search_cache_budget_gb_ratio</code> yang mencadangkan memori untuk menyimpan data yang sering diakses, sehingga mengurangi pembacaan SSD yang berulang. Bersama-sama, mekanisme ini membantu DISKANN menyeimbangkan akurasi, latensi, dan efisiensi I/O.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Mengapa Hal Ini Penting - dan Di Mana Batasannya Muncul</h3><p>Desain DISKANN merupakan langkah maju yang besar untuk pencarian vektor berbasis disk. Dengan menyimpan kode PQ dalam memori dan mendorong struktur yang lebih besar ke SSD, hal ini secara signifikan mengurangi jejak memori dibandingkan dengan indeks grafik yang sepenuhnya berada dalam memori.</p>
<p>Pada saat yang sama, arsitektur ini masih bergantung pada <strong>DRAM yang selalu aktif</strong> untuk data yang sangat penting untuk pencarian. Kode PQ, cache, dan struktur kontrol harus tetap berada di dalam memori untuk menjaga efisiensi penelusuran. Ketika dataset berkembang menjadi miliaran vektor dan penyebaran menambahkan replika atau wilayah, kebutuhan memori masih dapat menjadi faktor pembatas.</p>
<p>Ini adalah celah yang dirancang untuk diatasi oleh <strong>AISAQ</strong>.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Bagaimana AISAQ Bekerja dan Mengapa Ini Penting<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ dibangun langsung di atas ide inti di balik DISKANN, tetapi memperkenalkan perubahan penting: AISAQ menghilangkan <strong>kebutuhan untuk menyimpan data PQ dalam DRAM</strong>. Alih-alih memperlakukan vektor yang dikompresi sebagai struktur yang sangat penting untuk pencarian dan selalu ada di memori, AISAQ memindahkannya ke SSD dan mendesain ulang bagaimana data grafik ditata di disk untuk mempertahankan penjelajahan yang efisien.</p>
<p>Untuk melakukan hal ini, AISAQ mengatur ulang penyimpanan node sehingga data yang dibutuhkan selama pencarian grafik - vektor penuh, daftar tetangga, dan informasi PQ - disusun pada disk dalam pola yang dioptimalkan untuk lokalitas akses. Tujuannya bukan hanya untuk mendorong lebih banyak data ke disk yang lebih ekonomis, tetapi juga melakukannya <strong>tanpa merusak proses pencarian yang telah dijelaskan sebelumnya</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk memenuhi kebutuhan aplikasi yang berbeda, AISAQ menyediakan dua mode penyimpanan berbasis disk: Performa dan Skala. Dari perspektif teknis, mode-mode ini berbeda terutama dalam hal bagaimana data yang dikompresi PQ disimpan dan diakses selama pencarian. Dari perspektif aplikasi, mode-mode ini menangani dua jenis kebutuhan yang berbeda: kebutuhan latensi rendah, tipikal pencarian semantik online dan sistem rekomendasi, dan kebutuhan skala sangat tinggi, tipikal RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">Kinerja AISAQ: Dioptimalkan untuk Kecepatan</h3><p>Performa AISAQ menyimpan semua data di disk sambil mempertahankan overhead I/O yang rendah melalui kolokasi data.</p>
<p>Dalam mode ini:</p>
<ul>
<li><p>Vektor lengkap setiap node, daftar edge, dan kode PQ tetangganya disimpan bersama pada disk.</p></li>
<li><p>Mengunjungi sebuah node hanya membutuhkan <strong>satu pembacaan SSD</strong>, karena semua data yang diperlukan untuk ekspansi dan evaluasi kandidat berada dalam satu lokasi.</p></li>
</ul>
<p>Dari perspektif algoritma pencarian, hal ini sangat mirip dengan pola akses DISKANN. Perluasan kandidat tetap efisien, dan kinerja runtime sebanding, meskipun semua data yang sangat penting untuk pencarian sekarang berada di disk.</p>
<p>Pengorbanannya adalah biaya penyimpanan. Karena data PQ tetangga dapat muncul di beberapa halaman disk beberapa node, tata letak ini memperkenalkan redundansi dan secara signifikan meningkatkan ukuran indeks secara keseluruhan.</p>
<p>Oleh karena itu, mode AISAQ-Performance memprioritaskan latensi I/O yang rendah daripada efisiensi disk. Dari perspektif aplikasi, mode AiSAQ-Performance dapat menghasilkan latensi dalam kisaran 10 mSec, seperti yang diperlukan untuk pencarian semantik online.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">Skala AISAQ: Dioptimalkan untuk Efisiensi Penyimpanan</h3><p>AISAQ-Scale mengambil pendekatan yang berlawanan. Mode ini dirancang untuk <strong>meminimalkan penggunaan disk</strong> sambil tetap menyimpan semua data pada SSD.</p>
<p>Dalam mode ini:</p>
<ul>
<li><p>Data PQ disimpan pada disk secara terpisah, tanpa redundansi.</p></li>
<li><p>Hal ini menghilangkan redundansi dan secara dramatis mengurangi ukuran indeks.</p></li>
</ul>
<p>Kompensasinya adalah bahwa mengakses node dan kode PQ tetangganya mungkin memerlukan <strong>beberapa pembacaan SSD</strong>, sehingga meningkatkan operasi I/O selama perluasan kandidat. Jika tidak dioptimalkan, hal ini akan memperlambat pencarian secara signifikan.</p>
<p>Untuk mengendalikan overhead ini, mode AISAQ-Scale memperkenalkan dua pengoptimalan tambahan:</p>
<ul>
<li><p>Penataan<strong>ulang data PQ</strong>, yang mengurutkan vektor PQ berdasarkan prioritas akses untuk meningkatkan lokalitas dan mengurangi pembacaan secara acak.</p></li>
<li><p><strong>Cache PQ dalam DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), yang menyimpan data PQ yang sering diakses dan menghindari pembacaan disk berulang kali untuk entri yang panas.</p></li>
</ul>
<p>Dengan pengoptimalan ini, mode AISAQ-Scale mencapai efisiensi penyimpanan yang jauh lebih baik daripada AISAQ-Performance, dengan tetap mempertahankan kinerja pencarian yang praktis. Performa tersebut tetap lebih rendah daripada DISKANN, tetapi tidak ada overhead penyimpanan (ukuran indeks serupa dengan DISKANN) dan jejak memori secara dramatis lebih kecil. Dari perspektif aplikasi, AiSAQ menyediakan sarana untuk memenuhi persyaratan RAG pada skala sangat tinggi.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Keuntungan Utama dari AISAQ</h3><p>Dengan memindahkan semua data yang sangat penting untuk pencarian ke disk dan mendesain ulang bagaimana data tersebut diakses, AISAQ secara fundamental mengubah profil biaya dan skalabilitas pencarian vektor berbasis grafik. Desainnya memberikan tiga keuntungan yang signifikan.</p>
<p><strong>1. Penggunaan DRAM Lebih Rendah Hingga 3.200× Lebih Rendah</strong></p>
<p>Kuantisasi Produk secara signifikan mengurangi ukuran vektor dimensi tinggi, tetapi pada skala miliaran, jejak memori masih cukup besar. Bahkan setelah kompresi, kode PQ harus disimpan dalam memori selama pencarian dalam desain konvensional.</p>
<p>Sebagai contoh, pada <strong>SIFT1B</strong>, sebuah benchmark dengan satu miliar vektor 128 dimensi, kode PQ saja membutuhkan sekitar <strong>30-120 GB DRAM</strong>, tergantung konfigurasi. Menyimpan seluruh vektor yang belum dikompresi akan membutuhkan tambahan <strong>~480 GB</strong>. Meskipun PQ mengurangi penggunaan memori sebesar 4-16×, jejak yang tersisa masih cukup besar untuk mendominasi biaya infrastruktur.</p>
<p>AISAQ menghilangkan persyaratan ini sepenuhnya. Dengan menyimpan kode PQ pada SSD dan bukannya DRAM, memori tidak lagi dikonsumsi oleh data indeks yang persisten. DRAM hanya digunakan untuk struktur yang ringan dan bersifat sementara seperti daftar kandidat dan metadata kontrol. Pada praktiknya, hal ini mengurangi penggunaan memori dari puluhan gigabyte menjadi <strong>sekitar 10 MB</strong>. Dalam konfigurasi skala miliaran, DRAM turun dari <strong>32 GB menjadi 10 MB</strong>, sebuah <strong>pengurangan 3.200 kali</strong> lipat.</p>
<p>Mengingat biaya penyimpanan SSD kira-kira <strong>1/30 harga per unit kapasitas</strong> dibandingkan dengan DRAM, pergeseran ini memiliki dampak langsung dan dramatis pada total biaya sistem.</p>
<p><strong>2. Tidak Ada Overhead I/O Tambahan</strong></p>
<p>Memindahkan kode PQ dari memori ke disk biasanya akan meningkatkan jumlah operasi I/O selama pencarian. AISAQ menghindari hal ini dengan mengontrol <strong>tata letak data dan pola akses secara</strong> hati-hati. Daripada menyebarkan data terkait ke seluruh disk, AISAQ menempatkan kode PQ, vektor penuh, dan daftar tetangga secara bersamaan sehingga dapat diambil bersama-sama. Hal ini memastikan bahwa perluasan kandidat tidak menimbulkan pembacaan acak tambahan.</p>
<p>Untuk memberikan kontrol kepada pengguna atas pertukaran antara ukuran indeks dan efisiensi I/O, AISAQ memperkenalkan parameter <code translate="no">inline_pq</code>, yang menentukan berapa banyak data PQ yang disimpan sejajar dengan setiap node:</p>
<ul>
<li><p><strong>Inline_pq yang lebih rendah:</strong> ukuran indeks yang lebih kecil, tetapi mungkin memerlukan I / O tambahan</p></li>
<li><p><strong>Inline_pq yang lebih tinggi:</strong> ukuran indeks yang lebih besar, tetapi mempertahankan akses sekali baca</p></li>
</ul>
<p>Ketika dikonfigurasi dengan <strong>inline_pq = max_degree</strong>, AISAQ membaca vektor penuh node, daftar tetangga, dan semua kode PQ dalam satu operasi disk, sesuai dengan pola I/O DISKANN sambil menyimpan semua data pada SSD.</p>
<p><strong>3. Akses PQ Berurutan Meningkatkan Efisiensi Komputasi</strong></p>
<p>Dalam DISKANN, memperluas node kandidat membutuhkan R akses memori acak untuk mengambil kode PQ dari R tetangganya. AISAQ menghilangkan keacakan ini dengan mengambil semua kode PQ dalam satu I/O dan menyimpannya secara berurutan pada disk.</p>
<p>Tata letak berurutan memberikan dua manfaat penting:</p>
<ul>
<li><p><strong>Pembacaan SSD berurutan jauh lebih cepat</strong> daripada pembacaan acak yang tersebar.</p></li>
<li><p><strong>Data yang bersebelahan lebih ramah terhadap cache</strong>, sehingga memungkinkan CPU menghitung jarak PQ dengan lebih efisien.</p></li>
</ul>
<p>Hal ini meningkatkan kecepatan dan prediktabilitas penghitungan jarak PQ serta membantu mengimbangi biaya performa penyimpanan kode PQ pada SSD daripada DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs DISKANN: Evaluasi Performa<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah memahami perbedaan AISAQ secara arsitektur dengan DISKANN, pertanyaan selanjutnya adalah: <strong>bagaimana pilihan desain ini memengaruhi performa dan penggunaan sumber daya dalam praktiknya?</strong> Evaluasi ini membandingkan AISAQ dan DISKANN dalam tiga dimensi yang paling penting dalam skala miliaran: <strong>kinerja pencarian, konsumsi memori, dan penggunaan disk</strong>.</p>
<p>Secara khusus, kami memeriksa bagaimana AISAQ berperilaku ketika jumlah data PQ yang di-inline-kan (<code translate="no">INLINE_PQ</code>) berubah. Parameter ini secara langsung mengontrol pertukaran antara ukuran indeks, I/O disk, dan efisiensi runtime. Kami juga mengevaluasi kedua pendekatan pada <strong>beban kerja vektor berdimensi rendah dan tinggi, karena dimensi sangat mempengaruhi biaya komputasi jarak dan</strong> kebutuhan penyimpanan.</p>
<h3 id="Setup" class="common-anchor-header">Pengaturan</h3><p>Semua eksperimen dilakukan pada sistem node tunggal untuk mengisolasi perilaku indeks dan menghindari gangguan dari jaringan atau efek sistem terdistribusi.</p>
<p><strong>Konfigurasi perangkat keras:</strong></p>
<ul>
<li><p>CPU: Intel® Xeon® Platinum 8375C CPU @ 2.90GHz</p></li>
<li><p>Memori: Kecepatan: 3200 MT/s, Tipe: DDR4, Ukuran: 32 GB</p></li>
<li><p>Disk: SSD NVMe 500 GB</p></li>
</ul>
<p><strong>Parameter Pembuatan Indeks</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parameter Kueri</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Metode Pembandingan</h3><p>Baik DISKANN maupun AISAQ diuji menggunakan <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, mesin pencari vektor sumber terbuka yang digunakan di Milvus. Dua set data digunakan dalam evaluasi ini:</p>
<ul>
<li><p><strong>SIFT128D (vektor 1M):</strong> tolok ukur 128 dimensi yang terkenal yang biasa digunakan untuk pencarian deskriptor gambar. <em>(Ukuran dataset mentah ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1M vektor):</strong> set penyematan 768 dimensi yang khas untuk pencarian semantik berbasis transformator. <em>(Ukuran set data mentah ≈ 2930 MB)</em></p></li>
</ul>
<p>Kumpulan data ini mencerminkan dua skenario dunia nyata yang berbeda: fitur penglihatan yang ringkas dan penyematan semantik yang besar.</p>
<h3 id="Results" class="common-anchor-header">Hasil</h3><p><strong>Sift128D1M (Vektor Penuh ~ 488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_53da7b566a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (Vektor Penuh ~ 2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">Analisis</h3><p><strong>Kumpulan Data SIFT128D</strong></p>
<p>Pada dataset SIFT128D, AISAQ dapat menyamai performa DISKANN ketika semua data PQ dibuat sebaris sehingga data yang dibutuhkan setiap node dapat dimasukkan seluruhnya ke dalam satu halaman SSD 4 KB (INLINE_PQ = 48). Dengan konfigurasi ini, setiap informasi yang dibutuhkan selama pencarian akan ditempatkan secara berurutan:</p>
<ul>
<li><p>Vektor penuh: 512B</p></li>
<li><p>Daftar tetangga: 48 × 4 + 4 = 196B</p></li>
<li><p>Kode PQ tetangga: 48 × (512B × 0.125) ≈ 3072B</p></li>
<li><p>Total: 3780B</p></li>
</ul>
<p>Karena seluruh node muat dalam satu halaman, hanya satu I/O yang diperlukan per akses, dan AISAQ menghindari pembacaan data PQ eksternal secara acak.</p>
<p>Namun, ketika hanya sebagian dari data PQ yang diisikan, kode PQ yang tersisa harus diambil dari tempat lain pada disk. Hal ini memperkenalkan operasi I / O acak tambahan, yang secara tajam meningkatkan permintaan IOPS dan menyebabkan penurunan kinerja yang signifikan.</p>
<p><strong>Kumpulan Data Cohere768D</strong></p>
<p>Pada dataset Cohere768D, AISAQ berkinerja lebih buruk daripada DISKANN. Alasannya adalah vektor 768 dimensi tidak muat dalam satu halaman SSD 4 KB:</p>
<ul>
<li><p>Vektor penuh: 3072B</p></li>
<li><p>Daftar tetangga: 48 × 4 + 4 = 196B</p></li>
<li><p>Kode PQ tetangga: 48 × (3072B × 0,125) ≈ 18432B</p></li>
<li><p>Total: 21.700 B (≈ 6 halaman)</p></li>
</ul>
<p>Dalam kasus ini, meskipun semua kode PQ sebaris, setiap simpul mencakup beberapa halaman. Meskipun jumlah operasi I/O tetap konsisten, namun setiap I/O harus mentransfer lebih banyak data, sehingga menghabiskan bandwidth SSD lebih cepat. Setelah bandwidth menjadi faktor pembatas, AISAQ tidak dapat mengimbangi DISKANN-terutama pada beban kerja berdimensi tinggi di mana jejak data per node tumbuh dengan cepat.</p>
<p><strong>Catatan:</strong></p>
<p>Tata letak penyimpanan AISAQ biasanya meningkatkan ukuran indeks pada disk sebesar <strong>4× hingga 6×.</strong> Hal ini merupakan pertukaran yang disengaja: vektor penuh, daftar tetangga, dan kode PQ ditempatkan di disk untuk memungkinkan akses satu halaman yang efisien selama pencarian. Meskipun hal ini meningkatkan penggunaan SSD, kapasitas disk secara signifikan lebih murah daripada DRAM dan lebih mudah diukur pada volume data yang besar.</p>
<p>Pada praktiknya, pengguna dapat menyesuaikan keseimbangan ini dengan menyesuaikan rasio kompresi <code translate="no">INLINE_PQ</code> dan PQ. Parameter ini memungkinkan untuk menyeimbangkan kinerja pencarian, jejak disk, dan biaya sistem secara keseluruhan berdasarkan kebutuhan beban kerja, daripada dibatasi oleh batas memori tetap.</p>
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
    </button></h2><p>Ekonomi perangkat keras modern sedang berubah. Harga DRAM tetap tinggi, sementara performa SSD telah berkembang pesat - drive PCIe 5.0 sekarang memberikan bandwidth melebihi <strong>14 GB/s</strong>. Hasilnya, arsitektur yang mengalihkan data penting untuk pencarian dari DRAM yang mahal ke penyimpanan SSD yang jauh lebih terjangkau menjadi semakin menarik. Dengan kapasitas SSD yang harganya <strong>kurang dari 30 kali lipat per gigabyte</strong> dibandingkan dengan DRAM, perbedaan ini tidak lagi bersifat marjinal - perbedaan ini sangat berpengaruh pada desain sistem.</p>
<p>AISAQ mencerminkan pergeseran ini. Dengan menghilangkan kebutuhan akan alokasi memori yang besar dan selalu aktif, AISAQ memungkinkan sistem pencarian vektor untuk menskalakan berdasarkan ukuran data dan kebutuhan beban kerja, bukan batas DRAM. Pendekatan ini selaras dengan tren yang lebih luas terhadap arsitektur "all-in-storage", di mana SSD cepat memainkan peran utama tidak hanya dalam persistensi, tetapi juga dalam komputasi dan pencarian aktif. Dengan menawarkan dua mode operasi - Performa dan Skala - AiSAQ memenuhi persyaratan pencarian semantik (yang membutuhkan latensi terendah) dan RAG (yang membutuhkan skala yang sangat tinggi, tetapi latensi sedang).</p>
<p>Pergeseran ini sepertinya tidak akan terbatas pada database vektor. Pola desain yang serupa sudah muncul dalam pemrosesan grafik, analitik deret waktu, dan bahkan bagian dari sistem relasional tradisional, karena para pengembang memikirkan kembali asumsi lama tentang di mana data harus berada untuk mencapai kinerja yang dapat diterima. Karena ekonomi perangkat keras terus berkembang, arsitektur sistem akan mengikuti.</p>
<p>Untuk detail lebih lanjut tentang desain yang dibahas di sini, lihat dokumentasinya:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Dokumentasi Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Dokumentasi Milvus</a></p></li>
</ul>
<p>Ada pertanyaan atau ingin mendalami fitur-fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
