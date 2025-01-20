---
id: how-to-get-started-with-milvus.md
title: Cara Memulai dengan Milvus
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Cara memulai dengan Milvus</span> </span></p>
<p><strong><em>Terakhir diperbarui Januari 2025</em></strong></p>
<p>Kemajuan dalam Model Bahasa Besar<a href="https://zilliz.com/glossary/large-language-models-(llms)">(</a>Large Language<a href="https://zilliz.com/glossary/large-language-models-(llms)">Models/LLMs</a>) dan meningkatnya volume data membutuhkan infrastruktur yang fleksibel dan dapat diskalakan untuk menyimpan informasi dalam jumlah yang sangat besar, seperti basis data. Namun, <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">database tradisional</a> dirancang untuk menyimpan data tabular dan terstruktur, sementara informasi yang biasanya berguna untuk memanfaatkan kekuatan LLM yang canggih dan algoritme pencarian informasi <a href="https://zilliz.com/learn/introduction-to-unstructured-data">tidak terstruktur</a>, seperti teks, gambar, video, atau audio.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">Basis data vektor</a> adalah sistem basis data yang dirancang khusus untuk data yang tidak terstruktur. Dengan database vektor, kita tidak hanya dapat menyimpan data tidak terstruktur dalam jumlah besar, tetapi juga dapat melakukan <a href="https://zilliz.com/learn/vector-similarity-search">pencarian vektor</a>. Basis data vektor memiliki metode pengindeksan yang canggih seperti Inverted File Index (IVFFlat) atau Hierarchical Navigable Small World<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>) untuk melakukan pencarian vektor yang cepat dan efisien serta proses pengambilan informasi.</p>
<p><strong>Milvus</strong> adalah basis data vektor sumber terbuka yang dapat kita gunakan untuk memanfaatkan semua fitur bermanfaat yang ditawarkan oleh basis data vektor. Berikut adalah apa yang akan kita bahas dalam artikel ini:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Gambaran Umum tentang Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Opsi penerapan Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Memulai dengan Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Memulai dengan Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">Milvus yang Dikelola Sepenuhnya </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Apa itu Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong> adalah </a>basis data vektor sumber terbuka yang memungkinkan kita menyimpan data tidak terstruktur dalam jumlah besar dan melakukan pencarian vektor dengan cepat dan efisien. Milvus sangat berguna untuk banyak aplikasi GenAI yang populer, seperti sistem rekomendasi, chatbot yang dipersonalisasi, deteksi anomali, pencarian gambar, pemrosesan bahasa alami, dan retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p>
<p>Ada beberapa keuntungan yang bisa Anda dapatkan dengan menggunakan Milvus sebagai database vektor:</p>
<ul>
<li><p>Milvus menawarkan beberapa opsi penerapan yang dapat Anda pilih tergantung pada kasus penggunaan dan ukuran aplikasi yang ingin Anda bangun.</p></li>
<li><p>Milvus mendukung beragam metode pengindeksan untuk memenuhi berbagai kebutuhan data dan kinerja, termasuk opsi dalam memori seperti FLAT, IVFFlat, HNSW, dan <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a>, varian terkuantisasi untuk efisiensi memori, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> on-disk untuk set data besar, dan indeks yang dioptimalkan untuk GPU seperti GPU_CAGRA, GPU_IVF_FLAT, dan GPU_IVF_PQ untuk pencarian yang dipercepat dan hemat memori.</p></li>
<li><p>Milvus juga menawarkan pencarian hibrida, di mana kita dapat menggunakan kombinasi embedding padat, embedding jarang, dan pemfilteran metadata selama operasi pencarian vektor, yang mengarah pada hasil pencarian yang lebih akurat. Selain itu, <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> kini mendukung <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">pencarian teks lengkap</a> dan pencarian vektor secara hibrida, sehingga pencarian Anda menjadi lebih akurat.</p></li>
<li><p>Milvus dapat digunakan sepenuhnya di cloud melalui <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, di mana Anda dapat mengoptimalkan biaya operasional dan kecepatan pencarian vektor berkat empat fitur canggih: cluster logis, streaming dan pemilahan data historis, penyimpanan berjenjang, penskalaan otomatis, dan pemisahan panas-dingin multi-penyewaan.</p></li>
</ul>
<p>Ketika menggunakan Milvus sebagai basis data vektor Anda, Anda bisa memilih tiga opsi penerapan yang berbeda, masing-masing dengan kekuatan dan manfaatnya. Kita akan membahas masing-masing opsi di bagian selanjutnya.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Opsi Penerapan Milvus<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita dapat memilih dari empat opsi penerapan untuk mulai menggunakan Milvus: Milvus <strong>Lite, Milvus Standalone, Milvus Distributed, dan Zilliz Cloud (Milvus terkelola)</strong>. Setiap opsi penerapan dirancang untuk menyesuaikan dengan berbagai skenario dalam kasus penggunaan kami, seperti ukuran data kami, tujuan aplikasi kami, dan skala aplikasi kami.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Lite</strong></a> adalah versi ringan dari Milvus dan cara termudah bagi kita untuk memulai. Pada bagian selanjutnya, kita akan melihat bagaimana kita dapat menjalankan Milvus Lite, dan yang perlu kita lakukan untuk memulai adalah menginstal pustaka Pymilvus dengan pip. Setelah itu, kita bisa menjalankan sebagian besar fungsi inti dari Milvus sebagai basis data vektor.</p>
<p>Milvus Lite sangat cocok untuk pembuatan prototipe cepat atau tujuan pembelajaran dan dapat dijalankan di notebook Jupyter tanpa pengaturan yang rumit. Dalam hal penyimpanan vektor, Milvus Lite cocok untuk menyimpan sekitar satu juta embedding vektor. Karena fitur dan kapasitas penyimpanannya yang ringan, Milvus Lite merupakan opsi penerapan yang sempurna untuk bekerja dengan perangkat edge, seperti mesin pencari dokumen pribadi, deteksi objek di perangkat, dll.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Milvus Standalone adalah penerapan server mesin tunggal yang dikemas dalam citra Docker. Oleh karena itu, yang perlu kita lakukan untuk memulai adalah menginstal Milvus di Docker, lalu memulai kontainer Docker. Kita juga akan melihat implementasi Milvus Standalone secara mendetail di bagian selanjutnya.</p>
<p>Milvus Standalone sangat ideal untuk membangun dan memproduksi aplikasi berskala kecil hingga menengah, karena mampu menyimpan hingga 10 juta embedding vektor. Selain itu, Milvus Standalone menawarkan ketersediaan yang tinggi melalui mode cadangan utama, sehingga sangat dapat diandalkan untuk digunakan dalam aplikasi siap produksi.</p>
<p>Kita juga dapat menggunakan Milvus Standalone, misalnya, setelah melakukan prototipe cepat dan mempelajari fungsi Milvus dengan Milvus Lite, karena Milvus Standalone dan Milvus Lite memiliki API sisi klien yang sama.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus Terdistribusi</h3><p>Milvus Distributed adalah opsi penerapan yang memanfaatkan arsitektur berbasis cloud, di mana pemasukan dan pengambilan data ditangani secara terpisah, sehingga memungkinkan aplikasi yang sangat skalabel dan efisien.</p>
<p>Untuk menjalankan Milvus Distributed, kita biasanya perlu menggunakan cluster Kubernetes agar kontainer dapat berjalan di banyak mesin dan lingkungan. Penerapan cluster Kubernetes memastikan skalabilitas dan fleksibilitas Milvus Distributed dalam menyesuaikan sumber daya yang dialokasikan tergantung pada permintaan dan beban kerja. Hal ini juga berarti bahwa jika satu bagian gagal, bagian lain dapat mengambil alih, memastikan seluruh sistem tetap tidak terganggu.</p>
<p>Milvus Distributed mampu menangani hingga puluhan miliar penyematan vektor dan dirancang khusus untuk kasus-kasus penggunaan di mana datanya terlalu besar untuk disimpan dalam satu mesin server. Oleh karena itu, opsi penerapan ini sangat cocok untuk klien Enterprise yang melayani basis pengguna yang besar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Kemampuan penyimpanan penyematan vektor dari berbagai opsi penerapan Milvus.</em></p>
<p>Pada artikel ini, kami akan menunjukkan kepada Anda cara memulai dengan Milvus Lite dan Milvus Standalone, karena Anda bisa memulai dengan cepat dengan kedua metode tersebut tanpa pengaturan yang rumit. Namun, Milvus Distributed lebih rumit untuk disiapkan. Setelah kita menyiapkan Milvus Distributed, kode dan proses logis untuk membuat koleksi, memasukkan data, melakukan pencarian vektor, dan lain-lain mirip dengan Milvus Lite dan Milvus Standalone, karena keduanya menggunakan API sisi klien yang sama.</p>
<p>Selain tiga opsi penerapan yang disebutkan di atas, Anda juga dapat mencoba Milvus terkelola di <a href="https://zilliz.com/cloud">Zilliz Cloud</a> untuk pengalaman yang lebih mudah. Kami juga akan membahas tentang Zilliz Cloud nanti di artikel ini.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Memulai dengan Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite dapat diimplementasikan langsung dengan Python dengan mengimpor pustaka bernama Pymilvus menggunakan pip. Sebelum menginstal Pymilvus, pastikan bahwa lingkungan Anda memenuhi persyaratan berikut ini:</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 dan arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 dan x86_64)</p></li>
<li><p>Python 3.7 atau yang lebih baru</p></li>
</ul>
<p>Setelah persyaratan ini terpenuhi, Anda dapat menginstal Milvus Lite dan dependensi yang diperlukan untuk demonstrasi menggunakan perintah berikut:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: Perintah ini akan menginstal atau meng-upgrade pustaka <code translate="no">pymilvus</code>, SDK Python dari Milvus. Milvus Lite dibundel dengan PyMilvus, jadi satu baris kode ini adalah semua yang Anda butuhkan untuk menginstal Milvus Lite.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: Perintah ini menambahkan fitur-fitur canggih dan alat tambahan yang sudah terintegrasi dengan Milvus, termasuk model pembelajaran mesin seperti Hugging Face Transformers, model penyematan Jina AI, dan model pemeringkatan.</p></li>
</ul>
<p>Berikut adalah langkah-langkah yang akan kita ikuti dengan Milvus Lite:</p>
<ol>
<li><p>Ubah data teks menjadi representasi penyematan menggunakan model penyematan.</p></li>
<li><p>Buat skema di database Milvus kita untuk menyimpan data teks dan representasi penyematannya.</p></li>
<li><p>Menyimpan dan mengindeks data kita ke dalam skema.</p></li>
<li><p>Lakukan pencarian vektor sederhana pada data yang tersimpan.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Alur kerja operasi pencarian vektor.</em></p>
<p>Untuk mengubah data teks menjadi penyematan vektor, kita akan menggunakan <a href="https://zilliz.com/ai-models">model penyematan</a> dari SentenceTransformers yang disebut 'all-MiniLM-L6-v2'. Model penyematan ini mengubah teks kita menjadi penyematan vektor 384 dimensi. Mari muat model, ubah data teks kita, dan kemas semuanya menjadi satu.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>Selanjutnya, mari kita buat skema untuk menyimpan semua data di atas ke dalam Milvus. Seperti yang dapat Anda lihat di atas, data kita terdiri dari tiga field: ID, vektor, dan teks. Oleh karena itu, kita akan membuat sebuah skema dengan tiga field tersebut.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, db, connections

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Dengan Milvus Lite, kita dapat dengan mudah membuat sebuah koleksi pada database tertentu berdasarkan skema yang didefinisikan di atas, serta memasukkan dan mengindeks data ke dalam koleksi tersebut hanya dalam beberapa baris kode.</p>
<pre><code translate="no">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Pada kode di atas, kita membuat koleksi bernama &quot;demo_collection&quot; di dalam database Milvus bernama &quot;milvus_demo&quot;. Selanjutnya, kita mengindeks semua data kita ke dalam "demo_collection" yang baru saja kita buat.</p>
<p>Sekarang setelah kita memiliki data di dalam database, kita dapat melakukan pencarian vektor pada data tersebut untuk setiap kueri yang diberikan. Katakanlah kita memiliki pertanyaan: &quot;<em>Siapa Alan Turing?</em>&quot;. Kita bisa mendapatkan jawaban yang paling tepat untuk kueri tersebut dengan menerapkan langkah-langkah berikut:</p>
<ol>
<li><p>Ubah kueri kita menjadi penyematan vektor menggunakan model penyematan yang sama dengan yang kita gunakan untuk mengubah data dalam database menjadi penyematan.</p></li>
<li><p>Hitung kemiripan antara sematan kueri kita dengan sematan setiap entri di dalam basis data dengan menggunakan metrik seperti kemiripan kosinus atau jarak Euclidean.</p></li>
<li><p>Ambil entri yang paling mirip sebagai jawaban yang sesuai untuk kueri kita.</p></li>
</ol>
<p>Di bawah ini adalah implementasi langkah-langkah di atas dengan Milvus:</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dan itu saja! Anda juga dapat mempelajari lebih lanjut tentang fungsi-fungsi lain yang ditawarkan Milvus, seperti mengelola pangkalan data, menyisipkan dan menghapus koleksi, memilih metode pengindeksan yang tepat, dan melakukan pencarian vektor yang lebih canggih dengan pemfilteran metadata dan pencarian hibrida di <a href="https://milvus.io/docs/">dokumentasi Milvus</a>.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Memulai dengan Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone adalah opsi penerapan di mana semuanya dikemas dalam kontainer Docker. Oleh karena itu, kita perlu menginstal Milvus di Docker dan kemudian memulai kontainer Docker untuk memulai dengan Milvus Standalone.</p>
<p>Sebelum menginstal Milvus Standalone, pastikan perangkat keras dan perangkat lunak Anda memenuhi persyaratan yang dijelaskan di <a href="https://milvus.io/docs/prerequisite-docker.md">halaman ini</a>. Selain itu, pastikan Anda telah menginstal Docker. Untuk menginstal Docker, lihat <a href="https://docs.docker.com/get-started/get-docker/">halaman ini</a>.</p>
<p>Setelah sistem kita memenuhi persyaratan dan kita telah menginstal Docker, kita dapat melanjutkan dengan instalasi Milvus di Docker menggunakan perintah berikut:</p>
<pre><code translate="no"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>Pada kode di atas, kita juga memulai kontainer Docker dan setelah dimulai, Anda akan mendapatkan keluaran serupa seperti di bawah ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Pesan setelah kontainer Docker berhasil dimulai.</em></p>
<p>Setelah menjalankan skrip instalasi "standalone_embed.sh" di atas, kontainer Docker bernama "milvus" dimulai pada port 19530. Oleh karena itu, kita dapat membuat basis data baru serta mengakses semua hal yang berkaitan dengan basis data Milvus dengan menunjuk ke port ini saat membuat koneksi.</p>
<p>Katakanlah kita ingin membuat sebuah database bernama "milvus_demo", serupa dengan apa yang telah kita lakukan di Milvus Lite di atas. Kita dapat melakukannya sebagai berikut:</p>
<pre><code translate="no">conn = connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19530</span>)
database = db.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;&lt;http://localhost:19530&gt;&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
    db_name=<span class="hljs-string">&quot;milvus_demo&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Selanjutnya, Anda dapat memverifikasi apakah database yang baru dibuat bernama "milvus_demo" benar-benar ada di dalam instans Milvus Anda dengan mengakses <a href="https://milvus.io/docs/milvus-webui.md">Milvus Web UI</a>. Seperti namanya, Milvus Web UI adalah antarmuka pengguna grafis yang disediakan oleh Milvus untuk mengamati statistik dan metrik komponen, memeriksa daftar dan detail basis data, koleksi, dan konfigurasi. Anda dapat mengakses Milvus Web UI setelah Anda memulai kontainer Docker di atas di http://127.0.0.1:9091/webui/.</p>
