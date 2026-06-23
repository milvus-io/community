---
id: claude-code-context-management-tools.md
title: |
  7 Alat Sumber Terbuka Terbaik untuk Pengelolaan Konteks Kode Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >
  Sesi Long Claude Code cepat kehilangan sinyal. Pelajari 7 alat untuk
  mengurangi gangguan terminal, pemulihan kode, keluaran alat, penggunaan
  memori, dan penggunaan token.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Anda bisa memberikan jendela konteks sebesar 1 juta token kepada Claude Code, namun tetap saja jawaban yang dihasilkan akan semakin buruk seiring berjalannya waktu. Masalahnya bukan hanya ukuran konteks, melainkan kualitas konteks.</p>
<p>Sesi Claude Code menjadi kurang optimal ketika log terminal, output alat mentah, pembacaan berkas berulang, respons yang terlalu rinci, dan riwayat proyek yang terlupakan saling bersaing untuk mendapatkan perhatian. Dalam alur kerja agen yang berjalan lama, gangguan tersebut berubah menjadi lingkaran setan: model kehilangan alur, Anda menambahkan lebih banyak giliran untuk memperbaiki jawaban, dan giliran tambahan tersebut justru menambah lebih banyak gangguan.</p>
<p>Inilah yang disebut <strong>kehilangan fokus konteks</strong>: model memiliki ruang yang cukup untuk menyimpan informasi, tetapi informasi penting tertimbun di bawah konteks yang kurang relevan. Jendela yang lebih besar dapat membuat hal ini lebih mudah diabaikan karena pengembang berhenti memikirkan dengan cermat apa yang dimasukkan ke dalam prompt.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>Diagram penyimpanan prompt yang menunjukkan bagaimana prefiks yang digunakan kembali tetap dapat menambah konteks yang dikenakan biaya di seluruh putaran</span>
  
 </span></p>
<p>Penyimpanan prompt dapat mengurangi biaya prefiks berulang, tetapi hal ini tidak mengubah jendela konteks menjadi laci sampah. Anda tetap harus membayar untuk token baru, dan model tetap perlu melakukan penalaran atas informasi yang tepat.</p>
<p>Artikel ini mengulas tujuh alat sumber terbuka yang mengatasi masalah kehilangan fokus konteks dari berbagai lapisan: keluaran terminal, keluaran alat, navigasi basis kode, pembacaan berkas, tingkat detail model, pencarian kode semantik, dan memori lintas sesi. Artikel ini juga menjelaskan bagaimana ide-ide tersebut terkait dengan desain <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a>, <a href="https://zilliz.com/learn/vector-similarity-search">pencarian kesamaan vektor</a>, dan sistem pencarian seperti Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Apa yang menyebabkan hilangnya fokus konteks Claude Code?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>Kehilangan fokus konteks Claude Code biasanya berasal dari lima mode kegagalan: teks instruksi mentah yang terlalu banyak, keluaran alat yang berisik, eksplorasi basis kode yang berulang, respons model yang panjang, dan celah memori antar sesi atau agen.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>Lima penyebab hilangnya konteks Claude Code: instruksi yang berlebihan, keluaran alat yang tidak teratur, pengambilan basis kode yang berulang, respons yang panjang, dan celah memori</span>
  
 </span></p>
