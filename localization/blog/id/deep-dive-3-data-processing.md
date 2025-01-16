---
id: deep-dive-3-data-processing.md
title: Bagaimana Data Diproses dalam Basis Data Vektor?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  Milvus menyediakan infrastruktur manajemen data yang penting untuk aplikasi AI
  produksi. Artikel ini menyingkap seluk-beluk pemrosesan data di dalamnya.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/czs007">Zhenshan Cao</a> dan diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Dalam dua artikel sebelumnya dalam seri blog ini, kami telah membahas <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">arsitektur sistem</a> Milvus, database vektor tercanggih di dunia, serta <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Python SDK dan API-nya</a>.</p>
<p>Tulisan ini terutama bertujuan untuk membantu Anda memahami bagaimana data diproses di Milvus dengan mendalami sistem Milvus dan memeriksa interaksi antara komponen-komponen pemrosesan data.</p>
<p><em>Beberapa sumber daya yang berguna sebelum memulai tercantum di bawah ini. Kami merekomendasikan untuk membacanya terlebih dahulu untuk lebih memahami topik dalam tulisan ini.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Mendalami arsitektur Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Model data Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Peran dan fungsi setiap komponen Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Pemrosesan data dalam Milvus</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">Antarmuka MsgStream<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">Antarmuka MsgStream</a> sangat penting untuk pemrosesan data di Milvus. Ketika <code translate="no">Start()</code> dipanggil, coroutine di latar belakang akan menulis data ke dalam <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">log broker</a> atau membaca data dari sana. Ketika <code translate="no">Close()</code> dipanggil, coroutine akan berhenti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>Antarmuka MsgStream</span> </span></p>
<p>MsgStream dapat berfungsi sebagai produsen dan konsumen. Antarmuka <code translate="no">AsProducer(channels []string)</code> mendefinisikan MsgStream sebagai produsen sementara <code translate="no">AsConsumer(channels []string, subNamestring)</code>mendefinisikannya sebagai konsumen. Parameter <code translate="no">channels</code> digunakan bersama di kedua antarmuka dan digunakan untuk mendefinisikan saluran (fisik) mana yang akan digunakan untuk menulis data atau membaca data.</p>
<blockquote>
<p>Jumlah pecahan dalam sebuah koleksi dapat ditentukan ketika koleksi dibuat. Setiap pecahan berhubungan dengan <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">saluran virtual (vchannel)</a>. Oleh karena itu, sebuah koleksi dapat memiliki beberapa vchannel. Milvus memberikan setiap vchannel di log broker sebuah <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">saluran fisik (pchannel</a>).</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>Setiap saluran virtual/bongkahan berhubungan dengan saluran fisik.</span> </span></p>
<p><code translate="no">Produce()</code> di antarmuka MsgStream yang bertugas menulis data ke dalam pchannel di log broker. Data dapat ditulis dalam dua cara:</p>
<ul>
<li>Penulisan tunggal: entitas ditulis ke dalam pecahan yang berbeda (vchannel) dengan nilai hash dari kunci primer. Kemudian entitas-entitas ini mengalir ke dalam pchannel yang sesuai di log broker.</li>
<li>Broadcast write: entitas ditulis ke dalam semua pchannel yang ditentukan oleh parameter <code translate="no">channels</code>.</li>
</ul>
<p><code translate="no">Consume()</code> adalah jenis API pemblokiran. Jika tidak ada data yang tersedia di pchannel yang ditentukan, coroutine akan diblokir ketika <code translate="no">Consume()</code> dipanggil di antarmuka MsgStream. Di sisi lain, <code translate="no">Chan()</code> adalah API non-blocking, yang berarti bahwa coroutine membaca dan memproses data hanya jika ada data yang ada di pchannel yang ditentukan. Jika tidak, coroutine dapat memproses tugas-tugas lain dan tidak akan diblokir ketika tidak ada data yang tersedia.</p>
<p><code translate="no">Seek()</code> adalah metode untuk pemulihan kegagalan. Ketika sebuah node baru dimulai, catatan konsumsi data dapat diperoleh dan konsumsi data dapat dilanjutkan dari tempat terputusnya dengan memanggil <code translate="no">Seek()</code>.</p>
<h2 id="Write-data" class="common-anchor-header">Tulis data<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Data yang ditulis ke dalam vchannels (pecahan) yang berbeda dapat berupa pesan sisipan atau pesan hapus. Vchannels ini juga dapat disebut DmChannels (saluran manipulasi data).</p>
<p>Koleksi yang berbeda dapat berbagi pchannels yang sama dalam log broker. Satu koleksi dapat memiliki beberapa pecahan dan karenanya memiliki beberapa vchannels yang sesuai. Entitas dalam koleksi yang sama, akibatnya mengalir ke beberapa pchannels yang sesuai di log broker. Sebagai hasilnya, manfaat dari berbagi pchannels adalah peningkatan volume throughput yang dimungkinkan oleh konkurensi yang tinggi dari log broker.</p>
<p>Ketika koleksi dibuat, tidak hanya jumlah pecahan yang ditentukan, tetapi juga pemetaan antara vchannels dan pchannels di log broker juga diputuskan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Menulis jalur di Milvus</span> </span></p>
<p>Seperti yang ditunjukkan pada ilustrasi di atas, pada jalur penulisan, proksi menulis data ke dalam log broker melalui antarmuka <code translate="no">AsProducer()</code> pada MsgStream. Kemudian node data mengkonsumsi data, lalu mengubah dan menyimpan data yang dikonsumsi ke dalam penyimpanan objek. Jalur penyimpanan adalah jenis informasi meta yang akan direkam dalam etcd oleh koordinator data.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagram alir</h3><p>Karena koleksi yang berbeda dapat berbagi pchannel yang sama dalam log broker, ketika mengkonsumsi data, node data atau node kueri perlu menilai ke koleksi mana data dalam pchannel. Untuk mengatasi masalah ini, kami memperkenalkan flowgraph di Milvus. Flowgraph ini bertugas untuk memfilter data dalam pchannel bersama berdasarkan ID koleksi. Jadi, kita dapat mengatakan bahwa setiap flowgraph menangani aliran data dalam pecahan (vchannel) yang sesuai dalam sebuah koleksi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
    Diagram </span> <span class="img-wrapper"> <span>alir dalam jalur penulisan</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">Pembuatan MsgStream</h3><p>Ketika menulis data, objek MsgStream dibuat dalam dua skenario berikut:</p>
