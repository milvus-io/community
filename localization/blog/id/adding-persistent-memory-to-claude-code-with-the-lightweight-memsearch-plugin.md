---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: >-
  Menambahkan Memori Persisten ke Kode Claude dengan Plugin memsearch yang
  Ringan
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  Berikan memori jangka panjang pada Claude Code dengan memsearch ccplugin.
  Penyimpanan Markdown yang ringan dan transparan, pengambilan semantik
  otomatis, tanpa overhead token.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>Kami baru-baru ini membangun dan membuat <a href="https://github.com/zilliztech/memsearch">memsearch</a> yang bersumber terbuka, sebuah pustaka memori jangka panjang yang mandiri, plug-and-play yang memberikan memori yang persisten, transparan, dan dapat diedit oleh manusia. Memsearch menggunakan arsitektur memori dasar yang sama dengan OpenClaw-hanya saja tanpa tumpukan OpenClaw lainnya. Itu berarti Anda dapat memasukkannya ke dalam kerangka kerja agen apa pun (Claude, GPT, Llama, agen khusus, mesin alur kerja) dan secara instan menambahkan memori yang tahan lama dan dapat dipanggil kembali. <em>(Jika Anda ingin mendalami cara kerja memsearch, kami menulis</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>postingan terpisah di sini</em></a><em>).</em></p>
