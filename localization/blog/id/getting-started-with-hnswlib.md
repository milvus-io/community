---
id: getting-started-with-hnswlib.md
title: Memulai dengan HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSWlib, sebuah perpustakaan yang mengimplementasikan HNSW, sangat efisien dan
  terukur, berkinerja baik bahkan dengan jutaan titik. Pelajari cara
  mengimplementasikannya dalam hitungan menit.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">Pencarian semantik</a> memungkinkan mesin untuk memahami bahasa dan memberikan hasil pencarian yang lebih baik, yang sangat penting dalam AI dan analisis data. Setelah bahasa direpresentasikan sebagai <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">sematan</a>, pencarian dapat dilakukan dengan menggunakan metode yang tepat atau perkiraan. Pencarian Approximate Nearest Neighbor<a href="https://zilliz.com/glossary/anns">(ANN</a>) adalah metode yang digunakan untuk menemukan dengan cepat titik-titik dalam kumpulan data yang paling dekat dengan titik kueri yang diberikan, tidak seperti <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">pencarian tetangga terdekat</a> yang <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">tepat</a>, yang dapat menjadi mahal secara komputasi untuk data berdimensi tinggi. ANN memungkinkan pengambilan yang lebih cepat dengan memberikan hasil yang kira-kira mendekati tetangga terdekat.</p>
