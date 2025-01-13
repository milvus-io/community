---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: >-
  Merancang RAG Multi-Tenancy dengan Milvus: Praktik Terbaik untuk Basis
  Pengetahuan Perusahaan yang Dapat Diskalakan
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Selama beberapa tahun terakhir, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-Augmented Generation (RAG</a> ) telah muncul sebagai solusi tepercaya bagi organisasi besar untuk meningkatkan aplikasi mereka <a href="https://zilliz.com/glossary/large-language-models-(llms)">yang didukung LLM</a>, terutama yang memiliki pengguna yang beragam. Seiring dengan pertumbuhan aplikasi tersebut, penerapan kerangka kerja multi-tenancy menjadi sangat penting. <strong>Multi-tenancy</strong> menyediakan akses yang aman dan terisolasi ke data untuk kelompok pengguna yang berbeda, memastikan kepercayaan pengguna, memenuhi standar peraturan, dan meningkatkan efisiensi operasional.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> adalah <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> sumber terbuka yang dibuat untuk menangani <a href="https://zilliz.com/glossary/vector-embeddings">data vektor</a> berdimensi tinggi. Milvus adalah komponen infrastruktur yang sangat diperlukan dari RAG, yang menyimpan dan mengambil informasi kontekstual untuk LLM dari sumber eksternal. Milvus menawarkan <a href="https://milvus.io/docs/multi_tenancy.md">strategi multi-tenancy yang fleksibel</a> untuk berbagai kebutuhan, termasuk <strong>multi-tenancy tingkat basis data, tingkat koleksi, dan tingkat partisi</strong>.</p>
<p>Dalam artikel ini, kami akan membahasnya:</p>
<ul>
<li><p>Apa itu Multi-Tenancy dan Mengapa Itu Penting</p></li>
<li><p>Strategi Multi-Tenancy di Milvus</p></li>
<li><p>Contoh: Strategi Multi-Tenancy untuk Basis Pengetahuan Perusahaan yang Didukung RAG</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">Apa itu Multi-Tenancy dan Mengapa Itu Penting<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>Multi-Tenancy</strong></a> adalah arsitektur di mana beberapa pelanggan atau tim, yang dikenal sebagai &quot;<strong>penyewa</strong>&quot;, berbagi satu contoh aplikasi atau sistem. Setiap data dan konfigurasi penyewa terisolasi secara logis, sehingga menjamin privasi dan keamanan, sementara semua penyewa berbagi infrastruktur dasar yang sama.</p>
<p>Bayangkan sebuah platform SaaS yang menyediakan solusi berbasis pengetahuan untuk banyak perusahaan. Setiap perusahaan adalah penyewa.</p>
<ul>
<li><p>Penyewa A adalah organisasi layanan kesehatan yang menyimpan FAQ dan dokumen kepatuhan yang berhubungan dengan pasien.</p></li>
<li><p>Tenant B adalah perusahaan teknologi yang mengelola alur kerja pemecahan masalah TI internal.</p></li>
<li><p>Tenant C adalah bisnis ritel dengan FAQ layanan pelanggan untuk pengembalian produk.</p></li>
</ul>
<p>Setiap penyewa beroperasi di lingkungan yang sepenuhnya terisolasi, memastikan bahwa tidak ada data dari Penyewa A yang bocor ke sistem Penyewa B atau sebaliknya. Selain itu, alokasi sumber daya, kinerja kueri, dan keputusan penskalaan bersifat spesifik untuk setiap penyewa, memastikan kinerja tinggi terlepas dari lonjakan beban kerja di satu penyewa.</p>
<p>Multi-tenancy juga berfungsi untuk sistem yang melayani tim yang berbeda dalam organisasi yang sama. Bayangkan sebuah perusahaan besar yang menggunakan basis pengetahuan yang didukung RAG untuk melayani departemen internalnya, seperti SDM, Hukum, dan Pemasaran. Setiap <strong>departemen adalah penyewa</strong> dengan data dan sumber daya yang terisolasi dalam pengaturan ini.</p>
<p>Multi-tenancy menawarkan manfaat yang signifikan, termasuk <strong>efisiensi biaya, skalabilitas, dan keamanan data yang kuat</strong>. Dengan berbagi infrastruktur tunggal, penyedia layanan dapat mengurangi biaya overhead dan memastikan konsumsi sumber daya yang lebih efektif. Pendekatan ini juga mudah untuk diterapkan-penerimaan penyewa baru membutuhkan sumber daya yang jauh lebih sedikit daripada membuat instance terpisah untuk setiap penyewa, seperti pada model penyewaan tunggal. Yang terpenting, multi-tenancy menjaga keamanan data yang kuat dengan memastikan isolasi data yang ketat untuk setiap penyewa, dengan kontrol akses dan enkripsi yang melindungi informasi sensitif dari akses yang tidak sah. Selain itu, pembaruan, tambalan, dan fitur baru dapat diterapkan di semua penyewa secara bersamaan, menyederhanakan pemeliharaan sistem dan mengurangi beban administrator sambil memastikan bahwa standar keamanan dan kepatuhan ditegakkan secara konsisten.</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Strategi Multi-Penyewaan di Milvus<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk memahami bagaimana Milvus mendukung multi-tenancy, penting untuk melihat bagaimana Milvus mengatur data pengguna.</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Bagaimana Milvus Mengatur Data Pengguna</h3><p>Milvus menyusun data dalam tiga lapisan, mulai dari yang luas hingga terperinci: <a href="https://milvus.io/docs/manage_databases.md"><strong>Basis Data</strong></a>, <a href="https://milvus.io/docs/manage-collections.md"><strong>Koleksi</strong></a>, dan <a href="https://milvus.io/docs/manage-partitions.md"><strong>Partisi/Kunci Partisi</strong></a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>Gambar- Bagaimana Milvus mengatur data pengguna .png</span> </span></p>
<p><em>Gambar: Bagaimana Milvus mengatur data pengguna</em></p>
<ul>
<li><p><strong>Basis data</strong>: Ini bertindak sebagai sebuah wadah logis, mirip dengan basis data pada sistem relasional tradisional.</p></li>
<li><p><strong>Koleksi</strong>: Mirip dengan tabel dalam database, koleksi mengatur data ke dalam kelompok-kelompok yang dapat dikelola.</p></li>
<li><p><strong>Partisi/Kunci Partisi</strong>: Di dalam sebuah koleksi, data dapat disegmentasi lebih lanjut oleh <strong>Partisi</strong>. Dengan menggunakan <strong>Kunci Partisi</strong>, data dengan kunci yang sama dikelompokkan bersama. Sebagai contoh, jika Anda menggunakan <strong>ID pengguna</strong> sebagai <strong>Kunci Partisi</strong>, semua data untuk pengguna tertentu akan disimpan dalam segmen logis yang sama. Hal ini memudahkan untuk mengambil data yang terkait dengan masing-masing pengguna.</p></li>
</ul>
<p>Ketika Anda berpindah dari <strong>Database</strong> ke <strong>Collection</strong> ke <strong>Partition Key</strong>, perincian organisasi data menjadi semakin halus.</p>
<p>Untuk memastikan keamanan data yang lebih kuat dan kontrol akses yang tepat, Milvus juga menyediakan <a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>Role-Based Access Control (RBAC)</strong></a> yang kuat, yang memungkinkan administrator untuk menentukan izin khusus untuk setiap pengguna. Hanya pengguna yang memiliki izin yang dapat mengakses data tertentu.</p>
<p>Milvus mendukung <a href="https://milvus.io/docs/multi_tenancy.md">berbagai strategi</a> untuk mengimplementasikan multi-tenancy, menawarkan fleksibilitas berdasarkan kebutuhan aplikasi Anda: <strong>multi-tenancy tingkat basis data, tingkat koleksi, dan tingkat partisi</strong>.</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">Multi-tenancy Tingkat Basis Data</h3><p>Dengan pendekatan multi-tenancy tingkat basis data, setiap penyewa diberikan basis data mereka sendiri dalam cluster Milvus yang sama. Strategi ini memberikan isolasi data yang kuat dan memastikan kinerja pencarian yang optimal. Namun, hal ini dapat menyebabkan pemanfaatan sumber daya yang tidak efisien jika penyewa tertentu tetap tidak aktif.</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">Multi-Penyewaan Tingkat Koleksi</h3><p>Di sini, dalam multi-tenancy tingkat koleksi, kita dapat mengatur data untuk penyewa dengan dua cara.</p>
<ul>
<li><p><strong>Satu Koleksi untuk Semua Penyewa</strong>: Semua penyewa berbagi satu koleksi, dengan bidang khusus penyewa yang digunakan untuk penyaringan. Meskipun mudah untuk diterapkan, pendekatan ini dapat mengalami hambatan kinerja ketika jumlah penyewa meningkat.</p></li>
<li><p><strong>Satu Koleksi per Penyewa</strong>: Setiap penyewa dapat memiliki koleksi khusus, meningkatkan isolasi dan kinerja tetapi membutuhkan lebih banyak sumber daya. Pengaturan ini dapat menghadapi keterbatasan skalabilitas jika jumlah penyewa melebihi kapasitas koleksi Milvus.</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">Penyewaan Multi-tingkat Partisi</h3><p>Partition-Level Multi-Tenancy berfokus pada pengaturan penyewa dalam satu koleksi. Di sini, kami juga memiliki dua cara untuk mengatur data penyewa.</p>
<ul>
<li><p><strong>Satu Partisi per Penyewa</strong>: Penyewa berbagi koleksi, tetapi data mereka disimpan dalam partisi terpisah. Kita dapat mengisolasi data dengan memberikan setiap penyewa sebuah partisi khusus, menyeimbangkan isolasi dan kinerja pencarian. Namun, pendekatan ini dibatasi oleh batas maksimum partisi Milvus.</p></li>
<li><p><strong>Multi-Penyewaan Berbasis Kunci Partisi</strong>: Ini adalah opsi yang lebih terukur di mana satu koleksi menggunakan kunci partisi untuk membedakan penyewa. Metode ini menyederhanakan manajemen sumber daya dan mendukung skalabilitas yang lebih tinggi, tetapi tidak mendukung penyisipan data secara massal.</p></li>
</ul>
<p>Tabel di bawah ini merangkum perbedaan utama antara pendekatan multi-penyewaan utama.</p>
<table>
<thead>
<tr><th><strong>Perincian</strong></th><th><strong>Tingkat basis data</strong></th><th><strong>Tingkat koleksi</strong></th><th><strong>Tingkat Kunci Partisi</strong></th></tr>
</thead>
<tbody>
<tr><td>Penyewa Maksimal yang Didukung</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>Fleksibilitas Organisasi Data</td><td>Tinggi: Pengguna dapat menentukan beberapa koleksi dengan skema khusus.</td><td>Sedang: Pengguna terbatas pada satu koleksi dengan skema khusus.</td><td>Rendah: Semua pengguna berbagi koleksi, membutuhkan skema yang konsisten.</td></tr>
<tr><td>Biaya per Pengguna</td><td>Tinggi</td><td>Sedang</td><td>Rendah</td></tr>
<tr><td>Isolasi Sumber Daya Fisik</td><td>Ya</td><td>Ya</td><td>Tidak</td></tr>
<tr><td>RBAC</td><td>Ya</td><td>Ya</td><td>Tidak</td></tr>
<tr><td>Performa Pencarian</td><td>Kuat</td><td>Sedang</td><td>Kuat</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">Contoh: Strategi Multi-Penyewaan untuk Basis Pengetahuan Perusahaan yang Didukung RAG<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Saat merancang strategi multi-tenancy untuk sistem RAG, penting untuk menyelaraskan pendekatan Anda dengan kebutuhan spesifik bisnis dan penyewa Anda. Milvus menawarkan berbagai strategi multi-tenancy, dan memilih strategi yang tepat bergantung pada jumlah penyewa, kebutuhan mereka, dan tingkat isolasi data yang diperlukan. Berikut adalah panduan praktis untuk membuat keputusan ini, dengan menggunakan basis pengetahuan perusahaan yang didukung RAG sebagai contoh.</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">Memahami Struktur Penyewa Sebelum Memilih Strategi Multi-Penyewaan</h3><p>Basis pengetahuan perusahaan yang didukung RAG sering kali melayani sejumlah kecil penyewa. Penyewa ini biasanya merupakan unit bisnis independen seperti TI, Penjualan, Hukum, dan Pemasaran, yang masing-masing membutuhkan layanan basis pengetahuan yang berbeda. Sebagai contoh, Departemen SDM mengelola informasi karyawan yang sensitif seperti panduan orientasi dan kebijakan tunjangan, yang seharusnya bersifat rahasia dan hanya dapat diakses oleh personil SDM.</p>
<p>Dalam hal ini, setiap unit bisnis harus diperlakukan sebagai penyewa yang terpisah dan <strong>strategi multi-tenancy tingkat database</strong> sering kali merupakan yang paling sesuai. Dengan memberikan database khusus untuk setiap penyewa, organisasi dapat mencapai isolasi logis yang kuat, menyederhanakan manajemen dan meningkatkan keamanan. Penyiapan ini memberikan penyewa fleksibilitas yang signifikan-mereka dapat menentukan model data khusus dalam koleksi, membuat sebanyak mungkin koleksi yang dibutuhkan, dan secara mandiri mengelola kontrol akses untuk koleksi mereka.</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">Meningkatkan Keamanan dengan Isolasi Sumber Daya Fisik</h3><p>Dalam situasi di mana keamanan data sangat diprioritaskan, isolasi logis pada tingkat database mungkin tidak cukup. Sebagai contoh, beberapa unit bisnis mungkin menangani data yang sangat penting atau sangat sensitif, sehingga membutuhkan jaminan yang lebih kuat terhadap gangguan dari penyewa lain. Dalam kasus seperti itu, kita dapat menerapkan <a href="https://milvus.io/docs/resource_group.md">pendekatan isolasi fisik</a> di atas struktur multi-tenancy tingkat database.</p>
<p>Milvus memungkinkan kita untuk memetakan komponen logis, seperti database dan koleksi, ke sumber daya fisik. Metode ini memastikan bahwa aktivitas penyewa lain tidak berdampak pada operasi penting. Mari kita telusuri bagaimana pendekatan ini bekerja dalam praktiknya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>Gambar- Bagaimana Milvus mengelola sumber daya fisik.png</span> </span></p>
<p>Gambar: Bagaimana Milvus mengelola sumber daya fisik</p>
<p>Seperti yang ditunjukkan pada diagram di atas, ada tiga lapisan manajemen sumber daya di Milvus: <strong>Query Node</strong>, <strong>Resource Group</strong>, dan <strong>Database</strong>.</p>
<ul>
<li><p><strong>Query Node</strong>: Komponen yang memproses tugas-tugas kueri. Komponen ini berjalan pada mesin fisik atau kontainer (misalnya, pod di Kubernetes).</p></li>
<li><p><strong>Grup Sumber Daya</strong>: Kumpulan Node Kueri yang bertindak sebagai jembatan antara komponen logis (basis data dan koleksi) dan sumber daya fisik. Anda dapat mengalokasikan satu atau beberapa basis data atau koleksi ke satu Resource Group.</p></li>
</ul>
<p>Pada contoh yang ditunjukkan pada diagram di atas, ada tiga <strong>Database</strong> logis: X, Y, dan Z.</p>
<ul>
<li><p><strong>Database X</strong>: Berisi <strong>Koleksi A</strong>.</p></li>
<li><p><strong>Database Y</strong>: Berisi <strong>Koleksi B</strong> dan <strong>C</strong>.</p></li>
<li><p><strong>Database Z</strong>: Berisi <strong>Koleksi D</strong> dan <strong>E</strong>.</p></li>
</ul>
<p>Katakanlah <strong>Database X</strong> menyimpan basis pengetahuan penting yang tidak ingin terpengaruh oleh beban dari <strong>Database Y</strong> atau <strong>Database Z</strong>. Untuk memastikan isolasi data:</p>
<ul>
<li><p><strong>Database X</strong> diberikan <strong>Resource Group</strong> sendiri untuk menjamin bahwa basis pengetahuan kritisnya tidak terpengaruh oleh beban kerja dari database lain.</p></li>
<li><p><strong>Koleksi E</strong> juga dialokasikan ke <strong>Resource Group</strong> yang terpisah di dalam database induknya<strong>(Z)</strong>. Hal ini memberikan isolasi pada tingkat koleksi untuk data penting tertentu dalam database bersama.</p></li>
</ul>
<p>Sementara itu, koleksi yang tersisa di <strong>Database Y</strong> dan <strong>Z</strong> berbagi sumber daya fisik dari <strong>Resource Group 2</strong>.</p>
<p>Dengan memetakan komponen logis ke sumber daya fisik secara hati-hati, organisasi dapat mencapai arsitektur multi-tenancy yang fleksibel, terukur, dan aman yang disesuaikan dengan kebutuhan bisnis mereka yang spesifik.</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">Merancang Akses Tingkat Pengguna Akhir</h3><p>Setelah kita mempelajari praktik terbaik dalam memilih strategi multi-tenancy untuk RAG perusahaan, mari kita telusuri cara mendesain akses tingkat pengguna dalam sistem tersebut.</p>
<p>Dalam sistem ini, pengguna akhir biasanya berinteraksi dengan basis pengetahuan dalam mode hanya-baca melalui LLM. Namun, organisasi masih perlu melacak data tanya jawab yang dibuat oleh pengguna dan menautkannya ke pengguna tertentu untuk berbagai tujuan, seperti meningkatkan akurasi basis pengetahuan atau menawarkan layanan yang dipersonalisasi.</p>
<p>Ambil contoh meja layanan konsultasi pintar di rumah sakit. Pasien mungkin mengajukan pertanyaan seperti, "Apakah ada janji temu dengan dokter spesialis yang tersedia hari ini?" atau "Apakah ada persiapan khusus yang diperlukan untuk operasi saya yang akan datang?" Meskipun pertanyaan-pertanyaan ini tidak secara langsung berdampak pada basis pengetahuan, namun penting bagi rumah sakit untuk melacak interaksi semacam itu untuk meningkatkan layanan. Pasangan tanya jawab ini biasanya disimpan dalam basis data terpisah (tidak harus berupa basis data vektor) yang didedikasikan untuk mencatat interaksi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>Gambar- Arsitektur multi-tenancy untuk basis pengetahuan RAG perusahaan .png</span> </span></p>
<p><em>Gambar: Arsitektur multi-tenancy untuk basis pengetahuan RAG perusahaan</em></p>
<p>Diagram di atas menunjukkan arsitektur multi-tenancy dari sistem RAG perusahaan.</p>
<ul>
<li><p><strong>Administrator Sistem</strong> mengawasi sistem RAG, mengelola alokasi sumber daya, menetapkan basis data, memetakannya ke kelompok sumber daya, dan memastikan skalabilitas. Mereka menangani infrastruktur fisik, seperti yang ditunjukkan pada diagram, di mana setiap kelompok sumber daya (misalnya, Kelompok Sumber Daya 1, 2, dan 3) dipetakan ke server fisik (node kueri).</p></li>
<li><p><strong>Penyewa (pemilik dan pengembang</strong> basis data) mengelola basis pengetahuan, mengulanginya berdasarkan data Tanya Jawab yang dibuat pengguna, seperti yang ditunjukkan dalam diagram. Basis data yang berbeda (Basis Data X, Y, Z) berisi koleksi dengan konten basis pengetahuan yang berbeda (Koleksi A, B, dsb.).</p></li>
<li><p><strong>Pengguna Akhir</strong> berinteraksi dengan sistem dengan cara hanya-baca melalui LLM. Ketika mereka menanyakan sistem, pertanyaan mereka dicatat dalam tabel catatan Tanya Jawab yang terpisah (basis data yang terpisah), yang secara terus menerus memasukkan data yang berharga ke dalam sistem.</p></li>
</ul>
<p>Desain ini memastikan bahwa setiap lapisan proses - mulai dari interaksi pengguna hingga administrasi sistem - berjalan dengan lancar, membantu organisasi membangun basis pengetahuan yang kuat dan terus meningkat.</p>
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
    </button></h2><p>Dalam blog ini, kami telah mengeksplorasi bagaimana kerangka kerja <a href="https://milvus.io/docs/multi_tenancy.md"><strong>multi-tenancy</strong></a> memainkan peran penting dalam skalabilitas, keamanan, dan kinerja basis pengetahuan yang didukung RAG. Dengan mengisolasi data dan sumber daya untuk penyewa yang berbeda, bisnis dapat memastikan privasi, kepatuhan terhadap peraturan, dan alokasi sumber daya yang dioptimalkan di seluruh infrastruktur bersama. <a href="https://milvus.io/docs/overview.md">Milvus</a>, dengan strategi multi-tenancy yang fleksibel, memungkinkan bisnis untuk memilih tingkat isolasi data yang tepat - dari tingkat basis data hingga tingkat partisi - tergantung pada kebutuhan spesifik mereka. Memilih pendekatan multi-tenancy yang tepat memastikan perusahaan dapat memberikan layanan yang disesuaikan untuk penyewa, bahkan ketika berurusan dengan data dan beban kerja yang beragam.</p>
