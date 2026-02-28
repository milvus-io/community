---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: Mengapa Agen AI seperti OpenClaw Membakar Token dan Cara Memotong Biaya
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  Mengapa tagihan token OpenClaw dan agen AI lainnya melonjak, dan bagaimana
  cara memperbaikinya dengan pengambilan vektor BM25 + (index1, QMD, Milvus) dan
  memori Markdown-first (memsearch).
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<p>Jika Anda pernah menghabiskan waktu dengan <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (sebelumnya Clawdbot dan Moltbot), Anda sudah tahu betapa bagusnya Agen AI ini. Cepat, lokal, fleksibel, dan mampu melakukan alur kerja yang sangat kompleks di Slack, Discord, basis kode Anda, dan hampir semua hal lain yang Anda hubungkan dengannya. Tetapi begitu Anda mulai menggunakannya secara serius, satu pola dengan cepat muncul: <strong>penggunaan token Anda mulai meningkat</strong>.</p>
<p>Ini bukan kesalahan OpenClaw secara khusus - ini adalah perilaku sebagian besar agen AI saat ini. Mereka memicu panggilan LLM untuk hampir semua hal: mencari file, merencanakan tugas, menulis catatan, mengeksekusi alat, atau mengajukan pertanyaan lanjutan. Dan karena token adalah mata uang universal dari panggilan ini, setiap tindakan memiliki biaya.</p>
<p>Untuk memahami dari mana biaya tersebut berasal, kita perlu melihat di balik dua kontributor besar:</p>
<ul>
<li><strong>Pencarian:</strong> Pencarian yang dibangun dengan buruk menarik muatan konteks yang luas - seluruh file, log, pesan, dan wilayah kode yang sebenarnya tidak dibutuhkan oleh model.</li>
<li><strong>Memori:</strong> Menyimpan informasi yang tidak penting memaksa agen untuk membaca ulang dan memprosesnya kembali pada panggilan di masa mendatang, sehingga menambah penggunaan token dari waktu ke waktu.</li>
</ul>
<p>Kedua masalah ini secara diam-diam meningkatkan biaya operasional tanpa meningkatkan kemampuan.</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">Bagaimana Agen AI Seperti OpenClaw Sebenarnya Melakukan Pencarian - dan Mengapa Itu Membakar Token<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika agen membutuhkan informasi dari basis kode atau pustaka dokumen Anda, biasanya agen melakukan hal yang setara dengan <strong>Ctrl+F</strong> di seluruh proyek. Setiap baris yang cocok akan dikembalikan - tanpa peringkat, tanpa filter, dan tanpa prioritas. Claude Code mengimplementasikan ini melalui alat Grep khusus yang dibangun di atas ripgrep. OpenClaw tidak memiliki alat pencarian basis kode bawaan, tetapi alat eksekusinya memungkinkan model yang mendasari menjalankan perintah apa pun, dan keterampilan yang dimuat dapat memandu agen untuk menggunakan alat seperti rg. Pada kedua kasus tersebut, pencarian basis kode mengembalikan kecocokan kata kunci tanpa peringkat dan tanpa filter.</p>
<p>Pendekatan brute-force ini bekerja dengan baik dalam proyek-proyek kecil. Namun, seiring dengan pertumbuhan repositori, begitu pula dengan harganya. Kecocokan yang tidak relevan akan menumpuk di jendela konteks LLM, memaksa model untuk membaca dan memproses ribuan token yang sebenarnya tidak diperlukan. Satu pencarian yang tidak tercakup dapat menyeret file lengkap, blok komentar yang besar, atau log yang memiliki kata kunci yang sama tetapi tidak memiliki maksud yang mendasarinya. Ulangi pola tersebut dalam sesi debugging atau penelitian yang panjang, dan bloat akan bertambah dengan cepat.</p>
<p>Baik OpenClaw dan Claude Code mencoba mengelola pertumbuhan ini. OpenClaw memangkas keluaran alat yang terlalu besar dan memadatkan riwayat percakapan yang panjang, sementara Claude Code membatasi keluaran pembacaan file dan mendukung pemadatan konteks. Mitigasi ini berhasil - tetapi hanya setelah kueri yang membengkak dieksekusi. Hasil pencarian yang tidak diberi peringkat masih menggunakan token, dan Anda masih membayar untuk itu. Manajemen konteks membantu pergantian di masa mendatang, bukan panggilan asli yang menghasilkan pemborosan.</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">Bagaimana Memori Agen AI Bekerja dan Mengapa Ini Juga Membutuhkan Token<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencarian bukan satu-satunya sumber biaya token. Setiap bagian dari konteks yang diambil agen dari memori juga harus dimuat ke dalam jendela konteks LLM, dan itu juga membutuhkan token.</p>
<p>API LLM yang diandalkan sebagian besar agen saat ini tidak memiliki status: API Pesan Anthropic membutuhkan riwayat percakapan lengkap dengan setiap permintaan, dan API Penyelesaian Obrolan OpenAI bekerja dengan cara yang sama. Bahkan API Respons stateful yang lebih baru dari OpenAI, yang mengelola status percakapan di sisi server, masih menagih jendela konteks penuh pada setiap panggilan. Memori yang dimuat ke dalam konteks membutuhkan biaya token terlepas dari bagaimana cara mendapatkannya.</p>
<p>Untuk menyiasatinya, kerangka kerja agen menulis catatan ke file di disk dan memuat catatan yang relevan kembali ke jendela konteks ketika agen membutuhkannya. Sebagai contoh, OpenClaw menyimpan catatan yang dikurasi di MEMORY.md dan menambahkan log harian ke file Markdown yang diberi cap waktu, kemudian mengindeksnya dengan BM25 hibrida dan pencarian vektor sehingga agen dapat mengingat konteks yang relevan sesuai permintaan.</p>
<p>Desain memori OpenClaw bekerja dengan baik, tetapi membutuhkan ekosistem OpenClaw yang lengkap: proses Gateway, koneksi platform perpesanan, dan seluruh stack. Hal yang sama juga berlaku untuk memori Claude Code, yang terikat dengan CLI-nya. Jika Anda membangun agen khusus di luar platform ini, Anda memerlukan solusi mandiri. Bagian selanjutnya membahas alat yang tersedia untuk kedua masalah tersebut.</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">Cara Menghentikan OpenClaw Agar Tidak Membakar Token<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda ingin mengurangi jumlah token yang dikonsumsi OpenClaw, ada dua cara yang dapat Anda lakukan.</p>
<ul>
<li>Yang pertama adalah <strong>pengambilan yang lebih baik</strong> - mengganti pembuangan kata kunci gaya grep dengan alat pencarian yang diperingkat dan digerakkan oleh relevansi sehingga model hanya melihat informasi yang benar-benar penting.</li>
<li>Yang kedua adalah <strong>memori yang lebih baik</strong> - berpindah dari penyimpanan yang tidak jelas dan bergantung pada kerangka kerja ke sesuatu yang dapat Anda pahami, periksa, dan kendalikan.</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">Mengganti grep dengan Pencarian yang Lebih Baik: index1, QMD, dan Milvus</h3><p>Banyak agen pengkodean AI mencari basis kode dengan grep atau ripgrep. Claude Code memiliki alat Grep khusus yang dibangun di atas ripgrep. OpenClaw tidak memiliki alat pencarian basis kode bawaan, tetapi alat eksekusinya memungkinkan model yang mendasarinya menjalankan perintah apa pun, dan keterampilan seperti ripgrep atau QMD dapat dimuat untuk memandu bagaimana agen mencari. Tanpa keterampilan yang berfokus pada pencarian, agen akan kembali ke pendekatan apa pun yang dipilih oleh model yang mendasarinya. Masalah intinya sama untuk semua agen: tanpa pencarian berperingkat, kecocokan kata kunci akan masuk ke jendela konteks tanpa disaring.</p>
<p>Hal ini berhasil ketika sebuah proyek cukup kecil sehingga setiap kecocokan dapat masuk dengan nyaman ke dalam jendela konteks. Masalahnya dimulai ketika basis kode atau pustaka dokumen berkembang hingga mencapai titik di mana sebuah kata kunci menghasilkan puluhan atau ratusan hit dan agen harus memuat semuanya ke dalam prompt. Pada skala tersebut, Anda membutuhkan hasil yang diurutkan berdasarkan relevansi, bukan hanya disaring berdasarkan kecocokan.</p>
<p>Solusi standarnya adalah pencarian hibrida, yang menggabungkan dua metode peringkat yang saling melengkapi:</p>
<ul>
<li>BM25 memberi nilai setiap hasil berdasarkan seberapa sering dan seberapa unik sebuah istilah muncul dalam dokumen tertentu. Sebuah berkas terfokus yang menyebutkan "otentikasi" sebanyak 15 kali memiliki peringkat yang lebih tinggi daripada berkas luas yang menyebutkannya sekali.</li>
<li>Pencarian vektor mengubah teks menjadi representasi numerik dari makna, sehingga "autentikasi" dapat cocok dengan "alur masuk" atau "manajemen sesi" meskipun tidak memiliki kata kunci yang sama.</li>
</ul>
<p>Tidak satu pun dari kedua metode ini yang memadai: BM25 melewatkan istilah yang diparafrasekan, dan pencarian vektor melewatkan istilah yang tepat seperti kode kesalahan. Menggabungkan keduanya dan menggabungkan daftar peringkat melalui algoritme fusi dapat menutupi kedua celah tersebut.</p>
<p>Alat-alat di bawah ini mengimplementasikan pola ini pada skala yang berbeda. Grep adalah garis dasar yang digunakan semua orang untuk memulai. index1, QMD, dan Milvus masing-masing menambahkan pencarian hibrida dengan kapasitas yang meningkat.</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1: pencarian hibrida cepat pada satu mesin</h4><p><a href="https://github.com/gladego/index1">index1</a> adalah alat CLI yang mengemas pencarian hibrida ke dalam satu file database SQLite. FTS5 menangani BM25, sqlite-vec menangani kemiripan vektor, dan RRF menggabungkan daftar peringkat. Penyematan dibuat secara lokal oleh Ollama, jadi tidak ada yang keluar dari mesin Anda.</p>
<p>index1 memotong kode berdasarkan struktur, bukan berdasarkan jumlah baris: File markdown dipecah berdasarkan judul, file Python berdasarkan AST, JavaScript dan TypeScript berdasarkan pola regex. Ini berarti hasil pencarian mengembalikan unit yang koheren seperti fungsi lengkap atau bagian dokumentasi lengkap, bukan rentang baris sembarangan yang memotong pertengahan blok. Waktu respons adalah 40 hingga 180ms untuk kueri hibrida. Tanpa Ollama, ini kembali ke BM25 saja, yang masih mengurutkan hasil daripada membuang setiap kecocokan ke dalam jendela konteks.</p>
<p>index1 juga menyertakan modul memori episodik untuk menyimpan pelajaran yang dipetik, akar penyebab bug, dan keputusan arsitektur. Memori ini berada di dalam basis data SQLite yang sama dengan indeks kode, bukan sebagai file yang berdiri sendiri.</p>
<p>Catatan: index1 adalah proyek tahap awal (0 bintang, 4 komitmen per Februari 2026). Evaluasi dengan basis kode Anda sendiri sebelum berkomitmen.</p>
<ul>
<li><strong>Paling</strong> cocok untuk: pengembang tunggal atau tim kecil dengan basis kode yang muat di satu mesin, yang mencari peningkatan cepat atas grep.</li>
<li>Lebih baik digunakan<strong>ketika</strong>: Anda membutuhkan akses multi-pengguna ke indeks yang sama, atau data Anda melebihi apa yang dapat ditangani oleh satu file SQLite dengan nyaman.</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD: akurasi yang lebih tinggi melalui pemeringkatan ulang LLM lokal</h4><p><a href="https://github.com/tobi/qmd">QMD</a> (Query Markup Documents), yang dibangun oleh pendiri Shopify, Tobi Lütke, menambahkan tahap ketiga: Pemeringkatan ulang LLM. Setelah BM25 dan pencarian vektor masing-masing mengembalikan kandidat, model bahasa lokal membaca ulang hasil teratas dan mengurutkannya kembali berdasarkan relevansi aktual dengan kueri Anda. Hal ini menangkap kasus-kasus di mana kata kunci dan kecocokan semantik mengembalikan hasil yang masuk akal tetapi salah.</p>
<p>QMD berjalan sepenuhnya di mesin Anda menggunakan tiga model GGUF dengan total sekitar 2 GB: model penyematan (embeddinggemma-300M), sebuah reranker penyandi silang (Qwen3-Reranker-0.6B), dan sebuah model perluasan kueri (qmd-query-expansion-1.7B). Ketiganya diunduh secara otomatis saat pertama kali dijalankan. Tidak ada panggilan API cloud, tidak ada kunci API.</p>
<p>Pengorbanannya adalah waktu mulai dingin: memuat tiga model dari disk membutuhkan waktu sekitar 15 hingga 16 detik. QMD mendukung mode server persisten (qmd mcp) yang menyimpan model dalam memori di antara permintaan, sehingga menghilangkan penalti mulai dingin untuk kueri yang berulang.</p>
<ul>
<li><strong>Terbaik untuk:</strong> lingkungan yang sangat menjaga privasi di mana tidak ada data yang dapat meninggalkan mesin Anda, dan di mana akurasi pengambilan lebih penting daripada waktu respons.</li>
<li><strong>Lebih</strong> baik<strong>digunakan ketika:</strong> Anda membutuhkan respons sub-detik, akses tim bersama, atau kumpulan data Anda melebihi kapasitas mesin tunggal.</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus: pencarian hibrida pada skala tim dan perusahaan</h4><p>Alat-alat mesin tunggal di atas bekerja dengan baik untuk pengembang individu, tetapi mereka mencapai batas ketika beberapa orang atau agen membutuhkan akses ke basis pengetahuan yang sama. <a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> adalah basis data vektor sumber terbuka yang dibuat untuk tahap berikutnya: terdistribusi, multi-pengguna, dan mampu menangani miliaran vektor.</p>
<p>Fitur utamanya untuk kasus penggunaan ini adalah Sparse-BM25 yang sudah ada di dalamnya, tersedia sejak Milvus 2.5 dan jauh lebih cepat pada versi 2.6. Anda memberikan teks mentah, dan Milvus menokenya secara internal menggunakan penganalisis yang dibangun di atas tantivy, kemudian mengubah hasilnya menjadi vektor jarang yang telah dihitung sebelumnya dan disimpan pada waktu indeks.</p>
<p>Karena representasi BM25 sudah tersimpan, pengambilan tidak perlu menghitung ulang skor dengan cepat. Vektor-vektor yang jarang ini berada di samping vektor-vektor yang padat (semantic embeddings) di dalam Koleksi yang sama. Pada waktu kueri, Anda menggabungkan kedua sinyal dengan pemeringkat seperti RRFRanker, yang disediakan oleh Milvus. Pola pencarian hibrida yang sama dengan index1 dan QMD, tetapi berjalan pada infrastruktur yang berskala horizontal.</p>
<p>Milvus juga menyediakan kemampuan yang tidak dapat dilakukan oleh alat mesin tunggal: isolasi multi-penyewa (basis data atau koleksi terpisah per tim), replikasi data dengan failover otomatis, dan tingkatan data panas/dingin untuk penyimpanan yang hemat biaya. Untuk agen, ini berarti beberapa pengembang atau beberapa contoh agen dapat meminta basis pengetahuan yang sama secara bersamaan tanpa menginjak data satu sama lain.</p>
<ul>
<li><strong>Paling cocok untuk</strong>: beberapa pengembang atau agen yang berbagi basis pengetahuan, kumpulan dokumen yang besar atau berkembang pesat, atau lingkungan produksi yang membutuhkan replikasi, failover, dan kontrol akses.</li>
</ul>
<p>Kesimpulannya:</p>
<table>
<thead>
<tr><th>Alat</th><th>Tahap</th><th>Penyebaran</th><th>Sinyal migrasi</th></tr>
</thead>
<tbody>
<tr><td>Claude Native Grep</td><td>Pembuatan prototipe</td><td>Bawaan, pengaturan nol</td><td>Tagihan naik atau kueri melambat</td></tr>
<tr><td>indeks1</td><td>Mesin tunggal (kecepatan)</td><td>SQLite + Ollama lokal</td><td>Membutuhkan akses multi-pengguna atau data melebihi satu mesin</td></tr>
<tr><td>QMD</td><td>Mesin tunggal (akurasi)</td><td>Tiga model GGUF lokal</td><td>Membutuhkan indeks yang digunakan bersama tim</td></tr>
<tr><td>Milvus</td><td>Tim atau Produksi</td><td>Cluster terdistribusi</td><td>Kumpulan dokumen besar atau persyaratan multi-penyewa</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">Mengurangi Biaya Token Agen AI dengan Memberikan Memori yang Persisten dan Dapat Diedit dengan memsearch</h3><p>Pengoptimalan pencarian mengurangi pemborosan token per kueri, tetapi tidak membantu dengan apa yang disimpan oleh agen di antara sesi.</p>
<p>Setiap bagian dari konteks yang diambil oleh agen dari memori harus dimuat ke dalam prompt, dan itu juga membutuhkan token. Pertanyaannya bukan apakah akan menyimpan memori, tetapi bagaimana caranya. Metode penyimpanan menentukan apakah Anda dapat melihat apa yang diingat oleh agen, memperbaikinya jika salah, dan membawanya jika Anda berganti alat.</p>
<p>Kebanyakan kerangka kerja gagal dalam ketiga hal tersebut. Mem0 dan Zep menyimpan segala sesuatu dalam basis data vektor, yang berfungsi untuk pengambilan, tetapi membuat memori:</p>
<ul>
<li><strong>Buram.</strong> Anda tidak dapat melihat apa yang diingat oleh agen tanpa meminta API.</li>
<li><strong>Sulit untuk diedit.</strong> Memperbaiki atau menghapus memori berarti pemanggilan API, bukan membuka file.</li>
<li><strong>Terkunci.</strong> Berganti kerangka kerja berarti mengekspor, mengonversi, dan mengimpor kembali data Anda.</li>
</ul>
<p>OpenClaw mengambil pendekatan yang berbeda. Semua memori berada dalam file Markdown biasa pada disk. Agen menulis log harian secara otomatis, dan manusia dapat membuka dan mengedit file memori secara langsung. Ini memecahkan ketiga masalah: memori dapat dibaca, diedit, dan portabel secara desain.</p>
<p>Pengorbanannya adalah biaya penyebaran. Menjalankan memori OpenClaw berarti menjalankan ekosistem OpenClaw secara penuh: proses Gateway, koneksi platform perpesanan, dan seluruh stack. Untuk tim yang sudah menggunakan OpenClaw, tidak masalah. Bagi orang lain, penghalang itu terlalu tinggi. <strong>memsearch</strong> dibangun untuk menutup celah ini: memsearch mengekstrak pola memori Markdown-first dari OpenClaw ke dalam pustaka mandiri yang bekerja dengan agen apa pun.</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearch</a></strong>, yang dibangun oleh Zilliz (tim di belakang Milvus), memperlakukan file Markdown sebagai sumber kebenaran tunggal. MEMORY.md menyimpan fakta-fakta jangka panjang dan keputusan yang Anda tulis dengan tangan. Catatan harian (2026-02-26.md) dibuat secara otomatis dari ringkasan sesi. Indeks vektor, yang disimpan di Milvus, adalah lapisan turunan yang dapat dibangun kembali dari Markdown kapan saja.</p>
<p>Dalam praktiknya, ini berarti Anda dapat membuka file memori apa pun di editor teks, membaca apa yang diketahui agen, dan mengubahnya. Simpan berkas, dan pengamat berkas memsearch akan mendeteksi perubahan dan mengindeks ulang secara otomatis. Anda bisa mengelola memori dengan Git, meninjau memori yang dibuat oleh AI melalui pull request, atau berpindah ke mesin baru dengan menyalin folder. Jika indeks Milvus hilang, Anda membangunnya kembali dari file. Berkas-berkas tersebut tidak pernah berisiko.</p>
<p>Di balik tenda, memsearch menggunakan pola pencarian hibrida yang sama dengan yang dijelaskan di atas: potongan-potongan yang dipisahkan berdasarkan struktur judul dan batas paragraf, pengambilan vektor BM25 +, dan perintah ringkas bertenaga LLM yang meringkas ingatan lama ketika log menjadi besar.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Paling cocok untuk: tim yang menginginkan visibilitas penuh ke dalam apa yang diingat oleh agen, membutuhkan kontrol versi atas memori, atau menginginkan sistem memori yang tidak terkunci pada satu kerangka kerja agen.</p>
<p>Kesimpulannya:</p>
<table>
<thead>
<tr><th>Kemampuan</th><th>Mem0 / Zep</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Sumber kebenaran</td><td>Basis data vektor (sumber data tunggal)</td><td>File penurunan harga (primer) + Milvus (indeks)</td></tr>
<tr><td>Transparansi</td><td>Kotak hitam, membutuhkan API untuk memeriksa</td><td>Buka file .md apa pun untuk dibaca</td></tr>
<tr><td>Dapat diedit</td><td>Memodifikasi melalui panggilan API</td><td>Edit langsung di editor teks apa pun, diindeks ulang secara otomatis</td></tr>
<tr><td>Kontrol versi</td><td>Membutuhkan pencatatan audit terpisah</td><td>Git bekerja secara native</td></tr>
<tr><td>Biaya migrasi</td><td>Ekspor → ubah format → impor ulang</td><td>Salin folder Penurunan Harga</td></tr>
<tr><td>Kolaborasi manusia dan AI</td><td>AI menulis, manusia mengamati</td><td>Manusia dapat mengedit, menambah, dan meninjau</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">Pengaturan mana yang sesuai dengan skala Anda<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
<tr><th>Skenario</th><th>Pencarian</th><th>Memori</th><th>Kapan harus melanjutkan</th></tr>
</thead>
<tbody>
<tr><td>Prototipe awal</td><td>Grep (bawaan)</td><td>-</td><td>Tagihan naik atau kueri melambat</td></tr>
<tr><td>Pengembang tunggal, hanya pencarian</td><td><a href="https://github.com/gladego/index1">index1</a> (kecepatan) atau <a href="https://github.com/tobi/qmd">QMD</a> (akurasi)</td><td>-</td><td>Membutuhkan akses multi-pengguna atau data melebihi satu mesin</td></tr>
<tr><td>Pengembang tunggal, keduanya</td><td><a href="https://github.com/gladego/index1">index1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Membutuhkan akses multi-pengguna atau data melebihi satu mesin</td></tr>
<tr><td>Tim atau produksi, keduanya</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>Integrasi cepat, hanya memori</td><td>-</td><td>Mem0 atau Zep</td><td>Perlu memeriksa, mengedit, atau memigrasi memori</td></tr>
</tbody>
</table>
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
    </button></h2><p>Biaya token yang muncul dengan agen AI yang selalu aktif tidak dapat dihindari. Panduan ini membahas dua area di mana perkakas yang lebih baik dapat mengurangi pemborosan: pencarian dan memori.</p>