<table>
<thead>
<tr><th>Mode kegagalan konteks</th><th>Seperti apa tampilannya di Claude Code</th><th>Kategori alat yang membantu</th></tr>
</thead>
<tbody>
<tr><td>Log terminal berisik</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code>, dan CLI cloud menampilkan lebih banyak teks daripada yang dibutuhkan model.</td><td>Kompresi keluaran CLI</td></tr>
<tr><td>Output alat membanjiri jendela</td><td>Log pengujian, dump DOM, dan keluaran MCP masuk ke obrolan sebagai blok mentah yang sangat besar.</td><td>Sandboxing keluaran alat</td></tr>
<tr><td>Navigasi basis kode berulang</td><td>Claude mencantumkan direktori, melakukan pencarian grep, membaca berkas, dan mengulangi eksplorasi yang sama di setiap sesi.</td><td>Grafik kode atau pencarian semantik</td></tr>
<tr><td>Pembacaan berkas terlalu luas</td><td>Model membaca seluruh berkas padahal hanya membutuhkan satu simbol atau ringkasan.</td><td>Pembacaan kode secara bertahap</td></tr>
<tr><td>Claude berbicara terlalu banyak</td><td>Jawaban itu sendiri menambahkan konteks yang tidak perlu untuk giliran berikutnya.</td><td>Kompresi respons</td></tr>
<tr><td>Memori tidak bertahan</td><td>Anda harus menjelaskan kembali keputusan proyek setiap kali memulai sesi baru.</td><td>Memori berbasis Markdown</td></tr>
</tbody>
</table>
<p>Sistem manajemen konteks yang baik harus melakukan tiga hal: menyaring informasi yang tidak relevan, mengambil pengetahuan proyek yang tepat sesuai permintaan, dan mempertahankan keputusan yang bersifat permanen di seluruh sesi.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Alat konteks Claude Code mana yang sebaiknya Anda gunakan terlebih dahulu?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Mulailah dengan lapisan yang paling mengganggu alur kerja Anda. Jika output terminal Anda menjadi masalah, mulailah dengan RTK. Jika Claude terus menjelajahi repositori yang besar, mulailah dengan claude-context atau code-review-graph. Jika masalah utama Anda adalah harus menjelaskan kembali keputusan yang sama setiap hari, mulailah dengan memsearch.</p>
<table>
<thead>
<tr><th>Alat</th><th>Masalah utama yang diselesaikannya</th><th>Pilihan terbaik</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Output terminal yang berisik akibat perintah umum pengembang.</td><td>Pengembang yang menjalankan banyak perintah CLI di dalam Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Mode Konteks</a></td><td>Output mentah alat dalam jumlah besar yang masuk ke percakapan utama.</td><td>Pengguna berat Playwright, GitHub, log, atau alat MCP.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>Eksplorasi basis kode secara acak di repositori besar.</td><td>Tinjauan, analisis ketergantungan, dan pertanyaan seputar jangkauan dampak.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Penyelamat Token</a></td><td>Membaca seluruh file padahal ringkasan simbol saja sudah cukup.</td><td>File besar, pencarian simbol berulang, dan pembacaan kode secara bertahap.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Kebiasaan Claude dalam memberikan respons yang bertele-tele.</td><td>Pengguna yang menginginkan keluaran yang ringkas dan konteks masa depan yang lebih kecil.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>Menjelajahi kembali basis kode di setiap sesi.</td><td>Pencarian kode semantik melalui MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Hilangnya memori proyek antar sesi, agen, dan pergantian model.</td><td>Proyek jangka panjang dengan keputusan dan pelajaran yang bertahan lama.</td></tr>
</tbody>
</table>
<p>Lima alat pertama mengurangi apa yang masuk atau tetap ada dalam konteks. Dua alat terakhir memudahkan untuk mengingat konteks yang berguna.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK mengompresi output perintah mentah sebelum Claude melihatnya<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
<p>RTK adalah proxy CLI untuk mengurangi penggunaan token dari perintah pengembang umum. Deskripsi GitHub-nya menyebutkan bahwa alat ini mengurangi konsumsi token LLM sebesar 60-90% pada perintah pengembang umum, dan disertakan sebagai satu file biner Rust.</p>
<p>Dalam penggunaan sehari-hari Claude Code, perintah seperti ` <code translate="no">git status</code>`, ` <code translate="no">pytest</code>`, dan daftar direktori sering kali menampilkan informasi lingkungan dan deskripsi status secara lengkap ke jendela konteks. Model biasanya hanya membutuhkan jawaban yang lebih ringkas: file mana yang berubah, tes mana yang gagal, di mana PR terhenti, atau file kunci apa saja yang ada di direktori tersebut.</p>
<p>RTK berada di antara shell dan Claude. RTK dapat menulis ulang perintah melalui hook Claude Code dan mengembalikan keluaran yang telah dikompres.</p>
<p>Output mentah <code translate="no">git status</code>:</p>
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
<p>Yang sebenarnya penting:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Hal yang sama terjadi pada ` <code translate="no">pytest</code>`. Output mentahnya penuh dengan kasus yang berhasil dan gangguan lingkungan:</p>
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
<p>Setelah dikompresi, sinyalnya langsung terlihat:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK adalah titik awal termudah ketika pembengkakan konteks Anda berasal dari perintah shell, bukan dari pengambilan kode.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">Mode Konteks mengisolasi keluaran alat berukuran besar di luar obrolan utama<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Mode Konteks dirancang untuk blok mentah yang dikembalikan oleh alat: log pengujian, snapshot DOM browser, muatan GitHub, keluaran alat MCP, dan halaman yang di-scrape. Deskripsi GitHub-nya menyoroti optimasi jendela konteks untuk agen pemrograman AI dan melaporkan pengurangan keluaran alat sebesar 98%.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>Kartu repositori GitHub Mode Konteks yang menunjukkan output alat yang diisolasi dan posisi optimasi konteks</span>
  
 </span></p>
