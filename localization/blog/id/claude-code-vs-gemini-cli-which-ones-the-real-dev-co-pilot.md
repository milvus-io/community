---
id: claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
title: 'Claude Code vs Gemini CLI: Siapa yang merupakan Co-Pilot Dev yang sebenarnya?'
author: Min Yin
date: 2025-07-09T00:00:00.000Z
desc: >-
  Bandingkan Gemini CLI dan Claude Code, dua alat pengkodean AI yang mengubah
  alur kerja terminal. Manakah yang harus mendukung proyek Anda berikutnya?
cover: assets.zilliz.com/Claude_Code_vs_Gemini_CLI_e3a04a49cf.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, Gemini, Claude'
meta_keywords: >-
  Claude Code, Gemini CLI, Natural Language Coding, Vibe Coding, AI Coding
  Assistants
meta_title: |
  Claude Code vs Gemini CLI: Who’s the Real Dev Co-Pilot?
origin: >-
  https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
---
<p>IDE Anda membengkak. Asisten pengkodean Anda sudah ketinggalan zaman. Dan Anda masih terjebak mengklik kanan untuk refactor? Selamat datang di kebangkitan CLI.</p>
<p>Asisten kode AI berevolusi dari gimmick menjadi alat bantu dan para pengembang mulai berpihak. Di luar sensasi startup Cursor, <a href="https://www.anthropic.com/claude-code"><strong>Claude Code</strong></a> <strong>dari Anthropic</strong> menghadirkan ketepatan dan kesempurnaan. <a href="https://github.com/google-gemini/gemini-cli"><strong>Gemini CLI</strong></a> milik Google? Cepat, gratis, dan haus akan konteks. Keduanya menjanjikan untuk menjadikan bahasa alami sebagai skrip shell yang baru. Jadi, mana yang harus <em>Anda</em> percayai untuk melakukan refactor pada repo Anda berikutnya?</p>
<p>Dari apa yang saya lihat, Claude Code memiliki keunggulan awal. Tetapi permainan berubah dengan cepat. Setelah Gemini CLI diluncurkan, para pengembang berbondong-bondong menggunakannya-mengumpulkan<strong>15,1 ribu bintang GitHub dalam waktu 24 jam</strong>. Saat ini, jumlah bintangnya telah melampaui <strong>55.000</strong> dan terus bertambah. Luar biasa!</p>
<p>Inilah kesimpulan singkat saya tentang mengapa begitu banyak pengembang yang tertarik dengan Gemini CLI:</p>
<ul>
<li><p><strong>Ini adalah sumber terbuka di bawah Apache 2.0 dan sepenuhnya gratis:</strong> Gemini CLI terhubung ke model Gemini 2.0 Flash tingkat atas Google tanpa biaya. Cukup masuk dengan akun Google pribadi Anda untuk mengakses Gemini Code Assist. Selama periode pratinjau, Anda bisa mendapatkan hingga 60 permintaan per menit dan 1.000 permintaan harian-semuanya gratis.</p></li>
<li><p><strong>Ini adalah pembangkit tenaga listrik multi-tugas yang sesungguhnya:</strong> Di luar pemrograman (keahlian terkuatnya), ia menangani manajemen file, pembuatan konten, kontrol skrip, dan bahkan kemampuan Deep Research.</p></li>
<li><p><strong>Ringan:</strong> Anda dapat menyematkannya dengan mulus dalam skrip terminal atau menggunakannya sebagai agen mandiri.</p></li>
<li><p><strong>Menawarkan panjang konteks yang panjang:</strong> Dengan 1 juta token konteks (sekitar 750.000 kata), ia dapat menelan seluruh basis kode untuk proyek-proyek yang lebih kecil dalam sekali jalan.</p></li>
</ul>
<h2 id="Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="common-anchor-header">Mengapa Pengembang Meninggalkan IDE untuk Terminal Bertenaga AI<button data-href="#Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengapa ada antusiasme yang besar terhadap alat bantu berbasis terminal ini? Sebagai pengembang, Anda mungkin pernah merasakan hal ini: IDE tradisional mengemas fitur-fitur yang mengesankan, tetapi mereka hadir dengan kerumitan alur kerja yang membunuh momentum. Ingin merefaktor sebuah fungsi tunggal? Anda perlu memilih kode, klik kanan untuk menu konteks, menavigasi ke "Refactor," memilih jenis refactoring tertentu, mengonfigurasi opsi dalam kotak dialog, dan akhirnya menerapkan perubahan.</p>
<p><strong>Alat bantu Terminal AI telah mengubah alur kerja ini dengan menyederhanakan semua operasi menjadi perintah bahasa alami.</strong> Alih-alih menghafal sintaks perintah, Anda cukup mengatakan: &quot;<em>Bantu saya memfaktorkan ulang fungsi ini untuk meningkatkan keterbacaan</em>,&quot; dan lihatlah bagaimana alat ini menangani seluruh proses.</p>
<p>Ini bukan hanya kenyamanan-ini adalah perubahan mendasar dalam cara kita berpikir. Operasi teknis yang kompleks menjadi percakapan bahasa alami, membebaskan kita untuk fokus pada logika bisnis daripada mekanisme alat.</p>
<h2 id="Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="common-anchor-header">Claude Code atau Gemini CLI? Pilih Co-Pilot Anda dengan Bijak<button data-href="#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="anchor-icon" translate="no">
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
    </button></h2><p>Karena Claude Code juga cukup populer dan mudah digunakan serta sebelumnya telah mendominasi adopsi, bagaimana perbandingannya dengan Gemini CLI yang baru? Bagaimana kita harus memilih di antara keduanya? Mari kita lihat lebih dekat alat pengkodean AI ini.</p>
