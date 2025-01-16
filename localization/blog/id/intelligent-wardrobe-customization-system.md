---
id: intelligent-wardrobe-customization-system.md
title: >-
  Membangun Sistem Kustomisasi Lemari Pakaian Cerdas yang Didukung oleh Basis
  Data Vektor Milvus
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  Menggunakan teknologi pencarian kemiripan untuk membuka potensi data yang
  tidak terstruktur, bahkan seperti lemari pakaian dan komponennya!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>gambar sampul</span> </span></p>
<p>Jika Anda mencari lemari pakaian yang pas dengan kamar tidur atau kamar pas Anda, saya yakin kebanyakan orang akan memikirkan lemari pakaian yang dibuat sesuai ukuran. Namun, tidak semua orang memiliki anggaran sejauh itu. Lalu bagaimana dengan yang sudah jadi? Masalah dengan jenis lemari pakaian ini adalah kemungkinan besar tidak sesuai dengan harapan Anda karena tidak cukup fleksibel untuk memenuhi kebutuhan penyimpanan Anda yang unik. Ditambah lagi, saat mencari secara online, agak sulit untuk merangkum jenis lemari pakaian tertentu yang Anda cari dengan kata kunci. Sangat mungkin, kata kunci yang Anda ketik di kotak pencarian (misalnya Lemari pakaian dengan baki perhiasan) mungkin sangat berbeda dengan apa yang didefinisikan di mesin pencari (misalnya Lemari pakaian dengan <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">baki tarik dengan sisipan</a>).</p>
<p>Namun berkat teknologi yang muncul, ada solusinya! IKEA, konglomerat ritel furnitur, menyediakan alat desain populer lemari <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">pakaian PAX</a> yang memungkinkan pengguna untuk memilih dari sejumlah lemari pakaian yang sudah jadi dan menyesuaikan warna, ukuran, dan desain interior lemari pakaian. Apakah Anda membutuhkan ruang gantung, beberapa rak atau laci internal, sistem kustomisasi lemari pakaian yang cerdas ini selalu dapat memenuhi kebutuhan Anda.</p>
<p>Untuk menemukan atau membangun lemari pakaian ideal Anda dengan menggunakan sistem desain lemari pakaian pintar ini, Anda perlu</p>
<ol>
<li>Tentukan persyaratan dasar - bentuk (normal, berbentuk L, atau berbentuk U), panjang dan kedalaman lemari pakaian.</li>
<li>Tentukan kebutuhan penyimpanan Anda dan pengaturan interior lemari pakaian (mis. Ruang gantung, rak celana yang bisa ditarik, dll.).</li>
<li>Tambahkan atau hapus bagian dari lemari pakaian seperti laci atau rak.</li>
</ol>
<p>Kemudian desain Anda selesai. Sederhana dan mudah!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>sistem pax</span> </span></p>
<p>Komponen yang sangat penting yang memungkinkan sistem desain lemari pakaian adalah <a href="https://zilliz.com/learn/what-is-vector-database">database vektor</a>. Oleh karena itu, artikel ini bertujuan untuk memperkenalkan alur kerja dan solusi pencarian kemiripan yang digunakan untuk membangun sistem kustomisasi lemari pakaian cerdas yang didukung oleh pencarian kemiripan vektor.</p>
<p>Langsung ke:</p>
<ul>
<li><a href="#System-overview">Gambaran umum sistem</a></li>
<li><a href="#Data-flow">Aliran data</a></li>
<li><a href="#System-demo">Demo sistem</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">Gambaran Umum Sistem<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk menghadirkan alat kustomisasi lemari pakaian yang cerdas, pertama-tama kita perlu mendefinisikan logika bisnis dan memahami atribut barang dan perjalanan pengguna. Lemari pakaian beserta komponennya seperti laci, baki, rak, semuanya merupakan data yang tidak terstruktur. Oleh karena itu, langkah kedua adalah memanfaatkan algoritme dan aturan AI, pengetahuan sebelumnya, deskripsi barang, dan banyak lagi, untuk mengubah data tidak terstruktur tersebut menjadi jenis data yang dapat dipahami oleh komputer - vektor!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>Gambaran umum alat kustomisasi</span> </span></p>
<p>Dengan vektor yang dihasilkan, kita membutuhkan database vektor dan mesin pencari yang kuat untuk memprosesnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>arsitektur alat</span> </span></p>
<p>Alat kustomisasi memanfaatkan beberapa mesin pencari dan basis data yang paling populer: Elasticsearch, <a href="https://milvus.io/">Milvus</a>, dan PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">Mengapa Milvus?</h3><p>Komponen lemari pakaian mengandung informasi yang sangat kompleks, seperti warna, bentuk, dan pengaturan interior, dll. Namun, cara tradisional untuk menyimpan data lemari pakaian dalam basis data relasional masih jauh dari cukup. Cara yang populer adalah dengan menggunakan teknik penyematan untuk mengubah lemari pakaian menjadi vektor. Oleh karena itu, kita perlu mencari jenis database baru yang dirancang khusus untuk penyimpanan vektor dan pencarian kemiripan. Setelah menyelidiki beberapa solusi populer, basis data vektor <a href="https://github.com/milvus-io/milvus">Milvus</a> dipilih karena kinerjanya yang sangat baik, stabilitas, kompatibilitas, dan kemudahan penggunaannya. Bagan di bawah ini adalah perbandingan beberapa solusi pencarian vektor yang populer.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>perbandingan solusi</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">Alur kerja sistem</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>Alur kerja sistem</span> </span></p>
<p>Elasticsearch digunakan untuk penyaringan kasar berdasarkan ukuran lemari pakaian, warna, dll. Kemudian hasil yang disaring melalui Milvus database vektor untuk pencarian kemiripan dan hasilnya diberi peringkat berdasarkan jarak/kemiripan dengan vektor kueri. Akhirnya, hasilnya dikonsolidasikan dan disempurnakan lebih lanjut berdasarkan wawasan bisnis.</p>
<h2 id="Data-flow" class="common-anchor-header">Aliran data<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Sistem kustomisasi lemari pakaian sangat mirip dengan mesin pencari tradisional dan sistem pemberi rekomendasi. Ini terdiri dari tiga bagian:</p>
<ul>
<li>Persiapan data offline termasuk definisi dan pembuatan data.</li>
<li>Layanan online termasuk pemanggilan kembali dan pemeringkatan.</li>
<li>Pemrosesan pasca data berdasarkan logika bisnis.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>Aliran data</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">Aliran data offline</h3><ol>
<li>Mendefinisikan data menggunakan wawasan bisnis.</li>
<li>Gunakan pengetahuan sebelumnya untuk menentukan cara menggabungkan berbagai komponen dan membentuknya menjadi sebuah lemari pakaian.</li>
<li>Mengenali label fitur dari lemari pakaian dan mengkodekan fitur ke dalam data Elasticsearch di file <code translate="no">.json</code>.</li>
<li>Siapkan data penarikan dengan mengkodekan data yang tidak terstruktur ke dalam vektor.</li>
<li>Gunakan Milvus database vektor untuk mengurutkan hasil pemanggilan yang diperoleh pada langkah sebelumnya.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>Aliran data offline</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">Aliran data online</h3><ol>
<li>Menerima permintaan kueri dari pengguna dan mengumpulkan profil pengguna.</li>
<li>Pahami permintaan pengguna dengan mengidentifikasi kebutuhan mereka akan lemari pakaian.</li>
<li>Pencarian kasar menggunakan Elasticsearch.</li>
<li>Beri skor dan rangking hasil yang diperoleh dari pencarian kasar berdasarkan perhitungan kemiripan vektor di Milvus.</li>
<li>Memproses dan mengatur hasil pada platform back-end untuk menghasilkan hasil akhir.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>Aliran data online</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">Pasca-pemrosesan data</h3><p>Logika bisnis bervariasi di antara setiap perusahaan. Anda dapat menambahkan sentuhan akhir pada hasil dengan menerapkan logika bisnis perusahaan Anda.</p>
<h2 id="System-demo" class="common-anchor-header">Demo sistem<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang mari kita lihat bagaimana sistem yang kita bangun bekerja.</p>
<p>Antarmuka pengguna (UI) menampilkan kemungkinan kombinasi yang berbeda dari komponen-komponen lemari pakaian.</p>
<p>Setiap komponen diberi label berdasarkan fiturnya (ukuran, warna, dll.) dan disimpan dalam Elasticsearch (ES). Ketika menyimpan label di ES, ada empat bidang data utama yang harus diisi: ID, tag, jalur penyimpanan, dan bidang pendukung lainnya. ES dan data berlabel digunakan untuk pemanggilan kembali granular dan penyaringan atribut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>Kemudian algoritme AI yang berbeda digunakan untuk mengkodekan lemari pakaian ke dalam satu set vektor. Kumpulan vektor tersebut disimpan di Milvus untuk pencarian dan pemeringkatan kemiripan. Langkah ini memberikan hasil yang lebih halus dan akurat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch, Milvus, dan komponen sistem lainnya secara keseluruhan membentuk platform desain kustomisasi secara keseluruhan. Untuk mengingat kembali, bahasa khusus domain (DSL) di Elasticsearch dan Milvus adalah sebagai berikut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Mencari sumber daya lainnya?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Pelajari bagaimana basis data vektor Milvus dapat mendukung lebih banyak aplikasi AI:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">Bagaimana Platform Video Pendek Likee Menghapus Video Duplikat dengan Milvus</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - Pendeteksi Penipuan Foto Berdasarkan Milvus</a></li>
</ul>