<p>Pendekatannya adalah mengisolasi hasil keluaran alat yang besar ke dalam sandbox lokal dan mengindeksnya, kemudian hanya meneruskan ringkasan dan pegangan pengambilan data ke dalam percakapan Claude.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>Alur Mode Konteks yang menunjukkan keluaran alat berukuran besar yang melewati eksekusi sandbox, indeks SQLite atau FTS, ringkasan, dan hasil pengambilan</span>
  
 </span></p>
<p>Alur ini berguna karena agen pemrograman sering kali membutuhkan node yang gagal, pemilih yang rusak, atau jejak tumpukan yang relevan, bukan seluruh DOM atau setiap baris pengujian yang lulus. Context Mode menjaga agar keluaran lengkap tetap tersedia secara lokal sambil mencegahnya mendominasi percakapan utama.</p>
<p>Hal ini mirip dengan cara sistem <a href="https://zilliz.com/blog/hybrid-search-with-milvus">pencarian hibrida</a> produksi memisahkan penyimpanan dari pengambilan data. Anda menyimpan data mentah di tempat yang tahan lama, lalu hanya mengambil bagian yang penting.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph memetakan struktur kode sebelum Claude menjelajahinya<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph mengatasi masalah yang berbeda: Claude tidak selalu membutuhkan lebih banyak teks; yang dibutuhkannya adalah peta yang lebih baik.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>Gambar logo code-review-graph yang digunakan dalam artikel asli</span>
  
 </span></p>
<p>Dalam repositori besar, pertanyaan sederhana dapat memicu eksplorasi yang memakan sumber daya:</p>
<blockquote>
<p>Setelah mengubah logika login ini, file dan pengujian mana saja yang terpengaruh?</p>
</blockquote>
<p>Tanpa grafik kode, langkah khas Claude adalah:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph membuat peta struktural basis kode terlebih dahulu. Ia menggunakan Tree-sitter untuk mengurai fungsi, kelas, impor, hubungan panggilan, pewarisan, dan ketergantungan pengujian, lalu menulis grafik tersebut ke dalam SQLite.</p>
<p>Hal ini membuatnya berguna untuk tinjauan kode dan analisis jangkauan dampak. Alih-alih meminta Claude untuk menemukan kembali grafik ketergantungan melalui pembacaan berulang, Anda membiarkannya menganalisis struktur terlebih dahulu.</p>
<p>Hal ini mirip dengan <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">pencarian semantik</a>, tetapi tidak identik. Grafik struktural menjawab “apa yang bergantung pada apa?” Sementara pencarian semantik menjawab “kode apa yang secara konseptual terkait dengan pertanyaan ini?” Dalam alur kerja asisten kode yang sebenarnya, Anda sering kali membutuhkan keduanya.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior memberikan ringkasan simbol kepada Claude sebelum mengirimkan file lengkap<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Ide inti Token Savior sederhana: jangan kirim berkas lengkap secara default. Kirim indeks atau ringkasan simbol terlebih dahulu, lalu perluas hanya saat tugas membutuhkan detail lebih lanjut.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>Kartu repositori GitHub Token Savior yang menampilkan deskripsi server MCP dan statistik proyeknya</span>
  
 </span></p>
