---
id: data-in-and-data-out-in-milvus-2-6.md
title: >-
  Memperkenalkan Fungsi Penyematan: Bagaimana Milvus 2.6 Menyederhanakan
  Vektorisasi dan Pencarian Semantik
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  Temukan bagaimana Milvus 2.6 menyederhanakan proses penyematan dan pencarian
  vektor dengan Data-in, Data-out. Secara otomatis menangani penyematan dan
  pengurutan ulang - tidak perlu preprocessing eksternal.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>Jika Anda pernah membuat aplikasi pencarian vektor, Anda pasti sudah mengetahui alur kerjanya dengan baik. Sebelum data apa pun dapat disimpan, data tersebut harus terlebih dahulu diubah menjadi vektor menggunakan model penyematan, dibersihkan dan diformat, dan akhirnya dimasukkan ke dalam basis data vektor Anda. Setiap kueri juga melalui proses yang sama: menyematkan input, menjalankan pencarian kemiripan, lalu memetakan ID yang dihasilkan kembali ke dokumen atau catatan asli Anda. Cara ini berhasil - tetapi menciptakan jalinan skrip prapemrosesan yang terdistribusi, pipeline penyematan, dan kode lem yang harus Anda pelihara.</p>
<p><a href="https://milvus.io/">Milvus</a>, database vektor sumber terbuka berkinerja tinggi, kini mengambil langkah besar untuk menyederhanakan semua itu. <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> memperkenalkan <strong>fitur Data-in, Data-out (juga dikenal sebagai</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>Fungsi Embedding</strong></a><strong>)</strong>, sebuah kemampuan embedding bawaan yang terhubung langsung ke penyedia model utama seperti OpenAI, AWS Bedrock, Google Vertex AI, dan Hugging Face. Alih-alih mengelola infrastruktur embedding Anda sendiri, Milvus sekarang dapat memanggil model-model ini untuk Anda. Anda juga dapat menyisipkan dan melakukan kueri menggunakan teks mentah - dan segera tipe data lainnya - sementara Milvus secara otomatis menangani vektorisasi pada waktu penulisan dan kueri.</p>
<p>Dalam sisa tulisan ini, kita akan melihat lebih dekat bagaimana Data-in, Data-out bekerja di bawah tenda, cara mengonfigurasi penyedia dan fungsi penyematan, dan bagaimana Anda dapat menggunakannya untuk merampingkan alur kerja pencarian vektor Anda dari ujung ke ujung.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">Apa itu Data-in, Data-out?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Data-in, Data-out di Milvus 2.6 dibangun di atas modul Function yang baru - sebuah kerangka kerja yang memungkinkan Milvus menangani transformasi data dan pembuatan embedding secara internal, tanpa layanan prapemrosesan eksternal. (Anda dapat mengikuti proposal desain di <a href="https://github.com/milvus-io/milvus/issues/35856">GitHub edisi #35856</a>.) Dengan modul ini, Milvus dapat mengambil data input mentah, memanggil penyedia embedding secara langsung, dan secara otomatis menulis vektor yang dihasilkan ke dalam koleksi Anda.</p>
<p>Pada tingkat yang tinggi, modul <strong>Function</strong> mengubah pembuatan embedding menjadi kemampuan basis data asli. Alih-alih menjalankan pipeline embedding terpisah, pekerja latar belakang, atau layanan reranker, Milvus sekarang mengirimkan permintaan ke penyedia yang Anda konfigurasikan, mengambil embedding, dan menyimpannya di samping data Anda - semuanya di dalam jalur konsumsi. Hal ini menghilangkan biaya operasional untuk mengelola infrastruktur embedding Anda sendiri.</p>
<p>Data-in, Data-out memperkenalkan tiga peningkatan utama pada alur kerja Milvus:</p>
<ul>
<li><p>Memasukkan<strong>data mentah secara langsung</strong> - Anda sekarang dapat memasukkan teks, gambar, atau tipe data lain yang belum diproses langsung ke Milvus. Tidak perlu mengubahnya menjadi vektor terlebih dahulu.</p></li>
<li><p>Mengkonfigurasi<strong>satu fungsi penyematan</strong> - Setelah Anda mengkonfigurasi model penyematan di Milvus, Milvus secara otomatis mengelola seluruh proses penyematan. Milvus terintegrasi secara mulus dengan berbagai penyedia model, termasuk OpenAI, AWS Bedrock, Google Vertex AI, Cohere, dan Hugging Face.</p></li>
<li><p><strong>Kueri dengan input mentah</strong> - Anda sekarang dapat melakukan pencarian semantik menggunakan teks mentah atau kueri berbasis konten lainnya. Milvus menggunakan model yang dikonfigurasi sama untuk menghasilkan sematan dengan cepat, melakukan pencarian kemiripan, dan mengembalikan hasil yang relevan.</p></li>
</ul>
<p>Singkatnya, Milvus sekarang secara otomatis menyematkan - dan secara opsional memberi peringkat - data Anda. Vektorisasi menjadi fungsi basis data bawaan, sehingga tidak memerlukan layanan penyematan eksternal atau logika prapemrosesan khusus.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">Bagaimana Data-in, Data-out Bekerja<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Diagram di bawah ini mengilustrasikan bagaimana Data-in, Data-out beroperasi di dalam Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Alur kerja Data-in, Data-out dapat dibagi menjadi enam langkah utama:</p>
<ol>
<li><p><strong>Input Data</strong> - Pengguna memasukkan data mentah - seperti teks, gambar, atau jenis konten lainnya - langsung ke dalam Milvus tanpa melakukan pemrosesan awal eksternal.</p></li>
<li><p>Menghasilkan<strong>Embeddings</strong> - Modul Function secara otomatis memanggil model embedding yang dikonfigurasi melalui API pihak ketiga, mengubah input mentah menjadi embedding vektor secara real time.</p></li>
<li><p><strong>Menyimpan Embeddings</strong> - Milvus menulis embeddings yang dihasilkan ke dalam bidang vektor yang ditentukan dalam koleksi Anda, di mana mereka tersedia untuk operasi pencarian kemiripan.</p></li>
<li><p><strong>Kirim Ku</strong> eri - Pengguna mengeluarkan kueri berbasis teks mentah atau konten ke Milvus, seperti halnya tahap input.</p></li>
<li><p><strong>Pencarian Semantik</strong> - Milvus menyematkan kueri menggunakan model yang dikonfigurasikan yang sama, menjalankan pencarian kemiripan pada vektor yang tersimpan, dan menentukan kecocokan semantik yang paling dekat.</p></li>
<li><p>Mengembalikan<strong>Hasil</strong> - Milvus mengembalikan hasil top-k yang paling mirip - dipetakan kembali ke data aslinya - langsung ke aplikasi.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">Cara Mengonfigurasi Data-in, Data-out<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><ul>
<li><p>Instal versi terbaru <strong>Milvus 2.6</strong>.</p></li>
<li><p>Siapkan kunci API penyematan Anda dari penyedia yang didukung (misalnya, OpenAI, AWS Bedrock, atau Cohere). Dalam contoh ini, kita akan menggunakan <strong>Cohere</strong> sebagai penyedia penyematan.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">Memodifikasi Konfigurasi <code translate="no">milvus.yaml</code> </h3><p>Jika Anda menjalankan Milvus dengan <strong>Docker Compose</strong>, Anda perlu memodifikasi berkas <code translate="no">milvus.yaml</code> untuk mengaktifkan modul Function. Anda dapat merujuk ke dokumentasi resmi untuk panduan: <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Mengkonfigurasi Milvus dengan Docker Compose</a> (Instruksi untuk metode penerapan lainnya juga dapat ditemukan di sini).</p>
<p>Pada berkas konfigurasi, cari bagian <code translate="no">credential</code> dan <code translate="no">function</code>.</p>
<p>Kemudian, perbarui bidang <code translate="no">apikey1.apikey</code> dan <code translate="no">providers.cohere</code>.</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>Setelah Anda melakukan perubahan ini, mulai ulang Milvus untuk menerapkan konfigurasi yang telah diperbarui.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">Cara Menggunakan Fitur Data-in, Data-out<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. Tentukan Skema untuk Koleksi</h3><p>Untuk mengaktifkan fitur penyematan, <strong>skema koleksi</strong> Anda harus menyertakan setidaknya tiga bidang:</p>
<ul>
<li><p><strong>Bidang kunci utama (</strong><code translate="no">id</code> ) - Mengidentifikasi secara unik setiap entitas dalam koleksi.</p></li>
<li><p><strong>Bidang skalar (</strong><code translate="no">document</code> ) - Menyimpan data mentah asli.</p></li>
<li><p><strong>Bidang vektor (</strong><code translate="no">dense</code> ) - Menyimpan penyematan vektor yang dihasilkan.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. Tentukan Fungsi Penyematan</h3><p>Selanjutnya, tentukan <strong>fungsi penyematan</strong> dalam skema.</p>
<ul>
<li><p><code translate="no">name</code> - Pengenal unik untuk fungsi tersebut.</p></li>
<li><p><code translate="no">function_type</code> - Tetapkan ke <code translate="no">FunctionType.TEXTEMBEDDING</code> untuk penyematan teks. Milvus juga mendukung jenis fungsi lain seperti <code translate="no">FunctionType.BM25</code> dan <code translate="no">FunctionType.RERANK</code>. Lihat <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">Pencarian Teks Lengkap</a> dan <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">Ikhtisar Pemeringkat Peluruhan</a> untuk lebih jelasnya.</p></li>
<li><p><code translate="no">input_field_names</code> - Mendefinisikan bidang masukan untuk data mentah (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - Mendefinisikan bidang keluaran di mana penyematan vektor akan disimpan (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - Berisi parameter konfigurasi untuk fungsi penyematan. Nilai untuk <code translate="no">provider</code> dan <code translate="no">model_name</code> harus sesuai dengan entri yang sesuai dalam file konfigurasi <code translate="no">milvus.yaml</code> Anda.</p></li>
</ul>
<p><strong>Catatan:</strong> Setiap fungsi harus memiliki <code translate="no">name</code> dan <code translate="no">output_field_names</code> yang unik untuk membedakan logika transformasi yang berbeda dan mencegah konflik.</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. Mengkonfigurasi Indeks</h3><p>Setelah field dan fungsi didefinisikan, buatlah indeks untuk koleksi. Untuk mempermudah, kami menggunakan tipe AUTOINDEX di sini sebagai contoh.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. Membuat Koleksi</h3><p>Gunakan skema dan indeks yang telah ditentukan untuk membuat koleksi baru. Pada contoh ini, kita akan membuat koleksi bernama Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. Menyisipkan Data</h3><p>Sekarang Anda dapat menyisipkan data mentah secara langsung ke dalam Milvus - tidak perlu lagi membuat penyisipan secara manual.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. Melakukan Pencarian Vektor</h3><p>Setelah memasukkan data, Anda dapat melakukan pencarian secara langsung menggunakan kueri teks mentah. Milvus secara otomatis mengubah kueri Anda menjadi embedding, melakukan pencarian kemiripan terhadap vektor yang tersimpan, dan mengembalikan kecocokan teratas.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Untuk detail lebih lanjut tentang pencarian vektor, lihat: <a href="https://milvus.io/docs/single-vector-search.md">Pencarian Vektor Dasar </a>dan <a href="https://milvus.io/docs/get-and-scalar-query.md">API Kueri</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Memulai dengan Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan Data-in, Data-out, Milvus 2.6 membawa kesederhanaan pencarian vektor ke tingkat berikutnya. Dengan mengintegrasikan fungsi penyematan dan pengurutan ulang secara langsung di dalam Milvus, Anda tidak perlu lagi mengelola prapemrosesan eksternal atau mengelola layanan penyematan yang terpisah.</p>
<p>Siap untuk mencobanya? Instal <a href="https://milvus.io/docs">Milvus</a> 2.6 hari ini dan rasakan sendiri kekuatan Data-in, Data-out.</p>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Pelajari Lebih Lanjut tentang Fitur Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Memperkenalkan Milvus 2.6: Pencarian Vektor yang Terjangkau dalam Skala Miliaran</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Penghancuran JSON di Milvus: Pemfilteran JSON 88,9x Lebih Cepat dengan Fleksibilitas</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Membuka Pengambilan Tingkat Entitas yang Sebenarnya: Kemampuan Array-of-Structs dan MAX_SIM Baru di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH di Milvus: Senjata Rahasia untuk Memerangi Duplikat dalam Data Pelatihan LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Membawa Kompresi Vektor ke Tingkat Ekstrim: Bagaimana Milvus Melayani Kueri 3× Lebih Banyak dengan RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmark Bohong - DB Vektor Layak Mendapat Ujian Nyata </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Burung Pelatuk untuk Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pencarian Vektor di Dunia Nyata: Cara Memfilter Secara Efisien Tanpa Membunuh Recall </a></p></li>
</ul>
