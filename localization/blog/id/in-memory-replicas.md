---
id: in-memory-replicas.md
title: >-
  Tingkatkan Throughput Pembacaan Basis Data Vektor Anda dengan Replika Dalam
  Memori
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  Gunakan replika dalam memori untuk meningkatkan throughput pembacaan dan
  pemanfaatan sumber daya perangkat keras.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul</span> </span></p>
<blockquote>
<p>Artikel ini ditulis bersama oleh <a href="https://github.com/congqixia">Congqi Xia</a> dan <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Dengan rilis resminya, Milvus 2.1 hadir dengan banyak fitur baru untuk memberikan kenyamanan dan pengalaman pengguna yang lebih baik. Meskipun konsep replika dalam memori bukanlah hal yang baru dalam dunia database terdistribusi, namun ini merupakan fitur penting yang dapat membantu Anda meningkatkan kinerja sistem dan meningkatkan ketersediaan sistem dengan cara yang mudah. Oleh karena itu, artikel ini akan menjelaskan apa itu replika in-memory dan mengapa hal ini penting, lalu memperkenalkan cara mengaktifkan fitur baru ini di Milvus, database vektor untuk AI.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">Konsep yang terkait dengan replika dalam memori</a></p></li>
<li><p><a href="#What-is-in-memory-replica">Apa yang dimaksud dengan replika dalam memori?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">Mengapa replika dalam memori penting?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Mengaktifkan replika dalam memori di database vektor Milvus</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">Konsep yang terkait dengan replika dalam memori<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum mengenal apa itu replika dalam memori dan mengapa hal ini penting, kita perlu terlebih dahulu memahami beberapa konsep yang relevan termasuk grup replika, replika pecahan, replika streaming, replika historis, dan pemimpin pecahan. Gambar di bawah ini adalah ilustrasi dari konsep-konsep ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>Konsep replika</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">Kelompok replika</h3><p>Grup replika terdiri dari beberapa <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">node kueri</a> yang bertanggung jawab untuk menangani data historis dan replika.</p>
<h3 id="Shard-replica" class="common-anchor-header">Replika pecahan</h3><p>Replika pecahan terdiri dari replika streaming dan replika historis, keduanya termasuk dalam <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">pecahan</a> yang sama (yaitu saluran DML). Beberapa replika pecahan membentuk sebuah grup replika. Dan jumlah replika pecahan yang tepat dalam grup replika ditentukan oleh jumlah pecahan dalam koleksi tertentu.</p>
<h3 id="Streaming-replica" class="common-anchor-header">Replika streaming</h3><p>Replika streaming berisi semua <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">segmen yang berkembang</a> dari saluran DML yang sama. Secara teknis, replika streaming harus dilayani oleh hanya satu simpul kueri dalam satu replika.</p>
<h3 id="Historical-replica" class="common-anchor-header">Replika historis</h3><p>Replika historis berisi semua segmen tersegel dari saluran DML yang sama. Segmen tersegel dari satu replika historis dapat didistribusikan pada beberapa node kueri dalam grup replika yang sama.</p>
<h3 id="Shard-leader" class="common-anchor-header">Pemimpin pecahan</h3><p>Shard leader adalah simpul kueri yang melayani replika streaming dalam replika pecahan.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">Apa yang dimaksud dengan replika dalam memori?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengaktifkan replika dalam memori memungkinkan Anda memuat data dalam koleksi pada beberapa node kueri sehingga Anda dapat memanfaatkan sumber daya CPU dan memori ekstra. Fitur ini sangat berguna jika Anda memiliki kumpulan data yang relatif kecil tetapi ingin meningkatkan throughput pembacaan dan meningkatkan pemanfaatan sumber daya perangkat keras.</p>
<p>Basis data vektor Milvus menyimpan satu replika untuk setiap segmen dalam memori untuk saat ini. Namun, dengan replika dalam memori, Anda dapat memiliki beberapa replikasi segmen pada node kueri yang berbeda. Ini berarti jika satu node kueri sedang melakukan pencarian pada sebuah segmen, permintaan pencarian baru yang masuk dapat ditugaskan ke node kueri lain yang menganggur karena node kueri ini memiliki replikasi segmen yang sama persis.</p>
<p>Selain itu, jika kita memiliki beberapa replika dalam memori, kita dapat mengatasi situasi ketika sebuah simpul kueri mengalami kerusakan. Sebelumnya, kita harus menunggu segmen dimuat ulang untuk melanjutkan dan mencari di simpul kueri lain. Namun, dengan replikasi in-memory, permintaan pencarian dapat dikirim ulang ke simpul kueri yang baru dengan segera tanpa harus memuat ulang data lagi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>Replikasi</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">Mengapa replikasi dalam memori penting?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Salah satu manfaat paling signifikan dari mengaktifkan replika dalam memori adalah peningkatan QPS (kueri per detik) dan throughput secara keseluruhan. Selain itu, replika beberapa segmen dapat dipertahankan dan sistem lebih tangguh dalam menghadapi kegagalan.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Mengaktifkan replika dalam memori dalam basis data vektor Milvus<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengaktifkan fitur baru replika dalam memori sangat mudah di database vektor Milvus. Yang perlu Anda lakukan hanyalah menentukan jumlah replika yang Anda inginkan ketika memuat koleksi (misalnya, memanggil <code translate="no">collection.load()</code>).</p>
<p>Pada contoh tutorial berikut, kita anggap Anda telah <a href="https://milvus.io/docs/v2.1.x/create_collection.md">membuat sebuah koleksi</a> bernama "buku" dan <a href="https://milvus.io/docs/v2.1.x/insert_data.md">memasukkan data</a> ke dalamnya. Kemudian Anda dapat menjalankan perintah berikut untuk membuat dua replika saat <a href="https://milvus.io/docs/v2.1.x/load_collection.md">memuat</a> koleksi buku.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>Anda dapat secara fleksibel memodifikasi jumlah replika pada contoh kode di atas agar sesuai dengan skenario aplikasi Anda. Kemudian Anda dapat langsung melakukan <a href="https://milvus.io/docs/v2.1.x/search.md">pencarian</a> kesamaan vektor atau <a href="https://milvus.io/docs/v2.1.x/query.md">kueri</a> pada beberapa replika tanpa menjalankan perintah tambahan apa pun. Namun, perlu dicatat bahwa jumlah maksimum replika yang diperbolehkan dibatasi oleh jumlah total memori yang dapat digunakan untuk menjalankan node kueri. Jika jumlah replika yang Anda tentukan melebihi batasan memori yang dapat digunakan, kesalahan akan dikembalikan selama pemuatan data.</p>
<p>Anda juga dapat memeriksa informasi replika dalam memori yang Anda buat dengan menjalankan <code translate="no">collection.get_replicas()</code>. Informasi grup replika dan node kueri serta pecahan yang sesuai akan dikembalikan. Berikut ini adalah contoh keluarannya.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Apa selanjutnya<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan rilis resmi Milvus 2.1, kami telah menyiapkan serangkaian blog yang memperkenalkan fitur-fitur baru. Baca lebih lanjut dalam seri blog ini:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cara Menggunakan Data String untuk Memberdayakan Aplikasi Pencarian Kemiripan Anda</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Menggunakan Milvus yang Disematkan untuk Menginstal dan Menjalankan Milvus secara Instan dengan Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Tingkatkan Throughput Pembacaan Basis Data Vektor Anda dengan Replika Dalam Memori</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus (Bagian II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Bagaimana Basis Data Vektor Milvus Memastikan Keamanan Data?</a></li>
</ul>