<p>Dengan mengikuti praktik terbaik yang diuraikan di sini, perusahaan dapat secara efektif merancang dan mengelola sistem RAG multi-tenancy yang tidak hanya memberikan pengalaman pengguna yang unggul, tetapi juga meningkatkan skala dengan mudah seiring dengan pertumbuhan kebutuhan bisnis. Arsitektur Milvus memastikan bahwa perusahaan dapat mempertahankan tingkat isolasi, keamanan, dan kinerja yang tinggi, sehingga menjadikannya komponen penting dalam membangun basis pengetahuan bertenaga RAG tingkat perusahaan.</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">Nantikan Lebih Banyak Wawasan tentang Multi-Tenancy RAG<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam blog ini, kami telah membahas bagaimana strategi multi-tenancy Milvus dirancang untuk mengelola penyewa, tetapi tidak untuk pengguna akhir di dalam penyewa tersebut. Interaksi pengguna akhir biasanya terjadi pada lapisan aplikasi, sementara database vektor itu sendiri tetap tidak mengetahui pengguna tersebut.</p>
<p>Anda mungkin bertanya-tanya: <em>Jika saya ingin memberikan jawaban yang lebih tepat berdasarkan riwayat pertanyaan setiap pengguna akhir, bukankah Milvus perlu mempertahankan konteks tanya jawab yang dipersonalisasi untuk setiap pengguna?</em></p>
<p>Itu adalah pertanyaan yang bagus, dan jawabannya sangat bergantung pada kasus penggunaan. Sebagai contoh, dalam layanan konsultasi sesuai permintaan, pertanyaan bersifat acak, dan fokus utamanya adalah pada kualitas basis pengetahuan daripada melacak konteks historis pengguna.</p>
<p>Namun, dalam kasus lain, sistem RAG harus sadar konteks. Ketika hal ini diperlukan, Milvus perlu berkolaborasi dengan lapisan aplikasi untuk mempertahankan memori yang dipersonalisasi dari setiap konteks pengguna. Desain ini sangat penting untuk aplikasi dengan pengguna akhir yang sangat besar, yang akan kita bahas secara lebih rinci di posting saya berikutnya. Nantikan terus artikel saya selanjutnya!</p>
