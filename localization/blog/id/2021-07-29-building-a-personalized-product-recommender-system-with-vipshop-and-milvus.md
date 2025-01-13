---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: Arsitektur Keseluruhan
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: >-
  Milvus memudahkan untuk memberikan layanan rekomendasi yang dipersonalisasi
  kepada pengguna.
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>Membangun Sistem Rekomendasi Produk yang Dipersonalisasi dengan Vipshop dan Milvus</custom-h1><p>Dengan pertumbuhan skala data Internet yang eksplosif, jumlah produk serta kategori dalam platform e-commerce utama saat ini meningkat di satu sisi, kesulitan bagi pengguna untuk menemukan produk yang mereka butuhkan melonjak di sisi lain.</p>
<p><a href="https://www.vip.com/">Vipshop</a> adalah peritel diskon online terkemuka untuk merek-merek di Tiongkok. Perusahaan menawarkan produk bermerek berkualitas tinggi dan populer kepada konsumen di seluruh China dengan diskon yang signifikan dari harga eceran. Untuk mengoptimalkan pengalaman berbelanja bagi pelanggan mereka, perusahaan memutuskan untuk membangun sistem rekomendasi pencarian yang dipersonalisasi berdasarkan kata kunci kueri pengguna dan potret pengguna.</p>
<p>Fungsi inti dari sistem rekomendasi pencarian e-commerce adalah untuk mengambil produk yang sesuai dari sejumlah besar produk dan menampilkannya kepada pengguna sesuai dengan maksud dan preferensi pencarian mereka. Dalam proses ini, sistem perlu menghitung kemiripan antara produk dan maksud &amp; preferensi pencarian pengguna, dan merekomendasikan produk TopK dengan kemiripan tertinggi kepada pengguna.</p>
<p>Data seperti informasi produk, maksud pencarian pengguna, dan preferensi pengguna adalah data yang tidak terstruktur. Kami mencoba menghitung kemiripan data tersebut menggunakan CosineSimilarity (7.x) dari mesin pencari Elasticsearch (ES), tetapi pendekatan ini memiliki beberapa kekurangan.</p>
<ul>
<li><p>Waktu respons komputasi yang lama - latensi rata-rata untuk mengambil hasil TopK dari jutaan item adalah sekitar 300 ms.</p></li>
<li><p>Biaya pemeliharaan yang tinggi untuk indeks ES - kumpulan indeks yang sama digunakan untuk vektor fitur komoditas dan data terkait lainnya, yang hampir tidak memfasilitasi konstruksi indeks, tetapi menghasilkan data dalam jumlah besar.</p></li>
</ul>
<p>Kami mencoba mengembangkan plug-in hash sensitif lokal kami sendiri untuk mempercepat penghitungan CosineSimilarity ES. Meskipun kinerja dan throughput meningkat secara signifikan setelah akselerasi, latensi 100+ ms masih sulit untuk memenuhi persyaratan pengambilan produk online yang sebenarnya.</p>
<p>Setelah melakukan penelitian menyeluruh, kami memutuskan untuk menggunakan Milvus, database vektor open source, yang diuntungkan dengan dukungan untuk penyebaran terdistribusi, SDK multi-bahasa, pemisahan baca/tulis, dll. Dibandingkan dengan Faiss mandiri yang biasa digunakan.</p>
<p>Dengan menggunakan berbagai model pembelajaran mendalam, kami mengubah data tak terstruktur yang sangat besar menjadi vektor fitur, dan mengimpor vektor tersebut ke dalam Milvus. Dengan kinerja Milvus yang luar biasa, sistem rekomendasi pencarian e-commerce kami dapat secara efisien meminta vektor TopK yang mirip dengan vektor target.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Arsitektur Keseluruhan<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>![Arsitektur](https://assets.zilliz.com/1_01551e7b2b.jpg &quot;Arsitektur.) Seperti yang ditunjukkan pada diagram, arsitektur keseluruhan sistem terdiri dari dua bagian utama.</p>
<ul>
<li><p>Proses penulisan: vektor fitur item (selanjutnya disebut sebagai vektor item) yang dihasilkan oleh model deep learning dinormalisasi dan ditulis ke dalam MySQL. MySQL kemudian membaca vektor fitur item yang telah diproses menggunakan alat sinkronisasi data (ETL) dan mengimpornya ke dalam basis data vektor Milvus.</p></li>
<li><p>Proses pembacaan: Layanan pencarian mendapatkan vektor fitur preferensi pengguna (selanjutnya disebut sebagai vektor pengguna) berdasarkan kata kunci kueri pengguna dan potret pengguna, menanyakan vektor yang serupa di Milvus dan memanggil vektor item TopK.</p></li>
</ul>
<p>Milvus mendukung pembaruan data bertahap dan pembaruan seluruh data. Setiap pembaruan bertahap harus menghapus vektor item yang ada dan memasukkan vektor item baru, yang berarti bahwa setiap koleksi yang baru diperbarui akan diindeks ulang. Ini lebih sesuai dengan skenario dengan lebih banyak pembacaan dan lebih sedikit penulisan. Oleh karena itu, kami memilih metode pembaruan data secara keseluruhan. Selain itu, hanya perlu beberapa menit untuk menulis seluruh data dalam batch beberapa partisi, yang setara dengan pembaruan yang mendekati waktu nyata.</p>
<p>Milvus write node melakukan semua operasi penulisan, termasuk membuat koleksi data, membangun indeks, menyisipkan vektor, dll., dan menyediakan layanan kepada publik dengan nama domain tulis. Node baca Milvus melakukan semua operasi baca dan menyediakan layanan kepada publik dengan nama domain hanya-baca.</p>
<p>Meskipun versi Milvus saat ini tidak mendukung pergantian alias koleksi, kami memperkenalkan Redis untuk mengganti alias secara mulus di antara beberapa koleksi data secara keseluruhan.</p>
<p>Node baca hanya perlu membaca informasi metadata yang ada dan data vektor atau indeks dari sistem berkas terdistribusi MySQL, Milvus, dan GlusterFS, sehingga kemampuan baca dapat diperluas secara horizontal dengan menggunakan beberapa instance.</p>
<h2 id="Implementation-Details" class="common-anchor-header">Detail Implementasi<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">Pembaruan Data</h3><p>Layanan pembaruan data tidak hanya mencakup penulisan data vektor, tetapi juga deteksi volume data vektor, konstruksi indeks, pra-pemuatan indeks, kontrol alias, dll. Proses keseluruhannya adalah sebagai berikut. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>Proses</span> </span></p>
<ol>
<li><p>Asumsikan bahwa sebelum membangun seluruh data, CollectionA menyediakan layanan data kepada publik, dan seluruh data yang digunakan diarahkan ke CollectionA (<code translate="no">redis key1 = CollectionA</code>). Tujuan dari membangun seluruh data adalah untuk membuat koleksi baru CollectionB.</p></li>
<li><p>Pemeriksaan data komoditas - memeriksa nomor item dari data komoditas di tabel MySQL, membandingkan data komoditas dengan data yang ada di CollectionA. Alert dapat diatur sesuai dengan jumlah atau persentase. Jika jumlah (persentase) yang ditetapkan tidak tercapai, seluruh data tidak akan dibangun, dan itu akan dianggap sebagai kegagalan operasi pembangunan ini, memicu peringatan; setelah jumlah (persentase) yang ditetapkan tercapai, seluruh proses pembangunan data dimulai.</p></li>
<li><p>Mulai membangun seluruh data - inisialisasi alias seluruh data yang sedang dibangun, dan perbarui Redis. Setelah memperbarui, alias seluruh data yang sedang dibangun diarahkan ke CollectionB (<code translate="no">redis key2 = CollectionB</code>).</p></li>
<li><p>Buat seluruh koleksi baru - tentukan apakah CollectionB sudah ada. Jika ada, hapuslah sebelum membuat yang baru.</p></li>
<li><p>Data batch write-in - menghitung ID partisi dari setiap data komoditas dengan ID-nya sendiri menggunakan operasi modulo, dan menulis data ke beberapa partisi ke koleksi yang baru dibuat dalam batch.</p></li>
<li><p>Membangun dan memuat indeks - Membuat indeks (<code translate="no">createIndex()</code>) untuk koleksi baru. File indeks disimpan dalam server penyimpanan terdistribusi GlusterFS. Sistem secara otomatis mensimulasikan kueri pada koleksi baru dan melakukan pra-muat indeks untuk pemanasan kueri.</p></li>
<li><p>Pemeriksaan data koleksi - memeriksa jumlah item data dalam koleksi baru, membandingkan data dengan koleksi yang sudah ada, dan mengatur alarm berdasarkan jumlah dan persentase. Jika jumlah yang ditetapkan (persentase) tidak tercapai, koleksi tidak akan dialihkan dan proses pembangunan akan dianggap gagal, memicu peringatan.</p></li>
<li><p>Mengalihkan koleksi - Alias kontrol. Setelah memperbarui Redis, seluruh data alias yang sedang digunakan diarahkan ke CollectionB (<code translate="no">redis key1 = CollectionB</code>), Redis key2 asli dihapus, dan proses pembangunan selesai.</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">Pemanggilan Kembali Data</h3><p>Data partisi Milvus dipanggil beberapa kali untuk menghitung kemiripan antara vektor pengguna, yang diperoleh berdasarkan kata kunci kueri pengguna dan potret pengguna, dan vektor item, dan vektor item TopK dikembalikan setelah penggabungan. Skema alur kerja secara keseluruhan adalah sebagai berikut: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>alur kerja</span> </span>Tabel berikut mencantumkan layanan-layanan utama yang terlibat dalam proses ini. Dapat dilihat bahwa latensi rata-rata untuk memanggil kembali vektor TopK adalah sekitar 30 ms.</p>
<table>
<thead>
<tr><th><strong>Layanan</strong></th><th><strong>Peran</strong></th><th><strong>Parameter Masukan</strong></th><th><strong>Parameter keluaran</strong></th><th><strong>Latensi respons</strong></th></tr>
</thead>
<tbody>
<tr><td>Akuisisi vektor pengguna</td><td>Dapatkan vektor pengguna</td><td>info pengguna + kueri</td><td>vektor pengguna</td><td>10 ms</td></tr>
<tr><td>Pencarian Milvus</td><td>Hitung kemiripan vektor dan kembalikan hasil TopK</td><td>vektor pengguna</td><td>vektor item</td><td>10 ms</td></tr>
<tr><td>Logika Penjadwalan</td><td>Pemanggilan dan penggabungan hasil secara bersamaan</td><td>Vektor item yang dipanggil kembali multi-saluran dan skor kemiripan</td><td>Item TopK</td><td>10 ms</td></tr>
</tbody>
</table>
<p><strong>Proses implementasi:</strong></p>
<ol>
<li>Berdasarkan kata kunci kueri pengguna dan potret pengguna, vektor pengguna dihitung oleh model pembelajaran mendalam.</li>
<li>Dapatkan alias koleksi dari seluruh data yang sedang digunakan dari Redis currentInUseKeyRef dan dapatkan Milvus CollectionName. Proses ini adalah layanan sinkronisasi data, yaitu mengalihkan alias ke Redis setelah seluruh pembaruan data.</li>
<li>Milvus dipanggil secara bersamaan dan asinkron dengan vektor pengguna untuk mendapatkan data dari partisi berbeda dari koleksi yang sama, dan Milvus menghitung kemiripan antara vektor pengguna dan vektor item, dan mengembalikan vektor item TopK yang mirip di setiap partisi.</li>
<li>Gabungkan vektor item TopK yang dikembalikan dari setiap partisi, dan beri peringkat hasil dalam urutan terbalik dari jarak kemiripan, yang dihitung menggunakan produk dalam IP (semakin besar jarak antara vektor, semakin mirip mereka). Vektor item TopK akhir dikembalikan.</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">Melihat ke Depan<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>Saat ini, pencarian vektor berbasis Milvus dapat digunakan dengan mantap dalam pencarian skenario rekomendasi, dan kinerjanya yang tinggi memberikan kita lebih banyak ruang untuk bermain dalam dimensi model dan pemilihan algoritma.</p>
<p>Milvus akan memainkan peran penting sebagai middleware untuk lebih banyak skenario, termasuk mengingat kembali pencarian situs utama dan rekomendasi semua skenario.</p>
<p>Tiga fitur yang paling dinantikan dari Milvus di masa depan adalah sebagai berikut.</p>
<ul>
<li>Logika untuk pengalihan alias peralihan koleksi - mengoordinasikan peralihan di seluruh koleksi tanpa kontributor eksternal.</li>
<li>Mekanisme pemfilteran - Milvus v0.11.0 hanya mendukung mekanisme pemfilteran ES DSL dalam versi mandiri. Milvus 2.0 yang baru saja dirilis mendukung pemfilteran skalar, dan pemisahan baca/tulis.</li>
<li>Dukungan penyimpanan untuk Hadoop Distributed File System (HDFS) - Milvus v0.10.6 yang kami gunakan hanya mendukung antarmuka file POSIX, dan kami telah menggunakan GlusterFS dengan dukungan FUSE sebagai backend penyimpanan. Namun, HDFS adalah pilihan yang lebih baik dalam hal kinerja dan kemudahan penskalaan.</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">Pelajaran yang Dipetik dan Praktik Terbaik<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Untuk aplikasi yang mengutamakan operasi baca, penerapan pemisahan baca-tulis dapat secara signifikan meningkatkan daya pemrosesan dan meningkatkan kinerja.</li>
<li>Klien Milvus Java tidak memiliki mekanisme koneksi ulang karena klien Milvus yang digunakan oleh layanan pemanggilan berada di dalam memori. Kami harus membangun kumpulan koneksi kami sendiri untuk memastikan ketersediaan koneksi antara klien Java dan server melalui uji detak jantung.</li>
<li>Permintaan yang lambat kadang-kadang terjadi pada Milvus. Hal ini disebabkan oleh pemanasan yang tidak cukup dari koleksi baru. Dengan mensimulasikan kueri pada koleksi baru, file indeks dimuat ke dalam memori untuk mencapai pemanasan indeks.</li>
<li>nlist adalah parameter pembuatan indeks dan nprobe adalah parameter kueri. Anda perlu mendapatkan nilai ambang batas yang masuk akal sesuai dengan skenario bisnis Anda melalui eksperimen pengujian tekanan untuk menyeimbangkan kinerja pengambilan dan akurasi.</li>
<li>Untuk skenario data statis, akan lebih efisien untuk mengimpor semua data ke dalam koleksi terlebih dahulu dan membangun indeks kemudian.</li>
</ol>
