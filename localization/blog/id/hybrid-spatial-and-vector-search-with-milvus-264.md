---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Cara Menggunakan Pencarian Spasial dan Vektor Hibrida dengan Milvus
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: >-
  Pelajari bagaimana Milvus 2.6.4 memungkinkan pencarian spasial dan vektor
  hibrida menggunakan Geometri dan R-Tree, dengan wawasan kinerja dan
  contoh-contoh praktis.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>Permintaan seperti "temukan restoran romantis dalam jarak 3 km" terdengar sederhana. Sebenarnya tidak, karena ini menggabungkan pemfilteran lokasi dan pencarian semantik. Sebagian besar sistem perlu membagi kueri ini ke dalam dua basis data, yang berarti menyinkronkan data, menggabungkan hasil dalam kode, dan latensi ekstra.</p>
<p><a href="https://milvus.io">Milvus</a> 2.6.4 menghilangkan pemisahan ini. Dengan tipe data <strong>GEOMETRI</strong> asli dan indeks <strong>R-Tree</strong>, Milvus dapat menerapkan batasan lokasi dan semantik secara bersamaan dalam satu kueri. Hal ini membuat pencarian spasial dan semantik hibrida menjadi lebih mudah dan efisien.</p>
<p>Artikel ini menjelaskan mengapa perubahan ini diperlukan, bagaimana GEOMETRY dan R-Tree bekerja di dalam Milvus, peningkatan kinerja apa yang diharapkan, dan bagaimana cara mengaturnya dengan Python SDK.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">Keterbatasan Pencarian Geografis dan Semantik Tradisional<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Kueri seperti "restoran romantis dalam jarak 3 km" sulit ditangani karena dua alasan:</p>
<ul>
<li><strong>"Romantis" membutuhkan pencarian semantik.</strong> Sistem harus membuat vektor ulasan dan tag restoran, kemudian menemukan kecocokan dengan kesamaan dalam ruang penyematan. Hal ini hanya dapat dilakukan dalam basis data vektor.</li>
<li><strong>"Dalam jarak 3 km" membutuhkan penyaringan spasial.</strong> Hasil harus dibatasi pada "dalam jarak 3 km dari pengguna," atau terkadang "di dalam poligon pengiriman atau batas administratif tertentu."</li>
</ul>
<p>Dalam arsitektur tradisional, memenuhi kedua kebutuhan tersebut biasanya berarti menjalankan dua sistem secara berdampingan:</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong> untuk geofencing, perhitungan jarak, dan penyaringan spasial.</li>
<li><strong>Basis data vektor</strong> untuk pencarian perkiraan tetangga terdekat (ANN) melalui penyematan.</li>
</ul>
<p>Desain "dua basis data" ini menciptakan tiga masalah praktis:</p>
<ul>
<li><strong>Sinkronisasi data yang merepotkan.</strong> Jika sebuah restoran mengubah alamatnya, Anda harus memperbarui sistem geografis dan basis data vektor. Melewatkan satu pembaruan akan menghasilkan hasil yang tidak konsisten.</li>
<li><strong>Latensi yang lebih tinggi.</strong> Aplikasi harus memanggil dua sistem dan menggabungkan output mereka, menambah perjalanan pulang pergi jaringan dan waktu pemrosesan.</li>
<li><strong>Pemfilteran yang tidak efisien.</strong> Jika sistem menjalankan pencarian vektor terlebih dahulu, sering kali sistem mengembalikan banyak hasil yang jauh dari pengguna dan harus dibuang. Jika menerapkan pemfilteran lokasi terlebih dahulu, kumpulan yang tersisa masih besar, sehingga langkah pencarian vektor masih mahal.</li>
</ul>
<p>Milvus 2.6.4 memecahkan masalah ini dengan menambahkan dukungan geometri spasial secara langsung ke basis data vektor. Pencarian semantik dan pemfilteran lokasi sekarang berjalan dalam kueri yang sama. Dengan semua yang ada di dalam satu sistem, pencarian hybrid menjadi lebih cepat dan lebih mudah untuk dikelola.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">Apa yang ditambahkan GEOMETRI ke Milvus<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 memperkenalkan tipe field skalar yang disebut DataType.GEOMETRY. Alih-alih menyimpan lokasi sebagai angka bujur dan lintang yang terpisah, Milvus sekarang menyimpan objek geometri: titik, garis, dan poligon. Pertanyaan seperti "apakah titik ini berada di dalam sebuah wilayah?" atau "apakah titik ini berada dalam jarak X meter?" menjadi operasi asli. Tidak perlu membuat solusi atas koordinat mentah.</p>
<p>Implementasi mengikuti<strong>standar Akses Fitur Sederhana OpenGIS</strong> <a href="https://www.ogc.org/standard/sfa/"></a><strong></strong>, sehingga dapat digunakan dengan sebagian besar peralatan geospasial yang ada. Data geometri disimpan dan ditanyakan menggunakan <strong>WKT (Well-Known Text)</strong>, sebuah format teks standar yang dapat dibaca oleh manusia dan dapat diuraikan oleh program.</p>
<p>Jenis geometri yang didukung:</p>
<ul>
<li><strong>TITIK</strong>: satu lokasi, seperti alamat toko atau posisi real-time kendaraan</li>
<li><strong>LINESTRING</strong>: garis, seperti garis tengah jalan atau jalur pergerakan</li>
<li><strong>POLIGON</strong>: sebuah area, seperti batas administratif atau geofence</li>
<li><strong>Jenis koleksi</strong>: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON, dan KOLEKSI GEOMETRI</li>
</ul>
<p>Ini juga mendukung operator spasial standar, termasuk:</p>
<ul>
<li><strong>Hubungan spasial</strong>: penahanan (ST_CONTAINS, ST_WITHIN), persimpangan (ST_INTERSECTS, ST_CROSSES), dan kontak (ST_TOUCHES)</li>
<li><strong>Operasi jarak</strong>: menghitung jarak antara geometri (ST_DISTANCE) dan memfilter objek-objek dalam jarak tertentu (ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">Bagaimana Pengindeksan R-Tree Bekerja di Dalam Milvus<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Dukungan GEOMETRI dibangun ke dalam mesin kueri Milvus, tidak hanya diekspos sebagai fitur API. Data spasial diindeks dan diproses secara langsung di dalam mesin menggunakan indeks R-Tree (Pohon Persegi Panjang).</p>
<p><strong>R-Tree</strong> mengelompokkan objek-objek yang berdekatan menggunakan <strong>persegi panjang pembatas minimum (MBR)</strong>. Selama kueri, mesin melewatkan wilayah besar yang tidak tumpang tindih dengan geometri kueri dan hanya menjalankan pemeriksaan terperinci pada sekumpulan kecil kandidat. Hal ini jauh lebih cepat daripada memindai setiap objek.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Bagaimana Milvus Membangun R-Tree</h3><p>Konstruksi R-Tree dilakukan secara berlapis-lapis:</p>
<table>
<thead>
<tr><th><strong>Level</strong></th><th><strong>Apa yang dilakukan Milvus</strong></th><th><strong>Analogi Intuitif</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Tingkat daun</strong></td><td>Untuk setiap objek geometri (titik, garis, atau poligon), Milvus menghitung persegi panjang pembatas minimum (MBR) dan menyimpannya sebagai simpul daun.</td><td>Membungkus setiap objek dalam sebuah kotak transparan yang sesuai dengan objek tersebut.</td></tr>
<tr><td><strong>Tingkat menengah</strong></td><td>Simpul-simpul daun yang berdekatan dikelompokkan bersama (biasanya 50-100 sekaligus), dan MBR induk yang lebih besar dibuat untuk mencakup semuanya.</td><td>Menempatkan paket dari lingkungan yang sama ke dalam satu peti pengiriman.</td></tr>
<tr><td><strong>Tingkat akar</strong></td><td>Pengelompokan ini berlanjut ke atas hingga semua data dicakup oleh satu root MBR.</td><td>Memuat semua peti ke dalam satu truk jarak jauh.</td></tr>
</tbody>
</table>
<p>Dengan adanya struktur ini, kompleksitas kueri spasial turun dari pemindaian penuh <strong>O(n)</strong> menjadi <strong>O(log n)</strong>. Pada praktiknya, kueri atas jutaan catatan dapat berubah dari ratusan milidetik menjadi hanya beberapa milidetik, tanpa kehilangan akurasi.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">Bagaimana Kueri Dieksekusi: Pemfilteran Dua Fase</h3><p>Untuk menyeimbangkan kecepatan dan ketepatan, Milvus menggunakan strategi pemfilteran <strong>dua fase</strong>:</p>
<ul>
<li><strong>Filter kasar:</strong> indeks R-Tree pertama-tama memeriksa apakah persegi panjang pembatas kueri tumpang tindih dengan persegi panjang pembatas lainnya dalam indeks. Hal ini dengan cepat menghapus sebagian besar data yang tidak terkait dan hanya menyimpan sejumlah kecil kandidat. Karena persegi panjang ini merupakan bentuk yang sederhana, pemeriksaan ini sangat cepat, tetapi dapat menyertakan beberapa hasil yang sebenarnya tidak cocok.</li>
<li><strong>Filter halus</strong>: kandidat yang tersisa kemudian diperiksa menggunakan <strong>GEOS</strong>, pustaka geometri yang sama yang digunakan oleh sistem seperti PostGIS. GEOS menjalankan perhitungan geometri yang tepat, seperti apakah bentuk-bentuk tersebut berpotongan atau mengandung bentuk lainnya, untuk menghasilkan hasil akhir yang benar.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus menerima data geometri dalam format <strong>WKT (Well-Known Text)</strong> namun menyimpannya secara internal sebagai <strong>WKB (Well-Known Binary)</strong>. WKB lebih ringkas, sehingga memangkas penyimpanan dan meningkatkan I/O. Bidang GEOMETRI juga mendukung penyimpanan yang dipetakan dalam memori (mmap), sehingga set data spasial yang besar tidak perlu muat seluruhnya dalam RAM.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">Peningkatan Kinerja dengan R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">Latensi Kueri Tetap Rata Seiring Bertambahnya Data.</h3><p>Tanpa indeks R-Tree, waktu kueri berskala linier dengan ukuran data - 10x lebih banyak data berarti kueri yang 10x lebih lambat.</p>
<p>Dengan R-Tree, waktu kueri bertambah secara logaritmik. Pada dataset dengan jutaan record, pemfilteran spasial dapat menjadi puluhan hingga ratusan kali lebih cepat daripada pemindaian penuh.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">Akurasi Tidak Dikorbankan Demi Kecepatan</h3><p>R-Tree mempersempit kandidat dengan kotak pembatas, kemudian GEOS memeriksa setiap kandidat dengan matematika geometri yang tepat. Apa pun yang terlihat seperti kecocokan tetapi sebenarnya berada di luar area kueri akan dihapus pada lintasan kedua.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">Hasil Pencarian Hibrida Meningkat</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>R-Tree menghapus catatan di luar area target terlebih dahulu. Milvus kemudian menjalankan kemiripan vektor (L2, IP, atau cosinus) hanya pada kandidat yang tersisa. Lebih sedikit kandidat berarti biaya pencarian yang lebih rendah dan kueri per detik (QPS) yang lebih tinggi.</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">Memulai: GEOMETRI dengan Python SDK<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">Mendefinisikan Koleksi dan Membuat Indeks</h3><p>Pertama, tentukan bidang DataType.GEOMETRY dalam skema koleksi. Hal ini memungkinkan Milvus untuk menyimpan dan melakukan kueri data geometri.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">Memasukkan Data</h3><p>Ketika memasukkan data, nilai geometri harus dalam format WKT (Well-Known Text). Setiap record mencakup geometri, vektor, dan bidang lainnya.</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">Menjalankan Kueri Spasial-Vektor Hibrida (Contoh)</h3><p><strong>Skenario:</strong> temukan 3 POI teratas yang paling mirip dalam ruang vektor dan berada dalam jarak 2 kilometer dari titik yang diberikan, seperti lokasi pengguna.</p>
<p>Gunakan operator ST_DWITHIN untuk menerapkan filter jarak. Nilai jarak ditentukan dalam <strong>meter</strong>.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">Tips untuk Penggunaan Produksi<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>Selalu buat indeks R-Tree pada bidang GEOMETRI.</strong> Untuk set data di atas 10.000 entitas, filter spasial tanpa indeks RTREE akan kembali ke pemindaian penuh, dan kinerja akan menurun tajam.</li>
<li><strong>Gunakan sistem koordinat yang konsisten.</strong> Semua data lokasi harus menggunakan sistem yang sama (misalnya, <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). Mencampur sistem koordinat akan merusak perhitungan jarak dan kontur.</li>
<li><strong>Pilih operator spasial yang tepat untuk kueri.</strong> ST_DWITHIN untuk pencarian "dalam jarak X meter". ST_CONTAINS atau ST_WITHIN untuk pemeriksaan geofencing dan penahanan.</li>
<li><strong>Nilai geometri NULL akan ditangani secara otomatis.</strong> Jika bidang GEOMETRI dapat di-null-kan (nullable = True), Milvus melewatkan nilai NULL selama kueri spasial. Tidak ada logika pemfilteran tambahan yang diperlukan.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">Persyaratan Penerapan<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk menggunakan fitur-fitur ini dalam produksi, pastikan lingkungan Anda memenuhi persyaratan berikut.</p>
<p><strong>1. Versi Milvus</strong></p>
<p>Anda harus menjalankan <strong>Milvus 2.6.4 atau yang lebih baru</strong>. Versi sebelumnya tidak mendukung DataType.GEOMETRY atau tipe indeks <strong>RTREE</strong>.</p>
<p><strong>2. Versi SDK</strong></p>
<ul>
<li><strong>PyMilvus</strong>: tingkatkan ke versi terbaru (direkomendasikan seri <strong>2.6.x</strong> ). Hal ini diperlukan untuk serialisasi WKT yang tepat dan untuk melewatkan parameter indeks RTREE.</li>
<li><strong>Java / Go / Node SDK</strong>: periksa catatan rilis untuk setiap SDK dan konfirmasikan bahwa mereka selaras dengan definisi proto <strong>2.6.4</strong>.</li>
</ul>
<p><strong>3. Pustaka Geometri Bawaan</strong></p>
<p>Server Milvus sudah menyertakan Boost.Geometry dan GEOS, sehingga Anda tidak perlu menginstal sendiri pustaka-pustaka ini.</p>
<p><strong>4. Penggunaan Memori dan Perencanaan Kapasitas</strong></p>
<p>Indeks R-Tree menggunakan memori ekstra. Ketika merencanakan kapasitas, ingatlah untuk menganggarkan untuk indeks geometri serta indeks vektor seperti HNSW atau IVF. Bidang GEOMETRI mendukung penyimpanan yang dipetakan dengan memori (mmap), yang dapat mengurangi penggunaan memori dengan menyimpan sebagian data pada disk.</p>
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
    </button></h2><p>Pencarian semantik berbasis lokasi membutuhkan lebih dari sekadar memasang filter geografis pada kueri vektor. Ini membutuhkan tipe data spasial bawaan, indeks yang tepat, dan mesin kueri yang dapat menangani lokasi dan vektor secara bersamaan.</p>
<p><strong>Milvus 2.6.4</strong> memecahkan masalah ini dengan bidang <strong>GEOMETRI</strong> asli dan indeks <strong>R-Tree</strong>. Pemfilteran spasial dan pencarian vektor berjalan dalam satu kueri, terhadap satu penyimpanan data. R-Tree menangani pemangkasan spasial yang cepat sementara GEOS memastikan hasil yang tepat.</p>
<p>Untuk aplikasi yang membutuhkan pengambilan lokasi, ini menghilangkan kerumitan menjalankan dan menyinkronkan dua sistem yang terpisah.</p>
<p>Jika Anda sedang mengerjakan pencarian spasial dan vektor yang sadar lokasi atau hibrida, kami ingin mendengar pengalaman Anda.</p>
<p><strong>Punya pertanyaan tentang Milvus?</strong> Bergabunglah dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">saluran Slack</a> kami atau pesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kerja Milvus</a> selama 20 menit.</p>
