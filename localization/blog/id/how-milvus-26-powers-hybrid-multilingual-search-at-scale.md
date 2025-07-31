---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: >-
  Bagaimana Milvus 2.6 Meningkatkan Pencarian Teks Lengkap Multibahasa dalam
  Skala Besar
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  Milvus 2.6 memperkenalkan pipeline analisis teks yang dirombak total dengan
  dukungan multi-bahasa yang komprehensif untuk pencarian teks lengkap.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Aplikasi AI modern menjadi semakin kompleks. Anda tidak bisa hanya menggunakan satu metode pencarian pada suatu masalah dan menyebutnya selesai.</p>
<p>Misalnya, sistem rekomendasi membutuhkan <strong>pencarian vektor</strong> untuk memahami arti teks dan gambar, <strong>pemfilteran metadata</strong> untuk mempersempit hasil berdasarkan harga, kategori, atau lokasi, dan <strong>pencarian kata kunci</strong> untuk kueri langsung seperti "Nike Air Max." Setiap metode memecahkan bagian yang berbeda dari masalah, dan sistem dunia nyata membutuhkan semua metode untuk bekerja bersama.</p>
<p>Masa depan pencarian bukan tentang memilih antara vektor dan kata kunci. Ini tentang menggabungkan vektor DAN kata kunci DAN pemfilteran, bersama dengan jenis pencarian lainnya-semuanya di satu tempat. Itulah mengapa kami mulai membangun <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">pencarian hibrida</a> ke dalam Milvus setahun yang lalu, dengan merilis Milvus 2.5.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">Tetapi Pencarian Teks Lengkap Bekerja Secara Berbeda<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>Membawa pencarian teks lengkap ke dalam sistem vektor-asli tidaklah mudah. Pencarian teks lengkap memiliki tantangan tersendiri.</p>
<p>Sementara pencarian vektor menangkap makna <em>semantik</em> teks-mengubahnya menjadi vektor berdimensi tinggi-pencarian teks lengkap bergantung pada pemahaman <strong>struktur bahasa</strong>: bagaimana kata-kata dibentuk, di mana mereka dimulai dan diakhiri, dan bagaimana mereka berhubungan satu sama lain. Misalnya, ketika pengguna mencari "sepatu lari" dalam bahasa Inggris, teks akan melalui beberapa langkah pemrosesan:</p>
<p><em>Pisahkan spasi → huruf kecil → hapus stopwords → rangkai &quot;running&quot; menjadi &quot;run&quot;.</em></p>
<p>Untuk menangani hal ini dengan benar, kita membutuhkan <strong>penganalisis bahasa</strong>yang kuat <strong>-</strong>yang menangani pemisahan, stemming, penyaringan, dan banyak lagi.</p>
<p>Ketika kami memperkenalkan <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">pencarian teks lengkap BM25</a> di Milvus 2.5, kami menyertakan penganalisis yang dapat disesuaikan, dan bekerja dengan baik untuk apa yang dirancang untuk dilakukan. Anda dapat mendefinisikan pipeline menggunakan tokenizer, filter token, dan filter karakter untuk menyiapkan teks untuk pengindeksan dan pencarian.</p>
<p>Untuk bahasa Inggris, penyiapan ini relatif mudah. Namun, semuanya menjadi lebih kompleks ketika Anda berurusan dengan banyak bahasa.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">Tantangan Pencarian Teks Lengkap Multibahasa<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencarian teks lengkap multibahasa menghadirkan berbagai tantangan:</p>
<ul>
<li><p><strong>Bahasa yang rumit membutuhkan perlakuan khusus</strong>: Bahasa seperti bahasa Mandarin, Jepang, dan Korea tidak menggunakan spasi di antara kata. Bahasa-bahasa tersebut membutuhkan tokenizer canggih untuk memilah karakter menjadi kata-kata yang bermakna. Alat-alat ini dapat bekerja dengan baik untuk satu bahasa, tetapi jarang mendukung beberapa bahasa yang kompleks secara bersamaan.</p></li>
<li><p><strong>Bahkan bahasa yang mirip pun bisa bertentangan</strong>: Bahasa Inggris dan Prancis mungkin sama-sama menggunakan spasi untuk memisahkan kata, tetapi begitu Anda menerapkan pemrosesan khusus bahasa seperti stemming atau lemmatization, aturan satu bahasa dapat mengganggu aturan bahasa lainnya. Apa yang meningkatkan akurasi untuk bahasa Inggris dapat merusak kueri bahasa Prancis-dan sebaliknya.</p></li>
</ul>
<p>Singkatnya, <strong>bahasa yang berbeda memerlukan penganalisis yang berbeda</strong>. Mencoba memproses teks bahasa Mandarin dengan penganalisis bahasa Inggris akan berujung pada kegagalan - tidak ada spasi untuk dipisahkan, dan aturan stemming bahasa Inggris dapat merusak karakter bahasa Mandarin.</p>
<p>Kesimpulannya? Mengandalkan tokenizer dan penganalisis tunggal untuk set data multibahasa membuat hampir tidak mungkin untuk memastikan tokenisasi yang konsisten dan berkualitas tinggi di semua bahasa. Dan hal ini secara langsung mengarah pada penurunan kinerja pencarian.</p>
<p>Ketika tim mulai mengadopsi pencarian teks lengkap di Milvus 2.5, kami mulai mendengar umpan balik yang sama:</p>
<p><em>"Ini sempurna untuk pencarian dalam bahasa Inggris, tetapi bagaimana dengan tiket dukungan pelanggan multibahasa kami?" "Kami senang memiliki pencarian vektor dan BM25, tetapi set data kami mencakup konten berbahasa Mandarin, Jepang, dan Inggris." "Bisakah kita mendapatkan ketepatan pencarian yang sama di semua bahasa?"</em></p>
<p>Pertanyaan-pertanyaan ini mengonfirmasi apa yang telah kami lihat dalam praktiknya: pencarian teks lengkap pada dasarnya berbeda dengan pencarian vektor. Kemiripan semantik bekerja dengan baik di semua bahasa, tetapi pencarian teks yang akurat membutuhkan pemahaman yang mendalam tentang struktur setiap bahasa.</p>
<p>Itulah sebabnya <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> memperkenalkan pipeline analisis teks yang dirombak total dengan dukungan multi-bahasa yang komprehensif. Sistem baru ini secara otomatis menerapkan penganalisis yang tepat untuk setiap bahasa, memungkinkan pencarian teks lengkap yang akurat dan terukur di seluruh kumpulan data multibahasa, tanpa konfigurasi manual atau kompromi dalam hal kualitas.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Bagaimana Milvus 2.6 Memungkinkan Pencarian Teks Lengkap Multibahasa yang Kuat<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah melakukan penelitian dan pengembangan ekstensif, kami telah membangun serangkaian fitur yang menangani skenario multibahasa yang berbeda. Setiap pendekatan memecahkan masalah ketergantungan bahasa dengan caranya sendiri.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. Penganalisis Multi-Bahasa: Presisi Melalui Kontrol</h3><p>Penganalisis <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>Multi-Bahasa</strong></a> memungkinkan Anda menentukan aturan pemrosesan teks yang berbeda untuk bahasa yang berbeda dalam koleksi yang sama, alih-alih memaksakan semua bahasa melalui jalur analisis yang sama.</p>
<p><strong>Begini cara kerjanya:</strong> Anda mengonfigurasi penganalisis khusus bahasa dan menandai setiap dokumen dengan bahasanya selama penyisipan. Saat melakukan pencarian BM25, Anda menentukan penganalisis bahasa mana yang akan digunakan untuk pemrosesan kueri. Hal ini memastikan bahwa konten yang diindeks dan kueri penelusuran Anda diproses dengan aturan optimal untuk bahasa masing-masing.</p>
<p><strong>Sempurna untuk:</strong> Aplikasi di mana Anda mengetahui bahasa konten Anda dan menginginkan ketepatan pencarian yang maksimal. Pikirkan basis pengetahuan multinasional, katalog produk yang dilokalkan, atau sistem manajemen konten khusus wilayah.</p>
<p><strong>Persyaratan:</strong> Anda perlu menyediakan metadata bahasa untuk setiap dokumen. Saat ini hanya tersedia untuk operasi pencarian BM25.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. Tokenizer Pengenal Bahasa: Deteksi Bahasa Otomatis</h3><p>Kami tahu bahwa menandai setiap konten secara manual tidak selalu praktis. <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Tokenizer Pengenal Bahasa</strong></a> menghadirkan deteksi bahasa otomatis langsung ke dalam pipa analisis teks.</p>
<p><strong>Begini cara kerjanya:</strong> Tokenizer cerdas ini menganalisis teks yang masuk, mendeteksi bahasanya menggunakan algoritme pendeteksian yang canggih, dan secara otomatis menerapkan aturan pemrosesan khusus bahasa yang sesuai. Anda mengonfigurasinya dengan beberapa definisi penganalisis - satu untuk setiap bahasa yang ingin Anda dukung, ditambah penganalisis fallback default.</p>
<p>Kami mendukung dua mesin pendeteksi: <code translate="no">whatlang</code> untuk pemrosesan yang lebih cepat dan <code translate="no">lingua</code> untuk akurasi yang lebih tinggi. Sistem ini mendukung 71-75 bahasa, tergantung pada detektor yang Anda pilih. Selama pengindeksan dan pencarian, tokenizer secara otomatis memilih penganalisis yang tepat berdasarkan bahasa yang terdeteksi, dan kembali ke konfigurasi default Anda ketika deteksi tidak pasti.</p>
<p><strong>Sempurna untuk:</strong> Lingkungan dinamis dengan pencampuran bahasa yang tidak dapat diprediksi, platform konten buatan pengguna, atau aplikasi di mana penandaan bahasa secara manual tidak memungkinkan.</p>
<p><strong>Kekurangannya:</strong> Deteksi otomatis menambah latensi pemrosesan dan mungkin kesulitan dengan teks yang sangat pendek atau konten bahasa campuran. Tetapi untuk sebagian besar aplikasi dunia nyata, kenyamanannya secara signifikan lebih besar daripada keterbatasan ini.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. Tokenizer ICU: Fondasi Universal</h3><p>Jika dua opsi pertama terasa berlebihan, kami memiliki sesuatu yang lebih sederhana untuk Anda. Kami baru saja mengintegrasikan<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> tokenizer ICU (International Components for Unicode)</a> ke dalam Milvus 2.6. ICU sudah ada sejak lama - ICU adalah kumpulan pustaka yang sudah matang dan digunakan secara luas yang menangani pemrosesan teks untuk banyak bahasa dan skrip. Hal yang keren adalah ia dapat menangani berbagai bahasa yang kompleks dan sederhana sekaligus.</p>
<p>Sejujurnya, ICU tokenizer adalah pilihan default yang bagus. ICU menggunakan aturan standar Unicode untuk memecah kata-kata, yang membuatnya dapat diandalkan untuk lusinan bahasa yang tidak memiliki tokenizer khusus. Jika Anda hanya membutuhkan sesuatu yang kuat dan bertujuan umum yang bekerja dengan baik di berbagai bahasa, ICU dapat melakukannya.</p>
<p><strong>Keterbatasan:</strong> ICU masih bekerja dalam satu penganalisis tunggal, sehingga semua bahasa Anda akhirnya berbagi filter yang sama. Ingin melakukan hal-hal yang spesifik untuk bahasa tertentu seperti stemming atau lemmatization? Anda akan mengalami konflik yang sama seperti yang kita bicarakan sebelumnya.</p>
<p><strong>Di mana ICU benar-benar bersinar:</strong> Kami membuat ICU untuk bekerja sebagai penganalisis default dalam pengaturan multi-bahasa atau pengidentifikasi bahasa. Pada dasarnya ini adalah jaring pengaman cerdas Anda untuk menangani bahasa yang belum Anda konfigurasikan secara eksplisit.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">Lihatlah Saat Beraksi: Demo Langsung<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Cukup dengan teori-mari kita masuk ke dalam beberapa kode! Berikut adalah cara menggunakan fitur multibahasa baru di <strong>pymilvus</strong> untuk membangun koleksi pencarian multibahasa.</p>
<p>Kita akan mulai dengan mendefinisikan beberapa konfigurasi penganalisis yang dapat digunakan kembali, lalu membahas <strong>dua contoh lengkap</strong>:</p>
<ul>
<li><p>Menggunakan <strong>Penganalisis Multi-Bahasa</strong></p></li>
<li><p>Menggunakan <strong>Tokenizer Pengenal Bahasa</strong></p></li>
</ul>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">Langkah 1: Menyiapkan Klien Milvus</h3><p><em>Pertama, kita terhubung ke Milvus, menetapkan nama koleksi, dan membersihkan koleksi yang ada untuk memulai dari awal.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">Langkah 2: Mendefinisikan Penganalisis untuk Beberapa Bahasa</h3><p>Selanjutnya, kita mendefinisikan kamus <code translate="no">analyzers</code> dengan konfigurasi khusus bahasa. Ini akan digunakan dalam kedua metode pencarian multibahasa yang akan ditunjukkan nanti.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">Opsi A: Menggunakan Penganalisis Multi-Bahasa</h3><p>Pendekatan ini paling baik jika Anda <strong>mengetahui bahasa setiap dokumen sebelumnya</strong>. Anda akan memberikan informasi tersebut melalui bidang khusus <code translate="no">language</code> selama penyisipan data.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">Membuat Koleksi dengan Penganalisis Multi-Bahasa</h4><p>Kita akan membuat koleksi di mana bidang <code translate="no">&quot;text&quot;</code> menggunakan penganalisis yang berbeda tergantung pada nilai bidang <code translate="no">language</code>.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">Memasukkan Data Multibahasa dan Memuat Koleksi</h4><p>Sekarang masukkan dokumen dalam bahasa Inggris dan Jepang. Bidang <code translate="no">language</code> memberi tahu Milvus penganalisis mana yang akan digunakan.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Menjalankan Pencarian Teks Lengkap</h4><p>Untuk mencari, tentukan penganalisis mana yang akan digunakan untuk kueri berdasarkan bahasanya.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Hasil:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">Opsi B: Menggunakan Tokenizer Pengenal Bahasa</h3><p>Pendekatan ini menghilangkan penanganan bahasa secara manual dari tangan Anda. <strong>Tokenizer Pengenal Bahasa</strong> secara otomatis mendeteksi bahasa setiap dokumen dan menerapkan penganalisis yang tepat-tidak perlu menentukan bidang <code translate="no">language</code>.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">Membuat Koleksi dengan Pengenal Pengenal Bahasa</h4><p>Di sini, kita membuat koleksi di mana bidang <code translate="no">&quot;text&quot;</code> menggunakan deteksi bahasa otomatis untuk memilih penganalisis yang tepat.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">Menyisipkan Data dan Memuat Koleksi</h4><p>Masukkan teks dalam berbagai bahasa-tidak perlu memberi label. Milvus mendeteksi dan menerapkan penganalisis yang tepat secara otomatis.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Jalankan Pencarian Teks Lengkap</h4><p>Inilah bagian terbaiknya: <strong>tidak perlu menentukan penganalisis</strong> saat melakukan pencarian. Tokenizer secara otomatis mendeteksi bahasa kueri dan menerapkan logika yang tepat.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Hasil</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Milvus 2.6 mengambil langkah besar ke depan dalam membuat <strong>pencarian hibrida</strong> menjadi lebih kuat dan mudah diakses, menggabungkan pencarian vektor dengan pencarian kata kunci, sekarang dalam berbagai bahasa. Dengan dukungan multibahasa yang telah ditingkatkan, Anda bisa membuat aplikasi yang memahami <em>apa yang dimaksudkan pengguna</em> dan <em>apa yang mereka katakan</em>, apa pun bahasa yang mereka gunakan.</p>
<p>Tapi itu hanya salah satu bagian dari pembaruan. Milvus 2.6 juga menghadirkan beberapa fitur lain yang membuat pencarian menjadi lebih cepat, lebih cerdas, dan lebih mudah digunakan:</p>
<ul>
<li><p><strong>Pencocokan Kueri yang Lebih Baik</strong> - Gunakan <code translate="no">phrase_match</code> dan <code translate="no">multi_match</code> untuk pencarian yang lebih akurat</p></li>
<li><p><strong>Pemfilteran JSON yang lebih cepat</strong> - Berkat indeks baru yang didedikasikan untuk bidang JSON</p></li>
<li><p>Pengurutan<strong>Berbasis Skalar</strong> - Mengurutkan hasil berdasarkan bidang numerik apa pun</p></li>
<li><p><strong>Pemeringkatan Lanjutan</strong> - Susun ulang hasil menggunakan model atau logika penilaian khusus</p></li>
</ul>
<p>Ingin uraian lengkap tentang Milvus 2.6? Lihat postingan terbaru kami: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Memperkenalkan Milvus 2.6: Pencarian Vektor yang Terjangkau dalam Skala Miliaran</strong></a><strong>.</strong></p>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
