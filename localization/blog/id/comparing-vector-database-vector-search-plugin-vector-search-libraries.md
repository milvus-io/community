---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: >-
  Membandingkan Basis Data Vektor, Pustaka Pencarian Vektor, dan Plugin
  Pencarian Vektor
author: Frank Liu
date: 2023-11-9
desc: >-
  Dalam artikel ini, kita akan terus menjelajahi dunia pencarian vektor yang
  rumit, membandingkan database vektor, plugin pencarian vektor, dan pustaka
  pencarian vektor.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Halo - selamat datang kembali di Basis Data Vektor 101!</p>
<p>Lonjakan <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> dan model bahasa besar (LLM) lainnya telah mendorong pertumbuhan teknologi pencarian vektor, yang menampilkan basis data vektor khusus seperti <a href="https://zilliz.com/what-is-milvus">Milvus</a> dan <a href="https://zilliz.com/cloud">Zilliz Cloud</a> di samping pustaka seperti <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> dan plugin pencarian vektor terintegrasi di dalam basis data konvensional.</p>
<p>Pada <a href="https://zilliz.com/learn/what-is-vector-database">postingan seri</a> kami <a href="https://zilliz.com/learn/what-is-vector-database">sebelumnya</a>, kami mempelajari dasar-dasar database vektor. Pada tulisan ini, kita akan terus menjelajahi ranah pencarian vektor yang rumit, membandingkan database vektor, plugin pencarian vektor, dan pustaka pencarian vektor.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">Apa itu pencarian vektor?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/vector-similarity-search">Pencarian vektor</a>, juga dikenal sebagai pencarian kemiripan vektor, adalah teknik untuk mengambil k hasil teratas yang paling mirip atau secara semantik terkait dengan vektor kueri yang diberikan di antara kumpulan data vektor yang padat. Sebelum melakukan pencarian kemiripan, kami memanfaatkan jaringan syaraf untuk mengubah <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data yang tidak terstruktur</a>, seperti teks, gambar, video, dan audio, menjadi vektor numerik berdimensi tinggi yang disebut vektor penyisipan. Setelah menghasilkan vektor penyisipan, mesin pencari vektor membandingkan jarak spasial antara vektor kueri masukan dan vektor di penyimpanan vektor. Semakin dekat jaraknya dalam ruang, semakin mirip keduanya.</p>
<p>Beberapa teknologi pencarian vektor tersedia di pasaran, termasuk pustaka pembelajaran mesin seperti NumPy dari Python, pustaka pencarian vektor seperti FAISS, plugin pencarian vektor yang dibangun di atas basis data tradisional, dan basis data vektor khusus seperti Milvus dan Zilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">Basis data vektor vs pustaka pencarian vektor<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">Basis data vektor khusus</a> bukan satu-satunya tumpukan untuk pencarian kemiripan. Sebelum munculnya basis data vektor, banyak pustaka pencarian vektor, seperti FAISS, ScaNN, dan HNSW, digunakan untuk pencarian vektor.</p>
<p>Pustaka pencarian vektor dapat membantu Anda dengan cepat membangun prototipe sistem pencarian vektor berkinerja tinggi. Mengambil FAISS sebagai contoh, FAISS adalah sumber terbuka dan dikembangkan oleh Meta untuk pencarian kesamaan yang efisien dan pengelompokan vektor yang padat. FAISS dapat menangani koleksi vektor dengan berbagai ukuran, bahkan yang tidak dapat dimuat sepenuhnya ke dalam memori. Selain itu, FAISS menawarkan alat untuk evaluasi dan penyetelan parameter. Meskipun ditulis dalam bahasa C++, FAISS menyediakan antarmuka Python/NumPy.</p>
<p>Namun, pustaka pencarian vektor hanyalah pustaka ANN yang ringan dan bukan solusi terkelola, dan memiliki fungsionalitas yang terbatas. Jika dataset Anda kecil dan terbatas, library ini dapat mencukupi untuk pemrosesan data yang tidak terstruktur, bahkan untuk sistem yang berjalan dalam produksi. Namun, seiring dengan bertambahnya ukuran dataset dan bertambahnya pengguna yang bergabung, masalah skala menjadi semakin sulit untuk dipecahkan. Selain itu, database ini tidak mengizinkan modifikasi apa pun pada data indeks mereka dan tidak dapat ditanyakan selama impor data.</p>
<p>Sebaliknya, basis data vektor adalah solusi yang lebih optimal untuk penyimpanan dan pengambilan data yang tidak terstruktur. Database vektor dapat menyimpan dan meminta jutaan atau bahkan miliaran vektor sambil memberikan respons waktu nyata secara bersamaan; database vektor sangat skalabel untuk memenuhi kebutuhan bisnis pengguna yang terus berkembang.</p>
<p>Selain itu, database vektor seperti Milvus memiliki fitur yang jauh lebih mudah digunakan untuk data terstruktur/semi-terstruktur: cloud-nativity, multi-tenancy, skalabilitas, dll. Fitur-fitur ini akan menjadi jelas ketika kita menyelami tutorial ini lebih dalam.</p>
<p>Mereka juga beroperasi dalam lapisan abstraksi yang sama sekali berbeda dari pustaka pencarian vektor - basis data vektor adalah layanan lengkap, sedangkan pustaka ANN dimaksudkan untuk diintegrasikan ke dalam aplikasi yang Anda kembangkan. Dalam hal ini, pustaka ANN adalah salah satu dari banyak komponen yang dibangun di atas basis data vektor, mirip dengan bagaimana Elasticsearch dibangun di atas Apache Lucene.</p>
<p>Sebagai contoh mengapa abstraksi ini sangat penting, mari kita lihat bagaimana memasukkan elemen data baru yang tidak terstruktur ke dalam basis data vektor. Hal ini sangat mudah dilakukan di Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>Benar-benar semudah itu - 3 baris kode. Dengan pustaka seperti FAISS atau ScaNN, sayangnya, tidak ada cara mudah untuk melakukan hal ini tanpa secara manual membuat ulang seluruh indeks pada titik-titik tertentu. Bahkan jika Anda bisa, pustaka pencarian vektor masih kurang skalabilitas dan multi-tenancy, dua fitur basis data vektor yang paling penting.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">Basis data vektor vs plugin pencarian vektor untuk basis data tradisional<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Baiklah, sekarang kita telah mengetahui perbedaan antara pustaka pencarian vektor dan basis data vektor, mari kita lihat perbedaan basis data vektor dengan <strong>plugin pencarian vektor</strong>.</p>
<p>Semakin banyak database relasional tradisional, dan sistem pencarian seperti Clickhouse dan <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> yang menyertakan plugin pencarian vektor bawaan. Elasticsearch 8.0, misalnya, menyertakan penyisipan vektor dan fungsionalitas pencarian ANN yang dapat dipanggil melalui titik akhir API yang tenang. Masalah dengan plugin pencarian vektor seharusnya jelas seperti siang dan malam - <strong>solusi ini tidak mengambil pendekatan full-stack untuk manajemen penyisipan dan pencarian vektor</strong>. Sebaliknya, plugin ini dimaksudkan sebagai tambahan di atas arsitektur yang sudah ada, sehingga membuatnya terbatas dan tidak optimal. Mengembangkan aplikasi data yang tidak terstruktur di atas basis data tradisional sama saja dengan mencoba memasukkan baterai lithium dan motor listrik ke dalam rangka mobil bertenaga gas - bukan ide yang bagus!</p>
<p>Untuk mengilustrasikan mengapa demikian, mari kita kembali ke daftar fitur yang harus diimplementasikan oleh basis data vektor (dari bagian pertama). Plugin pencarian vektor tidak memiliki dua dari fitur-fitur ini - kemampuan penyesuaian dan API/SDK yang mudah digunakan. Saya akan terus menggunakan mesin ANN Elasticsearch sebagai contoh; plugin pencarian vektor lainnya beroperasi dengan cara yang sangat mirip sehingga saya tidak akan membahasnya lebih jauh. Elasticsearch mendukung penyimpanan vektor melalui tipe bidang data <code translate="no">dense_vector</code> dan memungkinkan untuk melakukan kueri melalui <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Plugin ANN Elasticsearch hanya mendukung satu algoritma pengindeksan: Hierarchical Navigable Small Worlds, juga dikenal sebagai HNSW (saya suka berpikir bahwa penciptanya mendahului Marvel dalam hal mempopulerkan multiverse). Selain itu, hanya jarak L2/Euclidean yang didukung sebagai metrik jarak. Ini adalah awal yang baik, tetapi mari kita bandingkan dengan Milvus, database vektor yang lengkap. Menggunakan <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>Meskipun <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch dan Milvus</a> memiliki metode untuk membuat indeks, menyisipkan vektor penyisipan, dan melakukan pencarian tetangga terdekat, jelas dari contoh-contoh ini bahwa Milvus memiliki API pencarian vektor yang lebih intuitif (API yang lebih baik untuk pengguna) dan indeks vektor yang lebih luas + dukungan metrik jarak (kemampuan penyesuaian yang lebih baik). Milvus juga berencana untuk mendukung lebih banyak indeks vektor dan memungkinkan untuk melakukan kueri melalui pernyataan seperti SQL di masa depan, yang selanjutnya meningkatkan kemampuan penyesuaian dan kegunaan.</p>
<p>Kami baru saja membahas sedikit konten. Bagian ini memang cukup panjang, jadi bagi Anda yang membaca sekilas, berikut ini penjelasan singkatnya: Milvus lebih baik daripada plugin pencarian vektor karena Milvus dibangun dari awal sebagai basis data vektor, sehingga memungkinkan fitur yang lebih kaya dan arsitektur yang lebih cocok untuk data yang tidak terstruktur.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">Bagaimana cara memilih dari berbagai teknologi pencarian vektor?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Tidak semua database vektor dibuat sama; masing-masing memiliki ciri-ciri unik yang melayani aplikasi tertentu. Pustaka dan plugin pencarian vektor mudah digunakan dan ideal untuk menangani lingkungan produksi berskala kecil dengan jutaan vektor. Jika ukuran data Anda kecil dan Anda hanya membutuhkan fungsionalitas pencarian vektor dasar, teknologi ini sudah cukup untuk bisnis Anda.</p>
<p>Namun, basis data vektor khusus harus menjadi pilihan utama Anda untuk bisnis intensif data yang berurusan dengan ratusan juta vektor dan menuntut respons waktu nyata. Milvus, misalnya, dengan mudah mengelola miliaran vektor, menawarkan kecepatan kueri secepat kilat dan fungsionalitas yang kaya. Selain itu, solusi yang dikelola sepenuhnya seperti Zilliz terbukti lebih menguntungkan, membebaskan Anda dari tantangan operasional dan memungkinkan fokus eksklusif pada aktivitas bisnis inti Anda.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">Lihatlah lagi kursus Basis Data Vektor 101<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">Pengantar ke Data Tidak Terstruktur</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">Apa yang dimaksud dengan Basis Data Vektor?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Membandingkan Basis Data Vektor, Pustaka Pencarian Vektor, dan Plugin Pencarian Vektor</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Pengantar ke Milvus</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Memulai Cepat Milvus</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">Pengantar Pencarian Kemiripan Vektor</a></li>
<li><a href="https://zilliz.com/blog/vector-index">Dasar-dasar Indeks Vektor dan Indeks File Terbalik</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">Kuantisasi Skalar dan Kuantisasi Produk</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">Dunia Kecil yang Dapat Dinavigasi Hirarkis (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">Perkiraan Tetangga Terdekat Oh Yeah (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">Memilih Indeks Vektor yang Tepat untuk Proyek Anda</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN dan Algoritma Vamana</a></li>
</ol>
