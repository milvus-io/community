---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  Pelajari tentang empat tingkat konsistensi - kuat, keusangan terbatas, sesi,
  dan akhirnya didukung dalam basis data vektor Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/JackLCL">Chenglong Li</a> dan diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Pernahkah Anda bertanya-tanya mengapa terkadang data yang telah Anda hapus dari database vektor Mlivus masih muncul di hasil pencarian?</p>
<p>Alasan yang sangat mungkin adalah bahwa Anda belum mengatur tingkat konsistensi yang sesuai untuk aplikasi Anda. Tingkat konsistensi dalam database vektor terdistribusi sangat penting karena menentukan pada titik mana penulisan data tertentu dapat dibaca oleh sistem.</p>
<p>Oleh karena itu, artikel ini bertujuan untuk mengungkap konsep konsistensi dan mempelajari tingkat konsistensi yang didukung oleh basis data vektor Milvus.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#What-is-consistency">Apa itu konsistensi</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Empat tingkat konsistensi dalam basis data vektor Milvus</a><ul>
<li><a href="#Strong">Kuat</a></li>
<li><a href="#Bounded-staleness">Ketidakkonsistenan yang terbatas</a></li>
<li><a href="#Session">Sesi</a></li>
<li><a href="#Eventual">Akhirnya</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">Apa itu konsistensi<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum memulai, kita perlu mengklarifikasi konotasi konsistensi dalam artikel ini karena kata "konsistensi" adalah istilah yang berlebihan dalam industri komputasi. Konsistensi dalam database terdistribusi secara khusus mengacu pada properti yang memastikan setiap node atau replika memiliki tampilan data yang sama ketika menulis atau membaca data pada waktu tertentu. Oleh karena itu, di sini kita berbicara tentang konsistensi seperti dalam <a href="https://en.wikipedia.org/wiki/CAP_theorem">teorema CAP</a>.</p>
<p>Untuk melayani bisnis online yang sangat besar di dunia modern, beberapa replika biasanya diadopsi. Sebagai contoh, raksasa e-commerce online Amazon mereplikasi pesanan atau data SKU-nya di beberapa pusat data, zona, atau bahkan negara untuk memastikan ketersediaan sistem yang tinggi jika terjadi kerusakan atau kegagalan sistem. Hal ini menjadi tantangan bagi sistem - konsistensi data di beberapa replika. Tanpa konsistensi, sangat mungkin item yang dihapus di keranjang Amazon Anda muncul kembali, menyebabkan pengalaman pengguna yang sangat buruk.</p>
<p>Oleh karena itu, kita membutuhkan tingkat konsistensi data yang berbeda untuk aplikasi yang berbeda. Dan untungnya, Milvus, database untuk AI, menawarkan fleksibilitas dalam tingkat konsistensi dan Anda dapat mengatur tingkat konsistensi yang paling sesuai dengan aplikasi Anda.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Konsistensi dalam basis data vektor Milvus</h3><p>Konsep tingkat konsistensi pertama kali diperkenalkan dengan dirilisnya Milvus 2.0. Versi 1.0 dari Milvus bukanlah basis data vektor terdistribusi sehingga kami tidak melibatkan tingkat konsistensi yang dapat disetel. Milvus 1.0 melakukan flush data setiap detik, yang berarti bahwa data baru akan segera terlihat setelah dimasukkan dan Milvus membaca tampilan data yang paling baru pada titik waktu yang tepat ketika pencarian kesamaan vektor atau permintaan kueri datang.</p>
<p>Namun, Milvus telah direfaktor dalam versi 2.0 dan <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0 merupakan database vektor terdistribusi</a> berdasarkan mekanisme pub-sub. Teorema <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a> menunjukkan bahwa sistem terdistribusi harus mengorbankan konsistensi, ketersediaan, dan latensi. Selain itu, tingkat konsistensi yang berbeda berfungsi untuk skenario yang berbeda. Oleh karena itu, konsep konsistensi diperkenalkan di <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a> dan mendukung penyetelan tingkat konsistensi.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Empat tingkat konsistensi dalam basis data vektor Milvus<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus mendukung empat tingkat konsistensi: kuat, keusangan terbatas, sesi, dan akhirnya. Dan pengguna Milvus dapat menentukan tingkat konsistensi ketika <a href="https://milvus.io/docs/v2.1.x/create_collection.md">membuat koleksi</a> atau melakukan <a href="https://milvus.io/docs/v2.1.x/search.md">pencarian</a> atau <a href="https://milvus.io/docs/v2.1.x/query.md">kueri</a> <a href="https://milvus.io/docs/v2.1.x/search.md">kemiripan vektor</a>. Bagian ini akan terus menjelaskan bagaimana keempat tingkat konsistensi ini berbeda dan skenario mana yang paling cocok untuk mereka.</p>
<h3 id="Strong" class="common-anchor-header">Kuat</h3><p>Strong adalah tingkat konsistensi tertinggi dan paling ketat. Ini memastikan bahwa pengguna dapat membaca data versi terbaru.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>Kuat</span> </span></p>
<p>Menurut teorema PACELC, jika tingkat konsistensi diatur ke kuat, latensi akan meningkat. Oleh karena itu, kami merekomendasikan untuk memilih konsistensi yang kuat selama pengujian fungsional untuk memastikan keakuratan hasil pengujian. Dan konsistensi yang kuat juga paling cocok untuk aplikasi yang memiliki permintaan ketat untuk konsistensi data dengan mengorbankan kecepatan pencarian. Contohnya adalah sistem keuangan online yang berurusan dengan pembayaran pesanan dan penagihan.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">Keusangan yang terbatas</h3><p>Bounded staleness, seperti namanya, memungkinkan ketidakkonsistenan data selama periode waktu tertentu. Namun, secara umum, data selalu konsisten secara global di luar periode waktu tersebut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>Bounded_staleness</span> </span></p>
<p>Bounded staleness cocok untuk skenario yang perlu mengontrol latensi pencarian dan dapat menerima ketidaktampakan data secara sporadis. Misalnya, dalam sistem pemberi rekomendasi seperti mesin rekomendasi video, ketidaktampakan data sesekali memiliki dampak yang sangat kecil pada tingkat penarikan keseluruhan, tetapi dapat secara signifikan meningkatkan kinerja sistem pemberi rekomendasi. Contohnya adalah aplikasi untuk melacak status pesanan online Anda.</p>
<h3 id="Session" class="common-anchor-header">Sesi</h3><p>Session memastikan bahwa semua data yang ditulis dapat langsung dirasakan saat dibaca selama sesi yang sama. Dengan kata lain, ketika Anda menulis data melalui satu klien, data yang baru dimasukkan langsung dapat dicari.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>Sesi</span> </span></p>
<p>Kami merekomendasikan untuk memilih session sebagai tingkat konsistensi untuk skenario-skenario di mana permintaan konsistensi data dalam sesi yang sama sangat tinggi. Contohnya adalah menghapus data entri buku dari sistem perpustakaan, dan setelah konfirmasi penghapusan dan me-refresh halaman (sesi yang berbeda), buku tersebut seharusnya tidak lagi terlihat dalam hasil pencarian.</p>
<h3 id="Eventual" class="common-anchor-header">Akhirnya</h3><p>Tidak ada jaminan urutan pembacaan dan penulisan, dan replika pada akhirnya akan menyatu pada kondisi yang sama karena tidak ada operasi penulisan lebih lanjut yang dilakukan. Di bawah konsistensi akhirnya, replika mulai bekerja pada permintaan baca dengan nilai terbaru yang diperbarui. Konsistensi akhirnya adalah level terlemah di antara keempat level tersebut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>Akhirnya</span> </span></p>
<p>Namun, menurut teorema PACELC, latensi pencarian dapat sangat dipersingkat dengan mengorbankan konsistensi. Oleh karena itu, konsistensi akhirnya paling cocok untuk skenario yang tidak memiliki permintaan tinggi untuk konsistensi data tetapi membutuhkan kinerja pencarian yang sangat cepat. Contohnya adalah mengambil ulasan dan peringkat produk Amazon dengan konsistensi akhir.</p>
<h2 id="Endnote" class="common-anchor-header">Catatan akhir<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>Jadi, kembali ke pertanyaan yang diajukan di awal artikel ini, data yang dihapus masih dikembalikan sebagai hasil pencarian karena pengguna belum memilih tingkat konsistensi yang tepat. Nilai default untuk tingkat konsistensi adalah bounded staleness (<code translate="no">Bounded</code>) dalam database vektor Milvus. Oleh karena itu, data yang dibaca mungkin tertinggal dan Milvus mungkin membaca tampilan data sebelum Anda melakukan operasi hapus selama pencarian atau kueri kemiripan. Namun, masalah ini mudah diatasi. Yang perlu Anda lakukan adalah menyetel <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">tingkat konsistensi</a> ketika membuat koleksi atau melakukan pencarian atau kueri kemiripan vektor. Sederhana!</p>
<p>Dalam posting berikutnya, kami akan mengungkap mekanisme di balik dan menjelaskan bagaimana database vektor Milvus mencapai tingkat konsistensi yang berbeda. Tetap disini!</p>
<h2 id="Whats-next" class="common-anchor-header">Apa yang selanjutnya<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan rilis resmi Milvus 2.1, kami telah menyiapkan serangkaian blog yang memperkenalkan fitur-fitur baru. Baca lebih lanjut dalam seri blog ini:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cara Menggunakan Data String untuk Memberdayakan Aplikasi Pencarian Kemiripan Anda</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Menggunakan Milvus yang Disematkan untuk Menginstal dan Menjalankan Milvus secara Instan dengan Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Tingkatkan Throughput Pembacaan Basis Data Vektor Anda dengan Replika Dalam Memori</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus (Bagian II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Bagaimana Basis Data Vektor Milvus Memastikan Keamanan Data?</a></li>
</ul>
