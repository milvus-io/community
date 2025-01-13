---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: >-
  Cara Menggunakan Data String untuk Memberdayakan Aplikasi Pencarian Kemiripan
  Anda
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: >-
  Gunakan data string untuk menyederhanakan proses pembuatan aplikasi pencarian
  kemiripan Anda sendiri.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Sampul</span> </span></p>
<p>Milvus 2.1 hadir dengan <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">beberapa pembaruan</a> yang <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">signifikan</a> yang membuat bekerja dengan Milvus menjadi lebih mudah. Salah satunya adalah dukungan terhadap tipe data string. Saat ini Milvus <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">mendukung tipe data</a> termasuk string, vektor, Boolean, bilangan bulat, bilangan floating-point, dan masih banyak lagi.</p>
<p>Artikel ini menyajikan sebuah pengenalan terhadap dukungan tipe data string. Baca dan pelajari apa yang bisa Anda lakukan dengan tipe data ini dan bagaimana cara menggunakannya.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">Apa yang dapat Anda lakukan dengan data string?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">Bagaimana cara mengelola data string di Milvus 2.1?</a><ul>
<li><a href="#Create-a-collection">Membuat sebuah koleksi</a></li>
<li><a href="#Insert-data">Menyisipkan dan menghapus data</a></li>
<li><a href="#Build-an-index">Membuat sebuah indeks</a></li>
<li><a href="#Hybrid-search">Pencarian hibrida</a></li>
<li><a href="#String-expressions">Ekspresi string</a></li>
</ul></li>
</ul>
<custom-h1>Apa yang dapat Anda lakukan dengan data string?</custom-h1><p>Dukungan tipe data string telah menjadi salah satu fungsi yang paling diharapkan oleh pengguna. Hal ini menyederhanakan proses pembuatan aplikasi dengan basis data vektor Milvus dan mempercepat kecepatan pencarian kemiripan dan kueri vektor, yang secara garis besar meningkatkan efisiensi dan mengurangi biaya pemeliharaan aplikasi apa pun yang sedang Anda kerjakan.</p>
<p>Secara khusus, Milvus 2.1 mendukung tipe data VARCHAR, yang menyimpan string karakter dengan panjang yang bervariasi. Dengan dukungan tipe data VARCHAR, Anda dapat:</p>
<ol>
<li>Mengelola data string secara langsung tanpa bantuan database relasional eksternal.</li>
</ol>
<p>Dukungan tipe data VARCHAR memungkinkan Anda untuk melewatkan langkah mengubah string menjadi tipe data lain saat memasukkan data ke dalam Milvus. Katakanlah Anda sedang mengerjakan sistem pencarian buku untuk toko buku online Anda sendiri. Anda sedang membuat kumpulan data buku dan ingin mengidentifikasi buku-buku tersebut dengan namanya. Pada versi sebelumnya di mana Milvus tidak mendukung tipe data string, sebelum memasukkan data ke dalam Milvus, Anda mungkin perlu terlebih dahulu mengubah string (nama-nama buku) menjadi ID buku dengan bantuan basis data relasional seperti MySQL. Saat ini, karena tipe data string sudah didukung, Anda cukup membuat sebuah field string dan langsung memasukkan nama-nama buku dan bukan nomor ID-nya.</p>
<p>Kemudahan ini juga berlaku pada proses pencarian dan query. Bayangkan ada seorang klien yang memiliki buku favorit berjudul <em>Hello Milvus</em>. Anda ingin mencari buku-buku yang serupa di dalam sistem dan merekomendasikannya kepada klien. Pada versi Milvus sebelumnya, sistem hanya akan mengembalikan ID buku dan Anda perlu mengambil langkah ekstra untuk memeriksa informasi buku yang sesuai dalam database relasional. Namun di Milvus 2.1, Anda dapat secara langsung mendapatkan nama-nama buku karena Anda telah membuat field string dengan nama-nama buku di dalamnya.</p>
<p>Singkatnya, dukungan tipe data string membuat Anda tidak perlu lagi beralih ke alat lain untuk mengelola data string, yang sangat menyederhanakan proses pengembangan.</p>
<ol start="2">
<li>Mempercepat kecepatan <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">pencarian hibrida</a> dan <a href="https://milvus.io/docs/v2.1.x/query.md">kueri vektor</a> melalui pemfilteran atribut.</li>
</ol>
<p>Seperti tipe data skalar lainnya, VARCHAR dapat digunakan untuk pemfilteran atribut dalam pencarian hibrida dan kueri vektor melalui ekspresi Boolean. Perlu disebutkan bahwa Milvus 2.1 menambahkan operator <code translate="no">like</code>, yang memungkinkan Anda untuk melakukan pencocokan awalan. Selain itu, Anda juga dapat melakukan pencocokan tepat dengan menggunakan operator <code translate="no">==</code>.</p>
<p>Selain itu, indeks terbalik berbasis MARISA-trie juga didukung untuk mempercepat pencarian dan kueri hibrida. Lanjutkan untuk membaca dan mencari tahu semua ekspresi string yang mungkin ingin Anda ketahui untuk melakukan pemfilteran atribut dengan data string.</p>
<custom-h1>Bagaimana cara mengelola data string di Milvus 2.1?</custom-h1><p>Sekarang kita tahu bahwa tipe data string sangat berguna, tetapi kapan tepatnya kita perlu menggunakan tipe data ini dalam membangun aplikasi kita sendiri? Berikut ini, Anda akan melihat beberapa contoh kode skenario yang mungkin melibatkan data string, yang akan memberikan Anda pemahaman yang lebih baik tentang bagaimana mengelola data VARCHAR di Milvus 2.1.</p>
<h2 id="Create-a-collection" class="common-anchor-header">Membuat sebuah koleksi<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita ikuti contoh sebelumnya. Anda masih bekerja pada sistem rekomendasi buku dan ingin membuat sebuah koleksi buku dengan sebuah field kunci utama bernama <code translate="no">book_name</code>, di mana Anda akan menyisipkan data string. Dalam hal ini, Anda dapat mengatur tipe data sebagai <code translate="no">DataType.VARCHAR</code>ketika mengatur skema field, seperti yang ditunjukkan pada contoh di bawah ini.</p>
<p>Perhatikan bahwa ketika membuat bidang VARCHAR, Anda perlu menentukan panjang karakter maksimum melalui parameter <code translate="no">max_length</code> yang nilainya dapat berkisar dari 1 hingga 65.535.  Dalam contoh ini, kami menetapkan panjang maksimum sebagai 200.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">Menyisipkan data<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah koleksi dibuat, kita dapat menyisipkan data ke dalamnya. Pada contoh berikut, kita menyisipkan 2.000 baris data string yang dibuat secara acak.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">Menghapus data<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Misalkan dua buku, bernama <code translate="no">book_0</code> dan <code translate="no">book_1</code>, tidak lagi tersedia di toko Anda, jadi Anda ingin menghapus informasi yang relevan dari database Anda. Dalam kasus ini, Anda dapat menggunakan ekspresi istilah <code translate="no">in</code> untuk menyaring entitas yang akan dihapus, seperti yang ditunjukkan pada contoh di bawah ini.</p>
<p>Ingatlah bahwa Milvus hanya mendukung penghapusan entitas dengan primary key yang ditentukan dengan jelas, jadi sebelum menjalankan kode berikut ini, pastikan bahwa Anda telah mengatur field <code translate="no">book_name</code> sebagai field primary key.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">Membangun sebuah Indeks<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 mendukung pembuatan indeks skalar, yang akan sangat mempercepat pemfilteran field string. Tidak seperti membangun indeks vektor, Anda tidak perlu menyiapkan parameter sebelum membangun indeks skalar. Milvus untuk sementara hanya mendukung indeks pohon kamus (MARISA-trie), sehingga jenis indeks dari field tipe VARCHAR adalah MARISA-trie secara default.</p>
<p>Anda dapat menentukan nama indeks ketika membuatnya. Jika tidak ditentukan, nilai default dari <code translate="no">index_name</code> adalah <code translate="no">&quot;_default_idx_&quot;</code>. Pada contoh di bawah ini, kami menamai indeks dengan nama <code translate="no">scalar_index</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">Pencarian hibrida<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan menentukan ekspresi boolean, Anda dapat memfilter bidang string selama pencarian kemiripan vektor.</p>
<p>Sebagai contoh, jika Anda mencari buku yang intro-nya paling mirip dengan Hello Milvus namun hanya ingin mendapatkan buku yang namanya dimulai dengan 'book_2', Anda dapat menggunakan operator <code translate="no">like</code>untuk melakukan pencocokan awalan dan mendapatkan buku yang ditargetkan, seperti yang ditunjukkan pada contoh di bawah ini.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">Ekspresi string<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain dari operator yang baru ditambahkan <code translate="no">like</code>, operator lain, yang sudah didukung di versi Milvus sebelumnya, juga dapat digunakan untuk pemfilteran bidang string. Di bawah ini adalah beberapa contoh <a href="https://milvus.io/docs/v2.1.x/boolean.md">ekspresi string</a> yang umum digunakan, di mana <code translate="no">A</code> merepresentasikan sebuah field bertipe VARCHAR. Ingatlah bahwa semua ekspresi string di bawah ini dapat digabungkan secara logis menggunakan operator logika, seperti AND, OR, dan NOT.</p>
<h3 id="Set-operations" class="common-anchor-header">Operasi set</h3><p>Anda dapat menggunakan <code translate="no">in</code> dan <code translate="no">not in</code> untuk merealisasikan operasi himpunan, seperti <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">Membandingkan dua bidang string</h3><p>Anda dapat menggunakan operator relasional untuk membandingkan nilai dua bidang string. Operator relasional tersebut meliputi <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code>. Untuk informasi lebih lanjut, lihat <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">Operator relasional</a>.</p>
<p>Perhatikan bahwa field string hanya dapat dibandingkan dengan field string lain, bukan dengan field tipe data lain. Sebagai contoh, sebuah field bertipe VARCHAR tidak dapat dibandingkan dengan field bertipe Boolean atau bertipe integer.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">Membandingkan sebuah field dengan nilai konstanta</h3><p>Anda dapat menggunakan <code translate="no">==</code> atau <code translate="no">!=</code> untuk memverifikasi apakah nilai suatu field sama dengan nilai konstan.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">Memfilter bidang dengan rentang tunggal</h3><p>Anda dapat menggunakan <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> untuk memfilter bidang string dengan rentang tunggal, seperti <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">Pencocokan awalan</h3><p>Seperti yang telah disebutkan sebelumnya, Milvus 2.1 menambahkan operator <code translate="no">like</code> untuk pencocokan awalan, seperti <code translate="no">A like &quot;prefix%&quot;</code>.</p>
<h2 id="Whats-next" class="common-anchor-header">Apa yang selanjutnya<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan dirilisnya Milvus 2.1 secara resmi, kami telah menyiapkan serangkaian blog yang memperkenalkan fitur-fitur baru. Baca lebih lanjut dalam seri blog ini:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cara Menggunakan Data String untuk Memberdayakan Aplikasi Pencarian Kemiripan Anda</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Menggunakan Milvus yang Disematkan untuk Menginstal dan Menjalankan Milvus secara Instan dengan Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Tingkatkan Throughput Pembacaan Basis Data Vektor Anda dengan Replika Dalam Memori</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus (Bagian II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Bagaimana Basis Data Vektor Milvus Memastikan Keamanan Data?</a></li>
</ul>
