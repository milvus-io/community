---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >-
  Tutorial Praktis: Membuat Asisten Dokumen Bertenaga RAG dalam 10 Menit dengan
  Dify dan Milvus
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  Pelajari cara membuat asisten dokumen bertenaga AI menggunakan Retrieval
  Augmented Generation (RAG) dengan Dify dan Milvus dalam tutorial pengembang
  singkat dan praktis ini.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bagaimana jika Anda dapat mengubah seluruh pustaka dokumentasi Anda-ribuan halaman spesifikasi teknis, wiki internal, dan dokumentasi kode-menjadi asisten AI cerdas yang langsung menjawab pertanyaan spesifik?</p>
<p>Lebih baik lagi, bagaimana jika Anda dapat membuatnya dalam waktu yang lebih singkat daripada waktu yang dibutuhkan untuk memperbaiki konflik penggabungan?</p>
<p>Itulah janji <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation</a> (RAG) jika diimplementasikan dengan cara yang benar.</p>
<p>Meskipun ChatGPT dan LLM lainnya sangat mengesankan, mereka dengan cepat mencapai batasnya ketika ditanya tentang dokumentasi, basis kode, atau basis pengetahuan spesifik perusahaan Anda. RAG menjembatani kesenjangan ini dengan mengintegrasikan data milik Anda ke dalam percakapan, memberi Anda kemampuan AI yang secara langsung relevan dengan pekerjaan Anda.</p>
<p>Masalahnya? Implementasi RAG tradisional terlihat seperti ini:</p>
<ul>
<li><p>Menulis pipeline pembuatan penyematan khusus</p></li>
<li><p>Mengonfigurasi dan menggunakan basis data vektor</p></li>
<li><p>Merekayasa templat perintah yang kompleks</p></li>
<li><p>Membangun logika pengambilan dan ambang batas kemiripan</p></li>
<li><p>Membuat antarmuka yang dapat digunakan</p></li>
</ul>
<p>Tetapi bagaimana jika Anda bisa langsung melompat ke hasil?</p>
<p>Dalam tutorial ini, kita akan membuat aplikasi RAG sederhana menggunakan dua alat yang berfokus pada pengembang:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: Platform sumber terbuka yang menangani orkestrasi RAG dengan konfigurasi minimal</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: Basis data vektor sumber terbuka yang sangat cepat yang dibuat khusus untuk pencarian kemiripan dan pencarian AI</p></li>
</ul>
<p>Di akhir panduan 10 menit ini, Anda akan memiliki asisten AI yang dapat menjawab pertanyaan mendetail tentang koleksi dokumen apa pun yang Anda berikan - tidak perlu memiliki gelar dalam bidang pembelajaran mesin.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">Apa yang akan Anda Bangun<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Hanya dalam beberapa menit kerja aktif, Anda akan membuat:</p>
<ul>
<li><p>Pipeline pemrosesan dokumen yang mengubah PDF apa pun menjadi pengetahuan yang dapat ditanyakan</p></li>
<li><p>Sistem pencarian vektor yang menemukan informasi yang tepat</p></li>
<li><p>Antarmuka chatbot yang menjawab pertanyaan teknis dengan akurasi yang tepat</p></li>
<li><p>Solusi yang dapat diterapkan yang dapat Anda integrasikan dengan alat yang sudah ada</p></li>
</ul>
<p>Bagian terbaiknya? Sebagian besar dikonfigurasikan melalui antarmuka pengguna (UI) yang sederhana, bukan kode khusus.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">Apa yang Anda Perlukan<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>Pengetahuan dasar tentang Docker (cukup level <code translate="no">docker-compose up -d</code> )</p></li>
<li><p>Kunci API OpenAI</p></li>
<li><p>Dokumen PDF untuk bereksperimen (kita akan menggunakan makalah penelitian)</p></li>
</ul>
<p>Siap untuk membuat sesuatu yang benar-benar berguna dalam waktu singkat? Mari kita mulai!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Membangun Aplikasi RAG Anda dengan Milvus dan Dify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada bagian ini, kita akan membuat aplikasi RAG sederhana dengan Dify, di mana kita dapat mengajukan pertanyaan tentang informasi yang terkandung dalam makalah penelitian. Untuk makalah penelitian, Anda dapat menggunakan makalah apa pun yang Anda inginkan; namun, dalam kasus ini, kita akan menggunakan makalah terkenal yang memperkenalkan kita pada arsitektur Transformer, &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>.&quot;</p>
<p>Kita akan menggunakan Milvus sebagai penyimpanan vektor, di mana kita akan menyimpan semua konteks yang diperlukan. Untuk model penyematan dan LLM, kita akan menggunakan model dari OpenAI. Oleh karena itu, kita perlu menyiapkan kunci API OpenAI terlebih dahulu. Anda dapat mempelajari lebih lanjut tentang cara menyiapkannya<a href="https://platform.openai.com/docs/quickstart"> di sini</a>.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">Langkah 1: Memulai Dify dan Kontainer Milvus</h3><p>Dalam contoh ini, kita akan menghosting sendiri Dify dengan Docker Compose. Oleh karena itu, sebelum kita mulai, pastikan bahwa Docker telah terinstal pada mesin lokal Anda. Jika belum, instal Docker dengan merujuk ke<a href="https://docs.docker.com/desktop/"> laman instalasinya.</a></p>
<p>Setelah Docker terinstal, kita perlu mengkloning kode sumber Dify ke dalam mesin lokal kita dengan perintah berikut:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>Selanjutnya, buka direktori <code translate="no">docker</code> di dalam kode sumber yang baru saja Anda kloning. Di sana, Anda perlu menyalin berkas <code translate="no">.env</code> dengan perintah berikut:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Singkatnya, file <code translate="no">.env</code> berisi konfigurasi yang diperlukan untuk mengatur aplikasi Dify Anda dan menjalankannya, seperti pemilihan basis data vektor, kredensial yang diperlukan untuk mengakses basis data vektor Anda, alamat aplikasi Dify Anda, dll.</p>
<p>Karena kita akan menggunakan Milvus sebagai basis data vektor, maka kita perlu mengubah nilai variabel <code translate="no">VECTOR_STORE</code> di dalam file <code translate="no">.env</code> menjadi <code translate="no">milvus</code>. Selain itu, kita juga perlu mengubah variabel <code translate="no">MILVUS_URI</code> menjadi <code translate="no">http://host.docker.internal:19530</code> untuk memastikan bahwa tidak ada masalah komunikasi antara kontainer Docker nantinya setelah penerapan.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang kita siap untuk memulai kontainer Docker. Untuk melakukannya, yang perlu kita lakukan adalah menjalankan perintah <code translate="no">docker compose up -d</code>. Setelah selesai, Anda akan melihat keluaran serupa di terminal Anda seperti di bawah ini:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kita dapat memeriksa status semua kontainer dan melihat apakah mereka aktif dan berjalan dengan sehat dengan perintah <code translate="no">docker compose ps</code>. Jika semuanya sehat, Anda akan melihat keluaran seperti di bawah ini:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dan terakhir, jika kita menuju ke<a href="http://localhost/install"> </a>http://localhost/install, Anda akan melihat halaman arahan Dify di mana kita dapat mendaftar dan mulai membangun aplikasi RAG kita dalam waktu singkat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah Anda mendaftar, maka Anda bisa masuk ke Dify dengan kredensial Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">Langkah 2: Menyiapkan Kunci API OpenAI</h3><p>Hal pertama yang perlu kita lakukan setelah mendaftar ke Dify adalah menyiapkan kunci API yang akan kita gunakan untuk memanggil model penyematan dan juga LLM. Karena kita akan menggunakan model dari OpenAI, kita perlu memasukkan kunci API OpenAI ke dalam profil kita. Untuk melakukannya, buka "Pengaturan" dengan mengarahkan kursor ke profil Anda di bagian kanan atas UI, seperti yang dapat Anda lihat pada gambar di bawah ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Selanjutnya, buka "Penyedia Model," arahkan kursor ke OpenAI, lalu klik "Pengaturan." Anda kemudian akan melihat layar pop-up di mana Anda diminta untuk memasukkan kunci API OpenAI Anda. Setelah selesai, kita siap untuk menggunakan model dari OpenAI sebagai model penyematan dan LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">Langkah 3: Memasukkan Dokumen ke dalam Basis Pengetahuan</h3><p>Sekarang mari kita simpan basis pengetahuan untuk aplikasi RAG kita. Basis pengetahuan terdiri dari kumpulan dokumen atau teks internal yang dapat digunakan sebagai konteks yang relevan untuk membantu LLM menghasilkan respons yang lebih akurat.</p>
<p>Dalam kasus penggunaan kami, basis pengetahuan kami pada dasarnya adalah kertas "Perhatian adalah yang Anda Butuhkan". Namun, kami tidak dapat menyimpan kertas tersebut karena beberapa alasan. Pertama, makalah tersebut terlalu panjang, dan memberikan konteks yang terlalu panjang pada LLM tidak akan membantu karena konteksnya terlalu luas. Kedua, kita tidak dapat melakukan pencarian kemiripan untuk mendapatkan konteks yang paling relevan jika input kita berupa teks mentah.</p>
<p>Oleh karena itu, setidaknya ada dua langkah yang perlu kita lakukan sebelum menyimpan dokumen ke dalam basis pengetahuan. Pertama, kita perlu membagi makalah menjadi potongan-potongan teks, dan kemudian mengubah setiap potongan menjadi embedding melalui model embedding. Terakhir, kita dapat menyimpan embedding ini ke dalam Milvus sebagai basis data vektor.</p>
<p>Dify memudahkan kita untuk membagi teks di kertas menjadi beberapa bagian dan mengubahnya menjadi embedding. Yang perlu kita lakukan adalah mengunggah file PDF makalah, mengatur panjang potongan, dan memilih model penyematan melalui penggeser. Untuk melakukan semua langkah ini, buka &quot;Pengetahuan&quot; lalu klik &quot;Buat Pengetahuan&quot;. Selanjutnya, Anda akan diminta untuk mengunggah file PDF dari komputer lokal Anda. Oleh karena itu, akan lebih baik jika Anda mengunduh makalah dari ArXiv dan menyimpannya di komputer Anda terlebih dahulu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah kita mengunggah berkas, kita dapat mengatur panjang potongan, metode pengindeksan, model penyematan yang ingin kita gunakan, dan pengaturan pengambilan.</p>
<p>Di area "Pengaturan Chunk", Anda dapat memilih angka berapa pun sebagai panjang chunk maksimum (dalam kasus penggunaan kami, kami akan mengaturnya menjadi 100). Selanjutnya, untuk "Metode Indeks," kita perlu memilih opsi "Kualitas Tinggi" karena ini akan memungkinkan kita untuk melakukan pencarian kemiripan untuk menemukan konteks yang relevan. Untuk "Embedding Model," Anda dapat memilih model penyematan apa pun dari OpenAI yang Anda inginkan, tetapi dalam contoh ini, kita akan menggunakan model penyematan teks-3-kecil. Terakhir, untuk "Pengaturan Pengambilan," kita perlu memilih "Pencarian Vektor" karena kita ingin melakukan pencarian kemiripan untuk menemukan konteks yang paling relevan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sekarang jika Anda mengklik "Simpan &amp; Proses" dan semuanya berjalan dengan baik, Anda akan melihat tanda centang hijau muncul seperti yang ditunjukkan pada tangkapan layar berikut:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">Langkah 4: Membuat Aplikasi RAG</h3><p>Sampai di sini, kita telah berhasil membuat basis pengetahuan dan menyimpannya di dalam basis data Milvus. Sekarang kita siap untuk membuat aplikasi RAG.</p>
<p>Membuat aplikasi RAG dengan Dify sangat mudah. Kita harus pergi ke "Studio", bukan "Pengetahuan" seperti sebelumnya, lalu klik "Buat dari Kosong". Selanjutnya, pilih "Chatbot" sebagai jenis aplikasi dan beri nama Aplikasi Anda di dalam kolom yang tersedia. Setelah selesai, klik "Buat." Sekarang Anda akan melihat halaman berikut:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Di bawah bidang "Instruksi", kita dapat menulis perintah sistem seperti "Jawab pertanyaan dari pengguna secara ringkas." Selanjutnya, sebagai "Context", kita perlu mengklik simbol "Add", lalu menambahkan basis pengetahuan yang baru saja kita buat. Dengan cara ini, aplikasi RAG kita akan mengambil konteks yang mungkin dari basis pengetahuan ini untuk menjawab pertanyaan pengguna.</p>
<p>Setelah kita menambahkan basis pengetahuan ke aplikasi RAG, hal terakhir yang perlu kita lakukan adalah memilih LLM dari OpenAI. Untuk melakukannya, Anda dapat mengklik daftar model yang tersedia di sudut kanan atas, seperti yang dapat Anda lihat pada gambar di bawah ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dan sekarang kita siap untuk mempublikasikan aplikasi RAG kita! Di pojok kanan atas, klik "Publikasikan," dan di sana Anda dapat menemukan banyak cara untuk mempublikasikan aplikasi RAG kita: kita dapat menjalankannya di browser, menyematkannya di situs web, atau mengakses aplikasi melalui API. Dalam contoh ini, kita hanya akan menjalankan aplikasi kita di browser, jadi kita bisa mengklik &quot;Jalankan Aplikasi&quot;.</p>
<p>Dan selesai! Sekarang Anda dapat bertanya kepada LLM tentang apa pun yang berhubungan dengan makalah "Perhatian adalah yang Anda Butuhkan" atau dokumen apa pun yang ada di dalam basis pengetahuan kami.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Anda sekarang telah membangun sebuah aplikasi RAG yang berfungsi menggunakan Dify dan Milvus, dengan kode dan konfigurasi yang minimal. Pendekatan ini membuat arsitektur RAG yang kompleks dapat diakses oleh para pengembang tanpa memerlukan keahlian yang mendalam dalam basis data vektor atau integrasi LLM:</p>
<ol>
<li>Biaya<strong>penyiapan yang rendah</strong>: Menggunakan Docker Compose menyederhanakan penerapan</li>
<li><strong>Orkestrasi tanpa kode/kode rendah</strong>: Dify menangani sebagian besar pipeline RAG</li>
<li><strong>Basis data vektor yang siap produksi</strong>: Milvus menyediakan penyimpanan dan pengambilan embedding yang efisien</li>
<li><strong>Arsitektur yang dapat diperluas</strong>: Mudah untuk menambahkan dokumen atau menyesuaikan parameter Untuk penerapan produksi, pertimbangkan:</li>
</ol>
<ul>
<li>Menyiapkan autentikasi untuk aplikasi Anda</li>
<li>Mengonfigurasi penskalaan yang tepat untuk Milvus (terutama untuk koleksi dokumen yang lebih besar)</li>
<li>Menerapkan pemantauan untuk instance Dify dan Milvus Anda</li>
<li>Menyempurnakan parameter pengambilan untuk kinerja yang optimal Kombinasi Dify dan Milvus memungkinkan pengembangan aplikasi RAG yang cepat yang secara efektif dapat meningkatkan pengetahuan internal organisasi Anda dengan model bahasa besar (LLM) modern. Selamat membangun!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">Sumber Daya Tambahan<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Dokumentasi Dify</a></li>
<li><a href="https://milvus.io/docs">Dokumentasi Milvus</a></li>
<li><a href="https://zilliz.com/learn/vector-database">Dasar-Dasar Basis Data Vektor</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Pola Implementasi RAG</a></li>
</ul>
