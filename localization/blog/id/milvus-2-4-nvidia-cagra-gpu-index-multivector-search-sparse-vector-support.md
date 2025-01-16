---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: >-
  Mengungkap Milvus 2.4: Pencarian Multi-vektor, Vektor Jarang, Indeks CAGRA,
  dan Banyak Lagi!
author: Fendy Feng
date: 2024-3-20
desc: >-
  Kami dengan senang hati mengumumkan peluncuran Milvus 2.4, sebuah kemajuan
  besar dalam meningkatkan kemampuan pencarian untuk dataset berskala besar.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>Kami dengan bangga mengumumkan peluncuran Milvus 2.4, sebuah kemajuan besar dalam meningkatkan kemampuan pencarian untuk kumpulan data berskala besar. Rilis terbaru ini menambahkan fitur-fitur baru, seperti dukungan untuk indeks CAGRA berbasis GPU, dukungan beta untuk penyematan <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">yang jarang</a>, pencarian grup, dan berbagai peningkatan lainnya dalam kemampuan pencarian. Perkembangan ini memperkuat komitmen kami kepada komunitas dengan menawarkan kepada para pengembang seperti Anda, sebuah alat yang ampuh dan efisien untuk menangani dan melakukan kueri data vektor. Mari kita bahas manfaat utama Milvus 2.4.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">Pencarian Multi-vektor yang Diaktifkan untuk Pencarian Multimodal yang Disederhanakan<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 menyediakan kemampuan pencarian multivektor, yang memungkinkan pencarian dan pengurutan ulang berbagai jenis vektor secara simultan dalam sistem Milvus yang sama. Fitur ini menyederhanakan pencarian multimodal, secara signifikan meningkatkan tingkat penarikan dan memungkinkan pengembang untuk dengan mudah mengelola aplikasi AI yang rumit dengan berbagai tipe data. Selain itu, fungsi ini menyederhanakan integrasi dan penyempurnaan model pemeringkatan ulang khusus, membantu dalam pembuatan fungsi pencarian lanjutan seperti <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistem pemberi rekomendasi</a> yang tepat yang memanfaatkan wawasan dari data multidimensi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>Cara Kerja Fitur Pencarian Milti-Vektor</span> </span></p>
