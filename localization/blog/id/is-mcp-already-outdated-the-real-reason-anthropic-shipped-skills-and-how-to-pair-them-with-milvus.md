---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >-
  Apakah MCP Sudah Ketinggalan Zaman? Alasan Sebenarnya Keterampilan Antropik
  Dikirim-dan Cara Memasangkannya dengan Milvus
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_162fd27dc1.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  Pelajari bagaimana Skills bekerja untuk mengurangi konsumsi token, dan
  bagaimana Skills dan MCP bekerja sama dengan Milvus untuk meningkatkan alur
  kerja AI.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>Selama beberapa minggu terakhir, perdebatan sengit yang mengejutkan terjadi di X dan Hacker News: <em>Apakah kita benar-benar membutuhkan server MCP lagi?</em> Beberapa pengembang mengklaim bahwa MCP terlalu banyak direkayasa, haus token, dan pada dasarnya tidak selaras dengan cara agen menggunakan alat. Yang lain membela MCP sebagai cara yang dapat diandalkan untuk mengekspos kemampuan dunia nyata ke model bahasa. Tergantung pada utas mana yang Anda baca, MCP adalah masa depan penggunaan alat - atau mati pada saat kedatangan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Rasa frustrasi itu bisa dimengerti. MCP memberi Anda akses yang kuat ke sistem eksternal, tetapi juga memaksa model untuk memuat skema yang panjang, deskripsi yang bertele-tele, dan daftar alat yang luas. Hal itu menambah biaya yang nyata. Jika Anda mengunduh transkrip rapat dan kemudian memasukkannya ke alat lain, model dapat memproses ulang teks yang sama beberapa kali, meningkatkan penggunaan token tanpa manfaat yang jelas. Untuk tim yang beroperasi dalam skala besar, ini bukanlah sebuah ketidaknyamanan-ini adalah tagihan.</p>