<p>Jika Anda bertanya di mana webhook pembayaran ditangani, model sering kali tidak memerlukan setiap baris dari setiap berkas terkait. Model tersebut terlebih dahulu perlu mengetahui apakah suatu berkas atau simbol relevan.</p>
<p>Token Savior menyajikan kode secara berlapis:</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Apa yang diterima Claude</th><th>Saat diperluas</th></tr>
</thead>
<tbody>
<tr><td>Ringkasan</td><td>Indeks, nama simbol, dan deskripsi singkat.</td><td>Respons pertama default.</td></tr>
<tr><td>Potongan kode</td><td>Bagian kode yang lebih kecil di sekitar simbol yang relevan.</td><td>Ketika ringkasan kemungkinan relevan.</td></tr>
<tr><td>File lengkap</td><td>Isi berkas secara lengkap.</td><td>Hanya jika diperlukan saat mengedit atau melakukan penalaran mendalam.</td></tr>
</tbody>
</table>
<p>Hal ini mencerminkan cara pengembang sebenarnya membaca kode. Anda memindai, memastikan relevansinya, lalu membuka berkas lengkap hanya jika diperlukan. Hal ini juga menyerupai pola pengambilan progresif yang digunakan dalam <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">aplikasi RAG</a>: mengambil informasi secara luas untuk memahami konteks, lalu mempersempit konteks sebelum menghasilkan respons.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman mengurangi respons berlebihan dari Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagian besar alat konteks berfokus pada apa yang dimasukkan ke dalam model. Caveman menargetkan apa yang dihasilkan oleh Claude.</p>
<p>Caveman adalah keterampilan/plugin Claude Code yang menghilangkan pengisi, basa-basi, kalimat pembungkus, penjelasan berlebihan, dan struktur yang berulang. Tujuannya bukan untuk menghilangkan pengetahuan; melainkan untuk membuat jawaban lebih padat.</p>
<p>Tanpa Caveman:</p>
<blockquote>
<p>Alasan komponen React Anda dirender ulang kemungkinan besar karena…</p>
</blockquote>
<p>Dengan Caveman:</p>
<blockquote>
<p>Referensi objek baru setiap kali dirender. Prop objek inline = referensi baru = dirender ulang. Bungkus dengan useMemo.</p>
</blockquote>
<p>Hal ini penting karena jawaban Claude sendiri akan menjadi konteks di masa depan. Jika setiap jawaban menyertakan penjelasan panjang, giliran berikutnya akan dimulai dengan teks yang lebih banyak dari yang diperlukan. Jawaban yang lebih singkat dapat meningkatkan giliran berikutnya sama seperti meningkatkan giliran saat ini.</p>
<p>Bagi tim yang mempertimbangkan <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">rekayasa konteks untuk agen AI</a>, Caveman menjadi pengingat bahwa kebijakan keluaran merupakan bagian dari kebijakan konteks.</p>
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
    </button></h2><p>claude-context memecahkan masalah eksplorasi basis kode yang berulang dengan pencarian semantik. Alat ini mengindeks repositori, menyimpan potongan kode dalam basis data vektor, dan menyediakan fitur pencarian melalui <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>Repositori Claude Context yang ditampilkan di GitHub Trending dalam artikel aslinya</span>
  
 </span></p>
