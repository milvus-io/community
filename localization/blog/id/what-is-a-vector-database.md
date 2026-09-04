---
id: what-is-vector-database-and-how-it-works.md
title: Apa Sebenarnya Database Vektor dan Bagaimana Cara Kerjanya
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Basis data vektor menyimpan, mengindeks, dan mencari embedding vektor yang
  dihasilkan oleh model pembelajaran mesin untuk pengambilan informasi yang
  cepat dan pencarian kemiripan.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>Basis data vektor mengindeks dan menyimpan embedding vektor untuk pengambilan cepat dan pencarian kemiripan, dengan kemampuan seperti operasi CRUD, pemfilteran metadata, dan penskalaan horizontal yang dirancang khusus untuk aplikasi AI.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Pendahuluan: Kebangkitan Basis Data Vektor di Era AI<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada masa-masa awal ImageNet, dibutuhkan 25.000 kurator manusia untuk melabeli dataset secara manual. Angka yang mengejutkan ini menyoroti tantangan mendasar dalam AI: mengkategorikan data tak terstruktur secara manual tidak akan pernah bisa diskalakan. Dengan miliaran gambar, video, dokumen, dan file audio yang dihasilkan setiap hari, diperlukan perubahan paradigma dalam cara komputer memahami dan berinteraksi dengan konten.</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">Sistem basis data relasional</a> tradisional unggul dalam mengelola data terstruktur dengan format yang telah ditentukan dan menjalankan operasi pencarian presisi. Sebaliknya, basis data vektor mengkhususkan diri dalam menyimpan dan mengambil jenis <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data tak terstruktur</a>, seperti gambar, audio, video, dan konten tekstual, melalui representasi numerik berdimensi tinggi yang dikenal sebagai embedding vektor. Basis data vektor mendukung <a href="https://zilliz.com/glossary/large-language-models-(llms)">model bahasa besar</a> dengan menyediakan pengambilan dan pengelolaan data yang efisien. Basis data vektor modern mengungguli sistem tradisional 2-10x melalui optimasi yang sadar perangkat keras (AVX512, SIMD, GPU, NVMe SSD), algoritma pencarian yang sangat dioptimalkan (HNSW, IVF, DiskANN), dan desain penyimpanan berorientasi kolom. Arsitektur cloud-native yang terpisah memungkinkan penskalaan independen pada komponen pencarian, penyisipan data, dan pengindeksan, memungkinkan sistem menangani miliaran vektor sambil mempertahankan kinerja untuk aplikasi AI perusahaan di perusahaan seperti Salesforce, PayPal, eBay, dan NVIDIA.</p>
