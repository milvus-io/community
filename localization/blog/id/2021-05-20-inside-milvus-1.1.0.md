---
id: inside-milvus-1.1.0.md
title: Fitur-fitur baru
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  Milvus v1.1.0 telah tiba! Fitur-fitur baru, peningkatan, dan perbaikan bug
  telah tersedia sekarang.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Di dalam Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a> adalah sebuah proyek perangkat lunak sumber terbuka (OSS) yang sedang berlangsung yang berfokus pada pembuatan basis data vektor tercepat dan paling andal di dunia. Fitur-fitur baru di dalam Milvus v1.1.0 adalah yang pertama dari banyak pembaruan yang akan datang, berkat dukungan jangka panjang dari komunitas sumber terbuka dan sponsor dari Zilliz. Artikel blog ini mencakup fitur-fitur baru, peningkatan, dan perbaikan bug yang disertakan dalam Milvus v1.1.0.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#new-features">Fitur-fitur baru</a></li>
<li><a href="#improvements">Peningkatan</a></li>
<li><a href="#bug-fixes">Perbaikan bug</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">Fitur-fitur baru<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti proyek OSS lainnya, Milvus adalah sebuah karya yang terus berkembang. Kami berusaha untuk mendengarkan para pengguna kami dan komunitas sumber terbuka untuk memprioritaskan fitur-fitur yang paling penting. Pembaruan terbaru, Milvus v1.1.0, menawarkan fitur-fitur baru berikut ini:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">Menentukan partisi dengan pemanggilan metode <code translate="no">get_entity_by_id()</code> </h3><p>Untuk lebih mempercepat pencarian kemiripan vektor, Milvus 1.1.0 sekarang mendukung pengambilan vektor dari partisi tertentu. Secara umum, Milvus mendukung permintaan vektor melalui ID vektor yang ditentukan. Dalam Milvus 1.0, memanggil metode <code translate="no">get_entity_by_id()</code> akan mencari seluruh koleksi, yang dapat memakan waktu untuk kumpulan data yang besar. Seperti yang bisa kita lihat dari kode di bawah ini, <code translate="no">GetVectorsByIdHelper</code> menggunakan struktur <code translate="no">FileHolder</code> untuk mengulang dan menemukan vektor tertentu.</p>
<pre><code translate="no">std::vector&lt;meta::CollectionSchema&gt; collection_array; 
 <span class="hljs-type">auto</span> <span class="hljs-variable">status</span> <span class="hljs-operator">=</span> meta_ptr_-&gt;ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_-&gt;FilesByTypeEx(collection_array, file_types, files_holder); 
 <span class="hljs-keyword">if</span> (!status.ok()) { 
     std::<span class="hljs-type">string</span> <span class="hljs-variable">err_msg</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;Failed to get files for GetVectorByID: &quot;</span> + status.message(); 
     LOG_ENGINE_ERROR_ &lt;&lt; err_msg; 
     <span class="hljs-keyword">return</span> status; 
 } 
  
 <span class="hljs-keyword">if</span> (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;No files to get vector by id from&quot;</span>; 
     <span class="hljs-keyword">return</span> Status(DB_NOT_FOUND, <span class="hljs-string">&quot;Collection is empty&quot;</span>); 
 } 
  
 cache::CpuCacheMgr::GetInstance()-&gt;PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers&amp; id_array, std::vector&lt;engine::VectorsData&gt;&amp; vectors, 
                              meta::FilesHolder&amp; files_holder) { 
     <span class="hljs-comment">// attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal </span>
     milvus::engine::meta::<span class="hljs-type">SegmentsSchema</span> <span class="hljs-variable">files</span> <span class="hljs-operator">=</span> files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;Getting vector by id in &quot;</span> &lt;&lt; files.size() &lt;&lt; <span class="hljs-string">&quot; files, id count = &quot;</span> &lt;&lt; id_array.size(); 
  
     <span class="hljs-comment">// sometimes not all of id_array can be found, we need to return empty vector for id not found </span>
     <span class="hljs-comment">// for example: </span>
     <span class="hljs-comment">// id_array = [1, -1, 2, -1, 3] </span>
     <span class="hljs-comment">// vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] </span>
     <span class="hljs-comment">// the ID2RAW is to ensure returned vector sequence is consist with id_array </span>
     <span class="hljs-type">using</span> <span class="hljs-variable">ID2VECTOR</span> <span class="hljs-operator">=</span> std::map&lt;int64_t, VectorsData&gt;; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     <span class="hljs-type">IDNumbers</span> <span class="hljs-variable">temp_ids</span> <span class="hljs-operator">=</span> id_array; 
     <span class="hljs-keyword">for</span> (auto&amp; file : files) { 
<button class="copy-code-btn"></button></code></pre>
<p>Namun, struktur ini tidak disaring oleh partisi apa pun di <code translate="no">FilesByTypeEx()</code>. Di Milvus v1.1.0, sistem dapat memberikan nama partisi kepada perulangan <code translate="no">GetVectorsIdHelper</code> sehingga <code translate="no">FileHolder</code> hanya berisi segmen-segmen dari partisi tertentu. Dengan kata lain, jika Anda mengetahui dengan pasti partisi mana vektor untuk pencarian, Anda dapat menentukan nama partisi dalam pemanggilan metode <code translate="no">get_entity_by_id()</code> untuk mempercepat proses pencarian.</p>
<p>Kami tidak hanya melakukan modifikasi pada kode yang mengendalikan kueri sistem di tingkat server Milvus, tetapi juga memperbarui semua SDK kami (Python, Go, C++, Java, dan RESTful) dengan menambahkan sebuah parameter untuk menentukan nama partisi. Sebagai contoh, pada pymilvus, definisi <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> diubah menjadi <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code>.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">Menentukan partisi dengan pemanggilan metode <code translate="no">delete_entity_by_id()</code> </h3><p>Untuk membuat manajemen vektor menjadi lebih efisien, Milvus v1.1.0 sekarang mendukung penentuan nama partisi ketika menghapus sebuah vektor dalam sebuah koleksi. Pada Milvus 1.0, vektor dalam koleksi hanya dapat dihapus berdasarkan ID. Ketika memanggil metode hapus, Milvus akan memindai semua vektor di dalam koleksi. Namun, akan jauh lebih efisien untuk memindai hanya partisi yang relevan ketika bekerja dengan kumpulan data vektor dalam jumlah jutaan, miliaran, atau bahkan triliunan. Mirip dengan fitur baru untuk menentukan partisi dengan pemanggilan metode <code translate="no">get_entity_by_id()</code>, modifikasi dibuat pada kode Milvus menggunakan logika yang sama.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">Metode baru <code translate="no">release_collection()</code></h3><p>Untuk mengosongkan memori yang digunakan Milvus untuk memuat koleksi pada saat runtime, sebuah metode baru <code translate="no">release_collection()</code> telah ditambahkan di Milvus v1.1.0 untuk secara manual membongkar koleksi tertentu dari cache.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">Perbaikan<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>Meskipun fitur-fitur baru biasanya sangat populer, penting juga untuk meningkatkan apa yang sudah kita miliki. Berikut ini adalah peningkatan dan perbaikan umum lainnya pada Milvus v1.0.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">Peningkatan kinerja pemanggilan metode <code translate="no">get_entity_by_id()</code> </h3><p>Grafik di bawah ini adalah perbandingan performa pencarian vektor antara Milvus v1.0 dan Milvus v1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Ukuran file segmen = 1024 MB <br/>Jumlah baris = 1.000.000 <br/>Redup = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">Nomor ID Kueri</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 ms</td><td style="text-align:center">2 ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 ms</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib ditingkatkan ke v0.5.0</h3><p>Milvus mengadopsi beberapa pustaka indeks yang banyak digunakan, termasuk Faiss, NMSLIB, Hnswlib, dan Annoy untuk menyederhanakan proses pemilihan jenis indeks yang tepat untuk skenario tertentu.</p>
<p>Hnswlib telah ditingkatkan dari v0.3.0 ke v0.5.0 di Milvus 1.1.0 karena adanya bug yang terdeteksi di versi sebelumnya. Selain itu, meningkatkan Hnswlib meningkatkan kinerja <code translate="no">addPoint()</code> dalam pembuatan indeks.</p>
<p>Seorang pengembang Zilliz membuat sebuah pull request (PR) untuk meningkatkan performa Hnswlib ketika membangun indeks di Milvus. Lihat <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a> untuk detailnya.</p>
<p>Grafik di bawah ini adalah perbandingan performa <code translate="no">addPoint()</code> antara Hnswlib 0.5.0 dengan PR yang diajukan:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Dataset: sift_1M (jumlah baris = 1000000, dim = 128, spasi = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16, ef_konstruksi = 100</td><td style="text-align:center">274406 ms</td><td style="text-align:center">265631 ms</td></tr>
<tr><td style="text-align:center">M = 16, ef_konstruksi = 200</td><td style="text-align:center">522411 ms</td><td style="text-align:center">499639 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">Peningkatan kinerja pelatihan indeks IVF</h3><p>Membuat indeks mencakup pelatihan, memasukkan dan menulis data ke disk. Milvus 1.1.0 meningkatkan komponen pelatihan pembuatan indeks. Bagan di bawah ini adalah perbandingan performa pelatihan indeks IVF antara Milvus 1.0 dan Milvus 1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Dataset: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">v1.0.0 (ms)</th><th style="text-align:center">v1.1.0 (ms)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ivf_flat (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">ivf_flat (nlist = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">Perbaikan bug<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami juga memperbaiki beberapa bug untuk membuat Milvus lebih stabil dan efisien ketika mengelola kumpulan data vektor. Lihat <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">Masalah yang Diperbaiki</a> untuk lebih jelasnya.</p>