<p>Dalam basis kode yang besar, Anda terus-menerus mengajukan pertanyaan kepada Claude seperti:</p>
<blockquote>
<p>Bantu saya mencari tahu bagian kode mana yang mungkin terkait dengan bug ini.</p>
</blockquote>
<p>Tanpa lapisan pencarian, pendekatan default Claude seringkali adalah:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context memindahkan proses tersebut ke lapisan pencarian. Ia membagi repositori menjadi potongan-potongan, menghasilkan embedding, menyimpannya dalam <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">indeks kode yang didukung Milvus</a>, dan mengambil potongan kode yang relevan sebelum model mulai membaca berkas secara acak.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>Alur claude-context yang menunjukkan pembagian basis kode, embedding, basis data vektor dan pencarian hibrida, pengambilan kode yang relevan, serta injeksi konteks Claude</span>
  
 </span></p>
<p>Di sinilah alat pengkodean AI mulai terlihat seperti sistem pencarian. Anda memerlukan pembagian bagian, embedding, metadata, pencocokan leksikal, peringkat, dan kesegaran. Itulah blok bangunan yang sama di balik <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">pengambilan RAG produksi</a>, <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">perutean pengambilan hibrida</a>, dan <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">pemilihan model embedding</a>.</p>
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
    </button></h2><p>memsearch menangani sisi lain dari masalah ini: bukan apa yang harus dilupakan, melainkan bagaimana mengingat hal-hal yang penting.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>Gambar logo memsearch dari artikel asli</span>
  
 </span></p>
<p>Bayangkan Anda memberi tahu Claude pada hari Senin:</p>
<blockquote>
<p>Webhook kami tidak dapat mencoba kembali jika terjadi kegagalan — peristiwa yang gagal harus dimasukkan ke dalam antrian surat mati.</p>
</blockquote>
<p>Pada hari Rabu, Anda membuka sesi baru dan bertanya:</p>
<blockquote>
<p>Apa lagi yang bisa kita optimalkan di lapisan webhook?</p>
</blockquote>
<p>Tanpa memori yang tahan lama, Claude menganggap keputusan hari Senin seolah-olah tidak pernah terjadi. Anda menjelaskannya lagi.</p>
<p>memsearch menyimpan memori sebagai berkas Markdown lokal yang dapat dibaca manusia dan menggunakan Milvus sebagai indeks pencarian yang dapat dibangun ulang. Desain ini memungkinkan memori tetap dapat diedit oleh manusia sekaligus tetap dapat dicari oleh agen.</p>
<p>Pada saat pengambilan, memsearch menggunakan pengambilan progresif: cari terlebih dahulu, perluas jika diperlukan, lalu telusuri ke transkrip asli hanya jika diperlukan.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>Alur pengambilan progresif memsearch yang menunjukkan pencarian, perluasan, transkrip, dan ringkasan yang kembali ke percakapan utama</span>
  
 </span></p>