<p>Tetapi menyatakan MCP sudah usang adalah hal yang terlalu dini. Anthropic - tim yang sama yang menciptakan MCP - diam-diam memperkenalkan sesuatu yang baru: <a href="https://claude.com/blog/skills"><strong>Keterampilan</strong></a>. Skills adalah definisi Markdown/YAML ringan yang menjelaskan <em>bagaimana</em> dan <em>kapan</em> suatu alat harus digunakan. Alih-alih membuang skema penuh ke dalam jendela konteks, model ini pertama-tama membaca metadata ringkas dan menggunakannya untuk membuat rencana. Dalam praktiknya, Skills secara dramatis mengurangi overhead token dan memberikan kontrol lebih besar kepada pengembang atas orkestrasi alat.</p>
<p>Jadi, apakah ini berarti Skills akan menggantikan MCP? Tidak sepenuhnya. Skills menyederhanakan perencanaan, tetapi MCP masih menyediakan kemampuan yang sebenarnya: membaca file, memanggil API, berinteraksi dengan sistem penyimpanan, atau menghubungkan ke infrastruktur eksternal seperti <a href="https://milvus.io/"><strong>Milvus</strong></a>, basis data vektor sumber terbuka yang mendukung pengambilan semantik yang cepat dalam skala besar, sehingga menjadikannya sebagai backend yang sangat penting ketika Skills Anda membutuhkan akses data yang sebenarnya.</p>
<p>Artikel ini menguraikan apa yang dilakukan Skills dengan baik, di mana MCP masih penting, dan bagaimana keduanya cocok dengan arsitektur agen Anthropic yang terus berkembang. Kemudian kita akan membahas cara membuat Skills Anda sendiri yang terintegrasi dengan Milvus.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">Apa itu Keterampilan Agen Anthropic dan Bagaimana Cara Kerjanya<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Masalah yang sudah berlangsung lama pada agen AI tradisional adalah instruksi yang hilang seiring dengan bertambahnya percakapan.</p>
<p>Bahkan dengan perintah sistem yang dibuat dengan sangat hati-hati, perilaku model secara bertahap dapat berubah selama percakapan berlangsung. Setelah beberapa kali giliran, Claude mulai lupa atau kehilangan fokus pada instruksi awal.</p>
<p>Masalahnya terletak pada struktur perintah sistem. Ini adalah injeksi statis satu kali yang bersaing untuk mendapatkan ruang di jendela konteks model, di samping riwayat percakapan, dokumen, dan input lainnya. Saat jendela konteks terisi, perhatian model terhadap perintah sistem menjadi semakin berkurang, yang menyebabkan hilangnya konsistensi dari waktu ke waktu.</p>
<p>Keterampilan dirancang untuk mengatasi masalah ini. Keterampilan adalah folder yang berisi instruksi, skrip, dan sumber daya. Daripada mengandalkan prompt sistem statis, Skills memecah keahlian menjadi kumpulan instruksi modular, dapat digunakan kembali, dan persisten yang dapat ditemukan dan dimuat oleh Claude secara dinamis saat dibutuhkan untuk suatu tugas.</p>
<p>Ketika Claude memulai sebuah tugas, pertama-tama ia melakukan pemindaian ringan terhadap semua Skill yang tersedia dengan hanya membaca metadata YAML mereka (hanya beberapa lusin token). Metadata ini memberikan informasi yang cukup bagi Claude untuk menentukan apakah sebuah Skill relevan dengan tugas saat ini. Jika demikian, Claude akan memperluas ke set instruksi lengkap (biasanya di bawah 5 ribu token), dan sumber daya atau skrip tambahan dimuat hanya jika diperlukan.</p>
<p>Pengungkapan progresif ini memungkinkan Claude untuk menginisialisasi Skill hanya dengan 30-50 token, yang secara signifikan meningkatkan efisiensi dan mengurangi overhead konteks yang tidak perlu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">Bagaimana Keterampilan Dibandingkan dengan Permintaan, Proyek, MCP, dan Subagen<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>Lanskap perkakas model saat ini dapat terasa penuh sesak. Bahkan di dalam ekosistem agen Claude saja, ada beberapa komponen yang berbeda: Keterampilan, permintaan, Proyek, subagen, dan MCP.</p>
<p>Setelah kita memahami apa itu Skills dan bagaimana cara kerjanya melalui bundel instruksi modular dan pemuatan dinamis, kita perlu mengetahui bagaimana Skills berhubungan dengan bagian lain dari ekosistem Claude, terutama MCP. Berikut ini adalah ringkasannya:</p>
<h3 id="1-Skills" class="common-anchor-header">1. Keterampilan</h3><p>Skills adalah folder yang berisi instruksi, skrip, dan sumber daya. Claude menemukan dan memuatnya secara dinamis menggunakan pengungkapan progresif: pertama metadata, kemudian instruksi lengkap, dan akhirnya file yang diperlukan.</p>
<p><strong>Paling baik untuk:</strong></p>
<ul>
<li><p>Alur kerja organisasi (pedoman merek, prosedur kepatuhan)</p></li>
<li><p>Keahlian domain (rumus Excel, analisis data)</p></li>
<li><p>Preferensi pribadi (sistem pencatatan, pola pengkodean)</p></li>
<li><p>Tugas profesional yang perlu digunakan kembali di berbagai percakapan (tinjauan keamanan kode berbasis OWASP)</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. Perintah</h3><p>Prompts adalah instruksi bahasa alami yang Anda berikan kepada Claude dalam percakapan. Prompt bersifat sementara dan hanya ada dalam percakapan saat ini.</p>
<p><strong>Paling baik untuk:</strong></p>
<ul>
<li><p>Permintaan satu kali (meringkas artikel, memformat daftar)</p></li>
<li><p>Penyempurnaan percakapan (menyesuaikan nada, menambahkan detail)</p></li>
<li><p>Konteks langsung (menganalisis data spesifik, menafsirkan konten)</p></li>
<li><p>Instruksi yang bersifat ad-hoc</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. Proyek</h3><p>Proyek adalah ruang kerja mandiri dengan riwayat percakapan dan basis pengetahuannya sendiri. Setiap proyek menawarkan jendela konteks 200 ribu. Ketika pengetahuan proyek Anda mendekati batas konteks, Claude bertransisi dengan mulus ke mode RAG, sehingga memungkinkan perluasan kapasitas efektif hingga 10x lipat.</p>
<p><strong>Paling baik untuk:</strong></p>
<ul>
<li><p>Konteks yang terus menerus (misalnya, semua percakapan yang terkait dengan peluncuran produk)</p></li>
<li><p>Organisasi ruang kerja (konteks terpisah untuk inisiatif yang berbeda)</p></li>
<li><p>Kolaborasi tim (pada paket Tim dan Enterprise)</p></li>
<li><p>Instruksi khusus (nada atau perspektif khusus proyek)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. Subagen</h3><p>Subagen adalah asisten AI khusus dengan jendela konteks mereka sendiri, petunjuk sistem khusus, dan izin alat tertentu. Mereka dapat bekerja secara mandiri dan mengembalikan hasil ke agen utama.</p>
<p><strong>Paling baik untuk:</strong></p>
<ul>
<li><p>Spesialisasi tugas (tinjauan kode, pembuatan tes, audit keamanan)</p></li>
<li><p>Manajemen konteks (menjaga agar percakapan utama tetap fokus)</p></li>
<li><p>Pemrosesan paralel (beberapa subagen yang bekerja pada aspek yang berbeda secara bersamaan)</p></li>
<li><p>Pembatasan alat (misalnya, akses hanya-baca)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP (Protokol Konteks Model)</h3><p>Model Context Protocol (MCP) adalah standar terbuka yang menghubungkan model AI ke alat dan sumber data eksternal.</p>
<p><strong>Paling baik untuk:</strong></p>
<ul>
<li><p>Mengakses data eksternal (Google Drive, Slack, GitHub, database)</p></li>
<li><p>Menggunakan alat bantu bisnis (sistem CRM, platform manajemen proyek)</p></li>
<li><p>Menghubungkan ke lingkungan pengembangan (file lokal, IDE, kontrol versi)</p></li>
<li><p>Berintegrasi dengan sistem khusus (alat dan sumber data berpemilik)</p></li>
</ul>
<p>Berdasarkan penjelasan di atas, kita dapat melihat bahwa Skills dan MCP menangani tantangan yang berbeda dan bekerja sama untuk saling melengkapi.</p>
<table>
<thead>
<tr><th><strong>Dimensi</strong></th><th><strong>MCP</strong></th><th><strong>Keterampilan</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Nilai Inti</strong></td><td>Menghubungkan ke sistem eksternal (database, API, platform SaaS)</td><td>Mendefinisikan spesifikasi perilaku (cara memproses dan menyajikan data)</td></tr>
<tr><td><strong>Pertanyaan yang Terjawab</strong></td><td>"Apa yang dapat diakses oleh Claude?"</td><td>"Apa yang harus dilakukan oleh Claude?"</td></tr>
<tr><td><strong>Implementasi</strong></td><td>Protokol klien-server + Skema JSON</td><td>File penurunan harga + metadata YAML</td></tr>
<tr><td><strong>Konsumsi Konteks</strong></td><td>Puluhan ribu token (akumulasi beberapa server)</td><td>30-50 token per operasi</td></tr>
<tr><td><strong>Kasus Penggunaan</strong></td><td>Mengajukan kueri ke basis data besar, memanggil API GitHub</td><td>Menentukan strategi pencarian, menerapkan aturan pemfilteran, pemformatan keluaran</td></tr>
</tbody>
</table>
<p>Mari kita ambil pencarian kode sebagai contoh.</p>
<ul>
<li><p><strong>MCP (mis., konteks claude):</strong> Menyediakan kemampuan untuk mengakses basis data vektor Milvus.</p></li>
<li><p><strong>Keterampilan:</strong> Mendefinisikan alur kerja, seperti memprioritaskan kode yang paling baru dimodifikasi, mengurutkan hasil berdasarkan relevansi, dan menyajikan data dalam tabel Penurunan Harga.</p></li>
</ul>
<p>MCP menyediakan kemampuan, sementara Keterampilan mendefinisikan prosesnya. Bersama-sama, keduanya membentuk pasangan yang saling melengkapi.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Cara Membangun Keterampilan Khusus dengan Claude-Context dan Milvus<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a> adalah plugin MCP yang menambahkan fungsionalitas pencarian kode semantik ke dalam Claude Code, mengubah seluruh basis kode ke dalam konteks Claude.</p>
<h3 id="Prerequisite" class="common-anchor-header">Prasyarat</h3><p>Persyaratan Sistem:</p>
<ul>
<li><p><strong>Node.js</strong>: Versi &gt;= 20.0.0 dan &lt; 24.0.0</p></li>
<li><p><strong>Kunci API OpenAI</strong> (untuk model penyematan)</p></li>
<li><p><strong>Kunci API</strong><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> (layanan Milvus yang dikelola)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">Langkah 1: Konfigurasikan Layanan MCP (claude-context)</h3><p>Jalankan perintah berikut di terminal:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Periksa Konfigurasi:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Penyiapan MCP selesai. Claude sekarang dapat mengakses basis data vektor Milvus.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">Langkah 2: Membuat Keterampilan</h3><p>Buat direktori Keterampilan:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>Buat file SKILL.md:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">Langkah 3: Mulai ulang Claude untuk menerapkan keterampilan</h3><p>Jalankan perintah berikut untuk memulai ulang Claude:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Catatan:</strong> Setelah konfigurasi selesai, Anda dapat langsung menggunakan Skills untuk menanyakan basis kode Milvus.</p>
<p>Di bawah ini adalah contoh cara kerjanya.</p>
<p>Query: Bagaimana cara kerja Milvus QueryCoord?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Pada intinya, Skills bertindak sebagai mekanisme untuk merangkum dan mentransfer pengetahuan khusus. Dengan menggunakan Skills, AI dapat mewarisi pengalaman tim dan mengikuti praktik terbaik industri-apakah itu daftar periksa untuk tinjauan kode atau standar dokumentasi. Ketika pengetahuan tacit ini dibuat eksplisit melalui file Markdown, kualitas output yang dihasilkan AI dapat mengalami peningkatan yang signifikan.</p>
<p>Ke depannya, kemampuan untuk memanfaatkan Skills secara efektif dapat menjadi pembeda utama dalam cara tim dan individu menggunakan AI untuk keuntungan mereka.</p>
<p>Ketika Anda mengeksplorasi potensi AI dalam organisasi Anda, Milvus hadir sebagai alat penting untuk mengelola dan mencari data vektor berskala besar. Dengan memasangkan basis data vektor Milvus yang kuat dengan alat bantu AI seperti Skills, Anda tidak hanya dapat meningkatkan alur kerja Anda, tetapi juga kedalaman dan kecepatan wawasan berbasis data Anda.</p>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami untuk mengobrol dengan teknisi kami dan teknisi AI lainnya di komunitas. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
