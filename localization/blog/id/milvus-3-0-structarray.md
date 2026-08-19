---
id: milvus-3-0-structarray.md
title: >-
  Satu Entitas, Banyak Vektor: Pencarian Tingkat Entitas dan Elemen dengan
  Milvus 3.0 StructArray
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  Satu entitas dapat berisi beberapa vektor selaras dan kolom metadata, dan
  Milvus dapat mencari seluruh entitas atau elemen individual tanpa meratakan
  data menjadi baris-baris terpisah.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>Sebagian besar skema basis data vektor dimulai dengan asumsi sederhana: satu entitas, satu embedding. Sebuah produk mendapatkan satu vektor, begitu juga dokumen. Kueri pengguna di-embed dan dibandingkan dengan vektor-vektor tersebut melalui pencarian tetangga terdekat aproksimasi (ANN). Model ini bekerja untuk generasi pertama kasus penggunaan pencarian vektor, termasuk RAG, penelusuran semantik, dan sistem rekomendasi.</p>
<p><strong>Data AI di dunia nyata, bagaimanapun, jarang cocok dengan asumsi itu.</strong> Sebuah video berisi klip, bidikan, atau bingkai kunci, masing-masing dengan embedding, rentang waktu, keterangan, label adegan, dan skor keyakinannya sendiri. Sebuah produk mungkin memiliki beberapa gambar dan sudut pandang. Dokumen panjang berisi bagian-bagian atau seksi yang makna lokalnya lebih penting daripada satu embedding dari keseluruhan dokumen. Model interaksi-terlambat yang populer juga menunjukkan keterbatasan yang sama pada granularitas yang lebih halus: ColBERT menghasilkan satu vektor per token, sementara ColPali menghasilkan satu vektor per patch visual.</p>
<p>Dalam setiap kasus, entitas induk tetap menjadi unit yang disimpan, ditampilkan, diamankan, dan dikembalikan oleh aplikasi. Namun relevansi, pemfilteran, dan penjelasan hasil sering kali bergantung pada elemen-elemen di dalam entitas tersebut.</p>
<p><strong>Fitur StructArray yang baru memberi Milvus model data asli untuk bentuk ini: satu entitas berisi array terurut dari elemen Struct yang ditentukan skema, dan setiap elemen dapat membawa metadata skalar, embedding vektor, atau keduanya.</strong> Milvus dapat memfilter bidang-bidang yang termasuk ke dalam elemen yang sama, membandingkan dua daftar embedding di tingkat entitas, atau mencari elemen individual dan mengembalikan offset yang cocok.</p>
<p>Artikel ini menggunakan contoh pencarian video untuk menjelaskan model data, kemudian menelusurinya melalui desain skema, pemfilteran, granularitas pencarian vektor, strategi indeks EmbeddingList, penggabungan hasil hibrida, dan tata letak fisik yang membuat fitur tersebut dapat dieksekusi.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">Mengapa model satu vektor dan satu baris datar tidak lagi cukup<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Bayangkan pengguna mencari katalog video untuk "seseorang yang memotong sayuran di dapur." Sinyal yang relevan mungkin ada di satu klip delapan detik, bukan pada embedding seluruh video. <strong>Mengompresi setiap klip, objek, dan aksi menjadi satu vektor mungkin mempertahankan topik secara umum, tetapi dapat menghilangkan detail lokal.</strong></p>
<p>Ketidakcocokan yang sama muncul di beban kerja lain:</p>
<ul>
<li>Relevansi sebuah produk mungkin berasal dari salah satu dari beberapa gambar atau sudut pandang.</li>
<li>Dokumen mungkin cocok karena satu bagian tertentu, bukan karena subjek keseluruhannya.</li>
<li>Memori agen mungkin berisi beberapa observasi, dan hanya satu di antaranya yang penting untuk tugas saat ini.</li>
<li>Catatan ColBERT atau ColPali berisi daftar vektor token atau patch dengan panjang bervariasi, bukan satu vektor padat.</li>
</ul>
<p>Salah satu alternatifnya adalah memecah setiap klip, gambar, atau bagian menjadi baris basis data terpisah. Ini memungkinkan pencarian lokal, tetapi juga memisahkan setiap fragmen dari entitas induknya. Metadata induk mungkin diulang di seluruh baris, dan pengambilan di tingkat entitas kemudian memerlukan pengelompokan, deduplikasi, dan peringkat ulang setelah pencarian fragmen.</p>
<p>Penyimpanan bersarang saja tidak menyelesaikan masalah kueri. JSON dapat menyimpan objek, tetapi tidak memberi Milvus skema subbidang yang telah ditentukan untuk pengindeksan vektor dan skalar. Array paralel dapat menyimpan keterangan, label adegan, dan nilai keyakinan, tetapi aplikasi harus menjaga keselarasan offset. Basis data tidak dapat dengan aman menyimpulkan bahwa <code translate="no">scene_type[3]</code> dan <code translate="no">label_confidence[3]</code> mendeskripsikan klip yang sama kecuali hubungan tersebut menjadi bagian dari model data.</p>
<p>StructArray mengodekan hubungan itu secara langsung. Ia menjaga elemen lokal di dalam entitas induk sambil mengekspos subbidang yang selaras ke validasi skema, pengindeksan, pemfilteran, dan pencarian vektor.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">Apa itu StructArray dan model datanya?<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray, juga dikenal sebagai array of structs, menyimpan sekumpulan elemen Struct yang terurut di setiap entitas. Bidang StructArray adalah <code translate="no">Array</code> yang semua elemennya mengikuti satu skema <code translate="no">Struct</code> yang telah ditentukan. Untuk koleksi video, bentuk logisnya bisa terlihat seperti ini:</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Di sini:</p>
<ul>
<li><code translate="no">clips</code> adalah bidang StructArray induk.</li>
<li><code translate="no">clip_embedding_list</code>, <code translate="no">clip_embedding</code>, <code translate="no">start_sec</code>, dan atribut lainnya adalah subbidang.</li>
<li><code translate="no">clips[0]</code> adalah klip pertama.</li>
<li>Setiap subbidang pada offset <code translate="no">0</code> termasuk ke klip yang sama.</li>
<li>Setiap subbidang pada offset <code translate="no">3</code> termasuk ke klip lain.</li>
</ul>
<p>Kedua subbidang vektor melayani mode pencarian yang berbeda. <code translate="no">clips[clip_embedding_list]</code> diindeks dengan metrik <code translate="no">MAX_SIM*</code> untuk pencarian EmbeddingList di tingkat entitas, sedangkan <code translate="no">clips[clip_embedding]</code> diindeks dengan metrik vektor biasa untuk pencarian di tingkat elemen. Karena bidang vektor atau subbidang vektor hanya menerima satu indeks, koleksi yang membutuhkan kedua mode harus mendefinisikan dan mengindeks kedua subbidang secara terpisah.</p>
<p>Model ini mendukung tiga semantik kueri yang berbeda.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. Pencarian EmbeddingList mengembalikan entitas induk</h3><p>Vektor-vektor di <code translate="no">clips[clip_embedding_list]</code> membentuk satu daftar embedding untuk video. Kuerinya juga berupa <code translate="no">EmbeddingList</code>. Milvus membandingkan daftar kueri dengan setiap daftar tersimpan menggunakan metrik <code translate="no">MAX_SIM*</code> dan mengembalikan hasil di tingkat entitas.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. Keluarga <code translate="no">MATCH_*</code> memfilter entitas induk</h3><p><code translate="no">MATCH_ANY</code>, <code translate="no">MATCH_ALL</code>, <code translate="no">MATCH_LEAST</code>, <code translate="no">MATCH_MOST</code>, dan <code translate="no">MATCH_EXACT</code> mengevaluasi predikat terhadap elemen Struct, menghitung berapa banyak elemen yang memenuhinya, dan memutuskan apakah entitas induk lolos filter.</p>
<p>Contohnya:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Kedua kondisi skalar harus benar pada offset klip yang sama. Milvus tidak menggabungkan label dapur dari satu klip dengan nilai keyakinan tinggi dari klip lain.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. Pencarian tingkat elemen mengembalikan offset elemen yang cocok</h3><p>Vektor kueri biasa dapat mencari setiap vektor di <code translate="no">clips[clip_embedding]</code> secara independen. Setiap hasil mengidentifikasi entitas induk dan offset berbasis nol dari elemen Struct yang cocok. <code translate="no">element_filter</code> dapat membatasi elemen mana yang berpartisipasi dalam pencarian vektor tersebut.</p>
<p>Operasi-operasi ini berbagi satu premis: Milvus mengetahui nilai vektor dan skalar mana yang termasuk ke elemen yang sama, dan elemen mana yang termasuk ke entitas yang sama.</p>
<p>StructArray bukanlah sistem penyarangan arbitrer untuk tujuan umum. Modelnya saat ini adalah satu <code translate="no">Array</code> dari elemen <code translate="no">Struct</code> dengan subbidang skalar dan vektor yang didukung. Batasan itu membuat pengindeksan subbidang dan eksekusi yang sadar-elemen menjadi layak.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">Bangun skema, indeks, dan jalur penyisipan<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>Contoh PyMilvus yang disederhanakan berikut membuat koleksi video dengan satu vektor tingkat atas dan StructArray untuk klip. Contoh ini menggunakan subbidang vektor klip yang terpisah sehingga koleksi yang sama dapat mendemonstrasikan kedua mode pencarian.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>Subbidang vektor harus diindeks sebelum pencarian. Karena keluarga metrik menentukan mode pencarian, setiap subbidang vektor mendapatkan indeksnya sendiri:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Indeks skalar bersifat opsional, tetapi subbidang yang sering muncul dalam filter skala besar sebaiknya menggunakan indeks skalar yang kompatibel. Misalnya, <code translate="no">clips[scene_type]</code> dapat menggunakan indeks terbalik (inverted index), sementara subbidang numerik seperti <code translate="no">clips[label_confidence]</code> dapat menggunakan indeks yang cocok untuk pemfilteran numerik.</p>
<p>Sisipkan data dalam bentuk entitas alaminya: satu baris video dengan array objek klip. Agar contoh tetap ringkas, contoh ini menulis vektor klip yang sama ke kedua subbidang vektor.</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Di batas API, <code translate="no">clips</code> tetap berupa array objek terstruktur. Di dalam Milvus, setiap subbidang mengikuti jalur bertipe yang diperlukan untuk indeks, filter, dan perilaku keluarannya sendiri. Perbedaan itu transparan pada saat penyisipan, tetapi fundamental untuk semua yang terjadi selanjutnya.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">Pemfilteran elemen yang sama adalah perbedaan antara struktur dan array paralel<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Manfaat utama pemfilteran bukanlah sintaks yang lebih pendek untuk bidang bersarang. Manfaat utamanya adalah korelasi yang benar di seluruh subbidang skalar.</p>
<p>Misalkan aplikasi membutuhkan video yang berisi klip dapur dengan keyakinan label di atas <code translate="no">0.8</code>. Tidak cukup jika video hanya berisi beberapa klip dapur dan beberapa klip dengan keyakinan tinggi; klip yang sama harus memenuhi kedua kondisi tersebut.</p>
<p>Keluarga <code translate="no">MATCH_*</code> StructArray mengekspresikan hal ini secara langsung:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus mengevaluasi predikat pada setiap offset elemen, lalu menerapkan kuantifier operator untuk memutuskan apakah entitas induk lolos:</p>
<ul>
<li><code translate="no">MATCH_ANY</code>: Setidaknya satu elemen cocok.</li>
<li><code translate="no">MATCH_ALL</code>: Semua elemen cocok.</li>
<li><code translate="no">MATCH_LEAST</code>: Setidaknya <code translate="no">threshold</code> elemen cocok.</li>
<li><code translate="no">MATCH_MOST</code>: Paling banyak <code translate="no">threshold</code> elemen cocok.</li>
<li><code translate="no">MATCH_EXACT</code>: Tepat <code translate="no">threshold</code> elemen cocok.</li>
</ul>
<p>Jika data yang sama disimpan sebagai dua array independen, ekspresi berikut tidak akan menjaga korelasi tersebut:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Kedua nilai tersebut bisa terjadi pada offset yang berbeda. Ini mungkin valid untuk atribut yang tidak terkait, tetapi tidak benar ketika kedua kondisi mendeskripsikan klip, gambar produk, atau bagian dokumen yang sama.</p>
<p>StructArray menjadikan identitas elemen sebagai bagian dari predikat basis data, bukan konvensi yang harus ditegakkan oleh aplikasi.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">Dua granularitas pencarian vektor, dua identitas hasil<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>Begitu sebuah entitas menyimpan banyak vektor, pengambilan harus menyelesaikan pertanyaan pemodelan sebelum pencarian ANN dimulai:</p>
<p><strong>Haruskah vektor-vektor tersebut diberi skor bersama sebagai satu representasi dari entitas induk, atau haruskah setiap vektor elemen bersaing secara independen?</strong></p>
<p>StructArray mendukung kedua model tersebut, tetapi keduanya menggunakan bentuk kueri, keluarga metrik, subbidang vektor, dan identitas hasil yang berbeda.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">Pencarian EmbeddingList: daftar vektor kueri menemukan sebuah entitas</h3><p>Kueri <code translate="no">EmbeddingList</code> berisi banyak vektor. Video kueri mungkin dibagi menjadi beberapa klip; kueri produk mungkin berisi beberapa gambar referensi; kueri ColBERT berisi satu vektor per token kueri.</p>
<p>Untuk setiap entitas, Milvus membandingkan daftar kueri dengan daftar embedding yang tersimpan di entitas. Di bawah skor bergaya MaxSim, setiap vektor kueri memilih kecocokan terbaiknya di daftar entitas, dan Milvus menggabungkan skor kecocokan terbaik tersebut menjadi skor entitas. Hasil akhir mewakili entitas induk, bukan satu elemen Struct tertentu.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Pencarian ini menjawab: <strong>Video mana yang merupakan kecocokan keseluruhan terbaik untuk kumpulan klip kueri ini?</strong></p>
<p>Ini cocok untuk pengambilan video-ke-video, pencarian produk multi-gambar, pengambilan gaya ColBERT dan ColPali, serta kasus lain di mana kueri dan entitas tersimpan sama-sama diwakili oleh banyak vektor.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">Pencarian tingkat elemen: satu vektor kueri menemukan klip di dalam entitas</h3><p>Pencarian tingkat elemen menggunakan vektor kueri biasa. Setiap vektor di <code translate="no">clips[clip_embedding]</code> berpartisipasi dalam pencarian ANN sebagai kandidat independen. Setiap hasil mengidentifikasi entitas induk dan offset elemen yang cocok.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Untuk hanya mencari klip tertentu, lampirkan <code translate="no">element_filter</code> yang kondisi skalarnya berlaku pada klip yang sama:</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Filter tidak terlebih dahulu memilih klip dapur lalu mencari klip dengan keyakinan tinggi yang berbeda. Baik predikat maupun kandidat vektor merujuk ke elemen Struct yang sama.</p>
<p>Respons tanpa pengelompokan mungkin terlihat seperti ini:</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>Entitas yang sama dapat muncul lebih dari sekali karena beberapa klip dapat cocok. Ini berguna ketika aplikasi perlu menampilkan tidak hanya video atau dokumen mana yang relevan, tetapi juga klip atau bagian mana yang menghasilkan kecocokan tersebut.</p>
<table>
<thead>
<tr><th>Aspek</th><th>Pencarian EmbeddingList</th><th>Pencarian tingkat elemen</th></tr>
</thead>
<tbody>
<tr><td>Input kueri</td><td>Satu atau lebih vektor kueri dalam <code translate="no">EmbeddingList</code></td><td>Satu vektor kueri biasa</td></tr>
<tr><td>Contoh target</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>Keluarga metrik</td><td><code translate="no">MAX_SIM*</code></td><td>Metrik biasa seperti <code translate="no">COSINE</code>, <code translate="no">IP</code>, atau <code translate="no">L2</code></td></tr>
<tr><td>Unit kandidat ANN</td><td>Daftar embedding entitas induk</td><td>Setiap vektor elemen Struct</td></tr>
<tr><td>Identitas hasil</td><td>Entitas induk</td><td>Entitas induk plus offset elemen</td></tr>
<tr><td>Kasus penggunaan umum</td><td>Mencocokkan kueri multi-vektor dengan entitas multi-vektor</td><td>Menemukan klip, gambar, bagian, patch, atau fakta yang paling relevan</td></tr>
</tbody>
</table>
<p>Untuk mendukung kedua mode dalam satu koleksi, definisikan dan indeks subbidang vektor yang terpisah. Bentuk kueri, keluarga metrik, dan indeks target harus selaras.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">Pengindeksan EmbeddingList adalah keputusan kualitas-biaya<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan satu embedding per entitas, indeks ANN menemukan entitas di dekat vektor kueri. Pencarian EmbeddingList lebih mahal karena relevansi bergantung pada interaksi berpasangan antara dua daftar vektor.</p>
<p>Menghitung MaxSim eksak terhadap setiap vektor di setiap entitas menghasilkan peringkat referensi yang paling bersih, tetapi pemindaian penuh biasanya terlalu mahal untuk pengambilan daring. Karena itu, Milvus menggunakan model dua tahap:</p>
<ol>
<li>Strategi aproksimasi mengambil kandidat entitas induk.</li>
<li>Ketika <code translate="no">emb_list_rerank</code> diaktifkan, Milvus menghitung ulang MaxSim pada kandidat tersebut untuk menghasilkan peringkat akhir.</li>
</ol>
<p>Mengambil lebih banyak kandidat tahap pertama umumnya meningkatkan peluang hasil teratas yang sebenarnya mencapai reranker, tetapi juga meningkatkan latensi dan komputasi. Ketiga strategi terutama berbeda dalam cara mereka menghasilkan kumpulan kandidat tersebut.</p>
<table>
<thead>
<tr><th>Strategi</th><th>Representasi kandidat tahap pertama</th><th>Titik awal yang baik ketika</th><th>Tradeoff utama</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Mengindeks setiap vektor di setiap daftar embedding. Vektor kueri menjalankan ANN secara independen; kecocokan digabungkan kembali ke entitas induk sebelum reranking MaxSim.</td><td>Kualitas adalah prioritas, daftar pendek atau sedang, dan vektor individual bersifat diskriminatif.</td><td>Ukuran indeks dan kerja pencarian tahap pertama bertambah seiring panjang daftar dan jumlah vektor kueri.</td></tr>
<tr><td>MUVERA</td><td>Mengodekan setiap daftar embedding menjadi satu vektor berdimensi tetap melalui proyeksi acak, lalu menjalankan ANN biasa.</td><td>TokenANN terlalu berat dan kompresi tanpa pipeline pelatihan lebih disukai.</td><td>Pengodean kehilangan informasi; pengaturan proyeksi yang lebih kuat meningkatkan dimensi terenkode dan biaya ANN.</td></tr>
<tr><td>LEMUR</td><td>Melatih model yang memetakan daftar embedding menjadi vektor entitas induk berdimensi tetap.</td><td>Embedding kurang diskriminatif, daftar besar, atau beban kerja bersifat visual atau multimodal.</td><td>Membutuhkan pelatihan dan dapat sensitif terhadap distribusi korpus dan bias panjang dokumen.</td></tr>
</tbody>
</table>
<p>Tidak ada strategi tunggal yang terbaik untuk semua beban kerja. Mulailah dengan data target dan distribusi kueri:</p>
<ul>
<li>Gunakan TokenANN sebagai garis dasar yang mengutamakan kualitas ketika ukuran dataset memungkinkan.</li>
<li>Coba MUVERA ketika indeks atau pengambilan kandidat TokenANN menjadi terlalu mahal seiring bertambahnya panjang daftar, dan Anda ingin menghindari pipeline pelatihan.</li>
<li>Evaluasi LEMUR ketika ruang embedding berisik atau lemah secara diskriminatif, atau ketika beban kerja bersifat visual atau multimodal.</li>
<li>Ukur recall atau nDCG bersama latensi dan ukuran indeks. Strategi yang bekerja untuk teks pendek dapat berperilaku berbeda dengan panjang dokumen ekor panjang atau ribuan patch visual.</li>
</ul>
<p>StructArray menyelesaikan satu masalah: bagaimana merepresentasikan elemen pembawa vektor yang selaras dan dapat difilter di dalam satu entitas. Strategi EmbeddingList menyelesaikan masalah lain: bagaimana mengaproksimasi MaxSim dengan biaya yang dapat diterima untuk model dan korpus tertentu.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">Pencarian hibrida membuat identitas hasil menjadi eksplisit<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengambilan di lingkungan produksi jarang mengikuti satu jalur vektor. Permintaan video dapat menggabungkan embedding video tingkat atas, satu atau lebih embedding tingkat klip, sinyal keterangan atau transkrip, dan reranker.</p>
<p>Begitu kandidat tingkat elemen memasuki pipeline itu, mesin harus memutuskan apa yang mengidentifikasi kandidat akhir.</p>
<table>
<thead>
<tr><th>Komposisi permintaan hibrida</th><th>Cakupan kandidat akhir</th><th>Identitas hasil</th></tr>
</thead>
<tbody>
<tr><td>Semua sub-pencarian berada di tingkat elemen dan menargetkan subbidang vektor di bawah StructArray yang sama</td><td>Tingkat elemen</td><td>Kunci utama plus bidang StructArray plus offset elemen</td></tr>
<tr><td>Bidang vektor tingkat atas disertakan</td><td>Tingkat entitas</td><td>Kunci utama</td></tr>
<tr><td>Permintaan EmbeddingList disertakan</td><td>Tingkat entitas</td><td>Kunci utama</td></tr>
<tr><td>Permintaan tingkat elemen menargetkan bidang StructArray yang berbeda</td><td>Tingkat entitas</td><td>Kunci utama</td></tr>
</tbody>
</table>
<p>Konfigurasi pertama mempertahankan identitas elemen karena offset <code translate="no">3</code> merujuk ke elemen Struct yang sama untuk setiap sub-pencarian di bawah StructArray induk tertentu. Ini cocok untuk aplikasi yang ingin mengembalikan klip atau bagian yang paling relevan setelah menggabungkan beberapa sinyal tingkat elemen.</p>
<p>Konfigurasi lainnya mencampur granularitas kandidat atau namespace elemen. Oleh karena itu, hasil elemen harus digabungkan menjadi skor tingkat entitas sebelum reranking akhir. Milvus mendukung beberapa strategi penggabungan:</p>
<table>
<thead>
<tr><th>Strategi penggabungan</th><th>Skor entitas dari hasil elemen yang dikembalikan</th><th>Kondisi penting</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>Skor elemen terbaik</td><td>Bekerja dengan metrik vektor biasa yang didukung</td></tr>
<tr><td><code translate="no">sum</code></td><td>Jumlah semua skor elemen yang dikembalikan</td><td>Gunakan dengan metrik berkorelasi positif seperti <code translate="no">IP</code> atau <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">avg</code></td><td>Rata-rata skor elemen yang dikembalikan</td><td>Bekerja dengan metrik vektor biasa yang didukung</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>Jumlah dari <code translate="no">K</code> skor elemen terbaik yang dikembalikan</td><td>Membutuhkan <code translate="no">topk</code> positif; gunakan dengan <code translate="no">IP</code> atau <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>Rata-rata dari <code translate="no">K</code> skor elemen terbaik yang dikembalikan</td><td>Membutuhkan <code translate="no">topk</code> positif</td></tr>
</tbody>
</table>
<p>Penggabungan hanya beroperasi pada hasil elemen yang dikembalikan oleh sub-pencarian ANN tersebut; ia tidak memindai setiap elemen di entitas setelah pengambilan. Oleh karena itu, <code translate="no">limit</code> permintaan mengontrol hasil elemen mana yang tersedia untuk fungsi penggabungan.</p>
<p>Pilihan ini membentuk semantik pengambilan, bukan sekadar format keluaran. Jika aplikasi menampilkan klip atau bagian, mempertahankan offset melalui fusi adalah hal yang alami. Jika aplikasi menampilkan video, produk, atau dokumen, penggabungan tingkat entitas adalah hal yang alami. Ketika sinyal beroperasi pada granularitas yang berbeda, sistem membutuhkan aturan skoring elemen-ke-entitas yang eksplisit.</p>
<p>StructArray memindahkan masalah identitas-dan-penggabungan itu dari pemrosesan pasca ad hoc ke dalam model eksekusi pencarian.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Bagaimana Milvus mengeksekusi StructArray tanpa memperlakukannya sebagai gumpalan data<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>Model yang terlihat pengguna adalah <code translate="no">ARRAY&lt;STRUCT&gt;</code>. Namun, menyimpan seluruh nilai sebagai satu gumpalan buram akan membuat indeks subbidang, filter, dan keluaran selektif menjadi tidak efisien.</p>
<p>Milvus menggunakan desain induk-logis, anak-fisik-kolom (logical-parent, physical-child-column).</p>
<p>Di lapisan skema, <code translate="no">clips</code> adalah bidang induk logis. Ia mendefinisikan properti seperti skema Struct, kapasitas maksimum, dan kemampuan null. Subbidangnya dinormalisasi menjadi jalur seperti <code translate="no">clips[clip_embedding_list]</code>, <code translate="no">clips[clip_embedding]</code>, <code translate="no">clips[scene_type]</code>, dan <code translate="no">clips[label_confidence]</code>.</p>
<p>Subbidang skalar mengikuti jalur penyimpanan array skalar per entitas, sementara subbidang vektor mengikuti jalur array vektor. Setiap subbidang kemudian dapat menggunakan jalur data yang sesuai dengan tipenya: pemfilteran skalar dan indeks skalar untuk metadata, serta indeks vektor dan pencarian ANN untuk embedding.</p>
<p>Saat penyerapan, Proxy memperluas daftar Struct bersarang menjadi kolom anak bertipe. Selama eksekusi, Milvus menjaga hubungan antara setiap elemen fisik dan entitas induknya. Secara konseptual, hubungan itu terlihat seperti ini:</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>Ketika pencarian tingkat elemen mengembalikan ID elemen fisik, Milvus memetakannya kembali ke entitas induk dan offset elemen. Ketika <code translate="no">element_filter</code> menghasilkan bitmap tingkat elemen, mesin menyelaraskannya dengan visibilitas entitas induk, penghapusan, dan filter lainnya.</p>
<p>Saat mengembalikan hasil, Milvus menggunakan skema logis dan offset bersama untuk merekonstruksi bentuk StructArray yang disisipkan aplikasi. Sistem dapat mengeksekusi di atas kolom anak bertipe sementara pengguna terus membaca dan menulis objek bersarang yang alami. Tata letak fisik ini membuat StructArray lebih dari sekadar JSON bertipe: hubungan bersarang berpartisipasi dalam model indeks dan eksekusi.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">Di mana StructArray cocok, dan di mana tidak<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray sangat cocok ketika semua hal berikut benar:</p>
<ul>
<li>Aplikasi memiliki entitas induk yang bermakna, seperti video, produk, dokumen, halaman visual, atau catatan memori.</li>
<li>Setiap induk berisi kumpulan elemen lokal yang terurut dan panjangnya bervariasi.</li>
<li>Elemen-elemen tersebut membutuhkan metadata skalar, vektor, atau keduanya.</li>
<li>Pencarian atau pemfilteran harus menjaga hubungan antara subbidang pada offset elemen yang sama.</li>
<li>Aplikasi membutuhkan pengambilan multi-vektor tingkat entitas, hasil tingkat elemen, atau keduanya.</li>
</ul>
<p>StructArray tidak otomatis lebih baik untuk setiap koleksi. Dokumen pendek atau kueri sederhana mungkin sudah cukup dilayani oleh satu embedding padat. Pengindeksan multi-vektor menambah biaya penyimpanan dan pencarian, sehingga representasi tambahan harus membuktikan nilainya melalui peningkatan kualitas pengambilan atau granularitas hasil yang lebih berguna.</p>
<p>Batasan skema dan eksekusi saat ini juga penting:</p>
<ul>
<li><code translate="no">Struct</code> didukung sebagai tipe elemen dari <code translate="no">Array</code>, bukan sebagai bidang koleksi tingkat atas.</li>
<li>Semua elemen dalam satu StructArray berbagi satu skema yang telah ditentukan.</li>
<li><code translate="no">max_capacity</code> wajib diisi dan membatasi jumlah elemen per entitas.</li>
<li>Subbidang <code translate="no">Struct</code>, <code translate="no">Array</code>, <code translate="no">ArrayOfStruct</code>, dan <code translate="no">JSON</code> bersarang tidak didukung di dalam StructArray.</li>
<li>Subbidang vektor menerima satu indeks. Gunakan subbidang vektor terpisah untuk pencarian EmbeddingList dan tingkat elemen ketika keduanya diperlukan.</li>
<li>Subbidang vektor harus diindeks sebelum pencarian. Subbidang skalar yang banyak digunakan dalam filter harus diindeks dengan tepat.</li>
<li>Skema subbidang ditetapkan setelah bidang StructArray dibuat, jadi rencanakan atribut elemen sebelum peluncuran produksi.</li>
</ul>
<p>Batasan-batasan ini membuat model lebih sempit daripada penyarangan arbitrer basis data dokumen, tetapi juga memberi Milvus struktur yang cukup untuk bernalar tentang identitas elemen, mengindeks setiap subbidang, dan mengeksekusi pada dua granularitas pencarian.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray menjaga bukti lokal sebagai warga kelas satu tanpa kehilangan entitas<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray memberi Milvus objek pengambilan yang sulit direpresentasikan oleh skema datar: entitas induk dengan kumpulan elemen terstruktur yang terurut. Hubungan antara elemen-elemen tersebut berpartisipasi dalam pemfilteran, pengindeksan, dan pencarian, bukan hanya ada di penyimpanan.</p>
<p>Setiap elemen mempertahankan metadata dan embedding-nya sendiri. Elemen-elemen tersebut dapat memenuhi predikat skalar elemen yang sama, berpartisipasi bersama dalam pencarian EmbeddingList tingkat entitas, atau bersaing secara independen dalam pencarian tingkat elemen. Pada saat yang sama, mereka tetap terikat pada entitas induk yang metadata, izin, dan identitas aplikasinya memberi mereka konteks.</p>
<p>Untuk klip video, gambar produk, bagian dokumen, patch visual, dan fragmen memori, bukti lokal dapat dicari dan difilter tanpa kehilangan entitas tempatnya berada. Pilihan desain yang tersisa bersifat eksplisit: pilih granularitas pencarian, berikan metrik dan indeks yang cocok untuk setiap subbidang vektor, dan putuskan apakah hasil hibrida harus mempertahankan offset elemen atau digabungkan kembali ke entitas.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">Coba StructArray di Milvus 3.0<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray tersedia di Milvus 3.0. Mulailah dengan <a href="https://milvus.io/docs/array-of-structs.md">Ringkasan StructArray</a>. Jika Anda mengevaluasi pengambilan multi-vektor tingkat entitas, baca <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">panduan strategi EmbeddingList</a>. Untuk granularitas hasil dan perilaku penggabungan, lihat <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">Pencarian Hibrida dengan StructArray</a>.</p>
<p>Untuk konteks rilis yang lebih luas, lihat <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog peluncuran Milvus 3.0</a>, <a href="https://milvus.io/docs/release_notes.md">catatan rilis</a>, dan <a href="https://github.com/milvus-io/milvus">repositori milvus-io/milvus</a>.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> juga mendukung StructArray dan pencarian EmbeddingList untuk deployment terkelola. Tinjau <a href="https://docs.zilliz.com/docs/use-array-of-structs">panduan StructArray Zilliz Cloud</a> untuk batasan khusus layanan. Di Zilliz Cloud, operator skalar pada StructArray saat ini didokumentasikan untuk klaster On-Demand.</p>
<p>Untuk mendiskusikan desain skema atau pengambilan dengan tim, bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Discord Milvus</a> atau pesan sesi <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a>.</p>
