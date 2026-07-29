---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >-
  Mengumumkan Milvus 3.0: Pencarian Vektor Lake-Native dan Mesin Retrieval yang
  Lebih Kuat
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Temukan pencarian vektor lake-native Milvus 3.0, koleksi eksternal zero-copy,
  retrieval sparse yang lebih cepat, snapshot, integrasi Spark, dan kemampuan
  ranking tingkat lanjut.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Hari ini, kami merilis Milvus 3.0, sebuah tonggak arsitektur besar bagi proyek ini. Rilis ini mengubah baik tempat Milvus dapat membangun dan melayani indeks maupun seberapa banyak pekerjaan retrieval yang dapat dilakukan langsung di dalam engine.</p>
<ul>
<li>Milvus 3.0 memperkenalkan <strong>jalur lake-native</strong> untuk mengindeks data vektor yang berada di object storage dan format tabel terbuka, termasuk Parquet, Lance, Iceberg, dan Vortex. Tim dapat membuat data yang berada di lake dapat dicari tanpa memelihara salinan lain di database vektor.</li>
<li><strong>Rilis ini juga memperluas Milvus melampaui retrieval kandidat awal.</strong> Sorting sisi server, agregasi, pencarian berfaset, StructArray untuk struktur doc/chunk bersarang dan vektor ColBERT, serta indeks sparse yang didesain ulang memindahkan lebih banyak ranking, grouping, dan pemrosesan hasil keluar dari kode aplikasi dan masuk ke engine retrieval.</li>
</ul>
<p>Bersama-sama, kemajuan ini menjadikan Milvus fondasi open-source untuk retrieval AI produksi dan untuk arsitektur <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> yang menggabungkan penyimpanan lake-native dengan retrieval vektor berkinerja tinggi.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Sekilas tentang rangkaian fitur Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Area</strong></th><th><strong>Fitur</strong></th><th><strong>Mengapa ini penting</strong></th></tr>
</thead>
<tbody>
<tr><td>Retrieval lake-native</td><td>External Collections di atas Parquet, Lance, Iceberg, dan Vortex</td><td>Cari data yang berada di lake tanpa memelihara salinan serving kedua</td></tr>
<tr><td>Penyimpanan berbasis S3</td><td>Loon (Storage v3)</td><td>Mengurangi amplifikasi point-read untuk akses bergaya serving dan mendukung evolusi skema</td></tr>
<tr><td>Workflow offline/batch dan pemulihan</td><td>Snapshots, Spark DataSource V2, dan evolusi skema online</td><td>Membawa view collection yang stabil ke dalam evaluasi, deduplikasi, clustering, dan pipeline fitur</td></tr>
<tr><td>Engine retrieval</td><td>ORDER BY, agregasi, facets, StructArray, dan retrieval sparse yang ditingkatkan</td><td>Memindahkan lebih banyak pemrosesan hasil dan scoring multi-vektor ke Milvus</td></tr>
<tr><td>Model Data &amp; Operasi</td><td>Vektor nullable, TEXT LOB, TTL, MinHash, Woodpecker, dan ForceMerge</td><td>Mendukung model data yang lebih kaya dan pola operasi produksi</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">Infrastruktur lake-native: indeks dan layani data di tempat data itu sudah berada<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Perubahan arsitektur terbesar di Milvus 3.0 adalah tempat sistem dapat membangun dan melayani indeks. Data vektor dapat tetap berada dalam format terbuka di object storage sementara Milvus menyediakan indexing, retrieval, dan API kelas produksi.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections: indexing langsung pada data yang berada di lake</h3><p>Banyak tim sudah menyimpan embedding di data lake — tabel Lance, tabel Iceberg, file Parquet, atau dataset format terbuka lainnya di S3, GCS, atau Azure Blob Storage. Sebelum Milvus 3.0, biasanya ada dua opsi untuk mencari data tersebut.</p>
<ul>
<li>Menyalin embedding ke database vektor. Ini menyediakan pencarian berlatensi rendah, tetapi membuat salinan kedua dan pipeline ETL yang harus tetap tersinkronisasi.</li>
<li>Melakukan query langsung ke lake. Ini menghindari duplikasi, tetapi tanpa indeks ANN, pencarian vektor menjadi pemindaian brute-force yang tidak dapat memenuhi latensi produksi.</li>
</ul>
<p><strong>External Collections memperkenalkan jalur ketiga.</strong> Anda mendefinisikan collection Milvus di atas data yang tetap berada di object storage, memetakan field eksternal ke skema Milvus, dan menggunakan API search dan query yang sama seperti collection native. File sumber tidak berpindah; Milvus membangun dan melayani indeks vektor, inverted BM25, JSON, dan scalar di atas data eksternal.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections bersifat read-only dan zero-copy</strong>, yang membuatnya berguna ketika governance, batas kepemilikan, atau biaya operasi mengharuskan dataset sumber tetap berada di lake.</p>
<p>Ketika dataset eksternal berubah, Milvus membaca manifest penyimpanannya dan mengindeks fragmen yang baru ditambahkan alih-alih membangun ulang seluruh collection. Mode load tingkat collection juga memungkinkan tim memilih berapa banyak data yang disimpan secara lokal:</p>
<table>
<thead>
<tr><th><strong>Mode load</strong></th><th><strong>Perilaku</strong></th><th><strong>Paling cocok untuk</strong></th></tr>
</thead>
<tbody>
<tr><td>Take</td><td>Membaca dari object storage pada setiap query</td><td>Biaya penyimpanan terendah; workload yang kurang sensitif terhadap latensi</td></tr>
<tr><td>LazyLoad</td><td>Menyimpan data dalam cache pada akses pertama</td><td>Workload campuran ketika data hot muncul seiring waktu</td></tr>
<tr><td>Load</td><td>Menjaga data tetap resident</td><td>Serving dengan latensi terendah</td></tr>
</tbody>
</table>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># register a lake table as a zero-copy Collection</span>
client.create_collection(
  name=<span class="hljs-string">&quot;docs&quot;</span>,
  external_source={<span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg&quot;</span>,  <span class="hljs-comment"># iceberg|lance|parquet|vortex</span>
                   <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;s3://lake/docs&quot;</span>},
  schema=[
    Field(<span class="hljs-string">&quot;id&quot;</span>,  INT64, primary=<span class="hljs-literal">True</span>, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>),
    Field(<span class="hljs-string">&quot;emb&quot;</span>, FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>),
    Field(<span class="hljs-string">&quot;title&quot;</span>, VARCHAR, external_field=<span class="hljs-string">&quot;title&quot;</span>)])

client.create_index(<span class="hljs-string">&quot;docs&quot;</span>, <span class="hljs-string">&quot;emb&quot;</span>, {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>})  <span class="hljs-comment"># in place</span>
client.load(<span class="hljs-string">&quot;docs&quot;</span>, mode=<span class="hljs-string">&quot;lazy&quot;</span>)  <span class="hljs-comment"># Take | LazyLoad | Load</span>
<button class="copy-code-btn"></button></code></pre>
<p>Untuk lingkungan yang diatur ketat, retrieval dapat berjalan di tempat data diizinkan untuk berada. Untuk sistem AI besar, dataset yang berada di lake dapat mendukung beberapa deployment retrieval tanpa job migrasi di antaranya.</p>
<p>External collections adalah kapabilitas tambahan. Native Milvus collections tetap menjadi jalur utama untuk serving yang write-heavy dan berlatensi rendah, sementara External Collections dirancang untuk dataset yang system of record-nya tetap berada di luar Milvus.</p>
<p>Untuk detail selengkapnya, lihat <a href="https://milvus.io/docs/create-an-external-collection.md">Create an External Collection</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): Point Read yang Efisien untuk Retrieval Lake-Native</h3><p>External Collections memunculkan pertanyaan yang jelas: object storage dirancang untuk skala dan durabilitas, tetapi apakah ia dapat mendukung point read sempit yang mengikuti pencarian ANN?</p>
<p><strong>Tantangannya adalah amplifikasi baca.</strong> Pencarian vektor umumnya berjalan dalam dua tahap: indeks ANN mengembalikan ID kandidat, dan sistem mengambil field yang dipilih untuk kandidat tersebut. Format yang dioptimalkan untuk pemindaian analitik dapat mengubah lookup logis yang sempit menjadi pembacaan fisik yang jauh lebih besar.</p>
<p><strong>Milvus 3.0 mengatasi masalah ini dengan Loon, juga dikenal sebagai Storage v3, sebuah engine penyimpanan kolumnar berbasis manifest untuk object storage yang kompatibel dengan S3.</strong> Loon mengorganisasi field ke dalam <code translate="no">ColumnGroups</code> dengan ID baris yang selaras, memungkinkan field scalar mengutamakan filtering dan scan sementara vektor serta field yang sering diakses dengan point-read menggunakan layout yang dirancang untuk lookup yang lebih sempit.</p>
<p>Loon menjaga indeks vektor dan inverted tetap terpisah dari format file alih-alih menyematkannya di dalam format tersebut. Setiap versi dataset dijelaskan oleh manifest immutable yang mencatat <code translate="no">ColumnGroups</code>-nya, sehingga engine indexing yang sama dapat bekerja di Lance, Parquet, Iceberg, dan Vortex.</p>
<p>Desain manifest juga membuat evolusi skema tidak terlalu disruptif. Menambahkan atau menghapus field dapat memperbarui metadata tanpa menulis ulang kolom yang ada. Mengisi field baru menulis <code translate="no">ColumnGroup</code> baru sambil membiarkan <code translate="no">ColumnGroups</code> yang ada tetap tidak berubah.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> adalah format default untuk jalur ini. Ini adalah format kolumnar terbuka yang kompatibel dengan Arrow dengan layout fleksibel dan encoding bersarang yang lebih cocok untuk data AI yang banyak melakukan point-query. Dalam satu benchmark internal menggunakan 3 juta baris, vektor 128 dimensi, S3, dan 256 pembaca konkuren, I/O terukur per point read turun dari sekitar 9,4 MB untuk baseline Parquet menjadi 0,07 MB untuk Vortex dengan Loon, kira-kira 135 kali lebih kecil.</p>
<p>Milvus 3.0 tidak membuat object storage berperilaku seperti memori lokal. Milvus mengurangi amplifikasi baca yang jika tidak demikian membuat object storage tidak praktis untuk lookup point bergaya serving. Predicate pushdown ke dalam format dan varian Vortex lokal adalah agenda berikutnya dalam roadmap.</p>
<p><em>Untuk detail selengkapnya, lihat blog kami:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Why We Built Loon</em></a> <em>dan</em> <a href="https://github.com/vortex-data/vortex"><em>proyek Vortex</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots: view point-in-time tanpa penyalinan data</h3><p>Job offline membutuhkan view data yang konsisten bahkan ketika collection produksi terus menerima write. Snapshot Milvus adalah view point-in-time, read-only yang mencatat referensi ke file data, indeks, dan metadata yang ada alih-alih menyalin dataset penuh.</p>
<p>Hal itu membuat snapshots cukup murah untuk dibuat sebelum operasi berisiko seperti penggantian model, job re-embedding, atau migrasi skema. Memulihkan snapshot dapat menggunakan kembali file data dan indeks yang ada melalui salinan sisi server di object storage alih-alih mengimpor ulang setiap baris dan membangun ulang setiap indeks. Fitur ini sangat berguna untuk workload yang bergerak cepat seperti AI agents, ketika data terus berubah, dan Anda menginginkan titik pemulihan yang sering dan murah alih-alih backup berat yang sesekali.</p>
<p>View beku yang sama dapat mendukung evaluasi, deduplikasi, validasi backfill, dan pengujian terisolasi sementara collection live terus menerima write. Snapshot menstabilkan input logis, meskipun workload mungkin masih berbagi infrastruktur seperti object storage dan bandwidth jaringan.</p>
<p>Snapshots tidak menggantikan backup. Snapshot mereferensikan file yang dimiliki oleh collection live dan paling cocok untuk pemulihan logis, cloning, dan view stabil berumur pendek. Backup membuat salinan independen untuk retensi jangka panjang dan disaster recovery.</p>
<p>Untuk informasi selengkapnya, lihat <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Manage Snapshots</a>, dan <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot Use Cases</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Spark connector: hubungkan Milvus ke workflow batch</h3><p>Snapshot yang stabil hanya berguna jika engine batch dapat membacanya. Milvus 3.0 mengekspos Milvus sebagai Spark DataSource V2, memungkinkan job Spark, Databricks, dan EMR membaca dari dan menulis ke Milvus sebagai bagian dari pipeline batch standar.</p>
<p>Fitur ini penting karena workflow data AI bersifat iteratif: deduplikasi memberi input ke re-embedding, clustering memberi input ke evaluasi, dan evaluasi menghasilkan set training atau serving yang terkurasi. Snapshot yang stabil menyediakan input konsisten untuk job tersebut, sementara collection live tetap melayani. Dengan Spark connector, sink dari satu job menjadi source untuk job berikutnya, tanpa mengekspor collection penuh keluar dari Milvus setiap kali.</p>
<p>Milvus 3.0 juga memperkenalkan operator batch vector-native untuk tugas seperti deduplikasi, deteksi anomali, dan clustering, menjaga pekerjaan yang berat secara komputasi tetap di luar jalur query online sambil beroperasi langsung pada data vektor.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Perubahan skema online dan backfill</h3><p>Skema jarang tetap statis di produksi — tim menambahkan model embedding baru, vektor sparse, label, field metadata, dan kebijakan retensi seiring waktu. Milvus 3.0 memungkinkan mereka menambahkan, mengisi, dan menghapus kolom sementara serving tetap berjalan, alih-alih rebuild disruptif yang dulu diperlukan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Menambahkan atau menghapus kolom tidak memerlukan penulisan ulang data yang ada. <code translate="no">client.add_collection_field(...)</code> menempatkan kolom nullable baru tanpa membuat collection offline, dan <code translate="no">client.drop_collection_field(...)</code> menghapus field yang deprecated atau eksperimental pada runtime. Keduanya tidak menulis ulang data yang ada — masing-masing adalah perubahan pada manifest collection, bukan pada file data, sehingga tidak ada rebuild.</p>
<p>Milvus 3.0 mendukung dua jalur backfill:</p>
<ul>
<li><strong>Inner backfill</strong> (di 3.0) adalah untuk nilai yang diturunkan dari field yang ada. Milvus dapat menghasilkan vektor sparse BM25 dari kolom teks di dalam kernel, menghilangkan kebutuhan akan encoder sisi klien saat membangun retrieval hybrid dense-plus-sparse.</li>
<li><strong>External backfill</strong>(dalam roadmap) akan digunakan untuk nilai yang dihitung di luar Milvus: ambil snapshot, jalankan Spark terhadap view yang konsisten, hitung kolom baru, tulis nilai kembali, dan biarkan Milvus memperbarui indeks secara inkremental. Ini adalah jalur yang dimaksudkan untuk job re-embedding besar — misalnya, menambahkan kolom embedding baru di ratusan juta baris sementara write terus berlangsung.</li>
</ul>
<p>Bersama-sama, perubahan skema online dan backfill memudahkan evolusi pipeline retrieval tanpa membangun ulang seluruh collection setiap kali model data berubah.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">Engine yang Lebih Kuat untuk Retrieval End-to-End<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus telah lama mendukung lebih dari sekadar pencarian ANN dense, termasuk retrieval sparse berbasis BM25 dan pencarian hybrid. Milvus 3.0 memperluas engine di sumbu yang berbeda: rilis ini membawa lebih banyak pipeline retrieval multi-tahap ke dalam Milvus sendiri, mengurangi over-fetching, logika aplikasi yang terduplikasi, dan ketergantungan pada layanan post-processing terpisah.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. ORDER BY sisi server: sorting di dalam engine, per segmen</h3><p>Sebelumnya, sorting mengharuskan aplikasi melakukan over-fetch kandidat, memindahkannya ke klien, lalu mengurutkannya di sana. Itu mengonsumsi bandwidth dan membuat hasil akhir bergantung pada titik terjadinya truncation sisi klien.</p>
<p><strong>Milvus 3.0 menambahkan ORDER BY sisi server</strong>, yang memungkinkan workload query mengurutkan baris yang telah difilter berdasarkan field scalar seperti rating, harga, freshness, inventory, atau timestamp.</p>
<ul>
<li>Pada jalur query, setiap segmen mengurutkan result set yang telah difilternya, query node menggabungkan stream tersebut, dan proxy mengembalikan slice yang diminta.</li>
<li>Pada jalur search, ORDER BY mengurutkan set kandidat ANN di dalam Milvus, mengurangi over-fetching sisi klien dan post-processing duplikat. Ini tidak mengubah batas recall yang ditetapkan oleh kandidat ANN.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Ini sangat berguna untuk pencarian yang menggabungkan relevansi dengan batasan bisnis atau yang berhadapan dengan pengguna seperti rating, harga, freshness, inventory, atau timestamp.</p>
<p>Untuk informasi selengkapnya, lihat <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Sort Search Results by Scalar Fields</a> dan <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Sort Query Results</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Agregasi dan pencarian berfaset</h3><p>Milvus 3.0 menambahkan agregasi sisi query dengan operasi seperti count, sum, average, minimum, dan maximum, yang dikelompokkan berdasarkan satu atau lebih field scalar. Ini menghilangkan pola umum ketika tim menarik baris yang telah difilter ke kode klien hanya untuk menghitung, mengelompokkan, atau menghitung statistik sederhana.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 juga menambahkan <strong>agregasi search</strong> untuk pencarian berfaset. Setelah pencarian ANN, Milvus mengelompokkan hit yang diambil berdasarkan sebuah field dan mengembalikan jumlah bucket, statistik agregat, dan hit sampel top-N per bucket — pola di balik pengelompokan berdasarkan merek, rentang harga, warna, tenant, atau tipe dokumen. Satu catatan: agregasi search beroperasi pada result set yang diambil ANN, bukan seluruh collection, sehingga jumlah facet bersifat perkiraan. Ketika Anda membutuhkan jumlah yang eksak, gunakan agregasi sisi query.</p>
<p>Untuk informasi selengkapnya, lihat <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Aggregate Query Results</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray untuk Vektor Bersarang dan Model Late-Interaction</h3><p>Banyak entitas secara alami direpresentasikan oleh beberapa vektor. Dokumen panjang adalah serangkaian chunk; video adalah urutan frame yang lebih baik disimpan bersama dalam satu baris daripada disebar ke banyak baris; produk memiliki beberapa gambar atau sudut. Model late-interaction mendorong ini lebih jauh lagi — ColBERT memancarkan satu vektor per token, ColPali satu per patch visual. Dalam setiap kasus, unit yang sebenarnya ingin Anda simpan dan cari adalah keseluruhan entitas, bukan setiap fragmen secara terpisah.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> memungkinkan satu baris Milvus berisi array berdimensi variabel dari elemen terstruktur, termasuk beberapa vektor, sambil mempertahankan satu ID entitas dan satu set metadata. Itu menghindari pemecahan dokumen menjadi beberapa baris dan duplikasi label, permission, atau field lain di seluruh fragmen.</p>
<p>Milvus mendukung dua granularitas pencarian.</p>
<ul>
<li><strong>Pencarian tingkat elemen</strong> mencocokkan satu vektor query dengan setiap elemen dalam daftar dan mengembalikan elemen spesifik yang cocok beserta offset-nya. Ini berguna ketika Anda ingin mengetahui chunk, token, patch, atau gambar mana yang cocok. Satu baris dapat muncul lebih dari sekali jika beberapa elemen cocok.</li>
<li><strong>Pencarian tingkat entitas</strong> membandingkan daftar vektor lengkap milik query dengan daftar vektor milik baris menggunakan <code translate="no">MAX_SIM</code>, dengan metrik <code translate="no">MAX_SIM_COSINE</code>. Setiap token query mengambil kecocokan terbaiknya dalam dokumen, dan skor terbaik tersebut dijumlahkan. Ini memberi Milvus dukungan native untuk pola retrieval late-interaction seperti ColBERT dan ColPali sambil mempertahankan satu baris per dokumen.</li>
</ul>
<p>Mengindeks setiap vektor token dapat mahal; jadi Milvus 3.0 menambahkan beberapa jalur akselerasi, termasuk TokenANN, Muvera, dan Lemur, yang menukar ukuran indeks, biaya training, dan recall.</p>
<table>
<thead>
<tr><th>Strategi</th><th>Representasi tahap satu</th><th>Profil biaya</th><th>Paling cocok untuk</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Setiap vektor token diindeks.</td><td>Tertinggi, eksak</td><td>Model berdaya diskriminasi tinggi dan dokumen pendek</td></tr>
<tr><td>Muvera</td><td>Satu vektor per dokumen menggunakan FDE proyeksi acak.</td><td>Sedang, tanpa training</td><td>Dokumen panjang</td></tr>
<tr><td>Lemur</td><td>Satu vektor per dokumen menggunakan kompresi MLP terpelajar</td><td>Terendah, memerlukan training</td><td>Model berdaya diskriminasi rendah dan vektor visual atau patch</td></tr>
</tbody>
</table>
<p>Dalam benchmark kami, Lemur menyamai atau mengalahkan recall TokenANN pada sebagian besar dataset sambil meruntuhkan setiap dokumen menjadi satu vektor; pengecualiannya adalah korpus dengan variasi panjang yang tinggi, ketika TokenANN atau strategi lain lebih aman.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk korpus yang lebih besar daripada memori, Milvus juga mendukung indeks <code translate="no">DISKANN</code> yang menyimpan daftar embedding di disk untuk mengurangi tekanan RAM.</p>
<p>Pencarian tingkat elemen sudah hadir di Milvus 2.6. Filtering untuk Muvera, Lemur, dan StructList baru di 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. Kompresi Indeks BM25 dan SINDI</h3><p>Milvus telah mendukung pencarian vektor sparse pada rilis sebelumnya. Milvus 3.0 mengurangi footprint indeks sparse melalui postings terkompresi blok (algoritma terkait VByte plus decoding SIMD) dan kuantisasi (fp16 untuk inner product, u16 untuk BM25).</p>
<p>Di satu rangkaian benchmark BM25 internal, implementasi baru kira-kira 3 kali lebih kecil daripada indeks sparse Milvus 2.6 pada recall yang sebanding. Indeks yang lebih kecil mengurangi tekanan memori dan bandwidth serta dapat meningkatkan kecepatan pada workload yang dibatasi oleh pergerakan data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 juga memperkenalkan <a href="https://arxiv.org/abs/2509.08395">SINDI</a>, algoritma retrieval sparse baru yang dioptimalkan untuk embedding sparse terpelajar seperti SPLADE. Karena embedding ini menghasilkan daftar posting yang lebih padat daripada BM25, algoritma search yang banyak melakukan pruning dapat menghabiskan banyak waktu CPU untuk memutuskan apa yang harus dilewati. Sebagai gantinya, SINDI mengorganisasi postings ke dalam window kompak dan menggunakan akumulasi skor yang ramah SIMD untuk memprosesnya secara efisien, sambil mempertahankan akurasi retrieval melalui pruning lossless.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kami juga memperluas SINDI melampaui desain aslinya untuk menyertakan dukungan BM25 native, memungkinkan Milvus menggunakan jalur retrieval sparse yang sama-sama dioptimalkan untuk embedding sparse terpelajar maupun pencarian full-text tradisional.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam benchmark kami di 4 dataset vektor sparse SPLADE, SINDI mencapai hingga sekitar 10x QPS MaxScore pada vektor learned-sparse, dengan worst-case sekitar 5x.</p>
<p>SINDI adalah default untuk pencarian inner-product sparse di Milvus 3.0.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">Peningkatan Lainnya<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
<li><strong>TEXT LOB:</strong> Menyimpan teks sumber panjang di samping vektor. Teks di bawah 64 KB tetap inline; nilai yang lebih besar menggunakan referensi Vortex LOB.</li>
<li><strong>Dukungan indeks dense yang diperluas:</strong> Menambahkan lebih banyak pilihan indeks dalam keluarga Faiss, termasuk SVS, Panorama, PQ, IVFPQ, dan ScaNN, untuk kebutuhan skala, memori, dan recall yang berbeda.</li>
<li><strong>MinHash dan pencarian near-duplicate:</strong> Menghasilkan signature MinHash di sisi server dan mengambil kandidat near-duplicate menggunakan MINHASH_LSH.</li>
<li><strong>Vektor nullable dan tipe baru:</strong> Memungkinkan field vektor bernilai NULL dan menambahkan TIMESTAMPTZ untuk filtering yang sadar waktu dan kebijakan retensi.</li>
<li><strong>Kamus full-text kustom:</strong> Mendaftarkan kamus, sinonim, dan resource stop-word pada cluster untuk tokenisasi multilingual dan spesifik domain.</li>
<li><strong>Standalone Woodpecker:</strong> Menjalankan write-ahead log Milvus sebagai layanan yang dapat diskalakan dan diobservasi secara independen.</li>
<li><strong>Entity</strong> <strong>TTL****:</strong> Mengakhiri masa berlaku record individual melalui field TIMESTAMPTZ, dengan filtering MVCC diikuti garbage collection selama compaction.</li>
<li><strong>ForceMerge:</strong> Memadatkan segmen kecil ke ukuran target dan membangun ulang indeks untuk mengurangi amplifikasi baca sebelum layanan read-heavy yang berkelanjutan.</li>
<li>Dan masih banyak lagi</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Mulai gunakan Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 tersedia hari ini di bawah lisensi Apache 2.0 dan tetap menjadi proyek LF AI &amp; Data. Untuk memulai:</p>
<ul>
<li>Baca <a href="https://milvus.io/docs/release_notes.md">release notes</a> dan <a href="https://milvus.io/docs/quickstart.md">quickstart</a>, dan dapatkan source di <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Milvus Discord</a> atau pesan sesi <a href="https://milvus.io/office-hours">Milvus Office Hours</a> untuk mendiskusikan use case Anda dengan para maintainer.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 dan Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 meletakkan fondasi open-source untuk retrieval AI produksi dan arsitektur <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> yang sedang berkembang, yang menggabungkan penyimpanan lake-native dengan retrieval vektor berkinerja tinggi pada satu source of truth, masing-masing dengan biaya yang tepat.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> adalah Vector Lakebase fully managed yang dibangun oleh tim di balik Milvus. Platform ini berbagi arsitektur terdistribusi dan lake-native yang sama dengan Milvus serta sepenuhnya kompatibel dengan API Milvus. Didukung oleh engine indexing proprietary Cardinal, Zilliz Cloud memberikan price-performance hingga 10× lebih baik daripada pendekatan indexing open-source standar sambil menghilangkan kompleksitas operasional dalam mengelola infrastruktur. Kapabilitas enterprise mencakup komputasi scale-to-zero, disaster recovery lintas region, deployment BYOC, keamanan dan kepatuhan kelas enterprise (SOC 2, HIPAA, ISO 27001, dan GDPR), serta SLA hingga 99,99%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Developer dapat men-deploy Milvus sebagai database vektor open-source atau menggunakan <a href="https://zilliz.com/">Zilliz Cloud</a> untuk platform managed di berbagai workload sepanjang siklus hidup data AI.</p>
<h2 id="What-comes-next" class="common-anchor-header">Apa berikutnya<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Roadmap Milvus dibangun di atas arsitektur 3.0 dengan predicate pushdown untuk External Collections, external backfill, operator Spark tambahan, dan dukungan untuk lebih banyak format tabel, termasuk Delta Lake dan Apache Paimon.</p>
<p>Arah yang lebih besar sudah jelas: sistem data AI membutuhkan loop yang lebih erat antara retrieval online dan peningkatan data offline. Data vektor tidak seharusnya harus disalin ke sistem terpisah setiap kali tim ingin mencari, menganalisis, meningkatkan, atau melayaninya.</p>
