---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: >-
  Akankah Penyematan Gemini 2 Membunuh Pencarian Multi-Vektor dalam Basis Data
  Vektor?
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: >-
  Google Gemini menyematkan teks, gambar, video, dan audio ke dalam satu vektor.
  Apakah itu akan membuat pencarian multi-vektor menjadi usang? Tidak, dan
  inilah alasannya.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Google merilis <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2</a> - model penyematan multimodal pertama yang memetakan teks, gambar, video, audio, dan dokumen ke dalam satu ruang vektor.</p>
<p>Anda dapat menyematkan klip video, foto produk, dan paragraf teks dengan satu panggilan API, dan semuanya akan mendarat di lingkungan semantik yang sama.</p>
<p>Sebelum model seperti ini, Anda harus menjalankan setiap modalitas melalui model spesialisnya sendiri, dan kemudian menyimpan setiap output dalam kolom vektor yang terpisah. Kolom multi-vektor dalam basis data vektor seperti <a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> dibangun dengan tepat untuk skenario seperti itu.</p>
<p>Dengan Gemini Embedding 2 yang memetakan beberapa modalitas pada saat yang sama, sebuah pertanyaan muncul: berapa banyak kolom multi-vektor yang dapat digantikan oleh Gemini Embedding 2, dan di mana kekurangannya? Artikel ini akan menjelaskan di mana setiap pendekatan cocok dan bagaimana mereka bekerja bersama.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">Apa yang Berbeda dari Gemini Embedding 2 Jika Dibandingkan dengan CLIP/CLAP<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>Model embedding mengubah data yang tidak terstruktur menjadi vektor padat sehingga item yang secara semantik mirip akan mengelompok dalam ruang vektor. Apa yang membuat Gemini Embedding 2 berbeda adalah bahwa ia melakukan hal ini secara native di seluruh modalitas, tanpa model yang terpisah dan tidak ada pipa jahitan.</p>
<p>Hingga saat ini, penyematan multimodal berarti model penyandi ganda yang dilatih dengan pembelajaran kontras: <a href="https://openai.com/index/clip/">CLIP</a> untuk gambar-teks, <a href="https://arxiv.org/abs/2211.06687">CLAP</a> untuk audio-teks, masing-masing menangani dua modalitas. Jika Anda membutuhkan ketiganya, Anda menjalankan beberapa model dan mengoordinasikan ruang penyematannya sendiri.</p>
<p>Sebagai contoh, mengindeks podcast dengan seni sampul berarti menjalankan CLIP untuk gambar, CLAP untuk audio, dan penyandi teks untuk transkrip - tiga model, tiga ruang vektor, dan logika perpaduan khusus untuk membuat nilainya sebanding pada waktu kueri.</p>
<p>Sebaliknya, menurut <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">pengumuman resmi Google</a>, inilah yang didukung oleh Gemini Embedding 2:</p>
<ul>
<li><strong>Teks</strong> hingga 8.192 token per permintaan</li>
<li><strong>Gambar</strong> hingga 6 per permintaan (PNG, JPEG)</li>
<li><strong>Video</strong> hingga 120 detik (MP4, MOV)</li>
<li><strong>Audio</strong> hingga 80 detik, disematkan secara native tanpa transkripsi ASR</li>
<li><strong>Dokumen</strong> masukan PDF, hingga 6 halaman</li>
</ul>
<p>Menggabungkan gambar<strong>input</strong> + teks bersama-sama dalam satu panggilan penyematan</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Penyematan Gemini 2 vs CLIP / CLAP Satu Model vs Banyak Model untuk Penyematan Multimodal</h3><table>
<thead>
<tr><th></th><th><strong>Pembuat enkode ganda (CLIP, CLAP)</strong></th><th><strong>Penyematan Gemini 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Modalitas per model</strong></td><td>2 (misalnya, gambar + teks)</td><td>5 (teks, gambar, video, audio, PDF)</td></tr>
<tr><td><strong>Menambahkan modalitas baru</strong></td><td>Anda membawa model lain dan menyelaraskan spasi secara manual</td><td>Sudah termasuk - satu panggilan API</td></tr>
<tr><td><strong>Masukan lintas-modal</strong></td><td>Penyandi terpisah, panggilan terpisah</td><td>Masukan yang disisipkan (misalnya, gambar + teks dalam satu permintaan)</td></tr>
<tr><td><strong>Arsitektur</strong></td><td>Penyandi penglihatan dan teks yang terpisah diselaraskan melalui kehilangan kontras</td><td>Model tunggal yang mewarisi pemahaman multimodal dari Gemini</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Keunggulan Gemini Embedding 2: Penyederhanaan Pipeline<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>Ambil contoh skenario umum: membangun mesin pencari semantik di atas perpustakaan video pendek. Setiap klip memiliki bingkai visual, audio yang diucapkan, dan teks subtitle - semuanya menggambarkan konten yang sama.</p>
<p><strong>Sebelum Gemini Embedding 2</strong>, Anda memerlukan tiga model penyematan terpisah (gambar, audio, teks), tiga kolom vektor, dan pipeline pengambilan yang melakukan pemanggilan kembali multi arah, fusi hasil, dan deduplikasi. Itu adalah banyak bagian yang bergerak untuk dibangun dan dipelihara.</p>
<p><strong>Sekarang</strong>, Anda dapat memasukkan frame, audio, dan subtitle video ke dalam satu panggilan API dan mendapatkan satu vektor terpadu yang menangkap gambaran semantik secara lengkap.</p>
<p>Tentu saja, Anda tergoda untuk menyimpulkan bahwa kolom multi-vektor sudah mati. Tetapi kesimpulan itu membingungkan "representasi terpadu multimodal" dengan "pengambilan vektor multi-dimensi." Keduanya memecahkan masalah yang berbeda, dan memahami perbedaannya penting untuk memilih pendekatan yang tepat.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Apa yang dimaksud dengan Pencarian Multi-Vektor di Milvus?<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Di <a href="http://milvus.io">Milvus</a>, pencarian multi-vektor berarti mencari objek yang sama melalui beberapa bidang vektor sekaligus dan kemudian menggabungkan hasil pencarian tersebut dengan pengurutan ulang.</p>
<p>Ide intinya: satu objek sering kali memiliki lebih dari satu makna. Sebuah produk memiliki judul <em>dan</em> deskripsi. Sebuah postingan media sosial memiliki judul <em>dan</em> gambar. Setiap sudut memberi tahu Anda sesuatu yang berbeda, sehingga masing-masing memiliki bidang vektornya sendiri.</p>
<p>Milvus mencari setiap bidang vektor secara independen, lalu menggabungkan set kandidat menggunakan perangking ulang. Dalam API, setiap permintaan memetakan ke bidang dan konfigurasi pencarian yang berbeda, dan hybrid_search() mengembalikan hasil gabungan.</p>
<p>Ada dua pola umum yang bergantung pada hal ini:</p>
<ul>
<li><strong>Pencarian Vektor Jarang+Padat.</strong> Anda memiliki katalog produk di mana pengguna mengetikkan kueri seperti "Nike Air Max merah ukuran 10." Vektor padat menangkap maksud semantik ("sepatu lari, merah, Nike"), tetapi melewatkan ukuran yang tepat. Vektor yang jarang melalui <a href="https://milvus.io/docs/full-text-search.md">BM25</a> atau model seperti <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a> akan menangkap kata kunci yang cocok. Anda perlu menjalankan keduanya secara paralel, kemudian diurutkan ulang - karena tidak ada yang memberikan hasil yang baik untuk kueri yang menggabungkan bahasa alami dengan pengidentifikasi spesifik seperti SKU, nama file, atau kode kesalahan.</li>
<li><strong>Pencarian Vektor Multimodal.</strong> Seorang pengguna mengunggah foto gaun dan mengetik "sesuatu seperti ini tetapi berwarna biru." Anda mencari kolom penyematan gambar untuk kemiripan visual dan kolom penyematan teks untuk batasan warna secara bersamaan. Setiap kolom memiliki indeks dan modelnya sendiri - <a href="https://openai.com/index/clip/">CLIP</a> untuk gambar, penyandi teks untuk deskripsi - dan hasilnya digabungkan.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> menjalankan kedua pola tersebut sebagai <a href="https://milvus.io/docs/multi-vector-search.md">pencarian ANN</a> paralel dengan pemeringkatan ulang melalui RRFRanker. Definisi skema, konfigurasi multi-indeks, dan BM25 bawaan semuanya ditangani dalam satu sistem.</p>
<p>Sebagai contoh, pertimbangkan katalog produk di mana setiap item menyertakan deskripsi teks dan gambar. Anda dapat menjalankan tiga pencarian terhadap data tersebut secara paralel:</p>
<ul>
<li><strong>Pencarian teks semantik.</strong> Menanyakan deskripsi teks dengan vektor padat yang dihasilkan oleh model seperti <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>, <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a>, atau <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a> embeddings API.</li>
<li><strong>Pencarian teks lengkap.</strong> Menanyakan deskripsi teks dengan vektor yang jarang menggunakan <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> atau model penyematan yang jarang seperti <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> atau <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a>.</li>
<li><strong>Pencarian gambar lintas-modal.</strong> Menanyakan gambar produk menggunakan kueri teks, dengan vektor padat dari model seperti <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>.</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Dengan Gemini Embedding 2, Akankah Pencarian Multi-Vektor Masih Penting?<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2 menangani lebih banyak modalitas dalam satu panggilan, yang sangat menyederhanakan pipeline. Tetapi penyematan multimodal terpadu bukanlah hal yang sama dengan pencarian multi-vektor. Dengan kata lain, ya, pencarian multi-vektor akan tetap penting.</p>
<p>Gemini Embedding 2 memetakan teks, gambar, video, audio, dan dokumen ke dalam satu ruang vektor bersama. Google <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">memposisikannya</a> untuk pencarian semantik multimodal, pencarian dokumen, dan rekomendasi - skenario di mana semua modalitas mendeskripsikan konten yang sama dan tumpang tindih antar modalitas yang tinggi membuat satu vektor menjadi layak.</p>
<p>Pencarian multi-vektor<a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> memecahkan masalah yang berbeda. Ini adalah cara untuk mencari objek yang sama melalui <strong>beberapa bidang vektor -</strong>misalnya, judul ditambah deskripsi, atau teks ditambah gambar - dan kemudian menggabungkan sinyal-sinyal tersebut selama pencarian. Dengan kata lain, ini adalah tentang mempertahankan dan menanyakan <strong>beberapa tampilan semantik</strong> dari item yang sama, bukan hanya memadatkan semuanya ke dalam satu representasi.</p>
<p>Tetapi data dunia nyata jarang sekali cocok dengan satu penyematan. Sistem biometrik, pengambilan alat agen, dan e-commerce dengan tujuan campuran, semuanya bergantung pada vektor yang berada di ruang semantik yang sangat berbeda. Di situlah tepatnya di mana penyematan terpadu berhenti bekerja.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">Mengapa Satu Penyematan Saja Tidak Cukup: Pengambilan Multi-Vektor dalam Praktik</h3><p>Gemini Embedding 2 menangani kasus di mana semua modalitas Anda menggambarkan hal yang sama. Pencarian multi-vektor menangani segala sesuatu yang lain - dan "segala sesuatu yang lain" mencakup sebagian besar sistem pengambilan produksi.</p>
<p><strong>Biometrik.</strong> Seorang pengguna memiliki vektor wajah, rekaman suara, sidik jari, dan iris mata. Semua ini menggambarkan fitur biologis yang sepenuhnya independen tanpa tumpang tindih semantik. Anda tidak dapat menggabungkannya menjadi satu vektor - masing-masing membutuhkan kolom, indeks, dan metrik kemiripannya sendiri.</p>
<p><strong>Alat bantu agen.</strong> Asisten pengkodean seperti OpenClaw menyimpan vektor semantik yang padat untuk riwayat percakapan ("masalah penerapan dari minggu lalu") bersama vektor BM25 yang jarang untuk pencocokan yang tepat pada nama file, perintah CLI, dan parameter konfigurasi. Tujuan pengambilan yang berbeda, jenis vektor yang berbeda, jalur pencarian yang independen, kemudian diurutkan ulang.</p>
<p><strong>E-commerce dengan tujuan yang beragam.</strong> Video promo produk dan gambar detail bekerja dengan baik sebagai penyematan Gemini terpadu. Namun saat pengguna menginginkan "gaun yang terlihat seperti ini" <em>dan</em> "kain yang sama, ukuran M", Anda memerlukan kolom kemiripan visual dan kolom atribut terstruktur dengan indeks terpisah serta lapisan pengambilan hibrida.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Kapan Menggunakan Penyematan Gemini 2 vs Kolom Multi-vektor<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Skenario</strong></th><th><strong>Apa yang harus digunakan</strong></th><th><strong>Mengapa</strong></th></tr>
</thead>
<tbody>
<tr><td>Semua modalitas mendeskripsikan konten yang sama (bingkai video + audio + subtitle)</td><td>Gemini Embedding 2 vektor terpadu</td><td>Tumpang tindih semantik yang tinggi berarti satu vektor menangkap gambaran lengkap - tidak perlu penggabungan</td></tr>
<tr><td>Anda membutuhkan ketepatan kata kunci bersama dengan semantic recall (BM25 + padat)</td><td>Kolom multi-vektor dengan hybrid_search()</td><td>Vektor yang jarang dan padat memiliki tujuan pencarian yang berbeda yang tidak dapat digabungkan menjadi satu penyematan</td></tr>
<tr><td>Pencarian lintas-modal adalah kasus penggunaan utama (kueri teks → hasil gambar)</td><td>Gemini Menanamkan 2 vektor terpadu</td><td>Ruang bersama tunggal membuat kemiripan lintas-modal menjadi asli</td></tr>
<tr><td>Vektor berada dalam ruang semantik yang berbeda secara fundamental (biometrik, atribut terstruktur)</td><td>Kolom multi-vektor dengan indeks per bidang</td><td>Metrik kemiripan independen dan jenis indeks per bidang vektor</td></tr>
<tr><td>Anda menginginkan kesederhanaan pipeline <em>dan</em> pengambilan berbutir halus</td><td>Keduanya - vektor Gemini terpadu + kolom jarang atau atribut tambahan dalam koleksi yang sama</td><td>Gemini menangani kolom multimodal; Milvus menangani lapisan pengambilan hibrida di sekitarnya</td></tr>
</tbody>
</table>
<p>Kedua pendekatan ini tidak saling eksklusif. Anda dapat menggunakan Gemini Embedding 2 untuk kolom multimodal terpadu dan masih menyimpan vektor jarang atau atribut tambahan dalam kolom terpisah dalam koleksi <a href="https://milvus.io/">Milvus</a> yang sama.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">Mulai Cepat: Menyiapkan Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Berikut ini adalah sebuah demo kerja. Anda memerlukan <a href="https://milvus.io/docs/install-overview.md">instance Milvus atau Zilliz Cloud</a> yang sedang berjalan dan GOOGLE_API_KEY.</p>
<h3 id="Setup" class="common-anchor-header">Penyiapan</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">Contoh Lengkap</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Untuk penyematan gambar dan audio, gunakan embed_image () dan embed_audio () dengan cara yang sama - vektor mendarat di koleksi yang sama dan ruang vektor yang sama, sehingga memungkinkan pencarian cross-modal yang sebenarnya.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 Akan Segera Tersedia di Milvus/Zilliz Cloud<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> menghadirkan integrasi mendalam dengan Gemini Embedding 2 melalui fitur <a href="https://milvus.io/docs/embeddings.md">Embedding Function</a>. Setelah aktif, Anda tidak perlu memanggil API penyematan secara manual. Milvus akan memanggil model secara otomatis (mendukung OpenAI, AWS Bedrock, Google Vertex AI, dan banyak lagi) untuk memvektorisasi data mentah saat menyisipkan dan melakukan kueri pada pencarian.</p>
<p>Itu berarti Anda mendapatkan penyematan multimodal terpadu dari Gemini yang sesuai, dan toolkit multi-vektor lengkap Milvus - pencarian hibrida yang jarang-padat, skema multi-indeks, pemeringkatan ulang - di mana Anda membutuhkan kontrol yang lebih baik.</p>
<p>Ingin mencobanya? Mulai dengan <a href="https://milvus.io/docs/quickstart.md">quickstart Milvus</a> dan jalankan demo di atas, atau lihat <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">panduan pencarian hibrida</a> untuk pengaturan multi-vektor lengkap dengan BGE-M3. Sampaikan pertanyaan Anda ke <a href="https://milvus.io/discord">Discord</a> atau <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Jam Kerja Milvus</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Teruslah Membaca<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Memperkenalkan Fungsi Penyematan: Bagaimana Milvus 2.6 Menyederhanakan Vektorisasi dan Pencarian Semantik - Blog Milvus</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Pencarian Hibrida Multi-Vektor</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Dokumen Fungsi Penyematan Milvus</a></li>
</ul>
