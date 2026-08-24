---
id: milvus-3-0-external-collection.md
title: >-
  Koleksi Eksternal Milvus: Mengindeks dan Mengambil Data yang Berada di Data
  Lake Tanpa Memindahkannya
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0 memperkenalkan External Collection, yang memungkinkan Milvus untuk
  membangun indeks dan melayani pencarian pada data yang tetap berada di data
  lake.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>Dalam banyak pipeline AI, embedding dan metadata sudah diproduksi dan disimpan di data lake. Pipeline produk mungkin menulis atribut produk dan embedding multimodal ke file Parquet di S3. Korpus retrieval atau training mungkin berada di tabel Iceberg atau Lance. Lake sudah menjadi tempat dataset tersebut dibuat, diperbarui, diberi versi, dan digunakan oleh seluruh stack data.</p>
<p>Vector database, bagaimanapun, secara tradisional dibangun di sekitar salinan penyajian (serving copy) yang dimiliki database. Jika tim menginginkan pencarian vektor berlatensi rendah pada data yang sudah berada di lake, mereka umumnya memiliki dua pilihan:</p>
<ul>
<li><strong>Menyalin data ke vector database.</strong> Ini menyediakan indeks ANN dan jalur penyajian produksi, tetapi membuat salinan kedua dari dataset dan pipeline ETL yang harus tetap sinkron dengan sumbernya.</li>
<li><strong>Menanyai lake secara langsung.</strong> Ini menghindari duplikasi, tetapi tanpa lapisan indeks dan penyajian ANN, pencarian vektor kembali ke pemindaian yang tidak dirancang untuk latensi produksi.</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>External Collection</strong></a> <strong>memperkenalkan jalur ketiga.</strong> Data sumber tetap berada di Parquet, Iceberg, Lance, Vortex, atau format eksternal lain yang didukung, sementara Milvus membangun dan menyajikan indeks di atasnya. Anda memetakan field eksternal ke skema Milvus, mendefinisikan indeks yang Anda butuhkan, me-refresh koleksi, dan menggunakan API pencarian dan kueri Milvus normal—tanpa harus menyalin baris sumber terlebih dahulu ke koleksi yang dikelola Milvus.</p>
<p>Perubahan arsitekturnya sederhana: data dapat tetap berada di lake, sementara Milvus menambahkan lapisan indeks dan retrieval.</p>
<p>Hal itu juga menjadikan External Collection langkah penting menuju <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>,</strong> arsitektur data lake-native terpadu untuk AI yang menggabungkan penyajian kelas vector database dengan penyimpanan lake terbuka, indeks tingkat lake yang dapat digunakan kembali, dan lapisan semantik bersama. Retrieval online tidak lagi harus dimulai dari salinan penyajian terpisah sementara Spark, pipeline training, job evaluasi, dan alat tata kelola beroperasi pada versi lain dari data tersebut. Mereka dapat bekerja dari fondasi data yang sama yang berada di lake.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">Apa itu External Collection, dan apa yang diubahnya<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection</strong> adalah jenis koleksi Milvus yang data sumbernya berada di luar penyimpanan yang dikelola Milvus.</p>
<p>Tanpa External Collection, menempatkan katalog tersebut di belakang pencarian vektor produksi biasanya berarti membuat salinan lain di Milvus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setiap kali katalog berubah, model embedding berubah, atau sebuah field di-backfill, pipeline lain harus memindahkan data yang diperbarui melintasi batas tersebut.</p>
<p>Dengan External Collection, arsitekturnya menjadi:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus <strong>tidak</strong> menjadikan file eksternal sebagai salinan data sumbernya sendiri. Sebaliknya, External Collection berisi informasi yang dibutuhkan Milvus untuk menafsirkan dan mencari file-file tersebut:</p>
<ol>
<li>Sebuah <code translate="no">external_source</code> yang mengidentifikasi file atau tabel eksternal.</li>
<li>Sebuah <code translate="no">external_spec</code> yang mendeskripsikan format sumber dan akses penyimpanan.</li>
<li>Pemetaan <code translate="no">external_field</code> yang menghubungkan field di skema Milvus ke kolom di dataset eksternal.</li>
<li>Indeks, manifest, dan status penyajian yang dibuat Milvus untuk retrieval.</li>
</ol>
<p><strong>Data sumber zero-copy tidak berarti tanpa status di dalam Milvus.</strong> Milvus tetap membangun indeks. Milvus tetap menggunakan komputasi. Milvus tetap menyimpan data dalam cache. Perubahannya adalah baris otoritatif tidak lagi harus disalin ke Milvus hanya karena Anda membutuhkan Milvus untuk mencarinya.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">Koleksi Milvus Normal vs. External Collection</h3><table>
<thead>
<tr><th><strong>Aspek</strong></th><th><strong>Koleksi yang dikelola Milvus</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td>Catatan sumber</td><td>Disimpan dan dikelola oleh Milvus</td><td>Tetap di file atau tabel eksternal</td></tr>
<tr><td>Bagaimana data masuk ke Milvus</td><td>Insert, upsert, import, atau streaming write</td><td>Pemetaan sumber eksternal + Refresh</td></tr>
<tr><td>Mutasi online</td><td>Didukung</td><td>Hanya baca dari Milvus</td></tr>
<tr><td>Kesegaran (freshness)</td><td>Mengikuti jalur penulisan dan model konsistensi Milvus</td><td>Mengikuti Refresh terakhir yang berhasil dipublikasikan</td></tr>
<tr><td>Status yang dikelola Milvus</td><td>Data sumber, metadata, indeks, cache</td><td>Pemetaan, manifest, indeks, cache</td></tr>
<tr><td>Jalur kueri</td><td>API pencarian dan kueri Milvus</td><td>API pencarian dan kueri Milvus</td></tr>
<tr><td>Cocok untuk</td><td>Data online yang terus berubah</td><td>Data lake berukuran besar, diproduksi secara batch, dengan banyak pembacaan</td></tr>
</tbody>
</table>
<p>External Collection karena itu melengkapi koleksi Milvus normal, bukan menggantikannya.</p>
<p>Sebuah sistem dapat menyimpan status online yang berubah cepat di koleksi Milvus normal sambil menggunakan External Collection untuk korpus besar, katalog, dataset historis, fitur model, atau data lain yang sudah diproduksi dan dikelola di lake.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">Mengapa menghilangkan salinan kedua itu penting<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Sangat menggoda untuk menggambarkan External Collection sebagai optimasi penyimpanan: jangan salin beberapa terabyte data ke database lain, dan Anda menghemat penyimpanan. Itu berguna, tetapi bukan masalah arsitektural utama.</p>
<p><strong>Biaya yang lebih tinggi berasal dari menjaga dua sistem data tetap selaras.</strong></p>
<p>Pertimbangkan kembali katalog produk. Platform data memproduksi dataset Parquet otoritatif. Search mengimpornya ke vector database. Tim rekomendasi mungkin membaca data lake yang sama melalui Spark untuk analisis offline. Sebuah model embedding baru kemudian menghasilkan kolom vektor pengganti. Inventaris dan metadata terus berubah secara bersamaan.</p>
<p>Begitu salinan penyajian online menjadi independen dari lake, setiap perubahan harus melintasi batas tersebut:</p>
<ul>
<li>data perlu disalin;</li>
<li>transfer perlu dijadwalkan dan dipantau;</li>
<li>job yang gagal memerlukan percobaan ulang;</li>
<li>skema dan izin mungkin perlu direpresentasikan di beberapa sistem;</li>
<li>kesegaran bergantung pada seberapa cepat pipeline sinkronisasi mengejar ketertinggalan;</li>
<li>tim harus tahu salinan mana yang mewakili versi yang sebenarnya mereka inginkan.</li>
</ul>
<p>Penyimpanan hanyalah satu item baris.</p>
<table>
<thead>
<tr><th><strong>Biaya</strong></th><th><strong>Salinan lake + serving terpisah</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Salinan data sumber</strong></td><td>Salinan lake ditambah salinan serving terpisah</td><td>Baris sumber tetap di lake</td></tr>
<tr><td><strong>Perpindahan data</strong></td><td>Pipeline ETL/import yang persisten</td><td>Refresh atas sumber eksternal</td></tr>
<tr><td><strong>Kesegaran</strong></td><td>Tergantung pada irama ekspor/impor</td><td>Dikendalikan oleh kapan Refresh baru dipublikasikan</td></tr>
<tr><td><strong>Tata kelola</strong></td><td>Salinan sumber dan serving harus tetap selaras</td><td>Kepemilikan sumber, lineage, dan versioning tetap di platform lake</td></tr>
<tr><td><strong>Penggunaan kembali offline</strong></td><td>Konsumen lain mungkin menyiapkan salinan mereka sendiri</td><td>Alat lake yang ada dapat terus membaca sumber yang sama</td></tr>
<tr><td><strong>Resource serving</strong></td><td>Disetel berdasarkan salinan database dan beban kueri</td><td>Komputasi indeks, kueri, dan cache dapat dikelola terpisah dari kepemilikan baris sumber</td></tr>
</tbody>
</table>
<p>Perbedaan ini menjadi sangat penting seiring data AI yang berubah lebih sering.</p>
<p>Tim melakukan deduplikasi korpus. Mereka mengelompokkan data untuk analisis. Mereka menghasilkan embedding baru ketika model berubah. Mereka menambahkan label, ringkasan, entitas yang diekstrak, skor kualitas, atau sinyal umpan balik. Mereka menjalankan job evaluasi dan pipeline pembersihan data pada korpus yang sama yang diambil oleh aplikasi produksi.</p>
<p>Jika setiap sistem memiliki salinannya sendiri, setiap perbaikan menjadi job sinkronisasi tambahan.</p>
<p>External Collection mengubah batas tersebut: <strong>sistem offline dapat terus bekerja pada dataset lake, sementara Milvus menyajikan retrieval pada fondasi yang sama.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">Sumber data apa yang didukung External Collection<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection dirancang di sekitar data terbuka yang dikelola secara eksternal, bukan tata letak sumber khusus Milvus. External Collection mendukung beberapa format sumber eksternal melalui <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>:</p>
<table>
<thead>
<tr><th><strong>Format eksternal</strong></th><th><strong>Nilai format</strong></th><th><strong>Apa yang dibaca Milvus</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Direktori atau prefiks object-storage yang berisi file Parquet dan row group</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>File Vortex dan metadata tata letaknya</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Dataset Lance dan metadata fragmennya</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Metadata Iceberg ditambah snapshot yang dipilih</td></tr>
<tr><td>Snapshot Milvus</td><td>milvus-table</td><td>Snapshot Milvus yang didukung yang diekspos sebagai sumber eksternal</td></tr>
</tbody>
</table>
<p>Pemetaan antara sumber dan Milvus bersifat eksplisit.</p>
<p>Kolom sumber bernama <code translate="no">product_id</code> dapat menjadi field Milvus <code translate="no">id</code>; <code translate="no">image_vec</code> dapat menjadi <code translate="no">embedding</code>; dan tabel sumber yang lebar tidak perlu mengekspos setiap kolom ke koleksi. Itu berarti platform data tidak harus mengganti nama atau menulis ulang sumbernya hanya untuk memenuhi database penyajian.</p>
<p>Format berversi menambahkan properti berguna lainnya. Dengan sumber seperti Iceberg, koleksi dapat menunjuk ke snapshot tertentu daripada apa pun yang kebetulan berlaku saat kueri dijalankan. Versi sumber tetap berguna untuk evaluasi yang dapat diulang, pengujian regresi, analisis historis, dan beban kerja audit.</p>
<p>File yang mendasarinya juga tetap dapat digunakan oleh seluruh stack data. Spark, framework training, sistem tata kelola, dan alat lain yang kompatibel dengan lake dapat terus membaca data terbuka yang sama.</p>
<p>External Collection menambahkan satu konsumen lagi untuk data tersebut; ini tidak menjadikan Milvus sebagai satu-satunya pemiliknya.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">Mengakses penyimpanan eksternal dengan aman</h3><p>Milvus juga memerlukan izin untuk membaca penyimpanan eksternal.</p>
<p>Tergantung pada penyedia penyimpanan, deployment dapat menggunakan mekanisme seperti workload atau instance identity, asumsi peran AWS STS, impersonasi service account, akses berbasis SAS, atau sistem peran khusus penyedia alih-alih menyematkan kredensial berumur panjang di konfigurasi aplikasi.</p>
<p>Identitas penyimpanan ini mengontrol bagaimana Milvus menjangkau sumbernya. Otorisasi di dalam Milvus tetap menjadi batas keamanan yang terpisah.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">Cara membuat, mengindeks, me-refresh, dan menanyai external collection<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Siklus hidup External Collection memiliki empat langkah utama:</p>
<ol>
<li>Definisikan sumber eksternal dan petakan kolomnya ke dalam skema Milvus.</li>
<li>Definisikan indeks yang dibutuhkan beban kerja.</li>
<li>Jalankan Refresh sehingga Milvus menemukan data sumber dan menyiapkan versi yang dapat ditanyai.</li>
<li>Load koleksi dan gunakan API pencarian dan kueri Milvus normal.</li>
</ol>
<p>Berikut adalah katalog produk yang sama yang direpresentasikan sebagai External Collection:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>Indeks menggunakan antarmuka Milvus normal:</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian refresh sumber eksternal:</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Setelah versi yang di-refresh siap, load dan cari seperti koleksi Milvus normal:</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Perbedaan pentingnya bukan pada panggilan pencariannya. Perbedaannya adalah di mana siklus hidup dimulai. Koleksi yang dikelola Milvus dimulai dengan data yang ditulis atau diimpor ke Milvus. External Collection dimulai dengan referensi ke data yang sudah ada di tempat lain.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Bagaimana Refresh menangkap perubahan pada data eksternal<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection bersifat hanya-baca dari sisi Milvus, tetapi dataset lake yang mendasarinya tidak harus tetap membeku selamanya.</p>
<p>Misalkan pipeline produk menambahkan batch lain, memperbarui metadata, atau menulis embedding dari model baru. Milvus tidak terus-menerus mengikuti setiap objek yang muncul di jalur sumber. Perubahan tersebut menjadi terlihat melalui <strong>Refresh</strong>.</p>
<p>Refresh membaca metadata eksternal, menyelesaikan fragmen sumber, memperbarui manifest yang menghubungkannya ke koleksi Milvus, dan menyiapkan status indeks yang sesuai.</p>
<p>Kuncinya adalah pekerjaan ini dapat dilakukan secara inkremental.</p>
<p>Milvus mengidentifikasi fragmen sumber yang tidak berubah dan dapat menggunakan kembali pekerjaan segmen dan indeks yang sudah ada. Fragmen baru atau yang berubah adalah bagian yang memerlukan pemrosesan baru.</p>
<p>Perubahan kecil pada dataset multi-terabyte, oleh karena itu, tidak harus memicu import penuh dan pembangunan ulang indeks penuh lagi.</p>
<p>Refresh juga memberikan batas versi yang jelas pada sistem penyajian. Sementara versi baru sedang disiapkan, kueri terus menggunakan status yang dipublikasikan sebelumnya. Setelah Refresh selesai, status baru tersedia sebagai versi lengkap, bukan mengekspos campuran data lama dan data yang baru disiapkan sebagian.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Model ini cocok secara alami dengan pembangunan katalog per jam, pembaruan basis pengetahuan malam hari, refresh embedding berkala, pipeline fitur yang dihasilkan model, dan beban kerja berorientasi batch serupa.</p>
<p>Ini <strong>tidak</strong> menggantikan jalur streaming write. Jika setiap insert atau delete harus segera dapat dicari melalui Milvus, koleksi terkelola tetap menjadi model yang lebih baik.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Bagaimana Lazy Loading mengurangi penggunaan memori untuk dataset lebar<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Menyimpan baris sumber di object storage hanya membantu jika lapisan penyajian tidak harus memuat setiap byte secara lokal sebelum dapat menjawab kueri. Dengan Milvus Tiered Storage yang diaktifkan, hal itu tidak terjadi.</p>
<p>Pada saat load koleksi, QueryNodes awalnya hanya menyimpan metadata ringan seperti informasi skema, definisi indeks, peta chunk, dan referensi ke objek jarak jauh. Data field diambil di tingkat chunk ketika kueri membutuhkannya; indeks dapat tetap di remote sampai penggunaan pertama, kemudian di-cache secara lokal. Data yang sering digunakan tetap panas, sementara data yang jarang diakses dapat di-evict.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ini sangat berguna untuk dataset AI yang lebar.</p>
<p>Sebuah baris produk mungkin berisi beberapa embedding, deskripsi panjang, JSON mentah, metadata gambar, ringkasan yang dihasilkan, inventaris, harga, rating, dan banyak atribut lainnya. Pencarian kemiripan yang khas mungkin hanya menyentuh satu vektor ditambah inventaris, harga, dan rating. Tidak ada alasan setiap field lain harus secara permanen menempati memori penyajian hanya karena field tersebut milik record yang sama.</p>
<p>External Collection dapat mempersempit jejak penyajian di dua tingkat:</p>
<ul>
<li><strong>Pertama, proyeksi tingkat skema.</strong> Melalui <code translate="no">external_field</code>, External Collection dapat mengekspos hanya kolom sumber yang dibutuhkan aplikasi. Kolom lain tetap di dataset lake dan tidak disertakan dalam skema penyajian ini.</li>
<li><strong>Kedua, proyeksi runtime.</strong> Di bawah model penyajian bertingkat, QueryNodes mengambil dan meng-cache field serta indeks yang benar-benar dibutuhkan beban kerja, alih-alih memuat seluruh dataset yang dipetakan di awal.</li>
</ul>
<p>Dengan kata lain, <strong>dataset dapat tetap lebar di lake tanpa memaksa jejak penyajian menjadi sama lebarnya.</strong></p>
<p>Ada tradeoff yang jelas. Kueri yang mengenai field atau indeks dingin mungkin membayar biaya pembacaan jarak jauh pada akses pertama. Kebijakan warm-up dapat memuat terlebih dahulu field atau indeks yang kritis terhadap latensi, sementara kebijakan cache dan eviction mencegah status yang jarang diakses menempati resource lokal tanpa batas waktu.</p>
<p>Intinya bukan bahwa object storage berperilaku seperti RAM. Intinya adalah memori dan disk lokal dapat mengikuti working set dari beban kerja retrieval, bukan ukuran total dan lebar dataset sumber.</p>
<p>Format sumber juga berperan di sini. Format yang dirancang untuk pemindaian analitis luas dan format yang dioptimalkan untuk pembacaan yang lebih sempit atau acak dapat menghasilkan perilaku I/O yang berbeda di bawah akses on-demand. External Collection tidak menghapus tradeoff tingkat penyimpanan tersebut; ini memungkinkan Milvus membangun lapisan retrieval di atasnya.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">Kemampuan pencarian dan pengindeksan apa yang didukung External Collection<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection tidak sekadar mengarahkan Milvus ke direktori embedding dan memindai file-file tersebut. Milvus membangun struktur retrieval di atas data eksternal dan mengeksekusi kueri melalui mesin retrieval standarnya.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">Indeks Milvus yang dibangun di atas data eksternal</h3><p>Tergantung pada field dan beban kerja, Milvus dapat membangun:</p>
<ul>
<li>indeks vektor untuk pencarian ANN;</li>
<li>indeks skalar untuk pemfilteran metadata;</li>
<li>indeks JSON untuk atribut semi-terstruktur;</li>
<li>indeks BM25 dan full-text untuk retrieval leksikal.</li>
<li>field yang dihasilkan fungsi yang didukung oleh model data Milvus.</li>
</ul>
<p>Pencarian ANN menggunakan indeks tersebut untuk mempersempit kumpulan kandidat alih-alih membaca setiap vektor sumber.</p>
<p>Perbedaan itu penting karena menyimpan embedding di lake tidak sama dengan mengoperasikan vector database di atasnya. Persistensi memberi Anda byte. Retrieval produksi juga membutuhkan indeks, perencanaan kueri, pemfilteran, peringkat, caching, dan jalur penyajian berlatensi rendah.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">Melampaui top-K vektor</h3><p>Kesalahan umum lainnya adalah membaca "External Collection" sebagai "pencarian vektor atas Parquet." Itu meremehkan apa yang sebenarnya dibutuhkan retrieval produksi.</p>
<p>Hasil pencarian produksi jarang bergantung pada kemiripan vektor saja. Hasil tersebut mungkin juga bergantung pada istilah yang tepat, kebijakan akses, inventaris, timestamp, kategori, harga, kualitas sumber, atau sinyal peringkat bisnis.</p>
<p>Pertimbangkan kueri seperti:</p>
<table>
<thead>
<tr><th>gaun floral merah untuk musim panas, tersedia, rating tertinggi didahulukan</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Jalur retrieval produksi mungkin membutuhkan beberapa sinyal:</p>
<ul>
<li><strong>Kemiripan vektor</strong> untuk makna semantik dari "gaun floral musim panas."</li>
<li><strong>Pencarian leksikal atau full-text</strong> untuk istilah yang tepat seperti "merah."</li>
<li><strong>Filter skalar</strong> untuk menghapus produk yang tidak tersedia atau di bawah ambang rating.</li>
<li><strong>Retrieval hibrida dan peringkat</strong> untuk menggabungkan beberapa sinyal retrieval.</li>
</ul>
<p>Milvus 3.0 juga memperluas mesin kueri melampaui retrieval tetangga terdekat awal dengan kemampuan seperti <strong>pengurutan sisi server, agregasi, dan faceting.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Poin yang lebih luas adalah External Collection memberikan jalur retrieval database untuk data yang berada di lake—bukan sekadar cara membaca vektor dari file.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">Bagaimana data lake yang sama mendukung penyajian online dan pemrosesan offline<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>Alasan arsitektural terkuat untuk menjaga sumber tetap dalam format lake terbuka bukan sekadar karena salinan kedua membutuhkan biaya. Alasannya adalah dataset yang sama dapat tetap tersedia bagi sistem yang terus memperbaikinya.</p>
<p>Kembali ke katalog produk.</p>
<p>Sepanjang hari, Milvus dapat menyajikan External Collection untuk pencarian produk, rekomendasi, atau retrieval agen.</p>
<p>Pada saat yang sama, sistem lain dapat bekerja langsung pada dataset lake:</p>
<ul>
<li>Spark dapat mengidentifikasi produk duplikat.</li>
<li>Pipeline training dapat menghasilkan embedding dari model baru.</li>
<li>Job kualitas data dapat mendeteksi record yang salah format atau anomali.</li>
<li>Pipeline evaluasi dapat membandingkan kualitas retrieval antar versi model.</li>
<li>Proses batch dapat menghasilkan ringkasan, label, atau metadata tambahan.</li>
</ul>
<p>External Collection <strong>tidak</strong> menjalankan job tersebut sendiri. Spark tetap Spark; training tetap training. Perannya adalah menghilangkan batas data penyajian tambahan di antara mereka.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pekerjaan offline dapat menulis data yang lebih baik atau field baru kembali ke lake. Refresh berikutnya membuat sumber yang diperbarui tersedia untuk jalur retrieval Milvus.</p>
<p>Tidak ada loop ekspor-dan-impor terpisah yang satu-satunya tujuan adalah merekonstruksi salinan otoritatif lain untuk penyajian.</p>
<p>Tata kelola juga tetap terbagi dengan bersih. Versi sumber, lineage, dan kepemilikan sumber tetap berada di platform lake. Milvus mempertahankan otorisasi tingkat koleksinya sendiri dan kredensial yang diperlukan untuk membaca sumber. Berbagi satu fondasi data tidak berarti meruntuhkan setiap domain keamanan menjadi satu sistem tunggal.</p>
<p>Inilah hubungannya dengan <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a>: lake tetap menjadi fondasi data bersama, sementara Milvus menyediakan lapisan retrieval berlatensi rendah di atasnya. External Collection adalah salah satu bagian dari arsitektur tersebut, bersama dengan Storage V3, Snapshots, integrasi Spark, evolusi skema, dan backfill.</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">Di mana External Collection cocok—dan di mana tidak<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection sangat cocok ketika:</strong></p>
<ul>
<li>Data otoritatif Anda sudah berada di Parquet, Vortex, Lance, Iceberg, atau sumber eksternal lain yang didukung.</li>
<li>Dataset terutama diproduksi dalam batch, bukan melalui penulisan transaksional berfrekuensi tinggi.</li>
<li>Mempertahankan salinan penyajian kedua menciptakan overhead ETL, kesegaran, atau tata kelola yang signifikan.</li>
<li>Banyak sistem perlu bekerja dengan dataset terbuka yang sama.</li>
<li>Batas Refresh yang eksplisit dapat diterima untuk kesegaran penyajian.</li>
<li>Anda menginginkan retrieval Milvus produksi tanpa menjadikan Milvus pemilik baris sumber.</li>
</ul>
<p><strong>Koleksi Milvus normal masih menjadi pilihan yang lebih baik ketika:</strong></p>
<ul>
<li>aplikasi terus-menerus melakukan insert atau upsert record;</li>
<li>delete perlu menjadi terlihat melalui jalur penulisan online;</li>
<li>beban kerja bergantung pada fitur koleksi yang tidak tersedia untuk skema eksternal;</li>
<li>desain penyajian sengaja menyimpan semua data yang diperlukan di memori, menghindari cache miss jarak jauh.</li>
</ul>
<p><strong>Beberapa batas perlu diingat.</strong></p>
<ul>
<li><strong>External Collection bersifat hanya-baca.</strong> Perubahan sumber terjadi di luar Milvus.</li>
<li><strong>Zero-copy berlaku untuk baris sumber.</strong> Indeks, manifest, cache, dan komputasi tetap membutuhkan resource.</li>
<li><strong>Refresh bersifat eksplisit.</strong> Ini bukan mekanisme sinkronisasi streaming.</li>
<li><strong>Sumber harus tetap dapat dijangkau.</strong> Perilaku pencarian, indeks, dan refresh tetap bergantung pada akses penyimpanan dan kredensial.</li>
<li><strong>Storage V3 wajib digunakan.</strong> Di Milvus open-source 3.0, Storage V3 harus diaktifkan sebelum menggunakan External Collection.</li>
<li><strong>External Collection tidak menggantikan pemrosesan hulu.</strong> Pembuatan embedding, clustering, deduplikasi, dan pembersihan data tetap terjadi di sistem hulu yang sesuai.</li>
</ul>
<p>Pilihannya karena itu bersifat saling melengkapi, bukan biner. Sebuah sistem dapat menggunakan koleksi Milvus normal untuk status online yang berubah cepat dan External Collection untuk dataset besar yang diproduksi secara batch yang rumah alaminya adalah lake.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Coba External Collection di Milvus 3.0<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection tersedia di Milvus 3.0. Mulailah dengan dataset lake yang representatif dan evaluasi aspek yang penting untuk beban kerja Anda: refresh awal dan inkremental, biaya pembangunan indeks, perilaku kueri panas dan dingin, serta interval kesegaran yang dibutuhkan aplikasi Anda.</p>
<p>Untuk detail implementasi, lihat:</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">Membuat External Collection</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Catatan rilis Milvus 3.0</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Blog peluncuran Milvus 3.0</a></li>
</ul>
<p>Jika Anda lebih memilih jalur terkelola, External Collection juga tersedia sebagai bagian dari <strong>Zilliz Vector Lakebase</strong> di Zilliz Cloud. Lihat:</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">External Collection di Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Dari Vector Database ke Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">Mengapa Kami Membangun Vector Lakebase: Memikirkan Ulang Arsitektur Data Tidak Terstruktur untuk AI</a></li>
</ul>
<p>Anda juga dapat menyampaikan pertanyaan implementasi atau masukan ke <a href="https://github.com/milvus-io/milvus">repositori GitHub Milvus</a> atau <a href="https://discord.com/invite/8uyFbECzPX">komunitas Discord Milvus</a>.</p>