<p>Di sebagian besar alur kerja agen, memsearch bekerja persis seperti yang dimaksudkan. Tetapi <strong>pengkodean agen</strong> adalah cerita yang berbeda. Sesi pengkodean berjalan lama, pergantian konteks konstan, dan informasi yang perlu disimpan terakumulasi selama berhari-hari atau berminggu-minggu. Volume dan volatilitas yang besar itu memperlihatkan kelemahan dalam sistem memori agen pada umumnya - termasuk di dalamnya adalah pencarian. Dalam skenario pengkodean, pola pengambilan cukup berbeda sehingga kami tidak dapat menggunakan kembali alat yang sudah ada sebagaimana adanya.</p>
<p>Untuk mengatasi hal ini, kami membuat <strong>plugin memori persisten yang dirancang khusus untuk Claude Code</strong>. <strong>Plugin</strong> ini berada di atas CLI memsearch, dan kami menyebutnya <strong>memsearch ccplugin</strong>.</p>
<ul>
<li>GitHub Repo: <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(sumber terbuka, lisensi MIT)</em></li>
</ul>
<p>Dengan <strong>memsearch ccplugin</strong> yang ringan yang mengelola memori di belakang layar, Claude Code mendapatkan kemampuan untuk mengingat setiap percakapan, setiap keputusan, setiap preferensi gaya, dan setiap utas beberapa hari-secara otomatis diindeks, dapat dicari sepenuhnya, dan tetap ada di seluruh sesi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Untuk kejelasan di seluruh tulisan ini: "ccplugin" mengacu pada lapisan atas, atau plugin Claude Code itu sendiri. "memsearch" mengacu pada lapisan bawah, alat CLI mandiri di bawahnya.</em></p>
<p>Jadi, mengapa coding membutuhkan plugin sendiri, dan mengapa kami membangun sesuatu yang sangat ringan? Ini bermuara pada dua masalah yang hampir pasti pernah Anda alami: Kurangnya memori yang dimiliki Claude Code, dan kikuk serta kompleksitas solusi yang ada seperti claude-mem.</p>
<p>Jadi, mengapa harus membuat plugin khusus? Karena agen pengkodean mengalami dua masalah yang hampir pasti Anda alami sendiri:</p>
<ul>
<li><p>Claude Code tidak memiliki memori yang persisten.</p></li>
<li><p>Banyak solusi komunitas yang ada-seperti <em>claude-mem-yang</em>kuat tetapi berat, kikuk, atau terlalu rumit untuk pekerjaan pengkodean sehari-hari.</p></li>
</ul>
<p>ccplugin bertujuan untuk menyelesaikan kedua masalah tersebut dengan lapisan yang minimal, transparan, dan ramah pengembang di atas memsearch.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">Masalah Memori Claude Code: Melupakan Segalanya Ketika Sesi Berakhir<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita mulai dengan skenario yang pasti pernah dialami oleh para pengguna Claude Code.</p>
<p>Anda membuka Claude Code di pagi hari. "Lanjutkan auth refactor kemarin," Anda mengetik. Claude membalas: "Saya tidak yakin apa yang Anda kerjakan kemarin." Jadi, Anda menghabiskan sepuluh menit berikutnya untuk menyalin-tempel log kemarin. Ini bukan masalah besar, tetapi cepat menjengkelkan karena sering muncul.</p>
<p>Meskipun Claude Code memiliki mekanisme memori sendiri, mekanisme ini masih jauh dari memuaskan. File <code translate="no">CLAUDE.md</code> dapat menyimpan arahan dan preferensi proyek, tetapi bekerja lebih baik untuk aturan statis dan perintah pendek, bukan untuk mengumpulkan pengetahuan jangka panjang.</p>
<p>Claude Code memang menawarkan perintah <code translate="no">resume</code> dan <code translate="no">fork</code>, tetapi keduanya jauh dari kata ramah pengguna. Untuk perintah fork, Anda perlu mengingat ID sesi, mengetik perintah secara manual, dan mengelola pohon riwayat percakapan yang bercabang. Ketika Anda menjalankan <code translate="no">/resume</code>, Anda akan mendapatkan sebuah dinding yang berisi judul-judul sesi. Jika Anda hanya mengingat beberapa detail tentang apa yang Anda lakukan dan sudah lebih dari beberapa hari yang lalu, semoga berhasil menemukan yang tepat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk akumulasi pengetahuan jangka panjang lintas proyek, seluruh pendekatan ini tidak mungkin dilakukan.</p>
<p>Untuk mewujudkan ide tersebut, claude-mem menggunakan sistem memori tiga tingkat. Tingkat pertama mencari ringkasan tingkat tinggi. Tingkat kedua menggali garis waktu untuk mendapatkan informasi yang lebih detail. Tingkat ketiga melakukan pengamatan penuh untuk percakapan mentah. Selain itu, ada label privasi, pelacakan biaya, dan antarmuka visualisasi web.</p>
<p>Inilah cara kerjanya di balik layar:</p>
<ul>
<li><p><strong>Lapisan runtime.</strong> Layanan Node.js Worker berjalan pada port 37777. Metadata sesi berada dalam basis data SQLite yang ringan. Basis data vektor menangani pengambilan semantik yang tepat melalui konten memori.</p></li>
<li><p><strong>Lapisan interaksi.</strong> UI web berbasis React memungkinkan Anda melihat memori yang diambil secara real time: rangkuman, garis waktu, dan catatan mentah.</p></li>
<li><p><strong>Lapisan antarmuka.</strong> Sebuah server MCP (Model Context Protocol) mengekspos antarmuka alat yang terstandarisasi. Claude dapat menghubungi <code translate="no">search</code> (menanyakan ringkasan tingkat tinggi), <code translate="no">timeline</code> (melihat garis waktu yang terperinci), dan <code translate="no">get_observations</code> (mengambil catatan interaksi mentah) untuk mengambil dan menggunakan memori secara langsung.</p></li>
</ul>
<p>Sejujurnya, ini adalah produk solid yang memecahkan masalah memori Claude Code. Tetapi produk ini kikuk dan rumit dalam hal penggunaan sehari-hari.</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Teknologi</th></tr>
</thead>
<tbody>
<tr><td>Bahasa</td><td>TypeScript (ES2022, modul ESNext)</td></tr>
<tr><td>Runtime</td><td>Node.js 18+</td></tr>
<tr><td>Basis data</td><td>SQLite 3 dengan driver bun:sqlite</td></tr>
<tr><td>Penyimpanan Vektor</td><td>ChromaDB (opsional, untuk pencarian semantik)</td></tr>
<tr><td>Server HTTP</td><td>Express.js 4.18</td></tr>
<tr><td>Waktu nyata</td><td>Peristiwa yang Dikirim Server (SSE)</td></tr>
<tr><td>Kerangka Kerja UI</td><td>React + TypeScript</td></tr>
<tr><td>AI SDK</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>Alat Bantu Pembangunan</td><td>esbuild (bundel TypeScript)</td></tr>
<tr><td>Manajer Proses</td><td>Roti</td></tr>
<tr><td>Pengujian</td><td>Pelari uji coba bawaan Node.js</td></tr>
</tbody>
</table>
<p><strong>Sebagai permulaan, penyiapannya cukup berat.</strong> Menjalankan claude-mem berarti menginstal Node.js, Bun, dan runtime MCP, lalu menyiapkan layanan Worker, server Express, React UI, SQLite, dan sebuah penyimpanan vektor di atasnya. Itu adalah banyak sekali komponen yang bergerak untuk diterapkan, dipelihara, dan di-debug ketika ada yang rusak.</p>
<p><strong>Semua komponen tersebut juga membakar token yang tidak Anda minta untuk dibelanjakan.</strong> Definisi alat MCP dimuat secara permanen ke dalam jendela konteks Claude, dan setiap pemanggilan alat memakan token pada permintaan dan respons. Dalam sesi yang panjang, biaya overhead itu bertambah dengan cepat dan dapat mendorong biaya token di luar kendali.</p>
<p><strong>Pemanggilan memori tidak dapat diandalkan karena sepenuhnya bergantung pada pilihan Claude untuk mencari.</strong> Claude harus memutuskan sendiri untuk memanggil alat seperti <code translate="no">search</code> untuk memicu pengambilan. Jika ia tidak menyadari bahwa ia membutuhkan memori, konten yang relevan tidak akan pernah muncul. Dan masing-masing dari tiga tingkatan memori membutuhkan pemanggilan alat eksplisitnya sendiri, jadi tidak ada jalan keluar jika Claude tidak berpikir untuk mencarinya.</p>
<p><strong>Terakhir, penyimpanan data tidak jelas, yang membuat debugging dan migrasi menjadi tidak menyenangkan.</strong> Memori dibagi menjadi SQLite untuk metadata sesi dan Chroma untuk data vektor biner, tanpa format terbuka yang menyatukannya. Migrasi berarti menulis skrip ekspor. Melihat apa yang sebenarnya diingat oleh AI berarti membuka UI Web atau antarmuka kueri khusus. Tidak ada cara untuk hanya melihat data mentah.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">Mengapa Plugin memsearch untuk Claude Code Lebih Baik?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami menginginkan lapisan memori yang benar-benar ringan-tidak ada layanan tambahan, tidak ada arsitektur yang rumit, tidak ada biaya operasional. Itulah yang memotivasi kami untuk membangun <strong>memsearch ccplugin</strong>. Pada intinya, ini adalah sebuah eksperimen: <em>bisakah sistem memori yang berfokus pada pengkodean menjadi lebih sederhana secara radikal?</em></p>
<p>Ya, dan kami membuktikannya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Keseluruhan ccplugin adalah empat pengait shell ditambah proses pengawasan latar belakang. Tidak ada Node.js, tidak ada server MCP, tidak ada UI Web. Ini hanya skrip shell yang memanggil CLI memsearch, yang menurunkan bilah penyiapan dan pemeliharaan secara dramatis.</p>
<p>CCplugin bisa setipis ini karena batasan tanggung jawab yang ketat. Ia tidak menangani penyimpanan memori, pengambilan vektor, atau penyematan teks. Semua itu didelegasikan ke CLI memsearch di bawahnya. ccplugin memiliki satu tugas: menjembatani peristiwa siklus hidup Claude Code (sesi mulai, pengiriman prompt, penghentian respons, akhir sesi) ke fungsi CLI memsearch yang sesuai.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Desain terpisah ini membuat sistem menjadi fleksibel di luar Claude Code. CLI memsearch bekerja secara independen dengan IDE lain, kerangka kerja agen lain, atau bahkan pemanggilan manual biasa. CLI ini tidak terkunci pada satu kasus penggunaan.</p>
<p>Dalam praktiknya, desain ini memberikan tiga keuntungan utama.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. Semua Memori Tinggal di File Markdown Biasa</h3><p>Setiap memori yang dibuat oleh ccplugin berada di <code translate="no">.memsearch/memory/</code> sebagai file Markdown.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>Ini adalah satu file per hari. Setiap file berisi ringkasan sesi hari itu dalam teks biasa, yang dapat dibaca oleh manusia. Berikut ini adalah tangkapan layar dari file memori harian dari proyek memsearch itu sendiri:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anda bisa langsung melihat formatnya: stempel waktu, ID sesi, ID giliran, dan ringkasan sesi. Tidak ada yang disembunyikan.</p>
<p>Ingin tahu apa yang diingat oleh AI? Buka file Markdown. Ingin mengedit memori? Gunakan editor teks Anda. Ingin memigrasi data Anda? Salin folder <code translate="no">.memsearch/memory/</code>.</p>
<p>Indeks vektor <a href="https://milvus.io/">Milvus</a> adalah cache untuk mempercepat pencarian semantik. Cache ini dapat dibangun ulang dari Markdown kapan saja. Tidak ada basis data buram, tidak ada kotak hitam biner. Semua data dapat dilacak dan sepenuhnya dapat direkonstruksi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. Injeksi Konteks Otomatis Tidak Membutuhkan Token Tambahan</h3><p>Penyimpanan transparan adalah dasar dari sistem ini. Hasil yang sebenarnya berasal dari bagaimana memori ini digunakan, dan dalam ccplugin, pemanggilan memori sepenuhnya otomatis.</p>
<p>Setiap kali sebuah perintah dikirimkan, <code translate="no">UserPromptSubmit</code> melakukan pencarian semantik dan menyuntikkan 3 memori yang relevan ke dalam konteks. Claude tidak memutuskan apakah akan mencari. Ia hanya mendapatkan konteksnya.</p>
<p>Selama proses ini, Claude tidak pernah melihat definisi alat MCP, jadi tidak ada tambahan yang memenuhi jendela konteks. Hook berjalan pada lapisan CLI dan menginjeksikan hasil pencarian teks biasa. Tidak ada overhead IPC, tidak ada biaya token pemanggilan alat. Jendela konteks yang membengkak yang datang dengan definisi alat MCP telah hilang sama sekali.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk kasus-kasus di mana top-3 otomatis tidak cukup, kami juga membangun tiga tingkatan pengambilan progresif. Ketiganya adalah perintah CLI, bukan alat MCP.</p>
<ul>
<li><p><strong>L1 (otomatis):</strong> Setiap perintah mengembalikan 3 hasil pencarian semantik teratas dengan pratinjau <code translate="no">chunk_hash</code> dan 200 karakter. Ini mencakup sebagian besar penggunaan sehari-hari.</p></li>
<li><p><strong>L2 (sesuai permintaan):</strong> Ketika konteks lengkap diperlukan, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> mengembalikan bagian Markdown lengkap ditambah metadata.</p></li>
<li><p><strong>L3 (mendalam):</strong> Ketika percakapan asli diperlukan, <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> menarik catatan JSONL mentah dari Claude Code.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. Ringkasan Sesi Dihasilkan di Latar Belakang dengan Biaya Hampir Nol</h3><p>Pengambilan mencakup bagaimana memori digunakan. Tetapi memori harus ditulis terlebih dahulu. Bagaimana semua file Markdown itu dibuat?</p>
<p>ccplugin membuatnya melalui pipa latar belakang yang berjalan secara asinkron dan hampir tidak memerlukan biaya. Setiap kali Anda menghentikan respons Claude, hook <code translate="no">Stop</code> dijalankan: hook ini mem-parsing transkrip percakapan, memanggil Claude Haiku (<code translate="no">claude -p --model haiku</code>) untuk membuat ringkasan, dan menambahkannya ke file Markdown hari ini. Panggilan API Haiku sangat murah, hampir dapat diabaikan per pemanggilan.</p>
<p>Dari sana, proses pengawasan mendeteksi perubahan file dan secara otomatis mengindeks konten baru ke dalam Milvus sehingga dapat segera diambil. Seluruh alur berjalan di latar belakang tanpa mengganggu pekerjaan Anda, dan biaya tetap terkendali.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Memulai plugin memsearch secara cepat dengan Claude Code<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">Pertama, instal dari pasar plugin Claude Code:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">Kedua, mulai ulang Claude Code.</h3><p>Plugin akan menginisialisasi konfigurasinya secara otomatis.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">Ketiga, setelah percakapan, periksa file memori hari itu:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">Keempat, selamat menikmati.</h3><p>Saat Claude Code dijalankan kembali, sistem akan secara otomatis mengambil dan menyuntikkan memori yang relevan. Tidak ada langkah tambahan yang diperlukan.</p>
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
    </button></h2><p>Mari kita kembali ke pertanyaan awal: bagaimana Anda memberikan memori persisten kepada AI? claude-mem dan memsearch ccplugin mengambil pendekatan yang berbeda, masing-masing dengan kekuatan yang berbeda. Kami menyimpulkan panduan singkat untuk memilih di antara keduanya:</p>