<p>Ini mewakili apa yang para ahli sebut sebagai "kesenjangan semantik"—basis data tradisional beroperasi pada kecocokan persis dan hubungan yang telah ditentukan, sementara pemahaman manusia tentang konten bersifat bernuansa, kontekstual, dan multidimensi. Kesenjangan ini menjadi semakin bermasalah karena aplikasi AI menuntut:</p>
<ul>
<li><p>Menemukan kemiripan konseptual daripada kecocokan persis</p></li>
<li><p>Memahami hubungan kontekstual antara berbagai bagian konten</p></li>
<li><p>Menangkap esensi semantik informasi di luar kata kunci</p></li>
<li><p>Memproses data multimodal dalam kerangka kerja terpadu</p></li>
</ul>
<p>Basis data vektor telah muncul sebagai teknologi penting untuk menjembatani kesenjangan ini, menjadi komponen esensial dalam infrastruktur AI modern. Mereka meningkatkan kinerja model pembelajaran mesin dengan memfasilitasi tugas-tugas seperti clustering dan klasifikasi.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Memahami Embedding Vektor: Fondasi<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">Embedding vektor</a> berfungsi sebagai jembatan penting melintasi kesenjangan semantik. Representasi numerik berdimensi tinggi ini menangkap esensi semantik data tak terstruktur dalam bentuk yang dapat diproses secara efisien oleh komputer. Model embedding modern mengubah konten mentah—baik teks, gambar, atau audio—menjadi vektor padat di mana konsep serupa mengelompok bersama dalam ruang vektor, terlepas dari perbedaan permukaan.</p>
<p>Misalnya, embedding yang dibangun dengan benar akan menempatkan konsep seperti "mobil", "oto", dan "kendaraan" berdekatan dalam ruang vektor, meskipun memiliki bentuk leksikal yang berbeda. Properti ini memungkinkan <a href="https://zilliz.com/glossary/semantic-search">pencarian semantik</a>, <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistem rekomendasi</a>, dan aplikasi AI untuk memahami konten di luar pencocokan pola sederhana.</p>
<p>Kekuatan embedding meluas melintasi modalitas. Basis data vektor canggih mendukung berbagai jenis data tak terstruktur—teks, gambar, audio—dalam sistem terpadu, memungkinkan pencarian dan hubungan lintas-modal yang sebelumnya mustahil untuk dimodelkan secara efisien. Kemampuan basis data vektor ini sangat penting untuk teknologi berbasis AI seperti chatbot dan sistem pengenalan gambar, mendukung aplikasi canggih seperti pencarian semantik dan sistem rekomendasi.</p>
<p>Namun, menyimpan, mengindeks, dan mengambil embedding dalam skala besar menghadirkan tantangan komputasi unik yang tidak dirancang untuk diatasi oleh basis data tradisional.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Basis Data Vektor: Konsep Inti<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor mewakili pergeseran paradigma dalam cara kita menyimpan dan menanyakan data tak terstruktur. Berbeda dengan sistem basis data relasional tradisional yang unggul dalam mengelola data terstruktur dengan format yang telah ditentukan, basis data vektor mengkhususkan diri dalam menangani data tak terstruktur melalui representasi vektor numerik.</p>
<p>Pada intinya, basis data vektor dirancang untuk memecahkan masalah mendasar: memungkinkan pencarian kemiripan yang efisien di seluruh kumpulan data besar yang tak terstruktur. Mereka mencapai ini melalui tiga komponen kunci:</p>
<p><strong>Embedding Vektor</strong>: Representasi numerik berdimensi tinggi yang menangkap makna semantik dari data tak terstruktur (teks, gambar, audio, dll.)</p>
<p><strong>Pengindeksan Khusus</strong>: Algoritma yang dioptimalkan untuk ruang vektor berdimensi tinggi yang memungkinkan pencarian perkiraan yang cepat. Basis data vektor mengindeks vektor untuk meningkatkan kecepatan dan efisiensi pencarian kemiripan, menggunakan berbagai algoritma ML untuk membuat indeks pada embedding vektor.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Metrik Jarak</strong></a>: Fungsi matematika yang mengukur kemiripan antara vektor</p>
<p>Operasi utama dalam basis data vektor adalah kueri <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-tetangga terdekat</a> (KNN), yang menemukan k vektor yang paling mirip dengan vektor kueri tertentu. Untuk aplikasi skala besar, basis data ini biasanya mengimplementasikan algoritma <a href="https://zilliz.com/glossary/anns">tetangga terdekat perkiraan</a> (ANN), menukar sejumlah kecil akurasi dengan peningkatan signifikan dalam kecepatan pencarian.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Fondasi Matematis Kemiripan Vektor</h3><p>Memahami basis data vektor memerlukan pemahaman prinsip-prinsip matematis di balik kemiripan vektor. Berikut adalah konsep-konsep dasarnya:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Ruang Vektor dan Embedding</h3><p>Sebuah <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">embedding vektor</a> adalah larik bilangan floating-point dengan panjang tetap (dapat berkisar dari 100-32.768 dimensi!) yang mewakili data tak terstruktur dalam format numerik. Embedding ini menempatkan item serupa lebih dekat bersama dalam ruang vektor berdimensi tinggi.</p>
<p>Misalnya, kata "raja" dan "ratu" akan memiliki representasi vektor yang lebih dekat satu sama lain daripada keduanya dengan "mobil" dalam ruang embedding kata yang dilatih dengan baik.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Metrik Jarak</h3><p>Pilihan metrik jarak secara fundamental mempengaruhi bagaimana kemiripan dihitung. Metrik jarak umum meliputi:</p>
<ol>
<li><p><strong>Jarak Euclidean</strong>: Jarak garis lurus antara dua titik dalam ruang Euclidean.</p></li>
<li><p><strong>Kemiripan Kosinus</strong>: Mengukur kosinus sudut antara dua vektor, berfokus pada orientasi daripada magnitudo</p></li>
<li><p><strong>Produk Titik</strong>: Untuk vektor yang dinormalisasi, mewakili seberapa sejajar dua vektor.</p></li>
<li><p><strong>Jarak Manhattan (Norma L1)</strong>: Jumlah perbedaan absolut antara koordinat.</p></li>
</ol>
<p>Kasus penggunaan yang berbeda mungkin memerlukan metrik jarak yang berbeda. Misalnya, kemiripan kosinus sering bekerja dengan baik untuk embedding teks, sementara jarak Euclidean mungkin lebih cocok untuk jenis <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">embedding gambar</a> tertentu.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Kemiripan semantik</a> antara vektor dalam ruang vektor</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Kemiripan semantik antara vektor dalam ruang vektor" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>Kemiripan semantik antara vektor dalam ruang vektor</span>
  </span>
</p>
<p>Memahami fondasi matematis ini mengarah pada pertanyaan penting tentang implementasi: Jadi, cukup tambahkan indeks vektor ke basis data apa pun, kan?</p>
<p>Hanya menambahkan indeks vektor ke basis data relasional tidaklah cukup, juga tidak menggunakan <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">pustaka indeks vektor</a> yang berdiri sendiri. Meskipun indeks vektor menyediakan kemampuan penting untuk menemukan vektor serupa secara efisien, mereka tidak memiliki infrastruktur yang diperlukan untuk aplikasi produksi:</p>
<ul>
<li><p>Mereka tidak menyediakan operasi CRUD untuk mengelola data vektor</p></li>
<li><p>Mereka tidak memiliki penyimpanan metadata dan kemampuan pemfilteran</p></li>
<li><p>Mereka tidak menawarkan penskalaan, replikasi, atau toleransi kesalahan bawaan</p></li>
<li><p>Mereka memerlukan infrastruktur khusus untuk persistensi dan pengelolaan data</p></li>
</ul>
<p>Basis data vektor muncul untuk mengatasi keterbatasan
