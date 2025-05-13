---
id: how-to-filter-efficiently-without-killing-recall.md
title: >-
  Pencarian Vektor di Dunia Nyata: Cara Memfilter Secara Efisien Tanpa Mematikan
  Recall
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: >-
  Blog ini mengeksplorasi teknik penyaringan populer dalam pencarian vektor,
  bersama dengan pengoptimalan inovatif yang kami bangun di Milvus dan Zilliz
  Cloud.
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>Banyak orang mengira pencarian vektor hanyalah tentang mengimplementasikan algoritma ANN (Approximate Nearest Neighbor) dan selesai. Tetapi jika Anda menjalankan pencarian vektor dalam produksi, Anda akan tahu yang sebenarnya: pencarian vektor akan menjadi sangat rumit dengan cepat.</p>
<p>Bayangkan Anda sedang membangun mesin pencari produk. Seorang pengguna mungkin bertanya, "<em>Tunjukkan sepatu yang mirip dengan foto ini, tetapi hanya berwarna merah dan di bawah $100</em>." Melayani kueri ini membutuhkan penerapan filter metadata pada hasil pencarian kemiripan semantik. Kedengarannya sesederhana menerapkan filter setelah hasil pencarian vektor Anda? Tidak juga.</p>
<p>Apa yang terjadi jika kondisi pemfilteran Anda sangat selektif? Anda mungkin tidak akan mendapatkan hasil yang cukup. Dan hanya dengan meningkatkan parameter <strong>topK</strong> pencarian vektor dapat dengan cepat menurunkan kinerja dan menghabiskan lebih banyak sumber daya untuk menangani volume pencarian yang sama.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Di balik itu, pemfilteran metadata yang efisien cukup menantang. Basis data vektor Anda perlu memindai indeks grafik, menerapkan filter metadata, dan tetap merespons dalam anggaran latensi yang ketat, katakanlah, 20 milidetik. Melayani ribuan kueri seperti itu per detik tanpa mengalami kebangkrutan membutuhkan rekayasa yang bijaksana dan pengoptimalan yang cermat.</p>
<p>Blog ini mengeksplorasi teknik penyaringan populer dalam pencarian vektor, bersama dengan pengoptimalan inovatif yang kami bangun ke dalam basis data vektor <a href="https://milvus.io/docs/overview.md">Milvus</a> dan layanan cloud yang dikelola sepenuhnya<a href="https://zilliz.com/cloud">(Zilliz Cloud)</a>. Kami juga akan membagikan tes tolok ukur yang menunjukkan seberapa besar kinerja yang dapat dicapai oleh Milvus yang dikelola sepenuhnya dengan anggaran cloud $1000 dibandingkan database vektor lainnya.</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">Pengoptimalan Indeks Grafik<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor membutuhkan metode pengindeksan yang efisien untuk menangani kumpulan data yang besar. Tanpa indeks, database harus membandingkan kueri Anda dengan setiap vektor dalam kumpulan data (pemindaian brute-force), yang menjadi sangat lambat saat data Anda bertambah.</p>
<p><strong>Milvus</strong> mendukung berbagai jenis indeks untuk mengatasi tantangan kinerja ini. Yang paling populer adalah jenis indeks berbasis grafik: HNSW (berjalan sepenuhnya di memori) dan DiskANN (secara efisien menggunakan memori dan SSD). Indeks ini mengatur vektor ke dalam struktur jaringan di mana lingkungan vektor terhubung pada peta, sehingga memungkinkan pencarian dengan cepat menavigasi ke hasil yang relevan sambil memeriksa hanya sebagian kecil dari semua vektor. <strong>Zilliz Cloud</strong>, layanan Milvus yang dikelola sepenuhnya, mengambil satu langkah lebih jauh dengan memperkenalkan Cardinal, mesin pencari vektor yang canggih, yang semakin meningkatkan indeks ini untuk kinerja yang lebih baik.</p>
<p>Namun, ketika kami menambahkan persyaratan penyaringan (seperti "hanya menampilkan produk yang kurang dari $100"), masalah baru muncul. Pendekatan standarnya adalah membuat <em>bitset</em> - daftar yang menandai vektor mana yang memenuhi kriteria penyaringan. Selama pencarian, sistem hanya mempertimbangkan vektor yang ditandai sebagai valid dalam bitset ini. Pendekatan ini tampak logis, tetapi menciptakan masalah serius: <strong>konektivitas yang rusak</strong>. Ketika banyak vektor yang tersaring, jalur yang telah dibangun dengan hati-hati dalam indeks graf kita akan terganggu.</p>
<p>Berikut adalah contoh sederhana dari masalah ini: Pada diagram di bawah ini, Titik A terhubung ke B, C, dan D, tetapi B, C, dan D tidak terhubung secara langsung satu sama lain. Jika filter kita menghapus titik A (mungkin terlalu mahal), maka meskipun B, C, dan D relevan dengan pencarian kita, jalur di antara mereka akan terputus. Hal ini menciptakan "pulau-pulau" vektor terputus yang tidak dapat dijangkau selama pencarian, sehingga merusak kualitas hasil (recall).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ada dua pendekatan umum untuk memfilter selama penelusuran grafik: mengecualikan semua titik yang difilter di awal, atau menyertakan semua titik dan menerapkan filter setelahnya. Seperti yang diilustrasikan dalam diagram di bawah ini, tidak ada pendekatan yang ideal. Melewatkan titik-titik yang difilter seluruhnya dapat menyebabkan recall runtuh saat rasio penyaringan mendekati 1 (garis biru), sementara mengunjungi setiap titik tanpa memperhatikan metadata-nya akan membengkakkan ruang pencarian dan memperlambat kinerja secara signifikan (garis merah).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para peneliti telah mengusulkan beberapa pendekatan untuk mencapai keseimbangan antara recall dan kinerja:</p>
<ol>
<li><strong>Strategi Alpha:</strong> Strategi ini memperkenalkan pendekatan probabilistik: meskipun sebuah vektor tidak cocok dengan filter, kita mungkin masih mengunjunginya selama pencarian dengan beberapa probabilitas. Probabilitas (alpha) ini bergantung pada rasio penyaringan - seberapa ketat filter tersebut. Hal ini membantu mempertahankan koneksi-koneksi penting dalam graf tanpa mengunjungi terlalu banyak vektor yang tidak relevan.</li>
</ol>
<ol start="2">
<li><strong>Metode ACORN [1]:</strong> Pada HNSW standar, pemangkasan sisi digunakan selama konstruksi indeks untuk membuat graf yang jarang dan mempercepat pencarian. Metode ACORN dengan sengaja melewatkan langkah pemangkasan ini untuk mempertahankan lebih banyak sisi dan memperkuat konektivitas - hal yang sangat penting ketika filter dapat mengecualikan banyak simpul. Dalam beberapa kasus, ACORN juga memperluas daftar tetangga setiap node dengan mengumpulkan perkiraan tetangga terdekat, yang semakin memperkuat graf. Selain itu, algoritma penjelajahannya melihat dua langkah ke depan (yaitu, memeriksa tetangga dari tetangga), meningkatkan kemungkinan menemukan jalur yang valid bahkan di bawah rasio penyaringan yang tinggi.</li>
</ol>
<ol start="3">
<li><strong>Tetangga yang Dipilih Secara Dinamis:</strong> Sebuah metode yang lebih baik dari Strategi Alpha. Alih-alih bergantung pada lompatan probabilistik, pendekatan ini secara adaptif memilih node berikutnya selama pencarian. Pendekatan ini menawarkan lebih banyak kontrol daripada Strategi Alpha.</li>
</ol>
<p>Di Milvus, kami menerapkan strategi Alpha bersama dengan teknik pengoptimalan lainnya. Sebagai contoh, Milvus secara dinamis mengganti strategi ketika mendeteksi filter yang sangat selektif: ketika, katakanlah, sekitar 99% data tidak cocok dengan ekspresi pemfilteran, strategi "sertakan semua" akan menyebabkan jalur penelusuran grafik memanjang secara signifikan, mengakibatkan penurunan kinerja dan "pulau-pulau" data yang terisolasi. Dalam kasus seperti itu, Milvus secara otomatis kembali ke pemindaian brute-force, melewati indeks grafik sepenuhnya untuk efisiensi yang lebih baik. Di Cardinal, mesin pencari vektor yang mendukung Milvus (Zilliz Cloud) yang dikelola secara penuh, kami telah mengambil langkah lebih jauh dengan mengimplementasikan kombinasi dinamis dari metode penjelajahan "sertakan semua" dan "kecualikan semua" yang secara cerdas beradaptasi berdasarkan statistik data untuk mengoptimalkan kinerja kueri.</p>
<p>Eksperimen kami pada dataset Cohere 1M (dimensi = 768) menggunakan instance AWS r7gd.4xlarge menunjukkan keefektifan pendekatan ini. Pada grafik di bawah ini, garis biru mewakili strategi kombinasi dinamis kami, sedangkan garis merah menggambarkan pendekatan dasar yang melintasi semua titik yang difilter dalam grafik.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">Pengindeksan Sadar Metadata<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Tantangan lain datang dari bagaimana metadata dan penyematan vektor berhubungan satu sama lain. Pada sebagian besar aplikasi, properti metadata suatu item (misalnya, harga produk) memiliki hubungan minimal dengan apa yang sebenarnya diwakili oleh vektor (makna semantik atau fitur visual). Sebagai contoh, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">gaun</annotation><mrow><mi>90dressanda90</mi></mrow><annotation encoding="application/x-tex">dan</annotation></semantics></math></span></span>sabuk <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90</span></span></span></span>memiliki harga yang sama tetapi menunjukkan karakteristik visual yang sangat berbeda. Ketidaksinambungan ini membuat penggabungan pemfilteran dengan pencarian vektor menjadi tidak efisien.</p>
<p>Untuk mengatasi masalah ini, kami telah mengembangkan <strong>indeks vektor yang sadar metadata</strong>. Alih-alih hanya memiliki satu grafik untuk semua vektor, indeks ini membuat "subgraf" khusus untuk nilai metadata yang berbeda. Sebagai contoh, jika data Anda memiliki bidang untuk "warna" dan "bentuk", maka akan dibuatkan struktur grafik terpisah untuk bidang-bidang ini.</p>
<p>Ketika Anda mencari dengan filter seperti "warna = biru", ia menggunakan subgraf khusus warna daripada grafik utama. Ini jauh lebih cepat karena subgraf sudah diatur di sekitar metadata yang Anda filter.</p>
<p>Pada gambar di bawah ini, indeks grafik utama disebut <strong>grafik dasar</strong>, sedangkan grafik khusus yang dibuat untuk bidang metadata tertentu disebut <strong>grafik kolom.</strong> Untuk mengelola penggunaan memori secara efektif, grafik ini membatasi berapa banyak koneksi yang dapat dimiliki oleh setiap titik (out-degree). Ketika sebuah pencarian tidak menyertakan filter metadata apa pun, ia akan menggunakan grafik dasar. Ketika filter diterapkan, ia akan beralih ke grafik kolom yang sesuai, menawarkan keuntungan kecepatan yang signifikan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">Pemfilteran Iteratif<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Terkadang pemfilteran itu sendiri menjadi hambatan, bukan pencarian vektor. Hal ini terjadi terutama pada filter yang rumit seperti kondisi JSON atau perbandingan string yang mendetail. Pendekatan tradisional (filter terlebih dahulu, kemudian pencarian) bisa sangat lambat karena sistem harus mengevaluasi filter yang mahal ini pada jutaan record yang berpotensi bahkan sebelum memulai pencarian vektor.</p>
<p>Anda mungkin berpikir: "Mengapa tidak melakukan pencarian vektor terlebih dahulu, lalu menyaring hasil teratas?" Pendekatan ini terkadang berhasil, tetapi memiliki kelemahan utama: jika filter Anda ketat dan menyaring sebagian besar hasil, Anda mungkin akan mendapatkan hasil yang terlalu sedikit (atau nol) setelah penyaringan.</p>
<p>Untuk mengatasi dilema ini, kami menciptakan <strong>Penyaringan Iteratif</strong> di Milvus dan Zilliz Cloud, yang terinspirasi oleh<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a>. Alih-alih pendekatan semua atau tidak sama sekali, Pemfilteran Iteratif bekerja dalam batch:</p>
<ol>
<li><p>Dapatkan sekumpulan kecocokan vektor terdekat</p></li>
<li><p>Menerapkan filter ke kumpulan ini</p></li>
<li><p>Jika kita tidak memiliki cukup hasil yang difilter, dapatkan kumpulan lainnya</p></li>
<li><p>Ulangi hingga kita mendapatkan jumlah hasil yang dibutuhkan</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pendekatan ini secara dramatis mengurangi jumlah operasi penyaringan yang mahal yang perlu kita lakukan, namun tetap memastikan bahwa kita mendapatkan hasil yang cukup berkualitas tinggi. Untuk informasi lebih lanjut tentang cara mengaktifkan pemfilteran berulang, silakan lihat <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">halaman dokumen pemfilteran berulang</a> ini.</p>
<h2 id="External-Filtering" class="common-anchor-header">Pemfilteran Eksternal<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Banyak aplikasi dunia nyata yang membagi datanya ke dalam sistem yang berbeda - vektor dalam basis data vektor dan metadata dalam basis data tradisional. Sebagai contoh, banyak organisasi menyimpan deskripsi produk dan ulasan pengguna sebagai vektor di Milvus untuk pencarian semantik, sambil menyimpan status inventaris, harga, dan data terstruktur lainnya di basis data tradisional seperti PostgreSQL atau MongoDB.</p>
<p>Pemisahan ini masuk akal secara arsitektur tetapi menciptakan tantangan untuk pencarian yang difilter. Alur kerja yang umum terjadi adalah:</p>
<ul>
<li><p>Kueri basis data relasional Anda untuk mencari catatan yang cocok dengan kriteria filter (misalnya, "barang dalam stok di bawah $50")</p></li>
<li><p>Dapatkan ID yang cocok dan kirimkan ke Milvus untuk memfilter pencarian vektor</p></li>
<li><p>Lakukan pencarian semantik hanya pada vektor yang cocok dengan ID ini</p></li>
</ul>
<p>Hal ini terdengar sederhana-tetapi ketika jumlah baris bertambah menjadi jutaan, hal ini akan menjadi hambatan. Mentransfer daftar ID yang besar akan menghabiskan bandwidth jaringan, dan mengeksekusi ekspresi filter yang sangat besar di Milvus akan menambah biaya.</p>
<p>Untuk mengatasi hal ini, kami memperkenalkan <strong>Pemfilteran Eksternal</strong> di Milvus, solusi tingkat SDK ringan yang menggunakan API iterator pencarian dan membalikkan alur kerja tradisional.</p>
<ul>
<li><p>Melakukan pencarian vektor terlebih dahulu, mengambil kumpulan kandidat yang paling relevan secara semantik</p></li>
<li><p>Menerapkan fungsi filter kustom Anda ke setiap batch di sisi klien</p></li>
<li><p>Secara otomatis mengambil lebih banyak batch hingga Anda memiliki cukup hasil yang difilter</p></li>
</ul>
<p>Pendekatan batch dan berulang ini secara signifikan mengurangi lalu lintas jaringan dan overhead pemrosesan, karena Anda hanya bekerja dengan kandidat yang paling menjanjikan dari pencarian vektor.</p>
<p>Berikut adalah contoh cara menggunakan Pemfilteran Eksternal di pymilvus:</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>Tidak seperti Pemfilteran Iteratif, yang beroperasi pada iterator tingkat segmen, Pemfilteran Eksternal bekerja pada tingkat kueri global. Desain ini meminimalkan evaluasi metadata dan menghindari eksekusi filter yang besar di dalam Milvus, sehingga menghasilkan kinerja end-to-end yang lebih ramping dan lebih cepat.</p>
<h2 id="AutoIndex" class="common-anchor-header">Indeks Otomatis<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencarian vektor selalu melibatkan tradeoff antara akurasi dan kecepatan - semakin banyak vektor yang Anda periksa, semakin baik hasil yang Anda dapatkan, tetapi semakin lambat kueri Anda. Ketika Anda menambahkan filter, keseimbangan ini menjadi lebih sulit untuk didapatkan.</p>
<p>Di Zilliz Cloud, kami telah menciptakan <strong>AutoIndex</strong> - pengoptimal berbasis ML yang secara otomatis menyempurnakan keseimbangan ini untuk Anda. Alih-alih mengonfigurasi parameter yang rumit secara manual, AutoIndex menggunakan pembelajaran mesin untuk menentukan pengaturan optimal untuk data dan pola kueri spesifik Anda.</p>
<p>Untuk memahami cara kerjanya, ada baiknya kita mengetahui sedikit tentang arsitektur Milvus karena Zilliz dibangun di atas Milvus: Kueri didistribusikan di beberapa instance QueryNode. Setiap node menangani sebagian dari data Anda (segmen), melakukan pencarian, dan kemudian hasilnya digabungkan.</p>
<p>AutoIndex menganalisis statistik dari segmen-segmen ini dan membuat penyesuaian yang cerdas. Untuk rasio penyaringan yang rendah, rentang kueri indeks diperlebar untuk meningkatkan daya ingat. Untuk rasio penyaringan yang tinggi, rentang kueri dipersempit untuk menghindari upaya yang sia-sia pada kandidat yang tidak mungkin. Keputusan ini dipandu oleh model statistik yang memprediksi strategi pencarian yang paling efektif untuk setiap skenario penyaringan tertentu.</p>
<p>AutoIndex lebih dari sekadar parameter pengindeksan. Ini juga membantu memilih strategi evaluasi filter terbaik. Dengan menguraikan ekspresi filter dan data segmen sampling, ia dapat memperkirakan biaya evaluasi. Jika mendeteksi biaya evaluasi yang tinggi, maka secara otomatis akan beralih ke teknik yang lebih efisien seperti Pemfilteran Iteratif. Penyesuaian dinamis ini memastikan Anda selalu menggunakan strategi yang paling sesuai untuk setiap kueri.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">Performa dengan Anggaran $1.000<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>Meskipun peningkatan secara teoritis itu penting, kinerja dunia nyata adalah hal yang paling penting bagi sebagian besar pengembang. Kami ingin menguji bagaimana pengoptimalan ini diterjemahkan ke dalam kinerja aplikasi yang sebenarnya di bawah batasan anggaran yang realistis.</p>
<p>Kami membandingkan beberapa solusi basis data vektor dengan anggaran bulanan praktis sebesar $1.000 - jumlah yang masuk akal yang akan dialokasikan oleh banyak perusahaan untuk infrastruktur pencarian vektor. Untuk setiap solusi, kami memilih konfigurasi instance dengan kinerja tertinggi yang memungkinkan dalam batasan anggaran ini.</p>
<p>Pengujian yang kami gunakan:</p>
<ul>
<li><p>Kumpulan data Cohere 1M dengan 1 juta vektor 768 dimensi</p></li>
<li><p>Campuran beban kerja pencarian yang difilter dan tanpa filter di dunia nyata</p></li>
<li><p>Alat benchmark vdb-bench sumber terbuka untuk perbandingan yang konsisten</p></li>
</ul>
<p>Solusi yang bersaing (dianonimkan sebagai "VDB A," "VDB B," dan "VDB C") semuanya dikonfigurasikan secara optimal sesuai anggaran. Hasilnya menunjukkan bahwa Milvus (Zilliz Cloud) yang dikelola sepenuhnya secara konsisten mencapai throughput tertinggi di seluruh kueri yang difilter dan tidak difilter. Dengan anggaran $1000 yang sama, teknik pengoptimalan kami memberikan performa paling tinggi dengan daya ingat yang kompetitif.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Pencarian vektor dengan pemfilteran mungkin terlihat sederhana di permukaan - cukup tambahkan klausa filter ke kueri Anda dan selesai. Namun, seperti yang telah kami tunjukkan di blog ini, untuk mencapai kinerja tinggi dan hasil yang akurat dalam skala besar membutuhkan solusi teknik yang canggih. Milvus dan Zilliz Cloud menjawab tantangan ini melalui beberapa pendekatan inovatif:</p>
<ul>
<li><p><strong>Pengoptimalan Indeks Grafik</strong>: Mempertahankan jalur di antara item yang serupa bahkan ketika filter menghapus node penghubung, mencegah masalah "pulau" yang mengurangi kualitas hasil.</p></li>
<li><p><strong>Pengindeksan Sadar Metadata</strong>: Membuat jalur khusus untuk kondisi filter yang umum, membuat pencarian yang difilter menjadi lebih cepat secara signifikan tanpa mengorbankan akurasi.</p></li>
<li><p><strong>Pemfilteran Iteratif</strong>: Memproses hasil dalam kelompok, menerapkan filter yang rumit hanya pada kandidat yang paling menjanjikan, bukan pada seluruh dataset.</p></li>
<li><p><strong>AutoIndex</strong>: Menggunakan pembelajaran mesin untuk menyesuaikan parameter pencarian secara otomatis berdasarkan data dan kueri Anda, menyeimbangkan kecepatan dan akurasi tanpa konfigurasi manual.</p></li>
<li><p><strong>Pemfilteran Eksternal</strong>: Menjembatani pencarian vektor dengan basis data eksternal secara efisien, menghilangkan hambatan jaringan sambil mempertahankan kualitas hasil.</p></li>
</ul>
<p>Milvus dan Zilliz Cloud terus berkembang dengan kemampuan baru yang semakin meningkatkan kinerja pencarian yang difilter. Fitur-fitur seperti<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Key</a> memungkinkan pengaturan data yang lebih efisien berdasarkan pola penyaringan, dan teknik perutean subgraf yang canggih mendorong batas kinerja lebih jauh lagi.</p>
<p>Volume dan kompleksitas data yang tidak terstruktur terus berkembang secara eksponensial, menciptakan tantangan baru bagi sistem pencarian di mana pun. Tim kami terus mendorong batas-batas apa yang mungkin dilakukan dengan basis data vektor untuk menghadirkan pencarian bertenaga AI yang lebih cepat dan lebih terukur.</p>
<p>Jika aplikasi Anda mengalami hambatan kinerja dengan pencarian vektor yang difilter, kami mengundang Anda untuk bergabung dengan komunitas pengembang aktif kami di <a href="https://milvus.io/community">milvus.io/community</a> - di mana Anda dapat berbagi tantangan, mengakses panduan ahli, dan menemukan praktik terbaik yang sedang berkembang.</p>
<h2 id="References" class="common-anchor-header">Referensi<button data-href="#References" class="anchor-icon" translate="no">
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
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