<p>Pola "Markdown-first" ini berguna bagi tim yang bekerja melintasi sesi, model, dan agen. Pola ini juga secara alami berpasangan dengan <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">memori agen AI jangka panjang</a>, <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">memori multi-agen yang dibagikan</a>, serta masalah yang lebih luas dalam mencegah <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">degradasi konteks pada sistem agen</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">Bagaimana alat-alat ini bekerja sama?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketujuh alat ini saling melengkapi, bukan saling menggantikan. Gunakanlah sebagai lapisan-lapisan.</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Gunakan alat-alat ini</th><th>Mengapa</th></tr>
</thead>
<tbody>
<tr><td>Menghilangkan gangguan pada perintah</td><td>RTK</td><td>Kompres keluaran terminal bervolume tinggi sebelum mencapai Claude.</td></tr>
<tr><td>Kotak pasir untuk keluaran alat mentah</td><td>Mode Konteks</td><td>Simpan log besar, DOM, dan muatan alat di luar percakapan utama.</td></tr>
<tr><td>Pemetaan struktur kode</td><td>grafik-peninjauan-kode</td><td>Jawab pertanyaan tentang ketergantungan dan jangkauan dampak tanpa perlu membaca berkas secara buta.</td></tr>
<tr><td>Baca kode secara bertahap</td><td>Token Savior</td><td>Mulailah dengan ringkasan simbol, lalu perluas hanya jika diperlukan.</td></tr>
<tr><td>Kompres jawaban Claude</td><td>Caveman</td><td>Cegah agar keluaran model itu sendiri tidak membebani konteks di masa depan.</td></tr>
<tr><td>Ambil kode yang relevan</td><td>claude-context</td><td>Gunakan pencarian kode semantik dan hibrida sebagai ganti loop grep yang berulang.</td></tr>
<tr><td>Gunakan kembali keputusan yang tahan lama</td><td>memsearch</td><td>Panggil kembali riwayat proyek di seluruh sesi, agen, dan pergantian model.</td></tr>
</tbody>
</table>
<p>Urutan penerapan yang praktis adalah:</p>
<ol>
<li><strong>Singkirkan gangguan yang jelas terlebih dahulu.</strong> Tambahkan RTK atau Mode Konteks jika output shell dan muatan alat mendominasi konteks Anda.</li>
<li><strong>Perbaiki navigasi repositori.</strong> Tambahkan code-review-graph untuk struktur atau claude-context untuk pengambilan kode secara semantik.</li>
<li><strong>Kendalikan apa yang tersisa.</strong> Gunakan Token Savior dan Caveman untuk menjaga agar pembacaan file dan respons model tetap ringkas.</li>
<li><strong>Pertahankan pengetahuan yang tahan lama.</strong> Gunakan memsearch ketika penjelasan berulang menjadi hambatan.</li>
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
<li>Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Milvus Discord</a> untuk mengajukan pertanyaan dan membandingkan pola pengelolaan konteks dengan pengembang lain.</li>
<li><a href="https://milvus.io/office-hours">Daftarkan diri Anda untuk sesi Milvus Office Hours gratis</a> jika Anda membutuhkan bantuan dalam merancang lapisan pencarian untuk kode, memori, atau beban kerja RAG.</li>
<li>Jika Anda lebih memilih untuk melewati pengaturan infrastruktur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus yang dikelola) menawarkan paket gratis untuk memulai.</li>
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
<p>Mulailah dengan mengompres input yang paling berisik: output terminal, muatan alat mentah, dan pembacaan kode yang berulang. Kemudian tambahkan alat pengambilan seperti claude-context atau code-review-graph sehingga Claude dapat mengambil kode yang relevan alih-alih menjelajahi repositori dari awal.</p>
<p><strong>Apakah sebaiknya menggunakan claude-context atau code-review-graph untuk repositori besar?</strong></p>
<p>Gunakan claude-context saat Anda memerlukan pencarian kode semantik, terutama saat Anda tidak mengetahui nama file atau simbol yang tepat. Gunakan code-review-graph saat Anda memerlukan jawaban struktural seperti hubungan panggilan, impor, ketergantungan pengujian, dan jangkauan tinjauan.</p>
<p><strong>Apakah "memory" berbeda dari "code retrieval" di Claude Code?</strong></p>
<p>Ya. Pencarian kode menemukan file atau simbol proyek yang relevan. Pencarian memori mengingat keputusan yang bertahan lama, preferensi pengguna, riwayat debugging, dan pelajaran lintas sesi. memsearch berfokus pada memori; claude-context berfokus pada pencarian kode.</p>
<p><strong>Apakah alat-alat ini menggantikan penyimpanan sementara prompt atau jendela konteks yang lebih besar?</strong></p>
<p>Tidak. Penyimpanan prompt dan jendela konteks yang luas membantu dalam hal kapasitas dan biaya, tetapi tidak menentukan informasi mana yang layak mendapat perhatian. Alat manajemen konteks meningkatkan kualitas dan kepadatan informasi yang masuk ke model sejak awal. <span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
