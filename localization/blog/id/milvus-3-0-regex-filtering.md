---
id: milvus-3-0-regex-filtering.md
title: >-
  Melampaui =~: Bagaimana Milvus 3.0 Mengubah Regex menjadi Filter Database
  Native
author: Buqian Zheng
date: 2026-8-5
cover: assets.zilliz.com/regex_optimization_pipeline_with_milvus_57a9037801.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, vector search, regex filtering, full-text search'
meta_title: |
  Beyond =~: How Milvus 3.0 Turns Regex into a Native Database Filter
desc: >-
  Milvus 3.0 memindahkan regex dari pascapemrosesan di sisi aplikasi ke dalam
  jalur kueri database, tempat regex dapat digabungkan dengan pencarian vektor,
  pencarian teks lengkap, filter skalar, dan eksekusi terindeks.
origin: 'https://milvus.io/blog/milvus-3-0-regex-filtering.md'
---
<p>Pencarian vektor dapat menemukan log yang secara semantik mirip dengan sebuah insiden. Namun, saat terjadi gangguan, kemiripan hanyalah penyaringan awal. Engineer sering kali perlu mempersempit hasil tersebut dengan batasan struktural, bukan semantik.</p>
<p>Pertimbangkan kegagalan pada layanan checkout. Kita menginginkan log yang terkait dengan insiden yang sedang ditangani, tetapi hanya dari <code translate="no">checkout</code>. Pesan harus berisi kode error dalam bentuk <code translate="no">E</code> diikuti empat digit, dan kode tersebut harus muncul sebelum <code translate="no">timeout</code>.</p>
<pre><code translate="no" class="language-python">results = client.search(
    collection_name=<span class="hljs-string">&quot;logs&quot;</span>,
    data=[incident_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">r&#x27;service == &quot;checkout&quot; and message =~ r&quot;E[0-9]{4}:.*timeout&quot;&#x27;</span>,
    limit=<span class="hljs-number">20</span>,
    output_fields=[<span class="hljs-string">&quot;timestamp&quot;</span>, <span class="hljs-string">&quot;service&quot;</span>, <span class="hljs-string">&quot;message&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Pencarian vektor dan regex melakukan pekerjaan yang berbeda dalam kueri ini. Kemiripan vektor mengambil log yang menyerupai insiden; filter regex hanya mempertahankan log yang cocok dengan signature kegagalan yang kita pedulikan.</p>
<p>Milvus 3.0 menambahkan operator <code translate="no">=~</code> dan <code translate="no">!~</code> untuk jenis filter ini. Mendukung operator tersebut dalam database melibatkan lebih dari sekadar mem-parsing sintaks regex: <strong>Milvus harus memvalidasi pola yang diberikan pengguna, mempertahankan semantik null dan negasi, mengintegrasikan regex dengan perencanaan kueri dan pengindeksan, serta menjaga biayanya tetap dapat diprediksi di jutaan string.</strong></p>
<p>Dengan rilis terbaru, Milvus 3.0 memindahkan regex dari post-processing di sisi aplikasi ke jalur kueri database, tempat regex dapat dikombinasikan dengan pencarian vektor, pencarian full-text, filter skalar, dan eksekusi terindeks. Artikel ini membahas pilihan desain tersebut, mulai dari semantik operator dan validasi RE2 hingga eksekusi mentah, pembuatan kandidat NGRAM, dan hasil benchmark.</p>
<h2 id="Where-regex-fits-in-Milvus-filtering" class="common-anchor-header">Di mana regex masuk dalam filtering Milvus<button data-href="#Where-regex-fits-in-Milvus-filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum dukungan regex, Milvus sudah dapat mengekspresikan pola string sederhana dengan <code translate="no">LIKE</code>:</p>
<pre><code translate="no"><span class="hljs-title class_">Plaintext</span>
message <span class="hljs-variable constant_">LIKE</span> <span class="hljs-string">&quot;ERROR%&quot;</span>
message <span class="hljs-variable constant_">LIKE</span> <span class="hljs-string">&quot;%timeout%&quot;</span>
message <span class="hljs-variable constant_">LIKE</span> <span class="hljs-string">&quot;node_12_&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">LIKE</code> sederhana dan mudah dibaca. Untuk filter prefix, suffix, dan contains biasa, operator ini juga memberi engine eksekusi peluang untuk menggunakan jalur yang lebih langsung. Namun, jangkauan ekspresifnya berhenti pada dua aturan wildcard: <code translate="no">%</code> untuk nol atau lebih karakter dan <code translate="no">_</code> untuk tepat satu karakter.</p>
<p><code translate="no">Like</code> tidak cukup untuk pola seperti:</p>
<ul>
<li>Kode error: <code translate="no">E[0-9]{4}</code></li>
<li>Versi semantik: <code translate="no">v[0-9]+.[0-9]+.[0-9]+</code></li>
<li>Beberapa state: <code translate="no">ERROR|WARN</code></li>
<li>Route URL: <code translate="no">^/api/v[0-9]+/users/[0-9]+$</code></li>
<li>Urutan yang diwajibkan: <code translate="no">checkout.*timeout</code></li>
<li>Teks case-insensitive: <code translate="no">(?i)connection refused</code></li>
</ul>
<p>Menguraikan struktur ini menjadi sekumpulan besar ekspresi <code translate="no">LIKE</code>, range, dan Boolean sulit dipelihara dan mudah salah di bagian tepi. <strong>Regex mengisi celah antara pencocokan wildcard sederhana dan retrieval berbasis token atau semantik.</strong> Regex mendeskripsikan struktur string; regex tidak menggantikan relevansi full-text atau kemiripan vektor.</p>
<p>Operator yang paling jelas biasanya adalah yang terbaik untuk digunakan:</p>
<table>
<thead>
<tr><th>Kebutuhan</th><th>Operasi yang direkomendasikan</th></tr>
</thead>
<tbody>
<tr><td>Nilai persis</td><td><code translate="no">==</code> / <code translate="no">IN</code></td></tr>
<tr><td>Prefix, suffix, atau substring sederhana</td><td><code translate="no">LIKE</code></td></tr>
<tr><td>Kelas karakter, pengulangan, anchor, atau urutan struktural</td><td>Regex <code translate="no">=~</code> / <code translate="no">!~</code></td></tr>
<tr><td>Relevansi leksikal tingkat token</td><td><code translate="no">text_match</code> / BM25</td></tr>
<tr><td>Frasa berurutan</td><td><code translate="no">phrase_match</code></td></tr>
<tr><td>Variasi tipografis</td><td>Milvus saat ini tidak memiliki fuzzy match native; tangani di layer aplikasi</td></tr>
</tbody>
</table>
<p>Pola seperti <code translate="no">^ERROR</code> atau <code translate="no">timeout$</code> adalah regex yang valid, dan parser dapat menulis ulang pola tersebut ke jalur eksekusi yang lebih murah. Meski begitu, memilih operator yang menyatakan intent secara paling langsung membuat filter lebih mudah dibaca dan dipelihara.</p>
<h2 id="User-facing-semantics---anchors-and-raw-strings" class="common-anchor-header">Semantik yang terlihat oleh pengguna: <code translate="no">=~</code>, <code translate="no">!~</code>, anchor, dan raw string<button data-href="#User-facing-semantics---anchors-and-raw-strings" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 menggunakan <code translate="no">=~</code> untuk pencocokan regex positif dan <code translate="no">!~</code> untuk pencocokan negatif:</p>
<ul>
<li><code translate="no">message =~ &quot;E[0-9]{4}&quot;</code> mempertahankan baris yang string-nya berisi kode error yang cocok.</li>
<li><code translate="no">message !~ &quot;DEBUG|TRACE&quot;</code> mengecualikan baris yang string-nya cocok dengan salah satu alternatif.</li>
<li><code translate="no">message =~ &quot;timeout&quot;</code> menggunakan semantik substring dan mencocokkan string apa pun yang berisi <code translate="no">timeout</code>.</li>
<li><code translate="no">message =~ &quot;^timeout$&quot;</code> menggunakan <code translate="no">^</code> dan <code translate="no">$</code> untuk mewajibkan pencocokan seluruh string.</li>
</ul>
<p>Regex dapat menargetkan beberapa jenis nilai string. Untuk field array dan StructArray, ekspresi harus mengidentifikasi elemen string atau subfield string tertentu:</p>
<ul>
<li>Field <code translate="no">VARCHAR</code>: <code translate="no">message =~ r&quot;timeout&quot;</code></li>
<li>Path JSON yang resolve ke string: <code translate="no">metadata[&quot;error_message&quot;] =~ r&quot;E[0-9]{4}:.*timeout&quot;</code></li>
<li>Satu elemen dari <code translate="no">ARRAY&lt;VARCHAR&gt;</code>: <code translate="no">tags[0] =~ r&quot;release-v[0-9]+&quot;</code></li>
<li>Subfield <code translate="no">VARCHAR</code> di dalam ekspresi StructArray: <code translate="no">MATCH_ANY(events, $[name] =~ r&quot;error.*timeout&quot;)</code></li>
</ul>
<h2 id="Raw-strings-keep-escaping-manageable" class="common-anchor-header">Raw string menjaga escaping tetap mudah dikelola<button data-href="#Raw-strings-keep-escaping-manageable" class="anchor-icon" translate="no">
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
    </button></h2><p>Pola regex sering berisi backslash. Milvus 3.0 mendukung literal raw string dalam ekspresi filter. Contohnya:</p>
<pre><code translate="no" class="language-python">filter_expr = <span class="hljs-string">r&#x27;message =~ r&quot;\d+.\d+.\d+&quot;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">r&quot;...&quot;</code> di bagian dalam memberi tahu parser ekspresi Milvus untuk mempertahankan backslash. Raw string Python di bagian luar kemudian mencegah layer bahasa aplikasi, ekspresi Milvus, dan regex melipatgandakan aturan escaping.</p>
<p>Template filter juga berfungsi dengan regex:</p>
<pre><code translate="no" class="language-python">client.query(
    collection_name=<span class="hljs-string">&quot;logs&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;message =~ {pattern}&quot;</span>,
    filter_params={<span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">r&quot;E[0-9]{4}:.*timeout&quot;</span>},
    output_fields=[<span class="hljs-string">&quot;message&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Meneruskan pola sebagai parameter template lebih aman daripada menggabungkan string ekspresi dan memungkinkan template kueri yang sama digunakan ulang.</p>
<h2 id="Why-Milvus-uses-RE2-database-regex-must-have-predictable-cost" class="common-anchor-header">Mengapa Milvus menggunakan RE2: regex database harus memiliki biaya yang dapat diprediksi<button data-href="#Why-Milvus-uses-RE2-database-regex-must-have-predictable-cost" class="anchor-icon" translate="no">
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
    </button></h2><p>Banyak engine regex menggunakan backtracking. Pola yang dirancang dengan cermat dapat memaksa waktu eksekusinya tumbuh secara eksponensial terhadap panjang input, sebuah mode kegagalan yang umum disebut catastrophic backtracking atau regular expression denial of service (ReDoS).</p>
<p>Dalam skrip lokal, pola patologis dapat membuat satu proses macet. Dalam database, pola adalah input kueri. Satu request dapat menerapkannya ke jutaan baris sementara banyak pengguna mengirimkan pola lain secara bersamaan. Jika eksekusi kasus terburuk tidak terbatas, filter yang tampak biasa dapat menghabiskan CPU di seluruh layanan.</p>
<p>Milvus menggunakan RE2 karena RE2 menjamin waktu pencocokan yang linear terhadap panjang input. <strong>Tradeoff ini disengaja: RE2 tidak mendukung konstruksi yang bergantung pada backtracking, termasuk:</strong></p>
<ul>
<li>Backreference</li>
<li>Lookahead</li>
<li>Lookbehind</li>
</ul>
<p><strong>Milvus mengutamakan eksekusi yang dapat diprediksi dibanding sintaks regex seluas mungkin. Sebelum filter mencapai jalur scan, parser ekspresi mengompilasi dan memvalidasi polanya. Regex yang tidak valid mengembalikan error sebelum Milvus mulai memindai data.</strong></p>
<h2 id="From-syntax-to-execution-a-layered-path" class="common-anchor-header">Dari sintaks ke eksekusi: jalur berlapis<button data-href="#From-syntax-to-execution-a-layered-path" class="anchor-icon" translate="no">
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
    </button></h2><p>Implementasi paling sederhana akan mengompilasi pola dan memanggil RE2 sekali untuk setiap baris. Itu akan menghasilkan kecocokan yang benar, tetapi akan mengabaikan struktur yang sudah diketahui database tentang pola, sisa filter, dan indeks yang tersedia.</p>
<p>Milvus sebagai gantinya menggunakan jalur eksekusi berlapis. Setiap layer hanya menerapkan reduksi yang mempertahankan kebenaran. Ketika engine tidak dapat membuktikan bahwa shortcut aman, engine kembali ke verifikasi RE2 penuh.</p>
<h3 id="1-Rewrite-regex-that-is-really-a-cheaper-string-operation" class="common-anchor-header">1. Tulis ulang regex yang sebenarnya merupakan operasi string yang lebih murah</h3><p>Beberapa pola regex sama sekali tidak membutuhkan engine regex:</p>
<table>
<thead>
<tr><th>Pola</th><th>Operasi hasil penulisan ulang</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">^ERROR$</code></td><td>Equality</td></tr>
<tr><td><code translate="no">^ERROR</code></td><td>Prefix match</td></tr>
<tr><td><code translate="no">ERROR$</code></td><td>Suffix match</td></tr>
</tbody>
</table>
<p>Parser mengenali literal ber-anchor ini dan menulis ulangnya menjadi operasi yang lebih murah.</p>
<p>Literal tanpa anchor seperti <code translate="no">ERROR</code> memiliki semantik yang berbeda: literal tersebut menanyakan apakah <code translate="no">ERROR</code> muncul di mana saja dalam string. Dalam implementasi saat ini, pola sederhana ber-anchor menjadi operasi equality, prefix, atau suffix, sementara literal biasa tanpa anchor tetap menjadi ekspresi <code translate="no">RegexMatch</code>.</p>
<h3 id="2-Treat-regex-as-a-heavy-predicate" class="common-anchor-header">2. Perlakukan regex sebagai predikat berat</h3><p>Pertimbangkan filter gabungan:</p>
<pre><code translate="no">Plaintext
service_id == <span class="hljs-number">42</span> <span class="hljs-keyword">and</span> message =~ <span class="hljs-string">r&quot;E[0-9]{4}:.*timeout&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pemeriksaan equality numerik atau filter terindeks yang sudah ada biasanya lebih murah daripada regex. Milvus menandai regex sebagai predikat berat sehingga planner dapat menjalankan kondisi yang lebih murah terlebih dahulu dan menerapkan RE2 ke set kandidat yang lebih kecil.</p>
<p>Benchmark nanti dalam artikel ini secara sengaja mengecualikan pencarian vektor dan filter gabungan, sehingga tidak mencampurkan biaya approximate nearest neighbor (ANN), indeks skalar, dan regex. Dalam kueri produksi, pengurutan predikat tetap menjadi bagian dari jalur eksekusi lengkap.</p>
<h3 id="3-On-the-raw-path-compile-once-and-prefilter-required-literals" class="common-anchor-header">3. Pada jalur mentah, kompilasi sekali dan prefilter literal yang diwajibkan</h3><p>Tanpa indeks NGRAM, segmen sealed membaca string asli dan mengevaluasi kecocokan. Milvus menggunakan ulang pola RE2 yang sudah dikompilasi pada cakupan segmen, bukan mengompilasinya sekali per baris.</p>
<p>Untuk pola dengan literal wajib yang stabil, seperti:</p>
<pre><code translate="no">Plaintext
ERROR.*<span class="hljs-built_in">timeout</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus dapat terlebih dahulu menggunakan pencarian string Volnitsky untuk menemukan baris yang mungkin berisi literal wajib tersebut. Hanya baris-baris itu yang lanjut ke verifikasi RE2 yang tepat.</p>
<p>Volnitsky adalah prefilter, bukan pengganti regex. String yang berisi <code translate="no">ERROR</code> dan <code translate="no">timeout</code> belum tentu memenuhi urutannya atau pola lengkapnya. Tugas prefilter hanya mengurangi jumlah panggilan RE2 yang lebih mahal.</p>
<h3 id="4-With-NGRAM-generate-candidates-first-and-verify-them-with-RE2" class="common-anchor-header">4. Dengan NGRAM, buat kandidat terlebih dahulu dan verifikasi dengan RE2</h3><p>Untuk dataset sealed yang besar, field string dapat memiliki indeks NGRAM:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;message&quot;</span>,
    index_type=<span class="hljs-string">&quot;NGRAM&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;min_gram&quot;</span>: <span class="hljs-number">4</span>, <span class="hljs-string">&quot;max_gram&quot;</span>: <span class="hljs-number">4</span>},
)
client.create_index(<span class="hljs-string">&quot;logs&quot;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<p>NGRAM tidak mengeksekusi regex itu sendiri. NGRAM memperkenalkan jalur dua fase:</p>
<ol>
<li>Ekstrak secara konservatif literal yang harus muncul dalam setiap kecocokan.</li>
<li>Pecah literal tersebut menjadi n-gram dan lakukan intersect pada posting list-nya untuk menghasilkan bitmap kandidat.</li>
<li>Baca string asli hanya untuk baris kandidat.</li>
<li>Jalankan RE2 pada kandidat tersebut untuk menghasilkan hasil yang tepat.</li>
</ol>
<p>Untuk <code translate="no">ERROR.*timeout</code>, misalkan hanya 0,1% dari 10 juta baris yang berisi literal wajib. Fase 1 dapat menghapus hampir seluruh dataset sebelum RE2 berjalan. Peningkatan performa berasal dari reduksi kandidat, bukan dari aproksimasi regex.</p>
<p>Pemisahan ini juga melindungi kebenaran. Kondisi yang tidak dapat diekstrak dengan aman tidak diizinkan mengeliminasi baris, dan RE2 tetap memutuskan setiap kecocokan akhir. Karena itu, coarse filter NGRAM tidak menimbulkan false negative.</p>
<h3 id="5-Fall-back-when-candidate-reduction-is-not-provably-safe" class="common-anchor-header">5. Fall back ketika reduksi kandidat tidak dapat dibuktikan aman</h3><p>Tidak setiap pola mengekspos literal tetap yang berguna:</p>
<pre><code translate="no">Plaintext
E[0-9]{4}
ERROR|WARN
(?i)error.*<span class="hljs-built_in">timeout</span>
<button class="copy-code-btn"></button></code></pre>
<p>Kelas karakter mungkin hanya menyisakan literal yang sangat pendek. Alternation memerlukan reasoning lintas beberapa cabang, dan pencocokan case-insensitive memerlukan case folding. Dalam implementasi saat ini, pola alternation dan <code translate="no">(?i)</code> melewati coarse filter NGRAM dan kembali ke verifikasi mentah.</p>
<p>Fallback tersebut adalah batas yang benar untuk optimasi indeks. Jika Milvus tidak dapat membuktikan bahwa reduksi kandidat aman, Milvus tidak menggunakannya.</p>
<h2 id="-must-preserve-UNKNOWN-not-just-invert-a-bitmap" class="common-anchor-header"><code translate="no">!~</code> harus mempertahankan UNKNOWN, bukan sekadar membalik bitmap<button data-href="#-must-preserve-UNKNOWN-not-just-invert-a-bitmap" class="anchor-icon" translate="no">
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
    </button></h2><p>Begitu regex masuk ke bahasa ekspresi database, kasus-kasus sulit tidak terbatas pada sintaks pola. Nullability juga penting.</p>
<p>Pertimbangkan tiga record JSON:</p>
<pre><code translate="no" class="language-json">{<span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;request timeout&quot;</span>}
{<span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;request completed&quot;</span>}
{}
<button class="copy-code-btn"></button></code></pre>
<p>Record ketiga tidak memiliki <code translate="no">message</code>. Berdasarkan logika tiga nilai yang dijelaskan oleh desain ini, engine tidak dapat membuktikan bahwa nilai yang hilang tersebut cocok maupun tidak cocok, sehingga hasilnya adalah <code translate="no">UNKNOWN</code>:</p>
<table>
<thead>
<tr><th>Input</th><th><code translate="no">message =~ &quot;timeout&quot;</code></th><th><code translate="no">message !~ &quot;timeout&quot;</code></th></tr>
</thead>
<tbody>
<tr><td><code translate="no">&quot;request timeout&quot;</code></td><td>TRUE</td><td>FALSE</td></tr>
<tr><td><code translate="no">&quot;request completed&quot;</code></td><td>FALSE</td><td>TRUE</td></tr>
<tr><td>NULL / path hilang / tipe tidak valid</td><td>UNKNOWN</td><td>UNKNOWN</td></tr>
</tbody>
</table>
<p>Klausa <code translate="no">WHERE</code> atau <code translate="no">filter</code> hanya mengembalikan baris yang ekspresinya bernilai <code translate="no">TRUE</code>, sehingga baris terakhir dikecualikan oleh kedua operator.</p>
<p>Mengimplementasikan <code translate="no">!~</code> sebagai inversi Boolean biasa akan salah. Path yang hilang yang direpresentasikan sebagai <code translate="no">false</code> akan menjadi <code translate="no">true</code>, dan entitas tanpa nilai akan muncul secara tidak terduga dalam kueri “does not match”. Milvus merepresentasikan <code translate="no">!~</code> sebagai <code translate="no">NOT (=~)</code> sambil mempertahankan bitmap validitas, menjaga <code translate="no">UNKNOWN</code> tetap konsisten di jalur mentah dan terindeks.</p>
<p>Inilah perbedaan antara menempelkan library string ke executor dan mengimplementasikan regex sebagai predikat database.</p>
<h2 id="Benchmark-NGRAM-helps-when-literals-shrink-the-candidate-set" class="common-anchor-header">Benchmark: NGRAM membantu ketika literal memperkecil set kandidat<button data-href="#Benchmark-NGRAM-helps-when-literals-shrink-the-candidate-set" class="anchor-icon" translate="no">
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
    </button></h2><p>Benchmark mengisolasi filtering regex di atas segmen sealed sehingga hasilnya mencerminkan scanning string mentah, pembuatan kandidat NGRAM, dan verifikasi RE2. Benchmark ini mengecualikan growing segment, pencarian vektor, dan filter gabungan.</p>
<h3 id="Dataset-and-controlled-selectivity" class="common-anchor-header">Dataset dan selektivitas terkontrol</h3><p>Pengujian menggunakan dataset publik <a href="https://github.com/logpai/loghub/tree/master/HDFS">Loghub HDFS_v1</a>:</p>
<ul>
<li>11.175.629 baris log sistem HDFS</li>
<li>1,47 GiB data mentah</li>
<li>38,7 jam log</li>
<li>10.000.000 baris valid pertama digunakan dalam eksperimen</li>
</ul>
<p>Distribusi panjang log, token, dan pengulangan asli dipertahankan. Untuk mengontrol tingkat kecocokan secara presisi, pengujian menambahkan marker benchmark ke sejumlah kecil baris yang dipilih dengan seed acak tetap:</p>
<pre><code translate="no">Plaintext
level=ERROR code=E4821 operation=checkout result=request_timeout
<button class="copy-code-btn"></button></code></pre>
<p>Target injeksi adalah 0,01%, 1%, 10%, dan 50%. Setiap varian dataset menggunakan pemilihan baris seeded dan aturan transformasi yang sama, sehingga data HDFS_v1 yang diberi marker dapat direproduksi. Pengujian konsistensi juga berjalan pada field log asli yang tidak dimodifikasi untuk memastikan bahwa tren optimasi yang diamati bukan artefak dari injeksi marker.</p>
<h3 id="Test-environment" class="common-anchor-header">Lingkungan pengujian</h3><table>
<thead>
<tr><th><strong>Item</strong></th><th><strong>Konfigurasi terukur</strong></th></tr>
</thead>
<tbody>
<tr><td>Commit Milvus</td><td><code translate="no">03762320e8</code></td></tr>
<tr><td>Deployment</td><td>Standalone, segmen sealed, 1 shard</td></tr>
<tr><td>Hardware</td><td>Apple M5 Pro, memori 48 GiB</td></tr>
<tr><td>Baris collection</td><td>10.000.000</td></tr>
<tr><td>Field</td><td>Lima field <code translate="no">VARCHAR(max_length=512)</code> ditambah placeholder <code translate="no">BINARY_VECTOR(dim=8)</code></td></tr>
<tr><td>NGRAM</td><td><code translate="no">min_gram=4</code>, <code translate="no">max_gram=4</code></td></tr>
<tr><td>Concurrency</td><td>1 untuk latensi, 32 untuk throughput</td></tr>
<tr><td>Repetition</td><td>2 warm-up run ditambah 5 run terukur; p50 / p95 / p99 dilaporkan</td></tr>
</tbody>
</table>
<p>Jalur mentah dan NGRAM menggunakan data dan urutan kueri yang sama. Hasil diukur setelah warm-up dan hanya mencakup perilaku warm-cache. Pengujian ini tidak mendukung kesimpulan tentang cold start atau latensi kueri pertama.</p>
<h3 id="Pattern-matrix" class="common-anchor-header">Matriks pola</h3><table>
<thead>
<tr><th>Pola</th><th>Jalur eksekusi utama</th><th>Apa yang diisolasi pengujian</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">^ERROR</code></td><td>Literal ber-anchor; pembuatan kandidat plus verifikasi prefix</td><td>Bagaimana verifikasi anchor berubah saat tingkat kandidat naik</td></tr>
<tr><td><code translate="no">ERROR.*timeout</code></td><td>Kaya literal; kandidat NGRAM plus RE2</td><td>Rentang di mana NGRAM seharusnya memberikan peningkatan paling jelas</td></tr>
<tr><td><code translate="no">E[0-9]{4}</code></td><td>Literal wajib lemah; 4-gram tetap memberi reduksi kecil</td><td>Apakah literal lemah mendekati biaya raw-scan</td></tr>
<tr><td>`ERROR</td><td>WARN`</td><td>Fallback alternation</td><td>Batas alternation saat ini</td></tr>
<tr><td><code translate="no">(?i)error.*timeout</code></td><td>Fallback case-insensitive</td><td>Batas case-insensitive saat ini</td></tr>
</tbody>
</table>
<p>Setiap pola dijalankan pada dua jalur segmen sealed:</p>
<ul>
<li>Tanpa indeks skalar: scan string mentah</li>
<li>Indeks NGRAM: pembuatan kandidat plus verifikasi RE2, dengan fallback otomatis ketika NGRAM tidak dapat digunakan</li>
</ul>
<h3 id="Latency-across-selectivity-levels" class="common-anchor-header">Latensi di berbagai tingkat selektivitas</h3><p>Setiap sel di bawah melaporkan <code translate="no">raw p50 ms / NGRAM p50 ms / speedup</code>. Nilai lebih besar dari <code translate="no">1x</code> berarti NGRAM lebih cepat.</p>
<table>
<thead>
<tr><th>Pola</th><th>0,01%</th><th>1%</th><th>10%</th><th>50%</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">^ERROR</code></td><td>12,65 / 6,99 / 1,81x</td><td>12,98 / 9,63 / 1,35x</td><td>12,73 / 10,98 / 1,16x</td><td>13,96 / 20,27 / 0,69x</td></tr>
<tr><td><code translate="no">ERROR.*timeout</code></td><td>24,31 / 7,47 / 3,26x</td><td>26,06 / 12,65 / 2,06x</td><td>39,86 / 30,44 / 1,31x</td><td>100,24 / 85,73 / 1,17x</td></tr>
<tr><td><code translate="no">E[0-9]{4}</code></td><td>17,24 / 16,43 / 1,05x</td><td>16,77 / 16,91 / 0,99x</td><td>22,14 / 22,18 / 1,00x</td><td>44,90 / 44,73 / 1,00x</td></tr>
<tr><td>`ERROR</td><td>WARN`</td><td>287,31 / 280,79 / 1,02x</td><td>282,81 / 285,40 / 0,99x</td><td>292,34 / 290,07 / 1,01x</td><td>315,69 / 312,57 / 1,01x</td></tr>
<tr><td><code translate="no">(?i)error.*timeout</code></td><td>73,66 / 72,58 / 1,01x</td><td>75,14 / 75,89 / 0,99x</td><td>86,58 / 86,35 / 1,00x</td><td>136,78 / 134,94 / 1,01x</td></tr>
</tbody>
</table>
<p>Pada selektivitas 1%, <code translate="no">ERROR.*timeout</code> juga menunjukkan peningkatan di luar latensi median: p95 turun dari 26,47 ms menjadi 13,03 ms, throughput pada concurrency 32 naik dari 72,70 menjadi 117,60 QPS (61,77%), dan waktu CPU per kueri turun 52,14%.</p>
<p>Pola <code translate="no">ERROR.*timeout</code> yang kaya literal mendapatkan manfaat paling besar. Saat selektivitas naik dari 0,01% ke 50%, speedup-nya turun dari 3,26x menjadi 1,17x karena lebih banyak baris lolos pembuatan kandidat dan tetap memerlukan RE2.</p>
<p>Pola dengan literal lemah, alternation, dan case-insensitive tetap kurang lebih setara dengan raw scan. Pola ber-anchor <code translate="no">^ERROR</code> membantu pada tingkat kandidat rendah tetapi turun menjadi 0,69x pada 50%. Dalam dataset ini, marker yang diinjeksi menempatkan <code translate="no">ERROR</code> di dekat akhir baris, sehingga jumlah final anchored match tetap nol. Fase 1 tetap menghasilkan set kandidat besar, dan kerja verifikasi tambahan membuat jalur terindeks lebih lambat.</p>
<h3 id="Candidate-reduction-explains-the-gain" class="common-anchor-header">Reduksi kandidat menjelaskan peningkatan</h3><p>Tabel berikutnya mengisolasi <code translate="no">ERROR.*timeout</code> dan menempatkan jumlah kandidat Fase 1 di samping latensi p50:</p>
<table>
<thead>
<tr><th>Tingkat injeksi</th><th>Kandidat Fase 1</th><th>Reduksi kandidat</th><th>Raw p50</th><th>NGRAM p50</th><th>Speedup</th></tr>
</thead>
<tbody>
<tr><td>0,01%</td><td>1.000</td><td>99,99%</td><td>24,31 ms</td><td>7,47 ms</td><td>3,26x</td></tr>
<tr><td>1%</td><td>100.000</td><td>99%</td><td>26,06 ms</td><td>12,65 ms</td><td>2,06x</td></tr>
<tr><td>10%</td><td>1.000.000</td><td>90%</td><td>39,86 ms</td><td>30,44 ms</td><td>1,31x</td></tr>
<tr><td>50%</td><td>5.000.000</td><td>50%</td><td>100,24 ms</td><td>85,73 ms</td><td>1,17x</td></tr>
</tbody>
</table>
<p>Hubungannya langsung. Mengurangi kandidat sebesar 99,99% menghasilkan speedup 3,26x; menguranginya hanya 50% menyisakan 1,17x. NGRAM memperoleh nilainya ketika literal wajib menghapus porsi besar baris sebelum verifikasi RE2.</p>
<p>Sumber data dan referensi:</p>
<ul>
<li><a href="https://github.com/logpai/loghub">Repositori Loghub</a></li>
<li><a href="https://github.com/logpai/loghub/tree/master/HDFS">Dataset HDFS_v1</a></li>
<li><a href="https://doi.org/10.5281/zenodo.8196385">Record dataset Zenodo</a></li>
<li>Jieming Zhu, Shilin He, Pinjia He, Jinyang Liu, dan Michael R. Lyu. <em>Loghub: A Large Collection of System Log Datasets for AI-driven Log Analytics</em>. ISSRE 2023.</li>
</ul>
<h2 id="Current-boundaries-and-likely-next-steps" class="common-anchor-header">Batasan saat ini dan kemungkinan langkah berikutnya<button data-href="#Current-boundaries-and-likely-next-steps" class="anchor-icon" translate="no">
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
    </button></h2><p>Filtering regex Milvus 3.0 memiliki beberapa batasan eksplisit:</p>
<ul>
<li>RE2 tidak mendukung backreference atau lookaround.</li>
<li>Regex adalah operasi filter; regex tidak menyediakan fungsi extract atau replace.</li>
<li>Pola case-insensitive <code translate="no">(?i)</code> saat ini tidak menggunakan coarse filter NGRAM.</li>
<li>Alternation saat ini tidak dipecah menjadi cabang NGRAM terpisah.</li>
<li>Pola tanpa literal wajib yang dapat diekstrak dengan aman akan fallback ke raw scan.</li>
<li>Keberadaan inverted index biasa tidak berarti filter regex akan menggunakannya; NGRAM adalah jalur utama percepatan regex yang dijelaskan di sini.</li>
</ul>
<p>Batasan tersebut menunjukkan ekstensi alami: NGRAM dengan case-folding, pemisahan cabang untuk alternation, dan eksekusi multi-pola yang lebih kaya. Optimasi semacam itu harus mempertahankan kontrak yang sama dengan desain saat ini: pembuatan kandidat boleh konservatif, tetapi hanya pencocokan tepat yang dapat menentukan hasil akhir.</p>
<h2 id="Regex-as-a-database-capability" class="common-anchor-header">Regex sebagai kapabilitas database<button data-href="#Regex-as-a-database-capability" class="anchor-icon" translate="no">
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
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Menambahkan <code translate="no">=~</code> ke grammar ekspresi adalah bagian yang mudah. Implementasi database juga harus menjawab pertanyaan yang lebih sulit:</p>
<ul>
<li>Dapatkah pengguna mengirimkan pola arbitrer tanpa menciptakan pekerjaan yang tidak terbatas?</li>
<li>Apakah null, path JSON yang hilang, dan negasi mempertahankan semantik yang konsisten?</li>
<li>Pola mana yang dapat ditulis ulang?</li>
<li>Baris mana yang harus mencapai RE2?</li>
<li>Kapan reduksi kandidat dari NGRAM membenarkan penggunaan indeks?</li>
</ul>
<p>Milvus 3.0 menjawabnya dengan jalur eksekusi berlapis. RE2 menyediakan batas keamanan yang dapat diprediksi. Parser mengenali operasi yang lebih sederhana. Planner menjalankan predikat yang lebih murah terlebih dahulu. Volnitsky dan NGRAM secara konservatif mengurangi kandidat. RE2 kemudian memverifikasi baris yang tersisa.</p>
<p>Itu membuat filtering regex lebih dari sekadar panggilan ke library regular expression di dalam database vektor. Regex menjadikan pola struktural bagian dari model eksekusi database yang sama dengan pencarian vektor, filter skalar, data JSON, dan retrieval terindeks.</p>
<h2 id="Try-regex-filtering-on-your-own-workload--and-the-rest-of-Milvus-30" class="common-anchor-header">Coba filtering regex pada workload Anda sendiri — dan bagian lain dari Milvus 3.0<button data-href="#Try-regex-filtering-on-your-own-workload--and-the-rest-of-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Filtering regex tersedia di Milvus 3.0. <a href="https://milvus.io/docs/pattern-matching.md">Panduan Pattern Matching</a> mencakup sintaks operator, target yang didukung, raw string, dan semantik pencocokan, sementara <a href="https://milvus.io/docs/ngram.md">panduan NGRAM</a> menjelaskan pola mana yang dapat dipercepat oleh indeks dan cara mengonfigurasinya.</p>
<p>Jika Anda mengevaluasi rilis Milvus 3.0 yang lebih luas, lihat:</p>
<ul>
<li>Milvus 3.0 <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog peluncuran</a></li>
<li>Milvus 3.0 <a href="https://milvus.io/docs/release_notes.md">catatan rilis</a></li>
<li>Blog fitur Milvus 3.0: <a href="https://milvus.io/blog/milvus-snapshots.md">Milvus Snapshots: Tampilan Collection Point-in-Time Tanpa Menyalin Data</a></li>
<li><a href="https://github.com/milvus-io/milvus">Repo GitHub Milvus</a></li>
</ul>
<h2 id="Come-talk-to-us" class="common-anchor-header">Mari berbincang dengan kami<button data-href="#Come-talk-to-us" class="anchor-icon" translate="no">
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
<li>Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Milvus Discord</a> — cara tercepat untuk mendapatkan jawaban dari orang-orang yang membangunnya.</li>
<li>Pesan <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus office hour</a> 20 menit jika Anda ingin menelusuri collection Anda sendiri bersama engineer.</li>
</ul>
