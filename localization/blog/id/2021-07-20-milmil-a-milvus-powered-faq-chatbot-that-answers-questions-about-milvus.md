---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: >-
  MilMil Chatbot FAQ yang didukung Milvus yang Menjawab Pertanyaan Seputar
  Milvus
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: >-
  Menggunakan alat pencarian vektor sumber terbuka untuk membangun layanan
  penjawab pertanyaan.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil: Chatbot FAQ yang diberdayakan oleh Milvus yang Menjawab Pertanyaan Seputar Milvus</custom-h1><p>Komunitas sumber terbuka baru-baru ini menciptakan MilMil - chatbot FAQ Milvus yang dibuat oleh dan untuk pengguna Milvus. MilMil tersedia 24/7 di <a href="https://milvus.io/">Milvus.io</a> untuk menjawab pertanyaan umum tentang Milvus, basis data vektor sumber terbuka tercanggih di dunia.</p>
<p>Sistem penjawab pertanyaan ini tidak hanya membantu memecahkan masalah umum yang dihadapi pengguna Milvus dengan lebih cepat, tetapi juga mengidentifikasi masalah baru berdasarkan kiriman pengguna. Basis data MilMil mencakup pertanyaan-pertanyaan yang diajukan pengguna sejak proyek ini pertama kali dirilis di bawah lisensi sumber terbuka pada tahun 2019. Pertanyaan disimpan dalam dua koleksi, satu untuk Milvus 1.x dan sebelumnya dan satu lagi untuk Milvus 2.0.</p>
<p>MilMil saat ini hanya tersedia dalam bahasa Inggris.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">Bagaimana cara kerja MilMil?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil bergantung pada model <em>sentence-transformers/paraphrase-mpnet-base-v2</em> untuk mendapatkan representasi vektor dari basis data FAQ, kemudian Milvus digunakan untuk pencarian kemiripan vektor untuk mengembalikan pertanyaan-pertanyaan yang secara semantik mirip.</p>
<p>Pertama, data FAQ dikonversi menjadi vektor semantik menggunakan BERT, sebuah model pemrosesan bahasa alami (natural language processing/NLP). Kemudian, vektor-vektor tersebut dimasukkan ke dalam Milvus dan masing-masing diberi ID unik. Terakhir, pertanyaan dan jawaban dimasukkan ke dalam PostgreSQL, sebuah basis data relasional, bersama dengan ID vektornya.</p>
<p>Ketika pengguna mengirimkan pertanyaan, sistem akan mengubahnya menjadi vektor fitur menggunakan BERT. Selanjutnya, sistem akan mencari lima vektor yang paling mirip dengan vektor pertanyaan di Milvus dan mengambil ID-nya. Akhirnya, pertanyaan dan jawaban yang sesuai dengan ID vektor yang diambil dikembalikan ke pengguna.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>sistem-proses.png</span> </span></p>
<p>Lihat proyek <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">sistem penjawab pertanyaan</a> di bootcamp Milvus untuk menjelajahi kode yang digunakan untuk membangun chatbot AI.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">Tanya MilMil tentang Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk mengobrol dengan MilMil, buka halaman mana pun di <a href="https://milvus.io/">Milvus.io</a> dan klik ikon burung di pojok kanan bawah. Ketik pertanyaan Anda di kotak input teks dan tekan kirim. MilMil akan membalas Anda dalam hitungan milidetik! Selain itu, daftar tarik-turun di sudut kiri atas dapat digunakan untuk beralih di antara dokumentasi teknis untuk versi Milvus yang berbeda.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>Setelah mengirimkan pertanyaan, bot akan segera mengembalikan tiga pertanyaan yang secara semantik mirip dengan pertanyaan kueri. Anda dapat mengklik "Lihat jawaban" untuk menelusuri jawaban potensial untuk pertanyaan Anda, atau klik "Lihat lebih banyak" untuk melihat lebih banyak pertanyaan yang terkait dengan pencarian Anda. Jika jawaban yang sesuai tidak tersedia, klik "Masukkan tanggapan Anda di sini" untuk mengajukan pertanyaan Anda beserta alamat email. Bantuan dari komunitas Milvus akan segera tiba!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>Cobalah MilMil dan beri tahu kami pendapat Anda. Semua pertanyaan, komentar, atau segala bentuk umpan balik sangat kami harapkan.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Jangan menjadi orang asing<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Temukan atau berkontribusi untuk Milvus di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Terhubung dengan kami di <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
