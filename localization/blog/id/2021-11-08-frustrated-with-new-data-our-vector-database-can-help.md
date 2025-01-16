---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: Pendahuluan
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Desain dan Praktik Sistem Basis Data Vektor Tujuan Umum yang Berorientasi AI
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>Frustrasi dengan Data Baru? Basis Data Vektor kami dapat Membantu</custom-h1><p>Di era Big Data, teknologi dan aplikasi database apa yang akan menjadi pusat perhatian? Apa yang akan menjadi pengubah permainan berikutnya?</p>
<p>Dengan data tidak terstruktur yang mewakili sekitar 80-90% dari semua data yang tersimpan; apa yang harus kita lakukan dengan danau data yang terus bertambah ini? Orang mungkin berpikir untuk menggunakan metode analitik tradisional, tetapi metode ini gagal untuk mengeluarkan informasi yang berguna, jika memang ada informasi yang berguna. Untuk menjawab pertanyaan ini, "Three Musketeers" dari tim Penelitian dan Pengembangan Zilliz, Dr. Rentong Guo, Mr. Xiaofan Luan, dan Dr. Xiaomeng Yi, telah bersama-sama menulis artikel untuk membahas desain dan tantangan yang dihadapi ketika membangun sistem basis data vektor untuk keperluan umum.</p>
<p>Artikel ini telah dimuat dalam Programmer, sebuah jurnal yang diproduksi oleh CSDN, komunitas pengembang perangkat lunak terbesar di Tiongkok. Programmer edisi ini juga memuat artikel dari Jeffrey Ullman, penerima Turing Award 2020, Yann LeCun, penerima Turing Award 2018, Mark Porter, CTO MongoDB, Zhenkun Yang, pendiri OceanBase, Dongxu Huang, pendiri PingCAP, dan lain-lain.</p>
<p>Di bawah ini kami membagikan artikel lengkapnya kepada Anda:</p>
<custom-h1>Desain dan Praktik Sistem Basis Data Vektor Tujuan Umum Berorientasi AI</custom-h1><h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Aplikasi data modern dapat dengan mudah menangani data terstruktur, yang menyumbang sekitar 20% dari data saat ini. Di dalam kotak peralatannya terdapat sistem seperti basis data relasional, basis data NoSQL, dll. Sebaliknya, data tidak terstruktur, yang menyumbang sekitar 80% dari semua data, tidak memiliki sistem yang dapat diandalkan. Untuk mengatasi masalah ini, artikel ini akan membahas poin-poin penting yang dimiliki oleh analitik data tradisional dengan data tidak terstruktur dan lebih lanjut membahas arsitektur dan tantangan yang kita hadapi dalam membangun sistem database vektor tujuan umum kita sendiri.</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">Revolusi Data di era AI<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan pesatnya perkembangan teknologi 5G dan IoT, industri berusaha untuk melipatgandakan saluran pengumpulan data mereka dan memproyeksikan dunia nyata ke dalam ruang digital. Meskipun hal ini membawa beberapa tantangan yang luar biasa, hal ini juga membawa manfaat yang luar biasa bagi industri yang sedang berkembang. Salah satu tantangan berat ini adalah bagaimana mendapatkan wawasan yang lebih dalam tentang data baru yang masuk.</p>
<p>Menurut statistik IDC, lebih dari 40.000 exabyte data baru dihasilkan di seluruh dunia pada tahun 2020 saja. Dari jumlah tersebut, hanya 20% yang merupakan data terstruktur - data yang sangat teratur dan mudah diatur serta dianalisis melalui perhitungan numerik dan aljabar relasional. Sebaliknya, data yang tidak terstruktur (mengambil 80% sisanya) sangat kaya akan variasi jenis data, sehingga sulit untuk mengungkap semantik yang mendalam melalui metode analisis data tradisional.</p>
<p>Untungnya, kita mengalami evolusi yang cepat dan bersamaan dalam data tidak terstruktur dan AI, dengan AI memungkinkan kita untuk lebih memahami data melalui berbagai jenis jaringan saraf, seperti yang ditunjukkan pada Gambar 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>newdata1.jpeg</span> </span></p>
<p>Teknologi penyematan dengan cepat mendapatkan popularitas setelah debut Word2vec, dengan ide "sematkan segalanya" yang menjangkau semua sektor pembelajaran mesin. Hal ini menyebabkan munculnya dua lapisan data utama: lapisan data mentah dan lapisan data vektor. Lapisan data mentah terdiri dari data tidak terstruktur dan beberapa jenis data terstruktur; lapisan vektor adalah kumpulan penyematan yang mudah dianalisis yang berasal dari lapisan mentah yang melewati model pembelajaran mesin.</p>
<p>Jika dibandingkan dengan data mentah, data vektor memiliki beberapa keunggulan sebagai berikut:</p>
<ul>
<li>Vektor penyematan adalah jenis data yang abstrak, yang berarti kita dapat membangun sistem aljabar terpadu yang didedikasikan untuk mengurangi kompleksitas data yang tidak terstruktur.</li>
<li>Vektor penyisipan diekspresikan melalui vektor floating-point yang padat, sehingga memungkinkan aplikasi memanfaatkan SIMD. Dengan SIMD yang didukung oleh GPU dan hampir semua CPU modern, komputasi lintas vektor dapat mencapai kinerja tinggi dengan biaya yang relatif rendah.</li>
<li>Data vektor yang dikodekan melalui model pembelajaran mesin membutuhkan lebih sedikit ruang penyimpanan daripada data asli yang tidak terstruktur, sehingga memungkinkan hasil yang lebih tinggi.</li>
<li>Aritmatika juga dapat dilakukan di seluruh vektor penyisipan. Gambar 2 menunjukkan contoh pencocokan perkiraan semantik lintas-modal - gambar yang ditunjukkan pada gambar adalah hasil pencocokan penyematan kata dengan penyematan gambar.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>newdata2.png</span> </span></p>
<p>Seperti yang ditunjukkan pada Gambar 3, menggabungkan semantik gambar dan kata dapat dilakukan dengan penambahan dan pengurangan vektor sederhana di seluruh semantik yang sesuai.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>Terlepas dari fitur-fitur di atas, operator-operator ini mendukung pernyataan-pernyataan kueri yang lebih rumit dalam skenario-skenario praktis. Rekomendasi konten adalah contoh yang terkenal. Umumnya, sistem menyematkan konten dan preferensi tampilan pengguna. Selanjutnya, sistem mencocokkan preferensi pengguna yang disematkan dengan konten yang disematkan yang paling mirip melalui analisis kemiripan semantik, sehingga menghasilkan konten baru yang mirip dengan preferensi pengguna. Lapisan data vektor ini tidak hanya terbatas pada sistem rekomendasi, kasus penggunaan termasuk e-commerce, analisis malware, analisis data, verifikasi biometrik, analisis rumus kimia, keuangan, asuransi, dll.</p>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Data yang tidak terstruktur membutuhkan perangkat lunak dasar yang lengkap<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Perangkat lunak sistem berada di dasar semua aplikasi berorientasi data, tetapi perangkat lunak sistem data yang dibangun selama beberapa dekade terakhir, misalnya basis data, mesin analisis data, dll., dimaksudkan untuk menangani data terstruktur. Aplikasi data modern hampir secara eksklusif bergantung pada data yang tidak terstruktur dan tidak mendapat manfaat dari sistem manajemen basis data tradisional.</p>
<p>Untuk mengatasi masalah ini, kami telah mengembangkan dan menyediakan sumber terbuka sistem basis data vektor serba guna yang berorientasi pada AI yang diberi nama <em>Milvus</em> (Referensi No. 1~2). Jika dibandingkan dengan sistem basis data tradisional, Milvus bekerja pada lapisan data yang berbeda. Basis data tradisional, seperti basis data relasional, basis data KV, basis data teks, basis data gambar / video, dll... bekerja pada lapisan data mentah, sedangkan Milvus bekerja pada lapisan data vektor.</p>
<p>Pada bab-bab berikut, kita akan membahas fitur-fitur baru, desain arsitektur, dan tantangan teknis yang kami hadapi ketika membangun Milvus.</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">Atribut-atribut utama basis data vektor<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor menyimpan, mengambil, menganalisis vektor, dan, seperti halnya basis data lainnya, juga menyediakan antarmuka standar untuk operasi CRUD. Selain fitur-fitur "standar" ini, atribut-atribut yang tercantum di bawah ini juga merupakan kualitas penting untuk database vektor:</p>
<ul>
<li><strong>Dukungan untuk operator vektor efisiensi tinggi</strong></li>
</ul>
<p>Dukungan untuk operator vektor dalam mesin analisis berfokus pada dua tingkat. Pertama, database vektor harus mendukung berbagai jenis operator, misalnya, pencocokan kemiripan semantik dan aritmatika semantik yang disebutkan di atas. Selain itu, basis data vektor juga harus mendukung berbagai metrik kemiripan untuk perhitungan kemiripan yang mendasarinya. Kemiripan tersebut biasanya dikuantifikasi sebagai jarak spasial antara vektor, dengan metrik yang umum adalah jarak Euclidean, jarak kosinus, dan jarak inner product.</p>
<ul>
<li><strong>Dukungan untuk pengindeksan vektor</strong></li>
</ul>
<p>Dibandingkan dengan indeks berbasis B-tree atau LSM-tree di database tradisional, indeks vektor dimensi tinggi biasanya menghabiskan lebih banyak sumber daya komputasi. Kami merekomendasikan penggunaan algoritme pengelompokan dan indeks grafik, serta memberikan prioritas pada operasi matriks dan vektor, sehingga dapat memanfaatkan kemampuan akselerasi penghitungan vektor perangkat keras yang telah disebutkan sebelumnya.</p>
<ul>
<li><strong>Pengalaman pengguna yang konsisten di berbagai lingkungan penerapan</strong></li>
</ul>
<p>Basis data vektor biasanya dikembangkan dan digunakan di lingkungan yang berbeda. Pada tahap awal, ilmuwan data dan insinyur algoritme kebanyakan bekerja di laptop dan workstation mereka, karena mereka lebih memperhatikan efisiensi verifikasi dan kecepatan iterasi. Ketika verifikasi selesai, mereka dapat menerapkan database ukuran penuh pada cluster pribadi atau cloud. Oleh karena itu, sistem database vektor yang memenuhi syarat harus memberikan kinerja dan pengalaman pengguna yang konsisten di berbagai lingkungan penerapan.</p>
<ul>
<li><strong>Dukungan untuk pencarian hybrid</strong></li>
</ul>
<p>Aplikasi baru bermunculan seiring dengan semakin meluasnya penggunaan database vektor. Di antara semua permintaan ini, yang paling sering disebutkan adalah pencarian hybrid pada vektor dan jenis data lainnya. Beberapa contohnya adalah perkiraan pencarian tetangga terdekat (ANNS) setelah pemfilteran skalar, pemanggilan kembali multi-saluran dari pencarian teks lengkap dan pencarian vektor, dan pencarian hibrida data spatio-temporal dan data vektor. Tantangan tersebut menuntut skalabilitas elastis dan pengoptimalan kueri untuk memadukan mesin pencari vektor secara efektif dengan KV, teks, dan mesin pencari lainnya.</p>
<ul>
<li><strong>Arsitektur cloud-native</strong></li>
</ul>
<p>Volume data vektor menjamur dengan pertumbuhan pengumpulan data yang eksponensial. Data vektor berskala triliun dan berdimensi tinggi setara dengan ribuan TB penyimpanan, yang jauh melampaui batas satu node. Sebagai hasilnya, kemampuan perluasan horizontal adalah kemampuan utama untuk database vektor, dan harus memenuhi permintaan pengguna akan elastisitas dan kelincahan penyebaran. Selain itu, hal ini juga harus menurunkan kompleksitas operasi dan pemeliharaan sistem sekaligus meningkatkan kemampuan pengamatan dengan bantuan infrastruktur cloud. Beberapa dari kebutuhan ini datang dalam bentuk isolasi multi-penyewa, snapshot dan cadangan data, enkripsi data, dan visualisasi data, yang umum ditemukan pada basis data tradisional.</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">Arsitektur sistem basis data vektor<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 mengikuti prinsip-prinsip desain &quot;log sebagai data&quot;, &quot;pemrosesan batch dan aliran terpadu&quot;, &quot;tanpa kewarganegaraan&quot;, dan &quot;layanan mikro&quot;. Gambar 4 menggambarkan keseluruhan arsitektur Milvus 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>Log sebagai data</strong>: Milvus 2.0 tidak memelihara tabel fisik. Sebaliknya, Milvus 2.0 memastikan keandalan data melalui persistensi log dan snapshot log. Log broker (tulang punggung sistem) menyimpan log dan memisahkan komponen dan layanan melalui mekanisme publikasi-langganan log (pub-sub). Seperti yang ditunjukkan pada Gambar 5, log broker terdiri dari &quot;urutan log&quot; dan &quot;pelanggan log&quot;. Log sequence mencatat semua operasi yang mengubah status koleksi (setara dengan tabel dalam database relasional); log subscriber berlangganan ke log sequence untuk memperbarui data lokalnya dan menyediakan layanan dalam bentuk salinan hanya-baca. Mekanisme pub-sub juga menyediakan ruang untuk perluasan sistem dalam hal pengambilan data perubahan (CDC) dan penyebaran yang didistribusikan secara global.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>Pemrosesan batch dan streaming terpadu</strong>: Streaming log memungkinkan Milvus untuk memperbarui data secara real time, sehingga memastikan pengiriman waktu nyata. Selain itu, dengan mengubah kumpulan data menjadi snapshot log dan membangun indeks pada snapshot, Milvus mampu mencapai efisiensi kueri yang lebih tinggi. Selama kueri, Milvus menggabungkan hasil kueri dari data tambahan dan data historis untuk menjamin integralitas data yang dikembalikan. Desain seperti ini menyeimbangkan kinerja dan efisiensi waktu nyata dengan lebih baik, sehingga meringankan beban pemeliharaan sistem online dan offline dibandingkan dengan arsitektur Lambda tradisional.</p>
<p><strong>Tanpa kewarganegaraan</strong>: Infrastruktur cloud dan komponen penyimpanan sumber terbuka membebaskan Milvus dari penyimpanan data di dalam komponennya sendiri. Milvus 2.0 menyimpan data dengan tiga jenis penyimpanan: penyimpanan metadata, penyimpanan log, dan penyimpanan objek. Penyimpanan metadata tidak hanya menyimpan metadata, tetapi juga menangani penemuan layanan dan manajemen node. Penyimpanan log menjalankan persistensi data tambahan dan langganan publikasi data. Penyimpanan objek menyimpan snapshot log, indeks, dan beberapa hasil perhitungan menengah.</p>
<p><strong>Layanan mikro</strong>: Milvus mengikuti prinsip-prinsip pemilahan bidang data dan bidang kontrol, pemisahan baca/tulis, dan pemisahan tugas online/offline. Ini dikompromikan dari empat lapisan layanan: lapisan akses, lapisan koordinator, lapisan pekerja, dan lapisan penyimpanan. Lapisan-lapisan ini saling independen dalam hal penskalaan dan pemulihan bencana. Sebagai lapisan yang menghadap ke depan dan titik akhir pengguna, lapisan akses menangani koneksi klien, memvalidasi permintaan klien, dan menggabungkan hasil kueri. Sebagai &quot;otak&quot; sistem, lapisan koordinator mengambil tugas-tugas manajemen topologi cluster, penyeimbangan beban, deklarasi data, dan manajemen data. Lapisan pekerja berisi "anggota tubuh" dari sistem, mengeksekusi pembaruan data, kueri, dan operasi pembuatan indeks. Terakhir, lapisan penyimpanan bertanggung jawab atas persistensi dan replikasi data. Secara keseluruhan, desain berbasis layanan mikro ini memastikan kompleksitas sistem yang dapat dikontrol, dengan setiap komponen bertanggung jawab atas fungsinya masing-masing. Milvus memperjelas batas-batas layanan melalui antarmuka yang terdefinisi dengan baik, dan memisahkan layanan berdasarkan perincian yang lebih baik, yang selanjutnya mengoptimalkan skalabilitas elastis dan distribusi sumber daya.</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">Tantangan teknis yang dihadapi oleh basis data vektor<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Penelitian awal pada basis data vektor terutama terkonsentrasi pada desain struktur indeks efisiensi tinggi dan metode kueri - hal ini menghasilkan berbagai pustaka algoritme pencarian vektor (Referensi No. 3 ~ 5). Selama beberapa tahun terakhir, semakin banyak tim akademis dan teknik yang melihat masalah pencarian vektor dari sudut pandang desain sistem, dan mengusulkan beberapa solusi sistematis. Merangkum studi yang ada dan permintaan pengguna, kami mengkategorikan tantangan teknis utama untuk database vektor sebagai berikut:</p>
<ul>
<li><strong>Optimalisasi rasio biaya terhadap kinerja relatif terhadap beban</strong></li>
</ul>
<p>Dibandingkan dengan tipe data tradisional, analisis data vektor membutuhkan lebih banyak sumber daya penyimpanan dan komputasi karena dimensinya yang tinggi. Selain itu, pengguna telah menunjukkan preferensi yang beragam untuk karakteristik beban dan pengoptimalan biaya-kinerja pada solusi pencarian vektor. Misalnya, pengguna yang bekerja dengan kumpulan data yang sangat besar (puluhan atau ratusan miliar vektor) akan lebih memilih solusi dengan biaya penyimpanan data yang lebih rendah dan latensi pencarian yang bervariasi, sementara pengguna lain mungkin menuntut kinerja pencarian yang lebih tinggi dan latensi rata-rata yang tidak bervariasi. Untuk memenuhi preferensi yang beragam tersebut, komponen indeks inti dari basis data vektor harus dapat mendukung struktur indeks dan algoritme pencarian dengan berbagai jenis penyimpanan dan perangkat keras komputasi.</p>
<p>Sebagai contoh, menyimpan data vektor dan data indeks yang sesuai dalam media penyimpanan yang lebih murah (seperti NVM dan SSD) harus dipertimbangkan ketika menurunkan biaya penyimpanan. Namun demikian, sebagian besar algoritme pencarian vektor yang ada saat ini bekerja pada data yang dibaca langsung dari memori. Untuk menghindari penurunan performa yang disebabkan oleh penggunaan disk drive, database vektor harus dapat mengeksploitasi lokalitas akses data yang dikombinasikan dengan algoritme pencarian, selain dapat menyesuaikan diri dengan solusi penyimpanan untuk data vektor dan struktur indeks (Referensi No. 6~8). Demi peningkatan kinerja, penelitian kontemporer telah difokuskan pada teknologi akselerasi perangkat keras yang melibatkan GPU, NPU, FPGA, dll. (Referensi No. 9). Namun, perangkat keras dan chip khusus akselerasi bervariasi dalam desain arsitektur, dan masalah eksekusi yang paling efisien di seluruh akselerator perangkat keras yang berbeda belum terpecahkan.</p>
<ul>
<li><strong>Konfigurasi dan penyetelan sistem otomatis</strong></li>
</ul>
<p>Sebagian besar penelitian yang ada tentang algoritma pencarian vektor mencari keseimbangan yang fleksibel antara biaya penyimpanan, kinerja komputasi, dan akurasi pencarian. Secara umum, parameter algoritma dan fitur data mempengaruhi kinerja aktual algoritma. Karena permintaan pengguna berbeda dalam hal biaya dan kinerja, memilih metode kueri vektor yang sesuai dengan kebutuhan dan fitur data mereka menimbulkan tantangan yang signifikan.</p>
<p>Namun demikian, metode manual untuk menganalisis efek distribusi data pada algoritme pencarian tidak efektif karena dimensi data vektor yang tinggi. Untuk mengatasi masalah ini, akademisi dan industri mencari solusi rekomendasi algoritme berdasarkan pembelajaran mesin (Referensi No. 10).</p>
<p>Desain algoritme pencarian vektor cerdas yang didukung oleh ML juga menjadi pusat penelitian. Secara umum, algoritma pencarian vektor yang ada saat ini dikembangkan secara universal untuk data vektor dengan berbagai dimensi dan pola distribusi. Akibatnya, mereka tidak mendukung struktur indeks spesifik sesuai dengan fitur data, dan dengan demikian memiliki sedikit ruang untuk pengoptimalan. Penelitian di masa depan juga harus mengeksplorasi teknologi pembelajaran mesin yang efektif yang dapat menyesuaikan struktur indeks untuk fitur data yang berbeda (Referensi No. 11-12).</p>
<ul>
<li><strong>Dukungan untuk semantik kueri tingkat lanjut</strong></li>
</ul>
<p>Aplikasi modern sering kali mengandalkan kueri yang lebih canggih di seluruh vektor - semantik pencarian tetangga terdekat tradisional tidak lagi dapat diterapkan untuk pencarian data vektor. Selain itu, permintaan untuk pencarian gabungan di beberapa basis data vektor atau pada data vektor dan non-vektor muncul (Referensi No. 13).</p>
<p>Secara khusus, variasi metrik jarak untuk kemiripan vektor berkembang pesat. Nilai kemiripan tradisional, seperti jarak Euclidean, jarak inner product, dan jarak kosinus tidak dapat memenuhi semua permintaan aplikasi. Dengan semakin populernya teknologi kecerdasan buatan, banyak industri yang mengembangkan metrik kemiripan vektor khusus mereka sendiri, seperti Tanimoto distance, Mahalanobis distance, Superstruktur, dan Substruktur. Mengintegrasikan metrik evaluasi ini ke dalam algoritme pencarian yang sudah ada dan merancang algoritme baru yang menggunakan metrik tersebut merupakan masalah penelitian yang menantang.</p>
<p>Seiring dengan meningkatnya kompleksitas layanan pengguna, aplikasi perlu mencari di data vektor dan data non-vektor. Sebagai contoh, rekomendasi konten menganalisis preferensi pengguna, hubungan sosial, dan mencocokkannya dengan topik yang sedang hangat saat ini untuk menarik konten yang tepat kepada pengguna. Pencarian semacam itu biasanya melibatkan kueri pada beberapa jenis data atau di beberapa sistem pemrosesan data. Untuk mendukung pencarian hibrida seperti itu secara efisien dan fleksibel adalah tantangan desain sistem lainnya.</p>
<h2 id="Authors" class="common-anchor-header">Penulis<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>Rentong Guo (Ph.D. Perangkat Lunak dan Teori Komputer, Universitas Sains dan Teknologi Huazhong), mitra dan Direktur Litbang Zilliz. Dia adalah anggota Komite Teknis Federasi Komputer China untuk Komputasi dan Pemrosesan Terdistribusi (CCF TCDCP). Penelitiannya berfokus pada basis data, sistem terdistribusi, sistem caching, dan komputasi heterogen. Karya-karya penelitiannya telah dipublikasikan di beberapa konferensi dan jurnal terkemuka, termasuk Usenix ATC, ICS, DATE, TPDS. Sebagai arsitek Milvus, Dr. Guo mencari solusi untuk mengembangkan sistem analitik data berbasis AI yang sangat skalabel dan hemat biaya.</p>
<p>Xiaofan Luan, mitra dan Direktur Teknik Zilliz, serta anggota Komite Penasihat Teknis LF AI &amp; Data Foundation. Ia pernah bekerja di kantor pusat Oracle AS dan Hedvig, sebuah perusahaan rintisan penyimpanan berbasis perangkat lunak. Dia bergabung dengan tim Alibaba Cloud Database dan bertanggung jawab atas pengembangan basis data NoSQL HBase dan Lindorm. Luan memperoleh gelar master di bidang Teknik Komputer Elektronik dari Cornell University.</p>
<p>Xiaomeng Yi (Ph.D. Arsitektur Komputer, Universitas Sains dan Teknologi Huazhong), Peneliti Senior dan ketua tim peneliti Zilliz. Penelitiannya berkonsentrasi pada manajemen data dimensi tinggi, pencarian informasi skala besar, dan alokasi sumber daya dalam sistem terdistribusi. Karya-karya penelitian Dr. Yi telah dipublikasikan di jurnal-jurnal terkemuka dan konferensi internasional termasuk IEEE Network Magazine, IEEE/ACM TON, ACM SIGMOD, IEEE ICDCS, dan ACM TOMPECS.</p>
<p>Filip Haltmayer, seorang Insinyur Data Zilliz, lulus dari University of California, Santa Cruz dengan gelar BS di bidang Ilmu Komputer. Setelah bergabung dengan Zilliz, Filip menghabiskan sebagian besar waktunya untuk mengerjakan penerapan cloud, interaksi dengan klien, diskusi teknologi, dan pengembangan aplikasi AI.</p>
<h2 id="References" class="common-anchor-header">Referensi<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Proyek Milvus: https://github.com/milvus-io/milvus</li>
<li>Milvus: Sistem Manajemen Data Vektor yang Dibangun Khusus, SIGMOD'21</li>
<li>Proyek Faiss: https://github.com/facebookresearch/faiss</li>
<li>Proyek Annoy: https://github.com/spotify/annoy</li>
<li>Proyek SPTAG: https://github.com/microsoft/SPTAG</li>
<li>GRIP: Mesin Pencari Tetangga Terdekat Berkinerja Tinggi yang Dioptimalkan untuk Mesin Pencari Vektor, CIKM'19</li>
<li>DiskANN: Pencarian Tetangga Terdekat dengan Akurasi Miliar Titik yang Cepat dan Akurat pada Satu Simpul, NIPS'19</li>
<li>HM-ANN: Pencarian Tetangga Terdekat dengan Titik Miliar yang Efisien pada Memori Heterogen, NIPS'20</li>
<li>SONG: Perkiraan Pencarian Tetangga Terdekat pada GPU, ICDE'20</li>
<li>Demonstrasi layanan penyetelan sistem manajemen basis data otomatis ottertune, VLDB'18</li>
<li>Kasus untuk Struktur Indeks yang Dipelajari, SIGMOD'18</li>
<li>Meningkatkan Pencarian Tetangga Terdekat melalui Penghentian Awal Adaptif yang Dipelajari, SIGMOD'20</li>
<li>AnalyticDB-V: Mesin Analitik Hibrida Menuju Fusi Kueri untuk Data Terstruktur dan Tidak Terstruktur, VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Bergabunglah dengan komunitas sumber terbuka kami:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Temukan atau berkontribusi untuk Milvus di <a href="https://bit.ly/3khejQB">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://bit.ly/307HVsY">Forum</a>.</li>
<li>Terhubung dengan kami di <a href="https://bit.ly/3wn5aek">Twitter</a>.</li>
</ul>
