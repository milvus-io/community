---
id: how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25.md
title: >-
  Bagaimana OpusSearch Membangun Pencocokan yang Tepat untuk Enterprise RAG
  dengan Milvus BM25
author: Chronos Kou
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/opus_cover_new_1505263938.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, enterprise RAG, vector database, semantic search'
meta_title: How OpusSearch Built Exact Matching for Enterprise RAG with Milvus
desc: >-
  Pelajari bagaimana OpusSearch menggunakan Milvus BM25 untuk mendukung
  pencocokan yang tepat dalam sistem RAG perusahaan-menggabungkan pencarian
  semantik dengan pencarian kata kunci yang tepat.
origin: >-
  https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b
---
<p>Artikel ini awalnya diterbitkan di <a href="https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b">Medium</a> dan diposting ulang di sini dengan izin.</p>
<h2 id="The-Semantic-Search-Blind-Spot" class="common-anchor-header">Titik Buta Pencarian Semantik<button data-href="#The-Semantic-Search-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Bayangkan ini: Anda adalah seorang editor video yang dikejar tenggat waktu. Anda membutuhkan klip dari "episode 281" podcast Anda. Anda mengetiknya di pencarian kami. Pencarian semantik kami yang didukung AI, dengan kecerdasannya yang membanggakan, mengembalikan klip dari 280, 282, dan bahkan menyarankan episode 218 karena angkanya mirip, bukan?</p>
<p><strong>Salah</strong>.</p>
<p>Saat kami meluncurkan <a href="https://www.opus.pro/opussearch">OpusSearch</a> untuk perusahaan pada Januari 2025, kami mengira pencarian semantik sudah cukup. Kueri bahasa alami seperti "temukan momen lucu tentang kencan" bekerja dengan sangat baik. Sistem RAG kami <a href="https://milvus.io/">yang didukung Milvus</a> menghancurkannya.</p>
<p><strong>Namun kemudian kenyataan menghantam kami dengan umpan balik dari pengguna:</strong></p>
<p>"Saya hanya ingin klip dari episode 281. Mengapa ini sangat sulit?"</p>
<p>"Ketika saya mencari 'Itulah yang dia katakan,' saya ingin PERSIS frasa itu, bukan 'itulah yang dia maksud."</p>
<p>Ternyata editor dan pemotong video tidak selalu ingin AI menjadi pintar. Terkadang mereka ingin perangkat lunak yang <strong>lugas dan benar</strong>.</p>
<h2 id="Why-do-we-care-about-Search" class="common-anchor-header">Mengapa kami peduli dengan Pencarian?<button data-href="#Why-do-we-care-about-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami membangun <a href="https://www.opus.pro/opussearch">fungsi pencarian perusahaan</a> karena kami mengidentifikasi bahwa <strong>memonetisasi</strong> katalog video yang besar adalah tantangan utama yang dihadapi organisasi. Platform kami yang didukung RAG berfungsi sebagai <strong>agen pertumbuhan</strong> yang memungkinkan perusahaan untuk <strong>mencari, menggunakan kembali, dan memonetisasi seluruh perpustakaan video mereka</strong>. Baca tentang kisah sukses dari <strong>All The Smoke</strong>, <strong>KFC Radio</strong>, dan <strong>TFTC</strong> <a href="https://www.opus.pro/blog/growing-a-new-youtube-channel-in-90-days-without-creating-new-videos">di sini</a>.</p>
<h2 id="Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="common-anchor-header">Mengapa Kami Menggandakan Milvus (Daripada Menambahkan Basis Data Lain)<button data-href="#Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Solusi yang jelas adalah menambahkan Elasticsearch atau MongoDB untuk pencocokan yang tepat. Namun, sebagai sebuah startup, mengelola beberapa sistem pencarian akan menimbulkan biaya operasional dan kompleksitas yang signifikan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Strong_community_adoption_with_35k_Git_Hub_stars_fbf773dcdb.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus baru-baru ini mengirimkan fitur pencarian teks lengkap mereka, dan evaluasi dengan dataset kami sendiri <strong>tanpa penyetelan apa pun</strong> menunjukkan keuntungan yang menarik:</p>
<ul>
<li><p><strong>Akurasi pencocokan parsial yang unggul</strong>. Sebagai contoh "cerita minum" dan "melompat tinggi", DB vektor lain terkadang mengembalikan "cerita makan" dan "mendapatkan tinggi" yang mengubah artinya.</p></li>
<li><p>Milvus <strong>mengembalikan hasil yang lebih panjang dan lebih komprehensif</strong> daripada database lain ketika kueri bersifat umum, yang secara alami lebih ideal untuk kasus penggunaan kami.</p></li>
</ul>
<h2 id="Architecture-from-5000-feet" class="common-anchor-header">Arsitektur dari ketinggian 5.000 kaki<button data-href="#Architecture-from-5000-feet" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Milvus_is_the_foundational_vector_database_for_our_Enterprise_RAG_architecture_b3c8ebf39c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="BM25-+-Filtering--Exact-Match-Magic" class="common-anchor-header">BM25 + Pemfilteran = Keajaiban Pencocokan Persis<button data-href="#BM25-+-Filtering--Exact-Match-Magic" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencarian teks lengkap Milvus bukan tentang pencocokan persis, tetapi tentang penilaian relevansi menggunakan BM25<a href="https://en.wikipedia.org/wiki/Okapi_BM25">(Pencocokan Terbaik 25)</a>, yang menghitung seberapa relevan sebuah dokumen dengan kueri Anda. Ini sangat bagus untuk "menemukan sesuatu yang mendekati," tetapi buruk untuk "menemukan yang persis seperti ini."</p>
<p>Kami kemudian <strong>menggabungkan kekuatan BM25 dengan pemfilteran TEXT_MATCH dari Milvus.</strong> Begini cara kerjanya:</p>
<ol>
<li><p><strong>Saring terlebih dahulu</strong>: TEXT_MATCH menemukan dokumen yang mengandung kata kunci yang tepat</p></li>
<li><p><strong>Peringkat kedua</strong>: BM25 mengurutkan kecocokan yang sama persis tersebut berdasarkan relevansi</p></li>
<li><p><strong>Menang</strong>: Anda mendapatkan kecocokan yang tepat, diberi peringkat secara cerdas</p></li>
</ol>
<p>Anggap saja ini sebagai "berikan semua yang mengandung kata kunci 'episode 281', lalu tunjukkan yang terbaik terlebih dahulu."</p>
<h2 id="The-Code-That-Made-It-Work" class="common-anchor-header">Kode yang Membuatnya Bekerja<button data-href="#The-Code-That-Made-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Schema-Design" class="common-anchor-header">Desain Skema</h3><p><strong>Penting</strong>: Kami menonaktifkan kata henti sepenuhnya, karena istilah seperti "The Office" dan "Office" mewakili entitas yang berbeda dalam domain konten kami.</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> <span class="hljs-keyword">function</span> getExactMatchFields(): FieldType[] {
 <span class="hljs-built_in">return</span> [
   {
     name: <span class="hljs-string">&quot;id&quot;</span>,
     data_type: DataType.VarChar,
     is_primary_key: <span class="hljs-literal">true</span>,
     max_length: 100,
   },
   {
     name: <span class="hljs-string">&quot;text&quot;</span>,
     data_type: DataType.VarChar,
     max_length: 1000,
     enable_analyzer: <span class="hljs-literal">true</span>,
     enable_match: <span class="hljs-literal">true</span>,  // This is the magic flag
     analyzer_params: {
       tokenizer: <span class="hljs-string">&#x27;standard&#x27;</span>,
       filter: [
         <span class="hljs-string">&#x27;lowercase&#x27;</span>,
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stemmer&#x27;</span>,
           language: <span class="hljs-string">&#x27;english&#x27;</span>,  // <span class="hljs-string">&quot;running&quot;</span> matches <span class="hljs-string">&quot;run&quot;</span>
         },
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stop&#x27;</span>,
           stop_words: [],  // Keep ALL words (even <span class="hljs-string">&quot;the&quot;</span>, <span class="hljs-string">&quot;a&quot;</span>)
         },
       ],
     },
   },
   {
     name: <span class="hljs-string">&quot;sparse_vector&quot;</span>,
     data_type: DataType.SparseFloatVector,
   },
 ]
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="BM25-Function-Setup" class="common-anchor-header">Pengaturan Fungsi BM25</h3><pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-attr">FUNCTIONS</span>: <span class="hljs-title class_">FunctionObject</span>[] = [
 {
   <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;text_bm25_embedding&#x27;</span>,
   <span class="hljs-attr">type</span>: <span class="hljs-title class_">FunctionType</span>.<span class="hljs-property">BM25</span>,
   <span class="hljs-attr">input_field_names</span>: [<span class="hljs-string">&#x27;text&#x27;</span>],
   <span class="hljs-attr">output_field_names</span>: [<span class="hljs-string">&#x27;sparse_vector&#x27;</span>],
   <span class="hljs-attr">params</span>: {},
 },
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Index-Config" class="common-anchor-header">Konfigurasi Indeks</h3><p>Parameter bm25_k1 dan bm25_b ini disetel terhadap dataset produksi kami untuk kinerja optimal.</p>
<p><strong>bm25_k1</strong>: Nilai yang lebih tinggi (hingga ~2.0) memberi bobot lebih besar pada kemunculan term yang berulang, sementara nilai yang lebih rendah mengurangi dampak frekuensi term setelah beberapa kemunculan pertama.</p>
<p><strong>bm25_b</strong>: Nilai yang mendekati 1,0 memberikan penalti yang besar untuk dokumen yang lebih panjang, sementara nilai yang mendekati 0 mengabaikan panjang dokumen sama sekali.</p>
<pre><code translate="no">index_params: [
 {
   field_name: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
   index_type: <span class="hljs-string">&#x27;SPARSE_INVERTED_INDEX&#x27;</span>,
   metric_type: <span class="hljs-string">&#x27;BM25&#x27;</span>,
   <span class="hljs-keyword">params</span>: {
     inverted_index_algo: <span class="hljs-string">&#x27;DAAT_MAXSCORE&#x27;</span>,
     bm25_k1: <span class="hljs-number">1.2</span>,  <span class="hljs-comment">// How much does term frequency matter?</span>
     bm25_b: <span class="hljs-number">0.75</span>,  <span class="hljs-comment">// How much does document length matter?</span>
   },
 },
],
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Search-Query-That-Started-Working" class="common-anchor-header">Kueri Penelusuran yang Mulai Bekerja</h3><pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">search</span>({
 <span class="hljs-attr">collection_name</span>: <span class="hljs-string">&#x27;my_collection&#x27;</span>,
 <span class="hljs-attr">limit</span>: <span class="hljs-number">30</span>,
 <span class="hljs-attr">output_fields</span>: [<span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;text&#x27;</span>],
 <span class="hljs-attr">filter</span>: <span class="hljs-string">`TEXT_MATCH(text, &quot;episode 281&quot;)`</span>,  <span class="hljs-comment">// Exact match filter</span>
 <span class="hljs-attr">anns_field</span>: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
 <span class="hljs-attr">data</span>: <span class="hljs-string">&#x27;episode 281&#x27;</span>,  <span class="hljs-comment">// BM25 ranking query</span>
})
<button class="copy-code-btn"></button></code></pre>
<p>Untuk pencocokan persis multi istilah:</p>
<pre><code translate="no"><span class="hljs-built_in">filter</span>: `TEXT_MATCH(text, <span class="hljs-string">&quot;foo&quot;</span>) <span class="hljs-keyword">and</span> TEXT_MATCH(text, <span class="hljs-string">&quot;bar&quot;</span>)`
<button class="copy-code-btn"></button></code></pre>
<h2 id="The-Mistakes-We-Made-So-You-Don’t-Have-To" class="common-anchor-header">Kesalahan yang Kami Lakukan (Agar Anda Tidak Perlu Melakukannya)<button data-href="#The-Mistakes-We-Made-So-You-Don’t-Have-To" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Dynamic-Fields-Critical-for-Production-Flexibility" class="common-anchor-header">Bidang Dinamis: Penting untuk Fleksibilitas Produksi</h3><p>Awalnya, kami tidak mengaktifkan bidang dinamis, dan hal ini menimbulkan masalah. Modifikasi skema memerlukan penghapusan dan pembuatan ulang koleksi di lingkungan produksi.</p>
<pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">createCollection</span>({
 <span class="hljs-attr">collection_name</span>: collectionName,
 <span class="hljs-attr">fields</span>: fields,
 <span class="hljs-attr">enable_dynamic_field</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">// DO THIS</span>
 <span class="hljs-comment">// ... rest of config</span>
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="Collection-Design-Maintain-Clear-Separation-of-Concerns" class="common-anchor-header">Desain Koleksi: Mempertahankan Pemisahan Urusan yang Jelas</h3><p>Arsitektur kami menggunakan koleksi khusus per domain fitur. Pendekatan modular ini meminimalkan dampak perubahan skema dan meningkatkan pemeliharaan.</p>
<h3 id="Memory-Usage-Optimize-with-MMAP" class="common-anchor-header">Penggunaan Memori: Optimalkan dengan MMAP</h3><p>Indeks yang jarang membutuhkan alokasi memori yang signifikan. Untuk kumpulan data teks yang besar, kami sarankan untuk mengonfigurasi MMAP untuk memanfaatkan penyimpanan disk. Pendekatan ini membutuhkan kapasitas I/O yang memadai untuk mempertahankan karakteristik kinerja.</p>
<pre><code translate="no"><span class="hljs-comment">// In your Milvus configuration</span>
<span class="hljs-attr">use_mmap</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Production-Impact-and-Results" class="common-anchor-header">Dampak dan Hasil Produksi<button data-href="#Production-Impact-and-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah penerapan fungsionalitas pencocokan yang sama persis pada bulan Juni 2025, kami mengamati peningkatan yang terukur dalam metrik kepuasan pengguna dan berkurangnya volume dukungan untuk masalah yang terkait dengan pencarian. Pendekatan mode ganda kami memungkinkan penelusuran semantik untuk kueri eksplorasi sekaligus memberikan pencocokan yang tepat untuk pengambilan konten tertentu.</p>
<p>Manfaat arsitektur utama: mempertahankan sistem basis data tunggal yang mendukung kedua paradigma pencarian, mengurangi kompleksitas operasional sekaligus memperluas fungsionalitas.</p>
<h2 id="What’s-Next" class="common-anchor-header">Apa Selanjutnya?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami bereksperimen dengan <strong>kueri</strong> <strong>hibrida</strong> <strong>yang menggabungkan pencocokan semantik dan pencocokan tepat dalam satu pencarian</strong>. Bayangkan: "Temukan klip lucu dari episode 281" di mana "lucu" menggunakan penelusuran semantik dan "episode 281" menggunakan pencocokan tepat.</p>
<p>Masa depan pencarian tidak hanya memilih antara AI semantik dan pencocokan tepat. Pencarian masa depan menggunakan <strong>keduanya</strong> secara cerdas dalam sistem yang sama.</p>
