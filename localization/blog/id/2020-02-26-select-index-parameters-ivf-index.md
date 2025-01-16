---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: Praktik terbaik untuk indeks IVF
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>Cara Memilih Parameter Indeks untuk Indeks IVF</custom-h1><p>Dalam <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Praktik Terbaik untuk Konfigurasi Milvus</a>, beberapa praktik terbaik untuk konfigurasi Milvus 0.6.0 telah diperkenalkan. Dalam artikel ini, kami juga akan memperkenalkan beberapa praktik terbaik untuk mengatur parameter kunci dalam klien Milvus untuk operasi termasuk membuat tabel, membuat indeks, dan pencarian. Parameter-parameter ini dapat mempengaruhi kinerja pencarian.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika membuat tabel, parameter index_file_size digunakan untuk menentukan ukuran, dalam MB, dari satu file untuk penyimpanan data. Nilai standarnya adalah 1024. Ketika data vektor diimpor, Milvus secara bertahap menggabungkan data ke dalam file. Ketika ukuran file mencapai index_file_size, file ini tidak menerima data baru dan Milvus menyimpan data baru ke file lain. Ini semua adalah file data mentah. Ketika sebuah indeks dibuat, Milvus membuat sebuah berkas indeks untuk setiap berkas data mentah. Untuk jenis indeks IVFLAT, ukuran file indeks kurang lebih sama dengan ukuran file data mentah yang bersangkutan. Untuk indeks SQ8, ukuran file indeks kira-kira 30 persen dari file data mentah yang sesuai.</p>
<p>Selama pencarian, Milvus mencari setiap file indeks satu per satu. Berdasarkan pengalaman kami, ketika index_file_size berubah dari 1024 menjadi 2048, kinerja pencarian meningkat 30 persen hingga 50 persen. Namun, jika nilainya terlalu besar, file yang besar mungkin gagal dimuat ke memori GPU (atau bahkan memori CPU). Sebagai contoh, jika memori GPU adalah 2 GB dan index_file_size adalah 3 GB, file indeks tidak dapat dimuat ke memori GPU. Biasanya, kami mengatur index_file_size ke 1024 MB atau 2048 MB.</p>
<p>Tabel berikut ini menunjukkan pengujian menggunakan sift50m untuk index_file_size. Tipe indeks adalah SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-hasil-pengujian-sift50m-milvus.png</span> </span></p>
<p>Kita dapat melihat bahwa pada mode CPU dan mode GPU, ketika index_file_size adalah 2048 MB dan bukan 1024 MB, kinerja pencarian meningkat secara signifikan.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>dan</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Parameter <code translate="no">nlist</code> digunakan untuk pembuatan indeks dan parameter <code translate="no">nprobe</code> digunakan untuk pencarian. IVFLAT dan SQ8 menggunakan algoritma pengelompokan untuk membagi sejumlah besar vektor ke dalam kelompok, atau ember. <code translate="no">nlist</code> adalah jumlah ember selama pengelompokan.</p>
<p>Saat mencari menggunakan indeks, langkah pertama adalah menemukan sejumlah ember yang paling dekat dengan vektor target dan langkah kedua adalah menemukan k vektor yang paling mirip dari ember-ember tersebut berdasarkan jarak vektor. <code translate="no">nprobe</code> adalah jumlah ember pada langkah pertama.</p>
<p>Secara umum, meningkatkan <code translate="no">nlist</code> akan menghasilkan lebih banyak bucket dan lebih sedikit vektor dalam satu bucket selama pengelompokan. Hasilnya, beban komputasi berkurang dan kinerja pencarian meningkat. Namun, dengan lebih sedikit vektor untuk perbandingan kemiripan, hasil yang benar mungkin terlewatkan.</p>
<p>Meningkatkan <code translate="no">nprobe</code> akan menghasilkan lebih banyak ember untuk dicari. Akibatnya, beban komputasi meningkat dan kinerja pencarian memburuk, tetapi presisi pencarian meningkat. Situasi ini mungkin berbeda untuk setiap set data dengan distribusi yang berbeda. Anda juga harus mempertimbangkan ukuran set data saat menetapkan <code translate="no">nlist</code> dan <code translate="no">nprobe</code>. Umumnya, disarankan agar <code translate="no">nlist</code> dapat menjadi <code translate="no">4 * sqrt(n)</code>, di mana n adalah jumlah total vektor. Sedangkan untuk <code translate="no">nprobe</code>, Anda harus melakukan trade-off antara presisi dan efisiensi dan cara terbaik adalah dengan menentukan nilai melalui uji coba.</p>
<p>Tabel berikut ini menunjukkan pengujian menggunakan sift50m untuk <code translate="no">nlist</code> dan <code translate="no">nprobe</code>. Jenis indeksnya adalah SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>Tabel ini membandingkan kinerja pencarian dan presisi menggunakan nilai yang berbeda dari <code translate="no">nlist</code>/<code translate="no">nprobe</code>. Hanya hasil GPU yang ditampilkan karena tes CPU dan GPU memiliki hasil yang serupa. Pada pengujian ini, ketika nilai <code translate="no">nlist</code>/<code translate="no">nprobe</code> meningkat dengan persentase yang sama, presisi pencarian juga meningkat. Ketika <code translate="no">nlist</code> = 4096 dan <code translate="no">nprobe</code> adalah 128, Milvus memiliki performa pencarian terbaik. Kesimpulannya, ketika menentukan nilai untuk <code translate="no">nlist</code> dan <code translate="no">nprobe</code>, Anda harus membuat trade-off antara kinerja dan presisi dengan mempertimbangkan set data dan persyaratan yang berbeda.</p>
<h2 id="Summary" class="common-anchor-header">Ringkasan<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>: Ketika ukuran data lebih besar dari <code translate="no">index_file_size</code>, semakin besar nilai <code translate="no">index_file_size</code>, semakin baik kinerja pencarian.<code translate="no">nlist</code> dan <code translate="no">nprobe</code>: Anda harus membuat trade-off antara kinerja dan presisi.</p>