<p>Jika Anda mengakses tautan di atas, Anda akan melihat halaman arahan seperti ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Di bawah tab "Collections", Anda akan melihat bahwa basis data "milvus_demo" telah berhasil dibuat. Seperti yang Anda lihat, Anda juga dapat memeriksa hal-hal lain seperti daftar koleksi, konfigurasi, kueri yang telah Anda lakukan, dll., dengan UI Web ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sekarang kita dapat melakukan segala sesuatu persis seperti yang telah kita lihat di bagian Milvus Lite di atas. Mari kita buat sebuah koleksi bernama "demo_collection" di dalam database "milvus_demo" yang terdiri dari tiga field, sama seperti apa yang telah kita lihat di bagian Milvus Lite sebelumnya. Kemudian, kita akan memasukkan data kita ke dalam koleksi tersebut.</p>
<pre><code translate="no">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Kode untuk melakukan operasi pencarian vektor juga sama dengan Milvus Lite, seperti yang dapat Anda lihat pada kode di bawah ini:</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Selain menggunakan Docker, Anda juga dapat menggunakan Milvus Standalone dengan <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (untuk Linux) dan <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (untuk Windows).</p>
<p>Ketika kita tidak menggunakan instans Milvus lagi, kita dapat menghentikan Milvus Standalone dengan perintah berikut:</p>
<pre><code translate="no">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Milvus yang Dikelola Sepenuhnya<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Cara alternatif untuk memulai dengan Milvus adalah melalui infrastruktur berbasis cloud asli di <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, di mana Anda bisa mendapatkan pengalaman yang bebas repot dan 10x lebih cepat.</p>
<p>Zilliz Cloud menawarkan cluster khusus dengan lingkungan dan sumber daya khusus untuk mendukung aplikasi AI Anda. Karena ini adalah database berbasis cloud yang dibangun di atas Milvus, kami tidak perlu mengatur dan mengelola infrastruktur lokal. Zilliz Cloud juga menyediakan fitur-fitur yang lebih canggih, seperti pemisahan antara penyimpanan vektor dan komputasi, pencadangan data ke sistem penyimpanan objek yang populer seperti S3, dan cache data untuk mempercepat operasi pencarian dan pengambilan vektor.</p>
<p>Namun, satu hal yang perlu dipertimbangkan ketika mempertimbangkan layanan berbasis cloud adalah biaya operasional. Dalam banyak kasus, kita masih perlu membayar bahkan ketika cluster dalam keadaan diam tanpa ada aktivitas pengambilan data atau pencarian vektor. Jika Anda ingin mengoptimalkan biaya operasional dan kinerja aplikasi Anda lebih jauh, Zilliz Cloud Serverless akan menjadi pilihan yang tepat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Manfaat utama menggunakan Zilliz Cloud Serverless.</em></p>
<p>Zilliz Cloud Serverless tersedia di penyedia cloud utama seperti AWS, Azure, dan GCP. Ini menawarkan fitur seperti harga pay-as-you-go, yang berarti Anda hanya membayar ketika Anda menggunakan cluster.</p>
<p>Zilliz Cloud Serverless juga mengimplementasikan teknologi canggih seperti cluster logis, penskalaan otomatis, penyimpanan berjenjang, pemisahan streaming dan data historis, dan pemisahan data panas-dingin. Fitur-fitur ini memungkinkan Zilliz Cloud Serverless mencapai penghematan biaya hingga 50x lipat dan operasi pencarian vektor yang lebih cepat sekitar 10x lipat dibandingkan dengan Milvus dalam memori.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Ilustrasi penyimpanan berjenjang dan pemisahan data panas-dingin.</em></p>
<p>Jika Anda ingin memulai dengan Zilliz Cloud Serverless, lihat <a href="https://zilliz.com/serverless">halaman ini</a> untuk informasi lebih lanjut.</p>
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
    </button></h2><p>Milvus menonjol sebagai database vektor serbaguna dan kuat yang dirancang untuk memenuhi tantangan dalam mengelola data yang tidak terstruktur dan melakukan operasi pencarian vektor yang cepat dan efisien dalam aplikasi AI modern. Dengan opsi penerapan seperti Milvus Lite untuk pembuatan prototipe cepat, Milvus Standalone untuk aplikasi skala kecil hingga menengah, dan Milvus Distributed untuk skalabilitas tingkat perusahaan, Milvus menawarkan fleksibilitas yang sesuai dengan ukuran dan kompleksitas proyek apa pun.</p>
<p>Selain itu, Zilliz Cloud Serverless memperluas kemampuan Milvus ke dalam cloud dan menyediakan model pay-as-you-go yang hemat biaya sehingga tidak memerlukan infrastruktur lokal. Dengan fitur-fitur canggih seperti penyimpanan berjenjang dan penskalaan otomatis, Zilliz Cloud Serverless memastikan operasi pencarian vektor yang lebih cepat sekaligus mengoptimalkan biaya.</p>
