---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: >-
  Pencarian Kemiripan yang Terukur dan Sangat Cepat dengan Basis Data Vektor
  Milvus
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: >-
  Menyimpan, mengindeks, mengelola, dan mencari triliunan vektor dokumen dalam
  hitungan milidetik!
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>gambar sampul</span> </span></p>
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
    </button></h2><p>Pada artikel ini, kita akan membahas beberapa aspek menarik yang berkaitan dengan database vektor dan pencarian kemiripan dalam skala besar. Di dunia yang berkembang pesat saat ini, kita melihat teknologi baru, bisnis baru, sumber data baru, dan sebagai konsekuensinya, kita harus terus menggunakan cara-cara baru untuk menyimpan, mengelola, dan memanfaatkan data ini untuk mendapatkan wawasan. Data terstruktur dan tabular telah disimpan dalam database relasional selama beberapa dekade, dan Business Intelligence berkembang pesat dalam menganalisis dan mengekstraksi wawasan dari data tersebut. Namun, dengan mempertimbangkan lanskap data saat ini, "lebih dari 80-90% data merupakan informasi yang tidak terstruktur seperti teks, video, audio, log server web, media sosial, dan banyak lagi". Organisasi telah memanfaatkan kekuatan pembelajaran mesin dan pembelajaran mendalam untuk mencoba mengekstrak wawasan dari data tersebut karena metode berbasis kueri tradisional mungkin tidak cukup atau bahkan tidak memungkinkan. Ada potensi besar yang belum dimanfaatkan untuk mengekstrak wawasan berharga dari data semacam itu dan kita baru saja memulainya!</p>
