---
id: claude-context-reduce-claude-code-token-usage.md
title: >-
  Konteks Claude: Kurangi Penggunaan Token Kode Claude dengan Pengambilan Kode
  Bertenaga Milvus
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  Kode Claude membakar token di grep? Lihat bagaimana Claude Context menggunakan
  pengambilan hibrida yang didukung Milvus untuk memangkas penggunaan token
  hingga 39,4%.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>Jendela konteks yang besar membuat agen pengkodean AI merasa tidak terbatas, hingga mereka mulai membaca setengah repositori Anda untuk menjawab satu pertanyaan. Bagi banyak pengguna Claude Code, bagian yang mahal bukan hanya penalaran model. Melainkan perulangan pengambilan: mencari kata kunci, membaca file, mencari lagi, membaca lebih banyak file, dan terus membayar untuk konteks yang tidak relevan.</p>
<p>Claude Context adalah server MCP pengambilan kode sumber terbuka yang memberikan Claude Code dan agen pengkodean AI lainnya cara yang lebih baik untuk menemukan kode yang relevan. Server ini mengindeks repositori Anda, menyimpan potongan kode yang dapat dicari dalam <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a>, dan menggunakan <a href="https://zilliz.com/blog/hybrid-search-with-milvus">pengambilan hibrida</a> sehingga agen dapat mengambil kode yang benar-benar dibutuhkan alih-alih membanjiri prompt dengan hasil grep.</p>
<p>Dalam tolok ukur kami, Claude Context mengurangi konsumsi token sebesar 39,4% secara rata-rata dan mengurangi pemanggilan alat sebesar 36,1% sambil mempertahankan kualitas pengambilan. Postingan ini menjelaskan mengapa pengambilan gaya grep memboroskan konteks, cara kerja Claude Context di balik layar, dan bagaimana perbandingannya dengan alur kerja dasar pada tugas-tugas debugging yang sebenarnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>Repositori Claude Context GitHub yang sedang tren dan melewati 10.000 bintang</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">Mengapa pengambilan kode gaya grep membakar token di agen pengkodean AI<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Agen pengkodean AI hanya dapat menulis kode yang berguna jika memahami basis kode di sekitar tugas: jalur pemanggilan fungsi, konvensi penamaan, pengujian terkait, model data, dan pola implementasi historis. Jendela konteks yang besar membantu, tetapi tidak menyelesaikan masalah pengambilan. Jika file yang salah masuk ke dalam konteks, model masih membuang token dan mungkin menalar dari kode yang tidak relevan.</p>
<p>Pengambilan kode biasanya terbagi menjadi dua pola besar:</p>
<table>
<thead>
<tr><th>Pola pengambilan</th><th>Bagaimana cara kerjanya</th><th>Di mana ia rusak</th></tr>
</thead>
<tbody>
<tr><td>Pengambilan dengan gaya grep</td><td>Mencari string literal, lalu membaca file atau rentang baris yang cocok.</td><td>Melewatkan kode yang terkait secara semantik, mengembalikan kecocokan yang berisik, dan sering kali membutuhkan siklus pencarian/pembacaan berulang.</td></tr>
<tr><td>Pengambilan gaya RAG</td><td>Mengindeks kode terlebih dahulu, lalu mengambil potongan yang relevan dengan pencarian semantik, leksikal, atau hibrida.</td><td>Membutuhkan chunking, embedding, pengindeksan, dan logika pembaruan yang tidak ingin dimiliki oleh sebagian besar alat pengkodean secara langsung.</td></tr>
</tbody>
</table>
<p>Ini adalah perbedaan yang sama yang dilihat oleh para pengembang dalam desain <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">aplikasi RAG</a>: pencocokan harfiah memang berguna, tetapi jarang sekali cukup ketika makna menjadi penting. Sebuah fungsi bernama <code translate="no">compute_final_cost()</code> mungkin relevan dengan kueri tentang <code translate="no">calculate_total_price()</code> meskipun kata-katanya tidak sama persis. Di situlah <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">pencarian semantik</a> membantu.</p>
<p>Dalam satu proses debug, Claude Code berulang kali mencari dan membaca file sebelum menemukan area yang tepat. Setelah beberapa menit, hanya sebagian kecil dari kode yang telah digunakannya yang relevan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>Pencarian gaya grep Claude Code menghabiskan waktu untuk membaca file yang tidak relevan</span> </span></p>
<p>Pola tersebut cukup umum sehingga pengembang mengeluhkannya secara publik: agen bisa jadi pintar, tetapi perulangan pengambilan konteks masih terasa mahal dan tidak tepat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>Komentar pengembang tentang konteks Claude Code dan penggunaan token</span> </span></p>
<p>Pengambilan gaya Grep gagal dalam tiga cara yang dapat diprediksi:</p>
<ul>
<li><strong>Kelebihan informasi:</strong> repositori besar menghasilkan banyak kecocokan literal, dan sebagian besar tidak berguna untuk tugas saat ini.</li>
<li><strong>Kebutaan semantik:</strong> grep mencocokkan string, bukan maksud, perilaku, atau pola implementasi yang setara.</li>
<li><strong>Kehilangan konteks:</strong> pencocokan pada level baris tidak secara otomatis menyertakan kelas, dependensi, tes, atau grafik pemanggilan di sekitarnya.</li>
</ul>
<p>Lapisan pengambilan kode yang lebih baik perlu menggabungkan ketepatan kata kunci dengan pemahaman semantik, kemudian mengembalikan potongan yang cukup lengkap agar model dapat menalar kode.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">Apa yang dimaksud dengan Claude Context?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context adalah server <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Protokol Konteks Model</a> sumber terbuka untuk pengambilan kode. Server ini menghubungkan alat pengkodean AI ke indeks kode yang didukung Milvus, sehingga agen dapat mencari repositori berdasarkan makna alih-alih hanya mengandalkan pencarian teks harfiah.</p>
<p>Tujuannya sederhana: ketika agen meminta konteks, kembalikan potongan kode terkecil yang berguna. Claude Context melakukan hal ini dengan mem-parsing basis kode, menghasilkan embedding, menyimpan potongan kode dalam <a href="https://zilliz.com/what-is-milvus">basis data vektor Milvus</a>, dan mengekspos pengambilan melalui alat yang kompatibel dengan MCP.</p>
<table>
<thead>
<tr><th>Masalah Grep</th><th>Pendekatan Konteks Claude</th></tr>
</thead>
<tbody>
<tr><td>Terlalu banyak kecocokan yang tidak relevan</td><td>Mengurutkan potongan kode berdasarkan kemiripan vektor dan relevansi kata kunci.</td></tr>
<tr><td>Tidak ada pemahaman semantik</td><td>Gunakan <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">model penyematan</a> sehingga implementasi terkait dapat cocok meskipun namanya berbeda.</td></tr>
<tr><td>Konteks sekitar yang hilang</td><td>Kembalikan potongan kode lengkap dengan struktur yang cukup agar model dapat memahami perilaku.</td></tr>
<tr><td>Pembacaan berkas yang berulang-ulang</td><td>Cari indeks terlebih dahulu, lalu baca atau edit hanya file yang penting.</td></tr>
</tbody>
</table>
<p>Karena Claude Context diekspos melalui MCP, ia dapat bekerja dengan Claude Code, Gemini CLI, host MCP gaya kursor, dan lingkungan yang kompatibel dengan MCP lainnya. Lapisan pengambilan inti yang sama dapat mendukung beberapa antarmuka agen.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Bagaimana Claude Context bekerja di balik layar<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context memiliki dua lapisan utama: modul inti yang dapat digunakan kembali dan modul integrasi. Inti menangani penguraian, pemotongan, pengindeksan, pencarian, dan sinkronisasi tambahan. Lapisan atas memperlihatkan kemampuan tersebut melalui integrasi MCP dan editor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>Arsitektur Claude Context yang menunjukkan integrasi MCP, modul inti, penyedia penyematan, dan basis data vektor</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">Bagaimana MCP menghubungkan Claude Context ke agen pengkodean?</h3><p>MCP menyediakan antarmuka antara host LLM dan alat eksternal. Dengan mengekspos Claude Context sebagai server MCP, lapisan pengambilan tetap independen dari satu IDE atau asisten pengkodean. Agen memanggil alat pencarian; Claude Context menangani indeks kode dan mengembalikan potongan yang relevan.</p>
<p>Jika Anda ingin memahami pola yang lebih luas, <a href="https://milvus.io/docs/milvus_and_mcp.md">panduan MCP + Milvus</a> menunjukkan bagaimana MCP dapat menghubungkan alat AI ke operasi basis data vektor.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">Mengapa menggunakan Milvus untuk pengambilan kode?</h3><p>Pengambilan kode membutuhkan pencarian vektor yang cepat, pemfilteran metadata, dan skala yang cukup untuk menangani repositori yang besar. Milvus dirancang untuk pencarian vektor berkinerja tinggi dan dapat mendukung vektor padat, vektor jarang, dan alur kerja pengurutan ulang. Untuk tim yang membangun sistem agen dengan pencarian yang berat, dokumen <a href="https://milvus.io/docs/multi-vector-search.md">pencarian hibrida multi-vektor</a> dan <a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">PyMilvus hybrid_search API</a> menunjukkan pola pencarian yang sama dengan yang digunakan dalam sistem produksi.</p>
<p>Claude Context dapat menggunakan Zilliz Cloud sebagai backend Milvus yang dikelola, yang menghindari menjalankan dan menskalakan basis data vektor sendiri. Arsitektur yang sama juga dapat diadaptasi untuk penerapan Milvus yang dikelola sendiri.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Penyedia embedding mana yang didukung oleh Claude Context?</h3><p>Claude Context mendukung beberapa opsi penyematan:</p>
<table>
<thead>
<tr><th>Penyedia</th><th>Paling cocok</th></tr>
</thead>
<tbody>
<tr><td>Penyematan OpenAI</td><td>Penyematan yang dihosting untuk tujuan umum dengan dukungan ekosistem yang luas.</td></tr>
<tr><td>Penyematan Voyage AI</td><td>Pengambilan berorientasi kode, terutama ketika kualitas pencarian penting.</td></tr>
<tr><td>Ollama</td><td>Alur kerja penyematan lokal untuk lingkungan yang sensitif terhadap privasi.</td></tr>
</tbody>
</table>
<p>Untuk alur kerja Milvus yang terkait, lihat <a href="https://milvus.io/docs/embeddings.md">ikhtisar penyematan Milvus</a>, <a href="https://milvus.io/docs/embed-with-openai.md">integrasi penyematan OpenAI</a>, <a href="https://milvus.io/docs/embed-with-voyage.md">integrasi penyematan Voyage</a>, dan contoh menjalankan <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Ollama dengan Milvus</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">Mengapa pustaka inti ditulis dalam TypeScript?</h3><p>Claude Context ditulis dalam TypeScript karena banyak integrasi agen pengkodean, plugin editor, dan host MCP yang sudah menggunakan TypeScript. Mempertahankan inti pengambilan dalam TypeScript membuatnya lebih mudah untuk diintegrasikan dengan perkakas lapisan aplikasi sambil tetap mengekspos API yang bersih.</p>
<p>Modul inti mengabstraksikan basis data vektor dan penyedia penyematan ke dalam objek <code translate="no">Context</code> yang dapat dikomposisikan:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Bagaimana Claude Context memotong kode dan menjaga indeks tetap segar<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>Pemenggalan dan pembaruan inkremental menentukan apakah sistem pengambilan kode dapat digunakan dalam praktiknya. Jika potongan kode terlalu kecil, model akan kehilangan konteks. Jika potongan terlalu besar, sistem pengambilan mengembalikan noise. Jika pengindeksan terlalu lambat, pengembang berhenti menggunakannya.</p>
<p>Claude Context menangani hal ini dengan pemotongan berbasis AST, pemisah teks fallback, dan deteksi perubahan berbasis pohon Merkle.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">Bagaimana cara pemotongan kode berbasis AST mempertahankan konteks?</h3><p>Pemenggalan AST adalah strategi utama. Alih-alih memisahkan file berdasarkan jumlah baris atau jumlah karakter, Claude Context mengurai struktur kode dan potongan di sekitar unit semantik seperti fungsi, kelas, dan metode.</p>
<p>Hal ini memberikan setiap potongan tiga properti yang berguna:</p>
<table>
<thead>
<tr><th>Properti</th><th>Mengapa ini penting</th></tr>
</thead>
<tbody>
<tr><td>Kelengkapan sintaksis</td><td>Fungsi dan kelas tidak terpecah di tengah.</td></tr>
<tr><td>Koherensi logis</td><td>Logika yang terkait tetap bersama, sehingga potongan yang diambil lebih mudah digunakan oleh model.</td></tr>
<tr><td>Dukungan multi-bahasa</td><td>Parser pengasuh pohon yang berbeda dapat menangani JavaScript, Python, Java, Go, dan bahasa lainnya.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>Pemenggalan kode berbasis AST mempertahankan unit sintaksis yang lengkap dan hasil pemenggalan</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">Apa yang terjadi jika penguraian AST gagal?</h3><p>Untuk bahasa atau berkas yang tidak dapat ditangani oleh penguraian AST, Claude Context kembali ke LangChain's <code translate="no">RecursiveCharacterTextSplitter</code>. Ini kurang tepat dibandingkan dengan penguraian AST, tetapi mencegah pengindeksan gagal pada masukan yang tidak didukung.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Bagaimana Claude Context menghindari pengindeksan ulang seluruh repositori?</h3><p>Mengindeks ulang seluruh repositori setelah setiap perubahan terlalu mahal. Claude Context menggunakan pohon Merkle untuk mendeteksi dengan tepat apa yang berubah.</p>
<p>Pohon Merkle memberikan hash pada setiap berkas, menurunkan hash direktori dari anak-anaknya, dan menggulung seluruh repositori ke dalam hash root. Jika hash root tidak berubah, Claude Context dapat melewatkan pengindeksan. Jika root berubah, ia akan menyusuri pohon untuk menemukan berkas yang berubah dan menyematkan kembali berkas tersebut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>Deteksi perubahan pohon Merkle membandingkan hash file yang tidak berubah dan yang berubah</span> </span></p>
<p>Sinkronisasi berjalan dalam tiga tahap:</p>
<table>
<thead>
<tr><th>Tahap</th><th>Apa yang terjadi</th><th>Mengapa ini efisien</th></tr>
</thead>
<tbody>
<tr><td>Pemeriksaan cepat</td><td>Bandingkan root Merkle saat ini dengan snapshot terakhir.</td><td>Jika tidak ada yang berubah, pemeriksaan selesai dengan cepat.</td></tr>
<tr><td>Perbedaan yang tepat</td><td>Telusuri pohon untuk mengidentifikasi file yang ditambahkan, dihapus, dan dimodifikasi.</td><td>Hanya jalur yang diubah yang bergerak maju.</td></tr>
<tr><td>Pembaruan inkremental</td><td>Menghitung ulang penyematan untuk file yang diubah dan memperbarui Milvus.</td><td>Indeks vektor tetap segar tanpa pembangunan ulang penuh.</td></tr>
</tbody>
</table>
<p>Status sinkronisasi lokal disimpan di bawah <code translate="no">~/.context/merkle/</code>, sehingga Claude Context dapat memulihkan tabel hash file dan pohon Merkle yang diserialisasi setelah restart.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">Apa yang terjadi ketika Claude Code menggunakan Claude Context?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengaturan adalah satu perintah sebelum meluncurkan Claude Code:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Setelah mengindeks repositori, Claude Code dapat memanggil Claude Context ketika membutuhkan konteks basis kode. Dalam skenario penemuan bug yang sama yang sebelumnya menghabiskan waktu untuk melakukan grep dan pembacaan file, Claude Context menemukan file dan nomor baris yang tepat dengan penjelasan lengkap.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Demo Claude Context yang menunjukkan Claude Code menemukan lokasi bug yang relevan</span> </span></p>
<p>Alat ini tidak terbatas pada pencarian bug. Alat ini juga membantu refactoring, deteksi kode duplikat, resolusi masalah, pembuatan tes, dan tugas apa pun yang membutuhkan konteks repositori yang akurat.</p>
<p>Pada penarikan yang setara, Claude Context mengurangi konsumsi token sebesar 39,4% dan mengurangi pemanggilan alat sebesar 36,1% dalam tolok ukur kami. Hal ini penting karena pemanggilan alat dan pembacaan file yang tidak relevan sering kali mendominasi biaya alur kerja agen pengkodean.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Grafik tolok ukur yang menunjukkan Claude Context mengurangi penggunaan token dan pemanggilan alat dibandingkan dengan baseline</span> </span></p>
<p>Proyek ini sekarang memiliki lebih dari 10.000 bintang GitHub, dan repositori ini menyertakan detail tolok ukur lengkap dan tautan paket.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>Riwayat bintang GitHub Claude Context yang menunjukkan pertumbuhan yang cepat</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Bagaimana Claude Context dibandingkan dengan grep pada bug yang sebenarnya?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Tolok ukur ini membandingkan pencarian teks murni dengan pengambilan kode yang didukung Milvus pada tugas debugging nyata. Perbedaannya bukan hanya pada jumlah token yang lebih sedikit. Claude Context mengubah jalur pencarian agen: mulai lebih dekat dengan implementasi yang perlu diubah.</p>
<table>
<thead>
<tr><th>Kasus</th><th>Perilaku dasar</th><th>Perilaku Claude Context</th><th>Pengurangan token</th></tr>
</thead>
<tbody>
<tr><td>Django <code translate="no">YearLookup</code> bug</td><td>Mencari simbol terkait yang salah dan mengedit logika registrasi.</td><td>Menemukan logika pengoptimalan <code translate="no">YearLookup</code> secara langsung.</td><td>93% lebih sedikit token</td></tr>
<tr><td>Xarray <code translate="no">swap_dims()</code> bug</td><td>Membaca file yang tersebar di sekitar penyebutan <code translate="no">swap_dims</code>.</td><td>Menemukan implementasi dan tes terkait secara lebih langsung.</td><td>62% lebih sedikit token</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">Kasus 1: Bug Django YearLookup</h3><p><strong>Deskripsi masalah:</strong> Dalam kerangka kerja Django, pengoptimalan kueri <code translate="no">YearLookup</code> merusak pemfilteran <code translate="no">__iso_year</code>. Ketika menggunakan filter <code translate="no">__iso_year</code>, kelas <code translate="no">YearLookup</code> secara tidak benar menerapkan pengoptimalan standar BETWEEN - berlaku untuk tahun kalender, tetapi tidak untuk tahun penomoran minggu ISO.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Dasar (grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>Pencarian teks difokuskan pada pendaftaran <code translate="no">ExtractIsoYear</code> dan bukan pada logika pengoptimalan di <code translate="no">YearLookup</code>.</p>
<p><strong>Konteks Claude:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>Pencarian semantik memahami <code translate="no">YearLookup</code> sebagai konsep inti dan langsung menuju ke kelas yang tepat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tabel tolok ukur Django YearLookup yang menunjukkan 93 persen lebih sedikit token dengan Claude Context</span> </span></p>
<p><strong>Hasil:</strong> 93% lebih sedikit token.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">Kasus 2: Bug Xarray swap_dims</h3><p><strong>Deskripsi masalah:</strong> Metode <code translate="no">.swap_dims()</code> dari pustaka Xarray secara tidak terduga mengubah objek asli, melanggar ekspektasi kekekalan.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Baseline (grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>Baseline menghabiskan waktu untuk menavigasi direktori dan membaca kode terdekat sebelum menemukan jalur implementasi yang sebenarnya.</p>
<p><strong>Konteks Claude:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>Pencarian semantik menemukan implementasi <code translate="no">swap_dims()</code> yang relevan dan konteks terkait dengan lebih cepat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tabel tolok ukur Xarray swap_dims yang menunjukkan 62 persen lebih sedikit token dengan Claude Context</span> </span></p>
<p><strong>Hasil:</strong> 62% lebih sedikit token.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Memulai dengan Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda ingin mencoba alat yang tepat dari postingan ini, mulailah dengan <a href="https://github.com/zilliztech/claude-context">repositori GitHub Claude Context</a> dan <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">paket Claude Context MCP</a>. Repositori ini mencakup petunjuk penyiapan, tolok ukur, dan paket inti TypeScript.</p>
<p>Jika Anda ingin memahami atau menyesuaikan lapisan pengambilan, sumber daya ini adalah langkah selanjutnya yang berguna:</p>
<ul>
<li>Mempelajari dasar-dasar basis data vektor dengan <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>.</li>
<li>Jelajahi <a href="https://milvus.io/docs/full-text-search.md">pencarian teks lengkap Milvus</a> dan <a href="https://milvus.io/docs/full_text_search_with_milvus.md">tutorial pencarian teks lengkap LangChain</a> jika Anda ingin menggabungkan pencarian gaya BM25 dengan vektor padat.</li>
<li>Tinjau <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">mesin pencari vektor sumber terbuka</a> jika Anda membandingkan opsi infrastruktur.</li>
<li>Coba <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Plugin Zilliz Cloud untuk Claude Code</a> jika Anda menginginkan operasi basis data vektor langsung di dalam alur kerja Claude Code.</li>
</ul>
<p>Untuk bantuan dengan Milvus atau arsitektur pengambilan kode, bergabunglah dengan <a href="https://milvus.io/community/">komunitas Milvus</a> atau pesan <a href="https://milvus.io/office-hours">Jam Kerja Milvus</a> untuk mendapatkan panduan secara langsung. Jika Anda lebih suka melewatkan penyiapan infrastruktur, <a href="https://cloud.zilliz.com/signup">daftar ke Zilliz Cloud</a> atau <a href="https://cloud.zilliz.com/login">masuk ke Zilliz Cloud</a> dan gunakan Milvus terkelola sebagai backend.</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">Mengapa Claude Code menggunakan begitu banyak token pada beberapa tugas pengkodean?</h3><p>Claude Code dapat menggunakan banyak token ketika sebuah tugas membutuhkan pencarian berulang dan loop pembacaan file di repositori yang besar. Jika agen mencari berdasarkan kata kunci, membaca file yang tidak relevan, dan kemudian mencari lagi, setiap file yang dibaca akan menambahkan token bahkan ketika kode tersebut tidak berguna untuk tugas tersebut.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">Bagaimana Claude Context mengurangi penggunaan token Claude Code?</h3><p>Claude Context mengurangi penggunaan token dengan mencari indeks kode yang didukung Milvus sebelum agen membaca file. Ini mengambil potongan kode yang relevan dengan pencarian hybrid, sehingga Claude Code dapat memeriksa lebih sedikit file dan menghabiskan lebih banyak jendela konteksnya pada kode yang benar-benar penting.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Apakah Claude Context hanya untuk Claude Code?</h3><p>Tidak. Claude Context diekspos sebagai server MCP, sehingga dapat bekerja dengan alat pengkodean apa pun yang mendukung MCP. Claude Code adalah contoh utama dalam posting ini, tetapi lapisan pengambilan yang sama dapat mendukung IDE dan alur kerja agen yang kompatibel dengan MCP lainnya.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">Apakah saya memerlukan Zilliz Cloud untuk menggunakan Claude Context?</h3><p>Claude Context dapat menggunakan Zilliz Cloud sebagai backend Milvus terkelola, yang merupakan jalur termudah jika Anda tidak ingin mengoperasikan infrastruktur basis data vektor. Arsitektur pengambilan yang sama didasarkan pada konsep Milvus, sehingga tim juga dapat menyesuaikannya dengan penerapan Milvus yang dikelola sendiri.</p>