<h3 id="1-Cost-Free-vs-Paid" class="common-anchor-header"><strong>1. Biaya: Gratis vs Berbayar</strong></h3><ul>
<li><p><strong>Gemini CLI</strong> sepenuhnya gratis dengan akun Google apa pun, menyediakan 1.000 permintaan per hari dan 60 permintaan per menit, tanpa perlu pengaturan penagihan.</p></li>
<li><p><strong>Claude Code</strong> membutuhkan langganan Anthropic aktif dan mengikuti model bayar per penggunaan, tetapi mencakup keamanan dan dukungan tingkat perusahaan yang berharga untuk proyek komersial.</p></li>
</ul>
<h3 id="2-Context-Window-How-Much-Code-Can-It-See" class="common-anchor-header"><strong>2. Jendela Konteks: Berapa Banyak Kode yang Dapat Dilihat?</strong></h3><ul>
<li><p><strong>Gemini CLI:</strong> 1 juta token (sekitar 750.000 kata)</p></li>
<li><p><strong>Kode Claude:</strong> Sekitar 200.000 token (sekitar 150.000 kata)</p></li>
</ul>
<p>Jendela konteks yang lebih besar memungkinkan model untuk mereferensikan lebih banyak konten input ketika menghasilkan respons. Jendela konteks ini juga membantu menjaga koherensi percakapan dalam dialog multi-belokan, sehingga model dapat mengingat seluruh percakapan Anda dengan lebih baik.</p>
<p>Pada dasarnya, Gemini CLI dapat menganalisis seluruh proyek kecil hingga menengah Anda dalam satu sesi, sehingga ideal untuk memahami basis kode besar dan hubungan lintas file. Claude Code bekerja lebih baik ketika Anda berfokus pada file atau fungsi tertentu.</p>
<h3 id="3-Code-Quality-vs-Speed" class="common-anchor-header"><strong>3. Kualitas Kode vs Kecepatan</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Fitur</strong></td><td><strong>Gemini CLI</strong></td><td><strong>Claude Code</strong></td><td><strong>Catatan</strong></td></tr>
<tr><td><strong>Kecepatan pengkodean</strong></td><td>8.5/10</td><td>7.2/10</td><td>Gemini menghasilkan kode lebih cepat</td></tr>
<tr><td><strong>Kualitas pengkodean</strong></td><td>7.8/10</td><td>9.1/10</td><td>Claude menghasilkan kode berkualitas lebih tinggi</td></tr>
<tr><td><strong>Penanganan kesalahan</strong></td><td>7.5/10</td><td>8.8/10</td><td>Claude lebih baik dalam penanganan kesalahan</td></tr>
<tr><td><strong>Pemahaman konteks</strong></td><td>9.2/10</td><td>7.9/10</td><td>Gemini memiliki memori yang lebih panjang</td></tr>
<tr><td><strong>Dukungan multibahasa</strong></td><td>8.9/10</td><td>8.5/10</td><td>Keduanya sangat baik</td></tr>
</tbody>
</table>
<ul>
<li><p><strong>Gemini CLI</strong> menghasilkan kode lebih cepat dan unggul dalam memahami konteks yang besar, sehingga sangat bagus untuk pembuatan prototipe yang cepat.</p></li>
<li><p><strong>Claude Code</strong> memiliki presisi dan penanganan kesalahan yang baik, sehingga lebih cocok untuk lingkungan produksi di mana kualitas kode sangat penting.</p></li>
</ul>
<h3 id="4-Platform-Support-Where-Can-You-Run-It" class="common-anchor-header"><strong>4. Dukungan Platform: Di Mana Anda Dapat Menjalankannya?</strong></h3><ul>
<li><p><strong>Gemini CLI</strong> bekerja sama baiknya di Windows, macOS, dan Linux sejak hari pertama.</p></li>
<li><p><strong>Claude Code</strong> dioptimalkan untuk macOS terlebih dahulu, dan meskipun dapat dijalankan di platform lain, pengalaman terbaiknya tetap ada di Mac.</p></li>
</ul>
<h3 id="5-Authentication-and-Access" class="common-anchor-header"><strong>5. Otentikasi dan Akses</strong></h3><p><strong>Claude Code</strong> membutuhkan langganan Anthropic aktif (Pro, Max, Team, atau Enterprise) atau akses API melalui AWS Bedrock/Vertex AI. Ini berarti Anda perlu mengatur penagihan sebelum Anda dapat mulai menggunakannya.</p>
<p><strong>Gemini CLI</strong> menawarkan paket gratis yang murah hati untuk para pemegang akun Google perorangan, termasuk 1.000 permintaan gratis per hari dan 60 permintaan per menit untuk model Gemini 2.0 Flash dengan fitur lengkap. Pengguna yang membutuhkan batas yang lebih tinggi atau model tertentu dapat meningkatkan melalui kunci API.</p>
<h3 id="6-Feature-Comparison-Overview" class="common-anchor-header"><strong>6. Ikhtisar Perbandingan Fitur</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Fitur</strong></td><td><strong>Kode Claude</strong></td><td><strong>Gemini CLI</strong></td></tr>
<tr><td>Panjang Jendela Konteks</td><td>200 ribu token</td><td>1 juta token</td></tr>
<tr><td>Dukungan Multimodal</td><td>Terbatas</td><td>Kuat (gambar, PDF, dll.)</td></tr>
<tr><td>Pemahaman Kode</td><td>Sangat baik</td><td>Sangat baik</td></tr>
<tr><td>Integrasi Alat</td><td>Dasar</td><td>Kaya (Server MCP)</td></tr>
<tr><td>Keamanan</td><td>Tingkat perusahaan</td><td>Standar</td></tr>
<tr><td>Permintaan Gratis</td><td>Terbatas</td><td>60/menit, 1000/hari</td></tr>
</tbody>
</table>
<h2 id="When-to-Choose-Claude-Code-vs-Gemini-CLI" class="common-anchor-header">Kapan Memilih Claude Code vs Gemini CLI?<button data-href="#When-to-Choose-Claude-Code-vs-Gemini-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah kita membandingkan fitur-fitur utama dari kedua alat ini, berikut adalah kesimpulan saya tentang kapan harus memilih masing-masing:</p>
<p><strong>Pilih Gemini CLI jika:</strong></p>
<ul>
<li><p>Efektivitas biaya dan eksperimen yang cepat adalah prioritas</p></li>
<li><p>Anda sedang mengerjakan proyek besar yang membutuhkan jendela konteks yang sangat besar</p></li>
<li><p>Anda menyukai alat bantu sumber terbuka yang mutakhir</p></li>
<li><p>Kompatibilitas lintas platform sangat penting</p></li>
<li><p>Anda menginginkan kemampuan multimodal yang kuat</p></li>
</ul>
<p><strong>Pilih Claude Code jika:</strong></p>
<ul>
<li><p>Anda membutuhkan pembuatan kode berkualitas tinggi</p></li>
<li><p>Anda sedang membangun aplikasi komersial yang sangat penting</p></li>
<li><p>Dukungan tingkat perusahaan tidak dapat dinegosiasikan</p></li>
<li><p>Kualitas kode mengalahkan pertimbangan biaya</p></li>
<li><p>Anda terutama bekerja di macOS</p></li>
</ul>
<h2 id="Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Claude Code vs Gemini CLI: Penyiapan dan Praktik Terbaik<button data-href="#Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang setelah kita memiliki pemahaman dasar tentang kemampuan kedua alat AI terminal ini, mari kita lihat lebih dekat bagaimana cara memulai dengan keduanya dan praktik terbaiknya.</p>
<h3 id="Claude-Code-Setup-and-Best-Practices" class="common-anchor-header">Pengaturan Kode Claude dan Praktik Terbaik</h3><p><strong>Instalasi:</strong> Claude Code membutuhkan npm dan Node.js versi 18 atau lebih tinggi.</p>
<pre><code translate="no"><span class="hljs-comment"># Install Claude Code on your system</span>
npm install -g @anthropic-ai/claude-code

