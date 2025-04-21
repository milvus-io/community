---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >-
  Memperkenalkan Milvus SDK v2: Dukungan Async Asli, API Terpadu, dan Performa
  Unggul
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  Rasakan pengalaman Milvus SDK v2, yang dirancang ulang untuk para pengembang!
  Nikmati API terpadu, dukungan asinkronisasi asli, dan kinerja yang lebih baik
  untuk proyek pencarian vektor Anda.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">LAI TB<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>Anda berbicara, dan kami mendengarkan! Milvus SDK v2 merupakan peninjauan ulang yang lengkap terhadap pengalaman pengembang kami, yang dibangun langsung dari masukan Anda. Dengan API terpadu di seluruh Python, Java, Go, dan Node.js, dukungan asinkronisasi asli yang Anda minta, Schema Cache yang meningkatkan kinerja, dan antarmuka MilvusClient yang disederhanakan, Milvus SDK v2 membuat pengembangan <a href="https://zilliz.com/learn/vector-similarity-search">pencarian vektor</a> menjadi lebih cepat dan intuitif dari sebelumnya. Baik Anda membangun aplikasi <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, sistem rekomendasi, atau solusi <a href="https://zilliz.com/learn/what-is-computer-vision">visi komputer</a>, pembaruan yang digerakkan oleh komunitas ini akan mengubah cara Anda bekerja dengan Milvus.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">Mengapa Kami Membangunnya: Mengatasi Masalah yang Dihadapi Komunitas<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>Selama bertahun-tahun, Milvus telah menjadi <a href="https://milvus.io/blog/what-is-a-vector-database.md">basis data vektor</a> pilihan untuk ribuan aplikasi AI. Namun, seiring dengan pertumbuhan komunitas kami, kami secara konsisten mendengar tentang beberapa keterbatasan dengan SDK v1 kami:</p>
