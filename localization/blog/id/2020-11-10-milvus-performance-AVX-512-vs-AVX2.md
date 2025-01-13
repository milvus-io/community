---
id: milvus-performance-AVX-512-vs-AVX2.md
title: Apa yang dimaksud dengan Ekstensi Vektor Lanjutan?
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: >-
  Temukan bagaimana kinerja Milvus pada AVX-512 vs AVX2 menggunakan berbagai
  indeks vektor yang berbeda.
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Performa Milvus pada AVX-512 vs AVX2</custom-h1><p>Mesin cerdas yang sadar dan ingin mengambil alih dunia adalah hal yang biasa dalam fiksi ilmiah, tetapi pada kenyataannya komputer modern sangat patuh. Tanpa diberitahu, mereka jarang tahu apa yang harus dilakukan dengan diri mereka sendiri. Komputer melakukan tugas berdasarkan instruksi, atau perintah, yang dikirim dari program ke prosesor. Pada tingkat paling rendah, setiap instruksi adalah urutan angka satu dan nol yang menggambarkan operasi yang harus dijalankan oleh komputer. Biasanya, dalam bahasa rakitan komputer, setiap pernyataan bahasa mesin berhubungan dengan instruksi prosesor. Unit pemrosesan pusat (CPU) bergantung pada instruksi untuk melakukan perhitungan dan sistem kontrol. Selain itu, kinerja CPU sering kali diukur dalam hal kemampuan eksekusi instruksi (misalnya, waktu eksekusi).</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">Apa yang dimaksud dengan Ekstensi Vektor Lanjutan?<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>Advanced Vector Extensions (AVX) adalah set instruksi untuk mikroprosesor yang mengandalkan arsitektur set instruksi keluarga x86. Pertama kali diusulkan oleh Intel pada bulan Maret 2008, AVX mendapat dukungan luas tiga tahun kemudian dengan peluncuran Sandy Bridge-mikroarsitektur yang digunakan pada prosesor Intel Core generasi kedua (misalnya, Core i7, i5, i3) dan mikroarsitektur pesaing AMD yang juga diluncurkan pada tahun 2011, yaitu Bulldozer.</p>
<p>AVX memperkenalkan skema pengkodean baru, fitur baru, dan instruksi baru. AVX2 memperluas sebagian besar operasi bilangan bulat hingga 256 bit dan memperkenalkan operasi penggabungan banyak-akumulasi (FMA). AVX-512 memperluas operasi AVX hingga 512-bit menggunakan pengkodean awalan ekstensi vektor yang disempurnakan (EVEX).</p>
<p><a href="https://milvus.io/docs">Milvus</a> adalah basis data vektor sumber terbuka yang dirancang untuk pencarian kemiripan dan aplikasi kecerdasan buatan (AI). Platform ini mendukung set instruksi AVX-512, yang berarti dapat digunakan dengan semua CPU yang menyertakan instruksi AVX-512. Milvus memiliki aplikasi yang luas yang mencakup sistem rekomendasi, visi komputer, pemrosesan bahasa alami (NLP), dan banyak lagi. Artikel ini menyajikan hasil kinerja dan analisis database vektor Milvus pada AVX-512 dan AVX2.</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Performa Milvus pada AVX-512 vs AVX2<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">Konfigurasi sistem</h3><ul>
<li>CPU: Intel® Platinum 8163 CPU @ 2.50GHz24 core 48 thread</li>
<li>Jumlah CPU: 2</li>
<li>Kartu grafis, GeForce RTX 2080Ti 11GB 4 kartu</li>
<li>Mem: 768GB</li>
<li>Disk: SSD 2TB</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Parameter milvus</h3><ul>
<li>cahce.cahe_size: 25, Ukuran memori CPU yang digunakan untuk menyimpan data dalam cache untuk kueri yang lebih cepat.</li>
<li>nlist: 4096</li>
<li>nprobe: 128</li>
</ul>
<p>Catatan: <code translate="no">nlist</code> adalah parameter pengindeksan yang dibuat dari klien; <code translate="no">nprobe</code> parameter pencarian. Baik IVF_FLAT maupun IVF_SQ8 menggunakan algoritme pengelompokan untuk mempartisi sejumlah besar vektor ke dalam beberapa ember, <code translate="no">nlist</code> adalah jumlah total ember yang akan dipartisi selama pengelompokan. Langkah pertama dalam kueri adalah menemukan jumlah ember yang paling dekat dengan vektor target, dan langkah kedua adalah menemukan vektor k teratas dalam ember ini dengan membandingkan jarak vektor. <code translate="no">nprobe</code> mengacu pada jumlah ember pada langkah pertama.</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">Dataset Kumpulan data SIFT10M</h3><p>Pengujian ini menggunakan <a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">dataset SIFT10M</a>, yang berisi satu juta vektor 128 dimensi dan sering digunakan untuk menganalisis kinerja metode pencarian tetangga terdekat yang sesuai. Waktu pencarian 1 teratas untuk nq = [1, 10, 100, 500, 1000] akan dibandingkan antara dua set instruksi.</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">Hasil berdasarkan jenis indeks vektor</h3><p><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Indeks vektor</a> adalah struktur data yang hemat ruang dan waktu yang dibangun di atas bidang vektor dari sebuah koleksi dengan menggunakan berbagai model matematika. Pengindeksan vektor memungkinkan kumpulan data yang besar dicari secara efisien ketika mencoba mengidentifikasi vektor yang mirip dengan vektor masukan. Karena sifat pengambilan yang akurat yang memakan waktu, sebagian besar jenis indeks <a href="https://milvus.io/docs/v2.0.x/index.md#CPU">yang didukung oleh Milvus</a> menggunakan pencarian tetangga terdekat (ANN).</p>
<p>Untuk pengujian ini, tiga indeks digunakan dengan AVX-512 dan AVX2: IVF_FLAT, IVF_SQ8, dan HNSW.</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>Inverted file (IVF_FLAT) adalah jenis indeks berdasarkan kuantisasi. Ini adalah indeks IVF yang paling dasar, dan data yang disandikan yang disimpan di setiap unit konsisten dengan data asli. Indeks ini membagi data vektor ke dalam sejumlah unit klaster (nlist), dan kemudian membandingkan jarak antara vektor input target dan pusat setiap klaster. Bergantung pada jumlah klaster yang diatur oleh sistem untuk melakukan kueri (nprobe), hasil pencarian kemiripan dikembalikan berdasarkan perbandingan antara input target dan vektor dalam klaster yang paling mirip saja - secara drastis mengurangi waktu kueri. Dengan menyesuaikan nprobe, keseimbangan ideal antara akurasi dan kecepatan dapat ditemukan untuk skenario tertentu.</p>
<p><strong>Hasil kinerja</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT tidak melakukan kompresi apa pun, sehingga file indeks yang dihasilkannya memiliki ukuran yang kurang lebih sama dengan data vektor mentah yang tidak diindeks. Ketika sumber daya memori disk, CPU, atau GPU terbatas, IVF_SQ8 adalah pilihan yang lebih baik daripada IVF_FLAT. Jenis indeks ini dapat mengonversi setiap dimensi vektor asli dari angka floating-point empat byte menjadi bilangan bulat tidak bertanda tangan satu byte dengan melakukan kuantisasi skalar. Hal ini mengurangi konsumsi memori disk, CPU, dan GPU sebesar 70-75%.</p>
<p><strong>Hasil kinerja</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>Hierarchical Small World Graph (HNSW) adalah algoritma pengindeksan berbasis grafik. Kueri dimulai dari lapisan paling atas dengan menemukan simpul yang paling dekat dengan target, kemudian turun ke lapisan berikutnya untuk putaran pencarian berikutnya. Setelah beberapa kali iterasi, algoritme ini dapat dengan cepat mendekati posisi target.</p>
<p><strong>Hasil kinerja</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">Membandingkan indeks vektor<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengambilan vektor secara konsisten lebih cepat pada set instruksi AVX-512 daripada AVX2. Hal ini karena AVX-512 mendukung komputasi 512-bit, dibandingkan dengan komputasi 256-bit pada AVX2. Secara teoritis, AVX-512 seharusnya dua kali lebih cepat daripada AVX2, namun Milvus melakukan tugas-tugas lain yang memakan waktu selain perhitungan kesamaan vektor. Waktu pengambilan keseluruhan AVX-512 tidak mungkin dua kali lebih singkat daripada AVX2 dalam skenario dunia nyata. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>Pengambilan secara signifikan lebih cepat pada indeks HNSW daripada dua indeks lainnya, sementara pengambilan IVF_SQ8 sedikit lebih cepat daripada IVF_FLAT pada kedua set instruksi. Hal ini kemungkinan besar karena IVF_SQ8 hanya membutuhkan 25% dari kebutuhan memori yang dibutuhkan oleh IVF_FLAT. IVF_SQ8 memuat 1 byte untuk setiap dimensi vektor, sedangkan IVF_FLAT memuat 4 byte per dimensi vektor. Waktu yang dibutuhkan untuk perhitungan kemungkinan besar dibatasi oleh bandwidth memori. Hasilnya, IVF_SQ8 tidak hanya membutuhkan lebih sedikit ruang, tetapi juga membutuhkan lebih sedikit waktu untuk mengambil vektor.</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus adalah basis data vektor serbaguna dan berkinerja tinggi<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengujian yang disajikan dalam artikel ini menunjukkan bahwa Milvus menawarkan kinerja yang sangat baik pada set instruksi AVX-512 dan AVX2 dengan menggunakan indeks yang berbeda. Terlepas dari jenis indeksnya, Milvus memiliki performa yang lebih baik pada AVX-512.</p>
<p>Milvus kompatibel dengan berbagai platform deep learning dan digunakan dalam berbagai aplikasi AI. <a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0</a>, versi desain ulang dari database vektor paling populer di dunia, dirilis di bawah lisensi sumber terbuka pada Juli 2021. Untuk informasi lebih lanjut tentang proyek ini, lihat sumber-sumber berikut:</p>
<ul>
<li>Temukan atau berkontribusi ke Milvus di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Terhubung dengan kami di <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
