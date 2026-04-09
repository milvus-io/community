---
id: harness-engineering-ai-agents.md
title: >-
  Memanfaatkan Rekayasa: Lapisan Eksekusi yang Sebenarnya Dibutuhkan oleh Agen
  AI
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  Harness Engineering membangun lingkungan eksekusi di sekitar agen AI otonom.
  Pelajari apa itu, bagaimana OpenAI menggunakannya, dan mengapa ia membutuhkan
  pencarian hybrid.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto membangun HashiCorp dan ikut menciptakan Terraform. Pada bulan Februari 2026, dia menerbitkan sebuah <a href="https://mitchellh.com/writing/my-ai-adoption-journey">posting blog</a> yang menjelaskan kebiasaan yang dia kembangkan saat bekerja dengan agen AI: setiap kali agen melakukan kesalahan, dia merekayasa perbaikan permanen ke dalam lingkungan agen. Dia menyebutnya "merekayasa tali kekang." Dalam beberapa minggu, <a href="https://openai.com/index/harness-engineering/">OpenAI</a> dan <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic</a> menerbitkan artikel-artikel rekayasa yang mengembangkan ide tersebut. Istilah <em>Rekayasa Harness</em> telah tiba.</p>
<p>Istilah ini beresonansi karena menyebutkan masalah yang dihadapi setiap insinyur yang membangun <a href="https://zilliz.com/glossary/ai-agents">agen AI</a>. <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">Rekayasa</a> yang <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">cepat</a> memberi Anda hasil satu putaran yang lebih baik. Rekayasa konteks mengelola apa yang dilihat oleh model. Namun, keduanya tidak membahas apa yang terjadi ketika agen berjalan secara otonom selama berjam-jam, membuat ratusan keputusan tanpa pengawasan. Itulah celah yang diisi oleh Harness Engineering - dan hampir selalu bergantung pada pencarian hibrida (pencarian hibrida teks lengkap dan semantik) agar dapat bekerja.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">Apa itu Rekayasa Harness?<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Harness Engineering adalah disiplin ilmu yang merancang lingkungan eksekusi di sekitar agen AI otonom. Hal ini mendefinisikan alat mana yang dapat dipanggil oleh agen, di mana ia mendapatkan informasi, bagaimana ia memvalidasi keputusannya sendiri, dan kapan ia harus berhenti.</p>
<p>Untuk memahami mengapa hal ini penting, pertimbangkan tiga lapisan pengembangan agen AI:</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Apa yang Dioptimalkan</th><th>Cakupan</th><th>Contoh</th></tr>
</thead>
<tbody>
<tr><td><strong>Rekayasa yang Cepat</strong></td><td>Apa yang Anda katakan kepada model</td><td>Pertukaran tunggal</td><td>Contoh beberapa bidikan, permintaan berantai</td></tr>
<tr><td><strong>Rekayasa Konteks</strong></td><td>Apa yang dapat dilihat oleh model</td><td><a href="https://zilliz.com/glossary/context-window">Jendela konteks</a></td><td>Pengambilan dokumen, kompresi riwayat</td></tr>
<tr><td><strong>Rekayasa Pemanfaatan</strong></td><td>Dunia tempat agen beroperasi</td><td>Eksekusi otonom selama beberapa jam</td><td>Alat bantu, logika validasi, batasan arsitektural</td></tr>
</tbody>
</table>
<p><strong>Prompt Engineering</strong> mengoptimalkan kualitas satu pertukaran - frasa, struktur, contoh. Satu percakapan, satu keluaran.</p>
<p><strong>Context Engineering</strong> mengelola berapa banyak informasi yang dapat dilihat oleh model sekaligus - dokumen mana yang akan diambil, cara mengompresi riwayat, apa yang cocok di jendela konteks dan apa yang akan dibuang.</p>
<p><strong>Rekayasa Pemanfaatan</strong> membangun dunia tempat agen beroperasi. Alat, sumber pengetahuan, logika validasi, batasan arsitektural - semua hal yang menentukan apakah agen dapat bekerja dengan andal dalam ratusan keputusan tanpa pengawasan manusia.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>Tiga lapisan pengembangan agen AI: Prompt Engineering mengoptimalkan apa yang Anda katakan, Context Engineering mengelola apa yang dilihat oleh model, dan Harness Engineering mendesain lingkungan eksekusi</span> </span></p>
<p>Dua lapisan pertama membentuk kualitas dari satu giliran. Lapisan ketiga membentuk apakah agen dapat beroperasi selama berjam-jam tanpa Anda awasi.</p>
<p>Ini bukanlah pendekatan yang bersaing. Mereka adalah sebuah perkembangan. Seiring dengan meningkatnya kemampuan agen, tim yang sama bergerak melalui ketiganya - sering kali dalam satu proyek.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">Bagaimana OpenAI Menggunakan Rekayasa Harness untuk Membangun Basis Kode Berjuta-Juta Baris dan Pelajaran yang Mereka Petik<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI menjalankan eksperimen internal yang menempatkan Harness Engineering secara konkret. Mereka menjelaskannya dalam posting blog teknik mereka, <a href="https://openai.com/index/harness-engineering/">"Harness Engineering: Memanfaatkan Codex di Dunia yang Mengutamakan Agen"</a>. Tim yang terdiri dari tiga orang memulai dengan repositori kosong pada akhir Agustus 2025. Selama lima bulan, mereka tidak menulis kode sendiri - setiap baris dibuat oleh Codex, agen pengkodean bertenaga AI milik OpenAI. Hasilnya: satu juta baris kode produksi dan 1.500 pull request yang digabungkan.</p>
<p>Bagian yang menarik bukanlah hasilnya. Melainkan empat masalah yang mereka hadapi dan solusi lapisan harness yang mereka bangun.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">Masalah 1: Tidak Ada Pemahaman yang Sama tentang Basis Kode</h3><p>Lapisan abstraksi apa yang harus digunakan oleh agen? Apa konvensi penamaan yang digunakan? Di mana letak diskusi arsitektur minggu lalu? Tanpa jawaban, agen menebak-nebak - dan menebak dengan salah - berulang kali.</p>
<p>Naluri pertama adalah satu file <code translate="no">AGENTS.md</code> yang berisi setiap konvensi, aturan, dan keputusan historis. Ini gagal karena empat alasan. Konteksnya langka, dan file instruksi yang membengkak memenuhi tugas yang sebenarnya. Ketika semua hal ditandai penting, tidak ada yang penting. Dokumentasi membusuk - aturan dari minggu kedua menjadi salah pada minggu kedelapan. Dan dokumen yang datar tidak dapat diverifikasi secara mekanis.</p>
<p>Perbaikannya: susutkan <code translate="no">AGENTS.md</code> menjadi 100 baris. Bukan aturan - sebuah peta. Peta ini menunjuk ke direktori <code translate="no">docs/</code> yang terstruktur yang berisi keputusan desain, rencana eksekusi, spesifikasi produk, dan dokumen referensi. Linter dan CI memverifikasi bahwa tautan silang tetap utuh. Agen menavigasi ke apa yang dibutuhkannya.</p>
<p>Prinsip yang mendasari: jika sesuatu tidak ada dalam konteks pada saat runtime, maka hal tersebut tidak ada untuk agen.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">Masalah 2: QA Manusia Tidak Dapat Mengimbangi Output Agen</h3><p>Tim memasang Protokol Chrome DevTools ke dalam Codex. Agen dapat mengambil tangkapan layar jalur UI, mengamati kejadian saat proses berjalan, dan meminta log dengan LogQL dan metrik dengan PromQL. Mereka menetapkan ambang batas konkret: layanan harus dimulai dalam waktu kurang dari 800 milidetik sebelum sebuah tugas dianggap selesai. Tugas-tugas Codex berjalan selama lebih dari enam jam secara beruntun - biasanya saat para insinyur tidur.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">Masalah 3: Pergeseran Arsitektur Tanpa Batasan</h3><p>Tanpa pagar pembatas, agen mereproduksi pola apa pun yang ditemukannya dalam repo - termasuk pola yang buruk.</p>
<p>Perbaikannya: arsitektur berlapis yang ketat dengan arah ketergantungan tunggal yang ditegakkan - Jenis → Konfigurasi → Repo → Layanan → Runtime → UI. Linters khusus menegakkan aturan-aturan ini secara mekanis, dengan pesan kesalahan yang menyertakan instruksi perbaikan sebaris.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>Arsitektur berlapis yang ketat dengan validasi ketergantungan satu arah</span>: <span>Tipe di bagian dasar, UI di bagian atas, linter kustom menerapkan aturan dengan saran perbaikan sebaris</span> </span></p>
<p>Dalam tim manusia, kendala ini biasanya muncul ketika perusahaan berkembang menjadi ratusan insinyur. Untuk agen pengkodean, ini adalah prasyarat sejak hari pertama. Semakin cepat seorang agen bergerak tanpa kendala, semakin buruk penyimpangan arsitekturnya.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">Masalah 4: Hutang Teknis yang Tidak Terdengar</h3><p>Solusinya: menyandikan prinsip-prinsip inti proyek ke dalam repositori, kemudian menjalankan tugas-tugas Codex latar belakang sesuai jadwal untuk memindai penyimpangan dan mengirimkan PR refactoring. Sebagian besar digabungkan secara otomatis dalam satu menit - pembayaran kecil yang terus menerus daripada perhitungan berkala.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">Mengapa Agen AI Tidak Dapat Menilai Pekerjaan Mereka Sendiri<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Eksperimen OpenAI membuktikan bahwa Harness Engineering berhasil. Tetapi penelitian terpisah mengungkap mode kegagalan di dalamnya: agen secara sistematis buruk dalam mengevaluasi hasil kerja mereka sendiri.</p>
<p>Masalahnya muncul dalam dua bentuk.</p>
<p><strong>Kecemasan konteks.</strong> Ketika jendela konteks terisi, agen mulai menyelesaikan tugas sebelum waktunya - bukan karena pekerjaannya sudah selesai, tetapi karena mereka merasakan batas waktu yang semakin dekat. Cognition, tim di balik agen pengkodean AI Devin, <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">mendokumentasikan perilaku ini</a> ketika membangun kembali Devin untuk Claude Sonnet 4.5: model menjadi sadar akan jendela konteksnya sendiri dan mulai mengambil jalan pintas sebelum benar-benar kehabisan ruang.</p>
<p>Perbaikan yang mereka lakukan adalah murni rekayasa harness. Mereka mengaktifkan beta konteks 1M-token tetapi membatasi penggunaan aktual pada 200 ribu token - mengelabui model agar percaya bahwa ia memiliki landasan pacu yang cukup. Kegelisahan pun lenyap. Tidak ada perubahan model yang diperlukan; hanya lingkungan yang lebih cerdas.</p>
<p>Mitigasi umum yang paling umum adalah pemadatan: meringkas riwayat dan membiarkan agen yang sama melanjutkan dengan konteks yang dikompresi. Hal ini menjaga kesinambungan tetapi tidak menghilangkan perilaku yang mendasarinya. Alternatif lainnya adalah pengaturan ulang konteks: hapus jendela, buat instance baru, dan serahkan status melalui artefak terstruktur. Hal ini akan menghilangkan pemicu kecemasan sepenuhnya, tetapi menuntut dokumen handoff yang lengkap - kesenjangan dalam artefak berarti kesenjangan dalam pemahaman agen baru.</p>
<p><strong>Bias evaluasi diri.</strong> Ketika agen menilai hasil kerja mereka sendiri, mereka memberi nilai yang tinggi. Bahkan pada tugas-tugas dengan kriteria lulus/gagal yang objektif, agen menemukan masalah, berbicara sendiri bahwa itu tidak serius, dan menyetujui pekerjaan yang seharusnya gagal.</p>
<p>Perbaikannya meminjam dari GAN (Generative Adversarial Networks): pisahkan generator dari evaluator sepenuhnya. Dalam GAN, dua jaringan saraf bersaing - satu menghasilkan, satu menilai - dan ketegangan permusuhan itu memaksa peningkatan kualitas. Dinamika yang sama berlaku untuk <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">sistem multi-agen</a>.</p>
<p>Anthropic menguji hal ini dengan memanfaatkan tiga agen - Perencana, Pembangkit, Pengevaluasi - melawan agen tunggal yang bertugas membangun mesin game retro 2D. Mereka menjelaskan eksperimen lengkapnya dalam <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"Harness Design for Long-Running Application Development"</a> (Anthropic, 2026). Perencana memperluas perintah singkat menjadi spesifikasi produk lengkap, dengan sengaja membiarkan detail implementasi tidak ditentukan - spesifikasi yang berlebihan di awal mengalir ke kesalahan hilir. Generator mengimplementasikan fitur dalam sprint, tetapi sebelum menulis kode, ia menandatangani kontrak sprint dengan Evaluator: definisi bersama tentang "selesai." Evaluator menggunakan Playwright (kerangka kerja otomatisasi peramban sumber terbuka dari Microsoft) untuk mengklik aplikasi layaknya pengguna sungguhan, menguji UI, API, dan perilaku basis data. Jika ada yang gagal, maka sprint gagal.</p>
<p>Agen tunggal menghasilkan game yang secara teknis diluncurkan, tetapi koneksi entitas-ke-runtime terputus di tingkat kode - hanya dapat ditemukan dengan membaca sumbernya. Harness tiga agen menghasilkan game yang dapat dimainkan dengan pembuatan level yang dibantu oleh AI, animasi sprite, dan efek suara.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>Perbandingan agen tunggal versus harness tiga agen: agen tunggal berjalan 20 menit dengan biaya sembilan dolar dengan fungsionalitas inti yang rusak, sedangkan harness penuh berjalan 6 jam dengan biaya dua ratus dolar yang menghasilkan game yang berfungsi penuh dengan fitur-fitur yang dibantu oleh AI</span> </span></p>
<p>Arsitektur tiga agen menghabiskan biaya sekitar 20x lipat lebih banyak. Outputnya berubah dari tidak dapat digunakan menjadi dapat digunakan. Itulah perdagangan inti yang dilakukan Harness Engineering: biaya tambahan struktural yang ditukar dengan keandalan.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">Masalah Pengambilan di Dalam Setiap Agen Harness<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>Kedua pola - sistem <code translate="no">docs/</code> terstruktur dan siklus sprint Generator/Evaluator - memiliki ketergantungan yang sama: agen harus menemukan informasi yang tepat dari basis pengetahuan yang hidup dan terus berkembang saat dibutuhkan.</p>
<p>Hal ini lebih sulit daripada yang terlihat. Ambil contoh konkret: Generator menjalankan Sprint 3, mengimplementasikan otentikasi pengguna. Sebelum menulis kode, dibutuhkan dua jenis informasi.</p>
<p>Pertama, permintaan <a href="https://zilliz.com/glossary/semantic-search">pencarian semantik</a>: <em>apa prinsip-prinsip desain produk ini seputar sesi pengguna?</em> Dokumen yang relevan mungkin menggunakan "manajemen sesi" atau "kontrol akses" - bukan "otentikasi pengguna". Tanpa pemahaman semantik, pencarian akan meleset.</p>
<p>Kedua, kueri pencocokan tepat: <em>dokumen mana yang mereferensikan fungsi <code translate="no">validateToken</code>?</em> Nama fungsi adalah sebuah string arbitrer tanpa makna semantik. Temu <a href="https://zilliz.com/glossary/vector-embeddings">kembali berbasis penyematan</a> tidak dapat menemukannya dengan andal. Hanya pencocokan kata kunci yang dapat digunakan.</p>
<p>Kedua kueri ini terjadi secara bersamaan. Mereka tidak dapat dipisahkan menjadi langkah-langkah yang berurutan.</p>
<p><a href="https://zilliz.com/learn/vector-similarity-search">Pencarian vektor</a> murni gagal pada pencocokan yang tepat. <a href="https://milvus.io/docs/embed-with-bm25.md">BM25</a> tradisional gagal pada kueri semantik dan tidak dapat memprediksi kosakata mana yang akan digunakan oleh sebuah dokumen. Sebelum Milvus 2.5, satu-satunya pilihan adalah dua sistem pencarian paralel - indeks vektor dan <a href="https://milvus.io/docs/full-text-search.md">indeks teks lengkap</a> - yang berjalan secara bersamaan pada waktu kueri dengan logika penggabungan hasil khusus. Untuk repositori <code translate="no">docs/</code> yang hidup dengan pembaruan yang terus menerus, kedua indeks harus tetap sinkron: setiap perubahan dokumen memicu pengindeksan ulang di dua tempat, dengan risiko ketidakkonsistenan yang konstan.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Bagaimana Milvus 2.6 Memecahkan Pengambilan Agen dengan Satu Jalur Hibrida<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus adalah <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> sumber terbuka yang dirancang untuk beban kerja AI. Sparse-BM25 dari Milvus 2.6 meruntuhkan masalah pengambilan dua jalur pipa menjadi satu sistem.</p>
<p>Pada saat menelan, Milvus menghasilkan dua representasi secara bersamaan: <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">embedding padat</a> untuk pengambilan semantik dan <a href="https://milvus.io/docs/sparse_vector.md">vektor jarang yang dikodekan TF</a> untuk penilaian BM25. <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">Statistik IDF</a> global diperbarui secara otomatis saat dokumen ditambahkan atau dihapus - tidak ada pemicu pengindeksan ulang secara manual. Pada waktu kueri, input bahasa alami menghasilkan kedua jenis vektor kueri secara internal. <a href="https://milvus.io/docs/rrf-ranker.md">Reciprocal Rank Fusion (RRF</a> ) menggabungkan hasil pemeringkatan, dan pemanggil menerima satu set hasil terpadu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>Sebelum dan sesudah: dua sistem terpisah dengan sinkronisasi manual, hasil yang terfragmentasi, dan logika fusi khusus versus Milvus 2.6 pipeline tunggal dengan penyematan yang padat, Sparse BM25, fusi RRF, dan pemeliharaan IDF otomatis yang menghasilkan hasil yang disatukan</span> </span></p>
<p>Satu antarmuka. Satu indeks untuk dipertahankan.</p>
<p>Pada tolok <a href="https://zilliz.com/glossary/beir">ukur BEIR</a> - rangkaian evaluasi standar yang mencakup 18 dataset pengambilan heterogen - Milvus mencapai throughput 3-4x lebih tinggi daripada Elasticsearch pada pengambilan yang setara, dengan peningkatan hingga 7x QPS pada beban kerja tertentu. Untuk skenario sprint, satu kueri menemukan prinsip desain sesi (jalur semantik) dan setiap dokumen yang menyebutkan <code translate="no">validateToken</code> (jalur yang tepat). Repositori <code translate="no">docs/</code> diperbarui secara terus menerus; pemeliharaan BM25 IDF berarti dokumen yang baru ditulis berpartisipasi dalam penilaian kueri berikutnya tanpa pembangunan ulang batch.</p>
<p>Ini adalah lapisan pengambilan yang dibuat untuk kelas masalah seperti ini. Ketika agen memanfaatkan kebutuhan untuk mencari basis pengetahuan yang hidup - dokumentasi kode, keputusan desain, riwayat sprint - pencarian hibrida jalur tunggal bukanlah hal yang baik untuk dimiliki. Itulah yang membuat harness lainnya berfungsi.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">Komponen Harness Terbaik Dirancang untuk Dihapus<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>Setiap komponen dalam harness mengkodekan asumsi tentang keterbatasan model. Penguraian sprint diperlukan saat model kehilangan koherensi pada tugas yang panjang. Pengaturan ulang konteks diperlukan ketika model mengalami kecemasan di dekat batas jendela. Agen evaluator menjadi penting ketika bias evaluasi diri tidak dapat dikelola.</p>
<p>Asumsi-asumsi ini berakhir. Trik konteks-jendela kognisi mungkin menjadi tidak diperlukan saat model mengembangkan stamina konteks panjang yang asli. Ketika model terus berkembang, komponen lain akan menjadi overhead yang tidak perlu yang memperlambat agen tanpa menambah keandalan.</p>
<p>Harness Engineering bukanlah arsitektur yang tetap. Ini adalah sistem yang dikalibrasi ulang dengan setiap rilis model baru. Pertanyaan pertama setelah peningkatan besar bukanlah "apa yang bisa saya tambahkan?" Melainkan "apa yang bisa saya hapus?"</p>
<p>Logika yang sama berlaku untuk pengambilan. Ketika model menangani konteks yang lebih panjang dengan lebih andal, strategi chunking dan waktu pengambilan akan bergeser. Informasi yang membutuhkan fragmentasi yang cermat hari ini mungkin dapat dicerna sebagai satu halaman penuh besok. Infrastruktur pencarian beradaptasi bersama model.</p>
<p>Setiap komponen dalam harness yang dibangun dengan baik menunggu untuk dibuat berlebihan oleh model yang lebih cerdas. Itu bukan masalah. Itulah tujuannya.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Memulai dengan Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda sedang membangun infrastruktur agen yang membutuhkan pengambilan hibrida - pencarian semantik dan kata kunci dalam satu pipeline - di sinilah tempat untuk memulai:</p>
<ul>
<li>Baca <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>catatan rilis Milvus 2.6</strong></a> untuk detail lengkap tentang Sparse-BM25, pemeliharaan IDF otomatis, dan tolok ukur kinerja.</li>
<li>Bergabunglah dengan <a href="https://milvus.io/community"><strong>komunitas Milvus</strong></a> untuk mengajukan pertanyaan dan berbagi apa yang Anda bangun.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Pesan sesi Jam Kantor Milvus gratis</strong></a> untuk membahas kasus penggunaan Anda dengan pakar database vektor.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur, <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> (Milvus yang dikelola sepenuhnya) menawarkan tingkat gratis untuk memulai dengan kredit gratis $100 setelah pendaftaran dengan email kantor.</li>
<li>Bintangi kami di GitHub: <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> - 43k+ bintang dan terus bertambah.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Pertanyaan yang Sering Diajukan<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">Apa itu harness engineering dan apa bedanya dengan prompt engineering?</h3><p>Prompt engineering mengoptimalkan apa yang Anda katakan pada sebuah model dalam satu kali pertukaran - frasa, struktur, contoh. Harness Engineering membangun lingkungan eksekusi di sekitar agen AI otonom: alat yang dapat dipanggil, pengetahuan yang dapat diakses, logika validasi yang memeriksa pekerjaannya, dan batasan yang mencegah penyimpangan arsitektur. Rekayasa yang cepat membentuk satu giliran percakapan. Rekayasa Harness membentuk apakah agen dapat beroperasi dengan andal selama berjam-jam di ratusan keputusan tanpa pengawasan manusia.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">Mengapa agen AI membutuhkan pencarian vektor dan BM25 secara bersamaan?</h3><p>Agen harus menjawab dua pertanyaan pencarian yang berbeda secara fundamental secara bersamaan. Kueri semantik - <em>apa prinsip desain kami seputar sesi pengguna?</em> - membutuhkan penyematan vektor yang padat untuk mencocokkan konten yang terkait secara konseptual terlepas dari kosakata. Kueri pencocokan tepat - <em>dokumen mana yang merujuk ke fungsi <code translate="no">validateToken</code>?</em> - memerlukan penilaian kata kunci BM25, karena nama fungsi adalah string acak tanpa makna semantik. Sistem temu kembali yang hanya menangani satu mode saja akan melewatkan kueri jenis lainnya secara sistematis.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">Bagaimana cara kerja Milvus Sparse-BM25 untuk pengambilan pengetahuan agen?</h3><p>Pada saat menelan, Milvus menghasilkan embedding padat dan vektor jarang yang dikodekan TF untuk setiap dokumen secara bersamaan. Statistik IDF global diperbarui secara real time ketika basis pengetahuan berubah - tidak perlu pengindeksan ulang secara manual. Pada waktu kueri, kedua jenis vektor dihasilkan secara internal, Reciprocal Rank Fusion menggabungkan hasil peringkat, dan agen menerima satu set hasil terpadu. Seluruh pipeline berjalan melalui satu antarmuka dan satu indeks - sangat penting untuk basis pengetahuan yang terus diperbarui seperti repositori dokumentasi kode.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">Kapan saya harus menambahkan agen evaluator ke agent harness saya?</h3><p>Tambahkan Evaluator terpisah ketika kualitas keluaran Generator Anda tidak dapat diverifikasi dengan pengujian otomatis saja, atau ketika bias evaluasi mandiri telah menyebabkan cacat yang terlewatkan. Prinsip utama: Evaluator harus terpisah secara arsitektur dari Generator - konteks bersama memperkenalkan kembali bias yang sama yang ingin Anda hilangkan. Evaluator harus memiliki akses ke alat runtime (otomatisasi browser, panggilan API, kueri basis data) untuk menguji perilaku, bukan hanya meninjau kode. <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Penelitian</a> Anthropic menemukan bahwa pemisahan yang terinspirasi oleh GAN ini mengubah kualitas keluaran dari "secara teknis berjalan tetapi rusak" menjadi "berfungsi penuh dengan fitur-fitur yang tidak pernah dicoba oleh agen tunggal."</p>