<span class="hljs-comment"># Set up API key</span>
claude config <span class="hljs-built_in">set</span> api-key YOUR_API_KEY

<span class="hljs-comment"># Verify installation was successful</span>
claude --version

<span class="hljs-comment"># Launch Claude Code</span>
Claude
<button class="copy-code-btn"></button></code></pre>
<p>****  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c413bbf950.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
****</p>
<p><strong>Praktik Terbaik untuk Claude Code:</strong></p>
<ol>
<li><strong>Mulailah dengan pemahaman arsitektur:</strong> Ketika mendekati proyek baru, minta Claude Code membantu Anda memahami keseluruhan struktur terlebih dahulu menggunakan bahasa alami.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Let Claude analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>Jadilah spesifik dan berikan konteks:</strong> Semakin banyak konteks yang Anda berikan, semakin akurat saran yang diberikan oleh Claude Code.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Implement specific features</span>
&gt; Implement an initial version <span class="hljs-keyword">for</span> GitHub issue <span class="hljs-meta">#123</span>

<span class="hljs-meta"># Code migration</span>
&gt; Help me migrate <span class="hljs-keyword">this</span> codebase to the latest Java version, first create a plan

<span class="hljs-meta"># Code refactoring</span>
&gt; Refactor <span class="hljs-keyword">this</span> function to make it more readable <span class="hljs-keyword">and</span> maintainable
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>Gunakan untuk debugging dan pengoptimalan:</strong></li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Error analysis</span>
&gt; What caused <span class="hljs-keyword">this</span> error? How can we fix it?

