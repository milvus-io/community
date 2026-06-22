---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >
  Memperkenalkan AISAQ di Milvus: Pencarian Vektor Skala Miliar Kini 3.200 Kali
  Lebih Hemat dalam Penggunaan Memori
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
  Temukan bagaimana Milvus berhasil mengurangi penggunaan memori hingga 3.200
  kali lipat berkat AISAQ, sehingga memungkinkan pencarian miliaran vektor yang
  dapat diskalakan tanpa beban DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Basis data vektor telah menjadi infrastruktur inti bagi sistem AI yang sangat penting, dan volume datanya tumbuh secara eksponensial—seringkali mencapai miliaran vektor. Pada skala sebesar itu, segala sesuatunya menjadi lebih sulit: menjaga latensi rendah, mempertahankan akurasi, memastikan keandalan, serta beroperasi di seluruh replika dan wilayah. Namun, ada satu tantangan yang cenderung muncul sejak dini dan mendominasi keputusan<strong>arsitektural—BIAYA.</strong></p>
<p>Untuk menghadirkan pencarian yang cepat, sebagian besar basis data vektor menyimpan struktur pengindeksan utama di DRAM (Dynamic Random Access Memory), tingkat memori tercepat dan termahal. Desain ini efektif untuk kinerja, tetapi skalabilitasnya buruk. Penggunaan DRAM meningkat seiring dengan ukuran data, bukan lalu lintas kueri, dan bahkan dengan kompresi atau pemindahan sebagian ke SSD, sebagian besar indeks harus tetap berada di memori. Seiring bertambahnya kumpulan data, biaya memori dengan cepat menjadi faktor pembatas.</p>
<p>Milvus sudah mendukung <strong>DISKANN</strong>, sebuah pendekatan Jaringan Saraf Tiruan (ANN) berbasis disk yang mengurangi beban memori dengan memindahkan sebagian besar indeks ke SSD. Namun, DISKANN masih bergantung pada DRAM untuk representasi terkompresi yang digunakan selama pencarian. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> mengembangkan hal ini lebih lanjut dengan <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, sebuah indeks vektor berbasis disk yang terinspirasi oleh <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Dikembangkan oleh KIOXIA, arsitektur AiSAQ dirancang dengan “Arsitektur Zero-DRAM-Footprint”, yang menyimpan semua data penting untuk pencarian di disk dan mengoptimalkan penempatan data untuk meminimalkan operasi I/O. Pada beban kerja dengan satu miliar vektor, hal ini mengurangi penggunaan memori dari <strong>32 GB menjadi sekitar 10</strong> <strong>MB—penurunan</strong>sebesar <strong>3.200 kali lipat</strong>—sambil tetap mempertahankan kinerja yang praktis.</p>
<p>Pada bagian-bagian berikut, kami akan menjelaskan cara kerja pencarian vektor berbasis graf, dari mana biaya memori berasal, dan bagaimana AISAQ mengubah kurva biaya untuk pencarian vektor berskala miliaran.</p>
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
    </button></h2><p><strong>Pencarian vektor</strong> adalah proses menemukan titik data yang representasi numeriknya paling dekat dengan kueri dalam ruang berdimensi tinggi. “Terdekat” secara sederhana berarti jarak terkecil menurut fungsi jarak, seperti jarak kosinus atau jarak L2. Pada skala kecil, hal ini cukup sederhana: hitung jarak antara kueri dan setiap vektor, lalu kembalikan yang terdekat. Namun, pada skala besar, misalnya skala miliaran, pendekatan ini dengan cepat menjadi terlalu lambat untuk diterapkan secara praktis.</p>
