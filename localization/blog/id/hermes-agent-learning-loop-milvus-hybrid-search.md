---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: Cara Memperbaiki Learning Loop Agen Hermes dengan Pencarian Hybrid Milvus 2.6
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  Learning Loop Hermes Agent menulis Keterampilan dari penggunaan, tetapi
  retriever FTS5-nya melewatkan kueri yang diulang. Pencarian hibrida Milvus 2.6
  memperbaiki pemanggilan kembali lintas sesi.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>Agen Hermes</strong></a> <strong>telah ada di mana-mana akhir-akhir ini</strong>. Dibangun oleh Nous Research, Hermes adalah agen AI pribadi yang dihosting sendiri yang berjalan pada perangkat keras Anda sendiri (VPS seharga $5) dan berbicara dengan Anda melalui saluran obrolan yang ada seperti Telegram.</p>
<p><strong>Sorotan terbesarnya adalah loop pembelajaran bawaan:</strong> loop ini menciptakan Keterampilan dari pengalaman, memperbaikinya selama penggunaan, dan mencari percakapan sebelumnya untuk menemukan pola yang dapat digunakan kembali. Kerangka kerja agen lain memberikan kode Keterampilan sebelum diterapkan. Keterampilan Hermes tumbuh dari penggunaan, dan alur kerja yang berulang menjadi dapat digunakan kembali tanpa perubahan kode.</p>
<p><strong>Kekurangannya adalah pengambilan Hermes hanya berdasarkan kata kunci.</strong> Ia mencocokkan kata-kata yang tepat, tetapi tidak dengan makna yang dicari pengguna. Ketika pengguna menggunakan kata-kata yang berbeda di sesi yang berbeda, perulangan tidak dapat menghubungkan mereka, dan tidak ada Skill baru yang ditulis. Ketika hanya ada beberapa ratus dokumen, kesenjangan tersebut masih dapat ditoleransi. <strong>Lebih dari itu, perulangan berhenti belajar karena tidak dapat menemukan riwayatnya sendiri.</strong></p>
<p><strong>Perbaikannya adalah Milvus 2.6.</strong> <a href="https://milvus.io/docs/multi-vector-search.md">Pencarian hibridanya</a> mencakup makna dan kata kunci yang tepat dalam satu kueri, sehingga perulangan akhirnya dapat menghubungkan informasi yang diulang di seluruh sesi. Cukup ringan untuk muat pada server awan kecil (VPS $5/bulan menjalankannya). Menukarnya tidak perlu mengubah slot Hermes - Milvus di belakang lapisan pengambilan, sehingga Learning Loop tetap utuh. Hermes masih memilih Skill mana yang akan dijalankan, dan Milvus menangani apa yang harus diambil.</p>
<p>Namun, hasil yang lebih dalam lebih dari sekadar mengingat yang lebih baik: setelah pengambilan berhasil, Learning Loop dapat menyimpan strategi pengambilan itu sendiri sebagai Skill - bukan hanya konten yang diambil. Begitulah cara kerja pengetahuan agen yang digabungkan di seluruh sesi.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Arsitektur Agen Hermes: Bagaimana Memori Empat Lapis Memberi Kekuatan pada Lingkaran Pembelajaran Keterampilan<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>memiliki empat lapisan memori, dan L4 Skills adalah yang membedakannya.</strong></p>
<ul>
<li><strong>L1</strong> - konteks sesi, dihapus ketika sesi ditutup</li>
<li><strong>L2</strong> - fakta yang bertahan: tumpukan proyek, konvensi tim, keputusan yang diselesaikan</li>
<li><strong>L3</strong> - pencarian kata kunci SQLite FTS5 melalui file lokal</li>
<li><strong>L4</strong> - menyimpan alur kerja sebagai file Markdown. Tidak seperti alat LangChain atau plugin AutoGPT, yang ditulis oleh pengembang dalam kode sebelum penerapan, Keterampilan L4 ditulis sendiri: keterampilan ini tumbuh dari apa yang sebenarnya dijalankan oleh agen, tanpa penulisan oleh pengembang.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Mengapa Pengambilan Kata Kunci FTS5 Hermes Memutuskan Lingkaran Pembelajaran<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes membutuhkan pengambilan kata kunci untuk memicu alur kerja lintas sesi sejak awal.</strong> Tetapi lapisan L3 bawaannya menggunakan SQLite FTS5, yang hanya mencocokkan token literal, bukan makna.</p>
<p><strong>Ketika pengguna mengucapkan maksud yang sama secara berbeda di seluruh sesi, FTS5 gagal mencocokkan.</strong> Learning Loop tidak berjalan. Tidak ada Skill baru yang ditulis, dan saat maksudnya muncul lagi, pengguna kembali ke perutean dengan tangan.</p>
<p>Contoh: basis pengetahuan menyimpan "asyncio event loop, penjadwalan tugas asinkronisasi, I/O non-blocking." Seorang pengguna mencari "konkurensi Python." FTS5 menghasilkan nol hit - tidak ada tumpang tindih kata secara harfiah, dan FTS5 tidak memiliki cara untuk melihat bahwa itu adalah pertanyaan yang sama.</p>
<p>Di bawah beberapa ratus dokumen, kesenjangannya masih bisa ditoleransi. Lebih dari itu, dokumentasi menggunakan satu kosakata, dan pengguna bertanya dengan kosakata yang lain, dan FTS5 tidak dapat menjembatani keduanya. <strong>Konten yang tidak dapat diambil sebaiknya tidak ada di basis pengetahuan, dan Learning Loop tidak memiliki apa pun untuk dipelajari.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Bagaimana Milvus 2.6 Memperbaiki Kesenjangan Pencarian dengan Pencarian Hibrida dan Penyimpanan Berjenjang<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6 menghadirkan dua peningkatan yang sesuai dengan titik kegagalan Hermes.</strong> <strong>Pencarian hibrida</strong> membuka blokir Lingkaran Pembelajaran dengan mencakup pencarian semantik dan kata kunci dalam satu panggilan. <strong>Penyimpanan berjenjang</strong> membuat seluruh backend pencarian cukup kecil untuk dijalankan pada VPS $5/bulan yang sama dengan VPS yang dibangun Hermes.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">Apa yang Dipecahkan oleh Pencarian Hibrida: Menemukan Informasi yang Relevan</h3><p>Milvus 2.6 mendukung menjalankan pengambilan vektor (semantik) dan <a href="https://milvus.io/docs/full-text-search.md">pencarian teks lengkap BM25</a> (kata kunci) dalam satu kueri, kemudian menggabungkan dua daftar peringkat dengan <a href="https://milvus.io/docs/multi-vector-search.md">Reciprocal Rank Fusion (RRF</a>).</p>
<p>Sebagai contoh: tanyakan &quot;apa prinsip asinkronisasi&quot;, dan pencarian vektor akan menemukan konten yang terkait secara semantik. Tanyakan &quot;di mana fungsi <code translate="no">find_similar_task</code> didefinisikan&quot;, dan BM25 secara tepat mencocokkan nama fungsi dalam kode. Untuk pertanyaan yang melibatkan fungsi di dalam jenis tugas tertentu, pencarian hybrid mengembalikan hasil yang tepat dalam satu kali pemanggilan, tanpa logika perutean yang ditulis tangan.</p>
<p>Bagi Hermes, inilah yang membuka blokir Learning Loop. Ketika sesi kedua mengulangi maksudnya, pencarian vektor menangkap kecocokan semantik yang terlewatkan oleh FTS5. Perulangan akan berjalan, dan Skill baru akan ditulis.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">Apa yang Diselesaikan oleh Penyimpanan Berjenjang: Biaya</h3><p>Basis data vektor yang naif akan menginginkan indeks penyematan penuh dalam RAM, yang mendorong penerapan personal ke infrastruktur yang lebih besar dan lebih mahal. Milvus 2.6 menghindari hal itu dengan penyimpanan tiga tingkat, memindahkan entri di antara tingkat berdasarkan frekuensi akses:</p>
<ul>
<li><strong>Panas</strong> - dalam memori</li>
<li><strong>Hangat</strong> - pada SSD</li>
<li><strong>Dingin</strong> - pada penyimpanan objek</li>
</ul>
<p>Hanya data panas yang tetap tinggal. Basis pengetahuan 500 dokumen dapat ditampung dalam RAM 2 GB. Seluruh tumpukan pengambilan berjalan pada target VPS Hermes $ 5/bulan yang sama, tanpa perlu peningkatan infrastruktur.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus: Arsitektur Sistem<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes memilih Skill mana yang akan dijalankan. Milvus menangani apa yang harus diambil.</strong> Kedua sistem tetap terpisah, dan antarmuka Hermes tidak berubah.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Alurnya:</strong></p>
<ol>
<li>Hermes mengidentifikasi maksud pengguna dan mengarahkannya ke Skill.</li>
<li>Skill memanggil skrip pengambilan melalui alat terminal.</li>
<li>Skrip tersebut memanggil Milvus, menjalankan pencarian hybrid, dan mengembalikan potongan-potongan yang diberi peringkat dengan metadata sumber.</li>
<li>Hermes menyusun jawabannya. Memori mencatat alur kerja.</li>
<li>Ketika pola yang sama berulang di seluruh sesi, Learning Loop menulis Skill baru.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">Cara Menginstal Hermes dan Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Instal Hermes dan</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standalone</strong></a><strong>, lalu buat koleksi dengan bidang padat dan BM25</strong>. Itu adalah pengaturan lengkap sebelum Learning Loop dapat dijalankan.</p>
<h3 id="Install-Hermes" class="common-anchor-header">Instal Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>Jalankan <code translate="no">hermes</code> untuk masuk ke wizard init interaktif:</p>
<ul>
<li><strong>Penyedia LLM</strong> - OpenAI, Anthropic, OpenRouter (OpenRouter memiliki model gratis)</li>
<li><strong>Saluran</strong> - panduan ini menggunakan bot FLark</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Menjalankan Milvus 2.6 Standalone</h3><p>Standalone node tunggal sudah cukup untuk agen pribadi:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">Membuat Koleksi</h3><p>Desain skema membatasi apa yang dapat dilakukan oleh pengambilan. Skema ini menjalankan vektor padat dan vektor jarang BM25 secara berdampingan:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">Skrip Pencarian Hibrida</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>Permintaan yang padat memperluas kumpulan kandidat sebanyak 2× sehingga RRF memiliki cukup banyak kandidat untuk diberi peringkat.</strong> <code translate="no">text-embedding-3-small</code> adalah penyematan OpenAI termurah yang masih memiliki kualitas pengambilan; tukar dengan <code translate="no">text-embedding-3-large</code> jika anggaran memungkinkan<strong>.</strong> </p>
<p>Dengan lingkungan dan basis pengetahuan yang sudah siap, bagian selanjutnya akan menguji Learning Loop.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">Pembangkitan Otomatis Keterampilan Hermes dalam Praktik<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Dua sesi menunjukkan Learning Loop beraksi.</strong> Pada sesi pertama, pengguna memberi nama skrip dengan tangan. Sesi kedua, sesi baru menanyakan pertanyaan yang sama tanpa menamai skrip. Hermes mengambil pola dan menulis tiga Keterampilan.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">Sesi 1: Panggil Skrip dengan Tangan</h3><p>Buka Hermes di Lark. Berikan jalur skrip dan target pengambilan. Hermes memanggil alat terminal, menjalankan skrip, dan mengembalikan jawabannya dengan atribusi sumber. <strong>Belum ada Skill. Ini adalah pemanggilan alat biasa.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">Sesi 2: Bertanya Tanpa Menyebut Nama Skrip</h3><p>Hapus percakapan. Mulai dari awal. Tanyakan kategori pertanyaan yang sama tanpa menyebutkan skrip atau jalurnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">Memori Menulis Lebih Dulu, Keterampilan Mengikuti</h3><p><strong>Lingkaran Pembelajaran mencatat alur kerja (skrip, argumen, bentuk pengembalian) dan mengembalikan jawabannya.</strong> Memori menyimpan jejaknya; belum ada Skill.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Pencocokan sesi kedua memberi tahu perulangan bahwa pola tersebut layak untuk dipertahankan.</strong> Ketika ia berjalan, tiga Skill akan ditulis:</p>
<table>
<thead>
<tr><th>Skill</th><th>Peran</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>Menjalankan pencarian semantik hibrida + kata kunci melalui Memori dan menyusun jawabannya</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>Memverifikasi dokumen yang telah dimasukkan ke dalam basis pengetahuan</td></tr>
<tr><td><code translate="no">terminal</code></td><td>Menjalankan perintah shell: skrip, pengaturan lingkungan, inspeksi</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dari titik ini, <strong>pengguna berhenti memberi nama Skill.</strong> Hermes menyimpulkan maksud, mengarahkan ke Skill, menarik potongan yang relevan dari Memori, dan menulis jawabannya. Tidak ada pemilih Skill dalam prompt.</p>
<p>Sebagian besar sistem RAG (retrieval-augmented generation) menyelesaikan masalah penyimpanan dan pengambilan, tetapi logika pengambilan itu sendiri dikodekan dalam kode aplikasi. Tanyakan dengan cara yang berbeda atau dalam skenario baru, dan pengambilan akan terhenti. Hermes menyimpan strategi pengambilan sebagai Skill, yang berarti <strong>jalur pengambilan menjadi dokumen yang dapat Anda baca, edit, dan versi</strong>. Baris <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> bukanlah penanda penyiapan-selesai. Ini adalah <strong>Agen yang melakukan pola perilaku ke memori jangka panjang</strong>.</p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes vs OpenClaw: Akumulasi vs Orkestrasi<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes dan OpenClaw menjawab masalah yang berbeda.</strong> Hermes dibuat untuk agen tunggal yang mengakumulasi memori dan keterampilan di seluruh sesi. OpenClaw dibuat untuk memecah tugas yang kompleks menjadi beberapa bagian dan menyerahkan setiap bagian ke agen khusus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kekuatan OpenClaw adalah orkestrasi. Ini mengoptimalkan seberapa banyak tugas yang dilakukan secara otomatis. Kekuatan Hermes adalah akumulasi: agen tunggal yang mengingat di seluruh sesi, dengan keterampilan yang tumbuh dari penggunaan. Hermes mengoptimalkan konteks jangka panjang dan pengalaman domain.</p>
<p><strong>Kedua kerangka kerja tersebut bertumpuk.</strong> Hermes memberikan jalur migrasi satu langkah yang menarik <code translate="no">~/.openclaw</code> memori dan keterampilan ke dalam lapisan memori Hermes. Tumpukan orkestrasi dapat berada di atas, dengan agen akumulasi di bawahnya.</p>
<p>Untuk sisi OpenClaw dari pemisahan tersebut, lihat <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Apa Itu OpenClaw? Panduan Lengkap untuk Agen AI Sumber Terbuka</a> di blog Milvus.</p>
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
    </button></h2><p>Learning Loop Hermes mengubah alur kerja yang berulang menjadi Keterampilan yang dapat digunakan kembali, tetapi hanya jika pengambilan dapat menghubungkannya di seluruh sesi. Pencarian kata kunci FTS5 tidak bisa. <a href="https://milvus.io/docs/multi-vector-search.md"><strong>Pencarian hibrida Milvus 2.6</strong></a> bisa: vektor padat menangani makna, BM25 menangani kata kunci yang tepat, RRF menggabungkan keduanya, dan <a href="https://milvus.io/docs/tiered-storage-overview.md">penyimpanan berjenjang</a> menyimpan seluruh tumpukan di VPS $ 5 / bulan.</p>
