---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Kelola Basis Data Vektor Milvus Anda dengan Kemudahan Sekali Klik
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - alat bantu GUI untuk Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar Sampul Binlog</span> </span></p>
<p>Draf oleh <a href="https://github.com/czhen-zilliz">Zhen Chen</a> dan transkreasi oleh <a href="https://github.com/LocoRichard">Lichen Wang</a>.</p>
<p style="font-size: 12px;color: #4c5a67">Klik <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">di sini</a> untuk melihat tulisan aslinya.</p> 
<p>Dalam menghadapi permintaan yang berkembang pesat untuk pemrosesan data yang tidak terstruktur, Milvus 2.0 menonjol. Ini adalah sistem basis data vektor berorientasi AI yang dirancang untuk skenario produksi besar-besaran. Terlepas dari semua SDK Milvus dan Milvus CLI, antarmuka baris perintah untuk Milvus, adakah alat yang memungkinkan pengguna untuk mengoperasikan Milvus secara lebih intuitif? Jawabannya adalah YA. Zilliz telah mengumumkan sebuah antarmuka pengguna grafis - Attu - khusus untuk Milvus. Pada artikel ini, kami ingin menunjukkan kepada Anda langkah demi langkah cara melakukan pencarian kemiripan vektor dengan Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>Pulau Attu</span> </span></p>
<p>Dibandingkan dengan Milvus CLI yang menghadirkan kesederhanaan penggunaan, Attu memiliki lebih banyak fitur:</p>
<ul>
<li>Penginstal untuk OS Windows, macOS, dan OS Linux;</li>
<li>GUI yang intuitif untuk penggunaan Milvus yang lebih mudah;</li>
<li>Cakupan fungsi utama Milvus;</li>
<li>Plugin untuk perluasan fungsi yang disesuaikan;</li>
<li>Informasi topologi sistem yang lengkap untuk memudahkan pemahaman dan administrasi instance Milvus.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">Instalasi<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Anda dapat menemukan rilis terbaru Attu di <a href="https://github.com/zilliztech/attu/releases">GitHub</a>. Attu menawarkan pemasang yang dapat dieksekusi untuk sistem operasi yang berbeda. Ini adalah proyek sumber terbuka dan menerima kontribusi dari semua orang.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>Instalasi</span> </span></p>
<p>Anda juga dapat menginstal Attu melalui Docker.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> <code translate="no">milvus server IP</code> adalah alamat IP lingkungan tempat Attu berjalan, dan adalah alamat IP lingkungan tempat Milvus berjalan.</p>
<p>Setelah berhasil menginstal Attu, Anda dapat memasukkan IP dan Port Milvus di antarmuka untuk memulai Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>Menghubungkan Milvus dengan Attu</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">Ikhtisar fitur<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>Halaman Ikhtisar</span> </span></p>
<p>Antarmuka Attu terdiri dari halaman <strong>Ikhtisar</strong>, halaman <strong>Koleksi</strong>, halaman <strong>Pencarian Vektor</strong>, dan halaman <strong>Tampilan Sistem</strong>, masing-masing sesuai dengan empat ikon pada panel navigasi sisi kiri.</p>
<p>Halaman <strong>Ikhtisar</strong> menunjukkan koleksi yang dimuat. Sementara halaman <strong>Koleksi</strong> mencantumkan semua koleksi dan menunjukkan apakah koleksi tersebut dimuat atau dirilis.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>Halaman Koleksi</span> </span></p>
<p>Halaman <strong>Pencarian Vektor</strong> dan <strong>Tampilan Sistem</strong> adalah plugin dari Attu. Konsep dan penggunaan plugin akan diperkenalkan di bagian akhir blog ini.</p>
<p>Anda dapat melakukan pencarian kemiripan vektor di halaman <strong>Pencarian Vektor</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>Halaman Pencarian Vektor</span> </span></p>
<p>Pada halaman <strong>System View</strong>, Anda dapat memeriksa struktur topologi Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>Halaman Tampilan Sistem</span> </span></p>
<p>Anda juga dapat memeriksa informasi rinci dari setiap node dengan mengklik node tersebut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>Tampilan simpul</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">Demonstrasi<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari jelajahi Attu dengan dataset uji coba.</p>
<p>Periksa <a href="https://github.com/zilliztech/attu/tree/main/examples">repositori GitHub</a> kami untuk dataset yang digunakan dalam pengujian berikut ini.</p>
<p>Pertama, buatlah koleksi bernama test dengan empat bidang berikut ini:</p>
<ul>
<li>Nama Bidang: id, bidang kunci utama</li>
<li>Nama Bidang: vektor, bidang vektor, vektor mengambang, Dimensi: 128</li>
<li>Nama Field: merek, bidang skalar, Int64</li>
<li>Nama Bidang: warna, bidang skalar, Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>Membuat koleksi</span> </span></p>
<p>Memuat koleksi untuk pencarian setelah berhasil dibuat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>Memuat koleksi</span> </span></p>
<p>Anda sekarang dapat memeriksa koleksi yang baru dibuat di halaman <strong>Ikhtisar.</strong> </p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>Memeriksa koleksi</span> </span></p>
<p>Mengimpor dataset pengujian ke dalam Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Mengimpor data</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Mengimpor data</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Mengimpor data</span> </span></p>
<p>Klik nama koleksi di halaman Ikhtisar atau Koleksi untuk masuk ke antarmuka kueri untuk memeriksa data yang diimpor.</p>
<p>Tambahkan filter, tentukan ekspresi <code translate="no">id != 0</code>, klik <strong>Terapkan Filter</strong>, dan klik <strong>Kueri</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>Kueri data</span> </span></p>
<p>Anda akan menemukan kelima puluh entri entitas berhasil diimpor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>Hasil kueri</span> </span></p>
<p>Mari kita coba pencarian kemiripan vektor.</p>
<p>Salin satu vektor dari <code translate="no">search_vectors.csv</code> dan tempelkan di bidang <strong>Nilai Vektor</strong>. Pilih koleksi dan bidangnya. Klik <strong>Cari</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>Cari data</span> </span></p>
<p>Anda kemudian dapat memeriksa hasil pencarian. Tanpa menyusun skrip apa pun, Anda dapat mencari dengan Milvus dengan mudah.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>Hasil pencarian</span> </span></p>
<p>Terakhir, mari kita periksa halaman <strong>System View</strong>.</p>
<p>Dengan Metrics API yang dienkapsulasi dalam Milvus Node.js SDK, Anda dapat memeriksa status sistem, relasi node, dan status node.</p>
<p>Sebagai fitur eksklusif dari Attu, halaman System Overview menyertakan grafik topologi sistem yang lengkap. Dengan mengklik setiap node, Anda dapat memeriksa statusnya (refresh setiap 10 detik).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Grafik topologi node Milvus</span> </span></p>
<p>Klik pada setiap node untuk masuk ke <strong>Tampilan Daftar Node</strong>. Anda dapat memeriksa semua node anak dari node koordinat. Dengan mengurutkan, Anda dapat mengidentifikasi node dengan penggunaan CPU atau memori yang tinggi dengan cepat, dan menemukan masalah pada sistem.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Daftar simpul Milvus</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">Apa lagi<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti yang telah disebutkan sebelumnya, halaman <strong>Pencarian Vektor</strong> dan <strong>Tampilan Sistem</strong> adalah plugin dari Attu. Kami mendorong pengguna untuk mengembangkan plugin mereka sendiri di Attu agar sesuai dengan skenario aplikasi mereka. Di dalam kode sumber, ada folder yang dibuat khusus untuk kode plugin.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>Plugin</span> </span></p>
<p>Anda dapat merujuk ke salah satu plugin untuk mempelajari cara membuat plugin. Dengan mengatur file konfigurasi berikut, Anda dapat menambahkan plugin ke Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>Menambahkan plugin ke Attu</span> </span></p>
<p>Anda dapat melihat <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> dan <a href="https://milvus.io/docs/v2.0.x/attu.md">Dokumen Teknis Milvus</a> untuk instruksi terperinci.</p>
<p>Attu adalah proyek sumber terbuka. Semua kontribusi diterima. Anda juga dapat <a href="https://github.com/zilliztech/attu/issues">mengajukan masalah</a> jika Anda memiliki masalah dengan Attu.</p>
<p>Kami sangat berharap Attu dapat memberikan Anda pengalaman pengguna yang lebih baik dengan Milvus. Dan jika Anda menyukai Attu, atau memiliki masukan tentang penggunaannya, Anda dapat mengisi <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">Survei Pengguna Attu</a> untuk membantu kami mengoptimalkan Attu untuk pengalaman pengguna yang lebih baik.</p>
