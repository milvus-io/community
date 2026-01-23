---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >-
  Bagaimana Keterampilan Antropik Mengubah Perkakas Agen - dan Cara Membangun
  Keterampilan Khusus untuk Milvus agar Cepat Memutar RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  Pelajari apa itu Skill dan cara membuat Skill khusus di Claude Code yang
  membangun sistem RAG yang didukung Milvus dari instruksi bahasa alami
  menggunakan alur kerja yang dapat digunakan kembali.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>Penggunaan alat bantu adalah bagian besar dalam membuat agen bekerja. Agen harus memilih alat yang tepat, memutuskan kapan harus memanggilnya, dan memformat input dengan benar. Di atas kertas kedengarannya sangat mudah, tetapi begitu Anda mulai membangun sistem yang sebenarnya, Anda akan menemukan banyak kasus dan mode kegagalan.</p>
<p>Banyak tim menggunakan definisi alat gaya MCP untuk mengatur hal ini, tetapi MCP memiliki beberapa kelemahan. Model ini harus mempertimbangkan semua alat sekaligus, dan tidak ada banyak struktur untuk memandu keputusannya. Selain itu, setiap definisi alat harus berada di jendela konteks. Beberapa di antaranya berukuran besar - MCP GitHub sekitar 26 ribu token - yang memakan konteks bahkan sebelum agen mulai melakukan pekerjaan nyata.</p>
<p>Anthropic memperkenalkan <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>Skills</strong></a> untuk memperbaiki situasi ini. Keterampilan lebih kecil, lebih fokus, dan lebih mudah dimuat sesuai permintaan. Alih-alih membuang semuanya ke dalam konteks, Anda mengemas logika domain, alur kerja, atau skrip ke dalam unit-unit ringkas yang dapat diambil oleh agen hanya jika diperlukan.</p>
<p>Dalam posting ini, saya akan membahas cara kerja Keterampilan Antropik dan kemudian menjelaskan cara membuat Keterampilan sederhana di Claude Code yang mengubah bahasa alami menjadi basis pengetahuan <a href="https://milvus.io/">yang didukung Milvus</a>- penyiapan cepat untuk RAG tanpa kabel tambahan.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">Apa yang dimaksud dengan Keterampilan Antropik?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">Keterampilan Antropik</a> (atau Keterampilan Agen) hanyalah folder yang menggabungkan instruksi, skrip, dan file referensi yang dibutuhkan agen untuk menangani tugas tertentu. Anggap saja sebagai paket kemampuan kecil yang mandiri. Sebuah Keterampilan dapat menentukan cara membuat laporan, menjalankan analisis, atau mengikuti alur kerja atau seperangkat aturan tertentu.</p>
<p>Ide kuncinya adalah bahwa Keterampilan bersifat modular dan dapat dimuat sesuai permintaan. Alih-alih memasukkan definisi alat yang sangat banyak ke dalam jendela konteks, agen hanya mengambil Skill yang dibutuhkannya. Hal ini membuat penggunaan konteks tetap rendah sambil memberikan panduan yang jelas kepada model tentang alat apa saja yang ada, kapan harus memanggilnya, dan bagaimana menjalankan setiap langkah.</p>
<p>Formatnya sengaja dibuat sederhana, dan karena itu, format ini sudah didukung atau mudah diadaptasi di banyak alat pengembang - Claude Code, Cursor, ekstensi VS Code, integrasi GitHub, pengaturan gaya Codex, dan sebagainya.</p>
<p>Skill mengikuti struktur folder yang konsisten:</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(File Inti)</strong></p>
<p>Ini adalah panduan eksekusi untuk agen-dokumen yang memberi tahu agen tentang bagaimana tugas harus dilakukan. File ini mendefinisikan metadata Skill (seperti nama, deskripsi, dan kata kunci pemicu), alur eksekusi, dan pengaturan default. Dalam file ini, Anda harus menjelaskan dengan jelas:</p>
<ul>
<li><p><strong>Kapan Skill harus dijalankan:</strong> Misalnya, picu Skill ketika input pengguna menyertakan frasa seperti "memproses file CSV dengan Python."</p></li>
<li><p><strong>Bagaimana tugas harus dilakukan:</strong> Jabarkan langkah-langkah eksekusi secara berurutan, seperti: menafsirkan permintaan pengguna → memanggil skrip prapemrosesan dari direktori <code translate="no">scripts/</code> → membuat kode yang diperlukan → memformat keluaran menggunakan templat dari <code translate="no">templates/</code>.</p></li>
<li><p><strong>Aturan dan batasan:</strong> Tentukan detail seperti konvensi pengkodean, format keluaran, dan bagaimana kesalahan harus ditangani.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(Skrip Eksekusi)</strong></p>
<p>Direktori ini berisi skrip yang telah ditulis sebelumnya dalam bahasa seperti Python, Shell, atau Node.js. Agen dapat memanggil skrip ini secara langsung, alih-alih membuat kode yang sama berulang kali pada saat runtime. Contoh umum termasuk <code translate="no">create_collection.py</code> dan <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(Templat Dokumen)</strong></p>
<p>File templat yang dapat digunakan kembali yang dapat digunakan oleh agen untuk menghasilkan konten yang disesuaikan. Contoh umum termasuk templat laporan atau templat konfigurasi.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(Bahan Referensi)</strong></p>
<p>Dokumen referensi yang dapat dikonsultasikan oleh agen selama pelaksanaan, seperti dokumentasi API, spesifikasi teknis, atau panduan praktik terbaik.</p>
<p>Secara keseluruhan, struktur ini mencerminkan bagaimana pekerjaan diserahkan kepada rekan tim yang baru: <code translate="no">SKILL.md</code> menjelaskan pekerjaan, <code translate="no">scripts/</code> menyediakan alat yang siap digunakan, <code translate="no">templates/</code> menentukan format standar, dan <code translate="no">resources/</code> menyediakan informasi latar belakang. Dengan semua ini, agen dapat melaksanakan tugas dengan andal dan dengan sedikit menebak-nebak.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Tutorial Praktis: Membuat Keterampilan Khusus untuk Sistem RAG yang Didukung Milvus<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada bagian ini, kita akan membahas cara membuat Skill khusus yang dapat mengatur koleksi Milvus dan merakit pipeline RAG lengkap dari instruksi bahasa alami. Tujuannya adalah untuk melewatkan semua pekerjaan penyiapan yang biasa dilakukan - tidak ada desain skema manual, tidak ada konfigurasi indeks, tidak ada kode boilerplate. Anda memberi tahu agen apa yang Anda inginkan, dan Skill menangani bagian Milvus untuk Anda.</p>
<h3 id="Design-Overview" class="common-anchor-header">Gambaran Umum Desain</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><table>
<thead>
<tr><th>Komponen</th><th>Persyaratan</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>Model</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>Wadah</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>Platform Konfigurasi Model</td><td>CC-Switch</td></tr>
<tr><td>Manajer Paket</td><td>npm</td></tr>
<tr><td>Bahasa Pengembangan</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Langkah 1: Penyiapan Lingkungan</h3><p><strong>Instal</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>Instal CC-Switch</strong></p>
<p><strong>Catatan:</strong> CC-Switch adalah alat peralihan model yang memudahkan peralihan di antara API model yang berbeda saat menjalankan model AI secara lokal.</p>
<p>Repositori proyek: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>Pilih Claude dan Tambahkan Kunci API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Periksa Status Saat Ini</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Menerapkan dan Memulai Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Konfigurasikan Kunci API OpenAI</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">Langkah 2: Membuat Keterampilan Khusus untuk Milvus</h3><p><strong>Buat Struktur Direktori</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inisialisasi</strong> <code translate="no">SKILL.md</code></p>
<p><strong>Catatan:</strong> SKILL.md berfungsi sebagai panduan eksekusi agen. Ini mendefinisikan apa yang dilakukan Skill dan bagaimana seharusnya dipicu.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>Tulis Skrip Inti</strong></p>
<table>
<thead>
<tr><th>Jenis Skrip</th><th>Nama File</th><th>Tujuan</th></tr>
</thead>
<tbody>
<tr><td>Pemeriksaan lingkungan</td><td><code translate="no">check_env.py</code></td><td>Memeriksa versi Python, dependensi yang diperlukan, dan koneksi Milvus</td></tr>
<tr><td>Penguraian maksud</td><td><code translate="no">intent_parser.py</code></td><td>Mengonversi permintaan seperti "buat basis data RAG" menjadi maksud terstruktur seperti <code translate="no">scene=rag</code></td></tr>
<tr><td>Pembuatan koleksi</td><td><code translate="no">milvus_builder.py</code></td><td>Pembangun inti yang menghasilkan skema koleksi dan konfigurasi indeks</td></tr>
<tr><td>Konsumsi data</td><td><code translate="no">insert_milvus_data.py</code></td><td>Memuat dokumen, memotongnya, menghasilkan penyematan, dan menulis data ke dalam Milvus</td></tr>
<tr><td>Contoh 1</td><td><code translate="no">basic_text_search.py</code></td><td>Mendemonstrasikan cara membuat sistem pencarian dokumen</td></tr>
<tr><td>Contoh 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>Mendemonstrasikan bagaimana membangun basis pengetahuan RAG yang lengkap</td></tr>
</tbody>
</table>
<p>Skrip-skrip ini menunjukkan bagaimana mengubah Skill yang berfokus pada Milvus menjadi sesuatu yang praktis: sistem pencarian dokumen yang berfungsi dan pengaturan Tanya Jawab (RAG) yang cerdas.</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">Langkah 3: Aktifkan Keterampilan dan Jalankan Tes</h3><p><strong>Jelaskan Permintaan dalam Bahasa Alami</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Sistem RAG Dibuat</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Masukkan Data Sampel</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Jalankan Kueri</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Dalam tutorial ini, kita telah mempelajari cara membangun sistem RAG yang didukung oleh Milvus dengan menggunakan Skill khusus. Tujuannya bukan hanya untuk menunjukkan cara lain untuk memanggil Milvus-ini adalah untuk menunjukkan bagaimana Skill dapat mengubah apa yang biasanya merupakan pengaturan multi-langkah dan konfigurasi yang berat menjadi sesuatu yang dapat Anda gunakan kembali dan diulang. Alih-alih mendefinisikan skema secara manual, menyetel indeks, atau menyatukan kode alur kerja, Skill menangani sebagian besar boilerplate sehingga Anda dapat fokus pada bagian RAG yang benar-benar penting.</p>
<p>Ini hanyalah permulaan. Pipeline RAG yang lengkap memiliki banyak bagian yang bergerak: preprocessing, chunking, pengaturan pencarian hibrida, pemeringkatan ulang, evaluasi, dan banyak lagi. Semua ini dapat dikemas sebagai Keterampilan yang terpisah dan disusun tergantung pada kasus penggunaan Anda. Jika tim Anda memiliki standar internal untuk dimensi vektor, parameter indeks, templat cepat, atau logika pengambilan, Skills adalah cara yang bersih untuk mengkodekan pengetahuan tersebut dan membuatnya dapat diulang.</p>
<p>Untuk pengembang baru, ini menurunkan hambatan masuk - tidak perlu mempelajari setiap detail Milvus sebelum menjalankan sesuatu. Untuk tim yang berpengalaman, ini mengurangi pengaturan berulang dan membantu menjaga proyek tetap konsisten di seluruh lingkungan. Keterampilan tidak akan menggantikan desain sistem yang matang, tetapi mereka menghilangkan banyak gesekan yang tidak perlu.</p>
<p>👉 Implementasi lengkapnya tersedia di <a href="https://github.com/yinmin2020/open-milvus-skills">repositori sumber terbuka</a>, dan Anda bisa menjelajahi lebih banyak contoh yang dibuat oleh komunitas di <a href="https://skillsmp.com/">pasar Skill</a>.</p>
<h2 id="Stay-tuned" class="common-anchor-header">Pantau terus!<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami juga sedang berupaya memperkenalkan Skill Milvus dan Zilliz Cloud resmi yang mencakup pola RAG umum dan praktik terbaik produksi. Jika Anda memiliki ide atau alur kerja spesifik yang ingin Anda dukung, bergabunglah dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channel</a> kami dan mengobrol dengan teknisi kami. Dan jika Anda ingin panduan untuk pengaturan Anda sendiri, Anda selalu dapat memesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kantor Milvus</a>.</p>
