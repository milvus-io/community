---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: >-
  Mengapa Saya Menentang Pengambilan Grep-Only Claude Code? Itu Hanya Membakar
  Terlalu Banyak Token
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  Pelajari bagaimana pengambilan kode berbasis vektor memangkas konsumsi token
  Claude Code hingga 40%. Solusi sumber terbuka dengan integrasi MCP yang mudah.
  Coba claude-context hari ini.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>Asisten pengkodean AI sedang meledak. Hanya dalam dua tahun terakhir, alat bantu seperti Cursor, Claude Code, Gemini CLI, dan Qwen Code telah berubah dari sekadar keingintahuan menjadi teman sehari-hari bagi jutaan pengembang. Namun, di balik perkembangan pesat ini, ada pertarungan yang terjadi karena sesuatu yang kelihatannya sederhana: <strong>bagaimana seharusnya asisten pengkodean AI benar-benar mencari konteks dalam basis kode Anda?</strong></p>
<p>Saat ini, ada dua pendekatan:</p>
<ul>
<li><p><strong>RAG yang didukung pencarian vektor</strong> (pencarian semantik).</p></li>
<li><p><strong>Pencarian kata kunci dengan grep</strong> (pencocokan string literal).</p></li>
</ul>
<p>Claude Code dan Gemini telah memilih yang terakhir. Faktanya, seorang insinyur Claude secara terbuka mengakui di Hacker News bahwa Claude Code tidak menggunakan RAG sama sekali. Sebaliknya, ia hanya memindai repo Anda baris demi baris (yang mereka sebut sebagai "pencarian agen") - tidak ada semantik, tidak ada struktur, hanya pencocokan string mentah.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pengungkapan itu memecah belah komunitas:</p>
<ul>
<li><p>Para<strong>pendukung</strong> membela kesederhanaan grep. Cepat, tepat, dan-yang paling penting-dapat diprediksi. Dengan pemrograman, mereka berpendapat, presisi adalah segalanya, dan penyematan saat ini masih terlalu kabur untuk dipercaya.</p></li>
<li><p>Para<strong>kritikus</strong> melihat grep sebagai jalan buntu. Ini menenggelamkan Anda dalam kecocokan yang tidak relevan, membakar token, dan menghambat alur kerja Anda. Tanpa pemahaman semantik, ini seperti meminta AI Anda untuk men-debug dengan mata tertutup.</p></li>
</ul>
<p>Kedua belah pihak ada benarnya. Dan setelah membangun dan menguji solusi saya sendiri, saya dapat mengatakan ini: pendekatan RAG berbasis pencarian vektor mengubah permainan. <strong>Tidak hanya membuat pencarian menjadi lebih cepat dan akurat, tetapi juga mengurangi penggunaan token hingga 40% atau lebih. (Loncat ke bagian Konteks Claude untuk mengetahui pendekatan saya)</strong></p>
<p>Jadi, mengapa grep sangat membatasi? Dan bagaimana pencarian vektor dapat memberikan hasil yang lebih baik dalam praktiknya? Mari kita bahas.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">Apa yang Salah dengan Pencarian Kode Grep-Only dari Claude Code?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Saya mengalami masalah ini ketika sedang melakukan debug pada sebuah masalah pelik. Claude Code menembakkan pertanyaan grep di repo saya, membuang gumpalan besar teks yang tidak relevan kepada saya. Satu menit berlalu, saya masih belum menemukan berkas yang relevan. Lima menit kemudian, akhirnya saya mendapatkan 10 baris yang tepat - tetapi terkubur dalam 500 baris noise.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Itu bukan kasus yang mudah. Membaca sekilas masalah GitHub Claude Code menunjukkan banyak pengembang yang frustrasi mengalami hal yang sama:</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>issue2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Rasa frustrasi komunitas bermuara pada tiga titik masalah:</p>
<ol>
<li><p><strong>Token membengkak.</strong> Setiap grep dump menyekop sejumlah besar kode yang tidak relevan ke dalam LLM, meningkatkan biaya yang berskala mengerikan dengan ukuran repo.</p></li>
<li><p><strong>Pajak waktu.</strong> Anda terjebak menunggu sementara AI memainkan dua puluh pertanyaan dengan basis kode Anda, membunuh fokus dan aliran.</p></li>
<li><p><strong>Konteks nol.</strong> Grep mencocokkan string literal. Ia tidak memiliki arti atau hubungan, jadi Anda secara efektif mencari dalam keadaan buta.</p></li>
</ol>
<p>Itulah mengapa perdebatan ini penting: grep bukan hanya "jadul", tetapi secara aktif menghambat pemrograman dengan bantuan AI.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">Claude Code vs Kursor: Mengapa yang Terakhir Memiliki Konteks Kode yang Lebih Baik<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam hal konteks kode, Cursor telah melakukan pekerjaan yang lebih baik. Sejak hari pertama, Cursor telah bersandar pada <strong>pengindeksan basis kode</strong>: memecah repo Anda menjadi potongan-potongan yang bermakna, menyematkan potongan-potongan itu ke dalam vektor, dan mengambilnya secara semantik kapan pun AI membutuhkan konteks. Ini adalah buku teks Retrieval-Augmented Generation (RAG) yang diterapkan pada kode, dan hasilnya berbicara sendiri: konteks yang lebih ketat, lebih sedikit token yang terbuang, dan pengambilan yang lebih cepat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Code, sebaliknya, telah menggandakan kesederhanaan. Tidak ada indeks, tidak ada penyematan-hanya grep. Itu berarti setiap pencarian adalah pencocokan string secara harfiah, tanpa pemahaman tentang struktur atau semantik. Secara teori memang cepat, tetapi dalam praktiknya, para pengembang sering kali harus memilah-milah tumpukan jerami yang tidak relevan sebelum menemukan satu jarum yang benar-benar mereka butuhkan.</p>
<table>
<thead>
<tr><th></th><th><strong>Kode Claude</strong></th><th><strong>Kursor</strong></th></tr>
</thead>
<tbody>
<tr><td>Akurasi Pencarian</td><td>Hanya memunculkan pencocokan yang sama persis-melewatkan apa pun yang diberi nama berbeda.</td><td>Menemukan kode yang relevan secara semantik bahkan ketika kata kunci tidak sama persis.</td></tr>
<tr><td>Efisiensi</td><td>Grep membuang gumpalan kode yang sangat besar ke dalam model, sehingga meningkatkan biaya token.</td><td>Potongan yang lebih kecil dan bersinyal lebih tinggi mengurangi beban token hingga 30-40%.</td></tr>
<tr><td>Skalabilitas</td><td>Grep ulang repo setiap saat, yang melambat seiring pertumbuhan proyek.</td><td>Mengindeks sekali, lalu mengambil dalam skala besar dengan jeda minimal.</td></tr>
<tr><td>Filosofi</td><td>Tetap minimal-tidak ada infrastruktur tambahan.</td><td>Mengindeks semuanya, mengambil dengan cerdas.</td></tr>
</tbody>
</table>
<p>Jadi mengapa Claude (atau Gemini, atau Cline) tidak mengikuti jejak Cursor? Alasannya sebagian bersifat teknis dan sebagian lagi bersifat kultural. <strong>Pengambilan vektor bukanlah hal yang sepele-Anda harus menyelesaikan chunking, pembaruan tambahan, dan pengindeksan skala besar.</strong> Namun yang lebih penting lagi, Claude Code dibangun dengan minimalis: tidak ada server, tidak ada indeks, hanya CLI yang bersih. Penyematan dan DB vektor tidak sesuai dengan filosofi desain tersebut.</p>
<p>Kesederhanaan itu menarik - tetapi juga membatasi batas kemampuan Claude Code. Kesediaan Cursor untuk berinvestasi dalam infrastruktur pengindeksan yang nyata adalah alasan mengapa ia terasa lebih kuat saat ini.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context: Proyek Sumber Terbuka untuk Menambahkan Pencarian Kode Semantik ke Claude Code<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code adalah alat yang kuat-tetapi memiliki konteks kode yang buruk. Cursor memecahkan masalah ini dengan pengindeksan basis kode, tetapi Cursor adalah sumber tertutup, terkunci di balik langganan, dan mahal untuk individu atau tim kecil.</p>
<p>Kesenjangan itulah yang menyebabkan kami mulai membangun solusi sumber terbuka kami sendiri: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>.</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> adalah plugin MCP sumber terbuka yang menghadirkan <strong>pencarian kode semantik</strong> ke Claude Code (dan agen pengkodean AI lainnya yang menggunakan MCP). Alih-alih memaksa repo Anda dengan grep, plugin ini mengintegrasikan basis data vektor dengan model penyematan untuk memberikan <em>konteks yang mendalam dan ditargetkan kepada</em> LLM dari seluruh basis kode Anda. Hasilnya: pengambilan yang lebih tajam, lebih sedikit token yang terbuang, dan pengalaman pengembang yang jauh lebih baik.</p>
<p>Inilah cara kami membangunnya:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">Teknologi yang Kami Gunakan</h3><p><strong>🔌 Lapisan Antarmuka: MCP sebagai Konektor Universal</strong></p>
<p>Kami ingin ini berfungsi di mana saja - tidak hanya di Claude. MCP (Model Context Protocol) bertindak seperti standar USB untuk LLM, sehingga alat eksternal dapat terhubung dengan mulus. Dengan mengemas Claude Context sebagai server MCP, ia bekerja tidak hanya dengan Claude Code tetapi juga dengan Gemini CLI, Qwen Code, Cline, dan bahkan Cursor.</p>
<p><strong>🗄️ Basis Data Vektor: Zilliz Cloud</strong></p>
<p>Untuk tulang punggung, kami memilih <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (layanan terkelola penuh yang dibangun di atas <a href="https://milvus.io/">Milvus</a>). Layanan ini berkinerja tinggi, cloud-native, elastis, dan dirancang untuk beban kerja AI seperti pengindeksan basis kode. Ini berarti pengambilan dengan latensi rendah, skala yang hampir tak terbatas, dan keandalan yang sangat kuat.</p>
<p><strong>🧩 Model Penyematan: Fleksibel berdasarkan DesainTim yang berbeda</strong>memiliki kebutuhan yang berbeda, sehingga Claude Context mendukung beberapa penyedia penyematan di luar kotak:</p>
<ul>
<li><p>Penyematan<strong>OpenAI</strong> untuk stabilitas dan adopsi yang luas.</p></li>
<li><p>Penyematan<strong>Voyage</strong> untuk kinerja khusus kode.</p></li>
<li><p><strong>Ollama</strong> untuk penerapan lokal yang mengutamakan privasi.</p></li>
</ul>
<p>Model tambahan dapat dimasukkan seiring dengan perkembangan kebutuhan.</p>
<p><strong>💻 Pilihan Bahasa: TypeScript</strong></p>
<p>Kami memperdebatkan Python vs TypeScript. TypeScript menang - tidak hanya untuk kompatibilitas tingkat aplikasi (plugin VSCode, web tooling) tetapi juga karena Claude Code dan Gemini CLI sendiri berbasis TypeScript. Hal ini membuat integrasi menjadi lancar dan membuat ekosistem tetap koheren.</p>
<h3 id="System-Architecture" class="common-anchor-header">Arsitektur Sistem</h3><p>Claude Context mengikuti desain yang bersih dan berlapis:</p>
<ul>
<li><p><strong>Modul inti</strong> menangani pekerjaan berat: penguraian kode, pemotongan kode, pengindeksan, pengambilan, dan sinkronisasi.</p></li>
<li><p><strong>Antarmuka pengguna</strong> menangani integrasi-server MCP, plugin VSCode, atau adapter lainnya.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pemisahan ini membuat mesin inti dapat digunakan kembali di lingkungan yang berbeda sambil membiarkan integrasi berkembang dengan cepat saat asisten pengkodean AI baru muncul.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">Implementasi Modul Inti</h3><p>Modul inti membentuk fondasi seluruh sistem. Modul-modul ini mengabstraksikan basis data vektor, model penyematan, dan komponen lainnya ke dalam modul-modul yang dapat disusun yang membuat objek Konteks, memungkinkan basis data vektor yang berbeda dan model penyematan untuk skenario yang berbeda.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">Memecahkan Tantangan Teknis Utama<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>Membangun Claude Context bukan hanya tentang memasang kabel embedding dan DB vektor. Pekerjaan yang sesungguhnya adalah memecahkan masalah sulit yang membuat atau menghancurkan pengindeksan kode dalam skala besar. Berikut adalah cara kami mendekati tiga tantangan terbesar:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">Tantangan 1: Pemotongan Kode Cerdas</h3><p>Kode tidak bisa hanya dibagi berdasarkan baris atau karakter. Hal ini akan menciptakan fragmen-fragmen yang berantakan dan tidak lengkap serta menghilangkan logika yang membuat kode dapat dimengerti.</p>
<p>Kami memecahkan masalah ini dengan <strong>dua strategi yang saling melengkapi</strong>:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">Pemenggalan Berbasis AST (Strategi Utama)</h4><p>Ini adalah pendekatan default, menggunakan pengurai tree-sitter untuk memahami struktur sintaks kode dan memisah-misahkannya berdasarkan batasan semantik: fungsi, kelas, metode. Hal ini memberikan:</p>
<ul>
<li><p><strong>Kelengkapan sintaks</strong> - tidak ada fungsi yang terpotong atau deklarasi yang rusak.</p></li>
<li><p><strong>Koherensi logis</strong> - logika yang terkait tetap bersama untuk pengambilan semantik yang lebih baik.</p></li>
<li><p><strong>Dukungan multi-bahasa</strong> - bekerja di JS, Python, Java, Go, dan banyak lagi melalui tata bahasa pengasuh pohon.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">Pemisahan Teks LangChain (Strategi Mundur)</h4><p>Untuk bahasa yang tidak dapat diuraikan oleh AST atau ketika penguraian gagal, <code translate="no">RecursiveCharacterTextSplitter</code> milik LangChain menyediakan cadangan yang dapat diandalkan.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>Strategi ini kurang "cerdas" dibandingkan AST, tetapi sangat dapat diandalkan-memastikan para pengembang tidak akan pernah terlantar. Bersama-sama, kedua strategi ini menyeimbangkan kekayaan semantik dengan penerapan universal.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">Tantangan 2: Menangani Perubahan Kode Secara Efisien</h3><p>Mengelola perubahan kode merupakan salah satu tantangan terbesar dalam sistem pengindeksan kode. Mengindeks ulang seluruh proyek untuk modifikasi file kecil akan sangat tidak praktis.</p>
<p>Untuk mengatasi masalah ini, kami membangun mekanisme sinkronisasi berbasis Pohon Merkle.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Pohon Merkle: Fondasi Deteksi Perubahan</h4><p>Pohon Merkle membuat sistem "sidik jari" hirarkis di mana setiap file memiliki sidik jari hash-nya sendiri, folder memiliki sidik jari berdasarkan isinya, dan semuanya berujung pada sidik jari simpul akar yang unik untuk seluruh basis kode.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ketika konten file berubah, sidik jari hash mengalir ke atas melalui setiap lapisan menuju simpul akar. Hal ini memungkinkan deteksi perubahan yang cepat dengan membandingkan sidik jari hash lapis demi lapis dari root ke bawah, dengan cepat mengidentifikasi dan melokalisasi modifikasi file tanpa pengindeksan ulang proyek secara penuh.</p>
<p>Sistem ini melakukan pemeriksaan sinkronisasi jabat tangan setiap 5 menit menggunakan proses tiga fase yang efisien:</p>
<p><strong>Fase 1: Deteksi Secepat Kilat</strong> menghitung hash akar Merkle seluruh basis kode dan membandingkannya dengan snapshot sebelumnya. Root hash yang identik berarti tidak ada perubahan yang terjadi-sistem melewatkan semua pemrosesan dalam milidetik.</p>
<p><strong>Tahap 2: Perbandingan Tepat</strong> memicu ketika hash root berbeda, melakukan analisis tingkat file yang terperinci untuk mengidentifikasi dengan tepat file mana yang ditambahkan, dihapus, atau dimodifikasi.</p>
<p><strong>Tahap 3: Pembaruan Tambahan</strong> menghitung ulang vektor hanya untuk file yang diubah dan memperbarui basis data vektor yang sesuai, sehingga memaksimalkan efisiensi.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">Manajemen Snapshot Lokal</h4><p>Semua status sinkronisasi tetap ada secara lokal di direktori <code translate="no">~/.context/merkle/</code> pengguna. Setiap basis kode memelihara file snapshot independennya sendiri yang berisi tabel hash file dan data pohon Merkle yang diserialisasikan, memastikan pemulihan status yang akurat bahkan setelah program dimulai ulang.</p>
<p>Desain ini memberikan manfaat yang jelas: sebagian besar pemeriksaan selesai dalam hitungan milidetik ketika tidak ada perubahan, hanya file yang benar-benar dimodifikasi yang memicu pemrosesan ulang (menghindari pemborosan komputasi yang sangat besar), dan pemulihan status bekerja dengan sempurna di seluruh sesi program.</p>
<p>Dari perspektif pengalaman pengguna, memodifikasi satu fungsi memicu pengindeksan ulang hanya untuk file tersebut, bukan keseluruhan proyek, yang secara dramatis meningkatkan efisiensi pengembangan.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">Tantangan 3: Merancang Antarmuka MCP</h3><p>Bahkan mesin pengindeksan yang paling cerdas pun tidak berguna tanpa antarmuka yang mudah digunakan oleh pengembang. MCP adalah pilihan yang jelas, tetapi ini memberikan tantangan yang unik:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 Desain Alat: Tetap Sederhana</strong></h4><p>Modul MCP berfungsi sebagai antarmuka yang berhadapan langsung dengan pengguna, menjadikan pengalaman pengguna sebagai prioritas utama.</p>
<p>Desain alat dimulai dengan mengabstraksikan pengindeksan basis kode standar dan operasi pencarian ke dalam dua alat utama: <code translate="no">index_codebase</code> untuk pengindeksan basis kode dan <code translate="no">search_code</code> untuk pencarian kode.</p>
<p>Hal ini menimbulkan pertanyaan penting: alat bantu tambahan apa saja yang diperlukan?</p>
<p>Jumlah alat bantu memerlukan keseimbangan yang cermat - terlalu banyak alat bantu akan menimbulkan beban kognitif dan membingungkan pemilihan alat bantu LLM, sementara terlalu sedikit alat bantu akan menghilangkan fungsi-fungsi penting.</p>
<p>Bekerja mundur dari kasus penggunaan dunia nyata membantu menjawab pertanyaan ini.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">Mengatasi Tantangan Pemrosesan Latar Belakang</h4><p>Basis kode yang besar dapat memakan waktu yang cukup lama untuk diindeks. Pendekatan naif dengan menunggu penyelesaian secara sinkron memaksa pengguna untuk menunggu beberapa menit, yang tidak dapat diterima. Pemrosesan latar belakang asinkron menjadi penting, tetapi MCP tidak mendukung pola ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Server MCP kami menjalankan proses latar belakang di dalam server MCP untuk menangani pengindeksan sambil segera mengembalikan pesan startup kepada pengguna, sehingga mereka dapat terus bekerja.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Hal ini menciptakan tantangan baru: bagaimana pengguna melacak kemajuan pengindeksan?</p>
<p>Alat khusus untuk menanyakan kemajuan atau status pengindeksan memecahkan masalah ini dengan elegan. Proses pengindeksan di latar belakang secara asinkron menyimpan informasi kemajuan secara cache, sehingga pengguna dapat memeriksa persentase penyelesaian, status keberhasilan, atau kondisi kegagalan kapan saja. Selain itu, alat bantu kliring indeks manual menangani situasi di mana pengguna perlu mengatur ulang indeks yang tidak akurat atau memulai kembali proses pengindeksan.</p>
<p><strong>Desain Alat Bantu Akhir:</strong></p>
<p><code translate="no">index_codebase</code> - Basis kode indeks<code translate="no">search_code</code> - Kode pencarian<code translate="no">get_indexing_status</code> - Status pengindeksan kueri<code translate="no">clear_index</code> - Hapus indeks</p>
<p>Empat alat yang memberikan keseimbangan sempurna antara kesederhanaan dan fungsionalitas.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">🔹 Manajemen Variabel Lingkungan</h4><p>Manajemen variabel lingkungan sering kali diabaikan meskipun secara signifikan memengaruhi pengalaman pengguna. Membutuhkan konfigurasi kunci API yang terpisah untuk setiap Klien MCP akan memaksa pengguna untuk mengonfigurasi kredensial beberapa kali saat beralih antara Claude Code dan Gemini CLI.</p>
<p>Pendekatan konfigurasi global menghilangkan gesekan ini dengan membuat file <code translate="no">~/.context/.env</code> di direktori home pengguna:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>Pendekatan ini memberikan manfaat yang jelas:</strong> pengguna mengonfigurasi sekali dan menggunakan di mana saja di semua klien MCP, semua konfigurasi terpusat di satu lokasi untuk memudahkan pemeliharaan, dan kunci API yang sensitif tidak tersebar di beberapa file konfigurasi.</p>
<p>Kami juga mengimplementasikan hirarki prioritas tiga tingkat: variabel lingkungan proses memiliki prioritas tertinggi, file konfigurasi global memiliki prioritas menengah, dan nilai default berfungsi sebagai cadangan.</p>
<p>Desain ini menawarkan fleksibilitas yang luar biasa: pengembang dapat menggunakan variabel lingkungan untuk penggantian pengujian sementara, lingkungan produksi dapat menyuntikkan konfigurasi sensitif melalui variabel lingkungan sistem untuk meningkatkan keamanan, dan pengguna mengonfigurasi satu kali untuk bekerja dengan lancar di seluruh Claude Code, Gemini CLI, dan alat lainnya.</p>
<p>Pada titik ini, arsitektur inti server MCP telah lengkap, mencakup penguraian kode dan penyimpanan vektor melalui pengambilan cerdas dan manajemen konfigurasi. Setiap komponen telah dirancang dan dioptimalkan dengan cermat untuk menciptakan sistem yang tangguh dan mudah digunakan.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">Pengujian Langsung<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Jadi, bagaimana kinerja Claude Context dalam praktiknya? Saya mengujinya dengan skenario perburuan bug yang sama persis dengan yang awalnya membuat saya frustrasi.</p>
<p>Instalasi hanya satu perintah sebelum meluncurkan Claude Code:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Setelah basis kode saya diindeks, saya memberikan deskripsi bug yang sama kepada Claude Code yang sebelumnya telah mengirimkannya dalam pengejaran selama <strong>lima menit dengan grep.</strong> Kali ini, melalui panggilan <code translate="no">claude-context</code> MCP <strong>langsung menunjukkan file dan nomor baris yang tepat</strong>, lengkap dengan penjelasan masalahnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Perbedaannya tidak terlalu kentara - siang dan malam.</p>
<p>Dan itu bukan hanya perburuan bug. Dengan Claude Context yang terintegrasi, Claude Code secara konsisten memberikan hasil yang lebih berkualitas:</p>
<ul>
<li><p><strong>Penyelesaian masalah</strong></p></li>
<li><p><strong>Pemfaktoran ulang kode</strong></p></li>
<li><p><strong>Deteksi kode duplikat</strong></p></li>
<li><p><strong>Pengujian komprehensif</strong></p></li>
</ul>
<p>Peningkatan kinerja juga terlihat dalam angka. Dalam pengujian berdampingan:</p>
<ul>
<li><p>Penggunaan token turun lebih dari 40%, tanpa kehilangan penarikan.</p></li>
<li><p>Hal ini berarti biaya API yang lebih rendah dan respons yang lebih cepat.</p></li>
<li><p>Atau, dengan anggaran yang sama, Claude Context memberikan pengambilan yang jauh lebih akurat.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kami memiliki Claude Context yang bersumber terbuka di GitHub, dan telah mendapatkan 2,6 ribu+ bintang. Terima kasih atas dukungan dan suka Anda.</p>
<p>Anda dapat mencobanya sendiri:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>Tolok ukur terperinci dan metodologi pengujian tersedia di repo-kami sangat mengharapkan umpan balik Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">Melihat ke Depan<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Apa yang dimulai sebagai rasa frustrasi dengan grep di Claude Code telah berkembang menjadi solusi yang solid: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context-sebuah</strong></a>plugin MCP sumber terbuka yang menghadirkan pencarian semantik dan bertenaga vektor ke Claude Code dan asisten pengkodean lainnya. Pesannya sederhana: pengembang tidak harus puas dengan peralatan AI yang tidak efisien. Dengan RAG dan pengambilan vektor, Anda dapat men-debug lebih cepat, memangkas biaya token hingga 40%, dan akhirnya mendapatkan bantuan AI yang benar-benar memahami basis kode Anda.</p>
<p>Dan ini tidak terbatas pada Claude Code. Karena Claude Context dibangun di atas standar terbuka, pendekatan yang sama bekerja dengan mulus dengan Gemini CLI, Qwen Code, Cursor, Cline, dan lainnya. Tidak perlu lagi terjebak dalam pertukaran vendor yang memprioritaskan kesederhanaan daripada kinerja.</p>
<p>Kami ingin Anda menjadi bagian dari masa depan itu:</p>
<ul>
<li><p><strong>Coba</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a><strong>:</strong> ini adalah sumber terbuka dan sepenuhnya gratis</p></li>
<li><p><strong>Berkontribusi pada pengembangannya</strong></p></li>
<li><p><strong>Atau buat solusi Anda sendiri</strong> menggunakan Claude Context</p></li>
</ul>
<p>👉 Bagikan umpan balik Anda, ajukan pertanyaan, atau dapatkan bantuan dengan bergabung dengan <a href="https://discord.com/invite/8uyFbECzPX"><strong>komunitas Discord</strong></a> kami.</p>
