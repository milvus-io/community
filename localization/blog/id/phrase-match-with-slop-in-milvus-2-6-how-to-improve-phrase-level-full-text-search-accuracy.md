---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >-
  Pencocokan Frasa dengan Slop di Milvus 2.6: Cara Meningkatkan Akurasi
  Pencarian Teks Lengkap Tingkat Frasa
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  Pelajari bagaimana Pencocokan Frasa di Milvus 2.6 mendukung pencarian teks
  lengkap tingkat frasa dengan slop, memungkinkan pemfilteran kata kunci yang
  lebih toleran untuk produksi di dunia nyata.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>Karena data yang tidak terstruktur terus meledak dan model AI semakin pintar, pencarian vektor telah menjadi lapisan pengambilan default untuk banyak sistem AI-RAG pipeline, pencarian AI, agen, mesin rekomendasi, dan banyak lagi. Vector search berfungsi karena ia menangkap makna: tidak hanya kata-kata yang diketik pengguna, tetapi juga maksud di balik kata-kata tersebut.</p>
<p>Namun, begitu aplikasi ini masuk ke tahap produksi, tim sering kali menemukan bahwa pemahaman semantik hanyalah salah satu sisi dari masalah pencarian. Banyak beban kerja yang juga bergantung pada aturan tekstual yang ketat-seperti mencocokkan terminologi yang tepat, menjaga urutan kata, atau mengidentifikasi frasa yang memiliki makna teknis, hukum, atau operasional.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> menghilangkan pemisahan tersebut dengan memperkenalkan pencarian teks lengkap secara langsung ke dalam basis data vektor. Dengan token dan indeks posisi yang dibangun ke dalam mesin inti, Milvus dapat menafsirkan maksud semantik kueri sambil menerapkan batasan kata kunci dan tingkat frasa yang tepat. Hasilnya adalah sebuah pipeline pengambilan yang terpadu di mana makna dan struktur saling memperkuat satu sama lain, bukannya berada dalam sistem yang terpisah.</p>
<p><a href="https://milvus.io/docs/phrase-match.md">Pencocokan Frasa</a> adalah bagian penting dari kemampuan teks lengkap ini. Fitur ini mengidentifikasi urutan istilah yang muncul bersamaan dan secara berurutan - sangat penting untuk mendeteksi pola log, tanda tangan kesalahan, nama produk, dan teks apa pun yang susunan katanya menentukan makna. Dalam tulisan ini, kami akan menjelaskan cara kerja <a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> di <a href="https://milvus.io/">Milvus</a>, bagaimana <code translate="no">slop</code> menambahkan fleksibilitas yang diperlukan untuk teks dunia nyata, dan mengapa fitur-fitur ini membuat pencarian vektor-penuh-teks hibrida tidak hanya memungkinkan, tetapi juga praktis dalam satu basis data.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">Apa itu Pencocokan Frasa?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencocokan Frasa adalah jenis kueri teks lengkap di Milvus yang berfokus pada <em>struktur - khususnya</em>, apakah urutan kata muncul dalam urutan yang sama di dalam dokumen. Ketika tidak ada fleksibilitas yang diizinkan, kueri berperilaku ketat: istilah harus muncul bersebelahan dan berurutan. Oleh karena itu, kueri seperti <strong>"pembelajaran mesin robotika"</strong> hanya cocok jika ketiga kata tersebut muncul sebagai frasa yang berkesinambungan.</p>
<p>Tantangannya adalah bahwa teks asli jarang berperilaku serapi ini. Bahasa alamiah menimbulkan gangguan: kata sifat tambahan menyelinap masuk, log menyusun ulang bidang, nama produk mendapatkan pengubah, dan penulis manusia tidak menulis dengan mempertimbangkan mesin kueri. Pencocokan frasa yang ketat dapat dengan mudah rusak-satu kata yang disisipkan, satu kata yang diulang, atau satu istilah yang ditukar dapat menyebabkan kesalahan. Dan di banyak sistem AI, terutama yang menghadapi produksi, kehilangan baris log yang relevan atau frasa pemicu aturan tidak dapat diterima.</p>
<p>Milvus 2.6 mengatasi gesekan ini dengan mekanisme sederhana: <strong>slop</strong>. Slop mendefinisikan <em>jumlah ruang gerak yang diperbolehkan di antara</em> istilah-istilah <em>kueri</em>. Alih-alih memperlakukan frasa sebagai sesuatu yang rapuh dan tidak fleksibel, slop memungkinkan Anda untuk memutuskan apakah satu kata tambahan dapat ditoleransi, atau dua kata, atau bahkan apakah susunan ulang sedikit masih dianggap sebagai kecocokan. Hal ini mengubah pencarian frasa dari tes lulus-gagal biner menjadi alat pencarian yang terkendali dan dapat disesuaikan.</p>
<p>Untuk mengetahui mengapa hal ini penting, bayangkan mencari log untuk semua varian dari kesalahan jaringan yang sudah dikenal, yaitu <strong>"koneksi direset oleh rekan."</strong> Dalam praktiknya, log Anda mungkin akan terlihat seperti ini:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>Sekilas, semua ini mewakili kejadian yang sama. Tetapi metode pengambilan yang umum mengalami kesulitan:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 kesulitan dengan struktur.</h3><p>Metode ini memandang kueri sebagai sekumpulan kata kunci, mengabaikan urutan kemunculannya. Selama "koneksi" dan "rekan" muncul di suatu tempat, BM25 dapat memberi peringkat tinggi pada dokumen - bahkan jika frasa tersebut terbalik atau tidak terkait dengan konsep yang sebenarnya Anda cari.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">Pencarian vektor berjuang dengan kendala.</h3><p>Penyematan unggul dalam menangkap makna dan hubungan semantik, tetapi tidak dapat menerapkan aturan seperti "kata-kata ini harus muncul dalam urutan ini." Anda mungkin mengambil pesan yang terkait secara semantik, tetapi masih kehilangan pola struktural yang tepat yang diperlukan untuk debugging atau kepatuhan.</p>
<p>Pencocokan Frasa mengisi celah di antara kedua pendekatan ini. Dengan menggunakan <strong>slop</strong>, Anda dapat menentukan dengan tepat berapa banyak variasi yang dapat diterima:</p>
<ul>
<li><p><code translate="no">slop = 0</code> - Persis sama (Semua istilah harus muncul berdekatan dan berurutan).</p></li>
<li><p><code translate="no">slop = 1</code> - Izinkan satu kata tambahan (Meliputi variasi bahasa alami yang umum dengan satu istilah yang disisipkan.)</p></li>
<li><p><code translate="no">slop = 2</code> - Izinkan beberapa kata yang disisipkan (Menangani frasa yang lebih deskriptif atau bertele-tele.)</p></li>
<li><p><code translate="no">slop = 3</code> - Memungkinkan pengurutan ulang (Mendukung frasa yang dibalik atau disusun secara longgar, yang sering kali merupakan kasus tersulit dalam teks dunia nyata.)</p></li>
</ul>
<p>Alih-alih berharap algoritme penilaian "melakukannya dengan benar", Anda secara eksplisit menyatakan toleransi struktural yang dibutuhkan aplikasi Anda.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Bagaimana Pencocokan Frasa Bekerja di Milvus<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Didukung oleh pustaka mesin pencari <a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>, Pencocokan Frasa di Milvus diimplementasikan di atas indeks terbalik dengan informasi posisi. Alih-alih hanya memeriksa apakah istilah muncul dalam dokumen, Milvus memverifikasi bahwa istilah tersebut muncul dalam urutan yang benar dan dalam jarak yang dapat dikontrol.</p>
<p>Diagram di bawah ini mengilustrasikan prosesnya:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Tokenisasi Dokumen (dengan Posisi)</strong></p>
<p>Ketika dokumen dimasukkan ke dalam Milvus, bidang teks diproses oleh <a href="https://milvus.io/docs/analyzer-overview.md">penganalisis</a>, yang membagi teks menjadi token (kata atau istilah) dan mencatat posisi setiap token di dalam dokumen. Sebagai contoh, <code translate="no">doc_1</code> ditokenisasi sebagai: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. Pembuatan Indeks Terbalik</strong></p>
<p>Selanjutnya, Milvus membangun indeks terbalik. Alih-alih memetakan dokumen ke isinya, indeks terbalik memetakan setiap token ke dokumen-dokumen di mana token tersebut muncul, bersama dengan semua posisi token tersebut yang tercatat di setiap dokumen.</p>
<p><strong>3. Pencocokan Frasa</strong></p>
<p>Ketika kueri frasa dijalankan, Milvus pertama-tama menggunakan indeks terbalik untuk mengidentifikasi dokumen yang berisi semua token kueri. Kemudian memvalidasi setiap kandidat dengan membandingkan posisi token untuk memastikan istilah muncul dalam urutan yang benar dan dalam jarak <code translate="no">slop</code> yang diizinkan. Hanya dokumen yang memenuhi kedua kondisi tersebut yang dikembalikan sebagai kecocokan.</p>
<p>Diagram di bawah ini merangkum cara kerja Pencocokan Frasa dari ujung ke ujung.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">Cara Mengaktifkan Pencocokan Frasa di Milvus<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencocokan Frasa bekerja pada bidang bertipe <strong><code translate="no">VARCHAR</code></strong>yaitu tipe string di Milvus. Untuk menggunakannya, Anda harus mengonfigurasi skema koleksi Anda sehingga Milvus melakukan analisis teks dan menyimpan informasi posisi untuk bidang tersebut. Hal ini dilakukan dengan mengaktifkan dua parameter: <code translate="no">enable_analyzer</code> dan <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">Mengatur enable_analyzer dan enable_match</h3><p>Untuk mengaktifkan Pencocokan Frasa untuk bidang VARCHAR tertentu, setel kedua parameter ke <code translate="no">True</code> ketika mendefinisikan skema bidang. Bersama-sama, keduanya memberi tahu Milvus untuk:</p>
<ul>
<li><p>memberi<strong>tanda</strong> pada teks (melalui <code translate="no">enable_analyzer</code>), dan</p></li>
<li><p><strong>membangun indeks terbalik dengan offset posisi</strong> (melalui <code translate="no">enable_match</code>).</p></li>
</ul>
<p>Pencocokan Frasa bergantung pada kedua langkah tersebut: penganalisis memecah teks menjadi token, dan indeks pencocokan menyimpan di mana token-token tersebut muncul, memungkinkan kueri berbasis frasa dan slop yang efisien.</p>
<p>Di bawah ini adalah contoh konfigurasi skema yang mengaktifkan Pencocokan Frasa pada bidang <code translate="no">text</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">Pencarian dengan Pencocokan Frasa: Bagaimana Slop Mempengaruhi Kumpulan Kandidat<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah Anda mengaktifkan pencocokan untuk bidang VARCHAR di skema koleksi Anda, Anda dapat melakukan pencocokan frasa menggunakan ekspresi <code translate="no">PHRASE_MATCH</code>.</p>
<p>Catatan: Ekspresi <code translate="no">PHRASE_MATCH</code> tidak peka huruf besar/kecil. Anda dapat menggunakan <code translate="no">PHRASE_MATCH</code> atau <code translate="no">phrase_match</code>.</p>
<p>Dalam operasi pencarian, Pencocokan Frasa biasanya diterapkan sebelum pemeringkatan kemiripan vektor. Pertama-tama, ia menyaring dokumen berdasarkan batasan tekstual eksplisit, mempersempit kumpulan kandidat. Dokumen yang tersisa kemudian diberi peringkat ulang menggunakan penyematan vektor.</p>
<p>Contoh di bawah ini menunjukkan bagaimana nilai <code translate="no">slop</code> yang berbeda mempengaruhi proses ini. Dengan menyesuaikan parameter <code translate="no">slop</code>, Anda dapat secara langsung mengontrol dokumen mana yang lolos dari filter frasa dan melanjutkan ke tahap pemeringkatan vektor.</p>
<p>Misalkan Anda memiliki koleksi bernama <code translate="no">tech_articles</code> yang berisi lima entitas berikut ini:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>teks</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>Pembelajaran mesin meningkatkan efisiensi dalam analisis data berskala besar</td></tr>
<tr><td>2</td><td>Mempelajari pendekatan berbasis mesin sangat penting untuk kemajuan AI modern</td></tr>
<tr><td>3</td><td>Arsitektur mesin pembelajaran mendalam mengoptimalkan beban komputasi</td></tr>
<tr><td>4</td><td>Mesin dengan cepat meningkatkan kinerja model untuk pembelajaran yang berkelanjutan</td></tr>
<tr><td>5</td><td>Mempelajari algoritme mesin yang canggih memperluas kemampuan AI</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>Di sini, kami mengizinkan nilai 1. Filter diterapkan pada dokumen yang mengandung frasa "mesin pembelajaran" dengan sedikit fleksibilitas.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Mencocokkan hasil:</p>
<table>
<thead>
<tr><th>doc_id</th><th>teks</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>Mempelajari pendekatan berbasis mesin sangat penting untuk kemajuan AI modern</td></tr>
<tr><td>3</td><td>Arsitektur mesin pembelajaran mendalam mengoptimalkan beban komputasi</td></tr>
<tr><td>5</td><td>Mempelajari algoritme mesin tingkat lanjut memperluas kemampuan AI</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>Contoh ini mengizinkan slop 2, yang berarti bahwa hingga dua token tambahan (atau istilah yang dibalik) diperbolehkan di antara kata "mesin" dan "pembelajaran".</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Mencocokkan hasil:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>teks</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">Pembelajaran mesin meningkatkan efisiensi dalam analisis data berskala besar</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Arsitektur mesin pembelajaran mendalam mengoptimalkan beban komputasi</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>Dalam contoh ini, slop 3 memberikan fleksibilitas yang lebih besar. Filter mencari "pembelajaran mesin" dengan hingga tiga posisi token yang diperbolehkan di antara kata-kata tersebut.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Mencocokkan hasil:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>teks</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">Pembelajaran mesin meningkatkan efisiensi dalam analisis data berskala besar</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">Mempelajari pendekatan berbasis mesin sangat penting untuk kemajuan AI modern</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Arsitektur mesin pembelajaran mendalam mengoptimalkan beban komputasi</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">Mempelajari algoritme mesin tingkat lanjut memperluas kemampuan AI</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">Kiat Cepat: Apa yang Perlu Anda Ketahui Sebelum Mengaktifkan Pencocokan Frasa di Milvus<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencocokan Frasa menyediakan dukungan untuk pemfilteran tingkat frasa, tetapi mengaktifkannya melibatkan lebih dari sekadar konfigurasi waktu kueri. Akan sangat membantu jika Anda mengetahui pertimbangan terkait sebelum menerapkannya dalam pengaturan produksi.</p>
<ul>
<li><p>Mengaktifkan Pencocokan Frasa pada suatu bidang akan menciptakan indeks terbalik, yang meningkatkan penggunaan penyimpanan. Biaya yang tepat tergantung pada faktor-faktor seperti panjang teks, jumlah token unik, dan konfigurasi penganalisis. Ketika bekerja dengan bidang teks yang besar atau data dengan kardinalitas tinggi, biaya tambahan ini harus dipertimbangkan di awal.</p></li>
<li><p>Konfigurasi penganalisis adalah pilihan desain penting lainnya. Setelah penganalisis didefinisikan dalam skema pengumpulan, penganalisis tidak dapat diubah. Beralih ke penganalisis yang berbeda nantinya memerlukan penghapusan koleksi yang ada dan membuatnya kembali dengan skema baru. Karena alasan ini, pemilihan penganalisis harus diperlakukan sebagai keputusan jangka panjang, bukan sebagai percobaan.</p></li>
<li><p>Perilaku Pencocokan Frasa terkait erat dengan bagaimana teks diberi tanda. Sebelum menerapkan penganalisis ke seluruh koleksi, disarankan untuk menggunakan metode <code translate="no">run_analyzer</code> untuk memeriksa keluaran tokenisasi dan mengonfirmasi bahwa itu sesuai dengan harapan Anda. Langkah ini dapat membantu menghindari ketidakcocokan yang tidak kentara dan hasil kueri yang tidak diharapkan di kemudian hari. Untuk informasi lebih lanjut, lihat <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Ikhtisar Penganalisis</a>.</p></li>
</ul>
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
    </button></h2><p>Pencocokan Frasa adalah jenis pencarian teks lengkap inti yang memungkinkan batasan tingkat frasa dan posisi di luar pencocokan kata kunci sederhana. Dengan beroperasi pada urutan token dan kedekatan, ini menyediakan cara yang dapat diprediksi dan tepat untuk memfilter dokumen berdasarkan bagaimana istilah sebenarnya muncul dalam teks.</p>