<p>Untuk menghindari perbandingan yang melelahkan, sistem pencarian tetangga terdekat aproksimatif (ANNS) modern mengandalkan <strong>indeks berbasis graf</strong>. Alih-alih membandingkan kueri dengan setiap vektor, indeks tersebut mengorganisasikan vektor-vektor ke dalam sebuah <strong>graf</strong>. Setiap simpul mewakili sebuah vektor, dan tepi menghubungkan vektor-vektor yang secara numerik berdekatan. Struktur ini memungkinkan sistem untuk mempersempit ruang pencarian secara drastis.</p>
<p>Grafik ini dibangun terlebih dahulu, hanya berdasarkan hubungan antar vektor. Grafik ini tidak bergantung pada kueri. Ketika sebuah kueri masuk, tugas sistem adalah <strong>menavigasi grafik secara efisien</strong> dan mengidentifikasi vektor-vektor dengan jarak terdekat ke kueri—tanpa perlu memindai seluruh dataset.</p>
<p>Pencarian dimulai dari <strong>titik masuk</strong> yang telah ditentukan sebelumnya dalam graf. Titik awal ini mungkin jauh dari kueri, tetapi algoritma memperbaiki posisinya selangkah demi selangkah dengan bergerak menuju vektor-vektor yang tampak lebih dekat dengan kueri. Selama proses ini, pencarian mempertahankan dua struktur data internal yang bekerja sama: <strong>daftar kandidat</strong> dan <strong>daftar hasil</strong>.</p>
<p>Dan dua langkah terpenting selama proses ini adalah memperluas daftar kandidat dan memperbarui daftar hasil.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Memperluas Daftar Kandidat</h3><p><strong>Daftar kandidat</strong> menunjukkan ke mana pencarian dapat dilanjutkan selanjutnya. Daftar ini merupakan kumpulan simpul grafik yang diprioritaskan dan tampak menjanjikan berdasarkan jaraknya ke kueri.</p>
<p>Pada setiap iterasi, algoritma:</p>
<ul>
<li><p><strong>Memilih kandidat terdekat yang telah ditemukan sejauh ini.</strong> Dari daftar kandidat, algoritma ini memilih vektor dengan jarak terkecil ke kueri.</p></li>
<li><p><strong>Mengambil tetangga vektor tersebut dari graf.</strong> Tetangga-tetangga ini adalah vektor-vektor yang diidentifikasi selama pembuatan indeks sebagai vektor yang dekat dengan vektor saat ini.</p></li>
<li><p><strong>Mengevaluasi tetangga yang belum dikunjungi dan menambahkannya ke daftar kandidat.</strong> Untuk setiap tetangga yang belum dieksplorasi, algoritma menghitung jaraknya ke kueri. Tetangga yang telah dikunjungi sebelumnya dilewati, sedangkan tetangga baru dimasukkan ke dalam daftar kandidat jika tampak menjanjikan.</p></li>
</ul>
<p>Dengan terus-menerus memperluas daftar kandidat, pencarian menjelajahi wilayah-wilayah pada grafik yang semakin relevan. Hal ini memungkinkan algoritma bergerak secara mantap menuju jawaban yang lebih baik sambil hanya memeriksa sebagian kecil dari semua vektor.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Memperbarui Daftar Hasil</h3><p>Pada saat yang sama, algoritma ini juga mengelola <strong>daftar hasil</strong>, yang mencatat kandidat terbaik yang telah ditemukan sejauh ini untuk hasil akhir. Seiring berjalannya pencarian, algoritma ini:</p>
<ul>
<li><p><strong>Melacak vektor terdekat yang ditemui selama penelusuran.</strong> Ini mencakup vektor yang dipilih untuk perluasan serta vektor lain yang dievaluasi sepanjang proses.</p></li>
<li><p><strong>Menyimpan jaraknya ke kueri.</strong> Hal ini memungkinkan untuk membuat peringkat kandidat dan mempertahankan tetangga terdekat K teratas saat ini.</p></li>
</ul>
<p>Seiring waktu, saat semakin banyak kandidat dievaluasi dan semakin sedikit perbaikan yang ditemukan, daftar hasil akan menjadi stabil. Begitu eksplorasi graf lebih lanjut tampaknya tidak akan menghasilkan vektor yang lebih dekat, pencarian akan dihentikan dan daftar hasil akan dikembalikan sebagai jawaban akhir.</p>
<p>Secara sederhana, <strong>daftar kandidat mengendalikan eksplorasi</strong>, sedangkan <strong>daftar hasil mencatat jawaban terbaik yang ditemukan sejauh ini</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">Trade-Off dalam Pencarian Vektor Berbasis Grafik<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Pendekatan berbasis graf inilah yang membuat pencarian vektor skala besar menjadi praktis sejak awal. Dengan menavigasi graf alih-alih memindai setiap vektor, sistem dapat menemukan hasil berkualitas tinggi sambil hanya menyentuh sebagian kecil dari kumpulan data.</p>
<p>Namun, efisiensi ini tidak datang begitu saja. Pencarian berbasis graf menunjukkan adanya pertukaran mendasar antara <strong>akurasi dan biaya.</strong></p>
<ul>
<li><p>Menjelajahi lebih banyak tetangga meningkatkan akurasi dengan mencakup bagian graf yang lebih luas dan mengurangi kemungkinan melewatkan tetangga terdekat yang sebenarnya.</p></li>
<li><p>Pada saat yang sama, setiap perluasan tambahan menambah beban kerja: lebih banyak perhitungan jarak, lebih banyak akses ke struktur graf, dan lebih banyak pembacaan data vektor. Seiring pencarian menjelajah lebih dalam atau lebih luas, biaya-biaya ini menumpuk. Bergantung pada bagaimana indeks dirancang, biaya-biaya ini muncul sebagai penggunaan CPU yang lebih tinggi, tekanan memori yang meningkat, atau I/O disk tambahan.</p></li>
</ul>
<p>Menyeimbangkan kekuatan yang saling bertentangan ini—recall yang tinggi versus penggunaan sumber daya yang efisien—merupakan inti dari desain pencarian berbasis graf.</p>
<p>Baik <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> maupun <strong>AISAQ</strong> dibangun berdasarkan ketegangan yang sama ini, tetapi keduanya membuat pilihan arsitektur yang berbeda mengenai bagaimana dan di mana biaya-biaya ini ditanggung.</p>
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
<p>DISKANN adalah solusi ANN berbasis disk paling berpengaruh hingga saat ini dan berfungsi sebagai baseline resmi untuk kompetisi NeurIPS Big ANN, sebuah tolok ukur global untuk pencarian vektor berskala miliaran. Signifikansinya tidak hanya terletak pada kinerjanya, tetapi juga pada apa yang telah dibuktikannya: <strong>pencarian ANN berbasis graf tidak harus sepenuhnya berada di memori untuk menjadi cepat</strong>.</p>
<p>Dengan menggabungkan penyimpanan berbasis SSD dengan struktur dalam memori yang dipilih secara cermat, DISKANN menunjukkan bahwa pencarian vektor berskala besar dapat mencapai akurasi tinggi dan latensi rendah pada perangkat keras komoditas—tanpa memerlukan ruang DRAM yang sangat besar. Hal ini dilakukan dengan meninjau kembali <em>bagian mana dari proses pencarian yang harus cepat</em> dan <em>bagian mana yang dapat mentoleransi akses yang lebih lambat</em>.</p>
<p><strong>Secara umum, DISKANN menyimpan data yang paling sering diakses di memori, sementara struktur yang lebih besar dan jarang diakses dipindahkan ke disk.</strong> Keseimbangan ini dicapai melalui beberapa pilihan desain utama.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Menggunakan Jarak PQ untuk Memperluas Daftar Kandidat</h3><p>Memperluas daftar kandidat adalah operasi yang paling sering dilakukan dalam pencarian berbasis graf. Setiap perluasan memerlukan estimasi jarak antara vektor kueri dan tetangga dari sebuah simpul kandidat. Melakukan perhitungan ini menggunakan vektor berdimensi tinggi yang utuh akan memerlukan pembacaan acak yang sering dari disk—suatu operasi yang mahal baik secara komputasi maupun dalam hal I/O.</p>
<p>DISKANN menghindari biaya ini dengan mengompres vektor menjadi <strong>kode Product Quantization (PQ)</strong> dan menyimpannya di memori. Kode PQ jauh lebih kecil daripada vektor lengkap, namun tetap mempertahankan informasi yang cukup untuk memperkirakan jarak secara aproximatif.</p>
<p>Selama perluasan kandidat, DISKANN menghitung jarak menggunakan kode PQ dalam memori ini alih-alih membaca vektor lengkap dari SSD. Hal ini secara drastis mengurangi I/O disk selama penelusuran graf, sehingga memungkinkan pencarian memperluas kandidat dengan cepat dan efisien sambil menjaga sebagian besar lalu lintas SSD tetap berada di luar jalur kritis.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Menempatkan Vektor Lengkap dan Daftar Tetangga di Lokasi yang Sama pada Disk</h3><p>Tidak semua data dapat dikompresi atau diakses secara perkiraan. Setelah kandidat yang menjanjikan teridentifikasi, pencarian masih memerlukan akses ke dua jenis data untuk hasil yang akurat:</p>
<ul>
<li><p><strong>Daftar tetangga</strong>, untuk melanjutkan penelusuran graf</p></li>
<li><p><strong>Vektor lengkap (tidak terkompresi)</strong>, untuk penentuan peringkat ulang akhir</p></li>
</ul>
<p>Struktur-struktur ini diakses lebih jarang daripada kode PQ, sehingga DISKANN menyimpannya di SSD. Untuk meminimalkan beban disk, DISKANN menempatkan daftar tetangga setiap simpul dan vektor lengkapnya di wilayah fisik yang sama pada disk. Hal ini memastikan bahwa satu kali pembacaan SSD dapat mengambil keduanya.</p>
<p>Dengan menempatkan data terkait di lokasi yang sama, DISKANN mengurangi jumlah akses disk acak yang diperlukan selama pencarian. Optimalisasi ini meningkatkan efisiensi ekspansi dan penentuan peringkat ulang, terutama dalam skala besar.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Ekspansi Node Paralel untuk Pemanfaatan SSD yang Lebih Baik</h3><p>Pencarian ANN berbasis graf adalah proses berulang. Jika setiap iterasi hanya memperluas satu node kandidat, sistem hanya mengeluarkan satu pembacaan disk pada satu waktu, sehingga sebagian besar bandwidth paralel SSD tidak terpakai. Untuk menghindari ketidakefisienan ini, DISKANN memperluas beberapa kandidat dalam setiap iterasi dan mengirimkan permintaan baca paralel ke SSD. Pendekatan ini memanfaatkan bandwidth yang tersedia dengan jauh lebih baik dan mengurangi jumlah total iterasi yang diperlukan.</p>
<p>Parameter ` <strong>beam_width_ratio</strong> ` mengontrol berapa banyak kandidat yang diperluas secara paralel: <strong>Lebar sinar = jumlah inti CPU × `beam_width_ratio`.</strong> Rasio yang lebih tinggi memperluas cakupan pencarian—berpotensi meningkatkan akurasi—tetapi juga meningkatkan beban komputasi dan I/O disk.</p>
<p>Untuk mengimbangi hal ini, DISKANN memperkenalkan cache data ( <code translate="no">search_cache_budget_gb_ratio</code> ) yang menyisihkan memori untuk menyimpan data yang sering diakses, sehingga mengurangi pembacaan berulang pada SSD. Secara bersama-sama, mekanisme ini membantu DISKANN menyeimbangkan akurasi, latensi, dan efisiensi I/O.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Mengapa Hal Ini Penting — dan Di Mana Batasannya</h3><p>Desain DISKANN merupakan langkah maju yang signifikan bagi pencarian vektor berbasis disk. Dengan menyimpan kode PQ di memori dan memindahkan struktur yang lebih besar ke SSD, desain ini secara signifikan mengurangi penggunaan memori dibandingkan dengan indeks graf yang sepenuhnya berada di memori.</p>
<p>Pada saat yang sama, arsitektur ini masih bergantung pada <strong>DRAM yang selalu aktif</strong> untuk data yang sangat penting dalam pencarian. Kode PQ, cache, dan struktur kontrol harus tetap berada di memori agar traversal tetap efisien. Seiring bertambahnya kumpulan data hingga miliaran vektor dan penambahan replika atau wilayah dalam penerapan, kebutuhan memori tersebut tetap dapat menjadi faktor pembatas.</p>
<p>Inilah celah yang dirancang untuk diatasi oleh <strong>AISAQ</strong>.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Cara Kerja AISAQ dan Mengapa Hal Ini Penting<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ dibangun langsung berdasarkan ide inti di balik DISKANN namun memperkenalkan perubahan krusial: menghilangkan <strong>kebutuhan untuk menyimpan data PQ di DRAM</strong>. Alih-alih memperlakukan vektor terkompresi sebagai struktur yang kritis bagi pencarian dan harus selalu berada di memori, AISAQ memindahkannya ke SSD dan merancang ulang tata letak data graf di disk untuk mempertahankan efisiensi traversal.</p>
<p>Agar hal ini dapat berjalan, AISAQ mengatur ulang penyimpanan node sehingga data yang dibutuhkan selama pencarian graf—vektor lengkap, daftar tetangga, dan informasi PQ—disusun di disk dalam pola yang dioptimalkan untuk akses lokalitas. Tujuannya bukan hanya untuk memindahkan lebih banyak data ke disk yang lebih ekonomis, tetapi juga melakukannya <strong>tanpa mengganggu proses pencarian yang telah dijelaskan sebelumnya</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk memenuhi berbagai kebutuhan aplikasi, AISAQ menyediakan dua mode penyimpanan berbasis disk: Kinerja dan Skala. Dari sudut pandang teknis, kedua mode ini terutama berbeda dalam cara data yang dikompresi PQ disimpan dan diakses selama pencarian. Dari sudut pandang aplikasi, mode-mode ini memenuhi dua jenis kebutuhan yang berbeda: kebutuhan latensi rendah, yang umum pada sistem pencarian semantik dan rekomendasi daring, serta kebutuhan skala sangat tinggi, yang umum pada RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance: Dioptimalkan untuk Kecepatan</h3><p>AISAQ-performance menyimpan semua data di disk sambil mempertahankan beban I/O yang rendah melalui kolokasi data.</p>
<p>Dalam mode ini:</p>
<ul>
<li><p>Vektor lengkap setiap node, daftar tepi, dan kode PQ tetangganya disimpan bersama di disk.</p></li>
<li><p>Mengunjungi sebuah node masih hanya memerlukan <strong>satu kali pembacaan SSD</strong>, karena semua data yang diperlukan untuk ekspansi dan evaluasi kandidat disimpan secara kolokasi.</p></li>
</ul>
<p>Dari perspektif algoritma pencarian, hal ini sangat mirip dengan pola akses DISKANN. Perluasan kandidat tetap efisien, dan kinerja waktu berjalan sebanding, meskipun semua data penting untuk pencarian kini berada di disk.</p>
<p>Komprominya adalah beban penyimpanan. Karena data PQ tetangga mungkin muncul di halaman disk beberapa node, tata letak ini menimbulkan redundansi dan secara signifikan meningkatkan ukuran indeks secara keseluruhan.</p>
<p>Oleh karena itu, mode AISAQ-Performance memprioritaskan latensi I/O yang rendah daripada efisiensi disk. Dari perspektif aplikasi, mode AISAQ-Performance dapat menghasilkan latensi dalam kisaran 10 mDetik, sebagaimana diperlukan untuk pencarian semantik daring.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-scale: Dioptimalkan untuk Efisiensi Penyimpanan</h3><p>AISAQ-Scale mengambil pendekatan yang berlawanan. Mode ini dirancang untuk <strong>meminimalkan penggunaan disk</strong> sambil tetap menyimpan semua data di SSD.</p>
<p>Dalam mode ini:</p>
<ul>
<li><p>Data PQ disimpan di disk secara terpisah, tanpa redundansi.</p></li>
<li><p>Hal ini menghilangkan redundansi dan secara drastis mengurangi ukuran indeks.</p></li>
</ul>
<p>Komprominya adalah bahwa mengakses kode PQ suatu node dan tetangganya mungkin memerlukan <strong>beberapa kali pembacaan SSD</strong>, sehingga meningkatkan operasi I/O selama ekspansi kandidat. Jika tidak dioptimalkan, hal ini akan memperlambat pencarian secara signifikan.</p>
<p>Untuk mengendalikan beban tambahan ini, mode AISAQ-Scale memperkenalkan dua optimasi tambahan:</p>
<ul>
<li><p><strong>Penataan ulang data PQ</strong>, yang mengurutkan vektor PQ berdasarkan prioritas akses untuk meningkatkan lokalitas dan mengurangi pembacaan acak.</p></li>
<li><p><strong>Cache PQ di DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), yang menyimpan data PQ yang sering diakses dan menghindari pembacaan disk berulang untuk entri yang sering diakses.</p></li>
</ul>
<p>Dengan optimasi ini, mode AISAQ-Scale mencapai efisiensi penyimpanan yang jauh lebih baik daripada AISAQ-Performance, sambil tetap mempertahankan kinerja pencarian yang praktis. Kinerja tersebut memang tetap lebih rendah daripada DISKANN, tetapi tidak ada beban penyimpanan (ukuran indeks serupa dengan DISKANN) dan jejak memori jauh lebih kecil. Dari perspektif aplikasi, AiSAQ menyediakan sarana untuk memenuhi persyaratan RAG pada skala ultra-tinggi.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Keunggulan Utama AISAQ</h3><p>Dengan memindahkan semua data penting untuk pencarian ke disk dan mendesain ulang cara mengakses data tersebut, AISAQ secara mendasar mengubah profil biaya dan skalabilitas pencarian vektor berbasis grafik. Desainnya memberikan tiga keunggulan signifikan.</p>
<p><strong>1. Penggunaan DRAM Hingga 3.200× Lebih Rendah</strong></p>
<p>Kuantisasi Produk (Product Quantization) secara signifikan mengurangi ukuran vektor berdimensi tinggi, tetapi pada skala miliaran, jejak memori masih cukup besar. Bahkan setelah kompresi, kode PQ harus tetap disimpan di memori selama proses pencarian dalam desain konvensional.</p>
<p>Misalnya, pada <strong>SIFT1B</strong>, sebuah tolok ukur dengan satu miliar vektor berdimensi 128, kode PQ saja membutuhkan sekitar <strong>30–120 GB DRAM</strong>, tergantung pada konfigurasinya. Menyimpan vektor lengkap yang belum terkompresi akan membutuhkan tambahan <strong>~480 GB</strong>. Meskipun PQ mengurangi penggunaan memori sebesar 4–16×, jejak memori yang tersisa masih cukup besar untuk mendominasi biaya infrastruktur.</p>
<p>AISAQ menghilangkan persyaratan ini sepenuhnya. Dengan menyimpan kode PQ di SSD alih-alih DRAM, memori tidak lagi dikonsumsi oleh data indeks yang persisten. DRAM hanya digunakan untuk struktur ringan dan sementara seperti daftar kandidat dan metadata kontrol. Dalam praktiknya, hal ini mengurangi penggunaan memori dari puluhan gigabyte menjadi <strong>sekitar 10 MB</strong>. Dalam konfigurasi representatif berskala miliaran, penggunaan DRAM turun dari <strong>32 GB menjadi 10 MB</strong>, atau <strong>berkurang</strong> sebanyak <strong>3.200 kali lipat</strong>.</p>
<p>Mengingat biaya penyimpanan SSD sekitar <strong>1/30 dari harga per unit kapasitas</strong> dibandingkan dengan DRAM, peralihan ini berdampak langsung dan signifikan terhadap total biaya sistem.</p>
<p><strong>2. Tidak Ada Beban I/O Tambahan</strong></p>
<p>Memindahkan kode PQ dari memori ke disk biasanya akan meningkatkan jumlah operasi I/O selama pencarian. AISAQ menghindari hal ini dengan mengontrol <strong>tata letak data dan pola akses</strong> secara cermat. Alih-alih menyebarkan data terkait ke seluruh disk, AISAQ menempatkan kode PQ, vektor lengkap, dan daftar tetangga di lokasi yang sama sehingga semuanya dapat diambil secara bersamaan. Hal ini memastikan bahwa ekspansi kandidat tidak menimbulkan pembacaan acak tambahan.</p>
<p>Untuk memberikan pengguna kendali atas keseimbangan antara ukuran indeks dan efisiensi I/O, AISAQ memperkenalkan parameter ` <code translate="no">inline_pq</code> `, yang menentukan seberapa banyak data PQ yang disimpan secara inline pada setiap node:</p>
<ul>
<li><p><strong>Nilai inline_pq yang lebih rendah:</strong> ukuran indeks lebih kecil, tetapi mungkin memerlukan I/O tambahan</p></li>
<li><p>Nilai `<strong>inline_pq` yang lebih tinggi:</strong> ukuran indeks lebih besar, tetapi mempertahankan akses satu kali baca</p></li>
</ul>
<p>Saat dikonfigurasi dengan <strong>`inline_pq = max_degree</strong>`, AISAQ membaca vektor lengkap suatu node, daftar tetangga, dan semua kode PQ dalam satu operasi disk, sesuai dengan pola I/O DISKANN sambil tetap menyimpan semua data di SSD.</p>
<p><strong>3. Akses PQ Berurutan Meningkatkan Efisiensi Komputasi</strong></p>
<p>Di DISKANN, memperluas node kandidat memerlukan R akses memori acak untuk mengambil kode PQ dari R tetangganya. AISAQ menghilangkan keacakan ini dengan mengambil semua kode PQ dalam satu I/O dan menyimpannya secara berurutan di disk.</p>
<p>Tata letak berurutan memberikan dua manfaat penting:</p>
<ul>
<li><p><strong>Pembacaan SSD berurutan jauh lebih cepat</strong> daripada pembacaan acak yang tersebar.</p></li>
<li><p><strong>Data yang berurutan lebih ramah cache</strong>, sehingga memungkinkan CPU menghitung jarak PQ dengan lebih efisien.</p></li>
</ul>
<p>Hal ini meningkatkan kecepatan dan prediktabilitas perhitungan jarak PQ serta membantu mengimbangi biaya kinerja akibat penyimpanan kode PQ di SSD daripada di DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs. DISKANN: Evaluasi Kinerja<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah memahami perbedaan arsitektur AISAQ dan DISKANN, pertanyaan selanjutnya cukup jelas: <strong>bagaimana pilihan desain ini memengaruhi kinerja dan penggunaan sumber daya dalam praktiknya?</strong> Evaluasi ini membandingkan AISAQ dan DISKANN dalam tiga dimensi yang paling penting pada skala miliaran: <strong>kinerja pencarian, konsumsi memori, dan penggunaan disk</strong>.</p>
<p>Secara khusus, kami meneliti bagaimana AISAQ berperilaku seiring perubahan jumlah data PQ yang disisipkan (<code translate="no">INLINE_PQ</code>). Parameter ini secara langsung mengontrol keseimbangan antara ukuran indeks, I/O disk, dan efisiensi waktu eksekusi. Kami juga mengevaluasi kedua pendekatan tersebut pada <strong>beban kerja vektor berdimensi rendah dan tinggi, karena dimensi sangat memengaruhi biaya perhitungan jarak dan</strong> kebutuhan penyimpanan.</p>
<h3 id="Setup" class="common-anchor-header">Pengaturan</h3><p>Semua eksperimen dilakukan pada sistem satu node untuk mengisolasi perilaku indeks dan menghindari gangguan dari efek jaringan atau sistem terdistribusi.</p>
<p><strong>Konfigurasi perangkat keras:</strong></p>
<ul>
<li><p>CPU: AMD EPYC 9454P @ 2,70 GHz</p></li>
<li><p>Memori: Kecepatan: 3200 MT/s, Tipe: DDR4, Kapasitas: 384 GB</p></li>
<li><p>Disk: SSD<sup>NVMe™</sup> KIOXIA CM7 7,68 TB</p></li>
</ul>
<p><h6><em>AMD EPYC adalah merek dagang milik Advanced Micro Devices, Inc.</em></h6>
<h6><em>NVMe adalah merek dagang terdaftar atau tidak terdaftar milik NVM Express, Inc. di Amerika Serikat dan negara-negara lain.</em></h6></p>
<p><strong>Parameter Pembuatan Indeks</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parameter Kueri</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Metode Pengujian</h3><p>Baik DISKANN maupun AISAQ diuji menggunakan <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, mesin pencari vektor sumber terbuka yang digunakan di Milvus. Dua set data digunakan dalam evaluasi ini:</p>
<ul>
<li><p><strong>SIFT128D (1 juta vektor):</strong> tolok ukur 128 dimensi yang terkenal dan umum digunakan untuk pencarian deskriptor gambar. <em>(Ukuran kumpulan data mentah ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1 juta vektor):</strong> kumpulan embedding berdimensi 768 yang umum digunakan dalam pencarian semantik berbasis transformer. <em>(Ukuran dataset mentah ≈ 2930 MB)</em></p></li>
</ul>
<p>Kumpulan data ini mencerminkan dua skenario dunia nyata yang berbeda: fitur penglihatan yang ringkas dan embedding semantik yang besar.</p>
<h3 id="Results" class="common-anchor-header">Hasil</h3><p><strong>Sift128D1M (Vektor Lengkap ~488 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>Grafik recall SIFT vs latensi</span>
  
 </span></p>
<p><strong>Cohere768D1M (Vektor Penuh ~2930 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Grafik recall vs latensi Cohere</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">Analisis</h3><p><strong>Kumpulan Data SIFT128D</strong></p>
<p>Pada dataset SIFT128D, AISAQ dapat menyamai kinerja DISKANN ketika semua data PQ disematkan sehingga data yang dibutuhkan setiap node muat sepenuhnya dalam satu halaman SSD berukuran 4 KB (INLINE_PQ = 48). Dalam konfigurasi ini, setiap informasi yang dibutuhkan selama pencarian ditempatkan di lokasi yang sama:</p>
<ul>
<li><p>Vektor penuh: 512B</p></li>
<li><p>Daftar tetangga: 48 × 4 + 4 = 196B</p></li>
<li><p>Kode PQ tetangga: 48 × (512B × 0,125) ≈ 3072B</p></li>
<li><p>Total: 3780B</p></li>
</ul>
<p>Karena seluruh node muat dalam satu halaman, hanya diperlukan satu I/O per akses, dan AISAQ menghindari pembacaan acak data PQ eksternal.</p>
<p>Namun, ketika hanya sebagian data PQ yang disisipkan, kode PQ yang tersisa harus diambil dari tempat lain di disk (parameter inline_pq ditetapkan untuk mengoptimalkan pemanfaatan halaman SSD, misalnya, inline_pq = 20 memungkinkan dua node muat dalam satu halaman 4KB). Hal ini menimbulkan operasi I/O acak tambahan, yang secara tajam meningkatkan permintaan IOPS dan menyebabkan penurunan kinerja.</p>
<p><strong>Kumpulan Data Cohere768D</strong></p>
<p>Pada dataset Cohere768D, kinerja AISAQ sekitar 8% lebih rendah daripada DISKANN. Alasannya adalah vektor berdimensi 768 tidak muat dalam satu halaman SSD berukuran 4 KB:</p>
<ul>
<li><p>Vektor lengkap: 3072B</p></li>
<li><p>Daftar tetangga: 48 × 4 + 4 = 196B</p></li>
<li><p>Kode PQ tetangga: 48 × (3072B × 0,04167) ≈ 6.144B</p></li>
<li><p>Total: 9.412B (≈ 3 halaman)</p></li>
</ul>
<p>Dalam kasus ini, meskipun semua kode PQ disisipkan, setiap node mencakup beberapa halaman. Meskipun jumlah operasi I/O tetap konsisten, setiap I/O harus mentransfer data yang jauh lebih banyak, sehingga menghabiskan bandwidth SSD jauh lebih cepat. Begitu bandwidth menjadi faktor pembatas, AISAQ tidak dapat mengimbangi DISKANN—terutama pada beban kerja berdimensi tinggi di mana jejak data per node tumbuh dengan cepat.</p>
<p><strong>Catatan:</strong></p>
<p>Tata letak penyimpanan AISAQ biasanya meningkatkan ukuran indeks pada disk sebesar <strong>3× hingga 5×</strong>. Ini merupakan kompromi yang disengaja: vektor lengkap, daftar tetangga, dan kode PQ ditempatkan bersama pada disk untuk memungkinkan akses satu halaman yang efisien selama pencarian. Meskipun hal ini meningkatkan penggunaan SSD, kapasitas disk jauh lebih murah daripada DRAM dan lebih mudah diskalakan pada volume data yang besar.</p>
<p>Dalam praktiknya, pengguna dapat menyesuaikan kompromi ini dengan mengatur rasio kompresi <code translate="no">INLINE_PQ</code> dan PQ. Parameter-parameter ini memungkinkan penyeimbangan antara kinerja pencarian, jejak disk, dan biaya sistem secara keseluruhan berdasarkan persyaratan beban kerja, alih-alih dibatasi oleh batas memori yang tetap.</p>
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
    </button></h2><p>Ekonomi perangkat keras modern sedang berubah. Harga DRAM tetap tinggi, sementara kinerja SSD telah berkembang pesat—drive PCIe 5.0 kini menawarkan bandwidth melebihi <strong>14 GB/s</strong>. Akibatnya, arsitektur yang memindahkan data kritis pencarian dari DRAM yang mahal ke penyimpanan SSD yang jauh lebih terjangkau menjadi semakin menarik. Dengan biaya kapasitas SSD <strong>yang kurang dari 30 kali lipat per gigabyte dibandingkan</strong> DRAM, perbedaan ini tidak lagi bersifat marjinal—perbedaan tersebut secara signifikan memengaruhi desain sistem.</p>
<p>AISAQ mencerminkan pergeseran ini. Dengan menghilangkan kebutuhan akan alokasi memori besar yang selalu aktif, AISAQ memungkinkan sistem pencarian vektor untuk berskala berdasarkan ukuran data dan persyaratan beban kerja, bukan berdasarkan batasan DRAM. Pendekatan ini sejalan dengan tren yang lebih luas menuju arsitektur “all-in-storage”, di mana SSD cepat memainkan peran sentral tidak hanya dalam penyimpanan data, tetapi juga dalam komputasi aktif dan pencarian. Dengan menawarkan dua mode operasi—Performance dan Scale—AiSAQ memenuhi persyaratan baik pencarian semantik (yang membutuhkan latensi terendah) maupun RAG (yang membutuhkan skalabilitas sangat tinggi, namun latensi sedang).</p>
<p>Pergeseran ini kemungkinan tidak akan terbatas pada basis data vektor. Pola desain serupa sudah mulai muncul dalam pemrosesan graf, analitik deret waktu, dan bahkan sebagian sistem relasional tradisional, seiring para pengembang meninjau kembali asumsi lama mengenai di mana data harus disimpan untuk mencapai kinerja yang memadai. Seiring dengan terus berkembangnya ekonomi perangkat keras, arsitektur sistem pun akan mengikuti.</p>
<p>Untuk detail lebih lanjut mengenai desain yang dibahas di sini, lihat dokumentasi:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Dokumentasi Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Dokumentasi Milvus</a></p></li>
</ul>
<p>Punya pertanyaan atau ingin mendalami fitur apa pun dari Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau laporkan masalah di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi satu lawan satu selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Memperkenalkan Milvus 2.6: Pencarian Vektor Terjangkau dalam Skala Miliaran</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Memperkenalkan Fungsi Embedding: Bagaimana Milvus 2.6 Mempercepat Vektorisasi dan Pencarian Semantik</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Pemecahan JSON di Milvus: Penyaringan JSON 88,9x Lebih Cepat dengan Fleksibilitas</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Membuka Potensi Pencarian Tingkat Entitas yang Sebenarnya: Kemampuan Array-of-Structs dan MAX_SIM Baru di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH di Milvus: Senjata Rahasia untuk Mengatasi Duplikat dalam Data Pelatihan LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Mendorong Kompresi Vektor ke Tingkat Ekstrem: Bagaimana Milvus Melayani 3× Lebih Banyak Kueri dengan RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Uji Perbandingan Itu Menyesatkan — Basis Data Vektor Layak Diuji Secara Sebenarnya </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Woodpecker untuk Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pencarian Vektor di Dunia Nyata: Cara Menyaring Secara Efisien Tanpa Mengorbankan Recall</a></p></li>
</ul>
