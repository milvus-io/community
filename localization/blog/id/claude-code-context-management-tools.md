---
id: claude-code-context-management-tools.md
title: 7 Alat Sumber Terbuka Terbaik untuk Manajemen Konteks Kode Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/cccm_11zon_848f7f1c6b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >-
  Sesi Kode Claude yang panjang kehilangan sinyal dengan cepat. Pelajari 7 alat
  untuk memangkas kebisingan terminal, pengambilan kode, keluaran alat, memori,
  dan penggunaan token.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Anda dapat memberikan Claude Code jendela konteks berukuran 1M dan masih mendapatkan jawaban yang lebih buruk dari waktu ke waktu. Masalahnya bukan hanya ukuran konteks. Ini adalah kualitas konteks.</p>
<p>Sesi Claude Code menurun ketika log terminal, output alat mentah, pembacaan file berulang, respons yang bertele-tele, dan riwayat proyek yang terlupakan, semuanya bersaing untuk mendapatkan perhatian. Dalam alur kerja agen yang sudah berjalan lama, kebisingan itu berubah menjadi sebuah lingkaran: model kehilangan thread, Anda menambahkan lebih banyak putaran untuk memperbaiki jawabannya, dan putaran ekstra itu menambah lebih banyak kebisingan.</p>
<p>Ini adalah <strong>defokus konteks</strong>: model memiliki ruang yang cukup untuk menyimpan informasi, tetapi informasi penting terkubur di bawah konteks sinyal rendah. Jendela yang lebih besar dapat membuat hal ini lebih mudah diabaikan karena pengembang tidak lagi memikirkan dengan cermat apa yang masuk ke dalam prompt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>Diagram cache prompt yang menunjukkan bagaimana awalan yang digunakan kembali masih dapat menambahkan konteks yang ditagih secara bergantian</span> </span></p>
<p>Prompt caching dapat mengurangi biaya awalan berulang, tetapi tidak mengubah jendela konteks menjadi laci sampah. Anda masih membayar untuk token baru, dan Anda masih membutuhkan model untuk menalar informasi yang tepat.</p>
<p>Artikel ini mengulas tujuh alat sumber terbuka yang menyerang defokus konteks dari berbagai lapisan: keluaran terminal, keluaran alat, navigasi basis kode, pembacaan file, verbositas model, pengambilan kode semantik, dan memori lintas sesi. Hal ini juga menjelaskan bagaimana ide-ide ini dipetakan ke desain <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a>, <a href="https://zilliz.com/learn/vector-similarity-search">pencarian kemiripan vektor</a>, dan sistem pengambilan seperti Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Apa yang menyebabkan defokus konteks Claude Code?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code context defocus biasanya berasal dari lima mode kegagalan: terlalu banyak teks instruksi mentah, output alat yang berisik, eksplorasi basis kode yang berulang-ulang, respons model yang panjang, dan kesenjangan memori di seluruh sesi atau agen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>Lima penyebab hilangnya konteks Claude Code: instruksi yang berlebihan, keluaran alat yang berantakan, pengambilan basis kode yang berulang-ulang, respons yang panjang, dan kesenjangan memori</span> </span></p>
<table>
<thead>
<tr><th>Mode kegagalan konteks</th><th>Seperti apa tampilannya dalam Claude Code</th><th>Kategori alat yang membantu</th></tr>
</thead>
<tbody>
<tr><td>Log terminal berisik</td><td><code translate="no">git</code> <code translate="no">pytest</code>, , dan CLI cloud membuang lebih banyak teks daripada yang dibutuhkan model. <code translate="no">gh</code></td><td>Kompresi keluaran CLI</td></tr>
<tr><td>Output alat membanjiri jendela</td><td>Log uji, dump DOM, dan output MCP masuk ke dalam obrolan sebagai blok mentah raksasa.</td><td>Kotak pasir keluaran alat</td></tr>
<tr><td>Pengulangan navigasi basis kode</td><td>Claude membuat daftar direktori, grep, membaca file, dan mengulangi eksplorasi yang sama setiap sesi.</td><td>Grafik kode atau pengambilan semantik</td></tr>
<tr><td>Pembacaan file terlalu luas</td><td>Model membaca seluruh file ketika hanya membutuhkan satu simbol atau ringkasan.</td><td>Pembacaan kode progresif</td></tr>
<tr><td>Claude berbicara terlalu banyak</td><td>Jawaban itu sendiri menambahkan konteks yang tidak perlu untuk giliran berikutnya.</td><td>Kompresi respons</td></tr>
<tr><td>Memori tidak bertahan</td><td>Anda menjelaskan kembali keputusan proyek setiap kali Anda memulai sesi baru.</td><td>Memori yang didahulukan</td></tr>
</tbody>
</table>
<p>Tumpukan manajemen konteks yang baik harus melakukan tiga hal: menjauhkan sampah, mengambil pengetahuan proyek yang tepat sesuai permintaan, dan mempertahankan keputusan yang tahan lama di seluruh sesi.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Alat konteks Claude Code mana yang harus Anda gunakan pertama kali?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Mulailah dengan layer yang paling banyak menimbulkan gangguan dalam alur kerja Anda. Jika output terminal Anda yang menjadi masalah, mulailah dengan RTK. Jika Claude terus berkeliaran di repositori yang besar, mulailah dengan claude-context atau code-review-graph. Jika masalah Anda yang sebenarnya adalah menjelaskan ulang keputusan yang sama setiap hari, mulailah dengan memsearch.</p>
<table>
<thead>
<tr><th>Alat</th><th>Masalah utama yang dipecahkan</th><th>Paling cocok</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Output terminal yang berisik dari perintah-perintah pengembang yang umum.</td><td>Pengembang yang menjalankan banyak perintah CLI di dalam Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Mode Konteks</a></td><td>Keluaran alat mentah yang sangat besar yang masuk ke dalam percakapan utama.</td><td>Pengguna Playwright, GitHub, log, atau alat MCP yang berat.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">kode-tinjauan-grafik</a></td><td>Eksplorasi basis kode buta dalam repositori besar.</td><td>Ulasan, analisis ketergantungan, dan pertanyaan radius ledakan.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Penyelamat Token</a></td><td>Pembacaan file penuh ketika ringkasan simbol sudah cukup.</td><td>File besar, pencarian simbol berulang, dan pembacaan kode tambahan.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Kebiasaan respons Claude yang bertele-tele.</td><td>Pengguna yang menginginkan keluaran singkat dan konteks masa depan yang lebih kecil.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>Menjelajahi kembali basis kode setiap sesi.</td><td>Pencarian kode semantik melalui MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Menghilangkan memori proyek di seluruh sesi, agen, dan peralihan model.</td><td>Proyek yang sudah berjalan lama dengan keputusan dan pelajaran yang tahan lama.</td></tr>
</tbody>
</table>
<p>Lima alat pertama mengurangi apa yang masuk atau tetap dalam konteks. Dua yang terakhir membuat konteks yang berguna lebih mudah diingat.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK memampatkan keluaran perintah mentah sebelum Claude melihatnya<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK adalah proksi CLI untuk mengurangi penggunaan token dari perintah pengembang yang umum. Deskripsi GitHub-nya mengatakan bahwa RTK mengurangi konsumsi token LLM sebesar 60-90% pada perintah pengembang umum, dan dikirim sebagai biner Rust tunggal.</p>
<p>Dalam penggunaan Claude Code sehari-hari, perintah seperti <code translate="no">git status</code>, <code translate="no">pytest</code>, dan daftar direktori sering kali membuang info lingkungan lengkap dan deskripsi status ke dalam jendela konteks. Model ini biasanya hanya membutuhkan jawaban yang lebih kecil: file mana yang berubah, tes mana yang gagal, di mana PR macet, atau file kunci apa yang ada dalam direktori.</p>
<p>RTK berada di antara shell dan Claude. Ia dapat menulis ulang perintah melalui kait Kode Claude dan meneruskan kembali keluaran yang telah dikompresi.</p>
<p>Keluaran <code translate="no">git status</code> mentah:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>Apa yang sebenarnya penting:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Cerita yang sama dengan <code translate="no">pytest</code>. Output mentah penuh dengan kasus yang lewat dan kebisingan lingkungan:</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>Dikompresi, sinyalnya langsung:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK adalah titik awal yang paling mudah ketika konteks bloat Anda berasal dari perintah shell daripada pengambilan kode.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">Mode Konteks kotak pasir keluaran alat raksasa di luar obrolan utama<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Mode Konteks dibuat untuk blok mentah yang dikembalikan oleh alat: log pengujian, snapshot DOM peramban, muatan GitHub, keluaran alat MCP, dan halaman yang dikikis. Deskripsi GitHub-nya menyoroti pengoptimalan konteks-jendela untuk agen pengkodean AI dan melaporkan pengurangan keluaran alat sebesar 98%.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>Kartu repositori GitHub Mode Konteks yang menunjukkan keluaran alat di kotak pasir dan pemosisian pengoptimalan konteks</span> </span></p>
<p>Pendekatannya adalah mengisolasi keluaran alat yang besar ke dalam kotak pasir dan indeks lokal, lalu hanya meneruskan ringkasan dan pegangan pengambilan ke dalam percakapan Claude.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>Alur Mode Konteks yang menunjukkan keluaran alat besar yang bergerak melalui eksekusi kotak pasir, indeks SQLite atau FTS, ringkasan, dan hasil pengambilan</span> </span></p>
<p>Alur ini berguna karena agen pengkodean sering kali membutuhkan simpul yang gagal, pemilih yang rusak, atau jejak tumpukan yang relevan, bukan seluruh DOM atau setiap baris pengujian yang lewat. Mode Konteks menjaga agar hasil lengkap tetap tersedia secara lokal sekaligus mencegahnya mendominasi percakapan utama.</p>
<p>Hal ini mirip dengan bagaimana sistem <a href="https://zilliz.com/blog/hybrid-search-with-milvus">pencarian hibrida</a> produksi memisahkan penyimpanan dari pengambilan. Anda menyimpan data mentah di suatu tempat yang tahan lama, lalu hanya mengambil bagian yang penting.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph memetakan struktur kode sebelum Claude menavigasinya<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph menangani masalah yang berbeda: Claude tidak selalu membutuhkan lebih banyak teks; ia membutuhkan peta yang lebih baik.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>gambar logo code-review-graph yang digunakan di artikel aslinya</span> </span></p>
<p>Di repositori yang besar, sebuah pertanyaan sederhana dapat memicu eksplorasi yang mahal:</p>
<blockquote>
<p>Setelah mengubah logika login ini, file dan tes mana yang terpengaruh?</p>
</blockquote>
<p>Tanpa grafik kode, langkah yang biasa dilakukan Claude adalah:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-grafik membuat peta struktural basis kode. Ia menggunakan Tree-sitter untuk mengurai fungsi, kelas, impor, hubungan pemanggilan, pewarisan, dan ketergantungan pengujian, kemudian menulis grafik ke dalam SQLite.</p>
<p>Hal ini membuatnya berguna untuk tinjauan kode dan analisis blast-radius. Daripada meminta Claude untuk menemukan kembali grafik ketergantungan melalui pembacaan berulang kali, Anda membiarkannya menanyakan struktur terlebih dahulu.</p>
<p>Ini berdekatan dengan <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">pencarian semantik</a>, tetapi tidak identik. Grafik struktural menjawab "apa yang bergantung pada apa?" Pencarian semantik menjawab "kode apa yang secara konseptual terkait dengan pertanyaan ini?" Dalam alur kerja asisten kode yang sebenarnya, Anda sering menginginkan keduanya.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior memberikan ringkasan simbol Claude sebelum file lengkap<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Ide inti dari Token Savior adalah sederhana: jangan mengirim file lengkap secara default. Kirimkan ringkasan indeks atau simbol terlebih dahulu, lalu perluas hanya ketika tugas membutuhkan lebih banyak detail.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>Kartu repositori GitHub Token Savior yang menunjukkan deskripsi server MCP dan statistik proyeknya</span> </span></p>
<p>Jika Anda bertanya di mana webhook pembayaran ditangani, model ini sering kali tidak memerlukan setiap baris dari setiap file terkait. Pertama-tama, model perlu mengetahui apakah sebuah file atau simbol relevan.</p>
<p>Token Savior menyajikan kode dalam beberapa lapisan:</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Apa yang diterima Claude</th><th>Ketika mengembang</th></tr>
</thead>
<tbody>
<tr><td>Ringkasan</td><td>Indeks, nama simbol, dan deskripsi singkat.</td><td>Tanggapan pertama default.</td></tr>
<tr><td>Cuplikan</td><td>Bagian kode yang lebih kecil di sekitar simbol yang relevan.</td><td>Ketika ringkasan mungkin relevan.</td></tr>
<tr><td>File lengkap</td><td>Konten file lengkap.</td><td>Hanya jika pengeditan atau penalaran mendalam membutuhkannya.</td></tr>
</tbody>
</table>
<p>Ini mencerminkan bagaimana pengembang benar-benar membaca kode. Anda memindai, mengonfirmasi relevansi, lalu membuka file lengkap hanya jika diperlukan. Ini juga menyerupai pola pengambilan progresif yang digunakan dalam <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">aplikasi RAG</a>: mengambil cukup luas untuk mengarahkan, kemudian mempersempit konteks sebelum pembuatan.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman mengurangi respons Claude yang membengkak<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagian besar alat konteks berfokus pada apa yang masuk ke dalam model. Caveman menargetkan apa yang dihasilkan oleh Claude.</p>
<p>Caveman adalah skill/plugin Claude Code yang menghilangkan filler, basa-basi, kalimat pembungkus, penjelasan yang berlebihan, dan struktur yang berulang-ulang. Tujuannya bukan untuk menghilangkan pengetahuan; melainkan untuk membuat jawaban menjadi lebih padat.</p>
<p>Tanpa manusia gua:</p>
<blockquote>
<p>Alasan komponen React Anda di-render ulang kemungkinan besar karena...</p>
</blockquote>
<p>Dengan Caveman:</p>
<blockquote>
<p>Ref objek baru setiap kali di-render. Inline object prop = new ref = re-render. Bungkus dalam useMemo.</p>
</blockquote>
<p>Hal ini penting karena jawaban dari Claude sendiri menjadi konteks di masa depan. Jika setiap jawaban menyertakan penjelasan yang panjang, giliran berikutnya akan dimulai dengan lebih banyak teks daripada yang dibutuhkan. Jawaban yang lebih pendek dapat meningkatkan giliran berikutnya seperti halnya meningkatkan giliran saat ini.</p>
<p>Untuk tim yang berpikir tentang <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">rekayasa konteks untuk agen AI</a>, Caveman adalah pengingat bahwa kebijakan output adalah bagian dari kebijakan konteks.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context menambahkan pencarian kode semantik melalui MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context memecahkan masalah eksplorasi basis kode yang berulang-ulang dengan pencarian semantik. Ini mengindeks repositori, menyimpan potongan kode dalam basis data vektor, dan mengekspos pencarian melalui <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Protokol Konteks Model</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Repositori Claude Context yang ditampilkan di GitHub Trending di artikel aslinya</span> </span></p>
<p>Dalam basis kode yang besar, Anda terus-menerus mengajukan pertanyaan kepada Claude seperti:</p>
<blockquote>
<p>Bantu saya mencari tahu bagian kode mana yang mungkin terkait dengan bug ini.</p>
</blockquote>
<p>Tanpa lapisan pengambilan, pendekatan default Claude sering kali:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context memindahkan kode yang bekerja ke dalam retrieval layer. Ini memotong repositori, menghasilkan embedding, menyimpannya dalam <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">indeks kode yang didukung Milvus</a>, dan mengambil potongan kode yang relevan sebelum model mulai membaca file secara membabi buta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>Alur konteks claude yang menunjukkan pemotongan basis kode, penyematan, basis data vektor dan pencarian hybrid, pengambilan kode yang relevan, dan injeksi konteks Claude</span> </span></p>
<p>Di sinilah alat pengkodean AI mulai terlihat seperti sistem pencarian. Anda membutuhkan chunking, embeddings, metadata, pencocokan leksikal, pemeringkatan, dan kesegaran. Semua itu adalah blok bangunan yang sama di balik <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">pengambilan RAG produksi</a>, perutean <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">pengambilan hibrida</a>, dan <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">pemilihan model penyematan</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch menyimpan memori yang berguna di seluruh sesi dan agen<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch menangani sisi berlawanan dari masalah: bukan apa yang harus dilupakan, tetapi bagaimana cara mengingat apa yang penting.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>gambar logo memsearch dari artikel asli</span> </span></p>
<p>Bayangkan Anda memberi tahu Claude pada hari Senin:</p>
<blockquote>
<p>Webhook kita tidak dapat mencoba kembali saat gagal - acara yang gagal harus masuk ke dalam antrean surat mati.</p>
</blockquote>
<p>Pada hari Rabu, Anda membuka sesi baru dan bertanya:</p>
<blockquote>
<p>Apa lagi yang bisa kita optimalkan di lapisan webhook?</p>
</blockquote>
<p>Tanpa memori yang tahan lama, Claude memperlakukan keputusan hari Senin seolah-olah tidak pernah terjadi. Anda menjelaskannya lagi.</p>
<p>memsearch menyimpan memori sebagai file Markdown lokal yang dapat dibaca manusia dan menggunakan Milvus sebagai indeks pencarian yang dapat dibangun kembali. Desain tersebut membuat memori dapat diedit oleh manusia sambil tetap membuatnya dapat dicari oleh agen.</p>
<p>Pada saat pengambilan, memsearch menggunakan pencarian progresif: cari terlebih dahulu, perluas jika perlu, lalu telusuri ke transkrip asli hanya jika diperlukan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>Alur pencarian progresif memsearch yang menunjukkan pencarian, perluasan, transkrip, dan ringkasan kembali ke percakapan utama</span> </span></p>
<p>Pola Markdown-first ini berguna untuk tim yang bekerja di seluruh sesi, model, dan agen. Pola ini juga berpasangan secara alami dengan <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">memori agen AI jangka panjang</a>, <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">memori multi-agen bersama</a>, dan masalah yang lebih luas untuk mencegah pembusukan <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">konteks dalam sistem agen</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">Bagaimana alat ini bekerja bersama?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketujuh alat ini saling melengkapi, tidak dapat dipertukarkan. Gunakan mereka sebagai lapisan.</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Gunakan alat-alat ini</th><th>Mengapa</th></tr>
</thead>
<tbody>
<tr><td>Menghilangkan suara perintah</td><td>RTK</td><td>Mengompres output terminal bervolume tinggi sebelum mencapai Claude.</td></tr>
<tr><td>Keluaran alat mentah kotak pasir</td><td>Mode Konteks</td><td>Menyimpan log besar, DOM, dan muatan alat di luar percakapan utama.</td></tr>
<tr><td>Struktur kode peta</td><td>kode-tinjauan-grafik</td><td>Menjawab pertanyaan ketergantungan dan radius ledakan tanpa pembacaan file buta.</td></tr>
<tr><td>Baca kode secara progresif</td><td>Penyelamat Token</td><td>Mulailah dengan ringkasan simbol, lalu kembangkan hanya sesuai kebutuhan.</td></tr>
<tr><td>Kompres jawaban Claude</td><td>Manusia gua</td><td>Mencegah keluaran model itu sendiri menjadi konteks yang membengkak di masa depan.</td></tr>
<tr><td>Ambil kode yang relevan</td><td>claude-konteks</td><td>Gunakan pencarian kode semantik dan hibrida alih-alih perulangan grep berulang.</td></tr>
<tr><td>Gunakan kembali keputusan yang tahan lama</td><td>memsearch</td><td>Memanggil kembali riwayat proyek di seluruh sesi, agen, dan peralihan model.</td></tr>
</tbody>
</table>
<p>Urutan peluncuran yang praktis adalah:</p>
<ol>
<li><strong>Hilangkan noise yang jelas terlebih dahulu.</strong> Tambahkan RTK atau Mode Konteks jika keluaran shell dan muatan alat mendominasi konteks Anda.</li>
<li><strong>Perbaiki navigasi repositori.</strong> Tambahkan kode-tinjauan-grafik untuk struktur atau claude-konteks untuk pengambilan kode semantik.</li>
<li><strong>Kontrol apa yang tersisa.</strong> Gunakan Token Savior dan Caveman untuk menjaga pembacaan file dan respons model tetap ringkas.</li>
<li><strong>Pertahankan pengetahuan yang tahan lama.</strong> Gunakan memsearch ketika penjelasan yang berulang-ulang menjadi hambatan.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">Tetap terhubung<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Milvus Discord</a> untuk mengajukan pertanyaan dan membandingkan pola manajemen konteks dengan pengembang lain.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Jam Kantor Milvus gratis</a> jika Anda ingin mendapatkan bantuan dalam merancang lapisan pengambilan untuk kode, memori, atau beban kerja RAG.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (dikelola Milvus) menawarkan tingkat gratis untuk memulai.</li>
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
    </button></h2><p><strong>Bagaimana cara mengurangi penggunaan token Claude Code tanpa kehilangan konteks yang berguna?</strong></p>