<span class="hljs-meta"># Performance optimization</span>
&gt; Analyze the performance bottlenecks <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> code

<span class="hljs-meta"># Code review</span>
&gt; Review <span class="hljs-keyword">this</span> pull request <span class="hljs-keyword">and</span> point <span class="hljs-keyword">out</span> potential issues
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ringkasan:</strong></p>
<ul>
<li><p>Gunakan pembelajaran progresif dengan memulai dengan penjelasan kode sederhana, lalu secara bertahap beralih ke tugas pembuatan kode yang lebih kompleks</p></li>
<li><p>Pertahankan konteks percakapan karena Claude Code mengingat diskusi sebelumnya</p></li>
<li><p>Berikan umpan balik menggunakan perintah <code translate="no">bug</code> untuk melaporkan masalah dan membantu meningkatkan alat ini</p></li>
<li><p>Tetap sadar akan keamanan dengan meninjau kebijakan pengumpulan data dan berhati-hati dengan kode sensitif</p></li>
</ul>
<h3 id="Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Pengaturan CLI Gemini dan Praktik Terbaik</h3><p><strong>Instalasi:</strong> Seperti halnya Claude Code, Gemini CLI membutuhkan npm dan Node.js versi 18 atau lebih tinggi.</p>
<pre><code translate="no"><span class="hljs-comment"># Install Gemini CLI</span>
npm install -g @google/gemini-cli

<span class="hljs-comment"># Login to your Google account</span>
gemini auth login

<span class="hljs-comment"># Verify installation</span>
gemini --version