<p>Grep bekerja dalam skala kecil, tetapi seiring dengan pertumbuhan basis kode, kecocokan kata kunci yang tidak diberi peringkat membanjiri jendela konteks dengan konten yang tidak pernah dibutuhkan oleh model. <a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a> dan <a href="https://github.com/tobi/qmd"></a> QMD mengatasi hal ini di satu mesin dengan menggabungkan penilaian kata kunci BM25 dengan penelusuran vektor dan hanya mengembalikan hasil yang paling relevan. Untuk tim, pengaturan multi-agen, atau beban kerja produksi, <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> menyediakan pola pencarian hibrida yang sama pada infrastruktur yang berskala horizontal.</p>
<p>Untuk memori, sebagian besar kerangka kerja menyimpan segala sesuatu dalam basis data vektor: buram, sulit diedit dengan tangan, dan terkunci pada kerangka kerja yang membuatnya. <a href="https://github.com/zilliztech/memsearch">memsearch</a> mengambil pendekatan yang berbeda. Memori berada dalam berkas Markdown biasa yang dapat Anda baca, edit, dan kontrol versi dengan Git. Milvus berfungsi sebagai indeks turunan yang dapat dibangun kembali dari berkas-berkas tersebut kapan saja. Anda tetap memegang kendali atas apa yang diketahui oleh agen.</p>
<p>Baik <a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a> dan <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus</a> adalah sumber terbuka. Kami secara aktif mengembangkan memsearch dan sangat mengharapkan umpan balik dari siapa pun yang menjalankannya dalam produksi. Buka masalah, kirimkan PR, atau beri tahu kami apa yang berhasil dan apa yang tidak.</p>
<p>Proyek-proyek yang disebutkan dalam panduan ini:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>: Memori pertama yang dapat dideteksi untuk agen AI, didukung oleh Milvus.</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: Basis data vektor sumber terbuka untuk pencarian hibrida yang dapat diskalakan.</li>
<li><a href="https://github.com/gladego/index1">index1</a>: Pencarian hibrida vektor BM25 + untuk agen pengkodean AI.</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: Pencarian hibrida lokal dengan pemeringkatan ulang LLM.</li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">Teruslah membaca<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Kami Mengekstrak Sistem Memori OpenClaw dan Membuka Sumbernya (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Memori Persisten untuk Kode Claude: memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Apa itu OpenClaw? Panduan Lengkap untuk Agen AI Sumber Terbuka</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial OpenClaw: Menghubungkan ke Slack untuk Asisten AI Lokal</a></li>
</ul>
