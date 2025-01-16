---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: "\U0001F50E Pilih mesin pencari kemiripan penyematan"
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: Studi kasus dengan aplikasi WANYIN
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>Penyaringan Kolaboratif Berbasis Item untuk Sistem Rekomendasi Musik</custom-h1><p>Aplikasi Wanyin adalah komunitas berbagi musik berbasis AI yang bertujuan untuk mendorong berbagi musik dan membuat komposisi musik menjadi lebih mudah bagi para penggemar musik.</p>
<p>Perpustakaan Wanyin berisi sejumlah besar musik yang diunggah oleh pengguna. Tugas utamanya adalah memilah musik yang diminati berdasarkan perilaku pengguna sebelumnya. Kami mengevaluasi dua model klasik: pemfilteran kolaboratif berbasis pengguna (User-based CF) dan pemfilteran kolaboratif berbasis item (Item-based CF), sebagai model sistem rekomendasi yang potensial.</p>
<ul>
<li>User-based CF menggunakan statistik kemiripan untuk mendapatkan pengguna tetangga dengan preferensi atau minat yang sama. Dengan kumpulan tetangga terdekat yang diambil, sistem dapat memprediksi minat pengguna target dan menghasilkan rekomendasi.</li>
<li>Diperkenalkan oleh Amazon, CF berbasis item, atau item-to-item (I2I) CF, adalah model penyaringan kolaboratif yang terkenal untuk sistem rekomendasi. Model ini menghitung kemiripan antara item, bukan pengguna, berdasarkan asumsi bahwa item yang diminati pasti mirip dengan item yang memiliki skor tinggi.</li>
</ul>
<p>CF berbasis pengguna dapat menyebabkan waktu yang sangat lama untuk perhitungan ketika jumlah pengguna melewati titik tertentu. Dengan mempertimbangkan karakteristik produk kami, kami memutuskan untuk menggunakan I2I CF untuk mengimplementasikan sistem rekomendasi musik. Karena kami tidak memiliki banyak metadata tentang lagu-lagu tersebut, kami harus berurusan dengan lagu-lagu itu sendiri, mengekstraksi vektor fitur (embeddings) dari lagu-lagu tersebut. Pendekatan kami adalah mengubah lagu-lagu ini menjadi mel-frequency cepstrum (MFC), merancang convolutional neural network (CNN) untuk mengekstrak fitur-fitur lagu, dan kemudian membuat rekomendasi musik melalui pencarian kemiripan fitur.</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">🔎 Pilih mesin pencari kemiripan penyematan<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah kita memiliki vektor fitur, masalah yang tersisa adalah bagaimana cara mengambil vektor yang mirip dengan vektor target dari kumpulan vektor yang sangat besar. Ketika berbicara tentang mesin pencari penyematan, kami menimbang-nimbang antara Faiss dan Milvus. Saya memperhatikan Milvus ketika saya melihat-lihat repositori yang sedang tren di GitHub pada bulan November 2019. Saya melihat proyek tersebut dan saya tertarik dengan API abstraknya. (Saat itu versi v0.5.x dan v0.10.2 saat ini).</p>
<p>Kami lebih memilih Milvus daripada Faiss. Di satu sisi, kami telah menggunakan Faiss sebelumnya, dan karenanya ingin mencoba sesuatu yang baru. Di sisi lain, dibandingkan dengan Milvus, Faiss lebih merupakan sebuah pustaka yang mendasari, oleh karena itu kurang nyaman digunakan. Setelah kami mempelajari lebih lanjut tentang Milvus, kami akhirnya memutuskan untuk mengadopsi Milvus karena dua fitur utamanya:</p>
<ul>
<li>Milvus sangat mudah digunakan. Yang perlu Anda lakukan hanyalah menarik citra Docker-nya dan memperbarui parameter berdasarkan skenario Anda sendiri.</li>
<li>Milvus mendukung lebih banyak indeks dan memiliki dokumentasi pendukung yang terperinci.</li>
</ul>
<p>Singkatnya, Milvus sangat ramah terhadap pengguna dan dokumentasinya cukup rinci. Jika Anda menemukan masalah apa pun, Anda biasanya dapat menemukan solusinya dalam dokumentasi; jika tidak, Anda selalu dapat memperoleh dukungan dari komunitas Milvus.</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Layanan cluster Milvus ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah memutuskan untuk menggunakan Milvus sebagai mesin pencari vektor fitur, kami mengonfigurasi node mandiri dalam lingkungan pengembangan (DEV). Node tersebut telah berjalan dengan baik selama beberapa hari, jadi kami berencana untuk menjalankan pengujian di lingkungan uji penerimaan pabrik (FAT). Jika node mandiri macet dalam produksi, seluruh layanan tidak akan tersedia. Oleh karena itu, kami perlu menerapkan layanan pencarian yang sangat tersedia.</p>
<p>Milvus menyediakan Mishards, sebuah middleware cluster sharding, dan Milvus-Helm untuk konfigurasi. Proses penerapan layanan cluster Milvus sangat sederhana. Kita hanya perlu memperbarui beberapa parameter dan mengemasnya untuk diterapkan di Kubernetes. Diagram di bawah ini dari dokumentasi Milvus menunjukkan bagaimana cara kerja Mishards:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-bagaimana-cara-kerja-mishards-dalam-dokumentasi-milvus.png</span> </span></p>
<p>Mishards mengalirkan permintaan dari hulu ke sub-modul yang membagi permintaan hulu, lalu mengumpulkan dan mengembalikan hasil dari sub-layanan ke hulu. Arsitektur keseluruhan dari solusi cluster berbasis Mishards ditunjukkan di bawah ini:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-solusi-klaster-berbasis-mishards-arsitektur.jpg</span> </span></p>
<p>Dokumentasi resmi memberikan pengenalan yang jelas tentang Mishards. Anda dapat merujuk ke <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> jika Anda tertarik.</p>
<p>Dalam sistem rekomendasi musik kami, kami menggunakan satu node yang dapat ditulis, dua node yang hanya dapat dibaca, dan satu instance middleware Mishards di Kubernetes, menggunakan Milvus-Helm. Setelah layanan ini berjalan dengan stabil di lingkungan FAT untuk sementara waktu, kami menerapkannya dalam produksi. Sejauh ini sudah stabil.</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 Rekomendasi musik I2I 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti yang telah disebutkan di atas, kami membangun sistem rekomendasi musik I2I Wanyin dengan menggunakan embedding yang telah diekstrak dari lagu-lagu yang ada. Pertama, kami memisahkan vokal dan BGM (pemisahan lagu) dari lagu baru yang diunggah oleh pengguna dan mengekstrak embedding BGM sebagai representasi fitur dari lagu tersebut. Hal ini juga membantu memilah versi cover dari lagu asli. Selanjutnya, kami menyimpan embeddings ini di Milvus, mencari lagu-lagu serupa berdasarkan lagu yang didengarkan pengguna, dan kemudian menyortir dan menyusun ulang lagu-lagu yang diambil untuk menghasilkan rekomendasi musik. Proses implementasinya ditunjukkan di bawah ini:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-implementasi-sistem-pemberi-rekomendasi-musik.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">🚫 Filter lagu duplikat<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>Skenario lain di mana kami menggunakan Milvus adalah pemfilteran lagu duplikat. Beberapa pengguna mengunggah lagu atau klip yang sama beberapa kali, dan lagu-lagu duplikat ini dapat muncul di daftar rekomendasi mereka. Ini berarti akan mempengaruhi pengalaman pengguna untuk menghasilkan rekomendasi tanpa pra-pemrosesan. Oleh karena itu, kita perlu mencari tahu lagu-lagu duplikat dan memastikan bahwa lagu-lagu tersebut tidak muncul di daftar yang sama melalui pra-pemrosesan.</p>
<p>Skenario lain di mana kami menggunakan Milvus adalah pemfilteran lagu duplikat. Beberapa pengguna mengunggah lagu atau klip yang sama beberapa kali, dan lagu-lagu duplikat ini dapat muncul dalam daftar rekomendasi mereka. Ini berarti akan mempengaruhi pengalaman pengguna untuk menghasilkan rekomendasi tanpa pra-pemrosesan. Oleh karena itu, kita perlu mencari tahu lagu-lagu duplikat dan memastikan bahwa lagu-lagu tersebut tidak muncul di daftar yang sama melalui pra-pemrosesan.</p>
<p>Sama seperti skenario sebelumnya, kami mengimplementasikan pemfilteran lagu duplikat dengan cara mencari vektor fitur yang serupa. Pertama, kami memisahkan vokal dan BGM dan mengambil sejumlah lagu yang mirip menggunakan Milvus. Untuk menyaring lagu duplikat secara akurat, kami mengekstrak sidik jari audio dari lagu target dan lagu-lagu yang mirip (dengan teknologi seperti Echoprint, Chromaprint, dll.), Menghitung kemiripan antara sidik jari audio dari lagu target dengan masing-masing sidik jari lagu yang mirip. Jika kemiripannya melampaui ambang batas, kami mendefinisikan sebuah lagu sebagai duplikat dari lagu target. Proses pencocokan sidik jari audio membuat pemfilteran lagu duplikat menjadi lebih akurat, tetapi juga memakan waktu. Oleh karena itu, dalam hal penyaringan lagu di perpustakaan musik yang sangat besar, kami menggunakan Milvus untuk menyaring kandidat lagu duplikat sebagai langkah awal.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-menggunakan-milvus-filter-lagu-lagu-musik-pembuat-rekomendasi-duplikat.png</span> </span></p>
<p>Untuk mengimplementasikan sistem rekomendasi I2I untuk perpustakaan musik Wanyin yang sangat besar, pendekatan kami adalah mengekstrak embedding lagu sebagai fiturnya, mengingat kembali embedding yang mirip dengan embedding lagu target, lalu menyortir dan menyusun ulang hasilnya untuk menghasilkan daftar rekomendasi bagi pengguna. Untuk mendapatkan rekomendasi real-time, kami memilih Milvus daripada Faiss sebagai mesin pencari kemiripan vektor fitur kami, karena Milvus terbukti lebih ramah pengguna dan canggih. Selain itu, kami juga menerapkan Milvus pada filter lagu duplikat kami, yang meningkatkan pengalaman dan efisiensi pengguna.</p>
<p>Anda dapat mengunduh <a href="https://enjoymusic.ai/wanyin">Aplikasi Wanyin</a> 🎶 dan mencobanya. (Catatan: mungkin tidak tersedia di semua toko aplikasi).</p>
<h3 id="📝-Authors" class="common-anchor-header">📝 Penulis:</h3><p>Jason, Insinyur Algoritma di Stepbeats Shiyu Chen, Insinyur Data di Zilliz</p>
<h3 id="📚-References" class="common-anchor-header">📚 Referensi:</h3><p>Mishards Docs: https://milvus.io/docs/v0.10.2/mishards.md Mishards: https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗 Jangan jadi orang asing, ikuti kami di <a href="https://twitter.com/milvusio/">Twitter</a> atau bergabunglah dengan kami di <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>!👇🏻</strong></p>