<span class="hljs-comment"># Launch Gemini CLI</span>
Gemini
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_bec1984bb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Jika Anda memiliki akun pribadi, masuklah dengan akun Google Anda untuk akses langsung, dengan batas 60 permintaan per menit. Untuk batas yang lebih tinggi, konfigurasikan kunci API Anda:</p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GEMINI_API_KEY</span>=<span class="hljs-string">&quot;YOUR_API_KEY&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Praktik Terbaik untuk Gemini CLI:</strong></p>
<ol>
<li><strong>Mulailah dengan pemahaman arsitektur:</strong> Seperti halnya Claude Code, ketika mendekati proyek baru, mintalah Gemini CLI untuk membantu Anda memahami keseluruhan struktur terlebih dahulu menggunakan bahasa alami. Perhatikan bahwa Gemini CLI mendukung 1 juta jendela konteks token, sehingga sangat efektif untuk analisis basis kode berskala besar.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>Memanfaatkan kemampuan multimodalnya:</strong> Di sinilah Gemini CLI benar-benar bersinar.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Generate app from PDF</span>
&gt; Create a <span class="hljs-keyword">new</span> app based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> PDF design document

<span class="hljs-meta"># Generate code from sketch</span>
&gt; Generate frontend code based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> UI sketch

<span class="hljs-meta"># Image processing tasks</span>
&gt; Convert all images <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> directory to PNG format <span class="hljs-keyword">and</span> rename <span class="hljs-keyword">using</span> EXIF data
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>Jelajahi integrasi alat:</strong> Gemini CLI dapat berintegrasi dengan beberapa alat dan server MCP untuk meningkatkan fungsionalitas.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Connect external tools</span>
&gt; Use MCP server to connect my <span class="hljs-built_in">local</span> system tools

<span class="hljs-comment"># Media generation</span>
&gt; Use Imagen to generate project logo