<p>Mulailah dengan mengompresi input yang paling berisik: output terminal, muatan alat mentah, dan pembacaan kode yang berulang. Kemudian tambahkan alat pengambilan seperti claude-context atau code-review-graph sehingga Claude dapat menarik kode yang relevan alih-alih menjelajahi repositori dari awal.</p>
<p><strong>Haruskah saya menggunakan claude-context atau code-review-graph untuk repositori yang besar?</strong></p>
<p>Gunakan claude-context ketika Anda membutuhkan pencarian kode semantik, terutama ketika Anda tidak mengetahui nama file atau simbol yang tepat. Gunakan code-review-graph ketika Anda membutuhkan jawaban struktural seperti hubungan panggilan, impor, ketergantungan pengujian, dan meninjau radius ledakan.</p>
<p><strong>Apakah memori berbeda dengan pengambilan kode di Claude Code?</strong></p>
<p>Ya. Pengambilan kode menemukan file atau simbol proyek yang relevan. Pengambilan memori mengingat keputusan yang tahan lama, preferensi pengguna, riwayat debugging, dan pelajaran lintas sesi. memsearch berfokus pada memori; claude-context berfokus pada pengambilan kode.</p>
<p><strong>Apakah alat-alat ini menggantikan cache yang cepat atau jendela konteks yang lebih besar?</strong></p>
<p>Tidak. Prompt caching dan jendela konteks yang besar membantu dalam hal kapasitas dan biaya, namun tidak memutuskan informasi apa yang perlu diperhatikan. Alat-alat manajemen konteks meningkatkan kualitas dan kepadatan dari apa yang masuk ke dalam model sejak awal. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/cccm_11zon_848f7f1c6b.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /><span>cccm 11zon</span> </span></p>