<p>Dalam sistem pencarian modern, Pencocokan Frasa biasanya diterapkan sebelum pemeringkatan berbasis vektor. Pertama-tama, fitur ini membatasi kumpulan kandidat pada dokumen yang secara eksplisit memenuhi frasa atau struktur yang diperlukan. Pencarian vektor kemudian digunakan untuk menentukan peringkat hasil ini berdasarkan relevansi semantik. Pola ini sangat efektif dalam skenario seperti analisis log, pencarian dokumentasi teknis, dan jalur pipa RAG, di mana batasan tekstual harus diterapkan sebelum kesamaan semantik dipertimbangkan.</p>
<p>Dengan diperkenalkannya parameter <code translate="no">slop</code> di Milvus 2.6, Pencocokan Frasa menjadi lebih toleran terhadap variasi bahasa alami dengan tetap mempertahankan perannya sebagai mekanisme pemfilteran teks lengkap. Hal ini membuat batasan tingkat frasa menjadi lebih mudah untuk diterapkan dalam alur kerja pengambilan produksi.</p>
<p>👉 Cobalah dengan skrip <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">demo</a>, dan jelajahi <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> untuk melihat bagaimana pengambilan frasa sesuai dengan tumpukan Anda.</p>
<p>Ada pertanyaan atau ingin mendalami fitur-fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