<span class="hljs-comment"># Search integration</span>
&gt; Use Google search tool to find related technical documentation
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ringkasan:</strong></p>
<ul>
<li><p>Berorientasi pada proyek: Selalu luncurkan Gemini dari direktori proyek Anda untuk pemahaman kontekstual yang lebih baik</p></li>
<li><p>Memaksimalkan fitur multimodal dengan menggunakan gambar, dokumen, dan media lain sebagai input, bukan hanya teks</p></li>
<li><p>Jelajahi integrasi alat dengan menghubungkan alat eksternal dengan server MCP</p></li>
<li><p>Tingkatkan kemampuan pencarian dengan menggunakan pencarian Google bawaan untuk informasi terkini</p></li>
</ul>
<h2 id="AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="common-anchor-header">Kode AI Sudah Usang pada Saat Kedatangan. Inilah Cara Memperbaikinya dengan Milvus<button data-href="#AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Alat pengkodean AI seperti Claude Code dan Gemini CLI sangat kuat-tetapi mereka memiliki titik buta:</em> <strong><em>mereka tidak tahu apa</em></strong><em> yang</em> <strong><em>terkini</em></strong><em>.</em> </p>
<p><em>Kenyataannya? Sebagian besar model menghasilkan pola yang sudah ketinggalan zaman langsung dari kotaknya. Mereka dilatih berbulan-bulan yang lalu, terkadang bertahun-tahun. Jadi, meskipun mereka dapat menghasilkan kode dengan cepat, mereka tidak dapat menjamin bahwa kode tersebut mencerminkan</em> <strong><em>API</em></strong><em>, framework, atau versi SDK</em> <strong><em>terbaru.</em></strong></p>
<p><strong>Contoh nyata:</strong></p>
<p>Tanyakan kepada Cursor bagaimana cara terhubung ke Milvus, dan Anda mungkin akan mendapatkan ini:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Terlihat baik-baik saja, kecuali metode tersebut sudah tidak digunakan lagi. Pendekatan yang disarankan adalah menggunakan <code translate="no">MilvusClient</code> tetapi sebagian besar asisten belum mengetahuinya.</p>
<p>Atau gunakan API OpenAI sendiri. Banyak alat yang masih menyarankan <code translate="no">gpt-3.5-turbo</code> melalui <code translate="no">openai.ChatCompletion</code>, metode yang sudah tidak digunakan lagi pada bulan Maret 2024. Metode ini lebih lambat, lebih mahal, dan memberikan hasil yang lebih buruk. Tetapi LLM tidak mengetahui hal itu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_8f0d1a42b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5_3f4c4a0d4c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Fix-Real-Time-Intelligence-with-Milvus-MCP-+-RAG" class="common-anchor-header">Perbaikannya: Kecerdasan Waktu Nyata dengan Milvus MCP + RAG</h3><p>Untuk mengatasi hal ini, kami menggabungkan dua ide hebat:</p>
<ul>
<li><p><strong>Model Context Protocol (MCP)</strong>: Sebuah standar untuk alat bantu agen untuk berinteraksi dengan sistem langsung melalui bahasa alami</p></li>
<li><p><strong>Retrieval-Augmented Generation (RAG)</strong>: Mengambil konten terbaru dan paling relevan sesuai permintaan</p></li>
</ul>
<p>Bersama-sama, semua fitur ini membuat asisten Anda lebih cerdas dan terkini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_e6bc6cacd6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Begini cara kerjanya:</strong></p>
<ol>
<li><p>Mempersiapkan dokumentasi, referensi SDK, dan panduan API Anda</p></li>
<li><p>Simpan sebagai penyematan vektor di <a href="https://milvus.io/"><strong>Milvus</strong></a>, basis data vektor sumber terbuka kami</p></li>
<li><p>Ketika seorang pengembang mengajukan pertanyaan (misalnya, "Bagaimana cara terhubung ke Milvus?"), sistem:</p>
<ul>
<li><p>Menjalankan <strong>pencarian semantik</strong></p></li>
<li><p>Mengambil dokumen dan contoh yang paling relevan</p></li>
<li><p>Menyuntikkannya ke dalam konteks permintaan asisten</p></li>
</ul></li>
</ol>
<ol start="4">
<li>Hasil: saran kode yang mencerminkan <strong>apa yang benar saat ini</strong></li>
</ol>
<h3 id="Live-Code-Live-Docs" class="common-anchor-header">Kode Langsung, Dokumen Langsung</h3><p>Dengan <strong>Milvus MCP Server</strong>, Anda dapat menyambungkan alur ini langsung ke lingkungan pengkodean Anda. Asisten menjadi lebih pintar. Kode menjadi lebih baik. Pengembang tetap mengikuti alur.</p>
<p>Dan ini bukan hanya teori-kami telah menguji coba hal ini dengan pengaturan lain seperti Mode Agen Cursor, Context7, dan DeepWiki. Perbedaannya? Milvus + MCP tidak hanya meringkas proyek Anda-ia tetap sinkron dengannya.</p>
<p>Lihatlah dalam Aksi: <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">Mengapa Vibe Coding Anda Menghasilkan Kode yang Sudah Usang dan Cara Memperbaikinya dengan Milvus MCP </a></p>
<h2 id="The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="common-anchor-header">Masa Depan Pengkodean adalah Percakapan-Dan Itu Terjadi Sekarang<button data-href="#The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Revolusi AI terminal baru saja dimulai. Seiring dengan semakin matangnya alat-alat ini, kita mungkin akan melihat integrasi yang lebih erat dengan alur kerja pengembangan, kualitas kode yang lebih baik, dan solusi untuk masalah mata uang melalui pendekatan seperti MCP + RAG.</p>
<p>Apakah Anda memilih Claude Code karena kualitasnya atau Gemini CLI karena aksesibilitas dan kekuatannya, satu hal yang jelas: <strong>pemrograman bahasa alami akan terus ada</strong>. Pertanyaannya bukan apakah akan mengadopsi alat ini, tetapi bagaimana mengintegrasikannya secara efektif ke dalam alur kerja pengembangan Anda.</p>
<p>Kita sedang menyaksikan pergeseran mendasar dari menghafal sintaksis menjadi melakukan percakapan dengan kode kita. <strong>Masa depan pengkodean adalah percakapan - dan itu terjadi sekarang di terminal Anda.</strong></p>
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
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Membangun Asisten AI yang Siap Produksi dengan Spring Boot dan Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/introducing-zilliz-mcp-server">Server MCP Zilliz: Akses Bahasa Alami ke Basis Data Vektor - Blog Zilliz</a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: Pembandingan Dunia Nyata untuk Basis Data Vektor - Blog Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">Mengapa Pengkodean Getaran Anda Menghasilkan Kode yang Sudah Usang dan Cara Memperbaikinya dengan Milvus MCP</a></p></li>
<li><p><a href="https://milvus.io/blog/why-ai-databases-do-not-need-sql.md">Mengapa Basis Data AI Tidak Membutuhkan SQL </a></p></li>
</ul>
