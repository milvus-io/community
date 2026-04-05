---
id: claude-code-memory-memsearch.md
title: >-
  Kami Membaca Sumber Bocoran Claude Code. Begini Cara Kerja Memorinya
  Sebenarnya
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  Sumber bocoran dari Claude Code mengungkapkan memori 4 lapis yang dibatasi
  pada 200 baris dengan pencarian hanya grep. Berikut ini cara kerja setiap
  lapisan dan perbaikan yang dilakukan memsearch.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>Kode sumber Claude Code dikirimkan ke publik secara tidak sengaja. Versi 2.1.88 menyertakan file peta sumber sebesar 59,8 MB yang seharusnya sudah dihapus dari build. Satu file itu berisi basis kode TypeScript yang lengkap dan dapat dibaca - 512.000 baris, yang sekarang dicerminkan di GitHub.</p>
<p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Sistem memori</a> menarik perhatian kami. Claude Code adalah agen pengkodean AI yang paling populer di pasaran, dan memori adalah bagian yang paling banyak berinteraksi dengan pengguna tanpa memahami cara kerjanya di balik layar. Jadi, kami pun menggali lebih dalam.</p>
<p>Versi singkatnya: Memori Claude Code lebih mendasar dari yang Anda kira. Memorinya terbatas pada 200 baris catatan. Ia hanya dapat menemukan memori dengan pencocokan kata kunci yang tepat - jika Anda bertanya tentang "konflik port", tetapi catatannya mengatakan "pemetaan docker-compose", Anda tidak akan mendapatkan apa-apa. Dan tidak ada satu pun yang keluar dari Claude Code. Beralihlah ke agen yang berbeda dan Anda mulai dari nol.</p>
<p>Berikut adalah empat lapisannya:</p>
<ul>
<li><strong>CLAUDE.md</strong> - berkas yang Anda tulis sendiri dengan aturan yang harus diikuti oleh Claude. Manual, statis, dan dibatasi oleh seberapa banyak yang Anda pikirkan untuk ditulis sebelumnya.</li>
<li><strong>Memori Otomatis</strong> - Claude membuat catatannya sendiri selama sesi. Berguna, tetapi dibatasi pada indeks 200 baris tanpa pencarian berdasarkan makna.</li>
<li><strong>Auto Dream</strong> - proses pembersihan latar belakang yang mengkonsolidasikan ingatan yang berantakan saat Anda menganggur. Membantu mengatasi kekacauan berhari-hari, tidak bisa menjembatani berbulan-bulan.</li>
<li><strong>KAIROS</strong> - mode daemon selalu aktif yang belum dirilis yang ditemukan dalam kode yang bocor. Belum ada dalam versi publik.</li>
</ul>
<p>Di bawah ini, kami membongkar setiap lapisan, lalu membahas di mana arsitekturnya rusak dan apa yang kami bangun untuk mengatasi kesenjangannya.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">Bagaimana Cara Kerja CLAUDE.md?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md adalah sebuah file Markdown yang Anda buat dan letakkan di dalam folder proyek Anda. Anda mengisinya dengan apa pun yang Anda inginkan agar Claude mengingatnya: aturan gaya kode, struktur proyek, perintah pengujian, langkah-langkah penerapan. Claude memuatnya di awal setiap sesi.</p>
<p>Ada tiga cakupan: tingkat proyek (di root repo), personal (<code translate="no">~/.claude/CLAUDE.md</code>), dan organisasi (konfigurasi perusahaan). Berkas yang lebih pendek dapat diikuti dengan lebih andal.</p>
<p>Batasannya jelas: CLAUDE.md hanya menyimpan hal-hal yang Anda tulis sebelumnya. Keputusan debug, preferensi yang Anda sebutkan di tengah percakapan, kasus-kasus yang Anda temukan bersama - semua itu tidak akan ditangkap kecuali Anda berhenti dan menambahkannya secara manual. Kebanyakan orang tidak melakukannya.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">Bagaimana Cara Kerja Memori Otomatis?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Memori Otomatis menangkap apa yang muncul selama bekerja. Claude memutuskan apa yang perlu disimpan dan menuliskannya ke folder memori pada mesin Anda, yang diatur ke dalam empat kategori: pengguna (peran dan preferensi), umpan balik (koreksi Anda), proyek (keputusan dan konteks), dan referensi (di mana segala sesuatunya berada).</p>
<p>Setiap catatan adalah file Markdown yang terpisah. Titik masuknya adalah <code translate="no">MEMORY.md</code> - sebuah indeks di mana setiap barisnya adalah label pendek (di bawah 150 karakter) yang menunjuk ke file yang lebih rinci. Claude membaca indeks tersebut, lalu menarik file tertentu jika terlihat relevan.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>200 baris pertama dari MEMORY.md dimuat ke dalam setiap sesi. Apa pun di luar itu tidak terlihat.</p>
<p>Satu pilihan desain yang cerdas: prompt sistem yang bocor memberi tahu Claude untuk memperlakukan memorinya sendiri sebagai petunjuk, bukan fakta. Ini memverifikasi terhadap kode nyata sebelum bertindak berdasarkan apa pun yang diingat, yang membantu mengurangi halusinasi - pola yang mulai diadopsi oleh <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">kerangka kerja agen AI</a> lainnya.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">Bagaimana Auto Dream Mengkonsolidasikan Ingatan yang Sudah Basi?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>Memori Otomatis menangkap catatan, tetapi setelah berminggu-minggu digunakan, catatan tersebut menjadi basi. Catatan yang mengatakan "bug penyebaran kemarin" menjadi tidak berarti setelah seminggu kemudian. Sebuah catatan mengatakan bahwa Anda menggunakan PostgreSQL; catatan yang lebih baru mengatakan bahwa Anda bermigrasi ke MySQL. File yang dihapus masih memiliki entri memori. Indeks penuh dengan kontradiksi dan referensi yang sudah usang.</p>
<p>Auto Dream adalah proses pembersihan. Ini berjalan di latar belakang dan:</p>
<ul>
<li>Mengganti referensi waktu yang tidak jelas dengan tanggal yang tepat. "Masalah penerapan kemarin" → "Masalah penerapan 2026-03-28."</li>
<li>Menyelesaikan kontradiksi. Catatan PostgreSQL + catatan MySQL → menyimpan kebenaran saat ini.</li>
<li>Menghapus entri yang sudah basi. Catatan yang merujuk ke file yang dihapus atau tugas yang sudah selesai akan dihapus.</li>
<li>Menjaga <code translate="no">MEMORY.md</code> di bawah 200 baris.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Kondisi pemicu:</strong> lebih dari 24 jam sejak pembersihan terakhir DAN setidaknya ada 5 sesi baru yang terkumpul. Anda juga bisa mengetik "dream" untuk menjalankannya secara manual. Proses ini berjalan di sub-agen latar belakang - seperti tidur yang sebenarnya, ini tidak akan mengganggu pekerjaan aktif Anda.</p>
<p>Perintah sistem agen mimpi dimulai dengan: <em>"Anda sedang menjalankan sebuah mimpi - sebuah umpan reflektif pada file memori Anda."</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">Apa itu KAIROS? Mode Selalu Aktif dari Claude Code yang Belum Pernah Dirilis<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>Tiga lapisan pertama sedang aktif atau diluncurkan. Kode yang bocor juga berisi sesuatu yang belum dikirimkan: KAIROS.</p>
<p>KAIROS - yang tampaknya diambil dari kata Yunani yang berarti "saat yang tepat" - muncul lebih dari 150 kali dalam sumbernya. Ini akan mengubah Claude Code dari alat yang Anda gunakan secara aktif menjadi asisten latar belakang yang mengawasi proyek Anda secara terus menerus.</p>
<p>Berdasarkan kode yang bocor, KAIROS:</p>
<ul>
<li>Menyimpan catatan pengamatan, keputusan, dan tindakan sepanjang hari.</li>
<li>Mengecek pada pengatur waktu. Secara berkala, ia menerima sinyal dan memutuskan: bertindak, atau diam.</li>
<li>Tetap berada di luar jangkauan Anda. Tindakan apa pun yang akan menghalangi Anda selama lebih dari 15 detik akan ditunda.</li>
<li>Menjalankan pembersihan mimpi secara internal, ditambah dengan putaran observasi-berpikir-bertindak di latar belakang.</li>
<li>Memiliki alat eksklusif yang tidak dimiliki oleh Claude Code biasa: mendorong file kepada Anda, mengirim pemberitahuan, memantau permintaan pull GitHub Anda.</li>
</ul>
<p>KAIROS berada di balik bendera fitur waktu kompilasi. Fitur ini tidak ada di build publik mana pun. Anggap saja sebagai Anthropic yang mengeksplorasi apa yang terjadi ketika <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">memori agen</a> berhenti menjadi sesi per sesi dan menjadi selalu aktif.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">Di Mana Arsitektur Memori Claude Code Bermasalah?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>Memori Claude Code bekerja dengan sangat baik. Namun, ada lima batasan struktural yang membatasi apa yang dapat ditangani seiring dengan pertumbuhan proyek.</p>
<table>
<thead>
<tr><th>Batasan</th><th>Apa yang terjadi</th></tr>
</thead>
<tbody>
<tr><td><strong>Batas indeks 200 baris</strong></td><td><code translate="no">MEMORY.md</code> menampung ~ 25 KB. Menjalankan sebuah proyek selama berbulan-bulan, dan entri yang lama terdesak oleh entri yang baru. "Konfigurasi Redis apa yang kita tetapkan minggu lalu?" - hilang.</td></tr>
<tr><td><strong>Pengambilan hanya dengan grep</strong></td><td>Pencarian memori menggunakan <a href="https://milvus.io/docs/full-text-search.md">pencocokan kata kunci</a> secara harfiah. Anda ingat "konflik porta waktu-penyaluran," tetapi catatannya mengatakan "pemetaan porta docker-compose." Grep tidak dapat menjembatani kesenjangan itu.</td></tr>
<tr><td><strong>Hanya ringkasan, tanpa penalaran</strong></td><td>Memori Otomatis menyimpan catatan tingkat tinggi, bukan langkah debug atau penalaran yang membawa Anda ke sana. <em>Bagaimana caranya</em> hilang.</td></tr>
<tr><td><strong>Tumpukan kerumitan tanpa memperbaiki fondasi</strong></td><td>CLAUDE.md → Memori Otomatis → Mimpi Otomatis → KAIROS. Setiap lapisan ada karena lapisan sebelumnya tidak cukup. Tetapi tidak ada jumlah lapisan yang mengubah apa yang ada di bawahnya: satu alat, file lokal, penangkapan sesi demi sesi.</td></tr>
<tr><td><strong>Memori terkunci di dalam Claude Code</strong></td><td>Beralihlah ke OpenCode, Codex CLI, atau agen lainnya dan Anda mulai dari nol. Tidak ada ekspor, tidak ada format bersama, tidak ada portabilitas.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ini bukan bug. Ini adalah batasan alami dari arsitektur alat tunggal, file lokal. Agen baru dikirimkan setiap bulan, alur kerja berubah, tetapi pengetahuan yang telah Anda bangun dalam sebuah proyek tidak boleh hilang bersama mereka. Itulah mengapa kami membangun <a href="https://github.com/zilliztech/memsearch">memsearch</a>.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">Apa itu memsearch? Memori Persisten untuk Agen Pengkodean AI Apa Pun<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a> menarik memori keluar dari agen dan masuk ke dalam lapisannya sendiri. Agen datang dan pergi. Memori tetap ada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">Cara Menginstal memsearch</h3><p>Pengguna Claude Code menginstal dari pasar:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>Selesai. Tidak perlu konfigurasi.</p>
<p>Platform lain juga sama sederhananya. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. API Python melalui uv atau pip:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">Apa yang Ditangkap oleh memsearch?</h3><p>Setelah diinstal, memsearch terhubung ke dalam siklus hidup agen. Setiap percakapan akan diringkas dan diindeks secara otomatis. Ketika Anda mengajukan pertanyaan yang membutuhkan riwayat, pemanggilan kembali akan muncul dengan sendirinya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>File memori disimpan sebagai Markdown bertanggal - satu file per hari:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>Anda dapat membuka, membaca, dan mengedit file memori di editor teks apa pun. Jika Anda ingin bermigrasi, Anda menyalin folder tersebut. Jika Anda menginginkan kontrol versi, git dapat digunakan.</p>
<p><a href="https://milvus.io/docs/index-explained.md">Indeks vektor</a> yang disimpan di <a href="https://milvus.io/docs/overview.md">Milvus</a> adalah lapisan cache - jika <a href="https://milvus.io/docs/index-explained.md">indeks</a> ini hilang, Anda dapat membangunnya kembali dari berkas-berkas Markdown. Data Anda berada di dalam berkas, bukan di dalam indeks.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">Bagaimana memsearch Menemukan Kenangan? Pencarian Semantik vs Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencarian memori Claude Code menggunakan grep - pencocokan kata kunci secara harfiah. Cara ini berhasil jika Anda memiliki beberapa lusin catatan, tetapi akan rusak setelah berbulan-bulan ketika Anda tidak dapat mengingat kata-katanya dengan tepat.</p>
<p>memsearch menggunakan <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">pencarian hibrida</a> sebagai gantinya. <a href="https://zilliz.com/glossary/semantic-search">Vektor semantik</a> menemukan konten yang terkait dengan kueri Anda meskipun kata-katanya berbeda, sementara BM25 mencocokkan kata kunci yang tepat. <a href="https://milvus.io/docs/rrf-ranker.md">RRF (Reciprocal Rank Fusion)</a> menggabungkan dan mengurutkan kedua set hasil secara bersamaan.</p>
<p>Katakanlah Anda bertanya "Bagaimana cara memperbaiki batas waktu Redis minggu lalu?" - Pencarian semantik memahami maksud pertanyaan tersebut dan menemukannya. Katakanlah Anda bertanya &quot;cari <code translate="no">handleTimeout</code>&quot; - BM25 menemukan nama fungsi yang tepat. Kedua jalur tersebut saling menutupi titik buta satu sama lain.</p>
<p>Saat pemanggilan kembali dipicu, sub-agen mencari dalam tiga tahap, masuk lebih dalam hanya jika diperlukan:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: Pencarian Semantik - Pratinjau Singkat</h3><p>Sub-agen menjalankan <code translate="no">memsearch search</code> terhadap indeks Milvus dan menarik hasil yang paling relevan:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Setiap hasil menampilkan skor relevansi, file sumber, dan pratinjau 200 karakter. Sebagian besar kueri berhenti di sini.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: Konteks Lengkap - Perluas Hasil Spesifik</h3><p>Jika pratinjau L1 tidak cukup, sub-agen menjalankan <code translate="no">memsearch expand a3f8c1</code> untuk menarik entri lengkap:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: Transkrip Percakapan Mentah</h3><p>Dalam kasus yang jarang terjadi di mana Anda perlu melihat dengan tepat apa yang dikatakan, sub-agen menarik percakapan asli:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Transkrip ini menyimpan semuanya: kata-kata persis Anda, respons persis agen, dan setiap panggilan alat. Tiga tahap ini dimulai dari yang ringan hingga yang berat - sub-agen memutuskan seberapa dalam untuk mengebor, lalu mengembalikan hasil yang terorganisir ke sesi utama Anda.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">Bagaimana memsearch Membagi Memori di Seluruh Agen Pengkodean AI?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Ini adalah kesenjangan yang paling mendasar antara memsearch dan memori Claude Code.</p>
<p>Memori Claude Code terkunci di dalam satu alat. Gunakan OpenCode, OpenClaw, atau Codex CLI, dan Anda mulai dari awal. MEMORY.md bersifat lokal, terikat pada satu pengguna dan satu agen.</p>
<p>memsearch mendukung empat agen pengkodean: Claude Code, OpenClaw, OpenCode, dan Codex CLI. Mereka berbagi format memori Markdown yang sama dan <a href="https://milvus.io/docs/manage-collections.md">koleksi Milvus</a> yang sama. Memori yang ditulis dari agen mana pun dapat dicari dari setiap agen lainnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dua skenario nyata:</strong></p>
<p><strong>Bertukar alat.</strong> Anda menghabiskan waktu seharian di Claude Code untuk mencari tahu pipeline deploy, dan menemui beberapa kendala. Percakapan dirangkum dan diindeks secara otomatis. Keesokan harinya Anda beralih ke OpenCode dan bertanya "bagaimana kita menyelesaikan konflik port kemarin?" OpenCode mencari di memsearch, menemukan memori Claude Code kemarin, dan memberikan jawaban yang tepat.</p>
<p><strong>Kolaborasi tim.</strong> Arahkan backend Milvus ke <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> dan beberapa pengembang di mesin yang berbeda, menggunakan agen yang berbeda, membaca dan menulis memori proyek yang sama. Anggota tim baru bergabung dan tidak perlu menggali Slack dan dokumen selama berbulan-bulan - agen sudah tahu.</p>
<h2 id="Developer-API" class="common-anchor-header">API Pengembang<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda membangun <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">perkakas agen</a> Anda sendiri, memsearch menyediakan API CLI dan Python.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>API Python:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>Di balik layar, Milvus menangani pencarian vektor. Jalankan secara lokal dengan <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (konfigurasi nol), berkolaborasi melalui <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (tersedia tingkat gratis), atau host sendiri dengan Docker. <a href="https://milvus.io/docs/embeddings.md">Penyematan</a> secara default ke ONNX - berjalan pada CPU, tidak perlu GPU. Tukar di OpenAI atau Ollama kapan saja.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Memori Kode Claude vs memsearch: Perbandingan Lengkap<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
<tr><th>Fitur</th><th>Memori Claude Code</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Apa yang disimpan</td><td>Apa yang dianggap penting oleh Claude</td><td>Setiap percakapan, diringkas secara otomatis</td></tr>
<tr><td>Batas penyimpanan</td><td>Indeks ~200 baris (~25 KB)</td><td>Tidak terbatas (file harian + indeks vektor)</td></tr>
<tr><td>Menemukan kenangan lama</td><td>Pencocokan kata kunci Grep</td><td>Pencarian hibrida berbasis makna + kata kunci (Milvus)</td></tr>
<tr><td>Dapatkah Anda membacanya?</td><td>Periksa folder memori secara manual</td><td>Buka file .md apa pun</td></tr>
<tr><td>Dapatkah Anda mengeditnya?</td><td>Mengedit file dengan tangan</td><td>Sama - indeks ulang otomatis saat menyimpan</td></tr>
<tr><td>Kontrol versi</td><td>Tidak dirancang untuk itu</td><td>git bekerja secara native</td></tr>
<tr><td>Dukungan lintas alat</td><td>Hanya Kode Claude</td><td>4 agen, memori bersama</td></tr>
<tr><td>Daya ingat jangka panjang</td><td>Menurun setelah berminggu-minggu</td><td>Persisten selama berbulan-bulan</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">Memulai dengan memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memori Claude Code memiliki kekuatan yang nyata - desain yang skeptis, konsep konsolidasi mimpi, dan anggaran pemblokiran 15 detik di KAIROS. Anthropic berpikir keras tentang masalah ini.</p>
<p>Tetapi memori alat tunggal memiliki batas maksimal. Ketika alur kerja Anda mencakup banyak agen, banyak orang, atau lebih dari beberapa minggu sejarah, Anda membutuhkan memori yang berdiri sendiri.</p>
<ul>
<li>Cobalah <a href="https://github.com/zilliztech/memsearch">memsearch</a> - sumber terbuka, berlisensi MIT. Instal di Claude Code dengan dua perintah.</li>
<li>Baca <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">cara kerja memsearch</a> di <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">balik layar</a> atau <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">panduan plugin Claude Code</a>.</li>
<li>Punya pertanyaan? Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Milvus Discord</a> atau <a href="https://milvus.io/office-hours">pesan sesi Office Hours gratis</a> untuk membahas kasus penggunaan Anda.</li>
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">Bagaimana cara kerja sistem memori Claude Code di balik layar?</h3><p>Claude Code menggunakan arsitektur memori empat lapis, semuanya disimpan sebagai file Markdown lokal. CLAUDE.md adalah file aturan statis yang Anda tulis secara manual. Memori Otomatis memungkinkan Claude menyimpan catatannya sendiri selama sesi, yang diatur ke dalam empat kategori - preferensi pengguna, umpan balik, konteks proyek, dan petunjuk referensi. Auto Dream mengkonsolidasikan memori yang sudah basi di latar belakang. KAIROS adalah daemon yang selalu aktif yang belum dirilis yang ditemukan dalam kode sumber yang bocor. Seluruh sistem dibatasi pada indeks 200 baris dan hanya dapat dicari dengan pencocokan kata kunci yang tepat - tidak ada pencarian semantik atau penarikan berdasarkan makna.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">Dapatkah agen pengkodean AI berbagi memori di berbagai alat yang berbeda?</h3><p>Tidak secara native. Memori Claude Code terkunci pada Claude Code - tidak ada format ekspor atau protokol lintas agen. Jika Anda beralih ke OpenCode, Codex CLI, atau OpenClaw, Anda mulai dari awal. memsearch memecahkan masalah ini dengan menyimpan memori sebagai file Markdown bertanggal yang diindeks dalam <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> (Milvus). Keempat agen yang didukung membaca dan menulis penyimpanan memori yang sama, sehingga konteks ditransfer secara otomatis ketika Anda berganti alat.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">Apa perbedaan antara pencarian kata kunci dan pencarian semantik untuk memori agen?</h3><p>Pencarian kata kunci (grep) mencocokkan string yang tepat - jika memori Anda mengatakan "docker-compose port mapping" namun Anda mencari "port conflicts", pencarian ini tidak akan menghasilkan apa pun. Pencarian semantik mengubah teks menjadi sematan <a href="https://zilliz.com/glossary/vector-embeddings">vektor</a> yang menangkap makna, sehingga konsep yang terkait dapat dicocokkan meskipun dengan kata-kata yang berbeda. memsearch menggabungkan kedua pendekatan tersebut dengan pencarian hibrida, memberikan Anda penarikan berbasis makna dan ketepatan kata kunci yang tepat dalam satu kueri.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">Apa yang bocor dalam insiden kode sumber Claude Code?</h3><p>Versi 2.1.88 dari Claude Code dikirimkan dengan file peta sumber sebesar 59,8 MB yang seharusnya telah dihapus dari versi produksi. File ini berisi basis kode TypeScript yang lengkap dan dapat dibaca - sekitar 512.000 baris - termasuk implementasi sistem memori penuh, proses konsolidasi Auto Dream, dan referensi ke KAIROS, mode agen yang selalu aktif yang belum dirilis. Kode tersebut dengan cepat dicerminkan di GitHub sebelum dapat dihapus.</p>
