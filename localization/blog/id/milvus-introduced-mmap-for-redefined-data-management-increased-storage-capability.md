---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: >-
  Milvus Memperkenalkan MMap untuk Manajemen Data yang Ditentukan Ulang dan
  Peningkatan Kemampuan Penyimpanan
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  Fitur Milvus MMap memberdayakan pengguna untuk menangani lebih banyak data
  dalam memori yang terbatas, memberikan keseimbangan yang baik antara performa,
  biaya, dan batasan sistem.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> adalah solusi tercepat dalam <a href="https://zilliz.com/blog/what-is-a-real-vector-database">database vektor</a> sumber terbuka, yang melayani pengguna dengan kebutuhan kinerja yang intensif. Namun, keragaman kebutuhan pengguna mencerminkan data yang mereka kerjakan. Beberapa memprioritaskan solusi yang ramah anggaran dan penyimpanan yang luas daripada kecepatan. Memahami spektrum permintaan ini, Milvus memperkenalkan fitur MMap, mendefinisikan ulang cara kami menangani volume data yang besar sambil menjanjikan efisiensi biaya tanpa mengorbankan fungsionalitas.</p>
<h2 id="What-is-MMap" class="common-anchor-header">Apa itu MMap?<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap, kependekan dari memory-mapped files, menjembatani kesenjangan antara file dan memori di dalam sistem operasi. Teknologi ini memungkinkan Milvus untuk memetakan file besar secara langsung ke dalam ruang memori sistem, mengubah file menjadi blok memori yang bersebelahan. Integrasi ini menghilangkan kebutuhan untuk operasi baca atau tulis eksplisit, yang secara fundamental mengubah cara Milvus mengelola data. Hal ini memastikan akses yang lancar dan penyimpanan yang efisien untuk file-file besar atau situasi di mana pengguna perlu mengakses file secara acak.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">Siapa yang diuntungkan dari MMap?<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor membutuhkan kapasitas memori yang besar karena kebutuhan penyimpanan data vektor. Dengan fitur MMap, memproses lebih banyak data dalam memori yang terbatas menjadi kenyataan. Namun, peningkatan kemampuan ini datang dengan biaya kinerja. Sistem ini secara cerdas mengelola memori, mengeluarkan beberapa data berdasarkan beban dan penggunaan. Penggusuran ini memungkinkan Milvus memproses lebih banyak data dalam kapasitas memori yang sama.</p>
<p>Selama pengujian kami, kami mengamati bahwa dengan memori yang cukup, semua data tetap berada di memori setelah periode pemanasan, sehingga menjaga kinerja sistem. Namun demikian, seiring dengan bertambahnya volume data, performa secara bertahap menurun. <strong>Oleh karena itu, kami merekomendasikan fitur MMap untuk pengguna yang tidak terlalu sensitif terhadap fluktuasi kinerja.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">Mengaktifkan MMap di Milvus: konfigurasi sederhana<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengaktifkan MMap di Milvus sangatlah mudah. Yang perlu Anda lakukan adalah memodifikasi file <code translate="no">milvus.yaml</code>: tambahkan item <code translate="no">mmapDirPath</code> di bawah konfigurasi <code translate="no">queryNode</code> dan tetapkan jalur yang valid sebagai nilainya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">Mencapai keseimbangan: kinerja, penyimpanan, dan batas sistem<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>Pola akses data secara signifikan mempengaruhi kinerja. Fitur MMap dari Milvus mengoptimalkan akses data berdasarkan lokasi. MMap memungkinkan Milvus untuk menulis data skalar secara langsung ke disk untuk segmen data yang diakses secara berurutan. Data dengan panjang variabel seperti string mengalami perataan dan diindeks menggunakan larik offset dalam memori. Pendekatan ini memastikan lokalitas akses data dan menghilangkan overhead untuk menyimpan setiap data panjang variabel secara terpisah. Pengoptimalan untuk indeks vektor sangat teliti. MMap digunakan secara selektif untuk data vektor sambil mempertahankan daftar kedekatan dalam memori, menghemat memori yang signifikan tanpa mengorbankan kinerja.</p>
<p>Selain itu, MMap memaksimalkan pemrosesan data dengan meminimalkan penggunaan memori. Tidak seperti versi Milvus sebelumnya di mana QueryNode menyalin seluruh kumpulan data, MMap mengadopsi proses streaming yang efisien dan bebas penyalinan selama pengembangan. Pengoptimalan ini secara drastis mengurangi overhead memori.</p>
<p><strong>Hasil pengujian internal kami menunjukkan bahwa Milvus dapat secara efisien menangani dua kali lipat volume data ketika mengaktifkan MMap.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">Masa depan: inovasi berkelanjutan dan peningkatan yang berpusat pada pengguna<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Meskipun fitur MMap masih dalam tahap beta, tim Milvus berkomitmen untuk terus melakukan perbaikan. Pembaruan di masa mendatang akan menyempurnakan penggunaan memori sistem, memungkinkan Milvus untuk mendukung volume data yang lebih besar pada satu node. Pengguna dapat mengantisipasi kontrol yang lebih terperinci atas fitur MMap, memungkinkan perubahan dinamis pada koleksi dan mode pemuatan bidang lanjutan. Peningkatan ini memberikan fleksibilitas yang belum pernah ada sebelumnya, memungkinkan pengguna untuk menyesuaikan strategi pemrosesan data mereka dengan kebutuhan spesifik.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">Kesimpulan: mendefinisikan ulang keunggulan pemrosesan data dengan Milvus MMap<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Fitur MMap Milvus 2.3 menandai lompatan yang signifikan dalam teknologi pemrosesan data. Dengan mencapai keseimbangan antara kinerja, biaya, dan batasan sistem, Milvus memberdayakan pengguna untuk menangani data dalam jumlah yang sangat besar secara efisien dan hemat biaya. Seiring dengan perkembangannya, Milvus tetap menjadi yang terdepan dalam solusi inovatif, mendefinisikan ulang batas-batas yang dapat dicapai dalam manajemen data.</p>
<p>Nantikan perkembangan yang lebih inovatif saat Milvus melanjutkan perjalanannya menuju keunggulan pemrosesan data yang tak tertandingi.</p>
