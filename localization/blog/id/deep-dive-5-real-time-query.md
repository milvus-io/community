---
id: deep-dive-5-real-time-query.md
title: Menggunakan Basis Data Vektor Milvus untuk Kueri Waktu Nyata
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: Pelajari tentang mekanisme yang mendasari kueri waktu nyata di Milvus.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/xige-16">Xi Ge</a> dan diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Pada artikel sebelumnya, kita telah membahas tentang <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">penyisipan data dan persistensi data</a> di Milvus. Dalam artikel ini, kami akan terus menjelaskan bagaimana <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">berbagai komponen</a> dalam Milvus berinteraksi satu sama lain untuk menyelesaikan kueri data real-time.</p>
<p><em>Beberapa sumber daya yang berguna sebelum memulai tercantum di bawah ini. Kami sarankan untuk membacanya terlebih dahulu untuk lebih memahami topik dalam artikel ini.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Mendalami arsitektur Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Model data Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Peran dan fungsi dari setiap komponen Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Pemrosesan data di Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Penyisipan data dan persistensi data di Milvus</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">Memuat data ke simpul kueri<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum sebuah query dieksekusi, data harus dimuat ke dalam node query terlebih dahulu.</p>
<p>Ada dua jenis data yang dimuat ke node kueri: data streaming dari <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">log broker</a>, dan data historis dari <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">penyimpanan objek</a> (juga disebut penyimpanan persisten di bawah).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>Diagram alir</span> </span></p>
<p>Data coord bertanggung jawab untuk menangani data streaming yang secara terus menerus dimasukkan ke dalam Milvus. Ketika pengguna Milvus memanggil <code translate="no">collection.load()</code> untuk memuat sebuah koleksi, query coord akan menanyakan kepada data coord untuk mengetahui segmen mana yang telah disimpan dalam penyimpanan dan checkpoint yang sesuai. Checkpoint adalah tanda yang menandakan bahwa segmen yang disimpan sebelum checkpoint akan dikonsumsi, sementara yang setelah checkpoint tidak.</p>
<p>Kemudian, koordinat kueri mengeluarkan strategi alokasi berdasarkan informasi dari koordinat data: baik berdasarkan segmen atau saluran. Pengalokasi segmen bertanggung jawab untuk mengalokasikan segmen dalam penyimpanan persisten (data batch) ke node kueri yang berbeda. Misalnya, pada gambar di atas, pengalokasi segmen mengalokasikan segmen 1 dan 3 (S1, S3) ke node kueri 1, dan segmen 2 dan 4 (S2, S4) ke node kueri 2. Pengalokasi saluran menetapkan node kueri yang berbeda untuk mengawasi beberapa <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">saluran</a> manipulasi data (DMChannels) di broker log. Misalnya, pada gambar di atas, pengalokasi saluran menetapkan node kueri 1 untuk menonton saluran 1 (Ch1), dan node kueri 2 untuk menonton saluran 2 (Ch2).</p>
<p>Dengan strategi alokasi, setiap node kueri memuat data segmen dan menonton saluran yang sesuai. Pada simpul kueri 1 pada gambar, data historis (data batch), dimuat melalui S1 dan S3 yang dialokasikan dari penyimpanan persisten. Sementara itu, simpul kueri 1 memuat data tambahan (data streaming) dengan berlangganan saluran 1 di broker log.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">Manajemen data di simpul kueri<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebuah simpul kueri perlu mengelola data historis dan data tambahan. Data historis disimpan dalam <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">segmen tertutup</a> sementara data tambahan disimpan dalam <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">segmen</a> yang terus bertambah.</p>
<h3 id="Historical-data-management" class="common-anchor-header">Manajemen data historis</h3><p>Ada dua pertimbangan utama untuk manajemen data historis: keseimbangan beban dan kegagalan simpul kueri.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>Keseimbangan beban</span> </span></p>
<p>Sebagai contoh, seperti yang ditunjukkan dalam ilustrasi, simpul kueri 4 telah dialokasikan lebih banyak segmen tertutup daripada simpul kueri lainnya. Kemungkinan besar, hal ini akan membuat node kueri 4 menjadi hambatan yang memperlambat seluruh proses kueri. Untuk mengatasi masalah ini, sistem perlu mengalokasikan beberapa segmen di simpul kueri 4 ke simpul kueri lainnya. Ini disebut keseimbangan beban.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>Peralihan simpul kueri</span> </span></p>
<p>Situasi lain yang mungkin terjadi diilustrasikan pada gambar di atas. Salah satu node, node kueri 4, tiba-tiba mati. Dalam kasus ini, beban (segmen yang dialokasikan ke node kueri 4) perlu ditransfer ke node kueri lain yang berfungsi untuk memastikan keakuratan hasil kueri.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">Manajemen data tambahan</h3><p>Node kueri mengawasi DMChannels untuk menerima data tambahan. Flowgraph diperkenalkan dalam proses ini. Pertama-tama menyaring semua pesan penyisipan data. Hal ini untuk memastikan bahwa hanya data dalam partisi tertentu yang dimuat. Setiap koleksi dalam Milvus memiliki saluran yang sesuai, yang digunakan bersama oleh semua partisi dalam koleksi tersebut. Oleh karena itu, flowgraph diperlukan untuk menyaring data yang disisipkan jika pengguna Milvus hanya perlu memuat data pada partisi tertentu. Jika tidak, data di semua partisi dalam koleksi akan dimuat ke simpul kueri.</p>
<p>Setelah disaring, data tambahan dimasukkan ke dalam segmen yang sedang berkembang, dan selanjutnya diteruskan ke node waktu server.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>Diagram alir</span> </span></p>
<p>Selama penyisipan data, setiap pesan penyisipan diberi stempel waktu. Pada DMChannel yang ditunjukkan pada gambar di atas, data disisipkan secara berurutan, dari kiri ke kanan. Cap waktu untuk pesan penyisipan pertama adalah 1; yang kedua, 2; dan yang ketiga, 6. Pesan keempat yang ditandai dengan warna merah bukanlah pesan penyisipan, melainkan pesan penanda waktu. Hal ini untuk menandakan bahwa data yang disisipkan dengan timestamp yang lebih kecil dari timetick ini sudah ada di dalam log broker. Dengan kata lain, data yang disisipkan setelah pesan timetick ini harus memiliki timestamp yang nilainya lebih besar dari timetick ini. Sebagai contoh, pada gambar di atas, ketika simpul kueri melihat bahwa timetick saat ini adalah 5, ini berarti semua pesan penyisipan yang nilai timestamp-nya kurang dari 5 dimuat ke simpul kueri.</p>
<p>Node waktu server memberikan nilai <code translate="no">tsafe</code> yang diperbarui setiap kali menerima timetick dari node penyisipan. <code translate="no">tsafe</code> berarti waktu aman, dan semua data yang disisipkan sebelum titik waktu ini dapat ditanyakan. Sebagai contoh, jika <code translate="no">tsafe</code> = 9, data yang disisipkan dengan cap waktu yang lebih kecil dari 9 semuanya dapat ditanyakan.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Kueri waktu nyata di Milvus<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Kueri real-time di Milvus diaktifkan oleh pesan kueri. Pesan kueri dimasukkan ke dalam perantara log oleh proksi. Kemudian node kueri mendapatkan pesan kueri dengan melihat saluran kueri di log broker.</p>
<h3 id="Query-message" class="common-anchor-header">Pesan kueri</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>Pesan kueri</span> </span></p>
<p>Pesan kueri mencakup informasi penting berikut tentang kueri:</p>
<ul>
<li><code translate="no">msgID</code>: ID pesan, ID pesan kueri yang ditetapkan oleh sistem.</li>
<li><code translate="no">collectionID</code>: ID koleksi yang akan ditanyakan (jika ditentukan oleh pengguna).</li>
<li><code translate="no">execPlan</code>: Rencana eksekusi terutama digunakan untuk pemfilteran atribut dalam kueri.</li>
<li><code translate="no">service_ts</code>: Stempel waktu layanan akan diperbarui bersama dengan <code translate="no">tsafe</code> yang disebutkan di atas. Stempel waktu layanan menandakan pada titik mana layanan masuk. Semua data yang dimasukkan sebelum <code translate="no">service_ts</code> tersedia untuk kueri.</li>
<li><code translate="no">travel_ts</code>: Stempel waktu perjalanan menentukan rentang waktu di masa lalu. Dan kueri akan dilakukan pada data yang ada pada periode waktu yang ditentukan oleh <code translate="no">travel_ts</code>.</li>
<li><code translate="no">guarantee_ts</code>: Guarantee timestamp menentukan periode waktu setelah kueri perlu dilakukan. Query hanya akan dilakukan ketika <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">Kueri waktu nyata</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>Proses kueri</span> </span></p>
<p>Ketika pesan kueri diterima, Milvus pertama-tama menilai apakah waktu layanan saat ini, <code translate="no">service_ts</code>, lebih besar daripada cap waktu jaminan, <code translate="no">guarantee_ts</code>, dalam pesan kueri. Jika ya, permintaan akan dieksekusi. Kueri akan dilakukan secara paralel pada data historis dan data tambahan. Karena mungkin ada tumpang tindih data antara data streaming dan data batch, tindakan yang disebut "pengurangan lokal" diperlukan untuk menyaring hasil kueri yang berlebihan.</p>
<p>Namun, jika waktu layanan saat ini lebih kecil dari stempel waktu jaminan dalam pesan kueri yang baru dimasukkan, pesan kueri akan menjadi pesan yang belum terselesaikan dan menunggu untuk diproses sampai waktu layanan menjadi lebih besar dari stempel waktu jaminan.</p>
<p>Hasil kueri pada akhirnya didorong ke saluran hasil. Proxy memperoleh hasil query dari saluran tersebut. Demikian juga, proxy akan melakukan "pengurangan global" juga karena menerima hasil dari beberapa node kueri dan hasil kueri mungkin berulang.</p>
<p>Untuk memastikan bahwa proxy telah menerima semua hasil kueri sebelum mengembalikannya ke SDK, pesan hasil juga akan menyimpan catatan informasi termasuk segmen tertutup yang dicari, DMChannels yang dicari, dan segmen tertutup global (semua segmen pada semua node kueri). Sistem dapat menyimpulkan bahwa proxy telah menerima semua hasil kueri hanya jika kedua kondisi berikut terpenuhi:</p>
<ul>
<li>Gabungan semua segmen tersegel yang dicari yang dicatat dalam semua pesan hasil lebih besar dari segmen tersegel global,</li>
<li>Semua DMChannels dalam koleksi ditanyakan.</li>
</ul>
<p>Pada akhirnya, proxy mengembalikan hasil akhir setelah "pengurangan global" ke Milvus SDK.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Tentang Seri Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">pengumuman resmi ketersediaan umum</a> Milvus 2.0, kami menyusun seri blog Milvus Deep Dive ini untuk memberikan interpretasi mendalam tentang arsitektur dan kode sumber Milvus. Topik-topik yang dibahas dalam seri blog ini meliputi:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Gambaran umum arsitektur Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API dan SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Pemrosesan data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Manajemen data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Kueri waktu nyata</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Mesin eksekusi skalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistem QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Mesin eksekusi vektor</a></li>
</ul>
