---
id: diskann-explained.md
title: Penjelasan DiskANN
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  Pelajari bagaimana DiskANN menghadirkan pencarian vektor berskala miliaran
  menggunakan SSD, menyeimbangkan penggunaan memori yang rendah, akurasi tinggi,
  dan kinerja yang dapat diskalakan.
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">Apa itu DiskANN?<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a> mewakili pendekatan yang mengubah paradigma untuk <a href="https://zilliz.com/learn/vector-similarity-search">pencarian kemiripan vektor</a>. Sebelumnya, sebagian besar jenis indeks vektor seperti HNSW sangat bergantung pada RAM untuk mencapai latensi rendah dan recall yang tinggi. Meskipun efektif untuk dataset berukuran sedang, pendekatan ini menjadi sangat mahal dan kurang terukur seiring bertambahnya volume data. DiskANN menawarkan alternatif yang hemat biaya dengan memanfaatkan SSD untuk menyimpan indeks, sehingga secara signifikan mengurangi kebutuhan memori.</p>
<p>DiskANN menggunakan struktur grafik datar yang dioptimalkan untuk akses disk, sehingga dapat menangani kumpulan data berskala miliaran dengan sebagian kecil dari jejak memori yang dibutuhkan oleh metode dalam memori. Sebagai contoh, DiskANN dapat mengindeks hingga satu miliar vektor sambil mencapai akurasi pencarian 95% dengan latensi 5ms, sedangkan algoritme berbasis RAM mencapai puncaknya pada 100-200 juta titik untuk kinerja yang sama.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 1: Pengindeksan vektor dan alur kerja pencarian dengan DiskANN</em></p>
<p>Meskipun DiskANN mungkin memperkenalkan latensi yang sedikit lebih tinggi dibandingkan dengan pendekatan berbasis RAM, pertukaran ini sering kali dapat diterima mengingat penghematan biaya yang substansial dan manfaat skalabilitas. DiskANN sangat cocok untuk aplikasi yang membutuhkan pencarian vektor berskala besar pada perangkat keras komoditas.</p>
<p>Artikel ini akan menjelaskan metode cerdas yang dimiliki DiskANN untuk memanfaatkan SSD selain RAM dan mengurangi pembacaan SSD yang mahal.</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">Bagaimana Cara Kerja DiskANN?<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN adalah metode pencarian vektor berbasis grafik yang berada dalam kelompok metode yang sama dengan HNSW. Pertama-tama, kami membuat graf pencarian di mana simpul-simpulnya berhubungan dengan vektor (atau kelompok vektor), dan sisi-sisinya menunjukkan bahwa sepasang vektor "relatif dekat" dalam arti tertentu. Sebuah pencarian secara acak memilih "simpul entri", dan menavigasi ke tetangganya yang paling dekat dengan kueri, mengulangi dengan cara yang serakah sampai minimum lokal tercapai.</p>
<p>Kerangka kerja pengindeksan berbasis grafik berbeda terutama dalam cara mereka membangun grafik pencarian dan melakukan pencarian. Dan pada bagian ini, kita akan mendalami secara teknis inovasi DiskANN untuk langkah-langkah ini dan bagaimana mereka memungkinkan latensi rendah, kinerja memori rendah. (Lihat gambar di atas untuk ringkasannya).</p>
<h3 id="An-Overview" class="common-anchor-header">Gambaran Umum</h3><p>Kami mengasumsikan bahwa pengguna telah membuat sekumpulan penyematan vektor dokumen. Langkah pertama adalah mengelompokkan penyematan. Grafik pencarian untuk setiap klaster dibuat secara terpisah menggunakan algoritma Vamana (dijelaskan pada bagian selanjutnya), dan hasilnya digabungkan menjadi satu grafik. <em>Strategi bagi-dan-taklukkan untuk membuat grafik pencarian akhir secara signifikan mengurangi penggunaan memori tanpa terlalu memengaruhi latensi atau pemanggilan pencarian.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 2: Cara DiskANN menyimpan indeks vektor di seluruh RAM dan SSD</em></p>
<p>Setelah menghasilkan grafik pencarian global, grafik ini disimpan di SSD bersama dengan embedding vektor dengan presisi penuh. Tantangan utamanya adalah menyelesaikan pencarian dalam jumlah pembacaan SSD yang terbatas, karena akses SSD lebih mahal daripada akses RAM. Jadi, beberapa trik cerdas digunakan untuk membatasi jumlah pembacaan:</p>
<p>Pertama, algoritme Vamana memberikan insentif untuk jalur yang lebih pendek di antara simpul yang berdekatan sambil membatasi jumlah maksimum tetangga dari sebuah simpul. Kedua, sebuah struktur data dengan ukuran tetap digunakan untuk menyimpan embedding setiap node dan tetangganya (lihat gambar di atas). Artinya, kita dapat mengakses metadata node hanya dengan mengalikan ukuran struktur data dengan indeks node dan menggunakannya sebagai offset sekaligus mengambil embedding node. Ketiga, karena cara kerja SSD, kami dapat mengambil beberapa node per permintaan baca - dalam kasus kami, node tetangga - sehingga mengurangi jumlah permintaan baca lebih lanjut.</p>
<p>Secara terpisah, kami memampatkan penyematan menggunakan kuantisasi produk dan menyimpannya dalam RAM. Dengan demikian, kami dapat memasukkan set data vektor berskala miliaran ke dalam memori yang dapat digunakan pada satu mesin untuk menghitung <em>perkiraan kemiripan vektor</em> dengan cepat tanpa pembacaan disk. Hal ini memberikan panduan untuk mengurangi jumlah node tetangga yang akan diakses berikutnya pada SSD. Namun, yang terpenting, keputusan pencarian dibuat dengan menggunakan <em>kemiripan vektor yang tepat</em>, dengan penyematan penuh yang diambil dari SSD, yang memastikan daya ingat yang lebih tinggi. Untuk menekankan, ada tahap awal pencarian menggunakan embedding terkuantisasi dalam memori, dan pencarian berikutnya pada pembacaan subset yang lebih kecil dari SSD.</p>
<p>Dalam uraian ini, kami telah mengabaikan dua langkah penting yang melibatkan banyak langkah: cara membuat grafik, dan cara mencari grafik - dua langkah yang ditunjukkan oleh kotak merah di atas. Mari kita bahas masing-masing secara bergantian.</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">Konstruksi Grafik "Vamana"</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Konstruksi Graf "Vamana"</em></p>
<p>Penulis DiskANN mengembangkan sebuah metode baru untuk membangun graf pencarian, yang mereka sebut sebagai algoritme Vamana. Algoritma ini menginisialisasi graf pencarian dengan menambahkan sisi secara acak sebanyak O(N). Ini akan menghasilkan graf yang "terhubung dengan baik", meskipun tanpa jaminan konvergensi pencarian yang serakah. Kemudian memangkas dan menghubungkan kembali sisi-sisi dengan cara yang cerdas untuk memastikan ada koneksi jarak jauh yang cukup (lihat gambar di atas). Izinkan kami menjelaskan lebih lanjut:</p>
<h4 id="Initialization" class="common-anchor-header">Inisialisasi</h4><p>Graf pencarian diinisialisasi ke sebuah graf berarah acak di mana setiap simpul memiliki R tetangga. Kami juga menghitung medoid dari graf tersebut, yaitu titik yang memiliki jarak rata-rata minimum ke semua titik lainnya. Anda dapat menganggap ini sebagai analogi dari centroid yang merupakan anggota dari himpunan node.</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">Mencari Kandidat</h4><p>Setelah inisialisasi, kita melakukan iterasi pada node, melakukan penambahan dan penghapusan edge pada setiap langkah. Pertama, kita menjalankan algoritma pencarian pada node yang dipilih, p, untuk menghasilkan daftar kandidat. Algoritma pencarian dimulai dari medoid dan dengan rakus menavigasi lebih dekat dan lebih dekat ke node yang dipilih, menambahkan tetangga-tetangga dari node terdekat yang ditemukan sejauh ini pada setiap langkah. Daftar L node yang ditemukan yang paling dekat dengan p dikembalikan. (Jika Anda tidak terbiasa dengan konsep ini, medroid dari sebuah graf adalah titik yang memiliki jarak rata-rata minimum ke semua titik lainnya dan bertindak sebagai analog dari sebuah pusat graf).</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">Pemangkasan dan Penambahan Sisi</h4><p>Kandidat tetangga simpul diurutkan berdasarkan jarak, dan untuk setiap kandidat, algoritme memeriksa apakah kandidat tersebut "terlalu dekat" dengan tetangga yang sudah dipilih. Jika ya, maka akan dipangkas. Hal ini mendorong keragaman sudut di antara tetangga, yang secara empiris mengarah pada sifat navigasi yang lebih baik. Dalam praktiknya, ini berarti bahwa pencarian yang dimulai dari node acak dapat lebih cepat mencapai node target dengan menjelajahi sekumpulan tautan jarak jauh dan lokal yang jarang.</p>
<p>Setelah pemangkasan tepi, tepi-tepi di sepanjang jalur pencarian serakah ke p ditambahkan. Dua lintasan pemangkasan dilakukan, memvariasikan ambang batas jarak untuk pemangkasan sehingga sisi-sisi jarak jauh ditambahkan pada lintasan kedua.</p>
<h2 id="What’s-Next" class="common-anchor-header">Apa Selanjutnya?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Pekerjaan selanjutnya telah dibangun di atas DiskANN untuk perbaikan tambahan. Salah satu contoh yang patut dicatat, yang dikenal sebagai <a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>, memodifikasi metode ini untuk memungkinkan pembaruan indeks yang mudah setelah konstruksi. Indeks pencarian ini, yang menyediakan pertukaran yang sangat baik antara kriteria kinerja, tersedia di basis data vektor <a href="https://milvus.io/docs/overview.md">Milvus</a> sebagai jenis indeks <code translate="no">DISKANN</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Anda bahkan dapat menyetel parameter DiskANN, seperti <code translate="no">MaxDegree</code> dan <code translate="no">BeamWidthRatio</code>: lihat <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">halaman dokumentasi</a> untuk lebih jelasnya <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">.</a> </p>
<h2 id="Resources" class="common-anchor-header">Sumber daya<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Dokumentasi Milvus tentang penggunaan DiskANN</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN: Pencarian Tetangga Terdekat dengan Titik Miliar yang Akurat dan Cepat pada Satu Simpul"</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN: Indeks ANN Berbasis Graf yang Cepat dan Akurat untuk Pencarian Kemiripan Streaming"</a></p></li>
</ul>
