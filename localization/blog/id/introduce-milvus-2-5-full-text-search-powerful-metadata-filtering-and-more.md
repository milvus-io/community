---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: >-
  Memperkenalkan Milvus 2.5: Pencarian Teks Lengkap, Pemfilteran Metadata yang
  Lebih Kuat, dan Peningkatan Kegunaan!
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">Gambaran Umum<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami dengan senang hati mempersembahkan versi terbaru Milvus, 2.5, yang memperkenalkan kemampuan baru yang hebat: <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">pencarian teks lengkap</a>, yang juga dikenal sebagai pencarian leksikal atau kata kunci. Jika Anda baru mengenal pencarian, pencarian teks lengkap memungkinkan Anda untuk menemukan dokumen dengan mencari kata atau frasa tertentu di dalamnya, mirip dengan cara Anda mencari di Google. Hal ini melengkapi kemampuan pencarian semantik kami yang sudah ada, yang memahami makna di balik pencarian Anda, bukan hanya mencocokkan kata-kata yang tepat.</p>
<p>Kami menggunakan metrik BM25 standar industri untuk kemiripan dokumen, dan implementasi kami didasarkan pada vektor yang jarang, sehingga memungkinkan penyimpanan dan pencarian yang lebih efisien. Bagi mereka yang tidak terbiasa dengan istilah ini, vektor jarang adalah cara untuk merepresentasikan teks yang sebagian besar nilainya nol, sehingga sangat efisien untuk disimpan dan diproses-bayangkan sebuah spreadsheet yang sangat besar di mana hanya beberapa sel yang berisi angka, dan sisanya kosong. Pendekatan ini sangat cocok dengan filosofi produk Milvus di mana vektor adalah entitas pencarian inti.</p>
<p>Aspek tambahan yang perlu diperhatikan dari implementasi kami adalah kemampuan untuk memasukkan dan menanyakan teks <em>secara langsung</em> daripada meminta pengguna untuk mengubah teks secara manual menjadi vektor yang jarang. Hal ini membawa Milvus selangkah lebih dekat untuk memproses data yang tidak terstruktur secara penuh.</p>
<p>Namun ini baru permulaan. Dengan rilis 2.5, kami memperbarui <a href="https://milvus.io/docs/roadmap.md">peta jalan produk Milvus</a>. Dalam iterasi produk Milvus di masa depan, fokus kami adalah mengembangkan kemampuan Milvus dalam empat arah utama:</p>
<ul>
<li>Pemrosesan data tidak terstruktur yang efisien;</li>
<li>Kualitas dan efisiensi pencarian yang lebih baik;</li>
<li>Manajemen data yang lebih mudah;</li>
<li>Menurunkan biaya melalui kemajuan algoritmik dan desain</li>
</ul>
<p>Tujuan kami adalah membangun infrastruktur data yang dapat menyimpan dan mengambil informasi secara efisien dan efektif di era AI.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">Pencarian teks lengkap melalui Sparse-BM25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>Meskipun pencarian semantik biasanya memiliki kesadaran kontekstual dan pemahaman maksud yang lebih baik, namun ketika pengguna perlu mencari kata benda, nomor seri, atau frasa yang benar-benar cocok, pencarian teks lengkap dengan pencocokan kata kunci sering kali memberikan hasil yang lebih akurat.</p>
<p>Untuk mengilustrasikan hal ini dengan sebuah contoh:</p>
<ul>
<li>Pencarian semantik lebih baik jika Anda bertanya: "Temukan dokumen tentang solusi energi terbarukan"</li>
<li>Pencarian teks lengkap lebih baik jika Anda membutuhkan: &quot;Temukan dokumen yang menyebutkan <em>Tesla Model 3 2024</em>&quot;</li>
</ul>
<p>Di versi kami sebelumnya (Milvus 2.4), pengguna harus melakukan pra-pemrosesan teks mereka menggunakan alat terpisah (modul BM25EmbeddingFunction ke PyMilvus) di mesin mereka sendiri sebelum mereka dapat mencarinya. Pendekatan ini memiliki beberapa keterbatasan: pendekatan ini tidak dapat menangani kumpulan data yang terus bertambah dengan baik, membutuhkan langkah-langkah penyiapan tambahan, dan membuat keseluruhan proses menjadi lebih rumit dari yang seharusnya. Bagi mereka yang berpikiran teknis, keterbatasan utamanya adalah bahwa pendekatan ini hanya dapat bekerja pada satu mesin; kosakata dan statistik korpus lainnya yang digunakan untuk penilaian BM25 tidak dapat diperbarui ketika korpus berubah; dan mengubah teks menjadi vektor di sisi klien kurang intuitif jika dibandingkan dengan teks secara langsung.</p>
<p>Milvus 2.5 menyederhanakan semuanya. Sekarang Anda dapat bekerja dengan teks Anda secara langsung:</p>
<ul>
<li>Menyimpan dokumen teks asli Anda sebagaimana adanya</li>
<li>Mencari menggunakan kueri bahasa alami</li>
<li>Mendapatkan hasil kembali dalam bentuk yang dapat dibaca</li>
</ul>
<p>Di balik layar, Milvus menangani semua konversi vektor yang rumit secara otomatis sehingga memudahkan Anda untuk bekerja dengan data teks. Inilah yang kami sebut sebagai pendekatan "Doc in, Doc out" - Anda bekerja dengan teks yang dapat dibaca, dan kami menangani sisanya.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">Implementasi Teknis</h3><p>Bagi mereka yang tertarik dengan detail teknis, Milvus 2.5 menambahkan kemampuan pencarian teks lengkap melalui implementasi Sparse-BM25 yang sudah ada di dalamnya, termasuk:</p>
<ul>
<li><strong>Tokenizer yang dibangun di atas tantivy</strong>: Milvus sekarang terintegrasi dengan ekosistem tantivy yang sedang berkembang</li>
<li><strong>Kemampuan untuk mencerna dan mengambil dokumen mentah</strong>: Dukungan untuk konsumsi langsung dan kueri data teks</li>
<li><strong>Penilaian relevansi BM25</strong>: Menginternalisasi penilaian BM25, diimplementasikan berdasarkan vektor yang jarang</li>
</ul>
<p>Kami memilih untuk bekerja dengan ekosistem tantivy yang telah berkembang dengan baik dan membangun tokenizer teks Milvus di atas tantivy. Di masa depan, Milvus akan mendukung lebih banyak tokenizer dan mengekspos proses tokenisasi untuk membantu pengguna lebih memahami kualitas pengambilan. Kami juga akan mengeksplorasi tokenizer berbasis deep learning dan strategi stemmer untuk lebih mengoptimalkan kinerja pencarian teks lengkap. Di bawah ini adalah contoh kode untuk menggunakan dan mengonfigurasi tokenizer:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Setelah mengonfigurasi tokenizer dalam skema koleksi, pengguna dapat mendaftarkan fungsi teks ke bm25 melalui metode add_function. Ini akan berjalan secara internal di server Milvus. Semua aliran data selanjutnya seperti penambahan, penghapusan, modifikasi, dan kueri dapat diselesaikan dengan mengoperasikan string teks mentah, bukan representasi vektor. Lihat contoh kode di bawah ini untuk mengetahui cara memasukkan teks dan melakukan pencarian teks lengkap dengan API yang baru:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Kami telah mengadopsi implementasi penilaian relevansi BM25 yang merepresentasikan kueri dan dokumen sebagai vektor jarang, yang disebut <strong>Sparse-BM25</strong>. Hal ini membuka banyak pengoptimalan berdasarkan vektor jarang, seperti:</p>
<p>Milvus mencapai kemampuan pencarian hibrida melalui <strong>implementasi Sparse-BM25</strong> yang canggih, yang mengintegrasikan pencarian teks lengkap ke dalam arsitektur basis data vektor. Dengan merepresentasikan frekuensi term sebagai vektor jarang alih-alih indeks terbalik tradisional, Sparse-BM25 memungkinkan pengoptimalan tingkat lanjut, seperti <strong>pengindeksan grafik</strong>, <strong>kuantisasi produk (PQ</strong>), dan <strong>kuantisasi skalar (SQ)</strong>. Pengoptimalan ini meminimalkan penggunaan memori dan mempercepat kinerja pencarian. Mirip dengan pendekatan indeks terbalik, Milvus mendukung penggunaan teks mentah sebagai input dan menghasilkan vektor jarang secara internal. Hal ini membuatnya dapat bekerja dengan tokenizer apa pun dan memahami kata apa pun yang ditampilkan dalam korpus yang berubah secara dinamis.</p>
<p>Selain itu, pemangkasan berbasis heuristik membuang vektor jarang yang bernilai rendah, sehingga meningkatkan efisiensi tanpa mengorbankan akurasi. Tidak seperti pendekatan sebelumnya yang menggunakan vektor jarang, pendekatan ini dapat beradaptasi dengan korpus yang terus berkembang, bukan dengan keakuratan penilaian BM25.</p>
<ol>
<li>Membangun indeks grafik pada vektor jarang, yang berkinerja lebih baik daripada indeks terbalik pada kueri dengan teks yang panjang karena indeks terbalik membutuhkan lebih banyak langkah untuk menyelesaikan pencocokan token dalam kueri;</li>
<li>Memanfaatkan teknik aproksimasi untuk mempercepat pencarian dengan dampak yang kecil terhadap kualitas pencarian, seperti kuantisasi vektor dan pemangkasan berbasis heuristik;</li>
<li>Menyatukan antarmuka dan model data untuk melakukan pencarian semantik dan pencarian teks lengkap, sehingga meningkatkan pengalaman pengguna.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Singkatnya, Milvus 2.5 telah memperluas kemampuan pencariannya di luar pencarian semantik dengan memperkenalkan pencarian teks lengkap, sehingga memudahkan pengguna untuk membangun aplikasi AI yang berkualitas tinggi. Ini hanyalah langkah awal dalam bidang pencarian Sparse-BM25 dan kami mengantisipasi bahwa akan ada langkah-langkah pengoptimalan lebih lanjut yang akan dicoba di masa depan.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">Filter Pencarian Pencocokan Teks<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Fitur pencarian teks kedua yang dirilis dengan Milvus 2.5 adalah <strong>Pencocokan Teks</strong>, yang memungkinkan pengguna untuk memfilter pencarian ke entri yang berisi string teks tertentu. Fitur ini juga dibuat berdasarkan tokenisasi dan diaktifkan dengan <code translate="no">enable_match=True</code>.</p>
<p>Perlu dicatat bahwa dengan Text Match, pemrosesan teks kueri didasarkan pada logika OR setelah tokenisasi. Sebagai contoh, pada contoh di bawah ini, hasilnya akan mengembalikan semua dokumen (menggunakan bidang 'teks') yang mengandung 'vektor' atau 'database'.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Jika skenario Anda membutuhkan pencocokan 'vektor' dan 'database', maka Anda perlu menulis dua Pencocokan Teks yang terpisah dan melapisinya dengan AND untuk mencapai tujuan Anda.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">Peningkatan Signifikan dalam Performa Pemfilteran Skalar<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Penekanan kami pada kinerja pemfilteran skalar berasal dari penemuan kami bahwa kombinasi pengambilan vektor dan pemfilteran metadata dapat meningkatkan kinerja dan akurasi kueri secara signifikan dalam berbagai skenario. Skenario ini berkisar dari aplikasi pencarian gambar seperti identifikasi kasus sudut dalam pengemudian otonom hingga skenario RAG yang kompleks dalam basis pengetahuan perusahaan. Dengan demikian, ini sangat cocok bagi pengguna perusahaan untuk diimplementasikan dalam skenario aplikasi data berskala besar.</p>
<p>Dalam praktiknya, banyak faktor seperti seberapa banyak data yang Anda filter, bagaimana data Anda diatur, dan bagaimana Anda melakukan pencarian dapat memengaruhi kinerja. Untuk mengatasi hal ini, Milvus 2.5 memperkenalkan tiga jenis indeks baru - Indeks BitMap, Indeks Array Terbalik, dan Indeks Terbalik setelah melakukan tokenisasi pada bidang teks Varchar. Indeks-indeks baru ini dapat secara signifikan meningkatkan kinerja dalam kasus penggunaan di dunia nyata.</p>
<p>Secara khusus:</p>
<ol>
<li><strong>Indeks BitMap</strong> dapat digunakan untuk mempercepat pemfilteran tag (operator umum termasuk dalam, array_contains, dll.), dan cocok untuk skenario dengan data kategori bidang yang lebih sedikit (kardinalitas data). Prinsipnya adalah untuk menentukan apakah sebuah baris data memiliki nilai tertentu pada kolom, dengan 1 untuk ya dan 0 untuk tidak, dan kemudian memelihara daftar BitMap. Bagan berikut ini menunjukkan perbandingan uji kinerja yang kami lakukan berdasarkan skenario bisnis pelanggan. Dalam skenario ini, volume data adalah 500 juta, kategori data adalah 20, nilai yang berbeda memiliki proporsi distribusi yang berbeda (1%, 5%, 10%, 50%), dan kinerja di bawah jumlah pemfilteran yang berbeda juga bervariasi. Dengan pemfilteran 50%, kami dapat mencapai peningkatan kinerja 6,8 kali lipat melalui BitMap Index. Perlu dicatat bahwa dengan meningkatnya kardinalitas, dibandingkan dengan BitMap Index, Inverted Index akan menunjukkan kinerja yang lebih seimbang.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>Pencocokan Teks</strong> didasarkan pada Inverted Index setelah bidang teks diberi token. Kinerjanya jauh melebihi fungsi Pencocokan Wildcard (seperti +%) yang kami sediakan di 2.4. Menurut hasil pengujian internal kami, keunggulan Text Match sangat jelas, terutama dalam skenario kueri yang bersamaan, di mana ia dapat mencapai peningkatan QPS hingga 400 kali lipat.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam hal pemrosesan data JSON, kami berencana untuk memperkenalkan di versi 2.5.x berikutnya, pembuatan indeks terbalik untuk kunci yang ditentukan pengguna dan perekaman informasi lokasi default untuk semua kunci untuk mempercepat penguraian. Kami berharap kedua hal ini dapat meningkatkan performa kueri JSON dan Dynamic Field secara signifikan. Kami berencana untuk menampilkan lebih banyak informasi dalam catatan rilis dan blog teknis di masa mendatang, jadi pantau terus!</p>
<h2 id="New-Management-Interface" class="common-anchor-header">Antarmuka Manajemen Baru<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengelola database seharusnya tidak memerlukan gelar sarjana ilmu komputer, tetapi kami tahu bahwa administrator database membutuhkan alat bantu yang canggih. Itulah mengapa kami memperkenalkan <strong>Cluster Management WebUI</strong>, antarmuka berbasis web baru yang dapat diakses di alamat cluster Anda pada port 9091/webui. Alat bantu pengamatan ini menyediakan:</p>
<ul>
<li>Dasbor pemantauan waktu nyata yang menampilkan metrik di seluruh cluster</li>
<li>Memori terperinci dan analitik kinerja per node</li>
<li>Informasi segmen dan pelacakan kueri lambat</li>
<li>Indikator kesehatan sistem dan status node</li>
<li>Alat pemecahan masalah yang mudah digunakan untuk masalah sistem yang kompleks</li>
</ul>
<p>Meskipun antarmuka ini masih dalam versi beta, kami secara aktif mengembangkannya berdasarkan umpan balik pengguna dari administrator database. Pembaruan di masa mendatang akan mencakup diagnostik dengan bantuan AI, fitur manajemen yang lebih interaktif, dan kemampuan pengamatan klaster yang ditingkatkan.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">Dokumentasi dan Pengalaman Pengembang<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami telah merombak total <strong>dokumentasi</strong> dan pengalaman <strong>SDK/API</strong> kami untuk membuat Milvus lebih mudah diakses dengan tetap mempertahankan kedalaman bagi pengguna berpengalaman. Perbaikan tersebut meliputi:</p>
<ul>
<li>Sistem dokumentasi yang telah direstrukturisasi dengan perkembangan yang lebih jelas dari konsep dasar hingga lanjutan</li>
<li>Tutorial interaktif dan contoh-contoh dunia nyata yang menampilkan implementasi praktis</li>
<li>Referensi API yang komprehensif dengan contoh kode praktis</li>
<li>Desain SDK yang lebih ramah pengguna yang menyederhanakan operasi umum</li>
<li>Panduan bergambar yang membuat konsep yang rumit menjadi lebih mudah dipahami</li>
<li>Asisten dokumentasi yang didukung AI (ASK AI) untuk jawaban cepat</li>
</ul>
<p>SDK/API yang telah diperbarui berfokus pada peningkatan pengalaman pengembang melalui antarmuka yang lebih intuitif dan integrasi yang lebih baik dengan dokumentasi. Kami yakin Anda akan melihat peningkatan ini ketika bekerja dengan seri 2.5.x.</p>
<p>Namun, kami tahu bahwa dokumentasi dan pengembangan SDK adalah proses yang berkelanjutan. Kami akan terus mengoptimalkan struktur konten dan desain SDK berdasarkan umpan balik dari komunitas. Bergabunglah dengan saluran Discord kami untuk membagikan saran Anda dan membantu kami meningkatkannya lebih lanjut.</p>
<h2 id="Summary" class="common-anchor-header"><strong>Ringkasan</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 berisi 13 fitur baru dan beberapa pengoptimalan tingkat sistem, yang dikontribusikan tidak hanya oleh Zilliz tetapi juga komunitas sumber terbuka. Kami hanya membahas beberapa di antaranya dalam tulisan ini dan mendorong Anda untuk mengunjungi <a href="https://milvus.io/docs/release_notes.md">catatan rilis</a> dan <a href="https://milvus.io/docs">dokumen resmi</a> kami untuk informasi lebih lanjut!</p>