<p>Poin yang lebih besar: setelah pencarian berhasil, agen tidak hanya menyimpan jawaban yang lebih baik: agen menyimpan strategi pencarian yang lebih baik sebagai Keterampilan. Jalur pengambilan menjadi dokumen yang dapat direvisi yang akan meningkat seiring penggunaan. Itulah yang membedakan agen yang mengumpulkan keahlian domain dengan agen yang memulai dari awal setiap sesi. Untuk perbandingan bagaimana agen lain menangani (atau gagal menangani) masalah ini, lihat <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Penjelasan Sistem Memori Claude Code.</a></p>
<h2 id="Get-Started" class="common-anchor-header">Memulai<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Coba alat bantu dalam artikel ini:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Agen Hermes di GitHub</a> - instal skrip, pengaturan penyedia, dan konfigurasi saluran yang digunakan di atas.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a> - penerapan Docker node tunggal untuk backend basis pengetahuan.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Tutorial Pencarian Hibrida Milvus</a> - contoh lengkap + BM25 + RRF yang sesuai dengan skrip dalam posting ini.</li>
</ul>
<p><strong>Punya pertanyaan tentang pencarian hibrida Hermes + Milvus?</strong></p>
<ul>
<li>Bergabunglah dengan <a href="https://discord.gg/milvus">Milvus Discord</a> untuk bertanya tentang pencarian hibrida, penyimpanan berjenjang, atau pola perutean keterampilan - pengembang lain sedang membangun tumpukan yang serupa.</li>
<li><a href="https://milvus.io/community#office-hours">Pesan sesi Jam Kerja Milvus</a> untuk membahas pengaturan agen + basis pengetahuan Anda sendiri dengan tim Milvus.</li>
</ul>
<p><strong>Ingin melewatkan self-host?</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">Daftar</a> atau <a href="https://cloud.zilliz.com/login">masuk</a> ke Zilliz Cloud - Milvus yang dikelola Zilliz Cloud dengan pencarian hibrida dan penyimpanan berjenjang di luar kotak. Akun email kerja baru mendapatkan <strong> kredit gratis sebesar $100</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">Bacaan Lebih Lanjut<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Catatan rilis Milvus 2.6</a> - penyimpanan berjenjang, pencarian hibrida, perubahan skema</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Keterampilan Resmi</a> - perkakas operasional untuk agen asli Milvus</li>
<li><a href="https://zilliz.com/blog">Mengapa Manajemen Pengetahuan Gaya RAG Cocok untuk Agen</a> - kasus untuk desain memori khusus agen</li>
<li><a href="https://zilliz.com/blog">Sistem Memori Claude Code Lebih Primitif dari yang Anda Duga</a> - bagian perbandingan pada tumpukan memori agen lain</li>
</ul>
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">Bagaimana cara kerja Loop Pembelajaran Keterampilan Agen Hermes sebenarnya?</h3><p>Hermes mencatat setiap alur kerja yang dijalankannya - skrip yang dipanggil, argumen yang dilewatkan, dan bentuk kembalian - sebagai jejak memori. Ketika pola yang sama muncul di dua sesi atau lebih, Learning Loop akan menjalankan dan menulis Skill yang dapat digunakan kembali: file Markdown yang menangkap alur kerja sebagai prosedur yang dapat diulang. Sejak saat itu, Hermes merutekan ke Skill berdasarkan niat saja, tanpa pengguna menamainya. Ketergantungan yang sangat penting adalah pengambilan - perulangan hanya berjalan jika ia dapat menemukan jejak sesi sebelumnya, itulah sebabnya mengapa pencarian dengan kata kunci saja menjadi hambatan dalam skala besar.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">Apa perbedaan antara pencarian hibrida dan pencarian vektor-saja untuk memori agen?</h3><p>Pencarian vektor saja menangani makna dengan baik tetapi melewatkan pencocokan yang tepat. Jika pengembang menempelkan string kesalahan seperti ConnectionResetError atau nama fungsi seperti find_similar_task, pencarian vektor murni dapat mengembalikan hasil yang terkait secara semantik namun salah. Pencarian hibrida menggabungkan vektor padat (semantik) dengan BM25 (kata kunci) dan menggabungkan dua set hasil dengan Reciprocal Rank Fusion. Untuk memori agen - di mana kueri berkisar dari maksud yang tidak jelas ("konkurensi Python") hingga simbol yang tepat - pencarian hibrida mencakup kedua ujungnya dalam satu panggilan tanpa merutekan logika di lapisan aplikasi Anda.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Dapatkah saya menggunakan pencarian hybrid Milvus dengan agen AI selain Hermes?</h3><p>Ya, pola integrasinya bersifat umum: agen memanggil skrip pengambilan, skrip menanyakan Milvus, dan hasilnya dikembalikan sebagai potongan peringkat dengan metadata sumber. Kerangka kerja agen apa pun yang mendukung pemanggilan alat atau eksekusi shell dapat menggunakan pendekatan yang sama. Hermes sangat cocok karena Learning Loop-nya secara khusus bergantung pada pengambilan lintas sesi untuk melakukan pemanggilan, tetapi sisi Milvus bersifat agen-agnostik - tidak tahu atau peduli agen mana yang memanggilnya.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">Berapa biaya penyiapan Milvus + Hermes yang dihosting sendiri per bulan?</h3><p>Milvus 2.6 Standalone node tunggal pada VPS 2-core / 4 GB dengan penyimpanan berjenjang berjalan sekitar <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>5</mi><mn>/ bulan</mn></mrow><annotation encoding="application/x-tex">.</annotation><mrow><mi>OpenAItext-embedding-3-smallcosts5</mi><mi>/ bulan</mi></mrow>.<annotation encoding="application/x-tex">OpenAI text-embedding-3-biaya-kecil</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">5/bulan</span><span class="mord">.</span><span class="mord mathnormal">OpenAItext</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">embedding</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span> 3</span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">smallcosts0</span></span></span></span>,02 per 1M token - beberapa sen per bulan untuk basis pengetahuan pribadi. Inferensi LLM mendominasi total biaya dan skala dengan penggunaan, bukan dengan tumpukan pengambilan.</p>
