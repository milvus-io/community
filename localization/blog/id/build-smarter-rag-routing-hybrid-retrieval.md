---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: >-
  Beyond Naive RAG: Membangun Sistem yang Lebih Cerdas dengan Query Routing dan
  Hybrid Retrieval
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_new_565494b6a6.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: >-
  Pelajari bagaimana sistem RAG modern menggunakan perutean kueri, pengambilan
  hibrida, dan evaluasi tahap demi tahap untuk memberikan jawaban yang lebih
  baik dengan biaya yang lebih rendah.
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>Pipeline <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> Anda mengambil dokumen untuk setiap kueri, terlepas dari apakah pengambilan diperlukan atau tidak. Ini menjalankan pencarian kesamaan yang sama pada kode, bahasa alami, dan laporan keuangan. Dan ketika hasilnya buruk, Anda tidak memiliki cara untuk mengetahui tahap mana yang rusak.</p>
<p>Ini adalah gejala RAG yang naif - sebuah pipeline tetap yang memperlakukan setiap kueri dengan cara yang sama. Sistem RAG modern bekerja dengan cara yang berbeda. Sistem ini merutekan kueri ke penangan yang tepat, menggabungkan beberapa metode pengambilan, dan mengevaluasi setiap tahap secara independen.</p>
<p>Artikel ini membahas arsitektur empat simpul untuk membangun sistem RAG yang lebih cerdas, menjelaskan cara mengimplementasikan <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">pengambilan hibrida</a> tanpa mempertahankan indeks terpisah, dan menunjukkan cara mengevaluasi setiap tahap pipeline agar Anda bisa men-debug masalah dengan lebih cepat.</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">Mengapa Konteks Panjang Tidak Menggantikan RAG<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>"Taruh saja semuanya di prompt" adalah saran yang umum sekarang karena model mendukung 128K+ jendela token. Hal ini tidak berlaku dalam produksi karena dua alasan.</p>
<p><strong>Skala biaya dengan basis pengetahuan Anda, bukan permintaan Anda.</strong> Setiap permintaan mengirimkan basis pengetahuan lengkap melalui model. Untuk korpus token 100K, itu berarti 100K token input per permintaan - terlepas dari apakah jawabannya membutuhkan satu paragraf atau sepuluh. Biaya inferensi bulanan tumbuh secara linier dengan ukuran korpus.</p>
<p><strong>Perhatian menurun seiring dengan panjangnya konteks.</strong> Model berjuang untuk fokus pada informasi relevan yang terkubur dalam konteks yang panjang. Penelitian tentang efek "hilang di tengah" (Liu et al., 2023) menunjukkan bahwa model lebih cenderung kehilangan informasi yang ditempatkan di tengah-tengah input yang panjang. Jendela konteks yang lebih besar tidak menyelesaikan masalah ini-kualitas perhatian tidak dapat mengimbangi ukuran jendela.</p>
<p>RAG menghindari kedua masalah tersebut dengan hanya mengambil bagian yang relevan sebelum dibuat. Pertanyaannya bukan apakah RAG diperlukan - tetapi bagaimana cara membuat RAG yang benar-benar berfungsi.</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">Apa yang Salah dengan RAG Tradisional?<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG tradisional mengikuti alur yang tetap: sematkan kueri, jalankan <a href="https://zilliz.com/learn/what-is-vector-search">pencarian kemiripan vektor</a>, ambil hasil K teratas, hasilkan jawaban. Setiap kueri mengikuti jalur yang sama.</p>
<p>Hal ini menciptakan dua masalah:</p>
<ol>
<li><p><strong>Membuang-buang komputasi untuk kueri yang sepele.</strong> "Berapa 2 + 2?" tidak memerlukan pencarian, tetapi sistem tetap menjalankannya-menambah latensi dan biaya tanpa manfaat.</p></li>
<li><p><strong>Pengambilan yang rapuh pada kueri yang kompleks.</strong> Frasa yang ambigu, sinonim, atau kueri bahasa campuran sering kali mengalahkan kemiripan vektor murni. Ketika pengambilan melewatkan dokumen yang relevan, kualitas hasil pencarian akan menurun tanpa adanya fallback.</p></li>
</ol>
<p>Perbaikannya: tambahkan pengambilan keputusan sebelum pengambilan. Sistem RAG modern memutuskan <em>apakah</em> akan mengambil, <em>apa yang</em> akan dicari, dan <em>bagaimana cara</em> mencari-daripada secara membabi buta menjalankan pipeline yang sama setiap saat.</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">Cara Kerja Sistem RAG Modern: Arsitektur Empat-Simpul<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Alih-alih menggunakan pipeline yang tetap, sistem RAG modern merutekan setiap kueri melalui empat simpul keputusan. Setiap node menjawab satu pertanyaan tentang bagaimana menangani kueri saat ini.</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">Node 1: Perutean Kueri - Apakah Kueri Ini Perlu Diambil?</h3><p>Perutean kueri adalah keputusan pertama dalam pipeline. Node ini mengklasifikasikan kueri yang masuk dan mengirimkannya ke jalur yang sesuai:</p>
<table>
<thead>
<tr><th>Jenis Kueri</th><th>Contoh</th><th>Tindakan</th></tr>
</thead>
<tbody>
<tr><td>Akal sehat / pengetahuan umum</td><td>"Apa itu 2 + 2?"</td><td>Jawab secara langsung dengan pengambilan lompatan LLM</td></tr>
<tr><td>Pertanyaan berbasis pengetahuan</td><td>"Apa saja spesifikasi untuk Model X?"</td><td>Rute ke pipa pengambilan</td></tr>
<tr><td>Informasi waktu nyata</td><td>"Cuaca di Paris akhir pekan ini"</td><td>Memanggil API eksternal</td></tr>
</tbody>
</table>
<p>Perutean di awal menghindari pengambilan yang tidak perlu untuk kueri yang tidak membutuhkannya. Dalam sistem di mana sebagian besar kueri bersifat sederhana atau pengetahuan umum, hal ini dapat memangkas biaya komputasi secara signifikan.</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">Node 2: Penulisan Ulang Kueri - Apa yang Harus Dicari oleh Sistem?</h3><p>Pertanyaan pengguna sering kali tidak jelas. Pertanyaan seperti "angka utama dalam laporan Q3 LightOn" tidak dapat diterjemahkan dengan baik ke dalam kueri penelusuran.</p>
<p>Penulisan ulang kueri mengubah pertanyaan asli menjadi kondisi pencarian terstruktur:</p>
<ul>
<li><strong>Rentang waktu:</strong> 1 Juli - 30 September 2025 (Q3)</li>
<li><strong>Jenis dokumen:</strong> Laporan keuangan</li>
<li><strong>Entitas</strong> LightOn, Departemen Keuangan</li>
</ul>
<p>Langkah ini menjembatani kesenjangan antara bagaimana pengguna mengajukan pertanyaan dan bagaimana sistem pencarian mengindeks dokumen. Pertanyaan yang lebih baik berarti lebih sedikit hasil yang tidak relevan.</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">Simpul 3: Pemilihan Strategi Temu Kembali - Bagaimana Seharusnya Sistem Mencari?</h3><p>Jenis konten yang berbeda membutuhkan strategi pencarian yang berbeda. Satu metode tidak dapat mencakup semuanya:</p>
<table>
<thead>
<tr><th>Jenis Konten</th><th>Metode Pencarian Terbaik</th><th>Mengapa</th></tr>
</thead>
<tbody>
<tr><td>Kode (nama variabel, tanda tangan fungsi)</td><td>Pencarian leksikal<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">(BM25</a>)</td><td>Pencocokan kata kunci yang tepat bekerja dengan baik pada token terstruktur</td></tr>
<tr><td>Bahasa alami (dokumen, artikel)</td><td>Pencarian semantik (vektor padat)</td><td>Menangani sinonim, parafrase, dan maksud</td></tr>
<tr><td>Multimodal (bagan, diagram, gambar)</td><td>Pengambilan multimodal</td><td>Menangkap struktur visual yang terlewatkan oleh ekstraksi teks</td></tr>
</tbody>
</table>
<p>Dokumen ditandai dengan metadata pada waktu pengindeksan. Pada waktu kueri, tag ini memandu dokumen mana yang akan dicari dan metode pengambilan yang akan digunakan.</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">Node 4: Pembuatan Konteks Minimal - Berapa Banyak Konteks yang Dibutuhkan Model?</h3><p>Setelah pengambilan dan <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">pemeringkatan ulang</a>, sistem hanya mengirimkan bagian yang paling relevan ke model-bukan seluruh dokumen.</p>
<p>Hal ini lebih penting daripada kedengarannya. Dibandingkan dengan pemuatan dokumen secara penuh, hanya mengirimkan bagian yang relevan saja dapat mengurangi penggunaan token hingga lebih dari 90%. Jumlah token yang lebih rendah berarti respons yang lebih cepat dan biaya yang lebih rendah, bahkan ketika caching digunakan.</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">Mengapa Pengambilan Hibrida Penting untuk RAG Perusahaan<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam praktiknya, pemilihan strategi pengambilan (Node 3) adalah tempat sebagian besar tim terjebak. Tidak ada satu metode pencarian yang dapat mencakup semua jenis dokumen perusahaan.</p>
<p>Beberapa orang berpendapat bahwa pencarian kata kunci sudah cukup - lagipula, pencarian kode berbasis grep dari Claude Code bekerja dengan baik. Namun kode sangat terstruktur, dengan konvensi penamaan yang konsisten. Dokumen perusahaan adalah cerita yang berbeda.</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">Dokumen Perusahaan Berantakan</h3><p><strong>Sinonim dan frasa yang bervariasi.</strong> "Optimalkan penggunaan memori" dan "kurangi jejak memori" memiliki arti yang sama, namun menggunakan kata yang berbeda. Pencarian kata kunci akan menemukan kata yang cocok dengan kata yang satu dan melewatkan kata yang lain. Dalam lingkungan multibahasa - bahasa Mandarin dengan segmentasi kata, bahasa Jepang dengan aksara campuran, bahasa Jerman dengan kata majemuk - masalahnya berlipat ganda.</p>
<p><strong>Struktur visual penting.</strong> Gambar teknik bergantung pada tata letak. Laporan keuangan bergantung pada tabel. Gambar medis bergantung pada hubungan spasial. OCR mengekstrak teks tetapi kehilangan struktur. Pengambilan teks saja tidak dapat menangani dokumen-dokumen ini dengan baik.</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">Cara Menerapkan Temu Kembali Hibrida</h3><p>Temu kembali hibrida menggabungkan beberapa metode pencarian-biasanya <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">BM25 untuk pencocokan kata kunci dan vektor padat untuk pencarian semantik-untuk</a>mencakup apa yang tidak dapat ditangani oleh kedua metode tersebut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pendekatan tradisional menjalankan dua sistem terpisah: satu untuk BM25, satu untuk pencarian vektor. Setiap kueri akan masuk ke kedua sistem, dan hasilnya akan digabungkan. Cara ini berhasil, tetapi ada biaya tambahan yang besar:</p>
<table>
<thead>
<tr><th></th><th>Tradisional (Sistem Terpisah)</th><th>Terpadu (Koleksi Tunggal)</th></tr>
</thead>
<tbody>
<tr><td>Penyimpanan</td><td>Dua indeks terpisah</td><td>Satu koleksi, keduanya jenis vektor</td></tr>
<tr><td>Sinkronisasi data</td><td>Harus menjaga dua sistem tetap sinkron</td><td>Jalur tulis tunggal</td></tr>
<tr><td>Jalur kueri</td><td>Dua kueri + penggabungan hasil</td><td>Satu panggilan API, fusi otomatis</td></tr>
<tr><td>Penyetelan</td><td>Menyesuaikan bobot penggabungan di seluruh sistem</td><td>Mengubah bobot padat/jarang dalam satu kueri</td></tr>
<tr><td>Kompleksitas operasional</td><td>Tinggi</td><td>Rendah</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a> 2.6 mendukung vektor padat (untuk pencarian semantik) dan vektor jarang (untuk pencarian kata kunci gaya BM25) dalam koleksi yang sama. Satu panggilan API mengembalikan hasil yang digabungkan, dengan perilaku pencarian yang dapat disesuaikan dengan mengubah bobot di antara jenis vektor. Tidak ada indeks terpisah, tidak ada masalah sinkronisasi, tidak ada latensi penggabungan.</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">Cara Mengevaluasi Pipeline RAG Tahap demi Tahap<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>Memeriksa jawaban akhir saja tidak cukup. RAG adalah pipeline multi-tahap, dan kegagalan di tahap mana pun akan menyebar ke hilir. Jika Anda hanya mengukur kualitas jawaban, Anda tidak dapat mengetahui apakah masalahnya ada pada perutean, penulisan ulang, pengambilan, pemeringkatan, atau pembuatan.</p>
<p>Ketika pengguna melaporkan "hasil yang tidak akurat," akar penyebabnya bisa di mana saja: perutean mungkin melewatkan pengambilan padahal seharusnya tidak; penulisan ulang kueri mungkin menghilangkan entitas kunci; pengambilan mungkin melewatkan dokumen yang relevan; pemeringkatan ulang mungkin mengubur hasil yang baik; atau model mungkin mengabaikan konteks yang diambil sepenuhnya.</p>
<p>Evaluasi setiap tahap dengan metriknya sendiri:</p>
<table>
<thead>
<tr><th>Tahap</th><th>Metrik</th><th>Apa yang Ditangkap</th></tr>
</thead>
<tbody>
<tr><td>Perutean</td><td>Skor F1</td><td>Tingkat false-negative yang tinggi = kueri yang membutuhkan pengambilan dilewati</td></tr>
<tr><td>Penulisan ulang kueri</td><td>Akurasi ekstraksi entitas, cakupan sinonim</td><td>Kueri yang ditulis ulang menghilangkan istilah-istilah penting atau mengubah maksud</td></tr>
<tr><td>Pengambilan</td><td>Penarikan kembali @ K, NDCG @ 10</td><td>Dokumen yang relevan tidak diambil, atau diberi peringkat terlalu rendah</td></tr>
<tr><td>Pemeringkatan ulang</td><td>Ketepatan @ 3</td><td>Hasil teratas sebenarnya tidak relevan</td></tr>
<tr><td>Generasi</td><td>Kesetiaan, kelengkapan jawaban</td><td>Model mengabaikan konteks yang diambil atau memberikan jawaban parsial</td></tr>
</tbody>
</table>
<p><strong>Siapkan pemantauan berlapis.</strong> Gunakan set pengujian offline untuk menentukan rentang metrik dasar untuk setiap tahap. Dalam produksi, picu peringatan ketika ada tahap yang turun di bawah baseline. Hal ini memungkinkan Anda untuk menangkap regresi lebih awal dan melacaknya ke tahap tertentu, alih-alih menebak-nebak.</p>
<h2 id="What-to-Build-First" class="common-anchor-header">Apa yang Harus Dibangun Terlebih Dahulu<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>Ada tiga prioritas yang menonjol dalam penerapan RAG di dunia nyata:</p>
<ol>
<li><p><strong>Tambahkan perutean lebih awal.</strong> Banyak kueri yang tidak memerlukan pengambilan sama sekali. Menyaringnya di awal akan mengurangi beban dan meningkatkan waktu respons dengan upaya rekayasa minimal.</p></li>
<li><p><strong>Gunakan pengambilan hibrida terpadu.</strong> Mempertahankan sistem pencarian BM25 dan vektor yang terpisah akan menggandakan biaya penyimpanan, menciptakan kompleksitas sinkronisasi, dan menambah latensi penggabungan. Sistem terpadu seperti Milvus 2.6-di mana vektor yang padat dan jarang berada dalam koleksi yang sama-menghilangkan masalah ini.</p></li>
<li><p><strong>Mengevaluasi setiap tahap secara independen.</strong> Kualitas jawaban dari ujung ke ujung saja bukanlah sinyal yang berguna. Metrik per tahap (F1 untuk perutean, Recall@K dan NDCG untuk pengambilan) memungkinkan Anda melakukan debug lebih cepat dan menghindari kerusakan pada satu tahap ketika menyetel tahap lainnya.</p></li>
</ol>
<p>Nilai sebenarnya dari sistem RAG modern bukan hanya pengambilan, tetapi juga mengetahui <em>kapan</em> harus mengambil dan <em>bagaimana cara</em> mengambilnya. Mulailah dengan perutean dan pencarian hibrida terpadu, dan Anda akan memiliki fondasi yang dapat berkembang.</p>
<hr>
<p>Jika Anda sedang membangun atau meningkatkan sistem RAG dan mengalami masalah kualitas pengambilan, kami ingin membantu:</p>
<ul>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> untuk mengajukan pertanyaan, berbagi arsitektur Anda, dan belajar dari pengembang lain yang menangani masalah serupa.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Milvus Office Hours selama 20 menit</a> untuk membahas kasus penggunaan Anda-apakah itu desain perutean, penyiapan pengambilan hibrida, atau evaluasi multi-tahap.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) menawarkan tingkat gratis untuk memulai.</li>
</ul>
<hr>
<p>Beberapa pertanyaan yang sering muncul saat tim mulai membangun sistem RAG yang lebih cerdas:</p>
<p><strong>T: Apakah RAG masih diperlukan sekarang karena model-modelnya mendukung 128K+ jendela konteks?</strong></p>
<p>Ya. Jendela konteks yang panjang membantu ketika Anda perlu memproses satu dokumen besar, tetapi tidak menggantikan pengambilan untuk kueri basis pengetahuan. Mengirim seluruh korpus Anda dengan setiap permintaan akan meningkatkan biaya secara linear, dan model kehilangan fokus pada informasi yang relevan dalam konteks yang panjang - masalah yang terdokumentasi dengan baik yang dikenal sebagai efek "hilang di tengah" (Liu et al., 2023). RAG hanya mengambil apa yang relevan, sehingga biaya dan latensi dapat diprediksi.</p>
<p><strong>T: Bagaimana cara menggabungkan BM25 dan pencarian vektor tanpa menjalankan dua sistem yang terpisah?</strong></p>
<p>Gunakan basis data vektor yang mendukung vektor padat dan vektor jarang dalam koleksi yang sama. Milvus 2.6 menyimpan kedua jenis vektor per dokumen dan mengembalikan hasil gabungan dari satu kueri. Anda menyesuaikan keseimbangan antara pencocokan kata kunci dan semantik dengan mengubah parameter bobot-tidak ada indeks terpisah, tidak ada penggabungan hasil, tidak ada sakit kepala karena sinkronisasi.</p>
<p><strong>T: Apa hal pertama yang harus saya tambahkan untuk meningkatkan pipeline RAG yang sudah ada?</strong></p>
<p>Perutean kueri. Ini adalah peningkatan dengan dampak tertinggi dan upaya terendah. Sebagian besar sistem produksi memiliki banyak sekali kueri yang tidak perlu diambil sama sekali - pertanyaan yang masuk akal, perhitungan sederhana, pengetahuan umum. Merutekan ini secara langsung ke LLM akan memangkas panggilan pengambilan yang tidak perlu dan meningkatkan waktu respons dengan segera.</p>
<p><strong>T: Bagaimana cara mengetahui tahap mana dari pipeline RAG saya yang menyebabkan hasil yang buruk?</strong></p>
<p>Evaluasi setiap tahap secara independen. Gunakan skor F1 untuk akurasi perutean, Recall@K dan NDCG@10 untuk kualitas pengambilan, Precision@3 untuk pemeringkatan ulang, dan metrik kesetiaan untuk pembuatan. Tetapkan garis dasar dari data pengujian offline dan pantau setiap tahap dalam produksi. Ketika kualitas jawaban menurun, Anda dapat melacaknya ke tahap tertentu yang mengalami kemunduran alih-alih menebak-nebak.</p>
