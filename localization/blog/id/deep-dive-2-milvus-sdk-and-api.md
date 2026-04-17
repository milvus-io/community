---
id: deep-dive-2-milvus-sdk-and-api.md
title: Pengantar ke Milvus Python SDK dan API
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  Pelajari bagaimana SDK berinteraksi dengan Milvus dan mengapa API gaya ORM
  membantu Anda mengelola Milvus dengan lebih baik.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul</span> </span></p>
<p>Oleh <a href="https://github.com/XuanYang-cn">Xuan Yang</a></p>
<h2 id="Background" class="common-anchor-header">Latar Belakang<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Ilustrasi berikut menggambarkan interaksi antara SDK dan Milvus melalui gRPC. Bayangkan Milvus adalah sebuah kotak hitam. Buffer Protokol digunakan untuk mendefinisikan antarmuka server, dan struktur informasi yang dibawanya. Oleh karena itu, semua operasi dalam kotak hitam Milvus didefinisikan oleh Protocol API.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>Interaksi</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">API Protokol Milvus<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Protocol API terdiri dari <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, dan <code translate="no">schema.proto</code>, yang merupakan file Protocol Buffer yang diakhiri dengan <code translate="no">.proto</code>. Untuk memastikan operasi yang tepat, SDK harus berinteraksi dengan Milvus dengan file Buffer Protokol ini.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> adalah komponen penting dari API Protokol Milvus karena mendefinisikan <code translate="no">MilvusService</code>, yang selanjutnya mendefinisikan semua antarmuka RPC Milvus.</p>
<p>Contoh kode berikut ini menunjukkan antarmuka <code translate="no">CreatePartitionRequest</code>. Antarmuka ini memiliki dua parameter tipe string utama <code translate="no">collection_name</code> dan <code translate="no">partition_name</code>, yang digunakan untuk memulai permintaan pembuatan partisi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>Lihat contoh Protokol di <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">Repositori GitHub PyMilvus</a> pada baris 19.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>Contoh</span> </span></p>
<p>Anda dapat menemukan definisi dari <code translate="no">CreatePartitionRequest</code> di sini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>Definisi</span> </span></p>
<p>Kontributor yang ingin mengembangkan fitur Milvus atau SDK dalam bahasa pemrograman yang berbeda dipersilahkan untuk menemukan semua antarmuka yang ditawarkan Milvus melalui RPC.</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> mendefinisikan jenis-jenis informasi yang umum, termasuk <code translate="no">ErrorCode</code>, dan <code translate="no">Status</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> mendefinisikan skema dalam parameter. Contoh kode berikut ini adalah contoh dari <code translate="no">CollectionSchema</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, dan <code translate="no">schema.proto</code> bersama-sama membentuk API Milvus, mewakili semua operasi yang dapat dipanggil melalui RPC.</p>
<p>Jika Anda menggali kode sumber dan mengamati dengan seksama, Anda akan menemukan bahwa ketika antarmuka seperti <code translate="no">create_index</code> dipanggil, mereka sebenarnya memanggil beberapa antarmuka RPC seperti <code translate="no">describe_collection</code> dan <code translate="no">describe_index</code>. Banyak antarmuka luar Milvus adalah kombinasi dari beberapa antarmuka RPC.</p>
<p>Setelah memahami perilaku RPC, Anda kemudian dapat mengembangkan fitur-fitur baru untuk Milvus melalui kombinasi. Anda dipersilahkan untuk menggunakan imajinasi dan kreativitas Anda dan berkontribusi pada komunitas Milvus.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">Pemetaan relasional objek (ORM)</h3><p>Secara singkatnya, Object-relational mapping (ORM) mengacu pada saat Anda beroperasi pada sebuah objek lokal, operasi tersebut akan mempengaruhi objek yang terkait di server. API gaya ORM PyMilvus memiliki karakteristik sebagai berikut:</p>
<ol>
<li>Beroperasi langsung pada objek.</li>
<li>Mengisolasi logika layanan dan detail akses data.</li>
<li>API ini menyembunyikan kompleksitas implementasi, dan Anda dapat menjalankan skrip yang sama di berbagai instance Milvus terlepas dari pendekatan penerapan atau implementasinya.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">API bergaya ORM</h3><p>Salah satu esensi dari ORM-style API terletak pada kontrol koneksi Milvus. Sebagai contoh, Anda dapat menentukan alias untuk beberapa server Milvus, dan menyambungkan atau memutuskan koneksi dari server-server tersebut hanya dengan menggunakan alias mereka. Anda bahkan dapat menghapus alamat server lokal, dan mengontrol objek tertentu melalui koneksi tertentu secara tepat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>Mengontrol Koneksi</span> </span></p>
<p>Fitur lain dari API gaya ORM adalah, setelah abstraksi, semua operasi dapat dilakukan secara langsung pada objek, termasuk koleksi, partisi, dan indeks.</p>
<p>Anda dapat mengabstraksikan objek koleksi dengan mengambil objek yang sudah ada atau membuat yang baru. Anda juga dapat menetapkan koneksi Milvus ke objek tertentu menggunakan connection alias, sehingga Anda dapat beroperasi pada objek-objek ini secara lokal.</p>
<p>Untuk membuat objek partisi, Anda dapat membuatnya dengan objek koleksi induknya, atau Anda dapat melakukannya seperti ketika Anda membuat objek koleksi. Metode-metode ini juga dapat digunakan pada objek indeks.</p>
<p>Jika objek partisi atau objek indeks ini ada, Anda bisa mendapatkannya melalui objek koleksi induknya.</p>
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
