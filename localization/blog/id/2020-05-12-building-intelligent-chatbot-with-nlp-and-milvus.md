---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: Arsitektur Keseluruhan
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: Bot QA Generasi Berikutnya ada di sini
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>Membangun Sistem QA Cerdas dengan NLP dan Milvus</custom-h1><p>Proyek Milvus：github.com/milvus-io/milvus</p>
<p>Sistem penjawab pertanyaan umumnya digunakan dalam bidang pemrosesan bahasa alami. Sistem ini digunakan untuk menjawab pertanyaan dalam bentuk bahasa alami dan memiliki berbagai macam aplikasi. Aplikasi yang umum digunakan meliputi: interaksi suara cerdas, layanan pelanggan online, akuisisi pengetahuan, obrolan emosional yang dipersonalisasi, dan banyak lagi. Sebagian besar sistem penjawab pertanyaan dapat diklasifikasikan sebagai: sistem penjawab pertanyaan generatif dan pengambilan, sistem penjawab pertanyaan satu putaran dan sistem penjawab pertanyaan banyak putaran, sistem penjawab pertanyaan terbuka, dan sistem penjawab pertanyaan khusus.</p>
<p>Artikel ini terutama membahas tentang sistem QA yang dirancang untuk bidang tertentu, yang biasanya disebut robot layanan pelanggan yang cerdas. Di masa lalu, membangun robot layanan pelanggan biasanya membutuhkan konversi pengetahuan domain menjadi serangkaian aturan dan grafik pengetahuan. Proses konstruksi sangat bergantung pada kecerdasan "manusia". Dengan penerapan deep learning dalam pemrosesan bahasa alami (NLP), mesin pembaca dapat secara otomatis menemukan jawaban atas pertanyaan yang cocok secara langsung dari dokumen. Model bahasa deep learning mengubah pertanyaan dan dokumen menjadi vektor semantik untuk menemukan jawaban yang cocok.</p>
<p>Artikel ini menggunakan model BERT sumber terbuka Google dan Milvus, mesin pencari vektor sumber terbuka, untuk dengan cepat membangun bot tanya jawab berdasarkan pemahaman semantik.</p>
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
    </button></h2><p>Artikel ini mengimplementasikan sistem penjawab pertanyaan melalui pencocokan kemiripan semantik. Proses konstruksi secara umum adalah sebagai berikut:</p>
<ol>
<li>Dapatkan sejumlah besar pertanyaan dengan jawaban dalam bidang tertentu (kumpulan pertanyaan standar).</li>
<li>Gunakan model BERT untuk mengubah pertanyaan-pertanyaan ini menjadi vektor fitur dan menyimpannya di Milvus. Dan Milvus akan memberikan ID vektor untuk setiap vektor fitur pada saat yang bersamaan.</li>
<li>Simpan ID pertanyaan yang representatif dan jawaban yang sesuai di PostgreSQL.</li>
</ol>
<p>Ketika seorang pengguna mengajukan pertanyaan:</p>
<ol>
<li>Model BERT mengubahnya menjadi vektor fitur.</li>
<li>Milvus melakukan pencarian kemiripan dan mengambil ID yang paling mirip dengan pertanyaan.</li>
<li>PostgreSQL mengembalikan jawaban yang sesuai.</li>
</ol>
<p>Diagram arsitektur sistem adalah sebagai berikut (garis biru mewakili proses impor dan garis kuning mewakili proses kueri):</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-sistem-arsitektur-milvus-bert-postgresql.png</span> </span></p>
<p>Selanjutnya, kami akan menunjukkan kepada Anda bagaimana cara membangun sistem tanya jawab online selangkah demi selangkah.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Langkah-langkah untuk Membangun Sistem Tanya Jawab<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum memulai, Anda perlu menginstal Milvus dan PostgreSQL. Untuk langkah-langkah instalasi spesifik, lihat situs web resmi Milvus.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. Persiapan data</h3><p>Data percobaan dalam artikel ini berasal dari: https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>Kumpulan data tersebut berisi pasangan data pertanyaan dan jawaban yang berhubungan dengan industri asuransi. Dalam artikel ini kami mengekstrak 20.000 pasangan pertanyaan dan jawaban darinya. Melalui kumpulan data pertanyaan dan jawaban ini, Anda dapat dengan cepat membangun robot layanan pelanggan untuk industri asuransi.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. Menghasilkan vektor fitur</h3><p>Sistem ini menggunakan model yang telah dilatih sebelumnya oleh BERT. Unduh dari tautan di bawah ini sebelum memulai layanan: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>Gunakan model ini untuk mengubah basis data pertanyaan menjadi vektor fitur untuk pencarian kemiripan di masa mendatang. Untuk informasi lebih lanjut tentang layanan BERT, lihat https://github.com/hanxiao/bert-as-service.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-code-block.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Mengimpor ke Milvus dan PostgreSQL</h3><p>Normalisasi dan impor vektor fitur yang dihasilkan impor ke Milvus, dan kemudian impor ID yang dikembalikan oleh Milvus dan jawaban yang sesuai ke PostgreSQL. Berikut ini menunjukkan struktur tabel dalam PostgreSQL:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-impor-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-impor-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. Mengambil Jawaban</h3><p>Pengguna memasukkan sebuah pertanyaan, dan setelah membuat vektor fitur melalui BERT, mereka dapat menemukan pertanyaan yang paling mirip di perpustakaan Milvus. Artikel ini menggunakan jarak kosinus untuk merepresentasikan kemiripan antara dua kalimat. Karena semua vektor dinormalisasi, semakin dekat jarak kosinus dari dua vektor fitur ke 1, semakin tinggi kemiripannya.</p>
<p>Dalam praktiknya, sistem Anda mungkin tidak memiliki pertanyaan yang sangat cocok di perpustakaan. Kemudian, Anda dapat menetapkan ambang batas 0,9. Jika jarak kemiripan terbesar yang diperoleh kurang dari ambang batas ini, sistem akan meminta agar tidak menyertakan pertanyaan terkait.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-mengambil-jawaban.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">Demonstrasi Sistem<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Berikut ini adalah contoh tampilan antarmuka sistem:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-sistem-aplikasi.png</span> </span></p>
<p>Masukkan pertanyaan Anda dalam kotak dialog dan Anda akan menerima jawaban yang sesuai:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application-2.png</span> </span></p>
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
    </button></h2><p>Setelah membaca artikel ini, kami harap Anda dapat dengan mudah membuat Sistem Tanya Jawab Anda sendiri.</p>
<p>Dengan model BERT, Anda tidak perlu lagi menyortir dan mengatur korpus teks sebelumnya. Pada saat yang sama, berkat kinerja tinggi dan skalabilitas tinggi dari mesin pencari vektor open source Milvus, sistem QA Anda dapat mendukung korpus hingga ratusan juta teks.</p>
<p>Milvus telah secara resmi bergabung dengan Linux AI (LF AI) Foundation untuk inkubasi. Anda dipersilakan untuk bergabung dengan komunitas Milvus dan bekerja sama dengan kami untuk mempercepat penerapan teknologi AI!</p>
<p>=&gt; Coba demo online kami di sini: https://www.milvus.io/scenarios</p>
