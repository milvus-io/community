---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: >-
  Memperkenalkan Alat Pengukur Ukuran Milvus: Menghitung dan Mengoptimalkan
  Sumber Daya Penerapan Milvus Anda
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  Maksimalkan kinerja Milvus Anda dengan Alat Penentuan Ukuran kami yang mudah
  digunakan! Pelajari cara mengonfigurasi penerapan Anda untuk penggunaan sumber
  daya yang optimal dan penghematan biaya.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Memilih konfigurasi yang optimal untuk penerapan Milvus Anda sangat penting untuk optimalisasi kinerja, pemanfaatan sumber daya yang efisien, dan manajemen biaya. Baik Anda sedang membangun prototipe atau merencanakan penerapan produksi, menentukan ukuran instance Milvus dengan tepat dapat membuat perbedaan antara database vektor yang berjalan dengan lancar dan database yang bermasalah dengan kinerja atau menimbulkan biaya yang tidak perlu.</p>
<p>Untuk menyederhanakan proses ini, kami telah mengubah <a href="https://milvus.io/tools/sizing">Milvus Sizing Tool</a>, kalkulator yang mudah digunakan yang menghasilkan estimasi sumber daya yang direkomendasikan berdasarkan kebutuhan spesifik Anda. Dalam panduan ini, kami akan memandu Anda dalam menggunakan alat ini dan memberikan wawasan yang lebih dalam tentang faktor-faktor yang memengaruhi kinerja Milvus.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">Cara Menggunakan Alat Pengukur Ukuran Milvus<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>Sangat mudah untuk menggunakan alat ukur ini. Cukup ikuti langkah-langkah berikut.</p>
<ol>
<li><p>Kunjungi halaman<a href="https://milvus.io/tools/sizing/"> Milvus Sizing Tool</a>.</p></li>
<li><p>Masukkan parameter utama Anda:</p>
<ul>
<li><p>Jumlah vektor dan dimensi per vektor</p></li>
<li><p>Jenis indeks</p></li>
<li><p>Ukuran data bidang skalar</p></li>
<li><p>Ukuran segmen</p></li>
<li><p>Mode penerapan pilihan Anda</p></li>
</ul></li>
<li><p>Meninjau rekomendasi sumber daya yang dihasilkan</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>alat ukuran milvus</span> </span></p>
<p>Mari jelajahi bagaimana setiap parameter ini memengaruhi penerapan Milvus Anda.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">Pemilihan Indeks: Menyeimbangkan Penyimpanan, Biaya, Akurasi, dan Kecepatan<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus menawarkan berbagai algoritme indeks, termasuk <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>, FLAT, IVF_FLAT, IVF_SQ8, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a>, dan banyak lagi, masing-masing dengan trade-off yang berbeda dalam hal penggunaan memori, kebutuhan ruang disk, kecepatan kueri, dan akurasi pencarian.</p>
<p>Inilah yang perlu Anda ketahui tentang opsi-opsi yang paling umum:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>indeks</span> </span></p>
<p>HNSW (Hierarchical Navigable Small World)</p>
<ul>
<li><p><strong>Arsitektur</strong>: Menggabungkan daftar lewati dengan grafik Navigable Small Worlds (NSW) dalam struktur hirarkis</p></li>
<li><p><strong>Performa</strong>: Kueri yang sangat cepat dengan tingkat pemanggilan yang sangat baik</p></li>
<li><p><strong>Penggunaan Sumber Daya</strong>: Membutuhkan memori paling banyak per vektor (biaya tertinggi)</p></li>
<li><p><strong>Paling cocok untuk</strong>: Aplikasi di mana kecepatan dan akurasi sangat penting dan kendala memori tidak terlalu menjadi perhatian</p></li>
<li><p><strong>Catatan Teknis</strong>: Pencarian dimulai dari lapisan paling atas dengan node paling sedikit dan bergerak ke bawah melalui lapisan yang semakin padat</p></li>
</ul>
<p>RATA</p>
<ul>
<li><p><strong>Arsitektur</strong>: Pencarian lengkap yang sederhana tanpa perkiraan</p></li>
<li><p><strong>Performa</strong>: 100% recall tetapi waktu kueri yang sangat lambat (<code translate="no">O(n)</code> untuk ukuran data <code translate="no">n</code>)</p></li>
<li><p><strong>Penggunaan Sumber Daya</strong>: Ukuran indeks sama dengan ukuran data vektor mentah</p></li>
<li><p><strong>Paling cocok untuk</strong>: Kumpulan data kecil atau aplikasi yang membutuhkan pemanggilan yang sempurna</p></li>
<li><p><strong>Catatan Teknis</strong>: Melakukan penghitungan jarak lengkap antara vektor kueri dan setiap vektor dalam database</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>Arsitektur</strong>: Membagi ruang vektor menjadi beberapa kelompok untuk pencarian yang lebih efisien</p></li>
<li><p><strong>Performa</strong>: Recall sedang-tinggi dengan kecepatan kueri sedang (lebih lambat dari HNSW tetapi lebih cepat dari FLAT)</p></li>
<li><p><strong>Penggunaan Sumber Daya</strong>: Membutuhkan lebih sedikit memori daripada FLAT tetapi lebih banyak daripada HNSW</p></li>
<li><p><strong>Paling cocok untuk</strong>: Aplikasi yang seimbang di mana beberapa pemanggilan dapat ditukar dengan kinerja yang lebih baik</p></li>
<li><p><strong>Catatan Teknis</strong>: Selama pencarian, hanya cluster <code translate="no">nlist</code> yang diperiksa, sehingga mengurangi komputasi secara signifikan</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>Arsitektur</strong>: Menerapkan kuantisasi skalar ke IVF_FLAT, mengompresi data vektor</p></li>
<li><p><strong>Performa</strong>: Pemanggilan sedang dengan kecepatan kueri sedang-tinggi</p></li>
<li><p><strong>Penggunaan Sumber Daya</strong>: Mengurangi konsumsi disk, komputasi, dan memori sebesar 70-75% dibandingkan dengan IVF_FLAT</p></li>
<li><p><strong>Paling cocok untuk</strong>: Lingkungan dengan sumber daya terbatas di mana akurasi dapat sedikit terganggu</p></li>
<li><p><strong>Catatan Teknis</strong>: Mengompresi nilai floating-point 32-bit menjadi nilai integer 8-bit</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">Opsi Indeks Lanjutan: ScaNN, DiskANN, CAGRA, dan lainnya</h3><p>Untuk pengembang dengan persyaratan khusus, Milvus juga menawarkan:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: 20% lebih cepat di CPU daripada HNSW dengan tingkat pemanggilan yang sama</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: Indeks disk/memori hibrida yang ideal ketika Anda perlu mendukung sejumlah besar vektor dengan pemanggilan yang tinggi dan dapat menerima latensi yang sedikit lebih lama (~100ms). Indeks ini menyeimbangkan penggunaan memori dengan performa dengan hanya menyimpan sebagian indeks di memori sementara sisanya tetap berada di disk.</p></li>
<li><p><strong>Indeks berbasis GPU</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: Ini adalah indeks GPU tercepat, tetapi membutuhkan kartu inferensi dengan memori GDDR, bukan dengan memori HBM</p></li>
<li><p>GPU_BRUTE_FORCE: Pencarian menyeluruh yang diimplementasikan pada GPU</p></li>
<li><p>GPU_IVF_FLAT: Versi IVF_FLAT yang dipercepat oleh GPU</p></li>
<li><p>GPU_IVF_PQ: Versi IVF yang dipercepat dengan GPU dengan <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">Kuantisasi Produk</a></p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: Kueri berkecepatan sangat tinggi, sumber daya memori terbatas; menerima kompromi kecil dalam tingkat pemanggilan.</p></li>
<li><p><strong>HNSW_PQ</strong>: Kueri kecepatan sedang; Sumber daya memori yang sangat terbatas; Menerima kompromi kecil dalam tingkat pemanggilan kembali</p></li>
<li><p><strong>HNSW_PRQ</strong>: Kueri kecepatan sedang; Sumber daya memori yang sangat terbatas; Menerima kompromi kecil dalam kecepatan pemanggilan</p></li>
<li><p><strong>AUTOINDEX</strong>: Default ke HNSW di Milvus sumber terbuka (atau menggunakan indeks kepemilikan berkinerja lebih tinggi di <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, Milvus yang dikelola).</p></li>
</ul></li>
<li><p><strong>Biner, Jarang, dan indeks khusus lainnya</strong>: Untuk tipe data dan kasus penggunaan tertentu. Lihat <a href="https://milvus.io/docs/index.md">halaman dokumen indeks ini</a> untuk lebih jelasnya.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">Ukuran Segmen dan Konfigurasi Penerapan<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Segmen adalah blok bangunan fundamental dari organisasi data internal Milvus. Segmen berfungsi sebagai potongan data yang memungkinkan pencarian terdistribusi dan penyeimbangan beban di seluruh penerapan Anda. Alat ukuran Milvus ini menawarkan tiga opsi ukuran segmen (512 MB, 1024 MB, 2048 MB), dengan 1024 MB sebagai default.</p>
<p>Memahami segmen sangat penting untuk pengoptimalan kinerja. Sebagai pedoman umum:</p>
<ul>
<li><p>Segmen 512 MB: Terbaik untuk node kueri dengan memori 4-8 GB</p></li>
<li><p>Segmen 1 GB: Optimal untuk node kueri dengan memori 8-16 GB</p></li>
<li><p>Segmen 2 GB: Direkomendasikan untuk node kueri dengan memori &gt;16 GB</p></li>
</ul>
<p>Wawasan Pengembang: Segmen yang lebih sedikit dan lebih besar biasanya memberikan kinerja pencarian yang lebih cepat. Untuk penerapan skala besar, segmen 2 GB sering kali memberikan keseimbangan terbaik antara efisiensi memori dan kecepatan kueri.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">Pemilihan Sistem Antrian Pesan<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Saat memilih antara Pulsar dan Kafka sebagai sistem pesan Anda:</p>
<ul>
<li><p><strong>Pulsar</strong>: Direkomendasikan untuk proyek-proyek baru karena biaya overhead yang lebih rendah per topik dan skalabilitas yang lebih baik</p></li>
<li><p><strong>Kafka</strong>: Mungkin lebih disukai jika Anda sudah memiliki keahlian atau infrastruktur Kafka di organisasi Anda</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Pengoptimalan Perusahaan di Zilliz Cloud<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk penerapan produksi dengan persyaratan kinerja yang ketat, Zilliz Cloud (versi Milvus yang dikelola sepenuhnya dan versi perusahaan di cloud) menawarkan pengoptimalan tambahan dalam pengindeksan dan kuantisasi:</p>
<ul>
<li><p><strong>Pencegahan Kehabisan Memori (OOM):</strong> Manajemen memori yang canggih untuk mencegah kehabisan memori</p></li>
<li><p><strong>Pengoptimalan Pemadatan</strong>: Meningkatkan kinerja pencarian dan pemanfaatan sumber daya</p></li>
<li><p><strong>Penyimpanan Berjenjang</strong>: Mengelola data panas dan dingin secara efisien dengan unit komputasi yang sesuai</p>
<ul>
<li><p>Unit komputasi standar (CU) untuk data yang sering diakses</p></li>
<li><p>CU penyimpanan berjenjang untuk penyimpanan data yang jarang diakses yang hemat biaya</p></li>
</ul></li>
</ul>
<p>Untuk opsi ukuran perusahaan yang terperinci, kunjungi<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> dokumentasi paket layanan Zilliz Cloud</a>.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">Kiat Konfigurasi Tingkat Lanjut untuk Pengembang<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><strong>Beberapa Jenis Indeks</strong>: Alat ukuran berfokus pada indeks tunggal. Untuk aplikasi kompleks yang membutuhkan algoritme indeks yang berbeda untuk berbagai koleksi, buat koleksi terpisah dengan konfigurasi khusus.</p></li>
<li><p><strong>Alokasi Memori</strong>: Saat merencanakan penerapan, perhitungkan kebutuhan memori data vektor dan memori indeks. HNSW biasanya membutuhkan memori 2-3x lipat dari data vektor mentah.</p></li>
<li><p><strong>Pengujian Kinerja</strong>: Sebelum menyelesaikan konfigurasi Anda, bandingkan pola kueri spesifik Anda pada kumpulan data yang representatif.</p></li>
<li><p><strong>Pertimbangan Skala</strong>: Pertimbangkan pertumbuhan di masa depan. Lebih mudah memulai dengan sumber daya yang sedikit lebih besar daripada mengonfigurasi ulang nanti.</p></li>
</ol>
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
    </button></h2><p><a href="https://milvus.io/tools/sizing/"> Milvus Sizing Tool</a> menyediakan titik awal yang sangat baik untuk perencanaan sumber daya, tetapi ingatlah bahwa setiap aplikasi memiliki persyaratan yang unik. Untuk performa optimal, Anda perlu menyempurnakan konfigurasi Anda berdasarkan karakteristik beban kerja, pola kueri, dan kebutuhan penskalaan Anda.</p>
<p>Kami terus meningkatkan alat bantu dan dokumentasi kami berdasarkan umpan balik dari pengguna. Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut tentang ukuran penerapan Milvus Anda, hubungi komunitas kami di<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> atau<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a>.</p>
<h2 id="References" class="common-anchor-header">Referensi<button data-href="#References" class="anchor-icon" translate="no">
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
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">📝 Memilih Indeks Vektor yang Tepat Untuk Proyek Anda</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">Indeks dalam memori | Dokumentasi Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Mengungkap Milvus CAGRA: Meningkatkan Pencarian Vektor dengan Pengindeksan GPU</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Kalkulator Harga Cloud Zilliz</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Cara Memulai dengan Milvus </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Perencanaan Sumber Daya Cloud Zilliz | Cloud | Pusat Pengembang Cloud Zilliz</a></p></li>
</ul>
