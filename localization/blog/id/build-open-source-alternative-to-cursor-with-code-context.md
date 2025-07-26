---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: Membangun Alternatif Sumber Terbuka untuk Kursor dengan Konteks Kode
author: Cheney Zhang
date: 2025-07-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context-sebuah plugin sumber terbuka yang kompatibel dengan MCP yang
  menghadirkan pencarian kode semantik yang kuat ke agen pengkodean AI, Claude
  Code dan Gemini CLI, IDE seperti VSCode, dan bahkan lingkungan seperti Chrome.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">Ledakan Pengkodean AI-Dan Titik Butanya<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Alat bantu pengkodean AI ada di mana-mana-dan menjadi viral karena alasan yang bagus. Mulai dari <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code, Gemini CLI</a> hingga alternatif Cursor sumber terbuka, agen-agen ini dapat menulis fungsi, menjelaskan ketergantungan kode, dan merefaktor seluruh file dengan satu perintah. Para pengembang berlomba-lomba untuk mengintegrasikannya ke dalam alur kerja mereka, dan dalam banyak hal, mereka berhasil mewujudkannya.</p>
<p><strong>Tetapi ketika harus <em>memahami basis kode Anda</em>, sebagian besar alat AI membentur tembok.</strong></p>
<p>Mintalah Claude Code untuk menemukan "di mana proyek ini menangani otentikasi pengguna," dan ia kembali ke <code translate="no">grep -r &quot;auth&quot;</code>-memuntahkan 87 kecocokan yang terkait secara longgar di seluruh komentar, nama variabel, dan nama berkas, kemungkinan besar melewatkan banyak fungsi dengan logika otentikasi tetapi tidak disebut "auth". Coba Gemini CLI, dan akan mencari kata kunci seperti "login" atau "password", dan kehilangan fungsi-fungsi seperti <code translate="no">verifyCredentials()</code> sepenuhnya. Alat-alat ini sangat bagus dalam menghasilkan kode, tetapi ketika tiba waktunya untuk menavigasi, men-debug, atau menjelajahi sistem yang tidak dikenal, alat ini menjadi berantakan. Kecuali jika mereka mengirim seluruh basis kode ke LLM untuk konteks-pembakaran melalui token dan waktu-mereka berjuang untuk memberikan jawaban yang berarti.</p>
<p><em>Itulah kesenjangan yang sebenarnya dalam perkakas AI saat ini:</em> <strong><em>konteks kode</em></strong>.</p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursor Berhasil Mengatasinya-Tetapi Tidak untuk Semua Orang<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong> mengatasi hal ini secara langsung. Alih-alih pencarian kata kunci, ia membangun peta semantik basis kode Anda menggunakan pohon sintaksis, penyematan vektor, dan pencarian yang sadar kode. Tanyakan "di mana logika validasi email?" dan ia akan mengembalikan <code translate="no">isValidEmailFormat()</code> -bukan karena namanya cocok, tetapi karena ia memahami apa yang <em>dilakukan</em> oleh kode tersebut.</p>
<p>Meskipun Cursor sangat kuat, mungkin tidak cocok untuk semua orang. <strong><em>Cursor bersifat sumber tertutup, di-host di cloud, dan berbasis langganan.</em></strong> Hal ini membuatnya tidak dapat digunakan oleh tim yang bekerja dengan kode sensitif, organisasi yang sadar akan keamanan, pengembang indie, pelajar, dan siapa pun yang lebih memilih sistem terbuka.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">Bagaimana jika Anda Bisa Membuat Kursor Anda Sendiri?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Inilah masalahnya: teknologi inti di balik Cursor bukanlah teknologi eksklusif. Cursor dibangun di atas fondasi sumber terbuka yang sudah terbukti - database vektor seperti <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/ai-models">model penyematan</a>, pengurai sintaksis dengan Tree-sitter - semuanya tersedia bagi siapa saja yang ingin menghubungkan titik-titiknya.</p>
<p><em>Jadi, kami bertanya:</em> <strong><em>Bagaimana jika setiap orang dapat membuat Kursor mereka sendiri?</em></strong> Berjalan pada infrastruktur Anda. Tidak ada biaya berlangganan. Dapat disesuaikan sepenuhnya. Kendali penuh atas kode dan data Anda.</p>
<p>Itulah mengapa kami membuat <a href="https://github.com/zilliztech/code-context"><strong>Code Context-sebuah</strong></a>plugin sumber terbuka yang kompatibel dengan MCP yang menghadirkan pencarian kode semantik yang kuat ke agen pengkodean AI apa pun, seperti Claude Code dan Gemini CLI, IDE seperti VSCode, dan bahkan lingkungan seperti Google Chrome. Plugin ini juga memberi Anda kekuatan untuk membangun agen pengkodean Anda sendiri seperti Cursor dari awal, membuka navigasi real-time dan cerdas dari basis kode Anda.</p>
<p><strong><em>Tidak ada langganan. Tidak ada kotak hitam. Hanya kecerdasan kode-dengan persyaratan Anda.</em></strong></p>
<p>Di bagian selanjutnya dari artikel ini, kita akan membahas cara kerja Code Context-dan bagaimana Anda dapat mulai menggunakannya hari ini.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Konteks Kode: Alternatif Sumber Terbuka untuk Kecerdasan Kursor<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> adalah mesin pencari kode semantik sumber terbuka yang kompatibel dengan MCP. Baik Anda membangun asisten pengkodean AI kustom dari awal atau menambahkan kesadaran semantik ke agen pengkodean AI seperti Claude Code dan Gemini CLI, Code Context adalah mesin yang memungkinkannya.</p>
<p>Mesin ini berjalan secara lokal, terintegrasi dengan alat dan lingkungan favorit Anda, seperti VS Code dan browser Chrome, dan memberikan pemahaman kode yang kuat tanpa bergantung pada platform sumber tertutup yang hanya ada di cloud.</p>
<p><strong>Kemampuan intinya meliputi:</strong></p>
<ul>
<li><p><strong>Pencarian Kode Semantik melalui Bahasa Alami:</strong> Temukan kode menggunakan bahasa Inggris biasa. Cari konsep seperti "verifikasi login pengguna" atau "logika pemrosesan pembayaran", dan Konteks Kode menemukan fungsi yang relevan-bahkan jika tidak sama persis dengan kata kunci.</p></li>
<li><p><strong>Dukungan Multi-Bahasa:</strong> Cari dengan lancar di 15+ bahasa pemrograman, termasuk JavaScript, Python, Java, dan Go, dengan pemahaman semantik yang konsisten di semua bahasa tersebut.</p></li>
<li><p><strong>Pemenggalan Kode Berbasis AST:</strong> Kode secara otomatis dipecah menjadi unit logis, seperti fungsi dan kelas, menggunakan penguraian AST, memastikan hasil pencarian lengkap, bermakna, dan tidak pernah terputus di tengah-tengah fungsi.</p></li>
<li><p><strong>Pengindeksan Langsung dan Bertahap:</strong> Perubahan kode diindeks dalam waktu nyata. Saat Anda mengedit file, indeks pencarian tetap diperbarui-tidak perlu penyegaran atau pengindeksan ulang secara manual.</p></li>
<li><p><strong>Sepenuhnya Lokal, Penerapan Aman:</strong> Jalankan semuanya di infrastruktur Anda sendiri. Code Context mendukung model lokal melalui Ollama dan pengindeksan melalui <a href="https://milvus.io/">Milvus</a>, sehingga kode Anda tidak akan pernah keluar dari lingkungan Anda.</p></li>
<li><p><strong>Integrasi IDE Kelas Satu:</strong> Ekstensi VSCode memungkinkan Anda mencari dan melompat ke hasil secara instan-langsung dari editor Anda, tanpa peralihan konteks.</p></li>
<li><p><strong>Dukungan Protokol MCP:</strong> Code Context berbicara MCP, membuatnya mudah untuk diintegrasikan dengan asisten pengkodean AI dan membawa pencarian semantik langsung ke dalam alur kerja mereka.</p></li>
<li><p><strong>Dukungan Plugin Browser:</strong> Cari repositori langsung dari GitHub di browser Anda-tanpa tab, tanpa salin-tempel, hanya konteks instan di mana pun Anda bekerja.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Cara Kerja Code Context</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context menggunakan arsitektur modular dengan orkestrator inti dan komponen khusus untuk penyematan, penguraian, penyimpanan, dan pengambilan.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">Modul Inti: Inti Konteks Kode</h3><p>Inti dari Code Context adalah <strong>Code Context Core</strong>, yang mengoordinasikan penguraian kode, penyematan, penyimpanan, dan pengambilan semantik:</p>
<ul>
<li><p><strong>Modul Pemrosesan Teks</strong> membagi dan mengurai kode menggunakan Tree-sitter untuk analisis AST yang sadar bahasa.</p></li>
<li><p><strong>Antarmuka Penyematan</strong> mendukung backend yang dapat dicolokkan - saat ini OpenAI dan VoyageAI - mengubah potongan kode menjadi penyematan vektor yang menangkap makna semantik dan hubungan kontekstualnya.</p></li>
<li><p><strong>Antarmuka Basis Data Vektor</strong> menyimpan penyematan ini dalam instance <a href="https://milvus.io/">Milvus</a> yang dihosting sendiri (secara default) atau di <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, versi terkelola Milvus.</p></li>
</ul>
<p>Semua ini disinkronkan dengan sistem file Anda secara terjadwal, memastikan indeks tetap mutakhir tanpa memerlukan intervensi manual.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Modul Ekstensi di atas Code Context Core</h3><ul>
<li><p><strong>Ekstensi VSCode</strong>: Integrasi IDE yang mulus untuk pencarian semantik dalam editor yang cepat dan lompat-ke-definisi.</p></li>
<li><p><strong>Ekstensi Chrome</strong>: Pencarian kode semantik sebaris saat menjelajahi repositori GitHub-tidak perlu berpindah tab.</p></li>
<li><p><strong>Server MCP</strong>: Mengekspos Konteks Kode ke asisten pengkodean AI apa pun melalui protokol MCP, sehingga memungkinkan bantuan yang sadar konteks secara real-time.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Memulai dengan Konteks Kode<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context dapat disambungkan ke alat pengkodean yang sudah Anda gunakan atau untuk membangun asisten pengkodean AI khusus dari awal. Di bagian ini, kita akan membahas kedua skenario tersebut:</p>
<ul>
<li><p>Cara mengintegrasikan Konteks Kode dengan alat yang sudah ada</p></li>
<li><p>Cara menyiapkan Modul Inti untuk pencarian kode semantik mandiri saat membuat asisten pengkodean AI Anda sendiri</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">Integrasi MCP</h3><p>Code Context mendukung <strong>Model Context Protocol (MCP)</strong>, yang memungkinkan agen pengkodean AI seperti Claude Code menggunakannya sebagai backend semantik.</p>
<p>Untuk berintegrasi dengan Claude Code:</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah dikonfigurasi, Claude Code akan secara otomatis memanggil Code Context untuk pencarian kode semantik bila diperlukan.</p>
<p>Untuk mengintegrasikan dengan alat atau lingkungan lain, lihat<a href="https://github.com/zilliztech/code-context"> repositori GitHub</a> kami untuk lebih banyak contoh dan adaptor.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Membangun Asisten Pengkodean AI Anda Sendiri dengan Code Context</h3><p>Untuk membuat asisten AI kustom menggunakan Code Context, Anda akan menyiapkan modul inti untuk pencarian kode semantik hanya dalam tiga langkah:</p>
<ol>
<li><p>Konfigurasikan model penyematan Anda</p></li>
<li><p>Hubungkan ke basis data vektor Anda</p></li>
<li><p>Mengindeks proyek Anda dan mulai mencari</p></li>
</ol>
<p>Berikut ini contoh menggunakan <strong>OpenAI Embeddings</strong> dan <strong>basis data vektor</strong> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> sebagai backend vektor:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">Ekstensi VSCode</h3><p>Code Context tersedia sebagai ekstensi VSCode bernama <strong>"Pencarian Kode Semantik",</strong> yang menghadirkan pencarian kode berbasis bahasa alami yang cerdas langsung ke editor Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah terinstal:</p>
<ul>
<li><p>Konfigurasikan kunci API Anda</p></li>
<li><p>Mengindeks proyek Anda</p></li>
<li><p>Gunakan kueri bahasa Inggris biasa (tidak perlu pencocokan yang sama persis)</p></li>
<li><p>Langsung ke hasil secara instan dengan klik-untuk-menavigasi</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hal ini menjadikan eksplorasi semantik sebagai bagian asli dari alur kerja pengkodean Anda-tidak perlu terminal atau browser.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Ekstensi Chrome (Segera Hadir)</h3><p><strong>Ekstensi Chrome</strong> kami yang akan datang menghadirkan Konteks Kode ke halaman web GitHub, sehingga Anda dapat menjalankan pencarian kode semantik secara langsung di dalam repositori publik mana pun-tidak perlu berpindah konteks atau membuka tab.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anda akan dapat menjelajahi basis kode yang tidak dikenal dengan kemampuan pencarian mendalam yang sama dengan yang Anda miliki secara lokal. Tetap disini-ekstensi ini sedang dalam pengembangan dan akan segera diluncurkan.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">Mengapa Menggunakan Konteks Kode?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Penyiapan dasar membuat Anda dapat bekerja dengan cepat, tetapi keunggulan <strong>Code Context</strong> ada pada lingkungan pengembangan yang profesional dan berkinerja tinggi. Fitur-fitur canggihnya dirancang untuk mendukung alur kerja yang serius, mulai dari penerapan skala perusahaan hingga perkakas AI khusus.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">Penerapan Pribadi untuk Keamanan Tingkat Perusahaan</h3><p>Code Context mendukung penerapan sepenuhnya secara offline menggunakan model penyematan lokal <strong>Ollama</strong> dan <strong>Milvus</strong> sebagai basis data vektor yang dihosting sendiri. Hal ini memungkinkan pipeline pencarian kode yang sepenuhnya bersifat privat: tidak ada panggilan API, tidak ada transmisi internet, dan tidak ada data yang keluar dari lingkungan lokal Anda.</p>
<p>Arsitektur ini ideal untuk industri dengan persyaratan kepatuhan yang ketat-seperti keuangan, pemerintahan, dan pertahanan-di mana kerahasiaan kode tidak dapat dinegosiasikan.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">Pengindeksan Waktu Nyata dengan Sinkronisasi File Cerdas</h3><p>Menjaga indeks kode Anda tetap mutakhir tidak seharusnya lambat atau manual. Code Context mencakup <strong>sistem pemantauan file berbasis Merkle Tree</strong> yang mendeteksi perubahan secara instan dan melakukan pembaruan bertahap secara real time.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dengan hanya mengindeks ulang file yang dimodifikasi, ini mengurangi waktu pembaruan untuk repositori besar dari beberapa menit menjadi beberapa detik. Hal ini memastikan kode yang baru saja Anda tulis sudah dapat dicari, tanpa perlu mengklik "refresh."</p>
<p>Dalam lingkungan pengembangan yang bergerak cepat, kesegeraan semacam itu sangat penting.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">Penguraian AST yang Memahami Kode Seperti yang Anda Lakukan</h3><p>Alat pencarian kode tradisional membagi teks berdasarkan baris atau jumlah karakter, sering kali memecah unit logika dan mengembalikan hasil yang membingungkan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context melakukan hal yang lebih baik. Ini menggunakan penguraian AST pengasuh pohon untuk memahami struktur kode yang sebenarnya. Ini mengidentifikasi fungsi, kelas, antarmuka, dan modul yang lengkap, memberikan hasil yang bersih dan lengkap secara semantik.</p>
<p>Ini mendukung bahasa pemrograman utama, termasuk JavaScript / TypeScript, Python, Java, C / C ++, Go, dan Rust, dengan strategi khusus bahasa untuk pemotongan yang akurat. Untuk bahasa yang tidak didukung, ia kembali ke penguraian berbasis aturan, memastikan penanganan yang anggun tanpa crash atau hasil kosong.</p>
<p>Unit kode terstruktur ini juga dimasukkan ke dalam metadata untuk pencarian semantik yang lebih akurat.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">Sumber Terbuka dan Dapat Diperluas dengan Desain</h3><p>Code Context sepenuhnya merupakan sumber terbuka di bawah lisensi MIT. Semua modul inti tersedia untuk umum di GitHub.</p>
<p>Kami percaya bahwa infrastruktur terbuka adalah kunci untuk membangun alat pengembang yang kuat dan dapat dipercaya-dan mengundang para pengembang untuk mengembangkannya untuk model, bahasa, atau kasus penggunaan yang baru.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">Memecahkan Masalah Jendela Konteks untuk Asisten AI</h3><p>Model bahasa besar (LLM) memiliki batas yang sulit: jendela konteks mereka. Hal ini membatasi mereka untuk melihat seluruh basis kode, yang mengurangi akurasi penyelesaian, perbaikan, dan saran.</p>
<p>Code Context membantu menjembatani kesenjangan itu. Pencarian kode semantiknya mengambil bagian kode <em>yang tepat</em>, memberikan asisten AI Anda konteks yang terfokus dan relevan untuk digunakan sebagai bahan pertimbangan. Hal ini meningkatkan kualitas output yang dihasilkan AI dengan membiarkan model "memperbesar" apa yang sebenarnya penting.</p>
<p>Alat pengkodean AI yang populer, seperti Claude Code dan Gemini CLI, tidak memiliki pencarian kode semantik asli-mereka mengandalkan heuristik berbasis kata kunci yang dangkal. Code Context, ketika diintegrasikan melalui <strong>MCP</strong>, memberi mereka peningkatan otak.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">Dibangun untuk Pengembang, oleh Pengembang</h3><p>Code Context dikemas untuk penggunaan ulang secara modular: setiap komponen tersedia sebagai paket <strong>npm</strong> independen. Anda dapat mencampur, mencocokkan, dan mengembangkannya sesuai kebutuhan proyek Anda.</p>
<ul>
<li><p>Hanya perlu pencarian kode semantik? Gunakan<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>Ingin menyambungkan ke agen AI? Tambahkan <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>Membuat alat IDE/peramban Anda sendiri? Contoh ekstensi VSCode dan Chrome kami</p></li>
</ul>
<p>Beberapa contoh aplikasi konteks kode:</p>
<ul>
<li><p><strong>Plugin pelengkapan otomatis</strong> yang<strong>sadar konteks</strong> yang menarik cuplikan yang relevan untuk penyelesaian LLM yang lebih baik</p></li>
<li><p><strong>Detektor bug cerdas</strong> yang mengumpulkan kode di sekitarnya untuk meningkatkan saran perbaikan</p></li>
<li><p><strong>Alat pemfaktoran ulang kode</strong> yang<strong>aman</strong> yang menemukan lokasi yang terkait secara semantik secara otomatis</p></li>
<li><p><strong>Visualisator arsitektur</strong> yang membangun diagram dari hubungan kode semantik</p></li>
<li><p><strong>Asisten tinjauan kode</strong> yang<strong>lebih cerdas</strong> yang menampilkan implementasi historis selama tinjauan PR</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">Selamat Datang di Komunitas Kami<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> lebih dari sekadar alat - ini adalah platform untuk mengeksplorasi bagaimana <strong>AI dan basis data vektor</strong> dapat bekerja sama untuk benar-benar memahami kode. Ketika pengembangan dengan bantuan AI menjadi hal yang biasa, kami yakin pencarian kode semantik akan menjadi kemampuan yang mendasar.</p>
<p>Kami menerima segala jenis kontribusi:</p>
<ul>
<li><p>Dukungan untuk bahasa baru</p></li>
<li><p>Backend model penyematan baru</p></li>
<li><p>Alur kerja dengan bantuan AI yang inovatif</p></li>
<li><p>Umpan balik, laporan bug, dan ide desain</p></li>
</ul>
<p>Temukan kami di sini:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Konteks Kode di GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>paket npm MCP</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>pasar VSCode</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>Bersama-sama, kita dapat membangun infrastruktur untuk alat pengembangan AI generasi berikutnya - transparan, kuat, dan mengutamakan pengembang.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
