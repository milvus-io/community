---
id: 2022-1-27-milvus-2-0-a-glimpse-at-new-features.md
title: Milvus 2.0 - Sekilas tentang Fitur Baru
author: Yanliang Qiao
date: 2022-01-27T00:00:00.000Z
desc: Lihat Fitur Terbaru dari Milvus 2.0.
cover: assets.zilliz.com/New_features_in_Milvus_2_0_93a87a7a8a.png
tag: Engineering
---
<custom-h1>Milvus 2.0: Sekilas tentang Fitur-fitur Baru</custom-h1><p>Sudah setengah tahun sejak kandidat rilis pertama Milvus 2.0. Sekarang kami dengan bangga mengumumkan ketersediaan Milvus 2.0 secara umum. Silakan ikuti langkah demi langkah untuk melihat sekilas beberapa fitur baru yang didukung oleh Milvus.</p>
<h2 id="Entity-deletion" class="common-anchor-header">Penghapusan entitas<button data-href="#Entity-deletion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 mendukung penghapusan entitas, yang memungkinkan pengguna untuk menghapus vektor berdasarkan kunci utama (ID) dari vektor. Mereka tidak akan khawatir lagi dengan data yang sudah kadaluarsa atau tidak valid. Mari kita coba.</p>
<ol>
<li>Hubungkan ke Milvus, buat koleksi baru, dan masukkan 300 baris vektor 128 dimensi yang dibuat secara acak.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># connect to milvus</span>
host = <span class="hljs-string">&#x27;x.x.x.x&#x27;</span>
connections.add_connection(default={<span class="hljs-string">&quot;host&quot;</span>: host, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-number">19530</span>})
connections.connect(alias=<span class="hljs-string">&#x27;default&#x27;</span>)
<span class="hljs-comment"># create a collection with customized primary field: id_field</span>
dim = <span class="hljs-number">128</span>
id_field = FieldSchema(name=<span class="hljs-string">&quot;cus_id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
age_field = FieldSchema(name=<span class="hljs-string">&quot;age&quot;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&quot;age&quot;</span>)
embedding_field = FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
schema = CollectionSchema(fields=[id_field, age_field, embedding_field],
                          auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;hello MilMil&quot;</span>)
collection_name = <span class="hljs-string">&quot;hello_milmil&quot;</span>
collection = Collection(name=collection_name, schema=schema)
<span class="hljs-keyword">import</span> random
<span class="hljs-comment"># insert data with customized ids</span>
nb = <span class="hljs-number">300</span>
ids = [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
ages = [random.randint(<span class="hljs-number">20</span>, <span class="hljs-number">40</span>) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
embeddings = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
entities = [ids, ages, embeddings]
ins_res = collection.insert(entities)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;insert entities primary keys: <span class="hljs-subst">{ins_res.primary_keys}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">insert entities primary keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299]
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Sebelum melanjutkan ke penghapusan, periksa entitas yang ingin Anda hapus dengan pencarian atau kueri, dan lakukan dua kali untuk memastikan hasilnya dapat diandalkan.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># search</span>
nq = <span class="hljs-number">10</span>
search_vec = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nq)]
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span>}}
limit = <span class="hljs-number">3</span>
<span class="hljs-comment"># search 2 times to verify the vector persists</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>):
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    ids = results[<span class="hljs-number">0</span>].ids
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
    expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{ids}</span>&quot;</span>
    <span class="hljs-comment"># query to verify the ids exist</span>
    query_res = collection.query(expr)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;query results: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
query <span class="hljs-attr">results</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
query <span class="hljs-attr">results</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Hapus entitas dengan cus_id 76, lalu cari dan kueri entitas ini.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;trying to delete one vector: id=<span class="hljs-subst">{ids[<span class="hljs-number">0</span>]}</span>&quot;</span>)
collection.delete(expr=<span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[ids[<span class="hljs-number">0</span>]]}</span>&quot;</span>)
results = collection.search(search_vec, embedding_field.name, search_params, limit)
ids = results[<span class="hljs-number">0</span>].ids
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{ids}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">trying to <span class="hljs-keyword">delete</span> one <span class="hljs-attr">vector</span>: id=<span class="hljs-number">76</span>
after <span class="hljs-attr">deleted</span>: search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<p>Mengapa entitas yang telah dihapus masih dapat diambil? Jika Anda telah memeriksa kode sumber Milvus, Anda akan menemukan bahwa penghapusan di dalam Milvus bersifat asinkron dan logis, yang berarti entitas tidak akan dihapus secara fisik. Sebaliknya, mereka akan dilampirkan dengan tanda "dihapus" sehingga tidak ada permintaan pencarian atau permintaan kueri yang akan mengambilnya. Selain itu, Milvus mencari di bawah tingkat konsistensi Bounded Staleness secara default. Oleh karena itu, entitas yang dihapus masih dapat diambil sebelum data disinkronkan di node data dan node kueri. Coba cari atau kueri entitas yang dihapus setelah beberapa detik, Anda akan menemukan entitas tersebut tidak ada lagi dalam hasil pencarian.</p>
<pre><code translate="no" class="language-python">expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<h2 id="Consistency-level" class="common-anchor-header">Tingkat konsistensi<button data-href="#Consistency-level" class="anchor-icon" translate="no">
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
    </button></h2><p>Percobaan di atas menunjukkan kepada kita bagaimana tingkat konsistensi mempengaruhi visibilitas langsung dari data yang baru saja dihapus. Pengguna dapat mengatur tingkat konsistensi untuk Milvus secara fleksibel untuk menyesuaikannya dengan berbagai skenario layanan. Milvus 2.0 mendukung empat tingkat konsistensi:</p>