<table>
<thead>
<tr><th>Kategori</th><th>memsearch</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>Arsitektur</td><td>4 kait shell + 1 proses pengawasan</td><td>Node.js Worker + Express + React UI</td></tr>
<tr><td>Metode Integrasi</td><td>Pengait asli + CLI</td><td>Server MCP (stdio)</td></tr>
<tr><td>Pemanggilan</td><td>Otomatis (injeksi hook)</td><td>Digerakkan oleh agen (membutuhkan pemanggilan alat)</td></tr>
<tr><td>Konsumsi Konteks</td><td>Nol (hanya menyuntikkan teks hasil)</td><td>Definisi alat MCP tetap ada</td></tr>
<tr><td>Ringkasan Sesi</td><td>Satu panggilan CLI Haiku asinkron</td><td>Beberapa panggilan API + kompresi observasi</td></tr>
<tr><td>Format Penyimpanan</td><td>File penurunan harga biasa</td><td>Penyematan SQLite + Chroma</td></tr>
<tr><td>Migrasi Data</td><td>File Penurunan Harga Biasa</td><td>Penyematan SQLite + Chroma</td></tr>
<tr><td>Metode Migrasi</td><td>Menyalin file .md</td><td>Mengekspor dari basis data</td></tr>
<tr><td>Runtime</td><td>Python + CLI Claude</td><td>Node.js + Bun + waktu proses MCP</td></tr>
</tbody>
</table>
<p>claude-mem menawarkan fitur yang lebih kaya, UI yang dipoles, dan kontrol yang lebih halus. Untuk tim yang membutuhkan kolaborasi, visualisasi web, atau manajemen memori yang mendetail, ini adalah pilihan yang tepat.</p>
<p>memsearch ccplugin menawarkan desain minimal, tanpa jendela konteks, dan penyimpanan yang sepenuhnya transparan. Bagi para insinyur yang menginginkan lapisan memori ringan tanpa kerumitan tambahan, ini adalah pilihan yang lebih cocok. Mana yang lebih baik tergantung pada apa yang Anda butuhkan.</p>
<p>Ingin mempelajari lebih dalam atau mendapatkan bantuan untuk membangun dengan memsearch atau Milvus?</p>
<ul>
<li><p>Bergabunglah dengan <a href="https://milvus.io/slack">komunitas Milvus Slack</a> untuk terhubung dengan pengembang lain dan berbagi apa yang Anda buat.</p></li>
<li><p>Pesan <a href="https://milvus.io/office-hours">Jam Kerja Milvus</a>kami untuk tanya jawab langsung dan dukungan langsung dari tim.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">Sumber Daya<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>dokumentasi memsearch ccplugin:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>proyek memsearch:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Kami Mengekstrak Sistem Memori OpenClaw dan Membuatnya Bersumber Terbuka (memsearch)</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Apa itu OpenClaw? Panduan Lengkap untuk Agen AI Sumber Terbuka -</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial OpenClaw: Menghubungkan ke Slack untuk Asisten AI Lokal</a></p></li>
</ul>