<ul>
<li>Ketika proxy menerima permintaan penyisipan data, pertama-tama proxy mencoba mendapatkan pemetaan antara vchannel dan pchannel melalui koordinator root (root coord). Kemudian proxy membuat objek MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>Skenario 1</span> </span></p>
<ul>
<li>Ketika node data dimulai dan membaca informasi meta saluran di etcd, objek MsgStream dibuat.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>Skenario 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">Baca data<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Baca jalur di Milvus</span> </span></p>
<p>Alur kerja umum membaca data diilustrasikan pada gambar di atas. Permintaan kueri disiarkan melalui DqRequestChannel ke node kueri. Node-node kueri menjalankan tugas-tugas kueri secara paralel. Hasil kueri dari node kueri melewati gRPC dan proxy menggabungkan hasilnya dan mengembalikannya ke klien.</p>
<p>Untuk melihat lebih dekat proses pembacaan data, kita dapat melihat bahwa proxy menulis permintaan kueri ke dalam DqRequestChannel. Node query kemudian mengkonsumsi pesan dengan berlangganan ke DqRequestChannel. Setiap pesan dalam DqRequestChannel disiarkan sehingga semua node kueri yang berlangganan dapat menerima pesan tersebut.</p>
<p>Ketika node kueri menerima permintaan kueri, mereka melakukan kueri lokal pada data batch yang disimpan dalam segmen tertutup dan data streaming yang secara dinamis dimasukkan ke dalam Milvus dan disimpan dalam segmen yang sedang berkembang. Setelah itu, node kueri perlu menggabungkan hasil kueri di kedua <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">segmen tertutup dan segmen</a> yang <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">berkembang</a>. Hasil agregat ini diteruskan ke proxy melalui gRPC.</p>
<p>Proxy mengumpulkan semua hasil dari beberapa node kueri dan kemudian menggabungkannya untuk mendapatkan hasil akhir. Kemudian proxy mengembalikan hasil kueri akhir ke klien. Karena setiap permintaan kueri dan hasil kueri yang sesuai dilabeli dengan requestID unik yang sama, proxy dapat mengetahui hasil kueri mana yang sesuai dengan permintaan kueri yang mana.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagram alir</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
    Diagram </span> <span class="img-wrapper"> <span>alir dalam jalur baca</span> </span></p>
