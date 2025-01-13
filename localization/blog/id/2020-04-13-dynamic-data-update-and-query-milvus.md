---
id: dynamic-data-update-and-query-milvus.md
title: Persiapan
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: Pencarian vektor sekarang lebih intuitif dan nyaman
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Bagaimana Milvus Menerapkan Pembaruan Data Dinamis dan Kueri</custom-h1><p>Pada artikel ini, kami akan menjelaskan bagaimana data vektor direkam dalam memori Milvus, dan bagaimana data ini dipertahankan.</p>
<p>Di bawah ini adalah tujuan desain utama kami:</p>
<ol>
<li>Efisiensi impor data harus tinggi.</li>
<li>Data dapat dilihat sesegera mungkin setelah impor data.</li>
<li>Hindari fragmentasi file data.</li>
</ol>
<p>Oleh karena itu, kami telah membuat penyangga memori (insert buffer) untuk menyisipkan data untuk mengurangi jumlah peralihan konteks IO acak pada disk dan sistem operasi untuk meningkatkan kinerja penyisipan data. Arsitektur penyimpanan memori berdasarkan MemTable dan MemTableFile memungkinkan kami untuk mengelola dan melakukan serialisasi data dengan lebih nyaman. Status buffer dibagi menjadi Mutable dan Immutable, yang memungkinkan data disimpan ke disk sambil tetap menyediakan layanan eksternal.</p>
<h2 id="Preparation" class="common-anchor-header">Persiapan<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika pengguna siap untuk memasukkan vektor ke dalam Milvus, pertama-tama ia harus membuat Collection (* Milvus mengganti nama Table menjadi Collection pada versi 0.7.0). Collection adalah unit paling dasar untuk merekam dan mencari vektor di Milvus.</p>
<p>Setiap Collection memiliki nama yang unik dan beberapa properti yang dapat diatur, dan vektor-vektor dimasukkan atau dicari berdasarkan nama Collection. Ketika membuat sebuah Collection baru, Milvus akan mencatat informasi dari Collection ini di dalam metadata.</p>
<h2 id="Data-Insertion" class="common-anchor-header">Penyisipan Data<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika pengguna mengirimkan permintaan untuk menyisipkan data, data diserialisasikan dan dideserialisasikan untuk mencapai server Milvus. Data sekarang ditulis ke dalam memori. Penulisan memori secara garis besar dibagi menjadi beberapa langkah berikut:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-penyisipan-data-milvus.png</span> </span></p>
<ol>
<li>Pada MemManager, cari atau buat MemTable baru yang sesuai dengan nama Koleksi. Setiap MemTable berhubungan dengan buffer Koleksi dalam memori.</li>
<li>Sebuah MemTable akan berisi satu atau lebih MemTableFile. Setiap kali kita membuat MemTableFile baru, kita akan mencatat informasi ini di Meta pada saat yang sama. Kita membagi MemTableFile ke dalam dua status: Dapat berubah dan Tidak Dapat Berubah. Ketika ukuran MemTableFile mencapai ambang batas, ia akan menjadi Immutable. Setiap MemTable hanya dapat memiliki satu MemTableFile Mutable yang dapat ditulis kapan saja.</li>
<li>Data dari setiap MemTableFile pada akhirnya akan direkam dalam memori dalam format tipe indeks yang ditetapkan. MemTableFile adalah unit paling dasar untuk mengelola data dalam memori.</li>
<li>Setiap saat, penggunaan memori dari data yang disisipkan tidak akan melebihi nilai yang telah ditetapkan (insert_buffer_size). Hal ini dikarenakan setiap ada permintaan untuk menyisipkan data yang masuk, MemManager dapat dengan mudah menghitung memori yang ditempati oleh MemTableFile yang terdapat pada setiap MemTable, lalu mengkoordinasikan permintaan penyisipan data sesuai dengan memori yang ada.</li>
</ol>
<p>Melalui arsitektur multi-level MemManager, MemTable dan MemTableFile, penyisipan data dapat dikelola dan dipelihara dengan lebih baik. Tentu saja, mereka dapat melakukan lebih dari itu.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">Query yang Hampir Real-time<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam Milvus, Anda hanya perlu menunggu paling lama satu detik untuk memindahkan data yang disisipkan dari memori ke disk. Keseluruhan proses ini secara kasar dapat diringkas oleh gambar berikut:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-hampir-real-time-query-milvus.png</span> </span></p>
<p>Pertama, data yang disisipkan akan masuk ke dalam buffer penyisipan di memori. Buffer secara berkala akan berubah dari kondisi awal Mutable ke kondisi Immutable sebagai persiapan untuk serialisasi. Kemudian, buffer Immutable ini akan diserialisasi ke disk secara berkala oleh thread serialisasi latar belakang. Setelah data ditempatkan, informasi pesanan akan dicatat dalam metadata. Pada titik ini, data dapat dicari!</p>
<p>Sekarang, kami akan menjelaskan langkah-langkah dalam gambar secara rinci.</p>
<p>Kita sudah mengetahui proses memasukkan data ke dalam buffer yang dapat diubah. Langkah berikutnya adalah beralih dari buffer yang dapat diubah ke buffer yang tidak dapat diubah:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>Antrian yang tidak dapat diubah akan menyediakan latar belakang thread serialisasi dengan status yang tidak dapat diubah dan MemTableFile yang siap untuk diserialisasi. Setiap MemTable mengelola antrean tidak berubahnya sendiri, dan ketika ukuran satu-satunya MemTableFile yang dapat diubah mencapai ambang batas, ia akan masuk ke antrean tidak berubah. Thread latar belakang yang bertanggung jawab atas ToImmutable akan secara berkala menarik semua MemTableFile dalam antrean tidak dapat diubah yang dikelola oleh MemTable dan mengirimkannya ke antrean tidak dapat diubah secara keseluruhan. Perlu dicatat bahwa dua operasi menulis data ke dalam memori dan mengubah data dalam memori ke dalam keadaan yang tidak dapat ditulis tidak dapat terjadi pada saat yang sama, dan diperlukan penguncian bersama. Namun demikian, pengoperasian ToImmutable sangat sederhana dan hampir tidak menyebabkan penundaan apa pun, sehingga dampak performa pada data yang dimasukkan sangat minimal.</p>
<p>Langkah selanjutnya adalah menserialisasikan MemTableFile dalam antrian serialisasi ke disk. Ini terutama dibagi menjadi tiga langkah:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialisasi-memtablefile-milvus.png</span> </span></p>
<p>Pertama, thread serialisasi latar belakang akan menarik MemTableFile dari antrean yang tidak dapat diubah secara berkala. Kemudian, mereka diserialisasi menjadi file mentah berukuran tetap (Raw TableFiles). Terakhir, kita akan mencatat informasi ini dalam metadata. Ketika kita melakukan pencarian vektor, kita akan menanyakan TableFile yang sesuai dalam metadata. Dari sini, data-data ini dapat dicari!</p>
<p>Selain itu, menurut set index_file_size, setelah thread serialisasi menyelesaikan siklus serialisasi, ia akan menggabungkan beberapa TableFile dengan ukuran tetap ke dalam TableFile, dan juga mencatat informasi ini dalam metadata. Pada saat ini, TableFile dapat diindeks. Pembuatan indeks juga bersifat asinkron. Thread latar belakang lain yang bertanggung jawab atas pembuatan indeks akan secara berkala membaca TableFile dalam status ToIndex pada metadata untuk melakukan pembuatan indeks yang sesuai.</p>
<h2 id="Vector-search" class="common-anchor-header">Pencarian vektor<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Faktanya, Anda akan menemukan bahwa dengan bantuan TableFile dan metadata, pencarian vektor menjadi lebih intuitif dan nyaman. Secara umum, kita perlu mendapatkan TableFile yang sesuai dengan Koleksi yang ditanyakan dari metadata, mencari di setiap TableFile, dan akhirnya menggabungkan. Pada artikel ini, kami tidak membahas implementasi spesifik dari pencarian.</p>
<p>Jika Anda ingin tahu lebih banyak, silakan baca kode sumber kami, atau baca artikel teknis kami yang lain tentang Milvus!</p>
