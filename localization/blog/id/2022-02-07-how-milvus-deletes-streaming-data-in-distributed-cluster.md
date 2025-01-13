---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: Penggunaan
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  Desain utama di balik fungsi penghapusan dalam Milvus 2.0, database vektor
  tercanggih di dunia.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Bagaimana Milvus Menghapus Data Streaming dalam Cluster Terdistribusi</custom-h1><p>Dengan menampilkan pemrosesan batch-and-stream terpadu dan arsitektur cloud-native, Milvus 2.0 memberikan tantangan yang lebih besar dibandingkan pendahulunya dalam pengembangan fungsi DELETE. Berkat desain pemilahan komputasi penyimpanan yang canggih dan mekanisme publikasi/langganan yang fleksibel, kami dengan bangga mengumumkan bahwa kami berhasil mewujudkannya. Di Milvus 2.0, anda dapat menghapus sebuah entitas di dalam koleksi tertentu dengan kunci utamanya sehingga entitas yang dihapus tidak akan lagi terdaftar di dalam hasil pencarian atau kueri.</p>
<p>Harap dicatat bahwa operasi DELETE di Milvus mengacu pada penghapusan logis, sedangkan pembersihan data secara fisik terjadi selama Pemadatan Data. Penghapusan logis tidak hanya meningkatkan kinerja pencarian yang dibatasi oleh kecepatan I/O, tetapi juga memfasilitasi pemulihan data. Data yang dihapus secara logis masih dapat diambil dengan bantuan fungsi Time Travel.</p>
<h2 id="Usage" class="common-anchor-header">Penggunaan<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita coba fungsi DELETE di Milvus 2.0 terlebih dahulu. (Contoh berikut ini menggunakan PyMilvus 2.0.0 pada Milvus 2.0.0).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Implementation" class="common-anchor-header">Implementasi<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam sebuah instance Milvus, sebuah simpul data terutama bertanggung jawab untuk mengemas data streaming (log di log broker) sebagai data historis (snapshot log) dan secara otomatis mem-flush mereka ke penyimpanan objek. Sebuah node kueri mengeksekusi permintaan pencarian pada data lengkap, yaitu data streaming dan data historis.</p>
<p>Untuk memaksimalkan kapasitas penulisan data dari node paralel dalam sebuah cluster, Milvus mengadopsi strategi sharding berdasarkan hashing kunci utama untuk mendistribusikan operasi penulisan secara merata ke node pekerja yang berbeda. Dengan kata lain, proxy akan merutekan pesan-pesan Data Manipulation Language (DML) (yaitu permintaan) dari sebuah entitas ke node data dan node kueri yang sama. Pesan-pesan ini dipublikasikan melalui DML-Channel dan dikonsumsi oleh node data dan node kueri secara terpisah untuk menyediakan layanan pencarian dan kueri secara bersamaan.</p>
<h3 id="Data-node" class="common-anchor-header">Simpul data</h3><p>Setelah menerima pesan INSERT data, simpul data menyisipkan data di segmen yang sedang tumbuh, yang merupakan segmen baru yang dibuat untuk menerima data streaming dalam memori. Jika jumlah baris data atau durasi segmen yang sedang tumbuh mencapai ambang batas, simpul data akan menyegelnya untuk mencegah masuknya data. Simpul data kemudian membuang segmen yang disegel, yang berisi data historis, ke penyimpanan objek. Sementara itu, simpul data menghasilkan filter bloom berdasarkan kunci utama dari data baru, dan membuangnya ke penyimpanan objek bersama dengan segmen yang disegel, menyimpan filter bloom sebagai bagian dari log biner statistik (binlog), yang berisi informasi statistik segmen.</p>
<blockquote>
<p>Bloom filter adalah struktur data probabilistik yang terdiri dari vektor biner panjang dan serangkaian fungsi pemetaan acak. Filter ini dapat digunakan untuk menguji apakah sebuah elemen merupakan anggota dari sebuah himpunan, tetapi mungkin menghasilkan kecocokan positif palsu.           -Wikipedia</p>
</blockquote>
<p>Ketika pesan DELETE data masuk, simpul data menyangga semua filter mekar di pecahan yang sesuai, dan mencocokkannya dengan kunci utama yang disediakan dalam pesan untuk mengambil semua segmen (dari yang tumbuh dan yang disegel) yang mungkin menyertakan entitas yang akan dihapus. Setelah menentukan segmen yang sesuai, simpul data menyangganya di memori untuk menghasilkan binlog Delta untuk merekam operasi penghapusan, dan kemudian membuang binlog tersebut bersama dengan segmen kembali ke penyimpanan objek.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>Simpul Data</span> </span></p>
<p>Karena satu pecahan hanya ditugaskan dengan satu DML-Channel, node kueri tambahan yang ditambahkan ke klaster tidak akan dapat berlangganan ke DML-Channel. Untuk memastikan bahwa semua node kueri dapat menerima pesan DELETE, node data menyaring pesan DELETE dari DML-Channel, dan meneruskannya ke Delta-Channel untuk memberi tahu semua node kueri tentang operasi penghapusan.</p>
<h3 id="Query-node" class="common-anchor-header">Node kueri</h3><p>Ketika memuat koleksi dari penyimpanan objek, node kueri pertama-tama mendapatkan titik pemeriksaan setiap pecahan, yang menandai operasi DML sejak operasi flush terakhir. Berdasarkan checkpoint tersebut, simpul kueri memuat semua segmen yang disegel bersama dengan binlog delta dan filter bloom. Dengan semua data dimuat, simpul kueri kemudian berlangganan ke DML-Channel, Delta-Channel, dan Query-Channel.</p>
<p>Jika lebih banyak pesan INSERT data datang setelah koleksi dimuat ke memori, simpul kueri pertama-tama menentukan segmen yang tumbuh sesuai dengan pesan, dan memperbarui filter bloom yang sesuai di memori untuk tujuan kueri saja. Filter bloom yang dikhususkan untuk kueri tersebut tidak akan dibuang ke penyimpanan objek setelah kueri selesai.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>Simpul Kueri</span> </span></p>
<p>Seperti disebutkan di atas, hanya sejumlah node kueri tertentu yang dapat menerima pesan DELETE dari DML-Channel, yang berarti hanya mereka yang dapat mengeksekusi permintaan DELETE di segmen yang sedang berkembang. Untuk node kueri yang telah berlangganan DML-Channel, mereka pertama-tama menyaring pesan DELETE di segmen yang sedang berkembang, menemukan entitas dengan mencocokkan kunci utama yang disediakan dengan filter bloom khusus kueri di segmen yang sedang berkembang, dan kemudian mencatat operasi penghapusan di segmen yang sesuai.</p>
<p>Node kueri yang tidak dapat berlangganan ke DML-Channel hanya diizinkan untuk memproses permintaan pencarian atau kueri pada segmen yang disegel karena mereka hanya dapat berlangganan ke Delta-Channel, dan menerima pesan-pesan HAPUS yang diteruskan oleh node data. Setelah mengumpulkan semua pesan DELETE di segmen tertutup dari Delta-Channel, node kueri menemukan entitas dengan mencocokkan kunci utama yang disediakan dengan filter mekar dari segmen tertutup, dan kemudian mencatat operasi penghapusan di segmen yang sesuai.</p>
<p>Pada akhirnya, dalam pencarian atau kueri, node kueri menghasilkan bitset berdasarkan catatan yang dihapus untuk menghilangkan entitas yang dihapus, dan mencari di antara entitas yang tersisa dari semua segmen, terlepas dari status segmen. Terakhir, tingkat konsistensi mempengaruhi visibilitas data yang dihapus. Di bawah Tingkat Konsistensi Kuat (seperti yang ditunjukkan pada contoh kode sebelumnya), entitas yang dihapus langsung tidak terlihat setelah dihapus. Sementara Tingkat Konsistensi Terbatas diadopsi, akan ada beberapa detik latensi sebelum entitas yang dihapus menjadi tidak terlihat.</p>
<h2 id="Whats-next" class="common-anchor-header">Apa selanjutnya?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam blog seri fitur baru 2.0, kami bertujuan untuk menjelaskan desain dari fitur-fitur baru. Baca lebih lanjut dalam seri blog ini!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Bagaimana Milvus Menghapus Data Streaming dalam Cluster Terdistribusi</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Bagaimana Cara Memadatkan Data di Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Bagaimana Milvus Menyeimbangkan Beban Kueri di Seluruh Node?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bagaimana Bitset Mengaktifkan Keserbagunaan Pencarian Kesamaan Vektor</a></li>
</ul>