<p>Salah satu algoritma untuk pencarian Approximate Nearest Neighbor (ANN) adalah <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (Hierarchical Navigable Small Worlds), diimplementasikan di bawah <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a>, yang akan menjadi fokus diskusi hari ini. Dalam blog ini, kita akan:</p>
<ul>
<li><p>Memahami algoritma HNSW.</p></li>
<li><p>Menjelajahi HNSWlib dan fitur-fitur utamanya.</p></li>
<li><p>Menyiapkan HNSWlib, yang meliputi pembuatan indeks dan implementasi pencarian.</p></li>
<li><p>Membandingkannya dengan Milvus.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">Memahami HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> adalah struktur data berbasis grafik yang memungkinkan pencarian kesamaan yang efisien, terutama di ruang berdimensi tinggi, dengan membangun grafik berlapis-lapis jaringan "dunia kecil". Diperkenalkan pada tahun <a href="https://arxiv.org/abs/1603.09320">2016</a>, HNSW mengatasi masalah skalabilitas yang terkait dengan metode pencarian tradisional seperti brute-force dan pencarian berbasis pohon. HNSW sangat ideal untuk aplikasi yang melibatkan kumpulan data yang besar, seperti sistem rekomendasi, pengenalan gambar, dan <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">retrieval-augmented generation (RAG</a>).</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">Mengapa HNSW Penting</h3><p>HNSW secara signifikan meningkatkan kinerja pencarian tetangga terdekat dalam ruang dimensi tinggi. Menggabungkan struktur hirarkis dengan kemampuan navigasi dunia kecil menghindari inefisiensi komputasi dari metode yang lebih lama, memungkinkannya untuk bekerja dengan baik bahkan dengan set data yang sangat besar dan kompleks. Untuk memahami hal ini dengan lebih baik, mari kita lihat bagaimana cara kerjanya sekarang.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">Cara Kerja HNSW</h3><ol>
<li><p><strong>Lapisan Hirarkis:</strong> HNSW mengatur data ke dalam hierarki lapisan, di mana setiap lapisan berisi node yang dihubungkan oleh tepi. Lapisan teratas lebih jarang, memungkinkan untuk "melompat" secara luas di seluruh grafik, seperti memperkecil peta untuk melihat jalan raya utama antar kota. Lapisan bawah semakin rapat, memberikan detail yang lebih baik dan lebih banyak koneksi antara tetangga yang lebih dekat.</p></li>
<li><p><strong>Konsep Dunia Kecil yang dapat dijelajahi:</strong> Setiap lapisan di HNSW dibangun berdasarkan konsep jaringan "dunia kecil", di mana node (titik data) hanya berjarak beberapa "lompatan" dari satu sama lain. Algoritma pencarian dimulai dari lapisan yang paling tinggi dan paling jarang dan bekerja ke bawah, bergerak ke lapisan yang lebih padat untuk menyempurnakan pencarian. Pendekatan ini seperti bergerak dari pandangan global ke detail tingkat lingkungan, secara bertahap mempersempit area pencarian.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">Gambar 1</a>: Contoh Graf Dunia Kecil yang Dapat Dinavigasi</p>
<ol start="3">
<li><strong>Melewati Struktur Seperti Daftar:</strong> Aspek hirarkis dari HNSW menyerupai sebuah daftar lewati, sebuah struktur data probabilistik di mana lapisan-lapisan yang lebih tinggi memiliki lebih sedikit simpul, memungkinkan pencarian awal yang lebih cepat.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">Gambar 2</a>: Contoh Struktur Daftar Lewati</p>
<p>Untuk mencari 96 dalam daftar lompatan yang diberikan, kita mulai dari tingkat paling atas di ujung kiri pada simpul header. Bergerak ke kanan, kita menemukan 31, kurang dari 96, jadi kita lanjutkan ke simpul berikutnya. Sekarang, kita perlu turun ke tingkat di mana kita melihat 31 lagi; karena masih kurang dari 96, kita turun satu tingkat lagi. Setelah menemukan 31 sekali lagi, kita kemudian bergerak ke kanan dan mencapai 96, nilai target kita. Dengan demikian, kita menemukan 96 tanpa perlu turun ke level terendah dari daftar lewati.</p>
<ol start="4">
<li><p><strong>Efisiensi Pencarian:</strong> Algoritma HNSW dimulai dari simpul entri pada lapisan tertinggi, maju ke tetangga yang lebih dekat dengan setiap langkah. Algoritma ini menuruni lapisan-lapisan, menggunakan setiap lapisan untuk eksplorasi kasar hingga halus, hingga mencapai lapisan terendah di mana node yang paling mirip kemungkinan besar ditemukan. Navigasi berlapis ini mengurangi jumlah node dan tepi yang perlu dieksplorasi, membuat pencarian menjadi cepat dan akurat.</p></li>
<li><p><strong>Penyisipan dan Pemeliharaan</strong>: Ketika menambahkan node baru, algoritma menentukan lapisan masuknya berdasarkan probabilitas dan menghubungkannya ke node terdekat menggunakan heuristik pemilihan tetangga. Heuristik ini bertujuan untuk mengoptimalkan konektivitas, menciptakan tautan yang meningkatkan kemampuan navigasi sekaligus menyeimbangkan kepadatan graf. Pendekatan ini membuat struktur tetap kuat dan mudah beradaptasi dengan titik-titik data baru.</p></li>
</ol>
<p>Meskipun kami memiliki pemahaman dasar tentang algoritma HNSW, mengimplementasikannya dari awal bisa jadi sangat melelahkan. Untungnya, komunitas telah mengembangkan pustaka seperti <a href="https://github.com/nmslib/hnswlib">HNSWlib</a> untuk menyederhanakan penggunaan, membuatnya dapat diakses tanpa membuat Anda bingung. Jadi, mari kita lihat lebih dekat HNSWlib.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">Gambaran Umum HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib, sebuah pustaka populer yang mengimplementasikan HNSW, sangat efisien dan dapat diskalakan, berkinerja baik bahkan dengan jutaan titik. HNSWlib mencapai kompleksitas waktu sublinear dengan memungkinkan lompatan cepat di antara lapisan-lapisan grafik dan mengoptimalkan pencarian data yang padat dan berdimensi tinggi. Berikut ini adalah fitur-fitur utama dari HNSWlib:</p>
<ul>
<li><p><strong>Struktur Berbasis Grafik:</strong> Grafik berlapis-lapis merepresentasikan titik-titik data, memungkinkan pencarian tetangga terdekat yang cepat.</p></li>
<li><p><strong>Efisiensi Dimensi Tinggi:</strong> Dioptimalkan untuk data berdimensi tinggi, memberikan perkiraan pencarian yang cepat dan akurat.</p></li>
<li><p><strong>Waktu Pencarian Sublinear:</strong> Mencapai kompleksitas sublinear dengan melompati lapisan, meningkatkan kecepatan secara signifikan.</p></li>
<li><p><strong>Pembaruan Dinamis:</strong> Mendukung penyisipan dan penghapusan node secara real-time tanpa memerlukan pembangunan ulang grafik yang lengkap.</p></li>
<li><p><strong>Efisiensi Memori:</strong> Penggunaan memori yang efisien, cocok untuk kumpulan data yang besar.</p></li>
<li><p><strong>Skalabilitas:</strong> Dapat diskalakan dengan baik ke jutaan titik data, sehingga ideal untuk aplikasi skala menengah seperti sistem rekomendasi.</p></li>
</ul>
<p><strong>Catatan:</strong> HNSWlib sangat baik untuk membuat prototipe sederhana untuk aplikasi pencarian vektor. Namun, karena keterbatasan skalabilitas, mungkin ada pilihan yang lebih baik seperti <a href="https://zilliz.com/blog/what-is-a-real-vector-database">database vektor yang dibuat khusus</a> untuk skenario yang lebih kompleks yang melibatkan ratusan juta atau bahkan miliaran titik data. Mari kita lihat itu dalam tindakan.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">Memulai dengan HNSWlib: Panduan Langkah-demi-Langkah<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>Bagian ini akan mendemonstrasikan penggunaan HNSWlib sebagai <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">pustaka pencarian vektor</a> dengan membuat indeks HNSW, memasukkan data, dan melakukan pencarian. Mari kita mulai dengan instalasi:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">Pengaturan dan Impor</h3><p>Untuk memulai dengan HNSWlib di Python, pertama-tama instal menggunakan pip:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian, impor pustaka yang diperlukan:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">Mempersiapkan Data</h3><p>Dalam contoh ini, kita akan menggunakan <code translate="no">NumPy</code>untuk menghasilkan kumpulan data acak dengan 10.000 elemen, masing-masing dengan ukuran dimensi 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>Mari kita buat datanya:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang data kita sudah siap, mari kita membuat indeks.</p>
<h3 id="Building-an-Index" class="common-anchor-header">Membangun Indeks</h3><p>Dalam membuat indeks, kita perlu mendefinisikan dimensi vektor dan tipe ruang. Mari kita membuat sebuah indeks:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: Parameter ini mendefinisikan metrik jarak yang digunakan untuk kemiripan. Mengaturnya ke <code translate="no">'l2'</code> berarti menggunakan jarak Euclidean (norma L2). Jika Anda mengaturnya ke <code translate="no">'ip'</code>, ini akan menggunakan inner product, yang berguna untuk tugas-tugas seperti kemiripan kosinus.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: Parameter ini menentukan dimensi titik data yang akan Anda gunakan. Parameter ini harus sesuai dengan dimensi data yang Anda rencanakan untuk ditambahkan ke dalam indeks.</li>
</ul>
<p>Berikut adalah cara menginisialisasi indeks:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: Ini menetapkan jumlah maksimum elemen yang dapat ditambahkan ke indeks. <code translate="no">Num_elements</code> adalah kapasitas maksimum, jadi kami menetapkannya menjadi 10.000 karena kami bekerja dengan 10.000 titik data.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: Parameter ini mengontrol pertukaran akurasi vs. kecepatan konstruksi selama pembuatan indeks. Nilai yang lebih tinggi akan meningkatkan daya ingat (akurasi) tetapi meningkatkan penggunaan memori dan waktu pembuatan. Nilai yang umum berkisar antara 100 hingga 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: Parameter ini menentukan jumlah tautan dua arah yang dibuat untuk setiap titik data, yang mempengaruhi akurasi dan kecepatan pencarian. Nilai yang umum adalah antara 12 dan 48; 16 sering kali merupakan keseimbangan yang baik untuk akurasi dan kecepatan yang moderat.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: Parameter <code translate="no">ef</code>, kependekan dari "faktor eksplorasi", menentukan berapa banyak tetangga yang diperiksa selama pencarian. Nilai <code translate="no">ef</code> yang lebih tinggi menghasilkan lebih banyak tetangga yang dieksplorasi, yang secara umum meningkatkan akurasi (recall) pencarian tetapi juga membuatnya lebih lambat. Sebaliknya, nilai <code translate="no">ef</code> yang lebih rendah dapat melakukan pencarian lebih cepat tetapi dapat mengurangi akurasi.</li>
</ul>
<p>Dalam kasus ini, pengaturan <code translate="no">ef</code> ke 50 berarti algoritme pencarian akan mengevaluasi hingga 50 tetangga ketika menemukan titik data yang paling mirip.</p>
<p>Catatan: <code translate="no">ef_construction</code> mengatur upaya pencarian tetangga selama pembuatan indeks, meningkatkan akurasi tetapi memperlambat konstruksi. <code translate="no">ef</code> mengontrol upaya pencarian selama kueri, menyeimbangkan kecepatan dan penarikan secara dinamis untuk setiap kueri.</p>
<h3 id="Performing-Searches" class="common-anchor-header">Melakukan Pencarian</h3><p>Untuk melakukan pencarian tetangga terdekat menggunakan HNSWlib, pertama-tama kita membuat vektor kueri acak. Dalam contoh ini, dimensi vektor sesuai dengan data yang diindeks.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: Baris ini menghasilkan vektor acak dengan dimensi yang sama dengan data yang diindeks, untuk memastikan kompatibilitas pencarian tetangga terdekat.</li>
<li><code translate="no">knn_query</code>: Metode ini mencari <code translate="no">k</code> tetangga terdekat dari <code translate="no">query_vector</code> di dalam indeks <code translate="no">p</code>. Metode ini mengembalikan dua larik: <code translate="no">labels</code>, yang berisi indeks tetangga terdekat, dan <code translate="no">distances</code>, yang menunjukkan jarak dari vektor kueri ke masing-masing tetangga ini. Di sini, <code translate="no">k=5</code> menetapkan bahwa kita ingin menemukan lima tetangga terdekat.</li>
</ul>
<p>Berikut adalah hasil setelah mencetak label dan jarak:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>Ini dia, sebuah panduan sederhana untuk memulai penggunaan HNSWlib.</p>
<p>Seperti yang telah disebutkan, HNSWlib adalah mesin pencari vektor yang bagus untuk membuat prototipe atau bereksperimen dengan kumpulan data berukuran sedang. Jika Anda memiliki persyaratan skalabilitas yang lebih tinggi atau membutuhkan fitur tingkat perusahaan lainnya, Anda mungkin perlu memilih basis data vektor yang dibuat khusus seperti <a href="https://zilliz.com/what-is-milvus">Milvus</a> yang bersumber terbuka atau layanan terkelola penuh di <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. Jadi, pada bagian berikut ini, kami akan membandingkan HNSWlib dengan Milvus.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib vs Basis Data Vektor yang Dibangun Khusus Seperti Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/what-is-vector-database">Basis data vektor</a> menyimpan data sebagai representasi matematis, memungkinkan <a href="https://zilliz.com/ai-models">model pembelajaran mesin</a> untuk mendukung pencarian, rekomendasi, dan pembuatan teks dengan mengidentifikasi data melalui <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">metrik kemiripan</a> untuk pemahaman kontekstual.</p>
<p>Pustaka indeks vektor seperti HNSWlib meningkatkan<a href="https://zilliz.com/learn/vector-similarity-search">pencarian</a> dan pengambilan<a href="https://zilliz.com/learn/vector-similarity-search">vektor</a>, tetapi tidak memiliki fitur manajemen seperti database lengkap. Di sisi lain, basis data vektor, seperti <a href="https://milvus.io/">Milvus</a>, dirancang untuk menangani penyematan vektor dalam skala besar, memberikan keuntungan dalam manajemen data, pengindeksan, dan kemampuan kueri yang biasanya tidak dimiliki oleh pustaka mandiri. Berikut adalah beberapa manfaat lain dari penggunaan Milvus:</p>
<ul>
<li><p><strong>Pencarian Kemiripan Vektor Berkecepatan Tinggi</strong>: Milvus menyediakan kinerja pencarian tingkat milidetik di seluruh set data vektor berskala miliaran, ideal untuk aplikasi seperti pencarian gambar, sistem rekomendasi, pemrosesan bahasa alami<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP</a>), dan retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p></li>
<li><p><strong>Skalabilitas dan Ketersediaan Tinggi:</strong> Dibangun untuk menangani volume data yang sangat besar, Milvus berskala horizontal dan menyertakan mekanisme replikasi dan failover untuk keandalan.</p></li>
<li><p><strong>Arsitektur Terdistribusi:</strong> Milvus menggunakan arsitektur terdistribusi dan terukur yang memisahkan penyimpanan dan komputasi di beberapa node untuk fleksibilitas dan ketahanan.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>Pencarian hibrida</strong></a><strong>:</strong> Milvus mendukung pencarian multimodal, <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">pencarian hibrida jarang dan padat</a>, serta <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">pencarian</a> hibrida padat dan <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">teks lengkap</a>, yang menawarkan fungsionalitas pencarian yang serbaguna dan fleksibel.</p></li>
<li><p><strong>Dukungan Data yang Fleksibel</strong>: Milvus mendukung berbagai jenis data-vektor, skalar, dan data terstruktur-memungkinkan manajemen dan analisis yang mulus dalam satu sistem.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Komunitas</strong></a> <strong>dan Dukungan</strong><a href="https://discord.com/invite/8uyFbECzPX"><strong>Aktif</strong></a>: Komunitas yang berkembang menyediakan pembaruan, tutorial, dan dukungan secara berkala, memastikan Milvus tetap selaras dengan kebutuhan pengguna dan kemajuan di lapangan.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">Integrasi AI</a>: Milvus telah terintegrasi dengan berbagai kerangka kerja dan teknologi AI yang populer, sehingga memudahkan para pengembang untuk membangun aplikasi dengan tumpukan teknologi yang sudah mereka kenal.</p></li>
</ul>
<p>Milvus juga menyediakan layanan yang dikelola sepenuhnya di <a href="https://zilliz.com/cloud">Ziliz Cloud</a>, yang bebas repot dan 10x lebih cepat dari Milvus.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">Perbandingan: Milvus vs HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>Fitur</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Skalabilitas</td><td style="text-align:center">Menangani miliaran vektor dengan mudah</td><td style="text-align:center">Cocok untuk dataset yang lebih kecil karena penggunaan RAM</td></tr>
<tr><td style="text-align:center">Ideal untuk</td><td style="text-align:center">Pembuatan prototipe, eksperimen, dan aplikasi tingkat perusahaan</td><td style="text-align:center">Berfokus pada prototipe dan tugas-tugas ANN yang ringan</td></tr>
<tr><td style="text-align:center">Pengindeksan</td><td style="text-align:center">Mendukung 10+ algoritme pengindeksan, termasuk HNSW, DiskANN, Kuantisasi, dan Biner</td><td style="text-align:center">Hanya menggunakan HNSW berbasis grafik</td></tr>
<tr><td style="text-align:center">Integrasi</td><td style="text-align:center">Menawarkan API dan layanan cloud-native</td><td style="text-align:center">Berfungsi sebagai pustaka yang ringan dan mandiri</td></tr>
<tr><td style="text-align:center">Kinerja</td><td style="text-align:center">Mengoptimalkan untuk data besar, kueri terdistribusi</td><td style="text-align:center">Menawarkan kecepatan tinggi tetapi skalabilitas terbatas</td></tr>
</tbody>
</table>
<p>Secara keseluruhan, Milvus umumnya lebih disukai untuk aplikasi berskala besar dan tingkat produksi dengan kebutuhan pengindeksan yang rumit, sementara HNSWlib ideal untuk pembuatan prototipe dan kasus penggunaan yang lebih mudah.</p>
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
    </button></h2><p>Pencarian semantik dapat memakan banyak sumber daya, sehingga penataan data internal, seperti yang dilakukan oleh HNSW, sangat penting untuk pengambilan data yang lebih cepat. Pustaka seperti HNSWlib peduli dengan implementasinya, sehingga para pengembang memiliki resep yang siap untuk membuat prototipe kemampuan vektor. Hanya dengan beberapa baris kode, kita dapat membangun indeks kita sendiri dan melakukan pencarian.</p>
<p>HNSWlib adalah cara yang bagus untuk memulai. Namun, jika Anda ingin membangun aplikasi AI yang kompleks dan siap produksi, basis data vektor yang dibuat khusus adalah pilihan terbaik. Sebagai contoh, <a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka dengan banyak fitur yang siap digunakan oleh perusahaan seperti pencarian vektor berkecepatan tinggi, skalabilitas, ketersediaan, dan fleksibilitas dalam hal tipe data dan bahasa pemrograman.</p>
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
<li><p><a href="https://zilliz.com/learn/faiss">Apa itu Faiss (Pencarian Kemiripan AI Facebook)? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">Apa itu HNSWlib? Pustaka Berbasis Grafik untuk Pencarian ANN yang Cepat </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">Apa itu ScaNN (Scalable Nearest Neighbors)? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: Alat Benchmark VectorDB Sumber Terbuka</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Pusat Sumber Daya AI Generatif | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Apa itu Basis Data Vektor dan Bagaimana Cara Kerjanya? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Apa itu RAG? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Model AI Berkinerja Terbaik untuk Aplikasi GenAI Anda | Zilliz</a></p></li>
</ul>
