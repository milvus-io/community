---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: >-
  Memahami Indeks Vektor IVF: Bagaimana Cara Kerjanya dan Kapan Memilihnya
  Dibanding HNSW
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_cover_157df122bc.png
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: >-
  Pelajari cara kerja indeks vektor IVF, bagaimana indeks ini mempercepat
  pencarian ANN, dan kapan indeks ini mengungguli HNSW dalam hal kecepatan,
  memori, dan efisiensi penyaringan.
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>Dalam basis data vektor, kita sering kali perlu dengan cepat menemukan hasil yang paling mirip di antara koleksi vektor dimensi tinggi yang sangat banyak-seperti fitur gambar, penyematan teks, atau representasi audio. Tanpa indeks, satu-satunya pilihan adalah membandingkan vektor kueri dengan setiap vektor dalam kumpulan data. <strong>Pencarian brute-force</strong> ini mungkin berhasil jika Anda memiliki beberapa ribu vektor, tetapi begitu Anda berurusan dengan puluhan atau ratusan juta vektor, <strong>pencarian</strong> ini menjadi sangat lambat dan mahal secara komputasi.</p>
<p>Di situlah pencarian <strong>Approximate Nearest Neighbor (ANN)</strong> berperan. Bayangkan seperti mencari buku tertentu di perpustakaan yang sangat besar. Alih-alih memeriksa setiap buku satu per satu, Anda mulai dengan menelusuri bagian yang paling mungkin berisi buku tersebut. Anda mungkin tidak akan mendapatkan hasil yang sama <em>persis</em> dengan pencarian penuh, tetapi Anda akan mendapatkan hasil yang sangat dekat - dan dalam waktu yang lebih singkat. Singkatnya, ANN menukar sedikit penurunan akurasi dengan peningkatan signifikan dalam kecepatan dan skalabilitas.</p>
<p>Di antara banyak cara untuk mengimplementasikan pencarian ANN, <strong>IVF (Inverted File)</strong> dan <strong>HNSW (Hierarchical Navigable Small World)</strong> adalah dua cara yang paling banyak digunakan. Tetapi IVF menonjol karena efisiensi dan kemampuan beradaptasi dalam pencarian vektor berskala besar. Dalam artikel ini, kami akan memandu Anda tentang cara kerja IVF dan perbandingannya dengan HNSW-sehingga Anda dapat memahami trade-off keduanya dan memilih salah satu yang paling sesuai dengan beban kerja Anda.</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">Apa yang dimaksud dengan Indeks Vektor IVF?<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>IVF (Inverted File)</strong> adalah salah satu algoritme yang paling banyak digunakan untuk JST. Algoritma ini meminjam ide intinya dari "indeks terbalik" yang digunakan dalam sistem pencarian teks-hanya saja kali ini, alih-alih kata dan dokumen, kita berurusan dengan vektor dalam ruang berdimensi tinggi.</p>
<p>Bayangkan saja seperti mengatur sebuah perpustakaan yang sangat besar. Jika Anda membuang semua buku (vektor) ke dalam satu tumpukan besar, maka akan sangat sulit untuk menemukan apa yang Anda butuhkan. IVF memecahkan masalah ini dengan <strong>mengelompokkan</strong> semua vektor ke dalam beberapa kelompok, atau <em>ember</em>. Setiap ember mewakili "kategori" vektor yang serupa, yang ditentukan oleh <strong>centroid-semacam</strong>ringkasan atau "label" untuk semua yang ada di dalam kelompok tersebut.</p>
<p>Ketika sebuah kueri masuk, pencarian dilakukan dalam dua langkah:</p>
<p><strong>1. Temukan klaster terdekat.</strong> Sistem akan mencari beberapa kelompok yang centroidnya paling dekat dengan vektor kueri-seperti langsung menuju ke dua atau tiga bagian perpustakaan yang paling mungkin memiliki buku Anda.</p>
<p><strong>2. Cari di dalam kelompok tersebut.</strong> Setelah berada di bagian yang tepat, Anda hanya perlu melihat sekumpulan kecil buku, bukan seluruh perpustakaan.</p>
<p>Pendekatan ini mengurangi jumlah komputasi dalam jumlah besar. Anda masih mendapatkan hasil yang sangat akurat-tetapi jauh lebih cepat.</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">Cara Membangun Indeks Vektor IVF<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Proses membangun indeks vektor IVF melibatkan tiga langkah utama: Pengelompokan K-means, Penugasan Vektor, dan Pengkodean Kompresi (Opsional). Proses lengkapnya terlihat seperti ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">Langkah 1: Pengelompokan K-means</h3><p>Pertama, jalankan pengelompokan k-means pada dataset X untuk membagi ruang vektor berdimensi tinggi ke dalam n buah cluster. Setiap klaster diwakili oleh sebuah centroid, yang disimpan dalam tabel centroid C. Jumlah centroid, nlist, adalah sebuah hiperparameter kunci yang menentukan seberapa halus pengelompokannya.</p>
<p>Berikut adalah cara kerja k-means di balik layar:</p>
<ul>
<li><p><strong>Inisialisasi:</strong> Pilih vektor <em>nlist</em> secara acak sebagai centroid awal.</p></li>
<li><p><strong>Penugasan:</strong> Untuk setiap vektor, hitung jaraknya ke semua centroid dan tetapkan ke centroid terdekat.</p></li>
<li><p><strong>Pembaruan:</strong> Untuk setiap klaster, hitung rata-rata dari vektor-vektornya dan tetapkan sebagai centroid yang baru.</p></li>
<li><p><strong>Iterasi dan konvergensi:</strong> Ulangi penugasan dan pembaruan hingga centroid tidak lagi berubah secara signifikan atau jumlah maksimum iterasi tercapai.</p></li>
</ul>
<p>Setelah k-means konvergen, centroid nlist yang dihasilkan akan membentuk "direktori indeks" IVF. Mereka mendefinisikan bagaimana kumpulan data dipartisi secara kasar, yang memungkinkan kueri mempersempit ruang pencarian dengan cepat di kemudian hari.</p>
<p>Pikirkan kembali analogi perpustakaan: melatih centroid sama seperti memutuskan bagaimana mengelompokkan buku berdasarkan topik:</p>
<ul>
<li><p>Nlist yang lebih besar berarti lebih banyak bagian, masing-masing dengan buku yang lebih sedikit dan lebih spesifik.</p></li>
<li><p>Daftar yang lebih kecil berarti lebih sedikit bagian, masing-masing mencakup topik yang lebih luas dan lebih beragam.</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">Langkah 2: Penugasan Vektor</h3><p>Selanjutnya, setiap vektor ditugaskan ke klaster yang centroidnya paling dekat dengannya, membentuk daftar terbalik (List_i). Setiap daftar terbalik menyimpan ID dan informasi penyimpanan semua vektor yang termasuk dalam klaster tersebut.</p>
<p>Anda dapat membayangkan langkah ini seperti menata buku-buku ke dalam bagiannya masing-masing. Ketika Anda mencari sebuah judul nanti, Anda hanya perlu memeriksa beberapa bagian yang kemungkinan besar memilikinya, alih-alih menjelajahi seluruh perpustakaan.</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">Langkah 3: Pengkodean Kompresi (Opsional)</h3><p>Untuk menghemat memori dan mempercepat komputasi, vektor di dalam setiap kluster dapat melalui pengodean kompresi. Ada dua pendekatan umum:</p>
<ul>
<li><p><strong>SQ8 (Kuantisasi Skalar):</strong> Metode ini mengkuantisasi setiap dimensi vektor menjadi 8 bit. Untuk vektor standar <code translate="no">float32</code>, setiap dimensi biasanya membutuhkan 4 byte. Dengan SQ8, ukurannya dikurangi menjadi hanya 1 byte-mencapai rasio kompresi 4:1 sambil menjaga geometri vektor tetap utuh.</p></li>
<li><p><strong>PQ (Kuantisasi Produk):</strong> PQ membagi vektor dimensi tinggi menjadi beberapa subruang. Sebagai contoh, vektor 128 dimensi dapat dibagi menjadi 8 sub-vektor yang masing-masing terdiri dari 16 dimensi. Di setiap subruang, sebuah codebook kecil (biasanya dengan 256 entri) telah dilatih sebelumnya, dan setiap sub-vektor diwakili oleh indeks 8-bit yang menunjuk ke entri codebook terdekat. Ini berarti vektor 128-D <code translate="no">float32</code> asli (yang membutuhkan 512 byte) dapat diwakili hanya dengan menggunakan 8 byte (8 subruang × 1 byte masing-masing), mencapai rasio kompresi 64:1.</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">Cara Menggunakan Indeks Vektor IVF untuk Pencarian<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah tabel centroid, daftar terbalik, dan penyandi kompresi serta buku kode (opsional) dibuat, indeks IVF dapat digunakan untuk mempercepat pencarian kemiripan. Proses ini biasanya memiliki tiga langkah utama, seperti yang ditunjukkan di bawah ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">Langkah 1: Hitung jarak dari vektor kueri ke semua centroid</h3><p>Ketika vektor kueri q tiba, sistem pertama-tama menentukan cluster mana yang paling mungkin menjadi miliknya. Kemudian, sistem menghitung jarak antara q dan setiap centroid dalam tabel centroid C-biasanya menggunakan jarak Euclidean atau inner product sebagai metrik kemiripan. Centroid kemudian diurutkan berdasarkan jaraknya ke vektor kueri, menghasilkan daftar yang diurutkan dari yang terdekat ke yang terjauh.</p>
<p>Sebagai contoh, seperti yang ditunjukkan dalam ilustrasi, urutannya adalah: C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5.</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">Langkah 2: Pilih gugus nprobe terdekat</h3><p>Untuk menghindari pemindaian seluruh dataset, IVF hanya mencari di dalam kluster <em>nprobe</em> teratas yang paling dekat dengan vektor kueri.</p>
<p>Parameter nprobe mendefinisikan cakupan pencarian dan secara langsung memengaruhi keseimbangan antara kecepatan dan penarikan:</p>
<ul>
<li><p>Nprobe yang lebih kecil menghasilkan kueri yang lebih cepat tetapi dapat mengurangi daya ingat.</p></li>
<li><p>Nprobe yang lebih besar meningkatkan daya ingat tetapi meningkatkan latensi.</p></li>
</ul>
<p>Dalam sistem dunia nyata, nprobe dapat disetel secara dinamis berdasarkan anggaran latensi atau persyaratan akurasi. Dalam contoh di atas, jika nprobe = 2, sistem hanya akan mencari di dalam Klaster 2 dan Klaster 4-dua klaster terdekat.</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">Langkah 3: Cari tetangga terdekat di dalam klaster yang dipilih</h3><p>Setelah kandidat klaster dipilih, sistem membandingkan vektor kueri q dengan vektor-vektor yang tersimpan di dalamnya. Ada dua mode utama perbandingan:</p>
<ul>
<li><p><strong>Perbandingan Persis (IVF_FLAT</strong>): Sistem mengambil vektor asli dari klaster yang dipilih dan menghitung jaraknya ke q secara langsung, mengembalikan hasil yang paling akurat.</p></li>
<li><p><strong>Perbandingan Perkiraan (IVF_PQ / IVF_SQ8)</strong>: Ketika kompresi PQ atau SQ8 digunakan, sistem menggunakan <strong>metode tabel pencarian</strong> untuk mempercepat perhitungan jarak. Sebelum pencarian dimulai, sistem akan menghitung jarak antara vektor kueri dan setiap entri buku kode. Kemudian, untuk setiap vektor, sistem dapat dengan mudah "mencari dan menjumlahkan" jarak yang telah dihitung sebelumnya untuk memperkirakan kemiripan.</p></li>
</ul>
<p>Akhirnya, hasil kandidat dari semua cluster yang dicari digabungkan dan diberi peringkat ulang, menghasilkan Top-k vektor yang paling mirip sebagai hasil akhir.</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">Praktik IVF Dalam Praktik<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah Anda memahami bagaimana indeks vektor IVF <strong>dibangun</strong> dan <strong>dicari</strong>, langkah selanjutnya adalah menerapkannya untuk beban kerja di dunia nyata. Dalam praktiknya, Anda sering kali harus menyeimbangkan <strong>kinerja</strong>, <strong>akurasi</strong>, dan <strong>penggunaan memori</strong>. Di bawah ini adalah beberapa panduan praktis yang diambil dari pengalaman teknik.</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">Cara Memilih nlist yang Tepat</h3><p>Seperti yang telah disebutkan sebelumnya, parameter nlist menentukan jumlah kluster yang menjadi tempat dataset dibagi ketika membangun indeks IVF.</p>
<ul>
<li><p><strong>Daftar n yang lebih besar</strong>: Menciptakan klaster yang lebih halus, yang berarti setiap klaster berisi lebih sedikit vektor. Hal ini mengurangi jumlah vektor yang dipindai selama pencarian dan umumnya menghasilkan kueri yang lebih cepat. Tetapi membangun indeks membutuhkan waktu lebih lama, dan tabel pusat mengkonsumsi lebih banyak memori.</p></li>
<li><p><strong>Nlist yang lebih kecil</strong>: Mempercepat pembangunan indeks dan mengurangi penggunaan memori, tetapi setiap klaster menjadi lebih "padat". Setiap kueri harus memindai lebih banyak vektor dalam klaster, yang dapat menyebabkan kemacetan kinerja.</p></li>
</ul>
<p>Berdasarkan trade-off ini, berikut adalah aturan praktisnya:</p>
<p>Untuk kumpulan data dalam <strong>skala jutaan</strong>, titik awal yang baik adalah <strong>nlist ≈ √n</strong> (n adalah jumlah vektor dalam pecahan data yang sedang diindeks).</p>
<p>Sebagai contoh, jika Anda memiliki 1 juta vektor, cobalah nlist = 1.000. Untuk kumpulan data yang lebih besar-puluhan atau ratusan juta-kebanyakan basis data vektor memecah data sehingga setiap pecahan berisi sekitar satu juta vektor, sehingga aturan ini tetap praktis.</p>
<p>Karena nlist ditetapkan pada saat pembuatan indeks, mengubahnya nanti berarti membangun ulang seluruh indeks. Jadi, yang terbaik adalah bereksperimen lebih awal. Uji beberapa nilai - idealnya dengan pangkat dua (misalnya, 1024, 2048) - untuk menemukan titik manis yang menyeimbangkan kecepatan, akurasi, dan memori untuk beban kerja Anda.</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">Cara Menyetel nprobe</h3><p>Parameter nprobe mengontrol jumlah cluster yang dicari selama waktu kueri. Hal ini secara langsung memengaruhi pertukaran antara pemanggilan dan latensi.</p>
<ul>
<li><p><strong>nprobe yang lebih besar</strong>: Mencakup lebih banyak klaster, yang mengarah ke penarikan yang lebih tinggi tetapi juga latensi yang lebih tinggi. Penundaan umumnya meningkat secara linear dengan jumlah cluster yang dicari.</p></li>
<li><p><strong>Nprobe yang lebih kecil</strong>: Mencari lebih sedikit cluster, menghasilkan latensi yang lebih rendah dan kueri yang lebih cepat. Namun, ini mungkin melewatkan beberapa tetangga terdekat yang sebenarnya, sehingga sedikit menurunkan daya ingat dan akurasi hasil.</p></li>
</ul>
<p>Jika aplikasi Anda tidak terlalu sensitif terhadap latensi, ada baiknya bereksperimen dengan nprobe secara dinamis-misalnya, menguji nilai dari 1 hingga 16 untuk mengamati bagaimana recall dan latensi berubah. Tujuannya adalah untuk menemukan titik manis di mana recall dapat diterima dan latensi tetap berada dalam kisaran target Anda.</p>
<p>Karena nprobe adalah parameter pencarian runtime, parameter ini dapat disesuaikan dengan cepat tanpa perlu membangun ulang indeks. Hal ini memungkinkan penyetelan yang cepat, murah, dan sangat fleksibel di berbagai beban kerja atau skenario kueri.</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">Varian Umum dari Indeks IVF</h3><p>Saat membangun indeks IVF, Anda harus memutuskan apakah akan menggunakan pengkodean kompresi untuk vektor di setiap klaster-dan jika ya, metode mana yang akan digunakan.</p>
<p>Hal ini menghasilkan tiga varian indeks IVF yang umum:</p>
<table>
<thead>
<tr><th><strong>Varian IVF</strong></th><th><strong>Fitur Utama</strong></th><th><strong>Kasus Penggunaan</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>IVF_FLAT</strong></td><td>Menyimpan vektor mentah di dalam setiap klaster tanpa kompresi. Menawarkan akurasi tertinggi, tetapi juga mengkonsumsi memori paling banyak.</td><td>Ideal untuk dataset skala menengah (hingga ratusan juta vektor) yang membutuhkan recall tinggi (95%+).</td></tr>
<tr><td><strong>IVF_PQ</strong></td><td>Menerapkan Kuantisasi Produk (PQ) untuk mengompresi vektor dalam cluster. Dengan menyesuaikan rasio kompresi, penggunaan memori dapat dikurangi secara signifikan.</td><td>Cocok untuk pencarian vektor berskala besar (ratusan juta atau lebih) di mana beberapa kehilangan akurasi dapat diterima. Dengan rasio kompresi 64:1, recall biasanya sekitar 70%, tetapi dapat mencapai 90% atau lebih tinggi dengan menurunkan rasio kompresi.</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>Menggunakan Kuantisasi Skalar (SQ8) untuk mengkuantisasi vektor. Penggunaan memori berada di antara IVF_FLAT dan IVF_PQ.</td><td>Ideal untuk pencarian vektor berskala besar di mana Anda perlu mempertahankan daya ingat yang relatif tinggi (90%+) sambil meningkatkan efisiensi.</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF vs HNSW: Pilih yang Cocok<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain IVF, <strong>HNSW (Hierarchical Navigable Small World)</strong> adalah indeks vektor dalam memori yang banyak digunakan. Tabel di bawah ini menyoroti perbedaan utama di antara keduanya.</p>
<table>
<thead>
<tr><th></th><th><strong>IVF</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Konsep Algoritma</strong></td><td>Pengelompokan dan penyatuan</td><td>Navigasi grafik berlapis-lapis</td></tr>
<tr><td><strong>Penggunaan Memori</strong></td><td>Relatif rendah</td><td>Relatif tinggi</td></tr>
<tr><td><strong>Kecepatan Pembuatan Indeks</strong></td><td>Cepat (hanya membutuhkan pengelompokan)</td><td>Lambat (membutuhkan konstruksi grafik multi-lapisan)</td></tr>
<tr><td><strong>Kecepatan Kueri (Tanpa Pemfilteran)</strong></td><td>Cepat, tergantung pada <em>nprobe</em></td><td>Sangat cepat, tetapi dengan kompleksitas logaritmik</td></tr>
<tr><td><strong>Kecepatan Kueri (Dengan Pemfilteran)</strong></td><td>Stabil - melakukan pemfilteran kasar pada tingkat centroid untuk mempersempit kandidat</td><td>Tidak stabil - terutama ketika rasio pemfilteran tinggi (90%+), grafik menjadi terfragmentasi dan dapat menurun hingga mendekati penelusuran grafik penuh, bahkan lebih lambat dari pencarian brute-force</td></tr>
<tr><td><strong>Tingkat Penarikan Kembali</strong></td><td>Tergantung pada apakah kompresi digunakan; tanpa kuantisasi, recall dapat mencapai <strong>95%+</strong></td><td>Biasanya lebih tinggi, sekitar <strong>98%+</strong></td></tr>
<tr><td><strong>Parameter Kunci</strong></td><td><em>nlist</em>, <em>nprobe</em></td><td><em>m</em>, <em>ef_konstruksi</em>, <em>ef_pencarian</em></td></tr>
<tr><td><strong>Kasus Penggunaan</strong></td><td>Ketika memori terbatas, tetapi kinerja kueri dan pemanggilan yang tinggi diperlukan; cocok untuk pencarian dengan kondisi pemfilteran</td><td>Ketika memori mencukupi dan tujuannya adalah kinerja pemanggilan dan kueri yang sangat tinggi, tetapi pemfilteran tidak diperlukan, atau rasio pemfilteran rendah</td></tr>
</tbody>
</table>
<p>Dalam aplikasi dunia nyata, sangat umum untuk menyertakan kondisi pemfilteran-misalnya, "hanya cari vektor dari pengguna tertentu" atau "batasi hasil pada rentang waktu tertentu." Karena perbedaan dalam algoritme yang mendasarinya, IVF umumnya menangani pencarian yang difilter dengan lebih efisien daripada HNSW.</p>
<p>Kekuatan IVF terletak pada proses penyaringan dua tingkat. Pertama-tama, IVF dapat melakukan penyaringan kasar pada tingkat centroid (cluster) untuk mempersempit kumpulan kandidat dengan cepat, dan kemudian melakukan perhitungan jarak yang lebih halus di dalam cluster yang dipilih. Hal ini mempertahankan kinerja yang stabil dan dapat diprediksi, bahkan ketika sebagian besar data disaring.</p>
<p>Sebaliknya, HNSW didasarkan pada penjelajahan grafik. Karena strukturnya, HNSW tidak dapat secara langsung memanfaatkan kondisi pemfilteran selama penjelajahan. Ketika rasio pemfilteran rendah, hal ini tidak menyebabkan masalah besar. Namun, ketika rasio penyaringan tinggi (misalnya, lebih dari 90% data disaring), graf yang tersisa sering kali menjadi terfragmentasi, membentuk banyak "simpul yang terisolasi." Dalam kasus seperti itu, pencarian dapat menurun menjadi penjelajahan graf yang hampir penuh-kadang-kadang bahkan lebih buruk daripada pencarian brute-force.</p>
<p>Dalam praktiknya, indeks IVF sudah mendukung banyak kasus penggunaan berdampak tinggi di berbagai domain:</p>
<ul>
<li><p><strong>Pencarian e-commerce:</strong> Pengguna dapat mengunggah gambar produk dan langsung menemukan item yang mirip secara visual dari jutaan daftar.</p></li>
<li><p><strong>Pencarian paten:</strong> Dengan deskripsi singkat, sistem dapat menemukan paten yang paling terkait secara semantik dari basis data yang sangat besar - jauh lebih efisien daripada pencarian kata kunci tradisional.</p></li>
<li><p><strong>Basis pengetahuan RAG:</strong> IVF membantu mengambil konteks yang paling relevan dari jutaan dokumen penyewa, memastikan model AI menghasilkan respons yang lebih akurat dan membumi.</p></li>
</ul>
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
    </button></h2><p>Untuk memilih indeks yang tepat, semuanya tergantung pada kasus penggunaan spesifik Anda. Jika Anda bekerja dengan kumpulan data berskala besar atau perlu mendukung pencarian yang difilter, IVF dapat menjadi pilihan yang lebih cocok. Dibandingkan dengan indeks berbasis grafik seperti HNSW, IVF memberikan pembuatan indeks yang lebih cepat, penggunaan memori yang lebih rendah, dan keseimbangan yang kuat antara kecepatan dan akurasi.</p>
<p><a href="https://milvus.io/">Milvus</a>, basis data vektor sumber terbuka yang paling populer, menyediakan dukungan penuh untuk seluruh keluarga IVF, termasuk IVF_FLAT, IVF_PQ, dan IVF_SQ8. Anda dapat dengan mudah bereksperimen dengan jenis-jenis indeks ini dan menemukan pengaturan yang paling sesuai dengan kinerja dan kebutuhan memori Anda. Untuk daftar lengkap indeks yang didukung Milvus, lihat <a href="https://milvus.io/docs/index-explained.md">halaman dokumen Indeks Milvus</a> ini.</p>
<p>Jika Anda sedang membangun pencarian gambar, sistem rekomendasi, atau basis pengetahuan RAG, cobalah pengindeksan IVF di Milvus dan lihat bagaimana efisiensi pencarian vektor berskala besar saat bekerja.</p>