<ul>
<li><code translate="no">CONSISTENCY_STRONG</code>: <code translate="no">GuaranteeTs</code> diatur sebagai identik dengan stempel waktu sistem terbaru, dan node kueri menunggu hingga waktu layanan berlanjut ke stempel waktu sistem terbaru, dan kemudian memproses permintaan pencarian atau kueri.</li>
<li><code translate="no">CONSISTENCY_EVENTUALLY</code>: <code translate="no">GuaranteeTs</code> disetel lebih kecil secara signifikan daripada stempel waktu sistem terbaru untuk melewati pemeriksaan konsistensi. Node kueri langsung mencari pada tampilan data yang ada.</li>
<li><code translate="no">CONSISTENCY_BOUNDED</code>: <code translate="no">GuaranteeTs</code> disetel relatif lebih kecil dari stempel waktu sistem terbaru, dan simpul kueri mencari pada tampilan data yang masih dapat ditoleransi dan kurang diperbarui.</li>
<li><code translate="no">CONSISTENCY_SESSION</code>: Klien menggunakan timestamp dari operasi penulisan terakhir sebagai <code translate="no">GuaranteeTs</code>, sehingga setiap klien setidaknya dapat mengambil data yang dimasukkan dengan sendirinya.</li>
</ul>
<p>Pada rilis RC sebelumnya, Milvus mengadopsi Strong sebagai konsistensi default. Namun, dengan mempertimbangkan fakta bahwa sebagian besar pengguna tidak terlalu menuntut konsistensi dibandingkan dengan performa, Milvus mengubah konsistensi default menjadi Bounded Staleness, yang dapat menyeimbangkan kebutuhan mereka secara lebih baik. Di masa mendatang, kami akan lebih mengoptimalkan konfigurasi dari GuaranteeTs, yang hanya dapat dicapai selama pembuatan koleksi dalam rilis saat ini. Untuk informasi lebih lanjut tentang <code translate="no">GuaranteeTs</code>, lihat <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/how-guarantee-ts-works.md">Cap Waktu Jaminan dalam Permintaan Pencarian</a>.</p>
<p>Apakah konsistensi yang lebih rendah akan menghasilkan kinerja yang lebih baik? Anda tidak akan pernah tahu jawabannya sampai Anda mencobanya.</p>
<ol start="4">
<li>Ubah kode di atas untuk mencatat latensi pencarian.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">5</span>):
    start = time.time()
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    end = time.time()
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search latency: <span class="hljs-subst">{<span class="hljs-built_in">round</span>(end-start, <span class="hljs-number">4</span>)}</span>&quot;</span>)
    ids = results[<span class="hljs-number">0</span>].ids
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Cari dengan skala data dan parameter yang sama kecuali <code translate="no">consistency_level</code> ditetapkan sebagai <code translate="no">CONSISTENCY_STRONG</code>.</li>
</ol>
<pre><code translate="no" class="language-python">collection_name = <span class="hljs-string">&quot;hello_milmil_consist_strong&quot;</span>
collection = <span class="hljs-title class_">Collection</span>(name=collection_name, schema=schema,
                        consistency_level=<span class="hljs-variable constant_">CONSISTENCY_STRONG</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search latency: 0.3293
search latency: 0.1949
search latency: 0.1998
search latency: 0.2016
search latency: 0.198
completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li>Cari dalam koleksi dengan <code translate="no">consistency_level</code> yang ditetapkan sebagai <code translate="no">CONSISTENCY_BOUNDED</code>.</li>
</ol>
<pre><code translate="no" class="language-python">collection_name = <span class="hljs-string">&quot;hello_milmil_consist_bounded&quot;</span>
collection = <span class="hljs-title class_">Collection</span>(name=collection_name, schema=schema,
                        consistency_level=<span class="hljs-variable constant_">CONSISTENCY_BOUNDED</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search latency: 0.0144
search latency: 0.0104
search latency: 0.0107
search latency: 0.0104
search latency: 0.0102
completed
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>Jelas, latensi pencarian rata-rata di koleksi <code translate="no">CONSISTENCY_BOUNDED</code> lebih pendek 200ms dibandingkan dengan koleksi <code translate="no">CONSISTENCY_STRONG</code>.</li>
</ol>
<p>Apakah entitas yang dihapus langsung tidak terlihat jika tingkat konsistensi ditetapkan sebagai Kuat? Jawabannya adalah Ya. Anda masih bisa mencoba hal ini sendiri.</p>
<h2 id="Handoff" class="common-anchor-header">Handoff<button data-href="#Handoff" class="anchor-icon" translate="no">
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
    </button></h2><p>Bekerja dengan kumpulan data streaming, banyak pengguna yang terbiasa membangun indeks dan memuat koleksi sebelum memasukkan data ke dalamnya. Pada rilis Milvus sebelumnya, pengguna harus memuat koleksi secara manual setelah pembuatan indeks untuk mengganti data mentah dengan indeks, yang mana hal ini lambat dan melelahkan. Fitur handoff memungkinkan Milvus 2.0 untuk secara otomatis memuat segmen yang diindeks untuk menggantikan data streaming yang mencapai ambang batas pengindeksan tertentu, sehingga meningkatkan kinerja pencarian.</p>
<ol start="8">
<li>Bangun indeks dan muat koleksi sebelum memasukkan lebih banyak entitas.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># index</span>
index_params = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">64</span>}}
collection.create_index(field_name=embedding_field.name, index_params=index_params)
<span class="hljs-comment"># load</span>
collection.load()
<button class="copy-code-btn"></button></code></pre>
<ol start="9">
<li>Masukkan 50.000 baris entitas sebanyak 200 kali (kumpulan vektor yang sama digunakan demi kenyamanan, tetapi ini tidak akan memengaruhi hasil).</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> random
<span class="hljs-comment"># insert data with customized ids</span>
nb = <span class="hljs-number">50000</span>
ids = [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
ages = [random.randint(<span class="hljs-number">20</span>, <span class="hljs-number">40</span>) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
embeddings = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
entities = [ids, ages, embeddings]
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">200</span>):
    ins_res = collection.insert(entities)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;insert entities primary keys: <span class="hljs-subst">{ins_res.primary_keys}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="10">
<li>Periksa informasi segmen pemuatan di simpul kueri selama dan setelah penyisipan.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># did this in another python console</span>
utility.get_query_segment_info(<span class="hljs-string">&quot;hello_milmil_handoff&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="11">
<li>Anda akan menemukan bahwa semua segmen yang disegel yang dimuat ke simpul kueri diindeks.</li>
</ol>
<pre><code translate="no">[<span class="hljs-attr">segmentID</span>: <span class="hljs-number">430640405514551298</span>
<span class="hljs-attr">collectionID</span>: <span class="hljs-number">430640403705757697</span>
<span class="hljs-attr">partitionID</span>: <span class="hljs-number">430640403705757698</span>
<span class="hljs-attr">mem_size</span>: <span class="hljs-number">394463520</span>
<span class="hljs-attr">num_rows</span>: <span class="hljs-number">747090</span>
<span class="hljs-attr">index_name</span>: <span class="hljs-string">&quot;_default_idx&quot;</span>
<span class="hljs-attr">indexID</span>: <span class="hljs-number">430640403745079297</span>
<span class="hljs-attr">nodeID</span>: <span class="hljs-number">7</span>
<span class="hljs-attr">state</span>: <span class="hljs-title class_">Sealed</span>
, <span class="hljs-attr">segmentID</span>: <span class="hljs-number">430640405514551297</span>
<span class="hljs-attr">collectionID</span>: <span class="hljs-number">430640403705757697</span>
<span class="hljs-attr">partitionID</span>: <span class="hljs-number">430640403705757698</span>
<span class="hljs-attr">mem_size</span>: <span class="hljs-number">397536480</span>
<span class="hljs-attr">num_rows</span>: <span class="hljs-number">752910</span>
<span class="hljs-attr">index_name</span>: <span class="hljs-string">&quot;_default_idx&quot;</span>
<span class="hljs-attr">indexID</span>: <span class="hljs-number">430640403745079297</span>
<span class="hljs-attr">nodeID</span>: <span class="hljs-number">7</span>
<span class="hljs-attr">state</span>: <span class="hljs-title class_">Sealed</span>
...
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-more" class="common-anchor-header">Terlebih lagi<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain fungsi-fungsi di atas, fitur-fitur baru seperti Pemadatan Data, Keseimbangan Beban Dinamis, dan banyak lagi telah diperkenalkan ke dalam Milvus 2.0. Selamat menikmati perjalanan eksplorasi Anda dengan Milvus!</p>
<p>Dalam waktu dekat, kami akan membagikan kepada Anda serangkaian blog yang memperkenalkan desain fitur-fitur baru di Milvus 2.0.</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Penghapusan</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Pemadatan Data</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Keseimbangan Beban Dinamis</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bitset</a></li>
</ul>
<p>Temukan kami di:</p>
<ul>
<li><a href="https://github.com/milvus-io/milvus">GitHub</a></li>
<li><a href="https://milvus.io/">Milvus.io</a></li>
<li><a href="https://slack.milvus.io/">Saluran Kendur</a></li>
</ul>