<p><strong>"Menangani konkurensi yang tinggi terlalu rumit."</strong> Kurangnya dukungan asinkronisasi asli di beberapa SDK bahasa memaksa pengembang untuk mengandalkan thread atau callback, membuat kode lebih sulit untuk dikelola dan di-debug, terutama dalam skenario seperti pemuatan data batch dan kueri paralel.</p>
<p><strong>"Performa menurun seiring dengan bertambahnya skala."</strong> Tanpa Cache Skema, v1 berulang kali memvalidasi skema selama operasi, menciptakan kemacetan untuk beban kerja bervolume tinggi. Dalam kasus penggunaan yang membutuhkan pemrosesan vektor besar-besaran, masalah ini mengakibatkan peningkatan latensi dan penurunan throughput.</p>
<p><strong>"Antarmuka yang tidak konsisten antar bahasa menciptakan kurva pembelajaran yang curam."</strong> SDK bahasa yang berbeda mengimplementasikan antarmuka dengan cara mereka sendiri, sehingga menyulitkan pengembangan lintas bahasa.</p>
<p><strong>"RESTful API kehilangan fitur-fitur penting."</strong> Fungsi-fungsi penting seperti manajemen partisi dan konstruksi indeks tidak tersedia, sehingga memaksa para pengembang untuk beralih ke SDK yang berbeda.</p>
<p>Ini bukan hanya permintaan fitur - ini adalah hambatan nyata dalam alur kerja pengembangan Anda. SDK v2 adalah janji kami untuk menghilangkan hambatan-hambatan ini dan memungkinkan Anda untuk fokus pada hal yang penting: membangun aplikasi AI yang luar biasa.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">Solusinya: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 adalah hasil dari desain ulang lengkap yang berfokus pada pengalaman pengembang, tersedia dalam berbagai bahasa:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. Dukungan Asinkron Asli: Dari Kompleks ke Konkuren</h3><p>Cara lama dalam menangani konkurensi melibatkan objek Future yang rumit dan pola pemanggilan kembali. SDK v2 memperkenalkan fungsionalitas asinkron/menunggu yang sebenarnya, khususnya di Python dengan <code translate="no">AsyncMilvusClient</code> (sejak v2.5.3). Dengan parameter yang sama dengan MilvusClient yang sinkron, Anda dapat dengan mudah menjalankan operasi seperti insert, query, dan pencarian secara paralel.</p>
<p>Pendekatan yang disederhanakan ini menggantikan pola Future dan callback yang rumit dan tidak praktis, sehingga menghasilkan kode yang lebih bersih dan efisien. Logika konkuren yang kompleks, seperti penyisipan vektor batch atau multi-kueri paralel, sekarang dapat dengan mudah diimplementasikan menggunakan alat seperti <code translate="no">asyncio.gather</code>.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. Tembolok Skema: Meningkatkan Performa di Tempat yang Penting</h3><p>SDK v2 memperkenalkan Schema Cache yang menyimpan skema koleksi secara lokal setelah pengambilan awal, menghilangkan permintaan jaringan yang berulang-ulang dan overhead CPU selama operasi.</p>
<p>Untuk skenario penyisipan dan kueri berfrekuensi tinggi, pembaruan ini diterjemahkan menjadi:</p>
<ul>
<li><p>Mengurangi lalu lintas jaringan antara klien dan server</p></li>
<li><p>Latensi yang lebih rendah untuk operasi</p></li>
<li><p>Penurunan penggunaan CPU sisi server</p></li>
<li><p>Penskalaan yang lebih baik di bawah konkurensi tinggi</p></li>
</ul>
<p>Hal ini sangat berharga untuk aplikasi seperti sistem rekomendasi waktu nyata atau fitur pencarian langsung yang membutuhkan waktu milidetik.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. Pengalaman API yang Terpadu dan Efisien</h3><p>Milvus SDK v2 memperkenalkan pengalaman API yang terpadu dan lebih lengkap di semua bahasa pemrograman yang didukung. Secara khusus, RESTful API telah ditingkatkan secara signifikan untuk menawarkan fitur yang hampir sama dengan antarmuka gRPC.</p>
<p>Pada versi sebelumnya, RESTful API tertinggal dari gRPC, sehingga membatasi apa yang dapat dilakukan oleh pengembang tanpa harus berpindah antarmuka. Hal itu tidak lagi terjadi. Kini, pengembang dapat menggunakan RESTful API untuk melakukan hampir semua operasi inti-seperti membuat koleksi, mengelola partisi, membuat indeks, dan menjalankan kueri-tanpa harus kembali ke gRPC atau metode lainnya.</p>
<p>Pendekatan terpadu ini memastikan pengalaman pengembang yang konsisten di berbagai lingkungan dan kasus penggunaan. Pendekatan ini mengurangi kurva pembelajaran, menyederhanakan integrasi, dan meningkatkan kegunaan secara keseluruhan.</p>
<p>Catatan: Bagi sebagian besar pengguna, RESTful API menawarkan cara yang lebih cepat dan lebih mudah untuk memulai dengan Milvus. Namun, jika aplikasi Anda menuntut kinerja tinggi atau fitur-fitur canggih seperti iterator, klien gRPC tetap menjadi pilihan utama untuk fleksibilitas dan kontrol maksimum.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. Desain SDK yang Selaras di Semua Bahasa</h3><p>Dengan Milvus SDK v2, kami telah menstandarkan desain SDK kami di semua bahasa pemrograman yang didukung untuk memberikan pengalaman pengembang yang lebih konsisten.</p>
<p>Baik Anda membangun dengan Python, Java, Go, atau Node.js, setiap SDK sekarang mengikuti struktur terpadu yang berpusat di sekitar kelas MilvusClient. Desain ulang ini menghadirkan penamaan metode yang konsisten, pemformatan parameter, dan pola penggunaan secara keseluruhan untuk setiap bahasa yang kami dukung. (Lihat: <a href="https://github.com/milvus-io/milvus/discussions/33979">Pembaruan contoh kode SDK MilvusClient - Diskusi GitHub #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sekarang, setelah Anda terbiasa dengan Milvus dalam satu bahasa, Anda dapat dengan mudah beralih ke bahasa lain tanpa harus mempelajari kembali cara kerja SDK. Penyelarasan ini tidak hanya menyederhanakan proses orientasi tetapi juga membuat pengembangan multi-bahasa menjadi lebih lancar dan intuitif.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. PyMilvus (Python SDK) yang Lebih Sederhana dan Lebih Cerdas dengan <code translate="no">MilvusClient</code></h3><p>Pada versi sebelumnya, PyMilvus mengandalkan desain gaya ORM yang memperkenalkan perpaduan antara pendekatan berorientasi objek dan prosedural. Pengembang harus mendefinisikan objek <code translate="no">FieldSchema</code>, membangun <code translate="no">CollectionSchema</code>, dan kemudian menginstansiasi kelas <code translate="no">Collection</code> - semuanya hanya untuk membuat koleksi. Proses ini tidak hanya bertele-tele tetapi juga memperkenalkan kurva pembelajaran yang lebih curam bagi pengguna baru.</p>
<p>Dengan antarmuka <code translate="no">MilvusClient</code> yang baru, semuanya menjadi lebih sederhana. Anda sekarang dapat membuat koleksi dalam satu langkah dengan menggunakan metode <code translate="no">create_collection()</code>. Hal ini memungkinkan Anda untuk mendefinisikan skema dengan cepat dengan mengoper parameter seperti <code translate="no">dimension</code> dan <code translate="no">metric_type</code>, atau Anda masih bisa menggunakan objek skema kustom jika diperlukan.</p>
<p>Lebih baik lagi, <code translate="no">create_collection()</code> mendukung pembuatan indeks sebagai bagian dari pemanggilan yang sama. Jika parameter indeks disediakan, Milvus akan secara otomatis membuat indeks dan memuat data ke dalam memori - tidak perlu melakukan pemanggilan <code translate="no">create_index()</code> atau <code translate="no">load()</code> secara terpisah. Satu metode melakukan semuanya: <em>buat koleksi → bangun indeks → muat koleksi.</em></p>
<p>Pendekatan yang disederhanakan ini mengurangi kerumitan penyiapan dan membuatnya lebih mudah untuk memulai dengan Milvus, terutama bagi para pengembang yang menginginkan jalur yang cepat dan efisien untuk membuat prototipe atau produksi.</p>
<p>Modul <code translate="no">MilvusClient</code> yang baru menawarkan keuntungan yang jelas dalam hal kegunaan, konsistensi, dan kinerja. Meskipun antarmuka ORM lama tetap tersedia untuk saat ini, kami berencana untuk menghapusnya di masa depan (lihat <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">referensi</a>). Kami sangat menyarankan untuk melakukan upgrade ke SDK yang baru untuk mendapatkan keuntungan penuh dari peningkatan yang ada.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. Dokumentasi yang Lebih Jelas dan Lebih Komprehensif</h3><p>Kami telah merestrukturisasi dokumentasi produk untuk menyediakan <a href="https://milvus.io/docs">Referensi API</a> yang lebih lengkap dan lebih jelas. Panduan Pengguna kami sekarang menyertakan contoh kode multi-bahasa, sehingga Anda dapat memulai dengan cepat dan memahami fitur-fitur Milvus dengan mudah. Selain itu, asisten Ask AI yang tersedia di situs dokumentasi kami dapat memperkenalkan fitur-fitur baru, menjelaskan mekanisme internal, dan bahkan membantu membuat atau memodifikasi kode sampel, membuat perjalanan Anda melalui dokumentasi lebih lancar dan menyenangkan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Server MCP Milvus: Dirancang untuk Integrasi AI di Masa Depan</h3><p><a href="https://github.com/zilliztech/mcp-server-milvus">MCP Server</a>, yang dibangun di atas Milvus SDK, adalah jawaban kami atas kebutuhan yang terus meningkat dalam ekosistem AI: integrasi tanpa batas antara model bahasa besar<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>), <a href="https://milvus.io/blog/what-is-a-vector-database.md">basis data vektor</a>, dan alat atau sumber data eksternal. SDK ini mengimplementasikan Model Context Protocol (MCP), menyediakan antarmuka yang terpadu dan cerdas untuk mengatur operasi Milvus dan seterusnya.</p>
<p>Karena <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">agen AI</a> menjadi lebih mampu - tidak hanya menghasilkan kode tetapi juga mengelola layanan backend secara mandiri - permintaan akan infrastruktur yang lebih cerdas dan digerakkan oleh API meningkat. Server MCP dirancang dengan mempertimbangkan masa depan ini. Server ini memungkinkan interaksi yang cerdas dan otomatis dengan cluster Milvus, menyederhanakan tugas-tugas seperti penerapan, pemeliharaan, dan manajemen data.</p>
<p>Lebih penting lagi, ini meletakkan dasar untuk jenis kolaborasi mesin-ke-mesin yang baru. Dengan MCP Server, agen AI dapat memanggil API untuk membuat koleksi secara dinamis, menjalankan kueri, membangun indeks, dan banyak lagi - semuanya tanpa campur tangan manusia.</p>
<p>Singkatnya, MCP Server mengubah Milvus bukan hanya menjadi basis data, tetapi juga menjadi backend yang dapat diprogram dan siap pakai untuk AI-membuka jalan bagi aplikasi yang cerdas, otonom, dan dapat diskalakan.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Memulai dengan Milvus SDK v2: Contoh Kode<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Contoh-contoh di bawah ini menunjukkan cara menggunakan antarmuka PyMilvus (Python SDK v2) yang baru untuk membuat koleksi dan melakukan operasi asinkron. Dibandingkan dengan pendekatan gaya ORM pada versi sebelumnya, kode ini lebih bersih, lebih konsisten, dan lebih mudah digunakan.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. Membuat Koleksi, Mendefinisikan Skema, Membangun Indeks, dan Memuat Data dengan <code translate="no">MilvusClient</code></h3><p>Cuplikan kode Python di bawah ini menunjukkan cara membuat koleksi, mendefinisikan skema, membangun indeks, dan memuat data-semuanya dalam satu kali pemanggilan:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Parameter <code translate="no">index_params</code> pada metode <code translate="no">create_collection</code> menghilangkan kebutuhan untuk pemanggilan terpisah untuk <code translate="no">create_index</code> dan <code translate="no">load_collection</code>-semuanya terjadi secara otomatis.</p>
<p>Selain itu, <code translate="no">MilvusClient</code> mendukung mode pembuatan tabel secara cepat. Sebagai contoh, sebuah koleksi dapat dibuat dalam satu baris kode dengan hanya menentukan parameter yang diperlukan:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(Catatan perbandingan: Pada pendekatan ORM yang lama, Anda harus membuat <code translate="no">Collection(schema)</code>, kemudian secara terpisah memanggil <code translate="no">collection.create_index()</code> dan <code translate="no">collection.load()</code>; sekarang, MilvusClient menyederhanakan seluruh proses).</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. Melakukan Sisipan Asinkron Berkonvergensi Tinggi dengan <code translate="no">AsyncMilvusClient</code></h3><p>Contoh berikut ini menunjukkan bagaimana menggunakan <code translate="no">AsyncMilvusClient</code> untuk melakukan operasi penyisipan secara bersamaan dengan menggunakan <code translate="no">async/await</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>Dalam contoh ini, <code translate="no">AsyncMilvusClient</code> digunakan untuk menyisipkan data secara bersamaan dengan menjadwalkan beberapa tugas penyisipan dengan <code translate="no">asyncio.gather</code>. Pendekatan ini mengambil keuntungan penuh dari kemampuan pemrosesan konkuren backend Milvus. Tidak seperti penyisipan baris demi baris yang sinkron di v1, dukungan asinkron asli ini secara dramatis meningkatkan hasil.</p>
<p>Demikian pula, Anda dapat memodifikasi kode untuk melakukan kueri atau pencarian secara bersamaan - misalnya, dengan mengganti panggilan insert dengan <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code>. Antarmuka asinkron Milvus SDK v2 memastikan bahwa setiap permintaan dieksekusi dengan cara yang tidak memblokir, sepenuhnya memanfaatkan sumber daya klien dan server.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">Migrasi Menjadi Mudah<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami tahu Anda telah menginvestasikan waktu di SDK v1, jadi kami telah merancang SDK v2 dengan mempertimbangkan aplikasi yang sudah ada. SDK v2 menyertakan kompatibilitas ke belakang, sehingga antarmuka bergaya v1/ORM yang ada akan terus berfungsi untuk sementara waktu. Tetapi kami sangat menyarankan untuk meningkatkan ke SDK v2 sesegera mungkin-dukungan untuk v1 akan berakhir dengan dirilisnya Milvus 3.0 (akhir tahun 2025).</p>
<p>Berpindah ke SDK v2 akan membuka pengalaman pengembang yang lebih konsisten dan modern dengan sintaks yang disederhanakan, dukungan asinkronisasi yang lebih baik, dan kinerja yang lebih baik. Ini juga merupakan tempat di mana semua fitur baru dan dukungan komunitas difokuskan ke depannya. Melakukan upgrade sekarang memastikan Anda siap untuk apa yang akan terjadi selanjutnya dan memberi Anda akses ke yang terbaik yang ditawarkan Milvus.</p>
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
    </button></h2><p>Milvus SDK v2 membawa peningkatan yang signifikan dibandingkan v1: peningkatan kinerja, antarmuka yang terpadu dan konsisten di berbagai bahasa pemrograman, dan dukungan asinkron asli yang menyederhanakan operasi dengan konkurensi tinggi. Dengan dokumentasi yang lebih jelas dan contoh kode yang lebih intuitif, Milvus SDK v2 dirancang untuk menyederhanakan proses pengembangan Anda, membuatnya lebih mudah dan lebih cepat untuk membangun dan menggunakan aplikasi AI.</p>
<p>Untuk informasi lebih lanjut, silakan lihat <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">Referensi API dan Panduan Pengguna</a> resmi kami yang terbaru. Jika Anda memiliki pertanyaan atau saran mengenai SDK baru, jangan ragu untuk memberikan umpan balik di <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> dan <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>. Kami menantikan masukan Anda untuk terus menyempurnakan Milvus.</p>