<p>Dukungan multivektor di Milvus memiliki dua komponen:</p>
<ol>
<li><p>Kemampuan untuk menyimpan/menghasilkan beberapa vektor untuk satu entitas dalam satu koleksi, yang merupakan cara yang lebih alami untuk mengatur data</p></li>
<li><p>Kemampuan untuk membangun/mengoptimalkan algoritma perangkingan ulang dengan memanfaatkan algoritma perangkingan ulang yang sudah ada di Milvus</p></li>
</ol>
<p>Selain menjadi <a href="https://github.com/milvus-io/milvus/issues/25639">fitur yang banyak diminta</a>, kami membangun kemampuan ini karena industri ini bergerak menuju model multimodal dengan dirilisnya GPT-4 dan Claude 3. Perangkingan ulang adalah teknik yang umum digunakan untuk lebih meningkatkan kinerja kueri dalam penelusuran. Kami bertujuan untuk memudahkan para pengembang dalam membangun dan mengoptimalkan reranker mereka dalam ekosistem Milvus.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">Dukungan Pengelompokan Pencarian untuk Meningkatkan Efisiensi Komputasi<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Grouping Search adalah <a href="https://github.com/milvus-io/milvus/issues/25343">fitur</a> lain yang sering <a href="https://github.com/milvus-io/milvus/issues/25343">diminta</a> yang kami tambahkan ke Milvus 2.4. Fitur ini mengintegrasikan operasi per kelompok yang dirancang untuk field bertipe BOOL, INT, atau VARCHAR, yang mengisi kesenjangan efisiensi yang krusial dalam mengeksekusi kueri pengelompokan berskala besar.</p>
<p>Secara tradisional, pengembang mengandalkan pencarian Top-K yang ekstensif diikuti dengan pasca-pemrosesan manual untuk menyaring hasil spesifik grup, metode yang intensif komputasi dan kode-berat. Grouping Search menyempurnakan proses ini dengan secara efisien menghubungkan hasil kueri ke pengidentifikasi kelompok agregat seperti nama dokumen atau video, merampingkan penanganan entitas tersegmentasi dalam kumpulan data yang lebih besar.</p>
<p>Milvus membedakan Grouping Search-nya dengan implementasi berbasis iterator, menawarkan peningkatan yang nyata dalam efisiensi komputasi dibandingkan teknologi serupa. Pilihan ini memastikan skalabilitas kinerja yang unggul, terutama di lingkungan produksi yang mengutamakan optimalisasi sumber daya komputasi. Dengan mengurangi penelusuran data dan overhead komputasi, Milvus mendukung pemrosesan kueri yang lebih efisien, secara signifikan mengurangi waktu respons dan biaya operasional dibandingkan dengan basis data vektor lainnya.</p>
<p>Grouping Search meningkatkan kemampuan Milvus untuk mengelola kueri bervolume tinggi dan kompleks serta selaras dengan praktik komputasi berkinerja tinggi untuk solusi manajemen data yang kuat.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">Dukungan Beta untuk Penyematan Vektor Jarang<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Penyematan vektor<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">jarang</a> mewakili pergeseran paradigma dari pendekatan vektor padat tradisional, yang memenuhi nuansa kemiripan semantik daripada sekadar frekuensi kata kunci. Perbedaan ini memungkinkan kemampuan pencarian yang lebih bernuansa, selaras dengan konten semantik dari kueri dan dokumen. Model vektor yang jarang, terutama berguna dalam pencarian informasi dan pemrosesan bahasa alami, menawarkan kemampuan pencarian di luar domain yang kuat dan kemampuan penafsiran dibandingkan dengan model vektor yang padat.</p>
<p>Di Milvus 2.4, kami telah memperluas Pencarian Hibrida untuk menyertakan sematan jarang yang dihasilkan oleh model saraf tingkat lanjut seperti SPLADEv2 atau model statistik seperti BM25. Dalam Milvus, vektor jarang diperlakukan setara dengan vektor padat, memungkinkan pembuatan koleksi dengan bidang vektor yang jarang, penyisipan data, pembuatan indeks, dan melakukan pencarian kemiripan. Khususnya, penyisipan jarang di Milvus mendukung metrik jarak <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">Inner Product</a> (IP), yang menguntungkan karena sifatnya yang berdimensi tinggi, sehingga membuat metrik lain menjadi kurang efektif. Fungsionalitas ini juga mendukung tipe data dengan dimensi sebagai bilangan bulat 32-bit yang tidak ditandatangani dan float 32-bit untuk nilainya, sehingga memfasilitasi spektrum aplikasi yang luas, mulai dari pencarian teks yang bernuansa hingga sistem <a href="https://zilliz.com/learn/information-retrieval-metrics">pencarian informasi</a> yang rumit.</p>
<p>Dengan fitur baru ini, Milvus memungkinkan metodologi pencarian hibrida yang memadukan teknik berbasis kata kunci dan penyematan, menawarkan transisi yang mulus bagi pengguna yang beralih dari kerangka kerja pencarian yang berpusat pada kata kunci untuk mencari solusi yang komprehensif dan rendah biaya.</p>
<p>Kami memberi label fitur ini sebagai "Beta" untuk melanjutkan pengujian kinerja fitur ini dan mengumpulkan umpan balik dari komunitas. Ketersediaan umum (GA) dari dukungan vektor jarang diantisipasi dengan rilis Milvus 3.0.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">Dukungan Indeks CAGRA untuk Pengindeksan Grafis yang Dipercepat GPU Tingkat Lanjut<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Dikembangkan oleh NVIDIA, <a href="https://arxiv.org/abs/2308.15136">CAGRA</a> (Cuda Anns GRAph-based) adalah teknologi pengindeksan grafik berbasis GPU yang secara signifikan melampaui metode tradisional berbasis CPU seperti indeks HNSW dalam hal efisiensi dan performa, terutama di lingkungan dengan throughput tinggi.</p>
<p>Dengan diperkenalkannya Indeks CAGRA, Milvus 2.4 menyediakan kemampuan pengindeksan grafik yang dipercepat dengan GPU. Peningkatan ini sangat ideal untuk membangun aplikasi pencarian kemiripan yang membutuhkan latensi minimal. Selain itu, Milvus 2.4 mengintegrasikan pencarian brute-force dengan indeks CAGRA untuk mencapai tingkat penarikan maksimum dalam aplikasi. Untuk wawasan yang lebih detail, jelajahi <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">blog pengenalan CAGRA</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Rakit CAGRA vs Milvus HNSW</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">Peningkatan dan Fitur Tambahan<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 juga menyertakan peningkatan utama lainnya, seperti dukungan Regular Expression untuk pencocokan substring yang disempurnakan dalam pemfilteran <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">metadata</a>, indeks terbalik skalar baru untuk pemfilteran tipe data skalar yang efisien, dan alat Change Data Capture untuk memonitor dan mereplikasi perubahan pada koleksi Milvus. Pembaruan ini secara kolektif meningkatkan kinerja dan keserbagunaan Milvus, menjadikannya solusi yang komprehensif untuk operasi data yang kompleks.</p>
<p>Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md">dokumentasi Milvus 2.4.</a></p>
<h2 id="Stay-Connected" class="common-anchor-header">Tetap Terhubung!<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Bersemangat untuk mempelajari lebih lanjut tentang Milvus 2.4? <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">Bergabunglah dengan webinar kami yang akan datang</a> bersama James Luan, VP of Engineering Zilliz, untuk diskusi mendalam tentang kemampuan rilis terbaru ini. Jika Anda memiliki pertanyaan atau umpan balik, bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami untuk berinteraksi dengan para insinyur dan anggota komunitas kami. Jangan lupa untuk mengikuti kami di <a href="https://twitter.com/milvusio">Twitter</a> atau <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> untuk mendapatkan berita dan informasi terbaru tentang Milvus.</p>