<blockquote>
<p>"Karena sebagian besar data di dunia tidak terstruktur, kemampuan untuk menganalisis dan menindaklanjutinya menghadirkan peluang besar." - Mikey Shulman, Kepala ML, Kensho</p>
</blockquote>
<p>Data tidak terstruktur, seperti namanya, tidak memiliki struktur implisit, seperti tabel baris dan kolom (oleh karena itu disebut data tabel atau terstruktur). Tidak seperti data terstruktur, tidak ada cara yang mudah untuk menyimpan konten data tidak terstruktur dalam database relasional. Ada tiga tantangan utama dalam memanfaatkan data tidak terstruktur untuk mendapatkan wawasan:</p>
<ul>
<li><strong>Penyimpanan:</strong> Basis data relasional biasa baik untuk menyimpan data terstruktur. Meskipun Anda dapat menggunakan database NoSQL untuk menyimpan data tersebut, akan ada biaya tambahan untuk memproses data tersebut untuk mengekstrak representasi yang tepat untuk mendukung aplikasi AI dalam skala besar.</li>
<li><strong>Representasi:</strong> Komputer tidak memahami teks atau gambar seperti yang kita pahami. Komputer hanya memahami angka dan kita perlu menyamarkan data yang tidak terstruktur ke dalam beberapa representasi numerik yang berguna, biasanya berupa vektor atau embedding.</li>
<li><strong>Mengajukan pertanyaan:</strong> Anda tidak dapat melakukan kueri pada data tidak terstruktur secara langsung berdasarkan pernyataan kondisional yang pasti seperti SQL untuk data terstruktur. Bayangkan, contoh sederhana Anda mencoba mencari sepatu yang serupa dengan foto sepasang sepatu favorit Anda! Anda tidak dapat menggunakan nilai piksel mentah untuk pencarian, Anda juga tidak dapat merepresentasikan fitur terstruktur seperti bentuk sepatu, ukuran, gaya, warna, dan lainnya. Sekarang bayangkan jika Anda harus melakukan hal ini untuk jutaan sepatu!</li>
</ul>
<p>Oleh karena itu, agar komputer dapat memahami, memproses, dan merepresentasikan data yang tidak terstruktur, kita biasanya mengubahnya menjadi vektor padat, yang sering disebut penyisipan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>Gambar 1</span> </span></p>
<p>Ada berbagai metodologi yang secara khusus memanfaatkan deep learning, termasuk convolutional neural network (CNN) untuk data visual seperti gambar dan Transformers untuk data teks yang dapat digunakan untuk mengubah data yang tidak terstruktur menjadi embeddings. <a href="https://zilliz.com/">Zilliz</a> memiliki <a href="https://zilliz.com/learn/embedding-generation">artikel yang sangat bagus yang membahas berbagai teknik penyematan</a>!</p>
<p>Sekarang, menyimpan vektor penyematan ini tidaklah cukup. Kita juga harus dapat menanyakan dan menemukan vektor-vektor yang serupa. Mengapa Anda bertanya? Mayoritas aplikasi dunia nyata didukung oleh pencarian kemiripan vektor untuk solusi berbasis AI. Ini termasuk pencarian visual (gambar) di Google, sistem rekomendasi di Netflix atau Amazon, mesin pencari teks di Google, pencarian multi-modal, de-duplikasi data, dan masih banyak lagi!</p>
<p>Menyimpan, mengelola, dan melakukan kueri vektor dalam skala besar bukanlah tugas yang mudah. Anda membutuhkan alat khusus untuk ini dan database vektor adalah alat yang paling efektif untuk pekerjaan ini! Pada artikel ini kita akan membahas aspek-aspek berikut:</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">Vektor dan Pencarian Kemiripan Vektor</a></li>
<li><a href="#What-is-a-Vector-Database">Apa yang dimaksud dengan Basis Data Vektor?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - Basis Data Vektor Paling Canggih di Dunia</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Melakukan pencarian gambar visual dengan Milvus - Cetak biru kasus penggunaan</a></li>
</ul>
<p>Mari kita mulai!</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">Vektor dan Pencarian Kemiripan Vektor<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelumnya, kami telah menjelaskan pentingnya merepresentasikan data tidak terstruktur seperti gambar dan teks sebagai vektor, karena komputer hanya dapat memahami angka. Kami biasanya memanfaatkan model AI, atau lebih spesifiknya model deep learning untuk mengubah data yang tidak terstruktur menjadi vektor numerik yang dapat dibaca oleh mesin. Biasanya vektor-vektor ini pada dasarnya adalah daftar angka floating point yang secara kolektif mewakili item yang mendasarinya (gambar, teks, dll.).</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">Memahami Vektor</h3><p>Mempertimbangkan bidang pemrosesan bahasa alami (NLP), kami memiliki banyak model penyematan kata seperti <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, GloVe, dan FastText</a> yang dapat membantu merepresentasikan kata-kata sebagai vektor numerik. Dengan kemajuan dari waktu ke waktu, kita telah melihat munculnya model <a href="https://arxiv.org/abs/1706.03762">Transformer</a> seperti <a href="https://jalammar.github.io/illustrated-bert/">BERT</a> yang dapat dimanfaatkan untuk mempelajari vektor penyematan kontekstual dan representasi yang lebih baik untuk seluruh kalimat dan paragraf.</p>
<p>Demikian pula untuk bidang visi komputer, kami memiliki model seperti <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">Convolutional Neural Networks (CNN)</a> yang dapat membantu dalam mempelajari representasi dari data visual seperti gambar dan video. Dengan munculnya Transformers, kami juga memiliki <a href="https://arxiv.org/abs/2010.11929">Vision Transformers</a> yang dapat bekerja lebih baik daripada CNN biasa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>Gambar 2</span> </span></p>
<p>Keuntungan dari vektor-vektor tersebut adalah kita dapat memanfaatkannya untuk memecahkan masalah dunia nyata seperti pencarian visual, di mana Anda biasanya mengunggah foto dan mendapatkan hasil pencarian termasuk gambar yang mirip secara visual. Google memiliki fitur ini sebagai fitur yang sangat populer di mesin pencari mereka seperti yang digambarkan dalam contoh berikut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>Gambar 3</span> </span></p>
<p>Aplikasi semacam itu didukung dengan vektor data dan pencarian kemiripan vektor. Jika Anda mempertimbangkan dua titik dalam ruang koordinat kartesius XY. Jarak antara dua titik dapat dihitung sebagai jarak euclidean sederhana yang digambarkan oleh persamaan berikut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>Gambar 4</span> </span></p>
<p>Sekarang bayangkan setiap titik data adalah vektor yang memiliki D-dimensi, Anda masih dapat menggunakan jarak euclidean atau bahkan metrik jarak lainnya seperti jarak hamming atau cosinus untuk mengetahui seberapa dekat dua titik data satu sama lain. Hal ini dapat membantu membangun gagasan kedekatan atau kemiripan yang dapat digunakan sebagai metrik yang dapat diukur untuk menemukan item yang mirip dengan item referensi menggunakan vektornya.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">Memahami Pencarian Kemiripan Vektor</h3><p>Pencarian kemiripan vektor, sering dikenal sebagai pencarian tetangga terdekat (NN), pada dasarnya adalah proses menghitung kemiripan berpasangan (atau jarak) antara item referensi (yang ingin kita temukan item yang mirip) dan kumpulan item yang ada (biasanya dalam database) dan mengembalikan 'k' tetangga terdekat yang merupakan 'k' teratas yang paling mirip. Komponen kunci untuk menghitung kemiripan ini adalah metrik kemiripan yang dapat berupa jarak euclidean, inner product, jarak kosinus, jarak hamming, dll. Semakin kecil jaraknya, semakin mirip vektornya.</p>
<p>Tantangan dengan pencarian tetangga terdekat (NN) adalah skalabilitas. Anda perlu menghitung N-jarak (dengan asumsi N item yang ada) setiap saat untuk mendapatkan item yang mirip. Ini bisa sangat lambat terutama jika Anda tidak menyimpan dan mengindeks data di suatu tempat (seperti basis data vektor!). Untuk mempercepat komputasi, kita biasanya memanfaatkan pencarian tetangga terdekat yang sering disebut pencarian ANN yang pada akhirnya menyimpan vektor ke dalam sebuah indeks. Indeks membantu menyimpan vektor-vektor ini dengan cara yang cerdas untuk memungkinkan pengambilan cepat tetangga yang 'kira-kira' mirip untuk item kueri referensi. Metodologi pengindeksan ANN yang umum meliputi:</p>
<ul>
<li><strong>Transformasi Vektor:</strong> Ini termasuk menambahkan transformasi tambahan pada vektor seperti pengurangan dimensi (misalnya PCA \ t-SNE), rotasi, dan sebagainya</li>
<li><strong>Pengkodean Vektor:</strong> Ini termasuk menerapkan teknik berdasarkan struktur data seperti Locality Sensitive Hashing (LSH), Kuantisasi, Pohon, dll. yang dapat membantu dalam pengambilan item yang serupa dengan lebih cepat</li>
<li><strong>Metode Pencarian yang Tidak Melelahkan:</strong> Metode ini sebagian besar digunakan untuk mencegah pencarian yang menyeluruh dan mencakup metode seperti grafik ketetanggaan, indeks terbalik, dll.</li>
</ul>
<p>Hal ini membuktikan bahwa untuk membangun aplikasi pencarian kemiripan vektor, Anda memerlukan basis data yang dapat membantu Anda dalam menyimpan, mengindeks, dan melakukan kueri (pencarian) dalam skala besar. Masuk ke basis data vektor!</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">Apa yang dimaksud dengan basis data vektor?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Karena sekarang kita sudah memahami bagaimana vektor dapat digunakan untuk merepresentasikan data yang tidak terstruktur dan cara kerja pencarian vektor, kita dapat menggabungkan kedua konsep tersebut untuk membangun database vektor.</p>
<p>Basis data vektor adalah platform data yang dapat diskalakan untuk menyimpan, mengindeks, dan melakukan kueri di seluruh vektor penyisipan yang dihasilkan dari data tak terstruktur (gambar, teks, dll.) dengan menggunakan model pembelajaran mendalam.</p>
<p>Menangani vektor dalam jumlah besar untuk pencarian kemiripan (bahkan dengan indeks) bisa sangat mahal. Meskipun demikian, database vektor terbaik dan tercanggih harus memungkinkan Anda untuk memasukkan, mengindeks, dan mencari di jutaan atau miliaran vektor target, selain menentukan algoritme pengindeksan dan metrik kemiripan pilihan Anda.</p>
<p>Basis data vektor terutama harus memenuhi persyaratan utama berikut dengan mempertimbangkan sistem manajemen basis data yang kuat untuk digunakan di perusahaan:</p>
<ol>
<li><strong>Terukur:</strong> Basis data vektor harus dapat mengindeks dan menjalankan pencarian perkiraan tetangga terdekat untuk miliaran vektor penyisipan</li>
<li><strong>Dapat diandalkan:</strong> Basis data vektor harus dapat menangani kesalahan internal tanpa kehilangan data dan dengan dampak operasional yang minimal, yaitu toleran terhadap kesalahan</li>
<li><strong>Cepat:</strong> Kecepatan kueri dan tulis sangat penting untuk basis data vektor. Untuk platform seperti Snapchat dan Instagram, yang dapat memiliki ratusan atau ribuan gambar baru yang diunggah per detik, kecepatan menjadi faktor yang sangat penting.</li>
</ol>
<p>Basis data vektor tidak hanya menyimpan vektor data. Database vektor juga bertanggung jawab untuk menggunakan struktur data yang efisien untuk mengindeks vektor-vektor ini agar dapat diambil dengan cepat dan mendukung operasi CRUD (buat, baca, perbarui, dan hapus). Basis data vektor juga idealnya harus mendukung pemfilteran atribut, yaitu pemfilteran berdasarkan bidang metadata yang biasanya berupa bidang skalar. Contoh sederhananya adalah mengambil sepatu yang serupa berdasarkan vektor gambar untuk merek tertentu. Di sini, merek akan menjadi atribut yang menjadi dasar pemfilteran yang akan dilakukan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>Gambar 5</span> </span></p>
<p>Gambar di atas menunjukkan bagaimana <a href="https://milvus.io/">Milvus</a>, basis data vektor yang akan kita bahas sebentar lagi, menggunakan pemfilteran atribut. <a href="https://milvus.io/">Milvus</a> memperkenalkan konsep bitmask pada mekanisme pemfilteran untuk menyimpan vektor-vektor yang mirip dengan bitmask 1 berdasarkan pemenuhan filter atribut tertentu. Detail lebih lanjut tentang ini <a href="https://zilliz.com/learn/attribute-filtering">di sini</a>.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - Basis Data Vektor Paling Canggih di Dunia<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> adalah platform manajemen basis data vektor sumber terbuka yang dibuat khusus untuk data vektor berskala masif dan menyederhanakan operasi pembelajaran mesin (MLOps).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>gambar 6</span> </span></p>
<p><a href="https://zilliz.com/">Zilliz</a>, adalah organisasi di balik pembuatan <a href="https://milvus.io/">Milvus</a>, basis data vektor tercanggih di dunia, untuk mempercepat pengembangan data fabric generasi berikutnya. Milvus saat ini merupakan proyek kelulusan di <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> dan berfokus pada pengelolaan kumpulan data tak terstruktur yang sangat besar untuk penyimpanan dan pencarian. Efisiensi dan keandalan platform ini menyederhanakan proses penerapan model AI dan MLOps dalam skala besar. Milvus memiliki aplikasi yang luas yang mencakup penemuan obat, visi komputer, sistem rekomendasi, chatbot, dan banyak lagi.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Fitur-fitur Utama Milvus</h3><p>Milvus dikemas dengan fitur dan kemampuan yang berguna, seperti:</p>
<ul>
<li><strong>Kecepatan pencarian yang luar biasa pada triliunan set data vektor:</strong> Latensi rata-rata pencarian dan pengambilan vektor telah diukur dalam milidetik pada satu triliun set data vektor.</li>
<li><strong>Manajemen data tidak terstruktur yang disederhanakan:</strong> Milvus memiliki API yang kaya yang dirancang untuk alur kerja ilmu data.</li>
<li><strong>Basis data vektor yang andal dan selalu aktif:</strong> Fitur replikasi dan failover/failback bawaan Milvus memastikan data dan aplikasi dapat selalu menjaga kelangsungan bisnis.</li>
<li><strong>Sangat skalabel dan elastis:</strong> Skalabilitas tingkat komponen memungkinkan untuk meningkatkan dan menurunkan sesuai permintaan.</li>
<li><strong>Pencarian hibrida:</strong> Selain vektor, Milvus mendukung tipe data seperti Boolean, String, bilangan bulat, angka floating-point, dan banyak lagi. Milvus menggabungkan pemfilteran skalar dengan pencarian kemiripan vektor yang kuat (seperti yang terlihat pada contoh kemiripan sepatu sebelumnya).</li>
<li><strong>Struktur Lambda terpadu:</strong> Milvus menggabungkan pemrosesan stream dan batch untuk penyimpanan data untuk menyeimbangkan ketepatan waktu dan efisiensi.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">Perjalanan Waktu</a>:</strong> Milvus mempertahankan garis waktu untuk semua operasi penyisipan dan penghapusan data. Hal ini memungkinkan pengguna untuk menentukan stempel waktu dalam pencarian untuk mengambil tampilan data pada titik waktu tertentu.</li>
<li><strong>Didukung oleh komunitas &amp; diakui oleh industri:</strong> Dengan lebih dari 1.000 pengguna perusahaan, 10.000+ bintang di <a href="https://github.com/milvus-io/milvus">GitHub</a>, dan komunitas sumber terbuka yang aktif, Anda tidak sendirian saat menggunakan Milvus. Sebagai proyek pascasarjana di bawah <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>, Milvus memiliki dukungan institusional.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">Pendekatan yang Ada untuk Manajemen dan Pencarian Data Vektor</h3><p>Cara umum untuk membangun sistem AI yang didukung oleh pencarian kemiripan vektor adalah dengan memasangkan algoritme seperti Approximate Nearest Neighbor Search (ANNS) dengan pustaka sumber terbuka seperti:</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Pencarian Kemiripan AI Facebook (FAISS)</a>:</strong> Kerangka kerja ini memungkinkan pencarian kemiripan yang efisien dan pengelompokan vektor yang padat. Kerangka kerja ini berisi algoritme yang mencari kumpulan vektor dengan berbagai ukuran, hingga vektor yang mungkin tidak muat dalam RAM. Ini mendukung kemampuan pengindeksan seperti multi-indeks terbalik dan kuantisasi produk</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotify's Annoy (Perkiraan Tetangga Terdekat Oh Yeah)</a>:</strong> Kerangka kerja ini menggunakan <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">proyeksi acak</a> dan membangun sebuah pohon untuk mengaktifkan ANNS dalam skala besar untuk vektor yang padat</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN (Scalable Nearest Neighbors) dari Google</a>:</strong> Kerangka kerja ini melakukan pencarian kemiripan vektor yang efisien dalam skala besar. Terdiri dari implementasi, yang mencakup pemangkasan ruang pencarian dan kuantisasi untuk Maximum Inner Product Search (MIPS)</li>
</ul>
<p>Meskipun masing-masing pustaka ini berguna dengan caranya sendiri, karena beberapa keterbatasan, kombinasi algoritma-pustaka ini tidak setara dengan sistem manajemen data vektor yang lengkap seperti Milvus. Kita akan membahas beberapa keterbatasan ini sekarang.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">Keterbatasan Pendekatan yang Sudah Ada</h3><p>Pendekatan yang ada saat ini yang digunakan untuk mengelola data vektor seperti yang telah dibahas pada bagian sebelumnya memiliki beberapa keterbatasan sebagai berikut:</p>
<ol>
<li><strong>Fleksibilitas:</strong> Sistem yang ada biasanya menyimpan semua data dalam memori utama, oleh karena itu mereka tidak dapat dijalankan dalam mode terdistribusi di beberapa mesin dengan mudah dan tidak cocok untuk menangani kumpulan data yang sangat besar</li>
<li><strong>Penanganan data dinamis:</strong> Data sering diasumsikan statis setelah dimasukkan ke dalam sistem yang ada, sehingga mempersulit pemrosesan untuk data dinamis dan membuat pencarian yang hampir real-time menjadi tidak mungkin.</li>
<li><strong>Pemrosesan kueri tingkat lanjut:</strong> Sebagian besar alat tidak mendukung pemrosesan kueri tingkat lanjut (misalnya pemfilteran atribut, penelusuran hibrida, dan kueri multi-vektor), yang sangat penting untuk membangun mesin telusur kemiripan di dunia nyata yang mendukung pemfilteran tingkat lanjut.</li>
<li><strong>Pengoptimalan komputasi heterogen:</strong> Hanya sedikit platform yang menawarkan pengoptimalan untuk arsitektur sistem heterogen pada CPU dan GPU (tidak termasuk FAISS), yang menyebabkan hilangnya efisiensi.</li>
</ol>
<p><a href="https://milvus.io/">Milvus</a> berusaha mengatasi semua keterbatasan ini dan kami akan membahasnya secara rinci di bagian selanjutnya.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">Keunggulan Milvus -Memahami Knowhere</h3><p><a href="https://milvus.io/">Milvus</a> mencoba mengatasi dan berhasil memecahkan keterbatasan sistem yang ada yang dibangun di atas manajemen data vektor yang tidak efisien dan algoritme pencarian kemiripan dengan cara-cara berikut:</p>
<ul>
<li>Meningkatkan fleksibilitas dengan menawarkan dukungan untuk berbagai antarmuka aplikasi (termasuk SDK dalam Python, Java, Go, C++ dan RESTful API)</li>
<li>Mendukung berbagai jenis indeks vektor (misalnya, indeks berbasis kuantisasi dan indeks berbasis grafik), dan pemrosesan kueri tingkat lanjut</li>
<li>Milvus menangani data vektor dinamis menggunakan log-structured merge-tree (LSM tree), menjaga penyisipan dan penghapusan data tetap efisien dan pencarian tetap berjalan secara real time</li>
<li>Milvus juga menyediakan pengoptimalan untuk arsitektur komputasi heterogen pada CPU dan GPU modern, yang memungkinkan pengembang untuk menyesuaikan sistem untuk skenario, kumpulan data, dan lingkungan aplikasi tertentu</li>
</ul>
<p>Knowhere, mesin eksekusi vektor dari Milvus, adalah antarmuka operasi untuk mengakses layanan di lapisan atas sistem dan pustaka pencarian kemiripan vektor seperti Faiss, Hnswlib, Annoy di lapisan bawah sistem. Selain itu, Knowhere juga bertanggung jawab atas komputasi heterogen. Knowhere mengontrol perangkat keras mana (mis. CPU atau GPU) yang akan mengeksekusi pembuatan indeks dan permintaan pencarian. Inilah bagaimana Knowhere mendapatkan namanya - mengetahui di mana harus menjalankan operasi. Lebih banyak jenis perangkat keras termasuk DPU dan TPU akan didukung dalam rilis mendatang.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>Gambar 7</span> </span></p>
<p>Komputasi di Milvus terutama melibatkan operasi vektor dan skalar. Knowhere hanya menangani operasi-operasi pada vektor di Milvus. Gambar di atas mengilustrasikan arsitektur Knowhere di Milvus. Lapisan paling bawah adalah perangkat keras sistem. Pustaka indeks pihak ketiga berada di atas perangkat keras. Kemudian Knowhere berinteraksi dengan simpul indeks dan simpul kueri di bagian atas melalui CGO. Knowhere tidak hanya memperluas fungsi Faiss tetapi juga mengoptimalkan kinerja dan memiliki beberapa keunggulan termasuk dukungan untuk BitsetView, dukungan untuk lebih banyak metrik kemiripan, dukungan untuk set instruksi AVX512, pemilihan instruksi SIMD otomatis, dan pengoptimalan kinerja lainnya. Detailnya dapat ditemukan <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">di sini</a>.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Arsitektur Milvus</h3><p>Gambar berikut ini menampilkan arsitektur keseluruhan platform Milvus. Milvus memisahkan aliran data dari aliran kontrol, dan dibagi menjadi empat lapisan yang independen dalam hal skalabilitas dan pemulihan bencana.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>Gambar 8</span> </span></p>
<ul>
<li><strong>Lapisan akses:</strong> Lapisan akses terdiri dari sekelompok proxy tanpa kewarganegaraan dan berfungsi sebagai lapisan depan sistem dan titik akhir bagi pengguna.</li>
<li><strong>Layanan koordinator:</strong> Layanan koordinator bertanggung jawab atas manajemen node topologi cluster, penyeimbangan beban, pembuatan stempel waktu, deklarasi data, dan manajemen data</li>
<li><strong>Node pekerja:</strong> Node pekerja, atau eksekusi, mengeksekusi instruksi yang dikeluarkan oleh layanan koordinator dan perintah bahasa manipulasi data (DML) yang diprakarsai oleh proksi. Node pekerja di Milvus mirip dengan node data di <a href="https://hadoop.apache.org/">Hadoop</a>, atau server wilayah di HBase</li>
<li><strong>Penyimpanan:</strong> Ini adalah landasan Milvus, yang bertanggung jawab atas persistensi data. Lapisan penyimpanan terdiri dari <strong>meta store</strong>, <strong>perantara log</strong>, dan <strong>penyimpanan objek</strong></li>
</ul>
<p>Lihat detail lebih lanjut tentang arsitekturnya <a href="https://milvus.io/docs/v2.0.x/four_layers.md">di sini</a>!</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Melakukan pencarian gambar visual dengan Milvus - Cetak biru kasus penggunaan<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor sumber terbuka seperti Milvus memungkinkan bisnis apa pun untuk membuat sistem pencarian gambar visual mereka sendiri dengan jumlah langkah yang minimum. Pengembang dapat menggunakan model AI yang telah dilatih sebelumnya untuk mengubah set data gambar mereka sendiri menjadi vektor, dan kemudian memanfaatkan Milvus untuk memungkinkan pencarian produk serupa berdasarkan gambar. Mari kita lihat cetak biru berikut ini tentang bagaimana merancang dan membangun sistem seperti itu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>Gambar 9</span> </span></p>
<p>Dalam alur kerja ini kita dapat menggunakan kerangka kerja sumber terbuka seperti <a href="https://github.com/towhee-io/towhee">towhee</a> untuk memanfaatkan model yang sudah terlatih seperti ResNet-50 dan mengekstrak vektor dari gambar, menyimpan dan mengindeks vektor-vektor ini dengan mudah di Milvus dan juga menyimpan pemetaan ID gambar ke gambar yang sebenarnya dalam database MySQL. Setelah data diindeks, kita dapat mengunggah gambar baru dengan mudah dan melakukan pencarian gambar dalam skala besar menggunakan Milvus. Gambar berikut ini menunjukkan contoh pencarian gambar visual.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>Gambar 10</span> </span></p>
<p>Lihatlah <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">tutorial</a> terperinci yang telah menjadi sumber terbuka di GitHub berkat Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">Kesimpulan<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita telah membahas cukup banyak hal dalam artikel ini. Kita mulai dengan tantangan dalam merepresentasikan data yang tidak terstruktur, memanfaatkan vektor dan pencarian kemiripan vektor dalam skala besar dengan Milvus, sebuah basis data vektor sumber terbuka. Kami membahas tentang detail tentang bagaimana Milvus terstruktur dan komponen-komponen utama yang mendukungnya serta cetak biru tentang cara memecahkan masalah dunia nyata, pencarian gambar visual dengan Milvus. Cobalah dan mulailah memecahkan masalah dunia nyata Anda sendiri dengan <a href="https://milvus.io/">Milvus</a>!</p>
<p>Suka dengan artikel ini? <a href="https://www.linkedin.com/in/dipanzan/">Hubungi saya</a> untuk berdiskusi lebih lanjut atau memberikan umpan balik!</p>
<h2 id="About-the-author" class="common-anchor-header">Tentang penulis<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar adalah Pemimpin Ilmu Data, Pakar Pengembang Google - Pembelajaran Mesin, Penulis, Konsultan, dan Penasihat AI. Hubungkan: http://bit.ly/djs_linkedin</p>
