---
id: a-day-in-the-life-of-milvus-datum.md
title: Sehari dalam Kehidupan Seorang Milvus Datum
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: >-
  Jadi, mari kita berjalan-jalan dalam satu hari dalam kehidupan Dave, si datum
  Milvus.
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>Membangun <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> berkinerja tinggi seperti Milvus yang dapat menangani miliaran vektor dan menangani lalu lintas berskala web bukanlah hal yang mudah. Hal ini membutuhkan desain sistem terdistribusi yang cermat dan cerdas. Tentu saja, akan ada pertukaran antara kinerja vs kesederhanaan dalam internal sistem seperti ini.</p>
<p>Meskipun kami telah mencoba menyeimbangkan pertukaran ini dengan baik, beberapa aspek internal tetap tidak jelas. Artikel ini bertujuan untuk menghilangkan misteri tentang bagaimana Milvus memecah penyisipan data, pengindeksan, dan penyajian di seluruh node. Memahami proses-proses ini pada tingkat yang tinggi sangat penting untuk mengoptimalkan kinerja kueri secara efektif, stabilitas sistem, dan masalah-masalah yang berhubungan dengan debugging.</p>
<p>Jadi, mari kita berjalan-jalan dalam satu hari dalam kehidupan Dave, datum Milvus. Bayangkan Anda memasukkan Dave ke dalam koleksi Anda dalam <a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">penerapan Milvus Distributed</a> (lihat diagram di bawah). Sejauh yang Anda ketahui, dia langsung masuk ke dalam koleksi. Akan tetapi, di balik layar, banyak langkah yang terjadi di seluruh sub-sistem yang independen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">Node Proksi dan Antrean Pesan<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pada awalnya, Anda memanggil objek MilvusClient, misalnya, melalui pustaka PyMilvus, dan mengirimkan permintaan <code translate="no">_insert()</code>_ ke sebuah <em>node proksi</em>. Node proxy adalah pintu gerbang antara pengguna dan sistem basis data, melakukan operasi seperti penyeimbangan beban pada lalu lintas yang masuk dan menyusun beberapa keluaran sebelum dikembalikan ke pengguna.</p>
<p>Fungsi hash diterapkan pada kunci utama item untuk menentukan <em>saluran</em> mana yang akan dikirim. Saluran, yang diimplementasikan dengan topik Pulsar atau Kafka, mewakili tempat penampungan untuk streaming data, yang kemudian dapat dikirim ke pelanggan saluran tersebut.</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">Simpul, Segmen, dan Potongan Data<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah data dikirim ke saluran yang sesuai, saluran kemudian mengirimkannya ke segmen yang sesuai di <em>simpul data</em>. Simpul data bertanggung jawab untuk menyimpan dan mengelola buffer data yang disebut <em>growing segment</em>. Ada satu segmen yang berkembang per pecahan.</p>
<p>Ketika data dimasukkan ke dalam segmen, segmen tumbuh menuju ukuran maksimum, standarnya adalah 122MB. Selama waktu ini, bagian yang lebih kecil dari segmen, secara default 16MB dan dikenal sebagai <em>potongan</em>, didorong ke penyimpanan persisten, misalnya, menggunakan S3 AWS atau penyimpanan lain yang kompatibel seperti MinIO. Setiap chunk adalah file fisik pada penyimpanan objek dan ada file terpisah untuk setiap bidang. Lihat gambar di atas yang mengilustrasikan hierarki file pada penyimpanan objek.</p>
<p>Jadi untuk meringkas, data koleksi dipecah menjadi beberapa node data, yang di dalamnya dipecah menjadi beberapa segmen untuk buffering, yang kemudian dipecah lagi menjadi beberapa chunk per bidang untuk penyimpanan persisten. Dua diagram di atas memperjelas hal ini. Dengan membagi data yang masuk dengan cara ini, kami sepenuhnya memanfaatkan paralelisme bandwidth jaringan, komputasi, dan penyimpanan cluster.</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">Menyegel, Menggabungkan, dan Memadatkan Segmen<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sejauh ini kami telah menceritakan kisah tentang bagaimana datum kita yang ramah, Dave, berhasil beralih dari kueri <code translate="no">_insert()</code>_ ke penyimpanan persisten. Tentu saja, ceritanya tidak berhenti sampai di situ. Ada langkah-langkah lebih lanjut untuk membuat proses pencarian dan pengindeksan menjadi lebih efisien. Dengan mengatur ukuran dan jumlah segmen, sistem ini memanfaatkan paralelisme klaster secara penuh.</p>
<p>Setelah sebuah segmen mencapai ukuran maksimum pada simpul data, secara default 122MB, maka segmen tersebut dikatakan <em>tersegel</em>. Artinya, buffer pada simpul data dikosongkan untuk memberi ruang bagi segmen baru, dan potongan yang sesuai dalam penyimpanan persisten ditandai sebagai bagian dari segmen tertutup.</p>
<p>Simpul data secara berkala mencari segmen tertutup yang lebih kecil dan menggabungkannya menjadi segmen yang lebih besar hingga mencapai ukuran maksimum 1GB (secara default) per segmen. Ingatlah bahwa ketika sebuah item dihapus di Milvus, item tersebut akan ditandai dengan sebuah bendera penghapusan - anggap saja sebagai Death Row untuk Dave. Ketika jumlah item yang dihapus dalam sebuah segmen melewati ambang batas tertentu, secara default 20%, segmen tersebut akan dikurangi ukurannya, sebuah operasi yang kita sebut <em>pemadatan</em>.</p>
<p>Mengindeks dan Mencari melalui Segmen</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ada jenis simpul tambahan, <em>simpul indeks</em>, yang bertanggung jawab untuk membangun indeks untuk segmen yang disegel. Ketika segmen disegel, simpul data mengirimkan permintaan kepada simpul indeks untuk membangun indeks. Simpul indeks kemudian mengirimkan indeks yang telah selesai ke penyimpanan objek. Setiap segmen yang disegel memiliki indeksnya sendiri yang disimpan dalam file terpisah. Anda dapat memeriksa file ini secara manual dengan mengakses bucket - lihat gambar di atas untuk mengetahui hierarki file.</p>
<p>Node kueri - tidak hanya node data - berlangganan topik antrian pesan untuk pecahan yang sesuai. Segmen yang berkembang direplikasi pada node kueri, dan node memuat ke dalam memori segmen yang disegel milik koleksi sesuai kebutuhan. Ini membangun indeks untuk setiap segmen yang berkembang saat data masuk, dan memuat indeks yang sudah selesai untuk segmen yang disegel dari penyimpanan data.</p>
<p>Bayangkan sekarang Anda memanggil objek MilvusClient dengan permintaan <em>search()</em> yang mencakup Dave. Setelah dirutekan ke semua node kueri melalui node proxy, setiap node kueri melakukan pencarian kemiripan vektor (atau salah satu metode pencarian lain seperti kueri, pencarian rentang, atau pencarian pengelompokan), mengulang segmen satu per satu. Hasilnya dikumpulkan di seluruh node dengan cara seperti MapReduce dan dikirim kembali ke pengguna, Dave akan senang karena akhirnya bisa bertemu kembali dengan Anda.</p>
<h2 id="Discussion" class="common-anchor-header">Diskusi<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita telah membahas satu hari dalam kehidupan Dave si datum, baik untuk operasi <code translate="no">_insert()</code>_ dan <code translate="no">_search()</code>_. Operasi-operasi lain seperti <code translate="no">_delete()</code>_ dan <code translate="no">_upsert()</code>_ juga bekerja dengan cara yang sama. Tidak dapat dipungkiri, kita harus menyederhanakan pembahasan kita dan menghilangkan detail-detail yang lebih rinci. Namun secara keseluruhan, Anda seharusnya sudah memiliki gambaran yang cukup tentang bagaimana Milvus didesain agar paralelisme antar node dalam sistem terdistribusi menjadi kuat dan efisien, dan bagaimana Anda dapat menggunakannya untuk optimasi dan debugging.</p>
<p><em>Hal penting yang dapat diambil dari artikel ini: Milvus didesain dengan pemisahan masalah di seluruh jenis node. Setiap jenis node memiliki fungsi yang spesifik dan saling terpisah, dan ada pemisahan antara penyimpanan dan komputasi.</em> Hasilnya, setiap komponen dapat diskalakan secara independen dengan parameter yang dapat diubah sesuai dengan kasus penggunaan dan pola lalu lintas. Misalnya, Anda dapat menskalakan jumlah node kueri untuk melayani lalu lintas yang meningkat tanpa menskalakan data dan node indeks. Dengan fleksibilitas tersebut, ada pengguna Milvus yang menangani miliaran vektor dan melayani lalu lintas skala web, dengan latensi kueri kurang dari 100ms.</p>
<p>Anda juga dapat menikmati manfaat dari desain terdistribusi Milvus tanpa perlu menggunakan cluster terdistribusi melalui <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, layanan yang dikelola sepenuhnya oleh Milvus. <a href="https://cloud.zilliz.com/signup">Daftar hari ini untuk mendapatkan tingkat gratis Zilliz Cloud dan mulai gunakan Dave!</a></p>
