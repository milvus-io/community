---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: 'Berbicara dengan Basis Data Vektor Anda: Mengelola Milvus melalui Bahasa Alami'
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP Server menghubungkan Milvus secara langsung ke asisten pengkodean
  AI seperti Claude Code dan Cursor melalui MCP. Anda dapat mengelola Milvus
  melalui bahasa alami.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>Pernahkah Anda berharap Anda dapat memberi tahu asisten AI Anda, <em>"Tunjukkan semua koleksi dalam database vektor saya"</em> atau <em>"Temukan dokumen yang mirip dengan teks ini"</em> dan membuatnya benar-benar berfungsi?</p>
<p><a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP Server</strong></a> memungkinkan hal ini dengan menghubungkan basis data vektor Milvus Anda secara langsung ke asisten pengkodean AI seperti Claude Desktop dan Cursor IDE melalui Model Context Protocol (MCP). Alih-alih menulis kode <code translate="no">pymilvus</code>, Anda dapat mengelola seluruh Milvus Anda melalui percakapan bahasa alami.</p>
<ul>
<li><p>Tanpa Milvus MCP Server: Menulis skrip Python dengan pymilvus SDK untuk mencari vektor</p></li>
<li><p>Dengan Milvus MCP Server: "Temukan dokumen yang mirip dengan teks ini di koleksi saya."</p></li>
</ul>
<p>👉 <strong>Repositori GitHub:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>Dan jika Anda menggunakan <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (yang dikelola Milvus), kami juga membantu Anda. Di akhir blog ini, kami juga akan memperkenalkan <strong>Zilliz MCP Server</strong>, opsi terkelola yang bekerja secara mulus dengan Zilliz Cloud. Mari kita bahas lebih lanjut.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">Apa yang Akan Anda Dapatkan dengan Milvus MCP Server<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP Server memberi asisten AI Anda kemampuan berikut ini:</p>
<ul>
<li><p>Membuat<strong>daftar dan menjelajahi</strong> koleksi vektor</p></li>
<li><p><strong>Mencari vektor</strong> menggunakan kesamaan semantik</p></li>
<li><p><strong>Membuat koleksi baru</strong> dengan skema khusus</p></li>
<li><p><strong>Menyisipkan dan mengelola</strong> data vektor</p></li>
<li><p><strong>Menjalankan kueri yang kompleks</strong> tanpa menulis kode</p></li>
<li><p>Dan banyak lagi</p></li>
</ul>
<p>Semua melalui percakapan alami, seolah-olah Anda sedang berbicara dengan pakar database. Lihat <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">repo ini</a> untuk daftar lengkap kemampuannya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">Panduan Memulai Cepat<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><p><strong>Diperlukan</strong></p>
<ul>
<li><p>Python 3.10 atau lebih tinggi</p></li>
<li><p>Instance Milvus yang sedang berjalan (lokal atau jarak jauh)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">pengelola paket uv</a> (disarankan)</p></li>
</ul>
<p><strong>Aplikasi AI yang didukung:</strong></p>
<ul>
<li><p>Claude Desktop</p></li>
<li><p>IDE kursor</p></li>
<li><p>Semua aplikasi yang kompatibel dengan MCP</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">Tech Stack yang Akan Kita Gunakan</h3><p>Dalam tutorial ini, kita akan menggunakan tech stack berikut ini:</p>
<ul>
<li><p><strong>Runtime Bahasa:</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>Package Manager:</strong> UV</p></li>
<li><p><strong>IDE</strong> Kursor</p></li>
<li><p><strong>Server MCP:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> Claude 3.7</p></li>
<li><p><strong>Basis Data Vektor:</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Langkah 1: Menginstal Ketergantungan</h3><p>Pertama, instal manajer paket uv:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>Atau:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verifikasi instalasi:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">Langkah 2: Menyiapkan Milvus</h3><p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka yang asli untuk beban kerja AI, yang dibuat oleh <a href="https://zilliz.com/">Zilliz</a>. Dirancang untuk menangani jutaan hingga miliaran catatan vektor, Milvus telah mendapatkan lebih dari 36.000 bintang di GitHub. Dibangun di atas fondasi ini, Zilliz juga menawarkan <a href="https://zilliz.com/cloud">Zilliz Cloud-layanan</a>terkelola penuh dari Milvus yang dirancang untuk kegunaan, efisiensi biaya, dan keamanan dengan arsitektur cloud-native.</p>
<p>Untuk persyaratan penerapan Milvus, kunjungi <a href="https://milvus.io/docs/prerequisite-docker.md">panduan ini di situs dokumen</a>.</p>
<p><strong>Persyaratan minimum:</strong></p>
<ul>
<li><p><strong>Perangkat lunak:</strong> Docker, Docker Compose</p></li>
<li><p><strong>RAM:</strong> 16GB+</p></li>
<li><p><strong>Disk:</strong> 100GB+</p></li>
</ul>
<p>Unduh berkas YAML penerapan:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Mulai Milvus:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Instance Milvus Anda akan tersedia di <code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">Langkah 3: Menginstalasi Server MCP</h3><p>Kloning dan uji server MCP:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Kami menyarankan untuk menginstal dependensi dan memverifikasi secara lokal sebelum mendaftarkan server di Cursor:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Jika Anda melihat server berhasil dijalankan, Anda siap untuk mengonfigurasi alat AI Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">Langkah 4: Konfigurasikan Asisten AI Anda</h3><p><strong>Opsi A: Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">Instal Claude Desktop dari <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>Buka file konfigurasi:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>Tambahkan konfigurasi ini:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Mulai ulang Claude Desktop</li>
</ol>
<p><strong>Opsi B: IDE Kursor</strong></p>
<ol>
<li><p>Buka Pengaturan Kursor → Fitur → MCP</p></li>
<li><p>Tambahkan server MCP global baru (ini akan membuat <code translate="no">.cursor/mcp.json</code>)</p></li>
<li><p>Tambahkan konfigurasi ini:</p></li>
</ol>
<p>Catatan: Sesuaikan jalur dengan struktur file Anda yang sebenarnya.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parameter</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> adalah jalur ke eksekusi uv</li>
<li><code translate="no">--directory</code> adalah jalur ke proyek yang dikloning</li>
<li><code translate="no">--milvus-uri</code> adalah titik akhir server Milvus Anda</li>
</ul>
<ol start="4">
<li>Mulai ulang kursor atau muat ulang jendela</li>
</ol>
<p>Kiat<strong>pro:</strong> Temukan jalur <code translate="no">uv</code> Anda dengan <code translate="no">which uv</code> di macOS/Linux atau <code translate="no">where uv</code> di Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">Langkah 5: Melihatnya Beraksi</h3><p>Setelah dikonfigurasi, cobalah perintah-perintah bahasa alami ini:</p>
<ul>
<li><p><strong>Jelajahi basis data Anda:</strong> "Koleksi apa saja yang saya miliki di basis data Milvus saya?"</p></li>
<li><p><strong>Buat koleksi baru:</strong> "Buat koleksi bernama 'artikel' dengan bidang untuk judul (string), konten (string), dan bidang vektor 768 dimensi untuk penyematan."</p></li>
<li><p><strong>Mencari konten yang serupa:</strong> "Temukan lima artikel yang paling mirip dengan 'aplikasi pembelajaran mesin' dalam koleksi artikel saya."</p></li>
<li><p><strong>Menyisipkan data:</strong> "Tambahkan artikel baru dengan judul 'Tren AI 2024' dan konten 'Kecerdasan buatan terus berevolusi...' ke dalam koleksi artikel"</p></li>
</ul>
<p><strong>Apa yang dulunya membutuhkan lebih dari 30 menit pengkodean sekarang hanya membutuhkan beberapa detik percakapan.</strong></p>
<p>Anda mendapatkan kontrol waktu nyata dan akses bahasa alami ke Milvus-tanpa perlu menulis boilerplate atau mempelajari API.</p>
<h2 id="Troubleshooting" class="common-anchor-header">Pemecahan masalah<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika alat MCP tidak muncul, mulai ulang aplikasi AI Anda sepenuhnya, verifikasi jalur UV dengan <code translate="no">which uv</code>, dan uji server secara manual dengan <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>Untuk kesalahan koneksi, periksa apakah Milvus berjalan dengan <code translate="no">docker ps | grep milvus</code>, coba gunakan <code translate="no">127.0.0.1</code> alih-alih <code translate="no">localhost</code>, dan verifikasi port 19530 dapat diakses.</p>
<p>Jika Anda mengalami masalah autentikasi, atur variabel lingkungan <code translate="no">MILVUS_TOKEN</code> jika Milvus Anda membutuhkan autentikasi, dan verifikasi izin Anda untuk operasi yang Anda coba.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">Alternatif Terkelola: Server MCP Zilliz<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus MCP Server</strong> sumber terbuka adalah solusi yang bagus untuk penyebaran Milvus lokal atau yang dihosting sendiri. Tetapi jika Anda menggunakan <a href="https://zilliz.com/cloud">Zilliz Cloud-layanan</a>tingkat perusahaan yang dikelola sepenuhnya dan dibangun oleh pencipta Milvus-ada alternatif yang dibuat khusus: <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Server</strong></a>.</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a> menghilangkan biaya tambahan untuk mengelola instance Milvus Anda sendiri dengan menawarkan basis data vektor cloud-native yang terukur, berkinerja tinggi, dan aman. <strong>Zilliz MCP Server</strong> terintegrasi langsung dengan Zilliz Cloud dan memperlihatkan kemampuannya sebagai alat yang kompatibel dengan MCP. Ini berarti asisten AI Anda - baik di Claude, Cursor, atau lingkungan yang sadar MCP lainnya - sekarang dapat menanyakan, mengelola, dan mengatur ruang kerja Zilliz Cloud Anda menggunakan bahasa alami.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tidak ada kode boilerplate. Tidak ada tab yang berganti-ganti. Tidak perlu menulis panggilan REST atau SDK secara manual. Cukup ucapkan permintaan Anda dan biarkan asisten Anda menangani sisanya.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 Memulai dengan Zilliz MCP Server</h3><p>Jika Anda siap untuk infrastruktur vektor yang siap produksi dengan kemudahan bahasa alami, memulai hanya membutuhkan beberapa langkah:</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Mendaftar untuk Zilliz Cloud</strong></a> - tersedia tingkat gratis.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>Instal Zilliz MCP Server</strong> dari </a>repositori GitHub.</p></li>
<li><p><strong>Konfigurasikan asisten yang kompatibel dengan MCP Anda</strong> (Claude, Cursor, dll.) untuk terhubung ke instance Zilliz Cloud Anda.</p></li>
</ol>
<p>Ini memberi Anda yang terbaik dari kedua dunia: pencarian vektor yang kuat dengan infrastruktur kelas produksi, sekarang dapat diakses melalui bahasa Inggris biasa.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Penutup<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>Dan itu saja-Anda baru saja mempelajari cara mengubah Milvus menjadi database vektor yang ramah bahasa alami yang dapat Anda ajak <em>bicara</em>. Tidak perlu lagi menggali dokumen SDK atau menulis boilerplate hanya untuk membuat koleksi atau menjalankan pencarian.</p>
<p>Baik Anda menjalankan Milvus secara lokal atau menggunakan Zilliz Cloud, MCP Server memberikan asisten AI Anda sebuah kotak peralatan untuk mengelola data vektor Anda seperti seorang profesional. Cukup ketik apa yang ingin Anda lakukan, dan biarkan Claude atau Cursor menangani sisanya.</p>
<p>Jadi, silakan jalankan alat pengembangan AI Anda, tanyakan "koleksi apa yang saya miliki?" dan lihatlah bagaimana cara kerjanya. Anda tidak akan pernah ingin kembali menulis kueri vektor dengan tangan.</p>
<ul>
<li><p>Penyiapan lokal? Gunakan<a href="https://github.com/zilliztech/mcp-server-milvus"> Server MCP Milvus</a> yang bersumber terbuka</p></li>
<li><p>Lebih suka layanan terkelola? Daftar ke Zilliz Cloud dan gunakan<a href="https://github.com/zilliztech/zilliz-mcp-server"> Server MCP Zilliz</a></p></li>
</ul>
<p>Anda sudah punya alatnya. Sekarang biarkan AI Anda yang mengetik.</p>