<p>Mirip dengan jalur tulis, flowgraph juga diperkenalkan di jalur baca. Milvus mengimplementasikan arsitektur Lambda terpadu, yang mengintegrasikan pemrosesan data tambahan dan data historis. Oleh karena itu, node kueri juga perlu mendapatkan data streaming real-time. Demikian pula, flowgraph dalam jalur baca menyaring dan membedakan data dari koleksi yang berbeda.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">Pembuatan MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>Membuat objek MsgStream di jalur baca</span> </span></p>
<p>Ketika membaca data, objek MsgStream dibuat dalam skenario berikut:</p>
<ul>
<li>Di Milvus, data tidak dapat dibaca kecuali data tersebut dimuat. Ketika proxy menerima permintaan pemuatan data, proxy akan mengirimkan permintaan tersebut ke koordinator kueri yang akan menentukan cara untuk menugaskan pecahan ke node kueri yang berbeda. Informasi penugasan (yaitu nama-nama vchannels dan pemetaan antara vchannels dan pchannels yang sesuai) dikirim ke node kueri melalui pemanggilan metode atau RPC (panggilan prosedur jarak jauh). Selanjutnya, node kueri membuat objek MsgStream yang sesuai untuk mengonsumsi data.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">Operasi DDL<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL adalah singkatan dari bahasa definisi data. Operasi DDL pada metadata dapat dikategorikan ke dalam permintaan tulis dan permintaan baca. Namun, kedua jenis permintaan ini diperlakukan sama selama pemrosesan metadata.</p>
<p>Permintaan baca pada metadata meliputi:</p>
<ul>
<li>Skema pengumpulan kueri</li>
<li>Informasi pengindeksan kueri Dan banyak lagi</li>
</ul>
<p>Permintaan tulis meliputi:</p>
<ul>
<li>Membuat koleksi</li>
<li>Menghapus koleksi</li>
<li>Membangun indeks</li>
<li>Jatuhkan indeks Dan banyak lagi</li>
</ul>
<p>Permintaan DDL dikirim ke proxy dari klien, dan proxy selanjutnya meneruskan permintaan ini dalam urutan yang diterima ke root coord yang memberikan cap waktu untuk setiap permintaan DDL dan melakukan pemeriksaan dinamis pada permintaan. Proxy menangani setiap permintaan secara serial, yang berarti satu permintaan DDL pada satu waktu. Proxy tidak akan memproses permintaan berikutnya sampai selesai memproses permintaan sebelumnya dan menerima hasil dari root coord.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>Operasi DDL</span>. </span></p>
<p>Seperti yang ditunjukkan pada ilustrasi di atas, ada <code translate="no">K</code> permintaan DDL dalam antrian tugas Root coord. Permintaan DDL dalam antrian tugas diatur dalam urutan yang diterima oleh root coord. Jadi, <code translate="no">ddl1</code> adalah yang pertama dikirim ke root coord, dan <code translate="no">ddlK</code> adalah yang terakhir dalam kelompok ini. Root coord memproses permintaan satu per satu dalam urutan waktu.</p>
<p>Dalam sistem terdistribusi, komunikasi antara proxy dan root coord diaktifkan oleh gRPC. Root coord menyimpan catatan nilai cap waktu maksimum dari tugas yang dieksekusi untuk memastikan bahwa semua permintaan DDL diproses dalam urutan waktu.</p>
<p>Misalkan ada dua proxy independen, proxy 1 dan proxy 2. Keduanya mengirimkan permintaan DDL ke root coord yang sama. Namun, satu masalah adalah bahwa permintaan yang lebih awal belum tentu dikirim ke root coord sebelum permintaan tersebut diterima oleh proxy lain. Sebagai contoh, pada gambar di atas, ketika <code translate="no">DDL_K-1</code> dikirim ke root coord dari proxy 1, <code translate="no">DDL_K</code> dari proxy 2 telah diterima dan dieksekusi oleh root coord. Seperti yang dicatat oleh root coord, nilai cap waktu maksimum dari tugas yang dieksekusi pada saat ini adalah <code translate="no">K</code>. Jadi agar tidak mengganggu urutan waktu, permintaan <code translate="no">DDL_K-1</code> akan ditolak oleh antrian tugas root coord. Namun, jika proxy 2 mengirimkan permintaan <code translate="no">DDL_K+5</code> ke root coord pada saat ini, permintaan tersebut akan diterima ke antrian tugas dan akan dieksekusi nanti sesuai dengan nilai timestamp-nya.</p>
<h2 id="Indexing" class="common-anchor-header">Pengindeksan<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">Membangun indeks</h3><p>Setelah menerima permintaan pembuatan indeks dari klien, proxy pertama-tama melakukan pemeriksaan statis pada permintaan dan mengirimkannya ke root coord. Kemudian root coord menyimpan permintaan pembuatan indeks ini ke dalam penyimpanan meta (etcd) dan mengirimkan permintaan ke koordinator indeks (index coord).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>Membangun sebuah indeks</span>. </span></p>
<p>Seperti yang diilustrasikan di atas, ketika index coord menerima permintaan pembuatan indeks dari root coord, pertama-tama ia akan menyimpan tugas tersebut di etcd untuk penyimpanan meta. Status awal dari tugas pembangunan indeks adalah <code translate="no">Unissued</code>. Index coord menyimpan catatan beban tugas setiap simpul indeks, dan mengirimkan tugas yang masuk ke simpul indeks yang tidak terlalu banyak dimuat. Setelah menyelesaikan tugas, simpul indeks menulis status tugas, baik <code translate="no">Finished</code> atau <code translate="no">Failed</code> ke dalam penyimpanan meta, yaitu etcd di Milvus. Kemudian index coord akan mengetahui apakah tugas pembangunan indeks berhasil atau gagal dengan melihat di etcd. Jika tugas gagal karena sumber daya sistem yang terbatas atau node indeks putus, index coord akan memicu ulang seluruh proses dan memberikan tugas yang sama ke node indeks lain.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">Menjatuhkan indeks</h3><p>Selain itu, index coord juga bertanggung jawab atas permintaan untuk melepaskan indeks.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>Menjatuhkan sebuah indeks</span>. </span></p>
<p>Ketika root coord menerima permintaan untuk menjatuhkan indeks dari klien, pertama-tama ia menandai indeks sebagai &quot;dijatuhkan&quot;, dan mengembalikan hasilnya ke klien sambil memberi tahu index coord. Kemudian index coord menyaring semua tugas pengindeksan dengan <code translate="no">IndexID</code> dan tugas-tugas yang sesuai dengan kondisi tersebut akan dibatalkan.</p>
<p>Coroutine latar belakang dari index coord secara bertahap akan menghapus semua tugas pengindeksan yang ditandai sebagai "dijatuhkan" dari penyimpanan objek (MinIO dan S3). Proses ini melibatkan antarmuka recycleIndexFiles. Ketika semua file indeks terkait dihapus, informasi meta dari tugas pengindeksan yang dihapus akan dihapus dari penyimpanan meta (etcd).</p>
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
